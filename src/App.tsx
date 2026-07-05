import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import Cake from "./components/Cake";
import WishWheel from "./components/WishWheel";
import GiftBox from "./components/GiftBox";
import FloatingStuff from "./components/FloatingStuff";

type Step = "intro" | "cake" | "wheel" | "gift" | "finale";

const STEPS: Step[] = ["intro", "cake", "wheel", "gift", "finale"];

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const stepIndex = STEPS.indexOf(step);

  const go = (s: Step) => setStep(s);

  const bigConfetti = useCallback(() => {
    const end = Date.now() + 800;
    const colors = ["#ff6ec4", "#7873f5", "#ffd93d", "#6bcB77", "#ff9a3c"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden party-bg"
      style={{ fontFamily: "'Fredoka', sans-serif" }}
    >
      {/* soft white glow overlay for warmth */}
      <div className="pointer-events-none fixed inset-0 bg-white/20" />
      <FloatingStuff />

      {/* Progress dots */}
      <div className="fixed top-5 left-1/2 z-30 -translate-x-1/2 flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === stepIndex
                ? "w-8 bg-white shadow"
                : i < stepIndex
                ? "w-2.5 bg-white/80"
                : "w-2.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* ───────── INTRO ───────── */}
        {step === "intro" && (
          <div className="w-full max-w-md text-center animate-bounce-in">
            <div className="mb-4 text-7xl animate-wiggle inline-block">🎉</div>
            <h1
              className="mb-3 text-4xl md:text-5xl font-bold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Hey You!
            </h1>
            <p className="mb-6 text-lg font-medium text-white/90">
              I made you something. Yeah… <span className="italic">you</span>. 
              Even after everything. 😌 Let's do this properly.
            </p>

            <div className="rounded-3xl bg-white/85 backdrop-blur-md p-6 shadow-2xl border-4 border-white">
              <label className="block text-left text-sm font-semibold text-pink-600 mb-1">
                What's your name, birthday human? 🥳
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name…"
                className="w-full rounded-2xl border-2 border-pink-200 bg-pink-50/50 px-4 py-3 text-lg text-gray-700 outline-none focus:border-pink-400 focus:bg-white transition-colors"
                onKeyDown={(e) => e.key === "Enter" && go("cake")}
              />
              <button
                onClick={() => {
                  go("cake");
                  bigConfetti();
                }}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-[1.03] active:scale-95"
              >
                Let's Party! 🎂
              </button>
            </div>
          </div>
        )}

        {/* ───────── CAKE ───────── */}
        {step === "cake" && (
          <Cake
            name={name}
            onDone={() => {
              bigConfetti();
              go("wheel");
            }}
          />
        )}

        {/* ───────── WISH WHEEL ───────── */}
        {step === "wheel" && (
          <WishWheel
            onDone={(result) => {
              setWish(result);
              bigConfetti();
              go("gift");
            }}
          />
        )}

        {/* ───────── GIFT ───────── */}
        {step === "gift" && (
          <GiftBox
            onDone={() => {
              bigConfetti();
              go("finale");
            }}
          />
        )}

        {/* ───────── FINALE ───────── */}
        {step === "finale" && (
          <Finale name={name} wish={wish} onReplay={() => go("intro")} celebrate={bigConfetti} />
        )}
      </div>
    </div>
  );
}

/* ───────────────── FINALE ───────────────── */
function Finale({
  name,
  wish,
  onReplay,
  celebrate,
}: {
  name: string;
  wish: string;
  onReplay: () => void;
  celebrate: () => void;
}) {
  const [scratched, setScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const cleared = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // scratch cover
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#ff9a9e");
    grad.addColorStop(1, "#a18cd1");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 20px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ Scratch here ✨", canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = "14px Fredoka, sans-serif";
    ctx.fillText("(rub with your finger / mouse)", canvas.width / 2, canvas.height / 2 + 16);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    cleared.current += 1;
    if (cleared.current > 45 && !scratched) {
      setScratched(true);
      celebrate();
    }
  };

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div className="w-full max-w-md text-center animate-bounce-in">
      <div className="mb-3 text-6xl animate-tada inline-block">🎈🎂🎈</div>
      <h1
        className="mb-2 text-4xl font-bold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Happy Birthday{name ? `, ${name}` : ""}!
      </h1>
      <p className="mb-5 text-white/90 font-medium">
        Your wish: <span className="font-bold">{wish || "a magical year ✨"}</span>
      </p>

      <div className="rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-2xl border-4 border-white">
        <p className="text-sm font-semibold text-purple-600 mb-3">
          One last secret message… scratch it off 👇
        </p>
        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl">
          <div className="flex min-h-[130px] items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 p-5">
            <p
              className="text-lg text-gray-700 leading-snug"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "1.35rem" }}
            >
              "Whatever we were or weren't — I'm genuinely glad you exist.
              Go be ridiculously happy today. You earned it. 💛"
            </p>
          </div>
          {!scratched && (
            <canvas
              ref={canvasRef}
              width={340}
              height={130}
              className="absolute inset-0 h-full w-full cursor-grab touch-none"
              onPointerDown={(e) => {
                drawing.current = true;
                const p = pos(e);
                scratch(p.x, p.y);
              }}
              onPointerMove={(e) => {
                if (!drawing.current) return;
                const p = pos(e);
                scratch(p.x, p.y);
              }}
              onPointerUp={() => (drawing.current = false)}
              onPointerLeave={() => (drawing.current = false)}
            />
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={celebrate}
            className="flex-1 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
          >
            🎉 Celebrate!
          </button>
          <button
            onClick={onReplay}
            className="flex-1 rounded-2xl border-2 border-pink-300 bg-white px-4 py-3 font-bold text-pink-500 transition-all hover:bg-pink-50 active:scale-95"
          >
            🔁 Replay
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-white/70">Made just for you 🫶 (don't let it go to your head)</p>
    </div>
  );
}
