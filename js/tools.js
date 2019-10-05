
function Tools(){
    var my = this;
    this.Ops = Object.create(new OpTypes());
    this.q = function(key){return document.querySelector("#"+key);};
    this.qIn = function(key, inns){ document.querySelector("#"+key).innerHTML = inns;};
    this.idBtn = function(idI, bodyI, extraClass){
        return '<a id="'+idI+'" class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 ph3 mh2">'+bodyI+'</a>';
    };
    this.goBtn = function(idI, bodyI, extraClass){
        return '<button id="'+idI+'" class="measure-narrow ph3 btn '+extraClass+'">'+bodyI+'</button>';
    };
    this.feather = function(sized){
        return '<svg xmlns="http://www.w3.org/2000/svg" width="'+sized+'" height="'+sized+'" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="svgs feather feather-feather"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17" y1="15" x2="9" y2="15"></line></svg>';
    };
    this.opDispSpan = function(contentI){
        return '<span class=" divMargin">'+contentI+'</span>';
    };  
    this.genSpan = function(contentI){
        return '<span class="divMargin">'+contentI+'</span>';
    };
    this.gear = function(){
        return '&#x2699;';
    };
    this.randomIntBetween = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };
    this.settingsBar = function(){
        return '<div id="opSettings" class="opSettingsBar"><div id="leftSetting" class="leftM"></div></div>';
    };
    this.isDef=function(input){
        if (typeof input !== 'undefined' && input !== null){
            return true;
        } else { return false; }
    };
    this.stringArrToCharCodeArr = function(inputString){
        var charArr = [];
        for(var i=0;i<inputString.length;i++) {
            charArr.push(inputString.charCodeAt(i));
        }
        return charArr;
    };
    this.charArrToString = function(inputChars, isAllChars){
        var sArr = []; var exceptionValue = my.Ops.exceptionType()[0];
        for (var x=0;x<inputChars.length;x++){
            if (isAllChars){
                sArr.push(String.fromCharCode(inputChars[x]));
            } else {
                console.log("Checking checking: " + exceptionValue);
                if (inputChars[x]==exceptionValue){
                    sArr.push("9");
                } else {
                    sArr.push(String.fromCharCode(inputChars[x]));
                }
            }
        }
        return sArr;
    };
    this.stringJoin = function(stringArrToJoin){
        var join="";
        for (var y=0;y<stringArrToJoin.length;y++){
            join += stringArrToJoin[y];
        }
        return join;
    };
    this.fadeOn = function(item,withPads){
        item.classList.add("genTransition300");
        item.style.height = "auto";
        item.style.opacity=0;
        item.style.display="";
        item.style.opacity=1;
        if (typeof withPads !== 'undefined' && withPads == true){
            item.classList.add("activePads");
        }
        setTimeout(function(){
            item.classList.remove("genTransition300");
        },301);
    };
    this.fadeOff = function(item,withPads){
        item.classList.add("genTransition300");
        item.style.height = 0;
        item.style.opacity=1;
        item.style.display="";
        item.style.opacity=0;
        if (typeof withPads !== 'undefined' && withPads == true){
            item.classList.remove("activePads");
        }
        setTimeout(function(){
            item.classList.remove("genTransition300");
        },301);
    };
    this.fadeOffOn = function(item,cB,isReset){
        item.classList.add("genTransition150");
        item.style.opacity=0;
        setTimeout(function(){
            item.style.opacity=1;
            if (typeof cB === 'function') {cB();}
            setTimeout(function(){
                item.classList.remove("genTransition150");
            },151);
        },151);
    };
}
