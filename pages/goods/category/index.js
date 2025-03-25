import { fetchDishesByCategory } from '../../../services/dish/fetchDishes';
import { api } from '../../../utils/api';

import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    categoryList: [],        // 分类列表数据
    activeCategory: 0,       // 当前激活的分类索引
    dishList: [],            // 当前分类下的菜品列表
    loading: true,           // 加载状态
    empty: false,            // 是否为空状态
    pageTitle: '菜品分类',   // 页面标题
    categoryTitle: '',       // 当前分类标题
    dishCount: 0,            // 当前分类菜品数量
    cartNum: 0,              // 购物车数量
    cartList: [],            // 购物车商品列表
    totalPrice: '0.00',      // 总价格
    isIPhoneX: false,        // 是否是iPhone X及以上机型
    
    // 店铺信息
    shopInfo: {
      name: '美味电子菜单餐厅',
      logo: 'https://iknow-pic.cdn.bcebos.com/f3d3572c11dfa9ec63dd4d8970d0f703908fc1b9',
      rating: '4.8',
      businessHours: '10:00-22:00',
      address: '广州市天河区天河路385号',
      notice: '本店新推出多款特色菜品，欢迎品尝！',
      longitude: 113.330605,
      latitude: 23.126511
    },
    
    // 搜索相关
    searchValue: '',        // 搜索框的值
    searchResults: [],      // 搜索结果
    isSearching: false,     // 是否在搜索状态
    searchLoading: false,   // 搜索加载状态
    showSearchResult: false, // 是否显示搜索结果
    fromHomeOptions: {}     // 从首页传递的参数
  },
  
  /**
   * 初始化数据
   */
  async init() {
    try {
      wx.showNavigationBarLoading();
      
      // 获取从首页传递的参数
      const categoryId = this.fromHomeOptions?.categoryId;
      const tabIndex = this.fromHomeOptions?.tabIndex !== undefined 
        ? parseInt(this.fromHomeOptions.tabIndex) 
        : undefined;
      
      console.log('初始化时处理的分类参数:', {categoryId, tabIndex});
      
      // 使用API获取分类数据，不再使用本地数据
      try {
        const res = await api.categories.getCategoryList();
        console.log('API获取分类数据结果:', res);
        
        // 检查API返回的数据结构
        if (!res) {
          console.error('API返回数据为空');
          throw new Error('API返回数据为空');
        }
        
        let categoryList = [];
        let categoriesData = null;
        
        // 提取分类数据
        if (res.data && Array.isArray(res.data)) {
          categoriesData = res.data;
        } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
          categoriesData = res.data.list;
        } else if (res.data && res.data.categories && Array.isArray(res.data.categories)) {
          categoriesData = res.data.categories;
        } else if (res.data && res.data.categoryList && Array.isArray(res.data.categoryList)) {
          categoriesData = res.data.categoryList;
        } else if (res.categories && Array.isArray(res.categories)) {
          categoriesData = res.categories;
        } else if (res.categoryList && Array.isArray(res.categoryList)) {
          categoriesData = res.categoryList;
        } else if (res.list && Array.isArray(res.list)) {
          categoriesData = res.list;
        } else if (Array.isArray(res)) {
          categoriesData = res;
        } else {
          // 打印完整的返回数据结构，便于调试
          console.error('API返回的分类数据结构无法识别，完整数据:', JSON.stringify(res));
          throw new Error('API返回的分类数据结构无法识别');
        }
        
        console.log('提取到分类数据，数量:', categoriesData.length, '第一个分类示例:', categoriesData[0]);
        
        // 将提取的分类数据转换为组件需要的格式
        if (categoriesData && categoriesData.length > 0) {
          // 检查是否存在嵌套的子分类
          const hasSubCategories = categoriesData.some(category => 
            category.sub_categories && Array.isArray(category.sub_categories) && category.sub_categories.length > 0
          );
          
          if (hasSubCategories) {
            // 处理带有sub_categories的结构
            console.log('检测到带有子分类的结构，共有主分类:', categoriesData.length, '个');
            categoryList = [{
              id: 'root',
              name: '菜品分类',
              children: []
            }];
            
            // 将所有子分类平铺到一个数组中
            categoriesData.forEach(mainCategory => {
              // 添加主分类
              categoryList[0].children.push({
                id: mainCategory.id,
                categoryId: mainCategory.id,
                name: mainCategory.name || mainCategory.title,
                thumbnail: mainCategory.icon || mainCategory.thumbnail || mainCategory.image || 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-5.png',
                isMainCategory: true
              });
              
              // 添加子分类
              if (mainCategory.sub_categories && Array.isArray(mainCategory.sub_categories) && mainCategory.sub_categories.length > 0) {
                console.log(`主分类 ${mainCategory.name} 有 ${mainCategory.sub_categories.length} 个子分类`);
                mainCategory.sub_categories.forEach(subCategory => {
                  categoryList[0].children.push({
                    id: subCategory.id,
                    categoryId: subCategory.id,
                    name: subCategory.name || subCategory.title,
                    parentId: mainCategory.id,
                    thumbnail: subCategory.icon || subCategory.thumbnail || subCategory.image || 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-5.png',
                    isSubCategory: true
                  });
                });
              }
            });
          } else {
            // 将扁平结构转换为嵌套结构
            categoryList = [{
              id: 'root',
              name: '菜品分类',
              children: categoriesData.map(category => ({
                id: category.id || category.categoryId,
                categoryId: category.categoryId || category.id,
                name: category.name || category.title,
                thumbnail: category.icon || category.thumbnail || category.image || 'https://cdn-we-retail.ym.tencent.com/tsr/classify/img-5.png'
              }))
            }];
          }
          
          console.log('转换后的分类数据结构:', {
            categoryCount: categoryList[0].children.length,
            firstCategory: categoryList[0].children[0]
          });
        } else {
          throw new Error('API返回的分类数据为空');
        }
        
        if (categoryList && categoryList.length > 0 && categoryList[0].children && categoryList[0].children.length > 0) {
          this.setData({ 
            categoryList,
            pageTitle: categoryList[0].name || '菜品分类'
          });
          
          // 处理从首页传递的索引
          if (tabIndex !== undefined && tabIndex >= 0 && tabIndex < categoryList[0].children.length) {
            // 使用首页传递的索引
            const selectedCategory = categoryList[0].children[tabIndex];
            this.setData({
              categoryTitle: selectedCategory.name,
              activeCategory: tabIndex
            });
            
            console.log('使用首页传递的索引:', tabIndex, '选中分类:', selectedCategory.name);
            this.loadCategoryDishes(selectedCategory);
          }
          // 如果有categoryId但没有有效的tabIndex
          else if (categoryId) {
            // 查找匹配的分类
            const index = categoryList[0].children.findIndex(cat => 
              cat.id === categoryId || cat.categoryId === categoryId
            );
            
            if (index !== -1) {
              const selectedCategory = categoryList[0].children[index];
              this.setData({
                categoryTitle: selectedCategory.name,
                activeCategory: index
              });
              
              console.log('根据categoryId找到匹配分类:', selectedCategory.name, '索引:', index);
              this.loadCategoryDishes(selectedCategory);
            } else {
              // 未找到匹配分类，加载第一个分类
              const firstCategory = categoryList[0].children[0];
              this.setData({
                categoryTitle: firstCategory.name,
                activeCategory: 0
              });
              
              console.log('未找到匹配分类ID，使用第一个分类');
              this.loadCategoryDishes(firstCategory);
            }
          } else {
            // 没有传递有效参数，加载第一个分类
            const firstCategory = categoryList[0].children[0];
            this.setData({
              categoryTitle: firstCategory.name,
              activeCategory: 0
            });
            
            console.log('无指定分类参数，使用第一个分类');
            this.loadCategoryDishes(firstCategory);
          }
        } else {
          throw new Error('API返回的分类数据为空');
        }
      } catch (error) {
        console.error('API获取分类失败，使用默认分类:', error);
        
        // 创建默认分类
        const defaultCategories = this.getDefaultCategories();
        const wrappedCategoryList = [{
          id: 'root',
          name: '菜品分类',
          children: defaultCategories
        }];
        
        this.setData({ 
          categoryList: wrappedCategoryList,
          categoryTitle: defaultCategories[0].name,
          activeCategory: 0,
          pageTitle: '菜品分类'
        });
        
        this.loadCategoryDishes(defaultCategories[0]);
      }
      
      // 获取购物车数据
      this.getCartNum();
      
      wx.hideNavigationBarLoading();
    } catch (error) {
      console.error('初始化分类数据失败:', error);
      wx.hideNavigationBarLoading();
      
      // 创建默认分类
      const defaultCategories = this.getDefaultCategories();
      const wrappedCategoryList = [{
        id: 'root',
        name: '菜品分类',
        children: defaultCategories
      }];
      
      this.setData({ 
        categoryList: wrappedCategoryList,
        loading: false,
        categoryTitle: defaultCategories[0].name,
        activeCategory: 0
      });
      
      this.loadCategoryDishes(defaultCategories[0]);
      this.showToast('加载分类失败，使用默认分类');
    }
  },

  /**
   * 切换分类
   */
  switchCategory(e) {
    const { index, item } = e.currentTarget.dataset;
    
    if (this.data.activeCategory === index) return;
    
    console.log('切换到分类:', item);
    
    this.setData({ 
      activeCategory: index,
      loading: true,
      empty: false,
      dishList: [],
      categoryTitle: item.name
    });
    
    this.loadCategoryDishes(item);
  },
  
  /**
   * 加载分类对应的菜品
   */
  async loadCategoryDishes(category) {
    if (!category) return [];
    
    // 显示导航栏加载动画
    wx.showNavigationBarLoading();
    
    // 确保分类ID存在并正确处理
    let categoryId = '';
    
    // 优先使用categoryId，这是与后端API匹配的真实分类ID
    if (category.categoryId) {
      categoryId = category.categoryId;
    } 
    // 如果没有categoryId但有id，则使用id
    else if (category.id) {
      // 如果id是数字或纯数字字符串，直接使用
      if (!isNaN(category.id)) {
        categoryId = String(category.id);
      } 
      // 如果id是类似"category_3"的格式，提取数字部分
      else if (category.id.startsWith('category_')) {
        const idMatch = category.id.match(/category_(\d+)/);
        if (idMatch && idMatch[1]) {
          categoryId = idMatch[1];
        } else {
          categoryId = category.id;
        }
      } 
      // 其他情况直接使用id
      else {
        categoryId = category.id;
      }
    } 
    // 如果都没有，使用activeCategory索引作为后备
    else {
      categoryId = String(this.data.activeCategory + 1); // 索引从0开始，分类ID从1开始
    }
    
    console.log('处理后的分类ID:', categoryId);
    
    // 获取当前分类的菜品列表
    try {
      console.log('加载分类菜品ID:', categoryId);
      let dishList = await this.getDishList(categoryId);
      
      // 如果没有数据，显示提示
      if (!dishList || dishList.length === 0) {
        console.log('分类下没有菜品数据');
        this.setData({
          loading: false,
          empty: true,
          dishList: [],
          dishCount: 0
        });
        
        wx.hideNavigationBarLoading();
        return [];
      }
      
      console.log(`加载到 ${dishList.length} 个菜品`);
      
      // 按销量降序排序
      const sortedList = dishList.sort((a, b) => (b.soldNum || b.sales || 0) - (a.soldNum || a.sales || 0));
      
      // 更新数据
      this.setData({
        dishList: sortedList,
        loading: false,
        empty: sortedList.length === 0,
        categoryTitle: category.name,
        dishCount: sortedList.length
      });
      
      // 隐藏导航栏加载动画
      wx.hideNavigationBarLoading();
      
      return sortedList;
    } catch (error) {
      console.error('加载菜品失败:', error);
      
      // 隐藏导航栏加载动画
      wx.hideNavigationBarLoading();
      
      // 显示错误提示
      this.showToast('加载菜品失败');
      
      // 更新为空状态
      this.setData({
        loading: false,
        empty: true,
        dishList: [],
        dishCount: 0
      });
      
      return [];
    }
  },
  
  /**
   * 获取菜品列表
   */
  async getDishList(categoryId) {
    if (!categoryId) {
      console.error('分类ID不存在');
      return [];
    }
    
    try {
      console.log('请求分类菜品:', categoryId);
      // 使用API接口获取分类菜品
      const result = await api.categories.getCategoryDishes(categoryId);
      console.log('API获取分类菜品结果:', result);
      
      // 检查API返回的数据结构并提取数据列表
      let dishDataList = [];
      
      if (result) {
        // 情况1: { data: [...] }
        if (result.data && Array.isArray(result.data)) {
          dishDataList = result.data;
        } 
        // 情况2: { data: { list: [...] } }
        else if (result.data && result.data.list && Array.isArray(result.data.list)) {
          dishDataList = result.data.list;
        }
        // 情况3: { data: { spuList: [...] } } - 新增支持
        else if (result.data && result.data.spuList && Array.isArray(result.data.spuList)) {
          dishDataList = result.data.spuList;
          console.log('从data.spuList中获取菜品数据');
        }
        // 情况4: { spuList: [...] }
        else if (result.spuList && Array.isArray(result.spuList)) {
          dishDataList = result.spuList;
        }
        // 情况5: { list: [...] }
        else if (result.list && Array.isArray(result.list)) {
          dishDataList = result.list;
        }
        // 情况6: { data: { dishes: [...] } }
        else if (result.data && result.data.dishes && Array.isArray(result.data.dishes)) {
          dishDataList = result.data.dishes;
        }
        // 情况7: 直接是数组
        else if (Array.isArray(result)) {
          dishDataList = result;
        }
        // 输出完整结构进行调试
        else {
          console.error('无法识别API返回的数据结构，完整数据:', JSON.stringify(result));
          return [];
        }
      } else {
        console.error('API返回数据为空');
        return [];
      }
      
      console.log(`从API响应中提取到 ${dishDataList.length} 个菜品`);
      
      if (dishDataList.length === 0) {
        console.warn('提取的菜品列表为空');
        return [];
      }
      
      // 标准化菜品数据结构
      const dishList = dishDataList.map(dish => {
        // 打印第一个菜品数据做调试
        if (dishDataList.indexOf(dish) === 0) {
          console.log('样例菜品数据:', JSON.stringify(dish));
        }
        
        // 处理tags字段，确保它是字符串数组
        let tagsArray = [];
        if (dish.tags) {
          // 如果tags是字符串，尝试解析JSON
          if (typeof dish.tags === 'string') {
            try {
              const parsedTags = JSON.parse(dish.tags);
              if (Array.isArray(parsedTags)) {
                tagsArray = parsedTags;
              } else if (typeof parsedTags === 'object') {
                // 从对象中提取有用的信息
                tagsArray = Object.values(parsedTags).filter(value => !!value);
              } else {
                tagsArray = [dish.tags];
              }
            } catch (e) {
              // 如果解析失败，将其作为单个标签
              tagsArray = [dish.tags];
            }
          }
          // 如果tags是数组，直接使用
          else if (Array.isArray(dish.tags)) {
            tagsArray = dish.tags;
          } 
          // 如果tags是对象，尝试提取有用的信息
          else if (typeof dish.tags === 'object') {
            // 尝试从对象中提取键或值作为标签
            tagsArray = Object.values(dish.tags).filter(value => !!value);
            if (tagsArray.length === 0) {
              tagsArray = Object.keys(dish.tags);
            }
          }
        }
        
        // 确保tags数组中的每个元素都是字符串
        tagsArray = tagsArray.map(tag => {
          if (tag === null || tag === undefined) {
            return '';
          }
          if (typeof tag === 'object') {
            // 如果标签是对象，尝试提取name或text字段
            return tag.name || tag.text || tag.value || tag.label || String(Object.values(tag)[0] || '');
          }
          return String(tag);
        }).filter(tag => tag.trim() !== ''); // 过滤掉空字符串
        
        // 如果没有提取到标签，尝试从description中创建标签
        if (tagsArray.length === 0 && dish.description) {
          const descWords = dish.description.split(/[,，、]/);
          if (descWords.length > 1) {
            tagsArray = descWords.slice(0, 2); // 取前两个词作为标签
          }
        }
        
        return {
          id: dish.id || dish.spuId || dish.dishId,
          spuId: dish.spuId || dish.id || dish.dishId,
          title: dish.title || dish.name,
          name: dish.name || dish.title,
          price: dish.price || 0,
          originalPrice: dish.originPrice || dish.originalPrice || dish.price || 0,
          thumb: dish.thumb || dish.primaryImage || dish.image,
          primaryImage: dish.primaryImage || dish.thumb || dish.image,
          soldNum: dish.soldNum || dish.sales || 0,
          sales: dish.sales || dish.soldNum || 0,
          stockQuantity: dish.stockQuantity || dish.stock || 999,
          description: dish.description || dish.desc || '',
          tags: tagsArray,
          categoryIds: dish.categoryIds || [categoryId]
        };
      });
      
      return dishList;
    } catch (error) {
      console.error('获取菜品列表失败:', error);
      return [];
    }
  },
  
  /**
   * 获取默认分类列表
   */
  getDefaultCategories() {
    return [
      { id: 1, name: '热销菜品', categoryId: '1' },
      { id: 2, name: '超值套餐', categoryId: '2' },
      { id: 3, name: '主食', categoryId: '3' },
      { id: 4, name: '小吃零食', categoryId: '4' },
      { id: 5, name: '热菜', categoryId: '5' },
      { id: 6, name: '凉菜', categoryId: '6' },
      { id: 7, name: '汤类', categoryId: '7' },
      { id: 8, name: '饮品', categoryId: '8' },
      { id: 9, name: '酒水', categoryId: '9' },
      { id: 10, name: '甜点', categoryId: '10' }
    ];
  },
  
  /**
   * 点击菜品，跳转到详情页
   */
  onDishTap(e) {
    const { item } = e.currentTarget.dataset;
    if (!item) return;
    
    // 优先使用spuId，其次是id
    const dishId = item.spuId || item.id;
    
    if (!dishId) {
      console.error('菜品ID不存在:', item);
      this.showToast('菜品信息不完整');
      return;
    }
    
    console.log('跳转到菜品详情:', dishId);
    
    // 跳转到菜品详情页
    wx.navigateTo({
      url: `/pages/goods/details/index?dishId=${dishId}`,
      fail: (err) => {
        console.error('跳转菜品详情失败:', err);
        this.showToast('跳转失败，请重试');
      }
    });
  },
  
  /**
   * 获取购物车数量
   */
  getCartNum() {
    // 从本地存储获取购物车数据
    const cartInfo = wx.getStorageSync('cart') || { list: [], totalNum: 0, totalPrice: 0 };
    
    this.setData({
      cartNum: cartInfo.totalNum || 0,
      totalPrice: cartInfo.totalPrice ? (cartInfo.totalPrice / 100).toFixed(2) : '0.00'
    });
  },
  
  /**
   * 获取购物车列表数据
   */
  fetchCartList() {
    // 从本地存储获取购物车数据
    const cartInfo = wx.getStorageSync('cart') || { list: [] };
    
    // 设置购物车商品列表
    this.setData({
      cartList: cartInfo.list || []
    });
  },
  
  /**
   * 清空购物车
   */
  clearCart() {
    this.setData({
      cartNum: 0,
      cartList: [],
      totalPrice: '0.00'
    });
    
    // 清空本地存储中的购物车数据
    wx.setStorageSync('cart', { list: [], totalNum: 0, totalPrice: 0 });
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
    const totalPriceValue = updatedCartList.reduce((total, item) => total + item.num * parseFloat(item.price), 0);
    const totalPrice = totalPriceValue.toFixed(2);
    
    // 更新购物车数据
    this.setData({
      cartList: updatedCartList,
      cartNum: totalNum,
      totalPrice
    });
    
    // 更新本地存储中的购物车数据
    wx.setStorageSync('cart', {
      list: updatedCartList,
      totalNum,
      totalPrice: totalPriceValue * 100
    });
    
    // 如果购物车为空，关闭弹出层
    if (updatedCartList.length === 0) {
      this.showToast('购物车已清空', 'check-circle');
    }
  },
  
  /**
   * 添加商品到购物车
   */
  toAddCart() {
    const { dishList } = this.data;
    
    if (dishList && dishList.length > 0) {
      // 直接使用列表中第一个菜品
      const dish = dishList[0];
      
      if (dish) {
        // 添加商品到购物车
        this.onAddToCart({ 
          currentTarget: { 
            dataset: { 
              item: dish 
            } 
          } 
        });
      }
    } else {
      this.showToast('没有可添加的菜品');
    }
  },
  
  /**
   * 点击添加到购物车按钮
   */
  onAddToCart(e) {
    // 检查e是否是事件对象，以及是否有stopPropagation方法
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation(); // 阻止冒泡，防止触发onDishTap
    }
    
    // 检查e.currentTarget和e.currentTarget.dataset是否存在
    if (!e || !e.currentTarget || !e.currentTarget.dataset) {
      console.error('事件对象格式不正确', e);
      return;
    }
    
    const { item } = e.currentTarget.dataset;
    if (!item) return;
    
    // 获取当前购物车数据
    let { cartList, cartNum } = this.data;
    let totalPrice = parseFloat(this.data.totalPrice || '0');
    
    // 查找购物车中是否已存在该商品
    const existingItemIndex = cartList.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // 如果已存在，数量+1
      cartList[existingItemIndex].num += 1;
    } else {
      // 如果不存在，添加新商品
      cartList.push({
        id: item.id,
        name: item.title || item.name,
        price: (item.price / 100).toFixed(2),
        num: 1,
        specText: '',
        thumb: item.thumb || item.primaryImage
      });
    }
    
    // 更新购物车数量和总价
    cartNum += 1;
    totalPrice += item.price / 100;
    
    // 更新数据
    this.setData({
      cartList,
      cartNum,
      totalPrice: totalPrice.toFixed(2)
    });
    
    // 更新本地存储中的购物车数据
    wx.setStorageSync('cart', {
      list: cartList,
      totalNum: cartNum,
      totalPrice: totalPrice * 100
    });
    
    // 显示添加成功提示
    this.showToast('已加入购物车', 'success');
  },
  
  /**
   * 去结算
   */
  toBuyNow() {
    if (this.data.cartNum <= 0) {
      this.showToast('请先添加菜品到购物车');
      return;
    }
    
    // 显示Loading
    wx.showLoading({
      title: '正在准备订单...',
    });
    
    // 获取购物车数据
    const cartInfo = wx.getStorageSync('cart');
    console.log('当前购物车数据:', cartInfo);
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 跳转到订单确认页面
      wx.navigateTo({
        url: '/pages/order/order-confirm/index',
        success: () => {
          console.log('跳转成功');
        },
        fail: (error) => {
          console.error('跳转失败:', error);
          this.showToast('跳转订单页失败，请重试');
        }
      });
    }, 500);
  },
  
  /**
   * 导航到其他页面
   */
  toNav(e) {
    const { url } = e.detail;
    if (!url) return;
    
    if (url.indexOf('/pages/home/') === 0 || 
        url.indexOf('/pages/cart/') === 0 || 
        url.indexOf('/pages/usercenter/') === 0) {
      // TabBar页面使用switchTab
      wx.switchTab({ url });
    } else {
      // 非TabBar页面使用navigateTo
      wx.navigateTo({ url });
    }
  },
  
  /**
   * 显示Toast提示
   */
  showToast(title, theme = 'none') {
    Toast({
      context: this,
      selector: '#t-toast',
      message: title,
      theme,
      direction: 'column',
    });
  },
  
  /**
   * 分享功能
   */
  onShareAppMessage() {
    const currentCategory = this.data.categoryList[0]?.children[this.data.activeCategory];
    const title = currentCategory ? `${currentCategory.name} - 电子菜单` : '电子菜单分类';
    
    return {
      title: title,
      path: '/pages/goods/category/index',
      imageUrl: this.data.dishList[0]?.thumb || this.data.dishList[0]?.primaryImage
    };
  },
  
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const currentCategory = this.data.categoryList[0]?.children[this.data.activeCategory];
    return {
      title: currentCategory ? `${currentCategory.name} - 电子菜单` : '电子菜单分类',
      query: '',
      imageUrl: this.data.dishList[0]?.thumb || this.data.dishList[0]?.primaryImage
    };
  },
  
  /**
   * 页面显示时触发
   */
  onShow() {
    // 刷新购物车数据
    this.getCartNum();
  },
  
  /**
   * 页面加载时触发
   */
  async onLoad(options) {
    wx.setNavigationBarTitle({
      title: '菜品分类',
    });
    
    // 记录从首页传递的参数
    this.fromHomeOptions = options || {};
    console.log('从首页接收的参数:', this.fromHomeOptions);
    
    this.checkIsIPhoneX();
    this.init();
    
    console.log('加载页面样式成功');
  },
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    // 下拉刷新
    this.init().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  
  /**
   * 打开店铺位置
   */
  openLocation() {
    const { longitude, latitude, address, name } = this.data.shopInfo;
    
    if (!longitude || !latitude) {
      this.showToast('店铺位置信息不完整');
      return;
    }
    
    wx.openLocation({
      longitude: Number(longitude),
      latitude: Number(latitude),
      name: name,
      address: address,
      scale: 18
    });
  },
  
  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack({
      delta: 1,
      fail() {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }
    });
  },
  
  /**
   * 点击搜索框跳转到搜索页面
   */
  onTapSearch() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },
  
  /**
   * 执行菜品搜索
   */
  async searchDishes(keyword) {
    if (!keyword || keyword.trim() === '') {
      this.setData({
        searchResults: [],
        showSearchResult: false,
        isSearching: false,
        searchLoading: false
      });
      return;
    }
    
    this.setData({
      searchLoading: true,
      isSearching: true,
      showSearchResult: true
    });
    
    try {
      // 使用API搜索菜品
      const result = await api.dishes.searchDishes(keyword);
      console.log('API搜索菜品结果:', result);
      
      // 检查API返回的数据结构并提取数据列表
      let dishDataList = [];
      
      if (result) {
        // 情况1: { data: [...] }
        if (result.data && Array.isArray(result.data)) {
          dishDataList = result.data;
        } 
        // 情况2: { data: { list: [...] } }
        else if (result.data && result.data.list && Array.isArray(result.data.list)) {
          dishDataList = result.data.list;
        }
        // 情况3: { data: { spuList: [...] } } - 新增支持
        else if (result.data && result.data.spuList && Array.isArray(result.data.spuList)) {
          dishDataList = result.data.spuList;
          console.log('从data.spuList中获取搜索结果');
        }
        // 情况4: { spuList: [...] } 或 { dishes: [...] }
        else if ((result.spuList && Array.isArray(result.spuList)) || 
                 (result.dishes && Array.isArray(result.dishes))) {
          dishDataList = result.spuList || result.dishes;
        }
        // 情况5: { list: [...] }
        else if (result.list && Array.isArray(result.list)) {
          dishDataList = result.list;
        }
        // 情况6: { data: { dishes: [...] } }
        else if (result.data && result.data.dishes && Array.isArray(result.data.dishes)) {
          dishDataList = result.data.dishes;
        }
        // 情况7: 直接是数组
        else if (Array.isArray(result)) {
          dishDataList = result;
        }
        // 输出完整结构进行调试
        else {
          console.error('无法识别API搜索返回的数据结构，完整数据:', JSON.stringify(result));
          this.setData({
            searchLoading: false,
            empty: true,
            searchResults: []
          });
          return;
        }
      } else {
        console.error('API搜索返回数据为空');
        this.setData({
          searchLoading: false,
          empty: true,
          searchResults: []
        });
        return;
      }
      
      console.log(`从API搜索响应中提取到 ${dishDataList.length} 个菜品`);
      
      if (dishDataList.length === 0) {
        console.warn('提取的搜索结果为空');
        this.setData({
          searchResults: [],
          searchLoading: false,
          empty: true
        });
        return;
      }
      
      // 标准化搜索结果数据
      const searchResults = dishDataList.map(dish => {
        // 处理tags字段，确保它是字符串数组
        let tagsArray = [];
        if (dish.tags) {
          // 如果tags是字符串，尝试解析JSON
          if (typeof dish.tags === 'string') {
            try {
              // 尝试解析JSON
              const parsedTags = JSON.parse(dish.tags);
              
              // 如果解析后是数组，直接使用
              if (Array.isArray(parsedTags)) {
                tagsArray = parsedTags;
              } 
              // 如果解析后是对象，尝试提取值
              else if (typeof parsedTags === 'object') {
                tagsArray = Object.values(parsedTags).filter(v => !!v);
              } 
              // 其他情况，作为单个标签
              else {
                tagsArray = [String(parsedTags)];
              }
            } catch (e) {
              // 如果解析失败，将其作为单个标签
              tagsArray = [dish.tags];
            }
          }
          // 如果tags是数组，直接使用
          else if (Array.isArray(dish.tags)) {
            tagsArray = dish.tags;
          } 
          // 如果tags是对象，尝试提取有用的信息
          else if (typeof dish.tags === 'object') {
            // 尝试从对象中提取键或值作为标签
            tagsArray = Object.values(dish.tags).filter(value => !!value);
            if (tagsArray.length === 0) {
              tagsArray = Object.keys(dish.tags);
            }
          }
        }
        
        // 确保tags数组中的每个元素都是字符串
        tagsArray = tagsArray.map(tag => {
          if (tag === null || tag === undefined) {
            return '';
          }
          
          if (typeof tag === 'object') {
            // 如果标签是对象，尝试提取name或text字段
            return tag.name || tag.text || tag.value || tag.label || '';
          }
          
          return String(tag);
        }).filter(tag => tag && tag.trim() !== ''); // 过滤掉空标签
        
        return {
          id: dish.id || dish.spuId || dish.dishId,
          spuId: dish.spuId || dish.id || dish.dishId,
          title: dish.title || dish.name,
          name: dish.name || dish.title,
          price: dish.price || 0,
          originalPrice: dish.originPrice || dish.originalPrice || dish.price || 0,
          thumb: dish.thumb || dish.primaryImage || dish.image,
          primaryImage: dish.primaryImage || dish.thumb || dish.image,
          soldNum: dish.soldNum || dish.sales || 0,
          sales: dish.sales || dish.soldNum || 0,
          stockQuantity: dish.stockQuantity || dish.stock || 999,
          description: dish.description || dish.desc || '',
          tags: tagsArray
        };
      });
      
      console.log(`搜索到 ${searchResults.length} 个匹配菜品`);
      
      // 更新搜索结果
      this.setData({
        searchResults,
        searchLoading: false,
        empty: searchResults.length === 0
      });
    } catch (error) {
      console.error('搜索菜品失败:', error);
      this.setData({
        searchLoading: false,
        empty: true,
        searchResults: []
      });
      
      this.showToast('搜索失败，请重试');
    }
  },
  
  /**
   * 处理搜索输入变化
   */
  onSearchChange(e) {
    const value = e.detail.value || '';
    
    this.setData({
      searchValue: value
    });
    
    // 如果输入为空，清空搜索结果
    if (!value.trim()) {
      this.setData({
        searchResults: [],
        showSearchResult: false,
        isSearching: false
      });
      return;
    }
    
    // 防抖：延迟搜索，避免频繁搜索
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    
    this.searchTimer = setTimeout(() => {
      this.searchDishes(value);
    }, 500);
  },
  
  /**
   * 确认搜索
   */
  onSearchConfirm() {
    const { searchValue } = this.data;
    
    // 直接执行搜索，不再延迟
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    
    this.searchDishes(searchValue);
  },
  
  /**
   * 清空搜索
   */
  onClearSearch() {
    this.setData({
      searchValue: '',
      searchResults: [],
      showSearchResult: false,
      isSearching: false
    });
  },
  
  /**
   * 关闭搜索结果
   */
  onCloseSearch() {
    this.setData({
      searchValue: '',
      searchResults: [],
      showSearchResult: false,
      isSearching: false
    });
  },
  
  /**
   * 下拉加载更多搜索结果
   */
  onLoadMore() {
    // 如果是搜索状态，但不是搜索结果页，不处理
    if (!this.data.isSearching || !this.data.showSearchResult) {
      return;
    }
    
    // 搜索结果页加载更多逻辑
    // 因为目前是一次性获取所有结果，这里不需要额外处理
  },
  
  checkIsIPhoneX() {
    wx.getSystemInfo({
      success: (res) => {
        const isIPhoneX = res.model.indexOf('iPhone X') > -1 || 
                         res.model.indexOf('iPhone 11') > -1 || 
                         res.model.indexOf('iPhone 12') > -1 || 
                         res.model.indexOf('iPhone 13') > -1 || 
                         res.model.indexOf('iPhone 14') > -1 || 
                         res.model.indexOf('iPhone 15') > -1;
        this.setData({
          isIPhoneX
        });
      }
    });
  }
});
