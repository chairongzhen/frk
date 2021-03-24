Wind.UI.Datalist2 = function () {
    var p = arguments[0] || {};
    this.lockheaders = p["lockheaders"]; //锁定表头结构
    this.unlockheaders = p["unlockheaders"]; //不锁定表头结构
    this.renderTo = p["renderTo"];
    this.width = "100%";
    this.height = this.__formatWHCssText(p["height"]);
    this.onclickEvent = p["click"]; //单击事件
    this.ondblclickEvent = p["dblclick"]; //双击事件
    this.onclickHeaderEvent = p["clickHeader"]; //自定义排序
    this.sortedHandler = p["sortedHandler"]; //排序结束后的客户端回调
    this.isClickSelect = p["isClickSelect"] == undefined || p["isClickSelect"]; //单击选择行
    this.isMouseoverSelect = p["isMouseoverSelect"] == undefined || p["isMouseoverSelect"]; //鼠标划过
    this.pageSetting = p["pageSetting"]; //翻页设置
    this.imagePath = p["imagePath"];
    this.isEnableAlternating = p["isEnableAlternating"] == undefined || p["isEnableAlternating"]; //是否支持隔行变色
    this.lockWidth = this.__formatWHCssText(p["lockWidth"]);
    this.unlockWidth = this.__formatWHCssText(p["unlockWidth"]);
    this.emptyText = p["emptyText"] || "无数据!"
    this.isShowHeader = p["isShowHeader"] == undefined || p["isShowHeader"]; //是否显示表头

    //DOM对象ID列表
    this.leftHead = this.renderTo + "_lockheaders";
    this.rightHead = this.renderTo + "_unlockheaders";
    this.leftBody = this.renderTo + "_lockbody";
    this.rightBody = this.renderTo + "_unlockbody";
    this.left = this.renderTo + "_left";
    this.lockheaderstable = this.renderTo + "_lockheaderstable";
    this.unlockheaderstable = this.renderTo + "_unlockheaderstable";
    this.normalheaderstable = this.renderTo + "_normalheaderstable";
    this.lockheadersbody = this.renderTo + "_lockheadersbody";
    this.unlockheadersbody = this.renderTo + "_unlockheadersbody";
    this.normalheadersbody = this.renderTo + "_normalheadersbody";
    this.topright = this.renderTo + "_topright";

    this.lockHeadersInfo = [];
    this.unlockHeadersInfo = [];
    this.normalHeadersInfo = [];

    if (this.lockheaders) {
        if (!this.__isMultiHeaders(this.lockheaders)) {
            this.__resetHeaders(this.lockheaders);
            this.lockheaders = [this.lockheaders];
        }
    }
    if (this.unlockheaders) {
        if (!this.__isMultiHeaders(this.unlockheaders)) {
            this.__resetHeaders(this.unlockheaders);
            this.unlockheaders = [this.unlockheaders];
        }
    }
};

Wind.UI.Datalist2.prototype = {
    DataBind: function (data, pageSetting) {
        //表格行集合
        this.trs1 = [];
        this.trs2 = [];
        this.currentRowIndex = -1; //当前选定行索引

        this.dataSource = data;

        if (this.isFirstLoad == undefined)
            this.isFirstLoad = true; //表示是第一次加载
        else
            this.isFirstLoad = false;
        this.__render(pageSetting);
        this.__bindEvent();
    },
    appendData: function (data) {
        var startIndex = this.dataSource.length;
        this.dataSource = this.dataSource.concat(data);
        if (this.dataSource && this.dataSource.length) {
            var df1 = document.createDocumentFragment();
            var df2 = document.createDocumentFragment();
            for (var i = startIndex; i < this.dataSource.length; i++) {
                if (this.lockHeadersInfo && this.lockHeadersInfo.length) {
                    df1.appendChild(this.__renderBodys2("lock", this.tb1, i + 1));
                }
                if (this.unlockHeadersInfo && this.unlockHeadersInfo.length) {
                    df2.appendChild(this.__renderBodys2("unlock", this.tb2, i + 1));
                }
            }
            if (this.lockHeadersInfo && this.lockHeadersInfo.length) {
                this.tb1.tBodies[0].appendChild(df1);
            }
            if (this.unlockHeadersInfo && this.unlockHeadersInfo.length) {
                this.tb2.tBodies[0].appendChild(df2);
            }
            this.__setStyle2();
        }
    },
    __render: function (pageSetting) {

        if (this.renderTo) {



            if (this.isFirstLoad) {

                document.getElementById(this.renderTo).style.cssText = ("height:{0}; overflow:hidden; position:relative;").format(this.height) + document.getElementById(this.renderTo).style.cssText;

                var html = new StringBuilder();
                html.append(("<div style='width:{0};'>").format(this.width));
                if (this.lockheaders && this.lockheaders.length) {
                    html.append(("<div id='{0}' style='position:absolute; height:{1}; z-index:3;'>").format(this.left, this.height)); //JavaChu修改border
                    html.append(("<div id='{0}' class='datalist_leftHead' style='position:absolute; z-index:3;'></div>").format(this.leftHead));
                    html.append(("<div id='{0}' class='datalist_leftBody' style='position:absolute; z-index:2;'></div></div>").format(this.leftBody));
                }
                html.append(("<div id='{0}' class='datalist_rightHead' style='z-index:2;position:relative;'></div>").format(this.rightHead));
                html.append(("<div id='{0}' class='datalist_rightBody' style='overflow:auto;'></div>").format(this.rightBody));
                html.append(("<div id='{0}' class='datalist_topright' style='position:absolute; right:0px; top:0px; width:15px;'></div>").format(this.topright));
                if (this.pageSetting)
                    html.append(("<div id='{0}' class='PageBox'></div>").format(this.renderTo + "_Foot"));
                html.append("</div>");
                document.getElementById(this.renderTo).innerHTML = html.toString();
                if (this.lockheaders && this.lockheaders.length) {
                    var lockHeaders = this.__renderLockHeaders();
                    if (this.isShowHeader)
                        document.getElementById(this.leftHead).appendChild(lockHeaders);
                    this.__sortHeaders(this.lockHeadersInfo);
                }
                if (this.unlockheaders && this.unlockheaders.length) {
                    var unlockHeaders = this.__renderUnLockHeaders();
                    if (this.isShowHeader)
                        document.getElementById(this.rightHead).appendChild(unlockHeaders);
                    this.__sortHeaders(this.unlockHeadersInfo);
                }
                this.__setStyle1();

            }

            if (this.dataSource && this.dataSource.length) {
                this.tb1 = document.createElement("table");
                this.tb1.setAttribute("id", this.lockheadersbody);
                this.tb1.setAttribute("cellSpacing", 0);
                this.tb1.className = "tableEllipsis";
                this.tb2 = document.createElement("table");
                this.tb2.setAttribute("id", this.unlockheadersbody);
                this.tb2.setAttribute("cellSpacing", 0);
                this.tb2.className = "tableEllipsis";

                for (var i = 0; i < this.dataSource.length; i++) {
                    if (this.lockHeadersInfo && this.lockHeadersInfo.length) {
                        this.__renderBodys("lock", this.tb1, i);
                    }
                    if (this.unlockHeadersInfo && this.unlockHeadersInfo.length) {
                        this.__renderBodys("unlock", this.tb2, i);
                    }
                }

                if (document.getElementById(this.leftBody)) {
                    document.getElementById(this.leftBody).innerHTML = "";
                    document.getElementById(this.leftBody).appendChild(this.tb1);
                }
                document.getElementById(this.rightBody).innerHTML = "";
                document.getElementById(this.rightBody).appendChild(this.tb2);

                this.__setStyle2();

            }
            else {
                //无数据
                document.getElementById(this.rightBody).innerHTML = this.emptyText;
            }

        }
        //分页
        if (this.pageSetting) {
            this.__renderPageBox(pageSetting);
        }
    },
    __setStyle1: function () {
        if (document.getElementById(this.left)) {
            if (document.getElementById(this.lockheaderstable))
                document.getElementById(this.lockheaderstable).style.width = this.lockWidth;
            if (document.getElementById(this.leftHead))
                document.getElementById(this.leftBody).style.top = document.getElementById(this.leftHead).offsetHeight + "px";
            document.getElementById(this.left).style.width = this.lockWidth;
            if (document.getElementById(this.rightHead))
                document.getElementById(this.rightHead).style.width = this.unlockWidth;
        }
        else {
            if (document.getElementById(this.rightHead))
                document.getElementById(this.rightHead).style.width = this.width;
        }
        if (document.getElementById(this.unlockheaderstable))
            document.getElementById(this.topright).style.height = document.getElementById(this.unlockheaderstable).offsetHeight + "px";

    },
    __setStyle2: function () {
        if (document.getElementById(this.left)) {
            document.getElementById(this.lockheadersbody).style.width = this.lockWidth;
            if (document.getElementById(this.leftHead))
                this.topScroll = document.getElementById(this.leftHead).offsetHeight;
            this.leftScroll = Utils.getPixel(this.lockWidth) + 2;
            if (document.getElementById(this.leftHead))
                document.getElementById(this.leftBody).style.top = document.getElementById(this.leftHead).offsetHeight;
            if (Utils.getPixel(this.lockWidth) != "" && this.lockWidth != "auto") {
                document.getElementById(this.rightHead).style.left = Utils.getPixel(this.lockWidth) + 2 + "px";
            }
            else {
                document.getElementById(this.rightHead).style.left = 2 + "px"; //JavaChu 这里有个auto的值看不懂
            }
            document.getElementById(this.rightBody).style.width = this.__formatWHCssText(document.getElementById(this.renderTo).offsetWidth - Utils.getPixel(this.lockWidth) - 6); //JavaChu 原来是-6
            document.getElementById(this.rightBody).style.marginLeft = Utils.getPixel(this.lockWidth) + 2 + "px";
        }
        else {
            document.getElementById(this.rightBody).style.width = this.width;
            this.leftScroll = 0;
        }
        if (document.getElementById(this.left))
            document.getElementById(this.unlockheadersbody).style.width = this.unlockWidth;
        else
            document.getElementById(this.unlockheadersbody).style.width = this.width;

        //24:分页控件高度
        if (this.height == "100%") {
            if (document.getElementById(this.left)) {
                if (navigator.userAgent.hasSubString("MSIE")) {
                    var version = 0;
                    version = parseInt(navigator.userAgent.split(";")[1].trim().split(" ")[1]);
                    if ((version == 6) || (version == 7)) {

                        document.getElementById(this.rightBody).style.height = (document.getElementById(this.unlockheadersbody).offsetHeight + 16 + 1) + "px";
                    }

                }
            }
        }
        else {
            if (document.getElementById(this.rightHead))
                document.getElementById(this.rightBody).style.height = (document.getElementById(this.renderTo).offsetHeight - document.getElementById(this.rightHead).offsetHeight - 1 - 24 - 3) + "px";
            if (document.getElementById(this.unlockheaderstable))
                document.getElementById(this.unlockheaderstable).style.width = document.getElementById(this.unlockheadersbody).offsetWidth + "px";
        }
        if (document.getElementById(this.rightHead)) {

            if (this.pageSetting)
                document.getElementById(this.renderTo).style.height = (document.getElementById(this.rightHead).offsetHeight + document.getElementById(this.rightBody).offsetHeight + 24) + "px";
            else
                document.getElementById(this.renderTo).style.height = (document.getElementById(this.rightHead).offsetHeight + document.getElementById(this.rightBody).offsetHeight) + "px";
        }

    },
    __bindEvent: function () {
        Utils.event.addEventHandler(document.getElementById(this.rightBody), "scroll", (function (o) {
            return function () {
                var top = o.topScroll - document.getElementById(o.rightBody).scrollTop;
                if (document.getElementById(o.leftBody))
                    document.getElementById(o.leftBody).style.top = top + "px";

                var left = o.leftScroll - document.getElementById(o.rightBody).scrollLeft;
                document.getElementById(o.rightHead).style.left = left + "px";
            }
        })(this));
    },
    __renderPageBox: function (pageSetting) {
        this.pageSetting.renderto = this.renderTo + "_Foot";
        if (!this.pageBox) {
            this.pageBox = new Wind.UI.PageBox(this.pageSetting);
            //$(this.renderTo).style.height = ($(this.renderTo).offsetHeight + $(this.renderTo + "_Foot").offsetHeight - 4) + "px";
        }
        this.pageBox.DataBind(pageSetting);
    },
    __renderLockHeaders: function () {
        return this.__renderHeaders("lock");
    },
    __renderUnLockHeaders: function () {
        return this.__renderHeaders("unlock");
    },
    __renderHeaders: function (type) {
        var headers;
        var LR;
        var tb = document.createElement("table");
        if (type == "lock") {
            headers = this.lockheaders;
            tb.setAttribute("id", this.lockheaderstable);
            LR = "L";
        }
        if (type == "unlock") {
            headers = this.unlockheaders;
            tb.setAttribute("id", this.unlockheaderstable);
            LR = "R";
        }
        tb.className = "tableEllipsis";
        if (headers && headers.length) {
            tb.setAttribute("cellSpacing", 0);
            for (var i = 0; i < headers.length; i++) {
                if (headers[i] && headers[i].length) {
                    tb.insertRow(i);
                    for (var j = 0; j < headers[i].length; j++) {
                        tb.rows[i].insertCell(j);
                        if (headers[i][j]["index"]) {
                            tb.rows[i].cells[j].id = type + "_" + headers[i][j]["index"];
                        }
                        tb.rows[i].cells[j].className = "grid3_hd";
                        if (headers[i][j]["index"])
                            tb.rows[i].cells[j].setAttribute("index", headers[i][j]["index"]);
                        var style = "";
                        //最后一列右边框为为0
                        if (j === 0) {
                            tb.rows[i].cells[j].className += ' first-col';
                        }
                        
                        if (headers[i][j]["width"])
                            style += ("width:{0};").format(this.__formatWHCssText(headers[i][j]["width"]));
                        if (headers[i][j]["height"])
                            style += ("height:{0};").format(this.__formatWHCssText(headers[i][j]["height"]));
                        if (headers[i][j]["align"])
                            style += ("text-align: {0};").format(headers[i][j]["align"]);
                        if (headers[i][j]["sortable"]) {
                            style += "cursor:pointer;";
                            Utils.event.addEventHandler(tb.rows[i].cells[j], "click", (function (o, index, type, lr, td, isSortByValue, header) {
                                return function () {
                                    if (o.dataSource && o.dataSource.length) {
                                        if (o.onclickHeaderEvent) {
                                            var headers = [];
                                            var tds = document.getElementById(o.renderTo).getElementsByTagName("td");
                                            if (tds && tds.length) {
                                                for (var i = 0; i < tds.length; i++) {
                                                    if (tds[i].getAttribute("index"))
                                                        headers.push(tds[i]);
                                                }
                                            }
                                            var direction = o.__clickHeader(headers, td);
                                            o.onclickHeaderEvent(header["dataIndex"], direction);
                                        }
                                        else {
                                            o.__sort(index - 1, type, lr, td, isSortByValue);
                                            o.__setRowIndex();
                                            o.currentRowIndex = -1;
                                        }
                                    }
                                    if (o.sortedHandler)
                                        o.sortedHandler();
                                }
                            })(this, headers[i][j]["index"], headers[i][j]["type"] ? headers[i][j]["type"] : "string", LR, tb.rows[i].cells[j], headers[i][j]["isSortByValue"], headers[i][j]));
                            tb.rows[i].cells[j].innerHTML = ("<span>{0}</span><img src='data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==' class='grid3_sort_icon'>").format(headers[i][j]["header"]);
                        }
                        else {
                            tb.rows[i].cells[j].innerHTML = headers[i][j]["header"];
                        }
                        //自定义表头样式
                        if (headers[i][j]["style"])
                            style += headers[i][j]["style"];
                        tb.rows[i].cells[j].style.cssText = style;
                        if (headers[i][j]["cs"])
                            tb.rows[i].cells[j].setAttribute("colSpan", headers[i][j]["cs"]);
                        else {
                            if (headers[i][j]["rs"])
                                tb.rows[i].cells[j].setAttribute("rowSpan", headers[i][j]["rs"]);
                            if (headers[i][j]["index"] || (headers.length == 1)) {
                                if (type == "lock")
                                    this.lockHeadersInfo.push(headers[i][j]);
                                if (type == "unlock")
                                    this.unlockHeadersInfo.push(headers[i][j]);
                                if (type == "")
                                    this.unlockHeadersInfo.push(headers[i][j]);
                            }
                        }
                    }
                }
            }
            if (tb.rows && tb.rows.length) {
                tb.rows[0].className += ' first-row';
            }
            if (!document.getElementById(this.left)) {
                tb.style.width = this.width;
            }
            else {
                if (type == "unlock")
                    tb.style.width = this.unlockWidth;
            }
            return tb;
        }
    },
    __renderBodys: function (type, table, rowIndex) {
        var headersInfo;
        var td_data = "";
        var sortValue = "";
        if (type == "lock") {
            headersInfo = this.lockHeadersInfo;
        }
        if (type == "unlock") {
            headersInfo = this.unlockHeadersInfo;
        }
        if (headersInfo && headersInfo.length) {
            table.insertRow(rowIndex);
            if (type == "lock")
                this.trs1.push(table.rows[rowIndex]);
            if (type == "unlock")
                this.trs2.push(table.rows[rowIndex]);

            if ((rowIndex % 2 == 1) && (this.isEnableAlternating))
                table.rows[rowIndex].className = "grid3_row grid3_row_alt";
            else
                table.rows[rowIndex].className = "grid3_row";
            if(rowIndex === 0){
                table.rows[rowIndex].className+= ' first-row';
            }
            table.rows[rowIndex].setAttribute("index", rowIndex);
            table.rows[rowIndex].setAttribute("rowindex", rowIndex);
            //事件绑定
            //鼠标划过
            if (this.isMouseoverSelect) {
                Utils.event.addEventHandler(table.rows[rowIndex], "mouseover", (function (tr) {
                    return function () {
                        if (tr)
                            tr.className += " grid3_row_over";
                    }
                })(table.rows[rowIndex]));
                Utils.event.addEventHandler(table.rows[rowIndex], "mouseout", (function (tr) {
                    return function () {
                        if (tr)
                            tr.className = tr.className.replace("grid3_row_over", "");
                    }
                })(table.rows[rowIndex]));
            }
            //单击选中某行
            if (this.isClickSelect) {
                Utils.event.addEventHandler(table.rows[rowIndex], "click", (function (o, tr) {
                    return function () {
                        var rowindex = parseInt(tr.getAttribute("rowindex"));
                        if (o.trs1 && o.trs1.length) {
                            var lastTR1 = document.getElementById(o.lockheadersbody).getElementsByTagName("tr")[o.currentRowIndex];
                            if (lastTR1) {
                                lastTR1.className = lastTR1.className.replace("grid3_row_selected", "");
                            }
                            document.getElementById(o.lockheadersbody).getElementsByTagName("tr")[rowindex].className += " grid3_row_selected";
                        }
                        if (o.trs2 && o.trs2.length) {
                            var lastTR2 = document.getElementById(o.unlockheadersbody).getElementsByTagName("tr")[o.currentRowIndex];
                            if (lastTR2) {
                                lastTR2.className = lastTR2.className.replace("grid3_row_selected", "");
                            }
                        }
                        document.getElementById(o.unlockheadersbody).getElementsByTagName("tr")[rowindex].className += " grid3_row_selected";
                        o.currentRowIndex = rowindex;
                    }
                })(this, table.rows[rowIndex]));
            }
            //单击事件
            if (this.onclickEvent) {
                Utils.event.addEventHandler(table.rows[rowIndex], "click", (function (o, index, tr) {
                    return function () {
                        var index = parseInt(tr.getAttribute("index"));
                        var rowindex = parseInt(tr.getAttribute("rowindex"));
                        o.onclickEvent(o.dataSource[index], rowindex);
                    }
                })(this, rowIndex, table.rows[rowIndex]));
            }
            //双击事件
            if (this.ondblclickEvent) {
                Utils.event.addEventHandler(table.rows[rowIndex], "dblclick", (function (o, index) {
                    return function () {
                        o.ondblclickEvent(index - 1);
                    }
                })(this, rowIndex));
            }

            var k = 0;
            for (var j = 0; j < headersInfo.length; j++) {
                sortValue = this.dataSource[rowIndex][headersInfo[j]["dataIndex"]] || "";
                table.rows[rowIndex].insertCell(k);
                //合并单元格
                if (sortValue["cs"])
                    table.rows[rowIndex].cells[k].setAttribute("colSpan", sortValue["cs"]);
                if (sortValue["rs"])
                    table.rows[rowIndex].cells[k].setAttribute("rowSpan", sortValue["rs"]);

                table.rows[rowIndex].cells[k].className = "grid3_cell";
                if (headersInfo[j]["width"])
                    table.rows[rowIndex].cells[k].style.width = this.__formatWHCssText(headersInfo[j]["width"]);
                if (!headersInfo[j]["renderer"]) {
                    if (sortValue["value"])
                        td_data = sortValue["value"];
                    else
                        td_data = sortValue;
                }
                else {
                    if (sortValue["value"])
                        td_data = headersInfo[j]["renderer"](rowIndex, sortValue["value"], table.rows[rowIndex].cells[k]);
                    else
                        td_data = headersInfo[j]["renderer"](rowIndex, sortValue, table.rows[rowIndex].cells[k]);
                }
                if (td_data == "")
                    td_data = "&nbsp;";
                var version = 0;
                if (navigator.userAgent.hasSubString("MSIE")) {
                    version = parseInt(navigator.userAgent.split(";")[1].trim().split(" ")[1]);
                }
                if ((headersInfo[j]["width"]) && (version == '8'))
                    table.rows[rowIndex].cells[k].style.cssText = ("width:{0};").format(this.__formatWHCssText(headersInfo[j]["width"]));
                if (headersInfo[j]["textAlign"]) {
                    table.rows[rowIndex].cells[k].align = headersInfo[j]["textAlign"];
                }
                if (!headersInfo[j]["renderer"])
                    table.rows[rowIndex].cells[k].innerHTML = ("<div class='cell' sortvalue='{0}' {1}>{2}</div>").format(sortValue, td_data != "&nbsp;" ? ("title='{0}'").format(td_data) : "", td_data);
                else
                    table.rows[rowIndex].cells[k].innerHTML = ("<div class='cell' sortvalue='{0}' >{1}</div>").format(sortValue, td_data);
                k++;
            }
            if (table.rows[rowIndex].cells && table.rows[rowIndex].cells.length) {
                table.rows[rowIndex].cells[0].className += ' first-col';
            }
        }
    },
    __renderBodys2: function (type, table, rowIndex) {
        var tr = document.createElement("tr");
        tr.setAttribute("index", rowIndex - 1);
        tr.setAttribute("rowindex", rowIndex - 1);
        var headersInfo;
        var td_data = "";
        var sortValue = "";
        if (type == "lock") {
            headersInfo = this.lockHeadersInfo;
        }
        if (type == "unlock") {
            headersInfo = this.unlockHeadersInfo;
        }
        if (headersInfo && headersInfo.length) {
            if (type == "lock")
                this.trs1.push(tr);
            if (type == "unlock")
                this.trs2.push(tr);

            if ((rowIndex % 2 == 1) && (this.isEnableAlternating))
                tr.className = "grid3_row grid3_row_alt";
            else
                tr.className = "grid3_row";

            var k = 0;
            for (var j = 0; j < headersInfo.length; j++) {
                var td = document.createElement("td");
                if (rowIndex == 0) {
                    td.style.width = this.__formatWHCssText(headersInfo[j]["width"]);
                    td.style.height = "0px";
                    tb.className = "grid3_cell_first";
                }
                else {
                    sortValue = this.dataSource[rowIndex - 1][headersInfo[j]["dataIndex"]] || "";
                    //合并单元格
                    if (sortValue["cs"])
                        td.setAttribute("colSpan", sortValue["cs"]);
                    if (sortValue["rs"])
                        td.setAttribute("rowSpan", sortValue["rs"]);

                    td.className = "grid3_cell";
                    if (headersInfo[j]["width"])
                        td.style.width = this.__formatWHCssText(headersInfo[j]["width"]);
                    if (!headersInfo[j]["renderer"]) {
                        if (sortValue["value"])
                            td_data = sortValue["value"];
                        else
                            td_data = sortValue;
                    }
                    else {
                        if (sortValue["value"])
                            td_data = headersInfo[j]["renderer"](rowIndex - 1, sortValue["value"], td);
                        else
                            td_data = headersInfo[j]["renderer"](rowIndex - 1, sortValue, td);
                    }
                    if (td_data == "")
                        td_data = "&nbsp;";
                    var version = 0;
                    if (navigator.userAgent.hasSubString("MSIE")) {
                        version = parseInt(navigator.userAgent.split(";")[1].trim().split(" ")[1]);
                    }
                    if ((headersInfo[j]["width"]) && (version == '8'))
                        td.style.cssText = ("width:{0};").format(this.__formatWHCssText(headersInfo[j]["width"]));
                    if (headersInfo[j]["textAlign"]) {
                        td.align = headersInfo[j]["textAlign"];
                    }
                    if (!headersInfo[j]["renderer"])
                        td.innerHTML = ("<div class='cell' sortvalue='{0}' {1}>{2}</div>").format(sortValue, td_data != "&nbsp;" ? ("title='{0}'").format(td_data) : "", td_data);
                    else
                        td.innerHTML = ("<div class='cell' sortvalue='{0}'>{1}</div>").format(sortValue, td_data);
                    k++;
                }
                tr.appendChild(td);
            }
        }

        //事件绑定
        //鼠标划过
        if (this.isMouseoverSelect) {
            Utils.event.addEventHandler(tr, "mouseover", (function (_tr) {
                return function () {
                    if (_tr)
                        _tr.className += " grid3_row_over";
                }
            })(tr));
            Utils.event.addEventHandler(tr, "mouseout", (function (_tr) {
                return function () {
                    if (_tr)
                        _tr.className = tr.className.replace("grid3_row_over", "");
                }
            })(tr));
        }
        //单击选中某行
        if (this.isClickSelect) {
            Utils.event.addEventHandler(tr, "click", (function (o, _tr) {
                return function () {
                    var rowindex = parseInt(_tr.getAttribute("rowindex"));
                    if (o.trs1 && o.trs1.length) {
                        var lastTR1 = document.getElementById(o.lockheadersbody).getElementsByTagName("tr")[o.currentRowIndex];
                        if (lastTR1) {
                            lastTR1.className = lastTR1.className.replace("grid3_row_selected", "");
                        }
                        document.getElementById(o.lockheadersbody).getElementsByTagName("tr")[rowindex].className += " grid3_row_selected";
                    }
                    if (o.trs2 && o.trs2.length) {
                        var lastTR2 = document.getElementById(o.unlockheadersbody).getElementsByTagName("tr")[o.currentRowIndex];
                        if (lastTR2) {
                            lastTR2.className = lastTR2.className.replace("grid3_row_selected", "");
                        }
                    }
                    document.getElementById(o.unlockheadersbody).getElementsByTagName("tr")[rowindex].className += " grid3_row_selected";
                    o.currentRowIndex = rowindex;
                }
            })(this, tr));
        }
        //单击事件
        if (this.onclickEvent) {
            Utils.event.addEventHandler(tr, "click", (function (o, index, tr) {
                return function () {
                    var index = parseInt(tr.getAttribute("index"));
                    var rowindex = parseInt(tr.getAttribute("rowindex"));
                    o.onclickEvent(o.dataSource[index], rowindex);
                }
            })(this, rowIndex, tr));
        }
        //双击事件
        if (this.ondblclickEvent) {
            Utils.event.addEventHandler(tr, "dblclick", (function (o, index) {
                return function () {
                    o.ondblclickEvent(index - 1);
                }
            })(this, rowIndex));
        }

        return tr;
    },
    __sortHeaders: function (headers) {
        headers.sort(function (a, b) {
            return a.index - b.index;
        });
    },
    __sort: function (index, type, LR, td, isSortByValue) {

        var className = td.className;
        if (this.lastSortHeaderTD) {
            if (this.lastSortHeaderTD == td) {
                if (className.indexOf("sort_asc") > 0)
                    td.className = "grid3_hd sort_desc";
                else
                    td.className = "grid3_hd sort_asc";
            }
            else {
                this.lastSortHeaderTD.className = "grid3_hd";
                td.className = "grid3_hd sort_asc";
            }
        }
        else
            td.className = "grid3_hd sort_asc";
        this.lastSortHeaderTD = td;

        if (this.trs1 && this.trs1.length) {
            this.trs3 = [];
            for (var i = 0; i < this.trs1.length; i++) {
                var tr = {};
                tr["L"] = this.trs1[i];
                tr["R"] = this.trs2[i];
                this.trs3.push(tr);
            }
            this.trs3.sort(this.__getSortFun(index, type, LR, td.className, isSortByValue));
            var df1 = document.createDocumentFragment();
            var df2 = document.createDocumentFragment();
            for (var i = 0; i < this.trs3.length; i++) {
                if (this.isEnableAlternating) {
                    if (i % 2 == 0) {
                        this.trs3[i]["L"].className = "grid3_row";
                        this.trs3[i]["R"].className = "grid3_row";
                    }
                    else {
                        this.trs3[i]["L"].className = "grid3_row grid3_row_alt";
                        this.trs3[i]["R"].className = "grid3_row grid3_row_alt";
                    }

                }
                df1.appendChild(this.trs3[i]["L"]);
                df2.appendChild(this.trs3[i]["R"]);
            }
            document.getElementById(this.lockheadersbody).tBodies[0].appendChild(df1);
            document.getElementById(this.unlockheadersbody).tBodies[0].appendChild(df2);
        }
        else {
            this.trs2.sort(this.__getSortFun(index, type, LR, td.className, isSortByValue));
            var df = document.createDocumentFragment();
            for (var i = 0; i < this.trs2.length; i++) {
                if (this.isEnableAlternating) {
                    if (i % 2 == 0) {
                        this.trs2[i].className = "grid3_row";
                    }
                    else {
                        this.trs2[i].className = "grid3_row grid3_row_alt";
                    }

                }
                df.appendChild(this.trs2[i]);
            }
            document.getElementById(this.unlockheadersbody).tBodies[0].appendChild(df);
        }
        this.sortIndex = index;
        this.LR = LR;
    },
    __getSortFun: function (index, type, LR, direction, isSortByValue) {
        var convertType = function (value, type) {
            switch (type) {
                case "int":
                    return parseInt(value);
                case "float":
                    return parseFloat(value);
                case "double":
                    return parseFloat(value);
                case "date":
                    return value;
                default:
                    return value.toString();

            }
        };

        if (this.trs1 && this.trs1.length) {
            //有锁定列，行被分割，需要整体排序 数据结构 {L:,R:}
            return function (tr1, tr2) {
                var v1, v2;
                if (!isSortByValue) {
                    v1 = convertType(tr1[LR].cells[index].firstChild.firstChild.nodeValue, type);
                    v2 = convertType(tr2[LR].cells[index].firstChild.firstChild.nodeValue, type);
                }
                else {
                    v1 = convertType(tr1[LR].cells[index].firstChild.getAttribute('sortvalue'), type);
                    v2 = convertType(tr2[LR].cells[index].firstChild.getAttribute('sortvalue'), type);
                }
                var cha = 0;
                if (type == "int" || type == "float" || type == "double")
                    cha = v1 - v2;
                else
                    cha = v1.localeCompare(v2);
                if (cha < 0) {
                    if (direction.indexOf("sort_asc") >= 0)
                        return -1;
                    else
                        return 1;
                }
                else if (cha > 0) {
                    if (direction.indexOf("sort_asc") >= 0)
                        return 1;
                    else
                        return -1;
                }
                else
                    return 0;
            }
        }
        else {
            //行完整
            return function (tr1, tr2) {
                var v1, v2;
                if (!isSortByValue) {
                    v1 = convertType(tr1.cells[index].firstChild.firstChild.nodeValue, type);
                    v2 = convertType(tr2.cells[index].firstChild.firstChild.nodeValue, type);
                }
                else {
                    v1 = convertType(tr1.cells[index].firstChild.getAttribute('sortvalue'), type);
                    v2 = convertType(tr2.cells[index].firstChild.getAttribute('sortvalue'), type);
                }
                var cha = 0;
                if (type == "int" || type == "float" || type == "double")
                    cha = v1 - v2;
                else
                    cha = v1.localeCompare(v2);
                if (cha < 0) {
                    if (direction.indexOf("sort_asc") >= 0)
                        return -1;
                    else
                        return 1;
                }
                else if (cha > 0) {
                    if (direction.indexOf("sort_asc") >= 0)
                        return 1;
                    else
                        return -1;
                }
                else
                    return 0;
            }
        }
    },
    //如果不是多表头结构，则自动完成index值的填充
    __resetHeaders: function (headers) {
        for (var i = 0; i < headers.length; i++)
            headers[i]["index"] = i + 1;
    },
    //是否是多表头结构
    __isMultiHeaders: function (headers) {
        if (headers && headers.length)
            return headers[0].length
        return false;
    },
    __formatWHCssText: function (input) {
        if (!input)
            return "auto";
        else if (!isNaN(input))
            return input + "px";
        else
            return input;
    },
    __clickHeader: function (tds, td) {
        var result = "ascending";
        if (tds.length > 0) {
            for (var i = 0; i < tds.length; i++) {
                if (tds[i] != td)
                    tds[i].className = tds[i].className.replace("sort_asc", "").replace("sort_desc", "");
                else {
                    if (tds[i].className.indexOf("sort_asc") < 0) {
                        tds[i].className += " sort_asc";
                        tds[i].className = tds[i].className.replace("sort_desc", "");
                        result = "ascending";
                    }
                    else {
                        tds[i].className += " sort_desc";
                        tds[i].className = tds[i].className.replace("sort_asc", "");
                        result = "descending";
                    }
                }
            }
        }
        return result;
    },
    __setRowIndex: function () {
        if (document.getElementById(this.left)) {
            var trs1 = document.getElementById(this.lockheadersbody).getElementsByTagName("tr");
            if (trs1 && trs1.length) {
                for (var i = 0; i < trs1.length; i++)
                    trs1[i].setAttribute("rowindex", i);
            }
        }
        var trs2 = document.getElementById(this.unlockheadersbody).getElementsByTagName("tr");
        if (trs2 && trs2.length) {
            for (var i = 0; i < trs2.length; i++)
                trs2[i].setAttribute("rowindex", i);
        }
    }
};