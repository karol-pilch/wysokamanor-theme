(function ($) {
	Drupal.behaviors.wmImagePreview = {
		attach: function (context, settings) {

			// Hook up to touch events to figure out if we're touching or not
			var isTouch = false;
			$('body').on({
				touchstart: function(evt) {
					isTouch = true;
				},
				mouseup: function(evt) {
					isTouch = false;
				},
				click: function(evt) {
					isTouch = false;
				}
			});

			// Expand / collapse front page images
			$('.wm-front-page-section .wm-image-field').on({
				mouseenter: function (evt) {
					if (!isTouch) {
						Drupal.behaviors.wmImagePreview.toggleHover(this, true);
					}
				},
				mouseleave: function (evt) {
					if (!isTouch) {
						Drupal.behaviors.wmImagePreview.toggleHover(this, false);
					}
				},
				mouseup: function(evt) {
					if (isTouch) {
						Drupal.behaviors.wmImagePreview.toggleHover(this);
					}
				}
			});


			// Show full-screen preview for side images and illustrations
			$('.wm-story-side-images .wm-image-field, .wm-illustrations .wm-illustration').on('click', function (evt) {
				var fullSrc = $(this).find('img').first().attr('data-full-src');
				Drupal.behaviors.wmImagePreview.showFull(this, fullSrc);
			});

			// Handle overlay events
			function handleNext(evt) {
				var targets = Drupal.behaviors.wmImagePreview.navTargets;
				if (targets.next) {
					targets.next.trigger('click');
				}
				evt.stopPropagation();
			}

			function handlePrev(evt) {
				var targets = Drupal.behaviors.wmImagePreview.navTargets;
				if (targets.prev) {
					targets.prev.trigger('click');
				}
				evt.stopPropagation();
			}

			var overlay = $('.wm-overlay-container').first();

			// Hide the overlay on click.
			overlay.on('click', function(evt) {
				$(this).toggleClass('wm-visible', false);
			});

			// Handle next and previous buttons
			overlay.find('.wm-prev').on('click', handlePrev);
			overlay.find('.wm-next').on('click', handleNext);

			// Add class to buttons for transitions to work on mobile
			overlay.find('nav > div').on('click', function (evt) {
				console.log('Tap handler.');
				$(this)
					.addClass('wm-tapped')
					.delay(200)
					.queue(function() {
						$(this)
							.removeClass('wm-tapped')
							.dequeue();
					});
			});
		},

		expandPicture: function (container) {
			$(container).toggleClass('wm-expanded');
		},

		toggleHover: function (container, enable) {
			$(container).toggleClass('wm-hover', enable);
		},

		navTargets: {
			prev: null,
			next: null
		},

		showFull: function (container, src) {
			// Make a copy of the image field:
			var replacement = $(container).clone();

			// Replace the image with the big varsion and tell it about where it came from:
			replacement.find('img').attr('src', src);
			replacement.originalField = container;

			var overlay = $('.wm-overlay-container').first();

			// Sort out the next and previous buttons:
			var nextField = $(container).next('.wm-image-field');
			overlay.find('.wm-next')
				.toggleClass('wm-unavailable', nextField.length === 0);
			Drupal.behaviors.wmImagePreview.navTargets.next = nextField.first();

			var prevField = $(container).prev('.wm-image-field');
			overlay.find('.wm-prev')
				.toggleClass('wm-unavailable', prevField.length === 0);
			Drupal.behaviors.wmImagePreview.navTargets.prev = prevField.first();

			// Put the copied image field to the overlay and show it:
			overlay
				.toggleClass('wm-visible', true)
					.find('.wm-image-field')
					.replaceWith(replacement);
		},

		hideFull: function(container) {
			$(container).toggleClass('wm-visible', false)
		}
	};
})(jQuery);
