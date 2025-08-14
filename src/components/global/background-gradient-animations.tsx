"use client";

export default function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(6, 6, 10)",
  gradientBackgroundEnd = "rgb(10, 10, 16)",
  firstColor = "18, 113, 255",   
  secondColor = "221, 74, 255",  
  thirdColor = "100, 220, 255",  
  fourthColor = "200, 50, 50",   
  fifthColor = "180, 180, 50",   
  pointerColor = "140, 100, 255",
  size = "60%",                  // менше, ніж 80%, але більше, ніж 48%
  blendingValue = "hard-light",
  children,
  className,
  containerClassName,
}: any) {
  const baseLayer: React.CSSProperties = {
    position: "absolute",
    width: "var(--size)",
    height: "var(--size)",
    top: "calc(50% - var(--size)/2)",
    left: "calc(50% - var(--size)/2)",
    mixBlendMode: "var(--blending-value)" as any,
  };

  return (
    <div
      className={`fixed inset-0 -z-50 overflow-hidden ${containerClassName ?? ""}`}
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

      <div className={className}>{children}</div>

      <div style={{ height: "100%", width: "100%", position: "relative", filter: "url(#bg-blur) blur(32px)" }}>
        <div
          style={{
            ...baseLayer,
            background:
              "radial-gradient(circle at center, rgba(var(--first-color), 0.55) 0%, rgba(var(--first-color), 0.0) 42%)",
            transformOrigin: "center center",
            animation: "moveVertical 30s ease infinite",
          }}
        />
        <div
          style={{
            ...baseLayer,
            background:
              "radial-gradient(circle at center, rgba(var(--second-color), 0.5) 0%, rgba(var(--second-color), 0.0) 46%)",
            transformOrigin: "calc(50% - 420px)",
            animation: "moveInCircle 22s reverse infinite",
          }}
        />
        <div
          style={{
            ...baseLayer,
            background:
              "radial-gradient(circle at center, rgba(var(--third-color), 0.45) 0%, rgba(var(--third-color), 0.0) 44%)",
            transformOrigin: "calc(50% + 460px)",
            animation: "moveInCircle 38s linear infinite",
          }}
        />
        <div
          style={{
            ...baseLayer,
            background:
              "radial-gradient(circle at center, rgba(var(--fourth-color), 0.4) 0%, rgba(var(--fourth-color), 0.0) 45%)",
            transformOrigin: "calc(50% - 260px)",
            animation: "moveHorizontal 36s ease infinite",
          }}
        />
        <div
          style={{
            ...baseLayer,
            background:
              "radial-gradient(circle at center, rgba(var(--fifth-color), 0.35) 0%, rgba(var(--fifth-color), 0.0) 40%)",
            transformOrigin: "calc(50% - 820px) calc(50% + 820px)",
            animation: "moveInCircle 24s ease infinite",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(110% 80% at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <style jsx global>{`
        @keyframes moveHorizontal {
          0% { transform: translateX(-50%) translateY(-10%); }
          50% { transform: translateX(50%) translateY(10%); }
          100% { transform: translateX(-50%) translateY(-10%); }
        }
        @keyframes moveInCircle {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes moveVertical {
          0% { transform: translateY(-50%); }
          50% { transform: translateY(50%); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
