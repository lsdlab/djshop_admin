import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Button,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
  TreeSelect,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

/* eslint react/no-multi-comp:0 */
@connect(({ coupon, loading }) => ({
  coupon,
  submitting: loading.effects['coupon/create'],
}))
@Form.create()
class CouponEdit extends PureComponent {
  state = {
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coupon/fetchCategory',
    }).then(() => {
      dispatch({
        type: 'coupon/fetchProductAllIds',
      });
    });
  }

  handleSubmit = e => {
    const { dispatch, form, location } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          start_datetime: moment(values.date_range[0]).format('YYYY-MM-DD 00:00:00'),
          end_datetime: moment(values.date_range[1]).format('YYYY-MM-DD 00:00:00'),
          ...values,
        };
        dispatch({
          type: 'coupon/patch',
          payload: params,
          couponID: location.state.currentRecord.id,
        }).then(() => {
          message.success('保存优惠卷成功');
          form.resetFields();
          router.push('/coupon/coupon-list');
        });
      }
    });
  };

  render() {
    const {
      coupon: { categoryData, allProductIds },
      form,
      submitting,
      location,
    } = this.props;
    const { getFieldDecorator } = form;

    const currentRecord = location.state.currentRecord;

    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

    return <PageHeaderWrapper title="编辑优惠卷">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, maxWidth: 700 }}>
            <FormItem {...formItemLayout} label="ID">
              {getFieldDecorator('id', {
                initialValue: currentRecord.id,
              })(<Input disabled placeholder="ID" />)}
            </FormItem>

            <Form.Item {...formItemLayout} label="类型">
              {getFieldDecorator('type', {
                initialValue: currentRecord.type,
                rules: [{ required: true, message: '请选择类型！' }],
              })(<Select placeholder="类型" style={{ width: '100%' }}>
                  <Option value="2">普通</Option>
                  <Option value="1">积分</Option>
                  <Option value="3">会员</Option>
                </Select>)}
            </Form.Item>

            <FormItem {...formItemLayout} label="所需积分" style={{ display: form.getFieldValue('type') === '1' ? 'block' : 'none' }}>
              {getFieldDecorator('points', {
                initialValue: currentRecord.points,
                rules: [
                  {
                    required: form.getFieldValue('type') === '1' ? true : false,
                    message: '请输入所需积分',
                  },
                ],
              })(<InputNumber min={1} step={1} style={{ width: '100%' }} placeholder="所需积分" />)}
            </FormItem>

            <Form.Item {...formItemLayout} label="内部类型">
              {getFieldDecorator('internal_type', {
                initialValue: currentRecord.internal_type,
                rules: [{ required: true, message: '请选择内部类型！' }],
              })(<Select placeholder="内部类型" style={{ width: '100%' }}>
                  <Option value="1">全场满金额减</Option>
                  <Option value="2">分类满金额减</Option>
                  <Option value="3">单品满金额减</Option>
                  <Option value="4">全场满件数减</Option>
                  <Option value="5">分类满件数减</Option>
                  <Option value="6">单品满件数减</Option>
                </Select>)}
            </Form.Item>

            {categoryData ? <Form.Item {...formItemLayout} label="分类" style={{ display: form.getFieldValue('internal_type') === '2' || form.getFieldValue('internal_type') === '5' ? 'block' : 'none' }}>
                {getFieldDecorator('category', {
                  initialValue: currentRecord.category,
                  rules: [
                    {
                      required:
                        form.getFieldValue('internal_type') === '2' ||
                        form.getFieldValue('internal_type') === '5'
                          ? true
                          : false,
                      message: '请选择分类！',
                    },
                  ],
                })(<TreeSelect style={{ width: '100%' }} treeData={categoryData} placeholder="商品分类" treeDefaultExpandAll={true} showSearch={true} />)}
              </Form.Item> : null}

            {allProductIds ? <Form.Item {...formItemLayout} label="商品" style={{ display: form.getFieldValue('internal_type') === '3' || form.getFieldValue('internal_type') === '6' ? 'block' : 'none' }}>
                {form.getFieldDecorator('product', {
                  rules: [
                    {
                      required:
                        form.getFieldValue('internal_type') === '3' ||
                        form.getFieldValue('internal_type') === '6'
                          ? true
                          : false,
                      message: '请选择商品！',
                    },
                  ],
                })(<TreeSelect style={{ width: '100%' }} treeData={allProductIds} placeholder="商品" treeDefaultExpandAll={true} showSearch={true} />)}
              </Form.Item> : null}

            <FormItem {...formItemLayout} label="达到价格" style={{ display: form.getFieldValue('internal_type') === '1' || form.getFieldValue('internal_type') === '2' || form.getFieldValue('internal_type') === '3' ? 'block' : 'none' }}>
              {getFieldDecorator('reach_price', {
                initialValue: currentRecord.reach_price,
                rules: [
                  {
                    required:
                      form.getFieldValue('internal_type') === '1' ||
                      form.getFieldValue('internal_type') === '2' ||
                      form.getFieldValue('internal_type') === '3'
                        ? true
                        : false,
                    message: '请输入达到价格！',
                  },
                ],
              })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="达到价格" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="达到件数" style={{ display: form.getFieldValue('internal_type') === '4' || form.getFieldValue('internal_type') === '5' || form.getFieldValue('internal_type') === '6' ? 'block' : 'none' }}>
              {getFieldDecorator('reach_unit', {
                initialValue: currentRecord.reach_unit,
                rules: [
                  {
                    required:
                      form.getFieldValue('internal_type') === '4' ||
                      form.getFieldValue('internal_type') === '5' ||
                      form.getFieldValue('internal_type') === '6'
                        ? true
                        : false,
                    message: '请输入达到件数！',
                  },
                ],
              })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="商品达到件数" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="折扣价格">
              {getFieldDecorator('discount_price', {
                initialValue: currentRecord.discount_price,
                rules: [{ required: true, message: '请输入折扣价格！' }],
              })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="折扣价格" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: currentRecord.name,
                rules: [{ required: true, message: '请输入名称！' }],
              })(<Input placeholder="优惠卷名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('desc', {
                initialValue: currentRecord.desc,
                rules: [{ required: true, message: '请输入描述！' }],
              })(<TextArea autoSize={{ minRows: 4, maxRows: 8 }} placeholder="优惠卷描述，长文本" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="有效日期">
              {getFieldDecorator('date_range', {
                initialValue: [
                  moment(currentRecord.start_datetime, timeFormat),
                  moment(currentRecord.end_datetime, timeFormat),
                ],
                rules: [{ required: true, message: '请选择有效日期' }],
              })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="发放总数">
              {getFieldDecorator('total', {
                initialValue: currentRecord.total,
                rules: [{ required: true, message: '请输入发放总数！' }],
              })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="发放总数" />)}
            </FormItem>

            <Form.Item {...formItemLayout} label="是否启用">
              {getFieldDecorator('in_use', {
                initialValue: currentRecord.in_use.toString(),
                rules: [{ required: true, message: '请选择是否启用！' }],
              })(<Select placeholder="是否启用" style={{ width: '100%' }}>
                  <Option value="true">启用</Option>
                  <Option value="false">未启用</Option>
                </Select>)}
            </Form.Item>

            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span } }} label="">
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>;
  }
}

export default CouponEdit;
