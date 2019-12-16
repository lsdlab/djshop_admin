import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
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

const buildOptions = optionData => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(
        <Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>
          {optionData[i].combined_name}
        </Option>
      );
    }
    return arr;
  }
};

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalFormVals: {
        type: props.values.type,
        title: props.values.title,
        price: props.values.price,
        company_tax_sn: props.values.company_tax_sn,
        issued: props.values.issued,
        issued_datetime: props.values.issued_datetime,
        shipped: props.values.shipped,
        shipped_datetime: props.values.shipped_datetime,
        address: props.values.address,
        note: props.values.note,
      },
    };
  }

  render() {
    const {
      updateModalVisible,
      userAllAddress,
      form,
      handleUpdate,
      handleUpdateModalVisible,
    } = this.props;
    const { modalFormVals } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="修改发票信息"
        width={800}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发票类型">
          {form.getFieldDecorator('type', {
            initialValue: modalFormVals.type,
            rules: [{ required: true, message: '请选择发票类型！' }],
          })(
            <Select style={{ width: '100%' }}>
              <Option value="1">普通发票</Option>
              <Option value="2">公司发票</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="抬头">
          {form.getFieldDecorator('title', {
            initialValue: modalFormVals.title,
            rules: [{ required: true, message: '请输入抬头！' }],
          })(<Input placeholder="抬头" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开票金额">
          {form.getFieldDecorator('price', {
            initialValue: modalFormVals.price,
            rules: [{ required: true, message: '请输入开票金额！' }],
          })(
            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="开票金额" />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="税号">
          {form.getFieldDecorator('company_tax_sn', {
            initialValue: modalFormVals.company_tax_sn,
            rules: [{ required: true, message: '请输入税号！' }],
          })(<Input placeholder="税号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地址">
          {form.getFieldDecorator('address', {
            initialValue: modalFormVals.address
              ? modalFormVals.address.name +
                '-' +
                modalFormVals.address.mobile +
                '-' +
                modalFormVals.address.address
              : '',
            rules: [{ required: false, message: '请选择地址！' }],
          })(
            <Select style={{ width: '100%' }} placeholder="地址">
              {buildOptions(userAllAddress)}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('note', {
            initialValue: modalFormVals.note,
            rules: [{ required: false, message: '请输入备注！' }],
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder="备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

@Form.create()
class ViewForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalFormVals: {
        address: props.values.address,
        note: props.values.note,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  render() {
    const { viewModalVisible, form, handleViewModalVisible } = this.props;
    const { modalFormVals } = this.state;

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="地址"
        width={800}
        visible={viewModalVisible}
        footer={null}
        onCancel={() => handleViewModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          <span>{modalFormVals.address ? modalFormVals.address.name : ''}</span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
          <span>{modalFormVals.address ? modalFormVals.address.mobile : ''}</span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地址">
          <span>{modalFormVals.address ? modalFormVals.address.address : ''}</span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          <span>{modalFormVals.note}</span>
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ invoice, loading }) => ({
  invoice,
  loading: loading.models.invoice,
}))
@Form.create()
class InvoiceList extends PureComponent {
  state = {
    currentPage: 1,
    formValues: {},
    updateModalVisible: false,
    viewModalVisible: false,
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/fetch',
    });
  }

  routerPushDetail = transactionID => {
    router.push('/transaction/transaction-detail/' + transactionID);
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

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      currentRecord: record || {},
    });

    if (flag) {
      this.props.dispatch({
        type: 'invoice/fetchUserAllAddress',
        userID: record.user_sn,
      });
    }
  };

  handleViewModalVisible = (flag, record) => {
    this.setState({
      viewModalVisible: !!flag,
      currentRecord: record || {},
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/patch',
      payload: fields,
      transactionID: this.state.currentRecord.transaction,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'invoice/fetch',
        payload: {},
      });
    });
  };

  issuedInvoice = transactionID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/patch',
      payload: {
        issued: true,
        issued_datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      },
      recProductID: recProductID,
    }).then(() => {
      message.success('开具发票成功！');
      dispatch({
        type: 'invoice/fetch',
      });
    });
  };

  shippedInvoice = transactionID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/patch',
      payload: {
        shipped: true,
        shipped_datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      },
      recProductID: recProductID,
    }).then(() => {
      message.success('发出发票成功！');
      dispatch({
        type: 'invoice/fetch',
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
            <FormItem label="sn">{getFieldDecorator('sn')(<Input placeholder="sn" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="抬头/备注" />)}
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
      invoice: { data, userAllAddress },
      loading,
    } = this.props;
    const { updateModalVisible, viewModalVisible, currentRecord } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const viewMethods = {
      handleViewModalVisible: this.handleViewModalVisible,
    };

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
        dataIndex: 'company_tax_sn',
      },
      {
        title: '是否开具',
        dataIndex: 'issued',
        render(text, record, index) {
          if (text) {
            return <Badge status="success" text="已开具" />;
          } else {
            return <Badge status="error" text="未开具" />;
          }
        },
      },
      {
        title: '开具时间',
        dataIndex: 'issued_datetime',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '是否发出',
        dataIndex: 'shipped',
        render(text, record, index) {
          if (text) {
            return <Badge status="success" text="已发出" />;
          } else {
            return <Badge status="error" text="未发出" />;
          }
        },
      },
      {
        title: '发出时间',
        dataIndex: 'shipped_datetime',
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
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.routerPushDetail(record.transaction)}>订单</a>
            <Divider type="vertical" />

            {record.picked ? (
              <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>
                修改
              </a>
            ) : (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
            )}

            <Divider type="vertical" />
            <a onClick={() => this.handleViewModalVisible(true, record)}>地址</a>

            <Divider type="vertical" />

            {record.issued ? null : (
              <Popconfirm
                title="是否要确认已开具此订单发票？"
                onConfirm={() => this.issuedInvoice(record.id)}
              >
                <a>已开具</a>
              </Popconfirm>
            )}

            <Divider type="vertical" />

            {record.shipped ? null : (
              <Popconfirm
                title="是否要确认已发出此订单发票？"
                onConfirm={() => this.shippedInvoice(record.id)}
              >
                <a>已发出</a>
              </Popconfirm>
            )}
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
              scroll={{ x: 1480 }}
              current={this.state.currentPage}
              onChange={this.handleStandardTableChange}
            />
          </div>

          {currentRecord && Object.keys(currentRecord).length ? (
            <ViewForm {...viewMethods} viewModalVisible={viewModalVisible} values={currentRecord} />
          ) : null}

          {currentRecord && Object.keys(currentRecord).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={currentRecord}
              userAllAddress={userAllAddress}
            />
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InvoiceList;
