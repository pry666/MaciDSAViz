function LongestCommonPrefix(am, w, h)
{
	this.init(am, w, h);
}

LongestCommonPrefix.prototype = new Algorithm();
LongestCommonPrefix.prototype.constructor = LongestCommonPrefix;
LongestCommonPrefix.superclass = Algorithm.prototype;

LongestCommonPrefix.prototype.init = function(am, w, h)
{
	LongestCommonPrefix.superclass.init.call(this, am, w, h);

	this.addControls();

	this.nextIndex = 0;

	this.strings = ["flower", "flow", "flight"]; // Example input
	this.labels = [];
	this.highlightCircles = [];
	this.commonPrefixLabel = null;
	this.commonPrefix = "";

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
	this.labels = [];
	this.highlightCircles = [];
	this.commonPrefixLabel = null;
	this.commonPrefix = "";
}

LongestCommonPrefix.prototype.startCallback = function()
{
	this.implementAction(this.longestCommonPrefix.bind(this), "");
}

LongestCommonPrefix.prototype.longestCommonPrefix = function(unused)
{
	this.commands = [];

	this.createStringLabels();
	this.findCommonPrefix();
	this.displayCommonPrefix();

	return this.commands;
}

LongestCommonPrefix.prototype.createStringLabels = function()
{
	var y = 50;
	var x = 50;
	for (var i = 0; i < this.strings.length; i++) {
		var labelID = this.nextIndex++;
		this.labels.push(labelID);
		this.cmd("CreateLabel", labelID, this.strings[i], x, y, true);
		y += 50;
	}
}

LongestCommonPrefix.prototype.findCommonPrefix = function()
{
	var minLength = Math.min(...this.strings.map(s => s.length));
	for (var i = 0; i < minLength; i++) {
		var c = this.strings[0][i];
		var mismatch = false;
		for (var j = 1; j < this.strings.length; j++) {
			if (this.strings[j][i] !== c) {
				mismatch = true;
				break;
			}
		}
		if (mismatch) break;
		this.commonPrefix += c;
		this.highlightCharacter(i);
		this.cmd("Step");
	}
}

LongestCommonPrefix.prototype.highlightCharacter = function(index)
{
	for (var i = 0; i < this.strings.length; i++) {
		var circleID = this.nextIndex++;
		this.highlightCircles.push(circleID);
		var x = 50 + index * 10; // Adjust x position based on character index
		var y = 50 + i * 50; // Adjust y position based on string index
		this.cmd("CreateHighlightCircle", circleID, "#FF0000", x, y, 5);
	}
}

LongestCommonPrefix.prototype.displayCommonPrefix = function()
{
	this.commonPrefixLabel = this.nextIndex++;
	this.cmd("CreateLabel", this.commonPrefixLabel, "Common Prefix: " + this.commonPrefix, 50, 50 + this.strings.length * 50 + 50, true);
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