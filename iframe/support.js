$(document).ready(() => {

	const CONTENT_HEIGHT_MSG = "help_getContentHeight";
	const SCROLL_OFFSET_MSG = "help_scrollToOffset";

	$(window).on('message onmessage', function (event) {
		var data = event.originalEvent.data.toString();
		if (data === CONTENT_HEIGHT_MSG) {
			/** @type {MessageEventSource} */
			var source = event.originalEvent.source;
			var origin = event.originalEvent.origin;

			/** @param {number} height */
			function reportHeight(height) {
				var msg = `${CONTENT_HEIGHT_MSG}=${Math.trunc(height)}`;
				source.postMessage(msg, origin);
			}

			/** @param {string} name */
			function reportAnchorOffset(name) {
				if (name) {
					if (name[0] === '#') name = name.substring(1);
					$(`a[name='${name}']`).each((_, el) => {
						var msg = `${SCROLL_OFFSET_MSG}=${Math.trunc($(el).position().top)}`;
						source.postMessage(msg, origin);
					});
				}
			}

			try {
				var firstDiv = document.querySelector("div");

				new ResizeObserver(
						/** @param {ResizeObserverEntry[]} entries */
						entries => reportHeight(entries[0].contentRect.height))
					.observe(firstDiv);

				// Include details of current anchor.
				reportAnchorOffset(document.location.hash);

				$("a[href^='#'").click(function (event) {
					var url = new URL(event.currentTarget.href);
					reportAnchorOffset(url.hash);
				});

			} catch (ex) {
				console.error(ex);
			}
		}
	});


});