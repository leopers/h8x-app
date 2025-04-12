import React from "react";

export const AlignLeftIcon = ({
  stroke = "#2A2A2A",
  size = 20,
}: {
  stroke?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 9.5H3M13.5 14H3M16.5 5H3"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
