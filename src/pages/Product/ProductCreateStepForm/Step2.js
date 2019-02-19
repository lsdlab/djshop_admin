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
         message,
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

@connect(({ product, loading }) => ({
  product,
  submitting: loading.effects['product/createProductSpec'],
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
  };

  componentDidMount() {

  }

  render() {
    const { product: { newProduct }, form, dispatch, submitting, location } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onPrev = () => {
      router.push({pathname: '/product/product-create-step-form/product', state: {"backto": true }});
    };

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'product/createProductSpec',
            payload: values,
            productID: location.state.productID,
          }).then(() => {
            message.success('商品上架成功！');
            dispatch({
              type: 'product/clearNewProduct',
            })
            router.push({pathname: '/product/product-create-step-form/finish', state: {"productID": location.state.productID }});
          });

          // const newProductData = JSON.parse(localStorage.getItem('newProductData'));
          // dispatch({
          //   type: 'product/createProduct',
          //   payload: newProductData,
          // }).then(() => {

          // })
        }
      });
    };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <FormItem {...formItemLayout} label="规格名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入规格名称！' }],
            })(<Input placeholder="规格名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="题图链接">
            {getFieldDecorator('header_image', {
              rules: [{ required: true, message: '请输入题图链接！' }],
            })(<Input placeholder="题图链接，单个链接" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="售价">
            {getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入售价！' }],
            })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="售价"/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="市场价">
            {getFieldDecorator('market_price', {
              rules: [{ required: true, message: '请输入市场价！' }],
            })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="市场价"/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="成本价">
            {getFieldDecorator('cost_price', {
              rules: [{ required: true, message: '请输入限成本价！' }],
            })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="成本价"/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="库存数量">
            {getFieldDecorator('stock', {
              rules: [{ required: true, message: '请输入库存数量！' }],
            })(<InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="库存数量"/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="商品货号">
            {getFieldDecorator('sn', {
              rules: [{ required: true, message: '请输入商品货号！'}],
            })(<Input placeholder="商品货号" />)}
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
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              提交
            </Button>
            <Button onClick={onPrev} style={{ marginLeft: 8 }}>
              上一步
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

export default Step2;
