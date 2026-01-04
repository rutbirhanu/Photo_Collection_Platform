import { QrCode, ImagePlus, Users, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Collect Event Photos <br />
            <span className="text-indigo-500">Without Any App</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            Create an event, generate a QR code, and let guests upload photos
            directly from their phones — instantly and effortlessly.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl font-medium"
            >
              Get Started
              <ArrowRight size={18} />
            </a>

            <a
              href="/pricing"
              className="inline-flex items-center gap-2 border border-neutral-700 px-8 py-4 rounded-xl font-medium"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <Step
              icon={<QrCode size={32} />}
              title="Create Event & QR Code"
              desc="Create an event in seconds and generate a unique QR code for guests."
            />
            <Step
              icon={<ImagePlus size={32} />}
              title="Guests Upload Photos"
              desc="Guests scan the QR code and upload photos directly from their gallery."
            />
            <Step
              icon={<Users size={32} />}
              title="View & Download"
              desc="All photos appear instantly in your private event gallery."
            />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-28 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Designed for Real Events
            </h2>
            <p className="text-neutral-400 mb-8">
              Stop chasing guests for photos after the event. Everything is
              collected automatically, organized, and ready.
            </p>

            <ul className="space-y-4">
              <Feature text="No app download required" />
              <Feature text="Works on any phone" />
              <Feature text="Private & secure albums" />
              <Feature text="Upload limits to prevent spam" />
            </ul>
          </div>

          <div className="rounded-3xl border border-neutral-800 p-10 bg-neutral-900">
            <ShieldCheck className="text-indigo-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Privacy First
            </h3>
            <p className="text-neutral-400">
              Only people with your QR code can upload. You stay in full control
              of every album.
            </p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-28 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Perfect For
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <UseCase title="Weddings" />
            <UseCase title="Birthdays" />
            <UseCase title="Corporate Events" />
            <UseCase title="Festivals" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-indigo-500 text-black text-center">
        <h2 className="text-4xl font-bold mb-6">
          Start Collecting Photos Today
        </h2>
        <p className="text-lg mb-10">
          Create your first event in minutes.
        </p>

        <a
          href="/signup"
          className="inline-block bg-black text-white px-10 py-4 rounded-xl font-medium"
        >
          Create Your First Event
        </a>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </footer>
    </main>
  );
}

/* -------- Components -------- */

function Step({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-400">{desc}</p>
    </div>
  );
}

function Feature({ text }) {
  return (
    <li className="flex items-center gap-3">
      <ShieldCheck size={18} className="text-indigo-500" />
      <span>{text}</span>
    </li>
  );
}

function UseCase({ title }) {
  return (
    <div className="border border-neutral-800 rounded-2xl p-6 text-center bg-neutral-900">
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}
