type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type ChartPoint = {
  x: number;
  y: number;
};

export function buildLinePath(
  values: number[],
  width: number,
  height: number,
  padding: ChartPadding,
  maxValue: number,
): string {
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = values.map((value, index) => {
    const x =
      padding.left +
      (index / Math.max(values.length - 1, 1)) * innerWidth;
    const y =
      padding.top + innerHeight - (value / maxValue) * innerHeight;

    return { x, y };
  });

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function buildLinePoints(
  values: number[],
  labels: string[],
  width: number,
  height: number,
  padding: ChartPadding,
  maxValue: number,
): Array<ChartPoint & { label: string }> {
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return values.map((value, index) => ({
    x:
      padding.left +
      (index / Math.max(values.length - 1, 1)) * innerWidth,
    y:
      padding.top + innerHeight - (value / maxValue) * innerHeight,
    label: labels[index] ?? "",
  }));
}
