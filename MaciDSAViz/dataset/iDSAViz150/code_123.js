function MoveZeroes(am, w, h) {
    this.init(am, w, h);
}

MoveZeroes.prototype = new Algorithm();
MoveZeroes.prototype.constructor = MoveZeroes;
MoveZeroes.superclass = Algorithm.prototype;

MoveZeroes.ELEMENT_WIDTH = 40;
MoveZeroes.ELEMENT_HEIGHT = 40;
MoveZeroes.START_X = 50;
MoveZeroes.START_Y = 100;
MoveZeroes.HIGHLIGHT_Y = 200;
MoveZeroes.FOREGROUND_COLOR = "#000000";
MoveZeroes.BACKGROUND_COLOR = "#FFFFFF";
MoveZeroes.ZERO_COLOR = "#FF0000";

MoveZeroes.prototype.init = function(am, w, h) {
    MoveZeroes.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayID = [];
    this.iPointerID = null;
    this.jPointerID = null;
};

MoveZeroes.prototype.addControls = function() {
    this.controls = [];
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.moveZeroesCallback.bind(this), 25, false);
    this.controls.push(this.inputField);

    this.moveButton = addControlToAlgorithmBar("Button", "Run");
    this.moveButton.onclick = this.moveZeroesCallback.bind(this);
    this.controls.push(this.moveButton);

    this.randomButton = addControlToAlgorithmBar("Button", "Random");
    this.randomButton.onclick = this.randomCallback.bind(this);
    this.controls.push(this.randomButton);
};

MoveZeroes.prototype.reset = function() {
    for (var i = 0; i < this.arrayID.length; i++) {
        this.cmd("Delete", this.arrayID[i]);
    }
    if (this.iPointerID != null) {
        this.cmd("Delete", this.iPointerID);
        this.cmd("Delete", this.jPointerID);
        this.cmd("Delete", this.iLabelID);
        this.cmd("Delete", this.jLabelID);
    }
    this.nextIndex = 0;
    this.arrayID = [];
};

MoveZeroes.prototype.moveZeroesCallback = function(event) {
    var numsText = this.inputField.value;
    var nums = numsText.split(',').map(Number).filter(n => !isNaN(n));
    if (nums.length > 0) {
        this.implementAction(this.moveZeroes.bind(this), nums);
    }
};

MoveZeroes.prototype.randomCallback = function(event) {
    var length = Math.floor(Math.random() * 10) + 5;
    var nums = [];
    for (var i = 0; i < length; i++) {
        nums.push(Math.random() > 0.5 ? Math.floor(Math.random() * 9) + 1 : 0);
    }
    this.inputField.value = nums.join(',');
};

MoveZeroes.prototype.moveZeroes = function(nums) {
    this.commands = [];
    this.arrayID = [];

    for (var i = 0; i < nums.length; i++) {
        this.arrayID[i] = this.nextIndex++;
        var x = MoveZeroes.START_X + i * MoveZeroes.ELEMENT_WIDTH;
        this.cmd("CreateRectangle", this.arrayID[i], nums[i].toString(),
                MoveZeroes.ELEMENT_WIDTH, MoveZeroes.ELEMENT_HEIGHT, x, MoveZeroes.START_Y);
        this.cmd("SetForegroundColor", this.arrayID[i], MoveZeroes.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.arrayID[i], MoveZeroes.BACKGROUND_COLOR);
    }

    this.iPointerID = this.nextIndex++;
    this.jPointerID = this.nextIndex++;
    this.iLabelID = this.nextIndex++;
    this.jLabelID = this.nextIndex++;

    this.cmd("CreateHighlightCircle", this.iPointerID, "#FF0000",
            MoveZeroes.START_X, MoveZeroes.HIGHLIGHT_Y, 15);
    this.cmd("CreateLabel", this.iLabelID, "i",
            MoveZeroes.START_X, MoveZeroes.HIGHLIGHT_Y + 20);
    this.cmd("CreateHighlightCircle", this.jPointerID, "#0000FF",
            MoveZeroes.START_X, MoveZeroes.HIGHLIGHT_Y, 15);
    this.cmd("CreateLabel", this.jLabelID, "j",
            MoveZeroes.START_X, MoveZeroes.HIGHLIGHT_Y + 20);

    this.cmd("Step");

    var j = 0;
    for (var i = 0; i < nums.length; i++) {
        var iX = MoveZeroes.START_X + i * MoveZeroes.ELEMENT_WIDTH;
        this.cmd("Move", this.iPointerID, iX, MoveZeroes.HIGHLIGHT_Y);
        this.cmd("Move", this.iLabelID, iX, MoveZeroes.HIGHLIGHT_Y + 20);
        this.cmd("Step");

        if (nums[i] !== 0) {
            var jX = MoveZeroes.START_X + j * MoveZeroes.ELEMENT_WIDTH;
            this.cmd("Move", this.jPointerID, jX, MoveZeroes.HIGHLIGHT_Y);
            this.cmd("Move", this.jLabelID, jX, MoveZeroes.HIGHLIGHT_Y + 20);
            this.cmd("Step");

            this.cmd("SetText", this.arrayID[j], nums[i].toString());
            this.cmd("Step");
            j++;
        }
    }

    for (var i = j; i < nums.length; i++) {
        this.cmd("SetText", this.arrayID[i], "0");
        this.cmd("SetForegroundColor", this.arrayID[i], MoveZeroes.ZERO_COLOR);
        this.cmd("Step");
    }

    return this.commands;
};

MoveZeroes.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

MoveZeroes.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MoveZeroes(animManag, canvas.width, canvas.height);
}