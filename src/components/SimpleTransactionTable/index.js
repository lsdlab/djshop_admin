import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
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
      loading,
      columns,
      size,
      rowKey,
    } = this.props;

    const total = data.length;

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      defaultPageSize: 1000,
      total: total,
      showTotal: total => `共 ${total} 件商品`
    };

    return (
      <div className={styles.simpleTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          dataSource={data}
          columns={columns}
          size={size || 'default'}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SimpleTransactionTable;
