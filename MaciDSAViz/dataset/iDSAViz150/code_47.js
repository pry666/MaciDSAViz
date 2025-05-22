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

function Branch_s(am, w, h)
{
	this.init(am, w, h);

}

Branch_s.prototype = new Algorithm();
Branch_s.prototype.constructor = Branch_s;
Branch_s.superclass = Algorithm.prototype;


Branch_s.prototype.init = function(am, w, h)
{
	Branch_s.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


Branch_s.prototype.addControls =  function()
{
	this.controls = [];
    this.pushField = addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.checkCallback.bind(this), 6);
	this.pushButton = addControlToAlgorithmBar("Button", "成绩");
	this.pushButton.onclick = this.checkCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.pushButton);
}

Branch_s.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
Branch_s.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


Branch_s.prototype.setup = function() {
    this.nextIndex = 0;
    this.conditionLabelID = this.nextIndex++;
    this.conditionLabel_b_ID = this.nextIndex++;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1b_ID = this.nextIndex++;
    this.conditionLabel_1t_ID = this.nextIndex++;
    this.conditionLabel_2_ID = this.nextIndex++;
    this.conditionLabel_2b_ID = this.nextIndex++;
    this.conditionLabel_2t_ID = this.nextIndex++;
    this.conditionLabel_3_ID = this.nextIndex++;
    this.conditionLabel_3b_ID = this.nextIndex++;
    this.conditionLabel_3t_ID = this.nextIndex++;
    this.conditionLabel_4_ID = this.nextIndex++;
    this.conditionLabel_4b_ID = this.nextIndex++;
    this.conditionLabel_4t_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;
    this.conditionLabel_5b_ID = this.nextIndex++;
    this.conditionLabel_5t_ID = this.nextIndex++;
    this.conditionLabel_6_ID = this.nextIndex++;
    this.conditionLabel_6b_ID = this.nextIndex++;
    this.conditionLabel_6t_ID = this.nextIndex++;
    this.resultLabel_1_ID = this.nextIndex++;
    this.resultLabel_2_ID = this.nextIndex++;
    this.resultLabel_3_ID = this.nextIndex++;
    this.resultLabel_4_ID = this.nextIndex++;
    this.resultLabel_5_ID = this.nextIndex++;

    this.cmd("CreateRectangle", this.conditionLabelID, "x", 100, 50, 350, 50);
    this.cmd("CreateLabel", this.conditionLabel_b_ID, "", 350, 75);
    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "x / 10 = 10", 100, 50, 50, 150);
    this.cmd("CreateLabel", this.conditionLabel_1t_ID, "", 50, 125);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 50, 170);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "x / 10 = 9", 100, 50, 175, 150);
    this.cmd("CreateLabel", this.conditionLabel_2t_ID, "", 175, 125);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 175, 170);
    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "x / 10 = 8", 100, 50, 300, 150);
    this.cmd("CreateLabel", this.conditionLabel_3t_ID, "", 300, 125);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 300, 170);
    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "x / 10 = 7", 100, 50, 425, 150);
    this.cmd("CreateLabel", this.conditionLabel_4t_ID, "", 425, 125);
    this.cmd("CreateLabel", this.conditionLabel_4b_ID, "", 425, 170);
    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "x / 10 = 6", 100, 50, 550, 150);
    this.cmd("CreateLabel", this.conditionLabel_5t_ID, "", 550, 125);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 550, 170);
    this.cmd("CreateRectangle", this.conditionLabel_6_ID, "x / 10 为其他", 100, 50, 675, 150);
    this.cmd("CreateLabel", this.conditionLabel_6t_ID, "", 675, 125);
    this.cmd("CreateLabel", this.conditionLabel_6b_ID, "", 675, 170);

    this.cmd("CreateRectangle", this.resultLabel_1_ID, "成绩为A", 100, 50, 112.5, 250);
    this.cmd("CreateRectangle", this.resultLabel_2_ID, "成绩为B", 100, 50, 300, 250);
    this.cmd("CreateRectangle", this.resultLabel_3_ID, "成绩为C", 100, 50, 425, 250);
    this.cmd("CreateRectangle", this.resultLabel_4_ID, "成绩为D", 100, 50, 550, 250);
    this.cmd("CreateRectangle", this.resultLabel_5_ID, "成绩为F", 100, 50, 675, 250);


    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_1t_ID);
    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_2t_ID);
    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_3t_ID);
    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_4t_ID);
    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_5t_ID);
    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_6t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.resultLabel_1_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.resultLabel_1_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.resultLabel_2_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.resultLabel_3_ID);
    this.cmd("Connect", this.conditionLabel_5b_ID, this.resultLabel_4_ID);
    this.cmd("Connect", this.conditionLabel_6b_ID, this.resultLabel_5_ID);


    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

Branch_s.prototype.checkCallback = function(event)
{
    if (this.pushField.value != ""){
        var pushVal = this.pushField.value;
        this.pushField.value = ""
        this.implementAction(this.checkCondition.bind(this), pushVal);
    }
}

Branch_s.prototype.checkCondition = function(x) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
    this.cmd("SetText", this.conditionLabelID, "x");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_1_ID, "x / 10 = 10");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_2_ID, "x / 10 = 9");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_3_ID, "x / 10 = 8");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_4_ID, "x / 10 = 7");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_5_ID, "x / 10 = 6");
    this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_6_ID, "x / 10 为其他");
    this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_4_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_5_ID, "#000000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabelID, "#FF0000");
    this.cmd("SetText", this.conditionLabelID, x);
    this.cmd("Step");

    if (Math.floor(x/10) == 10) {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_1_ID, x + " / 10 = 10");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#FF0000");
        this.cmd("Step");
    } else if (Math.floor(x/10) == 9) {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_2_ID, x + " / 10 = 9");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#FF0000");
        this.cmd("Step");
    } else if (Math.floor(x/10) == 8) {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_3_ID, x + " / 10 = 8");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_2_ID, "#FF0000");
        this.cmd("Step");
    } else if (Math.floor(x/10) == 7) {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_4_ID, x + " / 10 = 7");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_3_ID, "#FF0000");
        this.cmd("Step");
    } else if (Math.floor(x/10) == 6) {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_5_ID, x + " / 10 = 6");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_4_ID, "#FF0000");
        this.cmd("Step");
    } else {
        this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#FF0000"); // 移动到 True 分支
        this.cmd("SetText", this.conditionLabel_6_ID, x + " / 10 为其他");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.resultLabel_5_ID, "#FF0000");
        this.cmd("Step");
    }


    this.cmd("Step");
    return this.commands;
}


Branch_s.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}


Branch_s.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

Branch_s.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}


Branch_s.prototype.clearAll = function()
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
	currentAlg = new Branch_s(animManag, canvas.width, canvas.height);
}