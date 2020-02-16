import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  TreeSelect,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../List/TableList.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, allProductIds, form, handleAdd, handleModalVisible } = props;
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
      title="新增开屏广告"
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

      {allProductIds ? (
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="商品"
          style={{ display: 'none' }}
        >
          {form.getFieldDecorator('product', {
            rules: [{ required: false, message: '请选择商品！' }],
          })(
            <TreeSelect
              style={{ width: '100%' }}
              treeData={allProductIds}
              placeholder="商品"
              treeDefaultExpandAll={true}
              showSearch={true}
            />
          )}
        </Form.Item>
      ) : null}
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
        splash: props.values.splash,
        product: props.values.product ? props.values.product.id : '',
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  routerImageNewTab = (url) => {
    window.open(
      url, '_blank'
    );
  };

  render() {
    const {
      updateModalVisible,
      allProductIds,
      form,
      handleUpdate,
      handleUpdateModalVisible,
    } = this.props;
    const { modalFormVals } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="编辑开屏广告"
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
            onCopy={() => message.success('复制图片链接成功')}
            style={{ marginTop: 10 }}
          >
            <Button block icon="copy">
              复制图片链接
            </Button>
          </CopyToClipboard>
          <Button block icon="plus" onClick={() => this.routerImageNewTab(modalFormVals.splash)}>
            新页面打开
          </Button>
        </FormItem>

        {allProductIds ? (
          <Form.Item
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="商品"
            style={{ display: 'none' }}
          >
            {form.getFieldDecorator('product', {
              initialValue: modalFormVals.product,
              rules: [{ required: false, message: '请选择商品！' }],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                treeData={allProductIds}
                placeholder="商品"
                treeDefaultExpandAll={true}
                showSearch={true}
              />
            )}
          </Form.Item>
        ) : null}
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

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    this.setState({
      currentPage: pagination.current,
    });

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

    if (flag) {
      this.props.dispatch({
        type: 'splash/fetchProductAllIds',
        payload: {
          none: true,
        },
      });
    }
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      currentRecord: record || {},
    });

    if (flag) {
      this.props.dispatch({
        type: 'splash/fetchProductAllIds',
        payload: {
          none: true,
        },
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const params = {
      ...fields,
    };
    if (params['product'] === '无') {
      delete params['product'];
    }
    dispatch({
      type: 'splash/create',
      payload: params,
    }).then(data => {
      message.success('新增开屏广告成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'splash/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const params = {
      ...fields,
    };
    if (params['product'] === '无') {
      params['product'] = null;
    }
    dispatch({
      type: 'splash/patch',
      payload: params,
      splashID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新开屏广告成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'splash/fetch',
        payload: {},
      });
    });
  };

  handleConvert = splashID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'splash/convert',
      payload: {
        status: 1,
      },
      splashID: splashID,
    }).then(() => {
      message.success('上线开屏广告成功');
      dispatch({
        type: 'splash/fetch',
        payload: {},
      });
    });
  };

  renderSimpleForm() {
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
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
      splash: { data, allProductIds },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, currentRecord } = this.state;

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
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '商品名称',
        dataIndex: 'product.name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(text) {
          if (text === '1') {
            return <Badge status="success" text="上线" />;
          } else if (text === '2') {
            return <Badge status="error" text="下线" />;
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            {record.status_name === '下线' ? (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            ) : (
              <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>
                编辑
              </a>
            )}

            <Divider type="vertical" />

            {record.status_name === '下线' ? (
              <Popconfirm
                title="是否要上线此开屏广告？"
                onConfirm={() => this.handleConvert(record.id)}
              >
                <a>上线</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="是否要上线此开屏广告？"
                onConfirm={() => this.handleConvert(record.id)}
              >
                <a disabled>上线</a>
              </Popconfirm>
            )}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="开屏广告">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              current={this.state.currentPage}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <CreateForm {...parentMethods} modalVisible={modalVisible} allProductIds={allProductIds} />

        {currentRecord && Object.keys(currentRecord).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={currentRecord}
            allProductIds={allProductIds}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default SplashList;
