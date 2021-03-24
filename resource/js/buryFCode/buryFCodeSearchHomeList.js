//基础
//点击搜索按钮（包括回车） - del
// $('#btnToolbarSearch').click(function() {
//     var keyword = $('#inputToolbarSearch').val();
//     if (keyword.length && !$('#inputToolbarSearch').hasClass('placeholder')) {
//         myWfcAjax("burypcfunctioncode", { functionCode: "922602100305" });
//     }
// });

//历史搜索
// $('.input-toolbar-search-list').on("click", ".search-list-div", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100266" });
// });

// 清空搜索记录
// $('.input-toolbar-search-list').on("click", ".search-list-icon", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100308" });
// });

// 特征企业链接 - del
// $('.input-toolbar-before-search').on("click", ".before-search-key", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100309" });
// });

// 预搜索企业链接
// $('.input-toolbar-before-search').on("click", ".before-search-div", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100310" });
// });

//访问旧版 -del
// $("#toolbar-oldedition").on("click", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100306" });
// });

//我的收藏 - miss
// $("#toolbar-mycustomer").on("click", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100261" });
// });

//我的监控 - del
// $("#toolbar-myriskcompany").on("click", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100190" });
// });

//点击置顶图标
// $(document).on('click', '.content-toolbar-top', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100293' });
// });

// 点击反馈图标
// $(document).on('click', '.content-toolbar-feedback', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100331' });
// });


//搜索结果页
//点击筛选项（排除不跳转选项）
// $(document).on("click", "#filterList a:not('.no-jump')", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100267" });
// });

//点击 收起/展开 筛选
// $(document).on("click", "#btnFilter", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100126" });
// });

//点击最近浏览企业记录
// $(document).on("click", ".history_list", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100269" });
// });

//点击排序（重复点击同一项不成立）
// $("#sortDialog").on("click", 'li', function(event) {
//     var target = event.target;
//     var oldSelectedEle = $(target.parentElement).find('.active');
//     if (target !== oldSelectedEle[0]) {
//         myWfcAjax("burypcfunctioncode", { functionCode: "922602100270" });
//     }
// });
//翻页在searchHome.js中

//搜索结果页点击下载报告 - del
// $(document).on('click', '.div_Card_icon', function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100311" });
// });

//加载页面
// myWfcAjax("burypcfunctioncode", {
//     functionCode: "922602100325",
//     type: location.search.indexOf('linksource') > -1 ? 'CEL' : 'WS',
// });

// CEL-查企业查人物-结果页-切换
// $(document).on('click', '#changeTitleSearch li', function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100337" });
// });

// CEL-查人物-搜索结果页-点击最近浏览人物记录
// $(document).on('click', '#FocusHistroyPerson li', function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100335" });
// });

// 搜索结果页面-监控 - del
// $(document).on("click", ".list-icon-monitoring", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100368" });
// })

// 搜索结果页面-收藏
// $(document).on("click", ".list-icon-customer", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100367" });
// })