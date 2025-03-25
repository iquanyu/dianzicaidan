Component({
  properties: {
    name: {
      type: String,
      value: '',
    },
    size: {
      type: String,
      value: '32rpx',
    },
    color: {
      type: String,
      value: '',
    },
  },
  data: {
    iconMap: {
      // 添加常用图标的Unicode或SVG路径
      cart: '/static/icons/cart.png',
      add: '/static/icons/add.png',
      minus: '/static/icons/minus.png',
      close: '/static/icons/close.png',
      success: '/static/icons/success.png',
      error: '/static/icons/error.png',
      search: '/static/icons/search.png',
      'arrow-right': '/static/icons/arrow-right.png',
    },
  },
  methods: {
    // 点击图标触发事件
    onClick() {
      this.triggerEvent('click');
    },
  },
}); 