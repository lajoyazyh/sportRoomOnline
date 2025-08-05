const API_BASE_URL = 'http://localhost:7001';

// 获取Token
const getToken = () => {
  return localStorage.getItem('token');
};

// 通用请求函数
const request = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 评论API
export const commentAPI = {
  // 创建评论
  createComment: async (activityId, content, rating, images = []) => {
    return request('/api/comment/create', {
      method: 'POST',
      body: JSON.stringify({
        activityId,
        content,
        rating,
        images,
      }),
    });
  },

  // 获取活动的评论列表
  getActivityComments: async (activityId, page = 1, limit = 10) => {
    return request(`/api/comment/activity/${activityId}?page=${page}&limit=${limit}`);
  },

  // 获取我的评论列表
  getMyComments: async (page = 1, limit = 10) => {
    return request(`/api/comment/my?page=${page}&limit=${limit}`);
  },

  // 获取评论详情
  getComment: async (commentId) => {
    return request(`/api/comment/${commentId}`);
  },

  // 更新评论
  updateComment: async (commentId, content, rating, images = []) => {
    return request(`/api/comment/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        content,
        rating,
        images,
      }),
    });
  },

  // 删除评论
  deleteComment: async (commentId) => {
    return request(`/api/comment/${commentId}`, {
      method: 'DELETE',
    });
  },

  // 点赞评论
  likeComment: async (commentId) => {
    return request(`/api/comment/${commentId}/like`, {
      method: 'POST',
    });
  },

  // 取消点赞评论
  unlikeComment: async (commentId) => {
    return request(`/api/comment/${commentId}/like`, {
      method: 'DELETE',
    });
  },

  // 获取活动平均评分
  getActivityRating: async (activityId) => {
    return request(`/api/comment/rating/${activityId}`);
  },
};

// 评分星级组件辅助函数
export const renderStars = (rating, interactive = false, onRatingChange = null) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    let starClass = '';
    
    if (i <= fullStars) {
      starClass = 'text-yellow-400 fill-current'; // 实心星
    } else if (i === fullStars + 1 && hasHalfStar) {
      starClass = 'text-yellow-400'; // 半星（可以通过CSS实现）
    } else {
      starClass = 'text-gray-300'; // 空星
    }

    stars.push({
      value: i,
      className: starClass,
      onClick: interactive && onRatingChange ? () => onRatingChange(i) : null,
    });
  }

  return stars;
};

// 格式化评分显示
export const formatRating = (rating) => {
  if (!rating || rating === 0) return '暂无评分';
  return `${rating.toFixed(1)}分`;
};

// 评分文字描述
export const getRatingText = (rating) => {
  if (rating >= 4.5) return '非常满意';
  if (rating >= 3.5) return '满意';
  if (rating >= 2.5) return '一般';
  if (rating >= 1.5) return '不满意';
  return '非常不满意';
};
