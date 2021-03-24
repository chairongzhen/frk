/*
 * @Author: Cheng Bo 
 * @Date: 2018-04-13 17:44:54 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2021-03-02 15:32:47
 * @Desc: 企业图谱
 */
(function(window, $) {
    var CompanyChart = {
        companyName: decodeURI(getUrlSearch('companyname')) || '--',
        companyCode: getUrlSearch('companycode') || '--',
        companyId: getUrlSearch('companyid') || '--',
        _historySearchList: [], // 历史搜索记录
        _corpListParams: {},
        serachtimer: null,
        chartSearch: null, // 选中的Tab页签对应的浏览器hash值
        chartFromLink: false, // 是否来自外部链接
        chartHeaderHeight: 0, // 图标顶部区域高度
        chartSelect: null, // 记录选中的Tab页签
        rootData: null, // 图表初始数据
        container: null, // d3绘制的图表对应的container元素
        linkContainer: null, // d3绘制的图标对应的link元素
        zoom: null, // 记录d3实例zoom事件委托
        svg: null, // d3绘制的图标对应的svg元素
        echartInstance: null, // echart图表实例
        chartEleClone: $('#companyChart').clone(), // echart图标对应的Dom节点元素的clone
        imgServerIp: '180.96.8.44',
        /**
         * 操作事件委托
         * 展开、收起
         * 刷新
         * 放大
         * 缩小
         */
        events: {
            eventOne: null,
            eventTwo: null,
            eventThree: null,
            eventFour: null,
        },
        /**
         * 对应的页签Tab，及其点击事件回调
         */
        tabs: {
            'linkQYTP': {
                fun: 'loadQYTP'
            },
            'linkGQJG': {
                fun: 'loadGQJG'
            },
            'linkDWTZ': {
                fun: 'loadDWTZ'
            },
            'linkQYSYR': {
                fun: 'loadQYSYR'
            },
            'linkNewGQJG': {
                fun: 'loadNewGQJG'
            },
            'linkGQCT': {
                fun: 'loadGQCT'
            },
            'linkNewGQCT': {
                fun: 'loadNewGQCT'
            },
            'linkYSGX': {
                fun: 'loadYSGX'
            },
            'linkYSKZR': {
                fun: 'loadYSKZR'
            },
            'linkRZLC': {
                fun: 'loadRZLC'
            },
            'linkZZJG': {
                fun: 'loadZZJG'
            },
            'linkRZTP': {
                fun: 'loadRZTP'
            }
        },
        /**
         * 对应的页签Tab与对应的hash值绑定关系
         */
        tabsHash: {
            'chart_qytp': {
                idx: 0,
                fun: 'loadQYTP'
            },
            'chart_gqjg': {
                idx: 1,
                fun: 'loadGQJG'
            },
            'chart_dwtz': {
                idx: 2,
                fun: 'loadDWTZ'
            },
            'chart_qysyr': {
                idx: 3,
                fun: 'loadQYSYR'
            },
            'chart_newgqjg': {
                idx: 4,
                fun: 'loadNewGQJG'
            },
            'chart_gqct': {
                idx: 5,
                fun: 'loadGQCT'
            },
            'chart_newgqct': {
                idx: 6,
                fun: 'loadNewGQCT'
            },
            // 'chart_ysgx': {
            //     idx: 7,
            //     fun: 'loadYSGX'
            // },
            'chart_yskzr': {
                idx: 7,
                fun: 'loadYSKZR'
            },
            // 'chart_rzlc': {
            //     idx: 8,
            //     fun: 'loadRZLC'
            // },
            'chart_zzjg': {
                idx: 10,
                fun: 'loadZZJG'
            }
        },
        /**
         * 页面初始化
         */
        init: function() {
            var self = this;
            var idx = 0;

            $.client.getServerIP('wfcweb', function(ret) {
                CompanyChart.imgServerIp = ret;
            });

            setTimeout(function() {
                var pls = intl('138677' /* 企业名称 */ , '企业名称') + '、' + intl('138733' /* 法人 */ , '法人') + '、' + intl('32959' /* 股东 */ , '股东') + '、' + intl('122202' /* 主要成员 */ , '主要成员') + '、' + intl('138799' /* 商标 */ , '商标');
                $('.input-toolbar-search').attr('placeholder', pls);
            }, 100);

            // 获取历史搜索记录
            Common.getCommonHistoryKey(CompanyChart);
            self.initCompanyInfo(function() {
                $('.nav-company-name').text(CompanyChart.companyName);
                $('#gqjg_title').remove();

                if (self.chartSearch && self.chartSearch in self.tabsHash) {
                    self[self.tabsHash[self.chartSearch].fun]();
                    idx = self.tabsHash[self.chartSearch].idx;
                    // 部分图谱隐藏操作区
                    if (self.chartSearch === 'chart_rzlc' || self.chartSearch === 'chart_yskzr' || self.chartSearch === 'chart_ysgx' || self.chartSearch === 'chart_rztp') {
                        // $('.chart-toolbar').hide();
                        $('.chart-first-toolbar').hide();
                    }
                    if (self.chartSearch === 'chart_qytp') {
                        // $('.chart-toolbar').hide();
                        $('.chart-first-toolbar').show();
                    } else {
                        $('.chart-first-toolbar').hide();
                        // $('.chart-toolbar').show();
                    }
                } else {
                    idx = 0;
                    // 默认加载[企业图谱]                
                    self.loadQYTP();
                }

                self.chartSelect = $('.nav-tabs').find('.nav-block').eq(idx);
                self.chartSelect.addClass('active');
                $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
            });

            self.chartSearch = location.hash ? location.hash.split('#')[1] : 'chart_qytp';
            self.chartFromLink = self.isFromLink(); // 来自外部链接
            if (!self.chartFromLink) {
                if (!Common.isNoToolbar()) {
                    $('.toolbar').show();
                }
                $('#mainNav').show();
            } else {
                $('.content').height('100vh');
                $('#companyChart').height('100vh');
            }
            self.chartHeaderHeight = (($('.toolbar').length ? $('.toolbar')[0].clientHeight : 0) + ($('#mainNav').length ? ($('#mainNav')[0].clientHeight) : 0)) + 40;

            /**
             * 菜单切换
             */
            $('.nav-tabs').on('click', '.nav-block', function(e) {
                // 事件锁
                if ($('#load_data').attr('style').indexOf('block') > -1) {
                    return false;
                }
                var eles = $('.chart-nav').find('button');
                Array.prototype.forEach.call(eles, function(e) {
                    if (!$(e).hasClass('wi-secondary-bg')) {
                        $(e).addClass('wi-secondary-bg')
                    }
                });
                $('.chart-yskzr').hide(); // 疑似实际控制人内容
                $("#companyChart").empty(); // 节点清空
                $('#no_data').hide(); // 暂无数据
                $('#load_data').show(); // 加载中
                $("#companyChart").attr('class', ''); // 样式清空     
                $('#rContent').removeClass('has-nav');
                $('#toolNav').remove();
                $('#gqjg_title').remove();
                // 事件初始化
                CompanyChart.events = {
                    eventOne: null,
                    eventTwo: null,
                    eventThree: null,
                    eventFour: null,
                };
                // 清空echart实例 释放资源
                if (CompanyChart.echartInstance) {
                    CompanyChart.echartInstance.clear();
                    CompanyChart.echartInstance.dispose();
                    var parent = $('#companyChart').parent();
                    parent.find('#companyChart').remove();
                    var ele = CompanyChart.chartEleClone.clone();
                    parent.append(ele);
                    ele.height($(window).height() - CompanyChart.chartHeaderHeight);
                    CompanyChart.echartInstance = null;
                }
                if (CompanyChart.cyInstance) {
                    CompanyChart.cyInstance.destroy();
                    CompanyChart.cyInstance = null;
                }
                if (self.chartSelect) {
                    $(self.chartSelect).removeClass('active');
                    $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg');
                }
                self.chartSelect = $(e.target).closest(".nav-block");
                self.chartSelect.addClass("active");
                $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
                var id = self.chartSelect.find('a').attr('id');
                self.chartSearch = self.chartSelect.find('a').attr('href').split('#')[1];
                // 部分图谱隐藏操作区
                if (id === 'linkRZLC' || id === 'linkYSKZR' || id === 'linkYSGX' || id === 'linkRZTP') {
                    // $('.chart-toolbar').hide();
                    $('.chart-first-toolbar').hide();
                } else if (id === 'linkQYTP') {
                    // $('.chart-toolbar').hide();
                    $('.chart-first-toolbar').show();
                } else {
                    $('.chart-first-toolbar').hide();
                    // $('.chart-toolbar').show();
                }
                self[self.tabs[id].fun]();
            })

            /**
             * 搜索
             */
            $('.input-toolbar-button').click(function(event) {
                //搜索按钮
                var keyword = $('.input-toolbar-search').val();
                if (keyword && keyword.trim()) {
                    // window.open("SearchHomeList.html?keyword=" + keyword);
                    location.href = "SearchHomeList.html?keyword=" + keyword;
                }
            });

            /**
             * 回车事件监听
             */
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

            /**
             * 企业详情跳转
             */
            $(document).on('click', '.nav-company-name', function() {
                Common.linkCompany("Bu3", CompanyChart.companyCode);
            })

            // 展开、收起事件委托
            $('#chartActionOne').click(function chartActionOne() {
                return self.events.eventOne && self.events.eventOne.apply(this, arguments)
            });
            // 刷新事件委托
            $('#chartActionTwo').click(function chartActionTwo() {
                return self.events.eventTwo && self.events.eventTwo.apply(this, arguments)
            });
            // 放大事件委托
            $('#chartActionThree').click(function chartActionThree() {
                return self.events.eventThree && self.events.eventThree.apply(this, arguments)
            });
            // 缩小事件委托
            $('#chartActionFour').click(function chartActionFour() {
                return self.events.eventFour && self.events.eventFour.apply(this, arguments)
            });

            // 企业图谱-刷新事件委托
            $('#chartFirstOne').click(function chartActionTwo() {
                return self.events.eventTwo && self.events.eventTwo.apply(this, arguments)
            });
            // 企业图谱-放大事件委托
            $('#chartFirstTwo').click(function chartActionThree() {
                return self.events.eventThree && self.events.eventThree.apply(this, arguments)
            });
            // 企业图谱-缩小事件委托
            $('#chartFirstThree').click(function chartActionFour() {
                return self.events.eventFour && self.events.eventFour.apply(this, arguments)
            });

            $('.menu-relation').on('click', function(e) {
                var str = '';
                str = 'lc=' + CompanyChart.companyCode;
                str = str + ('&lcn=' + CompanyChart.companyName);
                window.open("ChartPlatForm.html?" + str);
            })

        },
        /**
         * 外部链接
         */
        isFromLink: function() {
            var isExternal = Common.getUrlSearch("from");
            if (isExternal && /external_/i.test(isExternal)) {
                return true;
            }
            if (isExternal && isExternal.substring(0, 4) == "link") {
                return true;
            }
            return false;
        },
        /**
         * 暂无数据
         */
        chartNoData: function(txt) {
            //无数据
            $('#no_data').text(txt ? txt : intl('132725' /*暂无数据*/ , '暂无数据'));
            $('#load_data').hide();
            $('#no_data').show();
        },
        traverseTreeId: function(node) {
            var id = 1;
            trId(node);

            function trId(node) {
                node.id = id;
                id++;
                if (node.children) {
                    for (var i = 0; i < node.children.length; i++) {
                        trId(node.children[i]);
                    }
                }
                if (node._children) {
                    for (var i = 0; i < node._children.length; i++) {
                        trId(node._children[i]);
                    }
                }
            }

        },
        changeChild: function(data, oldKey, newKey) {
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][oldKey]) {
                        data[i][newKey] = data[i][oldKey];
                        data[i][oldKey] = null;
                    }
                }
            }
        },
        resetResData: function(data) {
            var resetData = { "Result": {} };
            var resetEachData = CompanyChart.resetEachData;
            //对外投资
            var invest = resetEachData(2, "对外投资", data.Invests, "invest_name", "invest_id");
            //股东
            var shareholder = resetEachData(3, "股东", data.Shareholder, "shareholder_name", "shareholder_id", "shareholder_type");
            //高管
            //未返回人员类型 直接用1表示
            var Menber = resetEachData(4, "主要成员", data.Menber, "person_name", "person_id", 1);
            //历史法人
            var HistLegalPers = resetEachData(9, "历史法人", data.HistLegalPers, "hist_legal_pers_name", "hist_legal_pers_id", 1);
            //判决
            var Judge = resetEachData(6, "诉讼", data.Judge, "case_no", "case_no");
            //历史股东
            var HistShareholder = resetEachData(8, "历史股东", data.HistShareholder, "hist_shareholder_name", "hist_shareholder_id", 'type');
            //分支机构
            var Branch = resetEachData(7, "分支机构", data.Branch, "branch_name", "branch_id");
            //同比企业
            var Companylist = resetEachData(5, "同比企业", data.Companylist, "company_name", "company_name");
            var suporNode = { "Node": {} }
            suporNode.Node.name = CompanyChart.companyName;
            suporNode.Node.Category = 1;
            suporNode.Node.children = [];
            suporNode.Node.children.push(invest);
            suporNode.Node.children.push(shareholder);
            suporNode.Node.children.push(Menber);
            suporNode.Node.children.push(HistLegalPers);
            suporNode.Node.children.push(Judge);
            suporNode.Node.children.push(Companylist);
            suporNode.Node.children.push(HistShareholder);
            suporNode.Node.children.push(Branch);
            resetData.Result = suporNode;
            return resetData;
        },
        resetEachData: function(num, name, eachData, filename, fieldid, itemType) {
            var invest = { "Category": num, "KeyNo": null, "name": name, "children": [] }
            if (eachData.length && eachData.length > 0) {
                var len = eachData.length > 30 ? 30 : eachData.length;
                for (var i = 0; i < len; i++) {
                    var childNode = {};
                    childNode["name"] = eachData[i][filename];
                    childNode["KeyNo"] = eachData[i][fieldid];
                    childNode["Category"] = num;
                    childNode["children"] = null;
                    childNode['itemType'] = itemType ? ((itemType === 1) ? 1 : eachData[i][itemType]) : '';
                    invest.children.push(childNode);
                }
            }
            return invest;
        },
        resetEachDataNew: function(data) {
            var resetData = { "Result": {} };
            var suporNode = { "Node": {} }
            suporNode.Node.name = CompanyChart.companyName;
            suporNode.Node.Category = 1;
            suporNode.Node.children = [];

            var resetEachData = CompanyChart.resetEachData;

            /* 股东 */
            var shareholder = { "Category": '1', 'KeyNo': null, name: '股东', children: [], _noIdx: 0 };
            var shareholderHis = resetEachData(1, "当前股东", data.Shareholder, "shareholder_name", "shareholder_id", "shareholder_type");
            var shareholderNow = resetEachData(1, "历史股东", data.HistShareholder, "hist_shareholder_name", "hist_shareholder_id", "type");
            shareholderHis._noIdx = 0;
            shareholderNow._noIdx = 1;
            shareholder.children.push(shareholderHis)
            shareholder.children.push(shareholderNow);

            /* 法人 */
            var legalper = { "Category": '2', 'KeyNo': null, name: '法人', children: [], _noIdx: 1 };
            //历史法人
            var HistLegalPers = resetEachData(2, "历史法人", data.HistLegalPers, "hist_legal_pers_name", "hist_legal_pers_id", 1);
            // 现任法人            
            var NowLegalPers = resetEachData(2, "现任法人", data.LegalPers, "legal_person_name", "legal_person_id", 1);
            NowLegalPers._noIdx = 0;
            HistLegalPers._noIdx = 1;
            legalper.children.push(NowLegalPers);
            legalper.children.push(HistLegalPers)

            /* 投资 */
            var invest = { "Category": '3', 'KeyNo': null, name: '投资', children: [], _noIdx: 3 };
            //实际控股
            var actControl = resetEachData(3, "实际控股", data.ControlledCorps, "invest_name", "invest_id");
            //直接参股
            var hisInvest = resetEachData(3, "直接参股", data.Invests, "invest_name", "invest_id");
            actControl._noIdx = 0;
            hisInvest._noIdx = 1;
            invest.children.push(actControl)
            invest.children.push(hisInvest);
            /// 分支机构
            var Branch = resetEachData(4, "分支机构", data.Branch, "branch_name", "branch_id");
            /// 竞争对手
            var Companylist = resetEachData(5, "竞争对手", data.Companylist, "company_name", "company_code");
            /// 诉讼
            var susong = { "Category": '6', 'KeyNo': null, name: '诉讼', children: [], _noIdx: 4 };
            // 被告
            var yg = resetEachData(6, "被告", data.JudgeDefendant, "prosecutor", "prosecutor");
            // 原告
            var bg = resetEachData(6, "原告", data.JudgeProsecutor, "defendant", "defendant");
            // 第三方
            var dsf = resetEachData(6, "第三方", data.JudgeThirdParty, "third_party", "third_party");
            yg._noIdx = 0;
            bg._noIdx = 1;
            dsf._noIdx = 2;
            hisInvest._noIdx = 1;
            susong.children.push(bg);
            susong.children.push(yg);
            susong.children.push(dsf);

            /* /// 并购
            var bg = { "Category": '', 'KeyNo': null, name: '并购', children: [] };
            // 并购标的
            var bgbd = resetEachData(5, "并购标的", data.MergeTarget, "tradePartName", "tradePartName");
            // 出让方
            var bgcrf = resetEachData(5, "出让方", data.MergeSeller, "tradePartName", "tradePartName");
            bg.children.push(bgbd);
            bg.children.push(bgcrf); */

            /// 高管
            var gg = { "Category": '7', 'KeyNo': null, name: '高管', children: [], _noIdx: 2 };

            var personObj = {};
            if (data.Supvisors && data.Supvisors.forEach) {
                data.Supvisors.forEach(function(t) {
                    if (!personObj[t.person_name]) {
                        personObj[t.person_name] = [];
                        personObj[t.person_name].push(t);
                    } else {
                        personObj[t.person_name].push(t);
                    }
                })
            }

            if (data.Directors && data.Directors.forEach) {
                data.Directors.forEach(function(t) {
                    if (!personObj[t.person_name]) {
                        personObj[t.person_name] = [];
                        personObj[t.person_name].push(t);
                    } else {
                        personObj[t.person_name].push(t);
                    }
                })
            }

            if (data.OtherMembers && data.OtherMembers.forEach) {
                data.OtherMembers.forEach(function(t) {
                    if (!personObj[t.person_name]) {
                        personObj[t.person_name] = [];
                        personObj[t.person_name].push(t);
                    } else {
                        personObj[t.person_name].push(t);
                    }
                })
            }

            for (var k in personObj) {
                var personArr = personObj[k];
                var obj = { "Category": 7, "KeyNo": '', "name": '', itemType: 1 }

                if (personArr && personArr.length) {
                    obj.KeyNo = personArr[0]['person_id'];
                    obj.oldName = k;

                    personArr.forEach(function(t) {
                        obj.name = obj.name ? obj.name + ',' + t['person_position'] : k + '(' + t['person_position'];
                    })
                    obj.name = obj.name + ')';
                }
                gg.children.push(obj);
            }

            // // 监事
            // var js = resetEachData(7, "监事", data.Supvisors, "person_name", "person_id", 1);
            // // 董事
            // var ds = resetEachData(7, "董事", data.Directors, "person_name", "person_id", 1);
            // // 其他
            // var ggOther = resetEachData(7, "其他", data.OtherMembers, "person_name", "person_id", 1);
            // gg.children.push(ds);
            // gg.children.push(js);
            // gg.children.push(ggOther);

            /// 实际控制人        
            var realCtrler = resetEachData(8, "实际控制人", data.ActControInfos, "act_contro_name", "act_contro_id", 'act_contro_type');
            // /// 实际控制人            
            // var realCtrler = { "Category": '8', 'KeyNo': null, name: '实际控制人', children: [] };
            // // 当前
            // var nowCtrler = resetEachData(8, "当前", data.ActControInfos, "act_contro_name", "act_contro_id", 'act_contro_type');
            // realCtrler.children.push(nowCtrler);

            realCtrler._noIdx = 5;
            Branch._noIdx = 6;
            Companylist._noIdx = 7;

            suporNode.Node.children.push(shareholder)
            suporNode.Node.children.push(legalper)
            suporNode.Node.children.push(gg)
            suporNode.Node.children.push(invest)
            suporNode.Node.children.push(susong)
            suporNode.Node.children.push(realCtrler)
            suporNode.Node.children.push(Branch)
            suporNode.Node.children.push(Companylist)

            // suporNode.Node.children.push(bg)  

            resetData.Result = suporNode;
            return resetData;
        },
        /**
         * d3初始化画布
         */
        draw: function(root) {
            CompanyChart.svg = null,
                CompanyChart.container = null,
                CompanyChart.linkContainer = null,
                CompanyChart.zoom = null;
            tree = d3.layout.cluster()
                .size([360, 600])
                .separation(function(a, b) { return (a.parent == b.parent ? 2 : 3) / a.depth; });
            $("#companyChart").addClass('chart-overflow-hidden').empty().height($(window).height() - CompanyChart.chartHeaderHeight);
            var svg = CompanyChart.svg = d3.select("#companyChart").append("svg").attr("xmlns", "http://www.w3.org/2000/svg");
            svg.empty();
            d3.select('svg').attr('width', $('#companyChart').width())
            d3.select('svg').attr('height', $('#companyChart').height());
            CompanyChart.container = svg.append("g");
            CompanyChart.linkContainer = CompanyChart.container.append("g");
            CompanyChart.zoom = d3.behavior.zoom()
                .scaleExtent([0.4, 2])
                .on("zoom", CompanyChart.zoomed);
            svg.call(CompanyChart.zoom);
            CompanyChart.initLocation();
            CompanyChart.drawTree(root);

            var drag = d3.behavior.drag()
                .on("drag", function() {
                    var translate = CompanyChart.zoom.translate();
                    var scale = CompanyChart.zoom.scale();
                    var x = translate[0];
                    var y = translate[1];
                    var cur = [x, y];
                    var maxX = $('#companyChart').width();
                    var maxY = $('#companyChart').height() - 20;
                    if (x < 0 || y < 0) {
                        if (x < 0 && y < 0) {
                            CompanyChart.container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [3, 3] + ")scale(" + scale + ")");
                            CompanyChart.zoom.translate([3, 3]);
                        } else if (x < 0) {
                            CompanyChart.container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [3, y] + ")scale(" + scale + ")");
                            CompanyChart.zoom.translate([3, y]);
                        } else {
                            CompanyChart.container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [x, 3] + ")scale(" + scale + ")");
                            CompanyChart.zoom.translate([x, 3]);
                        }
                    } else if (x > maxX || y > maxY) {
                        if (x > maxX && y > maxY) {
                            CompanyChart.container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [maxX - 3, maxY - 3] + ")scale(" + scale + ")");
                            CompanyChart.zoom.translate([maxX - 3, maxY - 3]);
                        } else if (x > maxX) {
                            CompanyChart.container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [maxX - 3, y] + ")scale(" + scale + ")");
                            CompanyChart.zoom.translate([maxX - 3, y]);
                        } else {
                            CompanyChart.container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [x, maxY - 3] + ")scale(" + scale + ")");
                            CompanyChart.zoom.translate([x, maxY - 3]);
                        }
                    }
                });
            svg.call(drag);
        },
        /**
         * d3初始化location
         */
        initLocation: function() {
            CompanyChart.zoom.translate([CompanyChart.svg.attr('width') / 2, CompanyChart.svg.attr('height') / 2]);
            CompanyChart.zoom.scale(0.6);
            CompanyChart.container.attr("transform", "translate(" + CompanyChart.zoom.translate() + ")scale(" + CompanyChart.zoom.scale() + ")");
        },
        /**
         * d3实例zoom操作
         */
        zoomed: function() {
            CompanyChart.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        },
        /**
         * d3绘制图谱实例
         */
        drawTree: function(data) {
            var diagonal = d3.svg.diagonal.radial()
                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
            data.x0 = 0;
            data.y0 = 0;
            nodes = tree.nodes(CompanyChart.rootData);
            links = tree.links(nodes);
            var pathLength = 150;
            if (nodes.length > 100) {
                pathLength = 150;
            }
            nodes.forEach(function(d) {
                if (d.depth >= 2) {
                    d.y = d.depth * 300;
                } else {
                    d.y = d.depth * pathLength;
                }
            });
            var linkUpdate = CompanyChart.linkContainer.selectAll(".link")
                .data(links, function(d) { return d.target.id; });
            var linkEnter = linkUpdate.enter();
            var linkExit = linkUpdate.exit();
            linkEnter.append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = { x: data.x0, y: data.y0 };
                    return diagonal({ source: o, target: o });
                })
                .transition()
                .duration(500)
                .attr("d", diagonal)

            linkUpdate.attr("stroke", function(d) {
                    if (d.source.Category == 2 || d.target.Category == 2) {
                        return "#49ceb0";
                    }

                    if (d.source.Category == 3 || d.target.Category == 3) {
                        return "#7985f1";
                    }

                    if (d.source.Category == 4 || d.target.Category == 4) {
                        return "#65d289";
                    }

                    if (d.source.Category == 5 || d.target.Category == 5) {
                        return "#bd73e7";
                    }

                    if (d.source.Category == 6 || d.target.Category == 6) {
                        return "#e26012";
                    }

                    if (d.source.Category == 7 || d.target.Category == 7) {
                        return "#f59c28";
                    }

                    if (d.source.Category == 8 || d.target.Category == 8) {
                        return "#79a3f1";
                    }

                    if (d.source.Category == 9 || d.target.Category == 9) {
                        return "#3dc9f7";
                    }

                    return "#f35151";
                })
                .transition()
                .duration(500)
                .attr("d", diagonal)

            .attr("style", "fill: none; stroke-opacity: 1; stroke: #9ecae1; stroke-width: 1px;");
            linkExit.transition()
                .duration(500)
                .attr("d", function(d) {
                    var o = { x: data.x, y: data.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();
            var nodeUpdate = CompanyChart.container.selectAll(".node").data(nodes, function(d) { return d.id; });
            var nodeEnter = nodeUpdate.enter();
            var nodeExit = nodeUpdate.exit();
            var enterNodes = nodeEnter.append("g")
                .attr("class", function(d) { return "node"; })
                .attr("transform", function(d) { return "translate(" + CompanyChart.project(data.x0, data.y0) + ")"; });
            enterNodes.append("circle")
                .attr("r", 0)
                .attr("fill", function(d) {
                    if (d.Category == 1) {
                        // return "#3ea6ff";
                        return "#00aec7"
                    }
                    if (d.Category == 2) {
                        return "#f68717";
                    }
                    if (d.Category == 3) {
                        return "#5fbebf";
                    }
                    if (d.Category == 4) {
                        return "#63a074";
                    }
                    if (d.Category == 5) {
                        return "#906f54";
                    }
                    if (d.Category == 6) {
                        return "#e26012";
                    }
                    if (d.Category == 7) {
                        return "#e4c557";
                    }
                    if (d.Category == 8) {
                        return "#4a588e";
                    }
                    if (d.Category == 9) {
                        return "#8862ac";
                    }
                    return "#2277a2";
                })
                .attr("stroke", function(d) {

                    if (d.depth == 0) {
                        return "#7ecacb";
                    }

                    if (d.depth == 1) {
                        if (d.Category == 1) {
                            return "#4d91b4";
                        }

                        if (d.Category == 2) {
                            return "#f79e44";
                        }

                        if (d.Category == 3) {
                            return "#4d91b4";
                        }

                        if (d.Category == 4) {
                            return "#81b28f";
                        }

                        if (d.Category == 5) {
                            return "#a58b75";
                        }

                        if (d.Category == 6) {
                            return "#e57c7c";
                        }

                        if (d.Category == 7) {
                            return "#e8d078";
                        }

                        if (d.Category == 8) {
                            return "#6d78a4";
                        }

                        if (d.Category == 9) {
                            return "#9d80bc";
                        }
                    }

                    return null;
                })
                .attr("stroke-opacity", 0.5)
                .attr("stroke-width", function(d) {
                    if (d.depth == 0) {
                        return 10;
                    }

                    if (d.depth == 1) {
                        return 6;
                    }
                    return 0;
                })
                .on("click", function(d) {
                    if (d["id"] != 1) {
                        // 企业图谱&组织结构
                        if (CompanyChart.chartSearch === "chart_qytp" || CompanyChart.chartSearch === "chart_zzjg") {
                            CompanyChart.toggle(d);
                            CompanyChart.drawTree(d);
                        }
                    }
                });
            enterNodes.append("path")
                .attr("d", function(d) {
                    if (d.depth > 0 && d._children) {
                        return "M-6 -1 H-1 V-6 H1 V-1 H6 V1 H1 V6 H-1 V1 H-6 Z"
                    } else if (d.depth > 0 && d.children) {
                        return "M-6 -1 H6 V1 H-6 Z"
                    }
                })
                .attr("fill", "#ffffff")
                .attr("stroke", "#ffffff")
                .attr("stroke-width", "0.2")
                .on("click", function(d) {
                    if (d.depth > 0) {
                        CompanyChart.toggle(d);
                        CompanyChart.drawTree(d);
                    }
                });
            enterNodes.append("text")
                .attr("dy", function(d) {
                    if (d.depth == 0) {
                        return "-1.5em";
                    } else if (nodes.length == 2) {
                        return "2em";
                    }
                    return "0.31em";
                })
                .attr("x", function(d) {
                    if (d.depth == 0) {
                        return;
                        //                  return d.name.length * 8
                    } else if (nodes.length == 2) {
                        if (/^[\u4e00-\u9fa5]/.test(d.name)) {
                            return;
                            //              		return d.name.length * 8;
                        }
                        return;
                        //              	return d.name.length*6;
                    }
                    return d.x < 180 ? 15 : -15;
                })
                .text(function(d) { return d.name; })
                .style("text-anchor", function(d) {
                    if (d.depth == 0 || nodes.length == 2) {
                        return "middle";
                    }
                    return d.x < 180 ? "start" : "end";
                })
                .style("fill-opacity", 0)
                .attr("transform", function(d) {
                    if (d.depth > 0) {
                        return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
                    } else {
                        return "rotate(0)";
                    }
                })
                .style("font-size", function(d) {
                    if (d.depth == 0) {
                        return "18px";
                    }
                    return "18px";
                })
                .attr("fill", function(d) {
                    if (d.depth == 0) {
                        return "#00AEC7";
                    }
                    if (d.depth == 1) {
                        if (d.Category == 2) {
                            return "#2db092";
                        }

                        if (d.Category == 3) {
                            return "#3d4cd4";
                        }
                    }
                    return "#333";
                })
                .on("click", function(d) {

                    // TODO 高管单独处理
                    if (d.depth === 3 && d.Category === 7) {
                        return;
                    }
                    if (d.depth === 2 && d.Category === 7) {
                        if (d.itemType && d.itemType == 1 && d.KeyNo) {
                            Common.chartCardEventHandler({ companyCode: p.KeyNo, title: '人物信息', type: 'person', name: d.oldName })
                                // window.open("Person.html?id=" + p.KeyNo + '&name=' + d.name + Common.isNoToolbar());
                            return;
                        }
                        if (p.KeyNo && /^\d{10}$/.test(d.KeyNo)) {
                            Common.chartCardEventHandler({ companyCode: d.KeyNo, title: intl('120662' /* 企业信息 */ , '企业信息'), type: 'company', name: d.oldName })
                                // Common.linkCompany("Bu3", d.KeyNo);
                            return;
                        }
                    }

                    if (d.itemType && d.itemType == 1 && d.KeyNo) {
                        Common.chartCardEventHandler({ companyCode: d.KeyNo, title: '人物信息', type: 'person', name: d.name })
                            // window.open("Person.html?id=" + d.KeyNo + '&name=' + d.name + Common.isNoToolbar());
                        return;
                    }
                    if (d.KeyNo && d.depth > 0 && /^\d{10}$/.test(d.KeyNo)) {
                        Common.chartCardEventHandler({ companyCode: d.KeyNo, title: intl('120662' /* 企业信息 */ , '企业信息'), type: 'company', name: d.name })
                            // Common.linkCompany("Bu3", d.KeyNo);
                    }
                    // 企业图谱
                    // if (d.depth === 1) {
                    //     console.log(2);
                    //     var rotateStr = $(this).attr("transform").match(/rotate\((\S*?\))/g);
                    //     rotateStr = rotateStr ? Math.round(rotateStr[0].split('(')[1].split(')')[0] - 0) : 0;
                    //     CompanyChart.container.transition().duration(500).attr("transform", "translate(" + CompanyChart.zoom.translate() + ")scale(" + CompanyChart.zoom.scale() + ")" + "rotate(" + (0 - rotateStr) + ")");
                    // }
                });

            var updateNodes = nodeUpdate.transition()
                .duration(500)
                .attr("transform", function(d) { return "translate(" + CompanyChart.project(d.x, d.y) + ")"; });
            updateNodes.select("text")
                .style("fill-opacity", 1)
                .attr("transform", function(d) {
                    if (d.depth > 0 && nodes.length > 2) {
                        return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
                    } else {
                        return "rotate(0)";
                    }
                })
                .attr("dy", function(d) {
                    if (d.depth == 0) {
                        return "-1.5em";
                    } else if (nodes.length == 2) {
                        return "2em";
                    }
                    return "0.31em";
                })
                .attr("x", function(d) {
                    if (d.depth == 0) {
                        return;
                        //                  return d.name.length * 8;
                    } else if (nodes.length == 2) {
                        if (/^[\u4e00-\u9fa5]/.test(d.name)) {
                            //              		return d.name.length * 8;
                            return;
                        }
                        //              	return d.name.length*6;
                        return;
                    }
                    return d.x < 180 ? 15 : -15;
                })
                .attr("fill", function(d) {
                    if (d.depth == 0) {
                        return "#00AEC7";
                    }
                    if (d.depth == 1) {
                        if (d.Category == 2) {
                            return "#2db092";
                        }

                        if (d.Category == 3) {
                            return "#3d4cd4";
                        }
                    }
                    return "#333";
                })
                .style("text-anchor", function(d) {
                    if (d.depth == 0 || nodes.length == 2) {
                        return "middle";
                    }
                    return d.x < 180 ? "start" : "end";
                });
            updateNodes.select("circle")
                .attr("r", function(d) {
                    if (d.depth == 0) {
                        return 12;
                    }

                    if (d.depth == 1) {
                        return 10;
                    }

                    return 9;
                });
            updateNodes.select("path")
                .attr("d", function(d) {
                    if (d.depth > 0 && d._children && d._children.length > 0) {
                        return "M-6 -1 H-1 V-6 H1 V-1 H6 V1 H1 V6 H-1 V1 H-6 Z"
                    } else if (d.depth > 0 && d.children) {
                        return "M-6 -1 H6 V1 H-6 Z"
                    }
                });
            investInt = false;
            var exitNodes = nodeExit.transition()
                .duration(500)
                .attr("transform", function(d) { return "translate(" + CompanyChart.project(data.x, data.y) + ")"; })
                .remove();
            exitNodes.select("circle")
                .attr("r", 0);

            exitNodes.select("text")
                .style("fill-opacity", 0);

            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // var timer = null;
            // $(document).on('mouseover', '.chart-toolbar-left,#turnLeft', function(e) {
            //     var target = e.target;
            //     $(target).removeClass('animate')
            //     var deg = -45;
            //     try {
            //         timer && clearInterval(timer) && (timer = null);
            //         timer = setInterval(function left() {
            //             var rotateStr = CompanyChart.container.attr("transform").match(/rotate\((\S*?\))/g);
            //             rotateStr = rotateStr ? Math.round(rotateStr[0].split('(')[1].split(')')[0] - 0) : 0;
            //             CompanyChart.container.transition().duration(500).attr("transform", "translate(" + CompanyChart.zoom.translate() + ")scale(" + CompanyChart.zoom.scale() + ")" + "rotate(" + (rotateStr + deg) + ")");
            //         }, 400);
            //     } catch (e) {

            //     }
            // })

            // $(document).on('mouseout', '.chart-toolbar-left,#turnLeft', function(e) {
            //     var target = e.target;
            //     timer && clearInterval(timer) && (timer = null);
            //     $(target).addClass('animate')
            // })

            // $(document).on('mouseover', '.chart-toolbar-right,#turnRight', function(e) {
            //     var target = e.target;
            //     $(target).removeClass('animate')
            //     var deg = 45;
            //     try {
            //         timer && clearInterval(timer) && (timer = null);
            //         timer = setInterval(function left() {
            //             var rotateStr = CompanyChart.container.attr("transform").match(/rotate\((\S*?\))/g);
            //             rotateStr = rotateStr ? Math.round(rotateStr[0].split('(')[1].split(')')[0] - 0) : 0;
            //             CompanyChart.container.transition().duration(500).attr("transform", "translate(" + CompanyChart.zoom.translate() + ")scale(" + CompanyChart.zoom.scale() + ")" + "rotate(" + (rotateStr + deg) + ")");
            //         }, 400);
            //     } catch (e) {

            //     }
            // })

            // $(document).on('mouseout', '.chart-toolbar-right,#turnRight', function(e) {
            //     var target = e.target;
            //     timer && clearInterval(timer) && (timer = null);
            //     $(target).addClass('animate')
            // })

            // $(document).on('click', '#turnLeft', function() {
            //     var deg = 45
            //     try {
            //         var rotateStr = CompanyChart.container.attr("transform").match(/rotate\((\S*?\))/g);
            //         rotateStr = rotateStr ? Math.round(rotateStr[0].split('(')[1].split(')')[0] - 0) : 0;
            //         CompanyChart.container.transition().duration(500).attr("transform", "translate(" + CompanyChart.zoom.translate() + ")scale(" + CompanyChart.zoom.scale() + ")" + "rotate(" + (rotateStr + deg) + ")");
            //     } catch (e) {

            //     }
            // })

        },
        /**
         * d3节点数据转换
         */
        toggle: function(d) {
            var parent = d.parent;

            // 为了兼容企业图谱左侧筛选 单独处理
            // if (parent && parent._oldChild && parent._oldChild.length) {
            //     for (var i = 0; i < parent._oldChild.length; i++) {
            //         var node = parent._oldChild[i];
            //         if (node.id === d.id) {
            //             if (d.children) {
            //                 d._children = d.children;
            //                 d.children = null;
            //                 node._children = node.children;
            //                 node.children = null;
            //             } else {
            //                 d.children = d._children;
            //                 d._children = null;
            //                 node._children = node._children;
            //                 node._children = null;
            //             }
            //         }
            //     }
            // } else {
            //     if (d.children) {
            //         d._children = d.children;
            //         d.children = null;

            //     } else {
            //         d.children = d._children;
            //         d._children = null;

            //     }
            // }

            if (d.children) {
                d._children = d.children;
                d.children = null;

            } else {
                d.children = d._children;
                d._children = null;

            }
        },
        /**
         * d3旋转偏移
         */
        project: function(x, y) {
            var angle = (x - 90) / 180 * Math.PI,
                radius = y;
            return [radius * Math.cos(angle), radius * Math.sin(angle)];
        },
        /**
         * echart2绘制图谱通用实现
         */
        echart2CommonFuns: function(rootData, ratioKey, tag) {
            var chart = CompanyChart.echartInstance = null,
                option = null,
                treeId = 1;

            initMap(rootData, ratioKey, tag);
            CompanyChart.echart2CommonEvents(option, tag);

            /**
             * 初始化echart2实现的图谱
             * 
             * @param {any} data 
             * @param {any} ratioKey 持股比例字段
             * @param {any} tag 股权结构、对外投资(true)
             */
            function initMap(data, ratioKey, tag) {
                chart = CompanyChart.echartInstance = echarts.init(document.querySelector('#companyChart'));
                transTree(data, 'Id', CompanyChart.companyCode, ratioKey, tag);
                initTree(data, CompanyChart.companyCode);
                chart._innerOption = option = { // _innerOption记录option
                    // tooltip: {
                    //     trigger: 'item',
                    //     triggerOn: 'mousemove',
                    //     formatter: function(t) {
                    //         return t.name.replace(/\n/g, '');
                    //     }
                    // },
                    series: [{
                        type: "tree",
                        orient: "vertical",
                        nodePadding: 50, // 节点间距
                        layerPadding: 40, // 层间距
                        roam: 'move', // 是否开启拖拽缩放    
                        scaleLimit: { max: 1.1, min: 0.9 },
                        data: [data],
                        direction: tag ? '' : 'inverse', // 默认股权结构(inverse)
                        rootLocation: {
                            "x": "50%",
                            "y": tag ? "30%" : '60%'
                        }
                    }]
                };
                chart.setOption(option);
                Common.initZrender(chart, tag);
                Common.animatieChart(chart);

                chart.on('click', function(e) {
                    if (e.data.code && e.data.type === 'company') {
                        Common.linkCompany("Bu3", e.data.code);
                    } else if (e.data.code && e.data.type == 'person') {
                        // window.open('Person.html?id=' + e.data.code + '&name=' + e.data.name + Common.isNoToolbar());
                    }
                });

                chart.getZrender().on('click', function(e) {
                    if (e.target && e.target.clickcom) {
                        if (e.target.children || e.target._children) {
                            // troggleTree(e.target.code, e.target.treeId);
                            troggleTree(e.target.code, e.target.treeId, e.event.clientX, e.event.clientY, e.target);
                        }
                    }
                });

                chart.on('restore', function(param) {
                    getNode(rootData);

                    function getNode(data) {
                        if (data.children) {
                            for (var i = 0; i < data.children.length; i++) {
                                getNode(data.children[i]);
                            }
                        }
                        if (data.children && data.children.length > 0 && data.code && data.code != CompanyChart.companyCode) {
                            data._children = data.children;
                            data.children = null;
                            data.extend = 1;
                        }
                    }
                    chart.clear();
                    chart.setOption(option);
                    Common.initZrender(chart, tag);
                    Common.animatieChart(chart);
                });

                chart.on('ondragend', function() {

                })

                chart.getZrender().on('ondragend', function() {

                })

                chart.getZrender().on("mouseup", function(param) {

                    // var layer = chart.getZrender().painter._layers[1];
                    // var x = Math.abs(layer.position[0]);
                    // var y = Math.abs(layer.position[1]);
                    // var ry = layer.position[1];
                    // var width = chart.getZrender().getWidth() / 2;
                    // var height = chart.getZrender().getHeight() / 2;

                    // console.log(2);

                    // if (x > width || y > height) {
                    //     var animation = chart.getZrender().animation;
                    //     // layer.scale = [0.2, 0.2, 0, 0];
                    //     // layer.rotation = [0, 40, 400];
                    //     layer.position = [-(width - 50), ry];
                    //     // chart.getZrender().render();
                    //     animation.animate(layer).when(400, {
                    //         scale: [1, 1, -width, 0]
                    //     }).start('spline').done(function() {
                    //         // layer.scale[2] = -(width - 50);
                    //         // layer.scale[3] = ry;
                    //     }).during(function() {
                    //         chart.getZrender().render();
                    //     });
                    // }
                });

            };

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

                var children = data.children;
                var fontSize = 15;
                var color = '#333';

                if (tag) {
                    data.isTZ = true;
                } else {
                    data.isGD = true;
                }

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

                // 如果为个人，颜色区分，且不可点击
                // if (data.type !== 'company') {
                //     color = '#00AEC7';
                //     data.labelClick = false;
                // } else {
                //     data.labelClick = true;
                // }

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
                        borderColor: "#50AFC6",
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
                        color: "#50AFC6",
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
                        if (Ratio) {
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
                    data.name = data.name || CompanyChart.companyName;
                }
                data.symbolSize = [data.name.length * 16 + 40, 50];
                data.symbol = 'rectangle';
                var color = '#000'
                if (data.code == rootCode) {
                    color = '#00AEC7'
                }
                data.itemStyle = {
                    normal: {
                        color: "#fff",
                        borderWidth: "2",
                        borderColor: "#50AFC6",
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

            /**
             * 展开、收起操作
             * 
             * @param {any} code 企业code
             * @param {any} tid 树节点id
             * @returns 
             */
            function troggleTree(code, tid, x, y, t) {
                if (code == CompanyChart.companyCode) {
                    return;
                }
                // 持股比例显示/隐藏，默认显示，即字段_rateHide = false
                var rateHide = rootData._rateHide ? true : false;
                getNode(rootData);

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

                // var wy = window.document.body.clientHeight;
                // var wy = 874;
                // var wx = window.document.body.clientWidth;
                // option.series[0].rootLocation.x = wx / 2 - (x - wx / 2);
                // option.series[0].rootLocation.y = wy * 0.3 - (y - wy / 2);
                chart.clear();
                chart.setOption(option);
                Common.initZrender(chart, tag);
            }
        },
        /**
         * 通用事件操作，适用于：股权结构、对外投资等使用echart2生成的echart实例
         * @param option echart2实例的option
         * @param tag 股权结构、对外投资(true)
         */
        echart2CommonEvents: function(option, tag) {
            // 展开、收起
            CompanyChart.events.eventOne = function() {
                var name = $('#chartActionOne').text();
                if (name === '展开') {
                    if (CompanyChart.rootData.children) {
                        expandAndFoldAction(false, tag)
                        $('#chartActionOne').addClass('chart-fold');
                        $('#chartActionOne').find('span').text('收起');
                    }
                } else {
                    if (CompanyChart.rootData.children) {
                        expandAndFoldAction(true, tag)
                        $('#chartActionOne').removeClass('chart-fold');
                        $('#chartActionOne').find('span').text('展开');
                    }
                }
            }

            /**
             * 展开、收起操作
             * 
             * @param {any} type 默认展开操作，为true时执行收起动作
             * @param {any} tag  股权结构、对外投资(true)
             */
            function expandAndFoldAction(type, tag) {

                var getNode = null;

                if (!type) {
                    // 展开
                    getNode = function(data) {
                        if (data._children) {
                            data.children = data._children;
                            data._children = null;
                            data.extend = 2;
                        }
                        if (data.children) {
                            for (var i = 0; i < data.children.length; i++) {
                                getNode(data.children[i], type);
                            }
                        }
                    }
                } else {
                    // 收起
                    getNode = function(data) {
                        if (data.children) {
                            for (var i = 0; i < data.children.length; i++) {
                                getNode(data.children[i], type);
                            }
                        }
                        if (data.children && data.children.length > 0 && data.code && data.code != CompanyChart.companyCode) {
                            data._children = data.children;
                            data.children = null;
                            data.extend = 1;
                        }
                    }
                }
                getNode(CompanyChart.rootData);
                CompanyChart.echartInstance.clear();
                CompanyChart.echartInstance.setOption(option);
                Common.initZrender(CompanyChart.echartInstance, tag);

                // 是否回到初始状态，类似刷新
                Common.animatieChart(CompanyChart.echartInstance);
            }

            // 刷新
            CompanyChart.events.eventTwo = function() {
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
            }

            /**
             * 放大、缩小操作
             * 
             * @param {any} type 操作类型，1：放大；2：缩小
             * @param {any} myChart chart实例
             */
            function scaleAction(type, myChart) {
                var centerX = myChart.getZrender().getWidth() / 2;
                var centerY = myChart.getZrender().getHeight() / 2;
                var layer = myChart.getZrender().painter._layers[1];
                var x = layer.scale[0] * centerX + layer.position[0];
                var y = layer.scale[1] * centerY + layer.position[1];
                var scale = layer.scale[0];
                if (type == 1) {
                    scale += 0.3;
                } else if (type == 2) {
                    scale -= 0.3;
                }
                if (scale >= 0.3 && scale <= 2) {
                    layer.scale[0] = scale;
                    layer.scale[1] = scale;
                    myChart.getZrender().render();
                    layer.position[0] = x - layer.scale[0] * centerX
                    layer.position[1] = y - layer.scale[1] * centerY
                    myChart.getZrender().render();
                }
            }

            // 放大
            CompanyChart.events.eventThree = function(tag) {
                scaleAction(1, CompanyChart.echartInstance);
            }

            // 缩小
            CompanyChart.events.eventFour = function() {
                scaleAction(2, CompanyChart.echartInstance);
            }
        },
        /**
         * 通用事件操作，适用于：企业图谱、组织结构等只有两层图形结构的D3实例 
         */
        d3CommonEvents: function() {
            // 展开、收起
            CompanyChart.events.eventOne = function() {
                var name = $('#chartActionOne').text();
                if (name === '展开') {
                    if (CompanyChart.rootData.children) {
                        CompanyChart.d3ExpandAll(CompanyChart.rootData.children)
                        CompanyChart.drawTree(CompanyChart.rootData);
                        $('#chartActionOne').addClass('chart-fold');
                        $('#chartActionOne').find('span').text('收起');
                    }
                } else {
                    if (CompanyChart.rootData.children) {
                        CompanyChart.d3FoldAll(CompanyChart.rootData.children)
                        CompanyChart.drawTree(CompanyChart.rootData);
                        $('#chartActionOne').removeClass('chart-fold');
                        $('#chartActionOne').find('span').text('展开');
                    }
                }
            }

            // 刷新
            CompanyChart.events.eventTwo = function() {
                if ('chart_qytp' === CompanyChart.chartSearch) {
                    var eles = $('.chart-nav').find('button');
                    Array.prototype.forEach.call(eles, function(e) {
                        if (!$(e).hasClass('wi-secondary-bg')) {
                            $(e).addClass('wi-secondary-bg')
                        }
                    });
                    CompanyChart.loadQYTP();
                } else {
                    CompanyChart.d3ExpandAll(CompanyChart.rootData.children)
                    CompanyChart.initLocation();
                    CompanyChart.drawTree(CompanyChart.rootData);
                }
            }

            // 缩放动作
            var scaleAction = function(tag) {
                var scale = CompanyChart.zoom.scale();
                if (tag) {
                    scale = scale - 0.4;
                } else {
                    scale = scale + 0.4;
                }
                if (scale >= 0.4 && scale <= 2) {
                    CompanyChart.zoom.scale(scale);
                    CompanyChart.container.transition().duration(500).attr("transform", "translate(" + CompanyChart.zoom.translate() + ")scale(" + CompanyChart.zoom.scale() + ")");
                }
            }

            // 放大
            CompanyChart.events.eventThree = function(tag) {
                scaleAction();
            }

            // 缩小
            CompanyChart.events.eventFour = function() {
                scaleAction(true);
            }
        },
        /**
         * 展开所有子层，适用于：企业图谱、组织结构等只有两层图形结构的D3实例
         */
        d3ExpandAll: function(data) {
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]._children) {
                        data[i].children = data[i]._children;
                        data[i]._children = null;
                    }
                }
            }
        },
        /**
         * 折叠所有子层，适用于：企业图谱、组织结构等只有两层图形结构的D3实例
         */
        d3FoldAll: function(data) {
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children) {
                        data[i]._children = data[i].children;
                        data[i].children = null;
                    }
                }
            }
        },
        /**
         * 绘制实际控制人路径
         */
        drawActualcontrollerroute: function(root, param, thisRatio, controlname) {
            var totalLevel = 0; // 最高层级

            function getNodeLocation(nodes, links) {

                var distance = 190;
                var xDistance = 220;

                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].Depth > totalLevel) {
                        totalLevel = nodes[i].Depth;
                    }
                }

                if (totalLevel > 5) {
                    distance = distance - totalLevel * 6;
                }

                // TODO 纵向
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].Depth + 0) {
                        nodes[i].y = 200 + (totalLevel - nodes[i].Depth) * distance;
                    } else {
                        nodes[i].y = 200 + totalLevel * distance; // 目标公司Y轴位置
                    }
                }

                for (var i = 0; i <= totalLevel; i++) {
                    var temp = []; // 记录相同层级的节点
                    for (var j = 0; j < nodes.length; j++) {
                        if (nodes[j].Depth == i) {
                            temp.push(nodes[j]);
                        }
                    }

                    for (var k = 0; k < temp.length; k++) {
                        temp[k].x = (width - (temp.length - 1) * xDistance) / 2 + xDistance * k;
                    }
                }

                // 当所有路径与点刚好绘制成一个圆时 (三角形、菱形)
                if (links && links.length && nodes.length === links.length) {
                    for (var i = 1; i < nodes.length - 1; i++) {
                        nodes[i].x = (width - i * xDistance) / 2 + xDistance * i;
                    }
                }

                // TODO 横向
                // for (var i = 0; i < nodes.length; i++) {
                //     if (nodes[i].Depth + 0) {
                //         nodes[i].x = 200 + (totalLevel - nodes[i].Depth) * distance;
                //     } else {
                //         nodes[i].x = 200 + totalLevel * distance; // 目标公司Y轴位置
                //     }
                // }

                // for (var i = 0; i <= totalLevel; i++) {
                //     var temp = []; // 记录相同层级的节点
                //     for (var j = 0; j < nodes.length; j++) {
                //         if (nodes[j].Depth == i) {
                //             temp.push(nodes[j]);
                //         }
                //     }

                //     for (var k = 0; k < temp.length; k++) {
                //         temp[k].y = (width - (temp.length - 1) * xDistance) / 2 + xDistance * k;
                //     }
                // }

                // // 当所有路径与点刚好绘制成一个圆时 (三角形、菱形)
                // if (links && links.length && nodes.length === links.length) {
                //     for (var i = 1; i < nodes.length - 1; i++) {
                //         nodes[i].y = (width - i * xDistance) / 2 + xDistance * i;
                //     }
                // }

            }

            function zoomed() {
                // container.attr("transform", d3.event.transform);
                container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function dragged(d) {
                var lines = svgLinks.selectAll("path");
                lines.attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy),
                        //theta = Math.atan2(dy, dx) + Math.PI / 7.85,
                        theta = Math.atan2(dy, dx) + Math.PI / 720,
                        d90 = Math.PI / 2,
                        dtxs = d.target.x - (d.target.r) * Math.cos(theta),
                        dtys = d.target.y - (d.target.r) * Math.sin(theta);
                    return "M" + d.source.x + "," + d.source.y
                        //+ "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y
                        +
                        "L" + d.target.x + "," + d.target.y +
                        "M" + dtxs + "," + dtys + "l" + (3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (-3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "L" + (dtxs - 3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (dtys + 3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "z";
                });

                //更新连接线上文字的位置
                edges_text.attr("x", function(d) {
                    return (d.source.x + d.target.x) / 2 - d.Ratio.length / 2 * 10;
                });

                edges_text.attr("y", function(d) {
                    return (d.source.y + d.target.y) / 2 - 3;
                });

                edges_text.attr("transform", function(d) {
                    var x = (d.source.x + d.target.x) / 2;
                    var y = (d.source.y + d.target.y) / 2;
                    var angle = 0;
                    if (d.target.x - d.source.x == 0) {
                        if (d.target.y > d.source.y) {
                            angle = 90;
                        } else {
                            angle = -90
                        }
                    } else {
                        angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x)) * 180 / Math.PI;
                    }
                    return "rotate(" + angle + " " + x + "," + y + ")";
                });
                edges_rect.attr("transform", function(d) {
                    var x = (d.source.x + d.target.x) / 2;
                    var y = (d.source.y + d.target.y) / 2;
                    var angle = 0;
                    if (d.target.x - d.source.x == 0) {
                        if (d.target.y > d.source.y) {
                            angle = 90;
                        } else {
                            angle = -90
                        }
                    } else {
                        angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x)) * 180 / Math.PI;
                    }
                    return "rotate(" + angle + " " + x + "," + y + ")";
                });

                // d3.select(this).select("circle").attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
                d3.select(this).attr("transform", function(d) {
                    d.x = d3.event.x;
                    d.y = d3.event.y;
                    return "translate(" + d3.event.x + "," + d3.event.y + ")";
                });
            }
            // var width = document.querySelector('#main').clientWidth;
            // var height = document.querySelector('#main').clientHeight > 0 ? document.querySelector('#main').clientHeight : 640;

            var width = document.querySelector('#companyChart').clientWidth;
            var height = $(window).height() - CompanyChart.chartHeaderHeight;

            if (!root.NodeList) {
                root.NodeList = [];
            }
            if (!root.RelationList) {
                root.RelationList = [];
            }

            root.NodeList.push({
                NodeId: param.companyCode,
                NodeName: param.rootName,
                Depth: 0
            });
            // root.NodeList.push({
            //     NodeId: param.secondCode,
            //     NodeName: param.controllername
            // });
            if (root.RelationList.length == 0) {
                //如果没有数据的时候，把两个公司直接画线
                root.RelationList.push({
                    OrigionId: param.secondCode,
                    TargetId: param.companyCode
                });
            }
            var nodes = root.NodeList;
            var links = root.RelationList;

            for (var i = 0; i < links.length; i++) {
                if (links[i].Ratio) {
                    links[i].Ratio += '';
                } else {
                    //如果没有数据的时候，画线以后把父层表格
                    if (thisRatio && links.length == 1) {
                        links[i].Ratio = thisRatio;
                    } else {
                        links[i].Ratio = '0';
                    }
                }
                if (!links[i].OrigionId) {
                    links[i].OrigionId = param.secondCode;
                }
                if (!links[i].TargetId) {
                    links[i].TargetId = param.companyCode;
                }
                if (links[i].Ratio.indexOf('.') > -1) {
                    links[i].Ratio = (parseFloat(links[i].Ratio)).toFixed(2);
                }
            }

            for (var i = 0; i < root.NodeList.length; i++) {
                // 5 = 2+3, 保证其至少大于1
                root.NodeList[i].Grade = 2 + Math.floor(i / 3);
                // 目标公司
                if (root.NodeList[i].NodeId == param.companyCode) {
                    root.NodeList[i].Grade = 1;
                    root.NodeList[i].isRoot = true;
                } else if (param.ctrlIdArr.indexOf(root.NodeList[i].NodeId) > -1) {
                    root.NodeList[i].isCtrl = true;
                    root.NodeList[i].Grade = 1;
                }
                if (/^[\u4e00-\u9fa5]/.test(root.NodeList[i].NodeName)) { //中文名称
                    if (root.NodeList[i].NodeName.length > 5) {
                        var depth = root.NodeList[i].NodeName.length / 5;
                        root.NodeList[i].r = ((Math.ceil(depth + 2) * 17) / 2) > 39 ? (Math.ceil(depth + 2) * 17) / 2 : 39;
                    } else {
                        root.NodeList[i].r = ((root.NodeList[i].NodeName.length * 17) / 2) > 39 ? ((root.NodeList[i].NodeName.length * 17) / 2) : 39;
                    }
                } else { //英文名称
                    var enArr = root.NodeList[i].NodeName.split(' ');
                    var maxLength = Math.max(enArr[0].length, enArr.length); //取单词最大长度或者行数最大作为计算半径的基础
                    for (var el = 0; el < enArr.length; el++) {
                        maxLength = Math.max(maxLength, enArr[el].length);
                    }
                    root.NodeList[i].r = ((maxLength * 10) / 2) > 39 ? ((maxLength * 10) / 2) : 39;
                }
            }

            // 计算节点位置
            getNodeLocation(nodes, links);

            for (var i = 0; i < links.length; i++) {
                for (var j = 0; j < nodes.length; j++) {
                    if (links[i].OrigionId == nodes[j].NodeId) {
                        links[i].source = nodes[j];
                    }

                    if (links[i].TargetId == nodes[j].NodeId) {
                        links[i].target = nodes[j];
                    }
                }

            }
            document.querySelector('#companyChart').innerHTML = '';
            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 1])
                .on("zoom", zoomed);
            var svg = d3.select("#companyChart").append("svg").attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("width", width)
                .attr("height", height);
            var container = svg.append("g");
            svg.call(zoom);
            var svgLinks = container.selectAll(".link").
            data(links)
                .enter()
                .append("g");
            var svgNodes = container.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                // .call(d3.behavior.drag()
                //     .on("drag", dragged)
                // )
                // .on("click", function(d) {
                //     if (d.Type == 'person' && d.IsLinkable && d.NodeId) {
                //         window.open('Person.html?id=' + d.NodeId + '&name=' + d.NodeName + Common.isNoToolbar());
                //         return;
                //     }
                //     if (d.IsLinkable && d.NodeId) {
                //         Common.linkCompany("Bu3", d.NodeId);
                //     }
                // });

            var dragCall = d3.behavior.drag()
                .on("drag", function() {
                    var attr = container.attr('transform');
                    var xy = attr.split(')')[0].split('(')[1].split(',');
                    var s = attr.split('scale(')[1].split(')')[0] - 0;
                    var x0 = (xy[0] - 0);
                    var y0 = (xy[1] - 0);
                    var x = Math.abs(xy[0] - 0);
                    var y = Math.abs(xy[1] - 0);
                    var maxX = $('#companyChart').width() / 2;
                    var maxY = ($('#companyChart').height() - 20) / 2;
                    if (x > maxX || y > maxY) {
                        if (x > maxX && y > maxY) {
                            container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [x0 < 0 ? -maxX : maxX, y0 < 0 ? -maxY : maxY] + ")scale(" + s + ")");
                            zoom.translate([3, 3]);
                        } else if (x > maxX) {
                            container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [x0 < 0 ? -maxX : maxX, y0] + ")scale(" + s + ")");
                            zoom.translate([x0 < 0 ? -maxX : maxX, y0]);
                        } else {
                            container.transition()
                                .duration(500)
                                .attr("transform", "translate(" + [x0, y0 < 0 ? -maxY : maxY] + ")scale(" + s + ")");
                            zoom.translate([x0, y0 < 0 ? -maxY : maxY]);
                        }
                    }
                });
            svg.call(dragCall);

            svgLinks.append("path")
                .style("fill", "#aaa")
                .style("stroke", "#aaa")
                .style("stroke-opacity", ".5")
                .attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy),
                        theta = Math.atan2(dy, dx) + Math.PI / 720,
                        d90 = Math.PI / 2,
                        dtxs = d.target.x - (d.target.r) * Math.cos(theta),
                        dtys = d.target.y - (d.target.r) * Math.sin(theta);
                    return "M" + d.source.x + "," + d.source.y +
                        "L" + d.target.x + "," + d.target.y +
                        "M" + dtxs + "," + dtys + "l" + (3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (-3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "L" + (dtxs - 3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (dtys + 3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "z";
                });


            svgLinks.each(function(d) {
                d3.select(this).append("text")
                    .attr("class", "linetext")
                    .attr("fill", function(d) {
                        if (d.Ratio == '100') {
                            return "#B91818";
                        } else {
                            return "#50AFC6";
                        }
                    })
                    .attr("fill-opacity", 1)
                    .text(function(d) {
                        if (d.Ratio && d.Ratio != '?') {
                            return d.Ratio * 100 / 100 + '%';
                        } else {
                            return '';
                        }
                    });
            });

            initLocation();

            var edges_text = svgLinks.selectAll(".linetext");
            var edges_rect = svgLinks.selectAll(".linerect");
            edges_text.attr("font-size", "12px");
            edges_text.attr("x", function(d) {
                if (d.source.x > d.target.x) {
                    return (d.source.x + d.target.x - (d.Ratio.length) * 10) / 2;
                }
                return (d.source.x + d.target.x) / 2 - d.Ratio.length / 2 * 10;
            });

            edges_text.attr("y", function(d) {
                if (d.source.y > d.target.y) {
                    return (d.source.y + d.target.y) / 2 - 3;
                }
                return (d.source.y + d.target.y) / 2 + 3;
            });


            edges_text.attr("transform", function(d) {
                var x = (d.source.x + d.target.x) / 2;
                var y = (d.source.y + d.target.y) / 2;
                var angle = 0;
                if (d.target.x - d.source.x == 0) {
                    if (d.target.y > d.source.y) {
                        angle = 90;
                    } else {
                        angle = -90
                    }
                } else {
                    angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x)) * 180 / Math.PI;
                }
                return "rotate(" + angle + " " + x + "," + y + ")";
            });

            svgNodes.append("circle")
                .attr("r", function(d) {
                    return d.r;
                })
                .attr("style", "cursor: pointer;")
                .attr("fill", function(d) {
                    if (d.isRoot) {
                        return "#f68717";
                    }
                    if (d.isCtrl || d.NodeName == controlname) {
                        return "#e05d5d";
                    } else {
                        return "#2277a2";
                    }

                });
            svgNodes.each(function(d, i) {
                if (/^[\u4e00-\u9fa5]/.test(d.NodeName)) {
                    var lines = Math.ceil(d.NodeName.length / 5);
                    var text = "";
                    //          	var dx = 0;
                    var dy = 0;
                    for (var line = 0; line < lines; line++) {
                        if (d.CategoryId == 2) {
                            //                  	dx = 0 - d.NodeName.length * 5;
                            dy = 3;
                            d3.select(this)
                                .append("text")
                                .attr("style", "cursor: pointer;")
                                //                      	.attr("dx", dx - 2)
                                .attr("dy", dy)
                                .attr("fill", "#fff")
                                .attr("font-size", "12px")
                                .text(d.NodeName)
                                .on('click', function(d) {
                                    if (d.Type == 'person' && d.IsLinkable && d.NodeId) {
                                        Common.chartCardEventHandler({ companyCode: d.NodeId, title: '人物信息', type: 'person', name: d.NodeName })
                                            // window.open('Person.html?id=' + d.NodeId + '&name=' + d.NodeName + Common.isNoToolbar());
                                        return;
                                    }
                                    if (d.IsLinkable && d.NodeId) {
                                        Common.chartCardEventHandler({ companyCode: d.NodeId, title: '企业信息', type: 'company', name: d.NodeName })
                                            // Common.linkCompany("Bu3", d.NodeId);
                                    }
                                })
                                .style("text-anchor", "middle");
                        } else if (lines == 1) {
                            //	                    dx = -13-(d.NodeName.length-2)*5;
                            dy = 5;

                            d3.select(this)
                                .append("text")
                                .attr("style", "cursor: pointer;")
                                //                      	.attr("dx", dx)
                                .attr("dy", dy)
                                .attr("font-size", "12px")
                                .attr("fill", "#fff")
                                .text(d.NodeName.substr(line * 5, 5))
                                .on('click', function(d) {
                                    if (d.Type == 'person' && d.IsLinkable && d.NodeId) {
                                        // window.open('Person.html?id=' + d.NodeId + '&name=' + d.NodeName + Common.isNoToolbar());
                                        Common.chartCardEventHandler({ companyCode: d.NodeId, title: '人物信息', type: 'person', name: d.NodeName })
                                        return;
                                    }
                                    if (d.IsLinkable && d.NodeId) {
                                        // Common.linkCompany("Bu3", d.NodeId);
                                        Common.chartCardEventHandler({ companyCode: d.NodeId, title: '企业信息', type: 'company', name: d.NodeName })
                                    }
                                })
                                .style("text-anchor", "middle");
                        } else {
                            //              		dx = -10 * 2.5;
                            //                  	if (line == (lines - 1)) {
                            //                      	dx = 0 - 5 * (d.NodeName.substr(line * 5, 5).length);
                            //                  	}
                            dy = 13 * line - lines * 2.5;

                            d3.select(this)
                                .append("text")
                                .attr("style", "cursor: pointer;")
                                //                      	.attr("dx", dx - 4)
                                .attr("dy", dy)
                                .attr("font-size", "12px")
                                .attr("fill", "#fff")
                                .text(d.NodeName.substr(line * 5, 5))
                                .on('click', function(d) {
                                    if (d.Type == 'person' && d.IsLinkable && d.NodeId) {
                                        Common.chartCardEventHandler({ companyCode: d.NodeId, title: '人物信息', type: 'person', name: d.NodeName })
                                            // window.open('Person.html?id=' + d.NodeId + '&name=' + d.NodeName + Common.isNoToolbar());
                                        return;
                                    }
                                    if (d.IsLinkable && d.NodeId) {
                                        Common.chartCardEventHandler({ companyCode: d.NodeId, title: '企业信息', type: 'company', name: d.NodeName })
                                            // Common.linkCompany("Bu3", d.NodeId);
                                    }
                                })
                                .style("text-anchor", "middle");
                        }

                    }
                } else {
                    var lineArr = d.NodeName.split(' ');
                    var lineNum = d.NodeName.split(' ').length;
                    if (d.NodeName.split(' ').length % 2 == 0) {
                        var dyy = -2.5;
                    } else {
                        var dyy = 5;
                    }
                    var tent = Math.ceil(lineNum / 2);
                    var tentArr = [];
                    var tentStr = 0;
                    for (var tentl = lineNum; tentl > 0; tentl--) {
                        tentStr = tent - tentl;
                        tentArr.push(tentStr);
                    }
                    var text = "";
                    //          	var dx = 0;
                    var dy = 5;
                    for (var tl = 0; tl < lineNum; tl++) {
                        //          		dx=0-Math.ceil(lineArr[tl].length / 2)*6;
                        dy = dyy + tentArr[tl] * 11;

                        d3.select(this)
                            .append("text")
                            .attr("style", "cursor: pointer;")
                            //                      .attr("dx", dx)
                            .attr("dy", dy)
                            .attr("font-size", "12px")
                            .attr("fill", "#fff")
                            .text(lineArr[tl])
                            .style("text-anchor", "middle");
                    }
                }
            });

            function initLocation() {
                zoom.translate([0, 0]);
                zoom.scale(1);
                container.attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + zoom.scale() + ")");
            }
        },
        /**
         * 获取企业基本信息
         */
        initCompanyInfo: function(successCall) {
            var parameter = { "companycode": CompanyChart.companyCode };
            myWfcAjax("getcorpbasic", parameter, function(res) {
                var data = JSON.parse(res);
                if (data && data.ErrorCode == 0) {
                    CompanyChart.companyName = (data.Data ? data.Data.companyName : '--');
                    CompanyChart.companyId = (data.Data ? data.Data.companyId : '--');
                }
                successCall();
            }, function() {
                successCall();
            })
        },
        /**
         * 企业图谱
         */
        loadQYTP: function() {
            Common.burypcfunctioncode('922602100360');
            // CompanyChart.invokeD3(3, 'd3.min.js');
            $('#companyChart svg').remove();
            $('#rContent').find('#toolNav').remove();

            var parameter = { "companycode": CompanyChart.companyCode };
            var htmlArr = [];
            var resCopy = {};

            htmlArr.push('<div id="toolNav">');
            htmlArr.push('<div class="chart-nav">');
            htmlArr.push('<div><div class="chart-nav-title" data-key="股东">' + intl('32959' /* 股东 */ , '股东') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn _not_selected" data-api="Shareholder" data-key="当前股东">' + intl('138507' /* 当前股东 */ , '当前股东') + '</button><button class="chart-nav-btn _not_selected" data-api="HistShareholder" data-key="历史股东">' + intl('138326' /* 历史股东 */ , '历史股东') + '</button></div>');
            htmlArr.push('<div><div class="chart-nav-title" data-key="法人">' + intl('138733' /* 法人 */ , '法人') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn _not_selected" data-api="LegalPers" data-key="现任法人">' + intl('138369' /* 现任法人 */ , '现任法人') + '</button><button class="chart-nav-btn _not_selected" data-api="HistLegalPers" data-key="历史法人">' + intl('138322' /* 历史法人 */ , '历史法人') + '</button></div>');
            htmlArr.push('<div><div class="chart-nav-title" data-key="投资">' + intl('102836' /* 投资 */ , '投资') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn _not_selected" data-api="ControlledCorps" data-key="实际控股">' + intl('138627' /* 实际控股 */ , '实际控股') + '</button><button class="chart-nav-btn _not_selected" data-api="Invests" data-key="直接参股">' + intl('138628' /* 直接参股 */ , '直接参股') + '</button></div>');
            htmlArr.push('<div><div class="chart-nav-title" data-key="诉讼">' + intl('138732' /* 诉讼 */ , '诉讼') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn _not_selected" data-api="JudgeDefendant" data-key="原告">' + intl('108789' /* 原告 */ , '原告') + '</button><button class="chart-nav-btn _not_selected" data-api="JudgeProsecutor" data-key="被告">' + intl('142956' /* 被告 */ , '被告') + '</button><button class="chart-nav-btn _not_selected" data-api="JudgeThirdParty" data-key="第三方">' + intl('138547' /* 第三方 */ , '第三方') + '</button></div>');
            htmlArr.push('<div><div class="chart-nav-title" data-key="其他">' + intl('23435' /* 其他 */ , '其他') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="ActControInfos" data-key="实际控制人">' + intl('138752' /* 实际控制人 */ , '实际控制人') + '</button><button class="chart-nav-btn wi-secondary-bg" data-api="GG" data-key="高管">' + intl('64504' /* 高管 */ , '高管') + '</button><button class="chart-nav-btn wi-secondary-bg" data-api="Branch" data-key="分支机构">' + intl('138183' /* 分支机构 */ , '分支机构') + '</button><button class="chart-nav-btn wi-secondary-bg" data-api="Companylist" style="margin-top:10px;" data-key="竞争对手">' + intl('138219' /* 竞争对手 */ , '竞争对手') + '</button></div>');

            htmlArr.push('<ul class="chart-nav-slide"></ul>');
            htmlArr.push('</div>');

            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            // htmlArr.push('<li class="chart-header-export"><span>导出列表</span></li>');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ , '保存图片') + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ , '刷新') + '</span></li>');
            htmlArr.push('</ul></div>');

            htmlArr.push('</div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');
            $('#load_data').css('display', 'block');

            $('.chart-nav').off('click', 'button');
            $('.chart-nav').off('click', '.chart-nav-slide');
            $('.chart-header-save').off('click');
            $('.chart-header-export').off("click");
            $('.chart-header-reload').off("click");

            myWfcAjax("getrelationinfot", parameter, function(data) {
                var data = JSON.parse(data);
                if (data && data.ErrorCode == 0) {
                    var res = data.Data[0];
                    $.extend(true, resCopy, res);
                    // var reset = CompanyChart.resetResData(res); //重新整理数据                    
                    var reset = CompanyChart.resetEachDataNew(res);
                    $('#load_data').hide();
                    $('#no_data').hide();
                    try {
                        CompanyChart.rootData = reset.Result.Node;
                        CompanyChart.traverseTreeId(CompanyChart.rootData);
                        CompanyChart.draw(CompanyChart.rootData);
                        CompanyChart.d3CommonEvents();
                        $('.chart-nav').on('click', 'button', qytpNavEvent);
                        $('.chart-header-save').on('click', qytpSaveImgEvent);
                        $('.chart-header-export').on("click", qytpListEvent);
                        $('.chart-header-reload').on("click", qytpReloadEvent);
                        $('.chart-nav').on('click', '.chart-nav-slide', qytpSlideEvent);
                    } catch (e) {
                        CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                        console.log('企业图谱绘制失败:' + e);
                    }
                } else {
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                    console.log('企业图谱数据/接口异常');
                }
            }, function(data) {
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                console.log('企业图谱服务端异常');
            });

            function qytpSlideEvent(e) {
                var parent = $(e.target).parent();
                var root = $(parent).closest('#rContent');
                var width = $('#screenArea').width();
                if ($(parent).hasClass('chart-hide')) {
                    $(parent).removeClass('chart-hide')
                    $(root).addClass('has-nav')
                    $(root).find('#companyChart svg').attr('width', $('#screenArea').width() - 300);
                } else {
                    $(parent).addClass('chart-hide')
                    $(root).removeClass('has-nav')
                    $(root).find('#companyChart svg').attr('width', $('#screenArea').width() + 300);
                }
            }

            /**
             * 企业图谱左侧nav事件委托
             * 
             * @param {any} e 
             */
            function qytpNavEvent(e) {
                var target = e.target;
                var firstType = type = $(target).siblings('div').attr("data-key");
                var type = $(target).attr("data-key");
                var selected = $(target).hasClass('wi-secondary-bg') ? true : false; // 默认全部选中

                var oldSelected = $(target).parent().children('.wi-secondary-bg').not('[data-api="all"]')
                var childEles = $(target).parent().children().not('[data-api="all"]')
                var parentSelected = $(target).siblings('[data-api=all]').hasClass('wi-secondary-bg');
                var tIndex = $(target).parent().children().index($(target)) - 2;
                var otherSelected = $('.chart-nav-child-other').children('button:not(.wi-secondary-bg)').length;

                var allSelectedNum = $('.chart-nav .wi-secondary-bg').length;

                if (allSelectedNum == 1 && selected) {
                    layer.msg('请保留至少一个条件!');
                    return false;
                }

                if (firstType === '其他') {
                    if (selected) {
                        // children
                        if (CompanyChart.rootData && CompanyChart.rootData.children && CompanyChart.rootData.children.length) {
                            var tmpRoot = CompanyChart.rootData.children
                            for (var i = 0; i < tmpRoot.length; i++) {
                                var node = tmpRoot[i];
                                // 找到对应分支
                                if (node.name === type) {
                                    node.parent._oldChild = node.parent._oldChild || [];
                                    node.parent._oldChild.splice(node._noIdx, 0, node);
                                    node.parent.children.splice(i, 1);
                                    $(target).removeClass('wi-secondary-bg');
                                    CompanyChart.drawTree(node.parent);
                                    break;
                                }
                            }
                        }
                    } else {
                        // _oldChild
                        if (CompanyChart.rootData && CompanyChart.rootData._oldChild && CompanyChart.rootData._oldChild.length) {
                            var tmpRoot = CompanyChart.rootData._oldChild
                            for (var i = 0; i < tmpRoot.length; i++) {
                                var node = tmpRoot[i];
                                // 找到对应分支
                                if (node.name === type) {
                                    node.parent.children = node.parent.children || [];
                                    node.parent.children.splice(node._noIdx, 0, node);
                                    node.parent._oldChild.splice(i, 1);
                                    $(target).addClass('wi-secondary-bg');
                                    CompanyChart.drawTree(node.parent);
                                    break;
                                }
                            }
                        }
                    }
                    return false;
                } else {
                    var typeArr = null;
                    if (type === '全部') {
                        $(childEles).removeClass('wi-secondary-bg');
                    } else {
                        $(target).parent().children('[data-api="all"]').removeClass('wi-secondary-bg');
                    }

                    if (selected) {
                        // 不选
                        $(target).removeClass('wi-secondary-bg');
                        if (type === '全部') {
                            typeArr = null;
                        } else {
                            typeArr = $(target).parent().children('.wi-secondary-bg:not([data-api=all])')
                        }
                    } else {
                        // 选中
                        $(target).addClass('wi-secondary-bg');
                        if (type === '全部') {
                            typeArr = $(target).parent().children('button:not([data-api=all])')
                        } else {
                            typeArr = $(target).parent().children('.wi-secondary-bg:not([data-api=all])')
                        }
                    }

                    if (type === '全部') {

                        if (childEles.length - oldSelected.length === 1) {
                            return;
                        }

                        // 当前已是全选状态，执行不选动作
                        if (selected) {
                            // 全不选
                            var parentData = CompanyChart.rootData.children;
                            for (var i = 0; i < parentData.length; i++) {
                                if (parentData[i].name === firstType) {
                                    CompanyChart.rootData._oldChild = CompanyChart.rootData._oldChild || [];
                                    if (CompanyChart.rootData._oldChild && CompanyChart.rootData._oldChild.length) {
                                        if (CompanyChart.rootData._oldChild.length === 8) {
                                            CompanyChart.rootData._oldChild.splice(parentData[i]._noIdx, 1, parentData[i]);
                                        } else {
                                            CompanyChart.rootData._oldChild.splice(parentData[i]._noIdx, 0, parentData[i]);
                                        }
                                    } else {
                                        CompanyChart.rootData._oldChild.splice(parentData[i]._noIdx, 0, parentData[i]);
                                    }
                                    parentData.splice(i, 1);
                                    break;
                                }
                            }
                            CompanyChart.drawTree(CompanyChart.rootData);
                        } else {
                            // 全选
                            var parentData = CompanyChart.rootData._oldChild; // || CompanyChart.rootData.children;
                            var hasOld = false;

                            if (parentData && parentData.length) {
                                // 直接从全不选择状态点入
                                for (var i = 0; i < parentData.length; i++) {
                                    if (parentData[i].name === firstType) {
                                        var child = parentData[i];
                                        hasOld = true;

                                        if (child._oldChild && child._oldChild.length) {
                                            for (var j = 0; j < child._oldChild.length; j++) {
                                                var node = child._oldChild[j];
                                                child._oldChild.splice(j, 1);
                                                child.children.splice(node._noIdx, 0, node);
                                                j--;
                                            }

                                        }
                                        var hasNew = false;
                                        for (var k = 0; k < CompanyChart.rootData.children.length; k++) {
                                            if (CompanyChart.rootData.children[k]._noIdx === child._noIdx) {
                                                hasNew = true;
                                            }
                                        }

                                        if (hasNew) {
                                            CompanyChart.rootData.children.splice(child._noIdx, 1, child);
                                        } else {
                                            CompanyChart.rootData.children.splice(child._noIdx, 0, child);
                                        }

                                        parentData.splice(i, 1);
                                        break;

                                    }
                                }
                            }

                            if (!hasOld) {
                                // 当前有已经选中的子节点
                                parentData = CompanyChart.rootData.children;
                                for (var i = 0; i < parentData.length; i++) {
                                    if (parentData[i].name === firstType) {
                                        var child = parentData[i];

                                        if (child._oldChild && child._oldChild.length) {
                                            for (var j = 0; j < child._oldChild.length; j++) {
                                                var node = child._oldChild[j];
                                                child._oldChild.splice(j, 1);
                                                child.children.splice(node._noIdx, 0, node);
                                                j--;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }

                            CompanyChart.drawTree(CompanyChart.rootData);
                        }
                    } else {
                        var parentData;
                        var childs;

                        if (parentSelected) {
                            // 当前全部按钮已经是全选中状态 , selected只有一个状态 false
                            // 选择
                            parentData = CompanyChart.rootData.children;

                            // 先找出父节点
                            for (var i = 0; i < parentData.length; i++) {
                                if (parentData[i].name === firstType) {
                                    childs = parentData[i];
                                    childs._oldChild = [];
                                    break;
                                }
                            }

                            // 把父节点下子节点copy一份
                            for (var j = 0; j < childs.children.length; j++) {
                                var node = childs.children[j];
                                node._noIdx = node._noIdx || j;
                                childs._oldChild.push(node);
                            }

                            // 处理当前节点
                            for (var j = 0; j < childs.children.length; j++) {
                                var node = childs.children[j];
                                if (node.name !== type) {
                                    childs.children.splice(j, 1);
                                    j--;
                                }
                            }

                            // 处理复制的备份中对当前节点的处理逻辑
                            for (var j = 0; j < childs._oldChild.length; j++) {
                                var node = childs._oldChild[j];
                                if (node.name === type) {
                                    childs._oldChild.splice(j, 1);
                                    j--;
                                }
                            }


                        } else {
                            // 当前已经是全未选中状态
                            if (selected) {
                                // 不选
                                parentData = CompanyChart.rootData.children;

                                for (var i = 0; i < parentData.length; i++) {
                                    if (parentData[i].name === firstType) {
                                        childs = parentData[i];
                                        break;
                                    }
                                }
                                for (var j = 0; j < childs.children.length; j++) {
                                    var node = childs.children[j];
                                    if (node.name === type) {
                                        childs.children.splice(j, 1);
                                        j--;
                                        childs._oldChild = childs._oldChild || [];
                                        childs._oldChild.splice(node._noIdx, 0, node);
                                    }
                                }

                                if (!childs.children.length) {
                                    CompanyChart.rootData._oldChild = CompanyChart.rootData._oldChild || [];
                                    CompanyChart.rootData._oldChild.splice(i, 0, parentData[i]);
                                    parentData.splice(i, 1);
                                }

                            } else {
                                // 选择
                                if (typeArr.length > 1) {
                                    // 表示当前已有选中项目
                                    var hasOld = false;
                                    if (CompanyChart.rootData._oldChild && CompanyChart.rootData._oldChild.length) {
                                        parentData = CompanyChart.rootData._oldChild;

                                        for (var i = 0; i < parentData.length; i++) {
                                            if (parentData[i].name === firstType) {
                                                childs = parentData[i];
                                                hasOld = true;
                                                break;
                                            }
                                        }

                                        if (hasOld) {

                                            for (var j = 0; j < childs._oldChild.length; j++) {
                                                var node = childs._oldChild[j];
                                                if (node.name === type) {
                                                    childs.children = childs.children || [];
                                                    childs.children.splice(node._noIdx, 0, node);
                                                    childs._oldChild.splice(j, 1);
                                                    break;
                                                }
                                            }
                                            CompanyChart.rootData.children.splice(childs._noIdx, 1, childs);
                                            parentData.splice(i, 1);

                                        } else {
                                            // 之前已有选中的点
                                            parentData = CompanyChart.rootData.children;
                                            for (var i = 0; i < parentData.length; i++) {
                                                if (parentData[i].name === firstType) {
                                                    childs = parentData[i];
                                                    break;
                                                }
                                            }

                                            if (childs._oldChild && childs._oldChild.length) {
                                                for (var j = 0; j < childs._oldChild.length; j++) {
                                                    var node = childs._oldChild[j];
                                                    if (node.name === type) {
                                                        childs._oldChild.splice(node._noIdx, 1);
                                                        childs.children = childs.children || [];
                                                        childs.children.splice(node._noIdx, 0, node);
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                    } else {

                                        parentData = CompanyChart.rootData.children;

                                        for (var i = 0; i < parentData.length; i++) {
                                            if (parentData[i].name === firstType) {
                                                childs = parentData[i];
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < childs._oldChild.length; j++) {
                                            var node = childs._oldChild[j];
                                            if (node.name === type) {
                                                childs._oldChild.splice(j, 1);
                                                childs.children = childs.children || [];
                                                // childs.children.push(node);
                                                childs.children.splice(tIndex, 0, node);
                                                break;
                                            }
                                        }
                                    }

                                } else {
                                    // 当前是从全未选中状态点击过来
                                    var hasOld = false;
                                    if (CompanyChart.rootData._oldChild && CompanyChart.rootData._oldChild.length) {
                                        parentData = CompanyChart.rootData._oldChild;

                                        for (var i = 0; i < parentData.length; i++) {
                                            if (parentData[i].name === firstType) {
                                                childs = parentData[i];
                                                hasOld = true;
                                                break;
                                            }
                                        }

                                        if (hasOld) {
                                            if (childs.children && childs.children.length) {
                                                for (var j = 0; j < childs.children.length; j++) {
                                                    var node = childs.children[j];
                                                    if (node.name !== type) {
                                                        childs.children.splice(j, 1);
                                                        childs._oldChild = childs._oldChild || [];
                                                        childs._oldChild.splice(node._noIdx, 0, node);
                                                        j--;
                                                    }
                                                }
                                                CompanyChart.rootData.children.splice(childs._noIdx, 0, childs);
                                                parentData.splice(i, 1);
                                            } else {
                                                for (var j = 0; j < childs._oldChild.length; j++) {
                                                    var node = childs._oldChild[j];
                                                    if (node.name === type) {
                                                        childs.children = childs.children || [];
                                                        childs.children.splice(node._noIdx, 0, node);
                                                        childs._oldChild.splice(j, 1);
                                                        break;
                                                    }
                                                }
                                                CompanyChart.rootData.children.splice(childs._noIdx, 0, childs);
                                                parentData.splice(i, 1);
                                            }
                                        } else {
                                            // 之前已有选中的点
                                            parentData = CompanyChart.rootData.children;
                                            for (var i = 0; i < parentData.length; i++) {
                                                if (parentData[i].name === firstType) {
                                                    childs = parentData[i];
                                                    break;
                                                }
                                            }

                                            if (childs._oldChild && childs._oldChild.length) {
                                                for (var j = 0; j < childs._oldChild.length; j++) {
                                                    var node = childs._oldChild[j];
                                                    if (node.name === type) {
                                                        childs._oldChild.splice(node._noIdx, 1);
                                                        childs.children = childs.children || [];
                                                        childs.children.splice(node._noIdx, 0, node);
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                    } else {
                                        parentData = CompanyChart.rootData.children;

                                        for (var i = 0; i < parentData.length; i++) {
                                            if (parentData[i].name === firstType) {
                                                childs = parentData[i];
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < childs._oldChild.length; j++) {
                                            var node = childs._oldChild[j];
                                            if (node.name === type) {
                                                childs._oldChild.splice(j, 1);
                                                childs.children = childs.children || [];
                                                childs.children.splice(tIndex, 0, node);
                                                break;
                                            }
                                        }

                                    }
                                }
                            }
                        }

                        CompanyChart.drawTree(CompanyChart.rootData);

                        return;
                    }
                    return false;
                }
            }

            /**
             * 企业图谱保存图片事件委托
             * 
             * @param {any} e 
             */
            function qytpSaveImgEvent(e) {
                if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                    if (layer) {
                        layer.msg('功能升级中!')
                    } else {
                        window.alert('功能升级中!')
                    }
                    return;
                }
                // Common.saveCanvasImg('#companyChart', '企业图谱', 2, null)
                var box = d3.select('#companyChart svg g').node().getBoundingClientRect();
                var w = box.width;
                var h = box.height;
                // Common.saveCanvasImg('#companyChart', CompanyChart.companyName + '_企业图谱', 2, null, w * 1.2, h * 1.2);
                Common.saveCanvasImg('#companyChart', CompanyChart.companyName + '_企业图谱', 2, null);
            }

            /**
             * 企业图谱导出列表事件委托
             * 
             * @param {any} e 
             */
            function qytpListEvent(e) {

                layer.msg('数据导出功能正在升级中');
                return false;

                var eles = $('.chart-nav').find('button.wi-secondary-bg');
                var args = [];
                Array.prototype.forEach.call(eles, function(e) {
                    args.push($(e).attr('data-api'));
                });
                if (args.length) {
                    args = args.join(',');
                    window.open(global_site + '/Wind.WFC.Enterprise.Web/Enterprise/EntpMapDownload.aspx?cmd=getentpmap&companycode=' + CompanyChart.companyCode + '&companyName=' + CompanyChart.companyName + '&mapType=' + args);
                } else {
                    layer.msg('未选中任何数据!');
                }
            }

            /**
             * 企业图谱刷新事件委托
             * 
             * @param {any} e 
             */
            function qytpReloadEvent(e) {
                CompanyChart.loadQYTP();
            }
        },
        // 新 股权结构
        loadNewGQJG: function() {
            $('#load_data').show();
            var rootData = {};
            var htmlArr = [];
            var vData = {}; // 暂存原始数据

            $('#rContent').find('#toolNav').remove();
            htmlArr.push('<div id="toolNav">');

            htmlArr.push('<style> .has-nav .mao-screen-area{margin-right:-270px}; </style>');
            htmlArr.push('<div class="chart-nav">');
            // htmlArr.push('<div class="chart-nav-zero"><div class="chart-nav-title" data-key="穿透维度">' + intl('138262' /* 穿透维度 */ , '穿透维度') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-api="gd" data-key="股东">' + intl('32959' /* 股东 */ , '股东') + '</button><button class="chart-nav-btn " data-api="tz" data-key="投资">' + intl('102836' /* 投资 */ , '投资') + '</button></div>')
            htmlArr.push('<div class="chart-nav-first"><div class="chart-nav-title" data-key="企业状态">' + intl('138680' /* 企业状态 */ , '企业状态') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-api="LegalPers" data-key="存续">' + intl('134787' /* 存续 */ , '存续') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="注销">' + intl('36489' /* 注销 */ , '注销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="迁出">' + intl('134788' /* 迁出 */ , '迁出') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="吊销,未注销">' + intl('134789' /* 吊销,未注销 */ , '吊销,未注销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="吊销,已注销">' + intl('134790' /* 吊销,已注销 */ , '吊销,已注销') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="撤销">' + intl('2690' /* 撤销 */ , '撤销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="停业">' + intl('134791' /* 停业 */ , '停业') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="非正常户">' + intl('134795' /* 非正常户 */ , '非正常户') + '</button>')
            htmlArr.push('</div>');
            if (window.wind && wind.langControl.lang !== 'zh') {
                htmlArr.push('<div class="chart-nav-second">' + intl('138287') + '<input class="chart-nav-rateset" type="text" />%</div>');
            } else {
                htmlArr.push('<div class="chart-nav-second"><span>去除持股</span><input class="chart-nav-rateset" type="text" />%以下的节点</div>');
            }

            htmlArr.push('<ul class="chart-nav-slide"></ul>');
            htmlArr.push('</div>');
            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ , '保存图片') + '</span></li>');
            htmlArr.push('<li class="chart-header-rate"><span>' + intl('12095' /* 全部展开 */ , '全部展开') + '</span></li>');
            // htmlArr.push('<li class="chart-header-rate chart-header-rate-other" data-hide="1"><span>' + intl('138871' /* 持股比例 */ , '持股比例') + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ , '刷新') + '</span></li>');
            htmlArr.push('</ul></div>');
            htmlArr.push('</div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');

            $('.chart-nav-zero').off('click', 'button');
            $('.chart-nav-first').off('click', 'button');
            $('.chart-nav-second').off('blur', 'input');
            $('.chart-toolbar').off('click', 'li');
            $('.chart-nav').off('click', '.chart-nav-slide');

            var defer1 = $.Deferred();
            var defer2 = $.Deferred();
            var allData;
            var htmlTitleArr = [];
            $('.mao-screen-area #companyChart').before('<div class="content-gqjg-title" id="gqjg_title"></div>');

            // 获取疑似实际控制人 返回Array格式
            myWfcAjax("getactcontroinfo", { companyCode: CompanyChart.companyCode }, function(res) {
                data = JSON.parse(res);
                if (data.ErrorCode == '-10') { //无权限
                    var contSet = {
                        title: intl('138282' /* 股权结构图 */ ),
                        dec: ['购买VIP/SVIP套餐，即可不限次查看企业的股权结构图', '购买VIP/SVIP套餐，即可不限次查看企业的股权结构图'],
                        closeCall: function(params) {
                            // window.location.href = window.location.href.split(location.hash)[0];
                            var self = CompanyChart;
                            // 默认加载[企业图谱]                
                            self.loadQYTP();
                            $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg');
                            self.chartSelect = $('.nav-tabs').find('.nav-block').eq(0);
                            self.chartSelect.addClass('active');
                            $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
                        }
                    };
                    Common.Popup([1, true], true, contSet);
                    return;
                }
                if (data && data.ErrorCode == 0 && data.Data) {
                    var arr = data.Data;
                    arr.forEach(function(t) {
                        htmlTitleArr.push('<div><span class="content-gqjg-info-one">' + intl('138449' /* 疑似控制人 */ ) + '</span><span data-type="' + t.ActControType + '" data-id="' + t.ActControId + '" class="content-gqjg-info-two">' + (t.ActControName || '--') + '</span><span class="content-gqjg-info-three">' + intl('138412' /* 实际持股比例 */ ) + '</span><span class="content-gqjg-info-four">' + (t.ActInvestRate ? (parseFloat(t.ActInvestRate).toFixed(2) + '%') : '--') + '</span></div>');
                    })
                    defer1.resolve();
                } else {
                    defer1.reject();
                }
            }, function() {
                defer1.reject();
            });

            // 持股比例转换
            var changeStockSchema = function(data) {
                if (data) {
                    data.parentStockShare = data.stockShare || null;
                }
                if (data.children && data.children.length) {
                    data.children.forEach(function(t) {
                        changeStockSchema(t)
                    })
                }
                return data;
            };

            myWfcAjax("getcorpshareholdertree", { "companycode": CompanyChart.companyCode }, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data.ErrorCode == '-10') { //无权限
                    var contSet = {
                        title: '股权结构图',
                        dec: ['购买VIP/SVIP套餐，即可不限次查看企业的股权结构图', '购买VIP/SVIP套餐，即可不限次查看企业的股权结构图'],
                        closeCall: function(params) {
                            // window.location.href = window.location.href.split(location.hash)[0];
                            var self = CompanyChart;
                            // 默认加载[企业图谱]                
                            self.loadQYTP();
                            $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg');
                            self.chartSelect = $('.nav-tabs').find('.nav-block').eq(0);
                            self.chartSelect.addClass('active');
                            $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
                        }
                    };
                    Common.Popup([1, true], true, contSet);
                    return;
                }
                if (data.ErrorCode == 0) {
                    if (data.Data && data.Data.children && data.Data.children.length) {
                        // if (!allData) {
                        //     allData = data.Data.children;
                        // }
                        var shareHolderTree = {
                            name: CompanyChart.companyName || '目标公司',
                        }
                        var investTree = {
                            name: CompanyChart.companyName || '目标公司',
                            children: data.Data.children
                        }
                        rootData.name = CompanyChart.companyName || '目标公司';
                        rootData.Id = CompanyChart.companyCode;
                        rootData.children = [];
                        rootData.shareHolderTree = shareHolderTree;
                        rootData.investTree = investTree;
                        changeStockSchema(rootData.investTree);
                        vData = JSON.stringify(rootData);
                        rootData.investTree.children.map(function(t) {
                            rootData.children.push(t);
                        });
                        changeChildrenData(rootData.children);
                        try {
                            rootData.x0 = 0;
                            rootData.y0 = 0;
                            drawTree(rootData);
                            defer2.resolve();
                            $('.chart-header').show();
                        } catch (e) {
                            defer2.reject();
                            // TODO 暂无数据
                        }
                        $('.chart-nav-first').on('click', 'button', newgqjgNavFirstEvent);
                        $('.chart-nav-second').on('blur', 'input', newgqjgNavSecondEvent);
                        $('.chart-toolbar').on('click', 'li', newgqjgHeaderEvent);
                        $('.chart-nav').on('click', '.chart-nav-slide', newgqjgSlideEvent);
                    } else {
                        defer2.reject();
                        $('#no_data').show();
                    }
                } else {
                    defer2.reject();
                    $('#no_data').show();
                    // TODO 暂无数据
                }

            }, function() {
                defer2.reject();
                $('#no_data').show();
                // TODO 加载失败
            })

            $.when(defer1, defer2).then(function() {
                $('#gqjg_title').append(htmlTitleArr.join(''));
                $('#gqjg_title').on('click', '.content-gqjg-info-two', function(e) {
                    var id = $(this).attr('data-id')
                    var name = $(this).text();
                    var type = $(this).attr('data-type');
                    if (type == 1) {
                        // window.open('Person.html?id=' + id + '&name=' + name);
                    } else if (type == 2) {
                        Common.linkCompany('Bu3', id);
                    }
                })
            }, function() {})

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

                    t.nwidth = nodeWidth;
                    t.x = e * (t.height + paddingHeight);
                    t.textleft = t._children || t.children ? x0 + 15 : x0;
                });

                // i
                var nodeUpdate = svg.svg.selectAll("g.node-tree").data(nodes, function(t) {
                    return t.mid || (t.mid = ++idx);
                });
                // n
                var enterZone = nodeUpdate.enter()
                    .append("g")
                    // .attr("class", "node")
                    .attr("class", "node-tree")
                    .attr("transform",
                        // 原参数 e
                        function(e) {
                            return "translate(" + targetNode.y0 + "," + targetNode.x0 + ")";
                        }).style("opacity", 1e-6)
                    .on("click", toggleEvent);

                enterZone.append("rect")
                    .attr("class", "basicrect")
                    .attr("y", calcHeight)
                    .attr("height", getHeight)
                    // .attr("width", svgWidth * 0.9 - 40)
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
                // --------------------------------------------------------------------------------------
                // --------------------------------------------------------------------------------------

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
                        var distance = 15;
                        if (t.listed) {
                            distance = 95;
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
                        if (t.type === 'person') {
                            // window.open('Person.html?id=' + t.Id + '&name=' + t.name)
                        } else {
                            Common.linkCompany('Bu3', t.Id);
                        }
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

                // 详情
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
                    .text("持股比例：")
                    .append("tspan")
                    .attr("class", "count")
                    .attr("fill", "#fe7e17")
                    .text(function(t) {
                        var Ratio = t.parentStockShare;
                        if (Ratio) {
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
                    // .attr("stroke", "#c0c0c0")
                    .attr("stroke", "#888")
                    .attr("fill", "transparent")
                    .attr("cx", x0).attr("cy", otherHeight)
                    .attr("r", theR);

                // 展开、收缩 按钮图标 内 +/- 号  横向线条
                enterZone.append("line")
                    .attr("class", "line-h")
                    .filter(function(t) {
                        // return t.hasChild;
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
                        // return t.hasChild;
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
            var rootData; //M
            var tree = d3.layout.tree().nodeSize([0, 60]); // j
            var diagonal = d3.svg.diagonal().projection(function(t) {
                return [t.y, t.x];
            }); // q
            var zoom = CompanyChart.zoom = d3.behavior.zoom().scaleExtent([1, 1]).on("zoom", zoomed); // U
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
            var svgWidth, svgHeight;

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
                rootData.x0 = 0;
                rootData.y0 = 0;
                drawTree(rootData, 1);
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
                CompanyChart.container = svg.svgGroup = svg.baseSvg.append('g');

                // svg内容    
                svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + border.left + "," + border.top + ")");
                // svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + 60 + "," + 270 + ")");

            }

            draw();

            function deleteParent(data) {
                if (data) {
                    delete data.parent;
                }
                if (data.children && data.children.length) {
                    for (var i = 0; i < data.children.length; i++) {
                        deleteParent(data.children[i])
                    }
                } else if (data._children && data._children.length) {
                    for (var j = 0; j < data._children.length; j++) {
                        deleteParent(data._children[j])
                    }
                }
                return data;
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
                 * 持股比例显示隐藏变形
                 */
                // var hideVal = $('.chart-header-rate').attr('data-hide') - 0; // 默认1 表示当前已显示持股比例

                // nowData.investTree && hideRate(nowData.investTree.children, !hideVal);
                // nowData.shareHolderTree && hideRate(nowData.shareHolderTree.children, !hideVal);

                /**
                 * 持股比例大小过滤
                 */
                var val = $('.chart-nav-rateset').val();
                var num = Number(val);
                if (!val) {
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                    // nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', -1);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', -1);
                } else if (!num) {
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                    // nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', -1);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else if (num < 0) {
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                    // nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', -1);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else {
                    if (num == 100) {
                        num = 99.99999999
                    }
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', num);
                    // nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', num);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'parentStockShare', num);
                }

                // nowData._rateHide = hideVal ? false : true; // _rateHide 字段加在根节点上面区分是否显示持股比例，默认显示持股比例，即隐藏属性:_rateHide = false

                return nowData;
            }

            function newgqjgSlideEvent(e) {
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

            function newgqjgNavZeroEvent(e) {
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

            function newgqjgNavFirstEvent(e) {
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
            function getStatusNodeNew(data, status) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var t = data[i];

                    if (t.type == 'company') {

                        if (t.status == status) {
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
            function newgqjgNavSecondEvent(e) {
                var nowData = structData();
                // Common.shareHolderAndInvestChartInitFun(CompanyChart.echartInstance, nowData, CompanyChart.companyCode, CompanyChart.companyName);
                // var ecConfig = require('echarts/config');
                // CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
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
             * 股权穿透header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function newgqjgHeaderEvent(e) {
                var target = e.target;
                if (!$(target).is('li')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 0:
                        newgqctSaveImgEvent();
                        break;
                    case 1:
                        expandTree();
                        break;
                    default:
                        restore();
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
                var w = box.width;
                var h = box.height;
                Common.saveCanvasImg('#companyChart', CompanyChart.companyName + '_股权结构', 2, null, w + 100 + '', h + 100 + '');
            }
        },
        // 新股权穿透
        loadNewGQCT: function() {
            try {
                setTimeout(function() {
                    /** 股权穿透加载 */
                    var otherParam = { funcType: 'detailViewAD' };
                    buryFCode.bury('AD', '股权穿透图', otherParam, 'detailViewAD');
                }, 3000)
            } catch (error) {}
            $('#load_data').show();
            var rootData = null;
            var parameter = { "companycode": CompanyChart.companyCode, "depth": 4 };

            var htmlArr = [];
            var vData = {}; // 暂存原始数据
            var echartInstance = null;

            if (CompanyChart.echartInstance) CompanyChart.echartInstance = null;
            $('#rContent').find('#toolNav').remove();
            htmlArr.push('<div id="toolNav">');

            htmlArr.push('<style> .has-nav .mao-screen-area{margin-right:-270px}; </style>');
            htmlArr.push('<div class="chart-nav">');
            htmlArr.push('<div class="chart-nav-zero"><div class="chart-nav-title" data-key="穿透维度">' + intl('138262' /* 穿透维度 */ , '穿透维度') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-api="gd" data-key="股东">' + intl('32959' /* 股东 */ , '股东') + '</button><button class="chart-nav-btn " data-api="tz" data-key="投资">' + intl('102836' /* 投资 */ , '投资') + '</button></div>')
            htmlArr.push('<div class="chart-nav-first"><div class="chart-nav-title" data-key="企业状态">' + intl('138680' /* 企业状态 */ , '企业状态') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-api="LegalPers" data-key="存续">' + intl('134787' /* 存续 */ , '存续') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="注销">' + intl('36489' /* 注销 */ , '注销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="迁出">' + intl('134788' /* 迁出 */ , '迁出') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="吊销,未注销">' + intl('134789' /* 吊销,未注销 */ , '吊销,未注销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="吊销,已注销">' + intl('134790' /* 吊销,已注销 */ , '吊销,已注销') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="撤销">' + intl('2690' /* 撤销 */ , '撤销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="停业">' + intl('134791' /* 停业 */ , '停业') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="非正常户">' + intl('134795' /* 非正常户 */ , '非正常户') + '</button>')
            htmlArr.push('</div>');
            if (window.wind && wind.langControl.lang !== 'zh') {
                htmlArr.push('<div class="chart-nav-second">' + intl('138287') + '<input class="chart-nav-rateset" type="text" />%</div>');
            } else {
                htmlArr.push('<div class="chart-nav-second"><span>去除持股</span><input class="chart-nav-rateset" type="text" />%以下的节点</div>');
            }

            htmlArr.push('<ul class="chart-nav-slide"></ul>');
            htmlArr.push('</div>');
            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-rate chart-header-rate-other"><span>' + '风格切换' + '</span></li>');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ , '保存图片') + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ , '刷新') + '</span></li>');
            htmlArr.push('</ul></div>');
            htmlArr.push('</div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');

            $('.chart-nav-zero').off('click', 'button');
            $('.chart-nav-first').off('click', 'button');
            $('.chart-nav-second').off('blur', 'input');
            $('.chart-toolbar').off('click', 'li');
            $('.chart-nav').off('click', '.chart-nav-slide');

            myWfcAjax("tracingstockex", parameter, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    CompanyChart.rootData = rootData = data.Data;
                    try {
                        if ((rootData.investTree && rootData.investTree.children && rootData.investTree.children.length) || (rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length)) {
                            // $.extend(true, vData, data.Data);                            
                            vData = JSON.stringify(data.Data);
                            rootData.name = CompanyChart.companyName || '目标公司';
                            rootData.Id = CompanyChart.companyCode;
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
                            rootData.shareHolderTree = rootData.shareHolderTree || {};
                            // 1 将股权数据统一放置上方 添加isup标识
                            rootData.shareHolderTree = changeDataSchema(rootData.shareHolderTree);
                            // 2 将股权、投资的子节点依次放置到根节点后
                            rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length && rootData.shareHolderTree.children.map(function(t) {
                                rootData.children.push(t);
                            })
                            rootData.investTree = rootData.investTree || {
                                children: [],
                            };
                            rootData.investTree.children.map(function(t) {
                                rootData.children.push(t);
                            })
                            rootData.x0 = 0;
                            rootData.y0 = 0;
                            delete rootData.investTree;
                            delete rootData.shareHolderTree;
                            // 3 隐藏底层节点
                            changeChildrenData(rootData.children);
                            drawTree(rootData);
                            $('.chart-nav-zero').on('click', 'button', newgqctNavZeroEvent);
                            $('.chart-nav-first').on('click', 'button', newgqctNavFirstEvent);
                            $('.chart-nav-second').on('blur', 'input', newgqctNavSecondEvent);
                            $('.chart-toolbar').on('click', 'li', newgqctHeaderEvent);
                            $('.chart-nav').on('click', '.chart-nav-slide', newgqctSlideEvent);
                        }
                    } catch (e) {
                        CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                        console.log('股权穿透绘制失败:' + e);
                    }
                } else {
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                    console.log('股权穿透数据/接口异常');
                }
            }, function() {
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                console.log('股权穿透服务端异常');
            });

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
                //     .attr("class", "ctrltext")
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
                //     .attr("class", "finaltext")
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
                            return t.textleft + 15;
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
                        if (t.type === 'person') {
                            // window.open('Person.html?id=' + t.Id + '&name=' + t.name)
                        } else {
                            Common.linkCompany('Bu3', t.Id);
                        }
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

                // 详情
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
                    .text("持股比例：")
                    .append("tspan")
                    .attr("class", "count")
                    .attr("fill", "#fe7e17")
                    .text(function(t) {
                        var Ratio = t.parentStockShare;
                        if (Ratio) {
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
            var rootData; //M
            var tree = d3.layout.tree().nodeSize([0, 60]); // j
            var diagonal = d3.svg.diagonal().projection(function(t) {
                return [t.y, t.x];
            }); // q
            var zoom = CompanyChart.zoom = d3.behavior.zoom().scaleExtent([1, 1]).on("zoom", zoomed); // U
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
            var svgWidth, svgHeight;

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
            function changeData1(t) {
                var e = t.children ? t.children : t._children;
                t._children && (t.children = t._children, t._children = null), e && e.forEach(changeData)
            }

            function changeData(t) {
                var e = t.children ? t.children : t._children;
                if (t.depth) {
                    if (t.stock > 50) {
                        t.hide = 1;
                        t._children = t.children;
                        t.children = null;
                    } else {
                        e && e.forEach(changeData)
                    }
                } else {
                    e && e.forEach(changeData)
                }
                // t._children && (t.children = t._children, t._children = null), e && e.forEach(changeData)
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
                    // .style({
                    //     background: "#ffffff"
                    // })
                    .attr("class", "svg-container")
                    .attr("xmlns", "http://www.w3.org/2000/svg")
                    .call(zoom);

                // svg容器 (可添加多个svg内容元素)
                CompanyChart.container = svg.svgGroup = svg.baseSvg.append('g');
                // svg内容    
                // svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + border.left + "," + border.top + ")");
                svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + 360 + "," + 270 + ")");

            }

            draw();

            function deleteParent(data) {
                if (data) {
                    delete data.parent;
                }
                if (data.children && data.children.length) {
                    for (var i = 0; i < data.children.length; i++) {
                        deleteParent(data.children[i])
                    }
                } else if (data._children && data._children.length) {
                    for (var j = 0; j < data._children.length; j++) {
                        deleteParent(data._children[j])
                    }
                }
                return data;
            }

            /**
             * 数据变形 先状态/后持股比例/再显示隐藏处理
             * 
             * @returns 
             */
            function structData() {
                var nowData = {};
                var _vData = JSON.parse(vData);
                // if (vData.investTree) {
                //     deleteParent(vData.investTree);
                // }
                // if (vData.shareHolderTree) {
                //     deleteParent(vData.shareHolderTree);
                // }
                // idx = 0; // V
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
                 * 持股比例显示隐藏变形
                 */
                // var hideVal = $('.chart-header-rate').attr('data-hide') - 0; // 默认1 表示当前已显示持股比例

                // nowData.investTree && hideRate(nowData.investTree.children, !hideVal);
                // nowData.shareHolderTree && hideRate(nowData.shareHolderTree.children, !hideVal);

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

                // nowData._rateHide = hideVal ? false : true; // _rateHide 字段加在根节点上面区分是否显示持股比例，默认显示持股比例，即隐藏属性:_rateHide = false

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
                rootData.investTree && rootData.investTree.children && rootData.investTree.children.map(function(t) {
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
                // idx = 0; // V
                // upIdx = 0;
                // downIdx = 0;
                // rootData.children && rootData.children.forEach(changeNodeForReload);
                // changeNodeForReload(rootData);
                // drawTree(rootData);   
                // svg.baseSvg.call(zoom.translate([0, 0]).scale(1).event);
                // return false;                
                window.location.reload();
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
                        CompanyChart.loadGQCT();
                        break;
                        // 风格切换
                    case 1:
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
                    d3.select('#companyChart svg g g').attr('transform', "translate(" + 60 + "," + (y - upHeight + 0) + ")");
                } else {
                    d3.select('#companyChart svg g g').attr('transform', "translate(" + 60 + "," + y + ")");
                }

                var w = box.width;
                var h = box.height;
                Common.saveCanvasImg('#companyChart', CompanyChart.companyName + '_股权穿透', 2, null, w + 300 + '', h + 300 + '');
                d3.select('#companyChart svg g g').attr('transform', "translate(" + x + "," + (y) + ")");
            }
        },
        // 股权穿透
        loadGQCT: function() {
            try {
                setTimeout(function() {
                    /** 股权穿透加载 */
                    var otherParam = { funcType: 'detailViewAD' };
                    buryFCode.bury('AD', '股权穿透图', otherParam, 'detailViewAD');
                }, 3000)
            } catch (error) {}
            $('#load_data').show();
            var rootData = null;
            var parameter = { "companycode": CompanyChart.companyCode, "depth": 4 };

            var htmlArr = [];
            var vData = {}; // 暂存原始数据

            $('#rContent').find('#toolNav').remove();
            htmlArr.push('<div id="toolNav">');

            htmlArr.push('<style> .has-nav .mao-screen-area{margin-right:-270px}; </style>');

            // htmlArr.push('<div class="chart-header"><button class="chart-header-list wi-secondary-bg" style="display:none;">企业列表</button> <button class="chart-header-save wi-secondary-bg">保存图片</button> <button class="chart-header-rate wi-secondary-bg" data-hide="1">隐藏持股比例</button> <button class="chart-header-reload wi-secondary-bg"><i></i>刷新</button></div>');
            htmlArr.push('<div class="chart-nav">');
            htmlArr.push('<div class="chart-nav-zero"><div class="chart-nav-title" data-key="穿透维度">' + intl('138262' /* 穿透维度 */ , '穿透维度') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-api="gd" data-key="股东">' + intl('32959' /* 股东 */ , '股东') + '</button><button class="chart-nav-btn " data-api="tz" data-key="投资">' + intl('102836' /* 投资 */ , '投资') + '</button></div>')
            htmlArr.push('<div class="chart-nav-first"><div class="chart-nav-title" data-key="企业状态">' + intl('138680' /* 企业状态 */ , '企业状态') + '</div><button class="chart-nav-btn wi-secondary-bg" data-api="all" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-api="LegalPers" data-key="存续">' + intl('134787' /* 存续 */ , '存续') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="注销">' + intl('36489' /* 注销 */ , '注销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="迁出">' + intl('134788' /* 迁出 */ , '迁出') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="吊销,未注销">' + intl('134789' /* 吊销,未注销 */ , '吊销,未注销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="吊销,已注销">' + intl('134790' /* 吊销,已注销 */ , '吊销,已注销') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="撤销">' + intl('2690' /* 撤销 */ , '撤销') + '</button><button class="chart-nav-btn " data-api="HistLegalPers" data-key="停业">' + intl('134791' /* 停业 */ , '停业') + '</button>')
            htmlArr.push('<button class="chart-nav-btn " data-api="HistLegalPers" data-key="非正常户">' + intl('134795' /* 非正常户 */ , '非正常户') + '</button>')
            htmlArr.push('</div>');
            if (window.wind && wind.langControl.lang !== 'zh') {
                htmlArr.push('<div class="chart-nav-second">' + intl('138287') + '<input class="chart-nav-rateset" type="text" />%</div>');
            } else {
                htmlArr.push('<div class="chart-nav-second"><span>去除持股</span><input class="chart-nav-rateset" type="text" />%以下的节点</div>');
            }

            htmlArr.push('<ul class="chart-nav-slide"></ul>');
            htmlArr.push('</div>');
            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-rate chart-header-rate-other" data-hide="1"><span>' + '风格切换' + '</span></li>');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ , '保存图片') + '</span></li>');
            // htmlArr.push('<li class="chart-header-rate chart-header-rate-other" data-hide="1"><span>' + intl('138871' /* 持股比例 */ , '持股比例') + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ , '刷新') + '</span></li>');
            htmlArr.push('</ul></div>');
            htmlArr.push('</div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');

            $('.chart-nav-zero').off('click', 'button');
            $('.chart-nav-first').off('click', 'button');
            $('.chart-nav-second').off('blur', 'input');
            $('.chart-toolbar').off('click', 'li');
            $('.chart-nav').off('click', '.chart-nav-slide');

            myWfcAjax("tracingstockex", parameter, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    CompanyChart.rootData = rootData = data.Data;
                    try {
                        $.extend(true, vData, data.Data);
                        CompanyChart.echartInstance = echarts.init(document.querySelector('#companyChart'));
                        Common.shareHolderAndInvestChartInitFun(CompanyChart.echartInstance, rootData, parameter.companycode, CompanyChart.companyName)
                        Common.animatieChart(CompanyChart.echartInstance, -150);
                        $('.chart-nav-zero').on('click', 'button', gqctNavZeroEvent);
                        $('.chart-nav-first').on('click', 'button', gqctNavFirstEvent);
                        $('.chart-nav-second').on('blur', 'input', gqctNavSecondEvent);
                        $('.chart-toolbar').on('click', 'li', gqctHeaderEvent);
                        $('.chart-nav').on('click', '.chart-nav-slide', gqctSlideEvent);

                    } catch (e) {
                        CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                        console.log('股权穿透绘制失败:' + e);
                    }
                } else {
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                    console.log('股权穿透数据/接口异常');
                }
            }, function() {
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                console.log('股权穿透服务端异常');
            });

            /**
             * 数据变形 先状态/后持股比例/再显示隐藏处理
             * 
             * @returns 
             */
            function structData() {
                var nowData = {};
                $.extend(true, nowData, vData);

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
                 * 持股比例显示隐藏变形
                 */
                var hideVal = $('.chart-header-rate').attr('data-hide') - 0; // 默认1 表示当前已显示持股比例

                nowData.investTree && hideRate(nowData.investTree.children, !hideVal);
                nowData.shareHolderTree && hideRate(nowData.shareHolderTree.children, !hideVal);

                /**
                 * 持股比例大小过滤
                 */
                var val = $('.chart-nav-rateset').val();
                var num = Number(val);
                if (!val) {
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', -1);
                } else if (!num) {
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else if (num < 0) {
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', -1);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else {
                    if (num == 100) {
                        num = 99.99999999
                    }
                    nowData.investTree && getRateNode(nowData.investTree.children, 'parentStockShare', num);
                    nowData.shareHolderTree && getRateNode(nowData.shareHolderTree.children, 'stockShare', num);
                }

                nowData._rateHide = hideVal ? false : true; // _rateHide 字段加在根节点上面区分是否显示持股比例，默认显示持股比例，即隐藏属性:_rateHide = false

                return nowData;
            }

            function gqctSlideEvent(e) {
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

            function gqctNavZeroEvent(e) {
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
                            nowData.investTree && (nowData.investTree.children = []);
                        }
                    } else {
                        if (count === 0) {
                            nowData.investTree && (nowData.investTree.children = []);
                        }
                        nowData.shareHolderTree && (nowData.shareHolderTree.children = []);
                    }
                } else if (txt === '投资') {
                    if (selected) {
                        if (count === 1) {
                            nowData.shareHolderTree && (nowData.shareHolderTree.children = []);
                        }
                    } else {
                        if (count === 0) {
                            nowData.shareHolderTree && (nowData.shareHolderTree.children = []);
                        }
                        nowData.investTree && (nowData.investTree.children = []);
                    }
                } else {
                    if (!selected) {
                        nowData.investTree && (nowData.investTree.children = []);
                        nowData.shareHolderTree && (nowData.shareHolderTree.children = []);
                    }
                }
                Common.shareHolderAndInvestChartInitFun(CompanyChart.echartInstance, nowData, CompanyChart.companyCode, CompanyChart.companyName);
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            function gqctNavFirstEvent(e) {
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
                Common.shareHolderAndInvestChartInitFun(CompanyChart.echartInstance, nowData, CompanyChart.companyCode, CompanyChart.companyName);
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
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
            function gqctNavSecondEvent(e) {
                var nowData = structData();
                Common.shareHolderAndInvestChartInitFun(CompanyChart.echartInstance, nowData, CompanyChart.companyCode, CompanyChart.companyName);
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 刷新
             * 
             * @param {any} e 
             * @returns 
             */
            function reloadChart(e) {
                // Common.burypcfunctioncode('');
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                Common.animatieChart(CompanyChart.echartInstance, -150);
                return false;
            }

            /**
             * 股权穿透header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function gqctHeaderEvent(e) {
                var target = e.target;
                if (!$(target).is('li')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 0:
                        // 清空echart实例 释放资源
                        if (CompanyChart.echartInstance) {
                            CompanyChart.echartInstance.clear();
                            CompanyChart.echartInstance.dispose();
                            var parent = $('#companyChart').parent();
                            parent.find('#companyChart').remove();
                            var ele = CompanyChart.chartEleClone.clone();
                            parent.append(ele);
                            // ele.height($(window).height() - CompanyChart.chartHeaderHeight);
                            CompanyChart.echartInstance = null;
                        }
                        if (CompanyChart.cyInstance) {
                            CompanyChart.cyInstance.destroy();
                            CompanyChart.cyInstance = null;
                        }
                        CompanyChart.loadNewGQCT();
                        break;
                    case 1:
                        Common.burypcfunctioncode('922602100372');
                        gqctSaveImgEvent();
                        break;
                        // case 2:
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
            function gqctSaveImgEvent(e) {
                // Common.burypcfunctioncode('');
                if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                    if (layer) {
                        layer.msg('功能升级中!')
                    } else {
                        window.alert('功能升级中!')
                    }
                    return;
                }
                CompanyChart.saveEchart2Img('股权穿透');
            }
        },
        // 股权结构
        loadGQJG: function() {
            Common.burypcfunctioncode('922602100361');
            $('#load_data').show();
            var rootData = null;
            var parameter = { "companycode": CompanyChart.companyCode };

            var htmlArr = [];
            var vData = {}; // 暂存原始数据            

            $('#rContent').find('#toolNav').remove();
            htmlArr.push('<div id="toolNav">');
            // htmlArr.push('<div class="chart-header"><button class="chart-header-list wi-secondary-bg" style="display:none;"></button> <button class="chart-header-save wi-secondary-bg">保存图片</button> <button class="chart-header-rate wi-secondary-bg" data-hide="1">隐藏持股比例</button> <button class="chart-header-reload wi-secondary-bg"><i></i>刷新</button></div>');
            htmlArr.push('<div class="chart-nav">');
            // htmlArr.push('<div class="chart-nav-first"><span>企业状态</span><button class="chart-nav-btn wi-secondary-bg" data-api="LegalPers">正常状态</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">异常状态</button></div>');
            htmlArr.push('<div class="chart-nav-first"><span>企业状态</span><button class="chart-nav-btn wi-secondary-bg" data-api="LegalPers">存续</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">注销</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">迁出</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">吊销,未注销</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">吊销,已注销</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">撤销</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">停业</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">非正常户</button>')
            htmlArr.push('</div>');
            if (window.wind && wind.langControl.lang !== 'zh') {
                htmlArr.push('<div class="chart-nav-second">' + intl('138287') + '<input class="chart-nav-rateset" type="text" />%</div>');
            } else {
                htmlArr.push('<div class="chart-nav-second"><span>去除持股</span><input class="chart-nav-rateset" type="text" />%以下的节点</div>');
            }
            htmlArr.push('</div>');

            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-important" style="display:none;"><span></span></li>');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ ) + '</span></li>');
            htmlArr.push('<li class="chart-header-rate chart-header-rate-other" data-hide="1"><span>' + intl('138871' /* 持股比例 */ ) + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ ) + '</span></li>');
            htmlArr.push('</ul></div>');

            htmlArr.push('</div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');

            $('.chart-nav-first').off('click', 'button');
            $('.chart-nav-second').off('blur', 'input');
            $('.chart-toolbar').off('click', 'li');

            myWfcAjax("getsharehoderevent", parameter, function(data) {
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    try {
                        var list = dataChange(data.Data);

                        if (list.length) {
                            $('.chart-header-important span').text('重大事项(' + list.length + ')');
                            $('.chart-header-important').show();
                        }
                        // $('.chart-header').show();
                    } catch (e) {
                        // $('.chart-header').show();
                    }

                    function dataChange(res) {
                        var mergeMoreArr = [];
                        var pevcArr = [];
                        var dateLater = '';
                        var dataSet = [];
                        var mergeHref = '//psmsserver/InvestmentBank/Merger/MergerEventDetail.aspx?ID=';
                        var pevcHref = '//psmsserver/InvestmentBank/PEVC/InvestFinancDetail.aspx?ID=';
                        if ((res.MergeCompInfo && res.MergeCompInfo.length) || (res.Pevc && res.Pevc.length)) {
                            var mergeStr = '<span>， 在 ' + dateLater + ' 之后，发生以下可能引起股东变化的重要事项：<br/></span>'
                        }
                        if (res.MergeCompInfo && res.MergeCompInfo.length) {
                            var mergeStatusInfo = res.MergeCompInfo;
                            for (var i = 0; i < mergeStatusInfo.length; i++) {
                                var mergeMoreStr = '';
                                var buyers = '';
                                var sellers = '';
                                var dataItem = {};
                                if (mergeStatusInfo[i].Buyer && mergeStatusInfo[i].Buyer.length) {
                                    for (var j = 0; j < mergeStatusInfo[i].Buyer.length; j++) {
                                        buyers += (mergeStatusInfo[i].Buyer[j].tradePartName ? mergeStatusInfo[i].Buyer[j].tradePartName : 'N/A');
                                    }
                                }
                                if (mergeStatusInfo[i].Seller && mergeStatusInfo[i].Seller.length) {
                                    for (var j = 0; j < mergeStatusInfo[i].Seller.length; j++) {
                                        if (j > 0) {
                                            sellers += (',' + (mergeStatusInfo[i].Seller[j].tradePartName ? mergeStatusInfo[i].Seller[j].tradePartName : 'N/A'));
                                        } else {
                                            sellers += (mergeStatusInfo[i].Seller[j].tradePartName ? mergeStatusInfo[i].Seller[j].tradePartName : 'N/A');
                                        }
                                    }
                                }
                                mergeMoreStr = ('<a class="underline wi-secondary-color wi-link-color LinkToMerge" target="_blank" href="' + mergeHref + mergeStatusInfo[i].EventId + '">' + buyers + '竞购' + sellers + '所持有的' + (mergeStatusInfo[i].TradeTarget ? mergeStatusInfo[i].TradeTarget : '--') + '</a>');
                                mergeMoreArr.push(mergeMoreStr);
                                dataItem.name = mergeMoreStr;
                                dataItem.date = mergeStatusInfo[i].Date;
                                dataItem.type = '并购'
                                dataSet.push(dataItem)
                            }
                        }
                        if (res.Pevc && res.Pevc.length) {
                            var pevcInfo = res.Pevc;
                            var pevcStr = '';
                            var pevcCorp = '';
                            var tmpPevc = '';
                            for (var i = 0; i < pevcInfo.length; i++) {
                                var dataItem = {};
                                if (pevcInfo[i].invests && !pevcInfo[i].invests['N/A']) {
                                    for (var k in pevcInfo[i].invests) {
                                        if (!tmpPevc) {
                                            pevcCorp = tmpPevc = (pevcInfo[i].invests[k])
                                        } else {
                                            pevcCorp = tmpPevc = (tmpPevc + ',' + pevcInfo[i].invests[k])
                                        }
                                    }
                                }
                                pevcStr = '<a class="underline wi-secondary-color wi-link-color LinkPEVC" target="_blank" href="' +
                                    pevcHref + (pevcInfo[i].financingId ? pevcInfo[i].financingId : pevcInfo[i].investmentCompanyId) + '&eventId=' + pevcInfo[i].eventId + '">' +
                                    (pevcInfo[i].financingOrg ? pevcInfo[i].financingOrg : '--') + '获得' + pevcCorp + (pevcInfo[i].turnCode ? pevcInfo[i].turnCode : '--') + '轮' + (pevcInfo[i].financingMoney ? pevcInfo[i].financingMoney + '万' : '--') +
                                    (pevcInfo[i].moneyCode ? pevcInfo[i].moneyCode : '--') + '投资' + '</a>';
                                pevcArr.push(pevcStr)
                                dataItem.name = pevcStr;
                                dataItem.date = pevcInfo[i].financingDate;
                                dataItem.type = 'PEVC'
                                dataSet.push(dataItem)
                            }
                        }
                        return dataSet;
                    }
                } else {
                    // $('.chart-header').show();
                }
            }, function() {
                // $('.chart-header').show();
            })

            myWfcAjax("getshareholdertree", parameter, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    CompanyChart.rootData = rootData = data.Data;
                    try {
                        $.extend(true, vData, data.Data);
                        CompanyChart.echart2CommonFuns(rootData, 'stockShare');

                        $('.chart-nav-first').on('click', 'button', gqjgNavFirstEvent);
                        $('.chart-nav-second').on('blur', 'input', gqjgNavSecondEvent);
                        $('.chart-toolbar').on('click', 'li', gqjgHeaderEvent);

                    } catch (e) {
                        CompanyChart.chartNoData(intl('132725' /*暂无数据*/ ));
                        console.log('股权结构绘制失败:' + e);
                    }
                } else {
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ ));
                    console.log('股权结构数据/接口异常');
                }
            }, function() {
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ ));
                console.log('股权结构服务端异常');
            })

            /**
             * 数据变形 先状态/后持股比例/再显示隐藏处理
             * 
             * @returns 
             */
            function structData() {
                var nowData = {};
                $.extend(true, nowData, vData);

                /**
                 * 企业状态变形
                 */
                var firstFilter = $('.chart-nav-first').find('button:not(.wi-secondary-bg)');
                if (firstFilter.length) {
                    var txts = [];
                    for (var i = 0; i < firstFilter.length; i++) {
                        var txt = $(firstFilter[i]).text();
                        getStatusNodeNew(nowData.children, txt);
                    }
                }

                /**
                 * 持股比例显示隐藏变形
                 */
                var hideVal = $('.chart-header-rate').attr('data-hide') - 0; // 默认1 表示当前已显示持股比例
                hideRate(nowData.children, !hideVal);

                /**
                 * 持股比例大小过滤
                 */
                var val = $('.chart-nav-rateset').val();
                var num = Number(val);
                if (!val) {
                    getRateNode(nowData.children, -1);
                } else if (!num) {
                    getRateNode(nowData.children, -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else if (num < 0) {
                    getRateNode(nowData.children, -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else {
                    getRateNode(nowData.children, num);
                }
                nowData._rateHide = hideVal ? false : true; // _rateHide 字段加在根节点上面区分是否显示持股比例，默认显示持股比例，即隐藏属性:_rateHide = false
                return nowData;
            }

            function gqjgNavFirstEvent(e) {
                var target = e.target;
                var txt = $(target).text();
                var parent = $(target).parent();
                var count = parent.find('.wi-secondary-bg').length;
                if (count == 1) {
                    if ($(target).hasClass('wi-secondary-bg')) {
                        layer.msg('至少一个条件!');
                        return false;
                    } else {
                        $(target).addClass('wi-secondary-bg');
                    }
                } else {
                    if ($(target).hasClass('wi-secondary-bg')) {
                        $(target).removeClass('wi-secondary-bg');
                    } else {
                        $(target).addClass('wi-secondary-bg');
                    }
                }
                var nowData = structData();
                CompanyChart.echart2CommonFuns(nowData, 'stockShare');
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 比例
             * 
             * @param {any} data
             * @param {any} rate
             */
            function getRateNode(data, rate) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var t = data[i];
                    if (t.stockShare <= rate) {
                        data.splice(i, 1);
                        len = len - 1;
                        i = i - 1;
                    } else if (t.children && t.children.length) {
                        getRateNode(t.children, rate)
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

                    if (t.type == 'company') {
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
                    }
                    (t.children && t.children.length) && getStatusNode(t.children, status)
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
                    (t.children && t.children.length) && getStatusNode(t.children, status)
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
            function gqjgNavSecondEvent(e) {
                var nowData = structData();
                CompanyChart.echart2CommonFuns(nowData, 'stockShare');
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 刷新
             * 
             * @param {any} e 
             * @returns 
             */
            function reloadChart(e) {
                Common.burypcfunctioncode('922602100349');
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 对外投资header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function gqjgHeaderEvent(e) {
                var target = e.target;
                if (!$(target).is('li')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 0:
                        gqjgListEvent()
                        break;
                    case 1:
                        gqjgSaveImgEvent();
                        break;
                    case 2:
                        {
                            try {
                                Common.burypcfunctioncode('922602100348');
                                var hideVal = $(target).attr('data-hide') - 0; // 默认1 表示当前已显示持股比例
                                var childs = CompanyChart.echartInstance._innerOption.series[0].data[0];
                                childs._rateHide = hideVal ? true : false;
                                getRateNode(childs);

                                function getRateNode(data) {
                                    if (data.children) {
                                        for (var i = 0; i < data.children.length; i++) {
                                            getRateNode(data.children[i]);
                                        }
                                    }
                                    // 将连线上的文字隐藏 即隐藏持股比例字段
                                    if (data.symbol === 'arrowdown') {
                                        data.name = (hideVal ? '' : data._name);
                                    }
                                }
                                CompanyChart.echartInstance.clear();
                                CompanyChart.echartInstance.setOption(CompanyChart.echartInstance._innerOption);
                                Common.initZrender(CompanyChart.echartInstance);
                                $(target).attr('data-hide', hideVal ? 0 : 1);
                                // $(target).find('span').text(hideVal ? '显示持股比例' : '隐藏持股比例');
                                if (!hideVal) {
                                    $(target).addClass('chart-header-rate-other');
                                } else {
                                    $(target).removeClass('chart-header-rate-other');
                                }
                            } catch (e) {}
                            break;
                        }
                    case 3:
                    default:
                        reloadChart();
                        break;
                }
                return false;
            }

            /**
             * 股权结构保存图片事件委托
             * 
             * @param {any} e 
             */
            function gqjgSaveImgEvent(e) {
                Common.burypcfunctioncode('922602100347');
                if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                    if (layer) {
                        layer.msg('功能升级中!')
                    } else {
                        window.alert('功能升级中!')
                    }
                    return;
                }
                CompanyChart.saveEchart2Img('股权结构');
            }

            /**
             * 股权结构列表事件委托
             * 
             * @param {any} e 
             */
            function gqjgListEvent(e) {
                layer.open({
                    title: ['重大事项', 'font-size:18px;'],
                    skin: 'feedback-body',
                    type: 2,
                    area: ['950px', '720px'], //宽高        
                    content: '../Company/chartShareList.html?cmd=getsharehoderevent&param=' + CompanyChart.companyCode
                })
            }
        },
        // 对外投资
        loadDWTZ: function() {
            Common.burypcfunctioncode('922602100362');
            $('#load_data').show();
            var rootData = null;
            var parameter = { "companycode": CompanyChart.companyCode, "depth": 4 };

            var htmlArr = [];
            var vData = {}; // 暂存原始数据

            $('#rContent').find('#toolNav').remove();
            htmlArr.push('<div id="toolNav">');
            // htmlArr.push('<div class="chart-header"><button class="chart-header-list wi-secondary-bg" style="display:none;">企业列表</button> <button class="chart-header-save wi-secondary-bg">保存图片</button> <button class="chart-header-rate wi-secondary-bg" data-hide="1">隐藏持股比例</button> <button class="chart-header-reload wi-secondary-bg"><i></i>刷新</button></div>');
            htmlArr.push('<div class="chart-nav">');
            htmlArr.push('<div class="chart-nav-first"><span>企业状态</span><button class="chart-nav-btn wi-secondary-bg" data-api="LegalPers">存续</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">注销</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">迁出</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">吊销,未注销</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">吊销,已注销</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">撤销</button><button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">停业</button>')
            htmlArr.push('<button class="chart-nav-btn wi-secondary-bg" data-api="HistLegalPers">非正常户</button>')
            htmlArr.push('</div>');
            if (window.wind && wind.langControl.lang !== 'zh') {
                htmlArr.push('<div class="chart-nav-second">' + intl('138287') + '<input class="chart-nav-rateset" type="text" />%</div>');
            } else {
                htmlArr.push('<div class="chart-nav-second"><span>去除持股</span><input class="chart-nav-rateset" type="text" />%以下的节点</div>');
            }
            htmlArr.push('</div>');
            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ ) + '</span></li>');
            htmlArr.push('<li class="chart-header-rate chart-header-rate-other" data-hide="1"><span>' + intl('138871' /* 持股比例 */ ) + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ ) + '</span></li>');
            htmlArr.push('</ul></div>');
            htmlArr.push('</div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');

            $('.chart-nav-first').off('click', 'button');
            $('.chart-nav-second').off('blur', 'input');
            $('.chart-toolbar').off('click', 'li');

            myWfcAjax("getallforeigninvestment", parameter, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    CompanyChart.rootData = rootData = data.Data;
                    try {
                        $.extend(true, vData, data.Data);
                        CompanyChart.echart2CommonFuns(rootData, 'parentStockShare', true);

                        $('.chart-nav-first').on('click', 'button', dwtzNavFirstEvent);
                        $('.chart-nav-second').on('blur', 'input', dwtzNavSecondEvent);
                        $('.chart-toolbar').on('click', 'li', dwtzHeaderEvent);

                    } catch (e) {
                        CompanyChart.chartNoData(intl('132725' /*暂无数据*/ ));
                        console.log('对外投资绘制失败:' + e);
                    }
                } else {
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ ));
                    console.log('对外投资数据/接口异常');
                }
            }, function() {
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ ));
                console.log('对外投资服务端异常');
            });

            /**
             * 数据变形 先状态/后持股比例/再显示隐藏处理
             * 
             * @returns 
             */
            function structData() {
                var nowData = {};
                $.extend(true, nowData, vData);

                /**
                 * 企业状态变形
                 */
                var firstFilter = $('.chart-nav-first').find('button:not(.wi-secondary-bg)');
                if (firstFilter.length) {
                    var txts = [];
                    for (var i = 0; i < firstFilter.length; i++) {
                        var txt = $(firstFilter[i]).text();
                        getStatusNodeNew(nowData.children, txt);
                    }
                }

                /**
                 * 持股比例显示隐藏变形
                 */
                var hideVal = $('.chart-header-rate').attr('data-hide') - 0; // 默认1 表示当前已显示持股比例
                hideRate(nowData.children, !hideVal);

                /**
                 * 持股比例大小过滤
                 */
                var val = $('.chart-nav-rateset').val();
                var num = Number(val);
                if (!val) {
                    getRateNode(nowData.children, -1);
                } else if (!num) {
                    getRateNode(nowData.children, -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else if (num < 0) {
                    getRateNode(nowData.children, -1);
                    layer.msg('输入格式有误, 重置初始状态!');
                } else {
                    getRateNode(nowData.children, num);
                }

                nowData._rateHide = hideVal ? false : true; // _rateHide 字段加在根节点上面区分是否显示持股比例，默认显示持股比例，即隐藏属性:_rateHide = false

                return nowData;
            }

            function dwtzNavFirstEvent(e) {
                var target = e.target;
                var txt = $(target).text();
                var parent = $(target).parent();
                var count = parent.find('.wi-secondary-bg').length;
                if (count == 1) {
                    if ($(target).hasClass('wi-secondary-bg')) {
                        layer.msg('至少一个条件!');
                        return false;
                    } else {
                        $(target).addClass('wi-secondary-bg');
                    }
                } else {
                    if ($(target).hasClass('wi-secondary-bg')) {
                        $(target).removeClass('wi-secondary-bg');
                    } else {
                        $(target).addClass('wi-secondary-bg');
                    }
                }
                var nowData = structData();
                CompanyChart.echart2CommonFuns(nowData, 'parentStockShare', true);
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 比例
             * 
             * @param {any} data
             * @param {any} rate
             */
            function getRateNode(data, rate) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var t = data[i];
                    if (t.parentStockShare <= rate) {
                        data.splice(i, 1);
                        len = len - 1;
                        i = i - 1;
                    } else if (t.children && t.children.length) {
                        getRateNode(t.children, rate)
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
                    (t.children && t.children.length) && getStatusNode(t.children, status)
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
                    (t.children && t.children.length) && getStatusNode(t.children, status)
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
            function dwtzNavSecondEvent(e) {
                var nowData = structData();
                CompanyChart.echart2CommonFuns(nowData, 'parentStockShare', true);
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 刷新
             * 
             * @param {any} e 
             * @returns 
             */
            function reloadChart(e) {
                Common.burypcfunctioncode('922602100352');
                var ecConfig = require('echarts/config');
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                return false;
            }

            /**
             * 对外投资header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function dwtzHeaderEvent(e) {
                var target = e.target;
                if (!$(target).is('li')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 0:
                        dwtzSaveImgEvent();
                        // dwtzListEvent();
                        break;
                    case 1:
                        {
                            try {
                                Common.burypcfunctioncode('922602100351');
                                var hideVal = $(target).attr('data-hide') - 0; // 默认1 表示当前已显示持股比例
                                var childs = CompanyChart.echartInstance._innerOption.series[0].data[0];
                                childs._rateHide = hideVal ? true : false;
                                getRateNode(childs);

                                function getRateNode(data) {
                                    if (data.children) {
                                        for (var i = 0; i < data.children.length; i++) {
                                            getRateNode(data.children[i]);
                                        }
                                    }
                                    // 将连线上的文字隐藏 即隐藏持股比例字段
                                    if (data.symbol === 'arrowdown') {
                                        data.name = (hideVal ? '' : data._name);
                                    }
                                }
                                CompanyChart.echartInstance.clear();
                                CompanyChart.echartInstance.setOption(CompanyChart.echartInstance._innerOption);
                                Common.initZrender(CompanyChart.echartInstance, true);
                                $(target).attr('data-hide', hideVal ? 0 : 1);
                                // $(target).find('span').text(hideVal ? '显示持股比例' : '隐藏持股比例');
                                if (!hideVal) {
                                    $(target).addClass('chart-header-rate-other');
                                } else {
                                    $(target).removeClass('chart-header-rate-other');
                                }
                            } catch (e) {}
                            break;
                        }
                    case 2:
                    default:
                        reloadChart();
                        break;
                }
                return false;
            }

            /**
             * 对外投资左侧nav事件委托
             * 
             * @param {any} e 
             */
            function dwtzNavEvent(e) {
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
             * 对外投资保存图片事件委托
             * 
             * @param {any} e 
             */
            function dwtzSaveImgEvent(e) {
                Common.burypcfunctioncode('922602100350');
                if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                    if (layer) {
                        layer.msg('功能升级中!')
                    } else {
                        window.alert('功能升级中!')
                    }
                    return;
                }
                CompanyChart.saveEchart2Img('对外投资');
            }

            /**
             * 对外投资列表事件委托
             * 
             * @param {any} e 
             */
            function dwtzListEvent(e) {
                layer.open({
                    title: [intl('138216' /* 企业列表 */ ), 'font-size:18px;'],
                    skin: 'feedback-body',
                    type: 2,
                    area: ['950px', '720px'], //宽高        
                    content: '../Company/chartCorpList.html?companyFeature=符合新三板财务条件上市要求企业' + location.search.split('?')[1],
                    shadeClose: true,
                })
            }

        },
        pathDataChange: function(data) {
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
        pathChange: function(paths) {
            var tmp = Common.chartPathChange(paths);
            CompanyChart.filterPathObj = tmp.filterPathObj;
            CompanyChart.allPathObj = tmp.allPathObj;
            CompanyChart.statePathObj = tmp.statePathObj;
            return tmp;
        },
        // 疑似关系
        loadYSGX: function(lev) {
            Common.burypcfunctioncode('922602100363');
            // CompanyChart.invokeD3(4, 'd3.v4.js');
            //疑似关系图谱的数据读取
            var param = {
                companyCode: CompanyChart.companyCode,
                companyName: CompanyChart.companyName
            };

            $('#load_data').show();
            var htmlArr = [];
            $('#rContent').find('#toolNav').remove();
            htmlArr.push('<div id="toolNav">');
            htmlArr.push('<style> .has-nav .mao-screen-area{margin-right:-270px}; </style>');
            // htmlArr.push('<div class="chart-header" style="width:412px;display:block;"><button class="chart-header-list wi-secondary-bg">企业列表</button> <button class="chart-header-save wi-secondary-bg">保存图片</button> <button class="chart-header-rate wi-secondary-bg" data-hide="0">显示属性</button> <button class="chart-header-reload wi-secondary-bg"><i></i>刷新</button> </div>');
            htmlArr.push('<div class="chart-example"><span><i></i>当前探查</span><span><i></i>自然人</span><span><i></i>企业</span><span><i></i>上市</span><span><i></i>发债</span></div>');
            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-list"><span>' + intl('138216' /* 企业列表 */ , '企业列表') + '</span></li>');
            htmlArr.push('<li class="chart-header-rate chart-header-rate-other" data-hide="1"><span>' + intl('138662' /* 关联关系 */ , '关联关系') + '</span></li>');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ , '保存图片') + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ , '刷新') + '</span></li>');
            htmlArr.push('</ul></div>');
            // htmlArr.push('</div>');

            $('#rContent').find('.chart-nav').remove();
            // TODO 过滤条件
            htmlArr.push('<div class="chart-nav">');
            if (lev) {
                htmlArr.push('<div class="chart-nav-zero"><div class="chart-nav-title">' + intl('138264' /* 显示层级 */ , '显示层级') + '</div><button class="chart-nav-btn " data-lev="1" >' + intl('138373' /* 一层 */ , '一层') + '</button><button class="chart-nav-btn wi-secondary-bg " data-lev="2" >' + intl('138374' /* 二层 */ , '二层') + '</button></div>');
            } else {
                htmlArr.push('<div class="chart-nav-zero"><div class="chart-nav-title">' + intl('138264' /* 显示层级 */ , '显示层级') + '</div><button class="chart-nav-btn wi-secondary-bg" data-lev="1" >' + intl('138373' /* 一层 */ , '一层') + '</button><button class="chart-nav-btn " data-lev="2" >' + intl('138374' /* 二层 */ , '二层') + '</button></div>');
            }
            htmlArr.push('<div class="chart-nav-second"><div class="chart-nav-title">' + intl('138662' /* 关联关系 */ , '关联关系') + '</div><button class="chart-nav-btn wi-secondary-bg" data-all="1" data-key="all" >' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn " data-key="legalrep">' + intl('138733' /* 法人 */ , '法人') + '</button><button class="chart-nav-btn " data-key="member">' + intl('64504' /* 高管 */ , '高管') + '</button><button class="chart-nav-btn " data-key="investctrl">' + intl('138623' /* 对外控股 */ , '对外控股') + '</button><button class="chart-nav-btn " data-key="invest">' + intl('138724' /* 对外投资 */ , '对外投资') + '</button><button class="chart-nav-btn " data-key="actctrl">' + intl('138125' /* 实际控制 */ , '实际控制') + '</button><button class="chart-nav-btn " data-key="branch">' + intl('138183' /* 分支机构 */ , '分支机构') + '</button></div>');
            htmlArr.push('<div class="chart-nav-first"><div class="chart-nav-title">' + intl('138680' /* 企业状态 */ , '企业状态') + '</div><button class="chart-nav-btn wi-secondary-bg" data-all="1" data-key="全部">' + intl('138927' /* 全部 */ , '全部') + '</button><button class="chart-nav-btn "   data-key="存续">' + intl('134787' /* 存续 */ , '存续') + '</button><button class="chart-nav-btn "   data-key="注销">' + intl('36489' /* 注销 */ , '注销') + '</button>');
            htmlArr.push('<button class="chart-nav-btn " data-key="迁出">' + intl('134788' /* 迁出 */ , '迁出') + '</button><button class="chart-nav-btn "  data-key="吊销,未注销">' + intl('134789' /* 吊销,未注销 */ , '吊销,未注销') + '</button>');
            htmlArr.push('<button class="chart-nav-btn "  data-key="吊销,已注销">' + intl('134790' /* 吊销,已注销 */ , '吊销,已注销') + '</button><button class="chart-nav-btn "  data-key="撤销">' + intl('2690' /* 撤销 */ , '撤销') + '</button>');
            htmlArr.push('<button class="chart-nav-btn "  data-key="停业">' + intl('134791' /* 停业 */ , '停业') + '</button><button class="chart-nav-btn "  data-key="非正常户">' + intl('134795' /* 非正常户 */ , '非正常户') + '</button></div>');
            htmlArr.push('<ul class="chart-nav-slide"></ul>');
            htmlArr.push('</div></div>');

            $('#rContent').append(htmlArr.join(''));
            $('#rContent').addClass('has-nav');

            myWfcAjax("getentpatht", { bindcode: param.companyCode, level: lev ? lev : 1 }, function(data) {
                data = JSON.parse(data);
                if (data.ErrorCode == 0 && data.Data && data.Data.nodes && data.Data.nodes.length && data.Data.routes && data.Data.routes.length) {
                    // $('#load_data').hide();
                    // 显示内容
                    try {

                        var dataSet = CompanyChart.dataSet = CompanyChart.pathDataChange(data.Data);
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
                        var pathSet = CompanyChart.pathSet = CompanyChart.pathChange(data.Data.paths);
                        CompanyChart._corpListParams.pathSet = pathSet.pathObj;
                        CompanyChart._corpListParams.companycode = '';
                        CompanyChart._corpListParams.companyname = param.companyName;

                        var _rootNode = null;

                        // 记录当前有多少企业节点(剔除目标公司)
                        for (var iii = 0; iii < dataSet.nodes.length; iii++) {
                            var item = dataSet.nodes[iii];
                            if (item.nodeType == 'company' && (item.windId.indexOf('$') < 0)) {
                                if (item.windId !== param.companyCode) {
                                    if (CompanyChart._corpListParams.companycode) {
                                        CompanyChart._corpListParams.companycode += (',' + item.windId);
                                    } else {
                                        CompanyChart._corpListParams.companycode = item.windId;
                                    }
                                }
                            }
                            if (item.windId === param.companyCode) {
                                _rootNode = item;
                            }
                        }

                        $('#no_data').hide();
                        $('#companyChart').css('visibility', 'hidden');
                        if (0) {
                            var _rootData = CompanyChart.changeRootData(dataSet, param.companyCode, _rootNode);
                            cytoMapInit(_rootData);
                        } else {
                            drawGLLJ2(dataSet, { code: param.companyCode });
                        }

                        function cytoMapInit(graphData) {

                            CompanyChart.getD3Position(graphData);

                            setTimeout(function() {
                                _rootData.routes = _rootData.links;
                                delete _rootData.links;
                                drawGLLJ(_rootData, { code: param.companyCode, name: param.companyName });
                            }, 50);
                        }

                        $('.chart-header-rate').off('click').on('click', actionOneFn);
                        $('.chart-header-reload').off('click').on('click', actionTwoFn);
                        $('.chart-header-save').off('click').on('click', actionSaveFn);
                        $('.chart-header-list').off('click').on('click', actionThreeFn);
                        $('.chart-nav button').off('click').on('click', CompanyChart.filterEventHandler);
                        $('.chart-nav .chart-nav-slide').off('click').on('click', actionSlide);

                    } catch (e) {
                        $('#load_data').hide();
                        $('#rContent').removeClass('has-nav');
                        $('#toolNav').hide();
                        CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                        console.log('疑似关系绘制失败:' + e);
                    }
                } else {
                    $('#rContent').removeClass('has-nav');
                    $('#toolNav').hide();
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                    console.log('疑似关系数据/接口异常');
                }
            }, function() {
                $('#rContent').removeClass('has-nav');
                $('#toolNav').hide();
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                console.log('疑似关系服务端异常');
            });

            function drawGLLJ(root, params) {
                var nodes;
                var links;
                var rootData = {};
                $.extend(true, rootData, root);
                var cy;
                var firstTab = true;
                var id = CompanyChart.companyCode;

                function maoRefresh() {
                    // $('#load_data').show();
                    // cy.reset();
                    // cy.center(cy.$('#' + nodeCenter));
                    // var vData = {};
                    // $.extend(true, vData, rootData);
                    // drawGraph(vData);
                    // CompanyChart.loadYSGX();
                    $('.nav-block.active').trigger('click')
                }

                function maoScale(type) {
                    var scale = cy.zoom();
                    if (type == 1) {
                        if (scale > 2.4) {
                            layer.msg('足够大了！');
                            return;
                        }
                        scale += 0.2;
                    } else if (type == 2) {
                        if (scale <= 0.4) {
                            layer.msg('足够小了！');
                            return;
                        }
                        scale -= 0.2;
                    }
                    cy.zoom({
                        level: scale, // the zoom level
                    });
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
                var colorLink = '#fbd14c';
                var colorLeft = '#e26012';
                var colorRight = '#e26012';
                var colorLink = '#fbd14c';

                var allColor = '#666666';
                // var allColors = ['#9d7fd1', '#e46258', '#fe9d4e', '#fbd14c', '#3cc73e', '#4eb486', '#3db6c6', '#54a4eb', '#1e88e5', '#e26012'];
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
                        // txt: '地址',
                        // props: 'address',
                        txt: '',
                        props: null
                    },
                    'branch': {
                        idx: 2,
                        txt: '分支机构',
                        props: null,
                    },
                    'domain': {
                        idx: 3,
                        // txt: '域名',
                        // props: 'domain',
                        txt: '',
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
                        // txt: '电话',
                        // props: 'tel',
                        txt: '',
                        props: null
                    },
                    'email': {
                        idx: 8,
                        // txt: '邮件',
                        // props: 'email',
                        txt: '',
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
                    var clientHeight = window.document.body.clientHeight;

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
                                    color: colorCenter
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
                                color: colorRY
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
                            } else if (t.isIssued == 'true') {
                                node.color = colorDebt;
                            } else {
                                node.color = colorQT;
                            }
                        }
                        eles.push({
                            data: {
                                id: node.Id,
                                name: node.Name,
                                category: t.nodeType,
                                color: node.color,
                                layout: node.layout,
                                d3x: t.x,
                                d3y: t.y,
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
                                var color = '';

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
                                    // color = allColor;
                                    color = allColors[allColorsObj[link.relType].idx];
                                }
                                label = allColorsObj[link.relType].txt;
                            } else {
                                label = '';
                                props = '';
                                color = allColor;
                            }
                            if (type[0] === 'member') {
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

                    CompanyChart.cyInstance = cy = cytoscape({
                        container: document.getElementById('companyChart'),
                        motionBlur: false,
                        textureOnViewport: false,
                        wheelSensitivity: 0.1,
                        elements: eles,
                        minZoom: 0.6,
                        maxZoom: 1.6,
                        layout: {
                            // name: 'cose',
                            name: 'preset',
                            fit: true,
                            // fit: data.entities.length < 30 ? true : false,
                            componentSpacing: 40,
                            nestingFactor: 12,
                            padding: 10,
                            edgeElasticity: 800,
                            idealEdgeLength: function(edge) {
                                return 10;
                            },
                            // ready: function() {
                            //     $("#screenArea").css("cursor", "pointer");
                            //     var nodeLength = cy.collection("node").length;
                            //     if (nodeLength < 8) {
                            //         cy.zoom({ level: 1.4 })
                            //     } else if (nodeLength >= 8 && nodeLength < 16) {
                            //         cy.zoom({ level: 1.3 })
                            //     } else if (nodeLength >= 15 && nodeLength < 25) {
                            //         cy.zoom({ level: 1.1 })
                            //     } else {
                            //         cy.zoom({ level: 1.01 })
                            //     }
                            //     cy.collection("edge").addClass("hidetext")
                            // },
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
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 77;
                                        } else if (ele.data("category") == "person") {
                                            return 56;
                                        } else if (ele.data("category") == "email" || ele.data("category") == "domain" || ele.data("category") == "address" || ele.data("category") == "tel") {
                                            return 47;
                                        } else {
                                            return 77;
                                        }
                                    },
                                    height: function(ele) {
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 77;
                                        } else if (ele.data("category") == "person") {
                                            return 53;
                                        } else if (ele.data("category") == "email" || ele.data("category") == "domain" || ele.data("category") == "address" || ele.data("category") == "tel") {
                                            return 44;
                                        } else {
                                            return 77;
                                        }
                                    },
                                    'background-color': function(ele) {
                                        return ele.data('color')
                                    },
                                    'background-image': function(ele) {
                                        if (ele.data('id') === nodeCenter && ele.data("category") == 'company') {
                                            return '../resource/images/chart/c-company.png';
                                        } else if (ele.data('id') === nodeCenter && ele.data("category") == "person") {
                                            return '../resource/images/chart/c-person.png';
                                        } else if (ele.data("category") == "person") {
                                            return '../resource/images/chart/person.png';
                                        } else if (ele.data("category") == "email") {
                                            return '../resource/images/chart/email.png';
                                        } else if (ele.data("category") == "domain") {
                                            return '../resource/images/chart/url.png';
                                        } else if (ele.data("category") == "address") {
                                            return '../resource/images/chart/address.png';
                                        } else if (ele.data("category") == "tel") {
                                            return '../resource/images/chart/tel.png';
                                        } else {
                                            return '../resource/images/chart/company.png';
                                        }
                                    },
                                    'background-fit': 'cover cover',
                                    'background-width': '100%',
                                    'background-height': '100%',
                                    'background-image-opacity': 0.8,
                                    label: function(ele) {
                                        var label = ele.data("name");
                                        // var test = '<pre><div style="color:lime;">' + label + '</div></pre>';
                                        // label = label ? label.replace(/(.{5})(?=.)/g, '$1\n') : 'N/A';
                                        return label;
                                        // return test;
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
                                    'text-margin-y': 3,
                                    'z-index-compare': 'manual',
                                    'z-index': 20,
                                    color: "#000",
                                    'font-size': function() {
                                        return 12;
                                    },
                                    'font-family': 'inherit',
                                    // 'text-wrap': 'wrap',
                                    // 'text-max-width': 60,
                                    'text-halign': 'center',
                                    'text-valign': 'bottom',
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
                                    // 'line-style': 'dashed', // 虚线
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
                                            return colorQT
                                        }
                                    },
                                    'border-width': 10,
                                    'border-opacity': 0.5,
                                    width: function(ele) {
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 79;
                                        } else if (ele.data("category") == "person") {
                                            return 56;
                                        } else if (ele.data("category") == "company") {
                                            return 79;
                                        } else {
                                            return 45;
                                        }
                                    },
                                    height: function(ele) {
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 79;
                                        } else if (ele.data("category") == "person") {
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

                    CompanyChart.cyInstance.txtHide = ($('.chart-header-rate').attr('data-hide') - 0) ? true : false;

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
                        // firstTab = false;
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

                            if (!CompanyChart.cyInstance.txtHide) {
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
                        // if (a._private.data.id === nodeCenter) {
                        //     return { x: 900, y: 900 }
                        // } else {
                        //     cy.pan({ x: clientWidth / 2, y: 100 });
                        // }

                        // 保持居中
                        if (a._private.data.id == nodeCenter) {
                            var position = cy.pan();
                            cy.pan({
                                x: position.x - a._private.data.d3x,
                                y: position.y - a._private.data.d3y
                            });
                        }

                        return {
                            x: a._private.data.d3x,
                            y: a._private.data.d3y
                        };
                    });

                    cy.ready(function() {
                        var len = cy.collection("node").length;
                        if (len > 100) {
                            cy.zoom({ level: 0.8 });
                        } else if (len > 50) {
                            cy.zoom({ level: 0.9 });
                        } else {
                            cy.zoom({ level: 1.0000095043745896 });
                        }
                        cy.collection("edge").addClass("hidetext")
                        setTimeout(function() {
                            cy.collection("edge").addClass("lineFixed")
                        }, 100)

                        $("#load_data").hide();

                        // cy.$('#' + CompanyChart.companyCode).emit('tap');
                        cy.center(cy.$('#' + nodeCenter));
                        cy.$('#' + nodeCenter)[0]._isRoot = true;
                        // cy.collection("edge").addClass("edgeActive");
                    });


                    cy.on('zoom', function() {
                        if (cy.zoom() < 0.5) {
                            cy.collection("node").addClass("hidetext");
                            // cy.collection("edge").addClass("hidetext");
                        } else {
                            cy.collection("node").removeClass("hidetext");
                            // cy.collection("edge").removeClass("hidetext");
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
                    $('#screenArea').height($(window).height() - CompanyChart.chartHeaderHeight);
                    // $('.content').height($('#screenArea').height() + $('.bottom-content').height());
                    $('#companyChart').height($('#screenArea').height());
                }
                resizeScreen();
                getData();
            }

            function drawGLLJ2(root, params) {
                var nodes;
                var links;
                var rootData = {};
                $.extend(true, rootData, root);
                var cy;
                var firstTab = true;
                var id = CompanyChart.companyCode;

                function maoRefresh() {
                    // cy.reset();
                    // cy.center(cy.$('#' + nodeCenter));
                    // var vData = {};
                    // $.extend(true, vData, rootData);
                    // drawGraph(vData);

                    $('.nav-block.active').trigger('click')
                }

                function maoScale(type) {
                    var scale = cy.zoom();
                    if (type == 1) {
                        if (scale > 2.4) {
                            layer.msg('足够大了！');
                            return;
                        }
                        scale += 0.2;
                    } else if (type == 2) {
                        if (scale <= 0.4) {
                            layer.msg('足够小了！');
                            return;
                        }
                        scale -= 0.2;
                    }
                    cy.zoom({
                        level: scale, // the zoom level
                    });
                }

                function getData() {
                    drawGraph(root);
                }
                var nodeCenter = params.code;
                var colorLeft = '#e26012';
                var colorRight = '#e26012';
                // ycye.cecil modify UI颜色 2020-10-26 start
                var colorCenter = '#f68717';
                var colorRY = '#e05d5d';
                var colorQT = '#2277a2';
                var colorDebt = '#8862ac';
                var colorIpo = '#63a074';
                // ycye.cecil modify UI颜色 2020-10-26 end
                var colorLink = '#fbd14c';

                var allColor = '#666666';
                // var allColors = ['#9d7fd1', '#e46258', '#fe9d4e', '#fbd14c', '#3cc73e', '#4eb486', '#3db6c6', '#54a4eb', '#1e88e5', '#e26012'];
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
                    var clientHeight = window.document.body.clientHeight;

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
                                    color: colorCenter
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

                                // if (t === 'invest' || t === 'actctrl') {
                                //     prop = Common.formatPercent(prop);
                                // }

                                if (t === 'member') {
                                    _label = prop;
                                }

                                if (label) {
                                    // label = label + ', ' + _label + (prop ? '(' + prop + ')' : '');
                                    label = label + ', ' + _label;
                                } else {
                                    // label = _label + (prop ? '(' + prop + ')' : '');
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
                                    // color = allColor;
                                    color = allColors[allColorsObj[link.relType].idx];
                                }
                                label = allColorsObj[link.relType].txt;
                            } else {
                                label = '';
                                props = '';
                                color = allColor;
                            }

                            // if (type[0] === 'invest' || type[0] === 'actctrl') {
                            //     props = Common.formatPercent(props);
                            // }
                            // label = label + (props ? '(' + props + ')' : '');

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
                    CompanyChart.cyInstance = cy = cytoscape({
                        container: document.getElementById('companyChart'),
                        motionBlur: false,
                        textureOnViewport: false,
                        wheelSensitivity: 0.1,
                        elements: eles,
                        minZoom: 0.6,
                        maxZoom: 1.6,
                        layout: {
                            name: 'cose',
                            // name: 'preset',
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
                                // cy.collection("edge").addClass("hidetext")
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
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 77;
                                        } else if (ele.data("category") == "person") {
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
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 77;
                                        } else if (ele.data("category") == "person") {
                                            return 53;
                                        } else if (ele.data("category") == "email" || ele.data("category") == "domain" || ele.data("category") == "address" || ele.data("category") == "tel") {
                                            return 44;
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
                                        // if (ele.data('imgId')) {
                                        //     if (!global_isRelease) {
                                        //         return 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + ele.data('imgId');
                                        //     } else {
                                        //         return 'http://wfcweb/imageWeb/ImgHandler.aspx?imageID=' + ele.data('imgId');
                                        //     }
                                        // }                                        
                                        // return '../resource/images/Company/sy.png';
                                        if (!global_isRelease) {
                                            return 'none';
                                        } else {
                                            var imgId = ele.data('imgId');
                                            if (imgId && CompanyChart.imgServerIp) {
                                                // return 'http://' + CompanyChart.imgServerIp + '/imageWeb/ImgHandler.aspx?imageID=' + imgId;
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
                                            if (imgId && CompanyChart.imgServerIp) {
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
                                            if (imgId && CompanyChart.imgServerIp) {
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
                                    // 'text-margin-y': function(ele) {
                                    //     if (ele._private.data.name.length < 5) {
                                    //         return 0;
                                    //     }
                                    //     return 0;
                                    //     // return 4;
                                    // },
                                    'z-index-compare': 'manual',
                                    'z-index': 20,
                                    color: "#fff",
                                    'font-size': function() {
                                        return 14;
                                    },
                                    'font-family': 'Microsoft YaHei',
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
                                    // 'line-style': 'dashed', // 虚线
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
                                    'font-family': 'Microsoft YaHei',
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
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 79;
                                        } else if (ele.data("category") == "person") {
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
                                        if (ele.data('id') === CompanyChart.companyCode) {
                                            return 79;
                                        } else if (ele.data("category") == "person") {
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

                    CompanyChart.cyInstance.txtHide = ($('.chart-header-rate').attr('data-hide') - 0) ? true : false;

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

                        if (node._private.data && node._private.data.id) {
                            if (node._private.data.id.indexOf('$') !== 0) {
                                if (node._private.data.category == 'person') {
                                    Common.chartCardEventHandler({ companyCode: node._private.data.id, title: '人物信息', type: 'person', name: node._private.data.name })
                                } else {
                                    Common.chartCardEventHandler({ companyCode: node._private.data.id, title: '企业信息', type: 'company', name: node._private.data.name })
                                }
                            }
                        }

                        // firstTab = false;
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

                            if (!CompanyChart.cyInstance.txtHide) {
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
                            return { x: 900 - 300, y: 900 }
                        } else {
                            cy.pan({ x: clientWidth - 300 / 2, y: 100 });
                        }
                    });

                    cy.ready(function() {
                        var level1Len = 0;
                        if (CompanyChart.dataSet && CompanyChart.dataSet.levelObj) {
                            var level1Obj = CompanyChart.dataSet.levelObj[1];
                            level1Len = Object.keys(level1Obj).length + 1;
                        }
                        var len = level1Len; // 取出第一层数据量判断初始放大/缩小倍数
                        if (len < 8) {
                            cy.zoom({ level: 1.2 })
                        } else if (len >= 8 && len < 16) {
                            cy.zoom({ level: 1.1 })
                        } else if (len >= 15 && len < 25) {
                            cy.zoom({ level: 1.01 })
                        } else {
                            cy.zoom({ level: 0.9 })
                        }
                        setTimeout(function() {
                            cy.collection("edge").addClass("lineFixed")
                        }, 400)

                        $("#load_data").hide();

                        // cy.$('#' + CompanyChart.companyCode).emit('tap');
                        cy.center(cy.$('#' + nodeCenter));
                        cy.$('#' + nodeCenter)[0]._isRoot = true;
                        // cy.collection("edge").addClass("edgeActive");
                        // CompanyChart.filterNodes(true); //默认展示第一层数据
                        $('#companyChart').css('visibility', 'visible');
                    });
                    cy.nodes(function(a) {})

                    cy.on('zoom', function() {
                        if (cy.zoom() < 0.5) {
                            cy.collection("node").addClass("hidetext");
                            // cy.collection("edge").addClass("hidetext");
                        } else {
                            cy.collection("node").removeClass("hidetext");
                            // cy.collection("edge").removeClass("hidetext");
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
                    // $('#screenArea').height($(window).height() - CompanyChart.chartHeaderHeight - 24);
                    // $('.content').height($('#screenArea').height() + $('.bottom-content').height());
                    $('#companyChart').height($('#screenArea').height());
                }
                resizeScreen();
                getData();

                function actionOneFn(e) {
                    if ($('#load_data').attr('style').indexOf('block') > -1) {
                        return false;
                    }
                    var target = e.target;
                    if (!$(target).is('li')) {
                        target = target.closest('li');
                    }
                    if ($(target).hasClass('wi-secondary-bg')) {
                        $(target).removeClass('wi-secondary-bg')
                        window._CompanyChart.cyInstance.collection('edge').removeClass('hidetext');
                    } else {
                        $(target).addClass('wi-secondary-bg')
                        window._CompanyChart.cyInstance.collection('edge').addClass('hidetext');
                    }
                }

                function actionTwoFn(e) {
                    if ($('#load_data').attr('style').indexOf('block') > -1) {
                        return false;
                    }
                    var target = e.target;
                    if (!$(target).is('li')) {
                        target = target.closest('li');
                    }
                    maoRefresh();
                }

                function actionThreeFn(e) {
                    if ($('#load_data').attr('style').indexOf('block') > -1) {
                        return false;
                    }
                    var target = e.target;
                    if (!$(target).is('li')) {
                        target = target.closest('li');
                    }
                    maoScale(1);
                }

                function actionFourFn(e) {
                    if ($('#load_data').attr('style').indexOf('block') > -1) {
                        return false;
                    }
                    var target = e.target;
                    if (!$(target).is('li')) {
                        target = target.closest('li');
                    }
                    maoScale(2);
                }

                function actionSaveFn(e) {
                    if ($('#load_data').attr('style').indexOf('block') > -1) {
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

                    var imgData = CompanyChart.cyInstance.jpg({ full: true, bg: '#ffffff', scale: 1.8 })
                    var target = $('[data-id="layer2-node"]');
                    Common.saveCanvasImg('[data-id="layer2-node"]', '关联路径', 3, imgData);
                    // myWfcAjax('getecho', { echo: imgData }, function(res) {
                    //     res = JSON.parse(res);
                    //     var a = document.createElement('a')
                    //     var event = new MouseEvent('click');
                    //     a.download = 'aabb';
                    //     a.href = res.Data;
                    //     // a.target = '_blank';
                    //     a.dispatchEvent(event)
                    // }, function() {
                    // });
                }

                // $('#chartActionOne').off('click').on('click', actionOneFn);
                // $('#chartActionTwo').off('click').on('click', actionTwoFn);
                // $('#chartActionThree').off('click').on('click', actionThreeFn);
                // $('#chartActionFour').off('click').on('click', actionFourFn);
                // $('.chart-header-save').off('click').on('click', actionSaveFn);
            }

            function actionSaveFn(e) {
                Common.burypcfunctioncode('922602100355');
                if ($('#load_data').attr('style').indexOf('block') > -1) {
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
                var imgData = CompanyChart.cyInstance.jpg({ full: true, bg: '#ffffff', scale: 1.8 })
                var target = $('[data-id="layer2-node"]')
                Common.saveCanvasImg('[data-id="layer2-node"]', '疑似关联', 3, imgData)
            }

            function actionOneFn(e) {
                Common.burypcfunctioncode('922602100354');
                var val = $(this).attr('data-hide');
                if (val == 1) {
                    $(this).removeClass('chart-header-rate-other')
                    window._CompanyChart.cyInstance.collection('edge').addClass('hidetext');
                    CompanyChart.cyInstance.txtHide = false;
                    $(this).attr('data-hide', 0);
                    // $(this).find('span').text('显示属性')
                } else {
                    $(this).addClass('chart-header-rate-other')
                    window._CompanyChart.cyInstance.collection('edge').removeClass('hidetext');
                    CompanyChart.cyInstance.txtHide = true;
                    $(this).attr('data-hide', 1);
                    // $(this).find('span').text('隐藏属性')
                }
            }

            function actionTwoFn(e) {
                Common.burypcfunctioncode('922602100356');
                if ($('#load_data').attr('style').indexOf('block') > -1) {
                    return false;
                }
                CompanyChart.cyInstance._reload && CompanyChart.cyInstance._reload();
                var val = $('.chart-header-rate').attr('data-hide') - 0;
                if (val) {
                    setTimeout(function() {
                        window._CompanyChart.cyInstance.collection('edge').removeClass('hidetext');
                        CompanyChart.cyInstance.txtHide = val ? true : false;
                    }, 10)
                }
            }

            function actionThreeFn(e) {
                Common.burypcfunctioncode('922602100353');
                CompanyChart._corpListParams.cmd = 'relationpathcorps';
                layer.open({
                    title: [intl('138216' /* 企业列表 */ , '企业列表'), 'font-size:18px;'],
                    skin: 'feedback-body',
                    type: 2,
                    area: ['950px', '720px'], //宽高        
                    content: '../Company/chartCorpList.html' + location.search,
                    shadeClose: true,
                })
            }

            function actionSlide(e) {
                var parent = $(e.target).parent();
                var root = $(parent).closest('#rContent');
                var width = $('#screenArea').width();
                if ($(parent).hasClass('chart-hide')) {
                    $(parent).removeClass('chart-hide')
                    $(root).addClass('has-nav')
                        // $(root).find('#companyChart svg').attr('width', $('#screenArea').width() - 300);
                } else {
                    $(parent).addClass('chart-hide')
                    $(root).removeClass('has-nav')
                        // $(root).find('#companyChart svg').attr('width', $('#screenArea').width() + 300);
                }
            }
        },
        // 疑似控制人
        loadYSKZR: function() {
            Common.burypcfunctioncode('922602100364');
            // CompanyChart.invokeD3(3, 'd3.min.js');
            var suspectedControlParam = {
                "companyid": CompanyChart.companyId,
                "companycode": CompanyChart.companyCode
            }
            var id = '';
            var name = '';
            var ratio = '';
            var ctrlIdArr = []; // 控制人id Array
            var namrArr = [];
            var ratioArr = [];
            $('#rContent').find('#toolNav').remove();
            $('#rContent').append('<div id="toolNav"></div>')
            $('#rContent').find('#toolNav').append('<style>.mao-screen-area{margin-left:10px;}</style>');
            $('#load_data').show();
            myWfcAjax("getactcontroinfo", suspectedControlParam, function(data) {
                //疑似实际控制人请求数据
                var resData = JSON.parse(data);
                if (resData.ErrorCode == '-10') { //无权限
                    var contSet = {
                        title: '疑似控制人',
                        dec: ['购买VIP/SVIP套餐，即可不限次查看企业的疑似控制人', '购买VIP/SVIP套餐，即可不限次查看企业的疑似控制人'],
                        closeCall: function(params) {
                            // window.location.href = window.location.href.split(location.hash)[0];
                            var self = CompanyChart;
                            // 默认加载[企业图谱]                
                            self.loadQYTP();
                            $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg');
                            self.chartSelect = $('.nav-tabs').find('.nav-block').eq(0);
                            self.chartSelect.addClass('active');
                            $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
                        }
                    };
                    Common.Popup([1, true], true, contSet);
                    return;
                }

                if (resData.ErrorCode == 0 && resData.Data && resData.Data.length > 0 && resData.Data[0].ActControName) {
                    drawHtml(resData.Data);
                    id = resData.Data[0].ActControId;
                    name = resData.Data[0].ActControName;
                    ratio = resData.Data[0].ActInvestRate;

                    resData.Data.forEach(function(t) {
                        ctrlIdArr.push(t.ActControId);
                    });

                    showController(ratio, name);
                } else {
                    CompanyChart.chartNoData(intl('138402' /* 暂无疑似实际控制人数据 */ , '暂无疑似实际控制人数据'));
                }
            }, function() {
                CompanyChart.chartNoData(intl('138402' /* 暂无疑似实际控制人数据 */ , '暂无疑似实际控制人数据'));
            });

            function drawHtml(data) {
                var len = data.length;
                var htmlArr = [];
                var id = ""; //通过这个疑似实际控制人id去读取疑似实际控制人全部投资企业，如果为空，则显示无数据。
                // htmlArr.push('<div>疑似实际控制人</div>')
                for (var i = 0; i < len; i++) {
                    var personStr = '';
                    htmlArr.push('<span>&nbsp;&nbsp;&nbsp;&nbsp;' + intl('138449' /* 疑似控制人 */ , '疑似控制人') + '&nbsp;&nbsp;&nbsp;</span>')
                    // if (data[i].ActControId && (data[i].ActControType == 1)) {
                    //     personStr = ' <a class="text-insert" target="_blank" href="Person.html?id=' + data[i].ActControId + '&name=' + data[i].ActControName + Common.isNoToolbar() + '">' + (data[i].ActControName ? data[i].ActControName : '') + '</a>';
                    // } else {
                    //     personStr = '<span class="text-insert">' + (data[i].ActControName ? data[i].ActControName : '') + '</span>';
                    // }
                    personStr = '<span class="text-insert">' + (data[i].ActControName ? data[i].ActControName : '') + '</span>';
                    htmlArr.push(personStr + "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + intl('138412' /* 实际持股比例 */ , '实际持股比例') + "&nbsp;&nbsp;&nbsp;</span><span class='text-insert'>" + (data[i].ActInvestRate ? Common.formatPercent(data[i].ActInvestRate) : '') + "</span><br/>")
                }
                $(".chart-yskzr").html(htmlArr.join(""));
            }

            function showController(thisRatio, controlname) {
                var param = {
                    companyCode: CompanyChart.companyCode,
                    rootName: CompanyChart.companyName,
                    secondCode: id,
                    controllername: name,
                    ctrlIdArr: ctrlIdArr
                };
                myWfcAjax("getactualcontrollerroute", param, function(data) {
                    var data = JSON.parse(data);
                    if (data.ErrorCode == '-10') { //无权限
                        var contSet = {
                            title: '疑似控制人',
                            dec: ['购买VIP/SVIP套餐，即可不限次查看企业的疑似控制人', '购买VIP/SVIP套餐，即可不限次查看企业的疑似控制人'],
                            closeCall: function(params) {
                                // window.location.href = window.location.href.split(location.hash)[0];
                                var self = CompanyChart;
                                // 默认加载[企业图谱]                
                                self.loadQYTP();
                                $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg');
                                self.chartSelect = $('.nav-tabs').find('.nav-block').eq(0);
                                self.chartSelect.addClass('active');
                                $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
                            }
                        };
                        Common.Popup([1, true], true, contSet);
                        return;
                    }
                    if (data.ErrorCode == 0 && data.Data) {
                        $('#load_data').hide();
                        $('#no_data').hide();
                        // 显示内容
                        var root = CompanyChart.rootData = data.Data;
                        try {
                            CompanyChart.drawActualcontrollerroute(root, param, thisRatio, controlname);
                            $('.chart-yskzr').show();
                        } catch (e) {
                            CompanyChart.chartNoData(intl('138402' /* 暂无疑似实际控制人数据 */ , '暂无疑似实际控制人数据'));
                            console.log('疑似控制人绘制失败:' + e);
                        }
                    } else {
                        CompanyChart.chartNoData(intl('138402' /* 暂无疑似实际控制人数据 */ , '暂无疑似实际控制人数据'));
                        console.log('疑似控制人数据/接口异常');
                    }
                }, function() {
                    CompanyChart.chartNoData(intl('138402' /* 暂无疑似实际控制人数据 */ , '暂无疑似实际控制人数据'));
                    console.log('疑似控制人服务端异常');
                });

            }
        },
        // 企业受益人
        loadQYSYR: function() {
            $('#rContent').find('#toolNav').remove();
            $('#rContent').append('<div id="toolNav"></div>');
            var htmlArr = [];
            htmlArr.push('<div class="chart-toolbar" style="display:block;">');
            htmlArr.push('<ul class="wi-secondary-color">');
            htmlArr.push('<li class="chart-header-save"><span>' + intl('138780' /* 保存图片 */ , '保存图片') + '</span></li>');
            htmlArr.push('<li class="chart-header-reload"><span>' + intl('23569' /* 刷新 */ , '刷新') + '</span></li>');
            htmlArr.push('</ul></div>');
            $('#rContent').find('#toolNav').append(htmlArr.join(""));
            $('#rContent').find('#toolNav').append('<style>.mao-screen-area{margin-left:10px;}</style>');
            $('#load_data').show();
            myWfcAjax("getbeneficiaryroute", { companycode: CompanyChart.companyCode }, function(data) {
                //企业受益人
                var resData = JSON.parse(data);
                if (resData.ErrorCode == '-10') { //无权限
                    var contSet = {
                        title: '企业受益人图',
                        dec: ['购买VIP/SVIP套餐，即可不限次查看企业的企业受益人图', '购买VIP/SVIP套餐，即可不限次查看企业的企业受益人图'],
                        closeCall: function(params) {
                            // window.location.href = window.location.href.split(location.hash)[0];
                            var self = CompanyChart;
                            // 默认加载[企业图谱]                
                            self.loadQYTP();
                            $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg');
                            self.chartSelect = $('.nav-tabs').find('.nav-block').eq(0);
                            self.chartSelect.addClass('active');
                            $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg');
                        }
                    };
                    Common.Popup([1, true], true, contSet);
                    return;
                }
                if (resData.ErrorCode == 0 && resData.Data && resData.Data.relationList && resData.Data.relationList.length > 0) {
                    var res = qysyrDataChange(resData.Data);
                    $('#load_data').hide();
                    $('#no_data').hide();
                    loadRealMap(res);
                } else {
                    CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
                }
            }, function() {
                CompanyChart.chartNoData(intl('132725' /*暂无数据*/ , '暂无数据'));
            });

            function qysyrDataChange(data) {
                var tmpData = {
                    nodes: [],
                    routes: [],
                    endNodes: [],
                };
                data.nodeList.forEach(function(nd) {
                    var tmpnd = {
                        "level": nd.depth,
                        "nodeId": nd.nodeId,
                        "nodeName": nd.nodeName,
                        "nodeType": nd.type,
                        "windId": nd.nodeId,
                        imageIdT: nd.imageIdT,
                        actCtrl: nd.actCtrl,
                        indirectRatio: Common.formatPercent(nd.indirectRatio),
                        benifciary: nd.beneficiary ? nd.beneficiary : false,
                    };
                    tmpData.nodes.push(tmpnd);
                })

                data.relationList.forEach(function(nd) {
                    var tmplink = {
                        "endId": nd.targetId,
                        "endNode": nd.targetId,
                        "props": Common.formatPercent(nd.ratio),
                        "startId": nd.sourceId,
                        "startNode": nd.sourceId
                    };
                    tmpData.routes.push(tmplink);
                });

                data.routeList.forEach(function(path) {
                    tmpData.endNodes.push(path[0].nodeId);
                });
                return tmpData;
            }

            function loadRealMap(mapData) {

                var nodeLists = '';
                var vOption = {};
                var _colorObj = {
                    person: "#FA4460",
                    personB: "#FD485E",
                    company: "#52A3EE",
                    companyB: "#128BED",
                    current: "#FD9C24",
                    currentB: "#EF941B",
                    start: "#1F8CEA",
                    end: "#FD7D20"
                }

                var lineTxtColorOne = '#999';
                var lineTxtColorTwo = 'transparent';
                var lineTxtShow = ($('.chart-header-rate').attr('data-hide') == 0 ? false : true);

                var pathColors = ['#9d7fd1', '#e46258', '#fe9d4e', '#fbd14c', '#3cc73e', '#4eb486', '#3db6c6', '#54a4eb', '#1e88e5'];
                var ICON = {
                    ICON_CLOSE: '',
                    ICON_OPEN: ''
                }
                var Text = null;
                var ImageShape = null;
                var Rectangle = null;
                var shapeList = null;

                //数据展示
                var myChart;
                var nodes;
                var links;
                var paths = [];
                var startNode;
                var endNode;
                var levels;
                var fullOffX;
                var fullOffY;
                var fullScreenResize;
                var Image;

                $('#companyChart').css('height', $('#screenArea').height());
                // $('.mao-screen-area').css('height', 'auto');
                $('#companyChart').css('width', $('#screenArea').width());

                mapData.nodes.forEach(function(t) {
                    if (t.nodeType === 'company' && (t.windId.indexOf('$') < 0)) {
                        if (nodeLists) {
                            nodeLists += (',' + t.windId);
                        } else {
                            nodeLists = t.windId;
                        }
                    }
                });

                initChart(mapData);

                function initChart(mapData) {
                    CompanyChart.echartInstance = null;
                    CompanyChart.echartInstance = myChart = echarts.init(document.querySelector('#companyChart'));
                    shapeList = myChart.getZrender().storage.getShapeList();
                    Text = require('zrender/shape/Text');
                    ImageShape = require('zrender/shape/Image');
                    Rectangle = require('zrender/shape/Rectangle');
                    creatChart(mapData);
                }

                function actionOneFn() {
                    function saveImg() {
                        // 移除已有jietu遮罩
                        if ($('[data-id="jietuMask"]')) {
                            $('[data-id="jietuMask"]').remove();
                        }

                        var jietuMask = document.createElement("div");
                        $(jietuMask).attr('data-id', 'jietuMask');
                        $(jietuMask).attr('style', 'position: fixed; background: #fff; z-index: 1000; top: 0px; bottom: 0px; left: 0px; right: 0px;');
                        document.body.appendChild(jietuMask);

                        var layer = myChart.getZrender().painter._layers[1];

                        var bS = layer.scale.concat();
                        var bP = layer.position.concat();
                        var bW = myChart.getZrender().getWidth();
                        var bH = myChart.getZrender().getHeight();
                        $('#companyChart').width(bW * 1.5);
                        $('#companyChart').height(bH * 1.5);
                        myChart.resize();
                        var zdW = myChart.getZrender().getWidth();
                        var zdH = myChart.getZrender().getHeight();

                        layer.scale[0] = 1.5;
                        layer.scale[1] = 1.5;
                        layer.position[0] = (zdW - bW) / 2 - bW / 4;
                        layer.position[1] = (zdH - bH) / 2 - bH / 4;

                        myChart.getZrender().painter.refresh();

                        var shape = new Rectangle({
                            style: {
                                x: -1000,
                                y: -1000,
                                width: zdW + 1000,
                                height: zdH + 1000,
                                color: '#fff'
                            }
                        });
                        shape.zlevel = 1;
                        shape.z = 1;
                        shape.clickcom = true;
                        myChart.getZrender().addShape(shape);

                        setTimeout(function() {
                            var canvas = $('#companyChart canvas')[1];
                            var imgdata = canvas.toDataURL();
                            Common.saveCanvasImg('#companyChart canvas', '企业受益人', 1, imgdata);
                            var shapeList = myChart.getZrender().storage.getShapeList();
                            for (var i = 0; i < shapeList.length; i++) {
                                if (shapeList[i].clickcom) {
                                    myChart.getZrender().delShape(shapeList[i].id);
                                }
                            }
                            $('#companyChart').width('100%');
                            $('#companyChart').height(bH);
                            myChart.resize();
                            layer.scale = bS;
                            layer.position = bP;
                            myChart.getZrender().render();
                            $(jietuMask).css('display', 'none');
                        }, 300);
                    }

                    if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                        if (layer) {
                            layer.msg('功能升级中!')
                        } else {
                            window.alert('功能升级中!')
                        }
                        return;
                    }

                    saveImg();
                }

                function actionTwoFn() {
                    CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
                }

                $('.chart-header-save').off('click').on('click', actionOneFn);
                $('.chart-header-reload').off('click').on('click', actionTwoFn);

                function creatChart(mapData) {
                    var keyNames = {};
                    var nodeMaps = {};

                    var objs = { Nodes: [], Links: [] }; // 数据结构转换
                    for (var i = 0; i < mapData.nodes.length; i++) {
                        var item = mapData.nodes[i];
                        var t = {
                            _Root: (item.windId == CompanyChart.companyCode) ? true : false,
                            Category: item.nodeType == 'company' ? 0 : 2,
                            KeyNo: item.windId,
                            Level: item.level,
                            Name: item.nodeName,
                            nodeType: item.nodeType,
                            imageIdT: item.imageIdT,
                            obj: {
                                properties: {
                                    KeyNo: item.windId,
                                    name: item.nodeName,
                                    id: item.nodeId
                                }
                            },
                            actCtrl: item.actCtrl,
                            benifciary: item.benifciary,
                            indirectRatio: item.indirectRatio
                        }
                        objs.Nodes.push(t);
                        if (!keyNames[item.windId]) {
                            keyNames[item.windId] = item.nodeName;
                        }
                    }
                    for (var i = 0; i < mapData.routes.length; i++) {
                        var link = mapData.routes[i];
                        var t = {
                            Relation: link.props,
                            Source: keyNames[link.startId] || 'left',
                            Target: keyNames[link.endId] || 'right',
                        };
                        objs.Links.push(t);
                    }

                    nodes = [];
                    links = [];
                    levels = [];
                    nodeLinks = {};

                    $.each(objs.Nodes, function(i, node) {
                        var fontSize = 15;
                        // ycye.cecil modify UI颜色 2020-10-27 start
                        var targetBgColor = '#2277a2';
                        var manBgColor = '#e05d5d';
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        var targetTxtColor = '#fff';
                        var corpBgColor = '#fff';
                        var corpTxtColor = '#333';
                        var label = node.Name.replace(/(.{5})(?=.)/g, '$1\n');
                        var lines = Math.round(node.Name.length / 5);
                        // var image = null;
                        // var imgSrc = 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + node.imageId;
                        var imgSrc = node.imageIdT;
                        // var imgUrl = null;
                        // if (node.imageId) {
                        //     image = new window.Image();
                        //     image.setAttribute('crossOrigin', 'anonymous');
                        //     image.src = imgSrc;
                        //     image.onload = function() {
                        //         var canvas = document.createElement('canvas'); //准备空画布
                        //         canvas.width = 30;
                        //         canvas.height = 30;
                        //         var cx = canvas.getContext('2d');
                        //         cx.drawImage(image, 0, 0, 30, 30);
                        //         imgUrl = canvas.toDataURL('image/jpeg');
                        //     }
                        // }
                        node.imageIdT = null;
                        if (node._Root) {
                            // 目标公司
                            nodes.push({
                                category: [1, 2],
                                name: node.Name,
                                keyNo: node.KeyNo,
                                nodeType: node.nodeType,
                                level: node.Level,
                                fixX: true,
                                fixY: true,
                                label: node.nodeName,
                                symbol: 'rectangle',
                                symbolSize: [node.Name.length * 12, 20],
                                itemStyle: {
                                    normal: {
                                        borderRadius: '5%',
                                        color: targetBgColor,
                                        borderWidth: "2",
                                        borderColor: "#0093AD",
                                        label: {
                                            position: 'inside',
                                            textStyle: {
                                                color: targetTxtColor,
                                                fontFamily: "MicroSoft YaHei",
                                                fontSize: fontSize,
                                                fontStyle: "normal",
                                            }
                                        }
                                    },
                                    emphasis: {
                                        borderRadius: '5%',
                                        color: targetBgColor,
                                        borderWidth: 2,
                                        borderColor: "#0093AD",
                                        label: {
                                            show: true,
                                            textStyle: {
                                                color: '#fff',
                                                fontFamily: "MicroSoft YaHei",
                                                fontSize: (fontSize + 1),
                                                fontStyle: "normal"
                                            },
                                        }
                                    }
                                },
                                actCtrl: node.actCtrl,
                                benifciary: node.benifciary,
                                indirectRatio: node.indirectRatio
                            });
                        } else if (node.Category == 2) {
                            // 人物
                            nodes.push({
                                category: [1, 2],
                                name: node.Name,
                                keyNo: node.KeyNo,
                                nodeType: node.nodeType,
                                level: node.Level,
                                fixX: true,
                                fixY: true,
                                label: node.nodeName,
                                // symbol: 'circle',
                                symbol: node.imageIdT ? imgSrc : 'circle',
                                symbolSize: node.Name.length * 15,
                                itemStyle: {
                                    normal: {
                                        color: manBgColor,
                                        borderWidth: "2",
                                        borderColor: "#CA011D",
                                        label: {
                                            position: 'inside',
                                            textStyle: {
                                                color: targetTxtColor,
                                                fontFamily: "MicroSoft YaHei",
                                                fontSize: fontSize,
                                                fontStyle: "normal",
                                            }
                                        }
                                    },
                                    emphasis: {
                                        color: manBgColor,
                                        borderWidth: 3,
                                        borderColor: "#CA011D",
                                        label: {
                                            show: true,
                                            textStyle: {
                                                color: '#fff',
                                                fontFamily: "MicroSoft YaHei",
                                                fontSize: (fontSize + 1),
                                                fontStyle: "normal"
                                            },
                                        }
                                    }
                                },
                                actCtrl: node.actCtrl,
                                benifciary: node.benifciary,
                                indirectRatio: node.indirectRatio
                            });
                        } else {
                            // 其他企业
                            nodes.push({
                                category: [1, 2],
                                name: node.Name,
                                keyNo: node.KeyNo,
                                nodeType: node.nodeType,
                                level: node.Level,
                                fixX: true,
                                fixY: true,
                                label: node.nodeName,
                                symbol: 'rectangle',
                                symbolSize: [node.Name.length * 12, 20],
                                itemStyle: {
                                    normal: {
                                        borderRadius: '5%',
                                        color: corpBgColor,
                                        borderWidth: "2",
                                        borderColor: "#ddd",
                                        label: {
                                            position: 'inside',
                                            textStyle: {
                                                color: corpTxtColor,
                                                fontFamily: "MicroSoft YaHei",
                                                fontSize: fontSize,
                                                fontStyle: "normal",
                                            }
                                        }
                                    },
                                    emphasis: {
                                        borderRadius: '5%',
                                        color: corpBgColor,
                                        borderWidth: 3,
                                        borderColor: "#ddd",
                                        label: {
                                            show: true,
                                            textStyle: {
                                                color: corpTxtColor,
                                                fontFamily: "MicroSoft YaHei",
                                                fontSize: (fontSize + 1),
                                                fontStyle: "normal"
                                            },
                                        }
                                    }
                                },
                                actCtrl: node.actCtrl,
                                benifciary: node.benifciary,
                                indirectRatio: node.indirectRatio
                            });
                        }
                    });

                    startNode = CompanyChart.getNodeByKey(nodes, 'keyNo', CompanyChart.companyCode);

                    $.each(objs.Links, function(i, link) {
                        for (var j = 0; j < links.length; j++) {
                            if (links[j].source == link.Source && links[j].target == link.Target) {
                                links[j].name += "," + link.Relation;
                                links[j].itemStyle.normal.text = links[j].name;
                                return;
                            }
                        }

                        links.push({
                            source: link.Source,
                            target: link.Target,
                            name: link.Relation,
                            weight: 1,
                            itemStyle: {
                                normal: {
                                    lineWidth: 1,
                                    text: link.Relation,
                                    textColor: lineTxtShow ? lineTxtColorOne : lineTxtColorTwo,
                                    textFont: 'normal 12px 微软雅黑',
                                    textPosition: 'inside',
                                    color: lineTxtColorOne
                                }
                            }
                        });
                    });

                    $.each(nodes, function(idx, node) {
                        if (!nodeLinks[node.keyNo]) {
                            nodeLinks[node.keyNo] = [];
                        }

                        if (!nodeMaps[node.keyNo]) {
                            nodeMaps[node.keyNo] = node;
                        }

                        for (var i = 0; i < links.length; i++) {
                            var t = links[i];
                            if (nodeLinks[node.keyNo].indexOf(t) < 0) {
                                if (t.source == node.name || t.target == node.name) {
                                    nodeLinks[node.keyNo].push(t)
                                }
                            }
                        }
                    })

                    paths = calPath(nodes, links);

                    if (paths.length > 0) {
                        filterNodes();
                    } else {
                        $('#pathNodata').show();
                        $('#pathCount').hide();
                    }

                    setTimeout(function() {
                        calcPos();
                        unEvent();
                        drawPath(nodes, links);
                    }, 100)
                }

                function existNode(node, nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].name == node.name) {
                            return true;
                        }
                    }
                    return false;
                }

                function filterNodes() {
                    var newNodes = [];
                    $.each(nodes, function(i, node) {
                        var exist = false;
                        for (var i = 0; i < paths.length; i++) {
                            if (existNode(node, paths[i])) {
                                exist = true;
                            }
                        }
                        if (exist) {
                            newNodes.push(node);
                        }
                    });
                    nodes = newNodes;
                }

                //计算路径(前端计算)
                function calPath(nodes, links) {
                    var paths = [];
                    var counter = 0;
                    getNext(startNode, [startNode]);

                    function getNext(node, path) {
                        counter++;
                        if (counter > 20000) return;
                        for (var i = 0; i < links.length; i++) {
                            if (links[i].source == node.name || links[i].target == node.name) {
                                var nextNodeName;
                                if (links[i].source == node.name) {
                                    nextNodeName = links[i].target;
                                } else {
                                    nextNodeName = links[i].source;
                                }
                                var nextNode = CompanyChart.getNodeByKey(nodes, 'name', nextNodeName);

                                if (nextNode && !existNode(nextNode, path) && (node.level <= nextNode.level)) {
                                    var cPath = path.concat();
                                    cPath.push(nextNode);
                                    if (mapData.endNodes.indexOf(nextNode.keyNo) > -1) {
                                        paths.push(cPath);
                                    } else {
                                        getNext(nextNode, cPath);
                                    }
                                }

                            }
                        }
                    }
                    paths = paths.sort(function(a, b) {
                        return a.length - b.length;
                    });
                    return paths;
                }

                //计算节点坐标位置
                function calcPos() {
                    var levels = {};
                    var len = 0;
                    var keys = null;
                    var maxWidth = 0;
                    $.each(nodes, function(index, node) {
                        if (!levels[node.level]) {
                            levels[node.level] = [];
                        }
                        levels[node.level].push(node);
                    });
                    keys = Object.keys(levels);
                    len = keys.length;

                    for (var key in levels) {
                        var t = levels[key].length;
                        maxWidth = maxWidth > t ? maxWidth : t;
                    }

                    for (var k in keys) {
                        var level = keys[k];
                        var sameLevelNodes = levels[level];
                        if (sameLevelNodes) {
                            var area = {
                                width: myChart.getZrender().getWidth(),
                                height: myChart.getZrender().getHeight()
                            };
                            if (area.height < 80 * len) {
                                area.height = 85 * len;
                            }
                            if (area.width < 200 * maxWidth) {
                                area.width = 220 * maxWidth;
                            }

                            var yySpan = area.height / len;
                            $.each(sameLevelNodes, function(i, node) {
                                node.initial = [];
                                if (k == '0') {
                                    node.initial[1] = area.height - 30;
                                    node.initial[0] = (area.width) / 2;
                                } else {
                                    node.initial[1] = area.height - 30 - (yySpan) * level;
                                    var xxSpan = (area.width) / sameLevelNodes.length;
                                    var xxSpanMargin = xxSpan / 2;
                                    node.initial[0] = i * xxSpan + xxSpanMargin;

                                    // if (mapData.endNodes.indexOf(node.keyNo) > -1) {
                                    //     node.initial[1] = area.height - 30 - (yySpan) * (len - 1);
                                    // }
                                }

                            });
                        }
                    }
                }

                function unEvent() {
                    var ecConfig = require('echarts/config');
                    myChart.un(ecConfig.EVENT.RESTORE);
                    myChart.un(ecConfig.EVENT.CLICK);
                    myChart.un(ecConfig.EVENT.LEGEND_SELECTED);
                }

                function drawPath(nodes, links) {
                    myChart.clear();
                    var ecConfig = require('echarts/config');
                    option = {
                        toolbox: {
                            show: true,
                            x: '-100', // 隐藏自带的toolbox 但是必须加toolbox 否则自带的功能无法使用
                            y: '0',
                            feature: {
                                selfButtons: { //自定义按钮, selfbuttons可以随便取名字
                                    show: false, //是否显示
                                    title: 'demo', //鼠标移动上去显示的文字                                    
                                    icon: null,
                                    option: {},
                                    onclick: function(param) {}
                                },
                                saveAsImage: {
                                    show: true,
                                },
                                restore: {
                                    show: true
                                }
                            }
                        },
                        series: [{
                            type: 'force',
                            name: "关联分析",
                            ribbonType: false,
                            linkSymbol: 'arrow',
                            linkSymbolSize: [10, 10],
                            useWorker: false,
                            // gravity: 1.1,
                            // scaling: 1.1,
                            gravity: 1,
                            scaling: 0.9,
                            // roam: false,
                            // roam: true,
                            roam: 'move',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    },
                                    nodeStyle: {
                                        brushType: 'both',
                                        borderColor: '#dfdfdf',
                                        borderWidth: 0
                                    },
                                    linkStyle: {
                                        color: lineTxtColorOne
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                            // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    nodeStyle: {
                                        brushType: 'both',
                                        borderColor: '#dfdfdf',
                                        borderWidth: 4
                                    },
                                    linkStyle: {

                                    }
                                }
                            },
                            nodes: nodes,
                            links: links
                        }]
                    };

                    vOption = option;
                    myChart.setOption(option);
                    initZrender(myChart);
                    // Common.animatieChart(myChart, 150);

                    myChart.on(ecConfig.EVENT.RESTORE, function(param) {
                        myChart.clear();
                        CompanyChart.loadQYSYR();
                    });
                    // 点击事件 (不好用)
                    myChart.on(ecConfig.EVENT.CLICK, function(param) {
                        var offset = $('#screenArea').offset();
                        var navWidth = $('.chart-nav').width() ? $('.chart-nav').width() + 20 : offset.left;
                        var offsetTwo = { top: offset.top, left: offset.left + navWidth };
                        if (param.data && param.data.keyNo) {
                            // TODO 过滤无效node
                            if (param.data.keyNo.indexOf('$') == 0) {
                                return;
                            }
                            if (param.data.benifciary) {
                                if (param.data.nodeType === 'company') {
                                    Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '企业信息|' + CompanyChart.companyCode + '|' + CompanyChart.companyName, type: 'company_beneficiary', name: param.data.name, offset: offsetTwo })
                                } else if (param.data.nodeType === 'person') {
                                    Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '人物信息|' + CompanyChart.companyCode + '|' + CompanyChart.companyName, type: 'person_beneficiary', name: param.data.name, offset: offsetTwo })
                                }
                            } else if (param.data.nodeType === 'company') {
                                Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '企业信息', type: 'company', name: param.data.name, offset: offsetTwo })
                            } else if (param.data.nodeType === 'person') {
                                Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '人物信息', type: 'person', name: param.data.name, offset: offsetTwo })
                            }
                        }
                    });
                }

                var initZrender = function(myChart) {
                    var Text = require('zrender/shape/Text');
                    var ImageShape = require('zrender/shape/Image');
                    var Rectangle = require('zrender/shape/Rectangle');
                    var shapeList = myChart.getZrender().storage.getShapeList();
                    for (var i = 0; i < shapeList.length; i++) {
                        if (shapeList[i].ndelete) {
                            myChart.getZrender().delShape(shapeList[i].id);
                        }
                        if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.actCtrl && shapeList[i]._echartsData._data.benifciary) {
                            shapeList[i].draggable = false;
                        } else if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.benifciary) {
                            shapeList[i].draggable = false;
                        }
                    }
                    for (var i = 0; i < shapeList.length; i++) {
                        if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.actCtrl && shapeList[i]._echartsData._data.benifciary) {
                            var shape = new ImageShape({
                                style: {
                                    image: '../resource/images/Company/tupu_kzrsbg.png',
                                    x: shapeList[i].position[0] - 61,
                                    y: shapeList[i].position[1] - shapeList[i].style.height / 2 - 75,
                                    width: 160,
                                    height: 80,
                                },
                                highlightStyle: {
                                    lineWidth: 0,
                                    strokeColor: '#fff',
                                }
                            });
                            var shapeText = new Text({
                                style: {
                                    x: shapeList[i].position[0] + 20,
                                    y: shapeList[i].position[1] - shapeList[i].style.height / 2 - 40,
                                    textFont: 'normal 14px 微软雅黑',
                                    text: '实际控制人\n' + '最终受益人\n' + '最终受益股份' + shapeList[i]._echartsData._data.indirectRatio,
                                    textAlign: 'center',
                                    color: '#fff',
                                    lineWidth: 0,
                                    fontWeight: 'bold',
                                    lineHeight: '48px',
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
                        } else if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.benifciary) {
                            var exHeight = 45;
                            var txtHeight = 20;
                            if (shapeList[i]._echartsData._data.nodeType == 'person') {
                                exHeight = 25;
                                txtHeight = 0;
                            }
                            var shape = new ImageShape({
                                style: {
                                    image: '../resource/images/Company/tupu_syrbg.png',
                                    x: shapeList[i].position[0] - 70,
                                    y: shapeList[i].position[1] - shapeList[i].style.height - exHeight,
                                    width: 160,
                                    height: 64,
                                },
                                highlightStyle: {
                                    lineWidth: 0,
                                    strokeColor: 'rgba(255,255,255,0)',
                                }
                            });
                            var shapeText = new Text({
                                style: {
                                    x: shapeList[i].position[0] + 10,
                                    y: shapeList[i].position[1] - shapeList[i].style.height - txtHeight,
                                    textFont: 'normal 14px 微软雅黑',
                                    text: '最终受益人\n' + '最终受益股份' + shapeList[i]._echartsData._data.indirectRatio,
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
                };
            }
        },
        // 融资历程
        loadRZLC: function() {
            Common.burypcfunctioncode('922602100365');
            $('#load_data').show();
            var parameter = { "companycode": CompanyChart.companyCode, "companyid": CompanyChart.companyId, "pevcGroup": "1", showId: true };

            $('#rContent').find('#toolNav').remove();
            $('#rContent').append('<div id="toolNav"></div>')
            $('#rContent').find('#toolNav').append('<style>.mao-screen-area{margin-left:10px;}</style>');

            myWfcAjax("getfinancingevent", parameter, function(data) {
                var data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data && data.Data.length > 0) {
                    var returnData = changeFinanceList(data.Data); //转换融资数据
                    var changeData = returnData.changeData;
                    var yearArr = returnData.yearArr;
                    $('#load_data').hide();
                    $('#no_data').hide();
                    $("#companyChart").addClass('chart-overflow-y');
                    var htmlArr = [];
                    htmlArr.push('<div class="main"><div class="history">');
                    for (var item = 0; item < yearArr.length; item++) {
                        if (item == 0) {
                            htmlArr.push('<div class="history-date"><ul><h2 class="bounceInDown first"><a href="#nogo">' + yearArr[item] + '</a></h2>');
                        } else {
                            htmlArr.push('<div class="history-date"><ul><h2 class="date02 bounceInDown"><a href="#nogo">' + yearArr[item] + '</a></h2>');
                        }
                        var len = changeData[yearArr[item]] ? changeData[yearArr[item]].length : 0;
                        for (var i = 0; i < len; i++) {
                            var dateArr = changeData[yearArr[item]][i][0].date.split("-");
                            var dateYear = dateArr[0];
                            var dateMoth = dateArr[1] + "." + dateArr[2];
                            htmlArr.push('<li><h3>' + dateMoth + '<br/><span class="dateYear-style">' + dateYear + '</span></h3><dl>');
                            for (var j = 0; j < changeData[yearArr[item]][i].length; j++) {
                                htmlArr.push('<dt>');
                                var list_item = "";
                                var enent = changeData[yearArr[item]][i][j];
                                var eventKey = enent.eventType;
                                switch (eventKey) {
                                    case 'stock':
                                        list_item = '<h4>' + intl('138791' /* 发行股票 */ , '发行股票') + '</h4>' + '<span class="each-list-item">' + intl('13695' /* 首发数量 */ , '首发数量') + ' : ' + Common.formatCont(enent.member2) + '</span><span class="each-list-item">' + intl('13674' /* 首发价格 */ , '首发价格') + ' : ' + Common.formatCont(enent.member1) + '</span><span class="each-list-item">' + intl('32992' /* 股票简称 */ , '股票简称') + ' : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + intl('6440' /* 股票代码 */ , '股票代码') + ' : ' + Common.formatCont(enent.member4) + '</span><span class="each-list-item">' + intl('138825' /* 上市板块 */ , '上市板块') + ' : ' + Common.formatCont(enent.member5) + '</span>';
                                        break;
                                    case 'bond':
                                        list_item = '<h4>' + intl('138664' /* 发行债券 */ , '发行债券') + '</h4>' + '<span class="each-list-item">' + intl('138630' /* 实际发行数量 */ , '实际发行数量') + ' : ' + Common.formatCont(enent.member2) + intl('19493' /* 亿元 */ , '亿元') + '</span><span class="each-list-item">' + intl('138833' /* 起息日 */ , '起息日') + ' : ' + Common.formatTime(String(enent.date)) + '</span><span class="each-list-item">' + intl('138934' /* 到期日 */ , '到期日') + ' : ' + Common.formatTime(String(enent.member1)) + '</span><span class="each-list-item">' + intl('138892' /* 债券简称 */ , '债券简称') + ' : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + intl('30686' /* 债券代码 */ , '债券代码') + ' : ' + Common.formatCont(enent.member4) + '</span><span class="each-list-item">' + intl('30690' /* 票面利率 */ , '票面利率') + ' : ' + Common.formatCont(enent.member5) + '</span>';
                                        break;
                                    case 'pevc':
                                        var tmpStr = '';
                                        var tmpArr = enent.member5.split('|');
                                        if (tmpArr.length) {
                                            tmpArr.forEach(function(t) {
                                                if (t.split('_')[0] !== 'N/A') {
                                                    tmpStr = tmpStr ? (tmpStr + ',' + '<span class="underline wi-secondary-color wi-link-color" data-code="' + t.split('_')[1] + '">' + t.split('_')[0] + '</span>') : '<span class="underline wi-secondary-color wi-link-color" data-code="' + t.split('_')[1] + '">' + t.split('_')[0] + '</span>';
                                                } else {
                                                    tmpStr = tmpStr ? (tmpStr + ',' + 'N/A') : 'N/A';
                                                }
                                            })
                                        }
                                        // var pevcStr = '<span class="each-list-item-pevc">' + Common.formatCont(enent.member5.replace(/\|/g, '，')) + '</span>';
                                        // list_item = '<h4>PE&VC</h4>' + '<span class="each-list-item">' + '融资金额 : ' + Common.formatCont(enent.member1) + '万' + (enent.member2 ? enent.member2 : '人民币元') + '</span><span class="each-list-item">' + '融资轮次 : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + '投资机构 : ' + pevcStr + '</span>';
                                        list_item = '<h4>PE&VC</h4>' + '<span class="each-list-item">' + intl('34279' /* 融资金额 */ , '融资金额') + ' : ' + Common.formatCont(enent.member1) + '万' + (enent.member2 ? enent.member2 : '人民币元') + '</span><span class="each-list-item">' + intl('138859' /* 融资轮次 */ , '融资轮次') + ' : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + intl('138727' /* 投资机构 */ , '投资机构') + ' : ' + tmpStr + '</span>';
                                        break;
                                    case 'merge':
                                        list_item = '<h4>' + intl('108785' /* 并购 */ , '并购') + '</h4>' + '<span class="each-list-item">' + intl('138565' /* 参与方类型 */ , '参与方类型') + ' : ' + Common.formatCont(enent.member1) + '</span><span class="each-list-item">' + intl('40645' /* 并购方式 */ , '并购方式') + ' : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + intl('138801' /* 交易价值 */ , '交易价值') + ' ： ' + Common.formatCont(enent.member2) + '万' + (enent.member4 ? enent.member4 : '人民币元') + '</span>';
                                        break;
                                    case 'guarantee':
                                        list_item = '<h4>' + intl('27494' /* 担保 */ , '担保') + '</h4>' + '<span class="each-list-item">' + intl('204488' /* 担保金额 */ , '担保金额') + ' : ' + Common.formatCont(enent.member1) + '万' + (enent.member2 ? enent.member2 : '人民币元') + '</span><span class="each-list-item">' + intl('4597' /* 担保期限 */ , '担保期限') + ' : ' + Common.formatCont(enent.member3) + '年</span><span class="each-list-item">' + intl('4605' /* 担保终止日期 */ , '担保终止日期') + Common.formatTime(String(enent.member4)) + '</span>';
                                        break;
                                    case 'grants':
                                        list_item = '<h4>' + intl('138315' /* 政府补贴 */ , '政府补贴') + '</h4>' + '<span class="each-list-item">' + intl('34886' /* 项目名称 */ , '项目名称') + ' : ' + Common.formatCont(enent.member2) + '</span><span class="each-list-item">' + intl('138614' /* 本期发生额(元) */ , '本期发生额(元)') + ' : ' + Common.formatMoney(enent.member1, [4, '元']) + '</span>';
                                        break;
                                    case 'impawn':
                                        list_item = '<h4>' + intl('138281' /* 股权出质 */ , '股权出质') + '</h4>' + '<span class="each-list-item">' + intl('138447' /* 出质人 */ , '出质人') + ' : ' + Common.formatCont(enent.member2) + '</span><span class="each-list-item">' + intl('143251' /* 出质股权数额（万股） */ , '出质股权数额（万股）') + ' : ' + Common.formatCont(enent.member1) + '</span>';
                                        break;
                                    case 'abs':
                                        list_item = '<h4>' + intl('138122' /* ABS信息 */ , 'ABS信息') + '</h4>' + '<span class="each-list-item">' + intl('34886' /* 项目名称 */ , '项目名称') + ' : ' + Common.formatCont(enent.member1) + '</span><span class="each-list-item">' + intl('138796' /* 发行总额(万元) */ , '发行总额(万元)') + ' : ' + Common.formatMoney(enent.member2, [4, '万元']) + '</span><span class="each-list-item">' + intl('138655' /* 发行公告日 */ , '发行公告日') + ' : ' + Common.formatCont(enent.date) + '</span><span class="each-list-item">' + intl('138701' /* 法定到期日 */ , '法定到期日') + ' : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + intl('138621' /* 基础资产总类 */ , '基础资产总类') + ' : ' + Common.formatCont(enent.member4) + '</span>';
                                        break;
                                    case 'quit':
                                        list_item = '<h4>' + intl('138436' /* PEVC退出信息 */ , 'PEVC退出信息') + '</h4>' + '<span class="each-list-item">' + intl('138606' /* 退出机构 */ , '退出机构') + ' : ' + Common.formatCont(enent.member1) + '</span><span class="each-list-item">' + intl('138819' /* 退出方式 */ , '退出方式') + ' : ' + Common.formatCont(enent.member2) + '</span><span class="each-list-item">' + intl('138607' /* 总投资金额（万元） */ , '总投资金额（万元）') + ' : ' + Common.formatCont(enent.member3) + '</span><span class="each-list-item">' + intl('138608' /* 账面退出金额（万元） */ , '账面退出金额（万元）') + ' : ' + Common.formatCont(enent.member4) + '</span><span class="each-list-item">' + intl('138609' /* 回报倍数 */ , '回报倍数') + ' : ' + Common.formatCont(enent.member5) + '</span><span class="each-list-item">' + intl('138821' /* 退出时间 */ , '退出时间') + ' : ' + Common.formatCont(enent.date) + '</span>';
                                        break;
                                }
                                htmlArr.push(list_item)
                                htmlArr.push('</dt>')
                            }
                            htmlArr.push('</dl></li>')
                        }
                        htmlArr.push('</ul></div>');
                    }
                    htmlArr.push('</div></div>');
                    $('#companyChart').empty().html(htmlArr.join(""));
                    systole();

                    function systole() {
                        if (!$(".history").length) {
                            return;
                        }
                        var $warpEle = $(".history-date"),
                            $targetA = $warpEle.find("h2 a,ul li dl dt a"),
                            parentH,
                            eleTop = [];
                        parentH = $warpEle.parent().height() + 100;
                        $warpEle.parent().css({
                            "height": 59
                        });
                        setTimeout(function() {
                            $warpEle.find("ul").children(":not(.first)").each(function(idx) {
                                eleTop.push($(this).position().top);
                                $(this).css({
                                    "margin-top": -eleTop[idx]
                                }).children().hide();
                            }).animate({
                                "margin-top": 0
                            }, 1600).children().fadeIn();
                            $warpEle.parent().animate({
                                "height": parentH
                            }, 2600);

                            $warpEle.find("ul").children(":not(.first)").addClass("bounceInDown").css({
                                "-webkit-animation-duration": "2s",
                                "-webkit-animation-delay": "0",
                                "-webkit-animation-timing-function": "ease",
                                "-webkit-animation-fill-mode": "both"
                            }).end().children("h2").css({
                                "position": "relative"
                            });
                        }, 600);
                        // $(document).on("click", ".history-date h2 a", function() {
                        //     console.log(2);
                        //     $(this).parent().css({
                        //         "position": "relative"
                        //     });
                        //     $(this).parent().siblings().slideToggle();
                        //     $warpEle.parent().removeAttr("style");
                        //     return false;
                        // })
                        $(document).off('click', ".history-date h2 a").on("click", ".history-date h2 a", function() {
                            $(this).parent().css({
                                "position": "relative"
                            });
                            $(this).parent().siblings().slideToggle();
                            $(".history-date").parent().removeAttr("style");
                            return false;
                        })
                    }
                } else {
                    CompanyChart.chartNoData(intl('138399' /* 暂无融资历程数据 */ , '暂无融资历程数据'));
                }
            }, function(data) {
                CompanyChart.chartNoData(intl('138399' /* 暂无融资历程数据 */ , '暂无融资历程数据'));
            });
            var changeFinanceList = function(arr) {
                var newObj = {};
                var yearArr = [];
                var arr = arr.reverse();
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].date) {
                        var year = arr[i].date.substring(0, 4);
                        if (!newObj[year]) {
                            newObj[year] = [];
                            newObj[year].push(arr[i]);
                            yearArr.push(year)
                        } else {
                            newObj[year].push(arr[i]);
                        }
                    }
                }
                var changeData = {}; //最后要返回的数据
                for (item in newObj) {
                    changeData[item] = [];
                    var lastDate = '';
                    var lastItem = '',
                        processDate = [],
                        res = [];
                    for (var i = 0; i < newObj[item].length; i++) {
                        if (lastDate != newObj[item][i].date) {
                            if (lastItem && lastItem.length > 0) {
                                res.push(lastItem);
                            }
                            lastItem = [newObj[item][i]];
                            lastDate = newObj[item][i].date;
                        } else {
                            lastItem.push(newObj[item][i]);
                        }
                    };
                    res.push(lastItem);
                    changeData[item] = res;
                }
                var returnObj = { "yearArr": yearArr, "changeData": changeData }
                return returnObj;
            };
        },
        loadRZTP: function() {
            //融资图谱
            Common.burypcfunctioncode('922602100365');
            //$('#load_data').show();
            var CompanyId = CompanyChart.companyCode;
            $('#rContent').find('#toolNav').remove();
            $('#rContent').append('<div id="toolNav"></div>')
            $('#rContent').find('#toolNav').append('<style>.mao-screen-area{margin-left:10px;}</style>');
            var hrefStr = "http://windcloudnote/wind.ent.risk/index.html#/financeMap?from=GEL&CompanyId=" + CompanyId;
            $("#companyChart").css("background", "#fff").empty().html('<iframe scrolling="no" src="' + hrefStr + '" frameborder="0" class="companyChartFrame"></iframe>')
            $("#companyChart").find("iframe")[0].onload = function() {
                $("#load_data").hide();
            };
        },
        // 组织结构
        loadZZJG: function() {
            //组织结构
            $('#load_data').show();
            var rootData = null;
            var parameter = { "companycode": CompanyChart.companyCode, "yearCount": 3 };
            myWfcAjax("getstructure", parameter, function(data) {
                var data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data && data.Data.length > 0) {
                    var len = data.Data.length;
                    var res = data.Data;
                    var reset = resetOrganizationData(res); //重新整理数据。
                    $('#load_data').hide();
                    $('#no_data').hide();
                    rootData = CompanyChart.rootData = reset.Result.Node;
                    CompanyChart.traverseTreeId(CompanyChart.rootData);
                    if (len >= 220) {
                        CompanyChart.changeChild(CompanyChart.rootData.children, 'children', '_children');
                    }
                    CompanyChart.draw(CompanyChart.rootData);
                    CompanyChart.d3CommonEvents();
                } else {
                    CompanyChart.chartNoData('暂无组织结构数据');
                }
            }, function(data) {
                CompanyChart.chartNoData('暂无组织结构数据');
            });

            function resetOrganizationData(data) {
                //重置组织结构数据
                var resetData = { "Result": {} };
                var suporNode = { "Node": {} };
                suporNode.Node.name = CompanyChart.companyName;
                suporNode.Node.Category = 1;
                suporNode.Node.children = [];
                var resObj = {};
                for (var i = 0; i < data.length; i++) {
                    var category = data[i].category;
                    if (resObj[category]) {
                        resObj[category].push(data[i].department);
                    } else {
                        resObj[category] = [];
                        resObj[category].push(data[i].department);
                    }
                }
                for (i in resObj) {
                    var tmpItem = {};
                    tmpItem.Category = 2;
                    tmpItem.name = i;
                    tmpItem.children = [];
                    if (resObj[i]) {
                        for (var j = 0; j < resObj[i].length; j++) {
                            var tmpNode = {};
                            tmpNode.Category = 3;
                            tmpNode.name = resObj[i][j]
                            tmpItem.children.push(tmpNode)
                        }
                    }
                    suporNode.Node.children.push(tmpItem);
                }
                resetData.Result = suporNode;
                return resetData;
            }
        },
        /**
         * echart2保存图片
         */
        saveEchart2Img: function(name) {
            // 移除已有jietu遮罩
            if ($('[data-id="jietuMask"]')) {
                $('[data-id="jietuMask"]').remove();
            }

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

            var shapeList = CompanyChart.echartInstance.getZrender().storage.getShapeList();
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
                moveRight = -(maxX + minX - CompanyChart.echartInstance.getZrender().getWidth() + 146) / 2;

            }
            if ((maxY - minY + 300) > 900) {
                height = maxY - minY + 300;
            }

            moveDown = -(maxY + minY - CompanyChart.echartInstance.getZrender().getHeight()) / 2 - 85;

            var layer = CompanyChart.echartInstance.getZrender().painter._layers[1];
            var bS = layer.scale.concat();
            var bP = layer.position.concat();

            layer.scale = [1, 1, 0, 0];
            layer.position = [0, 0];

            $('#companyChart').width(width);
            $('#companyChart').height(height);

            CompanyChart.echartInstance.resize();

            CompanyChart.echartInstance.getZrender().painter.refresh();

            Common.initZrender(CompanyChart.echartInstance, 'parentStockShare');

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
            // CompanyChart.echartInstance.getZrender().addShape(shape1);


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
            //         CompanyChart.echartInstance.getZrender().addShape(shapeSy);
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
            // CompanyChart.echartInstance.getZrender().addShape(shape3);

            setTimeout(function() {
                var canvas = $('#companyChart canvas')[0];
                var imgdata = canvas.toDataURL();
                Common.saveCanvasImg('#companyChart canvas', name, 1, imgdata);
                $('#companyChart').width('100%');
                CompanyChart.echartInstance.resize();
                layer.scale = bS;
                layer.position = bP;
                CompanyChart.echartInstance.getZrender().render();
                Common.initZrender(CompanyChart.echartInstance, 'parentStockShare');
                $(jietuMask).css('display', 'none');
            }, 300);
        },
        /**
         * 重新注入新版本的d3库
         */
        invokeD3: function(t, name) {
            try {
                if (d3 && d3.version) {
                    var v = d3.version.split('.')[0] - 0;
                    if (v !== t) {
                        d3 = null;
                        $('body'.remove($('[data-script="d3"]')));
                        var jsStr = '<script data-script="d3" src="../resource/js/' + name + '"></script>';
                        $('body').append(jsStr);
                    }
                }
            } catch (e) {
                var jsStr = '<script data-script="d3" src="../resource/js/' + name + '"></script>';
                $('body').append(jsStr);
            }
        },
        /**
         * 查找node
         * 
         * @param {any} nodes 
         * @param {any} key 
         * @param {any} val 
         * @returns 
         */
        getNodeByKey: function(nodes, key, val) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i][key] == val) {
                    return nodes[i];
                }
            }
        },
        /**
         * 数据处理：根据nodeId获取node 索引
         */
        getNodesIndex: function(nodeId, nodes) {
            var index = 0;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (nodeId == node.windId) {
                    index = i;
                    break;
                }
            }
            return index;
        },
        getD3Position: function(graph) {
            var _maxChildrenLength = 0;

            function filterLinks1(graph) {
                // 筛选用于布局的links
                var layoutLinks = [];
                for (var i = 0; i < graph.links.length; i++) {
                    var link = graph.links[i];
                    var sourceLevel = link.sourceNode.layout.level;
                    var targetLevel = link.targetNode.layout.level;
                    var sourceNode = link.sourceNode;
                    var targetNode = link.targetNode;
                    if ((sourceLevel == 1 && targetLevel == 2) || (sourceLevel == 2 && targetLevel == 1)) {
                        layoutLinks.push(link);
                    }
                    if ((sourceLevel == 2 && targetLevel == 3) || (sourceLevel == 3 && targetLevel == 2)) {

                        layoutLinks.push(link);
                    }
                }

                layoutLinks.forEach(function(link, i) {
                    if (link.targetNode.layout.level == 3) {
                        layoutLinks.forEach(function(alink, j) {
                            if (alink.linkId != link.linkId &&
                                (alink.targetNode.nodeId == link.targetNode.nodeId || alink.sourceNode.nodeId == link.targetNode.nodeId)) {
                                layoutLinks.splice(j, 1);
                            }
                        })
                    }
                    if (link.sourceNode.layout.level == 3) {
                        layoutLinks.forEach(function(alink, j) {
                            if (alink.linkId != link.linkId &&
                                (alink.targetNode.nodeId == link.sourceNode.nodeId || alink.sourceNode.nodeId == link.sourceNode.nodeId)) {
                                layoutLinks.splice(j, 1);
                            }
                        })
                    }
                })

                return layoutLinks;
            }

            function filterLinks2(graph) {
                // 筛选用于布局的links
                var layoutLinks = [];
                for (var i = 0; i < graph.links.length; i++) {
                    var link = graph.links[i];
                    var sourceLevel = link.sourceNode.layout.level;
                    var targetLevel = link.targetNode.layout.level;
                    var sourceNode = link.sourceNode;
                    var targetNode = link.targetNode;


                    if ((sourceLevel == 1 && targetLevel == 2) || (sourceLevel == 2 && targetLevel == 1)) {
                        layoutLinks.push(link);
                    }
                    if ((sourceLevel == 2 && targetLevel == 3) || (sourceLevel == 3 && targetLevel == 2)) {
                        layoutLinks.push(link);
                    }

                }

                return layoutLinks;
            }

            function initD3Data(graph) {
                function getIndex(val, arr) {
                    var index = 0;
                    for (var i = 0; i < arr.length; i++) {
                        var obj = arr[i];
                        if (val == obj.windId) {
                            index = i;
                            break;
                        }
                    }
                    return index;
                }

                /*封装符合d3的数据*/
                for (var i = 0; i < graph.nodes.length; i++) {
                    var node = graph.nodes[i];
                    node.id = node.windId;
                }

                for (var i = 0; i < graph.links.length; i++) {
                    var link = graph.links[i];
                    link.source = getIndex(link.sourceNode.windId, graph.nodes);
                    link.target = getIndex(link.targetNode.windId, graph.nodes);
                    link.index = i;
                }

                graph.layoutLinks = filterLinks1(graph);

                // 围绕节点最大数值
                CompanyChart.setSingleLinkNodes(graph.layoutLinks);
                graph.nodes.forEach(function(node, i) {
                    if (node.layout.singleLinkChildren.length && _maxChildrenLength < node.layout.singleLinkChildren.length) {
                        _maxChildrenLength = node.layout.singleLinkChildren.length
                    }
                })
            }

            initD3Data(graph);

            var width = 100;
            var height = 100;

            var strength = -600,
                distanceMax = 330,
                theta = 0,
                distance = 130,
                colideRadius = 35,
                distanceMin = 400;
            // 根据节点数量调节
            if (graph.nodes.length < 50) {
                strength = -800;
                distanceMax = 400;
                distance = 300;
                colideRadius = 60;

            } else if (graph.nodes.length > 50 && graph.nodes.length < 100) {
                strength = -800;
                distanceMax = 350;
                distance = 130;
                colideRadius = 35;
                strength = -1000;
                distanceMax = 500;
                distance = 180;
                colideRadius = 40;
            } else if (graph.nodes.length > 100 && graph.nodes.length < 150) {
                strength = -900;
                distanceMax = 450;
            } else if (graph.nodes.length > 150 && graph.nodes.length < 200) {
                strength = -1000;
                distanceMax = 500;
            } else if (graph.nodes.length > 200) {
                strength = -1600;
                distanceMax = 500;
                theta = 0.6, distance = 100, colideRadius = 35;
            }
            // 根据围绕数量调节
            if (_maxChildrenLength > 50 && _maxChildrenLength < 100) {
                strength = -2000;
                distanceMax = 500;
            } else if (_maxChildrenLength > 1000 && _maxChildrenLength < 2000) {
                strength = -4000;
                distanceMax = 1500;
            }

            d3.forceSimulation(graph.nodes)
                .force('charge', d3.forceManyBody().strength(strength).distanceMax(distanceMax).theta(theta))
                .force('link', d3.forceLink(graph.layoutLinks).distance(distance))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collide', d3.forceCollide()
                    .radius(function() { return colideRadius; })
                )
        },
        // 数据处理：设置唯一子节点
        setSingleLinkNodes: function(links) {
            function isSingleLink(nodeId, links) {
                var hasLinks = 0;
                var isSingle = true;
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                    if (link.targetNode.windId == nodeId || link.sourceNode.windId == nodeId) {
                        hasLinks++;
                    }
                    if (hasLinks > 1) {
                        isSingle = false;
                        break;
                    }
                }

                return isSingle;
            }
            links.forEach(function(link, i) {
                if (isSingleLink(link.sourceNode.windId, links)) {
                    link.targetNode.layout.singleLinkChildren.push(link.sourceNode);
                }
                if (isSingleLink(link.targetNode.windId, links)) {
                    link.sourceNode.layout.singleLinkChildren.push(link.targetNode);
                }
            });
        },
        changeRootData: function(list, rootCode, rootNode) {
            var graph = {}
            graph.nodes = [];
            graph.links = [];

            var nodes = list.nodes;
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var o = {};
                o.windId = node.windId;

                o.level = node.level;
                o.nodeName = node.nodeName;
                o.nodeType = node.nodeType;

                o.data = {};
                o.data.obj = node;

                o.layout = {}
                o.layout.level = null; // 1 当前查询节点
                o.layout.singleLinkChildren = []; // 只连接自己的node
                graph.nodes.push(o);

                // 设置_rootNode
                if (rootCode == o.windId) {
                    rootNode = o;
                }
            }

            //graph.links
            var relationships = list.routes;
            for (var k = 0; k < relationships.length; k++) {
                var relationship = relationships[k];
                var o = {}

                o.endId = relationship.endId;
                o.startId = relationship.startId;
                o.props = relationship.props;
                o.relType = relationship.relType;
                o._routeId = relationship._routeId;

                o.data = {};
                o.data.obj = relationship;

                o.sourceNode = CompanyChart.getNodeByKey(graph.nodes, 'windId', relationship.startId);
                o.targetNode = CompanyChart.getNodeByKey(graph.nodes, 'windId', relationship.endId);
                o.source = CompanyChart.getNodesIndex(relationship.startId, graph.nodes);
                o.target = CompanyChart.getNodesIndex(relationship.endId, graph.nodes);
                graph.links.push(o);
            }
            CompanyChart.setLevel(graph.nodes, graph.links, rootNode);
            return graph;
        },
        setLevel: function(svg_nodes, svg_links, rootNode) {
            function getNextNodes(nodeId, links, parentLevel) {
                var nextNodes = [];
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                    if (nodeId == link.sourceNode.windId && !link.targetNode.layout.level) {
                        link.targetNode.layout.level = parentLevel;
                        nextNodes.push(link.targetNode);
                    } else if (nodeId == link.targetNode.windId && !link.sourceNode.layout.level) {
                        link.sourceNode.layout.level = parentLevel;
                        nextNodes.push(link.sourceNode);
                    }
                }

                return nextNodes;
            }

            var level = 1;
            var nodes = [];
            nodes.push(rootNode);
            while (nodes.length) {
                var nextNodes = [];
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    node.layout.level = level;
                    nextNodes = nextNodes.concat(getNextNodes(node.windId, svg_links, level));
                }
                level++;
                nodes = nextNodes;
            }
        },
        /**
         * 过滤事件handler
         */
        filterEventHandler: function(e) {
            var parent = $(e.target).parent();
            if ($(parent).hasClass('chart-nav-zero')) {
                if ($(e.target).hasClass('wi-secondary-bg')) {
                    return;
                }
                // $(parent).find('button').removeClass('wi-secondary-bg');
                // $(e.target).addClass('wi-secondary-bg');
                var idx = $(e.target).attr('data-lev') - 0;
                $("#companyChart").empty(); // 节点清空
                $('#no_data').hide(); // 暂无数据
                $('#load_data').show(); // 加载中
                $("#companyChart").attr('class', ''); // 样式清空     
                $('#rContent').removeClass('has-nav');
                $('#toolNav').remove();
                CompanyChart.loadYSGX(idx == 2 ? idx : null);
                return false;
            } else {
                // 全部
                if ($(e.target).attr('data-all') == '1') {
                    if ($(e.target).hasClass('wi-secondary-bg')) {
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
            }
            CompanyChart.filterAction();
        },
        /**
         * 过滤事件action
         */
        filterAction: function() {
            var levelBtns = $('.chart-nav-zero button');
            var stateBtns = $('.chart-nav-first button');
            var labelBtns = $('.chart-nav-second button');
            // var otherBtns = $('.chart-nav-three button');
            var filters = [];
            var levelFilter = false;
            var stateFilters = [];

            if ($(labelBtns[0]).hasClass('wi-secondary-bg')) {
                filters = [];
            } else {
                Array.prototype.forEach.call(labelBtns, function(e, idx) {
                    if (idx) {
                        if (!$(e).hasClass('wi-secondary-bg')) {
                            filters.push($(e).attr('data-key'));
                        }
                    }
                });
            }

            if ($(levelBtns[0]).hasClass('wi-secondary-bg')) {
                levelFilter = true;
            }

            if ($(stateBtns[0]).hasClass('wi-secondary-bg')) {
                stateFilters = [];
            } else {
                Array.prototype.forEach.call(stateBtns, function(e, idx) {
                    if (idx) {
                        if (!$(e).hasClass('wi-secondary-bg')) {
                            stateFilters.push($(e).attr("data-key"));
                        }
                    }
                });
            }

            try {
                CompanyChart.filterEdges(stateFilters, filters);
                CompanyChart.filterNodes(levelFilter);
            } catch (e) {
                console.log('过滤失败!');
            }
        },
        /**
         * edge属性过滤
         * 
         * @param {any} stateKey 状态过滤条件
         * @param {any} labelKey 线属性过滤条件
         */
        filterEdges: function(stateKey, labelKey) {
            statekey = stateKey || [];
            labelKey = labelKey || [];

            var edges = CompanyChart.cyInstance.collection("edge");
            var nodes = CompanyChart.cyInstance.collection("node");

            var allPathObj = CompanyChart.pathSet.allPathObj; // 所有path
            var allRouteObj = CompanyChart.dataSet.routeObj; // 所有route    
            var allStateObj = CompanyChart.dataSet.stateObj; // 所有state

            var todoLabelPathArr = [];
            var todoStatePathArr = [];

            var todoPathObj = {}; // 待过滤path obj
            var todoRouteObj = {}; // 待过滤route
            var displayRouteObj = {}; // 重新绘制route
            var displayPathObj = {}; // 重新绘制path

            labelKey.forEach(function(k) {
                todoLabelPathArr = todoLabelPathArr.concat(CompanyChart.pathSet.filterPathObj[k] || []);
            })

            stateKey.forEach(function(key) {
                var obj = allStateObj[key]
                for (var k in obj) {
                    todoStatePathArr = todoStatePathArr.concat(CompanyChart.pathSet.statePathObj[k] || [])
                }
            })

            todoStatePathArr.forEach(function(t) {
                var k = t._pathId;
                if (!todoPathObj[k]) {
                    todoPathObj[k] = t;
                }
            })

            todoLabelPathArr.forEach(function(o) {
                var k = o._pathId;
                var routes = o.routes;
                var len = routes.length;
                for (var i = 0; i < routes.length; i++) {
                    var route = routes[i];
                    var filter = route.filters;
                    var tag = false;
                    for (var key in filter) {
                        if (labelKey.indexOf(key) > -1) {
                            filter[key].show = false;
                        } else {
                            if (!filter[key].show) {
                                filter[key].show = true;
                            }
                            tag = true;
                        }
                    }
                    if (tag) {
                        len--;
                    }
                }
                if (len) {
                    if (!todoPathObj[k]) {
                        todoPathObj[k] = o
                    }
                }
            });

            // 找出待重绘path
            for (var k in allPathObj) {
                var o = allPathObj[k];
                if (!todoPathObj[k]) {
                    if (!displayPathObj[k]) {
                        displayPathObj[k] = o;
                        var t = o.routes;
                        t.forEach(function(item) {
                            if (!displayRouteObj[item._routeId]) {
                                for (var key in item.filters) {
                                    if (labelKey.indexOf(key) < 0) {
                                        item.filters[key].show = true;
                                    }
                                }
                                displayRouteObj[item._routeId] = item;
                            }
                        })
                    }
                }
            }

            // 找出待过滤route
            for (var k in allRouteObj) {
                if (!displayRouteObj[k]) {
                    if (!todoRouteObj[k]) {
                        todoRouteObj[k] = allRouteObj[k]
                    }
                }
            }

            // 在图形上过滤route及node
            for (var k in todoRouteObj) {
                edges.forEach(function(t) {
                    var item = t._private.data;
                    if (item._routeId === k) {
                        t.style({ 'display': 'none' })
                        t._private.source.style({ 'display': 'none' });
                        t._private.target.style({ 'display': 'none' });
                    }
                });
            }

            // 图形上根据要重绘的path重绘不需要过滤的path及经过的route、node            
            nodes.forEach(function(t) {
                var itemNode = t._private.data;
                var edges = t._private.edges;
                edges.forEach(function(t) {
                    var item = t._private.data;
                    if (displayRouteObj[item._routeId]) {
                        var txt = '';
                        var obj = displayRouteObj[item._routeId].filters;
                        for (var kt in obj) {
                            var tmp = obj[kt];
                            if (tmp.show) {
                                txt = txt ? (txt + ',' + tmp.txt) : tmp.txt;
                            }
                        }
                        t._private.data.label = txt;
                        t.style({ 'display': '' })
                        t._private.source.style({ 'display': '' });
                        t._private.target.style({ 'display': '' });
                        if (!t.hasClass('hidetext')) {
                            t.addClass("hidetext");
                            t.removeClass("hidetext");
                        }
                    }
                });

                // 根节点必须显示
                if (t._isRoot) {
                    t.style({ 'display': '' });
                }
            });

            return;
        },
        /**
         * 层级过滤
         * 
         * @param {any} flg 
         * @returns 
         */
        filterNodes: function(flg) {
            var edges = CompanyChart.cyInstance.collection("edge");
            var nodes = CompanyChart.cyInstance.collection("node");

            var allLevelObj = CompanyChart.dataSet.levelObj;
            var displayLevelObj = {};
            var todoLevelObj = {};

            if (!flg) {
                displayLevelObj = allLevelObj;
            } else {
                for (var k in allLevelObj) {
                    var item = allLevelObj[k];
                    // 目前只支持过滤2层
                    if (k < 2) {
                        for (var kk in item) {
                            displayLevelObj[kk] = item[kk];
                        }
                    } else {
                        for (var kk in item) {
                            todoLevelObj[kk] = item[kk];
                        }
                    }
                }
            }

            // 在图形上过滤route及node
            for (var k in todoLevelObj) {
                edges.forEach(function(t) {
                    var item = t._private.data;
                    var sourceId = item.source;
                    var endId = item.target;
                    if (todoLevelObj[sourceId] || todoLevelObj[endId]) {
                        t.style({ 'display': 'none' })
                        if (todoLevelObj[sourceId]) {
                            t._private.source.style({ 'display': 'none' });
                        }
                        if (todoLevelObj[endId]) {
                            t._private.target.style({ 'display': 'none' });
                        }
                    }
                });
            }

            // 根节点必须显示
            nodes.forEach(function(t) {
                if (t._isRoot) {
                    t.style({ 'display': '' });
                }
            });

            return;
        },
    };

    $('.input-toolbar-search').on('focus', function() {
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
                                highTitle = intl('138677' /* 企业名称 */ , '企业名称');
                                corp_name = data[i].highlight['corp_name'];
                                break;
                            case 'artificial_person':
                                highTitle = intl('138733' /* 法人 */ , '法人');
                                break;
                            case 'corp_members':
                                highTitle = intl('122202' /* 主要成员 */ , '主要成员');
                                break;
                            case 'stockholder_people':
                                highTitle = intl('32959' /* 股东 */ , '股东');
                                break;
                            case 'software_copyright':
                                highTitle = intl('138788' /* 软件著作权 */ , '软件著作权');
                                break;
                            case 'brand_name':
                                highTitle = intl('138798' /* 商标名称  */ , '商标名称');
                                break;
                            case 'tel':
                                highTitle = intl('4944' /* 电话 */ , '电话');
                                break;
                            case 'mail':
                                highTitle = intl('93833' /* 邮箱 */ , '邮箱');
                                break;
                            case 'patent':
                                highTitle = intl('138749' /* 专利 */ , '专利');
                                break;
                            case 'goods':
                                highTitle = intl('138669' /* 商品/服务项目 */ , '商品/服务项目');
                                break;
                            case 'former_name':
                                highTitle = intl('138570' /* 企业曾用名 */ , '企业曾用名');
                                break;
                            case 'corp_short_name':
                                highTitle = intl('138785' /* 公司简称 */ , '公司简称');
                                break;
                            case 'stockname':
                                highTitle = intl('32992' /* 股票简称 */ , '股票简称');
                                break;
                            case 'stockcode':
                                highTitle = intl('6440' /* 股票代码 */ , '股票代码');
                                break;
                            case 'main_business':
                                highTitle = intl('138753' /* 主营构成 */ , '主营构成')
                                break;
                            case 'brand_name2':
                                highTitle = intl('207813' /* 品牌 */ , '品牌');
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
                    return $.trim($('.input-toolbar-search').val());
                });
            }
        } else {
            if (!CompanyChart._historySearchList.length) {
                return;
            }

            var searchListParent = $('.input-toolbar-search-list');
            searchListParent.addClass('active');
            searchListParent.html('');
            searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');

            for (var i = 0; i < CompanyChart._historySearchList.length; i++) {
                if (i > 4) {
                    break;
                }
                var ele = document.createElement('div');
                $(ele).addClass('search-list-div')
                $(ele).text(CompanyChart._historySearchList[i].keyword);
                $(ele).attr('data-name', CompanyChart._historySearchList[i].keyword);
                $(ele).attr('data-match', CompanyChart._historySearchList[i].is_fullmatch == 1 ? 1 : 0);
                $(ele).attr('data-code', CompanyChart._historySearchList[i].companycode || '');
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
    $(".input-toolbar-search").on('focus', function(event) {
        $(".input-toolbar-search").on('input', function(event) {
            clearTimeout(CompanyChart.serachtimer);
            CompanyChart.serachtimer = setTimeout(function() {
                var target = event.target;
                var val = $.trim($(target).val());
                if (val) {
                    // 显示预搜索
                    $('.input-toolbar-search-list').removeClass('active');
                    val = val.trim();
                    var len = Common.getByteLen(val);
                    if (len >= 4) {
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
                                $(ele).addClass('before-search-div')

                                corName = corp_name = data[i].name;
                                if (data[i].highlight) {
                                    highLitKey = Object.keys(data[i].highlight)[0];
                                }
                                switch (highLitKey) {
                                    case 'corp_name':
                                        highTitle = intl('138677' /* 企业名称 */ , '企业名称');
                                        corp_name = data[i].highlight['corp_name'];
                                        break;
                                    case 'artificial_person':
                                        highTitle = intl('138733' /* 法人 */ , '法人');
                                        break;
                                    case 'corp_members':
                                        highTitle = intl('122202' /* 主要成员 */ , '主要成员');
                                        break;
                                    case 'stockholder_people':
                                        highTitle = intl('32959' /* 股东 */ , '股东');
                                        break;
                                    case 'software_copyright':
                                        highTitle = intl('138788' /* 软件著作权 */ , '软件著作权');
                                        break;
                                    case 'brand_name':
                                        highTitle = intl('138798' /* 商标名称  */ , '商标名称');
                                        break;
                                    case 'tel':
                                        highTitle = intl('4944' /* 电话 */ , '电话');
                                        break;
                                    case 'mail':
                                        highTitle = intl('93833' /* 邮箱 */ , '邮箱');
                                        break;
                                    case 'patent':
                                        highTitle = intl('138749' /* 专利 */ , '专利');
                                        break;
                                    case 'goods':
                                        highTitle = intl('138669' /* 商品/服务项目 */ , '商品/服务项目');
                                        break;
                                    case 'former_name':
                                        highTitle = intl('138570' /* 企业曾用名 */ , '企业曾用名');
                                        break;
                                    case 'corp_short_name':
                                        highTitle = intl('138785' /* 公司简称 */ , '公司简称');
                                        break;
                                    case 'stockname':
                                        highTitle = intl('32992' /* 股票简称 */ , '股票简称');
                                        break;
                                    case 'stockcode':
                                        highTitle = intl('6440' /* 股票代码 */ , '股票代码');
                                        break;
                                    case 'main_business':
                                        highTitle = intl('138753' /* 主营构成 */ , '主营构成')
                                        break;
                                    case 'brand_name2':
                                        highTitle = intl('207813' /* 品牌 */ , '品牌');
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
                            return $.trim($('.input-toolbar-search').val());
                        });
                    } else {
                        $('.input-toolbar-before-search').removeClass('active');
                    }
                } else {
                    $('.input-toolbar-before-search').removeClass('active');

                    if (!CompanyChart._historySearchList.length) {
                        return;
                    }

                    var searchListParent = $('.input-toolbar-search-list');
                    searchListParent.addClass('active');
                    searchListParent.html('');
                    searchListParent.html('<div>' + intl('138364' /* 历史搜索 */ ) + ' <span class="search-list-icon"><i></i>' + intl('138856' /* 清空 */ ) + '</span></div>');

                    for (var i = 0; i < CompanyChart._historySearchList.length; i++) {
                        if (i > 4) {
                            return;
                        }
                        var ele = document.createElement('div');
                        $(ele).addClass('search-list-div')
                        $(ele).text(CompanyChart._historySearchList[i].keyword);
                        $(ele).attr('data-name', CompanyChart._historySearchList[i].keyword);
                        $(ele).attr('data-match', CompanyChart._historySearchList[i].is_fullmatch == 1 ? 1 : 0);
                        $(ele).attr('data-code', CompanyChart._historySearchList[i].companycode || '');
                        searchListParent.append(ele);
                    }
                }
            }, 300)
        });
    })

    $('.input-toolbar-search-list').on("click", ".search-list-div", function(event) {
        var target = event.target;
        var companyname = $(target).text();
        var match = $(target).attr('data-match');
        var code = $(target).attr('data-code');
        if (match - 0 && code) {
            Common.linkCompany('Bu3', code);
            $('.input-toolbar-search-list').removeClass('active');
            return;
        }
        var url = "SearchHomeList.html?keyword=" + companyname;
        document.location.href = url;
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
                CompanyChart._historySearchList = [];
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

    $(document).on('click', '.underline.wi-secondary-color.wi-link-color', function(event) {
        var target = event.target;
        var id = $(target).attr('data-code');
        var name = $(target).text();
        try {
            if (id) {
                if (id.length > 16) {
                    // window.open('Person.html?id=' + id + '&name=' + name);
                } else {
                    Common.linkCompany("Bu3", '', id);
                }
            }
        } catch (e) {
            console.log('跳转失败！');
        }
        return false;
    });
    window._CompanyChart = window._CompanyChart || CompanyChart;
    if (window.wind && wind.langControl) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
            wind.langControl.lang = 'zh';
            wind.langControl.locale = 'zh';
            wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
                Common.international();
                CompanyChart.init();
            }, function() {
                console.log('error');
            });
        } else {
            wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
                Common.international();
                CompanyChart.init();
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
})(window, $)