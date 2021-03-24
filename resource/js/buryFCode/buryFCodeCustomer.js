// 基础
//点击搜索按钮（不包括回车） - del
// $('.input-toolbar-button').click(function() {
//     var keyword = $('.input-toolbar-search').val();
//     if (keyword.length && !$('#inputToolbarSearch').hasClass('placeholder')) {
//         myWfcAjax("burypcfunctioncode", { functionCode: "922602100305" });
//     }
// });

//搜索框中回车 - del
// $('.input-toolbar-search').placeholder().keydown(function(event) {
//     var keyword = $('.input-toolbar-search').val();
//     switch (event.keyCode) {
//         case 13:
//             if (keyword && keyword.trim()) {
//                 myWfcAjax("burypcfunctioncode", { functionCode: "922602100305" });
//             }
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

//访问旧版 - del
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

//客户页
//点击导出收藏企业按钮 - del
// $(document).on("click", "#exportCustomer", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100295" });
// });
//取消收藏按钮在customer.js中

//点击导出监控企业按钮 - del
// $(document).on("click", "#exportCompany", function() {
//     myWfcAjax("burypcfunctioncode", { functionCode: "922602100297" });
// });