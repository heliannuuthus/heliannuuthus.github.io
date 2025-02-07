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

  // 当 dataUrl 可用后，生成切片块数据（随机位置和尺寸）
  useEffect(() => {
    if (dataUrl) {
      const numBlocks = 800; // 生成块的数量，可根据需求调整
      const blocks: IrregularBlock[] = [];
      for (let i = 0; i < numBlocks; i++) {
        // 随机宽高范围：最小 10px，最大 50px
        const width = 10 + Math.random() * 40;
        const height = 10 + Math.random() * 40;
        // 随机位置（保证块不会超出画布范围）
        const left = Math.random() * (canvasWidth - width);
        const top = Math.random() * (canvasHeight - height);
        blocks.push({ left, top, width, height });
      }
      setIrregularBlocks(blocks);
    }
  }, [dataUrl, canvasWidth, canvasHeight]);

  // 对每个块启动一次性的独立动画：模拟爆炸后重新组装的效果
  useEffect(() => {
    if (dataUrl && irregularBlocks.length > 0) {
      const blockElements =
        document.querySelectorAll<HTMLDivElement>(".irregular-block");
      blockElements.forEach((block, index) => {
        // 获取当前块数据，用于计算块中心坐标
        const blockData = irregularBlocks[index];
        const blockCenterX = blockData.left + blockData.width / 2;
        const blockCenterY = blockData.top + blockData.height / 2;
        const canvasCenterX = canvasWidth / 2;
        const canvasCenterY = canvasHeight / 2;

        // 计算块中心与画布中心的偏移量
        const dx = blockCenterX - canvasCenterX;
        const dy = blockCenterY - canvasCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 如果块不在中心，则计算爆炸时的位移量
        let targetTx = 0;
        let targetTy = 0;
        if (distance > 0) {
          // 设定爆炸位移幅度（加入随机偏差）
          const explosionDistance = 100 + Math.random() * 50;
          const angle = Math.atan2(dy, dx);
          targetTx = Math.cos(angle) * explosionDistance;
          targetTy = Math.sin(angle) * explosionDistance;
        }

        // 设置随机延时与持续时间
        const duration = 600 + Math.random() * 300; // 800 ～ 1100ms

        // 利用 anime.js 的 timeline 实现爆炸后再组装：
        // 1. 第一阶段：向外飞散，透明度降至 0，缩小至 0.5
        // 2. 第二阶段：稍作延时后重新回到原位，恢复透明度和原始大小
        anime
          .timeline({
            delay: duration,
            loop: true,
          })
          .add({
            targets: block,
            translateX: targetTx,
            translateY: targetTy,
            opacity: 0,
            scale: 0.5,
            duration: duration,
            easing: "easeOutExpo",
          })
          .add(
            {
              targets: block,
              translateX: 0,
              translateY: 0,
              opacity: 1,
              scale: 1,
              duration: duration,
              easing: "easeInOutExpo",
            },
            "+=300",
          ); // 第二阶段延时 300ms 后开始
      });
    }
  }, [dataUrl, irregularBlocks, canvasWidth, canvasHeight]);

  return (
    <div
      style={{
        position: "relative",
        width: canvasWidth,
        height: canvasHeight,
        borderRadius: "50%",
      }}
    >
      {/* 隐藏的 Canvas 用于生成 SVG 图像数据 */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: "none" }}
      ></canvas>
      {/* 当 dataUrl 可用时，根据 irregularBlocks 数据生成切片块 */}
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
              // 不再设置 borderRadius，这样爆炸出的块保持原切片形状
              backgroundImage: `url(${dataUrl})`,
              // 裁剪出对应的块区域：背景位置为负的块起始坐标
              backgroundPosition: `-${block.left}px -${block.top}px`,
              backgroundSize: `${canvasWidth}px ${canvasHeight}px`,
            }}
          ></div>
        ))}
    </div>
  );
}
