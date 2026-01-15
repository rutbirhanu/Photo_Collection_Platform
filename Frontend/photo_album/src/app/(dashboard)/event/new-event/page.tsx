"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createEvent} from "@/redux/eventSlice";

export default function CreateEventPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error, success } = useAppSelector(
    (state) => state.event
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createEvent(form));
  };

  // Redirect on successful event creation
  useEffect(() => {
    if (success) {
      router.push("/event");
    }
  }, [success, router, dispatch]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">
          Create New Event
        </h1>
        <p className="text-neutral-700">
          Set up your event and start collecting photos from guests.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200 rounded-2xl p-8 space-y-6 shadow"
      >
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Event Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-neutral-800">
            Event Name
          </label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Wedding of Alex & Maria"
            className="w-full p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-neutral-800">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Share moments from our special day..."
            className="w-full p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2 text-sm font-medium text-neutral-800">
            Event Date (optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
