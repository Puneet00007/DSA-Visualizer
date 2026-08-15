/* ============================================
   SORTING ALGORITHMS MODULE
   ============================================ */

class SortingAlgorithms {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.arrayAccesses = 0;
        this.steps = [];
        this.paused = false;
        this.cancelled = false;
    }

    reset() {
        this.comparisons = 0;
        this.swaps = 0;
        this.arrayAccesses = 0;
        this.steps = [];
        this.paused = false;
        this.cancelled = false;
    }

    recordCompare(indices) {
        this.comparisons++;
        this.arrayAccesses += 2;
        this.steps.push({ type: 'compare', indices, comparisons: this.comparisons, swaps: this.swaps, accesses: this.arrayAccesses });
    }

    recordSwap(indices) {
        this.swaps++;
        this.arrayAccesses += 4;
        this.steps.push({ type: 'swap', indices, comparisons: this.comparisons, swaps: this.swaps, accesses: this.arrayAccesses });
    }

    recordSorted(indices) {
        this.steps.push({ type: 'sorted', indices, comparisons: this.comparisons, swaps: this.swaps, accesses: this.arrayAccesses });
    }

    recordPivot(index) {
        this.steps.push({ type: 'pivot', indices: [index], comparisons: this.comparisons, swaps: this.swaps, accesses: this.arrayAccesses });
    }

    recordActive(indices) {
        this.steps.push({ type: 'active', indices, comparisons: this.comparisons, swaps: this.swaps, accesses: this.arrayAccesses });
    }

    // ========== BUBBLE SORT ==========
    async bubbleSort(arr) {
        this.reset();
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (this.cancelled) return arr;
                this.recordCompare([j, j + 1]);
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.recordSwap([j, j + 1]);
                    swapped = true;
                }
            }
            this.recordSorted([n - i - 1]);
            if (!swapped) break;
        }
        this.recordSorted([0]);
        return arr;
    }

    // ========== SELECTION SORT ==========
    async selectionSort(arr) {
        this.reset();
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.recordActive([minIdx]);
            for (let j = i + 1; j < n; j++) {
                if (this.cancelled) return arr;
                this.recordCompare([minIdx, j]);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                this.recordSwap([i, minIdx]);
            }
            this.recordSorted([i]);
        }
        this.recordSorted([n - 1]);
        return arr;
    }

    // ========== INSERTION SORT ==========
    async insertionSort(arr) {
        this.reset();
        const n = arr.length;
        this.recordSorted([0]);
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            this.recordActive([i]);
            while (j >= 0) {
                if (this.cancelled) return arr;
                this.recordCompare([j, j + 1]);
                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    this.arrayAccesses += 2;
                    this.recordSwap([j, j + 1]);
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
            this.arrayAccesses++;
            this.recordSorted(Array.from({ length: i + 1 }, (_, k) => k));
        }
        return arr;
    }

    // ========== MERGE SORT ==========
    async mergeSort(arr) {
        this.reset();
        await this._mergeSortHelper(arr, 0, arr.length - 1);
        this.recordSorted(Array.from({ length: arr.length }, (_, i) => i));
        return arr;
    }

    async _mergeSortHelper(arr, left, right) {
        if (left >= right || this.cancelled) return;
        const mid = Math.floor((left + right) / 2);
        await this._mergeSortHelper(arr, left, mid);
        await this._mergeSortHelper(arr, mid + 1, right);
        await this._merge(arr, left, mid, right);
    }

    async _merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (this.cancelled) return;
            this.recordCompare([left + i, mid + 1 + j]);
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                this.arrayAccesses++;
                i++;
            } else {
                arr[k] = rightArr[j];
                this.arrayAccesses++;
                j++;
            }
            this.recordActive([k]);
            k++;
        }

        while (i < leftArr.length) {
            if (this.cancelled) return;
            arr[k] = leftArr[i];
            this.arrayAccesses++;
            this.recordActive([k]);
            i++;
            k++;
        }

        while (j < rightArr.length) {
            if (this.cancelled) return;
            arr[k] = rightArr[j];
            this.arrayAccesses++;
            this.recordActive([k]);
            j++;
            k++;
        }
    }

    // ========== QUICK SORT ==========
    async quickSort(arr) {
        this.reset();
        await this._quickSortHelper(arr, 0, arr.length - 1);
        this.recordSorted(Array.from({ length: arr.length }, (_, i) => i));
        return arr;
    }

    async _quickSortHelper(arr, low, high) {
        if (low >= high || this.cancelled) return;
        const pivotIdx = await this._partition(arr, low, high);
        this.recordSorted([pivotIdx]);
        await this._quickSortHelper(arr, low, pivotIdx - 1);
        await this._quickSortHelper(arr, pivotIdx + 1, high);
    }

    async _partition(arr, low, high) {
        const pivot = arr[high];
        this.recordPivot(high);
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (this.cancelled) return low;
            this.recordCompare([j, high]);
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.recordSwap([i, j]);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.recordSwap([i + 1, high]);
        return i + 1;
    }

    // ========== HEAP SORT ==========
    async heapSort(arr) {
        this.reset();
        const n = arr.length;

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this._heapify(arr, n, i);
        }

        // Extract elements
        for (let i = n - 1; i > 0; i--) {
            if (this.cancelled) return arr;
            [arr[0], arr[i]] = [arr[i], arr[0]];
            this.recordSwap([0, i]);
            this.recordSorted([i]);
            await this._heapify(arr, i, 0);
        }
        this.recordSorted([0]);
        return arr;
    }

    async _heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            this.recordCompare([left, largest]);
            if (arr[left] > arr[largest]) largest = left;
        }

        if (right < n) {
            this.recordCompare([right, largest]);
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            this.recordSwap([i, largest]);
            await this._heapify(arr, n, largest);
        }
    }

    // ========== RADIX SORT (LSD) ==========
    async radixSort(arr) {
        this.reset();
        const n = arr.length;
        if (n === 0) return arr;
        const max = Math.max(...arr);

        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            if (this.cancelled) return arr;
            await this._countSortByDigit(arr, n, exp);
        }
        this.recordSorted(Array.from({ length: n }, (_, i) => i));
        return arr;
    }

    async _countSortByDigit(arr, n, exp) {
        const output = new Array(n);
        const count = new Array(10).fill(0);

        for (let i = 0; i < n; i++) {
            if (this.cancelled) return;
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            this.recordActive([i]);
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
            if (this.cancelled) return;
            const digit = Math.floor(arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
            this.arrayAccesses += 2;
        }

        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            this.recordActive([i]);
        }
    }

    // ========== COUNTING SORT ==========
    async countingSort(arr) {
        this.reset();
        const n = arr.length;
        if (n === 0) return arr;
        const max = Math.max(...arr);
        const min = Math.min(...arr);
        const range = max - min + 1;
        const count = new Array(range).fill(0);
        const output = new Array(n);

        for (let i = 0; i < n; i++) {
            if (this.cancelled) return arr;
            count[arr[i] - min]++;
            this.recordActive([i]);
        }

        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
            if (this.cancelled) return arr;
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
            this.arrayAccesses += 2;
        }

        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            this.recordSorted([i]);
        }

        return arr;
    }

    // ========== SHELL SORT ==========
    async shellSort(arr) {
        this.reset();
        const n = arr.length;
        let gap = Math.floor(n / 2);

        while (gap > 0) {
            for (let i = gap; i < n; i++) {
                if (this.cancelled) return arr;
                let temp = arr[i];
                let j = i;
                this.recordActive([i]);

                while (j >= gap) {
                    this.recordCompare([j - gap, j]);
                    if (arr[j - gap] > temp) {
                        arr[j] = arr[j - gap];
                        this.recordSwap([j, j - gap]);
                        j -= gap;
                    } else {
                        break;
                    }
                }
                arr[j] = temp;
                this.arrayAccesses++;
            }
            gap = Math.floor(gap / 2);
        }
        this.recordSorted(Array.from({ length: n }, (_, i) => i));
        return arr;
    }

    // ========== COCKTAIL SORT ==========
    async cocktailSort(arr) {
        this.reset();
        const n = arr.length;
        let swapped = true;
        let start = 0;
        let end = n - 1;

        while (swapped) {
            swapped = false;
            for (let i = start; i < end; i++) {
                if (this.cancelled) return arr;
                this.recordCompare([i, i + 1]);
                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    this.recordSwap([i, i + 1]);
                    swapped = true;
                }
            }
            this.recordSorted([end]);
            end--;

            if (!swapped) break;
            swapped = false;

            for (let i = end; i > start; i--) {
                if (this.cancelled) return arr;
                this.recordCompare([i, i - 1]);
                if (arr[i] < arr[i - 1]) {
                    [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                    this.recordSwap([i, i - 1]);
                    swapped = true;
                }
            }
            this.recordSorted([start]);
            start++;
        }
        this.recordSorted(Array.from({ length: n }, (_, i) => i));
        return arr;
    }

    // ========== COMB SORT ==========
    async combSort(arr) {
        this.reset();
        const n = arr.length;
        let gap = n;
        const shrink = 1.3;
        let sorted = false;

        while (!sorted) {
            gap = Math.floor(gap / shrink);
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            }

            for (let i = 0; i + gap < n; i++) {
                if (this.cancelled) return arr;
                this.recordCompare([i, i + gap]);
                if (arr[i] > arr[i + gap]) {
                    [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                    this.recordSwap([i, i + gap]);
                    sorted = false;
                }
            }
        }
        this.recordSorted(Array.from({ length: n }, (_, i) => i));
        return arr;
    }

    // ========== TIM SORT (simplified) ==========
    async timSort(arr) {
        this.reset();
        const n = arr.length;
        const RUN = 32;

        // Sort individual subarrays of size RUN using insertion sort
        for (let i = 0; i < n; i += RUN) {
            const end = Math.min(i + RUN - 1, n - 1);
            for (let j = i + 1; j <= end; j++) {
                if (this.cancelled) return arr;
                let key = arr[j];
                let k = j - 1;
                this.recordActive([j]);
                while (k >= i && arr[k] > key) {
                    this.recordCompare([k, k + 1]);
                    arr[k + 1] = arr[k];
                    this.recordSwap([k, k + 1]);
                    k--;
                }
                arr[k + 1] = key;
                this.arrayAccesses++;
            }
        }

        // Merge runs
        for (let size = RUN; size < n; size = 2 * size) {
            for (let left = 0; left < n; left += 2 * size) {
                const mid = Math.min(left + size - 1, n - 1);
                const right = Math.min(left + 2 * size - 1, n - 1);
                if (mid < right) {
                    await this._merge(arr, left, mid, right);
                }
            }
        }

        this.recordSorted(Array.from({ length: n }, (_, i) => i));
        return arr;
    }

    getAlgoInfo(name) {
        const info = {
            bubble: {
                name: 'Bubble Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: true,
                description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
                howItWorks: [
                    'Compare each pair of adjacent elements from the beginning',
                    'If a pair is in wrong order, swap them',
                    'After each pass, the largest unsorted element "bubbles up" to its correct position',
                    'Repeat until no swaps are needed'
                ]
            },
            selection: {
                name: 'Selection Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n²)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: false,
                description: 'Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region.',
                howItWorks: [
                    'Find the minimum element in the unsorted portion',
                    'Swap it with the first unsorted element',
                    'Move the boundary of the sorted portion one element to the right',
                    'Repeat until the entire array is sorted'
                ]
            },
            insertion: {
                name: 'Insertion Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: true,
                description: 'Insertion Sort builds the final sorted array one item at a time. It picks each element and inserts it into its correct position among the previously sorted elements.',
                howItWorks: [
                    'Start from the second element (index 1)',
                    'Compare it with elements before it',
                    'Shift larger elements one position to the right',
                    'Insert the element at its correct position'
                ]
            },
            merge: {
                name: 'Merge Sort',
                badge: 'Divide & Conquer',
                badgeClass: 'badge-comparison',
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n log n)',
                space: 'O(n)',
                stable: true,
                description: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves back together.',
                howItWorks: [
                    'Divide the array into two halves',
                    'Recursively sort each half',
                    'Merge the two sorted halves into one sorted array',
                    'Base case: array of size 1 is already sorted'
                ]
            },
            quick: {
                name: 'Quick Sort',
                badge: 'Divide & Conquer',
                badgeClass: 'badge-comparison',
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n²)',
                space: 'O(log n)',
                stable: false,
                description: 'Quick Sort picks a pivot element and partitions the array around it, so that all elements smaller than the pivot come before it and all larger elements come after it. It then recursively sorts the sub-arrays.',
                howItWorks: [
                    'Choose a pivot element (last element shown)',
                    'Partition: rearrange so smaller elements are left of pivot, larger are right',
                    'Pivot is now in its final sorted position',
                    'Recursively apply to left and right sub-arrays'
                ]
            },
            heap: {
                name: 'Heap Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n log n)',
                space: 'O(1)',
                stable: false,
                description: 'Heap Sort uses a binary heap data structure. It first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end.',
                howItWorks: [
                    'Build a max heap from the array',
                    'The largest element is at the root',
                    'Swap root with the last element, reduce heap size',
                    'Heapify the root to restore heap property',
                    'Repeat until heap size is 1'
                ]
            },
            radix: {
                name: 'Radix Sort',
                badge: 'Non-Comparison',
                badgeClass: 'badge-linear',
                best: 'O(nk)',
                average: 'O(nk)',
                worst: 'O(nk)',
                space: 'O(n + k)',
                stable: true,
                description: 'Radix Sort processes each digit of the numbers, from least significant to most significant, using a stable counting sort as a subroutine.',
                howItWorks: [
                    'Find the maximum number to know number of digits',
                    'For each digit position (ones, tens, hundreds...)',
                    'Use counting sort to sort by that digit',
                    'After processing all digits, array is sorted'
                ]
            },
            counting: {
                name: 'Counting Sort',
                badge: 'Non-Comparison',
                badgeClass: 'badge-linear',
                best: 'O(n + k)',
                average: 'O(n + k)',
                worst: 'O(n + k)',
                space: 'O(k)',
                stable: true,
                description: 'Counting Sort works by counting the occurrences of each unique element, then using these counts to determine the positions of each element in the sorted output.',
                howItWorks: [
                    'Count the frequency of each element',
                    'Compute cumulative counts',
                    'Place each element in its correct position based on counts',
                    'Works best when range of values (k) is not significantly greater than n'
                ]
            },
            shell: {
                name: 'Shell Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n log n)',
                average: 'O(n^1.3)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: false,
                description: 'Shell Sort is a generalization of Insertion Sort that allows the exchange of far apart elements. It starts with a large gap and progressively reduces the gap.',
                howItWorks: [
                    'Start with a large gap (n/2)',
                    'Perform gapped insertion sort for this gap',
                    'Reduce the gap (divide by 2)',
                    'Repeat until gap becomes 1, then do a final insertion sort'
                ]
            },
            cocktail: {
                name: 'Cocktail Shaker Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: true,
                description: 'Cocktail Shaker Sort is a variation of Bubble Sort that traverses the array in both directions alternately, which helps move elements to their correct positions faster.',
                howItWorks: [
                    'Forward pass: bubble the largest unsorted element to the right',
                    'Backward pass: bubble the smallest unsorted element to the left',
                    'Shrink the unsorted region from both ends',
                    'Repeat until no swaps are needed'
                ]
            },
            comb: {
                name: 'Comb Sort',
                badge: 'Comparison Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n log n)',
                average: 'O(n²/2^p)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: false,
                description: 'Comb Sort improves on Bubble Sort by using a gap larger than 1. The gap starts large and shrinks by a factor of 1.3 each pass, eliminating small values near the end (turtles).',
                howItWorks: [
                    'Start with gap = array length',
                    'Compare elements that are "gap" apart',
                    'Shrink gap by factor of 1.3',
                    'When gap reaches 1, it becomes Bubble Sort',
                    'Continue until no swaps needed with gap = 1'
                ]
            },
            tim: {
                name: 'Tim Sort',
                badge: 'Hybrid Sort',
                badgeClass: 'badge-comparison',
                best: 'O(n)',
                average: 'O(n log n)',
                worst: 'O(n log n)',
                space: 'O(n)',
                stable: true,
                description: 'Tim Sort is a hybrid sorting algorithm combining Insertion Sort and Merge Sort. It is designed to perform well on many kinds of real-world data. Used in Python\'s sorted() and Java\'s Arrays.sort().',
                howItWorks: [
                    'Divide array into small runs (size 32)',
                    'Sort each run using Insertion Sort',
                    'Merge runs using Merge Sort logic',
                    'Double the run size each iteration until entire array is merged'
                ]
            }
        };
        return info[name] || info.bubble;
    }

    getCode(name, lang) {
        const codes = {
            bubble: {
                javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,
                python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
                cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
                java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
            },
            selection: {
                javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
                python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
                cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
                java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`
            },
            insertion: {
                javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
                python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
                cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
                java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
            },
            merge: {
                javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    let result = [], i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i), right.slice(j));
}`,
                python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
                cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int i = 0; i < n2; i++) R[i] = arr[m + 1 + i];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2)
        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
                java: `void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int[] L = new int[n1], R = new int[n2];
    System.arraycopy(arr, l, L, 0, n1);
    System.arraycopy(arr, m + 1, R, 0, n2);
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2)
        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`
            },
            quick: {
                javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high], i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
    return i + 1;
}`,
                python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
                cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
                java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;
    return i + 1;
}

void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
            },
            heap: {
                javascript: `function heapSort(arr) {
    const n = arr.length;
    // Build max heap
    for (let i = Math.floor(n/2) - 1; i >= 0; i--)
        heapify(arr, n, i);
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    let l = 2*i + 1, r = 2*i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}`,
                python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    l, r = 2*i + 1, 2*i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
                cpp: `void heapify(int arr[], int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
                java: `void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
        heapify(arr, n, largest);
    }
}

void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}`
            },
            radix: {
                javascript: `function radixSort(arr) {
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max/exp) > 0; exp *= 10)
        countSortByDigit(arr, exp);
    return arr;
}

function countSortByDigit(arr, exp) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++)
        count[Math.floor(arr[i]/exp) % 10]++;
    for (let i = 1; i < 10; i++)
        count[i] += count[i-1];
    for (let i = n-1; i >= 0; i--) {
        output[count[Math.floor(arr[i]/exp)%10]-1] = arr[i];
        count[Math.floor(arr[i]/exp)%10]--;
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
                python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        count_sort_by_digit(arr, exp)
        exp *= 10

def count_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in range(n):
        count[(arr[i] // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i-1]
    for i in range(n-1, -1, -1):
        idx = (arr[i] // exp) % 10
        output[count[idx]-1] = arr[i]
        count[idx] -= 1
    for i in range(n):
        arr[i] = output[i]`,
                cpp: `void countSortByDigit(int arr[], int n, int exp) {
    int output[n], count[10] = {0};
    for (int i = 0; i < n; i++)
        count[(arr[i]/exp) % 10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i-1];
    for (int i = n-1; i >= 0; i--) {
        output[count[(arr[i]/exp)%10]-1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = *max_element(arr, arr+n);
    for (int exp = 1; m/exp > 0; exp *= 10)
        countSortByDigit(arr, n, exp);
}`,
                java: `void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max/exp > 0; exp *= 10)
        countSortByDigit(arr, exp);
}

void countSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n], count = new int[10];
    for (int i = 0; i < n; i++)
        count[(arr[i]/exp) % 10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i-1];
    for (int i = n-1; i >= 0; i--) {
        output[count[(arr[i]/exp)%10]-1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    System.arraycopy(output, 0, arr, 0, n);
}`
            },
            counting: {
                javascript: `function countingSort(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);
    
    for (let i = 0; i < arr.length; i++)
        count[arr[i] - min]++;
    for (let i = 1; i < range; i++)
        count[i] += count[i-1];
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]-min]-1] = arr[i];
        count[arr[i]-min]--;
    }
    for (let i = 0; i < arr.length; i++)
        arr[i] = output[i];
    return arr;
}`,
                python: `def counting_sort(arr):
    max_val, min_val = max(arr), min(arr)
    rng = max_val - min_val + 1
    count = [0] * rng
    output = [0] * len(arr)
    
    for x in arr:
        count[x - min_val] += 1
    for i in range(1, rng):
        count[i] += count[i-1]
    for i in range(len(arr)-1, -1, -1):
        output[count[arr[i]-min_val]-1] = arr[i]
        count[arr[i]-min_val] -= 1
    for i in range(len(arr)):
        arr[i] = output[i]`,
                cpp: `void countingSort(int arr[], int n) {
    int max = *max_element(arr, arr+n);
    int min = *min_element(arr, arr+n);
    int range = max - min + 1;
    vector<int> count(range, 0), output(n);
    for (int i = 0; i < n; i++) count[arr[i]-min]++;
    for (int i = 1; i < range; i++) count[i] += count[i-1];
    for (int i = n-1; i >= 0; i--) {
        output[count[arr[i]-min]-1] = arr[i];
        count[arr[i]-min]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
}`,
                java: `void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    int range = max - min + 1;
    int[] count = new int[range];
    int[] output = new int[arr.length];
    for (int x : arr) count[x - min]++;
    for (int i = 1; i < range; i++) count[i] += count[i-1];
    for (int i = arr.length-1; i >= 0; i--) {
        output[count[arr[i]-min]-1] = arr[i];
        count[arr[i]-min]--;
    }
    System.arraycopy(output, 0, arr, 0, arr.length);
}`
            },
            shell: {
                javascript: `function shellSort(arr) {
    let n = arr.length;
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i], j;
            for (j = i; j >= gap && arr[j-gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
    return arr;
}`,
                python: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j-gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2`,
                cpp: `void shellSort(int arr[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i], j;
            for (j = i; j >= gap && arr[j-gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
                java: `void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i], j;
            for (j = i; j >= gap && arr[j-gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`
            },
            cocktail: {
                javascript: `function cocktailSort(arr) {
    let swapped = true, start = 0, end = arr.length - 1;
    while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i+1]) {
                [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
                swapped = true;
            }
        }
        end--;
        if (!swapped) break;
        swapped = false;
        for (let i = end; i > start; i--) {
            if (arr[i] < arr[i-1]) {
                [arr[i], arr[i-1]] = [arr[i-1], arr[i]];
                swapped = true;
            }
        }
        start++;
    }
    return arr;
}`,
                python: `def cocktail_sort(arr):
    swapped = True
    start, end = 0, len(arr) - 1
    while swapped:
        swapped = False
        for i in range(start, end):
            if arr[i] > arr[i+1]:
                arr[i], arr[i+1] = arr[i+1], arr[i]
                swapped = True
        end -= 1
        if not swapped: break
        swapped = False
        for i in range(end, start, -1):
            if arr[i] < arr[i-1]:
                arr[i], arr[i-1] = arr[i-1], arr[i]
                swapped = True
        start += 1`,
                cpp: `void cocktailSort(int arr[], int n) {
    bool swapped = true;
    int start = 0, end = n - 1;
    while (swapped) {
        swapped = false;
        for (int i = start; i < end; i++) {
            if (arr[i] > arr[i+1]) {
                swap(arr[i], arr[i+1]);
                swapped = true;
            }
        }
        end--;
        if (!swapped) break;
        swapped = false;
        for (int i = end; i > start; i--) {
            if (arr[i] < arr[i-1]) {
                swap(arr[i], arr[i-1]);
                swapped = true;
            }
        }
        start++;
    }
}`,
                java: `void cocktailSort(int[] arr) {
    boolean swapped = true;
    int start = 0, end = arr.length - 1;
    while (swapped) {
        swapped = false;
        for (int i = start; i < end; i++) {
            if (arr[i] > arr[i+1]) {
                int t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t;
                swapped = true;
            }
        }
        end--;
        if (!swapped) break;
        swapped = false;
        for (int i = end; i > start; i--) {
            if (arr[i] < arr[i-1]) {
                int t = arr[i]; arr[i] = arr[i-1]; arr[i-1] = t;
                swapped = true;
            }
        }
        start++;
    }
}`
            },
            comb: {
                javascript: `function combSort(arr) {
    let gap = arr.length;
    const shrink = 1.3;
    let sorted = false;
    while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) { gap = 1; sorted = true; }
        for (let i = 0; i + gap < arr.length; i++) {
            if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i+gap]] = [arr[i+gap], arr[i]];
                sorted = false;
            }
        }
    }
    return arr;
}`,
                python: `def comb_sort(arr):
    gap = len(arr)
    shrink = 1.3
    sorted = False
    while not sorted:
        gap = int(gap / shrink)
        if gap <= 1:
            gap = 1
            sorted = True
        for i in range(len(arr) - gap):
            if arr[i] > arr[i + gap]:
                arr[i], arr[i+gap] = arr[i+gap], arr[i]
                sorted = False`,
                cpp: `void combSort(int arr[], int n) {
    int gap = n;
    float shrink = 1.3;
    bool sorted = false;
    while (!sorted) {
        gap = (int)(gap / shrink);
        if (gap <= 1) { gap = 1; sorted = true; }
        for (int i = 0; i + gap < n; i++) {
            if (arr[i] > arr[i + gap]) {
                swap(arr[i], arr[i + gap]);
                sorted = false;
            }
        }
    }
}`,
                java: `void combSort(int[] arr) {
    int gap = arr.length;
    double shrink = 1.3;
    boolean sorted = false;
    while (!sorted) {
        gap = (int)(gap / shrink);
        if (gap <= 1) { gap = 1; sorted = true; }
        for (int i = 0; i + gap < arr.length; i++) {
            if (arr[i] > arr[i + gap]) {
                int t = arr[i]; arr[i] = arr[i+gap]; arr[i+gap] = t;
                sorted = false;
            }
        }
    }
}`
            },
            tim: {
                javascript: `function timSort(arr) {
    const RUN = 32;
    const n = arr.length;
    // Sort runs with insertion sort
    for (let i = 0; i < n; i += RUN) {
        insertionSort(arr, i, Math.min(i+RUN-1, n-1));
    }
    // Merge runs
    for (let size = RUN; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2*size) {
            let mid = Math.min(left+size-1, n-1);
            let right = Math.min(left+2*size-1, n-1);
            if (mid < right) merge(arr, left, mid, right);
        }
    }
    return arr;
}

function insertionSort(arr, left, right) {
    for (let i = left+1; i <= right; i++) {
        let key = arr[i], j = i-1;
        while (j >= left && arr[j] > key) {
            arr[j+1] = arr[j]; j--;
        }
        arr[j+1] = key;
    }
}`,
                python: `def tim_sort(arr):
    RUN = 32
    n = len(arr)
    for i in range(0, n, RUN):
        insertion_sort(arr, i, min(i+RUN-1, n-1))
    size = RUN
    while size < n:
        for left in range(0, n, 2*size):
            mid = min(left+size-1, n-1)
            right = min(left+2*size-1, n-1)
            if mid < right:
                merge(arr, left, mid, right)
        size *= 2

def insertion_sort(arr, left, right):
    for i in range(left+1, right+1):
        key = arr[i]
        j = i - 1
        while j >= left and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key`,
                cpp: `const int RUN = 32;

void insertionSort(int arr[], int l, int r) {
    for (int i = l+1; i <= r; i++) {
        int key = arr[i], j = i-1;
        while (j >= l && arr[j] > key) {
            arr[j+1] = arr[j]; j--;
        }
        arr[j+1] = key;
    }
}

void timSort(int arr[], int n) {
    for (int i = 0; i < n; i += RUN)
        insertionSort(arr, i, min(i+RUN-1, n-1));
    for (int size = RUN; size < n; size *= 2) {
        for (int left = 0; left < n; left += 2*size) {
            int mid = min(left+size-1, n-1);
            int right = min(left+2*size-1, n-1);
            if (mid < right) merge(arr, left, mid, right);
        }
    }
}`,
                java: `static final int RUN = 32;

void insertionSort(int[] arr, int l, int r) {
    for (int i = l+1; i <= r; i++) {
        int key = arr[i], j = i-1;
        while (j >= l && arr[j] > key) {
            arr[j+1] = arr[j]; j--;
        }
        arr[j+1] = key;
    }
}

void timSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i += RUN)
        insertionSort(arr, i, Math.min(i+RUN-1, n-1));
    for (int size = RUN; size < n; size *= 2) {
        for (int left = 0; left < n; left += 2*size) {
            int mid = Math.min(left+size-1, n-1);
            int right = Math.min(left+2*size-1, n-1);
            if (mid < right) merge(arr, left, mid, right);
        }
    }
}`
            }
        };

        return (codes[name] && codes[name][lang]) || codes.bubble.javascript;
    }

    getPseudocode(name) {
        const pseudocodes = {
            bubble: `ALGORITHM BubbleSort(A[0..n-1])
    for i ← 0 to n-2 do
        swapped ← false
        for j ← 0 to n-2-i do
            if A[j] > A[j+1] then
                swap A[j] and A[j+1]
                swapped ← true
        if not swapped then
            break    // Array is already sorted`,
            selection: `ALGORITHM SelectionSort(A[0..n-1])
    for i ← 0 to n-2 do
        minIdx ← i
        for j ← i+1 to n-1 do
            if A[j] < A[minIdx] then
                minIdx ← j
        swap A[i] and A[minIdx]`,
            insertion: `ALGORITHM InsertionSort(A[0..n-1])
    for i ← 1 to n-1 do
        key ← A[i]
        j ← i - 1
        while j >= 0 and A[j] > key do
            A[j+1] ← A[j]
            j ← j - 1
        A[j+1] ← key`,
            merge: `ALGORITHM MergeSort(A[0..n-1])
    if n ≤ 1 then return A
    mid ← ⌊n/2⌋
    left ← MergeSort(A[0..mid])
    right ← MergeSort(A[mid+1..n-1])
    return Merge(left, right)

ALGORITHM Merge(L, R)
    result ← empty array
    i ← 0, j ← 0
    while i < |L| and j < |R| do
        if L[i] ≤ R[j] then append L[i++];
        else append R[j++];
    append remaining elements`,
            quick: `ALGORITHM QuickSort(A, low, high)
    if low < high then
        pivot ← A[high]
        pi ← Partition(A, low, high)
        QuickSort(A, low, pi-1)
        QuickSort(A, pi+1, high)

ALGORITHM Partition(A, low, high)
    pivot ← A[high]
    i ← low - 1
    for j ← low to high-1 do
        if A[j] < pivot then
            i ← i + 1
            swap A[i] and A[j]
    swap A[i+1] and A[high]
    return i + 1`,
            heap: `ALGORITHM HeapSort(A[0..n-1])
    // Build max heap
    for i ← ⌊n/2⌋-1 down to 0 do
        Heapify(A, n, i)
    // Extract elements
    for i ← n-1 down to 1 do
        swap A[0] and A[i]
        Heapify(A, i, 0)

ALGORITHM Heapify(A, n, i)
    largest ← i
    left ← 2*i + 1
    right ← 2*i + 2
    if left < n and A[left] > A[largest]
        largest ← left
    if right < n and A[right] > A[largest]
        largest ← right
    if largest ≠ i then
        swap A[i] and A[largest]
        Heapify(A, n, largest)`,
            radix: `ALGORITHM RadixSort(A[0..n-1])
    max ← maximum value in A
    exp ← 1
    while max/exp > 0 do
        CountingSort by digit (A[i]/exp) % 10
        exp ← exp × 10

ALGORITHM CountSortByDigit(A, exp)
    count ← array of 10 zeros
    for each element in A
        digit ← (element / exp) % 10
        count[digit]++
    compute prefix sums of count
    place elements in output array
    copy output to A`,
            counting: `ALGORITHM CountingSort(A[0..n-1])
    max ← maximum value in A
    min ← minimum value in A
    range ← max - min + 1
    count ← array of zeros, size = range
    
    for each element in A
        count[element - min]++
    compute prefix sums of count
    for i ← n-1 down to 0
        output[count[A[i]-min] - 1] ← A[i]
        count[A[i]-min]--
    copy output to A`,
            shell: `ALGORITHM ShellSort(A[0..n-1])
    gap ← ⌊n/2⌋
    while gap > 0 do
        for i ← gap to n-1 do
            temp ← A[i]
            j ← i
            while j ≥ gap and A[j-gap] > temp do
                A[j] ← A[j-gap]
                j ← j - gap
            A[j] ← temp
        gap ← ⌊gap/2⌋`,
            cocktail: `ALGORITHM CocktailSort(A[0..n-1])
    swapped ← true
    start ← 0
    end ← n - 1
    while swapped do
        swapped ← false
        // Forward pass
        for i ← start to end-1 do
            if A[i] > A[i+1] then
                swap A[i] and A[i+1]
                swapped ← true
        end ← end - 1
        if not swapped then break
        swapped ← false
        // Backward pass
        for i ← end down to start+1 do
            if A[i] < A[i-1] then
                swap A[i] and A[i-1]
                swapped ← true
        start ← start + 1`,
            comb: `ALGORITHM CombSort(A[0..n-1])
    gap ← n
    shrink ← 1.3
    sorted ← false
    while not sorted do
        gap ← ⌊gap / shrink⌋
        if gap ≤ 1 then
            gap ← 1
            sorted ← true
        for i ← 0 to n-gap-1 do
            if A[i] > A[i+gap] then
                swap A[i] and A[i+gap]
                sorted ← false`,
            tim: `ALGORITHM TimSort(A[0..n-1])
    RUN ← 32
    // Sort small runs with Insertion Sort
    for i ← 0 to n-1 step RUN do
        InsertionSort(A, i, min(i+RUN-1, n-1))
    // Merge runs, doubling size each time
    size ← RUN
    while size < n do
        for left ← 0 to n-1 step 2×size do
            mid ← min(left+size-1, n-1)
            right ← min(left+2×size-1, n-1)
            if mid < right then
                Merge(A, left, mid, right)
        size ← size × 2`
        };

        return pseudocodes[name] || pseudocodes.bubble;
    }
}

// Export for use in app.js
window.SortingAlgorithms = SortingAlgorithms;
