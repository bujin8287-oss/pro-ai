import { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import './OperationsDashboard.css'

interface StatCard {
  title: string
  value: string
  subtitle: string
  subtitleValue: string
  trend?: number
}

interface ProgressItem {
  title: string
  subtitle: string
  percentage: number
}

export function OperationsDashboard() {
  const [stats] = useState<StatCard[]>([
    {
      title: '访问量',
      value: '999,999',
      subtitle: '总计访问量',
      subtitleValue: '987',
      trend: 21,
    },
    {
      title: '下载',
      value: '45,321',
      subtitle: '累下载',
      subtitleValue: '2342111',
      trend: 21,
    },
    {
      title: '收入',
      value: '876,945',
      subtitle: '总收入',
      subtitleValue: '2342111',
      trend: -14,
    },
    {
      title: '活跃用户',
      value: '76,456',
      subtitle: '最近一个月',
      subtitleValue: '987',
    },
  ])

  const [progressData] = useState<ProgressItem[]>([
    {
      title: '月访问量',
      subtitle: '同比上期增长',
      percentage: 30,
    },
    {
      title: '月下载数',
      subtitle: '同比上期增长',
      percentage: 80,
    },
    {
      title: '月收入',
      subtitle: '同比上期增长',
      percentage: -14,
    },
  ])

  // ECharts 配置
  const chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['访问', '下载', '收入'],
      top: 10,
      right: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#E5E7EB',
        },
      },
    },
    series: [
      {
        name: '访问',
        type: 'line',
        smooth: true,
        data: [150, 120, 200, 100, 180, 130],
        itemStyle: {
          color: '#5B8FF9',
        },
        lineStyle: {
          width: 2,
        },
      },
      {
        name: '下载',
        type: 'line',
        smooth: true,
        data: [180, 150, 250, 120, 200, 160],
        itemStyle: {
          color: '#5AD8A6',
        },
        lineStyle: {
          width: 2,
        },
      },
      {
        name: '收入',
        type: 'line',
        smooth: true,
        data: [200, 180, 220, 150, 240, 180],
        itemStyle: {
          color: '#F6BD16',
        },
        lineStyle: {
          width: 2,
        },
      },
    ],
  }

  return (
    <div className="operations-dashboard">
      {/* 统计卡片 */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer">
              <div className="stat-info">
                <span className="stat-subtitle">{stat.subtitle}</span>
                <span className="stat-subtitle-value">{stat.subtitleValue}</span>
              </div>
              {stat.trend !== undefined && (
                <span className={`stat-trend ${stat.trend >= 0 ? 'positive' : 'negative'}`}>
                  {stat.trend > 0 ? '+' : ''}
                  {stat.trend}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 图表和进度条区域 */}
      <div className="content-grid">
        {/* 访问趋势图表 */}
        <div className="chart-card">
          <h3 className="card-title">访问趋势</h3>
          <ReactECharts option={chartOption} style={{ height: '350px' }} />
        </div>

        {/* 进度指标 */}
        <div className="progress-card">
          {progressData.map((item, index) => (
            <div key={index} className="progress-item">
              <div className="progress-header">
                <span className="progress-title">{item.title}</span>
              </div>
              <div className="progress-subtitle">{item.subtitle}</div>
              <div className="progress-bar-container">
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar ${item.percentage < 0 ? 'negative' : ''}`}
                    style={{
                      width: `${Math.abs(item.percentage)}%`,
                    }}
                  >
                    <span className="progress-label">
                      {item.percentage > 0 ? '+' : ''}
                      {item.percentage}%
                    </span>
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
