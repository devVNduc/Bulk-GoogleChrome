'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page TITLE is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response) => {
    console.log(response.message);
  }
);

const NODEMY_TIME_WATCH_VIDEO = {
  min: 2000,
  max: 3000
}
const SELECTOR_TAG = '.tiktok-1ok4pbl-ButtonActionItem span[data-e2e="like-icon"]'
const TIME_WAIT_PER_TASK = 2000
let startIndex = 0
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runMyLikeNodemy(itemNodemy){
  return new Promise(function(resolve, reject){
    itemNodemy.parentElement.parentElement.parentElement.parentElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    setTimeout(function(){
      itemNodemy.click();
      resolve()
    }, getRandomInt(NODEMY_TIME_WATCH_VIDEO.min, NODEMY_TIME_WATCH_VIDEO.max))
  })
}

async function runTaskPerTime(time){
  async function runAllNodemy(){
    let nodemy = document.querySelectorAll(SELECTOR_TAG);
    console.log('nodemy ',startIndex, nodemy.length)
    for(startIndex; startIndex < nodemy.length ; startIndex++ ){
      await runMyLikeNodemy(nodemy[startIndex])
    }
    // startIndex : bai viet bat dau like ,
    startIndex = startIndex == 0 ? startIndex : nodemy.length
  }

  // wait TIME_WAIT_PER_TASK
  await new Promise((resolve, reject)=>{
    setTimeout(()=>{resolve()}, time)
  })
  await runAllNodemy()
}

async function runLikeTopTop(){
  for(let i = 0; i < 3; i++){
    await runTaskPerTime(TIME_WAIT_PER_TASK)
  }
}

// ========================================


// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('demo')
    console.log(`Current count is ${request.payload.count}`);
  }

  console.log('nodemy requset', request)
  if(request.type === 'RUNLIKE'){
    console.log('nodemy LIKE')
    runLikeTopTop()
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
