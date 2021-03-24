var maxItem = 5000;
(function(window, $) {
    $(document).on("click", ".singleDownload", function() {
        //点击进行单项下载，导出单项数据
        var downCode = decodeURI(Common.getUrlSearch("id"));
        var downType = $(this).attr('data-type');
        var parameter = { "personId": downCode, "type": downType }
        var downLoadName = $("#navPersonName").text() || decodeURIComponent(Common.getUrlSearch('name'));
        var downTypeName = $(this).attr('data-name');
        var downLoadFile = downLoadName + '-' + downTypeName;
        myWfcAjax("createpersondoctmpfile", parameter, function(data) { //新单项下载
            var res = JSON.parse(data);
            if (res && res.ErrorCode == '-9') {
                Common.PupupNoAccess(intl('224267' /* 您本年度导出企业单项数据的额度已用完。 */ ), intl('224262' /* 本年度额度已用完 */ ));
                return;
            }
            if (res && res.ErrorCode == '-10') {
                var contSet = {
                    title: downTypeName,
                    dec: [intl('224214' /*购买VIP，每年可导出5000家企业的数据*/ ), intl('224215' /*购买SVIP，每年可导出10000家企业的数据*/ ), intl('224216' /*购买VIP/SVIP企业套餐，每年可导出5000/10000家企业的数据*/ )]
                };
                Common.Popup([1, true], true, contSet);
                return;
            }
            if (res && res.ErrorCode == 0 && res.Data) {
                var isAuthorized = res.Data.isAuthorized　 ? 　res.Data.isAuthorized　 : false;
                var isAllowed = res.Data.isAllowed ? res.Data.isAllowed : false;
                var isSucceed = res.Data.isSucceed ? res.Data.isSucceed : false;
                var tmpFileName = res.Data.tmpFileName;
                var total = res.Data.total ? res.Data.total : 0;
                if (!isAuthorized) {
                    var contSet = {
                        title: downTypeName,
                        dec: [intl('224214' /*购买VIP，每年可导出5000家企业的数据*/ ), intl('224215' /*购买SVIP，每年可导出10000家企业的数据*/ ), intl('224216' /*购买VIP/SVIP企业套餐，每年可导出5000/10000家企业的数据*/ )]
                    };
                    Common.Popup([1, true], true, contSet);
                    return;
                } else if (!isAllowed) {
                    Common.PupupNoAccess(intl('224267' /* 您本年度导出企业单项数据的额度已用完。 */ ), intl('224262' /* 本年度额度已用完 */ ));
                    return;
                } else {
                    var downLoadUrl = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?tmpFile=' + tmpFileName + '&filename=' + downLoadFile + '-共' + total + '条';
                    window.location = downLoadUrl;
                }
            } else {
                layer.msg(intl('204684' /*导出出错*/ ));
            }
        }, function() {
            layer.msg(intl('204684' /*导出出错*/ ))
        });
    })
    $(document).on("click", "#downloadPersonReport", function() {
        if (!is_terminal) {
            if (window.layer) {
                layer.msg("该功能需登录Wind金融终端。");
            }
            return false;
        }
        //下载报告
        var reportCon = '<div id="reportMain"><div style="display:none;" id="acceptMail"><label for="accpetMailInput">接收邮箱(选填)</label><input type="text" class="accpet-mail-input" id="accpetMailInput" placeholder="请输入接收报告的邮箱地址" /></div><span class="accpet-mail-err" id="accpetMailErr">邮箱格式错误</span><div class="each-report" id="personReport"><div class="each-report-pic"></div><div class="tips-report"><h3>董高监对外投资与任职报告</h3><p>深度挖掘企业法人、股东、高管对外投资及任职信息</p></div><div class="report-download-area"><a href="#"  id="downPersonReportTab" class="report-download-btn" data-type="">导出报告</a></div></div></div>';
        layer.open({
            title: ['导出报告', 'font-size:16px;background-color: #F4F4F4;'],
            skin: 'feedback-body',
            type: 1,
            // area: ['480px', '280px'], //宽高   ，因为屏蔽了邮箱
            area: ['480px', '215px'], //宽高      
            content: reportCon,
            scrollbar: false
        })
        return false;
    })
    $(document).on("focus", "#accpetMailInput", function() {
        $(this).addClass('focus-input');
        $('#accpetMailInput').removeClass('input-err');
        $('#accpetMailErr').css('display', 'none');
    })
    $(document).on("blur", "#accpetMailInput", function() {
        $(this).removeClass('focus-input');
    })
    $(document).on('click', '.report-download-btn', function() {

        if (!is_terminal) {
            if (window.layer) {
                layer.msg("该功能需登录Wind金融终端。");
            }
            return false;
        }

        var downType = 'senior';
        var entityName = decodeURI(getUrlSearch('name'));
        var entityId = decodeURI(getUrlSearch('id'));
        var downTypeName = '董监高对外投资与任职报告';

        //bury
        var personVal = Common.getUrlSearch("name");
        var personId = Common.getUrlSearch("id");
        var activeType = 'reportDownload';
        var opEntity = downTypeName;
        var otherParam = { 'opId': personId };
        var opType = 'reportEx';
        buryFCode.bury(activeType, opEntity, otherParam, opType);

        var emailVal = $.trim($("#accpetMailInput").val());
        var emailValLen = emailVal.length;
        var emailPost = emailValLen > 0 ? emailVal : null;
        if (emailValLen > 0 && !Common.isEmail(emailVal)) {
            $("#accpetMailInput").addClass("input-err");
            $("#accpetMailErr").css('display', 'block');
            return false;
        }
        var downUrl = downUrl = 'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/PersonRP.html?id=' + entityId + '&from=openBu3&lang=cn&name=' + entityName;
        var params = {
            url: downUrl,
            email: emailPost,
            entityName: entityName,
            entityId: entityId,
            type: downType,
        }
        myWfcAjax("createpdfdoctask", params, function(res) {
            var data = JSON.parse(res);
            if (data.ErrorCode == "0") {
                $('.layui-layer-close').click(); //关闭弹窗
                window.open("../customer/index.html#mylist");
            } else if (data.ErrorCode == "-10") { //无权限
                var contSet = {
                    title: '董高监对外投资与任职报告',
                    dec: [intl('224220' /*购买VIP，每年可导出5000个人物的董监高投资任职报告*/ ), intl('224223' /*购买SVIP，每年可导出10000个人物的董监高投资任职报告*/ ), intl('224226' /*购买VIP/SVIP企业套餐，每年可导出5000/10000个人物的董监高投资任职报告*/ )],
                    rcss: 'person-vip-model'
                };
                Common.Popup([1, true], true, contSet);
                return;
            } else if (data.ErrorCode == '-9') { //超限                
                Common.PupupNoAccess(intl('224269' /*您本年度导出人物报告的额度已用完。*/ ), intl('224262' /*本年度额度已用完*/ ));
                return;
            } else {
                layer.msg(intl('204684' /*导出出错*/ ))
            }
        }, function() {
            layer.msg(intl('204684' /*导出出错*/ ))
        });

        return false;
    })
    $(document).on("click", ".tab-style a:not('.nojump')", function() {
        var fn = $(this).attr("data-fn");
        var $container = $(this).parents(".each-module").length > 0 ? $("#" + fn) : "";
        Person[fn]($container, $(this).attr("data-index"));
    })
    var Person = {
        isVip: 0,
        userInfo: {
            id: decodeURI(getUrlSearch('id')),
            name: decodeURI(getUrlSearch('name')), // '雷军'
            imgId: null
                // name: '雷军',
        },
        vipTips: '<span class="export-vip-tips" title="您正在使用付费高级功能"></span>',
        personNum: {},
        personSearch: getUrlSearch('personSearch'),
        personSelect: null,
        personDetail: '',
        _historySearchList: [], // 历史搜索记录
        serachtimer: null,
        chartDataSet: null,
        chartPathSet: null,
        _corpListParams: {},
        basicNum: {},
        defer: [0, 0, 0, 0, 0, 0],
        lang: {
            "sProcessing": '数据加载中',
            "sZeroRecords": '暂无数据',
            "paginate": {
                "next": "&gt;",
                "previous": "&lt;"
            }
        },
        tabs: {
            'linkYSGX': {
                fun: 'getRelation'
            },
            'linkQBQY': {
                fun: 'getallcompany'
            },
            'linkDRFR': {
                fun: 'getpersonallegalrep'
            },
            'linkDWTZ': {
                fun: 'getpersonalshareholder'
            },
            'linkDWRZ': {
                fun: 'getpersonalposition'
            },
            'linkSJKZ': {
                fun: 'getrealctrl'
            },
            'linkHZHB': {
                fun: 'getcorpfriend'
            },
            'linkGQCT': {
                fun: 'getGQCTMap'
            },
        },
        tabsHash: {
            'person_ysgx': {
                idx: 0,
                fun: 'getRelation'
            },
            'person_gqct': {
                idx: 1,
                fun: 'getGQCTMap'
            },
            'person_qbqy': {
                idx: 2,
                fun: 'getallcompany'
            },
            'person_drfr': {
                idx: 3,
                fun: 'getpersonallegalrep'
            },
            'person_dwtz': {
                idx: 4,
                fun: 'getpersonalshareholder'
            },
            'person_dwrz': {
                idx: 5,
                fun: 'getpersonalposition'
            },
            'person_sjkz': {
                idx: 6,
                fun: 'getrealctrl'
            },
            'person_hzhb': {
                idx: 7,
                fun: 'getcorpfriend'
            },
        },
        /**
         * 显示toolbar
         */
        showToolbar: function() {
            $('.toolbar').css('display', 'block');
        },
        init: function() {
            $('#inputToolbarSearch').attr('placeholder', intl('138441' /* 请输入公司、人名、品牌、企业特征等关键词 */ ));
            if (wind && wind.langControl) {
                if (wind.langControl.lang !== 'zh') {
                    var styleEle = '<style>.nav-block{margin-left:0;padding:0 12px;}.content-toolbar ul>li{height:auto;padding-left:5px;padding-right:5px;word-break:break-word;}</style>';
                    $(document.head).append(styleEle);
                }
            }

            $(document).find('head title').text(Person.userInfo.name || '个人详情');
            // 获取历史搜索记录
            setTimeout(function() {
                self.getRelation({ code: self.userInfo.id });
            }, 600)
            Common.getCommonHistoryKey(Person);
            var self = this;
            var idx = 0;
            $('#navPersonName').text(self.userInfo.name);
            if (!Common.isNoToolbar()) {
                self.showToolbar();
            }
            self.getpersoninfo();
            Common.getIsVip(function(info) {
                if (info.isVip) {
                    Person.isVip = 1;
                }else{

                    Person.isVip = 0;
                }
                
                self.personSearch = self.personSearch ? self.personSearch : '';
                if (self.personSearch && self.personSearch in self.tabsHash) {
                    self[self.tabsHash[self.personSearch].fun]();
                    idx = self.tabsHash[self.personSearch].idx;
                }
                self.personSelect = $('.nav-tabs').find('.nav-block').eq(idx);
                self.getPersonNum();
            });
            

            // 菜单切换
            $('.nav-tabs').on('click', '.nav-block', function(e) {
                var target = $(e.target).closest(".nav-block");
                if (target.hasClass('nav-disabled')) {
                    return;
                }
                Person.personSelect = target;
            })

            // 搜索
            $('.input-toolbar-button').click(function(event) {
                //搜索按钮
                var keyword = $('.input-toolbar-search').val();
                if (keyword && keyword.trim()) {
                    // window.open("SearchHomeList.html?keyword=" + keyword);
                    location.href = "SearchHomeList.html?keyword=" + keyword;
                }
            });
            // 回车事件监听
            $('.input-toolbar-search').placeholder().keydown(function(event) {
                var keyword = $('.input-toolbar-search').val();
                //搜索框placehoder及回车后执行搜索事件
                switch (event.keyCode) {
                    case 13:
                        if (keyword && keyword.trim()) {
                            // window.open("SearchHomeList.html?keyword=" + keyword);
                            location.href = "SearchHomeList.html?keyword=" + keyword;
                        }
                        return false;
                        break;
                }
            });

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
        },
        getPersonNum: function(call) {
            //获取各个模块的数量
            var self = this;
            var parameter = { "id": self.userInfo.id };
            $('#load_data').show();
            var request = myWfcAjax("getpersonbasicnum", parameter, function(data) {
                if (data) {
                    var res = JSON.parse(data);
                    if (res && res.Data) {
                        self.personNum = {
                            memberNum: res.Data.foreign_job_num ? res.Data.foreign_job_num : 0, //在外任职数
                            shareholderNum: res.Data.foreign_invest_num ? res.Data.foreign_invest_num : 0, //对外投资数
                            legalRepNum: res.Data.artificial_person_num ? res.Data.artificial_person_num : 0, //法定代表人
                            totalNum: res.Data.total_num ? res.Data.total_num : 0, //全部企业
                            ctrlNum: res.Data.act_control_num ? res.Data.act_control_num : 0, //实际控制
                            personDebetorNum: res.Data.person_debetor_num ? res.Data.person_debetor_num : 0, //被执行人
                            personPawneeNum: res.Data.person_pawnee_num ? res.Data.person_pawnee_num : 0, //质权人
                            personPledgorNum: res.Data.person_pledgor_num ? res.Data.person_pledgor_num : 0, //出质人
                            person_stock_pledgees_num: res.Data.person_stock_pledgees_num ? res.Data.person_stock_pledgees_num : 0, //出质人
                            person_stock_pledgers_num: res.Data.person_stock_pledgers_num ? res.Data.person_stock_pledgers_num : 0, //质权人
                            person_judicail_assist_num: res.Data.person_judicail_assist_num ? res.Data.person_judicail_assist_num : 0, //股权冻结
                            person_final_case_list_num: res.Data.person_final_case_list_num ? res.Data.person_final_case_list_num : 0, //终本案件
                            consumption_num: res.Data.consumption_num ? res.Data.consumption_num : 0, //限制高消费
                            promise_num: res.Data.promise_num ? res.Data.promise_num : 0, //失信信息
                            hzhbNum: res.Data.co_worker_num || 0, // 合作伙伴
                            hisLegalRepNum: res.Data.his_artificial_person_num ? res.Data.his_artificial_person_num : 0, //历史法定代表人
                            hisShareholderNum: res.Data.his_foreign_invest_num ? res.Data.his_foreign_invest_num : 0, //历史对外投资
                            hisMemberNum: res.Data.his_foreign_job_num ? res.Data.his_foreign_job_num : 0, //历史在外任职
                            hisPersonDebetorNum: res.Data.his_person_debetor_num ? res.Data.his_person_debetor_num : 0, //历史被执行人
                            hisPromiseNum: res.Data.his_promise_num ? res.Data.his_promise_num : 0, //历史失信信息
                            hisConsumptionNum: res.Data.his_consumption_num ? res.Data.his_consumption_num : 0, //历史限制高消费
                            hisPersonPledgorNum: res.Data.his_person_pledgor_num ? res.Data.his_person_pledgor_num : 0, //历史股权出质-出质人
                            hisPersonPawneeNum: res.Data.his_person_pawnee_num ? res.Data.his_person_pawnee_num : 0, //历史股权出质-质权人
                            hisPersonJudicailAssistNum: res.Data.his_person_judicail_assist_num ? res.Data.his_person_judicail_assist_num : 0, //历史股权冻结

                            person_securities_dishonest_num: res.Data.person_securities_dishonest_num ? res.Data.person_securities_dishonest_num : 0, //证券市场失信
                            person_edu_background_num: res.Data.person_edu_background_num ? res.Data.person_edu_background_num : 0, //教育背景
                            person_work_experience_num: res.Data.person_work_experience_num ? res.Data.person_work_experience_num : 0, //工作履历
                            person_award_num: res.Data.person_award_num ? res.Data.person_award_num : 0, //获奖信息
                        };
                        self.personNum.personPawn = parseInt(self.personNum.personPawneeNum) + parseInt(self.personNum.personPledgorNum);
                        self.personNum.person_stockPawn = parseInt(self.personNum.person_stock_pledgees_num) + parseInt(self.personNum.person_stock_pledgers_num);
                        self.personNum.hisPersonPawn = parseInt(self.personNum.hisPersonPawneeNum) + parseInt(self.personNum.hisPersonPledgorNum);
                        $('#countQBQY').text(' ' + (self.personNum.totalNum - 0 || 0));
                        $('#countDRFR').text(' ' + (self.personNum.legalRepNum - 0 || 0));
                        $('#countDWTZ').text(' ' + (self.personNum.shareholderNum - 0 || 0));
                        $('#countDWRZ').text(' ' + (self.personNum.memberNum - 0 || 0));
                        $('#countSJKZ').text(' ' + (self.personNum.ctrlNum - 0 || 0));
                        $('#countBZXR').text(' ' + (self.personNum.personDebetorNum - 0 || 0));
                        $('#countXXXX').text(' ' + (self.personNum.promise_num - 0 || 0));
                        $('#countXZGXF').text(' ' + (self.personNum.consumption_num - 0 || 0));
                        $('#countGQCZ').text(' ' + (self.personNum.personPawn - 0 || 0));
                        $('#countGPZY').text(' ' + (self.personNum.person_stockPawn - 0 || 0));
                        $('#countGQDJ').text(' ' + (self.personNum.person_judicail_assist_num - 0 || 0));
                        $('#countZBAJ').text(' ' + (self.personNum.person_final_case_list_num - 0 || 0)); //终本案件
                        $('#countZQSCSX').text(' ' + (self.personNum.person_securities_dishonest_num - 0 || 0)); //证券市场失信
                        $('#countJYBJ').text(' ' + (self.personNum.person_edu_background_num - 0 || 0)); //教育背景
                        $('#countGZLL').text(' ' + (self.personNum.person_work_experience_num - 0 || 0)); //工作履历
                        $('#countHJXX').text(' ' + (self.personNum.person_award_num - 0 || 0)); //获奖信息
                        $('#countHZHB').text(' ' + (self.personNum.hzhbNum - 0 || 0));
                        $('#countHisDRFR').text(' ' + (self.personNum.hisLegalRepNum - 0 || 0)); //历史法人
                        $('#countHisDWTZ').text(' ' + (self.personNum.hisShareholderNum - 0 || 0)); //历史对外投资
                        $('#countHisDWRZ').text(' ' + (self.personNum.hisMemberNum - 0 || 0)); //历史在外任职
                        $('#countHisBZXR').text(' ' + (self.personNum.hisPersonDebetorNum - 0 || 0)); //历史被执行人
                        $('#countHisSXXX').text(' ' + (self.personNum.hisPromiseNum - 0 || 0)); //历史失信信息
                        $('#countHisXZGXF').text(' ' + (self.personNum.hisConsumptionNum - 0 || 0)); //历史失信信息
                        $('#countHisGQCZ').text(' ' + (self.personNum.hisPersonPawn - 0 || 0)); //历史股权出质
                        $('#countHisGQDJ').text(' ' + (self.personNum.hisPersonJudicailAssistNum - 0 || 0)); //历史股权冻结

                        var numItem = $('.nav-tabs>div').find('ul').find('a>i');
                        for (var item = 0; item < numItem.length; item++) {
                            var thisNum = $(numItem[item]).text();
                            if (thisNum == ' 0') {
                                $(numItem[item]).parent().addClass('forbiddenJump');
                                $(numItem[item]).text('');
                            }
                            try {
                                if (parseInt(thisNum) > 99) {
                                    $(numItem[item]).text(' 99+')
                                }
                            } catch (e) {}
                        }

                        Person.showBasicInfoDiv();

                        var countGLQY = parseInt(self.personNum.totalNum) + parseInt(self.personNum.legalRepNum) + parseInt(self.personNum.ctrlNum) + parseInt(self.personNum.shareholderNum) + parseInt(self.personNum.memberNum);
                        if (countGLQY == 0) {
                            //关联企业
                            $("#titQlqy").addClass("nav-disabled");
                        }
                        var countFXXX = parseInt(self.personNum.person_securities_dishonest_num) + parseInt(self.personNum.personPawn) + parseInt(self.personNum.person_stockPawn) + parseInt(self.personNum.personDebetorNum) + parseInt(self.personNum.promise_num) + parseInt(self.personNum.consumption_num) + parseInt(self.personNum.person_judicail_assist_num);
                        if (countFXXX == 0) {
                            //关联企业
                            $("#titFXXX").addClass("nav-disabled");
                        }
                        var countLSXX = parseInt(self.personNum.hisLegalRepNum) + parseInt(self.personNum.hisShareholderNum) + parseInt(self.personNum.hisMemberNum) + parseInt(self.personNum.hisPersonDebetorNum) + parseInt(self.personNum.hisPromiseNum) + parseInt(self.personNum.hisConsumptionNum) + parseInt(self.personNum.hisPersonPawn) + parseInt(self.personNum.hisPersonJudicailAssistNum);
                        if (countLSXX == 0) {
                            //历史信息
                            $("#titLSXX").addClass("nav-disabled");
                        }


                        Person.showAllModelsDiv();
                    } else {
                        self.personNum = {
                            memberNum: 0,
                            shareholderNum: 0,
                            legalRepNum: 0,
                            totalNum: 0,
                            ctrlNum: 0
                        };
                    }
                }
                //call();
                $('#load_data').hide();
            }, function(data) {
                self.personNum = {
                    memberNum: 0,
                    shareholderNum: 0,
                    legalRepNum: 0
                };
                //call();
                $('#load_data').hide();
            });
        },
        scroll2Nav: function() {
            var hash = location.hash.substring(1);
            if (hash && hash != "null" && hash != "") {
                var y = $("#" + hash).offset().top;
                setTimeout(function() {
                    window.scrollTo(0, y)
                }, 1000)
            }
        },
        showBasicInfoDiv: function() {
            //根据模块数量按顺序显示各个模块最基本的外框和id

            //          Person['getpersonbasicinfo']();//人物基本信息，暂时屏蔽
            var modelNumArr = ["person_edu_background_num", "person_work_experience_num", "person_award_num"];
            var modelNameArr = ["教育背景", "工作履历", "获奖信息"];
            var modelFnArr = ["getpersonedubackground", "getpersonworkexperience", "getpersonawardinfo"];
            var tmpHtmlArr = []
            for (var i = 0; i < modelNumArr.length; i++) {
                //第一次循环显示每个模块最外框的div和id
                if (modelNumArr[i] == true || Person.personNum[modelNumArr[i]] > 0) {
                    var eachModelNum = modelNumArr[i] == true ? "" : Person.personNum[modelNumArr[i]];
                    tmpHtmlArr.push('<div class="each-module" id="' + modelFnArr[i] + '"></div>');
                }
            }
            $("#modelBasicList").html(tmpHtmlArr.join(""));
            for (var i = 0; i < modelNumArr.length; i++) {
                //第二次执行每个模式的函数，如果有值的话
                if (modelNumArr[i] == true || Person.personNum[modelNumArr[i]] > 0) {
                    var fn = modelFnArr[i];
                    if (fn) {
                        Person[fn]($("#" + modelFnArr[i]));
                    }
                }
            }
            //          Person.scroll2Nav();
        },
        showAllModelsDiv: function() {
            if (Person.personNum['shareholderNum'] > 0) {
                Person.getGQCTMap();
            }
            //根据模块数量按顺序显示各个模块最基本的外框和id
            var modelNumArr = ["totalNum", "legalRepNum", "shareholderNum", "memberNum", "ctrlNum", true, "personDebetorNum", "promise_num", "consumption_num", "personPawn", "person_stockPawn", "person_judicail_assist_num", "person_final_case_list_num", "person_securities_dishonest_num", "hisLegalRepNum", "hisShareholderNum", "hisMemberNum", "hisPersonDebetorNum", "hisPromiseNum", "hisConsumptionNum", "hisPersonPawn", "hisPersonJudicailAssistNum"];
            //var modelNumArr=["totalNum","legalRepNum","shareholderNum","emberNum","ctrlNum",true,true,true,true,true,true,true,true];
            var modelNameArr = ["全部企业", "担任法人", "对外投资", "在外任职", "实际控制", "合作伙伴", "被执行人", "失信信息", "限制高消费", "股权出质", "股票质押", "股权冻结", "终本案件", "证券期货市场失信信息", "担任历史法人", "历史对外投资", "历史在外任职", "历史被执行人", "历史失信信息", "历史限制高消费", "历史股权出质", "历史股权冻结"];
            var modelFnArr = ["getallcompany", "getpersonallegalrep", "getpersonalshareholder", "getpersonalposition", "getrealctrl", "getcorpfriend", "getpersonenforced", "getdishonesty", "limitConsumption", "showPledgedstock", "showPledgedstock02", "freezestock", "finalcase", "getpersonsecuritiesdishonestinfo", "gethispersonallegalrep", "gethispersonalshareholder", "gethispersonalposition", "gethispersonenforced", "gethisdishonesty", "hislimitConsumption", "showHisPledgedstock", "hisfreezestock"];
            var tmpHtmlArr = []
            for (var i = 0; i < modelNumArr.length; i++) {
                //第一次循环显示每个模块最外框的div和id
                if (modelNumArr[i] == true || Person.personNum[modelNumArr[i]] > 0) {
                    var eachModelNum = modelNumArr[i] == true ? "" : Person.personNum[modelNumArr[i]];
                    tmpHtmlArr.push('<div class="each-module" id="' + modelFnArr[i] + '"></div>');
                }
            }
            $("#modelList").html(tmpHtmlArr.join(""));
            for (var i = 0; i < modelNumArr.length; i++) {
                //第二次执行每个模式的函数，如果有值的话
                if (modelNumArr[i] == true || Person.personNum[modelNumArr[i]] > 0) {
                    var fn = modelFnArr[i];
                    if (fn) {
                        Person[fn]($("#" + modelFnArr[i]));
                    }
                }
            }
            Person.scroll2Nav();
        },
        getRelation: function(param) {
            $('#person_ysgx').find('.widget-chart-header').text(Person.userInfo.name);
            $('#person_ysgx').find('#companyChart').hide().empty();
            $('#person_ysgx').removeClass('hidden');
            $('#person_ysgx').find('.chart-loading').hide();
            $('#person_ysgx').find('.chart-header').hide();
            $('#person_ysgx').find('.chart-loading').show();
            delete window._CompanyChart;

            myWfcAjax("getpersonpatht", { bindcode: param.code, level: 1 }, function(data) {
                data = JSON.parse(data);
                if (data.ErrorCode == '-10') {
                    $('#person_ysgx').find('.widget-model').find('.widget-header').siblings().remove();
                    Common.notVipModule($('#person_ysgx').find('.widget-model'), '疑似关系', intl('208267'));
                    $('#person_ysgx').removeClass('hidden');
                    return;
                }
                if (data.ErrorCode == 0 && data.Data) {
                    var dataSet = Person.chartDataSet;

                    if (data.Data.nodes && data.Data.nodes.length && data.Data.routes && data.Data.routes.length) {
                        dataSet = Person.chartDataSet = Common.chartAllDataChange(data.Data);
                        var tmp = []; // 避免后端生成的节点无序

                        var levelObj = {};
                        var stateObj = {};

                        for (var i = 0; i < data.Data.nodes.length; i++) {
                            var t = data.Data.nodes[i];
                            if (dataSet.nodeObj[t.windId]) {
                                tmp.push(dataSet.nodeObj[t.windId]);
                            }

                            // TODO 兼容后端bug
                            var state = '';
                            if (t.status) {
                                state = t.status;
                            } else if (t.props && t.props.status) {
                                state = t.props.status
                            }
                            var level = t.level;

                            if (levelObj[level]) {
                                if (!levelObj[level][t.windId]) {
                                    levelObj[level][t.windId] = t;
                                }
                            } else {
                                levelObj[level] = {};
                                levelObj[level][t.windId] = t;
                            }

                            if (t.nodeType === 'company') {
                                if (stateObj[state]) {
                                    if (!stateObj[state][t.windId]) {
                                        stateObj[state][t.windId] = t;
                                    }
                                } else {
                                    stateObj[state] = {};
                                    stateObj[state][t.windId] = t;
                                }
                            }
                        }
                        dataSet.levelObj = levelObj;
                        dataSet.stateObj = stateObj;
                        dataSet.nodes = tmp;
                        var pathSet = Person.chartPathSet = Common.chartPathChange(data.Data.paths);
                        Person._corpListParams.pathSet = pathSet.pathObj;
                        Person._corpListParams.companycode = '';
                        // Person._corpListParams.companyname = param.companyName;

                        var _rootNode = null;

                        // 记录当前有多少企业节点(剔除目标公司)
                        for (var iii = 0; iii < dataSet.nodes.length; iii++) {
                            var item = dataSet.nodes[iii];
                            if (item.nodeType == 'company' && (item.windId.indexOf('$') < 0)) {
                                if (item.windId !== param.companyCode) {
                                    if (Person._corpListParams.companycode) {
                                        Person._corpListParams.companycode += (',' + item.windId);
                                    } else {
                                        Person._corpListParams.companycode = item.windId;
                                    }
                                }
                            }
                            if (item.windId === param.code) {
                                _rootNode = item;
                            }
                        }
                    } else {
                        dataSet = Person.chartDataSet = {
                            nodes: [{
                                level: 0,
                                nodeName: Person.userInfo.name,
                                windId: Person.userInfo.id,
                                imageId: Person.userInfo.imgId,
                                nodeType: 'person'
                            }],
                            routes: [],
                            paths: []
                        }
                    }

                    // TODO show
                    $('#person_ysgx').find('.chart-loading').hide();
                    $('#person_ysgx').find('.chart-header').show();
                    $('#person_ysgx').find('#companyChart').show();

                    Person.cyInstance = Common.relationChartInitFun(dataSet, { code: param.code }, $('#person_ysgx').find('#companyChart')[0], '400', 1.2, true);

                    function actionSaveFn(e) {
                        // Common.burypcfunctioncode('');
                        if ($('#person_ysgx').find('#load_data').attr('style').indexOf('block') > -1) {
                            return false;
                        }
                        if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                            if (layer) {
                                layer.msg('功能升级中!')
                            } else {
                                window.alert('功能升级中!')
                            }
                            return;
                        }
                        var imgData = Person.cyInstance.jpg({ full: true, bg: '#ffffff', scale: 1.8 })
                        var target = $('[data-id="layer2-node"]')
                        Common.saveCanvasImg('[data-id="layer2-node"]', Person.userInfo.name + '_疑似关系', 3, imgData)
                    }

                    function actionOneFn(e) {
                        if (!Person.isVip) {
                            var contSet = {
                                // 无权限
                                title: intl('208380' /* 人物图谱 */ ),
                                dec: ['购买VIP/SVIP套餐，即可不限次查询自然人的投资、任职、实际控制等关联关系图谱', '购买VIP/SVIP套餐，即可不限次查询自然人的投资、任职、实际控制等关联关系图谱']
                            };
                            Common.Popup([1, true], true, contSet);
                            return false;
                        }
                        // Common.burypcfunctioncode('');                        
                        window.open('PersonChart.html?id=' + Person.userInfo.id + '&companyname=' + Person.userInfo.name + '#chart_ysgx');
                        return false;
                    }

                    function actionTwoFn(e) {
                        // Common.burypcfunctioncode('');
                        if ($('#person_ysgx').find('#load_data').attr('style').indexOf('block') > -1) {
                            return false;
                        }
                        Person.getRelation(param);
                    }

                    function actionThreeFn(e) {
                        // Common.burypcfunctioncode('');
                        Person._corpListParams.cmd = 'relationpathcorps';
                        window._CompanyChart = { _corpListParams: Person._corpListParams };

                        layer.open({
                            title: [intl('138216' /* 企业列表 */ ), 'font-size:18px;'],
                            skin: 'feedback-body',
                            type: 2,
                            area: ['950px', '720px'], //宽高        
                            content: '../Company/chartCorpList.html' + location.search
                        })
                    }

                    $('#person_ysgx .chart-header-redirect').off('click').on('click', actionOneFn);
                    $('#person_ysgx .chart-header-reload').off('click').on('click', actionTwoFn);
                    $('#person_ysgx .chart-header-save').off('click').on('click', actionSaveFn);
                    $('#person_ysgx .chart-header-list').off('click').on('click', actionThreeFn);

                } else {
                    $('#person_ysgx').find('.widget-header').siblings('div:not(.widget-chart-header)').height('212');
                    $('#person_ysgx').find('.widget-header').siblings('div').find('#screenArea').height('210').css('cursor', 'default');
                    $('#person_ysgx').find('.chart-header').hide();
                    $('#person_ysgx').find('#load_data').hide();
                    $('#person_ysgx').find('#no_data').show();
                    // todo 暂无疑似关联数据
                }
            }, function() {
                $('#person_ysgx').find('.widget-header').siblings('div:not(.widget-chart-header)').height('212');
                $('#person_ysgx').find('.widget-header').siblings('div').find('#screenArea').height('210').css('cursor', 'default');
                $('#person_ysgx').find('.chart-header').hide();
                $('#person_ysgx').find('#load_data').hide();
                $('#person_ysgx').find('#no_data').show();
                // todo 暂无疑似关联数据
            })
        },
        getGQCTMap: function($dom) {
            var selfEle = $('#person_gqct')
            var rootData = null;
            // var parameter = { "companycode": Person.userInfo.id, "depth": 4 };
            var parameter = { "companycode": '1000034759', "depth": 4, name: '上海络杰软件有限公司' };
            var vData = {}; // 暂存原始数据
            var echartInstance = null;
            $(selfEle).removeClass('hidden');
            $(selfEle).find('#load_data').show();
            $(selfEle).find('.chart-header').off('click', 'button');

            myWfcAjax("tracingstockex", parameter, function(data) {
                $(selfEle).find('#load_data').hide();

                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    rootData = rootData = data.Data;
                    try {
                        if ((rootData.investTree && rootData.investTree.children && rootData.investTree.children.length) || (rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length)) {
                            $.extend(true, vData, data.Data);

                            echartInstance = echarts.init($(selfEle).find('#companyChart')[0]);
                            echartInstance._wind_scale = 0.8;
                            echartInstance._wind_redirect = true;


                            Common.shareHolderAndInvestChartInitFun(echartInstance, rootData, parameter.companycode, parameter.name);
                            $(selfEle).find('.chart-header').show();
                            $(selfEle).find('.chart-header').on('click', 'button', gqctNavEvent);
                        } else {
                            $(selfEle).find('.widget-header').siblings('div:not(.widget-chart-header)').height(212);
                            $(selfEle).find('.widget-header').siblings('div').find('#screenArea').height('210').css('cursor', 'default');
                            $(selfEle).find('.chart-header').hide();
                            $(selfEle).find('#load_data').hide();
                            $(selfEle).find('#no_data').show();
                        }
                    } catch (e) {
                        $(selfEle).find('.widget-header').siblings('div:not(.widget-chart-header)').height(212);
                        $(selfEle).find('.widget-header').siblings('div').find('#screenArea').height('210').css('cursor', 'default');
                        $(selfEle).find('.chart-header').hide();
                        $(selfEle).find('#load_data').hide();
                        $(selfEle).find('#no_data').show();
                    }
                } else {
                    $(selfEle).find('.widget-header').siblings('div:not(.widget-chart-header)').height(212);
                    $(selfEle).find('.widget-header').siblings('div').find('#screenArea').height('210').css('cursor', 'default');
                    $(selfEle).find('.chart-header').hide();
                    $(selfEle).find('#load_data').hide();
                    $(selfEle).find('#no_data').show();
                }
            }, function() {
                $(selfEle).find('.widget-header').siblings('div:not(.widget-chart-header)').height(212);
                $(selfEle).find('.widget-header').siblings('div').find('#screenArea').height('210').css('cursor', 'default');
                $(selfEle).find('.chart-header').hide();
                $(selfEle).find('#load_data').hide();
                $(selfEle).find('#no_data').show();
            });

            /**
             * 刷新
             * 
             * @param {any} e 
             * @returns 
             */
            function reloadChart(e) {
                var ecConfig = require('echarts/config');
                echartInstance._messageCenter.dispatch('restore', null, null, echartInstance);
                return false;
            }

            /**
             * 股权穿透保存图片事件委托
             * 
             * @param {any} e 
             */
            function gqctSaveImgEvent(e) {
                if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                    if (layer) {
                        layer.msg('功能升级中!')
                    } else {
                        window.alert('功能升级中!')
                    }
                    return;
                }
                Common.saveEchart2Img(echartInstance, parameter.name ? (parameter.name + '_' + '股权穿透') : '股权穿透', $(selfEle).find('#companyChart'));
            }

            /**
             * 股权穿透header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function gqctNavEvent(e) {
                var target = e.target;
                if (!$(target).is('button')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 1:
                        gqctSaveImgEvent();
                        break;
                    case 0:
                    default:
                        reloadChart();
                        break;
                }
                return false;
            }
        },
        // 对外任职
        getpersonalposition: function($dom) {
            var tableSetting = {
                interface: 'getpersonincharge',
                moduleName: intl('138525' /* 在外任职 */ ),
                recordKey: 'memberNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '15%', '10%', '10%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ ), intl('138728' /* 职务 */ )],
                align: [0, 0, 2, 0, 0, 0, 0, 0],
                fields: ["NO.", 'invest_name', 'invest_reg_capital', 'TODO', 'region', 'industry', 'invest_reg_status', 'invest_reg_date', 'title'],
                defer: Person.tabsHash.person_dwrz.defer,
                notVipTitle: intl('138661' /* 关联企业 */ ),
                notVipTips: intl('208269'),
                ajaxSuccess: function(res) {
                    // var data = res;                    
                    // // var members = data.members || [];
                    // var members = data || [];
                    // var tmp = [];
                    // for(var i=0;i<members.length;i++){
                    //     tmp.push({position:members[i].position,name:members[i].corporation.name,regCapital:members[i].corporation.regCapital,province:members[i].corporation.province,industry:members[i].corporation.industry,regStatus:members[i].corporation.regStatus,code:members[i].corporation.windId});
                    // }                                               
                    // var returnData = {data:tmp,recordsTotal:Person.personNum.memberNum,recordsFiltered:Person.personNum.memberNum};
                    // return returnData;                    

                    return res;
                }
            }
            var $container = $dom ? $dom : $('#person_dwrz');
            $container.empty().html(Person.drawTab(tableSetting, "tabPersonalPosition", "tbodyPersonalPosition", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'invest_name',
                    "render": function(data, type, full, meta) {
                        if (data && full['invest_id']) {
                            var personId = full.invest_id;
                            var pingParam = '&fromModule=getpersonalposition&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'invest_reg_capital',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 4,
                    "data": 'region',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'invest_reg_status',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'invest_reg_date',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 8,
                    "data": 'title',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                }
            ]
            Person.pageSetting("#tabPersonalPosition", tableSetting, columnDefsSet, null, $dom);
        },
        // 对外投资
        getpersonalshareholder: function($dom) {
            var tableSetting = {
                interface: 'getpersoninvest',
                moduleName: intl('138724' /* 对外投资 */ ),
                recordKey: 'shareholderNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '15%', '10%', '10%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ ), intl('138871' /* 持股比例 */ )],
                align: [0, 0, 2, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", 'invest_name', 'invest_reg_capital', 'TODO', 'region', 'industry', 'invest_reg_status', 'invest_reg_date', 'invest_rate'],
                defer: Person.tabsHash.person_dwtz.defer,
                notVipTitle: intl('138661' /* 关联企业 */ ),
                notVipTips: intl('208269'),
            }
            var $container = $dom ? $dom : $('#person_dwtz');
            $container.empty().html(Person.drawTab(tableSetting, "tabPersonalShareholder", "tbodyPersonalShareholder", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'invest_name',
                    "render": function(data, type, full, meta) {
                        if (data && full['invest_id']) {
                            var personId = full.invest_id;
                            var pingParam = '&fromModule=getpersonalshareholder&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'invest_reg_capital',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 4,
                    "data": 'region',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'invest_reg_status',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'invest_reg_date',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 8,
                    "data": 'invest_rate',
                    "render": function(data, type, full, meta) {
                        return Common.formatPercent(data)
                    }
                }
            ]
            Person.pageSetting("#tabPersonalShareholder", tableSetting, columnDefsSet, null, $dom);
        },
        // 担任法人
        getpersonallegalrep: function($dom) {
            var tableSetting = {
                interface: 'getpersoncorp',
                moduleName: intl('138160' /* 担任法人 */ ),
                recordKey: 'legalRepNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '20%', '15%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ )],
                align: [0, 0, 2, 0, 0, 0, 0],
                fields: ["NO.", 'invest_name', 'invest_reg_capital', 'TODO', 'region', 'industry', 'invest_reg_status', 'invest_reg_date'],
                defer: Person.tabsHash.person_drfr.defer,
                notVipTitle: intl('138661' /* 关联企业 */ ),
                notVipTips: intl('208269'),
            }
            var $container = $dom ? $dom : $('#person_drfr');
            $container.empty().html(Person.drawTab(tableSetting, "tabPersonalLegalrep", "tbodyPersonalLegalrep", false, $dom));

            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'invest_name',
                    "render": function(data, type, full, meta) {
                        if (data && full['invest_id']) {
                            var personId = full.invest_id;
                            var pingParam = '&fromModule=getpersonallegalrep&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'invest_reg_capital',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 4,
                    "data": 'region',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'invest_reg_status',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'invest_reg_date',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                }
            ]
            Person.pageSetting("#tabPersonalLegalrep", tableSetting, columnDefsSet, null, $dom);
        },
        getallcompany: function($dom) {
            // 全部企业
            var tableSetting = {
                interface: 'personallcompany',
                moduleName: intl('138651' /* 全部企业 */ ),
                recordKey: 'totalNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '10%', '10%', '15%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ ), intl('138496' /* 角色 */ )],
                align: [0, 0, 2, 0, 0, 0, 0],
                fields: ["NO.", 'CorpName', 'RegCapital', 'TODO', 'Region', 'Industry', 'RegStatus', 'RegDate', 'Role'],
                notVipTitle: intl('138661' /* 关联企业 */ ),
                notVipTips: intl('208269'),
            }
            var $container = $dom ? $dom : $('#person_qbqy');
            $container.empty().html(Person.drawTab(tableSetting, "tabAllCompany", "tbodyAllCompany", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'CorpName',
                    "render": function(data, type, full, meta) {
                        if (data && full['CorpId']) {
                            var personId = full.CorpId;
                            var pingParam = '&fromModule=getallcompany&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'RegCapital',
                    "render": function(data) {
                        // return Common.formatMoney(data, [4, '&nbsp;']) + (data['RegCapitalUnit'] ? ('万' + data['RegCapitalUnit']) : '万元')
                        return Common.formatMoney(data, [4, '&nbsp;']);
                    }
                },
                {
                    "targets": 4,
                    "data": 'Region',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'Industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'RegStatus',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'Date',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 8,
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
            Person.pageSetting("#tabAllCompany", tableSetting, columnDefsSet, null, $dom);
        },
        // 实际控制
        getrealctrl: function($dom) {
            var tableSetting = {
                interface: 'personcontrolled',
                moduleName: intl('138125' /* 实际控制 */ ),
                recordKey: 'ctrlNum',
                thWidthRadio: ["5%", '30%', '15%', '50%'],
                thName: [intl('138741' /* 序号 */ ), intl('138622' /* 实际控制企业名称 */ ), intl('138412' /* 实际持股比例 */ ), intl('138354' /* 投资链 */ )],
                align: [0, 0, 0, 0],
                fields: ["NO.", 'invest_name', 'invest_rate', 'control_route'],
                defer: Person.tabsHash.person_sjkz.defer,
                notVipTitle: intl('138661' /* 关联企业 */ ),
                notVipTips: intl('208269'),
            }
            var $container = $dom ? $dom : $('#person_sjkz');
            $container.empty().html(Person.drawTab(tableSetting, "tabRealCtrl", "tbodyRealCtrl", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'invest_name',
                    "render": function(data, type, full, meta) {
                        if (data && full['invest_id']) {
                            var personId = full.invest_id;
                            var pingParam = '&fromModule=getrealctrl&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'invest_rate',
                    "render": function(data) {
                        return Common.formatPercent(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'control_route',
                    "render": function(data, type, full, meta) {
                        var str = '';
                        for (var i = 0; i < data.length; i++) {
                            var item = null;
                            var rate = 0;
                            item = data[i];
                            for (var j = 0; j < item.length - 1; j++) {
                                rate = rate ? (rate * item[j].stockShare / 100) : item[j].stockShare;
                            }
                            str += '<span class="td-span-ctrl">' + intl('138431' /* 路径 */ ) + +(i + 1) + '（' + intl('138459' /* 占比约 */ ) + ' ' + Common.formatPercent(rate) + ')</span><br>';
                            str += '<span class="td-span-route-left underline wi-secondary-color wi-link-color" data-type="' + item[0]['type'] + '" data-name="' + item[0]['name'] + '" data-code="' + item[0]['Id'] + '">' + item[0]['name'] + '</span>';

                            for (var j = 0; j < item.length - 1; j++) {
                                str += '<span class="td-span-route-right"><i></i><b>' + Common.formatPercent(item[j]['stockShare']) + '</b>' + '<span class="underline wi-secondary-color wi-link-color"  data-type="' + item[j + 1]['type'] + '" data-code="' + item[j + 1]['Id'] + '">' + item[j + 1]['name'] + '</span></span>';
                            }
                            str += '</br>'
                        }

                        return str;

                        // return '<span class="td-span-ctrl">路径1（占比约90%）</span><br><span class="td-span-route-left">陈江涛</span><span class="td-span-route-right"><i></i><b>90%</b>宁波眉山企业</span>' +
                        //     '<br><span class="td-span-ctrl">路径2（占比约12%）</span><br><span class="td-span-route-left">项向</span><span class="td-span-route-right"><i></i><b>12%</b>乐山眉山企业</span><span class="td-span-route-right"><i></i><b>23%</b>江西南昌大学</span>';
                    }
                }
            ]
            Person.pageSetting("#tabRealCtrl", tableSetting, columnDefsSet, { name: Person.userInfo.name }, $dom);
            $('#tabRealCtrl').on('click', '.wi-link-color', Person.linkWithCodeEventHandler);
        },
        getcorpfriend: function($dom) {
            // 合作伙伴
            var tableSetting = {
                interface: 'getclassifycorpperson',
                moduleName: intl('138747' /* 合作伙伴 */ ),
                recordKey: 'hzhbNum',
                thWidthRadio: ["5%", '30%', '15%', '50%'],
                thName: [intl('138741' /* 序号 */ ), intl('138622' /* 实际控制企业名称 */ ), intl('138412' /* 实际持股比例 */ ), intl('138354' /* 投资链 */ )],
                align: [0, 0, 0, 0],
                fields: ["NO.", 'invest_name', 'invest_rate', 'control_route'],
                defer: Person.tabsHash.person_hzhb.defer,
                notVipTitle: intl('138747' /* 合作伙伴 */ ),
                notVipTips: intl('222897', '购买VIP/SVIP套餐，即可不限次查询与自然人商业关系紧密的关联人物信息'),
                callback: function(result) {
                    if (result && result.ErrorCode == '-10') {
                        $('#person_hzhb').removeClass('hidden');
                        $('#countHZHB').parents('.nav-block').removeClass('nav-disabled');
                        $('#countHZHB').text('(' + (Person.personNum.hzhbNum - 0 || 0) + ')');
                        Common.notVipModule($("#tabHZHB").show().empty(), intl('138747' /* 合作伙伴 */ ), intl('222897', '购买VIP/SVIP套餐，即可不限次查询与自然人商业关系紧密的关联人物信息'));
                        return;
                    }
                    if (result && result.Data && result.Data.search && result.Data.search.length) {
                        Person.personNum.hzhbNum = result.Page.Records;
                        var htmlArr = [];
                        var data = result.Data.search;
                        var $container = $('#getcorpfriend').find('.dataTables_wrapper');
                        var bodyEle = $container.find('.tbody-corp-friend');
                        if (bodyEle.length) {
                            bodyEle.remove();
                        } else {
                            if (Person.personNum.hzhbNum - 0) {
                                $('#person_hzhb').removeClass('hidden');
                                $('#countHZHB').parents('.nav-block').removeClass('nav-disabled');
                                $('#countHZHB').text('(' + (Person.personNum.hzhbNum - 0 || 0) + ')');
                            }
                            Person.personSearch = Person.personSearch || 'person_ysgx'
                        }

                        var idx = Person.tabsHash[Person.personSearch].idx;

                        Person.personSelect = $('.nav-tabs').find('.nav-block').eq(idx);

                        htmlArr.push('<div class="tbody-corp-friend">');

                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var imgId = data[i].image_id_new ? data[i].image_id_new : '';
                            var imgSrc = '../resource/images/Company/person_logo.png';
                            if (imgId) {
                                // if (!global_isRelease) {
                                // imgSrc = 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + imgId;
                                imgSrc = imgId
                                // } else {
                                // imgSrc = 'http://wfcweb/imageWeb/ImgHandler.aspx?imageID=' + imgId;
                                // }
                            }
                            htmlArr.push('<div class="td-item-corp-friend">');
                            htmlArr.push('<div class="item-corp-friend-title"><img class="big-logo" width="49" height="49" src="' + imgSrc + '"><span class="item-corp-friend-name" data-id="' + item['person_id'] + '">' + item['person_name'] + '</span>')
                            htmlArr.push('<span class="item-corp-friend-desc">' + intl('138716' /* 关联 */ ) + '<i class="wi-secondary-color">' + item['relative_ent_cnt'] + '</i>' + intl('138212' /* 家公司，主要分布 */ ) + '：</span></div>');

                            // 限制最多三个地区
                            if (item['region_cnt_corp_name'] && item['region_cnt_corp_name'].length) {
                                item['region_cnt_corp_name'].length = item['region_cnt_corp_name'].length > 3 ? 3 : item['region_cnt_corp_name'].length;
                            } else {
                                item['region_cnt_corp_name'] = [];
                            }

                            for (var j = 0; j < item['region_cnt_corp_name'].length; j++) {
                                var desc = item['region_cnt_corp_name'][j];
                                var more = desc.split('_')[2] > 1 ? (' ' + intl('138285' /* 等 */ )) : '';
                                htmlArr.push('<div class="item-corp-friend-content"><div><i></i>' + desc.split('_')[1] + '(' + intl('138587' /*共*/ ) + '<span class="wi-secondary-color"> ' + desc.split('_')[2] + ' </span>家)  <span>' + desc.split('_')[3] + more + '</span></div></div>')
                            }
                            htmlArr.push('<div class="item-corp-friend-bottom">')

                            if (item['artificial_person_cnt'] - 0) {
                                htmlArr.push('<span class="item-corp-friend-detail"><span class="corp-friend-detail-num">' + item['artificial_person_cnt'] + '</span><span class="corp-friend-detail-desc" title="' + intl('138160' /* 担任法人 */ ) + '">' + intl('138160' /* 担任法人 */ ) + '</span></span>')
                            }
                            if (item['foreign_job_cnt'] - 0) {
                                htmlArr.push('<span class="item-corp-friend-detail"><span class="corp-friend-detail-num">' + item['foreign_job_cnt'] + '</span><span class="corp-friend-detail-desc" title="' + intl('138525' /* 在外任职 */ ) + '">' + intl('138525' /* 在外任职 */ ) + '</span></span>');
                            }
                            if (item['foreign_invest_cnt'] - 0) {
                                htmlArr.push('<span class="item-corp-friend-detail"><span class="corp-friend-detail-num">' + item['foreign_invest_cnt'] + '</span><span class="corp-friend-detail-desc" title="' + intl('138724' /* 对外投资 */ ) + '">' + intl('138724' /* 对外投资 */ ) + '</span></span>');
                            }
                            if (item['actual_control_cnt'] - 0) {
                                htmlArr.push('<span class="item-corp-friend-detail"><span class="corp-friend-detail-num">' + item['actual_control_cnt'] + '</span><span class="corp-friend-detail-desc" title="' + intl('138125' /* 实际控制 */ ) + '">' + intl('138125' /* 实际控制 */ ) + '</span></span>');
                            }
                            htmlArr.push('</div></div>')
                        }
                        htmlArr.push('</div>');
                        $container.find('.dataTables_paginate').before($(htmlArr.join('')));
                    } else {
                        $("#titHZHB").addClass("nav-disabled");
                        $("#getcorpfriend").hide();
                    }
                }
            }
            var $container = $dom ? $dom : $('#person_hzhb');
            $container.empty().html(Person.drawTab(tableSetting, "tabHZHB", "tbodyHZHB", false, $dom));
            var columnDefsSet = [];
            $('#tabHZHB').hide();
            Person.pageSetting("#tabHZHB", tableSetting, columnDefsSet, { province: '', personid: Person.userInfo.id, personname: Person.userInfo.name, }, $dom);
        },
        getpersonenforced: function($dom) {
            //被执行人
            var tableSetting = {
                interface: "getpersondebetor",
                //dataFromList:true,//接口数据来源从Data.list来而不是Data
                moreLink: "getpersonenforced",
                moduleName: intl('138592' /* 被执行人 */ ),
                modelNum: "person_debetor_num",
                thWidthRadio: ["5%", "25%", "30%", "29%", "11%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('138288' /* 执行标的 */ ), intl('138228' /* 执行法院 */ ), intl('138294' /* 立案时间 */ )],
                align: [0, 0, 0, 0, 0],
                fields: ["NO.", "case_no", "exe_target", "exe_court", "case_time"],
                notVipTitle: intl('120664' /* 风险信息 */ ),
                notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                recordKey: 'personDebetorNum',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabPersonenforced", "tbodyPersonenforced", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'case_no',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'exe_target',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'exe_court',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'case_time',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var params = { "personid": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabPersonenforced", tableSetting, columnDefsSet, params, $dom);
        },
        getdishonesty: function($dom) {
            //失信信息
            var tableSetting = {
                interface: "appgetpersonbreakpromise",
                moduleName: intl('138591' /* 失信信息 */ ),
                moreLink: "getdishonesty",
                modelNum: "promise_num",
                thWidthRadio: ["5%", "22%", "10%", "26%", "14%", "13%", "10%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('138435' /* 被执行人的履行情况 */ ), intl('138512' /* 行为具体情形 */ ), intl('138228' /* 执行法院 */ ), intl('138294' /* 立案时间 */ ), intl('132647' /* 操作 */ )],
                align: [0, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", "caseNumber", "performance", "behavior", "court", "filingTime", "detailId|showDetailLink:appgetpersonbreakpromisedetail,detailId,7"],
                notVipTitle: intl('120664' /* 风险信息 */ ),
                notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                recordKey: 'promise_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabDishonesty", "tbodyDishonesty", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'caseNumber',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'performance',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'behavior',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'court',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'filingTime',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'detailId',
                    "render": function(data, type, full, meta) {
                        return Common.showDetailLink(data, ["appgetpersonbreakpromisedetail", "detailId", 7]);
                    }
                }
            ]
            var params = { "personid": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabDishonesty", tableSetting, columnDefsSet, params, $dom);
        },
        limitConsumption: function($dom) {
            //限制高消费
            var tableSetting = {
                interface: "appgetpersonconsumption",
                moduleName: intl('209064' /* 限制高消费 */ ),
                moreLink: "limitConsumption",
                modelNum: "consumption_num",
                thWidthRadio: ["5%", "20%", "20%", "25%", "15%", "15%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('209065' /* 限制消费人员姓名 */ ), intl('209066' /* 限制消费人员所属企业 */ ), intl('209067' /* 颁布法院 */ ), intl('138294' /* 立案时间 */ )],
                align: [0, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", "caseNumber", "restrictConsumerName", "restrictConsumerAffiliates", "court", "filingTime"],
                notVipTitle: intl('120664' /* 风险信息 */ ),
                notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                recordKey: 'consumption_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            console.log($container)
            $container.empty().html(Person.drawTab(tableSetting, "tabLimit", "tbodyLimit", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'caseNumber',
                    "render": function(data, type, full, meta) {
                        if (full.storagePath && data) {
                            var preStr = "http://news.windin.com/ns/imagebase/6767/"
                            return '<a class="wi-secondary-color wi-link-color" target="_blank" href="' + preStr + full.storagePath + '">' + data + '</a>'
                        } else {
                            return Common.formatCont(data)
                        }
                    }
                },
                {
                    "targets": 2,
                    "data": 'restrictConsumerName',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'restrictConsumerAffiliates',
                    "render": function(data, type, full, meta) {
                        if (data && full.restrictConsumerAffiliatesId) {
                            var personId = full.restrictConsumerAffiliatesId;
                            var pingParam = '&fromModule=limitConsumption&fromField=所属企业&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + pingParam + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'court',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'filingTime',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var params = { "personid": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabLimit", tableSetting, columnDefsSet, params, $dom);
        },
        showPledgedstock: function($dom, index) {
            //股权出质 
            var tableSetting = [{
                    fn: "showPledgedstock",
                    interface: "getpersonpledgor",
                    moduleName: intl('138281' /* 股权出质 */ ),
                    tabChange: {
                        type: [intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ )],
                        typeCnName: ["出质人", "质权人"],
                        typeName: "type",
                        typeBasicNum: ["personPledgorNum", "personPawneeNum"]
                    },
                    modelNum: "personPledgorNum",
                    moreLink: "showPledgedstock",
                    thWidthRadio: ["5%", "17%", "10%", "15%", "15%", "15%", "10%", "8%"],
                    thName: [intl('138741' /* 序号 */ ), intl('138769' /* 登记编号 */ ), intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ ), intl('138528' /* 出质股权标的企业 */ ), intl('138283' /* 出质股权数额（万元） */ ), intl('138248' /* 出质登记日期 */ ), intl('32098' /* 状态 */ )],
                    align: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    fields: ["NO.", "ep_reg_no", "ep_pledgor_name", "ep_pawnee_name", "ep_plex", "ep_equity_amount", "ep_reg_date", "ep_reg_state"],
                    notVipTitle: intl('120664' /* 风险信息 */ ),
                    notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                    recordKey: 'personPledgorNum',
                },
                {
                    fn: "showPledgedstock",
                    interface: "getpersonpledgee",
                    moduleName: intl('138281' /* 股权出质 */ ),
                    modelNum: "personPawneeNum",
                    moreLink: "showPledgedstock",
                    thWidthRadio: ["5%", "17%", "10%", "15%", "15%", "15%", "10%", "8%"],
                    thName: [intl('138741' /* 序号 */ ), intl('138769' /* 登记编号 */ ), intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ ), intl('138528' /* 出质股权标的企业 */ ), intl('138283' /* 出质股权数额（万元） */ ), intl('138248' /* 出质登记日期 */ ), intl('32098' /* 状态 */ )],
                    align: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    fields: ["NO.", "ep_reg_no", "ep_pledgor_name", "ep_pawnee_name", "ep_plex", "ep_equity_amount", "ep_reg_date", "ep_reg_state"],
                    notVipTitle: intl('120664' /* 风险信息 */ ),
                    notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                    recordKey: 'personPawneeNum',
                }
            ]
            var initIndex = index ? index : "0";
            if (initIndex == 0) {
                for (var i = 0; i < tableSetting.length; i++) {
                    var thisBasicNum = tableSetting[0].tabChange.typeBasicNum[i];
                    if (thisBasicNum && Person.personNum[thisBasicNum] && Person.personNum[thisBasicNum] != 0) {
                        break;
                    } else {
                        initIndex++;
                        if (initIndex >= tableSetting.length) {
                            initIndex = 0;
                        }
                    }
                }
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabequitypledgelist", "tbodyequitypledgelist", null, $dom, initIndex));
            var columnDefsSet = [
                [{
                        "targets": 1,
                        "data": 'ep_reg_no',
                        "render": function(data, type, full, meta) {
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 2,
                        "data": 'ep_pledgor_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['ep_pledgor_id']) {
                                var personId = full.ep_pledgor_id;
                                var pingParam = '&fromModule=showPledgedstock&entityAttribute=getpersonpledgor&fromField=出质人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 3,
                        "data": 'ep_pawnee_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['ep_pawnee_id']) {
                                var personId = full.ep_pawnee_id;
                                var pingParam = '&fromModule=showPledgedstock&entityAttribute=getpersonpledgor&fromField=质权人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 4,
                        "data": 'ep_plex',
                        "render": function(data, type, full, meta) {
                            if (data && full['ep_plex_id']) {
                                var personId = full.ep_plex_id;
                                var pingParam = '&fromModule=showPledgedstock&entityAttribute=getpersonpledgor&fromField=出质标的企业&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 5,
                        "data": 'ep_equity_amount',
                        "render": function(data, type, full, meta) {
                            return Common.formatMoney(data, [4, '&nbsp;'])
                        }
                    },
                    {
                        "targets": 6,
                        "data": 'ep_reg_date',
                        "render": function(data, type, full, meta) {
                            return Common.formatTime(data)
                        }
                    },
                    {
                        "targets": 7,
                        "data": 'ep_reg_state',
                        "render": function(data) {
                            return Common.formatCont(data)
                        }
                    }
                ],
                [{
                        "targets": 1,
                        "data": 'ep_reg_no',
                        "render": function(data, type, full, meta) {
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 2,
                        "data": 'ep_pledgor_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['ep_pledgor_id']) {
                                var personId = full.ep_pledgor_id;
                                var pingParam = '&fromModule=showPledgedstock&entityAttribute=getpersonpledgee&fromField=出质人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 3,
                        "data": 'ep_pawnee_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['ep_pawnee_id']) {
                                var personId = full.ep_pawnee_id;
                                var pingParam = '&fromModule=showPledgedstock&entityAttribute=getpersonpledgee&fromField=质权人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 4,
                        "data": 'ep_plex',
                        "render": function(data, type, full, meta) {
                            if (data && full['ep_plex_id']) {
                                var personId = full.ep_plex_id;
                                var pingParam = '&fromModule=showPledgedstock&entityAttribute=getpersonpledgee&fromField=出质标的企业&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 5,
                        "data": 'ep_equity_amount',
                        "render": function(data, type, full, meta) {
                            return Common.formatMoney(data, [4, '&nbsp;'])
                        }
                    },
                    {
                        "targets": 6,
                        "data": 'ep_reg_date',
                        "render": function(data, type, full, meta) {
                            return Common.formatTime(data)
                        }
                    },
                    {
                        "targets": 7,
                        "data": 'ep_reg_state',
                        "render": function(data) {
                            return Common.formatCont(data)
                        }
                    }
                ]

            ]

            var param = { "type": tableSetting[0].tabChange.typeCnName[initIndex], "personid": Person.userInfo.id };
            Person.pageSetting("#tabequitypledgelist", tableSetting, columnDefsSet, param, $dom, initIndex);

            $('#tabequitypledgelist').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        showPledgedstock02: function($dom, index) {
            //股票质押 
            var tableSetting = [{
                    fn: "showPledgedstock02",
                    interface: "getpersonstockpledgers",
                    moduleName: intl('205471' /* 股票质押 */ ),
                    tabChange: {
                        type: [intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ )],
                        typeCnName: ["出质人", "质权人"],
                        typeName: "type",
                        typeBasicNum: ["person_stock_pledgers_num", "person_stock_pledgees_num"]
                    },
                    modelNum: "person_stock_pledgers_num",
                    moreLink: "showPledgedstock02",
                    thWidthRadio: ["5%", "10%", "15%", "15%", "15%", "17%", "10%", "8%"],
                    thName: [intl('138741' /* 序号 */ ), intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ ), intl('138528' /* 出质股权标的企业 */ ), intl('205511' /* 质押数量（万股） */ ), intl('138143' /* 公示日期 */ ), intl('205512' /* 是否解押 */ ), intl('40513' /* 详情 */ )],
                    align: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    fields: ["NO.", "pledger_name", "pledgee_name", "plex_name", "amount", "announceDate", "isRelease", "reference_id"],
                    notVipTitle: intl('120664' /* 风险信息 */ ),
                    notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                    recordKey: 'person_stock_pledgers_num',
                },
                {
                    fn: "showPledgedstock02",
                    interface: "getpersonstockpledgees",
                    moduleName: intl('205471' /* 股票质押 */ ),
                    modelNum: "person_stock_pledgees_num",
                    moreLink: "showPledgedstock02",
                    thWidthRadio: ["5%", "10%", "15%", "15%", "15%", "17%", "10%", "8%"],
                    thName: [intl('138741' /* 序号 */ ), intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ ), intl('138528' /* 出质股权标的企业 */ ), intl('205511' /* 质押数量（万股） */ ), intl('138143' /* 公示日期 */ ), intl('205512' /* 是否解押 */ ), intl('40513' /* 详情 */ )],
                    align: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    fields: ["NO.", "pledger_name", "pledgee_name", "plex_name", "amount", "announceDate", "isRelease", "reference_id"],
                    notVipTitle: intl('120664' /* 风险信息 */ ),
                    notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                    recordKey: 'person_stock_pledgees_num',
                }
            ]
            var initIndex = index ? index : "0";
            if (initIndex == 0) {
                for (var i = 0; i < tableSetting.length; i++) {
                    var thisBasicNum = tableSetting[0].tabChange.typeBasicNum[i];
                    if (thisBasicNum && Person.personNum[thisBasicNum] && Person.personNum[thisBasicNum] != 0) {
                        break;
                    } else {
                        initIndex++;
                        if (initIndex >= tableSetting.length) {
                            initIndex = 0;
                        }
                    }
                }
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabequitypledgelist02", "tbodyequitypledgelist02", null, $dom, initIndex));
            var columnDefsSet = [
                [{
                        "targets": 1,
                        "data": 'pledger_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledger_id']) {
                                var personId = full.pledger_id;
                                var pingParam = '&fromModule=showPledgedstock02&entityAttribute=getpersonstockpledgers&fromField=出质人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 2,
                        "data": 'pledgee_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledgee_id']) {
                                var personId = full.pledgee_id;
                                var pingParam = '&fromModule=showPledgedstock02&entityAttribute=getpersonstockpledgers&fromField=质权人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 3,
                        "data": 'plex_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['plex_id']) {
                                var personId = full.plex_id;
                                var pingParam = '&fromModule=showPledgedstock02&entityAttribute=getpersonstockpledgers&fromField=出质股权标的企业&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 4,
                        "data": 'amount',
                        "render": function(data, type, full, meta) {
                            return Common.formatMoney(data, [4, '&nbsp;'])
                        }
                    },
                    {
                        "targets": 5,
                        "data": 'announceDate',
                        "render": function(data, type, full, meta) {
                            return Common.formatTime(data)
                        }
                    },
                    {
                        "targets": 6,
                        "data": 'isRelease',
                        "render": function(data) {
                            data = data ? '是' : '否';
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 7,
                        "data": 'reference_id',
                        "render": function(data, type, full, meta) {
                            return Common.showDetailLink(data, ["getpersonstockpledgersdetail", "detailId", 8]);
                        }
                    }
                ],
                [{
                        "targets": 1,
                        "data": 'pledger_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledger_id']) {
                                var personId = full.pledger_id;
                                var pingParam = '&fromModule=showPledgedstock02&entityAttribute=getpersonstockpledgees&fromField=出质人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 2,
                        "data": 'pledgee_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledgee_id']) {
                                var personId = full.ep_pawnee_id;
                                var pingParam = '&fromModule=showPledgedstock02&entityAttribute=getpersonstockpledgees&fromField=质权人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 3,
                        "data": 'plex_name',
                        "render": function(data, type, full, meta) {
                            if (data && full['plex_id']) {
                                var personId = full.plex_id;
                                var pingParam = '&fromModule=showPledgedstock02&entityAttribute=getpersonstockpledgees&fromField=出质股权标的&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 4,
                        "data": 'amount',
                        "render": function(data, type, full, meta) {
                            return Common.formatMoney(data, [4, '&nbsp;'])
                        }
                    },
                    {
                        "targets": 5,
                        "data": 'announceDate',
                        "render": function(data, type, full, meta) {
                            return Common.formatTime(data)
                        }
                    },
                    {
                        "targets": 6,
                        "data": 'isRelease',
                        "render": function(data) {
                            data = data ? '是' : '否';
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 7,
                        "data": 'reference_id',
                        "render": function(data, type, full, meta) {
                            return Common.showDetailLink(data, ["getpersonstockpledgeesdetail", "personId", 8]);
                        }
                    }
                ]

            ]

            var param = { "type": tableSetting[0].tabChange.typeCnName[initIndex], "personid": Person.userInfo.id };
            Person.pageSetting("#tabequitypledgelist02", tableSetting, columnDefsSet, param, $dom, initIndex);

            $('#tabequitypledgelist02').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        freezestock: function($dom) {
            //股权冻结
            var tableSetting = {
                interface: "getpersonjudicailassist",
                moduleName: intl('27496' /* 股权冻结 */ ),
                moreLink: "freezestock",
                modelNum: "person_judicail_assist_num",
                thWidthRadio: ["5%", "18%", "26%", "10%", "14%", "17%", "10%"],
                thName: [intl('138741' /* 序号 */ ), intl('209082' /* 执行通知文号 */ ), intl('138277' /* 股权所在企业 */ ), intl('138278' /* 股权数额 */ ), intl('138228' /* 执行法院 */ ), intl('30034' /* 类型 */ ), intl('138143' /* 公示日期 */ )],
                align: [0, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", "exe_notice_no", "corp_name", "stock_share", "exe_court", "status", "announce_date"],
                notVipTitle: intl('120664' /* 风险信息 */ ),
                notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                recordKey: 'person_judicail_assist_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabFreeze", "tbodyFreeze", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'exe_notice_no',
                    "render": function(data, type, full, meta) {
                        if (full.ob_object_id && full.corp_id) {
                            var paramVal = full.corp_id + "," + full.ob_object_id;
                            return '<a target="_blank" class="freeze-no underline wi-secondary-color wi-link-color" data-interface="' + 'judicailassistdetail' + '" data-key="' + 'windId' + '" data-tdlen="' + '7' + '" data-value="' + paramVal + '">' + (data ? data : '--') + '</a>'
                        } else {
                            return Common.formatCont(data)
                        }
                    }
                },
                {
                    "targets": 2,
                    "data": 'corp_name',
                    "render": function(data, type, full, meta) {
                        if (data && full['corp_id']) {
                            var personId = full.corp_id;
                            var pingParam = '&fromModule=freezestock&fromField=股权所在企业&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="freeze-company underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="freeze-company underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'stock_share',
                    "render": function(data) {
                        return Common.formatMoney(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'exe_court',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'status',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'announce_date',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var params = { "personid": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabFreeze", tableSetting, columnDefsSet, params, $dom);
            $('#tabFreeze').on('click', '.freeze-no', function() {
                Person.showContentDetail(this, 7)
                return false;
            });
            $('#tabFreeze').on('click', '.freeze-company', Person.linkWithCodeEventHandler);
        },
        finalcase: function($dom) {
            //终本案件
            var tableSetting = {
                interface: "appgetpersonfinalcase",
                moduleName: intl('216398' /* 终本案件*/ , '终本案件'),
                moreLink: "finalcase",
                modelNum: "person_final_case_list_num",
                thWidthRadio: ["5%", "28%", "26%", "10%", "14%", "17%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('138228' /* 执行法院 */ ), intl('216399' /* 终本日期 */ , '终本日期'), intl('216397' /* 执行标的(元) */ , '执行标的(元)'), intl('216401' /* 未履行金额 */ , '未履行金额(元)')],
                align: [0, 0, 0, 0, 0, 0],
                fields: ["NO.", "caseNumber", "courtOfExecution", "endDate", "executiveStandard", "outstandingMoney"],
                notVipTitle: intl('120664' /* 风险信息 */ ),
                notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                recordKey: 'person_final_case_list_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabFinalcase", "tbodyFinalcase", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'caseNumber',
                    "render": function(data, type, full, meta) {
                        if (full.caseId) {
                            var paramVal = full.caseId;
                            //showItemDetail.html?type=product&detailid=' + detailid
                            return '<a target="_blank" class="underline wi-secondary-color wi-link-color" href="showItemDetail.html?type=finalcase&detailid=' + paramVal + '">' + (data ? data : '--') + '</a>'
                        } else {
                            return Common.formatCont(data)
                        }
                    }
                },
                {
                    "targets": 2,
                    "data": 'courtOfExecution',
                    "render": function(data, type, full, meta) {
                        if (data && full['courtOfExecutionId']) {
                            var personId = full.courtOfExecutionId;
                            var pingParam = '&fromModule=finalcase&fromField=执行法院&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="finalcase-company underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="finalcase-company underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'endDate',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'executiveStandard',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 5,
                    "data": 'outstandingMoney',
                    "render": function(data, type, full, meta) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                }
            ]
            var params = { "executorId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabFinalcase", tableSetting, columnDefsSet, params, $dom);
            $('#tabFinalcase').on('click', '.finalcase-company', Person.linkWithCodeEventHandler);
        },
        getpersonsecuritiesdishonestinfo: function($dom) {
            //证券期货市场失信信息
            var tableSetting = {
                interface: "getpersonsecuritiesdishonestinfo",
                moduleName: intl('222484', '证券期货市场失信信息'),
                moreLink: "getpersonsecuritiesdishonestinfo",
                modelNum: "person_securities_dishonest_num",
                thWidthRadio: ["5%", "40%", "20%", "15%", "20%"],
                thName: [intl('138741' /* 序号 */ ), intl('222774', '处罚标题'), intl('138462', '处罚类别'), intl('138466', '处罚时间'), intl('138464', '处罚机关')],
                align: [0, 0, 0, 0, 0],
                fields: ["NO.", "title", "type", "time", "orgName"],
                notVipTitle: intl('120664' /* 风险信息 */ ),
                notVipTips: intl('222898', '购买VIP/SVIP套餐，即可不限次查询自然人的失信、被执行人、限制高消费等风险信息'),
                recordKey: 'person_securities_dishonest_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabgetpersonsecuritiesdishonestinfo", "tbodygetpersonsecuritiesdishonestinfo", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'title',
                    "render": function(data, type, full, meta) {
                        if (full.detailId) {
                            var paramVal = full.detailId;
                            return '<a target="_blank" class="underline wi-secondary-color wi-link-color" href="showItemDetail.html?type=securitiesDishonest&detailid=' + paramVal + '">' + (data ? data : '--') + '</a>'
                        } else {
                            return Common.formatCont(data)
                        }
                    }
                },
                {
                    "targets": 2,
                    "data": 'type',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'time',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'orgName',
                    "render": function(data, type, full, meta) {
                        var itemId = full.orgId ? full.orgId : '';
                        var otherCss = 'ZQSCSX-company';
                        var pingParam = '&fromModule=getpersonsecuritiesdishonestinfo&fromField=处罚机关&opId=' + itemId; //bury
                        return Common.jumpwithBury(data, itemId, otherCss, pingParam);
                    }
                },
            ]
            var params = { "personId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabgetpersonsecuritiesdishonestinfo", tableSetting, columnDefsSet, params, $dom);
            $('#tabgetpersonsecuritiesdishonestinfo').on('click', '.ZQSCSX-company', Person.linkWithCodeEventHandler);
        },
        getpersonbasicinfo: function() {
            //基本信息 
            myWfcAjax("getpersonbasicinfo", params, function(data) {
                var res = JSON.parse(data);
                //DEBUG
                //          	$(document.body).append('<script src="../resource/js/dataDemo.js?v=20191220"><\/script>');
                //              res = Demo.dataList('getpersonbasicinfo', null);
                var drawbasicTableMidle = function(itemKey, itemValue, cpNum, Ping) {
                    var widthKeyValue = Math.floor(100 / cpNum / 5 * 2) + '%';
                    var widthItemValue = Math.floor(100 / cpNum / 5 * 3) + '%';
                    var widthSpan = (100 - Math.floor(100 / cpNum / 5 * 2)) + '%';
                    var htmlArr = [];
                    var len = Math.ceil(itemKey.length / cpNum);
                    var isYushu = itemKey.length % cpNum != 0 ? true : false; //是否有余数,true代表有,有余数最后一行则需要合并表格

                    if (Ping) {
                        for (var dld = 0; dld < itemKey.length; dld++) {
                            var tmpHtml = "<tr><td width='" + widthKeyValue + "' class='tit-tab-basicInfo'>" + itemKey[dld] + "</td><td class='content-tab-basicInfo' width='" + widthSpan + "' colspan='" + (cpNum * 2 - 1) + "' class='dpawn_back'>" + itemValue[dld] + "</td></tr>";
                            htmlArr.push(tmpHtml);
                        }
                    } else {
                        for (var i = 0; i < len; i++) {
                            var tmpHtml = "";
                            if (i == len - 1 && isYushu) {
                                tmpHtml = "<tr><td width='" + widthKeyValue + "' class='tit-tab-basicInfo item-middle'>" + itemKey[i * cpNum] + "</td><td class='content-tab-basicInfo' colspan='" + (cpNum * 2 - 1) + "'>" + itemValue[i * cpNum] + "</td></tr>";
                            } else {
                                tmpHtml = '<tr>';
                                var tdHtml = '';
                                for (var n = 0; n < cpNum; n++) {
                                    tdHtml += '<td width="' + widthKeyValue + '" class="tit-tab-basicInfo">' + itemKey[i * cpNum + n] + '</td><td class="content-tab-basicInfo"  width="' + widthItemValue + '">' + itemValue[i * cpNum + n] + '</td>';
                                }
                                tmpHtml += tdHtml + '</tr>';
                            }
                            htmlArr.push(tmpHtml);
                        }
                    }
                    return htmlArr.join("");
                }
                if (res.Data && res.ErrorCode) {
                    //		        	$($dom).empty();
                    var item = res.Data[0];
                    var otherCss = '';
                    var htmlDivArr = [];
                    var gender = Common.formatCont(item.gender); //性别
                    var age = Common.formatCont(item.age); //年龄
                    var nationality = Common.formatCont(item.nationality); //国籍

                    var graduatedCollegeWindCode = item.graduatedCollegeWindCode ? item.graduatedCollegeWindCode : '';
                    var pingParam1 = '&fromModule=getpersonbasicinfo&fromField=毕业院校&opId=' + graduatedCollegeWindCode; //bury
                    var graduatedCollege = Common.jumpwithBury(item.graduatedCollege, graduatedCollegeWindCode, otherCss, pingParam1); //毕业院校


                    var majorStudied = Common.formatCont(item.majorStudied); //所学专业
                    var highestEducation = Common.formatCont(item.highestEducation); //最高学历

                    var workUnitWindCode = item.workUnitWindCode ? item.workUnitWindCode : '';
                    var pingParam2 = '&fromModule=getpersonbasicinfo&fromField=工作单位&opId=' + workUnitWindCode; //bury
                    var workUnit = Common.jumpwithBury(item.workUnit, workUnitWindCode, otherCss, pingParam2); //工作单位

                    var post = Common.formatCont(item.post); //职务
                    var workPhone = Common.formatCont(item.workPhone); //工作电话
                    var contactEmail = Common.formatCont(item.contactEmail); //联系邮箱
                    var contactAddress = Common.formatCont(item.contactAddress); //联系地址
                    var hometown = Common.formatCont(item.hometown); //家乡

                    //		            var itemKeySingle = [intl('15894', '性别'), intl('', '年龄'), intl('', '国籍'), intl('', '毕业院校'), intl('', '所学专业'), intl('', '最高学历'), intl('', '工作单位'), intl('138728', '职务'), intl('', '工作电话')];
                    //		            var itemKeyPing = [intl('140100', '联系邮箱'), intl('', '联系地址'), intl('', '家乡')];
                    //		            var itemValueSingle = [gender, age, nationality, graduatedCollege, majorStudied, highestEducation, workUnit, post, workPhone];
                    //		            var itemValuePing = [contactEmail, contactAddress, hometown];
                    //		            
                    //		            var list1 = drawbasicTableMidle(itemKeySingle, itemValueSingle, 3, false);
                    //		            var list2 = drawbasicTableMidle(itemKeyPing, itemValuePing, 3, true);
                    //		            
                    //		            htmlDivArr.push('<div class="widget-model"><div class="widget-header"><span class="fl">'+intl('','基本信息')+'</span></div><div class="table-container">');
                    //		            htmlDivArr.push('<table class="tab-basicInfo">');
                    //		            htmlDivArr.push('<tbody>');
                    //		            htmlDivArr.push(list1);
                    //		            htmlDivArr.push(list2);
                    //		            htmlDivArr.push('</tbody>');
                    //		            htmlDivArr.push('</table>');
                    //		            htmlDivArr.push('</div></div>');
                    //		            $($dom).html(htmlDivArr.join(""));

                    var itemValueList = [gender, age, nationality, graduatedCollege, majorStudied, highestEducation, workUnit, post, workPhone, contactEmail, contactAddress, hometown];
                    var itemKeyList = ['gender', 'age', 'nationality', 'graduatedCollege', 'majorStudied', 'highestEducation', 'workUnit', 'post', 'workPhone', 'contactEmail', 'contactAddress', 'hometown'];
                    for (var i = 0; i < itemKeyList.length; i++) {
                        $('#person-' + itemKeyList[i] + '-value').html(itemValueList[i]);
                    }

                } else {
                    $('#getpersonbasicinfo').hide();
                }
            });
            $('#getpersonbasicinfo').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        getpersonedubackground: function($dom) {
            //教育背景
            var tableSetting = {
                interface: "getpersonedubackground",
                moduleName: intl('74244', '教育背景'),
                moreLink: "getpersonedubackground",
                modelNum: "person_edu_background_num",
                thWidthRadio: ["5%", "13%", "31%", "17%", "17%", "17%"],
                thName: [intl('138741' /* 序号 */ ), intl('15972', '学历'), intl('222888', '毕业院校'), intl('222889', '所学专业'), intl('222891', '入学时间'), intl('222892', '毕业时间')],
                align: [0, 0, 0, 0, 0, 0],
                fields: ["NO.", "education", "graduatedCollege", "majorStudied", "admissionTime", "graduationTime"],
                notVipTitle: intl('222487', '人物百科'),
                notVipTips: intl('222899', '购买VIP/SVIP套餐，即可不限次查询自然人的教育背景、工作履历、获奖情况等信息'),
                recordKey: 'person_edu_background_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabgetpersonedubackground", "tbodygetpersonedubackground", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'education',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data);
                    }
                },
                {
                    "targets": 2,
                    "data": 'graduatedCollege',
                    "render": function(data, type, full, meta) {
                        var itemId = full.graduatedCollegeWindCode ? full.graduatedCollegeWindCode : '';
                        var otherCss = '';
                        var pingParam = '&fromModule=getpersonedubackground&fromField=毕业院校&opId=' + itemId; //bury
                        return Common.jumpwithBury(data, itemId, otherCss, pingParam);
                    }
                },
                {
                    "targets": 3,
                    "data": 'majorStudied',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'admissionTime',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'graduationTime',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
            ]
            var params = { "personId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabgetpersonedubackground", tableSetting, columnDefsSet, params, $dom);
            $('#tabgetpersonedubackground').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        getpersonworkexperience: function($dom) {
            //工作履历
            var tableSetting = {
                interface: "getpersonworkexperience",
                moduleName: intl('74243', '工作履历'),
                moreLink: "getpersonworkexperience",
                modelNum: "person_work_experience_num",
                thWidthRadio: ["5%", "30%", "13%", "13%", "13%", "26%"],
                thName: [intl('138741' /* 序号 */ ), intl('6192', '工作单位'), intl('138728', '职务'), intl('222893', '入职时间'), intl('206110', '离职时间'), intl('10647', '描述')],
                align: [0, 0, 0, 0, 0, 0],
                fields: ["NO.", "workUnit", "position", "entryTime", "departureTime", "description"],
                notVipTitle: intl('222487', '人物百科'),
                notVipTips: intl('222899', '购买VIP/SVIP套餐，即可不限次查询自然人的教育背景、工作履历、获奖情况等信息'),
                recordKey: 'person_work_experience_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabgetpersonworkexperience", "tbodygetpersonworkexperience", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'workUnit',
                    "render": function(data, type, full, meta) {
                        var itemId = full.workUnitWindCode ? full.workUnitWindCode : '';
                        var otherCss = '';
                        var pingParam = '&fromModule=getpersonworkexperience&fromField=工作单位&opId=' + itemId; //bury
                        return Common.jumpwithBury(data, itemId, otherCss, pingParam);
                    }
                },
                {
                    "targets": 2,
                    "data": 'position',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data);
                    }
                },
                {
                    "targets": 3,
                    "data": 'entryTime',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'departureTime',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'description',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
            ]
            var params = { "personId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabgetpersonworkexperience", tableSetting, columnDefsSet, params, $dom);
            $('#tabgetpersonworkexperience').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        getpersonawardinfo: function($dom) {
            //获奖信息
            var tableSetting = {
                interface: "getpersonaward",
                moduleName: intl('214749', '获奖信息'),
                moreLink: "getpersonawardinfo",
                modelNum: "person_award_num",
                thWidthRadio: ["5%", "40%", "40%", "15%"],
                thName: [intl('138741' /* 序号 */ ), intl('222894', '荣誉'), intl('222895', '颁发机构'), intl('222896', '获奖时间')],
                align: [0, 0, 0, 0, 0, 0],
                fields: ["NO.", "awardName", "orgName", "awardTime"],
                notVipTitle: intl('222487', '人物百科'),
                notVipTips: intl('222899', '购买VIP/SVIP套餐，即可不限次查询自然人的教育背景、工作履历、获奖情况等信息'),
                recordKey: 'person_award_num',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabgetpersonawardinfo", "tbodygetpersonawardinfo", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'awardName',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data);
                    }
                },
                {
                    "targets": 2,
                    "data": 'orgName',
                    "render": function(data, type, full, meta) {
                        var itemId = full.orgId ? full.orgId : '';
                        var otherCss = '';
                        var pingParam = '&fromModule=getpersonworkexperience&fromField=工作单位&opId=' + itemId; //bury
                        return Common.jumpwithBury(data, itemId, otherCss, pingParam);
                    }
                },
                {
                    "targets": 3,
                    "data": 'awardTime',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                },
            ]
            var params = { "personId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabgetpersonawardinfo", tableSetting, columnDefsSet, params, $dom);
            $('#tabgetpersonawardinfo').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        // 担任历史法人
        gethispersonallegalrep: function($dom) {
            var tableSetting = {
                interface: 'gethistorypersoncorp',
                moduleName: intl('214187' /* 历史担任法定代表人 */ ),
                moreLink: "gethispersonallegalrep",
                modelNum: "hisLegalRepNum",
                recordKey: 'hisLegalRepNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '20%', '15%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ )],
                align: [0, 0, 2, 0, 0, 0, 0, 0],
                fields: ["NO.", 'companyName', 'registeredCapital', 'TODO', 'area', 'industry', 'state', 'foundDate'],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabHisPersonalLegalrep", "tbodyHisPersonalLegalrep", false, $dom));

            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'companyName',
                    "render": function(data, type, full, meta) {
                        if (data && full['windCode']) {
                            var personId = full.windCode;
                            var pingParam = '&fromModule=gethispersonallegalrep&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'registeredCapital',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 4,
                    "data": 'area',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'state',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'foundDate',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var param = { "personid": Person.userInfo.id };
            Person.pageSetting("#tabHisPersonalLegalrep", tableSetting, columnDefsSet, param, $dom);
            $('#tabHisPersonalLegalrep').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        // 历史对外投资
        gethispersonalshareholder: function($dom) {
            var tableSetting = {
                interface: 'gethistorypersoninvest', //
                moduleName: intl('142472' /* 历史对外投资 */ ),
                moreLink: "gethispersonalshareholder",
                modelNum: "hisShareholderNum",
                recordKey: 'hisShareholderNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '15%', '10%', '10%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ ), intl('138871' /* 持股比例 */ )],
                align: [0, 0, 2, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", 'companyName', 'registeredCapital', 'TODO', 'area', 'industry', 'state', 'foundDate', 'stock'],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabHisPersonalShareholder", "tbodyHisPersonalShareholder", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'companyName',
                    "render": function(data, type, full, meta) {
                        if (data && full['windCode']) {
                            var personId = full.windCode;
                            var pingParam = '&fromModule=gethispersonalshareholder&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'registeredCapital',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 4,
                    "data": 'area',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'state',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'foundDate',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 8,
                    "data": 'stock',
                    "render": function(data, type, full, meta) {
                        return Common.formatPercent(data)
                    }
                }
            ]
            var param = { "personid": Person.userInfo.id };
            Person.pageSetting("#tabHisPersonalShareholder", tableSetting, columnDefsSet, param, $dom);
            $('#tabHisPersonalShareholder').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        // 历史在外任职
        gethispersonalposition: function($dom) {
            var tableSetting = {
                interface: 'gethistorypersonforeignjob', //
                moduleName: intl('214202' /* 在外任职 */ ),
                moreLink: "gethispersonalposition",
                modelNum: "hisMemberNum",
                recordKey: 'hisMemberNum',
                thWidthRadio: ["5%", '20%', '10%', '5%', '10%', '15%', '15%', '10%', '10%'],
                thName: [intl('138741' /* 序号 */ ), intl('138677' /* 企业名称 */ ), intl('138768' /* 注册资本(万元) */ ), '', intl('138930' /* 地区 */ ), intl('31801' /* 行业 */ ), intl('138772' /* 登记状态 */ ), intl('138860' /* 成立日期 */ ), intl('138728' /* 职务 */ )],
                align: [0, 0, 2, 0, 0, 0, 0, 0],
                fields: ["NO.", 'companyName', 'registeredCapital', 'TODO', 'area', 'industry', 'state', 'foundDate', 'duty'],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                ajaxSuccess: function(res) {
                    return res;
                }
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabHisPersonalPosition", "tbodyHisPersonalPosition", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'companyName',
                    "render": function(data, type, full, meta) {
                        if (data && full['windCode']) {
                            var personId = full.windCode;
                            var pingParam = '&fromModule=gethispersonalposition&fromField=名称&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'registeredCapital',
                    "render": function(data) {
                        return Common.formatMoney(data, [4, '&nbsp;'])
                    }
                },
                {
                    "targets": 4,
                    "data": 'area',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'industry',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'state',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 7,
                    "data": 'foundDate',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 8,
                    "data": 'duty',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                }
            ]
            var param = { "personid": Person.userInfo.id };
            Person.pageSetting("#tabHisPersonalPosition", tableSetting, columnDefsSet, param, $dom);
            $('#tabHisPersonalPosition').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        //历史被执行人
        gethispersonenforced: function($dom) {
            //被执行人
            var tableSetting = {
                interface: "gethistorypersonexecutor", //
                //dataFromList:true,//接口数据来源从Data.list来而不是Data
                moreLink: "gethispersonenforced",
                moduleName: intl('149492' /* 历史被执行人 */ ),
                modelNum: "hisPersonDebetorNum",
                thWidthRadio: ["5%", "25%", "30%", "29%", "11%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('138288' /* 执行标的 */ ), intl('138228' /* 执行法院 */ ), intl('138294' /* 立案时间 */ )],
                align: [0, 0, 0, 0, 0],
                fields: ["NO.", "caseNumber", "executiveStandard", "courtOfExecution", "filingTime"],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                recordKey: 'hisPersonDebetorNum',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabHisPersonenforced", "tbodyHisPersonenforced", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'caseNumber',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'executiveStandard',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'courtOfExecution',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'filingTime',
                    "render": function(data) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var params = { "executorId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabHisPersonenforced", tableSetting, columnDefsSet, params, $dom);
            $('#tabHisPersonenforced').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        //历史失信信息
        gethisdishonesty: function($dom) {
            //失信信息
            var tableSetting = {
                interface: "gethistorypersonbreakpromise", //
                moduleName: intl('205862' /* 历史失信信息 */ ),
                moreLink: "gethisdishonesty",
                modelNum: "hisPromiseNum",
                thWidthRadio: ["5%", "22%", "10%", "26%", "14%", "13%", "10%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('138435' /* 被执行人的履行情况 */ ), intl('138512' /* 行为具体情形 */ ), intl('138228' /* 执行法院 */ ), intl('138294' /* 立案时间 */ ), intl('132647' /* 操作 */ )],
                align: [0, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", "caseNumber", "performance", "specificCircumstances", "courtOfExecution", "filingTime", "breakFaithId|showDetailLink:appgetpersonbreakpromisedetail,breakFaithId,7"],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                recordKey: 'hisPromiseNum',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabHisDishonesty", "tbodyHisDishonesty", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'caseNumber',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 2,
                    "data": 'performance',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'specificCircumstances',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'courtOfExecution',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'filingTime',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'detailId',
                    "render": function(data, type, full, meta) {
                        return Common.showDetailLink(data, ["appgetpersonbreakpromisedetail", "detailId", 7]);
                    }
                }
            ]
            var params = { "executorId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabHisDishonesty", tableSetting, columnDefsSet, params, $dom);
            $('#tabHisDishonesty').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        //历史限制高消费
        hislimitConsumption: function($dom) {
            //限制高消费
            var tableSetting = {
                interface: "gethistorypersonconsumption", //
                moduleName: intl('214203' /* 限制高消费 */ ),
                moreLink: "hislimitConsumption",
                modelNum: "hisConsumptionNum",
                thWidthRadio: ["5%", "20%", "20%", "25%", "15%", "15%"],
                thName: [intl('138741' /* 序号 */ ), intl('138190' /* 案号 */ ), intl('209065' /* 限制消费人员姓名 */ ), intl('209066' /* 限制消费人员所属企业 */ ), intl('209067' /* 颁布法院 */ ), intl('138294' /* 立案时间 */ )],
                align: [0, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", "caseNumber", "personName", "ownerCompany", "issueCourt", "caseDate"],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                recordKey: 'hisConsumptionNum',
            }
            var $container = $dom ? $dom : $('#workspace');
            console.log($container)
            $container.empty().html(Person.drawTab(tableSetting, "tabHisLimit", "tbodyHisLimit", false, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'caseNumber',
                    "render": function(data, type, full, meta) {
                        if (full.path && data) {
                            var preStr = "http://news.windin.com/ns/imagebase/6767/"
                            return '<a class="wi-secondary-color wi-link-color" target="_blank" href="' + preStr + full.path + '">' + data + '</a>'
                        } else {
                            return Common.formatCont(data)
                        }
                    }
                },
                {
                    "targets": 2,
                    "data": 'personName',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'ownerCompany',
                    "render": function(data, type, full, meta) {
                        if (data && full.ownerCompanyID) {
                            var personId = full.ownerCompanyID;
                            var pingParam = '&fromModule=hislimitConsumption&fromField=限制消费企业&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'issueCourt',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'caseDate',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var params = { "personId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabHisLimit", tableSetting, columnDefsSet, params, $dom);
            $('#tabHisLimit').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        //历史股权出质
        showHisPledgedstock: function($dom, index) {
            //股权出质 
            var tableSetting = [{
                    fn: "showHisPledgedstock",
                    interface: "gethistorypersonpledgor", //
                    moduleName: intl('205868' /* 历史股权出质 */ ),
                    tabChange: {
                        type: [intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ )],
                        typeCnName: ["出质人", "质权人"],
                        typeName: "type",
                        typeBasicNum: ["hisPersonPledgorNum", "hisPersonPawneeNum"],
                        typeQueryParam: ['pledgorId', 'pledgeeId'],
                    },
                    modelNum: "hisPersonPledgorNum",
                    moreLink: "showHisPledgedstock",
                    thWidthRadio: ["5%", "17%", "10%", "15%", "15%", "15%", "10%", "8%"],
                    thName: [intl('138741' /* 序号 */ ), intl('138769' /* 登记编号 */ ), intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ ), intl('138528' /* 出质股权标的企业 */ ), intl('138283' /* 出质股权数额（万元） */ ), intl('138248' /* 出质登记日期 */ ), intl('32098' /* 状态 */ )],
                    align: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    fields: ["NO.", "registerCode", "pledgor", "pledgee", "companyName", "pledgeAmount", "pledgeDate", "registerStatus"],
                    notVipTitle: intl('209063' /* 历史信息 */ ),
                    notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                    recordKey: 'hisPersonPledgorNum',
                },
                {
                    fn: "showHisPledgedstock",
                    interface: "gethistorypersonpledgee", //
                    moduleName: intl('205868' /* 股权出质 */ ),
                    modelNum: "hisPersonPawneeNum",
                    moreLink: "showHisPledgedstock",
                    thWidthRadio: ["5%", "17%", "10%", "15%", "15%", "15%", "10%", "8%"],
                    thName: [intl('138741' /* 序号 */ ), intl('138769' /* 登记编号 */ ), intl('138447' /* 出质人 */ ), intl('138446' /* 质权人 */ ), intl('138528' /* 出质股权标的企业 */ ), intl('138283' /* 出质股权数额（万元） */ ), intl('138248' /* 出质登记日期 */ ), intl('32098' /* 状态 */ )],
                    align: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    fields: ["NO.", "registerCode", "pledgor", "pledgee", "companyName", "pledgeAmount", "pledgeDate", "registerStatus"],
                    notVipTitle: intl('209063' /* 历史信息 */ ),
                    notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                    recordKey: 'hisPersonPawneeNum',
                }
            ]
            var initIndex = index ? index : "0";
            if (initIndex == 0) {
                for (var i = 0; i < tableSetting.length; i++) {
                    var thisBasicNum = tableSetting[0].tabChange.typeBasicNum[i];
                    if (thisBasicNum && Person.personNum[thisBasicNum] && Person.personNum[thisBasicNum] != 0) {
                        break;
                    } else {
                        initIndex++;
                        if (initIndex >= tableSetting.length) {
                            initIndex = 0;
                        }
                    }
                }
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabhisequitypledgelist", "tbodyhisequitypledgelist", null, $dom, initIndex));
            var columnDefsSet = [
                [{
                        "targets": 1,
                        "data": 'registerCode',
                        "render": function(data, type, full, meta) {
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 2,
                        "data": 'pledgor',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledgorId']) {
                                var personId = full.pledgorId;
                                var pingParam = '&fromModule=showHisPledgedstock&entityAttribute=gethistorypersonpledgor&fromField=出质人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 3,
                        "data": 'pledgee',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledgeeId']) {
                                var personId = full.pledgeeId;
                                var pingParam = '&fromModule=showHisPledgedstock&entityAttribute=gethistorypersonpledgor&fromField=质权人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 4,
                        "data": 'companyName',
                        "render": function(data, type, full, meta) {
                            if (data && full['windCode']) {
                                var personId = full.windCode;
                                var pingParam = '&fromModule=showHisPledgedstock&entityAttribute=gethistorypersonpledgor&fromField=出质股权标的&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 5,
                        "data": 'pledgeAmount',
                        "render": function(data, type, full, meta) {
                            return Common.formatMoney(data, [4, '&nbsp;'])
                        }
                    },
                    {
                        "targets": 6,
                        "data": 'pledgeDate',
                        "render": function(data, type, full, meta) {
                            return Common.formatTime(data)
                        }
                    },
                    {
                        "targets": 7,
                        "data": 'registerStatus',
                        "render": function(data) {
                            return Common.formatCont(data)
                        }
                    }
                ],
                [{
                        "targets": 1,
                        "data": 'registerCode',
                        "render": function(data, type, full, meta) {
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 2,
                        "data": 'pledgor',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledgeId']) {
                                var personId = full.pledgeId;
                                var pingParam = '&fromModule=showHisPledgedstock&entityAttribute=gethistorypersonpledgee&fromField=出质人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 3,
                        "data": 'pledgee',
                        "render": function(data, type, full, meta) {
                            if (data && full['pledgeeId']) {
                                var personId = full.pledgeeId;
                                var pingParam = '&fromModule=showHisPledgedstock&entityAttribute=gethistorypersonpledgee&fromField=质权人&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 4,
                        "data": 'companyName',
                        "render": function(data, type, full, meta) {
                            if (data && full['windCode']) {
                                var personId = full.windCode;
                                var pingParam = '&fromModule=showHisPledgedstock&entityAttribute=gethistorypersonpledgee&fromField=出质股权标的&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                } else {
                                    return '<a class="underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                                }
                            }
                            return Common.formatCont(data)
                        }
                    },
                    {
                        "targets": 5,
                        "data": 'pledgeAmount',
                        "render": function(data, type, full, meta) {
                            return Common.formatMoney(data, [4, '&nbsp;'])
                        }
                    },
                    {
                        "targets": 6,
                        "data": 'pledgeDate',
                        "render": function(data, type, full, meta) {
                            return Common.formatTime(data)
                        }
                    },
                    {
                        "targets": 7,
                        "data": 'registerStatus',
                        "render": function(data) {
                            return Common.formatCont(data)
                        }
                    }
                ]

            ]
            var param = { "type": tableSetting[0].tabChange.typeCnName[initIndex], "pledgorId": Person.userInfo.id };
            if (initIndex == 1) {
                param = { "type": tableSetting[0].tabChange.typeCnName[initIndex], "pledgeeId": Person.userInfo.id };

            }
            Person.pageSetting("#tabhisequitypledgelist", tableSetting, columnDefsSet, param, $dom, initIndex);

            $('#tabhisequitypledgelist').off('click').on('click', '.underline', Person.linkWithCodeEventHandler);
        },
        //历史股权冻结
        hisfreezestock: function($dom) {
            //股权冻结
            var tableSetting = {
                interface: "gethistorypersonequityfreeze", //
                moduleName: intl('214204' /* 股权冻结 */ ),
                moreLink: "hisfreezestock",
                modelNum: "hisPersonJudicailAssistNum",
                thWidthRadio: ["5%", "18%", "26%", "10%", "14%", "17%", "10%"],
                thName: [intl('138741' /* 序号 */ ), intl('209082' /* 执行通知文号 */ ), intl('138277' /* 股权所在企业 */ ), intl('138278' /* 股权数额 */ ), intl('138228' /* 执行法院 */ ), intl('30034' /* 类型 */ ), intl('138143' /* 公示日期 */ )],
                align: [0, 0, 0, 0, 0, 0, 0],
                fields: ["NO.", "docNumber", "locatedCompanyName", "equityAmount", "court", "type", "publishDate"],
                notVipTitle: intl('209063' /* 历史信息 */ ),
                notVipTips: intl('222900', '购买VIP/SVIP套餐，即可不限次查询自然人的历史对外投资、历史在外任职、历史失信等信息'),
                recordKey: 'hisPersonJudicailAssistNum',
            }
            var $container = $dom ? $dom : $('#workspace');
            $container.empty().html(Person.drawTab(tableSetting, "tabHisFreeze", "tbodyHisFreeze", true, $dom));
            var columnDefsSet = [{
                    "targets": 1,
                    "data": 'docNumber',
                    "render": function(data, type, full, meta) {
                        if (full.windCode && full.innerCode) {
                            var paramVal = full.windCode + "," + full.innerCode;
                            return '<a target="_blank" class="freeze-no underline wi-secondary-color wi-link-color" data-interface="' + 'judicailassistdetail' + '" data-key="' + 'windId' + '" data-tdlen="' + '7' + '" data-value="' + paramVal + '">' + (data ? data : '--') + '</a>'
                        } else {
                            return Common.formatCont(data)
                        }
                    }
                },
                {
                    "targets": 2,
                    "data": 'locatedCompanyName',
                    "render": function(data, type, full, meta) {
                        if (data && full['windCode']) {
                            var personId = full.windCode;
                            var pingParam = '&fromModule=hisfreezestock&fromField=股权所在企业&opId=' + personId; //bury
                            if (personId.length < 16) {
                                return '<a class="freeze-company underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Company.html?companycode=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            } else {
                                return '<a class="freeze-company underline wi-secondary-color wi-link-color" data-code="' + personId + '" data-name="' + data + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data) + '</a>';
                            }
                        }
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 3,
                    "data": 'equityAmount',
                    "render": function(data) {
                        return Common.formatMoney(data)
                    }
                },
                {
                    "targets": 4,
                    "data": 'court',
                    "render": function(data) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 5,
                    "data": 'type',
                    "render": function(data, type, full, meta) {
                        return Common.formatCont(data)
                    }
                },
                {
                    "targets": 6,
                    "data": 'publishDate',
                    "render": function(data, type, full, meta) {
                        return Common.formatTime(data)
                    }
                }
            ]
            var params = { "executedPersonId": Person.userInfo.id, "PageSize": 10 };
            Person.pageSetting("#tabHisFreeze", tableSetting, columnDefsSet, params, $dom);
            $('#tabHisFreeze').on('click', '.freeze-no', function() {
                Person.showContentDetail(this, 7)
                return false;
            });
            $('#tabHisFreeze').on('click', '.freeze-company', Person.linkWithCodeEventHandler);
        },
        /**
         * 使用code跳转
         */
        linkWithCodeEventHandler: function(e) {
            var target = e.target;
            var code = $(target).attr('data-code');
            var name = $(target).attr('data-name');
            var type = $(target).attr('data-type');
            var buryParam = $(target).attr('data-pingParam') ? $(target).attr('data-pingParam') : '';
            if (code && code.length) {
                if (code.length < 16) {
                    Common.linkCompany('Bu3', code, null, null, buryParam); //bury
                    //	                Common.linkCompany('Bu3', code);
                } else {
                    if (buryParam.indexOf('fromPageUId') == -1) {
                        buryParam = buryParam + '&fromPageUId=' + buryFCode.getPageUId();
                    }
                    if (type) {
                        window.open('Person.html?id=' + code + '&name=' + name + buryParam + '#' + type);
                    } else {
                        window.open('Person.html?id=' + code + '&name=' + name + buryParam);
                    }

                }
            }
            return false;
        },
        drawTab: function(tableSetting, tableId, tbodyId, noloading, $dom, oIndex) {
            //画表头
            var tableHtmlArr = [];
            var tabStr = ""
            if (oIndex == 0 || oIndex) {
                var firstTableSetting = tableSetting[0];
                var oldtableSetting = tableSetting;
                tableSetting = tableSetting[oIndex];
                var tabStrArr = [];
                tabStrArr.push('<div class="fl tab-style" data-fn="' + firstTableSetting.fn + '">');
                var tabChange = firstTableSetting.tabChange;
                if (tabChange) {
                    for (var i = 0; i < tabChange.type.length; i++) {
                        var eachBasicNum = tabChange.typeBasicNum[i];
                        if (eachBasicNum && Person.personNum[eachBasicNum] && Person.personNum[eachBasicNum] != 0) {
                            if (oIndex == i) {
                                tabStrArr.push('<a class="tab-second-style wi-secondary-color" data-fn="' + oldtableSetting[i].fn + '" data-index="' + i + '">' + tabChange.type[i] + '(' + Person.personNum[eachBasicNum] + ')' + '</a>')
                            } else {
                                tabStrArr.push('<a class="tab-second-style" data-fn="' + oldtableSetting[i].fn + '" data-index="' + i + '">' + tabChange.type[i] + '(' + Person.personNum[eachBasicNum] + ')' + '</a>')
                            }

                        } else {
                            if (oIndex == i) {
                                tabStrArr.push('<a class="nojump wi-secondary-color tab-second-style" data-fn="' + oldtableSetting[i].fn + '" data-index="' + i + '">' + tabChange.type[i] + '(0)</a>')
                            } else {
                                tabStrArr.push('<a class="nojump tab-second-style" data-fn="' + oldtableSetting[i].fn + '" data-index="' + i + '">' + tabChange.type[i] + '(0)</a>')
                            }
                        }
                    }
                }
                tabStrArr.push("</div>");
                tabStr = tabStrArr.join("");
            }
            //单项下载

            var downloadDateStr = "";
            if(Person.isVip){
                var downLoadName = $("#companyNameText").text() || decodeURIComponent(Common.getUrlSearch('companyname'));
                switch (tableId) {
                    case "tabAllCompany": //全部企业
                        downloadDateStr = '<span class="singleDownload" data-type="personallcompany" data-name="' + intl('138651' /* 全部企业 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabPersonalLegalrep": //担任法人
                        downloadDateStr = '<span class="singleDownload" data-type="personcorp" data-name="' + intl('138160' /* 担任法人 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabPersonalShareholder": //对外投资
                        downloadDateStr = '<span class="singleDownload" data-type="personinvest" data-name="' + intl('138724' /* 对外投资 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabPersonalPosition": //在外任职
                        downloadDateStr = '<span class="singleDownload" data-type="personincharge" data-name="' + intl('138525' /* 在外任职 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabRealCtrl": //实际控制
                        downloadDateStr = '<span class="singleDownload" data-type="personcontrolled" data-name="' + intl('138125' /* 实际控制 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabPersonenforced": //被执行人
                        downloadDateStr = '<span class="singleDownload" data-type="persondebetor" data-name="' + intl('138592' /* 被执行人 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabDishonesty": //失信信息
                        downloadDateStr = '<span class="singleDownload" data-type="personbreakpromise" data-name="' + intl('138591' /* 失信信息 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabLimit": //限制高消费
                        downloadDateStr = '<span class="singleDownload" data-type="personconsumption" data-name="' + intl('209064' /* 限制高消费 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabFinalcase": //终本案件
                        downloadDateStr = '<span class="singleDownload" data-type="personfinalcase" data-name="' + intl('216398' /* 终本案件*/ , '终本案件') + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabgetpersonsecuritiesdishonestinfo": //证券期货市场失信信息
                        downloadDateStr = '<span class="singleDownload" data-type="personsecuritiesdishonestinfo" data-name="' + intl('222484', '证券期货市场失信信息') + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabHisPersonalLegalrep": // 担任历史法人
                        downloadDateStr = '<span class="singleDownload" data-type="personhislegalrepres" data-name="' + intl('214187' /* 历史担任法定代表人 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabHisPersonalPosition": //在外任职
                        downloadDateStr = '<span class="singleDownload" data-type="personhistakeoffice" data-name="' + intl('214202' /* 在外任职 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabHisPersonalShareholder": //历史对外投资
                        downloadDateStr = '<span class="singleDownload" data-type="personhisinvest" data-name="' + intl('142472' /* 历史对外投资 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabHisPersonenforced": //历史被执行人
                        downloadDateStr = '<span class="singleDownload" data-type="personhisexcutedpers" data-name="' + intl('149492' /* 历史被执行人 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabHisDishonesty": //历史失信信息
                        downloadDateStr = '<span class="singleDownload" data-type="personhisbreakpromis" data-name="' + intl('205862' /* 历史失信信息 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                    case "tabHisLimit": //历史限制高消费
                        downloadDateStr = '<span class="singleDownload" data-type="personhislimithighfe" data-name="' + intl('214203' /* 限制高消费 */ ) + '">' + intl("4698" /* 导出数据 */ ) + '</span>' + Person.vipTips;
                        break;
                }
            }
            var numStr = '<span class="fl modle-num">(0)</span>'
            var vipTips = tableSetting.notVipTitle ? '<span class="fl module-vip-tips" title="您正在使用付费高级功能"><i>' + intl('209302' /* 高级功能 */ ) + '</i></span>' : '';
            tableHtmlArr.push('<div class="widget-model"><div class="widget-header"><span class="fl">' + tableSetting.moduleName + '</span>' + numStr + vipTips + tabStr + downloadDateStr + '</div>');
            var tableId = tableId ? tableId : "tabCompany";
            tableHtmlArr.push('<div class="table-container"><table id="' + tableId + '" class="table-company"><thead><tr>');
            var len = tableSetting.thWidthRadio.length;
            for (var i = 0; i < len; i++) {
                var alignStr = "left";
                var itemArr = String(tableSetting.align[i]).split("|")
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
                tableHtmlArr.push('<th align="' + alignStr + '" class="' + classStr + '" width="' + tableSetting.thWidthRadio[i] + '">' + tableSetting.thName[i] + '</th>')
            }
            var tbodyId = tbodyId ? tbodyId : "tabContent";
            var loadingStr = noloading ? "" : '<div class="tab-loading"><span class="loading-text-style">加载中...</span></div>';
            tableHtmlArr.push('</tr></thead><tbody id="' + tbodyId + '"><tr><td colspan="' + len + '" class="loading-td">' + loadingStr + '</td></tr></tbody></table><div class="M-box"></div></div></div>');
            return tableHtmlArr.join("");
        },
        showContentDetail: function(dom, tdlen, change) {
            //显示详细页
            var $main = $(".show-main");
            var bandClass = '';
            if ($main.length >= 1 && $(dom).parents("tr").next("tr").find(".show-main").length >= 1) {
                $main.parents("tr").remove();
            } else {
                $main.parents("tr").remove();
                if (change) {
                    bandClass = 'no-sideborder';
                } else {
                    bandClass = 'base-no-sideborder';
                }
                $(dom).parents("tr").after("<tr><td colspan='" + tdlen + "' class='" + bandClass + "'><div id='main' class='show-main clear-border '><div class='loading-data'><img src='../resource/images/Company/loading.gif' />" + intl('139612' /* 数据加载中... */ ) + "</div></div></td></tr>");
                var key = $(dom).attr("data-key");
                var value = $(dom).attr("data-value");
                var interfaceStr = $(dom).attr("data-interface");
                var parameter = new Object();
                parameter["personid"] = Person.userInfo.id;
                parameter[key] = value;
                myWfcAjax(interfaceStr, parameter, function(data) {
                    var data = JSON.parse(data);
                    if (data.ErrorCode == 0) {
                        Person.showDetailContent(interfaceStr, data.Data);
                    } else {
                        $("#main").html('<div class="no-data">' + intl('132725' /* 暂无数据 */ ) + '</div>');
                    }
                })
            }
        },
        showDetailContent: function(interfaceStr, data) {
            var data = data;
            if (data instanceof Array && interfaceStr != "getrankedcompany" && interfaceStr != "getspotcheckdetail") {
                data = data[0];
            }
            var tableHtml = '<table class="show-table"><tbody id="tbody-detail"></tbody></table>';
            $("#main").html(tableHtml);
            var $tbody = $("#tbody-detail");
            if (!data) {
                $tbody.html('<tr><td><div class="no-data">' + intl('132725' /* 暂无数据 */ ) + '</div></td></tr>');
                return false;
            }

            switch (interfaceStr) {
                case "appgetpersonbreakpromisedetail":
                    //失信信息
                    var itemKey = [intl('153534', '失信被执行人'), intl('153393', '身份证号码/组织机构代码'), intl('138228' /* 执行法院 */ ), intl('138435' /* 被执行人的履行情况 */ ), intl('34378' /* 省份 */ ), intl('138286' /* 执行依据文号 */ ), intl('138294' /* 立案时间 */ ), intl('138190' /* 案号 */ ), intl('138250' /* 作出执行单位 */ ), intl('138774' /* 发布时间 */ )];
                    var executedPersonName = data.executedPersonName ? data.executedPersonName : "--";
                    var organizationCode = data.organizationCode ? data.organizationCode : "--";
                    var court = data.court ? data.court : "--";
                    var performance = data.performance ? data.performance : "--";
                    var province = data.province ? data.province : "--";
                    var documentNumber = data.documentNumber ? data.documentNumber : "--";
                    var filingTime = data.filingTime ? data.filingTime : "--";
                    var caseNumber = data.caseNumber ? data.caseNumber : "--";
                    var unit = data.unit ? data.unit : "--";
                    var releaseTime = data.releaseTime ? data.releaseTime : "--";
                    var behavior = data.behavior ? data.behavior : "--";
                    var duty = data.duty ? data.duty : "--";
                    var itemValue = [executedPersonName, organizationCode, court, performance, province, documentNumber, filingTime, caseNumber, unit, releaseTime];
                    var htmlArr = [];
                    var mainHtml = this.displayTable(itemKey, itemValue);
                    htmlArr.push(mainHtml);
                    htmlArr.push("<tr><td width='20%' class='title-item'>" + intl('138261' /* 具体情形 */ ) + "</td><td colspan=3>" + behavior + "</td></tr>");
                    htmlArr.push("<tr><td width='20%' class='title-item'>" + intl('138256' /* 生效法律文书确定的义务 */ ) + "</td><td colspan=3>" + duty + "</td></tr>");
                    $tbody.html(htmlArr.join(""));
                    break;
                case "getpersonstockpledgeesdetail":
                case "getpersonstockpledgersdetail":
                    //股票质押详情
                    var itemKey = [intl('138447' /*出质人*/ ), intl('138446' /*质权人*/ ), intl('138528' /*出质股权标的企业*/ ), intl('205511' /*质押数量(万股)*/ ), intl('205515' /*质押起始时间*/ ), intl('205514' /*质押结束时间*/ ), intl('205513' /*是否股权质押回购*/ ), intl('138143' /*公示日期*/ ), intl('205512' /*是否解押*/ ), intl('205464' /*解押日期*/ ), ];
                    var pledger_id = data.pledgeeId ? data.pledgeeId : ''; //出质人id
                    var pledgee_id = data.pledgerId ? data.pledgerId : ''; //质权人id
                    var plex_id = data.plexId ? data.plexId : ''; //出质标的企业id
                    var pledgor = data.pledgee ? data.pledgee : '--'; //出质人
                    pledgor = pledger_id ? Common.jumpPersonOrCompany(pledgor, pledger_id) : pledgor; //出质人跳转
                    var pledgee = data.pledger ? data.pledger : '--'; //质权人
                    pledgee = pledgee_id ? Common.jumpPersonOrCompany(pledgee, pledgee_id) : pledgee; //质权人跳转
                    var outCom = data.plex ? data.plex : '--'; //出质股权标的企业
                    outCom = plex_id ? Common.jumpPersonOrCompany(outCom, plex_id) : outCom; //出质标的企业跳转
                    var pledgeNum = data.amount ? data.amount : '--'; //质押数量
                    var pledgeStartDate = data.startTime ? Common.formatTime(data.startTime) : '--'; //质押起始时间
                    var pledgeEndDate = data.endTime ? Common.formatTime(data.endTime) : '--'; //质押结束时间
                    var pledgeBack = data.isBuyback ? '是' : '否'; //是否股权质押回购
                    var pubDate = data.announceDate ? Common.formatTime(data.announceDate) : '--'; //公示日期
                    var soluPledge = data.isRelease ? '是' : '否'; //是否解押
                    var soluPledgeData = data.releaseDate ? Common.formatTime(data.releaseDate) : '--'; //解押日期
                    var tips = data.brief ? data.brief : '--'; //相关说明
                    var itemValue = [pledgor, pledgee, outCom, pledgeNum, pledgeStartDate, pledgeEndDate, pledgeBack, pubDate, soluPledge, soluPledgeData];
                    var htmlArr = [];
                    var mainHtml = this.displayTable(itemKey, itemValue);
                    htmlArr.push(mainHtml);
                    htmlArr.push("<tr><td width='20%' class='title-item'>" + intl('205465' /* 相关说明 */ ) + "</td><td colspan=3>" + tips + "</td></tr>");
                    $tbody.html(htmlArr.join(""));
                    //                  $('#main a').removeClass('underline');
                    $('#main').on('click', '.underline', Person.linkWithCodeEventHandler);
                    break;
                case "judicailassistdetail": //司法协助详情
                    var itemKeys = [intl('138228' /* 执行法院 */ ), intl('138336' /* 执行事项 */ ), intl('149982', '执行裁定文书号'), intl('138523' /* 执行通知书文号 */ ), intl('138592' /* 被执行人 */ ), intl('138616' /* 被执行人持有股权、其它投资权益的数额 */ )];
                    var itemOne = [intl('138307' /* 冻结期限自 */ ), intl('138308' /* 冻结期限至 */ ), intl('138306' /* 冻结期限 */ ), intl('138143' /* 公示日期 */ ), intl('138277' /* 股权所在企业 */ )];
                    var itemTwo = [intl('138238' /* 解除冻结日期 */ ), intl('138143' /* 公示日期 */ )];
                    var itemThree = [intl('138290' /* 失效原因 */ ), intl('138291' /* 失效时间 */ ), intl('138143' /* 公示日期 */ )];
                    var itemFour = [intl('138163' /* 受让人 */ ), intl('138330' /* 受让人证件类型 */ ), intl('138333' /* 受让人证件号码 */ ), intl('138143' /* 公示日期 */ )];
                    var state = data.status || '冻结';
                    if (state) {
                        if (state.indexOf("解除冻结") >= 0 || state.indexOf("解冻") >= 0) {
                            state = "解除冻结";
                        } else if (state.indexOf("冻结") >= 0) {
                            state = "冻结";
                        } else if (state.indexOf("失效") >= 0) {
                            state = "变更";
                        } else if (state.indexOf("变更") >= 0) {
                            state = "股权变更"
                        } else {
                            state = '冻结';
                        }
                    } else {
                        state = '冻结';
                    }
                    var stateObjs = { '冻结': 1, '部分股权冻结': 1, '全部股权冻结': 1, '续行冻结等': 1, '解除冻结': 2, '续行解除冻结': 2, '已解冻': 2, '失效': 3, '续行失效': 3, '股权变更': 4 };
                    var val = stateObjs[state];

                    var displayKey = itemKeys;
                    var exe_court = data.exe_court ? data.exe_court : "--";
                    var exe_item = data.exe_item ? data.exe_item : "--";
                    var exe_notice_no = data.exe_notice_no ? data.exe_notice_no : "--";
                    var exe_ruling_no = data.exe_ruling_no ? data.exe_ruling_no : "--";
                    var executed_person = data.executed_person ? data.executed_person : "--";
                    var stock_share = data.stock_share ? data.stock_share + '万' + (data.currency ? data.currency : '') : "--";
                    var displayVal = [exe_court, exe_item, exe_ruling_no, exe_notice_no, executed_person, stock_share];
                    switch (val) {
                        case 1:
                            displayKey = displayKey.concat(itemOne);
                            var start_freeze_date = Common.formatTime(data.start_freeze_date);
                            var end_freeze_date = Common.formatTime(data.end_freeze_date);
                            var freeze_due_date = Common.formatTime(data.freeze_due_date);
                            var announce_date = Common.formatTime(data.announce_date);
                            var belong_corp_name = data.belong_corp_name || '--';
                            if (data.belong_corp) {
                                var personId = data.belong_corp;
                                var pingParam = '&fromModule=hisfreezestock&fromField=股权所在企业&opId=' + personId; //bury
                                if (personId.length < 16) {
                                    belong_corp_name = '<a class="underline wi-secondary-color wi-link-color freeze-company" data-code="' + personId + '" data-name="' + data.belong_corp_name + '" target="_blank" href="Company1.html?companycode=' + personId + '&name=' + data.belong_corp_name + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data.belong_corp_name) + '</a>';
                                } else {
                                    belong_corp_name = '<a class="underline wi-secondary-color wi-link-color freeze-company" data-code="' + personId + '" data-name="' + data.belong_corp_name + '" target="_blank" href="Person.html?id=' + personId + '&name=' + data.belong_corp_name + Common.isNoToolbar() + '" data-pingParam="' + pingParam + '">' + Common.formatCont(data.belong_corp_name) + '</a>';
                                }
                            }
                            displayVal = displayVal.concat([start_freeze_date, end_freeze_date, freeze_due_date, announce_date, belong_corp_name]);
                            var htmlArr = [];
                            var mainHtml = this.displayTable(displayKey, displayVal);
                            htmlArr.push(mainHtml);
                            $tbody.html(htmlArr.join(""));
                            $('#tbodyHisFreeze').on('click', '.freeze-company', Person.linkWithCodeEventHandler);
                            break;
                        case 2:
                            displayKey = displayKey.concat(itemTwo);
                            var freeze_period = data.freeze_period || '--';
                            var announce_date = Common.formatTime(data.announce_date);
                            displayVal = displayVal.concat([freeze_period, announce_date]);
                            var htmlArr = [];
                            var mainHtml = this.displayTable(displayKey, displayVal);
                            htmlArr.push(mainHtml);
                            $tbody.html(htmlArr.join(""));
                            break;
                        case 3:
                            displayKey = displayKey.concat(itemThree);
                            var invalid_reason = data.invalid_reason || '--';
                            var invalid_time = data.invalid_time || '--';
                            var announce_date = Common.formatTime(data.announce_date);
                            displayVal = displayVal.concat([invalid_reason, invalid_time, announce_date]);
                            var htmlArr = [];
                            var mainHtml = this.displayTable(displayKey, displayVal);
                            htmlArr.push(mainHtml);
                            $tbody.html(htmlArr.join(""));
                            break;
                        case 4:
                            displayKey = displayKey.concat(itemFour);
                            var assignee = data.assignee || '--';
                            var assignee_ident_type = data.assignee_ident_type || '--';
                            var assignee_ident_id = data.assignee_ident_id || '--';
                            var announce_date = Common.formatTime(data.announce_date);
                            displayVal = displayVal.concat([assignee, assignee_ident_type, assignee_ident_id, announce_date]);
                            var htmlArr = [];
                            var mainHtml = this.displayTable(displayKey, displayVal);
                            htmlArr.push(mainHtml);
                            $tbody.html(htmlArr.join(""));
                            break;
                        default:
                            var htmlArr = [];
                            var mainHtml = this.displayTable(displayKey, displayVal);
                            htmlArr.push(mainHtml);
                            $tbody.html(htmlArr.join(""));
                            break;
                    }
                    break;
            }
        },
        displayTable: function(itemKey, itemValue, arr) {
            var htmlArr = [];
            var len = Math.ceil(itemKey.length / 2);
            var isYushu = itemKey.length % 2 != 0 ? true : false; //是否有余数,true代表有,有余数最后一行则需要合并表格
            for (var i = 0; i < len; i++) {
                var tmpHtml = "";
                if (i == len - 1 && isYushu) {
                    var tmpHtml = "<tr><td width='20%' class='title-item item-middle'>" + itemKey[i * 2] + "</td><td colspan=3>" + itemValue[i * 2] + "</td></tr>";
                } else {
                    var tmpHtml = "<tr><td width='20%' class='title-item'>" + itemKey[i * 2] + "</td><td width='30%'>" + itemValue[i * 2] + "</td><td width='20%' class='title-item'>" + itemKey[i * 2 + 1] + "</td><td width='30%'>" + itemValue[i * 2 + 1] + "</td></tr>";
                }
                htmlArr.push(tmpHtml);
            }
            if (arr) {
                var tmpHtml = "<tr><td width='15%' class='title-item' rowspan='" + arr[0] + "'>" + intl('138620' /* 抵押物描述 */ ) + "</td>";
                htmlArr.push(tmpHtml);
                for (var dld = 0; dld < arr[0]; dld++) {
                    var tmpHtml = "<td width='35%' class='dpawn_back'>" + arr[dld * 2 + 1] + "</td><td width='50%' colspan='2' class='dpawn_back'>" + arr[dld * 2 + 2] + "</td>";
                    tmpHtml = tmpHtml + '</tr>';
                    htmlArr.push(tmpHtml);
                }
            }
            return htmlArr.join("");
        },
        pageSetting: function(moduleName, tableSetting, columnDefsSet, selfParam, $dom, oIndex) {
            // oIndex用在股权质押这类的标题栏有切换功能的模块
            if (oIndex == 0 || oIndex) {
                tableSetting = tableSetting[oIndex];
                columnDefsSet = columnDefsSet[oIndex];
            }
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
                language: Person.lang, //提示信息
                autoWidth: false, //禁用自动调整列宽
                //stripeClasses: ["odd", "even"], //为奇偶行加上样式，兼容不支持CSS伪类的场合
                processing: false, //隐藏加载提示,自行处理
                serverSide: true, //启用服务器端分页
                searching: false, //禁用原生搜索
                orderMulti: false, //启用多列排序
                order: [], //取消默认排序查询,否则复选框一列会出现小箭头
                scrollCollapse: false, //开启滚动条
                pageLength: 10, //首次加载的数据条数
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
                    if (opts._iRecordsTotal <= 10) {
                        $(this).siblings('.dataTables_paginate').hide()
                    }
                    if (opts._iRecordsTotal > maxItem) {
                        $(moduleName + "_paginate").prepend('<div class="page-tip">注：最多展示5000条数据</div>');
                    }
                    $(moduleName + "_paginate").append("  跳至 <input class='pagiate-page-num' id='" + moduleName.substring(1) + "-changePage' type='text'> 页 ");
                    var oTable = $(moduleName).dataTable();
                    $(document).on("keydown", moduleName + "-changePage", function() {
                        switch (event.keyCode) {
                            case 13:
                                if ($(moduleName + "-changePage").val() && $(moduleName + "-changePage").val() > 0) {
                                    var maxPage = Math.ceil(opts._iRecordsTotal / 10);
                                    var inputPage = parseInt($(moduleName + "-changePage").val()) ? parseInt($(moduleName + "-changePage").val()) : "1";
                                    if (inputPage >= maxPage) {
                                        inputPage = maxPage;
                                    }
                                    var redirectpage = inputPage - 1;
                                } else {
                                    var redirectpage = 0;
                                }
                                oTable.fnPageChange(redirectpage);
                                return false;
                                break;
                        }
                    })
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
                    param.characterid = Person.userInfo.id;
                    param.personName = Person.userInfo.name;
                    param.PageNo = (data.start / data.length);
                    param.PageSize = 10;
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
                            // 非VIP用户
                            if (result.ErrorCode == '-10') {
                                $(moduleName).parents(".widget-model").find(".modle-num").text('(' + (Person.personNum[tableSetting.recordKey] - 0 || 0) + ')');
                                if (moduleName === '#tabHZHB') {
                                    tableSetting.callback && tableSetting.callback(result);
                                    return;
                                }
                                Common.notVipModule($(moduleName).empty(), tableSetting.notVipTitle, tableSetting.notVipTips ? tableSetting.notVipTips.replace(/企业套餐/g, 'VIP/SVIP套餐') : '购买VIP/SVIP套餐，即可查看具体信息');
                                return;
                            }
                            if (result.ErrorCode == '0' && result.Data) {
                                var resData = result.Data;
                                var returnData = {};

                                returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                                if (tableSetting.dataFromList) {
                                    returnData.data = resData.list;
                                    if (!result.Data.list || result.Data.list.length <= 0) {
                                        console.log(moduleName)
                                        callback({ data: [], recordsTotal: 0, recordsFiltered: 0 });
                                        return false
                                    }
                                } else {
                                    returnData.data = resData;
                                }

                                // 总数以num中为准
                                if (tableSetting.recordKey && Person.personNum && Person.personNum[tableSetting.recordKey]) {
                                    returnData.recordsTotal = Person.personNum[tableSetting.recordKey]; //返回数据全部记录
                                    returnData.recordsFiltered = Person.personNum[tableSetting.recordKey]; //后台不实现过滤功能，每次查询均视作全部结果
                                    $(moduleName).parents(".widget-model").find(".modle-num").text('(' + (Person.personNum[tableSetting.recordKey] - 0 || 0) + ')');
                                } else {
                                    returnData.recordsTotal = result.Page.Records; //返回数据全部记录
                                    returnData.recordsFiltered = result.Page.Records; //后台不实现过滤功能，每次查询均视作全部结果
                                    $(moduleName).parents(".widget-model").find(".modle-num").text('(' + (result.Page.Records - 0 || 0) + ')');
                                }

                                callback(returnData);
                                //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                                if (moduleName === '#tabHZHB') {
                                    tableSetting.callback && tableSetting.callback(result);
                                }
                                if (tableSetting.defer && tableSetting.defer.resolve) {
                                    tableSetting.defer.resolve();
                                }
                            } else {
                                callback({ data: [] });
                                if (tableSetting.defer && tableSetting.defer.resolve) {
                                    tableSetting.defer.resolve();
                                }
                            }
                        },
                        error: function(data) {
                            callback({ data: [] });
                            if (tableSetting.defer && tableSetting.defer.resolve) {
                                tableSetting.defer.resolve();
                            }
                        }
                    });
                },
            });
        },
        /**
         * 人物简介
         */
        getpersoninfo: function() {
            var self = this;
            var parameter = { "characterid": self.userInfo.id, "personName": self.userInfo.name };
            var request = myWfcAjax("getpersoninfo", parameter, function(data) {
                if (data) {
                    var res = JSON.parse(data);
                    if (res && res.Data && res.Data.length) {
                        var info = Person.personDetail = res.Data[0].person_introduce || '';
                        var name = res.Data[0].person_name;
                        if (name && (name !== Person.userInfo.name)) {
                            Person.userInfo.name = res.Data[0].person_name;
                            $(document).find('head title').text(Person.userInfo.name || '个人详情');
                            $('.nav-person-name #navPersonName').text(Person.userInfo.name);
                        }
                        var imgId = res.Data[0].image_id_t;
                        if (imgId) {
                            // if (!global_isRelease) {
                            // $('.nav-person img').attr('src', 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + imgId);
                            $('.nav-person img').attr('src', imgId);
                            // } else {
                            // $('.nav-person img').attr('src', 'http://wfcweb/imageWeb/ImgHandler.aspx?imageID=' + imgId);
                            // }
                            Person.userInfo.imgId = imgId;
                        }
                        if (info.length > 285) {
                            var tmpStr = info.substring(0, 225) + '...';
                            $('.nav-person-detail').html(tmpStr + '<div class="nav-person-detail-link wi-secondary-color wi-link-color">' + intl('69354' /*查看详情*/ ) + '</div>');
                        } else {
                            $('.nav-person-detail').text(info);
                        }
                    }
                }
            });
        }
    };
    $(document).on("click", ".sub-nav-block a", function(event) {
        //二级菜单定位到锚点的问题
        var toJump = $(this).find('i').text() == "(0)" ? false : true;
        if (!toJump) {
            return false;
        }
        var href = $(this).attr("href");
        var parentHeight = $(this).parents().find('.nav-tabs').outerHeight(); //一级菜单的高度
        var topdis = $(href).offset().top - parentHeight - 50;
        $(document).scrollTop(topdis)
        event.preventDefault()
        return false;
    })
    $(document).on("click", ".menu-title", function(event) {
        var parent = $(this).parent();
        if ($(parent).hasClass('nav-disabled')) {
            return false;
        }
        //二级菜单定位到锚点的问题
        var href = $(this).find('a').attr("href");
        var parentHeight = $(this).parents(".nav-block").outerHeight(); //一级菜单的高度
        var topdis = $(href).offset().top - 50;
        $(document).scrollTop(topdis)
        event.preventDefault()
        return false;
    })
    $(document).on("click", ".link-showdetail", function() {
        //显示列表中的'详细'展开
        var initialText = $(this).text();
        var Band = false;
        if ($(this).text() == intl('138877' /* 收起 */ )) {
            $(this).text(intl('138697' /* 详细信息 */ ));
        } else {
            $(".link-showdetail").text(intl('138697' /* 详细信息 */ ));
            $(this).text(intl('138877' /* 收起 */ ));
        }
        if ($(this).parent().parent().parent().attr('id') == 'tbodyBand') {
            Band = true;
        }
        Person.showContentDetail(this, $(this).attr("data-tdlen"), Band)
        return false;
    })
    $(document).on('click', '.nav-person-detail-link', function(event) {
        layer.open({
            content: '<div class="person-layer-msg"><span>' + Person.personDetail + '</span></div>',
            type: 1,
            area: '800px',
            title: Person.userInfo.name + ' ' + intl('138847' /* 简介 */ ),
            maxHeight: 200,
            closeBtn: 1,
            skin: 'person-layer-dialog',
        });
    })

    $('#inputToolbarSearch').on('focus', function() {
        var target = event.target;
        var val = $.trim($(target).val());
        if (val) {
            // 显示预搜索
            val = val.trim();
            var len = Common.getByteLen(val);
            if (len >= 4) {
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
                        var highTitle = '--';
                        var highLitKey = '--';
                        var highLight = '--';
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
                            case 'corp_members':
                                highTitle = intl('122202' /* 主要成员 */ );
                                break;
                            case 'stockholder_people':
                                highTitle = intl('32959' /* 股东 */ );
                                break;
                            case 'software_copyright':
                                highTitle = intl('138788' /* 软件著作权 */ );
                                break;
                            case 'brand_name':
                                highTitle = intl('138798' /* 商标名称  */ );
                                break;
                            case 'tel':
                                highTitle = intl('4944' /* 电话 */ );
                                break;
                            case 'mail':
                                highTitle = intl('93833' /* 邮箱 */ );
                                break;
                            case 'patent':
                                highTitle = intl('138749' /* 专利 */ );
                                break;
                            case 'goods':
                                highTitle = intl('138669' /* 商品/服务项目 */ );
                                break;
                            case 'former_name':
                                highTitle = intl('138570' /* 企业曾用名 */ );
                                break;
                            case 'corp_short_name':
                                highTitle = intl('138785' /* 公司简称 */ );
                                break;
                            case 'stockname':
                                highTitle = intl('32992' /* 股票简称 */ );
                                break;
                            case 'stockcode':
                                highTitle = intl('6440' /* 股票代码 */ );
                                break;
                            case 'main_business':
                                highTitle = intl('138753' /* 主营构成 */ )
                                break;
                            case 'brand_name2':
                                highTitle = intl('207813' /* 品牌 */ );
                                break;
                            default:
                                highTitle = '';
                                break;
                        }

                        if (highTitle) {
                            highLight = '<span>' + highTitle + '</span>';
                        }
                        ele.innerHTML = corp_name + highLight;
                        $(ele).attr('data-code', data[i].id);
                        $(ele).attr('data-name', corName);
                        beforeSearchParent.append(ele);
                    }
                }, function() {
                    return $.trim($('#inputToolbarSearch').val());
                });
            }
        } else {
            if (!Person._historySearchList.length) {
                return;
            }

            var searchListParent = $('.input-toolbar-search-list');
            searchListParent.addClass('active');
            searchListParent.html('');
            searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');

            for (var i = 0; i < Person._historySearchList.length; i++) {
                if (i > 4) {
                    break;
                }
                var ele = document.createElement('div');
                $(ele).addClass('search-list-div')
                $(ele).text(Person._historySearchList[i].keyword);
                $(ele).attr('data-name', Person._historySearchList[i].keyword);
                $(ele).attr('data-match', Person._historySearchList[i].is_fullmatch == 1 ? 1 : 0);
                $(ele).attr('data-code', Person._historySearchList[i].companycode || '');
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
                        $('.input-toolbar-button').trigger('click');
                    }
                    break;
            }
        }
    });
    var banner = {
        time: 3000,
        n: 3,
        init: function() {
            var $dom = $("#companyBanner");
            var $currentLi = $dom.find("li:visible").eq(0);
            this.showBanner($currentLi);
        },
        showBanner: function($currentLi) {
            var oIndex = $("#companyBanner").find("li").index($currentLi);
            var nextIndex;
            if (oIndex == 2) {
                nextIndex = 0;
            } else {
                nextIndex = oIndex + 1;
            }
            $currentLi.fadeOut(1500);
            $nextLi = $("#companyBanner").find("li").eq(nextIndex);
            $nextLi.fadeIn(1500);
            timer = setTimeout(function() {
                banner.showBanner($nextLi);
            }, banner.time);

        }
    }
    $("#companyBanner").hover(function() {
        clearTimeout(timer);
    }, function() {
        banner.init();
    })

    $("#inputToolbarSearch").on('focus', function(event) {
        $("#inputToolbarSearch").on('input', function(event) {
            clearTimeout(Person.serachtimer);
            Person.serachtimer = setTimeout(function() {
                var target = event.target;
                var val = $.trim($(target).val());
                if (val) {
                    // 显示预搜索
                    $('.input-toolbar-search-list').removeClass('active');
                    val = val.trim();
                    var len = Common.getByteLen(val);
                    if (len >= 4) {
                        Common.getPreSearch(val, function(res) {
                            var data = res.corplist;
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
                                    case 'corp_members':
                                        highTitle = intl('122202' /* 主要成员 */ );
                                        break;
                                    case 'stockholder_people':
                                        highTitle = intl('32959' /* 股东 */ );
                                        break;
                                    case 'software_copyright':
                                        highTitle = intl('138788' /* 软件著作权 */ );
                                        break;
                                    case 'brand_name':
                                        highTitle = intl('138798' /* 商标名称  */ );
                                        break;
                                    case 'tel':
                                        highTitle = intl('4944' /* 电话 */ );
                                        break;
                                    case 'mail':
                                        highTitle = intl('93833' /* 邮箱 */ );
                                        break;
                                    case 'patent':
                                        highTitle = intl('138749' /* 专利 */ );
                                        break;
                                    case 'goods':
                                        highTitle = intl('138669' /* 商品/服务项目 */ );
                                        break;
                                    case 'former_name':
                                        highTitle = intl('138570' /* 企业曾用名 */ );
                                        break;
                                    case 'corp_short_name':
                                        highTitle = intl('138785' /* 公司简称 */ );
                                        break;
                                    case 'stockname':
                                        highTitle = intl('32992' /* 股票简称 */ );
                                        break;
                                    case 'stockcode':
                                        highTitle = intl('6440' /* 股票代码 */ );
                                        break;
                                    case 'main_business':
                                        highTitle = intl('138753' /* 主营构成 */ )
                                        break;
                                    case 'brand_name2':
                                        highTitle = intl('207813' /* 品牌 */ );
                                        break;
                                    default:
                                        highTitle = '';
                                        break;
                                }

                                if (highTitle) {
                                    highLight = '<span>' + highTitle + '</span>';
                                }
                                ele.innerHTML = corp_name + highLight;
                                $(ele).attr('data-code', data[i].id);
                                $(ele).attr('data-name', corName);
                                parent.append(ele);
                            }
                        }, function() {
                            return $.trim($('#inputToolbarSearch').val());
                        });
                    } else {
                        $('.input-toolbar-before-search').removeClass('active');
                    }
                } else {
                    $('.input-toolbar-before-search').removeClass('active');

                    if (!Person._historySearchList.length) {
                        return;
                    }

                    var searchListParent = $('.input-toolbar-search-list');
                    searchListParent.addClass('active');
                    searchListParent.html('');
                    searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');

                    for (var i = 0; i < Person._historySearchList.length; i++) {
                        if (i > 4) {
                            break;
                        }
                        var ele = document.createElement('div');
                        $(ele).addClass('search-list-div')
                        $(ele).text(Person._historySearchList[i].keyword);
                        $(ele).attr('data-name', Person._historySearchList[i].keyword);
                        $(ele).attr('data-match', Person._historySearchList[i].is_fullmatch == 1 ? 1 : 0);
                        $(ele).attr('data-code', Person._historySearchList[i].companycode || '');
                        searchListParent.append(ele);
                    }
                }
            }, 300)
        });
    })


    $('.input-toolbar-search-list').on("click", ".search-list-div", function(event) {
        var target = event.target;
        var companyname = $(target).text();
        var url = "SearchHomeList.html?keyword=" + companyname;
        var match = $(target).attr('data-match');
        var code = $(target).attr('data-code');
        if (match - 0 && code) {
            Common.linkCompany('Bu3', code);
            $('.input-toolbar-search-list').removeClass('active');
            return;
        }
        // window.open(url);
        location.href = url;
        getHistoryKey();
    })

    $('.input-toolbar-before-search').on("click", ".before-search-div", function(event) {
        var target = event.target;
        if (!$(target).hasClass('before-search-div')) {
            target = target.closest('.before-search-div');
        }
        var code = $(target).attr('data-code');
        Common.linkCompany("Bu3", code);
        return false;
    })

    $('.input-toolbar-search-list').on("click", ".search-list-icon", function(event) {
        // 清空搜索记录
        myWfcAjax("clearhistorykey", {}, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == '0') {
                var searchListParent = $('.input-toolbar-search-list');
                searchListParent.removeClass('active');
                Person._historySearchList = [];
                searchListParent.html('');
            }
        }, function() {

        });
    })

    $(document).bind("click", function(e) {
        if ($((e.target || e.srcElement)).closest(".toolbar-search,.input-toolbar-search-list").length == 0) {
            $('.input-toolbar-search-list').removeClass('active');
            $('.input-toolbar-before-search').removeClass('active');
        }
    });

    $('.input-toolbar-before-search').on("click", ".before-search-key", function(event) {
        var target = event.target;
        if (!$(target).hasClass('before-search-key')) {
            target = target.closest('.before-search-key');
        }
        var tag = $(target).find('.wi-secondary-color')[1].innerHTML;
        var url = "ShowSearchList.html?companyFeature=" + tag;
        window.open(url);
    })

    $(document).on("click", "#btn2Chart", function() {
        if (!Person.userInfo.id) {
            return;
        }
        var url = 'CompanyChart.html?companycode=' + Person.userInfo.id + '&companyid=' + Person.userInfo.id + '&companyname=' + encodeURIComponent(Person.userInfo.name);
        window.open(url);
        return false;
    })

    $(document).on('click', '.item-corp-friend-name', function(e) {
        // TODO 人物跳转
        var target = e.target;
        var id = $(target).attr('data-id');
        var name = $(target).text();
        var url = 'Person.html?id=' + id + '&name=' + name;
        window.open(url);
        return false;
    })

    $('#person_qbqy').on('click', '.underline', function(e) {
        // 全部企业
        var target = e.target;
        var code = $(target).attr('data-code');
        Common.linkCompany("Bu3", code);
        return false;
    })

    $('#person_sjkz').on('click', '.underline', function(e) {
        // 全部企业
        var target = e.target;
        var code = $(target).attr('data-code');
        var type = $(target).attr('data-type');
        if (type === 'person') {
            var name = $(target).text();
            window.open('Person.html?id=' + code + '&name=' + name);
        } else {
            Common.linkCompany("Bu3", code);
        }
        return false;
    })

    $(window).on("scroll", function() {
        var scrolltop = $(this).scrollTop();
        var $nav = $(".nav-tabs");
        var navHeight = $(".nav-tabs").height();
        var windowHeight = $(window).height();
        //var initTopY = 241;
        //var noToolbarY = 190;
        var initTopY = 348;
        var noToolbarY = 297;
        var fixtop = 0;
        if (!Common.isNoToolbar()) {
            noToolbarY = 348;
            fixtop = 50;
        } else {
            initTopY = noToolbarY;
        }
        if (scrolltop > noToolbarY) {
            $nav.css("top", fixtop);
        } else {
            $nav.css("top", initTopY - scrolltop);
        }
    })
    $(document).on("mouseover", ".nav-tabs", function() {
        $(".sub-nav-block").show();
    })
    $(document).on("mouseout", ".nav-tabs", function() {
        $(".sub-nav-block").hide();
    })
    $(document).on('click', '.paginate_button', function(event) {
        var target = event.target;
        var topdis = 0;
        try {
            var tableEle = $('#' + $(target).attr('aria-controls')); // 当前表格元素
            var documentHeaderHeight = $('.nav-tabs').outerHeight(true); // 当前文档的置顶区域高度
            var headerHeight = $(tableEle).closest('.widget-model').find('.widget-header').outerHeight(true); // 当前表格的widget-header高度
            topdis = $(tableEle).offset().top - headerHeight - documentHeaderHeight;
            $('html, body').animate({
                scrollTop: topdis
            }, 200);
        } catch (e) {}
    })


    /* 国际化 ,所有自己的代码都在写在这个回调函数后*/
    function personInit() {
        banner.init();
        setTimeout(function() {
            Person.init();
            window._PersonKlass = window._PersonKlass || Person;
        }, 10);
    }
    var funcList = [personInit]
    Common.internationToolInfo(funcList);


})(window, $)
$('.nav-person-name').mouseover(function(e) {
    //$('body').append('');
    var oLeft = $(".nav-person-name").offset().left;
    var oTop = $(".nav-person-name").offset().top;
    $('#tooltip').show().css({
        'left': (e.pageX - 5 - oLeft + 145 + 'px'),
        'top': (e.pageY - 5 - oTop + 'px')
    }).show();
}).mouseout(function() {
    $('#tooltip').hide();
}).mousemove(function(e) {
    var oLeft = $(".nav-person-name").offset().left;
    var oTop = $(".nav-person-name").offset().top;
    $('#tooltip').show().css({
        'left': (e.pageX - 5 - oLeft + 145 + 'px'),
        'top': (e.pageY - 5 - oTop + 'px')
    });
})

$(function() {
    var clipboard = new Clipboard('#tooltip');
    clipboard.on('success', function(e) {
        layer.msg("复制成功", { time: 500 })

    });
    clipboard.on('error', function(e) {
        layer.msg("复制失败，请稍后再试", { time: 500 })
    });
})

$(document).on("mouseover", ".module-vip-tips", function(e) {
    $(e.target).attr('title', intl('209303' /* 您正在使用付费高级功能 */ ));
})