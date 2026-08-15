# AlgoVis — Feature Checklist

## ✅ Already Built

- [x] 12 sorting algorithms with animation
- [x] 8 data structures (Array, Linked List, Stack, Queue, BST, Heap, Graph, Hash Table)
- [x] Graph algorithms (BFS, DFS, Dijkstra, Binary Search, Recursion Trees)
- [x] Race mode (6 algorithms side-by-side)
- [x] Multi-language code (JS, Python, C++, Java)
- [x] Pseudocode display
- [x] Complexity analysis (best/avg/worst/space/stable)
- [x] Step-by-step mode, pause, resume
- [x] Speed and size controls
- [x] Dark theme with distinctive design
- [x] Card-grid navigation
- [x] GitHub Pages deployment workflow

---

## 🔲 Features To Add

### 1. 🔊 Sound/Audio for Sorting
**What:** Each bar plays a musical tone based on its value during the animation. Higher bars = higher pitch.
**Why:** "Sounds of Sorting" went viral with 10M+ views. Audio makes patterns audible — you can *hear* when an algorithm is doing redundant work. Quick Sort sounds chaotic then suddenly clean. Merge Sort has a rhythmic pattern.
**How:** Web Audio API oscillator. Map bar value → frequency (200Hz–800Hz). Short beep on each compare/swap.
**Effort:** Small (~1hr)

### 2. 🧩 Dynamic Programming Visualization
**What:** Visualize the DP table filling up cell by cell for classic problems.
**Problems:**
  - 0/1 Knapsack (weight/value grid)
  - Longest Common Subsequence (2D grid with arrows)
  - Coin Change (1D table)
  - Grid Paths / Unique Paths (grid with path highlight)
  - Fibonacci (1D with overlapping subproblems)
**Why:** DP is the #1 topic students struggle with. Seeing the table fill in order makes the recurrence relation click.
**How:** Canvas grid visualization. Highlight the current cell + the cells it depends on. Animate the fill order.
**Effort:** Large (~4-6hr)

### 3. 🔙 Backtracking Visualization
**What:** Show the recursion tree + state as the algorithm tries options and backtracks.
**Problems:**
  - N-Queens (chessboard with queen placement/removal)
  - Sudoku Solver (grid with number placement + backtracking)
  - Maze Generation (DFS-based, carve passages)
  - Rat in a Maze (grid pathfinding with dead ends)
**Why:** Backtracking is hard because you can't see the "undo" step. Visualization shows WHY we backtrack.
**How:** Split view: recursion tree on left + problem state (board/grid) on right. Highlight current branch, fade failed branches.
**Effort:** Large (~4-6hr)

### 4. 🗺️ Pathfinding on a Grid (A*, BFS, DFS)
**What:** Interactive grid where users draw walls, place start/end points, then watch pathfinding algorithms find the shortest path.
**Algorithms:** BFS, DFS, Dijkstra, A* (with Manhattan heuristic)
**Why:** Game dev students, robotics, and anyone studying graph algorithms needs this. It's the most "tactile" DSA visualization — you draw the problem yourself.
**How:** Click-and-drag to draw walls. Select algorithm. Animate cell exploration (frontier expansion) then trace the final path.
**Effort:** Large (~4-5hr)

### 5. 💡 Line-by-Line Code Highlighting
**What:** As the animation runs, the *current executing line* lights up in the code panel. The code scrolls to stay visible.
**Why:** This connects the visual animation to the actual code. Students can see "THIS line caused THAT animation." Most requested feature on r/leetcode.
**How:** Tag each code line with a step ID. When the animation is at step N, highlight line N in the code block. Add a glowing left border + background color.
**Effort:** Medium (~2-3hr)

### 6. 📋 LeetCode Problem Mapping
**What:** For each algorithm/DS, show which LeetCode problems it applies to with difficulty tags.
**Examples:**
  - BFS → LC #200 Number of Islands (Medium), LC #102 Binary Tree Level Order (Medium)
  - Binary Search → LC #33 Search in Rotated Array (Medium), LC #4 Median of Two Sorted (Hard)
  - Two Pointers → LC #1 Two Sum (Easy), LC #15 3Sum (Medium)
**Why:** Students studying for interviews want to know "where does this actually show up?" This bridges theory to practice.
**How:** Static data mapping. Show as a collapsible list below the algorithm description. Link to LeetCode.
**Effort:** Small (~1-2hr content work)

### 7. 📸 Export / Screenshot
**What:** Download a screenshot of the current visualization state as PNG.
**Why:** Students want to embed visualizations in their notes, slides, and study guides.
**How:** Canvas `toDataURL()` for the visualization. For the full page, use `html2canvas` from CDN.
**Effort:** Small (~30min)

### 8. 🧠 DSA Problem-Solving Patterns
**What:** A new section teaching the 10-12 recurring patterns that solve 80% of DSA problems.
**Patterns:**
  - Sliding Window (fixed/variable)
  - Two Pointers (sorted arrays, palindromes)
  - Fast & Slow Pointers (cycle detection)
  - Merge Intervals
  - Cyclic Sort (numbers 1..N)
  - In-place Reversal of LinkedList
  - Tree BFS / DFS
  - Modified Binary Search
  - Top K Elements (heap)
  - Subsets (BFS/backtracking)
  - Monotonic Stack
  - Union-Find
**Each pattern includes:** Explanation, when to use it, visual diagram, 3-5 example problems, template code.
**Why:** This is what separates "grinding LeetCode" from "understanding patterns." Grokking the Coding Interview (paid course) makes $$$$ teaching exactly this. Making it free + visual is a killer feature.
**Effort:** Medium-Large (~3-4hr)

---

## Implementation Priority

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| 🔴 P0 | Sound/Audio | High | Low |
| 🔴 P0 | Line-by-line code highlight | High | Medium |
| 🟡 P1 | Pathfinding Grid | Very High | Large |
| 🟡 P1 | DSA Patterns | Very High | Medium-Large |
| 🟡 P1 | LeetCode Mapping | High | Low |
| 🟢 P2 | Export/Screenshot | Medium | Low |
| 🟢 P2 | Dynamic Programming | Very High | Large |
| 🟢 P2 | Backtracking | Very High | Large |
