import { IconProps } from './types';

export const ExpandArrowIcon = ({ 
  fill = "#7C6D53",
  width = "18",
  height = "18",
 }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.5">
      <path
        d="M3 10.4509L3 13.4449C3 14.008 3.45648 14.4645 4.01958 14.4645H7.01359M3.40144 14.0635L7.23248 10.2324"
        stroke={fill}
        strokeWidth="0.906293"
      />
      <path
        d="M14.6396 10.4507L14.6396 13.4447C14.6396 14.0078 14.1832 14.4642 13.6201 14.4642L10.6261 14.4642M14.238 14.0635L10.407 10.2324"
        stroke={fill}
        strokeWidth="0.906293"
      />
      <path
        d="M3 7.01358L3 4.01958C3 3.45648 3.45648 3 4.01958 3L7.01359 3M3.40144 3.40101L7.23248 7.23204"
        stroke={fill}
        strokeWidth="0.906293"
      />
      <path
        d="M14.6396 7.01554L14.6396 4.02153C14.6396 3.45843 14.1832 3.00195 13.6201 3.00195L10.6261 3.00195M14.238 3.40273L10.407 7.23377"
        stroke={fill}
        strokeWidth="0.906293"
      />
    </g>
  </svg>
);
