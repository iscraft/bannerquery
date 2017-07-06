$(function(){
	(function( banner, ctrlWrap ){
		if( !banner.length ) return;
		var li = banner.find(".bquery>.blist");
		var link = li.children("a");

		var firstli = li.eq(0);
		var currli = firstli;
		var currlink = currli.find("a").attr("href");
		var currurl = currli.find("img").attr("src");
		var nextli = currli.next("li");

		var filterWrap = $('<div class="bfilter">').appendTo( banner );
		var queue = $( Array(21).join('<a href="javascript:void(0);"><img src="" /></a>') ).appendTo( filterWrap );
		var reverseQueue = Array.prototype.reverse.call( filterWrap.children("a") );
		var filterImg = queue.children("img");

		var ctrl = $( $.map(li, function(){//创建控制点
			return '<a href="javascript:void(0);"></a>';
		}).join() ).appendTo( ctrlWrap );

		var currLeft = 0;
		var imgWidth = 0;
		var winWidth = $(window).width();
		function autoResize( speed ){
			var currWidth = 0;

			if ( winWidth <= 1000 ) {
				currWidth = 1000;
				currLeft = ( 1000 - imgWidth ) / 2;
			} else if( winWidth >= imgWidth ) {
				currWidth = imgWidth;
				currLeft = 0;
			} else {
				currWidth = winWidth;
				currLeft = ( winWidth - imgWidth ) / 2;
			}

			TweenLite.to( link, speed, {
				"left" : currLeft
			});

			banner.add( li ).width( currWidth );

			queue.width( Math.ceil( currWidth / queue.length ) );

			banner.find(".bfilter").children("a").each(function(i){//resize滤镜图片 位置
	            $(this).children("img").css( "left", -$(this).position().left + currLeft );
	        });
		}

		var timer = null;
		function winResize(){
			winWidth = $(window).width();
			if ( timer ) {
				clearTimeout( timer );
				timer = null;
			}

			timer = setTimeout(function(){
				autoResize( 0.2 );
			}, 200)
		}

		var autoTimer = null;
		var isRun = false;
		function imgLoad(){
			winWidth = $(window).width();
			imgWidth = img.width;
			autoResize(0);
			$(window).on("resize", winResize);

			ctrlWrap.children("a:eq(0)").addClass("curr");

			li.eq(0).show();
			banner.find(".bfilter").children("a").each(function(i){//初始化滤镜图片 位置 及宽度
				$(this).css( "left", ( i * 5 ) + "%" );
				$(this).children("img").css( "left", -$(this).position().left + currLeft );
			});
			queue.attr("href", currlink);
			filterImg.attr("src", currurl);//初始化

			ctrl.on("click", function(){
				if ( isRun || $(this).hasClass("curr") ) return;
				isRun = true;
				
				ctrl.removeClass("curr");
				$(this).addClass("curr");
				nextli = li.eq( $(this).index() );
				init();

				if ( autoTimer ) {
	            	clearTimeout( autoTimer );
	            	autoTimer = null;
	            }
			});
		}

		var img = new Image();
		$(img).on("load", imgLoad);
		img.src = link.children("img")[0].src;

        function complete(){
            currli = nextli;
            currurl = nextli.find("img").attr("src");
            nextli = currli.next("li");
            nextli = nextli.length ? nextli : firstli;
            filterImg.attr("src", currurl);
            
            isRun = false;

            autoTimer = setTimeout(function(){
            	var curr = ctrl.filter(".curr").next("a");
            	curr = curr.length ? curr : ctrl.eq(0);
            	curr.trigger("click");
            },3000);
        }

        function reset(){
            filterWrap.css({
                "bottom" : 0
            });
            queue.css({
                "top" : "auto",
                "bottom" : "auto",
                "opacity" : 1
            });
        }

        function animate(target, css){
            TweenMax.staggerTo( target , 1 , css, 0.05, complete);
        }

        var css = {
            top :  {
                "top" : -570,
                "opacity" : 0
            },
            bottom : {
                "bottom" : -570,
                "opacity" : 0
            },
            lr : {
                "opacity" : 0
            }
        }

        var filter = {
            top : function(){
                animate(queue, css.top);
            },
            topReverse : function(){
                animate(reverseQueue,  css.top);
            },
            bottom : function(){
                animate(queue, css.bottom);
            },
            bottomReverse : function(){
                animate(reverseQueue, css.bottom);
            },
            left : function(){
                animate(queue, css.lr);
            },
            right : function(){
                animate(reverseQueue, css.lr);
            }
        }

        function init(){
            reset();
            filter[ ["top", "topReverse", "bottom", "bottomReverse", "left", "right"][ Math.round( Math.random() * 5 ) ] ]();
            currli.hide();
            nextli.show();
        }

        autoTimer = setTimeout(function(){
        	var curr = ctrl.filter(".curr").next("a");
        	curr = curr.length ? curr : ctrl.eq(0);
        	curr.trigger("click");
        },3000);

	})( $("#bannerQuery"), $("#bannerCtrl") );

});