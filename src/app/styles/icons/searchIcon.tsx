import { IconProps } from './types';

export const SearchIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11 7C11 9.20914 9.20914 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3C9.20914 3 11 4.79086 11 7ZM10.1644 10.8715C9.30243 11.5768 8.20063 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7C12 8.20063 11.5768 9.30243 10.8715 10.1644L13.3536 12.6464L12.6464 13.3536L10.1644 10.8715Z"
      fill={fill}
    />
  </svg>
);
