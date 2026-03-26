interface MarkmapProps {
  markdown?: string;
}

export default function Markmap({ markdown }: MarkmapProps) {
  if (!markdown) return null;

  return (
    <div className="glass rounded-2xl p-4 my-4">
      <div className="text-xs text-default-400 mb-2 font-medium">Markmap</div>
      <pre className="text-sm whitespace-pre-wrap leading-relaxed text-default-600">
        {markdown}
      </pre>
    </div>
  );
}
