window.app = window.app || {};

(function(app, $) {

    /*
     *
     */
    app.Life = function Life($element)
    {
        if (!(this instanceof Life)) {
            return new Life($element);
        }

        app.BaseCanvas.apply(this, arguments);

        var virtualCtx = this.virtualCtx;
        var visibleCtx = this.visibleCtx;

        var $life = $element.parent();
        var $labelMode = $life.find('.life-mode');
        var $labelIterations = $life.find('.life-itarations span');

        var MODE = {
            PAUSE: 0,
            PLAY:  1,
            EDIT:  2
        };

        var mode = MODE.PAUSE;

        var speed = 85;
        var density = 2;

        var iterations = 0;

        var delay = (100 - speed) * 10;
        var timeout = null;

        var cells = {
            cols: $element.width() / 10,
            rows: $element.width() / 10,
            data: []
        };

        var fn = {
            pass: $.noop,
            edit: $.noop
        };

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            var prevCell = null;

            for (var x = 0; x < cells.cols; x++)
            {
                var cols = [];

                for (var y = 0; y < cells.rows; y++)
                {
                    var cell = {
                        isAlive:     Math.random() * 10 < density ? 1:0,
                        readyToBorn: 0,
                        readyToDie:  0,
                        nextCell: null,
                        x: x,
                        y: y
                    };

                    if (prevCell) {
                        prevCell.nextCell = cell;
                    }

                    prevCell = cell;

                    cols.push(cell);
                }

                cells.data.push(cols);
            }

            return this.bindEvents().draw();
        };

        //==================================================================================
        //
        //==================================================================================
        this.reset = function reset(val)
        {
            if (typeof(val) === 'undefined') {
                val = density;
            }

            for (var cell = cells.data[0][0]; cell.nextCell; cell = cell.nextCell)
            {
                cell.isAlive = Math.random() * 10 < val ? 1:0;
                cell.readyToBorn = 0;
                cell.readyToDie = 0;
            }

            iterations = 0;

            return this.draw();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            fn.pass = $.proxy(this.pass, this);
            fn.edit = $.proxy(this.edit, this);

            this.$element
                .on('mousedown', fn.pass)
                .on('renderComplete', $.proxy(this.wait, this));

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.subscribe = function subscribe(eventName, fn)
        {
            $element.on(eventName, fn || $.noop);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.setSpeed = function setSpeed(val)
        {
            speed = val || 0;
            delay = (100 - speed) * 10;

            clearTimeout(timeout);

            if (speed) {
                return this.wait();
            }

            return this;
        };

        this.getSpeed = function getSpeed() {
            return speed;
        };

        //==================================================================================
        //
        //==================================================================================
        this.run = function run()
        {
            mode = MODE.PLAY;
            $labelMode.text('Play');

            $life
                .removeClass('pause')
                .addClass('play');

            return this.draw();
        };

        this.pause = function pause()
        {
            mode = MODE.PAUSE;
            $labelMode.text('Pause');

            $life
                .removeClass('play')
                .addClass('pause');

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.startEdit = function startEdit()
        {
            mode = MODE.EDIT;
            $labelMode.text('Edit');

            this.$element.off('mousedown', fn.pass);
            this.$element .on('mousedown', fn.edit);

            $life
                .removeClass('pause')
                .addClass('edit');

            return this;
        };

        this.edit = function edit(e)
        {
            var x = Math.floor(e.offsetX / 10);
            var y = Math.floor(e.offsetY / 10);

            cells.data[x][y].isAlive ^= 1;

            return this.draw();
        };

        this.stopEdit = function stopEdit()
        {
            mode = MODE.PAUSE;
            $labelMode.text('Pause');

            this.$element.off('mousedown', fn.edit);
            this.$element .on('mousedown', fn.pass);

            $life
                .removeClass('edit')
                .addClass('pause');

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.wait = function wait()
        {
            var _this = this;

            if (mode === MODE.PLAY)
            {
                timeout = setTimeout(function() {
                    _this.pass();
                }, delay);
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.pass = function pass()
        {
            clearTimeout(timeout);

            for (var cell = cells.data[0][0]; cell.nextCell; cell = cell.nextCell)
            {
                var count = 0;

                /*
                 *  3 x 3
                 */
                for (var x = cell.x - 1; x <= cell.x + 1; x++)
                {
                    for (var y = cell.y - 1; y <= cell.y + 1; y++)
                    {
                        if (x < 0 || y < 0) {
                            continue;
                        }

                        if (x > cells.cols - 1 || y > cells.rows - 1) {
                            continue;
                        }

                        if (cells.data[x][y] === cell) {
                            continue;
                        }

                        if ((cells.data[x][y]).isAlive) {
                            count++;
                        }
                    }
                }

                if (count < 2 || count > 3) {
                    cell.readyToBorn = 0;
                    cell.readyToDie  = 1;
                }

                if (count === 3) {
                    cell.readyToBorn = 1;
                    cell.readyToDie  = 0;
                }
            }

            iterations++;

            return this.draw();
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw()
        {
            var ctx = ctx || virtualCtx;

            for (var cell = cells.data[0][0]; cell.nextCell; cell = cell.nextCell)
            {
                if (cell.readyToBorn)
                {
                    cell.isAlive = 1;
                    cell.readyToBorn = 0;
                }

                if (cell.readyToDie)
                {
                    cell.isAlive = 0;
                    cell.readyToDie = 0;
                }

                if (cell.isAlive)
                {
                    var xPos = cell.x * 10 + 1;
                    var yPos = cell.y * 10 + 1;

                    ctx.fillStyle = '#e90';
                    ctx.fillRect(xPos, yPos, 8, 8);
                }
            }

            $labelIterations.text(iterations);

            return this.render();
        };
    };

    app.Life.prototype = Object.create(app.BaseCanvas.prototype);
    app.Life.prototype.constructor = app.BaseCanvas;

})(window.app, jQuery);