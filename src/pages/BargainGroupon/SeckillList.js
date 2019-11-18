import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Badge, Drawer, Tooltip, Form, Button, Modal, Select, message } from 'antd';
import SimpleTable from '@/components/SimpleTable';
import SmallTable from '@/components/SmallTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

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
      title="新增秒杀"
      width={1000}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {allProductSpecIds ? (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品规格">
          {form.getFieldDecorator('product_spec', {
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
});

/* eslint react/no-multi-comp:0 */
@connect(({ seckill, loading }) => ({
  seckill,
  loading: loading.models.seckill,
}))
class SeckillList extends PureComponent {
  state = {
    currentPage: 1,
    visible: false,
    modalVisible: false,
    formValues: {},
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'seckill/fetch',
    });
  }

  showDrawer = (flag, currentRecord) => {
    this.setState({
      visible: !!flag,
    });

    if (flag && currentRecord) {
      this.setState({
        currentRecord: currentRecord,
      });

      this.props.dispatch({
        type: 'seckill/fetchLog',
        seckillID: currentRecord.id,
      });
    } else {
      this.setState({
        currentRecord: {},
      });
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'seckill/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

    if (flag) {
      this.props.dispatch({
        type: 'seckill/fetchProductSpecAllIds',
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      seckill_product: fields.product_spec,
    };

    dispatch({
      type: 'seckill/create',
      payload: payload,
    }).then(data => {
      message.success('新增成功');
      this.handleModalVisible();
      this.props.dispatch({
        type: 'seckill/fetch',
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
              新增秒杀
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      seckill: { data, logData, allProductSpecIds },
      loading,
    } = this.props;
    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '商品名称',
        dataIndex: 'seckill_product.product_spec.product.name',
        render(text) {
          if (text.length > 12) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 6) + '...' + text.substr(text.length - 6)}</span>
              </Tooltip>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '商品规格名称',
        dataIndex: 'seckill_product.product_spec.name',
      },
      {
        title: '用户',
        dataIndex: 'user.nickname',
      },
      {
        title: '几人秒',
        dataIndex: 'seckill_product.limit',
      },
      {
        title: '已秒',
        dataIndex: 'nums',
      },
      {
        title: '状态',
        dataIndex: 'dealed',
        render(text) {
          if (text) {
            return <Badge status="error" text="结束" />;
          } else {
            return <Badge status="success" text="进行中" />;
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'start_datetime',
      },
      {
        title: '结束时间',
        dataIndex: 'end_datetime',
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
            <a onClick={() => this.showDrawer(true, record)}>秒杀记录</a>
          </Fragment>
        ),
      },
    ];

    const drawerColumns = [
      {
        title: '用户',
        dataIndex: 'user.nickname',
        render(text, record) {
          if (text) {
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
    ];

    return (
      <PageHeaderWrapper title="秒杀列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1380 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Drawer
            width={800}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <p style={{ ...pStyle, marginBottom: 24 }}>秒杀记录</p>
            <Row>
              {logData && Object.keys(logData).length ? (
                <SmallTable size="small" data={logData} columns={drawerColumns} />
              ) : null}
            </Row>
          </Drawer>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          allProductSpecIds={allProductSpecIds}
        />
      </PageHeaderWrapper>
    );
  }
}

export default SeckillList;
