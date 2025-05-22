function LongestCommonPrefix(am, w, h)
{
	this.init(am, w, h);
}

LongestCommonPrefix.prototype = new Algorithm();
LongestCommonPrefix.prototype.constructor = LongestCommonPrefix;
LongestCommonPrefix.superclass = Algorithm.prototype;

LongestCommonPrefix.ELEMENT_WIDTH = 100;
LongestCommonPrefix.ELEMENT_HEIGHT = 50;
LongestCommonPrefix.STARTING_X = 30;
LongestCommonPrefix.STARTING_Y = 100;
LongestCommonPrefix.FOREGROUND_COLOR = "#000055";
LongestCommonPrefix.BACKGROUND_COLOR = "#AAAAFF";

LongestCommonPrefix.prototype.init = function(am, w, h)
{
	LongestCommonPrefix.superclass.init.call(this, am, w, h);

	this.addControls();

	this.nextIndex = 0;

	this.strings = ["flower", "flow", "flight"]; // Example input
	this.prefix = "";
	this.currentComparison = 0;
	this.stringRectangles = [];
	this.prefixRectangle = null;

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

LongestCommonPrefix.prototype.addControls =  function()
{
	this.controls = [];

	this.startButton = addControlToAlgorithmBar("Button", "Start");
	this.startButton.onclick = this.startCallback.bind(this);
	this.controls.push(this.startButton);
}

LongestCommonPrefix.prototype.reset = function()
{
	this.nextIndex = 0;
	this.prefix = "";
	this.currentComparison = 0;
	this.stringRectangles = [];
	this.prefixRectangle = null;

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

LongestCommonPrefix.prototype.startCallback = function()
{
	this.implementAction(this.start.bind(this));
}

LongestCommonPrefix.prototype.start = function()
{
	this.commands = [];

	for (let i = 0; i < this.strings.length; i++) {
		const rectID = this.nextIndex++;
		this.cmd("CreateRectangle", rectID, this.strings[i], LongestCommonPrefix.ELEMENT_WIDTH, LongestCommonPrefix.ELEMENT_HEIGHT, LongestCommonPrefix.STARTING_X, LongestCommonPrefix.STARTING_Y + i * (LongestCommonPrefix.ELEMENT_HEIGHT + 10));
		this.cmd("SetForegroundColor", rectID, LongestCommonPrefix.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", rectID, LongestCommonPrefix.BACKGROUND_COLOR);
		this.stringRectangles.push(rectID);
	}

	this.prefixRectangle = this.nextIndex++;
	this.cmd("CreateRectangle", this.prefixRectangle, "", LongestCommonPrefix.ELEMENT_WIDTH, LongestCommonPrefix.ELEMENT_HEIGHT, LongestCommonPrefix.STARTING_X, LongestCommonPrefix.STARTING_Y + (this.strings.length + 1) * (LongestCommonPrefix.ELEMENT_HEIGHT + 10));
	this.cmd("SetForegroundColor", this.prefixRectangle, LongestCommonPrefix.FOREGROUND_COLOR);
	this.cmd("SetBackgroundColor", this.prefixRectangle, LongestCommonPrefix.BACKGROUND_COLOR);

	this.cmd("CreateLabel", this.nextIndex++, "Strings:", LongestCommonPrefix.STARTING_X - 50, LongestCommonPrefix.STARTING_Y, true);
	this.cmd("CreateLabel", this.nextIndex++, "Prefix:", LongestCommonPrefix.STARTING_X - 50, LongestCommonPrefix.STARTING_Y + (this.strings.length + 1) * (LongestCommonPrefix.ELEMENT_HEIGHT + 10), true);

	this.cmd("Step");

	this.prefix = this.strings[0];
	this.cmd("SetText", this.prefixRectangle, this.prefix);
	this.cmd("Step");

	for (let i = 1; i < this.strings.length; i++) {
		this.prefix = this.lcp(this.prefix, this.strings[i]);
		this.cmd("SetText", this.prefixRectangle, this.prefix);
		this.cmd("Step");
		if (this.prefix === "") {
			break;
		}
	}

	return this.commands;
}

LongestCommonPrefix.prototype.lcp = function(str1, str2)
{
	const length = Math.min(str1.length, str2.length);
	let index = 0;
	while (index < length && str1[index] === str2[index]) {
		index++;
	}
	return str1.substring(0, index);
}

LongestCommonPrefix.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}

LongestCommonPrefix.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
}

var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new LongestCommonPrefix(animManag, canvas.width, canvas.height);
}