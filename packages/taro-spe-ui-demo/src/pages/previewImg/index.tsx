import React from "react";
import { View } from "@tarojs/components";
import { PreviewImg } from "taro-spe-ui";
import previewImgTest from "@/assets/images/previewImgTest.png";
import "./index.scss";

const PreviewImgPage: React.FC = () => {
  return (
    <View className="previewImgPage">
      <PreviewImg src={previewImgTest} />
    </View>
  );
};
export default PreviewImgPage;
