export const bubbleSort = (arr: any[]): any[] => {
    if (arr.length <= 1) return arr;

    // Create a copy to avoid mutating the original array
    const copy = [...arr];

    // Classic bubble sort: two nested loops
    // Outer loop: number of passes through the array
    for (let i = 0; i < copy.length; i++) {
        // Inner loop: compare adjacent elements
        // Classic version: always goes through full array (no optimization)
        for (let j = 0; j < copy.length - 1; j++) {
            console.log(i, j);
            if (copy[j] > copy[j + 1]) {
                // Swap elements
                const temp = copy[j];
                copy[j] = copy[j + 1];
                copy[j + 1] = temp;
            }
        }
    }

    return copy;
}

export const bubbleSortOptimized = (arr: any[]): any[] => {
    if (arr.length <= 1) return arr;

    // Create a copy to avoid mutating the original array
    const copy = [...arr];

    // Optimized bubble sort: reduces inner loop range each pass
    // Outer loop: number of passes through the array
    for (let i = 0; i < copy.length; i++) {
        // Inner loop: compare adjacent elements
        // Optimization: after each pass, the largest element bubbles to the end
        // So we can reduce the inner loop range by i (no need to check already sorted elements)
        for (let j = 0; j < copy.length - 1 - i; j++) {
            if (copy[j] > copy[j + 1]) {
                // Swap elements
                const temp = copy[j];
                copy[j] = copy[j + 1];
                copy[j + 1] = temp;
            }
        }
    }

    return copy;
}

// ========== USE CASES ==========

// Example 1: Sorting numbers
console.log('=== Bubble Sort Example 1: Sorting Numbers ===');
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('Original array:', numbers);
const sortedNumbers = bubbleSort(numbers);
console.log('Sorted array:', sortedNumbers);
console.log('Original array (unchanged):', numbers);
console.log('');

// Example 2: Sorting strings
console.log('=== Bubble Sort Example 2: Sorting Strings ===');
const fruits = ['banana', 'apple', 'cherry', 'date', 'elderberry'];
console.log('Original array:', fruits);
const sortedFruits = bubbleSort(fruits);
console.log('Sorted array:', sortedFruits);
console.log('');