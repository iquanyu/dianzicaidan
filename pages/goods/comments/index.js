import { api, getToken } from '../../../utils/api';
import dayjs from 'dayjs';

// 筛选类型映射
const FILTER_TYPES = {
  '': 'all',       // 全部评论
  '5': 'self',     // 我的评论
  '4': 'image',    // 带图评论
  '3': 'good',     // 好评(4-5星)
  '2': 'medium',   // 中评(3星)
  '1': 'bad'       // 差评(1-2星)
};

Page({
  data: {
    pageLoading: false,
    commentList: [],
    pageNum: 1,
    myPageNum: 1,
    pageSize: 10,
    total: 0,
    myTotal: 0,
    hasLoaded: false,
    loadMoreStatus: 0,
    myLoadStatus: 0,
    spuId: '',
    dishId: '',
    commentType: '',
    totalCount: 0,
    countObj: {
      badCount: '0',
      commentCount: '0',
      goodCount: '0',
      middleCount: '0',
      hasImageCount: '0',
      uidCount: '0',
    },
    ratingDistribution: {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0
    },
    averageRating: 0,
    goodRate: 0,
    showWriteComment: false,
    isLoggedIn: false,    // 用户登录状态
  },
  
  onLoad(options) {
    console.log('评论列表页接收参数:', options);
    const { dishId, spuId, showWriteComment } = options;
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '菜品评价'
    });
    
    // 检查用户登录状态
    const token = getToken();
    const isLoggedIn = !!token;
    
    this.setData({
      dishId: dishId || spuId || '',
      spuId: dishId || spuId || '',
      showWriteComment: showWriteComment === 'true' && isLoggedIn,
      isLoggedIn: isLoggedIn
    });
    
    // 如果需要直接跳转到写评论页面，且用户已登录
    if (this.data.showWriteComment && isLoggedIn) {
      this.goToWriteComment();
    } else {
      // 获取评论数据
      this.getCount();
      this.getComments();
    }
  },
  
  // 获取评论统计数据
  async getCount() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      const { dishId } = this.data;
      const result = await api.comments.getDishComments(dishId);
      
      if (result && result.data) {
        const { totalCount, goodRate, averageRating, ratingDistribution, filterCounts } = result.data;
        
        // 更新页面导航标题
        wx.setNavigationBarTitle({
          title: `菜品评价(${totalCount || 0})`
        });
        
        // 构建统计数据
        const countObj = {
          commentCount: filterCounts?.all || totalCount || 0,
          goodCount: filterCounts?.good || (ratingDistribution['5'] || 0) + (ratingDistribution['4'] || 0),
          middleCount: filterCounts?.medium || ratingDistribution['3'] || 0,
          badCount: filterCounts?.bad || (ratingDistribution['2'] || 0) + (ratingDistribution['1'] || 0),
          hasImageCount: filterCounts?.image || 0,
          uidCount: this.data.isLoggedIn ? (filterCounts?.self || 0) : 0
        };
        
        this.setData({
          countObj,
          ratingDistribution,
          averageRating,
          goodRate
        });
        
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '获取评价统计失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取评论统计数据失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '获取评价统计失败',
        icon: 'none'
      });
    }
  },
  
  // 生成API请求参数
  generalQueryData(reset) {
    const { pageNum, pageSize, commentType } = this.data;
    
    // 获取对应的筛选类型
    const filter_type = FILTER_TYPES[commentType] || 'all';
    
    // 页面请求参数
    const options = {
      page: reset ? 1 : pageNum + 1,
      page_size: pageSize,
      filter_type
    };
    
    return options;
  },
  
  // 初始化评论列表数据
  async init(reset = true) {
    const { loadMoreStatus, commentList = [], spuId, commentType } = this.data;
    
    // 如果选择"自己"筛选，且用户未登录，则显示空列表
    if (commentType === '5' && !this.data.isLoggedIn) {
      this.setData({
        commentList: [],
        hasLoaded: true,
        total: 0,
        pageNum: 1,
        loadMoreStatus: 2,
        pageLoading: false
      });
      return;
    }
    
    // 在加载中或者无更多数据，直接返回
    if (loadMoreStatus !== 0) return;
    
    this.setData({
      loadMoreStatus: 1,
      pageLoading: true
    });
    
    try {
      // 获取查询参数
      const options = this.generalQueryData(reset);
      
      // 请求评论数据
      const response = await api.comments.getDishComments(spuId, options);
      
      if (response && response.data) {
        const { commentList: newComments, totalCount, current_page, total_pages } = response.data;
        
        // 格式化评论数据
        const formattedComments = this.formatComments(newComments || []);
        
        // 没有数据时的处理
        if (totalCount === 0 && reset) {
          this.setData({
            commentList: [],
            hasLoaded: true,
            total: 0,
            pageNum: 1,
            loadMoreStatus: 2,
            pageLoading: false
          });
          return;
        }
        
        // 合并评论列表
        const updatedCommentList = reset ? formattedComments : commentList.concat(formattedComments);
        
        // 更新加载状态
        const newLoadMoreStatus = current_page >= total_pages ? 2 : 0;
        
        this.setData({
          commentList: updatedCommentList,
          pageNum: options.page,
          totalCount: totalCount || 0,
          loadMoreStatus: newLoadMoreStatus,
          hasLoaded: true,
          pageLoading: false
        });
      } else {
        this.setData({
          pageLoading: false,
          loadMoreStatus: 0,
          hasLoaded: true
        });
        
        wx.showToast({
          title: '获取评论列表失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取评论列表失败:', error);
      this.setData({
        pageLoading: false,
        loadMoreStatus: 0,
        hasLoaded: true
      });
      
      wx.showToast({
        title: '获取评论列表失败',
        icon: 'none'
      });
    }
  },
  
  // 格式化评论数据
  formatComments(comments) {
    return comments.map(item => {
      return {
        commentScore: item.rating || 5,
        userName: item.user_name || '匿名用户',
        commentContent: item.content || '',
        commentTime: item.create_time ? dayjs(item.create_time).format('YYYY/MM/DD HH:mm') : '',
        isAnonymity: !!item.is_anonymous,
        isAutoComment: false,
        userHeadUrl: item.avatar || '/pages/goods/assets/images/avatar-placeholder.png',
        specInfo: item.specs || '',
        sellerReply: item.reply || '',
        is_self: !!item.is_self,
        commentResources: item.images ? item.images.map(imgUrl => ({ type: 'image', src: imgUrl })) : []
      };
    });
  },
  
  // 获取评星数组
  getScoreArray(score) {
    var array = [];
    for (let i = 0; i < 5; i++) {
      if (i < score) {
        array.push(2);
      } else {
        array.push(0);
      }
    }
    return array;
  },
  
  // 获取评论数据
  getComments() {
    this.init(true);
  },
  
  // 切换评论标签
  changeTag(e) {
    const { commenttype } = e.currentTarget.dataset;
    const { commentType, isLoggedIn } = this.data;
    
    // 如果点击"自己"标签但用户未登录，则提示登录
    if (commenttype === '5' && !isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    if (commentType === commenttype) return;
    
    this.setData({
      loadMoreStatus: 0,
      commentList: [],
      total: 0,
      myTotal: 0,
      myPageNum: 1,
      pageNum: 1,
      commentType: commenttype
    });
    
    this.init(true);
  },
  
  // 跳转到写评论页面
  goToWriteComment() {
    // 如果用户未登录，提示先登录
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      
      // 可以选择跳转到登录页
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/index'
        });
      }, 1000);
      
      return;
    }
    
    const { dishId } = this.data;
    wx.navigateTo({
      url: `/pages/goods/comments/create/index?dishId=${dishId}`
    });
  },
  
  // 上拉加载更多
  onReachBottom() {
    const { totalCount = 0, commentList } = this.data;
    
    if (commentList.length >= totalCount) {
      this.setData({
        loadMoreStatus: 2,
      });
      return;
    }
    
    // 加载更多评论
    this.init(false);
  },
});
