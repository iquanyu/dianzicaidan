import { config } from '../../config/index';
import { mockIp, mockReqId } from '../../utils/mock';
import { genSettleDetail, commitPay } from '../../model/order/orderConfirm';

/**
 * 结算页详情
 * @param {object} params 请求参数
 * @returns
 */
export function fetchSettleDetail(params) {
  if (config.useMock) {
    return new Promise((resolve) => {
      resolve(genSettleDetail(params));
    });
  }

  return new Promise((resolve) => {
    resolve(genSettleDetail(params));
  });
}

/** 提交mock订单 */
function mockDispatchCommitPay() {
  const { delay } = require('../_utils/delay');

  return delay().then(() => ({
    data: {
      isSuccess: true,
      tradeNo: '350930961469409099',
      payInfo: '{}',
      code: null,
      transactionId: 'E-200915180100299000',
      msg: null,
      interactId: '15145',
      channel: 'wechat',
      limitGoodsList: null,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 891,
    success: true,
  }));
}

/* 提交订单 */
export function dispatchCommitPay(params) {
  if (config.useMock) {
    return mockDispatchCommitPay(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 开发票 */
export function dispatchSupplementInvoice() {
  if (config.useMock) {
    const { delay } = require('../_utils/delay');
    return delay();
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

export { commitPay };
