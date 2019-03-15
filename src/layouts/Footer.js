import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'breakwire',
          title: "JC's blog",
          href: 'https://breakwire.me',
          blankTarget: true,
        },
        {
          key: 'lsdlab-ant-design-pro',
          title: 'lsdlab/ant-design-pro',
          href: 'https://github.com/lsdlab/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'ant-design-ant-design-pro',
          title: 'ant-design/ant-design-pro',
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          <p>Site made by JC, powered by React and Ant Design Pro.</p>
          <p>Copyright &copy; 闪算科技 2018-2019 All Rights Reserved</p>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
