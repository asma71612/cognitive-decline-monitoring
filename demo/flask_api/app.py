from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sys
import os

# Add  parent directory of flask_api ("demo") to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from memoryVault.GeneratePoints import compute_points
from processQuest.SpeechAnalysis import (
    lexical_content_with_pos_analysis_spacy,
    syntactic_complexity_analysis_spacy,
    analyze_semantic_content_with_word_bank,
    get_average_noun_frequency,
    analyze_pauses,
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

@app.route('/lexical-content', methods=['POST'])
def lexical_content_endpoint():
    data = request.get_json()
    
    text = data.get('transcript')
    if not text:
        return jsonify({'error': 'Missing parameters'}), 400
    
    try:
        audio_segments = data.get('audio_segments')
        if not audio_segments:
            return jsonify({'error': 'Missing audio segment data'}), 400

        # assuming the last segment's end_time represents total speech duration (in minutes)
        speech_duration = (float(audio_segments[-1]['end_time']))/60

    except (KeyError, ValueError, TypeError) as e:
        return jsonify({'error': f'Invalid speech duration: {str(e)}'}), 400

    results = lexical_content_with_pos_analysis_spacy(text)

    words_per_minute = results["Total Words"]/speech_duration

    if isinstance(results, set):
        results = list(results)

    response_payload = {
        'Results': results,
        'Speech Duration': round(speech_duration, 2),
        'Words per Minute': round(words_per_minute, 2)
    }

    return jsonify(response_payload)

@app.route('/syntactic-complexity', methods=['POST'])
def syntactic_complexity_endpoint():
    data = request.get_json()
    text = data.get('transcript')
    if not text:
        return jsonify({'error': 'Missing parameters'}), 400

    results = syntactic_complexity_analysis_spacy(text)
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

@app.route('/noun-frequency', methods=['POST'])
def noun_frequency_endpoint():
    data = request.get_json()
    text = data.get('transcript')

    if not text or subtlexus_df.empty:
        return jsonify({'error': 'Missing parameters'}), 400

    results = get_average_noun_frequency(text, subtlexus_df)
    return jsonify(results)

@app.route('/analyze-pauses', methods=['POST'])
def analyze_pauses_endpoint():
    data = request.get_json()

    full_transcription = data.get('full_transcription')

    if not full_transcription:
        return jsonify({'error': 'Missing transcript'}), 400

    pauses = analyze_pauses(full_transcription)

    return jsonify(pauses)

if __name__ == '__main__':
    app.run(debug=True)
