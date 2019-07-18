import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from '../SmallTable/index.less';


class SmallTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
  }

  render() {
    const {
      data: { results, count },
      loading,
      columns,
      size,
      rowKey,
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
