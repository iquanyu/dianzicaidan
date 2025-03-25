import { config } from '../../config/index';
import { getAllDishes, DISH_CATEGORIES } from '../../model/dish';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取菜品列表 */
function mockFetchDishList(pageIndex = 1, pageSize = 20, categoryIndex = 0) {
  const { delay } = require('../_utils/delay');
  
  // 调试入参
  console.log('==== fetchDishList调用 ====');
  console.log('原始入参 - 页码:', pageIndex, '每页数量:', pageSize, '分类索引:', categoryIndex);
  
  return delay().then(() => {
    // 从所有菜品中获取分页数据
    const allDishes = getAllDishes();
    
    // 确保categoryIndex是数字类型
    const safeIndex = typeof categoryIndex === 'number' ? categoryIndex : Number(categoryIndex) || 0;
    
    console.log('处理后的分类索引:', safeIndex);
    
    // 根据分类索引获取对应的菜品
    let filteredDishes = allDishes;
    
    // 根据分类索引获取对应的分类ID
    const categoryMapping = {
      0: DISH_CATEGORIES.POPULAR,    // 热门菜品
      1: DISH_CATEGORIES.STAPLE_FOOD, // 主食
      2: DISH_CATEGORIES.HOT_DISH,   // 热菜 
      3: DISH_CATEGORIES.COLD_DISH,  // 凉菜
    };
    
    // 获取当前分类ID，确保安全访问
    const categoryId = categoryMapping[safeIndex];
    console.log('当前分类ID:', categoryId, 'DISH_CATEGORIES:', DISH_CATEGORIES);
    
    // 根据分类ID过滤菜品
    if (safeIndex > 0 && categoryId) {
      console.log('过滤前菜品数量:', filteredDishes.length);
      
      // 正常过滤所有分类
      filteredDishes = allDishes.filter(dish => 
        dish.categoryIds && dish.categoryIds.includes(categoryId)
      );
      
      console.log('过滤后菜品数量:', filteredDishes.length);
    } else if (safeIndex === 0) {
      // 对于热门菜品（索引0），使用isRecommended属性过滤
      filteredDishes = allDishes.filter(dish => dish.isRecommended === true);
      console.log('热门菜品数量:', filteredDishes.length);
    }
    
    // 如果过滤后没有菜品或菜品太少，确保每个分类都有展示内容
    if (filteredDishes.length < 2) {
      console.log('当前分类菜品太少，添加一些随机菜品');
      
      // 为不同分类准备一些备选菜品
      let additionalDishes = [];
      
      // 根据不同分类选择不同的备选菜品
      switch(safeIndex) {
        case 1: // 主食
          additionalDishes = allDishes.filter(d => 
            d.title.includes('饭') || 
            d.title.includes('面') || 
            d.title.includes('包') || 
            d.title.includes('粥')
          );
          break;
        case 2: // 热菜
          additionalDishes = allDishes.filter(d => 
            d.spicyLevel && d.spicyLevel > 2
          );
          break;
        case 3: // 凉菜
          additionalDishes = allDishes.filter(d => 
            d.title.includes('凉') || 
            d.title.includes('沙拉')
          );
          break;
        default:
          // 默认添加前3个菜品作为备选
          additionalDishes = allDishes.slice(0, 3);
      }
      
      // 如果备选菜品也不足，则使用所有菜品的前几个
      if (additionalDishes.length < 2) {
        additionalDishes = allDishes.slice(0, 3);
      }
      
      // 合并原有菜品和备选菜品
      filteredDishes = [...filteredDishes, ...additionalDishes];
      
      // 去重
      const dishIds = new Set();
      filteredDishes = filteredDishes.filter(dish => {
        if (dishIds.has(dish.spuId)) return false;
        dishIds.add(dish.spuId);
        return true;
      });
      
      console.log('添加备选菜品后数量:', filteredDishes.length);
    }
    
    // 分页处理
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDishes = filteredDishes.slice(startIndex, endIndex);
    
    console.log('返回菜品数量:', paginatedDishes.length);
    
    return paginatedDishes.map((item) => {
      // 获取标签，优先使用tags，如果没有则使用tasteTypes
      const tags = item.tags || item.tasteTypes || [];
      // 添加一些常见的标签，如辣度、烹饪时间等
      const additionalTags = [];
      
      if (item.spicyLevel && item.spicyLevel > 0) {
        const spicyText = item.spicyLevel === 1 ? '微辣' : 
                          item.spicyLevel === 2 ? '小辣' : 
                          item.spicyLevel === 3 ? '中辣' : 
                          item.spicyLevel === 4 ? '特辣' : '超辣';
        additionalTags.push(spicyText);
      }
      
      if (item.cookingTime) {
        additionalTags.push(`${item.cookingTime}分钟`);
      }
      
      // 合并所有标签
      const allTags = [...tags, ...additionalTags];
      
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.price,
        originPrice: item.originalPrice,
        tags: allTags,
        soldNum: item.soldNum
      };
    });
  });
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
  if (config.useMock) {
    return mockFetchGoodsList(pageIndex, pageSize);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取菜品列表 */
export function fetchDishList(pageIndex = 1, pageSize = 20, categoryIndex = 0) {
  if (config.useMock) {
    return mockFetchDishList(pageIndex, pageSize, categoryIndex);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}
