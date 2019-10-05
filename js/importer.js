function Importer(){
    var my = this;
    var MAX_OP_INTEGER = 100;
    var MIN_OP_INTEGER = -100;
    var handlerBuilt = false;
    var T = Object.create(new Tools());
    var NT = new NTools();
    var hasActivateStar = true, hasActivatePlus=true;

    var opThatIsAvailable = ["+","*"];
    var ops = "1+"; // . is filter between commands.
    var p = {
        watchersExist:false, isActive:false, justLogged:"",buildImporter:true,buildHelp:true,
        map: {

            "Info": {
                "btn":["infoAll","?"],
                "active":false
            },

            "Main": {
                "btn": ["mainScreen","Play"],
                "active":true
            },
            
            "Import": {
                "btn":["importOps","Import Ops"],
                "active":false
            },     
            
            "Export": {
                "btn":["exportOps","Export Ops"],
                "active":false
            },
            
            "Random": {
                "btn": ["randomOps","Randomize"],
                "active":true
            }

        }
    };
    var mySetting = function(){
        for (var key in p.map){
            if (p.map[key].active){
                return [true,key, ops];
            }
        }
        return [false,"",""];
    };
    this.init = function(){
        console.log("Importer: o");
        T.q("randomOps").click();
        T.q("randomOps").classList.remove("activated");
        T.q("mainScreen").classList.add("activated");
    };
    this.getOps = function(){
        return ops;
    };
    this.myBtns = function(){
        var b = "";
        for (var key in p.map){
            b += T.idBtn(p.map[key].btn[0],p.map[key].btn[1],"");
        }
        return b;
    };
    this.builtCb = function(){
        if (!p.watchersExist){
            for (var key in p.map ){
                T.q(p.map[key].btn[0]).ImporterMap = key;
                T.q(p.map[key].btn[0]).addEventListener('click',importerEvent);
            }
        }
    };
    this.resetAll = function(){
      // handleActivated();
    };
    var importerEvent = function(event){
        var thisTarget = event.target.ImporterMap;
        var shouldDisp = function(isDisp){
            var should = T.isDef(T.q("rightTime"))? T.q("rightTime").style.display= (isDisp?"":"none"): "";
        };

        if (p.justLogged !== thisTarget){
            p.justLogged = thisTarget;
            console.log("Importer Select: " + thisTarget);
        }

        if (thisTarget== "Main"){
            T.q("exporterBody").classList.add("dn");

            T.q("importsBody").style.display="none";
            T.q("helpBody").style.display="none";
            T.q("mainBodyBox").style.display="";

        } else if (thisTarget == "Random"){
            T.q("exporterBody").classList.add("dn");

            T.q("importsBody").style.display="none";
            T.q("mainBodyBox").style.display="";

            newRandomOps();

        } else if (thisTarget == "Import"){
            
            T.q("exporterBody").classList.add("dn");

            //shouldDisp(false);
            T.q("mainBodyBox").style.display="none";
            T.fadeOff(T.q("importsBody"),true);
            T.q("helpBody").style.display="none";
            importShow();
            //importAsTextShow();

        } else if (thisTarget == "Export"){

            T.q("importsBody").style.display="none";
            T.q("helpBody").style.display="none";
            T.q("mainBodyBox").style.display="none";
            exportShow();

        } else if (thisTarget == "Info"){
            T.q("exporterBody").classList.add("dn");

            T.q("importsBody").style.display="none";
            T.q("mainBodyBox").style.display="none";
            helpShow();
        }
    


        if (!p.isActive){
            p.isActive=true;
            if (thisTarget=="Random"){ thisTarget = "Main"; }
            handleActivated(thisTarget);
            p.isActive=false;
        }
    };

    this.activateStar = function(){

        if (T.q("starImporter").classList.contains("activated")){
            T.q("starImporter").classList.remove("activated");
            hasActivateStar=false;
        } else {
            T.q("starImporter").classList.add("activated");
            hasActivateStar=true;
        }
        console.log(hasActivateStar);
        console.log(hasActivatePlus);

        if (!hasActivatePlus && !hasActivateStar) { requiresSelectionMsg(); }

    };

    this.activatePlus = function(){

        if (T.q("plusImporter").classList.contains("activated")){
            T.q("plusImporter").classList.remove("activated");
            hasActivatePlus=false;
        } else {
            T.q("plusImporter").classList.add("activated");
            hasActivatePlus=true;
        }

        if (!hasActivatePlus && !hasActivateStar) {
            console.log("Totaly false");
            requiresSelectionMsg();

        }
    };
    
    var requiresSelectionMsg = function(){
         var noticeBundle = {

                    id: "helperIncompleteTxt",
                    icon: "&#x265E;",
                    location: "bottom-1 right-1",
                    txtClass: "imcompTxt",
                    text: "Imcomplete, must select a setting config",
                    colour: "bg-washed-red",
                    type: "helper",
                    fade: true,
                    skippable: false

                };

        NM.makeNotice(noticeBundle,function(){


        });
    };

    var exportSettings = function(){
        var getISetting = mySetting();
        var settings = '<div class="checkMarks">'+getISetting[2]+'</div>';


            var lV = '<h1 class="pb3 light-blue f3 fw1 mt0 lh-title">Export Operations</h1>';
                lV += '<ul class="list pl0 ml0 measure br3 ">';
                
                    lV += '<li class="ph3 pv3 br3 word-break pa2 mv2 f6 b--black-10 bg-light-gray black">';

                        lV += settings;

                    lV += '</li>';
                lV += '</ul>';

            return lV;
    };

    var importSettings = function(){
            
            var lV = '<h1 class="pb3 light-blue f3 fw1 mt0 lh-title">Import Settings</h1>';
                lV += '<ul class="list pl0 ml0 measure br3 ">';
                
                    lV += '<li class="ph3 pv3 br3 word-break pa2 mv2 f6 b--black-10 bg-light-gray black">';


                            lV += '<div class="dib w-100 pt3">';
                                lV += '<a id="plusImporter" onclick="controller.Importer().activatePlus()" class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 mh2 activated">+</a>';
                                lV += '<a id="starImporter" onclick="controller.Importer().activateStar()" class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 mh2 activated">*</a>';
                            lV += '</div>';

                            lV += '<div class="dib w-100 pt3">';
                                lV += '<a class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 mh2">7</a>';
                                lV += '<a class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 mh2">3</a>';
                                lV += '<a class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 mh2">9</a>';
                                lV += '<a class="pointer f6 link dim br3 ba b--black-10 ph3 pv2 mb2 dib black-60 mh2">0</a>';
                            lV += '</div>';




                            lV += '<div class="dib w-100 pt2">';
                                lV += '<div onclick="controller.Importer().viewDefs()" class="pv1 black-30 dim i pl2 pointer ">View definitions</div>';
                            lV += '</div>';

                    lV += '</li>';
                
                    lV += '<li id="importSettingsDef" class="mt3 dn ph3 pv3 br3 word-break pa2 f6 b--black-10 bg-light-gray black">';

                            lV += '<div class="dib w-100 pt2">';
                                lV += '<div class="pl2 pv1 black-70 dim ">7 <span class="black-30 pl3"> + flip to - on </span></div>';
                                lV += '<div class="pl2 pv1 black-70 dim ">3 <span class="black-30 pl3">Ignore flip every </span> </div>';
                            lV += '</div>';

                            lV += '<div class="dib w-100 pt3">';
                                lV += '<div class="pl2 pv1 dim black-70">9 <span class="black-30 pl3">* Potency on</span></div>';
                                lV += '<div class="pl2 pv1 dim black-70">0 <span class="black-30 pl3">Ignore flip every</span></div>';
                            lV += '</div>';

                    lV += '</li>';

            return lV;

    };

    this.viewDefs = function(){
        console.log("Viewing defs");

        if (T.q("importSettingsDef").classList.contains("dn")){
            T.q("importSettingsDef").classList.remove("dn");
        } else {
            T.q("importSettingsDef").classList.add("dn");
        }

    };

    var importShow = function(){

        if (p.buildImporter){

            var textImporting = '<div class="pt4"><textarea id="textImportingInput" class="measure-wide black-60 br3 pa4 ph3 mainInput faBox inputs f5" type="textarea" rows="4" placeholder="Texts to Import as Operations"></textarea>';
            var textImportingBtn = '<div id="importTextOperationsBox" class="measure fullBtnBox " style="height: auto; opacity: 1;"><button id="importTextNowBtn" class="ph5 btn fullBtn activated">Text to Operations</button></div></div>';

            var inputShow = '<textarea id="importingInput" class="black-60 measure pa4 br3 ph3 mainInput faBox inputs f5" type="text" rows="2" placeholder="(Advanced) Operations to Import"></textarea>';
            var btnShow = '<div id="importOperationsBox" class="measure-narrow fullBtnBox" style="height: auto; opacity: 1;"><button id="importNowBtn" class="btn fullBtn activated">Exact Operations</button></div>';
            var opImportings = '<div class="pt4 pb4">'+inputShow + btnShow + '</div>';

            var imgsPlace = '<textarea id="importingInput" class="mt4 black-60 measure pa4 br3 ph3 mainInput faBox inputs f5" type="text" rows="2" placeholder="Drop Files to become Operations"></textarea>';
            var imgsAsOps = '<div id="importOperationsBox" class=" measure-narrow fullBtnBox" style="height: auto; opacity: 1;"><button id="importNowBtn" class="btn fullBtn activated">Files to Operations</button></div>';

            T.q("importsBody").innerHTML = importSettings() + textImporting + textImportingBtn + imgsPlace+imgsAsOps + opImportings;

            watchImporter();
            watchTextImporter();
            p.buildImporter = false;

        }

        T.fadeOn(T.q("importsBody"));

    };


    var watchTextImporter = function(){
        T.q("importTextNowBtn").addEventListener('click',function(){
            var thisCharString = T.stringArrToCharCodeArr(T.q("textImportingInput").value);
            console.log(thisCharString);
            var rebuildAsOps=[];
            for (var x=0;x<thisCharString.length;x++){
               rebuildAsOps.push(thisCharString[x]+"+"+T.Ops.OP_FILTER);
            }
            ops = T.stringJoin(rebuildAsOps);
            updateSetting();
            T.q("textImportingInput").value = "";
        });
    };
    var watchImporter = function(){
        T.q("importNowBtn").addEventListener('click',function(){
            ops = T.q("importingInput").value;
            updateSetting();
            T.q("importingInput").value = "";
        });
    };
    var helpShow = function(){
        console.log("Shwing help");
        if (p.buildHelp){
            console.log("Building hlep");
            
            var list = '<h1 class="pb3 light-blue f3 fw1 mt0 lh-title">Alfasha Information</h1>';
                list += '<ul class="list pl0 ml0 measure br3">';
                
                var lV = '<li class="ph3 pv3 br3 word-break pa2 mv2 f6 b--black-10 bg-light-gray black">';

                            lV += '<div class="dib w-100 pt3">';
                                lV += '<span class="linkActualAccount dim  black-30">Release (0,9)</span>'; //
                                lV += '<span class="fr black-30">03/04/05</span>';
                            lV += '</div>';

                            lV += '<div class="dib w-100 pt3">';
                                lV += '<div class="pv1 black-30 dim ">Operations (3 of Z)</div>';
                            lV += '</div>';

                            lV += '<div class="dib w-100 pt3">';
                                lV += '<div class="pv1 black-30 dim ">Creator (Michael Stok&#232;rmans)</div>';
                            lV += '</div>';

                            lV += '<div class="dib w-100 pt3">';
                                lV += '<div class="pv1 dim black-30">Progress</div>';
                            lV += '</div>';

                        lV += '<div style="width:70%;" class="mt2 mb2 orderProgress bg-animate h1 br3 bg-light-blue"></div>';

                    lV += '</li>';

              list += lV;

            T.q("helpBody").innerHTML = list;
            p.buildHelp = false;
        }
        T.fadeOn(T.q("helpBody"));
    };

    var exportShow = function(){
       var getISetting = mySetting();
        var b = '<div class="checkMarks">'+getISetting[2]+'</div>';

        T.q("exporterBody").innerHTML = exportSettings();
        T.q("exporterBody").classList.remove("dn");
    };

    var handleActivated = function(activateTarget){
        for (var key in p.map){
            if (key !== activateTarget){
                T.q(p.map[key].btn[0]).classList.remove("activated");
                p.map[key].active=false;
                //updateSetting();
            } else {
                T.q(p.map[activateTarget].btn[0]).classList.add("activated");
                p.map[key].active=true;
                //updateSetting();
            }
        }
    };
    var newRandomOps = function(){
        var newSize = T.randomIntBetween(0, MAX_OP_INTEGER);
        var newOpsRewrite = [];
        for (var z=0;z<newSize;z++){
            newOpsRewrite.push(T.randomIntBetween(MIN_OP_INTEGER, MAX_OP_INTEGER)+opThatIsAvailable[Math.floor((Math.random() * 2))]+T.Ops.OP_FILTER);
        }
        ops = T.stringJoin(newOpsRewrite);
        console.log("New Random Size " + newSize);
        updateSetting();
    };
    var updateSetting = function(){
        if (!handlerBuilt) { buildHandler(); }
        var getISetting = mySetting();
        var b = '<div class="checkMarks">'+getISetting[2]+'</div>';

        NM.noticeChanger({
            id: "alfaHandler",
            icon: "",
            text: '<div>'+b+'</div><div class="dn">Alfasha</div>'//'<div>Welcome to alfa centauri</div>'
        });

    };
    var buildHandler = function(){
         var noticeBundle = {

                    id: "alfaHandler",
                    icon: "",
                    location: "bottom-1 right-1",
                    txtClass: "notifyWelcomeClass",
                    colour: "bg-washed-green",
                    type: "static",
                    fade: false,
                    text: '<div></div><div>Alfasha</div>',
                    skippable: false

                };

        NM.makeNotice(noticeBundle,function(){

          NT.watchEvents({id: T.q("alfaHandler").parentElement, e: ["click"], res: handlerToggler});

        });
    };

    var handlerToggler = function(){
        console.log("HAnlder");
        if (T.q("alfaHandler").childNodes[1].classList.contains("dn")){
            console.log("I contained ");
            T.q("alfaHandler").childNodes[1].classList.remove("dn");   
            T.q("alfaHandler").childNodes[0].classList.add("dn");   
        } else {
            T.q("alfaHandler").childNodes[1].classList.add("dn");
            T.q("alfaHandler").childNodes[0].classList.remove("dn");   
        }
    };


}
