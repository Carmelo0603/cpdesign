import type { SVGProps } from "react";

const paths = {
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M20 12H5m6-6-6 6 6 6" />,
  arrowUp: <path d="M12 20V5m-6 6 6-6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7m-9 0h9v9" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  plus: <path d="M12 5v14M5 12h14" />,
  file: <path d="M14 3H6v18h12V7l-4-4Zm0 0v4h4" />,
  mail: <path d="M3 5h18v14H3zm0 0 9 8 9-8" />,
  check: <path d="m5 12 5 5 9-10" />,
} as const;

export type IconName = keyof typeof paths;

const Icon = ({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {paths[name]}
  </svg>
);

export default Icon;
