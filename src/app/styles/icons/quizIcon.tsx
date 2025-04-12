import { IconProps } from "./types";

export const QuizIcon = ({ fill = "#EFF0EB" }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2.5" y="2.5" width="11" height="11" rx="2.875" stroke={fill} />
    <path
      d="M6.5 7V7C6.24602 5.9841 7.01439 5 8.06155 5H8.38434C9.27664 5 10 5.72336 10 6.61566V6.61566C10 7.18096 9.70455 7.70514 9.22093 7.99786L8.77319 8.26886C8.29322 8.55936 8 9.07959 8 9.64062V9.64062"
      stroke={fill}
    />
    <path d="M8 10.4219V11.4441" stroke={fill} stroke-width="1.15" />
  </svg>
);
