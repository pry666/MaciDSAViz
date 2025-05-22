function RemoveDuplicatesAndSort(am, w, h) {
    this.init(am, w, h);
}

RemoveDuplicatesAndSort.prototype = new Algorithm();
RemoveDuplicatesAndSort.prototype.constructor = RemoveDuplicatesAndSort;
RemoveDuplicatesAndSort.superclass = Algorithm.prototype;

RemoveDuplicatesAndSort.ELEMENT_WIDTH = 30;
RemoveDuplicatesAndSort.ELEMENT_HEIGHT = 30;
RemoveDuplicatesAndSort.INITIAL_X = 30;
RemoveDuplicatesAndSort.INITIAL_Y = 30;
RemoveDuplicatesAndSort.FOREGROUND_COLOR = "#000055";
RemoveDuplicatesAndSort.BACKGROUND_COLOR = "#AAAAFF";

RemoveDuplicatesAndSort.prototype.init = function(am, w, h) {
    RemoveDuplicatesAndSort.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.arrayID = [];
    this.arrayValues = [];
    this.arrayLength = 0;
    this.sortedArrayID = [];
    this.sortedArrayValues = [];
    this.sortedArrayLength = 0;
    this.commands = [];
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

RemoveDuplicatesAndSort.prototype.addControls = function() {
    this.controls = [];
    this.startButton = addControlToAlgorithmBar("Button", "Start");
    this.startButton.onclick = this.startCallback.bind(this);
    this.controls.push(this.startButton);
};

RemoveDuplicatesAndSort.prototype.reset = function() {
    this.nextIndex = 0;
    this.arrayID = [];
    this.arrayValues = [];
    this.arrayLength = 0;
    this.sortedArrayID = [];
    this.sortedArrayValues = [];
    this.sortedArrayLength = 0;
};

RemoveDuplicatesAndSort.prototype.startCallback = function() {
    this.implementAction(this.start.bind(this), "");
};

RemoveDuplicatesAndSort.prototype.start = function(unused) {
    this.commands = [];
    this.arrayValues = [3, 1, 2, 2, 4, 1, 5, 4];
    this.arrayLength = this.arrayValues.length;
    this.createInitialArray();
    this.cmd("Step");
    this.sortArray();
    this.cmd("Step");
    this.removeDuplicates();
    this.cmd("Step");
    return this.commands;
};

RemoveDuplicatesAndSort.prototype.createInitialArray = function() {
    for (let i = 0; i < this.arrayLength; i++) {
        let id = this.nextIndex++;
        this.arrayID.push(id);
        this.cmd("CreateRectangle", id, this.arrayValues[i], RemoveDuplicatesAndSort.ELEMENT_WIDTH, RemoveDuplicatesAndSort.ELEMENT_HEIGHT, RemoveDuplicatesAndSort.INITIAL_X + i * RemoveDuplicatesAndSort.ELEMENT_WIDTH, RemoveDuplicatesAndSort.INITIAL_Y);
        this.cmd("SetForegroundColor", id, RemoveDuplicatesAndSort.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", id, RemoveDuplicatesAndSort.BACKGROUND_COLOR);
    }
};

RemoveDuplicatesAndSort.prototype.sortArray = function() {
    this.arrayValues.sort((a, b) => a - b);
    for (let i = 0; i < this.arrayLength; i++) {
        this.cmd("SetText", this.arrayID[i], this.arrayValues[i]);
        this.cmd("Step");
    }
};

RemoveDuplicatesAndSort.prototype.removeDuplicates = function() {
    if (!this.arrayValues.length) return;
    let index = 1;
    for (let i = 1; i < this.arrayLength; i++) {
        if (this.arrayValues[i] !== this.arrayValues[i - 1]) {
            this.arrayValues[index] = this.arrayValues[i];
            this.cmd("SetText", this.arrayID[index], this.arrayValues[index]);
            this.cmd("Step");
            index++;
        } else {
            this.cmd("SetHighlight", this.arrayID[i], 1);
            this.cmd("Step");
            this.cmd("SetHighlight", this.arrayID[i], 0);
            this.cmd("Step");
        }
    }
    this.sortedArrayValues = this.arrayValues.slice(0, index);
    this.sortedArrayLength = this.sortedArrayValues.length;
    for (let i = this.sortedArrayLength; i < this.arrayLength; i++) {
        this.cmd("Delete", this.arrayID[i]);
    }
    this.arrayID = this.arrayID.slice(0, this.sortedArrayLength);
    this.arrayValues = this.sortedArrayValues;
    this.arrayLength = this.sortedArrayLength;
};

RemoveDuplicatesAndSort.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

RemoveDuplicatesAndSort.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new RemoveDuplicatesAndSort(animManag, canvas.width, canvas.height);
}