(function (d) {
  /** @type{NodeListOf<HTMLDivElement>} */
  const keys = d.querySelectorAll(".key");
  const audioList = d.querySelectorAll("audio");

  const audioMap = new Map([...audioList].map((el) => [el.dataset.key, el]));
  const keysMap = new Map([...keys].map((el) => [el.dataset.key, el]));

  d.body.onkeydown = /** @param {KeyboardEvent} event */ (event) => {
    const code = (event.keyCode || event.which).toString();
    const audio = audioMap.get(code);
    if (audio) {
      audio.currentTime = 0;
      audio.playbackRate = 1;
      audio.play();
      // Let the sound start, then do this...
      setTimeout(() => {
        const key = keysMap.get(code);
        if (key) {
          key.classList.add("playing");
          const hits = ((parseInt(key.dataset.hits) || 0) + 1) % 10;
          key.style.transform = `translateY(${hits * 10}px)`;
          key.dataset.hits = hits;
        }
      }, 10);
    }
  };

  audioList.forEach((ele) => {
    ele.addEventListener("ended", (event) => {
      const code = event.target.dataset.key;
      const key = keysMap.get(code);
      if (key) {
        key.classList.remove("playing");
      }
    });
  });
})(document);
