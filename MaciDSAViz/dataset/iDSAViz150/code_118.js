function Traverse2DArrayByColumn(am, w, h) {
    this.init(am, w, h);
}

Traverse2DArrayByColumn.prototype = new Algorithm();
Traverse2DArrayByColumn.prototype.constructor = Traverse2DArrayByColumn;
Traverse2DArrayByColumn.superclass = Algorithm.prototype;

Traverse2DArrayByColumn.ELEMENT_WIDTH = 50;
Traverse2DArrayByColumn.ELEMENT_HEIGHT = 50;
Traverse2DArrayByColumn.STARTING_X = 50;
Traverse2DArrayByColumn.STARTING_Y = 50;
Traverse2DArrayByColumn.COLUMN_SPACING = 60;
Traverse2DArrayByColumn.ROW_SPACING = 60;
Traverse2DArrayByColumn.FOREGROUND_COLOR = "#000055";
Traverse2DArrayByColumn.BACKGROUND_COLOR = "#AAAAFF";

Traverse2DArrayByColumn.prototype.init = function(am, w, h) {
    Traverse2DArrayByColumn.superclass.init.call(this, am, w, h);

    this.addControls();

    this.nextIndex = 0;

    this.matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    this.matrixIDs = [];

    this.createMatrixVisualization();

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

Traverse2DArrayByColumn.prototype.createMatrixVisualization = function() {
    this.commands = [];

    for (let row = 0; row < this.matrix.length; row++) {
        let rowIDs = [];
        for (let col = 0; col < this.matrix[row].length; col++) {
            let id = this.nextIndex++;
            let x = Traverse2DArrayByColumn.STARTING_X + col * Traverse2DArrayByColumn.COLUMN_SPACING;
            let y = Traverse2DArrayByColumn.STARTING_Y + row * Traverse2DArrayByColumn.ROW_SPACING;
            this.cmd("CreateRectangle", id, this.matrix[row][col], Traverse2DArrayByColumn.ELEMENT_WIDTH, Traverse2DArrayByColumn.ELEMENT_HEIGHT, x, y);
            this.cmd("SetForegroundColor", id, Traverse2DArrayByColumn.FOREGROUND_COLOR);
            this.cmd("SetBackgroundColor", id, Traverse2DArrayByColumn.BACKGROUND_COLOR);
            rowIDs.push(id);
        }
        this.matrixIDs.push(rowIDs);
    }

    this.cmd("Step");
};

Traverse2DArrayByColumn.prototype.addControls = function() {
    this.controls = [];

    this.traverseButton = addControlToAlgorithmBar("Button", "Traverse by Column");
    this.traverseButton.onclick = this.traverseCallback.bind(this);
    this.controls.push(this.traverseButton);
};

Traverse2DArrayByColumn.prototype.traverseCallback = function() {
    this.implementAction(this.traverseByColumn.bind(this));
};

Traverse2DArrayByColumn.prototype.traverseByColumn = function() {
    this.commands = [];

    let highlightID = this.nextIndex++;
    this.cmd("CreateHighlightCircle", highlightID, "#FF0000", 0, 0, 20);

    for (let col = 0; col < this.matrix[0].length; col++) {
        for (let row = 0; row < this.matrix.length; row++) {
            let x = Traverse2DArrayByColumn.STARTING_X + col * Traverse2DArrayByColumn.COLUMN_SPACING;
            let y = Traverse2DArrayByColumn.STARTING_Y + row * Traverse2DArrayByColumn.ROW_SPACING;
            this.cmd("Move", highlightID, x, y);
            this.cmd("SetHighlight", this.matrixIDs[row][col], 1);
            this.cmd("Step");
            this.cmd("SetHighlight", this.matrixIDs[row][col], 0);
        }
    }

    this.cmd("Delete", highlightID);
    this.cmd("Step");

    return this.commands;
};

Traverse2DArrayByColumn.prototype.reset = function() {
    this.nextIndex = 0;
    this.matrixIDs = [];
};

Traverse2DArrayByColumn.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

Traverse2DArrayByColumn.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new Traverse2DArrayByColumn(animManag, canvas.width, canvas.height);
}