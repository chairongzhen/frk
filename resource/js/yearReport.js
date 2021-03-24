var yearReport = {
    companyCode: null,
    reportYear: null,
    companyName: null,
    eachPageNum: 10,
    lang: {
        "sProcessing": "加载中...",
        "sZeroRecords": "暂无数据",
        "paginate": {
            "next": "&gt;",
            "previous": "&lt;"
        }
    },
    init: function() {
        yearReport.companyCode = Common.getUrlSearch("companyCode");
        yearReport.reportYear = Common.getUrlSearch("year");
        yearReport.companyName = decodeURIComponent(Common.getUrlSearch('companyName'));
        yearReport.getYearReportData();
    },
    getYearReportData: function() {
        if (yearReport.companyCode && yearReport.reportYear) {
            $("#reportYear").html(yearReport.reportYear);
            $("#reportCompanyName").html(yearReport.companyName);
            var parameter = { "companycode": yearReport.companyCode, "year": yearReport.reportYear };
            myWfcAjax("getannualdetail", parameter, function(data) {
                var res = JSON.parse(data)
                if (data && res.ErrorCode == 0 && res.Data) {
                    var basicData = res.Data.baseinfo; //基本信息  
                    var websitesData = res.Data.websites; //网站或网店信息
                    var shareholdersData = res.Data.shareholders; //股东及出资信息
                    var asset = res.Data.asset; //企业资产状况信息
                    var socialsecurity = res.Data.socialsecurity; //社保信息
                    var annual_num = res.Data.annual_num; //条数
                    var selfParam = { "companycode": yearReport.companyCode, "year": yearReport.reportYear };
                    if (annual_num) {
                        var guarantee_num = annual_num.guarantee_num ? "(" + annual_num.guarantee_num + ")" : "(0)";
                        var invet_num = annual_num.invet_num ? "(" + annual_num.invet_num + ")" : "(0)";
                        var shareholder_num = annual_num.shareholder_num ? "(" + annual_num.shareholder_num + ")" : "(0)";
                        var stockchange_num = annual_num.stockchange_num ? "(" + annual_num.stockchange_num + ")" : "(0)";
                        var website_num = annual_num.website_num ? "(" + annual_num.website_num + ")" : "(0)";
                        $("#guarantee_num").html(guarantee_num);
                        $("#invet_num").html(invet_num);
                        $("#shareholder_num").html(shareholder_num);
                        $("#stockchange_num").html(stockchange_num);
                        $("#website_num").html(website_num);
                    }
                    if (basicData) {
                        var creditCode = basicData.credit_code ? basicData.credit_code : "--"; //统一社会信用代码
                        var companyAddr = basicData.address ? basicData.address : "--"; //企业通信地址;
                        var companyMailCode = basicData.post_code ? basicData.post_code : "--"; //邮政编码;
                        var companyTel = basicData.tel ? basicData.tel : "--"; //企业联系电话;
                        var companyEmail = basicData.email_address ? basicData.email_address : "--"; //企业电子邮箱;
                        var numEmploree = basicData.employee_number ? basicData.employee_number : "--"; //从业人数;
                        var numEmploreeWomen = basicData.women_employee_number ? basicData.women_employee_number : "--"; //其中女性从业人数;
                        var statusBusiness = basicData.bus_status ? basicData.bus_status : "--"; //企业经营状态;
                        var statusControl = basicData.holding_situation ? basicData.holding_situation : "--"; //企业控股情况;
                        var isBuy = basicData.is_invested ? basicData.is_invested : "--"; //是否有投资信息或购买其他公司股权;
                        var isWebSite = basicData.has_website ? basicData.has_website : "--"; //是否有网站或网站;
                        var isguarantee = basicData.is_guaranted ? basicData.is_guaranted : "--"; //是否有对外提供担保信息;
                        var isStockAssgin = basicData.has_share_transfer ? basicData.has_share_transfer : "--"; //有限责任公司本年度是否发生股东股权转让    ;
                        var mainScope = basicData.main_business ? basicData.main_business : "--"; //企业主营业务活动;
                        $("#creditCode").html(creditCode);
                        $("#companyName").html(yearReport.companyName ? yearReport.companyName : "--");
                        $("#companyAddr").html(companyAddr);
                        $("#companyMailCode").html(companyMailCode);
                        $("#companyTel").html(companyTel);
                        $("#companyEmail").html(companyEmail);
                        $("#numEmploree").html(numEmploree);
                        $("#numEmploreeWomen").html(numEmploreeWomen);
                        $("#statusBusiness").html(statusBusiness);
                        $("#statusControl").html(statusControl);
                        $("#isBuy").html(isBuy);
                        $("#isWebSite").html(isWebSite);
                        $("#isguarantee").html(isguarantee);
                        $("#isStockAssgin").html(isStockAssgin);
                        $("#mainScope").html(mainScope);
                    }
                    if (asset) {
                        var total_asset = asset.total_asset ? ((asset.total_asset=="企业选择不公示")?asset.total_asset: asset.total_asset+ "万元") : "--"; //资产总额
                        var total_owner_equity = asset.total_owner_equity ?((asset.total_owner_equity =="企业选择不公示")?asset.total_owner_equity:asset.total_owner_equity+ "万元") : "--"; //所有者权益合计;
                        var gross_revenue = asset.gross_revenue ?((asset.gross_revenue =="企业选择不公示")?asset.gross_revenue:asset.gross_revenue+"万元") : "--"; //营业总收入;
                        var total_profit = asset.total_profit ?((asset.total_profit =="企业选择不公示")?asset.total_profit:asset.total_profit+"万元") : "--"; //利润总额;
                        var main_business_income = asset.main_business_income ?((asset.main_business_income =="企业选择不公示")?asset.main_business_income:asset.main_business_income+ "万元") : "--"; //营业总收入中主营业务收入;
                        var net_profit = asset.net_profit ?((asset.net_profit =="企业选择不公示")?asset.net_profit:asset.net_profit+ "万元") : "--"; //净利润;
                        var total_tax_payment = asset.total_tax_payment ?((asset.total_tax_payment =="企业选择不公示")?asset.total_tax_payment:asset.total_tax_payment+ "万元") : "--"; //纳税总额;
                        var total_indebtedness = asset.total_indebtedness ?((asset.total_indebtedness =="企业选择不公示")?asset.total_indebtedness:asset.total_indebtedness+ "万元") : "--"; //负债总额;

                        $("#total_asset").html(total_asset);
                        $("#total_owner_equity").html(total_owner_equity);
                        $("#gross_revenue").html(gross_revenue);
                        $("#total_profit").html(total_profit);
                        $("#main_business_income").html(main_business_income);
                        $("#net_profit").html(net_profit);
                        $("#total_tax_payment").html(total_tax_payment);
                        $("#total_indebtedness").html(total_indebtedness);

                    }
                    if (res.Data.websites && res.Data.websites.length > 0) {
                        var tableSetting = {
                            interface: "getannualwebsit",
                            moduleName: "网站或网店信息",
                            modelNum: res.Data.annual_num.website_num,
                            align: [0, 0, 0, 0],
                            fields: ["NO.", "web_name", "web_type", "web_url"]
                        }
                        var columnDefsSet = [{
                            "targets": 1,
                            "data": 'web_name',
                            "render": function(data, type, full, meta) {
                                return data;
                            }
                        }, {
                            "targets": 2,
                            "data": 'web_type',
                            "render": function(data, type, full, meta) {
                                return data;
                            }
                        }, {
                            "targets": 3,
                            "data": 'web_url',
                            "render": function(data, type, full, meta) {
                                if (data) {
                                    var hrefStr = yearReport.addHrefLink(data)
                                    return '<a target="_blank" class="wi-secondary-color wi-link-color" href="' + hrefStr + '">' + data + '</a>'
                                } else {
                                    return "--"
                                }
                            }
                        }];
                        var eachModuleData = res.Data.websites ? res.Data.websites : null;
                        yearReport.pageSetting_new("#tableWebsite", tableSetting, eachModuleData, columnDefsSet, selfParam);
                    } else {
                        yearReport.moduleHaveNoData("#tbodyWebsite", "暂无网站或网店信息数据");
                    }
                    if (res.Data.shareholders && res.Data.shareholders.length > 0) {
                        var tableSetting = {
                            interface: "getannualshareholder",
                            moduleName: "股东及出资信息",
                            modelNum: res.Data.annual_num.shareholder_num,
                            align: [0, 0, 0, 0],
                            fields: ["NO.", "shareholder_name", "promiseMoneyAmount", "promiseMoneyTime", "promiseMoneyMethod", "realMoneyAmount", "realMoneyTime", "realMoneyMethod"]
                        }
                        var columnDefsSet = [{
                            "targets": 1,
                            "data": 'shareholder_name',
                            "render": function(data, type, full, meta) {
                                return yearReport.addCompanyLink(data, full, "shareholder_id")
                            }
                        }, {
                            "targets": 2,
                            "data": 'promiseMoneyAmount',
                            "render": function(data, type, full, meta) {
                                return Common.formatMoney(data,[2, '&nbsp;']);
                            }
                        }, {
                            "targets": 3,
                            "data": 'promiseMoneyTime',
                            "render": function(data, type, full, meta) {
                                return Common.formatTime(data);
                            }
                        }, {
                            "targets": 5,
                            "data": 'realMoneyAmount',
                            "render": function(data, type, full, meta) {
                                return Common.formatMoney(data,[2, '&nbsp;']);
                            }
                        }, {
                            "targets": 6,
                            "data": 'realMoneyTime',
                            "render": function(data, type, full, meta) {
                                return Common.formatTime(data);
                            }
                        }];
                        var eachModuleData = res.Data.shareholders ? res.Data.shareholders : null;
                        yearReport.pageSetting_new("#tableStock", tableSetting, eachModuleData, columnDefsSet, selfParam);
                    } else {
                        yearReport.moduleHaveNoData("#tbodyStock", "暂无股东及出资信息数据");
                    }
                    if (res.Data.invests && res.Data.invests.length > 0) {
                        var tableSetting = {
                            interface: "getannualinvest",
                            moduleName: "对外投资信息",
                            modelNum: res.Data.annual_num.invet_num,
                            align: [0, 0, 0],
                            fields: ["NO.", "invest_corp_name", "invest_corp_credit_code"]
                        }
                        var columnDefsSet = [{
                            "targets": 1,
                            "data": 'invest_corp_name',
                            "render": function(data, type, full, meta) {
                                return yearReport.addCompanyLink(data, full, "invest_corp_id")
                            }
                        }];
                        var eachModuleData = res.Data.invests ? res.Data.invests : null;
                        yearReport.pageSetting_new("#tableInvest", tableSetting, eachModuleData, columnDefsSet, selfParam);
                    } else {
                        yearReport.moduleHaveNoData("#tbodyInvest", intl('138401' /* "暂无对外投资信息数据" */ ));
                    }
                    if (res.Data.guarantees && res.Data.guarantees.length > 0) {
                        var tableSetting = {
                            interface: "getannualguarantee",
                            moduleName: "对外提供保证担保信息",
                            modelNum: res.Data.annual_num.guarantee_num,
                            align: [0, 0, 0, 0, 0, 0, 0],
                            fields: ["NO.", "creditor", "debtor", "obligatory_right_type", "credit_amount", "debt_maturity", "guaranty_period", "guarantee_mode"]
                        }
                        var columnDefsSet = [{
                            "targets": 1,
                            "data": 'creditor',
                            "render": function(data, type, full, meta) {
                                return yearReport.addCompanyLink(data, full, "creditor_id")
                            }
                        }, {
                            "targets": 2,
                            "data": 'debtor',
                            "render": function(data, type, full, meta) {
                                return yearReport.addCompanyLink(data, full, "debtor_id")
                            }
                        }, {
                            "targets": 4,
                            "data": 'credit_amount',
                            "render": function(data, type, full, meta) {
                                return Common.formatMoney(data);
                            }
                        }];
                        var eachModuleData = res.Data.guarantees ? res.Data.guarantees : null;
                        yearReport.pageSetting_new("#tableGuarantees", tableSetting, eachModuleData, columnDefsSet, selfParam);
                    } else {
                        yearReport.moduleHaveNoData("#tbodyGuarantees", intl('138400' /*暂无对外提供保证担保信息数据*/ ));

                    }
                    if (res.Data.stockchange && res.Data.stockchange.length > 0) {
                        var tableSetting = {
                            interface: "getannualstockchange",
                            moduleName: "股权变更信息",
                            modelNum: res.Data.annual_num.stockchange_num,
                            align: [0, 0, 0, 0, 0],
                            fields: ["NO.", "shareholder", "change_before_rate", "change_after_rate", "change_date"]
                        }
                        var columnDefsSet = [{
                            "targets": 1,
                            "data": 'shareholder',
                            "render": function(data, type, full, meta) {
                                return yearReport.addCompanyLink(data, full, "shareholder_id")
                            }
                        }, {
                            "targets": 2,
                            "data": 'change_before_rate',
                            "render": function(data, type, full, meta) {
                                return data + "%";
                            }
                        }, {
                            "targets": 3,
                            "data": 'change_after_rate',
                            "render": function(data, type, full, meta) {
                                return data + "%";
                            }
                        }, {
                            "targets": 4,
                            "data": 'change_date',
                            "render": function(data, type, full, meta) {
                                return Common.formatTime(data);
                            }
                        }];
                        var eachModuleData = res.Data.stockchange ? res.Data.stockchange : null;
                        yearReport.pageSetting_new("#tableChange", tableSetting, eachModuleData, columnDefsSet, selfParam);
                    } else {
                        yearReport.moduleHaveNoData("#tbodyChange", intl('142483' /*暂无股权变更信息数据*/ ));
                    }
                    if (socialsecurity) {
                        //社保信息
                        var employment_injury_num = socialsecurity.employment_injury_num ? socialsecurity.employment_injury_num + "人" : "--"; //资产总额
                        var endowment_num = socialsecurity.endowment_num ? socialsecurity.endowment_num + "人" : "--"; //所有者权益合计;
                        var maternity_num = socialsecurity.maternity_num ? socialsecurity.maternity_num + "人" : "--"; //营业总收入;
                        var medical_num = socialsecurity.medical_num ? socialsecurity.medical_num + "人" : "--"; //利润总额;
                        var unemployment_num = socialsecurity.unemployment_num ? socialsecurity.unemployment_num + "人" : "--"; //营业总收入中主营业务收入;

                        var endowment_cost_base = socialsecurity.endowment_cost_base ? socialsecurity.endowment_cost_base : "--";
                        var unemployment_cost_base = socialsecurity.unemployment_cost_base ? socialsecurity.unemployment_cost_base : "--";
                        var medical_cost_base = socialsecurity.medical_cost_base ? socialsecurity.medical_cost_base : "--";
                        var maternity_cost_base = socialsecurity.maternity_cost_base ? socialsecurity.maternity_cost_base : "--";

                        var endowment_real_cost_base = socialsecurity.endowment_real_cost_base ? socialsecurity.endowment_real_cost_base : "--";
                        var unemployment_real_cost_base = socialsecurity.unemployment_real_cost_base ? socialsecurity.unemployment_real_cost_base : "--";
                        var medical_real_cost_base = socialsecurity.medical_real_cost_base ? socialsecurity.medical_real_cost_base : "--";
                        var employment_injury_real_cost_base = socialsecurity.employment_injury_real_cost_base ? socialsecurity.employment_injury_real_cost_base : "--";
                        var maternity_real_cost_base = socialsecurity.maternity_real_cost_base ? socialsecurity.maternity_real_cost_base : "--";

                        var endowment_amount_owed = socialsecurity.endowment_amount_owed ? socialsecurity.endowment_amount_owed : "--";
                        var unemployment_amount_owed = socialsecurity.unemployment_amount_owed ? socialsecurity.unemployment_amount_owed : "--";
                        var medical_amount_owed = socialsecurity.medical_amount_owed ? socialsecurity.medical_amount_owed : "--";
                        var employment_injury_amount_owed = socialsecurity.employment_injury_amount_owed ? socialsecurity.employment_injury_amount_owed : "--";
                        var maternity_amount_owed = socialsecurity.maternity_amount_owed ? socialsecurity.maternity_amount_owed : "--";


                        $("#employment_injury_num").html(employment_injury_num);
                        $("#endowment_num").html(endowment_num);
                        $("#maternity_num").html(maternity_num);
                        $("#medical_num").html(medical_num);
                        $("#unemployment_num").html(unemployment_num);

                        $("#endowment_cost_base").html(endowment_cost_base);
                        $("#unemployment_cost_base").html(unemployment_cost_base);
                        $("#medical_cost_base").html(medical_cost_base);
                        $("#maternity_cost_base").html(maternity_cost_base);

                        $("#endowment_real_cost_base").html(endowment_real_cost_base);
                        $("#unemployment_real_cost_base").html(unemployment_real_cost_base);
                        $("#medical_real_cost_base").html(medical_real_cost_base);
                        $("#employment_injury_real_cost_base").html(employment_injury_real_cost_base);
                        $("#maternity_real_cost_base").html(maternity_real_cost_base);

                        $("#endowment_amount_owed").html(endowment_amount_owed);
                        $("#unemployment_amount_owed").html(unemployment_amount_owed);
                        $("#medical_amount_owed").html(medical_amount_owed);
                        $("#employment_injury_amount_owed").html(employment_injury_amount_owed);
                        $("#maternity_amount_owed").html(maternity_amount_owed);
                    }
                }
            })
        }
    },
    addHrefLink: function(data) {
        var reg = /^[http|https]/;
        if (reg.test(data)) {
            return data;
        } else {
            return "http://" + data;
        }
    },
    addCompanyLink: function(companyname, data, idname) {
        if (idname) {
            //对外投资
            var personId = data[idname];
            if (personId.length < 16) {
                return '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="Company.html?companycode=' + personId + '&name=' + companyname + Common.isNoToolbar() + '">' + Common.formatCont(companyname) + '</a>';
            } else {
                return '<a class="underline wi-secondary-color wi-link-color" target="_blank" href="Person.html?id=' + personId + '&name=' + companyname + Common.isNoToolbar() + '">' + Common.formatCont(companyname) + '</a>';
            }
        } else {
            return companyname;
        }
    },
    moduleHaveNoData: function(dom, msg) {
        //一级模块无数据
        var msgStr = msg ? msg : intl('132725' /* "暂无数据" */ );
        $(dom).find("td").html("<div class='no-data-module'><i></i>" + msgStr + "</div>");
    },
    pageSetting_new: function(moduleName, tableSetting, moduleData, columnDefsSet, selfParam, $dom) {
        var hasCount;
        var modelNumIsNum;
        if (/^\d+$/.test(tableSetting.modelNum)) {
            hasCount = tableSetting.modelNum;
            modelNumIsNum = true;
        }

        if (!moduleData || moduleData.length == 0) {
            $(moduleName).empty().html("<tr><td class='dataTables_empty' colspan='" + tableSetting.fields.length + "'>" + intl('132725' /* 暂无数据 */ ) + "</td></tr>")
            return false;
        }
        var pageSet = tableSetting.modelNum > yearReport.eachPageNum ? true : false;

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
        if (moduleData) {
            $(moduleName).DataTable({
                data: moduleData,
                "info": false, //当前显示几页到几页
                "lengthChange": false,
                language: yearReport.lang, //提示信息
                autoWidth: false, //禁用自动调整列宽
                //stripeClasses: ["odd", "even"], //为奇偶行加上样式，兼容不支持CSS伪类的场合
                processing: false, //隐藏加载提示,自行处理
                serverSide: true, //启用服务器端分页
                searching: false, //禁用原生搜索
                orderMulti: false, //启用多列排序
                order: [], //取消默认排序查询,否则复选框一列会出现小箭头
                scrollCollapse: false, //开启滚动条
                ordering: false,
                // paging: false,
                pageLength: yearReport.eachPageNum,
                paging: pageSet,
                showRowNumber: true,
                retrieve: true,
                columnDefs: columnDefsSet,
                columns: columnsArr,
                fnDrawCallback: function() {

                    if (tableSetting.callback) {
                        tableSetting.callback.call(this, tableSetting);
                    }

                    if (arguments[0]._iRecordsTotal <= yearReport.eachPageNum) {
                        $(this).siblings('.dataTables_paginate').hide()
                    }
                },
                ajax: function(data1, callback1, settings1) {
                    if (moduleData) {
                        var returnData = {};
                        returnData.data = moduleData;
                        returnData.draw = data1.draw; //这里直接自行返回了draw计数器,应该由后台返回

                        returnData.recordsTotal = hasCount; //返回数据全部记录
                        returnData.recordsFiltered = hasCount; //后台不实现过滤功能，每次查询均视作全部结果

                        callback1(returnData);

                        arguments[2].ajax = function(data, callback, settings) {
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
                            //if (data["tips"]) {
                            //    tUrl = tUrl + "&tips=" + data["tips"];
                            //    delete data["tips"];
                            //}
                            param.companyid = yearReport.companyId;
                            param.companycode = yearReport.companyCode;
                            if (yearReport.companyCode01) { param.companycode = yearReport.companyCode01; }
                            param.PageNo = (data.start / data.length);
                            param.PageSize = yearReport.eachPageNum ? yearReport.eachPageNum : 10;
                            if (selfParam) {
                                for (item in selfParam) {
                                    param[item] = selfParam[item];
                                }
                            }
                            $.ajax({
                                url: tUrl,
                                type: "POST",
                                cache: false, //禁用缓存
                                data: param, //传入组装的参数
                                dataType: "json",
                                success: function(result) {
                                    if (result.ErrorCode && result.Data) {
                                        //封装返回数据
                                        var returnData = {};
                                        returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                                        returnData.recordsTotal = hasCount || result.Page.Records; //返回数据全部记录
                                        returnData.recordsFiltered = hasCount || result.Page.Records; //后台不实现过滤功能，每次查询均视作全部结果
                                        returnData.data = result.Data; //返回的数据列表
                                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                                        callback(returnData);
                                    } else {
                                        callback({ data: [], recordsTotal: 0, recordsFiltered: 0 });
                                    }
                                },
                                error: function(data) {
                                    console.log("error!");
                                }
                            });
                        }
                        return;
                    }
                },
                preDrawCallback: function(opts) {
                    if (arguments[0].oClasses.sPageButtonActive.indexOf('wi-secondary-bg') < 0) {
                        arguments[0].oClasses.sPageButtonActive = arguments[0].oClasses.sPageButtonActive + ' wi-secondary-bg ';
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
                            $(row).find('td').eq(i).addClass(itemArr[1]);
                        }
                    })
                }
            })
        }
    },
}