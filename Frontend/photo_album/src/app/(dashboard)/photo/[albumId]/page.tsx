"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchAlbumPhotos, deletePhoto } from "@/redux/photoSlice";
import Image from "next/image";
import { Trash2, X } from "lucide-react";

export default function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const dispatch = useAppDispatch();

  const { photos, loading, error, deletingPhotoId } =
    useAppSelector((state) => state.photo);

  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbumPhotos(albumId));
    }
  }, [albumId, dispatch]);

  const confirmDelete = async () => {
    if (!photoToDelete) return;

    try {
      await dispatch(deletePhoto(photoToDelete)).unwrap();
      setPhotoToDelete(null);
    } catch (err: any) {
      alert(err || "Failed to delete photo");
    }
  };

  if (loading) return <p className="p-6">Loading photos...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Album Photos</h1>

      {photos.length === 0 ? (
        <p className="text-neutral-500">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden border bg-white"
            >
              <Image
                src={photo.secureUrl}
                alt="Album photo"
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />

              <button
                onClick={() => setPhotoToDelete(photo.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delete Photo</h2>
              <button onClick={() => setPhotoToDelete(null)}>
                <X />
              </button>
            </div>

            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this photo? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingPhotoId === photoToDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deletingPhotoId === photoToDelete
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}