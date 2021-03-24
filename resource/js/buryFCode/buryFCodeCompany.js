//基础
//点击搜索按钮（不包括回车） - del
// $('#btnToolbarSearch').click(function() {
//     var keyword = $('#inputToolbarSearch').val();
//     if (keyword.length && !$('#inputToolbarSearch').hasClass('placeholder')) {
//         myWfcAjax('burypcfunctioncode', { functionCode: '922602100305' });
//     }
// });

//搜索框中回车 - del
// $('.input-toolbar-search').placeholder().keydown(function(event) {
//     var keyword = $('.input-toolbar-search').val();
//     switch (event.keyCode) {
//         case 13:
//             if (keyword && keyword.trim()) {
//                 myWfcAjax('burypcfunctioncode', { functionCode: '922602100305' });
//             }
//             //return false; ???
//     }
// });

//历史搜索
// $('.input-toolbar-search-list').on('click', '.search-list-div', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100266' });
// });

// 清空搜索记录
// $('.input-toolbar-search-list').on('click', '.search-list-icon', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100308' });
// });

// 特征企业链接-del
// $('.input-toolbar-before-search').on('click', '.before-search-key', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100309' });
// });

// 预搜索企业链接
// $('.input-toolbar-before-search').on('click', '.before-search-div', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100310' });
// });

//访问旧版 - del
// $('#toolbar-oldedition').on('click', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100306' });
// });

//我的收藏 - miss
// $('#toolbar-mycustomer').on('click', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100261' });
// });

//我的监控 -del
// $('#toolbar-myriskcompany').on('click', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100190' });
// });

//点击置顶图标
// $(document).on('click', '.content-toolbar-top', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100293' });
// });

// 点击反馈图标
// $(document).on('click', '.content-toolbar-feedback', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100331' });
// });

//企业详情页
//企业详情加载
// myWfcAjax('burypcfunctioncode', {
//     functionCode: '922602100272',
//     type: 'CEL'
// });

//标签-点击查看更多
// $(document).on('click', '#moreTagsCompany', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100313' });
// });

//下载报告
// $(document).on('click', '.btn-download-report', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100312' });
// });

//添加收藏
// $(document).on('click', '.btn-add', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100273' });
// });
//取消收藏在company.js中

//添加监控 -del
// $(document).on('click', '.btn-add-monitoring', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100187' });
// });
//取消监控在company.js中

//点击新闻记录 - del -> 922602100707
// $(document).on('click', '#newsModelList a', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100275' });
// });

//点击全部新闻链接
// $(document).on('click', '#newsModelBottom', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100276' });
// });

//点击关系图谱
// $(document).on('click', '#realationGraph', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100277' });
// });

//点击WI行业中心链接
// $(document).on('click', '#go2WI', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100278' });
// });

//点击股东信息中PEVC事件链接 - del
// $(document).on('click', '.M-box-Shareholder .LinkPEVC', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100279' });
// });

//点击股东信息中并购事件链接
// $(document).on('click', '.M-box-Shareholder .LinkToMerge', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100280' });
// });

//点击股东信息股权结构图
// $(document).on('click', '.jumpstockStructure', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100281' });
// });

//点击股东信息疑似实际控制人
// $(document).on('click', '.jumpActControl', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100282' });
// });

//点击主要人员导出数据 - del
// $(document).on('click', '#iconExcel', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100283' });
// });

//点击PEVC融资 中国PEVC库 - del
// $(document).on('click', '#showPVEC .icon-pevc', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100284' });
// });

//点击PEVC退出 中国PEVC库 - del
// $(document).on('click', '#pvecOut .icon-pevc', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100285' });
// });

//点击并购信息 中国并购库
// $(document).on('click', '#showMerge .icon-merge', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100286' });
// });

//点击待上市信息 新股中心
// $(document).on('click', '#showDeclarcompany .icon-newstock', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100287' });
// });

//点击股权出质中的二级tab（数量为0不可点击不埋点）
// $(document).on('click', '#showPledgedstock .tab-style a:not(.nojump)', function(event) {
//     var functionCode = '';
//     switch ($(event.target).attr('data-index')) {
//         case '0':
//             //点击出质人tab
//             functionCode = '922602100288';
//             break;
//         case '1':
//             //点击质权人tab
//             functionCode = '922602100289';
//             break;
//         case '2':
//             //点击出质标的tab
//             functionCode = '922602100290';
//             break;
//     }
//     if (functionCode !== '') {
//         myWfcAjax('burypcfunctioncode', { functionCode: functionCode });
//     }
// });

//点击上榜信息 企业排行榜
// $(document).on('click', '#listInformation .icon-rank', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100291' });
// });

//点击任意二级菜单进行定位（数量为0不跳转不埋点）
// $(document).on('click', '#subNavList a:not(.forbiddenJump)', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100292' });
// });

//点击任意一级菜单进行定位
// $(document).on('click', '#linkshowOverview, #linkfinancingInfo, #linkBussinessInfo, #linkRiskInfo, #linkBusinessRiskInfo, #linkIntellectualProperty', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100292' });
// });

//工商信息-点击实际控制人图谱图标
// $(document).on('click', '.realActControl', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100314' });
// });

//CEL-企业详情页-上榜信息-点击榜单详情
// $(document).on('click', '.rank-detail', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100327' });
// });

// CEL-企业详情页-债券信息-点击募集说明书下载链接
// $(document).on('click', '.load-bond', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100328' });
// });

// CEL-企业详情页-点击广告 - del
// $(document).on('click', '#companyBanner', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100366' });
// });

// CEL-企业详情页-点击更新 - del
// $(document).on('click', '#companyBanner', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100366' });
// });