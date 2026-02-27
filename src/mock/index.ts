import Mock from 'mockjs'

// 配置 Mock
Mock.setup({
  timeout: '200-600', // 模拟网络延迟
})

// 机构管理数据
Mock.mock('/api/organizations', 'get', () => {
  return Mock.mock({
    code: 0,
    message: 'success',
    'data|50': [
      {
        'id|+1': 1,
        name: '@pick(["行健养老", "迈步健康集团", "康乐养老院", "幸福之家", "温馨养老中心"])',
        region: '@city(true)',
        type: '@pick(["养小", "养中", "养大", "养中空"])',
        phone: /^1[3-9]\d{9}$/,
        status: '@pick(["正常", "停用", "审核中"])',
        packageCount: '@integer(100000, 999999)',
        admin: '@cname()',
        createTime: '@date("yyyy.MM.dd")',
      },
    ],
  })
})

// 新增机构
Mock.mock('/api/organizations', 'post', (options) => {
  const body = JSON.parse(options.body)
  return Mock.mock({
    code: 0,
    message: '新增成功',
    data: {
      id: '@id',
      ...body,
      createTime: '@date("yyyy.MM.dd")',
    },
  })
})

// 编辑机构
Mock.mock(/\/api\/organizations\/\d+/, 'put', (options) => {
  const body = JSON.parse(options.body)
  return Mock.mock({
    code: 0,
    message: '编辑成功',
    data: body,
  })
})

// 删除机构
Mock.mock(/\/api\/organizations\/\d+/, 'delete', () => {
  return Mock.mock({
    code: 0,
    message: '删除成功',
  })
})

export default Mock
