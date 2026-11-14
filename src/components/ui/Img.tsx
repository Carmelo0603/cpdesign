import { useState, type ImgHTMLAttributes } from "react";

const WIDTHS = [384, 640, 960, 1280, 1920];
// Vercel Image Optimization resizes and re-encodes remote images at the edge.
// It only exists on the deployed site; locally the original file is used.
const OPTIMIZE = import.meta.env.PROD;

const optimized = (url: string, w: number) => `/_vercel/image?url=${encodeURIComponent(url)}&w=${w}&q=78`;
const canOptimize = (url: string) => OPTIMIZE && /^https:\/\//.test(url) && !/\.(svg|gif)(\?|$)/i.test(url);

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  /** Rendered width hint, e.g. "(min-width: 1024px) 40vw, 100vw". */
  sizes: string;
}

/** Image with responsive, edge-optimized sources and a fallback to the original file. */
const Img = ({ src, sizes, onError, ...rest }: Props) => {
  const [failed, setFailed] = useState(false);
  const useOpt = canOptimize(src) && !failed;
  return (
    <img
      src={useOpt ? optimized(src, 1280) : src}
      srcSet={useOpt ? WIDTHS.map((w) => `${optimized(src, w)} ${w}w`).join(", ") : undefined}
      sizes={useOpt ? sizes : undefined}
      onError={(e) => {
        if (useOpt) setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
};

export default Img;
