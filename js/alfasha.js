var controller = new Controller();
controller.init();

function Controller(){
    var my = this;
    var T = Object.create(new Tools());
    var I = Object.create(new Importer());
    this.Importer = function(){ return I; };
    var A = Object.create(new AlfaTools());
    var time = null, themeSwitcher = null;
    var p = {
        resetBtn:["resetNow","Reset"],
        d:'<div class="checkMarks"> <span>&#x2714;</span>', d0:'</div>',
        myBtn:["alfaNow","Alfasha","Reset"],
        initVal:null,initCharVals:null, inProgressChars:null, actualArrayToUse:[],
        screenBuilt:false, isHandling:false,
        isPreliminary:false, outMessageIsVis:false,startPrintOps:true,failOperationsParse:false
    };
    var h = {
        mainBodyBox:0,inInput:0,alfaNowBox:0,allChars:0,allCharsBox:0,allCharsTxt:0,
        outputMessage:0,lengthOptionBox:0,checkBoxBox:0,allCharOptionBox:0,
        lengthCheckbox:0, endLengthInput:0,alfaResetBox:0,outputContent:0
    };
    this.init = function(){
        if (!p.screenBuilt){
            buildView(); I.init();
            console.log("Operations: o");
            console.log("Alfasha Play: o\n\n");
        }
    };

    var parseH = function(){ for (var key in h){ h[key] = T.q(key); } };
    var buildView = function(){
        T.qIn("alfaHead", buttonsBuild());
        T.qIn("alfaBody",getInputs());
        parseH();
        handleAllCharCheck();
        I.builtCb();
        watchAlfaSha();
        p.screenBuilt=true;
        time = new Time();
        time.is(true);
        themeSwitcher = new ThemeSwitcher();
        themeSwitcher.is();
    };
    var buttonsBuild = function(){
        var h = '<div class="w-100 pt4 ph3 pb4 tl bb b--black-10 mb5">';
            //h += '<h1 class="light-blue f3 fw1 pt1 pb4 mb3">Alfasha</h1>';
            h += I.myBtns();
        return h;
    };
    var getInputs = function(){
        var inputs = '<div id="mainBodyBox" class="mainBodyBoxes">';
            inputs += '<h1 class="light-blue pb3 f3 fw1 mt0 lh-title">Play</h1>';
            inputs += '<textarea id="inInput" class="black-60 f5 pt4 br3 ph3 mainInput faBox inputs" type="text" rows="4" placeholder="Enter inputs"></textarea>';
            inputs += '<div id="alfaNowBox" class="fullBtnBox" style="height:0px;opacity:0;">'+T.goBtn(p.myBtn[0],p.myBtn[1], "fullBtn activated") +'</div>';
            
            inputs += '<div id="outputMessage" class="outputMsgs" style="opacity:0;"></div>';
                inputs += '<div id="fullOutputs" class="faOutputs">';
                inputs += '<div id="lengthOptionBox" class="db tr faInputSm">';
                    
                    inputs += '<div id="checkBoxBox" class="db ma3">Equal Length<input id="lengthCheckbox" type="checkbox" checked class="ph3 ml3 inputs checkBox checkBoxLength"></div>';
                    inputs += '<input id="endLengthInput" style="display:none;" class="br3 ph3 mh3 inputs lengthInput" type="number" placeholder="Desired Length">';

                    inputs += '<div id="allCharOptionBox"><div id="allChars" class="db ma3"><span id="allCharsTxt"></span><input id="allCharsBox" type="checkbox" class="ph3 ml3 inputs checkBox checkBoxLength"></div></div>';


                inputs += '</div>';


                inputs += '<div id="startItem"></div>';
                inputs += '<div id="endItem"></div>';
                inputs += '<div id="outputContent" class="outContents"></div>';
            inputs += '</div>';
            inputs += '<div id="alfaResetBox" class="fullBtnBox" style="height:0px;opacity:0;">'+T.idBtn(p.resetBtn[0],p.resetBtn[1], "fullBtn activated") +'</div>';
        inputs += '</div>';
        //inputs += '<div id="textImporterBody" class="mainBodyBoxes" style="display:none;"></div>';
        inputs += '<div id="importsBody" class="mainBodyBoxes" style="display:none;"></div>';
        inputs += '<div id="exporterBody" class="mainBodyBoxes dn"></div>';
        inputs += '<div id="helpBody" class="mainBodyBoxes" style="display:none;"></div>';
        return inputs;
    };
    var handleAllCharCheck = function(){
        if (h.allCharsBox.checked){
            h.allCharsTxt.innerHTML = "All Alpha";
        } else {
            h.allCharsTxt.innerHTML = "Alpha Only";
        }
    };
    var watchAlfaSha = function(){
        h.inInput.addEventListener('click',function(){
            T.fadeOn(h.alfaNowBox);
        });
        h.inInput.addEventListener('change',function(){
            if (p.outMessageIsVis){
                h.outputMessage.innerHTML="";
                T.fadeOff(h.outputMessage,true);
            }
        });
        h.allChars.addEventListener('change',handleAllCharCheck);
        h.lengthCheckbox.addEventListener('change',function(){
            if (h.lengthCheckbox.checked){
                h.endLengthInput.style.display="none";
            } else {
                h.endLengthInput.style.display="";
            }
        });
        T.q(p.myBtn[0]).addEventListener('click',function(){
            if (isValidProceed()) {
                p.isHandling=true;
                btnHandle(true);
                alfaHandle(); 
            } else {
                handleFail();
            }
        });
        T.q(p.resetBtn[0]).addEventListener('click',function(){
            if (p.failOperationsParse){
                p.failOperationsParse=false;
                T.q("fullOutputs").style.display="";
                T.q("alfaNowBox").style.display="";
                T.fadeOff(h.outputMessage,true);
            }
            nowReset();
        });
    };
    var isValidProceed = function(){
        return isValidOps(I.getOps()) && h.inInput.value !== "" && !p.isHandling;
    };
    var handleFail = function(){
        if (h.inInput.value == ""){
            h.outputMessage.innerHTML = "&#x26A0; Please specify an input prior to attempting.";
            T.fadeOn(h.outputMessage,true);
            p.outMessageIsVis=true;
        } else { }
        T.q(p.myBtn[0]).innerHTML = p.myBtn[1];
        p.isHandling=false;
    };
    var btnHandle = function(toAdd){
        var btn = T.q(p.myBtn[0]);
        var cl = btn.classList;
        if (toAdd){
            h.inInput.style.display="none";
            T.fadeOff(h.alfaNowBox);
            T.fadeOn(h.alfaResetBox);
        } else {
            h.inInput.style.display="";
            T.fadeOn(h.alfaNowBox);
            T.fadeOff(h.alfaResetBox);
        }
    };
    var nowReset = function(){
        p.startPrintOps=true;
        h.mainBodyBox.style.display="none";
        T.q("inInput").style.display=""; 
        T.fadeOff(h.alfaResetBox);
        T.q("startItem").innerHTML = "";
        T.q("startItem").classList.remove("genItemPadsDown");
        T.q("endItem").innerHTML = "";
        T.q("endItem").classList.remove("genItemPadsUp");
        T.q("outputContent").innerHTML = "";
        h.lengthCheckbox.checked=true;
        h.endLengthInput.value="";
        h.endLengthInput.style.display="none";
        h.allCharOptionBox.style.display="";
        h.lengthOptionBox.style.display="";
        h.inInput.value = "";
        p.isHandling=false;
        I.resetAll();
        T.fadeOn(h.mainBodyBox);
    };
    var printSysMsg = function(inner){
        var newContent = p.d + inner + p.d0;
        h.outputContent.innerHTML += newContent;
    };
    var setEqualMsg = function(){
        h.lengthOptionBox.style.display="none";
        if (h.lengthCheckbox.checked){
            printSysMsg(" Equal Length ");
        } else if (h.endLengthInput.value !== "") {
            printSysMsg(" Custom Length: " + h.endLengthInput.value);
        } else {
            printSysMsg(" Equal Length");
        }      
    };
    var setAllCharMsg = function(){
        h.allCharOptionBox.style.display="none";
         if (h.allCharsBox.checked){
            printSysMsg(" All Chars ");
        } else {
            printSysMsg(" Alpha Only");
        }          
    };
    var setOpsMsg = function(){
        h.outputContent.innerHTML += '<div id="viewCurrentOpMsg" class="btn cursorPointer"><span>&#x21e9;</span> View Current Ops</div><div id="viewCurrentOpMessages" class="checkMarks" style="display:none;">'+I.getOps()+'</div>';
    };
    var initMsgs = function(){
        printStart(p.initVal);
        printSysMsg(" Start Length = " + p.initVal.length);
        setEqualMsg();
        setAllCharMsg();
        setOpsMsg();
    };
    this.optInputLength = function(){ return h.endLengthInput.value; };
    var handleCustomLengthPre = function(){
        var customLength = my.optInputLength();
        if (customLength !== ""){
            console.log("Custom length is: " + customLength);
            p.actualArrayToUse = A.Ops.convertArrayToArray(p.initCharVals, customLength);
        } else { 
            for (var z=0;z<p.initCharVals.length;z++){ p.actualArrayToUse.push(p.initCharVals[z]); }
        }
    };
    var alfaHandle = function(){
        A.Ops.setSupportedCharsAll(h.allCharsBox.checked);
        p.initVal = h.inInput.value;
        initMsgs();
        p.initCharVals = T.stringArrToCharCodeArr(p.initVal);
        p.endToStrings = T.charArrToString(p.initCharVals,true);
        p.isPreliminary = doPreliminaryCheck();

        console.log("Getting Opts: + " + I.getOps());
        A.opsSplitter(I.getOps(),true);

        var thisCurrentOpLength = A.myOpLength();
        var isMultiOps = (thisCurrentOpLength > 1 ? true : false);
        p.inProgressChars = []; p.actualArrayToUse = [];

        handleCustomLengthPre();

        for (var x=0;x<p.actualArrayToUse.length;x++){
            p.inProgressChars.push(opSwitchHandler(A.currentOp(),true, p.actualArrayToUse[x]));
        }

        var returned = p.inProgressChars;
        var ended = T.stringJoin(T.charArrToString(returned, h.allCharsBox.checked));
        printSysMsg(" End Length = " + ended.length);          
        console.log("*****************");

        if (!p.startPrintOps){ throwWatchDetailMsgs(); }
        if (p.isPreliminary){ printConclude(ended); }
    };
    var throwWatchDetailMsgs = function(){
        T.q("viewCurrentOperations").addEventListener('click',function(){
            if (T.q("currentPrintOperations").style.display=="none"){
                T.q("currentPrintOperations").style.display="";
            } else {
                T.q("currentPrintOperations").style.display="none";
            }
        });
        T.q("viewCurrentOpMsg").addEventListener('click',function(){
            if (T.q("viewCurrentOpMessages").style.display=="none"){
                T.q("viewCurrentOpMessages").style.display="";
            } else {
                T.q("viewCurrentOpMessages").style.display="none";
            }
        });
    };
    var printStart = function(inner){
        T.q("startItem").innerHTML = '<div class="outputStart genActivePads">' + inner + p.d0;
        T.q("startItem").classList.add("genItemPadsDown");
    };
    var printConclude = function(inner){
        T.q("endItem").innerHTML = '<div id="endItem" class="outputEnd genActivePads">' + inner + p.d0;
        T.q("endItem").classList.add("genItemPadsUp");
    };
    var opSwitchHandler = function(thisOps, isMultiOps, currentCharToAddModify){
        console.log("This current Op is : " + thisOps);
        if (p.startPrintOps){
            h.outputContent.innerHTML += '<div id="viewCurrentOperations" class="btn cursorPointer"><span>&#x21e9;</span> View All Logged Operations</div><div id="currentPrintOperations" style="display:none;"></div>';
            p.startPrintOps=false;
        }
        var printCurrentMsg = function(inner){
            var newContent = '<div class="checkMarks">'+p.inProgressChars.length +' <span>&#x21e8;</span> ' + inner + p.d0;
            T.q("currentPrintOperations").innerHTML += newContent;
        };
        var currentReturn="";
        if (typeof thisOps !== "undefined"){
            switch(thisOps[1]){
                case "+":
                    currentReturn = A.Ops.mainOpHandler("+", parseInt(thisOps[2]), p.inProgressChars, currentCharToAddModify, p.initCharVals);
                    printCurrentMsg(thisOps[1] +" "+ thisOps[2] + " &#x21e8; "+currentReturn);
                    return currentReturn;
                case "*":
                    currentReturn = A.Ops.mainOpHandler("*", parseInt(thisOps[2]), p.inProgressChars, currentCharToAddModify, p.initCharVals);
                    printCurrentMsg(thisOps[1] +" "+ thisOps[2] + " &#x21e8; "+currentReturn);
                    return currentReturn;
            }
        } else {
            h.outputMessage.innerHTML = "&#x26A0; Operations could not be properly parsed.";
            T.fadeOn(h.outputMessage,true);
            T.q("fullOutputs").style.display="none";
            T.q("alfaNowBox").style.display="none";
            p.failOperationsParse=true;
        }
    };
    var doPreliminaryCheck = function(){
        var initialValue = p.initVal;
        var initialCharCodeValue = p.initCharVals;

        var endToStrings = p.endToStrings;
        var endToJoin = T.stringJoin(endToStrings);

        if (initialValue === endToJoin){
            printSysMsg(" Preliminary");
            return true;
        } else {
            printSysMsg(" Failure &#x2716; ");
            return false;
        }
    };
    var isValidOps = function(incomingOps){
        return true;
    };
}
