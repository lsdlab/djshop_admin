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
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
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
        title: '展示顺序',
        dataIndex: 'display_order',
      },
      {
        title: '是否下架',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='是' />;
          } else {
            return <Badge status='success' text='否' />;
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
            <a>商品详情</a>
            <Divider type="vertical" />
            { record.deleted ? (
              <a>上架</a>
            ) : <a>下架</a>}
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
