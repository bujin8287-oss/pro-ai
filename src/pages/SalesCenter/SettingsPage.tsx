import { useState } from 'react'
import './SettingsPage.css'

interface UserSettings {
  avatar: string
  name: string
  phone: string
  username: string
  password: string
  role: string
}

export function SettingsPage() {
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [userSettings, setUserSettings] = useState<UserSettings>({
    avatar: 'https://via.placeholder.com/80',
    name: '李四',
    phone: '13988887777',
    username: 'shihsj',
    password: '123456',
    role: '机构管理员',
  })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChangeAvatar = () => {
    setShowAvatarModal(true)
  }

  const handleChangePassword = () => {
    setShowPasswordModal(true)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        if (event.target?.result) {
          setUserSettings({ ...userSettings, avatar: event.target.result as string })
          setShowAvatarModal(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordSubmit = () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('请填写所有字段')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      alert('密码长度不能少于6位')
      return
    }

    // 模拟更新密码
    setUserSettings({ ...userSettings, password: passwordForm.newPassword })
    setShowPasswordModal(false)
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    alert('密码修改成功')
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* 头像 */}
        <div className="settings-item">
          <label className="settings-label">头像：</label>
          <div className="settings-value">
            <div className="avatar-wrapper">
              <img src={userSettings.avatar} alt="头像" className="user-avatar" />
            </div>
            <button className="link-btn" onClick={handleChangeAvatar}>
              更换头像
            </button>
          </div>
        </div>

        {/* 姓名 */}
        <div className="settings-item">
          <label className="settings-label">姓名：</label>
          <div className="settings-value">
            <span className="value-text">{userSettings.name}</span>
          </div>
        </div>

        {/* 手机号 */}
        <div className="settings-item">
          <label className="settings-label">手机号：</label>
          <div className="settings-value">
            <span className="value-text">{userSettings.phone}</span>
          </div>
        </div>

        {/* 账号 */}
        <div className="settings-item">
          <label className="settings-label">账号：</label>
          <div className="settings-value">
            <span className="value-text">{userSettings.username}</span>
          </div>
        </div>

        {/* 密码 */}
        <div className="settings-item">
          <label className="settings-label">密码：</label>
          <div className="settings-value">
            <span className="value-text">{userSettings.password}</span>
            <button className="link-btn" onClick={handleChangePassword}>
              更换密码
            </button>
          </div>
        </div>

        {/* 所属角色 */}
        <div className="settings-item">
          <label className="settings-label">所属角色：</label>
          <div className="settings-value">
            <span className="value-text">{userSettings.role}</span>
          </div>
        </div>
      </div>

      {/* 更换头像弹窗 */}
      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>更换头像</h3>
              <button className="modal-close" onClick={() => setShowAvatarModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  id="avatar-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload" className="upload-label">
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">点击上传头像</div>
                  <div className="upload-hint">支持 JPG、PNG 格式，大小不超过 2MB</div>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setShowAvatarModal(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 更换密码弹窗 */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>更换密码</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>原密码：
                </label>
                <input
                  type="password"
                  placeholder="请输入原密码"
                  value={passwordForm.oldPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>新密码：
                </label>
                <input
                  type="password"
                  placeholder="请输入新密码"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>确认密码：
                </label>
                <input
                  type="password"
                  placeholder="请再次输入新密码"
                  value={passwordForm.confirmPassword}
                  onChange={e =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setShowPasswordModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handlePasswordSubmit}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
