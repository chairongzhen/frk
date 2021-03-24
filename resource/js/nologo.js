 /*
 去除网站所有水印和logo
  */
 function getUrlSearch(parama) {
    //获取url某个字段后的字符串
    var loc = location.href;
    var pattern = new RegExp(parama + '=([^&#|]+)#?');
    var patternArr = pattern.exec(loc);
    if (patternArr) {
        return patternArr[1]
    } else {
        return "";
    }
}
var isNotoolbar = getUrlSearch("nologo");
if(isNotoolbar&&!window.localStorage.nologo){
    //没有localStorage.nologo就加上相关的没有localStorage
    window.localStorage.nologo=true
}
if(isNotoolbar||window.localStorage.nologo){
    document.write('<link rel="stylesheet" href="../resource/css/nologo.css?v=20210111">')
}