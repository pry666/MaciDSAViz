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

var SIZE = 13;

function Twosearch(am, w, h)
{
	this.init(am, w, h);

}

Twosearch.prototype = new Algorithm();
Twosearch.prototype.constructor = Twosearch;
Twosearch.superclass = Algorithm.prototype;


Twosearch.prototype.init = function(am, w, h)
{
	Twosearch.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


Twosearch.prototype.addControls =  function()
{
	this.controls = [];
	this.pushField = addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.searchCallback.bind(this), 6);
	this.searchButton = addControlToAlgorithmBar("Button", "查找");
	this.searchButton.onclick = this.searchCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.searchButton);

}

Twosearch.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
Twosearch.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


Twosearch.prototype.setup = function()
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
	this.XData = new Array(SIZE);
	this.YData = new Array(SIZE);
	this.top = 0;
	this.leftoverLabelID = this.nextIndex++;
	this.commands = new Array();

	this.arrayData = [];
	this.cmd("CreateLabel", this.leftoverLabelID, "", PUSH_LABEL_X, PUSH_LABEL_Y);
	for (var i = 0; i < SIZE; i++)
	{
		this.arrayData[i] = i + 1;
		var xpos = (i  % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
		this.XData[i] = xpos
		this.YData[i] = ypos
		this.cmd("CreateRectangle", this.arrayID[i],this.arrayData[i], ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.arrayLabelID[i],i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", this.arrayLabelID[i], "#0000FF");

	}

	this.lowlabelID = this.nextIndex++
	this.cmd("CreateLabel",this.lowlabelID,"low = 0",  this.XData[0], this.YData[0] - 2 * ARRAY_ELEM_HEIGHT);
	this.cmd("Connect", this.lowlabelID, this.arrayID[0]);
	this.highlabelID = this.nextIndex++
	this.cmd("CreateLabel",this.highlabelID,"high = " + (SIZE - 1),  this.XData[SIZE - 1], this.YData[SIZE - 1] - 2 * ARRAY_ELEM_HEIGHT);
	this.cmd("Connect", this.highlabelID, this.arrayID[SIZE - 1]);
	this.highlight1ID = this.nextIndex++;
	this.highlight2ID = this.nextIndex++;
	this.resultLabelID = this.nextIndex++;
    this.cmd("CreateLabel", this.resultLabelID, "查找结果: ", 200, 50); // 结果标签的位置

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}



Twosearch.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}

Twosearch.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

Twosearch.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}

Twosearch.prototype.searchCallback = function(event) {
	if (this.pushField.value != ""){
        var pushVal = this.pushField.value;
        this.pushField.value = ""
		this.implementAction(this.searchArray.bind(this), pushVal);
    }
}

Twosearch.prototype.searchArray = function(x) {
	this.commands = new Array();
    this.commands = [];
    var low = 0
	var high = SIZE - 1
	var mid = Math.floor((low + high)/2)
	var mid_n = Math.floor((low + high)/2)
	this.midlabelID = this.nextIndex++
	this.cmd("CreateLabel",this.midlabelID,"mid = " + mid,  this.XData[mid], this.YData[mid] - 2 * ARRAY_ELEM_HEIGHT);
	this.cmd("Connect", this.midlabelID, this.arrayID[mid]);
	this.cmd("Step");
	while(x != this.arrayData[mid]){
		if(x < this.arrayData[mid]){
			if(high - low > 1){
			  this.cmd("SetText", this.highlabelID, "high = " + (mid - 1));
			  this.cmd("Disconnect", this.highlabelID, this.arrayID[high]);
			  this.cmd("Move",this.highlabelID,  this.XData[mid - 1], this.YData[mid - 1] - 2 * ARRAY_ELEM_HEIGHT);
			  this.cmd("Connect", this.highlabelID, this.arrayID[mid - 1]);
			  this.cmd("Step");
			  mid_n = Math.floor((low + mid - 1)/2)
			  high = mid - 1
			  if(high - low > 1){
				this.cmd("SetText", this.midlabelID, "mid = " + mid_n);
				this.cmd("Disconnect", this.midlabelID, this.arrayID[mid]);
				this.cmd("Move",this.midlabelID,  this.XData[mid_n], this.YData[mid_n] - 2 * ARRAY_ELEM_HEIGHT);
				this.cmd("Connect", this.midlabelID, this.arrayID[mid_n]);
				this.cmd("Step");
				high = mid - 1
				mid = mid_n
			  }else{
				this.cmd("SetText", this.highlabelID, "");
				this.cmd("Disconnect", this.highlabelID, this.arrayID[high]);
				this.cmd("SetText", this.lowlabelID, "low = high = " + (mid_n));
				this.cmd("Step");
				mid_n = low
				this.cmd("SetText", this.midlabelID, "mid = " + low);
				this.cmd("Disconnect", this.midlabelID, this.arrayID[mid]);
				this.cmd("Move",this.midlabelID,  this.XData[mid_n], this.YData[mid_n] + 2 * ARRAY_ELEM_HEIGHT);
				this.cmd("Connect", this.midlabelID, this.arrayLabelID[mid_n]);
				this.cmd("Step");
				mid = mid_n
			  }
			}else{
			  this.cmd("SetText", this.highlabelID, "");
			  this.cmd("Disconnect", this.highlabelID, this.arrayID[high]);
			  this.cmd("SetText", this.lowlabelID, "low = high = " + (mid - 1));
			  this.cmd("Step");
			  mid_n = low
			  this.cmd("SetText", this.midlabelID, "mid = " + low);
			  this.cmd("Disconnect", this.midlabelID, this.arrayID[mid]);
			  this.cmd("Move",this.midlabelID,  this.XData[mid_n], this.YData[mid_n] + 2 * ARRAY_ELEM_HEIGHT);
			  this.cmd("Connect", this.midlabelID, this.arrayLabelID[mid_n]);
			  this.cmd("Step");
			  mid = mid_n
			}
		}else{
			if(high - low > 1){
				this.cmd("SetText", this.lowlabelID, "low = " + (mid + 1));
				this.cmd("Disconnect", this.lowlabelID, this.arrayID[low]);
				this.cmd("Move",this.lowlabelID,  this.XData[mid + 1], this.YData[mid + 1] - 2 * ARRAY_ELEM_HEIGHT);
				this.cmd("Connect", this.lowlabelID, this.arrayID[mid + 1]);
				this.cmd("Step");
				mid_n = Math.floor((high + mid + 1)/2)
				low = mid + 1
				if(high - low > 1){
					this.cmd("SetText", this.midlabelID, "mid = " + mid_n);
					this.cmd("Disconnect", this.midlabelID, this.arrayID[mid]);
					this.cmd("Move",this.midlabelID,  this.XData[mid_n], this.YData[mid_n] - 2 * ARRAY_ELEM_HEIGHT);
					this.cmd("Connect", this.midlabelID, this.arrayID[mid_n]);
					this.cmd("Step");
					low = mid + 1
					mid = mid_n
				}else{
					this.cmd("SetText", this.lowlabelID, "");
					this.cmd("Disconnect", this.lowlabelID, this.arrayID[low]);
					this.cmd("SetText", this.highlabelID, "low = high = " + (mid_n));
					this.cmd("Step");
					mid_n = high
					this.cmd("SetText", this.midlabelID, "mid = " + high);
					this.cmd("Disconnect", this.midlabelID, this.arrayID[mid]);
					this.cmd("Move",this.midlabelID,  this.XData[mid_n], this.YData[mid_n] + 2 * ARRAY_ELEM_HEIGHT);
					this.cmd("Connect", this.midlabelID, this.arrayLabelID[mid_n]);
					this.cmd("Step");
					mid = mid_n
				}
			}else{
				this.cmd("SetText", this.lowlabelID, "");
				this.cmd("Disconnect", this.lowlabelID, this.arrayID[low]);
				this.cmd("SetText", this.highlabelID, "low = high = " + (mid + 1));
				this.cmd("Step");
				mid_n = high
				this.cmd("SetText", this.midlabelID, "mid = " + high);
				this.cmd("Disconnect", this.midlabelID, this.arrayID[mid]);
				this.cmd("Move",this.midlabelID,  this.XData[mid_n], this.YData[mid_n] + 2 * ARRAY_ELEM_HEIGHT);
				this.cmd("Connect", this.midlabelID, this.arrayLabelID[mid_n]);
				this.cmd("Step");
				mid = mid_n
			}
		}

	}
    return this.commands;
}

Twosearch.prototype.clearAll = function()
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
	currentAlg = new Twosearch(animManag, canvas.width, canvas.height);
}