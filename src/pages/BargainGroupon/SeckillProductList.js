import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  InputNumber,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
  Tooltip,
  TreeSelect,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';


const FormItem = Form.Item;


const CreateForm = Form.create()(props => {
  const { modalVisible, allProductSpecIds, form, handleAdd, handleModalVisible } = props;
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
      title="新增秒杀商品"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="秒杀价格" >
        {form.getFieldDecorator('seckill_price', {
          rules: [{ required: true, message: "请输入结束价格！" }],
        })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="秒杀价格" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="几人秒">
        {form.getFieldDecorator('limit', {
          rules: [{ required: true, message: "请输入结束几人秒！" }],
        })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="几人秒"/>)}
      </FormItem>

      { allProductSpecIds ? (
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
          {form.getFieldDecorator('product_spec', {
            rules: [{ required: true, message: '请选择商品规格！' }],
          })(
            <TreeSelect
              style={{ width: '100%' }}
              treeData={allProductSpecIds}
              placeholder="商品规格"
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
        seckill_price: props.values.seckill_price,
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
        title="编辑秒杀商品"
        width={1000}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="秒杀价格" >
          {form.getFieldDecorator('seckill_price', {
            initialValue: modalFormVals.seckill_price,
            rules: [{ required: true, message: "请输入结束价格！" }],
          })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="秒杀价格" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="几人秒">
          {form.getFieldDecorator('limit', {
            initialValue: modalFormVals.limit,
            rules: [{ required: true, message: "请输入结束几人秒！" }],
          })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="几人秒"/>)}
        </FormItem>

        { allProductSpecIds ? (
          <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
            {form.getFieldDecorator('product_spec', {
              initialValue: modalFormVals.product_spec,
              rules: [{ required: true, message: '请选择商品规格！' }],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                treeData={allProductSpecIds}
                placeholder="商品规格"
                treeDefaultExpandAll={true}
                showSearch={true}
              />
            )}
          </Form.Item>
        ) : null}
      </Modal>
    );
  }
}


/* eslint react/no-multi-comp:0 */
@connect(({ seckill_product, loading }) => ({
  seckill_product,
  loading: loading.models.seckill_product,
}))
@Form.create()
class SeckillProductList extends PureComponent {
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
      type: 'seckill_product/fetch',
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
      type: 'seckill_product/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'seckill_product/fetchProductSpecAllIds',
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
        type: 'seckill_product/fetchProductSpecAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: fields.product_spec,
      seckill_price: fields.seckill_price,
      limit: fields.limit,
    };

    dispatch({
      type: 'seckill_product/create',
      payload: payload,
    }).then((data) => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'seckill_product/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'seckill_product/patch',
      payload: fields,
      seckillProductSpecID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'seckill_product/fetch',
        payload: {},
      });
    });
  };

  seckillProductDeleted = (flag, seckillProductSpecID) => {
    const { dispatch } = this.props;
    if (flag && seckillProductSpecID) {
      dispatch({
        type: 'seckill_product/patch',
        payload: {
          deleted: true,
        },
        seckillProductSpecID: seckillProductSpecID,
      }).then(() => {
        message.success('下架秒杀商品成功！');
        dispatch({
          type: 'seckill_product/fetch',
        });
      });
    } else {
      dispatch({
        type: 'seckill_product/patch',
        payload: {
          deleted: false,
        },
        seckillProductSpecID: seckillProductSpecID,
      }).then(() => {
        message.success('上架秒杀商品成功！');
        dispatch({
          type: 'seckill_product/fetch',
        });
      });
    }
  };

  renderSimpleForm() {
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新增秒杀商品
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      seckill_product: { data, allProductSpecIds },
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
        title: '商品名称',
        dataIndex: 'product_spec.product.name',
        render(text, record) {
          if (text.length > 12) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 6) + '...' + text.substr(text.length - 6)}</span>
              </Tooltip>);
          } else {
            return text;
          }
        },
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
        title: '秒杀价格',
        dataIndex: 'seckill_price',
      },
      {
        title: '几人秒',
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
        title: '更新时间',
        dataIndex: 'updated_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            { record.deleted ? (
              <Popconfirm title="是否要上架此秒杀商品？" onConfirm={() => this.seckillProductDeleted(false, record.id)}>
                <a>上架</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要下架此推荐商品？" onConfirm={() => this.seckillProductDeleted(true, record.id)}>
                <a>下架</a>
              </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="秒杀商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1260 }}
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

export default SeckillProductList;
