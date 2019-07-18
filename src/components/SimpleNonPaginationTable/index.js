import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from '../SimpleNonPaginationTable/index.less';


class SimpleNonPaginationTable extends PureComponent {
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
      data: { results, count },
      loading,
      columns,
      size,
      rowKey,
    } = this.props;

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      defaultPageSize: 1000,
      total: count,
      showTotal: total => `共 ${total} 条`
    };

    return (
      <div className={styles.simpleTable}>
        <Table
          loading={loading}
          rowKey={results => results.id}
          dataSource={results}
          columns={columns}
          size={size || 'default'}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SimpleNonPaginationTable;
