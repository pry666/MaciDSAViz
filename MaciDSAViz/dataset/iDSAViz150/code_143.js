function MergeLists(am, w, h) {
    this.init(am, w, h);
}

MergeLists.prototype = new Algorithm();
MergeLists.prototype.constructor = MergeLists;
MergeLists.superclass = Algorithm.prototype;

MergeLists.LIST_START_X = 100;
MergeLists.LIST_START_Y = 200;
MergeLists.LIST_ELEM_WIDTH = 50;
MergeLists.LIST_ELEM_HEIGHT = 50;
MergeLists.LIST_ELEM_SPACING = 70;

MergeLists.prototype.init = function(am, w, h) {
    MergeLists.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.setup();
    this.initialIndex = this.nextIndex;
}

MergeLists.prototype.addControls = function() {
    this.controls = [];

    this.mergeButton = addControlToAlgorithmBar("Button", "合并");
    this.mergeButton.onclick = this.mergeCallback.bind(this);
    this.controls.push(this.mergeButton);
}

MergeLists.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
}

MergeLists.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
}

MergeLists.prototype.setup = function() {
    this.nextIndex = 0;

    this.list1 = [1, 3, 5];
    this.list1ID = [];
    this.list1LabelID = [];
    for (var i = 0; i < this.list1.length; i++) {
        this.list1ID[i] = this.nextIndex++;
        this.list1LabelID[i] = this.nextIndex++;
        var xpos = MergeLists.LIST_START_X + i * MergeLists.LIST_ELEM_SPACING;
        var ypos = MergeLists.LIST_START_Y;
        this.cmd("CreateLinkedList", this.list1ID[i], this.list1[i], MergeLists.LIST_ELEM_WIDTH, MergeLists.LIST_ELEM_HEIGHT, xpos, ypos);
        this.cmd("CreateLabel", this.list1LabelID[i], "L1[" + i + "]", xpos, ypos + MergeLists.LIST_ELEM_HEIGHT, true);
    }

    this.list2 = [2, 4, 6];
    this.list2ID = [];
    this.list2LabelID = [];
    for (var i = 0; i < this.list2.length; i++) {
        this.list2ID[i] = this.nextIndex++;
        this.list2LabelID[i] = this.nextIndex++;
        var xpos = MergeLists.LIST_START_X + i * MergeLists.LIST_ELEM_SPACING;
        var ypos = MergeLists.LIST_START_Y + 100;
        this.cmd("CreateLinkedList", this.list2ID[i], this.list2[i], MergeLists.LIST_ELEM_WIDTH, MergeLists.LIST_ELEM_HEIGHT, xpos, ypos);
        this.cmd("CreateLabel", this.list2LabelID[i], "L2[" + i + "]", xpos, ypos + MergeLists.LIST_ELEM_HEIGHT, true);
    }

    this.dummyID = this.nextIndex++;
    this.dummyLabelID = this.nextIndex++;
    var xpos = MergeLists.LIST_START_X - MergeLists.LIST_ELEM_SPACING;
    var ypos = MergeLists.LIST_START_Y + 50;
    this.cmd("CreateLinkedList", this.dummyID, "D", MergeLists.LIST_ELEM_WIDTH, MergeLists.LIST_ELEM_HEIGHT, xpos, ypos);
    this.cmd("CreateLabel", this.dummyLabelID, "Dummy", xpos, ypos + MergeLists.LIST_ELEM_HEIGHT, true);

    this.currentID = this.dummyID;
    this.currentLabelID = this.dummyLabelID;

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
}

MergeLists.prototype.reset = function() {
    this.nextIndex = this.initialIndex;
    this.currentID = this.dummyID;
    this.currentLabelID = this.dummyLabelID;
}

MergeLists.prototype.mergeCallback = function(event) {
    this.implementAction(this.mergeLists.bind(this), "");
}

MergeLists.prototype.mergeLists = function() {
    this.commands = [];
    var l1Index = 0;
    var l2Index = 0;

    while (l1Index < this.list1.length && l2Index < this.list2.length) {
        if (this.list1[l1Index] < this.list2[l2Index]) {
            this.connectNodes(this.currentID, this.list1ID[l1Index]);
            this.currentID = this.list1ID[l1Index];
            this.currentLabelID = this.list1LabelID[l1Index];
            l1Index++;
        } else {
            this.connectNodes(this.currentID, this.list2ID[l2Index]);
            this.currentID = this.list2ID[l2Index];
            this.currentLabelID = this.list2LabelID[l2Index];
            l2Index++;
        }
        this.cmd("Step");
    }

    if (l1Index < this.list1.length) {
        this.connectNodes(this.currentID, this.list1ID[l1Index]);
        this.cmd("Step");
    }

    if (l2Index < this.list2.length) {
        this.connectNodes(this.currentID, this.list2ID[l2Index]);
        this.cmd("Step");
    }

    return this.commands;
}

MergeLists.prototype.connectNodes = function(fromID, toID) {
    this.cmd("Connect", fromID, toID, "#0000FF", 0, true, "");
    this.cmd("Step");
}

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new MergeLists(animManag, canvas.width, canvas.height);
}