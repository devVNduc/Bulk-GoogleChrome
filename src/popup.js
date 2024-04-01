'use strict';

import './popup.css';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions

  // const counterStorage = {
  //   get: (cb) => {
  //     chrome.storage.sync.get(['count'], (result) => {
  //       cb(result.count);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         count: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };
  document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('fileInput');
    var sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', function () {
      var file = fileInput.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var fileContent = event.target.result;
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              var activeTab = tabs[0];
              chrome.tabs.sendMessage(
                activeTab.id,
                { fileContent: fileContent }, // Truyền nội dung file
              );
            }
          );
        };
        reader.readAsText(file); // Đọc file dưới dạng văn bản
      }
    });
  });

  // function setupCounter(initialValue = 3) {
  //   document.getElementById('counter').innerHTML = initialValue;
  //   console.log('set Event runlike')
  //   document.getElementById('runLikeTopTop').addEventListener('click', () => {
  //     console.log('nodemy run chrome')
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       const tab = tabs[0];
  //       console.log(tab.id)
  //       chrome.tabs.sendMessage(
  //         tab.id,
  //         {
  //           type: 'RUNLIKE',
  //           payload: {
  //           },
  //         },
  //         (response) => {
  //           console.log('popup js');
  //         }
  //       );
  //     });
  //   });

  //   document.getElementById('incrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'INCREMENT',
  //     });
  //   });

  //   document.getElementById('decrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'DECREMENT',
  //     });
  //   });
  // }

  // function updateCounter({ type }) {
  //   counterStorage.get((count) => {
  //     let newCount;

  //     if (type === 'INCREMENT') {
  //       newCount = count + 1;
  //     } else if (type === 'DECREMENT') {
  //       newCount = count - 1;
  //     } else {
  //       newCount = count;
  //     }

  //     counterStorage.set(newCount, () => {
  //       document.getElementById('counter').innerHTML = newCount;

  //       // Communicate with content script of
  //       // active tab by sending a message
  //       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //         const tab = tabs[0];

  //         chrome.tabs.sendMessage(
  //           tab.id,
  //           {
  //             type: 'COUNT',
  //             payload: {
  //               count: newCount,
  //             },
  //           },
  //           (response) => {
  //             console.log('Current count value passed to contentScript file');
  //           }
  //         );
  //       });
  //     });
  //   });
  // }

  // function restoreCounter() {
  //   // Restore count value
  //   counterStorage.get((count) => {
  //     if (typeof count === 'undefined') {
  //       // Set counter value as 0
  //       counterStorage.set(0, () => {
  //         setupCounter(0);
  //       });
  //     } else {
  //       setupCounter(count);
  //     }
  //   });
  // }

  // document.addEventListener('DOMContentLoaded', restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'messager den tu popup',
      },
    },
    (response) => {
      console.log(response.message);
    }
  );
})();
