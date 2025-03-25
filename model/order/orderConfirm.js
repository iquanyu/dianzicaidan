import { mockIp, mockReqId } from '../../utils/mock';

export const transformGoodsDataToConfirmData = (goodsDataList) => {
  const list = [];

  if (!Array.isArray(goodsDataList)) {
    console.error('商品数据列表不是数组:', goodsDataList);
    return list;
  }

  goodsDataList.forEach((goodsData) => {
    if (!goodsData || typeof goodsData !== 'object') {
      console.error('无效的商品数据项:', goodsData);
      return; // 跳过无效数据
    }

    // 添加数据验证和默认值
    const item = {
      storeId: goodsData.storeId || '1000',
      spuId: goodsData.spuId,
      skuId: goodsData.skuId || goodsData.spuId,
      goodsName: goodsData.title || goodsData.goodsName || '未命名商品',
      image: goodsData.primaryImage || goodsData.thumb || goodsData.image,
      reminderStock: goodsData.stockQuantity || 119,
      quantity: goodsData.quantity || 1,
      payPrice: goodsData.price || '0',
      totalSkuPrice: goodsData.price || '0',
      discountSettlePrice: goodsData.price || '0',
      realSettlePrice: goodsData.price || '0',
      settlePrice: goodsData.price || goodsData.settlePrice || '0',
      oriPrice: goodsData.originPrice || goodsData.oriPrice || goodsData.price || '0',
      tagPrice: goodsData.tagPrice || null,
      tagText: goodsData.tagText || null,
      skuSpecLst: [],
      promotionIds: null,
      weight: 0.0,
      unit: 'KG',
      volume: null,
      masterGoodsType: 0,
      viceGoodsType: 0,
      roomId: goodsData.roomId || null,
      egoodsName: null,
    };

    // 处理规格信息
    if (goodsData.specInfo && Array.isArray(goodsData.specInfo)) {
      item.skuSpecLst = goodsData.specInfo;
    } else if (goodsData.specText) {
      // 尝试从规格文本构建规格列表
      const specs = goodsData.specText.split('，');
      item.skuSpecLst = specs.map(spec => {
        const [specTitle, specValue] = spec.split(':').map(s => s.trim());
        return {
          specTitle: specTitle || '规格',
          specValue: specValue || spec
        };
      });
    }

    // 确保价格字段是字符串格式
    Object.keys(item).forEach(key => {
      if (key.includes('Price') && typeof item[key] === 'number') {
        item[key] = String(item[key]);
      }
    });

    list.push(item);
  });

  return list;
};

/** 生成结算数据 */
export function genSettleDetail(params) {
  const { goodsRequestList } = params;

  const resp = {
    data: {
      settleType: 1,
      userAddress: null,
      totalGoodsCount: 0,
      packageCount: 1,
      totalAmount: '0',
      totalPayAmount: '0',
      totalDiscountAmount: '0',
      totalPromotionAmount: '0',
      totalCouponAmount: '0',
      totalSalePrice: '0',
      totalGoodsAmount: '0',
      totalDeliveryFee: '0',
      invoiceRequest: null,
      skuImages: null,
      deliveryFeeList: null,
      storeGoodsList: [
        {
          storeId: '1000',
          storeName: '默认门店',
          remark: null,
          goodsCount: 0,
          deliveryFee: '0',
          deliveryWords: null,
          storeTotalAmount: '0',
          storeTotalPayAmount: '0',
          storeTotalDiscountAmount: '0',
          storeTotalCouponAmount: '0',
          skuDetailVos: [],
          couponList: [],
        },
      ],
      inValidGoodsList: null,
      outOfStockGoodsList: null,
      limitGoodsList: null,
      abnormalDeliveryGoodsList: null,
      invoiceSupport: 0,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 244,
    success: true,
  };

  const list = transformGoodsDataToConfirmData(goodsRequestList);

  // 获取购物车传递的商品数据
  resp.data.storeGoodsList[0].skuDetailVos = list;
  
  // 动态计算商品数量
  resp.data.totalGoodsCount = list.reduce((count, item) => count + item.quantity, 0);
  resp.data.storeGoodsList[0].goodsCount = resp.data.totalGoodsCount;

  // 计算总价
  const totalPrice = list.reduce((pre, cur) => {
    return pre + cur.quantity * Number(cur.settlePrice);
  }, 0);

  // 直接使用总价，不计算折扣
  resp.data.totalSalePrice = totalPrice;
  resp.data.totalPayAmount = totalPrice;
  resp.data.totalAmount = totalPrice;
  resp.data.storeGoodsList[0].storeTotalPayAmount = totalPrice;

  return resp;
}

export function commitPay(params) {
  // 生成一个模拟的订单号
  const generateOrderNo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      const tradeNo = generateOrderNo();
      resolve({
        code: 'Success',
        data: {
          settleType: 1,
          tradeNo: tradeNo,
          channel: 'wechat',
          payInfo: null,
          interactId: null,
          transactionId: null,
        },
        msg: '下单成功',
        success: true
      });
    }, 800);
  });
}
