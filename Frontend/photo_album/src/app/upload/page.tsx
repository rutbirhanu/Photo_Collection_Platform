"use client";

import { useState } from "react";
import {
  ImagePlus,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

export default function UploadPage({
  params,
}: {
  params: { publicToken: string };
}) {
  const { publicToken } = params;

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/albums/${publicToken}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setSuccess(true);
      setFiles([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 text-neutral-900">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-neutral-200">
        <h1 className="text-2xl font-bold text-center mb-2">
          Upload your photos
        </h1>
        <p className="text-sm text-neutral-500 text-center mb-6">
          Add your memories to this event album
        </p>

        {/* File picker */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition">
          <ImagePlus className="w-10 h-10 text-neutral-400 mb-2" />
          <span className="text-sm text-neutral-500 text-center">
            Tap to select photos
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleSelect}
          />
        </label>

        {/* Preview Grid */}
        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3 max-h-40 overflow-y-auto">
            {files.map((file, index) => {
              const preview = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-neutral-200"
                >
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-20 object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-100 group-hover:opacity-50 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 mt-4">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 text-green-600 mt-4">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">Upload successful. Thank you!</span>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
        >
          <UploadCloud className="w-5 h-5" />
          {uploading
            ? "Uploading..."
            : `Upload ${files.length} photo${files.length > 1 ? "s" : ""
            }`}
        </button>
      </div>
    </div>
  );
}
