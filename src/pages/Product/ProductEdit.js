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
  submitting: loading.effects['product/patch'],
}))
@Form.create()
class ProductEdit extends React.PureComponent {
  state = {
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const productID = pathList[3];

    this.props.dispatch({
      type: 'product/fetchDetail',
      productID: productID,
    }).then(() => {
      dispatch({
        type: 'product/fetchCategory',
      });
    });
  }

  render() {
    const { product: { categoryData, currentRecord }, form, dispatch, submitting, location } = this.props;
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

          dispatch({
            type: 'product/patch',
            payload: values,
            productID: currentRecord.id,
          }).then(() => {
            message.success('更新商品信息成功！');
            router.push('/product/product-detail/' + currentRecord.id);
          });
        }
      });
    };

    return (
      <PageHeaderWrapper
        title="商品信息编辑"
      >
        <Card bordered={false}>
          <Fragment>
            <Form layout="horizontal" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, maxWidth: 600 }}>
              <FormItem {...formItemLayout} label="ID">
                {getFieldDecorator('id', {
                  initialValue: currentRecord.id,
                })(<Input disabled placeholder="ID" />)}
              </FormItem>

              { categoryData ? (
                <Form.Item {...formItemLayout} label="分类">
                  {getFieldDecorator('category', {
                    initialValue: currentRecord.category,
                    rules: [{ required: true, message: '请选择分类！' }],
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

              <Form.Item {...formItemLayout} label="上架状态">
                {getFieldDecorator('status', {
                  initialValue: currentRecord.status,
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
                  initialValue: currentRecord.name,
                  rules: [{ required: true, message: '请输入名称！' }],
                })(<Input placeholder="商品名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="副标题">
                {getFieldDecorator('subtitle', {
                  initialValue: currentRecord.subtitle,
                  rules: [{ required: true, message: '请输入副标题！' }],
                })(<Input placeholder="商品副标题，十个字符以内" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="单位">
                {getFieldDecorator('unit', {
                  initialValue: currentRecord.unit,
                  rules: [{ required: true, message: '请输入单位！' }],
                })(<Input placeholder="商品单位" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="重量">
                {getFieldDecorator('weight', {
                  initialValue: currentRecord.weight,
                  rules: [{ required: true, message: '请输入重量！' }],
                })(<Input placeholder="商品重量" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="限购数量">
                {getFieldDecorator('limit', {
                  initialValue: currentRecord.limit,
                  rules: [{ required: true, message: '请输入限购数量！' }],
                })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="商品限购数量"/>)}
              </FormItem>

              <FormItem {...formItemLayout} label="是否开发票">
                {getFieldDecorator('has_invoice', {
                  initialValue: currentRecord.has_invoice,
                  rules: [{ required: false }],
                })(
                  <Checkbox></Checkbox>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="是否免运费">
                {getFieldDecorator('ship_free', {
                  initialValue: currentRecord.ship_freeship_free,
                  rules: [{ required: false }],
                })(
                  <Checkbox></Checkbox>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="是否可退货">
                {getFieldDecorator('refund', {
                  initialValue: currentRecord.refund,
                  rules: [{ required: false }],
                })(
                  <Checkbox></Checkbox>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="是否是新品">
                {getFieldDecorator('is_new', {
                  initialValue: currentRecord.is_new,
                  rules: [{ required: false }],
                })(
                  <Checkbox></Checkbox>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="轮播图链接">
                {getFieldDecorator('carousel', {
                  initialValue: currentRecord.carousel.join(','),
                  rules: [{ required: true, message: '请输入轮播图链接！'}],
                })(<TextArea autosize={{ minRows: 5, maxRows: 8 }} placeholder="轮播图链接可填写多个，使用英文逗号 , 进行分隔" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="题图链接">
                {getFieldDecorator('header_image', {
                  initialValue: currentRecord.header_image,
                  rules: [{ required: true, message: '请输入题图链接！' }],
                })(<Input placeholder="题图链接，单个链接" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="商品详情">
                {getFieldDecorator('md', {
                  initialValue: currentRecord.md,
                  rules: [{ required: true, message: '请输入商品详情！'}],
                })(<TextArea autosize={{ minRows: 8, maxRows: 16 }} placeholder="商品详情，图片文字混排，使用 Markdown 格式" />)}
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
            <div className={styles.desc}>
              <h3>商品信息填写说明</h3>
              <h4>轮播图</h4>
              <p>
                轮播图链接可填写多个，使用英文逗号 , 进行分隔
              </p>
            </div>
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductEdit;
