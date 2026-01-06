import { httpPromise } from '../common/api'
type PromiseAllResult<T> = Promise<T[]>

export const promiseAll = <T>(promises: Promise<T>[]): PromiseAllResult<T> => {
    if (promises.length === 0) {
        return Promise.resolve([])
    }

    return new Promise((resolve, reject) => {
        const results: T[] = []
        let completedCount = 0

        for (const [index, promise] of promises.entries()) {
            promise
                .then(result => {
                    results[index] = result
                    completedCount++

                    // If all promises completed, resolve with results
                    if (completedCount === promises.length) {
                        resolve(results)
                    }
                })
                .catch(error => {
                    // Fail fast - reject immediately on first error
                    reject(error)
                })
        }
    })
}


const p1 = httpPromise("https://jsonplaceholder.typicode.com/todos/1")
const p2 = httpPromise("https://jsonplaceholder.typicsdode.com/todos/2")

const main = async () => {
    // Compare with Promise.all([p1, p2])
    const result = await promiseAll([p1, p2])
    console.log('result', result);

}

main()