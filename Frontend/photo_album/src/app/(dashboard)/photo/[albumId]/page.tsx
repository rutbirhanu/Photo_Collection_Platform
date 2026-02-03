"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchAlbumPhotos } from "@/redux/albumSlice";
import Image from "next/image";

export default function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const dispatch = useAppDispatch();

  const { photos, loading, error } = useAppSelector(
    (state) => state.album
  );

  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbumPhotos(albumId));
    }
  }, [albumId, dispatch]);

  if (loading) return <p>Loading photos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Album Photos</h1>

      {photos.length === 0 ? (
        <p className="text-neutral-500">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo: any) => (
            <div
              key={photo.id}
              className="rounded-xl overflow-hidden border bg-white"
            >
              <Image
                src={photo.secureUrl}
                alt="Album photo"
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
