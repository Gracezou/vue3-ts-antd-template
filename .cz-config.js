module.exports = {
  skipQuestions: ['scope', 'body', 'breaking', 'footer'],
  types: [
    { value: 'feat', name: '新功能' },
    { value: 'fix', name: '修补bug' },
    { value: 'docs', name: '文档更新' },
    { value: 'style', name: '样式更新' },
    { value: 'refactor', name: '结构变动' },
    { value: 'test', name: '添加测试' },
    { value: 'chore', name: '构建过程或辅助工具的变动' },
  ],
}
