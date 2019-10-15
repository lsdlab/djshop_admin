import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../SimpleTable/index.less';


class SimpleTable extends PureComponent {

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
      scroll,
      size,
      current,
    } = this.props;

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: true,
      defaultPageSize: 20,
      total: count,
      current: current,
      hideOnSinglePage: true,
      showTotal: total => `共 ${total} 条`
    };

    return (
      <div className={styles.simpleTable}>
        <Table
          loading={loading}
          rowKey={results => results.id}
          dataSource={results}
          columns={columns}
          scroll={scroll}
          size={size || 'default'}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SimpleTable;
