import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Card, Form, Icon, Button, message, Upload, Select, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import oss from 'ali-oss';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import defaultSettings from '../../defaultSettings';

import { Base64 } from 'js-base64';

const FormItem = Form.Item;
const { Option } = Select;

const client = self => {
  const { token } = self.state;
  return new oss({
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    region: token.region,
    bucket: token.OSS_BUCKET,
  });
};

const uploadPath = (path, file) => {
  return `${path}/${file.name.split('.')[0]}-${file.uid}.${file.type.split('/')[1]}`;
};
const UploadToOss = (self, path, file) => {
  const url = uploadPath(path, file);
  return new Promise((resolve, reject) => {
    client(self)
      .put(url, file)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

@Form.create()
class UploadImage extends PureComponent {
  state = {
    token: {
      access_key_id: Base64.decode(defaultSettings.access_key_id),
      access_key_secret: Base64.decode(defaultSettings.access_key_secret),
      region: defaultSettings.region,
      OSS_BUCKET: Base64.decode(defaultSettings.OSS_BUCKET),
    },
    imageUrl: '',
  };

  beforeUpload = file => {
    const { form } = this.props;
    const dir = form.getFieldValue('dir');
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG && !isPNG) {
      message.error('只能上传 PNG 或者 JPG/JPEG 图片！');
      return false;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      if (localStorage.getItem('currentMerchant') !== null) {
        const merchantname = JSON.parse(localStorage.getItem('currentMerchant')).merchantname;
        UploadToOss(this, merchantname + '/' + dir, file).then(data => {
          // console.log(data.res.requestUrls)
          this.setState({ imageUrl: data.res.requestUrls });
          message.success('上传图片成功。');
          message.success(data.res.requestUrls);
        });
      }
    };
    return false;
  };

  componentDidMount() {}

  render() {
    const { form } = this.props;
    const imageUrl = this.state.imageUrl;

    const routerImageNewTab = (url) => {
      window.open(
        url, '_blank'
      );
    };

    return (
      <PageHeaderWrapper title="上传图片">
        <Card bordered={false}>
          <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <Form>
                <FormItem>
                  {form.getFieldDecorator('dir', {
                    initialValue: 'tmp',
                  })(
                    <Select style={{ width: '100%' }}>
                      <Option value="tmp">临时文件夹</Option>
                      <Option value="assist">开屏广告 & 轮播图 & 全网通知配图 & 专题题图</Option>
                      <Option value="product">商品</Option>
                    </Select>
                  )}
                </FormItem>
              </Form>
            </Col>
            <Col md={12} sm={24}>
              <Form>
                <FormItem>
                  <Upload showUploadList={false} beforeUpload={this.beforeUpload}>
                    <Button>
                      <Icon type="upload" /> 上传图片
                    </Button>
                  </Upload>
                </FormItem>
              </Form>
            </Col>
          </Row>

          <div style={{ marginTop: 20 }}>
            {imageUrl ? (
              <img style={{ width: '25%', height: '25%' }} src={imageUrl} alt="" />
            ) : null}
          </div>

          <div style={{ marginTop: 20 }}>
            {imageUrl ? <Input value={imageUrl} /> : null}
          </div>

          <div style={{ marginTop: 20 }}>
            <CopyToClipboard
              text={imageUrl}
              onCopy={() => message.success('复制成功')}
              style={{ display: imageUrl ? 'block' : 'none' }}
            >
              <Button icon="copy">复制图片地址</Button>
            </CopyToClipboard>
            <Button block icon="plus" onClick={() => routerImageNewTab(imageUrl)} style={{ display: imageUrl ? 'block' : 'none' }}>
              新页面打开
            </Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UploadImage;
