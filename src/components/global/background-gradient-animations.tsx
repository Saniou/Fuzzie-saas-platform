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

  // RAF-анімація — залишено як у тебе
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
        // фон тепер завжди позаду і на весь екран
        "fixed inset-0 -z-50 pointer-events-none overflow-hidden",
        containerClassName
      )}
      // усі CSS-змінні — локально в контейнері; фон — через backgroundImage
      style={{
        backgroundImage: `linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))`,
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
      {/* SVG-фільтр з фіксованим id */}
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

      {/* (опціонально) діти, як і було */}
      <div className={cn("", className)}>{children}</div>

      {/* контейнери з шарами; фільтр задаємо інлайн, без Tailwind arbitrary */}
      <div
        className="gradients-container h-full w-full"
        style={{ filter: "url(#bg-blur) blur(40px)" }}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]
              top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]
              [transform-origin:center_center] animate-first opacity-100`
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]
              top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]
              [transform-origin:calc(50%-400px)] animate-second opacity-100`
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]
              top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]
              [transform-origin:calc(50%+400px)] animate-third opacity-100`
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]
              top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]
              [transform-origin:calc(50%-200px)] animate-fourth opacity-70`
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]
              top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]
              [transform-origin:calc(50%-800px)_calc(50%+800px)] animate-fifth opacity-100`
          )}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2 opacity-70`
            )}
          />
        )}
      </div>
    </div>
  );
}
