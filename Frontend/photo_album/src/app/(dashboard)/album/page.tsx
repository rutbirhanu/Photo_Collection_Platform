"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchMyAlbums } from "@/redux/albumSlice";

export default function AlbumPage() {
  const dispatch = useAppDispatch();

  const { albums, loading, error } = useAppSelector(
    (state) => state.album
  );

  useEffect(() => {
    dispatch(fetchMyAlbums());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-neutral-500 text-center mt-20">
        Loading albums...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-20">
        {error}
      </p>
    );

  if (!albums || albums.length === 0)
    return (
      <p className="text-neutral-500 text-center mt-20">
        No albums found
      </p>
    );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          MyAlbums 
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((album: any) => (
            <div
              key={album.id}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-1">
                 {album.event.eventType}
              </h2>
              <p className="text-sm text-neutral-500">
                {album.uploadsUsed} photos
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
