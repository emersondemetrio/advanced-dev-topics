/**
 * Finds two numbers in the array that add up to the target.
 * Uses a hash map to store previously seen numbers and their indices.
 *
 * @param nums - Array of integers
 * @param target - Target sum
 * @returns Array containing the indices of the two numbers that sum to target,
 * or empty array if no solution exists
 */
export const twoSum = (nums: number[], target: number): number[] => {
    // Map to store each number and its index as we iterate
    // Key: number value, Value: index in the array
    const prevMap: Record<number, number> = {}

    for (let i = 0; i < nums.length; i++) {
        // 2
        // 1
        // 5
        // 3
        const n = nums[i]

        // Calculate the complement needed to reach the target
        // If we've seen this complement before, we found our pair
        // 4 - 2 = 2
        // 4 - 1 = 3
        // 4 - 5 = -1
        // 4 - 3 = 1
        const diff = target - n

        // Check if we've already seen the complement number
        // If yes, return the indices of both numbers
        // 2 false
        // 3 false
        // -1 false
        // 1 true
        if (prevMap[diff] !== undefined) {
            // return [1, 3]
            return [prevMap[diff], i]
        }

        // Store the current number and its index for future lookups
        // prevMap[2] = 0
        // prevMap[1] = 1
        // prevMap[5] = 2
        prevMap[n] = i
    }

    // No solution found
    return []
}

const main = () => {
    // Test case 1: Basic case
    console.log("Test 1: Basic case")
    const nums1 = [2, 1, 5, 3]
    const target1 = 4
    const result1 = twoSum(nums1, target1)
    console.log("Input:", nums1, "Target:", target1)
    console.log("Expected:", [1, 3], "Result:", result1)
    console.log()

    // Test case 2: First and last elements
    console.log("Test 2: First and last elements")
    const nums2 = [3, 2, 4]
    const target2 = 6
    const result2 = twoSum(nums2, target2)
    console.log("Input:", nums2, "Target:", target2)
    console.log("Expected:", [1, 2], "Result:", result2)
    console.log()

    // Test case 3: Duplicate numbers
    console.log("Test 3: Duplicate numbers")
    const nums3 = [3, 3]
    const target3 = 6
    const result3 = twoSum(nums3, target3)
    console.log("Input:", nums3, "Target:", target3)
    console.log("Expected:", [0, 1], "Result:", result3)
    console.log()

    // Test case 4: Negative numbers
    console.log("Test 4: Negative numbers")
    const nums4 = [-1, -2, -3, -4, -5]
    const target4 = -8
    const result4 = twoSum(nums4, target4)
    console.log("Input:", nums4, "Target:", target4)
    console.log("Expected:", [2, 4], "Result:", result4)
    console.log()

    // Test case 5: Mixed positive and negative
    console.log("Test 5: Mixed positive and negative")
    const nums5 = [-1, 0, 1, 2, -1, -4]
    const target5 = 0
    const result5 = twoSum(nums5, target5)
    console.log("Input:", nums5, "Target:", target5)
    console.log("Expected:", [0, 2], "Result:", result5)
    console.log()

    // Test case 6: Zero in array
    console.log("Test 6: Zero in array")
    const nums6 = [0, 4, 3, 0]
    const target6 = 0
    const result6 = twoSum(nums6, target6)
    console.log("Input:", nums6, "Target:", target6)
    console.log("Expected:", [0, 3], "Result:", result6)
    console.log()

    // Test case 7: Two elements only
    console.log("Test 7: Two elements only")
    const nums7 = [1, 2]
    const target7 = 3
    const result7 = twoSum(nums7, target7)
    console.log("Input:", nums7, "Target:", target7)
    console.log("Expected:", [0, 1], "Result:", result7)
    console.log()

    // Test case 8: Larger array
    console.log("Test 8: Larger array")
    const nums8 = [2, 7, 11, 15, 8, 4, 9]
    const target8 = 13
    const result8 = twoSum(nums8, target8)
    console.log("Input:", nums8, "Target:", target8)
    console.log("Expected:", [0, 2], "Result:", result8)
    console.log()

    // Test case 9: No solution (should return empty array)
    console.log("Test 9: No solution")
    const nums9 = [1, 2, 3, 4]
    const target9 = 10
    const result9 = twoSum(nums9, target9)
    console.log("Input:", nums9, "Target:", target9)
    console.log("Expected:", [], "Result:", result9)
    console.log()
}

main();