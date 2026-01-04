export const fib = (n: number): number => {
    if (n <= 1) return n;

    return fib(n - 1) + fib(n - 2);
}

export const fibMemo = (n: number, memo: Record<number, number> = {}): number => {
    if (n <= 1) return n;
    if (memo[n]) return memo[n];
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

export const fibMapRecord = (n: number): number => {
    const memo = new Map<number, number>();
    memo.set(0, 0);
    memo.set(1, 1);
    for (let i = 2; i <= n; i++) {
        memo.set(i, memo.get(i - 1)! + memo.get(i - 2)!);
    }
    return memo.get(n)!;
}

const main = () => {
    console.time('fib');
    console.log(fib(10));
    console.timeEnd('fib');

    console.time('fibMemo');
    console.log(fibMemo(10));
    console.timeEnd('fibMemo');

    console.time('fibMapRecord');
    console.log(fibMapRecord(10));
    console.timeEnd('fibMapRecord');
}

main();
