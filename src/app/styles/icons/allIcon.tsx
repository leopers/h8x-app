import { IconProps } from './types';

export const AllIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 18 18"
  >
    <circle
      cx="5.288"
      cy="5.4"
      r="2.138"
      stroke={fill}
      strokeWidth="1.125"
    ></circle>
    <circle
      cx="12.713"
      cy="5.4"
      r="2.138"
      stroke={fill}
      strokeWidth="1.125"
    ></circle>
    <path
      stroke={fill}
      strokeWidth="1.125"
      d="M7.425 12.6a2.138 2.138 0 11-4.275 0 2.138 2.138 0 014.275 0zM14.85 12.6a2.138 2.138 0 11-4.275 0 2.138 2.138 0 014.275 0z"
    ></path>
  </svg>
);
