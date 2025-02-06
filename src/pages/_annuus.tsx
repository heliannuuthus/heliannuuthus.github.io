import { useEffect, useRef, useState } from "react";
import { Canvg } from "canvg";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import anime from "animejs/lib/anime.es.js";

interface IrregularBlock {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function Annuus() {
  const { withBaseUrl } = useBaseUrlUtils();

  // 隐藏的 Canvas 用于生成 SVG 图像数据
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [irregularBlocks, setIrregularBlocks] = useState<IrregularBlock[]>([]);

  // 定义画布尺寸
  const canvasWidth = 256;
  const canvasHeight = 256;

  // 将 SVG 绘制到隐藏的 Canvas 上，并生成 dataURL
  useEffect(() => {
    async function drawSVG() {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const v = await Canvg.from(
            ctx,
            withBaseUrl("/img/heliannuuthus-256.svg"),
          );
          await v.render({
            ignoreAnimation: true,
            ignoreMouse: true,
            enableRedraw: false,
          });
          const url = canvasRef.current.toDataURL();
          setDataUrl(url);
        }
      }
    }
    drawSVG();
  }, [withBaseUrl]);

  // 当 dataUrl 可用后，生成不规则块数据（随机位置和尺寸）
  useEffect(() => {
    if (dataUrl) {
      const numBlocks = 150; // 设定生成的块数量，可根据需求调整
      const blocks: IrregularBlock[] = [];
      for (let i = 0; i < numBlocks; i++) {
        // 随机宽高范围：最小 20px，最大 60px
        const width = 10 + Math.random() * 40;
        const height = 10 + Math.random() * 40;
        // 随机位置，保证块不会超出画布范围
        const left = Math.random() * (canvasWidth - width);
        const top = Math.random() * (canvasHeight - height);
        blocks.push({ left, top, width, height });
      }
      setIrregularBlocks(blocks);
    }
  }, [dataUrl, canvasWidth, canvasHeight]);

  // 对每个不规则块启动无限循环的独立动画：模拟掉落效果
  useEffect(() => {
    if (dataUrl && irregularBlocks.length > 0) {
      const blockElements =
        document.querySelectorAll<HTMLDivElement>(".irregular-block");
      blockElements.forEach((block) => {
        // 为每个块添加随机初始延时，错开动画时间
        const randomDelay = Math.random() * 500; // 0 ~ 500ms
        // 掉落动画时长也可加入随机
        const dropDuration = 500 + Math.random() * 300; // 500 ~ 800ms
        anime({
          targets: block,
          keyframes: [
            {
              // 掉落阶段：向下移动到画布底部，同时透明度从1降到0、缩小至0.5
              translateY: canvasHeight,
              opacity: 0,
              scale: 0.5,
              duration: dropDuration,
              easing: "easeInQuad",
            },
            {
              // 瞬间归位（anime.js 的 loop 会自动还原到初始状态）
              translateY: 0,
              opacity: 1,
              scale: 1,
              duration: 0,
            },
          ],
          loop: true,
          delay: randomDelay,
        });
      });
    }
  }, [dataUrl, irregularBlocks, canvasHeight]);

  return (
    <div
      style={{ position: "relative", width: canvasWidth, height: canvasHeight }}
    >
      {/* 隐藏的 Canvas 用于生成 SVG 图像数据 */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: "none" }}
      ></canvas>
      {/* dataUrl 可用时，根据 irregularBlocks 数据生成不规则的块 */}
      {dataUrl &&
        irregularBlocks.map((block: IrregularBlock, idx: number) => (
          <div
            key={idx}
            className="irregular-block"
            style={{
              position: "absolute",
              width: `${block.width}px`,
              height: `${block.height}px`,
              left: `${block.left}px`,
              top: `${block.top}px`,
              backgroundImage: `url(${dataUrl})`,
              // 裁剪出当前块区域：背景位置设置为负的块起始坐标
              backgroundPosition: `-${block.left}px -${block.top}px`,
              backgroundSize: `${canvasWidth}px ${canvasHeight}px`,
            }}
          ></div>
        ))}
    </div>
  );
}
