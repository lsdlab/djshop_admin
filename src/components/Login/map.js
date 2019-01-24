import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default {
  Username: {
    props: {
      size: 'large',
      id: 'username',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};
