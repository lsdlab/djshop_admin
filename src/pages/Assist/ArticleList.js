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
  Badge,
  Popconfirm,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;

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
      title="新增专题"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入标题！' }],
        })(<Input placeholder="标题" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副标题">
        {form.getFieldDecorator('subtitle', {
          rules: [{ required: true, message: '请输入副标题！' }],
        })(<Input placeholder="副标题" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="题图链接">
        {form.getFieldDecorator('header_image', {
          rules: [{ required: true, message: '请输入题图链接！' }],
        })(<Input placeholder="题图链接" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('md', {
          rules: [{ required: true, message: '请输入内容！'}],
        })(<TextArea rows={10} placeholder="内容(Markdown)" />)}
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
        title: props.values.title,
        subtitle: props.values.subtitle,
        md: props.values.md,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  render() {
    const { updateModalVisible, form, handleUpdateModalVisible } = this.props;
    const { modalFormVals } = this.state;

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="编辑"
        width={1000}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('title', {
            initialValue: modalFormVals.title,
            rules: [{ required: true, message: '请输入标题！' }],
          })(<Input placeholder="标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副标题">
          {form.getFieldDecorator('subtitle', {
            initialValue: modalFormVals.subtitle,
            rules: [{ required: true, message: '请输入副标题！' }],
          })(<Input placeholder="副标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="题图链接">
        {form.getFieldDecorator('header_image', {
          initialValue: modalFormVals.header_image,
          rules: [{ required: true, message: '请输入题图链接！' }],
        })(<Input placeholder="题图链接" />)}
        <CopyToClipboard
            text={modalFormVals.header_image}
            onCopy={() => message.success('复制成功')}
            style={{ marginTop: 10 }}
          >
            <Button block icon="copy">
              复制图片地址
            </Button>
          </CopyToClipboard>
      </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {form.getFieldDecorator('md', {
            initialValue: modalFormVals.md,
            rules: [{ required: true, message: '请输入内容！'}],
          })(<TextArea rows={8} placeholder="内容" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ articles, loading }) => ({
  articles,
  loading: loading.models.articles,
}))
@Form.create()
class ArticleList extends PureComponent {
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
      type: 'articles/fetch',
    });
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'articles/fetch',
      payload: params,
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
    })

    if (flag && record) {
      this.props.dispatch({
        type: 'articles/fetchCurrent',
        articleID: record.id,
      });
    } else {
      this.setState({
        currentRecord: {}
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articles/create',
      payload: {
        title: fields.title,
        content: fields.content,
        subtitle: fields.subtitle,
        status: '1',
        md: fields.md,
        header_image: fields.header_image
      }
    }).then(() => {
      message.success('新增专题成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'articles/fetch',
        payload: {},
      });
    });
  };

  handleDeleted = (articleID, flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articles/patch',
      payload: {
        deleted: flag,
      },
      articleID: articleID,
    }).then(() => {
      message.success('删除成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'articles/fetch',
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
              新增专题
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      articles: { data, currentRecord },
      loading,
    } = this.props;
    const { currentPage, pageSize, modalVisible, updateModalVisible } = this.state;

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
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '副标题',
        dataIndex: 'subtitle',
      },
      {
        title: '作者',
        dataIndex: 'author',
      },
      {
        title: '删除',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='已删除' />;
          } else {
            return <Badge status='success' text='未删除' />;
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
            { record.deleted ? (
              <Popconfirm title="是否要恢复此专题？" onConfirm={() => this.handleDeleted(record.id, false)}>
                <a>恢复</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要删除此专题？" onConfirm={() => this.handleDeleted(record.id, true)}>
                  <a>删除</a>
                </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="专题">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
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

export default ArticleList;
