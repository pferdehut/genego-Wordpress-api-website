export function WavyLine({
  className = "",
  orientation = "horizontal",
}: { className?: string; orientation?: "horizontal" | "vertical" }) {
  if (orientation === "vertical") {
    return (
      <svg
        className={className}
        width="4"
        height="100%"
        viewBox="0 0 4 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M2 0 Q 0.5 2.5, 2 5 T 2 10 T 2 15 T 2 20 T 2 25 T 2 30 T 2 35 T 2 40 T 2 45 T 2 50 T 2 55 T 2 60 T 2 65 T 2 70 T 2 75 T 2 80 T 2 85 T 2 90 T 2 95 T 2 100"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      className={className}
      width="100%"
      height="4"
      viewBox="0 0 100 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M 0 2 Q 2.5 0.5, 5 2 T 10 2 T 15 2 T 20 2 T 25 2 T 30 2 T 35 2 T 40 2 T 45 2 T 50 2 T 55 2 T 60 2 T 65 2 T 70 2 T 75 2 T 80 2 T 85 2 T 90 2 T 95 2 T 100 2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
