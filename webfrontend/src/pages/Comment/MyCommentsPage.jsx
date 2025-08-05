import React, { useState, useEffect } from 'react';
import { commentAPI, renderStars, getRatingText } from '../../api/comment';
import { useNavigate } from 'react-router-dom';

const MyCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // 加载我的评论列表
  const loadComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await commentAPI.getMyComments(page, 10);
      
      if (response.success) {
        setComments(response.data.comments);
        setTotalPages(Math.ceil(response.data.total / 10));
        setCurrentPage(page);
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
    loadComments();
  }, []);

  // 格式化时间
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN');
  };

  // 删除评论
  const handleDelete = async (commentId) => {
    if (!confirm('确定要删除这条评论吗？')) {
      return;
    }

    try {
      const response = await commentAPI.deleteComment(commentId);
      
      if (response.success) {
        alert('评论删除成功');
        loadComments(currentPage); // 重新加载当前页
      } else {
        alert(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-600">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的评价</h1>
          <p className="text-gray-600 mt-1">管理您发布的活动评价</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 评论列表 */}
        {comments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500 text-lg">暂无评价</div>
            <p className="text-gray-400 mt-2">参与活动后可以发布评价分享体验</p>
            <button
              onClick={() => navigate('/home/square')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              去看看活动
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* 活动信息 */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {comment.activity?.title || '活动标题'}
                    </h3>
                    <div className="flex items-center">
                      {renderStars(comment.rating).map((star, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${star.className}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {comment.rating}分 · {getRatingText(comment.rating)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatTime(comment.createdAt)}</div>
                    <div className="mt-1 flex gap-2">
                      <button
                        onClick={() => navigate(`/activity/${comment.activityId}`)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        查看活动
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>

                {/* 评论内容 */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>

                {/* 评论图片 */}
                {comment.images && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-3">
                      {JSON.parse(comment.images).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`评论图片${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 点赞数 */}
                <div className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7.5v2.5m7-10V4.375c0 .518-.421.937-.937.937H14V0z" />
                  </svg>
                  <span className="text-sm">{comment.likeCount || 0} 人觉得有用</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
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
      </div>
    </div>
  );
};

export default MyCommentsPage;
