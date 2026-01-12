// FileUpload.jsx
import React, { useState } from 'react';
import { Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 上传前的处理（可选）
  const beforeUpload = (file) => {
    // 可以在这里做文件类型、大小校验
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
      return false;
    }

    return true; // 允许上传
  };

  // 上传成功的回调
  const handleUploadSuccess = (response) => {
    message.success('文件上传成功!');
    console.log('Upload Success:', response);
  };

  // 上传失败的回调
  const handleUploadError = (error) => {
    message.error('文件上传失败!');
    console.error('Upload Error:', error);
  };

  // 上传过程中的回调（用于进度条）
  const handleUploadProgress = (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(progress);
  };

  // 自定义上传函数（推荐方式）
  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file); // key 为 'file'
    // 可以添加额外字段
    // formData.append('userId', '123');

    try {
      const response = await axios.post('http://localhost:3006/uploadfile', formData, {
        onUploadProgress: (progressEvent) => {
          onProgress({ percent: Math.round((progressEvent.loaded * 100) / progressEvent.total) });
        },
      });

      onSuccess(response.data, file);
      handleUploadSuccess(response.data);
    } catch (error) {
      onError(error);
      handleUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  // Ant Design Upload 组件配置
  const uploadProps = {
    name: 'file', // 与后端接收的字段名一致
    action: 'http://localhost:3006/uploadfile', // 后端上传接口地址
    
    showUploadList: false, // 不显示默认的文件列表
    beforeUpload, // 上传前校验
    customRequest, // 自定义上传逻辑
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`);
      }
    },
  };

  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={uploading}>
          {uploading ? '上传中...' : '点击上传文件'}
        </Button>
      </Upload>
      {uploadProgress > 0 && (
        <Progress percent={uploadProgress} />
      )}
    </div>
  );
};

export default FileUpload;