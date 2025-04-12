import { IconProps } from './types';

export const ExpandedArrowIcon = ({ 
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
        d="M7.5 14.2935L7.5 11.4637C7.5 10.9315 7.06859 10.5 6.53642 10.5H3.70687M7.12061 10.879L3.5 14.5"
        stroke={fill}
        strokeWidth="0.856477"
      />
      <path
        d="M10.5 14.2937L10.5 11.4637C10.5 10.9315 10.9314 10.5 11.4635 10.5L14.293 10.5M10.8795 10.8788L14.5 14.5"
        stroke={fill}
        strokeWidth="0.856477"
      />
      <path
        d="M7.5 3.70648L7.5 6.53632C7.5 7.06855 7.06859 7.5 6.53642 7.5L3.70687 7.5M7.12061 7.12098L3.5 3.5"
        stroke={fill}
        strokeWidth="0.856477"
      />
      <path
        d="M10.5 3.70627L10.5 6.53627C10.5 7.06852 10.9314 7.5 11.4635 7.5L14.293 7.5M10.8795 7.12117L14.5 3.5"
        stroke={fill}
        strokeWidth="0.856477"
      />
    </g>
  </svg>
);
