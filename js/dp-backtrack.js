/* ============================================
   Dynamic Programming Visualizations
   Knapsack, Coin Change, LCS, Grid Paths, Fibonacci
   ============================================ */

class DPEngine {
    constructor() {
        this.cancelled = false;
        this.speed = 150;
        this.steps = [];
    }

    cancel() { this.cancelled = true; }

    _delay() {
        return new Promise(r => setTimeout(r, this.speed));
    }

    // ============ 0/1 KNAPSACK ============
    async knapsack(weights, values, capacity, onUpdate) {
        this.cancelled = false;
        const n = weights.length;
        const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
        const highlights = { current: null, depends: [], included: [] };

        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (this.cancelled) return dp;

                if (weights[i - 1] <= w) {
                    const exclude = dp[i - 1][w];
                    const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
                    
                    highlights.current = { r: i, c: w };
                    highlights.depends = [
                        { r: i - 1, c: w },
                        { r: i - 1, c: w - weights[i - 1] }
                    ];
                    highlights.explanation = `Item ${i} (w=${weights[i-1]}, v=${values[i-1]}): ` +
                        `exclude=${exclude} vs include=${values[i-1]}+${dp[i-1][w - weights[i-1]]}=${include}`;

                    dp[i][w] = Math.max(exclude, include);

                    if (include > exclude) {
                        highlights.choice = 'include';
                    } else {
                        highlights.choice = 'exclude';
                    }

                    await onUpdate(dp, { ...highlights }, `Filling dp[${i}][${w}]`);
                    await this._delay();
                } else {
                    dp[i][w] = dp[i - 1][w];
                    highlights.current = { r: i, c: w };
                    highlights.depends = [{ r: i - 1, c: w }];
                    highlights.explanation = `Item ${i} (w=${weights[i-1]}) too heavy for capacity ${w}, copy above`;
                    highlights.choice = 'copy';

                    await onUpdate(dp, { ...highlights }, `dp[${i}][${w}] = dp[${i-1}][${w}]`);
                    await this._delay();
                }
            }
        }

        highlights.current = null;
        highlights.depends = [];
        highlights.explanation = `Maximum value: ${dp[n][capacity]}`;
        highlights.choice = 'done';
        await onUpdate(dp, highlights, `Answer: ${dp[n][capacity]}`);
        return dp;
    }

    // ============ COIN CHANGE ============
    async coinChange(coins, amount, onUpdate) {
        this.cancelled = false;
        const dp = new Array(amount + 1).fill(Infinity);
        dp[0] = 0;
        const highlights = { current: -1, comparing: [], explanation: '' };

        for (let i = 1; i <= amount; i++) {
            for (const coin of coins) {
                if (this.cancelled) return dp;

                if (coin <= i && dp[i - coin] !== Infinity) {
                    highlights.current = i;
                    highlights.comparing = [i - coin];
                    highlights.activeCoin = coin;
                    highlights.explanation = `Amount ${i}: try coin ${coin} → dp[${i}] = min(${dp[i] === Infinity ? '∞' : dp[i]}, dp[${i - coin}] + 1 = ${dp[i - coin] + 1})`;

                    if (dp[i - coin] + 1 < dp[i]) {
                        dp[i] = dp[i - coin] + 1;
                    }

                    await onUpdate([...dp], { ...highlights });
                    await this._delay();
                }
            }
        }

        highlights.current = -1;
        highlights.comparing = [];
        highlights.explanation = dp[amount] === Infinity ? `Cannot make amount ${amount}` : `Minimum coins: ${dp[amount]}`;
        await onUpdate([...dp], highlights);
        return dp;
    }

    // ============ LCS (Longest Common Subsequence) ============
    async lcs(s1, s2, onUpdate) {
        this.cancelled = false;
        const m = s1.length, n = s2.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        const highlights = { current: null, depends: [], match: false, explanation: '' };

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (this.cancelled) return dp;

                highlights.current = { r: i, c: j };

                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    highlights.depends = [{ r: i - 1, c: j - 1 }];
                    highlights.match = true;
                    highlights.explanation = `'${s1[i-1]}' === '${s2[j-1]}' → dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    highlights.depends = [{ r: i - 1, c: j }, { r: i, c: j - 1 }];
                    highlights.match = false;
                    highlights.explanation = `'${s1[i-1]}' ≠ '${s2[j-1]}' → max(dp[${i-1}][${j}]=${dp[i-1][j]}, dp[${i}][${j-1}]=${dp[i][j-1]}) = ${dp[i][j]}`;
                }

                await onUpdate(dp, { ...highlights }, s1, s2);
                await this._delay();
            }
        }

        highlights.current = null;
        highlights.depends = [];
        highlights.explanation = `LCS length: ${dp[m][n]}`;
        await onUpdate(dp, highlights, s1, s2);
        return dp;
    }

    // ============ UNIQUE PATHS (Grid) ============
    async uniquePaths(rows, cols, onUpdate) {
        this.cancelled = false;
        const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
        const highlights = { current: null, depends: [], explanation: '' };

        // First row and col = 1
        for (let r = 0; r < rows; r++) {
            dp[r][0] = 1;
            highlights.current = { r, c: 0 };
            highlights.explanation = `First column: only 1 way (go straight down)`;
            await onUpdate(dp, { ...highlights });
            await this._delay();
        }
        for (let c = 1; c < cols; c++) {
            dp[0][c] = 1;
            highlights.current = { r: 0, c };
            highlights.explanation = `First row: only 1 way (go straight right)`;
            await onUpdate(dp, { ...highlights });
            await this._delay();
        }

        for (let r = 1; r < rows; r++) {
            for (let c = 1; c < cols; c++) {
                if (this.cancelled) return dp;
                dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
                highlights.current = { r, c };
                highlights.depends = [{ r: r - 1, c }, { r, c: c - 1 }];
                highlights.explanation = `dp[${r}][${c}] = dp[${r-1}][${c}] + dp[${r}][${c-1}] = ${dp[r-1][c]} + ${dp[r][c-1]} = ${dp[r][c]}`;
                await onUpdate(dp, { ...highlights });
                await this._delay();
            }
        }

        highlights.current = null;
        highlights.depends = [];
        highlights.explanation = `Total unique paths: ${dp[rows - 1][cols - 1]}`;
        await onUpdate(dp, highlights);
        return dp;
    }

    // ============ FIBONACCI ============
    async fibonacci(n, onUpdate) {
        this.cancelled = false;
        const dp = new Array(n + 1).fill(0);
        if (n >= 0) dp[0] = 0;
        if (n >= 1) dp[1] = 1;
        const highlights = { current: -1, depends: [], explanation: '' };

        await onUpdate([...dp], { ...highlights, explanation: 'Base cases: F(0)=0, F(1)=1' });
        await this._delay();

        for (let i = 2; i <= n; i++) {
            if (this.cancelled) return dp;
            dp[i] = dp[i - 1] + dp[i - 2];
            highlights.current = i;
            highlights.depends = [i - 1, i - 2];
            highlights.explanation = `F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`;
            await onUpdate([...dp], { ...highlights });
            await this._delay();
        }

        highlights.current = -1;
        highlights.depends = [];
        highlights.explanation = `F(${n}) = ${dp[n]}`;
        await onUpdate([...dp], highlights);
        return dp;
    }
}


/* ============================================
   Backtracking Visualizations
   N-Queens, Sudoku Solver, Maze Generation
   ============================================ */

class BacktrackEngine {
    constructor() {
        this.cancelled = false;
        this.speed = 200;
    }

    cancel() { this.cancelled = true; }

    _delay() {
        return new Promise(r => setTimeout(r, this.speed));
    }

    // ============ N-QUEENS ============
    async nQueens(n, onUpdate) {
        this.cancelled = false;
        const board = Array.from({ length: n }, () => new Array(n).fill('.'));
        const state = {
            board,
            queens: 0,
            trying: null,
            backtracking: false,
            conflicts: [],
            explanation: `Placing ${n} queens on a ${n}×${n} board`,
            solutions: 0,
            row: 0
        };

        const solve = async (row) => {
            if (this.cancelled) return false;
            if (row === n) {
                state.solutions++;
                state.explanation = `Solution #${state.solutions} found!`;
                await onUpdate({ ...state, board: board.map(r => [...r]) });
                await this._delay();
                return true;
            }

            state.row = row;

            for (let col = 0; col < n; col++) {
                if (this.cancelled) return false;

                state.trying = { r: row, c: col };
                state.backtracking = false;
                state.conflicts = [];
                state.explanation = `Row ${row}: trying column ${col}`;

                // Check conflicts
                const conflicts = this._getQueenConflicts(board, row, col, n);
                state.conflicts = conflicts;

                await onUpdate({ ...state, board: board.map(r => [...r]) });
                await this._delay();

                if (conflicts.length === 0) {
                    board[row][col] = 'Q';
                    state.queens++;
                    state.explanation = `Placed queen at (${row}, ${col}) — safe!`;
                    await onUpdate({ ...state, board: board.map(r => [...r]) });
                    await this._delay();

                    const found = await solve(row + 1);
                    if (found) return true;

                    // Backtrack
                    board[row][col] = '.';
                    state.queens--;
                    state.backtracking = true;
                    state.trying = { r: row, c: col };
                    state.explanation = `Backtrack: removing queen from (${row}, ${col})`;
                    await onUpdate({ ...state, board: board.map(r => [...r]) });
                    await this._delay();
                }
            }
            return false;
        };

        await solve(0);
        state.trying = null;
        state.explanation = state.solutions > 0
            ? `Done! Found ${state.solutions} solution(s)`
            : `No solution exists for ${n}-Queens`;
        await onUpdate({ ...state, board: board.map(r => [...r]) });
    }

    _getQueenConflicts(board, row, col, n) {
        const conflicts = [];
        // Same column
        for (let r = 0; r < row; r++) {
            if (board[r][col] === 'Q') conflicts.push({ r, c: col });
        }
        // Diagonals
        for (let r = 0; r < row; r++) {
            const d1 = col - (row - r);
            const d2 = col + (row - r);
            if (d1 >= 0 && board[r][d1] === 'Q') conflicts.push({ r, c: d1 });
            if (d2 < n && board[r][d2] === 'Q') conflicts.push({ r, c: d2 });
        }
        return conflicts;
    }

    // ============ SUDOKU SOLVER ============
    async sudoku(puzzle, onUpdate) {
        this.cancelled = false;
        const board = puzzle.map(r => [...r]);
        const state = {
            board,
            trying: null,
            value: 0,
            backtracking: false,
            invalid: false,
            explanation: 'Solving Sudoku with backtracking',
            cellsFilled: 0
        };

        const findEmpty = () => {
            for (let r = 0; r < 9; r++)
                for (let c = 0; c < 9; c++)
                    if (board[r][c] === 0) return { r, c };
            return null;
        };

        const isValid = (row, col, num) => {
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num) return false;
                if (board[i][col] === num) return false;
            }
            const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
            for (let r = br; r < br + 3; r++)
                for (let c = bc; c < bc + 3; c++)
                    if (board[r][c] === num) return false;
            return true;
        };

        const solve = async () => {
            if (this.cancelled) return false;
            const empty = findEmpty();
            if (!empty) return true;

            const { r, c } = empty;
            state.trying = { r, c };

            for (let num = 1; num <= 9; num++) {
                if (this.cancelled) return false;

                state.value = num;
                state.backtracking = false;
                state.invalid = false;

                if (isValid(r, c, num)) {
                    board[r][c] = num;
                    state.cellsFilled++;
                    state.explanation = `Place ${num} at (${r},${c}) — valid`;
                    await onUpdate({ ...state, board: board.map(r => [...r]) });
                    await this._delay();

                    if (await solve()) return true;

                    board[r][c] = 0;
                    state.cellsFilled--;
                    state.backtracking = true;
                    state.explanation = `Backtrack: remove ${num} from (${r},${c})`;
                    await onUpdate({ ...state, board: board.map(r => [...r]) });
                    await this._delay();
                } else {
                    state.invalid = true;
                    state.explanation = `Can't place ${num} at (${r},${c}) — conflicts`;
                    await onUpdate({ ...state, board: board.map(r => [...r]) });
                    await this._delay();
                }
            }
            return false;
        };

        await solve();
        state.trying = null;
        state.explanation = 'Sudoku solved!' + (this.cancelled ? ' (cancelled)' : '');
        await onUpdate({ ...state, board: board.map(r => [...r]) });
    }

    // ============ MAZE GENERATION (Recursive Backtracker) ============
    async generateMaze(rows, cols, onUpdate) {
        this.cancelled = false;
        // Ensure odd dimensions for proper maze
        rows = rows % 2 === 0 ? rows + 1 : rows;
        cols = cols % 2 === 0 ? cols + 1 : cols;

        const grid = Array.from({ length: rows }, () => new Array(cols).fill(1)); // 1 = wall
        const state = {
            grid,
            current: null,
            stack: [],
            carving: null,
            explanation: 'Generating maze with recursive backtracker'
        };

        const carve = async (r, c) => {
            if (this.cancelled) return;
            grid[r][c] = 0;
            state.current = { r, c };
            state.stack.push({ r, c });

            const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);

            for (const [dr, dc] of dirs) {
                if (this.cancelled) return;
                const nr = r + dr, nc = c + dc;
                if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 1) {
                    state.carving = { r: r + dr / 2, c: c + dc / 2 };
                    grid[r + dr / 2][c + dc / 2] = 0;
                    state.explanation = `Carving passage from (${r},${c}) to (${nr},${nc})`;
                    await onUpdate({ ...state, grid: grid.map(r => [...r]) });
                    await this._delay();

                    await carve(nr, nc);
                }
            }

            state.stack.pop();
            state.current = state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;
        };

        await carve(1, 1);

        state.current = null;
        state.carving = null;
        state.explanation = 'Maze generated!';
        await onUpdate({ ...state, grid: grid.map(r => [...r]) });
    }

    // ============ RAT IN A MAZE ============
    async ratInMaze(maze, onUpdate) {
        this.cancelled = false;
        const n = maze.length;
        const solution = Array.from({ length: n }, () => new Array(n).fill(0));
        const state = {
            maze: maze.map(r => [...r]),
            solution: solution.map(r => [...r]),
            current: null,
            backtracking: false,
            explanation: 'Finding path from (0,0) to (n-1,n-1)'
        };

        const solve = async (r, c) => {
            if (this.cancelled) return false;
            if (r === n - 1 && c === n - 1 && maze[r][c] === 1) {
                solution[r][c] = 1;
                state.current = { r, c };
                state.explanation = 'Reached destination!';
                await onUpdate({ ...state, solution: solution.map(r => [...r]) });
                return true;
            }

            if (r >= 0 && r < n && c >= 0 && c < n && maze[r][c] === 1 && solution[r][c] === 0) {
                solution[r][c] = 1;
                state.current = { r, c };
                state.backtracking = false;
                state.explanation = `Trying (${r},${c})`;
                await onUpdate({ ...state, solution: solution.map(r => [...r]) });
                await this._delay();

                if (await solve(r + 1, c)) return true;
                if (await solve(r, c + 1)) return true;

                solution[r][c] = 0;
                state.current = { r, c };
                state.backtracking = true;
                state.explanation = `Backtrack from (${r},${c}) — dead end`;
                await onUpdate({ ...state, solution: solution.map(r => [...r]) });
                await this._delay();
            }
            return false;
        };

        await solve(0, 0);
        state.current = null;
        await onUpdate({ ...state, solution: solution.map(r => [...r]) });
    }

    // Default sudoku puzzle
    static getDefaultSudoku() {
        return [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ];
    }
}

window.DPEngine = DPEngine;
window.BacktrackEngine = BacktrackEngine;
