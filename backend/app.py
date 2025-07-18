from flask import Flask, request, jsonify
from flask_cors import CORS
from statement_processor import process_statement
import os

app = Flask(__name__)
CORS(app)

@app.route('/process_statement', methods=['POST'])
def process_statement_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        # Save the file temporarily
        filepath = os.path.join("temp", file.filename)
        os.makedirs("temp", exist_ok=True)
        file.save(filepath)
        
        # Process the file
        result = process_statement(filepath)
        
        # Clean up the temporary file
        os.remove(filepath)
        
        return result, 200

if __name__ == '__main__':
    app.run(debug=True)
