let toUser = (el) => {
  let name = el.querySelector("span.fontWeightSemiBold")?.textContent;
  let email = el.querySelector("span.fontSizeMS")?.textContent;
  return [name, email];
};

let pageContent = document.querySelector(".page-content");
let users = new Map([...pageContent.querySelectorAll("tbody a")].map(toUser));

let target = document.querySelector(".bolt-details-panel .bolt-page.v-scroll-auto");
let btn = document.createElement("button");
btn.style = "position: fixed; color: black; background-color: yellow; z-index: 99";
btn.innerText = `Download ${users.size}`;
pageContent.insertBefore(btn, pageContent.firstChild);

btn.onclick = () => {
  let data = [["Name", "Email"], ...users.entries()].map(([key, value]) => `"${key}","${value}"`).join("\n");
  var anchor = document.createElement("a");
  anchor.download = "data.csv";
  var dataBlob = new Blob([data], {
    type: "application/vnd.ms-excel;charset=UTF-8",
  });
  anchor.href = window.URL.createObjectURL(dataBlob);
  anchor.click();
};

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      let newUsers = [...mutation.addedNodes].filter((node) => node instanceof HTMLElement).map(toUser);
      if (newUsers.length) {
        newUsers.forEach((u1) => users.set(...u1));
        btn.innerText = `Download ${users.size}`;
      }
    }
  });
});
observer.observe(target, {
  childList: true,
  subtree: true,
});

let priorScrollTop = -1;
let scroller = setInterval(() => {
  if (target.scrollTop !== priorScrollTop) {
    priorScrollTop = target.scrollTop;
    target.scroll(0, target.scrollTop + target.clientHeight);
  } else {
    clearInterval(scroller);
  }
}, 100);
