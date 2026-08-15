/* ============================================
   ALGORITHMS VISUALIZATION MODULE
   BFS, DFS, Binary Search, Dijkstra, Recursion
   ============================================ */

class AlgorithmVisualizer {
    constructor() {
        this.speed = 500; // ms per step
        this.cancelled = false;
    }

    setSpeed(ms) {
        this.speed = ms;
    }

    async delay() {
        if (this.cancelled) throw new Error('cancelled');
        return new Promise(resolve => setTimeout(resolve, this.speed));
    }

    cancel() {
        this.cancelled = true;
    }

    reset() {
        this.cancelled = false;
    }

    // ========== BFS ==========
    async bfs(nodes, edges, startId, onUpdate) {
        this.reset();
        const adj = GraphBuilder.getAdjList(nodes, edges);
        const visited = new Set();
        const queue = [startId];
        visited.add(startId);
        const order = [];

        while (queue.length > 0) {
            if (this.cancelled) return order;
            const current = queue.shift();
            order.push(current);

            await onUpdate({
                type: 'bfs',
                current,
                visited: [...visited],
                queue: [...queue],
                order: [...order]
            });
            await this.delay();

            const neighbors = adj[current] || [];
            for (const { to } of neighbors) {
                if (!visited.has(to)) {
                    visited.add(to);
                    queue.push(to);
                    await onUpdate({
                        type: 'bfs',
                        current,
                        visited: [...visited],
                        queue: [...queue],
                        order: [...order],
                        exploring: to
                    });
                    await this.delay();
                }
            }
        }

        await onUpdate({
            type: 'bfs',
            current: null,
            visited: [...visited],
            queue: [],
            order: [...order],
            done: true
        });

        return order;
    }

    // ========== DFS ==========
    async dfs(nodes, edges, startId, onUpdate) {
        this.reset();
        const adj = GraphBuilder.getAdjList(nodes, edges);
        const visited = new Set();
        const order = [];
        const stack = [startId];

        while (stack.length > 0) {
            if (this.cancelled) return order;
            const current = stack.pop();

            if (visited.has(current)) continue;
            visited.add(current);
            order.push(current);

            await onUpdate({
                type: 'dfs',
                current,
                visited: [...visited],
                stack: [...stack],
                order: [...order]
            });
            await this.delay();

            const neighbors = (adj[current] || []).slice().reverse();
            for (const { to } of neighbors) {
                if (!visited.has(to)) {
                    stack.push(to);
                }
            }
        }

        await onUpdate({
            type: 'dfs',
            current: null,
            visited: [...visited],
            stack: [],
            order: [...order],
            done: true
        });

        return order;
    }

    // ========== BINARY SEARCH ==========
    async binarySearch(arr, target, onUpdate) {
        this.reset();
        let low = 0;
        let high = arr.length - 1;
        const steps = [];

        while (low <= high) {
            if (this.cancelled) return { found: false, steps };
            const mid = Math.floor((low + high) / 2);

            await onUpdate({
                type: 'binarysearch',
                low,
                high,
                mid,
                arr,
                target,
                steps: [...steps]
            });
            await this.delay();

            steps.push({ low, high, mid, value: arr[mid] });

            if (arr[mid] === target) {
                await onUpdate({
                    type: 'binarysearch',
                    low, high, mid, arr, target,
                    found: true,
                    steps: [...steps]
                });
                return { found: true, index: mid, steps };
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        await onUpdate({
            type: 'binarysearch',
            low, high, mid: -1, arr, target,
            found: false,
            steps: [...steps]
        });

        return { found: false, steps };
    }

    // ========== DIJKSTRA ==========
    async dijkstra(nodes, edges, startId, onUpdate) {
        this.reset();
        const adj = GraphBuilder.getAdjList(nodes, edges);
        const dist = {};
        const prev = {};
        const visited = new Set();
        const pq = [];

        for (const node of nodes) {
            dist[node.id] = Infinity;
            prev[node.id] = null;
        }
        dist[startId] = 0;
        pq.push({ id: startId, dist: 0 });

        while (pq.length > 0) {
            if (this.cancelled) return dist;

            // Get minimum distance node
            pq.sort((a, b) => a.dist - b.dist);
            const { id: current } = pq.shift();

            if (visited.has(current)) continue;
            visited.add(current);

            await onUpdate({
                type: 'dijkstra',
                current,
                visited: [...visited],
                distances: { ...dist },
                previous: { ...prev }
            });
            await this.delay();

            const neighbors = adj[current] || [];
            for (const { to, weight } of neighbors) {
                if (visited.has(to)) continue;
                const newDist = dist[current] + weight;
                if (newDist < dist[to]) {
                    dist[to] = newDist;
                    prev[to] = current;
                    pq.push({ id: to, dist: newDist });

                    await onUpdate({
                        type: 'dijkstra',
                        current,
                        relaxing: to,
                        visited: [...visited],
                        distances: { ...dist },
                        previous: { ...prev }
                    });
                    await this.delay();
                }
            }
        }

        await onUpdate({
            type: 'dijkstra',
            current: null,
            visited: [...visited],
            distances: { ...dist },
            previous: { ...prev },
            done: true
        });

        return dist;
    }

    // ========== RECURSION TREE ==========
    buildRecursionTree(type, n) {
        switch (type) {
            case 'factorial':
                return this._buildFactorialTree(n);
            case 'fibonacci':
                return this._buildFibonacciTree(n);
            case 'merge':
                return this._buildMergeTree(n);
            default:
                return this._buildFactorialTree(n);
        }
    }

    _buildFactorialTree(n) {
        let maxDepth = 0;
        const build = (val, depth) => {
            maxDepth = Math.max(maxDepth, depth);
            if (val <= 1) return { label: `${val}! = 1`, children: null, depth };
            const child = build(val - 1, depth + 1);
            return {
                label: `${val}!`,
                result: this._factorial(val),
                children: [child],
                depth
            };
        };
        const root = build(n, 0);
        return { root, maxDepth };
    }

    _buildFibonacciTree(n) {
        n = Math.min(n, 10); // Limit for performance
        let maxDepth = 0;
        const build = (val, depth) => {
            maxDepth = Math.max(maxDepth, depth);
            if (val <= 1) return { label: `F(${val})=${val}`, children: null, depth };
            const left = build(val - 1, depth + 1);
            const right = build(val - 2, depth + 1);
            return {
                label: `F(${val})`,
                children: [left, right],
                depth
            };
        };
        const root = build(n, 0);
        return { root, maxDepth };
    }

    _buildMergeTree(n) {
        let maxDepth = 0;
        const build = (start, end, depth) => {
            maxDepth = Math.max(maxDepth, depth);
            const label = `[${start}..${end}]`;
            if (start >= end) return { label, children: null, depth };
            const mid = Math.floor((start + end) / 2);
            const left = build(start, mid, depth + 1);
            const right = build(mid + 1, end, depth + 1);
            return { label, children: [left, right], depth };
        };
        const root = build(0, n - 1, 0);
        return { root, maxDepth };
    }

    _factorial(n) {
        return n <= 1 ? 1 : n * this._factorial(n - 1);
    }
}

window.AlgorithmVisualizer = AlgorithmVisualizer;
