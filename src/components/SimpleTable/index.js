import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from '../SimpleTable/index.less';


class SimpleTable extends PureComponent {
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
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 10,
      total: count,
    };

    return (
      <div className={styles.simpleTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
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

export default SimpleTable;
