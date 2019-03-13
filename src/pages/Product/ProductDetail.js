import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Icon,
  Button,
  Dropdown,
  Menu,
  Badge,
  Checkbox,
} from 'antd';
import router from 'umi/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Profile/AdvancedProfile.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const menu = (
  <Menu>
    <Menu.Item key="1">选项一</Menu.Item>
    <Menu.Item key="2">选项二</Menu.Item>
    <Menu.Item key="3">选项三</Menu.Item>
  </Menu>
);

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

/* eslint react/no-multi-comp:0 */
@connect(({ product }) => ({
  product,
}))
class ProductDetail extends PureComponent {
  state = {
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

  routerPushEdit = (productID) => {
    router.push('/product/product-edit/' + productID);
  }

  routerPushSpecEdit = (specID, productID) => {
    router.push({pathname: '/product/product-spec-edit/' + specID, state: {"productID": productID }});
  }

  buildAction() {
    return (
      <Fragment>
        <ButtonGroup>
          <Button>操作</Button>
          <Button>操作</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary">主操作</Button>
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

  buildSpecs(specData, productID) {
    if (specData) {
      const arr = [];
      for (let i = 0; i < specData.length; i++) {
        arr.push(<Card style={{ marginBottom: 20 }} bodyStyle={{ padding: '20px 24px 8px 24px' }} key={i} type="inner" title={specData[i].name} extra={<a onClick={() => this.routerPushSpecEdit(specData[i].id, productID)}>编辑商品规格</a>}>
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
                  </Card>)
        }
        return arr;
      } else {
        return <div></div>
    }
  };

  render() {
    const {
      product: { currentRecord, specData },
    } = this.props;

    return (
      <PageHeaderWrapper
        title={currentRecord.name}
        logo={
          <img alt="" src="https://djshopmedia.oss-cn-shanghai.aliyuncs.com/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        // action={this.buildAction()}
        content={this.buildDescription(currentRecord)}
        extraContent={this.buildExtra(currentRecord)}
      >
        <Card title="商品信息" style={{ marginBottom: 24 }} bordered={false} extra={<a onClick={() => this.routerPushEdit(currentRecord.id)}>编辑商品</a>}>
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
        <Card title="商品规格信息" style={{ marginBottom: 24 }} bordered={false}>
          {this.buildSpecs(specData, currentRecord.id)}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetail;
