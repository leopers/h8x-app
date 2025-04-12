import { IconProps } from './types';

export const ScoreIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M9 3.374a6.75 6.75 0 00-6.75 6.75H1.125a7.875 7.875 0 0115.75 0H15.75A6.75 6.75 0 009 3.374zM5.625 14.624h-2.25V13.5h2.25v1.125zM10.125 14.624h-2.25V13.5h2.25v1.125zM14.625 14.624h-2.25V13.5h2.25v1.125z"
      clipRule="evenodd"
    ></path>
    <path
      fill={fill}
      d="M12.63 2.72a.595.595 0 011.028.594l-3.814 7.544a1.064 1.064 0 11-1.84-1.063L12.63 2.72z"
    ></path>
  </svg>
);
