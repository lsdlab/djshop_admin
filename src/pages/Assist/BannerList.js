import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import SimpleNonPaginationTable from '@/components/SimpleNonPaginationTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      centered
      keyboard
      title="新增"
      width={800}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称！' }],
        })(<Input placeholder="名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片链接">
        {form.getFieldDecorator('banner', {
          rules: [{ required: true, message: '请输入图片链接！' }],
        })(<Input placeholder="图片链接" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
        {form.getFieldDecorator('display_order', {
          rules: [{ required: true, message: '请输入显示顺序！' }],
        })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="显示顺序"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {form.getFieldDecorator('status', {
            rules: [{ required: true, message: '请选择状态！' }],
          })(
            <Select style={{ width: '100%' }}>
              <Option value="1">上线</Option>
              <Option value="2">下线</Option>
            </Select>
          )}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalFormVals: {
        name: props.values.name,
        banner: props.values.banner,
        display_order: props.values.display_order,
        status: props.values.status,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  render() {
    const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible } = this.props;
    const { modalFormVals } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="编辑"
        width={800}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            initialValue: modalFormVals.name,
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片链接">
          {form.getFieldDecorator('banner', {
            initialValue: modalFormVals.banner,
            rules: [{ required: true, message: '请输入图片链接！' }],
          })(<Input placeholder="图片链接" />)}
          <CopyToClipboard
            text={modalFormVals.banner}
            onCopy={() => message.success('复制成功')}
            style={{ marginTop: 10 }}
          >
            <Button block icon="copy">
              复制图片地址
            </Button>
          </CopyToClipboard>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
          {form.getFieldDecorator('display_order', {
            initialValue: modalFormVals.display_order,
            rules: [{ required: true, message: '请输入显示顺序！' }],
          })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="显示顺序"/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {form.getFieldDecorator('status', {
            initialValue: modalFormVals.status,
            rules: [{ required: true, message: '请选择状态！' }],
          })(
            <Select style={{ width: '100%' }}>
              <Option value="1">上线</Option>
              <Option value="2">下线</Option>
            </Select>
          )}
      </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ banner, loading }) => ({
  banner,
  loading: loading.models.banner,
}))
@Form.create()
class BannerList extends PureComponent {
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
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'banner/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'banner/fetch',
      payload: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      currentRecord: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/create',
      payload: fields,
    }).then((data) => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'banner/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/patch',
      payload: fields,
      bannerID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'banner/fetch',
        payload: {},
      });
    });
  };

  handleDelete = (bannerID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/delete',
      bannerID: bannerID,
    }).then(() => {
      message.success('删除成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'banner/fetch',
        payload: {},
      });
    });
  };

  handleConvertUp = (bannerID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/patch',
      payload: {
        status: 1,
      },
      bannerID: bannerID,
    }).then(() => {
      message.success('上线成功！');
      dispatch({
        type: 'banner/fetch',
        payload: {},
      });
    });
  };

  handleConvertDown = (bannerID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/patch',
      payload: {
        status: 2,
      },
      bannerID: bannerID,
    }).then(() => {
      message.success('下线成功！');
      dispatch({
        type: 'banner/fetch',
        payload: {},
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新增轮播图
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      banner: { data },
      loading,
    } = this.props;
    const { currentPage, pageSize, modalVisible, updateModalVisible, currentRecord } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '显示顺序',
        dataIndex: 'display_order',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          if (val === '1') {
            return <Badge status='success' text='上线' />;
          } else if (val === '2') {
            return <Badge status='error' text='下线' />;
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            { record.status_name === '上线' ? (
              <Popconfirm title="是否要下线此轮播图？" onConfirm={() => this.handleConvertDown(record.id)}>
                <a>下线</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要上线此轮播图？" onConfirm={() => this.handleConvertUp(record.id)}>
                <a>上线</a>
              </Popconfirm>}
            <Divider type="vertical" />
            { record.status_name === '上线' ? (
              <Popconfirm title="是否要删除此轮播图？" onConfirm={() => this.handleDelete(record.id)}>
                <a disabled>删除</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要删除此轮播图？" onConfirm={() => this.handleDelete(record.id)}>
                  <a>删除</a>
                </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="轮播图">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleNonPaginationTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {currentRecord && Object.keys(currentRecord).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={currentRecord}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default BannerList;
