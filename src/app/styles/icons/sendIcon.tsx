import { IconProps } from "./types";

export const SendIcon = ({ fill = "#EFF0EB" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
  >
    <g clipPath="url(#clip0_3718_27539)">
      <path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.203 9.203H4.756m10.447 0L4.756 14.989V9.203m10.447 0L4.756 3.416v5.787"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_3718_27539">
        <path fill="#fff" d="M0 0H18V18H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
