;(function($, document, window, undefined){
    var generateRainbow = function(cfg, width, height, vertical) {
            var canvas = document.createElement('canvas'),
                i, context;

            canvas.width = width || 100;
            canvas.height = height || 100;
            context = canvas.getContext('2d');

            if(!vertical) {
                for(i = 0; i <= canvas.width; i++){
                    context.strokeStyle = 'hsl('+((i/canvas.width)*360)+', ' + '80%, ' + cfg.luminosity + '%)';   
                    context.beginPath();
                    context.moveTo(i, 0);
                    context.lineTo(i, canvas.height);
                    context.stroke();
                }
            }

            return canvas;
        },

        // http://bgrins.github.io/TinyColor/
        hslToRgb = (function() {
            function bound01(n, max) {
                if(typeof n === "string" && n.indexOf('.') !== -1 && parseFloat(n) === 1) { n = "100%"; }
                n = Math.min(max, Math.max(0, parseFloat(n)));
                if(max === 100) {
                    n = parseInt(n * max, 10) / 100;
                }
                if ((Math.abs(n - max) < 0.000001)) {
                    return 1;
                }
                return (n % max) / parseFloat(max);
            }

            function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            return function (h, s, l) {
                var r, g, b;

                h = bound01(h.toFixed(0), 360);
                s = bound01(s.toFixed(0), 100);
                l = bound01(l.toFixed(0), 100);

                if(s === 0) {
                    r = g = b = l; // achromatic
                }
                else {
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }

                return '#'+ (~~(r * 255)).toString(16) + (~~(g * 255)).toString(16) + (~~(b * 255)).toString(16);
            };
        })(),

        // Color & positioning
        updateCursor = function(cfg) {
            cfg.cursor.style.background = 'hsl(' + (cfg.hue * 360) + ', ' + cfg.saturation + '%, ' + cfg.luminosity + '%)';
            cfg.cursor.style.left = cfg.hue * 100 + '%';
        },

        // Touch support through click forwarding
        handleTouch = function(container) {
            var handler = function(event) {
                var touch = event.changedTouches[0],
                    simulatedEvent = document.createEvent("MouseEvent");

                simulatedEvent.initMouseEvent({
                    touchstart: "mousedown",
                    touchmove: "mousemove",
                    touchend: "mouseup"
                }[event.type], true, true, window, 1,
                    touch.screenX, touch.screenY,
                    touch.clientX, touch.clientY, false,
                    false, false, false, 0, null);

                touch.target.dispatchEvent(simulatedEvent);
                event.preventDefault();
            };

            ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function(event){
                container.addEventListener(event, handler, true);
            });

            return handler;
        };

    // Init: Generate rainbow & cursor
    $.fn.colorPicker = function(config) {
        var container = this[0],
            $container = $(container),
            cfg = {
                debug: config.debug || false,
                saturation: config.saturation || 80,
                luminosity: config.luminosity || 65,
                hue: config.hue || .5,
                cursor: config.cursor || container.querySelector('.cursor'),
                callback: config.callback
            },
            movingCursor = false;

        // Rainbow
        $container.css({'background-image': 'url(' + generateRainbow(cfg).toDataURL('image/png') + ')', 'background-size': '100%'});

        // Cursor
        if(cfg.cursor) {
            updateCursor(cfg);

            handleTouch(container);
            ['mousedown', 'mousemove', 'mouseup'].forEach(function(event){
                (event === 'mousedown' ? $container : $(document)).on(event, function(event) {
                    if(event.type === 'mousedown') { 
                        movingCursor = true;
                    }
                    else if(event.type === 'mouseup') {
                        movingCursor = false;
                    }

                    if(movingCursor){
                        if((cfg.hue = (event.clientX - container.offsetLeft) / container.offsetWidth) < 0) {
                            cfg.hue = 0;
                        }
                        else if(cfg.hue > 1) {
                            cfg.hue = 1;
                        }
                        updateCursor(cfg);
                    }
                });
            });
        }

        return function(e) {
            cfg.callback(hslToRgb(cfg.hue*360, cfg.saturation, cfg.luminosity));
            e.preventDefault();
        };
    };
})(jQuery, document, window);