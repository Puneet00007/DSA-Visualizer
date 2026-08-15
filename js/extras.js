/* ============================================
   Sound Engine — Musical tones for sorting
   Web Audio API oscillator
   ============================================ */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = false;
        this.gainNode = null;
        this.baseFreq = 200;
        this.maxFreq = 800;
        this.volume = 0.08;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.ctx.destination);
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) this.init();
        return this.enabled;
    }

    setVolume(v) {
        this.volume = v;
        if (this.gainNode) this.gainNode.gain.value = v;
    }

    // Play a tone based on value (0-1 range mapped to frequency)
    play(value, maxValue, type = 'compare') {
        if (!this.enabled || !this.ctx) return;

        const ratio = value / maxValue;
        const freq = this.baseFreq + ratio * (this.maxFreq - this.baseFreq);
        const duration = type === 'swap' ? 0.06 : 0.03;

        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();

        osc.type = type === 'swap' ? 'square' : 'sine';
        osc.frequency.value = freq;

        env.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(env);
        env.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Play a "sorted" chime
    playSorted() {
        if (!this.enabled || !this.ctx) return;
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const env = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            env.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime + i * 0.1);
            env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.3);
            osc.connect(env);
            env.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.1);
            osc.stop(this.ctx.currentTime + i * 0.1 + 0.3);
        });
    }
}

// Pathfinding Grid Engine
class PathfindingEngine {
    constructor() {
        this.rows = 21;
        this.cols = 41;
        this.grid = [];
        this.start = { r: 10, c: 5 };
        this.end = { r: 10, c: 35 };
        this.visited = new Set();
        this.path = [];
        this.cancelled = false;
        this.speed = 15; // ms delay
    }

    init() {
        this.grid = [];
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = 0; // 0=empty, 1=wall
            }
        }
        this.visited = new Set();
        this.path = [];
        this.cancelled = false;
    }

    reset() {
        this.init();
    }

    randomizeWalls(density = 0.3) {
        this.init();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r === this.start.r && c === this.start.c) ||
                    (r === this.end.r && c === this.end.c)) continue;
                if (Math.random() < density) this.grid[r][c] = 1;
            }
        }
    }

    generateMaze() {
        this.init();
        // Fill all with walls
        for (let r = 0; r < this.rows; r++)
            for (let c = 0; c < this.cols; c++)
                this.grid[r][c] = 1;

        // Recursive backtracker
        const carve = (r, c) => {
            this.grid[r][c] = 0;
            const dirs = [[0,2],[0,-2],[2,0],[-2,0]].sort(() => Math.random() - 0.5);
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc] === 1) {
                    this.grid[r + dr/2][c + dc/2] = 0;
                    carve(nr, nc);
                }
            }
        };
        carve(1, 1);
        this.start = { r: 1, c: 1 };
        this.end = { r: this.rows - 2, c: this.cols - 2 };
        this.grid[this.start.r][this.start.c] = 0;
        this.grid[this.end.r][this.end.c] = 0;
    }

    cancel() { this.cancelled = true; }

    async bfs(onUpdate) {
        this.cancelled = false;
        this.visited = new Set();
        this.path = [];
        const queue = [{ r: this.start.r, c: this.start.c }];
        const parent = {};
        const key = (r, c) => `${r},${c}`;
        this.visited.add(key(this.start.r, this.start.c));
        parent[key(this.start.r, this.start.c)] = null;

        while (queue.length > 0) {
            if (this.cancelled) return [];
            const { r, c } = queue.shift();

            if (r === this.end.r && c === this.end.c) {
                this.path = this._reconstruct(parent, key(r, c));
                await onUpdate(this.visited, this.path, 'done');
                return this.path;
            }

            for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                const nr = r + dr, nc = c + dc;
                const nk = key(nr, nc);
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols &&
                    this.grid[nr][nc] === 0 && !this.visited.has(nk)) {
                    this.visited.add(nk);
                    parent[nk] = key(r, c);
                    queue.push({ r: nr, c: nc });
                }
            }
            await onUpdate(this.visited, this.path, 'running');
            await this._delay();
        }
        await onUpdate(this.visited, this.path, 'nopath');
        return [];
    }

    async dfs(onUpdate) {
        this.cancelled = false;
        this.visited = new Set();
        this.path = [];
        const stack = [{ r: this.start.r, c: this.start.c }];
        const parent = {};
        const key = (r, c) => `${r},${c}`;
        parent[key(this.start.r, this.start.c)] = null;

        while (stack.length > 0) {
            if (this.cancelled) return [];
            const { r, c } = stack.pop();
            const k = key(r, c);

            if (this.visited.has(k)) continue;
            this.visited.add(k);

            if (r === this.end.r && c === this.end.c) {
                this.path = this._reconstruct(parent, k);
                await onUpdate(this.visited, this.path, 'done');
                return this.path;
            }

            for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                const nr = r + dr, nc = c + dc;
                const nk = key(nr, nc);
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols &&
                    this.grid[nr][nc] === 0 && !this.visited.has(nk)) {
                    parent[nk] = k;
                    stack.push({ r: nr, c: nc });
                }
            }
            await onUpdate(this.visited, this.path, 'running');
            await this._delay();
        }
        await onUpdate(this.visited, this.path, 'nopath');
        return [];
    }

    async dijkstra(onUpdate) {
        // Same as BFS for unweighted grid, but with priority queue
        return this.bfs(onUpdate);
    }

    async astar(onUpdate) {
        this.cancelled = false;
        this.visited = new Set();
        this.path = [];
        const key = (r, c) => `${r},${c}`;
        const h = (r, c) => Math.abs(r - this.end.r) + Math.abs(c - this.end.c);
        
        const open = [{ r: this.start.r, c: this.start.c, g: 0, f: h(this.start.r, this.start.c) }];
        const gScore = {};
        const parent = {};
        gScore[key(this.start.r, this.start.c)] = 0;
        parent[key(this.start.r, this.start.c)] = null;

        while (open.length > 0) {
            if (this.cancelled) return [];
            open.sort((a, b) => a.f - b.f);
            const { r, c } = open.shift();
            const k = key(r, c);

            if (this.visited.has(k)) continue;
            this.visited.add(k);

            if (r === this.end.r && c === this.end.c) {
                this.path = this._reconstruct(parent, k);
                await onUpdate(this.visited, this.path, 'done');
                return this.path;
            }

            for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                const nr = r + dr, nc = c + dc;
                const nk = key(nr, nc);
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols &&
                    this.grid[nr][nc] === 0 && !this.visited.has(nk)) {
                    const ng = (gScore[k] || 0) + 1;
                    if (ng < (gScore[nk] ?? Infinity)) {
                        gScore[nk] = ng;
                        parent[nk] = k;
                        open.push({ r: nr, c: nc, g: ng, f: ng + h(nr, nc) });
                    }
                }
            }
            await onUpdate(this.visited, this.path, 'running');
            await this._delay();
        }
        await onUpdate(this.visited, this.path, 'nopath');
        return [];
    }

    _reconstruct(parent, endKey) {
        const path = [];
        let current = endKey;
        while (current) {
            path.unshift(current);
            current = parent[current];
        }
        return path;
    }

    _delay() {
        return new Promise(resolve => setTimeout(resolve, this.speed));
    }
}

window.SoundEngine = SoundEngine;
window.PathfindingEngine = PathfindingEngine;
