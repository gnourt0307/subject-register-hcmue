console.log("script working perfectly");

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "INPUT_DATA") {
    console.log("Got input from popup:", msg.data);
    await (async () => {
      const A = await waitForElementAll(".MuiFormControlLabel-root"); // wait for A

      const B = await waitForElementAll(".MuiTableRow-root.NotIsRegised"); // wait for C

      const regisTypes = document.querySelectorAll(".MuiFormControlLabel-root");
      let index = 0;
      for await (const regisType of regisTypes) {
        if (regisType.innerText === msg.data.regisType && index === 0) {
          console.log("first option");
          chrome.runtime.sendMessage({
            type: "START",
            data: msg.data,
          });
          break;
        } else if (regisType.innerText === msg.data.regisType && index > 0) {
          console.log("other option");
          regisType.click();

          const target = document.querySelector(".MuiBackdrop-root");

          const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
              if (
                mutation.type === "attributes" &&
                mutation.attributeName === "style"
              ) {
                const visibility = target.style.visibility;
                if (visibility === "hidden") {
                  observer.disconnect();
                  chrome.runtime.sendMessage({
                    type: "START",
                    data: msg.data,
                  });
                }
              }
            }
          });

          observer.observe(target, {
            attributes: true,
            attributeFilter: ["style"],
          });
        }
        index++;
      }
    })();
  }
});

function waitForElement(selector, root = document.body) {
  return new Promise((resolve) => {
    // If it's already there
    const existing = root.querySelector(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = root.querySelector(selector);
      if (el) {
        resolve(el);
        observer.disconnect();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });
}

function waitForElementAll(selector, root = document.body) {
  return new Promise((resolve) => {
    // If it's already there
    const existing = root.querySelectorAll(selector);
    if (existing.length) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = root.querySelectorAll(selector);
      if (el.length) {
        resolve(el);
        observer.disconnect();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });
}
