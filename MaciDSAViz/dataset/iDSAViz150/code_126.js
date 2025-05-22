function PascalTriangle(am, w, h) {
    this.init(am, w, h);
}

PascalTriangle.prototype = new Algorithm();
PascalTriangle.prototype.constructor = PascalTriangle;
PascalTriangle.superclass = Algorithm.prototype;

PascalTriangle.ELEMENT_WIDTH = 40;
PascalTriangle.ELEMENT_HEIGHT = 40;
PascalTriangle.START_X = 300;
PascalTriangle.START_Y = 30;
PascalTriangle.SPACING = 10;
PascalTriangle.ROW_SPACING = 50;

PascalTriangle.prototype.init = function(am, w, h) {
    PascalTriangle.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.triangleData = [];
    this.elementPositions = [];
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

PascalTriangle.prototype.addControls = function() {
    this.controls = [];
    this.rowField = addControlToAlgorithmBar("Text", "");
    this.rowField.onkeydown = this.returnSubmit(this.rowField, this.generateCallback.bind(this), 2, true);
    this.controls.push(this.rowField);

    this.generateButton = addControlToAlgorithmBar("Button", "生成");
    this.generateButton.onclick = this.generateCallback.bind(this);
    this.controls.push(this.generateButton);
};

PascalTriangle.prototype.reset = function() {
    this.nextIndex = 0;
    this.triangleData = [];
    this.elementPositions = [];
};

PascalTriangle.prototype.generateCallback = function() {
    var numRows = this.rowField.value;
    if (numRows !== "") {
        this.rowField.value = "";
        this.implementAction(this.generate.bind(this), parseInt(numRows));
    }
};

PascalTriangle.prototype.generate = function(numRows) {
    this.commands = [];

    for (let i = 0; i < this.nextIndex; i++) {
        this.cmd("Delete", i);
    }
    this.nextIndex = 0;
    this.triangleData = [];
    this.elementPositions = [];

    for (let i = 0; i < numRows; i++) {
        let row = [];
        let xPos = PascalTriangle.START_X - i * (PascalTriangle.ELEMENT_WIDTH + PascalTriangle.SPACING)/2;
        let yPos = PascalTriangle.START_Y + i * (PascalTriangle.ELEMENT_HEIGHT + PascalTriangle.ROW_SPACING);

        for (let j = 0; j <= i; j++) {
            const elementId = this.nextIndex++;
            this.cmd("CreateRectangle", elementId, "",
                     PascalTriangle.ELEMENT_WIDTH,
                     PascalTriangle.ELEMENT_HEIGHT,
                     xPos,
                     yPos);
            this.cmd("SetForegroundColor", elementId, "#000000");
            this.cmd("SetBackgroundColor", elementId, "#FFFFFF");

            if (j === 0 || j === i) {
                this.cmd("SetText", elementId, "1");
                row.push(1);
            } else {
                const prevRow = this.triangleData[i-1];
                const value = prevRow[j] + prevRow[j-1];
                this.cmd("SetText", elementId, value.toString());
                row.push(value);
            }

            xPos += PascalTriangle.ELEMENT_WIDTH + PascalTriangle.SPACING;
            this.elementPositions.push({x: xPos, y: yPos});
            this.cmd("Step");
        }
        this.triangleData.push(row);
    }
    return this.commands;
};

PascalTriangle.prototype.disableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

PascalTriangle.prototype.enableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new PascalTriangle(animManag, canvas.width, canvas.height);
}