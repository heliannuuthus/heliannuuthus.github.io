import { Table as AntdTable } from "antd";
import type { TableProps } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
  table: css`
    background-color: ${token.colorBgLayout};
    td {
      border: none;
    },
    th {
      border: none;
    },
  `
}));

const Table = ({ ...props }: TableProps<any>) => {
  const { styles } = useStyles();
  return <AntdTable {...props} className={styles.table} bordered={false} />;
};

export default Table;
