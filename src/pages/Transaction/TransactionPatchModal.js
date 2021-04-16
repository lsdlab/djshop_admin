import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const buildOptions = optionData => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(
        <Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>
          {optionData[i].combined_name}
        </Option>
      );
    }
    return arr;
  }
};

/* eslint react/no-multi-comp:0 */
@connect(({ transaction, loading }) => ({
  transaction,
  submitting: loading.effects['transaction/patch'],
}))
@Form.create()
class TransactionPatchModal extends PureComponent {
  state = {};

  componentDidMount() {}

  handleAdd = (fields, transactionID, mark) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/patch',
      payload: {
        paid: fields.paid,
        address: fields.address,
        seller_note: fields.seller_note,
      },
      transactionID: transactionID,
    }).then(() => {
      message.success('修改订单成功');
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
    const { currentTransaction, userAllAddress, patchModalVisible, form, mark } = this.props;

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
        title="修改订单"
        width={800}
        visible={patchModalVisible}
        onOk={() => okHandle(currentTransaction.id, mark)}
        onCancel={() => this.handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收货地址">
          {form.getFieldDecorator('address', {
            initialValue: currentTransaction.address ? currentTransaction.address.id : '',
            rules: [{ required: true, message: '请选择收货地址！' }],
          })(
            <Select style={{ width: '100%' }} placeholder="收货地址">
              {buildOptions(userAllAddress)}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实付价格">
          {form.getFieldDecorator('paid', {
            initialValue: currentTransaction.paid,
            rules: [{ required: true, message: '请输入实付价格！' }],
          })(
            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="实付价格" />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卖家备注">
          {form.getFieldDecorator('seller_note', {
            initialValue: currentTransaction.seller_note,
            rules: [{ required: false, message: '请输入卖家备注！' }],
          })(<TextArea autoSize={{ minRows: 4, maxRows: 8 }} placeholder="卖家备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default TransactionPatchModal;
