const regisBtn = document.querySelector(".regis-btn");
const treoBtn = document.querySelector(".treo-btn");

const inputIds = ["subjectCode", "creditCode"];

// Load saved values on popup open
inputIds.forEach((id) => {
  const input = document.getElementById(id);
  if (input) {
    const savedValue = localStorage.getItem(`popup_${id}`);
    if (savedValue !== null) {
      input.value = savedValue;
    }
    input.addEventListener("input", () => {
      localStorage.setItem(`popup_${id}`, input.value);
    });
  }
});

//send the data the content.js
regisBtn.addEventListener("click", () => {
  const data = {
    subjectCode: document.getElementById("subjectCode").value.trim(),
    creditCode: document.getElementById("creditCode").value.trim(),
    regisType: document.getElementById("regisType").value,
    href: "https://dkhp.hcmue.edu.vn/student",
  };

  chrome.runtime.sendMessage(
    {
      type: "OPEN_NEW_TAB",
      data: data,
    },
    (res) => {
      console.log("response from background", res);
    }
  );
});
