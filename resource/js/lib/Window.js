if (!window.Wind) {
    window.Wind = {
        UI: {}
    }
}

Wind.UI.Window = function () {
    var p = arguments[0] || {};
    this.itemCount = 0;
    this.width = p["width"] || 400;
    this.height = p["height"] || 300;
    this.left = p["left"];
    this.top = p["top"];
    this.__calcShape({ "width": this.width, "height": this.height }); //如果宽和高是百分比，则换算成像素值
    this.title = p["title"] || "&nbsp;";
    this.img = p["img"];
    this.isreflashable = p["isreflashable"] || false;
    this.ismaxable = p["ismaxable"] ? true : p["ismaxable"];
    this.isshowclose = p["isshowclose"] ? true : p["isshowclose"];
    this.isresizeable = p["isresizeable"] || false;
    this.isdragable = p["isdragable"] ? true : p["isdragable"];
    this.ismask = p["ismask"] || false;
    if (this.ismask) {
        this.ismaxable = this.isresizeable = false;
    }
    this.data = p["data"];
    this.mode = p["mode"];
    this.url = p["url"];
    this.isscroll = p["isscroll"] ? true : p["isscroll"];
    this.imagePath = p["imagePath"]; //图片素材地址
    this.onclose = p["onclose"];

    this.frame = document.createElement("div"); //框架
    this.container = document.createElement("div"); //内容容器
    this.rzproxy = document.createElement("div"); //拉伸panel时出现的虚线框层

    //拖拽和缩放
    this.iDiffX = 0;
    this.iDiffY = 0;
    this.lastWidth = 0;
    this.lastHeight = 0;
    this.cWidth = 0;
    this.cHeight = 0;

    //缩放的最小宽高限制
    this.maxWidth = 200;
    this.maxHeight = 200;

    this.index = Wind.UI.Window.index;
    Wind.UI.Window.index++;
};
Wind.UI.Window.index = 0;
Wind.UI.Window.prototype = {
    //渲染html
    __render: function () {
        if (this.isFirstLoad) {
            if (!document.getElementById("jcorewindowpanel_" + this.index)) {
                var div = document.createElement("div");
                div.id = "jcorewindowpanel_" + this.index;
                document.body.appendChild(div);
            }
            if (this.isresizeable || this.isdragable)
                document.getElementById("jcorewindowpanel_" + this.index).innerHTML = this.__getframeHTML() + this.__getproxyHTML();
            else
                document.getElementById("jcorewindowpanel_" + this.index).innerHTML = this.__getframeHTML();

            this.__setproxystyle(); //初始化遮罩层的宽高度
            this.__setcontainerstyle(); //初始化内容容器的宽高度
            this.__setframestyle(); //初始化外框
            this.loadData(this.data); //加载数据到容器
            this.__bindEvent(); //绑定事件
        }
    },
    //关闭panel
    close: function () {
        if (document.getElementById(this.frame.id)) {
            document.getElementById(this.frame.id).style.display = "none";
        }
        if (this.ismask) {
            Utils.Mask.unloadMask();
        }
        Utils.event.cancelEventBubble(Utils.event.getEvent());
    },
    //打开panel
    show: function () {
        if (this.isFirstLoad == undefined)
            this.isFirstLoad = true; //表示是第一次加载
        else
            this.isFirstLoad = false;
        this.__render();
        if (this.ismask)
            Utils.Mask.loadMask();
        document.getElementById(this.frame.id).style.display = "block";
    },
    dispose: function () {
        document.body.removeChild(document.getElementById("jcorewindowpanel_" + this.index));
    },
    //最大化/还原
    __max: function () {
        if (document.getElementById("tool_max_" + this.index).className == "tool tool-max") {
            document.getElementById("tool_max_" + this.index).className = "tool tool-recover";
            this.lastWidth2 = document.getElementById(this.container.id).offsetWidth;
            this.lastHeight2 = document.getElementById(this.container.id).offsetHeight;
            this.setStyle(document.documentElement.scrollWidth - 2, document.documentElement.clientHeight - 40);
            document.getElementById(this.frame.id).style.left = "0px";
            document.getElementById(this.frame.id).style.top = "0px";
        }
        else {
            document.getElementById("tool_max_" + this.index).className = "tool tool-max";
            this.setStyle(this.lastWidth2, this.lastHeight2);
            document.getElementById(this.frame.id).style.left = this.left + "px";
            document.getElementById(this.frame.id).style.top = this.top + "px";
        }
        Utils.event.cancelEventBubble(Utils.event.getEvent());
    },
    //刷新
    __reflash: function () {
        this.loadData(this.data);
        Utils.event.cancelEventBubble(Utils.event.getEvent());
    },
    //重置panel的宽和高
    setStyle: function (width, height) {
        var p = { "width": width, "height": height };
        this.__calcShape(p);

        document.getElementById(this.frame.id).style.width = this.width + "px";
        this.__setcontainerstyle();
        this.__setproxystyle();
    },
    //加载内容
    loadData: function () {
        if (this.mode == "iframe") {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("frameBorder", "0");
            iframe.setAttribute("src", this.url);
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "100%");
            if (navigator.userAgent.hasSubString("MSIE")) {
                var loading = document.createElement("img");
                loading.src = this.imagePath + "shared/blue-loading.gif";
                document.getElementById(this.container.id).appendChild(loading);
                iframe.style.display = "none";
                iframe.onreadystatechange = function () {
                    if (this.readyState == "complete") {
                        this.style.display = "block";
                        loading.style.display = "none";
                    }
                };
            }
            document.getElementById(this.container.id).appendChild(iframe);
            return;
        }
        var p = arguments[0];
        if (p) {
            if (typeof p == "string") {
                document.getElementById(this.container.id).innerHTML = p;
            }
            else {
                for (var i = 0; i < p.length; i++) {
                    var div = document.createElement("div");
                    div.id = this.container.id + "_" + this.itemCount;
                    document.getElementById(this.container.id).appendChild(div);
                    if (p[i].__render && p[i].__bindEvent) {
                        p[i].__render(div.id);
                        p[i].__bindEvent();
                    }
                    else {
                        p[i].style.display = "block";
                        div.appendChild(p[i]);
                    }
                    this.__resetContainer();
                    this.itemCount++;
                }
            }
        }
    },
    __moveframe: function () {
        var oEvent = Utils.event.getEvent();
        this.left = oEvent.clientX - this.iDiffX;
        this.top = oEvent.clientY - this.iDiffY;
        if (this.left > 0 && this.left < document.documentElement.scrollWidth - this.width)
            document.getElementById(this.rzproxy.id).style.left = this.left + "px";
        if (this.top > 0)
            document.getElementById(this.rzproxy.id).style.top = this.top + "px";
    },
    __downframe: function () {
        var oEvent = Utils.event.getEvent();
        this.iDiffX = oEvent.clientX - document.getElementById(this.frame.id).offsetLeft;
        this.iDiffY = oEvent.clientY - document.getElementById(this.frame.id).offsetTop;
        document.getElementById(this.frame.id).style.display = "none";
        document.getElementById(this.rzproxy.id).style.display = "block";
        document.getElementById(this.rzproxy.id).style.width = this.width + "px";
        document.getElementById(this.rzproxy.id).style.height = this.height + "px";
        document.getElementById(this.rzproxy.id).style.left = this.left + "px";
        document.getElementById(this.rzproxy.id).style.top = this.top + "px";
        Utils.event.addEventHandler(document, "mousemove", this.move2);
        Utils.event.addEventHandler(document, "mouseup", this.up2);
    },
    __upframe: function () {
        document.getElementById(this.frame.id).style.display = "block";
        if (this.left > 0 && this.left < document.documentElement.scrollWidth - this.width)
            document.getElementById(this.frame.id).style.left = this.left + "px";
        if (this.top > 0)
            document.getElementById(this.frame.id).style.top = this.top + "px";
        document.getElementById(this.rzproxy.id).style.display = "none";
        Utils.event.removeEventHandler(document, "mousemove", this.move2);
        Utils.event.removeEventHandler(document, "mouseup", this.up2);
    },
    __moverzproxy: function () {
        var oEvent = Utils.event.getEvent();
        this.cWidth = oEvent.clientX - Utils.getOffset(document.getElementById(this.frame.id), "left");
        this.cHeight = oEvent.clientY - Utils.getOffset(document.getElementById(this.frame.id), "top");
        if (this.cWidth > this.maxWidth) {
            this.width = this.cWidth;
            document.getElementById(this.rzproxy.id).style.width = this.width + "px";
        }
        if (this.cHeight > this.maxHeight) {
            this.height = this.cHeight;
            document.getElementById(this.rzproxy.id).style.height = this.height + "px";
        }
    },
    __downrzproxy: function () {
        //var oEvent = Utils.event.getEvent();
        this.__setproxystyle();
        this.lastWidth = document.getElementById(this.rzproxy.id).style.width;
        this.lastHeight = document.getElementById(this.rzproxy.id).style.height;
        document.getElementById(this.rzproxy.id).style.display = "block";
        Utils.event.addEventHandler(document, "mousemove", this.move);
        Utils.event.addEventHandler(document, "mouseup", this.up);

    },
    __uprzproxy: function () {
        this.__resetrzproxy();
        document.getElementById(this.rzproxy.id).style.display = "none";

        Utils.event.removeEventHandler(document, "mousemove", this.move);
        Utils.event.removeEventHandler(document, "mouseup", this.up);
    },
    __resetrzproxy: function () {
        var widthChanged = Utils.getPixel(document.getElementById(this.rzproxy.id).style.width) - Utils.getPixel(this.lastWidth);
        var heightChanged = Utils.getPixel(document.getElementById(this.rzproxy.id).style.height) - Utils.getPixel(this.lastHeight);
        if (Utils.getPixel(document.getElementById(this.rzproxy.id).style.width) > this.maxWidth) {
            document.getElementById(this.frame.id).style.width = (Utils.getPixel(document.getElementById(this.frame.id).style.width) + widthChanged) + "px";
            document.getElementById(this.container.id).style.width = (Utils.getPixel(document.getElementById(this.container.id).style.width) + widthChanged) + "px";
        }
        if (Utils.getPixel(document.getElementById(this.rzproxy.id).style.height) > this.maxHeight) {
            document.getElementById(this.container.id).style.height = (Utils.getPixel(document.getElementById(this.container.id).style.height) + heightChanged) + "px";
        }
    },
    __getproxyHTML: function () {
        this.rzproxy.id = "rzproxy_" + this.index;
        this.rzproxy.className = "panel_resizable_proxy";
        this.rzproxy.style.cssText = "z-index: 9007; visibility: visible; display: none;";
        return Utils.getDomHtml(this.rzproxy);
    },
    __getcontainerHTML: function () {
        this.container.id = "container_" + this.index;
        this.container.className = "panel_frame_body";
        return Utils.getDomHtml(this.container);
    },
    __getframeHTML: function () {
        this.frame.id = "frame_" + this.index;
        this.frame.className = "panel_frame";
        this.frame.style.cssText = ("position: absolute; z-index: 9003; visibility: visible; left: 0px; top: 0px; width: {0}px; display: block;").format(this.width);

        var html = new StringBuilder();

        html.append(("<div id='{0}' onselectstart='return false;' class='panel_frame_head'").format("window_move" + this.index));
        if (this.isdragable)
            html.append(" style='cursor:move;'>");
        else
            html.append(" style='cursor:default;'>");
        if (this.img)
            html.append(("<div style='float:left; margin-right:10px;'><img src='{0}' /></div>").format(this.img));
        if (this.isshowclose)
            html.append(("<div class='tool tool-close' id='{0}'>&nbsp;</div>").format("tool_close_" + this.index));
        if (this.ismaxable)
            html.append(("<div class='tool tool-max' id='{0}'>&nbsp;</div>").format("tool_max_" + this.index));
        if (this.isreflashable)
            html.append(("<div class='tool tool-reflash' id='{0}'>&nbsp;</div>").format("tool_reflash_" + this.index));
        html.append(("<span>{0}</span>").format(this.title));
        html.append("</div>");
        html.append(this.__getcontainerHTML());
        if (this.isresizeable)
            html.append(("<div  class='se_resize' id='{0}'></div>").format("resize_southeast_" + this.index));

        this.frame.innerHTML = html.toString();
        html.clear();

        return Utils.getDomHtml(this.frame);
    },
    //绑定事件
    __bindEvent: function () {
        if (this.isshowclose)
            Utils.event.addEventHandler(document.getElementById("tool_close_" + this.index), "mousedown", (function (o) {
                return function () {
                    Utils.event.cancelEventBubble(Utils.event.getEvent());
                    if (o.onclose) {
                        o.onclose();
                    } else {
                        o.close();
                    }
                }
            })(this));
        if (this.ismaxable)
            Utils.event.addEventHandler(document.getElementById("tool_max_" + this.index), "mousedown", (function (o) {
                return function () {
                    o.__max();
                }
            })(this));
        if (this.isreflashable)
            Utils.event.addEventHandler(document.getElementById("tool_reflash_" + this.index), "mousedown", (function (o) { return function () { o.__reflash(); } })(this));
        if (this.isresizeable) {
            this.move = (function (o) {
                return function () {
                    o.__moverzproxy();
                }
            })(this);
            this.up = (function (o) {
                return function () {
                    o.__uprzproxy();
                }
            })(this);
            this.down = (function (o) {
                return function () {
                    o.__downrzproxy();
                }
            })(this);
            Utils.event.addEventHandler(document.getElementById("resize_southeast_" + this.index), "mousedown", this.down);
        }
        if (this.isdragable) {
            this.move2 = (function (o) {
                return function () {
                    o.__moveframe();
                }
            })(this);
            this.up2 = (function (o) {
                return function () {
                    o.__upframe();
                }
            })(this);
            this.down2 = (function (o) {
                return function () {
                    o.__downframe();
                }
            })(this);
            Utils.event.addEventHandler(document.getElementById("window_move" + this.index), "mousedown", this.down2);
        }
    },
    __setframestyle: function () {
        if (!this.left)
            this.left = (document.body.offsetWidth - document.getElementById(this.frame.id).offsetWidth) / 2;
        if (!this.top)
            this.top = (document.documentElement.scrollTop * 2 + document.documentElement.clientHeight - document.getElementById(this.frame.id).offsetHeight) / 2;
        document.getElementById(this.frame.id).style.left = this.left + "px";
        document.getElementById(this.frame.id).style.top = this.top + "px";
    },
    __setproxystyle: function () {
        if (this.rzproxy.id != "" && document.getElementById(this.rzproxy.id)) {
            document.getElementById(this.rzproxy.id).style.width = document.getElementById(this.frame.id).offsetWidth + "px";
            document.getElementById(this.rzproxy.id).style.height = document.getElementById(this.frame.id).offsetHeight + "px";
            document.getElementById(this.rzproxy.id).style.left = document.getElementById(this.frame.id).style.left;
            document.getElementById(this.rzproxy.id).style.top = document.getElementById(this.frame.id).style.top;
        }
    },
    __setcontainerstyle: function () {
        var pdleft, pdright;
        if (document.getElementById(this.container.id).currentStyle) {
            pdleft = Utils.getPixel(document.getElementById(this.container.id).currentStyle.paddingLeft);
            pdright = Utils.getPixel(document.getElementById(this.container.id).currentStyle.paddingRight);
        }
        if (document.defaultView) {
            pdleft = Utils.getPixel(document.defaultView.getComputedStyle(document.getElementById(this.container.id), null).paddingLeft);
            pdright = Utils.getPixel(document.defaultView.getComputedStyle(document.getElementById(this.container.id), null).paddingRight);
        }
        var css = "width: {0}px; height: {1}px;";
        document.getElementById(this.container.id).style.cssText = (css).format(this.width - pdleft - pdright, this.height);
    },
    __calcShape: function (shape) {
        var width = shape["width"];
        var height = shape["height"];
        var pn = document.body;
        width = "" + width;
        height = "" + height;
        if (width.indexOf("%") > 0) {
            width = pn.offsetWidth * parseInt(width.slice(0, width.indexOf("%"))) / 100;
        }
        if (height.indexOf("%") > 0) {
            height = pn.offsetHeight * parseInt(height.slice(0, height.indexOf("%"))) / 100;
        }
        this.width = width;
        this.height = height;
    },
    __resetContainer: function () {
        var totalItemHeight = document.getElementById(this.container.id + "_" + this.itemCount).offsetTop;
        if (!this.isscroll) {
            if (totalItemHeight > Utils.getPixel(document.getElementById(this.container.id).style.height)) {
                document.getElementById(this.container.id).style.height = totalItemHeight + "px";
            }
        }
        else {
            if (totalItemHeight > Utils.getPixel(document.getElementById(this.container.id).style.height)) {
                document.getElementById(this.container.id).style.overflow = "scroll";
            }
        }
    },
    getData: function () {
        return this.data;
    }
};