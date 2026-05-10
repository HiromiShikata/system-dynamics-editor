export type StockNode = {
  id: string;
  name: string;
};

export type FlowNode = {
  id: string;
  name: string;
  fromId: string;
  toId: string;
};

export type SourceSinkNode = {
  id: string;
  name: 'source' | 'sink';
};

export type SystemDynamicsNode = StockNode | FlowNode | SourceSinkNode;

export type SystemDynamicsModel = {
  stocks: StockNode[];
  flows: FlowNode[];
  sourceSinks: SourceSinkNode[];
};
