import { IconPropsWithExtras } from './types';

export const AssistantThinkingIcon = ({  fill = "#FC9F1E", ...props  }: IconPropsWithExtras) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        fill={fill}
        d="M6.75 9c0 2.7-.277 3.6-2.017 3.6-1.74 0-3.15-1.611-3.15-3.6 0-1.988 1.41-3.6 3.15-3.6S6.75 6.3 6.75 9zM16.883 9a5.4 5.4 0 01-5.4 5.4C8.501 14.4 7.2 13.05 7.2 9c0-4.05 1.3-5.4 4.283-5.4a5.4 5.4 0 015.4 5.4z"
      ></path>
    </svg>
  );