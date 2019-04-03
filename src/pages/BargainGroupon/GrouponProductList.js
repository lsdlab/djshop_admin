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
  Divider,
  Popconfirm,
  Badge,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
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
  const { modalVisible, allProductSpecIds, form, handleAdd, handleModalVisible, } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // TODO 验证范围正确性
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      centered
      keyboard
      title="新增团购商品"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="团购价格" >
        {form.getFieldDecorator('groupon_price', {
          rules: [{ required: true, message: "请输入结束价格！" }],
        })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="团购价格" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="几人团">
        {form.getFieldDecorator('limit', {
          rules: [{ required: true, message: "请输入结束几人团！" }],
        })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="几人团"/>)}
      </FormItem>

      { allProductSpecIds ? (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
          {form.getFieldDecorator('product_spec', {
              rules: [{ required: true, message: '请选择商品规格！' }],
            })(
              <Select style={{ width: '100%' }} placeholder="商品" showSearch={true} optionFilterProp="name">
                {buildOptions(allProductSpecIds)}
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
        groupon_price: props.values.groupon_price,
        limit: props.values.limit,
        product_spec: props.values.product_spec.id,
      },
    };
  }

  render() {
    const { updateModalVisible, allProductSpecIds, form, handleUpdate, handleUpdateModalVisible } = this.props;
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
        title="编辑团购商品"
        width={1000}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="团购价格" >
          {form.getFieldDecorator('groupon_price', {
            initialValue: modalFormVals.groupon_price,
            rules: [{ required: true, message: "请输入结束价格！" }],
          })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="团购价格" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="几人团">
          {form.getFieldDecorator('limit', {
            initialValue: modalFormVals.limit,
            rules: [{ required: true, message: "请输入结束几人团！" }],
          })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="几人团"/>)}
        </FormItem>

        { allProductSpecIds ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
            {form.getFieldDecorator('product_spec', {
                initialValue: modalFormVals.product_spec,
                rules: [{ required: true, message: '请选择商品规格！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="商品" showSearch={true} optionFilterProp="name">
                  {buildOptions(allProductSpecIds)}
                </Select>
              )}
          </FormItem>
        ) : null}
      </Modal>
    );
  }
}


/* eslint react/no-multi-comp:0 */
@connect(({ groupon_product, loading }) => ({
  groupon_product,
  loading: loading.models.groupon_product,
}))
@Form.create()
class GrouponProductList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 20,
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupon_product/fetch',
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

    dispatch({
      type: 'groupon_product/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'groupon_product/fetchProductSpecAllIds',
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
        type: 'groupon_product/fetchProductSpecAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: fields.product_spec,
      groupon_price: fields.groupon_price,
      limit: fields.limit,
    };
    console.log(payload);

    dispatch({
      type: 'groupon_product/create',
      payload: payload,
    }).then((data) => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'groupon_product/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupon_product/patch',
      payload: fields,
      grouponProductID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'groupon_product/fetch',
        payload: {},
      });
    });
  };

  grouponProductDeleted = (flag, grouponProductID) => {
    const { dispatch } = this.props;
    if (flag && grouponProductID) {
      dispatch({
        type: 'groupon_product/patch',
        payload: {
          deleted: true,
        },
        grouponProductID: grouponProductID,
      }).then(() => {
        message.success('下架团购商品成功！');
        dispatch({
          type: 'groupon_product/fetch',
        });
      });
    } else {
      dispatch({
        type: 'groupon_product/patch',
        payload: {
          deleted: false,
        },
        grouponProductID: grouponProductID,
      }).then(() => {
        message.success('上架团购商品成功！');
        dispatch({
          type: 'groupon_product/fetch',
        });
      });
    }
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
              新增团购商品
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      groupon_product: { data, allProductSpecIds },
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
        title: '商品名称',
        dataIndex: 'product_spec.product.name',
      },
      {
        title: '商品规格名称',
        dataIndex: 'product_spec.name',
      },
      {
        title: '销售价格',
        dataIndex: 'sale_price',
      },
      {
        title: '团购价格',
        dataIndex: 'groupon_price',
      },
      {
        title: '几人团',
        dataIndex: 'limit',
      },
      {
        title: '销量',
        dataIndex: 'sold',
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
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            { record.deleted ? (
              <Popconfirm title="是否要上架此团购商品？" onConfirm={() => this.grouponProductDeleted(false, record.id)}>
                <a>上架</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要下架此推荐商品？" onConfirm={() => this.grouponProductDeleted(true, record.id)}>
                <a>下架</a>
              </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="团购商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1200 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} allProductSpecIds={allProductSpecIds} />

        {currentRecord && Object.keys(currentRecord).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={currentRecord}
            allProductSpecIds={allProductSpecIds}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default GrouponProductList;
