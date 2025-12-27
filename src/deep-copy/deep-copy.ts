export const deepCopy = <T>(obj: T): T => {
    // Handle null and undefined
    if (obj === null || obj === undefined) return obj;

    // Handle primitives (string, number, boolean, symbol, bigint)
    if (typeof obj !== "object") return obj;

    // Handle arrays - create new array and deep copy each element
    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item)) as T;
    }

    // Handle objects - create new object and deep copy each property
    const copy = {} as T;
    const keys = Object.keys(obj as object);

    for (let key of keys) {
        console.log("key", key, "value", (obj as any)[key]);
        // Always call deepCopy - it handles primitives and objects at the top
        (copy as any)[key] = deepCopy((obj as any)[key]);
    }

    return copy;
}

const x = deepCopy([1, 2, 3, { a: { b: 2 } }])

console.log("x", JSON.stringify(x, null, 2))

function deepCopy2<T>(target: T): T {
    if (target === null || typeof target !== 'object') return target;
    if (target instanceof Date) return new Date(target.getTime()) as any;
    if (Array.isArray(target)) {
        return target.map(item => deepCopy2(item)) as any;
    }
    const copy: any = {};
    for (const key of Object.keys(target as any)) {
        copy[key] = deepCopy2((target as any)[key]);
    }
    return copy;
}