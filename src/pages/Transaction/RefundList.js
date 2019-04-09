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
const timeFormat= "YYYY-MM-DD HH:mm:ss";

const buildOptions = (optionData) => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(<Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>{optionData[i].combined_name}</Option>)
    }
    return arr;
  }
}

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalFormVals: {
        refund_price: props.values.refund_price,
      },
    };
  }

  render() {
    const { updateModalVisible, allStoreIds, form, handleUpdate, handleUpdateModalVisible } = this.props;
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
        title="修改退货信息"
        width={800}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退货金额">
          {form.getFieldDecorator('refund_price', {
            initialValue: modalFormVals.refund_price,
            rules: [{ required: true, message: "请输入退货金额" }],
          })(<InputNumber min={0.01} step={0.01} style={{ width: "100%" }} placeholder="退货金额" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ refund, loading }) => ({
  refund,
  loading: loading.models.refund,
}))
@Form.create()
class CollectList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 20,
    formValues: {},
    updateModalVisible: false,
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/fetch',
    });
  }

  routerPushDetail = (transactionID) => {
    router.push('/transaction/transaction-detail/' + transactionID);
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'refund/fetch',
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
      type: 'refund/fetch',
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
        type: 'refund/fetch',
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
        type: 'refund/fetchStoreAllIds',
      });
    }
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/auditRefund',
      payload: fields,
      transactionID: this.state.currentRecord.transaction,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'refund/fetch',
        payload: {},
      });
    });
  };

  auditRefund = (transactionID, refundPrice) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/auditRefund',
      payload: {
        "auditor": JSON.parse(localStorage.getItem('currentUser'))['userid'],
        "audit": "2"
      },
      transactionID: transactionID,
    }).then(() => {
      message.success('允许退货成功！');
      dispatch({
        type: 'refund/fetch',
      });
    });
  };

  withdrawRefund = (transactionID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/withdrawRefund',
      transactionID: transactionID,
    }).then(() => {
      message.success('撤销退货成功！');
      dispatch({
        type: 'refund/fetch',
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
      refund: { data },
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
      {
        title: '订单SN',
        dataIndex: 'transaction_sn',
      },
      {
        title: '退货类型',
        dataIndex: 'refund_type_name',
      },
      {
        title: '退货金额',
        dataIndex: 'refund_price',
      },
      {
        title: '用户名',
        dataIndex: 'user',
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
      },
      {
        title: '审核进度',
        dataIndex: 'audit_name',
      },
      {
        title: '审核时间',
        dataIndex: 'audit_datetime',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '审核备注',
        dataIndex: 'audit_note',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '快递',
        dataIndex: 'shipper',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '快递单号',
        dataIndex: 'shipper_sn',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '退货发出快递时间',
        dataIndex: 'refund_enter_ship_info_datetime',
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

            {/*<a onClick={() => this.routerPushDetail(record.transaction)}>详情</a>
            <Divider type="vertical" />*/}

            { record.audit == '1' ? (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改金额</a>
            ) : <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>修改金额</a>}

            { record.audit == '1' ? (
              <Divider type="vertical" />
            ) : null}

            { record.audit == '1' ? (
              <Popconfirm title="是否要允许此退货？" onConfirm={() => this.auditRefund(record.transaction, refundPrice)}>
                <a>允许</a>
              </Popconfirm>
            ) : null}

            { record.audit == '1' ? (
              <Divider type="vertical" />
            ) : null}

            { record.audit == '1' ? (
              <Popconfirm title="是否要撤销此退货？" onConfirm={() => this.withdrawRefund(record.transaction)}>
                <a>撤销</a>
              </Popconfirm>
            ) : null}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="退货列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {<div className={styles.tableListForm}>{this.renderSimpleForm()}</div>}
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1820 }}
              onChange={this.handleStandardTableChange}
            />
          </div>

          {currentRecord && Object.keys(currentRecord).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={currentRecord}
            />
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CollectList;
