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
      title="新建"
      width={800}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入标题！' }],
        })(<Input placeholder="名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入内容！'}],
        })(<TextArea rows={10} placeholder="内容(纯文本)" />)}
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
        desc: props.values.desc,
        deleted: props.values.deleted,
        sent: props.values.sent,
        sent_datetime: props.values.sent_datetime,
        created_at: props.values.created_at,
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
        title="详情"
        width={800}
        visible={updateModalVisible}
        footer={null}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          <span>
            {modalFormVals.title}
          </span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          <span>
            {modalFormVals.desc}
          </span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="删除">
          <span>
            { modalFormVals.deleted ? (
              <Badge status='error' text='已删除' />
            ) : (<Badge status='success' text='未删除' />)}
          </span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发送">
          <span>
            { modalFormVals.sent ? (
              <Badge status='success' text='已发送' />
            ) : (<Badge status='error' text='未发送' />)}
          </span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发送时间">
          <span>
            {modalFormVals.sent_datetime}
          </span>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="创建时间">
          <span>
            {modalFormVals.created_at}
          </span>
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ notice, loading }) => ({
  notice,
  loading: loading.models.notice,
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
      type: 'notice/fetch',
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
      type: 'notice/fetch',
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
      type: 'notice/fetch',
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
      type: 'notice/create',
      payload: fields,
    }).then((data) => {
      message.success('新建成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'notice/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/patch',
      payload: fields,
      bannerID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'notice/fetch',
        payload: {},
      });
    });
  };

  handleDeleted = (bannerID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/delete',
      bannerID: bannerID,
    }).then(() => {
      message.success('删除成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'notice/fetch',
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
              新建全网提醒
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      notice: { data },
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
        title: '标题',
        dataIndex: 'title',
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
        title: '发送',
        dataIndex: 'sent',
        render(text, record, index) {
          if (record.sent) {
            return <Badge status='success' text='已发送' />;
          } else {
            return <Badge status='error' text='未发送' />;
          }
        },
      },
      {
        title: '发送时间',
        dataIndex: 'sent_datetime',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>详情</a>
            <Divider type="vertical" />
            { record.deleted ? (
              <Popconfirm title="是否要删除此全网通知？" onConfirm={() => this.handleDelete(record.id)}>
                <a disabled>删除</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要删除此全网通知？" onConfirm={() => this.handleDelete(record.id)}>
                  <a>删除</a>
                </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="全网提醒">
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
