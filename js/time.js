
function Time(){
    var T = Object.create(new Tools());
    var my = true, log=true, are=false;
    var tt, s="&#x263C;",m="&#x263E;",
        s0 = '<span class="opDisp">', s00 = '</span>';
    this.is = function(the){
        if (the && my)
            t(the);
            my = !my;
    };
    var t = function(the){
        tt = the ? one() : 1;
        setTimeout(function(){ t(the); },999);
    };

    var one = function(){
        tt = (Date.now()).toString();
        log = log ? console.log("Time: o") : false;
        var slipping = [tt.slice(0,-4), tt.slice(9,-3)];
        T.q("rightTime").innerHTML = slipping[0] + s0 + slipping[1] + s00 + (are ? m : s);
    };
}
