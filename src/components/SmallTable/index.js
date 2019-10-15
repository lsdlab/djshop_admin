import React, { PureComponent, Fragment } from 'react';
import { Table } from 'antd';
import styles from '../SmallTable/index.less';


class SmallTable extends PureComponent {

  render() {
    const {
      data: { results },
      loading,
      columns,
      size,
    } = this.props;

    return (
      <div className={styles.simpleTable}>
        <Table
          loading={loading}
          rowKey={results => results.id}
          dataSource={results}
          columns={columns}
          size={size || 'default'}
          pagination={false}
        />
      </div>
    );
  }
}

export default SmallTable;
