import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form,
         Input,
         InputNumber,
         Button,
         Select,
         Checkbox,
         Divider,
         TreeSelect,
} from 'antd';
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

@connect(({ product }) => ({
  product,
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchCategory',
    });
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ value });
  }

  selectField = (value, node, field) => {
    console.log(value);
    console.log(node);
  }

  render() {
    const { product: { categoryData }, form, dispatch } = this.props;
    const treeData = categoryData;


    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          router.push('/product/product-create-step-form/spec');
        }
      });
    };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>

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
          <FormItem {...formItemLayout} label="是否免运费">
            {getFieldDecorator('ship_free', {
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可退货">
            {getFieldDecorator('refund', {
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否是新品">
            {getFieldDecorator('is_new', {
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="轮播图链接">
            {getFieldDecorator('carousel', {
              rules: [{ required: true, message: '请输入轮播图链接！'}],
            })(<TextArea rows={5} placeholder="轮播图链接可填写多个，使用英文逗号 , 进行分隔" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="题图链接">
            {getFieldDecorator('header_image', {
              rules: [{ required: true, message: '请输入题图链接！' }],
            })(<Input placeholder="题图链接，单个链接" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="视频链接">
            {getFieldDecorator('header_video', {
              rules: [{ required: false, message: '请输入视频链接！' }],
            })(<Input placeholder="视频链接，单个链接" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="商品详情">
            {getFieldDecorator('md', {
              rules: [{ required: true, message: '请输入商品详情！'}],
            })(<TextArea rows={10} placeholder="商品详情，图片文字混排，使用 Markdown 格式" />)}
          </FormItem>

          { treeData ? (
            <Form.Item {...formItemLayout} label="分类">
              {getFieldDecorator('category', {
                rules: [{ required: true, message: '请选择分类！' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={treeData}
                  placeholder="商品分类"
                  treeDefaultExpandAll={true}
                  showSearch={true}
                  // onSelect={(value, node) => this.selectField(value, node, 'treeSelect')}
                />
              )}
            </Form.Item>
          ) : null}

          <Form.Item {...formItemLayout} label="上架状态">
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择上架状态！' }],
            })(
              <Select placeholder="商品上架状态" style={{ width: '100%' }}>
                <Option value="1">上架</Option>
                <Option value="2">下架</Option>
              </Select>
            )}
          </Form.Item>

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
      </Fragment>
    );
  }
}

export default Step1;
