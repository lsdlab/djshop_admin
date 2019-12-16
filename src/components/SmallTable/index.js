import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../SmallTable/index.less';


class SmallTable extends PureComponent {

  render() {
    const {
      data: { results },
      loading,
      columns,
      size,
      scroll
    } = this.props;

    return (
      <div className={styles.simpleTable}>
        <Table
          loading={loading}
          rowKey={results => results.id}
          dataSource={results}
          columns={columns}
          pagination={false}
          size={size || 'default'}
          scroll={scroll}
        />
      </div>
    );
  }
}

export default SmallTable;
