import { cdnBase } from '../config/index';
import { getAllDishes as getRealDishes, DISH_CATEGORIES as REAL_DISH_CATEGORIES } from './real-dishes';
const imgPrefix = cdnBase;

// 默认菜品详情图片
const defaultDesc = [`${imgPrefix}/goods/details-1.png`];

// 菜品分类ID定义
const CATEGORY = {
  POPULAR: '1',          // 热销菜品
  SET_MEAL: '2',         // 超值套餐
  STAPLE_FOOD: '3',      // 主食
  SNACK: '4',            // 小吃零食
  HOT_DISH: '5',         // 热菜
  COLD_DISH: '6',        // 凉菜
  SOUP: '7',             // 汤类
  DRINK: '8',            // 饮品
  WINE: '9',             // 酒水
  DESSERT: '10',         // 甜点
  SPECIAL: '5',          // 特色菜（对应热菜）
};

// 口味类型
const TASTE_TYPES = [
  '麻辣', '酸辣', '香辣', '清淡', '咸鲜', '酸甜', '五香', '鲜香', '浓郁', '酱香', '鱼香'
];

// 合并real-dishes.js中的真实菜品数据
const realDishes = getRealDishes();

// 为真实菜品添加规格和SKU信息
const enhancedRealDishes = realDishes.map(dish => {
  return {
    ...dish,
    // 添加规格信息
    specList: dish.specList || [
      {
        specId: '10011',
        title: '份量',
        specValueList: [
          {
            specValueId: '10012',
            specId: null,
            saasId: null,
            specValue: '小份',
            image: null,
          },
          {
            specValueId: '10013',
            specId: null,
            saasId: null,
            specValue: '中份',
            image: null,
          },
          {
            specValueId: '10014',
            specId: null,
            saasId: null,
            specValue: '大份',
            image: null,
          },
        ],
      },
      // 针对辣度高的菜品添加辣度选择
      ...(dish.spicyLevel > 1 ? [{
        specId: '20011',
        title: '辣度',
        specValueList: [
          {
            specValueId: '20012',
            specId: null,
            saasId: null,
            specValue: '不辣',
            image: null,
          },
          {
            specValueId: '20013',
            specId: null,
            saasId: null,
            specValue: '微辣',
            image: null,
          },
          {
            specValueId: '20014',
            specId: null,
            saasId: null,
            specValue: '中辣',
            image: null,
          },
          {
            specValueId: '20015',
            specId: null,
            saasId: null,
            specValue: '特辣',
            image: null,
          },
        ],
      }] : []),
    ],
    // 添加SKU信息
    skuList: dish.skuList || [
      {
        skuId: `${dish.spuId}0001`,
        skuImage: dish.primaryImage,
        specInfo: [
          {
            specId: '10011',
            specTitle: null,
            specValueId: '10013',
            specValue: '中份',
          },
          ...(dish.spicyLevel > 1 ? [{
            specId: '20011',
            specTitle: null,
            specValueId: '20014',
            specValue: '中辣',
          }] : []),
        ],
        priceInfo: [
          { priceType: 1, price: dish.price.toString(), priceTypeName: '现价' },
          { priceType: 2, price: dish.originalPrice.toString(), priceTypeName: '原价' },
        ],
        stockInfo: {
          stockQuantity: dish.spuStockQuantity || 100,
          safeStockQuantity: 10,
          soldQuantity: dish.soldNum || 0,
        }
      },
    ],
  };
});

// 保留原有菜品数据作为备份
const originalDishes = [
  // 这里是原有的allDishes数组内容
  // 为了节省篇幅，只保留数据结构而不保留具体内容
];

// 合并菜品数据，优先使用真实菜品数据
const allDishes = enhancedRealDishes.length > 0 ? enhancedRealDishes : originalDishes;

/**
 * 根据ID生成菜品数据
 * @param {string} id
 * @param {number} [available] 库存, 默认1
 */
export function genDish(id, available = 1) {
  // 在真实菜品中查找
  const dish = allDishes.find(dish => dish.spuId === id);
  if (dish) return { ...dish, available };
  
  // 如果没找到，从数组中取模获取菜品
  const index = parseInt(id) % allDishes.length;
  const item = allDishes[index];
  
  return {
    ...item,
    spuId: `${id}`,
    available: available,
    desc: item?.desc || defaultDesc,
    images: item?.images || [item?.primaryImage],
  };
}

/**
 * 获取菜品列表
 * @param {string} categoryId 分类ID
 * @param {number} pageIndex 页码
 * @param {number} pageSize 每页条数
 * @returns 菜品列表
 */
export function getDishList(categoryId = '', pageIndex = 1, pageSize = 20) {
  let dishes = [...allDishes];
  
  // 如果指定了分类，进行过滤
  if (categoryId) {
    dishes = dishes.filter(dish => dish.categoryIds.includes(categoryId));
  }
  
  // 计算分页
  const start = (pageIndex - 1) * pageSize;
  const end = start + pageSize;
  
  return dishes.slice(start, end).map((dish, index) => {
    return {
      ...dish,
      spuId: dish.spuId || `${start + index + 1}`,
    };
  });
}

/**
 * 根据分类ID获取菜品
 * @param {String} categoryId - 分类ID或者分类名称
 * @returns {Array} - 菜品数组
 */
export function getDishesByCategory(categoryId) {
  if (!categoryId) return [];
  
  // 将categoryId转为字符串处理
  const catId = String(categoryId);
  
  // 处理可能包含前缀的分类ID，如"category_3"
  let processedCatId = catId;
  if (catId.startsWith('category_')) {
    const match = catId.match(/category_(\d+)/);
    if (match && match[1]) {
      processedCatId = match[1];
    }
  }
  
  // 如果直接使用的是分类名称（如"冷菜"），则转换为对应的分类ID
  let targetCategoryId = processedCatId;
  if (Object.values(CATEGORY).indexOf(processedCatId) === -1) {
    // 使用分类名做映射
    const categoryMap = {
      '热销菜品': CATEGORY.POPULAR,
      '超值套餐': CATEGORY.SET_MEAL,
      '冷菜': CATEGORY.COLD_DISH,
      '热菜': CATEGORY.HOT_DISH,
      '汤类': CATEGORY.SOUP,
      '主食': CATEGORY.STAPLE_FOOD,
      '小吃': CATEGORY.SNACK,
      '小吃零食': CATEGORY.SNACK,
      '甜品': CATEGORY.DESSERT,
      '饮品': CATEGORY.DRINK,
      '饮料': CATEGORY.DRINK,
      '酒水': CATEGORY.WINE,
      '特色菜': CATEGORY.SPECIAL,
      '套餐': CATEGORY.SET_MEAL
    };
    
    targetCategoryId = categoryMap[processedCatId] || processedCatId;
  }
  
  console.log('最终使用的分类ID:', targetCategoryId);
  
  // 过滤菜品数据
  return allDishes.filter(dish => dish.categoryIds.includes(targetCategoryId));
}

// 导出分类常量
export const DISH_CATEGORIES = CATEGORY;

// 导出所有菜品
export const dishList = allDishes;
export const dishes = allDishes; // 添加别名以保持兼容性

/**
 * 根据ID获取菜品详情
 * @param {String} id - 菜品ID
 * @returns {Object|null} 菜品详情或null
 */
export function getDishById(id) {
  if (!id) return null;
  return allDishes.find(dish => dish.spuId === String(id)) || null;
}

/**
 * 获取推荐菜品
 * @returns {Array} 推荐菜品数组
 */
export function getRecommendedDishes() {
  return allDishes.filter(dish => dish.isRecommended);
}

/**
 * 获取新品菜品
 * @returns {Array} 新品菜品数组
 */
export function getNewDishes() {
  return allDishes.filter(dish => dish.isNewDish);
}

/**
 * 获取所有菜品数据
 * @returns {Array} 所有菜品数组
 */
export function getAllDishes() {
  return allDishes;
} 