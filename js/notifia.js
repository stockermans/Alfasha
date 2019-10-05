console.log("***Starting JS-Notify***");


var NM = new Notifia();

function Notifia () {

    var my = this;
    
    var T = new NTools();

    var roots = {

        "count":0,
        "notices":{},
        "callbackCareful2fa":true,
        "importantTypes": [ "static" ],
        "noticeClasses":" notification lang-links br3 ml3 mr3 measures dn fixed justify-left black-70 items-center mt3 ",
        "multiNoticeClasses": [ "halfDim" ],
        "hidingNoticeTimeOff": 3333,
        "fadeClass": "fadePulse",
        "noticeIconClasses": "noticeIcon dib lh-title f3",
        "noticeBodyClasses": "measure-wide lh-title ml2",
        "noticeSysId": "notifia"

    };


    this.makeNotice = function(noticeBundle ,cB){
        
        console.log("Making notice");

        if (safeCreateCheck(noticeBundle, cB)){

            console.log("Building new notice");
            
            var returnFor = {"count": roots.count, "newNotice":preNewNotice(noticeBundle), "noticeBundle":noticeBundle,"build":entryBuilder(noticeBundle),"cB":cB};
            
            noticeBeginSwitch(noticeBundle, returnFor);

        }

    };


    var safeCreateCheck = function(noticeBundle, initCallback){
        
        var isActiveNotices = existingActiveNotice(); //something is already on the screen
        
        var isImportantDuplicate = importantDuplicate(noticeBundle); // is identical bundle trying to be rebuilt, reactivate instead
        
        var newOneIsImportant = importantTypeMatch(noticeBundle.type); // is a new important notice


        switch(true){


            case (newOneIsImportant && isImportantDuplicate.is):
                
                my.noticeChanger(my.noticeToChangeBundleConvert(noticeBundle));

                my.activateNotice(noticeBundle.id, initCallback);

                return false;


            case (newOneIsImportant):
                
                multiNoticeRecovery();

                my.hideRmAnyNotices();
                
                return true;


            default:
                
                return safeUninportantNoticeBehaviour(noticeBundle, isActiveNotices, initCallback);


        }


    };


    var safeUninportantNoticeBehaviour = function(noticeBundle, isActiveNotices, optionalInitCallback){
        
        console.log("Uninportant notice item. Build it if the active item is also not-important");
        
        if (isActiveNotices.is){

            if (checkImportanceFromMultipleItems(isActiveNotices)){

                multiNoticeDim(isActiveNotices,true);
                console.log("this active notice is important, lets just let it sit on the screen. And display 1 unimportant ontop.");
                my.rmAllNonImportants();
                T.isFunctionCallMe(optionalInitCallback);
                
                return true;

            } else {

                console.log("Active is unimportant. Clear it and lets go.");
                if (existingDuplicateAny(noticeBundle).is){

                    console.log("Existing unimportant duplicate. No touching.");
                    T.isFunctionCallMe(optionalInitCallback);
                    return false;

                } else {
                    
                    console.log("Unimportant+ Not the same message.Adios.");
                    my.hideRmAnyNotices();
                    T.isFunctionCallMe(optionalInitCallback);
                    return true;

                }

            }

        } else {

            console.log(roots.notices);
            console.log("No active notices, all good bro.");
            my.hideRmAnyNotices();
            return true;

        }
    };


    this.noticeToChangeBundleConvert = function(nBundle){

        var changeBundle = {};
        if (T.isDef(nBundle.id)) { changeBundle.id = nBundle.id; }
        if (T.isDef(nBundle.icon)) { changeBundle.icon = nBundle.icon; }
        if (T.isDef(nBundle.txtClass)) { changeBundle.newClass=nBundle.txtClass; }
        if (T.isDef(nBundle.colour)) { changeBundle.newColour = nBundle.colour; }
        if (T.isDef(nBundle.fade)) { changeBundle.fade = nBundle.fade; }
        if (T.isDef(nBundle.type)) { changeBundle.type = nBundle.type; }

        return changeBundle;
    };


    var multiNoticeDim = function(isActiveNotices, adding){

        console.log("..Adding multi notice opacity dim on important item.");
        console.log(isActiveNotices);

        for (var checkActives=0; checkActives < isActiveNotices.items.length; checkActives++){
            if (isActiveNotices.items[checkActives].isImportant){
                
                console.log("WHat is this curent nocie?");
                console.log(isActiveNotices.items[checkActives]);

                if (T.isDef(isActiveNotices.items[checkActives].box)){
                    T.toggleClasses(isActiveNotices.items[checkActives].box, adding, roots.multiNoticeClasses);
                }

            }
        }

    };


    var checkImportanceFromMultipleItems = function(isActiveNotices){

        var hasSomethingImportance=false;
        for (var checkActives=0; checkActives < isActiveNotices.items.length; checkActives++){
            if (isActiveNotices.items[checkActives].isImportant){
                hasSomethingImportance=true;
                console.log("..Some Active item of maybe multiples had importance. ");
            }
        }
        return hasSomethingImportance;

    };


    var existingActiveNotice = function(){
        var somethingActive={"is":false, "items":[]};
        for (var notice in roots.notices){
            if (roots.notices[notice].active){
                somethingActive.is=true;
                somethingActive.items.push(roots.notices[notice]);
            }
        }
        return somethingActive;
    };

    var handlechangeIcon = function(changeBundle, thisBundleKey){
        if (T.isDef(changeBundle.icon) && roots.notices[thisBundleKey].icon !== changeBundle.icon){
            roots.notices[thisBundleKey].icon.innerHTML = changeBundle.icon;
        }
    };

    var handleChangeLink = function(changeBundle, thisBundleKey){
        if (T.isDef(changeBundle.beLinkNow)){ 
                
            roots.notices[thisBundleKey].beLinkNow=changeBundle.beLinkNow;

            if (changeBundle.beLinkNow && T.isDef(changeBundle.linkIs)){
                roots.notices[thisBundleKey].linkIs = changeBundle.linkIs;
            }
        }
    };
    
    var handleChangeText = function(changeBundle, thisBundleKey){
        var actualText = roots.notices[thisBundleKey].main;
        if (T.isDef(changeBundle.text)) { actualText.innerHTML = changeBundle.text; }
    };

    var handleChangeClass = function(changeBundle, thisBundleKey){
        var actualText = roots.notices[thisBundleKey].main;
        if (T.isDef(changeBundle.newClass)){
            T.classesOnOff(actualText, [changeBundle.newClass], [roots.notices[thisBundleKey].bundle.txtClass] );
            roots.notices[thisBundleKey].bundle.txtClass = changeBundle.newClass;
        }
    };

    var handleNewColour = function(changeBundle, thisBundleKey){
        var noticeBoxIs = T.q(roots.notices[thisBundleKey].name);

        if (T.isDef(changeBundle.newColour)){
            T.classesOnOff(noticeBoxIs, [changeBundle.newColour], [roots.notices[thisBundleKey].bundle.colour] );
            roots.notices[thisBundleKey].bundle.colour = changeBundle.newColour;
        }
    };

    var handleNoticeClasses = function(changeBundle, thisBundleKey){
        var noticeBoxIs = T.q(roots.notices[thisBundleKey].name);
        
        if (T.isDef(changeBundle.noticeClasses)){
            T.toggleClasses(noticeBoxIs,true,changeBundle.noticeClasses);
        }
    };

    var handleChangeFade = function(changeBundle, thisBundleKey){
        if (T.isDef(changeBundle.fade)){
            var ffd = changeBundle.fade ? roots.notices[thisBundleKey].icon.classList.add(roots.fadeClass) : roots.notices[thisBundleKey].icon.classList.remove(roots.fadeClass);
        }
    };

    var handleSkippable = function(changeBundle, thisBundleKey){

        if (T.isDef(changeBundle.skippable)){
            console.log("Setting this skippability to: " + changeBundle.skippable);
            roots.notices[thisBundleKey].skippable = changeBundle.skippable;
            if (changeBundle.skippable){ isSkippable(thisBundleKey); }
            else { notSkippable(thisBundleKey); }
            console.log(roots.notices[thisBundleKey]);
        }

        if (T.isDef(changeBundle.autoSkip)){
            autoSkip(thisBundleKey);
        }

    };

    this.noticeChanger = function(changeBundle, cB){

        var thisBundleKey = my.findNoticeBundle(changeBundle.id);
        var noticeBoxIs = T.q(roots.notices[thisBundleKey].name);

        if (T.isDef(noticeBoxIs)) {

            handlechangeIcon(changeBundle, thisBundleKey);

            handleChangeLink(changeBundle, thisBundleKey);

            handleChangeText(changeBundle, thisBundleKey);

            handleChangeClass(changeBundle, thisBundleKey);

            handleNewColour(changeBundle, thisBundleKey);

            handleNoticeClasses(changeBundle, thisBundleKey);

            handleChangeFade(changeBundle, thisBundleKey);

            handleSkippable(changeBundle, thisBundleKey);

            T.isFunctionCallMe(cB);
        }

    };

    var autoSkip = function(thisBundleKey){
        
        setTimeout(function(){ my.skip(thisBundleKey); }, roots.hidingNoticeTimeOff);

    };

    var notSkippable = function(thisBundleKey){
        roots.notices[thisBundleKey].skippable=false;
    };

    var activeInteractive = function(thisBundleKey){
        
        T.toggleClasses(roots.notices[thisBundleKey].icon, true, [roots.fadeClass]);
        T.toggleClasses(roots.notices[thisBundleKey].box, true, ["pointer","grow","grow-sm"]);

    };

    var isSkippable = function(thisBundleKey){

        T.toggleClasses(roots.notices[thisBundleKey].icon, false, [roots.fadeClass]);
        roots.notices[thisBundleKey].skippable=true;

    };

    this.noticeBundles = function(){ return roots; };

    this.activateNotice = function(thisNotice, optionalInitCallback){
        console.log("Notice Activation lookup was: "+ thisNotice);
        console.log(my.findNoticeBundle(thisNotice));
        my.hideRmAnyNotices();
        var thisBundleObjKey = my.findNoticeBundle(thisNotice);
        console.log("Making this active: " + thisBundleObjKey);
        roots.notices[thisBundleObjKey].active=true;
        var noticeBoxIs = T.q(roots.notices[thisBundleObjKey].name);
        if (T.isDef(noticeBoxIs)) {
            console.log("item exists, now dispaly.");
            noticeBoxIs.style.display="";
        }
        multiNoticeRecovery();
        T.isFunctionCallMe(optionalInitCallback);
    };


    this.rmAllNonImportants = function(){
        console.log("Rm only non-importants.");
        for (var notice in roots.notices){
            if (roots.notices[notice].active==true && roots.notices[notice].removable==true){
                roots.notices[notice].active=false;
                cacheClearItem(notice);
            }
        }
    };


    this.hideRmAnyNotices = function(){
        console.log("Hide all, and make non-active notices.");
        for (var notice in roots.notices){
            if (roots.notices[notice].active==true && roots.notices[notice].removable==true){
                roots.notices[notice].active=false;
                cacheClearItem(notice);
            } else if (roots.notices[notice].active==true){
                roots.notices[notice].active=false;
                roots.notices[notice].box.style.display="none";
                 console.log("Item is hidden (important non-removable.");
            }
        }
        if (!roots.callbackCareful2fa){ roots.callbackCareful2fa=true; }
    };


    var importantTypeMatch = function(type){
        var types = roots.importantTypes;
        var foundImportant=false;
        for (var x=0;x<types.length;x++){
            if (type == types[x]){
                foundImportant=true;
            }
        }
        return foundImportant;
    };


    var existingDuplicateAny = function(noticeBundle){
        var duplicateFound={"is":false};
        for (var item in roots.notices){
            if ((noticeBundle.id == roots.notices[item].bundle.id )){
                duplicateFound={"is":true,"item":item};
                console.log("Found duplicate");
            }
        }
        return duplicateFound;
    };


    var importantDuplicate = function(noticeBundle){

        var duplicateFound={"is":false};
        for (var item in roots.notices){
            if ((noticeBundle.id == roots.notices[item].bundle.id ) && roots.notices[item].isImportant){
                duplicateFound={"is":true,"item":item};
                console.log("Found duplicate, activating, and not rebuilding itself");
            } else {
                //cacheClearItem(noticeBundle, item);
            }
        }
        return duplicateFound;
    };


    var cacheClearItem = function(item){
        console.log(roots);
        console.log("Cache Clear on: " + item);

        if (typeof roots.notices[item] !== 'undefined' && T.isDef(T.q(roots.notices[item].name)) && roots.notices[item]!== undefined){
            console.log("Catching Removable item! Hide/RM it.");
            if (!roots.notices[item].isImportant){
                T.q(roots.notices[item].name).remove();
                delete roots.notices[item];
            }
        }
    };


    var preNewNotice = function(noticeBundle){
        
        var newNotice = document.createElement('div');

            newNotice.id = roots.noticeSysId+"_"+noticeBundle.id+"_"+roots.count;
        
            newNotice.classList = roots.noticeClasses + " " + noticeBundle.colour + " " + noticeBundle.location;


            if (noticeBundle.type == "helper"){
                
                T.toggleClasses(newNotice, true, ["flex","pa4"]);
                
                var helperClick = 'NM.rm(\''+roots.count+'\')';
                
                newNotice.setAttribute("onclick", helperClick);

            } else if (noticeBundle.type == "static") {

                T.toggleClasses(newNotice, true, ["flex","pa4"]);
                
                var skipClick = 'NM.skip(\''+roots.count+'\')';
                
                newNotice.setAttribute("onclick", skipClick);

            }


            newNotice.style.display="none";

        return newNotice;

    };


    this.rm = function(incoming){
        console.log("rm me.");

        if (typeof roots.notices[incoming] !== 'undefined' && !roots.notices[incoming].isImportant){
        
            cacheClearItem(incoming);
            multiNoticeRecovery();
        
        }
    
    };


    this.skip = function(incoming){
        console.log("Button skip me.");

        if (typeof roots.notices[incoming] !== 'undefined' && roots.notices[incoming].skippable && !roots.notices[incoming].beLinkNow){
            
            console.log("Item was skippable");

            roots.notices[incoming].box.style.display="none";
            notSkippable(incoming);

        } else if (roots.notices[incoming].beLinkNow) {
           
            console.log("Going to link now");
            window.location.href = roots.notices[incoming].linkIs;

        }

    };


    var entryBuilder = function(noticeBundle){
        
        var build = '<div class="'+roots.noticeIconClasses+'">'+noticeBundle.icon+'</div>';
            
            build += '<div id="'+noticeBundle.id+'" class="'+roots.noticeBodyClasses+' '+noticeBundle.txtClass+'">';

            build += (typeof noticeBundle.text!=='undefined'?noticeBundle.text:"")+'</div>';

        return build;

    };


    var noticeBeginSwitch = function(noticeBundle,returnFor){

        var setCurrent = function(currentBundleObj){
            roots.notices[roots.count] = currentBundleObj;
        };

        var noticeAssignment = function(isAciveOrNot, isRemovable, isImportant){
            return {
                "name":returnFor.newNotice.id,
                "active":isAciveOrNot,
                "bundle":noticeBundle,
                "removable":isRemovable,
                "isImportant":isImportant,
                "skippable":false,
                "beLinkNow":false
            };
        };

        switch(noticeBundle.type){

            case "helper":
                setCurrent(noticeAssignment(true, true, false));
                return helperNotice(returnFor,true);

            case "static":
                setCurrent(noticeAssignment(true, true, false));
                return helperNotice(returnFor,false);

        }

    };


    var parseBundleElements = function(count){

        roots.notices[count].box = T.q(roots.notices[count].name);

        roots.notices[count].icon = roots.notices[count].box.querySelectorAll(".noticeIcon")[0];

        roots.notices[count].main = T.q(roots.notices[count].bundle.id);

        roots.notices[count].uploadBar = T.q(roots.notices[count].bundle.uploadBar);


    };


    var handleFadeOpt = function(count, noticeBundle) {

        if (typeof noticeBundle.fade !== 'undefined' && noticeBundle.fade){
            
            roots.notices[count].icon.classList.add(roots.fadeClass);
        
        } else {
        
            roots.notices[count].icon.classList.remove(roots.fadeClass);
        
        }

    };


    var helperNotice = function(o, withAutoFade){
        console.log("Notice type is : Hiding");
        var c = roots.count;
        o.newNotice.innerHTML = o.build;
        document.body.appendChild(o.newNotice);
        o.newNotice.style.display="";
        parseBundleElements(c);
        
        activeInteractive(c);
        handleFadeOpt(c, o.noticeBundle);

        if (withAutoFade){
            setTimeout(function(){
                multiNoticeRecovery();
                cacheClearItem(o.count);
            },roots.hidingNoticeTimeOff);
        }

        o.cB();
        roots.count++;
    };
    

    var multiNoticeRecovery = function(){

        var anyActiveNotices = existingActiveNotice();
        if (checkImportanceFromMultipleItems(anyActiveNotices)){
            multiNoticeDim(anyActiveNotices,false);
        }

    };


    this.findNoticeIcon = function(innerNameId){

        var thisCount = my.findNoticeBundle(innerNameId);
        return roots.notices[thisCount].icon;

    };


    this.findNoticeBundle= function(innerNameId){

        for (var count in roots.notices){
            if (roots.notices[count].bundle.id == innerNameId){
                return count;
            }
        }

    };
    

    var findNoticeName = function(idToFind){

        for (var count in roots.notices){
            if (roots.notices[count].name == idToFind){
                return count;
            }
        }

    };


}




function NTools(){

    this.q = function(key){ return document.querySelector("#"+key); };

    this.isFunctionCallMe = function(incoming){
        console.log("Optional function attempting to run it.");
        if (typeof incoming !== 'undefined' && typeof incoming === 'function'){
            console.log("Function valid, calling it now.");
            incoming();
        }
    };

    this.isDef = function(incoming){
        if (typeof incoming !== 'undefined' && incoming !== null){ return true; } else return false;
    };

    this.classesOnOff = function(itemEntity,toAddArray,toRemoveArray){
        my.toggleClasses(itemEntity,false,toRemoveArray);
        my.toggleClasses(itemEntity,true,toAddArray);
    };
    
    this.toggleClasses = function(itemEntity,toAdd,arrayOfNames){
        for(var x=0;x<arrayOfNames.length;x++){
            if (toAdd){
                itemEntity.classList.add(arrayOfNames[x]);
            } else {
                itemEntity.classList.remove(arrayOfNames[x]);
            }
        }
    };
    this.watchEvents = function(entry){
        for (var x=0;x<entry.e.length;x++){
            entry.id.addEventListener(entry.e[x], entry.res);
        }
    };
}