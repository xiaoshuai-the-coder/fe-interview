const { CancelablePromise } = require('../cancelablePromise');

describe('CancelablePromise', () => {
    test('should resolve when not canceled', async () => {
        const controller = new AbortController();
        const promise = new CancelablePromise((resolve) => {
            setTimeout(() => {
                resolve('resolved');
            }, 100);
        }, controller.signal);

        const result = await promise;
        expect(result).toBe('resolved');
    });

    test('should reject when canceled', async () => {
        const controller = new AbortController();
        const promise = new CancelablePromise((resolve) => {
            setTimeout(() => {
                resolve('resolved');
            }, 100);
        }, controller.signal);

        controller.abort();

        await expect(promise).rejects.toThrow('Promise was canceled');
    });
});