


//图片字体随屏宽改变大小
addReady(function () {
    fontSize();
    pageShow();
    scrLoadImg();
});

function addEvent(obj, sEv, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(sEv, fn, false);
    } else {
        obj.attachEvent('on' + sEv, fn);
    }
}

window.onload = window.onresize = window.onscroll = function () {
    fontSize();
    pageShow();
    scrLoadImg();
};

function pageShow() {
    var oBox = document.getElementsByTagName('body')[0];
    var oWap = getClass(oBox, 'wrapper')[0];
    oWap.style.visibility = 'visible';
}

//页面字体大小
function fontSize() {
    document.documentElement.style.fontSize = 25 * (document.documentElement.clientWidth / 640) + 'px';
}
//Ready加载函数
function addReady(fn) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn, false);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == 'complete') {
                fn();
            }
        });
    }

}
/*获取区间随机数*/
function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}
//通过className获取元素
function getClass(oParent, sClass) {
    if (oParent.getElementsByClassName) {
        return oParent.getElementsByClassName(sClass);
    } else {
        // 获取所有子级
        var aTmp = oParent.getElementsByTagName('*');
        var aRes = [];

        for (var i = 0; i < aTmp.length; i++) {
            var arr = aTmp[i].className.split(' ');

            for (var j = 0; j < arr.length; j++) {
                if (arr[j] == sClass) {
                    aRes.push(aTmp[i]);
                }
            }
        }

        return aRes;
    }
}

//获取非行间样式
function getStyle(obj, sName) {
    return (obj.currentStyle || getComputedStyle(obj, false))[sName];
}

//定位
function getPos(obj) {
    var l = 0;
    var t = 0;
    while (obj) {
        l += obj.offsetLeft;
        t += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return { left: l, top: t };
}



//图片懒加载
function scrLoadImg() {
    var aImg = document.getElementsByTagName('img');
    var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollBottom = scrollT + document.documentElement.clientHeight;

    for (var i = 0; i < aImg.length; i++) {
        if (!aImg[i].src && aImg[i].getAttribute('_src') != null) {
            var imgT = getPos(aImg[i]).top;
            var imgH = aImg[0].offsetHeight;
            if (scrollBottom >= imgT - imgH) {
                aImg[i].src = aImg[i].getAttribute('_src');
            }
        }
    }
}

//touch自播无缝焦点图
function s_slider(arg) {
    document.addEventListener('DOMContentLoaded', function () {
        var aBox = document.querySelectorAll(arg);

        for (var i = 0; i < aBox.length; i++) {
            do_slider(aBox[i]);
        }

        function do_slider(oBox) {
            var oUl = oBox.children[0];
            var aLi = oUl.children;
            var aBtn = oBox.querySelectorAll('ol li');
            var timerAotu = null;
            var timer = null;

            oUl.innerHTML += oUl.innerHTML;
            oUl.style.width = document.documentElement.clientWidth * aLi.length + 'px';
            var W = oUl.offsetWidth / 2;
            var translateX = 0;
            var iNow = 0;

            window.addEventListener('resize', next, false);
            window.addEventListener('resize', aLiW, false);

            function aLiW() {
                for (var i = 0; i < aLi.length; i++) {
                    aLi[i].style.width = document.documentElement.clientWidth + 'px';
                }
                oUl.style.width = document.documentElement.clientWidth * aLi.length + 'px';
                W = oUl.offsetWidth / 2;
            }

            oUl.addEventListener('touchstart', function (ev) {
                clearInterval(oUl.timer);
                clearInterval(oUl.timerAotu);
                var dir = '';
                var disX = ev.targetTouches[0].pageX - translateX;
                var downX = ev.targetTouches[0].pageX;
                var downY = ev.targetTouches[0].pageY;
                var downScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                oUl.style.WebkitTransition = 'none';

                function fnMove(ev) {
                    if (dir == '') {
                        if (Math.abs(ev.targetTouches[0].pageX - downX) >= 3) {
                            dir = 'lr';
                        } else if (Math.abs(ev.targetTouches[0].pageY - downY) >= 3) {
                            dir = 'ud'
                        }

                    } else {

                        if (dir == 'lr') {
                            translateX = ev.targetTouches[0].pageX - disX;

                            if (translateX < 0) {
                                oUl.style.WebkitTransform = 'translateX(' + translateX % W + 'px)';
                                oUl.style.MozTransform = 'translateX(' + translateX % W + 'px)'
                            } else {
                                oUl.style.WebkitTransform = 'translateX(' + (translateX % W - W) % W + 'px)';
                                oUl.style.MozTransform = 'translateX(' + (translateX % W - W) % W + 'px)';
                            }

                        } else {
                            var scrollTop = downScrollTop - ev.targetTouches[0].clientY + downY;
                            document.documentElement.scrollTop = scrollTop;
                            document.body.scrollTop = scrollTop;
                        }
                    }
                }

                function fnEnd(ev) {
                    oUl.removeEventListener('touchmove', fnMove, false);
                    oUl.removeEventListener('touchend', fnEnd, false);

                    if (Math.abs(ev.changedTouches[0].pageX - downX) > 10) {
                        if (downX > ev.changedTouches[0].pageX) {
                            iNow++;

                            startMove(oUl, -iNow * document.documentElement.clientWidth);
                            tab();
                        } else {
                            iNow--;
                            startMove(oUl, -iNow * document.documentElement.clientWidth);
                            tab();
                        }
                    } else {
                        startMove(oUl, -iNow * document.documentElement.clientWidth);
                    }
                }
                oUl.addEventListener('touchmove', fnMove, false);
                oUl.addEventListener('touchend', fnEnd, false);
                //ev.preventDefault();

                clearInterval(oUl.timerAotu);
                oUl.timerAotu = setInterval(function () {
                    next();
                }, 3000);
            }, false);

            function tab() {
                for (var i = 0; i < aBtn.length; i++) {
                    aBtn[i].className = '';
                }
                if (iNow > 0) {
                    aBtn[iNow % aBtn.length].className = 'on';
                } else {
                    aBtn[(iNow % aBtn.length + aBtn.length) % aBtn.length].className = 'on';
                }
            }

            function startMove(obj, iTarget) {
                clearInterval(obj.timer);

                obj.timer = setInterval(function () {
                    var iSpeed = (iTarget - translateX) / 5;
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                    translateX += iSpeed;

                    if (translateX < 0) {
                        obj.style.WebkitTransform = 'translateX(' + translateX % W + 'px)';
                        obj.style.MozTransform = 'translateX(' + translateX % W + 'px)';
                    } else {
                        obj.style.WebkitTransform = 'translateX(' + (translateX % W - W) % W + 'px)';
                        obj.style.MozTransform = 'translateX(' + (translateX % W - W) % W + 'px)';
                    }
                }, 30);
            }


            function next() {
                iNow++;
                tab();
                for (var i = 0; i < aBtn.length; i++) {
                    aLi[i].style.width = document.documentElement.clientWidth + 'px';
                    startMove(oUl, -iNow * aLi[i].offsetWidth);

                }
                //alert(aLi[0].offsetWidth)
            };

            clearInterval(timerAotu);
            oUl.timerAotu = setInterval(function () {
                next();
            }, 4500)
        }
    }, false);
}



//滚动加载——福利列表
function listLoading(id, boxId, dlLength, innerCon) {
    var oBox = document.getElementById(id);
    var oDlBox = getClass(oBox, boxId)[0];
    var oBtn = getClass(oBox, 'loadMore')[0];
    var pageNum = parseInt(dlLength / 8);
    var pageM = dlLength % 8;
    var oBk = getClass(oBox, 'bk_10')[0];

    if (dlLength < 8) {
        creatDl(pageM);
        oBtn.style.display = 'none';
    } else if (dlLength == 8) {
        creatDl(8);
        oBtn.style.display = 'none';
    } else {
        creatDl(8);
        oBtn.style.display = 'block';
    }

    var now = 1;
    var oDlHeight = oDlBox.getElementsByTagName('dl')[0].offsetHeight;

    oBtn.addEventListener('touchstart', function () {
        now++;

        dlLength = dlLength - 8;

        if (dlLength < 8 && dlLength > 0) {
            creatDl(pageM);
            oBtn.style.display = 'none';
        } else if (dlLength == 8) {
            oBtn.style.display = 'none';
        }

        if (now <= pageNum) {
            creatDl(8);

        }

    }, false);


    function creatDl(n) {
        for (var i = 0; i < n; i++) {
            var oDl = document.createElement('dl');
            oDl.innerHTML = innerCon;
            oDlBox.insertBefore(oDl, oBk);
        }
    }
}

