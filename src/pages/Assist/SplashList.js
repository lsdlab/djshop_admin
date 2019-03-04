import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
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
        {form.getFieldDecorator('splash', {
          rules: [{ required: true, message: '请输入图片链接！' }],
        })(<Input placeholder="图片链接" />)}
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
        splash: props.values.splash
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
          {form.getFieldDecorator('splash', {
            initialValue: modalFormVals.splash,
            rules: [{ required: true, message: '请输入图片链接！' }],
          })(<Input placeholder="图片链接" />)}
          <CopyToClipboard
            text={modalFormVals.splash}
            onCopy={() => message.success('复制成功')}
            style={{ marginTop: 10 }}
          >
            <Button block icon="copy">
              复制图片地址
            </Button>
          </CopyToClipboard>
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ splash, loading }) => ({
  splash,
  loading: loading.models.splash,
}))
@Form.create()
class SplashList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'splash/fetch',
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
      type: 'splash/fetch',
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
      type: 'splash/fetch',
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
      type: 'splash/create',
      payload: fields,
    }).then((data) => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'splash/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'splash/patch',
      payload: fields,
      splashID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'splash/fetch',
        payload: {},
      });
    });
  };

  handleDelete = (splashID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'splash/delete',
      splashID: splashID,
    }).then(() => {
      message.success('删除成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'splash/fetch',
        payload: {},
      });
    });
  };

  handleConvert = (splashID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'splash/convert',
      payload: {
        status: 1,
      },
      splashID: splashID,
    }).then(() => {
      message.success('上线成功！');
      dispatch({
        type: 'splash/fetch',
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
              新增开屏广告
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      splash: { data },
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

            { record.status_name === '下线' ? (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            ) : <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>}

            <Divider type="vertical" />

            { record.status_name === '下线' ? (
              <Popconfirm title="是否要删除此开屏广告？" onConfirm={() => this.handleDelete(record.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要删除此开屏广告？" onConfirm={() => this.handleDelete(record.id)}>
                <a disabled>删除</a>
              </Popconfirm>}

            <Divider type="vertical" />
            { record.status_name === '下线' ? (
              <Popconfirm title="是否要上线此开屏广告？" onConfirm={() => this.handleConvert(record.id)}>
                <a>上线</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要上线此开屏广告？" onConfirm={() => this.handleConvert(record.id)}>
                <a disabled>上线</a>
              </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="开屏广告">
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
        <CreateForm {...parentMethods} modalVisible={modalVisible}  />

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

export default SplashList;
