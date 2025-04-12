import { IconPropsWithExtras } from './types';

export const ArrowRightIcon = ({  fill = "#0F0E0F", ...props  }: IconPropsWithExtras) => (
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
      d="M11.697 7.37164L7.66552 3.74329L8.33448 3L12.5086 6.75671C13.1707 7.35257 13.1707 8.39072 12.5086 8.98659L8.33448 12.7433L7.66552 12L11.697 8.37164L3 8.37164V7.37164L11.697 7.37164Z"
      fill={fill}
    />
  </svg>
);
