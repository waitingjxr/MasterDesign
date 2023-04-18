import React, { useState } from 'react';
import { TreeSelect, Select, DatePicker, Button } from 'antd';
import DataTable from './DataTable';



const dot_name = [
  {
    value: 'yx_dm_1',
    title: 'YX断面1',
    children: [
      {
        value: 'yx1',
        title: 'YX1',
      },
    ],
  },
];

const data_type = [
  {
    value: 'time_one',
    label: '1小时数据',
  },
  {
    value: 'ltime_two',
    label: '2小时数据',
  },
]

const { RangePicker } = DatePicker

export default function BMWYData_List() {
  const [value, setValue] = useState(undefined);

  const onChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const handleQuery = () => {
    console.log("查询")
  } 
  const handleExport = () => {
    console.log("导出")
  }
  
  

  return (
    <div>
      <div style={{ margin: '20px 0 0 30px' }}>
        {/* <Input placeholder="Basic usage" style={{width:'200px'}} addonBefore='测点名称'/>
        &nbsp;&nbsp; */}
        <span>测点名称:</span><TreeSelect
          showSearch
          style={{ width: '160px' }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder=""
          allowClear
          treeDefaultExpandAll
          onChange={onChange}
          treeData={dot_name}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>数据类型:</span>
        <Select
          defaultValue=""
          style={{ width: 120 }}
          onChange={handleChange}
          options={data_type}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <RangePicker placeholder={["开始日期", "结束日期"]}/>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleQuery}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
      
      <div style={{ margin: '20px 10px 0 20px' }}>
        <DataTable/>
      </div>

    </div>
    
  )
}
