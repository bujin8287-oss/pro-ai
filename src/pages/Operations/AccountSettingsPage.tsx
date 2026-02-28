import { useState } from 'react'
import './AccountSettingsPage.css'

export function AccountSettingsPage() {
  const [avatar, setAvatar] = useState('/default-avatar.png')
  const [formData] = useState({
    name: '李四',
    phone: '13288887777',
    email: 'xieoj',
    password: '123456',
    role: '机构管理员',
  })

  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // 保存基本信息
    // console.log('保存信息:', formData)
    alert('保存成功')
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    // 修改密码
    // console.log('修改密码')
    alert('密码修改成功')
    setIsEditingPassword(false)
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="account-settings-page">
      <div className="settings-container">
        <h2 className="page-title">账户信息管理</h2>

        {/* 头像上传 */}
        <div className="form-section">
          <div className="form-item">
            <label className="form-label">头像：</label>
            <div className="avatar-upload">
              <div className="avatar-preview">
                <img src={avatar} alt="头像" />
              </div>
              <div className="avatar-actions">
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <button
                  className="btn-upload"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                >
                  更换头像
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="form-section">
          <div className="form-item">
            <label className="form-label">姓名：</label>
            <div className="form-value">{formData.name}</div>
          </div>

          <div className="form-item">
            <label className="form-label">手机号：</label>
            <div className="form-value">{formData.phone}</div>
          </div>

          <div className="form-item">
            <label className="form-label">邮箱：</label>
            <div className="form-value">{formData.email}</div>
          </div>

          <div className="form-item">
            <label className="form-label">密码：</label>
            <div className="form-value">
              <span>******</span>
              <button className="btn-link" onClick={() => setIsEditingPassword(true)}>
                更改密码
              </button>
            </div>
          </div>

          <div className="form-item">
            <label className="form-label">所属角色：</label>
            <div className="form-value">{formData.role}</div>
          </div>
        </div>
      </div>

      {/* 修改密码弹窗 */}
      {isEditingPassword && (
        <div className="modal-overlay" onClick={() => setIsEditingPassword(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>修改密码</h3>
              <button className="modal-close" onClick={() => setIsEditingPassword(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>旧密码：
                </label>
                <input
                  type="password"
                  placeholder="请输入旧密码"
                  value={passwordData.oldPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>新密码：
                </label>
                <input
                  type="password"
                  placeholder="请输入新密码"
                  value={passwordData.newPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>确认密码：
                </label>
                <input
                  type="password"
                  placeholder="请再次输入新密码"
                  value={passwordData.confirmPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setIsEditingPassword(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handlePasswordChange}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
