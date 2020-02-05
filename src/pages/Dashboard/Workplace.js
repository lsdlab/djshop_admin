import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, List, Avatar, notification } from 'antd';
// import { Client } from '@stomp/stompjs';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import linkStyles from '../../components/EditableLinkGroup/index.less';
import styles from './Workplace.less';


@connect(({ user, activities, loading }) => ({
  currentUser: user.currentUser,
  currentMerchant: user.currentMerchant,
  activities,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    // const client = new Client({
    //   brokerURL: 'ws://localhost:15674/ws',
    //   connectHeaders: {
    //     login: 'djshop',
    //     passcode: 'GkTM2HxZN27pws8t',
    //   },
    //   debug(str) {
    //     console.log(str);
    //   },
    //   onConnect: () => {
    //     console.log('onConnect');
    //     // notification.open({
    //     //   message: 'rabbitmq + stomp',
    //     //   description: 'realtime notification connected',
    //     //   duration: 1,
    //     // });

    //     client.subscribe('/exchange/test_exchange/test_hello', message => {
    //       notification.open({
    //         message: message.body,
    //         duration: 1,
    //       });
    //     });

    //     client.subscribe(
    //       '/exchange/transaction_create_notify_exchange/transaction_create_notify',
    //       message => {
    //         const messageBody = JSON.parse(message.body);
    //         notification.open({
    //           message: messageBody['user'] + ' 提交了 ' + messageBody['transaction_name'] + ' 订单',
    //           description: 'sn: ' + messageBody['transaction_sn'],
    //           duration: 3,
    //         });
    //       }
    //     );
    //   },
    //   reconnectDelay: 10000,
    //   heartbeatIncoming: 0,
    //   heartbeatOutgoing: 0,
    // });

    // client.activate();

    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'activities/fetch',
    });
  }

  renderActivities() {
    const {
      activities: {
        data: { results },
      },
    } = this.props;
    return results.map(item => {
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={
              <span>
                <a className={styles.username}>{item.actor}</a>
                &nbsp;
                <span className={styles.event}>{item.verb}</span>
              </span>
            }
            description={
              <div>
                <span className={styles.datetime} title={item.created_at}>
                  {moment(item.created_at).fromNow()}
                </span>
              </div>
            }
          />
        </List.Item>
      );
    });
  }

  routerPushNewProduct = () => {
    router.push({ pathname: '/product/product-create-step-form/product/' });
  };

  routerPushProductList = () => {
    router.push({ pathname: '/product/product-list/' });
  };

  routerPushSplashList = () => {
    router.push({ pathname: '/assist/splash-list/' });
  };

  routerPushBannerList = () => {
    router.push({ pathname: '/assist/banner-list/' });
  };

  routerPushUploadImage = () => {
    router.push({ pathname: '/assist/upload-image/' });
  };

  routerPushUploadVideo = () => {
    router.push({ pathname: '/assist/upload-video/' });
  };

  routerPushTransacitonListToday = () => {
    router.push({ pathname: '/transaction/transaction-list-today/' });
  };

  routerPushTransacitonListYesterday = () => {
    router.push({ pathname: '/transaction/transaction-list-yesterday/' });
  };

  routerPushTransacitonList = () => {
    router.push({ pathname: '/transaction/transaction-list/' });
  };

  routerPushCouponCreate = () => {
    router.push({ pathname: '/coupon/coupon-create/' });
  };

  routerPushCouponList = () => {
    router.push({ pathname: '/coupon/coupon-list/' });
  };

  render() {
    const { currentUser, currentMerchant, currentUserLoading, activitiesLoading } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              Hi，
              {currentUser.name}
              ，祝你开心每一天！
            </div>
            <div>
              邮箱：{currentUser.email} | 手机号：{currentUser.mobile} | 用户创建时间：
              {currentUser.date_joined}
            </div>
            <div>
              商户名：{currentMerchant.name} | 商户手机号：{currentMerchant.mobile} | 商户创建时间：
              {currentMerchant.created_at}
            </div>
          </div>
        </div>
      ) : null;

    return (
      <PageHeaderWrapper
        hiddenBreadcrumb={false}
        loading={currentUserLoading}
        content={pageHeaderContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="操作历史记录"
              loading={activitiesLoading}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="便捷导航"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <div className={linkStyles.linkGroup}>
                <a onClick={() => this.routerPushTransacitonListToday()}>今日待发货</a>
                <a onClick={() => this.routerPushTransacitonListYesterday()}>昨日订单</a>
                <a onClick={() => this.routerPushTransacitonList()}>订单列表</a>
              </div>
              <div className={linkStyles.linkGroup}>
                <a onClick={() => this.routerPushNewProduct()}>商品上架</a>
                <a onClick={() => this.routerPushProductList()}>商品列表</a>
                <a onClick={() => this.routerPushCouponCreate()}>新增优惠卷</a>
                <a onClick={() => this.routerPushCouponList()}>优惠卷列表</a>
              </div>
              <div className={linkStyles.linkGroup}>
                <a onClick={() => this.routerPushSplashList()}>开屏广告</a>
                <a onClick={() => this.routerPushBannerList()}>轮播图</a>
                <a onClick={() => this.routerPushUploadImage()}>上传图片</a>
                <a onClick={() => this.routerPushUploadVideo()}>上传视频</a>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
