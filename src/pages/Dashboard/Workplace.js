import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Row, Col, Card, List, Avatar, notification } from 'antd';
import { Client, Message } from '@stomp/stompjs';

import EditableLinkGroup from '@/components/EditableLinkGroup';
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

    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug(str) {
        console.log(str);
      },
      onConnect: () => {
        console.log('onConnect');
        const msg = {
          message: 'rabbitmq + stomp',
          description: 'realtime notification connected',
          duration: 1,
        };
        notification.open(msg);

        client.subscribe('/topic/test', (message) => {
          console.log(message.body)
        });
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
    });

    client.activate();

    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'activities/fetchList',
    });
  }

  renderActivities() {
    const {
      activities: { list },
    } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  routerPushNewProduct = () => {
    router.push({pathname: '/product/product-create-step-form/product/'});
  }

  routerPushProductList = () => {
    router.push({pathname: '/product/product-list/'});
  }

  routerPushSplashList = () => {
    router.push({pathname: '/assist/splash-list/'});
  }

  routerPushBannerList = () => {
    router.push({pathname: '/assist/banner-list/'});
  }

  routerPushUploadImage = () => {
    router.push({pathname: '/assist/upload-image/'});
  }

  routerPushUploadVideo = () => {
    router.push({pathname: '/assist/upload-video/'});
  }

  routerPushTransacitonList = () => {
    router.push({pathname: '/transaction/transaction-list/'});
  }

  routerPushCouponCreate = () => {
    router.push({pathname: '/coupon/coupon-create/'});
  }

  routerPushCouponList= () => {
    router.push({pathname: '/coupon/coupon-list/'});
  }

  render() {
    const {
      currentUser,
      currentMerchant,
      currentUserLoading,
      activitiesLoading,
    } = this.props;

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
              邮箱：{currentUser.email} | 手机号：{currentUser.mobile} | 用户创建时间：{currentUser.date_joined}
            </div>
            <div>
              商户名：{currentMerchant.name} | 商户手机号：{currentMerchant.mobile} | 商户创建时间：{currentMerchant.created_at}
            </div>
          </div>
        </div>
      ) : null;

    return (
      <PageHeaderWrapper
        hiddenBreadcrumb={true}
        loading={currentUserLoading}
        content={pageHeaderContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="登录历史记录"
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
                <a onClick={() => this.routerPushNewProduct()}>商品上架</a>
                <a onClick={() => this.routerPushProductList()}>商品列表</a>
                <a onClick={() => this.routerPushSplashList()}>开屏广告</a>
                <a onClick={() => this.routerPushBannerList()}>轮播图</a>
                <a onClick={() => this.routerPushUploadImage()}>上传图片</a>
                <a onClick={() => this.routerPushUploadVideo()}>上传视频</a>
                <a onClick={() => this.routerPushTransacitonList()}>订单列表</a>
                <a onClick={() => this.routerPushCouponCreate()}>新增优惠卷</a>
                <a onClick={() => this.routerPushCouponList()}>优惠卷列表</a>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
