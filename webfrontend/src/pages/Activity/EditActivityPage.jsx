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
  const [activity, setActivity] = useState(null); // 添加活动状态
  const [images, setImages] = useState([]); // 添加图片状态
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
          const activityData = data.data;
          setActivity(activityData); // 保存活动数据
          
          // 格式化时间为表单需要的格式
          const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
          };

          setFormData({
            title: activityData.title || '',
            description: activityData.description || '',
            type: activityData.type || 'fitness',
            location: activityData.location || '',
            startTime: formatDateTime(activityData.startTime),
            endTime: formatDateTime(activityData.endTime),
            registrationDeadline: formatDateTime(activityData.registrationDeadline),
            minParticipants: activityData.minParticipants || 1,
            maxParticipants: activityData.maxParticipants || 20,
            fee: activityData.fee || 0,
            requirements: activityData.requirements || '',
            equipment: activityData.equipment || '',
            contactInfo: activityData.contactInfo || '',
          });

          // 解析并设置图片
          if (activityData.images) {
            try {
              const parsedImages = JSON.parse(activityData.images);
              setImages(Array.isArray(parsedImages) ? parsedImages : []);
            } catch (error) {
              console.error('解析图片数据失败:', error);
              setImages([]);
            }
          } else {
            setImages([]);
          }
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

  // 判断字段是否应该被禁用（已发布的活动限制某些关键字段）
  const isFieldDisabled = (fieldName) => {
    if (!activity || activity.status === 'draft') {
      return false; // 草稿状态所有字段都可以编辑
    }
    
    // 已发布的活动不能修改的关键字段
    const restrictedFields = [
      'title',        // 活动名称
      'type',         // 活动类型
      'fee',          // 活动费用
      'startTime',    // 开始时间
      'endTime',      // 结束时间
      'registrationDeadline', // 报名截止时间
      'minParticipants',      // 最少参与人数
      'maxParticipants',      // 最多参与人数
    ];
    
    return restrictedFields.includes(fieldName);
  };

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

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        alert('图片大小不能超过5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 删除图片
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images)
        }),
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
            {/* 如果是已发布活动，显示提示信息 */}
            {activity && activity.status === 'published' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">已发布活动编辑限制</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      为保护已报名用户权益，部分关键信息（如标题、时间、价格等）不可修改。
                      您仍可以编辑活动描述、地点、要求等其他信息。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 活动标题 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动标题 *
                  {isFieldDisabled('title') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="请输入活动标题"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('title') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('title')}
                  required
                />
              </div>

              {/* 活动类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动类型 *
                  {isFieldDisabled('type') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('type') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('type')}
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
                  {isFieldDisabled('startTime') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('startTime') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('startTime')}
                  required
                />
              </div>

              {/* 结束时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  结束时间 *
                  {isFieldDisabled('endTime') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('endTime') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('endTime')}
                  required
                />
              </div>

              {/* 报名截止时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  报名截止时间 *
                  {isFieldDisabled('registrationDeadline') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('registrationDeadline') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('registrationDeadline')}
                  required
                />
              </div>

              {/* 最少参与人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最少参与人数
                  {isFieldDisabled('minParticipants') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="number"
                  name="minParticipants"
                  value={formData.minParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('minParticipants') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('minParticipants')}
                />
              </div>

              {/* 最多参与人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最多参与人数
                  {isFieldDisabled('maxParticipants') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('maxParticipants') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('maxParticipants')}
                />
              </div>

              {/* 活动费用 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动费用（元）
                  {isFieldDisabled('fee') && (
                    <span className="text-xs text-gray-500 ml-2">(已发布不可修改)</span>
                  )}
                </label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee === 0 ? '' : formData.fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldDisabled('fee') 
                      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  disabled={isFieldDisabled('fee')}
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

              {/* 活动图片 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动图片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">可上传多张图片，每张图片不超过5MB</p>
                
                {/* 图片预览 */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`预览 ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
