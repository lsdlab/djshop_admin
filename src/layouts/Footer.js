import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          <p>Copyright &copy; JC 2018-2020 All Rights Reserved</p>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
