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

function Branch(am, w, h)
{
	this.init(am, w, h);

}

Branch.prototype = new Algorithm();
Branch.prototype.constructor = Branch;
Branch.superclass = Algorithm.prototype;


Branch.prototype.init = function(am, w, h)
{
	Branch.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


Branch.prototype.addControls =  function()
{
	this.controls = [];
    this.pushField = addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.checkCallback.bind(this), 6);
	this.pushButton = addControlToAlgorithmBar("Button", "比较");
	this.pushButton.onclick = this.checkCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.pushButton);
}

Branch.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
Branch.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


Branch.prototype.setup = function() {
    this.nextIndex = 0;
    this.conditionLabelID = this.nextIndex++;
    this.conditionLabel_b_ID = this.nextIndex++;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1b_ID = this.nextIndex++;
    this.conditionLabel_1t_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2b_ID = this.nextIndex++;
    this.conditionLabel_2t_ID = this.nextIndex++;
    this.resultLabel_1_ID = this.nextIndex++;
    this.resultLabel_2_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabelID, "x", 100, 50, 200, 50);
    this.cmd("CreateLabel", this.conditionLabel_b_ID, "", 200, 75);
    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "x > 5", 100, 50, 100, 150);
    this.cmd("CreateLabel", this.conditionLabel_1t_ID, "", 100, 125);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 100, 170);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "x <= 5", 100, 50, 300, 150);
    this.cmd("CreateLabel", this.conditionLabel_2t_ID, "", 300, 125);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 300, 170);

    this.cmd("CreateRectangle", this.resultLabel_1_ID, "True", 100, 50, 100, 250);
    this.cmd("CreateRectangle", this.resultLabel_2_ID, "False", 100, 50, 300, 250);

    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_1t_ID);
    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_2t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.resultLabel_1_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.resultLabel_2_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

Branch.prototype.checkCallback = function(event)
{
    if (this.pushField.value != ""){
        var pushVal = this.pushField.value;
        this.pushField.value = ""
        this.implementAction(this.checkCondition.bind(this), pushVal);
    }
}

Branch.prototype.checkCondition = function(x) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
    this.cmd("SetText", this.conditionLabelID, "x");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_1_ID, "x > 5");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_2_ID, "x <= 5");
    this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_2_ID, "#000000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabelID, "#FF0000");
    this.cmd("SetText", this.conditionLabelID, x);
    this.cmd("Step");

    if (x > 5) {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_1_ID, x + " > 5");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000"); // 移动到 True 分支
        this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("Step");
    }
    else {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_2_ID, x + " <= 5");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000"); // 移动到 True 分支
        this.cmd("SetForegroundColor", this.resultLabel_2_ID, "#FF0000");
        this.cmd("Step");
    }

    this.cmd("Step");
    return this.commands;
}


Branch.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}


Branch.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

Branch.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}


Branch.prototype.clearAll = function()
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
	currentAlg = new Branch(animManag, canvas.width, canvas.height);
}