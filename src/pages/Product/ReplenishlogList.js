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
  Select,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const buildOptions = optionData => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(
        <Option name={optionData[i].name} value={optionData[i].id} key={optionData[i].id}>
          ID: {optionData[i].id} 名称：{optionData[i].name} 当前库存数：{optionData[i].nums}
        </Option>
      );
    }
    return arr;
  }
};

const CreateForm = Form.create()(props => {
  const { modalVisible, allStockIds, form, handleAdd, handleModalVisible } = props;

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
      title="新增进货日志"
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('note', {
          rules: [{ required: true, message: '请输入备注！' }],
        })(<TextArea autoSize={{ minRows: 4, maxRows: 8 }} placeholder="备注" />)}
      </FormItem>

      {allStockIds ? (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="库存商品">
          {form.getFieldDecorator('stock', {
            rules: [{ required: true, message: '请选择库存商品！' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="库存商品"
              showSearch={true}
              optionFilterProp="name"
            >
              {buildOptions(allStockIds)}
            </Select>
          )}
        </FormItem>
      ) : null}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量">
        {form.getFieldDecorator('nums', {
          rules: [{ required: true, message: '请输入数量！' }],
        })(
          <InputNumber
            style={{ width: '100%', textAlign: 'center', marginTop: 5 }}
            placeholder="数量"
          />
        )}
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
        note: props.values.note,
        stock: props.values.stock,
        nums: props.values.nums,
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
      allStockIds,
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
        title="编辑进货日志"
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('note', {
            initialValue: modalFormVals.note,
            rules: [{ required: true, message: '请输入备注！' }],
          })(<TextArea autoSize={{ minRows: 4, maxRows: 8 }} placeholder="备注" />)}
        </FormItem>

        {allStockIds ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="库存商品">
            {form.getFieldDecorator('stock', {
              initialValue: modalFormVals.stock.id,
              rules: [{ required: true, message: '请选择库存商品！' }],
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="库存商品"
                showSearch={true}
                optionFilterProp="name"
              >
                {buildOptions(allStockIds)}
              </Select>
            )}
          </FormItem>
        ) : null}

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量">
          {form.getFieldDecorator('nums', {
            initialValue: modalFormVals.nums,
            rules: [{ required: true, message: '请输入数量！' }],
          })(
            <InputNumber
              style={{ width: '100%', textAlign: 'center', marginTop: 5 }}
              placeholder="数量"
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ replenishlog, loading }) => ({
  replenishlog,
  loading: loading.models.replenishlog,
}))
@Form.create()
class ReplenishlogList extends PureComponent {
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
      type: 'replenishlog/fetch',
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
      type: 'replenishlog/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'replenishlog/fetchStockAllIds',
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
        type: 'replenishlog/fetchStockAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const params = {
      name: fields.name,
      note: fields.note,
      stock: fields.stock,
      nums: fields.nums,
    };
    dispatch({
      type: 'replenishlog/create',
      payload: params,
    }).then(() => {
      message.success('新增进货日志成功');
      this.handleModalVisible();
      dispatch({
        type: 'replenishlog/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'replenishlog/patch',
      payload: fields,
      replenishlogID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新进货日志成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'replenishlog/fetch',
        payload: {},
      });
    });
  };

  handleDeleted = (flag, replenishlogID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'replenishlog/delete',
      replenishlogID: replenishlogID,
    }).then(() => {
      if (flag) {
        message.success('删除进货日志成功');
      } else {
        message.success('恢复进货日志成功');
      }
      dispatch({
        type: 'replenishlog/fetch',
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
              新增进货日志
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      replenishlog: { data, allStockIds },
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
        title: '库存商品',
        dataIndex: 'stock.name',
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
        render: record => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除此进货日志？"
              onConfirm={() => this.handleDeleted(true, record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="进货日志">
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

        <CreateForm {...parentMethods} modalVisible={modalVisible} allStockIds={allStockIds} />

        {currentRecord && Object.keys(currentRecord).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={currentRecord}
            allStockIds={allStockIds}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default ReplenishlogList;
