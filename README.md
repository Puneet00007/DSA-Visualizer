# AlgoVis — Interactive DSA Visualizer

A dark-themed, interactive Data Structures & Algorithms visualization tool. Built with vanilla HTML, CSS, and JavaScript — zero dependencies, zero build step. Deploys instantly to GitHub Pages.

**[Live Demo →](https://YOUR_USERNAME.github.io/algovis/)**

## What's Inside

### 🎯 Sorting (12 algorithms)
Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Cocktail Shaker, Comb, Radix, Counting, Tim Sort — all with step-by-step animation, sound, and race mode.

### 📊 Data Structures (8 types)
Array, Linked List, Stack, Queue, BST, Heap, Graph, Hash Table — all interactive with insert, delete, search.

### 🗺️ Graph Algorithms (5 types)
BFS, DFS, Dijkstra, Binary Search, Recursion Trees — animated traversals with node highlighting.

### 🧩 Dynamic Programming (5 problems)
0/1 Knapsack, Coin Change, LCS, Unique Paths, Fibonacci — watch the DP table fill cell by cell.

### 🔙 Backtracking (4 problems)
N-Queens, Sudoku Solver, Maze Generation, Rat in a Maze — see every placement and backtrack live.

### 🏁 Race Mode
6 algorithms compete on the same data. Winner gets the trophy.

### 🗺️ Pathfinding Grid
Draw walls, place start/end, run BFS/DFS/A*/Dijkstra on an interactive grid.

### 🧠 DSA Patterns (17 patterns)
Sliding Window, Two Pointers, Fast/Slow Pointers, Merge Intervals, Cyclic Sort, Tree BFS, Tree DFS, Modified Binary Search, Top K Elements, Monotonic Stack, Subsets/Backtracking, Union-Find, **Prefix Sum**, **Kadane's Algorithm**, **Topological Sort**, **Greedy**, **Bit Manipulation** — each with template code and LeetCode links.

### Extra Features
- 🔊 Sound/Audio for sorting (musical tones based on bar values)
- 💡 Line-by-line code highlighting synced with animation
- 📸 Export visualization as PNG
- 📋 LeetCode problem mapping for every algorithm
- Multi-language code (JS, Python, C++, Java)
- Complexity analysis (best/avg/worst/space/stable)

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/algovis.git
cd algovis
python3 -m http.server 8080
# Open http://localhost:8080
```

No build step needed. It's plain HTML + CSS + JS.

---

## Deploy to GitHub Pages

### Method 1: GitHub Actions (Recommended)

The repo includes a workflow file at `.github/workflows/deploy.yml`. It auto-deploys on every push to `main`.

1. **Create a GitHub repository**
   ```bash
   cd algovis
   git init
   git add .
   git commit -m "Initial commit — AlgoVis DSA Visualizer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/algovis.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Click **Settings** → **Pages** (left sidebar)
   - Under "Source", select **GitHub Actions**
   - That's it — the workflow file handles the rest

3. **Your site is live at:**
   ```
   https://YOUR_USERNAME.github.io/algovis/
   ```

### Method 2: Manual (from branch)

1. Push to GitHub (same `git` commands above)
2. Go to **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes, your site is live

### Custom Domain (Optional)

If you want `algovis.yourdomain.com`:
1. Add a `CNAME` file in the root with your domain: `algovis.yourdomain.com`
2. In your DNS provider, add a CNAME record pointing to `YOUR_USERNAME.github.io`
3. In GitHub → Settings → Pages → Custom domain, enter your domain

---

## Project Structure

```
algovis/
├── index.html              # Main HTML (all views)
├── css/
│   └── style.css           # Dark theme design system
├── js/
│   ├── app.js              # Main controller (2200+ lines)
│   ├── sorting.js          # 12 sorting algorithms + code snippets
│   ├── datastructures.js   # 8 DS visualizers (canvas-based)
│   ├── algorithms.js       # BFS, DFS, Dijkstra, Binary Search
│   ├── extras.js           # Sound engine + Pathfinding engine
│   ├── patterns.js         # 17 DSA patterns + LeetCode mapping
│   └── dp-backtrack.js     # DP (5 problems) + Backtracking (4 problems)
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy to GitHub Pages
└── README.md
```

## Tech Stack

- **Zero dependencies** — no npm, no webpack, no React
- **Vanilla JS** — ES6+ classes, async/await, Web Audio API
- **Canvas 2D** — all visualizations rendered on `<canvas>`
- **GitHub Pages** — static hosting, auto-deploy via Actions

## License

MIT — free to use, fork, and modify for educational purposes.
