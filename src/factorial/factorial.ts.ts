export const factorial = (n: number): number => {
    // 1. Step 1: Base case / Stop condition
    if (n <= 1) return 1;

    // 2. Step 2: Recursive case / Call the function again with a smaller input
    return n * factorial(
        // 3. Step 3: Call the function again with a smaller input
        n - 1 // smaller input
    );
}

// Other implementations

export const factorialMemo = (n: number, memo: Record<number, number> = {}): number => {
    if (n === 0) return 1;
    if (memo[n]) return memo[n];
    memo[n] = n * factorialMemo(n - 1, memo);
    return memo[n];
}

export const factorialMapRecord = (n: number): number => {
    const memo = new Map<number, number>();
    memo.set(0, 1);
    for (let i = 1; i <= n; i++) {
        memo.set(i, i * memo.get(i - 1)!);
    }
    return memo.get(n)!;
}


const main = () => {
    // console.time('factorial');
    console.log(factorial(100));
    // console.timeEnd('factorial');

    // console.time('factorialMemo');
    // console.log(factorialMemo(10));
    // console.timeEnd('factorialMemo');

    console.time('factorialMapRecord');
    console.log(factorialMapRecord(100));
    console.timeEnd('factorialMapRecord');
}

main();