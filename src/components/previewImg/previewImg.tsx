import React, { FC, useEffect, useRef, useState } from 'react';
import { Image, RootPortal, View } from '@tarojs/components';
import { ImageProps } from '@tarojs/components/types/Image';
import cs from 'classnames';
import { getImageInfo, getSystemInfoSync, saveImageToPhotosAlbum, showModal } from '@tarojs/taro';
import {getWechatSetting} from "../../common/wechatApi";
import "../../styles/previewImg.scss"

type PreviewImgProps = {
  longTouch?: () => void;
} & ImageProps;

const touchTime = 500;
const PreviewImg: FC<PreviewImgProps> = props => {
  const { longTouch, onClick, src, ...rest } = props;
  const { windowWidth = 0, windowHeight = 0 } = getSystemInfoSync();
  const [showPre, setShowPre] = useState(false);
  const [mount, setMount] = useState(false);
  const [height, setHeight] = useState<string | number>(windowHeight);
  const imgPath = useRef('');
  const curTime = useRef(0);
  const timer = useRef<NodeJS.Timeout>();
  const preview = e => {
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
      }
    });
  };
  const onTouchStart = () => {
    curTime.current = new Date().valueOf();
    timer.current = setTimeout(() => {
      if (longTouch) {
        longTouch();
      } else {
        showModal({
          title: '保存图片',
          content: '是否保存图片',
          success: async res => {
            if (res.confirm) {
              await getWechatSetting();
              saveImageToPhotosAlbum({
                filePath: imgPath.current
              });
            }
          }
        });
      }
    }, touchTime);
  };
  const onTouchEnd = () => {
    const now = new Date().valueOf();
    if (now - curTime.current < touchTime) {
      clearTimeout(timer.current);
      timer.current = undefined;
      closeModal();
    }
  };
  const closeModal = () => {
    setShowPre(false);
    setMount(false);
  };
  useEffect(() => {
    calcHeight();
  }, []);
  return (
    <>
      <Image src={src} onClick={preview} mode='aspectFill' {...rest} />
      {mount && (
        <RootPortal>
          <View
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className={cs('preview-image-mask', showPre && 'show')}
          >
            <Image style={{ height }} className='preview-image' src={src} mode='aspectFill' />
          </View>
        </RootPortal>
      )}
    </>
  );
};
export default PreviewImg;
