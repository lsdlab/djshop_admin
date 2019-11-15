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
  Drawer,
  Checkbox,
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

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

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

const BadgeItem = ({ title, status, content }) => (
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
    <Badge status={status} text={content} />
  </div>
);

const CheckboxItem = ({ title, status }) => (
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
    <Checkbox disabled checked={status} />
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
    visible: false,
    specDrawerVisible: false,
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
    router.push('/product/product-detail/' + productID);
  };

  showDrawer = (flag, productID) => {
    this.setState({
      visible: !!flag,
    });

    if (flag && productID) {
      this.props.dispatch({
        type: 'product/fetchDetail',
        productID: productID,
      });
    } else {
      this.setState({
        currentRecord: {},
      });
    }
  };

  showSpecDrawer = (flag, productID) => {
    this.setState({
      specDrawerVisible: !!flag,
    });

    if (flag && productID) {
      this.props.dispatch({
        type: 'product/fetchProductSpecs',
        productID: productID,
      });
    } else {
      this.setState({
        specData: {},
      });
    }
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
        message.success('下架商品成功！');
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
        message.success('上架商品成功！');
        dispatch({
          type: 'product/fetch',
        });
      });
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onSpecDrawerClose = () => {
    this.setState({
      specDrawerVisible: false,
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
            {categoryData ? (
              <FormItem label="分类">
                {getFieldDecorator('category')(
                  <TreeSelect
                    style={{ width: '100%' }}
                    treeData={categoryData}
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
        dataIndex: 'name',
        render(text, record) {
          if (text.length > 16) {
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
        render(text, record) {
          return (
            <span>
              {record.category_first_name} / {record.category_name}
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
        title: '浏览',
        dataIndex: 'pv',
      },
      {
        title: '收藏',
        dataIndex: 'fav',
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
            <a onClick={() => this.routerPushDetail(record.id)}>详情</a>
            <Divider type="vertical" />
            {/*<a onClick={() => this.showDrawer(true, record.id)}>商品详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.showSpecDrawer(true, record.id)}>商品规格</a>
            <Divider type="vertical" />*/}
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
              scroll={{ x: 1300 }}
              current={this.state.currentPage}
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
            <p style={pStyle}>商品详情</p>
            <Row>
              <Col span={24}>
                <DescriptionItem title="ID" content={currentRecord.id} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="名称" content={currentRecord.name} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="副标题" content={currentRecord.subtitle} />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <DescriptionItem title="上架用户" content={currentRecord.uploader} />
              </Col>
              <Col span={8}>
                {currentRecord.status === '1' ? (
                  <BadgeItem title="状态" status="success" content="上架" />
                ) : (
                  <BadgeItem title="状态" status="error" content="下架" />
                )}
              </Col>
              <Col span={8}>
                <DescriptionItem title="分类" content={currentRecord.category_name} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <DescriptionItem title="单位" content={currentRecord.unit} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="重量" content={currentRecord.weight} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="限购" content={currentRecord.limit} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="库存" content={currentRecord.total_stock} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <DescriptionItem title="销量" content={currentRecord.sold} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="浏览量" content={currentRecord.pv} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="收藏量" content={currentRecord.fav} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="评论量" content={currentRecord.review} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <CheckboxItem title="可开发票" status={currentRecord.has_invoice} />
              </Col>
              <Col span={6}>
                <CheckboxItem title="免运费" content={currentRecord.shop_free} />
              </Col>
              <Col span={6}>
                <CheckboxItem title="可退货" content={currentRecord.refund} />
              </Col>
              <Col span={6}>
                <CheckboxItem title="新品" content={currentRecord.is_new} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="题图" />
                {currentRecord.header_image ? (
                  <img style={{ width: '20%', height: '20%' }} src={currentRecord.header_image} />
                ) : null}
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={24}>
                <DescriptionItem title="轮播图" />
                {this.buildCarousel(currentRecord.carousel)}
              </Col>
            </Row>
            <Divider />
          </Drawer>
          <Drawer
            width={800}
            placement="right"
            closable={true}
            onClose={this.onSpecDrawerClose}
            visible={this.state.specDrawerVisible}
          >
            <p style={pStyle}>规格详情</p>
            {this.buildSpecs(specData)}
            <Divider />
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductList;
