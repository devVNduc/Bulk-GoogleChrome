'use strict';
import { waitForSelector, waitWithCondition } from './helper';
// xử lý sự kiện click NEW REQUEST
function btnNewRequest() {
  let button = document.querySelector(
    '[role="button"].U26fgb.O0WRkf.oG5Srb.C0oVfc.ZGldwb.M9Bg4d'
  );
  button.click();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
    // * sau 1 khoảng thời gian sẽ trả về resovle và chạy tiếp chương trình
  });
}

function inputUrl(linecontent, inputDOM) {
  inputDOM.value = linecontent;
  // Tạo và kích hoạt sự kiện input thủ công
  let event = new Event('input', { bubbles: true });
  inputDOM.dispatchEvent(event);
  // Tự động focus vào ô input
  inputDOM.focus();
}
// kiểm tra hộp thoại dialog
function checkDialog() {
  let dialog = document.querySelectorAll('[role="dialog"]');
  dialog = dialog[dialog.length - 1];
  if (dialog?.innerText?.includes('Duplicate request') || dialog?.innerText?.includes('URL not in property')) {
      return dialog
  } else{
    return null
  }
}
// xử lý sự kiện click submit
function checkSubmitBtn() {
  let btnSubmit = document.querySelectorAll('[data-id="EBS5u"]');
  console.log('=======',btnSubmit)
  btnSubmit = btnSubmit[btnSubmit.length - 1];
  return btnSubmit ? btnSubmit : null;
}
// Lấy DOM nút next
function checkNextBtn() {
  let btnNext = document.querySelectorAll('[data-id="EBS5u"]');
  btnNext = btnNext[btnNext.length - 1];
  // * dùng outerHTML in ra dom dạng string mà ko bị browser thay đổi DOM
  return btnNext ? btnNext : null;
}

function alertSucces(message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      alert(message);
      resolve();
    }, 0);
  });
}
async function main(linecontent) {
  try {
    let btnNewRequest = await waitForSelector(
      '[role="button"].U26fgb.O0WRkf.oG5Srb.C0oVfc.ZGldwb.M9Bg4d'
    );
    btnNewRequest.click();
    let inputDOM = await waitForSelector(
      '[jsname="YPqjbf"].VfPpkd-fmcmS-wGMbrd '
    );
    if (inputDOM) {
      inputUrl(linecontent, inputDOM);
    } else {
      console.log('error input error');
    }
    let btnNext = await waitWithCondition(checkNextBtn);
    btnNext.click()
    let errorDialog = await waitWithCondition(checkDialog, 1000);
    console.log('diaolog', dialog)
    let errorMessage = errorDialog?.innerText
    console.log('==========',errorDialog,errorMessage)
    if(errorMessage.includes('URL not in property')){
        let invalidUrlList = JSON.parse(localStorage.getItem('invalidUrlList')) || [];

        invalidUrlList.push(linecontent)
        localStorage.setItem('invalidUrlList',JSON.stringify(invalidUrlList))
        var btnClose = await waitForSelector(
          '[jsname="LgbsSe"].U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.kHssdc.HvOprf.phuYRc.M9Bg4d'
        );
        btnClose.click();
        var btnCancel = await waitForSelector(
          '[jsname="LgbsSe"].U26fgb.O0WRkf.oG5Srb.C0oVfc.kHssdc.euM5af.M9Bg4d'
        );
        console.log('cancel btn',btnCancel)
        btnCancel.click()
        return;
    }
    console.log('chu trinh neu duong dan hop le')
    // chu trinh neu duong dan hop le
    let btnSubmit = await waitWithCondition(checkSubmitBtn);
    btnSubmit.click();

    if(errorMessage.includes('Duplicate request')){
      let duplicateUrlList = JSON.parse(localStorage.getItem('duplicateUrlList')) || [];

      duplicateUrlList.push(linecontent)
      localStorage.setItem('duplicateUrlList',JSON.stringify(duplicateUrlList))
      var btnClose = await waitForSelector(
        '[jsname="LgbsSe"].U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.kHssdc.HvOprf.phuYRc.M9Bg4d'
      );
      btnClose.click();
     
      return;
  }
  } catch (error) {
    console.log('err', error);
  }
}
// hiển thị thông báo thành công
// Gỡ bỏ bộ lắng nghe trước (nếu có)
chrome.runtime.onMessage.removeListener(handleMessage);
// Đăng ký bộ lắng nghe tin nhắn mới
chrome.runtime.onMessage.addListener(handleMessage);

async function handleMessage(request, sender, sendResponse) {
  if (request.fileContent) {
    var fileContent = request.fileContent;
    var lines = fileContent.trim().split('\n');
    await main(lines[0]);
    // for (var i = 0; i < lines.length; i++) {
       
    // }
    // await alertSucces("Hoan Tat Qua Trinh")
  }
}
