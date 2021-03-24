/*
 * @Author: Cheng Bo 
 * @Date: 2018-04-15 17:44:54 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2021-03-19 10:48:27
 * @Desc: 特色企业库
 */
var maxItem = 5000;
var P2Ppagesize = 10;
var changePage = 　1;
var Records = null;
var isEn = false; //判断是不是英文版，是的话要转换
var chooseArrCity = []; //所选城市
if (Common.getUrlSearch("lang") && Common.getUrlSearch("lang").substring(0, 2) == "en") {
    isEn = true;
}

var SpecialApp = {
    currentpage: 0, //P2P当前页
    _historySearchList: [], // 历史搜索记录     
    serachtimer: null,
    exportParam: null,
    lang: {
        "sProcessing": 'Loading...',
        "sZeroRecords": '暂无数据',
        "paginate": {
            "next": "&gt;",
            "previous": "&lt;"
        }
    },
    basicNum: {},
    selectMenu: null,
    /**
     * 页面初始化
     */
    init: function() {
        $('.toolbar-search').hide();
        setTimeout(function() {
            $('#inputToolbarSearch').attr('placeholder', intl('138441' /* 请输入公司、人名、品牌、企业特征等关键词 */ ));
        }, 100)
    },
    initApp: function() {
        // 默认展示企业特色库
        var page = Common.getUrlSearch('page');
        if (page == 'netcomper') {
            if (wind && wind.langControl) {
                if (wind.langControl.lang !== 'zh') {
                    var styleEle = ['<style>.netcomper-header{width:350px;}</style>'];
                    $(document.head).append(styleEle);
                }
            }
            $('#netComper').show();
        }
        $('#netComper').on('click', 'li', function() {
            var hash = $(this).attr('data-hash');
            if (hash === 'netApp') {
                var url = `http://10.102.17.238:3000/bdg/farenku/?pageId=KPWHENFA&wind.sessionid=${global_wsid}#/generalPage`
                window.open(url);
            } else if (hash === 'building') {
                var url = `http://10.102.17.238:3000/bdg/farenku/?pageId=DKSCMZJK&wind.sessionid=${global_wsid}#/generalPage`
                window.open(url);
            }
            return false;
        });
    }
}