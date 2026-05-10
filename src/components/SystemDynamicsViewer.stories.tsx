import type { Meta, StoryObj } from '@storybook/react';
import { SystemDynamicsViewer } from './SystemDynamicsViewer';

const meta: Meta<typeof SystemDynamicsViewer> = {
  title: 'Components/SystemDynamicsViewer',
  component: SystemDynamicsViewer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SystemDynamicsViewer>;

export const Empty: Story = {
  args: {
    model: {
      stocks: [],
      flows: [],
      sourceSinks: [],
    },
  },
};

export const SourceToInventoryToSink: Story = {
  args: {
    model: {
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
    },
  },
};

export const StocksOnly: Story = {
  args: {
    model: {
      stocks: [
        { id: 'stock-0', name: 'water' },
        { id: 'stock-1', name: 'ice' },
      ],
      flows: [],
      sourceSinks: [],
    },
  },
};
