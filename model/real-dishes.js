// 创建新的菜品数据文件

// 真实菜品数据

// 菜品分类ID定义
const CATEGORY = {
  POPULAR: '1',          // 热门菜品
  SET_MEAL: '2',         // 超值套餐
  STAPLE_FOOD: '3',      // 主食
  SNACK: '4',            // 小吃零食
  HOT_DISH: '5',         // 热菜
  COLD_DISH: '6',        // 凉菜
  SOUP: '7',             // 汤类
  DRINK: '8',            // 饮品
  WINE: '9',             // 酒水
  DESSERT: '10',         // 甜点
};

// 口味类型
const TASTE_TYPES = [
  '麻辣', '酸辣', '香辣', '清淡', '咸鲜', '酸甜', '五香', '鲜香', '浓郁', '酱香', '鱼香'
];

// 真实菜品数据
const realDishes = [
  // 热门菜品
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1',
    title: '麻婆豆腐',
    primaryImage: 'https://images.unsplash.com/photo-1582721244958-d0cc82a417da?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582721244958-d0cc82a417da?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541379889336-70f26e4c4617?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 3800,              // 38元
    originalPrice: 4200,      // 原价42元
    spuStockQuantity: 100,    // 库存数量
    soldNum: 352,             // 已售数量
    isPutOnSale: 1,           // 是否上架
    categoryIds: [
      CATEGORY.HOT_DISH,
      CATEGORY.POPULAR
    ],
    cookingTime: 10,          // 烹饪时间（分钟）
    spicyLevel: 3,            // 辣度等级（1-5）
    isRecommended: true,      // 是否推荐
    isNewDish: false,         // 是否新品
    ingredients: ['豆腐', '牛肉末', '郫县豆瓣', '花椒'], // 主要食材
    tasteTypes: ['麻辣', '咸鲜'],  // 口味类型
    nutrition: {              // 营养信息
      calories: 280,          // 卡路里
      protein: 15,            // 蛋白质(克)
      carbs: 8,               // 碳水(克)
      fat: 22                 // 脂肪(克)
    },
    description: '麻婆豆腐是四川传统名菜，由郫县豆瓣、豆腐、牛肉末、花椒等烹制而成，麻辣可口，色泽红亮，质地嫩滑。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '2',
    title: '宫保鸡丁',
    primaryImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 4200,
    originalPrice: 4600,
    spuStockQuantity: 150,
    soldNum: 426,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH,
      CATEGORY.POPULAR
    ],
    cookingTime: 15,
    spicyLevel: 2,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['鸡胸肉', '花生', '干辣椒', '黄瓜'],
    tasteTypes: ['香辣', '咸鲜'],
    nutrition: {
      calories: 320,
      protein: 26,
      carbs: 12,
      fat: 18
    },
    description: '宫保鸡丁是一道闻名中外的川菜，由鸡肉、花生米、辣椒等炒制而成，咸甜适中，麻辣鲜香，鸡肉鲜嫩，花生酥脆。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '3',
    title: '水煮鱼',
    primaryImage: 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560717845-968823efbee1?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 6800,
    originalPrice: 7200,
    spuStockQuantity: 80,
    soldNum: 258,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH,
      CATEGORY.POPULAR
    ],
    cookingTime: 20,
    spicyLevel: 4,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['草鱼', '豆芽', '辣椒', '花椒'],
    tasteTypes: ['麻辣', '鲜香'],
    nutrition: {
      calories: 350,
      protein: 32,
      carbs: 5,
      fat: 23
    },
    description: '水煮鱼是一道四川传统名菜，选用新鲜草鱼，配以豆芽和辣椒，麻辣鲜香，鱼肉鲜嫩爽滑，是下饭的绝佳选择。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '4',
    title: '回锅肉',
    primaryImage: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1623595119708-285962e34f51?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 4800,
    originalPrice: 5200,
    spuStockQuantity: 120,
    soldNum: 382,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH,
      CATEGORY.POPULAR
    ],
    cookingTime: 18,
    spicyLevel: 3,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['五花肉', '青椒', '蒜苗', '豆豉'],
    tasteTypes: ['香辣', '咸鲜'],
    nutrition: {
      calories: 420,
      protein: 22,
      carbs: 8,
      fat: 36
    },
    description: '回锅肉是四川传统名菜，选用肥瘦相间的五花肉，与青椒、蒜苗一起爆炒，香辣可口，肉质鲜嫩，是一道经典的下饭菜。',
  },
  
  // 主食类
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '5',
    title: '阳春面',
    primaryImage: 'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 1800,
    originalPrice: 2000,
    spuStockQuantity: 200,
    soldNum: 520,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.STAPLE_FOOD
    ],
    cookingTime: 8,
    spicyLevel: 0,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['面条', '葱花', '香菜', '芝麻油'],
    tasteTypes: ['清淡', '鲜香'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 58,
      fat: 8
    },
    description: '阳春面是一道经典的中式面食，面条劲道爽滑，配以鲜美的高汤，葱花和香菜点缀，简单而美味。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '6',
    title: '扬州炒饭',
    primaryImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 2800,
    originalPrice: 3000,
    spuStockQuantity: 150,
    soldNum: 468,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.STAPLE_FOOD
    ],
    cookingTime: 12,
    spicyLevel: 0,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['米饭', '虾仁', '火腿', '鸡蛋', '豌豆', '胡萝卜'],
    tasteTypes: ['咸鲜', '鲜香'],
    nutrition: {
      calories: 380,
      protein: 15,
      carbs: 60,
      fat: 12
    },
    description: '扬州炒饭是中国传统名菜之一，以米饭、虾仁、火腿、鸡蛋等多种配料炒制而成，色彩缤纷，鲜香可口，营养丰富。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '7',
    title: '红烧牛肉面',
    primaryImage: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 3200,
    originalPrice: 3600,
    spuStockQuantity: 100,
    soldNum: 386,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.STAPLE_FOOD
    ],
    cookingTime: 25,
    spicyLevel: 1,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['牛肉', '面条', '萝卜', '香菜'],
    tasteTypes: ['酱香', '浓郁'],
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 62,
      fat: 15
    },
    description: '红烧牛肉面是中国传统面食之一，精选优质牛肉，熬煮数小时，汤汁浓郁，面条筋道，牛肉软烂入味，回味无穷。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '8',
    title: '蛋炒饭',
    primaryImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 1800,
    originalPrice: 2000,
    spuStockQuantity: 200,
    soldNum: 528,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.STAPLE_FOOD
    ],
    cookingTime: 10,
    spicyLevel: 0,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['米饭', '鸡蛋', '葱花', '食用油', '盐'],
    tasteTypes: ['清淡', '咸鲜'],
    nutrition: {
      calories: 350,
      protein: 10,
      carbs: 56,
      fat: 10
    },
    description: '蛋炒饭是一道家常米饭料理，米饭粒粒分明，鸡蛋香气四溢，简单而美味，是最受欢迎的主食之一。',
  },
  // 热菜类
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '9',
    title: '鱼香肉丝',
    primaryImage: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 3800,
    originalPrice: 4200,
    spuStockQuantity: 110,
    soldNum: 368,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH
    ],
    cookingTime: 15,
    spicyLevel: 2,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['里脊肉', '木耳', '胡萝卜', '冬笋', '泡椒'],
    tasteTypes: ['鱼香', '酸甜'],
    nutrition: {
      calories: 340,
      protein: 22,
      carbs: 12,
      fat: 20
    },
    description: '鱼香肉丝是经典川菜之一，将里脊肉切丝，与木耳、胡萝卜、冬笋等一起炒制，口味酸甜微辣，开胃下饭。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '10',
    title: '糖醋里脊',
    primaryImage: 'https://images.unsplash.com/photo-1611489142320-285962e34f51?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611489142320-285962e34f51?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 4200,
    originalPrice: 4500,
    spuStockQuantity: 90,
    soldNum: 295,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH
    ],
    cookingTime: 18,
    spicyLevel: 0,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['里脊肉', '面粉', '鸡蛋', '番茄酱', '白糖', '醋'],
    tasteTypes: ['酸甜', '咸鲜'],
    nutrition: {
      calories: 380,
      protein: 25,
      carbs: 15,
      fat: 22
    },
    description: '糖醋里脊是一道著名的汉族传统名菜，酸甜可口，外脆里嫩，色泽红亮，是老少皆宜的美味佳肴。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '11',
    title: '青椒土豆丝',
    primaryImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612621616564-6b486e11b600?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 2800,
    originalPrice: 3200,
    spuStockQuantity: 150,
    soldNum: 420,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH
    ],
    cookingTime: 12,
    spicyLevel: 1,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['土豆', '青椒', '干辣椒', '醋'],
    tasteTypes: ['香辣', '酸辣'],
    nutrition: {
      calories: 220,
      protein: 5,
      carbs: 32,
      fat: 10
    },
    description: '青椒土豆丝是一道家常菜，由土豆和青椒为主要原料，爽脆可口，微辣开胃，是非常受欢迎的下饭菜。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '12',
    title: '干煸四季豆',
    primaryImage: 'https://images.unsplash.com/photo-1625944525533-473f1a3d51e0?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1625944525533-473f1a3d51e0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 3200,
    originalPrice: 3600,
    spuStockQuantity: 120,
    soldNum: 342,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.HOT_DISH
    ],
    cookingTime: 15,
    spicyLevel: 2,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['四季豆', '肉末', '干辣椒', '花椒'],
    tasteTypes: ['香辣', '麻辣'],
    nutrition: {
      calories: 260,
      protein: 12,
      carbs: 20,
      fat: 15
    },
    description: '干煸四季豆是四川传统名菜，四季豆炸至表皮起皱，与肉末、辣椒一起爆炒，麻辣香脆，是下饭的好选择。',
  },
  // 凉菜类
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '13',
    title: '凉拌黄瓜',
    primaryImage: 'https://images.unsplash.com/photo-1552825896-9e5a6c11ae4d?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552825896-9e5a6c11ae4d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592453403469-6b4b141acf47?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 1800,
    originalPrice: 2200,
    spuStockQuantity: 150,
    soldNum: 386,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.COLD_DISH
    ],
    cookingTime: 5,
    spicyLevel: 1,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['黄瓜', '蒜泥', '香醋', '香油'],
    tasteTypes: ['清爽', '酸辣'],
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 5
    },
    description: '凉拌黄瓜是一道清爽开胃的凉菜，以新鲜黄瓜为主料，加入蒜泥和调味料凉拌而成，口感爽脆，风味独特。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '14',
    title: '口水鸡',
    primaryImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 4200,
    originalPrice: 4600,
    spuStockQuantity: 90,
    soldNum: 312,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.COLD_DISH,
      CATEGORY.POPULAR
    ],
    cookingTime: 60,
    spicyLevel: 3,
    isRecommended: true,
    isNewDish: false,
    ingredients: ['鸡腿肉', '花椒', '干辣椒', '芝麻', '蒜泥'],
    tasteTypes: ['麻辣', '辣香'],
    nutrition: {
      calories: 320,
      protein: 28,
      carbs: 5,
      fat: 18
    },
    description: '口水鸡是四川名菜，选用优质鸡腿肉，煮熟后浇上麻辣鲜香的特制红油，麻辣爽口，唇齿留香，让人垂涎欲滴。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '15',
    title: '凉拌木耳',
    primaryImage: 'https://images.unsplash.com/photo-1561626423-a51b45aef510?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1561626423-a51b45aef510?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 2200,
    originalPrice: 2600,
    spuStockQuantity: 130,
    soldNum: 265,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.COLD_DISH
    ],
    cookingTime: 10,
    spicyLevel: 1,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['黑木耳', '红辣椒', '蒜', '香醋'],
    tasteTypes: ['清爽', '酸辣'],
    nutrition: {
      calories: 150,
      protein: 4,
      carbs: 18,
      fat: 6
    },
    description: '凉拌木耳是一道营养丰富的凉菜，选用新鲜黑木耳，口感脆嫩，酸辣可口，开胃爽口，非常适合夏季食用。',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '16',
    title: '皮蛋豆腐',
    primaryImage: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop'
    ],
    video: null,
    available: 1,
    price: 2400,
    originalPrice: 2800,
    spuStockQuantity: 100,
    soldNum: 278,
    isPutOnSale: 1,
    categoryIds: [
      CATEGORY.COLD_DISH
    ],
    cookingTime: 8,
    spicyLevel: 0,
    isRecommended: false,
    isNewDish: false,
    ingredients: ['皮蛋', '北豆腐', '生抽', '香油', '香葱'],
    tasteTypes: ['咸鲜', '清爽'],
    nutrition: {
      calories: 180,
      protein: 15,
      carbs: 5,
      fat: 12
    },
    description: '皮蛋豆腐是一道经典家常菜，软嫩的豆腐配上滑润的皮蛋，口感丰富，咸鲜适口，是夏季开胃的佳品。',
  }
];

// 导出分类和菜品数据
export const DISH_CATEGORIES = CATEGORY;
export function getAllDishes() {
  return realDishes;
}
