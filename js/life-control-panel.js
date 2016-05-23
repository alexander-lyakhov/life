window.app = window.app || {};

(function(app, $) {

    app.LifeControlPanel = function LifeControlPanel($element) {

        if (!(this instanceof LifeControlPanel)) {
            return new LifeControlPanel($element);
        }

        app.BaseControlPanel.apply(this, arguments);

        var BUTTON_STATE = {
            PAUSE: '1111',
            PLAY:  '1000',
            EDIT:  '0100'
        };

        var life = new app.Life($('canvas'), 600, 600).init();
            //life.setSpeed(trackbarSpeed.getValue());

        var trackbarSpeed = new app.Trackbar($('#trackbar-speed')).init(life.getSpeed());

        var $buttonPlay  = $element.find('.control-panel__button-play');
        var $buttonClear = $element.find('.control-panel__button-clear');
        var $buttonReset = $element.find('.control-panel__button-reset');
        var $buttonEdit  = $element.find('.control-panel__button-edit');

        //==================================================================================
        //
        //==================================================================================
        this.init = function init() {
            return this.bindEvents();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            app.BaseControlPanel.prototype.bindEvents.apply(this);

            var _this = this;

            trackbarSpeed.subscribe('change', function(e) {
                life.setSpeed(e.value);
            });

            $buttonPlay.on('click', function(e)
            {
                var state = $(this).data('state') ^ 1;
                $(this).data('state', state);

                if (state)
                {
                    $(this).text($(this).data('pause-symbol'));
                    life.run();

                    _this.updateButtonState(BUTTON_STATE.PLAY);
                }
                else
                {
                    $(this).text($(this).data('play-symbol'));
                    life.pause();

                    _this.updateButtonState(BUTTON_STATE.PAUSE);
                }
            });

            $buttonClear.on('click', function() {
                life.reset(0);
            });

            $buttonReset.on('click', function() {
                life.reset();
            });

            $buttonEdit.on('click', function()
            {
                var state = $(this).data('state') ^ 1;
                $(this).data('state', state);

                if (state)
                {
                    $(this).text($(this).data('editmode-on'));
                    _this.updateButtonState(BUTTON_STATE.EDIT);

                    life.startEdit();
                }
                else
                {
                    $(this).text($(this).data('editmode-off'));
                    _this.updateButtonState(BUTTON_STATE.PAUSE);

                    life.stopEdit();
                }
            });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.updateButtonState = function updateButtonState(state)
        {
            $element.find('.control-panel__button').each(function(index) {
                $(this).attr('disabled', !Boolean(+state[index]));
            });

            return this;
        };
    };

    app.LifeControlPanel.prototype = Object.create(app.BaseControlPanel.prototype);
    app.LifeControlPanel.prototype.constructor = app.BaseControlPanel;

    var controlPanel = new app.LifeControlPanel($('.life-control-panel')).init();

})(window.app, jQuery);