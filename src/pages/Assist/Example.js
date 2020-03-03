import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
  TreeSelect,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


/* eslint react/no-multi-comp:0 */
@connect(({ splash, loading }) => ({
  splash,
  loading: loading.models.splash,
}))
@Form.create()
class SplashList extends PureComponent {
  state = {
    currentPage: 1,
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    currentRecord: {},
  };

  componentDidMount() {
  }


  render() {

    return (
      <PageHeaderWrapper title="测试">
        <Card bordered={false}>
          <div className={styles.tableList}>

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SplashList;
