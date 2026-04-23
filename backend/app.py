from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
DATA_FILE = 'data.json'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                return data.get('files_db', {}), data.get('share_db', {})
        except:
            return {}, {}
    return {}, {}

def save_data():
    with open(DATA_FILE, 'w') as f:
        json.dump({'files_db': files_db, 'share_db': share_db}, f, indent=4)

files_db, share_db = load_data()

# ====================== UPLOAD ======================
@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_id = str(uuid.uuid4())
    filename = file.filename
    filepath = os.path.join(UPLOAD_FOLDER, f"{file_id}_{filename}")
    file.save(filepath)

    password = request.form.get('password', '').strip()
    expiry_days = int(request.form.get('expiry', 7))
    download_limit = int(request.form.get('limit', 5))

    files_db[file_id] = {
        "id": file_id,
        "filename": filename,
        "filepath": filepath,
        "password": password,
        "expiry": (datetime.now() + timedelta(days=expiry_days)).isoformat(),
        "download_limit": download_limit,
        "downloads": 0,
        "upload_time": datetime.now().isoformat(),
        "file_size": os.path.getsize(filepath)
    }

    share_id = str(uuid.uuid4())[:8]
    share_db[share_id] = file_id
    save_data()

    return jsonify({
        "share_url": f"http://localhost:5173/share/{share_id}",
        "share_id": share_id,
        "message": "File uploaded successfully!"
    })

# ====================== MY FILES ======================
@app.route('/api/myfiles', methods=['GET'])
def my_files():
    result = []
    for file_id, file_data in files_db.items():
        share_id = next((sid for sid, fid in share_db.items() if fid == file_id), None)
        file_copy = file_data.copy()
        file_copy['share_id'] = share_id
        result.append(file_copy)
    
    result.sort(key=lambda x: x.get('upload_time', ''), reverse=True)
    return jsonify(result)

# ====================== DOWNLOAD OWN FILE ======================
@app.route('/api/files/<file_id>/download', methods=['GET'])
def download_own_file(file_id):
    if file_id not in files_db:
        return jsonify({"error": "File not found"}), 404

    file_info = files_db[file_id]
    if file_info.get("password"):
        return jsonify({"error": "Password required"}), 403

    return send_from_directory(
        directory=UPLOAD_FOLDER,
        path=os.path.basename(file_info["filepath"]),
        as_attachment=True,
        download_name=file_info["filename"]
    )

# ====================== SHARED DOWNLOAD ======================
@app.route('/api/download/<share_id>', methods=['POST'])
def download_shared(share_id):
    if share_id not in share_db:
        return jsonify({"error": "Invalid link"}), 404

    file_id = share_db[share_id]
    if file_id not in files_db:
        return jsonify({"error": "File not found"}), 404

    file_info = files_db[file_id]

    if datetime.now() > datetime.fromisoformat(file_info["expiry"]):
        return jsonify({"error": "Link expired"}), 410

    data = request.get_json() or {}
    entered = data.get("password", "")

    if file_info.get("password") and entered != file_info["password"]:
        return jsonify({"error": "Wrong password"}), 401

    if file_info["download_limit"] != 0 and file_info["downloads"] >= file_info["download_limit"]:
        return jsonify({"error": "Download limit reached"}), 429

    file_info["downloads"] += 1
    save_data()

    return send_from_directory(
        directory=UPLOAD_FOLDER,
        path=os.path.basename(file_info["filepath"]),
        as_attachment=True,
        download_name=file_info["filename"]
    )

# ====================== DELETE ======================
@app.route('/api/delete/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    if file_id not in files_db:
        return jsonify({"error": "File not found"}), 404

    filepath = files_db[file_id]['filepath']
    if os.path.exists(filepath):
        os.remove(filepath)

    del files_db[file_id]

    for sid in list(share_db.keys()):
        if share_db[sid] == file_id:
            del share_db[sid]

    save_data()
    return jsonify({"message": "File deleted successfully"})

if __name__ == '__main__':
    print("🚀 Backend running on http://localhost:5000")
    app.run(port=5000, debug=True)