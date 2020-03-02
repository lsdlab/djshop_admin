import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ refund, loading }) => ({
  refund,
  submitting: loading.effects['refund/create'],
}))
@Form.create()
class TransactionCreateRefundModal extends PureComponent {
  state = {};

  componentDidMount() {}

  handleAdd = (fields, transactionID, mark) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/create',
      payload: {
        transaction: transactionID.toString(),
        note: fields.note,
      },
      transactionID: transactionID
    }).then(() => {
      message.success('发货成功');
      this.handleModalVisible();
      if (mark == 'list') {
        dispatch({
          type: 'transaction/fetch',
          payload: {},
        });
      } else if (mark == 'detail') {
        this.props.dispatch({
          type: 'transaction/fetchDetail',
          transactionID: transactionID,
        });
      }
    });
  };

  handleModalVisible = flag => {
    const { onCancel } = this.props;
    onCancel(flag);
  };

  render() {
    const { currentTransaction, createExpressModalVisible, form, mark } = this.props;

    const okHandle = transactionID => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.handleAdd(fieldsValue, transactionID, mark);
      });
    };

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="发货"
        width={800}
        visible={createExpressModalVisible}
        onOk={() => okHandle(currentTransaction.id, mark)}
        onCancel={() => this.handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退货备注">
          {form.getFieldDecorator('note', {
            rules: [{ required: true, message: '请输入退货备注！' }],
          })(<Input placeholder="退货备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default TransactionCreateRefundModal;
