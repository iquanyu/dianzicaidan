import Dialog from 'tdesign-miniprogram/dialog/index';
import Toast from 'tdesign-miniprogram/toast/index';
import { fetchCartGroupData } from '../../services/cart/cart';

Page({
  data: {
    cartGroupData: null,
    settleAccountsInfo: null,
    isLogin: false,
    loading: true,
  },
  relationList: [],
  isReloading: false,

  // 调用自定义tabbar的init函数，使页面与tabbar激活状态保持一致
  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.refreshData();
    
    // 添加调试辅助功能
    this.checkLocalStorage();
    this.getTabBar().init();
    wx.setNavigationBarTitle({
      title: '我的购物车',
    });
  },

  refreshData() {
    this.getCartGroupData().then((res) => {
      let isEmpty = true;
      const cartGroupData = res.data;
      // 一些组件中需要的字段可能接口并没有返回，或者返回的数据结构与预期不一致，需要在此先对数据做一些处理
      // 统计门店下加购的商品是否全选、是否存在缺货/无货
      for (const store of cartGroupData.storeGoods) {
        store.isSelected = true; // 该门店已加购商品是否全选
        store.storeStockShortage = false; // 该门店已加购商品是否存在库存不足
        if (!store.shortageGoodsList) {
          store.shortageGoodsList = []; // 该门店已加购商品如果库存为0需单独分组
        }
        for (const activity of store.promotionGoodsList) {
          activity.goodsPromotionList = activity.goodsPromotionList.filter((goods) => {
            goods.originPrice = undefined;

            // 统计是否有加购数大于库存数的商品
            if (goods.quantity > goods.stockQuantity) {
              store.storeStockShortage = true;
            }
            // 统计是否全选
            if (!goods.isSelected) {
              store.isSelected = false;
            }
            // 库存为0（无货）的商品单独分组
            if (goods.stockQuantity > 0) {
              return true;
            }
            store.shortageGoodsList.push(goods);
            return false;
          });

          if (activity.goodsPromotionList.length > 0) {
            isEmpty = false;
          }
        }
        if (store.shortageGoodsList.length > 0) {
          isEmpty = false;
        }
      }
      cartGroupData.invalidGoodItems = cartGroupData.invalidGoodItems.map((goods) => {
        goods.originPrice = undefined;
        return goods;
      });
      cartGroupData.isNotEmpty = !isEmpty;
      this.setData({ cartGroupData });
    });
  },

  findGoods(spuId, skuId) {
    let currentStore;
    let currentActivity;
    let currentGoods;
    const { storeGoods } = this.data.cartGroupData;
    for (const store of storeGoods) {
      for (const activity of store.promotionGoodsList) {
        for (const goods of activity.goodsPromotionList) {
          if (goods.spuId === spuId && goods.skuId === skuId) {
            currentStore = store;
            currentActivity = currentActivity;
            currentGoods = goods;
            return {
              currentStore,
              currentActivity,
              currentGoods,
            };
          }
        }
      }
    }
    return {
      currentStore,
      currentActivity,
      currentGoods,
    };
  },

  // 注：实际场景时应该调用接口获取购物车数据
  getCartGroupData() {
    const { cartGroupData } = this.data;
    if (!cartGroupData) {
      return fetchCartGroupData();
    }
    return Promise.resolve({ data: cartGroupData });
  },

  // 选择单个商品
  // 注：实际场景时应该调用接口更改选中状态
  selectGoodsService({ spuId, skuId, isSelected }) {
    this.findGoods(spuId, skuId).currentGoods.isSelected = isSelected;
    return Promise.resolve();
  },

  // 全选门店
  // 注：实际场景时应该调用接口更改选中状态
  selectStoreService({ storeId, isSelected }) {
    const currentStore = this.data.cartGroupData.storeGoods.find((s) => s.storeId === storeId);
    currentStore.isSelected = isSelected;
    currentStore.promotionGoodsList.forEach((activity) => {
      activity.goodsPromotionList.forEach((goods) => {
        goods.isSelected = isSelected;
      });
    });
    return Promise.resolve();
  },

  // 加购数量变更
  // 注：实际场景时应该调用接口
  changeQuantityService({ spuId, skuId, quantity }) {
    this.findGoods(spuId, skuId).currentGoods.quantity = quantity;
    return Promise.resolve();
  },

  // 删除加购商品
  // 注：实际场景时应该调用接口
  deleteGoodsService({ spuId, skuId }) {
    function deleteGoods(group) {
      for (const gindex in group) {
        const goods = group[gindex];
        if (goods.spuId === spuId && goods.skuId === skuId) {
          group.splice(gindex, 1);
          return gindex;
        }
      }
      return -1;
    }
    const { storeGoods, invalidGoodItems } = this.data.cartGroupData;
    for (const store of storeGoods) {
      for (const activity of store.promotionGoodsList) {
        if (deleteGoods(activity.goodsPromotionList) > -1) {
          return Promise.resolve();
        }
      }
      if (deleteGoods(store.shortageGoodsList) > -1) {
        return Promise.resolve();
      }
    }
    if (deleteGoods(invalidGoodItems) > -1) {
      return Promise.resolve();
    }
    return Promise.reject();
  },

  // 清空失效商品
  // 注：实际场景时应该调用接口
  clearInvalidGoodsService() {
    this.data.cartGroupData.invalidGoodItems = [];
    return Promise.resolve();
  },

  onGoodsSelect(e) {
    const {
      goods: { spuId, skuId },
      isSelected,
    } = e.detail;
    const { currentGoods } = this.findGoods(spuId, skuId);
    Toast({
      context: this,
      selector: '#t-toast',
      message: `${isSelected ? '选择' : '取消'}"${
        currentGoods.title.length > 5 ? `${currentGoods.title.slice(0, 5)}...` : currentGoods.title
      }"`,
      icon: '',
    });
    this.selectGoodsService({ spuId, skuId, isSelected }).then(() => this.refreshData());
  },

  onStoreSelect(e) {
    const {
      store: { storeId },
      isSelected,
    } = e.detail;
    this.selectStoreService({ storeId, isSelected }).then(() => this.refreshData());
  },

  onQuantityChange(e) {
    const {
      goods: { spuId, skuId },
      quantity,
    } = e.detail;
    const { currentGoods } = this.findGoods(spuId, skuId);
    const stockQuantity = currentGoods.stockQuantity > 0 ? currentGoods.stockQuantity : 0; // 避免后端返回的是-1
    // 加购数量超过库存数量
    if (quantity > stockQuantity) {
      // 加购数量等于库存数量的情况下继续加购
      if (currentGoods.quantity === stockQuantity && quantity - stockQuantity === 1) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '当前商品库存不足',
        });
        return;
      }
      Dialog.confirm({
        title: '商品库存不足',
        content: `当前商品库存不足，最大可购买数量为${stockQuantity}件`,
        confirmBtn: '修改为最大可购买数量',
        cancelBtn: '取消',
      })
        .then(() => {
          this.changeQuantityService({
            spuId,
            skuId,
            quantity: stockQuantity,
          }).then(() => this.refreshData());
        })
        .catch(() => {});
      return;
    }
    this.changeQuantityService({ spuId, skuId, quantity }).then(() => this.refreshData());
  },

  goCollect() {
    /** 活动肯定有一个活动ID，用来获取活动banner，活动商品列表等 */
    const promotionID = '123';
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },

  goGoodsDetail(e) {
    const { spuId, storeId } = e.detail.goods;
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}&storeId=${storeId}`,
    });
  },

  clearInvalidGoods() {
    // 实际场景时应该调用接口清空失效商品
    this.clearInvalidGoodsService().then(() => this.refreshData());
  },

  onGoodsDelete(e) {
    const {
      goods: { spuId, skuId },
    } = e.detail;
    Dialog.confirm({
      content: '确认删除该商品吗?',
      confirmBtn: '确定',
      cancelBtn: '取消',
    }).then(() => {
      this.deleteGoodsService({ spuId, skuId }).then(() => {
        Toast({ context: this, selector: '#t-toast', message: '商品删除成功' });
        this.refreshData();
      });
    });
  },

  onSelectAll(event) {
    const { isAllSelected } = event?.detail ?? {};
    Toast({
      context: this,
      selector: '#t-toast',
      message: `${isAllSelected ? '取消' : '点击'}了全选按钮`,
    });
    // 调用接口改变全选
  },

  onToSettle() {
    try {
      const { settleAccountsInfo } = this.data;
      if (!settleAccountsInfo) return;
      const { canSettleGoods, isAllSelected } = settleAccountsInfo;
      if (!isAllSelected) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '请选择菜品',
        });
        return;
      }
      if (canSettleGoods === 0) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '请选择菜品',
        });
        return;
      }

      // 确保购物车数据存在
      if (!this.data.cartGroupData || !this.data.cartGroupData.storeGoods) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '购物车数据异常，请刷新后重试',
        });
        return;
      }

      const goodsRequestList = [];
      this.data.cartGroupData.storeGoods.forEach((store) => {
        store.promotionGoodsList.forEach((promotion) => {
          if (promotion.goodsPromotionList) {
            promotion.goodsPromotionList.forEach((goods) => {
              if (goods.isSelected) {
                goodsRequestList.push({
                  isDummy: false,
                  storeId: store.storeId,
                  spuId: goods.spuId,
                  skuId: goods.skuId,
                  quantity: goods.quantity,
                  price: goods.price,
                  specText: goods.specInfo ? goods.specInfo.replace(/;/g, ' | ') : '',
                  image: goods.skuImage || goods.image,
                  title: goods.title,
                  productId: store.storeId || '',
                  delivery: 1,
                  weight: goods.weight || null,
                  primaryImage: goods.skuImage || goods.image,
                  advance: '-1',
                  reminderStock: '-1',
                  isSelected: true,
                  stockStatus: goods.stockStatus,
                  stockQuantity: goods.stockQuantity,
                  type: 'SPC',
                });
              }
            });
          }
        });
      });

      if (goodsRequestList.length === 0) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '请选择至少一项菜品',
        });
        return;
      }

      wx.setStorage({
        key: 'order_confirm_info',
        data: {
          goodsRequestList,
        },
        success: () => {
          wx.showLoading();
          wx.navigateTo({
            url: '/pages/order/order-confirm/index?type=1&from=cart',
            success: () => {
              wx.hideLoading();
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('跳转订单确认页失败', err);
            }
          });
        },
        fail: (err) => {
          console.error('存储订单数据失败', err);
        }
      });
    } catch (error) {
      console.error('结算时发生错误', error);
    }
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/home/home',
    });
  },

  // 促销活动入口
  onPromotion() {
    const { storeId } = this.data.cartGroupData;
    wx.navigateTo({
      url: `/pages/promotion-detail/index?storeId=${storeId}`,
    });
  },

  // 检查本地存储中的数据情况
  checkLocalStorage() {
    try {
      // 检查本地存储中的购物车数据
      const cartStorageList = wx.getStorageSync('cart');
      console.log('本地存储购物车数据:', cartStorageList);
      
      // 检查订单请求数据
      const orderGoodsData = wx.getStorageSync('order.goodsRequestList');
      console.log('本地存储订单商品数据:', orderGoodsData);
      
      // 如果订单商品数据存在，但不是有效的JSON，尝试清除它
      if (orderGoodsData && typeof orderGoodsData === 'string') {
        try {
          JSON.parse(orderGoodsData);
        } catch (e) {
          console.error('订单商品数据格式错误，正在清除');
          wx.removeStorageSync('order.goodsRequestList');
        }
      }
    } catch (error) {
      console.error('检查本地存储出错:', error);
    }
  },
});
