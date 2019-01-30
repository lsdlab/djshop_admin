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
class ProductRecList extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {

    return (
      <PageHeaderWrapper title="商品推荐列表">
        <Card bordered={false}>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductRecList;
