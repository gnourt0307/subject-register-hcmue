if (location.href === "https://dkhp.hcmue.edu.vn/login") {
  chrome.runtime.sendMessage({ type: "CLOSE_ME" });
}

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "START_REGISTRATION") {
    console.log(location.href);
    console.log(msg.data);
    let subjectCodeSearch = msg.data.subjectCode;
    console.log("Starting registration for subject code:", subjectCodeSearch);
    await register(subjectCodeSearch, msg);
  }
});

async function register(subjectCodeSearch, msg) {
  let flag = false;
  const object = document.querySelectorAll(".MuiTableRow-root.NotIsRegised");

  for await (const item of object) {
    const subjectCode = item.children[1].innerText;
    console.log(subjectCode);
    // const ltc = item.children[1].innerText;
    if (subjectCode.includes(subjectCodeSearch)) {
      const btn = item.querySelector("button");
      btn.click();

      const target = document.querySelector(".MuiBackdrop-root");

      const observer = new MutationObserver(async (mutations) => {
        for await (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            const visibility = target.style.visibility;
            if (visibility === "hidden") {
              observer.disconnect();

              const tbrows = document.querySelectorAll(
                "#RegistScheduleUnit > table > tbody tr"
              );

              console.log("tbrows", tbrows);

              let available = false;

              for await (const row of tbrows) {
                const input = row.querySelector("input");
                const lhp = row.querySelectorAll("td")[3].innerText;
                if (
                  input.type === "radio" &&
                  !input.disabled &&
                  lhp.includes(msg.data.creditCode)
                ) {
                  console.log("condition true");
                  input.click();
                  const regisBtn = document.querySelector(
                    ".MuiButton-root.MuiButton-contained.MuiButton-containedPrimary"
                  );
                  regisBtn.click();
                  flag = true;
                  available = true;
                  break;
                }
              }

              if (available === false) {
                console.log("No available slots found");
                for await (const row of tbrows) {
                  const input = row.querySelector("input");
                  if (input.type === "radio" && !input.disabled) {
                    input.click();
                    const regisBtn = document.querySelector(
                      ".MuiButton-root.MuiButton-contained.MuiButton-containedPrimary"
                    );
                    regisBtn.click();
                    flag = true;
                    break;
                  }
                }
              }

              if (flag === false) {
                const returnBtn = document.querySelector(
                  ".MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeMedium.MuiButton-outlinedSizeMedium.MuiButtonBase-root"
                );
                returnBtn.click();
                await register(subjectCodeSearch, msg);
              }
            }
          }
        }
      });

      observer.observe(target, {
        attributes: true,
        attributeFilter: ["style"],
      });
    } else {
      console.log(false);
    }
  }
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
