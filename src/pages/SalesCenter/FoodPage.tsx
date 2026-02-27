import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './FoodPage.css'

interface Food {
  id: number
  name: string
  category: string
  unit: string
  price: number
  stock: number
  supplier: string
  createTime: string
}

export function FoodPage() {
  const navigate = useNavigate()
  const [searchName, setSearchName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [foods, setFoods] = useState<Food[]>([])
  const [allFoods, setAllFoods] = useState<Food[]>([])

  // 计算分页数据
  const totalPages = Math.ceil(foods.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = foods.slice(startIndex, endIndex)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    price: '',
    stock: '',
    supplier: '',
  })

  const loadData = async () => {
    try {
      // 模拟数据
      const mockData: Food[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: ['芹菜', '鸡肉', '豆腐', '白菜', '猪肉'][i % 5],
        category: '斤',
        unit: ['新鲜蔬菜市场', '新鲜水果店'][i % 2],
        price: [120.0, 34.0][i % 2],
        stock: [120.0, 34.0][i % 2],
        supplier: ['新鲜蔬菜市场', '新鲜水果店'][i % 2],
        createTime: '2022.02.22',
      }))
      setAllFoods(mockData)
      setFoods(mockData)
    } catch {
      // 忽略错误
    }
  }

  // 加载数据
  useEffect(() => {
    loadData() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const handleSearch = () => {
    const filtered = allFoods.filter(food => {
      return searchName ? food.name.includes(searchName) : true
    })
    setFoods(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setFoods(allFoods)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setEditingFood(null)
    setFormData({
      name: '',
      category: '',
      unit: '',
      price: '',
      stock: '',
      supplier: '',
    })
    setShowModal(true)
  }

  const handleEdit = (food: Food) => {
    setEditingFood(food)
    setFormData({
      name: food.name,
      category: food.category,
      unit: food.unit,
      price: food.price.toString(),
      stock: food.stock.toString(),
      supplier: food.supplier,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      setFoods(foods.filter(food => food.id !== deletingId))
      setAllFoods(allFoods.filter(food => food.id !== deletingId))
      setShowDeleteModal(false)
      setDeletingId(null)
    }
  }

  const handleSubmit = async () => {
    if (editingFood) {
      // 编辑
      const updated = {
        ...editingFood,
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      }
      setFoods(foods.map(f => (f.id === editingFood.id ? updated : f)))
      setAllFoods(allFoods.map(f => (f.id === editingFood.id ? updated : f)))
    } else {
      // 新增
      const newFood: Food = {
        id: Math.max(...allFoods.map(f => f.id)) + 1,
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        price: Number(formData.price),
        stock: Number(formData.stock),
        supplier: formData.supplier,
        createTime: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
      }
      setFoods([...foods, newFood])
      setAllFoods([...allFoods, newFood])
    }
    setShowModal(false)
  }

  return (
    <div className="food-page">
      {/* 搜索栏 */}
      <div className="search-bar">
        <div className="search-item">
          <label>食材名称：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>
        <div className="search-buttons">
          <button className="btn-primary" onClick={handleSearch}>
            查询
          </button>
          <button className="btn-default" onClick={handleReset}>
            重置
          </button>
        </div>
        <button
          className="btn-default"
          onClick={() => navigate('/sales-center/price-analysis')}
          style={{ marginLeft: 'auto' }}
        >
          价格分析
        </button>
        <button className="btn-add" onClick={handleAdd}>
          新增
        </button>
      </div>

      {/* 表格 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>菜品名称</th>
              <th>单位</th>
              <th>供应商</th>
              <th>批次价</th>
              <th>库存数</th>
              <th>供应商名称</th>
              <th>价格预测日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((food, index) => (
              <tr key={food.id}>
                <td>{startIndex + index + 1}</td>
                <td>{food.name}</td>
                <td>{food.category}</td>
                <td>{food.unit}</td>
                <td>{food.price.toFixed(2)}</td>
                <td>{food.stock.toFixed(2)}</td>
                <td>{food.supplier}</td>
                <td>{food.createTime}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(food)}>
                    编辑
                  </button>
                  <button className="btn-link danger" onClick={() => handleDeleteClick(food.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="pagination">
          <span className="total">共{foods.length}条</span>
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            } else if (page === currentPage - 3 || page === currentPage + 3) {
              return (
                <span key={page} className="page-ellipsis">
                  ...
                </span>
              )
            }
            return null
          })}
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
          <select
            className="page-size-select"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
          <span className="page-jump-label">跳至</span>
          <input
            type="number"
            className="page-jump-input"
            min={1}
            max={totalPages}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                const page = Number((e.target as HTMLInputElement).value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }
            }}
          />
          <span className="page-jump-label">页</span>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFood ? '编辑食材' : '新增/编辑食材'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>菜材名称：
                </label>
                <input
                  type="text"
                  placeholder="请输入菜材名称"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>单位：
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="斤">斤</option>
                  <option value="公斤">公斤</option>
                  <option value="个">个</option>
                </select>
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>供应商：
                </label>
                <select
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="新鲜蔬菜市场">新鲜蔬菜市场</option>
                  <option value="新鲜水果店">新鲜水果店</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setShowModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>删除食材</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>确定删除该食材吗？删除后将无法恢复</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setShowDeleteModal(false)}>
                取消
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
