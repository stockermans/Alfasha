function AlfaTools(){
	var my = this;
    this.Ops = Object.create(new OpTypes());
	var myCurrentOp = "", mySplittedOps = [];
    var onCurrentOp = -1;
    this.myOpLength = function(){ return mySplittedOps.length; };
	this.currentOp = function(){
		if (mySplittedOps !== []){
            console.log("On current Op Is: " + onCurrentOp);
            console.log("Splitted lenght: " + mySplittedOps.length);
            if (onCurrentOp < mySplittedOps.length-1){
                onCurrentOp++;
            }
            else {
                onCurrentOp=0;
            }
            console.log("On current Op is now: " + onCurrentOp);
            return mySplittedOps[onCurrentOp];
		}
	};
	var innerOpToParse = function(opSplitToParse){
		console.log("Parsing op types " + opSplitToParse);
		var isAdd = my.Ops.findAdditionConsume(opSplitToParse);
        var isMultiply = my.Ops.findMultiplyConsume(opSplitToParse);
		if (isAdd[0]){ return isAdd; }
        else if (isMultiply[0]){return isMultiply; }
	};
    this.opsSplitter = function(inputOps,keepTrackOfCurrent){
        mySplittedOps=[]; myCurrentOp=""; onCurrentOp=-1;
        var thisOps = inputOps.split(my.Ops.OP_FILTER);
        var splittedOps = []; var currentTry="";
        for (var op=0;op<thisOps.length;op++){
            currentTry = innerOpToParse(thisOps[op]);
            if (typeof currentTry !== 'undefined'){
                splittedOps.push(currentTry);
            }
        }
        if (keepTrackOfCurrent){
            console.log("All operations to be used!!!");
            console.log(splittedOps);
            for (var c=0;c<splittedOps.length;c++){ mySplittedOps.push(splittedOps[c]); }
        	myCurrentOp = mySplittedOps[0];
        }
        return mySplittedOps;
    };
}

function OpTypes(){
    var my = this;
    this.OP_FILTER = " ";
    this.setSupportedCharsAll = function(isAll){
        if (isAll){
            SUPPORTED_CHARS = allChars;
        } else {
            SUPPORTED_CHARS = letterOnly;
        }
    };
    this.exceptionType = function(){ return letterOnly; };
    var allChars = [32,126];
    var letterOnly = [64,90];
    var SUPPORTED_CHARS = [32,126];
    var fullDiffInc = function(){ return SUPPORTED_CHARS[1] - SUPPORTED_CHARS[0] + 1; };

    var handleOverflow = function(possibleOverflow){
        var isPositive  = (possibleOverflow > 0) ? true : false; // If isPositive, then it flew way to the right side.
        possibleOverflow = Math.abs(possibleOverflow);
        if (possibleOverflow > fullDiffInc()){ // diff is 333
            var quotient = Math.floor(possibleOverflow/fullDiffInc());  // gives 3
            var remainder = possibleOverflow % fullDiffInc(); //48
            return remainder;
        }
        else return possibleOverflow;
    };
    var safeChar = function(charBecame){
        if (charBecame > SUPPORTED_CHARS[1]){
            console.log("Char becamebigger ? " + charBecame);
    		var tooBigBy = handleOverflow(charBecame - SUPPORTED_CHARS[1]);
            console.log("Too big by " + tooBigBy);
    		return SUPPORTED_CHARS[0] + tooBigBy - ((tooBigBy==0)?0:1); // if it is 1 over 126, it should be now 32 exactly.
    	}
        else if (charBecame < SUPPORTED_CHARS[0]){
    		var tooSmallBy = handleOverflow(SUPPORTED_CHARS[0] - charBecame);
    		return SUPPORTED_CHARS[1] - tooSmallBy;
    	} else {
            return charBecame;
        }
    };
	this.findAdditionConsume = function(thisInput){
		var tryAllSplit = thisInput.split("+");
		if (tryAllSplit[1]==""){
			console.log("Found an Addition command");
			return [true,"+",tryAllSplit[0]];
		} else {
			return [false];
		}
	};
    this.findMultiplyConsume = function(thisInput){
        var tryAllSplit = thisInput.split("*");
        if (tryAllSplit[1]==""){
            console.log("Found a Multiply command");
            return [true,"*",tryAllSplit[0]];
        } else {
            return [false];
        }
    };
    this.convertArrayToArray = function(arr, size){
        var newArr = [];
        for (var y=0;y<size;y++){
            for (var x = 0; x<arr.length; x++){
                if (newArr.length < size){
                    newArr.push(arr[x]);
                } else {
                    return newArr;
                }
            }
        }
    };
    this.mainOpHandler = function(typeIn, allCmdForAltering,inProgressArray, newCharToAddAndModify ){
        return multiAllCommandHandleChar(typeIn, allCmdForAltering,inProgressArray, newCharToAddAndModify);
    };
    var commandTypeMainModifier = function(type, newCharToAddAndModify, allCmdForAltering){
        if (type == "+"){
            return  newCharToAddAndModify +  allCmdForAltering;
        } else if (type == "*"){
            return  newCharToAddAndModify * allCmdForAltering;
        }
    };
    var multiAllCommandHandleChar = function(typeIn, allCmdForAltering, inProgressArray, newCharToAddAndModify){
        if (inProgressArray.length==0){
            return safeChar(commandTypeMainModifier(typeIn, newCharToAddAndModify, allCmdForAltering));
        } else {
            var notFixedYet = commandTypeMainModifier(typeIn, newCharToAddAndModify, allCmdForAltering) + inProgressArray[inProgressArray.length-1];
            var safeOne = safeChar(notFixedYet);
            return safeOne;
        }
    };
}