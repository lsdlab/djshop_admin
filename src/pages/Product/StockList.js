import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Drawer,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const FormItem = Form.Item;
const { TextArea } = Input;


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
      title="新增库存商品"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称！' }],
        })(<Input placeholder="名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: false, message: '请输入描述！'}],
        })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder="描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量" >
        {form.getFieldDecorator('nums', {
          rules: [{ required: true, message: '请输入数量！'}],
        })(<InputNumber style={{ width: '100%', textAlign: 'center', marginTop: 5 }} placeholder="数量" />)}
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
        desc: props.values.desc,
        nums: props.values.nums,
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
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="编辑库存商品"
        width={1000}
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('desc', {
            initialValue: modalFormVals.desc,
            rules: [{ required: false, message: '请输入描述！'}],
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder="描述" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量" >
          {form.getFieldDecorator('nums', {
            initialValue: modalFormVals.nums,
            rules: [{ required: true, message: '请输入数量！'}],
          })(<InputNumber style={{ width: '100%', textAlign: 'center', marginTop: 5 }} placeholder="数量" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ stock, loading }) => ({
  stock,
  loading: loading.models.stock,
}))
@Form.create()
class StockList extends PureComponent {
  state = {
    currentPage: 1,
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    drawerVisible: false,
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stock/fetch',
    });
  }

  handleStandardTableChange = (pagination) => {
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
      type: 'stock/fetch',
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
      currentRecord: record || {},
    });
  };

  showDrawer = (flag, currentRecord) => {
    this.setState({
      drawerVisible: !!flag,
    });

    if (flag && currentRecord) {
      this.setState({
        currentRecord: currentRecord,
      });

      this.props.dispatch({
        type: 'stock/fetchLog',
        stockID: currentRecord.id,
      });
    } else {
      this.setState({
        currentRecord: {},
      });
    }
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const params = {
      name: fields.name,
      desc: fields.desc,
      nums: fields.nums,
    };
    dispatch({
      type: 'stock/create',
      payload: params,
    }).then(() => {
      message.success('新增库存商品成功');
      this.handleModalVisible();
      dispatch({
        type: 'stock/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'stock/patch',
      payload: fields,
      stockID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新库存商品成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'stock/fetch',
        payload: {},
      });
    });
  };

  handleDeleted = (flag, stockID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'stock/delete',
      stockID: stockID,
    }).then(() => {
      if (flag) {
        message.success('删除库存商品成功');
      } else {
        message.success('恢复库存商品成功')
      }
      dispatch({
        type: 'stock/fetch',
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
              新增库存商品
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      stock: { data, logData },
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
        title: '备注',
        dataIndex: 'desc',
        render(text) {
          if (text.length > 8) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 4) + '...' + text.substr(text.length - 4)}</span>
              </Tooltip>);
          } else {
            return text;
          }
        },
      },
      {
        title: '数量',
        dataIndex: 'nums',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此库存商品？" onConfirm={() => this.handleDeleted(true, record.id)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.showDrawer(true, record)}>进货记录</a>
          </Fragment>
        ),
      },
    ];

    const drawerColumns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'note',
        render(text) {
          if (text.length > 8) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 4) + '...' + text.substr(text.length - 4)}</span>
              </Tooltip>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '数量',
        dataIndex: 'nums',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
    ];

    return (
      <PageHeaderWrapper title="库存商品列表">
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
          <Drawer
            width={800}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.drawerVisible}
          >
            <p style={{ ...pStyle, marginBottom: 24 }}>进货记录</p>
            <Row>
              {logData && Object.keys(logData).length ? (
                <SimpleTable data={logData} columns={drawerColumns} pagination={false} size={'small'} />
              ) : null}
            </Row>
          </Drawer>
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

export default StockList;
