import {
  getSearchHistory,
  getSearchPopular,
} from '../../../services/good/fetchSearchHistory';
import { fetchDishesByCategory } from '../../../services/dish/fetchDishes';
import { getDishCategoryList } from '../../../model/dishCategory';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    historyWords: [],
    popularWords: [],
    searchValue: '',
    dialog: {
      title: '确认删除当前历史记录',
      showCancelButton: true,
      message: '',
    },
    dialogShow: false,
    searchHistory: [],
    searchResults: [],
    hotKeywords: [
      '熊掌',
      '鱼香肉丝',
      '回锅肉',
      '小龙虾',
      '水煮鱼',
      '红烧肉',
      '辣子鸡',
      '酸菜鱼'
    ],
    loading: false,
    isSearching: false,
    allDishes: [],
  },

  deleteType: 0,
  deleteIndex: '',

  onShow() {
    this.queryHistory();
    this.queryPopular();
  },

  async queryHistory() {
    try {
      const data = await getSearchHistory();
      const code = 'Success';
      if (String(code).toUpperCase() === 'SUCCESS') {
        const { historyWords = [] } = data;
        this.setData({
          historyWords,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  async queryPopular() {
    try {
      const data = await getSearchPopular();
      const code = 'Success';
      if (String(code).toUpperCase() === 'SUCCESS') {
        const { popularWords = [] } = data;
        this.setData({
          popularWords,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  confirm() {
    const { historyWords } = this.data;
    const { deleteType, deleteIndex } = this;
    historyWords.splice(deleteIndex, 1);
    if (deleteType === 0) {
      this.setData({
        historyWords,
        dialogShow: false,
      });
    } else {
      this.setData({ historyWords: [], dialogShow: false });
    }
  },

  close() {
    this.setData({ dialogShow: false });
  },

  handleClearHistory() {
    const { dialog } = this.data;
    this.deleteType = 1;
    this.setData({
      dialog: {
        ...dialog,
        message: '确认删除所有历史记录',
      },
      dialogShow: true,
    });
  },

  deleteCurr(e) {
    const { index } = e.currentTarget.dataset;
    const { dialog } = this.data;
    this.deleteIndex = index;
    this.setData({
      dialog: {
        ...dialog,
        message: '确认删除当前历史记录',
        deleteType: 0,
      },
      dialogShow: true,
    });
  },

  handleHistoryTap(e) {
    const { historyWords } = this.data;
    const { dataset } = e.currentTarget;
    const _searchValue = historyWords[dataset.index || 0] || '';
    if (_searchValue) {
      wx.navigateTo({
        url: `/pages/goods/result/index?searchValue=${_searchValue}`,
      });
    }
  },

  handleSubmit(e) {
    const { value } = e.detail.value;
    if (value.length === 0) return;
    wx.navigateTo({
      url: `/pages/goods/result/index?searchValue=${value}`,
    });
  },

  onLoad: function (options) {
    this.getSearchHistory();
    
    if (options && options.keyword) {
      this.setData({
        searchValue: options.keyword
      });
      this.onSearchConfirm();
    }
    
    this.preloadAllDishes();
  },

  async preloadAllDishes() {
    try {
      this.setData({ loading: true });
      
      let allDishes = [];
      
      const categoryList = getDishCategoryList();
      
      if (categoryList && categoryList.length > 0) {
        let categories = [];
        
        if (categoryList[0].children && categoryList[0].children.length > 0) {
          categories = categoryList[0].children;
        } else {
          categories = categoryList;
        }
        
        // 不限制分类数量，加载所有分类的菜品
        // const limitedCategories = categories.slice(0, 3);
        
        const dishesPromises = categories.map(category => this.getDishList(category.categoryId));
        const categoriesDishes = await Promise.all(dishesPromises);
        
        categoriesDishes.forEach(dishes => {
          if (dishes && dishes.length > 0) {
            allDishes = allDishes.concat(dishes);
          }
        });
      }
      
      console.log(`预加载了 ${allDishes.length} 个菜品数据`);
      
      this.setData({
        allDishes,
        loading: false
      });
    } catch (error) {
      console.error('预加载菜品数据失败:', error);
      this.setData({ loading: false });
    }
  },

  async getDishList(categoryId) {
    if (!categoryId) {
      console.error('分类ID不存在');
      return [];
    }
    
    try {
      console.log('获取分类菜品，分类ID:', categoryId);
      const result = await fetchDishesByCategory(categoryId);
      return (result && result.spuList) || [];
    } catch (error) {
      console.error('获取菜品列表失败:', error);
      return [];
    }
  },

  onSearchChange(e) {
    const value = e.detail.value || '';
    
    this.setData({
      searchValue: value
    });
    
    if (!value.trim()) {
      this.setData({
        searchResults: [],
        isSearching: false
      });
    }
  },

  onSearchConfirm() {
    const { searchValue } = this.data;
    
    if (!searchValue || !searchValue.trim()) {
      return;
    }
    
    this.searchDishes(searchValue);
    
    this.addToHistory(searchValue);
  },

  async searchDishes(keyword) {
    if (!keyword || keyword.trim() === '') {
      return;
    }
    
    this.setData({
      loading: true,
      isSearching: true
    });
    
    try {
      if (this.data.allDishes.length > 0) {
        this.performLocalSearch(keyword);
        return;
      }
      
      let allDishes = [];
      
      const categoryList = getDishCategoryList();
      
      if (categoryList && categoryList.length > 0) {
        let categories = [];
        
        if (categoryList[0].children && categoryList[0].children.length > 0) {
          categories = categoryList[0].children;
        } else {
          categories = categoryList;
        }
        
        const dishesPromises = categories.map(category => this.getDishList(category.id));
        const categoriesDishes = await Promise.all(dishesPromises);
        
        categoriesDishes.forEach(dishes => {
          if (dishes && dishes.length > 0) {
            allDishes = allDishes.concat(dishes);
          }
        });
      }
      
      this.setData({ allDishes });
      
      this.performLocalSearch(keyword);
    } catch (error) {
      console.error('搜索菜品失败:', error);
      this.setData({
        loading: false,
        searchResults: []
      });
      
      this.showToast('搜索失败，请重试');
    }
  },
  
  performLocalSearch(keyword) {
    const { allDishes } = this.data;
    const searchKeyword = keyword.toLowerCase().trim();
    
    if (!searchKeyword) {
      this.setData({
        searchResults: [],
        loading: false
      });
      return;
    }
    
    const results = allDishes.filter(dish => {
      const name = (dish.name || dish.title || '').toLowerCase();
      const description = (dish.description || '').toLowerCase();
      const tags = (dish.tags || []).join(' ').toLowerCase();
      
      return name.includes(searchKeyword) || 
             description.includes(searchKeyword) || 
             tags.includes(searchKeyword);
    });
    
    console.log(`搜索关键词: "${searchKeyword}", 搜索到 ${results.length} 个匹配菜品`);
    
    this.setData({
      searchResults: results,
      loading: false
    });
    
    if (results.length === 0) {
      this.showToast('未找到匹配的菜品');
    }
  },

  onClearSearch() {
    this.setData({
      searchValue: '',
      searchResults: [],
      isSearching: false
    });
  },

  onBack() {
    wx.navigateBack();
  },

  getSearchHistory() {
    try {
      const history = wx.getStorageSync('searchHistory') || [];
      this.setData({
        searchHistory: history
      });
    } catch (e) {
      console.error('获取搜索历史失败', e);
    }
  },

  addToHistory(keyword) {
    if (!keyword) return;
    
    let { searchHistory } = this.data;
    
    searchHistory = searchHistory.filter(item => item !== keyword);
    
    searchHistory.unshift(keyword);
    
    if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10);
    }
    
    this.setData({ searchHistory });
    
    try {
      wx.setStorageSync('searchHistory', searchHistory);
    } catch (e) {
      console.error('保存搜索历史失败', e);
    }
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] });
          wx.removeStorageSync('searchHistory');
        }
      }
    });
  },

  onHistoryTap(e) {
    const { keyword } = e.currentTarget.dataset;
    
    this.setData({
      searchValue: keyword
    });
    
    this.onSearchConfirm();
  },

  onHotKeywordTap(e) {
    const { keyword } = e.currentTarget.dataset;
    
    this.setData({
      searchValue: keyword
    });
    
    this.onSearchConfirm();
  },

  onDishTap(e) {
    const { item } = e.currentTarget.dataset;
    if (!item || !item.id) return;
    
    wx.navigateTo({
      url: `/pages/goods/details/index?id=${item.id}`
    });
  },

  onAddToCart(e) {
    e.stopPropagation();
    
    const { item } = e.currentTarget.dataset;
    if (!item) return;
    
    // 获取当前购物车数据
    let cartInfo = wx.getStorageSync('cart') || { list: [], totalNum: 0, totalPrice: 0 };
    let cartList = cartInfo.list || [];
    let cartNum = cartInfo.totalNum || 0;
    let totalPrice = cartInfo.totalPrice ? (cartInfo.totalPrice / 100) : 0;
    
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
    
    // 更新本地存储中的购物车数据
    wx.setStorageSync('cart', {
      list: cartList,
      totalNum: cartNum,
      totalPrice: totalPrice * 100
    });
    
    // 显示添加成功提示
    this.showToast('已加入购物车', 'success');
  },

  showToast(title, theme = 'none') {
    Toast({
      context: this,
      selector: '#t-toast',
      message: title,
      theme,
      direction: 'column',
    });
  }
});
