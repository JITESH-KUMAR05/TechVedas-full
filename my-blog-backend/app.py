from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure the Google Generative AI with the Gemini API key
api_key = os.getenv('SECRET_KEY')
genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-1.5-flash")
chat_session = model.start_chat(history=[])

@app.route('/get', methods=['POST'])
def get_response():
    try:
        msg = request.form['msg']
        response = chat_session.send_message(msg)
        return jsonify(response=response.text)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    port = int(os.environ.get("PPORT", 5001))
    app.run(host="0.0.0.0", port=port)