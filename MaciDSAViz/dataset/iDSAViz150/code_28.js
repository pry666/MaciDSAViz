function ComparisonSort(am, w, h)
{
	this.init(am, w, h);

}


var ARRAY_SIZE_SMALL  = 50;
var ARRAY_WIDTH_SMALL = 17;
var ARRAY_BAR_WIDTH_SMALL = 10;
var ARRAY_INITIAL_X_SMALL = 15;

var ARRAY_Y_POS = 250;
var ARRAY_LABEL_Y_POS = 260;

var LOWER_ARRAY_Y_POS = 500;
var LOWER_ARRAY_LABEL_Y_POS = 510;

var SCALE_FACTOR = 2.0;

var ARRAY_SIZE_LARGE = 200;
var ARRAY_WIDTH_LARGE = 4;
var ARRAY_BAR_WIDTH_LARGE = 2;
var ARRAY_INITIAL_X_LARGE = 15;

var BAR_FOREGROUND_COLOR = "#0000FF";
var BAR_BACKGROUND_COLOR ="#AAAAFF";
var INDEX_COLOR = "#0000FF";
var HIGHLIGHT_BAR_COLOR = "#FF0000";
var HIGHLIGHT_BAR_BACKGROUND_COLOR = "#FFAAAA";

var QUICKSORT_LINE_COLOR = "#FF0000";



ComparisonSort.prototype = new Algorithm();
ComparisonSort.prototype.constructor = ComparisonSort;
ComparisonSort.superclass = Algorithm.prototype;

ComparisonSort.prototype.init = function(am, w, h)
{
	var sc = ComparisonSort.superclass;
	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;

	this.setArraySize(true);
	this.arrayData = new Array(ARRAY_SIZE_LARGE);
	this.arraySwap = new Array(ARRAY_SIZE_LARGE);
	this.labelsSwap = new Array(ARRAY_SIZE_LARGE);
	this.objectsSwap = new Array(ARRAY_SIZE_LARGE);

	this.createVisualObjects();
}



ComparisonSort.prototype.addControls =  function()
{
	this.resetButton = addControlToAlgorithmBar("Button", "Randomize Array");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.shellSortButton = addControlToAlgorithmBar("Button", "Shell Sort");
	this.shellSortButton.onclick = this.shellSortCallback.bind(this);

	this.sizeButton = addControlToAlgorithmBar("Button", "Change Size");
	this.sizeButton.onclick = this.changeSizeCallback.bind(this);
}


ComparisonSort.prototype.setArraySize = function (small)
{
	if (small)
	{
		this.array_size = ARRAY_SIZE_SMALL;
		this.array_width = ARRAY_WIDTH_SMALL;
		this.array_bar_width = ARRAY_BAR_WIDTH_SMALL;
		this.array_initial_x = ARRAY_INITIAL_X_SMALL;
		this.array_y_pos = ARRAY_Y_POS;
		this.array_label_y_pos = ARRAY_LABEL_Y_POS;
		this.showLabels = true;
	}
	else
	{
		this.array_size = ARRAY_SIZE_LARGE;
		this.array_width = ARRAY_WIDTH_LARGE;
		this.array_bar_width = ARRAY_BAR_WIDTH_LARGE;
		this.array_initial_x = ARRAY_INITIAL_X_LARGE;
		this.array_y_pos = ARRAY_Y_POS;
		this.array_label_y_pos = ARRAY_LABEL_Y_POS;
		this.showLabels = false;
	}

}


ComparisonSort.prototype.resetAll = function(small)
{
	this.animationManager.resetAll();
	this.setArraySize(!small);
	this.nextIndex = 0;
	this.createVisualObjects();
}


ComparisonSort.prototype.randomizeArray = function()
{
	this.commands = new Array();
	for (var i = 0; i < this.array_size; i++)
	{
		this.arrayData[i] = Math.floor(1 + Math.random()*99);
		this.oldData[i] = this.arrayData[i];
		if (this.showLabels)
		{
			this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
		}
		else
		{
			this.cmd("SetText", this.barLabels[i], "");
		}
		this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}


ComparisonSort.prototype.swap = function(index1, index2)
{
	var tmp = this.arrayData[index1];
	this.arrayData[index1] = this.arrayData[index2];
	this.arrayData[index2] = tmp;

	tmp = this.barObjects[index1];
	this.barObjects[index1] = this.barObjects[index2];
	this.barObjects[index2] = tmp;

	tmp = this.barLabels[index1];
	this.barLabels[index1] = this.barLabels[index2];
	this.barLabels[index2] = tmp;


	this.cmd("Move", this.barObjects[index1], this.barPositionsX[index1], this.array_y_pos);
	this.cmd("Move", this.barObjects[index2], this.barPositionsX[index2], this.array_y_pos);
	this.cmd("Move", this.barLabels[index1], this.barPositionsX[index1], this.array_label_y_pos);
	this.cmd("Move", this.barLabels[index2], this.barPositionsX[index2], this.array_label_y_pos);
	this.cmd("Step");
}


ComparisonSort.prototype.createVisualObjects = function()
{
	this.barObjects = new Array(this.array_size);
	this.oldBarObjects= new Array(this.array_size);
	this.oldbarLabels= new Array(this.array_size);

	this.barLabels = new Array(this.array_size);
	this.barPositionsX = new Array(this.array_size);
	this.oldData = new Array(this.array_size);
	this.obscureObject  = new Array(this.array_size);


	var xPos = this.array_initial_x;
	var yPos = this.array_y_pos;
	var yLabelPos = this.array_label_y_pos;

	this.commands = new Array();
	for (var i = 0; i < this.array_size; i++)
	{
		xPos = xPos + this.array_width;
		this.barPositionsX[i] = xPos;
		this.cmd("CreateRectangle", this.nextIndex, "", this.array_bar_width, 200, xPos, yPos,"center","bottom");
		this.cmd("SetForegroundColor", this.nextIndex, BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.nextIndex, BAR_BACKGROUND_COLOR);
		this.barObjects[i] = this.nextIndex;
		this.oldBarObjects[i] = this.barObjects[i];
		this.nextIndex += 1;
		if (this.showLabels)
		{
			this.cmd("CreateLabel", this.nextIndex, "99", xPos, yLabelPos);
		}
		else
		{
			this.cmd("CreateLabel", this.nextIndex, "", xPos, yLabelPos);
		}
		this.cmd("SetForegroundColor", this.nextIndex, INDEX_COLOR);

		this.barLabels[i] = this.nextIndex;
		this.oldbarLabels[i] = this.barLabels[i];
		++this.nextIndex;
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.randomizeArray();
	for (i = 0; i < this.array_size; i++)
	{
		this.obscureObject[i] = false;
	}
	this.lastCreatedIndex = this.nextIndex;
}

ComparisonSort.prototype.highlightRange  = function(lowIndex, highIndex)
{
	for (var i = 0; i < lowIndex; i++)
	{
		if (!this.obscureObject[i])
		{
			this.obscureObject[i] = true;
			this.cmd("SetAlpha", this.barObjects[i], 0.08);
			this.cmd("SetAlpha", this.barLabels[i], 0.08);
		}
	}
	for (i = lowIndex; i <= highIndex; i++)
	{
		if (this.obscureObject[i])
		{
			this.obscureObject[i] = false;
			this.cmd("SetAlpha", this.barObjects[i], 1.0);
			this.cmd("SetAlpha", this.barLabels[i], 1.0);
		}
	}
	for (i = highIndex+1; i < this.array_size; i++)
	{
		if (!this.obscureObject[i])
		{
			this.obscureObject[i] = true;
			this.cmd("SetAlpha", this.barObjects[i], 0.08);
			this.cmd("SetAlpha", this.barLabels[i], 0.08);
		}
	}
}



ComparisonSort.prototype.reset = function()
{
	for (var i = 0; i < this.array_size; i++)
	{

		this.arrayData[i]= this.oldData[i];
		this.barObjects[i] = this.oldBarObjects[i];
		this.barLabels[i] = this.oldbarLabels[i];
		if (this.showLabels)
		{
			this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
		}
		else
		{
			this.cmd("SetText", this.barLabels[i], "");
		}
		this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);
	}
	this.commands = new Array();
}


ComparisonSort.prototype.resetCallback = function(event)
{
	this.randomizeArray();
}

ComparisonSort.prototype.changeSizeCallback = function(event)
{
	this.resetAll(this.showLabels);
}

ComparisonSort.prototype.shellSortCallback = function(event)
{
	this.animationManager.clearHistory();

	this.commands = new Array();
	var inc;
	for (inc = Math.floor(this.array_size / 2); inc >=1; inc = Math.floor(inc / 2))
	{
		for (var offset = 0; offset < inc; offset = offset + 1)
		{
			for (var k = 0; k < this.array_size; k++)
			{
				if ((k - offset) % inc == 0)
				{
					if (this.obscureObject[k])
					{
						this.obscureObject[k] = false;
						this.cmd("SetAlpha", this.barObjects[k], 1.0);
						this.cmd("SetAlpha", this.barLabels[k], 1.0);
					}

				}
				else
				{
					if (!this.obscureObject[k])
					{
						this.obscureObject[k] = true;
						this.cmd("SetAlpha", this.barObjects[k], 0.08);
						this.cmd("SetAlpha", this.barLabels[k], 0.08);
					}
				}
			}
			this.cmd("Step");
			this.insertionSortSkip(inc, offset)

		}

	}
	this.animationManager.StartNewAnimation(this.commands);

}

ComparisonSort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.shellSortButton.disabled = true;
	this.sizeButton.disabled = true;
}
ComparisonSort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.shellSortButton.disabled = false;
	this.sizeButton.disabled = false;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new ComparisonSort(animManag, canvas.width, canvas.height);
}