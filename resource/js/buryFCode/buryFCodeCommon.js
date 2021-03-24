/*
 * @Author: yxmo 
 * @Date: 2019-12-11 13:22:06 
 * @Last Modified by: yxmo
 * @Last Modified time: 2019-12-11 13:22:06
 * @Desc: 放置在每个html页面，用来获取用户的行为埋点数据
 */
//导入两个映射字典
// $(document.body).append('<script src="../resource/js/buryFCode/funcMapping.js?v=20191220"><\/script>');
// $(document.body).append('<script src="../resource/js/buryFCode/itemMapping.js?v=20191220"><\/script>');
var buryItemMapping = {
	mappingProjCode:{
		'preSearchCk' : '922602100634',
		'searchListCk' : '922602100635',
		'hotSearchCk' : '922602100636',
		'histroySearchCk' : '922602100637', 
		'searchCk' : '922602100638',
		
		'listQy' : '922602100639',
		'highSearchQy' : '922602100640',
		'batchLoadQy' : '922602100641',
		
		'stateCondi' : '922602100642',
		'kindCondi' : '922602100643',
		'proCondi' : '922602100644',
		'unitCondi' : '922602100645',
		'roleCondi' : '922602100646',
		'timeCondi' : '922602100647',
		'graphyCondi' : '922602100648',
		
		'detailView' : '922602100649',
		
		'singleEx' : '922602100650',
		'batchEx' : '922602100651',
		'queryEx' : '922602100652',
		'reportEx' : '922602100653',
		'picEx' : '922602100654',
		'highsearchEx' : '922602100655',
		
		'hisSearchDel' : '922602100656',
		'hisViewDel' : '922602100657',
		'collectDel' : '922602100658',
		'riskDel' : '922602100659',
		'collect' : '922602100660',
		'risk' : '922602100661',
		'queryCom' : '922602100662', 
		'queryPon' : '922602100663',
		'querycComPon' : '922602100664', 

		'queryComCom' : '922602100665',//查企业关系
		'queryStock' : '922602100665',//查股权

		'queryPonPon' : '922602100666',
		'otherFunc' : '922602100667',
		
		'loading&企业' : '922602100382',//企业详情加载
		'click&新闻' : '922602100707',//企业新闻点击
		'searchAD&集团系' : '922602100714', // 集团系搜索页面加载
		'searchAD&超级名单' : '922602100712', // 超级名单搜索页加载
		'searchAD&裁判文书' : '922602100715', // 裁判文书搜索页加载
		'searchAD&专利' : '922602100716', // 专利搜索页加载
		'detailViewAD&股权穿透图' : '922602100371', // 股权穿透图加载
		'funClick&..' : '',//各项功能点击，用于功能点点击,等确定了再说
	},
	mappingEntity : {
		/* 主体、二级属性、属性、字段、模块、筛选条件 */
		'histroySearch' : '历史搜索',
		'hotSearchCk' : '热门搜索',
		'searchList' : '搜索结果',
		'preSearch' : '预搜索',
		'searchhome' : '搜索首页',
		'searchhomelist' : '搜索结果页',
		'specialapplist' : '特色企业库列表页',
		'company' : '企业',
		'companyglobal' : '全球企业',
		'getclassifycompany' : '企业',
		'getclassifyperson' : '人物',
		'person' : '人物',
		'company&person' : '企业&人物',
		'showCompanyInfo' : '工商信息',
		'showShareholder' : '股东信息',
		'getShareAndInvest' : '股权穿透图',
		'showFinalBeneficiary' : '最终受益人',
		'showControllerCompany' : '控股企业',
		'showDirectInvestment' : '对外投资',
		'showMainMemberInfo' : '主要人员',
		'showCompanyBranchInfo' : '分支机构',
		'showCompanyChange' : '工商变更',
		'getrelation' : '疑似关系图',
		'getcomparable' : '竞争对手',
		'showYearReport' : '企业年报',
		'showHeadOffice' : '总公司',
		'showShares' : '发行股票',
		'showBond' : '债券信息',
		'showPVEC' : 'PEVC',
		'pvecOut' : 'PEVC退出',
		'showMerge' : '并购信息',
		'showguarantee' : '担保信息',
		'showGrantcredit' : '银行授信',
		'showDeclarcompany' : '待上市信息',
		'showChattelmortgage' : '动产抵押',
		'showPledgedstock' : '股权出质',
		'governmentSupport01' : '政府补贴',
		'absinfo' : 'ABS信息',
		'getlandmortgage' : '土地抵押',
		'showStockMortgage' : '股票质押',
		'showIntellectualPropertyRights' : '知识产权出质',
		'showInvestmentAgency' : '投资机构',
		'showInvestmentEvent' : '投资事件',
		'FinancialData' : '财务报表',
		'Financeanalysis' : '财务指标',
		'businessScope' : '主营构成',
		'governmentSupport02' : '政府项目',
		'products' : '产品信息',
		'biddingInfo' : '招投标',
		'gettaxcredit' : '税务信息',
		'listInformation' : '上榜信息',
		'jobs' : '招聘',
		'getpermission' : '行政许可',
		'employeeSituation' : '员工情况',
		'talents' : '人才指数',
		'newDepartment' : '新增部门',
		'researchReport01' : '公司研报',
		'getdoublerandom' : '双随机抽查',
		'getvoidagestatement' : '作废声明',
		'getmultiplecertificate' : '多证合一',
		'getteleLics' : '电信许可',
		'getimpexp' : '进出口信用',
		'getfundpe' : '私募基金',
		'showLandInfo' : '土地信息',
		'showComBuInfo' : '企业业务',
		'showCustomersSup' : '客户和供应商',
		'getcourtdecision' : '裁判文书',
		'getcourtannouncement' : '法院公告',
		'getcourtopenannouncement' : '开庭公告',
		'getdishonesty' : '失信信息',
		'getpersonenforced' : '被执行人',
		'getjudicialhelp' : '司法协助',
		'getpublicnotice' : '公示催告',
		'showDeliveryAnnouncement' : '送达公告',
		'getfilinginfo' : '立案信息',
		'getoperationexception' : '经营异常',
		'getadministrativepenaltyBu' : '行政处罚[工商局]',
		'getadministrativepenalty' : '行政处罚',
		'getinspection' : '抽查检查',
		'getenvpenalties' : '环保处罚',
		'gettaxillegal' : '税收违法',
		'getjudicialsale' : '司法拍卖',
		'getillegal' : '严重违法',
		'getowingtax' : '欠税信息',
		'getsimplecancel' : '简易注销',
		'getclearinfo' : '清算信息',
		'getbrand' : '商标',
		'getpatent' : '专利',
		'getproductioncopyright' : '作品著作权',
		'getsoftwarecopyright' : '软件著作权',
		'getauthentication' : '资质认证',
		'getdomainname' : '网站备案',
		'getweixin' : '微信公众号',
		'getweibo' : '微博账号',
		'gettoutiao' : '头条号',
		'historycompany' : '历史工商信息',
		'historylegalperson' : '历史法人和高管',
		'historyshareholder' : '历史股东信息',
		'historyinvest' : '历史对外投资',
		'historypersonenforced' : '历史被执行人',
		'historypermission' : '历史行政许可',
		'historydomainname' : '历史网站备案',
		'historyoperationexception' : '历史经营异常',
		'historydishonesty' : '历史失信信息',
		'historycourtannouncement' : '历史法院公告',
		'historycourtdecision' : '历史裁判文书',
		'historycourtopenannouncement' : '历史开庭公告',
		'historyadministrativepenaltyBu' : '历史行政处罚',
		'historyshowPledgedstock' : '历史股权出质',
		'historyshowChattelmortgage' : '历史动产抵押',
		'shareholder' : '股东信息',
		'benefit' : '最终受益人',
		'ctrl' : '控股企业',
		'invest' : '对外投资',
		'member' : '主要人员',
		'branch' : '分支机构',
		'bidding' : '招投标',
		'judgeinfo' : '裁判文书',
		'court' : '法院公告',
		'trial' : '开庭公告',
		'mistrust' : '失信信息',
		'execution' : '被执行人',
		'punish' : '行政处罚',
		'inspection' : '抽查检查',
		'trademark' : '商标',
		'patent' : '专利',
		'production' : '作品著作权',
		'software' : '软件著作权',
		'hismanager' : '历史法人和高管',
		'hisshareholder' : '历史股东信息',
		'hisinvest' : '历史对外投资',
		'hisexecution' : '历史被执行人',
		'courtannouncementSelVal' : '法院公告案由',
		'courtopenannouncementSelVal' : '开庭公告案由',
		'brandSelVal' : '商标状态',
		'productioncopyrightSelVal' : '作品著作权类型',
		'courtdecisionResultVal' : '裁判文书判决结果',
		'courtdecisionCauseVal' : '裁判文书案由',
		'courtTypeVal' : '裁判文书案件类型',
		'authenticationSelVal' : '资质认证类型',
		'owingtaxSelVal' : '欠税税种',
		'judicialsaleSelVal' : '司法拍卖状态',
		'investStatusVal' : '直接对外投资状态',
		'investRatioVal' : '直接对外投资持股比例',
		'biddingVal' : '招投标角色',
		'supplierVal' : '供应商报告期',
		'customerSupVal' : '客户报告期',
		'hisCourtannouncementSelVal' : '历史法院公告案由',
		'hisCourtdecisionResultVal' : '历史裁判文书判决结果',
		'hisCourtdecisionCauseVal' : '历史裁判文书案由',
		'hisCourtopenannouncementSelVal' : '历史开庭公告案由',
		'hisViewCom' : '历史浏览企业',
		'hotViewCom' : '热门浏览企业',
		'hisViewPon' : '历史浏览人物',
		'hotViewPon' : '热门浏览人物',
		'getcorpcustomer' : '客户',
		'getcorpsupplier' : '供应商',
		'getsharedbondsinfo' : '发行债券',
		'getratingreportinfo' : '主体评级',
		'getlandanns' : '地块公示',
		'getlandpurchase' : '购地信息',
		'getlandtrans' : '土地转让',
		'getprojectsinfo' : '项目信息',
		'gettradelbls' : '品牌信息',
		'getpersonpledgor' : '出质人',
		'getpersonpledgee' : '质权人',
		'getstockpledgers' : '出质人',
		'getstockpledgees' : '质权人',
		'getstockplexes' : '出质标的',
		
		'external_1400' : 'F9',//外部来源
		'external_142' : '万得搜索',
		'external_1851' : '中国并购库',
		'external_1852' : '中国PEVC库',
		'external_7003' : '企业排行榜',
		'external_1815' : '投行业务排行榜',
		'external_2804' : '基金公司',
		'external_2805' : '基金机构研究',
		'external_2958' : '私募基金大全',
		'external_2957' : '券商资管大全',
		'external_2955' : '银行理财大全',
		'external_2974' : '保险产品大全',
		'external_5102' : '企业风险监控',//没有按照规定来
		'windPCBrowser' : '企业风险监控',
		'external_1802' : '沪深一级市场',
		'external_1804' : '沪深股票公司研究',
		'external_1808' : '沪深股票机构研究',//外部来源
		
		'batchQuery' : '批量查询',
		'news' : '新闻',
		'advicelisttag' :　'新闻',
		'searchRelation' : '查关系',
		'searchCompany' : '查企业',
		'searchPerson' : '查人物',
		'mergerExpress' : '中国并购库',
		'PEVCExpress' : '中国PEVC库',
		'IPOCalendar' : '新股中心',
		'ERDBServer' : '企业排行榜',
		'industryReport' : '行业研报',
		'industrydata' : '行业数据',
		'allAbs' : '资产支持证券',
		'showCoreTeam' :　'核心团队',
		'firstTab' : '一级Tab',
		'p2pAll' : 'p2p大全',
		//'getparkcorps' : '园区大全',
		'getpersonalposition' : '人物在外任职',
		'getpersonalshareholder' : '人物对外投资',
		'getpersonallegalrep' : '人物担任法人',
		'getallcompany' : '人物全部企业',
		'getrealctrl' : '人物实际控制',
		'showPledgedstock02' : '股票质押',
		'getpersonstockpledgers' : '出质人',
		'getpersonstockpledgees' : '质权人',
		'freezestock' : '人物股权冻结',
		'gethispersonallegalrep' : '人物历史担任法人',
		'gethispersonalshareholder' : '人物历史对外投资',
		'gethispersonalposition' : '人物历史在外任职',
		'hislimitConsumption' : '人物历史限制高消费',
		'showHisPledgedstock' : '人物历史股权出质',
		'gethistorypersonpledgor' : '出质人',
		'gethistorypersonpledgee' : '质权人',
		'hisfreezestock' : '人物历史股权冻结',
		'showSearchProject' : '项目搜索',
		'showSearchMake' : '品牌搜索',
		'requestProductHisList' : '最近浏览产品',
		'showSearchBrand' : '商标搜索',
		'showSearchPatent' : '专利搜索',
		'showSearchSoft' : '软件著作权搜索',
		'showSearchWork' : '作品著作权搜索',
		'finalcase' : '终本案件',
		'getendcase' : '终本案件',
		'showBuildOrder' : '建筑资质',
		'showGroupSystem' : '集团系',
		'getcorpconsumption': '限制高消费',
		'getevaluation': '询价评估',
		'showBankruptcy' : '破产重整',
		'intellectual_property_merge_search' : '知识产权',
		'patent_search' : '专利',
		'trademark_search' : '商标',
		'production_search' : '作品著作权',
		'software_search' : '软件著作权',
		'risk_merge_search' : '风险',
		'judgeinfo_search' : '裁判文书',
		'court_session_announcement_search' : '开庭公告',
		'court_announcement_search' : '法院公告',
		'discredicted_person_search' : '失信人',
		'judicialsale_search' : '司法拍卖',
		'concerned_person_search' : '被执行人',
		'getprojectnamesearch' : '项目',
		'getproductsearch' : '产品',
		'getbrandnamesearch' : '品牌',
		'getrecruitmentsearch' : '招聘',
		'golbalCom' : '全球企业',
		'riskOverview' : '企业风控',
		'toolBar' : '工具栏',
		'PEVCExpress' : '投资机构',
		'500Companys' : '500强企业',
		'publicFudn' : '公募基金',
		'privateFudn' : '私募基金',
		'PEVCMoney' : '融资事件',
		'snt' : '科创板',
		'tnb' : '新三板',
		'ipo' : '上市企业',
		'debt' : '发债企业',
		'new_fourth_board' : '新四板',
		'getP2P' : 'P2P大全',
		'report' : '企业报告',
		'comperReport' : '竞争情报',
		'netApp' : '移动互联网',
		'medicine' : '医药行业',
		'building' : '建筑材料',
		'motherbaby' : '母婴产品',
		'food' : '烟酒食品',
		'aiHome' : '智能家居',
		'newRetail' : '新零售',
		'Cosmetics' : '化妆品',
		'companyStatistics' : '企业全景',
		'appgetrelatedparty' : '业务关联方',
		'getpersonsecuritiesdishonestinfo' : '证券市场失信',
		'getpersonedubackground' : '教育背景',
		'getpersonworkexperience' : '工作履历',
		'getpersonawardinfo' : '获奖信息',
		'getpersonsecuritiesdishonestinfodetail' : '证券市场失信',
		'getfinanciallicence' : '金融许可',
		'parkAll' : '园区大全',
		'navSearch' : '菜单搜索',
		'getmarketdiscredited' : '证券市场失信',
		'mapQuery' : '地图查询',
		'employeeSituationData' : '员工情况',
		'maincompany' : '主体公司',
		'membercompany' : '成员公司',
		'projectinfo' : '项目信息',
		'brandinfo' : '品牌信息',
		'productinfo' : '产品信息',
		'tendering' : '招投标',
		'recruited' : '招聘',
		'mistrust' : '失信信息',
		'execution' : '被执行人',
		'grouptrademark' : '商标',
		'grouppatent' : '专利',
		'superadvanced' : '超级名单',
		'policy' : '政策法规',
		'group' : '集团系',
	}
}

var unifyVar={
	/* 统一变量 */
	opActive : '',//动作类型
	opSystem : '',//操作平台
	currentPage : '',//当前页面
	currentId : '',//当前页面实体id
	fromPage : '',//来源页面
	fromId : ''//来源页面实体id	
}

var diffVar={
	/* 差别变量配置 */
	funcType : true,//功能大类	=》to check
	inputItem : true,//输入项
 	screenItem : true,//筛选项
 	strategy : true,//策略
 	opId : true,//操作项id
 	clickNum : true,//点击项序号
 	screenCondition : true,//筛选条件==>>to mapping
 	entityAttribute : true,//实体属性==>>to mapping
 	fromField : true,//来源字段==>>to mapping
 	fromModule : true,//来源模块==>>to mapping
 	opEntity: true,//实体==>>to mapping ftype+实体+实体属性+来源page+来源模块+来源字段+"筛选条件（其他）"
 	queryStringParams: true,//搜索查询参数==>>存储json
 	pageUId : true,
 	fromPageUId: true,
}
var source = true;//产品需要知道的来源：中文===>>>to must do 

/* 全局变量 */
var regexPage = /[http|https]:\/\/[^/]+\/[^/]+\/([\S]+)\.html/;
var loadingPageHtml = location.href.match(regexPage)?location.href.match(regexPage)[1].split('/'):null;
var loadingPage = loadingPageHtml?loadingPageHtml[loadingPageHtml.length-1].toLowerCase():null;

/* 设置加载页面 */
var toLoadPage = ['company', 'person', 'searchhome','companyglobal'];

$(document).on("click", ".buryClick", function() {
	//bury
	var $this = $(this);
    var activeType = $this.attr('data-buryOpType');
	var opEntity = $this.attr('data-buryEntity');
	var opType = $this.attr('data-buryfuncType');
	var otherParam = buryFCode.paramBuryJson('click', $this);
//	console.log(otherParam);
	buryFCode.bury(activeType,opEntity,otherParam,opType);
});

/* 产生uuid */
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = Math.random() * 16 | 0,
	        v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	});
}

var loadingUid = uuidv4();

/* 设置通用函数 */
var buryFCode={
	buryFunIn:function(opType, fType, inEntity, opParam){
		try{
			//param: opType--动作类型，fType--功能类型（二级功能分类），inEntity--实体，opParam--其他非url参数
			var finallVar = JSON.parse(JSON.stringify(unifyVar));//最终的参数,深拷贝	
			var paramHrefDic = buryFCode.getUrlParam('local');//来源参数字典
			finallVar = buryFCode.getUnifyVar(finallVar);//获取统一变量
			finallVar.opActive = opType?opType:null;//获取动作
			finallVar.opEntity = buryFCode.getEntity(inEntity)? buryFCode.getEntity(inEntity) : inEntity;//获取动作的主体
			finallVar.funcType = fType?fType:null;//获取功能类型
			finallVar.pageUId = loadingUid;
			finallVar = buryFCode.getParam(diffVar,finallVar,opParam);//这个应该放在前面，可以优先外部的值覆盖url的参数
			if(opType != 'view' && opType != 'itemDetailView'){
				finallVar = buryFCode.getParam(diffVar,finallVar,paramHrefDic);//执行加载页面的操作;根据功能解析url参数
			}
			
			var fCode = buryItemMapping.mappingProjCode[opType+'&'+finallVar.opEntity];//映射为功能点,不记录local
			var projFCode = buryItemMapping.mappingProjCode[finallVar.funcType];//映射为项目需要的功能点与hbase
			var itemSource = buryFCode.getSouceModule(finallVar.fromPage, finallVar.fromModule);//用来获得动作来源;
		
			var functionParam = '';//forhbase
			var localResult = buryFCode.getlocalParam(finallVar);//forlocal
			var tolocalParamStr = localResult[0];//forlocal,需要拼一下
			var tolocalParamDic = localResult[1];//forlocal
			if(opType == 'loading'){
				finallVar['source'] = itemSource;//这个在最后加，存储在hbase中
			}
			for (var ii in finallVar){//存储hbase的预处理
				functionParam += ii + '=' + finallVar[ii] + ',';
			}
			var other =  {'type': 'S23','functionParams' : functionParam};
			// console.log('projFCode: ' + projFCode);
			// console.log('fCode: ' +fCode);
			// console.log(finallVar);
			buryFCode.buryFun(fCode, other, projFCode, functionParam, tolocalParamDic,finallVar);//进行ajax传输后台,to do => 需要进行数据准备
			return null;
		}catch (e) {}
	},
	buryFunJumpOther:function(opType, fType, inEntity, opParam){
		try{
			//用于在跳转其他终端产品时记录
			//param: opType--动作类型，fType--功能类型（二级功能分类），inEntity--实体，opParam--其他非url参数
			var finallVar = JSON.parse(JSON.stringify(unifyVar));//最终的参数,深拷贝	
	//		finallVar = buryFCode.getUnifyVar(finallVar);//获取统一变量，获取当前页面以及来源页面，不适合
			finallVar.opActive = 'clickJump';//获取动作
			finallVar.opEntity = buryItemMapping.mappingEntity[inEntity];//获取动作的主体
			finallVar.funcType = fType?fType:null;//获取功能类型
			finallVar = buryFCode.getParam(diffVar,finallVar,opParam);//这个应该放在前面，可以优先外部的值覆盖url的参数
			
			//对来源页面以及
			finallVar.opSystem = is_terminal?'windClient':'web';
			if(inEntity=='company' || inEntity=='person'){
				finallVar.currentPage = inEntity;//获取来源页面
			}
			
			finallVar.currentId = opParam.opId?opParam.opId:null;//获取来源页面id
			finallVar.fromPage = opParam.fromPage?opParam.fromPage:null;//获取应该去往页面类型
			finallVar.fromId = opParam.fromId?opParam.fromId:null;//获取来源页面的id
			finallVar.fromPageUId = opParam.fromPageUId?opParam.fromPageUId:null;//获取来源页面的id
			
			var fCode = buryItemMapping.mappingProjCode[opType+'&'+opEntity];//映射为功能点
			var projFCode = buryItemMapping.mappingProjCode[finallVar.funcType];//映射为项目需要的功能点与hbase
			var itemSource = buryFCode.getSouceModule(finallVar.fromPage, finallVar.fromModule);//用来获得动作来源;
		
			var functionParam = '';//forhbase
			var localResult = buryFCode.getlocalParam(finallVar);//forlocal
			var tolocalParamStr = localResult[0];//forlocal,需要拼一下
			var tolocalParamDic = localResult[1];//forlocal
			if(opType == 'loading'){
				finallVar['source'] = itemSource;//这个在最后加，存储在hbase中
			}
			for (var ii in finallVar){//存储hbase的预处理
				functionParam += ii + '=' + finallVar[ii] + ',';
			}
			var other =  {'type': 'S23','functionParams' : functionParam};
			buryFCode.buryFun(fCode, other, projFCode, functionParam, tolocalParamDic,finallVar);//进行ajax传输后台,to do => 需要进行数据准备
			return null;
		}catch (e) {}
	},
	getUnifyVar:function(finallVar){
		//获取统一变量：操作平台、当前页面url、当前页面实体id、来源页面url、来源页面实体id
		var pageHref = location.href;//获取当前url
		var pageRef = document.referrer;//获取来源url
		var paramHrefDic = buryFCode.getUrlParam('local');//当前参数字典
		var paramRefDic = buryFCode.getUrlParam('ref');//来源参数字典
		
		finallVar.opSystem = is_terminal?'windClient':'web';;//操统=》TO DO
//		finallVar.funcType = paramHrefDic['fromModule'];//需要去掉
		finallVar.currentPage = buryFCode.getUrlPage(pageHref);//当前页面
		if(pageRef){ //来源页面，可能有空，有两种情况会产生这种情况：来源其他终端模块跳转、首页第一次打开,用户在url中进行了修改
			finallVar.fromPage = buryFCode.getUrlPage(pageRef);
			finallVar.fromId = buryFCode.getCodeId(paramRefDic);//来源页面id
		}else if(paramHrefDic['fromPage']){
			finallVar.fromPage = paramHrefDic['fromPage'];
			finallVar.fromId = paramHrefDic['fromId']?paramHrefDic['fromId']:null;
		}else if(paramHrefDic['from']){
			var fromOther = paramHrefDic['from'];
			finallVar.fromPage = fromOther ? fromOther : '其他';//可以判断外部来源
			finallVar.fromId = null;
		}else{
			finallVar.fromPage = null;
			finallVar.fromId = null;
		}
		finallVar.currentId = buryFCode.getCodeId(paramHrefDic);//当前页面id
		
		
		return finallVar;//填充所有统一参数
	},
	
	getEntity:function(inEntity){
		var calEnt = inEntity?inEntity:null;
		if(calEnt != null){
			return calEnt;
		}
		
		var curUrl = buryFCode.getUrlPage(location.href);//先获取当前页面
		var paramDic = buryFCode.getUrlParam('local');//获取当前页面参数
		switch(curUrl){
			case 'showitemdetail':calEnt = paramDic['type'] ? paramDic['type'] : null;break;
			default:break;
		}
		
		/* 获取主体 */
		return calEnt;
	},
	
	getParam:function(fType,finallVar,opParam){
		/* 根据点击的参数进行解析*/
		if(!opParam){
			return finallVar;
		}
		for(var pItem in fType){
			if(fType[pItem] && !finallVar[pItem]){
				if(pItem=='inputItem'){
					finallVar[pItem] = opParam[pItem]?opParam[pItem]:(opParam['keyword']?opParam['keyword']:null);
					continue;
				}
				var opParamValue = opParam[pItem]?opParam[pItem]:null;
				var needMapVar = ['currentPage', 'funcType','opEntity', 'entityAttribute', 'fromPage', 'fromModule', 'fromField', 'screenCondition'];
	    		if(needMapVar.indexOf(pItem) != -1 )
	    		{	    			
					opParamValue = opParamValue?(buryItemMapping.mappingEntity[opParamValue]?buryItemMapping.mappingEntity[opParamValue]:opParamValue):null;
	    		}
				
				finallVar[pItem] = opParamValue;
			}
		}
		return finallVar;
	},
	
	getUrlPage:function(pageUrl){
		//对url进行处理，获取页面page
		if(!pageUrl){
			return null;
		}
		var regexPage = /[http|https]:\/\/[^/]+\/[^/]+\/([\S]+)\.html/;
		var PageHtml = pageUrl.match(regexPage)?pageUrl.match(regexPage)[1].split('/'):null;
		var Page = PageHtml?PageHtml[PageHtml.length-1].toLowerCase():null;
		return Page;
	},
	isEmptyObject: function (obj) {
	  for (var key in obj) {
	    return false;
	  }
	  return true;
	},
	
	getUrlParam: function(pageType) {
		/* 产生参数字典 */
		var paramDic = {}//参数字典
		var paramUri = null;
		
		if(pageType == 'local'){
			paramUri = decodeURI(location.search)?decodeURI(location.search).split('?')[1]:null;
		}else{
			paramUri = decodeURI(document.referrer).split('?')[1]?decodeURI(document.referrer).split('?')[1]:null;
		}
			
		if(paramUri){
			var paramList = paramUri.split('&');//获得各参数
			for(var i=0;i<paramList.length;i++){
				if(!paramList[i] || paramList[i].split('=').length < 2){continue;}
				
				//注意用#分割的情况
				if(paramList[i].indexOf('#') != -1){
					paramDic[paramList[i].split('#')[0].split('=')[0]] = paramList[i].split('#')[0].split('=')[1];
				}else{
					paramDic[paramList[i].split('=')[0]] = paramList[i].split('=')[1];
				}
			}
		}
		
		return paramDic;
    },
    
    getCodeId: function(paramDic) {
        //获取url的companycode,personid,detailId
        var idList=['id', 'companycode', 'detailid', 'groupId', 'detailId'];//拥有的id
        if(!buryFCode.isEmptyObject(paramDic)){
        	for(var i=0;i<idList.length;i++){
        		if(paramDic[idList[i]]){
        			return paramDic[idList[i]];
        		}
        	}
        }
        
        return null;
    },
    
    buryFunHbase:function(code, other){
		//最后通过调用 ajax 将数据异步传输数据到hbase进行记录
		var param = { functionCode: code };
		
        if (other) {
            $.extend(param, other);
        }
        
        if (param.functionCode) {
            try {
                myWfcAjax('burypcfunctioncodeparm', param);
            } catch (e) {}
        }
	},
	buryFunLog:function(code, projstr, projDic, finallVar){
		//最后通过调用 ajax 将数据异步传输数据到后台进行记录
		projDic = JSON.stringify(projDic);
		var param = { functionCode:code , strParam:projstr, dicParam:projDic , funcType:finallVar.funcType, opEntity:finallVar.opEntity};
        if (param.functionCode) {
            try {
				myWfcAjax('burypcfunclocal', param);
            } catch (e) {}
        }
	},
	
	buryFun :function(code, prodm, projFCode, projstr,projDic,finallVar){
		//用于整个提交控制调用
		if(code){
			buryFCode.buryFunHbase(code, prodm);//to productM
		}
		// buryFCode.buryFunHbase(projFCode, prodm);//to projectM
		buryFCode.buryFunLog(projFCode, projstr, projDic, finallVar);//to log
	},
    
    paramBuryJson:function(type, $thisDom){
    	/* 解析模块中的参数  */
    	//linkWithCodeEventHandler
    	//linkWithIdEventHandler
		//showCompanyName
		try{
			var result = null;
			var buryParam = {};
			var pingParam = '';//拼在url后面的
			var pingPageUid = '&fromPageUId='+ buryFCode.getPageUId() +'';
			if(type == 'add'){
				for(var pItem in $thisDom){
					pingParam = pingParam+ '&' + pItem + '=' + $thisDom[pItem];
				}
				result = pingParam + pingPageUid;
				return result;
			}
			if(type == 'itemFilter'){
				for(var pItem in $thisDom){
					if ($thisDom[pItem]){
						buryParam[pItem]=$thisDom[pItem];
					}
				}
				if (!buryFCode.isEmptyObject(buryParam)){
					result = JSON.stringify(buryParam);
				}
				return result;
			}
			if(type == 'jumpf9'){
	//  		$thisDom = "&fromModule=p2p大全&fromField=运营企业&opId=1045998946&fromPage=specialapplist&fromId=";
				var otherParam = {}
				var allItem = $thisDom.split('&');
				for (var i in allItem){
					if(!allItem[i]){continue;}
					var itemKey = allItem[i].split('=')[0];
					var itemValue = allItem[i].split('=')[1];
					if(!itemValue){continue;}
					otherParam[itemKey]=itemValue;
				}
				result = otherParam;
				return result;
			}
			
	//  	buryParam['opEntity'] = $thisDom.attr('data-buryEntity');//实体
			buryParam['inputItem'] = $thisDom.attr('data-buryInput');//输入项
			buryParam['screenItem'] = $thisDom.attr('data-buryScreen');//筛选项
			buryParam['strategy'] = $thisDom.attr('data-buryStrategy');//策略
			buryParam['opId'] = $thisDom.attr('data-buryId');//操作项id
			buryParam['clickNum'] = $thisDom.attr('data-buryNum');//点击项序号
			buryParam['screenCondition'] = $thisDom.attr('data-buryCondition');//筛选条件xx
			buryParam['entityAttribute'] = $thisDom.attr('data-buryAttribute');//实体属性
			buryParam['fromField'] = $thisDom.attr('data-buryField');//来源字段
			buryParam['fromModule'] = $thisDom.attr('data-buryModule');//来源模块
			buryParam['opType'] = $thisDom.attr('data-buryOpType');//动作类型
			buryParam['funcType'] = $thisDom.attr('data-buryfuncType');//功能类型
			buryParam['fromPageUId'] = buryFCode.getPageUId();//功能类型

			for(var pItem in buryParam){
				if(buryParam[pItem]){
					pingParam = pingParam+ '&' + pItem + '=' + buryParam[pItem];
				}
			}
			
			if(type == 'loading' || type == 'detail'){
				result = buryParam;
			}else if (type == 'click'){
				result = {};
				for(var pItem in buryParam){
					if(buryParam[pItem]){
						result[pItem] = buryParam[pItem];
					}
				}
			}else{
				result = pingParam;
			}
			return result;//根据不同类型，返回需要拼接或者传递的结果
		} catch (e) {
			return '';
		}
    },
    getPageUId: function(){
    	return loadingUid;
    },
    paramCheck:function(opEntity, otherParam){
    	/* 用来对查看模块明细的时候生成参数 */
    	//列表翻页、切换tab、筛选
    	//获取event事件
    	//解析事件含有的模块以及api
    	//将api映射为模块
    	$event = otherParam[0];
    	apiCmd = otherParam[1];
    	param = otherParam[2];
    	
    	var turnningBury = function(){
    		var postParam = {};//用来存储列表过滤功能的参数
    		var selField = buryFCode.paramMapping('select',opEntity);//返回筛选项数组
    		var selValue = [];
    		var ftype = 'listQy';
    		if(selField){
    			for(var i=0;i<selField.length;i++){
	    			selValue.push(param[selField[i]]);//然后通过param来获取筛选的值
	    		}
    			selValue = selValue.join(',');
    		}else{
    			selValue=null;
    		}
    		var secondEntity = ['getcorpcustomer','getcorpsupplier','getsharedbondsinfo','getratingreportinfo','getlandanns','getlandpurchase','getlandtrans','getprojectsinfo','gettradelbls','getstockpledgers','getstockpledgees','getstockplexes'];
    		var secondType = ['gethisequitypledgelist','gethischattelmortgagelist','getequitypledgelist','getchattelmortgagelist']
    		if(secondEntity.indexOf(apiCmd) != -1){
    			postParam['entityAttribute'] = buryItemMapping.mappingEntity[apiCmd];
    		}else if(secondType.indexOf(apiCmd) != -1){
    			postParam['entityAttribute'] = param['type'];//二级tab属性-进行映射
    		}else{
    			postParam['entityAttribute'] = opEntity;//二级tab属性-进行映射
    		}
    		postParam['screenItem'] = selValue;//筛选项
    		buryFCode.buryFunIn('view', ftype, opEntity, postParam);//进行埋点
    		return null;
    	}
    	
    	if($event == undefined){
    		turnningBury();
    	}
    	
    	if($event.context.type == 'select-one'){
    		//确认是否是下拉筛选选择
    		var selType= $event.attr('data-val');//获得筛选类型
    		var selField = buryFCode.paramMapping('select', selType);
    		var selValue = selField?(param[selField]?param[selField]:'all'):null;

    		//浏览模块实体、筛选项、筛选条件、属性（二级tab）
    		var postParam = {};//用来存储列表过滤功能的参数
    		var ftype = buryFCode.paramMapping('funType',selType);//功能类型,7种类型，finish
    		postParam['screenCondition'] = buryItemMapping.mappingEntity[selType];//筛选条件-进行映射
    		postParam['screenItem'] = selValue;//筛选项
    		var secondEntity = ['getcorpcustomer', 'getcorpsupplier'];
    		if(secondEntity.indexOf(apiCmd) != -1){
    			postParam['entityAttribute'] = buryItemMapping.mappingEntity[apiCmd];
    		}else{
    			postParam['entityAttribute'] = opEntity;//二级tab属性-进行映射
    		}
    		buryFCode.buryFunIn('select', ftype, opEntity, postParam);//进行埋点
    		return null;
    	}
    	if($event.attr('aria-controls') || $event.text() || $event.attr('class')=='pagiate-page-num'){
    		//区分是否是翻页或者切换二级目录(这里有问题,有一些不走这个)
    		turnningBury();
    	}	
    	
    	return null;
    },
    itemClick:function(activeType,opEntity,otherParam,opType){
    	//详情单项下载、企业报告下载
    	var ftype = 'singleEx';
    	ftype = opType;
    	buryFCode.buryFunIn(activeType, ftype, opEntity, otherParam);//进行埋点
		return null;
    },
    
    paramMapping:function(type, value){
    	/*进行各参数映射 */
    	var result = null;
    	switch(type){
			case 'select'://对筛选项进行映射
				var selectDic = {
					'courtannouncementSelVal' : 'cause',//法院公告
					'courtopenannouncementSelVal' : 'cause',//开庭公告
					'brandSelVal' : 'status',//商标
					'productioncopyrightSelVal' : 'category',//作品著作权
					'courtdecisionResultVal' : 'result',//法院判决
					'courtdecisionCauseVal' : 'cause',//法院判决
					'courtTypeVal' : 'caseType',//法院判决
					'authenticationSelVal' : 'status',//资质认证
					'owingtaxSelVal' : 'type',//欠税信息
					'judicialsaleSelVal' : 'status',//司法拍卖
					'investStatusVal' : 'status',//直接对外投资
					'investRatioVal' : 'rate',//直接对外投资
					'biddingVal' : 'role',//招投标信息
					'supplierVal' : 'period',//客户和供应商
					'customerSupVal' : 'period',//客户和供应商
					'hisCourtannouncementSelVal' : 'cause',//历史法院公告
					'hisCourtdecisionResultVal' : 'result',//历史裁判文书
					'hisCourtdecisionCauseVal' : 'cause',//历史裁判文书
					'hisCourtopenannouncementSelVal' : 'cause',//历史开庭公告
					'法院公告' : ['cause'],//法院公告
					'开庭公告' : ['cause'],//开庭公告
					'商标' : ['status'],//商标
					'作品著作权' : ['category'],//作品著作权
					'裁判文书' :['result','cause','caseType'],//裁判文书
					'资质认证' :['status'],//资质认证
					'欠税信息' :['type'],//欠税信息
					'司法拍卖' :['status'],//司法拍卖
					'对外投资' :['status','rate'],//直接对外投资
					'招投标' :['role'],//招投标
					'客户和供应商' :['period'],//客户和供应商
					'历史法院公告' :['cause'],//历史法院公告
					'历史裁判文书' :['result','cause'],//历史裁判文书
					'历史开庭公告' :['cause'],//历史开庭公告
				};
				result = selectDic[value]?selectDic[value]:null;
				break;
			
			case 'funType'://进行二级功能映射
				var functypeDic = {
					'courtannouncementSelVal' : 'kindCondi',//法院公告-案由
					'courtopenannouncementSelVal' : 'kindCondi',//开庭公告-案由
					'brandSelVal' : 'stateCondi',//商标-状态
					'productioncopyrightSelVal' : 'kindCondi',//作品著作权-类型
					'courtdecisionResultVal' : 'stateCondi',//法院判决-判决结果
					'courtTypeVal' : 'kindCondi',//裁判文书-案件类型
					'courtdecisionCauseVal' : 'kindCondi',//法院判决-案由
					'authenticationSelVal' : 'kindCondi',//资质认证-类型
					'owingtaxSelVal' : 'kindCondi',//欠税信息-税种种类
					'judicialsaleSelVal' : 'stateCondi',//司法拍卖-状态
					'investStatusVal' : 'stateCondi',//直接对外投资-状态
					'investRatioVal' : 'proCondi',//直接对外投资-持股比例
					'biddingVal' : 'roleCondi',//招投标信息-角色
					'supplierVal' : 'timeCondi',//客户和供应商-报告期
					'customerSupVal' : 'timeCondi',//客户和供应商-报告期
					'hisCourtannouncementSelVal' : 'kindCondi',//历史法院公告-案由
					'hisCourtdecisionResultVal' : 'stateCondi',//历史裁判文书-结果
					'hisCourtdecisionCauseVal' : 'kindCondi',//历史裁判文书-案由
					'hisCourtopenannouncementSelVal' : 'kindCondi'//历史开庭公告-案由
				};
				result = functypeDic[value];
				break;
    		default : break;
    	}
    	return result;
    },
    
    itemDetailView: function(opEntity, otherParam){
    	/* 模块详情查看 */
    	var ftype = otherParam['funcType']?otherParam['funcType']:null;
    	buryFCode.buryFunIn('itemDetailView', ftype, opEntity, otherParam);//进行埋点
	},
	
	itemADView: function(opEntity, otherParam, opType){
		/** 记录广告相关或产品需要的埋点 */
		var ftype = otherParam['funcType']?otherParam['funcType']:null;
    	buryFCode.buryFunIn(opType, ftype, opEntity, otherParam);//进行埋点
	},
    
    bury:function(activeType, opEntity, otherParam, opType){
    	/* 入口函数 */
    	//根据activeType进行分发
    	try {
            opEntity = buryItemMapping.mappingEntity[opEntity]?buryItemMapping.mappingEntity[opEntity]:opEntity;
	    	switch(activeType){
				case 'AD': buryFCode.itemADView(opEntity, otherParam, opType);break;//广告、产品需要的功能点
	    		case 'search': buryFCode.burySearch(opEntity, otherParam);break;
	    		case 'view': buryFCode.paramCheck(opEntity, otherParam);break;
	    		case 'itemDetailView' : buryFCode.itemDetailView(opEntity, otherParam);break;
	    		default: buryFCode.itemClick(activeType,opEntity,otherParam,opType);break;//单项下载/报告/收藏/监控	    		
	    	}
        } catch (e) {}
    	
    },
    
    burySearch:function(opEntity,otherParam){
    	//搜索-搜索、历史搜索
    	var ftype = buryFCode.getUrlParam('local')['funcType'];//获取二级动作类型
    	ftype = ftype?ftype:'searchCk';
    	buryFCode.buryFunIn('search', ftype, opEntity, otherParam);
    },
    
    getlocalParam:function(finallVar){
    	//用于生成local的字典以及string
    	var parameters = {};
    	var resultStr = finallVar['funcType'] +'****'+ finallVar['opEntity']+'****';
    	var resultDic = {};
    	var orderItem = ['opActive','opSystem','currentPage','currentId','fromPage','fromId','inputItem','screenItem','strategy','opId','clickNum','screenCondition','entityAttribute','fromField','fromModule','queryStringParams','pageUId','fromPageUId'];
    	
    	for (var i in orderItem){
    		resultStr += finallVar[orderItem[i]] + '****';
    		resultDic[orderItem[i]] = finallVar[orderItem[i]];
    	}
    	resultStr += 'null****null****null****null****null****null****null****null';
    	return [resultStr,resultDic];
    },
    getSouceModule:function(fromPage,fromModule){
    	//获取模块的来源
    	var source = '其他';
    	fromPage = fromPage ?　buryItemMapping.mappingEntity[fromPage] : '';
    	fromPage = fromPage ? fromPage : '';
    	fromModule = fromModule ? '-'+fromModule : '';
    	if(fromModule == '-预搜索'){
    		source = '预搜索';
    	}else if(fromPage == '企业'){
    		source = '其他';
    	}else{
    		source = (fromPage + fromModule) ? (fromPage + fromModule) : '其他';	
    	}
    	return source;
    },
    
}

/* 根据记录加载的页面在第一次进行加载的时候，解析url，对几个详情页进行延后3s触发 */
var timeoutPage = ['company', 'person', 'group']
timeOutNum = timeoutPage.indexOf(loadingPage) != -1?3000:100;
setTimeout(function() {
	if(toLoadPage.indexOf(loadingPage) != -1){
		var ftype = buryFCode.getUrlParam('local')['funcType'];//这里有问题,对外部进入的模块不能记录,from可能会没有
		ftype = ftype ? ftype : 'detailView';//默认加载详情
		var opEntity = buryItemMapping.mappingEntity[loadingPage];
		buryFCode.buryFunIn('loading', ftype, opEntity);
	}
},timeOutNum)

/**
 * 以下是old埋点
 */
try {
	switch(loadingPage){
		case 'company':
		case 'companyglobal':
			/** 用户企业详情页的埋点 */
			setTimeout(function() {
				buryFCode.buryFunHbase('922602100272');
			},timeOutNum)

			//企业详情页-添加收藏
			$(document).on('click', '.btn-add', function() {
				buryFCode.buryFunHbase('922602100273');
			});
			//取消收藏在company.js中

			//下载报告
			$(document).on('click', '.btn-download-report', function() {
				buryFCode.buryFunHbase('922602100312');
			});

			// CEL-企业详情页-标签-点击查看更多
			$(document).on('click', '#moreTagsCompany', function() {
				buryFCode.buryFunHbase('922602100313');
			});

			//点击全部新闻链接
			$(document).on('click', '#jumpMoreNewsList', function() {
				buryFCode.buryFunHbase('922602100276');
			});

			//点击关系图谱
			$(document).on('click', '#realationGraph', function() {
				buryFCode.buryFunHbase('922602100277');
			});

			//点击WI行业中心链接
			$(document).on('click', '#go2WI', function() {
				buryFCode.buryFunHbase('922602100278');
			});

			//点击股东信息中并购事件链接
			$(document).on('click', '.M-box-Shareholder .LinkToMerge', function() {
				buryFCode.buryFunHbase('922602100280');
			});

			//点击股东信息股权结构图
			$(document).on('click', '.jumpstockStructure', function() {
				buryFCode.buryFunHbase('922602100281');
			});

			//点击股东信息疑似实际控制人
			$(document).on('click', '.jumpActControl', function() {
				buryFCode.buryFunHbase('922602100282');
			});

			//点击并购信息 中国并购库
			$(document).on('click', '#showMerge .icon-merge', function() {
				buryFCode.buryFunHbase('922602100286');
			});

			//点击待上市信息 新股中心
			$(document).on('click', '#showDeclarcompany .icon-newstock', function() {
				buryFCode.buryFunHbase('922602100287');
			});

			//点击股权出质中的二级tab（数量为0不可点击不埋点）
			$(document).on('click', '#showPledgedstock .tab-style a:not(.nojump)', function(event) {
				var functionCode = '';
				switch ($(event.target).attr('data-index')) {
					case '0':
						//点击出质人tab
						functionCode = '922602100288';
						break;
					case '1':
						//点击质权人tab
						functionCode = '922602100289';
						break;
					case '2':
						//点击出质标的tab
						functionCode = '922602100290';
						break;
				}
				if (functionCode !== '') {
					buryFCode.buryFunHbase(functionCode);
				}
			});

			//点击上榜信息 企业排行榜
			$(document).on('click', '#listInformation .icon-rank', function() {
				buryFCode.buryFunHbase('922602100291');
			});

			//点击任意二级菜单进行定位（数量为0不跳转不埋点）
			$(document).on('click', '#subNavList a:not(.forbiddenJump)', function() {
				buryFCode.buryFunHbase('922602100292');
			});

			//点击任意一级菜单进行定位
			$(document).on('click', '#linkshowOverview, #linkfinancingInfo, #linkBussinessInfo, #linkRiskInfo, #linkBusinessRiskInfo, #linkIntellectualProperty', function() {
				buryFCode.buryFunHbase('922602100292');
			});

			//工商信息-点击实际控制人图谱图标
			$(document).on('click', '.realActControl', function() {
				buryFCode.buryFunHbase('922602100314');
			});

			//CEL-企业详情页-上榜信息-点击榜单详情
			$(document).on('click', '.rank-detail', function() {
				buryFCode.buryFunHbase('922602100327');
			});

			// CEL-企业详情页-债券信息-点击募集说明书下载链接
			$(document).on('click', '.load-bond', function() {
				buryFCode.buryFunHbase('922602100328');
			});
			break;
		case 'person':
			/** 人物详情页的埋点 */
			setTimeout(function() {
				buryFCode.buryFunHbase('922602100330');
			},timeOutNum)

			//点击菜单进行定位
			$('.nav-tabs').on('click', '.nav-block', function (e) {
				var target = $(e.target).closest('.nav-block');
				if (!target.hasClass('nav-disabled')) {
					buryFCode.buryFunHbase('922602100294');
				}     
			})
			break;
		case 'advancedsearch02':
			/** 企业筛选页 */

			//点击搜索按钮
			$('#advancedShow').on('click', function () {
				buryFCode.buryFunHbase('922602100318');
			});

			//点击重置按钮
			$('#advancedReset').on('click', function () {
				buryFCode.buryFunHbase('922602100319');
			});
			break;
		case 'chartplatform':
			/** 查关系图谱 */
			// CEL-图谱平台-关联路径探查-点击保存图片按钮
			$(document).on('click', '.chart-header-save', function () {
				buryFCode.buryFunHbase('922602100341');
			});

			// CEL-图谱平台-关联路径探查-点击显示/隐藏属性按钮
			$(document).on('click', '#chartActionOne', function () {
				buryFCode.buryFunHbase('922602100342');
			});

			// CEL-图谱平台-关联路径探查-点击刷新按钮
			$(document).on('click', '#chartActionTwo', function () {
				buryFCode.buryFunHbase('922602100343');
			});
			break;
		case 'companychart':
			/** 企业图谱 */
			//点击tab（不直接按ID选取a标签是为了与页面点击行为一致）
			$('.nav-tabs').on('click', '.nav-block', function(e) {
				var functionCode = "";
				var id = $(e.target).attr('id') || $(e.target).find("a").attr('id');
				switch (id) {
					case "linkQYTP":
						//点击企业图谱tab
						functionCode = "922602100299";
						break;
					case "linkGQJG":
						//点击股权结构tab
						functionCode = "922602100300";
						break;
					case "linkDWTZ":
						//点击对外投资tab
						functionCode = "922602100301";
						break;
					case "linkYSGX":
						//点击疑似关联tab
						functionCode = "922602100302";
						break;
					case "linkYSKZR":
						//点击疑似实际控制人tab
						functionCode = "922602100303";
						break;
					case "linkRZLC":
						//点击融资历程tab
						functionCode = "922602100304";
						break;
					case 'linkGQCT':
						//点击股权穿透tab
						functionCode = "922602100370";
						break;
				}
				if (functionCode !== "") {
					buryFCode.buryFunHbase(functionCode);
				}
			});

			// CEL-企业图谱-点击刷新按钮
			$(document).on('click', '#chartFirstOne', function() {
				buryFCode.buryFunHbase('922602100340');
			});
			break;
		case 'searchhome':
			/** 企业库搜索首页 */
			buryFCode.buryFunHbase('922602100263');

			// CEL-首页-点击查企业按钮
			$("#btn_search").on("click", function (event, virtualClick) {
				if (!virtualClick) {
					buryFCode.buryFunHbase('922602100125');
				}
			});

			// CEL-首页-点击查人物按钮
			$("#btn_search_person").on("click", function (event, virtualClick) {
				if (!virtualClick) {
					buryFCode.buryFunHbase('922602100332');
				}
			});

			// CEL-首页-点击查关系按钮
			$("#btnSearchRelation").on("click", function (event, virtualClick) {
				if (!virtualClick) {
					buryFCode.buryFunHbase('922602100333');
				}
			});

			// 点击-企业热门搜索
			$(document).on("click", "#searchKeyword a", function () {
				buryFCode.buryFunHbase('922602100265');
			});

			// 查人物热门搜索
			$(document).on("click", "#searchPersonKeyword a", function () {
				buryFCode.buryFunHbase('922602100334');
			});
			break;
		case 'searchhomelist':
			/** 搜索结果页 */
			buryFCode.buryFunHbase('922602100335', {type: location.search.indexOf('linksource') > -1 ? 'CEL' : 'WS'});
			
			//点击筛选项（排除不跳转选项）
			$(document).on("click", "#filterList a:not('.no-jump')", function() {
				buryFCode.buryFunHbase('922602100267');
			});

			//点击 收起/展开 筛选
			$(document).on("click", "#btnFilter", function() {
				buryFCode.buryFunHbase('922602100126');
			});

			//点击最近浏览企业记录
			$(document).on("click", ".history_list", function() {
				buryFCode.buryFunHbase('922602100269');
			});

			//点击排序（重复点击同一项不成立）
			$("#sortDialog").on("click", 'li', function(event) {
				var target = event.target;
				var oldSelectedEle = $(target.parentElement).find('.active');
				if (target !== oldSelectedEle[0]) {
					buryFCode.buryFunHbase('922602100270');
				}
			});

			// 搜索结果页面-收藏
			$(document).on("click", ".list-icon-customer", function() {
				buryFCode.buryFunHbase('922602100367');
			})
			break;
		case 'superadvancedsearch':
			/** 超级名单页面加载 */
			var otherParam = {funcType:'searchAD'};
        	buryFCode.bury('AD','超级名单',otherParam,'searchAD');
			break;
		case 'searchjudgement':
			/** 裁判文书页面加载 */
			var otherParam = {funcType:'searchAD'};
        	buryFCode.bury('AD','裁判文书',otherParam,'searchAD');
			break;
		case 'searchpatent':
			/** 专利搜索页面加载 */
			var otherParam = {funcType:'searchAD'};
        	buryFCode.bury('AD','专利',otherParam,'searchAD');
			break;
	}
	
	/**
	 * 共用
	 */
	setTimeout(function() {
		// 点击-工具栏-搜索框的历史搜索
		$('.input-toolbar-search-list').on('click', '.search-list-div', function() {
			buryFCode.buryFunHbase('922602100266');
		});

		// 清空-工具栏-历史搜索记录
		$('.input-toolbar-search-list').on('click', '.search-list-icon', function() {
			buryFCode.buryFunHbase('922602100308');
		});

		// 点击-工具栏-预搜索企业链接
		$('.input-toolbar-before-search').on('click', '.before-search-div', function() {
			buryFCode.buryFunHbase('922602100310');
		});

		// 点击-置顶图标
		$('.content-toolbar-top').on('click', function() {
			buryFCode.buryFunHbase('922602100293');
		});

		// 点击-反馈图标
		$('.content-toolbar-feedback').on('click', function() {
			buryFCode.buryFunHbase('922602100331');
		});

	},5000)

} catch (error){}






