import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../SimpleTable/index.less';


class SmallNonPaginationlTable extends PureComponent {

  render() {
    const {
      data: { results },
      columns,
    } = this.props;

    return (
      <div className={styles.simpleTable}>
        <Table
          rowKey={results => results.id}
          dataSource={results}
          columns={columns}
          pagination={false}
          size={'small'}
        />
      </div>
    );
  }
}

export default SmallNonPaginationlTable;
