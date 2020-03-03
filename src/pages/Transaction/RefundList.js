import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
  Drawer
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '../List/TableList.less';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const FormItem = Form.Item;
const { Description } = DescriptionList;

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
    const {
      updateModalVisible,
      form,
      handleAudit,
      handleAuditModalVisible,
    } = this.props;
    const { modalFormVals } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleAudit(fieldsValue);
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
        onCancel={() => handleAuditModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退货金额">
          {form.getFieldDecorator('refund_price', {
            initialValue: modalFormVals.refund_price,
            rules: [{ required: true, message: '请输入退货金额' }],
          })(
            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="退货金额" />
          )}
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
    formValues: {},
    updateModalVisible: false,
    currentRecord: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/fetch',
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
    } else {
      this.setState({
        currentRecord: {},
      });
    }
  };

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

  handleAuditModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      // currentRecord: record || {},
    });

    if (flag) {
      this.props.dispatch({
        type: 'refund/fetchStoreAllIds',
      });
    }
  };

  handleAudit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/auditRefund',
      payload: fields,
      transactionID: this.state.currentRecord.transaction,
    }).then(() => {
      message.success('更新退货成功');
      this.handleAuditModalVisible();
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
        auditor: JSON.parse(localStorage.getItem('currentUser'))['userid'],
        audit: '2',
      },
      transactionID: transactionID,
    }).then(() => {
      message.success('审批退货成功');
      dispatch({
        type: 'refund/fetch',
      });
    });
  };

  withdrawRefund = transactionID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/withdrawRefund',
      transactionID: transactionID,
    }).then(() => {
      message.success('撤销退货成功');
      dispatch({
        type: 'refund/fetch',
      });
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
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
            <FormItem label="订单SN">{getFieldDecorator('sn')(<Input placeholder="订单SN" />)}</FormItem>
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
    const { updateModalVisible, currentRecord } = this.state;

    const updateMethods = {
      handleAuditModalVisible: this.handleAuditModalVisible,
      handleAudit: this.handleAudit,
    };

    const columns = [
      {
        title: '订单SN',
        dataIndex: 'transaction_sn',
      },
      {
        title: '退货类型',
        dataIndex: 'refund_type_name',
      },
      {
        title: '用户',
        dataIndex: 'user',
      },
      {
        title: '退货金额',
        dataIndex: 'refund_price',
      },
      {
        title: '审核进度',
        dataIndex: 'audit_name',
        render(_, record) {
          if (record.audit == '1') {
            return <Badge status="error" text='审核中' />;
          } else if (record.audit == '2') {
            return <Badge status="success" text='审核通过' />;
          }
        },
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (_, record) => (
          <Fragment>
            <a onClick={() => this.routerPushDetail(record.transaction)}>订单</a>
            <Divider type="vertical" />
            <a onClick={() => this.showDrawer(true, record)}>详情</a>
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
              scroll={{ x: 1180 }}
              current={this.state.currentPage}
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

          <Drawer
            width={800}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <Card
              title="退货操作"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              {currentRecord.audit == '1' ? (
                <Button onClick={() => this.handleAuditModalVisible(true, currentRecord)}>修改金额</Button>
              ) : (
                <Button disabled onClick={() => this.handleAuditModalVisible(true, currentRecord)}>
                  修改金额
                </Button>
              )}

              {currentRecord.audit == '1' ? <Divider type="vertical" /> : null}

              {currentRecord.audit == '1' ? (
                <Popconfirm
                  title="是否要允许此退货？"
                  onConfirm={() => this.auditRefund(currentRecord.transaction, refundPrice)}
                >
                  <Button>允许</Button>
                </Popconfirm>
              ) : null}

              {currentRecord.audit == '1' ? <Divider type="vertical" /> : null}

              {currentRecord.audit == '1' ? (
                <Popconfirm
                  title="是否要撤销此退货？"
                  onConfirm={() => this.withdrawRefund(currentRecord.transaction)}
                >
                  <Button>撤销</Button>
                </Popconfirm>
              ) : null}
            </Card>

            <Card
              title="退货详情"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <DescriptionList style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <Description term="审核进度">{currentRecord.audit_name}</Description>
                </Col>
                <Col span={12}>
                  <Description term="审核人">{currentRecord.auditor}</Description>
                </Col>
                <Col span={12}>
                  <Description term="审核时间">{currentRecord.audit_datetime ? currentRecord.audit_datetime : '-' }</Description>
                </Col>
                <Col span={12}>
                  <Description term="审核备注">{currentRecord.audit_note ? currentRecord.audit_note : '-'}</Description>
                </Col>
              </DescriptionList>
              <DescriptionList style={{ marginBottom: 24 }}>
                <Col span={12}>
                <Description term="快递名称">{currentRecord.shipper ? currentRecord.shipper : '-'}</Description>
                </Col>
                <Col span={12}>
                <Description term="快递单号">{currentRecord.shipper_sn ? currentRecord.shipper_sn : '-'}</Description>
                </Col>
                <Col span={12}>
                <Description term="快递发出时间">{currentRecord.refund_enter_ship_info_datetime ? currentRecord.refund_enter_ship_info_datetime : '-'}</Description>
                </Col>
              </DescriptionList>
              <DescriptionList style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <Description term="创建时间">{currentRecord.created_at}</Description>
                </Col>
                <Col span={12}>
                  <Description term="更新时间">{currentRecord.updated_at}</Description>
                </Col>
              </DescriptionList>
            </Card>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CollectList;
