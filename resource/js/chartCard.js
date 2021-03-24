/*
 * @Author: Cheng Bo 
 * @Date: 2019-01-23 13:16:27 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2020-02-25 15:11:32
 * @Desc: 
 */

var ChartCard = {
    lang: {
        "sProcessing": "加载中...",
        "sZeroRecords": "暂无数据",
        "paginate": {
            "next": "&gt;",
            "previous": "&lt;"
        }
    },
    companyCode: '',
    companyName: '',
    companyId: '',
    cardTitle: '',
    basicNum: {},
    init: function() {

        var self = this;
        // 父页面携带的参数
        var parentParams = window.parent._childParams;
        self.companyName = parentParams.companyName || '';
        self.companyCode = parentParams.companyCode || '';
        self.companyId = parentParams.companyId || '';
        self._rootCode = parentParams._rootCode || ''; // 父页面code
        self._rootName = parentParams._rootName || ''; // 父页面name
        if (!parentParams.cardTitle) {
            self.cardTitle = self.companyName || '相关信息';
        }
        switch (parentParams.cardType) {
            case 'person':
                $('.card-person').show();
                self.initPersonCard();
                break;
            case 'person_beneficiary':
                $('.card-person').show();
                self.initPersonBeneficiary();
                break;
            case 'company_beneficiary':
                $('.card-company').show();
                self.initCorpBeneficiary();
                break;
            default:
                $('.card-company').show();
                self.initCompanyCard();
                break;
        }
        $(document).on('click', '.underline', ChartCard.linkWithCodeEventHandler);
    },
    initCompanyCard: function() {
        var navSelect = null;
        var contentSelect = null;
        $('#company_name').text(ChartCard.companyName);
        initCompanyNavEvent();
        ChartCard.getCompanyInfo();

        function initCompanyNavEvent() {

            $('.card-company-list').on('click', '.nav-block', function(e) {
                var block = $(e.target).closest('.nav-block');
                var id = $(block).attr('id');
                if ($(block).hasClass('active')) {
                    return false;
                }
                $(navSelect).removeClass('active').find('.menu-title-underline').removeClass('wi-secondary-bg');
                $(block).addClass('active').find('.menu-title-underline').addClass('wi-secondary-bg');
                navSelect = $(block);

                switch (id) {
                    case 'tab_tz':
                        $(contentSelect).hide();
                        contentSelect = '#table_tz_list';
                        if (!$(contentSelect).children().length) {
                            ChartCard.getDirectInvestment();
                        }
                        $(contentSelect).show();
                        break;
                    case 'tab_ry':
                        $(contentSelect).hide();
                        contentSelect = '#table_ry_list';
                        if (!$(contentSelect).children().length) {
                            ChartCard.getMainMemberInfo();
                        }
                        $(contentSelect).show();
                        break;
                    default:
                        $(contentSelect).hide();
                        contentSelect = '#table_gd_list';
                        $(contentSelect).show();
                        break;
                }
            })

            contentSelect = '#table_gd_list';
            navSelect = $('.card-company-list').find('.nav-block').eq(0);
            navSelect.addClass('active').find('.menu-title-underline').addClass('wi-secondary-bg');
        }
    },
    initCorpBeneficiary: function() {
        $('#company_name').text(ChartCard.companyName);
        $('.card-company-list').hide();
        myWfcAjax("getcorpcard", { companycode: ChartCard.companyCode }, function(resData) {
            if (resData) {
                var res = JSON.parse(resData);
                if (res && res.Data) {
                    var unit = res.Data.corp.reg_unit ? $.trim(res.Data.corp.reg_unit) : "";
                    $('#company_legal').text(res.Data.corp.legal_person_name ? res.Data.corp.legal_person_name : '--');
                    if (res.Data.corp.legal_person_id) {
                        $('#company_legal').addClass('underline').attr('data-code', res.Data.corp.legal_person_id).attr('data-name', res.Data.corp.legal_person_name);
                    }
                    $('#company_capital').text(res.Data.corp.reg_capital ? Common.formatMoney(res.Data.corp.reg_capital) + unit : '--');
                    $('#company_date').text(res.Data.corp.issue_date ? Common.formatTime(res.Data.corp.issue_date) : '--');
                    $('#company_name').text(res.Data.corp.corp_name ? res.Data.corp.corp_name : '--').attr('title', res.Data.corp.corp_name ? res.Data.corp.corp_name : '--').attr('data-code', ChartCard.companyCode).attr('data-name', res.Data.corp.corp_name).addClass('underline wi-link-color');
                }
            } else {

            }
        }, function() {

        });
        ChartCard.beneficiaryPath('.card-company');
    },
    initPersonCard: function() {
        var personId = ChartCard.companyCode;
        var personName = ChartCard.companyName;
        $('#person_name').text(personName);
        if (personId) {
            $('#person_name').attr('data-code', personId).attr('data-name', personName).addClass('underline wi-link-color');
        }
        ChartCard.getPersonNum(personId);
    },
    initPersonBeneficiary: function() {
        var personId = ChartCard.companyCode;
        var personName = ChartCard.companyName;
        $('#person_name').text(personName);
        if (personId) {
            $('#person_name').attr('data-code', personId).attr('data-name', personName).addClass('underline wi-link-color');
        }
        ChartCard.getPersonBeneficiary(personId);
    },
    getPersonBeneficiary: function(id) {
        $('.card-person-list').hide();
        myWfcAjax("getpersoncard", { personid: id }, function(resData) {
            if (resData) {
                var res = JSON.parse(resData);
                if (res && res.Data) {
                    var info = res.Data.personInfo.length ? res.Data.personInfo[0] : '';
                    var desc = res.Data.personInfo.length ? res.Data.personInfo[0].person_introduce : [];
                    var tmpStr = '';
                    if (info && res.Data.personInfo[0].image_id) {
                        $('#person_img').attr('src', 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + res.Data.personInfo[0].image_id);
                    } else {
                        $('#person_img').attr('src', '../resource/images/chart/person_na.png');
                    }
                    if (desc.length > 58) {
                        tmpStr = desc.substring(0, 57) + '...';
                        $('.card-person-desc span').text(tmpStr);
                        $('.card-person-desc-detail').show();
                    } else {
                        $('.card-person-desc').text(desc);
                    }
                    if (desc.length) {
                        $('.card-person-desc').show();
                        $('.card-person-desc-detail').on('click', function(e) {
                            if ($(e.target).text() == intl('138786' /*展开*/ )) {
                                $('.card-person-desc span').css({ 'display': 'inline-block', 'margin-bottom': '5px' });
                                $(e.target).text(intl('138877' /*收起*/ ))
                                $('.card-person-desc span').text(desc);
                            } else {
                                $('.card-person-desc span').css('margin-bottom', '0')
                                $('.card-person-desc span').text(tmpStr);
                                $(e.target).text(intl('138786' /*展开*/ ))
                            }
                        })
                    }
                }
            } else {

            }
        }, function() {

        });
        ChartCard.beneficiaryPath('.card-person');
    },
    beneficiaryPath: function(ele) {
        // 股权链
        var tableSetting = {
            interface: "getbeneficiary",
            moduleName: 'tabbeneficiary',
            modelNum: '',
            thWidthRadio: ["100%"],
            thLangKey: ['138518'],
            thName: ['股权链'],
            align: [0],
            fields: ["shareRoute"],
        };
        $(ele).find('.card-beneficiary-path').show();
        var $container = $(ele).find('#table_beneficiary_list');
        $container.empty().html(ChartCard.drawTab(tableSetting, "tabbeneficiary", "tbodybeneficiary", false));

        var columnDefsSet = [{
            "targets": 0,
            "data": 'shareRoute',
            "render": function(data, type, full, meta) {
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    var item = null;
                    var rate = 0;
                    item = data[i];
                    var nameL = item[0]['name'] ? item[0]['name'] : '--';
                    for (var j = 0; j < item.length - 1; j++) { rate = rate ? (rate * item[j].stockShare / 100) : item[j].stockShare; }
                    str += '<span class="td-span-ctrl">' + intl('138431' /* 路径 */ ) + (i + 1) + '（' + intl('138459' /* 占比约 */ ) + Common.formatPercent(rate) + ')</span><br>';
                    var pingParam = '&fromModule=' + buryItemMapping.mappingEntity["showFinalBeneficiary"] + '&fromField=股权连&opId='; //bury
                    if (item[0]['Id']) {
                        var buryParam = pingParam + item[0]['Id']; //bury
                        str += '<span class="td-span-route-left underline wi-secondary-color wi-link-color" data-name="' + nameL + '" data-type="' + item[0]['type'] + '" data-code="' + item[0]['Id'] + '" data-pingParam="' + buryParam + '">' + nameL + '</span>';
                    } else {
                        str += '<span class="td-span-route-left ">' + nameL + '</span>';
                    }
                    for (var j = 0; j < item.length - 1; j++) {
                        var buryParam = pingParam + item[j + 1]['Id']; //bury
                        var nameR = item[j + 1]['name'] ? item[j + 1]['name'] : '--';
                        str += '<span class="td-span-route-right"><b>' + Common.formatPercent(item[j]['stockShare']) + '</b><i></i>' + '<span class="underline wi-secondary-color wi-link-color" data-name="' + nameL + '" data-type="' + item[j + 1]['type'] + '" data-code="' + item[j + 1]['Id'] + '" data-pingParam="' + buryParam + '">' + nameR + '</span></span>';
                    }
                    str += '</br>'
                }
                return str;
            }
        }];

        ChartCard.pageSetting("#tabbeneficiary", tableSetting, columnDefsSet, { companycode: ChartCard._rootCode, companyname: ChartCard._rootName }, null, 0);
    },
    /**
     * 使用code跳转
     */
    linkWithCodeEventHandler: function(e) {
        var target = e.target;
        var code = $(target).attr('data-code');
        var name = $(target).attr('data-name');
        if (code && code.length) {
            if (code.length < 16) {
                var buryParam = $(target).attr('data-pingParam') ? $(target).attr('data-pingParam') : '';
                Common.linkCompany('Bu3', code, null, null, buryParam); //bury
            } 
            // else {
            //     window.open('Person.html?id=' + code + '&name=' + name);
            // }
        }
        return false;
    },
    getCompanyInfo: function() {
        myWfcAjax("getcorpcard", { companycode: ChartCard.companyCode }, function(resData) {
            if (resData) {
                var res = JSON.parse(resData);
                if (res && res.Data) {
                    ChartCard.basicNum.shareholder_num = res.Data.basicNum.shareholder_num - 0 ? res.Data.basicNum.shareholder_num - 0 : 0;
                    ChartCard.basicNum.shareholder_num = ChartCard.basicNum.shareholder_num > 99 ? '99+' : ChartCard.basicNum.shareholder_num;
                    ChartCard.basicNum.foreign_invest_num = res.Data.basicNum.foreign_invest_num - 0 ? res.Data.basicNum.foreign_invest_num - 0 : 0;
                    ChartCard.basicNum.foreign_invest_num = ChartCard.basicNum.foreign_invest_num > 99 ? '99+' : ChartCard.basicNum.foreign_invest_num;
                    ChartCard.basicNum.member_num = res.Data.basicNum.member_num - 0 ? res.Data.basicNum.member_num - 0 : 0;
                    ChartCard.basicNum.member_num = ChartCard.basicNum.member_num > 99 ? '99+' : ChartCard.basicNum.member_num;

                    $('#company_num_gd').text(ChartCard.basicNum.shareholder_num ? '(' + ChartCard.basicNum.shareholder_num + ')' : '');
                    $('#company_num_tz').text(ChartCard.basicNum.foreign_invest_num ? '(' + ChartCard.basicNum.foreign_invest_num + ')' : '');
                    $('#company_num_ry').text(ChartCard.basicNum.member_num ? '(' + ChartCard.basicNum.member_num + ')' : '');

                    var unit = res.Data.corp.reg_unit ? $.trim(res.Data.corp.reg_unit) : "";
                    $('#company_legal').text(res.Data.corp.legal_person_name ? res.Data.corp.legal_person_name : '--');
                    if (res.Data.corp.legal_person_id) {
                        $('#company_legal').addClass('underline').attr('data-code', res.Data.corp.legal_person_id).attr('data-name', res.Data.corp.legal_person_name);
                    }
                    $('#company_capital').text(res.Data.corp.reg_capital ? Common.formatMoney(res.Data.corp.reg_capital) + unit : '--');
                    $('#company_date').text(res.Data.corp.issue_date ? Common.formatTime(res.Data.corp.issue_date) : '--');
                    $('#company_name').text(res.Data.corp.corp_name ? res.Data.corp.corp_name : '--').attr('title', res.Data.corp.corp_name ? res.Data.corp.corp_name : '--').attr('data-code', ChartCard.companyCode).attr('data-name', res.Data.corp.corp_name).addClass('underline wi-link-color');

                    ChartCard.getShareholder();
                }
            } else {
                ChartCard.basicNum.totalNum = 0;
            }
        }, function() {
            ChartCard.basicNum.totalNum = 0;
        });
    },
    getShareholder: function($dom, oIndex) {
        //股东信息
        var tableSetting = {
            interface: "getnewshareholder",
            moduleName: intl('138506' /* 股东信息 */ ),
            modelNum: "shareholder_num",
            thWidthRadio: ["70%", "30%"],
            thName: [intl('138783' /* 股东名称 */ ), intl('138871' /* 持股比例 */ )],
            align: [0, 2],
            fields: ["shareholder_name", "percentage"]
        };
        var $container = $dom ? $dom : $('#table_gd_list');
        $container.empty().html(ChartCard.drawTab(tableSetting, "tabshareholder", "tbodyshareholder", false, $dom));

        var columnDefsSet = [{
                "targets": 0,
                "data": 'shareholder_name',
                "render": function(data, type, full, meta) {
                    var code = full['shareholder_id'];
                    if (data && code) {
                        if (code.length < 16) {
                            return '<a class="underline wi-secondary-color wi-link-color" data-code="' + code + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + code + '&name=' + data + Common.isNoToolbar() + '">' + Common.formatCont(data) + '</a>';
                        } 
                        else {
                            return Common.formatCont(data)
                            // return '<a class="underline wi-secondary-color wi-link-color" data-code="' + code + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + code + '&name=' + data + Common.isNoToolbar() + '">' + Common.formatCont(data) + '</a>';
                        }
                    }
                    return Common.formatCont(data)
                }
            },
            {
                "targets": 1,
                "data": 'percentage',
                "render": function(data, type, full, meta) {
                    return Common.formatPercent(data)
                }
            }
        ];

        ChartCard.pageSetting("#tabshareholder", tableSetting, columnDefsSet, { companycode: ChartCard.companyCode, companyid: ChartCard.companyId }, null, 0);
    },
    getDirectInvestment: function($dom) {
        //直接对外投资
        var tableSetting = {
            interface: "getinvestinfomap",
            moduleName: intl('138724' /* 对外投资 */ ),
            modelNum: "foreign_invest_num",
            thWidthRadio: ["70%", "30%"],
            thName: [intl('138677' /* 企业名称 */ ), intl('138742' /* 出资比例 */ )],
            align: [0, 2],
            fields: ["invest_name", "invest_rate"]
        }
        var $container = $dom ? $dom : $('#table_tz_list');
        $container.empty().html(ChartCard.drawTab(tableSetting, "tabforeigninvest", "tbodyforeigninvest", false, $dom));
        var columnDefsSet = [{
                "targets": 0,
                "data": 'invest_name',
                "render": function(data, type, full, meta) {
                    var code = full['invest_id'];
                    if (data && code) {
                        if (code.length < 16) {
                            return '<a class="underline wi-secondary-color wi-link-color" data-code="' + code + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + code + '&name=' + data + Common.isNoToolbar() + '">' + Common.formatCont(data) + '</a>';
                        } else {
                            return Common.formatCont(data)
                            // return '<a class="underline wi-secondary-color wi-link-color" data-code="' + code + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + code + '&name=' + data + Common.isNoToolbar() + '">' + Common.formatCont(data) + '</a>';
                        }
                    }
                    return Common.formatCont(data)
                }
            },
            {
                "targets": 1,
                "data": 'invest_rate',
                "render": function(data, type, full, meta) {
                    return Common.formatPercent(data)
                }
            }
        ]
        ChartCard.pageSetting("#tabforeigninvest", tableSetting, columnDefsSet, { companycode: ChartCard.companyCode, companyid: ChartCard.companyId }, $dom);
    },
    getMainMemberInfo: function($dom) {
        //主要成员
        var tableSetting = {
            interface: "GetCompanyMainMemberInfo",
            moduleName: intl('138503' /* 主要人员 */ ),
            modelNum: "member_num",
            thWidthRadio: ["60%", "40%"],
            thName: [intl('34979' /* 姓名 */ ), intl('138728' /* 职务 */ )],
            align: [0, 0],
            fields: ["person_name", "person_position"]
        }
        var $container = $dom ? $dom : $('#table_ry_list');
        $container.empty().html(ChartCard.drawTab(tableSetting, "tabCompanyMainMemberInfo", "tbodyCompanyMainMemberInfo", false, $dom));
        var columnDefsSet = [{
            "targets": 0,
            "data": 'person_name',
            "render": function(data, type, full, meta) {
                var code = full['person_id'];
                if (data && code) {
                    if (code.length < 16) {
                        return '<a class="underline wi-secondary-color wi-link-color" data-code="' + code + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + code + '&name=' + data + Common.isNoToolbar() + '">' + Common.formatCont(data) + '</a>';
                    } else {
                        return Common.formatCont(data)
                        // return '<a class="underline wi-secondary-color wi-link-color" data-code="' + code + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + code + '&name=' + data + Common.isNoToolbar() + '">' + Common.formatCont(data) + '</a>';
                    }
                }
                return Common.formatCont(data)
            }
        }];

        ChartCard.pageSetting("#tabCompanyMainMemberInfo", tableSetting, columnDefsSet, { companycode: ChartCard.companyCode, companyid: ChartCard.companyId }, $dom);
    },
    getPersonNum: function(id) {
        myWfcAjax("getpersoncard", { personid: id }, function(resData) {
            if (resData) {
                var res = JSON.parse(resData);
                if (res && res.Data) {
                    ChartCard.basicNum.totalNum = res.Data.personBasicNum.total_num - 0 ? res.Data.personBasicNum.total_num - 0 : 0;
                    var info = res.Data.personInfo.length ? res.Data.personInfo[0] : '';
                    var desc = res.Data.personInfo.length ? res.Data.personInfo[0].person_introduce : [];
                    var tmpStr = '';
                    // info && $('#person_name').text(res.Data.personInfo[0].person_name).attr('data-code', id).attr('data-name', res.Data.personInfo[0].person_name).addClass('underline wi-link-color');
                    if (info && res.Data.personInfo[0].image_id) {
                        $('#person_img').attr('src', 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + res.Data.personInfo[0].image_id);
                    } else {
                        $('#person_img').attr('src', '../resource/images/chart/person_na.png');
                    }
                    if (desc.length > 58) {
                        tmpStr = desc.substring(0, 57) + '...';
                        $('.card-person-desc span').text(tmpStr);
                        $('.card-person-desc-detail').show();
                    } else {
                        $('.card-person-desc').text(desc);
                    }
                    if (desc.length) {
                        $('.card-person-desc').show();
                        $('.card-person-desc-detail').on('click', function(e) {
                            if ($(e.target).text() == intl('138786' /*展开*/ )) {
                                $('.card-person-desc span').css({ 'display': 'inline-block', 'margin-bottom': '5px' });
                                $(e.target).text(intl('138877' /*收起*/ ))
                                $('.card-person-desc span').text(desc);
                            } else {
                                $('.card-person-desc span').css('margin-bottom', '0')
                                $('.card-person-desc span').text(tmpStr);
                                $(e.target).text(intl('138786' /*展开*/ ))
                            }
                        })
                    }

                    ChartCard.getAllcompany();
                }
            } else {
                ChartCard.basicNum.totalNum = 0;
            }
        }, function() {
            ChartCard.basicNum.totalNum = 0;
        });
    },
    // 关联企业
    getAllcompany: function($dom) {
        var tableSetting = {
            interface: 'personallcompany',
            moduleName: intl('138661' /* 关联企业 */ ),
            recordKey: 'totalNum',
            thWidthRadio: ['75%', '25%'],
            thName: [intl('138677' /* 企业名称 */ ), intl('138496' /* 角色 */ )],
            align: [0, 0],
            fields: ['CorpName', 'Role'],
        }
        var $container = $dom ? $dom : $('#table_person_list');
        $container.empty().html(ChartCard.drawTab(tableSetting, "tablePersonList", "tbodyPersonList", false, $dom));
        var columnDefsSet = [{
                "targets": 0,
                "data": 'CorpName',
                "render": function(data, type, full, meta) {
                    return Common.addCompanyLink(data, full)
                }
            },
            {
                "targets": 1,
                "data": 'Role',
                "render": function(data, type, full, meta) {
                    if (data && data.length) {
                        return data.join(', ');
                    } else {
                        return '--';
                    }
                }
            }
        ]
        ChartCard.pageSetting("#tablePersonList", tableSetting, columnDefsSet, { characterid: ChartCard.companyCode, personName: ChartCard.companyName }, $dom);
    },
    drawTab: function(tableSetting, tableId, tbodyId, noloading, hasMore, oIndex) {
        //画表头
        var tableHtmlArr = [];

        // var numStr = '<span class="fl modle-num">(0)</span>'
        // tableHtmlArr.push('<div class="widget-model"><div class="widget-header"><span class="fl">' + tableSetting.moduleName + '</span>' + numStr + '</div>');

        var tableId = tableId ? tableId : "tabCompany";
        tableHtmlArr.push('<div class="table-container"><table id="' + tableId + '" class="table-company"><thead><tr>');
        var len = tableSetting.thWidthRadio.length;
        for (var i = 0; i < len; i++) {
            var alignStr = "left";
            var itemArr = String(tableSetting.align[i]).split("|")
            var langkeyStr = '';
            if (itemArr[0] == 1) {
                alignStr = "center";
            } else if (itemArr[0] == 2) {
                alignStr = "right";
            } else if (itemArr[0] == 0) {
                alignStr = "left";
            }
            var classStr = "";
            if (itemArr[1]) {
                classStr = itemArr[1]
            }
            if (tableSetting.thLangKey) {
                langkeyStr = ' langkey="' + tableSetting.thLangKey[i] + '" ';
            }
            tableHtmlArr.push('<th align="' + alignStr + '" class="' + classStr + '" width="' + tableSetting.thWidthRadio[i] + '"' + langkeyStr + '>' + tableSetting.thName[i] + '</th>')
        }
        var tbodyId = tbodyId ? tbodyId : "tabContent";
        var loadingStr = noloading ? "" : '<div class="tab-loading"><span class="loading-text-style">加载中...</span></div>';
        tableHtmlArr.push('</tr></thead><tbody id="' + tbodyId + '"><tr><td colspan="' + len + '" class="loading-td">' + loadingStr + '</td></tr></tbody></table><div class="M-box"></div></div></div>');
        return tableHtmlArr.join("");
    },
    pageSetting: function(moduleName, tableSetting, columnDefsSet, selfParam, $dom, oIndex) {
        var columnsArr = [];
        for (var i = 0; i < tableSetting.fields.length; i++) {
            var tmp = {};
            if (tableSetting.fields[i] == "NO.") {
                tmp = {
                    "data": null,
                    "render": function(data, type, full, meta) {
                        var startIndex = meta.settings._iDisplayStart;
                        return startIndex + meta.row + 1;
                    }
                }
            } else {
                tmp = { "data": tableSetting.fields[i].split("|")[0] }
            }
            columnsArr.push(tmp);
        };

        $(moduleName).DataTable({
            "info": false, //当前显示几页到几页
            "lengthChange": false,
            language: ChartCard.lang, //提示信息
            autoWidth: false, //禁用自动调整列宽            
            processing: false, //隐藏加载提示,自行处理
            serverSide: true, //启用服务器端分页
            searching: false, //禁用原生搜索
            orderMulti: false, //启用多列排序
            order: [], //取消默认排序查询,否则复选框一列会出现小箭头
            scrollCollapse: false, //开启滚动条
            pageLength: 5, //首次加载的数据条数
            ordering: false,
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
                if (!opts._iRecordsTotal) {
                    arguments[0].aanFeatures['p'][0].setAttribute('style', 'display:none');
                }
                if (opts._iRecordsTotal <= 5) {
                    $(this).siblings('.dataTables_paginate').hide()
                }
            },
            createdRow: function(row, data, dataIndex) {
                //对齐的设置
                $.each(tableSetting.align, function(i, item) {
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
                        $(row).find('td').addClass(itemArr[1]);
                    }
                })
            },
            ajax: function(data, callback, settings) {
                //封装请求参数
                var param = {};
                var regexPage = /http:\/\/[^/]+\/[^/]+\/([\S]+)\.html/;
                var page = "";
                var route = "";
                if (location.href.indexOf('#') != -1) {
                    route = location.href.split('#')[1];
                }
                if (location.href.match(regexPage)) {
                    page = location.href.match(regexPage)[1];
                }
                var tUrl = "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=" + tableSetting.interface + "&s=" + Math.random();
                if (!global_isRelease) {
                    tUrl = global_site + "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=" + tableSetting.interface + "&s=" + Math.random() + "&wind.sessionid=" + global_wsid;
                }
                tUrl = tUrl + "&page=" + page + "&route=" + route;
                param.PageNo = (data.start / data.length);
                param.PageSize = 5;
                if (selfParam) {
                    for (item in selfParam) {
                        param[item] = selfParam[item];
                    }
                }
                $.ajax({
                    url: tUrl,
                    type: "GET",
                    cache: false, //禁用缓存
                    data: param, //传入组装的参数
                    dataType: "json",
                    success: function(result) {
                        if (result.ErrorCode == '0' && result.Data) {
                            var resData = result.Data;
                            var returnData = {};
                            returnData.data = resData;
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回

                            // 总数以num中为准
                            if (tableSetting.recordKey && ChartCard.basicNum && ChartCard.basicNum[tableSetting.recordKey]) {
                                returnData.recordsTotal = ChartCard.basicNum[tableSetting.recordKey]; //返回数据全部记录
                                returnData.recordsFiltered = ChartCard.basicNum[tableSetting.recordKey]; //后台不实现过滤功能，每次查询均视作全部结果
                                $(moduleName).parents(".widget-model").find(".modle-num").text('(' + (ChartCard.basicNum[tableSetting.recordKey] - 0 || 0) + ')');
                            } else {
                                returnData.recordsTotal = result.Page.Records; //返回数据全部记录
                                returnData.recordsFiltered = result.Page.Records; //后台不实现过滤功能，每次查询均视作全部结果
                                // $(moduleName).parents(".widget-model").find(".modle-num").text('(' + (result.Page.Records - 0 || 0) + ')');
                            }

                            if (moduleName === '#tabshareholder') {
                                returnData.data = result.Data.ShareHolder;
                            }

                            if (moduleName === '#tabbeneficiary') {
                                var tmpdata = [];
                                for (var i = 0; i < result.Data.length; i++) {
                                    var t = result.Data[i];
                                    if (t.beneficiaryId == ChartCard.companyCode) {
                                        tmpdata.push(t);
                                        break;
                                    }
                                }
                                returnData.data = tmpdata;
                            }

                            callback(returnData);

                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            // if (moduleName === '#tabHZHB') {
                            //     tableSetting.callback && tableSetting.callback(result);
                            // }

                        } else {
                            callback({ data: [] });
                        }
                    },
                    error: function(data) {
                        callback({ data: [] });
                    }
                });
            },
        });
    }
}
    /* 国际化 ,所有自己的代码都在写在这个回调函数后*/
    if (window.wind && wind.langControl) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
            wind.langControl.lang = 'zh';
            wind.langControl.locale = 'zh';
            wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
                Common.international();
                ChartCard.init();
            }, function() {
                console.log('error');
            });
        } else {
            wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
                Common.international();
                ChartCard.init();
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

