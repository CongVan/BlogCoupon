var fireEvent;
(function(jQuery){
    jQuery(document).ready(function(){		//when DOM is ready
        theme.init();
    });
    jQuery(window).resize(function() {
        clearTimeout(fireEvent);
        fireEvent = setTimeout(theme.resizeEvent, 200);
	});
})(jQuery);
jQuery(window).load(function() {
	jQuery("body").removeClass("preload");
    theme.initGallery();
    theme.initPostNavigation();
});

var theme = {
	mosaicTimeout: false,
    init: function() {
		theme.initComments();
        theme.initMosaic();
		theme.positionNewStories();
        theme.initMenuAnimation();
        theme.setDropdownMargin();
        theme.initTouchMenu();
        theme.initDropdownPostFilter();
        theme.initWidgetTabs();
        theme.initNewsTicker();
        theme.initScrollTop();
        theme.initOverlays();
		theme.initReviewSummary();
        theme.initReadProgress();
		theme.initParticles();
		theme.initTouchClick();
        theme.initMobileCarouselSlide();
        theme.initGalleriesIntroMargin();
        theme.initMenuWidthFix();
		theme.initShortcodeTab();
	},
    resizeEvent: function() {
        theme.positionNewStories();
        theme.positionGalleryControls();
        theme.setPostNavigationPosition();
    },
    initComments: function() {
        //form submit
        jQuery('#comment-submit').click(function(){
            jQuery('#hidden-submit').trigger('click');
            return false;
        });
    },
    initMosaic: function() {
        
        if(jQuery('.mosaic').length > 0) 
        {
            theme.setMosaicContentMargin();
            jQuery('.mosaic .title').animate({
                'opacity': 1
            }, 100);
        
            jQuery('.mosaic button').click(function(){

                return false;
            });

            if(jQuery('.mosaic').offset().top < 500)
            {
				//hide when dropdown is open
                jQuery('.nav > .dropdown').hover(
                    function(){
                    },
                    function(){
                        theme.enableMosaicAfterMenu();
                    }
                );
            }
        }
    },
    setMosaicContentMargin: function(){
        jQuery('.mosaic .intro').each(function(){
            var mosaicintroheight = jQuery(this).outerHeight();
            jQuery(this).css('marginBottom', '-' + mosaicintroheight + 'px');
        });
    },
    initMenuAnimation: function() {
        
        //launch dropdown hover
        jQuery('[data-hover="dropdown"]').dropdownHover();
        
        jQuery('.dropdown').on('show.bs.dropdown', function(e){
		                
            if(jQuery(window).width() < 768 && !jQuery(this).hasClass('new-stories'))
            {
                jQuery('.navbar-wrapper-responsive .menu .nav .search').show();
            }

            var menu = jQuery(this).find('.dropdown-menu').first();
			menu.hide();
            menu.stop(true, true).animate({
                opacity:"toggle",
            }, { duration: 180, queue: false }, 'linear');
            
            if(menu.length > 0)
            {
                if(jQuery('.mosaic').length > 0 && jQuery('.mosaic').offset().top < 500)
                {					

					jQuery('.mosaic .overlay').css('background-color', 'rgba(0, 0, 0, 0.8)');
					
                    jQuery('.mosaic .title').animate({
                        'opacity': '0.15'
                    }, { duration: 100, queue: false }, 'linear' );
                    
          			window.clearTimeout(theme.mosaicTimeout);
                }
            }
        });

        // ADD SLIDEUP ANIMATION TO DROPDOWN //
        jQuery('.dropdown').on('hide.bs.dropdown', function(e){
            jQuery(this).find('.dropdown-menu').first().fadeOut(180);
			theme.enableMosaicAfterMenu();
			if(jQuery(window).width() < 768)
			{
				jQuery('.navbar-wrapper-responsive .menu .nav .search').fadeOut(180);
			}
        });
        
        //force mosaic enable if mouse leaves menu
        jQuery('.navbar .dropdown').hover(function(){
            //do nothing
        },
        function() {
           	theme.animateMosaicFadeOut();
           	window.clearTimeout(theme.mosaicTimeout);
        });
        
    },
    animateMosaicFadeOut: function() {
        
        jQuery('.mosaic .overlay').css('transition', 'none');
        
        jQuery('.mosaic .overlay').animate({
            'background-color': 'rgba(0, 0, 0, 0)'
        }, { duration: 50, queue: false }, 'linear').promise().done(function(){
            jQuery('.mosaic .overlay').attr('style', '');
        });
        jQuery('.mosaic .title').animate({
            'opacity': '1'
        }, { duration: 50, queue: false }, 'linear');
        
    },
    enableMosaicAfterMenu: function() {
	    window.clearTimeout(theme.mosaicTimeout);

	    theme.mosaicTimeout = window.setTimeout(function(){
	        theme.animateMosaicFadeOut();
	    }, 200);
    },
    positionNewStories: function() {
        
        var menu_wrap = jQuery('.navbar-wrapper:not(.navbar-wrapper-responsive) .container').outerWidth();
        var new_stories = jQuery('.menu-primary ul.nav > .new-stories');
        var others = jQuery('.menu-primary ul.nav > li').not(new_stories);
        var spacer = jQuery('.menu-primary .menu-spacer');

        spacer.attr('style', '');
        
        var other_width = 0;
        others.each(function(index) {
            other_width += parseInt(jQuery(this).outerWidth(), 10);
        });

        var diff = menu_wrap - other_width - new_stories.outerWidth() - 20;

        if(diff > 0)
        {
            spacer.css('width', diff);
        }
        
    },
    initTouchMenu: function() {
        if('ontouchstart' in document)
        {
            //no dropdown
			jQuery('.navbar-wrapper:not(.navbar-wrapper-responsive) .nav > li:not(.dropdown) > a').on('touchstart', function(){
				return true;
			});
           
            //first level of dropdowns
            jQuery('.navbar-wrapper:not(.navbar-wrapper-responsive) .nav .dropdown .dropdown-toggle').on('touchstart', function(){
                
                var current_item = jQuery(this);
                //if there are other open menus, hide them
                if(jQuery('.nav .menu-item.dropdown.open .dropdown-toggle').not(this).length > 0)
                {
                    jQuery('.nav .menu-item.dropdown.open').each(function(){
                        if(current_item.parent() !== jQuery(this))
                        {
                            jQuery(this).removeClass('open');
                            jQuery(this).children('.dropdown-toggle').trigger('hide.bs.dropdown');
                        }
                    });
                }
                
                var parent = jQuery(this).parent();
                if(!parent.hasClass('open'))
                {
                    jQuery(this).parent().addClass('open');
                    jQuery(this).trigger('show.bs.dropdown');
                    return false;
                }
                
                //for search and new stories close dropdown, rest follow link
                if(parent.hasClass('open') && ( parent.hasClass('new-stories') || parent.hasClass('search')))
                {
                    jQuery(this).parent().removeClass('open');
                    jQuery(this).trigger('hide.bs.dropdown');
                    return false;
                }
            });
            
            //second level of dropdowns
            jQuery('.navbar-wrapper:not(.navbar-wrapper-responsive) .nav .dropdown .dropdown > a').on('touchstart', function(){
              
                var current_item = jQuery(this).parent();
                //if there are other open menus, hide them
                if(jQuery('.nav .dropdown .dropdown').not(this).length > 0)
                {
                    jQuery('.nav .dropdown .dropdown.open').each(function(){
                        if(current_item.parent() !== jQuery(this))
                        {
                            jQuery(this).removeClass('open');
                        }
                    });
                }
                                
                if(!current_item.hasClass('open'))
                {
                    current_item.addClass('open');
                    return false;
                }
                
            });
            
            
            //close menu
			jQuery('.homepage-content, .header, .footer').on('touchstart', function(){
				var open = jQuery('.navbar-wrapper:not(.navbar-wrapper-responsive) .nav .dropdown.open');
				if(open.length > 0)
				{
					open.removeClass('open');
                    open.trigger('hide.bs.dropdown');
				}
			});			
            
        }
    },
    initDropdownPostFilter: function() {
        
        jQuery('.dropdown-menu .item').click(function(e){
            e.stopPropagation();
        });
        
        jQuery('.dropdown-category-posts .items').hide();
        jQuery('.dropdown-category-posts .items').first().show();
        
        jQuery('.dropdown-menu .tags a').click(function(){
            
            var href = jQuery(this).attr('href');
            jQuery(this).siblings().removeClass('active');
            jQuery(this).addClass('active');
            
            var items = jQuery(href);
            if(typeof items != 'undefined')
            {
                jQuery(this).parents('.dropdown-menu').find('.items').hide();                
                items.css('display', 'table');
                theme.setDropdownMarginSpecific(items.find('.intro'));
            }
            
            return false;
        });
    },
    setDropdownMargin: function() {
        jQuery('.menu .dropdown-menu .items .intro').each(function(){
            
            var parent = jQuery(this).parents('.menu .dropdown-menu');
            parent.css({
                position:   'absolute', // Optional if #myDiv is already absolute
                visibility: 'hidden',
                display:    'block'
            });
            
            var dropdownintroheight = jQuery(this).outerHeight();
            parent.attr('style', '');
            jQuery(this).css('marginBottom', '-' + dropdownintroheight + 'px');
        });
    },
    setDropdownMarginSpecific: function(items) {
        items.each(function(){
            var dropdownintroheight = jQuery(this).outerHeight();
            jQuery(this).css('marginBottom', '-' + dropdownintroheight + 'px');
        });
    },
    initWidgetTabs: function() {
        jQuery('.switchable-tabs .title-default a').click(function(){
            var parent = jQuery(this).parents('.switchable-tabs');
            var index = parent.find('.title-default a').index(jQuery(this));
            parent.find('.title-default a').removeClass('active');
            jQuery(this).addClass('active');
            parent.find('.tabs-content .items').fadeOut(250).promise().done(function(){
                parent.find('.tabs-content .items').eq(index).fadeIn(250);
            });
            
            return false;
        });
    },
    initNewsTicker: function() {
                
        jQuery('.trending .pause').click(function(){
        
            if(jQuery('.trending .pause').hasClass('active'))
            {
                jQuery('#newsticker').cycle('resume');
                jQuery('.trending .pause').removeClass('active');
            }
            else
            {
                jQuery('#newsticker').cycle('pause');
                jQuery('.trending .pause').addClass('active');
            }
            
            return false;
        });
        
        //adjust width
        var title_width = jQuery('.trending > .title-default > a').width() ;
        jQuery('.trending .items').css('marginLeft', title_width+19);
        
        jQuery('.trending').hover(function(){
            jQuery('.trending .items').css('marginLeft', title_width+80);
            jQuery('.trending .controls').css('left', title_width+15);
        },
        function(){
            jQuery('.trending .items').css('marginLeft', title_width+19);
        });
    },
    initScrollTop: function() {
        //show the back to top button
        var offset = 220;
        var duration = 500;
        jQuery(window).scroll(function() {
            if (jQuery(this).scrollTop() > offset) {
                jQuery('.back-to-top').fadeIn(duration);
            } else {
                jQuery('.back-to-top').fadeOut(duration);
            }
        });
        
        //to the scrolling
        jQuery('.back-to-top').click(function(event) {
            event.preventDefault();
            jQuery('html, body').animate({scrollTop: 0}, duration);
            return false;
        });
    },
    loadOverlay: function(obj){
        if(obj.parents('.navbar').length > 0) { return false; }
        if(jQuery(window).outerWidth()+15 <= 970) { return false; }
        if(jQuery('html').hasClass('touch')) { return false; }
                
        //remove ALL others
        jQuery('.post-item-overlay').remove();

        var long_text = obj.attr('data-overlay-excerpt');
        var overlay = obj.clone();
        var url = obj.attr('data-overlay-url');
        overlay.addClass('post-item-overlay');

        var position = obj.position();
        if(obj.parents('.carousel-inner').length > 0)
        {
            var top = position.top + 4;
            var left = position.left - 22;
            var padding = 44;
        }
        else
        {
            var top = position.top - (20 - (parseInt(obj.css('marginTop')) + parseInt(obj.css('paddingTop')))) + parseInt(obj.css('borderTopWidth')); //there is 20px margin for overlay
            var left = position.left - (20 - (parseInt(obj.css('marginLeft')) + parseInt(obj.css('paddingLeft')))); //there is 20px margin for overlay
            var padding = 40;
        }
                
        overlay.attr('style', ''); //reset style tag
        overlay.css({ top: top, left: left });
        overlay.width(obj.width() + padding);

        var more = '<a href="' + url + '" class="more-link">Read more</a>';

        var intro = overlay.find('.post-intro, .intro');
        if(intro.length === 0)
        {
            var title = overlay.find('.title');
            if(title.lenght > 0)
            {
                title.after('<div class="intro">' + long_text + '</div>');
            }
            else
            {
                overlay.append('<div class="intro">' + long_text + '</div>');
            }
        }
        else
        {
            intro.text(long_text);
        }

        overlay.find('.post-intro, .intro').append(more);
        overlay.appendTo(obj.parents('.items').parent()).fadeIn(150); //1 level above .items
    },
    initOverlays: function() {
        
	    jQuery('[data-overlay="1"]').hoverIntent({
	        over: function(){
	            theme.loadOverlay(jQuery(this));
	        },
	        out: function(){

	        },
	        interval: 80
	    });

	    jQuery('.post-block-1, .post-block-2, .post-block-3, .widget-tabs, .slider-tabs').on('mouseleave', '.post-item-overlay', function(){
	        jQuery(this).fadeOut(150).promise().done(function(){
	            jQuery(this).remove();
	        });
	    });

    },
    initGallery: function() {
            
	    jQuery('.gallery-item-open .gallery-slideshow').on('cycle-post-initialize', function(){
	        theme.positionGalleryControls();
	    });
	    jQuery('.gallery-item-open .gallery-slideshow').cycle();
    },
    positionGalleryControls: function() {
        
	    var height = 0;
	    jQuery('.gallery-slideshow .image img').each(function(){
	        if(jQuery(this).height() > height)
	        {
	            height = jQuery(this).height();
	        }
	    });
	    var marginTop = height / 2;
	    jQuery('.gallery-item-open .control').css('margin-top', marginTop - 50);
    },
    initReviewSummary: function() {        
        jQuery('.overview .rating').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
            if (isInView === true) {
                
                var bar_w = jQuery(this).find('.content span').width();

                jQuery(this).find('.content s').each(function(){
                    var percent = jQuery(this).attr('data-value');
                    var add_width = ((percent*bar_w)/100)+'px';

					jQuery(this).animate({
                        'width': '+=' + add_width 
                    }, 1000, 'easeInQuart');
                });
                jQuery(this).unbind('inview');

            }
        });  
    },
    initReadProgress: function() {
        var bar = jQuery('.read-progress');
        if(bar.length > 0)
        {
            theme.setReadProgress();
            
            jQuery(window).scroll(function(){
                theme.setReadProgress();
            });
        }
    },
    setReadProgress: function() {
        var bar = jQuery('.read-progress');
        if(bar.length > 0)
        {
            var post = jQuery('.main-content-column-1 > .post');            
            var progress = (jQuery(window).scrollTop() + jQuery(window).height() - post.offset().top) / post.outerHeight(true) * 100;
            bar.children('span').width(progress + '%');
        }
    },
    initPostNavigation: function() {
            
	    if(jQuery('.post-1-navbar').length > 0)
	    {        
	        jQuery('body').scrollspy({ target: '.post-1-navbar', offset: 45 });
	        theme.setPostNavigationPosition();
        
	        jQuery('.post-1-navbar > ul > li').first().addClass('active');
        
	        jQuery('.post-1-navbar a').click(function(){
	            var selector = jQuery(this).attr('href');
	            jQuery('html, body').animate({ scrollTop: jQuery(selector).offset().top - 45}, 500); 
	            return false;
	        });
        
	    }
    },
    setPostNavigationPosition: function() {
                    
	    if(jQuery('.post-1-navbar').length > 0)
	    {
	        if(jQuery(window).width() > 1320)
	        {
	            //position of main title
	            var top_postion = jQuery('.main-content-column-1').offset().top; 
	            var menu_height = 30;

	            jQuery('.post-1-navbar').css('top', top_postion);

	            jQuery('.post-1-navbar').affix({
	                offset: {
	                    top: top_postion-menu_height,
	                    bottom: function () {
	                        return (this.bottom = jQuery('.footer').outerHeight(true));
	                    }
	                }
	            });
	        }
	        else
	        {
	            jQuery('.post-1-navbar').attr('style', '');
	        }
	    }
        
    },
    initParticles: function() {
        //only for large screens
        if(jQuery('#particles').length > 0 && jQuery(window).width() > 970)
        {
            jQuery('#particles').particleground({
				dotColor: '#e3e3e3',
				lineColor: '#e3e3e3',
                parallax: false,
                particleRadius: 6,
                minSpeedX: 1,
                minSpeedY: 1,
                maxSpeedX: 2,
                maxSpeedY: 2
            });

            jQuery(window).scroll(function() {
                if(jQuery(window).width() > 970)
                {
                    jQuery('#particles').particleground('start').delay(10).particleground('pause');
                }
            });
        }
    },
    initTouchClick: function() {
        if (jQuery('html').hasClass('touch'))   //this needs to work also on touch laptops
        {
            jQuery('.touch-click').click(function(){
                var closest_link = jQuery(this).find('a').eq(0).attr('href');
                if(typeof closest_link !== "undefined")
                {
                    window.location = closest_link;
                }
            });
        }
    },
    initMobileCarouselSlide: function() {
        if (jQuery('html').hasClass('touch'))   //this needs to work also on touch laptops
        {
            jQuery('.carousel').carousel();//it just needs the JS re-initialize action
        }
    },
    initGalleriesIntroMargin: function() {
        jQuery('.latest-galleries .gallery-item .intro').each(function(){
            var mosaicintroheight = jQuery(this).outerHeight();
            if(mosaicintroheight > 0)
            {
                jQuery(this).css('marginBottom', '-' + mosaicintroheight + 'px');
            }
        });
    },
    initMenuWidthFix: function() {
        var menu = jQuery('.menu-primary');
        if(menu.width() > 970)
        {
            var width = menu.find('ul.nav').width();
            while(width > 970)
            {
                menu.find('ul.nav > li').last().remove();
                width = menu.find('ul.nav').width();
				console.log(width);
            }
        }
    },
	initShortcodeTab: function() {
		if(jQuery('.tab-shortcode').length > 0)
		{
			jQuery('.tab-shortcode .title-default a').click(function(){
				
				var siblings = jQuery(this).parent().children()
				var index = siblings.index(jQuery(this));
				
				siblings.removeClass('active');
				jQuery(this).addClass('active');
				
				jQuery('.tab-shortcode .tab-content').fadeOut(500).promise().done(function(){
		           jQuery('.tab-shortcode .tab-content').eq(index).fadeIn();
		        });				
				
				return false;
			});
		}
	}
};

function chunk (arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}
jQuery.fn.outerHTML = function() {
  return jQuery('<div />').append(this.eq(0).clone()).html();
};