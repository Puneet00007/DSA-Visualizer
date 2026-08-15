/* ============================================
   DATA STRUCTURES VISUALIZATION MODULE
   ============================================ */

class DataStructureVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationSpeed = 500;
        this.colors = {
            primary: '#3b82f6',
            primaryLight: '#60a5fa',
            secondary: '#06b6d4',
            accent: '#ec4899',
            warning: '#f59e0b',
            success: '#10b981',
            danger: '#ef4444',
            info: '#60a5fa',
            text: '#fafafa',
            textDark: '#09090b',
            bg: '#141418',
            node: '#3b82f6',
            nodeBorder: '#60a5fa',
            nodeActive: '#ec4899',
            nodeVisited: '#10b981',
            nodeHighlight: '#f59e0b',
            edge: '#3f3f46',
            edgeActive: '#a855f7'
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        this.w = rect.width;
        this.h = rect.height;
    }

    drawRoundRect(x, y, w, h, r, fill, stroke) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
        if (fill) { this.ctx.fillStyle = fill; this.ctx.fill(); }
        if (stroke) { this.ctx.strokeStyle = stroke; this.ctx.lineWidth = 2; this.ctx.stroke(); }
    }

    drawCircle(x, y, r, fill, stroke) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        if (fill) { this.ctx.fillStyle = fill; this.ctx.fill(); }
        if (stroke) { this.ctx.strokeStyle = stroke; this.ctx.lineWidth = 2.5; this.ctx.stroke(); }
    }

    drawArrow(x1, y1, x2, y2, color = this.colors.edge, width = 2) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
        // Arrowhead
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    drawLine(x1, y1, x2, y2, color = this.colors.edge, width = 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    }

    drawText(text, x, y, color = this.colors.text, size = 14, align = 'center') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px 'Segoe UI', sans-serif`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }

    drawBoldText(text, x, y, color = this.colors.text, size = 14, align = 'center') {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size}px 'Segoe UI', sans-serif`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }

    // ========== ARRAY VISUALIZATION ==========
    drawArray(arr, highlights = {}) {
        this.clear();
        this.resize();
        const n = arr.length;
        if (n === 0) {
            this.drawText('Array is empty. Add elements to visualize.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }
        const maxCellW = 60;
        const cellH = 50;
        const gap = 4;
        const totalW = Math.min(n * (maxCellW + gap), this.w - 40);
        const cellW = Math.min(maxCellW, (totalW - (n - 1) * gap) / n);
        const startX = (this.w - (n * cellW + (n - 1) * gap)) / 2;
        const startY = this.h / 2 - cellH / 2;

        for (let i = 0; i < n; i++) {
            const x = startX + i * (cellW + gap);
            let bgColor = this.colors.node;
            if (highlights.active && highlights.active.includes(i)) bgColor = this.colors.nodeActive;
            if (highlights.found === i) bgColor = this.colors.success;
            if (highlights.insert === i) bgColor = this.colors.warning;
            if (highlights.delete === i) bgColor = this.colors.danger;

            this.drawRoundRect(x, startY, cellW, cellH, 8, bgColor, this.colors.nodeBorder);
            this.drawBoldText(String(arr[i]), x + cellW / 2, startY + cellH / 2, '#FFF', Math.min(16, cellW * 0.35));
            this.drawText(i.toString(), x + cellW / 2, startY + cellH + 16, this.colors.text, 11);
        }
        this.drawText('Index', startX - 30, startY + cellH + 16, this.colors.text, 11);
    }

    // ========== LINKED LIST VISUALIZATION ==========
    drawLinkedList(list, highlights = {}) {
        this.clear();
        this.resize();
        const n = list.length;
        if (n === 0) {
            this.drawText('Linked List is empty. Add nodes to visualize.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }
        const nodeW = 80, nodeH = 40;
        const gap = 50;
        const totalW = n * nodeW + (n - 1) * gap;
        const startX = Math.max(20, (this.w - totalW) / 2);
        const startY = this.h / 2 - nodeH / 2;

        // Draw HEAD pointer
        this.drawBoldText('HEAD', startX + nodeW / 2, startY - 30, this.colors.accent, 12);
        this.drawArrow(startX + nodeW / 2, startY - 20, startX + nodeW / 2, startY - 4, this.colors.accent);

        for (let i = 0; i < n; i++) {
            const x = startX + i * (nodeW + gap);
            let bgColor = this.colors.node;
            if (highlights.active === i) bgColor = this.colors.nodeActive;
            if (highlights.found === i) bgColor = this.colors.success;

            // Data part
            this.drawRoundRect(x, startY, nodeW * 0.7, nodeH, 6, bgColor, this.colors.nodeBorder);
            this.drawBoldText(String(list[i]), x + nodeW * 0.35, startY + nodeH / 2, '#FFF', 14);
            // Pointer part
            this.drawRoundRect(x + nodeW * 0.7, startY, nodeW * 0.3, nodeH, 6, this.colors.bg, this.colors.nodeBorder);
            this.drawText(i < n - 1 ? '→' : '∅', x + nodeW * 0.85, startY + nodeH / 2, this.colors.warning, 14);

            // Arrow to next node
            if (i < n - 1) {
                const ax1 = x + nodeW + 5;
                const ax2 = x + nodeW + gap - 5;
                this.drawArrow(ax1, startY + nodeH / 2, ax2, startY + nodeH / 2, this.colors.edge);
            }
        }
    }

    // ========== STACK VISUALIZATION ==========
    drawStack(stack, highlights = {}) {
        this.clear();
        this.resize();
        const n = stack.length;
        if (n === 0) {
            this.drawText('Stack is empty.', this.w / 2, this.h / 2, this.colors.text, 16);
            this.drawText('Use Push to add elements.', this.w / 2, this.h / 2 + 25, this.colors.text, 13);
            return;
        }
        const cellW = Math.min(180, this.w * 0.4);
        const cellH = 45;
        const gap = 4;
        const startX = this.w / 2 - cellW / 2;
        const startY = this.h - 40;
        const maxVisible = Math.min(n, Math.floor((this.h - 80) / (cellH + gap)));

        this.drawText('TOP', startX - 40, startY - (n - 1) * (cellH + gap) + cellH / 2, this.colors.accent, 12, 'right');

        for (let i = 0; i < maxVisible; i++) {
            const idx = n - 1 - i;
            const y = startY - i * (cellH + gap);
            let bgColor = this.colors.node;
            if (i === 0) bgColor = this.colors.nodeActive; // Top element
            if (highlights.active === idx) bgColor = this.colors.warning;

            this.drawRoundRect(startX, y - cellH, cellW, cellH, 8, bgColor, this.colors.nodeBorder);
            this.drawBoldText(String(stack[idx]), startX + cellW / 2, y - cellH / 2, '#FFF', 16);
        }
    }

    // ========== QUEUE VISUALIZATION ==========
    drawQueue(queue, highlights = {}) {
        this.clear();
        this.resize();
        const n = queue.length;
        if (n === 0) {
            this.drawText('Queue is empty.', this.w / 2, this.h / 2, this.colors.text, 16);
            this.drawText('Use Enqueue to add elements.', this.w / 2, this.h / 2 + 25, this.colors.text, 13);
            return;
        }
        const cellW = Math.min(70, (this.w - 100) / n);
        const cellH = 50;
        const gap = 4;
        const totalW = n * cellW + (n - 1) * gap;
        const startX = (this.w - totalW) / 2;
        const startY = this.h / 2 - cellH / 2;

        this.drawText('FRONT', startX + cellW / 2, startY - 25, this.colors.accent, 11);
        this.drawText('REAR', startX + (n - 1) * (cellW + gap) + cellW / 2, startY - 25, this.colors.secondary, 11);

        for (let i = 0; i < n; i++) {
            const x = startX + i * (cellW + gap);
            let bgColor = this.colors.node;
            if (i === 0) bgColor = this.colors.accent; // Front
            if (i === n - 1) bgColor = this.colors.secondary; // Rear
            if (highlights.active === i) bgColor = this.colors.warning;

            this.drawRoundRect(x, startY, cellW, cellH, 8, bgColor, this.colors.nodeBorder);
            this.drawBoldText(String(queue[i]), x + cellW / 2, startY + cellH / 2, '#FFF', 14);
        }

        // Direction arrow
        this.drawText('→ Dequeue', startX - 5, startY + cellH + 20, this.colors.accent, 11, 'right');
        this.drawText('Enqueue →', startX + totalW + 5, startY + cellH + 20, this.colors.secondary, 11, 'left');
    }

    // ========== BINARY TREE / BST VISUALIZATION ==========
    drawTree(root, highlights = {}, type = 'tree') {
        this.clear();
        this.resize();
        if (!root) {
            this.drawText(type === 'bst' ? 'BST is empty. Insert values.' : 'Tree is empty.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }
        const nodeR = 22;
        const levelH = 70;
        const startY = 50;

        const drawNode = (node, x, y, spread) => {
            if (!node) return;
            
            const leftX = x - spread;
            const rightX = x + spread;
            const childY = y + levelH;

            // Draw edges
            if (node.left) {
                const edgeColor = highlights.edge && highlights.edge.includes(`${node.val}-${node.left.val}`) ? this.colors.edgeActive : this.colors.edge;
                this.drawLine(x, y + nodeR, leftX, childY - nodeR, edgeColor, 2.5);
                drawNode(node.left, leftX, childY, spread / 2);
            }
            if (node.right) {
                const edgeColor = highlights.edge && highlights.edge.includes(`${node.val}-${node.right.val}`) ? this.colors.edgeActive : this.colors.edge;
                this.drawLine(x, y + nodeR, rightX, childY - nodeR, edgeColor, 2.5);
                drawNode(node.right, rightX, childY, spread / 2);
            }

            // Draw node
            let fillColor = this.colors.node;
            if (highlights.active === node.val) fillColor = this.colors.nodeActive;
            if (highlights.visited && highlights.visited.includes(node.val)) fillColor = this.colors.nodeVisited;
            if (highlights.highlight === node.val) fillColor = this.colors.nodeHighlight;

            // Glow effect for active
            if (highlights.active === node.val) {
                this.ctx.shadowColor = this.colors.nodeActive;
                this.ctx.shadowBlur = 15;
            }
            this.drawCircle(x, y, nodeR, fillColor, this.colors.nodeBorder);
            this.ctx.shadowBlur = 0;
            this.drawBoldText(String(node.val), x, y, '#FFF', 14);
        };

        const treeDepth = this._getTreeDepth(root);
        const spread = Math.min(this.w / 4, Math.pow(2, treeDepth - 1) * 40);
        drawNode(root, this.w / 2, startY, spread);
    }

    _getTreeDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(this._getTreeDepth(node.left), this._getTreeDepth(node.right));
    }

    // ========== HEAP VISUALIZATION ==========
    drawHeap(arr, highlights = {}) {
        this.clear();
        this.resize();
        const n = arr.length;
        if (n === 0) {
            this.drawText('Heap is empty.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }

        const nodeR = 22;
        const levelH = 65;
        const startY = 50;

        const drawHeapNode = (i, x, y, spread) => {
            if (i >= n) return;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            const childY = y + levelH;

            if (left < n) {
                const lx = x - spread;
                this.drawLine(x, y + nodeR, lx, childY - nodeR, this.colors.edge, 2.5);
                drawHeapNode(left, lx, childY, spread / 2);
            }
            if (right < n) {
                const rx = x + spread;
                this.drawLine(x, y + nodeR, rx, childY - nodeR, this.colors.edge, 2.5);
                drawHeapNode(right, rx, childY, spread / 2);
            }

            let fillColor = this.colors.node;
            if (highlights.active === i) fillColor = this.colors.nodeActive;
            if (highlights.highlight === i) fillColor = this.colors.nodeHighlight;

            this.drawCircle(x, y, nodeR, fillColor, this.colors.nodeBorder);
            this.drawBoldText(String(arr[i]), x, y, '#FFF', 14);
            this.drawText(`[${i}]`, x, y + nodeR + 12, this.colors.text, 10);
        };

        const depth = Math.floor(Math.log2(n)) + 1;
        const spread = Math.min(this.w / 4, Math.pow(2, depth - 2) * 50);
        drawHeapNode(0, this.w / 2, startY, spread);
    }

    // ========== GRAPH VISUALIZATION ==========
    drawGraph(nodes, edges, highlights = {}) {
        this.clear();
        this.resize();
        if (nodes.length === 0) {
            this.drawText('Graph is empty. Add nodes and edges.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }

        const nodeR = 24;

        // Draw edges
        for (const edge of edges) {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) continue;
            
            const edgeKey = `${edge.from}-${edge.to}`;
            let color = this.colors.edge;
            let width = 2;
            if (highlights.edges && highlights.edges.includes(edgeKey)) {
                color = this.colors.edgeActive;
                width = 3;
            }

            this.drawLine(from.x, from.y, to.x, to.y, color, width);

            // Draw weight
            if (edge.weight !== undefined) {
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                this.drawRoundRect(mx - 14, my - 10, 28, 20, 4, this.colors.bg, this.colors.edge);
                this.drawText(String(edge.weight), mx, my, this.colors.warning, 11);
            }
        }

        // Draw nodes
        for (const node of nodes) {
            let fillColor = this.colors.node;
            if (highlights.active === node.id) fillColor = this.colors.nodeActive;
            if (highlights.visited && highlights.visited.includes(node.id)) fillColor = this.colors.nodeVisited;
            if (highlights.current === node.id) fillColor = this.colors.nodeHighlight;

            if (highlights.current === node.id || highlights.active === node.id) {
                this.ctx.shadowColor = fillColor;
                this.ctx.shadowBlur = 15;
            }
            this.drawCircle(node.x, node.y, nodeR, fillColor, this.colors.nodeBorder);
            this.ctx.shadowBlur = 0;
            this.drawBoldText(String(node.label || node.id), node.x, node.y, '#FFF', 14);

            // Distance label for Dijkstra
            if (highlights.distances && highlights.distances[node.id] !== undefined) {
                this.drawText(`d=${highlights.distances[node.id] === Infinity ? '∞' : highlights.distances[node.id]}`, node.x, node.y + nodeR + 16, this.colors.warning, 11);
            }
        }
    }

    // ========== HASH TABLE VISUALIZATION ==========
    drawHashTable(table, highlights = {}) {
        this.clear();
        this.resize();
        const size = table.length;
        if (size === 0) {
            this.drawText('Hash Table is empty.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }

        const cellW = 60;
        const cellH = 36;
        const gap = 3;
        const startX = 80;
        const startY = 20;
        const maxVisible = Math.min(size, Math.floor((this.h - 40) / (cellH + gap)));

        for (let i = 0; i < maxVisible; i++) {
            const y = startY + i * (cellH + gap);
            let bgColor = this.colors.bg;
            if (highlights.active === i) bgColor = this.colors.nodeActive;
            if (table[i] && table[i].length > 0) bgColor = 'rgba(108, 92, 231, 0.2)';

            // Index cell
            this.drawRoundRect(startX - 60, y, 50, cellH, 6, this.colors.bg, this.colors.edge);
            this.drawText(`[${i}]`, startX - 35, y + cellH / 2, this.colors.text, 12);

            // Data cells (chaining)
            if (table[i]) {
                for (let j = 0; j < table[i].length; j++) {
                    const x = startX + j * (cellW + gap + 10);
                    let nodeBg = this.colors.node;
                    if (highlights.found && highlights.found.bucket === i && highlights.found.index === j) {
                        nodeBg = this.colors.success;
                    }
                    this.drawRoundRect(x, y, cellW + 10, cellH, 6, nodeBg, this.colors.nodeBorder);
                    this.drawText(`${table[i][j].key}: ${table[i][j].value}`, x + (cellW + 10) / 2, y + cellH / 2, '#FFF', 11);
                    if (j < table[i].length - 1) {
                        this.drawText('→', x + cellW + 15, y + cellH / 2, this.colors.warning, 14);
                    }
                }
            }
        }
    }

    // ========== RECURSION TREE ==========
    drawRecursionTree(tree, highlights = {}) {
        this.clear();
        this.resize();
        if (!tree || tree.length === 0) {
            this.drawText('Enter a problem size to visualize recursion tree.', this.w / 2, this.h / 2, this.colors.text, 16);
            return;
        }

        const nodeR = 20;
        const levelH = 60;

        const drawNode = (node, x, y, spread) => {
            if (!node) return;
            const childY = y + levelH;
            const childSpread = spread / 2;

            if (node.children) {
                const n = node.children.length;
                for (let i = 0; i < n; i++) {
                    const childX = x + (i - (n - 1) / 2) * spread;
                    this.drawLine(x, y + nodeR, childX, childY - nodeR, this.colors.edge, 1.5);
                    drawNode(node.children[i], childX, childY, childSpread);
                }
            }

            let fillColor = this.colors.node;
            if (highlights.active && highlights.active.includes(node.label)) fillColor = this.colors.nodeActive;

            this.drawCircle(x, y, nodeR, fillColor, this.colors.nodeBorder);
            this.drawBoldText(String(node.label), x, y, '#FFF', Math.min(12, nodeR));
        };

        const maxDepth = tree.maxDepth || 4;
        const spread = Math.min(this.w / 3, Math.pow(2, maxDepth - 1) * 50);
        drawNode(tree.root, this.w / 2, 45, spread);
    }
}

// BST Helper
class BSTNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(val) {
        const node = new BSTNode(val);
        if (!this.root) {
            this.root = node;
            return;
        }
        let current = this.root;
        while (true) {
            if (val < current.val) {
                if (!current.left) { current.left = node; return; }
                current = current.left;
            } else if (val > current.val) {
                if (!current.right) { current.right = node; return; }
                current = current.right;
            } else {
                return; // Duplicate
            }
        }
    }

    search(val) {
        let current = this.root;
        const path = [];
        while (current) {
            path.push(current.val);
            if (val === current.val) return { found: true, path };
            if (val < current.val) current = current.left;
            else current = current.right;
        }
        return { found: false, path };
    }

    inorder() {
        const result = [];
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);
            result.push(node.val);
            traverse(node.right);
        };
        traverse(this.root);
        return result;
    }
}

// Graph Helper
class GraphBuilder {
    static createDefaultGraph() {
        const nodes = [
            { id: 0, label: 'A', x: 200, y: 80 },
            { id: 1, label: 'B', x: 100, y: 180 },
            { id: 2, label: 'C', x: 300, y: 180 },
            { id: 3, label: 'D', x: 50, y: 290 },
            { id: 4, label: 'E', x: 180, y: 290 },
            { id: 5, label: 'F', x: 330, y: 290 },
            { id: 6, label: 'G', x: 250, y: 390 }
        ];
        const edges = [
            { from: 0, to: 1, weight: 4 },
            { from: 0, to: 2, weight: 3 },
            { from: 1, to: 3, weight: 2 },
            { from: 1, to: 4, weight: 5 },
            { from: 2, to: 5, weight: 1 },
            { from: 2, to: 4, weight: 6 },
            { from: 3, to: 6, weight: 7 },
            { from: 4, to: 6, weight: 3 },
            { from: 5, to: 6, weight: 4 }
        ];
        return { nodes, edges };
    }

    static getAdjList(nodes, edges) {
        const adj = {};
        for (const n of nodes) adj[n.id] = [];
        for (const e of edges) {
            adj[e.from].push({ to: e.to, weight: e.weight || 1 });
            adj[e.to].push({ to: e.from, weight: e.weight || 1 });
        }
        return adj;
    }
}

window.DataStructureVisualizer = DataStructureVisualizer;
window.BST = BST;
window.BSTNode = BSTNode;
window.GraphBuilder = GraphBuilder;
