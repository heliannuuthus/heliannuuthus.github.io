import { Table as AntdTable } from "antd";
import type { TableProps } from "antd";
import { createStyles } from "antd-style";
import { Children, isValidElement } from "react";

const useStyles = createStyles(({ token, css }) => ({
  table: css`
    background-color: ${token.colorBgLayout};
    table {
      margin: 0;
    }
    td {
      border: none;
    },
    th {
      border: none;
    },
  `
}));

const Table = ({
  children,
  align,
  ...props
}: TableProps<any> & { align?: ("left" | "center" | "right")[] }) => {
  const { styles } = useStyles();
  const [headers, dataSource] = Children.toArray(children).reduce(
    (acc: any[], child, cur) => {
      if (isValidElement(child) && child.type === "tr") {
        const data = {};
        (child.props as any).children.forEach((child, index) => {
          if (isValidElement(child) && child.type === "th") {
            acc[0].push({
              title: (child.props as any).children,
              dataIndex: `column${index + 1}`,
              key: `column${index + 1}`,
              align: align?.[index] || "center"
            });
          }
          if (isValidElement(child) && child.type === "td") {
            data[`column${index + 1}`] = (child.props as any).children;
          }
        });
        Object.keys(data).length > 0 && acc[1].push(data);
        data["ellipsis"] = true;
        data["key"] = cur;
      }
      return acc;
    },
    [[], []]
  );

  return (
    <AntdTable
      columns={headers}
      dataSource={dataSource}
      {...props}
      className={styles.table}
      bordered={false}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

export default Table;
