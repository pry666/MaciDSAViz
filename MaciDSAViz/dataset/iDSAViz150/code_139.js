function MergeSortedArrays(am, w, h) {
    this.init(am, w, h);
}

MergeSortedArrays.prototype = new Algorithm();
MergeSortedArrays.prototype.constructor = MergeSortedArrays;
MergeSortedArrays.superclass = Algorithm.prototype;

MergeSortedArrays.ELEMENT_WIDTH = 40;
MergeSortedArrays.ELEMENT_HEIGHT = 40;
MergeSortedArrays.START_X_NUMS1 = 100;
MergeSortedArrays.START_Y = 100;
MergeSortedArrays.START_X_NUMS2 = 400;
MergeSortedArrays.SPACING = 50;
MergeSortedArrays.HIGHLIGHT_COLOR = "#FF0000";
MergeSortedArrays.FOREGROUND_COLOR = "#000000";
MergeSortedArrays.BACKGROUND_COLOR = "#AAAAFF";

MergeSortedArrays.prototype.init = function(am, w, h) {
    MergeSortedArrays.superclass.init.call(this, am, w, h);
    this.addControls();

    this.nextIndex = 0;
    this.nums1IDs = [];
    this.nums2IDs = [];
    this.p1PointerID = -1;
    this.p2PointerID = -1;
    this.tailPointerID = -1;
    this.commands = [];

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

MergeSortedArrays.prototype.addControls = function() {
    this.controls = [];

    this.mergeButton = addControlToAlgorithmBar("Button", "Merge Arrays");
    this.mergeButton.onclick = this.mergeCallback.bind(this);
    this.controls.push(this.mergeButton);
};

MergeSortedArrays.prototype.reset = function() {
    this.nextIndex = 0;
    this.nums1IDs = [];
    this.nums2IDs = [];
    this.p1PointerID = -1;
    this.p2PointerID = -1;
    this.tailPointerID = -1;
};

MergeSortedArrays.prototype.mergeCallback = function(event) {
    var nums1 = [1,3,5,0,0,0];
    var m = 3;
    var nums2 = [2,4,6];
    var n = 3;
    this.implementAction(this.merge.bind(this), {nums1: nums1, m: m, nums2: nums2, n: n});
};

MergeSortedArrays.prototype.merge = function(params) {
    this.commands = [];

    var nums1 = params.nums1;
    var m = params.m;
    var nums2 = params.nums2;
    var n = params.n;
    var totalLength = m + n;

    this.nums1IDs = new Array(totalLength);
    this.nums2IDs = new Array(n);

    for (var i = 0; i < totalLength; i++) {
        this.nums1IDs[i] = this.nextIndex++;
        var x = MergeSortedArrays.START_X_NUMS1 + i * MergeSortedArrays.SPACING;
        this.cmd("CreateRectangle", this.nums1IDs[i], nums1[i],
                MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT,
                x, MergeSortedArrays.START_Y);
    }

    for (i = 0; i < n; i++) {
        this.nums2IDs[i] = this.nextIndex++;
        var x = MergeSortedArrays.START_X_NUMS2 + i * MergeSortedArrays.SPACING;
        this.cmd("CreateRectangle", this.nums2IDs[i], nums2[i],
                MergeSortedArrays.ELEMENT_WIDTH, MergeSortedArrays.ELEMENT_HEIGHT,
                x, MergeSortedArrays.START_Y);
        this.cmd("SetBackgroundColor", this.nums2IDs[i], "#AAFFAA");
    }

    var p1 = m - 1;
    var p2 = n - 1;
    var tail = m + n - 1;

    this.p1PointerID = this.nextIndex++;
    this.p2PointerID = this.nextIndex++;
    this.tailPointerID = this.nextIndex++;

    this.cmd("CreateHighlightCircle", this.p1PointerID, MergeSortedArrays.HIGHLIGHT_COLOR,
            MergeSortedArrays.START_X_NUMS1 + p1 * MergeSortedArrays.SPACING,
            MergeSortedArrays.START_Y - 60, 15);
    this.cmd("CreateHighlightCircle", this.p2PointerID, MergeSortedArrays.HIGHLIGHT_COLOR,
            MergeSortedArrays.START_X_NUMS2 + p2 * MergeSortedArrays.SPACING,
            MergeSortedArrays.START_Y - 60, 15);
    this.cmd("CreateHighlightCircle", this.tailPointerID, MergeSortedArrays.HIGHLIGHT_COLOR,
            MergeSortedArrays.START_X_NUMS1 + tail * MergeSortedArrays.SPACING,
            MergeSortedArrays.START_Y + 60, 15);

    this.cmd("Step");

    while (p1 >= 0 || p2 >= 0) {
        if (p1 === -1) {
            this.cmd("SetText", this.nums1IDs[tail], nums2[p2]);
            this.cmd("Step");
            p2--;
        } else if (p2 === -1) {
            this.cmd("SetText", this.nums1IDs[tail], nums1[p1]);
            this.cmd("Step");
            p1--;
        } else if (nums1[p1] > nums2[p2]) {
            this.cmd("SetText", this.nums1IDs[tail], nums1[p1]);
            this.cmd("Step");
            p1--;
        } else {
            this.cmd("SetText", this.nums1IDs[tail], nums2[p2]);
            this.cmd("Step");
            p2--;
        }

        tail--;

        if (p1 >= 0) {
            this.cmd("Move", this.p1PointerID,
                    MergeSortedArrays.START_X_NUMS1 + p1 * MergeSortedArrays.SPACING,
                    MergeSortedArrays.START_Y - 60);
        }
        if (p2 >= 0) {
            this.cmd("Move", this.p2PointerID,
                    MergeSortedArrays.START_X_NUMS2 + p2 * MergeSortedArrays.SPACING,
                    MergeSortedArrays.START_Y - 60);
        }
        if (tail >= 0) {
            this.cmd("Move", this.tailPointerID,
                    MergeSortedArrays.START_X_NUMS1 + tail * MergeSortedArrays.SPACING,
                    MergeSortedArrays.START_Y + 60);
        }
        this.cmd("Step");
    }

    this.cmd("Delete", this.p1PointerID);
    this.cmd("Delete", this.p2PointerID);
    this.cmd("Delete", this.tailPointerID);
    this.cmd("Step");

    return this.commands;
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