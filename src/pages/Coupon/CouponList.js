import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
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
class CouponList extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {

    return (
      <PageHeaderWrapper title="优惠卷">
        <Card bordered={false}>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponList;
