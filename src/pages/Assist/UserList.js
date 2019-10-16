import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Badge,
} from 'antd';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class UserList extends PureComponent {
  state = {
    currentPage: 1,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  routerPushDetail = (userID) => {
    router.push('/assist/user-detail/' + userID);
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'user/fetch',
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
      type: 'user/fetch',
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
        type: 'user/fetch',
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
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('search')(<Input placeholder="用户名/手机号" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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


  render() {
    const {
      user: { data },
      loading,
    } = this.props;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '昵称（微信名）',
        dataIndex: 'nickname',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '是否超级用户',
        dataIndex: 'is_superuser',
        render(text, record, index) {
          if (text) {
            return <Badge status='success' text='是' />;
          } else {
            return <Badge status='error' text='否' />;
          }
        },
      },
      {
        title: '积分',
        dataIndex: 'profile.points',
      },
      {
        title: '是否会员',
        dataIndex: 'profile.is_vip',
        render(text) {
          if (text) {
            return <Badge status='success' text='是' />;
          } else {
            return <Badge status='error' text='否' />;
          }
        },
      },
      {
        title: '会员周期',
        dataIndex: 'profile.vip_session',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '会员过期时间',
        dataIndex: 'profile.vip_expired_datetime',
        render(text) {
          if (text) {
            return text;
          } else {
            return '-';
          }
        },
      },
      {
        title: '注册时间',
        dataIndex: 'date_joined',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.routerPushDetail(record.id)}>详情</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <SimpleTable
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1480 }}
              current={this.state.currentPage}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
