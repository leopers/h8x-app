import { IconProps } from './types';

export const RefreshIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
  >
    <g
      fill={fill}
      clipPath="url(#clip0_5851_110210)"
    >
      <path
        fillRule="evenodd"
        d="M3.843 11.25A5.626 5.626 0 0014.625 9 5.625 5.625 0 003.843 6.75H2.634a6.75 6.75 0 110 4.5h1.209z"
        clipRule="evenodd"
      ></path>
      <path d="M7.006 6.237L3.467 7.619a.563.563 0 01-.76-.44l-.572-3.755 4.871 2.813z"></path>
    </g>
    <defs>
      <clipPath id="clip0_5851_110210">
        <path
          fill={fill}
          d="M0 0H15.75V15.75H0z"
          transform="translate(1.125 1.125)"
        ></path>
      </clipPath>
    </defs>
  </svg>
);
