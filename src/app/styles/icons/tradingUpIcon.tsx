interface VectorIconProps {
  width?: number;
  height?: number;
  color?: "red" | "yellow" | "green" | string;
  className?: string;
}

export const VectorIcon = ({
  width = 14,
  height = 8,
  color = "red",
  className,
}: VectorIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ minWidth: width, minHeight: height }}
  >
    <path
      d="M12.758 1.08301L7.79964 6.04134L4.88298 3.12467L1.09131 6.91634M12.758 1.08301H9.25798M12.758 1.08301V4.58301"
      stroke={color}
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
