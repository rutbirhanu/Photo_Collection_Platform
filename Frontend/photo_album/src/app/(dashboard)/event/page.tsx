"use client";

import { Plus, QrCode, Images, Calendar } from "lucide-react";

const mockEvents = [
  {
    id: "1",
    name: "John & Sarah Wedding",
    date: "2025-06-12",
    albums: [{ id: "a1", name: "Guest Uploads", photos: 124 }],
  },
  {
    id: "2",
    name: "Company Retreat",
    date: "2025-08-03",
    albums: [{ id: "a2", name: "Team Photos", photos: 78 }],
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Your Events</h1>
          <p className="text-neutral-600">
            Create events and collect photos via QR codes
          </p>
        </div>

        <a
          href="/event/new-event"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-lg font-medium text-white transition"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </a>
      </div>

      {/* Events */}
      <div className="space-y-8 max-w-5xl">
        {mockEvents.map((event) => (
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

              <button className="flex items-center gap-2 text-indigo-500 hover:underline">
                <QrCode className="w-5 h-5" />
                View QR
              </button>
            </div>

            {/* Albums */}
            <div className="grid sm:grid-cols-2 gap-4">
              {event.albums.map((album) => (
                <a
                  key={album.id}
                  href={`/dashboard/albums/${album.id}`}
                  className="flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 p-4 rounded-xl transition border border-neutral-200"
                >
                  <div className="flex items-center gap-3">
                    <Images className="w-5 h-5 text-neutral-500" />
                    <span className="font-medium">{album.name}</span>
                  </div>
                  <span className="text-sm text-neutral-600">
                    {album.photos} photos
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
