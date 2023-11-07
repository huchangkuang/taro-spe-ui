import * as React from "react";
import { Image, RootPortal, View } from "@tarojs/components";
import cs from "classnames";
import {
  getImageInfo,
  getSystemInfoSync,
  saveImageToPhotosAlbum,
  showModal,
} from "@tarojs/taro";
import { getWechatSetting } from "../../common/wechatApi";
import { PreviewImgProps } from "../../../types/previewImg";

const PreviewImg: React.FC<PreviewImgProps> = (props) => {
  const { longTouch, onClick, src, ...rest } = props;
  const { windowWidth = 0, windowHeight = 0 } = getSystemInfoSync();
  const [showPre, setShowPre] = React.useState(false);
  const [mount, setMount] = React.useState(false);
  const [height, setHeight] = React.useState<string | number>(windowHeight);
  const imgPath = React.useRef("");
  const preview = (e) => {
    setMount(true);
    requestAnimationFrame(() => {
      setShowPre(true);
    });
    onClick?.(e);
  };
  const calcHeight = () => {
    getImageInfo({
      src,
      success: ({ height: h, width: w, path }) => {
        setHeight(Math.min((windowWidth * h) / w, windowHeight));
        imgPath.current = path;
      },
    });
  };
  const onLongPress = () => {
    if (longTouch) {
      longTouch();
    } else {
      showModal({
        title: "保存图片",
        content: "是否保存图片",
        success: async (res) => {
          if (res.confirm) {
            await getWechatSetting();
            saveImageToPhotosAlbum({
              filePath: imgPath.current,
            });
          }
        },
      });
    }
  };
  const closeModal = () => {
    setShowPre(false);
    setMount(false);
  };
  React.useEffect(() => {
    calcHeight();
  }, []);
  return (
    <React.Fragment>
      <Image src={src} onClick={preview} mode="aspectFill" {...rest} />
      {mount && (
        <RootPortal>
          <View
            onClick={closeModal}
            onLongPress={onLongPress}
            className={cs("preview-image-mask", showPre && "show")}
          >
            <Image
              style={{ height }}
              className="preview-image"
              src={src}
              mode="aspectFill"
            />
          </View>
        </RootPortal>
      )}
    </React.Fragment>
  );
};
export default PreviewImg;
