var ARRAY_START_X = 100;
var ARRAY_START_Y = 200;
var ARRAY_ELEM_WIDTH = 50;
var ARRAY_ELEM_HEIGHT = 50;

var ARRRAY_ELEMS_PER_LINE = 15;
var ARRAY_LINE_SPACING = 130;

var TOP_POS_X = 180;
var TOP_POS_Y = 100;
var TOP_LABEL_X = 130;
var TOP_LABEL_Y =  100;

var PUSH_LABEL_X = 50;
var PUSH_LABEL_Y = 30;
var PUSH_ELEMENT_X = 120;
var PUSH_ELEMENT_Y = 30;

var SIZE = 10;

function Array_v(am, w, h)
{
	this.init(am, w, h);

}

Array_v.prototype = new Algorithm();
Array_v.prototype.constructor = Array_v;
Array_v.superclass = Algorithm.prototype;


Array_v.prototype.init = function(am, w, h)
{
	Array_v.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


Array_v.prototype.addControls =  function()
{
	this.controls = [];

	this.traverseButton = addControlToAlgorithmBar("Button", "遍历");
	this.traverseButton.onclick = this.traverseCallback.bind(this);
	this.controls.push(this.traverseButton);


}

Array_v.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
Array_v.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


Array_v.prototype.setup = function()
{
	this.nextIndex = 0;

	this.arrayID = new Array(SIZE);
	this.arrayLabelID = new Array(SIZE);
	for (var i = 0; i < SIZE; i++)
	{
		this.arrayID[i]= this.nextIndex++;
		this.arrayLabelID[i]= this.nextIndex++;
	}
	this.topID = this.nextIndex++;
	this.topLabelID = this.nextIndex++;

	this.arrayData = new Array(SIZE);
	this.top = 0;
	this.leftoverLabelID = this.nextIndex++;
	this.commands = new Array();

	this.arrayData = [];
	this.cmd("CreateLabel", this.leftoverLabelID, "", PUSH_LABEL_X, PUSH_LABEL_Y);
	for (var i = 0; i < SIZE; i++)
	{
		this.arrayData[i] = (i - SIZE/2 + 4) * (i - SIZE/2 - 6) + 3;
		var xpos = (i  % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
		this.cmd("CreateRectangle", this.arrayID[i],this.arrayData[i], ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.arrayLabelID[i],i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", this.arrayLabelID[i], "#0000FF");

	}
	this.highlight1ID = this.nextIndex++;
	this.highlight2ID = this.nextIndex++;
	this.resultLabelID = this.nextIndex++;
    this.cmd("CreateLabel", this.resultLabelID, "遍历结果: ", 200, 50); // 结果标签的位置

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}



Array_v.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}

Array_v.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

Array_v.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}

Array_v.prototype.traverseCallback = function(event) {
    this.implementAction(this.traverseArray.bind(this), "");
}

Array_v.prototype.traverseArray = function() {
    this.commands = [];
    var highlightCircleID = this.nextIndex++;

    this.cmd("CreateHighlightCircle", highlightCircleID, "#FF0000", ARRAY_START_X, ARRAY_START_Y);
    var result = ""; // 存储遍历结果
    for (var i = 0; i < SIZE; i++) {
        var xpos = (i % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
        var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

        this.cmd("Move", highlightCircleID, xpos, ypos);
        this.cmd("Step");  // 暂停一下以便用户看到动画效果

        this.cmd("SetHighlight", this.arrayID[i], 1);
        this.cmd("Step");  // 再次暂停
		result += this.arrayData[i] + " "; // 添加到结果
		this.cmd("SetText", this.resultLabelID, "遍历结果: " + result); // 更新结果标签
        this.cmd("SetHighlight", this.arrayID[i], 0);
    }

    this.cmd("Delete", highlightCircleID);
    return this.commands;
}


Array_v.prototype.clearAll = function()
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
	currentAlg = new Array_v(animManag, canvas.width, canvas.height);
}