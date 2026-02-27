import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PriceAnalysisPage.css'

interface PriceData {
  month: string
  price1: number
  price2: number
  price3: number
}

interface PriceHistory {
  id: number
  date: string
  food: string
  supplier: string
  price: number
  change: string
}

export function PriceAnalysisPage() {
  const navigate = useNavigate()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [selectedFilter, setSelectedFilter] = useState('all')

  // 价格趋势数据
  const priceData: PriceData[] = [
    { month: '1月', price1: 120, price2: 150, price3: 100 },
    { month: '2月', price1: 130, price2: 140, price3: 110 },
    { month: '3月', price1: 125, price2: 145, price3: 105 },
    { month: '4月', price1: 135, price2: 155, price3: 115 },
    { month: '5月', price1: 140, price2: 160, price3: 120 },
    { month: '6月', price1: 145, price2: 165, price3: 125 },
  ]

  // 价格历史记录
  const priceHistory: PriceHistory[] = [
    {
      id: 1,
      date: '2024-06-15',
      food: '芹菜',
      supplier: '新鲜蔬菜市场',
      price: 145.0,
      change: '+5.0',
    },
    {
      id: 2,
      date: '2024-06-10',
      food: '鸡肉',
      supplier: '新鲜水果店',
      price: 165.0,
      change: '+5.0',
    },
    {
      id: 3,
      date: '2024-06-05',
      food: '豆腐',
      supplier: '新鲜蔬菜市场',
      price: 125.0,
      change: '+5.0',
    },
    {
      id: 4,
      date: '2024-05-30',
      food: '白菜',
      supplier: '新鲜水果店',
      price: 140.0,
      change: '+5.0',
    },
    {
      id: 5,
      date: '2024-05-25',
      food: '猪肉',
      supplier: '新鲜蔬菜市场',
      price: 160.0,
      change: '+5.0',
    },
  ]

  // SVG 图表配置
  const width = 1000
  const height = 400
  const padding = { top: 40, right: 120, bottom: 60, left: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // 计算比例
  const maxPrice = Math.max(...priceData.flatMap(d => [d.price1, d.price2, d.price3]))
  const minPrice = Math.min(...priceData.flatMap(d => [d.price1, d.price2, d.price3]))
  const priceRange = maxPrice - minPrice
  const xStep = chartWidth / (priceData.length - 1)

  const getY = (price: number) => {
    return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight
  }

  const getX = (index: number) => {
    return padding.left + index * xStep
  }

  // 生成路径
  const createPath = (dataKey: 'price1' | 'price2' | 'price3') => {
    return priceData
      .map((d, i) => {
        const x = getX(i)
        const y = getY(d[dataKey])
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    setHoveredIndex(index)
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  return (
    <div className="price-analysis-page">
      {/* 顶部标题栏 */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/sales-center/food')}>
          返回
        </button>
        <h2>价格分析</h2>
      </div>

      {/* 价格趋势图 */}
      <div className="chart-card">
        <h3 className="chart-title">价格趋势</h3>
        <div className="chart-content">
          <svg className="line-chart" viewBox={`0 0 ${width} ${height}`}>
            {/* Y轴网格线 */}
            {[0, 1, 2, 3, 4].map(i => {
              const y = padding.top + (chartHeight / 4) * i
              const price = maxPrice - (priceRange / 4) * i
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                  <text x={padding.left - 10} y={y + 4} textAnchor="end" className="axis-label">
                    {price.toFixed(0)}
                  </text>
                </g>
              )
            })}

            {/* X轴 */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#d9d9d9"
              strokeWidth="1"
            />

            {/* Y轴 */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#d9d9d9"
              strokeWidth="1"
            />

            {/* X轴标签 */}
            {priceData.map((d, i) => (
              <text
                key={i}
                x={getX(i)}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="axis-label"
              >
                {d.month}
              </text>
            ))}

            {/* 悬停背景 */}
            {priceData.map((d, i) => (
              <rect
                key={i}
                x={getX(i) - xStep / 2}
                y={padding.top}
                width={xStep}
                height={chartHeight}
                fill={hoveredIndex === i ? '#f5f5f5' : 'transparent'}
                className="hover-background"
                onMouseMove={e => handleMouseMove(e, i)}
                onMouseLeave={handleMouseLeave}
              />
            ))}

            {/* 折线1 */}
            <path d={createPath('price1')} fill="none" stroke="#1890ff" strokeWidth="2" />
            {priceData.map((d, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(d.price1)}
                r={hoveredIndex === i ? 6 : 4}
                fill="#1890ff"
                className="data-point"
              />
            ))}

            {/* 折线2 */}
            <path d={createPath('price2')} fill="none" stroke="#52c41a" strokeWidth="2" />
            {priceData.map((d, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(d.price2)}
                r={hoveredIndex === i ? 6 : 4}
                fill="#52c41a"
                className="data-point"
              />
            ))}

            {/* 折线3 */}
            <path d={createPath('price3')} fill="none" stroke="#faad14" strokeWidth="2" />
            {priceData.map((d, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(d.price3)}
                r={hoveredIndex === i ? 6 : 4}
                fill="#faad14"
                className="data-point"
              />
            ))}
          </svg>

          {/* 图例框 */}
          <div className="chart-legend-box">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#1890ff' }}></div>
              <span className="legend-label">芹菜</span>
              <span className="legend-value">
                {hoveredIndex !== null
                  ? priceData[hoveredIndex].price1
                  : priceData[priceData.length - 1].price1}
                元
              </span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#52c41a' }}></div>
              <span className="legend-label">鸡肉</span>
              <span className="legend-value">
                {hoveredIndex !== null
                  ? priceData[hoveredIndex].price2
                  : priceData[priceData.length - 1].price2}
                元
              </span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#faad14' }}></div>
              <span className="legend-label">豆腐</span>
              <span className="legend-value">
                {hoveredIndex !== null
                  ? priceData[hoveredIndex].price3
                  : priceData[priceData.length - 1].price3}
                元
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="chart-tooltip"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y + 10,
          }}
        >
          <div className="tooltip-title">{priceData[hoveredIndex].month}</div>
          <div className="tooltip-item">
            <div className="tooltip-dot" style={{ background: '#1890ff' }}></div>
            <span className="tooltip-label">芹菜</span>
            <span className="tooltip-value">{priceData[hoveredIndex].price1}元</span>
          </div>
          <div className="tooltip-item">
            <div className="tooltip-dot" style={{ background: '#52c41a' }}></div>
            <span className="tooltip-label">鸡肉</span>
            <span className="tooltip-value">{priceData[hoveredIndex].price2}元</span>
          </div>
          <div className="tooltip-item">
            <div className="tooltip-dot" style={{ background: '#faad14' }}></div>
            <span className="tooltip-label">豆腐</span>
            <span className="tooltip-value">{priceData[hoveredIndex].price3}元</span>
          </div>
        </div>
      )}

      {/* 价格历史记录表 */}
      <div className="table-card">
        <div className="table-header">
          <h3>价格历史记录</h3>
          <select
            className="filter-select"
            value={selectedFilter}
            onChange={e => setSelectedFilter(e.target.value)}
          >
            <option value="all">全部食材</option>
            <option value="vegetable">蔬菜类</option>
            <option value="meat">肉类</option>
            <option value="other">其他</option>
          </select>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>食材名称</th>
              <th>供应商</th>
              <th>价格(元)</th>
              <th>涨跌幅</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map(record => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>{record.food}</td>
                <td>{record.supplier}</td>
                <td>{record.price.toFixed(2)}</td>
                <td style={{ color: record.change.startsWith('+') ? '#52c41a' : '#ff4d4f' }}>
                  {record.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
