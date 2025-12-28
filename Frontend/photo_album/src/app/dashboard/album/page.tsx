"use client";

import { useEffect, useState } from "react";
import { ImageSquare, X } from "lucide-react";

interface Photo {
  id: string;
  secureUrl: string;
  cloudinaryId: string;
}

interface Album {
  id: string;
  name: string;
  photos: Photo[];
}

export default function AlbumPage({ params }: { params: { albumId: string } }) {
  const { albumId } = params;

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/${albumId}`);
        const data = await res.json();
        setAlbum(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (loading) return <p className="text-neutral-400 text-center">Loading...</p>;
  if (!album) return <p className="text-neutral-400 text-center">Album not found</p>;

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <h1 className="text-2xl font-bold mb-4">{album.name}</h1>
      {album.photos.length === 0 ? (
        <p className="text-neutral-400">No photos uploaded yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-lg overflow-hidden group border border-neutral-800"
            >
              <img
                src={photo.secureUrl}
                alt="Uploaded"
                className="w-full h-48 object-cover"
              />
              {/* Optional: remove button */}
              <button
                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                // onClick={() => handleDelete(photo.id)}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
