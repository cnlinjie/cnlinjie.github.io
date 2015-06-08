(function() {
    var getOffset = function(ele) {
        var t = 0, l = 0;
        while (ele.offsetParent) {
            t += ele.offsetTop;
            l += ele.offsetLeft;
            ele = ele.offsetParent;
        }
        return {
            top: t,
            left: l
        };
    }
    var onScroll = function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop >= offsetTop) {
            elTocWidget.style.position = 'fixed';
            elTocWidget.style.top = '10px';
            elTocWidget.style.width = 'inherit';
        } else {
            elTocWidget.style.position = 'static';
        }
    };
    var elToc = document.querySelector(".toc");
    if (!elToc) return;
    var elTocWidget = document.querySelector(".widget-toc");
    var elContainer = elTocWidget.querySelector(".container");
    elContainer.appendChild(elToc.cloneNode(true));
    elTocWidget.style.display = "block";
    var offsetTop = getOffset(elTocWidget).top;
    if (document.addEventListener) {
        document.addEventListener("scroll", onScroll);
    }
})();
