import Toast from 'tdesign-miniprogram/toast/index';
import { fetchSettleDetail, commitPay } from '../../../services/order/orderConfirm';
import { getAddressPromise } from '../../usercenter/address/list/util';

const stripeImg = `https://cdn-we-retail.ym.tencent.com/miniapp/order/stripe.png`;

Page({
  data: {
    placeholder: '备注信息',
    stripeImg,
    loading: false,
    settleDetailData: {
      storeGoodsList: [], //正常下单商品列表
      outOfStockGoodsList: [], //库存不足商品
      abnormalDeliveryGoodsList: [], // 不能正常配送商品
      inValidGoodsList: [], // 失效或者库存不足
      limitGoodsList: [], //限购商品
      couponList: [], //门店优惠券信息
    }, // 获取结算页详情 data
    orderCardList: [], // 仅用于商品卡片展示
    couponsShow: false, // 显示优惠券的弹框
    invoiceData: {
      email: '', // 发票发送邮箱
      buyerTaxNo: '', // 税号
      invoiceType: null, // 开票类型  1：增值税专用发票； 2：增值税普通发票； 3：增值税电子发票；4：增值税卷式发票；5：区块链电子发票。
      buyerPhone: '', //手机号
      buyerName: '', //个人或公司名称
      titleType: '', // 发票抬头 1-公司 2-个人
      contentType: '', //发票内容 1-明细 2-类别
    },
    goodsRequestList: [],
    userAddressReq: null,
    popupShow: false, // 不在配送范围 失效 库存不足 商品展示弹框
    notesPosition: 'center',
    storeInfoList: [],
    storeNoteIndex: 0, //当前填写备注门店index
    promotionGoodsList: [], //当前门店商品列表(优惠券)
    couponList: [], //当前门店所选优惠券
    submitCouponList: [], //所有门店所选优惠券
    currentStoreId: null, //当前优惠券storeId
    userAddress: null,
  },

  payLock: false,
  noteInfo: [],
  tempNoteInfo: [],
  onLoad(options) {
    this.setData({
      loading: true,
    });
    this.handleOptionsParams(options);
  },
  onShow() {
    const invoiceData = wx.getStorageSync('invoiceData');
    if (invoiceData) {
      //处理发票
      this.invoiceData = invoiceData;
      this.setData({
        invoiceData,
      });
      wx.removeStorageSync('invoiceData');
    }
  },

  init() {
    this.setData({
      loading: true,
    });
    const { goodsRequestList } = this;
    this.handleOptionsParams({ goodsRequestList });
  },
  // 处理不同情况下跳转到结算页时需要的参数
  handleOptionsParams(options, couponList) {
    let { goodsRequestList } = this; // 商品列表
    // let { userAddressReq } = this; // 收货地址
    
    const storeInfoList = []; // 门店列表
    // if (options.userAddressReq) {
    //   userAddressReq = options.userAddressReq;
    // }
    
    try {
      console.log('订单确认页接收到的options:', JSON.stringify(options));
      
      // 确保options.type存在，默认为'cart'
      if (!options.type) {
        console.log('未指定type参数，默认为cart');
        options.type = 'cart';
      }
      
      if (options.type === 'cart') {
        // 从购物车跳转过来时，获取传入的商品列表数据
        const goodsRequestListJson = wx.getStorageSync('order.goodsRequestList');
        console.log('从Storage获取的购物车商品数据:', goodsRequestListJson);
        
        if (!goodsRequestListJson) {
          console.error('购物车商品数据为空');
          
          // 尝试从本地购物车数据直接获取
          const cartInfo = wx.getStorageSync('cart');
          console.log('尝试从本地存储获取购物车数据:', cartInfo);
          
          if (cartInfo && cartInfo.list && cartInfo.list.length > 0) {
            goodsRequestList = cartInfo.list.map(item => ({
              spuId: item.id,
              skuId: item.id,
              quantity: item.num || 1,
              price: String(parseFloat(item.price) * 100), // 转换为分为单位
              primaryImage: item.thumb,
              title: item.name,
              storeId: item.storeId || '1000',
              storeName: item.storeName || '默认门店',
              isSelected: 1,
              stockQuantity: 999,
              specInfo: [],
              specText: item.specText || ''
            }));
            
            console.log('从本地购物车中构建的商品列表:', JSON.stringify(goodsRequestList));
            
            if (goodsRequestList.length > 0) {
              // 将构建的数据保存回storage
              wx.setStorageSync('order.goodsRequestList', JSON.stringify(goodsRequestList));
            } else {
              Toast({
                context: this,
                message: '购物车为空，请添加商品',
                theme: 'error',
              });
              setTimeout(() => {
                wx.navigateBack();
              }, 2000);
              return;
            }
          } else {
            Toast({
              context: this,
              message: '商品数据加载失败，请返回重试',
              theme: 'error',
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
            return;
          }
        } else {
          try {
            goodsRequestList = JSON.parse(goodsRequestListJson);
          } catch (e) {
            console.error('解析购物车商品数据出错:', e);
            Toast({
              context: this,
              message: '商品数据格式错误，请返回重试',
              theme: 'error',
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
            return;
          }
        }
      } else if (typeof options.goodsRequestList === 'string') {
        try {
          goodsRequestList = JSON.parse(options.goodsRequestList);
        } catch (e) {
          console.error('解析商品数据出错:', e);
          Toast({
            context: this,
            message: '商品数据格式错误，请返回重试',
            theme: 'error',
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
          return;
        }
      }
      
      // 检查商品列表是否为空
      if (!goodsRequestList || !Array.isArray(goodsRequestList) || goodsRequestList.length === 0) {
        console.error('商品列表为空或格式不正确', goodsRequestList);
        Toast({
          context: this,
          message: '没有可结算的商品',
          theme: 'warning',
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
        return;
      }
      
      console.log('处理后的商品列表:', JSON.stringify(goodsRequestList));
      
      // 验证每个商品是否包含必要字段
      const validGoodsList = goodsRequestList.filter(goods => {
        if (!goods || typeof goods !== 'object') return false;
        
        // 必须包含以下字段
        const requiredFields = ['spuId', 'quantity', 'price', 'title'];
        const hasAllFields = requiredFields.every(field => goods[field] !== undefined);
        
        if (!hasAllFields) {
          console.error('商品数据缺少必要字段:', goods);
        }
        
        return hasAllFields;
      });
      
      if (validGoodsList.length === 0) {
        console.error('没有有效的商品数据');
        Toast({
          context: this,
          message: '商品数据不完整，请返回重试',
          theme: 'error',
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
        return;
      }
      
      goodsRequestList = validGoodsList;
      
      //获取结算页请求数据列表
      const storeMap = {};
      goodsRequestList.forEach((goods) => {
        if (goods && !storeMap[goods.storeId]) {
          storeInfoList.push({
            storeId: goods.storeId || '1000',
            storeName: goods.storeName || '默认门店',
          });
          storeMap[goods.storeId] = true;
        }
      });
      
      // 保存商品列表和门店信息
      this.goodsRequestList = goodsRequestList;
      // this.userAddressReq = userAddressReq;
      this.setData({
        goodsRequestList,
        // userAddressReq,
        storeInfoList,
      });
      
      // 请求购物车api
      fetchSettleDetail({
        goodsRequestList,
        // userAddressReq,
        // couponList,
      })
        .then((res) => {
          this.setData({ loading: false });
          console.log('结算API返回结果:', JSON.stringify(res));
          
          if (res.code === 'Success') {
            //请求成功时
            this.initData(res.data);
          } else {
            //请求code不为Success（比如当加购商品数超过库存等情况）， 回到购物车页
            wx.showToast({
              title: res.msg || '结算失败，请重试',
              icon: 'none',
              duration: 2000,
            });
            this.handleError();
          }
        })
        .catch((err) => {
          this.setData({ loading: false });
          console.error('结算API请求失败:', err);
          
          //请求失败， 回到购物车页
          wx.showToast({
            title: err.msg || '请求结算信息失败，请重试',
            icon: 'none',
            duration: 2000,
          });
          this.handleError();
        });
    } catch (error) {
      console.error('处理结算参数出错:', error);
      this.setData({ loading: false });
      Toast({
        context: this,
        message: '处理订单数据出错，请返回重试',
        theme: 'error',
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },
  initData(resData) {
    // 转换商品卡片显示数据
    const data = this.handleResToGoodsCard(resData);
    // this.userAddressReq = resData.userAddress;

    if (resData.userAddress) {
      this.setData({ userAddress: resData.userAddress });
    }
    this.setData({ settleDetailData: data });
    this.isInvalidOrder(data);
  },

  isInvalidOrder(data) {
    // 失效 不在配送范围 限购的商品 提示弹窗
    if (
      (data.limitGoodsList && data.limitGoodsList.length > 0) ||
      (data.abnormalDeliveryGoodsList &&
        data.abnormalDeliveryGoodsList.length > 0) ||
      (data.inValidGoodsList && data.inValidGoodsList.length > 0)
    ) {
      this.setData({ popupShow: true });
      return true;
    }
    this.setData({ popupShow: false });
    if (data.settleType === 0) {
      return true;
    }
    return false;
  },

  handleError() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '结算异常, 请稍后重试',
      duration: 2000,
      icon: '',
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
    this.setData({
      loading: false,
    });
  },
  getRequestGoodsList(storeGoodsList) {
    const filterStoreGoodsList = [];
    storeGoodsList &&
      storeGoodsList.forEach((store) => {
        const { storeName } = store;
        store.skuDetailVos &&
          store.skuDetailVos.forEach((goods) => {
            const data = goods;
            data.storeName = storeName;
            filterStoreGoodsList.push(data);
          });
      });
    return filterStoreGoodsList;
  },
  handleGoodsRequest(goods, isOutStock = false) {
    const {
      reminderStock,
      quantity,
      storeId,
      uid,
      saasId,
      spuId,
      goodsName,
      skuId,
      storeName,
      roomId,
    } = goods;
    const resQuantity = isOutStock ? reminderStock : quantity;
    return {
      quantity: resQuantity,
      storeId,
      uid,
      saasId,
      spuId,
      goodsName,
      skuId,
      storeName,
      roomId,
    };
  },
  handleResToGoodsCard(data) {
    // 转换数据 符合 goods-card展示
    const orderCardList = []; // 订单卡片列表
    const storeInfoList = [];
    const submitCouponList = []; //使用优惠券列表;

    data.storeGoodsList &&
      data.storeGoodsList.forEach((ele) => {
        const orderCard = {
          id: ele.storeId,
          storeName: ele.storeName,
          status: 0,
          statusDesc: '',
          amount: ele.storeTotalPayAmount,
          goodsList: [],
        }; // 订单卡片
        ele.skuDetailVos.forEach((item, index) => {
          orderCard.goodsList.push({
            id: index,
            thumb: item.image,
            title: item.goodsName,
            specs: item.skuSpecLst.map((s) => s.specValue), // 规格列表 string[]
            price: item.tagPrice || item.settlePrice || '0', // 优先取限时活动价
            settlePrice: item.settlePrice,
            titlePrefixTags: item.tagText ? [{ text: item.tagText }] : [],
            num: item.quantity,
            skuId: item.skuId,
            spuId: item.spuId,
            storeId: item.storeId,
          });
        });

        storeInfoList.push({
          storeId: ele.storeId,
          storeName: ele.storeName,
          remark: '',
        });
        submitCouponList.push({
          storeId: ele.storeId,
          couponList: ele.couponList || [],
        });
        this.noteInfo.push('');
        this.tempNoteInfo.push('');
        orderCardList.push(orderCard);
      });

    this.setData({ orderCardList, storeInfoList, submitCouponList });
    return data;
  },
  onNotes(e) {
    const { storenoteindex: storeNoteIndex } = e.currentTarget.dataset;
    // 添加备注信息
    this.setData({
      dialogShow: true,
      storeNoteIndex,
    });
  },
  onInput(e) {
    const { storeNoteIndex } = this.data;
    this.noteInfo[storeNoteIndex] = e.detail.value;
  },
  onBlur() {
    this.setData({
      notesPosition: 'center',
    });
  },
  onFocus() {
    this.setData({
      notesPosition: 'self',
    });
  },
  onTap() {
    this.setData({
      placeholder: '',
    });
  },
  onNoteConfirm() {
    // 备注信息 确认按钮
    const { storeInfoList, storeNoteIndex } = this.data;
    this.tempNoteInfo[storeNoteIndex] = this.noteInfo[storeNoteIndex];
    storeInfoList[storeNoteIndex].remark = this.noteInfo[storeNoteIndex];

    this.setData({
      dialogShow: false,
      storeInfoList,
    });
  },
  onNoteCancel() {
    // 备注信息 取消按钮
    const { storeNoteIndex } = this.data;
    this.noteInfo[storeNoteIndex] = this.tempNoteInfo[storeNoteIndex];
    this.setData({
      dialogShow: false,
    });
  },

  onSureCommit() {
    // 商品库存不足继续结算
    const { settleDetailData } = this.data;
    const { outOfStockGoodsList, storeGoodsList, inValidGoodsList } =
      settleDetailData;
    if (
      (outOfStockGoodsList && outOfStockGoodsList.length > 0) ||
      (inValidGoodsList && storeGoodsList)
    ) {
      // 合并正常商品 和 库存 不足商品继续支付
      // 过滤不必要的参数
      const filterOutGoodsList = [];
      outOfStockGoodsList &&
        outOfStockGoodsList.forEach((outOfStockGoods) => {
          const { storeName } = outOfStockGoods;
          outOfStockGoods.unSettlementGoods.forEach((ele) => {
            const data = ele;
            data.quantity = ele.reminderStock;
            data.storeName = storeName;
            filterOutGoodsList.push(data);
          });
        });
      const filterStoreGoodsList = this.getRequestGoodsList(storeGoodsList);
      const goodsRequestList = filterOutGoodsList.concat(filterStoreGoodsList);
      this.handleOptionsParams({ goodsRequestList });
    }
  },
  // 提交订单
  submitOrder() {
    const {
      settleDetailData,
      storeInfoList,
    } = this.data;
    const { goodsRequestList } = this;

    if (this.payLock || !settleDetailData.totalPayAmount || settleDetailData.totalPayAmount <= 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '订单金额必须大于0',
        duration: 2000,
        icon: 'help-circle',
      });
      return;
    }
    
    this.payLock = true;
    const params = {
      goodsRequestList: goodsRequestList,
      totalAmount: settleDetailData.totalPayAmount, //取优惠后的结算金额
      storeInfoList,
    };
    
    // 显示提交中状态
    wx.showLoading({
      title: '提交订单中...',
    });
    
    commitPay(params).then(
      (res) => {
        this.payLock = false;
        wx.hideLoading();
        
        const { data } = res;
        // 提交出现 失效 不在配送范围 限购的商品 提示弹窗
        if (this.isInvalidOrder(data)) {
          return;
        }
        
        if (res.code === 'Success') {
          // 获取订单号
          const { tradeNo } = data;
          
          // 显示成功提示
          Toast({
            context: this,
            selector: '#t-toast',
            message: '订单提交成功',
            duration: 1000,
            icon: 'check-circle',
          });
          
          // 延迟一秒后跳转
          setTimeout(() => {
            // 直接跳转到订单详情页
            wx.redirectTo({
              url: `/pages/order/order-detail/index?orderNo=${tradeNo}`,
              fail: (err) => {
                console.error('跳转订单详情页失败', err);
                // 如果订单详情页跳转失败，跳转到订单列表页
                wx.redirectTo({
                  url: '/pages/order/order-list/index'
                });
              }
            });
          }, 1000);
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.msg || '提交订单失败，请稍后重试',
            duration: 2000,
            icon: 'close-circle',
          });
        }
      },
      (err) => {
        this.payLock = false;
        wx.hideLoading();
        
        Toast({
          context: this,
          selector: '#t-toast',
          message: err.msg || '提交订单失败，请稍后重试',
          duration: 2000,
          icon: 'close-circle',
        });
      },
    );
  },

  hide() {
    // 隐藏 popup
    this.setData({
      'settleDetailData.abnormalDeliveryGoodsList': [],
    });
  },

  onGoodsNumChange(e) {
    const {
      detail: { value },
      currentTarget: {
        dataset: { goods },
      },
    } = e;
    const index = this.goodsRequestList.findIndex(
      ({ storeId, spuId, skuId }) =>
        goods.storeId === storeId &&
        goods.spuId === spuId &&
        goods.skuId === skuId,
    );
    if (index >= 0) {
      // eslint-disable-next-line no-confusing-arrow
      const goodsRequestList = this.goodsRequestList.map((item, i) =>
        i === index ? { ...item, quantity: value } : item,
      );
      this.handleOptionsParams({ goodsRequestList });
    }
  },

  onPopupChange() {
    this.setData({
      popupShow: !this.data.popupShow,
    });
  },
});
