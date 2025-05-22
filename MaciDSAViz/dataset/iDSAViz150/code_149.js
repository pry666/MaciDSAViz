function PreorderTraversal(am, w, h) {
    this.init(am, w, h);
}

PreorderTraversal.prototype = new Algorithm();
PreorderTraversal.prototype.constructor = PreorderTraversal;
PreorderTraversal.superclass = Algorithm.prototype;

PreorderTraversal.HIGHLIGHT_COLOR = "#FF0000";
PreorderTraversal.FOREGROUND_COLOR = "#000000";
PreorderTraversal.BACKGROUND_COLOR = "#FFFFFF";
PreorderTraversal.NODE_WIDTH = 40;
PreorderTraversal.NODE_HEIGHT = 40;
PreorderTraversal.START_X = 50;
PreorderTraversal.START_Y = 50;
PreorderTraversal.STACK_X = 300;
PreorderTraversal.STACK_Y = 50;
PreorderTraversal.RESULT_X = 500;
PreorderTraversal.RESULT_Y = 50;
PreorderTraversal.H_SPACING = 50;
PreorderTraversal.V_SPACING = 60;

PreorderTraversal.prototype.init = function(am, w, h) {
    PreorderTraversal.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.stackIDs = [];
    this.resultIDs = [];
    this.nodeMap = {};
    this.edges = [];
    this.buildTree();

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

PreorderTraversal.prototype.buildTree = function() {
    this.commands = [];
    const nodes = [
        {val:1, x:400, y:50, left:2, right:3},
        {val:2, x:300, y:110, left:4, right:5},
        {val:3, x:500, y:110, left:6, right:7},
        {val:4, x:250, y:170, left:8, right:9},
        {val:5, x:350, y:170, left:10, right:11},
        {val:6, x:450, y:170, left:12, right:13},
        {val:7, x:550, y:170, left:14, right:15},
        {val:8, x:200, y:230},
        {val:9, x:300, y:230},
        {val:10, x:400, y:230},
        {val:11, x:500, y:230},
        {val:12, x:600, y:230},
        {val:13, x:700, y:230},
        {val:14, x:800, y:230},
        {val:15, x:900, y:230}
    ];

    nodes.forEach(node => {
        const id = this.nextIndex++;
        this.nodeMap[node.val] = id;
        this.cmd("CreateRectangle", id, node.val, PreorderTraversal.NODE_WIDTH,
                PreorderTraversal.NODE_HEIGHT, node.x, node.y);
        this.cmd("SetForegroundColor", id, PreorderTraversal.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", id, PreorderTraversal.BACKGROUND_COLOR);
    });

    this.connectNodes(1,2,3);
    this.connectNodes(2,4,5);
    this.connectNodes(3,6,7);
    this.connectNodes(4,8,9);
    this.connectNodes(5,10,11);
    this.connectNodes(6,12,13);
    this.connectNodes(7,14,15);
};

PreorderTraversal.prototype.connectNodes = function(parentVal, leftVal, rightVal) {
    const parentID = this.nodeMap[parentVal];
    if (leftVal) {
        const leftID = this.nodeMap[leftVal];
        this.edges.push([parentID, leftID]);
        this.cmd("Connect", parentID, leftID, "#000000", 0, true);
    }
    if (rightVal) {
        const rightID = this.nodeMap[rightVal];
        this.edges.push([parentID, rightID]);
        this.cmd("Connect", parentID, rightID, "#000000", 0, true);
    }
};

PreorderTraversal.prototype.addControls = function() {
    this.controls = [];
    this.startButton = addControlToAlgorithmBar("Button", "Start Traversal");
    this.startButton.onclick = this.startCallback.bind(this);
    this.controls.push(this.startButton);
};

PreorderTraversal.prototype.startCallback = function(event) {
    this.implementAction(this.traverse.bind(this), "");
};

PreorderTraversal.prototype.traverse = function(ignored) {
    this.commands = [];
    const stack = [];
    let resultIndex = 0;
    const rootID = this.nodeMap[1];

    const stackLabelID = this.nextIndex++;
    this.cmd("CreateLabel", stackLabelID, "Stack", PreorderTraversal.STACK_X - 40, PreorderTraversal.STACK_Y - 30);

    const resultLabelID = this.nextIndex++;
    this.cmd("CreateLabel", resultLabelID, "Result:", PreorderTraversal.RESULT_X - 40, PreorderTraversal.RESULT_Y - 30);

    stack.push(rootID);
    this.pushToStackVisual(rootID);
    this.cmd("Step");

    while (stack.length > 0) {
        const nodeID = stack.pop();
        this.popFromStackVisual(nodeID);
        this.cmd("SetHighlight", nodeID, 1);
        this.cmd("Step");

        const resultID = this.nextIndex++;
        this.resultIDs.push(resultID);
        this.cmd("CreateRectangle", resultID, this.getNodeValue(nodeID),
                PreorderTraversal.NODE_WIDTH, PreorderTraversal.NODE_HEIGHT,
                PreorderTraversal.RESULT_X + resultIndex * 50, PreorderTraversal.RESULT_Y);
        resultIndex++;
        this.cmd("Step");

        const rightChild = this.getRightChild(nodeID);
        const leftChild = this.getLeftChild(nodeID);

        if (rightChild) {
            stack.push(rightChild);
            this.pushToStackVisual(rightChild);
        }
        if (leftChild) {
            stack.push(leftChild);
            this.pushToStackVisual(leftChild);
        }

        this.cmd("SetHighlight", nodeID, 0);
        this.cmd("Step");
    }

    return this.commands;
};

PreorderTraversal.prototype.pushToStackVisual = function(nodeID) {
    const stackPos = this.stackIDs.length;
    const newStackID = this.nextIndex++;
    this.stackIDs.push(newStackID);
    this.cmd("CreateRectangle", newStackID, this.getNodeValue(nodeID),
            PreorderTraversal.NODE_WIDTH, PreorderTraversal.NODE_HEIGHT,
            PreorderTraversal.STACK_X, PreorderTraversal.STACK_Y + stackPos * 50);
    this.cmd("Move", newStackID, PreorderTraversal.STACK_X, PreorderTraversal.STACK_Y + stackPos * 50);
};

PreorderTraversal.prototype.popFromStackVisual = function(nodeID) {
    if (this.stackIDs.length > 0) {
        const stackID = this.stackIDs.pop();
        this.cmd("Delete", stackID);
    }
};

PreorderTraversal.prototype.getNodeValue = function(nodeID) {
    for (const [val, id] of Object.entries(this.nodeMap)) {
        if (id === nodeID) return val;
    }
    return "";
};

PreorderTraversal.prototype.getLeftChild = function(nodeID) {
    const val = parseInt(this.getNodeValue(nodeID));
    const leftVal = val * 2;
    return this.nodeMap[leftVal] || null;
};

PreorderTraversal.prototype.getRightChild = function(nodeID) {
    const val = parseInt(this.getNodeValue(nodeID));
    const rightVal = val * 2 + 1;
    return this.nodeMap[rightVal] || null;
};

PreorderTraversal.prototype.reset = function() {
    this.stackIDs = [];
    this.resultIDs = [];
    this.nextIndex = 0;
    for (const id in this.nodeMap) {
        this.cmd("Delete", this.nodeMap[id]);
    }
    this.edges.forEach(edge => {
        this.cmd("Delete", edge[0] + "_" + edge[1]);
    });
    this.nodeMap = {};
    this.buildTree();
};

PreorderTraversal.prototype.disableUI = function(event) {
    this.controls.forEach(control => control.disabled = true);
};

PreorderTraversal.prototype.enableUI = function(event) {
    this.controls.forEach(control => control.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new PreorderTraversal(animManag, canvas.width, canvas.height);
}