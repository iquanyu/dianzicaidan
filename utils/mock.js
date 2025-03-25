/**
 * 随机打散字符串
 * @param {number} n 长度
 * @param {string} str 字符串
 * @returns {string}
 */
function generateMixed(n, str) {
  var res = '';
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += str[id];
  }
  return res;
}

/**
 * 生成随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number}
 */
function getRandomNum(min, max) {
  var range = max - min;
  var rand = Math.random();
  return min + Math.round(rand * range);
}

/**
 * 生成随机IP
 * @returns {string}
 */
function mockIp() {
  return `10.${getRandomNum(1, 254)}.${getRandomNum(1, 254)}.${getRandomNum(
    1,
    254,
  )}`;
}

/**
 * 生成随机请求ID
 * @returns {string}
 */
function mockReqId() {
  return `${getRandomNum(100000, 999999)}.${new Date().valueOf()}${getRandomNum(
    1000,
    9999,
  )}.${getRandomNum(10000000, 99999999)}`;
}

/**
 * 模拟请求延迟
 * @param {number} duration 延迟时间，单位毫秒
 * @returns {Promise}
 */
function delay(duration = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

/**
 * Mock请求类
 * @class MockRequest
 */
class MockRequest {
  /**
   * 模拟请求
   * @param {Object} options 配置参数
   * @param {number} options.duration 延迟时间，单位毫秒
   * @param {Object} params 请求参数
   * @returns {Promise}
   */
  mock(options = {}, params = {}) {
    const { duration = 500 } = options;
    return delay(duration).then(() => params);
  }
}

export default MockRequest;

module.exports = {
  generateMixed,
  mockIp,
  mockReqId,
  getRandomNum,
  delay,
};
