/**
 * 动作分为几种：
 *  - 点击(进详情页，展开详情，收藏、监控、下载，筛选，删除)
 *  - 搜索（预搜索、联想搜索、历史搜索、搜索、搜索条件变更、加载新一页）
 *  - 加载页面（企业、人物、新闻、集团系）
 * 
 * tip:
 *  - 注意清空缓存值以及当前页值
 */

$(document).on("click", ".buryClickCenter", function() {
    try{
        ClickCenter.funGroup(this);
    }catch (error){
		console.log(error);
    }
});

var buryStorageParam = {
    // 埋点需要的参数
    clickNum : null, // 点击序号
    opId : null, // 点击的id
    fromModule : null, // 来源模块
    funcType : null, // 埋点类型
    inputItem : null, // 用户输入值
    fromPageUId : null, // 页面的唯一id
    opEntity : null, // 埋点实体
    fromField : null, //来源字段
}

var ClickCenter={
    // 加载页面
    regexPage:/[http|https]:\/\/[^/]+\/[^/]+\/([\S]+)\.html/,
    loadingPageHtml : location.href.match(regexPage)?location.href.match(regexPage)[1].split('/'):null,
    loadingPage : loadingPageHtml?loadingPageHtml[loadingPageHtml.length-1].toLowerCase():null,

    init : function(){
        // 进行初始加载埋点使用
        // 主要是详情页加载埋点的
        // TODO: 在缓存中写入当前页面的信息, 但是localstorge记录会有问题
        //       - 考虑放在变量中进行存储
        //       - 或者每次动作的时候将信息放到localstorge中，在采集完之后进行清空

        // 清空埋点信息
        ClickCenter.clearnParam();

        // ClickCenter[ClickCenter.loadingPage]();
        switch(ClickCenter.loadingPage){
            case 'searchhome'://测试
                ClickCenter.searchpolicy();
                break;
            case 'policydetail'://政策法规详情
                ClickCenter.policydetail();
                break;
            case 'group':// 集团系详情
                ClickCenter.group();
                break;
            case 'showitemdetail'://垂直信息详情页
            case 'searchotherdetail': //这里的页面是和showitemdetail展示一样，后面进行页面合并
                ClickCenter.showitemdetail();
                break;
            case 'biddetail': //招投标详情
                ClickCenter.biddetail();
                break;
            case 'searchgroupdepartment': //集团系搜索详情
                ClickCenter.searchgroupdepartment();
                break;
            default:
                // console.log('loading '+loadingPage);
                break;
        }
    },

    funGroup : function(target){
        /**
         * 根据所在页面不同采用不同的函数
         */
        // ClickCenter[ClickCenter.loadingPage]();
        switch(ClickCenter.loadingPage){
            case 'searchpolicy': // 政策法规搜索页
                ClickCenter.searchpolicy(target);
                break;
            case 'policydetail': // 政策法规详情页
                ClickCenter.policydetail(target);
                break;
            case 'searchgroupdepartment': // 集团系搜索页
                ClickCenter.searchgroupdepartment(target);
                break;
            case 'group': // 集团系搜索页
                ClickCenter.group(target);
                break;
            case 'searchhomelist':// 主搜索结果页
                ClickCenter.searchhomelist(target);
                break;
            case 'searchalonelist':// 单向搜索
                ClickCenter.searchalonelist(target);
                break;
            case 'company'://企业详情页--这里很多操作
                ClickCenter.company(target);
                break;
        }
    },

    cleanlocalStorage : function(){
        // 清除缓存中的埋点信息
        // console.log(window.localStorage);
        window.localStorage.buryToNeed = "";
    },

    clearnParam : function(){
        // 将埋点参数进行清空
        for (item in buryStorageParam){
            buryStorageParam[item] = null;
        }
    },

    decoderUrlMsg : function(msg){
        // 对url中的参数进行解析(x1=1&x2=2&.....)
        var msgArr = msg.split('&');
        var msgDic = {}
        for(var i in msgArr){
            var k_v = msgArr[i].split('=');
            if(k_v.length == 2){
                msgDic[k_v[0].toLowerCase()] = k_v[1];
            }
        }
        return msgDic;
    },

    writeStorage : function(){
        // 将参数写到Storage中
        // 从storoage中获取参数
        var storageJson = window.localStorage.buryToNeed ? JSON.parse(window.localStorage.buryToNeed) : null;
        
        if(storageJson != null){
            for(item in buryStorageParam){
                storageJson[item] = storageJson[item] ? storageJson[item] : buryStorageParam[item];
            }
            window.localStorage.buryToNeed = JSON.stringify(storageJson);
        }else{
            window.localStorage.buryToNeed = JSON.stringify(buryStorageParam);
        }
        
    },

    toBury : function(activeType, opEntity, opType){
        // 当window.localStorage.buryToNeed为""时，为刷新当前页面情况，或者从其他系统模块跳转进来的
        var otherParam = window.localStorage.buryToNeed ? JSON.parse(window.localStorage.buryToNeed) : {funcType:opType};
        buryFCode.bury(activeType,opEntity,otherParam,opType);
        ClickCenter.cleanlocalStorage();
    },

    searchpolicy:function(target){
        /**
         * 政策法规查询页操作
         * 这里是：
         *  - 在点击之后，将值放入缓存中，待进入详情页之后进行后续操作
         */

        if ($(target).parents().find('.search-policy-list').length > 0){//搜索列表-跳转>详情页
            buryStorageParam.opEntity =  '政策法规';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem = searchParam && searchParam.querytext ? searchParam.querytext : null; // searchParam 从searchPolicy中的请求参数得到
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }
    },
    policydetail : function(target){
        /**
         * 这里有两个操作：(通过对target是否有值进行判断)
         *  - 加载详情页
         *  - 在详情页中点击跳转详情页
         */
        if(target){
            // 这里是点击操作
            if ($(target).parents().find('#relation-policy').length > 0){//同地区政策-跳转>详情页
                buryStorageParam.opEntity =  '政策法规';
                buryStorageParam.opId = $(target).attr('data-detailid');
                buryStorageParam.fromModule = '同地区政策';
                buryStorageParam.funcType = 'detailView';
                buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
    
                ClickCenter.writeStorage(); // 将信息写入到缓存中
            }
        }else{
            // 这里是加载操作
            // 进行埋点
            ClickCenter.toBury('itemDetailView', '政策法规', 'detailView');
        }
    },

    searchgroupdepartment:function(target){
        /**
         * 集团系查询页操作
         * 这里有：
         *  - 点击搜索结果进入详情
         *  - 点击进入企业
         *  - 点击预搜索进详情
         */

        if(target){
            // 这里是点击操作
            if($(target).attr('class').indexOf('pre-search-group') != -1){//点击预搜索
                buryStorageParam.opEntity =  '集团系';
                buryStorageParam.clickNum = $(target).index() + 1 + '';
                buryStorageParam.opId = $(target).attr('data-detailid');
                buryStorageParam.fromModule = '预搜索';
                buryStorageParam.funcType = 'detailView';
                buryStorageParam.inputItem = $('.txt_search').val() ? $('.txt_search').val() : null; 
                buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
                buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchParam); // 将搜索条件变为jsonStr

                ClickCenter.writeStorage(); // 将信息写入到缓存中
            }else if ($(target).attr('class').indexOf('div_Card') != -1){//搜索列表-跳转>详情页
                buryStorageParam.opEntity =  '集团系';
                buryStorageParam.clickNum = $(target).index() + 1 + '';
                buryStorageParam.opId = $(target).attr('data-detailid');
                buryStorageParam.fromModule = '搜索结果';
                buryStorageParam.funcType = 'detailView';
                buryStorageParam.inputItem = searchParam && searchParam.querytext ? searchParam.querytext : null; // searchParam 从searchPolicy中的请求参数得到
                buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
                buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchParam); // 将搜索条件变为jsonStr

                ClickCenter.writeStorage(); // 将信息写入到缓存中
            }
        }else{
            ClickCenter.toBury('AD', '集团系', 'searchAD');
        }
    },

    group : function(target){
        /**
         * 集团系详情
         * 这里比较复杂，涉及到的地方很多
         * TODO 集团系中的跳转
         */
        if(target){
            // 先进行判断点击的模块类型,目前仅处理表格内点击的
            var clickModel = $(target).parents('table').attr('id'); //有值代表是通常的表格模块
            var clickfiledIdx = $(target).parent().index(); // 获取点的是什么字段下的数据
            var filesName = $($(target).parents('table').find('th')[clickfiledIdx]).html(); // 获取字段名

            if (clickModel != undefined){
                // 代表点击的是表格中的数据
                switch(clickModel){
                    case 'tabProductInfo': // 产品
                        buryStorageParam.opEntity =  '产品';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '产品信息';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                    case 'tabbidding': // 招投标
                        buryStorageParam.opEntity =  '招投标';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '招投标';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                    case 'tabPatent': // 专利
                        buryStorageParam.opEntity =  '专利';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '专利';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                }
            }

        }else{
            // 这里是加载操作
            // 进行埋点
            setTimeout(function() {
                ClickCenter.toBury('itemDetailView', '集团系', 'detailView');
            },2000)
            
        }
    },

    searchhomelist : function(target){
        /**
         * 主搜索结果页(企业、人物、风险、知识产权、招聘、新闻等)
         * 处理跳转单项详情
         */

        // 处理风险
        if($(target).parent().attr('id') == 'div_DataListRisk'){//风险搜索结果
            buryStorageParam.opEntity =  '风险';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem =searchRiskParam && searchRiskParam.key ? searchRiskParam.key : null ;
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchRiskParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }else if($(target).parent().attr('id') == 'div_DataListIntellectual'){//知识产权搜索
            buryStorageParam.opEntity =  '知识产权';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem =searchIntellectualParam && searchIntellectualParam.key ? searchIntellectualParam.key : null ;
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchIntellectualParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }else if($(target).parent().attr('id') == 'div_DataListJobs'){//招聘搜索
            buryStorageParam.opEntity =  '招聘';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem =searchJobsParam && searchJobsParam.key ? searchJobsParam.key : null ;
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchJobsParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }else if($(target).parent().attr('id') == 'div_DataListProduct'){//招聘搜索
            buryStorageParam.opEntity =  '产品';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem =searchProductParam && searchProductParam.key ? searchProductParam.key : null ;
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchProductParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }else if($(target).parent().attr('id') == 'FocusHistroyRisk' || $(target).parent().attr('id')=='FocusHistroyIntellectual' || $(target).parent().attr('id') == 'FocusHistroyBrand' || $(target).parent().attr('id') ==''){
            // buryStorageParam.opEntity =  '产品';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '最近浏览';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }

    },

    searchalonelist : function(target){
        /**
         * 单项搜索的结果页，不是综合搜索的结果页，这里要注意，要searchhomelist，searchalonelist分别处理
         * - 裁判文书
         */
        // 处理风险
        if($(target).parent().attr('id') == 'div_DataListRisk'){//风险搜索结果
            buryStorageParam.opEntity =  '风险';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem =searchRiskParam && searchRiskParam.key ? searchRiskParam.key : null ;
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchRiskParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }else if($(target).parent().attr('id') == 'div_DataListIntellectual' || $(target).parent().attr('id') == 'div_DataListBrand'){//知识产权搜索
            buryStorageParam.opEntity =  '知识产权';
            buryStorageParam.clickNum = $(target).index() + 1 + '';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '搜索结果';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.inputItem =searchIntellectualParam && searchIntellectualParam.key ? searchIntellectualParam.key : null ;
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId
            buryStorageParam.screenItem = buryFCode.paramBuryJson('itemFilter', searchIntellectualParam); // 将搜索条件变为jsonStr

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }else if($(target).parent().attr('id') == 'FocusHistroyRisk' || $(target).parent().attr('id')=='FocusHistroyIntellectual' || $(target).parent().attr('id') == 'FocusHistroyBrand' || $(target).parent().attr('id') ==''){
            // buryStorageParam.opEntity =  '产品';
            buryStorageParam.opId = $(target).attr('data-detailid');
            buryStorageParam.fromModule = '最近浏览';
            buryStorageParam.funcType = 'detailView';
            buryStorageParam.fromPageUId = loadingUid; // 从buryFCodeCommon 中获得，因为跳转详情页，所以用当前页面id作为采集的来源页面的fromPageUId

            ClickCenter.writeStorage(); // 将信息写入到缓存中
        }

    },

    showitemdetail : function(target){
        /**
         * 单项详情页(裁判文书)
         * 需要通过url中的type区分是什么单项
         */
        var pageType = wind.uri(location.href).query('type') || null;
        switch(pageType){
            case 'judgment'://裁判文书
                buryStorageParam.opEntity =  '裁判文书';
                break;
            case 'openNotice'://开庭公告
                buryStorageParam.opEntity =  '开庭公告';
                break;
            case 'court'://法院公告
                buryStorageParam.opEntity =  '法院公告';
                break;
            case 'dishonest'://失信人
                buryStorageParam.opEntity =  '失信人';
                break;
            case 'executee':// 被执行人
                buryStorageParam.opEntity =  '被执行人';
                break;
            case 'judicial':// 司法拍卖
                buryStorageParam.opEntity =  '司法拍卖';
                break;
            case 'patent':// 专利
                buryStorageParam.opEntity =  '专利';
                break;
            case 'brand':// 商标
                buryStorageParam.opEntity =  '商标';
                break;
            case 'jobs': // 招聘
                buryStorageParam.opEntity =  '招聘';
                break;
            case 'product': //产品
                buryStorageParam.opEntity =  '产品';
                break;
        }

        if(target){
            // 这里是点击操作

        }else{
            // 这里是加载操作
            // 进行埋点
            ClickCenter.toBury('itemDetailView', buryStorageParam.opEntity, 'detailView');
        }

    },

    biddetail : function(target){
        /**
         * 招投标详情
         */
        if(target){
            // 这里是点击操作

        }else{
            // 这里是加载操作
            // 进行埋点
            ClickCenter.toBury('itemDetailView', buryStorageParam.opEntity, 'detailView');
        }
    },

    company :function(target){
        /**
         *  企业详情页中的操作
         *  就不用对加载情况进行处理了，只需要对其中的点击操作进行处理
         *  目前仅处理表格内点击的
         */
        if(target){
            // 先进行判断点击的模块类型,目前仅处理表格内点击的
            var clickModel = $(target).parents('table').attr('id'); //有值代表是通常的表格模块
            var clickfiledIdx = $(target).parent().index(); // 获取点的是什么字段下的数据
            var filesName = $($(target).parents('table').find('th')[clickfiledIdx]).html(); // 获取字段名
            
            if (clickModel != undefined){
                // 代表点击的是表格中的数据
                switch(clickModel){
                    case 'tabJudgeinfo': // 裁判文书-跳转>裁判文书详情
                    case 'tabHisJudgeinfo': // 历史裁判文书
                        // 这里有两个跳转--案件标题、案号
                        buryStorageParam.opEntity =  '裁判文书';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '裁判文书';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                    case 'tabPatent': // 专利
                        // 这里有两个跳转--案件标题、案号
                        buryStorageParam.opEntity =  '专利';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '专利';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                    case 'tabcompanybulist': //企业业务--产品信息
                        var selModel = $(target).parents('#showComBuInfo').find('.widget-header .wi-secondary-color').html();
                        selModel = selModel.replace(/\(|\)|\d/g,'');
                        var selEntity = null;
                        switch(selModel){
                            case '产品信息':
                                selEntity = '产品';
                            break;
                        }
                        buryStorageParam.opEntity =  selEntity;
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '企业业务';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                    case 'tabbidding': // 招投标
                        buryStorageParam.opEntity =  '招投标';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['detailid'] || null;
                        buryStorageParam.fromModule = '招投标';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                    case 'tabshowGroupSystem': // 集团系
                        buryStorageParam.opEntity =  '集团系';
                        buryStorageParam.opId = ClickCenter.decoderUrlMsg($(target).attr('href').split('?')[1])['groupid'] || null;
                        buryStorageParam.fromModule = '集团系';
                        buryStorageParam.fromField = filesName;
                        buryStorageParam.funcType = 'detailView';
                        buryStorageParam.fromPageUId = loadingUid;
                        ClickCenter.writeStorage(); // 将信息写入到缓存中
                        break;
                }
            }
            
            // console.log(target);

        }

    }

    
}

try{
    ClickCenter.init();
}catch (error){
    console.log(error);
}
