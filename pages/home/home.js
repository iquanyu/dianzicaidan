import { fetchHome } from '../../services/home/home';
import { fetchGoodsList, fetchDishList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';
import { api } from '../../utils/api';
import { fetchDishCategories, fetchDishesByCategory } from '../../services/dish/fetchDishes';

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
    tabValue: 0,
    isSmallScreen: false,
    statusBarHeight: 0,
    customNavHeight: 0,
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    // 先初始化tabList以防止切换分类时报错
    this.setData({
      tabValue: 0
    });
    
    // 获取系统信息，适配不同屏幕尺寸
    this.getSystemInfo();
    
    // 继续其他初始化
    this.init();
    wx.setNavigationBarTitle({
      title: '电子菜单'
    });
  },

  // 获取系统信息，适配不同屏幕尺寸
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const isSmallScreen = systemInfo.screenWidth <= 375;
      
      console.log('系统信息:', systemInfo);
      console.log('是否小屏幕设备:', isSmallScreen);
      
      // 设置自定义导航栏高度
      const statusBarHeight = systemInfo.statusBarHeight;
      const customNavHeight = statusBarHeight + 46;
      
      this.setData({
        isSmallScreen,
        statusBarHeight,
        customNavHeight
      });
    } catch (error) {
      console.error('获取系统信息失败:', error);
    }
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  async loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });

    try {
      // 使用API获取首页数据
      const homeData = await api.home.getHomeData();
      console.log('首页数据:', homeData);
      console.log('首页数据结构:', JSON.stringify(homeData, null, 2));
      
      // 根据API文档解析轮播图数据
      // 文档格式: { code, data: { swiper: [{id, img_url, link_url}] }, msg, success, requestId }
      let swiper = [];
      
      if (homeData && homeData.data) {
        // 检查标准格式
        if (Array.isArray(homeData.data.swiper)) {
          console.log('使用标准格式: data.swiper');
          swiper = homeData.data.swiper.map(item => item.img_url);
        }
        // 检查其他可能的轮播图字段
        else {
          const possibleFields = ['banners', 'carousel', 'slideshow', 'images'];
          
          for (const field of possibleFields) {
            if (Array.isArray(homeData.data[field])) {
              console.log(`找到轮播图数据在: data.${field}`);
              // 根据不同字段格式，提取图片URL
              swiper = homeData.data[field].map(item => {
                if (typeof item === 'string') return item;
                return item.img_url || item.image || item.url || item.src || '';
              });
              break;
            }
          }
        }
      }
      
      console.log('解析后的轮播图:', swiper);
      
      // 使用API获取菜品分类
      const categoriesResult = await fetchDishCategories();
      console.log('分类数据:', categoriesResult);
      console.log('分类数据结构:', JSON.stringify(categoriesResult, null, 2));
      
      // 格式化分类数据
      let tabList = [];
      
      // 按照API文档的格式处理分类数据
      // 文档格式: { code, data: { categoryList: [...] }, msg, success, requestId }
      if (categoriesResult) {
        let categories = [];
        
        // 首先检查标准文档格式: data.categoryList
        if (categoriesResult.data && Array.isArray(categoriesResult.data.categoryList)) {
          console.log('使用标准API格式: data.categoryList');
          categories = categoriesResult.data.categoryList;
        }
        // 检查其他可能的格式
        else if (categoriesResult.data) {
          // 如果data直接是数组
          if (Array.isArray(categoriesResult.data)) {
            console.log('使用data数组作为分类数据');
            categories = categoriesResult.data;
          }
          // 检查data对象中的其他可能字段
          else {
            // 尝试找出可能的分类数组字段
            const possibleFields = ['categories', 'list', 'items', 'records', 'tabList'];
            
            for (const field of possibleFields) {
              if (Array.isArray(categoriesResult.data[field])) {
                console.log(`找到分类数据在: data.${field}`);
                categories = categoriesResult.data[field];
                break;
              }
            }
          }
        }
        
        console.log('解析后的分类数据长度:', categories.length);
        
        if (categories && categories.length > 0) {
          // 打印分类列表的每个项目，查看具体结构
          console.log('分类数据列表:');
          categories.forEach((item, index) => {
            console.log(`分类${index+1}:`, JSON.stringify(item, null, 2));
          });
          
          // 添加去重逻辑，防止重复的分类名称
          const uniqueCategories = [];
          const seenTexts = new Set(); // 用于跟踪已经看到的分类名称
          
          for (const item of categories) {
            const text = item.name || item.text || item.categoryName || item.title;
            if (text && !seenTexts.has(text.trim().toLowerCase())) {
              seenTexts.add(text.trim().toLowerCase());
              uniqueCategories.push(item);
              // 移除限制，保留所有不重复的分类
              // if (uniqueCategories.length >= 4) break;
            }
          }
          
          console.log('去重后的分类数量:', uniqueCategories.length);
          
          // 转换为小程序需要的格式，使用去重后的分类
          tabList = uniqueCategories.map((item, index) => {
            return {
              text: item.name || item.text || item.categoryName || item.title || `分类${index+1}`,
              key: index,
              categoryId: item.id || item.categoryId || index
            };
          });
          
          console.log('格式化后的tabList (去重):', tabList);
        }
      }
      
      // 如果没有获取到分类数据，或者获取的数据少于4个，使用默认分类
      if (!tabList || tabList.length === 0) {
        console.log('API返回的分类数据为空');
        // 不再使用默认分类
        tabList = [];
      } else if (tabList.length < 4) {
        // 移除默认分类补充逻辑，直接使用API返回的分类，即使少于4个
        console.log('API返回的分类数量不足4个，不再使用默认分类补充');
      }
      
      // 如果没有获取到轮播图，添加一个默认轮播图
      if (!swiper || swiper.length === 0) {
        console.log('使用默认轮播图');
        swiper = [
          'https://cdn-we-retail.ym.tencent.com/tsr/home/banner1.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/home/banner2.png'
        ];
      }
      
      this.setData({
        imgSrcs: swiper,
        tabList: tabList,
        pageLoading: false
      }, () => {
        // 确保tabList更新后才加载商品列表
        // 防止privateData.tabIndex超出tabList范围
        if (this.privateData.tabIndex >= this.data.tabList.length) {
          this.privateData.tabIndex = 0;
        }
        
        // 打印最终使用的分类列表
        console.log('========== 首页最终使用的分类列表 ==========');
        this.data.tabList.forEach((category, index) => {
          console.log(`分类${index+1}: ${category.text} (ID: ${category.categoryId})`);
        });
        console.log('==============================================');
        
        // 加载商品列表
        this.loadGoodsList(true);
      });
    } catch (error) {
      console.error('加载首页数据失败:', error);
      
      // 出错时不使用默认分类数据，而是设置空数据
      this.setData({
        imgSrcs: [],
        tabList: [], // 移除默认分类，使用空数组
        pageLoading: false
      });
      
      // 加载商品列表
      this.loadGoodsList(true);
      
      // 显示错误提示
      Toast({
        context: this,
        selector: '#t-toast',
        message: '加载数据失败，请检查网络',
        icon: 'error'
      });
    }
  },

  tabChangeHandle(e) {
    // 获取当前选中的分类索引
    const currentIndex = e.detail.value !== undefined ? e.detail.value : e.detail;
    console.log('==== 切换分类事件触发 ====');
    console.log('事件对象:', e);
    console.log('当前选中索引:', currentIndex);
    
    // 安全检查tabList数据
    if (this.data.tabList && this.data.tabList[currentIndex]) {
      console.log('分类名称:', this.data.tabList[currentIndex].text);
    } else {
      console.log('警告: 无法获取分类名称，tabList或索引无效');
      console.log('当前tabList:', this.data.tabList);
      console.log('当前tabValue:', this.data.tabValue);
    }
    
    // 更新当前分类索引
    this.privateData.tabIndex = currentIndex;
    
    // 更新tabValue到data中，确保UI响应变化
    this.setData({
      tabValue: currentIndex
    }, () => {
      // 在回调中确认数据已更新
      console.log('tabValue已更新为:', this.data.tabValue);
      
      // 重新加载数据
      this.loadGoodsList(true);
    });
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    console.log('==== 开始加载菜品数据 ====');
    console.log('当前分类索引:', this.privateData.tabIndex);
    console.log('当前tabValue:', this.data.tabValue);
    
    const pageSize = this.goodListPagination.num;
    let pageIndex = this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 1;
    }

    try {
      // 确保使用最新的分类索引
      const currentTabIndex = this.privateData.tabIndex;
      console.log('请求菜品数据，分类索引:', currentTabIndex);
      
      // 获取当前分类ID 
      let categoryId = this.data.tabList[currentTabIndex]?.categoryId || `category_${currentTabIndex}`;
      
      // 处理category_X格式的分类ID，转换为数字
      if (typeof categoryId === 'string' && categoryId.startsWith('category_')) {
        // 提取数字部分
        const idMatch = categoryId.match(/category_(\d+)/);
        if (idMatch && idMatch[1]) {
          categoryId = idMatch[1];
        } else {
          // 如果无法提取，默认使用索引号+1作为ID
          categoryId = (currentTabIndex + 1).toString();
        }
      }
      
      console.log('处理后的分类ID:', categoryId);
      
      // 使用API直接获取菜品列表
      let nextList = [];
      
      // 尝试API获取菜品
      try {
        // 使用正确的API路径获取菜品数据
        const response = await api.categories.getCategoryDishes(categoryId, pageIndex, pageSize);
        console.log('API直接返回的菜品数据:', response);
        console.log('API返回数据类型:', typeof response);
        console.log('API返回数据结构:', JSON.stringify(response, null, 2));
        
        // 根据API的实际返回格式处理数据
        if (response) {
          console.log('API状态码:', response.code);
          console.log('API成功标志:', response.success);
          
          // 根据API文档的格式进行解析
          // API格式: { code, data: { totalCount, pageSize, currentPage, spuList }, msg, success, requestId }
          let dishList = [];
          
          // 首先检查data.spuList (根据API文档的标准格式)
          if (response.data && Array.isArray(response.data.spuList)) {
            console.log('API标准格式: 使用data.spuList字段');
            dishList = response.data.spuList;
          }
          // 然后检查其他可能的路径
          else if (response.data && typeof response.data === 'object') {
            console.log('检查data对象中的菜品列表');
            
            // 尝试各种可能的字段名
            const possibleFields = ['dishes', 'list', 'items', 'records', 'dishList', 'goodsList'];
            
            for (const field of possibleFields) {
              if (Array.isArray(response.data[field])) {
                console.log(`找到菜品数据在: data.${field}`);
                dishList = response.data[field];
                break;
              }
            }
            
            // 如果response.data本身就是数组
            if (dishList.length === 0 && Array.isArray(response.data)) {
              console.log('data字段本身是数组，直接使用');
              dishList = response.data;
            }
          }
          
          console.log('解析后的菜品列表长度:', dishList.length);
          
          if (dishList && dishList.length > 0) {
            // 打印第一个菜品的结构，帮助调试
            console.log('第一个菜品的结构:', JSON.stringify(dishList[0], null, 2));
            
            // 根据API文档格式转换为小程序需要的格式
            nextList = dishList.map(item => {
              // 确保所有必需字段都有值，防止空白卡片
              if (!item) return null;
              
              return {
                id: item.id || item.spuId || '',
                spuId: item.spuId || item.id || '',
                title: item.title || item.name || item.dishName || '',
                thumb: item.thumb || item.primaryImage || item.image || item.img_url || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''),
                price: typeof item.price === 'string' ? Number(item.price) : (typeof item.price === 'number' ? item.price : 0),
                originPrice: typeof item.originPrice === 'string' ? Number(item.originPrice) : (item.originPrice || item.origin_price || item.price || 0),
                tags: Array.isArray(item.tags) ? item.tags : [],
                spuTagList: Array.isArray(item.tags) 
                  ? item.tags.map(tag => typeof tag === 'string' ? { title: tag } : tag) 
                  : [],
                stockQuantity: item.stock_quantity || item.stockQuantity || 999,
                soldNum: item.sold_count || item.soldNum || 0,
                desc: item.desc || item.description || ''
              };
            }).filter(item => item !== null && item.title && (item.thumb || item.price));
            
            console.log('格式化后的菜品列表:', nextList);
          } else {
            console.warn('无法从API响应中提取菜品列表:', response);
          }
        }
      } catch (apiError) {
        console.error('直接API调用失败，尝试使用fetchDishesByCategory:', apiError);
        
        // 如果直接API调用失败，尝试使用fetchDishesByCategory
        const result = await fetchDishesByCategory(categoryId, { page: pageIndex, pageSize: pageSize });
        console.log('fetchDishesByCategory返回的菜品数据:', result);
        
        if (result.code === 'Success' && result.data && result.data.spuList) {
          nextList = result.data.spuList.map(item => {
            if (!item) return null;
            
            return {
              id: item.id || item.spuId || '',
              spuId: item.spuId || item.id || '',
              title: item.title || item.name || '',
              thumb: item.thumb || item.primaryImage || '',
              price: typeof item.price === 'number' ? item.price : 0,
              originPrice: item.originPrice || item.originalPrice || item.price || 0,
              tags: Array.isArray(item.tags) ? item.tags : [],
              spuTagList: Array.isArray(item.tags) ? item.tags.map(tag => ({ title: tag })) : [],
              stockQuantity: item.stockQuantity || 999,
              soldNum: item.soldNum || 0,
              desc: item.description || item.desc || '',
            };
          }).filter(item => item !== null && item.title);
        }
      }
      
      // 如果没有获取到数据，尝试从model中获取
      if (!nextList || nextList.length === 0) {
        console.log('未获取到菜品数据，尝试从model中获取');
        
        try {
          const modelResult = await fetchDishList(pageIndex, pageSize, currentTabIndex);
          if (modelResult && modelResult.length > 0) {
            nextList = modelResult.filter(item => item && item.title);
          }
        } catch (modelError) {
          console.error('从model获取数据也失败:', modelError);
        }
      }
      
      // 打印获取到的菜品数据
      console.log('最终菜品数量:', nextList.length);
      if (nextList.length > 0) {
        console.log('菜品示例:', nextList[0].title);
      } else {
        console.log('警告: 未获取到任何菜品数据');
      }
      
      // 确保nextList是一个数组，并移除无效的商品项
      if (!Array.isArray(nextList)) {
        nextList = [];
      }
      
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: nextList.length < pageSize ? 2 : 0, // 如果返回的数据少于页面大小，表示已加载全部
      }, () => {
        console.log('菜品数据已更新，当前数量:', this.data.goodsList.length);
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      console.error('加载菜品数据失败:', err);
      this.setData({ goodsListLoadStatus: 3 });
      
      // 显示错误提示
      Toast({
        context: this,
        selector: '#t-toast',
        message: '加载菜品失败，请稍后重试',
        icon: 'error'
      });
    }
  },

  goodListClickHandle(e) {
    const { index } = e.detail;
    const item = this.data.goodsList[index];
    if (!item) {
      console.error('商品不存在:', index);
      return;
    }
    
    // 打印日志，便于调试
    console.log('点击菜品:', item);
    
    // 获取菜品ID，优先使用spuId
    const spuId = item.spuId || item.id || '';
    if (!spuId) {
      console.error('菜品spuId不存在');
      wx.showToast({
        title: '菜品信息不完整',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到详情页，使用spuId作为主要参数
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '已加入购物车',
    });
  },

  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },

  // 跳转到分类页面
  navToCategoryPage() {
    // 显示按钮点击动效
    wx.vibrateShort({
      type: 'light'
    });
    
    // 获取当前选中的分类ID和索引
    const currentIndex = this.data.tabValue;
    const currentCategory = this.data.tabList[currentIndex] || {};
    const categoryId = currentCategory.categoryId || '';
    
    console.log('跳转到分类页面，当前分类:', currentCategory.text, '分类ID:', categoryId);
    
    wx.navigateTo({
      url: `/pages/goods/category/index?categoryId=${categoryId}&tabIndex=${currentIndex}`
    });
  },

  // 处理原生Tab按钮点击
  nativeTabChange(e) {
    const currentIndex = e.currentTarget.dataset.index;
    console.log('原生Tab点击:', currentIndex);
    
    // 更新当前分类索引
    this.privateData.tabIndex = currentIndex;
    
    // 更新tabValue到data中，同步更新UI
    this.setData({
      tabValue: currentIndex
    });
    
    // 重新加载数据
    this.loadGoodsList(true);
  },
  
  // 切换到下一个分类
  switchToNextCategory() {
    // 获取当前分类索引和分类总数
    const currentTabIndex = this.data.tabValue;
    const tabCount = this.data.tabList.length;
    
    // 计算下一个分类的索引，如果当前是最后一个则回到第一个
    const nextTabIndex = (currentTabIndex + 1) % tabCount;
    
    console.log('切换到下一个分类:', nextTabIndex);
    
    // 更新当前分类索引
    this.privateData.tabIndex = nextTabIndex;
    
    // 更新tabValue到data中，同步更新UI
    this.setData({
      tabValue: nextTabIndex
    });
    
    // 显示按钮震动反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    // 重新加载数据
    this.loadGoodsList(true);
  },
});
