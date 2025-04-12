import { IconProps } from './types';

export const FlashcardIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4141_102198)">
      <rect
        x="5.58569"
        y="3.63278"
        width="9"
        height="12"
        rx="1.5"
        transform="rotate(2.25095 5.58569 3.63278)"
        stroke={fill}
      />
      <rect
        x="2.55619"
        y="3.63219"
        width="9"
        height="12"
        rx="1.5"
        transform="rotate(-6.86652 2.55619 3.63219)"
        fill="#EFF0EB"
        stroke={fill}
      />
      <path
        d="M5.39169 9.251L8.71543 5.55236L7.46576 8.21583L9.6331 7.9547L6.2907 11.4985L7.55902 8.98988L5.39169 9.251Z"
        fill={fill}
      />
    </g>
  </svg>
);
