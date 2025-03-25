const Toast = require('tdesign-miniprogram/toast/index');

Component({
  externalClasses: ['wr-sold-out', 'wr-class'],

  options: { multipleSlots: true },

  properties: {
    soldout: {
      // 菜品是否下架
      type: Boolean,
      value: false,
    },
    jumpArray: {
      type: Array,
      value: [],
    },
    isStock: {
      type: Boolean,
      value: true,
    }, // 是否有库存
    isSlotButton: {
      type: Boolean,
      value: false,
    }, // 是否开启按钮插槽
    shopCartNum: {
      type: Number, // 购物车气泡数量
      value: 0,
    },
    buttonType: {
      type: Number,
      value: 1, // 默认显示按钮
    },
    minDiscountPrice: {
      type: String,
      value: '0.00',
    },
    minSalePrice: {
      type: String,
      value: '0.00',
    },
    // 添加购物车商品列表属性
    cartList: {
      type: Array,
      value: [],
    },
  },

  data: {
    fillPrice: false,
    cartPopupVisible: false, // 购物车弹出层显示状态
  },

  methods: {
    toAddCart() {
      const { isStock, soldout, shopCartNum } = this.properties;
      
      // 已售罄或下架
      if (!isStock || soldout) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: soldout ? '菜品已下架' : '菜品已售罄',
          theme: 'warning',
        });
        return;
      }
      
      // 已经有商品在购物车
      if (shopCartNum > 0) {
        // 显示购物车弹出层
        this.setData({ cartPopupVisible: true });
        return;
      }
      
      this.triggerEvent('toAddCart');
      
      // 添加成功提示
      Toast({
        context: this,
        selector: '#t-toast',
        message: '已加入购物车',
        theme: 'success',
        direction: 'column',
      });
    },

    toBuyNow(e) {
      const { isStock, soldout, shopCartNum } = this.properties;
      
      // 已售罄或下架
      if (!isStock || soldout) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: soldout ? '菜品已下架' : '菜品已售罄',
          theme: 'warning',
        });
        return;
      }
      
      // 如果购物车有商品，直接去结算
      if (shopCartNum > 0) {
        // 显示Loading
        wx.showLoading({
          title: '正在准备订单...',
        });
        
        // 获取购物车数据
        const cartInfo = wx.getStorageSync('cart');
        console.log('当前购物车数据:', cartInfo);
        
        setTimeout(() => {
          wx.hideLoading();
          
          wx.navigateTo({
            url: '/pages/order/order-confirm/index',
            success: () => {
              console.log('跳转成功');
            },
            fail: (error) => {
              console.error('跳转失败:', error);
              Toast({
                context: this,
                selector: '#t-toast',
                message: '跳转订单页失败，请重试',
                icon: '',
              });
            }
          });
        }, 500);
        return;
      }
      
      // 否则，添加当前商品到购物车并跳转到结算页
      this.triggerEvent('toBuyNow', e);
    },

    toNav(e) {
      const { url } = e.currentTarget.dataset;
      return this.triggerEvent('toNav', {
        e,
        url,
      });
    },
    
    // 点击购物车图标
    onTapCart() {
      const { shopCartNum } = this.properties;
      
      // 购物车为空时不显示弹出层
      if (shopCartNum <= 0) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '购物车空空如也',
          icon: 'cart',
        });
        return;
      }
      
      // 显示购物车弹出层
      this.setData({ cartPopupVisible: true });
      
      // 请求购物车数据
      this.triggerEvent('fetchCartList');
    },
    
    // 关闭购物车弹出层
    closeCartPopup() {
      this.setData({ cartPopupVisible: false });
    },
    
    // 弹出层显示状态变化事件
    onPopupVisibleChange({ detail }) {
      const { visible } = detail;
      if (!visible) {
        this.setData({ cartPopupVisible: false });
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
            this.setData({ cartPopupVisible: false });
            
            Toast({
              context: this,
              selector: '#t-toast',
              message: '购物车已清空',
              icon: 'check-circle',
            });
          }
        }
      });
    },
    
    // 减少购物车商品数量
    onCartItemReduce(e) {
      const { id } = e.currentTarget.dataset;
      this.triggerEvent('updateCartItem', { id, action: 'reduce' });
    },
    
    // 增加购物车商品数量
    onCartItemAdd(e) {
      const { id } = e.currentTarget.dataset;
      this.triggerEvent('updateCartItem', { id, action: 'add' });
    }
  },
});
