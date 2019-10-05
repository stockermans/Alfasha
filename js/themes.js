function ThemeSwitcher(){
    var my = this;
    var here = "light";
    var isWatch=false;
    var T = Object.create(new Tools());
    this.is = function(){
        if (!isWatch){
            console.log("Themes: o");
            T.q("rightTime").addEventListener('click',function(){
                if (here == "light"){
                    here = "dark";
                    T.q("alfaStyle").href = "css/allDark.css";
                } else {
                    here = "light";
                    T.q("alfaStyle").href = "css/allLight.css";
                }
            });
        }
    };
}
