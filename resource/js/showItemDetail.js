/*
 * @Author: yxmo 
 * @Date: 2019-10-21 10:12:31 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2020-06-23 16:36:41
 * @Desc: 
 */
/*这个js用来统一展示单一模块的详情*/

$(document).on("click", ".underline", function() {
    var target = this;
    var code = $(target).attr('data-code');
    var name = $(target).attr('data-name');
    var type = $(target).attr('data-type');
    var buryParam = $(target).attr('data-pingParam') ? $(target).attr('data-pingParam') : '';
    if (code && code.length) {
        if (code.length < 16) {
            Common.linkCompany('Bu3', code, null, null, buryParam); //bury
        } else {
            if (type) {
                window.open('Person.html?id=' + code + '&name=' + name + buryParam + '#' + type);
            } else {
                window.open('Person.html?id=' + code + '&name=' + name + buryParam);
            }

        }
    }
    return false;
});
$(document).on('click', '.page_button', function() {
    //点击翻页功能
    if ($(this.parentElement).find('.now-page').text() == $(this).text()) {
        return false;
    }
    var dataBlock = $(this.parentElement).attr('data-block');
    if ($(this).attr('data-jump') == 'up' || $(this).attr('data-jump') == 'down') {
        var jumpNum = $(this).attr('data-jump') == 'up' ? divSetting.listSetting[dataBlock].param.PageNo - 1 : divSetting.listSetting[dataBlock].param.PageNo + 1;
        if (jumpNum < 0 || jumpNum >= $(this).attr('data-num')) {
            return false;
        } else {
            divSetting.listSetting[dataBlock].param.PageNo = jumpNum;
        }
    } else {
        divSetting.listSetting[dataBlock].param.PageNo = parseInt($(this).text()) - 1;
    }
    ItemDetail.listDivRender(null,dataBlock);
});
$(document).on("keydown",'.pagiate-page-num',function(event) {
    //回车后执行跳转页面操作
    switch (event.keyCode) {
        case 13:
        	if(parseInt($(this).val()) && parseInt($(this).val()).toString().length == $(this).val().length ){
        		var dataBlock = $(this.parentElement).attr('data-block');
        		var jumpPageNum = parseInt($(this).val());
        		var allNum = $(this).parent().find("[data-jump=up]").attr('data-num');
        		if (allNum <= jumpPageNum-1){
        			return false;
        		}
        		divSetting.listSetting[dataBlock].param.PageNo = parseInt($(this).val())-1;
        		ItemDetail.listDivRender(null,dataBlock);
        	}
            return false;
            break;
    }
});
var ItemDetail = {
	detailType : wind.uri(location.href).query('type') || null,//页面展示的详情类型
	detailId : wind.uri(location.href).query('detailid') || null,//详情id
	param : null,
	divSetting : null,
	init : function(){
		//初始化页面，展示对应详情模块
		switch(ItemDetail.detailType){
			case'product':ItemDetail.product();break;//产品
			case'p2p':ItemDetail.P2P();break;//p2p
			case'finalcase':ItemDetail.finalcase();break;//终本案件
			case'groupsystem' : ItemDetail.groupSystem();break;//集团系
			case'bankruptcy':ItemDetail.bankruptcy();break;//破产重整
			case'bankruptcynotice':ItemDetail.bankruptcynotice();break;//关联公告详情
			case'franchise':ItemDetail.franchise();break;//商业特许经营
			case'securitiesDishonest':ItemDetail.securitiesDishonest();break;//证券期货市场失信信息
			case'hotels':ItemDetail.hotels();break;//旗下酒店
			case'judgment':ItemDetail.judgment();break;//裁判文书
            case'bid':ItemDetail.bid();break;//招投标
			case'example':ItemDetail.example();break;	
			default:break;//展示暂无条目
		}

   },
	product: function() {
        //产品详情
        divSetting = {
        	isSingel : true,
            interface: 'getproductdetail', //请求接口
			param : { detailId: ItemDetail.detailId},
			
            showDiv: ['TitleDiv', 'ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
                param: null,
                showTitleImg: 'appRowkey', //是否在title中展示图片,以及字段
                title: 'appAbbr',
                table: '6730',
                tbValue: ['appCat#corpName|code', 'appBrief'],
                tbName: [('138754$产品类别 ') + '#' + ('208883$所属企业 '), ('208864$产品简述 ' )],
                
                jumpUrl: null,
            	jumpCode: { corpName: 'windId' },
            },

			listDivName :[['basicInfo','205468','基本信息'],['marketInfo','208870','应用市场发布信息']],//list多个模块名称  ,是否先定义一个div块
			modelNum : [null,0],//各个模块的统计数字
			
			listSetting : {
				basicInfo : {
					interface: null,
					param : null,
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['appAbbr#corpName|code','appCat#downNum|thousands','score|formatFloat#noteNum|thousands','appBrief','appDesc'],
                    basicName : [('208887$产品简称')+'#'+('208883$所属企业'),('138754$产品类别')+'#'+('208862$下载总数量'),('208881$评分')+'#'+('208863$评论总数量'),('208864$产品简述'),('208888$产品介绍')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    jumpUrl: null,
                    jumpCode: { corpName: 'windId' },
				},
				marketInfo : {
					interface: null,
					param : null,					
                    divType: 'list',
                    listPage : false,//是否需要翻页功能，这个要单独写                    
                    contValue : null,      
                    basicValue : null,
                    basicName : null,   
                    listValue : ['NO.','storeName','appName|url','creatorName','relDate|time','downNum|thousands','score|formatFloat','noteNum|thousands','lstVer','uptDate|time'],
					listTitle : [('138741$序号'),('208871$应用市场'),('208884$产品全称'),('208872$开发商名称'),('138774$发布时间'),('208885$下载数量'),('208881$评分'),('208873$评论数量'),('208874$最新版本号'),('138868$更新时间')],
					listwidth : ['5%','10%','15%','15%','10%','10%','5%','10%','10%','10%'],
					listAlign : [0,0,0,0,0,0,0,0,0,0],
					listFrom : 'stores',                    
                    jumpUrl: { appName: 'appURL' },
                    jumpCode: { corpName: 'windId' },
				},
			},	            
        };
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
   },
    P2P2: function() {
        //产品详情
        divSetting = {
        	isSingel : true,
            interface: 'getp2pdetail', //请求接口
            param : { productId: ItemDetail.detailId},
            showDiv: ['TitleDiv', 'ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
                param: null,
                showTitleImg: 'productLogo', //是否在title中展示图片,以及字段
                title: 'productName',
                table: '6740',
                tbValue: ['corpName|code#registerCapital|money#registerArea', 'depositoryBank#opTime#onlineDate|time'],
                tbName: [('208865$运营企业') + '#' + ('35779$注册资本') + '#' + ('208882$注册地区'), ('208866$资金存管银行') + '#' + ('208894$运营天数') + '#' + ('208895$上线时间')],
            	jumpUrl: null,
                jumpCode: { corpName: 'corpId' },
            },
			listDivName :[['basicInfo','205468','基本信息']],//list多个模块名称  ,是否先定义一个div块
            modelNum: [null, 0], //各个模块的统计数字
			listSetting:{
				basicInfo :{
					interface: null,
					param : null,
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue: ['productName#onlineDate|time', 'corpName|code#opStatus', 'opTime#depositoryBank', 'depositorySignDate|time#securityLevel', 'selfRegulationOrg#relatedProduct', 'appName#publicAccount', 'weibo#tel', 'chargeStandard', 'collectWay'],
	                basicName: [('2485$产品名称') + '#' + ('208895$上线时间'), ('208896$运营公司') + '#' + ('208897$运营状态'), ('208898$运营时长') + '#' + ('208866$资金存管银行'), ('208899$资金存管签约时间') + '#' + ('208900$信息安全等级'), ('208901$所在自律组织') + '#' + ('208867$相关产品'), ('208902$平台APP应用') + '#' + ('208903$公众号或服务号'), ('208869$微博') + '#' + ('208868$客服电话'), ('208904$收费标准'), ('208905$催收方式')],  

                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    
                    jumpUrl: null,
            		jumpCode: { corpName: 'corpId' },
				},
			},
        };
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    P2P: function() {
    	//p2p详情
        divSetting = {
        	isSingel : false,
            interface: null, //只需要一个接口时

            showDiv: ['TitleDiv', 'ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: 'getp2pdetail', //请求接口
            	param: {productId:ItemDetail.detailId},
            	
                showTitleImg: 'productLogo', //是否在title中展示图片,以及字段
                title: 'productName',
                table: '6740',
                tbValue: ['corpName|code#registerCapital|money#registerArea', 'depositoryBank#opTime#onlineDate|time'],
                tbName: [('208865$运营企业') + '#' + ('35779$注册资本') + '#' + ('208882$注册地区'), ('208866$资金存管银行') + '#' + ('208894$运营天数') + '#' + ('208895$上线时间')],
            	jumpUrl: null,
                jumpCode: { corpName: 'corpId' },
                tbState : 'opStatus|UDF',
                UDF : {
                	opStatus : function(full){
                		var classColor = full['opStatus'] == '正常' ? 'normal-state' : 'other-state';
                		var result = '<span class="'+classColor+'">'+full['opStatus']+'</span>';
                		return result;
                	},
                },
            },
            
			listDivName :[['basicInfo','205468','基本信息 '],['operateState','208897','运营状态'],['aboutDoc','216411','相关附件']],//list多个模块名称	,是否先定义一个div块
			
			
			listSetting : {
				basicInfo :{
					interface: 'getptpbasic',
					divType: 'basic',
					listPage : true,//是否需要翻页功能，这个要单独写
					
					basicValue : null,
					basicName : null,
					
					basicValue: ['productName#onlineTime|time', 'operateCompanyName|code#operateState', 'operateDays#depositoryBank', 'capitalDepositSigningTime|time#informationSecurityLevel', 'regulatoryOrganization#relatedProduct', 'platformAppApplication#publicNumber', 'microblog#customerServicePhoneNumbers', 'chargeStandard', 'collectionMethod'],
	                basicName: [('2485$产品名称') + '#' + ('208895$上线时间'), ('208896$运营公司') + '#' + ('208897$运营状态'), ('208898$运营时长') + '#' + ('208866$资金存管银行'), ('208899$资金存管签约时间') + '#' + ('208900$信息安全等级'), ('208901$所在自律组织') + '#' + ('208867$相关产品'), ('208902$平台APP应用') + '#' + ('208903$公众号或服务号'), ('208869$微博') + '#' + ('208868$客服电话'), ('208904$收费标准'), ('208905$催收方式')],  
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: { operateCompanyName: 'windCode' },
            		
            		param: {productId:ItemDetail.detailId},
				},
				operateState :{
					interface: 'getptpoperastate',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :　true, //是否需要展示统计数字
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','operateState','enterStateDate|time'],
					listTitle : ['138741$序号 ','208897$运营状态','222857$进入该状态日期'],
					listwidth : ['6%','47%','47%'],
					listAlign : [0,0],
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : { productId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
				aboutDoc :{
					interface: 'getptpattach',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :　true, //是否需要展示统计数字
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','name|url','type'],
					listTitle : ['138741$序号 ','5912$附件名称','134834$附件类型'],
					listwidth : ['6%','47%','47%'],
					listAlign : [0,0,0],
					listFrom : null,
					
					jumpUrl: {name:'path'},
            		jumpCode: null,
            		UDF:{
            			path:function(full){
            				if(!full){
            					return '--';
            				}
            				var pathLink = full.path;
            				var result = pathLink ? '<a target="_blank" class="wi-secondary-color wi-link-color" href="'+pathLink+'">详情</a>' : '--';
            				return result;
            			},
            		},
            		
            		param : { productId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
			},
		};
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    finalcase: function() {
        //终本案件详情
        divSetting = {
        	isSingel : true,
            interface: 'getpersonfinalcasedetail', //请求接口
            param : { caseId: ItemDetail.detailId },

            showDiv: ['ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
                param: null,
                showTitleImg: null, //是否在title中展示图片,以及字段
                title: null,
                table: null,
                tbValue: null,
                tbName: null
            },
			listDivName :[['basicInfo','205468','基本信息']],//list多个模块名称  ,是否先定义一个div块
			
			listSetting : {
                basicInfo : {
                    interface: null,
                    param : null,
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['executorName|code#idNumberOrOrganizationCode','sex#caseNumber','courtOfExecution|code','startDate|time#endDate|time','executiveStandard|thousands#outstandingMoney|thousands'],
					basicName : [('138592$被执行人')+'#'+('153393$身份证号码/组织机构代码'),('15894$性别')+'#'+('138190$案号'),('138228$执行法院'),('138294$立案时间') + '#' + ('216399$终本日期'), ('216397$执行标的(元)') + '#' + ('216401$未履行金额(元)')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,  
                    jumpUrl: null,
                    jumpCode: { executorName:'executorId',courtOfExecution: 'courtOfExecutionId' },  
                }
           }, 
        };
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    groupSystem: function() {
        //集团系详情        
        divSetting = {
        	isSingel : false,
            interface: null, //只需要一个接口时

            showDiv: ['TitleDiv', 'ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: 'getgroupdetailbasicinfo', //请求接口
            	param: {groupSystemId:ItemDetail.detailId},
            	
                showTitleImg: 'groupSystemLogoUrl', //是否在title中展示图片,以及字段
                title: 'groupSystemName',
                titleContCss : 'two-line-middle',
                table: '6730',
                tbState : 'groupSystemType|UDF',
                tbValue: ['coreMainCompanyName|code'],
                tbName: ['216412$核心主体公司'],
                jumpUrl: null,
                jumpCode: { coreMainCompanyName: 'coreMainCompanyWindCode' },
                UDF : {
                	groupSystemType : function(full){
                		var stateCss = 'group-system-state';
                		var result = '<span class="'+stateCss+'">'+full['groupSystemType']+'</span>';
                		return result;
                	},
                },
            },
            
			listDivName :[['mainCom','216413','主体公司'],['menberCom','216415','成员公司']],//list多个模块名称	,是否先定义一个div块
			
			modelNum : [null,0],//各个模块的统计数字
			
			listSetting : {
				mainCom :{
					interface: 'getgroupdetailmaincorp',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :　true, //是否需要展示统计数字
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','mainCompanyName|UDF','mainCompanyLevel','legalRepresentative|code','registeredCapital|thousands','registrationState','establishDate|time'],
					listTitle : ['138741$序号 ','216414$主体公司名称','216386$主体公司级别','5529$法定代表人','138768$注册资本(万元)','138772$登记状态','138860$成立日期'],
					listwidth : ['5%','30%','15%','15%','12%','13%','10%'],
					listAlign : [0,0,0,0,0,0,0],
					listFrom : null,
					
					
					
					jumpUrl: null,
            		jumpCode: { mainCompanyName: 'mainCompanyWindCode',legalRepresentative: 'legalRepresentativeId' },
            		UDF : {
            			mainCompanyName:function(full){
            				if(!full){
            					return '--';
            				}
            				var labelSpan = '';
            				if(full.mainCompanyLabelName && full.enterpriseLabelName!=''){
            					var labelCodeArr = full.mainCompanyLabelName.split(',');
            					labelSpan = "<br />";
		                		for(var i = 0;i<labelCodeArr.length;i++ ){
		                			var colorSel = '';
		                			switch(labelCodeArr[i]){
		                				case '上市公司':colorSel='group-ipo-label';break;
		                				case '发债企业':colorSel='group-bond-label';break;
		                				case '科创版':colorSel='group-sinc-label';break;
		                				case '新三板':colorSel='group-sinc-label';break;
		                				default:colorSel='group-ipo-label';break;
		                				
		                			}
		                			labelSpan += '<span class="group-item '+colorSel+'">' + labelCodeArr[i] + '</span>';
	                			}
            				}
            				var pingParam = '&fromModule=showGroupSystem&fromField=归属主体企业&opId='+full.mainCompanyWindCode;//bury
	                		var companySpan = Common.jumpPersonOrCompany(full.mainCompanyName, full.mainCompanyWindCode, pingParam);
            				return companySpan + labelSpan;
            			},
            		},
            		
            		param : { groupSystemId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
				menberCom :{
					//成员公司
					interface: 'getgroupdetailmembercorp',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :　true, //是否需要展示统计数字
					
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','memberCompanyName|UDF','memberCompanyLevelName','mainCompanyName|UDF','shareholdingRatio|percent','controlTypeName','shareholdingTypeName'],
					listTitle : ['138741$序号 ','216416$成员公司名称','216388$成员公司级别','216390$归属主体公司','138412$实际持股比例','216391$控制类型','2949$持股类型'],
					listwidth : ['5%','30%','10%','30%','10%','8%','7%'],
					listAlign : [0,0,0,0,0,0,0],
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: { memberCompanyName: 'memberCompanyWindCode',mainCompanyName: 'mainCompanyWindCode' },
            		UDF : {
            			memberCompanyName:function(full){
            				if(!full){
            					return '--';
            				}
            				var dataName = full.memberCompanyName;
            				var dataCode = full.memberCompanyWindCode;
            				var dataLanel = full.memberCompanyLabelName;
            				var pingParam　=　'';
            				if(dataCode){
            					pingParam = '&fromModule=showGroupSystem&fromField=成员公司&opId='+dataCode;//bury
            				}
            				var labelSpan = '';
            				if(dataLanel && dataLanel!=''){
            					var labelCodeArr = dataLanel.split(',');
            					labelSpan = "<br />";
		                		for(var i = 0;i<labelCodeArr.length;i++ ){
		                			var colorSel = '';
		                			switch(labelCodeArr[i]){
		                				case '上市公司':colorSel='group-ipo-label';break;
		                				case '发债企业':colorSel='group-bond-label';break;
		                				case '科创版':colorSel='group-sinc-label';break;
		                				case '新三板':colorSel='group-sinc-label';break;
		                				default:colorSel='group-ipo-label';break;
		                				
		                			}
		                			labelSpan += '<span class="group-item '+colorSel+'">' + labelCodeArr[i] + '</span>';
	                			}
            				}
            				
	                		var companySpan = Common.jumpPersonOrCompany(dataName, dataCode, pingParam);
            				return companySpan + labelSpan;
            			},
            			mainCompanyName:function(full){
            				if(!full){
            					return '--';
            				}
            				var dataName = full.mainCompanyName;
            				var dataCode = full.mainCompanyWindCode;
            				var dataLanel = full.mainCompanyLabelName;
            				var pingParam　=　'';
            				if(dataCode){
            					pingParam = '&fromModule=showGroupSystem&fromField=归属主体企业&opId='+dataCode;//bury
            				}
            				var labelSpan = '';
            				if(dataLanel && dataLanel!=''){
            					var labelCodeArr = dataLanel.split(',');
            					labelSpan = "<br />";
		                		for(var i = 0;i<labelCodeArr.length;i++ ){
		                			var colorSel = '';
		                			switch(labelCodeArr[i]){
		                				case '上市公司':colorSel='group-ipo-label';break;
		                				case '发债企业':colorSel='group-bond-label';break;
		                				case '科创版':colorSel='group-sinc-label';break;
		                				case '新三板':colorSel='group-sinc-label';break;
		                				default:colorSel='group-ipo-label';break;
		                				
		                			}
		                			labelSpan += '<span class="group-item '+colorSel+'">' + labelCodeArr[i] + '</span>';
	                			}
            				}
            				
	                		var companySpan = Common.jumpPersonOrCompany(dataName, dataCode, pingParam);
            				return companySpan + labelSpan;
            			},
            		},
            		param : { groupSystemId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
			},
		};
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    bankruptcy: function() {
        //破产重整详情        
        divSetting = {
        	isSingel : false,//是否只需要一个接口
            interface: null, //只需要一个接口时

            showDiv: ['ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
            	param: null,
            	
                showTitleImg: null, //是否在title中展示图片,以及字段
                title: null,
                table: null,
                tbValue: null,
                tbName: null,
                jumpUrl: null,
                jumpCode: null,
            },
            
			listDivName :[['basicInfo','205468','基本信息 '],['relatedNote','134865','关联公告']],//list多个模块名称	,是否先定义一个div块
			
			listSetting : {
				basicInfo :{
					interface: 'getbankruptcy',
					divType: 'basic',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					basicValue : ['caseNumber#bankruptcyTypeName','respondent|objCode#applicant|objCode','managerOrganization|objCode#managerPrincipalPerson|objCode','handleCourt#publicDate|time'],
					basicName : [('138190$案号')+'#'+('216417$破产类型'),('216409$被申请人')+'#'+('58656$申请人'),('216418$管理人机构')+'#'+('216419$管理人主要负责人'),('216420$经办法院') + '#' + ('149335$公开日期')],	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : { bankruptcyReformId: ItemDetail.detailId},
				},
				relatedNote :{
					interface: 'getbankruptcynotice',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :true,
					
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','noticeName|UDF','noticeTypeName','publicDate|time'],
					listTitle : ['138741$序号 ','90845$公告标题','6196$公告类型','149335$公开日期'],
					listwidth : ['5%','55%','20%','20%'],
					listAlign : [0,0,0,0],
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		UDF:{
            			noticeName:function(full){
            				if(!full){
            					return '--';
            				}
            				var itemName = full.noticeName? full.noticeName : '--';
            				var itemId = full.noticeId;
            				var result = itemName;
            				if(itemId && itemId!=''){
            					result = '<a target="_blank" class="wi-secondary-color wi-link-color" href="showItemDetail.html?type=bankruptcynotice&detailid='+itemId+'">'+itemName+'</a>';
            				}
            				return result;
            			},
            		},
            		
            		param : { noticeId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
			},
		};
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    bankruptcynotice: function(){
    	//关联公告详情
    	divSetting = {
        	isSingel : true,
            interface: 'getbankruptcydetail', //只需要一个接口时
            param : { noticeId: ItemDetail.detailId},

            showDiv: ['TitleDiv', 'ContDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
            	param: null,
            	
                showTitleImg: false, //是否在title中展示图片,以及字段
                title: 'caseNumber',
                table: null,
                tbValue: ['publicDate|time#noticeTypeName','publicPerson|code#obligor|objCode','attachmentAddress|UDF'],
                tbName: [('149335$公开日期') + '#' + ('6196$公告类型'),('216421$公开人') + '#' + ('43494$债务人'),('31805$附件')],
                jumpUrl: {attachmentAddress : 'attachmentAddress'},
                jumpCode: { publicPerson: 'publicPersonId'},
                UDF:{
                	attachmentAddress:function(full){
                		if(!full){
                			return '--';
                		}
                		var data = full.attachmentAddress;
                		var result = [];
                		if(data &&(data instanceof Array)){
                			for(var i=0;i<data.length;i++){
                				var dataUrl = '<a target="_blank" class="wi-secondary-color wi-link-color" href="'+data[i]+'">附件'+(i+1)+'</a>';
                				result.push(dataUrl);
                			}
                			return result.join(', ');
                		}else{
                			return '--';
                		}
                		
                	},
                },
            },
            
			listDivName : null,//list多个模块名称	,是否先定义一个div块
			contDivName :[['reContText','216422','关联公告正文']],//list多个模块名称	,是否先定义一个div块
			
			listSetting : {
				reContText : {
					interface: null,
					divType: 'cont',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					contValue : 'noticeText',
					
					basicValue : null,
					basicName : null,	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : null,
				}
			},
		};
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    franchise: function() {
        //商业特许经营详情        
        divSetting = {
        	isSingel : false,//是否只需要一个接口
            interface: null, //只需要一个接口时

            showDiv: ['ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
            	param: null,
            	
                showTitleImg: null, //是否在title中展示图片,以及字段
                title: null,
                table: null,
                tbValue: null,
                tbName: null,
                jumpUrl: null,
                jumpCode: null,
            },
            
			listDivName :[['basicInfo','205468','基本信息 '],['connectType','138683','联系方式'],['eleInfo','216424','电子资料'],['inMore','216423','境内加盟店'],['buInfo','216425','经营资源信息']],//list多个模块名称	,是否先定义一个div块

			
			listSetting : {
				basicInfo :{
					interface: 'getcommercialfranchisebasicinfo',
					divType: 'basic',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					basicValue : ['filingAnnouncementDate|time#recordNumber','corporateRepresentative#establishDate|time','residence#companyWebsite|url'],
					basicName : [('216407$备案公告日期')+'#'+('216408$备案号'),('5541$法人代表')+'#'+('138860$成立日期'),('207785$住所')+'#'+('6260$公司网站')],	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: {companyWebsite: 'companyWebsite'},
            		jumpCode: null,
            		
            		param : { franchiseInformationId: ItemDetail.detailId},
				},
				connectType :{
					interface: 'getcommercialfranchisecontact',
					divType: 'basic',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					basicValue : ['telephone#fax','mailBox'],
					basicName : [('4944$电话')+'#'+('3163$传真'),('91283$电子邮箱')],	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : { franchiseInformationId: ItemDetail.detailId},
				},
				eleInfo :{
					//电子资料
					interface: 'getcommercialfranchiseelectronic',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :true,
					
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','electronicDataName|url','electronicDataType'],
					listTitle : ['138741$序号 ','216426$电子资料名称','216427$电子资料类型'],
					listwidth : ['5%','47.5%','47.5%'],
					listAlign : [0,0,0],
					listFrom : null,
					
					jumpUrl: {electronicDataName : 'electronicDataAddressUrl'},
            		jumpCode: null,
            		
            		param : { franchiseInformationId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
				inMore :{
					interface: 'getcommercialfranchisestore',
					divType: 'basic',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					basicValue : ['firstFranchiseStoreTime|time','franchiseDistributionArea|UDF'],
					basicName : [('216428$第一家加盟店时间'),('216429$加盟分布区域')],	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		UDF:{
            			franchiseDistributionArea:function(full){
            				if(!full && full.franchiseDistributionArea){
            					return '--';
            				}
            				var dataValue = full.franchiseDistributionArea;
            				var result = []
            				for(var i=0;i<dataValue.length;i++){
            					var areaName = dataValue[i].distributionArea;
	            				var areaNum = dataValue[i].distributionQuantity;
	            				result.push(areaName + '(' + areaNum + ')');
            				}
            				if(result.length == 0){
            					return '--';
            				}
            				return result.join(',');
            				
            			}
            		},
            		
            		param : { franchiseInformationId: ItemDetail.detailId},
				},
				buInfo :{
					//经营资源信息
					interface: 'getcommercialfranchiseresources',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :true,
					
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','rightNumber','rightNatureName','rightDate|time','rightTerm|time','rightNatureName','registrationCategory','licensedBrand'],
					listTitle : ['138741$序号 ','216430$权利号','216431$权利性质','216432$权利日期','216433$权利期限','216434$权利类型','216435$注册类别','216436$特许品牌'],
					listwidth : ['5%','14%','14%','14%','14%','13%','13%','13%'],
					listAlign : [0,0,0,0,0,0,0,0],
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : { franchiseInformationId: ItemDetail.detailId, PageNo: 0,PageSize:10 },
				},
			},
		};
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    securitiesDishonest: function(){
    	//证券期货市场失信信息详情
    	divSetting = {
        	isSingel : true,
            interface: 'getsfmarketdiscreditedinfodetail', //只需要一个接口时
            param : { detailId: ItemDetail.detailId},

            showDiv: ['TitleDiv', 'ContDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
            	param: null,
            	
                showTitleImg: false, //是否在title中展示图片,以及字段
                title: 'title',
                table: null,
                tbValue: ['personName|code#personNumber|UDF','time|time#type','orgName|code'],
                tbName: [('222852$违法违规失信者名称') + '#' + ('222853$身份证号码/组织机构代码/统一社会信用代码'),('138466$处罚时间') + '#' + ('138462$处罚类别'),('138464$处罚机关')],
                jumpUrl: null,
                jumpCode: { personName: 'personId', orgName: 'orgId'},
                UDF:{
                	personNumber:function(full){
                		if(!full){
                			return '--';
                		}
                		
                		var personNumber = full.personNumber ? full.personNumber : '';//身份证号码
                		var personOrgCode = full.personOrgCode ? full.personOrgCode : '';//组织机构代码
                		var personSocialCode = full.personSocialCode ? full.personSocialCode : '';//统一社会信用代码
                		
                		var result = personNumber ? personNumber : (personSocialCode ? personSocialCode : (personOrgCode ? personOrgCode : '--'));
                		return result;
                		
                	},
                },
            },
            
			listDivName :null,//list多个模块名称	,是否先定义一个div块
			contDivName :[['reContText','222855','公告正文']],//list多个模块名称	,是否先定义一个div块
			
			listSetting : {
				reContText : {
					interface: null,
					divType: 'cont',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					contValue : 'content',
					
					basicValue : null,
					basicName : null,	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : null,
				}
			},
		};
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
    hotels: function() {
        //旗下酒店
        divSetting = {
        	isSingel : true,
            interface: 'gethotelsdetail', //请求接口
			param : { detailId: ItemDetail.detailId},
			
            showDiv: ['TitleDiv', 'ListDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: null, //请求接口
                param: null,
                showTitleImg: 'appRowkey', //是否在title中展示图片,以及字段
                titleContCss : 'four-line-middle',
                title: 'hotelName',
                table: null,
                tbValue: ['hotelType#hotelStar', 'openDate|time#belongCorp|code', 'address'],
                tbName: [('222806$酒店类型') + '#' + ('222808$酒店星级'), ('222807$开业日期') + '#' + ('112710$所属企业'), ('19414$地址' )],
                
                jumpUrl: null,
            	jumpCode: { belongCorp: 'belongCorpId' },
            },

			listDivName :[['basicInfo','205468','基本信息']],//list多个模块名称  ,是否先定义一个div块
			modelNum : [null],//各个模块的统计数字
			
			listSetting : {
				basicInfo : {
					interface: null,
					param : null,
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['hotelName#englishName','hotelType#hotelStar','brandName#brandAlias','operatingCondition#belongCorp|code','openDate|time#decorationDate|time','businessDate|time#checkInDate','checkOutDate#paymentMethod','roomCount#phone','area#address','nearbyBussinessDistrict#nearbyBussiness','nearbytransportation','nearbyenvironment','serviceAndFacilities','childrenPolicy','introduction','brandIntroduction',],
                    basicName : [('222805$酒店名称') + '#' + ('35079$英文名称'),('222806$酒店类型') + '#' + ('222808$酒店星级'),('138665$品牌名称') + '#' + ('222858$品牌别名'),('138418$经营状况') + '#' + ('112710$所属企业'),('222807$开业日期') + '#' + ('222859$装修日期'),('222864$营业时间') + '#' + ('222860$入住时间'),('222862$退房时间') + '#' + ('17826$支付方式'),('222861$房间数') + '#' + ('205472$联系电话'),('121011$所在地区') + '#' + ('19414$地址'),('222863$所在商务区') + '#' + ('222865$附近商圈'),('222866$附近交通'),('222867$附近环境'),('222868$服务及设施'),('222869$儿童政策'),('222809$酒店简介'),('222872$品牌简介')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    jumpUrl: null,
                    jumpCode: { belongCorp: 'belongCorpId' },
				},
			},	            
        };
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
	},
	bid:function(){
		//招投标
		divSetting = {
			isSingel : false,
			isBlend: true,
            interface: 'getbiddingdetailnew', //请求接口
			param : { detailId: ItemDetail.detailId},
			
            showDiv: ['TitleDiv', 'ListDiv', 'ContDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
            	interface: 'getbiddingdetailnew', //请求接口
                param : { detailId: ItemDetail.detailId},
                showTitleImg: null, //是否在title中展示图片,以及字段
                titleContCss : null,
                title: 'projectName',
                table: null,
                tbValue: ['purchase|code#bugetMoney|moneyYuan#announcement_time'],
                tbName: [('142476$采购单位') + '#' + ('228338$招标项目金额')+ '#' + ('138774$发布时间')],
                
                jumpUrl: {source_name:'source_url'},
            	jumpCode: { purchase: 'purchaseId' },
                tbState : 'opStatus|UDF',
                UDF : {
                    opStatus : function(full){
                        if(full['bidding_type_name']){
                            var result = '<span class="type-bid">'+full['bidding_type_name']+'</span>';
                            return result;
                        }else{
                            return ''
                        }
                    }
                },
            },

			listDivName :[['basicInfo','205502','项目信息'], ['listInfo','228342','参与主体信息'], ['listInfo02','228345','关联主体信息'],['basicInfo02','228347','招标信息'],['basicInfo03','228351','中标成交信息']],//list多个模块名称  ,是否先定义一个div块
			contDivName : [['contInfo','138142','公告内容']],
			modelNum : [null],//各个模块的统计数字
			
			listSetting : {
				basicInfo : {
					interface: 'getbiddingdetailnew',
					param : { detailId: ItemDetail.detailId},
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['projectName','projectNo#stageCode','area#bugetMoney|moneyYuan','contactPeople#contactPhone','fee#deposiUnit'],
                    basicName : [('205469$项目名称'),('114650$项目编号') + '#' + ('228339$招投标阶段'),('138699$省份地区') + '#' + ('120990$项目金额'),('222821$项目联系人') + '#' + ('222823$项目联系电话'),('228340$代理服务费') + '#' + ('228341$投标保证金')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    jumpUrl: null,
					jumpCode: { belongCorp: 'belongCorpId' },
				},
				listInfo : {
					//参与主体信息
					interface: 'getbiddingdetailsub',
					divType: 'list',
					listPage : true,//是否需要翻页功能，这个要单独写
					modelNum :true,
					
					basicValue : null,
					basicName : null,
					
					listValue : ['NO.','name|code','subjectType','subjectAdr','contact','amount|moneyYuan'],
					listTitle : ['138741$序号 ','228343$参与主体名称','142474$参与角色','19414$地址','138683$联系方式','228344$中标/成交金额'],
					listwidth : ['5%','20%','10%','20%','10%','15%'],
					listAlign : [0,0,0],
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: {name:'id'},
            		
            		param : { detailId: ItemDetail.detailId, PageNo: 0, PageSize:10 },
				},
                listInfo02 : {
                    //关联主体信息
                    interface: 'getbiddingdetailrelatesub',
                    divType: 'list',
                    listPage : true,//是否需要翻页功能，这个要单独写
                    modelNum :true,
                    
                    basicValue : null,
                    basicName : null,
                    
                    listValue : ['NO.','affiliate|code','affiliate_role'],
                    listTitle : ['138741$序号 ','228346$关联主体名称','138496$角色'],
                    listwidth : ['5%','57.5%','37.5%'],
                    listAlign : [0,0,0],
                    listFrom : null,
                    
                    jumpUrl: null,
                    jumpCode: {affiliate:'affiliate_id'},
                    
                    param : { detailId: ItemDetail.detailId, PageNo: 0, PageSize:10 },
                },
                basicInfo02 : {
                    interface: 'getbiddingdetailnew',
                    param : { detailId: ItemDetail.detailId},
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['procurementMethod#startTime','endTime#address'],
                    basicName : [('148672$采购方式') + '#' + ('228348$开标时间'),('228349$投标截止时间') + '#' + ('228350$开标地址')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    jumpUrl: null,
                    jumpCode: { belongCorp: 'belongCorpId' },
                },
                basicInfo03 : {
                    interface: 'getbiddingdetailnew',
                    param : { detailId: ItemDetail.detailId},
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['dealTime#dealMoney|moneyYuan'],
                    basicName : [('228352$中标/成交日期') + '#' + ('228353$总中标/成交金额')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    jumpUrl: null,
                    jumpCode: null,
                },
				contInfo : {
					interface: 'getbiddetailnew',
					divType: 'cont',
					listPage : false,//是否需要翻页功能，这个要单独写
					
					contValue : 'content',
					
					basicValue : null,
					basicName : null,	

					listValue : null,
					listTitle : null,
					listwidth : null,
					listAlign : null,
					listFrom : null,
					
					jumpUrl: null,
            		jumpCode: null,
            		
            		param : { detailId: ItemDetail.detailId},
				},
			},	            
        };
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
	},
    judgment:function(){
        //裁判文书
        divSetting = {
            isSingel : false,
            isBlend: true,
            interface: 'getjudgeinfodetail', //请求接口
            param : { detailId: ItemDetail.detailId},
            
            showDiv: ['TitleDiv', 'ListDiv', 'ContDiv'], //TitleDiv,ListDiv,ContDiv：展示div块顺序
            titleSetting: {
                interface: 'getjudgeinfodetail', //请求接口
                param : { detailId: ItemDetail.detailId},
                showTitleImg: null, //是否在title中展示图片,以及字段
                titleContCss : null,
                title: 'case_title',
                table: null,
                tbValue: ['case_no#case_type'],
                tbName: [('138190$案号') + '#' + ('138192$案件类型')],
                
                jumpUrl: {source_name:'source_url'},
                jumpCode: null,
            },

            listDivName :[['basicInfo','138188','案件信息'], ['listInfo','222854','当事人信息']],//list多个模块名称  ,是否先定义一个div块
            contDivName : [['contInfo','222856','文书正文']],
            modelNum : [null],//各个模块的统计数字
            
            listSetting : {
                basicInfo : {
                    interface: 'getjudgeinfodetail',
                    param : { detailId: ItemDetail.detailId},
                    divType: 'basic',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    contValue : null,
                    basicValue : ['case_title','case_no#case_type_detail','case_type#penalty_amount','judge_result|UDF#judge_time|time','court_name#area_name'],
                    basicName : [('138191$案件标题'),('138190$案号') + '#' + ('138196$案由'),('138192$案件类型') + '#' + ('222870$案件金额'),('145344$判决结果') + '#' + ('138357$判决时间'),('222871$判决法院') + '#' + ('34378$省份')],   
                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    jumpUrl: null,
                    jumpCode: { belongCorp: 'belongCorpId' },
                    UDF : {
                        judge_result : function(full){
                            var result = '--'
                            if(full['judge_result'] && full['judge_result'].length > 0){
                                result = full['judge_result'][0].split('|')[1];
                            }
                            return result;
                        }
                    }
                },
                listInfo : {
                    //电子资料
                    interface: 'getjudgeparty',
                    divType: 'list',
                    listPage : true,//是否需要翻页功能，这个要单独写
                    modelNum :true,
                    
                    basicValue : null,
                    basicName : null,
                    
                    listValue : ['NO.','judge_role','corp_name|code'],
                    listTitle : ['138741$序号 ','222873$当事人角色','222874$当事人名称'],
                    listwidth : ['5%','37.5%','57.5%'],
                    listAlign : [0,0,0],
                    listFrom : null,
                    
                    jumpUrl: null,
                    jumpCode: {corp_name:'corp_id'},
                    
                    param : { caseId: ItemDetail.detailId, PageNo: 0, PageSize:10 },
                },
                contInfo : {
                    interface: 'getjudgeinfodetail',
                    divType: 'cont',
                    listPage : false,//是否需要翻页功能，这个要单独写
                    
                    contValue : 'judge_content',
                    
                    basicValue : null,
                    basicName : null,   

                    listValue : null,
                    listTitle : null,
                    listwidth : null,
                    listAlign : null,
                    listFrom : null,
                    
                    jumpUrl: null,
                    jumpCode: null,
                    
                    param : { detailId: ItemDetail.detailId},
                },
            },              
        };
        ItemDetail.showEverModel(divSetting, null, divSetting.isSingel);
    },
	example : function(){
		//产品详情
        divSetting = {
            interface: 'getbranddetail', //请求接口

            showDiv: ['TitleDiv', 'ListDiv'], //TitleDiv-1,ListDiv-2,ContDiv-3,ListPageDiv-4：展示div块顺序
            titleSetting: {
                showTitleImg: 'brand_graphic_link', //是否在title中展示图片,以及字段
                title: 'brand_name',
                tbValue: ['brand_audit_report_time|time#brand_type|code', 'brand_state'],
                tbName: [intl('205468' /* 基本信息 */ ) + '#' + intl('205468' /* 基本信息 */ ), intl('205468' /* 基本信息 */ )]
            },

            listType: ['basic', 'list'], //在列表中列表类型
            listDivName: [intl('138144' /* 基本信息 */ ), intl('138144' /* 应用市场发布信息 */ )], //list多个模块名称	
            modelNum: [null, 0], //各个模块的统计数字

            listSetting: {
                basicValue: ['brand_state#brand_state', 'brand_state', 'brand_state#brand_state', 'brand_state'],
                basicName: [intl('138147' /* 基本信息 */ ) + '#' + intl('138147' /* 基本信息 */ ), intl('138147' /* 基本信息 */ ), intl('205468' /* 基本信息 */ ) + '#' + intl('205468' /* 基本信息 */ ), intl('205468' /* 基本信息 */ )],
                listValue: ['NO.', 'brand_name', 'brand_name', 'brand_name'],
                listTitle: [intl('138741' /* 序号 */ ), intl('138147' /* 基本信息 */ ), intl('138147' /* 基本信息 */ ), intl('138147' /* 基本信息 */ )],
                listwidth: ['25%', '25%', '25%', '25%'],
                listAlign: [0, 0, 0, 0],
                listFrom: 'brandType',
            },

            jumpUrl: { bb: 'www.baidu.com' },
            jumpCode: { brand_type: 'brand_agent_org_id' }
        };

        param = { detailid: ItemDetail.detailId };
        ItemDetail.showAllModel(divSetting, param);
    },

    loadError: function() {
        //加载数据出错 => TO DO
        $('#wrapper-404').show();
    },
    
    
    showEverModel: function(divSetting, param, isSingel) {
    	//用来渲染具体模块
    	if(isSingel){// 一个接口绘制所有模块
    		myWfcAjax(divSetting.interface, divSetting.param, function(data) {
    			//初始化加载
    			var res = JSON.parse(data);
            	if (res.ErrorCode == 0 && res.Data) {
                    console.log(res.Data)
            		for (var i in divSetting.showDiv) {
			    		switch(divSetting.showDiv[i]) {
			    			case 'TitleDiv':
			    				ItemDetail.drawEverTitle(res);
			    				break;
			    			case 'ListDiv':
			    				var htmlArr = [];
						        htmlArr.push('<div class="each-module" id="listDiv">');
						        htmlArr.push('</div>');
						        $('#item-detail').append(htmlArr.join(''));
			    				ItemDetail.drawEverList(res);
			    				break;
			    			case 'ContDiv':
			    				var htmlArr = [];
						        htmlArr.push('<div class="each-module" id="contDiv">');
						        htmlArr.push('</div>');
						        $('#item-detail').append(htmlArr.join(''));
			    				ItemDetail.drawEverCont(res);
			    				break;
			    			default:break;
			    		}
			        }
            	}else{
            		ItemDetail.loadError();
            	}
    		},ItemDetail.loadError);
		}else if (divSetting.isBlend){//除了一个接口绘制几个模块外，还有请求一个接口绘制一个模块的情况
			myWfcAjax(divSetting.interface, divSetting.param, function(data) {
				var res = JSON.parse(data);
				if (res.ErrorCode == 0 && res.Data) {
                    
                    console.log(res)
					for (var i in divSetting.showDiv) {
						var dynaRes = res;
			    		switch(divSetting.showDiv[i]) {
			    			case 'TitleDiv':
								if (divSetting.interface != divSetting.titleSetting.interface){
									dynaRes = '';
								}
			    				ItemDetail.drawEverTitle(dynaRes);
			    				break;
			    			case 'ListDiv':
			    				var htmlArr = [];
						        htmlArr.push('<div class="each-module" id="listDiv">');
						        htmlArr.push('</div>');
						        $('#item-detail').append(htmlArr.join(''));
			    				ItemDetail.drawEverList(dynaRes, 'blend');
			    				break;
			    			case 'ContDiv':
			    				var htmlArr = [];
						        htmlArr.push('<div class="each-module" id="contDiv">');
						        htmlArr.push('</div>');
						        $('#item-detail').append(htmlArr.join(''));
			    				ItemDetail.drawEverCont(dynaRes, 'blend');
			    				break;
			    			default:break;
			    		}
			        }
				}else{
            		ItemDetail.loadError();
            	}
			},ItemDetail.loadError);
		}else{// 一个接口绘制一个模块
    		//初始化加载
			for (var i in divSetting.showDiv) {
	    		switch(divSetting.showDiv[i]) {
	    			case 'TitleDiv':
	    				ItemDetail.drawEverTitle();
	    				break;
	    			case 'ListDiv':
	    				var htmlArr = [];
				        htmlArr.push('<div class="each-module" id="listDiv">');
				        htmlArr.push('</div>');
				        $('#item-detail').append(htmlArr.join(''));
	    				ItemDetail.drawEverList();
	    				break;
	    			case 'ContDiv':
	    				var htmlArr = [];
				        htmlArr.push('<div class="each-module" id="contDiv">');
				        htmlArr.push('</div>');
				        $('#item-detail').append(htmlArr.join(''));
	    				ItemDetail.drawEverCont();
	    				break;
	    			default:break;
	    		}
	        }
    	}
    },
    titleRender: function(res, divSetting){
    	if(res.Data.length){
    		res=res.Data[0]; 
    	}else{
    		res=res.Data; 
    	}
    	var htmlArr = [];
        var valueList = divSetting.titleSetting.tbValue;
        var nameList = divSetting.titleSetting.tbName;
        var img = res[divSetting.titleSetting.showTitleImg] ? res[divSetting.titleSetting.showTitleImg] : '';
        var imgTable = divSetting.titleSetting.table;
        var tbStateValue = '';
        if(divSetting.titleSetting.tbState){
        	tbStateValue = ItemDetail.itemvalue(res, divSetting.titleSetting.tbState, divSetting.titleSetting);
        }
        var changeCss = divSetting.titleSetting.titleContCss?divSetting.titleSetting.titleContCss:'';
        if (divSetting.titleSetting.showTitleImg) {
            if (img == '8106402') {
                img = '../resource/images/Company/no-product.png';
            }
            if (img.indexOf("http") == -1) {
                img = 'http://news.windin.com/ns/imagebase/' + imgTable + '/' + img;
            }
            htmlArr.push('<div class="module-header"><div class="pic_block"><img width="90" onerror=\'src="../resource/images/Company/no-product.png"\' alt=""></div>');
            htmlArr.push('<div class="module-header-content '+ changeCss+'">');
            htmlArr.push('<span class="detail-header"></span>'+tbStateValue+'</div>');
            htmlArr.push('</div>');
            $('#titleDiv').append(htmlArr.join(''));
            $('.pic_block img').attr('src', img);
        } else {
            htmlArr.push('<div id="tab-content">');
            if(tbStateValue){
                htmlArr.push('<span class="detail-header" style="display:inline-block"></span>' + tbStateValue);
            }else{
                htmlArr.push('<span class="detail-header"></span>' + tbStateValue);
            }
            htmlArr.push('</div>');
            $('#titleDiv').append(htmlArr.join(''));
        }
        htmlArr = [];
        $('.detail-header').html(ItemDetail.itemvalue(res, divSetting.titleSetting.title, divSetting.titleSetting));
        $('.detail-header').parent().append('<div class="header-item"></div>');
        for (var i in valueList) {
            var itemInfo = valueList[i].split('#');
            var nameInfo = nameList[i].split('#');
            for (var j in itemInfo) {
            	var globelKey = nameInfo[j].split('$')[0];
            	var globelValue = nameInfo[j].split('$')[1];
                var iValue = ItemDetail.itemvalue(res, itemInfo[j], divSetting.titleSetting);
                htmlArr.push('<span class="item-span" langkey="'+globelKey+'">' + intl(globelKey,globelValue) + ' : ' + iValue + '</span>');
            }
            if (i != valueList.length - 1) {
                htmlArr.push('<br/>');
            }
        }
        $('.header-item').html(htmlArr.join(''));
    },
    drawEverTitle: function(res) {
        //画div title 头
        //先占位
        var getdivHtml = [];
        getdivHtml.push('<div class="each-module title-padding" id="titleDiv"></div>');
        $('#item-detail').append(getdivHtml.join(''));
        
        if(res){//单个接口
        	ItemDetail.titleRender(res, divSetting);
        	return false;
        }
        
        //ajax请求数据并画内容
        myWfcAjax(divSetting.titleSetting.interface, divSetting.titleSetting.param, function(data) {
        	var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data) {
            	ItemDetail.titleRender(res, divSetting);
            }else{
            	$('#titleDiv').hide();
            }
        });
    },
    drawEverList: function(res , blend) {
        //画具体详情表
        for (var i in divSetting.listDivName){
			var dynaRes = res;
        	var listDivItem = divSetting.listDivName[i];
        	var everListHtml = [];
        	everListHtml.push('<div class="basic-block" id="'+listDivItem[0]+'"><div class="table-name" langkey="'+listDivItem[1] +'">' + intl(listDivItem[1],listDivItem[2]) + '<span id="'+listDivItem[0]+'Num" class="item-detail-num"></span>'  + '</div></div>');
			$('#listDiv').append(everListHtml);
			if (blend && blend=='blend' && divSetting.listSetting[listDivItem[0]].interface != divSetting.interface){
				dynaRes = ''
			}
			ItemDetail.listDivRender(dynaRes,listDivItem[0]);//对每一块数据进行数据请求,并进行渲染       	
        }
	},
	drawEverCont: function(res, blend) {
        //画正文详情表
        for (var i in divSetting.contDivName){
			var dynaRes = res;
        	var listDivItem = divSetting.contDivName[i];
        	var everListHtml = [];
        	everListHtml.push('<div class="basic-block" id="'+listDivItem[0]+'"><div class="table-name" langkey="'+listDivItem[1] +'">' + intl(listDivItem[1],listDivItem[2]) + '<span id="'+listDivItem[0]+'Num" class="item-detail-num"></span>'  + '</div></div>');
			$('#contDiv').append(everListHtml);
			if (blend && blend=='blend' && divSetting.listSetting[listDivItem[0]].interface != divSetting.interface){
				dynaRes = ''
			}
        	ItemDetail.listDivRender(dynaRes,listDivItem[0]);//对每一块数据进行数据请求,并进行渲染
        }
    },
    selectDivRender : function(res,itemDivId,itemSetting){
    	var htmlArrRender = [];
    	switch(itemSetting.divType){
    		case 'basic'://产生基础表格 
    			htmlArrRender.push(ItemDetail.drawEverBasicHtml(res,itemSetting));
    			$('#'+itemDivId).append(htmlArrRender.join(''));
    			break;
    		case 'list'://产生列表数据 
    			$('#'+itemDivId+' table').remove();
    			$('#'+itemDivId+' .dataTables_turnning').remove();
    			htmlArrRender.push(ItemDetail.drawEverListHtml(res, itemSetting));
    			$('#'+itemDivId).append(htmlArrRender.join(''));
    			//判断是否需要进行翻页功能
    			if(itemSetting.listPage){
    				var Records = res.Page['Records'];
    				if(Records > 10){
    					ItemDetail.pageTurning(itemSetting.param.PageNo + 1, Records, itemSetting.param.PageSize, itemDivId);
    				}
    			}
    			break;
			case 'cont':
				htmlArrRender.push(ItemDetail.drawEverContHtml(res,itemSetting));
    			$('#'+itemDivId).append(htmlArrRender.join(''));
    			break;
    		default:
    			break;
    	}
    },
    listDivRender : function(res,itemId){
    	//进行渲染每一个列表div模块
    	var itemSetting = divSetting.listSetting[itemId];
    	if(res){
    		var itemDivId = itemId;
    		res.Data = itemSetting.divType =='list'? res['Data'][itemSetting.listFrom] : res.Data;
    		ItemDetail.selectDivRender(res,itemDivId,itemSetting);
            var type=res.Data.bidding_type_name;
            var zhaobiaoArr=['公开招标公告','询价公告','竞争性谈判公告','单一来源公告','邀请招标公告','竞争性磋商公告','竞价招标公告'];
            var zhongbiaoArr=['中标公告','成交公告','竞价结果公告'];
            if(type&&zhaobiaoArr.indexOf(type)>=0){
                $("#basicInfo03").hide().remove();
            }
            if(type&&zhongbiaoArr.indexOf(type)>=0){
                $("#basicInfo02").hide().remove();
            }
            if(!type||(zhaobiaoArr.indexOf(type)==-1&&zhongbiaoArr.indexOf(type)==-1)){
                $("#basicInfo02,#basicInfo03").hide().remove();
            }
    		return false;
    	}
    	myWfcAjax(itemSetting.interface, itemSetting.param, function(data) {    		
    		var itemDivId = itemId;
			var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data) {
            	ItemDetail.selectDivRender(res,itemDivId,itemSetting);
            	if(itemSetting.modelNum){
            		var allNum = res.Page.Records? "&nbsp;(" + res.Page.Records + ")" :'';
            		$('#' + itemDivId + 'Num').html(allNum);
            	}
            }else{
				if(itemSetting && itemSetting.divType == 'cont' && $('#'+itemDivId).parent().children().length == 1){
					$('#'+itemDivId).parent().remove();
				}else{
					$('#'+itemDivId).remove();
				}
            }
    	});
    },
    
    drawEverBasicHtml: function(res,itemSetting) {
        //用来画基础详情table
        if(res.Data.length){
    		res=res.Data[0]; 
    	}else{
    		res = res.Data;
    	}
        var htmlArr = [];
        var basV = itemSetting.basicValue;
        var basN = itemSetting.basicName;
        htmlArr.push('<table class="tab-basicInfo"><tbody>');
        for (var i in basV) {
            var dataInfo = basV[i].split('#');
            var dataN = basN[i].split('#');
            if (dataInfo.length > 1) {
            	var globelKey0 = dataN[0].split('$')[0];
            	var globelValue0 = dataN[0].split('$')[1];
            	var globelKey1 = dataN[1].split('$')[0];
            	var globelValue1 = dataN[1].split('$')[1];
                htmlArr.push('<tr>');
                htmlArr.push('<td class="tit-tab-basicInfo" langkey="'+globelKey0+'">' + intl(globelKey0,globelValue0) + '</td>');
                htmlArr.push('<td class="content-tab-basicInfo">' + ItemDetail.itemvalue(res, dataInfo[0],itemSetting) + '</td>');
                htmlArr.push('<td class="tit-tab-basicInfo" langkey="'+globelKey1+'">' + intl(globelKey1,globelValue1) + '</td>');
                htmlArr.push('<td class="content-tab-basicInfo">' + ItemDetail.itemvalue(res, dataInfo[1],itemSetting) + '</td>');
                htmlArr.push('</tr>');
            } else {
            	var globelKey0 = dataN[0].split('$')[0];
            	var globelValue0 = dataN[0].split('$')[1];
                htmlArr.push('<tr>');
                htmlArr.push('<td class="tit-tab-basicInfo" langkey="'+globelKey0+'">' + intl(globelKey0,globelValue0) + '</td>');
                htmlArr.push('<td colspan="3" class="content-tab-basicInfo">' + ItemDetail.itemvalue(res, dataInfo[0],itemSetting) + '</td>');
                htmlArr.push('</tr>');
            }
        }
        htmlArr.push('</tbody></table>')
        return htmlArr.join('');
    },
    drawEverContHtml: function(res,itemSetting) {
        //用来画内容详情table
        if(res.Data.length){
    		res=res.Data[0]; 
    	}else{
    		res = res.Data;
    	}
        var contV = res[itemSetting.contValue]?res[itemSetting.contValue]:'--' ;
        var htmlArr = [];
        htmlArr.push('<div class="tab-basicInfo cont-text-height">');
        htmlArr.push(contV);
        htmlArr.push('</div>');
        return htmlArr.join('');
    },
    drawEverListHtml: function(res, itemSetting) {
        //用来画重复的列表展示
        //这里可能会需要写请求ajax数据
        var htmlArr = [];
        var lisV = itemSetting.listValue;
        var lisT = itemSetting.listTitle;
        var lisW = itemSetting.listwidth;
        var lisA = itemSetting.listAlign;
        var align = ['left', 'center', 'right'];
        var data = res.Data;
        if (!data) {
            return -1;
        }
        var litNum = itemSetting.listPage ? (itemSetting.param.PageNo * itemSetting.param.PageSize +1) :1;
        htmlArr.push('<table class="tab-basicInfo tab-list"><tbody><tr>');
        for (var i in lisV) { //画表头
        	var globelKey = lisT[i].split('$')[0];
        	var globelValue = lisT[i].split('$')[1];
            htmlArr.push('<th class="bold_important_item " align="' + align[lisA[i]] + '"+ width="' + lisW[i] + '" langkey="'+globelKey+'">' + intl(globelKey,globelValue) + '</th>');
        }
        htmlArr.push('</tr>');
        if (typeof data == 'object') { //=>TO DO
            for (var j in data) {
                htmlArr.push('<tr>');
                for (var n in lisV) {
                    if (lisV[n] == 'NO.') {
                        htmlArr.push('<td>' + litNum + '</td>');
                        continue;
                    }
                    htmlArr.push('<td>' + ItemDetail.itemvalue(data[j], lisV[n],itemSetting) + '</td>');
                }
                htmlArr.push('</tr>');
                litNum++;
            }
        }
        htmlArr.push('</tbody></table>');
        return htmlArr.join('');
    },
    itemvalue: function(res, data, itemSetting) {
        //用来对字段进行处理
        var dataInfo = data.split('|');
        var dataName = dataInfo[0];
        var dataValue = res[dataName] ? res[dataName] : '--';
        var jumpCode = itemSetting.jumpCode;
        var jumpUrl = itemSetting.jumpUrl;
        var result = '--';
        if (dataInfo.length > 1) {
            var dataType = dataInfo[1];
            switch (dataType) {
                case 'code':
                    result = res[jumpCode[dataName]] ? Common.jumpPersonOrCompany(dataValue, res[jumpCode[dataName]]) : dataValue;
                    break;
                case 'time':
                    result = res[dataName] ? Common.formatTime(res[dataName]) : '--';
                    break;
                case 'url':
					result = res[jumpUrl[dataName]]?'<a target="_blank" class="wi-secondary-color wi-link-color" href="'+res[jumpUrl[dataName]]+'">'+dataValue+'</a>':dataValue;
					break;
				case 'money':
					result = res[dataName]?Common.formatMoney(res[dataName]):'--';
					break;
                case 'moneyYuan':
                    result = res[dataName]?Common.formatMoney(res[dataName],[2, '元']):'--';
                    break;
				case 'thousands':
					result = res[dataName]?Common.formatMoney(res[dataName],[4, '&nbsp;']):'--';
					break;
				case 'percent':
					result = res[dataName]?Common.formatPercent(res[dataName]):'--';
					break;
				case 'UDF':
					result = itemSetting.UDF[dataName](res);
					break;
				case 'objCode':
					if (res[dataName] && (res[dataName] instanceof Array)){//多值 array(obj)返回
						var dataLength = res[dataName].length;
                		var arrResult = [];
                		for (var i=0;i<dataLength;i++){
                			var dataItem = res[dataName][i];
                			if(Common.isEmptyObject(dataItem)){
                				continue;
                			}else{
                				var dataId = dataItem['id'];
	                        	dataValue = dataItem['name'];
                                arrResult.push(dataId ? Common.jumpPersonOrCompany(dataValue , dataId) : dataValue);
                			}
                		}
                		result = arrResult?arrResult.join(', '):'--';
                		result = result ? result : '--';
					}else if (res[dataName] && !Common.isEmptyObject(res[dataName])) {//单值 obj返回
                		dataValue = res[dataName].name;
						var dataId = res[dataName].id;
						result = dataId ? Common.jumpPersonOrCompany(dataValue , dataId) : dataValue ;
                	}else{
                		result = '--';
                	}
					break;
				case 'formatFloat':{
					result = res[dataName]?Common.formatFloat(res[dataName],1):'--';
					break;
				}
				default:break;
			}
			return result;
		}else{
			return dataValue;
		}
	},
	pageTurning: function(changePage, Records, pagesize, itemId) {
        //翻页功能
        if (changePage) { //翻页功能
            var buttonArr = [];
            buttonArr.push('<div class="dataTables_turnning" data-block="'+itemId+'">');
            var allNum = Records;
            var pageNum = Math.ceil(Records / pagesize);
            //      			pageNum = 100;
            var jumpfoward = '<a class="page_button" data-jump="up" data-num="' + pageNum + '"><</a>';
            var jumpafter = '<a class="page_button" data-jump="down" data-num="' + pageNum + '">></a>';
            var ellipsisSpan = '<span class="ellipsis">…</span>';
            buttonArr.push(jumpfoward);
            var buttonItem = '';
            if (pageNum < 8) {
                for (var bi = 1; bi <= pageNum; bi++) {
                    buttonItem = '<a class="page_button ' + (bi == changePage ? 'now-page' : '') + '">' + bi + '</a>';
                    buttonArr.push(buttonItem);
                }
            } else {
                buttonItem = '<a class="page_button ' + (changePage == 1 ? 'now-page' : '') + '">' + 1 + '</a>';
                buttonArr.push(buttonItem);
                if (changePage <= 4) {
                    for (var bi = 2; bi <= 5; bi++) {
                        buttonItem = '<a class="page_button ' + (bi == changePage ? 'now-page' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                    buttonArr.push(ellipsisSpan);
                } else if (changePage >= pageNum - 3) {
                    buttonArr.push(ellipsisSpan);
                    for (var bi = pageNum - 4; bi < pageNum; bi++) {
                        buttonItem = '<a class="page_button ' + (bi == changePage ? 'now-page' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                } else {
                    buttonArr.push(ellipsisSpan);
                    for (var bi = changePage - 1; bi < changePage + 2; bi++) {
                        buttonItem = '<a class="page_button ' + (bi == changePage ? 'now-page' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                    buttonArr.push(ellipsisSpan);
                }
                buttonItem = '<a class="page_button ' + (changePage == pageNum ? 'now-page' : '') + '">' + pageNum + '</a>';
                buttonArr.push(buttonItem);
            }
            buttonArr.push(jumpafter);
            buttonArr.push('  跳至 <input class="pagiate-page-num" id="'+itemId+'-changePage" type="text"> 页 ');
            buttonArr.push('</div>');
            $('#'+itemId).append(buttonArr.join(""));
        }
    },
}


/* 国际化 ,所有自己的代码都在写在这个回调函数后*/
function showItemDetailInit(){
	setTimeout(function() {
		ItemDetail.init();
	}, 100);
}
var funcList =[showItemDetailInit]
Common.internationToolInfo(funcList);
