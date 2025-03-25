import { dishes, getDishById, getDishesByCategory, getRecommendedDishes, getNewDishes, getAllDishes, DISH_CATEGORIES } from '../../model/dish';
import { config } from '../../config/index';
import { delay } from '../../utils/mock';
import { api } from '../../utils/api';

// 基础菜品图片列表
const dishImages = [
  'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-08a.png',
  'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
  'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-10a.png',
  'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-11a.png',
  'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-12a.png'
];

// 基础mock菜品数据
const mockDishes = {
  '1': [ // 热销菜品
    {
      id: 'mock_1_1',
      title: '宫保鸡丁',
      price: 3800,
      originalPrice: 4200,
      primaryImage: dishImages[0],
      description: '选用嫩鸡肉，配以花生、干辣椒，香辣可口',
      tags: ['招牌', '微辣'],
      soldNum: 583,
      categoryId: '1'
    },
    {
      id: 'mock_1_2',
      title: '红烧肉',
      price: 4800,
      originalPrice: 5200,
      primaryImage: dishImages[1],
      description: '选用五花肉，红烧入味，肥而不腻',
      tags: ['热销', '特色'],
      soldNum: 472,
      categoryId: '1'
    },
    {
      id: 'mock_1_3',
      title: '水煮鱼',
      price: 5800,
      originalPrice: 6200,
      primaryImage: dishImages[2],
      description: '新鲜鱼肉，麻辣鲜香，辣而不燥，味美鲜香',
      tags: ['特色', '麻辣'],
      soldNum: 388,
      categoryId: '1'
    },
    {
      id: 'mock_1_4',
      title: '糖醋里脊',
      price: 4200,
      originalPrice: 4600,
      primaryImage: dishImages[3],
      description: '外酥里嫩，酸甜可口，经典传统名菜',
      tags: ['经典', '酸甜'],
      soldNum: 426,
      categoryId: '1'
    },
    {
      id: 'mock_1_5',
      title: '干锅牛蛙',
      price: 6800,
      originalPrice: 7200,
      primaryImage: dishImages[4],
      description: '新鲜牛蛙，配以特制香料，鲜嫩可口',
      tags: ['特色', '美味'],
      soldNum: 319,
      categoryId: '1'
    },
    {
      id: 'mock_1_6',
      title: '青椒炒肉',
      price: 3600,
      originalPrice: 3800,
      primaryImage: dishImages[0],
      description: '鲜嫩猪肉搭配青椒，下饭首选',
      tags: ['家常', '下饭'],
      soldNum: 462,
      categoryId: '1'
    },
    {
      id: 'mock_1_7',
      title: '蒜蓉蒸虾',
      price: 7800,
      originalPrice: 8800,
      primaryImage: dishImages[1],
      description: '新鲜大虾，蒜香四溢，回味无穷',
      tags: ['海鲜', '蒜香'],
      soldNum: 298,
      categoryId: '1'
    }
  ],
  '2': [ // 超值套餐
    {
      id: 'mock_2_1',
      title: '经典双人套餐',
      price: 9800,
      originalPrice: 10800,
      primaryImage: dishImages[2],
      description: '含红烧肉、宫保鸡丁、番茄蛋汤、米饭两份',
      tags: ['套餐', '热销'],
      soldNum: 356,
      categoryId: '2'
    }
  ],
  '3': [ // 主食
    {
      id: 'mock_3_1',
      title: '米饭',
      price: 200,
      originalPrice: 0,
      primaryImage: dishImages[3],
      description: '香软可口的白米饭',
      tags: ['主食'],
      soldNum: 1023,
      categoryId: '3'
    },
    {
      id: 'mock_3_2',
      title: '手工面条',
      price: 1500,
      originalPrice: 1800,
      primaryImage: dishImages[4],
      description: '现做手工面条，筋道爽滑',
      tags: ['主食', '手工'],
      soldNum: 284,
      categoryId: '3'
    }
  ],
  '4': [ // 小吃零食
    {
      id: 'mock_4_1',
      title: '盐酥鸡',
      price: 2800,
      originalPrice: 3200,
      primaryImage: dishImages[0],
      description: '外酥里嫩，香气四溢',
      tags: ['小吃', '热销'],
      soldNum: 421,
      categoryId: '4'
    }
  ],
  '5': [ // 热菜
    {
      id: 'mock_5_1',
      title: '麻婆豆腐',
      price: 3200,
      originalPrice: 3600,
      primaryImage: dishImages[1],
      description: '四川名菜，麻辣鲜香',
      tags: ['川菜', '麻辣'],
      soldNum: 376,
      categoryId: '5'
    },
    {
      id: 'mock_5_2',
      title: '鱼香肉丝',
      price: 3500,
      originalPrice: 3800,
      primaryImage: dishImages[2],
      description: '酸甜可口，下饭神器',
      tags: ['川菜', '酸甜'],
      soldNum: 293,
      categoryId: '5'
    }
  ],
  '6': [ // 凉菜
    {
      id: 'mock_6_1',
      title: '凉拌黄瓜',
      price: 1800,
      originalPrice: 2000,
      primaryImage: dishImages[3],
      description: '爽口开胃，清新可口',
      tags: ['凉菜', '开胃'],
      soldNum: 178,
      categoryId: '6'
    }
  ],
  '7': [ // 汤类
    {
      id: 'mock_7_1',
      title: '番茄蛋汤',
      price: 1500,
      originalPrice: 1800,
      primaryImage: dishImages[4],
      description: '酸甜可口，营养丰富',
      tags: ['汤类', '家常'],
      soldNum: 245,
      categoryId: '7'
    }
  ],
  '8': [ // 饮品
    {
      id: 'mock_8_1',
      title: '柠檬茶',
      price: 1200,
      originalPrice: 1500,
      primaryImage: dishImages[0],
      description: '清爽解腻，酸甜可口',
      tags: ['饮品', '冷饮'],
      soldNum: 387,
      categoryId: '8'
    }
  ],
  '9': [ // 酒水
    {
      id: 'mock_9_1',
      title: '青岛啤酒',
      price: 800,
      originalPrice: 1000,
      primaryImage: dishImages[1],
      description: '清爽怡人，冰镇更佳',
      tags: ['啤酒', '冰镇'],
      soldNum: 423,
      categoryId: '9'
    }
  ],
  '10': [ // 甜点
    {
      id: 'mock_10_1',
      title: '芒果布丁',
      price: 1800,
      originalPrice: 2000,
      primaryImage: dishImages[2],
      description: '香甜细腻，口感丰富',
      tags: ['甜点', '新品'],
      soldNum: 198,
      categoryId: '10'
    }
  ]
};

// 所有mock菜品的扁平数组，用于推荐菜品等场景
const allMockDishes = Object.values(mockDishes).reduce((acc, cur) => acc.concat(cur), []);

/**
 * 模拟获取所有菜品
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回菜品数据
 */
const mockFetchDishes = (params = {}) => {
  return delay(300).then(() => {
    // 从dish.js获取所有菜品数据
    let dishList = getAllDishes().map(dish => {
      return {
        ...dish,
        thumb: dish.primaryImage,
        title: dish.title,
        price: dish.price,
        originPrice: dish.originalPrice,
        tags: dish.tasteTypes || [],
      };
    });
    
    // 如果没有菜品数据，使用mock数据
    if (!dishList || dishList.length === 0) {
      dishList = allMockDishes.map(dish => ({
        ...dish,
        thumb: dish.primaryImage
      }));
    }
    
    return {
      spuList: dishList,
      totalCount: dishList.length,
    };
  });
};

/**
 * 获取所有菜品
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回菜品数据
 */
export function fetchDishes(params = {}) {
  if (config.useMock) {
    return mockFetchDishes(params);
  }
  return Promise.resolve({
    spuList: [],
    totalCount: 0,
  });
}

/**
 * 获取菜品分类数据
 * @returns {Promise<Array>} 菜品分类数组
 */
export function fetchDishCategories() {
  // 根据config.useMock决定使用mock数据还是真实API
  if (config.useMock) {
    // 使用mock数据
    return delay(500).then(() => {
      // 返回本地mock分类数据
      return {
        code: 'Success',
        data: DISH_CATEGORIES
      };
    });
  } else {
    // 使用真实API
    return api.categories.getCategoryList()
      .then(res => {
        return {
          code: 'Success',
          data: res.data || []
        };
      })
      .catch(err => {
        console.error('获取菜品分类失败:', err);
        return {
          code: 'Error',
          data: [],
          msg: err.msg || '获取菜品分类失败'
        };
      });
  }
}

/**
 * 根据分类获取菜品数据
 * @param {string} categoryId 分类ID
 * @param {Object} options 选项参数
 * @returns {Promise<Object>} 菜品列表数据
 */
export function fetchDishesByCategory(categoryId, options = {}) {
  const { page = 1, pageSize = 20 } = options;
  
  if (config.useMock) {
    // 使用mock数据
    return delay(config.mockFetchDishesList.duration).then(() => {
      const allDishes = getDishesByCategory(categoryId);
      const dishes = allDishes ? allDishes.slice(0, 10) : [];
      
      return {
        code: 'Success',
        data: {
          spuList: dishes,
          totalCount: dishes.length,
          pageSize: pageSize,
          currentPage: page
        },
      };
    });
  } else {
    // 使用真实API
    return api.categories.getCategoryDishes(categoryId, page, pageSize)
      .then(res => {
        return {
          code: 'Success',
          data: {
            spuList: res.data.dishes || [],
            totalCount: res.data.total || 0,
            pageSize: pageSize,
            currentPage: page
          }
        };
      })
      .catch(err => {
        console.error(`获取分类(${categoryId})菜品失败:`, err);
        return {
          code: 'Error',
          data: {
            spuList: [],
            totalCount: 0,
            pageSize: pageSize,
            currentPage: page
          },
          msg: err.msg || '获取分类菜品失败'
        };
      });
  }
}

/**
 * 获取菜品详情
 * @param {string} dishId 菜品ID
 * @returns {Promise<Object>} 菜品详情数据
 */
export function fetchDishDetail(dishId) {
  if (config.useMock) {
    // 使用mock数据
    return delay(config.mockFetchDishDetail.duration).then(() => {
      const dish = getDishById(dishId);
      return dish;
    });
  } else {
    // 使用真实API
    return api.dishes.getDishDetail(dishId)
      .then(res => {
        return res.data || null;
      })
      .catch(err => {
        console.error(`获取菜品(${dishId})详情失败:`, err);
        return null;
      });
  }
}

/**
 * 获取推荐菜品
 * @param {number} limit 限制数量
 * @returns {Promise<Object>} 推荐菜品数据
 */
export function fetchRecommendDishes(limit = 10) {
  if (config.useMock) {
    // 使用mock数据
    return delay(1000).then(() => {
      const dishes = getRecommendedDishes().slice(0, limit);
      return {
        code: 'Success',
        data: {
          spuList: dishes,
          totalCount: dishes.length
        }
      };
    });
  } else {
    // 使用真实API
    return api.dishes.getRecommendDishes(limit)
      .then(res => {
        return {
          code: 'Success',
          data: {
            spuList: res.data.dishes || [],
            totalCount: res.data.total || 0
          }
        };
      })
      .catch(err => {
        console.error('获取推荐菜品失败:', err);
        return {
          code: 'Error',
          data: {
            spuList: [],
            totalCount: 0
          },
          msg: err.msg || '获取推荐菜品失败'
        };
      });
  }
}

/**
 * 搜索菜品
 * @param {string} keyword 搜索关键词
 * @param {Object} options 选项参数
 * @returns {Promise<Object>} 搜索结果
 */
export function searchDishes(keyword, options = {}) {
  const { page = 1, pageSize = 20 } = options;
  
  if (config.useMock) {
    // 使用mock数据
    return delay(800).then(() => {
      // 简单模拟搜索，实际场景会更复杂
      const allDishes = getAllDishes();
      const filtered = keyword
        ? allDishes.filter(d => d.title.includes(keyword) || d.description.includes(keyword))
        : allDishes;
      
      const dishes = filtered.slice(0, pageSize);
      
      return {
        code: 'Success',
        data: {
          spuList: dishes,
          totalCount: filtered.length,
          pageSize: pageSize,
          currentPage: page
        }
      };
    });
  } else {
    // 使用真实API
    return api.dishes.searchDishes(keyword, page, pageSize)
      .then(res => {
        return {
          code: 'Success',
          data: {
            spuList: res.data.dishes || [],
            totalCount: res.data.total || 0,
            pageSize: pageSize,
            currentPage: page
          }
        };
      })
      .catch(err => {
        console.error(`搜索菜品(${keyword})失败:`, err);
        return {
          code: 'Error',
          data: {
            spuList: [],
            totalCount: 0,
            pageSize: pageSize,
            currentPage: page
          },
          msg: err.msg || '搜索菜品失败'
        };
      });
  }
}

/**
 * 获取新品菜品
 * @param {number} limit 限制数量
 * @returns {Promise<Object>} 新品菜品数据
 */
export function fetchNewDishes(limit = 10) {
  if (config.useMock) {
    // 使用mock数据
    return delay(800).then(() => {
      const dishes = getNewDishes().slice(0, limit);
      return {
        code: 'Success',
        data: {
          spuList: dishes,
          totalCount: dishes.length
        }
      };
    });
  } else {
    // 使用真实API - 如果API中没有专门的新品接口，可以使用推荐接口或其他接口替代
    return api.dishes.getRecommendDishes(limit)
      .then(res => {
        return {
          code: 'Success',
          data: {
            spuList: res.data.dishes || [],
            totalCount: res.data.total || 0
          }
        };
      })
      .catch(err => {
        console.error('获取新品菜品失败:', err);
        return {
          code: 'Error',
          data: {
            spuList: [],
            totalCount: 0
          },
          msg: err.msg || '获取新品菜品失败'
        };
      });
  }
}

export {
  mockFetchDishes,
};