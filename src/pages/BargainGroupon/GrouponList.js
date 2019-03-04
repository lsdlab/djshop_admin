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
  Icon,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ groupon, loading }) => ({
  groupon,
  loading: loading.models.groupon,
}))
@Form.create()
class GrouponList extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {

    return (
      <PageHeaderWrapper title="拼团列表">
        <Card bordered={false}>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default GrouponList;
