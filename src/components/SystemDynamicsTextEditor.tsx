type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SystemDynamicsTextEditor = ({ value, onChange }: Props) => {
  return (
    <textarea
      className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 outline-none resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
    />
  );
};
