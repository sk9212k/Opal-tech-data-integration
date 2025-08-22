import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// (Keeping your existing MIME filter for now; we'll enhance in SMS-11)
const allowedTypes = ["application/xml", "text/csv", "application/json"];

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const valid = acceptedFiles.filter(file => allowedTypes.includes(file.type));
    setFiles(valid);

    if (valid.length !== acceptedFiles.length) {
      setMessage("Some files were rejected. Only XML, CSV, and JSON are allowed.");
    } else {
      setMessage("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    try {
      // ✅ Send each file individually as "file" to /api/FileUpload/upload
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f); // must be singular to match IFormFile file

        await axios.post("/api/FileUpload/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage(`✅ Uploaded ${files.length} file(s) successfully.`);
      setFiles([]);
    } catch (err) {
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragActive ? "bg-blue-50" : "bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop or click to select XML, CSV, or JSON files</p>
        )}
      </div>

      <ul className="mt-4 text-sm text-gray-700">
        {files.map((file, i) => (
          <li key={i}>📄 {file.name}</li>
        ))}
      </ul>

      <button
        onClick={handleUpload}
        disabled={!files.length || uploading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-3 text-sm text-gray-800">{message}</p>}
    </div>
  );
}
