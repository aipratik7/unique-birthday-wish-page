import { useState } from "react";

const GIFTS = [
  { emoji: "🎧", text: "A playlist of songs that are secretly about you." },
  { emoji: "🧁", text: "Unlimited dessert privileges. Doctor's note included." },
  { emoji: "🌻", text: "A whole field of flowers, minus the allergies." },
  { emoji: "🐶", text: "A puppy. Okay, a virtual one. But it loves you." },
  { emoji: "🏝️", text: "A tropical vacation… in your imagination for now." },
  { emoji: "⭐", text: "A star named after you. It's up there. Somewhere." },
];

export default function GiftBox({ onDone }: { onDone: () => void }) {
  const [shakes, setShakes] = useState(0);
  const [opened, setOpened] = useState(false);
  const [gift] = useState(() => GIFTS[Math.floor(Math.random() * GIFTS.length)]);
  const [shaking, setShaking] = useState(false);

  const handleShake = () => {
    if (opened) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
    const next = shakes + 1;
    setShakes(next);
    if (next >= 3) setTimeout(() => setOpened(true), 400);
  };

  return (
    <div className="w-full max-w-md text-center animate-bounce-in">
      <h2
        className="mb-1 text-3xl md:text-4xl font-bold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        A Gift For You!
      </h2>
      <p className="mb-6 text-white/90 font-medium">
        {opened ? "Ta-daa! Hope you like it 😄" : "Shake it 3 times to open! 🎁"}
      </p>

      <div className="rounded-[2rem] bg-white/85 backdrop-blur-md p-8 shadow-2xl border-4 border-white">
        {!opened ? (
          <button
            onClick={handleShake}
            className={`mx-auto block ${shaking ? "animate-shake-hard" : "animate-float"}`}
          >
            <div className="relative w-40 h-40 mx-auto">
              {/* box */}
              <div className="absolute bottom-0 w-40 h-28 rounded-xl bg-gradient-to-b from-pink-400 to-pink-500 shadow-xl" />
              {/* vertical ribbon */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-28 bg-yellow-300" />
              {/* lid */}
              <div className="absolute top-8 w-44 -left-2 h-10 rounded-lg bg-gradient-to-b from-purple-400 to-purple-500 shadow-lg" />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-10 bg-yellow-300 z-10" />
              {/* bow */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-4xl z-20">🎀</div>
            </div>
          </button>
        ) : (
          <div className="animate-bounce-in py-4">
            <div className="text-7xl mb-4 animate-tada inline-block">{gift.emoji}</div>
            <p
              className="text-xl text-gray-700 px-2"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "1.5rem" }}
            >
              {gift.text}
            </p>
          </div>
        )}

        <div className="mt-6">
          {!opened ? (
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-all ${
                    i < shakes ? "bg-pink-500 scale-110" : "bg-pink-200"
                  }`}
                />
              ))}
            </div>
          ) : (
            <button
              onClick={onDone}
              className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
            >
              One More Thing… ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
