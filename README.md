# 五子棋小游戏

一个简单的五子棋（Gomoku）网页游戏，使用纯HTML、CSS和JavaScript实现。

## 游戏功能

- ✅ 15x15标准五子棋棋盘
- ✅ 黑白棋子交替落子
- ✅ 智能胜负判定（四方向连珠检查）
- ✅ 平局检测
- ✅ 游戏状态实时显示
- ✅ 重新开始功能
- ✅ 响应式设计，支持移动端

## 快速开始

### 方式一：直接打开（推荐测试）
```bash
# 在浏览器中直接打开
open index.html
```

### 方式二：使用本地服务器
```bash
# 使用Python启动HTTP服务器
python3 -m http.server 8000

# 或使用Node.js的http-server
npx http-server -p 8000

# 然后在浏览器中访问
http://localhost:8000
```

## 项目结构

```
gobang-game/
├── index.html      # 主页面
├── game.js         # 游戏逻辑
├── styles.css      # 样式文件
├── .gitignore      # Git忽略规则
└── README.md       # 项目说明
```

## 技术栈

- **HTML5**: 页面结构和Canvas绘图
- **CSS3**: 响应式布局和样式设计
- **Vanilla JavaScript (ES6+)**: 游戏逻辑和交互
- **Git**: 版本控制

## 游戏规则

1. 游戏在15x15的棋盘上进行
2. 黑棋先手，双方轮流落子
3. 先连成五子的一方获胜（横、竖、斜均可）
4. 棋盘下满无胜者则为平局

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发说明

本项目使用原生Web技术，无需构建工具，可直接运行。
如需添加新功能或修改样式，只需编辑对应文件即可。

## License

MIT License

## 贡献

欢迎提交Issue和Pull Request！
