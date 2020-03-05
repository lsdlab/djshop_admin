import React, { PureComponent, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Row, Col, Card, Button, Avatar, Steps, Tooltip, message, Drawer } from 'antd';
import router from 'umi/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import SimpleListTable from '@/components/SimpleListTable';
import TransactionDetailCreateExpressModal from './TransactionDetailCreateExpressModal';
import TransactionDetailCreateRefundModal from './TransactionDetailCreateRefundModal';
import TransactionPatchModal from './TransactionPatchModal';
import styles from '../Profile/AdvancedProfile.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { Step } = Steps;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const customDot = (dot, { status }) => dot;

/* eslint react/no-multi-comp:0 */
@connect(({ transaction }) => ({
  transaction,
}))
class TransactionDetail extends PureComponent {
  state = {
    stepDirection: 'horizontal',
    createExpressModalVisible: false,
    patchModalVisible: false,
    createRefundModalVisible: false,
    visible: false,
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const transactionID = pathList[3];

    dispatch({
      type: 'transaction/fetchDetail',
      transactionID: transactionID,
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  showDrawer = (flag, currentTransactionID) => {
    this.setState({
      visible: !!flag,
    });

    if (flag && currentTransactionID) {
      this.props.dispatch({
        type: 'transaction/wxPaymentOrderQuery',
        params: {
          sn: currentTransactionID,
        },
      })
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  routerPushProductDetail = productID => {
    router.push('/product/product-detail/' + productID);
  };

  buildAction(currentRecord) {
    return (
      <Fragment>
        <ButtonGroup>
          {currentRecord ? (
            <CopyToClipboard
              text={`${currentRecord.sn}`}
              onCopy={() => message.success('复制订单SN')}
              style={{ marginTop: 10 }}
            >
              <Button>复制订单SN</Button>
            </CopyToClipboard>
          ) : (
            <Button disabled>复制订单SN</Button>
          )}

          {currentRecord.status == '1' ? (
            <Button onClick={() => this.handlePatchModalVisible(true, currentRecord)}>修改订单</Button>
          ) : (
            <Button disabled>修改订单</Button>
          )}
        </ButtonGroup>

        <ButtonGroup>
          {currentRecord.status == '4' ? (
            <Button onClick={() => this.handleCreateExpressModalVisible(true)}>
              发货
            </Button>
          ) : (
            <Button disabled>发货</Button>
          )}

          {(currentRecord.status == '4' || currentRecord.status == '6' || currentRecord.status == '7') && currentRecord.refunded == false ? (
            <Button onClick={() => this.handleCreateRefundModalVisible(true)}>
              退货
            </Button>
          ) : (
            <Button disabled>退货</Button>
          )}
        </ButtonGroup>
      </Fragment>
    );
  }

  buildExtra(currentRecord) {
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>订单状态</div>
          <div className={styles.heading}>{currentRecord.status_name}</div>
        </Col>
        <Col xs={24} sm={24} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>订单类型</div>
          <div className={styles.heading}>{currentRecord.deal_type_name}</div>
        </Col>
        <Col xs={24} sm={10} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>支付渠道</div>
          <div className={styles.heading}>{currentRecord.payment_name}</div>
        </Col>
        <Col xs={24} sm={7} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>总价</div>
          <div className={styles.heading}>{currentRecord.total_amount}</div>
        </Col>
        <Col xs={24} sm={7} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>实际支付</div>
          <div className={styles.heading}>{currentRecord.paid}</div>
        </Col>
      </Row>
    );
  }

  buildDescription(currentRecord) {
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="创建时间">{currentRecord.created_at}</Description>
        <Description term="更新时间">{currentRecord.updated_at}</Description>
        <Description term="SN">{currentRecord.sn}</Description>
        {currentRecord.user ? (
          <Description term="用户">
            <Avatar size="small" src={currentRecord.user.avatar} style={{ marginRight: 8 }} />
            {currentRecord.user.nickname}
          </Description>
        ) : null}
        <Description term="备注">{currentRecord.note ? currentRecord.note : '-'}</Description>
        <Description term="商家备注">
          {currentRecord.seller_note ? currentRecord.seller_note : '-'}
        </Description>
      </DescriptionList>
    );
  }

  buildCreatedAt(currentRecord) {
    return <span>{currentRecord.created_at}</span>;
  }

  buildClosedAt(currentRecord) {
    return <span>{currentRecord.closed_datetime}</span>;
  }

  buildPaymentAt(currentRecord) {
    return <span>{currentRecord.payment_datetime}</span>;
  }

  buildPackagedAt(currentRecord) {
    return <span>{currentRecord.seller_packaged_datetime}</span>;
  }

  buildReceivedAt(currentRecord) {
    return <span>{currentRecord.received_datetime}</span>;
  }

  buildReviewedAt(currentRecord) {
    return <span>{currentRecord.review_datetime}</span>;
  }

  handleCreateExpressModalVisible = flag => {
    this.setState({
      createExpressModalVisible: !!flag,
    });
  };

  handlePatchModalVisible = (flag, record) => {
    this.setState({
      patchModalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'transaction/fetchUserAllAddress',
        userID: record.user.id,
      });
    }
  };

  handleCreateRefundModalVisible = (flag) => {
    this.setState({
      createRefundModalVisible: !!flag,
    });
  };

  render() {
    const {
      transaction: { currentRecord, userAllAddress, wxQueryOrderDetail },
    } = this.props;
    const { stepDirection, createExpressModalVisible, patchModalVisible, createRefundModalVisible } = this.state;

    const transactionProductColumns = [
      {
        title: '商品ID',
        dataIndex: 'product_spec.product.id',
      },
      {
        title: '商品名称',
        dataIndex: 'product_spec.product.name',
        render(text) {
          if (text.length > 8) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 4) + '...' + text.substr(text.length - 4)}</span>
              </Tooltip>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '规格ID',
        dataIndex: 'product_spec.id',
      },
      {
        title: '规格名称',
        dataIndex: 'product_spec.name',
      },
      {
        title: '数量',
        dataIndex: 'nums',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={() => this.routerPushProductDetail(record.product_spec.product.id)}>详情</a>
          </Fragment>
        ),
      },
    ];

    const reviewColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'user_name',
      },
      {
        title: '评价',
        dataIndex: 'type_name',
      },
      {
        title: '⭐️️',
        dataIndex: 'rate',
      },
      {
        title: '评价内容',
        dataIndex: 'content',
        render(text) {
          if (text.length > 8) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 4) + '...' + text.substr(text.length - 4)}</span>
              </Tooltip>
            );
          } else {
            return text;
          }
        },
      },
    ];

    let stepCurrent = 0;
    if (currentRecord.status == '1') {
      // 创建成功-待支付
      stepCurrent = 0;
    } else if (currentRecord.status == '2') {
      // 支付超时-订单关闭
      stepCurrent = 1;
    } else if (currentRecord.status == '3') {
      // 手动关闭订单
      stepCurrent = 2;
    } else if (currentRecord.status == '4') {
      // 支付完成-待发货
      stepCurrent = 1;
    } else if (currentRecord.status == '5') {
      // 已发货-待收货
      stepCurrent = 2;
    } else if (currentRecord.status == '6') {
      // 已收货-待评价
      stepCurrent = 3;
    } else if (currentRecord.status == '6') {
      // 已评价-交易完成
      stepCurrent = 4;
    }

    return (
      <PageHeaderWrapper
        title={currentRecord.name}
        action={currentRecord ? this.buildAction(currentRecord) : null}
        content={currentRecord ? this.buildDescription(currentRecord) : null}
        extraContent={currentRecord ? this.buildExtra(currentRecord) : null}
      >
        <Card title="订单进度" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={stepCurrent}>
            <Step title="创建成功-待支付" description={this.buildCreatedAt(currentRecord)} />

            {currentRecord.status == '2' ? (
              <Step
                title="支付超时-订单关闭"
                description={currentRecord ? this.buildClosedAt(currentRecord) : null}
              />
            ) : null}

            {currentRecord.status == '3' ? (
              <Step
                title="手动关闭订单"
                description={currentRecord ? this.buildClosedAt(currentRecord) : null}
              />
            ) : null}

            <Step
              title="支付完成-待发货"
              description={currentRecord ? this.buildPaymentAt(currentRecord) : null}
            />
            <Step
              title="已发货-待收货"
              description={currentRecord ? this.buildPackagedAt(currentRecord) : null}
            />
            <Step
              title="已收货-待评价"
              description={currentRecord ? this.buildReceivedAt(currentRecord) : null}
            />
            <Step
              title="已评价-交易完成"
              description={currentRecord ? this.buildReviewedAt(currentRecord) : null}
            />
          </Steps>
        </Card>

        <Card
          title="支付信息 & 优惠卷信息"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={
            <span>
              {currentRecord.payment_sn && currentRecord.payment == '2' ? (
                <a onClick={() => this.showDrawer(true, currentRecord.id)}>微信支付查询订单</a>
              ) : (
                <a disabled>微信支付查询订单</a>
              )}
            </span>
          }
        >
          <DescriptionList style={{ marginBottom: 24 }} title="支付信息">
            <Description term="支付渠道">{currentRecord.payment_name}</Description>
            <Description term="总价">{currentRecord.total_amount}</Description>
            <Description term="支付时间">
              {currentRecord.payment_datetime ? currentRecord.payment_datetime : '-'}
            </Description>
            <Description term="支付流水号">
              {currentRecord.payment_sn ? currentRecord.payment_sn : '-'}
            </Description>
          </DescriptionList>

          {currentRecord.coupon_log ? (
            <DescriptionList style={{ marginBottom: 24 }} title="优惠卷信息">
              <Description term="优惠卷领取记录ID">{currentRecord.coupon_log.id}</Description>
              <Description term="领取时间">{currentRecord.coupon_log.created_at}</Description>
              <Description term="使用时间">{currentRecord.coupon_log.used_datetime}</Description>
              <Description term="优惠卷ID">{currentRecord.coupon_log.coupon.id}</Description>
              <Description term="优惠卷名称">{currentRecord.coupon_log.coupon.name}</Description>
              <Description term="优惠卷类型">
                {currentRecord.coupon_log.coupon.type_name}
              </Description>
              <Description term="优惠卷内部类型">
                {currentRecord.coupon_log.coupon.internal_type_name}
              </Description>
            </DescriptionList>
          ) : (
            <DescriptionList style={{ marginBottom: 24 }} title="未使用优惠卷" />
          )}
        </Card>

        <Card
          title="收货地址 & 快递信息"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={
            <span>
              {currentRecord.address ? (
                <CopyToClipboard
                  text={`${currentRecord.address.name} ${currentRecord.address.mobile} ${
                    currentRecord.address.address
                  }`}
                  onCopy={() => message.success('复制收货地址成功')}
                  style={{ marginTop: 10 }}
                >
                  <a>复制收货地址</a>
                </CopyToClipboard>
              ) : (
                <a disabled>复制收货地址</a>
              )}

              {currentRecord.express ? (
                <CopyToClipboard
                  text={`${currentRecord.express.shipper} ${currentRecord.express.sn}`}
                  onCopy={() => message.success('复制快递信息成功')}
                  style={{ marginTop: 10 }}
                >
                  <a> 复制快递信息</a>
                </CopyToClipboard>
              ) : (
                <a disabled> 复制快递信息</a>
              )}
            </span>
          }
        >
          {currentRecord.address ? (
            <DescriptionList style={{ marginBottom: 24 }} title="收货地址">
              <Description term="姓名">{currentRecord.address.name}</Description>
              <Description term="手机号">{currentRecord.address.mobile}</Description>
              <Description term="地址">{currentRecord.address.address}</Description>
            </DescriptionList>
          ) : null}

          {currentRecord.express ? (
            <DescriptionList style={{ marginBottom: 24 }} title="快递信息">
              <Description term="状态">{currentRecord.express.status_name}</Description>
              <Description term="快递名称">
                {currentRecord.express.shipper
                  ? currentRecord.express.shipper
                  : '-'}
              </Description>
              <Description term="快递单号">
                {currentRecord.express.sn ? currentRecord.express .sn : '-'}
              </Description>
            </DescriptionList>
          ) : (
            <DescriptionList style={{ marginBottom: 24 }} title="无快递信息" />
          )}
        </Card>

        <div>
          {currentRecord.products ? (
            <Card title="订单包含商品" style={{ marginBottom: 24 }} bordered={false}>
              <SimpleListTable data={currentRecord.products} columns={transactionProductColumns} />
            </Card>
          ) : null}
        </div>

        <div>
          {currentRecord.reviews ? (
            <Card title="订单评价" style={{ marginBottom: 24 }} bordered={false}>
              <SimpleListTable data={currentRecord.reviews} columns={reviewColumns} />
            </Card>
          ) : null}
        </div>

        <TransactionDetailCreateExpressModal
          createExpressModalVisible={createExpressModalVisible}
          currentTransaction={currentRecord}
          mark="detail"
          onCancel={this.handleCreateExpressModalVisible}
        />

        <TransactionPatchModal
          patchModalVisible={patchModalVisible}
          currentTransaction={currentRecord}
          userAllAddress={userAllAddress}
          mark="detail"
          onCancel={this.handlePatchModalVisible}
        />

        <TransactionDetailCreateRefundModal
          createRefundModalVisible={createRefundModalVisible}
          currentTransaction={currentRecord}
          mark="detail"
          onCancel={this.handleCreateRefundModalVisible}
        />

        <Drawer
          title="微信支付查询订单"
          width={380}
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {wxQueryOrderDetail && Object.keys(wxQueryOrderDetail).length ? (
            <div>
              <span>{wxQueryOrderDetail.return_code == 'SUCCESS' && wxQueryOrderDetail.result_code ? '支付成功' : '支付失败' }</span>
              <span>
                {wxQueryOrderDetail.trade_state_desc}
              </span>
            </div>
          ) : null}
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default TransactionDetail;
