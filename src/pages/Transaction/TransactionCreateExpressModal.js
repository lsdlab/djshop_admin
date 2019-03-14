import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
} from 'antd';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ transaction, loading }) => ({
  transaction,
  submitting: loading.effects['transaction/createExpress'],
}))
@Form.create()
class TransactionCreateExpressModal extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {

    return (
      <Card bordered={false}>

      </Card>
    );
  }
}

export default TransactionCreateExpressModal;
