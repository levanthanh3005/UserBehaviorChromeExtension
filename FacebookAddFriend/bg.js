function formatTime(t) {
  var time = new Date(t);
  return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

function onSessionStart(session) {
	// console.log(session);
	// console.log("START", formatTime(session.startTime), session.url);
}

function onSessionEnd(session) {
  if (session.url.startsWith("chrome://")) {
    return;
  }
  console.log(session);
  console.log("END", formatTime(session.endTime), session.url);
  
  // $.post("http://localhost:5000/addData")

  if (skippingList(session.url)) {
    return;
  }
}

function skippingList(url) {
  if (url.startsWith("chrome://")) {
    return true;
  }
  return false;
}

var stopTracking = startTrackingActivity(onSessionStart, onSessionEnd);

function startTrackingActivity(onSessionStart, onSessionEnd) {
  var session = { tabId: -1 };

  function endSession() {
    if (session.tabId !== -1) {
      session.endTime = Date.now();
      onSessionEnd && onSessionEnd(session);
      session = { tabId: -1 };
    }
  }

  function startSession(tab) {
    endSession();
    session = {
      tabId: tab.id,
      url: tab.url,
      title: tab.title,
      windowId: tab.windowId, 
      startTime: Date.now(),
    };
    onSessionStart &&
      onSessionStart({
        tabId: session.tabId,
        url: session.url,
        startTime: session.startTime
      });

    inject(tab);
  }

  function inject(tab) {
    if (skippingList(tab.url)) {
      return;
    }
    chrome.tabs.executeScript(tab.id, {
          file: 'inject.js'
    }, _=>{
      let e = chrome.runtime.lastError;
      // if(e !== undefined){
      //   console.log(tabId, _, e);
      // }
      // console.log("error ",e);
    });
  }



  function trackWindowFocus(windowId) {
    if (windowId !== -1) {
      chrome.windows.getCurrent({ populate: true }, function(window) {
        var activeTab = window.tabs.filter(function(tab) {
          return tab.active;
        })[0];
        if (activeTab && activeTab.id !== session.tabId) {
          startSession(activeTab);
        }
      });
    } else {
      endSession();
    }
  }

  function trackActiveTab(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      if (!chrome.runtime.lastError && tab.id !== session.tabId) {
                  // console.log(tab);
          // // chrome.tabs.executeScript(tabId, {file: 'inject.js'});
        // chrome.tabs.executeScript(tab.id, {
        //   file: 'inject.js'
        // });

        startSession(tab);
      }
    });
  }

  function trackTabUpdates(tabId, changeInfo, tab) {
    // if (tab.url == "chrome://newtab/") {
    //   return;
    // }
    if (
      tab.active && changeInfo.status === "loading" && tab.url !== session.url
    ) {
      chrome.windows.get(tab.windowId, function(window) {
        if (!chrome.runtime.lastError && window.focused) {
          startSession(tab);
        }
      });
    }
  }

  function trackMessages(request, sender, sendResponse) {
      // console.log("trackMessages");
      // console.log(request.options);
      session.isKeyPress = request.options.isKeyPress;
      session.isMouseClick = request.options.isMouseClick;
      session.isMouseMove = request.options.isMouseMove;
      session.isMouseWheel = request.options.isMouseWheel;
      session.title = request.options.title;
  }

  chrome.windows.onFocusChanged.addListener(trackWindowFocus);
  chrome.tabs.onUpdated.addListener(trackTabUpdates);
  chrome.tabs.onActivated.addListener(trackActiveTab);
  chrome.runtime.onMessage.addListener(trackMessages);

  return function stopTracking() {
    chrome.windows.onFocusChanged.removeListener(trackWindowFocus);
    chrome.tabs.onUpdated.removeListener(trackTabUpdates);
    chrome.tabs.onActivated.removeListener(trackActiveTab);
    chrome.runtime.onMessage.removeListener(trackMessages);
  };
}

// chrome.commands.onCommand.addListener(function (command) {
// 	console.log(command);
// });

if (typeof exports !== "undefined") {
  if (typeof module !== "undefined" && module.exports) {
    exports = module.exports = trackActivity;
  }
  exports.trackActivity = trackActivity;
}
