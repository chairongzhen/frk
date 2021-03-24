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

function nlAjax(tUrl, data, successFun, errorFun) {
    if (!data) {
        data = {};
    }
    $.ajax({
        data: getAllPrpos(data),
        type: "Post",
        url: tUrl,
        timeout: 30000,
        success: function() {
            var res = arguments[0];
            //if (res.status && res.status == '401') {
            //    window.location.href = location.origin + '/windLogin.html?logout';
            //}
            try {
                successFun && successFun(res, arguments[1], arguments[2]);
            } catch (e) {}
        },
        error: function() {
            var res = arguments[0];
            // if (res.status && res.status == '401') {
            //     window.location.href = location.origin + '/windLogin.html?logout';
            // }
            try {
                //errorFun && errorFun(res, arguments[1], arguments[2]);
            } catch (e) {}

        }
    });
}

$(function() {
        //元素
        var oFileBox = $(".fileBox"); //选择文件父级盒子
        var oFileInput = $("#fileInput"); //选择文件按钮
        var oFileSpan = $("#fileSpan"); //选择文件框

        var oFileList_parent = $(".fileList_parent"); //表格
        var oFileList = $(".fileList"); //表格tbody
        var oFileBtn = $("#fileBtn"); //上传按钮

        var flieList = []; //数据，为一个复合数组
        var sizeObj = []; //存放每个文件大小的数组，用来比较去重


        //拖拽外部文件，进入目标元素触发
        oFileSpan.on("dragenter", function() {
            $(this).css("backgroundColor", "#efefef");
        });

        //拖拽外部文件，进入目标、离开目标之间，连续触发
        oFileSpan.on("dragover", function() {
            $(this).css("backgroundColor", "#efefef");
            return false;
        });

        //拖拽外部文件，离开目标元素触发
        oFileSpan.on("dragleave", function() {
            $(this).css("backgroundColor", "#ebf9fb");
        });

        //拖拽外部文件，在目标元素上释放鼠标触发
        oFileSpan.on("drop", function(ev) {
            var fs = ev.originalEvent.dataTransfer.files;
            analysisList(fs); //解析列表函数
            //$(this).text("或者将文件拖到此处").css("background","none");
            return false;
        });

        //点击选择文件按钮选文件
        oFileInput.on("change", function() {
            analysisList(this.files);
        })

        //解析列表函数
        function arrayBufferToBase64(buffer) {
            var binary = "";
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        function fileType(name) {
            var nameArr = name.split(".");
            return nameArr[nameArr.length - 1].toLowerCase();
        }

        function analysisList(file) {
            var name = file[0].name; //文件名
            var size = file[0].size; //文件大小
            var type = fileType(name);

            //文件大于2M，就不上传
            if (size > 2 * 1024 * 1024 || size == 0) {
                layer.msg('文件超过2M,请重新选择');
                return false;
            }

            //文件类型不为这三种，就不上传
            if (("xls/xlsx/xlsm").indexOf(type) == -1) {
                layer.msg('文件类型不对');
                return false;
            }
            var reader = new FileReader();
            reader.readAsArrayBuffer(file[0]);
            var byte64 = "";
            reader.onload = function(e) {
                var buffer = e.target.result //此时是arraybuffer类型
                console.log(buffer)
                byte64 = arrayBufferToBase64(buffer)
                var parameter = { "name": name, "file": byte64 }
                nlAjax("/nl/match", parameter, function(res) {
                    if (res.data && res.code == 0) {
                        window.localStorage.matchId = res.data.matchId;
                        window.localStorage.removeItem("ids");
                        window.location.href = "/web/nl/nlsearch.html";
                    } else {
                        layer.msg("上传出错")
                    }
                }, function() {
                    layer.msg("上传出错")
                })
            }
        };
        //字节大小转换，参数为b
        function bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB'];
            if (bytes == 0) return 'n/a';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        };

        //通过文件名，返回文件的后缀名
        function fileType(name) {
            var nameArr = name.split(".");
            return nameArr[nameArr.length - 1].toLowerCase();
        }

        $(document).on('click', '.btn-history-batch', function() {
            window.open("../customer/index.html#mylist")
        })

        $('.download-vip-tips').mouseover(function(e) {
            $(e.target).attr('title', intl('209303' /* 您正在使用付费高级功能 */ ));
        })

        if (wind && wind.langControl) {
            if (wind.langControl.lang !== 'zh') {
                var styleEle = ['<style>.content-toolbar ul>li{height:auto;padding-left:5px;padding-right:5px;word-break:break-word;}</style>'];
                $(document.head).append(styleEle);
            }
        }

        $("#saveNameList").click(function(){
            var matchId = localStorage.matchId;
            console.log("matchId:" + matchId)
            if(matchId) {
                var listName = prompt("请输入名单名称","名单筛选");
                if(listName) {
                    nlAjax("/nl/match/save/" + matchId, {userId: 1412722, type: "1", name: listName}, function (data) {
                        if (data.code == 0) {
                            alert("保存成功");
                        } else {
                            alert("保存失败");
                        }
                    });
                }
            }
        });

        $("#selectFields").click(function(){
            nlAjax("/nl/fields/select", {}, function (data) {
                //console.log(data)
                var buttonGroup = $("<fieldset style='margin: 10px;padding: 10px'>筛选条件<legend></legend></fieldset>");
                for(var i=0; i < data.length; i++){
                    var button = $("<button id='"+data[i].name+"' onclick='addField(this,"+data[i].options+")' title='"+data[i].label+"'>"+ data[i].label +"</button>");
                    if(button){
                        button.attr("data", data[i]);
                    }
                    buttonGroup.append(button);
                }
                layer.open({
                    skin: 'layer-vip-1',
                    title: "请选择筛选条件", //是否去掉标题展示
                    resize: false, //是否可拉伸
                    type: 1,
                    area: ['580px', '395px'], //宽高
                    content: buttonGroup.html()
                });
            });
        });

        $("#nl_search").click(function () {

            var arr = $("#nl_search_form").serializeArray();
            var data = { userId: 1412722, type: "2", index: 0, size: 10, params: {
               "so_govlevel": 0,
               "so_established_time" : 1 //成立时间倒序：0（asc）,1(desc)
            } };

            for(var i = 0; i < arr.length; i++){
                data.params[arr[i].name]=arr[i].value;
            }

            var matchId = parseInt(localStorage.matchId);
            if(matchId && matchId > 0){
                data.params["matchId"]=matchId;
            }

            var ids = localStorage.ids;
            if(ids){
                data.params["ids"]=ids;
            }

            $.ajax({
                    url: '/nl/search',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify(data)
                })
                .done(function(data) {
                    showData(data);
                })
                .fail(function() {
                    alert("搜索失败");
                });
        });

        $("#nl_import").click(function () {
            localStorage.removeItem("matchId");
            localStorage.removeItem("ids");
            return true;
        });
    });

function addField(btn, options){
    var selection = "<select name='op_"+btn.id+"'>";
    for(var i = 0; i < options.length; i++){
        if(options[i].default) {
            selection += "<option value=" + options[i].value + " selected>" + options[i].label + "</option>";
        } else {
            selection += "<option value=" + options[i].value + ">" + options[i].label + "</option>";
        }
    }
    selection += "</select>";
    $("#nl_search_form p").append("<div>"+btn.title+"："+selection+" <input type='text' name='"+btn.id+"' /></div>");
    $("#nl_search_form").show();
    layer.closeAll();
}
    //显示列表
function showTab(step) {
    var data = { index: 0, size: 10, params: {} };

    var matchId = parseInt(localStorage.matchId);
    if(matchId && matchId > 0){
        data.params["matchId"]=matchId;
    }

    var ids = localStorage.ids;
    if(ids){
        data.params["ids"]=ids;
    }

    var index = parseInt(localStorage.index);
    if(index && step != 0){
        data.index += step;
    } else {
        data.index = step;
    }
    if(data.index < 0) {
        data.index = 0;
    }
    localStorage.index = data.index;

    console.log(data);

    $.ajax({
        url: '/nl/search',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(data)
    })
    .done(function(data) {
        showData(data);
    })
    .fail(function() {
        alert("匹配失败");
    });
}



function showData(tabData) {
    if (tabData && tabData.data && (tabData.code==0)) {
        var total = tabData.data.total;
        var rows = tabData.data.rows;
        var fields = tabData.data.fields;
        var match_num = tabData.data.match_num;
        var loss = tabData.data.loss;
        var loss_num = tabData.data.loss_num;
        $("#nl_search_query").val(tabData.data.query);

        $("#batchSuccessNum").html(match_num ? match_num : 0)
        $("#batchFailNum").html(loss_num ? loss_num : 0)

        $("#headeTabList").html("");
        for(var j=0; j< fields.length; j++){
            $("#headeTabList").append("<th width='5%' align='left' data-val='"+fields[j].name+"'>"+fields[j].label+"</th>");
        }

        $("#excelList").html("");
        if (rows && total > 0) {
            for (var i = 0; i < rows.length; i++) {
                var excelRow = $("<tr data-code='" + rows[i]._id + "'  class='trSuccess'></tr>");
                for(var j=0; j< fields.length; j++){
                    var fieldValue = rows[i][fields[j].name];
                    excelRow.append("<td>" + ( fieldValue ? fieldValue : "--") + "</td>");
                }
                $("#excelList").append(excelRow);
            }
        }
        if (loss && loss.length > 0) {
            for (var i = 0; i < loss.length; i++) {
                var corp_name = loss[i] ? loss[i] : "--";
                $("#excelList").append('<tr data-name="' + corp_name + '" class="trFail"><td class="color-miss">' + corp_name + '</td><td class="color-miss" colspan="'+ (fields.length - 1) +'">匹配失败</td></tr>')
            }
        }
    }
}