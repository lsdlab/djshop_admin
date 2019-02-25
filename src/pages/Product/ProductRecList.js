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
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ProductRecList extends PureComponent {
  state = {
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchRecProduct',
    });
  }

  recProductDeleted = (flag, recProductID) => {
    const { dispatch } = this.props;
    if (flag && recProductID) {
      dispatch({
        type: 'product/patchRecProduct',
        payload: {
          deleted: true,
        },
        recProductID: recProductID,
      }).then(() => {
        message.success('下架推荐商品成功！');
        dispatch({
          type: 'product/fetchRecProduct',
        });
      });
    } else {
      dispatch({
        type: 'product/patchRecProduct',
        payload: {
          deleted: false,
        },
        recProductID: recProductID,
      }).then(() => {
        message.success('上架推荐商品成功！');
        dispatch({
          type: 'product/fetchRecProduct',
        });
      });
    }


  };

  render() {
    const {
      product: { recData },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '副标题',
        dataIndex: 'subtitle',
      },
      {
        title: '副副标题',
        dataIndex: 'subsubtitle',
      },
      {
        title: '商品名称',
        dataIndex: 'product.name',
      },
      {
        title: '展示顺序',
        dataIndex: 'display_order',
      },
      {
        title: '状态',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='下架中' />;
          } else {
            return <Badge status='success' text='上架中' />;
          }
        },
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
            { record.deleted ? (
              <a onClick={() => this.recProductDeleted(false, record.id)}>上架</a>
            ) : <a onClick={() => this.recProductDeleted(true, record.id)}>下架</a>}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="推荐商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SimpleTable
              loading={loading}
              data={recData}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductRecList;
