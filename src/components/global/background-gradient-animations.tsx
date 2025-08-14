"use client";

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
  containerClassName?: string;
}) {
  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden"
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

      <div>{children}</div>

      <div className="fx-container" style={{ filter: "url(#bg-blur) blur(40px)" }}>
        <div className="fx-layer fx-first  animate-first  opacity-100" />
        <div className="fx-layer fx-second animate-second opacity-100" />
        <div className="fx-layer fx-third  animate-third  opacity-100" />
        <div className="fx-layer fx-fourth animate-fourth opacity-70" />
        <div className="fx-layer fx-fifth  animate-fifth  opacity-100" />
      </div>
    </div>
  );
}
