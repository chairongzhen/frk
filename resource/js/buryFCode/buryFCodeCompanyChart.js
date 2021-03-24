//基础
//点击搜索按钮（不包括回车） - del
// $('.input-toolbar-button').click(function() {
//     var keyword = $('.input-toolbar-search').val();
//     if (keyword.length && !$('#inputToolbarSearch').hasClass('placeholder')) {
//         myWfcAjax("burypcfunctioncode", { functionCode: "922602100305" });
//     }
// });

//搜索框中回车 -del
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


// 图谱页
//点击tab（不直接按ID选取a标签是为了与页面点击行为一致）
// $('.nav-tabs').on('click', '.nav-block', function(e) {
//     var functionCode = "";
//     var id = $(e.target).attr('id') || $(e.target).find("a").attr('id');
//     switch (id) {
//         case "linkQYTP":
//             //点击企业图谱tab
//             functionCode = "922602100299";
//             break;
//         case "linkGQJG":
//             //点击股权结构tab
//             functionCode = "922602100300";
//             break;
//         case "linkDWTZ":
//             //点击对外投资tab
//             functionCode = "922602100301";
//             break;
//         case "linkYSGX":
//             //点击疑似关联tab
//             functionCode = "922602100302";
//             break;
//         case "linkYSKZR":
//             //点击疑似实际控制人tab
//             functionCode = "922602100303";
//             break;
//         case "linkRZLC":
//             //点击融资历程tab
//             functionCode = "922602100304";
//             break;
//     }
//     if (functionCode !== "") {
//         myWfcAjax("burypcfunctioncode", { functionCode: functionCode });
//     }
// });

// CEL-企业图谱-点击导出列表按钮 - del
// $(document).on('click', '.chart-header-list', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100338' });
// });

// CEL-企业图谱-点击保存图片按钮 - del
// $(document).on('click', '.chart-header-save', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100339' });
// });

// CEL-企业图谱-点击刷新按钮
// $(document).on('click', '#chartFirstOne', function() {
//     myWfcAjax('burypcfunctioncode', { functionCode: '922602100340' });
// });