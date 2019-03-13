import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Icon,
  Button,
  message,
  Upload,
  Select,
  Input,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import oss from 'ali-oss';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';
import { Base64 } from 'js-base64';

const FormItem = Form.Item;
const { Option } = Select;


const client = (self) => {
  const {token} = self.state
  return new oss({
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    region: 'oss-cn-shanghai',
    bucket: token.OSS_BUCKET,
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

@Form.create()
class UploadImage extends PureComponent {
  state = {
    loading: false,
    token: {
      access_key_id: Base64.decode('TFRBSTNncmRldGlhMlVJdw=='),
      access_key_secret: Base64.decode('emtQcGJsRnhYMXJrejlXWkVPQWtNV3lkNzJJOVBx'),
      OSS_ENDPOINT: Base64.decode('aHR0cHM6Ly9vc3MtY24tc2hhbmdoYWkuYWxpeXVuY3MuY29t'),
      OSS_BUCKET: Base64.decode('ZGpzaG9wbWVkaWE='),
    }
  };

  beforeUpload = (file) => {
    const { form } = this.props;
    const dir = form.getFieldValue('dir');

    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG && !isPNG) {
      message.error('You can only upload JPG or PNG file!');
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      UploadToOss(this, dir, file).then(data => {
        // console.log(data.res.requestUrls)
        this.setState({ imageUrl: data.res.requestUrls });
        message.success('上传图片成功。');
        message.success(data.res.requestUrls);
      })
    }
    return false;
  }

  componentDidMount() {

  }

  render() {
    const { form } = this.props;
    const imageUrl = this.state.imageUrl;

    return (
      <PageHeaderWrapper title="上传图片">
        <Card bordered={false}>
          <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <Form>
                <FormItem>
                  {form.getFieldDecorator('dir', {
                    initialValue: 'tmp',
                  })(<Select style={{ width: "100%" }}>
                      <Option value="tmp">临时文件夹</Option>
                      <Option value="unittests">单元测试(测试用)</Option>
                      <Option value="splash">开屏广告</Option>
                      <Option value="banner">轮播图</Option>
                      <Option value="notice">全网通知配图</Option>
                      <Option value="article">专题题图</Option>
                      <Option value="category_header_image">分类图标</Option>
                      <Option value="product_carousel_image">商品轮播图</Option>
                      <Option value="product_header_image">商品题图</Option>
                      <Option value="product_detail_image">商品详情图</Option>
                    </Select>)}
                </FormItem>
              </Form>
            </Col>
            <Col md={12} sm={24}>
              <Form>
                <FormItem>
                  <Upload
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                  >
                    <Button>
                      <Icon type="upload" /> 上传图片
                    </Button>
                  </Upload>
                </FormItem>
              </Form>
            </Col>
          </Row>

          <div style={{ marginTop: 20 }}>
            {imageUrl ? <img style={{ width: '25%', height: '25%' }} src={imageUrl} alt="" /> : null}
          </div>
          <div style={{ marginTop: 20 }}>
            {imageUrl ? <Input value={imageUrl} /> : null}
          </div>
          <div style={{ marginTop: 20 }}>
            <CopyToClipboard
              text={imageUrl}
              onCopy={() => message.success('复制成功')}
              style={{display: imageUrl ? 'block' : 'none'}}
            >
              <Button icon="copy">
                复制图片地址
              </Button>
            </CopyToClipboard>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UploadImage;
