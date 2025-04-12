import { IconProps } from "./types";

export const PencilIcon = ({ fill = "#EFF0EB" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
  >
    <path
      stroke={fill}
      strokeWidth="1.125"
      d="M3.602 11.492l-.563 2.816a.562.562 0 00.662.662l2.816-.563c.218-.043.418-.15.575-.307l7.714-7.715c.44-.439.44-1.151 0-1.59l-1.591-1.592a1.125 1.125 0 00-1.591 0L3.91 10.918a1.125 1.125 0 00-.308.574z"
    ></path>
  </svg>
);
