const Toast = require('tdesign-miniprogram/toast/index');

Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  
  properties: {
    // 从外部传入的属性，用于传递给内部的buy-bar组件
    soldout: {
      type: Boolean,
      value: false,
    },
    isStock: {
      type: Boolean,
      value: true,
    },
    shopCartNum: {
      type: Number,
      value: 0,
    },
    minDiscountPrice: {
      type: String,
      value: '0.00',
    },
    minSalePrice: {
      type: String,
      value: '0.00',
    },
    cartList: {
      type: Array,
      value: [],
    },
    buttonType: {
      type: Number,
      value: 1, // 默认显示按钮
    },
    jumpArray: {
      type: Array,
      value: [],
    },
  },
  
  methods: {
    // 从内部buy-bar组件触发的事件，向上转发
    onToAddCart(e) {
      this.triggerEvent('toAddCart', e.detail);
    },
    
    onToBuyNow(e) {
      this.triggerEvent('toBuyNow', e.detail);
    },
    
    onToNav(e) {
      this.triggerEvent('toNav', e.detail);
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
}) 