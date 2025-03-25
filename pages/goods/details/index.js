import Toast from 'tdesign-miniprogram/toast/index';
import { fetchDishesByCategory, fetchDishDetail, fetchRecommendDishes } from '../../../services/dish/fetchDishes';
import { api } from '../../../utils/api';

Page({
  data: {
    loading: true,      // 加载状态
    empty: false,       // 空状态
    details: {},        // 菜品详情
    cartNum: 0,         // 购物车数量
    cartTotalPrice: '0.00', // 购物车总价格
    soldout: false,     // 是否已下架
    isStock: true,      // 是否有库存
    buttonType: 1,      // 按钮类型
    commentsList: [],   // 评价列表
    recommendList: [],  // 推荐菜品列表
    selectedSpecs: {},  // 已选规格
    dishId: '',         // 菜品ID
    isIPhoneX: false,   // 是否为iPhone X及以上机型
    
    // 轮播图配置
    navigation: { type: 'dots-bar' },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    
    // 底部导航配置
    jumpArray: [
      {
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '分类',
        url: '/pages/goods/category/index',
        iconName: 'app',
      },
      {
        title: '购物车',
        url: '/pages/cart/index',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
  },

  onLoad(options) {
    // 获取菜品ID，优先使用spuId参数
    const { spuId, dishId, id } = options;
    const productId = spuId || dishId || id || '';
    
    console.log('详情页接收到的参数:', options);
    console.log('使用的spuId:', productId);
    
    this.setData({
      dishId: productId
    });
    
    // 检测是否为iPhone X及以上机型
    this.checkIsIPhoneX();
    
    // 加载菜品详情
    if (productId) {
      this.getDishDetail(productId);
    } else {
      this.setData({
        loading: false,
        empty: true
      });
      this.showToast('菜品ID不存在');
    }
    
    // 获取购物车数量
    this.getCartNum();
  },
  
  /**
   * 获取菜品详情
   */
  async getDishDetail(dishId) {
    wx.showNavigationBarLoading();
    
    if (!dishId) {
      this.setData({ loading: false, empty: true });
      this.showToast('菜品ID不存在', 'error');
      wx.hideNavigationBarLoading();
      return;
    }
    
    try {
      console.log('开始获取菜品详情:', dishId);
      
      // 尝试使用API获取菜品详情
      let dishDetail = null;
      try {
        // 这里使用dishId作为spuId参数
        const response = await api.dishes.getDishDetail(dishId);
        console.log('API返回的菜品详情:', response);
        
        if (response && response.data) {
          // 处理API返回的详情数据
          dishDetail = response.data;
        } else if (response && typeof response === 'object') {
          // 某些API可能直接返回数据对象
          dishDetail = response;
        }
      } catch (apiError) {
        console.error('API获取菜品详情失败，尝试使用fetchDishDetail:', apiError);
      }
      
      // 如果API获取失败，尝试使用fetchDishDetail
      if (!dishDetail) {
        console.log('通过fetchDishDetail尝试获取菜品详情');
        dishDetail = await fetchDishDetail(dishId);
        console.log('fetchDishDetail返回的详情:', dishDetail);
      }
      
      if (!dishDetail) {
        console.error('未找到菜品详情:', dishId);
        this.setData({ loading: false, empty: true });
        this.showToast('未找到菜品信息', 'error');
        wx.hideNavigationBarLoading();
        return;
      }
      
      // 打印获取到的详情数据
      console.log('解析前的菜品详情:', JSON.stringify(dishDetail, null, 2));
      
      // 设置页面标题
      const dishName = dishDetail.title || dishDetail.name || '菜品详情';
      wx.setNavigationBarTitle({
        title: dishName
      });
      
      // 补充必要字段，确保字段格式正确
      const details = this.formatDishDetail(dishDetail, dishId);
      
      console.log('处理后的菜品详情:', JSON.stringify(details, null, 2));
      
      // 设置数据
      this.setData({
        loading: false,
        empty: false,
        details,
        soldout: details.soldout || details.stock <= 0,
        isStock: !details.soldout && (details.stock > 0)
      });
      
      // 如果API返回了相关推荐菜品，直接使用，否则获取推荐菜品
      if (!details.related_dishes || !Array.isArray(details.related_dishes) || details.related_dishes.length === 0) {
        this.getRecommendList(details.categoryId);
      } else {
        // 确保每个相关菜品都有正确的ID
        const processedDishes = details.related_dishes.map(dish => ({
          ...dish,
          id: dish.id || dish.spuId || dish.dish_id,
          spuId: dish.spuId || dish.id || dish.dish_id
        }));
        
        this.setData({
          recommendList: processedDishes
        });
      }
      
      // 如果API返回了评论，直接使用，否则获取评论列表
      if (details.comments && details.comments.topComments && details.comments.topComments.length > 0) {
        console.log('使用API返回的评论数据(已格式化):', JSON.stringify(details.comments, null, 2));
        this.setData({
          commentsList: details.comments.topComments
        });
      } else if (details.comments && details.comments.top_comments && details.comments.top_comments.length > 0) {
        console.log('使用API返回的评论数据(原始格式):', JSON.stringify(details.comments, null, 2));
        this.setData({
          commentsList: details.comments.top_comments.map(comment => ({
            userName: comment.user_name || '匿名用户',
            avatar: comment.avatar || '/pages/goods/assets/images/avatar-placeholder.png',
            content: comment.content || '',
            rating: comment.rating || 5,
            images: Array.isArray(comment.images) ? comment.images : [],
            createTime: comment.create_time || ''
          }))
        });
      } else {
        console.log('没有找到评论数据，设置空评论列表');
        this.getCommentsList();
      }
      
      // 在这里添加额外的日志，查看原始的评论数据
      console.log('原始API返回的comments字段:', JSON.stringify(dishDetail.comments, null, 2));
      
      // 默认选择第一个规格选项
      this.initDefaultSpecs(details.specList);
      
      wx.hideNavigationBarLoading();
    } catch (error) {
      console.error('获取菜品详情失败:', error);
    this.setData({
        loading: false,
        empty: true
      });
      this.showToast('获取菜品信息失败', 'error');
      wx.hideNavigationBarLoading();
    }
  },
  
  /**
   * 格式化菜品详情数据，确保所有字段统一且完整
   * @param {Object} rawData - 原始菜品详情数据
   * @param {String} dishId - 菜品ID
   * @returns {Object} 格式化后的菜品详情
   */
  formatDishDetail(rawData, dishId) {
    console.log('formatDishDetail received:', JSON.stringify(rawData, null, 2));
    
    // 基础信息处理
    const details = {
      // ID相关字段
      id: rawData.id || rawData.spuId || dishId,
      spuId: rawData.spuId || rawData.id || dishId,
      skuId: rawData.skuId || rawData.id || dishId,
      
      // 名称相关字段 - 统一处理
      title: rawData.title || rawData.name || rawData.dishName || '',
      name: rawData.name || rawData.title || rawData.dishName || '',
      
      // 图片相关字段
      thumb: rawData.thumb || rawData.primaryImage || '',
      primaryImage: rawData.primaryImage || rawData.thumb || '',
      images: this.getImageArray(rawData), // 确保图片数组正确
      
      // 价格相关字段 - 确保数字类型
      price: this.ensureNumber(rawData.price),
      originalPrice: this.ensureNumber(rawData.originalPrice || rawData.originPrice),
      
      // 描述字段 - 统一处理
      desc: rawData.desc || rawData.description || '',
      description: rawData.description || rawData.desc || '',
      detail: rawData.detail || '', // 详细描述（HTML格式）
      
      // 标签相关字段 - 确保数组类型，并处理标签字符串
      tags: this.formatTags(rawData.tags),
      
      // 辣度处理 - 确保数字类型，并限制范围
      spicyLevel: this.formatSpicyLevel(rawData.spicy_level || rawData.spicyLevel),
      
      // 烹饪时间
      cookingTime: rawData.cooking_time || rawData.cookingTime || 0,
      
      // 推荐度
      recommendation: rawData.recommendation || 0,
      
      // 库存和销量
      stock_quantity: rawData.stock_quantity || 999,
      stockQuantity: rawData.stock_quantity || rawData.stockQuantity || 999,
      soldNum: rawData.sold_count || rawData.soldNum || 0,
      soldCount: rawData.sold_count || rawData.soldNum || 0,
      
      // 是否有规格选项
      hasSpec: rawData.has_spec || !!((rawData.specs && rawData.specs.length > 0) || 
                                    (rawData.specList && rawData.specList.length > 0)),
      
      // 营养成分
      nutrition: this.formatNutrition(rawData.nutrition),
      
      // 规格列表 - 处理API格式的规格
      specList: this.formatSpecList(rawData.specs || rawData.specList),
      
      // SKU列表
      skuList: this.formatSkuList(rawData.sku_list || rawData.skuList),
      
      // 相关菜品
      relatedDishes: Array.isArray(rawData.related_dishes) ? rawData.related_dishes.map(dish => ({
        ...dish,
        id: dish.id || dish.spuId || dish.dish_id,
        spuId: dish.spuId || dish.id || dish.dish_id
      })) : [],
      related_dishes: Array.isArray(rawData.related_dishes) ? rawData.related_dishes.map(dish => ({
        ...dish,
        id: dish.id || dish.spuId || dish.dish_id,
        spuId: dish.spuId || dish.id || dish.dish_id
      })) : [],
      
      // 评论信息 - 确保comments字段格式正确
      comments: this.formatComments(rawData.comments)
    };
    
    // 优化辣度显示 - 如果在标签中有辣度相关的标签，尝试提取辣度信息
    if (!details.spicyLevel && Array.isArray(details.tags)) {
      const spicyTag = details.tags.find(tag => 
        typeof tag === 'string' && 
        (tag.includes('辣') || tag.includes('麻'))
      );
      
      if (spicyTag) {
        if (spicyTag.includes('微辣')) details.spicyLevel = 1;
        else if (spicyTag.includes('中辣')) details.spicyLevel = 2;
        else if (spicyTag.includes('重辣')) details.spicyLevel = 3;
        else if (spicyTag.includes('辣')) details.spicyLevel = 2;
      }
    }
    
    console.log('formatted dish details:', JSON.stringify(details, null, 2));
    
    // 返回完整的详情对象
    return details;
  },
  
  /**
   * 格式化标签数组
   * @param {Array|String} tags - 可能是数组或字符串格式的标签
   * @returns {Array} 格式化后的标签数组
   */
  formatTags(tags) {
    if (!tags) return [];
    
    // 记录处理前的标签数据
    console.log('Processing tags:', JSON.stringify(tags, null, 2));
    
    // 如果已经是数组且不为空，直接使用
    if (Array.isArray(tags) && tags.length > 0) {
      return tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.title || JSON.stringify(tag));
    }
    
    // 如果是字符串，尝试拆分
    if (typeof tags === 'string') {
      // 尝试解析为JSON
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.map(tag => typeof tag === 'string' ? tag : tag.name || tag.title || JSON.stringify(tag));
        }
        return [tags]; // 如果解析不是数组，则作为单个标签
      } catch (e) {
        // 如果不是有效的JSON，尝试按分隔符拆分
        return tags.split(/[,，、;；]/g).filter(tag => tag.trim().length > 0);
      }
    }
    
    return [];
  },
  
  /**
   * 处理规格列表
   * @param {Array} specs - 原始规格列表
   * @returns {Array} 处理后的规格列表
   */
  formatSpecList(specs) {
    if (!specs || !Array.isArray(specs)) return [];
    
    console.log('Processing specs:', JSON.stringify(specs, null, 2));
    
    // 处理API返回的规格格式
    return specs.map(spec => {
      // 检查是哪种规格数据结构
      const isApiFormat = spec.spec_id !== undefined || spec.spec_name !== undefined;
      
      if (isApiFormat) {
        // API格式的规格
        return {
          specId: spec.spec_id || '',
          specName: spec.spec_name || '',
          title: spec.spec_name || '',
          specValueList: Array.isArray(spec.spec_values) ? spec.spec_values.map(value => ({
            specValueId: value.value_id || '',
            specValue: value.value || '',
            priceAdjust: this.ensureNumber(value.price_adjust),
            price_adjust: this.ensureNumber(value.price_adjust)
          })) : []
        };
      } else {
        // 已经是内部格式的规格，或其他格式
        return {
          specId: spec.specId || '',
          specName: spec.specName || spec.title || '',
          title: spec.title || spec.specName || '',
          specValueList: Array.isArray(spec.specValueList) ? spec.specValueList.map(value => ({
            specValueId: value.specValueId || '',
            specValue: value.specValue || '',
            priceAdjust: this.ensureNumber(value.priceAdjust || value.price_adjust),
            price_adjust: this.ensureNumber(value.price_adjust || value.priceAdjust)
          })) : []
        };
      }
    });
  },

  /**
   * 处理SKU列表
   * @param {Array} skuList - 原始SKU列表
   * @returns {Array} 处理后的SKU列表
   */
  formatSkuList(skuList) {
    if (!skuList || !Array.isArray(skuList)) return [];
    
    return skuList.map(sku => ({
      skuId: sku.sku_id || '',
      specValues: Array.isArray(sku.spec_values) ? sku.spec_values : [],
      price: this.ensureNumber(sku.price),
      stockQuantity: sku.stock_quantity || 0
    }));
  },
  
  /**
   * 处理评论信息
   * @param {Object} comments - 原始评论信息
   * @returns {Object} 处理后的评论信息
   */
  formatComments(comments) {
    console.log('formatComments接收到的数据:', JSON.stringify(comments, null, 2));
    
    if (!comments) {
      console.log('评论数据为空');
      return {
        total: 0,
        goodRate: 0,
        topComments: []
      };
    }
    
    // 如果评论数据已经是处理过的格式，直接返回
    if (comments.topComments || comments.top_comments) {
      console.log('评论数据已是处理过的格式，直接返回');
      // 统一字段名为驼峰格式
      const result = {
        total: comments.total || 0,
        goodRate: comments.goodRate || comments.good_rate || 0,
        topComments: []
      };
      
      // 处理 topComments 字段
      if (Array.isArray(comments.topComments)) {
        result.topComments = comments.topComments.map(comment => {
          // 确保有用户名
          if (!comment.userName && !comment.user_name) {
            console.log('评论缺少用户名', comment);
          }
          
          return {
            userName: comment.userName || comment.user_name || '匿名用户',
            avatar: comment.avatar || comment.userHeadUrl || '/pages/goods/assets/images/avatar-placeholder.png',
            content: comment.content || comment.commentContent || '',
            rating: comment.rating || comment.commentScore || 5,
            images: Array.isArray(comment.images) ? comment.images : 
                  Array.isArray(comment.commentResources) ? comment.commentResources.filter(r => r.type === 'image').map(r => r.src) : [],
            createTime: comment.createTime || comment.create_time || comment.commentTime || ''
          };
        });
      } else if (Array.isArray(comments.top_comments)) {
        result.topComments = comments.top_comments.map(comment => {
          // 确保有用户名
          if (!comment.user_name && !comment.userName) {
            console.log('评论缺少用户名', comment);
          }
          
          return {
            userName: comment.user_name || comment.userName || '匿名用户',
            avatar: comment.avatar || comment.userHeadUrl || '/pages/goods/assets/images/avatar-placeholder.png',
            content: comment.content || comment.commentContent || '',
            rating: comment.rating || comment.commentScore || 5,
            images: Array.isArray(comment.images) ? comment.images : 
                  Array.isArray(comment.commentResources) ? comment.commentResources.filter(r => r.type === 'image').map(r => r.src) : [],
            createTime: comment.create_time || comment.createTime || comment.commentTime || ''
          };
        });
      }
      
      console.log('处理后的评论数据:', JSON.stringify(result, null, 2));
      return result;
    }
    
    // 处理API返回的评论数据
    console.log('处理API返回的原始评论数据');
    const result = {
      total: comments.total || 0,
      goodRate: comments.good_rate || 0,
      topComments: Array.isArray(comments.top_comments) ? comments.top_comments.map(comment => {
        // 确保有用户名
        if (!comment.user_name && !comment.userName) {
          console.log('评论缺少用户名', comment);
        }
        
        return {
          userName: comment.user_name || comment.userName || '匿名用户',
          avatar: comment.avatar || comment.userHeadUrl || '/pages/goods/assets/images/avatar-placeholder.png',
          content: comment.content || comment.commentContent || '',
          rating: comment.rating || comment.commentScore || 5,
          images: Array.isArray(comment.images) ? comment.images : 
                Array.isArray(comment.commentResources) ? comment.commentResources.filter(r => r.type === 'image').map(r => r.src) : [],
          createTime: comment.create_time || comment.createTime || comment.commentTime || ''
        };
      }) : []
    };
    
    console.log('处理后的评论数据(原始数据处理):', JSON.stringify(result, null, 2));
    return result;
  },
  
  /**
   * 获取最佳图片URL
   * @param {Object} data - 菜品数据
   * @returns {String} 最佳图片URL
   */
  getBestImage(data) {
    return data.thumb || 
           data.primaryImage || 
           data.image || 
           data.img_url || 
           (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
  },
  
  /**
   * 获取并去重图片数组
   * @param {Object} data - 菜品数据
   * @returns {Array} 处理后的图片数组
   */
  getImageArray(data) {
    // 如果已有图片数组，先使用现有数组
    if (Array.isArray(data.images) && data.images.length > 0) {
      return [...new Set(data.images)]; // 使用Set去重
    }
    
    // 收集所有可能的图片
    const images = [];
    
    // 添加主图
    const mainImage = this.getBestImage(data);
    if (mainImage) images.push(mainImage);
    
    // 如果有轮播图字段
    if (Array.isArray(data.carouselImages)) {
      data.carouselImages.forEach(img => {
        if (img && !images.includes(img)) images.push(img);
      });
    }
    
    // 如果有详情图字段
    if (Array.isArray(data.detailImages)) {
      data.detailImages.forEach(img => {
        if (img && !images.includes(img)) images.push(img);
      });
    }
    
    return images.length > 0 ? images : [mainImage];
  },
  
  /**
   * 确保将值转换为数字类型
   */
  ensureNumber(value) {
    if (typeof value === 'string') {
      return parseFloat(value) || 0;
    }
    return typeof value === 'number' ? value : 0;
  },
  
  /**
   * 处理辣度等级显示
   */
  formatSpicyLevel(level) {
    if (!level || level <= 0) return 0;
    // 确保辣度等级在1-5之间
    return Math.min(Math.max(parseInt(level), 0), 5);
  },
  
  /**
   * 处理营养信息
   */
  formatNutrition(nutrition) {
    if (!nutrition) return null;
    
    // 已经处理过的营养信息，直接返回
    if (typeof nutrition === 'object' && !Array.isArray(nutrition) && 
        (nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fat)) {
      return nutrition;
    }
    
    // 确保营养信息是对象格式
    if (typeof nutrition === 'string') {
      try {
        nutrition = JSON.parse(nutrition);
      } catch (e) {
        return null;
      }
    }
    
    // 处理数组格式的营养信息
    if (Array.isArray(nutrition)) {
      const result = {};
      const processedKeys = new Set(); // 用于跟踪已处理的营养素
      
      nutrition.forEach(item => {
        if (item.name && (item.value !== undefined || item.amount !== undefined)) {
          let key = typeof item.name === 'string' ? item.name.toLowerCase() : '';
          let value = item.value !== undefined ? item.value : item.amount;
          
          // 转换常见营养素名称
          const keyMap = {
            '热量': 'calories', '卡路里': 'calories', 'calories': 'calories', 'kcal': 'calories',
            '蛋白质': 'protein', 'protein': 'protein',
            '碳水': 'carbs', '碳水化合物': 'carbs', 'carbs': 'carbs', 'carbohydrates': 'carbs',
            '脂肪': 'fat', 'fat': 'fat',
            '纤维': 'fiber', '膳食纤维': 'fiber', 'fiber': 'fiber',
            '钠': 'sodium', 'sodium': 'sodium',
            '糖': 'sugar', 'sugars': 'sugar'
          };
          
          if (keyMap[key]) {
            key = keyMap[key];
          }
          
          // 避免重复添加同一营养素
          if (!processedKeys.has(key)) {
            processedKeys.add(key);
            result[key] = typeof value === 'string' ? parseFloat(value) || value : value;
          }
        }
      });
      
      return Object.keys(result).length > 0 ? result : null;
    }
    
    // 如果已经是对象格式，规范化key名
    if (typeof nutrition === 'object') {
      const result = {};
      const keyMap = {
        'calories': 'calories', 'calorie': 'calories', 'kcal': 'calories', 
        'protein': 'protein', 
        'carbs': 'carbs', 'carbohydrates': 'carbs', 'carbohydrate': 'carbs',
        'fat': 'fat', 'fats': 'fat',
        'fiber': 'fiber', 'dietary_fiber': 'fiber',
        'sodium': 'sodium',
        'sugar': 'sugar', 'sugars': 'sugar'
      };
      
      // 遍历对象的所有属性
      for (const key in nutrition) {
        const lowercaseKey = key.toLowerCase();
        const normalizedKey = keyMap[lowercaseKey] || lowercaseKey;
        const value = nutrition[key];
        
        // 只保留有值的属性
        if (value !== undefined && value !== null) {
          result[normalizedKey] = typeof value === 'string' ? parseFloat(value) || value : value;
        }
      }
      
      return Object.keys(result).length > 0 ? result : null;
    }
    
    return null;
  },
  
  /**
   * 初始化默认规格选项
   */
  initDefaultSpecs(specList) {
    if (!specList || !specList.length) return;
    
    const selectedSpecs = {};
    
    // 为每个规格类型选择第一个选项
    specList.forEach(spec => {
      if (spec.specValueList && spec.specValueList.length > 0) {
        selectedSpecs[spec.specId] = spec.specValueList[0].specValueId;
      }
    });
    
    this.setData({ selectedSpecs });
  },
  
  /**
   * 获取推荐菜品列表
   */
  async getRecommendList(categoryId) {
    if (!categoryId) return;
    
    try {
      // 使用fetchRecommendDishes函数获取真实推荐数据
      const result = await fetchRecommendDishes();
      const recommendList = result?.spuList || [];
      
      // 确保推荐菜品不包含当前菜品并且每个菜品都有正确的ID
      const filteredList = recommendList
        .filter(item => item.spuId !== this.data.dishId)
        .map(item => ({
          ...item,
          id: item.id || item.spuId || item.dishId,
          spuId: item.spuId || item.id || item.dishId
        }));
      
      this.setData({
        recommendList: filteredList.slice(0, 6) // 最多显示6个推荐菜品
      });
    } catch (error) {
      console.error('获取推荐菜品失败:', error);
      this.setData({ recommendList: [] });
    }
  },
  
  /**
   * 获取评价列表
   */
  getCommentsList() {
    // 不需要测试数据，直接设置空数组让页面显示"暂无评论"
    console.log('没有找到评论数据，设置空评论列表');
    
    this.setData({
      commentsList: []
    });
  },

  /**
   * 获取购物车数量
   */
  getCartNum() {
    // 从本地存储获取购物车数据
    const cartInfo = wx.getStorageSync('cart') || { list: [], totalNum: 0, totalPrice: 0 };
    
    // 计算正确的总价格显示格式
    const totalPrice = (cartInfo.totalPrice / 100).toFixed(2);
    
    this.setData({
      cartNum: cartInfo.totalNum || 0,
      cartTotalPrice: totalPrice
    });
  },

  /**
   * 获取购物车列表数据
   */
  fetchCartList() {
    // 从本地存储获取购物车数据
    const cartInfo = wx.getStorageSync('cart') || { list: [] };
    
    this.setData({
      cartList: cartInfo.list || []
    });
    
    return cartInfo.list || [];
  },
  
  /**
   * 清空购物车
   */
  clearCart() {
    this.setData({
      cartNum: 0,
      cartList: [],
      cartTotalPrice: '0.00'
    });
    
    // 清空本地存储中的购物车数据
    wx.setStorageSync('cart', { list: [], totalNum: 0, totalPrice: 0 });
    
    this.showToast('购物车已清空', 'success');
  },
  
  /**
   * 更新购物车商品数量
   */
  updateCartItem(e) {
    const { id, action } = e.detail;
    const { cartList } = this.data;
    
    // 更新购物车商品数量
    const updatedCartList = cartList.map(item => {
      if (item.id === id) {
        if (action === 'add') {
          item.num += 1;
        } else if (action === 'reduce') {
          item.num = Math.max(0, item.num - 1);
        }
      }
      return item;
    }).filter(item => item.num > 0);
    
    // 计算购物车总数量和总价格
    const totalNum = updatedCartList.reduce((total, item) => total + item.num, 0);
    const totalPrice = updatedCartList.reduce((total, item) => total + item.num * parseFloat(item.price), 0);
    
    // 更新购物车数据
    this.setData({
      cartList: updatedCartList,
      cartNum: totalNum,
      cartTotalPrice: totalPrice.toFixed(2)
    });
    
    // 更新本地存储中的购物车数据
    wx.setStorageSync('cart', {
      list: updatedCartList,
      totalNum,
      totalPrice: totalPrice * 100
    });
    
    // 如果购物车为空，关闭弹出层
    if (updatedCartList.length === 0) {
      this.showToast('购物车已清空', 'success');
      // 触发事件通知组件关闭弹窗
      this.selectComponent('#buy-bar').closeCartPopup();
    }
  },
  
  /**
   * 返回菜品列表
   */
  backToList() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 显示大图
   */
  showCurImg(e) {
    const { index } = e.detail;
    const { images } = this.data.details;
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },
  
  /**
   * 预览评价图片
   */
  previewImage(e) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  /**
   * 选择规格
   */
  handleSpecsClick(e) {
    const { specId, specValueId, specValue } = e.currentTarget.dataset;
    let { selectedSpecs } = this.data;
    
    // 更新已选规格
    selectedSpecs[specId] = specValueId;
    
    this.setData({
      selectedSpecs
    });
    
    // 提示已选规格
    this.showToast(`已选择${specValue}`);
  },
  
  /**
   * 跳转到菜品详情
   */
  goToDishDetail(e) {
    const { id } = e.currentTarget.dataset;
    
    // 确保有有效的ID值
    if (!id) {
      this.showToast('菜品ID不存在', 'error');
      return;
    }
    
    console.log('跳转菜品详情，使用ID:', id);
    
    wx.navigateTo({
      url: `/pages/goods/details/index?dishId=${id}`,
      fail: (err) => {
        console.error('跳转菜品详情失败:', err);
        this.showToast('跳转失败，请重试', 'error');
      }
    });
  },

  /**
   * 跳转到评价列表页
   */
  navToCommentsListPage() {
    // 检查是否有评论数据
    const hasComments = this.data.details.comments && 
                        this.data.details.comments.total > 0 && 
                        this.data.details.comments.topComments && 
                        this.data.details.comments.topComments.length > 0;
    
    // 获取当前登录状态
    const isLoggedIn = !!wx.getStorageSync('userToken');
    
    // 不同场景的跳转参数，未登录时不应该显示showWriteComment
    const showWriteComment = !hasComments && isLoggedIn; 
    const url = `/pages/goods/comments/index?dishId=${this.data.dishId}${showWriteComment ? '&showWriteComment=true' : ''}`;
    
    wx.navigateTo({
      url: url,
      fail: (err) => {
        console.error('跳转评论页失败:', err);
        this.showToast('暂时无法查看评论', 'error');
      }
    });
  },

  /**
   * 立即购买
   */
  buyItNow() {
    const { details, selectedSpecs } = this.data;
    
    // 检查是否已下架或无库存
    if (this.data.soldout || !this.data.isStock) {
      this.showToast('抱歉，该菜品已售罄', 'error');
      return;
    }
    
    // 检查是否选择了所有必要规格
    if (details.specList && details.specList.length > 0) {
      const missingSpecs = details.specList.some(spec => !selectedSpecs[spec.specId]);
      if (missingSpecs) {
        this.showToast('请选择规格', 'error');
        return;
      }
    }
    
    // 生成规格文本
    let specText = '';
    if (details.specList && details.specList.length > 0) {
      const specTexts = [];
      details.specList.forEach(spec => {
        const selectedValueId = selectedSpecs[spec.specId];
        const selectedValue = spec.specValueList.find(val => val.specValueId === selectedValueId);
        if (selectedValue) {
          specTexts.push(`${spec.title || spec.specName}: ${selectedValue.specValue}`);
        }
      });
      specText = specTexts.join('，');
    }
    
    try {
      // 创建符合订单确认页所需的商品数据格式
      const goodsRequestList = [{
        spuId: details.spuId,
        skuId: details.skuId || details.spuId,
        quantity: 1,
        price: details.price,
        primaryImage: details.thumb || details.primaryImage,
        title: details.title || details.name,
        storeId: details.storeId || '1000',
        storeName: details.storeName || '默认门店',
        isSelected: 1,
        stockQuantity: details.stockQuantity || 999,
        specText: specText || '',
        settlePrice: details.price || details.settlePrice || 0
      }];
      
      // 清除可能存在的旧数据
      wx.removeStorageSync('order.goodsRequestList');
      // 保存商品数据
      wx.setStorageSync('order.goodsRequestList', JSON.stringify(goodsRequestList));
      
      // 显示加载中提示
      wx.showLoading({
        title: '正在准备订单...',
      });
      
      // 跳转到订单确认页面
      setTimeout(() => {
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/order/order-confirm/index?type=buyNow',
          success: () => {
            console.log('立即购买 - 跳转成功');
          },
          fail: (error) => {
            console.error('立即购买 - 跳转失败:', error);
            this.showToast('跳转订单页失败，请重试', 'error');
          }
        });
      }, 500);
    } catch (error) {
      console.error('立即购买处理出错:', error);
      this.showToast('处理订单数据出错，请重试', 'error');
    }
  },
  
  /**
   * 加入购物车
   */
  toAddCart() {
    const { details, selectedSpecs } = this.data;
    
    // 检查是否已下架或无库存
    if (this.data.soldout || !this.data.isStock) {
      this.showToast('抱歉，该菜品已售罄', 'error');
      return;
    }
    
    // 检查是否选择了所有必要规格
    if (details.specList && details.specList.length > 0) {
      const missingSpecs = details.specList.some(spec => !selectedSpecs[spec.specId]);
      if (missingSpecs) {
        this.showToast('请选择规格', 'error');
        return;
      }
    }
    
    // 生成规格文本
    let specText = '';
    if (details.specList && details.specList.length > 0) {
      const specTexts = [];
      details.specList.forEach(spec => {
        const selectedValueId = selectedSpecs[spec.specId];
        const selectedValue = spec.specValueList.find(val => val.specValueId === selectedValueId);
        if (selectedValue) {
          specTexts.push(`${spec.title || spec.specName}: ${selectedValue.specValue}`);
        }
      });
      specText = specTexts.join('，');
    }
    
    // 创建购物车项
    const cartItem = {
      id: details.spuId,
      thumb: details.thumb,
      name: details.title,
      price: details.price / 100,
      num: 1,
      specText,
      checked: true
    };
    
    // 获取当前购物车数据
    const cartInfo = wx.getStorageSync('cart') || { list: [], totalNum: 0, totalPrice: 0 };
    let { list, totalNum, totalPrice } = cartInfo;
    
    // 检查购物车中是否已存在相同规格的菜品
    const existingItemIndex = list.findIndex(item => 
      item.id === cartItem.id && item.specText === cartItem.specText
    );
    
    if (existingItemIndex > -1) {
      // 如果存在相同规格的菜品，增加数量
      list[existingItemIndex].num += 1;
      
      // 更新总数量和总价格
      totalNum += 1;
      totalPrice += parseFloat(cartItem.price) * 100;
    } else {
      // 如果不存在相同规格的菜品，添加到购物车
      list.push(cartItem);
      
      // 更新总数量和总价格
      totalNum += 1;
      totalPrice += parseFloat(cartItem.price) * 100;
    }
    
    // 更新本地存储中的购物车数据
    wx.setStorageSync('cart', {
      list,
      totalNum,
      totalPrice
    });
    
    // 更新页面数据
    this.setData({ 
      cartNum: totalNum,
      cartTotalPrice: (totalPrice / 100).toFixed(2)
    });
    
    // 提示成功
    this.showToast('已加入购物车', 'success');
    
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
  },
  
  /**
   * 跳转导航
   */
  toNav(e) {
    const { url } = e.detail;
    wx.switchTab({
      url: url
    });
  },
  
  /**
   * 显示提示信息
   */
  showToast(title, icon = 'none') {
    Toast({
      context: this,
      selector: '#t-toast',
      message: title,
      icon: icon,
      duration: 1000
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getDishDetail(this.data.dishId);
    wx.stopPullDownRefresh();
  },
  
  /**
   * 页面显示时触发
   */
  onShow() {
    // 刷新购物车数量
    this.getCartNum();
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const { details } = this.data;
    return {
      title: details.title || details.name || '美味菜品',
      path: `/pages/goods/details/index?dishId=${this.data.dishId}`,
      imageUrl: details.thumb || details.primaryImage
    };
  },
  
  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline() {
    const { details } = this.data;
    return {
      title: details.title || details.name || '美味菜品',
      query: `dishId=${this.data.dishId}`,
      imageUrl: details.thumb || details.primaryImage
    };
  },
  
  // 检测是否为iPhone X及以上机型
  checkIsIPhoneX() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 根据手机机型判断是否为iPhone X及以上机型
        const isIPhoneX = /iPhone X|iPhone 11|iPhone 12|iPhone 13|iPhone 14|iPhone 15/i.test(res.model) || 
                         (res.model.indexOf('iPhone') > -1 && res.safeArea && res.safeArea.bottom > 800);
        that.setData({
          isIPhoneX: isIPhoneX
        });
      }
    });
  },
});

