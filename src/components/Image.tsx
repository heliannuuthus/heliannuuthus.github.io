import { Image as AntdImage, Flex, ImageProps } from "antd";
import React from "react";

const Image: React.FC<ImageProps> = ({ src, ...props }) => (
  <AntdImage
    preview={{
      mask: false
    }}
    src={src}
    {...props}
    style={{ paddingBottom: "12px" }}
  />
);

export const Center: React.FC<{ src: string }> = ({ src, ...props }) => (
  <Flex justify="center" children={<Image src={src} {...props} />} />
);

export default Image;
