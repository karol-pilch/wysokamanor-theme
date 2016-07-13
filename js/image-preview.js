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
				Drupal.behaviors.wmImagePreview.showFull(this, 'FIGUREMEOUT');
			});

		},

		expandPicture: function (container) {
			$(container).toggleClass('wm-expanded');
		},

		toggleHover: function (container, enable) {
			$(container).toggleClass('wm-hover', enable);
		},

		showFull: function (container, src) {
			console.log('You clicked on a picture with full source: ' + src);
		}
	};
})(jQuery);
