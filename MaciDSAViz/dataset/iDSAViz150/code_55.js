function RadixSort(am, w, h)
{
	this.init(am, w, h);

}


var ARRAY_ELEM_WIDTH = 30;
var ARRAY_ELEM_HEIGHT = 30;
var ARRAY_ELEM_START_X = 20;

var ARRAY_SIZE  = 30;
var COUNTER_ARRAY_SIZE = 10;


var COUNTER_ARRAY_ELEM_WIDTH = 30;
var COUNTER_ARRAY_ELEM_HEIGHT = 30;
var COUNTER_ARRAY_ELEM_START_X = (ARRAY_ELEM_WIDTH * ARRAY_SIZE- COUNTER_ARRAY_ELEM_WIDTH * COUNTER_ARRAY_SIZE) / 2 + ARRAY_ELEM_START_X;
var NUM_DIGITS = 3;


var MAX_DATA_VALUE = 999;



RadixSort.prototype = new Algorithm();
RadixSort.prototype.constructor = RadixSort;
RadixSort.superclass = Algorithm.prototype;

RadixSort.prototype.init = function(am, w, h)
{
	this.ARRAY_ELEM_Y =  3 * COUNTER_ARRAY_ELEM_HEIGHT;
	this.COUNTER_ARRAY_ELEM_Y = Math.floor(h / 2);
	this.SWAP_ARRAY_ELEM_Y =  h - 3 * COUNTER_ARRAY_ELEM_HEIGHT

	var sc = RadixSort.superclass;
	var fn = sc.init;
	fn.call(this,am,w,h);
	this.addControls();
	this.nextIndex = 0;
	this.setup();
}



RadixSort.prototype.sizeChanged = function(newWidth, newHeight)
{
	this.ARRAY_ELEM_Y =  3 * COUNTER_ARRAY_ELEM_HEIGHT;
	this.COUNTER_ARRAY_ELEM_Y = Math.floor(newHeight / 2);
	this.SWAP_ARRAY_ELEM_Y =  newHeight - 3 * COUNTER_ARRAY_ELEM_HEIGHT
	this.setup();
}


RadixSort.prototype.addControls =  function()
{
	this.resetButton = addControlToAlgorithmBar("Button", "Randomize List");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.radixSortButton = addControlToAlgorithmBar("Button", "Radix Sort");
	this.radixSortButton.onclick = this.radixSortCallback.bind(this);

}


RadixSort.prototype.setup = function()
{
	this.arrayData = new Array(ARRAY_SIZE);
	this.arrayRects= new Array(ARRAY_SIZE);
	this.arrayIndices = new Array(ARRAY_SIZE);


	this.counterData = new Array(COUNTER_ARRAY_SIZE);
	this.counterRects= new Array(COUNTER_ARRAY_SIZE);
	this.counterIndices = new Array(COUNTER_ARRAY_SIZE);

	this.swapData = new Array(ARRAY_SIZE);
	this.swapRects= new Array(ARRAY_SIZE);
	this.swapIndices = new Array(ARRAY_SIZE);

	this.commands = new Array();

	for (var i = 0; i < ARRAY_SIZE; i++)
	{
		var nextID = this.nextIndex++;
		this.arrayData[i] = Math.floor(Math.random()*MAX_DATA_VALUE);
		this.cmd("CreateRectangle", nextID, this.arrayData[i], ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y)
		this.arrayRects[i] = nextID;
		nextID = this.nextIndex++;
		this.arrayIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", nextID, "#0000FF");

		nextID = this.nextIndex++;
		this.cmd("CreateRectangle", nextID, "", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y)
		this.swapRects[i] = nextID;
		nextID = this.nextIndex++;
		this.swapIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", nextID, "#0000FF");

	}
	for (i = COUNTER_ARRAY_SIZE - 1; i >= 0; i--)
	{
		nextID = this.nextIndex++;
		this.cmd("CreateRectangle", nextID,"", COUNTER_ARRAY_ELEM_WIDTH, COUNTER_ARRAY_ELEM_HEIGHT, COUNTER_ARRAY_ELEM_START_X + i *COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y)
		this.counterRects[i] = nextID;
		nextID = this.nextIndex++;
		this.counterIndices[i] = nextID;
		this.cmd("CreateLabel",nextID,  i,  COUNTER_ARRAY_ELEM_START_X + i *COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y + COUNTER_ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", nextID, "#0000FF");
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}



RadixSort.prototype.resetAll = function(small)
{
	this.animationManager.resetAll();
	this.nextIndex = 0;
}

RadixSort.prototype.radixSortCallback = function(event)
{
	this.commands = new Array();
	var animatedCircleID = this.nextIndex++;
	var animatedCircleID2 = this.nextIndex++;
	var animatedCircleID3 = this.nextIndex++;
	var animatedCircleID4 = this.nextIndex++;

	var digits = new Array(NUM_DIGITS);
	for (var k = 0; k < NUM_DIGITS; k++)
	{
		digits[k] = this.nextIndex++;
	}


	for (var radix = 0;  radix < NUM_DIGITS; radix++)
	{
		for (var i = 0; i < COUNTER_ARRAY_SIZE; i++)
		{
			this.counterData[i] = 0;
			this.cmd("SetText", this.counterRects[i], 0);
		}
		for (i = 0; i < ARRAY_SIZE; i++)
		{
			this.cmd("CreateHighlightCircle", animatedCircleID, "#0000FF",  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
			this.cmd("CreateHighlightCircle", animatedCircleID2, "#0000FF",  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);


			this.cmd("SetText", this.arrayRects[i], "");

			for (k = 0; k < NUM_DIGITS; k++)
			{
				var digitXPos = ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH - ARRAY_ELEM_WIDTH/2 + (NUM_DIGITS - k ) * (ARRAY_ELEM_WIDTH / NUM_DIGITS - 3);
				var digitYPos = this.ARRAY_ELEM_Y;
				this.cmd("CreateLabel", digits[k], Math.floor(this.arrayData[i] / Math.pow(10,k)) % 10, digitXPos, digitYPos);
				if (k != radix)
				{
					this.cmd("SetAlpha", digits[k], 0.2);
				}
			}


			var index = Math.floor(this.arrayData[i] / Math.pow(10,radix)) % 10;
			this.cmd("Move", animatedCircleID,  COUNTER_ARRAY_ELEM_START_X + index *COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y + COUNTER_ARRAY_ELEM_HEIGHT)
			this.cmd("Step");
			this.counterData[index]++;
			this.cmd("SetText", this.counterRects[index], this.counterData[index]);
			this.cmd("Step");
			this.cmd("Delete", animatedCircleID);
			this.cmd("Delete", animatedCircleID2);
			this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
			for (k = 0; k < NUM_DIGITS; k++)
			{
				this.cmd("Delete", digits[k]);
			}
		}
		for (i=1; i < COUNTER_ARRAY_SIZE; i++)
		{
			this.cmd("SetHighlight", this.counterRects[i-1], 1);
			this.cmd("SetHighlight", this.counterRects[i], 1);
			this.cmd("Step")
			this.counterData[i] = this.counterData[i] + this.counterData[i-1];
			this.cmd("SetText", this.counterRects[i], this.counterData[i]);
			this.cmd("Step")
			this.cmd("SetHighlight", this.counterRects[i-1], 0);
			this.cmd("SetHighlight", this.counterRects[i], 0);
		}
		for (i=ARRAY_SIZE - 1; i >= 0; i--)
		{
			this.cmd("CreateHighlightCircle", animatedCircleID, "#0000FF",  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
			this.cmd("CreateHighlightCircle", animatedCircleID2, "#0000FF",  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);


			this.cmd("SetText", this.arrayRects[i], "");

			for (k = 0; k < NUM_DIGITS; k++)
			{
				digits[k] = this.nextIndex++;
				digitXPos = ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH - ARRAY_ELEM_WIDTH/2 + (NUM_DIGITS - k ) * (ARRAY_ELEM_WIDTH / NUM_DIGITS - 3);
				digitYPos = this.ARRAY_ELEM_Y;
				this.cmd("CreateLabel", digits[k], Math.floor(this.arrayData[i] / Math.pow(10,k)) % 10, digitXPos, digitYPos);
				if (k != radix)
				{
					this.cmd("SetAlpha", digits[k], 0.2);
				}
			}




			index = Math.floor(this.arrayData[i] / Math.pow(10,radix)) % 10;
			this.cmd("Move", animatedCircleID2,  COUNTER_ARRAY_ELEM_START_X + index *COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y + COUNTER_ARRAY_ELEM_HEIGHT)
			this.cmd("Step");

			var insertIndex = --this.counterData[index];
			this.cmd("SetText", this.counterRects[index], this.counterData[index]);
			this.cmd("Step");


			this.cmd("CreateHighlightCircle", animatedCircleID3, "#AAAAFF",  COUNTER_ARRAY_ELEM_START_X + index *COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y);
			this.cmd("CreateHighlightCircle", animatedCircleID4, "#AAAAFF",  COUNTER_ARRAY_ELEM_START_X + index *COUNTER_ARRAY_ELEM_WIDTH, this.COUNTER_ARRAY_ELEM_Y);

			this.cmd("Move", animatedCircleID4,  ARRAY_ELEM_START_X + insertIndex * ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y + COUNTER_ARRAY_ELEM_HEIGHT)
			this.cmd("Step");

			var moveLabel = this.nextIndex++;
			this.cmd("SetText", this.arrayRects[i], "");
			this.cmd("CreateLabel", moveLabel, this.arrayData[i], ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
			this.cmd("Move", moveLabel, ARRAY_ELEM_START_X + insertIndex *ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y);
			this.swapData[insertIndex] = this.arrayData[i];

			for (k = 0; k < NUM_DIGITS; k++)
			{
				this.cmd("Delete", digits[k]);
			}
			this.cmd("Step");
			this.cmd("Delete", moveLabel);
			this.nextIndex--;  // Reuse index from moveLabel, now that it has been removed.
			this.cmd("SetText", this.swapRects[insertIndex], this.swapData[insertIndex]);
			this.cmd("Delete", animatedCircleID);
			this.cmd("Delete", animatedCircleID2);
			this.cmd("Delete", animatedCircleID3);
			this.cmd("Delete", animatedCircleID4);

		}
		for (i= 0; i < ARRAY_SIZE; i++)
		{
			this.cmd("SetText", this.arrayRects[i], "");
		}

		for (i= 0; i < COUNTER_ARRAY_SIZE; i++)
		{
			this.cmd("SetAlpha", this.counterRects[i], 0.05);
			this.cmd("SetAlpha", this.counterIndices[i], 0.05);
		}

		this.cmd("Step");
		var startLab = this.nextIndex;
		for (i = 0; i < ARRAY_SIZE; i++)
		{
			this.cmd("CreateLabel", startLab+i, this.swapData[i], ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.SWAP_ARRAY_ELEM_Y);
			this.cmd("Move", startLab+i,  ARRAY_ELEM_START_X + i *ARRAY_ELEM_WIDTH, this.ARRAY_ELEM_Y);
			this.cmd("SetText", this.swapRects[i], "");

		}
		this.cmd("Step");
		for (i = 0; i < ARRAY_SIZE; i++)
		{
			this.arrayData[i] = this.swapData[i];
			this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
			this.cmd("Delete", startLab + i);
		}
		for (i= 0; i < COUNTER_ARRAY_SIZE; i++)
		{
			this.cmd("SetAlpha", this.counterRects[i], 1);
			this.cmd("SetAlpha", this.counterIndices[i], 1);
		}
	}
	animationManager.StartNewAnimation(this.commands);

}



RadixSort.prototype.randomizeArray = function()
{
	this.commands = new Array();
	for (var i = 0; i < ARRAY_SIZE; i++)
	{
		this.arrayData[i] = Math.floor(1 + Math.random()*MAX_DATA_VALUE);
		this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
	}

	for (i = 0; i < COUNTER_ARRAY_SIZE; i++)
	{
		this.cmd("SetText", this.counterRects[i], "");
	}


	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}







RadixSort.prototype.reset = function()
{
	this.commands = new Array();
}


RadixSort.prototype.resetCallback = function(event)
{
	this.randomizeArray();
}



RadixSort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.radixSortButton.disabled = true;
}
RadixSort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.radixSortButton.disabled = false;
}

var currentAlg;

function init()
{
	var animManag = initCanvas();

	currentAlg = new RadixSort(animManag, canvas.width, canvas.height);
}