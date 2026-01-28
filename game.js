// 游戏配置参数
const BOARD_SIZE = 15; // 棋盘大小
const CELL_SIZE = 36; // 格子大小
const MARGIN = 30; // 棋盘边距
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE + MARGIN * 2; // Canvas总尺寸

// 游戏状态
const GameStates = {
    PLAYING: 'playing',
    BLACK_WINS: 'black_wins',
    WHITE_WINS: 'white_wins',
    DRAW: 'draw'
};

// 棋子类型
const PieceTypes = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
};

// 五子棋游戏类
class GobangGame {
    constructor(canvas) {
        this.canvas = canvas;
        // 设置Canvas尺寸
        this.canvas.width = CANVAS_SIZE;
        this.canvas.height = CANVAS_SIZE;
        this.ctx = canvas.getContext('2d');
        this.board = []; // 棋盘数据
        this.currentPlayer = PieceTypes.BLACK; // 当前玩家
        this.gameState = GameStates.PLAYING; // 游戏状态
        this.winner = null; // 获胜者

        this.initBoard();
        this.render();
    }

    // 初始化棋盘
    initBoard() {
        this.board = Array(BOARD_SIZE).fill(null).map(() =>
            Array(BOARD_SIZE).fill(PieceTypes.EMPTY)
        );
        this.currentPlayer = PieceTypes.BLACK;
        this.gameState = GameStates.PLAYING;
        this.winner = null;

        // 绑定点击事件
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }


    // 处理点击事件
    handleClick(event) {
        if (this.gameState !== GameStates.PLAYING) {
            return; // 游戏已结束
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 计算点击的格子坐标
        const row = Math.round((y - MARGIN) / CELL_SIZE);
        const col = Math.round((x - MARGIN) / CELL_SIZE);

        // 验证坐标是否在有效范围内
        if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            this.makeMove(row, col);
        }
    }

    // 执行落子
    makeMove(row, col) {
        if (this.board[row][col] !== PieceTypes.EMPTY) {
            return; // 该位置已有棋子
        }

        // 在棋盘上放置棋子
        this.board[row][col] = this.currentPlayer;

        // 检查是否获胜
        if (this.checkWin(row, col, this.currentPlayer)) {
            this.gameState = this.currentPlayer === PieceTypes.BLACK
                ? GameStates.BLACK_WINS
                : GameStates.WHITE_WINS;
            this.winner = this.currentPlayer;
        } else if (this.checkDraw()) {
            this.gameState = GameStates.DRAW;
        } else {
            // 切换到下一个玩家
            this.currentPlayer = this.currentPlayer === PieceTypes.BLACK
                ? PieceTypes.WHITE
                : PieceTypes.BLACK;
        }

        this.render();
        this.updateUI();
    }

    // 检查是否获胜
    checkWin(row, col, player) {
        // 检查四个方向：水平、垂直、两条对角线
        const directions = [
            [[0, 1], [0, -1]],   // 水平方向
            [[1, 0], [-1, 0]],   // 垂直方向
            [[1, 1], [-1, -1]],  // 主对角线方向
            [[1, -1], [-1, 1]]   // 副对角线方向
        ];

        for (const direction of directions) {
            let count = 1; // 当前方向连续棋子数（包含当前棋子）

            // 检查正反两个方向
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;

                // 沿当前方向统计连续棋子数
                while (
                    r >= 0 && r < BOARD_SIZE &&
                    c >= 0 && c < BOARD_SIZE &&
                    this.board[r][c] === player
                ) {
                    count++;
                    r += dr;
                    c += dc;
                }
            }

            // 如果任意方向有5个或更多连续棋子，则获胜
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查是否平局（棋盘已满）
    checkDraw() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (this.board[row][col] === PieceTypes.EMPTY) {
                    return false; // 还有空位，未平局
                }
            }
        }
        return true; // 棋盘已满
    }

    // 绘制棋盘
    drawBoard() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;

        // 绘制网格线
        for (let i = 0; i < BOARD_SIZE; i++) {
            const pos = i * CELL_SIZE + MARGIN;

            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(pos, MARGIN);
            this.ctx.lineTo(pos, CANVAS_SIZE - MARGIN);
            this.ctx.stroke();

            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(MARGIN, pos);
            this.ctx.lineTo(CANVAS_SIZE - MARGIN, pos);
            this.ctx.stroke();
        }

        // 绘制星位点（棋盘上的特殊点）
        this.ctx.fillStyle = '#333';
        const starPoints = [3, 7, 11];
        for (const row of starPoints) {
            for (const col of starPoints) {
                this.ctx.beginPath();
                this.ctx.arc(
                    col * CELL_SIZE + MARGIN,
                    row * CELL_SIZE + MARGIN,
                    4,
                    0,
                    2 * Math.PI
                );
                this.ctx.fill();
            }
        }
    }

    // 绘制棋子
    drawPieces() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = this.board[row][col];

                if (piece === PieceTypes.EMPTY) {
                    continue; // 跳过空位
                }

                const x = col * CELL_SIZE + MARGIN;
                const y = row * CELL_SIZE + MARGIN;

                // 绘制棋子
                this.ctx.beginPath();
                this.ctx.arc(x, y, 14, 0, 2 * Math.PI);

                if (piece === PieceTypes.BLACK) {
                    this.ctx.fillStyle = '#000';
                } else {
                    this.ctx.fillStyle = '#fff';
                }

                this.ctx.fill();
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
    }

    // 渲染游戏画面
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景
        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制游戏内容
        this.drawBoard();
        this.drawPieces();
    }

    // 重新开始游戏
    restart() {
        this.initBoard();
        this.render();
        this.updateUI();
    }

    // 更新UI显示
    updateUI() {
        const currentPlayerEl = document.getElementById('currentPlayer');
        const gameStatusEl = document.getElementById('gameStatus');

        // 更新当前玩家显示
        if (this.currentPlayer === PieceTypes.BLACK) {
            currentPlayerEl.textContent = '黑棋';
            currentPlayerEl.style.color = '#000';
            currentPlayerEl.style.backgroundColor = 'transparent';
            currentPlayerEl.style.padding = '0';
        } else {
            currentPlayerEl.textContent = '白棋';
            currentPlayerEl.style.color = '#fff';
            currentPlayerEl.style.backgroundColor = '#333';
            currentPlayerEl.style.padding = '2px 8px';
            currentPlayerEl.style.borderRadius = '4px';
        }

        // 更新游戏状态提示
        switch (this.gameState) {
            case GameStates.PLAYING:
                gameStatusEl.textContent = '';
                break;
            case GameStates.BLACK_WINS:
                gameStatusEl.textContent = '游戏结束！黑棋获胜！';
                break;
            case GameStates.WHITE_WINS:
                gameStatusEl.textContent = '游戏结束！白棋获胜！';
                break;
            case GameStates.DRAW:
                gameStatusEl.textContent = '游戏结束！平局！';
                break;
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new GobangGame(canvas);

    // 绑定重新开始按钮
    document.getElementById('restartBtn').addEventListener('click', () => {
        game.restart();
    });

    // 初始更新UI
    game.updateUI();
});
