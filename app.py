from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from menu_review import MenuReviewer


app = Flask(__name__)

# Configure CORS to allow requests from any origin
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

API_KEY = "AIzaSyCCTK90t4X7SVmmFHHbwRtI8u5sk_b7DZE"

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/')
def home():
    return "Flask is running! Use /upload to upload images and /summarize to get the summary."

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    # Print complete request information
    print("Request method:", request.method)
    print("Content-Type:", request.headers.get('Content-Type', 'No Content-Type header'))
    print("Request files:", request.files)
    print("Request form:", request.form)
    print("Request data:", request.data)
    print("Is the request JSON?", request.is_json)
    
    # Check for files in the request
    if not request.files:
        return jsonify({"error": "No files found in request. Make sure you're sending a multipart/form-data request with a file"}), 400
        
    if "image" not in request.files:
        # If there are files but not with key 'image', provide more detailed error
        file_keys = list(request.files.keys())
        return jsonify({
            "error": "No image uploaded", 
            "details": f"Found files with keys {file_keys}, but 'image' key is required"
        }), 400

    image = request.files["image"]

    if image.filename == '':
        return jsonify({"error": "File selected but has no filename"}), 400

    try:
        from werkzeug.utils import secure_filename
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        print(f"Saving image to: {image_path}")
        image.save(image_path)

        return jsonify({"success": True, "image_path": image_path})
    except Exception as e:
        print("Error saving file:", str(e))
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    
#-----------------------------------------------------------
# API to summarize the menu using Gemini AI
@app.route('/summarize', methods=['POST', 'OPTIONS'])
def summarize_menu():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    data = request.json
    image_path = "menu.jpg"

    if not image_path:
        return jsonify({"error": "No image path provided"}), 400

    # Create a MenuReviewer instance
    reviewer = MenuReviewer(api_key=API_KEY, task="summarize", language="English",
                           dietary_restrictions=None, allergies=None, culture=None)
    
    # Generate menu summary
    summary = reviewer.generate_review(image_path)

    return jsonify({"summary": summary})

#-----------------------------------------------------------
# API to summarize the menu using Gemini AI
@app.route('/simple_menu', methods=['POST', 'OPTIONS'])
def simple_menu():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    data = request.json
    image_path = data.get("image_path")

    if not image_path:
        return jsonify({"error": "No image path provided"}), 400

    # Create a MenuReviewer instance
    reviewer = MenuReviewer(api_key=API_KEY, task="simple_menu", language="English",
                           dietary_restrictions=None, allergies=None, culture=None)
    
    # Generate menu summary
    simple_menu = reviewer.generate_review(image_path)

    return jsonify({"simple_menu": simple_menu})

#-----------------------------------------------------------
# API to summarize the menu using Gemini AI
@app.route('/recommendation', methods=['POST', 'OPTIONS'])
def recommendation():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    data = request.json
    image_path = data.get("image_path")

    if not image_path:
        return jsonify({"error": "No image path provided"}), 400

    # Create a MenuReviewer instance
    reviewer = MenuReviewer(api_key=API_KEY, task="recommendation", language="English",
                           dietary_restrictions=None, allergies=None, culture=None)
    
    # Generate menu summary
    recommendation = reviewer.generate_review(image_path)

    return jsonify({"recommendation": recommendation})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)