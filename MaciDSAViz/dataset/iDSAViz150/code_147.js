function InorderTraversal(am, w, h) {
    this.init(am, w, h);
}

InorderTraversal.prototype = new Algorithm();
InorderTraversal.prototype.constructor = InorderTraversal;
InorderTraversal.superclass = Algorithm.prototype;

InorderTraversal.NODE_RADIUS = 20;
InorderTraversal.NODE_SPACING_X = 50;
InorderTraversal.NODE_SPACING_Y = 60;
InorderTraversal.START_X = 400;
InorderTraversal.START_Y = 50;
InorderTraversal.HIGHLIGHT_COLOR = "#FF0000";
InorderTraversal.PROCESSED_COLOR = "#00FF00";
InorderTraversal.STACK_START_X = 100;
InorderTraversal.STACK_START_Y = 200;

InorderTraversal.prototype.init = function(am, w, h) {
    InorderTraversal.superclass.init.call(this, am, w, h);
    this.addControls();
    this.nextIndex = 0;

    this.treeNodes = [];
    this.stackIDs = [];
    this.resultIDs = [];
    this.highlightIDs = [];
    this.buildTree();
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
};

InorderTraversal.prototype.buildTree = function() {
    this.root = this.createTreeNode(1, InorderTraversal.START_X, InorderTraversal.START_Y);
    this.buildSubTree(this.root, 3, InorderTraversal.START_X, InorderTraversal.START_Y);
};

InorderTraversal.prototype.buildSubTree = function(parent, depth, x, y) {
    if (depth <= 0) return;
    const xOffset = InorderTraversal.NODE_SPACING_X * Math.pow(2, depth-2);

    const left = this.createTreeNode(parent.val*2, x - xOffset, y + InorderTraversal.NODE_SPACING_Y);
    parent.left = left;
    this.cmd("Connect", parent.graphicID, left.graphicID);
    this.buildSubTree(left, depth-1, x - xOffset, y + InorderTraversal.NODE_SPACING_Y);

    const right = this.createTreeNode(parent.val*2+1, x + xOffset, y + InorderTraversal.NODE_SPACING_Y);
    parent.right = right;
    this.cmd("Connect", parent.graphicID, right.graphicID);
    this.buildSubTree(right, depth-1, x + xOffset, y + InorderTraversal.NODE_SPACING_Y);
};

InorderTraversal.prototype.createTreeNode = function(val, x, y) {
    const node = {
        graphicID: this.nextIndex++,
        val: val,
        left: null,
        right: null,
        x: x,
        y: y
    };
    this.cmd("CreateCircle", node.graphicID, val, x, y);
    this.treeNodes.push(node);
    return node;
};

InorderTraversal.prototype.addControls = function() {
    this.controls = [];
    this.startButton = addControlToAlgorithmBar("Button", "Start Inorder Traversal");
    this.startButton.onclick = this.startCallback.bind(this);
    this.controls.push(this.startButton);
};

InorderTraversal.prototype.startCallback = function(event) {
    this.implementAction(this.inorderTraversal.bind(this), "");
};

InorderTraversal.prototype.inorderTraversal = function(ignored) {
    this.commands = [];
    this.clearHighlight();

    const stack = [];
    let current = this.root;
    let result = [];
    let stackPos = 0;
    let resultPos = 0;

    while (stack.length > 0 || current != null) {
        while (current != null) {
            const highlightID = this.nextIndex++;
            this.highlightIDs.push(highlightID);
            this.cmd("CreateHighlightCircle", highlightID, InorderTraversal.HIGHLIGHT_COLOR, current.x, current.y);
            this.cmd("Step");

            stack.push(current);
            const stackNodeID = this.nextIndex++;
            this.stackIDs.push(stackNodeID);
            this.cmd("CreateRectangle", stackNodeID, current.val, 40, 40,
                      InorderTraversal.STACK_START_X, InorderTraversal.STACK_START_Y + stackPos*50);
            stackPos++;
            current = current.left;
        }

        current = stack.pop();
        stackPos--;
        this.cmd("Delete", this.stackIDs.pop());
        this.cmd("SetForegroundColor", current.graphicID, InorderTraversal.PROCESSED_COLOR);
        this.cmd("Step");

        const resultID = this.nextIndex++;
        this.resultIDs.push(resultID);
        this.cmd("CreateLabel", resultID, current.val, current.x, current.y);
        this.cmd("Move", resultID, 500 + resultPos*40, 50);
        this.cmd("Step");
        resultPos++;

        current = current.right;
    }
    return this.commands;
};

InorderTraversal.prototype.clearHighlight = function() {
    this.highlightIDs.forEach(id => this.cmd("Delete", id));
    this.highlightIDs = [];
};

InorderTraversal.prototype.reset = function() {
    this.nextIndex = 0;
    this.treeNodes.forEach(node => this.cmd("Delete", node.graphicID));
    this.stackIDs.forEach(id => this.cmd("Delete", id));
    this.resultIDs.forEach(id => this.cmd("Delete", id));
    this.treeNodes = [];
    this.stackIDs = [];
    this.resultIDs = [];
    this.highlightIDs = [];
    this.buildTree();
};

InorderTraversal.prototype.disableUI = function(event) {
    this.controls.forEach(control => control.disabled = true);
};

InorderTraversal.prototype.enableUI = function(event) {
    this.controls.forEach(control => control.disabled = false);
};

var currentAlg;
function init() {
    var animManag = initCanvas();
    currentAlg = new InorderTraversal(animManag, canvas.width, canvas.height);
}