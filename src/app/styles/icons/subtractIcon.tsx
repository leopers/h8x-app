import { IconPropsWithExtras } from './types';

export const SubtractIcon = ({  fill = "#0F0E0F", ...props  }: IconPropsWithExtras) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13 8.49999L13 7.49999L3.00001 7.49999L3.00001 8.49999L13 8.49999Z"
      fill={fill}
    />
  </svg>
);
