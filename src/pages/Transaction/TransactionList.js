import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Divider,
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ transaction, loading }) => ({
  transaction,
  loading: loading.models.transaction,
}))
@Form.create()
class TransactionList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/fetch',
    });
  }

  routerPushDetail = (transactionID) => {
    router.push('/transaction/transaction-detail/' + transactionID);
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'transaction/fetch',
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
      type: 'transaction/fetch',
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
        type: 'transaction/fetch',
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
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="sn">
              {getFieldDecorator('sn')(<Input placeholder="sn" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="用户名/备注" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">创建订单成功-待支付</Option>
                  <Option value="2">支付超时-订单关闭</Option>
                  <Option value="3">手动关闭订单</Option>
                  <Option value="4">支付完成-待收货</Option>
                  <Option value="5">已收货-待评价</Option>
                  <Option value="6">已评价-交易完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
      transaction: { data, userAllAddress },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: 'sn',
        dataIndex: 'sn',
      },
      {
        title: '用户名',
        dataIndex: 'user.username',
      },
      {
        title: '状态',
        dataIndex: 'status_name',
      },
      {
        title: '支付渠道',
        dataIndex: 'payment_name',
      },
      {
        title: '类型',
        dataIndex: 'deal_type_name',
      },
      {
        title: '总价',
        dataIndex: 'total_amount',
      },
      {
        title: '实付',
        dataIndex: 'paid',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.routerPushDetail(record.id)}>详情</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="订单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1480 }}
              onChange={this.handleStandardTableChange}
            />
          </div>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TransactionList;
