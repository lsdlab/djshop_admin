import React, { PureComponent, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Icon,
  Button,
  Dropdown,
  Menu,
  Badge,
  Checkbox,
  Avatar,
  Steps,
} from 'antd';
import classNames from 'classnames';
import router from 'umi/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Profile/AdvancedProfile.less';
import SimpleTransactionTable from '@/components/SimpleTransactionTable';
import TransactionCreateExpressModal from './TransactionCreateExpressModal'
import TransactionPatchModal from './TransactionPatchModal'

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { Step } = Steps;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const menu = (
  <Menu>
    <Menu.Item key="1">选项一</Menu.Item>
    <Menu.Item key="2">选项二</Menu.Item>
    <Menu.Item key="3">选项三</Menu.Item>
  </Menu>
);

const customDot = (dot, { status }) =>
  (
    dot
  );

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

const CheckboxItem = ({ title, status }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    <Checkbox disabled checked={status}></Checkbox>
  </div>
);

/* eslint react/no-multi-comp:0 */
@connect(({ transaction }) => ({
  transaction,
}))
class TransactionDetail extends PureComponent {
  state = {
    stepDirection: 'horizontal',
    createExpressModalVisible: false,
    patchModalVisible: false,
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
  };

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

  buildAction(currentRecord) {
    return (
      <Fragment>
        <ButtonGroup>
          { currentRecord.status == '4' ? (
            <Button onClick={() => this.handleCreateExpressModalVisible(true)}>发货</Button>
          ) : <Button disabled>发货</Button>}

          { currentRecord.status == '1' ? (
            <Button onClick={() => this.handlePatchModalVisible(true, currentRecord)}>修改订单</Button>
          ) : <Button disabled>修改订单</Button>}

          {/*<Button>关闭订单</Button>
          <Button>确认收货</Button>*/}
          {/*<Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>*/}
        </ButtonGroup>
        {/*<Button type="primary">主操作</Button>*/}
      </Fragment>
    )
  };

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
    )
  };

  buildDescription(currentRecord) {
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="创建时间">{currentRecord.created_at}</Description>
        <Description term="更新时间">{currentRecord.updated_at}</Description>
        <Description term="过期时间">{currentRecord.expired_datetime}</Description>

        <Description term="sn">{currentRecord.sn}</Description>
        <Description term="ID">{currentRecord.id}</Description>
        {currentRecord.user ? (
          <Description term="用户"><Avatar size="small" src={currentRecord.user.avatar} style={{ marginRight: 8 }} />
                                {currentRecord.user.nickname}</Description>
        ) : null}
        <Description term="备注">{currentRecord.note ? currentRecord.note : '-'}</Description>
        <Description term="商家备注">{currentRecord.seller_note ? currentRecord.seller_note : '-'}</Description>
      </DescriptionList>
    )
  };

  buildCreatedAt(currentRecord) {
    return (
      <span>
        {currentRecord.created_at}
      </span>)
  }

  buildClosedAt(currentRecord) {
    return (
      <span>
        {currentRecord.closed_datetime}
      </span>)
  }

  buildPaymentAt(currentRecord) {
    return (
      <span>
        {currentRecord.payment_datetime}
      </span>)
  }

  buildPackagedAt(currentRecord) {
    return (
      <span>
        {currentRecord.seller_packaged_datetime}
      </span>)
  }

  buildReceivedAt(currentRecord) {
    return (
      <span>
        {currentRecord.received_datetime}
      </span>)
  }

  buildReviewedAt(currentRecord) {
    return (
      <span>
        {currentRecord.review_datetime}
      </span>)
  }

  handleCreateExpressModalVisible = (flag) => {
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

  render() {
    const { transaction: { currentRecord, userAllAddress } } = this.props;
    const { stepDirection, createExpressModalVisible, patchModalVisible } = this.state;

    const transactionProductColumns = [
      {
        title: '商品名称',
        dataIndex: 'product_spec.product.name',
      },
      {
        title: '商品规格名称',
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
              <Step title="支付超时-订单关闭" description={currentRecord ? this.buildClosedAt(currentRecord) : null} />
            ) : null}

            {currentRecord.status == '3' ? (
              <Step title="手动关闭订单" description={currentRecord ? this.buildClosedAt(currentRecord) : null} />
            ) : null}

            <Step title="支付完成-待发货" description={currentRecord ? this.buildPaymentAt(currentRecord) : null} />
            <Step title="已发货-待收货" description={currentRecord ? this.buildPackagedAt(currentRecord) : null} />
            <Step title="已收货-待评价" description={currentRecord ? this.buildReceivedAt(currentRecord) : null} />
            <Step title="已评价-交易完成" description={currentRecord ? this.buildReviewedAt(currentRecord) : null} />
          </Steps>
        </Card>

        <Card title="支付信息 & 优惠卷信息" style={{ marginBottom: 24 }} bordered={false} >
          <DescriptionList style={{ marginBottom: 24 }} title="支付信息">
            <Description term="支付渠道">{currentRecord.payment_name}</Description>
            <Description term="总价">{currentRecord.total_amount}</Description>
            <Description term="支付时间">{currentRecord.payment_datetime ? currentRecord.payment_datetime : '-'}</Description>
            <Description term="支付流水号">{currentRecord.payment_sn ? currentRecord.payment_sn : '-'}</Description>
          </DescriptionList>

          {currentRecord.coupon_log ? (
            <DescriptionList style={{ marginBottom: 24 }} title="优惠卷信息">
              <Description term="优惠卷领取记录ID">{currentRecord.coupon_log.id}</Description>
              <Description term="领取时间">{currentRecord.coupon_log.created_at}</Description>
              <Description term="使用时间">{currentRecord.coupon_log.used_datetime}</Description>
              <Description term="优惠卷ID">{currentRecord.coupon_log.coupon.id}</Description>
              <Description term="优惠卷名称">{currentRecord.coupon_log.coupon.name}</Description>
              <Description term="优惠卷类型">{currentRecord.coupon_log.coupon.type_name}</Description>
              <Description term="优惠卷内部类型">{currentRecord.coupon_log.coupon.internal_type_name}</Description>
            </DescriptionList>
          ) : <DescriptionList style={{ marginBottom: 24 }} title="未使用优惠卷">
            </DescriptionList>}
        </Card>

        <Card title="地址 & 快递信息" style={{ marginBottom: 24 }} bordered={false} extra=
          { currentRecord.status == '4' ? (
            <a onClick={() => this.handleCreateExpressModalVisible(true)} >发货</a>
          ) : <a disabled onClick={() => this.handleCreateExpressModalVisible(true)} >发货</a>}
        >
          {currentRecord.address ? (
            <DescriptionList style={{ marginBottom: 24 }} title="地址">
              <Description term="姓名">{currentRecord.address.name}</Description>
              <Description term="手机号">{currentRecord.address.mobile}</Description>
              <Description term="地址">{currentRecord.address.address}</Description>
            </DescriptionList>
          ) : null}

          {currentRecord.express ? (
            <DescriptionList style={{ marginBottom: 24 }} title="快递信息">
              <Description term="状态">{currentRecord.express.status_name}</Description>
              <Description term="快递信息提供商">{currentRecord.express.shipper_info_provider ? currentRecord.express.shipper_info_provider : '-'}</Description>
              <Description term="shipper_code">{currentRecord.address.shipper_code ? currentRecord.address.shipper_code: '-' }</Description>
              <Description term="shipper_name">{currentRecord.address.shipper_name ? currentRecord.address.shipper_name : '-'}</Description>
            </DescriptionList>
          ) : <DescriptionList style={{ marginBottom: 24 }} title="无快递信息">
            </DescriptionList>}
        </Card>

        {currentRecord.products ? (
          <Card title="订单包含商品" style={{ marginBottom: 24 }} bordered={false}>
            <SimpleTransactionTable
              data={currentRecord.products}
              columns={transactionProductColumns}
            />
          </Card>
        ) : null}

        <TransactionCreateExpressModal
          createExpressModalVisible={createExpressModalVisible}
          currentTransaction={currentRecord}
          mark='detail'
          onCancel={this.handleCreateExpressModalVisible}
        />

        <TransactionPatchModal
          patchModalVisible={patchModalVisible}
          currentTransaction={currentRecord}
          userAllAddress={userAllAddress}
          mark='detail'
          onCancel={this.handlePatchModalVisible}
        />

      </PageHeaderWrapper>
    );
  }
}

export default TransactionDetail;
