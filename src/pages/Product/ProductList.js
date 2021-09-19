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
  Divider,
  Badge,
  Popconfirm,
  message,
  TreeSelect,
  Tooltip,
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

/* eslint react/no-multi-comp:0 */
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ProductList extends PureComponent {
  state = {
    currentPage: 1,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    }).then(() => {
      dispatch({
        type: 'product/fetchCategory',
      });
    });
  }

  routerPushDetail = productID => {
    router.push({ pathname: '/product/product-detail/' + productID});
  };

  handleDeleted = (flag, productID) => {
    const { dispatch } = this.props;
    if (flag && productID) {
      dispatch({
        type: 'product/patch',
        payload: {
          deleted: true,
          status: '2',
        },
        productID: productID,
      }).then(() => {
        message.success('下架商品成功');
        dispatch({
          type: 'product/fetch',
        });
      });
    } else {
      dispatch({
        type: 'product/patch',
        payload: {
          deleted: false,
          status: '1',
        },
        productID: productID,
      }).then(() => {
        message.success('上架商品成功');
        dispatch({
          type: 'product/fetch',
        });
      });
    }
  };

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
      type: 'product/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      currentPage: 1,
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
      product: { categoryData },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={18}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="名称/副标题" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            {categoryData.results ? (
              <FormItem label="分类">
                {getFieldDecorator('category')(
                  <TreeSelect
                    style={{ width: '100%' }}
                    treeData={categoryData.results}
                    placeholder="请选择"
                    treeDefaultExpandAll={true}
                    showSearch={true}
                  />
                )}
              </FormItem>
            ) : null}
          </Col>
          <Col md={6} sm={18}>
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

  buildCarousel(srcList) {
    if (srcList) {
      const arr = [];
      for (let i = 0; i < srcList.length; i++) {
        arr.push(<img key={i} style={{ width: '20%', height: '20%' }} src={srcList[i]} />);
      }
      return arr;
    } else {
      return <div />;
    }
  }

  buildSpecs(specData) {
    if (specData) {
      const arr = [];
      for (let i = 0; i < specData.length; i++) {
        arr.push(
          <Card
            style={{ marginBottom: 20 }}
            bodyStyle={{ padding: '20px 24px 8px 24px' }}
            key={i}
            type="inner"
            title={specData[i].name}
          >
            <Row>
              <Col span={24}>
                <DescriptionItem title="ID" content={specData[i].id} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <DescriptionItem title="售价" content={specData[i].price} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="市场价" content={specData[i].market_price} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="成本价" content={specData[i].cost_price} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="库存" content={specData[i].stock} />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <DescriptionItem title="货号" content={specData[i].sn} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="题图" />
                {specData[i].header_image ? (
                  <img style={{ width: '20%', height: '20%' }} src={specData[i].header_image} />
                ) : null}
              </Col>
            </Row>
          </Card>
        );
      }
      return arr;
    } else {
      return <div />;
    }
  }

  render() {
    const {
      product: { data, currentRecord, specData },
      loading,
    } = this.props;

    const columns = [
      {
        title: '名称',
        width: '120px',
        dataIndex: 'name',
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
        title: '上架用户',
        width: '100px',
        dataIndex: 'uploader',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          if (val === '1') {
            return <Badge status="success" text="上架" />;
          } else if (val === '2') {
            return <Badge status="error" text="下架" />;
          }
        },
      },
      {
        title: '分类',
        dataIndex: 'category_name',
        render(_, record) {
          return (
            <span>
              {record.category_first_name} {record.category_name}
            </span>
          );
        },
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
        title: '限购',
        dataIndex: 'limit',
      },
      {
        title: '浏览',
        dataIndex: 'pv',
      },
      {
        title: '收藏',
        dataIndex: 'fav',
      },
      {
        title: '评论',
        dataIndex: 'review',
      },
      {
        title: '上架时间',
        width: '200px',
        dataIndex: 'created_at',
      },
      // {
      //   title: '更新时间',
      //   width: '200px',
      //   dataIndex: 'updated_at',
      // },
      {
        title: '操作',
        fixed: 'right',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.routerPushDetail(record.id)}>详情</a>
            <Divider type="vertical" />
            {record.status === '1' ? (
              <Popconfirm
                title="是否要下架此商品？"
                onConfirm={() => this.handleDeleted(true, record.id)}
              >
                <a>下架</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="是否要上架此商品？"
                onConfirm={() => this.handleDeleted(false, record.id)}
              >
                <a>上架</a>
              </Popconfirm>
            )}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1520 }}
              current={this.state.currentPage}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductList;
