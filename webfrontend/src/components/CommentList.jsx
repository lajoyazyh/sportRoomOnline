import React, { useState, useEffect } from 'react';
import { commentAPI, renderStars, formatRating, getRatingText } from '../api/comment';

const CommentList = ({ activityId, showCreateForm = true }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [commentPermissionMessage, setCommentPermissionMessage] = useState('');
  const [checkingPermission, setCheckingPermission] = useState(true);

  // 检查评论权限
  const checkCommentPermission = async () => {
    try {
      setCheckingPermission(true);
      const response = await commentAPI.checkCommentPermission(activityId);
      
      if (response.success) {
        setCanComment(response.data.canComment);
        setCommentPermissionMessage(response.data.message || '');
      } else {
        setCanComment(false);
        setCommentPermissionMessage(response.message || '无法检查评论权限');
      }
    } catch (error) {
      console.error('检查评论权限失败:', error);
      setCanComment(false);
      setCommentPermissionMessage('网络错误，请稍后重试');
    } finally {
      setCheckingPermission(false);
    }
  };

  // 加载评论列表
  const loadComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await commentAPI.getActivityComments(activityId, page, 10);
      
      if (response.success) {
        setComments(response.data.comments);
        setTotalPages(Math.ceil(response.data.total / 10));
        setCurrentPage(page);
        setAverageRating(response.data.averageRating || 0);
      } else {
        setError(response.message || '获取评论失败');
      }
    } catch (error) {
      console.error('加载评论失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activityId) {
      loadComments();
      checkCommentPermission();
    }
  }, [activityId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 格式化时间
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN');
  };

  // 处理点赞
  const handleLike = async (commentId) => {
    try {
      const response = await commentAPI.likeComment(commentId);
      if (response.success) {
        // 重新加载评论列表
        loadComments(currentPage);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* 评论头部 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            用户评价 ({comments.length > 0 ? `${comments.length}条` : '暂无评价'})
          </h3>
          {averageRating > 0 && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {renderStars(averageRating).map((star, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${star.className}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {formatRating(averageRating)} · {getRatingText(averageRating)}
              </span>
            </div>
          )}
        </div>
        
        {showCreateForm && (
          <div>
            {checkingPermission ? (
              <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                检查权限中...
              </button>
            ) : canComment ? (
              <button
                onClick={() => setShowCommentForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                写评价
              </button>
            ) : (
              <div className="flex flex-col items-start">
                <button 
                  disabled 
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                >
                  写评价
                </button>
                <p className="text-sm text-gray-500 mt-1">{commentPermissionMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 评论列表 */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">暂无评价</div>
          <p className="text-gray-400 mt-2">成为第一个评价这个活动的人吧！</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              {/* 用户信息和评分 */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {comment.user?.avatar ? (
                      <img 
                        src={comment.user.avatar} 
                        alt="头像" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {comment.user?.username?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      {comment.user?.nickname || comment.user?.username || '匿名用户'}
                    </div>
                    <div className="flex items-center mt-1">
                      {renderStars(comment.rating).map((star, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${star.className}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {comment.rating}分
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(comment.createdAt)}
                </div>
              </div>

              {/* 评论内容 */}
              <div className="mb-3">
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>

              {/* 评论图片 */}
              {comment.images && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(comment.images).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`评论图片${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 点赞按钮 */}
              <div className="flex items-center">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7.5v2.5m7-10V4.375c0 .518-.421.937-.937.937H14V0z" />
                  </svg>
                  <span className="text-sm">{comment.likeCount || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => loadComments(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => loadComments(page)}
                className={`px-3 py-2 rounded-md ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => loadComments(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 内联评论表单 */}
      {showCommentForm && canComment && (
        <InlineCommentForm
          activityId={activityId}
          onCancel={() => setShowCommentForm(false)}
          onSuccess={() => {
            setShowCommentForm(false);
            loadComments(1); // 重新加载第一页
          }}
        />
      )}
    </div>
  );
};

// 内联评论表单组件
const InlineCommentForm = ({ activityId, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('请输入评价内容');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await commentAPI.createComment(
        activityId,
        formData.content.trim(),
        formData.rating
      );
      
      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || '发布评价失败');
      }
    } catch (error) {
      console.error('发布评价失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">写评价</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 评分选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评分
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                className="focus:outline-none mr-1"
              >
                <svg
                  className={`w-8 h-8 ${
                    rating <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {getRatingText(formData.rating)}
            </span>
          </div>
        </div>

        {/* 评价内容 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评价内容
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            placeholder="分享你的活动体验..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.content.length}/500
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '发布中...' : '发布评价'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentList;
