from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add  parent directory of flask_api ("demo") to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from memoryVault.GeneratePoints import compute_points

app = Flask(__name__)
CORS(app) # Allows React app to communicate with this API

@app.route('/compute-points', methods=['POST'])
def compute_points_endpoint():
    data = request.get_json()
    presented_word = data.get('presented_word')
    recalled_word = data.get('recalled_word')
    if not presented_word or not recalled_word:
        return jsonify({'error': 'Missing parameters'}), 400

    points = compute_points(presented_word, recalled_word)
    return jsonify({'points': points})

if __name__ == '__main__':
    app.run(debug=True)
