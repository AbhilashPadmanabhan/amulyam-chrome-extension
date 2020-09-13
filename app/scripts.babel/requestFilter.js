'use strict';

chrome.browserAction.setBadgeText({ text: 'Joke' });

// chrome.webRequest.onBeforeRequest.addListener(
//   function (info) {

//     if (info.url.indexOf('www.amulyam.in') != -1) {
//       var urlParent = new URL(info.initiator).toString();
//       var urlReq = new URL(info.url).toString();
//       return { cancel: (urlParent != urlReq) };
//     }

//     if (info.url.indexOf('track.ajiomail.com') != -1) {
//       return { cancel : false };
//     }
//   },
//   {
//     urls: ["<all_urls>"],
//   },
//   ["blocking"]
// );

chrome.webRequest.onHeadersReceived.addListener(
  function (info) {
    var modifiedResHeaders = info.responseHeaders;
    if (info.url.indexOf("track") != -1) modifiedResHeaders.push({ "name": "Access-Control-Allow-Origin", "value": "*" });
    return {
      responseHeaders : modifiedResHeaders
    };
  },
  {
    urls: ['http://*/*', 'https://mail.google.com/*'],
    types: ['xmlhttprequest']
  },
  ["blocking", "responseHeaders"]
);