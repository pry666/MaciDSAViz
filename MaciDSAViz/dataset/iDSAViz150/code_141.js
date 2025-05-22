function MoveZeroes(am, w, h) {
    this.init(am, w, h);
}

MoveZeroes.prototype = new Algorithm();
MoveZeroes.prototype.constructor = MoveZeroes;
MoveZeroes.superclass = Algorithm.prototype;

MoveZeroes.ELEMENT_WIDTH = 50;
MoveZeroes.ELEMENT_HEIGHT = 30;
MoveZeroes.START_X = 50;
MoveZeroes.START_Y = 100;
MoveZeroes.HIGHLIGHT_COLOR = "#FF0000";
MoveZeroes.FOREGROUND_COLOR = "#000000";
MoveZeroes.BACKGROUND_COLOR = "#AAAAFF";
MoveZeroes.INDEX_OFFSET = 30;

MoveZeroes.prototype.init = function(am, w, h) {
    MoveZeroes.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayData = [];
    this.elementIDs = [];
    this.indexLabels = [];
    this.leftPointer = null;
    this.rightPointer = null;
};

MoveZeroes.prototype.addControls = function() {
    this.controls = [];

    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.runCallback.bind(this), 50, false);
    this.controls.push(this.inputField);

    this.runButton = addControlToAlgorithmBar("Button", "Run");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);

    this.resetButton = addControlToAlgorithmBar("Button", "Reset");
    this.resetButton.onclick = this.resetCallback.bind(this);
    this.controls.push(this.resetButton);
};

MoveZeroes.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayData = [];
    this.elementIDs = [];
    this.indexLabels = [];
};

MoveZeroes.prototype.runCallback = function() {
    var input = this.inputField.value;
    if (input) {
        var nums = input.split(",").map(Number);
        if (nums.every(num => !isNaN(num))) {
            this.implementAction(this.runAlgorithm.bind(this), nums);
        }
    }
};

MoveZeroes.prototype.resetCallback = function() {
    this.reset();
    this.animationManager.resetAll();
};

MoveZeroes.prototype.runAlgorithm = function(nums) {
    this.commands = [];
    this.arrayData = nums.slice();

    this.elementIDs.forEach(id => this.cmd("Delete", id));
    this.indexLabels.forEach(id => this.cmd("Delete", id));

    this.elementIDs = [];
    this.indexLabels = [];
    for (let i = 0; i < nums.length; i++) {
        const x = MoveZeroes.START_X + i * MoveZeroes.ELEMENT_WIDTH;
        const elemID = this.nextIndex++;
        this.elementIDs.push(elemID);
        this.cmd("CreateRectangle", elemID, nums[i], MoveZeroes.ELEMENT_WIDTH, MoveZeroes.ELEMENT_HEIGHT, x, MoveZeroes.START_Y);
        this.cmd("SetForegroundColor", elemID, MoveZeroes.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", elemID, MoveZeroes.BACKGROUND_COLOR);

        const labelID = this.nextIndex++;
        this.indexLabels.push(labelID);
        this.cmd("CreateLabel", labelID, i, x, MoveZeroes.START_Y + MoveZeroes.INDEX_OFFSET);
    }

    this.leftPointer = this.nextIndex++;
    this.rightPointer = this.nextIndex++;
    this.cmd("CreateHighlightCircle", this.leftPointer, MoveZeroes.HIGHLIGHT_COLOR,
             MoveZeroes.START_X, MoveZeroes.START_Y - MoveZeroes.INDEX_OFFSET, 15);
    this.cmd("CreateHighlightCircle", this.rightPointer, MoveZeroes.HIGHLIGHT_COLOR,
             MoveZeroes.START_X, MoveZeroes.START_Y - MoveZeroes.INDEX_OFFSET, 15);
    this.cmd("Step");

    let left = 0, right = 0;
    while (right < nums.length) {
        this.cmd("Move", this.rightPointer,
                 MoveZeroes.START_X + right * MoveZeroes.ELEMENT_WIDTH,
                 MoveZeroes.START_Y - MoveZeroes.INDEX_OFFSET);
        this.cmd("Step");

        if (nums[right] !== 0) {
            if (left !== right) {
                [nums[left], nums[right]] = [nums[right], nums[left]];
                const leftID = this.elementIDs[left];
                const rightID = this.elementIDs[right];

                this.cmd("SetText", leftID, nums[left]);
                this.cmd("SetText", rightID, nums[right]);
                this.cmd("Step");
            }

            this.cmd("Move", this.leftPointer,
                     MoveZeroes.START_X + left * MoveZeroes.ELEMENT_WIDTH,
                     MoveZeroes.START_Y - MoveZeroes.INDEX_OFFSET);
            left++;
        }
        right++;
        this.cmd("Step");
    }

    return this.commands;
};

MoveZeroes.prototype.disableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = true);
};

MoveZeroes.prototype.enableUI = function(event) {
    this.controls.forEach(ctrl => ctrl.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MoveZeroes(animManag, canvas.width, canvas.height);
}