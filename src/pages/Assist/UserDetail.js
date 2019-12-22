import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Badge, Avatar } from 'antd';
import router from 'umi/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SimpleTable from '@/components/SimpleTable';
import styles from '../Profile/AdvancedProfile.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

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

const operationTabList = [
  {
    key: 'tab1',
    tab: '用户资料',
  },
  {
    key: 'tab2',
    tab: '订单列表',
  },
  {
    key: 'tab3',
    tab: '购物车',
  },
  {
    key: 'tab4',
    tab: '收藏夹',
  },
  {
    key: 'tab5',
    tab: '地址',
  },
];

/* eslint react/no-multi-comp:0 */
@connect(({ user }) => ({
  user,
}))
class UserDetail extends PureComponent {
  state = {
    operationkey: 'tab1',
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const userID = pathList[3];

    dispatch({
      type: 'user/fetchDetail',
      payload: {
        user_id: userID,
      },
      userID: userID,
    });
  }

  routerPushDetail = transactionID => {
    router.push('/transaction/transaction-detail/' + transactionID);
  };

  routerPushProductDetail = productID => {
    router.push('/product/product-detail/' + productID);
  };

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  buildAction() {
    return (
      <Fragment>
        <ButtonGroup>
          <Button disabled>修改用户资料</Button>
          <Button disabled>修改会员资料</Button>

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
    );
  }

  buildExtra(currentRecord) {
    return (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>是否超级用户</div>
          <div className={styles.heading}>
            {currentRecord.is_superuser ? (
              <Badge status="success" text="超级用户" />
            ) : (
              <Badge status="error" text="非超级用户" />
            )}
          </div>
        </Col>
        {currentRecord.profile ? (
          <div>
            <Col xs={24} sm={12}>
              <div className={styles.textSecondary}>是否会员</div>
              <div className={styles.heading}>
                {currentRecord.profile.is_vip ? (
                  <Badge status="success" text="会员" />
                ) : (
                  <Badge status="error" text="非会员" />
                )}
              </div>
            </Col>
            <Col xs={24} sm={6} style={{ marginTop: 8 }}>
              <div className={styles.textSecondary}>积分</div>
              <div className={styles.heading}>{currentRecord.profile.points}</div>
            </Col>
            <Col xs={24} sm={6} style={{ marginTop: 8 }}>
              <div className={styles.textSecondary}>会员周期</div>
              <div className={styles.heading}>
                {currentRecord.profile.vip_session ? currentRecord.profile.vip_session : '-'}
              </div>
            </Col>
            <Col xs={24} sm={12} style={{ marginTop: 8 }}>
              <div className={styles.textSecondary}>会员过期时间</div>
              <div className={styles.heading}>
                {currentRecord.profile.vip_expired_datetime
                  ? currentRecord.profile.vip_expired_datetime
                  : '-'}
              </div>
            </Col>
          </div>
        ) : null}
      </Row>
    );
  }

  buildDescription(currentRecord) {
    return (
      <DescriptionList className={styles.headerList} size="small" col="1">
        <Description term="手机号">{currentRecord.mobile}</Description>
        <Description term="用户名">
          <Avatar size="small" src={currentRecord.avatar} style={{ marginRight: 8 }} />
          {currentRecord.username}
        </Description>
        <Description term="邮箱">{currentRecord.email}</Description>
        <Description term="注册时间">{currentRecord.date_joined}</Description>
        <Description term="ID">{currentRecord.id}</Description>
        <Description term="备注">
          {currentRecord.profile ? currentRecord.profile.note : '-'}
        </Description>
      </DescriptionList>
    );
  }

  buildTransactionList(transactionData) {
    const transactionColumns = [
      {
        title: 'sn',
        dataIndex: 'sn',
      },
      {
        title: '用户',
        dataIndex: 'user.nickname',
      },
      {
        title: '状态',
        dataIndex: 'status_name',
      },
      {
        title: '支付渠道',
        dataIndex: 'payment_name',
      },
      {
        title: '类型',
        dataIndex: 'deal_type_name',
      },
      {
        title: '总价',
        dataIndex: 'total_amount',
      },
      {
        title: '实付',
        dataIndex: 'paid',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: record => (
          <Fragment>
            <a onClick={() => this.routerPushDetail(record.id)}>详情</a>
          </Fragment>
        ),
      },
    ];

    return (
      <SimpleTable
        data={transactionData}
        columns={transactionColumns}
        pagination={false}
        scroll={{ x: 1240 }}
      />
    );
  }

  buildCartList(cartData) {
    const cartColumns = [
      {
        title: '商品名称',
        dataIndex: 'product_spec.product.name',
      },
      {
        title: '商品ID',
        dataIndex: 'product_spec.product.id',
      },
      {
        title: '规格名称',
        dataIndex: 'product_spec.name',
      },
      {
        title: '规格ID',
        dataIndex: 'product_spec.id',
      },
      {
        title: '价格',
        dataIndex: 'product_spec.price',
      },
      {
        title: '数量',
        dataIndex: 'nums',
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

    return <SimpleTable data={cartData} columns={cartColumns} pagination={false} />;
  }

  render() {
    const {
      user: { currentRecord, transactionData, cartData },
    } = this.props;
    const { operationkey } = this.state;

    const contentList = {
      tab1: (
        <Card style={{ marginBottom: 24 }} bordered={false}>
          {currentRecord.weixin_userinfo ? (
            <Row>
              <Col span={12}>
                <DescriptionItem title="微信openid" content={currentRecord.weixin_openid} />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="微信头像"
                  content={
                    <Avatar
                      size="small"
                      src={currentRecord.weixin_userinfo.avatarUrl}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="微信昵称"
                  content={currentRecord.weixin_userinfo.nickName}
                />
              </Col>
            </Row>
          ) : null}
          {currentRecord.weixin_userinfo ? (
            <Row>
              <Col span={6}>
                <DescriptionItem title="国家" content={currentRecord.weixin_userinfo.country} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="省市" content={currentRecord.weixin_userinfo.province} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="城市" content={currentRecord.weixin_userinfo.city} />
              </Col>
            </Row>
          ) : null}
          {currentRecord.weixin_userinfo ? (
            <Row>
              <Col span={6}>
                <DescriptionItem title="语言" content={currentRecord.weixin_userinfo.language} />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="性别"
                  content={currentRecord.weixin_userinfo.gender == '1' ? '男' : '女'}
                />
              </Col>
            </Row>
          ) : null}
        </Card>
      ),
      tab2: (
        <Card style={{ marginBottom: 24 }} bordered={false}>
          {transactionData ? this.buildTransactionList(transactionData) : null}
        </Card>
      ),
      tab3: (
        <Card style={{ marginBottom: 24 }} bordered={false}>
          {transactionData ? this.buildCartList(cartData) : null}
        </Card>
      ),
    };

    return (
      <PageHeaderWrapper
        title={currentRecord.username}
        action={this.buildAction(currentRecord)}
        content={currentRecord ? this.buildDescription(currentRecord) : null}
        extraContent={currentRecord ? this.buildExtra(currentRecord) : null}
        tabList={operationTabList}
        onTabChange={this.onOperationTabChange}
      >
        {contentList[operationkey]}
      </PageHeaderWrapper>
    );
  }
}

export default UserDetail;
