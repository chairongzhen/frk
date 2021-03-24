$(document).on("click", "#classifySearch a", function() {
    //首页标签切换
    $(this).addClass("sel").siblings().removeClass("sel");
    var oIndex = $("#classifySearch a").index(this);
    var type = $(this).attr("data-type");
    $("#searchArea>.each-search-area").eq(oIndex).show().siblings().hide();
    $(".input-toolbar-search-list,.input-toolbar-before-search").empty().removeClass("active");
    Home.showModule(type); //显示哪个模块的历史和热门
    return false;
});
$(document).on("click", ".btn-search-style", function() {
    //搜索按钮
    var keyword = $.trim($(this).prev("input").val());
    var $input = $(this).prev("input");
    var btnId = this.id;
    if (keyword.length && !$input.hasClass('placeholder')) {
        //深度搜索
        var companyname = encodeURI(keyword);
        //bury
        //拼接埋点的url参数,历史搜索
        var pingParam = buryFCode.paramBuryJson('add', { 'funcType': $input.attr('data-buryModule'), 'fromModule': $input.attr('data-buryModule') }); //是否要加souce 
        var url = "";
        if (btnId == "btn_search") {
            url = "SearchHomeList.html?linksource=CEL&keyword=" + keyword + pingParam
        } else if (btnId == "btn_search_person") {
            url = "SearchHomeList.html?type=person&keyword=" + keyword + pingParam;
        } else if (btnId == "btn_search_risk") {
            url = "SearchHomeList.html?type=risk&keyword=" + keyword + pingParam;
        } else if (btnId == "btn_search_news") {
            url = "SearchHomeList.html?type=news&keyword=" + keyword + pingParam;
        }
        if (url) {
            document.location.href = url;
        }
        return false;
    } else {
        // $input.focus();
        switch (btnId) {
            case 'btn_search':
                layer.msg(intl('', '请输入关键词'));
                break;
            case 'btn_search_risk':
                layer.msg(intl('', '请输入关键词'));
                break;
            case 'btn_search_person':
                layer.msg(intl('', '请输入人物姓名'));
                break;
        }
    }
});
$('#searchArea .txt_search').placeholder().keydown(function(event) {
    //搜索框placehoder及回车后执行搜索事件
    var $next = $(this).next(".btn-search-style");
    switch (event.keyCode) {
        case 13:
            if ($(this).val().length) {
                $next.trigger('click');
            }
            return false;
            break;
    }
});
$(document).on("click", ".search-keyword a", function() {
    //点击热门搜索关键词
    $this = $(this);
    $inputSearch = $this.parents(".each-search-area").find(".txt_search");
    $btn = $this.parents(".each-search-area").find(".btn-search-style");
    if ($this.text() !== "") {
        $inputSearch.val($this.text());
        $inputSearch.attr('data-buryModule', 'hotSearchCk'); //bury
        $inputSearch.attr('data-buryfromPageUId', buryFCode.getPageUId()); //bury
        $btn.trigger('click', true);
    }
    return false;
})
$('.competition-topic').on('click', 'div', function(e) {
    var index = $(e.target).index();
    var className = $(e.target).attr("class").split(' ')[0];
    switch (className) {
        case "icon-topic-quest-risk": //法律风险
            window.open('SearchHome.html?type=risk');
            break;
        case "icon-topic-intellectual": //知识产权
            window.open('SearchOther.html');
            break;
        case "icon-topic-brand": //项目品牌
            window.open('SearchProduct.html');
            break;
        case "icon-topic-global": //全球企业
            window.open('GlobalSearch.html');
            break;
        case "icon-topic-platform": //图谱平台
            window.open('ChartPlatForm.html');
            break;
        case "icon-topic-export": //批量导出
            window.open('BatchOutput.html');
            break;
        case "icon-topic-query": //批量查询
            window.open('BatchSearch.html');
            break;
        case "icon-topic-advanced": //高级搜索
            window.open('AdvancedSearch02.html');
            break;
        case "icon-topic-featured": //特色企业库
            window.open('specialApp.html');
            break;
        case "icon-topic-featured02": //特色内容库
            window.open('specialApp.html?page=specialCont');
            break;
        case "icon-topic-competitive": //竞争情报
            window.open('specialApp.html?page=netcomper');
            break;
        case "icon-topic-riskcontrol": //企业风控--
            Common.terminalOrWeb(function() { window.open('http://windcloudnote/wind.ent.risk/index.html') });
            break;
        case "icon-topic-judge": //裁判文书
            window.open('SearchJudgement.html');
            break;
        case "icon-topic-corp": //企业查询
            window.open('SearchHome.html?type=company');
            break;
        case "icon-topic-person":
            window.open('SearchHomeList.html?type=company');
            break;
        case "icon-topic-news": //新闻查询
            window.open('SearchHome.html?type=news');
            break;
        case "icon-topic-relative": //关系查询
            window.open('SearchHome.html?type=relation');
            break;
        case "icon-topic-dishonest": //失信人查询
            window.open('SearchLaw.html?type=dishonest');
            break;
        case "icon-topic-executee": //被执行人查询
            window.open('SearchLaw.html?type=executee');
            break;
        case "icon-topic-court": //法院公告
            window.open('SearchLaw.html?type=court');
            break;
        case "icon-topic-opennotice": //开庭公告
            window.open('SearchLaw.html?type=openNotice');
            break;
        case "icon-topic-judicial": //司法拍卖
            window.open('SearchLaw.html?type=judicial');
            break;
        case "icon-topic-market": //商标查询
            window.open('SearchBrand.html');
            break;
        case "icon-topic-patent": //专利查询
            window.open('SearchPatent.html');
            break;
        case "icon-topic-work": //作品著作权
            window.open('SearchOther.html?type=work');
            break;
        case "icon-topic-soft": //软件著作权
            window.open('SearchOther.html?type=soft');
            break;
        case "icon-topic-project": //项目查询
            window.open('SearchProduct.html?type=project');
            break;
        case "icon-topic-make": //品牌查询
            window.open('SearchProduct.html?type=make');
            break;
        case "icon-topic-product": //产品查询
            window.open('SearchProduct.html?type=product');
            break;
        case "icon-topic-overview": //企业全景
            window.open('CompanyStatistics.html');
            break;
        case "icon-topic-job": //招聘
            window.open('SearchJob.html');
            break;
        case "icon-topic-stboard": //科创板
            window.open('specialAppList.html#stboard');
            break;
        case "icon-topic-tnb": //新三板
            window.open('specialAppList.html#tnb');
            break;
        case "icon-topic-ipo": //上市企业
            window.open('specialAppList.html#ipo');
            break;
        case "icon-topic-debt": //发债企业
            window.open('specialAppList.html#debt');
            break;
        case "icon-topic-fourbroad": //新四板
            window.open('specialAppList.html#nfe');
            break;
        case "icon-topic-p2p": //p2p大全
            window.open('specialAppList.html#p2p');
            break;
        case "icon-topic-invest": //投资机构---
            Common.terminalOrWeb(function() { window.open('//psmsserver/InvestmentBank/PEVC/PEVCExpress.aspx?page=c') });
            break;
        case "icon-topic-fivehundred": //500强企业--
            Common.terminalOrWeb(function() { window.open('//erdbserver/erdb/SearchNew.aspx?type=1&code=90000258&lan=cn') });
            break;
        case "icon-topic-public": //公募基金--
            Common.terminalOrWeb(function() { Common.onMore(2804, 'URC30516') });
            break;
        case "icon-topic-private": //私募基金--
            Common.terminalOrWeb(function() { Common.onMore(2958, 'URC50506') });
            break;
        case "icon-topic-bank": //银行
            window.open('specialAppList.html#bank');
            break;
        case "icon-topic-insurance": //保险公司
            window.open('specialAppList.html#insurance');
            break;
        case "icon-topic-stock": //证券公司
            window.open('specialAppList.html#stock');
            break;
        case "icon-topic-offered": //基金公司
            window.open('specialAppList.html#offered');
            break;
        case "icon-topic-future": //期货公司
            window.open('specialAppList.html#future');
            break;
        case "icon-topic-park": //园区大全--
            Common.terminalOrWeb(function() { window.open('https://GOVWebSite/govmap/?title=万寻地图&right=4C203DE15') });
            break;
        case "icon-topic-map": //地图查询--
            Common.terminalOrWeb(function() { window.open('https://GOVWebSite/govmap/?title=万寻地图&right=4C203DE15') });
            break;
        case "icon-topic-financing": //融资事件--
            Common.terminalOrWeb(function() { window.open('//psmsserver/InvestmentBank/PEVC/PEVCExpress.aspx?page=a') });
            break;
        case "icon-topic-gov": //政策法规
            window.open('specialApp.html?page=netcomper');
            break;
        case "icon-topic-group": //集团系
            window.open('SearchGroupDepartment.html');
            break;
        case "icon-topic-superList": //超级名单
            window.open('SuperAdvancedSearch.html');
            break;
        case "icon-topic-api": //API
            Common.terminalOrWeb(function() { window.open('http://corpeventserver/wind.ent.risk/apihelp/index.html') });
            break;
        case "icon-topic-search-dishonesty": //查老赖
            window.open('SearchDishonesty.html');
            break;
        case "icon-topic-anti-money": //反洗钱
            window.open('AntiMoneyLaunder.html');
            break;
        default:
            window.open('ChartPlatHome.html');
            break;
    }
})
$("#txt_search,#txt_search_person,#txt_search_risk,#txt_search_news").on('focus', function() {
    //输入框foucs事件
    var $this = $(this);
    var target = event.target;
    Home.showInputEvent($this, target)
});
var serachtimer; // 监听输入定时器
$("#txt_search,#txt_search_person,#txt_search_risk,#txt_search_news").on('input', function(event) {
    $this = $(this);
    clearTimeout(serachtimer);
    serachtimer = setTimeout(function() {
        var target = event.target;
        Home.showInputEvent($this, target)
    }, 300)
});
$('.search-relation .input-search-relation').on('focus', function(event) {
    // 显示预搜索
    val = $(this).val().trim();
    var $beforeSearchParent = this.id == "inputSearchRelation01" ? $('#inputToolbarBeforeSearch01') : $('#inputToolbarBeforeSearch02');
    var $historyListParent = this.id == "inputSearchRelation01" ? $('#inputToolbarHistorySearch01') : $('#inputToolbarHistorySearch02');
    var len = Common.getByteLen(val);
    if (val) {
        if (len >= 4) {
            Common.getPreSearch(val, function(res) {
                var data = res.corplist || [];
                var tag = res.tagCount ? res.tagCount.tagName : val;
                // 执行预搜索
                $beforeSearchParent.addClass('active');
                $beforeSearchParent.html('');
                if (!data.length) {
                    return;
                }
                var corp_name = '';
                for (var i = 0; i < data.length; i++) {
                    if (i > 4) {
                        return;
                    }
                    var ele = document.createElement('div');
                    $(ele).addClass('before-search-div')
                    corp_name = data[i].name;
                    ele.innerHTML = corp_name;
                    $(ele).attr('data-code', data[i].id);
                    $(ele).attr('data-name', corp_name);
                    $(ele).attr('title', corp_name);
                    $beforeSearchParent.append(ele);
                }
            }, function() {
                if ($beforeSearchParent.attr('id') === 'inputToolbarBeforeSearch02') {
                    return $.trim($('#inputSearchRelation02').val());
                } else if ($beforeSearchParent.attr('id') === 'inputToolbarBeforeSearch01') {
                    return $.trim($('#inputSearchRelation01').val());
                } else {
                    return val;
                }
            });
        }
    } else {
        var hisData = (Home.historyRelationSearchObj._historySearchObj && Home.historyRelationSearchObj._historySearchObj['relation']) ? Home.historyRelationSearchObj._historySearchObj['relation'] : [];
        if (!hisData.length) {
            return;
        }
        var val1 = $('#inputSearchRelation01').val().trim();
        var val2 = $('#inputSearchRelation02').val().trim();
        if (val1 || val2) {
            return;
        } else {
            var searchListParent = $historyListParent;
            searchListParent.addClass('active');
            searchListParent.addClass('history-long');
            searchListParent.html('');
            searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon" id="searchListIcon03"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');
            for (var i = 0; i < hisData.length; i++) {
                if (i > 4) {
                    break;
                }
                var obj = hisData[i];
                if (obj.queryHistory && obj.queryHistory.length && obj.queryCode && obj.queryInfo) {
                    var ele = document.createElement('div');
                    $(ele).addClass('search-list-div')
                    $(ele).text(obj.queryInfo.replace('|', '  —>  '));
                    $(ele).attr('data-name', obj.queryInfo.replace('|', '  —>  '));
                    $(ele).attr('data-code', obj.queryCode);

                    $(ele).attr('data-leftCorpName', obj.queryHistory[0].companyName);
                    $(ele).attr('data-leftPersonName', obj.queryHistory[0].personName);
                    $(ele).attr('data-rightCorpName', obj.queryHistory[1].companyName);
                    $(ele).attr('data-rightPersonName', obj.queryHistory[1].personName);

                    $(ele).attr('data-leftCorpCode', obj.queryHistory[0].companyCode);
                    $(ele).attr('data-rightCorpCode', obj.queryHistory[1].companyCode);
                    $(ele).attr('data-leftPersonId', obj.queryHistory[0].personName ? obj.queryCode.split(',')[0] : '');
                    $(ele).attr('data-rightPersonId', obj.queryHistory[1].personName ? obj.queryCode.split(',')[1] : '');

                    searchListParent.append(ele);
                }
            }
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
        e.preventDefault();
    })
    $(this).parent().off('mouseover', '.before-search-div').on('mouseover', '.before-search-div', function(e) {
        listDiv = $(inputEle).nextAll('.active');
        listEle = $(listDiv).find('.before-search-div');
        $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
        $(this).addClass('key-down-sel')
        e.preventDefault();
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
        if (cls === '.search-list-div') {
            var leftCorpName = '';
            var leftPersonName = ''
            var rightCorpName = ''
            var rightPersonName = ''
            var leftCorpCode = ''
            var rightCorpCode = ''
            var leftPersonId = ''
            var rightPersonId = ''
            switch (e.keyCode) {
                case 38: //上                                                    
                    if (upDownClickNum < 1) {
                        $(listEle).last().addClass('key-down-sel');
                    } else {
                        $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                            .prev().filter(cls).addClass("key-down-sel")
                    }
                    var selEle = $(listEle).filter('.key-down-sel');

                    if (selEle.length) {
                        leftCorpName = $(selEle).attr('data-leftcorpname')
                        rightCorpName = $(selEle).attr('data-rightcorpname')
                        leftCorpCode = $(selEle).attr('data-leftcorpcode')
                        rightCorpCode = $(selEle).attr('data-rightcorpcode')
                        $('#inputSearchRelation01').val(leftCorpName).attr('data-code', leftCorpCode);
                        $('#inputSearchRelation02').val(rightCorpName).attr('data-code', rightCorpCode);
                    } else {
                        $('#inputSearchRelation01').val('').attr('data-code', '');
                        $('#inputSearchRelation02').val('').attr('data-code', '');
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
                    var selEle = $(listEle).filter('.key-down-sel');
                    if (selEle.length) {
                        leftCorpName = $(selEle).attr('data-leftcorpname')
                        rightCorpName = $(selEle).attr('data-rightcorpname')
                        leftCorpCode = $(selEle).attr('data-leftcorpcode')
                        rightCorpCode = $(selEle).attr('data-rightcorpcode')
                        $('#inputSearchRelation01').val(leftCorpName).attr('data-code', leftCorpCode);
                        $('#inputSearchRelation02').val(rightCorpName).attr('data-code', rightCorpCode);
                    } else {
                        $('#inputSearchRelation01').val('').attr('data-code', '');
                        $('#inputSearchRelation02').val('').attr('data-code', '');
                    }
                    e.preventDefault();
                    break;
                case 13:
                    if ($(listDiv).hasClass('active')) {
                        $(listEle).filter('.key-down-sel').trigger('click');
                    } else {
                        var companyCode01 = $("#inputSearchRelation01").attr("data-code");
                        var companyCode02 = $("#inputSearchRelation02").attr("data-code");
                        if (companyCode01 && companyCode02) {
                            $('#btnSearchRelation').trigger('click');
                        }
                    }
                    break;
            }
            return;
        }
        switch (e.keyCode) {
            case 38: //上                                            
                if (upDownClickNum < 1) {
                    $(listEle).last().addClass('key-down-sel');
                } else {
                    $(listEle).filter('.key-down-sel').removeClass("key-down-sel")
                        .prev().filter(cls).addClass("key-down-sel")
                }
                var selEle = $(listEle).filter('.key-down-sel');

                if (selEle.length) {
                    $(inputEle).val(selEle.attr('data-name')).attr('data-code', selEle.attr('data-code'));
                } else {
                    $(inputEle).val('').attr('data-code', '');
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
                var selEle = $(listEle).filter('.key-down-sel');
                if (selEle.length) {
                    $(inputEle).val(selEle.attr('data-name')).attr('data-code', selEle.attr('data-code'));
                } else {
                    $(inputEle).val('').attr('data-code', '');
                }
                e.preventDefault();
                break;
            case 13:
                if ($(listDiv).hasClass('active')) {
                    $(listEle).filter('.key-down-sel').trigger('click');
                } else {
                    var companyCode01 = $("#inputSearchRelation01").attr("data-code");
                    var companyCode02 = $("#inputSearchRelation02").attr("data-code");
                    if (companyCode01 && companyCode02) {
                        $('#btnSearchRelation').trigger('click');
                    }
                }
                break;
        }
    }

});

$(document).on("click", "#btnSearchRelation", function() {
    //查关系按钮
    var companyCode01 = $("#inputSearchRelation01").attr("data-code");
    var companyCode02 = $("#inputSearchRelation02").attr("data-code");
    var relationCode01 = $("#selPerson01").val();
    var relationCode02 = $("#selPerson02").val();
    if ((companyCode01 || relationCode01) && (companyCode02 || relationCode02)) {
        // 将选中的公司、人员信息带入
        var str = '';
        str = 'lc=' + companyCode01;
        if (relationCode01) {
            str = str + ('&lp=' + relationCode01);
            str = str + ('&lpn=' + encodeURI($("#selPerson01 option:selected").text()));
        }
        str = str + ('&rc=' + companyCode02);
        if (relationCode02) {
            str = str + ('&rp=' + relationCode02);
            str = str + ('&rpn=' + encodeURI($("#selPerson02 option:selected").text()));
        }
        str = str + ('&lcn=' + encodeURI($("#inputSearchRelation01").val()));
        str = str + ('&rcn=' + encodeURI($("#inputSearchRelation02").val()));

        window.open("ChartPlatForm.html?" + str);
    } else {
        layer.msg(intl('176478' /* 请选择关系双方公司或个人 */ ));
    }
})
$("#inputSearchRelation01,#inputSearchRelation02").on('input', function(event) {
    var $beforeSearchParent = this.id == "inputSearchRelation01" ? $('#inputToolbarBeforeSearch01') : $('#inputToolbarBeforeSearch02');
    var $check = this.id == "inputSearchRelation01" ? $('#check-companyname01') : $('#check-companyname02');
    var $sel = this.id == "inputSearchRelation01" ? $('#selPerson01') : $('#selPerson02');
    $(this).removeAttr("data-code");
    $check.attr("disabled", true);
    $check.attr("checked", false);
    $sel.empty().hide();
    clearTimeout(serachtimer);
    serachtimer = setTimeout(function() {
        var target = event.target;
        var val = $.trim($(target).val());
        if (val) {
            $('#inputToolbarHistorySearch01').removeClass('active');
            $('#inputToolbarHistorySearch02').removeClass('active');
            // 显示预搜索
            $beforeSearchParent.removeClass('active');
            val = val.trim();
            var len = Common.getByteLen(val);
            if (len >= 4) {
                Common.getPreSearch(val, function(res) {
                    var data = res.corplist || [];
                    var tag = res.tagCount ? res.tagCount.tagName : val;
                    // TODO 执行预搜索
                    var parent = $beforeSearchParent;
                    parent.addClass('active');
                    parent.html('');
                    if (!data.length) {

                        return;
                    }
                    var highTitle = '';
                    var corp_name = '';

                    for (var i = 0; i < data.length; i++) {
                        if (i > 4) {
                            return;
                        }
                        var ele = document.createElement('div');
                        // $(ele).addClass('before-search-div wi-link-color')
                        $(ele).addClass('before-search-div')
                        corp_name = data[i].name;
                        ele.innerHTML = corp_name;
                        $(ele).attr('data-code', data[i].id);
                        $(ele).attr('data-name', corp_name);
                        $(ele).attr('title', corp_name);
                        parent.append(ele);
                    }

                    if (res.fullmatch) {
                        $(parent).siblings('input').attr('data-code', res.fullmatch.corp_id).attr('data-name', res.fullmatch.corp_name);
                        $(parent).siblings('.area-sel-person').find('input').attr("checked", false);
                        if ($(parent).siblings('input').attr("data-code")) {
                            $(parent).siblings('.area-sel-person').find('input').attr("disabled", false);
                        }
                    }

                }, function() {
                    if ($beforeSearchParent.attr('id') === 'inputToolbarBeforeSearch02') {
                        return $.trim($('#inputSearchRelation02').val());
                    } else if ($beforeSearchParent.attr('id') === 'inputToolbarBeforeSearch01') {
                        return $.trim($('#inputSearchRelation01').val());
                    } else {
                        return val;
                    }
                });
            } else {
                $beforeSearchParent.removeClass('active');
            }
        } else {
            $beforeSearchParent.removeClass('active');
        }
    }, 300)
    $(this).off('keydown').on('keydown', keydownFun)
    var inputEle = $(this);
    var listDiv = null;
    var listEle = null;
    $(this).parent().off('mouseover', '.before-search-div').on('mouseover', '.before-search-div', function(e) {
        listDiv = $(inputEle).nextAll('.active');
        listEle = $(listDiv).find('.before-search-div');
        $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
        $(this).addClass('key-down-sel')
        e.preventDefault();
    })

    function keydownFun(e) {
        var cls = '.before-search-div';
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
                var selEle = $(listEle).filter('.key-down-sel');

                if (selEle.length) {
                    $(inputEle).val(selEle.attr('data-name')).attr('data-code', selEle.attr('data-code'));
                } else {
                    $(inputEle).val('').attr('data-code', '');
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
                var selEle = $(listEle).filter('.key-down-sel');
                if (selEle.length) {
                    $(inputEle).val(selEle.attr('data-name')).attr('data-code', selEle.attr('data-code'));
                } else {
                    $(inputEle).val('').attr('data-code', '');
                }
                e.preventDefault();
                break;
            case 13:
                if ($(listDiv).hasClass('active')) {
                    $(listEle).filter('.key-down-sel').trigger('click');
                } else {
                    var companyCode01 = $("#inputSearchRelation01").attr("data-code");
                    var companyCode02 = $("#inputSearchRelation02").attr("data-code");
                    if (companyCode01 && companyCode02) {
                        $('#btnSearchRelation').trigger('click');
                    }
                }
                break;
        }
    }
});
$(document).on("change", "#check-companyname01,#check-companyname02", function() {
    //查关系，选中复选框
    var $input = $("#inputSearchRelation01");
    var $selPerson = $("#selPerson01");
    if (this.id == "check-companyname02") {
        $input = $("#inputSearchRelation02");
        $selPerson = $("#selPerson02");
    }
    var code = $input.attr("data-code");
    if ($(this).prop("checked") && code) {
        $selPerson.show();
        myWfcAjax("getcorprelatedperson", { "companycode": code }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' && res.Data && res.Data.length > 0) {
                var tmpArr = [];
                tmpArr.push('<option data-name="" value="" >' + intl('138445', '请选择人') + '</option>')
                for (var i = 0; i < res.Data.length; i++) {
                    tmpArr.push('<option data-name="' + res.Data[i].name + '" value="' + res.Data[i].id + '">' + res.Data[i].name + '</option>')
                }
                $selPerson.html(tmpArr.join(""));
            }
        }, function() {
            $selPerson.html("<option>暂无数据</option>");
        });
    } else {
        $selPerson.empty().hide();
    }
})
$(document).on("click", "#inputToolbarBeforeSearch01 .before-search-div,#inputToolbarBeforeSearch02 .before-search-div", function() {
    //查关系，选中预搜索
    var $this = $(this);
    var $parent = $(this).parent(".input-toolbar-before-search");
    var $input = $("#inputSearchRelation01");
    var $selPerson = $("#selPerson01");
    var $check = $("#check-companyname01");
    if ($parent.attr("id") == "inputToolbarBeforeSearch02") {
        $input = $("#inputSearchRelation02");
        $selPerson = $("#selPerson02");
        $check = $("#check-companyname02");
    }
    var text = $(this).text();
    var companycode = $(this).attr("data-code");
    $input.val(text).attr("data-code", companycode);
    $parent.removeClass("active");
    $selPerson.hide();
    $check.attr("checked", false);
    if ($input.attr("data-code")) {
        $check.attr("disabled", false);
    }
})
$(document).on("click", ".search-relation .search-list-div", function() {
    //查关系点击历史搜索
    var $input1 = $("#inputToolbarHistorySearch01");
    var $input2 = $("#inputToolbarHistorySearch02");
    var leftCorpName = $(this).attr('data-leftCorpName');
    var leftPersonName = $(this).attr('data-leftPersonName');
    var rightCorpName = $(this).attr('data-rightCorpName');
    var rightPersonName = $(this).attr('data-rightPersonName');
    var leftCorpCode = $(this).attr('data-leftCorpCode');
    var rightCorpCode = $(this).attr('data-rightCorpCode');
    var leftPersonId = $(this).attr('data-leftPersonId');
    var rightPersonId = $(this).attr('data-rightPersonId');
    $('#inputSearchRelation01').val(leftCorpName);
    $('#inputSearchRelation02').val(rightCorpName);
    if ((leftCorpCode || leftPersonId) && (rightCorpCode || rightPersonId)) {
        // 将选中的公司、人员信息带入
        var str = '';
        str = 'lc=' + leftCorpCode;
        if (leftPersonId) {
            str = str + ('&lp=' + leftPersonId);
            str = str + ('&lpn=' + encodeURI($("#selPerson01 option:selected").text()));
            myWfcAjax("getcorprelatedperson", { "companycode": leftCorpCode }, function(data) {
                var res = JSON.parse(data);
                if (res.ErrorCode == '0' && res.Data && res.Data.length > 0) {
                    $('#check-companyname01').attr('checked', 'true')
                    $('#check-companyname01').removeAttr('disabled')
                    $("#selPerson01").show();
                    var tmpArr = [];
                    for (var i = 0; i < res.Data.length; i++) {
                        tmpArr.push('<option data-name="' + res.Data[i].name + '" value="' + res.Data[i].id + '">' + res.Data[i].name + '</option>')
                    }
                    $("#selPerson01").html(tmpArr.join(""));
                    $('#selPerson01').val(leftPersonId);
                }
            }, function() {
                $("#selPerson01").html("<option>暂无数据</option>");
            });
        } else {
            $("#check-companyname01").attr("disabled", false);
            $('#inputSearchRelation01').attr('data-code', leftCorpCode);
        }
        str = str + ('&rc=' + rightCorpCode);
        if (rightPersonId) {
            str = str + ('&rp=' + rightPersonId);
            str = str + ('&rpn=' + encodeURI($("#selPerson02 option:selected").text()));
            myWfcAjax("getcorprelatedperson", { "companycode": rightCorpCode }, function(data) {
                var res = JSON.parse(data);
                if (res.ErrorCode == '0' && res.Data && res.Data.length > 0) {
                    $('#check-companyname02').attr('checked', 'true')
                    $('#check-companyname02').removeAttr('disabled')
                    $("#selPerson02").show();
                    var tmpArr = [];
                    for (var i = 0; i < res.Data.length; i++) {
                        tmpArr.push('<option data-name="' + res.Data[i].name + '" value="' + res.Data[i].id + '">' + res.Data[i].name + '</option>')
                    }
                    $("#selPerson02").html(tmpArr.join(""));
                    $('#selPerson02').val(rightPersonId);
                }
            }, function() {
                $("#selPerson02").html("<option>暂无数据</option>");
            });
        } else {
            $("#check-companyname02").attr("disabled", false);
            $('#inputSearchRelation02').attr('data-code', rightCorpCode);
        }
        str = str + ('&lcn=' + encodeURI($("#inputSearchRelation01").val()));
        str = str + ('&rcn=' + encodeURI($("#inputSearchRelation02").val()));
        $('#inputToolbarHistorySearch01').removeClass('active');
        $('#inputToolbarHistorySearch02').removeClass('active');
        setTimeout(function() {
            window.open("ChartPlatForm.html?" + str);
        }, 10)
    } else {
        layer.msg(intl('176478' /* 请选择关系双方公司或个人 */ ));
    }
    return;
})
$('.search-inputarea').on("click", ".search-list-div", function(event) {
    //查公司查人物查风险点击历史搜索
    var target = event.target;
    var companyname = $(target).text();
    var match = $(target).attr('data-match');
    var code = $(target).attr('data-code');
    if (match - 0 && code) {
        Common.linkCompany('Bu3', code);
        $('.input-toolbar-search-list').removeClass('active');
        return;
    }
    //拼接埋点的url参数,历史搜索
    var pingParam = buryFCode.paramBuryJson('search', $(target));
    var typeStr = $(this).attr("data-type") ? "&type=" + $(this).attr("data-type") : "";
    var url = "SearchHomeList.html?linksource=CEL&keyword=" + companyname + typeStr + pingParam;
    document.location.href = url;
})
$('.search-inputarea').on("click", ".before-search-div", function(event) {
    //查公司查人物查风险点击预搜索
    var target = event.target;
    var type = $(this).attr("data-type");
    if (!$(target).hasClass('before-search-div')) {
        target = target.closest('.before-search-div');
    }
    if (type == "risk") {
        //风险联想
        var keyword = $(target).attr('data-keyword');
        if (keyword) {
            window.open('SearchHomeList.html?type=risk&keyword=' + encodeURI(keyword));
        } else {
            layer.msg("找不到相关人物风险");
        }
        return false;
    }
    if (type == "person") {
        //人物的直接跳人物详情页
        var id = $(target).attr('data-id');
        var name = $(target).attr('data-personame');
        if (id) {
            window.open('Person.html?id=' + id + '&name=' + name);
        } else {
            layer.msg("找不到相关人物详情");
        }
        return false;
    } else {
        var code = $(target).attr('data-code');
        var buryParam = buryFCode.paramBuryJson('preSearch', $(target)); //bury-ping
        Common.linkCompany('Bu3', code, null, null, buryParam);
    }
    return false;
})
$('.search-inputarea').on("click", ".before-search-key", function(event) {
    //废弃了？
    var target = event.target;
    if (!$(target).hasClass('before-search-key')) {
        target = target.closest('.before-search-key');
    }
    var tag = $(target).find('.wi-secondary-color')[1].innerHTML;
    var url = "ShowSearchList.html?companyFeature=" + tag;
    Common.redirectToAdviceSearch(url, tag);
})
$('.input-toolbar-search-list').on("click", "#searchListIcon01", function(event) {
    // 清空企业搜索记录
    //bury
    var activeType = 'delHisSearch';
    var opEntity = 'company';
    var otherParam = { 'opId': 'all' };
    var opType = 'hisSearchDel';
    buryFCode.bury(activeType, opEntity, otherParam, opType);
    Home.clearHistroy("clearhistorykey", {}, "historySearchList");
})
$('.input-toolbar-search-list').on("click", "#searchListIcon02", function(event) {
    // 清空人物搜索记录
    Home.clearHistroy("clearpersonhistorykey", {}, "historyPersonSearchList");
})
$('.input-toolbar-search-list').on("click", "#clearRisk", function(event) {
    // 清空风险搜索记录
    Home.clearHistroy("clearriskhistory", { "IsKeyword": 1 }, "historyRiskSearchList");
})
$('.input-toolbar-search-list').on("click", "#clearNews", function(event) {
    // 清空新闻搜索记录
    Home.clearHistroy("clearnewshistory", { "IsKeyword": 1 }, "historyNewsSearchList");
})
$('.input-toolbar-search-list').on("click", "#searchListIcon03", function(event) {
    // 清空关系搜索记录
    Home.clearHistroy("clearnewshistory", { type: 'relation' }, "relation");
})
$('.input-toolbar-search-list').on("click", "#searchListIcon04", function(event) {
    // 清空关系搜索记录
    Home.clearHistroy("clearmaphistory", { type: 'investpath' }, "investpath");
})

$(document).on("click", ".topic", function() {
    var dataTopic = this.getAttribute('data-topic');
    if (dataTopic && dataTopic === 'topic_industry') {
        window.open('CompanyStatistics.html');
        return false;
    }
    var url = 'NetComper.html?&special_class=' + dataTopic;
    window.open(url);
    return false;
});

var Home = {
    historySearchList: [],
    historyPersonSearchList: [],
    historyNewsSearchList: [],
    historyRiskSearchList: [],
    historyRelationSearchObj: { _historySearchObj: {} },
    historyStockSearchObj: { _historySearchObj: {} },
    init: function() {
        //入口函数
        var type = decodeURI(Common.getUrlSearch("type"));
        if (type && $("#classifySearch>a[data-type='" + type + "']").length > 0) {
            $("#classifySearch>a[data-type='" + type + "']").addClass("sel").siblings().removeClass("sel");
            $("#searchArea div.each-search-area").hide();
            $("#searchArea div.each-search-area[data-type='" + type + "']").show();
        }
        Home.internationalInput();
        Home.homeCommonFunc(); //首页模块推荐
        Home.showModule(type); //显示哪个模块的历史和热门
    },
    showInputEvent: function($this, target) {
        //输入框焦点和输入事件
        var val = $.trim($(target).val());
        var dataArr = [];
        var inputId = $this.attr("id");
        var clearId = "";
        var btnId = "";
        var type = "";
        switch (inputId) {
            case "txt_search":
                {
                    //公司
                    dataArr = Home.historySearchList;
                    btnId = "btn_search";
                    clearId = "searchListIcon01"
                    type = "company";
                    break;
                }
            case "txt_search_person":
                {
                    //人物
                    dataArr = Home.historyPersonSearchList;
                    btnId = "btn_search_person";
                    clearId = "searchListIcon02"
                    type = "person";
                    break;
                }
            case "txt_search_risk":
                {
                    //风险
                    dataArr = Home.historyRiskSearchList;
                    btnId = "btn_search_risk";
                    type = "risk";
                    clearId = "clearRisk";
                    break;
                }
            case "txt_search_news":
                {
                    //新闻
                    dataArr = Home.historyNewsSearchList;
                    btnId = "btn_search_news";
                    type = "news";
                    clearId = "clearNews";
                    break;
                }
            default:
                {
                    dataArr = Home.historySearchList;
                    btnId = "btn_search";
                    clearId = "searchListIcon01"
                    type = "company";
                    break;
                }
        }
        if (val) {
            // 显示预搜索
            val = val.trim();
            var len = Common.getByteLen(val);
            if (len >= 4) {
                $("#searchArea .input-toolbar-search-list").removeClass("active");
                if (inputId == "txt_search") {
                    //企业预搜索
                    Home.preSearchCompany(val);
                } else if (inputId == "txt_search_person") {
                    //人物预搜索
                    Home.preSearchPerson(val);
                } else if (inputId == "txt_search_risk") {
                    //风险预搜索
                    Home.preSearchRisk(val)
                }
            } else {
                $("#searchArea .input-toolbar-before-search").removeClass("active");
            }
        } else {
            $("#searchArea .input-toolbar-before-search").removeClass("active");
            if (!dataArr.length) { return; }
            var searchListParent = $(target).nextAll('.input-toolbar-search-list');
            searchListParent.addClass('active');
            searchListParent.html('');
            searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span data-type=' + inputId + ' class="search-list-icon search-clear-btn" id="' + clearId + '"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');
            for (var i = 0; i < dataArr.length; i++) {
                if (i > 4) {
                    break;
                }
                var ele = document.createElement('div');
                $(ele).addClass('search-list-div')
                $(ele).text(dataArr[i].keyword);
                $(ele).attr('data-name', dataArr[i].keyword);
                $(ele).attr("data-type", type);
                $(ele).attr('data-match', dataArr[i].is_fullmatch == 1 ? 1 : 0);
                $(ele).attr('data-code', dataArr[i].companycode || '');
                $(ele).attr('data-buryModule', 'histroySearch'); //bury历史搜索模块
                $(ele).attr('data-buryfuncType', 'histroySearchCk'); //bury历史搜索模块
                searchListParent.append(ele);
            }
        }
        Home.InputKeyboradEvent($this, btnId)
    },
    InputKeyboradEvent: function($this, btnId) {
        $this.off('keydown').on('keydown', keydownFun)
        var inputEle = $this;
        var listDiv = null;
        var listEle = null;
        $this.parent().off('mouseover', '.search-list-div').on('mouseover', '.search-list-div', function(e) {
            listDiv = $(inputEle).nextAll('.active');
            listEle = $(listDiv).find('.search-list-div');
            $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
            $(this).addClass('key-down-sel')
            e.preventDefault();
        })
        $this.parent().off('mouseover', '.before-search-div').on('mouseover', '.before-search-div', function(e) {
            listDiv = $(inputEle).nextAll('.active');
            listEle = $(listDiv).find('.before-search-div');
            $(listDiv).find('.key-down-sel').removeClass('key-down-sel');
            $(this).addClass('key-down-sel')
            e.preventDefault();
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
                            var type = $(cls).attr("data-type");
                            if (type == "person") {
                                //人物跳转
                                var id = $(cls).attr("data-id");
                                var name = $(cls).attr("data-personame");
                                if (id) {
                                    window.open('Person.html?id=' + id + '&name=' + name);
                                } else {
                                    $('#' + btnId).trigger('click');
                                }
                                return false;
                            }
                            if (type == "risk") {
                                //人物跳转
                                var keyword = $(cls).attr("data-keyword");
                                if (keyword) {
                                    window.open('SearchHomeList.html?type=risk&keyword=' + encodeURI(keyword));
                                }
                                return false;
                            }
                            if (code) {
                                var buryParam = $(listEle).filter('.key-down-sel').attr('data-pingParam') ? $(listEle).filter('.key-down-sel').attr('data-pingParam') : '';
                                Common.linkCompany('Bu3', code, null, null, buryParam); //bury
                            } else {
                                $('#' + btnId).trigger('click');
                            }
                        } else {
                            $('#' + btnId).trigger('click');
                        }
                    }
                    break;
            }
        }
    },
    showModule: function(type) {
        //显示哪个模块的历史和热门
        switch (type) {
            case 'people':
                Home.getHotList("getpersonhotword2", {}, $("#searchPersonKeyword")); //人物热门搜索
                Home.getHistory("getpersonhistorykey", { pcstatus: "0" }, "historyPersonSearchList"); //人物搜索历史
                break;
            case 'news':
                Home.getHotList("getnewshotword", {}, $("#searchNewsKeyword")); //新闻热门搜索
                Home.getHistory("getnewshistory", { "isKeyword": 1 }, "historyNewsSearchList"); //新闻搜索历史
                break;
            case 'risk':
                Home.getHotList("getriskhotword", {}, $("#searchRiskKeyword")); //风险热门搜索
                Home.getHistory("getriskhistory", { "isKeyword": 1 }, "historyRiskSearchList"); //风险搜索历史
                break;
            case 'relation':
                Common.getCommonMapHistory(Home.historyRelationSearchObj, 'getmaphistory', 'relation', { type: 'relation' });
                Common.getCommonMapHistory(Home.historyStockSearchObj, 'getmaphistory', 'investpath', { type: 'investpath' });
                break;
            default:
                Home.searchCompany();
                break;
        }
    },
    getHotList: function(cmd, params, $container) {
        /*拿各个模块的热门搜索数据*/
        myWfcAjax(cmd, params, function(data) {
            var res = JSON.parse(data);
            var storageHtml = [];
            if (res.ErrorCode == 0) {
                var len = res.Data.length;
                for (var i = 0; i < len && i < 5; i++) {
                    var eachData = res.Data[i];
                    storageHtml.push("<span class='search_li'><a href='#' class='wi-link-color' title='" + eachData['hotword'] + "'>" + eachData['hotword'].substring(0, 13) + "</a></span>");
                }
                $container.find(".hot-list").html(storageHtml.join(""));
            }
        });
    },
    getHistory: function(cmd, params, containerList) {
        /*拿各个模块的历史数据*/
        myWfcAjax(cmd, params, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length > 0) {
                Home[containerList] = res.Data;
            }
        });
    },
    internationalInput: function() {
        //国际化输入框
        $('#txt_search').attr('placeholder', intl('138441' /* 请输入公司、人名、品牌、企业特征等关键词 */ ));
        $('#txt_search_person').attr('placeholder', intl('138442' /* 请输入法定代表人、股东或高管的完整姓名 */ ));
        $('#inputSearchRelation01,#inputSearchStock01').attr('placeholder', intl('138343' /* 输入公司名 */ ));
        $('#inputSearchRelation02,#inputSearchStock02').attr('placeholder', intl('138343' /* 输入公司名 */ ));
        $('#txt_search_news').attr('placeholder', intl('222411' /* 请输入新闻事件、公司、人名等关键词 */ ));
        $('#txt_search_risk').attr('placeholder', intl('222410' /* 请输入风险事件、公司、人名等关键词 */ ));
    },
    searchCompany: function() {
        //查公司模块
        Home.getHotList("gethotword2", {}, $("#searchKeyword")); //搜公司热词
        myWfcAjax("gethistorykey", { pcstatus: "0" }, function(data) {
            var res = JSON.parse(data);
            var storageHtml = [];
            var focusHtml = [];
            var listClass = '';
            if (res.ErrorCode == 0 && res.Data && res.Data[0]) {
                var len = res.Data[0]['HotWord'] ? res.Data[0]['HotWord'].length : 0;
                Home.historySearchList = res.Data[0]['HotWord'] ? res.Data[0]['HotWord'] : [];
                for (var i = 0; i < len && i < 5; i++) {
                    var eachData = res.Data[0]['HotWord'][i]['keyword'];
                    var match = res.Data[0]['HotWord'][i]['is_fullmatch'] == 1 ? 1 : 0;
                    var code = res.Data[0]['HotWord'][i]['companycode'] || '';
                    storageHtml.push("<li class='search_li'><a href='#' class='wi-link-color' data-match=' " + match + "' data-code='" + code + "'  title='" + eachData + "'>" + eachData.substring(0, 13) + "</a></li>");
                }
                $("#historyKeyword").find("ul").html(storageHtml.join(""));
            }
            if (res.ErrorCode == 0) {
                var len = res.Data[0]['CompanyName'].length;
                if (len == 0) {
                    focusHtml.push("<div class='no-histry'>暂无最近浏览记录</div>");
                    $("#historyFocusList").find("#FocusHistroy").html(focusHtml);
                } else {
                    for (var i = 0; i < len && i < 10; i++) {
                        listClass = (i + 1) % 2 ? 'history_list' + ' listColor' : 'history_list';
                        var historyData = res.Data[0]['CompanyName'][i];
                        if (historyData['keyword'] == null) {
                            continue;
                        }
                        focusHtml.push("<li class='" + listClass + "'><a href='#' title='" + historyData['keyword'] + "' ccode='" + historyData['companycode'] + "' cid='" + historyData['companyid'] + "'>" + historyData['keyword'] + "</a></li>");
                    }
                    $("#historyFocusList").find("#FocusHistroy").html(focusHtml.join(""));
                }
            }
        });
    },
    homeCommonFunc: function() {
        // 首页模块推荐
        var allFuncDic = {
            '查企业': '<div class="icon-topic-corp" data-ori="查企业">' + intl('225311', '查企业') + '</div>',
            '查人物': '<div class="icon-topic-person" data-ori="查人物">' + intl('138432', '查人物') + '</div>',
            // '查新闻': '<div class="icon-topic-news" data-ori="查新闻">' + intl('222409', '查新闻') + '</div>',
            '查关系': '<div class="icon-topic-relative" data-ori="查关系">' + intl('138484', '查关系') + '</div>',
            '全球企业': '<div class="icon-topic-global" data-ori="全球企业">' + intl('225305', '海外企业') + '</div>',
            '风险': '<div langkey=""  class="icon-topic-quest-risk"  data-ori="风险">' + intl('222404', '查风险') + '</div>',
            '裁判文书': '<div class="icon-topic-judge"  data-ori="裁判文书">' + intl('138731', '裁判文书') + '</div>',
            // '失信人': '<div class="icon-topic-dishonest"  data-ori="失信人">' + intl('151233', '失信人') + '</div>',
            // '被执行人': '<div class="icon-topic-executee"  data-ori="被执行人">' + intl('138592', '被执行人') + '</div>',
            // '法院公告': '<div class="icon-topic-court" data-ori="法院公告">' + intl('138226', '法院公告') + '</div>',
            // '开庭公告': '<div class="icon-topic-opennotice" data-ori="开庭公告">' + intl('138657', '开庭公告') + '</div>',
            // '司法拍卖': '<div class="icon-topic-judicial" data-ori="司法拍卖">' + intl('138359', '司法拍卖') + '</div>',
            // '知识产权' : '<div class="icon-topic-intellectual" data-ori="知识产权">'+intl('120665','知识产权')+'</div>',
            '商标': '<div class="icon-topic-market" data-ori="商标">' + intl('138799', '商标') + '</div>',
            '专利': '<div class="icon-topic-patent" data-ori="专利">' + intl('138749', '专利') + '</div>',
            // '作品著作权' : '<div class="icon-topic-work" data-ori="作品著作权">'+intl('138756','作品著作权')+'</div>',
            // '软件著作权' : '<div class="icon-topic-soft" data-ori="软件著作权">'+intl('138788','软件著作权')+'</div>',
            // '项目品牌': '<div class="icon-topic-brand" data-ori="项目品牌" >' + intl('209003', '项目品牌') + '</div>',
            // '项目': '<div class="icon-topic-project" data-ori="项目">' + intl('209004', '查项目') + '</div>',
            // '品牌': '<div class="icon-topic-make" data-ori="品牌">' + intl('209005', '查品牌') + '</div>',
            // '产品': '<div class="icon-topic-product" data-ori="产品">' + intl('209006', '查产品') + '</div>',
            '批量导出': '<div class="icon-topic-export" data-ori="批量导出">' + intl('225300', '批量导出') + '</div>',
            '批量查询': '<div class="icon-topic-query" data-ori="批量查询">' + intl('141998', '批量查询') + '</div>',
            '高级搜索': '<div class="icon-topic-advanced" data-ori="高级搜索">' + intl('225308', '企业筛选') + '</div>',
            '企业全景': '<div class="icon-topic-overview" data-ori="企业全景">' + intl('225306', '地区产业全景') + '</div>',
            '竞争情报': '<div class="icon-topic-competitive" data-ori="竞争情报" >' + intl('225307', '投资赛道') + '</div>',
            // '图谱平台' : '<div class="icon-topic-platform" data-ori="图谱平台">'+intl('138167','图谱平台')+'</div>',
            '企业风控': '<div  class="icon-topic-riskcontrol buryClick" data-ori="企业风控" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="riskOverview" data-buryModule="homeRecommend" >' + intl('225302', '企业风控') + '</div>',
            // '招聘': '<div class="icon-topic-job" data-ori="招聘">' + intl('205523', '招聘查询') + '</div>',
            '特色企业库': '<div class="icon-topic-featured" data-ori="特色企业库">' + intl('141997', '特色企业库') + '</div>',
            '科创板': '<div class="icon-topic-stboard" data-ori="科创板">' + intl('225313', '科创板') + '</div>',
            '新三板': '<div class="icon-topic-tnb" data-ori="新三板">' + intl('104962', '新三板') + '</div>',
            '上市企业': '<div class="icon-topic-ipo" data-ori="上市企业">' + intl('225303', '上市企业') + '</div>',
            '发债企业': '<div class="icon-topic-debt" data-ori="发债企业">' + intl('225310', '发债企业') + '</div>',
            '新四板': '<div class="icon-topic-fourbroad" data-ori="新四板">' + intl('207791', '新四板') + '</div>',
            'P2P大全': '<div class="icon-topic-p2p" data-ori="P2P大全">' + intl('225301', 'P2P大全') + '</div>',
            // '投资机构': '<div class="icon-topic-invest buryClick" data-ori="投资机构" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="PEVCExpress" data-buryModule="homeRecommend"">' + intl('138727', '投资机构') + '</div>',
            // '500强企业': '<div class="icon-topic-fivehundred buryClick" data-ori="500强企业" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="500Companys" data-buryModule="homeRecommend">' + intl('214862', '500强企业') + '</div>',
            // '公募基金' : '<div class="icon-topic-public buryClick" data-ori="公募基金" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="publicFudn" data-buryModule="homeRecommend">'+intl('89391','公募基金')+'</div>',
            // '私募基金': '<div class="icon-topic-private buryClick" data-ori="私募基金" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="privateFudn" data-buryModule="homeRecommend">' + intl('119142', '私募基金') + '</div>',
            '银行': '<div class="icon-topic-bank" data-ori="银行">' + intl('35063', '银行') + '</div>',
            '保险公司': '<div class="icon-topic-insurance" data-ori="保险公司">' + intl('225304', '保险公司') + '</div>',
            '证券公司': '<div class="icon-topic-stock" data-ori="证券公司">' + intl('225314', '证券公司') + '</div>',
            '基金公司': '<div class="icon-topic-offered" data-ori="基金公司">' + intl('225312', '基金公司') + '</div>',
            '期货公司': '<div class="icon-topic-future" data-ori="期货公司">' + intl('211609', '期货公司') + '</div>',
            '特色内容库': '<div class="icon-topic-featured02" data-ori="特色内容库" >' + intl('207797', '特色内容库') + '</div>',
            '地图查询': '<div langkey="" class="icon-topic-map buryClick" data-ori="地图查询" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="mapQuery" data-buryModule="homeRecommend">' + intl('225309', '万寻地图') + '</div>',
            // '园区大全': '<div class="icon-topic-park buryClick" data-ori="园区大全" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="parkAll" data-buryModule="homeRecommend">' + intl('208892', '园区大全') + '</div>',
            // '融资事件': '<div class="icon-topic-financing buryClick" data-ori="融资事件" data-buryOpType="click" data-buryfuncType="listQy" data-buryEntity="PEVCMoney" data-buryModule="homeRecommend">' + intl('112360', '融资事件') + '</div>',
            '政策法规': '<div class="icon-topic-gov" data-ori="政策法规" >' + intl('69696', '政策法规') + '</div>',
            '超级名单': '<div class="icon-topic-superList" data-ori="超级名单" >' + intl('222402', '超级名单') + '</div>',
            'API': '<div class="icon-topic-api" data-ori="API" >' + 'API' + '</div>',
            '集团系': '<div class="icon-topic-group" data-ori="集团系" >' + intl('148622', '集团系') + '</div>',

            // '查老赖': '<div class="icon-topic-search-dishonesty" data-ori="查老赖" >' + intl('', '查老赖') + '</div>',
            // '反洗钱': '<div class="icon-topic-anti-money" data-ori="反洗钱" >' + intl('', '反洗钱') + '</div>',
        };

        var paramFunc = { PageSize: 200, PageNo: 0, sysType: 'windClient' }
            // myWfcAjax('getcommonfunc', paramFunc, function(data) {
            //     var resData = JSON.parse(data);
            //     if (resData.ErrorCode == "0" && resData.Data && resData.Data.length > 0) {
            //         var funcItem = resData.Data;
            //         var resultArr = [];
            //         for (var fi in funcItem) {
            //             try {
            //                 if (resultArr.length > 7) {
            //                     continue;
            //                 }
            //                 if (funcItem[fi].moduleKey) {
            //                     if (!allFuncDic[funcItem[fi].moduleKey]) {
            //                         continue;
            //                     }
            //                     if ($('.competition-topic').find('div[data-ori="' + funcItem[fi].moduleKey + '"]').length > 0) {
            //                         $('.competition-topic').find('div[data-ori="' + funcItem[fi].moduleKey + '"]').remove();
            //                     }
            //                     resultArr.push(allFuncDic[funcItem[fi].moduleKey]);
            //                 }
            //             } catch (error) {
            //                 continue;
            //             }
            //         }
            //         if (resultArr.length != 0) {
            //             $('.competition-topic').prepend(resultArr.join(''));
            //             if ($('.competition-topic').children().length > 8) {
            //                 $('.competition-topic').children().eq(7).nextAll().remove()
            //             }
            //         }
            //     }
            // });
    },
    preSearchCompany: function(val) {
        //公司预搜索
        Common.getPreSearch(val, function(res) {
            var data = res.corplist || [];
            var count = res.tagCount ? res.tagCount.tagCount : 0;
            var tag = res.tagCount ? res.tagCount.tagName : val;
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
                var highTitle = '';
                var highLitKey = '';
                var highLight = '';
                var corp_name = '';
                var corName = '';
                var ele = document.createElement('div');
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
                beforeSearchParent.append(ele);
            }
        }, function() {

        });
    },
    preSearchPerson: function(val) {
        //人物预搜索
        myWfcAjax("getclassifyperson", { "personname": val, "source": "cel", pageSize: "5" }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' && res.Data && res.Data.search && res.Data.search.length > 0) {
                var searchData = res.Data.search;
                var beforeSearchParent = $('.input-toolbar-before-search');
                if (!searchData.length) {
                    return;
                }
                var tmpArr = [];
                for (var i = 0; i < searchData.length; i++) {
                    if (i > 4) {
                        break;
                    }
                    var corpNameStr = searchData[i].region_cnt_corp_name && searchData[i].region_cnt_corp_name.length > 0 ? searchData[i].region_cnt_corp_name[0] : "";
                    var corpNameStrArr = corpNameStr.split("_");
                    var tmpLen = corpNameStrArr.length;
                    var corpName = tmpLen > 0 ? (corpNameStrArr[tmpLen - 1] + "等 ") : "";
                    var relationNum = searchData[i].relative_ent_cnt ? searchData[i].relative_ent_cnt : "0";
                    relationNum = "<span class='relation-num'>" + relationNum + "</span> 家公司";
                    var person_id = searchData[i].person_id
                    tmpArr.push('<div data-type="person" class="before-search-div" data-id="' + person_id + '" data-personame="' + searchData[i].person_name + '"><p class="search-person-tit">' + searchData[i].person_name + '</p><p class="search-person-tip">' + corpName + relationNum + '</p></div>')
                }
                beforeSearchParent.addClass('active');
                beforeSearchParent.html(tmpArr.join(""));
            }
        }, function(e) {
            console.log(e)
        })
    },
    preSearchRisk: function(val) {
        myWfcAjax("getcompletedword", { "key": val, "type": "risk", pageSize: "5" }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0' && res.Data && res.Data.list && res.Data.list.length > 0) {
                var searchData = res.Data.list;
                var beforeSearchParent = $('.input-toolbar-before-search');
                if (!searchData.length) {
                    return;
                }
                var tmpArr = [];
                for (var i = 0; i < searchData.length; i++) {
                    if (i > 4) {
                        break;
                    }
                    tmpArr.push('<div data-type="risk" data-keyword="' + searchData[i].word + '" class="before-search-div">' + searchData[i].word + '</div>')
                }
                beforeSearchParent.addClass('active');
                beforeSearchParent.html(tmpArr.join(""));
            }
        }, function(e) {
            console.log(e)
        })
    },
    clearHistroy: function(cmd, paramas, dataArr) {
        //清除模块历史记录
        myWfcAjax(cmd, paramas, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0') {
                var searchListParent = $('.input-toolbar-search-list');
                searchListParent.removeClass('active');
                if (dataArr == "investpath" || dataArr == "relation") {
                    Home.historyStockSearchObj._historySearchObj[dataArr] = [];
                } else {
                    Home[dataArr] = [];
                }
                searchListParent.html('');
            }
        }, function(e) {
            console.log(e)
        });
    }
}
var funcList = [Home.init]
Common.internationToolInfo(funcList);