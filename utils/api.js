// api.js - 电子菜单API接口配置

// API基础URL
//测试地址
// const BASE_URL = 'http://dian.test/api/v1';
//线上地址
const BASE_URL = 'http://dian.quanyu.wang/api/v1';

// 存储token的键名
const TOKEN_KEY = 'userToken';

/**
 * 获取存储的token
 * @returns {string|null} 用户token
 */
const getToken = () => {
  return wx.getStorageSync(TOKEN_KEY) || null;
};

/**
 * 设置token到本地存储
 * @param {string} token 用户token
 */
const setToken = (token) => {
  wx.setStorageSync(TOKEN_KEY, token);
};

/**
 * 移除本地存储的token
 */
const removeToken = () => {
  wx.removeStorageSync(TOKEN_KEY);
};

/**
 * 统一请求函数
 * @param {Object} options 请求选项
 * @returns {Promise} 请求Promise
 */
const request = (options) => {
  // 合并默认选项和传入选项
  const {
    url,
    method = 'GET',
    data,
    header = {},
    loading = false
  } = options;

  // 如果需要显示加载提示
  if (loading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }

  // 构建请求头
  const requestHeader = {
    'Content-Type': 'application/json',
    ...header
  };

  // 添加token到请求头
  const token = getToken();
  if (token) {
    requestHeader.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      method,
      data,
      header: requestHeader,
      success: (res) => {
        // 请求成功，但需要检查业务状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 业务成功 - 支持不同的成功响应格式
          if (res.data.code === 0 || res.data.code === 'Success' || res.data.success === true) {
            // 打印响应数据，帮助调试
            console.log(`API请求成功: ${url}`, res.data);
            resolve(res.data);
          } else {
            // 业务失败
            console.warn(`API业务错误: ${url}`, res.data);

            // 如果返回了数据但code不是0，也返回数据而不是reject
            // 有些API可能不使用code字段，或使用不同的成功标识
            if (res.data && typeof res.data === 'object') {
              // 如果没有明确的错误提示，不显示Toast
              if (res.data.msg) {
                wx.showToast({
                  title: res.data.msg || '请求失败',
                  icon: 'none',
                  duration: 2000
                });
              }

              // 仍然resolve响应，让业务代码决定如何处理
              resolve(res.data);
            } else {
              // 如果返回的不是对象，则判定为错误
              wx.showToast({
                title: '服务器返回了错误的数据格式',
                icon: 'none',
                duration: 2000
              });
              reject(res.data);
            }
          }
        } else if (res.statusCode === 401) {
          // token失效，需要重新登录
          removeToken();
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          });
          // 跳转到登录页
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/login/index'
            });
          }, 1000);
          reject(res.data);
        } else {
          // HTTP错误
          wx.showToast({
            title: `请求错误：${res.statusCode}`,
            icon: 'none',
            duration: 2000
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        // 网络错误
        wx.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      },
      complete: () => {
        if (loading) {
          wx.hideLoading();
        }
      }
    });
  });
};

// API接口对象
const api = {
  // 用户认证相关接口
  auth: {
    // 微信登录
    wechatLogin: (code) => {
      return request({
        url: '/auth/wechat-login',
        method: 'POST',
        data: {
          code
        },
        loading: true
      });
    },
    // 绑定手机号
    bindPhone: (data) => {
      return request({
        url: '/auth/bind-phone',
        method: 'POST',
        data,
        loading: true
      });
    }
  },

  // 首页相关接口
  home: {
    // 获取首页数据
    getHomeData: () => {
      return request({
        url: '/home',
        loading: true
      });
    }
  },

  // 菜品分类相关接口
  categories: {
    // 获取分类列表
    getCategoryList: () => {
      return request({
        url: '/categories',
        loading: true
      });
    },
    // 获取分类下的菜品
    getCategoryDishes: (categoryId, page = 1, limit = 20) => {
      console.log(`请求分类菜品API: 分类ID=${categoryId}, 页码=${page}, 每页数量=${limit}`);

      return request({
        url: `/dishes`,
        data: {
          category_id: categoryId,
          categoryId: categoryId, // 提供两种可能的参数名
          page,
          limit,
          page_size: limit // 提供两种可能的参数名
        },
        success: (res) => {
          console.log('获取分类菜品成功:', res);
        },
        fail: (err) => {
          console.error('获取分类菜品失败:', err);
        }
      });
    }
  },

  // 菜品相关接口
  dishes: {
    // 搜索菜品
    searchDishes: (keyword, page = 1, limit = 20) => {
      console.log(`搜索菜品API: 关键词=${keyword}, 页码=${page}, 每页数量=${limit}`);

      return request({
        url: '/search/dishes',
        data: {
          keyword,
          page,
          limit,
          page_size: limit, // 提供两种可能的参数名
          name: keyword, // 提供多种可能的参数名
          query: keyword
        },
        success: (res) => {
          console.log('搜索菜品成功:', res);
        },
        fail: (err) => {
          console.error('搜索菜品失败:', err);
        }
      });
    },
    // 获取菜品详情
    getDishDetail: (spuId) => {
      return request({
        url: `/dishes/${spuId}`,
        loading: true
      });
    },
    // 获取推荐菜品
    getRecommendDishes: (limit = 10) => {
      return request({
        url: '/dishes/recommend',
        data: {
          limit
        }
      });
    }
  },

  // 购物车相关接口
  cart: {
    // 获取购物车列表
    getCartList: () => {
      return request({
        url: '/cart',
        loading: true
      });
    },
    // 添加商品到购物车
    addToCart: (data) => {
      return request({
        url: '/cart/add',
        method: 'POST',
        data,
        loading: true
      });
    },
    // 更新购物车商品数量
    updateCartItem: (data) => {
      return request({
        url: '/cart/update',
        method: 'PUT',
        data,
        loading: true
      });
    },
    // 移除购物车商品
    removeCartItem: (skuIds) => {
      return request({
        url: '/cart/remove',
        method: 'POST',
        data: {
          skuIds
        },
        loading: true
      });
    },
    // 清空购物车
    clearCart: () => {
      return request({
        url: '/cart/clear',
        method: 'POST',
        loading: true
      });
    },
    // 选择购物车商品
    selectCartItems: (data) => {
      return request({
        url: '/cart/select',
        method: 'PUT',
        data,
        loading: true
      });
    }
  },

  // 订单相关接口
  order: {
    // 结算订单
    settleOrder: (data) => {
      return request({
        url: '/order/settle',
        method: 'POST',
        data,
        loading: true
      });
    },
    // 创建订单
    createOrder: (data) => {
      return request({
        url: '/order/create',
        method: 'POST',
        data,
        loading: true
      });
    },
    // 获取订单列表
    getOrderList: (status, page = 1, limit = 10) => {
      return request({
        url: '/orders',
        data: {
          status,
          page,
          limit
        },
        loading: true
      });
    },
    // 获取订单详情
    getOrderDetail: (orderNo) => {
      return request({
        url: `/orders/${orderNo}`,
        loading: true
      });
    },
    // 取消订单
    cancelOrder: (orderNo, reason) => {
      return request({
        url: `/orders/${orderNo}/cancel`,
        method: 'POST',
        data: {
          reason
        },
        loading: true
      });
    }
  },

  // 评价相关接口
  comments: {
    // 提交评价
    submitComment: (data) => {
      return request({
        url: '/comments',
        method: 'POST',
        data,
        loading: true
      });
    },
    // 获取菜品评价列表
    getDishComments: (spuId, options = {}) => {
      const {
        page = 1, page_size = 10, filter_type = 'all'
      } = options;
      return request({
        url: `/dishes/${spuId}/comments`,
        data: {
          page,
          page_size,
          filter_type
        }
      });
    },
    // 获取用户评论列表
    getUserComments: (page = 1, per_page = 10) => {
      return request({
        url: '/comments',
        data: {
          page,
          per_page
        }
      });
    }
  },

  // 用户信息相关接口
  user: {
    // 获取用户信息
    getUserInfo: () => {
      return request({
        url: '/user/info',
        loading: true
      });
    },
    // 更新用户信息
    updateUserInfo: (data) => {
      return request({
        url: '/user/info',
        method: 'PUT',
        data,
        loading: true
      });
    }
  },

  // 系统配置相关接口
  system: {
    // 获取店铺信息
    getShopInfo: () => {
      return request({
        url: '/system/shop-info',
        loading: true
      });
    },
    // 获取微信支付配置
    getWxPayConfig: (orderNo) => {
      return request({
        url: '/system/wx-pay-config',
        data: {
          orderNo
        },
        loading: true
      });
    }
  }
};

module.exports = {
  api,
  getToken,
  setToken,
  removeToken,
  BASE_URL
};