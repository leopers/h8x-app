export interface IconProps {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

export interface IconPropsWithExtras extends IconProps {
  [key: string]: string | number | boolean | undefined;
} 