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

function For_n(am, w, h)
{
	this.init(am, w, h);

}

For_n.prototype = new Algorithm();
For_n.prototype.constructor = For_n;
For_n.superclass = Algorithm.prototype;


For_n.prototype.init = function(am, w, h)
{
	For_n.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


For_n.prototype.addControls =  function()
{
	this.controls = [];
	this.pushButton = addControlToAlgorithmBar("Button", "执行");
	this.pushButton.onclick = this.checkCallback.bind(this);
	this.controls.push(this.pushButton);
}

For_n.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
For_n.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


For_n.prototype.setup = function() {
    this.nextIndex = 0;
    this.conditionLabelID = this.nextIndex++;
    this.conditionLabel_b_ID = this.nextIndex++;
    this.conditionLabel_1_ID = this.nextIndex++;
    this.conditionLabel_1b_ID = this.nextIndex++;
    this.conditionLabel_1t_ID = this.nextIndex++;
    this.conditionLabel_1r_ID = this.nextIndex++;
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
    this.conditionLabel_5r_ID = this.nextIndex++;
    this.conditionLabel_6_ID = this.nextIndex++;
    this.conditionLabel_6t_ID = this.nextIndex++;
    this.conditionLabel_6b_ID = this.nextIndex++;
    this.conditionLabel_7_ID = this.nextIndex++;
    this.conditionLabel_7b_ID = this.nextIndex++;
    this.conditionLabel_7t_ID = this.nextIndex++;
    this.conditionLabel_8_ID = this.nextIndex++;
    this.conditionLabel_8b_ID = this.nextIndex++;
    this.conditionLabel_8t_ID = this.nextIndex++;
    this.resulttext = this.nextIndex++;

    this.resultLabel_1_ID = this.nextIndex++;


    this.cmd("CreateRectangle", this.conditionLabelID, "s = abcdefdebchadbabdch", 150, 50, 100, 50);
    this.cmd("CreateLabel", this.conditionLabel_b_ID, "", 100, 70);
    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "i = 0", 100, 50, 100, 150);
    this.cmd("CreateLabel", this.conditionLabel_1t_ID, "", 100, 130);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 100, 175);
    this.cmd("CreateLabel", this.conditionLabel_1r_ID, "", 150, 150);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "i >= len", 100, 50, 100, 250);
    this.cmd("CreateLabel", this.conditionLabel_2t_ID, "", 100, 230);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 100, 270);
    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "i < len", 100, 50, 250, 250);
    this.cmd("CreateLabel", this.conditionLabel_3t_ID, "", 250, 225);
    this.cmd("CreateLabel", this.conditionLabel_3b_ID, "", 250, 270);
    this.cmd("CreateRectangle", this.conditionLabel_4_ID, "s[i] = a", 100, 50, 250, 350);
    this.cmd("CreateLabel", this.conditionLabel_4t_ID, "", 250, 330);
    this.cmd("CreateLabel", this.conditionLabel_4b_ID, "", 300, 350);
    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "i = i + 1", 100, 50, 250, 150);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 200, 150);
    this.cmd("CreateLabel", this.conditionLabel_5r_ID, "", 300, 150);
    this.cmd("CreateRectangle", this.conditionLabel_6_ID, "print(s[i])", 100, 50, 550, 250);
    this.cmd("CreateLabel", this.conditionLabel_6t_ID, "", 550, 225);
    this.cmd("CreateLabel", this.conditionLabel_6b_ID, "", 550, 275);
    this.cmd("CreateRectangle", this.conditionLabel_7_ID, "s[i] != h", 100, 50, 400, 350);
    this.cmd("CreateLabel", this.conditionLabel_7t_ID, "", 350, 350);
    this.cmd("CreateLabel", this.conditionLabel_7b_ID, "", 450, 350);
    this.cmd("CreateRectangle", this.conditionLabel_8_ID, "s[i] == h", 100, 50, 400, 250);
    this.cmd("CreateLabel", this.conditionLabel_8t_ID, "", 400, 225);
    this.cmd("CreateLabel", this.conditionLabel_8b_ID, "", 400, 275);

    this.cmd("CreateLabel", this.resulttext, "输出：", 300, 450);


    this.cmd("CreateRectangle", this.resultLabel_1_ID, "结束", 100, 50, 100, 350);

    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_1t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_2t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_3t_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.resultLabel_1_ID);
    this.cmd("Connect", this.conditionLabel_3b_ID, this.conditionLabel_4t_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_7t_ID);
    this.cmd("Connect", this.conditionLabel_4b_ID, this.conditionLabel_8b_ID);
    this.cmd("Connect", this.conditionLabel_7b_ID, this.conditionLabel_6b_ID);
    this.cmd("Connect", this.conditionLabel_6t_ID, this.conditionLabel_5r_ID);
    this.cmd("Connect", this.conditionLabel_8t_ID, this.conditionLabel_5r_ID);
    this.cmd("Connect", this.conditionLabel_5b_ID, this.conditionLabel_1r_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

For_n.prototype.checkCallback = function(event)
{
    this.implementAction(this.checkCondition.bind(this));

}

For_n.prototype.checkCondition = function() {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_1_ID, "i = 0");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_4_ID, "s[i] = a");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#000000");
    this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#000000");
    this.cmd("SetText", this.resulttext, "输出：");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabelID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
    this.cmd("Step");
    s = "abcdefdebchadbabdch"
    len = s.length
    result = ""
    for(let i = 0; i < len; i++){
        if(s[i] === 'h'){
            this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
            this.cmd("SetText", this.conditionLabel_4_ID, "s[i] = " + s[i]);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#FF0000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
            this.cmd("SetText", this.conditionLabel_1_ID, "i = " + (i + 1));
            this.cmd("Step");
        } else {
            this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#FF0000");
            this.cmd("SetText", this.conditionLabel_4_ID, "s[i] = " + s[i]);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_4_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#FF0000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_7_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#FF0000");
            result += s[i]; // 添加到结果
            this.cmd("SetText", this.resulttext, "输出: " + result); // 更新结果标签
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
            this.cmd("SetText", this.conditionLabel_1_ID, "i = " + (i + 1));
            this.cmd("Step");
        }
    }
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#FF0000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.resultLabel_1_ID, "#FF0000");
    this.cmd("Step");
    return this.commands;
}


For_n.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}


For_n.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

For_n.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}


For_n.prototype.clearAll = function()
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
	currentAlg = new For_n(animManag, canvas.width, canvas.height);
}