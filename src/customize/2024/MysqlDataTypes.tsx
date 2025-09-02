import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import Table from "../../components/table/Table";
import Tabs from "../../components/tabs/Tabs";

interface DataType {
  key: string;
  type: string;
  size: string;
  range: string;
  description: string;
}

const IntegerColumns: ColumnsType<DataType> = [
  {
    title: "类型",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "存储大小",
    dataIndex: "size",
    key: "size"
  },
  {
    title: "取值范围",
    dataIndex: "range",
    key: "range"
  },
  {
    title: "说明",
    dataIndex: "description",
    key: "description"
  }
];

const IntegerData: DataType[] = [
  {
    key: "1",
    type: "BIT",
    size: "1-64位",
    range: "根据定义的位数",
    description: "位字段类型"
  },
  {
    key: "2",
    type: "BOOL/BOOLEAN",
    size: "1字节",
    range: "0, 1",
    description: "布尔类型，是TINYINT(1)的同义词"
  },
  {
    key: "3",
    type: "TINYINT",
    size: "1字节",
    range: "-128~127",
    description: "小整数值"
  },
  {
    key: "4",
    type: "SMALLINT",
    size: "2字节",
    range: "-32768~32767",
    description: "大整数值"
  },
  {
    key: "5",
    type: "MEDIUMINT",
    size: "3字节",
    range: "-8388608~8388607",
    description: "中等整数值"
  },
  {
    key: "6",
    type: "INT/INTEGER",
    size: "4字节",
    range: "-2^31~2^31-1",
    description: "标准整数值"
  },
  {
    key: "7",
    type: "BIGINT",
    size: "8字节",
    range: "-2^63~2^63-1",
    description: "大整数值"
  }
];

const FloatData: DataType[] = [
  {
    key: "1",
    type: "FLOAT",
    size: "4字节",
    range: "±1.175494351E-38~±3.402823466E+38",
    description: "单精度浮点数"
  },
  {
    key: "2",
    type: "DOUBLE",
    size: "8字节",
    range: "±2.2250738585072014E-308~±1.7976931348623157E+308",
    description: "双精度浮点数"
  },
  {
    key: "3",
    type: "DECIMAL",
    size: "对应的整数部分和小数部分",
    range: "依赖于定义的精度和标度",
    description: "精确的小数值"
  }
];

const StringData: DataType[] = [
  {
    key: "1",
    type: "CHAR",
    size: "0-255字节",
    range: "定长字符串",
    description: "固定长度字符串"
  },
  {
    key: "2",
    type: "VARCHAR",
    size: "0-65535字节",
    range: "变长字符串",
    description: "可变长度字符串"
  },
  {
    key: "3",
    type: "TINYTEXT",
    size: "255字节",
    range: "短文本字符串",
    description: "短文本字符串"
  }
  // ... 其他字符串类型
];

const DateData: DataType[] = [
  {
    key: "1",
    type: "DATE",
    size: "3字节",
    range: "1000-01-01 到 9999-12-31",
    description: "YYYY-MM-DD"
  },
  {
    key: "2",
    type: "DATETIME",
    size: "8字节",
    range: "1000-01-01 00:00:00 到 9999-12-31 23:59:59",
    description: "YYYY-MM-DD HH:MM:SS"
  }
  // ... 其他日期类型
];

const OtherData: DataType[] = [
  {
    key: "1",
    type: "BINARY",
    size: "类似CHAR",
    range: "固定长度二进制字符串",
    description: "类似CHAR的二进制存储"
  },
  {
    key: "2",
    type: "ENUM",
    size: "1或2字节",
    range: "最多65535个成员",
    description: "枚举类型，单选"
  }
  // ... 其他类型
];

const tableLayout = "fixed";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "整数类型",
    children: (
      <Table
        tableLayout={tableLayout}
        columns={IntegerColumns}
        dataSource={IntegerData}
        pagination={false}
      />
    )
  },
  {
    key: "2",
    label: "浮点数类型",
    children: (
      <Table
        tableLayout={tableLayout}
        columns={IntegerColumns}
        dataSource={FloatData}
        pagination={false}
      />
    )
  },
  {
    key: "3",
    label: "字符串类型",
    children: (
      <Table
        tableLayout={tableLayout}
        columns={IntegerColumns}
        dataSource={StringData}
        pagination={false}
      />
    )
  },
  {
    key: "4",
    label: "日期类型",
    children: (
      <Table
        tableLayout={tableLayout}
        columns={IntegerColumns}
        dataSource={DateData}
        pagination={false}
      />
    )
  },
  {
    key: "5",
    label: "其他类型",
    children: (
      <Table
        tableLayout={tableLayout}
        columns={IntegerColumns}
        dataSource={OtherData}
        pagination={false}
      />
    )
  }
];

const MySQLDataTypes = () => {
  return (
    <Tabs defaultActiveKey="1" items={items} style={{ padding: "24px" }} />
  );
};

export default MySQLDataTypes;
