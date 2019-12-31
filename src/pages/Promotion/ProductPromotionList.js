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
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
  Tooltip,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;

const buildOptions = optionData => {
  if (optionData) {
    const arr = [];
    for (let i = 0; i < optionData.length; i++) {
      arr.push(
        <Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>
          {optionData[i].combined_name}
        </Option>
      );
    }
    return arr;
  }
};

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
      title="新增促销商品"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="价格区间">
        <InputGroup compact>
          {form.getFieldDecorator('start_price', {
            rules: [{ required: true, message: '请输入起始价格！' }],
          })(
            <InputNumber
              min={0.01}
              step={0.01}
              style={{ width: 150, textAlign: 'center', marginTop: 5 }}
              placeholder="起始价格"
            />
          )}
          <Input
            style={{
              width: 30,
              borderLeft: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              marginTop: 5,
            }}
            placeholder="~"
            disabled
          />
          {form.getFieldDecorator('end_price', {
            rules: [{ required: true, message: '请输入结束价格！' }],
          })(
            <InputNumber
              min={0.01}
              step={0.01}
              style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }}
              placeholder="结束价格"
            />
          )}
        </InputGroup>
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="砍价比例">
        <InputGroup compact>
          {form.getFieldDecorator('promotion_percent_range_start', {
            rules: [{ required: true, message: '请输入砍价比例！' }],
          })(
            <InputNumber
              min={5}
              max={50}
              step={1}
              style={{ width: 150, textAlign: 'center', marginTop: 5 }}
              placeholder="砍价比例 5%"
            />
          )}
          <Input
            style={{
              width: 30,
              borderLeft: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              marginTop: 5,
            }}
            placeholder="~"
            disabled
          />
          {form.getFieldDecorator('promotion_percent_range_end', {
            rules: [{ required: true, message: '请输入砍价比例！' }],
          })(
            <InputNumber
              min={5}
              max={50}
              step={1}
              style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }}
              placeholder="砍价比例 50%"
            />
          )}
        </InputGroup>
      </FormItem>

      {allProductSpecIds ? (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
          {form.getFieldDecorator('product_spec', {
            rules: [{ required: true, message: '请选择商品规格！' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="商品规格"
              showSearch={true}
              optionFilterProp="name"
            >
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
        start_price: props.values.start_price,
        end_price: props.values.end_price,
        promotion_percent_range_start: props.values.promotion_percent_range.split('-')[0],
        promotion_percent_range_end: props.values.promotion_percent_range.split('-')[1],
        product_spec: props.values.product_spec.id,
      },
    };
  }

  render() {
    const {
      updateModalVisible,
      allProductSpecIds,
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
        title="编辑促销商品"
        width={1000}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="价格区间">
          <InputGroup compact>
            {form.getFieldDecorator('start_price', {
              initialValue: modalFormVals.start_price,
              rules: [{ required: true, message: '请输入起始价格！' }],
            })(
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: 150, textAlign: 'center', marginTop: 5 }}
                placeholder="起始价格"
              />
            )}
            <Input
              style={{
                width: 30,
                borderLeft: 0,
                pointerEvents: 'none',
                backgroundColor: '#fff',
                marginTop: 5,
              }}
              placeholder="~"
              disabled
            />
            {form.getFieldDecorator('end_price', {
              initialValue: modalFormVals.end_price,
              rules: [{ required: true, message: '请输入结束价格！' }],
            })(
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }}
                placeholder="结束价格"
              />
            )}
          </InputGroup>
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="砍价比例">
          <InputGroup compact>
            {form.getFieldDecorator('promotion_percent_range_start', {
              initialValue: modalFormVals.promotion_percent_range_start,
              rules: [{ required: true, message: '请输入砍价比例！' }],
            })(
              <InputNumber
                min={5}
                max={10}
                step={1}
                style={{ width: 150, textAlign: 'center', marginTop: 5 }}
                placeholder="砍价比例"
              />
            )}
            <Input
              style={{
                width: 30,
                borderLeft: 0,
                pointerEvents: 'none',
                backgroundColor: '#fff',
                marginTop: 5,
              }}
              placeholder="~"
              disabled
            />
            {form.getFieldDecorator('promotion_percent_range_end', {
              initialValue: modalFormVals.promotion_percent_range_end,
              rules: [{ required: true, message: '请输入砍价比例！' }],
            })(
              <InputNumber
                min={5}
                max={10}
                step={1}
                style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }}
                placeholder="砍价比例"
              />
            )}
          </InputGroup>
        </FormItem>

        {allProductSpecIds ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
            {form.getFieldDecorator('product_spec', {
              initialValue: modalFormVals.product_spec,
              rules: [{ required: true, message: '请选择商品规格！' }],
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="商品"
                showSearch={true}
                optionFilterProp="name"
              >
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
@connect(({ promotion_product, loading }) => ({
  promotion_product,
  loading: loading.models.promotion_product,
}))
@Form.create()
class PromotionsProductList extends PureComponent {
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
      type: 'promotion_product/fetch',
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
      type: 'promotion_product/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'promotion_product/fetchProductSpecAllIds',
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
        type: 'promotion_product/fetchProductSpecAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: fields.product_spec,
      start_price: fields.start_price,
      end_price: fields.end_price,
      promotion_percent_range:
        fields.promotion_percent_range_start + '-' + fields.promotion_percent_range_end,
    };

    dispatch({
      type: 'promotion_product/create',
      payload: payload,
    }).then(data => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'promotion_product/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: fields.product_spec,
      start_price: fields.start_price,
      end_price: fields.end_price,
      promotion_percent_range:
        fields.promotion_percent_range_start + '-' + fields.promotion_percent_range_end,
    };
    dispatch({
      type: 'promotion_product/patch',
      payload: payload,
      promotionProductSpecID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'promotion_product/fetch',
        payload: {},
      });
    });
  };

  promotionProductDeleted = (flag, promotionProductSpecID) => {
    const { dispatch } = this.props;
    if (flag && promotionProductSpecID) {
      dispatch({
        type: 'promotion_product/patch',
        payload: {
          deleted: true,
        },
        promotionProductSpecID: promotionProductSpecID,
      }).then(() => {
        message.success('下架促销商品成功！');
        dispatch({
          type: 'promotion_product/fetch',
        });
      });
    } else {
      dispatch({
        type: 'promotion_product/patch',
        payload: {
          deleted: false,
        },
        promotionProductSpecID: promotionProductSpecID,
      }).then(() => {
        message.success('上架促销商品成功！');
        dispatch({
          type: 'promotion_product/fetch',
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
              新增促销商品
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      promotion_product: { data, allProductSpecIds },
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
        title: '商品规格名称',
        dataIndex: 'product_spec.name',
      },
      {
        title: '促销类型',
        dataIndex: 'promotion_type_name',
      },
      {
        title: '状态',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status="error" text="下架中" />;
          } else {
            return <Badge status="success" text="上架中" />;
          }
        },
      },
      {
        title: '原价',
        dataIndex: 'original_sale_price',
      },
      {
        title: '团购/秒杀价格',
        dataIndex: 'promotion_price',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '团购人数',
        dataIndex: 'groupon_limit',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '促销库存',
        dataIndex: 'promotion_stock',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '砍价价格区间',
        dataIndex: 'bargain_start_price',
        render(text, record) {
          if (text) {
            return record.bargain_start_price + ' - ' + record.bargain_end_price;
          } else {
            return '-';
          }
        },
      },
      {
        title: '砍价砍价比例(%)',
        dataIndex: 'bargain_percent_range',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '销量',
        dataIndex: 'sold',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (_, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            {record.deleted ? (
              <Popconfirm
                title="是否要上架此促销商品？"
                onConfirm={() => this.promotionProductDeleted(false, record.id)}
              >
                <a>上架</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="是否要下架此推荐商品？"
                onConfirm={() => this.promotionProductDeleted(true, record.id)}
              >
                <a>下架</a>
              </Popconfirm>
            )}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="促销商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1480 }}
              current={this.state.currentPage}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          allProductSpecIds={allProductSpecIds}
        />

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

export default PromotionsProductList;
