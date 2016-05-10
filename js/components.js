window.app = window.app || {};

(function(app, $) {

    /*
     *
     */
    app.Trackbar = function Trackbar($element)
    {
        if (!(this instanceof Trackbar)) {
            return new Trackbar($element);
        }

        var $trackbarShell           = $element.find('.trackbar__shell');
        var $trackbarSegmentsWrapper = $element.find('.trackbar__segments-wrapper');
        var $trackbarSegment         = null;
        var $trackbarTouch           = $element.find('.trackbar__segments-touch');
        var $trackbarValue           = $element.find('.trackbar__value');

        var segments = [];

        var value = 0;

        //==================================================================================
        //
        //==================================================================================
        this.init = function init(val)
        {
            $trackbarShell.removeClass('empty');

            for (var i = 0; i < 20; i++) {
                $trackbarSegmentsWrapper.append('<div class="trackbar__segment"/>');
            }

            $trackbarSegment = $element.find('.trackbar__segment');
            segments = $trackbarSegment.toArray();

            this.setValue(val || 0);

            return this.bindEvents();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $trackbarTouch
                .on('mousedown', $trackbarTouch, function(e)
                {
                    $trackbarTouch.on('mousemove', $.proxy(_this.mousemoveHandler, _this));
                    _this.mousemoveHandler(e);
                })
                .on('mouseleave mouseup', function(e) {
                    $trackbarTouch.off('mouseleave');
                })
                .on('mousewheel DOMMouseScroll', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

                    Math.abs(direction) === 120 ?
                        direction > 0 ? _this.incriseValue():_this.decriseValue():
                        direction < 0 ? _this.incriseValue():_this.decriseValue();
                });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.subscribe = function subscribe(eventName, fn) {
            $element.on(eventName, fn || $.noop);
        };

        //==================================================================================
        //
        //==================================================================================
        this.mousemoveHandler = function mousemoveHandler(e)
        {
            if (e.buttons === 1) {
                return this.setValue(Math.ceil((e.offsetX / $trackbarTouch.width()) * 20) * 5);
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.getValue = function getValue() {
            return value;
        };

        this.setValue = function setValue(val)
        {
            value = val || 0;

            value = value > 100 ? 100:value;
            value = value <   0 ?   0:value;

            $trackbarValue.text(value + '%');

            this.highlightSegments(value);

            $element.trigger({type: 'change', value: value});

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.incriseValue = function incriseValue() {
            return this.setValue(value + 5);
        };

        this.decriseValue = function decriseValue() {
            return this.setValue(value - 5);
        };

        //==================================================================================
        //
        //==================================================================================
        this.highlightSegments = function highlightSegments(val)
        {
            $trackbarSegment.removeClass('on');

            for (var i = 0, size = val / 5; i < size; i++) {
                $(segments[i]).addClass('on');
            }

            return this;
        };
    };

    var trackbar01 = new app.Trackbar($('#tb01')).init();
    var trackbar02 = new app.Trackbar($('#tb02')).init();

})(window.app, jQuery);