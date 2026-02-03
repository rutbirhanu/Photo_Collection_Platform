"use client";

import { Plus, QrCode, Images, Calendar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchEvents } from "@/redux/eventSlice";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";

/* ------------------ Mock fallback ------------------ */
const mockEvents = [
  {
    id: "1",
    name: "John & Sarah Wedding",
    date: "2025-06-12",
    albums: [{ id: "a1", name: "Guest Uploads", photos: 124, publicToken: "mock" }],
  },
];

/* ------------------ Page ------------------ */
export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.event);

  const [qrToken, setQrToken] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  /* ------------------ Normalize backend → UI ------------------ */
  const normalizedEvents =
    events && events.length > 0
      ? events.map((e: any) => ({
        id: e.id,
        name: e.eventType,
        date: new Date(e.createdAt).toISOString().split("T")[0],
        albums: (e.albums || []).map((a: any) => ({
          id: a.id,
          name: "Guest Uploads",
          photos: a.uploadsUsed ?? 0,
          publicToken: a.publicToken,
        })),
      }))
      : mockEvents;

  console.log(events);
  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-900">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Your Events</h1>
          <p className="text-neutral-600">
            Create events and collect photos via QR codes
          </p>
        </div>

        <a
          href="/event/new-event"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-lg font-medium text-white"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </a>
      </div>

      {/* ---------------- States ---------------- */}
      {loading && <p className="text-center">Loading events…</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* ---------------- Events ---------------- */}
      <div className="space-y-8 max-w-5xl">
        {normalizedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-neutral-200 rounded-2xl p-6"
          >
            {/* Event Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
              </div>

              {/* QR button → uses first album */}
              {event.albums[0] && (
                <button
                  onClick={() => setQrToken(event.albums[0].publicToken)}
                  className="flex items-center gap-2 text-indigo-500 hover:underline"
                >
                  <QrCode className="w-5 h-5" />
                  View QR
                </button>
              )}
            </div>

            {/* Albums */}
            <div className="grid sm:grid-cols-2 gap-4">
              {event.albums.map((album: any) => (
                <Link
                  key={album.id}
                  href={`/photo/${album.id}`}
                  className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border"
                >
                  <div className="flex items-center gap-3">
                    <Images className="w-5 h-5 text-neutral-500" />
                    <span className="font-medium">{album.name}</span>
                  </div>
                  <span className="text-sm text-neutral-600">
                    {album.photos} photos
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- QR Modal ---------------- */}
      {qrToken && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[320px] text-center relative">
            <button
              onClick={() => setQrToken(null)}
              className="absolute top-3 right-3 text-neutral-500"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Scan to upload photos
            </h3>

            <QRCodeCanvas
              value={`http://localhost:3000/upload/${qrToken}`}
              size={200}
            />


            <p className="text-sm text-neutral-500 mt-4">
              Guests can scan this QR to upload photos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
