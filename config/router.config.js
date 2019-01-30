export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
        ],
      },
      {
        path: '/product',
        name: 'product',
        icon: 'shopping',
        routes: [
          {
            path: '/product/category-list',
            name: 'category-list',
            component: './Product/CategoryList',
          },
          {
            path: '/product/ProductCreate',
            name: 'product-create',
            component: './Product/ProductCreate',
          },
          {
            path: '/product/product-list',
            name: 'product-list',
            component: './Product/ProductList',
          },
          {
            path: '/product/product-rec-list',
            name: 'product-rec-list',
            component: './Product/ProductRecList',
          },
        ],
      },
      {
        path: '/bargaingroupon',
        name: 'bargaingroupon',
        icon: 'shopping',
        routes: [
          {
            path: '/bargaingroupon/bargain-product-create',
            name: 'bargain-product-create',
            component: './BargainGroupon/BargainProductCreate',
          },
          {
            path: '/bargaingroupon/bargain-product-list',
            name: 'bargain-product-list',
            component: './BargainGroupon/BargainProductList',
          },
          {
            path: '/bargaingroupon/groupon-product-create',
            name: 'groupon-product-create',
            component: './BargainGroupon/GrouponProductCreate',
          },
          {
            path: '/bargaingroupon/groupon-product-list',
            name: 'groupon-product-list',
            component: './BargainGroupon/GrouponProductList',
          },
        ],
      },
      {
        path: '/coupon',
        name: 'coupon',
        icon: 'gift',
        routes: [
          {
            path: '/coupon/coupon-create',
            name: 'coupon-create',
            component: './Coupon/CouponCreate',
          },
          {
            path: '/coupon/coupon-list',
            name: 'coupon-list',
            component: './Coupon/CouponList',
          },
        ],
      },
      {
        path: '/transaction',
        name: 'transaction',
        icon: 'audit',
        routes: [
          {
            path: '/transaction/transaction-list',
            name: 'transaction-list',
            component: './Transaction/TransactionList',
          },
          {
            path: '/transaction/invoice-list',
            name: 'invoice-list',
            component: './Transaction/InvoiceList',
          },
          {
            path: '/transaction/refund-list',
            name: 'refund-list',
            component: './Transaction/RefundList',
          },
        ],
      },
      {
        path: '/assist',
        name: 'assist',
        icon: 'appstore',
        routes: [
          {
            path: '/assist/splash-list',
            name: 'splash-list',
            component: './Assist/SplashList',
          },
          {
            path: '/assist/banner-list',
            name: 'banner-list',
            component: './Assist/BannerList',
          },
          {
            path: '/assist/notice-list',
            name: 'notice-list',
            component: './Assist/NoticeList',
          },
          {
            path: '/assist/article-list',
            name: 'article-list',
            component: './Assist/ArticleList',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
