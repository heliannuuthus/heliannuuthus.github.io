interface TableProps {
  children?: React.ReactNode;
  align?: string;
}

export default function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto my-6 glass rounded-2xl">
      <table className="w-full text-sm border-collapse [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-default-50 [&_th]:dark:bg-default-100/5 [&_td]:px-4 [&_td]:py-2 [&_th]:border-b [&_th]:border-default-200 [&_td]:border-b [&_td]:border-default-100">
        {children}
      </table>
    </div>
  );
}
