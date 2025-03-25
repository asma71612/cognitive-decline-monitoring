from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pandas as pd
import sys
import os
import subprocess
import threading
import time
import json
import csv
import numpy as np
from pathlib import Path

# Add  parent directory of flask_api ("demo") to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from memoryVault.GeneratePoints import compute_points
from processQuest.SpeechAnalysis import (
    analyze_text,
    analyze_semantic_content_with_word_bank,
    analyze_pauses,
)

# Import gaze calibration functions
from gazeCalibration.gaze_calibration_api import (
    start_gaze_tracking,
    stop_gaze_tracking,
    collect_calibration_point,
    check_calibration_status,
    get_calibration_results
)

# Import Saccade Fixation functions (Nature's Gaze Game)
from gazeCalibration.natures_gaze_api import (
    start_saccade_game,
    get_saccade_game_status,
    get_saccade_game_results
)

app = Flask(__name__)
CORS(app) # Allows React app to communicate with this API

# Load SUBTLEXus dataset at startup
# Define the path relative to the app.py location
base_path = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current file
subtlexus_path = os.path.join(base_path, '../processQuest/SUBTLEXusExcel2007.xlsx')  # Navigate to the file
subtlexus_df = pd.read_excel(subtlexus_path)
subtlexus_df.columns = ['Word', 'FREQcount', 'CDcount', 'FREQlow', 'Cdlow', 'SUBTLWF', 'Lg10WF', 'SUBTLCD', 'Lg10CD']

@app.route('/compute-points', methods=['POST'])
def compute_points_endpoint():
    data = request.get_json()
    presented_word = data.get('presented_word')
    recalled_word = data.get('recalled_word')
    if not presented_word or not recalled_word:
        return jsonify({'error': 'Missing parameters'}), 400

    points = compute_points(presented_word, recalled_word)
    return jsonify({'points': points})

@app.route('/analyze-text', methods=['POST'])
def analyze_text_endpoint():
    data = request.get_json()

    text = data.get('transcript')
    if not text:
        return jsonify({'error': 'Missing transcript'}), 400

    audio_segments = data.get('audio_segments')
    speech_duration_minutes = None
    words_per_minute = None

    if audio_segments:
        try:
            speech_duration_minutes = float(audio_segments[-1]['end_time']) / 60
        except (KeyError, ValueError, TypeError) as e:
            return jsonify({'error': f'Invalid audio segment data: {str(e)}'}), 400

    results = analyze_text(text, subtlexus_df)

    if speech_duration_minutes:
        total_words = results.get('Total Tokens', 0)
        words_per_minute = total_words / speech_duration_minutes
        results['Speech Duration'] = round(speech_duration_minutes, 2)
        results['Words per Minute'] = round(words_per_minute, 2)

    return jsonify(results)

@app.route('/semantic-content', methods=['POST'])
def semantic_content_endpoint():
    data = request.get_json()
    
    text = data.get('transcript')
    if not text:
        return jsonify({'error': 'Missing transcript'}), 400

    word_bank = data.get('word_bank', [])
    if not isinstance(word_bank, list):
        return jsonify({'error': 'Word bank must be a list'}), 400

    try:
        audio_segments = data.get('audio_segments')
        if not audio_segments:
            return jsonify({'error': 'Missing audio segment data'}), 400

        # assuming the last segment's end_time represents total speech duration
        speech_duration = float(audio_segments[-1]['end_time'])
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({'error': f'Invalid speech duration: {str(e)}'}), 400

    results = analyze_semantic_content_with_word_bank(text, word_bank, speech_duration)

    return jsonify(results)

@app.route('/analyze-pauses', methods=['POST'])
def analyze_pauses_endpoint():
    data = request.get_json()

    full_transcription = data.get('full_transcription')

    if not full_transcription:
        return jsonify({'error': 'Missing transcript'}), 400

    pauses = analyze_pauses(full_transcription)

    return jsonify(pauses)

# Gaze Calibration Routes
@app.route('/gaze-calibration-test')
def gaze_calibration_page():
    """Serve the gaze calibration test page"""
    return render_template('gaze_calibration.html')

@app.route('/api/gaze/start', methods=['POST'])
def start_gaze_calibration():
    """Start the gaze tracking process"""
    try:
        result = start_gaze_tracking()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gaze/stop', methods=['POST'])
def stop_gaze_calibration():
    """Stop the gaze tracking process"""
    try:
        result = stop_gaze_tracking()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gaze/collect-point', methods=['POST'])
def collect_point():
    """Collect data for a calibration point"""
    data = request.get_json()
    point_key = data.get('point_key')
    x_position = data.get('x_position')
    y_position = data.get('y_position')
    
    if not all([point_key, x_position, y_position]):
        return jsonify({'error': 'Missing parameters'}), 400
    
    try:
        result = collect_calibration_point(point_key, x_position, y_position)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gaze/status', methods=['GET'])
def check_status():
    """Check the status of the calibration"""
    try:
        result = check_calibration_status()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gaze/results', methods=['GET'])
def get_results():
    """Get the calibration results"""
    try:
        result = get_calibration_results()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Nature's Gaze Game Routes
@app.route('/natures-gaze-game')
def natures_gaze_page():
    """Serve the Nature's Gaze game page"""
    return render_template('natures_gaze_game.html')

@app.route('/api/natures-gaze/start', methods=['POST'])
def start_natures_gaze():
    """Start the Nature's Gaze game process"""
    try:
        result = start_saccade_game()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/natures-gaze/status', methods=['GET'])
def check_natures_gaze_status():
    """Check the status of the Nature's Gaze game"""
    try:
        result = get_saccade_game_status()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/natures-gaze/results', methods=['GET'])
def get_natures_gaze_results():
    """Get the Nature's Gaze game results"""
    try:
        result = get_saccade_game_results()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/natures-gaze/debug', methods=['GET'])
def natures_gaze_debug():
    """Debug endpoint to check if result files exist"""
    # Get the base directory
    base_dir = Path(__file__).parent.parent
    
    # Check for trial log
    trial_log_path = base_dir / "gazeCalibration" / "saccade_output" / "saccade_trial_log.json"
    trial_log_exists = os.path.exists(trial_log_path)
    trial_log_size = os.path.getsize(trial_log_path) if trial_log_exists else 0
    
    # Check for processed data
    processed_data_path = base_dir / "gazeCalibration" / "saccade_output" / "processed_trial_data.json"
    processed_data_exists = os.path.exists(processed_data_path)
    processed_data_size = os.path.getsize(processed_data_path) if processed_data_exists else 0
    
    # List all files in the output directory
    output_dir = base_dir / "gazeCalibration" / "saccade_output"
    files_in_dir = []
    if os.path.exists(output_dir):
        files_in_dir = [
            {
                "name": f,
                "size": os.path.getsize(os.path.join(output_dir, f)) if os.path.isfile(os.path.join(output_dir, f)) else "directory",
                "type": "file" if os.path.isfile(os.path.join(output_dir, f)) else "directory"
            }
            for f in os.listdir(output_dir)
        ]
    
    # Read processed data if it exists
    processed_data_content = None
    if processed_data_exists:
        try:
            with open(processed_data_path, "r") as f:
                processed_data_content = json.load(f)
        except Exception as e:
            processed_data_content = {"error": str(e)}
    
    return jsonify({
        "trial_log": {
            "exists": trial_log_exists,
            "path": str(trial_log_path),
            "size": trial_log_size
        },
        "processed_data": {
            "exists": processed_data_exists,
            "path": str(processed_data_path),
            "size": processed_data_size,
            "content": processed_data_content
        },
        "output_directory": {
            "path": str(output_dir),
            "exists": os.path.exists(output_dir),
            "files": files_in_dir
        }
    })

# Serve static files for the calibration page
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
