/**
 * $Date$
 * 
 * Revision: $Revision$
 * 
 * 
 * Imagetool
 * 
 * Imagetool is a simple plugin for jQuery providing basic cropping and scaling capabilities for images.
 *
 * It works by wrapping the selected image in a <div> (the viewport) and manipulates css properties based on user input.
 *
 * Tested in Safari 3, Firefox 2, MSIE 6, MSIE 7
 * 
 * Version 1.0
 * August 8, 2008
 *
 * Copyright (c) 2008 Bendik Rognlien Johansen
 * 
 * @desc Adds editing capabilities to image (<img>) elements
 * @author Bendik Rognlien Johansen
 * @version 1.0
 *
 * @name Imagetools
 * @type jQuery
 *
 * @cat plugins/Media
 * 
 * @example $('img').imagetool({options});
 * @desc Add editing capabilities to image (<img>) elements
 * @options
 *
 *   allowZoom:  (boolean) If true, the image is zoomable.
 *               default: true
 *
 *   allowPan:   (boolean) If true, the image can be panned.
 *               default: true
 *
 *
 *   maxWidth: (number) The maximum width of the zoomed image.
 *             required: no
 *             default: 2000
 *
 *   viewportWidth: (number) The width (pixels) of the viewport.
 *                  required: yes
 *
 *   viewportHeight: (number) The height (pixels) of the viewport.
 *                   required: yes
 *
 *
 *
 *   topX: (number)
 *         required: no
 *         default: 0
 *
 *   topY: (number)
 *         required: no
 *         default: 0
 *
 *   bottomX: (number)
 *            required: no
 *            default: 0
 *
 *   bottomY: (number)
 *            required: no
 *            default: 0
 *
 *   
 *   callback: (function) A function that is called after the image has been panned or zoomed. 
 *             arguments: topX, topY, bottomX, bottomY
 *             required: no
 *
 *
 *   loading: (string) Path to an image that is shown while the main image loads.
 *             required: no
 *
 **/


;(function($) {

    // Default settings   
    var defaultSettings = {
        allowZoom: true
        ,allowPan: true
        ,zoomCursor: "crosshair"
        ,panCursor: "move"
        ,disabledCursor: "not-allowed"
        ,viewportWidth: 400
        ,viewportHeight: 300
        ,maxWidth: 2500
        ,topX: -1
        ,topY: -1
        ,bottomX: -1 
        ,bottomY: -1
        ,callback: function(topX, topY, bottomX, bottomY) {}
        ,zoomFactor: 1.25
        ,mapName: ''
        ,afterSetup: ''
    };
  
    function handleMouseOver(event) {
        var image = $(this);
        var dim = image.data("dim");
        image.css("cursor", dim.cursor);
    }
    
    function handleMouseOut(event) {
        var image = $(this);
        var dim = image.data("dim");
        image.css("cursor", dim.cursor);
    }

    function handleMouseDown(mousedownEvent) {
        mousedownEvent.preventDefault();
        var image = $(this);
        var dim = image.data("dim");
        var offset = image.offset({scroll: false});
        var body = $('body');
        var doc = $(document);

        dim.origoX = mousedownEvent.clientX;
        dim.origoY = mousedownEvent.clientY;

        var clickX = (mousedownEvent.pageX - offset.left);
        var clickY = (mousedownEvent.pageY - offset.top);

        /*
        if(dim.allowZoom && (mousedownEvent.shiftKey || mousedownEvent.ctrlKey) ) {
            dim.cursor = dim.zoomCursor;
            image.css("cursor", dim.zoomCursor);
            body.css("cursor", dim.zoomCursor);
            $(document).mousemove(function(e) {
                image.zoom(e);
            });
        }
        else */
        if(dim.allowPan) {
            dim.cursor = dim.panCursor;
            image.css("cursor", dim.panCursor);
            body.css("cursor", dim.panCursor);
            doc.mousemove(function(e) {
                image.pan(e);
            });
            
            doc.mouseup(function() {
                dim.cursor = dim.panCursor;
                body.css("cursor", "default");
                image.css("cursor", dim.cursor);
                doc.unbind("mousemove").unbind("mouseup").unbind("mouseout");
                image.store();
            });
        }
        return false;
    }

    $.fn.extend({
        setup: function() {
            var image = $(this);

            //vad bad hack:
            image.data("dim", $.extend({}, window.imageDim));

            var dim = image.data("dim");

            dim.cursor = dim.panCursor; // Default cursor
            dim.actualWidth = image.width();
            dim.actualHeight = image.height();

            dim.width = dim.actualWidth;
            dim.height = dim.actualHeight;

            // If no coordinates are set, make sure the image size is not smaller than the viewport
            if(dim.topX < 0) {
                dim.topX = 0;
                dim.topY = 0;

                if((dim.actualWidth/dim.viewportWidth) > (dim.actualHeight/dim.viewportHeight)) {
                    dim.bottomY = dim.actualHeight;
                    dim.bottomX = dim.viewportWidth * (dim.actualHeight/dim.viewportHeight);
                }
                else {
                    dim.bottomX = dim.actualWidth;
                    dim.bottomY = dim.viewportHeight * (dim.actualWidth/dim.viewportWidth);
                }
            }




            var scaleX = dim.viewportWidth/(dim.bottomX - dim.topX);
            var scaleY = dim.viewportHeight/(dim.bottomY - dim.topY);

            dim.width = dim.width * scaleX;
            dim.height = dim.height * scaleY;

            dim.oldWidth = dim.width;
            dim.oldHeight = dim.height;

            dim.x = -(dim.topX * scaleX);
            dim.y = -(dim.topY * scaleY);

            image.resize();
            image.store();

            image.css({
                position: "relative"
                ,display: "block"
            });

        if(dim.allowPan || dim.allowZoom) {
            image.mousedown(handleMouseDown);
            image.mouseover(handleMouseOver);
            image.mouseout(handleMouseOut);
        }
        else {
            image.css("cursor", dim.disabledCursor);
            image.mousedown(function(e) {
                e.preventDefault();
            });
        }
            

        image.unbind('load');

            //image.mouseup(disableAndStore);
            //
            if (dim.afterSetup)
                dim.afterSetup();
        }

        ,imagetool: function(settings) {
            return this.each(function() {
                var image = $(this).css({display: "none"});


                // Add settings to each image object
                var dim = $.extend({}, defaultSettings, settings);
                image.data("dim", dim);

                //bad hack!
                window.imageDim = $.extend({}, dim);

                // Set up the viewport        
                var viewportCss = {
                    backgroundColor: "#fff"
                    ,position: "relative"
                    ,overflow: "hidden"
                    ,width: dim.viewportWidth + "px"
                    ,height: dim.viewportHeight + "px"
                };
                var viewportElement = $("<div class=\"viewport\"><\/div>");
                viewportElement.css(viewportCss);

                image.wrap(viewportElement);
                if(dim.loading) {
                    var loadingCss = {"margin-top": (dim.viewportHeight/2)-8, "margin-left": (dim.viewportWidth/2)-8};
                    $("<img class=\"loading\" src=\"" + dim.loading + "\" />").css(loadingCss).insertAfter(image);
                }



                image.load(function() {
                    $(this).next("img").remove();
                    $(this).setup();

                });

                if($.browser.msie) {
                    image.attr("src", image.attr("src") + '?' + (Math.round(2048 * Math.random())));
                }
            }); // end this.each
        } // End imagetool()
        
        ,store: function() {
            var image = $(this);
            var dim = image.data("dim");

            var scale = dim.width / dim.actualWidth;      

            dim.topX = (-dim.x) / scale;
            dim.topY = (-dim.y)  / scale;

            dim.bottomX = dim.topX + (dim.viewportWidth / scale);
            dim.bottomY = dim.topY + (dim.viewportHeight / scale);

            if(typeof dim.callback == 'function') {
                dim.callback(parseInt(dim.topX), parseInt(dim.topY),
                    parseInt(dim.bottomX), parseInt(dim.bottomY));
            }
            //return image;
        }
/*
    ,disableAndStore: function() {
        $(this).unbind("mousemove").store();      
    }
*/
    ,zoom: function(e) {
        e.preventDefault();
        var image = $(this);
        var dim = image.data("dim");

        var factor = ( dim.origoY - e.clientY);

        dim.oldWidth = dim.width;
        dim.oldHeight = dim.height;

        dim.width = ((factor/100) * dim.width) + dim.width;
        dim.height = ((factor/100) * dim.height) + dim.height;

        if(image.resize()) {
            dim.origoY = e.clientY;
        }
    }

    ,pan: function(e) {
        e.preventDefault();
        var image = $(this);
        var dim = image.data("dim");

        var deltaX = dim.origoX - e.clientX;
        var deltaY = dim.origoY - e.clientY;

        dim.origoX = e.clientX;
        dim.origoY = e.clientY;

        var targetX = dim.x - deltaX;
        var targetY = dim.y - deltaY;

        var minX = -dim.width + dim.viewportWidth;
        var minY = -dim.height + dim.viewportHeight;

        dim.x = targetX;
        dim.y = targetY;
        image.move();
    } // end pan



    ,move: function() {
        var image = $(this);
        var dim = image.data("dim");
        var minX = -dim.width + dim.viewportWidth;
        var minY = -dim.height + dim.viewportHeight;

        if(dim.x > 0) {
            dim.x = 0;
        }
        else if(dim.x < minX) {
            dim.x = minX;
        }

        if(dim.y > 0) {
            dim.y = 0;
        }    
        else if(dim.y < minY) {
            dim.y = minY;
        }


        $(this).css({
            left: dim.x + "px"
            ,top: dim.y + "px"
        });
        //return image;
    }

    ,zoomIn: function() {
        var image = $(this);
        var dim = image.data("dim");

        var scale = dim.zoomFactor;

        // prevent that width grows over max values
        with (dim){
            if ((maxWidth < width*scale))
                return false;
        
            oldWidth = width;
            oldHeight = height;
            width *= scale;
            height *= scale;
        }

        return image.resize();
    }
    
    ,zoomOut: function() {
        var image = $(this);
        var dim = image.data("dim");

        var scale = dim.zoomFactor;

        // prevent that width grows over max values
        with (dim){
            if ((viewportWidth > width/scale)||(viewportHeight > height*scale))
                return false
            
            oldWidth = width;
            oldHeight = height;
            width /= scale;
            height /= scale;
        }

        return image.resize();
    }

    ,resize: function() {
        var image = $(this);
        var dim = image.data("dim");
        // When attempting to scale the image below the minimum, set the size to minimum
        var wasResized = true;
        if(dim.width < dim.viewportWidth) {
            dim.height = parseInt(dim.actualHeight * (dim.viewportWidth/dim.actualWidth));
            dim.width = dim.viewportWidth;
            wasResized = false;

        }

        if(dim.height < dim.viewportHeight) {
            dim.width = parseInt(dim.actualWidth * (dim.viewportHeight/dim.actualHeight));
            dim.height = dim.viewportHeight;
            wasResized = false;
        }


        if(dim.width > dim.maxWidth) {
            dim.height = parseInt(dim.height * (dim.maxWidth/dim.width));
            dim.width = dim.maxWidth;
            wasResized = false;
        }


        $(this).css({
            width: dim.width + "px"
            ,height: dim.height + "px"
        });


        // Scale at center of viewport
        var cx = dim.width /(-dim.x + (dim.viewportWidth/2));
        var cy = dim.height /(-dim.y + (dim.viewportHeight/2));
        var cy = dim.height /(-dim.y + (dim.viewportHeight/2));


        dim.x = dim.x - ((dim.width - dim.oldWidth) / cx);
        dim.y = dim.y - ((dim.height - dim.oldHeight) / cy);

        $(this).move();
        return wasResized;
    }
    });
})(jQuery); 
