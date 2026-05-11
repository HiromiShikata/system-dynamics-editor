import { SystemDynamicsLayoutCalculator } from '../domain/SystemDynamicsLayoutCalculator';
import type { NodePosition } from '../domain/SystemDynamicsLayoutCalculator';
import type { SystemDynamicsModel } from '../domain/SystemDynamicsModel';

type Props = {
  model: SystemDynamicsModel;
};

const STOCK_WIDTH = 80;
const STOCK_HEIGHT = 40;
const CLOUD_RADIUS = 28;

const StockShape = ({ node }: { node: NodePosition }) => (
  <>
    <rect
      x={node.x - STOCK_WIDTH / 2}
      y={node.y - STOCK_HEIGHT / 2}
      width={STOCK_WIDTH}
      height={STOCK_HEIGHT}
      fill="white"
      stroke="#1e40af"
      strokeWidth={2}
      rx={4}
    />
    <text
      x={node.x}
      y={node.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
      fill="#1e3a8a"
      fontWeight="600"
    >
      {node.label}
    </text>
  </>
);

const CloudShape = ({ node }: { node: NodePosition }) => {
  const x = node.x;
  const y = node.y;
  const r = CLOUD_RADIUS;

  const cloudPath = [
    `M ${x - r * 0.3} ${y + r * 0.5}`,
    `a ${r * 0.4} ${r * 0.4} 0 0 1 ${-r * 0.4} ${-r * 0.5}`,
    `a ${r * 0.35} ${r * 0.35} 0 0 1 ${r * 0.2} ${-r * 0.45}`,
    `a ${r * 0.5} ${r * 0.5} 0 0 1 ${r * 0.9} ${r * 0.1}`,
    `a ${r * 0.35} ${r * 0.35} 0 0 1 ${r * 0.1} ${r * 0.5}`,
    `a ${r * 0.3} ${r * 0.3} 0 0 1 ${-r * 0.3} ${r * 0.3}`,
    'Z',
  ].join(' ');

  return (
    <>
      <path
        d={cloudPath}
        fill="#e0f2fe"
        stroke="#0284c7"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <text
        x={x}
        y={y + r * 0.6 + 14}
        textAnchor="middle"
        fontSize={11}
        fill="#0369a1"
      >
        {node.label}
      </text>
    </>
  );
};

const ValveSymbol = ({ x, y }: { x: number; y: number }) => (
  <polygon
    points={`${x},${y - 8} ${x + 8},${y} ${x},${y + 8} ${x - 8},${y}`}
    fill="white"
    stroke="#6b7280"
    strokeWidth={1.5}
  />
);

type EdgeProps = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label: string;
};

const FlowEdge = ({ fromX, fromY, toX, toY, label }: EdgeProps) => {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitX = length > 0 ? dx / length : 1;
  const unitY = length > 0 ? dy / length : 0;

  const arrowSize = 8;
  const arrowX = toX - unitX * arrowSize;
  const arrowY = toY - unitY * arrowSize;
  const perpX = -unitY * arrowSize * 0.5;
  const perpY = unitX * arrowSize * 0.5;

  return (
    <g>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="#6b7280"
        strokeWidth={2}
      />
      <polygon
        points={`${toX},${toY} ${arrowX + perpX},${arrowY + perpY} ${arrowX - perpX},${arrowY - perpY}`}
        fill="#6b7280"
      />
      <ValveSymbol x={midX} y={midY} />
      <text
        x={midX}
        y={midY - 14}
        textAnchor="middle"
        fontSize={10}
        fill="#6b7280"
      >
        {label}
      </text>
    </g>
  );
};

export const SystemDynamicsViewer = ({ model }: Props) => {
  const hasNodes =
    model.stocks.length > 0 ||
    model.flows.length > 0 ||
    model.sourceSinks.length > 0;

  if (!hasNodes) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p className="text-sm">
          Enter system dynamics DSL on the left to see the diagram here.
        </p>
      </div>
    );
  }

  const layout = SystemDynamicsLayoutCalculator.calculate(model);
  const nodeMap = new Map(layout.nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full h-full overflow-auto bg-white">
      <svg
        width={layout.width}
        height={layout.height}
        className="min-w-full min-h-full"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label="System dynamics diagram"
      >
        <title>System dynamics diagram</title>
        {layout.edges.map((edge) => {
          const fromNode = nodeMap.get(edge.fromId);
          const toNode = nodeMap.get(edge.toId);
          if (!fromNode || !toNode) return null;
          return (
            <FlowEdge
              key={`${edge.fromId}-${edge.toId}`}
              fromX={fromNode.x}
              fromY={fromNode.y}
              toX={toNode.x}
              toY={toNode.y}
              label={edge.label}
            />
          );
        })}
        {layout.nodes.map((node) => {
          if (node.type === 'stock') {
            return <StockShape key={node.id} node={node} />;
          }
          return <CloudShape key={node.id} node={node} />;
        })}
      </svg>
    </div>
  );
};
