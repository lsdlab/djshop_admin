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
  Modal,
  message,
  Divider,
  Popconfirm,
  Badge,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ bargain, loading }) => ({
  bargain,
  loading: loading.models.bargain,
}))
@Form.create()
class BargainList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bargain/fetch',
    });
  }

  render() {
    const {
      bargain: { data },
      loading,
    } = this.props;
    const { currentPage, pageSize } = this.state;

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'bargain_product.product_spec.product.name',
      },
      {
        title: '当前价格',
        dataIndex: 'current_price',
      },
      // TODO 用户名
      // {
      //   title: '当前价格',
      //   dataIndex: 'current_price',
      // },
      {
        title: '起始价格',
        dataIndex: 'bargain_product.start_price',
      },
      {
        title: '结束价格',
        dataIndex: 'bargain_product.end_price',
      },
      {
        title: '开始时间',
        dataIndex: 'start_datetime',
      },
      {
        title: '结束时间',
        dataIndex: 'end_datetime',
      },
      {
        title: '状态',
        dataIndex: 'deleted',
        render(text, record, index) {
          if (text) {
            return <Badge status='error' text='结束' />;
          } else {
            return <Badge status='success' text='进行中' />;
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a>详情</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="砍价列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1200 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BargainList;
