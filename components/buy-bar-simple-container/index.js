const Toast = require('tdesign-miniprogram/toast/index');

Component({
  properties: {
    // 购物车商品数量
    cartNum: {
      type: Number,
      value: 0
    },
    // 购物车总价
    totalPrice: {
      type: String,
      value: '0.00'
    },
    // 购物车商品列表
    cartList: {
      type: Array,
      value: []
    },
    // 是否显示起送价格
    showMinPrice: {
      type: Boolean,
      value: true
    },
    // 最低起送价格
    minPrice: {
      type: Number,
      value: 15
    },
    // iPhone X 底部适配
    isIPhoneX: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    // 转发子组件事件到页面
    onToAddCart(e) {
      this.triggerEvent('toAddCart', e.detail);
    },
    
    onToBuyNow(e) {
      this.triggerEvent('toBuyNow', e.detail);
    },
    
    onFetchCartList(e) {
      this.triggerEvent('fetchCartList', e.detail);
    },
    
    onClearCart(e) {
      this.triggerEvent('clearCart', e.detail);
    },
    
    onUpdateCartItem(e) {
      this.triggerEvent('updateCartItem', e.detail);
    },
    
    // 显示Toast提示
    showToast(options) {
      Toast({
        context: this,
        selector: '#t-toast',
        ...options
      });
    }
  }
}); 