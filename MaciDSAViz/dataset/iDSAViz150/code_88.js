Trie.NODE_WIDTH = 30;

Trie.LINK_COLOR = "#007700";
Trie.HIGHLIGHT_CIRCLE_COLOR = "#007700";
Trie.FOREGROUND_COLOR = "#007700";
Trie.BACKGROUND_COLOR = "#CCFFCC";
Trie.TRUE_COLOR = "#CCFFCC";
Trie.PRINT_COLOR = Trie.FOREGROUND_COLOR;
Trie.FALSE_COLOR = "#FFFFFF"
Trie.WIDTH_DELTA  = 50;
Trie.HEIGHT_DELTA = 50;
Trie.STARTING_Y = 80;
Trie.LeftMargin = 300;
Trie.NEW_NODE_Y = 100
Trie.NEW_NODE_X = 50;
Trie.FIRST_PRINT_POS_X  = 50;
Trie.PRINT_VERTICAL_GAP  = 20;
Trie.PRINT_HORIZONTAL_GAP = 50;



function Trie(am, w, h)
{
	this.init(am, w, h);
}

Trie.prototype = new Algorithm();
Trie.prototype.constructor = Trie;
Trie.superclass = Algorithm.prototype;

Trie.prototype.init = function(am, w, h)
{
	var sc = Trie.superclass;
	this.startingX =  w / 2;
	this.first_print_pos_y  = h - 2 * Trie.PRINT_VERTICAL_GAP;
	this.print_max  = w - 10;

	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.cmd("CreateLabel", 0, "", 20, 10, 0);
	this.cmd("CreateLabel", 1, "", 20, 10, 0);
	this.cmd("CreateLabel", 2, "", 20, 30, 0);
	this.nextIndex = 3;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}


Trie.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("Text", "");
	this.insertField.onkeypress = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 12,false);
	this.insertButton = addControlToAlgorithmBar("Button", "Insert");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("Text", "");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 12);
	this.deleteButton = addControlToAlgorithmBar("Button", "Delete");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
}

Trie.prototype.reset = function()
{
	this.nextIndex = 3;
	this.root = null;
}

Trie.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value.toUpperCase()
        insertedValue = insertedValue.replace(/[^a-z]/gi,'');

	if (insertedValue != "")
	{
		this.insertField.value = "";
		this.implementAction(this.add.bind(this), insertedValue);
	}
}

Trie.prototype.deleteCallback = function(event)
{
	var deletedValue = this.deleteField.value.toUpperCase();
        deletedValue = deletedValue.replace(/[^a-z]/gi,'');
	if (deletedValue != "")
	{
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this),deletedValue);
	}

}


Trie.prototype.insertElement = function(insertedValue)
{
	this.cmd("SetText", 0, "");
	return this.commands;
}

Trie.prototype.deleteElement = function(word)
{
	this.commands = [];
	this.cmd("SetText", 0, "Deleting: ");
	this.cmd("SetText", 1, "\"" + word  + "\"");
        this.cmd("AlignRight", 1, 0);
        this.cmd("Step");


	var node = this.doFind(this.root, word);
        if (node != null)
        {
  	    this.cmd("SetHighlight", node.graphicID , 1);
            this.cmd("SetText", 2, "Found \""+word+"\", setting value in tree to False");
	    this.cmd("step")
	    this.cmd("SetBackgroundColor", node.graphicID, Trie.FALSE_COLOR);
            node.isword = false
     	    this.cmd("SetHighlight", node.graphicID , 0);
	    this.cleanupAfterDelete(node)
	    this.resizeTree()
        }
        else
        {
             this.cmd("SetText", 2, "\""+word+"\" not in tree, nothing to delete");
	    this.cmd("step")
             this.cmd("SetHighlightIndex", 1,  -1)
        }



	this.cmd("SetText", 0, "");
	this.cmd("SetText", 1, "");
	this.cmd("SetText", 2, "");
	return this.commands;
}



Trie.prototype.numChildren = function(tree)
{
    if (tree == null)
    {
        return 0;
    }
    var children = 0
    for (var i = 0; i < 26; i++)
    {
        if (tree.children[i] != null)
        {
            children++;
        }
    }
    return children;

}

Trie.prototype.cleanupAfterDelete = function(tree)
{
    var children = this.numChildren(tree)

    if (children == 0 && !tree.isword)
    {
         this.cmd("SetText", 2, "Deletion left us with a \"False\" leaf\nRemoving false leaf");
   	 this.cmd("SetHighlight" ,tree.graphicID , 1);
         this.cmd("Step");
   	 this.cmd("SetHighlight", tree.graphicID , 0);
         if (tree.parent != null)
         {
              var index = 0
              while (tree.parent.children[index] != tree)
              {
                  index++;
              }
              this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
       	      this.cmd("Delete", tree.graphicID , 0);
              tree.parent.children[index] = null;
              this.cleanupAfterDelete(tree.parent);
         }
         else
         {
       	      this.cmd("Delete", tree.graphicID , 0);
              this.root = null;
         }
    }
}

Trie.prototype.resizeTree = function()
{
	this.resizeWidths(this.root);
	if (this.root != null)
	{
	        var startingPoint = this.root.width / 2 + 1 + Trie.LeftMargin;
		this.setNewPositions(this.root, startingPoint, Trie.STARTING_Y);
		this.animateNewPositions(this.root);
		this.cmd("Step");
	}

}


Trie.prototype.add = function(word)
{
	this.commands = new Array();
	this.cmd("SetText", 0, "Inserting; ");
	this.cmd("SetText", 1, "\"" + word  + "\"");
        this.cmd("AlignRight", 1, 0);
        this.cmd("Step");
        if (this.root == null)
        {
		this.cmd("CreateCircle", this.nextIndex, "", Trie.NEW_NODE_X, Trie.NEW_NODE_Y);
		this.cmd("SetForegroundColor", this.nextIndex, Trie.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.nextIndex, Trie.FALSE_COLOR);
                this.cmd("SetWidth", this.nextIndex, Trie.NODE_WIDTH);
	        this.cmd("SetText", 2, "Creating a new root");
                this.root = new TrieNode("", this.nextIndex, Trie.NEW_NODE_X, Trie.NEW_NODE_Y)
		this.cmd("Step");
                this.resizeTree();
	        this.cmd("SetText", 2, "" );
                this.highlightID = this.nextIndex++;
                this.nextIndex += 1;

        }
        this.addR(word.toUpperCase(), this.root);
	this.cmd("SetText", 0, "");
	this.cmd("SetText", 1, "");
	this.cmd("SetText", 2, "");

        return this.commands;
}


Trie.prototype.addR = function(s, tree)
{
    this.cmd("SetHighlight", tree.graphicID , 1);

    if (s.length == 0)
    {
            this.cmd("SetText", 2, "Reached the end of the string \nSet current node to true");
            this.cmd("Step");
    	    this.cmd("SetBackgroundColor", tree.graphicID, Trie.TRUE_COLOR);
            this.cmd("SetHighlight", tree.graphicID , 0);
	    tree.isword = true;
	    return;
    }
    else
    {
       this.cmd("SetHighlightIndex", 1, 1);
       var index = s.charCodeAt(0) - "A".charCodeAt(0);
       if (tree.children[index] == null)
       {
           this.cmd("CreateCircle", this.nextIndex, s.charAt(0), Trie.NEW_NODE_X, Trie.NEW_NODE_Y);
           this.cmd("SetForegroundColor", this.nextIndex, Trie.FOREGROUND_COLOR);
           this.cmd("SetBackgroundColor", this.nextIndex, Trie.FALSE_COLOR);
           this.cmd("SetWidth", this.nextIndex, Trie.NODE_WIDTH);
           this.cmd("SetText", 2, "Child " + s.charAt(0) + " does not exist.  Creating ... ");
           tree.children[index] = new TrieNode(s.charAt(0), this.nextIndex, Trie.NEW_NODE_X, Trie.NEW_NODE_Y)
	   tree.children[index].parent = tree;
           this.cmd("Connect", tree.graphicID, tree.children[index].graphicID, Trie.FOREGROUND_COLOR, 0, false, s.charAt(0));

           this.cmd("Step");
           this.resizeTree();
           this.cmd("SetText", 2, "" );
           this.nextIndex += 1;
           this.highlightID = this.nextIndex++;

        }
 	this.cmd("CreateHighlightCircle", this.highlightID, Trie.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
        this.cmd("SetWidth", this.highlightID, Trie.NODE_WIDTH);
        this.cmd("SetText", 2, "Making recursive call to " + s.charAt(0) + " child, passing in \"" + s.substring(1) + "\"");
        this.cmd("Step")
        this.cmd("SetHighlight", tree.graphicID , 0);
        this.cmd("SetHighlightIndex", 1, -1);
        this.cmd("SetText", 1, "\"" + s.substring(1) + "\"");

        this.cmd("Move", this.highlightID, tree.children[index].x, tree.children[index].y);
        this.cmd("Step")
 	this.cmd("Delete", this.highlightID);
	this.addR(s.substring(1), tree.children[index])
    }
}
Trie.prototype.setNewPositions = function(tree, xPosition, yPosition)
{
	if (tree != null)
	{
                tree.x = xPosition;
		tree.y = yPosition;
                var newX = xPosition - tree.width / 2;
                var newY = yPosition + Trie.HEIGHT_DELTA;
                for (var i = 0; i < 26; i++)
                {
                     if (tree.children[i] != null)
                     {
                           this.setNewPositions(tree.children[i], newX + tree.children[i].width / 2, newY);
                           newX = newX + tree.children[i].width;
                     }
                }
	}

}
Trie.prototype.animateNewPositions = function(tree)
{
	if (tree != null)
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
                for (var i = 0; i < 26; i++)
                {
                    this.animateNewPositions(tree.children[i])
                }
	}
}

Trie.prototype.resizeWidths = function(tree)
{
	if (tree == null)
	{
		return 0;
	}
        var size = 0;
	for (var i = 0; i < 26; i++)
	{
            tree.childWidths[i] = this.resizeWidths(tree.children[i]);
            size += tree.childWidths[i]
	}
        tree.width = Math.max(size, Trie.NODE_WIDTH  + 4)
        return tree.width;
}




function TrieNode(val, id, initialX, initialY)
{
	this.wordRemainder = val;
	this.x = initialX;
	this.y = initialY;
	this.graphicID = id;
        this.children = new Array(26);
        this.childWidths = new Array(26);
        for (var i = 0; i < 26; i++)
	{
            this.children[i] = null;
            this.childWidths[i] =0;
	}
        this.width = 0;
	this.parent = null;
}

Trie.prototype.disableUI = function(event)
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
}

Trie.prototype.enableUI = function(event)
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new Trie(animManag, canvas.width, canvas.height);

}