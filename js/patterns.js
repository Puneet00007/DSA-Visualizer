/* ============================================
   DSA Problem-Solving Patterns + LeetCode Map
   ============================================ */

const DSAPatterns = [
    {
        id: 'sliding-window',
        name: 'Sliding Window',
        icon: '↔',
        color: '#3b82f6',
        when: 'When asked to find a contiguous subarray or substring that satisfies some condition (longest, shortest, contains X).',
        desc: 'Maintain a window [left, right] that slides over the array. Expand right to include new elements, shrink left when the window becomes invalid.',
        template: `function slidingWindow(arr) {
    let left = 0, result = 0;
    for (let right = 0; right < arr.length; right++) {
        // add arr[right] to window state
        while (/* window is invalid */) {
            // remove arr[left] from window state
            left++;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
        problems: [
            { name: 'Longest Substring Without Repeating Characters', lc: 3, diff: 'Medium' },
            { name: 'Minimum Size Subarray Sum', lc: 209, diff: 'Medium' },
            { name: 'Permutation in String', lc: 567, diff: 'Medium' },
            { name: 'Max Consecutive Ones III', lc: 1004, diff: 'Medium' },
        ]
    },
    {
        id: 'two-pointers',
        name: 'Two Pointers',
        icon: '→←',
        color: '#f59e0b',
        when: 'Sorted arrays, finding pairs with a target sum, palindromes, removing duplicates in-place.',
        desc: 'Use two indices moving through the array — either both from the start at different speeds, or one from each end moving toward the middle.',
        template: `function twoPointers(arr) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        const sum = arr[left] + arr[right];
        if (sum === target) return [left, right];
        else if (sum < target) left++;
        else right--;
    }
}`,
        problems: [
            { name: 'Two Sum II (Sorted)', lc: 167, diff: 'Medium' },
            { name: '3Sum', lc: 15, diff: 'Medium' },
            { name: 'Container With Most Water', lc: 11, diff: 'Medium' },
            { name: 'Valid Palindrome', lc: 125, diff: 'Easy' },
        ]
    },
    {
        id: 'fast-slow',
        name: 'Fast & Slow Pointers',
        icon: '🐇🐢',
        color: '#ec4899',
        when: 'Detecting cycles in linked lists or arrays, finding the middle element, palindrome in linked list.',
        desc: 'Two pointers move at different speeds. If there is a cycle, the fast pointer will eventually catch up to the slow pointer.',
        template: `function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}`,
        problems: [
            { name: 'Linked List Cycle', lc: 141, diff: 'Easy' },
            { name: 'Linked List Cycle II', lc: 142, diff: 'Medium' },
            { name: 'Happy Number', lc: 202, diff: 'Easy' },
            { name: 'Middle of Linked List', lc: 876, diff: 'Easy' },
        ]
    },
    {
        id: 'merge-intervals',
        name: 'Merge Intervals',
        icon: '⊔',
        color: '#a855f7',
        when: 'Given a set of intervals, find overlapping ones, merge them, or find gaps.',
        desc: 'Sort intervals by start time. Iterate through and merge any overlapping intervals into a single interval.',
        template: `function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            merged.push(intervals[i]);
        }
    }
    return merged;
}`,
        problems: [
            { name: 'Merge Intervals', lc: 56, diff: 'Medium' },
            { name: 'Insert Interval', lc: 57, diff: 'Medium' },
            { name: 'Non-overlapping Intervals', lc: 435, diff: 'Medium' },
            { name: 'Meeting Rooms II', lc: 253, diff: 'Medium' },
        ]
    },
    {
        id: 'cyclic-sort',
        name: 'Cyclic Sort',
        icon: '🔄',
        color: '#10b981',
        when: 'Array contains numbers in a range [1, N] or [0, N]. Find missing/duplicate numbers.',
        desc: 'Place each number at its correct index (arr[i] should be at index arr[i]-1). After sorting in-place, find which positions are wrong.',
        template: `function cyclicSort(arr) {
    let i = 0;
    while (i < arr.length) {
        const correct = arr[i] - 1;
        if (arr[i] !== arr[correct]) {
            [arr[i], arr[correct]] = [arr[correct], arr[i]];
        } else {
            i++;
        }
    }
    // Find the missing/wrong number
}`,
        problems: [
            { name: 'Missing Number', lc: 268, diff: 'Easy' },
            { name: 'Find All Duplicates', lc: 442, diff: 'Medium' },
            { name: 'Find All Missing', lc: 448, diff: 'Easy' },
            { name: 'First Missing Positive', lc: 41, diff: 'Hard' },
        ]
    },
    {
        id: 'tree-bfs',
        name: 'Tree BFS',
        icon: '🌳',
        color: '#06b6d4',
        when: 'Level-order traversal, finding minimum depth, zigzag traversal, right/left view.',
        desc: 'Use a queue. Process all nodes at the current level, then add their children for the next level.',
        template: `function levelOrder(root) {
    if (!root) return [];
    const queue = [root], result = [];
    while (queue.length) {
        const levelSize = queue.length;
        const level = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
}`,
        problems: [
            { name: 'Binary Tree Level Order', lc: 102, diff: 'Medium' },
            { name: 'Minimum Depth of Binary Tree', lc: 111, diff: 'Easy' },
            { name: 'Binary Tree Zigzag', lc: 103, diff: 'Medium' },
            { name: 'Right Side View', lc: 199, diff: 'Medium' },
        ]
    },
    {
        id: 'tree-dfs',
        name: 'Tree DFS',
        icon: '🌲',
        color: '#f97316',
        when: 'Path sum problems, checking if a path exists, finding all root-to-leaf paths.',
        desc: 'Recurse into left and right subtrees. Process each node on the way down (pre-order), on the way up (post-order), or in the middle (in-order).',
        template: `function hasPathSum(root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) {
        return targetSum === root.val;
    }
    return hasPathSum(root.left, targetSum - root.val)
        || hasPathSum(root.right, targetSum - root.val);
}`,
        problems: [
            { name: 'Path Sum', lc: 112, diff: 'Easy' },
            { name: 'Path Sum II', lc: 113, diff: 'Medium' },
            { name: 'Binary Tree Max Path Sum', lc: 124, diff: 'Hard' },
            { name: 'Diameter of Binary Tree', lc: 543, diff: 'Easy' },
        ]
    },
    {
        id: 'modified-binary-search',
        name: 'Modified Binary Search',
        icon: '🔍',
        color: '#ef4444',
        when: 'Sorted (or rotated sorted) arrays, finding boundaries, search in infinite arrays.',
        desc: 'Standard binary search with modifications for rotated arrays, finding first/last occurrence, or searching on an answer.',
        template: `function searchRotated(arr, target) {
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (arr[mid] === target) return mid;
        if (arr[lo] <= arr[mid]) {
            if (arr[lo] <= target < arr[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (arr[mid] < target <= arr[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
        problems: [
            { name: 'Search in Rotated Array', lc: 33, diff: 'Medium' },
            { name: 'Find Minimum in Rotated', lc: 153, diff: 'Medium' },
            { name: 'Koko Eating Bananas', lc: 875, diff: 'Medium' },
            { name: 'Median of Two Sorted Arrays', lc: 4, diff: 'Hard' },
        ]
    },
    {
        id: 'top-k',
        name: 'Top K Elements',
        icon: '📊',
        color: '#8b5cf6',
        when: 'Find the K largest/smallest/most frequent elements.',
        desc: 'Use a min-heap (or max-heap) of size K. Push elements in, pop when size exceeds K. The heap always holds the top K.',
        template: `function topKFrequent(nums, k) {
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;
    // Use a min-heap of size k
    // Or: bucket sort by frequency
    const buckets = Array(nums.length + 1).fill(null).map(() => []);
    for (const [num, count] of Object.entries(freq))
        buckets[count].push(+num);
    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--)
        result.push(...buckets[i]);
    return result.slice(0, k);
}`,
        problems: [
            { name: 'Kth Largest Element', lc: 215, diff: 'Medium' },
            { name: 'Top K Frequent Elements', lc: 347, diff: 'Medium' },
            { name: 'K Closest Points to Origin', lc: 973, diff: 'Medium' },
            { name: 'Find K Pairs with Smallest Sums', lc: 373, diff: 'Medium' },
        ]
    },
    {
        id: 'monotonic-stack',
        name: 'Monotonic Stack',
        icon: '📚',
        color: '#14b8a6',
        when: 'Find next greater/smaller element, stock span, largest rectangle in histogram.',
        desc: 'Maintain a stack that is always sorted (increasing or decreasing). When a new element would violate the order, pop elements and process them.',
        template: `function nextGreater(arr) {
    const stack = [], result = Array(arr.length).fill(-1);
    for (let i = 0; i < arr.length; i++) {
        while (stack.length && arr[stack.top()] < arr[i]) {
            result[stack.pop()] = arr[i];
        }
        stack.push(i);
    }
    return result;
}`,
        problems: [
            { name: 'Next Greater Element I', lc: 496, diff: 'Easy' },
            { name: 'Daily Temperatures', lc: 739, diff: 'Medium' },
            { name: 'Largest Rectangle in Histogram', lc: 84, diff: 'Hard' },
            { name: 'Trapping Rain Water', lc: 42, diff: 'Hard' },
        ]
    },
    {
        id: 'subsets',
        name: 'Subsets / Backtracking',
        icon: '{ }',
        color: '#e879f9',
        when: 'Generate all subsets, permutations, or combinations. "Find all ways to..."',
        desc: 'Use backtracking: at each step, decide whether to include the current element or not. Recurse, then undo the choice.',
        template: `function subsets(nums) {
    const result = [];
    function backtrack(start, current) {
        result.push([...current]);
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop(); // undo
        }
    }
    backtrack(0, []);
    return result;
}`,
        problems: [
            { name: 'Subsets', lc: 78, diff: 'Medium' },
            { name: 'Permutations', lc: 46, diff: 'Medium' },
            { name: 'Combination Sum', lc: 39, diff: 'Medium' },
            { name: 'Word Search', lc: 79, diff: 'Medium' },
        ]
    },
    {
        id: 'union-find',
        name: 'Union-Find (Disjoint Set)',
        icon: '🔗',
        color: '#f43f5e',
        when: 'Connected components, detecting cycles in graphs, Kruskal\'s MST.',
        desc: 'Each element belongs to a set represented by a root. "Find" gets the root, "Union" merges two sets. Path compression + union by rank gives near O(1).',
        template: `class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = Array(n).fill(0);
    }
    find(x) {
        if (this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    union(x, y) {
        const px = this.find(x), py = this.find(y);
        if (px === py) return false;
        if (this.rank[px] < this.rank[py]) this.parent[px] = py;
        else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
        else { this.parent[py] = px; this.rank[px]++; }
        return true;
    }
}`,
        problems: [
            { name: 'Number of Islands (UF approach)', lc: 200, diff: 'Medium' },
            { name: 'Redundant Connection', lc: 684, diff: 'Medium' },
            { name: 'Accounts Merge', lc: 721, diff: 'Medium' },
            { name: 'Graph Valid Tree', lc: 261, diff: 'Medium' },
        ]
    },
    {
        id: 'prefix-sum',
        name: 'Prefix Sum',
        icon: 'Σ',
        color: '#0ea5e9',
        when: 'Range sum queries, subarray sum equals K, product of array except self.',
        desc: 'Precompute cumulative sums so that any range sum can be answered in O(1). prefix[i] = sum of arr[0..i-1]. Range sum [l, r] = prefix[r+1] - prefix[l].',
        template: `// Prefix Sum
const prefix = new Array(n + 1).fill(0);
for (let i = 0; i < n; i++)
    prefix[i + 1] = prefix[i] + arr[i];

// Range sum [l, r] in O(1)
function rangeSum(l, r) {
    return prefix[r + 1] - prefix[l];
}

// Subarray Sum Equals K (with HashMap)
function subarraySum(nums, k) {
    const map = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const num of nums) {
        sum += num;
        if (map.has(sum - k))
            count += map.get(sum - k);
        map.set(sum, (map.get(sum) || 0) + 1);
    }
    return count;
}`,
        problems: [
            { name: 'Subarray Sum Equals K', lc: 560, diff: 'Medium' },
            { name: 'Product of Array Except Self', lc: 238, diff: 'Medium' },
            { name: 'Range Sum Query (Immutable)', lc: 303, diff: 'Easy' },
            { name: 'Contiguous Array', lc: 525, diff: 'Medium' },
        ]
    },
    {
        id: 'kadanes',
        name: "Kadane's Algorithm",
        icon: '📈',
        color: '#22c55e',
        when: 'Maximum subarray sum, maximum circular subarray, max product subarray.',
        desc: 'Track the maximum subarray ending at each position. At each step, either extend the previous subarray or start a new one from the current element.',
        template: `function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend or start fresh
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
        problems: [
            { name: 'Maximum Subarray', lc: 53, diff: 'Medium' },
            { name: 'Maximum Product Subarray', lc: 152, diff: 'Medium' },
            { name: 'Maximum Sum Circular Subarray', lc: 918, diff: 'Medium' },
            { name: 'Longest Turbulent Subarray', lc: 978, diff: 'Medium' },
        ]
    },
    {
        id: 'topological-sort',
        name: 'Topological Sort',
        icon: '↓',
        color: '#d946ef',
        when: 'Task ordering, course prerequisites, build systems, dependency resolution. DAG only.',
        desc: 'Linear ordering of vertices such that for every directed edge u→v, u comes before v. Use BFS (Kahn\'s algorithm with in-degree) or DFS (post-order).',
        template: `// Kahn's Algorithm (BFS)
function topologicalSort(numCourses, prerequisites) {
    const adj = Array.from({length: numCourses}, () => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (const [course, pre] of prerequisites) {
        adj[pre].push(course);
        inDegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++)
        if (inDegree[i] === 0) queue.push(i);
    
    const order = [];
    while (queue.length) {
        const node = queue.shift();
        order.push(node);
        for (const next of adj[node]) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
        }
    }
    
    return order.length === numCourses ? order : [];
}`,
        problems: [
            { name: 'Course Schedule', lc: 207, diff: 'Medium' },
            { name: 'Course Schedule II', lc: 210, diff: 'Medium' },
            { name: 'Alien Dictionary', lc: 269, diff: 'Hard' },
            { name: 'Sequence Reconstruction', lc: 444, diff: 'Medium' },
        ]
    },
    {
        id: 'greedy',
        name: 'Greedy',
        icon: '🎯',
        color: '#eab308',
        when: 'Activity selection, jump game, task scheduling, minimum platforms. Local optimal = global optimal.',
        desc: 'Make the locally optimal choice at each step, hoping it leads to a globally optimal solution. Works when greedy choice property holds — no need to revisit decisions.',
        template: `// Activity Selection (max non-overlapping)
function maxActivities(start, end) {
    const n = start.length;
    const activities = Array.from({length: n}, (_, i) => i);
    activities.sort((a, b) => end[a] - end[b]);
    
    let count = 1, lastEnd = end[activities[0]];
    for (let i = 1; i < n; i++) {
        const idx = activities[i];
        if (start[idx] >= lastEnd) {
            count++;
            lastEnd = end[idx];
        }
    }
    return count;
}

// Jump Game
function canJump(nums) {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}`,
        problems: [
            { name: 'Jump Game', lc: 55, diff: 'Medium' },
            { name: 'Jump Game II', lc: 45, diff: 'Medium' },
            { name: 'Assign Cookies', lc: 455, diff: 'Easy' },
            { name: 'Minimum Number of Arrows', lc: 452, diff: 'Medium' },
        ]
    },
    {
        id: 'bit-manipulation',
        name: 'Bit Manipulation',
        icon: '01',
        color: '#64748b',
        when: 'Finding single number, counting bits, power of two, XOR tricks. O(1) space problems.',
        desc: 'Use bitwise operators (AND, OR, XOR, shifts) to solve problems in O(1) space. Key trick: a XOR a = 0, a XOR 0 = a. XOR cancels pairs, leaving the odd one out.',
        template: `// Single Number (XOR all)
function singleNumber(nums) {
    let result = 0;
    for (const n of nums) result ^= n;
    return result;
}

// Count Set Bits (Brian Kernighan)
function countBits(n) {
    let count = 0;
    while (n > 0) {
        n &= (n - 1); // clears lowest set bit
        count++;
    }
    return count;
}

// Power of Two
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}`,
        problems: [
            { name: 'Single Number', lc: 136, diff: 'Easy' },
            { name: 'Counting Bits', lc: 338, diff: 'Easy' },
            { name: 'Number of 1 Bits', lc: 191, diff: 'Easy' },
            { name: 'Missing Number', lc: 268, diff: 'Easy' },
        ]
    },
];

// LeetCode Mapping by Algorithm
const LeetCodeMap = {
    bubble: [],
    selection: [],
    insertion: [],
    merge: [
        { name: 'Merge Two Sorted Lists', lc: 21, diff: 'Easy' },
        { name: 'Sort List', lc: 148, diff: 'Medium' },
        { name: 'Merge k Sorted Lists', lc: 23, diff: 'Hard' },
    ],
    quick: [
        { name: 'Kth Largest Element', lc: 215, diff: 'Medium' },
        { name: 'Sort Colors', lc: 75, diff: 'Medium' },
    ],
    heap: [
        { name: 'Kth Largest Element', lc: 215, diff: 'Medium' },
        { name: 'Top K Frequent', lc: 347, diff: 'Medium' },
        { name: 'Find Median from Data Stream', lc: 295, diff: 'Hard' },
    ],
    radix: [],
    counting: [
        { name: 'H-Index', lc: 274, diff: 'Medium' },
    ],
    shell: [],
    cocktail: [],
    comb: [],
    tim: [],
    array: [
        { name: 'Two Sum', lc: 1, diff: 'Easy' },
        { name: 'Best Time to Buy and Sell Stock', lc: 121, diff: 'Easy' },
        { name: 'Contains Duplicate', lc: 217, diff: 'Easy' },
    ],
    linkedlist: [
        { name: 'Reverse Linked List', lc: 206, diff: 'Easy' },
        { name: 'Merge Two Sorted Lists', lc: 21, diff: 'Easy' },
        { name: 'Linked List Cycle', lc: 141, diff: 'Easy' },
        { name: 'Remove Nth Node From End', lc: 19, diff: 'Medium' },
    ],
    stack: [
        { name: 'Valid Parentheses', lc: 20, diff: 'Easy' },
        { name: 'Min Stack', lc: 155, diff: 'Medium' },
        { name: 'Evaluate Reverse Polish Notation', lc: 150, diff: 'Medium' },
        { name: 'Daily Temperatures', lc: 739, diff: 'Medium' },
    ],
    queue: [
        { name: 'Implement Queue using Stacks', lc: 232, diff: 'Easy' },
        { name: 'Sliding Window Maximum', lc: 239, diff: 'Hard' },
    ],
    bst: [
        { name: 'Validate BST', lc: 98, diff: 'Medium' },
        { name: 'Lowest Common Ancestor of BST', lc: 235, diff: 'Medium' },
        { name: 'Kth Smallest in BST', lc: 230, diff: 'Medium' },
        { name: 'Invert Binary Tree', lc: 226, diff: 'Easy' },
    ],
    graph: [
        { name: 'Number of Islands', lc: 200, diff: 'Medium' },
        { name: 'Clone Graph', lc: 133, diff: 'Medium' },
        { name: 'Course Schedule', lc: 207, diff: 'Medium' },
        { name: 'Pacific Atlantic Water Flow', lc: 417, diff: 'Medium' },
    ],
    hashtable: [
        { name: 'Two Sum', lc: 1, diff: 'Easy' },
        { name: 'Group Anagrams', lc: 49, diff: 'Medium' },
        { name: 'Top K Frequent', lc: 347, diff: 'Medium' },
        { name: 'Longest Consecutive', lc: 128, diff: 'Medium' },
    ],
    bfs: [
        { name: 'Number of Islands', lc: 200, diff: 'Medium' },
        { name: 'Rotting Oranges', lc: 994, diff: 'Medium' },
        { name: 'Word Ladder', lc: 127, diff: 'Hard' },
        { name: 'Binary Tree Level Order', lc: 102, diff: 'Medium' },
    ],
    dfs: [
        { name: 'Number of Islands', lc: 200, diff: 'Medium' },
        { name: 'Surrounded Regions', lc: 130, diff: 'Medium' },
        { name: 'Path Sum', lc: 112, diff: 'Easy' },
        { name: 'Max Area of Island', lc: 695, diff: 'Medium' },
    ],
    binarysearch: [
        { name: 'Binary Search', lc: 704, diff: 'Easy' },
        { name: 'Search in Rotated Array', lc: 33, diff: 'Medium' },
        { name: 'Find Minimum in Rotated', lc: 153, diff: 'Medium' },
        { name: 'Search a 2D Matrix', lc: 74, diff: 'Medium' },
    ],
    dijkstra: [
        { name: 'Network Delay Time', lc: 743, diff: 'Medium' },
        { name: 'Path with Minimum Effort', lc: 1631, diff: 'Medium' },
        { name: 'Cheapest Flights Within K Stops', lc: 787, diff: 'Medium' },
    ],
    recursion: [
        { name: 'Fibonacci Number', lc: 509, diff: 'Easy' },
        { name: 'Climbing Stairs', lc: 70, diff: 'Easy' },
        { name: 'Power(x, n)', lc: 50, diff: 'Medium' },
    ],
};

window.DSAPatterns = DSAPatterns;
window.LeetCodeMap = LeetCodeMap;
