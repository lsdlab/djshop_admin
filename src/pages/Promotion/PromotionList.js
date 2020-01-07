import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Card, Badge, Drawer, Tooltip } from 'antd';
import SimpleTable from '@/components/SimpleTable';
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
@connect(({ promotion, loading }) => ({
  promotion,
  loading: loading.models.promotion,
}))
class PromotionList extends PureComponent {
  state = {
    currentPage: 1,
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'promotion/fetch',
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
        type: 'promotion/fetchLog',
        promotionID: currentRecord.id,
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

  handleStandardTableChange = pagination => {
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
      type: 'promotion/fetch',
      payload: params,
    });
  };

  render() {
    const {
      promotion: { data, logData },
      loading,
    } = this.props;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '商品名称',
        dataIndex: 'promotion_product.product_spec.product.name',
        render(text) {
          if (text.length > 8) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 4) + '...' + text.substr(text.length - 4)}</span>
              </Tooltip>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '规格名称',
        dataIndex: 'promotion_product.product_spec.name',
      },
      {
        title: '用户',
        dataIndex: 'user.nickname',
      },
      {
        title: '促销类型',
        dataIndex: 'promotion_type_name',
        render(text, record) {
          if (record.promotion_type == '1') {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else if (record.promotion_type == '2') {
            return <span style={{ color: 'green' }}>{text}</span>;
          } else if (record.promotion_type == '3') {
            return <span style={{ color: 'yellow' }}>{text}</span>;
          }
        },
      },
      {
        title: '当前加入',
        dataIndex: 'current_nums',
      },
      {
        title: '砍价当前价(团购/秒杀价)',
        dataIndex: 'current_price',
      },
      {
        title: '起始价',
        dataIndex: 'promotion_product.bargain_start_price',
        render(text, record) {
          if (record.promotion_type == '1') {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '结束价',
        dataIndex: 'promotion_product.bargain_end_price',
        render(text, record) {
          if (record.promotion_type == '1') {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'dealed',
        render(text) {
          if (text) {
            return <Badge status="success" text="结束" />;
          } else {
            return <Badge status="error" text="进行中" />;
          }
        },
      },
      {
        title: '创建订单',
        dataIndex: 'transaction_created',
        render(text) {
          if (text) {
            return <Badge status="success" text="已创建" />;
          } else {
            return <Badge status="error" text="未创建" />;
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
        title: '操作',
        fixed: 'right',
        render: (_, record) => (
          <Fragment>
            <a onClick={() => this.showDrawer(true, record)}>促销记录</a>
          </Fragment>
        ),
      },
    ];

    const drawerColumns = [
      {
        title: '用户',
        dataIndex: 'user.nickname',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '开始价格',
        dataIndex: 'bargain_from_price',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '结束价格',
        dataIndex: 'bargain_to_price',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '折扣',
        dataIndex: 'bargain_discount',
        render(text) {
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
      <PageHeaderWrapper title="促销列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1620 }}
              current={this.state.currentPage}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Drawer
            width={800}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <p style={{ ...pStyle, marginBottom: 24 }}>促销参与记录</p>
            <Row>
              {logData && Object.keys(logData).length ? (
                <SimpleTable data={logData} columns={drawerColumns} />
              ) : null}
            </Row>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PromotionList;
