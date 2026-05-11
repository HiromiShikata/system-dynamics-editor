import type { SystemDynamicsModel } from './SystemDynamicsModel';

export type NodePosition = {
  id: string;
  x: number;
  y: number;
  type: 'stock' | 'source' | 'sink';
  label: string;
};

export type EdgePosition = {
  fromId: string;
  toId: string;
  label: string;
};

export type SystemDynamicsLayout = {
  nodes: NodePosition[];
  edges: EdgePosition[];
  width: number;
  height: number;
};

const NODE_HORIZONTAL_SPACING = 180;
const NODE_VERTICAL_SPACING = 100;
const PADDING = 80;

export const SystemDynamicsLayoutCalculator = {
  calculate(model: SystemDynamicsModel): SystemDynamicsLayout {
    const nodes: NodePosition[] = [];

    const sources = model.sourceSinks.filter((s) => s.name === 'source');
    const sinks = model.sourceSinks.filter((s) => s.name === 'sink');

    const totalRows = Math.max(
      sources.length,
      model.stocks.length,
      sinks.length,
      1,
    );

    const centerY = (index: number, total: number) => {
      const totalHeight = (total - 1) * NODE_VERTICAL_SPACING;
      const startY =
        PADDING + (totalRows * NODE_VERTICAL_SPACING - totalHeight) / 2;
      return startY + index * NODE_VERTICAL_SPACING;
    };

    sources.forEach((source, i) => {
      nodes.push({
        id: source.id,
        x: PADDING,
        y: centerY(i, sources.length),
        type: 'source',
        label: 'Source',
      });
    });

    model.stocks.forEach((stock, i) => {
      nodes.push({
        id: stock.id,
        x: PADDING + NODE_HORIZONTAL_SPACING,
        y: centerY(i, model.stocks.length),
        type: 'stock',
        label: stock.name,
      });
    });

    sinks.forEach((sink, i) => {
      nodes.push({
        id: sink.id,
        x: PADDING + NODE_HORIZONTAL_SPACING * 2,
        y: centerY(i, sinks.length),
        type: 'sink',
        label: 'Sink',
      });
    });

    const edges: EdgePosition[] = model.flows.map((flow) => ({
      fromId: flow.fromId,
      toId: flow.toId,
      label: flow.name,
    }));

    const maxX = PADDING + NODE_HORIZONTAL_SPACING * 2 + PADDING;
    const maxY = totalRows * NODE_VERTICAL_SPACING + PADDING;

    return {
      nodes,
      edges,
      width: maxX,
      height: maxY,
    };
  },
};
