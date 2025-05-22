function TwoDimArrayTraversal(am, w, h) {
    this.init(am, w, h);
}

TwoDimArrayTraversal.prototype = new Algorithm();
TwoDimArrayTraversal.prototype.constructor = TwoDimArrayTraversal;
TwoDimArrayTraversal.superclass = Algorithm.prototype;

TwoDimArrayTraversal.CELL_WIDTH = 50;
TwoDimArrayTraversal.CELL_HEIGHT = 50;
TwoDimArrayTraversal.START_X = 50;
TwoDimArrayTraversal.START_Y = 50;
TwoDimArrayTraversal.HIGHLIGHT_COLOR = "#FF0000";
TwoDimArrayTraversal.DEFAULT_COLOR = "#000000";

TwoDimArrayTraversal.prototype.init = function(am, w, h) {
    TwoDimArrayTraversal.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    this.cellIds = [];
    this.createInitialMatrix();
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

TwoDimArrayTraversal.prototype.createInitialMatrix = function() {
    this.commands = [];
    let x = TwoDimArrayTraversal.START_X;
    let y = TwoDimArrayTraversal.START_Y;

    for (let i = 0; i < this.matrix.length; i++) {
        let rowIds = [];
        for (let j = 0; j < this.matrix[i].length; j++) {
            const cellId = this.nextIndex++;
            this.cmd("CreateRectangle", cellId, this.matrix[i][j],
                    TwoDimArrayTraversal.CELL_WIDTH,
                    TwoDimArrayTraversal.CELL_HEIGHT,
                    x, y);
            rowIds.push(cellId);
            x += TwoDimArrayTraversal.CELL_WIDTH + 5;
        }
        this.cellIds.push(rowIds);
        x = TwoDimArrayTraversal.START_X;
        y += TwoDimArrayTraversal.CELL_HEIGHT + 5;
    }
    return this.commands;
};

TwoDimArrayTraversal.prototype.addControls = function() {
    this.controls = [];
    this.traverseButton = addControlToAlgorithmBar("Button", "Start Traversal");
    this.traverseButton.onclick = this.traverseCallback.bind(this);
    this.controls.push(this.traverseButton);
};

TwoDimArrayTraversal.prototype.traverseCallback = function(event) {
    this.implementAction(this.traverse.bind(this), "");
};

TwoDimArrayTraversal.prototype.traverse = function(unused) {
    this.commands = [];
    let highlightId = this.nextIndex++;

    this.cmd("CreateHighlightCircle", highlightId, TwoDimArrayTraversal.HIGHLIGHT_COLOR,
            TwoDimArrayTraversal.START_X - 20,
            TwoDimArrayTraversal.START_Y - 20, 15);

    for (let i = 0; i < this.cellIds.length; i++) {
        for (let j = 0; j < this.cellIds[i].length; j++) {
            const cell = this.cellIds[i][j];
            const xPos = TwoDimArrayTraversal.START_X + j * (TwoDimArrayTraversal.CELL_WIDTH + 5)
                        + TwoDimArrayTraversal.CELL_WIDTH/2;
            const yPos = TwoDimArrayTraversal.START_Y + i * (TwoDimArrayTraversal.CELL_HEIGHT + 5)
                        + TwoDimArrayTraversal.CELL_HEIGHT/2;

            this.cmd("Move", highlightId, xPos, yPos);
            this.cmd("Step");
            this.cmd("SetHighlight", cell, 1);
            this.cmd("Step");
            this.cmd("SetHighlight", cell, 0);
        }
        const newlineId = this.nextIndex++;
        this.cmd("CreateLabel", newlineId, "↓ New Line",
                TwoDimArrayTraversal.START_X + this.cellIds[i].length * (TwoDimArrayTraversal.CELL_WIDTH + 5) + 20,
                TwoDimArrayTraversal.START_Y + i * (TwoDimArrayTraversal.CELL_HEIGHT + 5)
                + TwoDimArrayTraversal.CELL_HEIGHT/2);
        this.cmd("Step");
    }

    this.cmd("Delete", highlightId);
    return this.commands;
};

TwoDimArrayTraversal.prototype.reset = function() {
    this.nextIndex = 0;
    this.cellIds = [];
    this.commands = [];
    this.createInitialMatrix();
};

TwoDimArrayTraversal.prototype.disableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

TwoDimArrayTraversal.prototype.enableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new TwoDimArrayTraversal(animManag, canvas.width, canvas.height);
}