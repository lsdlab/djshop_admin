import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Divider, Badge, Drawer } from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

/* eslint react/no-multi-comp:0 */
@connect(({ coupon, loading }) => ({
  coupon,
  loading: loading.models.coupon,
}))
@Form.create()
class CouponList extends PureComponent {
  state = {
    currentPage: 1,
    formValues: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coupon/fetch',
      payload: {},
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
        type: 'coupon/fetchLog',
        couponID: currentRecord.id,
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

  routerPushDetail = record => {
    router.push({ pathname: '/coupon/coupon-edit/' + record.id, state: { currentRecord: record } });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'coupon/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'coupon/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'coupon/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="名称/描述" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="normal">普通优惠卷</Option>
                  <Option value="vip">会员优惠卷</Option>
                  <Option value="points">积分优惠卷</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      coupon: { data, logData },
      loading,
    } = this.props;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type_name',
      },
      {
        title: '内部类型',
        dataIndex: 'internal_type_name',
      },
      {
        title: '已有领用',
        dataIndex: 'logged',
        render(text, record, index) {
          if (text) {
            return <Badge status="success" text="已领用" />;
          } else {
            return <Badge status="error" text="未领用" />;
          }
        },
      },
      {
        title: '是否启用',
        dataIndex: 'in_use',
        render(text) {
          if (text) {
            return <Badge status="success" text="启用" />;
          } else {
            return <Badge status="error" text="未启用" />;
          }
        },
      },
      {
        title: '达到价格',
        dataIndex: 'reach_price',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '达到件数',
        dataIndex: 'reach_unit',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '折扣价格',
        dataIndex: 'discount_price',
      },
      {
        title: '商品',
        dataIndex: '',
      },
      {
        title: '分类',
        dataIndex: '',
      },
      {
        title: '所需积分',
        dataIndex: 'points',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
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
            {record.in_use && record.logged ? (
              <a disabled onClick={() => this.routerPushDetail(record)}>
                编辑
              </a>
            ) : (
              <a onClick={() => this.routerPushDetail(record)}>编辑</a>
            )}

            <Divider type="vertical" />
            <a onClick={() => this.showDrawer(true, record)}>领取详情</a>
          </Fragment>
        ),
      },
    ];

    const drawerColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '领取用户',
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
        title: '领取时间',
        dataIndex: 'created_at',
      },
      {
        title: '是否使用',
        dataIndex: 'used',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '使用时间',
        dataIndex: 'used_datetime',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
    ];

    return (
      <PageHeaderWrapper title="优惠卷">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1700 }}
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
            <p style={{ ...pStyle, marginBottom: 24 }}>优惠卷领取记录</p>
            <Row>
              {logData && Object.keys(logData).length ? (
                <SimpleTable data={logData} columns={drawerColumns} pagination={false} size={'small'}/>
              ) : null}
            </Row>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponList;
