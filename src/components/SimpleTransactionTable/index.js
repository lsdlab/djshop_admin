import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../SimpleNonPaginationTable/index.less';


class SimpleTransactionTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  render() {
    const {
      data,
      columns,
      size,
    } = this.props;

    return (
      <div className={styles.simpleTable}>
        <Table
          rowKey={results => results.id}
          dataSource={data}
          columns={columns}
          size={size || 'default'}
          pagination={false}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SimpleTransactionTable;
