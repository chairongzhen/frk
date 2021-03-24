/*
 * @Author: Cheng Bo 
 * @Date: 2018-11-23 13:16:40 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2020-03-10 17:03:15
 * @Desc: 
 */

var showAdvanceList = {
    lang: {
        "sProcessing": "加载中...",
        "sZeroRecords": "暂无数据",
        "paginate": {
            "next": "&gt;",
            "previous": "&lt;"
        }
    },
    cmd: '',
    companycode: '',
    init: function() {

        var parentParams = window.parent._CompanyChart._corpListParams;
        showAdvanceList.cmd = parentParams.cmd;
        showAdvanceList.companycode = parentParams.companycode;
        var name = window.parent._CompanyChart._corpListParams.companyname || '';

        setTimeout(function() {
            var str = name + intl('138164' /* 疑似关联企业 */ ) + '(' + '<span class="important-color wi-secondary-color" id="searchResultNum"></span>' + intl('138901' /* 家 */ ) + ')';
            $('.fl').append(str);

            var fields = ["NO.", "corp_name", "status_after", 'TODO']
            var alignArr = [0, 0, 0, 0]
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
                        //return Common.addCompanyLink(data, full)
                        //
                        var shortname = full.corp_short_name;
                        var id = full.corp_id;
                        var img = full.logo ? full.logo : "";

                        return (Common.showCompanyName(2, data, id, img, shortname));
                    }
                },
                // {
                //     "targets": 2,
                //     "data": 'register_capital',
                //     "render": function(data, type, full, meta) {
                //         return Common.formatMoney(data, [4, '&nbsp;'])
                //     }
                // },
                // {
                //     "targets": 3,
                //     "data": 'establish_date',
                //     "render": function(data, type, full, meta) {
                //         return Common.formatTime(data)
                //     }
                // },
                // {
                //     "targets": 4,
                //     "data": 'artificial_person',
                //     "render": function(data, type, full, meta) {
                //         var artificial_str = "";
                //         if (data && data.split('|').length > 1) {
                //             var artificialTemp = data.replace(/<em>|<\/em>/g, '');
                //             artificial_person = artificialTemp.split('|')[0];
                //             artificial_id = artificialTemp.split('|')[1];
                //             if (artificial_id.indexOf('XXXXXX') < 0) {
                //                 if (artificial_id.length < 16) {
                //                     artificial_str = '<a class="underline item-person wi-secondary-color wi-link-color" target="_blank" href="#" data-code="' + artificial_id + '">' + artificial_person + '</a>'
                //                 } else {
                //                     artificial_str = '<a class="item-person wi-secondary-color wi-link-color" target="_blank" href="Person.html?id=' + artificial_id + '&name=' + artificial_person + '">' + artificial_person + '</a>'
                //                 }
                //             } else {
                //                 artificial_id = '';
                //                 if (data.indexOf('<em') > -1 && data.indexOf('</em>') > -1) {
                //                     artificial_str = '<span class="item-person"><em class="wi-secondary-color">' + artificial_person + '</em></span>'
                //                 } else {
                //                     artificial_str = '<span class="item-person">' + artificial_person + '</span>'
                //                 }
                //             }
                //         } else {
                //             artificial_person = data ? data : '--';
                //             if (artificial_person.indexOf('<em') > -1 && artificial_person.indexOf('</em>') > -1) {
                //                 artificial_person = artificial_person.replace(/<em/g, '<em class="wi-secondary-color" ');
                //             }
                //             artificial_str = '<span class="item-person">' + artificial_person + '</span>';
                //         }
                //         return artificial_str;
                //     }
                // },
                {
                    "targets": 2,
                    "data": 'status_after',
                    "render": function(data, type, full, meta) {
                        var companystate = data ? data : "";
                        var stateColor = 'color:';
                        switch (data) {
                            case '撤销':
                            case '吊销':
                            case '迁出':
                            case '停业':
                            case '注销':
                            case '非正常户':
                                // stateColor += '#FD6F74;';
                                stateColor += '#999';
                                break;
                            case '成立':
                            case '存续':
                            case '在业':
                            case '正常':
                            case '其他':
                                // stateColor += '#42BA6E;';
                                stateColor += '#333';
                                break;
                            default:
                                stateColor += '#42BA6E;';
                                break;
                        }
                        var str = '<span style="' + stateColor + '" class="company-state">' + '<span class="company-state-text">' + companystate + '</span></span>'
                        return str;
                    }
                },
                {
                    "targets": 3,
                    "data": 'TODO',
                    "render": function(data, type, full, meta) {
                        var corpId = full['corp_id'];
                        var paths = window.parent._CompanyChart._corpListParams.pathSet[corpId];
                        var arr = paths.arr; // 未去重的路径
                        var obj = paths.obj; // 路径对象
                        var pathData = [];

                        var allColorsObj = {
                            'actctrl': {
                                txt: '控制'
                            },
                            'address': {
                                txt: '地址'
                            },
                            'branch': {
                                txt: '分支机构'
                            },
                            'domain': {
                                txt: '域名'
                            },
                            'invest': {
                                txt: '投资'
                            },
                            'legalrep': {
                                txt: '法人'
                            },
                            'member': {
                                txt: '高管'
                            },
                            'tel': {
                                txt: '电话'
                            },
                            'email': {
                                txt: '邮件'
                            },
                            'investctrl': {
                                txt: '控股'
                            }
                        };

                        if (arr.length == 1 && arr[0].length == 1) {
                            return '\\'
                        }

                        for (var k in obj) {
                            pathData.push(obj[k]);
                        }

                        if (pathData.length > 5) {
                            pathData.length = 5;
                        }

                        var str = '';
                        for (var i = 0; i < pathData.length; i++) {
                            var path = null;
                            var dirt = '';
                            path = pathData[i];
                            str += '<span class="td-span-ctrl">' + intl('138431' /* 路径 */ ) + (i + 1) + '</span><br>';

                            // TODO 保留路径数据副本
                            if (path._path.length) {
                                for (var j = 0; j < path._path.length; j++) {
                                    path._pathOld = path._pathOld || [];
                                    path._pathOld.push(path._path[j]);
                                }
                            } else {
                                for (var j = 0; j < path._pathOld.length; j++) {
                                    path._path = path._path || [];
                                    path._path.push(path._pathOld[j]);
                                }
                            }

                            for (var l = 0; l < path.length - 1; l++) {
                                var lnode = path[l];

                                if (l == 0) {
                                    str += '<span class="td-span-route-left underline wi-secondary-color wi-link-color" data-code="' + lnode['windId'] + '">' + lnode['nodeName'] + '</span>';
                                } else {
                                    str += '<span class=" underline wi-secondary-color wi-link-color" data-code="' + lnode['windId'] + '">' + (lnode['nodeName'] + '</span></span>')
                                }

                                for (var k = 0; k < path._path.length; k++) {
                                    var x = path._path[k];
                                    var txt = '';
                                    if (x.startId === lnode.windId) {
                                        if (x.filtersWithPercent) {
                                            txt = getTxtWithPercent(x);
                                        } else {
                                            txt = getTxt(x);
                                        }
                                        dirt = '<i></i>' + '<b>' + txt + '</b>';
                                        path._path.splice(k, 1);

                                        break;
                                    } else if (x.endId === lnode.windId) {
                                        if (x.filtersWithPercent) {
                                            txt = getTxtWithPercent(x);
                                        } else {
                                            txt = getTxt(x);
                                        }
                                        dirt = '<i class="r-arrow"></i>' + '<b>' + txt + '</b>';
                                        path._path.splice(k, 1);

                                        break;
                                    }
                                }
                                str += '<span class="td-span-route-right">' + dirt;
                            }
                            str += '<span class=" underline wi-secondary-color wi-link-color" data-code="' + path[path.length - 1]['windId'] + '">' + (path[path.length - 1]['nodeName'] + '</span></span>')
                            str += '</br>'
                        }
                        return str;

                        function getTxt(link) {
                            var type = link.relType.split('|');
                            var label = '';

                            if (type.length > 1) {
                                for (var _i = 0; _i < type.length; _i++) {
                                    var t = type[_i];
                                    var _label = '';

                                    if (allColorsObj[t]) {
                                        _label = allColorsObj[t].txt;
                                    }

                                    if (label) {
                                        label += '等';
                                        break;

                                    } else {
                                        label = _label;
                                    }
                                }
                            } else {
                                if (allColorsObj[link.relType]) {
                                    label = allColorsObj[link.relType].txt;
                                } else {
                                    label = '';
                                }
                            }
                            return label;
                        }

                        function getTxtWithPercent(link) {
                            var type = link.relType.split('|');
                            var percentFilter = link.filtersWithPercent; // 带有百分比的props
                            var label = '';

                            if (type.length > 1) {
                                for (var _i = 0; _i < type.length; _i++) {
                                    var t = type[_i];
                                    var _label = '';

                                    if (percentFilter[t]) {
                                        _label = percentFilter[t].txt;
                                    }

                                    if (label) {
                                        label += '等';
                                        break;

                                    } else {
                                        label = _label;
                                    }
                                }
                            } else {
                                if (percentFilter[link.relType]) {
                                    label = percentFilter[link.relType].txt;
                                } else {
                                    label = '';
                                }
                            }
                            return label;
                        }
                    }
                }
            ]

            $("#tableAdvancedList").DataTable({
                "info": false, //当前显示几页到几页
                "lengthChange": false,
                autoWidth: false, //禁用自动调整列宽
                language: showAdvanceList.lang, //提示信息
                //stripeClasses: ["odd", "even"], //为奇偶行加上样式，兼容不支持CSS伪类的场合
                processing: false, //隐藏加载提示,自行处理
                serverSide: true, //启用服务器端分页
                searching: false, //禁用原生搜索
                orderMulti: false, //启用多列排序
                order: [], //取消默认排序查询,否则复选框一列会出现小箭头
                scrollCollapse: false, //开启滚动条
                pageLength: 20, //首次加载的数据条数
                ordering: false,
                paging: true,
                showRowNumber: true,
                retrieve: true,
                columnDefs: columnDefsSet,
                columns: columnsArr,
                fnDrawCallback: function(opts) {
                    if (!opts._iRecordsTotal) {
                        arguments[0].aanFeatures['p'][0].setAttribute('style', 'display:none');
                    }
                    if (opts._iRecordsTotal <= 20) {
                        $(this).siblings('.dataTables_paginate').hide()
                    }
                },
                preDrawCallback: function(opts) {
                    if (arguments[0].oClasses.sPageButtonActive.indexOf('wi-secondary-bg') < 0) {
                        arguments[0].oClasses.sPageButtonActive = arguments[0].oClasses.sPageButtonActive + ' wi-secondary-bg ';
                    }
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
                    var tUrl = "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=" + showAdvanceList.cmd + "&s=" + Math.random();
                    if (!global_isRelease) {
                        tUrl = global_site + "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=" + showAdvanceList.cmd + "&s=" + Math.random() + "&wind.sessionid=" + global_wsid;
                    }
                    var parameter = {};
                    parameter.PageNo = (data.start / data.length);
                    parameter.PageSize = 20;
                    parameter.companycode = showAdvanceList.companycode;
                    $.ajax({
                        url: tUrl,
                        type: "POST",
                        cache: false, //禁用缓存
                        data: parameter, //传入组装的参数
                        dataType: "json",
                        success: function(result) {
                            if (result.ErrorCode && result.Data && result.Data.length) {
                                //封装返回数据
                                var returnData = {};
                                $("#searchResultNum").text(result.Page.Records)
                                returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                                returnData.recordsTotal = result.Page.Records; //返回数据全部记录
                                returnData.recordsFiltered = result.Page.Records; //后台不实现过滤功能，每次查询均视作全部结果
                                returnData.data = result.Data; //返回的数据列表
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

        }, 100)

        $(document).on("click", "#exportCaseList", function() {

            layer.msg('数据导出功能正在升级中');
            return false;

            var paramsStr = ('companycode=' + showAdvanceList.companycode);
            var hrefStr = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?';
            if (!global_isRelease) {
                hrefStr = global_site + hrefStr + "wind.sessionid=" + global_wsid;
            }
            var url = hrefStr + '&moduletype=entpath';
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true); // 也可以使用POST方式，根据接口
            //发送合适的请求头信息
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.responseType = "blob"; // 返回类型blob
            // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            xhr.onload = function() {
                // 请求完成
                if (this.status === 200) {
                    // 返回200
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
                    reader.onload = function(e) {
                        // 转换完成，创建一个a标签用于下载
                        var a = document.createElement('a');
                        a.download = '企业列表_' + new Date().toLocaleDateString() + '.xls';
                        a.href = e.target.result;
                        $("body").append(a); // 修复firefox中无法触发click
                        a.click();
                        $(a).remove();
                    }
                }
            };
            // 发送ajax请求
            xhr.send(paramsStr)
            return false;
        });

        $(document).on('click', '.underline.wi-secondary-color.wi-link-color', function(event) {
            var target = event.target;
            var code = $(target).attr('data-code');
            var name = $(target).text();
            try {
                if (code) {
                    if (code.length > 16) {
                        window.open('Person.html?id=' + code + '&name=' + name);
                    } else {
                        Common.linkCompany("Bu3", code);
                    }
                }
            } catch (e) {
                console.log('跳转失败！');
            }
            return false;
        });
    }
}
/* 国际化 ,所有自己的代码都在写在这个回调函数后*/

var funcList =[showAdvanceList.init]
Common.internationToolInfo(funcList);