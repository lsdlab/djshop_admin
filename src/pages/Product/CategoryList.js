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
  Radio,
  Icon,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Tree,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TreeNode } = Tree;

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
      title="添加分类"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: "请输入名称！"
            },
          ],
        })(<Input placeholder="名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('category_type', {
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="一级分类" style={{display: form.getFieldValue('category_type') === '3' ? 'block' : 'none'}}>
        {form.getFieldDecorator('parent_category', {
            rules: [{ required: false, message: '请选择一级分类！' }],
          })(
            <Select style={{ width: '100%' }} placeholder="一级分类">
              <Option value="1">一级分类</Option>
            </Select>
          )}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ category, loading }) => ({
  category,
  submitting: loading.effects['category/create'],
}))
@Form.create()
class CategoryList extends PureComponent {
  state = {
    modalVisible: false,
    editFormVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  }

  handleRefresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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
        parent_category: fields.parent_category,
      }
    }).then(() => {
      message.success('添加分类成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'category/fetch'
      });
    });
  };

  onSelect = (selectedKeys, info) => {
    const { form } = this.props;
    this.setState({
      editFormVisible: true,
    })
    form.setFieldsValue({
      name: info.selectedNodes[0].props.dataRef.name,
      category_type: info.selectedNodes[0].props.dataRef.category_type,
      icon: info.selectedNodes[0].props.dataRef.icon,
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'category/patch',
          payload: values,
        }).then(() => {
          message.success('修改专题成功');
        });
      }
    });
  };

  renderTreeNodes = data => data.map((item) => {
    if (item && item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} />;
  })

  render() {
    const { category: { data }, submitting, form } = this.props;
    const treeData = data;
    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="分类">
        <Card bordered={false}>
          <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加分类
              </Button>
              <Button icon="retweet" type="primary" onClick={() => this.handleRefresh()} style={{ marginLeft: 10 }}>
                刷新
              </Button>
              <CreateForm {...parentMethods} modalVisible={modalVisible} />
            </Col>
          </Row>
          <Row gutter={{ md: 12, lg: 24, xl: 48 }} style={{ marginTop: 10 }}>
            <Col md={6} sm={24}>
              { treeData ? (
                <Tree
                  autoExpandParent={true}
                  defaultExpandAll={true}
                  defaultExpandParent={true}
                  onSelect={this.onSelect}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
                ) : null}
            </Col>
            <Col md={18} sm={24} style={{display: this.state.editFormVisible ? 'none' : 'block'}}>
              <h3>请点击左侧分类名称进行编辑</h3>
            </Col>
            <Col md={18} sm={24} style={{display: this.state.editFormVisible ? 'block' : 'none'}}>
              <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
                  {form.getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: "请输入名称！"
                      },
                    ],
                  })(<Input placeholder="名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
                  {form.getFieldDecorator('category_type', {
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
                <FormItem wrapperCol={{ span: 10, offset: 5 }} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    保存
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CategoryList;