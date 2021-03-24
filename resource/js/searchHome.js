var resetData = {}; //行业类型重组数据
var resetDataProvice = {}; //省份地区重组数据
var resetDataRegion = {}; //所有地区重组数据
var allRecords = 1000;
var allRecordsPerson = 1000;
var preventSumbit = true; //防止重复提交
var preventSumbitMan = true; //防止重复提交
var preventSumbitBrand = true; //防止重复提交
var preventSumbitPatent = true; //防止重复提交
var preventSumbitSoft = true; //防止重复提交
var preventSumbitWork = true; //防止重复提交
var preventSumbitRisk = true; //防止重复提交
var preventSumbitIntellectual = true; //防止重复提交
var preventSumbitNews = true; //防止重复提交
var preventSumbitJudgment = true; //防止重复提交
var preventSumbitDishonest = true; //防止重复提交
var preventSumbitExecutee = true; //防止重复提交
var preventSumbitCourt = true; //企业地址
var preventSumbitGlobal = true; //防止重复提交
var preventSumbitOpenNotice = true; //防止重复提交
var preventSumbitJudicial = true; //防止重复提交
var preventSumbitJobs = true; //防止重复提交
var preventSumbitProject = true; //防止重复提交
var preventSumbitMake = true; //防止重复提交
var preventSumbitProduct = true; //防止重复提交
/*
参数传"1"表示有，传"0"表示无，不筛选传""或不传该参数
hasBrand 是否有商标
hasCopyright 是否有软件著作权
hasDebt 是否发债
hasDomain 是否有网址
hasFinancing 是否融资
hasIpo 是否上市
hasMail 是否有邮件地址
hasOnList 是否上榜
hasPatent 是否有专利
hasTel 是否有电话
hasPledge 动产抵押
 */

var maxPage = 500; //最大页数
var isEn = false; //判断是不是英文版，是的话要转换
if (Common.getUrlSearch("lang") && Common.getUrlSearch("lang").substring(0, 2) == "en") {
    isEn = true;
}

var searchParam = {
    pageNo: 0,
    pageSize: 30,
    feature: "",
    city: "",
    industry: "",
    sort: -1,
    companyname: "",
    regcapital: "",
    source: 'cel',
    datafrom: '', // TODO 机构类型
    industryGb1: '', // 一级行业名称
    establishedTime: '', // 成立时间
    regRange: '', // 注册资本
    status: '', // 企业状态
    hasBrand: '', // 1表示有 0表示无
    hasCopyright: '',
    hasDebt: '',
    hasDomain: '',
    hasFinancing: '',
    hasIpo: '',
    hasMail: '',
    hasOnList: '',
    hasPatent: '',
    hasTel: '',
    orgType: ''
}
var searchPersonParam = {
    //人物搜索 
    province: "",
    industry: "",
    pageNo: 0,
    pageSize: 30,
    personname: "",
    source: 'cel'
}
var searchRiskParam = {
    type: '',
    pageSize: 10,
    pageNo: 0,
    key: '',
    caseType: '',
    area: '',
    source: 'cel'
};
var searchIntellectualParam = {
    type: '',
    pageSize: 10,
    pageNo: 0,
    key: '',
    caseType: '',
    area: '',
    source: 'cel'
};

var searchNewsParam = {
    pageSize: 10,
    pageNo: 0,
    label: '',
    sentiment: '',
    timeRange: '',
    source: 'cel'
};

var searchGlobalParam = {
    type: '',
    country: "",
    pageSize: 10,
    pageNo: 0,
    companyname: '',
    source: 'cel',
    sort: "-1"
};

var searchJobsParam = {
    //招聘
    pageSize: 10,
    pageNo: 0,
    key: '',
    source: 'cel',
    region: '',
    industry: '',
    establishedTime: '',
    registerCapital: '',
    education_requirement: '',
    experience: '',
    size: '',
};
var searchProjectParam = {
    pageSize: 10,
    pageNo: 0,
    key: '',
    //  source: 'cel',
    //  status: '',
    //  category: ''
};
var searchMakeParam = {
    //	type: 'trademark_search',
    pageSize: 10,
    pageNo: 0,
    key: '',
    source: 'cel',
    status: '',
    category: ''
};
var searchProductParam = {
    //	type: 'trademark_search',
    pageSize: 10,
    pageNo: 0,
    key: '',
    source: 'cel',
    status: '',
    category: ''
};
var provCity = {}; //招聘-省份城市的映射{江苏:[南京,苏州,。。。]}



$(document).bind("click", function(e) {
    if ($((e.target || e.srcElement)).closest(".btn-sort").length == 0) {
        $('.btn-sort').removeClass("sel");
    }
});

$(document).on('click', '.corpNewZoneMore', function() {
    if ($(this).hasClass('corpNewZoneMore-show')) {
        $(this).removeClass('corpNewZoneMore-show')
        $(this).siblings('div').hide();
    } else {
        $(this).addClass('corpNewZoneMore-show')
        $(this).siblings('div').show();
    }
})

$(document).on("click", ".topic", function() {
    var data_topic = this.getAttribute('data-topic');
    var url = 'NetComper.html?' + data_topic;
    window.open(url);
    return false;
});
$(document).on("click", "#div_DataListNews .div_Card,#FocusHistroyNews li", function() {
    var detailId = $(this).attr('data-detailid');
    var title = $(this).attr('data-title').replace(/<[^>]+>/g, "");
    var parameter = { "title": title, "objectid": detailId }
    myWfcAjax("savenewshistory", parameter, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var url = '/SmartReaderWeb/SmartReader/?type=4&id=' + detailId;
            window.open(url);

        }
    })
    return false;

});


//作品著作权人跳转
$(document).on("click", ".div_CardList_Intellectual .search-work-link,.div_CardList_work .search-work-link,.div_CardList_brand .search-work-link,.div_CardList_patent .search-work-link,.div_CardList_soft .search-work-link,#FocusHistroyBrand .his-brand-link,.div_CardList_jobs .search-jobs-link", function(e) {
    var code = $(this).attr('data-code');
    var name = $(this).text();
    var buryParam = $(this).attr('data-pingParam') ? $(this).attr('data-pingParam') : '';
    if (code && code.length) {
        if (code.length < 16) {
            Common.linkCompany('Bu3', code, null, null, buryParam); //bury
        } else {
            window.open('Person.html?id=' + code + '&name=' + name + buryParam);
        }
    }
    return false;
});


$(document).on("click", ".div_Card_Link,#FocusHistroyRisk li,#FocusHistroyIntellectual li", function() {
    //历史列表点击
    var detailid = $(this).attr('data-detailid');
    var type = $(this).attr('data-type');
    if (detailid && type) {
        detailid = encodeURIComponent(detailid);
        if (type == 'judgment') {
            window.open('showItemDetail.html?type=judgment&detailid=' + detailid);
        } else {
            window.open('SearchOtherDetail.html?type=' + type + '&detailid=' + detailid)
        }

    }
    return false;
});

$(document).on("click", ".div_CardList_jobs>.div_Card, #FocusHistroyJobs li, #FocusJobsHot li", function() {
    var detailid = $(this).attr('data-detailid');
    var jobComCode = $(this).attr('data-jobccode');
    if (detailid) {
        detailid = encodeURIComponent(detailid);
        window.open('SearchOtherDetail.html?type=jobs&detailid=' + detailid + '&jobComCode=' + jobComCode)
    }
    return false;
});

$(document).on("click", ".div_CardList_product>.div_Card, #FocusHistroyProduct li, #FocusProjectHot li", function() {
    //产品详情跳转
    var detailid = $(this).attr('data-detailid');
    if (detailid) {
        detailid = encodeURIComponent(detailid);
        window.open('showItemDetail.html?type=product&detailid=' + detailid)
    }
    return false;
});

$(document).on("click", ".div_CardList_product>.div_Card a,#FocusHistroyProduct a", function(event) {
    //产品详情跳转阻断
    event.stopPropagation();
});

$(document).on("click", "#changeTitleSearch li", function() {
    $("#pageTip").hide();
    $(this).addClass("sel").addClass("wi-secondary-color").siblings().removeClass();
    var oIndex = $("#changeTitleSearch li").index(this);
    var oType = $(this).attr("data-type");
    $(".search-r-model").hide();
    $(".search-r-model[data-type='" + oType + "']").show();
    $(".each-search-result[type='" + oType + "']").show().siblings().hide();
    if (oType == "company") {
        //公司
        getHistoryKey();
        searchForCorp();
    } else if (oType == "person") {
        resetPersonCondition();
        searchForPerson();
    } else if (oType == "intellectual") {
        latestIntellectual(); //最近浏览
        searchForIntellectual();
    } else if (oType == "risk") {
        //风险综合
        latestRisk(); //最近浏览
        searchForRisk();
    } else if (oType == "news") {
        //新闻
        latestNews(); //最近浏览的新闻
        searchForNews();
    } else if (oType == "job") {
        resetJobsCondition();
        searchForJobs();
    } else if (oType == "project") { //项目查询
        resetProjectCondition();
        searchForProject();
    } else if (oType == "make") { //品牌查询
        resetMakeCondition();
        searchForMake();
    } else if (oType == "product") { //产品查询
        resetProductCondition();
        searchForProduct();
    } else {
        $(".search-r-model[data-type=company]").show();
        getHistoryKey();
        searchForCorp();
    }

})

$(document).on('click', '#filterJobList a', function() {
    //招聘选择选项
    $('.condition-job-list').show();
    $(this).parents('li').hide();
    var condiItem = $(this).attr('data-condItem');
    var provOrCity = condiItem != 'region' ? '' : $(this).parents('li').attr('id');
    if (condiItem == 'region') {
        var provName = $(this).attr('data-name');
        var showCity = (provName == '北京市' || provName == '天津市' || provName == '上海市' || provName == '香港特别行政区' || provName == '澳门特别行政区' || provName == '台湾地区') ? false : true;
        if (provOrCity == 'jobWorkProv' && showCity) {
            $('#jobCorpNewZoneCondition2').empty(); //清空原有城市
            var cityNameArr = provCity[provName];
            if (cityNameArr.length) {
                for (var n = 0; n < cityNameArr.length; n++) {
                    var cityItemName = cityNameArr[n];
                    $('#jobCorpNewZoneCondition2').append('<a data-condItem="region" data-name="' + cityItemName + '" class="wi-link-color" id="" href="#"><span>' + cityItemName + '</span></a>');
                }
            }
            $('#jobWorkCity').show(); //展示城市
        }
        $('#selectedJobCondition').append('<li id="condi' + provOrCity + '" data-name="' + provName + '" data-condition="' + condiItem + '" style="display: list-item;"><span>' + $(this).text() + '</span><i>X</i></li>');
    } else {
        $('#selectedJobCondition').append('<li data-condition="' + condiItem + '" style="display: list-item;"><span>' + $(this).text() + '</span><i>X</i></li>');
    }
    searchJobsParam.pageNo = 0;
    searchJobsParam[condiItem] = $(this).attr('data-name');
    searchForJobs();
})

$(document).on('click', '#selectedJobCondition li', function() {
    //招聘选项移除
    var personVal = document.getElementById('selectedJobCondition');
    var liInx = $(this).index();
    var condiItem = $(this).attr('data-condition');
    var provOrCity = condiItem != 'region' ? '' : $(this).attr('id');
    if (condiItem == 'region') { //区分省份与城市
        if (provOrCity == 'condijobWorkCity') {
            personVal.removeChild(personVal.children[liInx]);
            searchJobsParam[condiItem] = $('#condijobWorkProv').attr('data-name');
            $('#jobWorkCity').show();
        } else {
            searchJobsParam[condiItem] = '';
            personVal.removeChild(personVal.children[liInx]);
            if ($('#condijobWorkCity')[0]) {
                personVal.removeChild($('#condijobWorkCity')[0]);
            }
            $('#jobWorkProv').show();
            $('#jobWorkCity').hide();
        }
    } else {
        searchJobsParam[condiItem] = '';
        personVal.removeChild(personVal.children[liInx]);
        $('#filterJobList').find('[data-condItem="' + condiItem + '"]').parents('li').show();
    }
    var selCount = $('#selectedJobCondition').children().length;
    if (selCount == 0) {
        $('.condition-job-list').hide();
    }
    searchForJobs();
})

$(document).on('click', '#clearAllJobCondtion', function() {
    //先获取选择的条件
    var selCount = $('#selectedJobCondition').children().length;
    for (var i = 0; i < selCount; i++) {
        var condiItem = $($('#selectedJobCondition').children()[i]).attr('data-condition');
        $('#filterJobList').find('[data-condItem="' + condiItem + '"]').parents('li').show();
        searchJobsParam[condiItem] = '';
    }
    $('#jobWorkCity').hide();
    //全部清楚选择选项
    $('#selectedJobCondition').empty();
    searchForJobs();
})
$(document).on('click', '.condi-high-search, .jump-more-serach', function() {
        //跳转高级搜索
        var url = "AdvancedSearch02.html";
        window.open(url);
        return false;
    })
    //需要建立一个通过省份获取js城市的函数，并且还要考虑国际化，算了，js没有英文的。。。
function isEmptyObject(obj)  {  
    for  (var  key  in  obj)  {     return  false;   }  
    return  true;
}

function initProvCity() {
    $.getJSON("../resource/js/city.min.js", function(data) {
        var allProvCount = data.citylist.length;
        if (isEmptyObject(provCity)) {
            for (var i = 0; i < allProvCount; i++) {
                var provItem = data.citylist[i];
                var provName = provItem.p;
                var cityArrList = provItem.c;
                var cityCount = cityArrList.length;
                var cityNameArr = [];
                if (cityCount != 0) {
                    for (var j = 0; j < cityCount; j++) {
                        var cItem = cityArrList[j];
                        cityNameArr.push(cItem.n);
                    }
                }
                provCity[provName] = cityNameArr;
            }
        }
    })
};
initProvCity(); //省份与城市融合字典;

function initToolBarChange() {
    var changeHeight = $('#changeTitleSearch').outerHeight();
    var cVaule = 91 + changeHeight - 37;
    var cHeight = cVaule + 'px';
    $('.wrapper-top').css('padding-top', 91 + changeHeight - 37 + 'px');
    if (Common.getUrlSearch("country")) {
        $('.wrapper-top').css('padding-top', '50px');
        return false;
    }
    if (wind.langControl.lang !== 'zh') {
        var cWidth = $('#changeTitleSearch').outerWidth();
        if (cWidth < 1048) {
            $('.wrapper-top').css('padding-top', '165px');
        } else {
            $('.wrapper-top').css('padding-top', '128px');
        }
    } else {
        $('.wrapper-top').css('padding-top', 91 + changeHeight - 37 + 'px');
    }
}



function selShowHistoryBlock(selList) {
    //用来控制显示的最近浏览模块
    var seeHistoryList = ['#historyFocusList', '#historyPersonList', '#historyBrandList', '#historyPatentList', '#historyJudgmentList', '#historyDishonestList', '#historyExecuteeList', '#historyCourtList', '#historyOpenNoticeList', '#historyJudicialList', '#historyJobsList', '#historyProjectList', '#historyMakeList', '#historyProductList'];
    selList[0] ? $(seeHistoryList[0]).show() : $(seeHistoryList[0]).hide(); //最近浏览企业-historyFocusList
    selList[1] ? $(seeHistoryList[1]).show() : $(seeHistoryList[1]).hide(); //最近浏览人物-historyPersonList
    selList[2] ? $(seeHistoryList[2]).show() : $(seeHistoryList[2]).hide(); //最近浏览商标-historyBrandList
    selList[3] ? $(seeHistoryList[3]).show() : $(seeHistoryList[3]).hide(); //最近浏览专利-historyPatentList
    selList[4] ? $(seeHistoryList[4]).show() : $(seeHistoryList[4]).hide(); //最近浏览裁判文书-historyJudgmentList
    selList[5] ? $(seeHistoryList[5]).show() : $(seeHistoryList[5]).hide(); //最近浏览失信人-historyDishonestList
    selList[6] ? $(seeHistoryList[6]).show() : $(seeHistoryList[6]).hide(); //最近浏览被执行人-historyExecuteeList
    selList[7] ? $(seeHistoryList[7]).show() : $(seeHistoryList[7]).hide(); //最近浏览法院公告-historyCourtList
    selList[8] ? $(seeHistoryList[8]).show() : $(seeHistoryList[8]).hide(); //最近浏览开庭公告-historyOpenNoticeList
    selList[9] ? $(seeHistoryList[9]).show() : $(seeHistoryList[9]).hide(); //最近浏览司法拍卖-historyJudicialList
    selList[10] ? $(seeHistoryList[10]).show() : $(seeHistoryList[10]).hide(); //最近浏览招聘-historyJobsList
    selList[11] ? $(seeHistoryList[11]).show() : $(seeHistoryList[11]).hide(); //最近浏览项目-historyProjectList
    selList[12] ? $(seeHistoryList[12]).show() : $(seeHistoryList[12]).hide(); //最近浏览品牌-historyMakeList
    selList[13] ? $(seeHistoryList[13]).show() : $(seeHistoryList[13]).hide(); //最近浏览产品-historyProductList
}


function getHistoryBrand() {
    requestBrandHisList();
}

function showEachRiskHistory(historyData) {
    //最近浏览风险每一行
    if (historyData && historyData.type) {
        var type = historyData.type;
        var returnStr = "";
        var historyDataDetail = historyData.detail;
        switch (type) {
            case 'judgeinfo_search':
                returnStr = '<li class="buryClickCenter" data-type="judgment" data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138190' /*案号*/ ) + '：<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? ' wi-secondary-color wi-link-color his-judgment-link' : '') + '">' + ((historyDataDetail && historyDataDetail.case_no) ? historyDataDetail.case_no : '--') + '</span>' + '</div></li>';
                break;
            case 'discredicted_person_search':
                returnStr = '<li class="buryClickCenter" data-type="dishonest"  data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138294' /*立案时间*/ ) + '：<span class=" ">' + ((historyDataDetail && historyDataDetail.time) ? Common.formatTime(historyDataDetail.time.split(" ")[0]) : '--') + '</span>' + '</div></li>';
                break;
            case 'concerned_person_search':
                returnStr = '<li class="buryClickCenter" data-type="executee"  data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138294' /*立案时间*/ ) + '：<span class=" ">' + ((historyDataDetail && historyDataDetail.time) ? Common.formatTime(historyDataDetail.time.split(" ")[0]) : '--') + '</span>' + '</div></li>';
                break;
            case 'court_session_announcement_search':
                returnStr = '<li class="buryClickCenter" data-type="openNotice"  data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138144' /*公示时间*/ ) + '：<span class=" ">' + ((historyDataDetail && historyDataDetail.date) ? Common.formatTime(historyDataDetail.date.split(" ")[0]) : '--') + '</span>' + '</div></li>';
                break;
            case 'court_announcement_search':
                returnStr = '<li class="buryClickCenter" data-type="court"  data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138144' /*公示时间*/ ) + '：<span class=" ">' + ((historyDataDetail && historyDataDetail.date) ? Common.formatTime(historyDataDetail.date.split(" ")[0]) : '--') + '</span>' + '</div></li>';
                break;
            case 'judicialsale_search':
                returnStr = '<li class="buryClickCenter" data-type="judicial"  data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138237' /*拍卖日期*/ ) + '：<span class=" ">' + ((historyDataDetail && historyDataDetail.date) ? Common.formatTime(historyDataDetail.date.split(" ")[0]) : '--') + '</span>' + '</div></li>';
                break;
        }
        return returnStr;
    } else {
        return "";
    }
}

function showEachIntellectualHistory(historyData) {
    //最近浏览知识产权每一行
    if (historyData && historyData.type) {
        var type = historyData.type;
        var returnStr = "";
        var historyDataDetail = historyData.detail;
        switch (type) {
            case 'brand_detail':
                returnStr = '<li class="buryClickCenter" data-type="brand" data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('58656' /*申请人*/ ) + '：' + '<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? 'wi-secondary-color wi-link-color his-brand-link ' : '') + '" data-code="' + (historyDataDetail ? historyDataDetail.applicant_id : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>';
                break;
            case 'patent_detail':
                returnStr = '<li class="buryClickCenter" data-type="patent" data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138659', '申请（专利权）人') + '：<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? ' wi-secondary-color wi-link-color his-patent-link' : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>';
                break;
        }
        return returnStr;
    } else {
        return "";
    }
}

function latestRisk() {
    //最近浏览风险信息
    myWfcAjax("getriskhistory", { isKeyword: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyRiskList").find("#FocusHistroyRisk").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    tmpArr.push(showEachRiskHistory(res.Data[i]));
                }
                $("#historyRiskList").find("#FocusHistroyRisk").html(tmpArr.join(""));
            }
        } else {
            $("#historyRiskList").find("#FocusHistroyRisk").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyRiskList").find("#FocusHistroyRisk").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

function latestNews() {
    //最近浏览的新闻
    myWfcAjax("getnewshistory", { "isKeyword": 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#FocusHistroyNews").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < res.Data.length; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    tmpArr.push('<li data-title="' + historyData.title + '" " data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.title + '</span></div></li>');
                }
                $("#FocusHistroyNews").html(tmpArr.join(""));
            }
        } else {
            $("#FocusHistroyNews").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#FocusHistroyNews").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

function latestIntellectual() {
    //最近浏览知识产权信息
    myWfcAjax("getintellectualhistory", { isKeyword: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyIntellectualList").find("#FocusHistroyIntellectual").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    tmpArr.push(showEachIntellectualHistory(res.Data[i]));
                }
                $("#historyIntellectualList").find("#FocusHistroyIntellectual").html(tmpArr.join(""));
            }
        } else {
            $("#historyIntellectualList").find("#FocusHistroyIntellectual").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyIntellectualList").find("#FocusHistroyIntellectual").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

function requestBrandHisList() {
    //最近浏览商标
    myWfcAjax("gethistorykey", { type: 'brand_detail', pcstatus: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyBrandList").find("#FocusHistroyBrand").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    var imgStr = "";
                    if (historyDataDetail && historyDataDetail.brand_img) {
                        imgStr = '<img class="big-logo" src="' + historyDataDetail.brand_img + '" width=49 height=49/>';
                    } else {
                        imgStr = historyData.keyword.substring(0, 1);
                    }
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span class="img-history">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('58656' /*申请人*/ ) + '：' + '<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? 'wi-secondary-color wi-link-color his-brand-link ' : '') + '" data-code="' + (historyDataDetail ? historyDataDetail.applicant_id : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>');
                }
                $("#historyBrandList").find("#FocusHistroyBrand").html(tmpArr.join(""));
            }
        } else {
            $("#historyBrandList").find("#FocusHistroyBrand").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyBrandList").find("#FocusHistroyBrand").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

function resetPatentCondition() {
    // searchPatentParam = {
    //     state: "",
    //     type: "",
    //     pageNo: 0,
    //     pageSize: 30,
    //     patentname: "",
    // }
    getHistoryPatent();
}

function getHistoryPatent() {
    requestPatentHisList();
}

function requestPatentHisList() {
    //最近浏览知识产权
    myWfcAjax("gethistorykey", { type: 'patent_detail', pcstatus: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data && res.Data.length) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyPatentList").find("#FocusHistroyPatent").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138659', '申请（专利权）人') + '：<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? ' wi-secondary-color wi-link-color his-patent-link' : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>');
                }
                $("#historyPatentList").find("#FocusHistroyPatent").html(tmpArr.join(""));
            }
        } else {
            $("#historyPatentList").find("#FocusHistroyPatent").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyPatentList").find("#FocusHistroyPatent").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

function requestPatentHisList() {
    //最近浏览专利
    myWfcAjax("gethistorykey", { type: 'patent_detail', pcstatus: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data && res.Data.length) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyPatentList").find("#FocusHistroyPatent").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138659', '申请（专利权）人') + '：<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? ' wi-secondary-color wi-link-color his-patent-link' : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>');
                }
                $("#historyPatentList").find("#FocusHistroyPatent").html(tmpArr.join(""));
            }
        } else {
            $("#historyPatentList").find("#FocusHistroyPatent").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyPatentList").find("#FocusHistroyPatent").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

function resetSoftCondition() {
    // searchSoftParam = {
    //     pageNo: 0,
    //     pageSize: 30,
    //     softname: "",
    // }
    getHistorySoft();
}

function resetWorkCondition() {
    // searchSoftParam = {
    //     pageNo: 0,
    //     pageSize: 30,
    //     workname: "",
    // }
    getHistorySoft();
}

function getHistorySoft() {
    var selList = [0, 0, 1, 1];

    requestBrandHisList();
    requestPatentHisList();
}

function resetJobsCondition() {
    //最近浏览的招聘
    getHistoryJobs();
}

function getHistoryJobs() {
    //最近浏览的招聘
    var selList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

    requestJobsHisList();
}

function requestJobsHisList() {
    //最近浏览的招聘
    //  myWfcAjax("gethistorykey", {type: 'discredicted_person_search', iskeyword: 0, pcstatus: "0"}, function(data) {
    myWfcAjax("gethistorykey", { type: 'recruit_search', iskeyword: 0, pcstatus: "0" }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data && res.Data.length) {
            var tmpArr = [];
            var listClass = '';
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push("<div class='no-histry'>暂无最近浏览记录</div>");
                $("#historyJobsList").find("#FocusHistroyJobs").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    listClass = (i + 1) % 2 ? 'history_list' + ' listColor' : 'history_list';
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    var jobCorp = ''
                    if (res.Data[i].detail && res.Data[i].detail.companyName) {
                        jobCorp = '<br/><span class="job-corp">招聘企业:' + res.Data[i].detail.companyName + '</span>'
                    }
                    tmpArr.push('<li class="' + listClass + '"data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span>' + historyData.keyword + '</span>' + jobCorp + '<span class="del-history" data-code="' + historyData.objectid + '"></span></li>');
                }
                $("#historyJobsList").find("#FocusHistroyJobs").html(tmpArr.join(""));
            }
        } else {
            $("#historyJobsList").find("#FocusHistroyJobs").empty().html("<div class='no-histry'>暂无最近浏览记录</div>");
        }
    }, function() {
        $("#historyJobsList").find("#FocusHistroyJobs").empty().html("<div class='no-histry'>暂无最近浏览记录</div>");
    });

    //热门浏览的招聘
    //  myWfcAjax("gethistorykey", {type: 'discredicted_person_search', iskeyword: 0, pcstatus: "0"}, function(data) {
    myWfcAjax("getmostviewedbytype", { type: 'recruit_search' }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data && res.Data.length) {
            var tmpArr = [];
            var listClass = '';
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push("<div class='no-histry'>暂无最近浏览记录</div>");
                $("#historyJobsList").find("#FocusJobsHot").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    listClass = (i + 1) % 2 ? 'history_list' + ' listColor' : 'history_list';
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    var jobCorp = ''
                    if (res.Data[i].detail && res.Data[i].detail.companyName) {
                        jobCorp = '<br/><span class="job-corp">招聘企业:' + res.Data[i].detail.companyName + '</span>'
                    }
                    tmpArr.push('<li class="' + listClass + '"data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span>' + historyData.keyword + '</span>' + jobCorp + '<span class="del-history" data-code="' + historyData.objectid + '"></span></li>');
                }
                $("#historyJobsList").find("#FocusJobsHot").html(tmpArr.join(""));
            }
        } else {
            $("#historyJobsList").find("#FocusJobsHot").empty().html("<div class='no-histry'>暂无最近浏览记录</div>");
        }
    }, function() {
        $("#historyJobsList").find("#FocusJobsHot").empty().html("<div class='no-histry'>暂无最近浏览记录</div>");
    });
}

function resetProjectCondition() {
    //最近浏览项目
    // getHistoryProject();
    getHistoryProduct()
}

function getHistoryProject() {
    //最近浏览项目
    requestProjectHisList();
}

function requestProjectHisList() {
    //最近浏览项目
    myWfcAjax("gethistorykey", { type: 'project_search', pcstatus: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyProjectList").find("#FocusHistroyProject").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    var imgStr = "";
                    if (historyDataDetail && historyDataDetail.brand_img) {
                        imgStr = '<img class="big-logo"  src="' + historyDataDetail.brand_img + '" width=49 height=49/>';
                    } else {
                        imgStr = historyData.keyword.substring(0, 1);
                    }
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span class="img-history">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('58656' /*申请人*/ ) + '：' + '<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? 'wi-secondary-color wi-link-color his-brand-link ' : '') + '" data-code="' + (historyDataDetail ? historyDataDetail.applicant_id : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>');
                }
                $("#historyProjectList").find("#FocusHistroyProject").html(tmpArr.join(""));
            }
        } else {
            $("#historyProjectList").find("#FocusHistroyProject").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyProjectList").find("#FocusHistroyProject").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

/**
 * 项目搜索
 */
function searchForProject() {
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreProject").hide();
    $("#div_DataListProject").empty();
    $("#filter-project-type").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927' /*全部*/ ) + '</span></a>');
    $("#filter-project-state").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927' /*全部*/ ) + '</span></a>');
    $("#searchLoadProject").show();
    searchProjectParam.pageNo = 0;
    searchProjectParam.key = keyword;
    myWfcAjax("getprojectnamesearch", searchProjectParam, function(data) {
        showSearchProject(data);
    });
}

function showSearchProject(data, type) {
    //项目搜索
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = 'getprojectnamesearch';
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchProjectParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    $("#searchLoadProject").hide();
    $("#searchMask").height($(window).height()).show();
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchProjectResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        // 项目名、项目标签、所属企业、团队成员、概述
        for (var i = 0; i < item.length; i++) {
            var imgSrc = "../resource/images/Company/no-product.png";
            var imgId = item[i].logo ? item[i].logo : '';
            var companyName = item[i].corp_name ? item[i].corp_name : '--';
            var ccode = item[i].corp_id ? item[i].corp_id : '';
            var pingParam = '&fromModule=showSearchProject&fromField=名称&opId=' + ccode; //bury
            var pro_input = ccode ? Common.jumpPersonOrCompany(companyName, ccode, pingParam) : companyName;
            if (imgId) {
                imgSrc = 'http://news.windin.com/ns/imagebase/6740/' + imgId;
            }
            htmlArr.push('<div class="div_Card" data-detailid="' + item[i].detail_id + '">')
            htmlArr.push('<div class="searchpic-brand"><img class="big-logo"  width="90" src="' + imgSrc + '" onerror="src=\'../resource/images/Company/no-product.png\'"></div>')
            htmlArr.push('<div class="searchcontent-brand">')
            htmlArr.push('<h5 class="searchtitle-brand">' + (item[i].project_name ? item[i].project_name : '--') + '</h5>')
            if (item[i].territory_tag) {
                htmlArr.push('<i class="state-tag">' + (item[i].territory_tag ? item[i].territory_tag : '--') + '</i>')
            }
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work" langkey="208883">' + intl('208883' /*所属企业*/ ) + '：' + pro_input + '</span>');
            htmlArr.push('<span class="searchitem-work" langkey="134893">' + intl('134893' /*团队成员*/ ) + '：' + (item[i].team_member ? item[i].team_member : '--') + '</span>');
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work introduction-show" title="' + (item[i].introduction ? item[i].introduction : '--') + '" langkey="208886">' + intl('208886' /*概述*/ ) + '：' + (item[i].introduction ? item[i].introduction : '--') + '</span>')
                //          if (item[i].applicant_ch_name_id) {
                //              htmlArr.push('<span class="searchitem-work">' + intl('58656' /*申请人*/ ) + '：<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + item[i].applicant_ch_name_id + '">' + (item[i].applicant_ch_name ? item[i].applicant_ch_name : '--') + '</a></span>')
                //          } else {
                //              htmlArr.push('<span class="searchitem-work">' + intl('58656' /*申请人*/ ) + '：' + (item[i].applicant_ch_name ? item[i].applicant_ch_name : '--') + '</span>')
                //          }
            htmlArr.push('</div></div></div>');
        }

        if (type == 1) {
            $("#div_DataListProject").append(htmlArr.join(""));
            preventSumbitProject = true;
        } else {
            preventSumbitProject = true;
            $("#div_DataListProject").html(htmlArr.join(""));
        }
        if ((parseInt(searchProjectParam.pageNo) + 1) * parseInt(searchProjectParam.pageSize) >= res.Page.Records) {
            $("#searchMoreProject").hide();
        } else {
            $("#searchMoreProject").show();
        }
        $('#div_DataListProject').off('click').on('click', '.underline', linkWithCodeEventHandler);
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListProject").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchProjectResultNum").text(0);
    }
}

function resetMakeCondition() {
    //最近浏览品牌
    getHistoryMake();
}

function getHistoryMake() {
    //最近浏览品牌
    //requestMakeHisList();
    getHistoryProduct();
}

function requestMakeHisList() {
    //最近浏览品牌
    myWfcAjax("gethistorykey", { type: 'product_search', pcstatus: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyMakeList").find("#FocusHistroyMake").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    var imgStr = "";
                    if (historyDataDetail && historyDataDetail.brand_img) {
                        imgStr = '<img class="big-logo"  src="' + historyDataDetail.brand_img + '" width=49 height=49/>';
                    } else {
                        imgStr = historyData.keyword.substring(0, 1);
                    }
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span class="img-history">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('58656' /*申请人*/ ) + '：' + '<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? 'wi-secondary-color wi-link-color his-brand-link ' : '') + '" data-code="' + (historyDataDetail ? historyDataDetail.applicant_id : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>');
                }
                $("#historyMakeList").find("#FocusHistroyMake").html(tmpArr.join(""));
            }
        } else {
            $("#historyMakeList").find("#FocusHistroyMake").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyMakeList").find("#FocusHistroyMake").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

/**
 * 品牌搜索
 */
function searchForMake() {
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreMake").hide();
    $("#div_DataListMake").empty();
    $("#filter-make-type").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927' /*全部*/ ) + '</span></a>');
    $("#filter-make-state").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927' /*全部*/ ) + '</span></a>');
    $("#searchLoadMake").show();
    searchMakeParam.pageNo = 0;
    searchMakeParam.key = keyword;
    myWfcAjax("getbrandnamesearch", searchMakeParam, function(data) {
        showSearchMake(data);
    });
}

function showSearchMake(data, type) {
    //品牌搜索
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = 'getbrandnamesearch';
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchMakeParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    $("#searchLoadMake").hide();
    $("#searchMask").height($(window).height()).show();
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchMakeResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        // 商标名、商标状态、注册号、申请时间、类别、申请人名称
        for (var i = 0; i < item.length; i++) {
            var imgSrc = "../resource/images/Company/no-product.png";
            var imgId = item[i].logo ? item[i].logo : '';
            var companyName = item[i].corp_name_display ? item[i].corp_name_display.split('|')[0] : '--';
            var ccode = item[i].corp_name_display ? item[i].corp_name_display.split('|')[1] : '';
            var pingParam = '&fromModule=showSearchMake&fromField=名称&opId=' + ccode; //bury
            var pro_input = ccode ? Common.jumpPersonOrCompany(companyName, ccode, pingParam) : companyName;
            if (imgId) {
                imgSrc = 'http://news.windin.com/ns/imagebase/6740/' + imgId;
            }
            htmlArr.push('<div class="div_Card" data-detailid="' + item[i].detail_id + '">')
            htmlArr.push('<div class="searchpic-mark"><img class="big-logo"  width="90" src="' + imgSrc + '" onerror="src=\'../resource/images/Company/no-product.png\'"></div>')
            htmlArr.push('<div class="searchcontent-brand">')
            htmlArr.push('<h5 class="searchtitle-brand">' + (item[i].brand_name ? item[i].brand_name : '--') + '</h5>')
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work">' + intl('205508' /*产品品类*/ ) + '：' + (item[i].product_type ? item[i].product_type : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('205504' /*发源地*/ ) + '：' + (item[i].cradle ? item[i].cradle : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('205505' /*创立时间*/ ) + '：' + (item[i].founding_time ? item[i].founding_time : '--') + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('208883' /*所属企业*/ ) + '：' + pro_input + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work introduction-show" title="' + (item[i].introduction ? item[i].introduction : '--') + '">' + intl('138847' /*简介*/ ) + '：' + (item[i].introduction ? item[i].introduction : '--') + '</span>')
            htmlArr.push('</div></div></div>')
        }

        if (type == 1) {
            $("#div_DataListMake").append(htmlArr.join(""));
            preventSumbitMake = true;
        } else {
            preventSumbitMake = true;
            $("#div_DataListMake").html(htmlArr.join(""));
        }
        if ((parseInt(searchMakeParam.pageNo) + 1) * parseInt(searchMakeParam.pageSize) >= res.Page.Records) {
            $("#searchMoreMake").hide();
        } else {
            $("#searchMoreMake").show();
        }
        $('#div_DataListMake').off('click').on('click', '.underline', linkWithCodeEventHandler);
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListMake").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchMakeResultNum").text(0);
    }
}

function resetProductCondition() {
    //最近浏览产品
    getHistoryProduct();
}

function getHistoryProduct() {
    //最近浏览产品
    requestProductHisList();
}

function requestProductHisList() {
    //最近浏览产品
    $(".search-r-model").hide();
    $("#historyProductList").show();
    myWfcAjax("gethistorykey", { type: 'product_search', pcstatus: 0 }, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyProductList").find("#FocusHistroyProduct").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var historyDataDetail = historyData.detail;
                    var imgId = historyDataDetail.logo ? 'http://news.windin.com/ns/imagebase/6730/' + historyDataDetail.logo : '';
                    var imgStr = "";
                    var cName = historyDataDetail.corpName ? historyDataDetail.corpName : '--';
                    var cCode = historyDataDetail.corpId ? historyDataDetail.corpId : '';
                    var pingParam = '&fromModule=requestProductHisList&fromField=名称&opId=' + cCode; //bury
                    var inputCom = cCode ? Common.jumpPersonOrCompany(cName, cCode, pingParam) : cName;
                    if (historyDataDetail && imgId) {
                        imgStr = '<img class="big-logo"  src="' + imgId + '" width=49 height=49 onerror="src=\'../resource/images/Company/no-product.png\'" />';
                    } else {
                        imgStr = historyData.keyword.substring(0, 1);
                    }
                    //                  tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span class="img-history">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>所属企业' + intl('' /*所属企业*/ ) + '：' + '<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? 'wi-secondary-color wi-link-color his-brand-link ' : '') + '" data-code="' + (historyDataDetail ? historyDataDetail.applicant_id : '') + '">' + ((historyDataDetail && historyDataDetail.applicant_name) ? historyDataDetail.applicant_name : '--') + '</span>' + '</div></li>');
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-detailid="' + historyData.objectid + '"><span class="img-history">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('208883' /*所属企业*/ ) + '：' + '<span class=" ' + ((historyDataDetail && historyDataDetail.applicant_id) ? 'wi-secondary-color wi-link-color his-brand-link ' : '') + '" data-code="' + (historyDataDetail ? historyDataDetail.applicant_id : '') + '">' + inputCom + '</span>' + '</div></li>');
                }
                $("#historyProductList").find("#FocusHistroyProduct").html(tmpArr.join(""));
            }
            $('#FocusHistroyProduct').off('click').on('click', '.underline', linkWithCodeEventHandler);
        } else {
            $("#historyProductList").find("#FocusHistroyProduct").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    }, function() {
        $("#historyProductList").find("#FocusHistroyProduct").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
    });
}

/**
 * 产品搜索
 */
function searchForProduct() {
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreProduct").hide();
    $("#div_DataListProduct").empty();
    $("#filter-product-type").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927', '全部') + '</span></a>');
    $("#filter-product-state").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927', '全部') + '</span></a>');
    $("#searchLoadProduct").show();
    searchProductParam.pageNo = 0;
    searchProductParam.key = keyword;
    myWfcAjax("getproductsearch", searchProductParam, function(data) {
        showSearchProduct(data);
    });
}

function showSearchProduct(data, type) {
    //产品搜索
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = 'getproductsearch';
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchProductParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    $("#searchLoadProduct").hide();
    $("#searchMask").height($(window).height()).show();
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchProductResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        // 商标名、商标状态、注册号、申请时间、类别、申请人名称
        for (var i = 0; i < item.length; i++) {
            var imgSrc = "../resource/images/Company/no-product.png";
            var imgId = item[i].logo ? item[i].logo : '';
            var companyName = item[i].corp_name_display ? item[i].corp_name_display.split('|')[0] : '--';
            var ccode = item[i].corp_name_display ? item[i].corp_name_display.split('|')[1] : '';
            var pingParam = '&fromModule=requestProductHisList&fromField=名称&opId=' + ccode; //bury
            var pro_input = ccode ? Common.jumpPersonOrCompany(companyName, ccode, pingParam) : companyName;
            if (imgId) {
                imgSrc = 'http://news.windin.com/ns/imagebase/6730/' + imgId;
            }
            htmlArr.push('<div class="div_Card buryClickCenter" data-detailid="' + item[i].detail_id + '">')
            htmlArr.push('<div class="searchpic-brand"><img class="big-logo"  width="90" src="' + imgSrc + '" onerror="src=\'../resource/images/Company/no-product.png\'"></div>')
            htmlArr.push('<div class="searchcontent-brand">')
            htmlArr.push('<h5 class="searchtitle-brand wi-link-color">' + (item[i].product_name ? item[i].product_name : '--') + '</h5>')
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work">' + intl('138754' /*产品类别*/ ) + '：' + (item[i].product_type ? item[i].product_type : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('208883' /*所属企业*/ ) + '：' + pro_input + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work introduction-show" title="' + (item[i].introduction ? item[i].introduction : '--') + '">' + intl('208864' /*产品简述*/ ) + '：' + (item[i].introduction ? item[i].introduction : '--') + '</span>')
            htmlArr.push('</div></div></div>')
        }

        if (type == 1) {
            $("#div_DataListProduct").append(htmlArr.join(""));
            preventSumbitProduct = true;
        } else {
            preventSumbitProduct = true;
            $("#div_DataListProduct").html(htmlArr.join(""));
        }
        if ((parseInt(searchProductParam.pageNo) + 1) * parseInt(searchProductParam.pageSize) >= res.Page.Records) {
            $("#searchMoreProduct").hide();
        } else {
            $("#searchMoreProduct").show();
        }
        $('#div_DataListProduct').off('click').on('click', '.underline', linkWithCodeEventHandler);
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListProduct").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchProductResultNum").text(0);
    }
}


function searchForCorp() {
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMore").hide();
    $("#div_DataList").empty();
    $('#searchLoad').show();
    searchParam.companyname = keyword;
    ajaxSearch();
}

function searchForPerson() {
    //人物搜索请求
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreMan").hide();
    $("#div_DataListMan").empty();
    $('#searchLoadMan').show();
    searchPersonParam.personname = keyword;
    myWfcAjax("getclassifyperson", searchPersonParam, function(data) {
        showSearchPerson(data, 1);
    });
}
/**
 * 风险总查询
 */
function searchForRisk() {
    //风险总查询搜索请求
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    var subType = decodeURI(Common.getUrlSearch("subType")); //风险类别
    var type = decodeURI(Common.getUrlSearch("type")); //风险类别
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreRisk").hide();
    $("#div_DataListRisk").empty();
    $("#searchLoadRisk").show();
    searchRiskParam.pageNo = 0;
    searchRiskParam.key = keyword;
    if (!searchRiskParam.type) {
        if (type == "risk") {
            if (subType) {
                searchRiskParam.type = subType;
            } else {
                if (!searchRiskParam.type) {
                    searchRiskParam.type = 'risk_merge_search';
                }
            }
        } else {
            searchRiskParam.type = 'risk_merge_search';
        }
    }
    myWfcAjax("getrisksearch", searchRiskParam, function(data) {
        showSearchRisk(data); //显示综合风险
    });
}

function searchForRiskByCondition() {
    myWfcAjax("getrisksearch", searchRiskParam, function(data) {
        showSearchRisk(data); //显示综合风险
    });
}
/**
 * 知识总查询
 */
function searchForIntellectual() {
    //知识总查询搜索请求
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    var subType = decodeURI(Common.getUrlSearch("subType")); //字类别
    var type = decodeURI(Common.getUrlSearch("type")); //类别
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreIntellectual").hide();
    $("#div_DataListIntellectual").empty();
    $("#searchLoadIntellectual").show();
    searchIntellectualParam.pageNo = 0;
    searchIntellectualParam.key = keyword;
    if (!searchIntellectualParam.type) {
        if (type == "intellectual") {
            if (subType) {
                searchIntellectualParam.type = subType;
            } else {
                if (!searchIntellectualParam.type) {
                    searchIntellectualParam.type = 'intellectual_property_merge_search';
                }
            }
        } else {
            searchIntellectualParam.type = 'intellectual_property_merge_search';
        }

    }
    myWfcAjax("getintellectual", searchIntellectualParam, function(data) {
        showSearchIntellectual(data); //显示综合风险
    });
}
/**
 * 新闻
 */
function searchForNews() {
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreNews").hide();
    $("#div_DataListNews").empty();
    $("#filter-news-tag").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927', '全部') + '</span></a>');
    $("#filter-news-mood").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>' + intl('138927', '全部') + '</span></a>');
    $("#searchLoadNews").show();
    searchNewsParam.pageNo = 0;
    searchNewsParam.timeRange = 30;
    searchNewsParam.keyword = keyword;
    myWfcAjax("getnewssearchwithaggs", searchNewsParam, function(data) {
        showSearchNews(data);
    });

}

/**
 * 全球企业查询
 */
function searchForGlobal() {
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarGlobalSearch").val(keyword);
    $("#changeTitleSearch").hide();
    $("#div_DataListGlobal").empty();
    $("#searchLoadGlobal").show();
    searchGlobalParam.pageNo = 0;
    searchGlobalParam.companyname = keyword;
    $("#searchListRes .each-search-result").hide();
    $(".search-for-global").show();
    myWfcAjax("getglobalcompanysearch", searchGlobalParam, function(data) {
        showSearchGolbal(data);
    });
}


/**
 * 招聘搜索
 */
function searchForJobs() {
    //招聘搜索请求
    var keyword = decodeURI(Common.getUrlSearch("keyword"));
    $("#inputToolbarSearch").val(keyword);
    $("#searchMoreJobs").hide();
    $("#div_DataListJobs").empty();
    $("#filter-jobs-type").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>全部</span></a>');
    $("#filter-jobs-state").empty().append('<a class="wi-link-color wi-secondary-color" data-name=""><span>全部</span></a>');
    $("#searchLoadJobs").show();
    searchJobsParam.pageNo = 0;
    searchJobsParam.key = keyword;
    myWfcAjax("getrecruitmentsearch", searchJobsParam, function(data) {
        showSearchJobs(data);
    });
}

function showSearchBrand(data, type) {
    $("#searchLoadBrand").hide();
    $("#searchMask").height($(window).height()).show();
    var res = JSON.parse(data);
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchBrandResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var states = res.Data.aggregations.aggs_trademark_status;
        var types = res.Data.aggregations.aggs_international_classification;
        var htmlArr = [];
        if (type !== 1) {
            for (var s = 0; s < states.length; s++) {
                var statename = states[s].key;
                if (isEn) {
                    statename = Common.transState2En(statename)
                }
                if (states[s].key == searchBrandParam.status) {
                    $('#filter-brand-state').find('a.wi-secondary-color').removeClass('wi-secondary-color');
                    $('#filter-brand-state').append('<a class="wi-link-color wi-secondary-color" data-name="' + states[s].key + '"><span>' + statename + '(' + states[s].doc_count + ')' + '</span></a>')
                } else {
                    $('#filter-brand-state').append('<a class="wi-link-color" data-name="' + states[s].key + '"><span>' + statename + '(' + states[s].doc_count + ')' + '</span></a>')
                }
            }
            for (var t = 0; t < types.length; t++) {
                var typename = types[t].key.split("-")[1] ? types[t].key.split("-")[1] : types[t].key.split("-")[0];
                if (types[t].key == searchBrandParam.category) {
                    if (isEn) {
                        typename = Common.transType2En(typename)
                    }
                    $('#filter-brand-type').find('a.wi-secondary-color').removeClass('wi-secondary-color');
                    $('#filter-brand-type').append('<a class="wi-link-color wi-secondary-color" data-name="' + types[t].key + '"><span>' + typename + '(' + types[t].doc_count + ')' + '</span></a>')
                } else {
                    if (isEn) {
                        typename = Common.transType2En(typename)
                    }
                    $('#filter-brand-type').append('<a class="wi-link-color" data-name="' + types[t].key + '"><span>' + typename + '(' + types[t].doc_count + ')' + '</span></a>')
                }
            }
        }

        // 商标名、商标状态、注册号、申请时间、类别、申请人名称
        for (var i = 0; i < item.length; i++) {
            var imgSrc = "../resource/images/Reports/no_photo_list.png";
            var imgId = item[i].trademark_image ? item[i].trademark_image : '';
            if (imgId) {
                imgSrc = 'http://news.windin.com/ns/imagebase/6710/' + imgId;
            }
            htmlArr.push('<div class="div_Card" data-detailid="' + item[i].detail_id + '">')
            htmlArr.push('<div class="searchpic-brand"><img class="big-logo"  width="90" src="' + imgSrc + '"></div>')
            htmlArr.push('<div class="searchcontent-brand">')
            htmlArr.push('<h5 class="searchtitle-brand wi-link-color">' + (item[i].trademark_name ? item[i].trademark_name : '--') + '</h5>')
            htmlArr.push('<i class="state-yes">' + (item[i].trademark_status ? item[i].trademark_status : '--') + '</i>')
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work">' + intl('138476' /*注册号*/ ) + '：' + (item[i].application_number ? item[i].application_number : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138156' /*申请时间*/ ) + '：' + (item[i].application_date ? Common.formatTime(item[i].application_date) : '--') + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('138349' /*国际类别*/ ) + '：' + (item[i].international_classification ? item[i].international_classification : '--') + '</span>')
            if (item[i].applicant_ch_name_id) {
                var pingParam = '&fromModule=showSearchBrand&fromField=申请人&opId=' + item[i].applicant_ch_name_id; //bury
                htmlArr.push('<span class="searchitem-work">' + intl('58656' /*申请人*/ ) + '：<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + item[i].applicant_ch_name_id + '" data-pingParam="' + pingParam + '">' + (item[i].applicant_ch_name ? item[i].applicant_ch_name : '--') + '</a></span>')
            } else {
                htmlArr.push('<span class="searchitem-work">' + intl('58656' /*申请人*/ ) + '：' + (item[i].applicant_ch_name ? item[i].applicant_ch_name : '--') + '</span>')
            }
            htmlArr.push('</div></div></div>')
        }

        if (type == 1) {
            $("#div_DataListBrand").append(htmlArr.join(""));
            preventSumbitBrand = true;
        } else {
            preventSumbitBrand = true;
            $("#div_DataListBrand").html(htmlArr.join(""));
        }
        if ((parseInt(searchBrandParam.pageNo) + 1) * parseInt(searchBrandParam.pageSize) >= res.Page.Records) {
            $("#searchMoreBrand").hide();
        } else {
            $("#searchMoreBrand").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListBrand").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchBrandResultNum").text(0);
    }
}

function showSearchPatent(data, type) {
    $("#searchLoadPatent").hide();
    $("#searchMask").height($(window).height()).show();
    var res = JSON.parse(data);
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchPatentResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];

        var states = res.Data.aggregations.aggs_law_status;
        var types = res.Data.aggregations.aggs_patent_type;
        var htmlArr = [];

        if (type !== 1) {
            for (var s = 0; s < states.length; s++) {
                var statePatent = states[s].key;
                if (isEn) {
                    statePatent = Common.transPatentState2En(statePatent)
                }
                if (states[s].key == searchPatentParam.status) {
                    $('#filter-patent-state').find('a.wi-secondary-color').removeClass('wi-secondary-color');
                    $('#filter-patent-state').append('<a class="wi-link-color wi-secondary-color" data-name="' + states[s].key + '"><span>' + statePatent + '(' + states[s].doc_count + ')' + '</span></a>')
                } else {
                    $('#filter-patent-state').append('<a class="wi-link-color" data-name="' + states[s].key + '"><span>' + statePatent + '(' + states[s].doc_count + ')' + '</span></a>')
                }
            }
            for (var t = 0; t < types.length; t++) {
                var typePatent = types[t].key;
                if (isEn) {
                    typePatent = Common.transPatentType2En(typePatent)
                }
                if (types[t].key == searchPatentParam.category) {
                    $('#filter-patent-type').find('a.wi-secondary-color').removeClass('wi-secondary-color');
                    $('#filter-patent-type').append('<a class="wi-link-color wi-secondary-color" data-name="' + types[t].key + '"><span>' + typePatent + '(' + types[t].doc_count + ')' + '</span></a>')
                } else {
                    $('#filter-patent-type').append('<a class="wi-link-color" data-name="' + types[t].key + '"><span>' + typePatent + '(' + types[t].doc_count + ')' + '</span></a>')
                }
            }
        }

        // 专利名称、专利状态、申请号、公布号、专利类型、申请日、发明人、申请人

        for (var i = 0; i < item.length; i++) {

            htmlArr.push('<div class="div_Card" data-detailid="' + item[i].detail_id + '"  >')
            htmlArr.push('<h5 class="searchtitle-brand wi-link-color">' + (item[i].patent_name ? item[i].patent_name : '--') + '</h5>')
            htmlArr.push('<i class="state-yes">' + (item[i].law_status ? item[i].law_status : '--') + '</i>')
            htmlArr.push('<div class="each-searchlist-item">')

            htmlArr.push('<span class="searchitem-work">' + intl('138154' /*申请号*/ ) + '：' + (item[i].apply_number ? item[i].apply_number : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('145848' /*公布号*/ ) + '：' + (item[i].release_number ? item[i].release_number : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138430' /*专利类型*/ ) + '：' + (item[i].patent_type ? item[i].patent_type : '--') + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('138152' /*申请日*/ ) + '：' + (item[i].apply_date ? Common.formatTime(item[i].apply_date) : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138351' /*发明人*/ ) + '：' + (item[i].inventor ? item[i].inventor : '--') + '</span>')

            var sqrIds = item[i].applicant_and_id;
            var sqrStr = '';
            if (sqrIds.length) {
                var sqrNames = item[i].applicant.length ? item[i].applicant[0].split(';') : item[i].applicant.split(';');
                var sqrObjs = {};
                for (var k = 0; k < sqrNames.length; k++) {
                    sqrObjs[sqrNames[k]] = '';
                }
                var ids = [];
                for (var j = 0; j < sqrIds.length; j++) {
                    if (sqrIds[j].split('|').length) {
                        sqrObjs[sqrIds[j].split('|')[0]] = sqrIds[j].split('|')[1];
                    }
                }
                for (var sqrKey in sqrObjs) {
                    var pingParam = '&fromModule=showSearchPatent&fromField=申请人&opId=' + sqrObjs[sqrKey]; //bury
                    sqrStr = sqrStr ? (sqrStr + ',' + '<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + sqrObjs[sqrKey] + '" data-pingParam="' + pingParam + '">' + sqrKey + '</a>') : ('<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + sqrObjs[sqrKey] + '" data-pingParam="' + pingParam + '">' + sqrKey + '</a>');
                }
                htmlArr.push('<span class="searchitem-work">' + intl('138659', '申请（专利权）人') + '：' + (sqrStr ? sqrStr : '--') + '</span>')
            } else {
                htmlArr.push('<span class="searchitem-work">' + intl('138659', '申请（专利权）人') + '：' + (item[i].applicant ? item[i].applicant : '--') + '</span>')
            }
            htmlArr.push('</div></div>')
        }

        if (type == 1) {
            $("#div_DataListPatent").append(htmlArr.join(""));
            preventSumbitPatent = true;
        } else {
            preventSumbitPatent = true;
            $("#div_DataListPatent").html(htmlArr.join(""));
        }
        if ((parseInt(searchPatentParam.pageNo) + 1) * parseInt(searchPatentParam.pageSize) >= res.Page.Records) {
            $("#searchMorePatent").hide();
        } else {
            $("#searchMorePatent").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListPatent").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchPatentResultNum").text(0);
    }
}

function showSearchNews(data, type) {
    //新闻搜索结果
    $("#searchLoadNews").hide();
    $("#searchMask").height($(window).height()).show();
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = '查新闻';
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchNewsParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchNewsResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        var tags = res.Data.aggregations.tags;
        var fm = res.Data.aggregations.fm;
        var htmlArr = [];
        if (type !== 1) {
            for (var s = 0; s < tags.length; s++) {
                var currentTag = tags[s].companyNewsTagsName;
                if (tags[s].companyNewsTags == searchNewsParam.label) {
                    $('#filter-news-tag').find('a.wi-secondary-color').removeClass('wi-secondary-color');
                    $('#filter-news-tag').append('<a class="wi-link-color wi-secondary-color" data-code="' + tags[s].companyNewsTags + '" data-name="' + tags[s].companyNewsTagsName + '"><span>' + currentTag + '(' + tags[s].tagsCount + ')' + '</span></a>')
                } else {
                    $('#filter-news-tag').append('<a class="wi-link-color"  data-code="' + tags[s].companyNewsTags + '"  data-name="' + tags[s].companyNewsTagsName + '"><span>' + currentTag + '(' + tags[s].tagsCount + ')' + '</span></a>')
                }
            }
            for (var t = 0; t < fm.length; t++) {
                var currentFm = fm[t].fmName;
                if (currentFm == searchNewsParam.sentiment) {
                    $('#filter-news-mood').find('a.wi-secondary-color').removeClass('wi-secondary-color');
                    $('#filter-news-mood').append('<a class="wi-link-color wi-secondary-color" data-code="' + fm[t].fmName + '"><span>' + currentFm + '(' + fm[t].fmCount + ')' + '</span></a>')
                } else {
                    $('#filter-news-mood').append('<a class="wi-link-color" data-code="' + fm[t].fmName + '"><span>' + currentFm + '(' + fm[t].fmCount + ')' + '</span></a>')
                }
            }
        }
        for (var i = 0; i < item.length; i++) {
            //          htmlArr.push('<div class="div_Card" data-title="' + item[i].title + '" data-detailid="' + item[i].mediaID + '"  >')
            var fmNameStr = "";
            if (item[i].fmName == "负面") {
                fmNameStr = '<span class="news-fm-tag">负</span>'
            }
            //          htmlArr.push('<h5 class="searchtitle-news wi-link-color">' + fmNameStr + (item[i].title ? item[i].title : '--') + '</h5>');
            var labelArr = [];
            var burylabel = [];
            if (item[i].companyNewsTagsArray && item[i].companyNewsTagsArray.length > 0) {
                labelArr = ['<div class="news-tag-list">'];
                for (var k = 0; k < item[i].companyNewsTagsArray.length; k++) {
                    labelArr.push('<span class="each-news-tag">' + (item[i].companyNewsTagsArray[k].name ? item[i].companyNewsTagsArray[k].name : "--") + '</span>');
                    if (item[i].companyNewsTagsArray[k].code) {
                        burylabel.push(item[i].companyNewsTagsArray[k].code);
                    }
                }
                labelArr.push('</div>')
                    //              htmlArr.push(labelArr.join(""));
            }
            burylabel.push(item[i].fmName);
            var buryStrategy = burylabel.join(',');
            var buryNewsId = 'mediaId:' + item[i].mediaID + '&groupId:' + item[i].newsGroupId;
            htmlArr.push('<div class="div_Card buryClick" data-title="' + item[i].title + '" data-detailid="' + item[i].mediaID + '" data-buryOpType="click" data-buryStrategy="' + buryStrategy + '" data-buryfuncType="detailView" data-buryEntity="news" data-buryId="' + buryNewsId + '" >')
            htmlArr.push('<h5 class="searchtitle-news wi-link-color">' + fmNameStr + (item[i].title ? item[i].title : '--') + '</h5>');
            htmlArr.push(labelArr.join(""));

            var relationArr = []; //关联企业
            if (item[i].relationCompanys && item[i].relationCompanys.length > 0) {
                for (var k = 0; k < item[i].relationCompanys.length; k++) {
                    var relationCode = item[i].relationCompanys[k].windCode;
                    var relationName = item[i].relationCompanys[k].name;
                    if (relationCode) {
                        relationArr.push('<a class="each-relation-corp wi-secondary-color wi-link-color" ccode="' + relationCode + '">' + relationName + '</a>');
                    } else {
                        relationArr.push('<span class="each-relation-corp" data-code="' + relationCode + '">' + relationName + '</span>');
                    }
                }
            }
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work">' + intl('138661', '关联企业') + '：' + relationArr.join("、") + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('138774', '发布时间') + '：' + (item[i].releaseTime ? item[i].releaseTime : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('9754', '来源') + '：' + (item[i].source ? item[i].source : '--') + '</span>')
            htmlArr.push('</div></div>')
        }

        if (type == 1) {
            $("#div_DataListNews").append(htmlArr.join(""));
            preventSumbitNews = true;
        } else {
            preventSumbitNews = true;
            $("#div_DataListNews").html(htmlArr.join(""));
        }
        if ((parseInt(searchNewsParam.pageNo) + 1) * parseInt(searchNewsParam.pageSize) >= res.Page.Records) {
            $("#searchMoreNews").hide();
        } else {
            $("#searchMoreNews").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListNews").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchNewsResultNum").text(0);
    }
}

function showSearchWork(data, type) {
    $("#searchLoadWork").hide();
    $("#searchMask").height($(window).height()).show();
    var res = JSON.parse(data);
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchWorkResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        // 作品名称、作品类别、登记号、创作完成日期、首次发表日期、登记日期、作品著作权人名称
        for (var i = 0; i < item.length; i++) {
            htmlArr.push('<div class="div_Card">')
            htmlArr.push('<h5 class="searchtitle-work">' + (item[i].work_title ? item[i].work_title : '--') + '</h5>')
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work">' + intl('138690' /*登记日期*/ ) + '：' + (item[i].registration_date ? Common.formatTime(item[i].registration_date) : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138482' /*登记号*/ ) + '：' + (item[i].registration_number ? item[i].registration_number : '--') + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('138195' /*作品类别*/ ) + '：' + (item[i].work_category ? item[i].work_category : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138243' /*首次发表日期*/ ) + '：' + (item[i].initial_publication_date ? Common.formatTime(item[i].initial_publication_date) : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138220' /*创作完成日期*/ ) + '：' + (item[i].completion_date ? Common.formatTime(item[i].completion_date) : '--') + '</span>')
            htmlArr.push('<br>')

            // if (item[i].owner_id) {
            //     var pingParam = '&fromModule=showSearchWork&fromField=作品著作权人&opId=' + item[i].owner_id; //bury
            //     htmlArr.push('<span class="searchitem-work">' + intl('145853' /*作品著作权人*/ ) + '：<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + item[i].owner_id + '" data-pingParam="' + pingParam + '">' + (item[i].owner_name ? item[i].owner_name : '--') + '</a></span>')
            // } else {
            //     htmlArr.push('<span class="searchitem-work">' + intl('145853' /*作品著作权人*/ ) + '：' + (item[i].owner_name ? item[i].owner_name : '--') + '</span>')
            // }

            var name_id = item[i].new_owner_name_and_id;
            if (name_id) {
                htmlArr.push('<span class="searchitem-work">' + intl('145853' /*作品著作权人*/ ) + '：');
                for (var i = 0; i < name_id.length; i++) {
                    var name_id_arr = name_id.split("|");
                    var tmpName = name_id_arr[0];
                    var tmpId = name_id_arr[1] ? name_id_arr[1] : "";
                    if (tmpId) {
                        htmlArr.push('<a class="mar-r-5wi-link-color wi-secondary-color search-work-link" href="" data-code="' + tmpId + '" >' + (tmpName ? tmpName : '--') + '</a>')
                    } else {
                        htmlArr.push('<span class="mar-r-5">' + tmpName + '</span>')
                    }
                }
                htmlArr.push('</span>');
            }

            htmlArr.push('</div></div>')
        }

        if (type == 1) {
            $("#div_DataListWork").append(htmlArr.join(""));
            preventSumbitWork = true;
        } else {
            preventSumbitWork = true;
            $("#div_DataListWork").html(htmlArr.join(""));
        }
        if ((parseInt(searchWorkParam.pageNo) + 1) * parseInt(searchWorkParam.pageSize) >= res.Page.Records) {
            $("#searchMoreWork").hide();
        } else {
            $("#searchMoreWork").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListWork").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchWorkResultNum").text(0);
    }
}

function showSearchSoft(data, type) {
    $("#searchLoadSoft").hide();
    $("#searchMask").height($(window).height()).show();
    var res = JSON.parse(data);
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchSoftResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];

        // 软件著作权名称、软件著作权简称、版本号、登记号、分类号、首次发表日期、登记批准日期、软件著作权人名称
        for (var i = 0; i < item.length; i++) {

            htmlArr.push('<div class="div_Card">')
            htmlArr.push('<h5 class="searchtitle-work">' + (item[i].software_copyright_name ? item[i].software_copyright_name : '--') + '</h5>')
            htmlArr.push('<div class="each-searchlist-item">')

            htmlArr.push('<span class="searchitem-work">' + intl('138482' /*登记号*/ ) + '：' + (item[i].registration_number ? item[i].registration_number : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138209' /*分类号*/ ) + '：' + (item[i].classification_number ? item[i].classification_number : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('149698' /*软件简称*/ ) + '：' + (item[i].software_copyright_short_name ? item[i].software_copyright_short_name : '--') + '</span>')

            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('138573' /*版本号*/ ) + '：' + (item[i].version_number ? item[i].version_number : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138243' /*首次发表日期*/ ) + '：' + (item[i].initial_publication_date ? Common.formatTime(item[i].initial_publication_date) : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('138158' /*登记批准日期*/ ) + '：' + (item[i].approval_date ? Common.formatTime(item[i].approval_date) : '--') + '</span>')
            htmlArr.push('<br>')

            if (item[i].owner_id) {
                var pingParam = '&fromModule=showSearchSoft&fromField=软件著作权人&opId=' + item[i].owner_id; //bury
                htmlArr.push('<span class="searchitem-work">' + intl('145854' /*软件著作权人*/ ) + '：<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + item[i].owner_id + '" data-pingParam="' + pingParam + '">' + (item[i].owner_name ? item[i].owner_name : '--') + '</a></span>')
            } else {
                htmlArr.push('<span class="searchitem-work">' + intl('145854' /*软件著作权人*/ ) + '：' + (item[i].owner_name ? item[i].owner_name : '--') + '</span>')
            }
            htmlArr.push('</div></div>')
        }

        if (type == 1) {
            $("#div_DataListSoft").append(htmlArr.join(""));
            preventSumbitSoft = true;
        } else {
            preventSumbitSoft = true;
            $("#div_DataListSoft").html(htmlArr.join(""));
        }
        if ((parseInt(searchSoftParam.pageNo) + 1) * parseInt(searchSoftParam.pageSize) >= res.Page.Records) {
            $("#searchMoreSoft").hide();
        } else {
            $("#searchMoreSoft").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListSoft").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchSoftResultNum").text(0);
    }
}

function showSearchPerson(data, type) {
    $("#searchLoadMan").hide();
    $("#searchMask").height($(window).height()).show();
    var res = JSON.parse(data);

    //bury
    if (res && res.ErrorCode == "0" && res.Data) {
        var activeType = 'search';
        var opEntity = "getclassifyperson";
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchPersonParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }

    if (res.ErrorCode == 0 && res.Data && res.Data.search && res.Data.search.length > 0) {
        $("#searchManResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.search;
        var htmlArr = [];
        for (var i = 0; i < item.length; i++) {
            var personIdStr = item[i].person_id
            var imgBgIdStr = personIdStr.substring(personIdStr.length - 1, personIdStr.length)
            var imgBgId = (imgBgIdStr.charCodeAt(0)) % 9
            var imgBgArr = ['img-history-bg-1st', 'img-history-bg-2nd', 'img-history-bg-3rd', 'img-history-bg-4th', 'img-history-bg-5th', 'img-history-bg-6th', 'img-history-bg-7th', 'img-history-bg-8th', 'img-history-bg-9th']
            var imgStr = "";
            if (item[i] && item[i].image_id_new) { // 人物新接口
                imgStr = '<img class="big-logo"  src="' + item[i].image_id_new + '" width=49 height=49/>';
            } else if (item[i].image_id) {
                // if (!global_isRelease) {
                imgStr = '<img class="big-logo"  src="http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + item[i].image_id + '" width=49 height=49/>';
                // } else {
                // imgStr = '<img src="http://wfcweb/imageWeb/ImgHandler.aspx?imageID=' + item[i].image_id + '" width=49 height=49/>';
                // }
            } else {
                imgStr = item[i].person_name.substring(0, 1);
            }
            //bury
            var buryRankNum = searchPersonParam.pageNo * searchPersonParam.pageSize + i + 1;
            var buryData = 'data-burynum="' + buryRankNum + '" data-buryInput="' + buryFCode.getUrlParam('local')['keyword'] + '" data-buryfuncType="searchListCk" data-buryModule="searchList" data-buryId="' + item[i].person_id + '" ';
            htmlArr.push('<li class="each-person-item"  data-id="' + item[i].person_id + '" data-keyword="' + item[i].person_name + '" ' + buryData + '><div class="top-man-card"><div class="img-header  ' + imgBgArr[imgBgId] + '">' + imgStr + '</div><div class="top-man-r"><a data-id="' + item[i].person_id + '" data-keyword="' + item[i].person_name + '" class="wi-secondary-color wi-link-color top-man-name">' + item[i].person_name + '</a><span class="top-man-sub">' + intl('138716' /* 关联 */ ) + '<span class="wi-secondary-color" id="numRelateCompany">' + (item[i].relative_ent_cnt ? item[i].relative_ent_cnt : 0) + '</span>' + intl('138212' /* 家公司，主要分布 */ ) + '：</span></div><div class="relate-companys">');
            var controlCompanyArr = item[i].region_cnt_corp_name;
            if (controlCompanyArr) {
                var len = controlCompanyArr.length >= 3 ? 3 : controlCompanyArr.length;
                for (var j = 0; j < len; j++) {
                    var tmpArr = controlCompanyArr[j].split("_");
                    var showStr = "";
                    if (tmpArr[3]) {
                        if (tmpArr[2] > 1) {
                            showStr = tmpArr[3].length > 11 ? tmpArr[3].substring(0, 11) + "..." : tmpArr[3];
                            showStr = showStr + intl('138285' /* 等 */ );
                        } else {
                            showStr = tmpArr[3].length > 12 ? tmpArr[3].substring(0, 12) + "..." : tmpArr[3];
                        }
                    }
                    htmlArr.push('<div class="relate-company-model"><i></i><span class="fl">' + tmpArr[1] + '(' + intl('138587' /*共*/ ) + ' <span class="wi-secondary-color">' + tmpArr[2] + '</span>' + ')</span><span class="relate-company">' + showStr + '</span></div>')
                }
            }
            htmlArr.push('</div><div>')
            if (item[i].artificial_person_cnt && item[i].artificial_person_cnt != 0) {
                htmlArr.push('<span class="num-control" data-type="person_drfr"   data-id="' + item[i].person_id + '" data-keyword="' + item[i].person_name + '" ><span class="num-control-model" title="' + intl('138160' /* 担任法人 */ ) + '">' + item[i].artificial_person_cnt + '</span>' + intl('138160' /* 担任法人 */ ) + '</span>');
            }
            if (item[i].foreign_invest_cnt && item[i].foreign_invest_cnt != 0) {
                htmlArr.push('<span class="num-control" data-type="person_dwtz"   data-id="' + item[i].person_id + '" data-keyword="' + item[i].person_name + '" ><span class="num-control-model" title="' + intl('138724' /* 对外投资 */ ) + '">' + item[i].foreign_invest_cnt + '</span>' + intl('138724' /* 对外投资 */ ) + '</span>');
            }
            if (item[i].foreign_job_cnt && item[i].foreign_job_cnt != 0) {
                htmlArr.push('<span class="num-control" data-type="person_dwrz"   data-id="' + item[i].person_id + '" data-keyword="' + item[i].person_name + '" ><span class="num-control-model" title="' + intl('138525' /* 在外任职 */ ) + '">' + item[i].foreign_job_cnt + '</span>' + intl('138525' /* 在外任职 */ ) + '</span>');
            }
            if (item[i].actual_control_cnt && item[i].actual_control_cnt != 0) {
                htmlArr.push('<span class="num-control" data-type="person_sjkz"   data-id="' + item[i].person_id + '" data-keyword="' + item[i].person_name + '" ><span class="num-control-model" title="' + intl('138125' /* 实际控制 */ ) + '">' + item[i].actual_control_cnt + '</span>' + intl('138125' /* 实际控制 */ ) + '</span>');
            }
            htmlArr.push('</div></div></li>')
        }
        if (type == 1) {
            $("#div_DataListMan").append(htmlArr.join(""));
            preventSumbitMan = true;
        } else {
            preventSumbitMan = true;
            $("#div_DataListMan").html(htmlArr.join(""));
        }
        if ((parseInt(searchPersonParam.pageNo) + 1) * parseInt(searchPersonParam.pageSize) >= res.Page.Records) {
            $("#searchMoreMan").hide();
        } else {
            $("#searchMoreMan").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListMan").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchManResultNum").text(0);
    }
}
$(document).on('click', '.dishonest-h4', function(e) {
    e.stopPropagation();
    var id = $(this).attr("data-id");
    var name = $(this).attr("data-name");
    if (id) {
        if (id.length > 10) {
            window.open("Person.html?id=" + id + "&name=" + name)
        } else {
            Common.linkCompany('Bu3', id);
        }
    } else {
        $(this).parent(".div_Card").trigger("click");
    }
    return false;
})
$("#searchFilterRisk").on("click", "li .wi-link-color", function() {
    $this = $(this);
    $this.addClass("wi-secondary-color").siblings().removeClass("wi-secondary-color");
    var key = $this.parents("li").attr("data-paramname");
    var val = $this.attr("data-name");
    if (key == "type") {
        resetRiskCondition();
    }
    searchRiskParam[key] = val;
    searchRiskParam.pageNo = 0;
    myWfcAjax("getrisksearch", searchRiskParam, function(data) {
        showSearchRisk(data); //显示综合风险
    });
    return false;
})
$("#searchFilterIntellectual").on("click", "li .wi-link-color", function() {
    $this = $(this);
    $this.addClass("wi-secondary-color").siblings().removeClass("wi-secondary-color");
    var key = $this.parents("li").attr("data-paramname");
    var val = $this.attr("data-name");
    if (key == "type") {
        resetIntellectualCondition();
    }
    if (key == "category" && !val) {
        searchIntellectualParam.subcategory = "";
        searchIntellectualParam.subsubcategory = "";
    }
    if (key == "subcategory" && !val) {
        //对于专利而言，如果第三类选择成空，那么第四类强制为空。
        searchIntellectualParam.subsubcategory = "";
    }
    searchIntellectualParam.pageNo = 0;
    searchIntellectualParam[key] = val;
    myWfcAjax("getintellectual", searchIntellectualParam, function(data) {
        showSearchIntellectual(data); //显示综合风险
    });
    return false;
})

function resetRiskCondition() {
    //重置风险属性
    searchRiskParam.caseType = "";
    searchRiskParam.area = "";
    $("#filterSubRisk").empty().removeClass("data-interface");
}

function resetIntellectualCondition() {
    //重置知识属性
    searchIntellectualParam.category = "";
    searchIntellectualParam.status = "";
    $("#filterSubIntellectual").empty().removeClass("data-interface");
}

function showEachRiskItem(item) {
    var htmlArr = [];
    var tag = item.search_tag;
    if (tag == '裁判文书' || searchRiskParam.type == "judgeinfo_search") {
        //裁判文书
        htmlArr.push('<div data-type="judgment" class="div_Card div_Card_Link buryClickCenter" data-detailid="' + item.case_id + '"  >')
        htmlArr.push('<h5 class="searchtitle-h4 wi-link-color">' + (item.case_title ? item.case_title : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138190' /*案号*/ ) + '：' + (item.case_no ? item.case_no : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138196' /*案由*/ ) + '：' + (item.case_type_detail ? item.case_type_detail : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138192' /*案件类型*/ ) + '：' + (item.case_type ? item.case_type : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138357' /*判决时间*/ ) + '：' + (item.judge_time ? Common.formatTime(item.judge_time) : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138228' /*执行法院*/ ) + '：' + (item.court_name ? item.court_name : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138699' /*省份地区*/ ) + '：' + (item.area_name ? item.area_name : '--') + '</span>')
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138731', '裁判文书') + '</span></div>')
    } else if (tag == '开庭公告' || searchRiskParam.type == "court_session_announcement_search") {
        htmlArr.push('<div data-type="openNotice"  class="div_Card div_Card_Link buryClickCenter" data-detailid="' + item.announcement_id + '"  >')
        htmlArr.push('<h5 class="searchtitle-h4 wi-link-color">' + (item.announcement_cause ? item.announcement_cause : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138190' /*案号*/ ) + '：' + (item.announcement_no ? item.announcement_no : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138229' /*开庭时间*/ ) + '：' + (item.court_time ? Common.formatTime(item.court_time) : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138144', '公示时间') + '：' + (item.announcement_time ? Common.formatTime(item.announcement_time) : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138427' /*当事人*/ ) + '：' + (item.announcement_party_name ? item.announcement_party_name : '--') + '</span>')
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138657', '开庭公告') + '</span></div>')
    } else if (tag == '法院公告' || searchRiskParam.type == "court_announcement_search") {
        htmlArr.push('<div  data-type="court" class="div_Card div_Card_Link buryClickCenter" data-detailid="' + item.announcement_id + '"  >')
        htmlArr.push('<h5 class="searchtitle-h4 wi-link-color">' + (item.announcement_party_name ? item.announcement_party_name : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138147' /*公示类型*/ ) + '：' + (item.announcement_type ? item.announcement_type : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138196' /*案由*/ ) + '：' + (item.announcement_cause ? item.announcement_cause : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138148' /*公告人*/ ) + '：' + (item.announcer ? item.announcer : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138144' /*公示时间*/ ) + '：' + (item.announcement_time ? Common.formatTime(item.announcement_time) : '--') + '</span>')
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138226', '法院公告') + '</span></div>')
    } else if (tag == '司法拍卖' || searchRiskParam.type == "judicialsale_search") {
        htmlArr.push('<div  data-type="judicial" class="div_Card div_Card_Link buryClickCenter" data-detailid="' + item.notice_no + '"  >')
        htmlArr.push('<h5 class="searchtitle-h4 wi-link-color">' + (item.sale_title ? item.sale_title : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138515' /*起拍价*/ ) + '：' + (item.starting_price ? item.starting_price : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138237' /*拍卖日期*/ ) + '：' + (item.sort_date ? Common.formatTime(item.sort_date) : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138227' /*拍卖法院*/ ) + '：' + (item.sale_court ? item.sale_court : '--') + '</span>')
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138359', '司法拍卖') + '</span></div>')
    } else if (tag == '失信人' || searchRiskParam.type == "discredicted_person_search") {
        htmlArr.push('<div data-type="dishonest"  class="div_Card div_Card_Link buryClickCenter" data-detailid="' + item.detail_id + '"  >')
        htmlArr.push('<h5 class="searchtitle-h4 wi-link-color dishonest-h4" data-id="' + item.concerned_person_id + '" data-name="' + item.concerned_person_name + '">' + (item.concerned_person_name ? item.concerned_person_name : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138435' /*被执行人的履行情况*/ ) + '：' + (item.performance ? item.performance : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138190' /*案号*/ ) + '：' + (item.case_no ? item.case_no : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138294' /*立案时间*/ ) + '：' + (item.filing_time ? Common.formatTime(item.filing_time) : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('34378' /*省份*/ ) + '：' + (item.area_name ? item.area_name : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138512' /*行为具体情形*/ ) + '：' + (item.behavior ? item.behavior : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138228' /*执行法院*/ ) + '：' + (item.execution_court ? item.execution_court : '--') + '</span>')
        htmlArr.push('</div><span class="search-risk-tag">' + intl('151233', '失信人') + '</span></div>')
    } else if (tag == '被执行人' || searchRiskParam.type == "concerned_person_search") {
        htmlArr.push('<div data-type="executee" class="div_Card div_Card_Link buryClickCenter" data-detailid="' + item.detail_id + '"  >')
        htmlArr.push('<h5 class="searchtitle-h4 wi-link-color">' + (item.concerned_person_name ? item.concerned_person_name : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138190' /*案号*/ ) + '：' + (item.case_no ? item.case_no : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('139154' /*标的*/ ) + '：' + (item.execution_target ? item.execution_target : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138294' /*立案时间*/ ) + '：' + (item.filing_time ? Common.formatTime(item.filing_time) : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138228' /*执行法院*/ ) + '：' + (item.execution_court ? item.execution_court : '--') + '</span>')
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138592', '被执行人') + '</span></div>')
    }
    return htmlArr.join("");
}

function showEachIntellectualItem(item) {
    var htmlArr = [];
    var tag = item.search_tag;
    if (tag == '商标' || searchIntellectualParam.type == "trademark_search") {
        //商标
        var imgSrc = "../resource/images/Reports/no_photo_list.png";
        var imgId = item.trademark_image ? item.trademark_image : '';
        if (imgId) {
            imgSrc = 'http://news.windin.com/ns/imagebase/6710/' + imgId;
        }
        htmlArr.push('<div data-type="brand" class="div_Card  div_Card_Link  buryClickCenter" data-detailid="' + item.detail_id + '">')
        htmlArr.push('<div class="searchpic-brand"><img class="big-logo"  width="90" src="' + imgSrc + '"></div>')
        htmlArr.push('<div class="searchcontent-brand">')
        htmlArr.push('<h5 class="searchtitle-intellectual wi-link-color">' + (item.trademark_name ? item.trademark_name : '--') + '</h5>')
        htmlArr.push('<i class="state-yes">' + (item.trademark_status ? item.trademark_status : '--') + '</i>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138476' /*注册号*/ ) + '：' + (item.application_number ? item.application_number : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138156' /*申请时间*/ ) + '：' + (item.application_date ? Common.formatTime(item.application_date) : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138349' /*国际类别*/ ) + '：' + (item.international_classification ? item.international_classification : '--') + '</span>')
        if (item.applicant_ch_name_id) {
            var pingParam = '&fromModule=showSearchBrand&fromField=申请人&opId=' + item.applicant_ch_name_id; //bury
            htmlArr.push('<span class="searchitem-work">' + intl('58656' /*申请人*/ ) + '：<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + item.applicant_ch_name_id + '" data-pingParam="' + pingParam + '">' + (item.applicant_ch_name ? item.applicant_ch_name : '--') + '</a></span>')
        } else {
            htmlArr.push('<span class="searchitem-work">' + intl('58656' /*申请人*/ ) + '：' + (item.applicant_ch_name ? item.applicant_ch_name : '--') + '</span>')
        }
        htmlArr.push('</div></div><span class="search-risk-tag">' + intl('138799', '商标') + '</span></div>')
    } else if (tag == '专利' || searchIntellectualParam.type == "patent_search") {
        htmlArr.push('<div data-type="patent" class="div_Card  div_Card_Link buryClickCenter" data-detailid="' + item.detail_id + '"  >')
        htmlArr.push('<h5 class="searchtitle-intellectual wi-link-color">' + (item.patent_name ? item.patent_name : '--') + '</h5>')
        var law_status = item.law_status;
        if (law_status) {
            if (law_status.indexOf('终止') > -1 || law_status.indexOf('中止') > -1 || law_status.indexOf('驳回') > -1 || law_status.indexOf('撤销') > -1 || law_status.indexOf('吊销') > -1) {
                htmlArr.push('<i class="state-no">' + (item.law_status ? item.law_status : '--') + '</i>')
            } else {
                htmlArr.push('<i class="state-yes">' + (item.law_status ? item.law_status : '--') + '</i>')
            }
        }
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138154' /*申请号*/ ) + '：' + (item.apply_number ? item.apply_number : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('145848' /*公布号*/ ) + '：' + (item.release_number ? item.release_number : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138430' /*专利类型*/ ) + '：' + (item.patent_type ? item.patent_type : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138152' /*申请日*/ ) + '：' + (item.apply_date ? Common.formatTime(item.apply_date) : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138351' /*发明人*/ ) + '：' + (item.inventor ? item.inventor : '--') + '</span>')
        var sqrIds = item.applicant_and_id;
        var sqrStr = '';
        if (sqrIds.length) {
            var sqrNames = item.applicant.length ? item.applicant[0].split(';') : item.applicant.split(';');
            var sqrObjs = {};
            for (var k = 0; k < sqrNames.length; k++) {
                sqrObjs[sqrNames[k]] = '';
            }
            var ids = [];
            for (var j = 0; j < sqrIds.length; j++) {
                if (sqrIds[j].split('|').length) {
                    sqrObjs[sqrIds[j].split('|')[0]] = sqrIds[j].split('|')[1];
                }
            }
            for (var sqrKey in sqrObjs) {
                var _tmpCode = sqrObjs[sqrKey];
                var klass = _tmpCode ? ' wi-link-color wi-secondary-color ' : '';
                var pingParam = '&fromModule=showSearchPatent&fromField=申请人&opId=' + sqrObjs[sqrKey]; //bury
                sqrStr = sqrStr ? (sqrStr + ',' + '<a class=" search-work-link ' + klass + ' " href="" data-code="' + sqrObjs[sqrKey] + '" data-pingParam="' + pingParam + '">' + sqrKey + '</a>') : ('<a class=" search-work-link ' + klass + '" href="" data-code="' + sqrObjs[sqrKey] + '" data-pingParam="' + pingParam + '">' + sqrKey + '</a>');
            }
            htmlArr.push('<span class="searchitem-work">' + intl('138659', '申请（专利权）人') + '：' + (sqrStr ? sqrStr : '--') + '</span>')
        } else {
            htmlArr.push('<span class="searchitem-work">' + intl('138659', '申请（专利权）人') + '：' + (item.applicant ? item.applicant : '--') + '</span>')
        }
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138749', '专利') + '</span></div>')
    } else if (tag == '软件著作权' || searchIntellectualParam.type == "software_search") {
        htmlArr.push('<div class="div_Card div_Card_Link" >')
        htmlArr.push('<h5 class="searchtitle-intellectual">' + (item.software_copyright_name ? item.software_copyright_name : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138482' /*登记号*/ ) + '：' + (item.registration_number ? item.registration_number : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138209' /*分类号*/ ) + '：' + (item.classification_number ? item.classification_number : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('149698' /*软件简称*/ ) + '：' + (item.software_copyright_short_name ? item.software_copyright_short_name : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138573' /*版本号*/ ) + '：' + (item.version_number ? item.version_number : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138243' /*首次发表日期*/ ) + '：' + (item.initial_publication_date ? Common.formatTime(item.initial_publication_date) : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138158' /*登记批准日期*/ ) + '：' + (item.approval_date ? Common.formatTime(item.approval_date) : '--') + '</span>')
        htmlArr.push('<br>')
        if (item.owner_id) {
            var pingParam = '&fromModule=showSearchSoft&fromField=软件著作权人&opId=' + item.owner_id; //bury
            htmlArr.push('<span class="searchitem-work">' + intl('145854' /*软件著作权人*/ ) + '：<a class="wi-link-color wi-secondary-color search-work-link" href="" data-code="' + item.owner_id + '" data-pingParam="' + pingParam + '">' + (item.owner_name ? item.owner_name : '--') + '</a></span>')
        } else {
            htmlArr.push('<span class="searchitem-work">' + intl('145854' /*软件著作权人*/ ) + '：' + (item.owner_name ? item.owner_name : '--') + '</span>')
        }
        htmlArr.push('</div><span class="search-risk-tag">' + intl('138788', '软件著作权') + '</span></div>')
    } else if (tag == '作品著作权' || searchIntellectualParam.type == "production_search") {
        htmlArr.push('<div class="div_Card div_Card_Link">')
        htmlArr.push('<h5 class="searchtitle-intellectual">' + (item.work_title ? item.work_title : '--') + '</h5>')
        htmlArr.push('<div class="each-searchlist-item">')
        htmlArr.push('<span class="searchitem-work">' + intl('138690' /*登记日期*/ ) + '：' + (item.registration_date ? Common.formatTime(item.registration_date) : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138482' /*登记号*/ ) + '：' + (item.registration_number ? item.registration_number : '--') + '</span>')
        htmlArr.push('<br>')
        htmlArr.push('<span class="searchitem-work">' + intl('138195' /*作品类别*/ ) + '：' + (item.work_category ? item.work_category : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138243' /*首次发表日期*/ ) + '：' + (item.initial_publication_date ? Common.formatTime(item.initial_publication_date) : '--') + '</span>')
        htmlArr.push('<span class="searchitem-work">' + intl('138220' /*创作完成日期*/ ) + '：' + (item.completion_date ? Common.formatTime(item.completion_date) : '--') + '</span>')
        htmlArr.push('<br>')
        var name_id = item.new_owner_name_and_id;
        if (name_id && name_id.length > 0) {
            htmlArr.push('<span class="searchitem-work">' + intl('145853' /*作品著作权人*/ ) + '：');
            for (var i = 0; i < name_id.length; i++) {
                var tmpName = name_id[i].name;
                var tmpId = name_id[i].id;
                if (tmpId) {
                    htmlArr.push('<a class="mar-r-5 wi-link-color wi-secondary-color search-work-link" href="" data-code="' + tmpId + '" >' + (tmpName ? tmpName : '--') + '</a>')
                } else {
                    htmlArr.push('<span class="mar-r-5">' + tmpName + '</span>')
                }
            }
            htmlArr.push('</span>');
        }

        htmlArr.push('</div><span class="search-risk-tag">' + intl('138756', '作品著作权') + '</span></div>')
    }
    return htmlArr.join("");
}

function showTypeFilter(typeStr) {
    //查找风险范围的过滤
    var tmpArr = ['<a class="wi-link-color" data-name="risk_merge_search"><span>' + intl('138927', '全部') + '</span></a>'];
    tmpArr.push(['<a class="wi-link-color wi-secondary-color" data-name="' + searchRiskParam.type + '"><span langkey="">' + typeStr + '</span></a>']);
    $("#filter-search-risk").html(tmpArr.join(""));
}

function showTypeFilterIntellectual(typeStr) {
    //查找知识产权范围的过滤
    var tmpArr = ['<a class="wi-link-color" data-name="intellectual_property_merge_search"><span>' + intl('138927', '全部') + '</span></a>'];
    tmpArr.push(['<a class="wi-link-color wi-secondary-color" data-name="' + searchIntellectualParam.type + '"><span langkey="">' + typeStr + '</span></a>']);
    $("#filter-search-intellectual").html(tmpArr.join(""));
}

function showRiskFilter(filterStr) {
    var dicObj = {
        '裁判文书': 'judgeinfo_search',
        '失信人': 'discredicted_person_search',
        '被执行人': 'concerned_person_search',
        '法院公告': 'court_announcement_search',
        '开庭公告': 'court_session_announcement_search',
        '司法拍卖': 'judicialsale_search'

    }
    var intlWordDic = {
            '裁判文书': intl('138731', '裁判文书'),
            '失信人': intl('151233', '失信人'),
            '被执行人': intl('138592', '被执行人'),
            '法院公告': intl('138226', '法院公告'),
            '开庭公告': intl('138657', '开庭公告'),
            '司法拍卖': intl('138359', '司法拍卖'),
        }
        //显示风险过滤条件
    var interfaceType = searchRiskParam.type;
    if (interfaceType == 'risk_merge_search') {
        //综合风险
        var tmpArr = ['<a class="wi-link-color wi-secondary-color" data-name="risk_merge_search"><span>' + intl('138927', '全部') + '</span></a>'];
        var type = filterStr.aggs_search_tag;

        for (var i = 0; i < type.length; i++) {
            var typeStr = type[i].key;
            tmpArr.push('<a class="wi-link-color" data-name="' + dicObj[type[i].key] + '"><span>' + intlWordDic[typeStr] + '(' + type[i].doc_count + ')' + '</span></a>');
        }
        $("#filter-search-risk").html(tmpArr.join(""))
    } else if (interfaceType == 'judgeinfo_search') {
        //裁判文书
        showTypeFilter(intlWordDic["裁判文书"]);
        var typeStr = createEachFilter(filterStr.aggs_case_type, intl('138192', '案件类型'), "caseType");
        var areaStr = createEachFilter(filterStr.aggs_area_name, intl('138699', '省份地区'), "area");
        $("#filterSubRisk").html(typeStr + areaStr).attr("data-interface", interfaceType);
    } else if (interfaceType == 'discredicted_person_search') {
        //失信人
        showTypeFilter(intlWordDic["失信人"]);
        var areaStr = createEachFilter(filterStr.aggs_area_name, intl('138699', '省份地区'), "area");
        $("#filterSubRisk").html(areaStr).attr("data-interface", interfaceType);
    } else if (interfaceType == 'concerned_person_search') {
        //被执行人
        showTypeFilter(intlWordDic["被执行人"]);
    } else if (interfaceType == 'court_announcement_search') {
        //法院公告
        showTypeFilter(intlWordDic["法院公告"]);
    } else if (interfaceType == 'court_session_announcement_search') {
        //开庭公告
        showTypeFilter(intlWordDic["开庭公告"]);
    } else if (interfaceType == 'judicialsale_search') {
        //司法拍卖
        showTypeFilter(intlWordDic["司法拍卖"]);
    }
    if (searchRiskParam.area) {
        $("#filterSubRisk li[data-paramname='area'] .wi-link-color[data-name='" + searchRiskParam.area + "']").addClass("wi-secondary-color");
    } else {
        $("#filterSubRisk li[data-paramname='area'] .wi-link-color:first").addClass("wi-secondary-color");
    }
    if (searchRiskParam.caseType) {
        $("#filterSubRisk li[data-paramname='caseType'] .wi-link-color[data-name='" + searchRiskParam.caseType + "']").addClass("wi-secondary-color");
    } else {
        $("#filterSubRisk li[data-paramname='caseType'] .wi-link-color:first").addClass("wi-secondary-color");
    }
}

function showIntellectualFilter(filterStr) {
    var dicObj = {
        '商标': 'trademark_search',
        '专利': 'patent_search',
        '软件著作权': 'software_search',
        '作品著作权': 'production_search',
    }
    var intlWordDic = {
            '商标': intl('138799', '商标'),
            '专利': intl('138749', '专利'),
            '软件著作权': intl('138788', '软件著作权'),
            '作品著作权': intl('138756', '作品著作权'),
        }
        //显示知识过滤条件
    var interfaceType = searchIntellectualParam.type;
    if (interfaceType == 'intellectual_property_merge_search') {
        //综合知识
        var tmpArr = ['<a class="wi-link-color wi-secondary-color" data-name="intellectual_property_merge_search"><span>' + intl('138927', '全部') + '</span></a>'];
        var type = filterStr.aggs_search_tag;

        for (var i = 0; i < type.length; i++) {
            var typeStr = type[i].key;
            tmpArr.push('<a class="wi-link-color" data-name="' + dicObj[type[i].key] + '"><span>' + intlWordDic[typeStr] + '(' + type[i].doc_count + ')' + '</span></a>');
        }
        $("#filter-search-intellectual").html(tmpArr.join(""))
    } else if (interfaceType == 'trademark_search') {
        //商标
        showTypeFilterIntellectual(intlWordDic["商标"]);
        var typeStr = createEachFilter(filterStr.aggs_trademark_status, intl('149497', '商标状态'), "status");
        var areaStr = createEachFilter(filterStr.aggs_international_classification, intl('145353', '商标类别'), "category");
        $("#filterSubIntellectual").html(typeStr + areaStr).attr("data-interface", interfaceType);
    } else if (interfaceType == 'patent_search') {
        //专利
        showTypeFilterIntellectual(intlWordDic["专利"]);
        var areaStr = createEachFilter(filterStr.aggs_patent_type, intl('138430', '专利类型'), "category");
        var patentStr = "";
        var typeStr = "";
        var categoryStr = "";
        if (filterStr.aggs_ipc_1 && filterStr.aggs_ipc_1.length > 0) {
            //如果非是外观设计专利
            typeStr = createEachFilter(filterStr.aggs_ipc_1, '专利类部', "subcategory");
            if (filterStr.aggs_ipc_2 && filterStr.aggs_ipc_2.length > 0) {
                categoryStr = createEachFilter(filterStr.aggs_ipc_2, '专利大类', "subsubcategory");
            }
            patentStr = typeStr + categoryStr;
        } else if (filterStr.aggs_loc_1 && filterStr.aggs_loc_1.length > 0) {
            //如果是外观设计专利
            typeStr = createEachFilter(filterStr.aggs_loc_1, 'LOC大类', "subcategory");
            if (filterStr.aggs_loc_2 && filterStr.aggs_loc_2.length > 0) {
                categoryStr = createEachFilter(filterStr.aggs_loc_2, 'LOC小类', "subsubcategory");
            }
            patentStr = typeStr + categoryStr;
        }
        $("#filterSubIntellectual").html(areaStr + patentStr).attr("data-interface", interfaceType);
    } else if (interfaceType == 'software_search') {
        //软件著作权
        showTypeFilterIntellectual(intlWordDic["软件著作权"]);
        $("#filterSubIntellectual").html(areaStr).attr("data-interface", interfaceType);
    } else if (interfaceType == 'production_search') {
        //作品著作权
        showTypeFilterIntellectual(intlWordDic["作品著作权"]);
        $("#filterSubIntellectual").html(areaStr).attr("data-interface", interfaceType);
    }
    if (searchIntellectualParam.status) {
        $("#filterSubIntellectual li[data-paramname='status'] .wi-link-color[data-name='" + searchIntellectualParam.status + "']").addClass("wi-secondary-color");
    } else {
        $("#filterSubIntellectual li[data-paramname='status'] .wi-link-color:first").addClass("wi-secondary-color");
    }
    if (searchIntellectualParam.category) {
        $("#filterSubIntellectual li[data-paramname='category'] .wi-link-color[data-name='" + searchIntellectualParam.category + "']").addClass("wi-secondary-color");
    } else {
        $("#filterSubIntellectual li[data-paramname='category'] .wi-link-color:first").addClass("wi-secondary-color");
    }
    if (searchIntellectualParam.subcategory) {
        $("#filterSubIntellectual li[data-paramname='subcategory'] .wi-link-color[data-name='" + searchIntellectualParam.subcategory + "']").addClass("wi-secondary-color");
    } else {
        $("#filterSubIntellectual li[data-paramname='subcategory'] .wi-link-color:first").addClass("wi-secondary-color");
    }
    if (searchIntellectualParam.subsubcategory) {
        $("#filterSubIntellectual li[data-paramname='subsubcategory'] .wi-link-color[data-name='" + searchIntellectualParam.subsubcategory + "']").addClass("wi-secondary-color");
    } else {
        $("#filterSubIntellectual li[data-paramname='subsubcategory'] .wi-link-color:first").addClass("wi-secondary-color");
    }
}

function createEachFilter(filter, filtername, paramaName) {
    //创建每个过滤
    var tmpArr = [];
    tmpArr.push('<li data-paramname=' + paramaName + '><span class="fitler-title"><span>' + filtername + '</span></span><div><a class="wi-link-color" data-name=""><span>' + intl('138927', '全部') + '</span></a>');
    if (filter) {
        for (var i = 0; i < filter.length; i++) {
            var filterkey = filter[i].key;
            tmpArr.push('<a class="wi-link-color" data-name="' + filter[i].key + '"><span>' + filterkey + '(' + filter[i].doc_count + ')' + '</span></a>')
        }
    }
    tmpArr.push('</div></li>')
    return tmpArr.join("")
}

function showSearchRisk(data, type) {
    //风险综合搜索
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = searchRiskParam.type;
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchRiskParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    $("#searchLoadRisk").hide();
    $("#searchMask").height($(window).height()).show();
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchRiskResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        var aggregation = res.Data.aggregations;
        var htmlArr = [];
        showRiskFilter(aggregation); //显示过滤条件
        for (var i = 0; i < item.length; i++) {
            htmlArr.push(showEachRiskItem(item[i]));
        }
        if (type == 1) {
            $("#div_DataListRisk").append(htmlArr.join(""));
            preventSumbitRisk = true;
        } else {
            preventSumbitRisk = true;
            $("#div_DataListRisk").html(htmlArr.join(""));
        }
        if ((parseInt(searchRiskParam.pageNo) + 1) * parseInt(searchRiskParam.pageSize) >= res.Page.Records) {
            $("#searchMoreRisk").hide();
        } else {
            $("#searchMoreRisk").show();
        }
    } else {
        if (searchRiskParam.type != 'risk_merge_search') {
            searchRiskParam.type = 'risk_merge_search';
            searchRiskParam.pageNo = 0;
            myWfcAjax("getrisksearch", searchRiskParam, function(data) {
                showSearchRisk(data);
            });
        }
        var aggregation = res.Data.aggregations;
        showRiskFilter(aggregation); //显示过滤条件
        $("#searchMask").hide();
        $("#searchLoadRisk").hide();
        $("#searchMoreRisk").hide();
        $("#moreLoadingRisk").hide();
        $("#div_DataListRisk").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchRiskResultNum").text(0);
    }
}

function showSearchIntellectual(data, type) {
    //知识综合搜索

    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = searchIntellectualParam.type;
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchIntellectualParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }

    $("#searchLoadIntellectual").hide();
    $("#searchMask").height($(window).height()).show();

    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchIntellectualResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        var aggregation = res.Data.aggregations;
        var htmlArr = [];
        showIntellectualFilter(aggregation); //显示过滤条件
        for (var i = 0; i < item.length; i++) {
            htmlArr.push(showEachIntellectualItem(item[i]));
        }

        if (type == 1) {
            $("#div_DataListIntellectual").append(htmlArr.join(""));
            preventSumbitIntellectual = true;
        } else {
            preventSumbitIntellectual = true;
            $("#div_DataListIntellectual").html(htmlArr.join(""));
        }
        if ((parseInt(searchIntellectualParam.pageNo) + 1) * parseInt(searchIntellectualParam.pageSize) >= res.Page.Records) {
            console.log((parseInt(searchIntellectualParam.pageNo) + 1) * parseInt(searchIntellectualParam.pageSize))
            $("#searchMoreIntellectual").hide();
        } else {
            $("#searchMoreIntellectual").show();
        }
    } else {
        if (searchIntellectualParam.type != 'intellectual_property_merge_search') {
            searchIntellectualParam.type = 'intellectual_property_merge_search';
            searchIntellectualParam.pageNo = 0;
            myWfcAjax("getintellectual", searchIntellectualParam, function(data) {
                showSearchIntellectual(data);
            });
        }
        var aggregation = res.Data.aggregations;
        showIntellectualFilter(aggregation); //显示过滤条件
        $("#searchMask").hide();
        $("#searchLoadIntellectual").hide();
        $("#searchMoreIntellectual").hide();
        $("#moreLoadingIntellectual").hide();
        $("#div_DataListIntellectual").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchIntellectualResultNum").text(0);
    }
}

function showTextfromCountry(country, item, companyname) {
    //根据不同的国家/地区，显示不同的字段
    var keyArr = [];
    var valArr = [];
    $(".sort-special").hide();
    switch (country) {
        case "usa":
            keyArr = [intl('206095' /* 归档编号 */ ), intl('138860' /* 成立日期 */ ), intl('138930' /* 地区 */ )];
            valArr = ["biz_reg_no", "establish_date<br>", "region"];
            break;
        case "eng":
            keyArr = [intl('138679' /* 公司编号 */ ), intl('138860' /* 成立日期 */ )];
            valArr = ["biz_reg_no", "establish_date"];
            break;
        case "jpn":
            keyArr = [intl('206096', '片假名'), intl('138476' /* 注册号 */ ), intl('138860' /* 成立日期 */ )];
            valArr = ["kata_name<br>", "biz_reg_no", "establish_date"];
            break;
        case "deu":
            $(".sort-special").show();
            keyArr = [intl('138476' /* 注册号 */ ), intl('138860' /* 成立日期 */ ), intl('35779' /* 注册资本 */ ), intl('2901' /* 城市 */ )];
            valArr = ["biz_reg_no", "establish_date<br>", "capital_amount", "region"];
            break;
        case "fra":
            keyArr = [intl('138679' /* 公司编号 */ ), intl('138478' /* 注册日期 */ )];
            valArr = ["biz_reg_no", "establish_date"];
            break;
        case "hkg":
            keyArr = [intl('138276' /* 英文名 */ ), intl('138679' /* 公司编号 */ ), intl('138860' /* 成立日期 */ )];
            valArr = ["eng_name<br>", "biz_reg_no", "establish_date"];
            break;
        case "twn":
            keyArr = [intl('138679' /* 公司编号 */ ), intl('35779' /* 注册资本 */ ), intl('5529' /* 法定代表人 */ ), intl('138860' /* 成立日期 */ )];
            valArr = ["biz_reg_no", "capital_amount<br>", "artificial_person_name", "establish_date"];
            break;
        case "sgp":
            keyArr = [intl('138476' /* 注册号 */ ), intl('138860' /* 成立日期 */ )];
            valArr = ["biz_reg_no", "establish_date"];
            break;
        case "ita":
            keyArr = [];
            valArr = [];
            break;
        case "can":
            keyArr = [intl('138679' /* 公司编号 */ ), intl('138860' /* 成立日期 */ )];
            valArr = ["biz_reg_no", "establish_date"];
            break;
        default:
            return ""
            break;
    }
    var arr = [];
    arr.push("<div class='each-searchlist-item'>")
    for (var i = 0; i < valArr.length; i++) {
        var isBr = false;
        if (valArr[i].indexOf("<br>") > 0) {
            valArr[i] = valArr[i].replace("<br>", "");
            var isBr = true;
        }
        switch (valArr[i]) {
            case "establish_date":
                arr.push("<span class='searchitem-work'>" + keyArr[i] + ":" + Common.formatTime(item[valArr[i]]) + "</span>");
                break;
            case "capital_amount":
                arr.push("<span class='searchitem-work'>" + keyArr[i] + ":" + Common.formatMoney(item[valArr[i]]) + "</span>");
                break;
            case "eng_name":
                if (item[valArr[i]]) {
                    arr.push("<span class='searchitem-work eng_name'>" + keyArr[i] + ":" + Common.formatCont(item[valArr[i]]) + "</span>");
                } else {
                    isBr = false
                }
                break;
            default:
                arr.push("<span class='searchitem-work'>" + keyArr[i] + ":" + Common.formatCont(item[valArr[i]]) + "</span>");
                break;
        }
        if (isBr) {
            arr.push("<br/>");
        }
    }
    arr.push("<br/><span class='searchitem-work'>" + intl('35776' /* 注册地址 */ ) + ":" + (item["register_address"] ? item["register_address"] : "--") + "</span><br/>")
    arr.push("</div>");
    return arr.join("");
}

function switchCountryEn2Cn(country) {
    switch (country) {
        case "cn":
            return "中国";
            break;
        case "usa":
            return "美国";
            break;
        case "eng":
            return "英国";
            break;
        case "jpn":
            return "日本";
            break;
        case "deu":
            return "德国";
            break;
        case "fra":
            return "法国";
            break;
            // case "hkg":
            //     return "中国香港";
            //     break;
            // case "twn":
            //     return "中国台湾";
            //     break;
        case "sgp":
            return "新加坡";
            break;
        case "ita":
            return "意大利";
            break;
        case "can":
            return "加拿大";
            break;
        default:
            return "--"
            break;
    }
}

function showSearchGolbal(data, type) {
    //全球企业搜索
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = 'golbalCom';
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchGlobalParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams), 'entityAttribute': searchGlobalParam.type };
        } else {
            otherParam = { 'screenItem': screenStr, 'entityAttribute': searchGlobalParam.type };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    $("#searchLoadGlobal").hide();
    $("#historyPersonList").hide();
    $("#searchMask").height($(window).height()).show();
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchGlobalResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];
        for (var i = 0; i < item.length; i++) {
            var imgSrc = "../resource/images/Company/default-company.png";
            var imgId = item[i].logo ? item[i].logo : '';
            if (imgId) {
                imgSrc = 'http://news.windin.com/ns/imagebase/6710/' + imgId;
            }
            var companyName = "";
            if (item[i].highlight && item[i].highlight.corp_name) {
                companyName = item[i].highlight.corp_name;
            } else {
                companyName = item[i].corp_name ? item[i].corp_name : "--";
            }
            var companyCode = item[i].corp_id ? item[i].corp_id : "";
            //bury
            var burynum = searchGlobalParam.pageNo * searchGlobalParam.pageSize + (i + 1);
            var buryinput = searchGlobalParam.companyname;
            var pingBuryParam = 'data-burynum="' + burynum + '" data-buryinput="' + buryinput + '" data-buryfunctype="searchListCk" data-burymodule="searchList" data-buryid="' + companyCode + '"';

            htmlArr.push('<div class="div_Card" data-detailid="' + companyCode + '">')
            htmlArr.push('<div class="searchpic-brand"><img class="big-logo"  width="90" src="' + imgSrc + '"></div>')
            htmlArr.push('<div class="searchcontent-brand searchcontent-golbal">')
            htmlArr.push('<h4 data-country="' + searchGlobalParam.country + '" class="searchtitle-brand" ccode="' + companyCode + '" ' + pingBuryParam + '>' + companyName + '</h4>')
            htmlArr.push('<i class="state-country">' + switchCountryEn2Cn(searchGlobalParam.country) + '企业</i>')
            if (item[i].govlevel) {
                htmlArr.push('<i class="state-yes">' + (item[i].govlevel ? item[i].govlevel : '--') + '</i>')
            }
            //根据不同的国家/地区，显示不同的字段
            var showTextStr = showTextfromCountry(searchGlobalParam.country, item[i], companyName);
            htmlArr.push(showTextStr);
            htmlArr.push('</div></div></div>')
        }

        if (type == 1) {
            $("#div_DataListGlobal").append(htmlArr.join(""));
            preventSumbitGlobal = true;
        } else {
            preventSumbitGlobal = true;
            $("#div_DataListGlobal").html(htmlArr.join(""));
        }
        if ((parseInt(searchGlobalParam.pageNo) + 1) * parseInt(searchGlobalParam.pageSize) >= res.Page.Records) {
            $("#searchMoreGlobal").hide();
        } else {
            $("#searchMoreGlobal").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMoreGlobal").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListGlobal").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchGlobalResultNum").text(0);
    }
}


function showSearchJobs(data, type) {
    //招聘查询
    var res = JSON.parse(data);
    //bury
    if (res && res.ErrorCode == 0 && res.Data) {
        var activeType = 'search';
        var opEntity = 'getrecruitmentsearch';
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchJobsParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }
        buryFCode.bury(activeType, opEntity, otherParam);
    }
    $("#searchLoadJobs").hide();
    $("#searchMask").height($(window).height()).show();
    if (res.ErrorCode == 0 && res.Data && res.Data.list && res.Data.list.length > 0) {
        $("#searchJobsResultNum").text(res.Page.Records);
        $("#searchMask").hide();
        var item = res.Data.list;
        var htmlArr = [];


        // 被执行人名称、被执行人的履行情况、案号、立案时间、省份、行为具体情况、执行法院

        for (var i = 0; i < item.length; i++) {

            htmlArr.push('<div class="div_Card buryClickCenter" data-detailid="' + item[i].detail_id + '" data-jobccode="' + item[i].company_code + '" >')
            htmlArr.push('<h5 class="searchtitle-brand wi-link-color">' + (item[i].position_name ? item[i].position_name : '--') + '</h5>')
            htmlArr.push('<span class="list-opeation-job color-red">' + item[i].salary_range + '</span>')
            htmlArr.push('<div class="each-searchlist-item">')
            htmlArr.push('<span class="searchitem-work">' + intl('138908' /*发布日期*/ ) + '：' + (item[i].release_date ? Common.formatTime(item[i].release_date) : '--') + '</span>')
            var pro_input = item[i].company_code ? ('<a class="wi-link-color wi-secondary-color search-jobs-link" href="" data-code="' + item[i].company_code + '">' + item[i].company_name + '</a>') : (item[i].company_name ? item[i].company_name : '--');
            htmlArr.push('<span class="searchitem-work">' + intl('205948' /*招聘企业*/ ) + '：' + pro_input + '</span>');
            htmlArr.push('<span class="searchitem-work">' + intl('214189' /*学历要求*/ ) + '：' + (item[i].education_requirement ? item[i].education_requirement : '--') + '</span>')
            htmlArr.push('<br>')
            htmlArr.push('<span class="searchitem-work">' + intl('138583' /*工作地点*/ ) + '：' + (item[i].city ? item[i].city : '--') + '</span>')
            htmlArr.push('<span class="searchitem-work">' + intl('214188' /*经验要求*/ ) + '：' + (item[i].work_experience ? item[i].work_experience : '--') + '</span>')
            htmlArr.push('</div></div>')
        }

        if (type == 1) {
            $("#div_DataListJobs").append(htmlArr.join(""));
            preventSumbitJobs = true;
        } else {
            preventSumbitJobs = true;
            $("#div_DataListJobs").html(htmlArr.join(""));
        }
        if ((parseInt(searchJobsParam.pageNo) + 1) * parseInt(searchJobsParam.pageSize) >= res.Page.Records) {
            $("#searchMoreJobs").hide();
        } else {
            $("#searchMoreJobs").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#div_DataListJobs").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#searchJobsResultNum").text(0);
    }
}

function init() {
    //初始化企业搜索
    var keyword = '';
    if ($("#inputToolbarSearch").val()) {
        keyword = $("#inputToolbarSearch").val()
    } else {
        keyword = decodeURI(Common.getUrlSearch("keyword"));
        $("#inputToolbarSearch").val(keyword);
    }
    $("#FilterArea").show();
    $(".frame-container").show();
    $("#btnFilter").show();
    searchParam.companyname = keyword;
    resetCondition(); //重置所有搜索条件
    ajaxSearch(); //请求搜索
    getHistoryKey();
}

function initBefore() {
    var type = decodeURI(Common.getUrlSearch("type"));
    resetCondition();
    if (type) {
        $(".search-r-model").hide();
        $(".search-r-model[data-type='" + type + "']").show();
        if (type == "country") {
            //全球企业查询
            $(".search-r-model[data-type='company']").show();
            $(".search-for-company").hide();
            var country = decodeURI(Common.getUrlSearch("country"));
            searchGlobalParam.country = country;
            searchGlobalParam.type = country;
            $("#searchRaegionGlobal").find("a[data-name='" + country + "']").addClass("wi-secondary-color");
            showHisGolbal();
            searchForGlobal();
        } else {
            $("#changeTitleSearch li[data-type='" + type + "']").trigger("click");
        }
    } else {
        $(".search-r-model[data-type=company]").show();
        init();
    }
}

function showHisGolbal() {
    //全球企业查询右侧

    myWfcAjax("gethistorykey", { type: "ent", isKeyword: 0 }, function(data) {
        var res = JSON.parse(data);
        var storageHtml = [];
        var focusHtml = [];
        var listClass = '';
        if (res.ErrorCode == 0 && res.Data) {
            var len = res.Data.length;
            if (len == 0) {
                focusHtml.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyFocusList").find("#FocusHistroy").html(focusHtml);
                $("#ModelHistory").hide();
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    listClass = (i + 1) % 2 ? 'history_list' + ' listColor' : 'history_list';
                    var historyData = res.Data[i];
                    var country = historyData.detail ? historyData.detail['region'] : "";
                    focusHtml.push("<li  data-country=" + country + "  class='" + listClass + "'><a data-country=" + country + " class='wi-link-color' href='#' title='" + historyData['keyword'] + "' ccode='" + historyData['objectid'] + "'><span class='his-country'>" + switchCountryEn2Cn(country) + "&nbsp;|&nbsp;</span>" + historyData['keyword'] + "</a><span class='del-history' data-code='" + historyData['objectid'] + "'></span></li>");
                }
                $("#historyFocusList").find("#FocusHistroy").html(focusHtml.join(""));
            }

        } else {
            $("#historyFocusList").find("#FocusHistroy").empty().html('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
        }
    });
    myWfcAjax("gethistorykey", { type: 'ent', iskeyword: 1, pcstatus: "0" }, function(data) {
        var res = JSON.parse(data);
        historySearchList = res.Data;
    });
    myWfcAjax("getglobalmostviewedcompany", { type: "ent" }, function(data) {
        var res = JSON.parse(data);
        var storageHtml = [];
        var focusHtml = [];
        var listClass = '';
        if (res.ErrorCode == 0) {
            var listData = res.Data;
            var len = listData.length
            if (len == 0) {
                focusHtml.push("<div class='no-histry'>暂无热门浏览记录</div>");
                $("#historyFocusList").find("#FocusHot").html(focusHtml);
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = listData[i]['keyword'];
                    var historyCode = listData[i]['objectid'];
                    var country = listData[i].detail ? listData[i].detail['region'] : "";
                    focusHtml.push("<li data-country=" + country + "  class='history_list'><a data-country=" + country + "  class='wi-link-color ' href='#' title='" + historyData + "' ccode='" + historyCode + "' ><span class='his-country'>" + switchCountryEn2Cn(country) + "&nbsp;|&nbsp;</span>" + historyData + "</a></li>");
                }
                $("#historyFocusList").find("#FocusHot").html(focusHtml.join(""));
            }

        }
    });
}
$(document).on("click", "#FocusHistroyPerson li,.each-person-item,#FocusHotPerson li", function() {
    //最近浏览人物
    var $this = $(this);
    if ($this.attr("data-id")) {
        //bury
        var pingBuryParam = buryFCode.paramBuryJson('search', $this);
        var url = "Person.html?id=" + $this.attr("data-id") + "&name=" + $this.attr("data-keyword") + pingBuryParam;
        window.open(url)
    }
})
$(document).on("click", ".num-control", function(e) {
    //最近浏览人物
    var $this = $(this);
    if ($this.attr("data-id")) {
        var url = "Person.html?id=" + $this.attr("data-id") + "&name=" + $this.attr("data-keyword") + "&personSearch=" + $this.attr("data-type");
        window.open(url)
        e.stopPropagation();
    }
})

function searchHomeListInfo() {
    // $(function() {
    $(document).on("click", "#btnToolbarSearch,#btnToolbarSearchGlobal", function(event) {
        //搜索按钮
        var $closestInput = $(this).prev(".input-toolbar-search");
        var keyword = $.trim($closestInput.val());
        if (keyword.length && !$closestInput.hasClass('placeholder')) {
            //深度搜索
            var companyname = encodeURI(keyword);
            if (this.id == "btnToolbarSearch") {
                var typeStr = "";
                var type = $("#changeTitleSearch>li.sel").attr("data-type");
                if (type) {
                    typeStr = "&type=" + type;
                }
                var pingParam = buryFCode.paramBuryJson('add', { 'funcType': 'searchCk', 'fromModule': 'toolbar' });
                var url = "SearchHomeList.html?linksource=CEL&keyword=" + keyword + typeStr + pingParam;
                $("#inputToolbarSearch").val(keyword);
                $('.input-toolbar-search-list').removeClass('active');
                $('.input-toolbar-before-search').removeClass('active');
                location.href = url;
            } else {
                var selCountry = $("#searchRaegionGlobal").find(".wi-secondary-color").attr("data-name");
                var url = "SearchHomeList.html?linksource=CEL&type=country&keyword=" + keyword + "&country=" + selCountry;
                location.href = url;
            }
        } else {
            $closestInput.focus();
        }
    });
    $(document).on("keydown", "#inputToolbarGlobalSearch", function(event) {
        //$(this).placeholder();
        //全球搜索框placehoder及回车后执行搜索事件
        switch (event.keyCode) {
            case 13:
                if ($(this).val().length) {
                    if ($(this).val !== decodeURI(Common.getUrlSearch("keyword"))) {
                        $('#btnToolbarSearchGlobal').trigger('click');
                    }
                }
                return false;
                break;
        }
    })

    $('#inputToolbarSearch').placeholder().keydown(function(event) {
        //搜索框placehoder及回车后执行搜索事件
        switch (event.keyCode) {
            case 13:
                if ($(this).val().length) {
                    if ($(this).val !== decodeURI(Common.getUrlSearch("keyword"))) {
                        $('#btnToolbarSearch').trigger('click');
                    }
                }
                return false;
                break;
        }
    });

    $(document).on("click", ".btn-filter", function() {
        //收起展开过滤
        $(this).toggleClass("sel");

        $(this).parent(".btn-filter-area").prev().toggle();
        var $text = $(this).find("span")
        if ($text.text() == intl('138877' /* 收起 */ )) {
            $text.text(intl('138786' /* 展开 */ ))
        } else {
            $text.text(intl('138877' /* 收起 */ ))
        }
    });
    $(document).on("click", ".secondIndustry", function() {
        //点击二级行业显示三级行业
        $this = $(this);
        var text = $(this).attr("data-name");
        $("#searchIndustry").next().removeClass("sel");
        $("#condition05").show().attr("data-type", $this.attr("data-code")).attr("data-name", $this.attr("data-name")).find("span").text($this.find("span").text());
        $("#clearAllCondtion").show();
        searchParam.industry = $(this).attr("data-code");
        // showhideFilter();
        ajaxSearch();
    })
    $(document).on("click", ".secondRegion", function() {
        //点击省
        $this = $(this);
        $this.parents("li").hide();
        var name = $(this).attr("data-name");
        var code = $(this).attr("data-code");
        //var data=resetDataRegion[code];
        $("#searchRaegion").next().removeClass("sel");
        var htmlArr = [];
        $("#condition04").show().attr("data-code", $this.attr("data-code")).attr("data-name", $this.attr("data-name")).find("span").text($this.attr("data-name"));
        $('.condition-list').show();
        $("#clearAllCondtion").show();
        searchParam.city = $(this).attr("data-name");
        // showhideFilter();
        ajaxSearch();
        //$("#searchRaegion a:gt(5)").hide();
    })

    // 机构类型
    $(document).on("click", "#corpTypeCondition a", function() {
        $('.jump-more-serach').css('display', 'block');
        $this = $(this);
        var companyType = $(this).attr('data-condition');
        switch (companyType) {
            case 'hk':
                $('#celCompanyStatus').hide();
                $('#hkCompnayStatus').show();
                break;
            case 'twn':
                $('#celCompanyStatus').hide();
                $('#twnCompnayStatus').show();
                break;
            case 'sh':
                $('#celCompanyStatus').hide();
                $('#shCompnayStatus').show();
                break;
            case 'sy':
                $('#celCompanyStatus').hide();
                $('#causeCompnayStatus').show();
                break;
            case 'lo':
                $('#celCompanyStatus').hide();
                $('#lawCompnayStatus').show();
                break;
            default:
                $('#celCompanyStatus').show();
                break;
        }
        $this.parents("li").hide();
        $("#condition07").show().attr("data-orgType", $this.attr("data-orgType")).attr("data-name", $this.text()).find("span").text($this.find("span").text());
        searchParam.orgType = $(this).attr("data-orgType");
        $('.condition-list').show();
        $("#clearAllCondtion").show();
        // showhideFilter();
        ajaxSearch();
        return false;
    })

    // 地区
    $(document).on("click", "#corpNewZoneCondition a", function() {
        $this = $(this);
        $this.parents("li").hide();
        $("#condition08").show().attr("data-type", $this.attr("data-type")).attr("data-name", $this.attr("data-name")).find("span").text($this.find("span").text());
        searchParam.city = $(this).attr("data-name");
        $('.condition-list').show();
        $("#clearAllCondtion").show();
        // showhideFilter();
        ajaxSearch();
        return false;
    })

    $(document).on('click', '.sort-dialog-corp-header li', function() {
        $this = $(this);
        $this.parents("a").hide();
        var conditionId = $this.parents('a').attr('data-condition-id');
        var conditionKey = $this.parents('a').attr('data-condition-key');
        var typeTxt = $this.parents("a").find('span').text();
        $('#' + conditionId).show().attr("data-type", $this.attr("data-type")).attr("data-name", $this.text()).find("span").text($this.text());
        searchParam[conditionKey] = $(this).attr("data-type");
        $('.condition-list').show();
        $("#clearAllCondtion").show();
        // showhideFilter();
        ajaxSearch();

        var root = $this.parents("a").parents('li');
        if (!$(root).find('a:visible').length) {
            $(root).hide();
        }
        return false;
    })



    $(document).on("click", "#filter-brand-state a,#filter-brand-type a", function() {
        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        var parentId = $(this).parents('div').attr('id');
        var val = $(this).attr("data-name");
        if (parentId === 'filter-brand-state') {
            searchBrandParam.status = val;
        } else {
            searchBrandParam.category = val;
        }
        searchForBrand();
        return false;
    })
    $(document).on("click", "#filter-patent-state a,#filter-patent-type a", function() {
        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        var parentId = $(this).parents('div').attr('id');
        var val = $(this).attr("data-name");
        if (parentId === 'filter-patent-state') {
            searchPatentParam.status = val;
        } else {
            searchPatentParam.category = val;
        }
        searchForPatent();
        return false;
    })
    $(document).on("click", "#filter-judgment-state a,#filter-judgment-type a", function() {
        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        var judgmentId = $(this).parents('div').attr('id');
        var val = $(this).attr("data-name");
        if (judgmentId === 'filter-judgment-state') {
            searchJudgmentParam.area = val;
        } else {
            searchJudgmentParam.caseType = val;
        }
        searchForJudgment();
        return false;
    })
    $(document).on("click", "#filter-dishonest-state a,#filter-dishonest-type a", function() {
        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        var dishonestId = $(this).parents('div').attr('id');
        var val = $(this).attr("data-name");
        searchDishonestParam.area = val;
        searchForDishonest();
        return false;
    })

    $(document).on("click", "#searchRaegionMan a", function() {
        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        var val = $(this).attr("data-name");
        searchPersonParam.pageNo = 0;
        searchPersonParam.province = val;
        searchForPerson();
        return false;
    })
    $(document).on("click", "#searchRaegionGlobal a", function() {

        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        $(".input-toolbar-before-search").removeClass("active")
        var val = $(this).attr("data-name");
        searchGlobalParam.country = val;
        searchGlobalParam.pageNo = 0;
        searchGlobalParam.type = val;
        searchForGlobal();
        return false;
    })
    $(document).on("click", "#searchIndustryMan a", function() {
        $(this).addClass("sel wi-secondary-color").siblings().removeClass("sel wi-secondary-color");
        var val = $(this).attr("data-name");
        searchPersonParam.pageNo = 0;
        searchPersonParam.industry = val;
        searchForPerson();
        return false;
    })

    $(document).on("click", "#filterListNews a", function() {
        /*新闻筛选*/
        var val = $(this).attr("data-code") ? $(this).attr("data-code") : "";
        var key = $(this).parents("li").attr("data-paramname");
        searchNewsParam[key] = val;
        searchNewsParam.pageNo = 0;
        searchForNews();
        return false;
    })

    $(document).on("click", "#featureCondition a:not('.no-jump')", function() {
        $this = $(this);
        $this.parents("li").hide();
        $("#condition02").show().attr("data-type", $this.attr("data-type")).attr("data-name", $this.text()).find("span").text($this.find("span").text());
        searchParam.feature = $(this).attr("data-type");
        $("#clearAllCondtion").show();
        // showhideFilter();
        ajaxSearch();
        return false;
    })

    $(document).on("click", ".no-jump", function() {
        return false;
    })

    $(document).on("click", "#selectedCondition li", function() {
        var type = $(this).attr("data-condition");
        var id = $(this).attr("id");
        $(this).hide();
        searchParam[type] = ""; // 将筛选参数重置

        if (type === 'orgType') {
            $("#filterList li").eq(0).show();
        } else if (type === 'city') {
            $("#filterList li").eq(1).show();
        } else {
            var target = $('[data-condition-id=' + id + ']');
            // 如果是企业描述或者高级筛选
            if (target.length) {
                $(target).show();
                $(target).parents('li').show();
            }
        }

        if ($("#selectedCondition li:visible").length > 0) {
            $("#clearAllCondtion").show();
            $('.condition-list').show();
        } else {
            $("#clearAllCondtion").hide();
            $('.condition-list').hide();
        }

        if ($("#condition07").css('display') == 'none') { //恢复企业状态选择
            $('.jump-more-serach').css('display', 'none');
            $('#hkCompnayStatus').hide();
            $('#twnCompnayStatus').hide();
            $('#shCompnayStatus').hide();
            $('#causeCompnayStatus').hide();
            $('#celCompanyStatus').show();
        }

        ajaxSearch();
        return;

        // showhideFilter();
        var oIndex = $("#selectedCondition li").index(this);
        if (oIndex == 2 || oIndex == 3) {
            if (oIndex == 3) {
                searchParam[type] = $("#selectedCondition li").eq(2).attr("data-type");
            } else {
                $("#selectedCondition li").eq(3).hide();
                searchParam[type] = "";
            }
            // $("#searchIndustry a:gt(4)").hide();
            // $(".more-filter").removeClass("sel");
            oIndex = 2;
        } else if (oIndex == 4 || oIndex == 5) {
            // $("#searchRaegion a:gt(5)").hide();
            // $(".more-filter").removeClass("sel");
            oIndex = 2;
            searchParam[type] = "";
        } else {
            searchParam[type] = "";
        }
        if ($("#selectedCondition li:visible").length > 0) {
            $("#clearAllCondtion").show();
            $('.condition-list').show();
        } else {
            $("#clearAllCondtion").hide();
            $('.condition-list').hide();
        }
        ajaxSearch();
        $("#filterList li").eq(oIndex).show();
    })
    $(document).on("click", "#clearAllCondtion", function() {
        $(this).hide();
        resetFilter();
        ajaxSearch()
        return false;
    })

    $(document).on("click", '.btn-sort', function() {
        $(this).toggleClass("sel");
    })

    $(".btn-sort").on("click", 'li', function(event) {
        var target = event.target;
        var oldSelectedEle = $(target.parentElement).find('.active');
        var btnEle = $(this).parents('.btn-sort');
        if (target === oldSelectedEle[0]) {
            return;
        }
        if (oldSelectedEle && oldSelectedEle.length) {
            oldSelectedEle.removeClass('active')
        }
        $(target).addClass('active');
        //排序
        $(btnEle).removeClass('sel');
        $(btnEle).find('span').text($(this).text());
        event.stopPropagation();
        var btnId = $(btnEle).attr('id');
        switch (btnId) {
            case 'btnSort':
                searchParam.sort = $(this).attr("data-type");
                ajaxSearch();
                break;
            case 'btnSort-Brand':
                searchBrandParam.sort = $(this).attr("data-type");
                searchForBrand();
                break;
            case 'btnSort-Risk':
                searchRiskParam.sort = $(this).attr("data-type");
                searchForRiskByCondition();
                break;
            case 'btnSort-Intellectual':
                searchIntellectualParam.sort = $(this).attr("data-type");
                searchForIntellectual();
                break;
            case 'btnSort-Patent':
                searchPatentParam.sort = $(this).attr("data-type");
                searchForPatent();
                break;
            case 'btnSort-Soft':
                searchSoftParam.sort = $(this).attr("data-type");
                searchForSoft();
                break;
            case 'btnSort-Work':
                searchWorkParam.sort = $(this).attr("data-type");
                searchForWork();
                break;
            case 'btnSort-Judgment':
                searchJudgmentParam.sort = $(this).attr("data-type");
                searchForJudgment();
                break;
            case 'btnSort-Dishonest':
                searchDishonestParam.sort = $(this).attr("data-type");
                searchForDishonest();
                break;
            case 'btnSort-Executee':
                searchExecuteeParam.sort = $(this).attr("data-type");
                searchForExecutee();
                break;
            case 'btnSort-Global':
                searchGlobalParam.sort = $(this).attr("data-type");
                searchForGlobal();
                break;
            case 'btnSort-Court':
                searchCourtParam.sort = $(this).attr("data-type");
                searchForCourt();
                break;
            case 'btnSort-OpenNotice':
                searchOpenNoticeParam.sort = $(this).attr("data-type");
                searchForOpenNotice();
                break;
            case 'btnSort-Judicial':
                searchJudicialParam.sort = $(this).attr("data-type");
                searchForJudicial();
                break;
            case 'btnSort-Jobs':
                searchJobsParam.sort = $(this).attr("data-type");
                searchForJobs();
                break;
            case 'btnSort-Make':
                searchMakeParam.sort = $(this).attr("data-type");
                searchForMake();
                break;
            case 'btnSort-News':
                searchNewsParam.sort = $(this).attr("data-type");
                searchForNews();
                break;

        }
    })

    $(document).ready(function() { //滑到底部时自动加载更多
          
        $(window).scroll(function() {
            if ($(document).scrollTop() >= $(document).height() - $(window).height() - 30) {
                if (!$("#searchMore").is(':hidden')) {
                    $("#moreLoading").show();
                    if (preventSumbit) {
                        preventSumbit = false;
                        searchParam.pageNo++;
                        if (searchParam.pageNo >= maxPage) {
                            $("#pageTip").show();
                            $("#searchMore").hide();
                        } else {
                            $("#pageTip").hide();
                            $(this).next().show();
                            ///翻页埋功能点
                            myWfcAjax("burypcfunctioncode", { functionCode: "922602100271" });
                            myWfcAjax("getclassifycompany", searchParam, function(data) {
                                searchCallBack(data, 1);
                            });
                        }
                    }
                } 
                if (!$("#searchMoreMan").is(':hidden')) {
                    $("#moreLoadingMan").show();
                    if (preventSumbitMan) {
                        preventSumbitMan = false;
                        searchPersonParam.pageNo++;
                        console.log(searchPersonParam.pageNo)
                        console.log(searchPersonParam.pageNo >= maxPage)
                        if (searchPersonParam.pageNo >= maxPage) {
                            $("#pageTip").show();
                            $("#searchMoreMan").hide();
                        } else {
                            $(this).next().show();
                            // 翻页埋功能点
                            myWfcAjax("burypcfunctioncode", { functionCode: "922602100336" });

                            myWfcAjax("getclassifyperson", searchPersonParam, function(data) {
                                showSearchPerson(data, 1);
                            });
                        }
                    }
                }   
            }  
        });
        // 其他页面进搜索结果页
        var word = getUrlSearch('keyword');
        word = word ? decodeURI(word) : '';
        if (word) {
            $('#txt_search').val(word);
            $('#btn_search').trigger('click');
        }
    });
    $(document).on("click", ".div_Card h4,a.each-relation-corp", function() {
        var CompanyCode = $(this).attr('ccode');
        var country = $(this).attr("data-country");
        //企业跳转时的参数传递
        var buryParam = buryFCode.paramBuryJson('searchCk', $(this)); //bury-ping

        if (country && country != "cn" && country != "hkg" && country != "twn" && country != "sh" && country != "sy" && country != "zf" && country != "lo") {
            Common.JumpfromCountry("Bu3", CompanyCode, country, buryParam)
        } else {
            if (country == "hkg" || country == "twn") {
                Common.f9JumpfromTw("Bu3", CompanyCode, country, buryParam)
            } else {
                Common.linkCompany("Bu3", CompanyCode, null, null, buryParam);
            }
        }

        return false;
    })

    $(document).on("click", ".history_list a", function() {
        var CompanyCode = $(this).attr('ccode');
        var country = $(this).attr("data-country");
        var buryParam = buryFCode.paramBuryJson('hisView', $(this));
        if (country && country != "cn" && country != "hkg" && country != "twn") {
            Common.JumpfromCountry("Bu3", CompanyCode, country, buryParam)
        } else {
            if (country == "hkg" && country == "twn") {
                Common.f9JumpfromTw("Bu3", CompanyCode, country, buryParam);
            } else {
                Common.linkCompany("Bu3", CompanyCode, null, null, buryParam);
            }
        }
        return false;
    })
}

function resetPersonCondition() {
    // searchPersonParam = {
    //     province: "",
    //     industry: "",
    //     pageNo: 0,
    //     pageSize: 30,
    //     personname: "",
    // }
    getHistoryPerson();

}

function resetCondition() {
    //重置所有条件
    resetFilter();
    $("#btnSort").removeClass("sel").find("span").text(intl('138255' /* 默认排序 */ ));
}

function resetFilter() {
    $("#selectedCondition").html('<li id="condition01" data-condition="regcapital"><span></span><i>X</i></li><li id="condition02" data-condition="feature"><span></span><i>X</i></li><li id="condition05" data-condition="industry"><span></span><i>X</i></li><li id="condition03" data-condition="industry"><span></span><i>X</i></li><li id="condition06" data-condition="city"><span></span><i>X</i></li><li id="condition04" data-condition="city"><span></span><i>X</i></li><li id="condition07" data-condition="orgType"><span></span><i>X</i></li>');
    $("#selectedCondition").append('<li id="condition08" data-condition="city"><span></span><i>X</i></li><li id="condition11" data-condition="industryGb1"><span></span><i>X</i></li><li id="condition12" data-condition="regRange"><span></span><i>X</i></li>');
    $("#selectedCondition").append('<li id="condition13" data-condition="establishedTime"><span></span><i>X</i></li><li id="condition14" data-condition="status"><span></span><i>X</i></li><li id="condition15" data-condition="hasIpo"><span></span><i>X</i></li><li id="condition21" data-condition="hasTel"><span></span><i>X</i></li>');

    $("#selectedCondition").append('<li id="condition22" data-condition=""><span></span><i>X</i></li><li id="condition23" data-condition="hasMail"><span></span><i>X</i></li><li id="condition24" data-condition="hasOnList"><span></span><i>X</i></li><li id="condition25" data-condition="hasDebt"><span></span><i>X</i></li>');
    $("#selectedCondition").append('<li id="condition26" data-condition="hasFinancing"><span></span><i>X</i></li><li id="condition27" data-condition=""><span></span><i>X</i></li><li id="condition28" data-condition="hasDomain"><span></span><i>X</i></li><li id="condition29" data-condition="hasBrand"><span></span><i>X</i></li>');
    $("#selectedCondition").append('<li id="condition30" data-condition="hasPatent"><span></span><i>X</i></li><li id="condition31" data-condition=""><span></span><i>X</i></li><li id="condition32" data-condition="hasCopyright"><span></span><i>X</i></li><li id="condition33" data-condition="hasPledge"><span></span><i>X</i></li>');

    $("#selectedCondition li").hide();
    $('.condition-list').hide();
    $("#btnFilter").removeClass("sel").find("span").text(intl('138877' /* 收起 */ ));
    $("#filterList,#searchFilter").show();
    $("#btnSort").removeClass("sel").find("span").text(intl('138255' /* 默认排序 */ ));
    $("#filterList li").show();
    $('#filterList .sort-dialog-corp-header').show();
    searchParam = {
        pageNo: 0,
        pageSize: 30,
        feature: "",
        city: "",
        industry: "",
        sort: -1,
        companyname: "",
        regcapital: "",
        source: 'cel',
        datafrom: '', // TODO 机构类型
        industryGb1: '', // 一级行业名称
        establishedTime: '', // 成立时间
        regRange: '', // 注册资本
        status: '', // 企业状态
        hasBrand: '', // 1表示有 0表示无
        hasCopyright: '',
        hasDebt: '',
        hasDomain: '',
        hasFinancing: '',
        hasIpo: '',
        hasMail: '',
        hasOnList: '',
        hasPatent: '',
        hasTel: '',
        companyname: $('#inputToolbarSearch').val(),
    }
}

function ajaxSearch() {
    searchParam.pageNo = 0;
    $("#pageTip").hide();
    $("#searchMore").hide();
    $("#div_DataList").empty();
    $("#searchLoad").show();
    $("#searchMask").height($(window).height()).show();
    $("#seachKeyword").text(searchParam.companyname);

    //搜索功能埋点bury
    //url参数解析,额外参数传递,动作类型传递
    //  var activeType = 'search';
    //  var opEntity = "getclassifycompany";
    //  var screenStr = buryFCode.paramBuryJson('itemFilter', searchParam);
    //  var testDic = {key1:'val',key2:234,key3:'kkkk'}
    //  var otherParam = { 'screenItem': screenStr, 'queryStringParams':JSON.stringify(testDic)};
    //  buryFCode.bury(activeType, opEntity, otherParam);

    myWfcAjax("getclassifycompany", searchParam, searchCallBack);
}

function getHistoryKey() {
    var selList = [1];


    myWfcAjax("getmostviewedcompany", { pcstatus: "0" }, function(data) {
        var res = JSON.parse(data);
        var storageHtml = [];
        var focusHtml = [];
        var listClass = '';
        if (res.ErrorCode == 0) {
            var listData = res.Data;
            var len = listData.length
            if (len == 0) {
                focusHtml.push("<div class='no-histry'>暂无热门浏览记录</div>");
                $("#historyFocusList").find("#FocusHot").html(focusHtml);
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = listData[i]['companyName'];
                    var historyCode = listData[i]['companyCode'];
                    //bury
                    var buryParam = "data-buryfuncType='detailView' " + "data-buryModule='hotViewCom'";
                    focusHtml.push("<li class='history_list'><a class='wi-link-color ' href='#' title='" + historyData + "' ccode='" + historyCode + "' " + buryParam + ">" + historyData + "</a></li>");
                }
                $("#historyFocusList").find("#FocusHot").html(focusHtml.join(""));
            }

        }
    });
}
$(document).on("click", ".del-history", function(event) {
    var $this = $(this);
    var oCode = $this.attr("data-code");
    var delType = $this.parents().find('ul').attr('id');
    var delParam = { "isKeyword": "0", "type": "ent", "companycode": oCode };
    switch (delType) {
        case 'FocusHistroyJobs':
            delParam = { "type": "recruit_search", "detailId": oCode };
            break;
        default:
            break;
    }

    myWfcAjax("clearhistorykey", delParam, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == "0") {
            var delSpan = $this.parents().find('ul').attr('id');
            $this.parent("li").remove();
            if ($("#" + delSpan + " li").length <= 0) {
                $("#" + delSpan).parent().hide();
            }
        }
    })
    event.stopPropagation();
})

function getHistoryPerson() {
    requestPersonList();
    requestHotPerson();
}

function showhideFilter() {
    if ($("#selectedCondition li:visible").length >= 5) {
        $("#searchFilter").hide();
    } else {
        $("#searchFilter").show();
    }
}

function requestHotPerson() {
    myWfcAjax("getmostviewedperson", {}, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data && res.Data.length > 0) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">暂无热门浏览记录</div>');
                $("#historyPersonList").find("#FocusHotPerson").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var personIdStr = res.Data[i].personId
                    var imgBgIdStr = personIdStr.substring(personIdStr.length - 1, personIdStr.length)
                    var imgBgId = (imgBgIdStr.charCodeAt(0)) % 9
                    var imgBgArr = ['img-history-bg-1st', 'img-history-bg-2nd', 'img-history-bg-3rd', 'img-history-bg-4th', 'img-history-bg-5th', 'img-history-bg-6th', 'img-history-bg-7th', 'img-history-bg-8th', 'img-history-bg-9th']
                    var imgStr = "";
                    if (historyData && historyData.imageIdNew) { // 人物新接口
                        imgStr = '<img class="big-logo"  src="' + historyData.imageIdNew + '" width=49 height=49/>';
                    } else if (historyData.imageId) {
                        imgStr = '<img class="big-logo"  src="http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + historyData.imageId + '" width=49 height=49/>';
                    } else {
                        imgStr = historyData.personName.substring(0, 1);
                    }
                    //bury
                    var buryParam = ' data-buryfuncType="detailView" data-buryModule="hotViewPon"';
                    tmpArr.push('<li data-keyword="' + historyData.personName + '" data-id="' + historyData.personId + '" ' + buryParam + '><span class="img-history ' + imgBgArr[imgBgId] + '">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.personName + '</span><br>' + intl('138716' /* 关联 */ ) + '<span class="wi-secondary-color">' + (historyData.record ? historyData.record : 0) + '</span>' + intl('138901' /* 家 */ ) + intl('138902' /* 公司 */ ) + '</div></li>');
                }
                $("#historyPersonList").find("#FocusHotPerson").html(tmpArr.join(""));
            }
        }
    }, function() {});
}

function requestPersonList() {
    //最近浏览人物
    myWfcAjax("getpersonhistoryinfo", {}, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0) {
            var tmpArr = [];
            var len = res.Data.length > 10 ? 10 : res.Data.length;
            if (len == 0) {
                tmpArr.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                $("#historyPersonList").find("#FocusHistroyPerson").html(tmpArr.join(""));
            } else {
                for (var i = 0; i < len && i < 10; i++) {
                    var historyData = res.Data[i];
                    var personIdStr = res.Data[i].personid
                    var imgBgIdStr = personIdStr.substring(personIdStr.length - 1, personIdStr.length)
                    var imgBgId = (imgBgIdStr.charCodeAt(0)) % 9
                    var imgBgArr = ['img-history-bg-1st', 'img-history-bg-2nd', 'img-history-bg-3rd', 'img-history-bg-4th', 'img-history-bg-5th', 'img-history-bg-6th', 'img-history-bg-7th', 'img-history-bg-8th', 'img-history-bg-9th']
                    var imgStr = "";
                    if (historyData && historyData.imageIdNew) { // 人物新接口
                        imgStr = '<img class="big-logo"  src="' + historyData.imageIdNew + '" width=49 height=49/>';
                    } else if (historyData.imageId) {
                        imgStr = '<img class="big-logo"  src="http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + historyData.imageId + '" width=49 height=49/>';
                    } else {
                        imgStr = historyData.keyword.substring(0, 1);
                    }
                    //bury
                    var buryParam = ' data-buryfuncType="detailView" data-buryModule="hisViewPon"';
                    tmpArr.push('<li data-keyword="' + historyData.keyword + '" data-id="' + historyData.personid + '" ' + buryParam + '><span class="img-history ' + imgBgArr[imgBgId] + '">' + imgStr + '</span><div class="content-history-person"><span class="content-history-name">' + historyData.keyword + '</span><br>' + intl('138716' /* 关联 */ ) + '<span class="wi-secondary-color">' + (historyData.record ? historyData.record : 0) + '</span>' + intl('138901' /* 家 */ ) + intl('138902' /* 公司 */ ) + '</div></li>');
                }
                $("#historyPersonList").find("#FocusHistroyPerson").html(tmpArr.join(""));
            }
        }
    }, function() {});
}

function showTag(tagArr) {
    //显示公司的标签
    var tmpHtml = [];
    if (tagArr && tagArr.length > 0) {
        for (var i = 0; i < tagArr.length; i++) {
            var tmpArr = tagArr[i].split("_");
            var type = tmpArr[0];
            var content = tmpArr[1];
            switch (type) {
                case '股票':
                    {
                        if (content && content.split("|")[1]) {
                            var str = "";
                            if (is_terminal) {
                                str = '!Page[Minute,' + content.split("|")[1] + ']';
                            }
                            // tmpHtml.push('<a class="item-tag-list item-tag-stock" href="' + str + '">' + content + '</a>')
                            tmpHtml.push('<a class="item-tag-list item-tag-stock" >' + content + '</a>')
                        }
                    }
                    break;
                case '集团系':
                    {
                        var groupTmpArr = content.split("|");
                        if (content && groupTmpArr[0]) {
                            var str = "Group.html?groupId=" + groupTmpArr[1];
                            // tmpHtml.push('<a class="item-tag-list item-tag-group" target="_blank" href="' + str + '">' + groupTmpArr[0] + '</a>')
                            tmpHtml.push('<a class="item-tag-list item-tag-group" target="_blank" >' + groupTmpArr[0] + '</a>')
                        }
                    }
                    break;
                default:
                    if (type && content) {
                        // tmpHtml.push('<a class="item-tag-list item-tag-feture" data-val="' + content + '" data-type="' + type + '">' + content + '</a>')
                        tmpHtml.push('<a class="item-tag-list item-tag-feture" data-val="' + content + '" data-type="' + type + '">' + content + '</a>')
                    }
                    break;
            }
        }
        return tmpHtml.join("")
    } else {
        return "";
    }
}

function showSearchBlock(valueDic, dataFrom, region, corpType, buryRankNum) {
    //这个函数用来根据机构类型,返回html结构用来展示不同的信息块
    var ZFlist = ['党', '军', '政府机构', '人大', '政协', '法院', '检察院', '共青团', '主席', '民主党派', '人民团体'];
    var companyType = '';
    var companyLabel = '';
    var labelState = '';
    var divChannel = '<div class="each-searchlist-item">' + intl('5529' /* 法定代表人 */ ) + '：' + valueDic.artificial_str + '<span class="item-industry">' + intl('31801' /* 行业 */ ) + '：' + valueDic.industry_name + '</span><span class="item-capital">' + intl('35779' /* 注册资本 */ ) + '：' + valueDic.register_capital + '</span><span class="item-date">' + intl('138860' /* 成立日期 */ ) + '：' + valueDic.establish_date + '</span><br/><span class="item-address">' + intl('19414' /* 地址 */ ) + '：' + valueDic.register_address + '</span>';
    if (region instanceof Array) region = region[0];
    if (dataFrom === '香港注册企业') {
        companyType = 'hkg';
        companyLabel = '' + intl("145882" /*香港企业*/ );
        divChannel = '<div class="each-searchlist-item"><span class="item-capital">' + intl('138679' /* 公司编号 */ ) + '：' + valueDic.biz_reg_no + '</span><span class="item-date">' + intl('138860' /* 成立日期 */ ) + '：' + valueDic.establish_date + '</span><br/><span class="item-address">' + intl('19414' /* 地址 */ ) + '：' + valueDic.register_address + '</span>';
        labelState = 'company-state-hk';
    } else if (region && region.indexOf('台湾地区') != -1) {
        companyType = 'twn';
        companyLabel = '' + intl("224478", '中国台湾企业');
        divChannel = '<div class="each-searchlist-item">' + intl('5529' /* 法定代表人 */ ) + '：' + valueDic.artificial_str + '<span class="item-capital">' + intl('138679' /* 公司编号 */ ) + '：' + valueDic.biz_reg_no + '</span><span class="item-capital">' + intl('35779' /* 注册资本 */ ) + '：' + valueDic.register_capital + '</span><span class="item-date">' + intl('138860' /* 成立日期 */ ) + '：' + valueDic.establish_date + '</span><br/><span class="item-address">' + intl('35776' /* 注册地址 */ ) + '：' + valueDic.register_address + '</span>';
        labelState = 'company-state-twn';
    } else if (dataFrom === '社会组织') {
        companyType = 'sh';
        companyLabel = '' + corpType;
        divChannel = '<div class="each-searchlist-item">' + intl('5529' /* 法定代表人 */ ) + '：' + valueDic.artificial_str + '<span class="item-capital">' + intl('35779' /* 注册资本 */ ) + '：' + valueDic.register_capital + '</span><span class="item-date">' + intl('207784' /* 成立登记日期 */ ) + '：' + valueDic.establish_date + '</span><br/><span class="item-address">' + intl('207785' /* 住所 */ ) + '：' + valueDic.register_address + '</span>';
        labelState = 'company-state-sh';
    } else if (dataFrom === '律所') {
        companyType = 'lo';
        companyLabel = '律所';
        divChannel = '<div class="each-searchlist-item">' + intl('5529' /* 法定代表人 */ ) + '：' + valueDic.artificial_str + '<span class="item-capital">' + intl('35779' /* 注册资本 */ ) + '：' + valueDic.register_capital + '</span><span class="item-date">' + intl('138860' /* 成立日期 */ ) + '：' + valueDic.establish_date + '</span><br/><span class="item-address">' + intl('19414' /* 地址 */ ) + '：' + valueDic.register_address + '</span>';
        labelState = 'company-state-hk';
    } else if (dataFrom === '事业单位') {
        companyType = 'sy';
        companyLabel = '事业单位';
        divChannel = '<div class="each-searchlist-item">' + intl('5529' /* 法定代表人 */ ) + '：' + valueDic.artificial_str + '<span class="item-capital">' + intl('207786' /* 开办资金 */ ) + '：' + valueDic.register_capital + '</span><br/><span class="item-address">' + intl('207785' /* 住所 */ ) + '：' + valueDic.register_address + '</span>';
        labelState = 'company-state-sy';
    } else if (ZFlist.indexOf(dataFrom) > -1) { //政府机构
        companyType = 'zf';
        companyLabel = '' + dataFrom;
        divChannel = '<div class="each-searchlist-item"><span class="item-address">' + intl('1588' /* 办公地址 */ ) + '：' + valueDic.register_address + '</span>';
        labelState = 'company-state-hk';
    }

    var tmpHtmlArr = [];
    //bury
    var buryData = 'data-buryNum="' + buryRankNum + '"' + 'data-buryInput="' + buryFCode.getUrlParam('local')['keyword'] + '"' + 'data-buryfuncType="searchListCk"' + 'data-buryModule="searchList" data-buryId="' + valueDic.companycode + '"';
    tmpHtmlArr.push('<div class="div_Card">');
    tmpHtmlArr.push('<div class="div_Card_left">');
    tmpHtmlArr.push('<h4 class="wi-link-color" data-ipo="' + valueDic.isIpo + '" ccode="' + valueDic.companycode + '" cid="' + valueDic.companyid + '" data-country="' + companyType + '"' + buryData + '>' + valueDic.corp_name + '</h4>');
    tmpHtmlArr.push('<span style="' + valueDic.stateColor + '" class="company-state">' + valueDic.stateStr + '</span>');
    var tag = valueDic.corporation_tags3;
    tmpHtmlArr.push('<div class="item-list">')
    if (labelState) {
        tmpHtmlArr.push('<span class=" item-tag-list ' + labelState + '">' + companyLabel + '</span>');
    }
    tmpHtmlArr.push(showTag(tag));
    tmpHtmlArr.push('</div>')
    tmpHtmlArr.push(divChannel); //不同类型,展示不同字段信息
    if (valueDic.highlight) {
        tmpHtmlArr.push('<span class="item-hightlight"><i class="mate_photo"></i>' + valueDic.highTitle + '&nbsp;:&nbsp;' + valueDic.highLight + '</span>');
    }
    tmpHtmlArr.push('</div>');
    return tmpHtmlArr.join("");
}

function searchCallBack(data, type) {
    //搜索接口回调
    var res = JSON.parse(data);

    //bury
    if (res && res.ErrorCode == "0" && res.Data) {
        var activeType = 'search';
        var opEntity = "getclassifycompany";
        var screenStr = buryFCode.paramBuryJson('itemFilter', searchParam);
        var otherParam = null;
        if (res.Data.queryStringParams) {
            otherParam = { 'screenItem': screenStr, 'queryStringParams': JSON.stringify(res.Data.queryStringParams) };
        } else {
            otherParam = { 'screenItem': screenStr };
        }

        buryFCode.bury(activeType, opEntity, otherParam);
    }

    if (res && res.ErrorCode == "0" && res.Data && res.Data.search.length > 0) {
        $("#searchMask").hide();
        var len = res.Data.search.length;
        if (res.Page) {
            allRecords = (res.Page.Records ? res.Page.Records - 0 : 0);
        } else {
            allRecords = 1000;
        }
        if (type != 1) {
            //添加搜索每种分类下有多少条数据
            addNum2Item(res.Data.aggregations);
        }

        $("#searchResultNum").text(allRecords);
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        var tmpHtmlArr = [];
        var data = res.Data.search;
        for (var i = 0; i < data.length; i++) {
            var companycode = data[i].corp_id ? data[i].corp_id : ""; //companycode
            var companyid = data[i].corp_old_id ? data[i].corp_old_id.replace(/(\n)+|(\r\n)+/g, "") : ""; //companyid
            var corp_name = data[i].corp_name ? data[i].corp_name.replace(/(\n)+|(\r\n)+/g, "") : "--"; //企业名称
            var corp_name_old = data[i].corp_name_old ? data[i].corp_name_old.replace(/(\n)+|(\r\n)+/g, "") : "--"; //企业名称
            //var is = data[i].corp_name_old ? data[i].corp_name_old.replace(/(\n)+|(\r\n)+/g, "") : "--"; //企业名称

            var artificial_person = data[i].artificial_person_name; // 法人名称
            var artificial_id = data[i].artificial_person_id; // 法人id
            var artificial_str = '';
            if (artificial_person) {
                // if (artificial_id && artificial_id != 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
                //     if (artificial_id.length > 10) {
                //         //跳转到人物
                //         artificial_str = '<a class="item-person wi-secondary-color wi-link-color" target="_blank" href="Person.html?id=' + artificial_id + '&name=' + artificial_person + '">' + artificial_person + '</a>'
                //     } else {
                //         //跳转到公司
                //         artificial_str = '<a class="item-person wi-secondary-color wi-link-color" target="_blank" href="Company.html?companycode=' + artificial_id + '">' + artificial_person + '</a>'
                //     }
                // } else {
                //     artificial_str = '<span class="item-person">' + artificial_person + '</span>'
                // }
                artificial_str = '<span class="item-person">' + artificial_person + '</span>'
            } else {
                artificial_str = "<span class='item-person'>--</span>";
            }

            var register_address = data[i].register_address ? data[i].register_address.replace(/(\n)+|(\r\n)+/g, "") : "--"; //注册地址
            var establish_date = data[i].establish_date ? Common.formatTime(data[i].establish_date) : "--"; //成立日期
            var unit = data[i].capital_unit ? $.trim(data[i].capital_unit) : "";
            var register_capital = data[i].register_capital ? Common.formatMoney(data[i].register_capital) + unit : "--"; //注册资本
            var industry_name = data[i].industry_name ? data[i].industry_name : "--"; //所属行业
            var companystate = data[i].status_after ? data[i].status_after : "";
            var company_tags = data[i].corp_tags ? data[i].corp_tags : "";
            var stateColor = 'color:';
            var highTitle = '';
            var highLitKey = '--';
            var highLight = '--';
            var highLightId = '';
            if (data[i].highlight) {
                highLitKey = Object.keys(data[i].highlight)[0];
                var highLightStr = highLight = data[i].highlight[highLitKey] ? data[i].highlight[highLitKey] : '--';
                if (highLightStr.split('|').length > 1) {
                    highLightStr = highLightStr.replace(/<em>|<\/em>/g, '');
                    var highLightTemp = highLightStr.split('|')[0];
                    var hithLightTempArr = highLightTemp.split("^");
                    var newArr = [];
                    for (var k = 0; k < hithLightTempArr.length; k++) {
                        // if (/<em>/.test(hithLightTempArr[k])) {
                        newArr.push(hithLightTempArr[k]);
                        // }
                    }
                    var newArrStr = newArr.join(" ");
                    highLightId = highLightStr.split('|')[1];
                    if (highLightId.indexOf('XXXXXX') < 0) {
                        highLight = '<a class="wi-secondary-color" target="_blank" href="Person.html?id=' + highLightId + '&name=' + newArrStr + '">' + newArrStr + '</a>';
                    } else {
                        highLightId = '';
                        highLight = '<em class="wi-secondary-color">' + newArrStr + '</em>';
                    }
                } else {
                    var hithLightTempArr = highLightStr.split("^");
                    var newArr = [];
                    for (var k = 0; k < hithLightTempArr.length; k++) {
                        if (/<em>/.test(hithLightTempArr[k])) {
                            newArr.push(hithLightTempArr[k]);
                        }
                    }
                    var newArrStr = newArr.join(", ");
                    if (newArrStr.indexOf('<em') > -1 && newArrStr.indexOf('</em>') > -1) {
                        newArrStr = newArrStr.replace(/<em/g, '<em class="wi-secondary-color" ');
                    }
                    highLight = newArrStr;
                }
            }
            if (corp_name.indexOf('<em') > -1 && corp_name.indexOf('</em>') > -1) {
                corp_name = corp_name.replace(/<em/g, '<em class="wi-secondary-color" ');
            }
            switch (highLitKey) {
                case 'corp_name':
                    highTitle = intl('138677' /* 企业名称 */ );
                    corp_name = data[i].highlight['corp_name'];
                    break;
                case 'artificial_person':
                    highTitle = intl('138733' /* 法人 */ );
                    break;
                case 'stockname':
                    highTitle = intl('32992' /* 股票简称 */ );
                    break;
                case 'stockcode':
                    highTitle = intl('6440' /* 股票代码 */ );
                    break;
                case 'bond_name':
                    highTitle = intl('17398', '债券名称');
                    break;
                case 'bond_code':
                    highTitle = intl('30686', '债券代码');
                    break;
                case 'bond_wind_code':
                    highTitle = intl('222843', '债券万得代码');
                    break;
                case 'fund_name':
                    highTitle = intl('7996', '基金名称');
                    break;
                case 'fund_code':
                    highTitle = intl('20591', '基金代码');
                    break;
                case 'fund_wind_code':
                    highTitle = intl('222845', '基金万得代码');
                    break;
                case 'brand_name2':
                    highTitle = intl('207813' /* 品牌 */ );
                    break;
                case 'brand_name2_english':
                    highTitle = intl('222846', '品牌英文名');
                    break;
                case 'financing_institution':
                    highTitle = intl('14391', '投资方');
                    break;
                case 'project_name':
                    highTitle = intl('34886', '项目名称');
                    break;
                case 'beneficiaries':
                    highTitle = intl('138180', '最终受益人');
                    break;
                case 'corp_members':
                    highTitle = intl('122202' /* 主要成员 */ );
                    break;
                case 'stockholder_people':
                    highTitle = intl('32959' /* 股东 */ );
                    break;
                case 'eng_name':
                    highTitle = intl('222847', '企业英文名');
                    break;
                case 'tel':
                    highTitle = intl('4944' /* 电话 */ );
                    break;
                case 'mail':
                    highTitle = intl('93833' /* 邮箱 */ );
                    break;
                case 'brand_name':
                    highTitle = intl('138798' /* 商标名称  */ );
                    break;
                case 'product_name':
                    highTitle = intl('2485', '产品名称');
                    break;
                case 'main_business':
                    highTitle = intl('138753' /* 主营构成 */ )
                    break;
                case 'software_copyright':
                    highTitle = intl('138788' /* 软件著作权 */ );
                    break;
                case 'park_name':
                    highTitle = intl('222849', '园区名');
                    break;
                case 'wechat_name':
                    highTitle = intl('222848', '微信公众号名称');
                    break;
                case 'wechat_code':
                    highTitle = intl('222851', '微信公众号号码');
                    break;
                case 'website_name':
                    highTitle = intl('138578', '网站名称');
                    break;
                case 'goods':
                    highTitle = intl('138669' /* 商品/服务项目 */ );
                    break;
                case 'online_load_product':
                    highTitle = intl('222850', '网贷产品名');
                    break;
                case 'patent':
                    highTitle = intl('138749' /* 专利 */ );
                    break;
                case 'former_name':
                    highTitle = intl('138570' /* 企业曾用名 */ );
                    break;
                case 'corp_short_name':
                    highTitle = intl('138785' /* 公司简称 */ );
                    break;
                default:
                    highTitle = '';
                    break;
            }

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
            var ipoArr = data[i].ipo;
            var isIpo = "";
            var ipoCodeStr = '';
            // if (data[i].stockcode) {
            //     var str = "";
            //     if (is_terminal) {
            //         str = '!Page[Minute,' + data[i].stockcode + ']';
            //     }
            //     var ipoCodeStr = "<a class='ipo-code' href='" + str + "'>" + data[i].stockcode + "</a>";
            //     isIpo = data[i].stockcode
            // }

            var stateStr = (companystate ? '<span class="company-state-text">' + (isEn ? Common.transCompanyState2En(companystate) : companystate) + '</span>' : '');
            var dataFrom = Common.corpFroms[data[i].data_from];
            var region = data[i].region ? data[i].region.split(' ') : null;
            var corpType = data[i].corp_type ? data[i].corp_type : Common.corpFroms[data[i].data_from];

            var valueDic = {}; //用来存储div块的展示值
            valueDic['isIpo'] = isIpo;
            valueDic['companycode'] = companycode;
            valueDic['companyid'] = companyid;
            valueDic['corp_name'] = corp_name;
            valueDic['stateColor'] = stateColor;
            valueDic['stateStr'] = stateStr;
            valueDic['ipoCodeStr'] = ipoCodeStr;
            valueDic['register_address'] = register_address;
            valueDic['highlight'] = data[i].highlight;
            valueDic['highTitle'] = highTitle;
            valueDic['highLight'] = highLight;
            valueDic['industry_name'] = industry_name;
            valueDic['register_capital'] = register_capital;
            valueDic['artificial_str'] = artificial_str;
            valueDic['establish_date'] = establish_date;
            valueDic['corporation_tags3'] = data[i].corporation_tags3;
            valueDic['biz_reg_no'] = data[i].biz_reg_no ? data[i].biz_reg_no : '--';

            //bury
            var buryRankNum = searchParam.pageNo * searchParam.pageSize + i + 1;

            tmpHtmlArr.push(showSearchBlock(valueDic, dataFrom, region, corpType, buryRankNum));

            var customerStr = data[i].is_mycustomer ? "sel" : "";
            var monitoringStr = data[i].is_mymonitor ? "sel" : "";
            var customerTxt = data[i].is_mycustomer ? 'title="' + intl('138853' /*取消收藏*/ ) + '"' : 'title="' + intl('138844' /*收藏*/ ) + '"';
            var monitoringTxt = data[i].is_mymonitor ? 'title="' + intl('138257' /*取消监控*/ ) + '"' : 'title="' + intl('138643' /*监控*/ ) + '"';
            tmpHtmlArr.push('<div style="display:none;" class="list-opeation"><span  data-companyName="' + corp_name_old + '" class="list-icon-customer ' + customerStr + '" data-type="customer" ' + customerTxt + '  data-code=' + companycode + ' data-id=' + companyid + '><i></i></span><span class="list-icon-monitoring ' + monitoringStr + '" data-companyName=' + corp_name_old + ' data-type="monitoring" ' + monitoringTxt + '  data-code=' + companycode + ' data-id=' + companyid + '><i></i></span></div>');
            // tmpHtmlArr.push('<a href="../CompanyReport/CompanyReport.html?companycode=' + companycode + '" target="_blank" class="div_Card_icon wi-secondary-color" data-code="' + companycode + '" data-id="' + companyid + '" data-name="' + encodeURIComponent(corp_name_old) + '"><i></i>下载报告</a>');
            //tmpHtmlArr.push('<a href="#" class="div_Card_icon wi-secondary-color todo-disabled" data-code="' + companycode + '" data-id="' + companyid + '" data-name="' + encodeURIComponent(corp_name_old) + '"><i></i>下载报告</a>');
            tmpHtmlArr.push('</div></div>');
        }
        if (type == 1) {
            $("#div_DataList").append(tmpHtmlArr.join(""));
            preventSumbit = true;
        } else {
            preventSumbit = true;
            $("#div_DataList").html(tmpHtmlArr.join(""));
        }
        if ((parseInt(searchParam.pageNo) + 1) * parseInt(searchParam.pageSize) >= allRecords) {
            $("#searchMore").hide();
        } else {
            $("#searchMore").show();
        }
    } else {
        $("#searchMask").hide();
        $("#searchMore").hide();
        $("#searchLoad").hide();
        $("#moreLoading").hide();
        $("#searchResultNum").text("0");
        $("#div_DataList").html("<div class='tab-nodata'>" + intl('132725' /* 暂无数据 */ ) + "</div>");
        $("#filterList b").text(0)
    }
}

function addNum2Item(data) {
    //添加搜索每种分类下有多少条数据
    resetData = {};
    resetDataProvice = {};

    $("#merger_count").find("b").text(data.merger_count ? data.merger_count : 0);
    $("#on_list_count").find("b").text(data.on_list_count ? data.on_list_count : 0);
    $("#gov_support_count").find("b").text(data.gov_support_count ? data.gov_support_count : 0);
    $("#debt_count").find("b").text(data.debt_count ? data.debt_count : 0);
    $("#ipo").find("b").text(data.ipo ? data.ipo : 0);
    $("#perpare_ipo").find("b").text(data.perpare_ipo ? data.perpare_ipo : 0);
    $(".no-jump").removeClass("no-jump");
    var $featureConditionLink = $("#featureCondition>a");
    $featureConditionLink.show();
    var capitalIPoArr = ["#merger_count", "#on_list_count", "#gov_support_count", "#debt_count", "#ipo", "#perpare_ipo"];
    for (var i = 0; i < capitalIPoArr.length; i++) {
        if ($(capitalIPoArr[i]).find("b").text() == 0) {
            $(capitalIPoArr[i]).addClass("no-jump");
        }
    }
    $(".more-filter").removeClass("sel");
}

function getUrlSearch(parama) {
    //获取url某个字段后的字符串
    var loc = location.href;
    var pattern = new RegExp(parama + '=([^&#|]+)#?');
    var patternArr = pattern.exec(loc);
    if (patternArr) {
        return patternArr[1];
    } else {
        return "";
    }
}

$(document).on('click', '.todo-disabled', function() {
    layer.msg('报告下载功能正在升级中');
    return false;
})

$(document).on("click", ".list-icon-customer,.list-icon-monitoring", function() {
    //添加/移除收藏/监控
    var $this = $(this);
    var isSel = $this.hasClass("sel");
    var type = $this.attr("data-type") == "monitoring" ? intl('138643' /*监控*/ ) : intl('138844' /*收藏*/ );
    var typeInterfaceArr = $this.attr("data-type") == "monitoring" ? ["addrisklist", "delrisklist"] : ["addtomycustomer", "deletecustomer"];
    var parameter = { "CompanyId": $this.attr("data-id"), "CompanyCode": $this.attr("data-code"), "CompanyName": $this.attr("data-companyName") };
    if (!isSel) {
        //bury
        var activeType = 'click';
        var opEntity = 'company';
        var otherParam = { 'opId': $this.attr("data-code") };
        var opType = $this.attr("data-type") == "monitoring" ? 'risk' : 'collect';
        buryFCode.bury(activeType, opEntity, otherParam, opType);

        myWfcAjax(typeInterfaceArr[0], parameter, function(data) {
            var code = JSON.parse(data).ErrorCode;
            if (code == 0) {
                $this.addClass("sel");
                $this.attr('title', intl('19405' /*取消*/ ) + type);
                layer.msg(type);
            } else {
                layer.msg(type + '失败！');
            }
        });
    } else {
        //bury
        var activeType = 'click';
        var opEntity = 'company';
        var otherParam = { 'opId': $this.attr("data-code") };
        var opType = $this.attr("data-type") == "monitoring" ? 'riskDel' : 'collectDel';
        buryFCode.bury(activeType, opEntity, otherParam, opType);

        layer.confirm('<div class="warn-layer-msg"><i class="warn-layer-icon"></i><span>' + intl('19405' /*取消*/ ) + '&nbsp;' + type + '？</span></div>', {
            area: ['400px', '200px'],
            title: intl('138910' /*提示*/ ),
            btn: ['&nbsp;&nbsp;' + intl('19482' /*确认*/ ) + '&nbsp;&nbsp;', '&nbsp;&nbsp;' + intl('19405' /*取消*/ ) + '&nbsp;'], //按钮
            btnAlign: 'c',
            closeBtn: 1,
            skin: 'warn-layer-dialog',
            success: function(ele) {
                $(ele).find('.layui-layer-btn0').addClass('wi-secondary-bg');
            }
        }, function() {
            myWfcAjax(typeInterfaceArr[1], parameter, function(data) {
                var res = JSON.parse(data).Data;
                var code = JSON.parse(data).ErrorCode;
                if (code == 0) {
                    $this.removeClass("sel");
                    $this.attr('title', type);
                    layer.msg(intl('19405' /*取消*/ ) + '&nbsp;' + type);
                } else {
                    layer.msg(intl('19405' /*取消*/ ) + '&nbsp;' + type + '失败！');
                }
            });
        })
    }
});
/**
 * 使用code跳转
 */
function linkWithCodeEventHandler(e) {
    var target = e.target;
    var code = $(target).attr('data-code');
    var name = $(target).attr('data-name');
    var type = $(target).attr('data-type');
    var buryParam = $(target).attr('data-pingParam') ? $(target).attr('data-pingParam') : '';
    if (code && code.length) {
        if (code.length < 16) {
            Common.linkCompany('Bu3', code, null, null, buryParam); //bury
        } else {
            if (type) {
                window.open('Person.html?id=' + code + '&name=' + name + buryParam + '#' + type);
            } else {
                window.open('Person.html?id=' + code + '&name=' + name + buryParam);
            }

        }
    }
    return false;
};

$(document).on("click", ".del-all", function() {
    layer.confirm('<div class="warn-layer-msg"><i class="warn-layer-icon"></i><span>' + intl('176477' /*全部清除最近浏览企业?*/ ) + '&nbsp;</span></div>', {
        area: ['400px', '200px'],
        title: intl('138910' /*提示*/ ),
        btn: ['&nbsp;&nbsp;' + intl('19482' /*确认*/ ) + '&nbsp;&nbsp;', '&nbsp;&nbsp;' + intl('19405' /*取消*/ ) + '&nbsp;'], //按钮
        btnAlign: 'c',
        closeBtn: 1,
        skin: 'warn-layer-dialog',
        success: function(ele) {
            $(ele).find('.layui-layer-btn0').addClass('wi-secondary-bg');
        }
    }, function() {
        if (searchGlobalParam.country || searchGlobalParam.type) {
            var parameter = { "isKeyword": 0, type: "ent" }
            myWfcAjax("clearhistorykey", parameter, function(data) {
                var res = JSON.parse(data).Data;
                var code = JSON.parse(data).ErrorCode;
                if (code == 0) {
                    $("#ModelHistory").hide();
                    layer.msg(intl('176605' /*清除成功*/ ));
                }
            });
        } else {
            var parameter = { "isKeyword": 0 }
            myWfcAjax("clearhistorykey", parameter, function(data) {
                var res = JSON.parse(data).Data;
                var code = JSON.parse(data).ErrorCode;
                if (code == 0) {
                    $("#ModelHistory").hide();
                    layer.msg(intl('176605' /*清除成功*/ ));
                }
            });
        }
    })
})
if (wind && wind.langControl) {
    if (wind.langControl.lang !== 'zh') {
        var styleEle = ['<style>.btn-filter{width:110px;}.content-toolbar ul>li{height:auto;padding-left:5px;padding-right:5px;word-break:break-word;}</style>'];
        styleEle.push('<style>.fitler-title{word-break:break-word;display:inline-block;width:100px;line-height:16px;top:14px;}</style>')
        $(document.head).append(styleEle);
    }
}

function placeholderInit() {
    setTimeout(function() {
        $('#inputToolbarSearch').attr('placeholder', intl('138441' /* 请输入公司、人名、品牌、企业特征等关键词 */ ));
    }, 100);
}

var funcList = [placeholderInit, initToolBarChange, initBefore, searchHomeListInfo]
Common.internationToolInfo(funcList);