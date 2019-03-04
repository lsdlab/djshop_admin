import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Badge } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ product }) => ({
  product,
}))
class Step3 extends React.PureComponent {

  componentDidMount() {
    const { dispatch, location } = this.props;

    if (location.state.productID) {
      dispatch({
        type: 'product/fetchDetail',
        productID: location.state.productID,
      }).then(() => {
        dispatch({
          type: 'product/fetchProductSpec',
          productID: location.state.productID,
        });
      });
    }
  }

  render() {
    const { product: { currentRecord } } = this.props;

    const onFinish = () => {
      router.push('/product/product-create-step-form/product');
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            商品名称：
          </Col>
          <Col xs={24} sm={16}>
            {currentRecord.name}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            副标题：
          </Col>
          <Col xs={24} sm={16}>
            {currentRecord.subtitle}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            上架用户：
          </Col>
          <Col xs={24} sm={16}>
            {currentRecord.uploader}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            分类：
          </Col>
          <Col xs={24} sm={16}>
            {currentRecord.category_name}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            状态：
          </Col>
          <Col xs={24} sm={16}>
            {currentRecord.status === '1' ? (
              <Badge status='success' text='上架' />
            ) : <Badge status='error' text='下架' />}
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          再次上架产品
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="上架成功"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
