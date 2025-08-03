# SportRoomOnline API 示例文档

## 🌟 概述

本文档提供了 SportRoomOnline 系统所有 API 接口的详细使用示例，包括请求格式、响应数据、错误处理等。所有示例均基于实际的后端实现。

## 🔐 认证机制

### JWT Token 使用
```javascript
// 在请求头中携带 Token
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

---

## 👤 用户管理 API

### 1. 用户注册

**接口地址：** `POST /api/user/register`

**请求示例：**
```javascript
// JavaScript/Axios 示例
const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:7001/api/user/register', {
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      phone: '13800138000'
    });
    
    console.log('注册成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error.response.data);
    throw error;
  }
};
```

**cURL 示例：**
```bash
curl -X POST http://localhost:7001/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "phone": "13800138000"
  }'
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john.doe@example.com",
    "phone": "13800138000",
    "avatar": null,
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  },
  "message": "用户注册成功"
}
```

**错误响应：**
```json
{
  "success": false,
  "message": "用户名已存在",
  "code": "USER_EXISTS",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 用户登录

**接口地址：** `POST /api/user/login`

**请求示例：**
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:7001/api/user/login', {
      email,
      password
    });
    
    // 保存 Token 到本地存储
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return response.data;
  } catch (error) {
    console.error('登录失败:', error.response.data);
    throw error;
  }
};

// 使用示例
loginUser('john.doe@example.com', 'securePassword123')
  .then(result => {
    console.log('登录成功，Token:', result.data.token);
  })
  .catch(error => {
    console.error('登录失败:', error);
  });
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "phone": "13800138000",
      "avatar": null
    }
  },
  "message": "登录成功"
}
```

### 3. 获取用户资料

**接口地址：** `GET /api/user/profile`

**请求示例：**
```javascript
const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get('http://localhost:7001/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      // Token 过期，跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john.doe@example.com",
    "phone": "13800138000",
    "avatar": "http://localhost:7001/uploads/avatar_1642675800.jpg",
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:35:00Z"
  }
}
```

### 4. 更新用户资料

**接口地址：** `PUT /api/user/profile`

**请求示例：**
```javascript
const updateUserProfile = async (updateData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.put('http://localhost:7001/api/user/profile', updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('更新失败:', error.response.data);
    throw error;
  }
};

// 使用示例
updateUserProfile({
  username: 'johnsmith',
  phone: '13900139000'
}).then(result => {
  console.log('资料更新成功:', result);
});
```

---

## 🏃‍♂️ 活动管理 API

### 1. 创建活动

**接口地址：** `POST /api/activity`

**请求示例：**
```javascript
const createActivity = async (activityData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post('http://localhost:7001/api/activity', activityData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('创建活动失败:', error.response.data);
    throw error;
  }
};

// 使用示例
const newActivity = {
  title: '晨跑活动',
  description: '每周三早晨7点在校园内进行晨跑，欢迎所有同学参加！',
  startTime: '2025-01-25T07:00:00Z',
  endTime: '2025-01-25T08:00:00Z',
  location: '学校操场',
  maxParticipants: 20,
  price: 0
};

createActivity(newActivity)
  .then(result => {
    console.log('活动创建成功:', result);
  });
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "晨跑活动",
    "description": "每周三早晨7点在校园内进行晨跑，欢迎所有同学参加！",
    "startTime": "2025-01-25T07:00:00Z",
    "endTime": "2025-01-25T08:00:00Z",
    "location": "学校操场",
    "maxParticipants": 20,
    "price": 0,
    "creatorId": 1,
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  },
  "message": "活动创建成功"
}
```

### 2. 获取活动列表

**接口地址：** `GET /api/activities`

**请求示例：**
```javascript
const getActivities = async (params = {}) => {
  const token = localStorage.getItem('token');
  
  // 构建查询参数
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...params.filters
  }).toString();
  
  try {
    const response = await axios.get(`http://localhost:7001/api/activities?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('获取活动列表失败:', error.response.data);
    throw error;
  }
};

// 使用示例
// 获取所有活动
getActivities().then(result => {
  console.log('活动列表:', result.data.activities);
});

// 分页获取活动
getActivities({
  page: 2,
  limit: 5
}).then(result => {
  console.log('第2页活动:', result.data.activities);
});

// 筛选活动
getActivities({
  filters: {
    location: '学校操场',
    priceRange: 'free' // 免费活动
  }
}).then(result => {
  console.log('筛选结果:', result.data.activities);
});
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "title": "晨跑活动",
        "description": "每周三早晨7点在校园内进行晨跑...",
        "startTime": "2025-01-25T07:00:00Z",
        "endTime": "2025-01-25T08:00:00Z",
        "location": "学校操场",
        "maxParticipants": 20,
        "currentParticipants": 5,
        "price": 0,
        "creator": {
          "id": 1,
          "username": "johndoe",
          "avatar": "http://localhost:7001/uploads/avatar_1.jpg"
        },
        "createdAt": "2025-01-20T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

### 3. 获取活动详情

**接口地址：** `GET /api/activity/{id}`

**请求示例：**
```javascript
const getActivityDetail = async (activityId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get(`http://localhost:7001/api/activity/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      console.error('活动不存在');
    }
    throw error;
  }
};

// 使用示例
getActivityDetail(1)
  .then(result => {
    console.log('活动详情:', result.data);
  })
  .catch(error => {
    console.error('获取活动详情失败:', error);
  });
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "晨跑活动",
    "description": "每周三早晨7点在校园内进行晨跑，欢迎所有同学参加！路线从操场出发，绕校园一圈约3公里。",
    "startTime": "2025-01-25T07:00:00Z",
    "endTime": "2025-01-25T08:00:00Z",
    "location": "学校操场",
    "maxParticipants": 20,
    "currentParticipants": 5,
    "price": 0,
    "creator": {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "avatar": "http://localhost:7001/uploads/avatar_1.jpg"
    },
    "participants": [
      {
        "id": 2,
        "username": "alice",
        "avatar": "http://localhost:7001/uploads/avatar_2.jpg",
        "registrationTime": "2025-01-21T09:15:00Z"
      }
    ],
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

### 4. 更新活动

**接口地址：** `PUT /api/activity/{id}`

**请求示例：**
```javascript
const updateActivity = async (activityId, updateData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.put(`http://localhost:7001/api/activity/${activityId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      console.error('只有活动创建者可以编辑活动');
    }
    throw error;
  }
};

// 使用示例
updateActivity(1, {
  title: '晨跑活动 - 更新版',
  maxParticipants: 25,
  description: '更新后的活动描述...'
}).then(result => {
  console.log('活动更新成功:', result);
});
```

### 5. 删除活动

**接口地址：** `DELETE /api/activity/{id}`

**请求示例：**
```javascript
const deleteActivity = async (activityId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.delete(`http://localhost:7001/api/activity/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      console.error('只有活动创建者可以删除活动');
    }
    throw error;
  }
};

// 使用示例 - 带确认提示
const handleDeleteActivity = async (activityId) => {
  if (confirm('确定要删除这个活动吗？此操作不可撤销。')) {
    try {
      await deleteActivity(activityId);
      alert('活动删除成功');
      // 刷新活动列表
      refreshActivityList();
    } catch (error) {
      alert('删除失败：' + error.response.data.message);
    }
  }
};
```

---

## 📝 报名管理 API

### 1. 创建报名

**接口地址：** `POST /api/registration`

**请求示例：**
```javascript
const registerForActivity = async (activityId, notes = '') => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post('http://localhost:7001/api/registration', {
      activityId,
      notes
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response.status === 409) {
      console.error('已经报名过该活动');
    } else if (error.response.status === 400) {
      console.error('活动人数已满');
    }
    throw error;
  }
};

// 使用示例
registerForActivity(1, '我很期待参加这个活动！')
  .then(result => {
    console.log('报名成功:', result);
    alert('报名成功！');
  })
  .catch(error => {
    console.error('报名失败:', error.response.data.message);
    alert('报名失败：' + error.response.data.message);
  });
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "activityId": 1,
    "userId": 2,
    "status": "confirmed",
    "registrationTime": "2025-01-21T09:15:00Z",
    "notes": "我很期待参加这个活动！",
    "activity": {
      "id": 1,
      "title": "晨跑活动",
      "startTime": "2025-01-25T07:00:00Z",
      "location": "学校操场"
    },
    "createdAt": "2025-01-21T09:15:00Z"
  },
  "message": "报名成功"
}
```

### 2. 获取用户报名列表

**接口地址：** `GET /api/registrations`

**请求示例：**
```javascript
const getUserRegistrations = async (params = {}) => {
  const token = localStorage.getItem('token');
  
  // 构建查询参数
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    status: params.status || 'all'
  }).toString();
  
  try {
    const response = await axios.get(`http://localhost:7001/api/registrations?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 使用示例
// 获取所有报名记录
getUserRegistrations().then(result => {
  console.log('我的报名:', result.data.registrations);
});

// 获取确认状态的报名
getUserRegistrations({ status: 'confirmed' }).then(result => {
  console.log('已确认的报名:', result.data.registrations);
});

// 获取待审核的报名
getUserRegistrations({ status: 'pending' }).then(result => {
  console.log('待审核报名:', result.data.registrations);
});
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": 1,
        "status": "confirmed",
        "registrationTime": "2025-01-21T09:15:00Z",
        "notes": "我很期待参加这个活动！",
        "activity": {
          "id": 1,
          "title": "晨跑活动",
          "startTime": "2025-01-25T07:00:00Z",
          "endTime": "2025-01-25T08:00:00Z",
          "location": "学校操场",
          "price": 0,
          "creator": {
            "username": "johndoe"
          }
        },
        "createdAt": "2025-01-21T09:15:00Z"
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### 3. 更新报名状态

**接口地址：** `PUT /api/registration/{id}`

**请求示例：**
```javascript
const updateRegistrationStatus = async (registrationId, status, notes = '') => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.put(`http://localhost:7001/api/registration/${registrationId}`, {
      status,
      notes
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 使用示例
// 活动创建者确认报名
updateRegistrationStatus(1, 'confirmed', '欢迎参加！')
  .then(result => {
    console.log('报名状态更新成功:', result);
  });

// 活动创建者拒绝报名
updateRegistrationStatus(2, 'rejected', '很抱歉，活动已满')
  .then(result => {
    console.log('报名已拒绝:', result);
  });
```

### 4. 取消报名

**接口地址：** `DELETE /api/registration/{id}`

**请求示例：**
```javascript
const cancelRegistration = async (registrationId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.delete(`http://localhost:7001/api/registration/${registrationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 使用示例 - 带确认提示
const handleCancelRegistration = async (registrationId, activityTitle) => {
  if (confirm(`确定要取消报名 "${activityTitle}" 吗？`)) {
    try {
      await cancelRegistration(registrationId);
      alert('报名已取消');
      // 刷新报名列表
      refreshRegistrationList();
    } catch (error) {
      alert('取消失败：' + error.response.data.message);
    }
  }
};
```

---

## 📁 文件上传 API

### 文件上传

**接口地址：** `POST /api/upload`

**请求示例：**
```javascript
const uploadFile = async (file, type = 'avatar') => {
  const token = localStorage.getItem('token');
  
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  try {
    const response = await axios.post('http://localhost:7001/api/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log('上传进度:', percentCompleted + '%');
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('文件上传失败:', error.response.data);
    throw error;
  }
};

// 使用示例 - 头像上传
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  
  // 文件类型验证
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件');
    return;
  }
  
  // 文件大小验证 (限制 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过 5MB');
    return;
  }
  
  try {
    const result = await uploadFile(file, 'avatar');
    console.log('头像上传成功:', result.data.url);
    
    // 更新用户头像
    await updateUserProfile({ avatar: result.data.url });
    alert('头像更新成功！');
  } catch (error) {
    alert('头像上传失败：' + error.response.data.message);
  }
};

// HTML 示例
/*
<input 
  type="file" 
  accept="image/*" 
  onChange={handleAvatarUpload}
  id="avatar-upload"
/>
*/
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "filename": "avatar_1642675800_abc123.jpg",
    "url": "http://localhost:7001/uploads/avatar_1642675800_abc123.jpg",
    "size": 245760,
    "type": "image/jpeg",
    "uploadTime": "2025-01-21T10:30:00Z"
  },
  "message": "文件上传成功"
}
```

---

## 🏠 通用 API

### 健康检查

**接口地址：** `GET /`

**请求示例：**
```javascript
const healthCheck = async () => {
  try {
    const response = await axios.get('http://localhost:7001/');
    return response.data;
  } catch (error) {
    console.error('服务器连接失败:', error);
    throw error;
  }
};

// 使用示例 - 应用启动时检查服务器状态
healthCheck()
  .then(result => {
    console.log('服务器状态正常:', result);
  })
  .catch(error => {
    console.error('服务器无法连接，请检查后端服务');
  });
```

### 获取用户信息 (简化版)

**接口地址：** `GET /api/get_user`

**请求示例：**
```javascript
const getSimpleUserInfo = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get('http://localhost:7001/api/get_user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

---

## 🔥 React 集成示例

### 创建 API 服务类

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7001';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // 请求拦截器 - 自动添加 Token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器 - 统一错误处理
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 用户相关
  async register(userData) {
    const response = await this.api.post('/api/user/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.api.post('/api/user/login', credentials);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/api/user/profile');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await this.api.put('/api/user/profile', userData);
    return response.data;
  }

  // 活动相关
  async createActivity(activityData) {
    const response = await this.api.post('/api/activity', activityData);
    return response.data;
  }

  async getActivities(params = {}) {
    const response = await this.api.get('/api/activities', { params });
    return response.data;
  }

  async getActivityDetail(id) {
    const response = await this.api.get(`/api/activity/${id}`);
    return response.data;
  }

  async updateActivity(id, updateData) {
    const response = await this.api.put(`/api/activity/${id}`, updateData);
    return response.data;
  }

  async deleteActivity(id) {
    const response = await this.api.delete(`/api/activity/${id}`);
    return response.data;
  }

  // 报名相关
  async registerForActivity(activityId, notes) {
    const response = await this.api.post('/api/registration', {
      activityId,
      notes
    });
    return response.data;
  }

  async getRegistrations(params = {}) {
    const response = await this.api.get('/api/registrations', { params });
    return response.data;
  }

  async updateRegistration(id, updateData) {
    const response = await this.api.put(`/api/registration/${id}`, updateData);
    return response.data;
  }

  async cancelRegistration(id) {
    const response = await this.api.delete(`/api/registration/${id}`);
    return response.data;
  }

  // 文件上传
  async uploadFile(file, type = 'avatar') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ApiService();
```

### React Hook 使用示例

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const result = await ApiService.login(credentials);
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      setUser(result.data.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const result = await ApiService.register(userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user
  };
};
```

```javascript
// hooks/useActivities.js
import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useActivities = (params = {}) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const result = await ApiService.getActivities(params);
      setActivities(result.data.activities);
      setPagination(result.data.pagination);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || '获取活动列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [JSON.stringify(params)]);

  const createActivity = async (activityData) => {
    try {
      const result = await ApiService.createActivity(activityData);
      await fetchActivities(); // 刷新列表
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteActivity = async (id) => {
    try {
      await ApiService.deleteActivity(id);
      await fetchActivities(); // 刷新列表
    } catch (error) {
      throw error;
    }
  };

  return {
    activities,
    loading,
    error,
    pagination,
    createActivity,
    deleteActivity,
    refresh: fetchActivities
  };
};
```

### React 组件使用示例

```javascript
// components/ActivityList.jsx
import React, { useState } from 'react';
import { useActivities } from '../hooks/useActivities';

const ActivityList = () => {
  const [page, setPage] = useState(1);
  const { activities, loading, error, pagination, deleteActivity } = useActivities({ page, limit: 6 });

  const handleDelete = async (id, title) => {
    if (window.confirm(`确定要删除活动 "${title}" 吗？`)) {
      try {
        await deleteActivity(id);
        alert('删除成功');
      } catch (error) {
        alert('删除失败：' + error.response.data.message);
      }
    }
  };

  if (loading) return <div className="text-center">加载中...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
            <p className="text-gray-600 mb-4">{activity.description}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>📅 {new Date(activity.startTime).toLocaleString()}</p>
              <p>📍 {activity.location}</p>
              <p>👥 {activity.currentParticipants}/{activity.maxParticipants}</p>
              <p>💰 {activity.price === 0 ? '免费' : `¥${activity.price}`}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                查看详情
              </button>
              <button 
                onClick={() => handleDelete(activity.id, activity.title)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded ${
                page === pageNum 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityList;
```

---

## ⚠️ 错误处理

### 常见错误码

| 状态码 | 错误类型 | 说明 |
|-------|---------|------|
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权，需要登录 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如重复注册） |
| 422 | Validation Error | 数据验证失败 |
| 500 | Server Error | 服务器内部错误 |

### 统一错误处理

```javascript
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `请求参数错误: ${data.message}`;
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return '登录已过期，请重新登录';
      case 403:
        return `权限不足: ${data.message}`;
      case 404:
        return `资源不存在: ${data.message}`;
      case 409:
        return `操作冲突: ${data.message}`;
      case 422:
        return `数据验证失败: ${data.message}`;
      case 500:
        return '服务器内部错误，请稍后重试';
      default:
        return `请求失败: ${data.message || '未知错误'}`;
    }
  } else if (error.request) {
    return '网络连接失败，请检查网络状态';
  } else {
    return `请求配置错误: ${error.message}`;
  }
};

// 使用示例
try {
  await ApiService.createActivity(activityData);
} catch (error) {
  const errorMessage = handleApiError(error);
  alert(errorMessage);
}
```

---

## 📚 最佳实践

### 1. Token 管理
- 将 Token 存储在 localStorage 中
- 请求拦截器自动添加 Authorization 头
- 401 错误自动跳转到登录页面

### 2. 请求优化
- 使用请求拦截器统一处理
- 实现请求重试机制
- 添加加载状态和错误处理

### 3. 数据缓存
- 使用 React Query 或 SWR 进行数据缓存
- 避免重复请求相同数据
- 实现乐观更新

### 4. 错误边界
- 实现全局错误处理组件
- 提供友好的错误提示信息
- 记录错误日志用于调试

---

*API 文档最后更新时间：2025年1月 | 版本：v1.0.0*
