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
        name: props.values.name,
        mobile: props.values.mobile,
        note: props.values.note,
        pickup_datetime: props.values.pickup_datetime,
        store: props.values.store.id,
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('name', {
            initialValue: modalFormVals.name,
            rules: [{ required: true, message: "请输入姓名！" }],
          })(<Input placeholder="姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
          {form.getFieldDecorator('mobile', {
            initialValue: modalFormVals.mobile,
            rules: [{ required: true, message: "请输入手机号！" }],
          })(<Input placeholder="副标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('note', {
            initialValue: modalFormVals.note,
            rules: [{ required: false, message: "请输入备注！" }],
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder="备注" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="自提时间">
          {form.getFieldDecorator('pickup_datetime', {
            initialValue: moment(modalFormVals.pickup_datetime, timeFormat),
            rules: [{ required: true, message: '请选择自提时间！' }],
          })(<DatePicker
                showTime
                placeholder="自提时间"
                format={timeFormat}
                style={{ width: '100%' }}
              />)}
        </FormItem>
        { allStoreIds ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="门店">
            {form.getFieldDecorator('store', {
                initialValue: modalFormVals.store,
                rules: [{ required: true, message: '请选择门店！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="门店" showSearch={true} optionFilterProp="name">
                  {buildOptions(allStoreIds)}
                </Select>
              )}
          </FormItem>
        ) : null}
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
    const params = {
      pickup_datetime: moment(fields.pickup_datetime).format(timeFormat),
      ...fields,
    };
    dispatch({
      type: 'refund/patch',
      payload: params,
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

  confirmPickup = (transactionID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/confirmCollectPickup',
      transactionID: transactionID,
    }).then(() => {
      message.success('确认自提成功！');
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
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
            ) : <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>}

            <Divider type="vertical" />

            { record.audit == '1' ? (
              <Popconfirm title="是否要允许此退货？" onConfirm={() => this.confirmPickup(record.transaction)}>
                <a>允许</a>
              </Popconfirm>
            ) : null}

            <Divider type="vertical" />

            { record.audit == '1' ? (
              <Popconfirm title="是否要撤销此退货？" onConfirm={() => this.confirmPickup(record.transaction)}>
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
              scroll={{ x: 1800 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CollectList;
