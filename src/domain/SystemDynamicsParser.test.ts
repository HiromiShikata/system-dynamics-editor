import { describe, expect, it } from 'vitest';
import { SystemDynamicsParser } from './SystemDynamicsParser';

describe('SystemDynamicsParser', () => {
  describe('parse', () => {
    it('returns empty model for empty input', () => {
      const result = SystemDynamicsParser.parse('');
      expect(result).toEqual({ stocks: [], flows: [], sourceSinks: [] });
    });

    it('parses a single stock declaration', () => {
      const result = SystemDynamicsParser.parse('stock inventory');
      expect(result.stocks).toHaveLength(1);
      expect(result.stocks[0].name).toBe('inventory');
      expect(result.flows).toHaveLength(0);
      expect(result.sourceSinks).toHaveLength(0);
    });

    it('parses source to stock to sink flow', () => {
      const input = `stock inventory
flow source -> inventory
flow inventory -> sink`;
      const result = SystemDynamicsParser.parse(input);

      expect(result.stocks).toHaveLength(1);
      expect(result.stocks[0].name).toBe('inventory');

      expect(result.sourceSinks).toHaveLength(2);
      const names = result.sourceSinks.map((s) => s.name).sort();
      expect(names).toEqual(['sink', 'source']);

      expect(result.flows).toHaveLength(2);
    });

    it('reuses existing source sink nodes for duplicate source/sink', () => {
      const input = `flow source -> water
flow source -> wood`;
      const result = SystemDynamicsParser.parse(input);

      expect(result.sourceSinks).toHaveLength(1);
      expect(result.sourceSinks[0].name).toBe('source');
    });

    it('reuses existing stock node for duplicate stock name', () => {
      const input = `flow source -> water
flow water -> sink`;
      const result = SystemDynamicsParser.parse(input);

      expect(result.stocks).toHaveLength(1);
      expect(result.stocks[0].name).toBe('water');
    });

    it('ignores blank lines', () => {
      const input = `stock water

flow source -> water`;
      const result = SystemDynamicsParser.parse(input);
      expect(result.stocks).toHaveLength(1);
      expect(result.flows).toHaveLength(1);
    });

    it('ignores flow lines missing arrow', () => {
      const result = SystemDynamicsParser.parse('flow invalid line');
      expect(result.flows).toHaveLength(0);
    });

    it('assigns unique ids to each stock', () => {
      const result = SystemDynamicsParser.parse('stock a\nstock b');
      expect(result.stocks[0].id).not.toBe(result.stocks[1].id);
    });

    it('assigns unique ids to each flow', () => {
      const input = `flow source -> water
flow water -> sink`;
      const result = SystemDynamicsParser.parse(input);
      expect(result.flows[0].id).not.toBe(result.flows[1].id);
    });

    it('flow references correct from and to node ids', () => {
      const input = `stock water
flow source -> water
flow water -> sink`;
      const result = SystemDynamicsParser.parse(input);

      const sourceNode = result.sourceSinks.find((s) => s.name === 'source');
      const sinkNode = result.sourceSinks.find((s) => s.name === 'sink');
      const stockNode = result.stocks[0];

      const firstFlow = result.flows[0];
      expect(firstFlow.fromId).toBe(sourceNode?.id);
      expect(firstFlow.toId).toBe(stockNode.id);

      const secondFlow = result.flows[1];
      expect(secondFlow.fromId).toBe(stockNode.id);
      expect(secondFlow.toId).toBe(sinkNode?.id);
    });
  });
});
