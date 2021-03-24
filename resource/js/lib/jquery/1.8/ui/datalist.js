
Wind.UI.Datalist = function () {
    var p = arguments[0] || {};
    this.header = p["header"]; //表头
    this.renderTo = p["renderTo"];
    this.width = p["width"] || "100%";
    this.height = p["height"] || "100%";
    this.onclickEvent = p["click"]; //单击事件
    this.ondblclickEvent = p["dblclick"]; //双击事件
    this.onclickHeaderEvent = p["clickHeader"]; //自定义排序
    this.isClickSelect = p["isClickSelect"] == undefined || p["isClickSelect"]; //单击选择行
    this.isMouseoverSelect = p["isMouseoverSelect"] == undefined || p["isMouseoverSelect"]; //鼠标划过
    this.pageSetting = p["pageSetting"]; //翻页设置
    this.imagePath = p["imagePath"];
    this.emptyText = p["emptyText"] || "无数据!"

    //新增功能
    this.isLockHeader = p["isLockHeader"] || false; //是否锁定表头
    this.isEnableAlternating = p["isEnableAlternating"] == undefined || p["isEnableAlternating"]; //是否支持隔行变色
    this.isShowHeader = p["isShowHeader"] == undefined || p["isShowHeader"]; //是否显示表头

    //DOM对象ID列表
    this.tbodyID = this.renderTo + "_tbody";
    this.headersPanelID = this.renderTo + "_headers";
    this.emptyTRID = this.renderTo + "_emptyTR";
    this.tableContainerID = this.renderTo + "_tableContainer";
};

Wind.UI.Datalist.prototype = {
    DataBind: function (data, pageSetting) {
        //计算值
        if (this.header)
            this.columnCount = this.header.length;
        if (this.isFirstLoad == undefined)
            this.isFirstLoad = true; //表示是第一次加载
        else
            this.isFirstLoad = false;
        //this.dataSource = data;
        this.dataSource = this.__convertObjToArray(data);
        this.__formatDataSource();
        this.paging = pageSetting;
        this.__render(pageSetting);
        this.__bindEvent();
    },
    GetSelectValue: function (dataIndex) {
        if (this.isClickSelect) {
            if (dataIndex)
                return this.dataSource[this.currentRowIndex][dataIndex];
            else
                return this.currentRowIndex;
        }
        else
            return null;
    },
    UpdateWords: function (head, foot) {
        var spans = $("#" + this.headersPanelID + " td div span");
        if (spans.length > 0) {
            for (var i = 0; i < spans.length; i++) {
                spans[i].innerHTML = head[i];
            }
        }
        this.pageBox.UpdateWords(foot);
    },
    __convertObjToArray: function (obj) {
        var result = [];
        if (obj && obj.length > 0) {
            for (var i = 0; i < obj.length; i++) {
                result.push(obj[i]);
            }
        }
        return result;
    },
    __render: function (pageSetting) {
        if (this.isFirstLoad) {
            if (this.renderTo) {
                document.getElementById(this.renderTo).style.cssText += ("position: relative;overflow: hidden;height:{0};").format(this.__formatWHCssText(this.height));
            }
            var classname = "grid3_hd grid3_cell";
            var html = new StringBuilder();
            //表头开始
            html.append(("<div id='{0}' style='width:{1};overflow:auto'>").format(this.tableContainerID, this.__formatWHCssText(this.width)));
            html.append(("<table cellspacing='0' cellpadding='0' border='0' style='width: {0};table-layout: fixed; word-break: break-all;border:solid 1px #D0D0D0;'>").format(this.__formatWHCssText(this.width)));

            if (this.isShowHeader) {
                html.append("<thead>");
                html.append(("<tr id='{0}' class='grid3_hd_row'>").format(this.headersPanelID));
                var style = "";
                for (var i = 0; i < this.columnCount; i++) {
                    if (this.isLockHeader) {
                        if (this.header[i]["isLocked"])
                            classname = "grid3_hd grid3_cell fixLeftTop";
                        else
                            classname = "grid3_hd grid3_cell fixTop";
                    }
                    if (this.header[i]["width"])
                        html.append(("<td style='width: {0};' class='{1}'>").format(this.__formatWHCssText(this.header[i]["width"]), classname));
                    else
                        html.append(("<td class='{0}'>").format(classname));
                    if (this.header[i]["align"])
                        style += ("text-align: {0};").format(this.header[i]["align"]);
                    if (this.header[i]["sortable"])
                        style += "cursor:pointer;";
                    if (style)
                        html.append(("<div  class='grid3_hd_inner' style='{0}'>").format(style));
                    else
                        html.append("<div  class='grid3_hd_inner'>");
                    style = "";
                    html.append("<span>" + this.header[i]["header"] + "</span>");
                    html.append("<img src='data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==' class='grid3_sort_icon'>");
                    html.append("</div></td>");
                }
                html.append("</tr></thead>");
            }

            //表身开始
            //var td_text;
            html.append(("<tbody id='{0}'>").format(this.tbodyID));
            html.append("</tbody>");

            html.append("</table>");
            html.append("</div>");
            if (this.pageSetting)
                html.append(("<div id='{0}' class='PageBox' style='position:static'></div>").format(this.renderTo + "_Foot"));
            document.getElementById(this.renderTo).innerHTML = html.toString();
            html.clear();
            //对没有数据的处理          
            if (!document.getElementById(this.emptyTRID)) {
                document.getElementById(this.tbodyID).appendChild(this.__renderEmptyTRHTML());
            }

            if (this.dataSource && this.dataSource.length > 0) {
                for (var i = 0; i < this.dataSource.length; i++) {
                    document.getElementById(this.tbodyID).appendChild(this.__renderTRHTML(i));
                }
            }
        }
        else {
            //当后续再调用DataBind方法时，若当前需要绑定的数据数量和HTML架构架构不一致时的处理,去掉空数据提示行

            var trCount = $("#" + this.tbodyID + " tr.grid3_row").length - 1;
            var tr;

            if (this.dataSource.length < trCount) {
                for (var i = 0; i < trCount; i++) {
                    tr = $($("#" + this.tbodyID + " tr.grid3_row")[i + 1]);
                    if (i >= this.dataSource.length)
                        tr.hide()
                    else
                        tr.show();
                    this.__rebindTRData(i);
                }
            }
            else if (this.dataSource.length > trCount) {
                for (var i = 0; i < this.dataSource.length; i++) {
                    if (i < trCount) {
                        $($("#" + this.tbodyID + " tr.grid3_row")[i + 1]).show()
                        this.__rebindTRData(i);
                    }
                    else
                        document.getElementById(this.tbodyID).appendChild(this.__renderTRHTML(i));

                }
            }
            else {
                for (var i = 0; i < trCount; i++) {
                    $($("#" + this.tbodyID + " tr.grid3_row")[i + 1]).show();
                    this.__rebindTRData(i);
                }
            }
        }

        if (!this.dataSource || this.dataSource.length == 0) {
            document.getElementById(this.emptyTRID).style.display = "";
        }
        else if (document.getElementById(this.emptyTRID))
            document.getElementById(this.emptyTRID).style.display = "none";
        if (this.pageSetting) {
            this.__renderPageBox(pageSetting);
            //如果需要分页并且renderto没有设定高度，则需要调整高度，否则分页会被遮挡
            if (typeof this.height == "number")
                document.getElementById(this.tableContainerID).style.height = (document.getElementById(this.renderTo).offsetHeight - document.getElementById(this.renderTo).offsetHeight) + "px";
        }
    },
    __renderTRHTML: function (i) {
        var td_data = "";
        var classname = "grid3_row";
        if (this.isEnableAlternating) {
            if (i % 2 == 1)
                classname = "grid3_row grid3_row_alt";
            else
                classname = "grid3_row";
        }
        var tr = document.createElement("tr");
        tr.className = classname;
        for (var j = 0; j < this.columnCount; j++) {
            var td = document.createElement("td");
            if (this.header[j]["isLocked"])
                classname = "grid3_cell fixLeft";
            else
                classname = "grid3_cell";
            td.className = classname;
            if (this.header[j]["width"])
                td.style.cssText = ("width:{0};overflow: hidden;white-space: nowrap;text-overflow: ellipsis;").format(this.__formatWHCssText(this.header[j]["width"]));
            td_data = this.__fullinData(i, j);
            if ((!this.header[j]["renderer"]) && (!this.header[j]["type"])) {
                if (this.header[j]["textAlign"]) {
                    if (!this.header[j]["isWrap"])
                        td.innerHTML = ("<div class='grid3_cell_inner' title='{1}' style='text-align:{0};'>{1}</div>").format(this.header[j]["textAlign"], td_data);
                    else
                        td.innerHTML = ("<div class='grid3_cell_inner' title='{1}' style='text-align:{0};white-space: normal;'>{1}</div>").format(this.header[j]["textAlign"], td_data);
                }
                else {
                    if (!this.header[j]["isWrap"])
                        td.innerHTML = ("<div class='grid3_cell_inner' title='{0}'>{0}</div>").format(td_data);
                    else
                        td.innerHTML = ("<div class='grid3_cell_inner' title='{0}' style='white-space: normal;'>{0}</div>").format(td_data);
                }
            }
            else {
                if (this.header[j]["textAlign"]) {
                    if (!this.header[j]["isWrap"])
                        td.innerHTML = ("<div class='grid3_cell_inner'  style='text-align:{0};'>{1}</div>").format(this.header[j]["textAlign"], td_data);
                    else
                        td.innerHTML = ("<div class='grid3_cell_inner'  style='text-align:{0};white-space: normal;'>{1}</div>").format(this.header[j]["textAlign"], td_data);
                }
                else {
                    if (!this.header[j]["isWrap"])
                        td.innerHTML = ("<div class='grid3_cell_inner' >{0}</div>").format(td_data);
                    else
                        td.innerHTML = ("<div class='grid3_cell_inner' style='white-space: normal;'>{0}</div>").format(td_data);
                }
            }
            tr.appendChild(td);
        }
        tr.setAttribute("isBindMouseoverSelectEvent", "0"); //鼠标划过
        tr.setAttribute("isBindClickSelectEvent", "0"); //单击选中
        tr.setAttribute("isBindClickEvent", "0"); //单击事件
        tr.setAttribute("isBinddbClickEvent", "0"); //双击事件
        tr.setAttribute("index", i); //索引
        tr.id = this.tbodyID + "_" + i;
        return tr;
    },
    __rebindTRData: function (i) {

        var tds = $($("#" + this.tbodyID + " tr.grid3_row")[i + 1]).find("td.grid3_cell");
        if (tds.length > 0) {
            for (var j = 0; j < tds.length; j++) {
                var value = this.__fullinData(i, j);
                $($(tds[j]).find("div")[0]).html(value);
                if ((!this.header[j]["renderer"]) && (!this.header[j]["type"]))
                    $($(tds[j]).find("div")[0]).attr("title", value);
            }
        }
    },
    __renderEmptyTRHTML: function () {
        var tr = document.createElement("tr");
        tr.id = this.emptyTRID;
        tr.className = "grid3_row";
        var td = document.createElement("td");
        td.className = "grid3_cell";
        td.setAttribute("colSpan", this.columnCount);
        td.innerHTML = this.emptyText;
        td.style.padding = "10px";
        td.style.textAlign = "left";
        tr.appendChild(td);
        return tr;
    },
    __bindEvent: function () {
        if (this.isShowHeader) {
            if (this.isFirstLoad) {
                var headers = $("#" + this.headersPanelID + " td");
                if (headers.length > 0) {
                    for (var i = 0; i < headers.length; i++) {
                        //鼠标滑过效果
                        Utils.event.addEventHandler(headers[i], "mouseover", (function (index) {
                            return function () {
                                headers[index].className += " grid3_hd_over";
                            }
                        })(i));
                        Utils.event.addEventHandler(headers[i], "mouseout", (function (index) {
                            return function () {
                                headers[index].className = headers[index].className.replace("grid3_hd_over", "");
                            }
                        })(i));
                        //排序
                        if (this.header[i]["sortable"]) {
                            Utils.event.addEventHandler(headers[i], "click", (function (o, index) {
                                return function () {
                                    var direction = o.__clickHeader(headers, index);
                                    if (o.onclickHeaderEvent) {
                                        o.onclickHeaderEvent(o.header[index]["dataIndex"], direction);
                                    }
                                    else {
                                        o.__sort(o.header[index]["dataIndex"], direction);
                                    }
                                }
                            })(this, i));
                        }
                    }
                }
            }
        }
        var trs = $("#" + this.tbodyID).find("tr.grid3_row");
        //鼠标划过
        if (this.isMouseoverSelect) {
            if (trs.length > 0) {
                for (var i = 0; i < trs.length; i++) {
                    if (trs[i].getAttribute("isBindMouseoverSelectEvent") == "0") {
                        Utils.event.addEventHandler(trs[i], "mouseover", (function (index) {
                            return function () {
                                trs[index].className += " grid3_row_over";
                            }
                        })(i));
                        Utils.event.addEventHandler(trs[i], "mouseout", (function (index) {
                            return function () {
                                trs[index].className = trs[index].className.replace("grid3_row_over", "");
                            }
                        })(i));
                        trs[i].setAttribute("isBindMouseoverSelectEvent", "1");
                    }

                }
            }
        }
        //单击选中某行
        if (this.isClickSelect) {
            if (trs.length > 0) {
                for (var i = 0; i < trs.length; i++) {
                    if (trs[i].getAttribute("isBindClickSelectEvent") == "0") {
                        Utils.event.addEventHandler(trs[i], "click", (function (o, index) {
                            return function () {
                                for (var i = 0; i < trs.length; i++)
                                    trs[i].className = trs[i].className.replace("grid3_row_selected", "");
                                trs[index].className += " grid3_row_selected";
                                o.currentRowIndex = index;
                            }
                        })(this, i));
                        trs[i].setAttribute("isBindClickSelectEvent", "1");
                    }
                }
            }
        }
        //单击事件
        if (this.onclickEvent) {
            if (trs.length > 0) {
                for (var i = 0; i < trs.length; i++) {
                    if (trs[i].getAttribute("isBindClickEvent") == "0") {
                        Utils.event.addEventHandler(trs[i], "click", (function (o, index) {
                            return function () {
                                o.onclickEvent(trs[index].getAttribute("index"));
                            }
                        })(this, i));
                        trs[i].setAttribute("isBindClickEvent", "1");
                    }
                }
            }
        }
        //双击事件
        if (this.ondblclickEvent) {
            if (trs.length > 0) {
                for (var i = 0; i < trs.length; i++) {
                    if (trs[i].getAttribute("isBinddbClickEvent") == "0") {
                        Utils.event.addEventHandler(trs[i], "dblclick", (function (o, index) {
                            return function () {
                                o.ondblclickEvent(trs[index].getAttribute("index"));
                            }
                        })(this, i));
                        trs[i].setAttribute("isBinddbClickEvent", "1");
                    }
                }
            }
        }
    },
    __fullinData: function (i, j) {
        var td_text = "";
        if (i < this.dataSource.length) {
            if (this.header[j]["renderer"]) {
                if (this.header[j]["dataIndex"])
                    td_text = this.header[j]["renderer"](i, this.dataSource[i][this.header[j]["dataIndex"]], this.dataSource[i]);
                else
                    td_text = this.header[j]["renderer"](i, this.imagePath, this.dataSource[i]);
            }
            else {
                if (this.header[j]["editable"] && this.header[j]["type"] == "checkbox") {
                    if (this.dataSource[i][this.header[j]["dataIndex"]])
                        td_text = ("<div class='{0}' id='{1}'>&nbsp;</div>").format("grid3_check grid3_check_col_on", "grid3_check_" + i + "_" + j);
                    else
                        td_text = ("<div class='{0}' id='{1}'>&nbsp;</div>").format("grid3_check grid3_check_col", "grid3_check_" + i + "_" + j);
                }
                else if (this.header[j]["type"] == "select") {
                    td_text = this.dataSource[i][this.header[j]["dataIndex"]]["text"];
                    var list = this.header[j]["selectdata"];
                    if (list.length > 0) {
                        for (var k = 0; k < list.length; k++) {
                            if (this.dataSource[i][this.header[j]["dataIndex"]] == list[k]["value"]) {
                                td_text = list[k]["text"];
                                break;
                            }
                        }
                    }
                }
                else if (this.header[j]["type"] == "checkboxlist") {
                    td_text = "";
                    var list = this.header[j]["data"];
                    if (list.length > 0) {
                        var columnCount = 0;
                        for (var k = 0; k < list.length; k++) {
                            td_text += ("<input id='{0}' type='checkbox' {1}>&nbsp;").format("checkboxlist_" + i + "_" + j + "_" + k, this.dataSource[i][this.header[j]["dataIndex"]][k] ? "checked='checked'" : "");
                            td_text += this.header[j]["data"][k] + "&nbsp;&nbsp;";
                            columnCount++;
                            if (this.header[j]["column"] && parseInt(this.header[j]["column"]) == columnCount) {
                                td_text += "<br />";
                                columnCount = 0;
                            }
                        }
                    }
                    td_text = this.__renderCheckBoxListHTML(i, j);
                }
                else {
                    if ((this.dataSource[i][this.header[j]["dataIndex"]]) || (this.dataSource[i][this.header[j]["dataIndex"]] == 0))
                        td_text = this.dataSource[i][this.header[j]["dataIndex"]];
                    else
                        td_text = "&nbsp;";
                }
            }
        }

        return td_text;
    },
    //checkboxlist输出
    __renderCheckBoxListHTML: function (rowIndex, columnIndex) {
        var boolArray = this.dataSource[rowIndex][this.header[columnIndex]["dataIndex"]];
        if (boolArray && boolArray.length > 0) {
            var maxColumn = parseInt(this.header[columnIndex]["column"]);
            var data = [];
            for (var i = 0; i < boolArray.length; i++) {
                var item = {};
                if (this.header[columnIndex]["data"][rowIndex])
                    item.text = this.header[columnIndex]["data"][rowIndex][i];
                else
                    item.text = this.header[columnIndex]["data"][0][i];
                item.value = boolArray[i];
                data.push(item);
            }

            var html = new StringBuilder();
            if (data.length > 0) {
                html.append("<table cellpadding='0' cellspacing='0'>");
                for (var i = 0; i < Math.ceil(data.length / maxColumn) * maxColumn; i++) {
                    if (!(i % maxColumn))
                        html.append("<tr>");
                    html.append("<td style='border:0px;'>");
                    if (!data[i]) {
                        html.append("&nbsp;");
                    }
                    else {
                        html.append(("<input id='{0}' type='checkbox' {1} />&nbsp;").format("checkboxlist_" + rowIndex + "_" + columnIndex + "_" + i, data[i]["value"] ? "checked='checked'" : ""));
                        html.append(("<label for='{0}' style='cursor:pointer;'>{1}</label>").format("checkboxlist_" + rowIndex + "_" + columnIndex + "_" + i, data[i]["text"]));
                    }
                    html.append("</td>");
                    if ((i % maxColumn) == (maxColumn - 1)) {
                        html.append("</tr>");
                    }
                }
                html.append("</table>");
            }
            return html.toString();
        }
        return "";
    },
    __clickHeader: function (tds, index) {
        var result = "ascending";
        if (tds.length > 0) {
            for (var i = 0; i < tds.length; i++) {
                if (i != index)
                    tds[i].className = tds[i].className.replace("grid3_hd_over", "").replace("sort_asc", "").replace("sort_desc", "");
                else {
                    if (tds[i].className.indexOf("sort_asc") < 0) {
                        tds[i].className += "sort_asc";
                        tds[i].className = tds[i].className.replace("grid3_hd_over", "").replace("sort_desc", "");
                        result = "ascending";
                    }
                    else {
                        tds[i].className += "sort_desc";
                        tds[i].className = tds[i].className.replace("grid3_hd_over", "").replace("sort_asc", "");
                        result = "descending";
                    }
                }
            }
        }
        return result;
    },
    __sort: function (dataindex, direction) {
        if (direction == "ascending")
            this.dataSource.sort(this.__ascsortFun(dataindex));
        else
            this.dataSource.sort(this.__descsortFun(dataindex));
        this.DataBind(this.dataSource, this.paging);
    },
    __ascsortFun: function (dataindex) {
        return function (d1, d2) {
            if (d1[dataindex] != undefined && d2[dataindex] != undefined) {
                var s1 = d1[dataindex].toString();
                var s2 = d2[dataindex].toString();
                if (!isNaN(s1) && !isNaN(s2)) {
                    return parseFloat(s1) - parseFloat(s2);
                }
                else {
                    return s1.localeCompare(s2);
                }
            }
            return 0;
        }
    },
    __descsortFun: function (dataindex) {
        return function (d1, d2) {
            if (d1[dataindex] != undefined && d2[dataindex] != undefined) {
                var s1 = d1[dataindex].toString();
                var s2 = d2[dataindex].toString();
                if (!isNaN(s1) && !isNaN(s2)) {
                    return parseFloat(s2) - parseFloat(s1);
                }
                else {
                    return s2.localeCompare(s1);
                }
            }
            return 0;
        }
    },
    __renderPageBox: function (pageSetting) {
        this.pageSetting.renderto = this.renderTo + "_Foot";
        if (!this.pageBox)
            this.pageBox = new Wind.UI.PageBox(this.pageSetting);
        this.pageBox.DataBind(pageSetting);
    },
    __formatWHCssText: function (input) {
        if (typeof input == "number")
            return input + "px";
        else if (input == undefined)
            return "100%";
        else
            return input;
    },
    __formatDataSource: function () {
        if (this.dataSource && this.dataSource.length > 0) {
            for (var i = 0; i < this.dataSource.length; i++) {
                for (var j = 0; j < this.columnCount; j++) {
                    if (this.header[j]["type"] == "calendar") {
                        //alert(JSON2.dateFormat(this.dataSource[i][this.header[j]["dataIndex"]], "yyyy-MM-dd"));
                        if (this.dataSource[i][this.header[j]["dataIndex"]].toString().indexOf("Date") >= 0) {
                            var value = this.dataSource[i][this.header[j]["dataIndex"]];
                            this.dataSource[i][this.header[j]["dataIndex"]] = eval("new " + value.substr(1, value.length - 2)).format(this.header[j]["exp"].replace("mm", "MM"));
                        }
                    }
                }
            }
        }
    }
};