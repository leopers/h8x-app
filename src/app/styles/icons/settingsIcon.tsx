import { IconProps } from './types';

export const SettingsIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 11H13" stroke={fill} />
    <path d="M3 5H13" stroke={fill} />
    <path
      d="M11 5C11 5.82843 10.3284 6.5 9.5 6.5C8.67157 6.5 8 5.82843 8 5C8 4.17157 8.67157 3.5 9.5 3.5C10.3284 3.5 11 4.17157 11 5Z"
      fill="#EFF0EB"
      stroke={fill}
    />
    <path
      d="M8 11C8 11.8284 7.32843 12.5 6.5 12.5C5.67157 12.5 5 11.8284 5 11C5 10.1716 5.67157 9.5 6.5 9.5C7.32843 9.5 8 10.1716 8 11Z"
      fill="#EFF0EB"
      stroke={fill}
    />
  </svg>
);
