let toUser = (el) => {
  const name = el.querySelector("span.fontWeightSemiBold")?.textContent;
  const email = el.querySelector("span.fontSizeMS")?.textContent;
  return [name, email];
};

let pageContent = document.querySelector(".page-content");
let users = new Map([...pageContent.querySelectorAll("tbody a")].map(toUser));

let btn = document.createElement("button");
btn.style = "position: fixed; color: black; background-color: yellow; z-index: 99";
btn.innerText = `Download ${users.size}`;
pageContent.insertBefore(btn, pageContent.firstChild);

btn.onclick = () => {
  const data = [["Name", "Email"], ...users.entries()].map(([key, value]) => `"${key}","${value}"`).join("\n");
  const anchor = document.createElement("a");
  anchor.download = "data.csv";
  const dataBlob = new Blob([data], {
    type: "application/vnd.ms-excel;charset=UTF-8",
  });
  anchor.href = window.URL.createObjectURL(dataBlob);
  anchor.click();
};

let target = document.querySelector(".bolt-details-panel .bolt-page.v-scroll-auto");
let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      const newUsers = [...mutation.addedNodes]
        .filter((node) => node instanceof HTMLElement)
        .map(toUser)
        .filter((u1) => !users.has(u1[0]));
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
