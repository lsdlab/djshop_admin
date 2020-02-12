import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../List/TableList.less';


const FormItem = Form.Item;
const { Option } = Select;

const buildOptions = optionData => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(
        <Option value={optionData[i].id} key={optionData[i].id}>
          {optionData[i].name}
        </Option>
      );
    }
    return arr;
  }
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, categoryData, handleAdd, handleModalVisible } = props;
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
      title="新增分类"
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('category_type', {
          initialValue: '2',
          rules: [{ required: true, message: '请选择类型！' }],
        })(
          <Select style={{ width: '100%' }} placeholder="类型">
            <Option value="2">一级分类</Option>
            <Option value="3">二级分类</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标链接">
        {form.getFieldDecorator('icon', {
          rules: [{ required: true, message: '请输入图标链接！' }],
        })(<Input placeholder="图标链接" />)}
      </FormItem>
      {categoryData ? (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="一级分类"
          style={{ display: form.getFieldValue('category_type') === '3' ? 'block' : 'none' }}
        >
          {form.getFieldDecorator('parent_category', {
            initialValue: categoryData[0] ? categoryData[0].id : '',
            rules: [
              {
                required: form.getFieldValue('category_type') === '3' ? true : false,
                message: '请选择一级分类！',
              },
            ],
          })(
            <Select style={{ width: '100%' }} placeholder="一级分类">
              {buildOptions(categoryData)}
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

    this.state = {
      modalFormVals: {
        name: props.values.name,
        category_type: props.values.category_type,
        icon: props.values.icon,
        is_root: props.values.category_type === '2' ? true : false,
        parent_category: props.values.parent_category,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  render() {
    const {
      updateModalVisible,
      form,
      categoryData,
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
        title="编辑分类"
        width={800}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            initialValue: modalFormVals.name,
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('category_type', {
            initialValue: '2',
            rules: [{ required: true, message: '请选择类型！' }],
          })(
            <Select style={{ width: '100%' }} placeholder="类型">
              <Option value="2">一级分类</Option>
              {/* <Option value="3">二级分类</Option> */}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标链接">
          {form.getFieldDecorator('icon', {
            rules: [{ required: true, message: '请输入图标链接！' }],
          })(<Input placeholder="图标链接" />)}
        </FormItem>
        {categoryData ? (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="一级分类"
            style={{ display: form.getFieldValue('category_type') === '3' ? 'block' : 'none' }}
          >
            {form.getFieldDecorator('parent_category', {
              initialValue: categoryData[0] ? categoryData[0].id : '',
              rules: [
                {
                  required: form.getFieldValue('category_type') === '3' ? true : false,
                  message: '请选择一级分类！',
                },
              ],
            })(
              <Select style={{ width: '100%' }} placeholder="一级分类">
                {buildOptions(categoryData)}
              </Select>
            )}
          </FormItem>
        ) : null}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ category, loading }) => ({
  category,
  loading: loading.models.category
}))
@Form.create()
class CategoryList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  }

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
      type: 'category/create',
      payload: {
        name: fields.name,
        category_type: fields.category_type,
        icon: fields.icon,
        is_root: fields.category_type === '2' ? true : false,
        parent_category: fields.parent_category,
      },
    }).then(() => {
      message.success('新增分类成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'category/fetch',
      });
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const params = {
      ...fields,
    };
    dispatch({
      type: 'category/patch',
      payload: params,
      categoryID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'category/fetch',
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
              新增分类
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const {
      category: { data },
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
        width: 120,
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'category_type_name',
      },
      {
        title: '包含商品数量',
        dataIndex: 'products_count',
        render(text, record) {
          if (record.category_type == '3') {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              编辑
            </a>
          </Fragment>
        )
      },
    ];

    return (
      <PageHeaderWrapper title="分类">
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

        <CreateForm {...parentMethods} modalVisible={modalVisible} categoryData={data} />

        {currentRecord && Object.keys(currentRecord).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={currentRecord}
            categoryData={data}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default CategoryList;
