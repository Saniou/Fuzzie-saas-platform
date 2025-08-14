"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(0, 0, 0)",
  gradientBackgroundEnd = "rgb(0, 0, 0)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  // RAF-анімація — як у тебе
  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (interactiveRef.current) {
        setCurX((prev) => prev + (tgX - prev) / 20);
        setCurY((prev) => prev + (tgY - prev) / 20);
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [tgX, tgY, curX, curY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  return (
    <div
      className={cn(
        // справжній бекграунд, завжди за всім
        "fixed inset-0 -z-50 pointer-events-none overflow-hidden",
        containerClassName
      )}
      // передаємо всі змінні ЛОКАЛЬНО, без document.body
      style={{
        backgroundImage: `linear-gradient(40deg, var(--gradient-background-start), var(--gradient-background-end))`,
        ["--gradient-background-start" as any]: gradientBackgroundStart,
        ["--gradient-background-end" as any]: gradientBackgroundEnd,
        ["--first-color" as any]: firstColor,
        ["--second-color" as any]: secondColor,
        ["--third-color" as any]: thirdColor,
        ["--fourth-color" as any]: fourthColor,
        ["--fifth-color" as any]: fifthColor,
        ["--pointer-color" as any]: pointerColor,
        ["--size" as any]: size,
        ["--blending-value" as any]: blendingValue,
      }}
    >
      {/* Глобальний фільтр з фіксованим id */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="bg-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* опційні діти */}
      <div className={cn("", className)}>{children}</div>

      {/* контейнери шарів, тепер без arbitrary-класів */}
      <div
        className="fx-container"
        style={{ filter: "url(#bg-blur) blur(40px)" }}
        onMouseMove={interactive ? handleMouseMove : undefined}
      >
        <div className="fx-layer fx-first  animate-first  opacity-100" />
        <div className="fx-layer fx-second animate-second opacity-100" />
        <div className="fx-layer fx-third  animate-third  opacity-100" />
        <div className="fx-layer fx-fourth animate-fourth opacity-70" />
        <div className="fx-layer fx-fifth  animate-fifth  opacity-100" />

        {interactive && (
          <div
            ref={interactiveRef}
            className="absolute w-full h-full -top-1/2 -left-1/2 fx-pointer opacity-70"
            style={{ mixBlendMode: "var(--blending-value)" }}
          />
        )}
      </div>
    </div>
  );
}
