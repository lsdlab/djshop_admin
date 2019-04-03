import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  DatePicker,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const timeFormat= "YYYY-MM-DD HH:mm:ss";


/* eslint react/no-multi-comp:0 */
@connect(({ invoice, loading }) => ({
  invoice,
  loading: loading.models.invoice,
}))
@Form.create()
class InvoiceList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/fetch',
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
      type: 'invoice/fetch',
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
      type: 'invoice/fetch',
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
        type: 'invoice/fetch',
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
              {getFieldDecorator('search')(<Input placeholder="抬头/描述" />)}
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
      invoice: { data },
      loading,
    } = this.props;
    const { currentPage, pageSize, updateModalVisible, currentRecord } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      // {
      //   title: '订单SN',
      //   dataIndex: 'transaction_sn',
      // },
      {
        title: '发票类型',
        dataIndex: 'type_name',
      },
      {
        title: '抬头',
        dataIndex: 'title',
      },
      {
        title: '金额',
        dataIndex: 'price',
      },
      {
        title: '税号',
        dataIndex: 'company_tx_sn',
      },
      {
        title: '是否开具',
        dataIndex: 'issued',
        render(text, record, index) {
          if (text) {
            return <Badge status='success' text='已开具' />;
          } else {
            return <Badge status='error' text='未开具' />;
          }
        },
      },
      {
        title: '开具时间',
        dataIndex: 'issued_datetime',
        render(text) {
          if (text) {
            return text
          } else {
            return "-"
          }
        },
      },
      {
        title: '是否发出',
        dataIndex: 'shipped',
        render(text, record, index) {
          if (text) {
            return <Badge status='success' text='已发出' />;
          } else {
            return <Badge status='error' text='未发出' />;
          }
        },
      },
      {
        title: '发出时间',
        dataIndex: 'shipped_datetime',
        render(text) {
          if (text) {
            return text
          } else {
            return "-"
          }
        },
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
              <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>修改发票信息</a>
            ) : <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改发票信息</a>}

            <Divider type="vertical" />

            { record.issued ? (
              null
            ) : <Popconfirm title="是否要确认已开具此订单发票？" >
                <a>已开具</a>
              </Popconfirm>}

            <Divider type="vertical" />

            { record.shipped ? (
              null
            ) : <Popconfirm title="是否要确认已发出此订单发票？" >
                <a>已发出</a>
              </Popconfirm>}

          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="发票列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {<div className={styles.tableListForm}>{this.renderSimpleForm()}</div>}
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1200 }}
              onChange={this.handleStandardTableChange}
            />
          </div>

          {currentRecord && Object.keys(currentRecord).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={currentRecord}
              allStoreIds={allStoreIds}
            />
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InvoiceList;
