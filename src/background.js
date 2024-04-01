'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, tin nay den tu background den ${sender.tab}`;

    // Log message coming from the `request` parameter
    console.log('Hallo',request);
    // Send a response message
    sendResponse({
      message,
    });
  }
});
