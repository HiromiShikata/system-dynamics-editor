import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SystemDynamicsTextEditor } from './SystemDynamicsTextEditor';

const meta: Meta<typeof SystemDynamicsTextEditor> = {
  title: 'Components/SystemDynamicsTextEditor',
  component: SystemDynamicsTextEditor,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SystemDynamicsTextEditor>;

const InteractiveWrapper = ({ initialValue }: { initialValue: string }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ height: '400px' }}>
      <SystemDynamicsTextEditor value={value} onChange={setValue} />
    </div>
  );
};

export const Empty: Story = {
  render: () => <InteractiveWrapper initialValue="" />,
};

export const WithSampleContent: Story = {
  render: () => (
    <InteractiveWrapper
      initialValue={
        'stock inventory\nflow source -> inventory\nflow inventory -> sink'
      }
    />
  ),
};
