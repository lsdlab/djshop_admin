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
  TreeSelect,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;

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

  const buildOptions = (optionData) => {
    if (optionData) {
      const arr = [];
      for (let i = 0; i < optionData.length; i++) {
        arr.push(<Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>{optionData[i].combined_name}</Option>)
      }
      return arr;
    }
  }

  return (
    <Modal
      destroyOnClose
      centered
      keyboard
      title="新增砍价商品"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="价格区间" >
        <InputGroup compact>
          {form.getFieldDecorator('start_price', {
            rules: [{ required: true, message: "请输入起始价格！" }],
          })(<InputNumber min={0.01} step={0.01} style={{ width: 150, textAlign: 'center', marginTop: 5 }} placeholder="起始价格" />)}
          <Input
            style={{
              width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', marginTop: 5,
            }}
            placeholder="~"
            disabled
          />
          {form.getFieldDecorator('end_price', {
            rules: [{ required: true, message: "请输入结束价格！" }],
          })(<InputNumber min={0.01} step={0.01} style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }} placeholder="结束价格" />)}
        </InputGroup>
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="砍价比例" >
        <InputGroup compact>
          {form.getFieldDecorator('bargain_percent_range_start', {
            rules: [{ required: true, message: "请输入砍价比例！" }],
          })(<InputNumber min={5} max={10} step={1} style={{ width: 150, textAlign: 'center', marginTop: 5 }} placeholder="砍价比例" />)}
          <Input
            style={{
              width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', marginTop: 5,
            }}
            placeholder="~"
            disabled
          />
          {form.getFieldDecorator('bargain_percent_range_end', {
            rules: [{ required: true, message: "请输入砍价比例！" }],
          })(<InputNumber min={5} max={10} step={1} style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }} placeholder="砍价比例" />)}
        </InputGroup>
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量">
        {form.getFieldDecorator('nums', {
          rules: [{ required: true, message: "请输入结束数量！" }],
        })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="数量"/>)}
      </FormItem>

      { allProductSpecIds ? (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
          {form.getFieldDecorator('product_spec', {
              rules: [{ required: true, message: '请选择商品规格！' }],
            })(
              <Select style={{ width: '100%' }} placeholder="商品规格" showSearch={true} optionFilterProp="name">
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
        bargain_percent_range_start: props.values.bargain_percent_range.split('-')[0],
        bargain_percent_range_end: props.values.bargain_percent_range.split('-')[1],
        nums: props.values.nums,
        product_spec: props.values.product_spec.product.category_first_name + '-' + props.values.product_spec.product.category_name + '-' + props.values.product_spec.name + '-' + props.values.product_spec.product.name,
      },
    };
  }

  render() {
    const { updateModalVisible, allProductSpecIds, form, handleUpdate, handleUpdateModalVisible } = this.props;
    const { modalFormVals } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };

    const buildOptions = (optionData) => {
      if (optionData) {
        const arr = [];
        for (let i = 0; i < optionData.length; i++) {
          arr.push(<Option name={optionData[i].combined_name} value={optionData[i].id} key={optionData[i].id}>{optionData[i].combined_name}</Option>)
        }
        return arr;
      }
    }

    return (
      <Modal
        destroyOnClose
        centered
        keyboard
        title="编辑"
        width={1000}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="价格区间" >
          <InputGroup compact>
            {form.getFieldDecorator('start_price', {
              initialValue: modalFormVals.start_price,
              rules: [{ required: true, message: "请输入起始价格！" }],
            })(<InputNumber min={0.01} step={0.01} style={{ width: 150, textAlign: 'center', marginTop: 5 }} placeholder="起始价格" />)}
            <Input
              style={{
                width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', marginTop: 5,
              }}
              placeholder="~"
              disabled
            />
            {form.getFieldDecorator('end_price', {
              initialValue: modalFormVals.end_price,
              rules: [{ required: true, message: "请输入结束价格！" }],
            })(<InputNumber min={0.01} step={0.01} style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }} placeholder="结束价格" />)}
          </InputGroup>
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="砍价比例" >
          <InputGroup compact>
            {form.getFieldDecorator('bargain_percent_range_start', {
              initialValue: modalFormVals.bargain_percent_range_start,
              rules: [{ required: true, message: "请输入砍价比例！" }],
            })(<InputNumber min={5} max={10} step={1} style={{ width: 150, textAlign: 'center', marginTop: 5 }} placeholder="砍价比例" />)}
            <Input
              style={{
                width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', marginTop: 5,
              }}
              placeholder="~"
              disabled
            />
            {form.getFieldDecorator('bargain_percent_range_end', {
              initialValue: modalFormVals.bargain_percent_range_end,
              rules: [{ required: true, message: "请输入砍价比例！" }],
            })(<InputNumber min={5} max={10} step={1} style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }} placeholder="砍价比例" />)}
          </InputGroup>
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量">
          {form.getFieldDecorator('nums', {
            initialValue: modalFormVals.nums,
            rules: [{ required: true, message: "请输入结束数量！" }],
          })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="数量"/>)}
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
@connect(({ bargain_product, loading }) => ({
  bargain_product,
  loading: loading.models.bargain_product,
}))
@Form.create()
class BargainProductList extends PureComponent {
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
      type: 'bargain_product/fetch',
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
      type: 'bargain_product/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'bargain_product/fetchProductSpecAllIds',
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
        type: 'bargain_product/fetchProductSpecAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: fields.product_spec,
      start_price: fields.start_price,
      end_price: fields.end_price,
      bargain_percent_range: fields.bargain_percent_range_start + '-' + fields.bargain_percent_range_end,
      nums: fields.nums,
    };
    console.log(payload);

    dispatch({
      type: 'bargain_product/create',
      payload: payload,
    }).then((data) => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'bargain_product/fetch',
        payload: {},
      });
    });
  };

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bargain_product/patch',
      payload: fields,
      bargainProductID: this.state.currentRecord.id,
    }).then(() => {
      message.success('更新成功');
      this.handleUpdateModalVisible();
      dispatch({
        type: 'bargain_product/fetch',
        payload: {},
      });
    });
  };

  bargainProductDeleted = (flag, bargainProductSpecID) => {
    const { dispatch } = this.props;
    if (flag && bargainProductSpecID) {
      dispatch({
        type: 'bargain_product/patch',
        payload: {
          deleted: true,
        },
        bargainProductSpecID: bargainProductSpecID,
      }).then(() => {
        message.success('下架砍价商品成功！');
        dispatch({
          type: 'bargain_product/fetch',
        });
      });
    } else {
      dispatch({
        type: 'bargain_product/patch',
        payload: {
          deleted: false,
        },
        bargainProductSpecID: bargainProductSpecID,
      }).then(() => {
        message.success('上架砍价商品成功！');
        dispatch({
          type: 'bargain_product/fetch',
        });
      });
    }
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
              新增砍价商品
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      bargain_product: { data, allProductSpecIds },
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
        title: '商品名称',
        dataIndex: 'product_spec.product.name',
      },
      {
        title: '商品规格名称',
        dataIndex: 'product_spec.name',
      },
      {
        title: '起始价格',
        dataIndex: 'start_price',
      },
      {
        title: '结束价格',
        dataIndex: 'end_price',
      },
      {
        title: '砍价比例(%)',
        dataIndex: 'bargain_percent_range',
      },
      {
        title: '数量',
        dataIndex: 'nums',
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
              <Popconfirm title="是否要上架此砍价商品？" onConfirm={() => this.bargainProductDeleted(false, record.id)}>
                <a>上架</a>
              </Popconfirm>
            ) : <Popconfirm title="是否要下架此推荐商品？" onConfirm={() => this.bargainProductDeleted(true, record.id)}>
                <a>下架</a>
              </Popconfirm>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="砍价商品列表">
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

export default BargainProductList;
