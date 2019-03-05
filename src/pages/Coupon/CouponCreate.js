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
  Button,
  InputNumber,
  Modal,
  message,
  Divider,
} from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

/* eslint react/no-multi-comp:0 */
@connect(({ coupon, loading }) => ({
  coupon,
  loading: loading.models.coupon,
}))
@Form.create()
class CouponCreate extends PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {

    return (
      <PageHeaderWrapper title="创建优惠卷">
        <Card bordered={false}>
          <Form layout="horizontal">

            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称！' }],
              })(<Input placeholder="商品名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="副标题">
              {getFieldDecorator('subtitle', {
                rules: [{ required: true, message: '请输入副标题！' }],
              })(<Input placeholder="商品副标题，十个字符以内" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="单位">
              {getFieldDecorator('unit', {
                rules: [{ required: true, message: '请输入单位！' }],
              })(<Input placeholder="商品单位" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="重量">
              {getFieldDecorator('weight', {
                rules: [{ required: true, message: '请输入重量！' }],
              })(<Input placeholder="商品重量" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="限购数量">
              {getFieldDecorator('limit', {
                rules: [{ required: true, message: '请输入限购数量！' }],
              })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="商品限购数量"/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否开发票">
              {getFieldDecorator('has_invoice', {
                rules: [{ required: false }],
              })(
                <Checkbox></Checkbox>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="轮播图链接">
              {getFieldDecorator('carousel', {
                initialValue: newProduct.carousel,
                rules: [{ required: true, message: '请输入轮播图链接！'}],
              })(<TextArea rows={5} placeholder="轮播图链接可填写多个，使用英文逗号 , 进行分隔" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="商品详情">
              {getFieldDecorator('md', {
                initialValue: newProduct.md,
                rules: [{ required: true, message: '请输入商品详情！'}],
              })(<TextArea rows={10} placeholder="商品详情，图片文字混排，使用 Markdown 格式" />)}
            </FormItem>

            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={onValidateForm}>
                下一步
              </Button>
            </Form.Item>
          </Form>
          <Divider style={{ margin: '40px 0 24px' }} />
          <div className={styles.desc}>
            <h3>商品信息填写说明</h3>
            <h4>轮播图</h4>
            <p>
              轮播图链接可填写多个，使用英文逗号 , 进行分隔
            </p>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponCreate;
