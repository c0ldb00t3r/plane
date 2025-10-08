import type { ImgHTMLAttributes } from "react";
import { forwardRef } from "react";

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ alt, src, ...rest }, ref) {
  return <img ref={ref} alt={alt} src={src} {...rest} />;
});

export default Image;
