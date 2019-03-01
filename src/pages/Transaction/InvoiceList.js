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
const { TextArea } = Input;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
// @connect(({ articles, loading }) => ({
//   articles,
//   loading: loading.models.articles,
// }))
// @Form.create()
class InvoiceList extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {

    return (
      <PageHeaderWrapper title="发票">
        <Card bordered={false}>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InvoiceList;
