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
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Divider,
  Popconfirm,
  Upload,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
// @connect(({ articles, loading }) => ({
//   articles,
//   loading: loading.models.articles,
// }))
// @Form.create()
class UploadOSS extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    currentRecord: {},
    modalFormValues: {},
  };

  componentDidMount() {

  }

  render() {

    function getToken() {
      if (localStorage.getItem("token") !== null) {
        return localStorage.getItem("token")
      }
      return ''
    }

    const props = {
      name: 'file',
      action: 'http://localhost:9000/api/v1/services/aliyunoss/upload/',
      headers: {
        "Content-Type": 'multipart/form-data',
        "Authorization": 'JWT ' + getToken()
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <PageHeaderWrapper title="上传图片">
        <Card bordered={false}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UploadOSS;
