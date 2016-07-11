(function ($) {
	Drupal.behaviors.wmImagePreview = {
		attach: function (context, settings) {
			// Expand / collapse front page images
			$('.wm-front-page-section .wm-image-field').on({
				touchend: function (evt) {
					if (evt.hasFired) {
						return;
					}
					Drupal.behaviors.wmImagePreview.expandPicture(this);
					evt.hasFired = true;
				}, 
				mouseenter: function (evt) {
					Drupal.behaviors.wmImagePreview.toggleHover(this, true);
				}, 
				mouseleave: function (evt) {
					Drupal.behaviors.wmImagePreview.toggleHover(this, false);
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
			console.log('Toggling to ' + enable);
			$(container).toggleClass('wm-hover', enable);
		},

		showFull: function (container, src) {
			console.log('You clicked on a picture with full source: ' + src);
		}
	};
})(jQuery);