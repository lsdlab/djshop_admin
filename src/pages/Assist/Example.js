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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../List/TableList.less';
import Reflv from 'reflv';


const FormItem = Form.Item;


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
            <Reflv
              url={`http://localhost:7001/live/test`}
              type="flv"
              isLive
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SplashList;
