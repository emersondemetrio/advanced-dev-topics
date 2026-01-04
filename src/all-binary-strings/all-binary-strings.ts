export const allBinaryStrings = (n: number): string[] => {
    const result: string[] = [];
    const path: string[] = [];

    const backtrack = () => {
        // base case / stop condition:
        // if the path length is equal to the input n, then we have a valid binary string
        if (path.length === n) {
            result.push(path.join(''));
            // return to the previous call
            return;
        }

        // Push 0 to the path and call the function again
        path.push('0');
        backtrack();
        path.pop();


        path.push('1');
        backtrack();
        path.pop();
    }

    backtrack();
    return result;
}

const main = () => {
    console.log(allBinaryStrings(3));
}

main();
