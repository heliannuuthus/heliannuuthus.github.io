export interface PathCommand {
  type: string;
  params: number[];
}
export const getPathData = (
  pathData: string | SVGPathElement
): PathCommand[] => {
  if (!pathData || typeof pathData !== "string") {
    pathData = (pathData as SVGPathElement).getAttribute("d") || "";
  }
  const commands: PathCommand[] = [];

  // 清理并标准化输入
  const normalizedData = pathData
    .trim()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ");
  const segments: string[] = [];
  let currentNumber = "";
  let currentCommand: string | null = null;

  // 分割路径数据
  for (let i = 0; i < normalizedData.length; i++) {
    const char = normalizedData[i];
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(char)) {
      if (currentNumber) {
        segments.push(currentNumber);
        currentNumber = "";
      }
      segments.push(char);
    } else if (/\d|-|\./.test(char)) {
      currentNumber += char;
    } else if (char === " ") {
      if (currentNumber) {
        segments.push(currentNumber);
        currentNumber = "";
      }
    }
  }
  if (currentNumber) {
    segments.push(currentNumber);
  }

  // 解析命令和参数
  for (const segment of segments) {
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(segment)) {
      currentCommand = segment;
      commands.push({ type: segment, params: [] });
    } else if (currentCommand && commands.length > 0) {
      const num = parseFloat(segment);
      if (!isNaN(num)) {
        commands[commands.length - 1].params.push(num);
      }
    }
  }
  return commands;
};
