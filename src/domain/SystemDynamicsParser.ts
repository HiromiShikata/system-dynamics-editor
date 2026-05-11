import type {
  FlowNode,
  SourceSinkNode,
  StockNode,
  SystemDynamicsModel,
} from './SystemDynamicsModel';

const isSourceOrSink = (name: string): name is 'source' | 'sink' =>
  name === 'source' || name === 'sink';

export const SystemDynamicsParser = {
  parse(text: string): SystemDynamicsModel {
    const stocks: StockNode[] = [];
    const flows: FlowNode[] = [];
    const sourceSinks: SourceSinkNode[] = [];
    const sourceSinkIds = new Map<string, string>();

    const getOrCreateSourceSink = (name: 'source' | 'sink'): string => {
      const existing = sourceSinkIds.get(name);
      if (existing !== undefined) return existing;
      const id = `${name}-${sourceSinks.length}`;
      sourceSinks.push({ id, name });
      sourceSinkIds.set(name, id);
      return id;
    };

    const stockIds = new Map<string, string>();

    const getOrCreateStock = (name: string): string => {
      const existing = stockIds.get(name);
      if (existing !== undefined) return existing;
      const id = `stock-${stocks.length}`;
      stocks.push({ id, name });
      stockIds.set(name, id);
      return id;
    };

    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') continue;

      const lowerLine = trimmed.toLowerCase();

      if (lowerLine.startsWith('stock ')) {
        const name = trimmed.slice('stock '.length).trim().toLowerCase();
        if (name !== '') {
          getOrCreateStock(name);
        }
        continue;
      }

      if (lowerLine.startsWith('flow ')) {
        const rest = trimmed.slice('flow '.length).trim();
        const arrowIndex = rest.indexOf('->');
        if (arrowIndex === -1) continue;

        const fromName = rest.slice(0, arrowIndex).trim().toLowerCase();
        const toName = rest
          .slice(arrowIndex + 2)
          .trim()
          .toLowerCase();

        if (fromName === '' || toName === '') continue;

        let fromId: string;
        let toId: string;

        if (isSourceOrSink(fromName)) {
          fromId = getOrCreateSourceSink(fromName);
        } else {
          fromId = getOrCreateStock(fromName);
        }

        if (isSourceOrSink(toName)) {
          toId = getOrCreateSourceSink(toName);
        } else {
          toId = getOrCreateStock(toName);
        }

        const flowId = `flow-${flows.length}`;
        flows.push({
          id: flowId,
          name: `${fromName} to ${toName}`,
          fromId,
          toId,
        });
      }
    }

    return { stocks, flows, sourceSinks };
  },
};
