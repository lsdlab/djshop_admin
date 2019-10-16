import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Card,
  Badge,
  Drawer,
  Tooltip,
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

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    this.setState({
      currentPage: pagination.current,
    });

    dispatch({
      type: 'groupon/fetch',
      payload: params,
    });
  };

  render() {
    const {
      groupon: { data, logData },
      loading,
    } = this.props;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '商品名称',
        dataIndex: 'groupon_product.product_spec.product.name',
        render(text, record) {
          if (text.length > 12) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 6) + '...' + text.substr(text.length - 6)}</span>
              </Tooltip>);
          } else {
            return text;
          }
        },
      },
      {
        title: '商品规格名称',
        dataIndex: 'groupon_product.product_spec.name',
      },
      {
        title: '用户',
        dataIndex: 'user.nickname',
      },
      {
        title: '剩余数量',
        dataIndex: 'nums',
      },
      {
        title: '状态',
        dataIndex: 'dealed',
        render(text) {
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
            <a onClick={() => this.showDrawer(true, record)}>团购记录</a>
          </Fragment>
        ),
      },
    ];

    const drawerColumns = [
      {
        title: '用户',
        dataIndex: 'user.nickname',
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
      <PageHeaderWrapper title="团购列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1380 }}
              current={this.state.currentPage}
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
            <p style={{ ...pStyle, marginBottom: 24 }}>团购记录</p>
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
