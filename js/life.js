window.app = window.app || {};

(function(app, $) {

    /*
     *
     */
    app.Life = function Life($element)
    {
        if (!(this instanceof Life)) {
            return new Wheel($element);
        }

        app.BaseCanvas.apply(this, arguments);

        var virtualCtx = this.virtualCtx;
        var visibleCtx = this.visibleCtx;

        var cells = {
            cols: $element.width() / 10,
            rows: $element.width() / 10,
            data: []
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            this.$element
                .on('mousedown', $.proxy(this.pass, this))
                .on('renderComplete', function()
                {
                    setTimeout(function() {
                        _this.pass();
                    }, 200);
                });

            //this.$body.on('keydown', $.proxy(this.pass, this));

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            console.log('init');

            var prevCell = null;

            for (var x = 0; x < cells.cols; x++)
            {
                var cols = [];

                for (var y = 0; y < cells.rows; y++)
                {
                    var cell = {
                        isAlive:     Math.random() * 10 > 8,
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
        this.pass = function pass()
        {
            for (var cell = cells.data[0][0]; cell.nextCell; cell = cell.nextCell)
            {
                var count = 0;

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
                    cell.readyToDie =   0;
                }

                if (cell.isAlive)
                {
                    var xPos = cell.x * 10 + 1;
                    var yPos = cell.y * 10 + 1;

                    ctx.fillStyle = '#e90';
                    ctx.fillRect(xPos, yPos, 8, 8);
                }
            }

            return this.render();
        };
    }

    app.Life.prototype = Object.create(app.BaseCanvas.prototype);
    app.Life.prototype.constructor = app.BaseCanvas;

    var life = new app.Life($('canvas'), 600, 600);
        life.init();

})(window.app, jQuery);