import { useState } from "react";

const WISHES = [
  { label: "Endless Cake 🍰", color: "#ff6ec4" },
  { label: "Zero Bad Days 🌈", color: "#7873f5" },
  { label: "Rich This Year 💰", color: "#ffd93d" },
  { label: "Big Adventures ✈️", color: "#6bcB77" },
  { label: "So Much Love 💖", color: "#ff9a3c" },
  { label: "Glow Up ✨", color: "#4dd0e1" },
  { label: "Good Vibes Only 😎", color: "#f06292" },
  { label: "All Your Dreams 🌟", color: "#9575cd" },
];

export default function WishWheel({ onDone }: { onDone: (result: string) => void }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const seg = 360 / WISHES.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const winner = Math.floor(Math.random() * WISHES.length);
    const spins = 5 + Math.floor(Math.random() * 3);
    // pointer at top (0deg). Want winner center under pointer.
    const target = spins * 360 + (360 - (winner * seg + seg / 2));
    const final = rotation + target;
    setRotation(final);
    setTimeout(() => {
      setSpinning(false);
      setResult(WISHES[winner].label);
    }, 4200);
  };

  return (
    <div className="w-full max-w-md text-center animate-bounce-in">
      <h2
        className="mb-1 text-3xl md:text-4xl font-bold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Spin Your Wish!
      </h2>
      <p className="mb-6 text-white/90 font-medium">
        The universe picks your birthday blessing 🔮
      </p>

      <div className="rounded-[2rem] bg-white/85 backdrop-blur-md p-6 shadow-2xl border-4 border-white">
        <div className="relative mx-auto w-64 h-64">
          {/* pointer */}
          <div className="absolute left-1/2 -top-2 z-20 -translate-x-1/2">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
          </div>

          {/* wheel */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4.2s cubic-bezier(0.15,0.9,0.25,1)" : "none",
            }}
          >
            {WISHES.map((w, i) => {
              const start = (i * seg - 90) * (Math.PI / 180);
              const end = ((i + 1) * seg - 90) * (Math.PI / 180);
              const x1 = 100 + 100 * Math.cos(start);
              const y1 = 100 + 100 * Math.sin(start);
              const x2 = 100 + 100 * Math.cos(end);
              const y2 = 100 + 100 * Math.sin(end);
              const mid = (i * seg + seg / 2 - 90) * (Math.PI / 180);
              const tx = 100 + 60 * Math.cos(mid);
              const ty = 100 + 60 * Math.sin(mid);
              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                    fill={w.color}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="#fff"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${i * seg + seg / 2}, ${tx}, ${ty})`}
                  >
                    {w.label.split(" ").slice(-1)[0]}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="14" fill="#fff" stroke="#ff6ec4" strokeWidth="3" />
          </svg>
        </div>

        {result && (
          <div className="mt-5 animate-bounce-in">
            <p className="text-sm text-gray-500">You got:</p>
            <p className="text-2xl font-bold rainbow-text">{result}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {!result ? (
            <button
              onClick={spin}
              disabled={spinning}
              className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-60"
            >
              {spinning ? "Spinning… 🌀" : "🎯 SPIN!"}
            </button>
          ) : (
            <button
              onClick={() => onDone(result)}
              className="rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
            >
              Love it! Next 🎁
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
