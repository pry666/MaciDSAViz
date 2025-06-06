﻿var ARRAY_START_X = 100;
var ARRAY_START_Y = 200;
var ARRAY_ELEM_WIDTH = 50;
var ARRAY_ELEM_HEIGHT = 50;

var ARRRAY_ELEMS_PER_LINE = 15;
var ARRAY_LINE_SPACING = 130;

var HEAD_POS_X = 180;
var HEAD_POS_Y = 100;
var HEAD_LABEL_X = 130;
var HEAD_LABEL_Y =  100;

var TAIL_POS_X = 280;
var TAIL_POS_Y = 100;
var TAIL_LABEL_X = 230;
var TAIL_LABEL_Y =  100;

var QUEUE_LABEL_X = 50;
var QUEUE_LABEL_Y = 30;
var QUEUE_ELEMENT_X = 120;
var QUEUE_ELEMENT_Y = 30;

var INDEX_COLOR = "#0000FF"

var SIZE = 15;

function QueueArray(am, w, h)
{
	this.init(am, w, h);

}

QueueArray.prototype = new Algorithm();
QueueArray.prototype.constructor = QueueArray;
QueueArray.superclass = Algorithm.prototype;


QueueArray.prototype.init = function(am, w, h)
{
	QueueArray.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


QueueArray.prototype.addControls =  function()
{
	this.controls = [];
	this.enqueueField = addControlToAlgorithmBar("Text", "");
	this.enqueueField.onkeydown = this.returnSubmit(this.enqueueField,  this.enqueueCallback.bind(this), 6);
	this.enqueueButton = addControlToAlgorithmBar("Button", "Enqueue");
	this.enqueueButton.onclick = this.enqueueCallback.bind(this);
	this.controls.push(this.enqueueField);
	this.controls.push(this.enqueueButton);

	this.clearButton = addControlToAlgorithmBar("Button", "Clear Queue");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);

}

QueueArray.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
QueueArray.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


QueueArray.prototype.setup = function()
{

	this.nextIndex = 0;

	this.arrayID = new Array(SIZE);
	this.arrayLabelID = new Array(SIZE);
	for (var i = 0; i < SIZE; i++)
	{

		this.arrayID[i]= this.nextIndex++;
		this.arrayLabelID[i]= this.nextIndex++;
	}
	this.headID = this.nextIndex++;
	headLabelID = this.nextIndex++;
	this.tailID = this.nextIndex++;
	tailLabelID = this.nextIndex++;

	this.arrayData = new Array(SIZE);
	this.head = 0;
	this.tail = 0;
	this.leftoverLabelID = this.nextIndex++;


	for (var i = 0; i < SIZE; i++)
	{
		var xpos = (i  % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		var ypos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
		this.cmd("CreateRectangle", this.arrayID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.arrayLabelID[i],  i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", this.arrayLabelID[i], INDEX_COLOR);

	}
	this.cmd("CreateLabel", headLabelID, "Head", HEAD_LABEL_X, HEAD_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, 0, ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, HEAD_POS_X, HEAD_POS_Y);

	this.cmd("CreateLabel", tailLabelID, "Tail", TAIL_LABEL_X, TAIL_LABEL_Y);
	this.cmd("CreateRectangle", this.tailID, 0, ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, TAIL_POS_X, TAIL_POS_Y);



	this.cmd("CreateLabel", this.leftoverLabelID, "", QUEUE_LABEL_X, QUEUE_LABEL_Y);


	this.initialIndex = this.nextIndex;

	this.highlight1ID = this.nextIndex++;
	this.highlight2ID = this.nextIndex++;

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();


}


QueueArray.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}


QueueArray.prototype.enqueueCallback = function(event)
{
	if ((this.tail + 1) % SIZE  != this.head && this.enqueueField.value != "")
	{
		var pushVal = this.enqueueField.value;
		this.enqueueField.value = ""
		this.implementAction(this.enqueue.bind(this), pushVal);
	}
}

QueueArray.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearAll.bind(this), "");
}

QueueArray.prototype.enqueue = function(elemToEnqueue)
{
	this.commands = new Array();

	var labEnqueueID = this.nextIndex++;
	var labEnqueueValID = this.nextIndex++;
	this.arrayData[this.tail] = elemToEnqueue;
	this.cmd("SetText", this.leftoverLabelID, "");

	this.cmd("CreateLabel", labEnqueueID, "Enqueuing Value: ", QUEUE_LABEL_X, QUEUE_LABEL_Y);
	this.cmd("CreateLabel", labEnqueueValID,elemToEnqueue, QUEUE_ELEMENT_X, QUEUE_ELEMENT_Y);

	this.cmd("Step");
	this.cmd("CreateHighlightCircle", this.highlight1ID, INDEX_COLOR,  TAIL_POS_X, TAIL_POS_Y);
	this.cmd("Step");

	var xpos = (this.tail  % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
	var ypos = Math.floor(this.tail / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;

	this.cmd("Move", this.highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
	this.cmd("Step");

	this.cmd("Move", labEnqueueValID, xpos, ypos);
	this.cmd("Step");

	this.cmd("Settext", this.arrayID[this.tail], elemToEnqueue);
	this.cmd("Delete", labEnqueueValID);

	this.cmd("Delete", this.highlight1ID);

	this.cmd("SetHighlight", this.tailID, 1);
	this.cmd("Step");
	this.tail = (this.tail + 1) % SIZE;
	this.cmd("SetText", this.tailID, this.tail)
	this.cmd("Step");
	this.cmd("SetHighlight", this.tailID, 0);
	this.cmd("Delete", labEnqueueID);

	return this.commands;
}

QueueArray.prototype.clearAll = function()
{
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "");

	for (var i = 0; i < SIZE; i++)
	{
		this.cmd("SetText", this.arrayID[i], "");
	}
	this.head = 0;
	this.tail = 0;
	this.cmd("SetText", this.headID, "0");
	this.cmd("SetText", this.tailID, "0");
	return this.commands;

}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new QueueArray(animManag, canvas.width, canvas.height);
}