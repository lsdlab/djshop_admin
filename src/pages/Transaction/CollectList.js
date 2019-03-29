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
  Badge,
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ collect, loading }) => ({
  collect,
  loading: loading.models.collect,
}))
@Form.create()
class CollectList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'collect/fetch',
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
      type: 'collect/fetch',
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
      type: 'collect/fetch',
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
        type: 'collect/fetch',
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
          <Col md={8} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="店名/地址" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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
      collect: { data },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '订单SN',
        dataIndex: 'transaction_sn',
      },
      {
        title: '门店名称',
        dataIndex: 'store.name',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '自提时间',
        dataIndex: 'pickup_datetime',
      },
      {
        title: '自提成功',
        dataIndex: 'picked',
        render(text, record, index) {
          if (text) {
            return <Badge status='success' text='已自提' />;
          } else {
            return <Badge status='error' text='未自提' />;
          }
        },
      },
      {
        title: '自提时间',
        dataIndex: 'picked_datetime',
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
            <a onClick={() => this.routerPushDetail(record.transaction)}>订单详情</a>
            <Divider type="vertical" />

            { record.picked ? (
              <a disabled onClick={() => this.routerPushDetail(record.id)}>修改自提信息</a>
            ) : <a onClick={() => this.routerPushDetail(record.id)}>修改自提信息</a>}

            <Divider type="vertical" />
            { record.picked ? (
              <a disabled onClick={() => this.routerPushDetail(record.transaction)}>确认自提</a>
            ) : <a onClick={() => this.routerPushDetail(record.transaction)}>确认自提</a>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="自提列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {<div className={styles.tableListForm}>{this.renderSimpleForm()}</div>}
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

export default CollectList;
