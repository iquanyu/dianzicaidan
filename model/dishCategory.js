import { DISH_CATEGORIES } from './dish';

export function getDishCategoryList() {
  return [
    {
      groupId: 'type',
      name: '品类',
      thumbnail: 'https://cdn-we-retail.ym.tencent.com/miniapp/category/category-default.png',
      children: [
        {
          groupId: 'popular',
          name: '热销菜品',
          categoryId: DISH_CATEGORIES.POPULAR,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-5.png',
        },
        {
          groupId: 'hot_dish',
          name: '热菜',
          categoryId: DISH_CATEGORIES.HOT_DISH,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-2.png',
        },
        {
          groupId: 'cold_dish',
          name: '冷菜',
          categoryId: DISH_CATEGORIES.COLD_DISH,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-1.png',
        },
        {
          groupId: 'staple_food',
          name: '主食',
          categoryId: DISH_CATEGORIES.STAPLE_FOOD,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-4.png',
        },
        {
          groupId: 'set_meal',
          name: '超值套餐',
          categoryId: DISH_CATEGORIES.SET_MEAL,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-6.png',
        },
        {
          groupId: 'snack',
          name: '小吃零食',
          categoryId: DISH_CATEGORIES.SNACK,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-7.png',
        },
        {
          groupId: 'soup',
          name: '汤类',
          categoryId: DISH_CATEGORIES.SOUP,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-8.png',
        },
        {
          groupId: 'drink',
          name: '饮品',
          categoryId: DISH_CATEGORIES.DRINK,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-9.png',
        },
        {
          groupId: 'wine',
          name: '酒水',
          categoryId: DISH_CATEGORIES.WINE,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-10.png',
        },
        {
          groupId: 'dessert',
          name: '甜点',
          categoryId: DISH_CATEGORIES.DESSERT,
          thumbnail: 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-11.png',
        }
      ]
    }
  ];
} 