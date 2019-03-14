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
  Select,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;


const buildOptions = (optionData) => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(<Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>{optionData[i].combined_name}</Option>)
    }
    return arr;
  }
}


const CreateForm = Form.create()(props => {
  const { modalVisible, allProductIds, form, handleAdd, handleModalVisible, } = props;

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
        })(<TextArea autosize={{ minRows: 8, maxRows: 16 }} placeholder="内容(Markdown)" />)}
      </FormItem>
      { allProductIds ? (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品">
          {form.getFieldDecorator('products', {
              rules: [{ required: false, message: '请选择商品！' }],
            })(
              <Select style={{ width: '100%' }} mode="multiple" placeholder="商品" showSearch={true} optionFilterProp="name">
                {buildOptions(allProductIds)}
              </Select>
            )}
        </FormItem>
      ) : null}
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    let products = [];
    for (let i = 0; i < props.values.products.length; i++) {
      // products.push(props.values.products[i]['category_first_name'] + '-' + props.values.products[i]['category_name'] + '-' + props.values.products[i]['name'])
      products.push(props.values.products[i]['id'])
    }

    this.state = {
      modalFormVals: {
        title: props.values.title,
        subtitle: props.values.subtitle,
        header_image: props.values.header_image,
        md: props.values.md,
        products: products,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  render() {
    const { updateModalVisible, allProductIds, form, handleUpdate, handleUpdateModalVisible } = this.props;
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
        title="编辑专题"
        width={1000}
        visible={updateModalVisible}
        onOk={okHandle}
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
          })(<TextArea autosize={{ minRows: 8, maxRows: 16 }} placeholder="内容" />)}
        </FormItem>

        { allProductIds ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品">
            {form.getFieldDecorator('products', {
                initialValue: modalFormVals.products,
                rules: [{ required: false, message: '请选择商品！' }],
              })(
                <Select style={{ width: '100%' }} mode="multiple" placeholder="商品" showSearch={true} optionFilterProp="name">
                  {buildOptions(allProductIds)}
                </Select>
              )}
          </FormItem>
        ) : null}

      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ article, loading }) => ({
  article,
  loading: loading.models.article,
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
      type: 'article/fetch',
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
      type: 'article/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'article/fetchProductAllIds',
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
        type: 'article/fetchProductAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/create',
      payload: {
        title: fields.title,
        content: fields.content,
        subtitle: fields.subtitle,
        status: '1',
        md: fields.md,
        header_image: fields.header_image,
        products: fields.products
      }
    }).then(() => {
      message.success('新增专题成功');
      this.handleModalVisible();
      dispatch({
        type: 'article/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/patch',
      payload: fields,
      articleID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新专题成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'article/fetch',
        payload: {},
      });
    });
  };

  handleDeleted = (flag, articleID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/patch',
      payload: {
        deleted: flag,
      },
      articleID: articleID,
    }).then(() => {
      if (flag) {
        message.success('删除专题成功');
      } else {
        message.success('恢复专题成功')
      }
      dispatch({
        type: 'article/fetch',
        payload: {},
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
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
      article: { data, allProductIds },
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
        title: 'ID',
        dataIndex: 'id',
      },
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
              <Popconfirm title="是否要恢复此专题？" onConfirm={() => this.handleDeleted(false, record.id )}>
                <a>恢复</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要删除此专题？" onConfirm={() => this.handleDeleted(true, record.id)}>
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

export default ArticleList;
