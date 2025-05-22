function PostorderTraversal(am, w, h) {
    this.init(am, w, h);
}

PostorderTraversal.prototype = new Algorithm();
PostorderTraversal.prototype.constructor = PostorderTraversal;
PostorderTraversal.superclass = Algorithm.prototype;

PostorderTraversal.prototype.init = function(am, w, h) {
    PostorderTraversal.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;
    this.treeRoot = this.buildTree();
    this.stackID = [];
    this.resultID = [];
    this.currentHighlight = null;
    this.lastVisitedHighlight = null;
    this.stackIndex = 0;
    this.resultIndex = 0;
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

PostorderTraversal.prototype.buildTree = function() {
    const nodePositions = {
        1:  {x: 400, y: 50},
        2:  {x: 250, y: 150},
        3:  {x: 550, y: 150},
        4:  {x: 150, y: 250},
        5:  {x: 350, y: 250},
        6:  {x: 450, y: 250},
        7:  {x: 650, y: 250},
        8:  {x: 100, y: 350},
        9:  {x: 200, y: 350},
        10: {x: 300, y: 350},
        11: {x: 400, y: 350},
        12: {x: 500, y: 350},
        13: {x: 600, y: 350},
        14: {x: 700, y: 350},
        15: {x: 800, y: 350}
    };

    const nodes = {};
    for (let i = 1; i <= 15; i++) {
        nodes[i] = this.nextIndex++;
        this.cmd("CreateCircle", nodes[i], i, nodePositions[i].x, nodePositions[i].y);
    }

    this.connectNodes(nodes[1], nodes[2], nodes[3]);
    this.connectNodes(nodes[2], nodes[4], nodes[5]);
    this.connectNodes(nodes[4], nodes[8], nodes[9]);
    this.connectNodes(nodes[5], nodes[10], nodes[11]);
    this.connectNodes(nodes[3], nodes[6], nodes[7]);
    this.connectNodes(nodes[6], nodes[12], nodes[13]);
    this.connectNodes(nodes[7], nodes[14], nodes[15]);

    return nodes;
};

PostorderTraversal.prototype.connectNodes = function(parent, left, right) {
    if (left) {
        this.cmd("Connect", parent, left, "#000000", 0, true);
    }
    if (right) {
        this.cmd("Connect", parent, right, "#000000", 0, true);
    }
};

PostorderTraversal.prototype.addControls = function() {
    this.controls = [];
    this.traversalButton = addControlToAlgorithmBar("Button", "Start Postorder Traversal");
    this.traversalButton.onclick = this.startTraversalCallback.bind(this);
    this.controls.push(this.traversalButton);
};

PostorderTraversal.prototype.startTraversalCallback = function(event) {
    this.implementAction(this.startTraversal.bind(this), "");
};

PostorderTraversal.prototype.startTraversal = function(unused) {
    this.commands = [];
    this.clearOldObjects();

    let stack = [];
    let result = [];
    let current = 1;
    let lastVisited = null;
    let stackObjects = [];
    let currentHighlight = this.nextIndex++;
    let lastVisitedHighlight = this.nextIndex++;

    this.cmd("CreateHighlightCircle", currentHighlight, "#FF0000", 400, 50, 20);
    this.cmd("CreateHighlightCircle", lastVisitedHighlight, "#0000FF", -100, -100, 20);
    this.cmd("Step");

    while (stack.length > 0 || current) {
        if (current) {
            stack.push(current);
            stackObjects.push(this.createStackNode(current));
            this.moveHighlight(currentHighlight, current);
            this.cmd("Step");

            let nextCurrent = this.getLeftChild(current);
            current = nextCurrent ? nextCurrent : null;
        } else {
            let peekNode = stack[stack.length-1];
            this.moveHighlight(currentHighlight, peekNode);
            this.cmd("Step");

            let rightChild = this.getRightChild(peekNode);
            if (rightChild && lastVisited !== rightChild) {
                current = rightChild;
            } else {
                result.push(peekNode);
                this.addResultNode(peekNode);
                lastVisited = stack.pop();
                stackObjects.pop().destroy();
                this.moveHighlight(lastVisitedHighlight, lastVisited);
                this.cmd("Step");
            }
        }
    }

    this.cmd("Delete", currentHighlight);
    this.cmd("Delete", lastVisitedHighlight);
    return this.commands;
};

PostorderTraversal.prototype.createStackNode = function(value) {
    let stackNodeID = this.nextIndex++;
    this.stackID.push(stackNodeID);
    let xPos = 700 - this.stackIndex * 30;
    let yPos = 100 + this.stackIndex * 30;
    this.cmd("CreateRectangle", stackNodeID, value, 40, 40, xPos, yPos);
    this.cmd("SetForegroundColor", stackNodeID, "#FFFFFF");
    this.cmd("SetBackgroundColor", stackNodeID, "#444444");
    this.stackIndex++;
    return {id: stackNodeID, destroy: () => this.cmd("Delete", stackNodeID)};
};

PostorderTraversal.prototype.addResultNode = function(value) {
    let resultNodeID = this.nextIndex++;
    this.resultID.push(resultNodeID);
    let xPos = 100 + this.resultIndex * 50;
    this.cmd("CreateRectangle", resultNodeID, value, 40, 40, xPos, 450);
    this.cmd("SetForegroundColor", resultNodeID, "#FFFFFF");
    this.cmd("SetBackgroundColor", resultNodeID, "#008800");
    this.resultIndex++;
};

PostorderTraversal.prototype.moveHighlight = function(highlightID, nodeID) {
    let x = this.getNodeX(nodeID);
    let y = this.getNodeY(nodeID);
    this.cmd("Move", highlightID, x, y);
};

PostorderTraversal.prototype.getLeftChild = function(node) {
    const leftChildren = {1:2, 2:4, 4:8, 5:10, 3:6, 6:12, 7:14};
    return leftChildren[node] || null;
};

PostorderTraversal.prototype.getRightChild = function(node) {
    const rightChildren = {1:3, 2:5, 4:9, 5:11, 3:7, 6:13, 7:15};
    return rightChildren[node] || null;
};

PostorderTraversal.prototype.getNodeX = function(node) {
    const positions = {1:400,2:250,3:550,4:150,5:350,6:450,7:650,8:100,9:200,10:300,11:400,12:500,13:600,14:700,15:800};
    return positions[node];
};

PostorderTraversal.prototype.getNodeY = function(node) {
    const positions = {1:50,2:150,3:150,4:250,5:250,6:250,7:250,8:350,9:350,10:350,11:350,12:350,13:350,14:350,15:350};
    return positions[node];
};

PostorderTraversal.prototype.clearOldObjects = function() {
    this.stackID.forEach(id => this.cmd("Delete", id));
    this.resultID.forEach(id => this.cmd("Delete", id));
    this.stackID = [];
    this.resultID = [];
    this.stackIndex = 0;
    this.resultIndex = 0;
};

PostorderTraversal.prototype.reset = function() {
    this.nextIndex = 0;
    this.stackID = [];
    this.resultID = [];
    this.stackIndex = 0;
    this.resultIndex = 0;
};

PostorderTraversal.prototype.disableUI = function(event) {
    this.controls.forEach(control => control.disabled = true);
};

PostorderTraversal.prototype.enableUI = function(event) {
    this.controls.forEach(control => control.disabled = false);
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new PostorderTraversal(animManag, canvas.width, canvas.height);
}