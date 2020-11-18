$(document).ready(() => {

	console.log('Script ready');

	$(window).on('message onmessage', function (event) {
		var data = event.originalEvent.data.toString();
		if (data === "help_getContentHeight") {
			/** @type {MessageEventSource} */
			var source = event.originalEvent.source;
			var origin = event.originalEvent.origin;

			/** @param {number} height */
			function reportHeight(height) {
				var msg = "help_getContentHeight=" + height.toFixed(0);
				source.postMessage(msg, origin);
			}

			/** @param {string} name */
			function reportAnchorOffset(name) {
				if (name) {
					if (name[0] === '#') name = name.substring(1);
					var anchor = $(`a[name='${name}']`).first();
					if (anchor) {
						var msg = "help_scrollToOffset=" + $(anchor).position().top.toFixed(0);
						source.postMessage(msg, origin);
					}
				}
			}

			try {
				var firstDiv = document.querySelector("div");

				// Actively report changes to the element height.
				new ResizeObserver(
						/** @param {ResizeObserverEntry[]} entries */
						entries => reportHeight(entries[0].contentRect.height))
					.observe(firstDiv);

				// Include details of current anchor, if any.
				reportAnchorOffset(document.location.hash);

				// Report anchor clicks on bookmarks.
				$("a[href^='#']").click(function (event) {
					var url = new URL(event.currentTarget.href);
					reportAnchorOffset(url.hash);
				});

			} catch (ex) {
				// console.error(ex);
			}
		}
	});

});