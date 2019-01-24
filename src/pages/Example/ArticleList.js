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
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
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
      title="新建"
      width={800}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入标题！' }],
        })(<Input placeholder="请输入标题" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: '请输入内容！'}],
        })(<TextArea rows={8} placeholder="请输入内容" />)}
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
        content: props.values.content
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
        width={800}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('title', {
            initialValue: modalFormVals.title,
            rules: [{ required: true, message: '请输入标题！' }],
          })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {form.getFieldDecorator('content', {
            initialValue: modalFormVals.content,
            rules: [{ required: true, message: '请输入内容！'}],
          })(<TextArea rows={8} placeholder="请输入内容" />)}
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

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '状态',
      dataIndex: 'status_name',
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
          <Popconfirm title="是否要删除此文章？" onConfirm={() => this.handleRemove(record.id)}>
              <a>删除</a>
            </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'articles/fetch',
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
      type: 'articles/fetch',
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
      type: 'articles/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const values = {
      search: fieldsValue.search,
      status: fieldsValue.status,
    };

    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'articles/fetch',
      payload: values,
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
      type: 'articles/create',
      payload: {
        title: fields.title,
        content: fields.content,
        status: '1',
      }
    }).then((data) => {
      message.success('添加文章成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'articles/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articles/patch',
      payload: {
        title: fields.title,
        content: fields.content
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handleRemove = (articleID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articles/delete',
      articleID: articleID,
    }).then(() => {
      message.success('删除文章成功！');
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="标题/内容" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">上线</Option>
                  <Option value="2">下线</Option>
                  <Option value="3">草稿</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
          <Col md={4} sm={12}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      articles: { data },
      loading,
    } = this.props;
    const { currentPage, modalVisible, updateModalVisible, currentRecord } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="文章查询列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={this.columns}
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
