import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ refund, transaction, loading }) => ({
  refund,
  transaction,
  submitting: loading.effects['refund/create'],
}))
@Form.create()
class TransactionDetailCreateRefundModal extends PureComponent {
  state = {};

  componentDidMount() {}

  handleAdd = (fields, transactionID, mark) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/create',
      payload: {
        note: fields.note,
      },
      transactionID: transactionID
    }).then(() => {
      message.success('创建退货成功');
      this.handleModalVisible();
      if (mark == 'list') {
        dispatch({
          type: 'refund/fetch',
          payload: {},
        });
      } else if (mark == 'detail') {
        dispatch({
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
    const { currentTransaction, createRefundModalVisible, form, mark } = this.props;

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
        visible={createRefundModalVisible}
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

export default TransactionDetailCreateRefundModal;
