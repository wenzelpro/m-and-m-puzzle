from flask import Flask, send_file
import os

app = Flask(__name__)

# Serve the main page
@app.route('/')
def index():
    return send_file('index.html')

# Serve static files like JS, CSS, and images
@app.route('/<path:filename>')
def serve_static(filename):
    try:
        return send_file(filename)
    except Exception as e:
        return f"File not found: {filename}", 404

# Ensure the app runs on the port Heroku provides
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port)
