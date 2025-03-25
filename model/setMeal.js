import { cdnBase } from '../config/index';
import { DISH_CATEGORIES } from './dish';
const imgPrefix = cdnBase;

// 套餐类型
const SET_MEAL_TYPE = {
  SINGLE: 'single',     // 单人套餐
  COUPLE: 'couple',     // 双人套餐
  FAMILY: 'family',     // 家庭套餐
  BUSINESS: 'business', // 商务套餐
  SPECIAL: 'special',   // 特色套餐
};

// 套餐数据
const setMeals = [
  {
    id: 'SM001',
    title: '川味单人套餐',
    subtitle: '正宗川味，麻辣过瘾',
    type: SET_MEAL_TYPE.SINGLE,
    primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-08a.png',
    images: [
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-08a.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-08b.png',
    ],
    price: 8800,              // 88元
    originalPrice: 10500,     // 原价105元
    soldNum: 352,             // 已售数量
    spicyLevel: 3,            // 辣度等级（1-5）
    isRecommended: true,      // 是否推荐
    isNewDish: false,         // 是否新品
    description: '川味单人套餐包含麻婆豆腐、宫保鸡丁、米饭和饮料，麻辣鲜香，一人独享，经济实惠。',
    dishes: [
      {
        dishId: '1',          // 对应dish.js中的菜品ID
        quantity: 1,          // 数量
        remarks: '标准辣度'    // 备注
      },
      {
        dishId: '2',
        quantity: 1,
        remarks: '少放花生'
      },
      {
        dishId: '10',         // 假设10是米饭
        quantity: 1,
        remarks: ''
      },
      {
        dishId: '15',         // 假设15是可乐
        quantity: 1,
        remarks: '加冰'
      }
    ],
    tags: ['川菜', '单人套餐', '实惠'],
    categoryId: DISH_CATEGORIES.SET_MEAL,
    discountInfo: {
      discountRate: 0.84,     // 折扣率
      discountDescription: '限时8.4折优惠',
    },
    nutrition: {              // 营养信息
      calories: 850,          // 卡路里
      protein: 45,            // 蛋白质(克)
      carbs: 120,             // 碳水(克)
      fat: 28                 // 脂肪(克)
    },
  },
  {
    id: 'SM002',
    title: '粤式双人套餐',
    subtitle: '鲜香可口，滋味独特',
    type: SET_MEAL_TYPE.COUPLE,
    primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-10a.png',
    images: [
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-10a.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-10b.png',
    ],
    price: 16800,            // 168元
    originalPrice: 19800,    // 原价198元
    soldNum: 186,            // 已售数量
    spicyLevel: 1,           // 辣度等级（1-5）
    isRecommended: true,     // 是否推荐
    isNewDish: false,        // 是否新品
    description: '粤式双人套餐包含白切鸡、清蒸鱼、蔬菜、米饭和饮料，鲜香可口，荤素搭配，适合两人分享。',
    dishes: [
      {
        dishId: '6',         // 假设6是白切鸡
        quantity: 1,
        remarks: '标准份量'
      },
      {
        dishId: '7',         // 假设7是清蒸鱼
        quantity: 1,
        remarks: '不要葱姜'
      },
      {
        dishId: '4',         // 蔬菜沙拉
        quantity: 1,
        remarks: '千岛酱'
      },
      {
        dishId: '10',        // 米饭
        quantity: 2,
        remarks: ''
      },
      {
        dishId: '16',        // 假设16是茶水
        quantity: 2,
        remarks: ''
      }
    ],
    tags: ['粤菜', '双人套餐', '优惠'],
    categoryId: DISH_CATEGORIES.SET_MEAL,
    discountInfo: {
      discountRate: 0.85,    // 折扣率
      discountDescription: '限时8.5折',
    },
    nutrition: {             // 营养信息
      calories: 1650,        // 卡路里
      protein: 85,           // 蛋白质(克)
      carbs: 220,            // 碳水(克)
      fat: 45                // 脂肪(克)
    },
  },
  {
    id: 'SM003',
    title: '家庭聚餐套餐',
    subtitle: '丰盛美味，适合全家享用',
    type: SET_MEAL_TYPE.FAMILY,
    primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
    images: [
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
    ],
    price: 29800,           // 298元
    originalPrice: 35800,   // 原价358元
    soldNum: 95,            // 已售数量
    spicyLevel: 2,          // 辣度等级（1-5）
    isRecommended: true,    // 是否推荐
    isNewDish: true,        // 是否新品
    description: '家庭聚餐套餐包含麻婆豆腐、宫保鸡丁、水煮鱼片、蔬菜沙拉、小笼包等多种菜品，丰盛美味，适合3-5人享用。',
    dishes: [
      {
        dishId: '1',        // 麻婆豆腐
        quantity: 1,
        remarks: '微辣'
      },
      {
        dishId: '2',        // 宫保鸡丁
        quantity: 1,
        remarks: ''
      },
      {
        dishId: '3',        // 水煮鱼片
        quantity: 1,
        remarks: '中辣'
      },
      {
        dishId: '4',        // 蔬菜沙拉
        quantity: 1,
        remarks: '油醋汁'
      },
      {
        dishId: '5',        // 小笼包
        quantity: 2,
        remarks: '8个装'
      },
      {
        dishId: '10',       // 米饭
        quantity: 5,
        remarks: ''
      },
      {
        dishId: '15',       // 可乐
        quantity: 3,
        remarks: ''
      },
      {
        dishId: '17',       // 假设17是果汁
        quantity: 2,
        remarks: ''
      }
    ],
    tags: ['家庭套餐', '丰盛', '特惠'],
    categoryId: DISH_CATEGORIES.SET_MEAL,
    discountInfo: {
      discountRate: 0.83,   // 折扣率
      discountDescription: '家庭特惠8.3折',
    },
    nutrition: {            // 营养信息（整个套餐）
      calories: 3200,       // 卡路里
      protein: 160,         // 蛋白质(克)
      carbs: 450,           // 碳水(克)
      fat: 105              // 脂肪(克)
    },
  },
  {
    id: 'SM004',
    title: '商务宴请套餐',
    subtitle: '格调高雅，宾客满意',
    type: SET_MEAL_TYPE.BUSINESS,
    primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/molto-2.png',
    images: [
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/molto-2.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/molto-3.png',
    ],
    price: 58800,          // 588元
    originalPrice: 68800,  // 原价688元
    soldNum: 43,           // 已售数量
    spicyLevel: 2,         // 辣度等级（1-5）
    isRecommended: false,  // 是否推荐
    isNewDish: false,      // 是否新品
    description: '商务宴请套餐包含多道精致冷热菜、主食和饮品，格调高雅，色香味俱全，适合商务宴请，可供6-8人享用。',
    dishes: [
      // 此处略去详细菜品列表，实际应包含8-10道菜
      {
        dishId: '20',      // 假设是某道高档冷菜
        quantity: 2,
        remarks: ''
      },
      {
        dishId: '21',      // 假设是某道高档热菜
        quantity: 3,
        remarks: ''
      },
      // 其他菜品...
    ],
    tags: ['商务套餐', '高档', '多人'],
    categoryId: DISH_CATEGORIES.SET_MEAL,
    discountInfo: {
      discountRate: 0.85,  // 折扣率
      discountDescription: '商务特惠8.5折',
    }
  }
];

/**
 * 获取所有套餐
 * @returns 所有套餐信息
 */
export function getAllSetMeals() {
  return setMeals;
}

/**
 * 根据ID获取套餐
 * @param {string} id 套餐ID
 * @returns 套餐信息
 */
export function getSetMealById(id) {
  return setMeals.find(meal => meal.id === id);
}

/**
 * 根据类型获取套餐
 * @param {string} type 套餐类型
 * @returns 指定类型的套餐列表
 */
export function getSetMealsByType(type) {
  return setMeals.filter(meal => meal.type === type);
}

/**
 * 获取推荐套餐
 * @returns 推荐套餐列表
 */
export function getRecommendedSetMeals() {
  return setMeals.filter(meal => meal.isRecommended);
}

// 导出套餐类型常量
export const SET_MEAL_TYPES = SET_MEAL_TYPE; 