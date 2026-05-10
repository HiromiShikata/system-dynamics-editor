import { useState } from 'react';
import { SystemDynamicsParser } from '../domain/SystemDynamicsParser';
import { SystemDynamicsTextEditor } from './SystemDynamicsTextEditor';
import { SystemDynamicsViewer } from './SystemDynamicsViewer';

const INITIAL_TEXT = `stock inventory
flow source -> inventory
flow inventory -> sink`;

export const SystemDynamicsEditorPage = () => {
  const [text, setText] = useState(INITIAL_TEXT);
  const model = SystemDynamicsParser.parse(text);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-1/2 border-r border-gray-300">
        <div className="px-4 py-2 bg-gray-800 text-gray-200 text-xs font-semibold tracking-wide">
          DSL Editor
        </div>
        <div className="flex-1 overflow-hidden">
          <SystemDynamicsTextEditor value={text} onChange={setText} />
        </div>
      </div>
      <div className="flex flex-col w-1/2">
        <div className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-semibold tracking-wide border-b border-gray-200">
          Diagram Viewer
        </div>
        <div className="flex-1 overflow-hidden">
          <SystemDynamicsViewer model={model} />
        </div>
      </div>
    </div>
  );
};
