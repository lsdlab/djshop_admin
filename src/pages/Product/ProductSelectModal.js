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
  Icon,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ProductSelectModal extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'product/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'product/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'product/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('search')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const {
      product: { data },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          if (val === '1') {
            return <Badge status='success' text='上架' />;
          } else if (val === '2') {
            return <Badge status='error' text='下架' />;
          }
        },
      },
      {
        title: '上架用户',
        dataIndex: 'uploader',
      },
      {
        title: '分类',
        dataIndex: 'category_name',
      },
      {
        title: '销量',
        dataIndex: 'sold',
      },
      {
        title: '库存',
        dataIndex: 'total_stock',
      },
      {
        title: '起价',
        dataIndex: 'start_price',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a>选择</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="发票">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductSelectModal;
