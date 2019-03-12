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
         Card,
         message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ProductCreateStepForm/style.less';

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
  submitting: loading.effects['product/patchProductSpec'],
}))
@Form.create()
class ProductSpecEdit extends React.PureComponent {
  state = {
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const productSpecID = pathList[3];

    this.props.dispatch({
      type: 'product/fetchProductSpecDetail',
      productSpecID: productSpecID,
    }).then(() => {
      dispatch({
      type: 'product/fetchCategory',
    });
    });
  }

  render() {
    const { product: { specCurrentRecord }, form, dispatch, submitting, location } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'product/patchProductSpec',
            payload: values,
            productSpecID: specCurrentRecord.id,
          }).then(() => {
            message.success('更新商品规格信息成功！');
            router.push('/product/product-detail/' + location.state.productID);
          });
        }
      });
    };

    return (
      <PageHeaderWrapper
        title="商品规格编辑"
      >
        <Card bordered={false}>
          <Fragment>
            <Form layout="horizontal" className={styles.stepForm}>
              <FormItem {...formItemLayout} label="ID">
                {getFieldDecorator('id', {
                  initialValue: specCurrentRecord.id,
                })(<Input disabled placeholder="ID" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="规格名称">
                {getFieldDecorator('name', {
                  initialValue: specCurrentRecord.name,
                  rules: [{ required: true, message: '请输入规格名称！' }],
                })(<Input placeholder="规格名称" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="题图链接">
                {getFieldDecorator('header_image', {
                  initialValue: specCurrentRecord.header_image,
                  rules: [{ required: true, message: '请输入题图链接！' }],
                })(<Input placeholder="题图链接，单个链接" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="售价">
                {getFieldDecorator('price', {
                  initialValue: specCurrentRecord.price,
                  rules: [{ required: true, message: '请输入售价！' }],
                })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="售价"/>)}
              </FormItem>

              <FormItem {...formItemLayout} label="市场价">
                {getFieldDecorator('market_price', {
                  initialValue: specCurrentRecord.market_price,
                  rules: [{ required: true, message: '请输入市场价！' }],
                })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="市场价"/>)}
              </FormItem>

              <FormItem {...formItemLayout} label="成本价">
                {getFieldDecorator('cost_price', {
                  initialValue: specCurrentRecord.cost_price,
                  rules: [{ required: true, message: '请输入限成本价！' }],
                })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="成本价"/>)}
              </FormItem>

              <FormItem {...formItemLayout} label="库存数量">
                {getFieldDecorator('stock', {
                  initialValue: specCurrentRecord.stock,
                  rules: [{ required: true, message: '请输入库存数量！' }],
                })(<InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="库存数量"/>)}
              </FormItem>

              <FormItem {...formItemLayout} label="商品货号">
                {getFieldDecorator('sn', {
                  initialValue: specCurrentRecord.sn,
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
                  保存
                </Button>
              </Form.Item>
            </Form>
            <Divider style={{ margin: '40px 0 24px' }} />
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductSpecEdit;
