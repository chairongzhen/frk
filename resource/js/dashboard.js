/*
 * @overview:
 * @Author: jfzhang.Jeffry
 * @LastEditors: jfzhang.Jeffry
 * @Date: 2020-11-20 10:16:58
 */
(function() {
  const rewrietURLOpen = () => {
    is_terminal = false;
    console.log('%c dashboard---重写\n', 'font-size:20px;background-color: #EA7E5C;color:#fff;');
    window.open = (function(myOpen) {
      return function(url, name, windowFeatures) {
        console.log(
          '%c dashboard---拦截window.open，url, name, windowFeatures:\n',
          'font-size:20px;background-color: #EA7E5C;color:#fff;',
          url,
          name,
          windowFeatures,
        );
        return myOpen(url, '_self', windowFeatures);
      };
    })(window.open);

    window.onclick = (function() {
      return function(e) {
        if (e.target.href) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          console.log(
            '%c dashboard---href 跳转',
            'font-size:20px;background-color: #EA7E5C;color:#fff;',
            e.target.href,
          );
          window.open(e.target.href);
          return false;
        }
      };
    })();
    window.addEventListener(
      'message',
      e => {
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.stopPropagation();
        window.event.chancelBUbble = true;
        if (
          e.data?.action === 'back' &&
          window.location.pathname !==
            '/Wind.WFC.Enterprise.Web2/PC.Front.branch04/Company/SearchHomeList.html' &&
          window.location.pathname !==
            '/Wind.WFC.Enterprise.Web2/PC.Front.branch04/Company/SearchHome.html'
        ) {
          window.history.back();
        }
        return false;
      },
      false,
    );
  };
  const f1 = 'zGzuyCLvbYNWawPMhhj1605856318965';
  const f2 = 'fV18NgJr4NDFqKCCKte1605856469121';
  const results = /[\\?&]govdashboard=([^&#/]*)/i.exec(window.location.href);

  if ((results == null ? null : results[1]) === 'fV18NgJ') {
    console.log('dashboard---url:');
    localStorage.setItem(f1, f2);
    rewrietURLOpen();
  } else if (localStorage.getItem(f1) === f2) {
    console.log('dashboard---local:');
    rewrietURLOpen();
  }
})();
