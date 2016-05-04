﻿window.app = window.app || {};

window.app.BaseCanvas = (function(app, $) {

    console.log('BaseCanvas');

    var BaseCanvas = function BaseCanvas($element, w, h)
    {
        if (!(this instanceof BaseCanvas)) {
            return new BaseCanvas($element);
        }

        this.KEY = {
            END:   35,
            HOME:  36,
            LEFT:  37,
            RIGHT: 39,
            UP:    38,
            DOWN:  40
        };

        this.$element = $element;
        this.$body = $('body');
        this.deg = Math.PI / 180;

        $element[0].width  = w || window.innerWidth;
        $element[0].height = h || window.innerHeight - 16;

        this.xCenter = $element.width()  >> 1;
        this.yCenter = $element.height() >> 1;

        this.virtualPage = document.createElement('canvas');

        this.virtualPage.width  = $element.width();
        this.virtualPage.height = $element.height();

        this.visibleCtx = $element[0].getContext('2d');
        this.virtualCtx = this.virtualPage.getContext('2d');
    };

    //==================================================================================
    //
    //==================================================================================
    BaseCanvas.prototype.bindEvents = function bindEvents() {
    };

    //==================================================================================
    //
    //==================================================================================
    BaseCanvas.prototype.render = function render()
    {
        this.clear(this.visibleCtx);
        this.visibleCtx.drawImage(this.virtualPage, 0, 0);
        this.clear(this.virtualCtx);

        this.$element.trigger('renderComplete');

        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    BaseCanvas.prototype.clear = function clear(context)
    {
        context.clearRect(0, 0, this.$element.width(), this.$element.height());
        return this;
    };

    return BaseCanvas;

})(window.app, jQuery);