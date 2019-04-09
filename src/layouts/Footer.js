import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          <p>Copyright &copy; <a href="http://flashtech.xyz" target="_blank">闪算科技</a> 2018-2019 All Rights Reserved</p>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
