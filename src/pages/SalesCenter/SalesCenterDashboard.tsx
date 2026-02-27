import { useState } from 'react'
import './SalesCenterDashboard.css'

interface TooltipData {
  month: string
  visits: number
  downloads: number
  orders: number
  x: number
  y: number
  index: number
}

export function SalesCenterDashboard() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // 模拟数据
  const stats = [
    { label: '访问量', value: '999,999', change: '总计访问量', changeValue: '987', unit: '万' },
    { label: '下载', value: '45,321', change: '新下载', changeValue: '21%', trend: 'up' },
    { label: '收入', value: '876,945', change: '总收入', changeValue: '2342111', unit: '元' },
    { label: '活跃用户', value: '76,456', change: '最近一个月', changeValue: '987', trend: 'up' },
  ]

  const chartData = [
    { month: '1月', visits: 120, downloads: 150, orders: 100 },
    { month: '2月', visits: 100, downloads: 130, orders: 120 },
    { month: '3月', visits: 220, downloads: 200, orders: 180 },
    { month: '4月', visits: 100, downloads: 120, orders: 90 },
    { month: '5月', visits: 220, downloads: 180, orders: 150 },
    { month: '6月', visits: 120, downloads: 140, orders: 110 },
  ]

  const handleMouseEnter = (data: typeof chartData[0], x: number, y: number, index: number) => {
    setHoveredIndex(index)
    setTooltip({
      month: data.month,
      visits: data.visits,
      downloads: data.downloads,
      orders: data.orders,
      x,
      y,
      index,
    })
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setTooltip(null)
  }

  const rightStats = [
    { label: '月访问量', subLabel: '同比上期增长', value: 30, color: '#1890ff' },
    { label: '月下载数', subLabel: '同比上期增长', value: 80, color: '#1890ff' },
    { label: '月收入', subLabel: '同比上期增长', value: 15, color: '#1890ff' },
  ]

  return (
    <div className="dashboard">
      {/* 顶部统计卡片 */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer">
              <span className="stat-change-label">{stat.change}</span>
              <span className="stat-change-value">
                {stat.changeValue}
                {stat.unit && ` ${stat.unit}`}
                {stat.trend === 'up' && ' ↑'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="chart-section">
        {/* 左侧折线图 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>访问量</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <i className="legend-dot" style={{ background: '#1890ff' }}></i>
                访问量
              </span>
              <span className="legend-item">
                <i className="legend-dot" style={{ background: '#52c41a' }}></i>
                下载量
              </span>
              <span className="legend-item">
                <i className="legend-dot" style={{ background: '#faad14' }}></i>
                下单订单量
              </span>
            </div>
          </div>
          <div className="chart-content">
            <svg viewBox="0 0 700 350" className="line-chart" preserveAspectRatio="none">
              {/* Y轴刻度 */}
              <text x="20" y="50" className="axis-label">250</text>
              <text x="20" y="110" className="axis-label">200</text>
              <text x="20" y="170" className="axis-label">150</text>
              <text x="20" y="230" className="axis-label">100</text>
              <text x="20" y="290" className="axis-label">50</text>
              <text x="20" y="340" className="axis-label">0</text>
              <line x1="50" y1="40" x2="50" y2="330" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="50" y1="330" x2="680" y2="330" stroke="#f0f0f0" strokeWidth="1" />
              
              {/* X轴刻度 */}
              {chartData.map((item, i) => (
                <text key={i} x={100 + i * 100} y="345" className="axis-label">
                  {item.month}
                </text>
              ))}

              {/* 悬停背景高亮 */}
              {chartData.map((d, i) => {
                const x = 100 + i * 100
                return (
                  <rect
                    key={`bg-${i}`}
                    x={x - 40}
                    y="40"
                    width="80"
                    height="290"
                    fill={hoveredIndex === i ? 'rgba(24, 144, 255, 0.08)' : 'transparent'}
                    className="hover-background"
                  />
                )
              })}

              {/* 访问量折线 (蓝色) */}
              <polyline
                points={chartData.map((d, i) => `${100 + i * 100},${330 - d.visits * 1.2}`).join(' ')}
                fill="none"
                stroke="#1890ff"
                strokeWidth="2"
              />

              {/* 下载量折线 (绿色) */}
              <polyline
                points={chartData.map((d, i) => `${100 + i * 100},${330 - d.downloads * 1.2}`).join(' ')}
                fill="none"
                stroke="#52c41a"
                strokeWidth="2"
              />

              {/* 订单量折线 (橙色) */}
              <polyline
                points={chartData.map((d, i) => `${100 + i * 100},${330 - d.orders * 1.2}`).join(' ')}
                fill="none"
                stroke="#faad14"
                strokeWidth="2"
              />

              {/* 数据点 */}
              {chartData.map((d, i) => {
                const x = 100 + i * 100
                const isHovered = hoveredIndex === i
                return (
                  <g key={`points-${i}`}>
                    <circle 
                      cx={x} 
                      cy={330 - d.visits * 1.2} 
                      r={isHovered ? 6 : 4} 
                      fill="#1890ff"
                      className="data-point"
                    />
                    <circle 
                      cx={x} 
                      cy={330 - d.downloads * 1.2} 
                      r={isHovered ? 6 : 4} 
                      fill="#52c41a"
                      className="data-point"
                    />
                    <circle 
                      cx={x} 
                      cy={330 - d.orders * 1.2} 
                      r={isHovered ? 6 : 4} 
                      fill="#faad14"
                      className="data-point"
                    />
                  </g>
                )
              })}

              {/* 交互区域 */}
              {chartData.map((d, i) => {
                const x = 100 + i * 100
                return (
                  <rect
                    key={`interact-${i}`}
                    x={x - 40}
                    y="40"
                    width="80"
                    height="290"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      handleMouseEnter(d, rect.left + 40, rect.top - 10, i)
                    }}
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })}
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="chart-tooltip"
                style={{
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y}px`,
                }}
              >
                <div className="tooltip-title">{tooltip.month}</div>
                <div className="tooltip-item">
                  <span className="tooltip-dot" style={{ background: '#1890ff' }}></span>
                  <span className="tooltip-label">访问量</span>
                  <span className="tooltip-value">{tooltip.visits}</span>
                </div>
                <div className="tooltip-item">
                  <span className="tooltip-dot" style={{ background: '#52c41a' }}></span>
                  <span className="tooltip-label">下载量</span>
                  <span className="tooltip-value">{tooltip.downloads}</span>
                </div>
                <div className="tooltip-item">
                  <span className="tooltip-dot" style={{ background: '#faad14' }}></span>
                  <span className="tooltip-label">平均下载量</span>
                  <span className="tooltip-value">{tooltip.orders}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧进度条 */}
        <div className="progress-card">
          {rightStats.map((item, index) => (
            <div key={index} className="progress-item">
              <div className="progress-header">
                <span className="progress-label">{item.label}</span>
              </div>
              <div className="progress-sub">{item.subLabel}</div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.value}%`, background: item.color }}
                  >
                    <span className="progress-text">{item.value}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
