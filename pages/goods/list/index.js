import { fetchGoodsList } from '../../../services/good/fetchGoodsList';
import Toast from 'tdesign-miniprogram/toast/index';
import { fetchDishes, fetchDishesByCategory, fetchRecommendedDishes, fetchNewDishes } from '../../../services/dish/fetchDishes';

const initFilters = {
  overall: 1,
  sorts: '',
  layout: 0,
};

Page({
  data: {
    goodsList: [],
    layout: 0,
    sorts: ['综合', '价格低', '价格高'],
    sortValue: '',
    desc: true,
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    currency: '¥',
    filterPopupShow: false,
    filterPopupTitle: '筛选',
    loadingStatus: 0,
    priceRangeTitle: '',
    categoryValue: [],
    load: true,
    superCategoryId: '',
    categoryList: [],
    typeTitle: '全部菜品',
    show: false,
    minVal: '',
    maxVal: '',
    filter: initFilters,
    hasLoaded: false,
    loadMoreStatus: 0,
    loading: true,
    categoryId: '',
    groupId: '',
  },

  total: 0,
  superCategoryId: '',
  subCategoryId: '',
  thirdCategoryId: '',
  pageNum: 1,
  pageSize: 30,
  hasLoaded: false,
  priceRangeArray: [[0, 50], [50, 100], [100, 200], [200, 400], [400, 1000]],

  handleFilterChange(e) {
    const { filterData = {} } = e.detail;
    const { layout, overall, sorts } = filterData;
    this.pageNum = 1;
    this.setData({
      layout,
      sorts,
      overall,
      loadMoreStatus: 0,
    });
    this.init(true);
  },

  generalQueryData(reset = false) {
    const { filter = {}, sortType = null } = this.data;
    const { minPrice = '', maxPrice = '' } = filter;
    const params = {
      minPrice,
      maxPrice,
      sortType,
    };

    if (sortType) {
      params.sort = 1;
      params.sortType = sortType === 'desc' ? 1 : 0;
    }

    if (overall) {
      params.sort = 0;
    } else {
      params.sort = 1;
    }
    if (reset) return params;
    return {
      ...params,
      pageNum: this.pageNum + 1,
      pageSize: this.pageSize,
    };
  },

  async init(reset = true) {
    const { loadMoreStatus, goodsList = [] } = this.data;
    const params = this.generalQueryData(reset);
    if (loadMoreStatus !== 0) return;
    this.setData({
      loadMoreStatus: 1,
      loading: true,
    });
    try {
      const { groupId, categoryId } = this.data;
      let result = {};
      
      if (categoryId) {
        result = await fetchDishesByCategory(categoryId, params);
      } else if (groupId === 'recommend') {
        result = await fetchRecommendedDishes(params);
      } else if (groupId === 'new') {
        result = await fetchNewDishes(params);
      } else {
        result = await fetchDishes(params);
      }
      
      const { spuList, totalCount = 0 } = result;
      if (totalCount === 0 && reset) {
        this.total = totalCount;
        this.setData({
          emptyInfo: {
            tip: '抱歉，未找到相关商品',
          },
          hasLoaded: true,
          loadMoreStatus: 0,
          loading: false,
          goodsList: [],
        });
        return;
      }

      const _goodsList = reset ? spuList : goodsList.concat(spuList);
      const _loadMoreStatus = _goodsList.length === totalCount ? 2 : 0;
      this.pageNum = params.pageNum || 1;
      this.total = totalCount;
      this.setData({
        goodsList: _goodsList,
        loadMoreStatus: _loadMoreStatus,
      });
    } catch (error) {
      this.setData({
        loading: false,
      });
    }
    this.setData({
      hasLoaded: true,
      loading: false,
    });
  },

  onLoad(options) {
    const { title, superCategoryId, subCategoryId, thirdCategoryId } = options;

    wx.setNavigationBarTitle({
      title: title || '菜品列表',
    });

    const { groupId = '', categoryId = '' } = options;
    this.setData({
      groupId,
      categoryId,
    });
    this.init(true);
  },

  onReachBottom() {
    const { goodsList } = this.data;
    const { total = 0 } = this;
    if (goodsList.length === total) {
      this.setData({
        loadMoreStatus: 2,
      });
      return;
    }
    this.init(false);
  },

  handleAddCart() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加购',
    });
  },

  tagClickHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击标签',
    });
  },

  gotoGoodsDetail(e) {
    const { index } = e.detail;
    const { id } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?dishId=${id}`,
    });
  },

  showFilterPopup() {
    this.setData({
      show: true,
    });
  },

  showFilterPopupClose() {
    this.setData({
      show: false,
    });
  },

  onMinValAction(e) {
    const { value } = e.detail;
    this.setData({ minVal: value });
  },

  onMaxValAction(e) {
    const { value } = e.detail;
    this.setData({ maxVal: value });
  },

  reset() {
    this.setData({ minVal: '', maxVal: '' });
  },

  confirm() {
    const { minVal, maxVal } = this.data;
    let message = '';
    if (minVal && !maxVal) {
      message = `价格最小是${minVal}`;
    } else if (!minVal && maxVal) {
      message = `价格范围是0-${minVal}`;
    } else if (minVal && maxVal && minVal <= maxVal) {
      message = `价格范围${minVal}-${this.data.maxVal}`;
    } else {
      message = '请输入正确范围';
    }
    if (message) {
      Toast({
        context: this,
        selector: '#t-toast',
        message,
      });
    }
    this.pageNum = 1;
    this.setData(
      {
        show: false,
        minVal: '',
        goodsList: [],
        loadMoreStatus: 0,
        maxVal: '',
      },
      () => {
        this.init();
      },
    );
  },
});
