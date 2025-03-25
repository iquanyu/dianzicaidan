# 电子菜单数据模型说明

本文档说明了电子菜单应用的数据模型结构，包括分类、菜品等数据的定义和使用方法。

## 分类ID定义

菜品分类ID在 `model/dish.js` 中定义，并通过 `DISH_CATEGORIES` 常量导出：

```javascript
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
```

注意：特色菜（SPECIAL）与热菜（HOT_DISH）使用相同的分类ID，因为它们在业务逻辑上是重叠的。

## 分类数据结构

分类数据结构在 `model/dishCategory.js` 中定义，返回一个包含以下结构的数组：

```javascript
{
  groupId: 'type',          // 分类组ID
  name: '品类',             // 分类组名称
  thumbnail: '...',         // 分类组缩略图
  children: [               // 子分类列表
    {
      groupId: 'popular',   // 子分类ID
      name: '热销菜品',     // 子分类名称
      categoryId: '1',      // 对应的分类ID，与DISH_CATEGORIES中的ID对应
      thumbnail: '...'      // 子分类缩略图
    },
    // 其他子分类...
  ]
}
```

## 菜品数据结构

菜品数据在 `model/dish.js` 中定义，每个菜品对象包含以下关键字段：

```javascript
{
  spuId: '1',                 // 菜品ID
  title: '麻婆豆腐',          // 菜品名称
  primaryImage: '...',        // 主图片URL
  images: ['...', '...'],     // 所有图片URL数组
  price: 3800,                // 价格（单位：分）
  originalPrice: 4200,        // 原价（单位：分）
  soldNum: 352,               // 已售数量
  categoryIds: ['5', '1'],    // 所属分类ID数组
  description: '...',         // 菜品描述
  tags: ['麻辣', '经典']      // 标签数组
}
```

## 如何获取菜品数据

在代码中获取菜品数据的几种方法：

1. **获取所有菜品**：
   ```javascript
   import { dishes } from '../../model/dish';
   const allDishes = dishes;
   ```

2. **根据分类获取菜品**：
   ```javascript
   import { getDishesByCategory } from '../../model/dish';
   const hotDishes = getDishesByCategory('5'); // 获取热菜
   ```

3. **根据ID获取菜品**：
   ```javascript
   import { getDishById } from '../../model/dish';
   const dish = getDishById('1'); // 获取ID为1的菜品
   ```

4. **获取推荐菜品**：
   ```javascript
   import { getRecommendedDishes } from '../../model/dish';
   const recommendedDishes = getRecommendedDishes();
   ```

5. **通过服务获取菜品**：
   ```javascript
   import { fetchDishesByCategory } from '../../services/dish/fetchDishes';
   fetchDishesByCategory('5').then(result => {
     const dishes = result.spuList;
   });
   ```

## 注意事项

1. 为保持一致性，所有菜品数据应包含必要的字段，如 `id/spuId`、`title/name`、`price` 等。

2. `fetchDishes.js` 中提供了 mock 数据，当 `model/dish.js` 中没有相应数据时会使用这些 mock 数据。

3. 扩展菜品或分类时，请确保更新所有相关文件，保持数据结构的一致性。 