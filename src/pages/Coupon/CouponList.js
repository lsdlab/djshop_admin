import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ coupon, loading }) => ({
  coupon,
  loading: loading.models.coupon,
}))
@Form.create()
class CouponList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    formValues: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coupon/fetch',
      payload: {
        type: 'normal',
      },
    });
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
      coupon: { data },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

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
        title: '是否删除',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='已删除' />;
          } else {
            return <Badge status='success' text='未删除' />;
          }
        },
      },
      {
        title: '是否启用',
        dataIndex: 'in_use',
        render(text, record, index) {
          if (text) {
            return <Badge status='success' text='启用' />;
          } else {
            return <Badge status='error' text='未启用' />;
          }
        },
      },
      {
        title: '达到价格',
        dataIndex: 'reach_price',
        render(text, record) {
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
        render(text, record) {
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
        render(text, record) {
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
        render: (text, record) => (
          <Fragment>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>领取详情</a>
          </Fragment>
        ),
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
              scroll={{ x: 1800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponList;
