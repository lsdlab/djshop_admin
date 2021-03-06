import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Button, Select, Divider, TreeSelect } from 'antd';

import router from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@connect(({ product, loading }) => ({
  product,
  submitting: loading.effects['product/createProduct'],
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {};

  componentDidMount() {
    const {
      product: { newProduct },
      dispatch,
      location,
      form,
    } = this.props;
    dispatch({
      type: 'product/fetchCategory',
    });

    // 恢复符文本编辑器输入的内容
    if (location.state && newProduct) {
      setTimeout(() => {
        form.setFieldsValue({
          desc: newProduct.desc,
        });
      }, 1500);
    }
  }

  render() {
    const {
      product: { categoryData, newProduct },
      form,
      dispatch,
      submitting,
      location,
    } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          // 默认这一步已经 post 成功数据，商品 deleted=true carousel 整理成 list 加入 values
          values['deleted'] = false;
          var newCarousel = [];
          if (values['carousel'].indexOf(',') > -1) {
            var oldCarousel = values['carousel'].split(',');
            for (let i = 0; i < oldCarousel.length; i += 1) {
              newCarousel.push(oldCarousel[i]);
            }
          } else {
            newCarousel.push(values['carousel']);
          }
          values['carousel'] = newCarousel;
          console.log(values);

          if (!location.state) {
            dispatch({
              type: 'product/createProduct',
              payload: values,
            });
          } else {
            router.push({
              pathname: '/product/product-create-step-form/spec',
              state: { productID: newProduct.id },
            });
          }
        }
      });
    };

    return (
      <Fragment>
        <Form
          layout="horizontal"
          style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, maxWidth: 740 }}
        >
          {categoryData.results ? (
            <Form.Item {...formItemLayout} label="分类">
              {getFieldDecorator('category', {
                initialValue: newProduct.category,
                rules: [{ required: true, message: '请选择分类！' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={categoryData.results}
                  placeholder="商品分类"
                  treeDefaultExpandAll={true}
                  showSearch={true}
                />
              )}
            </Form.Item>
          ) : null}

          <Form.Item {...formItemLayout} label="上架状态">
            {getFieldDecorator('status', {
              initialValue: newProduct.status,
              rules: [{ required: true, message: '请选择上架状态！' }],
            })(
              <Select placeholder="商品上架状态" style={{ width: '100%' }}>
                <Option value="1">上架</Option>
                <Option value="2">下架</Option>
              </Select>
            )}
          </Form.Item>

          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              initialValue: newProduct.name,
              rules: [{ required: true, message: '请输入名称！' }],
            })(<Input placeholder="商品名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="副标题">
            {getFieldDecorator('subtitle', {
              initialValue: newProduct.subtitle,
              rules: [{ required: true, message: '请输入副标题！' }],
            })(<Input placeholder="商品副标题，十个字符以内" />)}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="单位">
            {getFieldDecorator('unit', {
              initialValue: newProduct.unit,
              rules: [{ required: false, message: '请输入单位！' }],
            })(<Input placeholder="商品单位" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重量">
            {getFieldDecorator('weight', {
              initialValue: newProduct.weight,
              rules: [{ required: false, message: '请输入重量！' }],
            })(<Input placeholder="商品重量" />)}
          </FormItem> */}
          <FormItem {...formItemLayout} label="限购数量">
            {getFieldDecorator('limit', {
              initialValue: newProduct.limit,
              rules: [{ required: true, message: '请输入限购数量！' }],
            })(
              <InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="商品限购数量" />
            )}
          </FormItem>

          {/*<FormItem {...formItemLayout} label="是否开发票">
            {getFieldDecorator('has_invoice', {
              initialValue: newProduct.has_invoice,
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否免运费">
            {getFieldDecorator('ship_free', {
              initialValue: newProduct.ship_freeship_free,
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可退货">
            {getFieldDecorator('refund', {
              initialValue: newProduct.refund,
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否是新品">
            {getFieldDecorator('is_new', {
              initialValue: newProduct.is_new,
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>*/}
          <FormItem {...formItemLayout} label="题图链接">
            {getFieldDecorator('header_image', {
              initialValue: newProduct.header_image,
              rules: [{ required: true, message: '请输入题图链接！' }],
            })(<Input placeholder="题图链接，单个链接" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="轮播图链接">
            {getFieldDecorator('carousel', {
              initialValue: newProduct.carousel,
              rules: [{ required: true, message: '请输入轮播图链接！' }],
            })(
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="轮播图链接可填写多个，使用英文逗号 , 进行分隔"
              />
            )}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="视频链接">
            {getFieldDecorator('video_url', {
              initialValue: newProduct.video_url,
              rules: [{ required: false, message: '请输入视频链接！' }],
            })(<Input placeholder="视频链接，单个链接" />)}
          </FormItem> */}

          <FormItem {...formItemLayout} label="商品详情">
            {getFieldDecorator('desc', {
              initialValue: newProduct.desc,
              rules: [{ required: true, message: '请输入商品详情！' }],
            })(
              <TextArea autoSize={{ minRows: 18, maxRows: 24 }} placeholder="商品详情(Markdown)" />
            )}
          </FormItem>

          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>商品信息填写说明</h3>
          <h4>轮播图</h4>
          <p>轮播图链接可填写多个，使用英文逗号 , 进行分隔</p>
          <h4>题图链接</h4>
          <p>题图链接填写单个链接，无需使用标点符号</p>
          <h4>商品详情</h4>
          <p>商品详情使用富文本编辑器，插入图片使用内置的上传功能</p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
