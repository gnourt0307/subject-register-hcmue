chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "OPEN_NEW_TAB") {
    chrome.tabs.create(
      { url: "https://dkhp.hcmue.edu.vn/student", active: false },
      (tab) => {
        chrome.tabs.onUpdated.addListener(async function listener(tabId, info) {
          if (tabId === tab.id && info.status === "complete") {
            console.log(tab.id, info);
            await chrome.tabs.sendMessage(tab.id, {
              type: "INPUT_DATA",
              data: msg.data,
            });

            await chrome.tabs.onUpdated.removeListener(listener); // cleanup
          }
        });
      }
    );
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "START" && sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "START_REGISTRATION",
      data: msg.data,
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "CLOSE_ME" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});
