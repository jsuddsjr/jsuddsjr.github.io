$(document).ready(() => {
  console.log("Script ready");

  $(window).on("message onmessage", function (event) {
    var data = event.originalEvent.data;

    if (data === "help_startNotifications") {
      notificationEngineSingleton
        .instance()
        .startNotifications(event.originalEvent);
    }
  });

  var notificationEngineSingleton = (function () {
    // Internal engine object, not instantiated yet.
    function NotificationEngine() {
      /** @type {MessageEventSource} */
      var source;

      /** @type {string} */
      var origin;

      /** @param {MessageEvent<string>} event */
      this.startNotifications = (event) => {
        // Do nothing if already notifying.
        if (source) return;

        source = event.source;
        origin = event.origin;

        /** @param {number} height */
        function reportHeight(height) {
          console.log(_instance);
          var msg = "help_setFrameHeight=" + height.toFixed(0);
          source.postMessage(msg, origin);
        }

        /** @param {string} name */
        function reportAnchorOffset(name) {
          if (name) {
            if (name[0] === "#") name = name.substring(1);
            var $anchor = $(`a[name='${name}']`).first();
            if ($anchor) {
              var msg =
                "help_scrollToOffset=" + $anchor.position().top.toFixed(0);
              source.postMessage(msg, origin);
            }
          } else {
            source.postMessage("help_scrollToOffset=0", origin);
          }
        }

        try {
          // Avoid using ID here for uniform support across all page types.
          var containerDiv = document.querySelector("div");

          // Actively report changes to the element height.
          new ResizeObserver((entries) =>
            reportHeight(entries[0].contentRect.height)
          ).observe(containerDiv);

          // Include offset of current anchor, if any.
          reportAnchorOffset(document.location.hash);

          // Report anchor clicks on bookmarks.
          $("a[href^='#']").click(function (event) {
            var url = new URL(event.currentTarget.href);
            reportAnchorOffset(url.hash);
            event.preventDefault();
          });
        } catch (ex) {
          // console.error(ex);
        }
      };
    }

    /** @type {NotificationEngine} */
    var _instance;
    return {
      instance: () => _instance || (_instance = new NotificationEngine()),
    };
  })();
});
