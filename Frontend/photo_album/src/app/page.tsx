import { QrCode, ImagePlus, Users, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";


export default function HomePage() {

  const images = [
    "/festival.jpg",
    "/birthday.jpg",
    "/wedding.jpg",
    "/graduation.jpg",
    "/wedding.jpg",

  ];

  return (
    <main className="bg-white text-neutral-900">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="https://img.freepik.com/premium-photo/festive-balloons-confetti-bright-blue-background-perfect-celebrations-parties_386897-19154.jpg"
          alt="Event celebration background"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay (intentional for contrast) */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Collect Event Photos <br />
            <span className="text-indigo-400">Without Any App</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto mb-10">
            Create an event, generate a QR code, and let guests upload photos
            directly from their phones — instantly and effortlessly.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl font-medium text-white transition"
            >
              Get Started
              <ArrowRight size={18} />
            </a>

            <a
              href="/pricing"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-23 border-t border-neutral-200 bg-white">
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
      <section className="py-28 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Designed for Real Events
            </h2>
            <p className="text-neutral-600 mb-8">
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

          <div className="rounded-3xl border border-neutral-200 p-10 bg-white shadow-sm">
            <ShieldCheck className="text-indigo-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Privacy First
            </h3>
            <p className="text-neutral-600">
              Only people with your QR code can upload. You stay in full control
              of every album.
            </p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <h2 className="text-4xl pt-20 font-bold text-center mb-16">
        Perfect For
      </h2>
      <div className="flex flex-row  items-start justify-center">
        <section className="pb-50 bg-white">
          <div className="mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <UseCase title="Weddings" />
              <UseCase title="Birthdays" />
              <UseCase title="Corporate Events" />
              <UseCase title="Festivals" />
            </div>
          </div>
        </section>

        <div
          className="card-deck"
          style={{
            position: "relative",
            height: "220px",
            width: "400px",
            margin: "0 auto",
          }}
        >
          {images.map((src, i) => {
            const middle = (images.length - 1) / 2;
            const rotate = (i - middle) * 30;     // rotation angle
            const offsetX = (i - middle) * 25;    // horizontal spread

            return (
              <Image
                key={i}
                src={src}
                alt={`card-${i}`}
                width={160}
                height={200}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: `
            translateX(calc(-50% + ${offsetX}px))
            rotate(${rotate}deg)
          `,
                  transformOrigin: "bottom center",
                  zIndex: i,
                  borderRadius: "8px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                }}
              />
            );
          })}
        </div>

      </div>

      {/* CTA */}
      <section className="py-20 bg-indigo-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Start Collecting Photos Today
        </h2>
        <p className="text-lg mb-10">
          Create your first event in minutes.
        </p>

        <a
          href="/auth/signup"
          className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-medium hover:bg-neutral-100 transition"
        >
          Create Your First Event
        </a>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-neutral-500 text-sm bg-white border-t border-neutral-200">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </footer>
    </main>
  );
}

/* -------- Components -------- */

function Step({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-600">{desc}</p>
    </div>
  );
}

function Feature({ text }) {
  return (
    <li className="flex items-center gap-3 text-neutral-700">
      <ShieldCheck size={18} className="text-indigo-500" />
      <span>{text}</span>
    </li>
  );
}

function UseCase({ title }) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-6 text-center bg-white shadow-sm">
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}
