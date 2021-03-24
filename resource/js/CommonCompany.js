var global_isRelease = false;
var is_terminal = false; //是不是终端的开关，如果是就true,上线的时候要改成true
var is_external = false; // 是不是f9之类跳转过来的,默认不是
var global_site = "";
var global_wsid = "";
var historySearchList = [];
var serachtimer;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return null;
}

if (!global_isRelease) {
    const session = getQueryVariable("wind.sessionid");
    if (session) {
        window.localStorage.setItem("sessionid", session);
        global_wsid = session;
    } else {
        let sessionid = window.localStorage.getItem("sessionid");
        global_wsid = sessionid;
    }
    //global_site = "http://180.96.8.44";//正式站
    global_site = "http://114.80.214.59"; //体验站
}

/**
 * 菜单搜索
 */
$(document).on("click", ".nav-search-divs", function() {
    //隐藏搜索框，并点击二级模块
    // var canJump = $(this).attr('class');
    // if(canJump.indexOf('forbiddenJump') != -1){
    //  return null;
    // }
    var jumpHsh = $(this).attr('href');
    var jumpModule = $(this).attr('data-name');
    if ($(this).attr('class').indexOf('forbiddenJump') != -1) {
        return false;
    }
    $(jumpHsh + ' .widget-header').find('a:contains("' + jumpModule + '")').trigger('click');
    $('#inputNavSearch').val('');
    $('.input-nav-before-search').removeClass('active');
    //$("#subNavList").hide();
    // window.location.hash="#"+jumpHash;
    return false;

});
$(document).on('click', '.input-nav-before-search a', function(event) {
    //  跳转模块并取消增加锚点
    // event.stopPropagation();
    $(this).addClass("current").siblings().removeClass("current");
    var href = $(this).attr("href");
    // var parentHeight = $(this).parents("#secondNavList").outerHeight();
    var topdis = $(href).offset().top - 55;
    $(document).scrollTop(topdis)
        //隐藏搜索框，并点击二级模块
    var jumpHsh = $(this).attr('href');
    var jumpModule = $(this).attr('data-name');
    if ($(this).attr('class').indexOf('forbiddenJump') != -1) {
        return false;
    }
    $("#subNavList a").removeClass("sel");
    var $selLink = $("#subNavList a[href='" + jumpHsh + "']");
    $selLink.addClass("sel");
    var $curLi = $selLink.parents("li");
    $curLi.find(".second-nav-a").show();
    $curLi.siblings("li").find(".second-nav-a").hide();

    $(jumpHsh + ' .widget-header').find('a:contains("' + jumpModule + '")').trigger('click');
    $('#inputNavSearch').val('');
    $('.input-nav-before-search').removeClass('active');
    // event.preventDefault()
    return false;
    // document.querySelector($(this).attr('href')).scrollIntoView(true);
    // return false;
})
$(document).on('click', "#btnNavSearch", function() {
    var cls = '.nav-search-div';
    listEle = $('.input-nav-before-search').find(cls);
    $(listEle).first().addClass('key-down-sel');
    $('.key-down-sel').trigger("click");
})

$(document).on('input', "#inputNavSearch", function(event) {
    //生成搜索出来的菜单
    if (event.target.value.length > 0) {
        //$('#subNavList').find('ul').hide();
    } else {
        //$('#subNavList').find('ul').show();
    }
    var inputText = event.target.value.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, ""); //去掉特殊字符

    var matchResult = SearchNavInit.makeResult(inputText);
    var hasNumMatch = matchResult.matchNumList;
    var noNumMatch = matchResult.matchNoNumList;
    if (hasNumMatch.length == 0 && noNumMatch.length == 0) {
        $('#subNavList').css('overflow', 'hidden');
        $('.input-nav-before-search').removeClass('active');
        $('.input-nav-before-search').html(''); //清空之前的结果
        return null;
    }
    //展示结果
    $('#subNavList').css('overflow', 'initial');
    var beforeSearchParent = $('.input-nav-before-search');
    beforeSearchParent.addClass('active');
    beforeSearchParent.html(''); //清空之前的结果
    for (var p in hasNumMatch) {
        //展示有数字的部分
        var showTest = hasNumMatch[p][0];
        var oriName = showTest.replace(/<[^>]+>/g, "");
        var firstName = hasNumMatch[p][1];
        var jumpHash = hasNumMatch[p][2];
        var moduleLv = hasNumMatch[p][3];
        var moduleNum = hasNumMatch[p][4];
        var ele = document.createElement('a');
        $(ele).addClass('nav-search-div')
            // showTest = moduleLv==2? showTest + '&nbsp;<span class="nav-first-name">(' + firstName + ')</span>':showTest;
        showTest = moduleLv == 2 ? firstName + '&nbsp;-&nbsp;' + showTest : showTest;

        var notShowNum = ['showFundSize', 'showItsFunds', 'showPrivateFundInfo', 'showFundStruct', 'showRepreseFund', 'showFundManager', 'showIpoYield', 'showIpoSales', 'showIpoBusiness', 'showIpoStock']; //不显示统计数字的模块
        if (notShowNum.indexOf(jumpHash) != -1) {
            moduleNum = '';
        }
        ele.innerHTML = showTest + '&nbsp;' + '<span class="number-gury" >' + moduleNum + '</span>';
        $(ele).attr('href', '#' + jumpHash);
        $(ele).attr('data-name', oriName);
        $(ele).addClass('buryClick');
        $(ele).attr('data-buryOpType', 'click');
        $(ele).attr('data-buryfuncType', 'listQy');
        $(ele).attr('data-buryEntity', jumpHash);
        $(ele).attr('data-buryModule', 'navSearch');
        if (moduleLv == 2) {
            $(ele).attr('data-buryAttribute', oriName);
        }
        beforeSearchParent.append(ele);
    }
    for (var k in noNumMatch) {
        //展示无数字的部分,[高亮结果，一级模块名，一级模块跳转的id，等级，统计数字，分数]
        var showTest = noNumMatch[k][0];
        var oriName = showTest.replace(/<[^>]+>/g, "");
        var firstName = noNumMatch[k][1];
        var jumpHash = noNumMatch[k][2];
        var moduleLv = noNumMatch[k][3];
        var moduleNum = noNumMatch[k][4];
        var ele = document.createElement('a');
        $(ele).addClass('nav-search-div forbiddenJump no-statistic-num')
            // showTest = moduleLv==2? showTest + '&nbsp;<span class="nav-first-name">(' + firstName + ')</span>':showTest;
        showTest = moduleLv == 2 ? firstName + '&nbsp;-&nbsp;' + showTest : showTest;
        ele.innerHTML = showTest;
        $(ele).attr('data-hash', '#' + jumpHash);
        $(ele).attr('data-name', oriName);
        $(ele).addClass('buryClick');
        $(ele).attr('data-buryOpType', 'click');
        $(ele).attr('data-buryfuncType', 'listQy');
        $(ele).attr('data-buryEntity', jumpHash);
        $(ele).attr('data-buryModule', 'navSearch');
        if (moduleLv == 2) {
            $(ele).attr('data-buryAttribute', oriName);
        }
        beforeSearchParent.append(ele);
    }
});
$('.input-nav-before-search').on('mouseover', '.nav-search-div', function(e) {
    var cls = '.nav-search-div';
    listEle = $('.input-nav-before-search').find(cls);
    $('.input-nav-before-search').find('.key-down-sel').removeClass('key-down-sel')
    $(this).addClass('key-down-sel')
    e.preventDefault();
})

var SearchNavInit = {
    navDic: {
        //所有一级，以及二级作为key，对于重复的二级key
        '工商信息': {
            '工商信息': ['showCompanyInfo', 1],
        },
        '股东信息': {
            '股东信息': ['showShareholder', 1],
        },
        '股权穿透图': {
            '股权穿透图': ['getShareAndInvest', 1],
        },
        '最终受益人': {
            '最终受益人': ['showFinalBeneficiary', 1],
        },
        '控股企业': {
            '控股企业': ['showControllerCompany', 1],
        },
        '对外投资': {
            '对外投资': ['showDirectInvestment', 1],
        },
        '主要人员': {
            '主要人员': ['showMainMemberInfo', 1],
        },
        '分支机构': {
            '分支机构': ['showCompanyBranchInfo', 1],
        },
        '工商变更': {
            '工商变更': ['showCompanyChange', 1],
        },
        '疑似关系图': {
            '疑似关系图': ['getrelation', 1],
        },
        '竞争对手': {
            '竞争对手': ['getcomparable', 1],
        },
        '企业年报': {
            '企业年报': ['showYearReport', 1],
        },
        '总公司': {
            '总公司': ['showHeadOffice', 1],
        },
        '核心团队': {
            '核心团队': ['showCoreTeam', 1],
        },
        '集团系': {
            '集团系': ['showGroupSystem', 1],
        },
        '企业公示': {
            '企业公示': ['showCompanyNotice', 1],
        },
        '股东及出资信息': {
            '企业公示': ['showCompanyNotice', 2],
        },
        '股权变更信息': {
            '企业公示': ['showCompanyNotice', 2],
        },
        '发行股票': {
            '发行股票': ['showShares', 1],
        },
        '债券信息': {
            '债券信息': ['showBond', 1],
        },
        'PEVC融资': {
            'PEVC融资': ['showPVEC', 1],
        },
        'PEVC退出': {
            'PEVC退出': ['pvecOut', 1],
        },
        '并购信息': {
            '并购信息': ['showMerge', 1],
        },
        '担保信息': {
            '担保信息': ['showguarantee', 1],
        },
        '银行授信': {
            '银行授信': ['showGrantcredit', 1],
        },
        '待上市信息': {
            '待上市信息': ['showDeclarcompany', 1],
        },
        '动产抵押': {
            '动产抵押': ['showChattelmortgage', 1],
        },
        '抵押人': {
            '动产抵押': ['showChattelmortgage', 2],
            '历史动产抵押': ['historyshowChattelmortgage', 2],
        },
        '抵押权人': {
            '动产抵押': ['showChattelmortgage', 2],
            '历史动产抵押': ['historyshowChattelmortgage', 2],
        },
        '历史动产抵押': {
            '历史动产抵押': ['historyshowChattelmortgage', 1],
        },
        '股权出质': {
            '股权出质': ['showPledgedstock', 1],
        },
        '出质人': {
            '股权出质': ['showPledgedstock', 2],
            '股票质押': ['showStockMortgage', 2],
            '历史股权出质': ['historyshowPledgedstock', 2],
        },
        '质权人': {
            '股权出质': ['showPledgedstock', 2],
            '股票质押': ['showStockMortgage', 2],
            '历史股权出质': ['historyshowPledgedstock', 2],
        },
        '出质标的': {
            '股权出质': ['showPledgedstock', 2],
            '股票质押': ['showStockMortgage', 2],
            '历史股权出质': ['historyshowPledgedstock', 2],
        },
        '政府补贴': {
            '政府补贴': ['governmentSupport01', 1],
        },
        'ABS信息': {
            'ABS信息': ['absinfo', 1],
        },
        '土地抵押': {
            '土地抵押': ['getlandmortgage', 1],
        },
        '股票质押': {
            '股票质押': ['showStockMortgage', 1],
        },
        '知识产权出质': {
            '知识产权出质': ['showIntellectualPropertyRights', 1],
        },
        '投资机构': {
            '投资机构': ['showInvestmentAgency', 1],
        },
        '投资事件': {
            '投资事件': ['showInvestmentEvent', 1],
        },
        '政府扶持': {
            '政府扶持': ['getgovsupport', 1],
        },
        '财务报表': {
            '财务报表': ['FinancialData', 1],
        },
        '财务指标': {
            '财务指标': ['Financeanalysis', 1],
        },
        '主营构成': {
            '主营构成': ['businessScope', 1],
        },
        '政府项目': {
            '政府项目': ['governmentSupport02', 1],
        },
        '招投标': {
            '招投标': ['biddingInfo', 1],
        },
        // '投标' : {
        //  '投标' : ['invitationBid',1],
        // },
        '税务信息': {
            '税务信息': ['gettaxcredit', 1],
        },
        '纳税人信息': {
            '税务信息': ['gettaxcredit', 2],
        },
        '税务评级': {
            '税务信息': ['gettaxcredit', 2],
        },
        '上榜信息': {
            '上榜信息': ['listInformation', 1],
        },
        '招聘': {
            '招聘': ['jobs', 1],
        },
        '发债评级': {
            '发债评级': ['researchReport02', 1],
        },
        '行政许可[工商局]': {
            '行政许可[工商局]': ['getpermission', 1],
        },
        '行政许可[信用中国]': {
            '行政许可[信用中国]': ['getpermission02', 1],
        },
        '员工情况': {
            '员工情况': ['employeeSituationData', 1],
        },
        '人才指数': {
            '员工情况': ['employeeSituationData', 2],
        },
        '专业构成': {
            '员工情况': ['employeeSituationData', 2],
        },
        '在职时间': {
            '员工情况': ['employeeSituationData', 2],
        },
        '新增部门': {
            '新增部门': ['newDepartment', 1],
        },
        '公司研报': {
            '公司研报': ['researchReport01', 1],
        },
        '双随机抽查': {
            '双随机抽查': ['getdoublerandom', 1],
        },
        '执照作废声明': {
            '执照作废声明': ['getvoidagestatement', 1],
        },
        '多证合一': {
            '多证合一': ['getmultiplecertificate', 1],
        },
        '电信许可': {
            '电信许可': ['getteleLics', 1],
        },
        '进出口信用': {
            '进出口信用': ['getimpexp', 1],
        },
        '私募基金': {
            '私募基金': ['getfundpe', 1],
        },
        '土地信息': {
            '土地信息': ['showLandInfo', 1],
        },
        '地块公示': {
            '土地信息': ['showLandInfo', 2],
        },
        '购地信息': {
            '土地信息': ['showLandInfo', 2],
        },
        '土地转让': {
            '土地信息': ['showLandInfo', 2],
        },
        '企业业务': {
            '企业业务': ['showComBuInfo', 1],
        },
        '项目信息': {
            '企业业务': ['showComBuInfo', 2],
        },
        '品牌信息': {
            '企业业务': ['showComBuInfo', 2],
        },
        '品牌加盟': {
            '企业业务': ['showComBuInfo', 2],
        },
        '产品信息': {
            '产品信息': ['showmedicineinfo', 1, 0], //医药数据
            '企业业务': ['showComBuInfo', 2],
        },
        '电商店铺': {
            '企业业务': ['showComBuInfo', 2],
        },
        '旗下酒店': {
            '企业业务': ['showComBuInfo', 2],
        },
        '客户和供应商': {
            '客户和供应商': ['showCustomersSup', 1],
        },
        '客户': {
            '客户和供应商': ['showCustomersSup', 2],
        },
        '供应商': {
            '客户和供应商': ['showCustomersSup', 2],
        },
        '建筑资质': {
            '建筑资质': ['showBuildOrder', 1],
        },
        '商业特许经营': {
            '商业特许经营': ['showfranchise', 1],
        },
        '业务关联方': {
            '业务关联方': ['getrelatedparty', 1],
        },
        '金融许可': {
            '金融许可': ['getfinanciallicence', 1],
        },
        '裁判文书': {
            '裁判文书': ['getcourtdecision', 1],
        },
        '法院公告': {
            '法院公告': ['getcourtannouncement', 1],
        },
        '开庭公告': {
            '开庭公告': ['getcourtopenannouncement', 1],
        },
        '失信信息': {
            '失信信息': ['getdishonesty', 1],
        },
        '被执行人': {
            '被执行人': ['getpersonenforced', 1],
        },
        '司法协助': {
            '司法协助': ['getjudicialhelp', 1],
        },
        '公示催告': {
            '公示催告': ['getpublicnotice', 1],
        },
        '送达公告': {
            '送达公告': ['showDeliveryAnnouncement', 1],
        },
        '立案信息': {
            '立案信息': ['getfilinginfo', 1],
        },
        '限制高消费': {
            '限制高消费': ['getcorpconsumption', 1],
        },
        '终本案件': {
            '终本案件': ['getendcase', 1],
        },
        '经营异常': {
            '经营异常': ['getoperationexception', 1],
        },
        '行政处罚[工商局]': {
            '行政处罚[工商局]': ['getadministrativepenaltyBu', 1],
        },
        '行政处罚[信用中国]': {
            '行政处罚[信用中国]': ['getadministrativepenalty', 1],
        },
        '监管处罚': {
            '监管处罚': ['showSupervisorypunishment', 1],
        },
        '金融监管处罚': {
            '监管处罚': ['showSupervisorypunishment', 2],
        },
        '市场监管处罚': {
            '监管处罚': ['showSupervisorypunishment', 2],
        },
        '食药监处罚': {
            '监管处罚': ['showSupervisorypunishment', 2],
        },
        '抽查检查': {
            '抽查检查': ['getinspection', 1],
        },
        '环保处罚': {
            '环保处罚': ['getenvpenalties', 1],
        },
        '税收违法': {
            '税收违法': ['gettaxillegal', 1],
        },
        '司法拍卖': {
            '司法拍卖': ['getjudicialsale', 1],
        },
        '严重违法': {
            '严重违法': ['getillegal', 1],
        },
        '欠税信息': {
            '欠税信息': ['getowingtax', 1],
        },
        '简易注销': {
            '简易注销': ['getsimplecancel', 1],
        },
        '清算信息': {
            '清算信息': ['getclearinfo', 1],
        },
        '询价评估': {
            '询价评估': ['getevaluation', 1],
        },
        '破产重整': {
            '破产重整': ['showBankruptcy', 1],
        },
        '申请人': {
            '破产重整': ['showBankruptcy', 2],
        },
        '被申请人': {
            '破产重整': ['showBankruptcy', 2],
        },
        '商标': {
            '商标': ['getbrand', 1],
        },
        '专利': {
            '专利': ['getpatent', 1],
        },
        '作品著作权': {
            '作品著作权': ['getproductioncopyright', 1],
        },
        '软件著作权': {
            '软件著作权': ['getsoftwarecopyright', 1],
        },
        '资质认证': {
            '资质认证': ['getauthentication', 1],
        },
        '网站备案': {
            '网站备案': ['getdomainname', 1],
        },
        '微信公众号': {
            '微信公众号': ['getweixin', 1],
        },
        '微博账号': {
            '微博账号': ['getweibo', 1],
        },
        '头条号': {
            '头条号': ['gettoutiao', 1],
        },
        '证券市场失信': {
            '证券市场失信': ['getmarketdiscredited', 1],
        },
        '历史工商信息': {
            '历史工商信息': ['historycompany', 1],
        },
        '历史法人和高管': {
            '历史法人和高管': ['historylegalperson', 1],
        },
        '历史股东信息': {
            '历史股东信息': ['historyshareholder', 1],
        },
        '历史对外投资': {
            '历史对外投资': ['historyinvest', 1],
        },
        '历史被执行人': {
            '历史被执行人': ['historypersonenforced', 1],
        },
        '历史行政许可': {
            '历史行政许可': ['historypermission', 1],
        },
        '历史网站备案': {
            '历史网站备案': ['historydomainname', 1],
        },
        '历史经营异常': {
            '历史经营异常': ['historyoperationexception', 1],
        },
        '历史失信信息': {
            '历史失信信息': ['historydishonesty', 1],
        },
        '历史法院公告': {
            '历史法院公告': ['historycourtannouncement', 1],
        },
        '历史裁判文书': {
            '历史裁判文书': ['historycourtdecision', 1],
        },
        '历史开庭公告': {
            '历史开庭公告': ['historycourtopenannouncement', 1],
        },
        '历史行政处罚': {
            '历史行政处罚': ['historyadministrativepenaltyBu', 1],
        },
        '历史股权出质': {
            '历史股权出质': ['historyshowPledgedstock', 1],
        },
        '市场销售': {
            '市场销售': ['showmedicinemarket', 1, 0],
        },
    },
    searchResult: {
        matchNumList: [],
        matchNoNumList: [],
    }, //['高亮nav1','leave','一级nav','id',num]
    hasNumResult: [], //存放有统计数字的结果
    hasntNumResult: [], //存放统计数字为0的结果
    maxNum: 0,
    minNum: 0,
    normaNum: function(data) {
        //归一化x-min/max-min
        if (SearchNavInit.maxNum == SearchNavInit.minNum) {
            return 1;
        }
        var metricA = SearchNavInit.maxNum - SearchNavInit.minNum;
        var metricB = data - SearchNavInit.minNum;
        var normaNumResult = metricB / metricA;
        return normaNumResult;
    },
    similar: function(keyword, queryKey) {
        //计算匹配度,精确匹配
        //返回,以及模糊匹配,并进行高亮

        //精确匹配
        keyword = keyword.toLowerCase();
        queryKey = queryKey.toLowerCase();
        var result = [];
        var kwLen = keyword.length;
        var reg = new RegExp(keyword); //查询的词
        var sim = reg.test(queryKey);
        var simText = ''
        if (sim) {
            simText = queryKey.replace(reg, '<em>$&</em>');
            result.push('sim', simText, kwLen);
            return result;
        }
        // else{
        //  //模糊匹配--产品经理不要。。故注释掉
        //  var oriQueryKey = queryKey;
        //  var setList = new Set(keyword.split(''));
        //  var queryList = Array.from(setList);
        //  var dimmatchNum = 0;
        //  for(var i in queryList){
        //      var dimReg = new RegExp(queryList[i]);
        //      var dim = dimReg.test(queryKey);
        //      if(dim){
        //          dimmatchNum += 1;
        //          oriQueryKey = oriQueryKey.replace(dimReg,'<em>$&</em>');
        //      }
        //  }
        //  if(dimmatchNum != 0){
        //      result.push('dim',oriQueryKey,dimmatchNum);
        //  }
        //  return result;
        // }
        return result;
    },
    makeScore: function(simResult, queryNavKey) {
        //计算排序分数
        //score = （全匹配度*100*全匹配比例[模糊匹配 * 10]）* +级别+归一化的数字
        var simScore = simResult[0] == 'sim' ? simResult[2] * 100 * (simResult[2] / queryNavKey.length) : simResult[2] * 10; //匹配度
        var queryItem = SearchNavInit.navDic[queryNavKey]; //可能会有多值
        var queryItemKey = Object.keys(queryItem);
        for (var k in queryItemKey) {
            //遍历每一个一级模块，得到每个父项得分
            var firstName = queryItemKey[k]; //一级模块名
            var itemValue = queryItem[firstName]; //模块信息
            var jumpId = itemValue[0]; //用于跳转的hashid
            var leaveNum = itemValue[1]; //级别
            var itemNum = itemValue[2]; //统计数字
            var norNum = itemNum > 0 ? SearchNavInit.normaNum(itemNum) : 0; //归一化的统计数字
            // 产品要一级的tab在二级前。。
            var finlScore = simScore + (leaveNum == 1 ? 4 : 2) + norNum;

            var resultItem = [];
            resultItem.push(simResult[1], firstName, jumpId, leaveNum, itemNum, finlScore);
            if (itemNum == 0) {
                //当统计数字为0时，存放在hasntNumResult
                //[高亮结果，一级模块名，一级模块跳转的id，等级，统计数字，分数]
                SearchNavInit.hasntNumResult.push(resultItem);
            } else {
                SearchNavInit.hasNumResult.push(resultItem);
            }
        }
    },
    makeResult: function(keyword) {
        try {
            //结果初始化
            SearchNavInit.searchResult.matchNumList = [];
            SearchNavInit.searchResult.matchNoNumList = [];
            SearchNavInit.hasntNumResult = [];
            SearchNavInit.hasNumResult = [];
            var navKeyList = Object.keys(SearchNavInit.navDic); //获取查询范围
            for (var i in navKeyList) {
                var similarResult = SearchNavInit.similar(keyword, navKeyList[i]);
                if (similarResult.length == 0 || similarResult[2] == 0) {
                    //如果不相似则跳过这个词
                    continue;
                } else {
                    SearchNavInit.makeScore(similarResult, navKeyList[i]);
                }
            }
            //利用两个列表，产生最后排序匹配结果，按照匹配得分逆序排列
            SearchNavInit.hasntNumResult.sort(function(x, y) { return y[5] - x[5]; });
            SearchNavInit.hasNumResult.sort(function(x, y) { return y[5] - x[5]; });
            SearchNavInit.searchResult.matchNumList = SearchNavInit.hasNumResult;
            SearchNavInit.searchResult.matchNoNumList = SearchNavInit.hasntNumResult;
            return SearchNavInit.searchResult;
        } catch (error) {

        }

    },
    numFilter: function(data) {
        //处理数字
        if (parseInt(data) + '' != 'NaN') {
            return parseInt(data);
        } else {
            switch (data) {
                case 'true':
                    return 1;
                    break;
                case 'false':
                    return 0;
                    break;
                default:
                    return 0;
            }
        }
    },
    init: function(data) {
        //初始函数,将统计数字填充到nav中
        $('#inputNavSearch').off('keydown').on('keydown', SearchNavInit.keydownFun);
        try {
            delete data['id'];
            delete data['corp_id'];
            delete data['corp_old_id'];
            var numList = Object.values(data).map(x => SearchNavInit.numFilter(x)); //获取num列表，并转换为数字
            var numListOut0 = [];
            for (var i in numList) {
                if (numList[i] == 0) {
                    continue;
                }
                numListOut0.push(numList[i]);
            }
            SearchNavInit.maxNum = Math.max.apply(Math, numList); //获取最大值
            SearchNavInit.minNum = (SearchNavInit.maxNum >= 1 || numListOut0.length == 0) ? Math.min.apply(Math, numListOut0) : 0; //最小值
            SearchNavInit.navDic['工商信息']['工商信息'].push(1);
            // SearchNavInit.navDic['工商信息']['工商信息'].push(parseInt(data.));
            SearchNavInit.navDic['股东信息']['股东信息'].push(parseInt(data.shareholder_num));
            SearchNavInit.navDic['股权穿透图']['股权穿透图'].push(parseInt(data.gqcttNum) > 0 ? 1 : 0);
            SearchNavInit.navDic['最终受益人']['最终受益人'].push(parseInt(data.beneficiary_num));
            SearchNavInit.navDic['控股企业']['控股企业'].push(parseInt(data.foreign_ctrl_num));
            SearchNavInit.navDic['对外投资']['对外投资'].push(parseInt(data.foreign_invest_num));
            SearchNavInit.navDic['主要人员']['主要人员'].push(parseInt(data.member_num));
            SearchNavInit.navDic['分支机构']['分支机构'].push(parseInt(data.new_branch_num));
            SearchNavInit.navDic['工商变更']['工商变更'].push(parseInt(data.change_record_num));
            SearchNavInit.navDic['疑似关系图']['疑似关系图'].push(parseInt(1));
            SearchNavInit.navDic['竞争对手']['竞争对手'].push(parseInt(data.companylist_num));
            SearchNavInit.navDic['企业年报']['企业年报'].push(parseInt(data.annual_num));
            SearchNavInit.navDic['总公司']['总公司'].push(parseInt(data.headerquarters_num));
            SearchNavInit.navDic['核心团队']['核心团队'].push(parseInt(data.coreteam_num));
            SearchNavInit.navDic['集团系']['集团系'].push(parseInt(data.group_membercorp_num != "0" ? data.group_membercorp_num : (data.group_main_num ? data.group_main_num : 0)));
            SearchNavInit.navDic['企业公示']['企业公示'].push(parseInt(data.share_change_num)); //2
            SearchNavInit.navDic['股东及出资信息']['企业公示'].push(parseInt(data.share_change_num01) || 0); // TODO
            SearchNavInit.navDic['股权变更信息']['企业公示'].push(parseInt(data.share_change_num) || 0); // TODO
            SearchNavInit.navDic['发行股票']['发行股票'].push(parseInt(data.sharedstock_num));
            SearchNavInit.navDic['债券信息']['债券信息'].push(parseInt((data.sharedbonds_num ? parseInt(data.sharedbonds_num) : 0) + (data.cbrcreditratingreport_num ? parseInt(data.cbrcreditratingreport_num) : 0)));
            SearchNavInit.navDic['PEVC融资']['PEVC融资'].push(parseInt(data.pevc_num_new));
            SearchNavInit.navDic['PEVC退出']['PEVC退出'].push(parseInt(data.pevcquit_num));
            SearchNavInit.navDic['并购信息']['并购信息'].push(parseInt(data.merge_num));
            SearchNavInit.navDic['担保信息']['担保信息'].push(parseInt(data.guarantee_num));
            SearchNavInit.navDic['银行授信']['银行授信'].push(parseInt(data.banktrust_num));
            SearchNavInit.navDic['待上市信息']['待上市信息'].push(parseInt(data.declarcompany_num));
            SearchNavInit.navDic['动产抵押']['动产抵押'].push(parseInt(data.chatteimortgageitem_num)); //2
            SearchNavInit.navDic['抵押人']['动产抵押'].push(parseInt(data.chatteimortgage_num)); //2
            SearchNavInit.navDic['抵押权人']['动产抵押'].push(parseInt(data.chatteimortgage1_num)); //2
            SearchNavInit.navDic['股权出质']['股权出质'].push(parseInt(data.equitypledgelist_num)); //2
            SearchNavInit.navDic['出质人']['股权出质'].push(parseInt(data.pledgor_num)); //2
            SearchNavInit.navDic['质权人']['股权出质'].push(parseInt(data.pawnee_num)); //2
            SearchNavInit.navDic['出质标的']['股权出质'].push(parseInt(data.pcorp_num)); //2
            SearchNavInit.navDic['政府补贴']['政府补贴'].push(parseInt(data.governmentgrants_num));
            SearchNavInit.navDic['ABS信息']['ABS信息'].push(parseInt(data.companyabs_num));
            SearchNavInit.navDic['土地抵押']['土地抵押'].push(parseInt(data.landmortgage_num));
            SearchNavInit.navDic['股票质押']['股票质押'].push(parseInt(data.stock_pledge_num)); //2
            SearchNavInit.navDic['出质人']['股票质押'].push(parseInt(data.stock_pledgers_num)); //2
            SearchNavInit.navDic['质权人']['股票质押'].push(parseInt(data.stock_pledgees_num)); //2
            SearchNavInit.navDic['出质标的']['股票质押'].push(parseInt(data.stock_plexes_num)); //2
            SearchNavInit.navDic['知识产权出质']['知识产权出质'].push(parseInt(data.intellectual_pledgeds_num));
            SearchNavInit.navDic['投资机构']['投资机构'].push(parseInt(data.invest_orgs_num));
            SearchNavInit.navDic['投资事件']['投资事件'].push(parseInt(data.invest_events_num));
            SearchNavInit.navDic['政府扶持']['政府扶持'].push(parseInt(data.gov_support_num));
            SearchNavInit.navDic['财务报表']['财务报表'].push(parseInt(data.financial_num));
            SearchNavInit.navDic['财务指标']['财务指标'].push(parseInt(data.financial_num));
            SearchNavInit.navDic['主营构成']['主营构成'].push(parseInt(data.mainbusinessstruct_num));
            SearchNavInit.navDic['政府项目']['政府项目'].push(parseInt(data.governmentproj_num));
            // SearchNavInit.navDic['产品信息']['产品信息'].push(parseInt(data.));
            SearchNavInit.navDic['招投标']['招投标'].push(parseInt(data.bid_new_num));
            // SearchNavInit.navDic['投标']['投标'].push(parseInt(data.));
            SearchNavInit.navDic['税务信息']['税务信息'].push(parseInt(data.taxcredit_num)); //2
            SearchNavInit.navDic['纳税人信息']['税务信息'].push(parseInt(data.taxpayer_num) || 0); //2
            SearchNavInit.navDic['税务评级']['税务信息'].push(parseInt(data.taxcredit_num)); //2
            SearchNavInit.navDic['上榜信息']['上榜信息'].push(parseInt(data.ranked_num));
            SearchNavInit.navDic['招聘']['招聘'].push(parseInt(data.recruitt_num));
            SearchNavInit.navDic['发债评级']['发债评级'].push(parseInt(data.cbrcreditratingreport_num));
            // SearchNavInit.navDic['行政许可']['行政许可'].push(parseInt(data.permission_num));
            SearchNavInit.navDic['行政许可[工商局]']['行政许可[工商局]'].push(parseInt(data.permission_num));
            SearchNavInit.navDic['行政许可[信用中国]']['行政许可[信用中国]'].push(parseInt(data.admin_licence_num));
            SearchNavInit.navDic['员工情况']['员工情况'].push(parseInt(data.exist_profession));
            SearchNavInit.navDic['人才指数']['员工情况'].push(parseInt(data.exist_remain));
            SearchNavInit.navDic['专业构成']['员工情况'].push(parseInt(data.exist_remain));
            SearchNavInit.navDic['在职时间']['员工情况'].push(parseInt(data.exist_remain));
            SearchNavInit.navDic['新增部门']['新增部门'].push(parseInt(data.deptSchema_num));
            SearchNavInit.navDic['公司研报']['公司研报'].push(parseInt(data.report_num));
            SearchNavInit.navDic['双随机抽查']['双随机抽查'].push(parseInt(data.spot_check_num));
            SearchNavInit.navDic['执照作废声明']['执照作废声明'].push(parseInt(data.license_abolish_num));
            SearchNavInit.navDic['多证合一']['多证合一'].push(parseInt(data.company_certificate_num));
            SearchNavInit.navDic['电信许可']['电信许可'].push(parseInt(data.telelic_num));
            SearchNavInit.navDic['进出口信用']['进出口信用'].push(parseInt(data.impexp_num));
            SearchNavInit.navDic['私募基金']['私募基金'].push(parseInt(data.fundpe_num));
            SearchNavInit.navDic['土地信息']['土地信息'].push(parseInt(data.landinfo_num)); //2
            SearchNavInit.navDic['地块公示']['土地信息'].push(parseInt(data.landanns_num)); //2
            SearchNavInit.navDic['购地信息']['土地信息'].push(parseInt(data.landpurchase_num)); //2
            SearchNavInit.navDic['土地转让']['土地信息'].push(parseInt(data.landtrans_num)); //2
            SearchNavInit.navDic['企业业务']['企业业务'].push(parseInt(data.corp_biz_num)); //2
            SearchNavInit.navDic['项目信息']['企业业务'].push(parseInt(data.project_info_num)); //2
            SearchNavInit.navDic['品牌信息']['企业业务'].push(parseInt(data.tradelbl_num)); //2
            SearchNavInit.navDic['品牌加盟']['企业业务'].push(parseInt(data.brand_combining_num) || 0); //2
            SearchNavInit.navDic['产品信息']['企业业务'].push(parseInt(data.product_num)); //2
            SearchNavInit.navDic['电商店铺']['企业业务'].push(parseInt(data.ecommerce_store_num) || 0); //2
            SearchNavInit.navDic['旗下酒店']['企业业务'].push(parseInt(data.hotels_num) || 0); //2
            SearchNavInit.navDic['客户和供应商']['客户和供应商'].push(parseInt(data.customer_supplier_num)); //2
            SearchNavInit.navDic['客户']['客户和供应商'].push(parseInt(data.customer_num)); //2
            SearchNavInit.navDic['供应商']['客户和供应商'].push(parseInt(data.supplier_num)); //2
            SearchNavInit.navDic['建筑资质']['建筑资质'].push(parseInt(data.build_qualification_num));
            SearchNavInit.navDic['商业特许经营']['商业特许经营'].push(parseInt(data.commercial_franchise_info_num));
            SearchNavInit.navDic['业务关联方']['业务关联方'].push(parseInt(data.related_party_num));
            SearchNavInit.navDic['金融许可']['金融许可'].push(parseInt(data.financial_licence_num));
            SearchNavInit.navDic['裁判文书']['裁判文书'].push(parseInt(data.judgeinfo_num));
            SearchNavInit.navDic['法院公告']['法院公告'].push(parseInt(data.coutnotice_num));
            SearchNavInit.navDic['开庭公告']['开庭公告'].push(parseInt(data.trialnotice_num));
            SearchNavInit.navDic['失信信息']['失信信息'].push(parseInt(data.breakpromise_num));
            SearchNavInit.navDic['被执行人']['被执行人'].push(parseInt(data.cur_debetor_num));
            SearchNavInit.navDic['司法协助']['司法协助'].push(parseInt(data.judicail_assist_num));
            SearchNavInit.navDic['公示催告']['公示催告'].push(parseInt(data.public_notice_num));
            SearchNavInit.navDic['送达公告']['送达公告'].push(parseInt(data.delivery_anns_num));
            SearchNavInit.navDic['立案信息']['立案信息'].push(parseInt(data.filing_info_num));
            SearchNavInit.navDic['限制高消费']['限制高消费'].push(parseInt(data.corp_consumption_num));
            SearchNavInit.navDic['终本案件']['终本案件'].push(parseInt(data.end_case_num));
            SearchNavInit.navDic['经营异常']['经营异常'].push(parseInt(data.bizexception_num));
            // SearchNavInit.navDic['行政处罚']['行政处罚'].push(parseInt(data.punishment_num ? (data.business_punishment_num ? (parseInt(data.business_punishment_num) + parseInt(data.punishment_num)).toString() : data.punishment_num) : (data.business_punishment_num ? business_punishment_num : 0)));
            SearchNavInit.navDic['行政处罚[工商局]']['行政处罚[工商局]'].push(parseInt(data.business_punishment_num));
            SearchNavInit.navDic['行政处罚[信用中国]']['行政处罚[信用中国]'].push(parseInt(data.punishment_num));
            SearchNavInit.navDic['抽查检查']['抽查检查'].push(parseInt(data.inspection_num));
            SearchNavInit.navDic['环保处罚']['环保处罚'].push(parseInt(data.envpenalty_num));
            SearchNavInit.navDic['税收违法']['税收违法'].push(parseInt(data.illegaltax_num));
            SearchNavInit.navDic['司法拍卖']['司法拍卖'].push(parseInt(data.judical_auction_num));
            SearchNavInit.navDic['严重违法']['严重违法'].push(parseInt(data.illegal_num));
            SearchNavInit.navDic['欠税信息']['欠税信息'].push(parseInt(data.owingtax_num));
            SearchNavInit.navDic['简易注销']['简易注销'].push(parseInt(data.simplecancel_notice_num ? (data.simplecancel_notice_num - 0) : 0)); ////////
            SearchNavInit.navDic['清算信息']['清算信息'].push(parseInt(data.liquidation_num));
            SearchNavInit.navDic['询价评估']['询价评估'].push(parseInt(data.evaluation_num));
            SearchNavInit.navDic['破产重整']['破产重整'].push(parseInt(data.bankruptcy_num)); //2
            SearchNavInit.navDic['申请人']['破产重整'].push(parseInt(data.bankruptcy_applicant_num)); //2
            SearchNavInit.navDic['被申请人']['破产重整'].push(parseInt(data.bankruptcy_respondent_num)); //2
            SearchNavInit.navDic['商标']['商标'].push(parseInt(data.trademark_num));
            SearchNavInit.navDic['专利']['专利'].push(parseInt(data.patent_num));
            SearchNavInit.navDic['作品著作权']['作品著作权'].push(parseInt(data.workcopyr_num));
            SearchNavInit.navDic['软件著作权']['软件著作权'].push(parseInt(data.softwarecopyright_num));
            SearchNavInit.navDic['资质认证']['资质认证'].push(parseInt(data.certification_merge_num));
            SearchNavInit.navDic['网站备案']['网站备案'].push(parseInt(data.domain_num));
            SearchNavInit.navDic['微信公众号']['微信公众号'].push(parseInt(data.webchat_public_num));
            SearchNavInit.navDic['微博账号']['微博账号'].push(parseInt(data.micro_blog_num));
            SearchNavInit.navDic['头条号']['头条号'].push(parseInt(data.today_headline_num));
            SearchNavInit.navDic['证券市场失信']['证券市场失信'].push(parseInt(data.end_case_num));
            SearchNavInit.navDic['历史工商信息']['历史工商信息'].push(parseInt(data.his_business_info_num == "true" ? 1 : 0));
            SearchNavInit.navDic['历史法人和高管']['历史法人和高管'].push(parseInt(data.his_manager_num));
            SearchNavInit.navDic['历史股东信息']['历史股东信息'].push(parseInt(data.his_shareholder_num));
            SearchNavInit.navDic['历史对外投资']['历史对外投资'].push(parseInt(data.his_invest_num));
            SearchNavInit.navDic['历史被执行人']['历史被执行人'].push(parseInt(data.his_debetor_num));
            SearchNavInit.navDic['历史行政许可']['历史行政许可'].push(parseInt(data.his_permission_num));
            SearchNavInit.navDic['历史网站备案']['历史网站备案'].push(parseInt(data.his_domain_num));
            SearchNavInit.navDic['历史经营异常']['历史经营异常'].push(parseInt(data.his_bizexception_num));
            SearchNavInit.navDic['历史失信信息']['历史失信信息'].push(parseInt(data.his_breakpromise_num));
            SearchNavInit.navDic['历史法院公告']['历史法院公告'].push(parseInt(data.his_coutnotice_num));
            SearchNavInit.navDic['历史裁判文书']['历史裁判文书'].push(parseInt(data.his_judgeinfo_num));
            SearchNavInit.navDic['历史开庭公告']['历史开庭公告'].push(parseInt(data.his_trialnotice_num));
            SearchNavInit.navDic['历史行政处罚']['历史行政处罚'].push(parseInt(data.his_business_punishment_num));
            SearchNavInit.navDic['历史股权出质']['历史股权出质'].push(parseInt(data.his_stock_pledge_num)); //2
            SearchNavInit.navDic['出质人']['历史股权出质'].push(parseInt(data.his_pledgor_num)); //2
            SearchNavInit.navDic['质权人']['历史股权出质'].push(parseInt(data.his_pawnee_num)); //2
            SearchNavInit.navDic['出质标的']['历史股权出质'].push(parseInt(data.his_pcorp_num)); //2
            SearchNavInit.navDic['历史动产抵押']['历史动产抵押'].push(parseInt(data.his_chatteimortgageitem_num)); //2
            SearchNavInit.navDic['抵押人']['历史动产抵押'].push(parseInt(data.his_chatteimortgage_num)); //2
            SearchNavInit.navDic['抵押权人']['历史动产抵押'].push(parseInt(data.his_chatteimortgage1_num)); //2
            SearchNavInit.navDic['监管处罚']['监管处罚'].push(parseInt(data.corp_regulatory_num)); //2
            SearchNavInit.navDic['金融监管处罚']['监管处罚'].push(parseInt(data.finance_punishment_num)); //2
            SearchNavInit.navDic['市场监管处罚']['监管处罚'].push(parseInt(data.market_punishment_num)); //2
            SearchNavInit.navDic['食药监处罚']['监管处罚'].push(parseInt(data.foodanddrug_punishment_num)); //2
            // SearchNavInit.navDic['行政处罚[工商局]']['行政处罚[工商局]'].push(parseInt(data.));
            // SearchNavInit.navDic['产品信息']['产品信息'].push(0);//2
            // SearchNavInit.navDic['市场销售']['市场销售'].push(0);//2
        } catch (error) {
            console.log('nav error');
        }

    },
    keydownFun: function(e) {
        //对键盘按键作出反馈
        // var upDownClickNum = $(listEle).filter('.key-down-sel').length;
        var text = $('.input-nav-search').val();
        var hasMatchNum = $('.input-nav-before-search').children().length;
        if ($.trim(text).length == 0 || hasMatchNum == 0) {
            return;
        }
        var cls = '.nav-search-div';
        listEle = $('.input-nav-before-search').find(cls);
        var upDownClickNum = $(listEle).filter('.key-down-sel').length;

        switch (e.keyCode) {
            case 38: //上                                            
                if (upDownClickNum < 1) {
                    $(listEle).last().addClass('key-down-sel');
                } else {
                    $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                        .prev().filter(cls).addClass("key-down-sel")
                }
                // if (cls == '.search-list-div') {
                //  $(inputEle).val($(listEle).filter('.key-down-sel').attr('data-name'));
                // }
                e.preventDefault();
                break;
            case 40: //下
                if (upDownClickNum < 1) {
                    $(listEle).first().addClass('key-down-sel');
                } else {
                    $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                        .next().filter(cls).addClass("key-down-sel")

                }
                // if (cls == '.search-list-div') {
                //  $(inputEle).val($(listEle).filter('.key-down-sel').attr('data-name'));
                // }
                e.preventDefault();
                break;
            case 13:
                if ($.trim(text)) {
                    if (cls == '.nav-search-div') {
                        // $('#inputNavSearch').val('');
                        // $('.input-nav-before-search').removeClass('active');
                        if (upDownClickNum == 0) {
                            //选择第一个元素
                            $(listEle).first().addClass('key-down-sel');
                        }
                        var jumpHsh = $('.key-down-sel').attr('href');
                        var jumpModule = $('.key-down-sel').attr('data-name');
                        console.log($('.key-down-sel'))
                        $('.key-down-sel').trigger("click");
                        //$("#subNavList").hide();
                    }
                }
                break;
        }
    },
}

$(document).bind("click", function(e) {
    if ($((e.target || e.srcElement)).closest(".toolbar-search,.search-inputarea,.input-toolbar-search-list,.search-relation-from").length == 0) {
        $('.input-toolbar-search-list').removeClass('active');
        $('.input-toolbar-before-search').removeClass('active');
    }
});
// $(document).on("click", ".item-tag-feture", function() {
//     //企业标签，目前应用在企业搜索页和详情页的标签，所以公用
//     var $this = $(this);
//     var type = $this.attr("data-type");
//     var val = $this.attr("data-val");
//     if (type && val) {
//         window.open("SuperAdvancedSearch.html?type=" + encodeURIComponent(type) + "&value=" + val)
//     }
//     return false;
// });

$(document).on("click", ".private-icon", function(e) {
    if (!is_terminal) {
        if (window.layer) {
            layer.msg("该功能需登录Wind金融终端。");
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    Common.onMore(2958, 'URC50506');
    return false;
})
$(document).on("click", ".navshowmore", function(e) {
    window.open("allFunction.html")
    return false;
})
$(document).on("click", ".toolbar-search .search-list-div", function(e) {
    var $this = $(this);
    $input = $this.parents(".toolbar-search").find(".input-toolbar-search");
    $btn = $this.parents(".toolbar-search").find(".input-toolbar-button");
    $input.val($this.attr("data-name"));
    $btn.trigger("click");
    return false;
})

$(document).on("click", ".park-icon", function(e) {
    if (!is_terminal) {
        if (window.layer) {
            layer.msg("该功能需登录Wind金融终端。");
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    } else {
        window.open('https://GOVWebSite/govmap/?title=万寻地图&right=4C203DE15');
    }
})
$(document).on("click", ".public-icon", function(e) {
    if (!is_terminal) {
        if (window.layer) {
            layer.msg("该功能需登录Wind金融终端。");
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    Common.onMore(2804, 'URC30516');
    return false;
})
$(document).on("click", "#btnToolbarSearchPatent", function() {
    var keyword = $.trim($("#inputToolbarSearchPatent").val())
    if (keyword) {
        keyword = encodeURI(keyword);
        var url = "SearchAloneList.html?keyword=" + keyword + '&type=patentAlone';
        document.location.href = url;
    }
    return false
})
$(document).on("click", "#btnToolbarSearchBrand", function() {
    var keyword = $.trim($("#inputToolbarSearchBrand").val())
    if (keyword) {
        keyword = encodeURI(keyword);
        var url = "SearchAloneList.html?keyword=" + keyword + '&type=brandAlone';
        document.location.href = url;
    }
    return false
})
$(document).on("click", "#btnToolbarSearchJudge", function() {
    var keyword = $.trim($("#inputToolbarSearchJudge").val())
    if (keyword) {
        keyword = encodeURI(keyword);
        var url = "SearchAloneList.html?keyword=" + keyword + '&type=risk';
        document.location.href = url;
    }
    return false
})
$(document).on("click", "#btnToolbarSearchDishonesty", function() {
    var keyword = $.trim($("#inputToolbarSearchDishonesty").val())
    if (keyword) {
        keyword = encodeURI(keyword);
        var url = "SearchAloneList.html?keyword=" + keyword + '&type=dishonestAlone';
        document.location.href = url;
    }
    return false
})
$(document).on("mouseover mouseout mousemove", ".big-logo", function(e) {
    $this = $(this);
    var x = 20;
    var y = 0;
    var imgHerf = $this.attr("src");
    if (e.type == "mouseover") {
        if (imgHerf && imgHerf.indexOf("default") < 0) {
            var tooltip = '<div class="big-logo-model"><img width="140" src="' + imgHerf + '" /></div>';
            $("body").append(tooltip);
            $(".big-logo-model").css({
                "top": (e.pageY + y) + "px",
                "left": (e.pageX + x) + "px",
            })
        }
    } else if (e.type == "mouseout") {
        $(".big-logo-model").remove();
    } else if (e.type == "mousemove") {
        $(".big-logo-model").css({
            "top": (e.pageY + y) + "px",
            "left": (e.pageX + x) + "px",
        })
    }
})
$(document).on("click", ".go2Link", function() {
    //跳转判断是跳人物还是公司，公司还分是不是上市
    var $this = $(this);
    var code = $this.attr('data-code');
    var name = $this.attr('data-name');
    var type = $this.attr('data-type');
    var buryParam = $this.attr('data-pingParam') ? $this.attr('data-pingParam') : '';
    if (code && code.length) {
        if (code.length < 16) {
            Common.linkCompany('Bu3', code, null, null, buryParam); //bury
        } else {
            // if (buryParam.indexOf('fromPageUId') == -1) {
            //     buryParam = buryParam + '&fromPageUId=' + buryFCode.getPageUId();
            // }
            // if (type) {
            //     window.open('Person.html?id=' + code + '&name=' + name + buryParam + '#' + type);
            // } else {
            //     window.open('Person.html?id=' + code + '&name=' + name + buryParam);
            // }

        }
    }
    return false;
})
$(document).on("click", ".go2LinkById", function() {
    //跳转判断是跳人物还是公司，公司还分是不是上市
    var $this = $(this);
    var id = $this.attr('data-id');
    var buryParam = $this.attr('data-pingParam') ? $this.attr('data-pingParam') : '';
    if (id && id.length) {
        Common.linkCompany('Bu3', "", id, "", buryParam); //bury
    }
    return false;
})
$(document).on("focus", ".pagiate-page-num", function() {
    $(this).addClass('focus-input');
})
$(document).on("blur", ".pagiate-page-num", function() {
    $(this).removeClass('focus-input');
})

$.fn.extend({
    placeholder: function(opt) {
        var ele = $(this);
        opt = opt || {};
        var placeholder = opt.placeholder || ele.attr('placeholder');
        if (placeholder) {
            ele.attr('placeholder', placeholder);
            if (!('placeholder' in document.createElement('input'))) {

                if (ele.val() == '') {
                    ele.val(placeholder).addClass('placeholder').blur();
                }

                ele.bind('focus.placeholder', function() {
                    var self = $(this);
                    if (self.val() == placeholder) {
                        self.val('').removeClass('placeholder');
                    }
                });

                ele.bind('blur.placeholder', function() {
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

//format方法
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
Date.prototype.format = function(format) {
    var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function myWfcAjax(cmd, data, successFun, errorFun) {
    var handler = 'WindSecureApi.aspx';
    if (Common.getUrlSearch('gelapphandler')) {
        handler = 'WebApi.aspx';
    }
    if (!data) {
        data = {};
    }
    var regexPage = /http:\/\/[^/]+\/[^/]+\/([\S]+)\.html/;
    var page = "";
    var route = "";
    if (location.href.indexOf('#') != -1) {
        route = location.href.split('#')[1];
    }
    if (location.href.match(regexPage)) {
        page = location.href.match(regexPage)[1];
    }
    var tUrl = "/Wind.WFC.Enterprise.Web/Enterprise/" + handler + "?cmd=" + cmd + "&s=" + Math.random();
    if (!global_isRelease) {
        tUrl = global_site + "/Wind.WFC.Enterprise.Web/Enterprise/" + handler + "?cmd=" + cmd + "&s=" + Math.random() + "&wind.sessionid=" + global_wsid;

    }
    tUrl = tUrl + "&page=" + page + "&route=" + route;
    $.ajax({
        data: getAllPrpos(data),
        type: "Post",
        url: tUrl,
        timeout: 30000,
        success: successFun,
        error: errorFun
    });
}

function shbdgAjax(cmd, data, successFun, errorFun) {
    if (!data) {
        data = {};
    }
    var tUrl = Common.shbdgServer + cmd;
    $.ajax({
        data: getAllPrpos(data),
        type: "GET",
        url: tUrl,
        timeout: 30000,
        success: successFun,
        error: errorFun
    });
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

function getAllPrpos(obj) {
    // 用来保存所有的属性名称和值 
    var props = "";
    // 开始遍历 
    for (var p in obj) {
        // 方法 
        if (typeof(obj[p]) == " function ") {
            obj[p]();
        } else {
            // p 为属性名称，obj[p]为对应属性的值 
            props += p + "=" + encodeURIComponent(obj[p]) + "&";
        }
    }
    if (props != "" && props.substr(props.length - 1, 1) == "&") {
        props = props.substr(0, props.length - 1);
    }
    // 最后显示所有的属性 
    return props;
}

function getuserpageinfoFun() {
    //获取用户权限包
    myWfcAjax("getuserpackageinfo", {}, function(data) {
        var res = JSON.parse(data);
        if (res.ErrorCode == 0 && res.Data) {
            var isBuy = res.Data.isBuy;
            var type = res.Data.packageName || '';
            if (type == 'EQ_APL_GEL_SVIP') {
                Common.is_svip_config = true;
            }
            if (type == 'EQ_APL_GEL_VIP') {
                Common.is_vip_config = true;
            }
            if (type == 'EQ_APL_GEL_EP') {
                Common.is_ep_config = true;
                Common.is_vip_config = true;
            }
            if (type == 'EQ_APL_GEL_BS') {
                Common.is_bs_config = true;
            }
            if (isBuy) {
                // 购买了终端账号的 默认有vip/svip权限
                Common.is_vip_config = true;
                Common.is_svip_config = true;
            }
            Common.is_overseas_config = res.Data.isForeign; //是否是海外用户
            localStorage.setItem('GEL_USER_ISFOREIGN', Common.is_overseas_config ? 2 : 1);
        } else {}
    }, function() {})
}

$(document).on("click", ".content-toolbar-top", function() {
    if ($(document).scrollTop() != 0) {
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 500);
    }
});

$(document).on("click", ".content-toolbar-feedback", function() {
    layer.open({
        title: [intl('97058' /* 意见反馈 */ ), 'font-size:18px;'],
        skin: 'feedback-body',
        type: 2,
        area: ['480px', '540px'], //宽高        
        content: '../Company/feedback.html' + location.search
    })
});

var Common = {
    shbdgServer: 'http://10.102.17.238:8022/', // 外部server
    is_overseas_config: false, //是否是来源overseas
    is_vip_config: false,
    is_svip_config: false,
    is_bs_config: false,
    is_ep_config: false,
    /*
     * 记录应用中 LocalStorage keys 集合.
     */
    localStorageMap: {
        commonfuntime: 'commonfuntime', // 记录导航栏下拉常用功能菜单的上次请求时间
        commonfunclist: 'commonfunclist', // 记录导航栏下拉常用功能菜单列表
        buryToNeed: 'buryToNeed', // 记录埋点信息
        commonUserNoteAgree: 'gel-commonUserNoteAgree' // 是否阅读并允许用户协议
    },
    addLinkForCompanyOrPerson: function(name, code, type) {
        var type = type ? type : "";
        if (name) {
            if (code) {
                return '<a class="go2Link wi-secondary-color wi-link-color" data-name="' + name + '" data-code="' + code + '"  data-type="' + type + '">' + name + '</a>'
            } else {
                return name;
            }
        } else {
            return "--";
        }
    },
    international: function() {
        // setTimeout(function() {
        //     if (window.wind && wind.langControl.lang !== 'zh') { //增加全部功能下拉页面的英文title
        //         var a_bolck = $('.all-fun-block').find('a');
        //         if (a_bolck) {
        //             for (var ai = 0; ai < a_bolck.length; ai++) {
        //                 var a_item = $('.all-fun-block').find('a')[ai];
        //                 var a_title = $(a_item).attr('langkey');
        //                 $(a_item).attr('title', intl(a_title));
        //             }
        //         }

        //         var tool_bolck = $('.toolbar-highpro-list').find('a');
        //         if (tool_bolck) {
        //             for (var aj = 0; aj < tool_bolck.length; aj++) {
        //                 var tool_item = $('.toolbar-highpro-list').find('a')[aj];
        //                 var tool_title = $(tool_item).attr('langkey');
        //                 $(tool_item).attr('title', intl(tool_title));
        //             }
        //         }
        //     }
        // }, 100)
        setTimeout(function() {
            $('#inputToolbarGlobalSearch').attr('placeholder', intl('209375' /* 请输入企业名称、公司编号、注册号等关键词 */ ));
        }, 100)
        $(document.body).addClass('wind-locale-' + wind.langControl.locale);
        Common.showToolBar();
        var regs = /customer\/index.html/; // a|b|c,  用|追加 
        var path = location.pathname || '';
        if (!regs.test(location.pathname)) {
            Common.getVipConfigs()
        }
        if (window.wind && window.wind.uri) {
            var lang = wind.uri(location.href).query('lang') || '';
            var langArg = (lang === 'en' ? 'en-US' : 'zh-CN');
            Common.sysLangReload(langArg);
        }
    },
    funcToolDic: function(funcItem) {
        //存放功能模块的dic
        var isCustomerHref = ""; //是不是在我的收藏等模块里，如果是的话就要注意相对路径。
        if (location.href.indexOf("\/customer\/") > 0) {
            isCustomerHref = "../Company/";
        }
        var allFuncDic = {
            '查企业': '<a class="wi-link-color company-icon" data-ori="查企业" target="_blank" href="' + isCustomerHref + 'SearchHome.html?type=company" title="' + intl('225311', '查企业') + '"><span class="show-item-span">' + intl('225311', '查企业') + '</span></a>',
            '查人物': '<a class="wi-link-color people-icon" data-ori="查人物" target="_blank" href="' + isCustomerHref + 'SearchHome.html?type=people" langkey="138432" title="' + intl('138432', '查人物') + '"><span class="show-item-span">' + intl('138432', '查人物') + '</span></a>',
            // '查新闻': '<a class="wi-link-color news-icon" data-ori="查新闻" target="_blank" href="' + isCustomerHref + 'SearchHome.html?type=news" langkey="" title="' + intl('222409', '查新闻') + '"><span class="show-item-span">' + intl('222409', '查新闻') + '</span></a>',
            '查关系': '<a class="wi-link-color relation-icon" data-ori="查关系" target="_blank" href="' + isCustomerHref + 'SearchHome.html?type=relation" langkey="138484" title="' + intl('138484', '查关系') + '"><span class="show-item-span">' + intl('138484', '查关系') + '</span></a>',
            '全球企业': '<a class="wi-link-color icon-global-company" data-ori="全球企业" target="_blank" href="' + isCustomerHref + 'GlobalSearch.html" langkey="" title="' + intl('225375', '查海外企业') + '"><span class="show-item-span">' + intl('225375', '海外企业') + '</span></a>',

            '风险': '<a class="wi-link-color quest-risk-icon" data-ori="风险" target="_blank" href="' + isCustomerHref + 'SearchHome.html?type=risk" langkey="" title="' + intl('222404', '查风险') + '"><span class="show-item-span">' + intl('222404', '查风险') + '</span></a>',
            '裁判文书': '<a class="wi-link-color judgment-icon" data-ori="裁判文书" target="_blank" href="' + isCustomerHref + 'SearchJudgement.html" langkey="138731" title="' + intl('138731', '裁判文书') + '"><span class="show-item-span">' + intl('138731', '裁判文书') + '</span></a>',
            // '失信人': '<a class="wi-link-color dishonest-icon" data-ori="失信人" target="_blank" href="' + isCustomerHref + 'SearchLaw.html?type=dishonest" langkey="151233" title="' + intl('151233', '失信人') + '"><span class="show-item-span">' + intl('151233', '失信人') + '</span></a>',
            // '被执行人': '<a class="wi-link-color executee-icon" data-ori="被执行人" target="_blank" href="' + isCustomerHref + 'SearchLaw.html?type=executee" langkey="138592" title="' + intl('138592', '被执行人') + '"><span class="show-item-span">' + intl('138592', '被执行人') + '</span></a>',
            // '法院公告': '<a class="wi-link-color court-icon" data-ori="法院公告" target="_blank" href="' + isCustomerHref + 'SearchLaw.html?type=court" langkey="138226" title="' + intl('138226', '法院公告') + '"><span class="show-item-span">' + intl('138226', '法院公告') + '</span></a>',
            // '开庭公告': '<a class="wi-link-color open-notice-icon" data-ori="开庭公告" target="_blank" href="' + isCustomerHref + 'SearchLaw.html?type=openNotice" langkey="138657" title="' + intl('138657', '开庭公告') + '"><span class="show-item-span">' + intl('138657', '开庭公告') + '</span></a>',
            // '司法拍卖': '<a class="wi-link-color judicial-icon" data-ori="司法拍卖" target="_blank" href="' + isCustomerHref + 'SearchLaw.html?type=judicial" langkey="138359" title="' + intl('138359', '司法拍卖') + '"><span class="show-item-span">' + intl('138359', '司法拍卖') + '</span></a>',

            // '知识产权': '<a class="wi-link-color knowQ-icon" data-ori="知识产权" target="_blank" href="' + isCustomerHref + 'SearchOther.html?type=brand" langkey="" title="' + intl('120665', '知识产权') + '"><span class="show-item-span">' + intl('120665', '知识产权') + '</span></a>',
            '商标': '<a class="wi-link-color brand-icon" data-ori="商标" target="_blank" href="' + isCustomerHref + 'SearchBrand.html" langkey="203988" title="' + intl('138799', '商标') + '"><span class="show-item-span">' + intl('138799', '商标') + '</span></a>',
            '招投标': '<a class="wi-link-color bid-icon  new-func-icon" data-ori="招投标" target="_blank" href="' + isCustomerHref + 'SearchBid.html"  title="' + intl('149179', '招投标') + '"><span class="show-item-span">' + intl('149179', '招投标') + '</span></a>',
            '专利': '<a class="wi-link-color patent-icon" data-ori="专利" target="_blank" href="' + isCustomerHref + 'SearchPatent.html"  title="' + intl('138749', '专利') + '"><span class="show-item-span">' + intl('138749', '专利') + '</span></a>',
            // '作品著作权': '<a class="wi-link-color work-icon" data-ori="作品著作权" target="_blank" href="' + isCustomerHref + 'SearchOther.html?type=work" langkey="138756" title="' + intl('138756', '作品著作权') + '"><span class="show-item-span">' + intl('138756', '作品著作权') + '</span></a>',
            // '软件著作权': '<a class="wi-link-color soft-icon" data-ori="软件著作权" target="_blank" href="' + isCustomerHref + 'SearchOther.html?type=soft" langkey="138788" title="' + intl('138788', '软件著作权') + '"><span class="show-item-span">' + intl('138788', '软件著作权') + '</span></a>',

            // '项目品牌': '<a class="wi-link-color productQ-icon" data-ori="项目品牌" target="_blank" href="' + isCustomerHref + 'SearchProduct.html?type=project" langkey="" title="' + intl('209003', '项目品牌') + '"><span class="show-item-span">' + intl('209003', '项目品牌') + '</span></a>',
            // '项目': '<a class="wi-link-color query-project-icon" data-ori="项目" target="_blank" href="' + isCustomerHref + 'SearchProduct.html?type=project" langkey="209004" title="' + intl('209004', '查项目') + '"><span class="show-item-span">' + intl('209004', '查项目') + '</span></a>',
            // '品牌': '<a class="wi-link-color query-brand-icon" data-ori="品牌" target="_blank" href="' + isCustomerHref + 'SearchProduct.html?type=make" langkey="209005" title="' + intl('209005', '查品牌') + '"><span class="show-item-span">' + intl('209005', '查品牌') + '</span></a>',
            // '产品': '<a class="wi-link-color query-product-icon" data-ori="产品" target="_blank" href="' + isCustomerHref + 'SearchProduct.html?type=product" langkey="209006" title="' + intl('209006', '查产品') + '"><span class="show-item-span">' + intl('209006', '查产品') + '</span></a>',

            '批量导出': '<a class="wi-link-color batch-output-icon" data-ori="批量导出" target="_blank" href="' + isCustomerHref + 'BatchOutput.html"  langkey="145880" title="' + intl('225300', '批量导出') + '"><span class="show-item-span">' + intl('225300', '批量导出') + '</span></a>',
            '批量查询': '<a class="wi-link-color batch-search-icon" data-ori="批量查询" target="_blank" href="' + isCustomerHref + 'BatchSearch.html" langkey="141998" title="' + intl('141998', '批量查询') + '"><span class="show-item-span">' + intl('141998', '批量查询') + '</span></a>',
            '高级搜索': '<a class="wi-link-color advanced-search-icon" data-ori="高级搜索" target="_blank" href="' + isCustomerHref + 'AdvancedSearch02.html" langkey="67913" title="' + intl('225308', '企业筛选') + '"><span class="show-item-span">' + intl('225308', '企业筛选') + '</span></a>',
            '企业全景': '<a class="wi-link-color company-statistics-icon" data-ori="企业全景" target="_blank" href="' + isCustomerHref + 'CompanyStatistics.html" langkey="138675" title="' + intl('225376', '地区产业全景') + '"><span class="show-item-span">' + intl('225376', '产业全景') + '</span></a>',
            '竞争情报': '<a class="wi-link-color netcomper-icon" data-ori="竞争情报" target="_blank" href="' + isCustomerHref + 'specialApp.html?page=netcomper" langkey="141996" title="' + intl('225307', '投资赛道') + '"><span class="show-item-span">' + intl('225307', '投资赛道') + '</span></a>',
            // '图谱平台': '<a class="wi-link-color chartplathome-icon" data-ori="图谱平台" target="_blank" href="' + isCustomerHref + 'ChartPlatHome.html" langkey="138167" title="' + intl('138167', '图谱平台') + '"><span class="show-item-span">' + intl('138167', '图谱平台') + '</span></a>',
            '企业风控': '<a class="wi-link-color risk-icon buryClick" data-ori="企业风控" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="riskOverview" data-buryModule="toolBar" target="_blank" href="//windcloudnote/wind.ent.risk/index.html" langkey="138586" title="' + intl('225374', '企业风控') + '"><span class="show-item-span">' + intl('225374', '企业风控') + '</span></a>',
            // '招聘': '<a class="wi-link-color job-icon" data-ori="招聘" target="_blank" href="' + isCustomerHref + 'SearchJob.html" langkey="205523" title="' + intl('205523', '招聘查询') + '"><span class="show-item-span">' + intl('205523', '招聘查询') + '</span></a>',

            '科创板': '<a class="wi-link-color stboard-icon" data-ori="科创板" target="_blank" href="' + isCustomerHref + 'specialAppList.html#stboard" langkey="132402" title="' + intl('225313', '科创板') + '"><span class="show-item-span">' + intl('225313', '科创板') + '</span></a>',
            '新三板': '<a class="wi-link-color tnb-icon" data-ori="新三板" target="_blank" href="' + isCustomerHref + 'specialAppList.html#tnb" langkey="104962" title="' + intl('104962', '新三板') + '"><span class="show-item-span">' + intl('104962', '新三板') + '</span></a>',
            '上市企业': '<a class="wi-link-color ipo-icon" data-ori="上市企业" target="_blank" href="' + isCustomerHref + 'specialAppList.html#ipo" langkey="142006" title="' + intl('225303', '上市企业') + '"><span class="show-item-span">' + intl('225303', '上市企业') + '</span></a>',
            '发债企业': '<a class="wi-link-color debt-icon" data-ori="发债企业" target="_blank" href="' + isCustomerHref + 'specialAppList.html#debt" langkey="59563" title="' + intl('225310', '发债企业') + '"><span class="show-item-span">' + intl('225310', '发债企业') + '</span></a>',
            '新四板': '<a class="wi-link-color four-broad-icon" data-ori="新四板" target="_blank" href="' + isCustomerHref + 'specialAppList.html#nfe" langkey="207791" title="' + intl('207791', '新四板') + '"><span class="show-item-span">' + intl('207791', '新四板') + '</span></a>',
            'P2P大全': '<a class="wi-link-color p2p-icon" data-ori="P2P大全" target="_blank" href="' + isCustomerHref + 'specialAppList.html#p2p" langkey="207793" title="' + intl('225301', 'P2P大全') + '"><span class="show-item-span">' + intl('225301', 'P2P大全') + '</span></a>',
            // '投资机构': '<a class="wi-link-color invest-icon buryClick" data-ori="投资机构" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="PEVCExpress" data-buryModule="toolBar" target="_blank" href="//psmsserver/InvestmentBank/PEVC/PEVCExpress.aspx?page=c" langkey="138727" title="' + intl('138727', '投资机构') + '"><span class="show-item-span">' + intl('138727', '投资机构') + '</span></a>',
            // '500强企业': '<a class="wi-link-color five-hundred-icon buryClick" data-ori="500强企业" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="500Companys" data-buryModule="toolBar" target="_blank" href="//erdbserver/erdb/SearchNew.aspx?type=1&code=90000258&lan=cn" langkey="" title="' + intl('214862', '500强企业') + '"><span class="show-item-span">' + intl('222985', '500强') + '</span></a>',
            // '公募基金': '<a class="wi-link-color public-icon buryClick " data-ori="公募基金" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="publicFudn" data-buryModule="toolBar"  target="_blank" langkey="" title="' + intl('89391', '公募基金') + '"><span class="show-item-span">' + intl('89391', '公募基金') + '</span></a>',
            // '私募基金': '<a class="wi-link-color private-icon buryClick" data-ori="私募基金" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="privateFudn" data-buryModule="toolBar" target="_blank" langkey="" title="' + intl('119142', '私募基金') + '"><span class="show-item-span">' + intl('119142', '私募基金') + '</span></a>',
            '银行': '<a class="wi-link-color bank-icon" data-ori="银行" target="_blank" langkey="" href="' + isCustomerHref + 'specialAppList.html#bank"  title="' + intl('35063', '银行') + '"><span class="show-item-span">' + intl('35063', '银行') + '</span></a>',
            '保险公司': '<a class="wi-link-color insurance-icon" data-ori="保险公司" target="_blank" href="' + isCustomerHref + 'specialAppList.html#insurance" langkey="" title="' + intl('225304', '保险公司') + '"><span class="show-item-span">' + intl('225304', '保险公司') + '</span></a>',
            '证券公司': '<a class="wi-link-color stock-icon" data-ori="证券公司" target="_blank" href="' + isCustomerHref + 'specialAppList.html#stock" langkey="" title="' + intl('225314', '证券公司') + '"><span class="show-item-span">' + intl('225314', '证券公司') + '</span></a>',
            '基金公司': '<a class="wi-link-color offered-icon" data-ori="基金公司" target="_blank" href="' + isCustomerHref + 'specialAppList.html#offered" langkey="" title="' + intl('225312', '基金公司') + '"><span class="show-item-span">' + intl('225312', '基金公司') + '</span></a>',
            '期货公司': '<a class="wi-link-color future-icon" data-ori="期货公司" target="_blank" href="' + isCustomerHref + 'specialAppList.html#future" langkey="" title="' + intl('211609', '期货公司') + '"><span class="show-item-span">' + intl('211609', '期货公司') + '</span></a>',

            // '园区大全': '<a class="wi-link-color park-icon buryClick new-func-icon" data-ori="园区大全" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="parkAll" data-buryModule="toolBar"   title="' + intl('208892', '园区大全') + '"><span class="show-item-span">' + intl('208892', '园区大全') + '</span></a>',
            // '融资事件': '<a class="wi-link-color financing-icon buryClick" data-ori="融资事件" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="PEVCMoney" data-buryModule="toolBar" target="_blank" langkey="112360" href="//psmsserver/InvestmentBank/PEVC/PEVCExpress.aspx?page=a" title="' + intl('112360', '融资事件') + '"><span class="show-item-span">' + intl('112360', '融资事件') + '</span></a>',
            '地图查询': '<a class="wi-link-color searchmap-icon buryClick new-func-icon" data-ori="地图查询" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="mapQuery" data-buryModule="toolBar" target="_blank" langkey="" href="https://GOVWebSite/govmap/?title=万寻地图&right=4C203DE15" title="' + intl('225309', '万寻地图') + '"><span class="show-item-span">' + intl('225309', '万寻地图') + '</span></a>',
            '全部功能': '<span class="toobar-findFunc-title"><a target="_blank" href="' + isCustomerHref + 'allFunction.html"><span>' + intl('222416', '查看全部功能') + '</span>&gt;&gt;&gt;</a></span>',
            '政策法规': '<a class="wi-link-color policy-icon new-func-icon" data-ori="政策法规" target="_blank" href="' + isCustomerHref + 'SearchPolicy.html"   title="' + intl('69696', '政策法规') + '"><span class="show-item-span">' + intl('69696', '政策法规') + '</span></a>',
            '超级名单': '<a class="wi-link-color super-list-icon new-func-icon" data-ori="超级名单" target="_blank" href="' + isCustomerHref + 'SuperAdvancedSearch.html"   title="' + intl('222402', '超级名单') + '"><span class="show-item-span">' + intl('222402', '超级名单') + '</span></a>',
            'API': '<a class="wi-link-color api-icon" data-ori="API" target="_blank" href="http://corpeventserver/wind.ent.risk/apihelp/index.html"   title="API"><span class="show-item-span">' + 'API' + '</span></a>',
            '集团系': '<a class="wi-link-color group-icon new-func-icon" data-ori="集团系" target="_blank" href="' + isCustomerHref + 'SearchGroupDepartment.html"   title="' + intl('148622', '集团系') + '"><span class="show-item-span">' + intl('148622', '集团系') + '</span></a>',

            // '查老赖': '<a class="wi-link-color search-dishonesty-icon" data-ori="查老赖" target="_blank" href="' + isCustomerHref + 'SearchDishonesty.html"   title="' + intl('', '查老赖') + '"><span class="show-item-span">' + intl('', '查老赖') + '</span></a>',
            // '反洗钱': '<a class="wi-link-color anti-money-icon" data-ori="反洗钱" target="_blank" href="' + isCustomerHref + 'AntiMoneyLaunder.html"   title="' + intl('', '反洗钱') + '"><span class="show-item-span">' + intl('', '反洗钱') + '</span></a>',
            // '海外风险企业': '<a class="wi-link-color global-risk-icon" data-ori="海外风险企业" target="_blank" href="' + isCustomerHref + 'specialAppList.html#realCorps"   title="海外风险企业"><span class="show-item-span">风险企业</span></a>'
        }
        return allFuncDic[funcItem];
    },
    showToolBar: function() {
        //头部toolbar共用,头部有id  toolBar自动调用
        var arr = [];
        var isSuperBar = 0;
        var isChartPlatBar = 0;
        var isCustomerHref = ""; //是不是在我的收藏等模块里，如果是的话就要注意相对路径。
        var isHome = false; //兼容首页与其他页面样式
        if (location.href.indexOf("\/customer\/") > 0) {
            isCustomerHref = "../Company/";
        }
        if (/SuperAdvancedSearch.html/i.test(location.href)) {
            isSuperBar = 1;
        }
        if (/ChartPlatForm.html/i.test(location.href)) {
            isChartPlatBar = 1;
        }
        if (location.href.indexOf("SearchHome.html") > 0) {
            isHome = true;
        }
        var toolHomeClass = isHome ? 'toolbar-link-color-all' : '';
        var toolHomeTop = isHome ? 'tool-top-home' : '';
        if (isSuperBar) {
            arr.push('<a class="toolbar-logo" target="_blank" href="' + isCustomerHref + 'SearchHome.html"> <span class="toolbar-super-span"></span> </a>');
        } else if (isChartPlatBar) {
            arr.push('<a class="toolbar-logo" target="_blank" href="' + isCustomerHref + 'SearchHome.html"></a><div class="nav-tabs" style="display:inline-block;float: left;"><div class="nav-block"><div class="menu-title"><a id="linkGLLJ" href="#chart_gllj" class="wi-link-color" langkey="">关联关系</a><div class="menu-title-underline "></div></div></div><div class="nav-block"><div class="menu-title"><a id="linkGQGL" href="#chart_gqgl" class="wi-link-color" langkey="">持股路径</a><div class="menu-title-underline "></div></div></div></div> ');
        } else {
            arr.push('<a class="toolbar-logo" target="_blank" href="' + isCustomerHref + 'SearchHome.html"></a>');
        }
        //不显示头部input的页面
        var noToolbarSearchArr = ["BatchCredit.html", "AdvancedSearch02.html", "SuperAdvancedSearch.html", "searchHome.html", "SearchHome.html", "SearchLaw.html", "SearchOther.html", "BatchSearch.html", "BatchOutput.html", "CompanyStatistics.html", "GlobalSearch.html", "updateLog.html", "uploadList.html", "SearchOtherDetail.html", "uploadListOutput.html", "allFunction.html", "SearchJob.html", "VersionPrice.html", 'SearchProduct.html', 'showItemDetail.html', 'SearchPolicy.html', 'SearchJudgement.html', 'SearchPatent.html', 'SearchBrand.html', 'ChartPlatForm.html', 'searchGroupDepartment.html', 'SearchDishonesty.html', 'AntiMoneyLaunder.html', 'Group.html'];
        var isShowToolbarSearch = true; //是否显示头部input,默认显示
        for (var i = 0; i < noToolbarSearchArr.length; i++) {
            var reg = new RegExp(noToolbarSearchArr[i], 'i');
            if (location.pathname && reg.test(location.pathname)) {
                isShowToolbarSearch = false;
            }
        }
        if (isShowToolbarSearch) {
            if (Common.getUrlSearch("type") == "country" || location.href.indexOf("CompanyGlobal.html") >= 0) {
                arr.push('<div class="toolbar-search"><input type="text" autocomplete="off" placeholder="请输入企业名称、公司编号、注册号等关键词" class="input-toolbar-search" id="inputToolbarGlobalSearch" /><span id="btnToolbarSearchGlobal" class="input-toolbar-button"></span><div class="input-toolbar-search-list"></div><div class="input-toolbar-before-search"></div></div>');
            } else if (location.href.indexOf("SearchAloneList.html") >= 0) {
                var type = Common.getUrlSearch("type");
                if (type == "patentAlone") {
                    arr.push('<div class="toolbar-search toolbar-search-alone"><input type="text" autocomplete="off" placeholder="请输入专利名称、申请号或申请人名称" class="input-toolbar-search" id="inputToolbarSearchPatent" /><span id="btnToolbarSearchPatent" class="input-toolbar-button"></span><div class="input-toolbar-search-list"></div><div class="input-toolbar-before-search"></div></div>');
                } else if (type == "brandAlone") {
                    arr.push('<div class="toolbar-search toolbar-search-alone"><input type="text" autocomplete="off" placeholder="请输入商标名称、注册号或申请人名称" class="input-toolbar-search" id="inputToolbarSearchBrand" /><span id="btnToolbarSearchBrand" class="input-toolbar-button"></span><div class="input-toolbar-search-list"></div><div class="input-toolbar-before-search"></div></div>');
                } else if (type == "dishonestAlone") {
                    arr.push('<div class="toolbar-search toolbar-search-alone"><input type="text" autocomplete="off" placeholder="请输入公司名、姓名等关键字" class="input-toolbar-search" id="inputToolbarSearchDishonesty" /><span id="btnToolbarSearchDishonesty" class="input-toolbar-button"></span><div class="input-toolbar-search-list"></div><div class="input-toolbar-before-search"></div></div>');
                } else {
                    arr.push('<div class="toolbar-search toolbar-search-alone"><input type="text" autocomplete="off" placeholder="请输入公司、人名、案号等关键词" class="input-toolbar-search" id="inputToolbarSearchJudge" /><span id="btnToolbarSearchJudge" class="input-toolbar-button"></span><div class="input-toolbar-search-list"></div><div class="input-toolbar-before-search"></div></div>');
                }

            } else {
                arr.push('<div class="toolbar-search"><input type="text" autocomplete="off" placeholder="请输入公司、人名、品牌、企业特征等关键词" class="input-toolbar-search" id="inputToolbarSearch" /><span id="btnToolbarSearch" class="input-toolbar-button"></span><div class="input-toolbar-search-list"></div><div class="input-toolbar-before-search"></div></div>');
            }
        }
        //new
        // if (!isSuperBar) {
        //     arr.push('<a class="toolbar-super wi-link-color" target="_blank" href="' + isCustomerHref + 'SuperAdvancedSearch.html' + '">' + intl('222402', '超级名单') + '</a>');
        // }
        arr.push('<div class="toolbar-highpro" style="display:none;" >')
        arr.push('<span class="toolbar-all ' + toolHomeClass + '" langkey="203985">' + intl('203985', '全部功能') + '</span>');
        arr.push('<div class="toolbar-highpro-list ' + toolHomeTop + '">');
        arr.push('<span class="toobar-function-title" ><b langkey="">' + intl('69882', '常用功能') + '</b></span>');
        //常用功能=>todo设置默认
        arr.push('<div id="commonFuncPoint">');
        arr.push(Common.funcToolDic('裁判文书'));
        arr.push(Common.funcToolDic('专利'));
        arr.push(Common.funcToolDic('商标'));
        arr.push(Common.funcToolDic('政策法规'));
        arr.push(Common.funcToolDic('企业风控'));
        arr.push(Common.funcToolDic('企业全景'));
        arr.push(Common.funcToolDic('竞争情报'));
        arr.push(Common.funcToolDic('高级搜索'));
        arr.push(Common.funcToolDic('地图查询')); //地图查询
        arr.push(Common.funcToolDic('超级名单'));
        arr.push(Common.funcToolDic('批量查询'));
        arr.push(Common.funcToolDic('批量导出'));
        arr.push('</div>');
        arr.push('<span class="toobar-function-title title-one showalltit" ><b class="fl">' + intl('203985', '全部功能') + '</b><span class="fr wi-link-color navshowmore">' + intl('138737', '查看更多') + '>></span></span>');
        arr.push('<span class="toobar-second-title second-t1"><i>' + intl('223895', '综合查询') + '</i></span>');
        arr.push('<div class="uitlFunc">');
        arr.push(Common.funcToolDic('查企业'));
        arr.push(Common.funcToolDic('查人物'));
        arr.push(Common.funcToolDic('风险'));
        // arr.push(Common.funcToolDic('查新闻'));
        arr.push(Common.funcToolDic('查关系'));
        arr.push(Common.funcToolDic('全球企业'));
        arr.push('</div>');
        arr.push('<span class="toobar-second-title second-t1" ><i>' + intl('223893', '专项数据') + '</i></span>');
        arr.push('<div class="uitlFunc">');
        arr.push(Common.funcToolDic('裁判文书'));
        // arr.push(Common.funcToolDic('查老赖'));
        arr.push(Common.funcToolDic('专利'));
        arr.push(Common.funcToolDic('商标'));
        arr.push(Common.funcToolDic('招投标'));
        arr.push(Common.funcToolDic('政策法规'));
        arr.push(Common.funcToolDic('集团系'));
        arr.push('</div>');
        arr.push('<span class="toobar-second-title second-t1" ><i>' + intl('223894', '专项应用') + '</i></span>');
        arr.push('<div class="uitlFunc">');
        arr.push(Common.funcToolDic('企业风控'));
        // arr.push(Common.funcToolDic('反洗钱'));
        arr.push(Common.funcToolDic('企业全景'));
        arr.push(Common.funcToolDic('竞争情报'));
        //arr.push(Common.funcToolDic('竞争情报'));
        //arr.push(Common.funcToolDic('图谱平台'));
        //arr.push(Common.funcToolDic('API'));
        arr.push('</div>');
        arr.push('<span class="toobar-second-title second-t1" ><i>' + intl('223899', '数据应用') + '</i></span>');
        arr.push('<div class="uitlFunc">');
        arr.push(Common.funcToolDic('高级搜索'));
        arr.push(Common.funcToolDic('地图查询'));
        arr.push(Common.funcToolDic('超级名单'));
        arr.push(Common.funcToolDic('批量查询'));
        arr.push(Common.funcToolDic('批量导出'));
        //arr.push(Common.funcToolDic('竞争情报'));
        //arr.push(Common.funcToolDic('图谱平台'));
        arr.push(Common.funcToolDic('API'));
        arr.push('</div>');

        // arr.push(Common.funcToolDic(''));//地图查询
        arr.push('<span class="toobar-second-title second-t1"><i>' + intl('141997', '特色企业库') + '</i></span>');
        arr.push('<div class="uitlFunc">');
        // arr.push(Common.funcToolDic('科创板'));
        // arr.push(Common.funcToolDic('新三板'));
        // arr.push(Common.funcToolDic('上市企业'));
        // arr.push(Common.funcToolDic('发债企业'));
        arr.push(Common.funcToolDic('P2P大全'));
        // arr.push(Common.funcToolDic('500强企业'));
        // arr.push(Common.funcToolDic('海外风险企业'));
        // arr.push(Common.funcToolDic('投资机构'));
        arr.push('</div>');
        // arr.push('<span class="toobar-second-title second-t1" langkey=""><i>' + intl('207797', '特色内容库') + '</i></span>');
        // arr.push('<div class="uitlFunc">');
        // arr.push(Common.funcToolDic('园区大全'));
        // arr.push(Common.funcToolDic('融资事件'));
        // arr.push('</div>');
        // arr.push(Common.funcToolDic('全部功能'));

        $("#toolBar").html(arr.join(""));
        if (isShowToolbarSearch) {
            if (Common.getUrlSearch("type") != "country" && location.href.indexOf("CompanyGlobal.html") < 0) {
                Common.getHistory();
            }
            Common.addNavFn();
        }
        var paramFunc = { PageSize: 200, PageNo: 0, sysType: 'windClient' }
            // 这里将数据存储到localStorage中，4小时更新一次
        var nowTime = new Date();
        var nowTimestamp = nowTime.getTime();
        var needQuery = true;
        try {
            var regexPage = /[http|https]:\/\/[^/]+\/[^/]+\/([\S]+)\.html/;
            var noPostHtml = location.href.match(regexPage) ? location.href.match(regexPage)[1].split('/') : null;
            var noPostPage = noPostHtml ? noPostHtml[noPostHtml.length - 1].toLowerCase() : null;
            var noPostArr = ['companyrp', 'gqctrp', 'personrp'];
            if (noPostArr.indexOf(noPostPage) != -1) {
                return false;
            }
        } catch (error) {}
        // 没有时间缓存，写缓存然后请求数据，继而更新缓存时间
        // 有缓存 读缓存，失败请求数据
        var localCommonFunTime = window.localStorage.getItem(Common.localStorageMap.commonfuntime);
        var localCommonFunList = window.localStorage.getItem(Common.localStorageMap.commonfunclist);

        if (!localCommonFunList) {
            getcommonfunc(paramFunc);
            return;
        } else {
            if (!localCommonFunTime) {
                window.localStorage.setItem(Common.localStorageMap.commonfuntime, nowTimestamp);
            } else {
                try {
                    var oldTime = parseInt(localCommonFunTime);
                    var totalTime = (nowTimestamp - oldTime) / 1000;
                    var dayValue = parseInt(totalTime / (24 * 60 * 60)); //相差整数天数
                    var afterDay = totalTime - dayValue * 24 * 60 * 60; //取得减去天数后剩余的秒数
                    var hourValue = parseInt(afterDay / (60 * 60));
                    if (hourValue >= 4) { //4个小时重新获取一次
                        needQuery = true;
                    } else {
                        needQuery = false;
                    }
                } catch (e) {
                    needQuery = true;
                }
            }
        }
        if (needQuery) {
            getcommonfunc(paramFunc);
        } else {
            try {
                var funcItem = localCommonFunList ? JSON.parse(localCommonFunList) : null;
                if (!funcItem) {
                    getcommonfunc(paramFunc);
                    return;
                }
                var resultArr = [];
                for (var fi in funcItem) {
                    try {
                        if (resultArr.length > 11) {
                            continue;
                        }
                        if (Common.funcToolDic(funcItem[fi])) {
                            if ($('#commonFuncPoint').find('a[data-ori="' + funcItem[fi] + '"]').length > 0) {
                                $('#commonFuncPoint').find('a[data-ori="' + funcItem[fi] + '"]').remove();
                            }
                            resultArr.push(Common.funcToolDic(funcItem[fi]));
                        }
                    } catch (error) {
                        continue;
                    }
                }
                if (resultArr.length != 0) {
                    $('#commonFuncPoint').prepend(resultArr.join(''));
                    if ($('#commonFuncPoint').children().length > 12) {
                        $('#commonFuncPoint').children().eq(11).nextAll().remove()
                    }
                }
            } catch (e) {
                getcommonfunc(paramFunc);
            }
        }

        function getcommonfunc(paramFunc) {
            myWfcAjax('getcommonfunc', paramFunc, function(data) {
                var resData = JSON.parse(data);
                if (resData.ErrorCode == "0" && resData.Data && resData.Data.length > 0) {
                    var funcItem = resData.Data;
                    var resultArr = [];
                    try {
                        for (var fi in funcItem) {
                            try {
                                if (resultArr.length > 11) {
                                    continue;
                                }
                                if (Common.funcToolDic(funcItem[fi].moduleKey)) {
                                    if ($('#commonFuncPoint').find('a[data-ori="' + funcItem[fi] + '"]').length > 0) {
                                        $('#commonFuncPoint').find('a[data-ori="' + funcItem[fi] + '"]').remove();
                                    }
                                    resultArr.push(Common.funcToolDic(funcItem[fi].moduleKey));
                                }
                            } catch (error) {
                                continue;
                            }
                        }
                        if (resultArr.length != 0) {
                            $('#commonFuncPoint').prepend(resultArr.join(''));
                            if ($('#commonFuncPoint').children().length > 12) {
                                $('#commonFuncPoint').children().eq(11).nextAll().remove()
                            }
                        }
                        var commonFuncList = [];
                        for (var fii in funcItem) {
                            //存储到commonFuncList
                            commonFuncList.push(funcItem[fii].moduleKey);
                        }
                        window.localStorage.setItem(Common.localStorageMap.commonfuntime, nowTimestamp);
                        window.localStorage.setItem(Common.localStorageMap.commonfunclist, JSON.stringify(commonFuncList));
                    } catch (e) {
                        window.localStorage.setItem(Common.localStorageMap.commonfuntime, '');
                        window.localStorage.setItem(Common.localStorageMap.commonfunclist, '');
                    }
                } else {
                    window.localStorage.setItem(Common.localStorageMap.commonfuntime, '');
                    window.localStorage.setItem(Common.localStorageMap.commonfunclist, '');
                }
            }, function() {
                window.localStorage.setItem(Common.localStorageMap.commonfuntime, '');
                window.localStorage.setItem(Common.localStorageMap.commonfunclist, '');
            });
        }
    },
    onMore: function(CMDID, URCNAME) {
        //私募基金
        var wftVersion = Common.getWFTVersion();
        if (wftVersion >= 193173848) {
            window.location.href = '!CommandParam(' + CMDID + ',ACT=SelectReport,NID=0,URCNAME=' + URCNAME + ')';
        } else {
            window.location.href = '!CommandFunc(ExecuteCmd(CMDID=' + CMDID + ');SelectReport(URCNAME=' + URCNAME + '))';
        }
    },
    getHistory: function() {
        myWfcAjax("gethistorykey", { pcstatus: "0" }, function(data) {
            var res = JSON.parse(data);
            var storageHtml = [];
            var focusHtml = [];
            var listClass = '';
            if (res.ErrorCode == 0 && res.Data && res.Data[0]) {
                var len = res.Data[0]['HotWord'] ? res.Data[0]['HotWord'].length : 0;
                historySearchList = res.Data[0]['HotWord'] ? res.Data[0]['HotWord'] : [];
                for (var i = 0; i < len && i < 5; i++) {
                    var eachData = res.Data[0]['HotWord'][i]['keyword'];
                    storageHtml.push("<span class='search_li'><a href='#' title='" + eachData + "'>" + eachData.substring(0, 13) + "</a></span>");
                }
                $("#historyKeyword").find("div").html(storageHtml.join(""));
            }
            if (res.ErrorCode == 0) {
                var len = res.Data[0]['CompanyName'].length;
                if (len == 0) {
                    focusHtml.push('<div class="no-histry">' + intl('176604' /*暂无最近浏览记录*/ ) + '</div>');
                    $("#historyFocusList").find("#FocusHistroy").html(focusHtml);
                    $("#ModelHistory").hide();
                } else {
                    for (var i = 0; i < len && i < 10; i++) {
                        listClass = (i + 1) % 2 ? 'history_list' + ' listColor' : 'history_list';
                        var historyData = res.Data[0]['CompanyName'][i];
                        if (historyData['keyword'] == null) {
                            continue;
                        }
                        //bury
                        var buryParam = "data-buryfuncType='detailView' " + "data-buryModule='hisViewCom'";
                        focusHtml.push("<li  class='" + listClass + "'><a class='wi-link-color' href='#' title='" + historyData['keyword'] + "' ccode='" + historyData['companycode'] + "' cid='" + historyData['companyid'] + "' " + buryParam + ">" + historyData['keyword'] + "</a><span class='del-history buryClick' data-code='" + historyData['companycode'] + "' data-buryOpType='click' data-buryfuncType='hisViewDel' data-buryEntity='company' data-buryId='" + historyData['companycode'] + "'></span></li>");
                    }
                    $("#historyFocusList").find("#FocusHistroy").html(focusHtml.join(""));
                }

            }
        });
    },
    addNavFn: function() {
        $(document).on('focus', "#inputToolbarGlobalSearch,#inputToolbarSearch", function(event) {
            var target = event.target;
            event.preventDefault();
            var val = $.trim($(target).val());
            if (val) {
                // 显示预搜索
                val = val.trim();
                var len = Common.getByteLen(val);
                if (len >= 4) {
                    if (target.id == "inputToolbarGlobalSearch") {
                        var urlCoutry = Common.getUrlSearch("country");
                        var selCountry = $("#searchRaegionGlobal").find(".wi-secondary-color").attr("data-name") || urlCoutry;
                        var paramas = { "companyname": val, "type": selCountry, "pageNo": 0, "pageSize": 10, "sort": -1 };
                        Common.getPreGlobalSearch(paramas, function(res) {
                            var data = res.list || [];
                            // TODO 执行预搜索
                            var beforeSearchParent = $('.input-toolbar-before-search');
                            beforeSearchParent.addClass('active');
                            beforeSearchParent.html('');
                            if (!data.length) {
                                return;
                            }

                            for (var i = 0; i < data.length; i++) {
                                if (i > 4) {
                                    break;
                                }
                                var highLitKey = '';
                                var showSpan = '';
                                var corp_name = '';
                                var corName = '';
                                var ele = document.createElement('div');
                                for (itemKey in data[i].highlight) {
                                    switch (itemKey) {
                                        case 'corp_name':
                                            showSpan = '<span>企业名称匹配</span>';
                                            break;
                                        case 'former_name':
                                            showSpan = '<span>曾用名匹配</span>';
                                            break;
                                    }
                                    if (showSpan != "") {
                                        break;
                                    }
                                }
                                $(ele).addClass('before-search-div globe-pre-search')
                                corName = corp_name = data[i].corp_name;
                                ele.innerHTML = corp_name + showSpan;
                                $(ele).attr('data-code', data[i].corp_id);
                                $(ele).attr('data-name', corName);
                                $(ele).attr('data-country', selCountry);
                                $(ele).attr('data-buryModule', 'preSearch');
                                $(ele).attr('data-buryfuncType', 'preSearchCk');
                                $(ele).attr('data-buryNum', i + 1);
                                $(ele).attr('data-buryInput', val);
                                $(ele).attr('data-buryId', data[i].corp_id);
                                //                              $(ele).attr('data-buryfromPageUId', buryFCode.getPageUId());
                                beforeSearchParent.append(ele);
                            }
                        }, function() {
                            return $.trim($('#inputToolbarGlobalSearch').val());
                        });
                    } else {
                        Common.getPreSearch(val, function(res) {
                            var data = res.corplist || [];
                            var count = res.tagCount ? res.tagCount.tagCount : 0;
                            var tag = res.tagCount ? res.tagCount.tagName : val;
                            // TODO 执行预搜索
                            var beforeSearchParent = $('.input-toolbar-before-search');
                            beforeSearchParent.addClass('active');
                            beforeSearchParent.html('');
                            if (count) {
                                beforeSearchParent.html('<div class="before-search-key">查看全部<span class="wi-secondary-color">' + count + '</span>家具有<span class="wi-secondary-color">' + tag + '</span>特征的企业</div>');
                            }

                            if (!data.length) {
                                return;
                            }

                            for (var i = 0; i < data.length; i++) {
                                if (i > 4) {
                                    break;
                                }
                                var highTitle = '';
                                var highLitKey = '';
                                var highLight = '';
                                var corp_name = '';
                                var corName = '';
                                var ele = document.createElement('div');
                                // $(ele).addClass('before-search-div wi-link-color')
                                $(ele).addClass('before-search-div')

                                corName = corp_name = data[i].name;
                                if (data[i].highlight) {
                                    highLitKey = Object.keys(data[i].highlight)[0];
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
                                        highTitle = '债券名称';
                                        break;
                                    case 'bond_code':
                                        highTitle = '债券代码';
                                        break;
                                    case 'bond_wind_code':
                                        highTitle = '债券万得代码';
                                        break;
                                    case 'fund_name':
                                        highTitle = '基金名称';
                                        break;
                                    case 'fund_code':
                                        highTitle = '基金代码';
                                        break;
                                    case 'fund_wind_code':
                                        highTitle = '基金万得代码';
                                        break;
                                    case 'brand_name2':
                                        highTitle = intl('207813' /* 品牌 */ );
                                        break;
                                    case 'brand_name2_english':
                                        highTitle = '品牌英文名';
                                        break;
                                    case 'financing_institution':
                                        highTitle = '投资方';
                                        break;
                                    case 'project_name':
                                        highTitle = '项目名称';
                                        break;
                                    case 'beneficiaries':
                                        highTitle = '最终受益人';
                                        break;
                                    case 'corp_members':
                                        highTitle = intl('122202' /* 主要成员 */ );
                                        break;
                                    case 'stockholder_people':
                                        highTitle = intl('32959' /* 股东 */ );
                                        break;
                                    case 'eng_name':
                                        highTitle = '企业英文名';
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
                                        highTitle = '产品名称';
                                        break;
                                    case 'main_business':
                                        highTitle = intl('138753' /* 主营构成 */ )
                                        break;
                                    case 'software_copyright':
                                        highTitle = intl('138788' /* 软件著作权 */ );
                                        break;
                                    case 'park_name':
                                        highTitle = '园区名';
                                        break;
                                    case 'wechat_name':
                                        highTitle = '微信公众号名称';
                                        break;
                                    case 'wechat_code':
                                        highTitle = '微信公众号号码';
                                        break;
                                    case 'website_name':
                                        highTitle = '网站名称';
                                        break;
                                    case 'goods':
                                        highTitle = intl('138669' /* 商品/服务项目 */ );
                                        break;
                                    case 'online_load_product':
                                        highTitle = '网贷产品名';
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

                                if (highTitle) {
                                    highLight = '<span>' + highTitle + '匹配</span>';
                                }
                                ele.innerHTML = corp_name + highLight;
                                $(ele).attr('data-code', data[i].id);
                                $(ele).attr('data-name', corName);
                                //bury埋点参数
                                $(ele).attr('data-buryModule', 'preSearch');
                                $(ele).attr('data-buryfuncType', 'preSearchCk');
                                $(ele).attr('data-buryNum', i + 1);
                                $(ele).attr('data-buryInput', tag);
                                $(ele).attr('data-buryId', data[i].id);
                                $(ele).attr('data-buryStrategy', highLitKey);
                                //                              $(ele).attr('data-buryfromPageUId', buryFCode.getPageUId());
                                beforeSearchParent.append(ele);
                            }
                        }, function() {
                            return $.trim($('#inputToolbarSearch').val());
                        });
                    }
                }
            } else {
                if (!historySearchList.length) {
                    return;
                }

                var searchListParent = $('.input-toolbar-search-list');
                searchListParent.addClass('active');
                searchListParent.html('');
                if (target.id == "inputToolbarGlobalSearch") {
                    searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + '</div>');
                } else {
                    searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');
                }


                // <div>历史搜索 <span><i>X</i>清空</span></div>

                for (var i = 0; i < historySearchList.length; i++) {
                    if (i > 4) {
                        break;
                    }
                    var ele = document.createElement('div');
                    $(ele).addClass('search-list-div')
                    $(ele).text(historySearchList[i].keyword);
                    $(ele).attr('data-name', historySearchList[i].keyword);
                    $(ele).attr('data-match', historySearchList[i].is_fullmatch == 1 ? 1 : 0);
                    $(ele).attr('data-code', historySearchList[i].companycode || '');
                    $(ele).attr('data-buryInput', historySearchList[i].keyword); //bury历史搜索关键词
                    $(ele).attr('data-buryModule', 'histroySearch'); //bury历史搜索模块
                    $(ele).attr('data-buryfuncType', 'histroySearchCk'); //bury历史搜索模块
                    //                  $(ele).attr('data-buryfromPageUId', buryFCode.getPageUId());
                    if (historySearchList[i] && historySearchList[i].detail && historySearchList[i].detail) {
                        //区别全球企业和普通搜索，全球企业加了国家
                        var detailTmp = JSON.parse(historySearchList[i].detail);
                        countryTmp = detailTmp.region;
                        $(ele).attr('data-country', countryTmp || '');
                    }
                    searchListParent.append(ele);
                }
            }

            $(this).off('keydown').on('keydown', keydownFun)
            var inputEle = $(this);
            var listDiv = null;
            var listEle = null;

            $(this).parent().off('mouseover', '.search-list-div').on('mouseover', '.search-list-div', function(e) {
                listDiv = $(inputEle).nextAll('.active');
                listEle = $(listDiv).find('.search-list-div');
                $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
                $(this).addClass('key-down-sel')
                    // $(inputEle).val($(this).text());
                e.preventDefault();
            })

            $(this).parent().off('mouseover', '.before-search-div').on('mouseover', '.before-search-div', function(e) {
                listDiv = $(inputEle).nextAll('.active');
                listEle = $(listDiv).find('.before-search-div');
                $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
                $(this).addClass('key-down-sel')
                    // $(inputEle).val($(this).attr('data-name'));
                e.preventDefault();
            })

            $(this).parent().off("click").on('click', '.before-search-div', function(e) {
                var cls = '.before-search-div';
                listEle = $(listDiv).find(cls);
                if ($.trim($(inputEle).val())) {
                    var code = $(listEle).filter('.key-down-sel').attr('data-code');
                    if (code && $($(listDiv).find(cls)).attr('class').indexOf('globe-pre-search') != -1) {
                        var buryParam = $(listEle).filter('.key-down-sel').attr('data-pingParam') ? $(listEle).filter('.key-down-sel').attr('data-pingParam') : '';
                        var jumpCountry = '';
                        try {
                            jumpCountry = wind.uri(location.href)._params.country;
                        } catch (error) {
                            console.log(error);
                        }
                        Common.JumpfromCountry("Bu3", code, jumpCountry, buryParam)
                    } else if (code) {
                        var buryParam = $(listEle).filter('.key-down-sel').attr('data-pingParam') ? $(listEle).filter('.key-down-sel').attr('data-pingParam') : '';
                        Common.linkCompany('Bu3', code, null, null, buryParam); //bury
                    } else {
                        $('#btnToolbarSearch').trigger('click');
                    }
                }
            })

            function keydownFun(e) {
                var cls = '.search-list-div';
                listDiv = $(inputEle).nextAll('.active');
                listEle = $(listDiv).find(cls);
                if (!listEle.length) {
                    cls = '.before-search-div';
                    listEle = $(listDiv).find(cls);
                }

                var upDownClickNum = $(listEle).filter('.key-down-sel').length;

                switch (e.keyCode) {
                    case 38: //上                                            
                        if (upDownClickNum < 1) {
                            $(listEle).last().addClass('key-down-sel');
                        } else {
                            $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                                .prev().filter(cls).addClass("key-down-sel")
                        }
                        if (cls == '.search-list-div') {
                            $(inputEle).val($(listEle).filter('.key-down-sel').attr('data-name'));
                        }
                        e.preventDefault();
                        break;
                    case 40: //下
                        if (upDownClickNum < 1) {
                            $(listEle).first().addClass('key-down-sel');
                        } else {
                            $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                                .next().filter(cls).addClass("key-down-sel")

                        }
                        if (cls == '.search-list-div') {
                            $(inputEle).val($(listEle).filter('.key-down-sel').attr('data-name'));
                        }
                        e.preventDefault();
                        break;
                    case 13:
                        if ($.trim($(inputEle).val())) {
                            if (cls == '.before-search-div') {
                                var code = $(listEle).filter('.key-down-sel').attr('data-code');
                                if (code && $($(listDiv).find(cls)).attr('class').indexOf('globe-pre-search') != -1) {
                                    var buryParam = $(listEle).filter('.key-down-sel').attr('data-pingParam') ? $(listEle).filter('.key-down-sel').attr('data-pingParam') : '';
                                    var jumpCountry = '';
                                    try {
                                        jumpCountry = wind.uri(location.href)._params.country;
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    Common.JumpfromCountry("Bu3", code, jumpCountry, buryParam)
                                } else if (code) {
                                    var buryParam = $(listEle).filter('.key-down-sel').attr('data-pingParam') ? $(listEle).filter('.key-down-sel').attr('data-pingParam') : '';
                                    Common.linkCompany('Bu3', code, null, null, buryParam); //bury
                                } else {
                                    $('#btnToolbarSearch').trigger('click');
                                }
                            } else {
                                $('#btnToolbarSearch').trigger('click');
                            }
                        }
                        break;
                }
            }

        });
        $(document).on('input', "#inputToolbarGlobalSearch,#inputToolbarSearch", function(event) {
            //搜索框输入
            clearTimeout(serachtimer);
            serachtimer = setTimeout(function() {
                var target = event.target;
                var val = $.trim($(target).val());
                if (val) {
                    // 显示预搜索
                    $('.input-toolbar-search-list').removeClass('active');
                    val = val.trim();
                    var len = Common.getByteLen(val);
                    if (len >= 4) {
                        if (target.id == "inputToolbarGlobalSearch") {
                            var urlCoutry = Common.getUrlSearch("country");
                            var selCountry = $("#searchRaegionGlobal").find(".wi-secondary-color").attr("data-name") || urlCoutry;
                            var paramas = { "companyname": val, "type": selCountry, "pageNo": 0, "pageSize": 10, "sort": -1 };
                            Common.getPreGlobalSearch(paramas, function(res) {
                                var data = res.list || [];
                                // TODO 执行预搜索
                                var beforeSearchParent = $('.input-toolbar-before-search');
                                beforeSearchParent.addClass('active');
                                beforeSearchParent.html('');
                                if (!data.length) {
                                    return;
                                }

                                for (var i = 0; i < data.length; i++) {
                                    if (i > 4) {
                                        break;
                                    }
                                    var highLitKey = '';
                                    var showSpan = '';
                                    var corp_name = '';
                                    var corName = '';
                                    for (itemKey in data[i].highlight) {
                                        switch (itemKey) {
                                            case 'corp_name':
                                                showSpan = '<span>企业名称匹配</span>';
                                                break;
                                            case 'former_name':
                                                showSpan = '<span>曾用名匹配</span>';
                                                break;
                                        }
                                        if (showSpan != "") {
                                            break;
                                        }
                                    }
                                    var ele = document.createElement('div');
                                    $(ele).addClass('before-search-div  globe-pre-search')
                                    corName = corp_name = data[i].corp_name;
                                    ele.innerHTML = corp_name + showSpan;
                                    $(ele).attr('data-code', data[i].corp_id);
                                    $(ele).attr('data-name', corName);
                                    $(ele).attr('data-country', selCountry);
                                    $(ele).attr('data-buryModule', 'preSearch');
                                    $(ele).attr('data-buryfuncType', 'preSearchCk');
                                    $(ele).attr('data-buryNum', i + 1);
                                    $(ele).attr('data-buryInput', val);
                                    $(ele).attr('data-buryId', data[i].corp_id);
                                    beforeSearchParent.append(ele);
                                }
                            }, function() {
                                return $.trim($('#inputToolbarGlobalSearch').val());
                            });
                        } else {
                            Common.getPreSearch(val, function(res) {
                                var data = res.corplist || [];
                                var count = res.tagCount ? res.tagCount.tagCount : 0;
                                var tag = res.tagCount ? res.tagCount.tagName : val;
                                // TODO 执行预搜索
                                var parent = $('.input-toolbar-before-search');
                                parent.addClass('active');
                                parent.html('');

                                if (count) {
                                    parent.html('<div class="before-search-key">查看全部<span class="wi-secondary-color">' + count + '</span>家具有<span class="wi-secondary-color">' + tag + '</span>特征的企业</div>');
                                }

                                if (!data.length) {
                                    return;
                                }

                                for (var i = 0; i < data.length; i++) {
                                    if (i > 4) {
                                        return;
                                    }
                                    var highTitle = '';
                                    var highLitKey = '';
                                    var highLight = '';
                                    var corp_name = '';
                                    var corName = '';
                                    var ele = document.createElement('div');
                                    // $(ele).addClass('before-search-div wi-link-color')
                                    $(ele).addClass('before-search-div')

                                    corName = corp_name = data[i].name;
                                    if (data[i].highlight) {
                                        highLitKey = Object.keys(data[i].highlight)[0];
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
                                            highTitle = '债券名称';
                                            break;
                                        case 'bond_code':
                                            highTitle = '债券代码';
                                            break;
                                        case 'bond_wind_code':
                                            highTitle = '债券万得代码';
                                            break;
                                        case 'fund_name':
                                            highTitle = '基金名称';
                                            break;
                                        case 'fund_code':
                                            highTitle = '基金代码';
                                            break;
                                        case 'fund_wind_code':
                                            highTitle = '基金万得代码';
                                            break;
                                        case 'brand_name2':
                                            highTitle = intl('207813' /* 品牌 */ );
                                            break;
                                        case 'brand_name2_english':
                                            highTitle = '品牌英文名';
                                            break;
                                        case 'financing_institution':
                                            highTitle = '投资方';
                                            break;
                                        case 'project_name':
                                            highTitle = '项目名称';
                                            break;
                                        case 'beneficiaries':
                                            highTitle = '最终受益人';
                                            break;
                                        case 'corp_members':
                                            highTitle = intl('122202' /* 主要成员 */ );
                                            break;
                                        case 'stockholder_people':
                                            highTitle = intl('32959' /* 股东 */ );
                                            break;
                                        case 'eng_name':
                                            highTitle = '企业英文名';
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
                                            highTitle = '产品名称';
                                            break;
                                        case 'main_business':
                                            highTitle = intl('138753' /* 主营构成 */ )
                                            break;
                                        case 'software_copyright':
                                            highTitle = intl('138788' /* 软件著作权 */ );
                                            break;
                                        case 'park_name':
                                            highTitle = '园区名';
                                            break;
                                        case 'wechat_name':
                                            highTitle = '微信公众号名称';
                                            break;
                                        case 'wechat_code':
                                            highTitle = '微信公众号号码';
                                            break;
                                        case 'website_name':
                                            highTitle = '网站名称';
                                            break;
                                        case 'goods':
                                            highTitle = intl('138669' /* 商品/服务项目 */ );
                                            break;
                                        case 'online_load_product':
                                            highTitle = '网贷产品名';
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

                                    if (highTitle) {
                                        highLight = '<span>' + highTitle + '匹配</span>';
                                    }
                                    ele.innerHTML = corp_name + highLight;
                                    $(ele).attr('data-code', data[i].id);
                                    $(ele).attr('data-name', corName);
                                    //bury埋点参数
                                    $(ele).attr('data-buryModule', 'preSearch');
                                    $(ele).attr('data-buryfuncType', 'preSearchCk');
                                    $(ele).attr('data-buryNum', i + 1);
                                    $(ele).attr('data-buryInput', tag);
                                    $(ele).attr('data-buryId', data[i].id);
                                    $(ele).attr('data-buryStrategy', highLitKey);

                                    parent.append(ele);
                                }
                            }, function() {
                                return $.trim($('#inputToolbarSearch').val());
                            });
                        }
                    } else {
                        $('.input-toolbar-before-search').removeClass('active');
                    }
                } else {
                    $('.input-toolbar-before-search').removeClass('active');

                    if (!historySearchList.length) {
                        return;
                    }

                    var searchListParent = $('.input-toolbar-search-list');
                    searchListParent.addClass('active');
                    searchListParent.html('');
                    if (target.id == "inputToolbarGlobalSearch") {
                        searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + '</div>');
                    } else {
                        searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');
                    }


                    for (var i = 0; i < historySearchList.length; i++) {
                        if (i > 4) {
                            return;
                        }
                        var ele = document.createElement('div');
                        // $(ele).addClass('search-list-div wi-link-color')
                        $(ele).addClass('search-list-div')
                        $(ele).text(historySearchList[i].keyword);
                        $(ele).attr('data-name', historySearchList[i].keyword);
                        $(ele).attr('data-match', historySearchList[i].is_fullmatch == 1 ? 1 : 0);
                        $(ele).attr('data-code', historySearchList[i].companycode || '');
                        $(ele).attr('data-buryInput', historySearchList[i].keyword); //bury历史搜索关键词
                        $(ele).attr('data-buryModule', 'histroySearch'); //bury历史搜索模块
                        $(ele).attr('data-buryfuncType', 'histroySearchCk'); //bury历史搜索模块
                        if (historySearchList[i] && historySearchList[i].detail && historySearchList[i].detail) {
                            //区别全球企业和普通搜索，全球企业加了国家
                            var detailTmp = JSON.parse(historySearchList[i].detail);
                            countryTmp = detailTmp.region;
                            $(ele).attr('data-country', countryTmp || '');
                        }
                        searchListParent.append(ele);
                    }
                }
            }, 300)
        });
        $(document).on('focus', "#inputToolbarSearchPatent,#inputToolbarSearchJudge,#inputToolbarSearchBrand,#inputToolbarSearchDishonesty", function(event) {
            Common.hisFocusCallback(event);
        })
        $(document).on('input', "#inputToolbarSearchPatent,#inputToolbarSearchJudge,#inputToolbarSearchBrand,#inputToolbarSearchDishonesty", function(event) {
            Common.hisInputCallback(event);
        })
    },
    hisFocusCallback: function(e) {
        var target = e.target;
        var inputEle = $(e.target);
        var listDiv = null;
        var listEle = null;
        var val = $.trim($(target).val());
        if (val && val.length > 1) {
            $(".input-toolbar-search").trigger('input');
            $(e.target).off('keydown').on('keydown', keydownFun);
        }
        var id = $(target).attr('id');
        if (!id) return false;
        $(e.target).off('keydown').on('keydown', keydownFun)
        $(e.target).parent().off('mouseover', '.search-list-div').on('mouseover', '.search-list-div', function(e) {
            listDiv = $(inputEle).nextAll('.active');
            listEle = $(listDiv).find('.search-list-div');
            $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
            $(e.target).addClass('key-down-sel')
            e.preventDefault();
        })

        function keydownFun(e) {
            var cls = '.search-list-div';
            listDiv = $(inputEle).nextAll('.active');
            listEle = $(listDiv).find(cls);
            var upDownClickNum = $(listEle).filter('.key-down-sel').length;
            switch (e.keyCode) {
                case 38: //上                                            
                    if (upDownClickNum < 1) {
                        $(listEle).last().addClass('key-down-sel');
                    } else {
                        $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                            .prev().filter(cls).addClass("key-down-sel")
                    }
                    $(inputEle).val($(listEle).filter('.key-down-sel').attr('data-name'));
                    e.preventDefault();
                    break;
                case 40: //下
                    if (upDownClickNum < 1) {
                        $(listEle).first().addClass('key-down-sel');
                    } else {
                        $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                            .next().filter(cls).addClass("key-down-sel")
                    }
                    $(inputEle).val($(listEle).filter('.key-down-sel').attr('data-name'));
                    e.preventDefault();
                    break;
                case 13:
                    if ($.trim($(inputEle).val())) {
                        $(e.target).siblings('.input-toolbar-button').trigger('click');
                    }
                    break;
            }
        }
    },
    hisInputCallback: function(event) {
        $this = $(this);
        clearTimeout(serachtimer);
        var pageType = $('.input-toolbar-search').attr('id');
        serachtimer = setTimeout(function() {
            $(".input-toolbar-search-list").removeClass("active"); // 移除历史搜索
            var target = event.target;
            Common.showInputEvent($this, target, pageType);
        }, 300)
    },
    showInputEvent: function($this, target, pageType) {
        // 用来对联想搜索进行处理(商标)
        var inputWord = $.trim($(target).val());
        var searchType = null;
        switch (pageType) {
            case 'inputToolbarSearchBrand':
                searchType = 'trademark';
                break; //商标
            case 'inputToolbarSearchPatent':
                searchType = 'patent';
                break; //专利
            case 'inputToolbarSearchJudge':
                searchType = 'risk';
                break; //裁判文书
            case 'inputToolbarSearchDishonesty':
                searchType = 'discredicted_person';
                break; //老赖
        }
        if (searchType == null) {
            return false;
        }
        var queryParam = { key: inputWord, type: searchType };
        var $thinkModel = $('.input-toolbar-before-search');
        if (inputWord) {
            Common.getVertThinkSearch(queryParam, function(res) {
                var data = res && res.list ? res.list : [];
                if (!data.length) {
                    $thinkModel.html('');
                    $thinkModel.removeClass('active');
                    return;
                }
                // 执行联想搜索
                $thinkModel.html('');
                var htmlArr = [];
                for (var thinkWordIdx in data) {
                    htmlArr.push('<div class="search-list-div" data-type="' + searchType + '" data-name="' + data[thinkWordIdx].word + '">' + data[thinkWordIdx].word + '</div>');
                }
                $thinkModel.html(htmlArr.join(''));
                $thinkModel.addClass('active');

            }, function() {
                return;
            });
        } else {
            $thinkModel.html('');
            $thinkModel.removeClass('active');
            // $(target).off('keydown');
            $(".input-toolbar-search-list").addClass("active");
        }
    },
    transIndustryLevOne2En: function(str) {
        switch (str) {
            case "农、林、牧、渔业":
                return "Agriculture, Forestry, Animal Husbandry and Fishery"
                break;
            case "采矿业":
                return "Mining and Quarrying"
                break;
            case "制造业":
                return "Manufacturing"
                break;
            case "电力、热力、燃气及水生产和供应业":
                return "Production and Supply of Electricity, Heat, Gas and Water"
                break;
            case "建筑业":
                return "Construction Industry"
                break;
            case "批发和零售业":
                return "Wholesale and Retail"
                break;
            case "交通运输、仓储和邮政业":
                return "Transportation, Warehousing and Postal Services"
                break;
            case "住宿和餐饮业":
                return "Accommodation and Catering"
                break;
            case "信息传输、软件和信息技术服务业":
                return "Information Transmission, Software and IT Service"
                break;
            case "金融业":
                return "Financial Sector"
                break;
            case "房地产业":
                return "Real Estate Industry"
                break;
            case "租赁和商务服务业":
                return "Leasing and Business Services"
                break;
            case "科学研究和技术服务业":
                return "Scientific Research and Technical Services"
                break;
            case "水利、环境和公共设施管理业":
                return "Water, Environment and Public Facilities Management Industry"
                break;
            case "居民服务、修理和其他服务业":
                return "Resident Services, Repairs and Other services"
                break;
            case "教育":
                return "Education"
                break;
            case "卫生和社会工作":
                return "Health and Social Work"
                break;
            case "文化、体育和娱乐业":
                return "Culture, Sports and Entertainment"
                break;
            case "综合":
                return "Composite"
                break;
            default:
                return str
                break;
        }
    },
    transType2En: function(str) {
        switch (str) {
            case "化学原料":
                return "Chemical Raw Material"
                break;
            case "颜料油漆":
                return "Pigment and Paint"
                break;
            case "日化用品":
                return "Daily Chemicals"
                break;
            case "燃料油脂":
                return "Fuel and Grease"
                break;
            case "医药卫生":
                return "Medicine Health"
                break;
            case "金属材料":
                return "Metal Materials"
                break;
            case "机械设备":
                return "Mechanical Equipment"
                break;
            case "手工器械":
                return "Hand Instrument"
                break;
            case "科学仪器":
                return "Scientific Instrument"
                break;
            case "医疗器械":
                return "Medical Instrument"
                break;
            case "家用电器":
                return "Home Appliance"
                break;
            case "运输工具":
                return "Transportation"
                break;
            case "军火烟火":
                return "Arms and Fireworks"
                break;
            case "珠宝钟表":
                return "Jewelry and Watches"
                break;
            case "乐器":
                return "Musical Instruments"
                break;
            case "文化用品":
                return "Cultural Articles"
                break;
            case "橡胶制品":
                return "Rubber Products"
                break;
            case "皮革皮具":
                return "Leather Goods"
                break;
            case "建筑材料":
                return "Building Materials"
                break;
            case "家具":
                return "Furniture"
                break;
            case "厨具洁具":
                return "Kitchen Ware"
                break;
            case "绳网袋篷":
                return "Rope,Net,Bag and Canopy"
                break;
            case "纺织纱线":
                return "Textile Yarn"
                break;
            case "家用织物":
                return "Home Textiles"
                break;
            case "服装鞋帽":
                return "Clothing,Shoes and Hats"
                break;
            case "缝纫用具及制品":
                return "Sewing Products"
                break;
            case "地毯席垫":
                return "Carpets and Mats"
                break;
            case "娱乐健身器材":
                return "Entertainment and Fitness Equipment"
                break;
            case "食品":
                return "Food"
                break;
            case "调料速食":
                return "Seasoning and Convenience Food"
                break;
            case "农林产品":
                return "Agriculture and Forestry Products"
                break;
            case "啤酒饮料":
                return "Beer Beverage"
                break;
            case "含酒精饮料":
                return "Alcoholic Beverage"
                break;
            case "烟草烟具":
                return "Tobacco and Tobacco Sets"
                break;
            case "广告贸易":
                return "Advertisement and Trade"
                break;
            case "金融物管":
                return "Finance and Property Management"
                break;
            case "建筑修理":
                return "Construction and Repairing"
                break;
            case "通讯服务":
                return "Communication Services"
                break;
            case "运输存储":
                return "Transportation and Storage"
                break;
            case "材料加工":
                return "Material Processing"
                break;
            case "教育娱乐":
                return "Education and Entertainment"
                break;
            case "科研服务":
                return "Scientific Research Services"
                break;
            case "餐饮住宿":
                return "Catering and Accommodation"
                break;
            case "医疗园艺服务":
                return "Medical and Gardening Services"
                break;
            case "社会法律":
                return "Social and Legal Services"
                break;
            default:
                return str
                break;
        }
    },
    transState2En: function(str) {
        switch (str) {
            case "有效":
                return "Valid"
                break;
            case "无效":
                return "Invalid"
                break;
            default:
                return str
                break;
        }
    },
    transPatentType2En: function(str) {
        switch (str) {
            case "发明专利":
                return "Invention Patent"
                break;
            case "外观设计专利":
                return "Design Patent"
                break;
            case "实用新型专利":
                return "Practical New Patent"
                break;
            default:
                return str
                break;
        }
    },
    transPatentState2En: function(str) {
        switch (str) {
            case "授权":
                return "Entitle"
                break;
            case "公布":
                return "Publish"
                break;
            default:
                return str
                break;
        }
    },
    transCaseType2En: function(str) {
        switch (str) {
            case "民事案件":
                return "Civil Case"
                break;
            case "执行案件":
                return "Execution Case"
                break;
            case "刑事案件":
                return "Criminal Case"
                break;
            case "行政案件":
                return "Administrative Case"
                break;
            case "赔偿案件":
                return "Compensation Case"
                break;
            default:
                return str
                break;
        }
    },
    transCompanyState2En: function(str) {
        switch (str) {
            case "存续":
                return "Duration"
                break;
            case "注销":
                return "Logout"
                break;
            case "迁出":
                return "Move Out"
                break;
            case "吊销,未注销":
                return "Revocation, not cancellation"
                break;
            case "吊销,已注销":
                return "Revocation, Cancellation"
                break;
            case "撤销":
                return "Ref"
                break;
            case "停业":
                return "Shut down"
                break;
            case "非正常户":
                return "Abnormal Account"
                break;
            default:
                return str
                break;
        }
    },
    transProvice2En: function(str) {
        var str = str ? str.substring(0, 2) : "";
        switch (str) {
            case "陕西":
                return "Shaanxi"
                break;
            case "北京":
                return "Beijing"
                break;
            case "江苏":
                return "Jiangsu"
                break;
            case "湖南":
                return "Hunan"
                break;
            case "山东":
                return "Shandong"
                break;
            case "四川":
                return "Sichuan"
                break;
            case "广东":
                return "Guangdong"
                break;
            case "浙江":
                return "Zhejiang"
                break;
            case "河南":
                return "Henan"
                break;
            case "新疆":
                return "Xinjiang"
                break;
            case "上海":
                return "Shanghai"
                break;
            case "甘肃":
                return "Gansu"
                break;
            case "安徽":
                return "Anhui"
                break;
            case "广西":
                return "Guangxi"
                break;
            case "辽宁":
                return "Liaoning"
                break;
            case "湖北":
                return "Hubei"
                break;
            case "山西":
                return "Shanxi"
                break;
            case "福建":
                return "Fujian"
                break;
            case "天津":
                return "Tianjin"
                break;
            case "青海":
                return "Qinghai"
                break;
            case "江西":
                return "Jiangxi"
                break;
            case "河北":
                return "Hebei"
                break;
            case "贵州":
                return "Guizhou"
                break;
            case "吉林":
                return "Jilin"
                break;
            case "云南":
                return "Yunnan"
                break;
            case "重庆":
                return "Chongqing"
                break;
            case "内蒙":
                return "Inner Mongolia"
                break;
            case "宁夏":
                return "Ningxia"
                break;
            case "黑龙":
                return "Heilongjiang"
                break;
            case "海南":
                return "Hainan"
                break;
            case "西藏":
                return "Tibet"
                break;
            default:
                return str
                break;
        }
    },
    showCompanyName: function(type, name, id, img, shortname, count, isBenifciary, isActCtrl, isVestPerson, buryParam) {
        /*
        type为传入类型2为公司，别的为人
        name为公司或人名
        id为公司或人的id
        img公司logo或人物头像
        shortname为公司简称
        count为公司或人参股几家公司的数量
        isBenifciary如果是人的话，是否是最终受益人
        isActCtrl如果是人的话，是否是实控人
        isVestPerson是否是对外投资模块的法定代表人
         */
        var countStr = ""; //参股几家
        var nameStr = ""; //公司/人名
        var imgStr = ""; //公司logo或人物图像
        var actStr = "" //是否是最终受益人或者实控人或者是公司有控股企业
        var pingParam = buryParam ? buryParam : ''; //bury
        try {
            if (name) {
                //名字为必填，没有的话就显示--
                if (type == 2) {
                    //2为公司1为人，type的值由上一层转换好传过来
                    if (img) {
                        //有公司logo显示公司logo
                        if (img.indexOf("http") == -1) {
                            //                          img = 'http://news.windin.com/ns/imagebase/6683/' + img;
                            img = Common.getlogoAccess(img, 'list'); //企业logo
                        }
                        imgStr = '<span class="person_img"><img class="big-logo" width="40" src="' + img + '" onerror="src=\'../resource/images/Company/company_logo.png\'"></span>'
                    } else {
                        //没有公司logo显示简称前四个字，再没有就不显示

                        var logoName = shortname ? shortname.slice(0, 4) : name.slice(0, 4);
                        if (logoName.length <= 2) {
                            imgStr = '<span class="person_shortname logo-text-less">' + logoName + '</span>';
                        } else {
                            imgStr = '<span class="person_shortname">' + logoName + '</span>';
                        }
                    }
                    if (isActCtrl) {
                        actStr = '<br/><span class="has-benfciary-act"><span class="act-company">控股企业</span></span>'
                    }
                    if (id) {
                        //有id加链接, 没有不加
                        countStr = count && count != 0 ? '<span class="person_txt_count underline  fr" data-code="' + id + '" data-name="' + name + '">参股' + count + '家企业</span>' : '';
                        nameStr = '<span class="name-isctrl"><a class="width-company underline wi-secondary-color wi-link-color" data-code="' + id + '"  data-name="' + name + '" data-pingParam="' + pingParam + '">' + name + '</a>' + actStr + '</span>';
                    } else {
                        countStr = count && count != 0 ? '<span class="person_txt_count fr" data-code="' + code + '" data-name="' + name + '">参股' + count + '家企业</span>' : '';
                        nameStr = '<span class="name-isctrl"><span class="width-company">' + name + actStr + '</span></span>';
                    }
                    return imgStr + nameStr + countStr;
                } else if (type == 1) {
                    //如果是人物
                    if (img) {
                        var imgSrc = "";
                        //if (!global_isRelease) {
                        imgSrc = 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + img;
                        //} else {
                        //imgSrc = 'http://wfcweb/imageWeb/ImgHandler.aspx?imageID=' + img;
                        //}
                        imgStr = '<img class="person_txt_img big-logo" height="40" width="40" src="' + imgSrc + '" onerror="src=\'../resource/images/Company/company_logo.png\'">';
                    } else {
                        imgStr = '<span class="person_txt_img">' + name.slice(0, 1) + '</span>';
                    }
                    if (isBenifciary || isActCtrl) {
                        actStr = '<br/><span class="has-benfciary-act">' + (isBenifciary ? '<span class="benfciary-flag">最终受益人</span>' : "") + (isActCtrl ? '<span class="act-flag">实际控制人</span>' : "") + '</span>'
                    }
                    if (id) {
                        //有id加链接, 没有不加
                        if (isVestPerson) {
                            countStr = count && count != 0 ? '<br/><span class="person_txt_count underline" data-type="getallcompany" data-code="' + id + '" data-name="' + name + '">他有' + count + '家企业</span>' : '';
                            nameStr = '<span class="name-isctrl"><span class="name-isctrl"><a class="" data-code="' + id + '"  data-name="' + name + '">' + name + '</a>' + actStr + '</span>' + countStr + "</span>";
                        } else {
                            countStr = count && count != 0 ? '<span class="person_txt_count underline fr" data-type="getallcompany"  data-code="' + id + '" data-name="' + name + '">他有' + count + '家企业</span>' : '';
                            nameStr = '<span class="name-isctrl"><a class="" data-code="' + id + '"  data-name="' + name + '">' + name + '</a>' + actStr + '</span>' + countStr;
                        }
                    } else {
                        if (isVestPerson) {
                            countStr = count && count != 0 ? '<br/><span class="person_txt_count" data-type="getallcompany"  data-code="' + id + '" data-name="' + name + '">他有' + count + '家企业</span>' : '';
                            nameStr = '<span class="name-isctrl"><span>' + name + actStr + '</span>' + countStr + '</span>';
                        } else {
                            countStr = count && count != 0 ? '<span class="person_txt_count fr" data-type="getallcompany"  data-code="' + id + '" data-name="' + name + '">他有' + count + '家企业</span>' : '';
                            nameStr = '<span class="name-isctrl">' + name + actStr + '</span>' + countStr;
                        }
                    }
                    return imgStr + nameStr;
                } else {
                    return name;
                }
            } else {
                return "--"
            }
        } catch (err) {
            return "--"
        }
    },
    Popup: function(setting, delTitle, contSet, onlysvip, successFun) {
        var obj = Common.notVipWindow({ title: contSet.title, tips: contSet.dec, css: contSet.css }, { css: contSet.rcss }, onlysvip ? onlysvip : '');
        if (Common.is_overseas_config) {
            obj = Common.overseasNotVipWindow({ title: contSet.title, tips: contSet.dec, css: contSet.css }, { css: contSet.rcss }, onlysvip ? onlysvip : '');
        }
        var str = obj.left.str;
        //弹出框共用组件
        layer.open({
            skin: 'layer-vip-' + obj.tc,
            closeBtn: setting[0], //是否去掉关闭按钮
            title: setting[1], //是否去掉标题展示
            resize: false, //是否可拉伸            
            type: 1,
            area: ['780px', '531px'], //宽高        
            content: str,
            cancel: function(params) {
                if (obj && obj.inter) {
                    window.clearInterval(obj.inter);
                }
                if (contSet.closeCall) contSet.closeCall();
            }
        });
        if (delTitle) {
            $('.layer-vip-' + obj.tc).find('.layui-layer-title').remove();
            // $('.layer-vip-' + obj.tc).css('height', '520px')
            $('.layer-vip-' + obj.tc).find('.layui-layer-content').css('height', '530px');
        }
        $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(obj.right.str);
        $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(obj.success.str);
        $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(obj.userNoteStr);
        $('.layer-vip-' + obj.tc).find('.layui-layer-content').find('.user-note').addClass('user-note-popup').addClass('user-note-' + obj.tc);
        $('.layer-vip-' + obj.tc).find('.gel-vip-model').css('margin', 0);
        var closeEle = $('.layer-vip-' + obj.tc).find('.layui-layer-content').find('.layui-layer-setwin');

        obj.successFun = successFun;
        Common.wxVipCodeWindow(obj, closeEle);
    },
    PopupExport: function(setting, delTitle, contSet, res) {
        var obj = Common.notVipWindowExport({ title: contSet.title, tips: contSet.dec, css: contSet.css, count: contSet.count }, { css: contSet.rcss }, '');
        var str = obj.left.str;
        //弹出框共用组件
        layer.open({
            skin: 'layer-vip-' + obj.tc,
            closeBtn: setting[0], //是否去掉关闭按钮
            title: setting[1], //是否去掉标题展示
            resize: false, //是否可拉伸            
            type: 1,
            area: ['780px', '531px'], //宽高        
            content: str,
            cancel: function(params) {
                if (obj && obj.inter) {
                    window.clearInterval(obj.inter);
                }
                if (contSet.closeCall) contSet.closeCall();
            }
        });
        if (delTitle) {
            $('.layer-vip-' + obj.tc).find('.layui-layer-title').remove();
            $('.layer-vip-' + obj.tc).find('.layui-layer-content').css('height', '530px');
        }

        $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(obj.right.str);
        $('.layer-vip-' + obj.tc).find('.gel-vip-model').css('margin', 0);
        var closeEle = $('.layer-vip-' + obj.tc).find('.layui-layer-content').find('.layui-layer-setwin');
        Common.wxVipCodeWindowExport(obj, closeEle, res);
    },
    PupupNoAccess: function(tips, type) {
        type = type || '今日额度已用完';
        tips = tips || '您当前功能套餐内额度已用完';
        if (!$('[data-type="windgel-vip-model-noaccess"]').length) {
            $('body').append('<link href="../resource/css/vipModelNoAccess.css?v=1" rel="stylesheet" data-type="windgel-vip-model-noaccess" />');
        }
        var str = '<div class="vip-popup-noaccess"><img src="../resource/images/Company/wx_wo.png"></img><span>' + type + '</span><div class="vip-popup-noaccess-tips">' + tips + '</div><div class="vip-popup-noaccess-btn">关闭</div></div>';
        layer.open({
            title: ['提示', 'font-size:16px;font-weight:bold;'],
            type: 1,
            area: ['520px', '200px'], //宽高        
            content: str
        })
        $('.vip-popup-noaccess-btn').on('click', function(e) {
            window.layer.closeAll();
        });
    },
    getUserVips: function(params) {
        myWfcAjax("getuserpackageinfo", {}, function(data) {
            var res = JSON.parse(data);
            var code = res.ErrorCode;
            if (code == 0 && res.Data) {
                var type = res.Data.packageName;
                if (type && type == 'EQ_APL_GEL_SVIP') {
                    type = 'SVIP版';
                }
                if (type && type == 'EQ_APL_GEL_VIP') {
                    type = 'VIP版';
                }
                if (type && type == 'EQ_APL_GEL_EP') {
                    type = '企业套餐';
                }
                if (type && type == 'EQ_APL_GEL_BS') {
                    type = '免费版';
                }
            }
        }, function() {});
    },
    getlogoAccess: function(logoStr, type) {
        //用于对企业logo的返回字段处理
        //      logoStr = 'TB_OBJECT_6288_ATTACH.c88fba936959ecb7f5e157f19fb10a33';
        var result = (type == 'title' ? '../resource/images/Company/company_logo.png' : '../resource/images/Company/default_company.png');
        if (logoStr) {
            var linkhead = 'http://news.windin.com/ns/imagebase/';
            var tbRowkey = logoStr.split('.');
            if (logoStr.indexOf("http") != -1) {
                result = logoStr;
            }
            if (tbRowkey.length == 2) {
                tb_name = tbRowkey[0].match(/\d+/g)[0];
                rowkey = tbRowkey[1];
                result = linkhead + tb_name + '/' + rowkey;
            } else {
                result = 'http://news.windin.com/ns/imagebase/6683/' + logoStr;
            }
        }
        return result;
    },
    getUrlSearch: function(parama, addr) {
        //获取url某个字段后的字符串
        var loc = addr ? addr : location.href;
        // 针对 companycode 单独处理 匹配不区分大小写
        if (loc.replace) {
            loc = loc.replace(/companycode/i, 'companycode')
        }
        if (parama.toLowerCase && parama.toLowerCase() === 'companycode') {
            parama = parama.toLowerCase();
        }
        var pattern = new RegExp(parama + '=([^&#|]+)#?')
        var patternArr = pattern.exec(loc);
        if (patternArr) {
            return patternArr[1]
        } else {
            return "";
        }
    },
    getCodeId: function() {
        //获取url的companycode和companyid
        var code = this.getUrlSearch("companycode");
        var id = this.getUrlSearch("companyid");
        return {
            "companycode": code,
            "companyid": id
        }
    },
    add0: function(m) {
        //时间数字不满10前加0
        return m < 10 ? '0' + m : m;
    },
    format: function(shijianchuo) {
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
    formatAggTime: function(shijianchuo) {
        //对筛选条件的时间戳进行转换
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y.toString() + Common.add0(m).toString() + Common.add0(d).toString();
    },
    formatTime: function(time) {
        //格式化时间
        if (/(\d{4})(\d{2})(\d{2})([^\d]+)(\d{4})(\d{2})(\d{2})/.test(time)) {
            return time.replace(/(\d{4})(\d{2})(\d{2})([^\d]+)((\d{4})(\d{2})(\d{2}))?/, "$1-$2-$3$4$6-$7-$8")
        } else if (/(\d{4})(?:[^\d])?(\d{2})(?:[^\d])?(\d{2})/.test(time)) {
            return time.replace(/(\d{4})\/?(\d{2})\/?(\d{2})/, "$1-$2-$3")
        } else if (/(\d{4})(\d{2})/.test(time)) {
            return time.replace(/(\d{4})(\d{2})/, "$1-$2");
        } else {
            return "--";
        }
    },
    formatCont: function(str) {
        var str = str + "";
        if (str && (str.toLowerCase() != 'null') && (str.toLowerCase() != 'undefined')) {
            return str;
        } else {
            return "--";
        }
    },
    formatPercent: function(str) {
        //格式化百分比
        if (parseFloat(str)) {
            return parseFloat(str).toFixed(2) + "%";
        } else {
            return "--";
        }
    },
    formatLongCont: function(str) {
        //进行长度控制
        var contHtml = '<div class="text-2-show"><span class="cont-str view-cont-control">' + str + '</span>';
        var lingHtml = '<span class="control-assembly to-control-high wi-secondary-color wi-link-color"><b>...</b>展开</span></div>';
        return contHtml + lingHtml;
    },
    // formatImg: function(){
    //     // 用来对所有的图片模块构建一个公共方法
    //     // 参数：类名、图片id或图片连接、图片宽高另外控制，若不控制则使用父元素的宽高，类型控制（div\img）
    //     // 可以有两种模式，一种带有div块，一种只含有img元素
    //     imgWidth = widthValue ? 'width="' + widthValue + '"': '';
    //     imgHeight = heightValue ? 'height="' + heightValue + '"': '';
    //     imgClass = imgClass ? imgClass : 'big-logo';
    //     divimgClass = divimgClass ? divimgClass : 'group-search-icon';
    //     imgurl = 'http://news.windin.com/ns/imagebase/6288/6683.72d6a251a6c8e2ff3567289e971b3699';
    //     defaultImgur = '../';
    //     var htmlArr = [];
    //     htmlArr.append('<div class="'+ divimgClass +'">');
    //     htmlArr.append('<img class="'+imgClass+'" src="'+imgurl+'">');
    //     htmlArr.append('</div>');
    //     return htmlArr.join("");
    // },
    ajaxTab: function(eachArr) {
        /*显示最普通的表格
        arr是一个数组，即表头，个字段进行ajax请求，拿到数据
        2."fields"：拿到数据后各个表格
        1.category：即cmd，查询字段，通过这需要的字段名，即表头的各列。
        4."align"：对齐情况，1是居中，别的或无值都是居左
        3."dom"：数据显示在哪里,是一个id,即所整理后的数据显示在这个id里
        4."showlen":数据显示几条
        */
        var codeId = this.getCodeId();
        var parameter = { "companyid": codeId.companyid ? codeId.companyid : "", "companycode": codeId.companycode ? codeId.companycode : "", "pageindex": 0, "PageNo": 0, "PageSize": eachArr.showlen ? parseInt(eachArr.showlen) : 1000, "pagenum": eachArr.showlen ? parseInt(eachArr.showlen) : 1000 };
        myWfcAjax(eachArr.category, parameter, function(resData) {
            var res = JSON2.parse(resData);
            var $model = $("#" + eachArr.dom).parents(".widget-model");
            var $domMore = $model.find(".btn-more");
            if (res.ErrorCode == 0 && res.Data && res.Data.length > 0) {
                var tabhtml = Common.displayTab(resData, eachArr.fields, eachArr.align, eachArr.showlen, eachArr.moduleName);
                $("#" + eachArr.dom).html(tabhtml);
                Common.addLink2Company(eachArr.category, eachArr.fields, eachArr.dom, res);
            } else {
                $domMore.hide();
                var canNotRequest = '<tr><td colspan="' + eachArr.fields.length + '"><div class="no-data">没有找到' + (eachArr.moduleName || "") + '信息</div></td></tr>';
                $("#" + eachArr.dom).html(canNotRequest);
            }
        });
    },
    addLink2Company: function(category, fields, dom, res) {
        var column = {
            "getshareholder": { "Name": "Name", "Code": "Id" },
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
                    a.setAttribute("href", "Company.html?companycode=" + res.Data[i][column[category].Code] + Common.isNoToolbar());
                    a.innerText = tds[index].innerText;
                    tds[index].innerHTML = "";
                    $(tds[index]).append(a);
                }
            }
        }
    },
    displayTab: function(resData, fields, align, showlen, moduleName) {
        var backData = JSON.parse(resData).Data;
        var len = backData.length > showlen ? showlen : backData.length; //数据数量
        var tbodyArr = [];
        //正则，是否是html标签
        var htmlpattern = /<(\S*?)[^>]*>.*?<\/\1>|<.*? \/>/;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                tbodyArr.push('<tr>');
                for (var j = 0; j < fields.length; j++) {
                    var alignStr = "";
                    if (align && align[j] == 1) {
                        alignStr = "align='center'";
                    }
                    if (align && align[j] == 2) {
                        alignStr = "align='right'";
                    }
                    if (fields[j].indexOf("|") >= 0) {
                        //如果有"|"说明需要用函数处理传入的数值，"|"前是函数名，后面参数用逗号分开
                        var fn = fields[j].split("|")[1]; //函数名
                        var zhiduan = fields[j].split("|")[0]; //参数字段数组,数组第一个为需要处理的字段名,别的为需要的参数
                        var item = backData[i][zhiduan] ? backData[i][zhiduan] : ""; //根据字段名拿到这个字段的数据                  
                        if (fn.indexOf(":") >= 0) {
                            //:后面是参数，多个参数用逗号隔开
                            var tempArr = fn.split(":");
                            var fn = tempArr[0];
                            var fnParamArr = tempArr[1].split(",");
                            if (fnParamArr[0] == 'All') {
                                //传入第一个参数的是特别的字符'All',数据所有数据，一般用于比较复杂的过滤，需要别的字段支持
                                tbodyArr.push('<td ' + alignStr + ' >' + this[fn](item, backData[i], fnParamArr) + '</td>');
                            } else if (fnParamArr[0] == 'All2') { //专门针对金额单位的
                                tbodyArr.push('<td ' + alignStr + ' >' + this[fn](item, fnParamArr, backData[i]) + '</td>');
                            } else {
                                tbodyArr.push('<td ' + alignStr + ' >' + this[fn](item, fnParamArr) + '</td>');
                            }
                        } else {
                            //简单的过滤，没有参数
                            tbodyArr.push('<td ' + alignStr + ' >' + this[fn](item) + '</td>');
                        }
                    } else if (htmlpattern.test(fields[j])) {
                        //如果传入的是html代码，直接写入表格,如<a href="#">详细</a>或者图片之类
                        tbodyArr.push('<td ' + alignStr + ' >' + fields[j] + '</td>');
                    } else if (fields[j] == 'NO.') {
                        //传入的是特别的字符'NO.',数据是序号1,2,3,4
                        tbodyArr.push('<td ' + alignStr + ' >' + (i + 1) + '</td>');
                    } else {
                        var item = backData[i][fields[j]] && backData[i][fields[j]];
                        if (typeof item == "string") {
                            item = (item.toLowerCase() != "undefined" && item != "null") ? (backData[i][fields[j]]) : "";
                        } else if (item == null) {
                            item = "";
                        }
                        tbodyArr.push('<td ' + alignStr + ' >' + item + '</td>');
                    }
                }
                tbodyArr.push('</tr>');
            }
        } else {
            //无数据
            tbodyArr.push('<tr><td colspan="' + fields.length + '"><div class="no-data">没有找到' + (moduleName || "") + '信息</div></td></tr>');
        }
        return tbodyArr.join("")
    },
    showDetailLink: function(value, paramArr, buryData) {
        buryData = buryData ? buryData + ' data-buryfuncType="detailView"' : '';
        return '<a target="_blank" class="link-showdetail wi-secondary-color wi-link-color" data-interface="' + paramArr[0] + '" data-key="' + paramArr[1] + '" data-tdlen="' + paramArr[2] + '" data-value="' + value + '" ' + buryData + '>' + intl('138697' /* 详细信息 */ ) + '</a>'
    },
    dialogContent: function(con) {
        return '<a href="#" class="show-dialog-content">查看<div class="judge-content" style="display:none">' + con + '</div></a>';
    },
    jumpPage: function(href) {
        window.location.href = href + location.search;
    },
    num2pagename: function(num) {
        //类型转中英文名，英文名用于跳转时ifame加载页面
        var num = num + ""; //转字符串
        switch (num) {
            case "0":
                return ["工商变更", "EnterpriseChange"];
                break;
            case "1":
                return ["法院判决", "Judgment"];
                break;
            case "2":
                return ["法院公告", "CourtNotice"];
                break;
            case "3":
                return ["开庭公告", "NoticeOfTrial"];
                break;
            case "4":
                return ["司法拍卖", "JudicialSale"];
                break;
            case "5":
                return ["被执行人", "TPSTE"];
                break;
            case "6":
                return ["行政处罚", "Penalty"];
                break;
            case "7":
                return ["经营异常", "AbnormalOperation"];
                break;
            case "8":
                return ["欠税信息", "OwingTax"];
                break;
            case "9":
                return ["动产抵押", "ChattelMortgage"];
                break;
            case "10":
                return ["股权出质", "EquityPledge"];
                break;
            case "11":
                return ["失信信息", "Dishonesty"];
                break;
            case "12":
                return ["重大税收违法", "IllegalTax"];
                break;
            case "13":
                return ["税务信息", "TaxInfo"];
                break;
            case "14":
                return ["抽查检查", "OwingTax"];
                break;
            case "15":
                return ["严重违法", "SpotCheck"];
                break;
            case "16":
                return ["商标信息", "Brand"];
                break;
            case "17":
                return ["专利", "Patent"];
                break;
            case "18":
                return ["软件著作权", "SoftwareCopyright"];
                break;
            case "19":
                return ["作品著作权", "ProductionCopyright"];
                break;
            case "20":
                return ["许可", "Permission"];
                break;
            case "21":
                return ["认证", "Authentication"];
                break;
            case "22":
                return ["招标", "Tender"];
                break;
            case "23":
                return ["中标", "Bid"];
                break;
            default:
                return [num, num];
                break;
        }
    },
    formatFloat: function(num, n) {
        //返回小数，n为几位小数
        if (num) {
            n = n ? parseInt(n) : 0;
            if (n <= 0) {
                return Math.round(num);
            }
            num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
            num = Number(num).toFixed(n); //补足位数
            return num;
        } else {
            return "--";
        }
    },
    formatWebsite: function(website) {
        //格式化网址，去掉http://或https://,加上链接。
        if (website) {
            var newstr = website.replace(/http(s)?(:)?(\/)*|,/g, "");
            // var newstr02 = newstr.replace(/www/g, "|www");
            // var websiteArr = newstr02.split("|");
            // var newStrArr = [];
            // if (websiteArr.length > 0) {
            //     for (var i = 1; i < websiteArr.length; i++) {
            //         var newStr = "";
            //         newStr = '<a class="underline wi-secondary-color wi-link-color" href="http://' + websiteArr[i] + '" target="_blank">' + websiteArr[i] + '</a>';
            //         newStrArr.push(newStr);
            //     }
            // } else {
            //     var newStr = "";
            //     newStr = '<a class="underline wi-secondary-color wi-link-color" href="http://' + websiteArr[0] + '" target="_blank">' + websiteArr[0] + '</a>';
            //     newStrArr.push(newStr);
            // }
            // return newStrArr.join("<br/>");
            var returnStr = '<a class="underline wi-secondary-color wi-link-color" href="http://' + newstr + '" target="_blank">' + website + '</a>';
            return returnStr;
        } else {
            return "--";
        }

    },
    formatMoney: function(money, arr, data) {
        //格式化数据
        if (!money || money + "".toLowerCase() == "undefined") {
            return "--"
        }
        var k = 0;
        if (arr && arr[0] == 'All2') {
            k = 1;
        }
        var num = arr && arr[k] ? arr[k] : 4;
        if (arr && (arr[k] === 0)) num = 0;
        var unit = arr && arr[k + 1] ? arr[k + 1] : "万";
        var isDivide = arr && arr[k + 2] ? 1000 : 1;
        if (data && data.InvestRegUnit) {
            unit = "万" + data.InvestRegUnit; //暂时还没有带
        }
        if (arr && arr[k + 3]) {
            isDivide = arr[k + 3]; //处理数量的数量级如*10000可为0.0001
        }
        var moneyStr = String(parseFloat((parseFloat(money) / isDivide).toFixed(num)));
        if (arr && arr[k + 4]) {
            unit = '';
            moneyStr = String((parseFloat(money) / isDivide).toFixed(num));
        }
        var moneySymbol = '';
        if (moneyStr.indexOf('-') == 0) {
            moneySymbol = '-';
            moneyStr = moneyStr.replace("-", "");
        }
        var moneyInt = moneyStr.split('.')[0];
        var moneyFloat = moneyStr.split('.')[1];
        var len = moneyInt.length;
        var lennum = parseInt(len / 3);
        var moneyOut = '';
        var i = 1;
        if (len % 3 == 0) {
            lennum--;
        }
        for (; i <= lennum; i++) {
            var mstr = moneyInt.substring(len - i * 3, len - (i - 1) * 3);
            moneyOut = ',' + mstr + moneyOut;
        }
        if (moneyFloat == undefined) {
            moneyOut = moneySymbol + moneyInt.substring(0, len - (i - 1) * 3) + moneyOut;
        } else {
            moneyOut = moneySymbol + moneyInt.substring(0, len - (i - 1) * 3) + moneyOut + '.' + moneyFloat;
        }
        return moneyOut + unit;
    },
    showType: function(type) {
        //通过type数值判断是否是自然人
        if (type == "1") {
            return "自然人"
        } else if (type == "2") {
            return "非自然人"
        } else if (type == "3") {
            return "其它"
        } else {
            return type
        }
    },
    // 税务信息企业名称跳转
    addTaxCompanyLink: function(companyname, data) {
        //给公司名字添加链接
        if (data.tax_name && data.tax_id) {
            //如果公司的type是非自然人，并且有companycode，就返回链接，否则只返回公司名字
            //如果Name字段存在，说明来源是股东信息这个接口
            var linkStr = '<a class="underline wi-secondary-color wi-link-color stock-module-list" target="_blank" data-companycode="' + data.tax_id + '" href="#">' + companyname + '</a>';
            return linkStr;
        } else {
            return companyname || '--';
        }
    },
    addCompanyLink: function(companyname, data, buryParam) {
        var dataPingparam = buryParam ? 'data-pingparam="&fromModule=&opId="' : ''; //bury

        //给公司名字添加链接
        if (data.Name && data.Type == "2" && data.Id) {
            //如果公司的type是非自然人，并且有companycode，就返回链接，否则只返回公司名字
            //如果Name字段存在，说明来源是股东信息这个接口
            var linkStr = '<a class="underline wi-secondary-color wi-link-color stock-module-list" target="_blank" data-companycode="' + data.Id + '" href="#">' + companyname + '</a>';
            return linkStr;
        } else if (data.InvestName && data.InvestId) {
            //如果InvestName字段存在，说明来源是直接对外投资这个接口
            var linkStr = '<a class="underline wi-secondary-color wi-link-color stock-module-list"  target="_blank" data-companycode="' + data.InvestId + '" href="#">' + companyname + '</a>';
            return linkStr;
        } else if (data.branch_name && data.branch_id) {
            //分支机构
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="Company.html?companycode=' + data.branch_id + Common.isNoToolbar() + '">' + companyname + '</a>';
            return linkStr;
        } else if (data.invest_name && data.invest_id) {
            //对外投资
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="Company.html?companycode=' + data.invest_id + Common.isNoToolbar() + '">' + data.invest_name + '</a>';
            return linkStr;
        } else if (data.shareholder_name && data.shareholder_id && data.shareholder_type == '1') {
            // 股东信息-个人
            // var linkStr = '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="Person.html?id=' + data.shareholder_id + '&name=' + data.shareholder_name + Common.isNoToolbar() + ' ">' + data.shareholder_name + '</a>';
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" target="_blank" >' + data.shareholder_name + '</a>';
            return linkStr;
        } else if (data.shareholder_name && data.shareholder_id && data.shareholder_type == '2') {
            // 股东信息-企业
            var linkStr = '<a class="underline wi-secondary-color wi-link-color stock-module-list" target="_blank" data-companycode="' + data.shareholder_id + '" href="#">' + companyname + '</a>';
            return linkStr;
        } else if (data.corp_name && data.corp_id) {
            //深度搜索->查看结果
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" href="" data-code="' + data.corp_id + '">' + data.corp_name + '</a>';
            return linkStr;
        } else if (data.company_name && data.company_code) {
            //深度搜索->查看结果
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" href="" data-code="' + data.company_code + '">' + data.company_name + '</a>';
            return linkStr;
        } else if (data.CorpName && data.CorpId && data.Type == '2') {
            //深度搜索->查看结果
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" href="" data-code="' + data.CorpId + '">' + data.CorpName + '</a>';
            return linkStr;
        } else if (data.invest_corp_name && data.invest_corp_id) {
            //年度报告果
            var linkStr = '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="Company.html?companycode=' + data.invest_corp_id + Common.isNoToolbar() + '">' + data.invest_corp_name + '</a>';
            return linkStr;
        } else {
            return companyname;
        }
    },
    addLinkAndCode: function(companyname, data) {
        //深度搜索->查看结果
        var ipoCodeStr = '';
        if (data.stockcode) {
            var str = '!Page[Minute,' + data.stockcode + ']';
            var ipoCodeStr = "<a class='ipo-code' href='" + str + "'>" + data.stockcode + "</a>";
        }
        var linkStr = '<a class="underline wi-secondary-color wi-link-color" href="" data-code="' + data.corp_id + '">' + data.corp_name + '</a>' + ipoCodeStr;
        return linkStr;
    },
    reportTitle: function(title, data, companyName) {
        //研报详细页面
        if (data.id) {
            return '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="reportDetail.html?id=' + data.id + '&companyName=' + companyName + '">' + title + '<a>'
        } else {
            return '<a>' + title + '</a>';
        }
    },
    linkOut: function(type, code, name) {
        //系统对外的链接，比如f9,f5或wi行业中心
        var str = '!CommandParam[' + type + ',' + (name ? name : "windcode") + '=' + code + ']';
        return str;
    },
    linkF5: function(name, data, arr) {
        //跳转到f5
        var code = arr && arr[1] ? data[arr[1]] : data["F16_1090"];
        var str = "";
        if (is_terminal) {
            str = '!Page[Minute,' + code + ']';
        }
        var linkStr = "<a class='go2f5 underline wi-secondary-color wi-link-color' href='" + str + "'>" + name + "</a>";
        return linkStr;
    },
    linkF9: function(name, data, arr) {
        //跳转到f9
        var code = arr && arr[1] ? data[arr[1]] : data["BondCode"];
        var str = "";
        if (is_terminal) {
            str = '!CommandParam[1400,windcode=' + code + ']';
        }
        var linkStr = "<a class='go2f9 underline wi-secondary-color wi-link-color' href='" + str + "'>" + name + "</a>";
        return linkStr;
    },
    showJudgeDetail: function(id, text) {
        //法院判断详细页面 
        if (id) {
            return '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="judgeDetail.html?detailId=' + $.trim(id) + '">' + text + '<a>'
        } else {
            return '';
        }
    },
    JumpOtherCompany: function(name, data, arr) {
        if (arr && data[arr[1]] && (arr[1] && data[arr[2]] == "2" || !arr[2])) {

            return '<a target="_blank" class="underline wi-secondary-color wi-link-color stock-module-list" data-companycode=' + data[arr[1]] + ' href="#">' + name + '</a>';
        } else {
            return name;
        }
    },
    showReport: function(id, companyName) {
        if (id) {
            return '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="reportDetail.html?interface=getreportdetailinfo&reportid=' + id + '&companyName=' + companyName + '">' + intl('138697' /* 详细信息 */ ) + '<a>';
        } else {
            return '<a>' + intl('138697' /* 详细信息 */ ) + '</a>';
        }
    },
    showMergeContent: function(con) {
        return '<a class="wi-secondary-color wi-link-color show-merge" data-title="' + con + '">' + intl('138697' /* 详细信息 */ ) + '<a>';
    },
    overMaxChar: function(data, num) {
        //单元格超出字数时截断并显示...,点下拉箭头显示所有,data为原始数据(带html标签),num为字节数，而不是字符数        
        var returnStr = "";
        var delHtmlData = data.replace(/<\/?.+?>/g, ""); //去除html        
        var bytesCount = 0; //统计字节数，中文二字节
        for (var i = 0; i < delHtmlData.length; i++) {
            var c = delHtmlData.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                //匹配双字节
                bytesCount += 1;
            } else {
                bytesCount += 2;
            }
        }
        if (data && delHtmlData.length > 0) {
            if (bytesCount > num) {
                returnStr = '<div><div class="char-hide">' + data + '</div>' + '<span class="char-show">' + delHtmlData.substring(0, parseInt((num - 4) / 2)) + '...</span><i class="show-allchar"></i></div>'
            } else {
                returnStr = data;
            }
        }
        return returnStr;
    },
    getBrandImg: function(data) {
        //商标图标
        var str_img_list = "../resource/images/Reports/no_photo_list.png";
        if (data) {
            var brand_img_list = '<img src="' + data + '" class="brand_images_list"' + ' onerror="this.src=\'' + str_img_list + '\'"/>';
            return brand_img_list;
        } else {
            var no_img_list = '<img src="' + str_img_list + '" class="brand_images_list"/>';
            return no_img_list;
        }
    },
    linkCompany: function(dept, companyCode, companyId, windCode, buryParam) {
        var tmpCode = companyCode && windCode ? "" : companyCode;
        var otherBuryParam = Common.buryFromParam();
        buryParam = buryParam ? buryParam + otherBuryParam : otherBuryParam;
        if (buryParam.indexOf('fromPageUId') == -1) {
            buryParam = buryParam + '&fromPageUId=' + buryFCode.getPageUId();
        }
        var f9OrClient = 'jump to f9 ';
        try {
            var url = "/WealthManagementServer/Wind.WFC.Enterprise.Web/PC.Front/Company/Company.html?companyid={CompanyId}&companycode={CompanyCode}&windCode={windCode}&from=open" + dept + buryParam;
            window.external.ClientFunc(JSON.stringify({
                isGlobal: 1,
                func: 'opencompanyf9',
                companyId: companyId,
                companyCode: tmpCode,
                windCode: windCode,
                URL: url
            }), function(ret) {
                var obj = JSON.parse(ret);
                //中台按DELPHI约定，obj.result不为0，代表成功，这点要特别注意
                if (obj && obj.result && obj.result != 0) {} else {
                    //obj.result等于0，代表未找到企业，现在的模块不会走这条路
                    Common.f9Jump(dept, companyCode, buryParam);
                }
                if (obj && obj.windCode === null) {
                    // 非上市企业
                    if (obj && obj.result && (obj.result == 1400 || obj.result == '1400')) {
                        //代表进入终端F9
                        var otherParam = buryFCode.paramBuryJson('jumpf9', buryParam);
                        buryFCode.buryFunJumpOther('loading', 'detailView', 'company', otherParam);
                    }
                } else {
                    //代表进入上市企业终端F9模块
                    var otherParam = buryFCode.paramBuryJson('jumpf9', buryParam);
                    buryFCode.buryFunJumpOther('loading', 'detailView', 'company', otherParam);
                }
            });
        } catch (e) {
            //如果终端版本过老，通过调用funcError自行处理
            Common.f9Jump(dept, companyCode, buryParam);
        }
        return false;
    },
    f9Jump: function(dept, companyCode, buryParam) {
        buryParam = buryParam ? buryParam : '';
        if (companyCode) {
            var url = "../Company/Company.html?companycode=" + companyCode + Common.isNoToolbar() + "&from=open" + dept + buryParam;
            window.open(url);
        } else {
            layer.msg('未找到企业');
        }
    },
    f9JumpfromTw: function(dept, companyCode, country, buryParam) {
        buryParam = buryParam ? buryParam : '';
        if (companyCode) {
            var url = "../Company/Company.html?companycode=" + companyCode + Common.isNoToolbar() + "&from=open" + dept + "&country=" + encodeURIComponent(country) + buryParam;
            window.open(url);
        } else {
            layer.msg('未找到企业');
        }
    },
    JumpfromCountry: function(dept, companyCode, country, buryParam) {
        buryParam = buryParam ? buryParam : '';
        if (companyCode) {
            var url = "../Company/CompanyGlobal.html?companycode=" + companyCode + Common.isNoToolbar() + "&from=open" + dept + "&country=" + encodeURIComponent(country) + buryParam;
            window.open(url);
        } else {
            layer.msg('未找到企业');
        }
    },
    jumpwithBury: function(data, itemId, otherCss, pingParam) {
        var result = '';
        if (itemId) {
            if (itemId.length < 16) {
                result = '<a class="' + otherCss + ' underline wi-secondary-color wi-link-color" data-code="' + itemId + '" data-name="' + data + '" target="_blank" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
            } else {
                result = '<a class="' + otherCss + ' underline wi-secondary-color wi-link-color" data-code="' + itemId + '" data-name="' + data + '" target="_blank" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
            }
        } else {
            result = Common.formatCont(data);
        }
        return result;
    },
    /**
     * 是否需要隐藏toolbar
     * 通过search参数notoolbar=1控制
     */
    isNoToolbar: function() {
        var notoolbar = Common.getUrlSearch("notoolbar");
        var parentNoToolBar = '';
        try {
            parentNoToolBar = Common.getUrlSearch('notoolbar', window.opener ? window.opener.location.href : '');
        } catch (e) {
            parentNoToolBar = '';
        }
        if (notoolbar == 1 || parentNoToolBar == 1) {
            // 如果确定含有参数, 替换原方法
            Common.isNoToolbar = function() {
                return '&notoolbar=1';
            }
            return '&notoolbar=1';
        }
        return '';
    },
    /**
     * 获取字符串字节长度
     */
    getByteLen: function(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) {
                len += 1;
            } else {
                len += 2;
            }
        }
        return len;
    },
    /**
     * 获取WFT终端版本信息
     */
    getWFTVersion: function() {
        var version = null;
        try {
            var ipresult = ((window.external && window.external.ClientFunc) ? window.external.ClientFunc("{ func=querydata, isGlobal=1, name='version2' }") : null);
            if (ipresult != null) {
                version = eval("(" + ipresult + ")").result;
                version = version ? version - 0 : version;
            }
        } catch (ex) {}
        Common.getWFTVersion = function() {
            return version;
        }
        return version;
    },
    /**
     * 获取历史搜索记录
     * 参数klass为对象，用于接收返回的数据list
     */
    getCommonHistoryKey: function(klass) {
        myWfcAjax("gethistorykey", { pcstatus: "0" }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0) {
                if (Object.prototype.toString.call(klass) === '[object Array]') {
                    /**
                     * 注意此处Array对象需要改变原值，而不是改变引用                    
                     */
                    klass.length = 0;
                    res.Data[0]['HotWord'].forEach(function(t) {
                        klass.push(t);
                    });
                    // 一般使用以下写法，此处由于数组元素为对象类型，不能使用简单的join处理
                    // klass.splice(0, 0, res.Data[0]['HotWord'].join(','))
                } else if (Object.prototype.toString.call(klass) === '[object Object]') {
                    klass && (klass._historySearchList = res.Data[0]['HotWord']);
                }
            }
        });
    },
    /**
     * 获取图谱查询历史记录
     * klass, 对象
     * cmd, cmd
     * params, 参数
     */
    getCommonMapHistory: function(klass, cmd, key, params) {
        myWfcAjax(cmd, params, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0) {
                if (Object.prototype.toString.call(klass) === '[object Object]') {
                    klass && (klass._historySearchObj[key] = res.Data);
                }
            }
        });
    },
    /**
     * 预搜索
     * 需要判断当前输入框中value与ajax搜索的key是否同一个，如果不是，直接return
     */
    getPreSearch: function(keyword, successFun, getCurSearchKey) {
        myWfcAjax("presearch", { key: keyword }, function(data) {
            var res = JSON.parse(data);
            var keyForSearch = res.Data.searchkey;
            var curSearchKey = null;

            //bury
            if (res && res.ErrorCode == "0" && res.Data) {
                var activeType = 'preSearch';
                var opEntity = "company";
                var otherParam = null;
                if (res.Data.queryStringParams) {
                    otherParam = { 'queryStringParams': JSON.stringify(res.Data.queryStringParams), 'fromModule': 'preSearch', 'funcType': 'preSearchCk', 'inputItem': keyForSearch };
                } else {
                    otherParam = { 'fromModule': 'preSearch', 'funcType': 'preSearchCk', 'inputItem': keyForSearch };
                }

                buryFCode.bury(activeType, opEntity, otherParam);
            }

            if (getCurSearchKey && (typeof getCurSearchKey === 'function')) {
                curSearchKey = getCurSearchKey();
            }
            if (keyForSearch && curSearchKey && (keyForSearch !== curSearchKey)) {
                return false;
            }
            if (res.ErrorCode == '0') {
                successFun(res.Data);
            } else {
                successFun({});
            }
        });
    },
    /**
     * 预搜索
     * 需要判断当前输入框中value与ajax搜索的key是否同一个，如果不是，直接return
     */
    getPreGlobalSearch: function(param, successFun, getCurSearchKey) {
        myWfcAjax("getglobalcompanysearch", param, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0') {
                successFun(res.Data);
            } else {
                successFun({});
            }
        });
    },
    /**
     * 垂直的联想搜索等(商标、政策法规)
     */
    getVertThinkSearch: function(param, successFun) {
        myWfcAjax('getcompletedword', param, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' || res.ErrorCode == 0) {
                // 接口正常则
                successFun(res.Data);
            } else {
                successFun({});
            }
        });
    },
    /**
     * 预搜索后，特殊标签，跳转至高级搜索
     */
    redirectToAdviceSearch: function(url, tag) {
        var storage = window.localStorage;
        if (storage.selStorage) {
            storage.removeItem("selStorage");
        }
        storage.selStorage = 'companyFeature=' + tag;
        window.open(url);
    },
    /**
     * canvas、d3 svg保存图片
     * selector：目标元素
     * name：图片名称前缀
     * dType：1,2,3 1-canvas类型 2-d3 svg类型 3-cytoscape类型
     * sData: 原始img数据
     */
    saveCanvasImg: function(selector, name, dType, sData, pwidth, pheight) {

        var name = name || '全球企业库';
        var originalImage = null; // 目标img
        var targetEle = null; // 目标画布元素
        var targetImageData = null; // 目标画布图片数据
        var svgXml = null; // svg xml信息

        // 水印
        var shuiying = new Image();
        shuiying.src = '../resource/images/Company/sy.png?t=' + (Date.now()).toString();
        shuiying.width = 200;
        shuiying.height = 115;

        originalImage = new Image();

        // 移除已有jietu遮罩
        if ($('[data-id="jietuMask"]')) {
            $('[data-id="jietuMask"]').remove();
        }
        var jietuMask = document.createElement("div");
        $(jietuMask).attr('data-id', 'jietuMask');
        $(jietuMask).attr('style', 'position: fixed; background: #fff; z-index: 3000; top: 0px; bottom: 0px; left: 0px; right: 0px;');

        if (dType === 3) {
            if (sData) {
                originalImage.onload = function(e) {
                    var canvas = document.createElement('canvas'); //准备空画布
                    canvas.width = originalImage.width;
                    canvas.height = originalImage.height;
                    var context = canvas.getContext('2d'); //取得画布的2d绘图上下文
                    context.fillStyle = "#fff";
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    shuiying.onload = function() {
                        $(jietuMask).css('display', 'none');
                        context.drawImage(originalImage, 0, 0);

                        setTimeout(function() {
                            context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
                            var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!';
                            context.font = "14px 微软雅黑";
                            context.fillStyle = "#aaaaaa";
                            context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20);
                            downloadimg(name, canvas);
                        }, 100)

                    }
                }
                document.body.appendChild(jietuMask);
                originalImage.src = sData;
            }
            return;
        } else if (dType === 2) {
            var svgWidth = d3.select(selector + ' svg').attr('width');
            var svgHeight = d3.select(selector + ' svg').attr('height');
            var svgScale = window._CompanyChart.zoom.scale();
            var svgTranslate = window._CompanyChart.zoom.translate();

            if (pwidth && pheight) {
                window._CompanyChart.zoom.translate([20, 20]);
                window._CompanyChart.container.attr("transform", "translate(" + window._CompanyChart.zoom.translate() + ")scale(" + window._CompanyChart.zoom.scale() + ")");
                d3.select('svg').attr('width', pwidth);
                d3.select('svg').attr('height', pheight);
            } else {
                window._CompanyChart.zoom.scale(1);
                window._CompanyChart.zoom.translate([3600 / 2, 3000 / 2]);
                window._CompanyChart.container.attr("transform", "translate(" + window._CompanyChart.zoom.translate() + ")scale(" + window._CompanyChart.zoom.scale() + ")");
                d3.select('svg').attr('width', 3600);
                d3.select('svg').attr('height', 3600);
            }

            // d3 svg 图形
            targetEle = d3.select(selector + ' svg'); // 要保存的图片元素
            svgXml = $(selector).html();
            originalImage.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));

        } else {
            // canvas
            targetEle = $(selector); // 要保存的图片元素
            targetImageData = $(selector)[0].toDataURL();
            originalImage.src = sData || targetImageData;

            originalImage.onload = function(e) {
                document.body.appendChild(jietuMask);
                var canvas = document.createElement('canvas'); //准备空画布
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                var context = canvas.getContext('2d'); //取得画布的2d绘图上下文
                context.fillStyle = "#fff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                shuiying.onload = function() {
                    $(jietuMask).css('display', 'none');
                    context.drawImage(originalImage, 0, 0);

                    setTimeout(function() {
                        context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
                        var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!';
                        context.font = "14px 微软雅黑";
                        context.fillStyle = "#aaaaaa";
                        context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20);
                        downloadimg(name, canvas);
                    })
                }
            }

            return;
        }

        /**
         * 生成img
         * 
         * @param {any} selector , canvas元素选择符
         * @param {any} dType , dType
         */
        function saveImg(selector, dType) {

            document.body.appendChild(jietuMask);

            setTimeout(function() {
                var canvas = document.createElement('canvas'); //准备空画布
                canvas.width = pwidth || targetEle.attr('width');
                canvas.height = pheight || targetEle.attr('height');

                if (dType === 2) {
                    window._CompanyChart.zoom.scale(svgScale);
                    window._CompanyChart.zoom.translate(svgTranslate);
                    window._CompanyChart.container.attr("transform", "translate(" + window._CompanyChart.zoom.translate() + ")scale(" + window._CompanyChart.zoom.scale() + ")");
                    d3.select('svg').attr('width', svgWidth);
                    d3.select('svg').attr('height', svgHeight);
                }

                $(jietuMask).css('display', 'none');
                var context = canvas.getContext('2d'); //取得画布的2d绘图上下文
                context.fillStyle = "#fff";
                context.fillRect(0, 0, canvas.width, canvas.height);

                // 水印
                try {
                    shuiying.onload = function() {
                        context.drawImage(originalImage, 0, 0);
                        if (dType === 2) {
                            context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 28, 200, 57); // x,y,w,h
                        } else {
                            context.drawImage(shuiying, canvas.width / 2 - 100, canvas.height / 2 - 57, 200, 57); // x,y,w,h
                        }
                        var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!';
                        context.font = "14px 微软雅黑";
                        context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20);
                        downloadimg(name, canvas);
                    }
                } catch (e) {
                    context.drawImage(originalImage, 0, 0);
                    var marker = '基于公开信息和第三方数据利用大数据技术独家计算生成!';
                    context.font = "14px 微软雅黑";
                    context.fillText(marker, canvas.width / 2 - context.measureText(marker).width / 2, canvas.height - 20);
                    downloadimg(name, canvas);
                }
            }, 10);
        }

        /**
         * 将canvas保存本地img
         * 
         * @param {any} name , img前缀
         * @param {any} canvas , canvas对象
         */
        function downloadimg(name, canvas) {
            var qual = 0.8; // 图片质量
            if (canvas.width > 5000) {
                qual = 0.4;
            } else if (canvas.width > 3000) {
                qual = 0.5;
            } else if (canvas.width > 2000) {
                qual = 0.6;
            }
            if (canvas.height > 20000) {
                qual = 0.1;
            } else if (canvas.height > 10000) {
                qual = 0.2;
            } else if (canvas.height > 5000) {
                qual = 0.4;
            } else if (canvas.height > 2000) {
                qual = qual < 0.5 ? qual : 0.5;
            } else if (canvas.height > 1000) {
                qual = qual < 0.6 ? qual : 0.6;
            }
            //设置保存图片的类型
            var imgdata = canvas.toDataURL('image/jpeg', qual);
            var filename = name + '_' + new Date().toLocaleDateString() + '.jpeg';
            var a = document.createElement('a')
            var event = new MouseEvent('click');
            a.download = filename;
            a.href = imgdata;
            a.dispatchEvent(event)
        }

        saveImg(selector, dType);
    },
    /**
     * echart2保存图片
     */
    saveEchart2Img: function(chart, name, eleParam) {
        // 移除已有jietu遮罩
        if ($('[data-id="jietuMask"]')) {
            $('[data-id="jietuMask"]').remove();
        }

        $(eleParam).show();
        var jietuMask = document.createElement("div");
        $(jietuMask).attr('data-id', 'jietuMask');
        $(jietuMask).attr('style', 'position: fixed; background: #fff; z-index: 1000; top: 0px; bottom: 0px; left: 0px; right: 0px;');
        document.body.appendChild(jietuMask);

        var width = 1440;
        var height = 900;

        var minX = 0;
        var maxX = 0;
        var minY = 300;
        var maxY = 0;
        var moveDown = 0;
        var moveRight = 0;

        var shapeList = chart.getZrender().storage.getShapeList();
        for (var i = 0; i < shapeList.length; i++) {
            if (shapeList[i].style && shapeList[i].style.iconType == 'rectangle') {
                if (shapeList[i].style.x > maxX) {
                    maxX = shapeList[i].style.x;
                }
                if (shapeList[i].style.x < minX) {
                    minX = shapeList[i].style.x;
                }
                if (shapeList[i].style.y > maxY) {
                    maxY = shapeList[i].style.y;
                }
                if (shapeList[i].style.y < minY) {
                    minY = shapeList[i].style.y;
                }
            }
        }

        if ((maxX - minX + 300) > width) {
            width = maxX - minX + 300;
            moveRight = -(maxX + minX - chart.getZrender().getWidth() + 146) / 2;

        }
        if ((maxY - minY + 300) > 900) {
            height = maxY - minY + 300;
        }

        moveDown = -(maxY + minY - chart.getZrender().getHeight()) / 2 - 85;

        var layer = chart.getZrender().painter._layers[1];
        var bS = layer.scale.concat();
        var bP = layer.position.concat();

        layer.scale = [1, 1, 0, 0];
        layer.position = [0, 0];

        var owidth = $(eleParam).width();
        var oheight = $(eleParam).height();

        $(eleParam).width(width);
        $(eleParam).height(height);
        $(eleParam).hide();

        chart.resize();

        chart.getZrender().painter.refresh();

        Common.initZrender(chart);

        layer.position[0] = moveRight;
        layer.position[1] = moveDown;

        var Rectangle = require('zrender/shape/Rectangle');
        var Text = require('zrender/shape/Text');
        var ImageShape = require('zrender/shape/Image');

        // TODO 背景色
        // var shape1 = new Rectangle({
        //     style: {
        //         x: -1000 - moveRight,
        //         y: -1000 - moveDown,
        //         width: width + 1000,
        //         height: height + 1000,
        //         color: '#fff'
        //     }
        // });
        // shape1.zlevel = 1;
        // shape1.z = -2;
        // shape1.ndelete = true;
        // chart.getZrender().addShape(shape1);


        // TODO 水印
        // for (var i = 0; i < width + 100; i += 300) {
        //     for (var j = 0; j < height + 100; j += 228) {
        //         var shapeSy = new ImageShape({
        //             style: {
        //                 image: '/resource/images/Company/sy.png',
        //                 x: i - moveRight,
        //                 y: j - moveDown,
        //                 width: 300,
        //                 height: 228

        //             }
        //         });
        //         shapeSy.zlevel = 1;
        //         shapeSy.z = -1;
        //         shapeSy.ndelete = true;
        //         chart.getZrender().addShape(shapeSy);
        //     }
        // }

        // TODO 说明文字
        // var shape3 = new Text({
        //     style: {
        //         x: width / 2 - 165 - moveRight,
        //         y: height - 30 - moveDown,
        //         text: '基于公开信息和第三方数据利用大数据技术独家计算生成',
        //         strokeColor: '#999',
        //         color: '#999',
        //         textFont: 'normal 12px 微软雅黑',
        //         lineWidth: 0,
        //     }
        // });
        // shape3.zlevel = 1;
        // shape3.z = -1;
        // shape3.ndelete = true;
        // chart.getZrender().addShape(shape3);

        setTimeout(function() {
            var sel = $(eleParam).selector;
            var canvas = $(sel + ' canvas')[0];
            var imgdata = canvas.toDataURL();
            $(eleParam).width(owidth);
            $(eleParam).height(oheight);
            chart.resize();
            layer.scale = bS;
            layer.position = bP;
            chart.getZrender().painter.refresh();
            Common.initZrender(chart);
            Common.saveCanvasImg(sel + ' canvas', name, 1, imgdata);
            $(eleParam).show();
            $(jietuMask).css('display', 'none');
        }, 200);
    },
    /**
     * 图谱：数据结构变化
     * @param 初始data
     * @return 变更后数据结构：节点集合、连线集合，节点对象、连线对象
     */
    chartAllDataChange: function(data) {
        var paths = data.paths;
        var nodeObj = {}; // node 对象，有唯一key
        var routeObj = {}; // route 对象，有唯一key
        var nodes = []; // node arr
        var links = []; // route arr

        for (var i = 0; i < paths.length; i++) {
            var nodeInPath = paths[i].nodes;
            if (nodeInPath.length > 3) {
                nodeInPath.length = 3;
            }
            for (var j = 0; j < nodeInPath.length; j++) {
                var node = nodeInPath[j];
                if (!nodeObj[node.windId]) {
                    nodeObj[node.windId] = node;
                    nodes.push(node);
                } else {
                    nodeObj[node.windId].level = node.level;
                }
            }
        }

        for (var i = 0; i < data.routes.length; i++) {
            var route = data.routes[i];
            var startId = route.startId;
            var endId = route.endId;
            var _routeId = route.startId + '_' + route.endId;
            route._routeId = _routeId;
            if (nodeObj[startId] && nodeObj[endId]) {
                links.push(route);
            }
            if (!routeObj[_routeId]) {
                routeObj[_routeId] = route;
            }
        }
        return { nodes: nodes, routes: links, nodeObj: nodeObj, routeObj: routeObj };
    },
    /**
     * 图谱：路径数据结构变化
     * @param 原始paths
     * @return 变更后数据结构：节点对应的path对象、关联关系路径对象、所有path对象、企业状态path对象
     */
    chartPathChange: function(paths) {

        var pathObj = {}; // 所有的点对应的path对象，key为节点id
        var filterPathObj = {}; // 所有的label obj,key为label, 关联关系 
        var allPathObj = {}; // 所有的path obj,key为pathid
        var statePathObj = {}; // 所有的state obj,key为state, 企业状态

        var txtObj = {
            'actctrl': '控制',
            'branch': '分支机构',
            'invest': '投资',
            'legalrep': '法人',
            'member': '高管',
            'investctrl': '控股'
        }

        for (var j = 0; j < paths.length; j++) {
            var nodes = paths[j].nodes;
            var node = nodes[nodes.length - 1];
            var routes = paths[j].routes;

            var _p = '';
            for (var m = 0; m < nodes.length; m++) {
                _p = _p ? _p + '|' + nodes[m].windId : nodes[m].windId;
            }

            if (!allPathObj[_p]) {
                paths[j]._pathId = _p;
                allPathObj[_p] = paths[j];
            }

            if (!pathObj[node.windId]) {
                pathObj[node.windId] = { arr: [], obj: {} };
                pathObj[node.windId].arr.push(nodes);
                pathObj[node.windId].obj[_p] = nodes;
                pathObj[node.windId].obj[_p]._path = routes;
            } else {
                pathObj[node.windId].arr.push(nodes);
                pathObj[node.windId].obj[_p] = nodes;
                pathObj[node.windId].obj[_p]._path = routes;
            }

            routes.forEach(function(t) {
                var _routeId = t.startId + '_' + t.endId;
                t._routeId = _routeId;
                var types = t.relType.split('|'); // invest|member

                t.filters = {};
                t.filtersWithPercent = {}; // 带投资、控股比例的字段

                types.forEach(function(type) {
                    filterPathObj[type] = filterPathObj[type] || [];
                    filterPathObj[type].push(paths[j]);
                    var txt = txtObj[type] || '';
                    if (type === 'member') {
                        txt = t.props.member_props.position;
                    }
                    t.filters[type] = { show: true, txt: txt };
                    t.filtersWithPercent[type] = { show: true, txt: txt };
                    if (type === 'invest' || type === 'actctrl' || type === 'investctrl') {
                        var p = t.props[type + '_props'].rate || '';
                        p = p ? Common.formatPercent(p) : '';
                        t.filtersWithPercent[type] = { show: true, txt: p ? txt + '(' + p + ')' : txt };
                    }
                })
            })

            nodes.forEach(function(t) {
                var id = t.windId;
                if (t.nodeType !== 'company') {
                    return;
                }
                if (!statePathObj[id]) {
                    statePathObj[id] = [];
                    statePathObj[id].push(paths[j])
                } else {
                    statePathObj[id].push(paths[j])
                }
            })
        }

        return { pathObj: pathObj, filterPathObj: filterPathObj, allPathObj: allPathObj, statePathObj: statePathObj };
    },
    /**
     * 疑似关系
     */
    relationChartInitFun: function(root, params, eleParam, heightParam, levelParam, hideParam) {
        var nodes;
        var links;
        var cy;
        var imgServerIp;

        // TODO 使用ip去获取图片资源地址
        $.client.getServerIP('wfcweb', function(ret) {
            imgServerIp = ret;
        });

        function maoRefresh() {
            // cy.reset();
            // cy.center(cy.$('#' + nodeCenter));
            // var vData = {};
            // $.extend(true, vData, rootData);
            // drawGraph(vData);
            $('.btn-search').trigger('click')
        }

        function getData() {
            drawGraph(root);
        }
        var nodeCenter = params.code;
        // ycye.cecil modify UI颜色 2020-10-26 start
        var colorCenter = '#f68717';
        var colorRY = '#e05d5d';
        var colorQT = '#2277a2';
        var colorDebt = '#8862ac';
        var colorIpo = '#63a074';
        // ycye.cecil modify UI颜色 2020-10-26 end
        var colorLeft = '#e26012';
        var colorRight = '#e26012';
        var colorLink = '#fbd14c';

        var allColor = '#666666';
        // ycye.cecil modify UI颜色 2020-10-26 start
        var allColors = ['#2277a2', '#f68717', '#5fbebf', '#e05d5d', '#4a588e', '#e4c557', '#63a074', '#906f54', '#9da9b4', '#8862ac'];
        // ycye.cecil modify UI颜色 2020-10-26 end
        var allColorsObj = {
            'actctrl': {
                idx: 0,
                txt: '控制',
                props: null,
            },
            'address': {
                idx: 1,
                txt: '',
                // txt: '地址',
                // props: 'address',
                props: null
            },
            'branch': {
                idx: 2,
                txt: '分支机构',
                props: null,
            },
            'domain': {
                idx: 3,
                txt: '',
                // txt: '域名',
                // props: 'domain',
                props: null
            },
            'invest': {
                idx: 4,
                txt: '投资',
                props: null,
            },
            'legalrep': {
                idx: 5,
                txt: '法人',
                props: null,
            },
            'member': {
                idx: 6,
                txt: '高管',
                props: 'position',
            },
            'tel': {
                idx: 7,
                txt: '',
                // txt: '电话',
                // props: 'tel',
                props: null
            },
            'email': {
                idx: 8,
                txt: '',
                // txt: '邮件',
                // props: 'email',
                props: null
            },
            'investctrl': {
                idx: 9,
                txt: '控股',
                props: null
            }
        };

        function drawGraph(data) {

            var clientWidth = window.document.body.clientWidth;

            // 关联路径探查
            var eles = [];
            var activeNode;
            var moveTimeer;
            var _isFocus = false;

            data.entities = []
            data.route = []

            data.nodes.forEach(function(t) {
                var node = {};
                if (t.windId == nodeCenter) {
                    if (t.nodeType == 'person') {
                        node = {
                            "Id": t.windId,
                            "Name": t.nodeName || '目标人物',
                            "Type": t.nodeType,
                            "rootNode": true,
                            color: colorCenter,
                            imgId: t.imageIdT || ''
                        }
                    } else {
                        node = {
                            "Id": t.windId,
                            "Name": t.nodeName || '目标公司',
                            "Type": t.nodeType,
                            "rootNode": true,
                            color: colorCenter
                        }
                    }
                } else if (t.nodeType == 'person') {
                    node = {
                        "Id": t.windId,
                        "Name": t.nodeName || 'N/A',
                        "category": t.nodeType,
                        color: colorRY,
                        imgId: t.imageIdT || ''
                    }
                } else if (t.nodeType == 'email' || t.nodeType == 'domain' || t.nodeType == 'address' || t.nodeType == 'tel') {
                    node = {
                        "Id": t.windId,
                        "Name": t.nodeName || 'N/A',
                        "category": t.nodeType,
                        color: colorLink
                    }
                } else {
                    node = {
                        "Id": t.windId,
                        "Name": t.nodeName || 'N/A',
                        "category": t.nodeType
                    }
                    if (t.isListed == 'true') {
                        node.color = colorIpo;
                        node.isListed = true;
                    } else if (t.isIssued == 'true') {
                        node.color = colorDebt;
                        node.isIssued = true;
                    } else {
                        node.color = colorQT;
                    }
                }
                var len = node.Name.length;
                // 文本长度在15以内 不处理
                // 中文超过15处理
                // 英文超过30处理
                if (len > 16) {
                    var cnLen = 0;
                    for (var j = 0; j < len; j++) {
                        // 遍历判断字符串中每个字符的Unicode码,大于255则为中文
                        if (node.Name.charCodeAt(j) > 255) {
                            cnLen += 1;
                        }
                    }
                    var enLen = len - cnLen;
                    var charLen = cnLen * 2 + enLen;
                    node.charLength = cnLen * 2 + enLen;
                }
                eles.push({
                    data: {
                        id: node.Id,
                        name: node.Name,
                        category: t.nodeType,
                        color: node.color,
                        isListed: node.isListed,
                        isIssued: node.isIssued,
                        imgId: node.imgId || '',
                        charLength: node.charLength || null
                    }
                });
                data.entities.push(node);
            })
            delete data.nodes;
            data.routes.forEach(function(link) {

                var type = link.relType.split('|');
                var label = '';
                var props = link.props;
                var color = '';

                if (type.length > 1) {
                    for (var _i = 0; _i < type.length; _i++) {
                        var t = type[_i];
                        var propObj = link.props[t + '_props'];
                        var prop = '';
                        var _label = '';

                        if (allColorsObj[t]) {
                            prop = allColorsObj[t].props ? propObj[allColorsObj[t].props] : '';
                            _label = allColorsObj[t].txt;
                        }

                        if (t === 'member') {
                            _label = prop;
                        }

                        if (label) {
                            label = label + ', ' + _label;
                        } else {
                            label = _label;
                        }
                    }
                    eles.push({
                        data: {
                            source: link.startId,
                            target: link.endId,
                            label: label,
                            _label: label,
                            color: allColor,
                            sourceNode: link.sourceNode,
                            endNode: link.targetNode,
                            _routeId: link._routeId
                        },
                        classes: 'autorotate'
                    });
                } else {

                    if (allColorsObj[link.relType]) {
                        if (allColorsObj[link.relType].props) {
                            var propObj = link.props ? link.props[link.relType + '_props'] : null;
                            props = propObj ? propObj[allColorsObj[link.relType].props] : '';
                            color = allColors[allColorsObj[link.relType].idx];
                        } else {
                            props = '';
                            color = allColors[allColorsObj[link.relType].idx];
                        }
                        label = allColorsObj[link.relType].txt;
                    } else {
                        label = '';
                        props = '';
                        color = allColor;
                    }

                    if (link.relType === 'member') {
                        label = props;
                    }

                    eles.push({
                        data: {
                            source: link.startId,
                            target: link.endId,
                            label: label,
                            _label: label,
                            color: color,
                            sourceNode: link.sourceNode,
                            endNode: link.targetNode,
                            _routeId: link._routeId
                        },
                        classes: 'autorotate'
                    });
                }
                data.route.push(link)
            });
            delete data.routes;
            data.routes = data.route;
            delete data.route;
            cy = cytoscape({
                container: eleParam,
                motionBlur: false,
                textureOnViewport: false,
                wheelSensitivity: 0.1,
                elements: eles,
                minZoom: 0.6,
                maxZoom: 1.6,
                layout: {
                    name: 'cose',
                    fit: false,
                    componentSpacing: 40,
                    nestingFactor: 12,
                    padding: 10,
                    edgeElasticity: 800,
                    idealEdgeLength: function(edge) {
                        return 10;
                    },
                    ready: function() {
                        $("#screenArea").css("cursor", "pointer");
                        var nodeLength = cy.collection("node").length;
                        if (nodeLength < 8) {
                            cy.zoom({ level: 1.4 })
                        } else if (nodeLength >= 8 && nodeLength < 16) {
                            cy.zoom({ level: 1.3 })
                        } else if (nodeLength >= 15 && nodeLength < 25) {
                            cy.zoom({ level: 1.1 })
                        } else {
                            cy.zoom({ level: 1.01 })
                        }
                        //默认显不显示关系文字，比如“董事”
                        if (!cy.txtHide) {
                            cy.collection("edge").addClass("hidetext")
                        }
                    },
                    sort: function(a, b) {
                        return b.data('category') - a.data('category')
                    }
                },
                style: [{
                        // 节点初始状态
                        selector: 'node',
                        style: {
                            shape: 'ellipse',
                            width: function(ele) {
                                if (ele.data('charLength') && ele.data('charLength') > 31) {
                                    return 77 + (ele.data('charLength') - 30) * 1;
                                }
                                if (ele.data("category") == "person") {
                                    return 56;
                                } else if (ele.data("category") == "email" || ele.data("category") == "domain" || ele.data("category") == "address" || ele.data("category") == "tel") {
                                    return 47;
                                } else {
                                    return 77;
                                }
                            },
                            height: function(ele) {
                                if (ele.data('charLength') && ele.data('charLength') > 31) {
                                    return 77 + (ele.data('charLength') - 30) * 1;
                                }
                                if (ele.data("category") == "person") {
                                    return 56;
                                } else if (ele.data("category") == "email" || ele.data("category") == "domain" || ele.data("category") == "address" || ele.data("category") == "tel") {
                                    return 47;
                                } else {
                                    return 77;
                                }
                            },
                            'background-color': function(ele) {
                                return ele.data('color')
                            },
                            'background-image': function(ele) {
                                // if (ele.data('id') === nodeCenter && ele.data("category") == 'company') {
                                //     return '../resource/images/chart/c-company.png';
                                // } else if (ele.data('id') === nodeCenter && ele.data("category") == "person") {
                                //     return '../resource/images/chart/c-person.png';
                                // } else if (ele.data("category") == "person") {
                                //     return '../resource/images/chart/person.png';
                                // } else if (ele.data("category") == "email") {
                                //     return '../resource/images/chart/email.png';
                                // } else if (ele.data("category") == "domain") {
                                //     return '../resource/images/chart/url.png';
                                // } else if (ele.data("category") == "address") {
                                //     return '../resource/images/chart/address.png';
                                // } else if (ele.data("category") == "tel") {
                                //     return '../resource/images/chart/tel.png';
                                // } else {
                                //     return '../resource/images/chart/company.png';
                                // }
                                if (!global_isRelease) {
                                    return 'none';
                                } else {
                                    var imgId = ele.data('imgId');
                                    if (imgId && imgServerIp) {
                                        return imgId;
                                    } else {
                                        return 'none';
                                    }
                                }
                            },
                            // 'background-image-crossorigin': 'no', // TODO 单独加的字段
                            'background-fit': 'cover cover',
                            'background-width': '100%',
                            'background-height': '100%',
                            'background-image-opacity': 0.8,
                            'border-color': function(ele) {
                                if (!global_isRelease) {
                                    return '#fff';
                                } else {
                                    var imgId = ele.data('imgId');
                                    if (imgId && imgServerIp) {
                                        return 'red'
                                    } else {
                                        return '#fff';
                                    }
                                }
                            },
                            'border-width': 4,
                            'border-opacity': function(ele) {
                                if (!global_isRelease) {
                                    return 0;
                                } else {
                                    var imgId = ele.data('imgId');
                                    if (imgId && imgServerIp) {
                                        return 0.5
                                    } else {
                                        return 0;
                                    }
                                }
                            },
                            label: function(ele) {
                                var label = ele.data("name");
                                if (label.indexOf(' ') > 0) {
                                    var arr = label.split(' ');
                                    var tmp = ''
                                    for (var i = 0; i < arr.length; i++) {
                                        tmp += (tmp ? '\n' + arr[i] : arr[i]);
                                    }
                                    label = tmp;
                                    // label = label ? label.replace(/(.{5})(?=.)/g, '$1\n') : 'N/A';
                                } else {
                                    label = label ? label.replace(/(.{5})(?=.)/g, '$1\n') : 'N/A';
                                }
                                return label;
                            },
                            // 'text-outline-color': 'lime',
                            // 'text-outline-width': '5',
                            // 'text-outline-opacity': '0.2',
                            // 'text-border-width': '5',
                            // 'text-border-style': 'solid',
                            // 'text-border-color': 'lime',
                            // 'text-border-opacity': 1,
                            // 'ghost': 'yes',
                            // 'ghost-opacity': 1,
                            // 'ghost-offset-x': 20,
                            // 'ghost-offset-y': 20,
                            // 'text-margin-y': 3,
                            'z-index-compare': 'manual',
                            'z-index': 20,
                            color: "#fff",
                            'font-size': function() {
                                return 14;
                            },
                            'font-family': 'MicroSoft YaHei',
                            'text-wrap': 'wrap',
                            // 'text-max-width': 60,
                            'text-halign': 'center',
                            'text-valign': 'center',
                            'overlay-color': '#fff',
                            'overlay-opacity': 0,
                            "background-opacity": 1,
                            // 'border-width': 10,
                            // 'border-opacity': 0.1,
                            // 'border-style': 'solid',
                            // 'border-color': function(ele) {
                            // if (ele.data('id') === CompanyChart.companyCode) {
                            //     return colorDQ
                            // } else if (ele.data("category") == "person") {
                            //     return colorRy
                            // } else {
                            //     return colorQT
                            // }
                            // return '#666666'
                            // }
                        }
                    },
                    {
                        // 连线初始状态
                        selector: 'edge',
                        style: {
                            "line-style": 'solid',
                            'curve-style': 'bezier',
                            'control-point-step-size': 20,
                            'target-arrow-shape': 'triangle-backcurve',
                            'target-arrow-color': function(ele) {
                                return "#666666";
                            },
                            'arrow-scale': 0.5,
                            'line-color': function(ele) {
                                return ele.data("color");
                            },
                            'background-color': function(ele) {
                                return ele.data("color");
                            },
                            'width': 0.3,
                            'overlay-color': '#fff',
                            'overlay-opacity': 0,
                            label: function(ele) {
                                return ele.data("label");
                            },
                            'text-opacity': 1,
                            'font-size': 12,
                            'font-family': 'MicroSoft YaHei',
                            'color': function(ele) {
                                return allColor;
                            },
                        }
                    },
                    {
                        // 边上的文字旋转样式
                        "selector": ".autorotate",
                        "style": {
                            // 边上的文字是否跟随边旋转
                            // "edge-text-rotation": "autorotate"                                    
                        }
                    },
                    {
                        selector: '.nodeActive',
                        style: {
                            'background-color': function(ele) {
                                return ele.data('color')
                            },
                            'border-color': function(ele) {
                                if (ele.data('id') === nodeCenter) {
                                    return colorCenter;
                                } else if (ele.data("category") == "person") {
                                    return colorRY
                                } else if (ele.data("category") == "address" || ele.data("category") == "domain" || ele.data("category") == "email" || ele.data("category") == "tel") {
                                    return colorLink
                                } else {
                                    if (ele.data('isListed')) {
                                        return colorIpo;
                                    } else if (ele.data('isIssued')) {
                                        return colorDebt;
                                    } else {
                                        return colorQT
                                    }
                                }
                            },
                            'border-width': 10,
                            'border-opacity': 0.5,
                            width: function(ele) {
                                if (ele.data('charLength') && ele.data('charLength') > 31) {
                                    return 79 + (ele.data('charLength') - 30) * 1;
                                }
                                if (ele.data("category") == "person") {
                                    return 56;
                                } else if (ele.data("category") == "company") {
                                    return 79;
                                } else {
                                    return 45;
                                }
                            },
                            height: function(ele) {
                                if (ele.data('charLength') && ele.data('charLength') > 31) {
                                    return 79 + (ele.data('charLength') - 30) * 1;
                                }
                                if (ele.data("category") == "person") {
                                    return 53;
                                } else if (ele.data("category") == "company") {
                                    return 79;
                                } else {
                                    return 43;
                                }
                            },
                        }
                    },
                    {
                        selector: '.nodeHide',
                        style: {
                            opacity: 0,
                            'z-index': 999,
                        }
                    },
                    {
                        selector: '.edgeHide',
                        style: {
                            opacity: 0
                        }
                    },
                    {
                        selector: '.edgeShow',
                        style: {
                            'color': '#666666',
                            'text-opacity': 1,
                            'font-weight': 400,
                            label: function(ele) {
                                return ele.data("label");
                            },
                            'font-size': 12,
                        }
                    },
                    {
                        // 初始状态 线条颜色；鼠标悬浮node时 线条颜色；
                        selector: '.edgeActive',
                        style: {
                            "line-style": 'solid',
                            "arrow-scale": 0.8,
                            'width': 1.5,
                            'color': '#666666',
                            'text-opacity': 1,
                            'font-size': 12,
                            'font-weight': '600',
                            'text-background-color': '#fff',
                            'text-background-opacity': 1,
                            "source-text-margin-y": 20,
                            "target-text-margin-y": 20,
                            'z-index-compare': 'manual',
                            'z-index': 19,
                            'line-color': function(ele) {
                                return ele.data("color");
                            },
                            'target-arrow-color': function(ele) {
                                return ele.data("color");
                            },
                            label: function(ele) {
                                return ele.data("label");
                            }
                        }
                    },
                    {
                        selector: '.hidetext',
                        style: { 'text-opacity': 0 }
                    },
                    {
                        selector: ".dull",
                        style: { "z-index": 1, opacity: 0.2 }
                    },
                    { selector: ".nodeHover", style: { shape: "ellipse", "background-opacity": 0.9 } },
                    { selector: ".lineFixed", style: { "overlay-opacity": 0 } }
                ],
            });

            cy.txtHide = hideParam ? true : false; // 隐藏txt，默认隐藏关联关系

            // 画布点击动作
            cy.on("click", function(a) {
                if (a.target === cy) {
                    _isFocus = false;
                    activeNode = null;
                    cy.collection("node").removeClass("nodeActive");
                    cancelHighLight();
                }
            });

            // cy画布上 鼠标按下动作
            cy.on('mousedown', function() {
                var coreStyle = cy.style()._private.coreStyle;
                coreStyle['active-bg-color'].value = [0, 255, 0];
                coreStyle['active-bg-size'].pfValue = 0;
                event.stopPropagation();
                event.preventDefault();
            });

            // 节点点击
            // cy.on('tap', 'node', function(evt) {
            cy.on('click', 'node', function(evt) {
                var node = evt.target;
                if (node._private.style['z-index'].value == 20) {
                    _isFocus = true;
                    highLight([node._private.data.id], cy);
                    if (node.hasClass("nodeActive")) {
                        activeNode = null;
                        node.removeClass("nodeActive");
                        cy.collection("edge").removeClass("edgeActive");
                    } else {
                        activeNode = node;
                        cy.collection("node").removeClass("nodeActive");
                        cy.collection("edge").removeClass("edgeActive");
                        node.addClass("nodeActive");
                        node.neighborhood("edge").removeClass("opacity");
                        node.neighborhood("edge").addClass("edgeActive");
                        node.neighborhood("edge").connectedNodes().removeClass("opacity");
                    }
                } else {
                    _isFocus = false;
                    activeNode = null;
                    cy.collection("node").removeClass("nodeActive");
                    cancelHighLight();
                }
            });

            // node节点上，鼠标按下动作(先于click，顺序大致为：vmosedown-tap-click)
            cy.on("vmousedown", "node", function(a) {
                a = a.target;
                if (!_isFocus) {
                    highLight([a._private.data.id], cy)
                }
            });
            // node节点上，鼠标点击(或拖动)释放动作
            cy.on("tapend", "node", function(a) {
                if (!_isFocus) {
                    cancelHighLight()
                }
            });

            // 边线点击
            cy.on("click", "edge", function(a) {
                _isFocus = false;
                activeNode = null;
                cy.collection("node").removeClass("nodeActive");
                cancelHighLight()
            });

            // 节点：鼠标悬浮
            cy.on('mouseover', 'node', function(evt) {
                var node = evt.target;
                if (node._private.style['z-index'].value == 20) {
                    node.addClass("nodeHover");
                    if (!_isFocus) {
                        cy.collection("edge").removeClass("edgeShow");
                        cy.collection("edge").removeClass("edgeActive");
                        node.neighborhood("edge").addClass("edgeActive");
                    }
                    // if (moveTimeer) {
                    //     clearTimeout(moveTimeer);

                    // setTimeout(function() {
                    //     var b = evt.originalEvent || window.event,
                    //         b = "<div class='tips' style='font-size:12px;background:white;box-shadow:0px 0px 3px #999;border-radius:1px;opacity:1;padding:1px;padding-left:8px;padding-right:8px;display:none;position: absolute;left:" + (b.clientX +
                    //             10) + "px;top:" + (b.clientY + 10) + "px;'>" + node._private.data.name + "</div>";
                    //     $("body").append($(b));
                    //     $(".tips").fadeIn()
                    // }, 600);
                    // }
                }
                /* if (moveTimeer) {
                    clearTimeout(moveTimeer);
                }

                //cy.collection("edge").removeClass("edgeShow");
                cy.collection("edge").removeClass("edgeActive");
                node.neighborhood("edge").addClass("edgeActive");
                //node.neighborhood("edge").connectedNodes().removeClass("opacity"); 
                if (activeNode) {
                    activeNode.neighborhood("edge").addClass("edgeActive");
                } */
            });
            // 节点：鼠标移出
            cy.on('mouseout', 'node', function(evt) {
                // console.log('mouseout-node-1')
                // if (moveTimeer) {
                //     clearTimeout(moveTimeer);
                // }
                evt.target.removeClass("nodeHover");

                if (!_isFocus) {
                    cy.collection("edge").removeClass("edgeActive")
                }

                /* moveTimeer = setTimeout(function() {
                    cy.collection("edge").addClass("edgeActive");
                    //cy.collection("edge").addClass("edgeShow");
                }, 300);
                if (activeNode) {
                    activeNode.neighborhood("edge").addClass("edgeActive");
                } */
            });
            // 线：鼠标移出
            cy.on('mouseover', 'edge', function(evt) {
                // console.log('mouseover-edge-1')
                if (!_isFocus) {
                    var edge = evt.target;
                    cy.collection("edge").removeClass("edgeActive");
                    edge.addClass("edgeActive")
                    edge.removeClass("hidetext");
                }

                /* var edge = evt.target;
                if (moveTimeer) {
                    clearTimeout(moveTimeer);
                }
                cy.collection("edge").removeClass("edgeActive");
                edge.addClass("edgeActive");
                if (activeNode) {
                    activeNode.neighborhood("edge").addClass("edgeActive");
                } */
            });
            // 线：鼠标移出
            cy.on('mouseout', 'edge', function(evt) {
                // console.log('mouseout-edge-1')
                var edge = evt.target;
                if (!_isFocus) {
                    edge.removeClass("edgeActive");
                    activeNode && activeNode.neighborhood("edge").addClass("edgeActive")

                    if (!cy.txtHide) {
                        edge.addClass("hidetext");
                    }
                }

                /*  var edge = evt.target;
                 edge.removeClass("edgeActive");
                 moveTimeer = setTimeout(function() {
                     cy.collection("edge").addClass("edgeActive");
                     //cy.collection("edge").addClass("edgeShow");
                 }, 300);
                 if (activeNode) {
                     activeNode.neighborhood("edge").addClass("edgeActive");
                 } */
            });

            /* cy.on('tap', function(event) {                        
                // target holds a reference to the originator
                // of the event (core or element)
                var evtTarget = event.target;

                if (evtTarget === cy) {
                    activeNode = null;
                    cy.collection("node").removeClass("nodeActive");
                    //cy.collection("edge").addClass("edgeActive");
                } else {
                    console.log('tap on some element');
                }
            }); */

            cy.nodes().positions(function(a, b) {
                if (a._private.data.id === nodeCenter) {
                    return { x: 900, y: 900 }
                } else {
                    cy.pan({ x: clientWidth / 2, y: 100 });
                }
            });

            cy.ready(function() {
                if (levelParam) {
                    cy.zoom({ level: levelParam });
                } else {
                    var len = cy.collection("node").length;
                    if (len > 100) {
                        cy.zoom({ level: 0.8 });
                    } else if (len > 50) {
                        cy.zoom({ level: 0.9 });
                    } else {
                        cy.zoom({ level: 1.0000095043745896 });
                    }
                }

                setTimeout(function() {
                    cy.collection("edge").addClass("lineFixed")
                }, 400)

                $("#load_data").hide();

                // cy.$('#' + CompanyChart.companyCode).emit('tap');
                cy.center(cy.$('#' + nodeCenter));
                cy.$('#' + nodeCenter)[0]._isRoot = true;
            });
            cy.nodes(function(a) {})

            cy.on('zoom', function() {
                if (!cy.txtHide) {
                    if (cy.zoom() < 0.5) {
                        cy.collection("node").addClass("hidetext");
                    } else {
                        cy.collection("node").removeClass("hidetext");
                    }
                }
                setTimeout(function() {
                    cy.collection("edge").removeClass("lineFixed");
                    cy.collection("edge").addClass("lineFixed")
                }, 200)
            })

            cy.on("pan", function() {
                setTimeout(function() {
                    cy.collection("edge").removeClass("lineFixed");
                    cy.collection("edge").addClass("lineFixed")
                }, 200)
            });

            function highLight(c, b) {
                b.collection("node").removeClass("nodeActive");
                b.collection("edge").removeClass("edgeActive");
                b.collection("node").addClass("dull");
                b.collection("edge").addClass("dull");
                for (var a = 0; a < c.length; a++) {
                    var d = c[a];
                    b.nodes(function(a) {
                        if (a._private.data.id == d) {
                            a.removeClass("dull");
                            a.neighborhood("edge").removeClass("dull");
                            a.neighborhood("edge").addClass("edgeActive");
                            a.neighborhood("edge").connectedNodes().removeClass("dull");
                        }
                    })
                }
            }

            function cancelHighLight() {
                cy.collection("node").removeClass("nodeActive");
                cy.collection("edge").removeClass("edgeActive");
                cy.collection("node").removeClass("dull");
                cy.collection("edge").removeClass("dull")
            }

            cy._reload = maoRefresh;
        }

        function resizeScreen() {
            $(eleParam).parent('#screenArea').height(heightParam);
            $(eleParam).height($(eleParam).parent('#screenArea').height());
        }
        resizeScreen();
        getData();

        return cy;
    },
    /**
     * 股权穿透
     */
    shareHolderAndInvestChartInitFun: function(chart, rootData, rootCode, rootName) {
        var option = null,
            treeId = 1;
        //对根节点高度进行控制
        var rootChangeTop = { "x": "50%", "y": "50%" }
        if (rootData.shareHolderTree && !rootData.investTree) {
            rootChangeTop.y = '65%';
        } else if (!rootData.shareHolderTree && rootData.investTree) {
            rootChangeTop.y = '20%';
        }
        // 初始化股权
        if (!rootData.shareHolderTree) {
            rootData.shareHolderTree = {
                Id: rootCode,
                name: '',
                children: null,
                depth: 0,
                type: 'company'
            };
        }
        transTree(rootData.shareHolderTree, 'Id', rootCode, 'stockShare');
        initTree(rootData.shareHolderTree, rootCode);

        // 初始化投资
        treeId = 1;
        if (!rootData.investTree) {
            rootData.investTree = {
                Id: rootCode,
                name: '',
                children: null,
                depth: 0,
                type: 'company'
            };
        }
        transTree(rootData.investTree, 'Id', rootCode, 'parentStockShare', true);
        initTree(rootData.investTree, rootCode);

        drawTheMap();

        function drawTheMap() {
            chart.clear();
            chart._innerOption = option = { // _innerOption记录option
                series: []
            };
            if (rootData.shareHolderTree) {
                option.series.push({
                    type: "tree",
                    orient: "vertical",
                    nodePadding: 25,
                    layerPadding: 40,
                    symbol: "circle",
                    roam: 'move',
                    rootLocation: rootChangeTop,
                    direction: "inverse",
                    data: [rootData.shareHolderTree]
                });
            }
            if (rootData.investTree) {
                option.series.push({
                    type: "tree",
                    orient: "vertical",
                    nodePadding: 25,
                    layerPadding: 40,
                    symbol: "circle",
                    roam: 'move',
                    rootLocation: rootChangeTop,
                    data: [rootData.investTree]
                })
            }
            chart.setOption(option);
            Common.initZrender(chart);
            Common.animatieChart(chart);

            chart.getZrender().on("mousedown", function(e) {});
            chart.getZrender().on("mouseup", function(e) {});
            chart.getZrender().on("mousemove", function(e) {});

            function selfClickHandler(e) {
                if (e.data.code && e.data.type === 'company') {
                    Common.chartCardEventHandler({ companyCode: e.data.code, title: '企业信息', type: 'company', name: e.data.name, redirect: chart._wind_redirect || false })
                } else if (e.data.code && e.data.type == 'person') {
                    Common.chartCardEventHandler({ companyCode: e.data.code, title: '人物信息', type: 'person', name: e.data.name, redirect: chart._wind_redirect || false })
                }
            }

            chart.on('click', selfClickHandler);

            chart.getZrender().on('click', function(e) {
                if (e.target && e.target.clickcom) {
                    if (e.target.children || e.target._children) {
                        // troggleTree(e.target.code, e.target.treeId);
                        troggleTree(e.target.code, e.target.treeId, e.event.clientX, e.event.clientY, e.target);
                    }
                }
            });

            chart.on('restore', function(param) {
                getNode(rootData.investTree);
                getNode(rootData.shareHolderTree);

                function getNode(data) {
                    if (data.children) {
                        for (var i = 0; i < data.children.length; i++) {
                            getNode(data.children[i]);
                        }
                    }
                    if (data.children && data.children.length > 0 && data.code && data.code != rootCode) {
                        data._children = data.children;
                        data.children = null;
                        data.extend = 1;
                    }
                }
                chart.clear();
                chart.setOption(option);
                Common.initZrender(chart);
                Common.animatieChart(chart);
            });
        }

        /**
         * 数据结构转换
         * 
         * @param {any} data 原始数据
         * @param {any} key 节点键值
         * @param {any} rootCode 根节点Code
         * @param {any} ratioKey 比例字段
         * @param {any} tag 股权结构、对外投资区分(true)
         */
        function transTree(data, key, rootCode, ratioKey, tag) {
            data.treeId = treeId;
            data.code = data[key];

            if (tag) {
                data.isTZ = true; // 投资
            } else {
                data.isGD = true; // 股东
            }

            var children = data.children;
            var fontSize = 15;
            var color = '#333';

            if (data.code !== rootCode) {
                if (!data.name) {
                    data.name = '--';
                }
                // 名称超长字体换小号
                if (data.name.length > 21) {
                    fontSize = 12;
                    data.name = data.name.match(/(.{1,9})/g).join('\n') // 名称7个字换行
                } else {
                    data.name = data.name.match(/(.{1,7})/g).join('\n') // 名称7个字换行
                }
            } else {
                color = '#00AEC7';
            }

            // ycye.cecil modify UI颜色 2020-10-27 start
            var colorIpo = '#63a074';
            var colorDebt = '#8662ac';
            var borderColor = '#2277a2';
            // ycye.cecil modify UI颜色 2020-10-27 end
            // TODO 区分处理
            // 如果为个人，颜色区分，且不可点击
            if (data.listed || data.listed == 'true') {
                // 上市                
                borderColor = colorIpo;
            } else if (data.issued || data.issued == 'true') {
                // 发债
                borderColor = colorDebt;
            }

            if (data.type && data.Id) {
                data.labelClick = true;
            } else {
                data.labelClick = false;
            }

            var statusColor = '#f4f4f4'; // 异常状态企业

            data.symbol = 'rectangle';
            data.clickable = true;
            data.symbolSize = [120, 62];
            data.itemStyle = {
                normal: {
                    borderRadius: '50%',
                    color: "#fff",
                    // color: (data.type == 'company') ? (data.status ? (data.status.indexOf('存续') > -1 ? '#fff' : statusColor) : (data.reg_status && data.reg_status.indexOf('存续') > -1 ? '#fff' : statusColor)) : '#fff',
                    borderWidth: "2",
                    borderColor: borderColor,
                    label: {
                        show: true,
                        position: "inside",
                        textStyle: {
                            color: color,
                            fontFamily: "MicroSoft YaHei",
                            fontSize: fontSize,
                            fontStyle: "normal",
                        },
                    }
                },
                emphasis: {
                    color: borderColor,
                    borderWidth: 0,
                    label: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontFamily: "MicroSoft YaHei",
                            fontSize: fontSize,
                            fontStyle: "normal"
                        },
                    }
                }
            };

            if (children && children.length) {
                for (var i = 0; i < children.length; i++) {
                    transTree(children[i], key, rootCode, ratioKey, tag);
                    var tmp = children[i];
                    var Ratio = children[i][ratioKey] = children[i][ratioKey] ? children[i][ratioKey] + '' : '';
                    if (Ratio == '-777.777') {
                        Ratio = '';
                    } else if (Ratio) {
                        Ratio = (parseFloat(children[i][ratioKey]).toFixed(4)) * 10000 / 10000 + '%';
                    } else {
                        Ratio = '--'
                    }
                    children[i] = {
                        name: !tmp._rateHide ? Ratio : '', // 显示/隐藏 持股比例信息
                        _name: Ratio, // 记录持股比例
                        symbol: "arrowdown",
                        symbolSize: [10, 20],
                        tooltip: {
                            show: false
                        },
                        clickable: false,
                        hoverable: false,
                        itemStyle: {
                            normal: {
                                color: "#333",
                                borderWidth: 0,
                                label: {
                                    show: true,
                                    position: "right",
                                    textStyle: {
                                        fontFamily: "MicroSoft YaHei",
                                        fontSize: fontSize,
                                        fontStyle: "normal",
                                    },
                                }
                            },
                            emphasis: {
                                color: "#333",
                                borderWidth: 0,
                                label: {
                                    show: true,
                                    position: "right",
                                    textStyle: {
                                        fontFamily: "MicroSoft YaHei",
                                        fontSize: fontSize,
                                        fontStyle: "normal",
                                    },
                                }
                            }
                        },
                        children: [tmp]
                    }
                }
            } else {
                data.children = [];
            }
            treeId++;
        }

        /**
         * 初始化树，默认展开两层数据，需要将子孙节点收缩处理
         * 
         * @param {any} data 数据
         * @param {any} rootCode 根节点Code
         */
        function initTree(data, rootCode) {
            data.labelClick = false;
            data.clickable = false;
            if (data.depth == 0) {
                data.name = data.name || rootName;
            }
            data.symbolSize = [data.name.length * 16 + 40, 50];
            data.symbol = 'rectangle';
            var color = '#000'
            if (data.code == rootCode) {
                // ycye.cecil modify UI颜色 2020-10-27 start
                color = '#2277a2'
                    // ycye.cecil modify UI颜色 2020-10-27 end
            }
            data.itemStyle = {
                normal: {
                    color: "#fff",
                    borderWidth: "2",
                    // ycye.cecil modify UI颜色 2020-10-27 start
                    borderColor: "#2277a2",
                    // ycye.cecil modify UI颜色 2020-10-27 end
                    label: {
                        show: true,
                        position: "inside",
                        textStyle: {
                            color: color,
                            fontFamily: "MicroSoft YaHei",
                            fontSize: 16,
                            fontStyle: "normal",
                        },
                    }
                },
                emphasis: {
                    color: "#fff",
                    borderWidth: "2",
                    borderColor: "#50AFC6",
                }
            };
            getNode(data);

            function getNode(data) {
                if (data.children) {
                    for (var i = 0; i < data.children.length; i++) {
                        getNode(data.children[i]);
                    }
                }
                if (data.children && data.children.length > 0 && data.code && data.code != rootCode) {
                    data._children = data.children;
                    data.children = null;
                    data.extend = 1;
                }
            }
        }

        function troggleTree(code, tid, x, y, t) {
            if (code == rootCode) {
                return;
            }
            // 持股比例显示/隐藏，默认显示，即字段_rateHide = false
            var rateHide = rootData.shareHolderTree._rateHide ? true : false;
            getNode(rootData.shareHolderTree);
            getNode(rootData.investTree);

            function getNode(data) {
                if (data.code && data.code == code && data.treeId == tid) {
                    if (data.children) {
                        hideRate(data, rateHide);
                        data._children = data.children;
                        data.children = null;
                        data.extend = 1;
                    } else if (data._children) {
                        data.children = data._children;
                        data._children = null;
                        data.extend = 2;
                        hideRate(data, rateHide);
                    }
                    return;
                }
                if (data.children) {
                    for (var i = 0; i < data.children.length; i++) {
                        getNode(data.children[i]);
                    }
                }
            }

            /**
             * 显示/隐藏所有子节点中的持股比例信息
             * 
             * @param {any} data 
             * @param {any} hideVal 
             */
            function hideRate(data, hideVal) {
                if (data.children) {
                    for (var i = 0; i < data.children.length; i++) {
                        hideRate(data.children[i], hideVal);
                    }
                }
                if (data.symbol === 'arrowdown') {
                    data.name = (hideVal ? '' : data._name);
                }
            }

            chart.clear();
            chart.setOption(option);
            Common.initZrender(chart);
        }
    },
    /**
     * 新 股权穿透图
     */
    newShareHolderAndInvestChartInitFun: function(data, companyName, rootCode) {
        var vData = JSON.stringify(data.Data);
        var rootData = data.Data;
        rootData.name = companyName || '目标公司';
        rootData.children = [];
        // 数据结构转换
        var changeDataSchema = function(data) {
            data.isup = 1;
            if (data.children && data.children.length) {
                for (var i = 0; i < data.children.length; i++) {
                    var t = data.children[i];
                    changeDataSchema(t);
                }
            }
            return data;
        };
        // 初始化股权
        if (!rootData.shareHolderTree) {
            rootData.shareHolderTree = {
                Id: rootCode,
                name: '',
                children: null,
                depth: 0,
                type: 'company'
            };
        }
        // 1 将股权数据统一放置上方 添加isup标识
        rootData.shareHolderTree = changeDataSchema(rootData.shareHolderTree);
        // 2 将股权、投资的子节点依次放置到根节点后      
        rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length && rootData.shareHolderTree.children.map(function(t) {
            rootData.children.push(t);
        })
        rootData.investTree && rootData.investTree.children && rootData.investTree.children.length && rootData.investTree.children.map(function(t) {
            rootData.children.push(t);
        })
        rootData.x0 = 0;
        rootData.y0 = 0;
        delete rootData.investTree;
        delete rootData.shareHolderTree;
        // 3 隐藏底层节点
        changeChildrenData(rootData.children);

        function changeChildrenData(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].children && data[i].children.length) {
                    data[i]._children = data[i].children;
                    data[i].children = null;
                    delete data[i].children;
                    changeChildrenData(data[i]._children);
                }
            }
        }

        // 绘制
        function drawTree(targetNode) {
            var nodes = tree.nodes(rootData);
            nodes.forEach(function(t, e) {
                if (t.depth) {
                    t.height = lineHeight;
                    t.balance = 0;
                } else {
                    t.height = baseHeight;
                    t.balance = 5;
                }
                if (t.isup) {
                    t.upId = ++upIdx;
                } else {
                    t.downId = downIdx++;
                }
                t.nwidth = nodeWidth;
                t.x = t.isup ? (-1 * t.upId) * (t.height + paddingHeight) : (t.downId) * (t.height + paddingHeight);
                t.textleft = t._children || t.children ? x0 + 15 : x0;
            });

            // i
            var nodeUpdate = svg.svg.selectAll("g.node-tree").data(nodes, function(t) {
                if (t.isup) {
                    upHeight = upHeight < t.x ? upHeight : t.x;
                }
                return t.mid || (t.mid = ++idx);
            });
            // n
            var enterZone = nodeUpdate.enter()
                .append("g")
                .attr("class", "node-tree")
                .attr("transform",
                    // 原参数 e
                    function(e) {
                        if (e.isup) {
                            upHeight = upHeight < e.x ? upHeight : e.x;
                        }
                        return "translate(" + targetNode.y0 + "," + targetNode.x0 + ")";
                    }).style("opacity", 1e-6)
                .on("click", toggleEvent);

            enterZone.append("rect")
                .attr("class", "basicrect")
                .attr("y", calcHeight)
                .attr("height", getHeight)
                .attr("width", getWidth)
                .attr("stroke-width", "1px")
                .attr("stroke", "#e0e0e0")
                .attr("fill", "#ffffff")
                .attr("fill-opacity", ".5");

            enterZone.append("rect")
                .attr("class", "rectleft")
                .attr("y", calcHeight)
                .attr("fill", calcColor)
                .attr("stroke", calcColor)
                .attr("height", getHeight)
                .attr("width", r);

            // r
            var enterNodes = enterZone.append("g")
                .attr("class", "company-top");

            // // --------------------------------------------------------------------------------------
            // // 实际控制人 标识
            // var tagCtrlRects = enterNodes.append('rect')
            //     .filter(function(t) {
            //         return t.listed;
            //     })
            //     .attr("class", "corp_tag_ctrl")
            //     .attr("x", function(t) {
            //         if (t.name && t.name.length) {
            //             return t.textleft + t.name.length * 14 + 10;
            //         } else {
            //             return t.textleft + 10;
            //         }
            //     })
            //     .attr("y", function(t) {
            //         return t.depth ? -18 : -5;
            //     })
            //     .attr("height", 20)
            //     .attr("width", 68)
            //     .attr("fill", "#a48f28")
            //     .attr("fill-opacity", "0.2");
            // var tagCtrlTexts = enterNodes.append("text")
            //     .filter(function(t) {
            //         return t.listed;
            //     })
            //     .attr("class", "testtext")
            //     .attr("fill", "#a48f28")
            //     .attr("font-size", "12px")
            //     .attr("y", function(t) {
            //         return t.depth ? -4 : 10;
            //     }).attr("x", function(t) {
            //         if (t.name && t.name.length) {
            //             return t.textleft + t.name.length * 14 + 15;
            //         } else {
            //             return t.textleft + 15;
            //         }
            //     })
            // tagCtrlTexts.append("tspan")
            //     .text(function(t) {
            //         return '实际控制人';
            //     });

            // // --------------------------------------------------------------------------------------
            // // 最终受益人 标识
            // var tagFinalRects = enterNodes.append('rect')
            //     .filter(function(t) {
            //         return t.listed;
            //     })
            //     .attr("class", "corp_tag_final")
            //     .attr("x", function(t) {
            //         if (t.name && t.name.length) {
            //             return t.textleft + t.name.length * 14 + 10;
            //         } else {
            //             return t.textleft + 10;
            //         }
            //     })
            //     .attr("y", function(t) {
            //         return t.depth ? -18 : -5;
            //     })
            //     .attr("height", 20)
            //     .attr("width", 68)
            //     .attr("fill", "#a48f28")
            //     .attr("fill-opacity", "0.2");
            // var tagFinalTexts = enterNodes.append("text")
            //     .filter(function(t) {
            //         return t.listed;
            //     })
            //     .attr("class", "testtext")
            //     .attr("fill", "#a48f28")
            //     .attr("font-size", "12px")
            //     .attr("y", function(t) {
            //         return t.depth ? -4 : 10;
            //     }).attr("x", function(t) {
            //         if (t.name && t.name.length) {
            //             return t.textleft + t.name.length * 14 + 15;
            //         } else {
            //             return t.textleft + 15;
            //         }
            //     })
            // tagFinalTexts.append("tspan")
            //     .text(function(t) {
            //         return '最终受益人';
            //     });

            // --------------------------------------------------------------------------------------
            // 上市 标识
            var tagIpoRects = enterNodes.append('rect')
                .filter(function(t) {
                    return t.listed;
                })
                .attr("class", "corp_tag_ipo")
                .attr("x", function(t) {
                    if (t.name && t.name.length) {
                        return t.textleft + t.name.length * 14 + 10;
                    } else {
                        return t.textleft + 10;
                    }
                })
                .attr("y", function(t) {
                    return t.depth ? -18 : -5;
                })
                .attr('ry', 2)
                .attr('rx', 2)
                .attr("height", 20)
                .attr("width", 68)
                .attr("fill", "#a48f28")
                .attr("fill-opacity", "0.2");
            var tagIpoTexts = enterNodes.append("text")
                .filter(function(t) {
                    return t.listed;
                })
                .attr("class", "ipotext")
                .attr("fill", "#a48f28")
                .attr("font-size", "12px")
                .attr("y", function(t) {
                    return t.depth ? -3 : 10;
                }).attr("x", function(t) {
                    if (t.name && t.name.length) {
                        return t.textleft + t.name.length * 14 + 20;
                    } else {
                        return t.textleft + 20;
                    }
                })
            tagIpoTexts.append("tspan")
                .text(function(t) {
                    return '上市企业';
                });

            // --------------------------------------------------------------------------------------
            // 发债标识
            var tagDebtRects = enterNodes.append('rect')
                .filter(function(t) {
                    return t.issued;
                })
                .attr("class", "corp_tag_debt")
                .attr("x", function(t) {
                    var distance = 10;
                    if (t.listed) {
                        distance = 90;
                    }
                    if (t.name && t.name.length) {
                        return t.textleft + t.name.length * 14 + distance;
                    } else {
                        return t.textleft + distance;
                    }
                })
                .attr("y", function(t) {
                    return t.depth ? -18 : -5;
                })
                .attr('ry', 2)
                .attr('rx', 2)
                .attr("height", 20)
                .attr("width", 68)
                .attr("fill", "#7d609a")
                .attr("fill-opacity", "0.2");
            var tagDebtTexts = enterNodes.append("text")
                .filter(function(t) {
                    return t.issued;
                })
                .attr("class", "debttext")
                .attr("fill", "#7d609a")
                .attr("font-size", "12px")
                .attr("y", function(t) {
                    return t.depth ? -3 : 10;
                }).attr("x", function(t) {
                    var distance = 20;
                    if (t.listed) {
                        distance = 100;
                    }
                    if (t.name && t.name.length) {
                        return t.textleft + t.name.length * 14 + distance;
                    } else {
                        return t.textleft + distance;
                    }
                })
            tagDebtTexts.append("tspan")
                .text(function(t) {
                    return '发债企业';
                });

            // a
            var enterTxts = enterNodes.append("text")
                .attr("class", "company")
                .attr("fill", "#000")
                .attr("font-size", "14px")
                .attr("font-weight", "bold")
                .attr("y", function(t) {
                    if (t.groupMember != undefined && t.parentStockShare == -777.777) { //集团系第1层公司 name高度处理
                        return 6;
                    }
                    return t.depth ? -4 : 10;
                }).attr("x", function(t) {
                    return t.textleft;
                });

            enterTxts.append("tspan")
                .text(function(t) {
                    t.name = t.name || '';
                    var txt = t.name || '';
                    // 股东类型（工商、有限售、无限售等）
                    // 控制文字长度 (15 -20)
                    if (t.sh_type) {
                        if (t.name.length > 15) {
                            txt = t.name.substring(0, 15) + '...';
                        }
                    } else {
                        if (t.name.length > 20) {
                            txt = t.name.substring(0, 20) + '...';
                        }
                    }
                    return txt;
                });

            // 股东类型 不加粗显示
            enterTxts.append("tspan")
                .attr("class", "nobold")
                .attr("font-weight", "normal")
                .text(function(t) {
                    return t.sh_type ? "(" + t.sh_type + ")" : "";
                });

            // 为了计算控制人标识图片而计算 如不需要可一同去除
            enterTxts.each(function(t) {
                t.width = this.clientWidth - t.textleft * 2;
            });

            enterNodes.append("text")
                .filter(function(t) {
                    return !t.depth;
                })
                .attr("fill", "#00aec7")
                .attr("font-size", "13px")
                .attr("dy", 9)
                .attr("dx", function(t) {
                    return (getWidth(t) - 10 - 30 - 30);
                })
                .append("tspan")
                .text(intl('40513', '详情'))
                .on('click', function(t) {
                    Common.linkCompany('Bu3', CompanyChart.companyCode);
                });

            // // 控制人标识
            // enterNodes.append("svg:image")
            //     .filter(function(t) {
            //         // return t.depth && t.actualHolding;
            //         return t.depth === 1;
            //     })
            //     .attr("x", function(t) {
            //         // 计算图片位置
            //         return t.width + t.textleft + 10;
            //     })
            //     .attr("y", -14)
            //     .attr("width", 12)
            //     .attr("height", 12)
            //     .attr("xlink:href", "../../images/control.png");

            // 详情(非根节点)
            enterNodes.append("text")
                .filter(function(t) {
                    return t.depth;
                })
                .attr("fill", "#00aec7")
                .attr("font-size", "13px")
                .attr("dy", 9)
                .attr("dx", function(t) {
                    return (getWidth(t) - 10 - 30);
                })
                .append("tspan")
                .text(intl('40513', '详情'))
                .on('click', function(t) {
                    if (t.type === 'person') {
                        // window.open('Person.html?id=' + t.Id + '&name=' + t.name)
                    } else {
                        Common.linkCompany('Bu3', t.Id);
                    }
                });

            // 持股比例
            enterNodes.append("text")
                .filter(function(t) {
                    return t.depth;
                })
                .attr("class", "size")
                .attr("fill", "#333")
                .attr("font-size", "13px")
                .attr("dy", 20)
                .attr("dx", function(t) {
                    return t.textleft;
                })
                // .attr("dy", -5)
                // .attr("dx", function(t) {
                //     if (t.name && t.name.length) {
                //         return t.textleft + t.name.length * 14 + 10;
                //     } else {
                //         return t.textleft + 10;
                //     }
                // })
                .append("tspan")
                // .text("持股比例：")
                .text(function(t) {
                    if (t.groupMember != undefined && t.parentStockShare == -777.777) { //集团系第1层公司 name高度处理
                        return '';
                    }
                    return '持股比例：';
                })
                .append("tspan")
                .attr("class", "count")
                .attr("fill", "#fe7e17")
                .text(function(t) {
                    var Ratio = t.parentStockShare;
                    if (Ratio == -777.777) {
                        Ratio = '';
                    } else if (Ratio) {
                        Ratio = (parseFloat(Ratio).toFixed(4)) * 10000 / 10000 + '%';
                    } else {
                        Ratio = '--'
                    }
                    return Ratio;
                });

            // 展开、收缩 按钮图标
            enterZone.append("circle")
                .filter(function(t) {
                    return (t._children && t._children.length) || (t.children && t.children.length);
                })
                .attr("class", "folderc")
                .attr("stroke-width", "0.5px")
                .attr("stroke", "#888")
                .attr("fill", "transparent")
                .attr("cx", x0).attr("cy", otherHeight)
                .attr("r", theR);

            // 展开、收缩 按钮图标 内 +/- 号  横向线条
            enterZone.append("line")
                .attr("class", "line-h")
                .filter(function(t) {
                    return (t._children && t._children.length) || (t.children && t.children.length);
                })
                .attr("x1", x0 - xR)
                .attr("y1", otherHeight)
                .attr("x2", x0 + xR)
                .attr("y2", otherHeight)
                .attr("stroke", "#888")
                .attr("stroke-width", 0.5);


            // 展开、收缩 按钮图标 内 +/- 号  纵向线条
            enterZone.append("line").attr("class", "line-v")
                .filter(function(t) {
                    return (t._children && t._children.length) || (t.children && t.children.length);
                })
                .attr("x1", x0)
                .attr("y1", function(t) {
                    return t.height == lineHeight ? -xR : 5 - xR;
                })
                .attr("x2", x0)
                .attr("y2", function(t) {
                    return t.height == lineHeight ? -xR : 5 - xR;
                })
                .attr("stroke", "#888")
                .attr("stroke-width", 0.5);


            // 以下为动画渐入渐出效果
            enterZone.transition().duration(len)
                .attr("transform", function(t) {
                    return "translate(" + t.y + "," + t.x + ")";
                })
                .style("opacity", 1);

            nodeUpdate.transition().duration(len)
                .attr("transform", function(t) {
                    return "translate(" + t.y + "," + t.x + ")";
                })
                .style("opacity", 1).select("line.line-v")
                .attr("y2", function(t) {
                    return t._children ? xR + t.balance : -xR + t.balance;
                });

            nodeUpdate.exit().transition().duration(len)
                .attr("transform", function(e) {
                    return "translate(" + targetNode.y + "," + targetNode.x + ")";
                }).style("opacity", 1e-6).remove();

            // o 
            // 连接线
            var linkUpdate = svg.svg.selectAll("path.link")
                .data(tree.links(nodes), function(t) {
                    // if (t.target.stock > 50) { return null; }
                    return t.target.mid;
                });

            linkUpdate.enter()
                .insert("path", "g")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#e0e0e0")
                .attr("stroke-width", "1px")
                .attr("d", function(e) {
                    var node = {
                        x: targetNode.x0,
                        y: targetNode.y0
                    };
                    return diagonal({
                        source: node,
                        target: node
                    });
                })
                .transition()
                .duration(len)
                .attr("d", diagonal);

            linkUpdate.transition()
                .duration(len)
                .attr("d", diagonal);

            // exit
            linkUpdate.exit().transition()
                .duration(len)
                .attr("d", function(e) {
                    var node = {
                        x: targetNode.x,
                        y: targetNode.y
                    };
                    return diagonal({
                        source: node,
                        target: node
                    });
                }).remove();

            nodes.forEach(function(t) {
                t.x0 = t.x;
                t.y0 = t.y;
            });
        }

        var svgWidth = 0,
            svgHeight = 0;
        var svg = {};
        // ycye.cecil modify UI颜色 2020-10-26 start
        var globalColors = ['#2277a2', '#f68717', '#5fbebf', '#e05d5d', '#4a588e', '#e4c557', '#63a074', '#906f54', '#9da9b4', '#8862ac'];
        // ycye.cecil modify UI颜色 2020-10-26 end
        var lineHeight = 62; // L   基础行高
        var baseHeight = 48; // F  首行高度    
        var nodeWidth = 460;
        var border = {
            top: 20,
            right: 10,
            bottom: 10,
            left: 10
        }; // A
        var tree = d3.layout.tree().nodeSize([0, 60]); // j
        var diagonal = d3.svg.diagonal().projection(function(t) {
            return [t.y, t.x];
        }); // q
        window._CompanyChart = window._CompanyChart || {};
        var zoom = window._CompanyChart.zoom = d3.behavior.zoom().scaleExtent([1, 1]).on("zoom", zoomed); // U
        var idx = 0; // V
        var upIdx = 0;
        var downIdx = 0;
        var upHeight = 0;
        var r = 4; // E  颜色图例宽度
        var theR = 6; // R 半径
        var x0 = 20; //B
        var xR = 4; // N
        var paddingHeight = 3; // O
        var len = 400; // 过渡时间

        // 放大/缩小
        function zoomed() {
            svg.svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        // 计算高度
        function calcHeight(t) {
            return t.height == lineHeight ? -t.height / 2 : -t.height / 2 + 5;
        }

        // 获取高度
        function getHeight(t) {
            return t.height;
        }

        function getWidth(t) {
            return t.nwidth;
        }

        // 计算颜色
        function calcColor(t) {
            return globalColors[t.depth];
        }

        // 获取间距高度
        function otherHeight(t) {
            return t.height == lineHeight ? 0 : 5;
        }

        function getBalance(t) {
            return t.balance;
        }

        function toggleAllData(d) {
            allData.forEach(function(t) {
                var node = findNodeByAllDataCode(t, d.code);
                if (node) {
                    toggle(node);
                }
            })
        }

        // 展开/收缩处理
        function toggle(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }

        // toggle操作
        function toggleEvent(d) {
            // if (d.depth > 0 && d.code) {
            //     if (d._children && d._children.length == 0) {
            //         if (d.type === '2') {
            //             param.companyCode = d.code;
            //             getDefaultData(d.code, d.parent.code);
            //         }
            //     } else {
            //         toggle(d);
            //         toggleAllData(d);
            //         drawTree(d);
            //     }
            // }
            toggle(d);
            // toggleAllData(d);
            upIdx = downIdx = 0;
            drawTree(d);
        }

        // 节点数据转换
        function changeNode(t) {
            t.children && t.depth ?
                (t._children = t.children, t._children.forEach(changeNode), t.children = null) :
                (t._children && t._children.forEach(changeNode), t.children && t.children.forEach(changeNode));
        }

        // 数据转换
        function changeData(t) {
            var e = t.children ? t.children : t._children;
            t._children && (t.children = t._children, t._children = null), e && e.forEach(changeData)
        }

        function changeAllDataNode(t) {
            t.children ?
                (t._children = t.children, t._children.forEach(changeNode), t.children = null) :
                (t._children && t._children.forEach(changeNode), t.children && t.children.forEach(changeNode));
        }

        // 收缩
        function collapseTree() {
            if (allData && allData.length) {
                allData.forEach(changeAllDataNode);
            }

            rootData.children &&
                (rootData.children.forEach(changeNode),
                    changeNode(rootData),
                    drawTree(rootData))
        }

        // 还原
        function restore() {
            (svg.baseSvg.call(zoom.translate([0, 0]).scale(1).event), collapseTree());
        }

        // 展开 
        function expandTree() {
            changeData(rootData);
            changeChildrenData(rootData.children);
            drawTree(rootData);
        }

        // 画布初始化
        function draw() {
            svgWidth = $('#screenArea').width() || document.documentElement.clientWidth || document.body.clientWidth;
            svgHeight = $('#screenArea').height();
            d3.select('#companyChart svg').attr('width', svgWidth);
            // svg画布
            svg.baseSvg = d3.select("#companyChart")
                .style({
                    width: svgWidth + 'px'
                })
                .append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .style({
                    background: "#ffffff"
                })
                .attr("class", "svg-container")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .call(zoom);
            // svg容器 (可添加多个svg内容元素)
            svg.svgGroup = window._CompanyChart.container = svg.baseSvg.append('g');
            // svg内容                
            var len = 0;
            if (rootData && rootData.children && rootData.children.length) {
                rootData.children.forEach(function(t) {
                    if (t.isup) {
                        len = len + 1;
                    }
                })
            }
            var yDistance = len > 4 ? 280 : (len + 1) * 70;
            svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + 60 + "," + yDistance + ")");
        }

        draw();
        drawTree(rootData);

        return {
            reload: reloadChart,
            save: newgqctSaveImgEvent,
        }

        /**
         * 数据变形 先状态/后持股比例/再显示隐藏处理
         * 
         * @returns 
         */
        function structData() {
            var nowData = {};
            var _vData = JSON.parse(vData);
            upIdx = 0;
            downIdx = 0;
            $.extend(true, nowData, _vData);
            if (nowData.investTree) {
                nowData.investTree.children = nowData.investTree.children || [];
            }
            if (nowData.shareHolderTree) {
                nowData.shareHolderTree.children = nowData.shareHolderTree.children || [];
            }

            /**
             * 企业状态变形
             */
            var firstFilter = [];
            if (!$('.chart-nav-first').find('[data-api=all]').hasClass('wi-secondary-bg')) {
                firstFilter = $('.chart-nav-first').find('button:not(.wi-secondary-bg)');
            }
            if (firstFilter.length) {
                var txts = [];
                for (var i = 0; i < firstFilter.length; i++) {
                    var txt = $(firstFilter[i]).attr("data-key");
                    nowData.investTree && getStatusNodeNew(nowData.investTree.children, txt);
                    nowData.shareHolderTree && getStatusNodeNew(nowData.shareHolderTree.children, txt);
                }
            }

            /**
             * 持股比例大小过滤
             */
            var val = $('.chart-nav-rateset').val();
            var num = Number(val);
            if (!val) {
                nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', -1);
            } else if (!num) {
                nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', -1);
                layer.msg('输入格式有误, 重置初始状态!');
            } else if (num < 0) {
                nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', -1);
                layer.msg('输入格式有误, 重置初始状态!');
            } else {
                if (num == 100) {
                    num = 99.99999999
                }
                nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', num);
                nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', num);
            }
            return nowData;
        }

        function newgqctSlideEvent(e) {
            var parent = $(e.target).parent();
            var root = $(parent).closest('#rContent');
            var width = $('#screenArea').width();
            if ($(parent).hasClass('chart-hide')) {
                $(parent).removeClass('chart-hide')
                $(root).addClass('has-nav')
                $(root).find('#companyChart').css('width', $('#screenArea').width() - 300);
                $(root).find('#companyChart div').css('width', $('#screenArea').width() - 300);
            } else {
                $(parent).addClass('chart-hide')
                $(root).removeClass('has-nav')
                $(root).find('#companyChart').css('width', $('#screenArea').width() + 300);
                $(root).find('#companyChart div').css('width', $('#screenArea').width() + 300);
            }
        }

        function newgqctNavZeroEvent(e) {
            var target = e.target;
            var parent = $(target).parent();

            // 全部
            if ($(e.target).attr('data-api') == 'all') {
                if ($(e.target).hasClass('wi-secondary-bg')) {
                    // TODO 选中时点击不生效
                    $(e.target).removeClass('wi-secondary-bg');
                } else {
                    $(e.target).addClass('wi-secondary-bg');
                    $(e.target).nextAll().removeClass('wi-secondary-bg');
                }
            } else {
                $($(e.target).parent().find('button')[0]).removeClass('wi-secondary-bg')
                if ($(e.target).hasClass('wi-secondary-bg')) {
                    $(e.target).removeClass('wi-secondary-bg');
                } else {
                    $(e.target).addClass('wi-secondary-bg');
                }
            }

            var selected = $(target).hasClass('wi-secondary-bg');
            var count = $(parent).find('.wi-secondary-bg').length;
            var txt = $(target).attr("data-key");
            var nowData = structData();
            if (txt === '股东') {
                if (selected) {
                    if (count === 1) {
                        nowData.investTree && (delete nowData.investTree.children);
                    }
                } else {
                    if (count === 0) {
                        nowData.investTree && (delete nowData.investTree.children);
                    }
                    nowData.shareHolderTree && (delete nowData.shareHolderTree.children);
                }
            } else if (txt === '投资') {
                if (selected) {
                    if (count === 1) {
                        nowData.shareHolderTree && (delete nowData.shareHolderTree.children);
                    }
                } else {
                    if (count === 0) {
                        nowData.shareHolderTree && (delete nowData.shareHolderTree.children);
                    }
                    nowData.investTree && (delete nowData.investTree.children);
                }
            } else {
                if (!selected) {
                    nowData.investTree && (delete nowData.investTree.children);
                    nowData.shareHolderTree && (delete nowData.shareHolderTree.children);
                }
            }
            resetMap(nowData);
            return false;
        }

        function resetMap(data) {
            rootData = data;
            rootData.name = CompanyChart.companyName || '目标公司';
            rootData.children = [];
            // 数据结构转换
            var changeDataSchema = function(data) {
                data.isup = 1;
                if (data.children && data.children.length) {
                    for (var i = 0; i < data.children.length; i++) {
                        var t = data.children[i];
                        changeDataSchema(t);
                    }
                }
                return data;
            };
            if (rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length) {
                rootData.shareHolderTree = changeDataSchema(rootData.shareHolderTree); // 股权在上方
                rootData.shareHolderTree.children && rootData.shareHolderTree.children.map(function(t) {
                    rootData.children.push(t);
                })
            }
            rootData.investTree.children && rootData.investTree.children.map(function(t) {
                rootData.children.push(t);
            })
            rootData.x0 = 0;
            rootData.y0 = 0;
            delete rootData.investTree;
            delete rootData.shareHolderTree;
            changeChildrenData(rootData.children);
            drawTree(rootData);
        }

        function newgqctNavFirstEvent(e) {
            var target = e.target;
            var txt = $(target).attr("data-key");
            var parent = $(target).parent();
            var selected = $(target).hasClass('wi-secondary-bg')

            if (txt === '全部') {
                if (selected) {
                    $(target).removeClass('wi-secondary-bg');
                } else {
                    $(target).siblings('button').removeClass('wi-secondary-bg');
                    $(target).addClass('wi-secondary-bg');
                }
            } else {
                $(parent).find('[data-api=all]').removeClass('wi-secondary-bg');
                if (selected) {
                    $(target).removeClass('wi-secondary-bg')
                } else {
                    $(target).addClass('wi-secondary-bg')
                }
            }

            var nowData = structData();
            resetMap(nowData);
            return false;
        }

        /**
         * 比例
         * 
         * @param {any} data
         * @param {any} rate
         */
        function getRateNode(data, key, rate) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var t = data[i];
                if (t[key] <= rate) {
                    data.splice(i, 1);
                    len = len - 1;
                    i = i - 1;
                } else if (t.children && t.children.length) {
                    getRateNode(t.children, key, rate)
                }
            }
        }

        /**
         * 企业状态过滤
         * 
         * @param {*} data 
         * @param {*} status 正常 1 不正常 0
         */
        function getStatusNode(data, status) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var t = data[i];
                // 正常
                if (status) {
                    if (t.status) {
                        if (t.status.indexOf('存续') == -1) {
                            data.splice(i, 1);
                            len = len - 1;
                            i = i - 1;
                        }
                    } else if (t.reg_status) {
                        if (t.reg_status.indexOf('存续') == -1) {
                            data.splice(i, 1);
                            len = len - 1;
                            i = i - 1;
                        }
                    } else {
                        data.splice(i, 1);
                        len = len - 1;
                        i = i - 1;
                    }
                } else {
                    if (t.status) {
                        if (t.status.indexOf('存续') > -1) {
                            data.splice(i, 1);
                            len = len - 1;
                            i = i - 1;
                        }
                    } else if (t.reg_status) {
                        if (t.reg_status.indexOf('存续') > -1) {
                            data.splice(i, 1);
                            len = len - 1;
                            i = i - 1;
                        }
                    }
                }
                if (t.children && t.children.length) getStatusNode(t.children, status)
            }
        }

        function getStatusNodeNew(data, status) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var t = data[i];

                if (t.type == 'company') {

                    if (t.reg_status == status) {
                        data.splice(i, 1);
                        len = len - 1;
                        i = i - 1;
                    }

                }
                if (t.children && t.children.length) getStatusNodeNew(t.children, status)
            }
        }

        /**
         * 显示隐藏
         * 
         * @param {any} data 
         */
        function hideRate(data, hide) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var t = data[i];
                t._rateHide = hide;
                if (t.children && t.children.length) {
                    hideRate(t.children, hide);
                }
            }
        }

        /**
         * 持股比例大小过滤
         * 
         * @param {any} e 
         * @returns 
         */
        function newgqctNavSecondEvent(e) {
            var nowData = structData();
            resetMap(nowData);
            return false;
        }

        // 节点数据转换
        function changeNodeForReload(t) {
            // delete t.downId;
            // delete t.upId;                
            t.children && t.depth ?
                (t._children = t.children, t._children.forEach(changeNode), t.children = null) :
                (t._children && t._children.forEach(changeNode), t.children && t.children.forEach(changeNode));
        }

        /**
         * 刷新
         * 
         * @param {any} e 
         * @returns 
         */
        function reloadChart(e) {
            // var nowData = structData();
            // resetMap(nowData);
            // // svg.svgGroup.attr("transform", "translate(" + 20 + "," + 20 + ")");
            idx = 0; // V
            upIdx = 0;
            downIdx = 0;
            rootData.children && rootData.children.forEach(changeNodeForReload);
            changeNodeForReload(rootData);
            drawTree(rootData);
            svg.baseSvg.call(zoom.translate([0, 0]).scale(1).event);
            return false;
        }

        /**
         * 股权穿透header事件委托
         * 
         * @param {any} e 
         * @returns 
         */
        function newgqctHeaderEvent(e) {
            var target = e.target;
            if (!$(target).is('li')) {
                target = target.closest('li');
            }
            var idx = $(target).parent().children().index($(target));

            switch (idx) {
                case 0:
                    Common.burypcfunctioncode('922602100372');
                    newgqctSaveImgEvent();
                    break;
                    // case 1:
                    //     {
                    //         try {
                    //             Common.burypcfunctioncode('922602100373');
                    //             var hideVal = $(target).attr('data-hide') - 0; // 默认1 表示当前已显示持股比例
                    //             var series = CompanyChart.echartInstance._innerOption.series;
                    //             var childs = [series[0].data[0], series[1].data[0]];

                    //             childs.forEach(function(t) {
                    //                 t._rateHide = hideVal ? true : false;
                    //                 getRateNode(t);
                    //             })
                    //             function getRateNode(data) {
                    //                 if (data.children) {
                    //                     for (var i = 0; i < data.children.length; i++) {
                    //                         getRateNode(data.children[i]);
                    //                     }
                    //                 }
                    //                 // 将连线上的文字隐藏 即隐藏持股比例字段
                    //                 if (data.symbol === 'arrowdown') {
                    //                     data.name = (hideVal ? '' : data._name);
                    //                 }
                    //             }
                    //             CompanyChart.echartInstance.clear();
                    //             CompanyChart.echartInstance.setOption(CompanyChart.echartInstance._innerOption);
                    //             Common.initZrender(CompanyChart.echartInstance, true);
                    //             $(target).attr('data-hide', hideVal ? 0 : 1);
                    //             // $(target).find('span').text(hideVal ? '显示持股比例' : '隐藏持股比例');
                    //             if (!hideVal) {
                    //                 $(target).addClass('chart-header-rate-other');
                    //             } else {
                    //                 $(target).removeClass('chart-header-rate-other');
                    //             }
                    //         } catch (e) {}
                    //         break;
                    //     }
                    // case 2:
                default:
                    Common.burypcfunctioncode('922602100374');
                    reloadChart();
                    break;
            }
            return false;
        }

        /**
         * 股权穿透左侧nav事件委托
         * 
         * @param {any} e 
         */
        function gqctNavEvent(e) {
            var nowData = {};
            var target = e.target;
            var level = $(target).text() - 0;
            var selectedEle = $(target).parent().find('.wi-secondary-bg');

            if ($(selectedEle).text() == level) {
                return false;
            } else {
                $(selectedEle).removeClass('wi-secondary-bg');
                $(target).addClass('wi-secondary-bg');
            }

            /**
             * 层级
             * 
             * @param {any} data 
             */
            function getLevelNode(data) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var t = data[i];
                    if (t.depth > level) {
                        data.splice(i, 1);
                        len = len - 1;
                        i = i - 1;
                    } else if (t.children && t.children.length) {
                        getNode(t.children)
                    }
                }
            }


            $.extend(true, nowData, vData);
            // getNode(nowData.children);
            // getRateNode(nowData.children);
            hideRate(nowData.children);
            CompanyChart.echart2CommonFuns(nowData, 'parentStockShare', true);
            var ecConfig = require('echarts/config');
            CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
            return false;
        }

        /**
         * 股权穿透保存图片事件委托
         * 
         * @param {any} e 
         */
        function newgqctSaveImgEvent(e) {
            if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                if (layer) {
                    layer.msg('功能升级中!')
                } else {
                    window.alert('功能升级中!')
                }
                return;
            }
            var box = d3.select('#companyChart svg g').node().getBoundingClientRect();

            var node = d3.select('#companyChart svg g g').attr('transform');

            var x = node.split('(')[1].split(',')[0];
            var y = node.split(',')[1].split(')')[0] - 0;

            if (y + upHeight < 0) {
                d3.select('#companyChart svg g g').attr('transform', "translate(" + x + "," + (y - upHeight - 60) + ")");
            }

            var w = box.width;
            var h = box.height;
            Common.saveCanvasImg('#companyChart', companyName + '_股权穿透', 2, null, w + 300 + '', h + 300 + '');
            d3.select('#companyChart svg g g').attr('transform', "translate(" + x + "," + (y) + ")");
        }
    },
    /**
     * echart2实例动画渲染
     * 绘制：股权结构图谱、对外投资图谱、股权穿透图谱
     */
    animatieChart: function(myChart, targetX, targetY) {
        targetX = targetX || 0;
        targetY = targetY || 0;
        var centerX = myChart.getZrender().getWidth() / 2;
        var centerY = myChart.getZrender().getHeight() / 2;
        var layer = myChart.getZrender().painter._layers[1];
        var animation = myChart.getZrender().animation;
        layer.scale = [0.2, 0.2, centerX, centerY];
        layer.rotation = [0, centerX, centerY];
        layer.position = [targetX, targetY];
        layer.position = [targetX, targetY];
        myChart.getZrender().render();

        // 企业详情或其他地方使用时 默认用小号的图形
        if (myChart._wind_scale) {
            animation.animate(layer).when(330, {
                scale: [myChart._wind_scale, myChart._wind_scale, centerX, centerY]
            }).start('spline').done(function() {}).during(function() {
                myChart.getZrender().render();
            });
        } else {
            animation.animate(layer).when(330, {
                scale: [1, 1, centerX, centerY]
            }).start('spline').done(function() {
                layer.scale[2] = 0;
                layer.scale[3] = 0;
            }).during(function() {
                myChart.getZrender().render();
            });
        }
    },
    /**
     * echart2初始化部分附加charts
     * 绘制：股权结构图谱、对外投资图谱、股权穿透图谱
     */
    initZrender: function(myChart) {
        var Text = require('zrender/shape/Text');
        var ImageShape = require('zrender/shape/Image');
        var Rectangle = require('zrender/shape/Rectangle');
        var shapeList = myChart.getZrender().storage.getShapeList();
        for (var i = 0; i < shapeList.length; i++) {
            if (shapeList[i].clickcom) {
                myChart.getZrender().delShape(shapeList[i].id);
            }
            if (shapeList[i].ndelete) {
                myChart.getZrender().delShape(shapeList[i].id);
            }
        }
        for (var i = 0; i < shapeList.length; i++) {
            if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.extend) {
                var iconImg = '';
                if (shapeList[i]._echartsData._data.extend == 1) {
                    iconImg = '../resource/images/Company/1.png';

                } else if (shapeList[i]._echartsData._data.extend == 2) {
                    iconImg = '../resource/images/Company/2.png';
                }
                var shape = new ImageShape({
                    style: {
                        image: iconImg,
                        x: shapeList[i].rotation[1] - 12,
                        y: shapeList[i]._echartsData._data.isTZ ? shapeList[i].rotation[2] + 31 : shapeList[i].rotation[2] - 54, // 对外投资/股权结构(默认)                            
                        width: 24,
                        height: 24
                    }
                });
                shape.code = shapeList[i]._echartsData._data.code;
                shape.treeId = shapeList[i]._echartsData._data.treeId;
                shape.children = shapeList[i]._echartsData._data.children;
                shape._children = shapeList[i]._echartsData._data._children;
                shape.zlevel = 1;
                shape.z = 4;
                shape.clickcom = true;
                shape.hoverable = true;
                shape.clickable = true;
                myChart.getZrender().addShape(shape);
            }
            if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.listed && shapeList[i]._echartsData._data.issued) {
                var shapeText = new Text({
                    style: {
                        x: shapeList[i].rotation[1],
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 + 54,
                        textFont: 'normal 12px 微软雅黑',
                        text: '上市公司 ' + '发债企业',
                        textAlign: 'center',
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        color: '#63a074',
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        lineWidth: 0,
                        fontWeight: 'bold',
                        lineHeight: '48px'
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                shapeText.zlevel = 1;
                shapeText.z = 10;
                shapeText.ndelete = true;
                shapeText.hoverable = false;

                var rect = new Rectangle({
                    style: {
                        x: shapeList[i].rotation[1] - 61,
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 + 44,
                        width: 122,
                        height: 17,
                        background: '#fff',
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        color: '#81b28f',
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        opacity: '0.2',
                    },
                })
                rect.ndelete = true;
                rect.zlevel = 1;
                rect.z = 8;
                rect.hoverable = false;

                myChart.getZrender().addShape(rect);
                myChart.getZrender().addShape(shapeText);
            } else if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.listed) {
                var shapeText = new Text({
                    style: {
                        x: shapeList[i].rotation[1],
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 + 54,
                        textFont: 'normal 12px 微软雅黑',
                        text: '上市公司 ',
                        textAlign: 'center',
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        color: '#63a074',
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        lineWidth: 0,
                        fontWeight: 'bold',
                        lineHeight: '48px'
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                shapeText.zlevel = 1;
                shapeText.z = 10;
                shapeText.ndelete = true;
                shapeText.hoverable = false;

                var rect = new Rectangle({
                    style: {
                        x: shapeList[i].rotation[1] - 61,
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 + 44,
                        width: 122,
                        height: 17,
                        background: '#fff',
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        color: '#81b28f',
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        opacity: '0.2',
                    },
                })
                rect.ndelete = true;
                rect.zlevel = 1;
                rect.z = 8;
                rect.hoverable = false;

                myChart.getZrender().addShape(rect);
                myChart.getZrender().addShape(shapeText);
            } else if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.issued) {
                var shapeText = new Text({
                    style: {
                        x: shapeList[i].rotation[1],
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 + 54,
                        textFont: 'normal 12px 微软雅黑',
                        text: '发债企业 ',
                        textAlign: 'center',
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        color: '#8662ac',
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        lineWidth: 0,
                        fontWeight: 'bold',
                        lineHeight: '48px'
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                shapeText.zlevel = 1;
                shapeText.z = 10;
                shapeText.ndelete = true;
                shapeText.hoverable = false;

                var rect = new Rectangle({
                    style: {
                        x: shapeList[i].rotation[1] - 61,
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 + 44,
                        width: 122,
                        height: 17,
                        background: '#fff',
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        color: '#9d80bc',
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        opacity: '0.3',
                    },
                })
                rect.ndelete = true;
                rect.zlevel = 1;
                rect.z = 8;
                rect.hoverable = false;

                myChart.getZrender().addShape(rect);
                myChart.getZrender().addShape(shapeText);
            }

            if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.actCtrl && shapeList[i]._echartsData._data.benifciary) {
                var shape = new ImageShape({
                    style: {
                        image: '../resource/images/Company/tupu_kzrsbg.png',
                        x: shapeList[i].rotation[1] - 61,
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 - 64,
                        width: 122,
                        height: 64,
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: '#fff',
                    }
                });
                var shapeText = new Text({
                    style: {
                        x: shapeList[i].rotation[1],
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 - 32,
                        textFont: 'normal 14px 微软雅黑',
                        text: '实际控制人\n' + '最终受益人',
                        textAlign: 'center',
                        color: '#fff',
                        lineWidth: 0,
                        fontWeight: 'bold',
                        lineHeight: '48px'
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                shape.ndelete = true;
                shape.zlevel = 1;
                shape.z = 8;
                shape.hoverable = false;
                shapeText.zlevel = 1;
                shapeText.z = 10;
                shapeText.ndelete = true;
                shapeText.hoverable = false;
                myChart.getZrender().addShape(shape);
                myChart.getZrender().addShape(shapeText);
            } else if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.actCtrl) {
                var shape = new ImageShape({
                    style: {
                        image: '../resource/images/Company/tupu_kzrbg.png',
                        x: shapeList[i].rotation[1] - 61,
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 - 36,
                        width: 122,
                        height: 36,
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                var shapeText = new Text({
                    style: {
                        x: shapeList[i].rotation[1],
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 - 20,
                        textFont: 'normal 14px 微软雅黑',
                        text: '实际控制人',
                        textAlign: 'center',
                        color: '#fff',
                        lineWidth: 0,
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        color: '#F5A623',
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                shape.ndelete = true;
                shape.zlevel = 1;
                shape.z = 8;
                shape.hoverable = false;
                shapeText.zlevel = 1;
                shapeText.z = 10;
                shapeText.ndelete = true;
                shapeText.hoverable = false;
                myChart.getZrender().addShape(shape);
                myChart.getZrender().addShape(shapeText);
            } else if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.benifciary) {
                var shape = new ImageShape({
                    style: {
                        image: '../resource/images/Company/tupu_syrbg.png',
                        x: shapeList[i].rotation[1] - 61,
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 - 36,
                        width: 122,
                        height: 36,
                    },
                    highlightStyle: {
                        lineWidth: 0,
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                var shapeText = new Text({
                    style: {
                        x: shapeList[i].rotation[1],
                        y: shapeList[i].rotation[2] - shapeList[i].style.height / 2 - 20,
                        textFont: 'normal 14px 微软雅黑',
                        text: '最终受益人',
                        textAlign: 'center',
                        color: '#fff',
                        lineWidth: 0,

                    },
                    highlightStyle: {
                        lineWidth: 0,
                        color: '#F5A623',
                        strokeColor: 'rgba(255,255,255,0)',
                    }
                });
                shape.ndelete = true;
                shape.zlevel = 1;
                shape.z = 8;
                shape.hoverable = false;
                shapeText.zlevel = 1;
                shapeText.z = 10;
                shapeText.ndelete = true;
                shapeText.hoverable = false;
                myChart.getZrender().addShape(shape);
                myChart.getZrender().addShape(shapeText);
            }
        }
    },
    /**
     * 图谱点击弹出卡片事件
     * param - obj
     */
    chartCardEventHandler: function(param) {
        var offset = $('#screenArea').offset();
        if (param.companyCode) {
            if (param.redirect) {
                // TODO redirect 默认false，如果设置true，表示需要跳转打开
                if (param.type == 'person') {
                    // window.open('Person.html?id=' + param.companyCode + '&name=' + param.name + Common.isNoToolbar());
                } else {
                    Common.linkCompany("Bu3", param.companyCode);
                }
            } else {
                Common.openChartCard({ companyCode: param.companyCode, cardTitle: param.title || '相关信息', cardType: param.type || 'company', companyName: param.name }, param.offset || offset);
            }
        }
    },
    /**
     * 打开企业/人物卡片
     * 
     */
    openChartCard: function(params, offset) {
        var offset = offset ? [offset.top + 20 + 'px', offset.left + 20 + 'px'] : null;
        // TODO 格式
        // window._childParams = { companyCode: CompanyChart.companyCode, cardTitle: '人物信息', cardType: 'person', companyName: CompanyChart.companyName };
        var titles = params.cardTitle.split('|');
        window._childParams = params;
        if (titles.length && titles.length > 1) {
            var rootName = titles[2];
            var rootCode = titles[1];
            window._childParams.cardTitle = titles[0];
            window._childParams._rootCode = rootCode;
            window._childParams._rootName = rootName;
        }
        var args = {
            title: [window._childParams.cardTitle || '相关信息', 'font-size:18px;'],
            skin: 'feedback-body',
            type: 2,
            area: ['320px', '600px'], //宽高        
            content: '../Company/chartCard.html' + location.search,
            move: false, // 不可拖动
            shadeClose: true,
            resize: false,
            isOutAnim: false,
            cancel: function(e) {
                // TODO 关闭回调
            },
            success: function() {
                // TODO
            },
            end: function() {
                // TODO 销毁回调
            },
            id: 1
        };
        // 相对定位
        if (offset) {
            args.offset = offset;
        }
        layer.open(args)
    },
    /**
     * 前端功能点处理
     * code 功能点id
     * other 其他参数
     */
    burypcfunctioncode: function(code, other) {
        var param = { functionCode: code };
        if (other) {
            $.extend(param, other);
        }
        if (param.functionCode) {
            try {
                myWfcAjax('burypcfunctioncodeparm', param);
            } catch (e) {}
        }
    },
    /**
     * 右上角功能菜单功能点
     */
    highProBurycode: function(e) {
        var id = $(e.target).attr('id');
        console.log(id);
        switch (id) {
            case 'toolbar-highpro-com':
                Common.burypcfunctioncode('922602100379');
                break;
            case 'toolbar-highpro-chart':
                Common.burypcfunctioncode('922602100380');
                break;
            case 'toolbar-highpro-pc':
                Common.burypcfunctioncode('922602100381');
                break;
            default:
                break;
        }
    },
    go2PersonOrCompany: function(name, id, pingParam) {
        //新的跳转公用方法
        if (id) {
            pingParam = pingParam ? pingParam : '';
            return '<a class="go2Link wi-secondary-color wi-link-color" data-code="' + id + '" data-name="' + name + '" >' + Common.formatCont(name) + '</a>';
        } else {
            return Common.formatCont(name);
        }
    },
    go2PersonOrCompanyById: function(name, id, pingParam) {
        //新的跳转公用方法通过ID
        if (id) {
            pingParam = pingParam ? pingParam : '';
            return '<a class="go2LinkById wi-secondary-color wi-link-color" data-id="' + id + '" data-name="' + name + '" >' + Common.formatCont(name) + '</a>';
        } else {
            return Common.formatCont(name);
        }
    },
    jumpPersonOrCompany: function(name, id, pingParam) {
        //判断是应该跳公司还是跳
        if (id) {
            pingParam = pingParam ? pingParam : '';
            if (id.length < 16) {
                return '<a class="underline wi-secondary-color wi-link-color" target="_blank" data-code="' + id + '" data-name="' + name + '" href="Company.html?companycode=' + id + '&name=' + name + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(name) + '</a>';
            }
            //  else {
            //     return '<a class="underline wi-secondary-color wi-link-color" target="_blank" data-code="' + id + '" data-name="' + name + '" href="Person.html?id=' + id + '&name=' + name + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(name) + '</a>';
            // }
        } else {
            return Common.formatCont(name);
        }
    },
    /**
     * 查询wft终端系统语言设置后确认是否重载页面
     */
    sysLangReload: function(selfLang) {
        if (window.wind && window.wind.client) {
            wind.client.doFunc({ func: 'querydata', name: 'syscfg', isGlobal: '1' }, function(ret) {
                var rules = JSON.parse(ret.result);
                var lang = (rules.Lang === 'ENS') ? 'en-US' : 'zh-CN';
                // 如果系统语言与当前界面url中lang参数不一致 reload页面
                if (lang !== selfLang) {
                    location.search = (lang === 'en-US') ? wind.uri(location.href).query('lang', 'en').search : wind.uri(location.href).query('lang', 'cn').search;
                    return;
                }
                return;
            });
        }
    },
    /**
     * 企业来源 映射
     */
    corpFroms: {
        '298010000': '企业',
        '298020000': '农民专业合作社',
        '298030000': '个体工商户',
        '298040000': '其他机构',
        '298050000': '海外上市公司',
        '298060000': '香港注册企业',
        '298070000': '美国',
        '298080000': '英国',
        '2980890000': '海外公司',
        '160100000': '党',
        '160200000': '军',
        '160300000': '政府机构',
        '160400000': '人大',
        '160500000': '政协',
        '160600000': '法院',
        '160700000': '检察院',
        '160800000': '共青团',
        '160900000': '社会组织',
        '161000000': '主席',
        '161100000': '民主党派',
        '161600000': '人民团体',
        '1609020100': '社会团体',
        '1609020200': '民办非企业单位',
        '1609020300': '基金会',
        '1609020400': '境外基金会代表机构',
        '1609020500': '国际性社团',
        '1609020600': '外国商会',
        '1609020700': '涉外基金会',
        '1609010100': '社会团体',
        '1609010200': '民办非企业单位',
        '1609010300': '基金会',
        '1609010400': '境外基金会代表机构',
        '1609010500': '国际性社团',
        '1609010600': '外国商会',
        '1609010700': '涉外基金会',
        '160307000': '事业单位',
        '912034101': '律所'
    },
    /**
     * 获取当前用户权限
     */
    getIsVip: function(callback) {
        myWfcAjax('getuserauthority', null, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' && res.Data) {
                var vipinfo = { isVip: false };
                if (res.Data.GelEp || res.Data.GelVip || res.Data.GelSvip) {
                    vipinfo = { isVip: true };
                }
                callback(vipinfo);
            } else {
                callback({ isVip: false });
            }
        }, function() {
            callback({ isVip: false });
        })
    },
    /**
     * 非VIP用户显示套餐信息
     */
    notVipModule: function(dom, title, tips, css) {
        if (!dom) {
            console.warn('[notVipModule] has no dom args!');
            return false;
        }
        var obj = Common.notVipWindow({ title: title, tips: tips, css: css, style: 'margin: 70px 68px;' }, { style: 'margin: 70px 68px;' });
        if (Common.is_overseas_config) {
            obj = Common.overseasNotVipWindow({ title: title, tips: tips, css: css, style: 'margin: 70px 68px;' }, { style: 'margin: 70px 68px;' });
        }
        $(dom).append(obj.left.str);
        $(dom).append(obj.right.str);
        $(dom).append(obj.success.str);
        $(dom).append(obj.userNoteStr);
        $(dom).find('.user-note').addClass('user-note-module').addClass('user-note-' + obj.tc);
        Common.wxVipCodeWindow(obj);
    },
    /**
     * 
     * @param {*} obj 要展示wx code的内容, 包含html template 及 订单信息
     * @param {*} popupEle 来自弹框, 需要调整关闭按钮位置
     */
    wxVipCodeWindow: function(obj, popupEle) {
        // $('.' + obj.left.id).on('click', '.gel-vip-btn', function(e) {
        //     $('.' + obj.left.id).hide();
        //     $('.' + obj.right.id).show();
        //     if (popupEle) {
        //         $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(popupEle);
        //     }
        //     Common.payCodeHandler(obj);
        // });
        // $('.' + obj.right.id).on('click', '.gel-vipR-content-qcode-err', function(e) {
        //     Common.payCodeHandler(obj);
        // });
        // $('.' + obj.success.id).on('click', '.gel-vipS-btn', function(e) {
        //     location.reload();
        // });
        // $('.' + obj.right.id).on('click', '.gel-vipR-content-left-five', function(e) {
        //     var target = $(e.target);
        //     var tc = $(target).attr('data-target');
        //     $('.' + tc).addClass('show-tick');
        //     if (!$('.' + tc).find('.gel-vipR-tick-content').length) {
        //         var str = Common.createTicks({ orderId: obj.orderId });
        //         $('.' + tc).find('.gel-vip-content').append(str);
        //         Common.vipTicksHandler('.' + tc);
        //     } else {
        //         $('.' + tc).find('.gel-vipR-tick-content').show();
        //     }
        // })

        // $('.' + obj.right.id).find('.gel-vipR-content-left-three').on('change', 'input:checkbox', function(e) {
        //     var target = $(e.target);
        //     var val = $(target).attr('checked');
        //     var tc = $(target).attr('data-target');
        //     if (val == 'checked') {
        //         $('.' + tc).addClass('show-tick');
        //         $('.' + tc).addClass('check-tick');
        //         if (!$('.' + tc).find('.gel-vipR-tick-content').length) {
        //             var str = Common.createTicks({ orderId: obj.orderId });
        //             $('.' + tc).find('.gel-vip-content').append(str);
        //             Common.vipTicksHandler('.' + tc);
        //         } else {
        //             $('.' + tc).find('.gel-vipR-tick-content').show();
        //         }
        //     } else {
        //         myWfcAjax('setinvoicebind', { state: 0, orderId: obj.orderId });
        //         $('.' + tc).removeClass('check-tick');
        //     }
        // });        

        // TODO 屏蔽上面的发票页面
        $('.' + obj.left.id).hide();
        $('.' + obj.right.id).show();
        if (popupEle) {
            $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(popupEle);
        }
        $('.' + obj.right.id).on('click', '.gel-vipR-content-qcode-err', function(e) {
            Common.payCodeHandler(obj);
        });
        $('.' + obj.success.id).on('click', '.gel-vipS-btn', function(e) {
            location.reload();
        });
        $('.' + obj.right.id).on('click', '.gel-vipR-prices', function(e) {
            var t = $(e.target);
            var target = $(t).closest('.gel-vipR-prices');
            if ($(target).hasClass('gel-vipR-prices-sel')) return;
            var targetContent = $(t).closest('.gel-vip-content');
            if ($(target).attr('data-prices') == 'svip') {
                $(targetContent).attr('data-price-sel', 'svip');
                $(targetContent).removeClass('gel-vip-content-left').removeClass('gel-vip-content-more').addClass('gel-vip-content-right')
                $(targetContent).find('.gel-vipR-content').removeClass('gel-vipR-content-seler').removeClass('gel-vipR-content-two');
                $(targetContent).find('.gel-vipR-content-left-seler').removeClass('gel-vipR-content-left-one-sel');
                $(targetContent).find('.gel-vipR-content-left-wx').addClass('gel-vipR-content-left-one-sel');
            } else if ($(target).attr('data-prices') == 'vip') {
                $(targetContent).attr('data-price-sel', 'vip');
                $(targetContent).removeClass('gel-vip-content-right').removeClass('gel-vip-content-more').addClass('gel-vip-content-left')
                $(targetContent).find('.gel-vipR-content').removeClass('gel-vipR-content-seler').removeClass('gel-vipR-content-two');
                $(targetContent).find('.gel-vipR-content-left-seler').removeClass('gel-vipR-content-left-one-sel');
                $(targetContent).find('.gel-vipR-content-left-wx').addClass('gel-vipR-content-left-one-sel');
            } else if ($(target).attr('data-prices') == 'vip/svip') {
                $(targetContent).attr('data-price-sel', 'vip/svip');
                $(targetContent).removeClass('gel-vip-content-left').removeClass('gel-vip-content-right').addClass('gel-vip-content-more')
                $(targetContent).find('.gel-vipR-content').addClass('gel-vipR-content-seler');
                $(targetContent).find('.gel-vipR-content-left-wx').removeClass('gel-vipR-content-left-one-sel');
                $(targetContent).find('.gel-vipR-content-left-seler').addClass('gel-vipR-content-left-one-sel');
            } else { //海外用户
                $(targetContent).attr('data-price-sel', $(target).attr('data-prices'));
                $(targetContent).removeClass('gel-vip-content-left').removeClass('gel-vip-content-right').addClass('gel-vip-content-more')
                $(targetContent).find('.gel-vipR-content').addClass('gel-vipR-content-seler');
                $(targetContent).find('.gel-vipR-content-left-wx').removeClass('gel-vipR-content-left-one-sel');
                $(targetContent).find('.gel-vipR-content-left-seler').addClass('gel-vipR-content-left-one-sel');
            }
            if (obj.ispending) {
                layer.msg('正在生成支付二维码, 请不要频繁切换');
                return false;
            }
            var right = $(target).siblings('.gel-vipR-prices');
            $(right).removeClass('gel-vipR-prices-sel');
            $(target).addClass('gel-vipR-prices-sel');
            var p = $(target).attr('data-prices');
            if ($(targetContent).find('.gel-vipR-content-hide').length) return false;
            if ($(target).attr('data-prices') == 'vip/svip') {
                Common.payCodeCancel(obj)
                return false;
            }
            if (!Common.is_overseas_config) { //海外用户不用走微信支付
                Common.payCodeHandler(obj, p);
            }

        });
        $('.user-note-' + obj.tc).on('click', '.user-note-btn span', function(e) {
            var t = $(e.target).closest('.user-note-btn')
            if ($(t).hasClass('user-note-btn-active')) {
                $(t).removeClass('user-note-btn-active')
            } else {
                $(t).addClass('user-note-btn-active')
            }
        })

        $('.user-note-' + obj.tc).on('click', '.user-note-btn-active button', function(e) {
            Common.userNoteKlass.setItem();
            var t = $('.' + obj.right.id);
            $(t).show();
            $('.user-note-' + obj.tc).hide();
            var target = $(t).find('.gel-vipR-content');
            var parent = $(t).find('.gel-vip-content');
            $(target).removeClass('gel-vipR-content-hide');
            var p = $(parent).attr('data-price-sel');
            if (Common.crmVipNoAccess) {
                var rightEle = $(parent).find('.gel-vipR-content-right-btn');
                // $(rightEle).text('正在处理...').addClass('gel-vipR-content-right-btn-disabled');
                $(rightEle).closest('.gel-vipR-content-right-up').addClass('gel-vipR-content-right-up-disabled');
                $(rightEle).siblings('.gel-vipR-content-right-tips').text('专属客户经理已收到开通需求，将在一个工作日内同您联系');
                $(rightEle).hide();
                $(parent).find('.gel-vipR-content-right-success').remove();
                $(parent).find('.gel-vipR-content-right-done').css('display', 'block')
            }
            if (p == 'vip/svip') return false;
            Common.payCodeHandler(obj, p);
        })

        $('.' + obj.right.id).on('click', '.gel-vipR-content-btn', function(e) {
            // 请求是否提前允许用户协议
            var userNoteAgreed = window.localStorage.getItem(Common.localStorageMap.commonUserNoteAgree);
            if (!userNoteAgreed) {
                Common.userNoteKlass.getItem(function(agreed) {
                    if (!agreed) {
                        $('.' + obj.right.id).hide();
                        $('.user-note-' + obj.tc).show()
                    } else {
                        var t = $(e.target);
                        var target = $(t).closest('.gel-vipR-content');
                        var parent = $(t).closest('.gel-vip-content');
                        $(target).removeClass('gel-vipR-content-hide');
                        var p = $(parent).attr('data-price-sel');
                        if (Common.crmVipNoAccess) {
                            var rightEle = $(parent).find('.gel-vipR-content-right-btn');
                            // $(rightEle).text('正在处理...').addClass('gel-vipR-content-right-btn-disabled');
                            $(rightEle).closest('.gel-vipR-content-right-up').addClass('gel-vipR-content-right-up-disabled');
                            $(rightEle).siblings('.gel-vipR-content-right-tips').text('专属客户经理已收到开通需求，将在一个工作日内同您联系');
                            $(rightEle).hide();
                            $(parent).find('.gel-vipR-content-right-success').remove();
                            $(parent).find('.gel-vipR-content-right-done').css('display', 'block')
                        }
                        if (p == 'vip/svip') return false;
                        Common.payCodeHandler(obj, p);
                    }
                })
            } else {
                var t = $(e.target);
                var target = $(t).closest('.gel-vipR-content');
                var parent = $(t).closest('.gel-vip-content');
                $(target).removeClass('gel-vipR-content-hide');
                var p = $(parent).attr('data-price-sel');
                if (Common.crmVipNoAccess) {
                    var rightEle = $(parent).find('.gel-vipR-content-right-btn');
                    // $(rightEle).text('正在处理...').addClass('gel-vipR-content-right-btn-disabled');
                    $(rightEle).closest('.gel-vipR-content-right-up').addClass('gel-vipR-content-right-up-disabled');
                    $(rightEle).siblings('.gel-vipR-content-right-tips').text('专属客户经理已收到开通需求，将在一个工作日内同您联系');
                    $(rightEle).hide();
                    $(parent).find('.gel-vipR-content-right-success').remove();
                    $(parent).find('.gel-vipR-content-right-done').css('display', 'block')
                }
                if (p == 'vip/svip') return false;
                Common.payCodeHandler(obj, p);
            }
        });

        $('.' + obj.right.id).on('click', '.gel-vipR-content-left-one', function(e) {
            var t = $(e.target);
            var target = $(t).closest('.gel-vipR-content-left-one');
            var parent = $(t).closest('.gel-vipR-content');
            var leftParent = $(t).closest('.gel-vipR-content-left');

            // if ($(target).hasClass('gel-vipR-content-left-seler')) {
            //     $(leftParent).removeClass('gel-vipR-content-left-sel-one').addClass('gel-vipR-content-left-sel-two')
            // } else {
            //     $(leftParent).removeClass('gel-vipR-content-left-sel-two').addClass('gel-vipR-content-left-sel-one')
            // }

            if ($(target).hasClass('gel-vipR-content-left-one-sel')) return false;
            if ($(target).hasClass('gel-vipR-content-left-seler')) {
                $(parent).addClass('gel-vipR-content-two')
            } else {
                $(parent).removeClass('gel-vipR-content-two')
            }
            var right = $(target).siblings('.gel-vipR-content-left-one');
            $(right).removeClass('gel-vipR-content-left-one-sel');
            $(target).addClass('gel-vipR-content-left-one-sel');
        });

        $('.' + obj.right.id).on('click', '.gel-vipR-content-right-btn', function(e) {
            var t = $(e.target);
            if ($(t).hasClass('gel-vipR-content-right-btn-disabled')) return false;
            var target = $(t).closest('.gel-vip-content');
            var type = $(target).attr('data-price-sel');
            var successFun = function() {
                // $(t).text('正在处理...').addClass('gel-vipR-content-right-btn-disabled');
                $(t).closest('.gel-vipR-content-right-up').addClass('gel-vipR-content-right-up-disabled');
                $(t).siblings('.gel-vipR-content-right-tips').text('专属客户经理已收到开通需求，将在一个工作日内同您联系');
                $(t).hide();
                $(t).closest('.gel-vipR-content').find('.gel-vipR-content-right-success').remove();
                $(t).closest('.gel-vipR-content').find('.gel-vipR-content-right-done').css('display', 'block');
            };
            Common.createCrmTick(type, successFun);
        });

        // Common.payCodeHandler(obj, obj.onlysvip ? 'svip' : 'vip');
    },
    wxVipCodeWindowExport: function(obj, popupEle, res) {
        $('.' + obj.left.id).hide();
        $('.' + obj.right.id).show();
        if (popupEle) {
            $('.layer-vip-' + obj.tc).find('.layui-layer-content').append(popupEle);
        }
        Common.payCodeHandlerExport(obj, res);
    },
    notVipWindowExport: function name(left) {
        left = left || {};
        var tc = Date.now(); // 时间戳
        if (!$('[data-type="windgel-vip-model"]').length) {
            $('body').append('<link href="../resource/css/vipModel.css?v=' + tc + '" rel="stylesheet" data-type="windgel-vip-model" />');
        }
        if (!$('[data-type="windgel-vip-qrcode"]').length) {
            $('body').append('<script type="text/javascript" src="../resource/js/qrcode.min.js" data-type="windgel-vip-qrcode"></script>');
        }
        var l = 'gel-vipL-' + tc; // 默认展示内容区css
        var r = 'gel-vipR-' + tc; // 二维码内容区css
        var title = left.title || intl('149697' /*全球企业库*/ );
        var count = left.count;
        var css = left.css || '';

        // 默认展示内容区
        var priceStr = '<div class="gel-vip-model ' + l + ' ' + css + '" style="' + (left.style || '') + '">';
        priceStr += '<div class="gel-vip-content">';
        priceStr += '<div class="gel-vip-header">';
        priceStr += '<div class="gel-vip-title">' + title + '</div>';
        priceStr += '<div class="gel-vip-sec-model"><div class="gel-vip-more">';
        priceStr += '</div>';

        var right = {};
        // 二维码内容区
        var Rcss = right.css || '';
        var price = right.price || '328';
        var account = right.account || '--';
        var deadline = right.deadline || '--';
        var pay = right.pay || '328.00';
        var onlySvipCss = 'gel-vipR-prices-only-svip';

        var priceRStr = '<div class="gel-vip-model gel-vipR ' + r + ' ' + Rcss + '" style="display:none;' + (right.style || '') + '">';
        // priceRStr += '<div class="gel-vip-content gel-vip-content-left">';
        priceRStr += '<div class="gel-vip-content gel-vip-content-left" data-price-sel="vip">';
        priceRStr += '<div class="gel-vip-header">';

        priceRStr += '<div class="gel-vip-title gel-vip-title-export">' + title + '</div>';
        priceRStr += '<div class="gel-vip-tips-export">' + '一次最多导出<span style="color: #dc3023;">2000</span>条' + '</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-header gel-vipR-header-export">';

        priceRStr += '<div><span>导出数量：</span><i>' + count + '</i></div>';
        priceRStr += '<div><span>实付金额：</span><i class="gel-vip-1999">￥1999.00</i></div>';

        priceRStr += '</div>';
        priceRStr += '<div class="gel-vipR-content gel-vipR-content-export">';

        priceRStr += '<div class="gel-vipR-content-left">';
        priceRStr += '<div class="gel-vipR-content-left-one gel-vipR-content-left-wx gel-vipR-content-left-one-sel">';
        priceRStr += '<img src="../resource/images/Company/wx.png">';
        priceRStr += '<span class="">' + intl('209818' /*微信支付*/ ) + '</span>';
        priceRStr += '</div>';

        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-center">';
        priceRStr += '<canvas class="gel-vipR-content-qcode"></canvas>';
        priceRStr += '<span class="gel-vipR-content-qcode-err wi-secondary-color wi-link-color" style="display:none;">' + intl('206308' /*网络异常*/ ) + ',' + intl('23569' /*刷新*/ ) + '</span>';
        priceRStr += '<div class="gel-vipR-content-center-tips">';
        priceRStr += '<img src="../resource/images/Company/qcode.png">';
        priceRStr += '<span class="">' + intl('209820' /*打开手机微信*/ ) + intl('209821' /*扫码继续支付*/ ) + '</span>';
        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '<div class="gel-vipR-content-qcode-bottom">我已阅读并同意，导出的数据内容仅限于个人依法合规使用，因不正常使用数据带来的一切风险由本人承担，与<b style="color:#333;">万得全球企业库</b>无关</div>';

        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '</div>';

        return {
            left: {
                id: l, // 选择器
                str: priceStr // 内容区
            },
            right: {
                id: r, // 选择器
                str: priceRStr // 内容区                
            },
            tc: tc,
            onlysvip: 0,
        }
    },
    overseasNotVipWindow: function(left, right, onlysvip) {
        left = left || {};
        right = right || {};
        var tc = Date.now(); // 时间戳
        if (!$('[data-type="windgel-vip-model"]').length) {
            $('body').append('<link href="../resource/css/vipModel.css?v=' + tc + '" rel="stylesheet" data-type="windgel-vip-model" />');
        }
        if (!$('[data-type="windgel-vip-qrcode"]').length) {
            $('body').append('<script type="text/javascript" src="../resource/js/qrcode.min.js" data-type="windgel-vip-qrcode"></script>');
        }
        var l = 'gel-vipL-' + tc; // 默认展示内容区css
        var r = 'gel-vipR-' + tc; // 二维码内容区css
        var title = left.title || intl('149697' /*全球企业库*/ );
        var tips = [];
        // if (!left.tips) {
        //     tips = ['购买企业套餐, 即可查看更多全球企业库信息', '购买企业套餐, 即可查看更多全球企业库信息'];
        // }
        if (left.tips instanceof Array) {
            if (left.tips.length < 3) {
                left.tips[2] = left.tips[0];
            }
            tips = left.tips;
        } else {
            tips = [left.tips, left.tips, left.tips];
        }
        var css = left.css || '';

        // 默认展示内容区
        var priceStr = '<div class="gel-vip-model ' + l + ' ' + css + '" style="' + (left.style || '') + '">';
        priceStr += '<div class="gel-vip-content">';
        priceStr += '<div class="gel-vip-header">';
        priceStr += '<div class="gel-vip-title">' + title + '</div>';
        priceStr += '<div class="gel-vip-tips">' + tips + '</div>';
        priceStr += '<div class="gel-vip-sec-model"><div class="gel-vipR-prices"><b class="">' + 50 + intl('10634' /*美元*/ ) + '</b><span class="">/月</span></div><div class="gel-vip-more">';
        // priceStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208682' /*查看全部权限*/ ) + '></a></div></div>';
        priceStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">查看全部权限</a></div></div>';

        priceStr += '</div>';

        priceStr += '<div class="gel-vip-three-model"><div class="gel-vip-btn">' + intl('204669' /*立即开通*/ ) + '</div><div class="gel-vip-btn-tip">支付后可开发票</div></div>';

        // priceStr += '<div class="gel-vip-more"><a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208682' /*查看全部权限*/ ) + '>>></a></div>';
        // priceStr += '<div class="gel-vip-btn">' + intl('204669' /*立即开通*/ ) + '</div>';
        // priceStr += '</div>';

        // 二维码内容区
        var Rcss = right.css || '';
        var price = right.price || '50';
        var account = right.account || '--';
        var deadline = right.deadline || '--';
        var pay = right.pay || '50.00';
        var onlySvipCss = 'gel-vipR-prices-only-svip';
        var onlySvipCssE = 'gel-vipR-prices-only-svip-e'

        //绘制嵌套内容框
        var priceRStr = '<div class="gel-vip-model gel-vipR ' + r + ' ' + Rcss + '" style="display:none;' + (right.style || '') + '">';
        // priceRStr += '<div class="gel-vip-content gel-vip-content-left">';

        if (!onlysvip) {
            priceRStr += '<div class="gel-vip-content gel-vip-content-left" data-price-sel="ov-vip">';
        } else {
            priceRStr += '<div class="gel-vip-content gel-vip-content-left" data-price-sel="ov-svip">';
        }
        priceRStr += '<div class="gel-vip-header">'; //开始绘制支付框头部描述

        priceRStr += '<div class="gel-vip-title">' + title + '</div>'; //每个价格框对应的描述
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-left">' + tips[0] + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-right">' + tips[1] + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-more">' + tips[2] + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-third">' + '该数据由第三方提供' + '</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-header">'; //开始绘制价格选择框

        if (!onlysvip) { //是否只有svip才有权限
            priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-sel overseas-vip-change" data-prices="ov-vip">'; //默认选中第一个框
            priceRStr += '<div class="">VIP</div>'; //第一个价格框价格描述
            priceRStr += '<b class="">' + 50 + intl('10634' /*美元*/ ) + '</b>';
            priceRStr += '<span class="">/' + intl('', '月') + '</span>';
            priceRStr += '</div>';
            priceRStr += '<div class="gel-vipR-prices" data-prices="ov-svip">'; //第二个支付框
        } else {
            priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-sel overseas-onlyvip-change ' + onlySvipCss + '" data-prices="ov-svip">';
        }
        priceRStr += '<div class="">SVIP</div>'; //第二个价格框价格描述
        priceRStr += '<b class="">' + 100 + intl('10634' /*美元*/ ) + '</b>';
        priceRStr += '<span class="">/' + intl('', '月') + '</span>';
        priceRStr += '</div>';

        // if (!onlysvip) {
        //     priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-seler" data-prices="ov-vip/svip">';//第三个支付框企业套餐
        // } else {
        //     priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-seler ' + onlySvipCssE + ' " data-prices="ov-vip/svip">';
        // }
        // priceRStr += '<div class="">企业套餐</div>';//第三个价格框价格描述
        // priceRStr += '<span class="">VIP：' + '<i>280元</i>' + '/人/1年</span><br>';
        // priceRStr += '<span class="">SVIP：' + '<i>1380元</i>' + '/人/1年</span>';
        // priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-more">'; //查看全部权限说明页
        // priceRStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208682' /*查看全部权限*/ ) + '>>></a>';
        priceRStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">查看全部权限</a>';
        priceRStr += '</div>';

        // priceRStr += '<div class="gel-vipR-line"></div>';
        // priceRStr += '<div class="gel-vipR-tips">';
        // priceRStr += '<div class="gel-vipR-tips-title">';
        // priceRStr += '<div class="">' + intl('209816' /*购买账号*/ ) + '：</div>';
        // priceRStr += '<div class="">' + intl('89265' /*到期时间*/ ) + '：</div>';
        // // priceRStr += '<div class="">' + intl('209817' /*实付金额*/ ) + '：</div>';
        // priceRStr += '</div>';
        // priceRStr += '<div class="gel-vipR-tips-info">';
        // priceRStr += '<div class="gel-vipR-data-account">' + account + '</div>';
        // priceRStr += '<div class="gel-vipR-data-deadline">' + deadline + '</div>';
        // // priceRStr += '<div class="wi-secondary-color gel-vipR-data-pay">￥' + pay + '</div>';
        // priceRStr += '</div>';
        // priceRStr += '</div>';

        priceRStr += '</div>';
        priceRStr += '<div class="gel-vipR-content gel-vipR-content-two gel-vipR-content-seler">'; //立即开通遮罩,将gel-vipR-content-hide去掉，则没有遮罩
        priceRStr += '<div class="gel-vipR-content-btn">立即开通</div>';

        priceRStr += '<div class="gel-vipR-content-left">';
        priceRStr += '<div class="gel-vipR-content-left-one gel-vipR-content-left-wx " style="display: none;">'; // 微信支付
        priceRStr += '<img src="../resource/images/Company/wx.png">';
        priceRStr += '<span class="">' + intl('209818' /*微信支付*/ ) + '</span>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-left-one gel-vipR-content-left-seler gel-vipR-content-left-one-sel">';
        priceRStr += '<img src="../resource/images/Company/seler.png">';
        priceRStr += '<span class="">' + '联系客户经理' + '</span>';
        priceRStr += '</div>';

        // priceRStr += '<div class="gel-vipR-content-left-two">' + intl('209819' /*企业库高级权限自完成支付起即时生效*/ ) + '</div>';

        // priceRStr += '<div class="gel-vipR-content-left-three"><input type="checkbox" class="" id="gel-vipR-tick" hidden data-target="' + 'gel-vipR-' + tc + '"><label class="gel-vipR-tick-label" for="gel-vipR-tick"></label><span>开具发票</span>';
        // priceRStr += '<a class="gel-vipR-tick-demo" href="#">发票样例></a>';
        // priceRStr += '<div class="gel-vipR-content-left-four">发票抬头：<span id="gel-vipr-tickcorp"></span></div>';
        // priceRStr += '<div class="gel-vipR-content-left-five" data-target="' + 'gel-vipR-' + tc + '">编辑发票信息></div>';
        // priceRStr += '<div class="gel-vipR-content-left-six">完成支付后可在用户中心-我的订单中申请开票</div>';
        // priceRStr += '</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-center">';
        priceRStr += '<canvas class="gel-vipR-content-qcode"></canvas>';
        priceRStr += '<span class="gel-vipR-content-qcode-err wi-secondary-color wi-link-color" style="display:none;">' + intl('206308' /*网络异常*/ ) + ',' + intl('23569' /*刷新*/ ) + '</span>';
        priceRStr += '<div class="gel-vipR-content-center-tips">';
        priceRStr += '<img src="../resource/images/Company/qcode.png">';
        priceRStr += '<span class="">' + intl('209820' /*打开手机微信*/ ) + intl('209821' /*扫码继续支付*/ ) + '</span>';
        priceRStr += '</div>';
        priceRStr += '<div class="gel-vipR-content-qcode-bottom">企业库高级权限自完成支付起即时生效，支付7日到款后可向客户经理申请开发票</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-right">';
        if (Common.crmVipNoAccess) {
            priceRStr += '<div class="gel-vipR-content-right-up gel-vipR-content-right-up-disabled">';

            priceRStr += '<img src="../resource/images/Company/wx_done.png" style="width: 50px; display:block !important; margin:0 auto; margin-top: -40px;margin-bottom: 30px;"></img><span class="gel-vipR-content-right-tips">专属客户经理已收到开通需求，将在一个工作日内同您联系</span>';

            // priceRStr += '<div class="gel-vipR-content-right-btn gel-vipR-content-right-btn-disabled">正在处理...</div>';
            // priceRStr += '<img src="../resource/images/Company/crm_success.png"></img><span class="gel-vipR-content-right-tips">专属客户经理已收到开通需求，将在一个工作日内同您联系</span>';
            priceRStr += '</div>';
        } else {
            priceRStr += '<div class="gel-vipR-content-right-up">';
            priceRStr += '<div class="gel-vipR-content-right-btn">立即开通</div>';
            priceRStr += '<img src="../resource/images/Company/wx_done.png" style="width: 50px;margin:0 auto; margin-top: -40px;margin-bottom: 30px;display:none;" class="gel-vipR-content-right-done"></img><img src="../resource/images/Company/crm_success.png" class="gel-vipR-content-right-success"></img><span class="gel-vipR-content-right-tips">点击立即开通，专属客户经理将在一个工作日内同您联系</span>';
            priceRStr += '</div>';
        }
        priceRStr += '<div class="gel-vipR-content-right-down" style="display:none;">';
        priceRStr += '<div>客服</div>';
        priceRStr += '<img src="../resource/images/Company/seler-phone.png"></img><span>400-820-9463</span> <img src="../resource/images/Company/seler-email.png"></img><span>service@wind.com.cn</span>';

        priceRStr += '</div>';

        priceRStr += '</div>';

        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '</div>';

        var sucId = 'gel-vipS-' + tc;
        var priceSucStr = '<div class="gel-vip-model gel-vipS-' + tc + '" style="display:none;">';
        priceSucStr += '    <div class="gel-vip-content">'
        priceSucStr += '        <div class="gel-vip-header">'
        priceSucStr += '            <div class="gel-vip-title">支付成功</div>'
        priceSucStr += '            <div class="gel-vip-tips"></div>'
        priceSucStr += '        </div>'
        priceSucStr += '    <div class="gel-vipS-content">'
        priceSucStr += '        <img src="../resource/images/Company/wx_success.png">'
        priceSucStr += '        <div class="gel-vipS-tips">已为您开通<span class="gel-vipS-type"></span>权限</div>'
        priceSucStr += '        <div class="gel-vipS-desc" style="display:none;">'
        priceSucStr += '            <div class="gel-vipS-phone" style="display:none;">如果WFT账号到期, 您可通过手机号<span></span>继续使用全球企业库</div>'
        priceSucStr += '            <div class="gel-vipS-email" style="display:none;">如果WFT账号到期, 您可通过邮箱账号<span></span>继续使用全球企业库</div>'
        priceSucStr += '            <div class="">网址：<a href="http://gel.wind.com.cn" target="_blank">gel.wind.com.cn</a></div>'
        priceSucStr += '       </div>'
        priceSucStr += '       <div class="gel-vipS-btn">确 定</div>'
        priceSucStr += '     </div>'
        priceSucStr += '  </div>'
        priceSucStr += '   </div>';

        // TODO 请求是否有CRM开通企业套餐的权限
        if (!Common.crmVipNoAccess) {
            Common.getCrmAccess();
        }
        return {
            left: {
                id: l, // 选择器
                str: priceStr // 内容区
            },
            right: {
                id: r, // 选择器
                str: priceRStr // 内容区                
            },
            success: {
                id: sucId,
                str: priceSucStr
            },
            tc: tc,
            onlysvip: onlysvip ? 1 : 0,
        }
    },
    notVipWindow: function(left, right, onlysvip) {
        left = left || {};
        right = right || {};
        var tc = Date.now(); // 时间戳

        if (!window.__userNoteStr__) {
            $('body').append('<script type="text/javascript" src="../resource/js/usernote.js"></script>');
        }

        if (!$('[data-type="windgel-vip-model"]').length) {
            $('body').append('<link href="../resource/css/vipModel.css?v=' + tc + '" rel="stylesheet" data-type="windgel-vip-model" />');
        }
        if (!$('[data-type="windgel-vip-qrcode"]').length) {
            $('body').append('<script type="text/javascript" src="../resource/js/qrcode.min.js" data-type="windgel-vip-qrcode"></script>');
        }
        var l = 'gel-vipL-' + tc; // 默认展示内容区css
        var r = 'gel-vipR-' + tc; // 二维码内容区css
        var title = left.title || intl('149697' /*全球企业库*/ );
        var tips = [];
        if (!left.tips) {
            tips = ['购买企业套餐, 即可查看更多全球企业库信息', '购买企业套餐, 即可查看更多全球企业库信息'];
        }
        if (left.tips instanceof Array) {
            if (left.tips.length < 3) {
                left.tips[2] = left.tips[0];
            }
            tips = left.tips;
        } else {
            tips = [left.tips, left.tips, left.tips];
        }
        var css = left.css || '';

        // 默认展示内容区
        var priceStr = '<div class="gel-vip-model ' + l + ' ' + css + '" style="' + (left.style || '') + '">';
        priceStr += '<div class="gel-vip-content">';
        priceStr += '<div class="gel-vip-header">';
        priceStr += '<div class="gel-vip-title">' + title + '</div>';
        priceStr += '<div class="gel-vip-tips">' + tips + '</div>';
        priceStr += '<div class="gel-vip-sec-model"><div class="gel-vipR-prices"><b class="">328元</b><span class="">/1年</span></div><div class="gel-vip-more">';
        // priceStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208682' /*查看全部权限*/ ) + '></a></div></div>';
        priceStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">查看全部权限</a></div></div>';

        priceStr += '</div>';

        priceStr += '<div class="gel-vip-three-model"><div class="gel-vip-btn">' + intl('204669' /*立即开通*/ ) + '</div><div class="gel-vip-btn-tip">支付后可开发票</div></div>';

        // priceStr += '<div class="gel-vip-more"><a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208682' /*查看全部权限*/ ) + '>>></a></div>';
        // priceStr += '<div class="gel-vip-btn">' + intl('204669' /*立即开通*/ ) + '</div>';
        // priceStr += '</div>';

        // 二维码内容区
        var Rcss = right.css || '';
        var price = right.price || '328';
        var account = right.account || '--';
        var deadline = right.deadline || '--';
        var pay = right.pay || '328.00';
        var onlySvipCss = 'gel-vipR-prices-only-svip';
        var onlySvipCssE = 'gel-vipR-prices-only-svip-e'

        var priceRStr = '<div class="gel-vip-model gel-vipR ' + r + ' ' + Rcss + '" style="display:none;' + (right.style || '') + '">';
        // priceRStr += '<div class="gel-vip-content gel-vip-content-left">';

        if (!onlysvip) {
            priceRStr += '<div class="gel-vip-content gel-vip-content-left" data-price-sel="vip">';
        } else {
            priceRStr += '<div class="gel-vip-content gel-vip-content-left" data-price-sel="svip">';
        }
        priceRStr += '<div class="gel-vip-header">';

        priceRStr += '<div class="gel-vip-title">' + title + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-left">' + tips[0] + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-right">' + tips[1] + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-more">' + tips[2] + '</div>';
        priceRStr += '<div class="gel-vip-tips gel-vip-tips-third">' + '该数据由第三方提供' + '</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-header">';

        if (!onlysvip) {
            priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-sel" data-prices="vip">';
            priceRStr += '<div class="">VIP</div>';
            priceRStr += '<b class="">' + 328 + intl('23334' /*元*/ ) + '</b>';
            priceRStr += '<span class="">/1' + intl('31342' /*年*/ ) + '</span>';
            priceRStr += '</div>';
            priceRStr += '<div class="gel-vipR-prices" data-prices="svip">';
        } else {
            priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-sel ' + onlySvipCss + '" data-prices="svip">';
        }
        priceRStr += '<div class="">SVIP</div>';
        priceRStr += '<b class="">' + 1680 + intl('23334' /*元*/ ) + '</b>';
        priceRStr += '<span class="">/1' + intl('31342' /*年*/ ) + '</span>';
        priceRStr += '</div>';

        if (!onlysvip) {
            priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-seler" data-prices="vip/svip">';
        } else {
            priceRStr += '<div class="gel-vipR-prices gel-vipR-prices-seler ' + onlySvipCssE + ' " data-prices="vip/svip">';
        }
        priceRStr += '<div class="">' + intl('208372' /* 企业套餐 */ ) + '</div>';
        priceRStr += '<span class="">VIP：' + '<i>280元</i>' + '/' + intl('38056' /* 人 */ ) + '/1' + intl('31342' /* 年 */ ) + '</span><br>';
        priceRStr += '<span class="">SVIP：' + '<i>1380元</i>' + '/' + intl('38056' /* 人 */ ) + '/1' + intl('31342' /* 年 */ ) + '</span>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-more">';
        // priceRStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208682' /*查看全部权限*/ ) + '>>></a>';
        priceRStr += '<a href="VersionPrice.html" target="_blank" class="wi-link-color wi-secondary-color">' + intl('208365' /* 查看全部权限和价格 */ ) + '</a>';
        priceRStr += '</div>';

        // priceRStr += '<div class="gel-vipR-line"></div>';
        // priceRStr += '<div class="gel-vipR-tips">';
        // priceRStr += '<div class="gel-vipR-tips-title">';
        // priceRStr += '<div class="">' + intl('209816' /*购买账号*/ ) + '：</div>';
        // priceRStr += '<div class="">' + intl('89265' /*到期时间*/ ) + '：</div>';
        // // priceRStr += '<div class="">' + intl('209817' /*实付金额*/ ) + '：</div>';
        // priceRStr += '</div>';
        // priceRStr += '<div class="gel-vipR-tips-info">';
        // priceRStr += '<div class="gel-vipR-data-account">' + account + '</div>';
        // priceRStr += '<div class="gel-vipR-data-deadline">' + deadline + '</div>';
        // // priceRStr += '<div class="wi-secondary-color gel-vipR-data-pay">￥' + pay + '</div>';
        // priceRStr += '</div>';
        // priceRStr += '</div>';

        priceRStr += '</div>';
        priceRStr += '<div class="gel-vipR-content gel-vipR-content-hide">';
        priceRStr += '<div class="gel-vipR-content-btn">立即开通</div>';

        priceRStr += '<div class="gel-vipR-content-left">';
        priceRStr += '<div class="gel-vipR-content-left-one gel-vipR-content-left-wx gel-vipR-content-left-one-sel">';
        priceRStr += '<img src="../resource/images/Company/wx.png">';
        priceRStr += '<span class="">' + intl('209818' /*微信支付*/ ) + '</span>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-left-one gel-vipR-content-left-seler">';
        priceRStr += '<img src="../resource/images/Company/seler.png">';
        priceRStr += '<span class="">' + '联系客户经理' + '</span>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-left-note">';
        priceRStr += '<span class="">' + '我已阅读并同意用户协议' + '</span>';
        priceRStr += '</div>';

        // priceRStr += '<div class="gel-vipR-content-left-two">' + intl('209819' /*企业库高级权限自完成支付起即时生效*/ ) + '</div>';

        // priceRStr += '<div class="gel-vipR-content-left-three"><input type="checkbox" class="" id="gel-vipR-tick" hidden data-target="' + 'gel-vipR-' + tc + '"><label class="gel-vipR-tick-label" for="gel-vipR-tick"></label><span>开具发票</span>';
        // priceRStr += '<a class="gel-vipR-tick-demo" href="#">发票样例></a>';
        // priceRStr += '<div class="gel-vipR-content-left-four">发票抬头：<span id="gel-vipr-tickcorp"></span></div>';
        // priceRStr += '<div class="gel-vipR-content-left-five" data-target="' + 'gel-vipR-' + tc + '">编辑发票信息></div>';
        // priceRStr += '<div class="gel-vipR-content-left-six">完成支付后可在用户中心-我的订单中申请开票</div>';
        // priceRStr += '</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-center">';
        priceRStr += '<canvas class="gel-vipR-content-qcode"></canvas>';
        priceRStr += '<span class="gel-vipR-content-qcode-err wi-secondary-color wi-link-color" style="display:none;">' + intl('206308' /*网络异常*/ ) + ',' + intl('23569' /*刷新*/ ) + '</span>';
        priceRStr += '<div class="gel-vipR-content-center-tips">';
        priceRStr += '<img src="../resource/images/Company/qcode.png">';
        priceRStr += '<span class="">' + intl('209820' /*打开手机微信*/ ) + intl('209821' /*扫码继续支付*/ ) + '</span>';
        priceRStr += '</div>';
        priceRStr += '<div class="gel-vipR-content-qcode-bottom">企业库高级权限自完成支付起即时生效，支付7日到款后可向客户经理申请开发票</div>';
        priceRStr += '</div>';

        priceRStr += '<div class="gel-vipR-content-right">';
        if (Common.crmVipNoAccess) {
            priceRStr += '<div class="gel-vipR-content-right-up gel-vipR-content-right-up-disabled">';

            priceRStr += '<img src="../resource/images/Company/wx_done.png" style="width: 50px; display:block !important; margin:0 auto; margin-top: -40px;margin-bottom: 30px;"></img><span class="gel-vipR-content-right-tips">专属客户经理已收到开通需求，将在一个工作日内同您联系</span>';

            // priceRStr += '<div class="gel-vipR-content-right-btn gel-vipR-content-right-btn-disabled">正在处理...</div>';
            // priceRStr += '<img src="../resource/images/Company/crm_success.png"></img><span class="gel-vipR-content-right-tips">专属客户经理已收到开通需求，将在一个工作日内同您联系</span>';
            priceRStr += '</div>';
        } else {
            priceRStr += '<div class="gel-vipR-content-right-up">';
            priceRStr += '<div class="gel-vipR-content-right-btn">立即开通</div>';
            priceRStr += '<img src="../resource/images/Company/wx_done.png" style="width: 50px;margin:0 auto; margin-top: -40px;margin-bottom: 30px;display:none;" class="gel-vipR-content-right-done"></img><img src="../resource/images/Company/crm_success.png" class="gel-vipR-content-right-success"></img><span class="gel-vipR-content-right-tips">点击立即开通，专属客户经理将在一个工作日内同您联系</span>';
            priceRStr += '</div>';
        }
        priceRStr += '<div class="gel-vipR-content-right-down" style="display:none;">';
        priceRStr += '<div>客服</div>';
        priceRStr += '<img src="../resource/images/Company/seler-phone.png"></img><span>400-820-9463</span> <img src="../resource/images/Company/seler-email.png"></img><span>service@wind.com.cn</span>';

        priceRStr += '</div>';

        priceRStr += '</div>';

        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '</div>';
        priceRStr += '</div>';

        var sucId = 'gel-vipS-' + tc;
        var priceSucStr = '<div class="gel-vip-model gel-vipS-' + tc + '" style="display:none;">';
        priceSucStr += '    <div class="gel-vip-content">'
        priceSucStr += '        <div class="gel-vip-header">'
        priceSucStr += '            <div class="gel-vip-title">支付成功</div>'
        priceSucStr += '            <div class="gel-vip-tips"></div>'
        priceSucStr += '        </div>'
        priceSucStr += '    <div class="gel-vipS-content">'
        priceSucStr += '        <img src="../resource/images/Company/wx_success.png">'
        priceSucStr += '        <div class="gel-vipS-tips">已为您开通<span class="gel-vipS-type"></span>权限</div>'
        priceSucStr += '        <div class="gel-vipS-desc" style="display:none;">'
        priceSucStr += '            <div class="gel-vipS-phone" style="display:none;">如果WFT账号到期, 您可通过手机号<span></span>继续使用全球企业库</div>'
        priceSucStr += '            <div class="gel-vipS-email" style="display:none;">如果WFT账号到期, 您可通过邮箱账号<span></span>继续使用全球企业库</div>'
        priceSucStr += '            <div class="">网址：<a href="http://gel.wind.com.cn" target="_blank">gel.wind.com.cn</a></div>'
        priceSucStr += '       </div>'
        priceSucStr += '       <div class="gel-vipS-btn">确 定</div>'
        priceSucStr += '     </div>'
        priceSucStr += '  </div>'
        priceSucStr += '   </div>';

        // TODO 请求是否有CRM开通企业套餐的权限
        if (!Common.crmVipNoAccess) {
            Common.getCrmAccess();
        }
        return {
            left: {
                id: l, // 选择器
                str: priceStr // 内容区
            },
            right: {
                id: r, // 选择器
                str: priceRStr // 内容区                
            },
            success: {
                id: sucId,
                str: priceSucStr
            },
            tc: tc,
            onlysvip: onlysvip ? 1 : 0,
            userNoteStr: window.__userNoteStr__ || '',
        }
    },
    createTicks: function(tt) {
        var orderId = tt.orderId || '';
        var ismask = tt.invoiceId ? true : false;
        var ismaskstr = ismask ? 'style="display:block;"' : 'style="display:none;"';
        var tick = ismask ? tt : Common.lastTicks;
        var paperChecked = tick.invoiceMaterial == 'paper' ? 1 : 2;
        var personChecked = tick.entityType == 'person' ? 1 : 2;
        var maskBtnStr = ismask ? '<div class="gel-vipR-tick-content-btns"><span id="gel-vipR-tick-back">关闭</span></div>' : '<div class="gel-vipR-tick-content-btns"><span id="gel-vipR-tick-save">保存</span><span id="gel-vipR-tick-back">暂不开票</span></div>';
        var str = '<div class="gel-vipR-tick-content">'
        str += '<form id="gel-vipR-tick-form" data-orderid="' + orderId + '">'
        str += '<div class="gel-vipR-tick-content-label"><span>发票类型</span><span>增值税普通发票</span></div>'
        str += '    <div class="gel-vipR-tick-content-label gel-vipR-tick-content-radio" id="gel-tick-type"><span>发票材质</span><input type="radio" name="type" value="电子" ' + (paperChecked == 2 ? "checked" : "") + ' id="gel-tick-dianzi" />';
        str += '<label for="gel-tick-dianzi" data-type="1" style="cursor:pointer">电子</label><input type="radio" name="type" value="纸质" id="gel-tick-zhizhi" ' + (paperChecked == 1 ? "checked" : "") + ' /><label for="gel-tick-zhizhi" data-type="2" style="cursor:pointer">纸质</label></div>'
        str += '<div class="gel-vipR-tick-content-label gel-vipR-tick-content-radio" id="gel-tick-opt"><span>发票选项</span><input type="radio" name="opt" value="企业" ' + (personChecked == 2 ? "checked" : "") + ' id="gel-tick-qiye" />';
        str += '<label for="gel-tick-qiye" style="cursor:pointer" data-type="3">企业</label><input type="radio" name="opt" value="个人"  id="gel-tick-geren" ' + (personChecked == 1 ? "checked" : "") + ' /><label for="gel-tick-geren" style="cursor:pointer" data-type="4">个人</label></div>'
        str += '<div class="gel-vipR-tick-content-label"><span>发票抬头</span><input class="gel-vipR-tick-content-input" placeholder="填写公司名称" id="gel-tick-title" value=' + (tick.title || "") + ' ><div class="gel-vipR-tick-content-label-err" data-for="gel-tick-title">请填写正确的发票抬头</div></div>'
        str += '<div class="gel-vipR-tick-content-label gel-tick-no"><span>纳税人识别号</span><input class="gel-vipR-tick-content-input" placeholder="填写税务登记证上唯一识别企业的税号" id="gel-tick-creditCode" value= ' + (tick.creditCode || "") + ' ><div class="gel-vipR-tick-content-label-err" data-for="gel-tick-creditCode">请填写正确的纳税人识别号(15、17、18或20位数字或字母)</div></div>'
        str += '<div class="gel-vipR-tick-content-label"><span>开票金额</span><span id="gel-tick-expense">328.00</span></div>'
        str += '<div class="gel-vipR-tick-content-label"><span>发票内容</span><span id="gel-tick-content">技术服务费</span></div>'
        str += '<div class="gel-vipR-tick-content-label gel-tick-emails"><span>接收邮箱</span><input class="gel-vipR-tick-content-input" placeholder="填写接收Email地址" id="gel-tick-email" value= ' + (tick.email || "") + ' ><div class="gel-vipR-tick-content-label-err" data-for="gel-tick-email">请填写正确的邮箱</div></div>'
        str += '<div class="gel-tick-posts">'
        str += ' <div class="gel-vipR-tick-content-label"><span>收件人</span><input class="gel-vipR-tick-content-input" placeholder="填写收件人姓名" id="gel-tick-name" value= ' + (tick.name || "") + ' ><div class="gel-vipR-tick-content-label-err" data-for="gel-tick-name">请填写正确的收件人姓名</div></div>'
        str += '<div class="gel-vipR-tick-content-label"><span>手机号</span><input class="gel-vipR-tick-content-input" placeholder="填写手机号码" id="gel-tick-phone" value=' + (tick.phone || "") + ' ><div class="gel-vipR-tick-content-label-err" data-for="gel-tick-phone">请填写正确的手机号码(11位数字)</div></div>'
        str += '<div class="gel-vipR-tick-content-label"><span>邮寄地址</span><input class="gel-vipR-tick-content-input" placeholder="填写邮寄地址" id="gel-tick-address" value= ' + (tick.address || "") + ' ><div class="gel-vipR-tick-content-label-err" data-for="gel-tick-address">请填写正确的邮寄地址</div></div>'
        str += '</div>'
        str += '</form>'
        str += maskBtnStr;
        str += '</div>'
        str += '<div class="gel-vipR-tick-mask" ' + ismaskstr + ' >';
        str += '</div>'

        return str;
    },
    createTicksDetail: function(tick) {
        var str = '<table class="tab-basicInfo"><tbody>';
        str += '<tr> <td class="tit-tab-basicInfo">发票类型</td> <td>' + (tick.invoiceType || "增值税普通发票") + '</td> </tr>';
        str += '<tr> <td class="tit-tab-basicInfo">发票材质</td> <td>' + (tick.invoiceMaterial == 'paper' ? '纸质' : '电子') + '</td> </tr>';
        str += '<tr> <td class="tit-tab-basicInfo">发票选项</td> <td>' + (tick.entityType == 'person' ? '个人' : '企业') + '</td> </tr>';
        str += '<tr> <td class="tit-tab-basicInfo">发票抬头</td> <td>' + (tick.title || "--") + '</td> </tr>';
        if (tick.entityType == 'corp') {
            str += '<tr> <td class="tit-tab-basicInfo">纳税人识别号</td><td>' + (tick.creditCode || "--") + '</td> </tr>';
        }
        str += '<tr> <td class="tit-tab-basicInfo">开票金额</td> <td>' + (Common.formatMoney(tick.expense, ['']) || "") + '</td> </tr>';
        str += '<tr> <td class="tit-tab-basicInfo">发票内容</td> <td>' + (tick.content || "技术服务费") + '</td> </tr>';
        if (tick.invoiceMaterial == 'digital') {
            str += '<tr> <td class="tit-tab-basicInfo">接收邮箱</td> <td>' + (tick.email || "--") + '</td> </tr>';
        } else {
            str += '<tr> <td class="tit-tab-basicInfo">收件人</td> <td>' + (tick.name || "--") + '</td> </tr>';
            str += '<tr> <td class="tit-tab-basicInfo">手机号</td> <td>' + (tick.phone || "--") + '</td> </tr>';
            str += '<tr> <td class="tit-tab-basicInfo">邮寄地址</td> <td>' + (tick.address || "--") + '</td> </tr>';
        }
        str += '</tbody></table>';
        return str;
    },
    vipTicksHandler: function(root) {
        $(root).find('.gel-vipR-tick-content-radio').on('change', 'input:radio', function(e) {
            var t = $(e.target);
            var form = $(t).closest('form');
            var inputType = $(form).find('input:radio[name="type"]:checked');
            var inputOpt = $(form).find('input:radio[name="opt"]:checked');
            var typeVal = $(inputType).val();
            var optVal = $(inputOpt).val();
            if (optVal == '企业') {
                $(form).find('#gel-tick-title').attr('placeholder', '填写公司名称');
            } else {
                $(form).find('#gel-tick-title').attr('placeholder', '填写姓名');
            }
            if (typeVal == '纸质') {
                if (optVal == '企业') {
                    $(form).attr('class', 'gel-tick-form-two');
                    return;
                }
                $(form).attr('class', 'gel-tick-form-three');
                return;
            } else {
                // 电子
                if (optVal == '个人') {
                    $(form).attr('class', 'gel-tick-form-four');
                    return;
                }
            }
            $(form).attr('class', '');
            return;
        });
        $(root).find('#gel-vipR-tick-back').on('click', function(e) {
            var p = $(e.target).closest('.gel-vip-model');
            $(p).removeClass('show-tick');
            $(p).removeClass('check-tick');
            $(p).find('#gel-vipR-tick').attr('checked', false);
        });
        $(root).find('#gel-vipR-tick-save').on('click', function(e) {
            Common.saveTicks(e);
        });
    },
    payCodeHandlerExport: function(obj, res) {
        var err = $('.' + obj.right.id).find('.gel-vipR-content-qcode-err');
        var canvas = $('.' + obj.right.id).find('.gel-vipR-content-qcode')[0];
        if (obj.inter) {
            // 如果是已经创建过的，重新请求后，必须将之前的inter清除!!!
            window.clearInterval(obj.inter);
        }

        var isForeign = res.isForeign;
        var account = isForeign ? res.email : res.phone;
        obj.isForeign = res.isForeign;
        obj.phone = res.phone;
        obj.email = res.email;
        QRCode.toCanvas(canvas, res.payUrl, { width: 169 }, function(error) {
            if (error) {
                console.error('qcode error', res.payUrl);
                console.error(error);
                layer.msg('二维码生产异常!(-4)');
            } else {
                console.log('success!');
                obj.orderId = res.orderId;
                obj.inter = setInterval(call, 1000);
            }
        });
        if (0) {
            err.show();
        }

        /**
         * 支付成功回调 轮询处理
         * 
         */
        function call() {
            console.warn('ele:' + obj.tc, 'orderId:' + obj.orderId);
            myWfcAjax("getpayorderinfo", { orderId: obj.orderId }, function(data) {
                var res2 = JSON.parse(data);
                if (res2.ErrorCode == 0) {
                    if (res2.Data.orderStatus == '2' || res2.Data.orderStatus == '5' || res2.Data.orderStatus == '4') {
                        layer.msg('支付成功');
                        window.layer.closeAll();
                        try {
                            obj.inter && window.clearInterval(obj.inter);
                        } catch (e) {

                        }
                        res.successFun && res.successFun();
                        window.open("../customer/index.html#mylist")
                    }
                } else {
                    try {
                        // obj.inter && clearInterval(obj.inter)
                    } catch (e) {

                    }
                    console.log('支付异常!(-2)');
                }
            }, function() {
                try {
                    // obj.inter && clearInterval(obj.inter);
                } catch (e) {

                }
                console.log('支付失败!(500)');
            })
        }
    },
    payCodeHandler: function(obj, p) {
        var err = $('.' + obj.right.id).find('.gel-vipR-content-qcode-err');
        var canvas = $('.' + obj.right.id).find('.gel-vipR-content-qcode')[0];
        if (obj.inter) {
            // 如果是已经创建过的，重新请求后，必须将之前的inter清除!!!
            window.clearInterval(obj.inter);
        }
        obj.ispending = true;
        myWfcAjax("createpayorder", { productName: p ? p : 'vip' }, function(data) {
            obj.ispending = false;
            var res = JSON.parse(data);
            if (res.ErrorCode == 0) {
                res = res.Data;
                if (!res.payUrl) {
                    err.show();
                    return;
                } else {
                    err.hide();
                    var isForeign = res.isForeign;
                    var account = isForeign ? res.email : res.phone;
                    obj.isForeign = res.isForeign;
                    obj.phone = res.phone;
                    obj.email = res.email;
                    $('.' + obj.right.id).find('.gel-vipR-data-account').text(account || '--');
                    $('.' + obj.right.id).find('.gel-vipR-data-deadline').text(res.expireDate ? Common.formatTime(res.expireDate) : '--');
                    // $('.' + obj.right.id).find('.gel-vipR-data-pay').text(res.pay ? Common.formatMoney(res.pay) : '328.00元');
                    QRCode.toCanvas(canvas, res.payUrl, { width: 169 }, function(error) {
                        if (error) {
                            console.error('qcode error', res.payUrl);
                            console.error(error);
                            layer.msg('二维码生产异常!(-4)');
                        } else {
                            console.log('success!');
                            obj.orderId = res.orderId;
                            obj.inter = setInterval(call, 1000);
                        }
                    });
                }
            } else {
                layer.msg('二维码获取异常!(-2)');
                err.show();
                return;
            }
        }, function() {
            obj.ispending = false;
            layer.msg('二维码获取失败!(500)');
            err.show();
            return;
        });

        /**
         * 支付成功回调 轮询处理
         * 
         */
        function call() {
            console.warn('ele:' + obj.tc, 'orderId:' + obj.orderId);
            myWfcAjax("getpayorderinfo", { orderId: obj.orderId }, function(data) {
                var res = JSON.parse(data);
                if (res.ErrorCode == 0) {
                    if (res.Data.orderStatus == '2' || res.Data.orderStatus == '5' || res.Data.orderStatus == '4') {
                        layer.msg('支付成功, 请点击确认按钮继续使用');
                        try {
                            obj.inter && window.clearInterval(obj.inter);
                        } catch (e) {

                        }

                        if (obj.successFun) {
                            window.layer.closeAll();
                            return obj.successFun();
                        }
                        $('.gel-vipR-' + obj.tc).hide();
                        $('.gel-vipS-' + obj.tc).show();
                        if (is_terminal) {
                            if (p && p == 'svip') {
                                $('.gel-vipS-' + obj.tc).find('.gel-vipS-type').text('SVIP');
                            } else {
                                $('.gel-vipS-' + obj.tc).find('.gel-vipS-type').text('VIP');
                            }
                            $('.gel-vipS-' + obj.tc).find('.gel-vipS-email span').text(obj.email);
                            $('.gel-vipS-' + obj.tc).find('.gel-vipS-phone span').text(obj.phone);
                            $('.gel-vipS-' + obj.tc).find('.gel-vipS-desc').show();
                            if (obj.isForeign) {
                                $('.gel-vipS-' + obj.tc).find('.gel-vipS-email').show();
                            } else {
                                $('.gel-vipS-' + obj.tc).find('.gel-vipS-phone').show();
                            }
                        }
                    }
                } else {
                    try {
                        // obj.inter && clearInterval(obj.inter)
                    } catch (e) {

                    }
                    console.log('支付异常!(-2)');
                }
            }, function() {
                try {
                    // obj.inter && clearInterval(obj.inter);
                } catch (e) {

                }
                console.log('支付失败!(500)');
            })
        }

        // Common.getLastTick(function() {
        //     $('.' + obj.right.id).find('#gel-vipr-tickcorp').text(res.title);
        // })
    },
    payCodeCancel: function(obj) {
        if (obj && obj.inter) {
            // 如果是已经创建过的，重新请求后，必须将之前的inter清除!!!
            window.clearInterval(obj.inter);
        }
    },
    userNoteKlass: {
        getItem: function(callback) {
            myWfcAjax('getuseragreement', {}, function(data) {
                var res = JSON.parse(data);
                if (res.ErrorCode == 0 && res.Data && res.Data.agreed) {
                    // 已经同意过
                    Common.userNoteAgreed = 1;
                    window.localStorage.setItem(Common.localStorageMap.commonUserNoteAgree, '1');
                    callback(1);
                } else {
                    Common.userNoteAgreed = 0;
                    callback(0);
                }
            }, function() {
                Common.userNoteAgreed = 0;
                callback(0);
            })
        },
        setItem: function() {
            myWfcAjax('setuseragreement', {}, function(data) {
                var res = JSON.parse(data);
                if (res.ErrorCode == 0 && res.Data && res.Data == 1) {
                    Common.userNoteAgreed = 1;
                    window.localStorage.setItem(Common.localStorageMap.commonUserNoteAgree, '1');
                }
            })
        }
    },
    getTickWithId: function name(id, successFun, errFun) {
        if (!id) return;
        myWfcAjax('getinvoicebyid', { invoiceId: id }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0) {
                res = res.Data;
                var tick = {
                    invoiceId: res.invoiceId,
                    entityType: res.entityType,
                    invoiceType: res.invoiceType,
                    invoiceMaterial: res.invoiceMaterial,
                    title: res.title,
                    creditCode: res.creditCode,
                    content: res.content,
                    expense: res.expense,
                    phone: res.phone,
                    email: res.email,
                    province: res.province,
                    city: res.city,
                    county: res.county,
                    address: res.address,
                    state: res.state ? res.state - 0 : 0,
                };
                successFun && successFun(tick);
            } else {
                errFun && errFun();
                console.log('订单初始化失败!');
            }
        }, function() {
            errFun && errFun();
            console.log('订单初始化失败!');
        });
    },
    getLastTick: function(successFun, errFun) {
        Common.lastTicks = Common.lastTicks || {};
        if (!Common.lastTicks.invoiceId) {
            myWfcAjax('getlastinvoice', {}, function(data) {
                var res = JSON.parse(data);
                if (res.ErrorCode == 0) {
                    res = res.Data;
                    Common.lastTicks = {
                        invoiceId: res.invoiceId,
                        entityType: res.entityType,
                        invoiceType: res.invoiceType,
                        invoiceMaterial: res.invoiceMaterial,
                        title: res.title,
                        creditCode: res.creditCode,
                        content: res.content,
                        expense: res.expense,
                        phone: res.phone,
                        email: res.email,
                        province: res.province,
                        city: res.city,
                        county: res.county,
                        address: res.address,
                        state: res.state,
                    };
                    successFun && successFun();
                } else {
                    Common.lastTicks = {};
                    errFun && errFun();
                    console.log('订单初始化失败!');
                }
            }, function() {
                Common.lastTicks = {};
                errFun && errFun();
                console.log('订单初始化失败!');
            })
        } else {
            successFun && successFun();
        }
    },
    /** 获取是否可以创建CRM工单权限 */
    getCrmAccess: function() {
        myWfcAjax("enablepurchase", {}, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0) {
                if (res.Data.enable === false) {
                    //  TODO 只在无CRM工单开通权限时赋值
                    Common.crmVipNoAccess = true;
                }
            }
        }, function() {})
    },
    /** 创建企业套餐CRM工单 */
    createCrmTick: function(p, successFun) {
        myWfcAjax("purchaseintention", { product: p == 'svip' ? 'svip' : 'vip' }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0) {
                Common.crmVipNoAccess = true;
                successFun && successFun();
            } else {
                layer.msg('操作失败, 请稍后重试(-2)');
            }
        }, function() {
            layer.msg('操作失败, 请稍后重试(-500)');
        })
    },
    isEmail: function(emailStr) {
        var emailReg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-z0-9]+$/;
        return emailReg.test(emailStr)
    },
    saveTicks: function(e) {
        var t = $(e.target).closest('.gel-vipR-tick-content').find('form');
        var orderId = $(t).attr('data-orderid');
        var phone = $.trim($(t).find('#gel-tick-phone').removeClass('gel-vipR-tick-input-err').val());
        var email = $.trim($(t).find('#gel-tick-email').removeClass('gel-vipR-tick-input-err').val());
        var emailReg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-z0-9]+$/;
        var opt = $(t).find('input:radio[name="opt"]:checked').removeClass('gel-vipR-tick-input-err').val();
        var type = $(t).find('input:radio[name="type"]:checked').removeClass('gel-vipR-tick-input-err').val();
        var title = $.trim($(t).find('#gel-tick-title').removeClass('gel-vipR-tick-input-err').val());
        var code = $.trim($(t).find('#gel-tick-creditCode').removeClass('gel-vipR-tick-input-err').val());
        var name = $.trim($(t).find('#gel-tick-name').removeClass('gel-vipR-tick-input-err').val());
        var addr = $.trim($(t).find('#gel-tick-address').removeClass('gel-vipR-tick-input-err').val());
        var fromOrder = $(t).closest('.layer-vip-popup');
        var count = 0;
        if (!title) {
            $(t).find('#gel-tick-title').addClass('gel-vipR-tick-input-err');
            count++;
        }
        if (opt == '企业') {
            if (!code) {
                $(t).find('#gel-tick-creditCode').addClass('gel-vipR-tick-input-err');
                count++;
            } else {
                var codeReg = /^([a-zA-Z0-9]){15,20}$/;
                if (!codeReg.test(code)) {
                    $(t).find('#gel-tick-creditCode').addClass('gel-vipR-tick-input-err');
                    count++;
                }
                if (code.length !== 15 && code.length !== 17 && code.length !== 18 && code.length !== 20) {
                    $(t).find('#gel-tick-creditCode').addClass('gel-vipR-tick-input-err');
                    count++;
                }
            }
        }
        if (type == '纸质') {
            if (!name) {
                $(t).find('#gel-tick-name').addClass('gel-vipR-tick-input-err');
                count++;
            }
            if (!(/^1\d{10}$/).test(phone)) {
                $(t).find('#gel-tick-phone').addClass('gel-vipR-tick-input-err');
                count++;
            }
            if (!addr) {
                $(t).find('#gel-tick-address').addClass('gel-vipR-tick-input-err');
                count++;
            }
        } else {
            if (!emailReg.test(email)) {
                $(t).find('#gel-tick-email').addClass('gel-vipR-tick-input-err');
                count++;
            }
        }
        if (count) {
            return false;
        }
        $(t).closest('.gel-vip-model').find('#gel-vipr-tickcorp').text(title);
        var param = {
            orderId: orderId,
            entityType: type == '个人' ? 'person' : 'corp',
            invoiceType: '增值税普通发票',
            invoiceMaterial: opt == '纸质' ? 'paper' : 'digital',
            title: title,
            creditCode: code,
            content: '技术服务费', // $(t).find('#gel-tick-content').val(),
            expense: $(t).find('#gel-tick-expense').text(),
            phone: phone,
            email: email,
            address: addr,
            name: name,
        }
        myWfcAjax('setinvoice', param, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0') {
                layer.msg('发票信息已保存');
                $(t).closest('.gel-vip-model').removeClass('show-tick');
                if ($(fromOrder).length) {
                    location.reload();
                }
            } else {
                layer.msg('保存失败!');
            }
        }, function() {
            layer.msg('保存失败!');
        })
    },
    terminalOrWeb: function(fn, fnWeb) {
        if (is_terminal) {
            fn();
        } else {
            if (fnWeb) {
                fnWeb();
            } else {
                layer.msg("该功能需登录Wind金融终端。")
            }
        }
    },
    isEmptyObject: function(obj) {
        for (var key in obj) { return false; }
        return true;
    },
    buryFromParam: function() {
        //为避免终端拿不到referrer
        var paramStr = '';
        try {
            var loadingPage = buryFCode.getUrlPage(location.href);
            loadingPage = loadingPage ? loadingPage : '';
            var paramDic = buryFCode.getUrlParam('local');
            var fromId = buryFCode.getCodeId(paramDic);
            fromId = fromId ? fromId : '';
            paramStr = '&fromPage=' + loadingPage + '&fromId=' + fromId;
        } catch (e) {

        }
        return paramStr;
    },
    /* 是否开启商业化 （目前只在部分需要开启商业化的页面上调用） */
    getVipConfigs: function(call) {
        var openVipConfig = 1; // 是否开启商业化 2020.08 之前需要单独处理后续直接都置为1
        Common.setToolBarByConfig(openVipConfig);
        call && call(openVipConfig);
    },
    setToolBarByConfig: function(isVipAuth) {
        var isCustomerHref = ""; //是不是在我的收藏等模块里，如果是的话就要注意相对路径。
        var isHome = false; //兼容首页与其他页面样式
        var isSuperBar = 0;
        if (location.href.indexOf("\/customer\/") > 0) {
            isCustomerHref = "../Company/";
        }
        if (location.href.indexOf("SearchHome.html") > 0) {
            isHome = true;
        }
        if (/SuperAdvancedSearch.html/i.test(location.href)) {
            isSuperBar = 1;
        }
        var toolHomeClass = isHome ? 'toolbar-link-color' : '';
        var tlloHomeTop = isHome ? 'tool-top-home' : '';
        var ele = $('#toolBar');
        var arr = [];
        if (!isVipAuth) {
            arr.push('<a id="toolbar-riskApi" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="http://corpeventserver/wind.ent.risk/apihelp/index.html">API</a>');
            arr.push('<a id="toolbar-mycustomer" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="../customer/index.html#customerlist" langkey="14896">' + intl('14896', '我的收藏') + '</a>');
            arr.push('<a id="toolbar-myriskcompany" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="../customer/index.html#mylist" langkey="141995">' + intl('141995', '我的数据') + '</a>');
            arr.push('<a id="toolbar-versionPrice" class="wi-link-color ' + toolHomeClass + '" style="display:none;" target="_blank" href="' + isCustomerHref + 'VersionPrice.html">' + intl('222403', 'VIP服务') + '</a>');
        } else {
            // arr.push('<a id="toolbar-advanced-search" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="AdvancedSearch02.html" langkey="225308">' + intl('225308', '企业筛选') + '</a>');
            // '<a class="wi-link-color advanced-search-icon" data-ori="高级搜索" target="_blank" href="' + isCustomerHref + 'AdvancedSearch02.html" langkey="67913" title="' + intl('225308', '企业筛选') + '"><span class="show-item-span">' + intl('225308', '企业筛选') + '</span></a>'
            // arr.push('<a id="toolbar-myriskcompany" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="../customer/index.html#mylist" langkey="141995">' + intl('141995', '我的数据') + '</a>');

            // arr.push('<a id="toolbar-App" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="' + isCustomerHref + 'App.html" langkey="215002">APP下载</a>');
            // if (is_terminal) {
            //     arr.push('<a id="toolbar-riskApi" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="http://corpeventserver/wind.ent.risk/apihelp/index.html">API</a>');
            // }
            // arr.push('<a id="toolbar-versionPrice" class="wi-link-color ' + toolHomeClass + '" target="_blank" href="' + isCustomerHref + 'VersionPrice.html">' + intl('222403', 'VIP服务') + '</a>');
            // arr.push('<div class="toolbar-usercenter">')
            // arr.push('<span class="toolbar-usercenter-txt ' + toolHomeClass + '" langkey="210156" >' + intl('210156', '用户中心') + '</span>');
            // arr.push('<div class="toolbar-usercenter-list ' + tlloHomeTop + '">');
            // arr.push('<a class="wi-link-color " target="_blank" href="../customer/index.html#myaccounts" langkey="20977">' + intl('20977', '我的账户') + '</a>');
            // arr.push('<a class="wi-link-color " target="_blank" href="../customer/index.html#myorders" langkey="153389">' + intl('153389', '我的订单') + '</a>');
            // arr.push('<a class="wi-link-color " target="_blank" href="../customer/index.html#customerlist" langkey="14896">' + intl('14896', '我的收藏') + '</a>');
            // arr.push('<a class="wi-link-color " target="_blank" href="../customer/index.html#mylist" langkey="141995">' + intl('141995', '我的数据') + '</a>');
            // arr.push('<a class="wi-link-color " target="_blank" href="../customer/index.html#usernote" langkey="">' + '用户协议' + '</a>');
            // arr.push('<a class="wi-link-color " target="_blank" href="' + isCustomerHref + 'updateLog.html" langkey="138569">' + intl('138569', '更新日志') + '</a>');
            // if (!is_terminal) {
            //     arr.push('<a class="wi-link-color toLogOut" href="/logout" langkey="">' + intl('21828', '退出登录') + '</a>');
            // }
        }
        arr = arr.join('');
        $(ele).append(arr);
    },
    internationToolInfo: function(funcList) {
        /* 国际化 ,所有自己的代码都在写在这个回调函数后*/
        if (window.wind && wind.langControl) {
            if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                wind.langControl.lang = 'zh';
                wind.langControl.locale = 'zh';
                wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
                    Common.international();
                    for (fi in funcList) {
                        funcList[fi]();
                    }
                }, function() {
                    // console.log('error');
                });
            } else {
                wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
                    Common.international();
                    for (fi in funcList) {
                        funcList[fi]();
                    }
                }, function() {
                    // console.log('error');
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
    },
};




/**
 * 右上角功能菜单功能点
 */
$('.toolbar-highpro').off('click').on('click', 'a', Common.highProBurycode);
timeNum = 30000;
// if (!localStorage.getItem('GEL_USER_ISFOREIGN')) {
//     // 如果本地没有值 先读取一遍
//     getuserpageinfoFun();
// } else {
//     // 集团系、p2p页面，需要预先调用一次
//     var needGetUserPagUrl = ["specialAppList.html", "searchGroupDepartment.html"];
//     for (var i = 0; i < needGetUserPagUrl.length; i++) {
//         if (location.href.indexOf(needGetUserPagUrl[i]) > -1) {
//             getuserpageinfoFun();
//             break;
//         }
//     }
// }
getuserpageinfoFun();
showFastcrawler();
var fastTimer = setInterval(showFastcrawler, timeNum);
window.onfocus = function() { fastTimer = setInterval(showFastcrawler, timeNum) }
window.onblur = function() { clearInterval(fastTimer) }

function showFastcrawler() {
    myWfcAjax("getcrawlstatus", {}, function(data) {
        console.log("getcrawlstatus")
        var res = JSON.parse(data);
        if (res.Data && res.Data.length > 0) {
            var finishArr = [];
            for (var i = 0; i < res.Data.length; i++) {
                if (res.Data[i].status == "1") {
                    finishArr.push(res.Data[i])
                }
            }
            if (finishArr.length > 0) {
                var contentArr = [];
                for (var i = 0; i < finishArr.length; i++) {
                    var name = finishArr[i].companyName ? finishArr[i].companyName : "";
                    var hrefStr = finishArr[i].windId ? 'Company.html?companycode=' + finishArr[i].windId : '';
                    var str = "<a class='wi-link-color wi-secondary-color' href=" + hrefStr + ">" + name + "</a>" + "已更新完成。<br/>"
                    contentArr.push(str)
                }
                layer.open({
                    type: 1,
                    offset: 'rb' //具体配置参考：offset参数项
                        ,
                    content: '<div style="padding: 20px 30px;">' + contentArr.join("") + '</div>',
                    btn: '关闭全部',
                    btnAlign: 'c' //按钮居中
                        //,id:"fast"
                        //,time:3000
                        ,
                    area: ['400px'],
                    shade: 0 //不显示遮罩
                        ,
                    success: function(ele) {
                        $(ele).find('.layui-layer-btn0').addClass('wi-secondary-bg');
                    }
                });
            }
        } else {
            clearInterval(fastTimer);
        }
    }, function() {
        clearInterval(fastTimer);
    })
}

function tryParseJson(data) {
    if (typeof(data) == "string") {
        return JSON.parse(data);
    }
    return data;
}

var is_external = Common.getUrlSearch("from").indexOf("external_") >= 0 ? true : false;
if (is_terminal) {
    $("#navRZTP").show();
}
if (!is_terminal) {
    $(document).on("click", ".invest-icon,.financing-icon,.risk-icon,.searchmap-icon,.ipo-code,#go2WI,.go2f5,.go2f9,.connect-wft,#containerChains a,.rank-detail,#toolbar-riskApi,.five-hundred-icon,.public-icon,.private-icon, .api-icon", function(e) {
        if (window.layer) {
            layer.msg("该功能需登录Wind金融终端。");
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    })
}