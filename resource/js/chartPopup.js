/*
 * @Author: Cheng Bo 
 * @Date: 2019-01-08 16:44:54 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2020-11-10 14:16:18
 * @Desc: chartPopup
 */
(function(window, $) {

    var CompanyChart = {
        companyName: '',
        companyCode: '',
        companyId: '',
        popupTitle: '',
        init: function() {
            var self = this;
            // 父页面携带的参数
            var parentParams = window.parent._childParams;
            self.companyName = parentParams.companyName || '';
            self.companyCode = parentParams.companyCode || '';
            self.companyId = parentParams.companyId || '';
            if (!parentParams.popupTitle) {
                self.popupTitle = self.companyName || '全球企业库';
            }
            switch (parentParams.popupType) {
                case 'ysgx':
                    self.loadYSGX();
                    break;
                case 'gqct':
                    self.loadGQCT();
                    break;
                case 'qysyr':
                    self.loadQYSYR();
                    break;
                default:
                    self.loadGQJG();
                    break;
            }
        },
        loadGQJG: function() {

            var defer1 = $.Deferred();
            var defer2 = $.Deferred();
            var allData;
            var param = {
                companyId: CompanyChart.companyId,
                companyCode: CompanyChart.companyCode,
                companyName: CompanyChart.companyName || '目标公司'
            };
            var htmlTitleArr = [];
            $('.wrapper').append('<div class="content-gqjg-title" id="gqjg_title"></div>');
            $('body').css('overflow', 'hidden');

            // 获取疑似实际控制人 返回Array格式
            myWfcAjax("getactcontroinfo", { companyCode: CompanyChart.companyCode }, function(data) {
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    var arr = data.Data;
                    arr.forEach(function(t) {
                        htmlTitleArr.push('<div><span class="content-gqjg-info-one">' + intl('138449' /* 疑似控制人 */ ) + '</span><span data-type="' + t.ActControType + '" data-id="' + t.ActControId + '" class="content-gqjg-info-two">' + t.ActControName + '</span><span class="content-gqjg-info-three">' + intl('138412' /* 实际持股比例 */ ) + '</span><span class="content-gqjg-info-four">' + parseFloat(t.ActInvestRate).toFixed(2) + '%' + '</span></div>');
                    })
                    defer1.resolve();
                } else {
                    defer1.reject();
                }
            }, function() {
                defer1.reject();
            });

            var htmlArr = [];
            htmlArr.push('<div id="content_map" style="height:660px;background:#fafafa;overflow:hidden;">')
            htmlArr.push('<div class="mao-screen-area" id="screenArea" style="height: 660px; cursor: pointer;background:#fff;padding:0 20px;width:calc(100% - 40px);">')
            htmlArr.push('<div class="chart-header" style="display:none;position:absolute;z-index:1;">')
            htmlArr.push('<button class="chart-header-redirect btn-default-normal" >' + intl('138310', '全屏查看') + '</button>')
            htmlArr.push('<button class="chart-header-open btn-default-normal" >' + intl('12095', '全部展开') + '</button>')
            htmlArr.push('<button class="chart-header-reload btn-default-normal" >' + intl('138765', '还原') + '</button>')
            htmlArr.push('<button class="chart-header-save btn-default-normal" >' + intl('138780', '保存图片') + '</button>')
            htmlArr.push('</div>')
            htmlArr.push('<div class="chart-loading" id="load_data" style="display: none;"><img src="../resource/images/Company/loading.gif" />' + intl('139612' /*数据加载中*/ ) + '...</div>')
            htmlArr.push('<div class="chart-none" id="no_data" style="display: none;">' + intl('222841', '暂无股权结构') + '</div>')
            htmlArr.push('<div id="CompanyChart"></div>')
            htmlArr.push('</div>');
            htmlArr.push('<div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
            htmlArr.push('</div>');
            $('.wrapper').append(htmlArr.join(""));

            $('.chart-header').off('click', 'button');
            myWfcAjax("getcorpshareholdertree", { "companycode": CompanyChart.companyCode }, function(data) {
                data = JSON.parse(data);
                if (data.ErrorCode == 0) {
                    if (data.Data && data.Data.children && data.Data.children.length) {
                        if (!allData) {
                            allData = data.Data.children;
                        }
                        // TODO 暂无数据形式待处理
                        rootData = changeDataSchema(allData);
                        // TODO 目前数据一次拉取，将后续节点隐藏处理
                        changeChildrenData(rootData.children);
                        var node = findNodeByCode(rootData, param.companyCode);
                        try {
                            if (param.companyCode && node) {
                                drawTree(node);
                            } else {
                                rootData.x0 = 0;
                                rootData.y0 = 0;
                                drawTree(rootData);
                            }
                            defer2.resolve();
                            $('.chart-header').show();
                        } catch (e) {
                            defer2.reject();
                            // TODO 暂无数据
                        }
                        $('.chart-header').on('click', 'button', gqjgNavEvent);
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

            // 数据结构转换
            var changeDataSchema = function(data, init) {
                var initData = init || {
                    code: param.Id,
                    name: param.companyName || '公司',
                    type: '目标公司',
                    children: [],
                    hasChild: 1,
                };
                var oldMoney = 0;
                var money = 0;

                for (var i = 0; i < data.length; i++) {
                    money = data[i]['promise_money_amount'];
                    if (!money || money == 'null') {
                        money = '';
                    }
                    oldMoney = money;
                    money = money ? parseFloat(money) : 0;
                    money = money.toFixed(4) - 0;
                    money = oldMoney ? money + '万元' : '--';
                    initData.children.push({
                        code: data[i]['Id'],
                        name: data[i]['name'],
                        type: data[i]['type'],
                        amount: money,
                        percent: data[i]['stockShare'] ? parseFloat(data[i]['stockShare']).toFixed(4) + '%' : '--',
                        hasChild: data[i].children && data[i].children.length > 0 ? true : false,
                        stock: data[i]['stockShare'] || 0,
                        listed: data[i]['listed'] ? 1 : 0,
                        issued: data[i]['issued'] ? 1 : 0
                    });
                    if (data[i]['hasChild'] - 0) {
                        initData.children[initData.children.length - 1]._children = [];
                    }
                    if (data[i].children) {
                        delete initData.children[initData.children.length - 1]._children;
                        initData.children[initData.children.length - 1].children = [];
                        changeDataSchema(data[i].children, initData.children[initData.children.length - 1]);
                    } else {
                        if (data[i]['Id'] && data[i]['type'] == 'company') {
                            initData.children[initData.children.length - 1]._children = [];
                        }
                    }
                }
                return initData;
            };

            // 根据公司code遍历节点
            var findNodeByCode = function(data, code, node) {
                node = node || '';
                if (data.code == code) {
                    node = data;
                } else if (data.children && data.children.length) {
                    var nodes = data.children;
                    for (var i = 0; i < nodes.length; i++) {
                        node = findNodeByCode(nodes[i], code, node);
                        if (node) {
                            return node;
                        }
                    }
                }
                return node;
            };

            var findNodeByAllDataCode = function(data, code, node) {
                node = node || '';
                if (data.Id == code) {
                    node = data;
                } else if (data.children && data.children.length) {
                    var nodes = data.children;
                    for (var i = 0; i < nodes.length; i++) {
                        node = findNodeByAllDataCode(nodes[i], code, node);
                        if (node) {
                            return node;
                        }
                    }
                }
                return node;
            };

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
                var nodeUpdate = svg.svg.selectAll("g.node").data(nodes, function(t) {
                    return t.mid || (t.mid = ++idx);
                });
                // n
                var enterZone = nodeUpdate.enter()
                    .append("g")
                    .attr("class", "node")
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
                    .attr("class", "testtext")
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
                    .attr("class", "testtext")
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

                // 持股比例
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
                            // window.open('Person.html?id=' + t.code + '&name=' + t.name)
                        } else {
                            Common.linkCompany('Bu3', t.code);
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
                    .append("tspan")
                    .text("持股比例：")
                    .append("tspan")
                    .attr("class", "count")
                    .attr("fill", "#fe7e17")
                    .text(function(t) {
                        return t.percent;
                    });

                // 认缴金额
                enterNodes.append("text")
                    .filter(function(t) {
                        return t.depth;
                    })
                    .attr("class", "size")
                    .attr("fill", "#333")
                    .attr("font-size", "13px")
                    .attr("dy", 20)
                    .attr("dx", function(t) {
                        return t.textleft + 165;
                    })
                    .append("tspan")
                    .text("认缴金额：")
                    .append("tspan")
                    .attr("class", "count")
                    .attr("fill", "#fe7e17")
                    .text(function(t) {
                        return t.amount;
                    });

                // 展开、收缩 按钮图标
                enterZone.append("circle")
                    .filter(function(t) {
                        // return t.hasChild;
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
            var tree = d3.layout.tree().nodeSize([0, 20]); // j
            var diagonal = d3.svg.diagonal().projection(function(t) {
                return [t.y, t.x];
            }); // q
            var zoom = CompanyChart.zoom = d3.behavior.zoom().scaleExtent([1, 1]).on("zoom", zoomed); // U
            var idx = 0; // V
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
                if (d.depth > 0 && d.code) {
                    if (d._children && d._children.length == 0) {
                        if (d.type === '2') {
                            param.companyCode = d.code;
                            getDefaultData(d.code, d.parent.code);
                        }
                    } else {
                        toggle(d);
                        toggleAllData(d);
                        drawTree(d);
                    }
                }
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
                drawTree(rootData);
            }

            // 画布初始化
            function draw() {
                svgWidth = $('#screenArea').width() || document.documentElement.clientWidth || document.body.clientWidth;
                svgHeight = $('#screenArea').height();

                d3.select('#CompanyChart svg').attr('width', svgWidth);

                // svg画布
                svg.baseSvg = d3.select("#CompanyChart")
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
            }

            function gqjgNavEvent(e) {
                var idx = $(this).index();
                switch (idx) {
                    case 0:
                        CompanyChart.redirectToChart('#chart_newgqjg');
                        return false;
                        break;
                    case 1:
                        expandTree();
                        break;
                    case 3:
                        if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                            if (layer) {
                                layer.msg('功能升级中!')
                            } else {
                                window.alert('功能升级中!')
                            }
                            return;
                        }
                        var box = d3.select('#CompanyChart svg g').node().getBoundingClientRect();
                        var w = box.width;
                        var h = box.height;
                        Common.saveCanvasImg('#CompanyChart', CompanyChart.companyName + '_股权结构', 2, null, w + 100 + '', h + 100 + '');
                        break;
                    default:
                        restore();
                        break;
                }
            }

            draw();
        },
        loadYSGX: function() {
            // TODO 1. 绘制页面 2.实现功能
            var Relation = {
                companyCode: CompanyChart.companyCode,
                companyName: CompanyChart.companyName,
                companyId: CompanyChart.companyId,
                dataSet: null,
                cloneDataSet: {},
                chartSelect: null,
                contentSelect: null
            };

            $('.nav-tabs').on('click', '.nav-block', function(e) {
                var block = $(e.target).closest('.nav-block');
                var id = $(block).attr('id');
                if ($(block).hasClass('active')) {
                    return false;
                }
                $(Relation.chartSelect).removeClass('active').find('.menu-title-underline').removeClass('wi-secondary-bg');
                $(block).addClass('active').find('.menu-title-underline').addClass('wi-secondary-bg');
                Relation.chartSelect = $(block);

                switch (id) {
                    case 'chart_list':
                        $(Relation.contentSelect).hide();
                        Relation.contentSelect = '#content_list';
                        $(Relation.contentSelect).show();
                        console.log('list');
                        break;
                    default:
                        $(Relation.contentSelect).hide();
                        Relation.contentSelect = '#content_map';
                        $(Relation.contentSelect).show();
                        console.log('map');
                }
            })

            Relation.contentSelect = '#content_map';
            Relation.chartSelect = $('.nav-tabs').find('.nav-block').eq(0);
            Relation.chartSelect.addClass('active').find('.menu-title-underline').addClass('wi-secondary-bg');

            initData();

            function initData() {
                myWfcAjax("getentpatht", { bindcode: CompanyChart.companyCode, level: 1 }, function(data) {
                    data = JSON.parse(data);
                    if (data.ErrorCode == 0 && data.Data) {

                        var dataSet = Relation.dataSet;

                        if (data.Data.nodes && data.Data.nodes.length && data.Data.routes && data.Data.routes.length) {
                            dataSet = Relation.dataSet = Common.chartAllDataChange(data.Data);
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
                            var pathSet = Relation.chartPathSet = Common.chartPathChange(data.Data.paths);
                            Relation._corpListParams = {};
                            Relation._corpListParams.pathSet = pathSet.pathObj;
                            Relation._corpListParams.companycode = '';

                            var _rootNode = null;

                            // 记录当前有多少企业节点(剔除目标公司)
                            for (var iii = 0; iii < dataSet.nodes.length; iii++) {
                                var item = dataSet.nodes[iii];
                                if (item.nodeType == 'company' && (item.windId.indexOf('$') < 0)) {
                                    if (item.windId !== Relation.companyCode) {
                                        if (Relation._corpListParams.companycode) {
                                            Relation._corpListParams.companycode += (',' + item.windId);
                                        } else {
                                            Relation._corpListParams.companycode = item.windId;
                                        }
                                    }
                                }
                                if (item.windId === Relation.companyCode) {
                                    _rootNode = item;
                                }
                            }
                        } else {
                            dataSet = Relation.dataSet = {
                                nodes: [{
                                    level: 0,
                                    nodeName: CompanyChart.companyName,
                                    windId: CompanyChart.companyCode
                                }],
                                routes: [],
                                paths: []
                            }
                            Relation._corpListParams = {};
                            Relation._corpListParams.companycode = '';
                        }
                        $.extend(true, Relation.cloneDataSet, dataSet);

                        initMap();
                        initList();

                    } else {
                        $('.wrapper').append('<div style="width:200px;height:40px;margin-top:300px;margin-left:47%;">' + intl('222842', '暂无疑似关系') + '</div><div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
                        // TODO 暂无数据
                    }
                }, function() {
                    $('.wrapper').append('<div style="width:200px;height:40px;margin-top:300px;margin-left:47%;" id="no_data">' + intl('222842', '暂无疑似关系') + '</div><div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
                    // TODO 加载失败
                })
            }

            function initMap() {

                var htmlArr = [];
                htmlArr.push('<div id="content_map" style="height:635px;background:#fafafa;">')
                htmlArr.push('<div class="mao-screen-area" id="screenArea" style="height: 635px; cursor: pointer;background:#fff;">')
                htmlArr.push('<div class="chart-header" style="display:none;position:absolute;z-index:1;top:5px;">')
                htmlArr.push('<button class="chart-header-redirect btn-default-normal" >' + intl('138310', '全屏查看') + '</button>')
                htmlArr.push('<button class="chart-header-reload btn-default-normal" >' + intl('138765', '还原') + '</button>')
                htmlArr.push('<button class="chart-header-save btn-default-normal" >' + intl('138780', '保存图片') + '</button>')
                htmlArr.push('</div>')
                htmlArr.push('<div class="chart-loading" id="load_data" style="display: none;"><img src="../resource/images/Company/loading.gif" />' + intl('139612' /*数据加载中*/ ) + '...</div>')
                htmlArr.push('<div class="chart-none" id="no_data" style="display: none;">' + intl('222842', '暂无疑似关系') + '</div>')
                htmlArr.push('<div id="companyChart"></div>')
                htmlArr.push('</div>');
                htmlArr.push('<div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
                htmlArr.push('</div>');

                $('.wrapper').append(htmlArr.join(""));

                try {
                    $('#load_data').show();
                    Relation.cyInstance = Common.relationChartInitFun(Relation.dataSet, { code: Relation.companyCode }, $('#companyChart')[0], '635', 0.8, true);
                    $('.chart-header').show();
                    $('.nav').show()
                    $('#load_data').hide();
                } catch (e) {
                    // TODO 加载失败
                    $('#load_data').hide();
                    $('#no_data').show();
                    return;
                }

                function actionSaveFn(e) {
                    // Common.burypcfunctioncode('');
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
                    var imgData = Relation.cyInstance.jpg({ full: true, bg: '#ffffff', scale: 1.8 })
                    var target = $('[data-id="layer2-node"]')
                    Common.saveCanvasImg('[data-id="layer2-node"]', Relation.companyName + '_疑似关系', 3, imgData)
                }

                function actionOneFn(e) {
                    // Common.burypcfunctioncode('');
                    CompanyChart.redirectToChart('#chart_ysgx');
                }

                function actionTwoFn(e) {
                    // Common.burypcfunctioncode('');
                    if ($('#load_data').attr('style').indexOf('block') > -1) {
                        return false;
                    }
                    $('.chart-header').hide();
                    $("#companyChart").empty(); // 节点清空
                    $("#companyChart").attr('class', ''); // 样式清空     
                    $('#load_data').show();
                    var tmpData = {};
                    $.extend(true, tmpData, Relation.cloneDataSet);
                    Relation.cyInstance = null;
                    setTimeout(function() {
                        Relation.cyInstance = Common.relationChartInitFun(tmpData, { code: Relation.companyCode }, $('#companyChart')[0], '640', 0.5, true);
                        $('#companyChart').show();
                        $('.chart-header').show();
                    }, 500)
                }

                $('.chart-header-redirect').off('click').on('click', actionOneFn);
                $('.chart-header-reload').off('click').on('click', actionTwoFn);
                $('.chart-header-save').off('click').on('click', actionSaveFn);

            }

            function initList() {

                var fields = ["NO.", "corp_name", "status_after", 'TODO']
                var alignArr = [0, 0, 0, 0]
                var columnsArr = [];
                var lang = {
                    "sProcessing": "加载中...",
                    "sZeroRecords": "暂无数据",
                    "paginate": {
                        "next": "&gt;",
                        "previous": "&lt;"
                    }
                };
                var cmd = 'relationpathcorps';

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
                            var paths = Relation._corpListParams.pathSet[corpId];
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
                                str += '<span class="td-span-ctrl">' + intl('138431' /*路径*/ ) + (i + 1) + '</span><br>';

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

                $("#tableChartList").DataTable({
                    "info": false, //当前显示几页到几页
                    "lengthChange": false,
                    autoWidth: false, //禁用自动调整列宽
                    language: lang, //提示信息
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
                        var tUrl = "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=" + cmd + "&s=" + Math.random();
                        if (!global_isRelease) {
                            tUrl = global_site + "/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=" + cmd + "&s=" + Math.random() + "&wind.sessionid=" + global_wsid;
                        }
                        var parameter = {};
                        parameter.PageNo = (data.start / data.length);
                        parameter.PageSize = 20;
                        parameter.companycode = Relation._corpListParams.companycode
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
                                    // $("#searchResultNum").text(result.Page.Records)
                                    returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                                    returnData.recordsTotal = result.Page.Records; //返回数据全部记录
                                    returnData.recordsFiltered = result.Page.Records; //后台不实现过滤功能，每次查询均视作全部结果
                                    returnData.data = result.Data; //返回的数据列表
                                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                                    callback(returnData);
                                } else {
                                    // $("#searchResultNum").text(0)
                                    callback({ data: [] });
                                    $("#tableChartList_paginate").hide();
                                }
                            },
                            error: function(data) {
                                // $("#searchResultNum").text(0)
                                console.log("error!");
                            }
                        });
                    },
                });

                $('#tableChartList').on('click', '.underline.wi-secondary-color.wi-link-color', function(event) {
                    var target = event.target;
                    var code = $(target).attr('data-code');
                    var name = $(target).text();
                    try {
                        if (code) {
                            if (code.length > 16) {
                                // window.open('Person.html?id=' + code + '&name=' + name);
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

        },
        loadGQCT_new: function() {
            var rootData = {};
            var parameter = { "companycode": CompanyChart.companyCode, "depth": 4 };
            var vData = {}; // 暂存原始数据
            var echartInstance = null;
            $('.wrapper').find('#content_map').remove();
            var htmlArr = [];
            htmlArr.push('<div id="content_map" style="height:640px;background:#fafafa;">')
            htmlArr.push('<div class="mao-screen-area" id="screenArea" style="height: 640px; cursor: pointer;background:#fff;">')
            htmlArr.push('<div class="chart-header" style="display:none;position:absolute;z-index:1;">')
            htmlArr.push('<button class="chart-header-change btn-default-normal" >' + '风格切换' + '</button>')
            htmlArr.push('<button class="chart-header-redirect btn-default-normal" >' + intl('138310', '全屏查看') + '</button>')
            htmlArr.push('<button class="chart-header-reload btn-default-normal" >' + intl('138765', '还原') + '</button>')
            htmlArr.push('<button class="chart-header-save btn-default-normal" >' + intl('138780', '保存图片') + '</button>')
            htmlArr.push('</div>')
            htmlArr.push('<div class="chart-loading" id="load_data" style="display: none;"><img src="../resource/images/Company/loading.gif" />' + intl('139612' /*数据加载中*/ ) + '...</div>')

            htmlArr.push('<div class="chart-none" id="no_data" style="display: none;">' + intl('', '暂无股权穿透') + '</div>')
            htmlArr.push('<div id="CompanyChart"></div>')
            htmlArr.push('</div>');
            htmlArr.push('<div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
            htmlArr.push('</div>');
            $('.wrapper').append(htmlArr.join(""));

            $('.chart-header').off('click', 'button');

            myWfcAjax("tracingstockex", parameter, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    CompanyChart.rootData = rootData = data.Data;
                    try {
                        if ((rootData.investTree && rootData.investTree.children && rootData.investTree.children.length) || (rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length)) {
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
                            // 1 将股权数据统一放置上方 添加isup标识
                            rootData.shareHolderTree = rootData.shareHolderTree || {};
                            rootData.shareHolderTree = changeDataSchema(rootData.shareHolderTree);
                            // 2 将股权、投资的子节点依次放置到根节点后
                            rootData.shareHolderTree.children && rootData.shareHolderTree.children.length && rootData.shareHolderTree.children.map(function(t) {
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
                            $('.chart-header').show();
                            $('.chart-header').on('click', 'button', newgqctNavEvent);
                        } else {
                            $('#no_data').show();
                            console.log('对外投资绘制失败:' + e);
                        }
                    } catch (e) {
                        $('#no_data').show();
                        console.log('对外投资绘制失败:' + e);
                    }
                } else {
                    $('#no_data').show();
                    console.log('对外投资数据/接口异常');
                }
            }, function() {
                $('#no_data').show();
                console.log('对外投资服务端异常');
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

                // 持股比例
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
                        // return t.hasChild;
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
                // changeData(rootData);
                changeChildrenData2(rootData.children);
                drawTree(rootData);
            }

            // 画布初始化
            function draw() {
                svgWidth = $('#screenArea').width() || document.documentElement.clientWidth || document.body.clientWidth;
                svgHeight = $('#screenArea').height();

                d3.select('#CompanyChart svg').attr('width', svgWidth);

                // svg画布
                svg.baseSvg = d3.select("#CompanyChart")
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
                // svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + border.left + "," + border.top + ")");
                svg.svg = svg.svgGroup.append("g").attr("transform", "translate(" + 60 + "," + 270 + ")");

            }

            draw();

            /**
             * 股权穿透header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function newgqctNavEvent(e) {
                var target = e.target;
                if (!$(target).is('button')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 3:
                        newgqctSaveImgEvent();
                        break;
                    case 2:
                        reloadChart();
                        break;
                    case 0:
                        CompanyChart.loadGQCT();
                        break;
                    default:
                        CompanyChart.redirectToChart('#chart_gqct');
                        break;
                }
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
                var box = d3.select('#CompanyChart svg g').node().getBoundingClientRect();

                var node = d3.select('#CompanyChart svg g g').attr('transform');

                var x = node.split('(')[1].split(',')[0];
                var y = node.split(',')[1].split(')')[0] - 0;

                if (y + upHeight < 0) {
                    d3.select('#CompanyChart svg g g').attr('transform', "translate(" + x + "," + (y - upHeight + 0) + ")");
                }

                var w = box.width;
                var h = box.height;
                Common.saveCanvasImg('#CompanyChart', CompanyChart.companyName + '_股权穿透', 2, null, w + 300 + '', h + 300 + '');
                d3.select('#CompanyChart svg g g').attr('transform', "translate(" + x + "," + (y) + ")");
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
                // window.location.reload();
                CompanyChart.loadGQCT_new();
            }
        },
        loadGQCT: function() {
            var rootData = null;
            var parameter = { "companycode": CompanyChart.companyCode, "depth": 4 };
            var vData = {}; // 暂存原始数据
            var echartInstance = null;
            $('.wrapper').find('#content_map').remove();
            var htmlArr = [];
            htmlArr.push('<div id="content_map" style="height:640px;background:#fafafa;">')
            htmlArr.push('<div class="mao-screen-area" id="screenArea" style="height: 640px; cursor: pointer;background:#fff;">')
            htmlArr.push('<div class="chart-header" style="display:none;position:absolute;z-index:1;">')
            htmlArr.push('<button class="chart-header-change btn-default-normal" >' + '风格切换' + '</button>')
            htmlArr.push('<button class="chart-header-redirect btn-default-normal" >' + intl('138310', '全屏查看') + '</button>')
            htmlArr.push('<button class="chart-header-reload btn-default-normal" >' + intl('138765', '还原') + '</button>')
            htmlArr.push('<button class="chart-header-save btn-default-normal" >' + intl('138780', '保存图片') + '</button>')
            htmlArr.push('</div>')
            htmlArr.push('<div class="chart-loading" id="load_data" style="display: none;"><img src="../resource/images/Company/loading.gif" />' + intl('139612' /*数据加载中*/ ) + '...</div>')
            htmlArr.push('<div class="chart-none" id="no_data" style="display: none;">' + intl('', '暂无股权穿透') + '</div>')
            htmlArr.push('<div id="companyChart"></div>')
            htmlArr.push('</div>');
            htmlArr.push('<div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
            htmlArr.push('</div>');
            $('.wrapper').append(htmlArr.join(""));

            $('.chart-header').off('click', 'button');

            myWfcAjax("tracingstockex", parameter, function(data) {
                $('#load_data').hide();
                data = JSON.parse(data);
                if (data && data.ErrorCode == 0 && data.Data) {
                    CompanyChart.rootData = rootData = data.Data;
                    try {
                        if ((rootData.investTree && rootData.investTree.children && rootData.investTree.children.length) || (rootData.shareHolderTree && rootData.shareHolderTree.children && rootData.shareHolderTree.children.length)) {
                            $.extend(true, vData, data.Data);
                            echartInstance = echarts.init(document.querySelector('#companyChart'));
                            echartInstance._wind_redirect = true;
                            Common.shareHolderAndInvestChartInitFun(echartInstance, rootData, parameter.companycode, CompanyChart.companyName)
                            $('.chart-header').show();
                            $('.chart-header').on('click', 'button', gqctNavEvent);
                        } else {
                            $('#no_data').show();
                            console.log('对外投资绘制失败:' + e);
                        }
                    } catch (e) {
                        $('#no_data').show();
                        console.log('对外投资绘制失败:' + e);
                    }
                } else {
                    $('#no_data').show();
                    console.log('对外投资数据/接口异常');
                }
            }, function() {
                $('#no_data').show();
                console.log('对外投资服务端异常');
            });

            /**
             * 刷新
             * 
             * @param {any} e 
             * @returns 
             */
            function reloadChart(e) {
                // Common.burypcfunctioncode('');
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
                // Common.burypcfunctioncode('');
                if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                    if (layer) {
                        layer.msg('功能升级中!')
                    } else {
                        window.alert('功能升级中!')
                    }
                    return;
                }
                // Common.saveEchart2Img(echartInstance, CompanyChart.companyName ? (CompanyChart.companyName + '_' + '股权穿透') : '股权穿透', $('#companyChart'));
                Common.saveEchart2Img(echartInstance, CompanyChart.companyName ? (CompanyChart.companyName + '_' + '股权穿透') : '股权穿透', '#companyChart');
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
                    case 3:
                        gqctSaveImgEvent();
                        break;
                    case 2:
                        reloadChart();
                        break;
                    case 0:
                        CompanyChart.loadGQCT_new();
                        break;
                    default:
                        CompanyChart.redirectToChart('#chart_gqct');
                        break;
                }
                return false;
            }

        },
        loadQYSYR: function() {
            var htmlArr = [];
            if (!$('#content_map') || !$('#content_map').length) {
                htmlArr.push('<div id="content_map" style="height:640px;background:#fafafa;">')
                htmlArr.push('<div class="mao-screen-area" id="screenArea" style="height: 640px; cursor: pointer;background:#fff;">')
                htmlArr.push('<div class="chart-header" style="display:none;position:absolute;z-index:1;">')
                htmlArr.push('<button class="chart-header-redirect btn-default-normal" >' + intl('138310', '全屏查看') + '</button>')
                htmlArr.push('<button class="chart-header-reload btn-default-normal" >' + intl('138765', '还原') + '</button>')
                htmlArr.push('<button class="chart-header-save btn-default-normal" >' + intl('138780', '保存图片') + '</button>')
                htmlArr.push('</div>')
                htmlArr.push('<div class="chart-loading" id="load_data" style="display: none;"><img src="../resource/images/Company/loading.gif" />' + intl('139612' /*数据加载中*/ ) + '...</div>')
                htmlArr.push('<div class="chart-none" id="no_data" style="display: none;" >' + intl('132725', '暂无数据') + '</div>')
                htmlArr.push('<div id="companyChart"></div>')
                htmlArr.push('</div>');
                htmlArr.push('<div class="bottom-content">' + '基于公开信息和第三方数据利用大数据技术独家计算生成' + '</div>');
                htmlArr.push('</div>');
                $('.wrapper').append(htmlArr.join(""));
            }
            $('.chart-header').off('click', 'button');
            myWfcAjax("getbeneficiaryroute", { companycode: CompanyChart.companyCode }, function(data) {
                //企业受益人
                $('#load_data').hide();
                var resData = JSON.parse(data);
                if (resData.ErrorCode == 0 && resData.Data && resData.Data.relationList && resData.Data.relationList.length > 0) {
                    var res = qysyrDataChange(resData.Data);
                    $('.chart-header').show();
                    $('.chart-header').off('click', 'button', qysyrNavEvent).on('click', 'button', qysyrNavEvent);
                    $('#no_data').hide();
                    loadRealMap(res);
                } else {
                    $('#no_data').show();
                }
            }, function() {
                $('#no_data').show();
                console.log('对外投资服务端异常');
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
                var lineTxtColorOne = '#999';
                var lineTxtColorTwo = 'transparent';
                var lineTxtShow = ($('.chart-header-rate').attr('data-hide') == 0 ? false : true);

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
                $('.mao-screen-area').css('height', 'auto');
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
                        var fontSize = 15; // ycye.cecil modify UI颜色 2020-10-27 start
                        var targetBgColor = '#2277a2';
                        var manBgColor = '#e05d5d';
                        // ycye.cecil modify UI颜色 2020-10-27 end
                        var targetTxtColor = '#fff';
                        var corpBgColor = '#fff';
                        var corpTxtColor = '#333';
                        var label = node.Name.replace(/(.{5})(?=.)/g, '$1\n');
                        var lines = Math.round(node.Name.length / 5);
                        // var image = null;
                        var imgSrc = node.imageIdT;
                        // var imgSrc = 'http://180.96.8.44/imageWeb/ImgHandler.aspx?imageID=' + node.imageId;
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
                    // myChart.un(ecConfig.EVENT.CLICK);
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
                    // myChart.on(ecConfig.EVENT.CLICK, function(param) {
                    //     var offset = $('#screenArea').offset();
                    //     var navWidth = $('.chart-nav').width() ? $('.chart-nav').width() + 20 : offset.left;
                    //     var offsetTwo = { top: offset.top, left: offset.left + navWidth };
                    //     if (param.data && param.data.keyNo) {
                    //         // TODO 过滤无效node
                    //         if (param.data.keyNo.indexOf('$') == 0) {
                    //             return;
                    //         }
                    //         if (param.data.benifciary) {
                    //             if (param.data.nodeType === 'company') {
                    //                 Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '企业信息|' + CompanyChart.companyCode + '|' + CompanyChart.companyName, type: 'company_beneficiary', name: param.data.name, offset: offsetTwo })
                    //             } else if (param.data.nodeType === 'person') {
                    //                 Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '人物信息|' + CompanyChart.companyCode + '|' + CompanyChart.companyName, type: 'person_beneficiary', name: param.data.name, offset: offsetTwo })
                    //             }
                    //         } else if (param.data.nodeType === 'company') {
                    //             Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '企业信息', type: 'company', name: param.data.name, offset: offsetTwo })
                    //         } else if (param.data.nodeType === 'person') {
                    //             Common.chartCardEventHandler({ companyCode: param.data.keyNo, title: '人物信息', type: 'person', name: param.data.name, offset: offsetTwo })
                    //         }
                    //     }
                    // });
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
                                    textFont: 'normal 16px 微软雅黑',
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
                                    textFont: 'normal 16px 微软雅黑',
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

            function qysyrSaveImgEvent() {

                function saveImg() {
                    // 移除已有jietu遮罩
                    if ($('[data-id="jietuMask"]')) {
                        $('[data-id="jietuMask"]').remove();
                    }
                    var myChart = CompanyChart.echartInstance;

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
                    var Rectangle = require('zrender/shape/Rectangle');
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

            function reloadChart() {
                CompanyChart.echartInstance._messageCenter.dispatch('restore', null, null, CompanyChart.echartInstance);
            }

            /**
             * 股权穿透header事件委托
             * 
             * @param {any} e 
             * @returns 
             */
            function qysyrNavEvent(e) {
                var target = e.target;
                if (!$(target).is('button')) {
                    target = target.closest('li');
                }
                var idx = $(target).parent().children().index($(target));

                switch (idx) {
                    case 2:
                        qysyrSaveImgEvent();
                        break;
                    case 1:
                        reloadChart();
                        break;
                    case 0:
                    default:
                        CompanyChart.redirectToChart('#chart_qysyr');
                        break;
                }
                return false;
            }

        },
        /**
         * 跳转图谱中心
         */
        redirectToChart: function(hash) {
            window.open('CompanyChart.html?companycode=' + CompanyChart.companyCode + '&companyname=' + CompanyChart.companyName + '&companyid=' + CompanyChart.companyId + hash);
            return false;
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
    };


    window._CompanyChart = window._CompanyChart || CompanyChart;
    /* 国际化 ,所有自己的代码都在写在这个回调函数后*/
    function chartPopopInit() {
        setTimeout(function() {
            CompanyChart.init();
        }, 100);
    }
    var funcList = [chartPopopInit];
    Common.internationToolInfo(funcList);

})(window, $)