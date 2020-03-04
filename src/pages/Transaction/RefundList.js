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
  Drawer
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '../List/TableList.less';

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
        title="修改退货金额"
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
    currentRefundTransactionID: '',
    visible: false,
    childrenDrawer: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/fetch',
    });
  }

  showDrawer = (flag, currentRefundTransactionID) => {
    this.setState({
      visible: !!flag,
      currentRefundTransactionID: currentRefundTransactionID
    });

    if (flag && currentRefundTransactionID) {
      this.props.dispatch({
        type: 'refund/fetchRefund',
        transactionID: currentRefundTransactionID,
      })
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showChildrenDrawer = () => {
    this.props.dispatch({
      type: 'refund/weixinpaymentRefundQuery',
      params: {
        sn: this.state.currentRefundTransactionID,
        refund_sn: this.state.currentRefundTransactionID,
      },
    });

    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
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
  };

  handleAudit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/auditRefund',
      payload: fields,
      transactionID: this.state.currentRefundTransactionID,
    }).then(() => {
      message.success('修改退货金额成功');
      this.handleAuditModalVisible();
      dispatch({
        type: 'refund/fetchRefund',
        transactionID: this.state.currentRefundTransactionID,
      }).then(() => {
        dispatch({
          type: 'refund/fetch',
        });
      });
    });
  };

  auditRefund = (transactionID, audit) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/auditRefund',
      payload: {
        auditor: JSON.parse(localStorage.getItem('currentUser'))['userid'],
        audit: audit,
      },
      transactionID: transactionID,
    }).then(() => {
      message.success('审批退货成功');
      dispatch({
        type: 'refund/fetchRefund',
        transactionID: this.state.currentRefundTransactionID,
      }).then(() => {
        dispatch({
          type: 'refund/fetch',
          payload: {},
        });
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
        type: 'refund/fetchRefund',
        transactionID: this.state.currentRefundTransactionID,
      }).then(() => {
        dispatch({
          type: 'refund/fetch',
          payload: {},
        });
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
      refund: { data, currentRecord, wxRefundQueryDetail },
      loading,
    } = this.props;
    const { updateModalVisible } = this.state;

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
        render(text, record) {
          if (record.audit == '1' || record.audit == '3') {
            return <span style={{ color: 'red' }}>{text}</span>;;
          } else if (record.audit == '2'|| record.audit == '6'|| record.audit == '4' || record.audit == '5') {
            return <span style={{ color: 'green' }}>{text}</span>;;
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
            <a onClick={() => this.showDrawer(true, record.transaction)}>详情</a>
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
              <Row>
                {currentRecord.audit == '1' ? (
                  <Button onClick={() => this.handleAuditModalVisible(true, currentRecord)}>修改金额</Button>
                ) : (
                  <Button disabled>
                    修改金额
                  </Button>
                )}

                <Divider type="vertical" />

                {currentRecord.audit == '1' ? (
                  <Popconfirm
                    title="是否要允许此退货？"
                    onConfirm={() => this.auditRefund(currentRecord.transaction, '2')}
                  >
                    <Button>允许</Button>
                  </Popconfirm>
                ) : (
                  <Button disabled>
                    允许
                  </Button>
                )}

                <Divider type="vertical" />

                {currentRecord.audit == '1' ? (
                  <Popconfirm
                    title="是否要拒绝此退货？"
                    onConfirm={() => this.auditRefund(currentRecord.transaction, '3')}
                  >
                    <Button>拒绝</Button>
                  </Popconfirm>
                ) : (
                  <Button disabled>
                    拒绝
                  </Button>
                )}

                <Divider type="vertical" />

                {currentRecord.audit == '1' ? (
                  <Popconfirm
                    title="是否要撤销此退货？"
                    onConfirm={() => this.withdrawRefund(currentRecord.transaction)}
                  >
                    <Button>撤销</Button>
                  </Popconfirm>
                ) : (
                  <Button disabled>
                    撤销
                  </Button>
                )}
              </Row>
              <Row style={{ marginTop: 10 }}>
                {currentRecord.audit == '2' ? (
                  <Popconfirm
                    title="是否要退款？"
                    onConfirm={() => this.auditRefund(currentRecord.transaction)}
                  >
                    <Button>退款到微信支付（实时）</Button>
                  </Popconfirm>
                ) : (
                  <Button disabled>
                    退款到微信支付（实时）
                  </Button>
                )}

                <Divider type="vertical" />

                {currentRecord.audit == '2' ? (
                  <Button onClick={this.showChildrenDrawer}>
                    查看微信支付退款详情
                  </Button>
                ) : (
                  <Button onClick={this.showChildrenDrawer}>
                    查看微信支付退款详情
                  </Button>
                )}
              </Row>
            </Card>

            <Card
              title="退货详情"
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <DescriptionList style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <Description term="订单SN">{currentRecord.transaction_sn}</Description>
                </Col>
                <Col span={12}>
                  <Description term="退货SN">{currentRecord.sn}</Description>
                </Col>
                <Col span={12}>
                  <Description term="退货类型">{currentRecord.refund_type_name}</Description>
                </Col>
                <Col span={12}>
                  <Description term="退货金额">{currentRecord.refund_price}</Description>
                </Col>
                <Col span={12}>
                  <Description term="用户">{currentRecord.user}</Description>
                </Col>
              </DescriptionList>
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

            <Drawer
              title="微信支付退款查询"
              width={320}
              closable={false}
              onClose={this.onChildrenDrawerClose}
              visible={this.state.childrenDrawer}
            >
              <Card
                title="退货详情"
                style={{ marginBottom: 24 }}
                bordered={false}
              >
                {wxRefundQueryDetail && Object.keys(wxRefundQueryDetail).length ? (
                  <DescriptionList style={{ marginBottom: 24 }}>
                    <Col span={12}>
                      <Description term="status">{wxRefundQueryDetail.status}</Description>
                    </Col>
                  </DescriptionList>
                ) : null}
              </Card>
            </Drawer>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CollectList;
