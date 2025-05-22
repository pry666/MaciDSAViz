var ARRAY_START_X = 100;
var ARRAY_START_Y = 200;
var ARRAY_ELEM_WIDTH = 50;
var ARRAY_ELEM_HEIGHT = 50;

var ARRRAY_ELEMS_PER_LINE = 15;
var ARRAY_LINE_SPACING = 130;

var RESULT_ARRAY_START_X = 100;
var RESULT_ARRAY_START_Y = 400;

var LABEL_X = 50;
var LABEL_Y = 150;

var SIZE = 3;

function SumArraysVisualization(am, w, h) {
    this.init(am, w, h);
}

SumArraysVisualization.prototype = new Algorithm();
SumArraysVisualization.prototype.constructor = SumArraysVisualization;
SumArraysVisualization.superclass = Algorithm.prototype;

SumArraysVisualization.prototype.init = function(am, w, h) {
    SumArraysVisualization.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

SumArraysVisualization.prototype.addControls = function() {
    this.controls = [];

    this.sumButton = addControlToAlgorithmBar("Button", "求和");
    this.sumButton.onclick = this.sumCallback.bind(this);
    this.controls.push(this.sumButton);
}

SumArraysVisualization.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

SumArraysVisualization.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

SumArraysVisualization.prototype.setup = function() {
    this.nextIndex = 0;

    this.array1ID = new Array(SIZE);
    this.array1LabelID = new Array(SIZE);
    this.array2ID = new Array(SIZE);
    this.array2LabelID = new Array(SIZE);
    this.resultArrayID = new Array(SIZE);
    this.resultArrayLabelID = new Array(SIZE);

    for (var i = 0; i < SIZE; i++) {
        this.array1ID[i] = this.nextIndex++;
        this.array1LabelID[i] = this.nextIndex++;
        this.array2ID[i] = this.nextIndex++;
        this.array2LabelID[i] = this.nextIndex++;
        this.resultArrayID[i] = this.nextIndex++;
        this.resultArrayLabelID[i] = this.nextIndex++;
    }

    this.commands = new Array();

    for (var i = 0; i < SIZE; i++) {
        var xpos = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
        var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
        this.cmd("CreateRectangle", this.array1ID[i], i + 1, ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, xpos, ypos);
        this.cmd("CreateLabel", this.array1LabelID[i], i, xpos, ypos + ARRAY_ELEM_HEIGHT);
        this.cmd("SetForegroundColor", this.array1LabelID[i], "#0000FF");
    }

    for (var i = 0; i < SIZE; i++) {
        var xpos = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X + 200;
        var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
        this.cmd("CreateRectangle", this.array2ID[i], i + 4, ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, xpos, ypos);
        this.cmd("CreateLabel", this.array2LabelID[i], i, xpos, ypos + ARRAY_ELEM_HEIGHT);
        this.cmd("SetForegroundColor", this.array2LabelID[i], "#0000FF");
    }

    for (var i = 0; i < SIZE; i++) {
        var xpos = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + RESULT_ARRAY_START_X;
        var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + RESULT_ARRAY_START_Y;
        this.cmd("CreateRectangle", this.resultArrayID[i], "", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, xpos, ypos);
        this.cmd("CreateLabel", this.resultArrayLabelID[i], i, xpos, ypos + ARRAY_ELEM_HEIGHT);
        this.cmd("SetForegroundColor", this.resultArrayLabelID[i], "#0000FF");
    }

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

SumArraysVisualization.prototype.reset = function() {
    this.nextIndex = this.initialIndex;
}

SumArraysVisualization.prototype.sumCallback = function(event) {
    this.implementAction(this.sumArrays.bind(this), "");
}

SumArraysVisualization.prototype.sumArrays = function() {
    this.commands = [];
    var highlightCircleID = this.nextIndex++;

    this.cmd("CreateHighlightCircle", highlightCircleID, "#FF0000", ARRAY_START_X, ARRAY_START_Y);

    for (var i = 0; i < SIZE; i++) {
        var xpos1 = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
        var ypos1 = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

        var xpos2 = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X + 200;
        var ypos2 = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

        var xposResult = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + RESULT_ARRAY_START_X;
        var yposResult = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + RESULT_ARRAY_START_Y;

        this.cmd("Move", highlightCircleID, xpos1, ypos1);
        this.cmd("Step");

        this.cmd("SetHighlight", this.array1ID[i], 1);
        this.cmd("Step");

        this.cmd("Move", highlightCircleID, xpos2, ypos2);
        this.cmd("Step");

        this.cmd("SetHighlight", this.array2ID[i], 1);
        this.cmd("Step");

        var sum = parseInt(this.cmd("GetText", this.array1ID[i])) + parseInt(this.cmd("GetText", this.array2ID[i]));

        this.cmd("Move", highlightCircleID, xposResult, yposResult);
        this.cmd("Step");

        this.cmd("SetText", this.resultArrayID[i], sum);
        this.cmd("SetHighlight", this.resultArrayID[i], 1);
        this.cmd("Step");

        this.cmd("SetHighlight", this.array1ID[i], 0);
        this.cmd("SetHighlight", this.array2ID[i], 0);
        this.cmd("SetHighlight", this.resultArrayID[i], 0);
        this.cmd("Step");
    }

    this.cmd("Delete", highlightCircleID);
    return this.commands;
}

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new SumArraysVisualization(animManag, canvas.width, canvas.height);
}