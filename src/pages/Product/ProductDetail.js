import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Icon,
  Button,
  Modal,
  message,
  Dropdown,
  Menu,
  Badge,
  Checkbox,
} from 'antd';
import router from 'umi/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../Profile/AdvancedProfile.less';
import defaultSettings from '../../defaultSettings';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;


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

const operationTabList = [
  {
    key: 'tab1',
    tab: '商品详情',
  },
  {
    key: 'tab2',
    tab: '商品规格详情',
  },
  {
    key: 'tab3',
    tab: '商品详情(移动端渲染效果)',
  },
];


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, productSpecId } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // TODO 验证范围正确性
      form.resetFields();
      handleAdd(fieldsValue, productSpecId);
    });
  };

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
          })(<InputNumber min={5} max={50} step={1} style={{ width: 150, textAlign: 'center', marginTop: 5 }} placeholder="砍价比例 5%" />)}
          <Input
            style={{
              width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', marginTop: 5,
            }}
            placeholder="~"
            disabled
          />
          {form.getFieldDecorator('bargain_percent_range_end', {
            rules: [{ required: true, message: "请输入砍价比例！" }],
          })(<InputNumber min={5} max={50} step={1} style={{ width: 150, textAlign: 'center', borderLeft: 0, marginTop: 5 }} placeholder="砍价比例 50%" />)}
        </InputGroup>
      </FormItem>
    </Modal>
  );
});

const CreateFormGroupon = Form.create()(props => {
  const { modalVisibleGroupon, form, handleAddGroupon, handleModalVisibleGroupon, productSpecId } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // TODO 验证范围正确性
      form.resetFields();
      handleAddGroupon(fieldsValue, productSpecId);
    });
  };

  return (
    <Modal
      destroyOnClose
      centered
      keyboard
      title="新增团购商品"
      width={1000}
      visible={modalVisibleGroupon}
      onOk={okHandle}
      onCancel={() => handleModalVisibleGroupon()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="团购价格" >
        {form.getFieldDecorator('groupon_price', {
          rules: [{ required: true, message: "请输入结束价格！" }],
        })(<InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="团购价格" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="几人团">
        {form.getFieldDecorator('limit', {
          rules: [{ required: true, message: "请输入几人团！" }],
        })(<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="几人团"/>)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ product }) => ({
  product,
}))
class ProductDetail extends PureComponent {
  state = {
    operationkey: 'tab1',
    modalVisible: false,
    modalVisibleGroupon: false,
  };

  componentDidMount() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    const productID = pathList[3];

    this.props.dispatch({
      type: 'product/fetchDetail',
      productID: productID,
    }).then(() => {
      this.props.dispatch({
        type: 'product/fetchProductSpecs',
        productID: productID,
      });
    });
  };

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  routerPushEdit = (productID) => {
    router.push('/product/product-edit/' + productID);
  }

  routerPushSpecCreate = (productID) => {
    router.push({pathname: '/product/product-spec-create/' + productID, state: {"productID": productID }});
  }

  routerProductDetailNewTab = (productID) => {
    window.open(defaultSettings.apiHost + "/api/v1/product_detail_mobile/"+ productID + "/", '_blank')
  }

  routerPushSpecEdit = (specID, productID) => {
    router.push({pathname: '/product/product-spec-edit/' + specID, state: {"productID": productID }});
  }

  buildAction(currentRecord) {
    return (
      <Fragment>
        <ButtonGroup>
          <Button onClick={() => this.routerPushEdit(currentRecord.id)}>编辑商品详情</Button>
          <Button onClick={() => this.routerPushSpecCreate(currentRecord.id)}>上架商品规格</Button>
        </ButtonGroup>
        {/* <Button type="primary">商品详情(移动端渲染效果)</Button> */}
      </Fragment>
    )
  };

  buildExtra(currentRecord) {
    return (
      <Row>

        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>分类</div>
          <div className={styles.heading}>{currentRecord.category_first_name} / {currentRecord.category_name}</div>
        </Col>
        <Col xs={24} sm={24} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>
            { currentRecord.status === '1' ? (
              <Badge status='success' text='上架' />
            ) : <Badge status='error' text='下架' />}
          </div>
        </Col>
        <Col xs={12} sm={8} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>销量</div>
          <div className={styles.heading}>{currentRecord.sold}</div>
        </Col>
        <Col xs={12} sm={8} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>库存</div>
          <div className={styles.heading}>{currentRecord.total_stock}</div>
        </Col>
        <Col xs={12} sm={8} style={{ marginTop: 8 }}>
          <div className={styles.textSecondary}>起价</div>
          <div className={styles.heading}>{currentRecord.start_price}</div>
        </Col>
      </Row>
    )
  };

  buildDescription(currentRecord) {
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="副标题">{currentRecord.subtitle}</Description>
        <Description term="上架用户">{currentRecord.uploader}</Description>
        <Description term="创建时间">{currentRecord.created_at}</Description>
        <Description term="更新时间">{currentRecord.updated_at}</Description>
        <Description term="ID">{currentRecord.id}</Description>
      </DescriptionList>
    )
  };

  buildCarousel(srcList) {
    if (srcList) {
      const arr = [];
      for (let i = 0; i < srcList.length; i++) {
        arr.push(<img key={i} style={{ width: '10%', height: '10%' }} src={srcList[i]} />)
      }
      return arr;
    } else {
      return <div></div>
    }
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = (fields, productSpecId) => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: productSpecId,
      start_price: fields.start_price,
      end_price: fields.end_price,
      bargain_percent_range: fields.bargain_percent_range_start + '-' + fields.bargain_percent_range_end,
    };

    dispatch({
      type: 'product/createBargainProduct',
      payload: payload,
    }).then((data) => {
      message.success('新增砍价商品成功');
      this.handleModalVisible();
    });
  };

  handleModalVisibleGroupon = flag => {
    this.setState({
      modalVisibleGroupon: !!flag,
    });
  };

  handleAddGroupon = (fields, productSpecId) => {
    const { dispatch } = this.props;
    const payload = {
      product_spec: productSpecId,
      groupon_price: fields.groupon_price,
      limit: fields.limit,
    };

    dispatch({
      type: 'product/createGrouponProduct',
      payload: payload,
    }).then((data) => {
      message.success('新增团购商品成功');
      this.handleModalVisibleGroupon();
    });
  };

  buildSpecs(specData, productID) {
    if (specData) {
      const arr = [];

      const { modalVisible, modalVisibleGroupon } = this.state;
      const parentMethods = {
        handleAdd: this.handleAdd,
        handleModalVisible: this.handleModalVisible,
      };

      const parentMethodsGroupon = {
        handleAddGroupon: this.handleAddGroupon,
        handleModalVisibleGroupon: this.handleModalVisibleGroupon,
      };

      for (let i = 0; i < specData.length; i++) {
        arr.push(<Card style={{ marginBottom: 20 }} bodyStyle={{ padding: '20px 24px 8px 24px' }} key={i} type="inner" title={specData[i].name} extra={<span><a onClick={() => this.routerPushSpecEdit(specData[i].id, productID)}>编辑此规格</a><a style={{ marginLeft: 8 }}  onClick={() => this.handleModalVisible(true, specData[i].id)}>新增砍价商品</a><a style={{ marginLeft: 8 }}  onClick={() => this.handleModalVisibleGroupon(true, specData[i].id)}>新增拼团商品</a></span>}>
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
                         { specData[i].header_image ? (
                           <img style={{ width: '10%', height: '10%' }} src={specData[i].header_image} />
                         ) : null }
                     </Col>
                   </Row>
                   <CreateForm {...parentMethods} modalVisible={modalVisible} productSpecId={specData[i].id} />
                   <CreateFormGroupon {...parentMethodsGroupon} modalVisibleGroupon={modalVisibleGroupon} productSpecId={specData[i].id} />
                  </Card>)
        }
        return arr;
      } else {
        return <div></div>
    }
  };



  render() {
    const { operationkey } = this.state;
    const {
      product: { currentRecord, specData },
    } = this.props;

    const contentList = {
      tab1: (
        <Card title="商品详情" style={{ marginBottom: 24 }} bordered={false}>
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
            {/* <Row>
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
            </Row> */}
            <Row>
              <Col span={24}>
                <DescriptionItem title="题图" />
                { currentRecord.header_image ? (
                  <img style={{ width: '10%', height: '10%' }} src={currentRecord.header_image} />
                ) : null }
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={24}>
                <DescriptionItem title="轮播图" />
                {this.buildCarousel(currentRecord.carousel)}
              </Col>
            </Row>
        </Card>
      ),
      tab2: (
        <Card title="商品规格详情" style={{ marginBottom: 24 }} bordered={false}>
          {this.buildSpecs(specData, currentRecord.id)}
        </Card>
      ),
      tab3: (
        <Card style={{ marginBottom: 24 }} bordered={false} >
          <Button onClick={() => this.routerProductDetailNewTab(currentRecord.id)}>商品详情(移动端渲染效果) 新页面打开</Button>
        </Card>
      ),
    };

    return (
      <PageHeaderWrapper
        title={currentRecord.name}
        action={this.buildAction(currentRecord)}
        content={this.buildDescription(currentRecord)}
        extraContent={this.buildExtra(currentRecord)}
        tabList={operationTabList}
        onTabChange={this.onOperationTabChange}
      >
        {contentList[operationkey]}
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetail;
