import { useMemo } from "react";

const EMOJIS = ["🎈", "🎉", "🎂", "🎁", "⭐", "💖", "🧁", "🍭", "🎀", "✨", "🌈", "🎊"];

export default function FloatingStuff() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 20 + Math.random() * 26,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 10,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute select-none"
          style={{
            left: `${it.left}%`,
            bottom: "-60px",
            fontSize: `${it.size}px`,
            animation: `rise ${it.duration}s linear ${it.delay}s infinite`,
            opacity: 0,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
