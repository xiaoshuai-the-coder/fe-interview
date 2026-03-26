class CancelablePromise extends Promise {
  constructor(executor, signal) {
    let rejectSelf;
    super((resolve, reject) => {
      rejectSelf = reject;
      if (signal?.aborted) {
        reject(new Error('Promise was canceled'));
        return;
      }
      executor(resolve, reject);
    });

    if (signal) {
      signal.addEventListener('abort', () => {
        rejectSelf(new Error('Promise was canceled'));
      });
    }
  }
}

module.exports = { CancelablePromise };