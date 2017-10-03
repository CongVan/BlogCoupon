var colorEvent;
(function(jQuery){
    jQuery(document).ready(function(){		//when DOM is ready
        demo.init();
    });
})(jQuery);

var demo = {
	type: 'news',
	init: function() {        
        demo.initEditorToggle();
        demo.initBgStyleSwitch();
        demo.initColorPickers();
        demo.initAccentColorSwitch();
        demo.initReset();
		demo.initSwitchTypes();
        
		demo.type = demo.getType();
        var bg_style = demo.getBgStyle();
        var bg_color = demo.getBgColor();
        var accent   = demo.getAccentColor();
        
        demo.setBgStyle(bg_style);
        demo.setBgColor(bg_color);
        demo.setBgButtonState(bg_style);
        demo.setAccentColor(accent);
        demo.setAccentButtonState(accent);

		demo.setType(demo.type);
        
        jQuery('.switchable-tabs .title-default a').click(function(){
            jQuery('.switchable-tabs .title-default > a').attr('style', '');
        });
	},
    initReset: function() {
        jQuery('.reset').click(function() {
            
            demo.eraseCookie('demo_type');
			demo.eraseCookie(demo.type + '_bg_color');
            demo.eraseCookie(demo.type + '_bg_style');
            demo.eraseCookie(demo.type + '_accent_color');
            
            if(demo.type === 'tech')
            {
                demo.setBgStyle(4);
                demo.setBgButtonState(4);
                demo.setBgColor('#ffffff');
            }
            else if(demo.type == 'sport')
            {
                demo.setBgStyle(3);
                demo.setBgButtonState(3);
                demo.setBgColor('#14273a');
            }
            else if(demo.type == 'fashion')
            {
                demo.setBgStyle(1);
                demo.setBgButtonState(1);
                demo.setBgColor('#161616');
            }
            else
            {
                demo.setBgStyle(1);
                demo.setBgButtonState(1);
                demo.setBgColor('#efefef');
            }
            
            if(jQuery('#extra-stylesheet').length > 0)
            {
                jQuery('#extra-stylesheet').remove();
            }
            
            var accent = demo.getAccentColor();
            demo.setAccentButtonState(accent);

            return false;
        });
    },
    getAccentColor: function() {
        var color = demo.readCookie(demo.type + '_accent_color');
		if(color === null)
		{
			if(demo.type === 'tech')
            {
                return 'gray';
            }
            if(demo.type === 'sport')
            {
                return 'blue';
            }
            else
            {
                return 'orange';
            }
		}
        return color;
    },
    setAccentColor: function(color) {
		
		if(jQuery('#extra-stylesheet').length > 0)
		{
			jQuery('#extra-stylesheet').remove();
		}
		
        jQuery('head').append('<link id="extra-stylesheet" rel="stylesheet" type="text/css" href="' + demo_base_url + 'demo/' + demo.type + '/color-' + color + '.css">');
        
        if(color == 'gray' && demo.type == 'tech')
        {
            jQuery('.logo-image img').attr('src', demo_base_url + 'demo/images/logo-goliath-1-tech.png')   
        }
        else
        {
            jQuery('.logo-image img').attr('src', demo_base_url + 'demo/images/logo-goliath-1-' + color + '.png')
        }
        
        
        demo.createCookie(demo.type + '_accent_color', color, 1);
				
    },
    initAccentColorSwitch: function() {
        jQuery('.style-editor .accent-color a').on('click', function(e) {
                                               
            var color = jQuery(this).attr('id');
                        
            demo.setAccentColor(color);
            demo.setAccentButtonState(color);
            
            e.preventDefault();
        });
    },
    setAccentButtonState: function(color) {
        jQuery('.style-editor .accent-color a').removeClass('active');
        jQuery('#' + color).addClass('active');
    },
    initColorPickers: function() {
        
        //background color
        jQuery('.background_colorpicker').colorpicker().on('changeColor', function(ev) {
            
            demo.setBgColor(ev.color.toHex());
            
            //timeout for cookie
            clearTimeout(colorEvent);
            colorEvent = setTimeout(function() {
                demo.createCookie(demo.type + '_bg_color', ev.color.toHex(), 1);
            }, 200);
            
        });
    },
    initBgStyleSwitch: function() {
        jQuery('.style-editor .background-style a').on('click', function(e) {
                        
            var style_str = jQuery(this).attr('id');
            var style = parseInt(style_str.substring(9, 10));
            
            demo.setBgStyle(style);
            demo.setBgButtonState(style);
            demo.createCookie(demo.type + '_bg_style', style, 1);
            
            e.preventDefault();
        });
    },
    getBgStyle: function() {
		var bg = parseInt(demo.readCookie(demo.type + '_bg_style'));
		if(bg === null || isNaN(bg))
		{
			if(demo.type === 'tech')
            {
                return 4;
            }
			if(demo.type === 'sport')
            {
                return 3;
            }
            
            return 1;
		}
        return bg;
	},
    setBgStyle: function(style) {
                
        if(style === 1) //boxed active
        {
            theme.initParticles();
        }
        if(style !== 1) //remove active bg
        {
            jQuery('#particles').particleground('destroy');
        }
        
        if(style === 2) //boxed passive
        {
            //default
        }
        
        if(style === 3) //boxed image
        {
            var img_name = 'box-image.jpg';
            if(demo.type === 'sport')
            {
                img_name = 'box-image-sport.jpg';
            }
            
            jQuery('body').css({
               'background-image': 'url(' + demo_base_url + 'demo/images/' + img_name + ')',
               'background-attachment': 'fixed',
               'background-position': 'center center',
               'background-size': 'cover'
            });
        }
        if(style !== 3) //boxed image
        {
            jQuery('body').css({
               'background-image': 'none',
               'background-attachment': 'scroll'
            });
        }
        
        if(style === 4) //no box
        {
            jQuery('body').addClass('nobox');
            
            //set light background to fix issue with font colors
            if(demo.type === 'sport')
            {
                var tcolor = '#fff';
                jQuery('body').css('background-color', tcolor);        
                jQuery('.background_colorpicker').parent().children('s').text(tcolor);
                jQuery('.background_colorpicker').parent().children('span').css('background-color', tcolor);
            }
        }
        if(style !== 4) //has box
        {
            jQuery('body').removeClass('nobox');
            if(demo.type === 'sport')
            {
                demo.setBgColor(demo.getBgColor()); //reset back to current color
            }
        }
        
    },
    setBgButtonState: function(style) {
        jQuery('.style-editor .background-style .setting, .style-editor .background-style .style').removeClass('active');
        var item = jQuery('#bg_style_' + style);
        item.addClass('active');
        item.children('span').addClass('active');
    },
    setBgColor: function(color) {
        
        jQuery('body').css('background-color', color);        
        jQuery('.background_colorpicker').parent().children('s').text(color);
        jQuery('.background_colorpicker').parent().children('span').css('background-color', color);
    },
    getBgColor: function() {
		var bg = demo.readCookie(demo.type + '_bg_color');
		if(bg === null)
		{
			if(demo.type === 'news')
            {
                return '#efefef';
            }
            else if(demo.type === 'fashion')
            {
                return '#161616';
            }
            else if(demo.type === 'sport')
            {
                return '#14273a';
            }
            else
            {
                return '#ffffff';
            }
		}
        return bg;
	},
	initSwitchTypes: function() {
		jQuery('.settings.presets .setting').click(function(){
			var type = jQuery(this).attr('id');
			demo.setType(type);
            return false;
		});
	},
	getType: function() {
		var demo_type = demo.readCookie('demo_type');
		if(demo_type === null)
		{
			return 'news';
		}
		return demo_type;
	},
	setType: function(demo_type) {
		 demo.createCookie('demo_type', demo_type, 1);
		 demo.type = demo_type;
		
		 demo.eraseCookie(demo.type + '_bg_color');
         demo.eraseCookie(demo.type + '_bg_style');
         demo.eraseCookie(demo.type + '_accent_color');
         
         if(demo.type === 'tech')
         {
             demo.setBgStyle(4);
             demo.setBgButtonState(4);
             demo.setBgColor('#ffffff');
			 demo.setAccentColor('gray');
             if(jQuery('#type-stylesheet').length > 0)
             {
				jQuery('#type-stylesheet').attr('href', 'css/goliath-white.css');
             }
         }
         else if(demo.type == 'fashion')
         {
             demo.setBgStyle(1);
             demo.setBgButtonState(1);
             demo.setBgColor('#161616');
			 demo.setAccentColor('orange');
            if(jQuery('#type-stylesheet').length > 0)
            {
                jQuery('#type-stylesheet').attr('href', 'css/goliath-dark.css');
            }
         }
         else
         {
             demo.setBgStyle(1);
             demo.setBgButtonState(1);
             demo.setBgColor('#efefef');
			 demo.setAccentColor('orange');
            if(jQuery('#type-stylesheet').length > 0)
            {
                jQuery('#type-stylesheet').attr('href', 'css/goliath.css');
            }		
         }
        
         
         var accent = demo.getAccentColor();
         demo.setAccentButtonState(accent);
		
	},
    initEditorToggle: function() {
        jQuery('.style-editor .tab').on('click', function(e) {
            jQuery('.style-editor').toggleClass("off-canvas"); //you can list several class names 
            jQuery('.style-editor .tab').toggleClass("active"); //you can list several class names 
            e.preventDefault();
        });
    },
	createCookie: function(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	eraseCookie: function(name) {
		demo.createCookie(name,"",-1);
	}
};