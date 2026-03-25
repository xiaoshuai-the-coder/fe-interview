module.exports = {
  // 1. 基础配置
  testEnvironment: 'jsdom', // 模拟浏览器环境（前端项目必选，Node.js项目可改为'node'）
  rootDir: './', // 项目根目录
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).js'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest' // 支持 TypeScript
  },
  testPathIgnorePatterns: [
    '/node_modules/', // 忽略node_modules
    '/dist/', // 忽略构建产物
    '/coverage/' // 忽略覆盖率目录
  ],

  // 2. 模块解析
  moduleFileExtensions: ['ts', 'js', 'json'], // 识别的文件后缀
  moduleDirectories: ['node_modules', 'src'], // 模块查找目录
  // 路径别名（按需配置，比如src目录别名@）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(需要转译的第三方包)/)' // 忽略node_modules转译（特殊包可例外）
  ],

  // 4. 覆盖率配置
  collectCoverage: false, // 默认关闭覆盖率（运行时加--coverage开启）
  collectCoverageFrom: [
    '**/*.ts', // 统计所有 TypeScript 文件的覆盖率
    '!src/**/*.config.js', // 排除配置文件
    '!src/**/index.js', // 可选：排除入口文件
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage', // 覆盖率报告输出目录
  coverageReporters: [
    'text', // 终端文本输出
    'lcov', // 生成lcov格式报告（可导入到Sonar等工具）
    'html' // 生成HTML可视化报告
  ],
  coverageThreshold: { // 覆盖率最低阈值（按需调整）
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // 6. 性能与日志
  verbose: true, // 显示每个测试用例的执行详情
  silent: false, // 不隐藏测试输出
  maxWorkers: '50%', // 并行执行的最大线程数（避免占用过多资源）
  testTimeout: 10000 // 单个测试用例超时时间（默认5000ms，复杂场景可延长）
};