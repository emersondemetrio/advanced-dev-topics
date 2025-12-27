type PromiseSettledResult<T> =
    | { status: 'fulfilled'; value: T }
    | { status: 'rejected'; reason: any }

type PromiseAllSettledResult<T> = Promise<PromiseSettledResult<T>[]>

export const promiseAllSettled = <T>(promises: Promise<T>[]): PromiseAllSettledResult<T> => {
    if (promises.length === 0) {
        return Promise.resolve([])
    }

    return new Promise((resolve) => {
        const results: PromiseSettledResult<T>[] = []
        let completedCount = 0

        for (const [index, promise] of promises.entries()) {
            promise
                .then(value => {
                    results[index] = { status: 'fulfilled', value }
                    completedCount++

                    // If all promises completed, resolve with results
                    if (completedCount === promises.length) {
                        resolve(results)
                    }
                })
                .catch(reason => {
                    results[index] = { status: 'rejected', reason }
                    completedCount++

                    // If all promises completed, resolve with results
                    if (completedCount === promises.length) {
                        resolve(results)
                    }
                })
        }
    })
}

// ========== USE CASES ==========

import { httpPromise } from '../common/api'

// Example 1: All promises succeed
console.log('=== Promise.allSettled Example 1: All Promises Succeed ===');
const p1 = Promise.resolve('Success 1')
const p2 = Promise.resolve('Success 2')
const p3 = Promise.resolve('Success 3')

promiseAllSettled([p1, p2, p3]).then(results => {
    console.log('Results:', results)
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index + 1}: FULFILLED with value:`, result.value)
        } else {
            console.log(`Promise ${index + 1}: REJECTED with reason:`, result.reason)
        }
    })
    console.log('')
})

// Example 2: Some promises fail
console.log('=== Promise.allSettled Example 2: Some Promises Fail ===');
const success1 = Promise.resolve('Success!')
const failure1 = Promise.reject(new Error('Failed!'))
const success2 = Promise.resolve('Another success!')

promiseAllSettled([success1, failure1, success2]).then(results => {
    console.log('Results:', results)
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index + 1}: FULFILLED with value:`, result.value)
        } else {
            console.log(`Promise ${index + 1}: REJECTED with reason:`, result.reason.message)
        }
    })
    console.log('')
})

// Example 3: All promises fail
console.log('=== Promise.allSettled Example 3: All Promises Fail ===');
const fail1 = Promise.reject(new Error('Error 1'))
const fail2 = Promise.reject(new Error('Error 2'))

promiseAllSettled([fail1, fail2]).then(results => {
    console.log('Results:', results)
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.log(`Promise ${index + 1}: REJECTED with reason:`, result.reason.message)
        }
    })
    console.log('(Note: Promise.allSettled always resolves, even when all promises fail)\n')
})

// Example 4: Real HTTP requests (some may fail)
console.log('=== Promise.allSettled Example 4: Real HTTP Requests ===');
const http1 = httpPromise("https://jsonplaceholder.typicode.com/todos/1")
const http2 = httpPromise("https://jsonplaceholder.typicode.com/todos/2")
const http3 = httpPromise("https://invalid-url-that-will-fail.com/data")

promiseAllSettled([http1, http2, http3]).then(results => {
    console.log('HTTP Results:', results)
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Request ${index + 1}: SUCCESS -`, JSON.stringify(result.value).substring(0, 50) + '...')
        } else {
            console.log(`Request ${index + 1}: FAILED -`, result.reason?.message || result.reason)
        }
    })
    console.log('')
})

// Example 5: Empty array
console.log('=== Promise.allSettled Example 5: Empty Array ===');
promiseAllSettled([]).then(results => {
    console.log('Empty array results:', results)
    console.log('(Returns empty array immediately)\n')
})

