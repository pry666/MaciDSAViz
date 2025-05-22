var REDGROUND = "#FF0000";
var BLACKGROUD = "#000000";

function Fibonacci(am, w, h)
{
	this.init(am, w, h);

}

Fibonacci.prototype = new Algorithm();
Fibonacci.prototype.constructor = Fibonacci;
Fibonacci.superclass = Algorithm.prototype;


Fibonacci.prototype.init = function(am, w, h)
{
	Fibonacci.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


Fibonacci.prototype.addControls =  function()
{
	this.controls = [];
	this.pushField = addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.fibCallback.bind(this), 6);
	this.fibButton = addControlToAlgorithmBar("Button", "执行");
	this.fibButton.onclick = this.fibCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.fibButton);

}

Fibonacci.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
Fibonacci.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


Fibonacci.prototype.setup = function()
{
	this.nextIndex = 0;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}



Fibonacci.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}

Fibonacci.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

Fibonacci.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}

Fibonacci.prototype.fibCallback = function(event) {
	if (this.pushField.value != ""){
        var pushVal = this.pushField.value;
        this.pushField.value = ""
		this.implementAction(this.fib.bind(this), pushVal);
    }
}


Fibonacci.prototype.buildTree = function(n) {
	if (n < 1) return null;
	this.nextIndex = 0
	const root = {id: this.nextIndex++, id_low: this.nextIndex++,value: n, parentId: null, children: [] };
	const queue = [root];

	while (queue.length > 0) {
	  const currentNode = queue.shift();
	  const value = currentNode.value;

	  if (value > 2) {
		const leftChild = {id: this.nextIndex++, id_low: this.nextIndex++,value: value - 1, parentId: currentNode.id, children: [] };
		const rightChild = {id: this.nextIndex++ , id_low: this.nextIndex++,value: value - 2, parentId: currentNode.id, children: [] };
		currentNode.children.push(leftChild, rightChild);
		queue.push(leftChild, rightChild);
	  }
	}

	return root;
}

Fibonacci.prototype.calfib = function(n) {
    if(n==1 || n==2) return 1
	else return this.calfib(n - 1) + this.calfib(n - 2)
}

Fibonacci.prototype.traverseTreeBottomUp = function(node) {
	if (!node) return;

	for (const child of node.children) {
	    this.traverseTreeBottomUp(child);
		this.cmd("SetForegroundColor", child.id, BLACKGROUD)
		this.cmd("Step")
	}

	this.cmd("SetForegroundColor", node.id, REDGROUND)
	this.cmd("SetText",node.id,this.calfib(node.value))
	this.cmd("Step")
  }

Fibonacci.prototype.drawNode = function(node, x, y, levelHeight, level = 0) {
	const childOffset = 200 / (level + 1); // 子节点的水平间距
	this.cmd("CreateRectangle",node.id,"fib(" + node.value + ")",50,50,x,y)
	this.cmd("CreateLabel",node.id_low,"",x,y+25)
	if(node.parentId!=null){
	   this.cmd("Connect",node.parentId + 1,node.id)
	}
	this.cmd("Step")
	if (node.children.length > 0) {
	  const leftX = x - childOffset;
	  const rightX = x + childOffset;
	  const childY = y + levelHeight;

	  node.children.forEach((child, index) => {
		const childX = index === 0 ? leftX : rightX;
		this.drawNode(child, childX, childY, levelHeight, level + 1);
	  });
	}
}

Fibonacci.prototype.fib = function(n) {
	this.commands = new Array();
    this.commands = [];
	var tree = this.buildTree(n)
	const startX = 100 * n;
	const startY = 50;
	const levelHeight = 500 / n;
	this.drawNode(tree, startX, startY, levelHeight);
	this.traverseTreeBottomUp(tree)
    return this.commands;
}

Fibonacci.prototype.clearAll = function()
{
	this.commands = new Array();
	for (var i = 0; i < this.top; i++)
	{
		this.cmd("SetText", this.arrayID[i], "");
	}
	this.top = 0;
	this.cmd("SetText", this.topID, "0");
	return this.commands;

}



var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new Fibonacci(animManag, canvas.width, canvas.height);
}