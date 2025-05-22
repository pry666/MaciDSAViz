function MergeSortedArrays(am, w, h) {
    this.init(am, w, h);
}

MergeSortedArrays.prototype = new Algorithm();
MergeSortedArrays.prototype.constructor = MergeSortedArrays;
MergeSortedArrays.superclass = Algorithm.prototype;

MergeSortedArrays.ELEMENT_WIDTH = 30;
MergeSortedArrays.ELEMENT_HEIGHT = 30;
MergeSortedArrays.STARTING_X = 50;
MergeSortedArrays.STARTING_Y = 100;
MergeSortedArrays.SPACING = 40;
MergeSortedArrays.FOREGROUND_COLOR = "#000055";
MergeSortedArrays.BACKGROUND_COLOR = "#AAAAFF";

MergeSortedArrays.prototype.init = function(am, w, h) {
    MergeSortedArrays.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.nums1 = [1, 3, 5, 7, 9, 0, 0, 0, 0]; // Example input
    this.m = 5;
    this.nums2 = [2, 4, 6, 8];
    this.n = 4;
    this.rectangles1 = [];
    this.rectangles2 = [];
    this.resultRectangles = [];
    this.drawInitialArrays();
};

MergeSortedArrays.prototype.addControls = function() {
    this.controls = [];

    this.mergeButton = addControlToAlgorithmBar("Button", "Merge Arrays");
    this.mergeButton.onclick = this.mergeCallback.bind(this);
    this.controls.push(this.mergeButton);
};

MergeSortedArrays.prototype.reset = function() {
    this.nextIndex = 0;
    this.drawInitialArrays();
};

MergeSortedArrays.prototype.mergeCallback = function() {
    this.implementAction(this.merge.bind(this));
};

MergeSortedArrays.prototype.merge = function() {
    this.commands = [];
    let i = this.m - 1;
    let j = this.n - 1;
    let k = this.m + this.n - 1;

    while (i >= 0 && j >= 0) {
        if (this.nums1[i] > this.nums2[j]) {
            this.nums1[k] = this.nums1[i];
            this.cmd("SetText", this.resultRectangles[k], this.nums1[i]);
            i--;
        } else {
            this.nums1[k] = this.nums2[j];
            this.cmd("SetText", this.resultRectangles[k], this.nums2[j]);
            j--;
        }
        k--;
        this.cmd("Step");
    }

    while (j >= 0) {
        this.nums1[k] = this.nums2[j];
        this.cmd("SetText", this.resultRectangles[k], this.nums2[j]);
        j--;
        k--;
        this.cmd("Step");
    }

    return this.commands;
};

MergeSortedArrays.prototype.drawInitialArrays = function() {
    this.commands = [];
    for (let i = 0; i < this.m; i++) {
        let rectID = this.nextIndex++;
        this.cmd("CreateRectangle", rectID, this.nums1[i], MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT, MergeSortedArrays.STARTING_X + i * MergeSortedArrays.SPACING, MergeSortedArrays.STARTING_Y);
        this.cmd("SetForegroundColor", rectID, MergeSortedArrays.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", rectID, MergeSortedArrays.BACKGROUND_COLOR);
        this.rectangles1.push(rectID);
    }

    for (let i = 0; i < this.n; i++) {
        let rectID = this.nextIndex++;
        this.cmd("CreateRectangle", rectID, this.nums2[i], MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT, MergeSortedArrays.STARTING_X + i * MergeSortedArrays.SPACING, MergeSortedArrays.STARTING_Y + 100);
        this.cmd("SetForegroundColor", rectID, MergeSortedArrays.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", rectID, MergeSortedArrays.BACKGROUND_COLOR);
        this.rectangles2.push(rectID);
    }

    for (let i = 0; i < this.m + this.n; i++) {
        let rectID = this.nextIndex++;
        this.cmd("CreateRectangle", rectID, "", MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT, MergeSortedArrays.STARTING_X + i * MergeSortedArrays.SPACING, MergeSortedArrays.STARTING_Y + 200);
        this.cmd("SetForegroundColor", rectID, MergeSortedArrays.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", rectID, MergeSortedArrays.BACKGROUND_COLOR);
        this.resultRectangles.push(rectID);
    }

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands); // Execute commands immediately
};

MergeSortedArrays.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

MergeSortedArrays.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MergeSortedArrays(animManag, canvas.width, canvas.height);
}