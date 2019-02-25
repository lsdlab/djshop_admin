import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
  Steps,
  Popover,
  Table,
  Tooltip,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AdvancedProfile.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const menu = (
  <Menu>
    <Menu.Item key="1">选项一</Menu.Item>
    <Menu.Item key="2">选项二</Menu.Item>
    <Menu.Item key="3">选项三</Menu.Item>
  </Menu>
);


/* eslint react/no-multi-comp:0 */
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
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
        type: 'product/fetchProductSpec',
        productID: productID,
      });
    });
  };

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
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>
            { currentRecord.status === '1' ? (
              <Badge status='success' text='上架' />
            ) : <Badge status='error' text='下架' />}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>分类</div>
          <div className={styles.heading}>{currentRecord.category_name}</div>
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
      </DescriptionList>
    )
  };

  render() {
    const {
      product: { currentRecord, specData },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper
        title={currentRecord.name}
        logo={
          <img alt="" src="https://djshopmedia.oss-cn-shanghai.aliyuncs.com/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.buildAction()}
        content={this.buildDescription(currentRecord)}
        extraContent={this.buildExtra(currentRecord)}
      >
        <Card title="用户信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="用户姓名">付小小</Description>
            <Description term="会员卡号">32943898021309809423</Description>
            <Description term="身份证">3321944288191034921</Description>
            <Description term="联系方式">18112345678</Description>
            <Description term="联系地址">
              曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
            </Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }} title="信息组">
            <Description term="某某数据">725</Description>
            <Description term="该数据更新时间">2017-08-08</Description>
            <Description>&nbsp;</Description>
            <Description
              term={
                <span>
                  某某数据
                  <Tooltip title="数据说明">
                    <Icon
                      style={{ color: 'rgba(0, 0, 0, 0.43)', marginLeft: 4 }}
                      type="info-circle-o"
                    />
                  </Tooltip>
                </span>
              }
            >
              725
            </Description>
            <Description term="该数据更新时间">2017-08-08</Description>
          </DescriptionList>
          <h4 style={{ marginBottom: 16 }}>信息组</h4>
          <Card type="inner" title="多层级信息组">
            <DescriptionList size="small" style={{ marginBottom: 16 }} title="组名称">
              <Description term="负责人">林东东</Description>
              <Description term="角色码">1234567</Description>
              <Description term="所属部门">XX公司 - YY部</Description>
              <Description term="过期时间">2017-08-08</Description>
              <Description term="描述">
                这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
              </Description>
            </DescriptionList>
            <Divider style={{ margin: '16px 0' }} />
            <DescriptionList size="small" style={{ marginBottom: 16 }} title="组名称" col="1">
              <Description term="学名">
                Citrullus lanatus (Thunb.) Matsum. et
                Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
              </Description>
            </DescriptionList>
            <Divider style={{ margin: '16px 0' }} />
            <DescriptionList size="small" title="组名称">
              <Description term="负责人">付小小</Description>
              <Description term="角色码">1234568</Description>
            </DescriptionList>
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetail;
