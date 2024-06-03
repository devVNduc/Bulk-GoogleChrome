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
  min: 1000,
  max: 4000
} //* cài đặt thời gian xem video từ 2s đến 3s
const SELECTOR_TAG = 'div[aria-label="Thêm bạn bè"]'; //* Đối tượng tương tác trên trình duyệt
const SELECTOR_OKE_TAG = '.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1r8uery.xl9nvqe.xwfmwtl div[aria-label="OK"]';

const TIME_WAIT_PER_TASK = 1000 //* Thời gian delay cho mỗi hành động
let startIndex = 0
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
} //* hàm trả vế số thời gian random cho việc xem video

function runMyLikeNodemy(itemNodemy){
  return new Promise(function(resolve, reject){
    itemNodemy.parentElement.parentElement.parentElement.parentElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); //* Cuộn trang
    setTimeout(function(){
      console.log("da click vao phan tu")
      itemNodemy.click(); //* Click vào phần tử
      resolve()
    }, getRandomInt(NODEMY_TIME_WATCH_VIDEO.min, NODEMY_TIME_WATCH_VIDEO.max)) //* đelay bằng khoảng thời gian xem video
  })
} //* Hàm thưc hiện cuộn , thực hiện click, chú ý dùng promise cài đặt thời gian để thực hiện lệnh bất đồng bộ 
  // ! Chỉ cho 1 phần tử dom 
  function okeTAG(okeTag){
    return new Promise(function(resolve, reject){
      console.log("aaaaaaaaaaaaa")
      okeTag.click(); //* Click vào phần tử
      resolve()
    })
  }

async function runTaskPerTime(time){
  async function runAllNodemy(){
    let nodemy = document.querySelectorAll(SELECTOR_TAG); //* Chọn tất cả phần tử và nodemy là 1 biến dạng nodelist
    console.log('nodemy ',startIndex, nodemy.length) //! in ra phần tử bắt đầu và độ dài của arr nodemy
    for(startIndex; startIndex < nodemy.length ; startIndex++ ){
      await runMyLikeNodemy(nodemy[startIndex])
      console.log(startIndex)
      let nodemy_OKE_TAG = document.querySelector(SELECTOR_OKE_TAG);
      if (nodemy_OKE_TAG) {
        console.log(nodemy_OKE_TAG)
        console.log("nodemy_OKE_TAG exists.");
        await okeTAG(nodemy_OKE_TAG)
      } else {
        console.log("nodemy_OKE_TAG does not exist.");
      }
    }
    // startIndex : bai viet bat dau like ,
    //* Khi load trang sẽ có 1 cơ số phần tư hiển thị ra
    //* startIndex là vị trí phần tử ban đầu bắt đầu like
    //* ví dụ trang có 11 phần tử thì sau khi chạy hết 11 phần tử đó
    //* trang tiktok sẽ load thêm , ta sẽ đặt startIndex bằng độ dài của tổng số
    //* phần tử hiện có , theo ví dụ là 11, rồi tiếp là 21 và cứ như thế
    //! Để sau khi đã chạy hết list phân từ bản đầu 
    
    startIndex = startIndex == 0 ? startIndex : nodemy.length
  }

  // wait TIME_WAIT_PER_TASK
  await new Promise((resolve, reject)=>{
    setTimeout(()=>{resolve()}, time)
  })
  await runAllNodemy()
} //* hàm runTaskPerTime thực hiện chạy hàm runAllNodemy với tham số là khoảng thời gian mà mỗi runAllNodemy với đợi xong mới chạy tiếp
  //! runAllNodemy chạy cho 1 danh sách phần tử Dom (sử dụng runMyLikeNodemy để truyền mỗi phẫn tử DOM vào để thực hiện thao tác)
  function scrollToEnd() {
    return new Promise((resolve, reject) => {
      const scrollInterval = 500; // 0.5 second
      const duration = 1 * 60 * 1000; // 5 minutes
      const startTime = new Date().getTime();
      const endTime = startTime + duration;
  
      const scrollStep = () => {
        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
  
        // Check if the duration has elapsed
        const currentTime = new Date().getTime();
        if (currentTime < endTime) {
          // Continue scrolling after a delay
          setTimeout(scrollStep, scrollInterval);
        } else {
          // Scrolling completed, resolve the promise
          resolve();
        }
      };
  
      // Start scrolling
      scrollStep();
    });
  }

async function runLikeTopTop(){
    await runTaskPerTime(TIME_WAIT_PER_TASK)
} //* hàm chứa vòng lặp chạy lại số lần của task

// ========================================

async function runTool(){
  await scrollToEnd()
  await runLikeTopTop()
}

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('demo')
    console.log(`Current count is ${request.payload.count}`);
  }

  console.log('nodemy requset', request)
  if(request.type === 'RUNLIKE'){
    console.log('nodemy LIKE')
    runTool()
  }

  // Send an empty response
  // See https://github.com/mozilla/webe  xtension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
