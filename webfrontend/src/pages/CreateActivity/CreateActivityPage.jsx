// CreateActivityPage.jsx
// 活动创建页面 - 发布新的体育活动

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7001';

function CreateActivityPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'fitness',
    location: '',        {/* 提交按钮 */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '保存中...' : '保存草稿'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '发布中...' : '发布活动'}
          </button>
        </div>'',
    endTime: '',
    registrationDeadline: '',
    minParticipants: 1,
    maxParticipants: 10,
    fee: 0,
    requirements: '',
    equipment: '',
    contactInfo: ''
  });
  const [images, setImages] = useState([]);

  // 活动类型选项
  const activityTypes = [
    { value: 'fitness', label: '健身' },
    { value: 'basketball', label: '篮球' },
    { value: 'football', label: '足球' },
    { value: 'badminton', label: '羽毛球' },
    { value: 'tennis', label: '网球' },
    { value: 'yoga', label: '瑜伽' },
    { value: 'swimming', label: '游泳' },
    { value: 'running', label: '跑步' },
    { value: 'other', label: '其他' }
  ];

  // 处理表单输入变化
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
        [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
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

  // 表单验证
  const validateForm = () => {
    const requiredFields = ['title', 'description', 'type', 'location', 'startTime', 'endTime', 'registrationDeadline'];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`请填写${getFieldLabel(field)}`);
        return false;
      }
    }

    // 时间验证
    const now = new Date();
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    const deadline = new Date(formData.registrationDeadline);

    if (deadline >= startTime) {
      alert('报名截止时间必须早于活动开始时间');
      return false;
    }

    if (startTime >= endTime) {
      alert('活动结束时间必须晚于开始时间');
      return false;
    }

    if (deadline <= now) {
      alert('报名截止时间必须晚于当前时间');
      return false;
    }

    if (formData.minParticipants <= 0 || formData.maxParticipants <= 0) {
      alert('参与人数必须大于0');
      return false;
    }

    if (formData.minParticipants > formData.maxParticipants) {
      alert('最少参与人数不能大于最多参与人数');
      return false;
    }

    return true;
  };

  // 获取字段标签
  const getFieldLabel = (field) => {
    const labels = {
      title: '活动标题',
      description: '活动描述',
      type: '活动类型',
      location: '活动地点',
      startTime: '开始时间',
      endTime: '结束时间',
      registrationDeadline: '报名截止时间'
    };
    return labels[field] || field;
  };

  // 提交表单
  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    
    // 如果是保存草稿，跳过部分验证
    if (!asDraft && !validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        images: JSON.stringify(images),
        status: asDraft ? 'draft' : 'published'
      };

      const response = await fetch(`${API_BASE_URL}/api/activity/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(asDraft ? '草稿保存成功！' : '活动创建成功！');
        navigate(asDraft ? '/home/manage' : `/activity/${result.data.id}`);
      } else {
        const error = await response.json();
        alert(error.message || '操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">创建活动</h1>
        <p className="text-gray-600">发布一个新的体育活动，邀请大家一起参与</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">基本信息</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              活动标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="输入活动标题"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              活动描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="详细描述活动内容、规则等信息"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              活动类型 <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              活动地点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="具体地址或场馆名称"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 时间设置 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">时间设置</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              报名截止时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 参与设置 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">参与设置</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">最少参与人数</label>
            <input
              type="number"
              name="minParticipants"
              value={formData.minParticipants}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">最多参与人数</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活动费用 (元)</label>
            <input
              type="number"
              name="fee"
              value={formData.fee === 0 ? '' : formData.fee}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 其他信息 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">其他信息</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">参与要求</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows="3"
              placeholder="对参与者的要求，如技能水平、装备等"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">所需设备</label>
            <textarea
              name="equipment"
              value={formData.equipment}
              onChange={handleInputChange}
              rows="3"
              placeholder="需要携带的设备或器材"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="微信号、QQ号或手机号等"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 图片上传 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">活动图片</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '创建中...' : '创建活动'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateActivityPage;
