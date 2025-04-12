import React from "react";

interface HistoryIconProps {
  fill?: string;
}

export const HistoryIcon = ({ fill = "#0F0E0F" }: HistoryIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 18 18"
  >
    <path
      stroke={fill}
      strokeWidth="1.125"
      d="M9 5.063v4.39c0 .063.05.113.112.113h2.7"
    ></path>
    <g fill={fill} clipPath="url(#clip0_4831_79485)">
      <path
        fillRule="evenodd"
        d="M9 14.625c-1.088 0-1.501-.004-1.829-.055a4.5 4.5 0 01-3.653-3.32H2.364a5.625 5.625 0 004.631 4.43c.437.07.96.07 2.005.07s1.568 0 2.005-.07a5.625 5.625 0 004.676-4.675c.069-.437.069-.96.069-2.005s0-1.568-.07-2.005a5.625 5.625 0 00-4.675-4.676c-.437-.069-.96-.069-2.005-.069s-1.568 0-2.005.07a5.625 5.625 0 00-4.631 4.43h1.154A4.5 4.5 0 017.17 3.43c.328-.052.74-.055 1.829-.055 1.088 0 1.501.003 1.829.055a4.5 4.5 0 013.74 3.741c.052.328.056.74.056 1.829 0 1.088-.004 1.501-.055 1.829a4.5 4.5 0 01-3.741 3.74c-.328.052-.74.056-1.829.056z"
        clipRule="evenodd"
      ></path>
      <path d="M6.559 6.187L3.02 7.57a.562.562 0 01-.76-.44l-.572-3.755 4.87 2.812z"></path>
    </g>
    <defs>
      <clipPath id="clip0_4831_79485">
        <path
          fill="#fff"
          d="M0 0H15.75V15.75H0z"
          transform="translate(1.125 1.125)"
        ></path>
      </clipPath>
    </defs>
  </svg>
);
