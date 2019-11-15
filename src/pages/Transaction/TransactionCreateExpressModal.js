import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ transaction, loading }) => ({
  transaction,
  submitting: loading.effects['transaction/createExpress'],
}))
@Form.create()
class TransactionCreateExpressModal extends PureComponent {
  state = {};

  componentDidMount() {}

  handleAdd = (fields, transactionID, mark) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/createExpress',
      payload: {
        transaction: transactionID.toString(),
        status: '0',
        shipper: fields.shipper,
        sn: fields.sn,
      },
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="快递名称">
          {form.getFieldDecorator('shipper', {
            initialValue: '顺丰',
            rules: [{ required: true, message: '请选择快递名称！' }],
          })(
            <Select showSearch style={{ width: '100%' }}>
              <Option value="顺丰">顺丰</Option>
              <Option value="京东">京东</Option>
              <Option value="邮政">邮政</Option>
              <Option value="EMS">EMS</Option>
              <Option value="韵达">韵达</Option>
              <Option value="圆通">圆通</Option>
              <Option value="申通">申通</Option>
              <Option value="中通">中通</Option>
              <Option value="百世">百世</Option>
              <Option value="德邦">德邦</Option>
              <Option value="天天">天天</Option>
              <Option value="优速">优速</Option>
              <Option value="宅急送">宅急送</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="快递单号">
          {form.getFieldDecorator('sn', {
            rules: [{ required: true, message: '请输入快递单号！' }],
          })(<Input placeholder="快递单号" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default TransactionCreateExpressModal;
