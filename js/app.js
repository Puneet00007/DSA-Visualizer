/* ============================================
   AlgoVis — App Controller (Dark Edition)
   Everything wired up and working
   ============================================ */

class AlgoVisApp {
    constructor() {
        this.view = 'home';
        this.category = null;
        this.currentAlgo = null;
        this.currentType = null; // 'sorting' | 'ds' | 'algo'
        this.currentLang = 'javascript';

        // Sorting state
        this.array = [];
        this.arraySize = 50;
        this.speed = 50;
        this.isSorting = false;
        this.isPaused = false;
        this.sortingAlgo = new SortingAlgorithms();
        this.sortSteps = [];
        this.sortStepIndex = 0;
        this.sortedSoFar = new Set();
        this.startTime = 0;
        this.playTimer = null;

        // Canvas
        this.canvas = null;
        this.ctx = null;
        this.cw = 0;
        this.ch = 0;

        // DS State
        this.dsArray = [10, 25, 5, 30, 15, 40, 20];
        this.linkedList = [10, 25, 5, 30, 15];
        this.stack = [10, 25, 5, 30];
        this.queue = [10, 25, 5, 30];
        this.bst = new BST();
        this.heapArray = [50, 30, 40, 10, 20, 35, 25];
        this.graphData = GraphBuilder.createDefaultGraph();
        this.hashTable = [];
        this._initHash();
        [50, 30, 70, 20, 40, 60, 80].forEach(v => this.bst.insert(v));

        // Race
        this._raceBase = [];

        // Sound
        this.sound = new SoundEngine();

        // Pathfinding
        this.pfEngine = new PathfindingEngine();
        this.pfCanvas = null;
        this.pfCtx = null;
        this.pfDrawing = false;
        this.pfDrawMode = 1; // 1=wall, 0=erase
        this.pfRunning = false;

        // DP
        this.dpEngine = new DPEngine();
        this.dpCanvas = null;
        this.dpCtx = null;
        this.dpRunning = false;

        // Backtracking
        this.btEngine = new BacktrackEngine();
        this.btCanvas = null;
        this.btCtx = null;
        this.btRunning = false;

        this.init();
    }

    _initHash() {
        this.hashTable = new Array(7).fill(null).map(() => []);
        [
            { key: 'apple', value: 5 }, { key: 'banana', value: 3 },
            { key: 'cherry', value: 8 }, { key: 'date', value: 2 },
            { key: 'elder', value: 7 }
        ].forEach(e => this.hashTable[this._hash(e.key, 7)].push(e));
    }

    _hash(key, size) {
        let h = 0;
        for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % size;
        return h;
    }

    // ============ CATALOG ============
    getCatalog() {
        return {
            sorting: [
                { id: 'bubble', name: 'Bubble Sort', badge: 'O(n²)', bc: 'badge-on2', tag: 'Comparison', stable: true, desc: 'Swaps adjacent out-of-order pairs, bubbling the largest to the end each pass.' },
                { id: 'selection', name: 'Selection Sort', badge: 'O(n²)', bc: 'badge-on2', tag: 'Comparison', stable: false, desc: 'Finds the minimum of the unsorted region and places it at the front.' },
                { id: 'insertion', name: 'Insertion Sort', badge: 'O(n²)', bc: 'badge-on2', tag: 'Comparison', stable: true, desc: 'Builds sorted output one element at a time by inserting into place.' },
                { id: 'merge', name: 'Merge Sort', badge: 'O(n log n)', bc: 'badge-onlogn', tag: 'Divide & Conquer', stable: true, desc: 'Splits recursively, then merges sorted halves back together.' },
                { id: 'quick', name: 'Quick Sort', badge: 'O(n log n)', bc: 'badge-onlogn', tag: 'Divide & Conquer', stable: false, desc: 'Partitions around a pivot, then recurses on each side.' },
                { id: 'heap', name: 'Heap Sort', badge: 'O(n log n)', bc: 'badge-onlogn', tag: 'Comparison', stable: false, desc: 'Builds a max heap, then repeatedly extracts the maximum.' },
                { id: 'shell', name: 'Shell Sort', badge: 'O(n^1.3)', bc: 'badge-other', tag: 'Comparison', stable: false, desc: 'Insertion sort with decreasing gaps for faster convergence.' },
                { id: 'cocktail', name: 'Cocktail Shaker', badge: 'O(n²)', bc: 'badge-on2', tag: 'Comparison', stable: true, desc: 'Bidirectional bubble sort — sweeps forward then backward.' },
                { id: 'comb', name: 'Comb Sort', badge: 'O(n²)', bc: 'badge-on2', tag: 'Comparison', stable: false, desc: 'Improves bubble sort with a shrinking gap to eliminate turtles.' },
                { id: 'radix', name: 'Radix Sort', badge: 'O(nk)', bc: 'badge-on', tag: 'Non-Comparison', stable: true, desc: 'Sorts digit by digit, least significant to most significant.' },
                { id: 'counting', name: 'Counting Sort', badge: 'O(n+k)', bc: 'badge-on', tag: 'Non-Comparison', stable: true, desc: 'Counts occurrences and uses prefix sums to place elements.' },
                { id: 'tim', name: 'Tim Sort', badge: 'O(n log n)', bc: 'badge-onlogn', tag: 'Hybrid', stable: true, desc: 'Combines insertion sort + merge sort. Used in Python and Java.' },
            ],
            datastructures: [
                { id: 'array', name: 'Array', badge: 'O(1)', bc: 'badge-on', tag: 'Linear', stable: true, desc: 'Contiguous memory with constant-time random access by index.' },
                { id: 'linkedlist', name: 'Linked List', badge: 'O(n)', bc: 'badge-other', tag: 'Linear', stable: true, desc: 'Nodes linked by pointers. Fast insert/delete at known positions.' },
                { id: 'stack', name: 'Stack', badge: 'O(1)', bc: 'badge-on', tag: 'LIFO', stable: true, desc: 'Last in, first out. Push and pop from the top.' },
                { id: 'queue', name: 'Queue', badge: 'O(1)', bc: 'badge-on', tag: 'FIFO', stable: true, desc: 'First in, first out. Enqueue at rear, dequeue from front.' },
                { id: 'bst', name: 'Binary Search Tree', badge: 'O(log n)', bc: 'badge-onlogn', tag: 'Tree', stable: true, desc: 'Ordered binary tree. Left < parent < right.' },
                { id: 'heap', name: 'Heap', badge: 'O(log n)', bc: 'badge-onlogn', tag: 'Tree', stable: true, desc: 'Complete binary tree with heap property for fast min/max.' },
                { id: 'graph', name: 'Graph', badge: 'V+E', bc: 'badge-other', tag: 'Non-Linear', stable: true, desc: 'Nodes connected by edges. Models relationships and networks.' },
                { id: 'hashtable', name: 'Hash Table', badge: 'O(1)', bc: 'badge-on', tag: 'Hashing', stable: true, desc: 'Key-value storage with O(1) average lookup via hash function.' },
            ],
            algorithms: [
                { id: 'bfs', name: 'BFS', badge: 'O(V+E)', bc: 'badge-other', tag: 'Traversal', stable: true, desc: 'Explores level by level using a queue. Finds shortest path in unweighted graphs.' },
                { id: 'dfs', name: 'DFS', badge: 'O(V+E)', bc: 'badge-other', tag: 'Traversal', stable: true, desc: 'Explores as deep as possible before backtracking. Uses a stack.' },
                { id: 'binarysearch', name: 'Binary Search', badge: 'O(log n)', bc: 'badge-onlogn', tag: 'Search', stable: true, desc: 'Halves the search space each step on sorted data.' },
                { id: 'dijkstra', name: "Dijkstra's", badge: 'O((V+E)logV)', bc: 'badge-other', tag: 'Shortest Path', stable: true, desc: 'Finds shortest paths from a source in weighted graphs.' },
                { id: 'recursion', name: 'Recursion Tree', badge: 'Varies', bc: 'badge-other', tag: 'Concept', stable: true, desc: 'Visualize how recursive calls decompose into subproblems.' },
            ]
        };
    }

    _findItem(id) {
        for (const [cat, items] of Object.entries(this.getCatalog())) {
            const item = items.find(i => i.id === id);
            if (item) return { item, cat };
        }
        return null;
    }

    // ============ INIT ============
    init() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.generateArray();

        this._bind();
        this._show('home');
    }

    _bind() {
        // Home cards — handled below after pathfinding/patterns bindings

        // Brand → home
        document.getElementById('navBrand').addEventListener('click', (e) => {
            e.preventDefault();
            this._cancelSort();
            this._show('home');
        });

        // Back
        document.getElementById('backBtn').addEventListener('click', () => {
            this._cancelSort();
            if (this.pfRunning) { this.pfEngine.cancel(); this.pfRunning = false; }
            if (this.dpRunning) { this.dpEngine.cancel(); this.dpRunning = false; }
            if (this.btRunning) { this.btEngine.cancel(); this.btRunning = false; }
            if (this.view === 'viz') this._show('grid');
            else if (this.view === 'patternDetail') this._show('patterns');
            else this._show('home');
        });

        // Sorting controls
        document.getElementById('btnStart').addEventListener('click', () => this._startSort());
        document.getElementById('btnPause').addEventListener('click', () => this._pauseSort());
        document.getElementById('btnStep').addEventListener('click', () => this._stepSort());
        document.getElementById('btnReset').addEventListener('click', () => this._resetSort());
        document.getElementById('btnShuffle').addEventListener('click', () => this._shuffle());

        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.speed = 101 - parseInt(e.target.value);
        });
        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value);
            document.getElementById('sizeLabel').textContent = this.arraySize;
            if (!this.isSorting) {
                this.generateArray();
                this._drawBars();
            }
        });

        // Side panel tabs
        document.querySelectorAll('.side-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.side-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.side-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const paneId = 'pane' + tab.dataset.pane.charAt(0).toUpperCase() + tab.dataset.pane.slice(1);
                document.getElementById(paneId).classList.add('active');
            });
        });

        // Code language
        document.querySelectorAll('.lang-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lang-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLang = btn.dataset.lang;
                this._updateCode();
            });
        });

        // Race
        document.getElementById('btnRaceStart').addEventListener('click', () => this._startRace());
        document.getElementById('btnRaceReset').addEventListener('click', () => this._setupRace());
        document.getElementById('raceSizeSlider').addEventListener('input', (e) => {
            document.getElementById('raceSizeLabel').textContent = e.target.value;
            this._setupRace();
        });

        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => {
            const on = this.sound.toggle();
            document.getElementById('soundIcon').textContent = on ? '🔊' : '🔇';
            document.getElementById('soundLabel').textContent = on ? 'sound on' : 'sound off';
            document.getElementById('soundToggle').classList.toggle('active', on);
            this._toast(on ? 'sound enabled' : 'sound muted');
        });

        // Export
        document.getElementById('btnExport').addEventListener('click', () => this._export());

        // Home cards — new categories
        document.querySelectorAll('.home-card').forEach(card => {
            card.addEventListener('click', () => {
                const cat = card.dataset.cat;
                if (cat === 'race') {
                    this._show('race');
                    this._setupRace();
                } else if (cat === 'pathfinding') {
                    this._show('pathfinding');
                    this._initPathfinding();
                } else if (cat === 'patterns') {
                    this._show('patterns');
                    this._renderPatterns();
                } else if (cat === 'dp') {
                    this._show('dp');
                    this._initDP();
                } else if (cat === 'backtrack') {
                    this._show('backtrack');
                    this._initBacktrack();
                } else {
                    this.category = cat;
                    this._show('grid');
                }
            });
        });

        // Pathfinding controls
        document.getElementById('btnPfRun').addEventListener('click', () => this._runPathfinding());
        document.getElementById('btnPfClear').addEventListener('click', () => { this.pfEngine.init(); this.pfEngine.start = {r:10,c:5}; this.pfEngine.end = {r:10,c:35}; this._drawPfGrid(); });
        document.getElementById('btnPfMaze').addEventListener('click', () => { this.pfEngine.generateMaze(); this._drawPfGrid(); });
        document.getElementById('btnPfRandom').addEventListener('click', () => { this.pfEngine.randomizeWalls(0.3); this._drawPfGrid(); });
        document.getElementById('btnPfReset').addEventListener('click', () => { this.pfEngine.init(); this.pfEngine.start = {r:10,c:5}; this.pfEngine.end = {r:10,c:35}; this._drawPfGrid(); this._updatePfStats(0, '—', 'ready'); });
        document.getElementById('pfSpeed').addEventListener('input', (e) => {
            this.pfEngine.speed = Math.max(1, 101 - parseInt(e.target.value));
        });

        window.addEventListener('resize', () => {
            if (this.view === 'viz') {
                this._resizeCanvas();
                if (this.currentType === 'sorting') this._drawBars();
                else if (this.currentType === 'ds') this._renderDS();
                else if (this.currentType === 'algo') this._renderAlgo();
            }
        });
    }

    // ============ VIEW ROUTING ============
    _show(view) {
        this.view = view;
        ['homeView', 'gridView', 'vizView', 'raceView', 'pathfindingView', 'patternsView', 'patternDetailView', 'dpView', 'backtrackView'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const backBtn = document.getElementById('backBtn');

        if (view === 'home') {
            document.getElementById('homeView').classList.remove('hidden');
            backBtn.style.display = 'none';
            this._setCrumbs([]);
        } else if (view === 'grid') {
            document.getElementById('gridView').classList.remove('hidden');
            backBtn.style.display = '';
            this._renderGrid();
            const titles = { sorting: 'Sorting', datastructures: 'Data Structures', algorithms: 'Algorithms' };
            this._setCrumbs(['home', titles[this.category]]);
        } else if (view === 'viz') {
            document.getElementById('vizView').classList.remove('hidden');
            backBtn.style.display = '';
            const info = this._findItem(this.currentAlgo);
            if (info) {
                const titles = { sorting: 'Sorting', datastructures: 'DS', algorithms: 'Algo' };
                this._setCrumbs(['home', titles[info.cat], info.item.name]);
            }
        } else if (view === 'race') {
            document.getElementById('raceView').classList.remove('hidden');
            backBtn.style.display = '';
            this._setCrumbs(['home', 'Race']);
        } else if (view === 'pathfinding') {
            document.getElementById('pathfindingView').classList.remove('hidden');
            backBtn.style.display = '';
            this._setCrumbs(['home', 'Pathfinding']);
        } else if (view === 'patterns') {
            document.getElementById('patternsView').classList.remove('hidden');
            backBtn.style.display = '';
            this._setCrumbs(['home', 'Patterns']);
        } else if (view === 'patternDetail') {
            document.getElementById('patternDetailView').classList.remove('hidden');
            backBtn.style.display = '';
            this._setCrumbs(['home', 'Patterns', this._currentPattern?.name || '']);
        } else if (view === 'dp') {
            document.getElementById('dpView').classList.remove('hidden');
            backBtn.style.display = '';
            this._setCrumbs(['home', 'Dynamic Programming']);
        } else if (view === 'backtrack') {
            document.getElementById('backtrackView').classList.remove('hidden');
            backBtn.style.display = '';
            this._setCrumbs(['home', 'Backtracking']);
        }

        window.scrollTo(0, 0);
    }

    _setCrumbs(parts) {
        const c = document.getElementById('navCenter');
        if (parts.length === 0) {
            c.innerHTML = '';
            return;
        }
        c.innerHTML = parts.map((p, i) => {
            const isLast = i === parts.length - 1;
            return `${i > 0 ? '<span class="nav-crumb-sep">/</span>' : ''}<span class="nav-crumb${isLast ? ' current' : ''}">${p}</span>`;
        }).join('');
    }

    // ============ GRID ============
    _renderGrid() {
        const catalog = this.getCatalog();
        const items = catalog[this.category] || [];
        const titles = { sorting: 'Sorting Algorithms', datastructures: 'Data Structures', algorithms: 'Graph & Search Algorithms' };
        const kicks = { sorting: '/ sorting', datastructures: '/ data structures', algorithms: '/ algorithms' };
        const descs = {
            sorting: 'Click any card to watch it sort step by step.',
            datastructures: 'Click to interact with the data structure.',
            algorithms: 'Click to see the traversal animate.'
        };

        document.getElementById('gridKicker').textContent = kicks[this.category] || '';
        document.getElementById('gridH2').textContent = titles[this.category] || '';
        document.getElementById('gridP').textContent = descs[this.category] || '';
        document.getElementById('gridCount').textContent = items.length;

        const grid = document.getElementById('algoGrid');
        grid.innerHTML = items.map(item => `
            <div class="algo-card" data-id="${item.id}">
                <div class="algo-card-top">
                    <span class="algo-card-name">${item.name}</span>
                    <span class="algo-badge ${item.bc}">${item.badge}</span>
                </div>
                <div class="algo-card-desc">${item.desc}</div>
                <div class="algo-card-foot">
                    <span class="tag">${item.tag}</span>
                    <span class="stable ${item.stable ? 'stable-yes' : 'stable-no'}">${item.stable ? '● stable' : '○ unstable'}</span>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.algo-card').forEach(card => {
            card.addEventListener('click', () => this._open(card.dataset.id));
        });
    }

    // ============ OPEN VISUALIZATION ============
    _open(id) {
        const found = this._findItem(id);
        if (!found) return;
        this.currentAlgo = id;
        this.currentType = found.cat === 'datastructures' ? 'ds' : found.cat === 'algorithms' ? 'algo' : 'sorting';
        this._cancelSort();

        const { item } = found;
        const typeLabel = { sorting: '/ sorting /', ds: '/ data structure /', algo: '/ algorithm /' }[this.currentType];

        document.getElementById('vizKicker').textContent = typeLabel;
        document.getElementById('vizH2').textContent = item.name;
        document.getElementById('vizPill').textContent = item.badge;
        document.getElementById('vizTag').textContent = item.tag;
        document.getElementById('canvasTitle').textContent = `canvas · ${item.name.toLowerCase()}`;
        this._setStatus('idle');

        // Show/hide sorting controls
        const sortOnly = ['btnStart', 'btnPause', 'btnStep', 'btnReset', 'btnShuffle'];
        const sizeField = document.getElementById('sizeSlider').closest('.slider-field');
        const statsRow = document.getElementById('statComparisons').closest('.stats-row');
        const dsControls = document.getElementById('dsControls');

        if (this.currentType === 'sorting') {
            sortOnly.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
            sizeField.style.display = '';
            statsRow.style.display = '';
            dsControls.classList.add('hidden');
            document.querySelectorAll('.controls-divider').forEach(d => d.style.display = '');
        } else {
            sortOnly.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
            sizeField.style.display = 'none';
            statsRow.style.display = 'none';
            dsControls.classList.remove('hidden');
            this._buildDsControls();
            document.querySelectorAll('.controls-divider').forEach(d => d.style.display = 'none');
        }

        // Update side panel
        this._updateCode();
        this._updatePseudocode();
        this._updateComplexity();
        this._updateAbout();
        this._updateLeetCode();

        this._show('viz');

        // Render canvas
        setTimeout(() => {
            this._resizeCanvas();
            if (this.currentType === 'sorting') {
                this.generateArray();
                this._drawBars();
            } else if (this.currentType === 'ds') {
                this._renderDS();
            } else if (this.currentType === 'algo') {
                this._renderAlgo();
            }
        }, 60);
    }

    _setStatus(status) {
        const el = document.getElementById('canvasStatus');
        el.className = 'canvas-toolbar-status' + (status === 'running' ? ' running' : '');
        el.innerHTML = `<span class="status-dot"></span> ${status}`;
    }

    _resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.cw = rect.width;
        this.ch = rect.height;
    }

    // ============ SORTING ============
    generateArray() {
        this.array = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * 300) + 10);
        }
    }

    _drawBars(state = {}) {
        const ctx = this.ctx;
        const w = this.cw, h = this.ch;
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);

        const n = this.array.length;
        if (!n) return;

        const pad = 20;
        const availW = w - pad * 2;
        const gap = n > 80 ? 1 : 2;
        const barW = Math.max(1, (availW - (n - 1) * gap) / n);
        const maxVal = Math.max(...this.array);

        const sortedSet = new Set(state.sorted || []);
        const compareSet = new Set(state.comparing || []);
        const swapSet = new Set(state.swapping || []);
        const pivotSet = new Set(state.pivot || []);
        const activeSet = new Set(state.active || []);

        for (let i = 0; i < n; i++) {
            const x = pad + i * (barW + gap);
            const barH = (this.array[i] / maxVal) * (h - pad * 2);
            const y = h - pad - barH;

            let color, glow = false;
            if (pivotSet.has(i)) { color = '#ef4444'; glow = true; }
            else if (swapSet.has(i)) { color = '#f59e0b'; glow = true; }
            else if (compareSet.has(i)) { color = '#a855f7'; glow = true; }
            else if (activeSet.has(i)) { color = '#60a5fa'; glow = true; }
            else if (sortedSet.has(i)) { color = '#10b981'; }
            else {
                // Subtle blue gradient default
                const t = i / n;
                const r = Math.round(30 + t * 29);
                const g = Math.round(80 + t * 50);
                const b = Math.round(200 + t * 46);
                color = `rgb(${r},${g},${b})`;
            }

            // Glow
            if (glow) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 12;
            }

            const radius = Math.min(barW / 2, 2);
            ctx.beginPath();
            ctx.moveTo(x, h - pad);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.lineTo(x + barW - radius, y);
            ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
            ctx.lineTo(x + barW, h - pad);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    async _startSort() {
        if (this.currentType !== 'sorting') return;
        if (this.isSorting && this.isPaused) {
            this.isPaused = false;
            document.getElementById('btnPause').textContent = 'pause';
            this._playSteps();
            return;
        }
        if (this.isSorting) return;

        this.isSorting = true;
        this.isPaused = false;
        this.sortedSoFar = new Set();
        document.getElementById('btnStart').disabled = true;
        document.getElementById('btnPause').disabled = false;
        document.getElementById('sizeSlider').disabled = true;
        this.startTime = performance.now();
        this._setStatus('running');

        this.sortingAlgo.cancelled = false;
        this.sortingAlgo.reset();
        const arrCopy = [...this.array];
        const fn = this._sortFn(this.currentAlgo, arrCopy);
        await fn();

        this.sortSteps = this.sortingAlgo.steps;
        this.sortStepIndex = 0;
        this.sortedSoFar = new Set();
        this._playSteps();
    }

    _sortFn(name, arr) {
        const s = this.sortingAlgo;
        return ({
            bubble: () => s.bubbleSort(arr), selection: () => s.selectionSort(arr),
            insertion: () => s.insertionSort(arr), merge: () => s.mergeSort(arr),
            quick: () => s.quickSort(arr), heap: () => s.heapSort(arr),
            radix: () => s.radixSort(arr), counting: () => s.countingSort(arr),
            shell: () => s.shellSort(arr), cocktail: () => s.cocktailSort(arr),
            comb: () => s.combSort(arr), tim: () => s.timSort(arr)
        }[name] || s.bubbleSort.bind(s))(arr);
    }

    _playSteps() {
        if (this.playTimer) clearTimeout(this.playTimer);
        const play = () => {
            if (this.isPaused) return;
            if (this.sortStepIndex >= this.sortSteps.length) {
                this._finishSort();
                return;
            }
            this._applyStep(this.sortSteps[this.sortStepIndex]);
            this.sortStepIndex++;
            const delay = Math.max(3, (101 - this.speed) * 2);
            this.playTimer = setTimeout(play, delay);
        };
        play();
    }

    _applyStep(step) {
        // Accumulate sorted
        if (step.type === 'sorted') {
            step.indices.forEach(i => this.sortedSoFar.add(i));
        }

        let state = { sorted: [...this.sortedSoFar], comparing: [], swapping: [], pivot: [], active: [] };
        switch (step.type) {
            case 'compare': state.comparing = step.indices; break;
            case 'swap':
                state.swapping = step.indices;
                if (step.indices.length === 2) {
                    const [a, b] = step.indices;
                    [this.array[a], this.array[b]] = [this.array[b], this.array[a]];
                }
                break;
            case 'sorted': step.indices.forEach(i => state.sorted.push(i)); break;
            case 'pivot': state.pivot = step.indices; break;
            case 'active': state.active = step.indices; break;
        }

        this._drawBars(state);

        // Play sound
        if (step.type === 'compare' && step.indices.length > 0) {
            this.sound.play(this.array[step.indices[0]], Math.max(...this.array), 'compare');
        } else if (step.type === 'swap' && step.indices.length > 0) {
            this.sound.play(this.array[step.indices[0]], Math.max(...this.array), 'swap');
        }

        // Highlight active code line
        this._highlightCodeLine(step);

        document.getElementById('statComparisons').textContent = (step.comparisons || 0).toLocaleString();
        document.getElementById('statSwaps').textContent = (step.swaps || 0).toLocaleString();
        document.getElementById('statAccesses').textContent = (step.accesses || 0).toLocaleString();
        document.getElementById('statTime').textContent = Math.round(performance.now() - this.startTime) + 'ms';
    }

    _highlightCodeLine(step) {
        // Simple line highlighting based on step type
        const codeEl = document.getElementById('codeContent');
        if (!codeEl) return;
        const lines = codeEl.textContent.split('\n');
        let activeIdx = -1;
        if (step.type === 'compare') activeIdx = this._findCodeLine(lines, ['if', 'arr[', '>', '<', '>=', '<=']);
        else if (step.type === 'swap') activeIdx = this._findCodeLine(lines, ['swap', '[arr[', 'temp', 'exchange']);
        else if (step.type === 'sorted') activeIdx = this._findCodeLine(lines, ['sorted', 'break', 'return']);

        if (activeIdx >= 0) {
            const wrapped = lines.map((line, i) =>
                `<span class="code-line${i === activeIdx ? ' active-line' : ''}">${this._escHtml(line)}</span>`
            ).join('\n');
            codeEl.innerHTML = wrapped;
            const active = codeEl.querySelector('.active-line');
            if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    _findCodeLine(lines, keywords) {
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i].toLowerCase().trim();
            if (keywords.some(k => l.includes(k.toLowerCase())) && l.length > 2) return i;
        }
        return -1;
    }

    _escHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    _finishSort() {
        this.isSorting = false;
        this.isPaused = false;
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('sizeSlider').disabled = false;
        document.getElementById('btnPause').textContent = 'pause';
        this._setStatus('done');

        const all = Array.from({ length: this.array.length }, (_, i) => i);
        this._drawBars({ sorted: all });
        this.sound.playSorted();
        this._toast('sort complete · ' + this.sortSteps.length + ' steps');
    }

    _pauseSort() {
        if (!this.isSorting) return;
        this.isPaused = !this.isPaused;
        document.getElementById('btnPause').textContent = this.isPaused ? 'resume' : 'pause';
        if (!this.isPaused) {
            this._setStatus('running');
            this._playSteps();
        } else {
            this._setStatus('paused');
        }
    }

    _stepSort() {
        if (this.sortSteps.length === 0) {
            // Generate steps first
            this.sortingAlgo.cancelled = false;
            this.sortingAlgo.reset();
            const arrCopy = [...this.array];
            this._sortFn(this.currentAlgo, arrCopy).then(() => {
                this.sortSteps = this.sortingAlgo.steps;
                this.sortStepIndex = 0;
                this.sortedSoFar = new Set();
                if (this.sortSteps.length > 0) {
                    this._applyStep(this.sortSteps[0]);
                    this.sortStepIndex = 1;
                    this._toast('step 1/' + this.sortSteps.length);
                }
            });
        } else if (this.sortStepIndex < this.sortSteps.length) {
            this._applyStep(this.sortSteps[this.sortStepIndex]);
            this.sortStepIndex++;
            if (this.sortStepIndex >= this.sortSteps.length) {
                this._finishSort();
            }
        }
    }

    _resetSort() {
        this._cancelSort();
        this.generateArray();
        this.sortedSoFar = new Set();
        this._resizeCanvas();
        this._drawBars();
        document.getElementById('statComparisons').textContent = '0';
        document.getElementById('statSwaps').textContent = '0';
        document.getElementById('statAccesses').textContent = '0';
        document.getElementById('statTime').textContent = '0ms';
        this._setStatus('idle');
    }

    _shuffle() {
        if (this.isSorting) return;
        this.generateArray();
        this.sortedSoFar = new Set();
        this.sortSteps = [];
        this.sortStepIndex = 0;
        this._drawBars();
        this._toast('shuffled');
    }

    _cancelSort() {
        this.isSorting = false;
        this.isPaused = false;
        if (this.sortingAlgo) this.sortingAlgo.cancelled = true;
        if (this.playTimer) clearTimeout(this.playTimer);
        this.sortSteps = [];
        this.sortStepIndex = 0;
        const start = document.getElementById('btnStart');
        const pause = document.getElementById('btnPause');
        const size = document.getElementById('sizeSlider');
        if (start) start.disabled = false;
        if (pause) { pause.disabled = true; pause.textContent = 'pause'; }
        if (size) size.disabled = false;
    }

    // ============ CODE / PSEUDO / COMPLEXITY / ABOUT ============
    _updateCode() {
        if (this.currentType !== 'sorting') {
            document.getElementById('codeContent').textContent = '// Code display available for sorting algorithms.\n// Interact with the visualization above.';
            return;
        }
        const code = this.sortingAlgo.getCode(this.currentAlgo, this.currentLang);
        document.getElementById('codeContent').textContent = code;
    }

    _updatePseudocode() {
        if (this.currentType !== 'sorting') {
            document.getElementById('pseudoContent').textContent = 'Pseudocode is available for sorting algorithms.';
            return;
        }
        document.getElementById('pseudoContent').textContent = this.sortingAlgo.getPseudocode(this.currentAlgo);
    }

    _updateComplexity() {
        const grid = document.getElementById('cxGrid');
        if (this.currentType !== 'sorting') {
            grid.innerHTML = '<div style="padding:24px;color:var(--ink-4);font-family:var(--m);font-size:12px;">Complexity data available for sorting algorithms.</div>';
            return;
        }
        const info = this.sortingAlgo.getAlgoInfo(this.currentAlgo);
        grid.innerHTML = `
            <div class="cx-row"><span class="cx-k">best case</span><span class="cx-v cx-best">${info.best}</span></div>
            <div class="cx-row"><span class="cx-k">average case</span><span class="cx-v cx-avg">${info.average}</span></div>
            <div class="cx-row"><span class="cx-k">worst case</span><span class="cx-v cx-worst">${info.worst}</span></div>
            <div class="cx-row"><span class="cx-k">space</span><span class="cx-v cx-space">${info.space}</span></div>
            <div class="cx-row"><span class="cx-k">stable</span><span class="cx-v ${info.stable ? 'cx-stable-y' : 'cx-stable-n'}">${info.stable ? 'yes' : 'no'}</span></div>
            <div class="cx-row"><span class="cx-k">in-place</span><span class="cx-v ${info.space === 'O(1)' ? 'cx-stable-y' : 'cx-stable-n'}">${info.space === 'O(1)' ? 'yes' : 'no'}</span></div>
        `;
    }

    _updateAbout() {
        const el = document.getElementById('aboutContent');
        const found = this._findItem(this.currentAlgo);
        if (!found) { el.innerHTML = '<p>Select any algorithm.</p>'; return; }
        const { item } = found;

        let html = `<h4>Description</h4><p>${item.desc}</p>`;
        if (this.currentType === 'sorting') {
            const info = this.sortingAlgo.getAlgoInfo(this.currentAlgo);
            html += `<h4>How It Works</h4><ul>${info.howItWorks.map(s => `<li>${s}</li>`).join('')}</ul>`;
            html += `<h4>Properties</h4><ul>
                <li>Stable: ${info.stable ? 'yes' : 'no'}</li>
                <li>In-place: ${info.space === 'O(1)' ? 'yes' : 'no'}</li>
                <li>Category: ${item.tag}</li>
            </ul>`;
        }
        el.innerHTML = html;
    }

    // ============ DATA STRUCTURES ============
    _buildDsControls() {
        const c = document.getElementById('dsControls');
        const a = this.currentAlgo;
        let html = '';

        if (a === 'array' || a === 'linkedlist') {
            html = `<input type="number" id="dsVal" placeholder="value" value="42">
                <button class="btn btn-fill" onclick="app.ds('push')">add</button>
                <button class="btn" onclick="app.ds('pop')">remove</button>
                <button class="btn" onclick="app.ds('search')">search</button>
                <input type="number" id="dsIdx" placeholder="idx" value="0" style="width:55px">
                <button class="btn" onclick="app.ds('insertAt')">insert at</button>`;
        } else if (a === 'stack') {
            html = `<input type="number" id="dsVal" placeholder="value" value="42">
                <button class="btn btn-fill" onclick="app.ds('push')">push</button>
                <button class="btn" onclick="app.ds('pop')">pop</button>
                <button class="btn" onclick="app.ds('peek')">peek</button>`;
        } else if (a === 'queue') {
            html = `<input type="number" id="dsVal" placeholder="value" value="42">
                <button class="btn btn-fill" onclick="app.ds('push')">enqueue</button>
                <button class="btn" onclick="app.ds('pop')">dequeue</button>
                <button class="btn" onclick="app.ds('peek')">front</button>`;
        } else if (a === 'bst') {
            html = `<input type="number" id="dsVal" placeholder="value" value="45">
                <button class="btn btn-fill" onclick="app.ds('insert')">insert</button>
                <button class="btn" onclick="app.ds('search')">search</button>
                <button class="btn" onclick="app.ds('inorder')">inorder</button>
                <button class="btn" onclick="app.ds('resetBst')">reset</button>`;
        } else if (a === 'heap') {
            html = `<input type="number" id="dsVal" placeholder="value" value="45">
                <button class="btn btn-fill" onclick="app.ds('insert')">insert</button>
                <button class="btn" onclick="app.ds('extract')">extract max</button>
                <button class="btn" onclick="app.ds('resetHeap')">reset</button>`;
        } else if (a === 'graph') {
            html = `<button class="btn btn-fill" onclick="app.ds('bfs')">run BFS</button>
                <button class="btn" onclick="app.ds('dfs')">run DFS</button>
                <button class="btn" onclick="app.ds('dijkstra')">dijkstra</button>
                <button class="btn" onclick="app.ds('resetGraph')">reset</button>`;
        } else if (a === 'hashtable') {
            html = `<input type="text" id="dsKey" placeholder="key" value="grape" style="width:70px">
                <input type="number" id="dsVal" placeholder="val" value="99">
                <button class="btn btn-fill" onclick="app.ds('insert')">insert</button>
                <button class="btn" onclick="app.ds('search')">search</button>
                <button class="btn" onclick="app.ds('delete')">delete</button>`;
        } else if (a === 'binarysearch') {
            const sorted = [...this.dsArray].sort((a, b) => a - b);
            this.dsArray = sorted;
            html = `<input type="number" id="dsVal" placeholder="target" value="25">
                <button class="btn btn-fill" onclick="app.ds('binSearch')">search</button>
                <button class="btn" onclick="app.ds('resetBS')">new array</button>`;
        } else if (a === 'recursion') {
            html = `<select id="dsType" style="width:auto">
                <option value="factorial">factorial</option>
                <option value="fibonacci">fibonacci</option>
                <option value="merge">merge sort</option>
            </select>
                <input type="number" id="dsVal" placeholder="n" value="5" min="1" max="10" style="width:50px">
                <button class="btn btn-fill" onclick="app.ds('recursion')">visualize</button>`;
        }

        c.innerHTML = html;
    }

    _val() { return parseInt(document.getElementById('dsVal')?.value) || 0; }
    _idx() { return parseInt(document.getElementById('dsIdx')?.value) || 0; }

    ds(action) {
        const a = this.currentAlgo;
        const val = this._val();

        switch (a) {
            case 'array':
                if (action === 'push') this.dsArray.push(val);
                else if (action === 'pop') this.dsArray.pop();
                else if (action === 'insertAt') this.dsArray.splice(this._idx(), 0, val);
                else if (action === 'search') {
                    const i = this.dsArray.indexOf(val);
                    this._toast(i >= 0 ? `found at index ${i}` : 'not found');
                    if (i >= 0) { this._renderDS({ found: i }); return; }
                }
                break;
            case 'linkedlist':
                if (action === 'push') this.linkedList.push(val);
                else if (action === 'pop') this.linkedList.pop();
                else if (action === 'insertAt') this.linkedList.splice(this._idx(), 0, val);
                else if (action === 'search') {
                    const i = this.linkedList.indexOf(val);
                    this._toast(i >= 0 ? `found at node ${i}` : 'not found');
                    if (i >= 0) { this._renderDS({ found: i }); return; }
                }
                break;
            case 'stack':
                if (action === 'push') { this.stack.push(val); this._toast('pushed ' + val); }
                else if (action === 'pop') {
                    if (this.stack.length) this._toast('popped: ' + this.stack.pop());
                    else this._toast('stack is empty');
                }
                else if (action === 'peek') {
                    if (this.stack.length) this._toast('top: ' + this.stack[this.stack.length - 1]);
                    else this._toast('stack is empty');
                }
                break;
            case 'queue':
                if (action === 'push') { this.queue.push(val); this._toast('enqueued ' + val); }
                else if (action === 'pop') {
                    if (this.queue.length) this._toast('dequeued: ' + this.queue.shift());
                    else this._toast('queue is empty');
                }
                else if (action === 'peek') {
                    if (this.queue.length) this._toast('front: ' + this.queue[0]);
                    else this._toast('queue is empty');
                }
                break;
            case 'bst':
                if (action === 'insert') { this.bst.insert(val); this._toast('inserted ' + val); }
                else if (action === 'search') {
                    const r = this.bst.search(val);
                    this._toast(r.found ? `path: ${r.path.join(' → ')}` : 'not found');
                    if (r.found) { this._renderDS({ active: val, visited: r.path.slice(0, -1) }); return; }
                }
                else if (action === 'inorder') {
                    this._toast('inorder: ' + this.bst.inorder().join(', '));
                }
                else if (action === 'resetBst') {
                    this.bst = new BST();
                    [50, 30, 70, 20, 40, 60, 80].forEach(v => this.bst.insert(v));
                }
                break;
            case 'heap':
                if (action === 'insert') {
                    this.heapArray.push(val);
                    this._heapUp(this.heapArray.length - 1);
                    this._toast('inserted ' + val);
                } else if (action === 'extract') {
                    if (this.heapArray.length) {
                        const m = this.heapArray[0];
                        this.heapArray[0] = this.heapArray[this.heapArray.length - 1];
                        this.heapArray.pop();
                        if (this.heapArray.length) this._heapDown(0);
                        this._toast('extracted: ' + m);
                    } else this._toast('heap is empty');
                } else if (action === 'resetHeap') {
                    this.heapArray = [50, 30, 40, 10, 20, 35, 25];
                }
                break;
            case 'graph':
                this._graphAction(action);
                return;
            case 'hashtable':
                const key = document.getElementById('dsKey')?.value || 'key';
                const bucket = this._hash(key, this.hashTable.length);
                if (action === 'insert') {
                    const ex = this.hashTable[bucket].findIndex(e => e.key === key);
                    if (ex >= 0) this.hashTable[bucket][ex].value = val;
                    else this.hashTable[bucket].push({ key, value: val });
                    this._toast(`"${key}" → bucket ${bucket}`);
                } else if (action === 'search') {
                    const e = this.hashTable[bucket].find(e => e.key === key);
                    this._toast(e ? `"${key}" = ${e.value}` : `"${key}" not found`);
                } else if (action === 'delete') {
                    const i = this.hashTable[bucket].findIndex(e => e.key === key);
                    if (i >= 0) { this.hashTable[bucket].splice(i, 1); this._toast('deleted'); }
                    else this._toast('not found');
                }
                break;
            case 'binarysearch':
                if (action === 'binSearch') {
                    this._runBinarySearch(val);
                    return;
                } else if (action === 'resetBS') {
                    this.dsArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1).sort((a, b) => a - b);
                }
                break;
            case 'recursion':
                if (action === 'recursion') {
                    const type = document.getElementById('dsType')?.value || 'factorial';
                    this._renderRecursion(type, Math.min(val, type === 'fibonacci' ? 8 : 10));
                    return;
                }
                break;
        }

        this._renderDS();
    }

    _heapUp(i) {
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (this.heapArray[i] > this.heapArray[p]) {
                [this.heapArray[i], this.heapArray[p]] = [this.heapArray[p], this.heapArray[i]];
                i = p;
            } else break;
        }
    }
    _heapDown(i) {
        const n = this.heapArray.length;
        while (true) {
            let l = i, left = 2 * i + 1, right = 2 * i + 2;
            if (left < n && this.heapArray[left] > this.heapArray[l]) l = left;
            if (right < n && this.heapArray[right] > this.heapArray[l]) l = right;
            if (l !== i) { [this.heapArray[i], this.heapArray[l]] = [this.heapArray[l], this.heapArray[i]]; i = l; }
            else break;
        }
    }

    async _graphAction(action) {
        if (action === 'resetGraph') {
            this.graphData = GraphBuilder.createDefaultGraph();
            this._renderDS();
            return;
        }

        const viz = new DataStructureVisualizer(this.canvas);
        const algoViz = new AlgorithmVisualizer();
        algoViz.setSpeed(Math.max(80, (101 - this.speed) * 8));
        this._setStatus('running');

        try {
            if (action === 'bfs') {
                await algoViz.bfs(this.graphData.nodes, this.graphData.edges, 0, async (s) => {
                    viz.resize();
                    viz.drawGraph(this.graphData.nodes, this.graphData.edges, { current: s.current, visited: s.visited, active: s.exploring });
                });
                this._toast('BFS complete · visited ' + this.graphData.nodes.length + ' nodes');
            } else if (action === 'dfs') {
                await algoViz.dfs(this.graphData.nodes, this.graphData.edges, 0, async (s) => {
                    viz.resize();
                    viz.drawGraph(this.graphData.nodes, this.graphData.edges, { current: s.current, visited: s.visited });
                });
                this._toast('DFS complete');
            } else if (action === 'dijkstra') {
                await algoViz.dijkstra(this.graphData.nodes, this.graphData.edges, 0, async (s) => {
                    viz.resize();
                    viz.drawGraph(this.graphData.nodes, this.graphData.edges, { current: s.current, visited: s.visited, active: s.relaxing, distances: s.distances });
                });
                this._toast("Dijkstra's complete");
            }
        } catch (e) { /* cancelled */ }
        this._setStatus('done');
    }

    async _runBinarySearch(target) {
        const sorted = [...this.dsArray].sort((a, b) => a - b);
        this.dsArray = sorted;
        const viz = new DataStructureVisualizer(this.canvas);
        const algoViz = new AlgorithmVisualizer();
        algoViz.setSpeed(Math.max(200, (101 - this.speed) * 10));
        this._setStatus('running');

        const result = await algoViz.binarySearch(sorted, target, async (s) => {
            viz.resize();
            const highlights = {};
            if (s.found) highlights.found = s.mid;
            else highlights.active = [s.low, s.mid, s.high].filter(i => i >= 0 && i < sorted.length);
            viz.drawArray(sorted, highlights);
        });

        this._setStatus('done');
        this._toast(result.found ? `found ${target} at index ${result.index}` : `${target} not found`);
    }

    _renderRecursion(type, n) {
        const algoViz = new AlgorithmVisualizer();
        const tree = algoViz.buildRecursionTree(type, n);
        const viz = new DataStructureVisualizer(this.canvas);
        viz.resize();
        viz.drawRecursionTree(tree);
        this._toast(`${type}(${n}) recursion tree`);
    }

    _renderDS(highlights = {}) {
        setTimeout(() => {
            const viz = new DataStructureVisualizer(this.canvas);
            viz.resize();
            switch (this.currentAlgo) {
                case 'array': viz.drawArray(this.dsArray, highlights); break;
                case 'linkedlist': viz.drawLinkedList(this.linkedList, highlights); break;
                case 'stack': viz.drawStack(this.stack, highlights); break;
                case 'queue': viz.drawQueue(this.queue, highlights); break;
                case 'bst': viz.drawTree(this.bst.root, highlights, 'bst'); break;
                case 'heap': viz.drawHeap(this.heapArray, highlights); break;
                case 'graph': viz.drawGraph(this.graphData.nodes, this.graphData.edges, highlights); break;
                case 'hashtable': viz.drawHashTable(this.hashTable, highlights); break;
                case 'binarysearch': viz.drawArray(this.dsArray, highlights); break;
                case 'recursion': viz.drawRecursionTree([]); break;
            }
        }, 40);
    }

    _renderAlgo() {
        // For algo-type, render the initial graph/array
        if (['bfs', 'dfs', 'dijkstra'].includes(this.currentAlgo)) {
            this._renderDS();
        } else if (this.currentAlgo === 'binarysearch') {
            this.dsArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1).sort((a, b) => a - b);
            this._renderDS();
        } else if (this.currentAlgo === 'recursion') {
            this._renderDS();
        }
    }

    // ============ RACE ============
    _setupRace() {
        const size = parseInt(document.getElementById('raceSizeSlider')?.value) || 40;
        this._raceBase = Array.from({ length: size }, () => Math.floor(Math.random() * 250) + 10);

        const algos = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
        const grid = document.getElementById('raceGrid');
        grid.innerHTML = algos.map(algo => {
            const info = this.sortingAlgo.getAlgoInfo(algo);
            return `<div class="race-card" id="rc-${algo}">
                <div class="race-card-header">
                    <h4>${info.name}</h4>
                    <span class="race-card-time" id="rt-${algo}">—</span>
                </div>
                <canvas id="rcc-${algo}"></canvas>
            </div>`;
        }).join('');

        setTimeout(() => {
            algos.forEach(algo => this._drawRaceBar(algo, [...this._raceBase]));
        }, 50);
    }

    _drawRaceBar(algo, arr, state = {}) {
        const canvas = document.getElementById(`rcc-${algo}`);
        if (!canvas) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = 140 * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '140px';

        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const w = rect.width, h = 140;
        ctx.clearRect(0, 0, w, h);

        const n = arr.length;
        const gap = 1;
        const barW = Math.max(1, (w - 16 - (n - 1) * gap) / n);
        const maxVal = Math.max(...arr);
        const sorted = new Set(state.sorted || []);

        for (let i = 0; i < n; i++) {
            const x = 8 + i * (barW + gap);
            const barH = (arr[i] / maxVal) * (h - 16);
            const y = h - 8 - barH;

            ctx.fillStyle = sorted.has(i) ? '#10b981' : '#3b82f6';
            ctx.globalAlpha = sorted.has(i) ? 1 : 0.5;

            const r = Math.min(barW / 2, 2);
            ctx.beginPath();
            ctx.moveTo(x, h - 8);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.lineTo(x + barW - r, y);
            ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
            ctx.lineTo(x + barW, h - 8);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    async _startRace() {
        if (!this._raceBase.length) this._setupRace();
        const algos = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
        document.getElementById('btnRaceStart').disabled = true;
        let winner = null;
        const results = [];

        const promises = algos.map(async (algo) => {
            const arr = [...this._raceBase];
            const s = new SortingAlgorithms();
            const fn = {
                bubble: () => s.bubbleSort(arr), selection: () => s.selectionSort(arr),
                insertion: () => s.insertionSort(arr), merge: () => s.mergeSort(arr),
                quick: () => s.quickSort(arr), heap: () => s.heapSort(arr)
            }[algo];

            const start = performance.now();
            await fn();
            const elapsed = Math.round(performance.now() - start);

            const all = Array.from({ length: arr.length }, (_, i) => i);
            this._drawRaceBar(algo, arr, { sorted: all });
            document.getElementById(`rt-${algo}`).textContent = elapsed + 'ms';
            document.getElementById(`rc-${algo}`).classList.add('finished');

            results.push({ algo, elapsed });

            if (!winner) {
                winner = algo;
                document.getElementById(`rc-${algo}`).classList.add('winner');
            }
        });

        await Promise.all(promises);
        document.getElementById('btnRaceStart').disabled = false;

        if (winner) {
            const info = this.sortingAlgo.getAlgoInfo(winner);
            this._toast(`🏆 ${info.name} wins · ${results.find(r => r.algo === winner).elapsed}ms`);
        }
    }

    // ============ DYNAMIC PROGRAMMING ============
    _initDP() {
        this.dpCanvas = document.getElementById('dpCanvas');
        this.dpCtx = this.dpCanvas.getContext('2d');
        this.dpRunning = false;

        const problemSelect = document.getElementById('dpProblem');
        problemSelect.addEventListener('change', () => this._updateDPInfo());

        document.getElementById('btnDpRun').addEventListener('click', () => this._runDP());
        document.getElementById('btnDpReset').addEventListener('click', () => {
            this.dpEngine.cancel();
            this.dpRunning = false;
            this._initDP();
        });
        document.getElementById('dpSpeed').addEventListener('input', (e) => {
            this.dpEngine.speed = Math.max(10, (101 - parseInt(e.target.value)) * 5);
        });

        this._updateDPInfo();
        setTimeout(() => {
            this._sizeDPCanvas();
            this._drawDPPlaceholder();
        }, 50);
    }

    _updateDPInfo() {
        const problem = document.getElementById('dpProblem').value;
        const titles = {
            knapsack: ['0/1 Knapsack', 'Maximize value within weight capacity'],
            coinchange: ['Coin Change', 'Minimum coins to make an amount'],
            lcs: ['Longest Common Subsequence', 'Find longest shared subsequence'],
            gridpaths: ['Unique Paths', 'Count paths in an m×n grid'],
            fibonacci: ['Fibonacci', 'Compute F(n) with tabulation']
        };
        const [title, sub] = titles[problem] || titles.knapsack;
        document.getElementById('dpTitle').textContent = title;
        document.getElementById('dpSubtitle').textContent = sub;

        const info = document.getElementById('dpInfo');
        const descriptions = {
            knapsack: `<h4>Problem</h4><p>Given <span>n</span> items with weights and values, find the maximum value you can carry in a knapsack of capacity <span>W</span>.</p><h4>Recurrence</h4><p>dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])</p><h4>Parameters</h4><div class="dp-params"><span>weights</span>: [2, 3, 4, 5]<br><span>values</span>: [3, 4, 5, 6]<br><span>capacity</span>: 7</div>`,
            coinchange: `<h4>Problem</h4><p>Given coins of different denominations, find the minimum number of coins to make a given amount.</p><h4>Recurrence</h4><p>dp[i] = min(dp[i], dp[i - coin] + 1)</p><h4>Parameters</h4><div class="dp-params"><span>coins</span>: [1, 5, 10, 25]<br><span>amount</span>: 30</div>`,
            lcs: `<h4>Problem</h4><p>Find the longest subsequence common to two strings.</p><h4>Recurrence</h4><p>If s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1] + 1<br>Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</p><h4>Parameters</h4><div class="dp-params"><span>s1</span>: "ABCBDAB"<br><span>s2</span>: "BDCAB"</div>`,
            gridpaths: `<h4>Problem</h4><p>Count the number of unique paths from top-left to bottom-right in an m×n grid (only move right or down).</p><h4>Recurrence</h4><p>dp[r][c] = dp[r-1][c] + dp[r][c-1]</p><h4>Parameters</h4><div class="dp-params"><span>rows</span>: 5<br><span>cols</span>: 7</div>`,
            fibonacci: `<h4>Problem</h4><p>Compute the nth Fibonacci number using bottom-up DP.</p><h4>Recurrence</h4><p>F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1</p><h4>Parameters</h4><div class="dp-params"><span>n</span>: 15</div>`
        };
        info.innerHTML = descriptions[problem] || descriptions.knapsack;
    }

    _sizeDPCanvas() {
        const wrap = this.dpCanvas.parentElement;
        const w = wrap.clientWidth - 32;
        const h = Math.min(450, w * 0.6);
        const dpr = window.devicePixelRatio || 1;
        this.dpCanvas.width = w * dpr;
        this.dpCanvas.height = h * dpr;
        this.dpCanvas.style.width = w + 'px';
        this.dpCanvas.style.height = h + 'px';
        this.dpCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this._dpW = w;
        this._dpH = h;
    }

    _drawDPPlaceholder() {
        const ctx = this.dpCtx;
        ctx.clearRect(0, 0, this._dpW, this._dpH);
        ctx.fillStyle = '#71717a';
        ctx.font = '14px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('Click "run" to start visualization', this._dpW / 2, this._dpH / 2);
    }

    async _runDP() {
        if (this.dpRunning) return;
        this.dpRunning = true;
        this.dpEngine.cancelled = false;
        this.dpEngine.speed = Math.max(10, (101 - parseInt(document.getElementById('dpSpeed').value)) * 5);
        const problem = document.getElementById('dpProblem').value;

        try {
            if (problem === 'knapsack') await this._runKnapsack();
            else if (problem === 'coinchange') await this._runCoinChange();
            else if (problem === 'lcs') await this._runLCS();
            else if (problem === 'gridpaths') await this._runGridPaths();
            else if (problem === 'fibonacci') await this._runFibonacci();
        } catch (e) { /* cancelled */ }

        this.dpRunning = false;
    }

    async _runKnapsack() {
        const weights = [2, 3, 4, 5];
        const values = [3, 4, 5, 6];
        const capacity = 7;
        this._sizeDPCanvas();

        await this.dpEngine.knapsack(weights, values, capacity, (dp, highlights, msg) => {
            this._drawDPTable2D(dp, highlights, {
                rowLabels: ['∅', ...weights.map((w, i) => `w${i+1}=${w}`)],
                colLabels: Array.from({ length: capacity + 1 }, (_, i) => i),
                rowHeader: 'Items →',
                colHeader: 'Capacity →'
            });
            document.getElementById('dpExplanation').textContent = msg;
        });
    }

    async _runCoinChange() {
        const coins = [1, 5, 10, 25];
        const amount = 20;
        this._sizeDPCanvas();

        await this.dpEngine.coinChange(coins, amount, (dp, highlights) => {
            this._drawDPTable1D(dp, highlights, {
                label: 'Amount',
                title: `Coins: [${coins.join(', ')}]`
            });
            document.getElementById('dpExplanation').textContent = highlights.explanation || '';
        });
    }

    async _runLCS() {
        const s1 = 'ABCBDAB';
        const s2 = 'BDCAB';
        this._sizeDPCanvas();

        await this.dpEngine.lcs(s1, s2, (dp, highlights, str1, str2) => {
            this._drawDPLCS(dp, highlights, str1 || s1, str2 || s2);
            document.getElementById('dpExplanation').textContent = highlights.explanation || '';
        });
    }

    async _runGridPaths() {
        const rows = 5, cols = 7;
        this._sizeDPCanvas();

        await this.dpEngine.uniquePaths(rows, cols, (dp, highlights) => {
            this._drawDPTable2D(dp, highlights, {
                rowLabels: Array.from({ length: rows }, (_, i) => i),
                colLabels: Array.from({ length: cols }, (_, i) => i),
                rowHeader: 'Row',
                colHeader: 'Col'
            });
            document.getElementById('dpExplanation').textContent = highlights.explanation || '';
        });
    }

    async _runFibonacci() {
        const n = 15;
        this._sizeDPCanvas();

        await this.dpEngine.fibonacci(n, (dp, highlights) => {
            this._drawDPTable1D(dp, highlights, {
                label: 'n',
                title: 'Fibonacci Sequence',
                highlightDepends: highlights.depends || []
            });
            document.getElementById('dpExplanation').textContent = highlights.explanation || '';
        });
    }

    _drawDPTable2D(dp, highlights, opts) {
        const ctx = this.dpCtx;
        const w = this._dpW, h = this._dpH;
        ctx.clearRect(0, 0, w, h);

        const rows = dp.length, cols = dp[0].length;
        const headerW = 60, headerH = 30;
        const cellW = Math.min(55, (w - headerW - 20) / cols);
        const cellH = Math.min(36, (h - headerH - 20) / rows);
        const offsetX = headerW + 10, offsetY = headerH + 10;

        // Find max value for color intensity
        let maxVal = 0;
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                if (dp[r][c] > maxVal) maxVal = dp[r][c];

        // Column headers
        ctx.fillStyle = '#71717a';
        ctx.font = '11px "JetBrains Mono"';
        ctx.textAlign = 'center';
        for (let c = 0; c < cols; c++) {
            ctx.fillText(opts.colLabels[c], offsetX + c * cellW + cellW / 2, offsetY - 8);
        }

        // Row headers
        ctx.textAlign = 'right';
        for (let r = 0; r < rows; r++) {
            ctx.fillText(opts.rowLabels[r], offsetX - 8, offsetY + r * cellH + cellH / 2 + 4);
        }

        // Draw cells
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetX + c * cellW;
                const y = offsetY + r * cellH;
                const val = dp[r][c];

                let bg = '#1c1c22';
                let border = '#27272a';
                let textColor = '#a1a1aa';

                // Color by value intensity
                if (val > 0 && maxVal > 0) {
                    const intensity = val / maxVal;
                    bg = `rgba(59, 130, 246, ${0.05 + intensity * 0.15})`;
                    textColor = '#d4d4d8';
                }

                // Highlight depends
                if (highlights.depends) {
                    for (const d of highlights.depends) {
                        if (d.r === r && d.c === c) {
                            bg = 'rgba(168, 85, 247, 0.25)';
                            border = '#a855f7';
                            textColor = '#e9d5ff';
                        }
                    }
                }

                // Highlight current
                if (highlights.current && highlights.current.r === r && highlights.current.c === c) {
                    bg = highlights.choice === 'include' ? 'rgba(16, 185, 129, 0.3)' :
                        highlights.choice === 'exclude' ? 'rgba(239, 68, 68, 0.2)' :
                        highlights.match ? 'rgba(16, 185, 129, 0.3)' :
                        'rgba(245, 158, 11, 0.3)';
                    border = highlights.choice === 'include' || highlights.match ? '#10b981' :
                        highlights.choice === 'exclude' ? '#ef4444' : '#f59e0b';
                    textColor = '#fafafa';
                }

                // Draw cell
                ctx.fillStyle = bg;
                ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                ctx.strokeStyle = border;
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

                // Value
                ctx.fillStyle = textColor;
                ctx.font = `${Math.min(13, cellH * 0.4)}px "JetBrains Mono"`;
                ctx.textAlign = 'center';
                ctx.fillText(val, x + cellW / 2, y + cellH / 2 + 4);
            }
        }
    }

    _drawDPTable1D(dp, highlights, opts) {
        const ctx = this.dpCtx;
        const w = this._dpW, h = this._dpH;
        ctx.clearRect(0, 0, w, h);

        const n = dp.length;
        const pad = 30;
        const cellW = Math.min(50, (w - pad * 2) / n);
        const cellH = 40;
        const startX = (w - n * cellW) / 2;
        const startY = h / 2 - cellH / 2;

        let maxVal = 0;
        for (let i = 0; i < n; i++) if (dp[i] < Infinity && dp[i] > maxVal) maxVal = dp[i];

        // Title
        ctx.fillStyle = '#71717a';
        ctx.font = '12px "JetBrains Mono"';
        ctx.textAlign = 'center';
        if (opts.title) ctx.fillText(opts.title, w / 2, 30);

        for (let i = 0; i < n; i++) {
            const x = startX + i * cellW;
            let bg = '#1c1c22';
            let border = '#27272a';
            let textColor = '#a1a1aa';

            if (dp[i] < Infinity && dp[i] > 0 && maxVal > 0) {
                const intensity = dp[i] / maxVal;
                bg = `rgba(59, 130, 246, ${0.05 + intensity * 0.15})`;
                textColor = '#d4d4d8';
            }

            // Highlight depends
            if (highlights.comparing && highlights.comparing.includes(i)) {
                bg = 'rgba(168, 85, 247, 0.25)';
                border = '#a855f7';
                textColor = '#e9d5ff';
            }
            if (opts.highlightDepends && opts.highlightDepends.includes(i)) {
                bg = 'rgba(168, 85, 247, 0.25)';
                border = '#a855f7';
                textColor = '#e9d5ff';
            }

            // Current
            if (highlights.current === i) {
                bg = 'rgba(245, 158, 11, 0.3)';
                border = '#f59e0b';
                textColor = '#fafafa';
            }

            ctx.fillStyle = bg;
            ctx.fillRect(x + 1, startY, cellW - 2, cellH);
            ctx.strokeStyle = border;
            ctx.strokeRect(x + 1, startY, cellW - 2, cellH);

            // Value
            ctx.fillStyle = textColor;
            ctx.font = `${Math.min(14, cellW * 0.35)}px "JetBrains Mono"`;
            ctx.textAlign = 'center';
            const display = dp[i] === Infinity ? '∞' : dp[i];
            ctx.fillText(display, x + cellW / 2, startY + cellH / 2 + 4);

            // Index label below
            ctx.fillStyle = '#52525b';
            ctx.font = '10px "JetBrains Mono"';
            ctx.fillText(i, x + cellW / 2, startY + cellH + 14);
        }

        // Label
        ctx.fillStyle = '#52525b';
        ctx.font = '11px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(opts.label || 'index', w / 2, startY + cellH + 30);
    }

    _drawDPLCS(dp, highlights, s1, s2) {
        const ctx = this.dpCtx;
        const w = this._dpW, h = this._dpH;
        ctx.clearRect(0, 0, w, h);

        const rows = dp.length, cols = dp[0].length;
        const headerW = 40, headerH = 40;
        const cellW = Math.min(50, (w - headerW - 20) / cols);
        const cellH = Math.min(40, (h - headerH - 20) / rows);
        const offsetX = headerW + 10, offsetY = headerH + 10;

        let maxVal = 0;
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                if (dp[r][c] > maxVal) maxVal = dp[r][c];

        // String labels
        ctx.fillStyle = '#71717a';
        ctx.font = '12px "JetBrains Mono"';
        ctx.textAlign = 'center';

        // Top string (s2)
        ctx.fillText('', offsetX - 20, offsetY - 10);
        for (let c = 0; c < s2.length; c++) {
            ctx.fillText(s2[c], offsetX + (c + 1) * cellW + cellW / 2, offsetY - 10);
        }
        // Left string (s1)
        ctx.textAlign = 'right';
        for (let r = 0; r < s1.length; r++) {
            ctx.fillText(s1[r], offsetX - 8, offsetY + (r + 1) * cellH + cellH / 2 + 4);
        }
        ctx.fillText('', offsetX - 8, offsetY + cellH / 2 + 4);

        // Cells
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetX + c * cellW;
                const y = offsetY + r * cellH;
                const val = dp[r][c];

                let bg = '#1c1c22';
                let border = '#27272a';
                let textColor = '#a1a1aa';

                if (val > 0 && maxVal > 0) {
                    const intensity = val / maxVal;
                    bg = `rgba(16, 185, 129, ${0.05 + intensity * 0.2})`;
                    textColor = '#d4d4d8';
                }

                if (highlights.depends) {
                    for (const d of highlights.depends) {
                        if (d.r === r && d.c === c) {
                            bg = 'rgba(168, 85, 247, 0.25)';
                            border = '#a855f7';
                            textColor = '#e9d5ff';
                        }
                    }
                }

                if (highlights.current && highlights.current.r === r && highlights.current.c === c) {
                    bg = highlights.match ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.3)';
                    border = highlights.match ? '#10b981' : '#f59e0b';
                    textColor = '#fafafa';
                }

                ctx.fillStyle = bg;
                ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                ctx.strokeStyle = border;
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

                ctx.fillStyle = textColor;
                ctx.font = `${Math.min(14, cellH * 0.4)}px "JetBrains Mono"`;
                ctx.textAlign = 'center';
                ctx.fillText(val, x + cellW / 2, y + cellH / 2 + 4);
            }
        }
    }

    // ============ BACKTRACKING ============
    _initBacktrack() {
        this.btCanvas = document.getElementById('btCanvas');
        this.btCtx = this.btCanvas.getContext('2d');
        this.btRunning = false;

        const problemSelect = document.getElementById('btProblem');
        problemSelect.addEventListener('change', () => this._updateBTInfo());

        document.getElementById('btnBtRun').addEventListener('click', () => this._runBacktrack());
        document.getElementById('btnBtReset').addEventListener('click', () => {
            this.btEngine.cancel();
            this.btRunning = false;
            this._sizeBTCanvas();
            this._drawBTPlaceholder();
            document.getElementById('btExplanation').textContent = 'Click run to start.';
        });
        document.getElementById('btSpeed').addEventListener('input', (e) => {
            this.btEngine.speed = Math.max(10, (101 - parseInt(e.target.value)) * 5);
        });
        document.getElementById('btSize').addEventListener('input', (e) => {
            document.getElementById('btSizeLabel').textContent = e.target.value;
        });

        this._updateBTInfo();
        setTimeout(() => {
            this._sizeBTCanvas();
            this._drawBTPlaceholder();
        }, 50);
    }

    _updateBTInfo() {
        const problem = document.getElementById('btProblem').value;
        const titles = {
            nqueens: ['N-Queens', 'Place N queens so no two attack each other'],
            sudoku: ['Sudoku Solver', 'Fill the grid so each row, column, and box has 1-9'],
            maze: ['Maze Generation', 'Carve passages using recursive backtracker'],
            ratmaze: ['Rat in a Maze', 'Find a path from top-left to bottom-right']
        };
        const [title, sub] = titles[problem] || titles.nqueens;
        document.getElementById('btTitle').textContent = title;
        document.getElementById('btSubtitle').textContent = sub;

        // Show/hide size control
        const sizeControl = document.getElementById('btSizeControl');
        sizeControl.style.display = (problem === 'nqueens' || problem === 'maze') ? '' : 'none';

        const info = document.getElementById('btInfo');
        const descriptions = {
            nqueens: `<h4>Problem</h4><p>Place <span>N</span> queens on an N×N chessboard so that no two queens threaten each other (no shared row, column, or diagonal).</p><h4>Approach</h4><p>Place queens row by row. For each row, try each column. If safe, recurse to next row. If no column works, backtrack.</p><h4>Complexity</h4><div class="bt-params">Time: <span>O(N!)</span><br>Space: <span>O(N)</span></div>`,
            sudoku: `<h4>Problem</h4><p>Fill a 9×9 grid so each row, column, and 3×3 box contains digits 1-9.</p><h4>Approach</h4><p>Find the next empty cell. Try digits 1-9. If valid, recurse. If no digit works, backtrack.</p><h4>Complexity</h4><div class="bt-params">Time: <span>O(9^empty cells)</span><br>Space: <span>O(81)</span></div>`,
            maze: `<h4>Problem</h4><p>Generate a perfect maze (exactly one path between any two cells).</p><h4>Approach</h4><p>Start at (1,1). Pick a random unvisited neighbor 2 cells away. Carve the wall between them. Recurse. Backtrack when stuck.</p><h4>Complexity</h4><div class="bt-params">Time: <span>O(V)</span> where V = cells<br>Space: <span>O(V)</span></div>`,
            ratmaze: `<h4>Problem</h4><p>Find a path from (0,0) to (n-1,n-1) in a binary maze (1=open, 0=wall).</p><h4>Approach</h4><p>At each cell, try going right or down. If we reach the end, done. If both fail, backtrack.</p><h4>Complexity</h4><div class="bt-params">Time: <span>O(2^(n²))</span><br>Space: <span>O(n²)</span></div>`
        };
        info.innerHTML = descriptions[problem] || descriptions.nqueens;
    }

    _sizeBTCanvas() {
        const wrap = this.btCanvas.parentElement;
        const w = wrap.clientWidth - 32;
        const h = Math.min(500, w);
        const dpr = window.devicePixelRatio || 1;
        this.btCanvas.width = w * dpr;
        this.btCanvas.height = h * dpr;
        this.btCanvas.style.width = w + 'px';
        this.btCanvas.style.height = h + 'px';
        this.btCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this._btW = w;
        this._btH = h;
    }

    _drawBTPlaceholder() {
        const ctx = this.btCtx;
        ctx.clearRect(0, 0, this._btW, this._btH);
        ctx.fillStyle = '#71717a';
        ctx.font = '14px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('Click "run" to start', this._btW / 2, this._btH / 2);
    }

    async _runBacktrack() {
        if (this.btRunning) return;
        this.btRunning = true;
        this.btEngine.cancelled = false;
        this.btEngine.speed = Math.max(10, (101 - parseInt(document.getElementById('btSpeed').value)) * 5);
        const problem = document.getElementById('btProblem').value;

        this._sizeBTCanvas();

        try {
            if (problem === 'nqueens') await this._runNQueens();
            else if (problem === 'sudoku') await this._runSudoku();
            else if (problem === 'maze') await this._runMazeGen();
            else if (problem === 'ratmaze') await this._runRatMaze();
        } catch (e) { /* cancelled */ }

        this.btRunning = false;
    }

    async _runNQueens() {
        const n = parseInt(document.getElementById('btSize').value) || 8;
        await this.btEngine.nQueens(n, (state) => {
            this._drawNQueens(state);
            document.getElementById('btExplanation').textContent = state.explanation;
        });
    }

    _drawNQueens(state) {
        const ctx = this.btCtx;
        const w = this._btW, h = this._btH;
        ctx.clearRect(0, 0, w, h);

        const n = state.board.length;
        const pad = 30;
        const cellSize = Math.min((w - pad * 2) / n, (h - pad * 2) / n);
        const offsetX = (w - n * cellSize) / 2;
        const offsetY = (h - n * cellSize) / 2;

        // Draw board
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;
                const isDark = (r + c) % 2 === 1;

                let bg = isDark ? '#27272a' : '#3f3f46';

                // Highlight trying position
                if (state.trying && state.trying.r === r && state.trying.c === c) {
                    bg = state.backtracking ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)';
                }

                // Highlight conflicts
                if (state.conflicts) {
                    for (const cf of state.conflicts) {
                        if (cf.r === r && cf.c === c) bg = 'rgba(239, 68, 68, 0.5)';
                    }
                }

                ctx.fillStyle = bg;
                ctx.fillRect(x, y, cellSize, cellSize);

                // Draw queen
                if (state.board[r][c] === 'Q') {
                    ctx.fillStyle = '#f59e0b';
                    ctx.font = `${cellSize * 0.6}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('♛', x + cellSize / 2, y + cellSize / 2);
                }

                // Draw trying indicator (no queen placed yet)
                if (state.trying && state.trying.r === r && state.trying.c === c && state.board[r][c] !== 'Q') {
                    ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
                    ctx.font = `${cellSize * 0.5}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('♛', x + cellSize / 2, y + cellSize / 2);
                }
            }
        }

        // Board border
        ctx.strokeStyle = '#52525b';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, n * cellSize, n * cellSize);
    }

    async _runSudoku() {
        const puzzle = BacktrackEngine.getDefaultSudoku();
        await this.btEngine.sudoku(puzzle, (state) => {
            this._drawSudoku(state);
            document.getElementById('btExplanation').textContent = state.explanation;
        });
    }

    _drawSudoku(state) {
        const ctx = this.btCtx;
        const w = this._btW, h = this._btH;
        ctx.clearRect(0, 0, w, h);

        const n = 9;
        const pad = 30;
        const cellSize = Math.min((w - pad * 2) / n, (h - pad * 2) / n);
        const offsetX = (w - n * cellSize) / 2;
        const offsetY = (h - n * cellSize) / 2;

        const originalPuzzle = BacktrackEngine.getDefaultSudoku();

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;

                let bg = '#1c1c22';

                // Highlight current trying position
                if (state.trying && state.trying.r === r && state.trying.c === c) {
                    if (state.invalid) bg = 'rgba(239, 68, 68, 0.3)';
                    else if (state.backtracking) bg = 'rgba(245, 158, 11, 0.3)';
                    else bg = 'rgba(59, 130, 246, 0.3)';
                }

                ctx.fillStyle = bg;
                ctx.fillRect(x, y, cellSize, cellSize);

                // Cell border
                ctx.strokeStyle = '#3f3f46';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);

                // Value
                const val = state.board[r][c];
                if (val > 0) {
                    const isOriginal = originalPuzzle[r][c] > 0;
                    ctx.fillStyle = isOriginal ? '#d4d4d8' : '#60a5fa';
                    ctx.font = `bold ${cellSize * 0.5}px "JetBrains Mono"`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
                }
            }
        }

        // Box borders (thicker every 3 cells)
        ctx.strokeStyle = '#71717a';
        ctx.lineWidth = 2;
        for (let i = 0; i <= n; i++) {
            const lw = i % 3 === 0 ? 2.5 : 0.5;
            ctx.lineWidth = lw;
            ctx.beginPath();
            ctx.moveTo(offsetX + i * cellSize, offsetY);
            ctx.lineTo(offsetX + i * cellSize, offsetY + n * cellSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY + i * cellSize);
            ctx.lineTo(offsetX + n * cellSize, offsetY + i * cellSize);
            ctx.stroke();
        }
    }

    async _runMazeGen() {
        const size = parseInt(document.getElementById('btSize').value) || 8;
        const rows = size * 2 + 1;
        const cols = size * 2 + 1;
        await this.btEngine.generateMaze(rows, cols, (state) => {
            this._drawMaze(state);
            document.getElementById('btExplanation').textContent = state.explanation;
        });
    }

    async _runRatMaze() {
        const maze = [
            [1, 0, 0, 0, 0],
            [1, 1, 0, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 1]
        ];
        await this.btEngine.ratInMaze(maze, (state) => {
            this._drawRatMaze(state);
            document.getElementById('btExplanation').textContent = state.explanation;
        });
    }

    _drawMaze(state) {
        const ctx = this.btCtx;
        const w = this._btW, h = this._btH;
        ctx.clearRect(0, 0, w, h);

        const grid = state.grid;
        const rows = grid.length, cols = grid[0].length;
        const pad = 20;
        const cellSize = Math.min((w - pad * 2) / cols, (h - pad * 2) / rows);
        const offsetX = (w - cols * cellSize) / 2;
        const offsetY = (h - rows * cellSize) / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;

                let bg = grid[r][c] === 1 ? '#3f3f46' : '#0f0f13';

                // Highlight current position
                if (state.current && state.current.r === r && state.current.c === c) {
                    bg = '#3b82f6';
                }

                // Highlight carving
                if (state.carving && state.carving.r === r && state.carving.c === c) {
                    bg = '#f59e0b';
                }

                // Stack trail
                if (state.stack) {
                    for (const s of state.stack) {
                        if (s.r === r && s.c === c && !(state.current && state.current.r === r && state.current.c === c)) {
                            bg = 'rgba(59, 130, 246, 0.3)';
                        }
                    }
                }

                ctx.fillStyle = bg;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    }

    _drawRatMaze(state) {
        const ctx = this.btCtx;
        const w = this._btW, h = this._btH;
        ctx.clearRect(0, 0, w, h);

        const maze = state.maze;
        const solution = state.solution;
        const n = maze.length;
        const pad = 30;
        const cellSize = Math.min((w - pad * 2) / n, (h - pad * 2) / n);
        const offsetX = (w - n * cellSize) / 2;
        const offsetY = (h - n * cellSize) / 2;

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;

                let bg = maze[r][c] === 0 ? '#3f3f46' : '#1c1c22';

                if (solution[r][c] === 1) {
                    bg = 'rgba(16, 185, 129, 0.3)';
                }

                if (state.current && state.current.r === r && state.current.c === c) {
                    bg = state.backtracking ? 'rgba(239, 68, 68, 0.4)' : '#3b82f6';
                }

                ctx.fillStyle = bg;
                ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            }
        }

        // Start and end markers
        ctx.fillStyle = '#10b981';
        ctx.font = `${cellSize * 0.4}px "JetBrains Mono"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', offsetX + cellSize / 2, offsetY + cellSize / 2);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('E', offsetX + (n - 1) * cellSize + cellSize / 2, offsetY + (n - 1) * cellSize + cellSize / 2);
    }

    // ============ EXPORT ============
    _export() {
        const canvas = this.canvas;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `algovis-${this.currentAlgo || 'canvas'}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        this._toast('exported as PNG');
    }

    // ============ LEETCODE MAPPING ============
    _updateLeetCode() {
        const el = document.getElementById('lcList');
        const problems = LeetCodeMap[this.currentAlgo] || [];
        if (problems.length === 0) {
            el.innerHTML = '<p style="padding:16px;color:var(--ink-4);font-family:var(--m);font-size:12px;">No LeetCode problems mapped for this item yet.</p>';
            return;
        }
        el.innerHTML = problems.map(p => {
            const diffClass = p.diff.toLowerCase();
            return `<a class="lc-item" href="https://leetcode.com/problems/${p.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}/" target="_blank">
                <span class="lc-item-name">${p.name}</span>
                <span class="lc-item-lc">#${p.lc}</span>
                <span class="lc-diff lc-diff-${diffClass}">${p.diff}</span>
            </a>`;
        }).join('');
    }

    // ============ PATHFINDING ============
    _initPathfinding() {
        this.pfCanvas = document.getElementById('pfCanvas');
        this.pfCtx = this.pfCanvas.getContext('2d');
        this.pfEngine.init();
        this.pfEngine.start = { r: 10, c: 5 };
        this.pfEngine.end = { r: 10, c: 35 };

        setTimeout(() => {
            this._sizePfCanvas();
            this._drawPfGrid();
            this._bindPfEvents();
        }, 50);
    }

    _sizePfCanvas() {
        const wrap = this.pfCanvas.parentElement;
        const w = wrap.clientWidth - 16;
        const cellSize = Math.floor(w / this.pfEngine.cols);
        const canvasW = cellSize * this.pfEngine.cols;
        const canvasH = cellSize * this.pfEngine.rows;
        const dpr = window.devicePixelRatio || 1;
        this.pfCanvas.width = canvasW * dpr;
        this.pfCanvas.height = canvasH * dpr;
        this.pfCanvas.style.width = canvasW + 'px';
        this.pfCanvas.style.height = canvasH + 'px';
        this.pfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this._pfCellSize = cellSize;
    }

    _bindPfEvents() {
        if (this._pfBound) return;
        this._pfBound = true;

        const getCell = (e) => {
            const rect = this.pfCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const c = Math.floor(x / this._pfCellSize);
            const r = Math.floor(y / this._pfCellSize);
            if (r >= 0 && r < this.pfEngine.rows && c >= 0 && c < this.pfEngine.cols) return { r, c };
            return null;
        };

        this.pfCanvas.addEventListener('mousedown', (e) => {
            if (this.pfRunning) return;
            const cell = getCell(e);
            if (!cell) return;
            const { r, c } = cell;
            const s = this.pfEngine.start, en = this.pfEngine.end;

            if (r === s.r && c === s.c) { this._pfDrag = 'start'; return; }
            if (r === en.r && c === en.c) { this._pfDrag = 'end'; return; }

            this.pfDrawing = true;
            this.pfDrawMode = this.pfEngine.grid[r][c] === 1 ? 0 : 1;
            this.pfEngine.grid[r][c] = this.pfDrawMode;
            this._drawPfGrid();
        });

        this.pfCanvas.addEventListener('mousemove', (e) => {
            if (this.pfRunning) return;
            const cell = getCell(e);
            if (!cell) return;
            const { r, c } = cell;

            if (this._pfDrag === 'start') {
                if (this.pfEngine.grid[r][c] !== 1) { this.pfEngine.start = { r, c }; this._drawPfGrid(); }
            } else if (this._pfDrag === 'end') {
                if (this.pfEngine.grid[r][c] !== 1) { this.pfEngine.end = { r, c }; this._drawPfGrid(); }
            } else if (this.pfDrawing) {
                const s = this.pfEngine.start, en = this.pfEngine.end;
                if ((r === s.r && c === s.c) || (r === en.r && c === en.c)) return;
                this.pfEngine.grid[r][c] = this.pfDrawMode;
                this._drawPfGrid();
            }
        });

        const stopDrag = () => { this.pfDrawing = false; this._pfDrag = null; };
        this.pfCanvas.addEventListener('mouseup', stopDrag);
        this.pfCanvas.addEventListener('mouseleave', stopDrag);
    }

    _drawPfGrid(visited = new Set(), path = []) {
        const ctx = this.pfCtx;
        const cs = this._pfCellSize;
        const rows = this.pfEngine.rows, cols = this.pfEngine.cols;

        ctx.clearRect(0, 0, cs * cols, cs * rows);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * cs, y = r * cs;
                let fill = '#1c1c22';
                if (this.pfEngine.grid[r][c] === 1) fill = '#52525b';
                if (visited.has(`${r},${c}`)) fill = 'rgba(59, 130, 246, 0.25)';
                if (r === this.pfEngine.start.r && c === this.pfEngine.start.c) fill = '#10b981';
                if (r === this.pfEngine.end.r && c === this.pfEngine.end.c) fill = '#ef4444';

                ctx.fillStyle = fill;
                ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
            }
        }

        // Draw path
        if (path.length > 0) {
            for (const key of path) {
                const [r, c] = key.split(',').map(Number);
                const x = c * cs, y = r * cs;
                if (!(r === this.pfEngine.start.r && c === this.pfEngine.start.c) &&
                    !(r === this.pfEngine.end.r && c === this.pfEngine.end.c)) {
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(x + 2, y + 2, cs - 4, cs - 4);
                }
            }
        }

        // Grid lines
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 0.5;
        for (let r = 0; r <= rows; r++) {
            ctx.beginPath(); ctx.moveTo(0, r * cs); ctx.lineTo(cols * cs, r * cs); ctx.stroke();
        }
        for (let c = 0; c <= cols; c++) {
            ctx.beginPath(); ctx.moveTo(c * cs, 0); ctx.lineTo(c * cs, rows * cs); ctx.stroke();
        }
    }

    async _runPathfinding() {
        if (this.pfRunning) return;
        this.pfRunning = true;
        const algo = document.getElementById('pfAlgo').value;
        this.pfEngine.speed = Math.max(1, 101 - parseInt(document.getElementById('pfSpeed').value));
        document.getElementById('pfAlgoName').textContent = algo.toUpperCase();
        document.getElementById('pfStatus').textContent = 'running';

        const fn = {
            bfs: () => this.pfEngine.bfs((v, p, s) => this._pfUpdate(v, p, s)),
            dfs: () => this.pfEngine.dfs((v, p, s) => this._pfUpdate(v, p, s)),
            astar: () => this.pfEngine.astar((v, p, s) => this._pfUpdate(v, p, s)),
            dijkstra: () => this.pfEngine.dijkstra((v, p, s) => this._pfUpdate(v, p, s)),
        }[algo] || (() => this.pfEngine.bfs((v, p, s) => this._pfUpdate(v, p, s)));

        await fn();
        this.pfRunning = false;
    }

    _pfUpdate(visited, path, status) {
        this._drawPfGrid(visited, path);
        this._updatePfStats(visited.size, path.length || '—', status);
    }

    _updatePfStats(visited, pathLen, status) {
        document.getElementById('pfVisited').textContent = visited;
        document.getElementById('pfPathLen').textContent = pathLen;
        const statusEl = document.getElementById('pfStatus');
        statusEl.textContent = status;
        if (status === 'done') { statusEl.style.color = 'var(--green)'; this._toast('path found!'); }
        else if (status === 'nopath') { statusEl.style.color = 'var(--red)'; this._toast('no path exists'); }
        else { statusEl.style.color = ''; }
    }

    // ============ PATTERNS ============
    _currentPattern = null;

    _renderPatterns() {
        const grid = document.getElementById('patternsGrid');
        grid.innerHTML = DSAPatterns.map(p => `
            <div class="pattern-card" data-id="${p.id}" style="--pc:${p.color}">
                <div class="pattern-card-top">
                    <div class="pattern-card-icon" style="color:${p.color}">${p.icon}</div>
                    <span class="pattern-card-count">${p.problems.length} problems</span>
                </div>
                <div class="pattern-card-name">${p.name}</div>
                <div class="pattern-card-when">${p.when}</div>
            </div>
        `).join('');

        grid.querySelectorAll('.pattern-card').forEach(card => {
            card.addEventListener('click', () => this._openPattern(card.dataset.id));
        });
    }

    _openPattern(id) {
        const pattern = DSAPatterns.find(p => p.id === id);
        if (!pattern) return;
        this._currentPattern = pattern;

        document.getElementById('pdKicker').textContent = `/ patterns /`;
        document.getElementById('pdTitle').textContent = pattern.name;
        document.getElementById('pdWhen').textContent = pattern.when;
        document.getElementById('pdDesc').textContent = pattern.desc;
        document.getElementById('pdCode').textContent = pattern.template;

        const probsEl = document.getElementById('pdProblems');
        probsEl.innerHTML = pattern.problems.map(p => `
            <a class="pd-problem" href="https://leetcode.com/problems/${p.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}/" target="_blank">
                <span>${p.name}</span>
                <span class="lc-diff lc-diff-${p.diff.toLowerCase()}">${p.diff}</span>
            </a>
        `).join('');

        this._show('patternDetail');
    }

    // ============ UTILITIES ============
    _toast(msg) {
        const c = document.getElementById('toastContainer');
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        c.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }
}

const app = new AlgoVisApp();
