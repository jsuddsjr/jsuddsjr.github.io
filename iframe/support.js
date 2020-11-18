$(document).ready(() => {

	console.log("Script injected");

	const CONTENT_HEIGHT_MSG = "help_getContentHeight";
	const ANCHOR_OFFSET_MSG = "help_getAnchorOffset";
	const SCROLL_OFFSET_MSG = "help_scrollToOffset";

	/** @type {MessageEventSource} */
	var source;
	var origin;

	/**
	 * Save for persistent connection.
	 *  @param {MessageEvent} event */
	function cacheEventSource(event) {
		source = event.source;
		origin = event.origin;
	}

	/** @param {number} height */
	function reportHeight(height) {
		if (!source) return;
		var msg = `${CONTENT_HEIGHT_MSG}=${Math.trunc(height)}`;
		source.postMessage(msg, origin);
	}

	/** @param {string} name */
	function reportAnchorOffset(name) {
		if (!source) return;
		if (name) {
			if (name[0] === '#') name = name.substring(1);
			$(`a[name='${name}']`).each((_, el) => {
				var msg = `${SCROLL_OFFSET_MSG}=${Math.trunc($(el).position().top)}`;
				source.postMessage(msg, origin);
			});
		}
	}

	$(window).on('message onmessage', function (event) {
		var data = event.originalEvent.data.toString();
		if (data === CONTENT_HEIGHT_MSG) {
			cacheEventSource(event.originalEvent);

			try {
				var $ocHelpDiv = $("section").first();
				// reportHeight($ocHelpDiv.height());

				$("a[href^='#']").click(function (event) {
					var url = new URL(event.currentTarget.href);
					reportAnchorOffset(url.hash);
				});

				new ResizeObserver(
						/** @param {ResizeObserverEntry[]} entries */
						entries => reportHeight(entries[0].contentRect.height))
					.observe($ocHelpDiv[0]);

				// Include details of current anchor.
				reportAnchorOffset(document.location.hash);
			} catch (ex) {
				console.error(ex);
			}

		} else if (data.indexOf(ANCHOR_OFFSET_MSG) === 0) {
			cacheEventSource(event.originalEvent);

			var value = data.substring(ANCHOR_OFFSET_MSG.length + 1);
			reportAnchorOffset(value);
		}
	});


});