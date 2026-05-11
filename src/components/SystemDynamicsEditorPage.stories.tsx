import type { Meta, StoryObj } from '@storybook/react';
import { SystemDynamicsEditorPage } from './SystemDynamicsEditorPage';

const meta: Meta<typeof SystemDynamicsEditorPage> = {
  title: 'Components/SystemDynamicsEditorPage',
  component: SystemDynamicsEditorPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SystemDynamicsEditorPage>;

export const Default: Story = {};
