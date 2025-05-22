function MergeSortedArrays(am, w, h) {
    this.init(am, w, h);
}

MergeSortedArrays.prototype = new Algorithm();
MergeSortedArrays.prototype.constructor = MergeSortedArrays;
MergeSortedArrays.superclass = Algorithm.prototype;

MergeSortedArrays.ELEMENT_WIDTH = 40;
MergeSortedArrays.ELEMENT_HEIGHT = 40;
MergeSortedArrays.START_X_NUMS1 = 100;
MergeSortedArrays.START_X_NUMS2 = 300;
MergeSortedArrays.START_Y = 100;
MergeSortedArrays.MERGED_START_X = 200;
MergeSortedArrays.MERGED_START_Y = 250;
MergeSortedArrays.HIGHLIGHT_COLOR = "#FF0000";
MergeSortedArrays.NORMAL_COLOR = "#000000";

MergeSortedArrays.prototype.init = function(am, w, h) {
    MergeSortedArrays.superclass.init.call(this, am, w, h);
    this.addControls();

    this.nextIndex = 0;
    this.nums1 = [1, 3, 5];
    this.m = 3;
    this.nums2 = [2, 4];
    this.n = 2;
    this.sorted = [];
    this.p1 = 0;
    this.p2 = 0;

    this.array1ID = [];
    this.array2ID = [];
    this.mergedID = [];
    this.p1Label = null;
    this.p2Label = null;
    this.highlightCircle1 = null;
    this.highlightCircle2 = null;

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

MergeSortedArrays.prototype.addControls = function() {
    this.controls = [];

    this.mergeButton = addControlToAlgorithmBar("Button", "Merge");
    this.mergeButton.onclick = this.mergeCallback.bind(this);
    this.controls.push(this.mergeButton);
};

MergeSortedArrays.prototype.reset = function() {
    this.nextIndex = 0;
    this.p1 = 0;
    this.p2 = 0;
    this.sorted = [];
};

MergeSortedArrays.prototype.mergeCallback = function(event) {
    this.implementAction(this.merge.bind(this), "");
};

MergeSortedArrays.prototype.merge = function(unused) {
    this.commands = [];

    this.createArrays();
    this.createPointers();

    while (this.p1 < this.m || this.p2 < this.n) {
        if (this.p1 === this.m) {
            this.addFromNums2();
        } else if (this.p2 === this.n) {
            this.addFromNums1();
        } else {
            this.compareElements();
        }
    }
    this.copyToNums1();
    return this.commands;
};

MergeSortedArrays.prototype.createArrays = function() {
    for (let i = 0; i < this.m; i++) {
        this.array1ID[i] = this.nextIndex++;
        this.cmd("CreateRectangle", this.array1ID[i], this.nums1[i],
                  MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT,
                  MergeSortedArrays.START_X_NUMS1 + i*MergeSortedArrays.ELEMENT_WIDTH,
                  MergeSortedArrays.START_Y);
    }

    for (let i = 0; i < this.n; i++) {
        this.array2ID[i] = this.nextIndex++;
        this.cmd("CreateRectangle", this.array2ID[i], this.nums2[i],
                  MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT,
                  MergeSortedArrays.START_X_NUMS2 + i*MergeSortedArrays.ELEMENT_WIDTH,
                  MergeSortedArrays.START_Y);
    }
    this.cmd("Step");
};

MergeSortedArrays.prototype.createPointers = function() {
    this.p1Label = this.nextIndex++;
    this.cmd("CreateLabel", this.p1Label, "p1",
             MergeSortedArrays.START_X_NUMS1 - 30,
             MergeSortedArrays.START_Y + MergeSortedArrays.ELEMENT_HEIGHT + 10);

    this.p2Label = this.nextIndex++;
    this.cmd("CreateLabel", this.p2Label, "p2",
             MergeSortedArrays.START_X_NUMS2 - 30,
             MergeSortedArrays.START_Y + MergeSortedArrays.ELEMENT_HEIGHT + 10);

    this.highlightCircle1 = this.nextIndex++;
    this.highlightCircle2 = this.nextIndex++;

    this.updateHighlights();
    this.cmd("Step");
};

MergeSortedArrays.prototype.updateHighlights = function() {
    if (this.p1 < this.m) {
        const x = MergeSortedArrays.START_X_NUMS1 + this.p1*MergeSortedArrays.ELEMENT_WIDTH;
        const y = MergeSortedArrays.START_Y;
        this.cmd("CreateHighlightCircle", this.highlightCircle1, MergeSortedArrays.HIGHLIGHT_COLOR,
                 x + MergeSortedArrays.ELEMENT_WIDTH/2, y - MergeSortedArrays.ELEMENT_HEIGHT/2, 25);
    }
    if (this.p2 < this.n) {
        const x = MergeSortedArrays.START_X_NUMS2 + this.p2*MergeSortedArrays.ELEMENT_WIDTH;
        const y = MergeSortedArrays.START_Y;
        this.cmd("CreateHighlightCircle", this.highlightCircle2, MergeSortedArrays.HIGHLIGHT_COLOR,
                 x + MergeSortedArrays.ELEMENT_WIDTH/2, y - MergeSortedArrays.ELEMENT_HEIGHT/2, 25);
    }
    this.cmd("Step");
};

MergeSortedArrays.prototype.addFromNums1 = function() {
    this.moveElement(this.array1ID[this.p1], this.p1, true);
    this.p1++;
    this.updatePointers();
};

MergeSortedArrays.prototype.addFromNums2 = function() {
    this.moveElement(this.array2ID[this.p2], this.p2, false);
    this.p2++;
    this.updatePointers();
};

MergeSortedArrays.prototype.compareElements = function() {
    if (this.nums1[this.p1] < this.nums2[this.p2]) {
        this.addFromNums1();
    } else {
        this.addFromNums2();
    }
};

MergeSortedArrays.prototype.moveElement = function(elementID, index, isNums1) {
    const xPos = isNums1 ? MergeSortedArrays.START_X_NUMS1 + index*MergeSortedArrays.ELEMENT_WIDTH
                         : MergeSortedArrays.START_X_NUMS2 + index*MergeSortedArrays.ELEMENT_WIDTH;
    const yPos = MergeSortedArrays.START_Y;

    this.cmd("Move", elementID, xPos, yPos + 50);
    this.cmd("Step");

    const newID = this.nextIndex++;
    this.mergedID.push(newID);
    const mergedIndex = this.mergedID.length - 1;
    const mergedX = MergeSortedArrays.MERGED_START_X + mergedIndex*MergeSortedArrays.ELEMENT_WIDTH;
    const mergedY = MergeSortedArrays.MERGED_START_Y;

    this.cmd("Move", elementID, mergedX, mergedY);
    this.cmd("Step");
};

MergeSortedArrays.prototype.updatePointers = function() {
    this.cmd("Delete", this.highlightCircle1);
    this.cmd("Delete", this.highlightCircle2);

    this.cmd("SetPosition", this.p1Label,
             MergeSortedArrays.START_X_NUMS1 + this.p1*MergeSortedArrays.ELEMENT_WIDTH - 30,
             MergeSortedArrays.START_Y + MergeSortedArrays.ELEMENT_HEIGHT + 10);

    this.cmd("SetPosition", this.p2Label,
             MergeSortedArrays.START_X_NUMS2 + this.p2*MergeSortedArrays.ELEMENT_WIDTH - 30,
             MergeSortedArrays.START_Y + MergeSortedArrays.ELEMENT_HEIGHT + 10);

    this.updateHighlights();
};

MergeSortedArrays.prototype.copyToNums1 = function() {
    this.cmd("Step");
    for (let i = 0; i < this.mergedID.length; i++) {
        this.cmd("SetForegroundColor", this.mergedID[i], "#00FF00");
    }
    this.cmd("Step");
};

MergeSortedArrays.prototype.disableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

MergeSortedArrays.prototype.enableUI = function(event) {
    for (let i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MergeSortedArrays(animManag, canvas.width, canvas.height);
}