import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  message,
  Upload,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import oss from 'ali-oss';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const client = (self) => {
  const {token} = self.state
  console.log(token);
  return new oss({
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    region: 'oss-cn-shanghai',
    bucket: token.OSS_BUCKET,
  });
}

const uploadPath = (path, file) => {
  return `${moment().format('YYYYMMDD')}/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
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

class UploadImage extends PureComponent {
  state = {
    loading: false,
    token: {
      access_key_id: 'LTAI4sk1hmZ8fz2Y',
      access_key_secret: 'AnvkrzXybT5kCo8XLbedDXn7i3ctOP',
      OSS_ENDPOINT: 'https://oss-cn-shanghai.aliyuncs.com',
      OSS_BUCKET: 'djshopmedia',
    }
  };

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG || !isPNG) {
      message.error('You can only upload JPG or PNG file!');
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      UploadToOss(this, '路径可指定', file).then(data => {
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
    const imageUrl = this.state.imageUrl;

    return (
      <PageHeaderWrapper title="上传图片">
        <Card bordered={false}>
          <Upload
            showUploadList={false}
            beforeUpload={this.beforeUpload}
          >
            <Button>
              <Icon type="upload" /> 上传图片
            </Button>
          </Upload>
          <div style={{ marginTop: 20 }}>
            {imageUrl ? <img style={{ width: '25%', height: '25%' }} src={imageUrl} alt="" /> : <div></div>}
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
