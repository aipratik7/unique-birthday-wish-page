import { useState, useRef, useEffect, useCallback } from "react";

const CANDLE_COUNT = 5;

export default function Cake({ name, onDone }: { name: string; onDone: () => void }) {
  const [lit, setLit] = useState<boolean[]>(Array(CANDLE_COUNT).fill(true));
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const remaining = lit.filter(Boolean).length;

  const blowOne = useCallback(() => {
    setLit((prev) => {
      const idx = prev.findIndex((l) => l);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = false;
      return next;
    });
  }, []);

  const blowAll = useCallback(() => setLit(Array(CANDLE_COUNT).fill(false)), []);

  // fire onDone when all out
  useEffect(() => {
    if (remaining === 0) {
      const t = setTimeout(onDone, 1400);
      return () => clearTimeout(t);
    }
  }, [remaining, onDone]);

  // mic blow detection
  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicActive(true);
      let blowingFrames = 0;

      const loop = () => {
        analyser.getByteFrequencyData(data);
        // low-frequency energy = blowing
        let sum = 0;
        for (let i = 0; i < 30; i++) sum += data[i];
        const avg = sum / 30;
        if (avg > 90) {
          blowingFrames++;
          if (blowingFrames > 3) {
            blowOne();
            blowingFrames = 0;
          }
        } else {
          blowingFrames = Math.max(0, blowingFrames - 1);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      setMicError(true);
    }
  }, [blowOne]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <div className="w-full max-w-md text-center animate-bounce-in">
      <h2
        className="mb-1 text-3xl md:text-4xl font-bold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Make a Wish{name ? `, ${name}` : ""}!
      </h2>
      <p className="mb-6 text-white/90 font-medium">
        {remaining > 0
          ? micActive
            ? "🎤 Blow into your mic to put them out!"
            : "Blow out the candles 🎂"
          : "🎉 You did it! Wish granted!"}
      </p>

      <div className="rounded-[2rem] bg-white/85 backdrop-blur-md p-8 pb-10 shadow-2xl border-4 border-white">
        {/* Candles */}
        <div className="flex justify-center items-end gap-3 mb-[-6px] relative z-10">
          {lit.map((isLit, i) => (
            <button
              key={i}
              onClick={blowOne}
              className="flex flex-col items-center focus:outline-none group"
              aria-label="candle"
            >
              {/* flame */}
              <div className="h-6 flex items-end justify-center">
                {isLit ? (
                  <div className="relative">
                    <div
                      className="w-3 h-5 rounded-full animate-flicker"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 70%, #fff 0%, #ffe259 30%, #ff9a3c 65%, #ff5f6d 100%)",
                        boxShadow: "0 0 12px 4px rgba(255,180,60,0.7)",
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-[2px] h-2 bg-gray-400 opacity-60" />
                )}
              </div>
              {/* wax */}
              <div
                className={`w-3 h-12 rounded-t-sm transition-opacity ${
                  isLit ? "" : "opacity-90"
                }`}
                style={{
                  background: `repeating-linear-gradient(45deg, ${
                    ["#ff6ec4", "#7873f5", "#ffd93d", "#6bcB77", "#ff9a3c"][i]
                  } 0 6px, #fff 6px 10px)`,
                }}
              />
            </button>
          ))}
        </div>

        {/* Cake body */}
        <div className="relative mx-auto w-56">
          {/* top layer with drips */}
          <div className="relative h-16 rounded-t-2xl bg-gradient-to-b from-pink-300 to-pink-400 shadow-inner">
            <div className="absolute -top-1 left-0 right-0 flex justify-around px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-white"
                  style={{ marginTop: `${(i % 2) * 4}px` }}
                />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-2 flex justify-around">
              {["🍓", "🫐", "🍒", "🍓", "🫐"].map((f, i) => (
                <span key={i} className="text-sm">{f}</span>
              ))}
            </div>
          </div>
          {/* bottom layer */}
          <div className="h-16 rounded-b-2xl bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold tracking-widest text-sm drop-shadow">
              ✿ ❀ ✿ ❀ ✿
            </span>
          </div>
          {/* plate */}
          <div className="mx-auto mt-1 h-3 w-64 -translate-x-4 rounded-full bg-white/70 shadow-lg" />
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-3">
          {remaining > 0 ? (
            <>
              {!micActive && !micError && (
                <button
                  onClick={startMic}
                  className="rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
                >
                  🎤 Use Mic to Blow!
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={blowOne}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
                >
                  💨 Blow One ({remaining})
                </button>
                <button
                  onClick={blowAll}
                  className="rounded-2xl border-2 border-pink-300 bg-white px-4 py-3 font-bold text-pink-500 transition-all hover:bg-pink-50 active:scale-95"
                >
                  Blow All 🌬️
                </button>
              </div>
              {micError && (
                <p className="text-xs text-purple-500">
                  Mic blocked — no worries, just tap the candles! 😊
                </p>
              )}
            </>
          ) : (
            <div className="text-4xl animate-tada">🥳✨🎊</div>
          )}
        </div>
      </div>
    </div>
  );
}
