import { config } from '../../config/index';

/** 获取所有套餐 */
function mockFetchAllSetMeals() {
  const { delay } = require('../_utils/delay');
  const { getAllSetMeals } = require('../../model/setMeal');
  return delay().then(() => getAllSetMeals());
}

/** 获取所有套餐 */
export function fetchAllSetMeals() {
  if (config.useMock) {
    return mockFetchAllSetMeals();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 根据ID获取套餐 */
function mockFetchSetMealById(id) {
  const { delay } = require('../_utils/delay');
  const { getSetMealById } = require('../../model/setMeal');
  return delay().then(() => getSetMealById(id));
}

/** 根据ID获取套餐 */
export function fetchSetMealById(id) {
  if (config.useMock) {
    return mockFetchSetMealById(id);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 根据类型获取套餐 */
function mockFetchSetMealsByType(type) {
  const { delay } = require('../_utils/delay');
  const { getSetMealsByType } = require('../../model/setMeal');
  return delay().then(() => getSetMealsByType(type));
}

/** 根据类型获取套餐 */
export function fetchSetMealsByType(type) {
  if (config.useMock) {
    return mockFetchSetMealsByType(type);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取推荐套餐 */
function mockFetchRecommendedSetMeals() {
  const { delay } = require('../_utils/delay');
  const { getRecommendedSetMeals } = require('../../model/setMeal');
  return delay().then(() => 
    getRecommendedSetMeals().map((item) => {
      return {
        id: item.id,
        thumb: item.primaryImage,
        title: item.title,
        subtitle: item.subtitle,
        price: item.price,
        originPrice: item.originalPrice,
        tags: [
          ...(item.isRecommended ? ['推荐'] : []),
          ...(item.isNewDish ? ['新品'] : []),
          ...(item.spicyLevel > 0 ? [`辣度${item.spicyLevel}`] : []),
          ...(item.type ? [item.type] : []),
        ],
        type: item.type,
        discountInfo: item.discountInfo,
      };
    })
  );
}

/** 获取推荐套餐 */
export function fetchRecommendedSetMeals() {
  if (config.useMock) {
    return mockFetchRecommendedSetMeals();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
} 