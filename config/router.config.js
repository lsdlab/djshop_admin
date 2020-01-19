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
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
            hideInMenu: false,
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
            path: '/product/article-list',
            name: 'article-list',
            component: './Product/ArticleList',
          },
          {
            path: '/product/product-create-step-form',
            name: 'product-create-step-form',
            component: './Product/ProductCreateStepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/product/product-create-step-form',
                redirect: '/product/product-create-step-form/product',
              },
              {
                path: '/product/product-create-step-form/product',
                name: 'product',
                component: './Product/ProductCreateStepForm/Step1',
              },
              {
                path: '/product/product-create-step-form/spec',
                name: 'spec',
                component: './Product/ProductCreateStepForm/Step2',
              },
              {
                path: '/product/product-create-step-form/finish',
                name: 'finish',
                component: './Product/ProductCreateStepForm/Step3',
              },
            ],
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
          {
            path: '/product/product-detail/:id',
            hideInMenu: true,
            name: 'product-detail',
            component: './Product/ProductDetail',
          },
          {
            path: '/product/product-edit/:id',
            hideInMenu: true,
            name: 'product-edit',
            component: './Product/ProductEdit',
          },
          {
            path: '/product/product-spec-edit/:id',
            hideInMenu: true,
            name: 'product-spec-edit',
            component: './Product/ProductSpecEdit',
          },
          {
            path: '/product/product-spec-create/:id',
            hideInMenu: true,
            name: 'product-spec-create',
            component: './Product/ProductSpecCreate',
          },
          {
            path: '/product/replenishlogs-list',
            name: 'replenishlogs-list',
            component: './Product/ReplenishlogList',
          },
          {
            path: '/product/stock-list',
            name: 'stock-list',
            component: './Product/StockList',
          },
        ],
      },
      {
        path: '/promotion',
        name: 'promotion',
        icon: 'shopping',
        routes: [
          {
            path: '/promotion/product-promotion-list',
            name: 'product-promotion-list',
            component: './Promotion/ProductPromotionList',
          },
          {
            path: '/promotion/promotion-list',
            name: 'promotion-list',
            component: './Promotion/PromotionList',
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
          {
            path: '/coupon/coupon-edit/:id',
            hideInMenu: true,
            name: 'coupon-edit',
            component: './Coupon/CouponEdit',
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
            path: '/transaction/transaction-list-today',
            hideInMenu: true,
            name: 'transaction-list-today',
            component: './Transaction/TransactionListToday',
          },
          {
            path: '/transaction/transaction-list-yesterday',
            hideInMenu: true,
            name: 'transaction-list-yesterday',
            component: './Transaction/TransactionListYesterday',
          },
          {
            path: '/transaction/transaction-detail/:id',
            hideInMenu: true,
            name: 'transaction-detail',
            component: './Transaction/TransactionDetail',
          },
          // {
          //   path: '/transaction/collect-list',
          //   name: 'collect-list',
          //   component: './Transaction/CollectList',
          // },
          // {
          //   path: '/transaction/invoice-list',
          //   name: 'invoice-list',
          //   component: './Transaction/InvoiceList',
          // },
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
            path: '/assist/user-list',
            name: 'user-list',
            component: './Assist/UserList',
          },
          {
            path: '/assist/user-detail/:id',
            hideInMenu: true,
            name: 'user-detail',
            component: './Assist/UserDetail',
          },
          {
            path: '/assist/upload-image',
            name: 'upload-image',
            component: './Assist/UploadImage',
          },
          {
            path: '/assist/upload-video',
            name: 'upload-video',
            component: './Assist/UploadVideo',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
