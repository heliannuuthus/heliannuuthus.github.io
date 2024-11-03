import React from "react";
import { Image as AntdImage, ImageProps } from "antd";

const Image: React.FC<ImageProps> = ({ src, ...props }) => (
  <AntdImage
    preview={{
      mask: false,
    }}
    src={src}
    {...props}
    style={{ paddingBottom: "12px" }}
  />
);

export default Image;
