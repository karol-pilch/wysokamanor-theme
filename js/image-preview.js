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

			// Save all images to use for next and prev buttons:
			Drupal.behaviors.wmImagePreview.allImages = $('.wm-story-side-images .wm-image-field, .wm-illustrations .wm-illustration');

			// Show full-screen preview for side images and illustrations:
			Drupal.behaviors.wmImagePreview.allImages.on('click', function (evt) {
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
				var target = $(evt.target);

				// Ignore clicks on the nav and on the image.
				if (target.parents('.wm-image-label').length === 0 &&
						!target.hasClass('wm-image-label') &&
					  target.prop('tagName') != 'IMG') {
					Drupal.behaviors.wmImagePreview.hideFull();
				}
			});

			// Handle next and previous buttons
			overlay.find('.wm-prev').on('click', handlePrev);
			overlay.find('.wm-next').on('click', handleNext);

			// Add class to buttons for transitions to work on mobile
			overlay.find('nav > div').on('click', function (evt) {
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

		// container: image field where click originated.
		showFull: function (container, src) {
			// Make a copy of the image field:
			var replacement = $(container).clone();

			// Replace the image with the big varsion and tell it about where it came from:
			replacement.find('img')
				.attr('src', src)
				.removeAttr('alt');
			replacement.originalField = container;

			var overlay = $('.wm-overlay-container').first(),
			    allImages = Drupal.behaviors.wmImagePreview.allImages,
			    currentIndex = allImages.index(container),
			    prevIndex = currentIndex > 0 ? currentIndex - 1 : null,
			    nextIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : null;

			// Sort out the next and previous buttons:
			overlay.find('.wm-prev')
				.toggleClass('wm-unavailable', prevIndex === null);
			Drupal.behaviors.wmImagePreview.navTargets.prev = prevIndex === null ? null : $(allImages.get(prevIndex));

			overlay.find('.wm-next')
				.toggleClass('wm-unavailable', nextIndex === null);
			Drupal.behaviors.wmImagePreview.navTargets.next = nextIndex === null ? null : $(allImages.get(nextIndex));

			// Put the copied image field to the overlay and show it:
			overlay
				.toggleClass('wm-visible', true)
					.find('.wm-image-field, .wm-illustration')
					.replaceWith(replacement);

			// Add a class to body
			$('body').toggleClass('wm-has-overlay', true);
		},

		hideFull: function() {
			$('.wm-overlay-container').toggleClass('wm-visible', false);
			$('body').toggleClass('wm-has-overlay', false);
		}
	};
})(jQuery);
