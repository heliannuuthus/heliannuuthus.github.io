import type { ComponentPropsWithoutRef, ReactNode } from "react";

const tableClass = "w-full text-sm";
const wrapperClass = "my-6 overflow-x-auto rounded-xl border border-default-200";
const theadClass = "bg-default-100/60 dark:bg-default-100/20 text-[13px] font-semibold text-default-600";
const tbodyClass = "divide-y divide-default-100";
const trClass = "transition-colors hover:bg-default-50 dark:hover:bg-default-100/10";
const thClass = "px-4 py-2.5 text-left font-semibold whitespace-nowrap";
const tdClass = "px-4 py-2.5 text-default-700 dark:text-default-300";

function MdxTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className={wrapperClass}>
      <table className={tableClass} {...props} />
    </div>
  );
}
function MdxThead(props: ComponentPropsWithoutRef<"thead">) {
  return <thead className={theadClass} {...props} />;
}
function MdxTbody(props: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={tbodyClass} {...props} />;
}
function MdxTr(props: ComponentPropsWithoutRef<"tr">) {
  return <tr className={trClass} {...props} />;
}
function MdxTh(props: ComponentPropsWithoutRef<"th">) {
  return <th className={thClass} {...props} />;
}
function MdxTd(props: ComponentPropsWithoutRef<"td">) {
  return <td className={tdClass} {...props} />;
}

function Table({ children }: { children?: ReactNode }) {
  return (
    <div className={wrapperClass}>
      <table className={tableClass}>{children}</table>
    </div>
  );
}
function TableHeader({ children }: { children?: ReactNode }) {
  return <thead className={theadClass}><tr className={trClass}>{children}</tr></thead>;
}
function TableBody({ children }: { children?: ReactNode }) {
  return <tbody className={tbodyClass}>{children}</tbody>;
}
function TableColumn({ children }: { children?: ReactNode; id?: string }) {
  return <th className={thClass}>{children}</th>;
}
function TableRow({ children }: { children?: ReactNode; id?: string }) {
  return <tr className={trClass}>{children}</tr>;
}
function TableCell({ children }: { children?: ReactNode }) {
  return <td className={tdClass}>{children}</td>;
}

export { MdxTable, MdxThead, MdxTbody, MdxTr, MdxTh, MdxTd };
export { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell };
