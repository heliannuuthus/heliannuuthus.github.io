import React from "react";
import { Image as AntdImage, ImageProps } from "antd";

const Image: React.FC<ImageProps> = ({ src, ...props }) => (
  <AntdImage src={src} {...props} style={{ paddingBottom: "12px" }} />
);

export default Image;
