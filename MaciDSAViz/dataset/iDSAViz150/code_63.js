var REDGROUND = "#FF0000";
var BLACKGROUD = "#000000";

function Recpower(am, w, h)
{
	this.init(am, w, h);

}

Recpower.prototype = new Algorithm();
Recpower.prototype.constructor = Recpower;
Recpower.superclass = Algorithm.prototype;


Recpower.prototype.init = function(am, w, h)
{
	Recpower.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


Recpower.prototype.addControls =  function()
{
	this.controls = [];
	this.pushField = addControlToAlgorithmBar("Text", "");
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.recpowCallback.bind(this), 6);
	this.pushField2 = addControlToAlgorithmBar("Text", "");
	this.pushField2.onkeydown = this.returnSubmit(this.pushField2,  this.recpowCallback.bind(this), 6);
	this.recpowButton = addControlToAlgorithmBar("Button", "执行");
	this.recpowButton.onclick = this.recpowCallback.bind(this);
	this.controls.push(this.pushField);
	this.controls.push(this.pushField2);
	this.controls.push(this.recpowButton);

}

Recpower.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}


}
Recpower.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


Recpower.prototype.setup = function()
{
	this.nextIndex = 0;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}



Recpower.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;

}

Recpower.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}

Recpower.prototype.clearData = function(ignored)
{
	this.commands = new Array();
	this.clearAll();
	return this.commands;
}

Recpower.prototype.recpowCallback = function(event) {
	if (this.pushField.value != "" && this.pushField2.value != ""){
        var pushVal = this.pushField.value;
        this.pushField.value = ""
		var pushVal2 = this.pushField2.value;
        this.pushField2.value = ""
		this.implementAction(this.recpow.bind(this), pushVal + ";" + pushVal2);
    }
}


Recpower.prototype.recpow = function(value) {
	this.commands = new Array();
    this.commands = [];
	this.arrowindex = []
	var args = value.split(";");
	var a = args[0]
	var n = args[1]
	var ini_n = n
	var i = 0
	this.nextIndex = 0
	var start_y = 50
	this.arrowindex[i] = this.nextIndex++
    this.cmd("CreateRectangle",this.arrowindex[i],"RecPower("+ a + "," + n + ")",300,50,250,start_y)
	this.cmd("Step")
	i = i + 1
	this.arrowindex[i] = this.nextIndex++
	this.cmd("CreateLabel",this.arrowindex[i],"",250,start_y + 20)
	while(n != 0){
	   i = i + 1
	   this.arrowindex[i] = this.nextIndex++
	   if( n%2 == 0 ){
		  this.cmd("CreateRectangle",this.arrowindex[i],"Recpower(" + a + "," + n + ") = factor * factor" + " ;factor = Recpower(" + a + "," + Math.floor(n/2) + ")",300,50,250, start_y + 100)
	   }else{
		  this.cmd("CreateRectangle",this.arrowindex[i],"Recpower(" + a + "," + n + ") = factor * factor * " + a + " ;factor = Recpower(" + a + "," + Math.floor(n/2) + ")",300,50,250, start_y + 100)
	   }
	   n =  Math.floor(n/2)
	   this.cmd("Connect",this.arrowindex[i - 1],this.arrowindex[i])
	   this.cmd("Step")
	   start_y = start_y + 100
	   i = i + 1
	   this.arrowindex[i] = this.nextIndex++
	   this.cmd("CreateLabel",this.arrowindex[i],"",250,start_y + 20)
	}

	for(var j = this.arrowindex.length - 2 ; j >= 0; j-=2){
		var this_n = Math.floor(ini_n/Math.pow(2,j/2))
		var last_n = Math.floor(ini_n/Math.pow(2,j/2 - 1))
		var factor =  Math.pow(a,this_n)
		if(j != 0){
			if(last_n % 2 == 0){
				this.cmd("SetText",this.arrowindex[j],"Recpower(" + a + "," + last_n + ") = factor * factor" + " ;factor = " + Math.pow(a,this_n))
				this.cmd("Step")
				this.cmd("SetText",this.arrowindex[j],"Recpower(" + a + "," + last_n + ") = " + factor + " * " + factor + " ;factor = " + Math.pow(a,this_n))
				this.cmd("Step")
			}else{
				this.cmd("SetText",this.arrowindex[j],"Recpower(" + a + "," + last_n + ") = factor * factor * " + a + " ;factor = " + Math.pow(a,this_n))
				this.cmd("Step")
				this.cmd("SetText",this.arrowindex[j],"Recpower(" + a + "," + last_n + ") = " + factor + " * " + factor + " * "+ a + " ;factor = " + Math.pow(a,this_n))
				this.cmd("Step")
			}
		}else{
			this.cmd("SetText",this.arrowindex[j],"Recpower(" + a + "," + this_n + ") = " + Math.pow(a,this_n))
			this.cmd("Step")
		}


	}

    return this.commands;
}

Recpower.prototype.clearAll = function()
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
	currentAlg = new Recpower(animManag, canvas.width, canvas.height);
}