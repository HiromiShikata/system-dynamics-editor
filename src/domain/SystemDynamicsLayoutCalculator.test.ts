import { assert, describe, expect, it } from 'vitest';
import { SystemDynamicsLayoutCalculator } from './SystemDynamicsLayoutCalculator';
import type { SystemDynamicsModel } from './SystemDynamicsModel';

describe('SystemDynamicsLayoutCalculator', () => {
  describe('calculate', () => {
    it('returns zero-width layout for empty model', () => {
      const model: SystemDynamicsModel = {
        stocks: [],
        flows: [],
        sourceSinks: [],
      };
      const layout = SystemDynamicsLayoutCalculator.calculate(model);
      expect(layout.nodes).toHaveLength(0);
      expect(layout.edges).toHaveLength(0);
    });

    it('positions source on the left, stock in center, sink on the right', () => {
      const model: SystemDynamicsModel = {
        stocks: [{ id: 'stock-0', name: 'inventory' }],
        flows: [
          {
            id: 'flow-0',
            name: 'source to inventory',
            fromId: 'source-0',
            toId: 'stock-0',
          },
          {
            id: 'flow-1',
            name: 'inventory to sink',
            fromId: 'stock-0',
            toId: 'sink-0',
          },
        ],
        sourceSinks: [
          { id: 'source-0', name: 'source' },
          { id: 'sink-0', name: 'sink' },
        ],
      };
      const layout = SystemDynamicsLayoutCalculator.calculate(model);

      const sourceNode = layout.nodes.find((n) => n.id === 'source-0');
      const stockNode = layout.nodes.find((n) => n.id === 'stock-0');
      const sinkNode = layout.nodes.find((n) => n.id === 'sink-0');

      assert(sourceNode !== undefined, 'source node should exist');
      assert(stockNode !== undefined, 'stock node should exist');
      assert(sinkNode !== undefined, 'sink node should exist');

      expect(sourceNode.x).toBeLessThan(stockNode.x);
      expect(stockNode.x).toBeLessThan(sinkNode.x);
    });

    it('includes all flows as edges', () => {
      const model: SystemDynamicsModel = {
        stocks: [{ id: 'stock-0', name: 'water' }],
        flows: [
          {
            id: 'flow-0',
            name: 'source to water',
            fromId: 'source-0',
            toId: 'stock-0',
          },
          {
            id: 'flow-1',
            name: 'water to sink',
            fromId: 'stock-0',
            toId: 'sink-0',
          },
        ],
        sourceSinks: [
          { id: 'source-0', name: 'source' },
          { id: 'sink-0', name: 'sink' },
        ],
      };
      const layout = SystemDynamicsLayoutCalculator.calculate(model);
      expect(layout.edges).toHaveLength(2);
    });

    it('assigns correct types to nodes', () => {
      const model: SystemDynamicsModel = {
        stocks: [{ id: 'stock-0', name: 'inventory' }],
        flows: [],
        sourceSinks: [
          { id: 'source-0', name: 'source' },
          { id: 'sink-0', name: 'sink' },
        ],
      };
      const layout = SystemDynamicsLayoutCalculator.calculate(model);

      const sourceNode = layout.nodes.find((n) => n.id === 'source-0');
      const stockNode = layout.nodes.find((n) => n.id === 'stock-0');
      const sinkNode = layout.nodes.find((n) => n.id === 'sink-0');

      expect(sourceNode?.type).toBe('source');
      expect(stockNode?.type).toBe('stock');
      expect(sinkNode?.type).toBe('sink');
    });

    it('returns positive width and height for non-empty model', () => {
      const model: SystemDynamicsModel = {
        stocks: [{ id: 'stock-0', name: 'inventory' }],
        flows: [],
        sourceSinks: [{ id: 'source-0', name: 'source' }],
      };
      const layout = SystemDynamicsLayoutCalculator.calculate(model);
      expect(layout.width).toBeGreaterThan(0);
      expect(layout.height).toBeGreaterThan(0);
    });
  });
});
