import { IconProps } from './types';

export const StickerIcon = ({  fill = "#0F0E0F"  }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
  >
    <path
      stroke={fill}
      strokeWidth="1.125"
      d="M2.813 9c0-1.067.001-1.534.062-1.917a5.062 5.062 0 014.208-4.208c.383-.06.85-.063 1.917-.063h.443c.646 0 .93.001 1.164.023a5.062 5.062 0 014.558 4.558c.022.234.023.518.023 1.164 0 .172 0 .24-.004.304a2.813 2.813 0 01-.728 1.758c-.043.047-.09.095-.212.217l-3.408 3.408c-.122.121-.17.17-.217.212a2.813 2.813 0 01-1.758.728 6.728 6.728 0 01-.304.004c-.646 0-.93-.001-1.164-.024a5.062 5.062 0 01-4.558-4.557c-.022-.234-.022-.518-.022-1.164V9z"
    ></path>
    <mask
      id="mask0_11_135280"
      style={{ maskType: "alpha" }}
      width="14"
      height="14"
      x="2"
      y="2"
      maskUnits="userSpaceOnUse"
    >
      <rect
        width="13.5"
        height="13.5"
        x="2.25"
        y="2.25"
        fill={fill}
        rx="5.625"
      ></rect>
    </mask>
    <g mask="url(#mask0_11_135280)">
      <rect
        width="12.375"
        height="12.375"
        x="8.438"
        y="8.438"
        stroke={fill}
        strokeWidth="1.125"
        rx="5.063"
      ></rect>
    </g>
  </svg>
);
