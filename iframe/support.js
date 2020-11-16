
/*! Copyright (C) Microsoft. All rights reserved.       */

// Javascript code shared across all of Support.Office.Com
// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable UnknownCssClass
// Sometimes a control inside of an article might want to "suspend" the state of its contents.
// For example, an expando might want to pause the videos inside of it when it is closed. The following function
// provides a way to register functions that have such a "suspending" effect on content so that an article
// control can later have occe.suspendStateOfContents(...) called on it to have its content state suspended.
// This way, controls don't have to know anything about how to suspend state, but instead delegate the responsibility
// to these functions. These functions being registered must take a single argument that represents the
// element that needs its contents suspended.
occe.registerArticleControlStateSuspensionFunction = function (functionToRegister) {
	occe.articleControlStateSuspensionFunctions = occe.articleControlStateSuspensionFunctions || [];

	if (occe.articleControlStateSuspensionFunctions.indexOf(functionToRegister) < 0) {
		occe.articleControlStateSuspensionFunctions.push(functionToRegister);
	}
};

// "Suspends" the state of the contents of the specified element. See comments on
// occe.registerArticleControlStateSuspensionFunction for more details.
occe.suspendStateOfContents = function ($element) {
	if (typeof occe.articleControlStateSuspensionFunctions !== 'undefined') {
		for (var functionIndex = 0; functionIndex < occe.articleControlStateSuspensionFunctions.length; functionIndex++) {
			occe.articleControlStateSuspensionFunctions[functionIndex]($element);
		}
	}
};

function getParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
		results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Manages expand/collapse action and state of expandos
occe.bindExpando = function (b, s) {
	var $expandoHead = $(b);
	var $expandoHeadLinks = $expandoHead.find('a');

	$expandoHeadLinks.each(function (slotCounter) {
		$(this).attr('data-bi-slot', slotCounter + 1);
	});
	$expandoHeadLinks.attr('data-bi-mto', '');

	$(b).click(function (e) {
		e.preventDefault();

		var $expandoHead = $(this);
		var $expandoBodyWrapper = $expandoHead.next();

		var isExpandoOpened = $expandoHead.hasClass('opened');
		if (isExpandoOpened) {
			occe.suspendStateOfContents($expandoBodyWrapper);
		}

		$expandoHead.toggleClass('opened');

		if (!isExpandoOpened) {
			$expandoBodyWrapper.find(s).slideDown(150);
			$expandoHead.find('i').removeClass('ms-Icon--chevronThinDown').addClass('ms-Icon--chevronThinUp');
			$expandoHead.find('a').attr('aria-expanded', 'true');
			sendAwaDataOnExpandoClick($expandoHead, 'EXPAND');
		} else {
			$expandoBodyWrapper.find(s).slideUp(150);
			$expandoHead.find('i').removeClass('ms-Icon--chevronThinUp').addClass('ms-Icon--chevronThinDown');
			$expandoHead.find('a').attr('aria-expanded', 'false');
			sendAwaDataOnExpandoClick($expandoHead);
		}
	});

	function sendAwaDataOnExpandoClick($expandoHead, action) {
		if (typeof window.awa === 'object') {
			var awaBehavior = action === 'EXPAND' ? window.awa.behavior.EXPAND : window.awa.behavior.REDUCE;
			var $expandoHeadLink = $expandoHead.find('a');
			var awaTags = {
				behavior: awaBehavior,
				actionType: 'CL',
				contentTags: {
					contentName: $expandoHeadLink.text().trim(),
					areaName: 'expando',
					slotNumber: $expandoHeadLink.attr('data-bi-slot')
				}
			}
			window.awa.ct.captureContentPageAction(awaTags);
		}
	}
};

occe.pageParam = encodeURIComponent(occe.GetQueryStringParam('p'));
occe.searchQuery = encodeURIComponent(occe.GetQueryStringParam('query'));

var maximumScrollDepth;
var $scrollWindow;
var $ocGuided = '#ocGuided';

if ($($ocGuided).is($ocGuided)) {
	$('#ocIGWMac').attr('href', '#ocGuidedMacPer');
	$('#ocGuidedMacPer').removeClass('ocIGWHide');

	var ocpubStep = 'ms.ocpub.step';

	var FireStepEvent = function (stepName) {
		var screenLoadTags = {};
		screenLoadTags['ms.interactiontype'] = '4';
		screenLoadTags[ocpubStep] = stepName;
		$('#ocForum,#ocChat,#ocCall,#ocCallMobile,#ocMop,#ocSocial').attr(ocpubStep, stepName);
	};

	//IGW Helper functions for Image swap and smooth scrolling of the screens.

	$('#ocForum,#ocChat,#ocCall,#ocCallMobile,#ocMop,#ocSocial').attr(ocpubStep, 'Landing Page');
	var imgSwap = function (a, b) {
		var c = '';
		$(a).hover(
			function () {
				c = $(this).find('img').attr('src');
				$(this).find('img').attr('src', b);
			},
			function () {
				$(this).find('img').attr('src', c);
			});
	};

	$('.ocHelpHide').before("<div class='ocSpacer'></div>");
	function ocAutoHeight(oah) {
		var winHi = window.innerHeight;
		var elHi = oah;
		var osHi = (winHi - elHi - 140) + 'px';
		return osHi;
	}

	function elemPush(ep) {
		//placeholder to calculate the height of all previous elements and set that as the scrollTop
		return ep;
	}

	var igwNewScreen = function (a, b, c, d, e) {
		$(d).hide();
		$(a).removeClass('ocHide');
		$(a).fadeIn(function () {
			var ah = $(a).height();
			$('.ocSpacer').css('height', ocAutoHeight(ah));
			$('html, body').animate({
				scrollTop: $(a + ' h2').first().offset().top
			}, 750);
			$(this).find('.ocULRow li:first-child a').focus();
			if (e !== 13) {
				$(this).find('.ocULRow li:first-child a').css('outline', 0).focusout(function () {
					//Focus Handler to determine if user is tabbing. If so make sure element displays focus outline
					$(this).removeAttr('style');
					$(this).focus();
					$(this).unbind('focusout');
				});
			}
		});
		$('.ocHelpHide').fadeIn();
		if ($('#guided-type').val() === 'commercial') {
			c += ' (Commercial)';
		}
		FireStepEvent(c);
	};

	var switchCustomerType = function (tagSelector, attributeName, targetAttribute) {
		$(tagSelector).each(function () {
			$(this).attr(targetAttribute, $(this).attr(attributeName));
		});
	};

	var displayAccountPrep = function (selector, e) {
		var fwLink = selector.attr('href');
		$('#ocGuidedJump a.grnBtn').attr('href', fwLink);
		$('#ocGuidedJump a.grnBtn').attr('ms.ea_offer', selector.attr('data-consumer-jump-ms.ea_offer'));
		igwNewScreen('#ocGuidedJump', 600, selector.attr('ms.ocpub.step'), '.ocIGWHide', e.which);
	};

	imgSwap('#ocIGWWin', 'https://support.content.office.net/en-US/media/522cab37-0a34-48c0-8fa3-f5826aa1f573.png');
	imgSwap('#ocIGWMac', 'https://support.content.office.net/en-US/media/e42af494-9cf9-40ed-9721-02b372ff0419.png');
	imgSwap('#ocIGWMobile', 'https://support.content.office.net/en-US/media/41a53d29-c51d-40b8-9ec4-7cee8d284c8a.png');
	imgSwap('#ocIGWAndroid', 'https://support.content.office.net/en-US/media/ca53833e-b216-46e2-8260-ee250567a0d3.png');
	imgSwap('#ocIGWIphone', 'https://support.content.office.net/en-US/media/a44bd5eb-fcee-4c43-b152-cff296a5f25a.png');
	imgSwap('#ocIGWTablet', 'https://support.content.office.net/en-US/media/6d92e2bd-2dd0-4ce9-8249-366bc12a010f.png');
	imgSwap('#ocIGWIpad', 'https://support.content.office.net/en-US/media/60a136cd-cc95-410d-9d42-7893bc637db2.png');

	$('#ocIGWHome').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			e.preventDefault();
			igwNewScreen('#ocGuidedSecond', 600, 'Where Install', '.ocIGWHide, #ocGuidedMacPer, #ocGuidedMobile', e.which);

			//Replace Links
			switchCustomerType('a', 'data-consumer-href', 'href');
			switchCustomerType('a', 'data-consumer-ms.ocpub.step', 'ms.ocpub.step');
			switchCustomerType('a', 'data-consumer-ms.ea_offer', 'ms.ea.offer');
			switchCustomerType('a', 'data-consumer-ms.ocpub.stepaction', 'ms.ocpub.stepaction');
			switchCustomerType('a', 'data-consumer-ms.interactiontype', 'ms.interactiontype');
			$('#guided-type').val('consumer');
		}
	});

	$('#ocIGWCom').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			e.preventDefault();
			igwNewScreen('#ocGuidedSecond', 600, 'Where Install', '.ocIGWHide, #ocGuidedMacPer, #ocGuidedMobile', e.which);

			//Replace Links
			switchCustomerType('a', 'data-commercial-href', 'href');
			switchCustomerType('a', 'data-commercial-ms.ocpub.step', 'ms.ocpub.step');
			switchCustomerType('a', 'data-commercial-ms.ea_offer', 'ms.ea.offer');
			switchCustomerType('a', 'data-commercial-ms.ocpub.stepaction', 'ms.ocpub.stepaction');
			switchCustomerType('a', 'data-commercial-ms.interactiontype', 'ms.interactiontype');
			$('#guided-type').val('commercial');
		}
	});

	$('#ocIGWMobile').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($(this).attr('href').indexOf('http') === -1) {
				e.preventDefault();
				igwNewScreen('#ocGuidedMobile', 1200, 'Choose Device', '.ocIGWHide, #ocGuidedMacPer', e.which);
			}
		}
	});
	$('#ocIGWAndroid').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($(this).attr('href').indexOf('#') !== -1) {
				e.preventDefault();
				igwNewScreen('#ocGuidedAndroid', 1620, 'Android Phone Install', '.ocIGWHide', e.which);
			} else {
				return true;
			}
		}
		return true;
	});
	$('#ocIGWIphone').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($(this).attr('href').indexOf('#') !== -1) {
				e.preventDefault();
				igwNewScreen('#ocGuidedIphone', 1620, 'iPhone Install', '.ocIGWHide', e.which);
			} else {
				return true;
			}
		}
		return true;
	});
	$('#ocIGWIpad').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($(this).attr('href').indexOf('#') !== -1) {
				e.preventDefault();
				igwNewScreen('#ocGuidedIpad', 1620, 'iPad Install', '.ocIGWHide', e.which);
			} else {
				return true;
			}
		}
		return true;
	});
	$('#ocIGWAndroidTablet').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($(this).attr('href').indexOf('#') !== -1) {
				e.preventDefault();
				igwNewScreen('#ocGuidedAndroidTablet', 1620, 'Android Tablet Install', '.ocIGWHide', e.which);
			} else {
				return true;
			}
		}
		return true;
	});
	$('#ocIGWMac').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($(this).attr('href').indexOf('http') === -1) {
				e.preventDefault();
				igwNewScreen('#ocGuidedMacPer', 900, 'Which Office for Mac', '.ocIGWHide, #ocGuidedMobile', e.which);
			}
		}
	});
	$('#ocIGWMac2011').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			e.preventDefault();
			igwNewScreen('#ocGuidedMacPK', 2000, 'Mac Product Key Prep', '.ocIGWHide, #ocGuidedJump, #ocGuidedMacPK', e.which);
		}
	});

	$('.ocGuidedJump').on('click keypress', function (e) {
		if (e.which === 13 || e.type === 'click') {
			if ($('#guided-type').val() === 'consumer') {
				e.preventDefault();
				if ($(this).attr('id') !== 'ocIGWMac365') {
					$('.ocIGWHide, #ocGuidedJump, #ocGuidedMacPK, #ocGuidedMacPer').hide();
				} else {
					$('.ocIGWHide, #ocGuidedJump, #ocGuidedMacPK').hide();
				}
				displayAccountPrep($(this), e);
			}
		}
	});

	//Styling Fallback for Flexboxes (Responsive Feature)
	if ($('html').hasClass('flexboxlegacy')) {
		$('#ocGuided ul.ocULRow').each(function () {
			$(this).addClass('flexboxlegacy');
		});
	} else {
		$('#ocGuided ul.ocULRow').each(function () {
			$(this).addClass('no-flexboxlegacy');
		});
	}
}

$(function () {
	// TODO - class "ocSearchBox" is likely legacy and does not exist any more.
	// Please verify and either remove or update. https://office.visualstudio.com/DefaultCollection/MAX/_workitems?id=758563&_a=edit
	// If removing, please look up all instances of ocSearchBox to remove in this file.
	var $ocSearchBox = $('.ocSearchBox');
	var $ocSearchDefaultText = $('#ocSearchDefaultText');

	//Set Default Text of .ocSearchBox overriding .htm's default value per OM#1441966
	if ($ocSearchBox.attr('placeholder') !== $ocSearchDefaultText.val() && $ocSearchBox.attr('placeholder') === $ocSearchBox.val()) {
		$ocSearchBox.val($ocSearchDefaultText.val());
	}

	var sDefaultText = $ocSearchDefaultText.val();

	var componentGroupLookup = function ($elem) {
		var bicmpToken = 'bicmp-';
		var $cmpElem = $elem.closest("[class^='" + bicmpToken + "'],[class*=' " + bicmpToken + "']");
		if ($cmpElem.length > 0) {
			var classes = $cmpElem.attr('class').toString().split(' ');
			for (var i = 0; i < classes.length; i++) {
				if (classes[i].indexOf(bicmpToken) !== -1) {
					$elem.attr('ms.cmpgrp', classes[i].replace(bicmpToken, ''));
					break;
				}
			}
		} else {
			var elemCmpgrp = $elem.attr('ms.cmpgrp');
			if (typeof elemCmpgrp === 'undefined' || elemCmpgrp === 'null') {
				$elem.attr('ms.cmpgrp', 'content');
			}
		}
	};

	// Checks to see if there is a bookmark in the link, and if so, if it matches the current asset guid.
	var isSamePageLinkBookmark = function (href, assetId) {
		if (href && href.indexOf('#') !== -1) {
			var guidRegEx = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i;
			var match = guidRegEx.exec(href);

			if (match) {
				var matchedString = match[0].toLowerCase();
				return matchedString === assetId.toLowerCase();
			}
			return true;
		}

		return false;
	};

	var wedcsInit = function () {
		//set wedcs tags
		var assetId = occe.getMetaTagValue('ms.ocpub.assetID');

		$('a,img').each(function () {
			var $elem = $(this);
			var elemId = $elem.attr('id');
			var elemHref = $elem.attr('href');
			//build ms.cmpgrp
			if (typeof elemId !== 'undefined' && elemId !== null) {
				if (elemId.toLowerCase() === 'occhat') {
					$elem.attr('ms.cmpgrp', 'CSSControl').attr('ms.ea_action', 'Goto').attr('ms.ea_offer', 'CHT');
				} else if (elemId.toLowerCase() === 'ocsocial') {
					$elem.attr('ms.cmpgrp', 'CSSControl').attr('ms.ea_action', 'Goto').attr('ms.ea_offer', 'SOC');
				} else if (elemId.toLowerCase() === 'ocforum') {
					$elem.attr('ms.cmpgrp', 'CSSControl').attr('ms.ea_action', 'Goto').attr('ms.ea_offer', 'FRM');
				} else if (elemId.toLowerCase() === 'occall') {
					$elem.attr('ms.cmpgrp', 'CSSControl').attr('ms.ea_action', 'Goto').attr('ms.ea_offer', 'PHN');
				} else if (elemId.toLowerCase() === 'ocmop') {
					$elem.attr('ms.cmpgrp', 'CSSControl').attr('ms.ea_action', 'Goto').attr('ms.ea_offer', 'MOP');
				} else if (elemId.toLowerCase() === 'ocfacebookbutton' || elemId.toLowerCase() === 'octwitterbutton' ||
					elemId.toLowerCase() === 'ocemailbutton' || elemId.toLowerCase() === 'oclinkedinbutton') {
					$elem.attr('ms.cmpgrp', 'Share').attr('ms.ea_action', 'Goto').attr('ms.ea_offer', 'SOC');
				}
				else {
					componentGroupLookup($elem);
				}
			} else if (typeof elemHref !== 'undefined' && elemHref !== null) {
				if (elemHref.toLowerCase().indexOf('#odh_') !== -1) {
					$elem.attr('ms.cmpgrp', 'ODH');
				} else {
					componentGroupLookup($elem);
				}
			} else {
				componentGroupLookup($elem);
			}

			//set page area
			if ($elem.closest('.headBar').length) {
				$elem.attr('ms.pgarea', 'Header');
			} else if ($elem.closest('.swBar').length) {
				$elem.attr('ms.pgarea', 'AppDropdown');
			} else if ($elem.closest('.footerContainer').length) {
				$elem.attr('ms.pgarea', 'Footer');
			} else {
				$elem.attr('ms.pgarea', 'Body');
			}

			var href = $elem.attr('href');
			if ((typeof href !== 'undefined') && href.length && href.indexOf('.') === -1 && (isSamePageLinkBookmark(href, assetId) || (href.indexOf('javascript:void(0)') !== -1))) {
				if ((typeof $elem.attr('ms.interactiontype') === 'undefined') || (typeof $elem.attr('id') !== 'undefined' && $elem.attr('id').indexOf('shell') !== -1)) {
					$elem.attr('ms.interactiontype', '11');
				}
			}

			if (($elem.prop('tagName').toLowerCase() === 'img') && ($elem.closest('a').length === 0)) {
				if (typeof $elem.attr('ms.interactiontype') === 'undefined') {
					$elem.attr('ms.interactiontype', '500');
				}
			}
		});

		(function () {
			var $shellCategoryHeader = $('.js-cat-head');
			if ($shellCategoryHeader.length) {
				$shellCategoryHeader.find('a').removeAttr('ms.title');
				$shellCategoryHeader.find('a,div').removeAttr('ms.cmpgrp');
				$shellCategoryHeader.find('ul').removeAttr('ms.cmpnm');
				$shellCategoryHeader.attr('ms.pgarea', 'Header');
			}

			var $shellHeaderActions = $('.c-search');
			if ($shellHeaderActions.length) {
				$shellHeaderActions.removeAttr('ms.cmpgrp');
				$shellHeaderActions.removeAttr('ms.cmpnm');
			}

			var $shellFooter = $('#footerArea');
			if ($shellFooter.length) {
				$shellFooter.find('a').removeAttr('ms.title');
				$shellFooter.find('a,div').removeAttr('ms.cmpgrp');
				$shellFooter.find('div').removeAttr('ms.cmpnm');
				$shellFooter.attr('ms.pgarea', 'Footer');
			}
		})();

		var pageType = $("meta[name='ms.pagetype']").attr('content');

		if (((typeof pageType !== 'undefined' && pageType !== null) && pageType.toLowerCase() !== 'serp')
			&& ((typeof assetId !== 'undefined' && assetId !== null) && assetId.toLowerCase() !== 's.hp.phone' && assetId.toLowerCase() !== 's.cl.nav')) {

			//guided
			occe.removeMetaTag('ms.ocpub.step');
		}
	};

	// TODO - .ocFBRadioBtnAnchor no longer exists in new feedback. Confirm that this code is not needed and remove
	// https://office.visualstudio.com/DefaultCollection/MAX/_workitems?id=758563&_a=edit

	// Handle clicks on Yes/No for feedback:
	// 1) Toggles the class "selected", which switches between images for the
	// custom radio buttons made out of spans.
	// 2) Sets/unsets the appropriate values for aria-checked for accessibility.
	// 3) Shows the reply box for feedback
	$('.ocFBRadioBtnAnchor').on('click keydown', function handleYesNoFeedback(e) {
		// On click, enter keypress, and space keypress. TODO (mitontch) when done with onActivatingInteraction, switch to that
		if (e.type === 'click' || e.which === 13 || e.which === 32) {
			e.preventDefault();

			var $allFbButtonIcons = $('.ocFBRadioBtnAnchor');
			var $currentFbButtonIcon = $(this);

			// Visually clear all selected checkboxes and then select the current one
			$allFbButtonIcons.removeClass('selected');
			$currentFbButtonIcon.addClass('selected');

			// Reset all checked states to false and then mark the current button as selected
			$allFbButtonIcons.attr('aria-checked', false);
			$currentFbButtonIcon.attr('aria-checked', true);

			$('#ocFBReply').removeClass('ocHidden');

		}
	});

	// TODO - Remove after removing BRS for smart feedback control - https://office.visualstudio.com/DefaultCollection/MAX/_workitems?id=758563&_a=edit
	//Count down from 255 characters in feedback control
	window.countDown = function (n, t, i) {
		var u = n.value.length,
			f = n.value,
			r = document.getElementById(i);
		r.style.display = '';
		r.innerHTML = t - u;
		u >= t - 10 ? (r.style.color = 'red', u > t && (n.innerHTML = f.substring(0, t), r.innerHTML = t - n.value.length)) : r.style.color = '';
	};

	// TODO - .ocFBSubmit no longer exists in new feedback. Confirm that this code is not needed and remove
	// https://office.visualstudio.com/DefaultCollection/MAX/_workitems?id=758563&_a=edit
	$('.ocFBSubmit').click(function () {
		$('#ocFBReply').add('#ocFBBegin').remove();
		$('#ocFBFinal').show();
	});

	$ocSearchBox.focus(function () {
		if ($ocSearchBox.val() === sDefaultText) {
			$ocSearchBox.val('');
		}
	});

	$ocSearchBox.focusout(function () {
		if ($.trim($ocSearchBox.val()) === '') {
			$ocSearchBox.val(sDefaultText);
		}
	});

	// wedcs setup code for proper tagging
	occe.setPreviousAssetId();
	occe.setSessionAssetValue();
	wedcsInit();
});

//Set Awa area name attributes
$('.ocSearchResultTitle').attr('data-bi-area', 'results');

//Set Awa name attribute on links with images
$('a:has(img)').each(function () {
	var $anchorLink = $(this);
	if (typeof $anchorLink.attr('data-bi-name') === 'undefined') {
		$anchorLink.attr('data-bi-name', $anchorLink.find('img').attr('alt'));
	}
});

// add ContactUsExperienceEntryPointAssetId to UHF Contact Us link for entry point and experience tracking
$(function () {
	$('#footerArea a[href$="/home/contact"]')
		.attr('href', function () {
			var footerContactUsUrl = $(this).attr('href');
			var contactUsExperienceEntryPointAssetId = occe.getMetaTagValue('ms.ocpub.assetID');
			return occe.updateQueryStringParameter('ContactUsExperienceEntryPointAssetId', contactUsExperienceEntryPointAssetId, footerContactUsUrl);
		})
		.attr('data-bi-bhvr', 'CALL');
});

$(function () {
	//supportmodeAppend
	var sm = occe.GetQueryStringParam('supportmode');

	$('#b_content a, .ocpArticleContent a').each(function () {
		$(this).click(function (e) {
			if (sm) {
				e.preventDefault();
				window.location.href = occe.updateQueryStringParameter('supportmode', sm, this.href);
			}
		});
	});


	// Validate that each expando body has a matching heading. If not, then show that expando content section.
	// We start at ocpExpandoBody, go up to its parent, and get check to see if that parents prev sibling is an expando title. If it doesn't exist or not
	// marked as an expando title then show the content. This is to protect against authoring errors since
	// there is currently no authoring validation that will catch this.
	$('.ocArticle .ocpSection .ocpExpandoBody').each(function () {
		var $parentPrevSibling = $(this).parent().prev();

		if (!$parentPrevSibling.hasClass('ocpExpandoHead')) {
			$(this).css('display', 'block');
		}
	});


});

$('#ocSearchNavHome').on('click', function () {
	var iFrame = document.getElementById('ocSearchIFrame');

	if (typeof iFrame !== 'undefined' && iFrame !== null) {
		iFrame.contentWindow.location = HomeInfo.HomeUrl.replace(/&amp;/g, '&');
	}
});

//This function is expected to be in the global (window) name space. Do not change scope
function ClientNavSearch(searchData) {
	if (typeof searchData === 'undefined' || searchData === null) {
		return;
	}

	try {
		occe.sendAwaClientSearchEvent(searchData);
	} catch (e) { }

	if (searchData.href != null) {
		window.location.href = searchData.href;
	}
}

function ButtonAction(actionData) {
	if (typeof window.awa !== 'object') {
		return;
	}

	var awaMetaData = { // default setting is regular search box.
		actionType: 'CL',
		behavior: actionData.behaviorId,
		content: {
			formnm: actionData.formnm ? actionData.formnm : occe.getFormName(),
			areaName: 'inAppNavBar',
			contentId: actionData.contentId,
			contentName: actionData.contentName
		}
	};

	if (actionData.captureScrollDepth === true) {
		var documentHeight = $(document).height();

		//If user has submitted feedback, feedback control will close and max depth will exceed document height.
		//The user has reached the bottom, but max depth should not exceed document height.
		if (maximumScrollDepth > documentHeight) {
			maximumScrollDepth = documentHeight;
		}
		awaMetaData.content["scrolldepth"] = scrolldepth;
	}

	window.awa.ct.captureContentPageAction(awaMetaData);

	if (actionData.behaviorId == awa.behavior.NAVIGATIONBACK) {
		history.back();
	}

	if (actionData.behaviorId == awa.behavior.UNDEFINED && actionData.href) {
		window.location.href = actionData.href;
	}
}

//Show the Feedback control on the Client if the page is not a homepage.
if (!$('.ocpClientHome').length) {
	$('.ocFB').show();
}

occe.bindExpando('.ocpExpandoHead', '.ocpExpandoBody');

// Seed the search input text area with the query string, if it exists.
(function seedSearchBoxOnLoad() {
	var seedSearchBoxWithQuery = function () {
		var query = occe.GetQueryStringParam('query');
		if (query) {
			$('#cli_shellHeaderSearchInput').val(query);
		}
	};

	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', seedSearchBoxWithQuery);
	} else if (document.attachEvent) {
		document.attachEvent('DOMContentLoaded', seedSearchBoxWithQuery);
	}
})();

//Scroll tracking needs to remain enabled in help pane for fake unload event below.
$(function trackAndReportHelpPaneShowHide() {
	maximumScrollDepth = window.innerHeight;
	$scrollWindow = $(window);
	if (typeof $scrollWindow !== 'undefined' && $scrollWindow !== null) {
		$scrollWindow.scroll(function updateMaximumScrollDepthAsUserScrolls() {
			if (typeof $scrollWindow !== 'undefined' && $scrollWindow !== null) {
				var currentScrollDepth = $scrollWindow.height() + $scrollWindow.scrollTop();
				maximumScrollDepth = Math.max(maximumScrollDepth, currentScrollDepth);
			}
		});
	}
});

$(function () {
	// If SOC is not top window, we're in OneShell. Propagate certain events for OneShell to handle
	if (window.self !== window.top) {
		// Bubble ESC key event
		$(window).keyup(function (evt) {
			if (evt.which === 27) {
				window.top.postMessage('SocEscKey', '*');
			}
		});
	}
});

$(function setupSignInCallout() {
	//set banner state based on cookie existance
	occe.Controls.SignIn.initializeBanners($('.supSignInCalloutContainer, .supAdminBanner'));

	// Set up event handlers for hiding admin and sign in messages
	occe.Controls.SignIn.setBannerDismissEvents($('.supDismissPrompt'), $('.supSignInCalloutContainer'));

	// Set up timer to reset signin prompt position based on UHF state.
	occe.Controls.SignIn.setSigninBannerHeight($('.supSignInCalloutContainer'), $('#meControl'));
});

// Send message to close pane for Universal app.
if (window.external) {
	$(window).keyup(function (keyEvent) {
		if (keyEvent.which === 27) {
			try {
				var message = {
					messageType: "Keyboard",
					messageContent: { keyCode: 27 }
				};
				window.external.notify(JSON.stringify(message));
			} catch (e) { }
		}
	});
};

$(window).on('message onmessage', function (event) {
	var data = event.originalEvent.data;

	// Getter for the height property to allow iframe hosts to size adequately
	if (data === 'help_getClientHeight') {
		event.originalEvent.source.postMessage("help_getClientHeight=" + document.body.scrollHeight, event.originalEvent.origin);
	// Back button on SharePoint Help pages which point to SOC
	} else if (data === 'help_historyBack') {
		history.back();
	// Forward button on SharePoint Help pages which point to SOC
	} else if (data === 'help_historyForward') {
		history.forward();
	}
});

// ReSharper restore UnknownCssClass
// ReSharper restore UseOfImplicitGlobalInFunctionScope


console.log("supprt.js Loaded");

