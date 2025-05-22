function DeleteDuplicatesAlgorithm(am, w, h) {
    this.init(am, w, h);
}

DeleteDuplicatesAlgorithm.prototype = new Algorithm();
DeleteDuplicatesAlgorithm.prototype.constructor = DeleteDuplicatesAlgorithm;
DeleteDuplicatesAlgorithm.superclass = Algorithm.prototype;

DeleteDuplicatesAlgorithm.LINKED_LIST_WIDTH = 60;
DeleteDuplicatesAlgorithm.LINKED_LIST_HEIGHT = 30;
DeleteDuplicatesAlgorithm.START_X = 200;
DeleteDuplicatesAlgorithm.START_Y = 100;
DeleteDuplicatesAlgorithm.HIGHLIGHT_COLOR = "#FF0000";
DeleteDuplicatesAlgorithm.FOREGROUND_COLOR = "#000000";
DeleteDuplicatesAlgorithm.BACKGROUND_COLOR = "#FFFFFF";

DeleteDuplicatesAlgorithm.prototype.init = function(am, w, h) {
    DeleteDuplicatesAlgorithm.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.nodes = [];
    this.edges = [];
    this.nodeData = [];
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

DeleteDuplicatesAlgorithm.prototype.addControls = function() {
    this.controls = [];
    this.inputField = addControlToAlgorithmBar("Text", "");
    this.inputField.onkeydown = this.returnSubmit(this.inputField, this.buildCallback.bind(this), 20, false);
    this.controls.push(this.inputField);

    this.buildButton = addControlToAlgorithmBar("Button", "Build List");
    this.buildButton.onclick = this.buildCallback.bind(this);
    this.controls.push(this.buildButton);

    this.runButton = addControlToAlgorithmBar("Button", "Run Algorithm");
    this.runButton.onclick = this.runCallback.bind(this);
    this.controls.push(this.runButton);
};

DeleteDuplicatesAlgorithm.prototype.buildCallback = function(event) {
    var values = this.inputField.value.split(",").filter(x => x !== "");
    this.implementAction(this.buildLinkedList.bind(this), values);
};

DeleteDuplicatesAlgorithm.prototype.runCallback = function(event) {
    this.implementAction(this.deleteDuplicates.bind(this), "");
};

DeleteDuplicatesAlgorithm.prototype.buildLinkedList = function(values) {
    this.commands = [];
    this.nodes = [];
    this.edges = [];
    this.nodeData = values;

    for (var i = 0; i < values.length; i++) {
        var nodeID = this.nextIndex++;
        this.nodes.push(nodeID);
        var xPos = DeleteDuplicatesAlgorithm.START_X + i * 100;
        var yPos = DeleteDuplicatesAlgorithm.START_Y;
        this.cmd("CreateLinkedList", nodeID, values[i],
                DeleteDuplicatesAlgorithm.LINKED_LIST_WIDTH,
                DeleteDuplicatesAlgorithm.LINKED_LIST_HEIGHT,
                xPos, yPos);
        if (i > 0) {
            var edgeID = this.nextIndex++;
            this.edges.push([this.nodes[i-1], nodeID]);
            this.cmd("Connect", this.nodes[i-1], nodeID, "#000000", 0, true);
        }
        this.cmd("Step");
    }
    return this.commands;
};

DeleteDuplicatesAlgorithm.prototype.deleteDuplicates = function() {
    this.commands = [];
    if (this.nodes.length === 0) return this.commands;

    var curIndex = 0;
    while (curIndex < this.nodes.length - 1) {
        var curID = this.nodes[curIndex];
        var nextID = this.nodes[curIndex + 1];

        this.cmd("SetHighlight", curID, true);
        this.cmd("SetHighlight", nextID, true);
        this.cmd("Step");

        if (this.nodeData[curIndex] === this.nodeData[curIndex + 1]) {
            this.cmd("Disconnect", curID, nextID);
            this.cmd("Delete", nextID);
            this.nodes.splice(curIndex + 1, 1);
            this.nodeData.splice(curIndex + 1, 1);

            if (curIndex + 1 < this.nodes.length) {
                this.cmd("Connect", curID, this.nodes[curIndex + 1], "#000000", 0, true);
            }
            this.cmd("Step");
        } else {
            this.cmd("SetHighlight", curID, false);
            curIndex++;
        }
        this.cmd("SetHighlight", nextID, false);
    }
    return this.commands;
};

DeleteDuplicatesAlgorithm.prototype.reset = function() {
    this.nodes = [];
    this.edges = [];
    this.nodeData = [];
    this.nextIndex = 0;
};

DeleteDuplicatesAlgorithm.prototype.disableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = true;
    }
};

DeleteDuplicatesAlgorithm.prototype.enableUI = function(event) {
    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].disabled = false;
    }
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new DeleteDuplicatesAlgorithm(animManag, canvas.width, canvas.height);
}