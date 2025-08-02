import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7001';

const ActivityType = {
  fitness: '健身',
  basketball: '篮球',
  football: '足球',
  badminton: '羽毛球',
  tennis: '网球',
  yoga: '瑜伽',
  swimming: '游泳',
  running: '跑步',
  other: '其他',
};

export default function EditActivityPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'fitness',
    location: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
    minParticipants: 1,
    maxParticipants: 20,
    fee: 0,
    requirements: '',
    equipment: '',
    contactInfo: '',
  });

  // 获取活动详情
  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/activity/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const activity = data.data;
          
          // 格式化时间为表单需要的格式
          const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
          };

          setFormData({
            title: activity.title || '',
            description: activity.description || '',
            type: activity.type || 'fitness',
            location: activity.location || '',
            startTime: formatDateTime(activity.startTime),
            endTime: formatDateTime(activity.endTime),
            registrationDeadline: formatDateTime(activity.registrationDeadline),
            minParticipants: activity.minParticipants || 1,
            maxParticipants: activity.maxParticipants || 20,
            fee: activity.fee || 0,
            requirements: activity.requirements || '',
            equipment: activity.equipment || '',
            contactInfo: activity.contactInfo || '',
          });
        } else {
          alert('获取活动详情失败');
          navigate('/home/manage');
        }
      } catch (error) {
        console.error('获取活动详情失败:', error);
        alert('网络错误');
        navigate('/home/manage');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchActivityDetail();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'fee') {
      // 特殊处理费用字段，避免浮点数精度问题
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: 0 }));
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
          // 使用 Math.round 避免浮点数精度问题
          setFormData(prev => ({ ...prev, [name]: Math.round(numValue * 100) / 100 }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.title.trim()) {
      alert('请填写活动标题');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('请填写活动描述');
      return;
    }
    
    if (!formData.location.trim()) {
      alert('请填写活动地点');
      return;
    }
    
    if (!formData.startTime || !formData.endTime || !formData.registrationDeadline) {
      alert('请填写完整的时间信息');
      return;
    }
    
    // 时间逻辑验证
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    const registrationDeadline = new Date(formData.registrationDeadline);
    
    if (endTime <= startTime) {
      alert('活动结束时间必须晚于开始时间');
      return;
    }
    
    if (registrationDeadline >= startTime) {
      alert('报名截止时间必须早于活动开始时间');
      return;
    }

    if (formData.minParticipants > formData.maxParticipants) {
      alert('最少参与人数不能大于最多参与人数');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/activity/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('活动更新成功！');
        navigate(`/activity/${id}`);
      } else {
        alert(result.message || '更新失败，请稍后重试');
      }
    } catch (error) {
      console.error('更新活动失败:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载活动信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">编辑活动</h1>
            <p className="mt-1 text-gray-600">修改活动信息</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 活动标题 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动标题 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="请输入活动标题"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 活动类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动类型 *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.entries(ActivityType).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* 活动地点 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动地点 *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="请输入活动地点"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 开始时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始时间 *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 结束时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  结束时间 *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 报名截止时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  报名截止时间 *
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 最少参与人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最少参与人数
                </label>
                <input
                  type="number"
                  name="minParticipants"
                  value={formData.minParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 最多参与人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最多参与人数
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 活动费用 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动费用（元）
                </label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee === 0 ? '' : formData.fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 联系方式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系方式
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="请输入联系方式"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 活动描述 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动描述 *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="请详细描述活动内容、注意事项等"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 参与要求 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  参与要求
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="请输入参与要求，如年龄限制、技能水平等"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 装备说明 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  装备说明
                </label>
                <textarea
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="请说明需要携带的装备或提供的装备"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '更新中...' : '更新活动'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
