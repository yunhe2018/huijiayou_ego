var cdn_path = "";
//输出静态文件 [[css列表],[js列表]]
function WriteStatic(staticlist) {
    for (var i = 0; i < staticlist[0].length; i++) {
        document.write('<link rel="stylesheet" type="text/css" href="' + cdn_path + staticlist[0][i] + '?v=' + new Date().getTime() + '">');
    }
    for (var i = 0; i < staticlist[1].length; i++) {
        document.write('<scri' + 'pt type="text/javascript" src="' + cdn_path + staticlist[1][i] + '?v=' + new Date().getTime() + '"></scr' + 'ipt>');
        //document.write('<scri' + 'pt type="text/javascript" src="' + cdn_path + staticlist[1][i] + '"></scr' + 'ipt>');
    }
}
function AppendStatic(staticlist, callBack) {
    for (var i = 0; i < staticlist[0].length; i++) {
        var style = document.createElement("link");
        style.type = "text/css";
        style.rel = "stylesheet";
        style.href = cdn_path + staticlist[0][i] + '?v=' + new Date().getTime();

        var l = document.getElementsByTagName("link").length;
        var g = document.getElementsByTagName("link")[l - 1];
        g.parentNode.insertBefore(style, g);
    }
    var loadCount = 0;
    for (var i = 0; i < staticlist[1].length; i++) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = cdn_path + staticlist[1][i] + '?v=' + new Date().getTime();
        document.body.appendChild(script);
        script.onload = script.onreadystatechange = function () {
            if (this.readyState != undefined) {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    ++loadCount;
                    this.onload = this.onreadystatechange = null;
                }
            }
            else {
                ++loadCount;
                this.onload = this.onreadystatechange = null;
            }
            if (loadCount == staticlist[1].length && typeof (callBack) == "function") {
                callBack();
            };
        };
    }
}