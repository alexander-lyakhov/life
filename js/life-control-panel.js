window.app = window.app || {};

(function(app, $) {

    app.LifeControlPanel = function LifeControlPanel($element) {

        if (!(this instanceof LifeControlPanel)) {
            return new LifeControlPanel($element);
        }

        app.BaseControlPanel.apply(this, arguments);

        var trackbarSpeed   = new app.Trackbar($('#trackbar-speed')).init(80);
        var trackbarDensity = new app.Trackbar($('#trackbar-density')).init();

        var life = new app.Life($('canvas'), 600, 600).init();
            life.setSpeed(trackbarSpeed.getValue());

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this.bindEvents();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            app.BaseControlPanel.prototype.bindEvents.apply(this);

            trackbarSpeed.subscribe('change', function(e) {
                life.setSpeed(e.value);
            });

            return this;
        };
    };

    app.LifeControlPanel.prototype = Object.create(app.BaseControlPanel.prototype);
    app.LifeControlPanel.prototype.constructor = app.BaseControlPanel;

    var controlPanel = new app.LifeControlPanel($('.life-control-panel'));
        controlPanel.init();

})(window.app, jQuery);