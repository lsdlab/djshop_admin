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
  Button,
  Divider,
  Badge,
  Drawer,
  Checkbox,
} from 'antd';
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
    <Checkbox disabled checked={status}></Checkbox>
  </div>
);

const ImgItem = ({ title, src }) => (
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
    <img style={{ width: '20%', height: '20%' }} src={src} />
  </div>
);

const ImgListItem = ({ title, src }) => (
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
    <img style={{ width: '20%', height: '20%' }} src={src} />
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
    pageSize: 10,
    formValues: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    });
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
        currentRecord: {}
      })
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
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

  buildCarousel(srcList) {
    if (srcList) {
      const arr = [];
      for (let i = 0; i < srcList.length; i++) {
        arr.push(<img style={{ width: '20%', height: '20%' }} src={srcList[i]} />)
      }
      return arr;
    } else {
      return <div></div>
    }
  }

  render() {
    const {
      product: { data, currentRecord },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      // {
      //   title: '副标题',
      //   dataIndex: 'subtitle',
      // },
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
      // {
      //   title: '评论数量',
      //   dataIndex: 'review',
      // },
      // {
      //   title: '收藏数量',
      //   dataIndex: 'fav',
      // },
      // {
      //   title: '浏览量',
      //   dataIndex: 'pv',
      // },
      // {
      //   title: '限购数量',
      //   dataIndex: 'limit',
      // },
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
            <a>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.showDrawer(true, record.id)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.showDrawer(true, record)}>规格详情</a>
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
                { currentRecord.status === '1' ? (
                  <BadgeItem title="状态" status='success' content="上架" />
                ) : <BadgeItem title="状态" status='error' content='下架' />}
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
                <DescriptionItem title="总库存" content={currentRecord.total_stock} />
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
                <CheckboxItem title="开发票" status={currentRecord.has_invoice} />
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
                <img style={{ width: '20%', height: '20%' }} src={currentRecord.header_image} />
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductList;
