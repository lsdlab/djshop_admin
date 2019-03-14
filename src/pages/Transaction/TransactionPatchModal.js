import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Modal,
  message,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ transaction, loading }) => ({
  transaction,
  submitting: loading.effects['transaction/patch'],
}))
@Form.create()
class TransactionPatchModal extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  handleAdd = (fields, transactionID, mark) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/patch',
      payload: {
        paid: fields.paid,
        address: transactionID.toString(),
        seller_note: fields.seller_note,
        seller_packaged_datetime: fields.seller_packaged_datetime,
      }
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
    const {
      transactionID, createExpressModalVisible, form, mark,
    } = this.props;

    const okHandle = (transactionID) => {
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
        visible={createExpressModalVisible}
        onOk={() => okHandle(transactionID, mark)}
        onCancel={() => this.handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="快递名称">
          {form.getFieldDecorator('shipper', {
            initialValue: '顺丰',
            rules: [{ required: true, message: '请输入快递名称！' }],
          })(<Select style={{ width: "100%" }}>
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
            </Select>)}
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

export default TransactionPatchModal;
