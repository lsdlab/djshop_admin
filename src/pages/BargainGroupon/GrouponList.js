import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Badge,
  Drawer,
  Table,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import SmallTable from '@/components/SmallTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';


const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};


/* eslint react/no-multi-comp:0 */
@connect(({ groupon, loading }) => ({
  groupon,
  loading: loading.models.groupon,
}))
class GrouponList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupon/fetch',
    });
  }

  showDrawer = (flag, currentRecord) => {
    this.setState({
      visible: !!flag,
    });

    if (flag && currentRecord) {
      this.setState({
        currentRecord: currentRecord,
      });

      this.props.dispatch({
        type: 'groupon/fetchLog',
        grouponID: currentRecord.id,
      });
    } else {
      this.setState({
        currentRecord: {},
      });
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      groupon: { data, logData },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '商品名称',
        dataIndex: 'groupon_product.product_spec.product.name',
      },
      {
        title: '商品规格名称',
        dataIndex: 'groupon_product.product_spec.name',
      },
      {
        title: '用户',
        dataIndex: 'user.username',
      },
      {
        title: '剩余数量',
        dataIndex: 'nums',
      },
      {
        title: '状态',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='结束' />;
          } else {
            return <Badge status='success' text='进行中' />;
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'start_datetime',
      },
      {
        title: '结束时间',
        dataIndex: 'end_datetime',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showDrawer(true, record)}>拼团记录</a>
          </Fragment>
        ),
      },
    ];

    const drawerColumns = [
      {
        title: '注册用户',
        dataIndex: 'user.username',
        render(text, record) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
    ];

    return (
      <PageHeaderWrapper title="拼团列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1380 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Drawer
            width={800}
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <p style={{ ...pStyle, marginBottom: 24 }}>拼团记录</p>
            <Row>
              {logData && Object.keys(logData).length ? (
                <SmallTable
                  size='small'
                  data={logData}
                  columns={drawerColumns}
                />
              ) : null}
            </Row>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default GrouponList;
