function For_10(am, w, h)
{
	this.init(am, w, h);

}

For_10.prototype = new Algorithm();
For_10.prototype.constructor = For_10;
For_10.superclass = Algorithm.prototype;


For_10.prototype.init = function(am, w, h)
{
	For_10.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


For_10.prototype.addControls =  function()
{
	this.controls = [];
    this.pushField = addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.checkCallback.bind(this), 6);
	this.pushButton = addControlToAlgorithmBar("Button", "执行");
	this.pushButton.onclick = this.checkCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.pushButton);
}

For_10.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
For_10.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


For_10.prototype.setup = function() {
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
    this.conditionLabel_3r_ID = this.nextIndex++;
    this.conditionLabel_3t_ID = this.nextIndex++;
    this.conditionLabel_5_ID = this.nextIndex++;
    this.conditionLabel_5b_ID = this.nextIndex++;
    this.conditionLabel_5t_ID = this.nextIndex++;
    this.conditionLabel_5r_ID = this.nextIndex++;
    this.conditionLabel_6_ID = this.nextIndex++;
    this.conditionLabel_6l_ID = this.nextIndex++;
    this.conditionLabel_6b_ID = this.nextIndex++;
    this.conditionLabel_8_ID = this.nextIndex++;
    this.conditionLabel_8l_ID = this.nextIndex++;
    this.conditionLabel_8t_ID = this.nextIndex++;
    this.resulttext = this.nextIndex++;

    this.resultLabel_1_ID = this.nextIndex++;


    this.cmd("CreateRectangle", this.conditionLabelID, "x", 50, 50, 100, 50);
    this.cmd("CreateLabel", this.conditionLabel_b_ID, "", 100, 70);
    this.cmd("CreateRectangle", this.conditionLabel_1_ID, "i = 0", 100, 50, 100, 150);
    this.cmd("CreateLabel", this.conditionLabel_1t_ID, "", 100, 130);
    this.cmd("CreateLabel", this.conditionLabel_1b_ID, "", 100, 175);
    this.cmd("CreateLabel", this.conditionLabel_1r_ID, "", 150, 150);
    this.cmd("CreateRectangle", this.conditionLabel_2_ID, "i >= 10", 100, 50, 100, 250);
    this.cmd("CreateLabel", this.conditionLabel_2t_ID, "", 100, 230);
    this.cmd("CreateLabel", this.conditionLabel_2b_ID, "", 100, 270);
    this.cmd("CreateRectangle", this.conditionLabel_3_ID, "i < 10", 100, 50, 250, 250);
    this.cmd("CreateLabel", this.conditionLabel_3t_ID, "", 250, 225);
    this.cmd("CreateLabel", this.conditionLabel_3r_ID, "", 300, 250);
    this.cmd("CreateRectangle", this.conditionLabel_5_ID, "i = i + 1", 100, 50, 250, 150);
    this.cmd("CreateLabel", this.conditionLabel_5b_ID, "", 200, 150);
    this.cmd("CreateLabel", this.conditionLabel_5r_ID, "", 300, 150);
    this.cmd("CreateRectangle", this.conditionLabel_6_ID, "print(x)", 100, 50, 450, 150);
    this.cmd("CreateLabel", this.conditionLabel_6b_ID, "", 450, 175);
    this.cmd("CreateLabel", this.conditionLabel_6l_ID, "", 400, 150);
    this.cmd("CreateRectangle", this.conditionLabel_8_ID, "x = 3.9 * x * ( 1- x )", 150, 50, 450, 250);
    this.cmd("CreateLabel", this.conditionLabel_8l_ID, "", 375, 250);
    this.cmd("CreateLabel", this.conditionLabel_8t_ID, "", 450, 225);
    this.cmd("CreateLabel", this.resulttext, "输出：", 300, 450);


    this.cmd("CreateRectangle", this.resultLabel_1_ID, "结束", 100, 50, 100, 350);

    this.cmd("Connect", this.conditionLabel_b_ID, this.conditionLabel_1t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_2t_ID);
    this.cmd("Connect", this.conditionLabel_1b_ID, this.conditionLabel_3t_ID);
    this.cmd("Connect", this.conditionLabel_2b_ID, this.resultLabel_1_ID);
    this.cmd("Connect", this.conditionLabel_6l_ID, this.conditionLabel_5r_ID);
    this.cmd("Connect", this.conditionLabel_3r_ID, this.conditionLabel_8l_ID);
    this.cmd("Connect", this.conditionLabel_8t_ID, this.conditionLabel_6b_ID);
    this.cmd("Connect", this.conditionLabel_5b_ID, this.conditionLabel_1r_ID);

    this.cmd("Step");
    this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

For_10.prototype.checkCallback = function(event)
{
    if (this.pushField.value != ""){
        var pushVal = this.pushField.value;
        this.pushField.value = ""
        this.implementAction(this.checkCondition.bind(this), pushVal);
    }
}

For_10.prototype.checkCondition = function(x) {
    this.commands = [];
    this.cmd("SetForegroundColor", this.conditionLabelID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
    this.cmd("SetText", this.conditionLabel_1_ID, "i = 0");
    this.cmd("SetForegroundColor", this.conditionLabel_2_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
    this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
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
    result = ""
    for(let i = 0; i < 10; i++){
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_3_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#FF0000");
        this.cmd("SetText", this.conditionLabel_8_ID, "x = 3.9 * " + x + " * ( 1 - " + x +" )");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_8_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_6_ID, "#000000");
        result += " "+ (3.9 * x * (1-x)).toFixed(2);
        x =  (3.9 * x * (1-x)).toFixed(2)// 添加到结果
        this.cmd("SetText", this.resulttext, "输出: " + result); // 更新结果标签
        this.cmd("Step");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#FF0000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_5_ID, "#000000");
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.conditionLabel_1_ID, "#FF0000");
        this.cmd("SetText", this.conditionLabel_1_ID, "i = " + (i + 1));
        this.cmd("Step");
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


For_10.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}


For_10.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

For_10.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}


For_10.prototype.clearAll = function()
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
	currentAlg = new For_10(animManag, canvas.width, canvas.height);
}