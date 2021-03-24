var maxItem = 5000;
var isEn = false; //判断是不是英文版，是的话要转换
if (Common.getUrlSearch("lang") && Common.getUrlSearch("lang").substring(0, 2) == "en") {
    isEn = true;
}
var dae1 = null;
var dae2 = null;
setTimeout(function() {
    var langType = isEn ? 'en' : 'cn';
    dae1 = laydate.render({
        elem: `#advancedStartDate`, //指定元素
        type: 'year',
        theme: '#50afc6',
        lang: langType,
        format: langType == 'en' ? 'yyyy' : 'yyyy年以后',
        done: function(datas) {
            $('.date-filter').parent().find('.sel').removeClass('sel');
            $('.date-filter').addClass('sel');
            if (datas) {
                $('#advancedStartDate').addClass('year-selected');
                dae2.config.min = {
                    year: parseInt(datas),
                    month: 5,
                    date: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                }
            } else {
                dae2.config.min = 0;
                $('#advancedStartDate').removeClass('year-selected');
                if (!$('#advancedEndDate').val()) {
                    $('.date-filter').parent().find('.sel').removeClass('sel');
                    $('.date-filter').parent().find('.no-rick-item').addClass('sel');
                }
            }
            if (!$('#advancedEndDate').val()) {
                $('.date-filter').attr('data-val', parseInt(datas) + '年~');
            } else {
                if (parseInt(datas)) {
                    $('.date-filter').attr('data-val', parseInt(datas) + '~' + parseInt($('#advancedEndDate').val()) + '年');
                } else {
                    $('.date-filter').attr('data-val', '~' + parseInt($('#advancedEndDate').val()) + '年');
                }
            }
        },
        max: 0,
        btns: ['clear', 'confirm'],
    });
    dae2 = laydate.render({
        elem: `#advancedEndDate`, //指定元素
        type: 'year',
        theme: '#50afc6',
        lang: langType,
        format: langType == 'en' ? 'yyyy' : 'yyyy年以前',
        done: function(datas) {
            $('.date-filter').parent().find('.sel').removeClass('sel');
            $('.date-filter').addClass('sel');
            if (datas) {
                $('#advancedEndDate').addClass('year-selected');
                dae1.config.max = {
                    year: parseInt(datas),
                    month: 11,
                    date: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                }
            } else {
                $('#advancedEndDate').removeClass('year-selected');
                if (!$('#advancedStartDate').val()) {
                    $('.date-filter').parent().find('.sel').removeClass('sel');
                    $('.date-filter').parent().find('.no-rick-item').addClass('sel');
                }
                var nowTime = new Date();
                dae1.config.max = {
                    year: nowTime.getFullYear(),
                    month: 11,
                    date: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                }
            }
            if (!$('#advancedStartDate').val()) {
                $('.date-filter').attr('data-val', '~' + parseInt(datas) + '年');
            } else {
                if (parseInt(datas)) {
                    $('.date-filter').attr('data-val', parseInt($('#advancedStartDate').val()) + '~' + parseInt(datas) + '年');
                } else {
                    $('.date-filter').attr('data-val', parseInt($('#advancedStartDate').val()) + '年~');
                }

            }
        },
        max: 0,
        btns: ['clear', 'confirm'],
        // min:{
        //     year: 2014,
        //     month: 0,
        //     date: 0,
        //     hours: 0,
        //     minutes: 0,
        //     seconds: 0,
        // },
    });
}, 100);
$(function() {
    var type = Common.getUrlSearch("type");
    if (type && type === 'innerTest') {
        $('.inner-test').show();
    }
})
$(document).on('mouseover', '.sort-dialog-corp-header', function() {
    $(this).find('.sort-dialog-corp-desc').show();
})
$(document).on('mouseout', '.sort-dialog-corp-header', function() {
    $(this).find('.sort-dialog-corp-desc').hide();
})
$(document).on('click', '.sort-dialog-corp-header li', function() {
    $this = $(this);
    var value = $this.attr("data-type")
    $parents = $this.parents(".sort-dialog-corp-header").eq(0);
    $box = $this.parents(".sort-dialog-corp-desc").eq(0);
    var typeTxt = $this.text();
    $parents.find(".wi-link-color").text(typeTxt);
    $parents.attr("data-condition-value", value);
    $box.hide();
    return false;
})
$(document).on('click', '.sort-dialog-corp-header', function() {
    return false;
})
$(function() {
    //顶部搜索/预搜索相关
    var historySearchList = [];
    var serachtimer; // 监听输入定时器
    Common.getCommonHistoryKey(historySearchList);
    $('#btnToolbarSearch').click(function(event) {
        //搜索按钮
        var keyword = $.trim($('#inputToolbarSearch').val());
        if (keyword.length && !$('#inputToolbarSearch').hasClass('placeholder')) {
            //深度搜索
            var companyname = encodeURI(keyword);
            var url = "SearchHomeList.html?linksource=CEL&keyword=" + keyword;
            $("#inputToolbarSearch").val(keyword);
            document.location.href = url;
        } else {
            $('#inputToolbarSearch').focus();
        }
    });
    /**
     * 回车事件监听
     */
    $('.input-toolbar-search').placeholder().keydown(function(event) {
        //搜索框placehoder及回车后执行搜索事件
        switch (event.keyCode) {
            case 13:
                if ($(this).val().length) {
                    //搜索按钮
                    var keyword = $('.input-toolbar-search').val();
                    // window.open("SearchHomeList.html?linksource=CEL&linksource=CEL&keyword=" + keyword);
                    location.href = "SearchHomeList.html?linksource=CEL&linksource=CEL&keyword=" + keyword;
                }
                return false;
                break;
        }
    });
    $(document).on('click', '.paginate_button', function(event) {
        $('html, body').animate({
            scrollTop: 0
        }, 200);
    })
    $(document).on('click', '.underline.wi-secondary-color.wi-link-color', function(event) {
        var target = event.target;
        var code = $(target).attr('data-code');
        Common.linkCompany("Bu3", code);
        return false;
    });



    $(document).bind("click", function(e) {
        //如果点击事件的父层不是更多标签的话，就隐藏下拉框
        if ($((e.target || e.srcElement)).closest(".search-inputarea,.input-toolbar-search-list,.more-labels,.toolbar-search").length == 0) {
            $('.input-toolbar-search-list').removeClass('active');
            $('.input-toolbar-before-search').removeClass('active');
        }
    });

    $(document).bind("click", function(e) {
        //如果点击事件的父层不是更多标签的话，就隐藏下拉框
        if ($((e.target || e.srcElement)).closest(".sel-city-industry").length == 0) {
            $('.list-sel-city').hide();
        }
    });

});
$(document).on("click", ".customer-btn", function(event) {
    //注册资金及成立日期自定义按钮
    var unit = $(this).attr("data-unit")
    var $parent = $(this).parents(".custom-dialog").eq(0);
    var $firstInput = $parent.find(".custom-money").eq(0);
    var $secondInput = $parent.find(".custom-money").eq(1);
    var $customText = $parent.prev(".customer-text").eq(0);
    var $btnCustom = $(this).parents(".btn-custom").eq(0);
    var firstInputVal = $.trim($firstInput.val());
    var secondInputVal = $.trim($secondInput.val());
    var regExp = /^((0?)|([1-9]\d*))$/;
    if (regExp.test(firstInputVal) && regExp.test(secondInputVal)) {
        if (firstInputVal == "" && secondInputVal == "") {
            $parent.hide();
        } else if (firstInputVal == "" && secondInputVal != "") {
            $secondInput.val(secondInputVal);
            $customText.html(secondInputVal + unit + "以下");
            $parent.hide();
            $parent.parents(".btn-custom").addClass("sel").siblings().removeClass("sel");
            $btnCustom.attr("data-val", "~" + secondInputVal + unit);
        } else if (firstInputVal != "" && secondInputVal == "") {
            $firstInput.val(firstInputVal);
            $customText.html(firstInputVal + unit + "以上");
            $parent.hide();
            $parent.parents(".btn-custom").addClass("sel").siblings().removeClass("sel");
            $btnCustom.attr("data-val", firstInputVal + unit + "~");
        } else {
            firstInputVal = parseInt(firstInputVal);
            secondInputVal = parseInt(secondInputVal);
            if (firstInputVal > secondInputVal) {
                layer.msg($(this).attr("data-type") + "范围不正确");
            } else {
                $firstInput.val(firstInputVal);
                $secondInput.val(secondInputVal);
                $customText.html(firstInputVal + "-" + secondInputVal + unit);
                $parent.hide();
                $parent.parents(".btn-custom").addClass("sel").siblings().removeClass("sel");
                $btnCustom.attr("data-val", firstInputVal + "~" + secondInputVal + unit);
            }
        }
    } else {
        layer.msg($(this).attr("data-type") + "范围不正确");
    }
    event.stopPropagation();
})
$(document).on("click", ".btn-custom", function() {
    //自定义按钮
    $(this).find(".custom-dialog").show();
})
$(document).on("click", ".customer-cancel", function(event) {
    //自定义按钮取消
    $(this).parents(".btn-custom").eq(0).find(".custom-dialog").hide();
    event.stopPropagation();
})
$(document).on("click", ".each-item", function(item) {
    //单选
    $(this).toggleClass("sel").siblings().removeClass("sel");
    if ($(this).parent().parent().attr('id') == 'createDate') {
        $('#advancedStartDate,#advancedEndDate').removeClass('year-selected');
        $('#advancedStartDate,#advancedEndDate').val('');
        $('.date-filter').attr('data-val', '');
    }
    $parent = $(this).parent();
    if ($parent.find(".customer-text") && $parent.find(".customer-text").text() != "自定义") {
        $parent.find(".customer-text").text(intl('25405' /* 自定义 */ ))
    }
    if ($parent.find(".btn-custom")) {
        $parent.find(".custom-dialog").hide();
    }
})
$(document).on("click", ".each-item02", function(item) {
    //多选
    $(this).toggleClass("sel");
    $parent = $(this).parent();
    if ($(this).is(".no-rick-item")) {
        $(this).siblings().removeClass("sel");
    }
    if ($(this).siblings().is(".no-rick-item")) {
        $(this).siblings(".no-rick-item").removeClass("sel");
    }
})
$(document).on("click", ".sort-th", function() {
    //列表页排序
    var paramsArr = window.localStorage.selStorage.split("&");
    var parameter = {};
    for (var i = 0; i < paramsArr.length; i++) {
        var key = paramsArr[i].split("=")[0];
        var val = paramsArr[i].split("=")[1];
        parameter[key] = val;
    }
    var orderName = $(this).attr("data-val");
    var sortOrder = 'desc';
    if (orderName == parameter['sortField']) {
        switch (parameter['sortOrder']) {
            case 'desc':
                sortOrder = 'asc';
                parameter["sortField"] = orderName;
                parameter["sortOrder"] = sortOrder;
                break
            case 'asc':
                delete parameter["sortField"];
                delete parameter["sortOrder"];
                break;
            default:
                sortOrder = 'desc';
                parameter["sortField"] = orderName;
                parameter["sortOrder"] = sortOrder;
                break;
        }
    } else {
        parameter["sortField"] = orderName;
        parameter["sortOrder"] = sortOrder;

    }
    var searchArr = [];
    for (item in parameter) {
        var tmpStr = item + "=" + parameter[item];
        searchArr.push(tmpStr);
    }
    window.localStorage.selStorage = searchArr.join("&");
    // window.location.href = "ShowSearchList.html";
    // var oHtml = '<table class="table-company" id="tableAdvancedList"><thead><th width="5%" align="left">' + intl('138741' /*序号*/ ) + '</th><th width="20%" align="left" data-val="corp_name">' + intl('32914' /*公司名称*/ ) + '</th><th width="5%" align="left" class="sort-th" data-val="city">' + intl('2901' /*城市*/ ) + '</th><th width="10%" align="left" class="sort-th" data-val="industry_gb_2">' + intl('31801' /*行业*/ ) + '</th><th width="12%" align="right" class="sort-th" data-val="register_capital">' + intl('138768' /* 注册资本(万元) */ ) + '</th><th width="10%" align="left" class="sort-th" data-val="established_time">' + intl('138860' /* 成立日期 */ ) + '</th><th width="14%" align="left" data-val="register_address">' + intl('35776' /* 注册地址 */ ) + '</th><th width="7%" align="left" class="sort-th" data-val="artificial_person">' + intl('5529' /*法定代表人*/ ) + '</th><th width="7%" align="left" data-val="tel">' + intl('138880' /*公司电话*/ ) + '</th><th width="9%" align="left" class="sort-th" data-val="govlevel">' + intl('138416' /*经营状态*/ ) + '</th></thead><tbody id="tbodyAdvancedList"><tr><td colspan="10" class="loading-data">' + intl('139612' /*数据加载中*/ ) + '</td></tr></tbody></table>';

    // TODO 暂时屏蔽排序功能
    var oHtml = '<table class="table-company" id="tableAdvancedList"><thead><th width="5%" align="left">' + intl('138741' /*序号*/ ) + '</th><th width="17%" align="left" data-val="corp_name">' + intl('32914' /*公司名称*/ ) + '</th><th width="5%" align="left" class="sort-thno" data-val="city">' + intl('2901' /*城市*/ ) + '</th><th width="10%" align="left" class="sort-thno" data-val="industry_gb_2">' + intl('31801' /*行业*/ ) + '</th><th width="12%" align="right" class="sort-thno" data-val="register_capital">' + intl('138768' /* 注册资本(万元) */ ) + '</th><th width="10%" align="left" class="sort-thno" data-val="established_time">' + intl('138860' /* 成立日期 */ ) + '</th><th width="14%" align="left" data-val="register_address">' + intl('35776' /* 注册地址 */ ) + '</th><th width="7%" align="left" class="sort-thno" data-val="artificial_person">' + intl('5529' /*法定代表人*/ ) + '</th><th width="7%" align="left" data-val="tel">' + intl('138880' /*公司电话*/ ) + '</th><th align="left" class="sort-thno" data-val="govlevel">' + intl('138416' /*经营状态*/ ) + '</th></thead><tbody id="tbodyAdvancedList"><tr><td colspan="10" class="loading-data">' + intl('139612' /*数据加载中*/ ) + '</td></tr></tbody></table>';
    $("#myTab").html(oHtml);
    advancedSearch.init();
    return false;
})
$('#inputSearchRelation01').on('focus', function(event) {
    // 显示更多标签预搜索
    val = $(this).val().trim();
    var $beforeSearchParent = $('.tag-list');
    var len = Common.getByteLen(val);
    if (len >= 4) {
        $beforeSearchParent.addClass("active");
        advancedSearch.getPreSearch(val, function(res) {
            if (res && res.length > 0) {
                var arr = [];
                for (var i = 0; i < res.length; i++) {
                    if (i > 9) {
                        break;
                    }
                    arr.push('<span data-val="' + res[i] + '" class="each-item02">' + res[i] + '</span>');
                }
                $beforeSearchParent.html(arr.join(""));
                advancedSearch.tagChange();
            }
        });

    }
});
$("#inputSearchRelation02").on('input', function(event) {
    var $beforeSearchParent = $('#tagList02');
    $(this).removeAttr("data-code");
    clearTimeout(serachtimer02);
    serachtimer02 = setTimeout(function() {
        var target = event.target;
        var val = $.trim($(target).val());
        if (val) {
            // 显示预搜索
            $("#companyFeature02").hide();
            val = val.trim();
            var len = Common.getByteLen(val);
            if (len >= 3) {
                $beforeSearchParent.addClass("active");
                advancedSearch.getPreSearch02(val, function(res) {
                    if (res && res.length > 0) {
                        var arr = [];
                        for (var i = 0; i < res.length; i++) {
                            if (i > 9) {
                                break;
                            }
                            arr.push('<span data-val="' + res[i].mainLabelName + '"  class="each-item02">' + res[i].labelName + '</span>');
                        }
                        $beforeSearchParent.show().html(arr.join(""));
                        advancedSearch.tagChange02();
                    }
                });

            }
        } else {
            $("#companyFeature02").show();
            $("#tagList02").empty();
            advancedSearch.tagChange();
            if (!historySearchList0202.length) {
                return;
            }
            for (var i = 0; i < historySearchList02.length; i++) {
                if (i > 4) {
                    return;
                }
                var ele = document.createElement('div');
                $(ele).addClass('wi-link-color');
                $(ele).text(historySearchList0202[i].keyword);
                $beforeSearchParent.append(ele);
            }
        }
    }, 300)
});
var serachtimer02; // 监听输入定时器
var historySearchList02 = [];
var historySearchList0202 = [];
$("#inputSearchRelation01").on('input', function(event) {
    var $beforeSearchParent = $('.tag-list');
    $(this).removeAttr("data-code");
    clearTimeout(serachtimer02);
    serachtimer02 = setTimeout(function() {
        var target = event.target;
        var val = $.trim($(target).val());
        if (val) {
            // 显示预搜索
            $("#companyFeature").hide();
            val = val.trim();
            var len = Common.getByteLen(val);
            if (len >= 4) {
                $beforeSearchParent.addClass("active");
                advancedSearch.getPreSearch(val, function(res) {
                    if (res && res.length > 0) {
                        var arr = [];
                        for (var i = 0; i < res.length; i++) {
                            if (i > 9) {
                                break;
                            }
                            arr.push('<span data-val="' + res[i] + '"  class="each-item02">' + res[i] + '</span>');
                        }
                        $beforeSearchParent.show().html(arr.join(""));
                        advancedSearch.tagChange();
                    }
                });

            }
        } else {
            $("#companyFeature").show();
            $("#tagList").empty();
            advancedSearch.tagChange();
            if (!historySearchList02.length) {
                return;
            }
            for (var i = 0; i < historySearchList02.length; i++) {
                if (i > 4) {
                    return;
                }
                var ele = document.createElement('div');
                $(ele).addClass('wi-link-color');
                $(ele).text(historySearchList02[i].keyword);
                $beforeSearchParent.append(ele);
            }
        }
    }, 300)
});
$(document).on("click", "#clearRelation", function() {
    $("#inputSearchRelation01").val("");
    $("#companyFeature").show();
    $("#tagList").hide();
})
$(document).on("click", "#clearRelation02", function() {
    $("#inputSearchRelation02").val("");
    $("#companyFeature02").show();
    $("#tagList02").hide();
})
$(document).on("click", "#btnCloseTag", function() {
    $("#tagsArea").hide();
})
$(document).on("click", "#btnCloseTag02", function() {
    $("#tagsArea02").hide();
})
$(document).on("click", "#addMoreTags", function() {
    $(this).addClass("sel");
    $("#tagsArea").show();
})
$(document).on("click", "#addMoreTags02", function() {
    $(this).addClass("sel");
    $("#tagsArea02").show();
})
$(document).on("click", "#companyFeature .each-item02,#tagList .each-item02", function() {
    //点击选择更多标签
    var label = $(this).text();
    var dataval = $(this).attr("data-val");
    var selLabelArr = [];
    $("#selLabels span").each(function(i, item) {
        selLabelArr.push($(item).text());
    })
    $this = $(this);
    if ($this.hasClass("sel")) {
        if (selLabelArr.indexOf(label) < 0) {
            //防止把重复的标签加到列表
            var tmpHtml = '<span data-val="' + dataval + '">' + label + '<i></i></span>'
            $("#selLabels").append(tmpHtml);
            $(".add-more-bow").show();
        }
    } else {
        $("#selLabels").find("span[data-val='" + dataval + "']").remove();
        if ($("#selLabels span").length <= 0) {
            $(".add-more-bow").hide();
        }
    }
    return false;
})
$(document).on("click", "#tagList02 .each-item02", function() {
    //点击选择更多标签
    var label = $(this).text(); // 展示值
    var labelVal = $(this).attr('data-val'); // 传递值
    var selLabelArr = [];
    $("#selLabels02 span").each(function(i, item) {
        selLabelArr.push($(item).text());
    })
    $this = $(this);
    if ($this.hasClass("sel")) {
        if (selLabelArr.indexOf(label) < 0) {
            //防止把重复的标签加到列表
            var tmpHtml = '<span data-val="' + labelVal + '">' + label + '<i></i></span>'
            $("#selLabels02").append(tmpHtml);
            $(".add-more-bow02").show();
        }
    } else {
        var selected = $("#selLabels02").find("span[data-val='" + labelVal + "']");
        Array.prototype.forEach.call(selected, function(t) {
            if ($(t).text() == label) {
                $(t).remove();
            }
        })
        if ($("#selLabels02 span").length <= 0) {
            $(".add-more-bow02").hide();
        }
    }
    return false;
})
$('#selLabels').on("click", "span", function() {
    //点击选择更多标签
    $(this).remove();
    var val = $(this).attr("data-val");
    $("#tagsArea").find(".each-item02[data-val='" + val + "']").removeClass("sel");
    if ($("#selLabels span").length <= 0) {
        $(".add-more-bow").hide();
    }
    return false;
})
$('#selLabels02').on("click", "span", function() {
    //点击选择更多标签
    $(this).remove();
    var val = $(this).text();
    var labelVal = $(this).attr('data-val');
    var selected = $("#tagsArea02").find(".each-item02[data-val='" + labelVal + "']")
    Array.prototype.forEach.call(selected, function(t) {
        if ($(t).text() == val) {
            $(t).removeClass("sel");
        }
    })
    if ($("#selLabels02 span").length <= 0) {
        $(".add-more-bow02").hide();
    }
    return false;
})
var IndustryListData = [{
        "p": "农、林、牧、渔业",
        "e": "Agriculture, Forestry, Animal Husbandry and Fishery",
        "c": [{
            "n": "农、林、牧、渔服务业"
        }, {
            "n": "渔业"
        }, {
            "n": "畜牧业"
        }, {
            "n": "林业"
        }]
    }, {
        "p": "采矿业",
        "e": "Mining and Quarrying",
        "c": [{
            "n": "其他采矿业"
        }, {
            "n": "开采辅助活动"
        }, {
            "n": "非金属矿采选业"
        }, {
            "n": "有色金属矿采选业"
        }, {
            "n": "黑色金属矿采选业"
        }, {
            "n": "石油和天然气开采业"
        }, {
            "n": "煤炭开采和洗选业"
        }]
    }, {
        "p": "制造业",
        "e": "Manufacturing",
        "c": [{
            "n": "金属制品、机械和设备修理业"
        }, {
            "n": "废弃资源综合利用业"
        }, {
            "n": "其他制造业"
        }, {
            "n": "仪器仪表制造业"
        }, {
            "n": "计算机、通信和其他电子设备制造业"
        }, {
            "n": "电气机械及器材制造业"
        }, {
            "n": "铁路、船舶、航空航天和其他运输设备制造业"
        }, {
            "n": "汽车制造业"
        }, {
            "n": "专用设备制造业"
        }, {
            "n": "通用设备制造业"
        }, {
            "n": "金属制品业"
        }, {
            "n": "有色金属冶炼及压延加工"
        }, {
            "n": "黑色金属冶炼及压延加工"
        }, {
            "n": "非金属矿物制品业"
        }, {
            "n": "橡胶和塑料制品业"
        }, {
            "n": "化学纤维制造业"
        }, {
            "n": "医药制造业"
        }, {
            "n": "化学原料和化学制品制造业"
        }, {
            "n": "石油加工、炼焦和核燃料加工业"
        }, {
            "n": "文教、工美、体育和娱乐用品制造业"
        }, {
            "n": "印刷和记录媒介复制业"
        }, {
            "n": "造纸和纸制品业"
        }, {
            "n": "家具制造业"
        }, {
            "n": "木材加工及木、竹、藤、棕、草制品业"
        }, {
            "n": "皮革、毛皮、羽毛及其制品和制鞋业"
        }, {
            "n": "纺织服装、服饰业"
        }, {
            "n": "纺织业"
        }, {
            "n": "烟草制品业"
        }, {
            "n": "酒、饮料和精制茶制造业"
        }, {
            "n": "食品制造业"
        }, {
            "n": "农副食品加工业"
        }]
    },
    {
        "p": "电力、热力、燃气及水生产和供应业",
        "e": "Production and Supply of Electricity, Heat, Gas and Water",
        "c": [{
            "n": "水的生产和供应业"
        }, {
            "n": "燃气生产和供应业"
        }, {
            "n": "电力、热力生产和供应业"
        }]
    }, {
        "p": "建筑业",
        "e": "Construction Industry",
        "c": [{
            "n": "建筑装饰和其他建筑业"
        }, {
            "n": "建筑安装业"
        }, {
            "n": "土木工程建筑业"
        }, {
            "n": "房屋建筑业"
        }]
    }, {
        "p": "批发和零售业",
        "e": "Wholesale and Retail",
        "c": [{
            "n": "零售业"
        }, {
            "n": "批发业"
        }]
    }, {
        "p": "交通运输、仓储和邮政业",
        "e": "Transportation, Warehousing and Postal Services",
        "c": [{
            "n": "邮政业"
        }, {
            "n": "仓储业"
        }, {
            "n": "管道运输业"
        }, {
            "n": "航空运输业"
        }, {
            "n": "水上运输业"
        }, {
            "n": "道路运输业"
        }, {
            "n": "铁路运输业"
        }]
    }, {
        "p": "住宿和餐饮业",
        "e": "Accommodation and Catering",
        "c": [{
            "n": "餐饮业"
        }, {
            "n": "住宿业"
        }]
    }, {
        "p": "信息传输、软件和信息技术服务业",
        "e": "Information Transmission, Software and IT Service",
        "c": [{
            "n": "软件和信息技术服务业"
        }, {
            "n": "互联网和相关服务"
        }, {
            "n": "电信、广播电视和卫星传输服务"
        }]
    }, {
        "p": "金融业",
        "e": "Financial Sector",
        "c": [{
            "n": "其他金融业"
        }, {
            "n": "保险业"
        }, {
            "n": "资本市场服务"
        }, {
            "n": "货币金融服务"
        }]
    }, {
        "p": "房地产业",
        "e": "Real Estate Industry",
        "c": [{
            "n": "房地产业"
        }]
    }, {
        "p": "租赁和商务服务业",
        "e": "Leasing and Business Services",
        "c": [{
            "n": "商务服务业"
        }, {
            "n": "租赁业"
        }]
    }, {
        "p": "科学研究和技术服务业",
        "e": "Scientific Research and Technical Services",
        "c": [{
            "n": "科技推广和应用服务业"
        }, {
            "n": "专业技术服务业"
        }, {
            "n": "研究和试验发展"
        }]
    }, {
        "p": "水利、环境和公共设施管理业",
        "e": "Water, Environment and Public Facilities Management Industry",
        "c": [{
            "n": "公共设施管理业"
        }, {
            "n": "生态保护和环境治理业"
        }, {
            "n": "水利管理业"
        }]
    }, {
        "p": "居民服务、修理和其他服务业",
        "e": "Resident Services, Repairs and Other services",
        "c": [{
            "n": "其他服务业"
        }, {
            "n": "机动车、电子产品和日用产品修理业"
        }, {
            "n": "居民服务业"
        }]
    }, {
        "p": "教育",
        "e": "Education",
        "c": [{
            "n": "教育"
        }]
    }, {
        "p": "卫生和社会工作",
        "e": "Health and Social Work",
        "c": [{
            "n": "社会工作"
        }, {
            "n": "卫生"
        }]
    }, {
        "p": "文化、体育和娱乐业",
        "e": "Culture, Sports and Entertainment",
        "c": [{
            "n": "娱乐业"
        }, {
            "n": "体育"
        }, {
            "n": "文化艺术业"
        }, {
            "n": "广播、电视、电影和影视录音制作业"
        }, {
            "n": "新闻和出版业"
        }]
    }, {
        "p": "综合",
        "e": "Composite",
        "c": [{
            "n": "综合"
        }]
    }
]
$(document).on("click", ".have-child-item", function() {
    $next = $(this).next();
    if ($next.length > 0) {
        if ($next.is(":hidden")) {
            $next.show();
            $next.closest("li").addClass("sel");
        } else {
            $next.hide();
            $next.closest("li").removeClass("sel");
        }
    }
})
$(document).on("click", ".list-sel-city i", function() {
    $next = $(this).siblings("ul");
    if ($next.length > 0) {
        if ($next.is(":hidden")) {
            $next.show();
            $next.closest("li").addClass("sel");
        } else {
            $next.hide();
            $next.closest("li").removeClass("sel");
        }
    }
})
var chooseArrCity = []; //所选城市
var chooseArrIndustry = []; //所选城市
function checkboxChange($this, $context) {
    //点击选中项
    $parentsLi = $this.closest("li"); //获取最近的li父层
    $parensLiArr = $this.parents("li");
    if ($this.prop("checked")) {
        if ($parensLiArr.length == 3) {
            var $parentsDom = $this.parent("li").parent("ul").parent("li");
            var isFull = isFullChild($parentsDom, "country");
            if (isFull) {
                $parentsDom.children(".checkbox-search-relation").attr("checked", true);
                var $parentsDom02 = $this.parent("li").parent("ul").parent("li").parent("ul").parent("li");
                var isFull = isFullChild($parentsDom02, "city");
                if (isFull) {
                    $parentsDom02.children(".checkbox-search-relation").attr("checked", true);
                }
            }
        } else if ($parensLiArr.length == 2) {
            var $parentsDom = $this.parent("li").parent("ul").parent("li");
            var isFull = isFullChild($parentsDom, "city");
            if (isFull) {
                $parentsDom.children(".checkbox-search-relation").attr("checked", true);
            }
        }
        $parentsLi.find("ul").find(".checkbox-search-relation").attr("checked", true);
    } else {
        if ($parensLiArr.length > 1) {
            $parensLiArr.children(".checkbox-search-relation").attr("checked", false);
        }
        $parentsLi.find("ul").find(".checkbox-search-relation").attr("checked", false);
    }
    addChoose($context);
}
$(document).on("change", ".checkbox-search-relation,#selCityModel", function() {
    //点击选中项
    checkboxChange($(this), $($(this).context))
})
$(document).on("change", ".checkbox-search-relation,#selIndustryModel", function() {
    //点击选中项
    checkboxChange($(this), $($(this).context))
})

function addChoose($context) {
    chooseArrCity = [];
    var $list = $context.find($(".pro-li"));
    for (var i = 0; i < $list.length; i++) {
        if ($list.eq(i).children("input").prop("checked")) {
            var input_level01 = $list.eq(i).children("input").attr("data-val") + "-1";
            chooseArrCity.push(input_level01);
        } else {
            var $cityList = $list.eq(i).find(".city-li");
            for (var j = 0; j < $cityList.length; j++) {
                var input_parents = $list.eq(i).children("input").attr("data-val");
                if ($cityList.eq(j).children("input").prop("checked")) {
                    var input_level02 = $cityList.eq(j).children("input").attr("data-val") + "-2";
                    chooseArrCity.push(input_level02);
                } else {
                    var $countryList = $cityList.eq(j).find(".country-li");
                    for (var k = 0; k < $countryList.length; k++) {
                        var input_parents02 = $countryList.eq(i).children("input").attr("data-val");
                        if ($countryList.eq(k).children("input").prop("checked")) {
                            var input_level03 = $countryList.eq(k).children("input").attr("data-val") + "-3";
                            chooseArrCity.push(input_level03);
                        }
                    }
                }
            }
        }
    }
    add2sel($context);
}
$(document).on("click", ".each-sel-item", function(event) {
    //删除某个选中项,如果全删掉的话就
    var $item = $(this).parent(".input-sel-city").find(".each-sel-item");
    if ($item.length <= 1) {
        $(this).parents(".sel-city-industry").find(".checkbox-search-relation").attr("checked", false);
        $(this).parent(".input-sel-city").html('<span class="placehold-city-industry">' + intl('138927' /* 全部 */ ) + '</span>');

    } else {
        $(this).remove();
        var val = $(this).attr("data-val");
        var oIndex = chooseArrCity.indexOf(val);
        chooseArrCity.splice(oIndex, 1);
        $(".checkbox-search-relation[data-val='" + val + "']").attr("checked", false);
        $(".checkbox-search-relation[data-val='" + val + "']").siblings("ul").find(".checkbox-search-relation").attr("checked", false);
    }
    event.stopPropagation();
})

function add2sel($context) {
    var selArr = [];
    if (!chooseArrCity || chooseArrCity.length == 0) {
        $context.find(".input-sel-city").html('<span class="placehold-city-industry">' + intl('138927' /* 全部 */ ) + '</span>');
    } else {
        $.each(chooseArrCity, function(i, item) {
            var selSplit = item.split("-");
            var eachSel = selSplit[0];
            var lev = selSplit[1];
            var oText = eachSel.split(" ")[eachSel.split(" ").length - 1];
            if ($context.attr("id") == "selIndustryModel") {
                selArr.push('<span class="each-sel-item" data-lev="' + lev + '" data-val="' + eachSel + '">' + (isEn ? Common.transIndustryLevOne2En(oText) : oText) + '<i>X</i></span>');
            } else {
                selArr.push('<span class="each-sel-item" data-lev="' + lev + '" data-val="' + eachSel + '">' + (isEn ? Common.transProvice2En(oText) : oText) + '<i>X</i></span>');
            }

        })
        $context.find(".input-sel-city").html(selArr.join(""));
    }
}

function isFullChild($dom, level) {
    var $children = $dom.find("input[data-type='" + level + "']");
    for (var i = 0; i < $children.length; i++) {
        if ((!$children.eq(i).prop("checked"))) {
            return false;
            break;
        }
    }
    return true;
}

$(document).on("click", "#advancedReset", function(item) {
    //重置
    window.localStorage.selStorage = "";
    $(".list-each-main").find(".sel").removeClass("sel");
    $(".no-rick-item").addClass("sel");
    $(".customer-text").text(intl('25405' /* 自定义 */ ));
    $("#secondIndustry,#cityList,#countryList").hide();
    $("#selLabels").empty();
    $("#inputSearchRelation01").val("");
    $(".add-more-bow").hide();
    $("#addMoreTags").removeClass("sel");
    $(".input-sel-city").html('<span class="placehold-city-industry">' + intl('138927' /* 全部 */ ) + '</span>');
    $("#tagsArea").find(".sel").removeClass("sel");
    $("#tagsArea").hide();
    $("#companyFeature").show();
    $("#tagList").empty();
    $("#keyword").val("");
    $('#advancedStartDate,#advancedEndDate').removeClass('year-selected');
    $('#advancedStartDate,#advancedEndDate').val('');
    $('.date-filter').attr('data-val', '');
    var nowTime = new Date();
    dae1.config.min = 0;
    dae1.config.max = { year: nowTime.getFullYear(), month: 11, date: 0, hours: 0, minutes: 0, seconds: 0, };
    dae2.config.min = 0;
    dae2.config.max = { year: nowTime.getFullYear(), month: 11, date: 0, hours: 0, minutes: 0, seconds: 0, };
    var $feture = $(".sort-dialog-corp-header");
    for (var i = 0; i < $feture.length; i++) {
        var orginText = $feture.eq(i).find(".wi-link-color").attr("data-name");
        $feture.eq(i).find(".wi-link-color").text(orginText);
        $feture.eq(i).removeAttr("data-condition-value");
    }
    return false;
})

$(document).on("click", ".input-sel-city,#selCityModel", function() {
    //获取城市选择列表及显示下拉框,如果已经有选项或下拉框可见，就显示下拉框就行，不需要重新读数据。
    var $context = $($(this).context);
    var $selItem = $context.find(".each-sel-item");
    //$(".list-sel-city").hide();
    var $dropList = $context.find(".list-sel-city");
    $("#selIndustryModel").find(".list-sel-city").hide();
    if ($selItem.length >= 1 || $dropList.is(":visible")) {
        $dropList.show()
    } else {
        $.getJSON("../resource/js/city.min.js", function(data) {
            var citylistArr = [];
            citylistArr.push("<ul id='cityListContainer'>")
            if (isEn) {
                for (var i = 0; i < data.citylist.length; i++) {
                    var eachProv = data.citylist[i];
                    citylistArr.push('<li data-lev="1" data-name=' + eachProv.p + ' class="pro-li"><input type="checkbox"  data-lev="1"  data-type="prov" class="checkbox-search-relation" id="check-prov0' + i + '"  data-val=' + eachProv.p + '  hidden=""><label class="choose-relation"  for="check-prov0' + i + '"></label>' + Common.transProvice2En(eachProv.p) + '</li>');
                }
            } else {
                for (var i = 0; i < data.citylist.length; i++) {
                    //省列表
                    var eachProv = data.citylist[i];
                    if (eachProv.c && eachProv.c.length > 0) {
                        citylistArr.push('<li  data-lev="1"  data-name=' + eachProv.p + ' class="pro-li"><i></i><input data-lev="1" type="checkbox" data-type="prov"  class="checkbox-search-relation" data-val=' + eachProv.p + ' id="check-prov0' + i + '" hidden=""><label class="choose-relation"  for="check-prov0' + i + '"></label><span class="have-child-item">' + eachProv.p + '</span><ul>');
                        $.each(eachProv.c, function(k, v) {
                            //城市列表
                            if (v.a && v.a.length > 0) {
                                citylistArr.push('<li data-lev="2" data-name="' + eachProv.p + ' ' + v.n + '" class="city-li"><i></i><input  data-lev="2"  type="checkbox" data-type="city" class="checkbox-search-relation" id="check-city0' + i + '-0' + k + '" hidden="" data-val="' + eachProv.p + ' ' + v.n + '"><label class="choose-relation" for="check-city0' + i + '-0' + k + '"></label><span class="have-child-item">' + v.n + '</span><ul>');
                                var currentCountryList = v.a;
                                $.each(currentCountryList, function(m, q) {
                                    //县列表
                                    citylistArr.push('<li data-lev="3"  data-name="' + eachProv.p + ' ' + v.n + ' ' + q.s + '" class="country-li"><input  data-lev="3"  data-type="country" type="checkbox" class="checkbox-search-relation" id="check-city0' + i + '-0' + k + '-0' + m + '" hidden="" data-val="' + eachProv.p + ' ' + v.n + ' ' + q.s + '"><label class="choose-relation" for="check-city0' + i + '-0' + k + '-0' + m + '"></label>' + q.s + '</li>');
                                })
                                citylistArr.push('</ul></li>');
                            } else {
                                citylistArr.push('<li data-lev="2" data-name="' + eachProv.p + ' ' + v.n + '" class="city-li"><input  data-lev="2"  type="checkbox" data-type="city" class="checkbox-search-relation" id="check-city0' + i + '-0' + k + '" hidden="" data-val="' + eachProv.p + ' ' + v.n + '"><label class="choose-relation" for="check-city0' + i + '-0' + k + '"></label>' + v.n + '</li>');
                            }
                        })
                        citylistArr.push('</ul></li>');
                    } else {
                        citylistArr.push('<li data-lev="1" data-name=' + eachProv.p + '><input type="checkbox"  data-lev="1"  data-type="prov" class="checkbox-search-relation" id="check-prov0' + i + '"  data-val=' + eachProv.p + '  hidden=""><label class="choose-relation"  for="check-prov0' + i + '"></label>' + eachProv.p + '</li>');
                    }
                }
            }
            citylistArr.push("</ul>");
            $dropList.show().html(citylistArr.join(""));
        });
    }
})
$(document).on("click", ".input-sel-city,#selIndustryModel", function() {
    //获取行业选择列表及显示下拉框,如果已经有选项或下拉框可见，就显示下拉框就行，不需要重新读数据。
    var $context = $($(this).context);
    var $selItem = $context.find(".each-sel-item");
    $("#selCityModel").find(".list-sel-city").hide();
    var $dropList = $context.find(".list-sel-city");
    if ($selItem.length >= 1 || $dropList.is(":visible")) {
        $dropList.show();
    } else {
        var citylistArr = [];
        citylistArr.push("<ul id='industryListContainer'>")
        for (var i = 0; i < IndustryListData.length; i++) {
            //一级行业列表
            var eachProv = IndustryListData[i];
            if (isEn) {
                citylistArr.push('<li data-lev="1" data-name=' + eachProv.p + ' class="pro-li"><input type="checkbox"  data-lev="1"  data-type="prov" class="checkbox-search-relation" id="checkindustry-prov0' + i + '"  data-val=' + eachProv.p + '  hidden=""><label class="choose-relation"  for="checkindustry-prov0' + i + '"></label>' + eachProv.e + '</li>');
            } else {
                if (eachProv.c && eachProv.c.length > 0) {
                    citylistArr.push('<li  data-lev="1"  data-name=' + eachProv.p + ' class="pro-li"><i></i><input data-lev="1" type="checkbox" data-type="prov"  class="checkbox-search-relation" data-val=' + eachProv.p + ' id="checkindustry-prov0' + i + '" hidden=""><label class="choose-relation"  for="checkindustry-prov0' + i + '"></label><span class="have-child-item">' + eachProv.p + '</span><ul>');
                    $.each(eachProv.c, function(k, v) {
                        //二级行业
                        citylistArr.push('<li data-lev="2" data-name=' + v.n + ' class="city-li"><input  data-lev="2"  type="checkbox" data-type="city" class="checkbox-search-relation" id="checkindustry-city0' + i + '-0' + k + '" hidden="" data-val=' + v.n + '><label class="choose-relation" for="checkindustry-city0' + i + '-0' + k + '"></label>' + v.n + '</li>');
                    })
                    citylistArr.push('</ul></li>');
                } else {
                    citylistArr.push('<li data-lev="1" data-name=' + eachProv.p + '><input type="checkbox"  data-lev="1"  data-type="prov" class="checkbox-search-relation" id="checkindustry-prov0' + i + '"  data-val=' + eachProv.p + '  hidden=""><label class="choose-relation"  for="checkindustry-prov0' + i + '"></label>' + eachProv.p + '</li>');
                }
            }

        }
        citylistArr.push("</ul>");

        $dropList.show().html(citylistArr.join(""));
    }
})
$(document).on("click", "#showHideConditionText", function() {
    $this = $(this);
    $this.toggleClass("sel");
    $this.parent().toggleClass("sel");
    if ($this.hasClass("sel")) {
        $(".condition-advance-search").show();
    } else {
        $(".condition-advance-search").hide();
    }
})
$(document).on("click", "#advancedShow", function() {
    window.localStorage.selStorage = "";
    //查看方案，跳转到方案列表
    var selJson = [];
    var selStorageObj = {};
    var $listEachMain = $(".list-each-main", parent.document);
    var keywordVal = $("#keyword").val();
    if (keywordVal) {
        selJson.push("keyword=" + keywordVal);
    }
    $listEachMain.each(function(i, item) {
        var $selArr = $(this).find(".sel");
        var selArr = [];
        $selArr.each(function(i, item) {
            if ($(this).attr("data-val")) {
                //过滤掉像城市为全部城市，或二级行业为全部的情况
                selArr.push($(this).attr("data-val"));
            }
        })
        if (selArr.length > 0) {
            if (this.id == "createDate" && $selArr.hasClass("date-filter")) {
                var tmpStr = "createDate2=" + selArr.join("|");
                selJson.push(tmpStr);
            } else {
                var tmpStr = this.id + "=" + selArr.join("|");
                selJson.push(tmpStr);
            }
        }
    })
    if ($("#selLabels>span").length > 0) {
        //window.localStorage加入更多标签
        var selLabelArr = [];
        $("#selLabels span").each(function(i, item) {
            selLabelArr.push($(item).attr("data-val"));
        })
        selJson.push("tagname=" + selLabelArr.join("|"));
    }
    if ($("#selLabels02>span").length > 0) {
        //window.localStorage加入更多标签
        var selLabelArr = [];
        $("#selLabels02 span").each(function(i, item) {
            selLabelArr.push($(item).attr('data-val'));
        })
        selJson.push("companyFeature2=" + selLabelArr.join("|"));
    }
    if ($("#selCityModel .each-sel-item").length > 0) {
        //window.localStorage加入地区标签
        var selCitylArr = [];
        $("#selCityModel .each-sel-item").each(function(i, item) {
            selCitylArr.push($(item).attr("data-val"));
        })
        selJson.push("regionInfo=" + selCitylArr.join("|"));
    }
    if ($("#selIndustryModel .each-sel-item").length > 0) {
        //window.localStorage加入行业二级菜单，如果行业全为一级或全为二级，只需要传入相应的行业即可，如果一二级混合，则一级要传入相关的全部二级，比较麻烦
        var $items = $("#selIndustryModel .each-sel-item");
        var selIndustryStr = getSelIndustry($items);
        selJson.push(selIndustryStr);
    }
    var $feture = $(".sort-dialog-corp-header");
    for (var i = 0; i < $feture.length; i++) {
        var tmpKey = $feture.eq(i).attr("data-condition-key");
        var tmpVal = $feture.eq(i).attr("data-condition-value");
        if (tmpVal == "0" || tmpVal == "1") {
            selJson.push(tmpKey + "=" + tmpVal);
        }
    }
    if (selJson.length <= 0) {
        layer.msg(intl('204406' /*请最少选择一个选项！*/ ));
    } else {
        window.localStorage.selStorage = selJson.join("&");
        var screenItemDic = {};
        selJson.forEach(function(item, index, selJson) {
            var SelForKey = item.split("=")[0];
            var SelForValue = item.split("=")[1];
            screenItemDic[SelForKey] = SelForValue;
        })
        $(".wrapper-advanced-list").show();
        // var oHtml = '<table class="table-company" id="tableAdvancedList"><thead><th width="5%" align="left">' + intl('138741' /*序号*/ ) + '</th><th width="20%" align="left" data-val="corp_name">' + intl('32914' /*公司名称*/ ) + '</th><th width="5%" align="left" class="sort-th" data-val="city">' + intl('2901' /*城市*/ ) + '</th><th width="10%" align="left" class="sort-th" data-val="industry_gb_2">' + intl('31801' /*行业*/ ) + '</th><th width="12%" align="right" class="sort-th" data-val="register_capital">' + intl('138768' /* 注册资本(万元) */ ) + '</th><th width="10%" align="left" class="sort-th" data-val="established_time">' + intl('138860' /* 成立日期 */ ) + '</th><th width="14%" align="left" data-val="register_address">' + intl('35776' /* 注册地址 */ ) + '</th><th width="7%" align="left" class="sort-th" data-val="artificial_person">' + intl('5529' /*法定代表人*/ ) + '</th><th width="7%" align="left" data-val="tel">' + intl('138880' /*公司电话*/ ) + '</th><th width="9%" align="left" class="sort-th" data-val="govlevel">' + intl('138416' /*经营状态*/ ) + '</th></thead><tbody id="tbodyAdvancedList"><tr><td colspan="10" class="loading-data">' + intl('139612' /*数据加载中*/ ) + '</td></tr></tbody></table>';
        var oHtml = '<table class="table-company" id="tableAdvancedList"><thead><th width="5%" align="left">' + intl('138741' /*序号*/ ) + '</th><th width="18%" align="left" data-val="corp_name">' + intl('32914' /*公司名称*/ ) + '</th><th width="5%" align="left" class="sort-thno" data-val="city">' + intl('2901' /*城市*/ ) + '</th><th width="8%" align="left" class="sort-thno" data-val="industry_gb_2">' + intl('31801' /*行业*/ ) + '</th><th width="12%" align="right" class="sort-thno" data-val="register_capital">' + intl('35779' /* 注册资本 */ ) + '</th><th width="10%" align="left" class="sort-thno" data-val="established_time">' + intl('138860' /* 成立日期 */ ) + '</th><th width="14%" align="left" data-val="register_address">' + intl('35776' /* 注册地址 */ ) + '</th><th width="7%" align="left" class="sort-thno" data-val="artificial_person">' + intl('5529' /*法定代表人*/ ) + '</th><th width="7%" align="left" data-val="tel">' + intl('138880' /*公司电话*/ ) + '</th><th width="13%" align="left" class="sort-thno" data-val="govlevel">' + intl('138416' /*经营状态*/ ) + '</th></thead><tbody id="tbodyAdvancedList"><tr><td colspan="10" class="loading-data">' + intl('139612' /*数据加载中*/ ) + '</td></tr></tbody></table>';
        $("#myTab").html(oHtml);
        advancedSearch.init();
        //bury
        var activeType = 'searchQyView';
        var opEntity = 'company';
        var otherParam = { 'screenItem': buryFCode.paramBuryJson('itemFilter', screenItemDic) };
        var opType = 'highSearchQy';
        buryFCode.bury(activeType, opEntity, otherParam, opType);
    }
    return false;
})

function getSelIndustry($items) {
    //判断行业是不是都属于一级或二级
    var flag = true;
    var lev = $items.eq(0).attr("data-lev");
    for (var i = 1; i < $items.length; i++) {
        if (lev != $items.eq(i).attr("data-lev"));
        flag = false;
        break;
    }
    var arr = [];
    if (flag) {
        for (var i = 0; i < $items.length; i++) {
            arr.push($items.attr("data-val"));
        }
    } else {
        for (var i = 0; i < $items.length; i++) {
            if ($items.eq(i).attr("data-lev") == 1) {
                var val = $items.eq(i).attr("data-val");
                var checkVal = $("#industryListContainer li[data-name='" + val + "']");
                var $li = checkVal.find("ul").find("li");
                for (var j = 0; j < $li.length; j++) {
                    arr.push($li.eq(j).attr("data-name"));
                }
            } else {
                arr.push($items.eq(i).attr("data-val"));
            }
        }
    }
    var selStr = "";
    if (lev == 1 && flag) {
        selStr = "industry=" + arr.join("|");
    } else {
        selStr = "subindustry=" + arr.join("|");
    }
    return selStr;
}
var advancedSearch = {
    //高级搜索及相关列表
    currentpage: 0, //当前页
    lang: {
        "sProcessing": "加载中...",
        "sZeroRecords": "暂无数据",
        "paginate": {
            "next": "&gt;",
            "previous": "&lt;"
        }
    },
    init: function() {
        //查看方案
        $("#titleAdvance").hide();
        $("#showHideCondition").show();
        $(".condition-advance-search").hide();
        $(".condition-advance-search").hide();
        $("#showHideConditionText,#showHideCondition").removeClass("sel");
        $(".wrapper-advance").addClass("wrapper-advance02")

        if (!window.localStorage.selStorage) {
            return false
        }
        var selStorage = window.localStorage.selStorage;
        var paramsArr = selStorage.split("&");
        var parameter = {};
        for (var i = 0; i < paramsArr.length; i++) {
            var key = paramsArr[i].split("=")[0];
            var val = paramsArr[i].split("=")[1];
            parameter[key] = val;
        }
        if (parameter["tagname"] && parameter["companyFeature"]) {
            parameter["companyFeature"] = parameter["companyFeature"] + "|" + parameter["tagname"];
            delete parameter.tagname;
        } else if (parameter["tagname"] && !parameter["companyFeature"]) {
            parameter["companyFeature"] = parameter["tagname"];
            delete parameter.tagname;
        }
        var hrefStr = '/Wind.WFC.Enterprise.Web/Enterprise/SearchExcelDownload.aspx' + decodeURI(location.search);
        if (!global_isRelease) {
            hrefStr = global_site + hrefStr + "&wind.sessionid=" + global_wsid;
        }
        // $("#exportCaseList").attr("href", hrefStr);
        var fields = ["NO.", "corp_name", "city", "industry_name", "register_capital", "establish_date", "register_address", "artificial_person", "tel", "status_after"]
        var alignArr = [0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
        var columnsArr = [];
        for (var i = 0; i < fields.length; i++) {
            var tmp = {};
            if (fields[i] == "NO.") {
                tmp = {
                    "data": null,
                    "render": function(data, type, full, meta) {
                        var startIndex = meta.settings._iDisplayStart;
                        return startIndex + meta.row + 1;
                    }
                }
            } else {
                tmp = { "data": fields[i] }
            }
            columnsArr.push(tmp);
        };
        var columnDefsSet = [{
                "targets": 1,
                "data": 'corp_name',
                "render": function(data, type, full, meta) {
                    return Common.addCompanyLink(data, full)
                }
            },
            {
                "targets": 4,
                "data": 'register_capital',
                "render": function(data, type, full, meta) {
                    return Common.formatMoney(data, [4, '万' + (full.capital_unit ? full.capital_unit : '')])
                }
            },
            {
                "targets": 5,
                "data": 'establish_date',
                "render": function(data, type, full, meta) {
                    return Common.formatTime(data)
                }
            },
            {
                "targets": 7,
                "data": 'artificial_person',
                "render": function(data, type, full, meta) {
                    var artificial_str = "";
                    if (data && data.split('|').length > 1) {
                        var artificialTemp = data.replace(/<em>|<\/em>/g, '');
                        artificial_person = artificialTemp.split('|')[0];
                        artificial_id = artificialTemp.split('|')[1];
                        if (artificial_id.indexOf('XXXXXX') < 0) {
                            artificial_str = '<a class="item-person wi-secondary-color wi-link-color" target="_blank" href="Person.html?id=' + artificial_id + '&name=' + artificial_person + '">' + artificial_person + '</a>'
                        } else {
                            artificial_id = '';
                            if (data.indexOf('<em') > -1 && data.indexOf('</em>') > -1) {
                                artificial_str = '<span class="item-person"><em class="wi-secondary-color">' + artificial_person + '</em></span>'
                            } else {
                                artificial_str = '<span class="item-person">' + artificial_person + '</span>'
                            }
                        }
                    } else {
                        artificial_person = data ? data : '--';
                        if (artificial_person.indexOf('<em') > -1 && artificial_person.indexOf('</em>') > -1) {
                            artificial_person = artificial_person.replace(/<em/g, '<em class="wi-secondary-color" ');
                        }
                        artificial_str = '<span class="item-person">' + artificial_person + '</span>';
                    }
                    return artificial_str;
                }
            },
            {
                "targets": 9,
                "data": 'status_after',
                "render": function(data, type, full, meta) {
                    var companystate = data ? data : "";
                    var stateColor = 'color:';
                    switch (companystate) {
                        case '撤销':
                        case '吊销':
                        case '迁出':
                        case '停业':
                        case '吊销,未注销':
                        case '吊销,已注销':
                        case '注销':
                        case '非正常户':
                        case '已告解散':
                        case '解散':
                        case '廢止':
                        case '已废止':
                        case '歇業':
                        case '破產':
                        case '破產程序終結(終止)':
                        case '合併解散':
                        case '撤銷':
                        case '已终止':
                        case '解散已清算完結':
                        case '该单位已注销':
                        case '核准設立，但已命令解散':
                            // stateColor += '#FD6F74;';
                            stateColor += '#E50113';
                            break;
                        case '成立':
                        case '存续':
                        case '在业':
                        case '正常':
                        case '其他':
                            // stateColor += '#42BA6E;';
                            stateColor += '#40BA6E';
                            break;
                        default:
                            stateColor += '#40BA6E;';
                            break;
                    }
                    var str = '<span style="' + stateColor + '" class="company-state">' + '<span class="company-state-text">' + companystate + '</span></span>'
                    return str;
                }
            }
        ]
        $("#tableAdvancedList").DataTable({
            "info": false, //当前显示几页到几页
            "lengthChange": false,
            autoWidth: false, //禁用自动调整列宽
            language: advancedSearch.lang, //提示信息
            //stripeClasses: ["odd", "even"], //为奇偶行加上样式，兼容不支持CSS伪类的场合
            processing: false, //隐藏加载提示,自行处理
            serverSide: true, //启用服务器端分页
            searching: false, //禁用原生搜索
            orderMulti: false, //启用多列排序
            order: [], //取消默认排序查询,否则复选框一列会出现小箭头
            scrollCollapse: false, //开启滚动条
            pageLength: 20, //首次加载的数据条数
            ordering: false,
            destroy: true,
            paging: true,
            showRowNumber: true,
            retrieve: true,
            columnDefs: columnDefsSet,
            columns: columnsArr,
            preDrawCallback: function(opts) {
                if (arguments[0].oClasses.sPageButtonActive.indexOf('wi-secondary-bg') < 0) {
                    arguments[0].oClasses.sPageButtonActive = arguments[0].oClasses.sPageButtonActive + ' wi-secondary-bg ';
                }
            },
            fnDrawCallback: function(opts) {
                if (arguments[0]._iRecordsTotal <= 20) {
                    $(this).siblings('.dataTables_paginate').hide()
                }
                if (arguments[0]._iRecordsTotal >= maxItem) {
                    $("#tableAdvancedList_paginate").prepend('<div class="page-tip">注：最多展示5000条数据</div>');
                }
                $("#tableAdvancedList_paginate").append("  跳至 <input class='pagiate-page-num' id='tableAdvancedList-changePage' type='text'> 页 ");
                var oTable = $("#tableAdvancedList").dataTable();
                $(document).off("keydown", "#tableAdvancedList-changePage");
                $(document).on("keydown", "#tableAdvancedList-changePage", function() {
                    switch (event.keyCode) {
                        case 13:
                            if ($("#tableAdvancedList-changePage").val() && $("#tableAdvancedList-changePage").val() > 0) {
                                var maxPage = Math.ceil(opts._iRecordsTotal / 20);
                                var inputPage = parseInt($("#tableAdvancedList-changePage").val()) ? parseInt($("#tableAdvancedList-changePage").val()) : "1";
                                if (inputPage >= maxPage) {
                                    inputPage = maxPage;
                                }
                                var redirectpage = inputPage - 1;
                            } else {
                                var redirectpage = 0;
                            }
                            console.log(redirectpage)
                            oTable.fnPageChange(redirectpage);
                            return false;
                            break;
                    }
                })
            },
            createdRow: function(row, data, dataIndex) {
                //对齐的设置
                $.each(alignArr, function(i, item) {
                    var itemArr = String(item).split("|"); //传入的align进行split，"|"后为处理的函数，一般加上一个class，主要处理边距的问题
                    if (itemArr[0] == 1) {
                        $(row).find('td').eq(i).attr('align', 'center');
                        if (moduleName == '#tabBand') {
                            $(row).find('td').eq(i).attr('style', 'vertical-align: middle;');
                        }

                    } else if (itemArr[0] == 2) {
                        $(row).find('td').eq(i).attr('align', 'right');
                    } else {
                        $(row).find('td').eq(i).attr('align', 'left');
                    }
                    if (itemArr[1]) {
                        $(row).find('td').eq(i).addClass(itemArr[1]);
                    }
                })
            },
            ajax: function(data, callback, settings) {
                //ajax请求数据
                var tUrl = "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getadvancedsearch&s=" + Math.random();
                if (!global_isRelease) {
                    tUrl = global_site + "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getadvancedsearch&s=" + Math.random() + "&wind.sessionid=" + global_wsid;
                }
                parameter.PageNo = (data.start / data.length);
                parameter.PageSize = 20;
                $.ajax({
                    url: tUrl,
                    type: "POST",
                    cache: false, //禁用缓存
                    data: parameter, //传入组装的参数
                    dataType: "json",
                    success: function(result) {
                        if((result.ErrorCode == '-10' || result.ErrorCode == -10) && parameter.PageNo!=0){
                            var contSet = {
                                title: intl('223900','企业筛选' ),
                                dec: intl('224192','购买VIP/SVIP套餐，即可不限次查看更多企业筛选结果')
                            };
                            Common.Popup([1, true], true, contSet);
                            var oTable = $("#tableAdvancedList").dataTable();
                            oTable.fnPageChange(0);
                            return;
                        }
                        if (result.ErrorCode && result.Data && result.Data.search) {
                            //封装返回数据
                            var returnData = {};
                            // var recordsNum = result.Page.Records > "5000" ? "5000+" : result.Page.Records;// ycye.cecil modify 2020-10-23 超过5k变成5k 
                            var recordsNum = result.Page.Records; //ycye.cecil modify 2020-11-18 显示真实数据
                            $("#searchResultNum").text(recordsNum)
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.Page.Records >= maxItem ? maxItem : result.Page.Records; //返回数据全部记录
                            returnData.recordsFiltered = result.Page.Records >= maxItem ? maxItem : result.Page.Records; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.Data.search; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        } else {
                            $("#searchResultNum").text(0)
                            callback({ data: [] });
                            $("#tableAdvancedList_paginate").hide();
                        }
                    },
                    error: function(data) {
                        $("#searchResultNum").text(0)
                        console.log("error!");
                    }
                });
            },
        });
        //oTab.ajax.reload();
    },
    pageTurning: function(changePage) {
        //翻页功能
        if (changePage) { //翻页功能
            var buttonArr = [];
            buttonArr.push('<div class="dataTables_paginate paging_simple_numbers">');
            var allNum = Records;
            var pageNum = Math.ceil(Records / P2Ppagesize);
            //                  pageNum = 100;
            var jumpfoward = '<a id="jumpForad" class="paginate_button" data-num="' + pageNum + '"><</a>';
            var jumpafter = '<a id="jumpAfter" class="paginate_button" data-num="' + pageNum + '">></a>';
            var ellipsisSpan = '<span class="ellipsis">…</span>';
            buttonArr.push(jumpfoward);
            var buttonItem = '';
            if (pageNum < 8) {
                for (var bi = 1; bi <= pageNum; bi++) {
                    buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                    buttonArr.push(buttonItem);
                }
            } else {
                buttonItem = '<a class="paginate_button ' + (changePage == 1 ? 'page-foucs' : '') + '">' + 1 + '</a>';
                buttonArr.push(buttonItem);
                if (changePage <= 4) {
                    for (var bi = 2; bi <= 5; bi++) {
                        buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                    buttonArr.push(ellipsisSpan);
                } else if (changePage >= pageNum - 3) {
                    buttonArr.push(ellipsisSpan);
                    for (var bi = pageNum - 4; bi < pageNum; bi++) {
                        buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                } else {
                    buttonArr.push(ellipsisSpan);
                    for (var bi = changePage - 1; bi < changePage + 2; bi++) {
                        buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                    buttonArr.push(ellipsisSpan);
                }
                buttonItem = '<a class="paginate_button ' + (changePage == pageNum ? 'page-foucs' : '') + '">' + pageNum + '</a>';
                buttonArr.push(buttonItem);
            }
            buttonArr.push(jumpafter);
            buttonArr.push('  跳至 <input class="pagiate-page-num" id="p2p-changePage" type="text"> 页 ');
            buttonArr.push('</div>');
            $('.change-page').append(buttonArr.join(""));
        }
    },
    getPreSearch: function(keyword, successFun) {
        myWfcAjax("gettagsearch", { tagname: keyword }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' && res.Data && res.Data.length > 0) {
                successFun(res.Data);
            } else {
                $("#tagList").empty();
                successFun({});
            }
        });
    },
    getPreSearch02: function(keyword, successFun) {
        myWfcAjax("gettagsearch3", { tagname: keyword }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' && res.Data && res.Data.length > 0) {
                successFun(res.Data);
            } else {
                $("#tagList02").empty();
                successFun({});
            }
        });
    },
    tagChange: function() {
        //根据上面已选中的高亮下面的标签
        var selTags = $("#selLabels span");
        var tagsList = $("#tagsArea .each-item02");
        for (var i = 0; i < selTags.length; i++) {
            var val = selTags.eq(i).attr("data-val");
            for (var j = 0; j < tagsList.length; j++) {
                console.log(val + "::::::" + tagsList.eq(j).attr("data-val"))
                if (val == tagsList.eq(j).attr("data-val")) {
                    tagsList.eq(j).addClass("sel");
                    break;
                }
            }
        }
    },
    tagChange02: function() {
        //根据上面已选中的高亮下面的标签
        var selTags = $("#selLabels02 span");
        var tagsList = $("#tagsArea02 .each-item02");
        for (var i = 0; i < selTags.length; i++) {
            var val = selTags.eq(i).attr("data-val");
            for (var j = 0; j < tagsList.length; j++) {
                if (val == tagsList.eq(j).attr("data-val")) {
                    tagsList.eq(j).addClass("sel");
                    break;
                }
            }
        }
    }
}

$('.input-toolbar-before-search').on("click", ".before-search-div", function(event) {
    var target = event.target;
    if (!$(target).hasClass('before-search-div')) {
        target = target.closest('.before-search-div');
    }
    var code = $(target).attr('data-code');
    Common.linkCompany("Bu3", code);
    return false;
})

$('.export-vip-tips').mouseover(function(e) {
    $(e.target).attr('title', intl('209303' /* 您正在使用付费高级功能 */ ));
})

if (wind && wind.langControl) {
    if (wind.langControl.lang !== 'zh') {
        var styleEle = ['<style>.title-sub-advanced{width:100px;display:inline-block;word-break:break-word;margin-top:-8px;}.content-toolbar ul>li{height:auto;padding-left:5px;padding-right:5px;word-break:break-word;}.show-hide-condition i{left:130px;}</style>'];
        $(document.head).append(styleEle);
    }
}


/* 国际化 ,所有自己的代码都在写在这个回调函数后*/

if (window.wind && wind.langControl) {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
        wind.langControl.lang = 'zh';
        wind.langControl.locale = 'zh';
        wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
            Common.international();
            $('#keyword').attr('placeholder', intl('223422' /* 请输入公司、人名、品牌、企业特征等关键词 */ ));
            $('#inputSearchRelation01').attr('placeholder', intl('138344' /* 输入标签关键词 */ ));
            $('#btnCloseTag').attr('value', intl('6653' /* 关闭 */ ));
            $('#advancedStartDate').attr('placeholder', intl('9524', '开始时间'));
            $('#advancedEndDate').attr('placeholder', intl('210889', '结束时间'));
        }, function() {
            console.log('error');
        });
    } else {
        wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
            Common.international();
            $('#keyword').attr('placeholder', intl('223422' /* 请输入公司、人名、品牌、企业特征等关键词 */ ));
            $('#inputSearchRelation01').attr('placeholder', intl('138344' /* 输入标签关键词 */ ));
            $('#btnCloseTag').attr('value', intl('6653' /* 关闭 */ ));
            $('#advancedStartDate').attr('placeholder', intl('9524', '开始时间'));
            $('#advancedEndDate').attr('placeholder', intl('210889', '结束时间'));
        }, function() {
            console.log('error');
        });
        // 终端多语言设置修改时会触发 ServerFunc(func = NotifyLocaleChanged)
        // 使用 addServerFunc 避免直接覆盖 window.ServerFunc 导致冲突
        if ($.client && $.client.addServerFunc) {
            $.client.addServerFunc('NotifyLocaleChanged', function(data) {
                // data {func:'NotifyLocaleChanged',locale:'zh-CN' // 'en-US' }
                /**
                 * 切换wft系统语言时 重刷页面
                 */
                location.search = (data.locale === 'en-US') ? wind.uri(location.href).query('lang', 'en').search : wind.uri(location.href).query('lang', 'cn').search;
            });
        }
    }
    window.intl = wind.langControl.intl;
}