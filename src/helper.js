function waitForSelector(selector, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
 
    if (element) {
      resolve(element);
    } else {
      const startTime = Date.now();
      const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          observer.disconnect();
        } else {
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime >= timeout) {
            reject(
              null
            );
            observer.disconnect();
          }
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    }
  });
}
function waitWithCondition(cb, timeout = 2000) {
  return new Promise((resolve, reject) => {
    let elementCheck = cb()
    let isElDisabled = elementCheck?.getAttribute('aria-disabled') === 'true'
    console.log('1', elementCheck, isElDisabled)
    if (elementCheck && !isElDisabled) {
      return resolve(elementCheck);
    } 
    const startTime = Date.now();
    const observer = new MutationObserver((mutations) => {
    let elementCheck = cb()
    let isElDisabled = elementCheck?.getAttribute('aria-disabled') === 'true'
    console.log('2', elementCheck, isElDisabled)

      if (elementCheck && !isElDisabled) {
        resolve(elementCheck);
        observer.disconnect();
      } else {
        const elapsedTime = Date.now() - startTime;
        console.log('Khong the vao reject',elapsedTime)
        if (elapsedTime >= timeout) {
          reject(null);
          observer.disconnect();
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true, attributeFilter: ["aria-disabled"],
    attributeOldValue: true });
  });
}
module.exports = {
  waitForSelector,
  waitWithCondition,
};
