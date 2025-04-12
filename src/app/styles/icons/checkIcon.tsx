import { IconPropsWithExtras } from './types';

export const CheckIcon = ({  fill = "#0F0E0F", ...props  }: IconPropsWithExtras) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9636 4.3312L7.51308 11.6103C6.97347 12.2192 6.01348 12.1884 5.51398 11.5462L2.60535 7.80655L3.3947 7.19261L6.30333 10.9323C6.4186 11.0805 6.64014 11.0876 6.76466 10.9471L13.2152 3.66797L13.9636 4.3312Z"
    />
  </svg>
);
