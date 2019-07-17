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
         Icon,
         Upload,
} from 'antd';
import oss from 'ali-oss';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { Base64 } from 'js-base64';

import router from 'umi/router';
import styles from '../../Forms/StepForm/style.less';

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

const client = (self) => {
  const {token} = self.state
  return new oss({
    accessKeyId: Base64.decode('TFRBSWNQcm41WjZDWFl4Qw=='),
    accessKeySecret: Base64.decode('Wkp4WjJ5RUJnRHNhNEJjcHVMRWxwVG9HejlhS1FV'),
    region: 'oss-cn-shanghai',
    bucket: Base64.decode('ZGpzaG9wbWVkaWE='),
  });
}

const uploadPath = (path, file) => {
  // return `${moment().format('YYYYMMDD')}/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
  return `${path}/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
}
const UploadToOss = (self, path, file) => {
  const url = uploadPath(path, file)
  return new Promise((resolve, reject) => {
    client(self).put(url, file).then(data => {
      resolve(data);
    }).catch(error => {
      reject(error)
    })
  })
}

@connect(({ product, loading }) => ({
  product,
  submitting: loading.effects['product/createProduct'],
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {

  };

  componentDidMount() {
    const { product: { newProduct }, dispatch, form, location } = this.props;
    dispatch({
      type: 'product/fetchCategory',
    });

    if (newProduct && location.state) {
      setTimeout(() => {
        form.setFieldsValue({
          content: BraftEditor.createEditorState(newProduct.content)
        })
      }, 1000)
    }
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG && !isPNG) {
      message.error('只能上传 PNG 或者 JPG/JPEG 图片！');
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      const dir = 'product';
      UploadToOss(this, dir, file).then(data => {
        // 插入图片
        const { form } = this.props;
        const oldEditorValule = form.getFieldsValue()['content'];
        form.setFieldsValue({
          content: ContentUtils.insertMedias(oldEditorValule, [{
            type: 'IMAGE',
            url: data.res.requestUrls,
          }]),
        });
      })
    }
    return false;
  }

  render() {
    const { product: { categoryData, newProduct }, form, dispatch, submitting, location } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const controls = ['undo', 'redo', 'separator',
      'separator', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'remove-styles',  'separator', 'text-indent', 'text-align', 'separator',
      'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'hr', 'separator',
      'link', 'separator']
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
          >
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      }
    ]

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
          values['content'] = values.content.toHTML();
          // console.log(values);

          if (!location.state) {
            dispatch({
              type: 'product/createProduct',
              payload: values,
            });
          } else {
            router.push({pathname: '/product/product-create-step-form/spec', state: {"productID": newProduct.id }});
          }
        }
      });
    };

    return (
      <Fragment>
        <Form layout="horizontal" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, maxWidth: 740 }} >

          { categoryData ? (
            <Form.Item {...formItemLayout} label="分类">
              {getFieldDecorator('category', {
                initialValue: newProduct ? newProduct.category : "",
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
              initialValue: newProduct ? newProduct.status : "",
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
              initialValue: newProduct ? newProduct.name : "",
              rules: [{ required: true, message: '请输入名称！' }],
            })(<Input placeholder="商品名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="副标题">
            {getFieldDecorator('subtitle', {
              initialValue: newProduct ? newProduct.subtitle : "",
              rules: [{ required: true, message: '请输入副标题！' }],
            })(<Input placeholder="商品副标题，十个字符以内" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="单位">
            {getFieldDecorator('unit', {
              initialValue: newProduct ? newProduct.unit : "",
              rules: [{ required: true, message: '请输入单位！' }],
            })(<Input placeholder="商品单位" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重量">
            {getFieldDecorator('weight', {
              initialValue: newProduct ? newProduct.weight : "",
              rules: [{ required: true, message: '请输入重量！' }],
            })(<Input placeholder="商品重量" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="限购数量">
            {getFieldDecorator('limit', {
              initialValue: newProduct ? newProduct.limit : "",
              rules: [{ required: true, message: '请输入限购数量！' }],
            })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="商品限购数量"/>)}
          </FormItem>

          {/*<FormItem {...formItemLayout} label="是否开发票">
            {getFieldDecorator('has_invoice', {
              initialValue: newProduct ? newProduct.has_invoice : "",
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否免运费">
            {getFieldDecorator('ship_free', {
              initialValue: newProduct ? newProduct.ship_free : "",
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可退货">
            {getFieldDecorator('refund', {
              initialValue: newProduct ? newProduct.refund : "",
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否是新品">
            {getFieldDecorator('is_new', {
              initialValue: newProduct ? newProduct.is_new : "",
              rules: [{ required: false }],
            })(
              <Checkbox></Checkbox>
            )}
          </FormItem>*/}

          <FormItem {...formItemLayout} label="轮播图链接">
            {getFieldDecorator('carousel', {
              initialValue: newProduct ? newProduct.carousel : "",
              rules: [{ required: true, message: '请输入轮播图链接！'}],
            })(<TextArea autosize={{ minRows: 5, maxRows: 8 }} placeholder="轮播图链接可填写多个，使用英文逗号 , 进行分隔" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="题图链接">
            {getFieldDecorator('header_image', {
              initialValue: newProduct ? newProduct.header_image : "",
              rules: [{ required: true, message: '请输入题图链接！' }],
            })(<Input placeholder="题图链接，单个链接" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="视频链接">
            {getFieldDecorator('video_url', {
              initialValue: newProduct ? newProduct.video_url : "",
              rules: [{ required: false, message: '请输入视频链接！' }],
            })(<Input placeholder="视频链接，单个链接" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="商品详情">
            {getFieldDecorator('content', {
              initialValue: newProduct ? newProduct.content : "",
              rules: [{ required: true, message: '请输入商品详情！'}],
            })(<BraftEditor
                style={{ border: "1px solid #d9d9d9" }}
                controls={controls}
                extendControls={extendControls}
                placeholder="请输入商品详情"
              />)}
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
