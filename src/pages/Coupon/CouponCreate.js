import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Icon,
  Button,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
  Tooltip,
  TreeSelect,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Product/style.less';
import formStyles from '../Forms/style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;


const buildOptions = (optionData) => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(<Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>{optionData[i].combined_name}</Option>)
    }
    return arr;
  }
}


/* eslint react/no-multi-comp:0 */
@connect(({ coupon, loading }) => ({
  coupon,
  submitting: loading.effects['coupon/create'],
}))
@Form.create()
class CouponCreate extends PureComponent {
  state = {

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
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          start_datetime: moment(values.date_range[0]).format('YYYY-MM-DD 00:00:00'),
          end_datetime: moment(values.date_range[1]).format('YYYY-MM-DD 00:00:00'),
          ...values,
        };
        dispatch({
          type: 'coupon/create',
          payload: params,
        }).then(() => {
          message.success('新增优惠卷成功');
          form.resetFields();
        });
      }
    });
  };

  render() {
    const { coupon: { categoryData, allProductIds }, form, submitting } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper title="新增优惠卷">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Form.Item {...formItemLayout} label="类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择类型！' }],
              })(
                <Select placeholder="类型" style={{ width: '100%' }}>
                  <Option value="3">普通</Option>
                  <Option value="2">积分</Option>
                  <Option value="1">会员</Option>
                </Select>
              )}
            </Form.Item>

            <FormItem {...formItemLayout} label="所需积分" style={{display: form.getFieldValue('type') === '2' ? 'block' : 'none'}}>
              {getFieldDecorator('points', {
                rules: [{ required: form.getFieldValue('type') === '2' ? true : false, message: '请输入所需积分' }],
              })(<InputNumber min={1} step={1} style={{ width: '100%' }} placeholder="所需积分"/>)}
            </FormItem>

            <Form.Item {...formItemLayout} label="内部类型">
              {getFieldDecorator('internal_type', {
                rules: [{ required: true, message: '请选择内部类型！' }],
              })(
                <Select placeholder="内部类型" style={{ width: '100%' }}>
                  <Option value="1">全场满金额减</Option>
                  <Option value="2">分类满金额减</Option>
                  <Option value="3">单品满金额减</Option>
                  <Option value="4">全场满件数减</Option>
                  <Option value="5">分类满件数减</Option>
                  <Option value="6">单品满件数减</Option>
                </Select>
              )}
            </Form.Item>

            { categoryData ? (
              <Form.Item {...formItemLayout} label="分类" style={{display: form.getFieldValue('internal_type') === '2' || form.getFieldValue('internal_type') === '5' ? 'block' : 'none'}}>
                {getFieldDecorator('category', {
                  rules: [{ required: form.getFieldValue('internal_type') === '2' || form.getFieldValue('internal_type') === '5' ? true : false, message: '请选择分类！' }],
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    treeData={categoryData}
                    placeholder="商品分类"
                    treeDefaultExpandAll={true}
                    showSearch={true}
                  />
                )}
              </Form.Item>
            ) : null}

            { allProductIds ? (
              <FormItem {...formItemLayout} label="商品" style={{display: form.getFieldValue('internal_type') === '3' || form.getFieldValue('internal_type') === '6' ? 'block' : 'none'}}>
                {form.getFieldDecorator('product', {
                    rules: [{ required: form.getFieldValue('internal_type') === '3' || form.getFieldValue('internal_type') === '6' ? true : false, message: '请选择商品！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="商品" showSearch={true} optionFilterProp="name">
                      {buildOptions(allProductIds)}
                    </Select>
                  )}
              </FormItem>
            ) : null}

            <FormItem {...formItemLayout} label="达到价格" style={{display: form.getFieldValue('internal_type') === '1' || form.getFieldValue('internal_type') === '2' || form.getFieldValue('internal_type') === '3' ? 'block' : 'none'}}>
              {getFieldDecorator('reach_price', {
                rules: [{ required: form.getFieldValue('internal_type') === '1' || form.getFieldValue('internal_type') === '2' || form.getFieldValue('internal_type') === '3' ? true : false, message: '请输入达到价格！' }],
              })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="达到价格"/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="达到件数" style={{display: form.getFieldValue('internal_type') === '4' || form.getFieldValue('internal_type') === '5' || form.getFieldValue('internal_type') === '6' ? 'block' : 'none'}}>
              {getFieldDecorator('reach_unit', {
                rules: [{ required: form.getFieldValue('internal_type') === '4' || form.getFieldValue('internal_type') === '5' || form.getFieldValue('internal_type') === '6' ? true : false, message: '请输入达到件数！' }],
              })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="商品达到件数"/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="折扣价格">
              {getFieldDecorator('discount_price', {
                rules: [{ required: true, message: '请输入折扣价格！' }],
              })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="折扣价格"/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称！' }],
              })(<Input placeholder="优惠卷名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('desc', {
                rules: [{ required: true, message: '请输入描述！'}],
              })(<TextArea autosize={{ minRows: 4, maxRows: 6 }} placeholder="优惠卷描述，长文本" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="有效日期">
              {getFieldDecorator('date_range', {
                rules: [{ required: true, message: '请选择有效日期' }],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={[ "开始日期", "结束日期" ]}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="发放总数">
              {getFieldDecorator('total', {
                rules: [{ required: true, message: '请输入发放总数！' }],
              })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="发放总数"/>)}
            </FormItem>

            <Form.Item {...formItemLayout} label='是否启用'>
              {getFieldDecorator('in_use', {
                initialValue: 'true',
                rules: [{ required: true, message: '请选择是否启用！' }],
              })(
                <Select placeholder="是否启用" style={{ width: '100%' }}>
                  <Option value="true">启用</Option>
                  <Option value="false">未启用</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                新增
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponCreate;
