import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../SimpleTable/index.less';


class SimpleListTable extends PureComponent {

  render() {
    const {
      data,
      columns,
    } = this.props;

    return (
      <div className={styles.simpleTable}>
        <Table
          rowKey={results => results.id}
          dataSource={data}
          columns={columns}
          size={'default'}
          pagination={false}
        />
      </div>
    );
  }
}

export default SimpleListTable;
