const toUser = (el) => {
  const email = el.querySelector("span.fontSizeMS").textContent;
  const name = el.querySelector("span.fontWeightSemiBold").textContent;
  return [email, name];
};
const users = new Map(
  [...document.querySelectorAll(".page-content tbody a")].map(toUser)
);

const target = document.querySelector(".bolt-page.v-scroll-auto");
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      const newUsers = [...mutation.addedNodes]
        .map(toUser)
        .filter((u1) => !users.has(u1[0]));
      if (newUsers.length) {
        newUsers.forEach((u1) => users.set(...u1));
        console.log("total", users.size);
      }
      // Dump when all have been found.
      if (users.size === 291) {
        console.log(users.entries());
        observer.disconnect();
      }
    }
  });
});
observer.observe(target, {
  childList: true,
  subtree: true,
});
