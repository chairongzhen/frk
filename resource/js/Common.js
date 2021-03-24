var ajaxHandlerName = "/Wind.WFC.Enterprise.Web/AjaxHandler.aspx";
var ajaxSecureHandlerName = "/Wind.WFC.Enterprise.Web/AjaxSecureHandler.aspx";
var ajaxSecureUnlockHandler = "/Wind.WFC.Enterprise.Web/AjaxSecureUnlockHandler.aspx";
//init default setting
if (jQuery) {
    jQuery(function ($) {
        if ($.datepicker) {
            $.datepicker.regional['zh-CN'] = {
                showOn: "both",
                buttonImage: '/WealthManagement/Enterprise/resource/images/Company/cal.png',
                buttonImageOnly: true,
                changeYear: true,
                changeMonth: true,
                buttonText: '',
                closeText: '关闭',
                prevText: '&#x3C;上月',
                nextText: '下月&#x3E;',
                currentText: '今天',
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
                dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
                weekHeader: '周',
                dateFormat: 'yy-mm-dd',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: true,
                yearSuffix: ''
            };
            $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
        }
    });
}

if (typeof Highcharts != 'undefined' && Highcharts.setOptions) {
    Highcharts.setOptions({
        chart: {
            events: {
                //解决无法捕获Highcharts内点击事件的问题
                load: function () {
                    //.highcharts-container上的click事件会停止冒泡，故在其上绑定click事件调用父节点的click事件
                    $(this.container).click(function () {
                        $('body').focus();
                    });
                }
            }
        },
        xAxis: {
            labels: {
                style: {
                    fontSize: '12px'
                },
                title: {
                    style: {
                        fontWeight: 'normal'
                    }
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
            title: {
                style: {
                    fontWeight: 'normal'
                }
            }
        }
    });
}

//以系统浏览器打开页面
function openByBrowser(pageUrl) {
    try {
        var cmd = { func: "openie", isGlobal: 1, url: pageUrl };
        window.external.ClientFunc(JSON2.stringify(cmd));
    }
    catch (ex) {
        windowOpen(pageUrl, 800, 1200);
    }
}

function myWfcAjax1(cmd, data, successFun, errorFun, isLocal) {
    myWfcAjax(cmd, data, function (data) {
        if (data) {
            data = JSON2.parse(data);
            successFun(data);
        } else {
        }
    }, errorFun, isLocal);
}



function invokeSecureAjax(parameterArray, methodAlias, onComplete, onError) {
    var dataParameters = { MethodAlias: methodAlias, Parameter: parameterArray };
    AjaxRequest(ajaxSecureUnlockHandler, dataParameters, onComplete, onError);
}

function secureAjaxRequest(method, parameterArray, funcSuccess, funcFailure) {
    var dataParameters = { MethodAlias: method, Parameter: parameterArray };
    AjaxRequest(ajaxSecureUnlockHandler, dataParameters, function (data, textStatus, jqXHR) {
        if (textStatus == 'success' && data && data.State == 0 && data.Data != null) {
            if (funcSuccess) {
                funcSuccess(data.Data);
            }
        } else {
            if (data && data.ErrorMessage) {
                if (funcFailure) {
                    funcFailure(data.ErrorMessage);
                } else {
                    showErrorMsg(data.ErrorMessage);
                }
            } else {
                if (funcFailure) {
                    funcFailure();
                } else {
                    showErrorMsg("获取数据失败！");
                }
            }
        }
    },
        function (xmlHttpRequest, textStatus, errorThrown) {
            if (funcFailure) {
                funcFailure();
            } else {
                var msg = xmlHttpRequest == null ? xmlHttpRequest : (xmlHttpRequest.responseXML == null ? xmlHttpRequest.responseXML : xmlHttpRequest.responseXML.URL);
                //showErrorMsg("执行方法超时：URL:" + xmlHttpRequest.responseXML.URL + " textStatus:" + textStatus + " errorThrown:" + errorThrown);
                //这里考虑发送错误信息至服务器端
            }
        }
    );
}

//弹出窗口
function windowOpen(url, title, height, width) {
    var iTop = (window.screen.height - 30 - height) / 2 - 50;       //获得窗口的垂直位置;  
    var iLeft = (window.screen.width - 10 - width) / 2;        //获得窗口的水平位置;

    window.open(url, title, 'height=' + height + ',width=' + width + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=yes, resizable=no,location=no, status=no');
}

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外 
//使用方法：$(window).keydown(banBackSpace);
function banBackSpace(e) {
    var ev = e || window.event; //获取event对象    
    var obj = ev.target || ev.srcElement; //获取事件源    
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型  
    //获取作为判断条件的事件类型    
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    //处理undefined值情况    
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
    vDisabled = (vDisabled == undefined) ? true : vDisabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，     
    //并且readOnly属性为true或disabled属性为true的，则退格键失效   
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";     //判断
    if (flag2 || flag1)
        e.preventDefault();
}

function getServerInfo(name) {
    var ip = "";
    try {
        var clientFuncStr = "{func=serverinfo,isGlobal=1,name='{0}'}";
        var ipresult = window.external.ClientFunc(clientFuncStr.format(name)).toJSON();
        if (ipresult != null) {
            ip = ipresult.serverInfoAddress;
        }
    } catch (ex) { }
    return ip;
}

//*********************判断方法结开始****************************************************
/*
数据验证，使用方法：
验证邮箱地址：if($("body").CheckMailAddress($(obj).val()))  return false;
验证值是否为空： if(!$("body").CheckEmpty("#Id","用户名"))  return false;
判断两个控件的值是否相等：  if(!$("body").CheckEnqualValue("#Id1","#Id2","两次输入的密码"))  return false;
取字符的长度：$("body").GetCharacterLength("abc") ，一个汉字两个字符的长度
*/
(function ($) {
    var setting = {
        url: "",
        msg: "关键词",
        postdata: "",
        top: "270",
        right: "110",
        storageControl: "",
        chkName: "",
        showInfo: ""
    }
    //去掉所有的空格
    $.fn.CutWhitespace = function (value) {
        var parttern = /\s|　|&nbsp(;)?/gi;
        return value.replace(parttern, "");

    }
    $.fn.CheckMailAddress = function (email) {
        var pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!pattern.test(email)) {
            return false;
        } else
            return true;
    }
    $.fn.CheckCharacter = function (value) {
        var pattern = /[\u4e00-\u9fa5]/ig;
        if (!pattern.test(value)) {
            return false;
        } else {
            return true;
        }

    }
    //John Smith = false:不能有空格
    //张三 = false :不能有中文
    $.fn.CheckName = function (value) {
        var pattern = /^\w+$/ig;
        if (!pattern.test(value)) {
            return false;
        } else {
            return true;
        }
    }
    $.fn.CheckDouble = function (value) {
        var pattern = /^[-\+]?\d+(\.\d+)?$/;
        if (!pattern.test(value)) {
            return false;
        } else {
            return true;
        }
    }
    $.fn.CheckNumber = function (value) {
        var pattern = /^\d+$/ig;
        return pattern.test(value);
    }
    $.fn.CheckEmpty = function (obj, msg) {
        var v = $(obj).val().replace(/(^\s*)|(\s*$)/g, "");
        if (v == null || v == "") {
            if ($.trim(msg) != "")
                alert(msg + "不允许为空");
            $(obj).focus();
            return false;
        }
        return true;
    }
    $.fn.CheckEmptyWay = function (obj) {
        var v = $(obj).val().replace(/(^\s*)|(\s*$)/g, "");
        if (v == null || v == "") {
            return false;
        }
        return true;
    }
    $.fn.CheckEnqualValue = function (control, objControl, msg) {
        if ($.trim($(control).val()) != $.trim($(objControl).val())) {
            if ($.trim(msg) != "")
                alert(msg + "不一致");
            return false;
        }
        return true;
    }
    $.fn.CheckURL = function (val) {
        var strregex = "^((https|http|ftp|rtsp|mms)?://)"
                    + "?(([0-9a-za-z_!~*'().&=+$%-]+: )?[0-9a-za-z_!~*'().&=+$%-]+@)?" //ftp的user@   
                    + "(([0-9]{1,3}.){3}[0-9]{1,3}" // ip形式的url- 199.194.52.184   
                    + "|" // 允许ip和domain（域名）   
                    + "([0-9a-za-z_!~*'()-]+.)*" // 域名- www.   
                    + "([0-9a-za-z][0-9a-za-z-]{0,61})?[0-9a-za-z]." // 二级域名   
                    + "[a-za-z]{2,6})" // first level domain- .com or .museum   
                    + "(:[0-9]{1,4})?" // 端口- :80   
                    + "((/?)|"
                    + "(/[^s]+)+/?)$";
        // var strss = "[a-zA-z]+://[^s]*";
        var re = new RegExp(strregex, "ig");
        var reg = new RegExp("^[a-zA-Z]*([_a-zA-Z])*?$", "ig");
        if (re.test(val)) {
            if (!reg.test(val)) {
                return true;
            }
        }
        return false;
    }
    $.fn.DeleteItem = function (option) {
        $.extend(setting, option);
        var modal = '<div class="tips_red tipsPosition radius" style="top:' + setting.top + 'px; right:' + setting.right + 'px;" id="divModal">\
          <div class="Close"><a href="#" onclick=\'$("#divModal").hide();$("#divModal").remove();\'>关闭<\/a><\/div>\
          <h2>友情提示：<\/h2>\
          <p>删除操作将无法还原，您确定要删除这个' + setting.msg + '么？<\/p>\
          <div style="text-align:right; padding-top:10px"><input type="button" value="确定" class="btnMin2" onclick=\'$("body").SureDelete({url:"' + setting.url + '",postdata:"' + setting.postdata + '" });\' \/> <input type="button" value="取消" class="btnMin2_Green" onclick=\'$("#divModal").hide();$("#divModal").remove();\' \/><\/div>\
       <\/div>';
        $('body').append(modal);
    }

    $.fn.SureDelete = function (option) {
        $.extend(setting, option);
        $.ajax({
            type: "POST",
            url: setting.url,
            data: setting.postdata,
            success: function (msg) {
                if ($.trim(msg) == "success")
                    location.replace(location);
            }
        });
    }
    $.fn.GetChkItem = function (option) {
        $.extend(setting, option);
        var chkValue = "";
        $("input[type='checkbox'][name='" + setting.chkName + "']").each(function () {
            if ($(this).attr("checked"))
                chkValue += $(this).val() + ",";
        });

        if ($.trim(chkValue) != "") {
            $(setting.storageControl).val(chkValue.substring(0, chkValue.length - 1));
        } else
            return false;
        return true;
    }

    $.fn.GetChkDataItem = function (option) {
        $.extend(setting, option);
        var chkValue = "";
        $("input[type='checkbox'][name='" + setting.chkName + "']").each(function () {
            if ($(this).attr("data"))
                chkValue += $(this).val() + ",";
        });

        if ($.trim(chkValue) != "") {
            $(setting.storageControl).val(chkValue.substring(0, chkValue.length - 1));
        } else
            return false;
        return true;
    }


    $.fn.GetChkIdItem = function (option) {
        $.extend(setting, option);
        var chkValue = "";
        $("input[type='checkbox'][name='" + setting.chkName + "']").each(function () {
            if ($(this).attr("checked"))
                chkValue += $(this).attr("id") + ",";
        });

        if ($.trim(chkValue) != "") {
            $(setting.storageControl).val(chkValue.substring(0, chkValue.length - 1));
        } else
            return false;
        return true;
    }
    $.fn.GetChkRadioIdItem = function (option) {
        $.extend(setting, option);
        var chkValue = "";
        $("input[type='radio'][name='" + setting.chkName + "']").each(function () {
            if ($(this).attr("checked"))
                chkValue += $(this).attr("id") + ",";
        });

        if ($.trim(chkValue) != "") {
            $(setting.storageControl).val(chkValue.substring(0, chkValue.length - 1));
        } else
            return false;
        return true;
    }


    $.fn.ChkItem = function (option) {
        $.extend(setting, option);
        var chkValue = "";
        $("input[type='checkbox'][class='" + setting.chkName + "']").each(function () {
            if ($(this).attr("checked"))
                chkValue += $(this).val() + ",";
        });
        if ($.trim(chkValue) != "") {
            $(setting.storageControl).val(chkValue.substring(0, chkValue.length - 1));
        } else
            return false;
        return true;
    }

    $.fn.GetCharacterLength = function (str) {
        var reg = /[\u4e00-\u9fa5]/ig;
        var arr = str.match(reg);
        var len = 0;
        if (arr != null) {
            for (var i = 0; i < arr.length; i++) {
                str = str.replace(arr[i], "");
            }
            len = arr.length * 2;
        }
        return str.length + len;
    }
    $.fn.KeyEnterClick = function (target, clickTarget) {
        $(target).keydown(function () {
            if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
                $(clickTarget).click();
                event.returnValue = false;
            }
        });
    }
    $.fn.SetAllChecked = function (option) {
        $.extend(setting, option);
        $("input[type='checkbox'][name='" + setting.chkName + "']").each(function () {
            if (!$(this).attr("checked"))
                $(this).attr("checked", true);
        });
    }
    $.fn.SetAllUnChecked = function (option) {
        $.extend(setting, option);
        $("input[type='checkbox'][name='" + setting.chkName + "']").each(function () {
            if ($(this).attr("checked"))
                $(this).attr("checked", false);
        });
    }
    $.fn.SetCheckItem = function (option) {
        $.extend(setting, option);
        $("input[type='checkbox'][name='" + setting.chkName + "']").each(function () {
            $(this).attr("checked", !$(this).attr("checked"));
        });
    }
    $.fn.LogOut = function (option) {
        $.extend(setting, option);
        $.ajax({
            type: "POST",
            url: setting.url,
            data: "type=logout",
            success: function () {
                $(setting.storageControl).html("");
                window.location.href = "/MemberAccount/UserLogin.aspx";
            }
        });
    }
    $.fn.GetMemberInfo = function (option) {
        $.extend(setting, option);
        $.ajax({
            type: "POST",
            url: setting.url,
            data: "type=info",
            success: function (msg) {
                if ($.trim(msg) != "")
                    $(setting.storageControl).html(msg);
            }
        });
    }
    $.fn.ShowRemind = function (option) {
        $.extend(setting, option);
        if ($.trim(setting.showInfo) != "")
            $(setting.storageControl).html(setting.showInfo).fadeIn();
        else
            $(setting.storageControl).fadeIn();
        setTimeout('$("' + setting.storageControl + '").fadeOut();', 2000);
        return false;
    }
    $.fn.GetDateDiff = function (sDate1, sDate2) {
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为12-18-2002格式
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);  //把相差的毫秒数转换为天数
        return iDays;
    }
    $.fn.CheckDateRange = function (beginDate, endDate) {
        var aDate = beginDate.split("-");
        var oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //结束日期
        aDate = endDate.split("-");
        var oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);    //开始日期
        if (oDate1 > oDate2) {
            //            alert("'结束日期'必须大于'开始日期'!");
            return false;
        }
        return true;
    }
    $.fn.GetCityInfo = function (option) {
        $.extend(setting, option);
        $.ajax({
            type: "POST",
            url: setting.url,
            data: setting.postdata,
            success: function (msg) {
                if ($.trim(msg) != "") {
                    $(setting.storageControl).html(msg);



                }

            }
        });
    }

})(jQuery);

/*数据验证方法补充*/
function CheckName(n) { return n.replace(/(^(\s|　)+)|((\s|　)+$)/g, "").length > 0; }
function CheckMobileNum(n) { return (/^1\d{10}$/).test(n); }
function CheckDate(s) { return (/^(([1-9]\d{3}|\d[1-9]\d{2}|\d{2}[1-9]\d|\d{3}[1-9])-((0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01])|(0?[469]|11)-(0?[1-9]|[12]\d|30)|0?2-(0?[1-9]|1\d|2[0-8]))|(\d{2}([13579][26]|[2468][048]|0[48])|([13579][26]|[2468][048]|0[48])00)-0?2-(0?[1-9]|[12]\d))$/).test(s); }
function CheckCredentialsNumber(cType, cNumber) {
    if (cType == '0' || cType == 0)
        return (/(^\d{17}(\d|X|x)$)/).test(cNumber);
    else
        return cNumber.length <= 50;
}

/*数据验证方法补充 end*/

//for fix bug 0073024
function removeIpadBlank() {
    if (isMobile()) {
        $('input[type="text"]').add('textarea').blur(function () {
            var reg = new RegExp(String.fromCharCode(8198), "g");
            $(this).val($(this).val().replace(reg, ''));
        });
    }
}

function isMobile() {
    if (navigator && navigator.userAgent)
        return !!navigator.userAgent.match(/Mobile/i) || !!navigator.userAgent.match(/Android/i);
    return false;
}

function showAlert(msg, title) {
    if ($('#dialogAlert').length == 0) {
        $('<div id="dialogAlert"><div><p><span class="ui-icon ui-icon-alert" style="float:left; margin-right:4px;"></span><span></span></p></div></div>').appendTo('body');
    }
    $('#dialogAlert p span:eq(1)').text(msg);
    $('#dialogAlert').dialog({
        title: title || '提示',
        resizable: false,
        dialogClass: 'dialogAlert',
        minHeight: 0,
        modal: true,
        buttons: {
            "确定": function () {
                $(this).dialog("close");
            }
        }
    });
}

function showConfirm(msg, title, func, funCancel) {
    if ($('#dialogAlert').length == 0) {
        $('<div id="dialogAlert"><div><p><span class="ui-icon ui-icon-alert" style="float:left; margin-right:4px;"></span><span></span></p></div></div>').appendTo('body');
    }
    $('#dialogAlert p span:eq(1)').text(msg);
    $('#dialogAlert').dialog({
        title: title || '提示',
        resizable: false,
        dialogClass: 'dialogAlert',
        minHeight: 0,
        modal: true,
        buttons: {
            "确定": function () {
                if (typeof func == 'function') {
                    func();
                }
                $(this).dialog("close");
            },
            "取消": function () {
                if (typeof funCancel == 'function') {
                    funCancel();
                }
                $(this).dialog("close");
            }
        }
    });
}

function showErrorMsg() {
    //用一种比较轻量的提示方式，防止打扰用户
}

//数字增加千位符，如果是整数，后面加上小数点并且保留两位小数
function milliFormat1(num) {
    if (num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    } else {
        return "";
    }
}

function parentResize() {
    if (window.parent && window.parent !== window && typeof window.parent.onResize == 'function') {
        window.parent.onResize();
    }
}

//展示遮罩
function showMask() {
    $("body").block();
}
//隐藏遮罩
function hideMask() {
    $("body").unblock({
        fadeOut:0
    });
    parentResize();
}

function stopEvent() {
    var e = window.event || arguments.callee.caller.arguments[0];
    //如果提供了事件对象，则这是一个非IE浏览器
    if (e && typeof e.preventDefault == 'function') {
        //阻止默认浏览器动作(W3C) 
        e.preventDefault();
    } else if (window.event) {
        //IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
    }
}

function showSelectDiv(divBlock, ctrl, closeFunction) {
    var result = getLeftTop(ctrl);
    var blockObj = document.getElementById(divBlock);
    blockObj.style.left = result.x + "px";
    blockObj.style.top = result.y + "px";
    blockObj.style.display = "block";
    Utils.event.clickBlankOutOfTarget(divBlock, "mousedown", closeFunction, this); //点击空白区域关闭弹出窗体
}

function getLeftTop(ctrl) {
    var obj = document.getElementById(ctrl);
    var x = obj.offsetLeft, y = obj.offsetTop;
    var coordinates = new Object();
    while (obj = obj.offsetParent) {
        y += obj.offsetTop;
        x += obj.offsetLeft;
    }
    coordinates.x = x + 1;
    coordinates.y = y + document.getElementById(ctrl).offsetHeight;
    return coordinates;
}

/*自定义扩展 , 依赖jquery*/
$.fn.extend({
    placeholder: function (opt) {
        var ele = $(this);
        opt = opt || {};
        var placeholder = opt.placeholder || ele.attr('placeholder');
        if (placeholder) {
            ele.attr('placeholder', placeholder);
            if (!('placeholder' in document.createElement('input'))) {

                if (ele.val() == '') {
                    ele.val(placeholder).addClass('placeholder').blur();
                }

                ele.bind('focus.placeholder', function () {
                    var self = $(this);
                    if (self.val() == placeholder) {
                        self.val('').removeClass('placeholder');
                    }
                });

                ele.bind('blur.placeholder', function () {
                    var self = $(this);
                    if (self.val() == '') {
                        self.val(placeholder).addClass('placeholder');
                    }
                });
            }
        }
        return ele;
    }
});

function setPanelPosOuter($panel, $btn, opt) {
    opt = opt || {};
    var pos = $btn.position();
    $panel.css({
        left: pos.left + $btn.outerWidth() - $panel.outerWidth() + (opt.x || 0),
        top: pos.top + $btn.outerHeight() + (opt.y || 0)
    });
}

function setPanelPosInner($panel, $contaner, opt) {
    $contaner = $contaner || $(window);
    $contaner.css('position', 'relative');
    opt = opt || { x: 'center', y: 'center' };
    var top = 0, left = 0;
    $panel.css({
        left: opt.x == 'center' ? (parseInt(($contaner.width() - $panel.outerWidth()) / 2) || 0) : opt.x,
        top: opt.y == 'center' ? (parseInt(($contaner.height() - $panel.outerHeight()) / 2) || 0) : opt.y
    });
}

function locUrl(url) {
    window.location.href = url;
}

//自定义，增加decodeURIComponent
function getParameter(param) {
    var result = location.search.match(new RegExp("[\?\&]" + param + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return decodeURIComponent(result[1]);
}

function isDate(temp) {
    var result = temp.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
    if (null == result) {
        return false;
    } else {
        return true;
    }
}

/**
* 只能输入数字(输入字母后删除，不屏蔽字母键)
*
* @parame obj 当前控件的对象
* @parame num 可以输入的小数位数
* @parame evt 考虑到火狐浏览器的兼容性
* @parame isF 是否可以加-
*/
function islitterNum(obj, num, evt, isF) {
    if (num == undefined)
        num = 2;
    evt = evt ? evt : (window.event ? window.event : null);
    if (evt.keyCode == 37 || evt.keyCode == 39)//向左或向右移动光标
        return true;

    obj.style.imeMode = "disabled";
    var inputValue = obj.value;

    inputValue = inputValue.replace(/^00+/g, '0').replace(/^\-\.+/g, '-');
    if (num == 0) {
        inputValue = inputValue.replace(/\.+/g, '');
    }
    else {
        if (inputValue.indexOf(".") > 1) {
            var strArray = inputValue.split('.');
            inputValue = "";
            for (var i = 0; i < strArray.length; i++) {
                inputValue += strArray[i] + (i == 0 ? "." : "");
            }
        }
        inputValue = inputValue.replace(/\.\.+/g, '.').replace(/^\.+/g, '');
    }

    if (inputValue.length == 1) {
        inputValue = inputValue.replace(/\.+/g, '');
    }
    if (!isF) {
        inputValue = inputValue.replace(/\-+/g, '');
    }
    else {
        inputValue = inputValue.replace(/^\-+/g, '-');
        var strB = inputValue.substr(0, 1);
        var strE = inputValue.substr(1, inputValue.length + 2).replace(/\-+/g, '');
        inputValue = strB + strE;
    }
    if (isNaN(inputValue)) {
        inputValue = inputValue.replace(/[^-0-9.]/g, '');
        obj.value = inputValue;
        return;
    }
    if (num == 0) {
        inputValue = inputValue.replace(/[^-0-9]/g, '');
        obj.value = inputValue;
        return;
    }
    var w = inputValue.indexOf(".");
    if (w > -1) {
        inputValue = inputValue.substr(0, w + num + 1);
    }
    inputValue = inputValue.replace(/^00+?/g, '0');
    if (inputValue.match(/^0[1-9]+?/g)) {
        inputValue = inputValue.replace(/^0+?/g, '');
    }
    obj.value = inputValue;
}

function formatMoneyString(str) {
    str = str.replace("万元", "");
    var num = Number(str);
    if (isNaN(num)) {
        return "--";
    }
    return num.toFixed(2) + "万元";
}

function formatIndustry(str) {
    if (str == null || str == "")
        return "";
    return str.replace("Wind", "").replace("Ⅱ", "");
}

/*将数据格式化*/
var Global_DoubleMaxValue = [1.7976931348623157e+308, 3.40282346638529e+38];
function getDoubleValue(numValue, amount, digit) {
    var num = Number(numValue);
    if (!num) {
        return numValue;
    }
    numValue = num;

    if (!amount) {
        amount = 1;
    }

    var digitNumber = 2; // 默认2位小数
    if (digit) {
        digitNumber = digit;
    }
    var flag = false;

    for (var i = 0; i < Global_DoubleMaxValue.length; i++) {
        if (numValue == Global_DoubleMaxValue[i]) {
            flag = true;
            break;
        }
    }
    numValue = (flag ? 0 : (numValue / amount).toFixed(digitNumber));
    return parseFloat(numValue);
}

//去掉数字千分位
function delcommafy(num) {
    if ((num + "").trim() == "") {
        return "";
    }
    num = num.replace(/,/gi, '');
    return num;
}
/*wuxiangjun 公共函数*/
$(function () {
    $(".table-company02").each(function(){
        $(this).find("tr:even").css("background", "#f9f9f9");
    })
    $(document).on("click",".show-dialog-content",function(){
        var msghtml=$(this).find(".judge-content").eq(0).html();
        var msg=msghtml?msghtml:"暂无信息";
        var tit=$(this).closest("tr").find("td").eq(1).text();
        $.layer({
          shade: [0.5, '#000'],
          title:tit,
          btns: 0,
          area: ['800px', '600px'],
          dialog: {
            msg: msg,        
            type: -1,
            btns: 0,
            area: ['600px', '400px']
          }
        });
        return false;
    });
    
})
var Common = {
    getUrlSearch: function (parama) {
        //获取url某个字段后的字符串
        var loc = location.href;
        var pattern = new RegExp(parama + '=([^&#|]+)#?')
        var patternArr = pattern.exec(loc);
        if (patternArr) {
            return patternArr[1]
        } else {
            return "";
        }
    },
    getCodeId: function () {
        //获取url的companycode和companyid
        var code=this.getUrlSearch("companycode");
        var id = this.getUrlSearch("companyid");
        return {
            "companycode": code,
            "companyid":id
        }
    },
    add0: function (m) {
        //时间数字不满10前加0
        return m < 10 ? '0' + m : m;
    },
    format: function (shijianchuo) {
        //时间戳转时间格式
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + Common.add0(m) + '-' + Common.add0(d) + ' ' + Common.add0(h) + ':' + Common.add0(mm) + ':' + Common.add0(s);
    },
    formatTime: function (time) {
        //格式化时间
        if(/(\d{4})(\d{2})(\d{2})([^\d]+)(\d{4})(\d{2})(\d{2})/.test(time)){
            return time.replace(/(\d{4})(\d{2})(\d{2})([^\d]+)((\d{4})(\d{2})(\d{2}))?/,"$1-$2-$3$4$6-$7-$8")
        }else if(/(\d{4})\/?(\d{2})\/?(\d{2})/.test(time)){
            return time.replace(/(\d{4})\/?(\d{2})\/?(\d{2})/,"$1-$2-$3")
        }else{
            return "--"
        }
        
    },
    ajaxTab: function (eachArr) {
        /*显示最普通的表格
        arr是一个数组，即表头，个字段进行ajax请求，拿到数据
        2."fields"：拿到数据后各个表格
        1.category：即cmd，查询字段，通过这需要的字段名，即表头的各列。
        4."align"：对齐情况，1是居中，别的或无值都是居左
        3."dom"：数据显示在哪里,是一个id,即所整理后的数据显示在这个id里
        4."showlen":数据显示几条
        */
        var codeId = this.getCodeId();
        var parameter = { "companyid": codeId.companyid?codeId.companyid:"", "companycode": codeId.companycode?codeId.companycode:"", "pageindex": 0,"PageNo":0,"PageSize":eachArr.showlen ? parseInt(eachArr.showlen) : "" ,"pagenum": eachArr.showlen ? parseInt(eachArr.showlen) : "" };
        myWfcAjax(eachArr.category, parameter,function (resData) {
                var res = JSON2.parse(resData);
                var $model= $("#" + eachArr.dom).parents(".widget-model");
                var $domMore = $model.find(".btn-more");
                if (res.ErrorCode == 0&&res.Data&&res.Data.length>0) {
                    var tabhtml = Common.displayTab(resData, eachArr.fields, eachArr.align, eachArr.showlen,eachArr.moduleName);
                    $("#" + eachArr.dom).html(tabhtml);
                    Common.addLink2Company(eachArr.category, eachArr.fields, eachArr.dom, res);
                    Common.addInfo2More("#"+eachArr.dom,codeId.companyid,codeId.companycode,eachArr.category);
                }
                else {
                    $domMore.hide();
                    var canNotRequest = '<tr><td colspan="' + eachArr.fields.length + '"><div class="no-data">没有找到'+(eachArr.moduleName||"")+'信息</div></td></tr>';
                    $("#" + eachArr.dom).html(canNotRequest);
                }
            });
    },
    addInfo2More:function(dom,companyid,companycode,interface){
        //给“更多”加上各种参数 
        
        var $model= $(dom).parents(".widget-model");
        var $domMore = $model.find(".btn-more");
        var $theadTh = $model.find("thead").find("th");
        var theadThStr="";
        var theadThWith="";
        var theadThArr=[];
        var theadWithArr = [];
        var widgetTitle = $model.find("a:first").text();
        $theadTh.each(function(){
            theadThArr.push($(this).text());
            theadWithArr.push($(this).attr("width"));
        })
        theadThStr=theadThArr.join(",");
        theadThWith = theadWithArr.join(",");
        if ($domMore.length > 0) {
            $domMore.eq(0).attr("href", "List.html?companyid=" + companyid + "&companycode=" + companycode + "&category=" + interface + "&theadText=" + theadThStr + "&theadWidth=" + theadThWith + "&widgetTitle=" + widgetTitle);
            $domMore.eq(0).attr("target","_blank");
        }
        $(dom + " tr:odd").css("background", "#f9f9f9");
    },
    addLink2Company: function (category, fields, dom, res) {
        var column = {
            "getshareholder": {"Name": "Name", "Code": "Id"},
            "getforeigninvest": { "Name": "InvestName", "Code": "InvestId" }
        };
        if (!!column[category]) {
            var $model = $("#" + dom);
            var index = 0;
            for (; index < fields.length; index++) {
                if (fields[index] === column[category].Name) {
                    break;
                }
            }
            if (index > fields.length) { return; }
            var trs = $model.find('tr');
            for (var i = 0; i < trs.length; i++) {
                if (!!res.Data[i][column[category].Code]) {
                    if (category === "getshareholder" && res.Data[i]["Type"] === "自然人股东") {
                        continue;
                    }
                    var tds = $(trs[i]).find('td');
                    var a = document.createElement("a");
                    a.setAttribute("target", "_blank");
                    a.setAttribute("href", "Company.html?companycode=" + res.Data[i][column[category].Code]);
                    a.innerText = tds[index].innerText;
                    tds[index].innerHTML = "";
                    $(tds[index]).append(a);
                }             
            }
        }
    },
    displayTab: function (resData, fields, align, showlen,moduleName) {
        var backData = JSON.parse(resData).Data;
        var len = backData.length > showlen ? showlen : backData.length;//数据数量
        var tbodyArr = [];
        //正则，是否是html标签
        var htmlpattern=/<(\S*?)[^>]*>.*?<\/\1>|<.*? \/>/;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                tbodyArr.push('<tr>');
                for (var j = 0; j < fields.length; j++) {
                    var alignStr = "";
                    if (align&&align[j] == 1) {
                        alignStr = "align='center'";
                    }
                    if (fields[j].indexOf("|") >= 0) {
                        //如果有"|"说明需要用函数处理传入的数值，"|"前是函数名，后面参数用逗号分开
                        var fn = fields[j].split("|")[1];//函数名
                        var zhiduan = fields[j].split("|")[0];//参数字段数组,数组第一个为需要处理的字段名,别的为需要的参数
                        var item = backData[i][zhiduan] ? backData[i][zhiduan] : "";//根据字段名拿到这个字段的数据                  
                        if (fn.indexOf(":") >= 0) {
                            //:后面是参数，多个参数用逗号隔开
                            var tempArr = fn.split(":");
                            var fn = tempArr[0];
                            var fnParamArr = tempArr[1].split(",");
                            tbodyArr.push('<td ' + alignStr + ' >' + this[fn](item, fnParamArr) + '</td>');
                        } else {
                            tbodyArr.push('<td ' + alignStr + ' >' + this[fn](item) + '</td>');
                        }
                    }else if(htmlpattern.test(fields[j])){
                        //如果传入的是html代码，直接写入表格,如<a href="#">详细</a>或者图片之类
                        tbodyArr.push('<td ' + alignStr + ' >' + fields[j] + '</td>');
                    } else if (fields[j] == 'NO.') {
                        //传入的是特别的字符'NO.',数据是序号1,2,3,4
                        tbodyArr.push('<td ' + alignStr + ' >' + (i + 1) + '</td>');
                    } else {
                        var item=backData[i][fields[j]]&&backData[i][fields[j]];   
                        if(typeof item=="string"){
                            item = (item.toLowerCase()!="undefined"&&item!="null") ? (backData[i][fields[j]]) : "";
                        }else if(item==null){
                            item="";
                        }
                        tbodyArr.push('<td ' + alignStr + ' >' + item + '</td>');
                    }
                }
                tbodyArr.push('</tr>');
            }
        } else {
            //无数据
            tbodyArr.push('<tr><td colspan="' + fields.length + '"><div class="no-data">没有找到'+(moduleName||"")+'信息</div></td></tr>');
        }
        return tbodyArr.join("")
    },
    showDetailLink: function (value, paramArr) {
        console.log(paramArr)
        return '<a target="_blank" class="link-showdetail" href="detail.html?interface=' + paramArr[0] + '&key=' + paramArr[1] + '&value=' +encodeURIComponent(value)+ '&companycode=' + paramArr[2] +'" >详细</a>'
    },
    dialogContent:function(con){
        return '<a href="#" class="show-dialog-content">查看<div class="judge-content" style="display:none">'+con+'</div></a>';
    },
    noData:function(dom){

    },
    jumpPage:function(href){
        window.location.href=href + location.search ;
    },
    num2pagename:function (num){
    //类型转中英文名，英文名用于跳转时ifame加载页面
        var num=num+"";//转字符串
        switch(num){
            case "0":
            return ["工商变更","EnterpriseChange"];
            break;
            case "1":
            return ["法院判决","Judgment"];
            break;
            case "2":
            return ["法院公告","CourtNotice"];
            break;
            case "3":
            return ["开庭公告","NoticeOfTrial"];
            break;
            case "4":
            return ["司法拍卖","JudicialSale"];
            break;
            case "5":
            return ["被执行人","TPSTE"];
            break;
            case "6":
            return ["行政处罚","Penalty"];
            break;
            case "7":
            return ["经营异常","AbnormalOperation"];
            break;
            case "8":
            return ["欠税信息","OwingTax"];
            break;
            case "9":
            return ["动产抵押","ChattelMortgage"];
            break;
            case "10":
            return ["股权出质","EquityPledge"];
            break;
            case "11":
            return ["失信信息","Dishonesty"];
            break;
            case "12":
            return ["重大税收违法","IllegalTax"];
            break;
            case "13":
            return ["税务信息","TaxInfo"];
            break;
            case "14":
            return ["抽查检查","OwingTax"];
            break;
            case "15":
            return ["严重违法","SpotCheck"];
            break;
            case "16":
            return ["商标信息","Brand"];
            break;
            case "17":
            return ["专利","Patent"];
            break;
            case "18":
            return ["软件著作权","SoftwareCopyright"];
            break;
            case "19":
            return ["作品著作权","ProductionCopyright"];
            break;
            case "20":
            return ["许可","Permission"];
            break;
            case "21":
            return ["认证","Authentication"];
            break;
            case "22":
            return ["招标","Tender"];
            break;
            case "23":
            return ["中标","Bid"];
            break;
            default:
            return [num,num];
            break;
        }
    },
    formatWebsite:function(website){
        if(website){
            var newStr=website.replace("http://","");
            newStr=newStr.replace("https://","");
            return newStr
        }else{
            return "--";
        }
        
    },
    formatMoney:function(money,arr){
        //格式化数据
        // // money:传递进来的数字，paramArr：参数,第一位是小数点后面的位数，第二个isAbb是否要除10000,true不除，flase除,第三个字段，取掉单位
        // var num = paramArr ? paramArr[0] : 2;
        // var isAbb = false;
        // //if (paramArr && paramArr[1] && typeof paramArr[1] === "string") {
        // //    isAbb = paramArr[1] == "true";
        // //}
        // //else if (paramArr && paramArr[1]) {
        // //    isAbb = paramArr[1];
        // //}    //此处存疑
        // var isAbb=paramArr&&paramArr[1]?paramArr[1]:false;
        // var unit=paramArr&&paramArr[2]?"":"万";
        // var moneyPattern=/^(\d+)\.?(\d*)([^\d]*)/;
        // var arr=moneyPattern.exec(money);
        // var returnData="--";
        // if(arr){
        //     var str01=arr[1];//小数点前面
        //     var str02=arr[2];//小数点后面数字
        //     var str03=arr[3];//小数点后面文字   
        //     if(str01.length>=5&&!isAbb){
        //         returnData=(str01/10000).toFixed(num)+unit+str03;
        //     }else{
        //         if(num==0){
        //             returnData=str01+str03;
        //         }else{
        //             returnData=str01+"."+str02.substring(0,num)+str03;
        //         } 
        //     }
        // }
        if(!money||money.toLowerCase()=="undefined"){
            return "--"
        }
        var num=arr&&arr[0]?arr[0]:4;
        var unit=arr&&arr[1]?arr[1]:"万元";
        return parseFloat(money).toFixed(num)+unit;
    },
    showRole:function(parma1,parma2){
        var companyName = parent && parent.companyName ? parent.companyName : decodeURIComponent(Common.getUrlSearch('companyname'));
        if(parma1==parma2[0]){
            return "√";
        }else{
            return "";
        }
    },
    showType:function(type){
        if(type=="1"){
            return "自然人"
        }else if(type=="2"){
            return "非自然人"
        }else{
            return type
        }
    }
}