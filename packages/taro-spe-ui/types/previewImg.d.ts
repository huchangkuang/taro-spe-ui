import { ImageProps } from "@tarojs/components/types/Image";
import { ComponentClass } from "react";

export interface PreviewImgProps extends ImageProps {
  longTouch?: () => void;
}

declare const PreviewImg: ComponentClass<PreviewImgProps>;

export default PreviewImg;
