const Toast = require('tdesign-miniprogram/toast/index');

Component({
  properties: {
    // 购物车中的商品数量
    cartNum: {
      type: Number,
      value: 0
    },
    // 总价格
    totalPrice: {
      type: String,
      value: '0.00'
    },
    // 购物车数据
    cartList: {
      type: Array,
      value: []
    },
    // 是否显示起送价格提示
    showMinPrice: {
      type: Boolean,
      value: true
    },
    // 起送价格
    minPrice: {
      type: Number,
      value: 0
    },
    // iPhone X 底部适配
    isIPhoneX: {
      type: Boolean,
      value: false
    }
  },

  data: {
    cartPopupVisible: false // 购物车弹窗显示状态
  },

  methods: {
    // 点击购物车图标
    onTapCart() {
      if (this.properties.cartNum <= 0) {
        this.showToast('购物车空空如也');
        return;
      }
      
      this.setData({ cartPopupVisible: true });
      this.triggerEvent('fetchCartList');
    },
    
    // 点击加入购物车按钮
    onAddToCart() {
      this.triggerEvent('toAddCart');
    },
    
    // 点击去结算按钮
    onCheckout() {
      if (this.properties.cartNum <= 0) {
        if (this.properties.showMinPrice) {
          this.showToast(`请先选择菜品，最低¥${this.properties.minPrice}起送`);
        } else {
          this.showToast('请先选择菜品');
        }
        return;
      }
      
      this.triggerEvent('toBuyNow');
    },
    
    // 关闭购物车弹窗
    closeCartPopup() {
      this.setData({ cartPopupVisible: false });
    },
    
    // 弹窗状态变化
    onPopupChange(e) {
      const { visible } = e.detail;
      if (!visible) {
        this.closeCartPopup();
      }
    },
    
    // 清空购物车
    clearCart() {
      wx.showModal({
        title: '提示',
        content: '确定要清空购物车吗？',
        success: (res) => {
          if (res.confirm) {
            this.triggerEvent('clearCart');
            this.closeCartPopup();
          }
        }
      });
    },
    
    // 减少商品数量
    onReduceItem(e) {
      const { id } = e.currentTarget.dataset;
      this.triggerEvent('updateCartItem', { id, action: 'reduce' });
    },
    
    // 增加商品数量
    onAddItem(e) {
      const { id } = e.currentTarget.dataset;
      this.triggerEvent('updateCartItem', { id, action: 'add' });
    },
    
    // 显示Toast提示
    showToast(message, theme = 'warning') {
      Toast({
        context: this,
        selector: '#t-toast',
        message,
        theme,
        direction: 'column'
      });
    }
  }
}); 