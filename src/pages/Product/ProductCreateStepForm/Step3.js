import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ product }) => ({
  product,
}))
class Step3 extends React.PureComponent {

  componentDidMount() {
    const { dispatch, location } = this.props;
    console.log(location);
  }

  render() {
    const { product: { currentRecord }, } = this.props;

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
            xx
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
