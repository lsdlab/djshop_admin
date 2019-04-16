import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Icon,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
  TreeSelect,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';


const FormItem = Form.Item;
const { Option } = Select;


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
      title="新增推荐商品"
      width={800}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: "请输入标题！" }],
        })(<Input placeholder="标题，八个中文字符" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副标题">
        {form.getFieldDecorator('subtitle', {
          rules: [{ required: true, message: "请输入副标题！" }],
        })(<Input placeholder="副标题，六个中午字符" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副副标题">
        {form.getFieldDecorator('subsubtitle', {
          rules: [{ required: true, message: "请输入副副标题！" }],
        })(<Input placeholder="副副标题，四个中文字符" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
        {form.getFieldDecorator('display_order', {
          rules: [{ required: true, message: '请输入显示顺序！' }],
        })(<InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="显示顺序"/>)}
      </FormItem>

      { allProductIds ? (
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品">
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
        title: props.values.title,
        subtitle: props.values.subtitle,
        subsubtitle: props.values.subsubtitle,
        display_order: props.values.display_order,
        product: props.values.product.id,
      },
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
        title="编辑推荐商品"
        width={800}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('title', {
            initialValue: modalFormVals.title,
            rules: [{ required: true, message: "请输入标题！" }],
          })(<Input placeholder="标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副标题">
          {form.getFieldDecorator('subtitle', {
            initialValue: modalFormVals.subtitle,
            rules: [{ required: true, message: "请输入副标题！" }],
          })(<Input placeholder="副标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副副标题">
          {form.getFieldDecorator('subsubtitle', {
            initialValue: modalFormVals.subsubtitle,
            rules: [{ required: true, message: "请输入副副标题！" }],
          })(<Input placeholder="副副标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
          {form.getFieldDecorator('display_order', {
            initialValue: modalFormVals.display_order,
            rules: [{ required: true, message: '请输入显示顺序！' }],
          })(<InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="显示顺序"/>)}
        </FormItem>
        { allProductIds ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品">
            {form.getFieldDecorator('product', {
                initialValue: modalFormVals.product,
                rules: [{ required: true, message: '请选择商品！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="商品" showSearch={true} optionFilterProp="name">
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
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ProductRecList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 20,
    modalVisible: false,
    updateModalVisible: false,
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchRecProduct',
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'product/fetchProductAllIds',
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
        type: 'product/fetchProductAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/createRecProduct',
      payload: fields,
    }).then((data) => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'product/fetchRecProduct',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/patchRecProduct',
      payload: fields,
      recProductID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'product/fetchRecProduct',
        payload: {},
      });
    });
  };

  recProductDeleted = (flag, recProductID) => {
    const { dispatch } = this.props;
    if (flag && recProductID) {
      dispatch({
        type: 'product/patchRecProduct',
        payload: {
          deleted: true,
        },
        recProductID: recProductID,
      }).then(() => {
        message.success('下架推荐商品成功！');
        dispatch({
          type: 'product/fetchRecProduct',
        });
      });
    } else {
      dispatch({
        type: 'product/patchRecProduct',
        payload: {
          deleted: false,
        },
        recProductID: recProductID,
      }).then(() => {
        message.success('上架推荐商品成功！');
        dispatch({
          type: 'product/fetchRecProduct',
        });
      });
    }
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'product/fetchRecProduct',
      payload: params,
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
              新增推荐商品
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      product: { recData, allProductIds },
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
        title: '副标题',
        dataIndex: 'subtitle',
      },
      {
        title: '副副标题',
        dataIndex: 'subsubtitle',
      },
      {
        title: '商品名称',
        dataIndex: 'product.name',
      },
      {
        title: '展示顺序',
        dataIndex: 'display_order',
      },
      {
        title: '状态',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='下架中' />;
          } else {
            return <Badge status='success' text='上架中' />;
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
            { record.deleted ? (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            ) : <a disabled onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>}
            <Divider type="vertical" />
            { record.deleted ? (
              <Popconfirm title="是否要上架此推荐商品？" onConfirm={() => this.recProductDeleted(false, record.id)}>
                <a>上架</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要下架此推荐商品？" onConfirm={() => this.recProductDeleted(true, record.id)}>
                <a>下架</a>
              </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="推荐商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={recData}
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

export default ProductRecList;
