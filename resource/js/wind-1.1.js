(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["wind"] = factory(require("jquery"));
	else
		root["wind"] = factory(root["jquery"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_jquery__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/client.js":
/*!***********************!*\
  !*** ./src/client.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
    wind.client
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js"), __webpack_require__(/*! ./ua */ "./src/ua.js"), __webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  var noop = function noop() {}; //设置终端键盘精灵状态（避免键盘精灵捕获输入导致动态加入的input框无效）
  //实测发现在某些情况下键盘精灵会恢复（切换到其他应用，焦点切至键盘精灵输入框），同时会影响其他tab，因此正确的用法是在input foucus时禁用，在blur时启用


  function setSmartInput(enabled, callback) {
    return module.doFunc({
      func: "setsmartinput",
      isGlobal: 1,
      enable: enabled ? 1 : 0
    }, callback);
  }

  function noConflictSmartInput(inputs) {
    if (inputs && $.ua.ie) {
      if (!(inputs instanceof jQuery)) {
        inputs = $(inputs);
      }

      inputs.focus(function () {
        setSmartInput(false);
      }).blur(function () {
        setSmartInput(true);
      });
    }
  } //输入参数为一个类json的字符串({name1=value1,name2=value2}形式)，name和value都可用('")包围，也可不加，值中不可出现("),可考虑使用unicode方式传入(待验证)
  //unicode转换方式逻辑: '\\u' + $.String.pad('"'.charCodeAt(0).toString(16),4,'0')
  //突然发现终端直接支持json，此方法暂不需要


  function processParam(objParam) {
    var ret = [],
        isF = true;
    ret.push('{');

    if (objParam) {
      $.each(objParam, function (index, item) {
        if (isF) {
          isF = false;
        } else {
          ret.push(',');
        }

        ret.push(index + '=' + item);
      });
    }

    ret.push('}');
    return ret.join('');
  }

  function processResult(result) {
    var ret;

    try {
      if (typeof result === 'string') {
        ret = JSON.parse(result);
      }
    } catch (e) {}

    if (ret == null) {
      ret = result;
    }

    return ret;
  }
  /*
      为避免冲突，请勿使用window下的clientFunc,WebFunc,ServerFunc等关键字
        clientFunc参数说明(具体模式需跟delphi端联调确认)：
        isGlobal：1表示为框架方法，0表示为某业务模块方法，具体需要根据具体方法的实现来传入不同的值
        
  */


  function serverFunc(strJSON) {
    //console.log(strJSON);
    if (strJSON != null && strJSON != '') {
      var params = null;

      try {
        params = JSON.parse(strJSON);
      } catch (e) {
        params = null;
      }

      if (params && params.func) {
        if (serverFunc[params.func] && serverFunc[params.func].length) {
          $.each(serverFunc[params.func], function (index, item) {
            if (typeof item === 'function') {
              item(params);
            }
          });
        }
      } else {
        //遗留的serverFunc逻辑可放到legacy下,会将调用ServerFunc的参数原封不动传给serverFunc['legacy']
        if (typeof serverFunc['legacy'] === 'function') {
          serverFunc['legacy'].apply(undefined, arguments);
        }
      }
    }
  }

  var module = {
    //动态返回的函数在ie8下模块内调用时会显示找不到
    doFuncSync: function doFuncSync(param) {
      var ret;
      param = typeof param === 'string' ? param : JSON.stringify(param);

      if (!window.external) window.external = {};
      if (typeof window.external.ClientFunc !== 'undefined') {
        //ie or webkit
        ret = window.external.ClientFunc(param);
      } else if (typeof window.clientFunc === 'function') {
        //mac
        ret = window.clientFunc(param);
      }

      if (ret != null) {
        return processResult(ret);
      }

      return null;
    },
    //移至ua.client，考虑到可能先判断客户端环境再加载需要的js模块
    //isInClient: (function () {
    //    //终端首页ie下body.onload后为unknown，之前为都为undefined（进步一验证猜测，是因为首页加载的非常早（终端还没出现），后面的页面都没问题，也就是说终端首页出现后，跳转的任何页面，包括新tab都不会有问题，而在终端显示前，如在wwm的头上跳转到另一个页面，只要这个页面加载的足够快，就可能有问题）
    //    //因此 ie下 window.external.ClientFunc最好在body.onload中调用才能保证成功(需修改代码)
    //    try {
    //        return !!(window.external && typeof window.external.ClientFunc !== 'undefined');
    //    } catch (e) {
    //        return false;
    //    }
    //})(),

    /*
        执行ClientFunc，采用异步方式(推荐)，ie内核实际为同步调用，但使用异步写法以兼容将来的异步模式
        @param {String|Object} param : string为类json的cmd，若为object则会自动转化为相应格式
        @param {Function} onReturn 调用完成后执行的回调
    */
    doFunc: function () {
      if ($.ua.webkit) {
        return function (param, onReturn) {
          //console.log("doFunc:");
          //console.log(param);
          var callback = typeof onReturn === 'function' ? function (ret) {
            onReturn(processResult(ret));
          } : noop;
          if (!window.external) window.external = {};
          if (typeof window.external.ClientFunc !== 'undefined') {
            window.external.ClientFunc(typeof param === 'string' ? param : JSON.stringify(param), callback);
          }
        };
      } else {
        //ie内核下typeof window.external.ClientFunc为unkonw，且无法赋值给变量，且实际为同步方式
        return function (param, onReturn) {
          var ret = module.doFuncSync(param);

          if (typeof onReturn === 'function') {
            onReturn(ret);
          }
        };
      }
    }(),
    //获取当前客户端用户信息
    getUserInfo: function getUserInfo(onReturn) {
      return module.doFunc({
        func: 'querydata',
        isGlobal: 1,
        name: 'terminaluserinfo'
      }, function (ret) {
        if (typeof onReturn === 'function') {
          if (_typeof(ret) === 'object') {
            delete ret.func;
            delete ret.isGlobal;
            delete ret.name;
          }

          onReturn(ret);
        }
      });
    },

    /*
        获取sessionid，实际上因为安全原因，不是非常建议在客户端获取sessionid，且在客户端会自动在请求中附加sessionid，因此绝大部分情况下无需使用此方法，用到时因小心评估是否必要。
    */
    getSessionId: function getSessionId(onReturn) {
      //非实例方法中不应出现this
      return module.doFunc({
        func: 'querydata',
        isGlobal: 1,
        name: 'sessionid'
      }, function (ret) {
        if (typeof onReturn === 'function') {
          onReturn(ret && ret.value || null);
        }
      });
    },

    /*
        获取serverinfo对应的ip，一般情况下在客户端会自动替换url请求中的serverinfo别名（或使用相对地址路径），因此绝大部分情况下无需使用，只有某些特定情况下需要。
    */
    getServerIP: function getServerIP(serverName, onReturn) {
      return module.doFunc({
        func: 'serverInfo',
        isGlobal: 1,
        name: serverName
      }, function (ret) {
        if (typeof onReturn === 'function') {
          onReturn(ret && ret.serverInfoAddress && ret.serverInfoAddress !== 'null' ? ret.serverInfoAddress : null);
        }
      });
    },

    /*表示终端类型
        其中 S 为 Dargon
        S6 为 WFC
        1 为 WWT
    */
    getAppType: function getAppType(onReturn) {
      return module.doFunc({
        func: 'querydata',
        isGlobal: 1,
        name: 'apptype'
      }, function (ret) {
        if (typeof onReturn === 'function') {
          onReturn(ret && ret.apptype || null);
        }
      });
    },

    /*
        获取终端版本号字符串
        如：'15.2.1.53357 [2017-08-11]'
    */
    getVersion: function getVersion(onReturn) {
      return module.doFunc({
        func: 'querydata',
        isGlobal: 1,
        name: 'version'
      }, function (ret) {
        if (typeof onReturn === 'function') {
          onReturn(ret && ret.result || null);
        }
      });
    },

    /*
        用于解决 ie 内核下动态生成的输入框被客户端键盘精灵抢焦点的问题（具体做法是在 foucus 时禁用客户端键盘精灵，blur 时再启用）， weikit 内核下此方法可调用但不会产生任何效果。
        @param {jQuery|Element} $inputs input/textarea控件列表,jQuery格式或原生Element对象
    */
    noConflictSmartInput: noConflictSmartInput,

    /*
      调用客户端command，很多时候等同于执行一个键盘精灵中的命令，如跳转至某功能，或打开某界面
      @param {String|Int} 命令id  ：可通过键盘精灵commandex查询所需命令
      @param {Object} 命令参数：根据命令而定，可能需要查询命令就具体实现，若无则不传
    */
    doCommand: function doCommand(cmdId, params) {
      module.doFunc($.mix({
        func: 'command',
        isGlobal: 1,
        cmdid: cmdId
      }, params));
    },

    /*
        客户端通过window.ServerFunc(strJSON)调用web页面，通过jsonObj.func区分不同的方法
        这里可注册一个func的回调，以处理客户端调用的逻辑。
        注意每个func可添加多个回调，按添加的先后顺序执行
    */
    addServerFunc: function addServerFunc(funcName, callback) {
      if (funcName && typeof callback === 'function') {
        if (serverFunc[funcName] == null) {
          serverFunc[funcName] = [];
        }

        serverFunc[funcName].push(callback);
      }
    },

    /*
        若指定callback，则会删除对应的回调，否则会删除funcName对应的所有回调
    */
    removeServerFunc: function removeServerFunc(funcName, callback) {
      if (funcName && serverFunc[funcName]) {
        if (callback != null) {
          serverFunc[funcName] = serverFunc[funcName].filter(function (item) {
            return item !== callback;
          });
        } else {
          delete serverFunc[funcName];
        }
      }
    },

    /*
      创建订阅器
      @subType {String} 订阅类型：对应于客户端的 module，目前有 news|speed|hq.RTD
      @options {Object} 订阅设置：{
            params: 订阅参数
            onReturn：创建订阅成功后执行的回调（若onNotify有设置会自动发起订阅）
            onNotify: 订阅数据返回时执行的回调（如未设置则不会自动发起订阅，需要在onReturn中自行调用subscribe方法）
            onActivate:终端tab隐藏时订阅器会自动退订、恢复时自动重新订阅，此回调会在调用“恢复订阅”之前触发，一般用于请求数据列表以补上中间数据
        }
    */
    createSubscriber: function createSubscriber(subType, options) {
      //subType,[onReturn]
      // if (arguments.length <= 2) {
      //     onReturn = arguments[1];
      //     params = onNotify = undefined;
      // }
      if (!subType) {
        return;
      }

      var opt = options || {};
      module.doFunc({
        func: 'websubscribe',
        action: 'create',
        isGlobal: 1,
        module: subType
      }, function (ret) {
        var suber = null;

        if (ret.id) {
          suber = new Subscriber(ret.id, subType, opt.onActivate);
        }

        if (typeof opt.onReturn === 'function') {
          opt.onReturn(suber);
        }

        if (suber && suber.subscribe && typeof opt.onNotify === 'function') {
          suber.subscribe(opt.params, opt.onNotify);
        }
      });
    } //Subers: Subscriber.subers

  }; //获取终端信息似乎挺重要的，如区分wft和wfc

  /*关于订阅 
    client.subscriber
      constructor(module,subject)  return suberId
      id//与delphi suber对象对应
      subscribe //对应delphi suber对象subscribe
      unsubscribe // 对应delphi suber对象unsubscribe
      notify      //订阅对应的处理
      destroy
      Subscriber (IProxyConn)
    var suber = $.client.createSubscriber(module,datatype,params,callback);
  suber.subscrib(params)//修改订阅内容
  suber.unSubscrib()//全部退订
    发布订阅模式与观察者模式
  */
  //以后客户端调用Web只通过ServerFunc走，其他都为不推荐方式（历史有WebFunc等）
  //这里对WebFunc做了兼容

  window.ServerFunc = window.WebFunc = serverFunc;
  /*
     订阅器相关代码
  */

  function Subscriber(id, subType, activate) {
    this.id = id;
    this.type = subType;
    this.state = 'created';

    if (activate) {
      this.activate = activate;
    }

    Subscriber.subers[id] = this;
  }

  Subscriber.subers = {}; //包含所有订阅器

  module.Subers = Subscriber.subers;
  /*处理PageEnter/PageLeave问题，
      1.需要考虑重入的问题，目前处理方式为只处理subscribed/unsubscribed的情况，因此是有可能出现tab隐藏了，但订阅器依然在运作的情况，但这并不影响逻辑，只在性能上有所浪费。
      2.考虑到有些订阅器为人为关闭，因此应记录下所有因tab隐藏导致的反订阅并适时恢复。
      3.考虑到关闭过程中又切换回来的情况，对于unsubscribing的数据需要特别处理
  */

  var pageHiddenTimeDelay = 3000,
      pageHiddenHandler;
  module.addServerFunc('NotifyPageState', function (params) {
    //console.log('NotifyPageState:' + pageHiddenHandler);
    if (pageHiddenHandler) {
      clearTimeout(pageHiddenHandler);
      pageHiddenHandler = undefined;
    }

    if (params && params.state === 'PageLeave') {
      pageHiddenHandler = setTimeout(function () {
        pageHiddenHandler = undefined;
        var index, item;

        for (index in Subscriber.subers) {
          item = Subscriber.subers[index];

          if (item && item instanceof Subscriber) {
            if (item.state === 'subscribed') {
              item.unsubByTab = true; //表示此suber是因为tab隐藏而反订阅

              item.unsubscribe();
            }
          }
        }

        ;
      }, pageHiddenTimeDelay);
    } else if (params && params.state === 'PageEnter') {
      var index, item;

      for (index in Subscriber.subers) {
        item = Subscriber.subers[index];

        if (item && item instanceof Subscriber && item.unsubByTab) {
          item.unsubByTab = false;

          if (item.state === 'unsubscribed' || item.state === 'unsubscribing') {
            if (typeof item.activate === 'function') {
              //订阅再次被激活后的回调
              //这里一般为重新请求数据列表并更新（以补上中间的数据）
              //若每次推送为全部数据，则可不需要此回调
              item.activate();
            }

            item.subscribe(); //订阅推送的数据通过notify，应先与item.data比对，确定为更新数据之后再插入
          }
        }
      }

      ;
    }
  });
  Subscriber.prototype = {
    constructor: Subscriber,
    //调用 clientfunc 的返回值中 result为0表示失败，为1表示成功
    subscribe: function subscribe(params, notify, onReturn) {
      var self = this;
      self.state = 'subscribing';
      params = params || self.params; //无参数传入时会使用原先参数（第一次必须传入）

      notify = notify || self.notify;

      if (params && notify) {
        module.doFunc($.mix({
          func: 'websubscribe',
          action: 'subscribe',
          isGlobal: 1,
          module: this.type,
          id: this.id
        }, params, false), function () {
          self.state = 'subscribed';
          self.params = params;
          self.notify = notify;

          if (typeof onReturn === 'function') {
            onReturn.apply(self, arguments);
          }
        });
      } else {
        throw new Error('调用client.subscribe方法出错：params和notify不能为空.');
      }
    },
    unsubscribe: function unsubscribe(onReturn) {
      var self = this;
      self.state = 'unsubscribing';
      module.doFunc({
        func: 'websubscribe',
        action: 'unsubscribe',
        isGlobal: 1,
        module: this.type,
        id: this.id
      }, function () {
        self.state = 'unsubscribed';

        if (typeof onReturn === 'function') {
          onReturn.apply(self, arguments);
        }
      });
    },
    destroy: function destroy(onReturn) {
      var self = this;
      var id = this.id;
      self.state = 'destroying';
      module.doFunc({
        func: 'websubscribe',
        action: 'destroy',
        isGlobal: 1,
        module: this.type,
        id: id
      }, function () {
        self.state = 'destroyed';

        if (Subscriber.subers[id]) {
          delete Subscriber.subers[id];
        }

        if (typeof onReturn === 'function') {
          onReturn.apply(self, arguments);
        }
      });
    }
  };
  module.addServerFunc("websubscribe", function (params) {
    //console.log(params);
    if (params.id && Subscriber.subers[params.id]) {
      var suber = Subscriber.subers[params.id];

      if (suber && typeof suber.notify === 'function') {
        suber.notify(params.data);
      }
    }
  });

  function destorySubers() {
    $.each(Subscriber.subers, function (index, item) {
      if (item && typeof item.destroy === 'function') {
        item.destroy();
      }
    });
  } //页面离开时destroy所有订阅器（如刷新或页面内跳转）


  $(window).unload(destorySubers);
  /* 订阅器代码 结束*/

  $.client = module;
  return module;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); ///////////////////////////////翻译多语言////////////////////////////////////////
//function replaceXml(xml) {
//    if (xml) xml = xml.replace(/"/g, "'");
//    return xml
//}
//function getMultLang(xml) {
//    try {
//        xml = replaceXml(xml);
//        var json = requestCmd("{\"func\": \"GETFULLSTRING\", \"nodevalue\":\"" + xml + "\"}");
//        if (json != undefined && json != "" && json.nodevalue != undefined) {
//            // 调用iframe中的业务处理方法
//            return $('frmSonMenu').contentWindow.doWithMultLang(json.nodevalue);
//        }
//    } catch (e) { }
//}
//function getLang(langId) {
//    try {
//        var xml = "<root><item LID='" + langId + "' name=''/></root>";
//        var json = requestCmd("{\"func\": \"GETFULLSTRING\", \"nodevalue\":\"" + xml + "\"}");
//        if (json && json.nodevalue) {
//            return json.nodevalue;
//        }
//    } catch (e) { }
//    return "";
//}
//客户端版记录用户行为
//function writeLog(commandname, parm) {
//    //设置功能点日志
//    //先判断终端的版本
//    var cmd = "{\"func\":\"querydata\", \"name\":\"version2\", \"isGlobal\":\"1\"}";
//    var temp = requestCmd(cmd);
//    var flag = false;
//    try {
//        if (parseInt(temp.result) > 141337471) {
//            flag = true;
//        }
//    } catch (err) { }
//    if (flag) {
//        var cmd = "{\"func\":\"writeauditlog\",\"isGlobal\":\"1\",\"Commandname\":\"" + commandname + "\",\"param\":\"" + "" + "\",\"propertys\":\"" + parm + "\"}";
//        requestCmd(cmd);
//    }
//    else {
//        var cmd = "{\"func\":\"writeauditlog\",\"isGlobal\":\"1\",\"Commandname\":\"" + commandname + "\",\"param\":\"" + "" + "\"}";
//        requestCmd(cmd);
//    }
//}
//window.external.ClientFunc(JSON.stringify({ func: 'querydata', isGlobal: 1, name: 'terminaluserinfo' }))
//!CommandParam[1400,windcode=600739.SH] 跳转F9
//云数据这一块逻辑比较复杂，暂未整理
//数据示例
//var data = {
//    2001: "411240888",//newsid
//    2002: "",//windcode
//    2003: "1458,LM0002,LM0003,A0002,LM01,ON0102,A0027,ON0611,ON061111,ON0118,ON061115,ON01",//section
//    2004: "",//industrycode 行业
//    2007: "日本最大银行因欺骗交易被CFTC罚款60万美元",//title
//    2008: "2017-08-08 15:44:27",//publishdate
//    2009: "Wind资讯",//sitename 来源网站
//    2010: "http://snap.windin.com/ns/findsnap.php?ad=0&id=411240888&sourcetype=1&ad=0&sitetype=1",//snap 正文快照地址
//    2021: "1-0-0-0-0-0,1-0-0-0-0-0",//权限字符串(请求中未显式指定)
//    topicid: 0 // 订阅数据id，一般外部用不到
//}
//var data = {
//    "000001.SZ": "11.05,0.05,0.0045,68956744,0.2323",
//    "000002.SZ": "22.77,0.06,0.0026,19158501,0.108",
//    "000008.SZ": "7.72,0.21,0.028,13357502,-0.1705",
//    "000009.SZ": "8.9,0.06,0.0068,46963536,-0.1409",
//    "000027.SZ": "6.6,0.02,0.003,7066340,-0.018",
//    "000039.SZ": "18.95,-0.07,-0.0037,13982249,0.3006",
//    "000060.SZ": "12.77,0.13,0.0103,143923188,0.1488",
//    "000061.SZ": "0,0,0,0,-0.2635",
//    "000063.SZ": "22.28,0.16,0.0072,24752752,0.3969",
//    "000069.SZ": "8.75,0.05,0.0057,28958784,0.2725"
//}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/cloud.js":
/*!**********************!*\
  !*** ./src/cloud.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
    wind.cloud
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  var MAX_VALUES = {
    byte: 0xff,
    short: 0x7fff,
    ushort: 0xffff,
    int: 0x7fffffff,
    uint: 0xffffffff,
    int64: 0x7fffffffffffffff,
    float: 3.40282e+038,
    double: 1.79769e+308
  };
  var module = {
    isNull: function isNull(val, type) {
      if (val == null) {
        return true;
      } else if (typeof type === 'string' && type.length) {
        switch (type) {
          case 'char8date':
            return val == MAX_VALUES.ushort;
            break;

          default:
            return val == MAX_VALUES[type];
            break;
        }
      }

      return false;
    }
  }; ////获取数据
  //oClass.prototype.GetData = function () {
  //    var self = this, options = this.options, setting = this.options.setting, params = options.Params;
  //    var dataParameters = {};
  //    if (setting.topN) {
  //        params.pageIndex = 0;
  //        params.pageSize = setting.topN;
  //    }
  //    switch (options.dataSourceType) {
  //        case 'CloudFunction':
  //            dataParameters.MethodAlias = 'MFRB_GetCloudFunction';
  //            var cmd = "WSS(" + "'Macro=" + getParam(params.sectors, setting) + "','" + getParam(params.functions,setting) + "'";
  //            $.each(params.cmdParams, function (index, item) {
  //                var val = getParam(item, setting);
  //                cmd += ",'" + index + "=" + val + "'";
  //            });
  //            cmd += ")";
  //            dataParameters.Parameter = [cmd, params.columns, params.sortName, params.sortOrder, Number(params.pageIndex), Number(params.pageSize), JSON2.stringify(params.otherParams)];
  //            break;
  //        case 'CloudReport':
  //            dataParameters.MethodAlias = 'MFRB_GetCloudReport';
  //            var cmd = 'report name=' + params.reportName;
  //            $.each(params.cmdParams, function (index, item) {
  //                var val = item;
  //                if (typeof item === 'object' && item.prop) {
  //                    val = setting[item.prop];
  //                    if (item.process && typeof item.process === 'function') {
  //                        val = item.process(val);
  //                    }
  //                }
  //                cmd += ' ' + index + '=[' + val + ']';
  //            });
  //            dataParameters.Parameter = [cmd, params.columns, params.sortName, params.sortOrder, Number(params.pageIndex), Number(params.pageSize)];
  //            break;
  //        case 'AjaxMethod':
  //        default:
  //            break;
  //    }
  //    if (dataParameters.MethodAlias && dataParameters.Parameter) {
  //        AjaxRequest(ajaxSecureUnlockHandler, dataParameters, function (result) {
  //            if (result && result.State === 0) {
  //                self.content.unblock();
  //                //option.preProcess可对返回数据做一些预处理
  //                if (typeof options.preProcess == 'function') {
  //                    result.Data = options.preProcess(result.Data);
  //                }
  //                self.BindData(result.Data);
  //            } else {
  //                //数据获取失败
  //                self.content.block(WFCFrame.GetNoDataBlockOption('无数据'));
  //            }
  //        });
  //    }
  //};

  $.cloud = module;
  return module;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/color.js":
/*!**********************!*\
  !*** ./src/color.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
    wind.color
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  // from kissy ui
  var rgbaRe = /\s*rgba?\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*(?:,\s*([\d\.]+))?\)\s*/,
      hexRe = /\s*#([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)\s*/,
      hslRe = /\s*hsla?\s*\(\s*([0-9]+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d\.]+))?\)\s*/;
  /**
  * Construct color object from String.
  * @static
  * @param {String} str string format color( '#rrggbb'  '#rgb' or 'rgb(r,g,b)'  'rgba(r,g,b,a)' )
  */

  function parse(str) {
    var values,
        r,
        g,
        b,
        a = 1;

    if ((str.length === 4 || str.length === 7) && str.substr(0, 1) === '#') {
      values = str.match(hexRe);

      if (values) {
        r = parseHex(values[1]);
        g = parseHex(values[2]);
        b = parseHex(values[3]);

        if (str.length === 4) {
          r = paddingHex(r);
          g = paddingHex(g);
          b = paddingHex(b);
        }
      }
    } else if (str.indexOf('rgb') > -1) {
      values = str.match(rgbaRe);

      if (values) {
        r = parseInt(values[1]);
        g = parseInt(values[2]);
        b = parseInt(values[3]);
        a = parseFloat(values[4]) || 1;
      }
    } else if (str.indexOf('hsl') > -1) {
      values = str.match(hslRe);

      if (values) {
        var cfg = {
          h: parseInt(values[1]),
          s: parseInt(values[2]) / 100,
          l: parseInt(values[3]) / 100,
          a: parseFloat(values[4]) || 1
        };
        var rgb = hslToRgb(cfg);
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
        a = cfg.a;
      }
    }

    return typeof r === 'undefined' ? undefined : new Color({
      r: r,
      g: g,
      b: b,
      a: a
    });
  }

  function hslToRgb(cfg) {
    var h = Math.min(Math.round(cfg.h), 359),
        s = Math.max(0, Math.min(1, cfg.s)),
        l = Math.max(0, Math.min(1, cfg.l)),
        C,
        X,
        m,
        rgb = [],
        abs = Math.abs,
        floor = Math.floor;

    if (s === 0 || h == null) {
      // achromatic
      rgb = [l, l, l];
    } else {
      // http://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL
      // C is the chroma
      // X is the second largest component
      // m is the lightness adjustment
      h /= 60;
      C = s * (1 - abs(2 * l - 1));
      X = C * (1 - abs(h - 2 * floor(h / 2) - 1));
      m = l - C / 2;

      switch (floor(h)) {
        case 0:
          rgb = [C, X, 0];
          break;

        case 1:
          rgb = [X, C, 0];
          break;

        case 2:
          rgb = [0, C, X];
          break;

        case 3:
          rgb = [0, X, C];
          break;

        case 4:
          rgb = [X, 0, C];
          break;

        case 5:
          rgb = [C, 0, X];
          break;
      }

      rgb = [rgb[0] + m, rgb[1] + m, rgb[2] + m];
    }

    $.each(rgb, function (index, v) {
      rgb[index] = to255(v);
    });
    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2]
    };
  } // `rgbToHsl`
  // Converts an RGB color value to HSL.
  // @param {r,g,b} in [0,255]
  // @return { h, s, l }


  function rgbToHsl(cfg) {
    var r = Math.min(cfg.r || 0, 255) / 255.0,
        g = Math.min(cfg.g || 0, 255) / 255.0,
        b = Math.min(cfg.b || 0, 255) / 255.0;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: s,
      l: l
    };
  }

  function parseHex(v) {
    return parseInt(v, 16);
  }

  function paddingHex(v) {
    return v + v * 16;
  }

  function to255(v) {
    return Math.round(v * 255);
  }

  function constrainNum(v, max) {
    return Math.max(0, Math.min(v, max));
  }

  function percentage(v) {
    return Math.round(v * 100) + '%';
  }

  function padding2(v) {
    if (v.length !== 2) {
      v = '0' + v;
    }

    return v;
  }
  /**
  支持#XXXXXX,rgb(xx,xx,xx),rgba(xx,xx,xx,x),hsl(xx,xx%,xx%),hsla(xx,xx%,xx%,x),{r:xx,g:xx,b:xx,a:x},{h:280,s:0.5,l:0.8,a:0.5}多种方式
  */


  var Color = function Color(input) {
    if (!(this instanceof Color)) {
      return new Color(input);
    }

    var self = this;
    var rgba = {};

    if (typeof input === 'string') {
      rgba = parse(input);
    } else if (_typeof(input) === 'object') {
      if (input.h != null) {
        rgba = hslToRgb({
          h: input.h || 0,
          s: input.s || 0,
          l: input.l || 0
        });
      } else {
        rgba = input;
      }

      rgba.a = input.a == null ? 1 : input.a;
    }

    self.r = Math.round(constrainNum(rgba.r, 255));
    self.g = Math.round(constrainNum(rgba.g, 255));
    self.b = Math.round(constrainNum(rgba.b, 255));
    self.a = constrainNum(rgba.a, 1);
  };

  $.mix(Color.prototype, {
    hsla: function hsla(cfg) {
      if (cfg == null) {
        //get
        var self = this;
        var hsl = rgbToHsl(self);
        hsl.s = Math.round(hsl.s * 100) / 100;
        hsl.l = Math.round(hsl.l * 100) / 100;
        hsl.a = self.a;
        return hsl;
      } else if (_typeof(cfg) === 'object') {
        //set 
        var self = this;
        var hsl = rgbToHsl(self);

        if (cfg.h != null) {
          hsl.h = cfg.h;
        }

        if (cfg.s != null) {
          hsl.s = cfg.s;
        }

        if (cfg.l != null) {
          hsl.l = cfg.l;
        }

        $.mix(self, hslToRgb(hsl));

        if (cfg.a != null) {
          self.a = cfg.a;
        }

        return self;
      }
    },
    rgba: function rgba(cfg) {
      if (cfg == null) {
        //get
        var self = this;
        return {
          r: self.r,
          g: self.g,
          b: self.b,
          a: self.a
        };
      } else if (_typeof(cfg) === 'object') {
        //set 
        var self = this;

        if (cfg.r != null) {
          self.r = Math.round(constrainNum(cfg.r, 255));
        }

        if (cfg.g != null) {
          self.g = Math.round(constrainNum(cfg.g, 255));
        }

        if (cfg.b != null) {
          self.b = Math.round(constrainNum(cfg.b, 255));
        }

        if (cfg.a != null) {
          self.a = constrainNum(cfg.a, 1);
        }

        return self;
      }
    },
    negate: function negate() {
      var self = this;
      self.r = 255 - self.r;
      self.g = 255 - self.g;
      self.b = 255 - self.b;
      return self;
    },
    lighten: function lighten(num) {
      var self = this;
      var hsl = rgbToHsl(self);
      hsl.l = Math.min(hsl.l * (1 + num), 1);
      $.mix(self, hslToRgb(hsl));
      return self;
    },
    darken: function darken(num) {
      var self = this;
      var hsl = rgbToHsl(self);
      hsl.l = Math.min(hsl.l * (1 - num), 1);
      $.mix(self, hslToRgb(hsl));
      return self;
    }
  }); //需单独赋值，因为在ie8中{}的toString无法被遍历出来

  Color.prototype.toString = function (type) {
    var self = this;

    switch (type) {
      case 'hex':
        return '#' + padding2(Number(self.r).toString(16)) + padding2(Number(self.g).toString(16)) + padding2(Number(self.b).toString(16));
        break;

      case 'hsl':
        var hsl = rgbToHsl(self);
        return 'hsl(' + hsl.h + ', ' + percentage(hsl.s) + ', ' + percentage(hsl.l) + ')';
        break;

      case 'hsla':
        var hsl = rgbToHsl(self);
        return 'hsla(' + hsl.h + ', ' + percentage(hsl.s) + ', ' + percentage(hsl.l) + ', ' + self.a + ')';
        break;

      case 'rgb':
        return 'rgb(' + self.r + ', ' + self.g + ', ' + self.b + ')';
        break;

      case 'rgba':
      default:
        return 'rgba(' + self.r + ', ' + self.g + ', ' + self.b + ', ' + self.a + ')';
        break;
    }
  };

  $.color = Color;
  return Color;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/cookie.js":
/*!***********************!*\
  !*** ./src/cookie.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
    wind.cookie
    from JavaScript Cookie v2.1.4 https://github.com/js-cookie/js-cookie
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  function extend() {
    var i = 0;
    var result = {};

    for (; i < arguments.length; i++) {
      var attributes = arguments[i];

      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }

    return result;
  }

  function init(converter) {
    function api(key, value, attributes) {
      var result;

      if (typeof document === 'undefined') {
        return;
      } // Write


      if (arguments.length > 1) {
        attributes = extend({
          path: '/'
        }, api.defaults, attributes);

        if (typeof attributes.expires === 'number') {
          var expires = new Date();
          expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
          attributes.expires = expires;
        } // We're using "expires" because "max-age" is not supported by IE


        attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

        try {
          result = JSON.stringify(value);

          if (/^[\{\[]/.test(result)) {
            value = result;
          }
        } catch (e) {}

        if (!converter.write) {
          value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
        } else {
          value = converter.write(value, key);
        }

        key = encodeURIComponent(String(key));
        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
        key = key.replace(/[\(\)]/g, escape);
        var stringifiedAttributes = '';

        for (var attributeName in attributes) {
          if (!attributes[attributeName]) {
            continue;
          }

          stringifiedAttributes += '; ' + attributeName;

          if (attributes[attributeName] === true) {
            continue;
          }

          stringifiedAttributes += '=' + attributes[attributeName];
        }

        return document.cookie = key + '=' + value + stringifiedAttributes;
      } // Read


      if (!key) {
        result = {};
      } // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling "get()"


      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var rdecode = /(%[0-9A-Z]{2})+/g;
      var i = 0;

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');

        if (cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }

        try {
          var name = parts[0].replace(rdecode, decodeURIComponent);
          cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

          if (this.json) {
            try {
              cookie = JSON.parse(cookie);
            } catch (e) {}
          }

          if (key === name) {
            result = cookie;
            break;
          }

          if (!key) {
            result[name] = cookie;
          }
        } catch (e) {}
      }

      return result;
    }

    api.set = api;

    api.get = function (key) {
      return api.call(api, key);
    };

    api.getJSON = function () {
      return api.apply({
        json: true
      }, [].slice.call(arguments));
    };

    api.defaults = {};

    api.remove = function (key, attributes) {
      api(key, '', extend(attributes, {
        expires: -1
      }));
    };

    api.withConverter = init;
    return api;
  }

  $.cookie = init(function () {});
  return $.cookie;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/error.js":
/*!**********************!*\
  !*** ./src/error.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
    wind.error
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js"), __webpack_require__(/*! ./uri */ "./src/uri.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  var module = {
    debug: function () {
      var debug = $.uri().query('_debug');

      if (debug === 'true' || debug === '1') {
        return true;
      }

      return false;
    }(),

    /*用于执行统一的错误处理逻辑,默认逻辑为debug为true时使用$.log记录日志，可用自定义函数覆盖 */

    /*ie9-支持前三个参数，现代浏览器支持后两个参数*/
    onerror: function onerror(msg, url, line, pos, error) {
      if (this.debug) {
        //debug模式用于显式输出日志，通过设置$.log.render='page'可在页面上输出
        $.log(JSON.stringify(arguments), 'error');
      } //return true;//这么做会让浏览器屏蔽错误信息导致错误被掩盖，强烈不建议

    }
  };
  /*ie9-支持前三个参数，现代浏览器支持后两个参数*/

  window.onerror = function (msg, url, line, pos, error) {
    if (typeof module.onerror === 'function') {
      return module.onerror(msg, url, line, pos, error);
    }
  };

  $.error = module;
  return module;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js"), __webpack_require__(/*! ./client */ "./src/client.js"), __webpack_require__(/*! ./cloud */ "./src/cloud.js"), __webpack_require__(/*! ./cookie */ "./src/cookie.js"), __webpack_require__(/*! ./error */ "./src/error.js"), __webpack_require__(/*! ./color */ "./src/color.js"), __webpack_require__(/*! ./json */ "./src/json.js"), __webpack_require__(/*! ./langControl */ "./src/langControl.js"), __webpack_require__(/*! ./service */ "./src/service.js"), __webpack_require__(/*! ./ua */ "./src/ua.js"), __webpack_require__(/*! ./uri */ "./src/uri.js"), __webpack_require__(/*! ./utils */ "./src/utils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (wind) {
  //just for bundle
  return wind;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/json.js":
/*!*********************!*\
  !*** ./src/json.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html
//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.
//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.
//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.
//          For example, this would serialize Dates as ISO strings.
//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };
//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.
//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.
//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.
//          JSON.stringify(undefined) returns undefined.
//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.
//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.
//          Example:
//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'
//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'
//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.
//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.
//          Example:
//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.
//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });
//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });
//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/
// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  if ((typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) !== "object") {
    JSON = {};
  }

  (function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? "0" + n : n;
    }

    function this_value() {
      return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {
      Date.prototype.toJSON = function () {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
      };

      Boolean.prototype.toJSON = this_value;
      Number.prototype.toJSON = this_value;
      String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;

    function quote(string) {
      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.
      rx_escapable.lastIndex = 0;
      return rx_escapable.test(string) ? "\"" + string.replace(rx_escapable, function (a) {
        var c = meta[a];
        return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + "\"" : "\"" + string + "\"";
    }

    function str(key, holder) {
      // Produce a string from holder[key].
      var i; // The loop counter.

      var k; // The member key.

      var v; // The member value.

      var length;
      var mind = gap;
      var partial;
      var value = holder[key]; // If the value has a toJSON method, call it to obtain a replacement value.

      if (value && _typeof(value) === "object" && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      } // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.


      if (typeof rep === "function") {
        value = rep.call(holder, key, value);
      } // What happens next depends on the value's type.


      switch (_typeof(value)) {
        case "string":
          return quote(value);

        case "number":
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : "null";

        case "boolean":
        case "null":
          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce "null". The case is included here in
          // the remote chance that this gets fixed someday.
          return String(value);
        // If the type is "object", we might be dealing with an object or an array or
        // null.

        case "object":
          // Due to a specification blunder in ECMAScript, typeof null is "object",
          // so watch out for that case.
          if (!value) {
            return "null";
          } // Make an array to hold the partial results of stringifying this object value.


          gap += indent;
          partial = []; // Is the value an array?

          if (Object.prototype.toString.apply(value) === "[object Array]") {
            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.
            length = value.length;

            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || "null";
            } // Join all of the elements together, separated with commas, and wrap them in
            // brackets.


            v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
            gap = mind;
            return v;
          } // If the replacer is an array, use it to select the members to be stringified.


          if (rep && _typeof(rep) === "object") {
            length = rep.length;

            for (i = 0; i < length; i += 1) {
              if (typeof rep[i] === "string") {
                k = rep[i];
                v = str(k, value);

                if (v) {
                  partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
              }
            }
          } else {
            // Otherwise, iterate through all of the keys in the object.
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);

                if (v) {
                  partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
              }
            }
          } // Join all of the member texts together, separated with commas,
          // and wrap them in braces.


          v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
          gap = mind;
          return v;
      }
    } // If the JSON object does not yet have a stringify method, give it one.


    if (typeof JSON.stringify !== "function") {
      meta = {
        // table of character substitutions
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\"": "\\\"",
        "\\": "\\\\"
      };

      JSON.stringify = function (value, replacer, space) {
        // The stringify method takes a value and an optional replacer, and an optional
        // space parameter, and returns a JSON text. The replacer can be a function
        // that can replace values, or an array of strings that will select the keys.
        // A default replacer method can be provided. Use of the space parameter can
        // produce text that is more easily readable.
        var i;
        gap = "";
        indent = ""; // If the space parameter is a number, make an indent string containing that
        // many spaces.

        if (typeof space === "number") {
          for (i = 0; i < space; i += 1) {
            indent += " ";
          } // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === "string") {
          indent = space;
        } // If there is a replacer, it must be a function or an array.
        // Otherwise, throw an error.


        rep = replacer;

        if (replacer && typeof replacer !== "function" && (_typeof(replacer) !== "object" || typeof replacer.length !== "number")) {
          throw new Error("JSON.stringify");
        } // Make a fake root object containing our value under the key of "".
        // Return the result of stringifying the value.


        return str("", {
          "": value
        });
      };
    } // If the JSON object does not yet have a parse method, give it one.


    if (typeof JSON.parse !== "function") {
      JSON.parse = function (text, reviver) {
        // The parse method takes a text and an optional reviver function, and returns
        // a JavaScript value if the text is a valid JSON text.
        var j;

        function walk(holder, key) {
          // The walk method is used to recursively walk the resulting structure so
          // that modifications can be made.
          var k;
          var v;
          var value = holder[key];

          if (value && _typeof(value) === "object") {
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = walk(value, k);

                if (v !== undefined) {
                  value[k] = v;
                } else {
                  delete value[k];
                }
              }
            }
          }

          return reviver.call(holder, key, value);
        } // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.


        text = String(text);
        rx_dangerous.lastIndex = 0;

        if (rx_dangerous.test(text)) {
          text = text.replace(rx_dangerous, function (a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          });
        } // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with "()" and "new"
        // because they can cause invocation, and "=" because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.
        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
        // replace all simple value tokens with "]" characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or "]" or
        // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.


        if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {
          // In the third stage we use the eval function to compile the text into a
          // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
          // in JavaScript: it can begin a block or an object literal. We wrap the text
          // in parens to eliminate the ambiguity.
          j = eval("(" + text + ")"); // In the optional fourth stage, we recursively walk the new structure, passing
          // each name/value pair to a reviver function for possible transformation.

          return typeof reviver === "function" ? walk({
            "": j
          }, "") : j;
        } // If the text is not JSON parseable, then a SyntaxError is thrown.


        throw new SyntaxError("JSON.parse");
      };
    }
  })();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/lang.js":
/*!*********************!*\
  !*** ./src/lang.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Wind Lang 
 *
 * 兼容但不基于jQuery，已纳入标准的API会扩展在原生对象上，否则扩展在$上
 * 兼容IE8+
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./json */ "./src/json.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  var global = window || this,
      seval = global.execScript ? "execScript" : "eval",
      rformat = /\\?\{([^{}]+)\}/gm,
      sopen = (global.open + '').replace(/open/g, ""),
      defineProperty = Object.defineProperty,
      DOC = window.document,
      W3C = DOC.dispatchEvent; //IE9开始支持W3C的事件模型与getComputedStyle取样式值;
  //为$增加工具方法，若与jquery冲突则以jquery为准

  var tools = {
    /**
        * 判定是否是一个朴素的javascript对象（Object或JSON），不是DOM对象，不是BOM对象，不是自定义类的实例。
        * @param {Object} obj
        * @return {Boolean}
        */
    isPlainObject: function isPlainObject(obj) {
      if (!$.type(obj, "Object") || $.isNative("reload", obj)) {
        return false;
      }

      try {
        //不存在hasOwnProperty方法的对象肯定是IE的BOM对象或DOM对象
        for (var key in obj) {
          //只有一个方法是来自其原型立即返回flase
          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            //不能用obj.hasOwnProperty自己查自己
            return false;
          }
        }
      } catch (e) {
        return false;
      }

      return true;
    },

    /**
        * 判定method是否为obj的原生方法，如$.isNative("JSON",window)
        * @param {Function} method
        * @param {Any} obj 对象
        * @return {Boolean}
        */
    isNative: function isNative(method, obj) {
      var m = obj ? obj[method] : false,
          r = new RegExp(method, "g");
      return !!(m && typeof m != "string" && sopen === (m + "").replace(r, ""));
    },

    /**
        * 是否为空对象
        * @param {Object} obj
        * @return {Boolean}
        */
    isEmptyObject: function isEmptyObject(obj) {
      for (var i in obj) {
        return false;
      }

      return true;
    },

    /**
        * 是否为类数组（Array, Arguments, NodeList与拥有非负整数的length属性的Object对象）
        * 如果第二个参数为true,则包含有字符串
        * @param {Object} obj
        * @param {Boolean} includeString
        * @return {Boolean}
        */
    isArrayLike: function isArrayLike(obj, includeString) {
      //是否包含字符串
      if (includeString && typeof obj === "string") return false;

      if (obj && _typeof(obj) === "object") {
        var n = obj.length;

        if (+n === n && !(n % 1) && n >= 0) {
          //检测length属性是否为非负整数
          try {
            if ({}.propertyIsEnumerable.call(obj, 'length') === false) {
              //如果是原生对象
              return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee);
            }

            return true;
          } catch (e) {
            //IE的NodeList直接抛错
            return true;
          }
        }
      }

      return false;
    },
    isFunction: function isFunction(fn) {
      //为了性能起见,没有走$.type方法
      return "[object Function]" === tools.toString.call(fn);
    },

    /**
        * 取得对象的键值对，依次放进回调中执行,并收集其结果，视第四个参数的真伪表现为可中断的forEach操作或map操作
        * @param {Object} obj
        * @param {Function} fn
        * @param {Any} scope ? 默认为当前遍历的元素或属性值
        * @param {Boolean} map ? 是否表现为map操作
        * @return {Object|Array}
        */
    each: function each(obj, fn, scope, map) {
      var value,
          i = 0,
          isArray = $.isArrayLike(obj),
          ret = [];

      if (isArray) {
        for (var n = obj.length; i < n; i++) {
          value = fn.call(scope || obj[i], i, obj[i]);

          if (map) {
            if (value != null) {
              ret[ret.length] = value;
            }
          } else if (value === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          value = fn.call(scope || obj[i], i, obj[i]);

          if (map) {
            if (value != null) {
              ret[ret.length] = value;
            }
          } else if (value === false) {
            break;
          }
        }
      }

      return map ? ret : obj;
    }
  };
  $.mix(tools, false); //为obj增加name方法val,若方法存在则不添加

  function method(obj, name, val) {
    if (!(name in obj)) {
      defineProperty(obj, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: val
      });
    }
  }
  /*批量method
    与mix区别
      默认不覆盖,mix可传入false达到
      优先使用Object.defineProperty（从而不被枚举）：实际上考虑兼容性，枚举与否会影响的对象也不适合扩展。
  */


  function methods(obj, map) {
    for (var name in map) {
      method(obj, name, map[name]);
    }
  } //IE8的Object.defineProperty只对DOM有效


  try {
    defineProperty({}, 'a', {
      get: function get() {}
    });
    $.supportDefineProperty = true;
  } catch (e) {
    method = function method(obj, name, _method) {
      if (!(name in obj)) {
        obj[name] = _method;
      }
    };
  } //可将arrayLike对象转换为数组


  var slice = W3C ? function (nodes, start, end) {
    return [].slice.call(nodes, start, end);
  } : function (nodes, start, end) {
    var ret = [],
        n = nodes.length;

    if (end === void 0 || typeof end === "number" && isFinite(end)) {
      start = parseInt(start, 10) || 0;
      end = end == void 0 ? n : parseInt(end, 10);

      if (start < 0) {
        start += n;
      }

      if (end > n) {
        end = n;
      }

      if (end < 0) {
        end += n;
      }

      for (var i = start; i < end; ++i) {
        ret[i - start] = nodes[i];
      }
    }

    return ret;
  };

  function _equal(a, b) {
    if (Number.isNaN(a) && Number.isNaN(b)) {
      return true;
    }

    if (a === b) {
      return true;
    }

    var typea = _typeof(a),
        typeb = _typeof(b);

    if (typea === typeb && (typea === 'object' || typea === 'function')) {
      for (var i in a) {
        if (!(i in b && _equal(a[i], b[i]))) {
          return false;
        }
      }

      return '' + a === '' + b; //确保对象的值也相等(如Date，Regex，Function)
    }

    return false;
  }

  function cloneOf(item) {
    var name = $.type2(item);

    switch (name) {
      case "Array":
      case "Object":
        return $[name].clone(item);

      default:
        //Date,Regex等不好克隆，Window等不宜克隆，dom节点建议使用jQuery.fn.clone
        return item;
    }
  }
  /* Object */


  $.Object = {
    //进行深拷贝，返回一个新对象，如果是浅拷贝请使用$.mix
    //只会clone类型为Array/Object的对象，其他对象因不好克隆或不宜克隆而只会返回对象本身，这种情况也适用于对象的属性
    clone: function clone(target) {
      if (Array.isArray(target)) {
        return $.Array.clone(target);
      }

      if ($.type2(target) === 'Object') {
        var clone = {};

        for (var key in target) {
          clone[key] = cloneOf(target[key]);
        }

        return clone;
      }

      return target;
    },
    equal: function equal(a, b) {
      return _equal(a, b) && _equal(b, a);
    }
  };
  /* Array */
  //修正IE67下unshift不返回数组长度的问题
  //http://www.cnblogs.com/rubylouvre/archive/2010/01/14/1647751.html

  if ([].unshift(1) !== 1) {
    var _unshift = Array.prototype.unshift;

    Array.prototype.unshift = function () {
      _unshift.apply(this, arguments);

      return this.length; //返回新数组的长度
    };
  } //修正IE8- splice 问题


  if ([1, 2, 3].splice(1).length === 0) {
    var _splice = Array.prototype.splice;

    Array.prototype.splice = function (a) {
      if (arguments.length === 1) {
        return _splice.call(this, a, this.length);
      } else {
        return _splice.apply(this, arguments);
      }
    };
  } //扩展 Array 原生对象


  methods(Array, {
    isArray: function isArray(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    }
  });
  methods(Array.prototype, {
    //定位操作，返回数组中第一个等于给定参数的元素的索引值。
    indexOf: function indexOf(item, index) {
      var n = this.length,
          i = ~~index;
      if (i < 0) i += n;

      for (; i < n; i++) {
        if (this[i] === item) return i;
      }

      return -1;
    },
    //定位引操作，同上，不过是从后遍历。
    lastIndexOf: function lastIndexOf(item, index) {
      var n = this.length,
          i = index == null ? n - 1 : index;
      if (i < 0) i = Math.max(0, n + i);

      for (; i >= 0; i--) {
        if (this[i] === item) return i;
      }

      return -1;
    },
    //迭代操作，将数组的元素挨个儿传入一个函数中执行。Ptototype.js的对应名字为each。
    //注意与$.each不同的是：[,]此数组中元素不会被遍历，且ie8下因无法区分[,undefined],导致值为undefined的元素也不会被遍历。
    //map,filter等函数也是一样的
    forEach: function forEach(fn, scope) {
      for (var i = 0, n = this.length; i < n; i++) {
        i in this && fn.call(scope, this[i], i, this);
      }
    },
    //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
    //参数 item,index,sourceArray
    filter: function filter(fn, scope) {
      for (var r = [], j = 0, i = 0, n = this.length; i < n; i++) {
        if (i in this && fn.call(scope, this[i], i, this)) {
          r[j++] = this[i];
        }
      }

      return r;
    },
    //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Ptototype.js的对应名字为collect。
    map: function map(fn, scope) {
      for (var r = [], i = 0, n = this.length; i < n; i++) {
        i in this && (r[i] = fn.call(scope, this[i], i, this));
      }

      return r;
    },
    fill: function fill(filler, start, end) {
      start = parseInt(Number(start)) || 0;
      var len = this.length;
      end = end === undefined ? len : parseInt(Number(end));
      end = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);

      for (var i = start; i < end; i++) {
        this[i] = filler;
      }

      return this;
    }
  });
  $.Array = {
    removeAt: function removeAt(target, index) {
      //移除数组中指定位置的元素，返回布尔表示成功与否。
      return !!target.splice(index, 1).length;
    },
    remove: function remove(target, item) {
      //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否。
      var index = target.indexOf(item);

      if (index >= 0) {
        return $.Array.removeAt(target, index);
      }

      return false;
    },
    unique: function unique(target) {
      // 对数组进行去重操作，返回一个没有重复元素的新数组。
      var ret = [],
          n = target.length,
          i,
          j; //by abcd

      for (i = 0; i < n; i++) {
        for (j = i + 1; j < n; j++) {
          if (target[i] === target[j]) j = ++i;
        }

        ret.push(target[i]);
      }

      return ret;
    },
    //返回数组中的最小值，用于数字数组。
    //数据可为数字，可转换为数字的字符串、null,即Number(item)不为NaN的
    min: function min(target) {
      return Math.min.apply(0, target);
    },
    //返回数组中的最大值，用于数字数组。
    max: function max(target) {
      return Math.max.apply(0, target);
    },
    //深拷贝
    clone: function clone(target) {
      var i = target.length,
          result = [];

      while (i--) {
        result[i] = cloneOf(target[i]);
      }

      return result;
    }
  };
  /* String */
  //  问题修复(IE8-)
  //  string.substr(start, length)参考 start
  //  要抽取的子串的起始下标。如果是一个负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1指定字符串中的最后一个字符，-2指倒数第二个字符，以此类推。

  var substr = String.prototype.substr;

  if ('ab'.substr(-1) != 'b') {
    String.prototype.substr = function (start, length) {
      start = start < 0 ? Math.max(this.length + start, 0) : start;
      return substr.call(this, start, length);
    };
  } //扩展 String 原生对象


  methods(String.prototype, {
    repeat: function repeat(n) {
      //将字符串重复n遍
      var result = "",
          target = this;

      while (n > 0) {
        if (n & 1) result += target;
        target += target;
        n >>= 1;
      }

      return result;
    },
    startsWith: function startsWith(str) {
      //判定是否以给定字符串开头
      return this.indexOf(str) === 0;
    },
    endsWith: function endsWith(str) {
      //判定是否以给定字符串结尾
      return this.lastIndexOf(str) === this.length - str.length;
    },
    contains: function contains(s, position) {
      //判断一个字符串是否包含另一个字符
      return ''.indexOf.call(this, s, position >> 0) !== -1;
    },
    trim: function trim() {
      return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, '');
    },
    trimLeft: function trimLeft() {
      return this.replace(/^[\s\xA0]+/, "");
    },
    trimRight: function trimRight() {
      return this.replace(/[\s\xA0]+$/, '');
    }
  });
  /* String 非原生扩展 */

  $.String = {
    byteLen: function byteLen(target) {
      /**取得一个字符串所有字节的长度。这是一个后端过来的方法，如果将一个英文字符插
       *入数据库 char、varchar、text 类型的字段时占用一个字节，而一个中文字符插入
       *时占用两个字节，为了避免插入溢出，就需要事先判断字符串的字节长度。在前端，
       *如果我们要用户填空的文本，需要字节上的长短限制，比如发短信，也要用到此方法。
       *随着浏览器普及对二进制的操作，这方法也越来越常用。
       */
      var str = new Array(2 + 1).join("-");
      return target.replace(/[^\x00-\xff]/g, str).length;
    },
    truncate: function truncate(target, length, truncation) {
      //将target字符串截断为length长度，并加上truncation结尾(默认为...)，并返回新字符串
      length = length || 30;
      truncation = truncation === void 0 ? "..." : truncation;
      return target.length > length ? target.slice(0, length) + truncation : String(target);
    },
    encodeHTML: function encodeHTML(target) {
      //将字符串经过 html 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt;
      return target.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    decodeHTML: function decodeHTML(target) {
      //还原为可被文档解析的HTML标签
      return target.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") //处理转义的中文和实体字符
      .replace(/&#([\d]+);/g, function ($0, $1) {
        return String.fromCharCode(parseInt($1, 10));
      });
    },
    pad: function pad(target, n, filling, right) {
      //在左边补上一些字符,默认为'0'
      var num = target.toString();
      filling = filling || "0";

      while (num.length < n) {
        if (!right) {
          num = filling + num;
        } else {
          num += filling;
        }
      }

      return num;
    },

    /**
     * 字符串插值，有两种插值方法。
     * 第一种，第二个参数为对象，{}里面为键名，替换为键值，适用于重叠值够多的情况
     * 第二种，把第一个参数后的参数视为一个数组，{}里面为索引值，从零开始，替换为数组元素
     * @param {String}
     * @param {Object|Any} 插值包或某一个要插的值
     * @return {String}
     */
    format: function format(str, object) {
      var array = slice(arguments, 1);
      return str.replace(rformat, function (match, name) {
        if (match.charAt(0) === "\\") return match.slice(1);
        var index = Number(name);
        if (index >= 0) return array[index];
        if (object && object[name] !== void 0) return object[name];
        return '';
      });
    },
    replaceAll: function replaceAll(target, substr, replacement) {
      if (typeof target === 'string') {
        var regExp = new RegExp(substr, "g");
        return target.replace(regExp, replacement);
      }

      return target;
    },
    isBlank: function isBlank(str) {
      if (str == null || str.trim() === '') {
        return true;
      }

      return false;
    } //trim(chars)
    //stripTags: function (target) {
    //    //移除字符串中的html标签，但这方法有缺陷，如里面有script标签，会把这些不该显示出来的脚本也显示出来了
    //    return target.replace(/<[^>]+>/g, "");
    //},
    //stripScripts: function (target) {
    //    //移除字符串中所有的 script 标签。弥补stripTags方法的缺陷。此方法应在stripTags之前调用。
    //    //无法过滤内联脚本
    //    return target.replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
    //}

  }; //Date
  // Fix Date.get/setYear() (IE5-7)

  if (new Date().getYear() > 1900) {
    Date.now = function () {
      return +new Date();
    }; //http://stackoverflow.com/questions/5763107/javascript-date-getyear-returns-different-result-between-ie-and-firefox-how-to


    Date.prototype.getYear = function () {
      return this.getFullYear() - 1900;
    };

    Date.prototype.setYear = function (year) {
      return this.setFullYear(year); //+ 1900
    };
  }

  $.Date = {
    monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    /**
    * 时间格式化
    * @param {Date} 待格式化的时间
    * @param {String} 格式字符串(向Momment.js看齐) y:年,q:季度,M:月份,d:日期,H:24小时,h:12小时,m:分钟,s:秒,S:毫秒,EE:周X,EEE:星期X
    * @param {Boolean} 是否使用UTC时间
    * @return {String} 格式化字符串
    */
    format: function format(date, _format, useUTC) {
      var o = {
        "M+": useUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1,
        //月份     
        "d+": useUTC ? date.getUTCDate() : date.getDate(),
        //日     
        "h+": useUTC ? date.getUTCHours() % 12 == 0 ? 12 : date.getUTCHours() % 12 : date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
        //小时     
        "H+": useUTC ? date.getUTCHours() : date.getHours(),
        //小时     
        "m+": useUTC ? date.getUTCMinutes() : date.getMinutes(),
        //分     
        "s+": useUTC ? date.getUTCSeconds() : date.getSeconds(),
        //秒     
        "q+": useUTC ? Math.floor((date.getUTCMonth() + 3) / 3) : Math.floor((date.getMonth() + 3) / 3),
        //季度 
        "S": useUTC ? date.getUTCMilliseconds() : date.getMilliseconds() //毫秒     

      };
      var week = {
        "0": "\u65E5",
        //日
        "1": "\u4E00",
        //一
        "2": "\u4E8C",
        //二
        "3": "\u4E09",
        //三
        "4": "\u56DB",
        //四
        "5": "\u4E94",
        //五
        "6": "\u516D" //六

      };
      var weekPre = ["\u661F\u671F", "\u5468"]; //星期、周

      if (/(y+)/.test(_format)) {
        _format = _format.replace(RegExp.$1, ((useUTC ? date.getUTCFullYear() : date.getFullYear()) + "").substr(4 - RegExp.$1.length));
      }

      if (/(E+)/.test(_format)) {
        _format = _format.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? weekPre[0] : weekPre[1] : "") + week[(useUTC ? date.getUTCDay() : date.getDay()) + ""]);
      }

      for (var k in o) {
        if (new RegExp("(" + k + ")").test(_format)) {
          _format = _format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }

      return _format;
    },
    //默认为ISO时间格式(yyyy-MM-ddThh:mm:ss.SZ,T表示日期与时间的间隔，Z表示0时区，若无Z则表示当地时区，或者用+08:00表示时区)
    //间隔符为:/[^\d]+/
    //可使用$.Date.parse(strDate) != null判断str能否转换为日期
    parse: function parse(strDate) {
      var date = null;

      if (typeof strDate === 'string') {
        var nums = strDate.split(/[^\d]+/);
        var y = nums[0] === undefined ? 0 : parseInt(nums[0]),
            M = nums[1] === undefined ? 0 : parseInt(nums[1]),
            d = nums[2] === undefined ? 0 : parseInt(nums[2]),
            h = nums[3] === undefined ? 0 : parseInt(nums[3]),
            m = nums[4] === undefined ? 0 : parseInt(nums[4]),
            s = nums[5] === undefined ? 0 : parseInt(nums[5]),
            S = 0;

        if (nums[6] != null) {
          switch (nums[6].length) {
            case 1:
              S = nums[6] * 100;
              break;

            case 2:
              S = nums[6] * 10;
              break;

            default:
              S = parseInt(nums[6]);
              break;
          }
        }

        if (y > 0 && y < 9999 && M >= 1 && M <= 12 && d > 0 && (M === 2 && (y % 100 !== 0 && y % 4 === 0 || y % 400 === 0) && d <= 29 || d <= $.Date.monthDays[M - 1]) && h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60 && S >= 0 && S < 1000) {
          var timeZone = strDate.match(/([\+\-]\d{2}):?(\d{2})/);

          if (timeZone != null && timeZone.length === 3) {
            if (timeZone[1] >= 0 && timeZone[1] <= 12 && timeZone[2] >= 0 && timeZone[2] < 60) {
              h = h - Number(timeZone[1]);
              m = m - Number(timeZone[2]);
              date = new Date(Date.UTC(y, M - 1, d, h, m, s, S));
            }
          } else if (strDate.charAt(strDate.length - 1) === 'Z') {
            date = new Date(Date.UTC(y, M - 1, d, h, m, s, S));
          } else {
            date = new Date(y, M - 1, d, h, m, s, S);
          }
        }
      }

      return date; //转换失败返回null(可据此判断日期是否有效)
      //baidu 实现
      //var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
      //if ('string' == typeof source) {
      //    if (reg.test(source) || isNaN(Date.parse(source))) {
      //        var d = source.split(/ |T/),
      //            d1 = d.length > 1
      //                    ? d[1].split(/[^\d]/)
      //                    : [0, 0, 0],
      //            d0 = d[0].split(/[^\d]/);
      //        return new Date(d0[0] - 0,
      //                        d0[1] - 1,
      //                        d0[2] - 0,
      //                        d1[0] - 0,
      //                        d1[1] - 0,
      //                        d1[2] - 0);
      //    } else {
      //        return new Date(source);
      //    }
      //}
      //return new Date();
    },

    /**
    * 时间计算
    * @param {Date} 待格式化的时间
    * @param {String} 单位 y:年,q:季度,M:月,w:周,d:日,h:小时,m:分钟,s:秒,S:毫秒
    * @param {num} 加减的数值，负值表示减
    * @return {Date} 计算结果，一个新的时间对象(对原时间对象无影响)
    */
    add: function add(date, unit, num) {
      switch (unit) {
        case 'S':
          return new Date(date.getTime() + num);

        case 's':
          return new Date(date.getTime() + 1000 * num);

        case 'm':
          return new Date(date.getTime() + 60000 * num);

        case 'h':
          return new Date(date.getTime() + 3600000 * num);

        case 'd':
          return new Date(date.getTime() + 86400000 * num);

        case 'w':
          return new Date(date.getTime() + 86400000 * 7 * num);

        case 'q':
          return new Date(date.getFullYear(), date.getMonth() + num * 3, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());

        case 'M':
          return new Date(date.getFullYear(), date.getMonth() + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());

        case 'y':
          return new Date(date.getFullYear() + num, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
      }

      return date;
    },
    diff: function diff(date1, date2, unit) {
      var num = Math.abs(date1 - date2);

      switch (unit) {
        case 'S':
          return num;

        case 's':
          return num / 1000;

        case 'm':
          return num / 60000;

        case 'h':
          return num / 3600000;

        case 'd':
        default:
          return num / 86400000;
      }
    },

    /**
    * 获取距离最近的报告期(所在季度的最后一天)
    * @param {Date} 日期
    * @return {Date} 最近报告期时间，可配合$.Date.foramt格式化
    */
    getPeriod: function getPeriod(date) {
      return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3 + 3, 0);
    },
    getLastDayOfMonth: function getLastDayOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },
    getDaysOfMonth: function getDaysOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    isLeapYear: function isLeapYear(date) {
      return new Date(date.getFullYear(), 2, 0).getDate() === 29;
    },
    fromOADate: function fromOADate(d) {
      if ($.Number.isNumberic(d)) {
        var date = new Date();
        date.setTime(Math.round(d * 24 * 60 * 60 * 1000) + new Date(1899, 11, 30).getTime());
        return date;
      }
    }
  }; //Function

  methods(Function.prototype, {
    //ecma262v5 15.3.4.5
    bind: function bind(scope) {
      if (arguments.length < 2 && scope === void 0) {
        return this;
      }

      var fn = this,
          argv = arguments;
      return function () {
        var args = [],
            i;

        for (i = 1; i < argv.length; i++) {
          args.push(argv[i]);
        }

        for (i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        return fn.apply(scope, args);
      };
    }
  }); //parseInt es5,以0开头的默认按照10进制处理(0x按照16进制)

  if (global.parseInt('09') === 0) {
    var _oldParseInt = global.parseInt;

    global.parseInt = function (str, radix) {
      var s = (str + '').trim();

      if (s.startsWith('0') && !s.startsWith('0x') && !s.startsWith('0X')) {
        radix = radix || 10;
      }

      return _oldParseInt.call(this, str, radix);
    };
  } //Number


  $.Number = {
    //四舍五入，最多保留decimals位小数，可避免因js数字精度问题导致的小数过长问题（可尝试1.1-1）
    //与toFixed区别：1.返回类型为number(toFixed为string) 2.末尾的0不会保留,可能出现小数位小于base的情况(因为是数字) 3.toFixed使用的是银行家舍入法
    round: function round(target, decimals) {
      decimals = Math.pow(10, parseInt(decimals || 0));
      return Math.round(target * decimals) / decimals;
    },
    ceil: function ceil(target, decimals) {
      decimals = Math.pow(10, parseInt(decimals || 0));
      return Math.ceil(target * decimals) / decimals;
    },
    floor: function floor(target, decimals) {
      decimals = Math.pow(10, parseInt(decimals || 0));
      return Math.floor(target * decimals) / decimals;
    },
    //random: function (min, max) {
    //    if (max == null) {
    //        max = min;
    //        min = 0;
    //    }
    //    return min + Math.floor(Math.random() * (max - min + 1));
    //},
    //
    //

    /**
     * 此方法使用四舍五入法，支持千分位
     * 而chrome下测试1.555.toFixed(2)测试结果为1.55(chrome的toFixed使用的是银行家舍入法)
     * @param {Number|String} target 需要处理的数字或可转化为数字的String
     * @param {Number} decimals 需保留的小数位数，默认不处理（可传undefined表示默认）
     * @param {Boolean} isThousands 是否进行千分位处理，默认不处理
     * @return {String} 格式化后的字符串
     */
    format: function format(target, decimals, isThousands) {
      target = Number(target);
      var result = '';

      if (decimals >= 0) {
        result = $.Number.round(target, decimals).toFixed(decimals);
      } else {
        result = target.toString();
      }

      if (isThousands) {
        //result = result.replace(/\d+?(?=(?:\d{3})+$)/g, function (s) {
        //    return s + ',';
        //});
        var last = result.indexOf('.') >= 0 ? result.indexOf('.') : result.length;
        var inter = 3;

        if (last > inter) {
          var arr = [];

          for (var i = 0; i < last; i++) {
            arr.push(result.charAt(i));

            if (last - i - 1 > 0 && (last - i - 1) % inter === 0) {
              arr.push(',');
            }
          }

          result = arr.join('') + (result.indexOf('.') >= 0 ? result.substr(result.indexOf('.')) : '');
        }
      }

      return result;
    },
    //用Number.isFinite替代
    isNumber: function isNumber(v) {
      //1.typeof NaN 和 Infinity 都等于 number
      //2.isFinite可过滤到这两个值,但isFinite会先对参数做Number()转换而 Number([]) === 0 ,Number('') === 0
      return typeof v === 'number' && isFinite(v);
    },
    //与isNumber的区别是对于数字的string格式也能接受
    //数字转换中的特殊情况(null|true|false|''|undefined|NaN|Infinity|[]|[1])
    isNumberic: function isNumberic(v) {
      //1.过滤特殊数组[1]
      //2.isFinite(v):先Number(v),可过滤NaN和Infinity及'4a'，但无法过滤[],''(应该是Number(v)会先对v进行toString操作)
      //3.过滤掉上述情况，特殊情况为parseFloat('4a') === 4
      return (typeof v === 'number' || typeof v === 'string') && isFinite(v) && isFinite(parseFloat(v));
    }
  };
  methods(Number, {
    isFinite: function isFinite(val) {
      return typeof val === 'number' && global.isFinite(val);
    },
    isNaN: function isNaN(val) {
      return typeof val === 'number' && global.isNaN(val);
    },
    isInteger: function isInteger(val) {
      return typeof val === 'number' && global.isFinite(val) && Math.floor(val) === val;
    }
  });
  /* from https://github.com/paulmillr/console-polyfill */

  (function () {
    if (!global.console) {
      global.console = {};
    }

    var con = global.console;
    var prop, method;

    var dummy = function dummy() {};

    var properties = ['memory'];
    var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');

    while (prop = properties.pop()) {
      if (!con[prop]) {
        con[prop] = {};
      }

      ;
    }

    while (method = methods.pop()) {
      if (!con[method]) {
        con[method] = dummy;
      }
    } //$.log(console.log, null, 'page');

  })();

  return $;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/langControl.js":
/*!****************************!*\
  !*** ./src/langControl.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
    wind.langControl
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js"), __webpack_require__(/*! ./client */ "./src/client.js"), __webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  /*
  1.对于html中的元素（[langkey]），会在获取langInfo后通过setValues替换。
  2.对于js动态生成的数据，应在langLoaded中通过$.langControl.getText(key,defaultValue)方式获取text，然后再进行初始化
  3.以上过程通过$.langControl.init触发，lang默认通过query('lan')获取，可通过setLang设置
  4.当lang==defaultLang时init/initByKeys不进行数据获取和替换操作，因此项目应默认提供defaultLang数据，若不想如此，请先通过setLang将defaultLang设置为''
    优化方案：
      多语言js应编程静态/服务端缓存
      客户端应该也有缓存（短期）
  */
  var defaultLocale = 'zh-CN';
  /*
      将数组形式的langInfo转换为key/value形式
  */

  function convertLangInfo(data) {
    var ret = {};

    if (Array.isArray(data)) {
      data.forEach(function (item, index) {
        if (item.ID != null) {
          ret[item.ID + ''] = item;
        }
      });
    }

    return ret;
  }

  function getSyscfg() {
    var ret = $.client.doFuncSync({
      func: 'querydata',
      name: 'syscfg',
      isGlobal: '1'
    });

    if (ret && ret.result && ret.result.length) {
      return JSON.parse(ret.result);
    }

    return null;
  }
  /*
      获取多语言设置
      url优先 -> ClientFunc -> window.navigator.language
  */


  function getLocale() {
    var locale = navigator.language; // 系统设置

    var search = window.location.search;
    var match = search.match(/[?|&]lang?=([^&]+)/); // url优先

    if (match && match[1]) {
      locale = match[1];
      var lang = locale.toLowerCase();

      if (lang === 'cn') {
        locale = 'zh-CN';
      } else if (lang === 'en') {
        locale = 'en-US';
      }
    } else {
      // 获取终端设置
      var cfg = getSyscfg();

      if (cfg && cfg.Lang) {
        locale = cfg.Lang === 'ENS' ? 'en-US' : 'zh-CN';
      }
    }

    return locale;
  } // 获取语言大类设置


  function getLang(locale) {
    if (typeof locale === 'string' && locale.length > 0) {
      if (locale.indexOf('-') > 0) {
        return locale.split('-')[0].toLowerCase();
      }
    }

    return locale;
  }
  /*
      根据语言设置匹配资源，因目前实际只有两种语言资源，所以都要转为 zh-CN 或 en-US,
      未来应可以设置对应表，如{
          zh:'zh-CN',
          en:'en-US',
          'zh-TW':'zh-TW'
      }
  */


  function getLangResource(locale) {
    if (getLang(locale) === 'en') {
      locale = 'en-US';
    } else {
      locale = 'zh-CN';
    }

    return locale;
  }

  function getSpace(locale) {
    if (getLang(locale) === 'en') {
      return ' ';
    }

    return '';
  }

  function _getText(key, params, initVal, langInfo, isUsingDefault) {
    if (initVal == null) {
      initVal = '';
    }

    if (!langInfo) {
      return initVal;
    }

    if (key != null) {
      key = key + '';
      var isShort = false;

      if (key[key.length - 1] === 's') {
        isShort = true;
        key = key.substring(0, key.length - 1);
      }

      if (key && langInfo[key]) {
        var info = langInfo[key];
        var v = isShort ? info.ShortStr : info.FullStr;

        if (v) {
          if (_typeof(params) === 'object') {
            v = v.replace(/{s\d*}/g, function (val) {
              var key = val.match(/s\d*/)[0];
              return params[key];
            });
          }

          return v;
        }
      } else if (!isUsingDefault) {
        // console.log('多语言词条("' + key + '")找不到');
      }
    }

    return initVal;
  }

  var locale = getLocale();
  var mod = {
    //语言资源数据
    langInfo: {},
    //带占位符的词条的参数
    langParams: {},
    //语言大类,如 zh/en, 原cn会转化为zh
    lang: getLang(locale),
    //完整语言设置,如"zh-CN" 
    locale: locale,
    //默认语言大类
    defaultLocale: defaultLocale,
    //默认语言
    defaultLang: getLang(defaultLocale),
    //是否带默认词汇，若为true则当 locale == defaultLocale 时不会发起请求
    withDefaultWord: false,
    //需要替换的label的属性key
    cusLable: "langkey",
    langHandlerUrl: "LangHandler.aspx",
    //lang数据加载后的回调
    langLoaded: function langLoaded() {},
    // 当locale准备就绪后调用，解决clientFunc未初始化导致locale未正确获取的问题
    // 201910月版本会解决clientFunc未准备好的问题，因此原逻辑未变化(如locale会尝试初始化)
    initLocale: function initLocale() {
      // client增加ready方法，这里clientFunc ready之后再调用
      mod.setLocale(getLocale());
    },
    //设置语言(locale)
    setLocale: function setLocale(locale, defaultLocale) {
      if (locale != null && locale !== mod.locale) {
        mod.locale = locale;
        mod.lang = getLang(locale);
        mod.space = getSpace(locale);
        mod.langInfo = {}; // 清空原资源
      }

      if (defaultLocale != null && defaultLocale !== mod.defaultLocale) {
        mod.defaultLocale = defaultLocale;
        mod.defaultLang = getLang(defaultLocale);
      }
    },

    /*
        原setValueFromServer
        1.将data数据加入langInfo (单独此步骤可用loadLangInfo代替)
        2.找到有cuslable属性的元素，根据data替换多语言文本
    */
    setValues: function setValues(data) {
      var self = mod;
      self.loadLangInfo(data);

      if (self.langInfo) {
        var childs = $("[" + self.cusLable + "]");
        if (childs == null || childs == undefined || childs.length == 0) return;
        var $item = null,
            langkey = null;
        $.each(childs, function (index, item) {
          $item = $(item);
          langkey = $item.attr(self.cusLable);
          var showVal = self.getText(langkey);

          if (showVal) {
            if ($item.attr("onlyTitle") != null) {
              $item.attr("title", showVal);
            } else if ($item.is('input')) {
              $item.val(showVal);

              if ($item.attr("title")) {
                $item.attr("title", showVal);
              }

              ;
            } else if ($item.is('image')) {
              $item.attr("alt", showVal);
            } else if ($item.is("title")) {
              document.title = showVal;
            } else {
              $item.html(showVal);
            }

            if ($item.attr("addTitle") != null) {
              $item.attr("title", showVal);
            }
          }
        });
      }
    },
    loadLangInfo: function loadLangInfo(data) {
      var self = mod;

      if (data) {
        if (Array.isArray(data)) {
          data = convertLangInfo(data);
        }

        var langInfo = self.langInfo || {};

        for (var key in data) {
          langInfo[key] = data[key];
        }

        self.langInfo = langInfo;
      }
    },

    /**
     * 添加词条的占位符参数，如：
     * 原langParams: {'11111': {s: 'a', s1: 'b'}, '22222': {s: '1', s1: '2'}}
     * params: {'33333': {s: 'a1', s1: 'a2'}, '22222': {s: '3', s1: '2'}}
     * 新langParams: {'11111': {s: 'a', s1: 'b'}, '33333': {s: 'a1', s1: 'a2'}, '22222': {s: '3', s1: '2'}}
     */
    loadLangParams: function loadLangParams(params) {
      var self = mod;

      if (params) {
        if (Object.prototype.toString.call(params) === '[object Object]') {
          $.mix(self.langParams, params);
        }
      }
    },

    /*
        词条组合时，中文无空格，而英文有空格
    */
    space: getSpace(locale),
    // 是否在使用默认词汇(通过getText第二个参数传入)
    isUsingDefault: function isUsingDefault() {
      var self = mod;
      return self.withDefaultWord && self.locale === self.defaultLocale;
    },

    /*
        根据key通过ajax获取langInfo并调用setValues和langLoaded，进行替换和初始化工作
        当lang与defaultLang相同时不获取langInfo，因此setValues时会使用默认值（若不希望如此可将defaultLang设置为空）
        替换原setValueFromClient(取消了cusL参数，若需要修改应通过$.langControl.cusLable修改)
        此方法经过确认不支持
    */
    // initByKeys: function (langkeys, onLangLoaded) {
    //     var self = mod;
    //     if (typeof onLangLoaded === 'function') {
    //         self.langLoaded = onLangLoaded;
    //     }
    //     if (self.lang && self.lang != self.defaultLang) {
    //         $.ajax({
    //             type: 'post',//因要发送data数据可能很大，默认为post
    //             url: "LangHandler.aspx?action=getlangs&lang=" + self.lang,
    //             data: 'data=' + escape(langkeys),
    //             dataType: 'json',
    //             success: function (data) {
    //                 if (data != null) {
    //                     self.langInfo = convertLangInfo(data);
    //                     mod.setValues(self.langInfo);
    //                     mod.langLoaded();
    //                 }
    //             }
    //         });
    //     } else if (typeof self.langLoaded === 'function') {
    //         self.langLoaded();
    //     }
    // },

    /*
        根据pageName和moduleName通过ajax获取langInfo数据并调用setValues和langLoaded，进行替换和初始化工作
        当lang与defaultLang相同时不获取langInfo，因此setValues时会使用默认值（若不希望如此可将defaultLang设置为空）
        替换原setValue，取消了cusL参数，若需要修改应通过$.langControl.cusLable修改
    */
    init: function init(pageName, moduleName, onLangLoaded, onError) {
      var self = mod;
      pageName = pageName || "";
      moduleName = moduleName || "";

      if (typeof onLangLoaded === 'function') {
        self.langLoaded = onLangLoaded;
      }

      if (self.locale && !self.isUsingDefault()) {
        // console.log('init', self.locale, getLang(self.locale));
        $.ajax({
          type: 'post',
          //还是用post防止缓存不更新
          url: mod.langHandlerUrl + (mod.langHandlerUrl.indexOf("?") > 0 ? "&" : "?") + "action=getlangs&page=" + pageName + "&lang=" + (getLang(self.locale) === 'en' ? 'en' : 'cn') + "&moduleName=" + moduleName,
          dataType: 'json',
          success: function success(data) {
            if (data != null) {
              self.setValues(data);
              self.langLoaded();
            }
          },
          error: function error(xhr, textStatus, errorThrown) {
            if (typeof onError === 'function') {
              onError(xhr, textStatus, errorThrown);
            }
          }
        });
      } else {
        self.langLoaded();
      }
    },

    /*
        根据path指定的目录获取资源，如 path/en_US.json
    */
    initByJSON: function initByJSON(path, onLangLoaded, onError) {
      var self = mod;

      if (typeof onLangLoaded === 'function') {
        self.langLoaded = onLangLoaded;
      }

      if (self.locale && !self.isUsingDefault()) {
        $.ajax({
          //默认应该也没有缓存问题
          // url: path + getLangResource(self.locale).replace('-', '_') + '.json',
		  url: path + getLangResource(self.locale).replace('-', '_') + '.js',
          dataType: 'json',
          success: function success(data) {
            if (data != null) {
              self.setValues(data);
              self.langLoaded();
            }
          },
          error: function error(xhr, textStatus, errorThrown) {
            if (typeof onError === 'function') {
              onError(xhr, textStatus, errorThrown);
            }
          }
        });
      } else {
        self.langLoaded();
      }
    },

    /*
      根据key获取text
      @param {String|Int} key langId，结尾可带s，表示取shortStr
      @param {Object} params 占位符替换对象
      @param {String} defaultVal 默认值，若langInfo无值或langInfo中找不到key对应值时使用这个，一般可传默认语言的value
    */
    // 添加占位符替换参数params，并兼容老版本getText写法
    getText: function getText(key, params, defaultVal) {
      var self = mod;

      if (typeof params === 'string') {
        defaultVal = params;
        params = null;
      }

      if (params == null) {
        params = self.langParams[key];
      }

      return _getText(key, params, defaultVal, mod.langInfo);
    },
    intl: function intl(key, params, defaultVal) {
      return mod.getText(key, params, defaultVal);
    },
    getRawName: function getRawName(name) {
      if (name == null || name == undefined || name == "") return "";
      var start = name.indexOf("(");
      var end = name.indexOf(")");

      if (start > 0 && end > 0 && end - start > 0) {
        name = name.substring(0, start);
      }

      return name;
    }
  };
  $.langControl = mod;
  return mod;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/seed.js":
/*!*********************!*\
  !*** ./src/seed.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * wind.seed
 * 使用 wind 和 $ 作为全局名称
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  var global = window || this;

  if (!global.$) {
    global.$ = {};
  }

  var wind = global.wind = global.$;
  /**
   * 糅杂，为一个对象添加更多成员
   * @param {Object} receiver 接受者
   * @param {Object} supplier 提供者
   * @param {Boolean} override 最后一个参数，是否覆盖，默认为true
   * @return  {Object} 目标对象
   * @api public
   */

  function mix(receiver, supplier) {
    var args = [].slice.call(arguments),
        i = 1,
        key,
        //如果最后参数是布尔，判定是否覆写同名属性
    override = typeof args[args.length - 1] === "boolean" ? args.pop() : true;

    if (args.length === 1) {
      //处理$.mix(hash)的情形
      receiver = !this.window ? this : {};
      i = 0;
    }

    while (supplier = args[i++]) {
      for (key in supplier) {
        //允许对象糅杂，用户保证都是对象
        if (hasOwn.call(supplier, key) && (override || !(key in receiver))) {
          receiver[key] = supplier[key];
        }
      }
    }

    return receiver;
  }

  var class2type = {
    "[object HTMLDocument]": "Document",
    "[object HTMLCollection]": "NodeList",
    "[object StaticNodeList]": "NodeList",
    "[object DOMWindow]": "Window",
    "[object Window]": "Window",
    "[object global]": "Window",
    "null": "Null",
    "NaN": "NaN",
    "undefined": "Undefined"
  },
      hasOwn = Object.prototype.hasOwnProperty;
  var idCounter = 0;

  function uid(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  ;
  mix(wind, {
    mix: mix,

    /**
     * 用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情况下） 改为type2避免与jQuery.type重复
     * @param {Any} obj 要检测的东西
     * @param {String} str ? 要比较的类型
     * @return {String(Window/Document/Arguments/NodeList/String/Date/Number/Object/RegExp)|Boolean}
     * @api public
     */
    type2: function type2(obj, str) {
      var serialize = Object.prototype.toString;
      var result = class2type[obj == null || obj !== obj ? obj : serialize.call(obj)] || obj.nodeName || "#";

      if (result.charAt(0) === "#") {
        //兼容旧式浏览器与处理个别情况,如window.opera
        //利用IE678 window == document为true,document == window竟然为false的神奇特性
        if (obj == obj.document && obj.document != obj) {
          result = "Window"; //返回构造器名字
        } else if (obj.nodeType === 9) {
          result = "Document"; //返回构造器名字
        } else if (obj.callee) {
          result = "Arguments"; //返回构造器名字
        } else if (isFinite(obj.length) && obj.item) {
          result = "NodeList"; //处理节点集合
        } else {
          result = serialize.call(obj).slice(8, -1);
        }
      }

      if (str) {
        return str === result;
      }

      return result;
    },
    uid: uid,

    /**
     *  将调试信息打印到控制台或页面
     *  $.log(str, level, render )
     *  @param {Any} str 用于打印的信息，不是字符串将转换为字符串
     *  @param {Number} level ? 通过它来过滤显示到控制台的日志数量。
     *          0为最少，只显示最致命的错误；7，则连普通的调试消息也打印出来。
     *          显示算法为 level <= $.config.level。
     *          这个$.config.level默认为9。下面是level各代表的含义。
     *          1 FATAL 致命错误
     *          2 ERROR 一般错误
     *          3 WARN 警告
     *          4 INFO  一般信息
     *          5 DEBUG 调试消息
     *  @param {String} render ? 输出方式，支持console/page方式,默认为console
     *  @return {String}
     *  @api public
     */
    log: function log(str, level, render) {
      //默认日志级别
      var dLevel = 4,
          log = wind.log,
          doc = window && window.document;

      if (typeof level === 'string') {
        level = log.levels[level.toLowerCase()] || dLevel;
      } else if (typeof level !== 'number') {
        level = dLevel;
      }

      var show = level <= log.level;

      if (show) {
        render = render || log.render;

        if (render === 'page' && doc) {
          var div = doc.getElementById('wind_sys_log');

          if (div == null) {
            div = doc.createElement('div');
            div.id = 'wind_sys_log';
            doc.body.appendChild(div);
          }

          var info = doc.createElement("pre");
          info.innerHTML = str + ""; //转换为字符串

          div.appendChild(info);
        } else if (global.console && global.console.log) {
          global.console.log(str);
        }
      }

      return str;
    }
  });
  mix(wind.log, {
    //日志级别
    levels: {
      'fatal': 1,
      'error': 2,
      'warn': 3,
      'info': 4,
      'debug': 5
    },
    //输出级别：等于或高于此级别的日志会输出
    level: 4,
    //输出方式 console|page
    render: 'console'
  });
  return wind;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/service.js":
/*!************************!*\
  !*** ./src/service.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
    wind.service
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js"), __webpack_require__(/*! jquery */ "jquery"), __webpack_require__(/*! ./uri */ "./src/uri.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  var module = {
    config: {
      ajaxHandlerUrl: '/' + $.uri().appName() + "/AjaxHandler.aspx",
      ajaxSecureHandlerUrl: '/' + $.uri().appName() + "/AjaxSecureUnlockHandler.aspx",
      ajaxOpt: undefined,
      //自定义ajax设置,
      ajaxSuccess: undefined,
      ajaxError: undefined,
      ajaxComplete: undefined
    },

    /*
        {
            secure:true(默认)使用AjaxSecureUnlockHandler，false使用AjaxHandler
            method:'',//方法别名
            params:[],//参数列表
            success:function(data, textStatus, jqXHR){},
            error:function(XMLHttpRequest, textStatus, errorThrown){},
            complete:function(XMLHttpRequest, textStatus){}
        }
    */
    ajaxMethod: function ajaxMethod(opt) {
      var dataParameters = {
        MethodAlias: opt.method,
        Parameter: opt.params
      };
      $.ajax($.extend(module.config.ajaxOpt, {
        type: 'POST',
        dataType: 'json',
        url: opt.secure === false ? module.config.ajaxHandlerUrl : module.config.ajaxSecureHandlerUrl,
        data: "data=" + encodeURIComponent(JSON.stringify(dataParameters)),
        success: function success(data, textStatus, jqXHR) {
          //system work
          //通用处理
          if (typeof module.config.ajaxSuccess === 'function') {
            module.config.ajaxSuccess.apply(this, arguments);
          }

          if (typeof opt.success === 'function') {
            opt.success.apply(this, arguments);
          }
        },
        error: function error(XMLHttpRequest, textStatus, errorThrown) {
          if (typeof module.config.ajaxError === 'function') {
            module.config.ajaxError.apply(this, arguments);
          }

          if (typeof opt.error === 'function') {
            opt.error.apply(this, arguments);
          }
        },
        //ajax请求错误回调
        complete: function complete(XMLHttpRequest, textStatus) {
          if (typeof module.config.ajaxComplete === 'function') {
            module.config.ajaxComplete.apply(this, arguments);
          }

          if (typeof opt.complete === 'function') {
            opt.complete.apply(this, arguments);
          }
        }
      }));
    } //, ajaxExpo: function () {
    //    //须考虑接口安全（比如只调用业务expo接口）
    //    //及服务端实现
    //}

  };
  $.service = module;
  return module;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/ua.js":
/*!*******************!*\
  !*** ./src/ua.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
    wind.ua
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  //refer to KISSY UA
  var win = window,
      doc = win.document,
      navigator = win.navigator,
      ua = navigator && navigator.userAgent || '';

  function numberify(s) {
    //var c = 0;
    //// convert '1.2.3.4' to 1.234
    //return parseFloat(s.replace(/\./g, function () {
    //    return (c++ === 0) ? '.' : '';
    //}));
    //考虑到1.5.3与1.23.4的问题，这里还是不做处理，同时建议只进行主版本号的比对
    return s + ''; //都返回string
  }

  function setTridentVersion(ua, UA) {
    var core, m;
    UA[core = 'trident'] = 0.1; // Trident detected, look for revision
    // Get the Trident's accurate version

    if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
      UA[core] = numberify(m[1]);
    }

    UA.core = core;
  }

  function getIEVersion(ua) {
    var m, v;

    if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) && (v = m[1] || m[2])) {
      return numberify(v);
    }

    return 0;
  }

  function getDescriptorFromUserAgent(ua) {
    var EMPTY = '',
        os,
        core = EMPTY,
        shell = EMPTY,
        m,
        IE_DETECT_RANGE = [6, 9],
        ieVersion,
        v,
        end,
        VERSION_PLACEHOLDER = '{{version}}',
        IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
        div = doc && doc.createElement('div'),
        s = [];
    /**
     * @class wind.ua
     * @singleton
     */

    var UA = {
      //core
      webkit: undefined,
      trident: undefined,
      gecko: undefined,
      presto: undefined,
      //browser/shell
      chrome: undefined,
      safari: undefined,
      firefox: undefined,
      ie: undefined,
      opera: undefined,

      /*
          等同于 document.documentMode,类型:number
          浏览器内：ie8兼容模式下 ie=7 && ieMode=8, 因为实际表现更像ie7，还是建议使用ie (ie11下ieMode会跟随兼容模式改变)
          终端内:ie=ieMode，能够较准确判断ie的实际渲染模式（如ie11下有edge时为11，无edge时为7）
          综上，大多数情况应使用ie判断
      */
      ieMode: undefined,
      //apple/android/nokia/webos/opera/firefox/
      mobile: undefined,
      //内核：webkit/trident/gecko/presto
      core: undefined,
      //外壳=browser :chrome/safari/firefox/ie/opera
      shell: undefined,
      phantomjs: undefined,
      //ios/android/macintosh/windows/linux
      os: undefined,
      ios: undefined,
      android: undefined,
      //客户端（pc|cosmos|mobile），若为undefined说明在浏览器中
      //在ie内核中：若页面加载时客户端可能未呈现，则最好在body.onload中调用
      client: undefined
    }; // ejecta

    if (div && div.getElementsByTagName) {
      // try to use IE-Conditional-Comment detect IE more accurately
      // IE10 doesn't support this method, @ref: http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
      div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
      s = div.getElementsByTagName('s');
    } //ie


    if (s.length > 0) {
      setTridentVersion(ua, UA); // Detect the accurate version
      // 注意：
      //  UA.shell = ie, 表示外壳是 ie
      //  但 UA.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
      //  对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 UA.ie = 8, 否则
      //  很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同

      for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
        div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);

        if (s.length > 0) {
          UA[shell = 'ie'] = v;
          break;
        }
      } // https://github.com/kissyteam/kissy/issues/321
      // win8 embed app


      if (!UA.ie && (ieVersion = getIEVersion(ua))) {
        $.log(ieVersion);
        UA[shell = 'ie'] = ieVersion;
      }
    } else {
      //增加移动判断，默认为other 
      //发现对Nexus/Kindle等设备的支持还是不好，因此可能通过触屏事件判断更好一些
      if (/\bMobile\b/i.test(ua)) {
        UA.mobile = 'other';
      } // WebKit


      if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
        UA[core = 'webkit'] = numberify(m[1]);

        if ((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
          UA[shell = 'opera'] = numberify(m[1]);
        } // Chrome
        else if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
            UA[shell = 'chrome'] = numberify(m[1]);
          } // Safari
          else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
              UA[shell = 'safari'] = numberify(m[1]);
            } // Apple Mobile


        if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
          UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

          m = ua.match(/OS ([^\s]*)/);

          if (m && m[1]) {
            UA.ios = numberify(m[1].replace('_', '.'));
          }

          os = 'ios';
        } else if (/ Android/i.test(ua)) {
          if (/Mobile/.test(ua)) {
            os = UA.mobile = 'android';
          }

          m = ua.match(/Android ([^\s]*);/);

          if (m && m[1]) {
            UA.android = numberify(m[1]);
          }
        } // Other WebKit Mobile Browsers
        else if (m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/)) {
            UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
          }

        if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
          UA.phantomjs = numberify(m[1]);
        }
      } // NOT WebKit
      else {
          // Presto
          // ref: http://www.useragentstring.com/pages/useragentstring.php
          if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
            UA[core = 'presto'] = numberify(m[1]); // Opera

            if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
              UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

              if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                UA[shell] = numberify(m[1]);
              } // Opera Mini


              if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
              } // Opera Mobile
              // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
              // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
              else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                  UA.mobile = m[0];
                }
            } // NOT WebKit or Presto

          } else {
            // MSIE
            // 由于最开始已经使用了 IE 条件注释判断，因此落到这里的唯一可能性只有 IE10+
            // and analysis tools in nodejs
            if (ieVersion = getIEVersion(ua)) {
              UA[shell = 'ie'] = ieVersion;
              setTridentVersion(ua, UA); // NOT WebKit, Presto or IE
            } else {
              // Gecko
              if (m = ua.match(/Gecko/)) {
                UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision

                if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                  UA[core] = numberify(m[1]);

                  if (/Mobile|Tablet/.test(ua)) {
                    UA.mobile = 'firefox';
                  }
                } // Firefox


                if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                  UA[shell = 'firefox'] = numberify(m[1]);
                }
              }
            }
          }
        }
    }

    if (!os) {
      if (/windows|win32/i.test(ua)) {
        os = 'windows';
      } else if (/macintosh|mac_powerpc/i.test(ua)) {
        os = 'macintosh';
      } else if (/linux/i.test(ua)) {
        os = 'linux';
      }
    }

    UA.os = os;
    UA.core = UA.core || core;
    UA.shell = shell;
    UA.ieMode = UA.ie && doc.documentMode || parseFloat(UA.ie) || undefined;

    function setClient() {
      try {
        //终端首页ie下body.onload后为unknown，之前为都为undefined（进步一验证猜测，是因为首页加载的非常早（终端还没出现），后面的页面都没问题，也就是说终端首页出现后，跳转的任何页面，包括新tab都不会有问题，而在终端显示前，如在wwm的头上跳转到另一个页面，只要这个页面加载的足够快，就可能有问题）
        //因此 ie下 window.external.ClientFunc最好在body.onload中调用才能保证成功(需修改代码)
        if (!!(window.external && typeof window.external.ClientFunc !== 'undefined')) {
          UA.client = 'pc';

          if (UA.ie != null) {
            UA.ie = UA.ieMode + ''; //客户端内ieMode更准
          }
        }
      } catch (e) {}
    }

    setClient();

    if (UA.ie && !UA.client) {
      //ie下window.onload再设置一次
      if (window.addEventListener) {
        window.addEventListener('load', setClient);
      } else if (window.attachEvent) {
        window.attachEvent('onload', setClient);
      }
    }

    return UA;
  }

  var UA = getDescriptorFromUserAgent(ua);
  var browsers = [// browser core type
  'webkit', 'trident', 'gecko', 'presto', // browser shell type
  'chrome', 'safari', 'firefox', 'ie', 'opera'],
      documentElement = doc && doc.documentElement,
      className = '';

  if (documentElement) {
    //html节点上增加浏览器和内核的class，方便进行css处理，但此方式需要保证js的执行足够早，因此并不十分推荐
    browsers.forEach(function (key) {
      var v = UA[key];

      if (v) {
        className += ' wind-' + key + (parseInt(v) + '');
        className += ' wind-' + key;
      }
    });

    if (className.trim()) {
      documentElement.className = (documentElement.className + className).trim();
    }
  }

  $.ua = UA;
  return UA;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/uri.js":
/*!********************!*\
  !*** ./src/uri.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
    wind.uri
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  //from KISSY.Uri
  var URI_SPLIT_REG = new RegExp('^' +
  /*
   Scheme names consist of a sequence of characters beginning with a
   letter and followed by any combination of letters, digits, plus
   ('+'), period ('.'), or hyphen ('-').
   */
  '(?:([\\w\\d+.-]+):)?' + // scheme
  '(?://' +
  /*
   The authority component is preceded by a double slash ('//') and is
   terminated by the next slash ('/'), question mark ('?'), or number
   sign ('#') character, or by the end of the URI.
   */
  '(?:([^/?#@]*)@)?' + // userInfo
  '(' + "[\\w\\d\\-\\u0100-\\uffff.+%]*" + '|' + // ipv6
  '\\[[^\\]]+\\]' + ')' + // hostname - restrict to letters,
  // digits, dashes, dots, percent
  // escapes, and unicode characters.
  '(?::([0-9]+))?' + // port
  ')?' +
  /*
   The path is terminated
   by the first question mark ('?') or number sign ('#') character, or
   by the end of the URI.
   */
  '([^?#]+)?' + // path. hierarchical part

  /*
   The query component is indicated by the first question
   mark ('?') character and terminated by a number sign ('#') character
   or by the end of the URI.
   */
  '(?:\\?([^#]*))?' + // query. non-hierarchical data

  /*
   The fragment identifier component of a URI allows indirect
   identification of a secondary resource by reference to a primary
   resource and additional identifying information.
     A
   fragment identifier component is indicated by the presence of a
   number sign ('#') character and terminated by the end of the URI.
   */
  '(?:#(.*))?' + // fragment
  '$');
  REG_INFO = {
    scheme: 1,
    userInfo: 2,
    hostname: 3,
    port: 4,
    path: 5,
    search: 6,
    fragment: 7
  }; // Remove .. and . in path array

  function normalizeArray(parts, allowAboveRoot) {
    // level above root
    var up = 0,
        i = parts.length - 1,
        // splice costs a lot in ie
    // use new array instead
    newParts = [],
        last;

    for (; i >= 0; i--) {
      last = parts[i];

      if (last !== '.') {
        if (last === '..') {
          up++;
        } else if (up) {
          up--;
        } else {
          newParts[newParts.length] = last;
        }
      }
    } // if allow above root, has to add ..


    if (allowAboveRoot) {
      for (; up--; up) {
        newParts[newParts.length] = '..';
      }
    }

    newParts = newParts.reverse();
    return newParts;
  }
  /**
       * normalize .. and . in path
       * @param {String} path Path tobe normalized
       *
       *
       *      'x/y/../z' => 'x/z'
       *      'x/y/z/../' => 'x/y/'
       *
       * @return {String}
       */


  function normalize(path) {
    var absolute = path.charAt(0) === '/',
        trailingSlash = path.slice(-1) === '/';
    path = normalizeArray((path.split('/') || []).filter(function (p) {
      return !!p;
    }), !absolute).join('/');

    if (!path && !absolute) {
      path = '.';
    }

    if (path && trailingSlash) {
      path += '/';
    }

    return (absolute ? '/' : '') + path;
  } //据说使用split比正则性能好


  function parseParams(search) {
    var result = {};

    if (typeof search === 'string') {
      var params = search.split('&'),
          k_v = [];

      if (params && params.length) {
        $.each(params, function (index, item) {
          k_v = item.split('=');

          if (k_v && k_v.length && k_v[0]) {
            result[k_v[0]] = k_v[1] == null ? '' : decodeURIComponent(k_v[1]);
          }
        });
      }
    }

    return result;
  }

  function buildSearch(params) {
    var result = '',
        isF = true;

    if (_typeof(params) === 'object') {
      $.each(params, function (index, item) {
        if (item != null) {
          if (isF) {
            isF = false;
          } else {
            result += '&';
          }

          result += index + '=' + encodeURIComponent(item);
        }
      });
    }

    return result;
  }

  var URI = function URI(url) {
    if (!(this instanceof URI)) {
      return new URI(url);
    }

    if (typeof url !== 'string') {
      return locationUrl; //对本页url进行优化
    }

    var self = this;
    var m = url.match(URI_SPLIT_REG) || [];
    $.each(REG_INFO, function (index, item) {
      self[index] = m[item] == null ? '' : m[item];
    });
    self._search = self.search; //跟踪search变化    

    self._params = parseParams(self.search);
  };

  $.mix(URI.prototype, {
    /**
     *@param {String} key  忽略大小写
     *@param {String|undefined} value 无则为get，有则为set，设置为null表示删除 
    */
    query: function query(key, value) {
      //get
      if (typeof value === 'undefined') {
        var result;

        if (typeof key === 'string') {
          //可能修改search导致query值变化
          if (this._search != this.search) {
            this._search = this.search;
            this._params = parseParams(this._search);
          }

          $.each(this._params, function (index, item) {
            if (index.toString().toLowerCase() === key.toLowerCase()) {
              result = item;
              return false;
            }
          });
        }

        return result;
      } else {
        //set
        if (typeof key === 'string') {
          if (value != null) {
            this._params[key] = value;
          } else if (this._params.hasOwnProperty(key)) {
            //null表示删除此属性
            delete this._params[key];
          }

          this._search = this.search = buildSearch(this._params);
        }

        return this;
      }
    },
    //将key值设置为null或undefined则表示删除
    //合并至query
    //setQuery: function (key, value) {
    //    if (typeof key === 'string') {
    //        if (value != null) {
    //            this._params[key] = value;
    //        } else if (this._params.hasOwnProperty(key)) {
    //            delete this._params[key];
    //        }
    //        this._search = this.search = buildSearch(this._params);
    //    }
    //    return this;
    //},
    //获取web应用名称(虚拟目录名)，若在根目录下则返回''
    appName: function appName() {
      var path = this.path;

      if (path.startsWith('/')) {
        path = path.substring(1);
      }

      if (path.indexOf('/') > 0) {
        return path.substring(0, path.indexOf('/'));
      }

      return '';
    },
    host: function host() {
      return this.hostname + (this.port != null && this.port.length ? ':' + this.port : '');
    },

    /**
     * The reference resolution algorithm.rfc 5.2
     * return a resolved uri corresponding to current uri
     * @param {KISSY.Uri|String} relativeUri
     *
     * for example:
     *      @example
     *      this: 'http://y/yy/z.com?t=1#v=2'
     *      'https:/y/' => 'https:/y/'
     *      '//foo' => 'http://foo'
     *      'foo' => 'http://y/yy/foo'
     *      '/foo' => 'http://y/foo'
     *      '?foo' => 'http://y/yy/z.com?foo'
     *      '#foo' => http://y/yy/z.com?t=1#foo'
     *
     * @return {KISSY.Uri}
     */
    resolve: function resolve(relativeUri) {
      if (typeof relativeUri === 'string') {
        relativeUri = new URI(relativeUri);
      }

      var self = this,
          override = 0,
          lastSlashIndex,
          order = ['scheme', 'userInfo', 'hostname', 'port', 'path', 'search', 'fragment'],
          target = new URI(self.toString());
      $.each(order, function (i, o) {
        if (o === 'path') {
          // relativeUri does not set for scheme/userInfo/hostname/port
          if (override) {
            target[o] = relativeUri[o];
          } else {
            var path = relativeUri.path;

            if (path) {
              // force to override target 's query with relative
              override = 1;

              if (!path.startsWith('/')) {
                if (target.hostname && !target.path) {
                  // RFC 3986, section 5.2.3, case 1
                  path = '/' + path;
                } else if (target.path) {
                  // RFC 3986, section 5.2.3, case 2
                  lastSlashIndex = target.path.lastIndexOf('/');

                  if (lastSlashIndex !== -1) {
                    path = target.path.slice(0, lastSlashIndex + 1) + path;
                  }
                }
              } // remove .. / .  as part of the resolution process


              target.path = normalize(path);
            }
          }
        } else if (o === 'search') {
          if (override || relativeUri.search) {
            target._params = relativeUri._params;
            target._search = relativeUri._search;
            target.search = relativeUri.search;
            override = 1;
          }
        } else if (override || relativeUri[o]) {
          target[o] = relativeUri[o];
          override = 1;
        }
      });
      return target;
    }
  });
  /**
   * Serialize to string.
   * See rfc 5.3 Component Recomposition.
   * @return {String}
   * ps:单独赋值是因为ie8下若与系统内置函数重名则不会被for in遍历出
   */

  URI.prototype.toString = function () {
    var out = [],
        self = this;

    if (self.scheme) {
      out.push(self.scheme + ':');
    }

    if (self.hostname) {
      out.push('//');

      if (self.userInfo) {
        out.push(self.userInfo + '@');
      }

      out.push(self.hostname);

      if (self.port) {
        out.push(':' + self.port);
      }
    }

    if (self.path) {
      out.push(self.path);
    }

    if (self.search) {
      out.push('?' + self.search);
    }

    if (self.fragment) {
      out.push('#' + self.fragment);
    }

    var ret = out.join('');
    return out.join('');
  };

  var locationUrl = new URI(location.href);
  $.uri = URI;
  return URI;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
    wind.utils
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./seed */ "./src/seed.js"), __webpack_require__(/*! ./lang */ "./src/lang.js"), __webpack_require__(/*! ./ua */ "./src/ua.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
  //   //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外 
  //   //使用方法：$(window).keydown(banBackSpace);
  //   function banBackSpace(e) {
  //       var ev = e || window.event; //获取event对象    
  //       var obj = ev.target || ev.srcElement; //获取事件源    
  //       var t = obj.type || obj.getAttribute('type'); //获取事件源类型  
  //       //获取作为判断条件的事件类型    
  //       var vReadOnly = obj.readOnly;
  //       var vDisabled = obj.disabled;
  //       //处理undefined值情况    
  //       vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
  //       vDisabled = (vDisabled == undefined) ? true : vDisabled;
  //       //当敲Backspace键时，事件源类型为密码或单行、多行文本的，     
  //       //并且readOnly属性为true或disabled属性为true的，则退格键失效   
  //       var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
  //       //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
  //       var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";     //判断
  //       if (flag2 || flag1)
  //           e.preventDefault();
  //   }
  //   //create style element
  //   function CreateStyle(str) {
  //       var poorIE = ($.browser.msie && parseInt($.browser.version) < 10);
  //       var head = document.getElementsByTagName("head")[0];
  //       var el = document.getElementById("gridHeadColor");
  //       if (el) {
  //           head.removeChild(el);
  //       }
  //       el = document.createElement("style");
  //       el.id = "gridHeadColor";
  //       if (poorIE) {
  //           if (el.styleSheet) {
  //               el.styleSheet.cssText = str;
  //           }
  //       } else {
  //           el.appendChild(document.createTextNode(str));
  //       }
  //       head.appendChild(el);
  //   }
  //   /*
  //* 设置输入域(input/textarea)光标的位置
  //* @param {HTMLInputElement/HTMLTextAreaElement} elem
  //* @param {Number} index
  //*/
  //   function setCursorPosition(elem, index) {
  //       var val = elem.value;
  //       var len = val.length;
  //       // 超过文本长度直接返回
  //       if (len < index) {
  //           return;
  //       }
  //       setTimeout(function () {
  //           elem.focus();
  //           if (elem.setSelectionRange) { // 标准浏览器
  //               elem.setSelectionRange(index, index);
  //           } else { // IE9-
  //               var range = elem.createTextRange();
  //               range.moveStart("character", -len);
  //               range.moveEnd("character", -len);
  //               range.moveStart("character", index);
  //               range.moveEnd("character", 0);
  //               range.select();
  //           }
  //       }, 10);
  //   }
  //   //判断两个js object是否相等
  //   function IsObjEqual(obj1, obj2) {
  //       if (obj1 && obj2 && typeof (obj1) == 'object' && typeof (obj2) == 'object') {
  //           var result = true;
  //           $.each(obj1, function (index, item) {
  //               if (!IsObjEqual(obj1[index], obj2[index])) {
  //                   result = false;
  //                   return false;
  //               }
  //           });
  //           if (result) {
  //               $.each(obj2, function (index, item) {
  //                   if (!obj1.hasOwnProperty(index)) {
  //                       result = false;
  //                       return false;
  //                   }
  //               });
  //           }
  //           return result;
  //       } else {
  //           return obj1 == obj2;
  //       }
  //   }
  //   //判断一个数字是整数还是浮点数
  //   function isFloat(num) {
  //       var num1 = parseInt(num);
  //       return num > num1;
  //   }
  //   function moveEnd(obj) {
  //       obj.focus();
  //       var len = obj.value.length;
  //       if (document.selection) {
  //           var sel = obj.createTextRange();
  //           sel.moveStart('character', len);
  //           sel.collapse();
  //           sel.select();
  //       } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
  //           obj.selectionStart = obj.selectionEnd = len;
  //       }
  //   }
  var targets = [];
  var mod = {
    /*
        1.下载文件需保证url返回的文件content-type(mime-type)显式指定为application/octet-stream，否则浏览器可能会尝试将其打开而不是下载
        2.内部文件应遵守标准，外部文件无法控制的根据实际情况处理）
        3.后期考虑增加客户端下载方式
          @param  {function} onError ,仅iframe方式支持
    */
    downloadFile: function downloadFile(url, type, onError) {
      if (!url) {
        return;
      }

      switch (type) {
        case 'self':
          //本页面打开方式，缺点为一旦失败，本地页面会跳转至错误页面
          window.location.href = url;
          break;

        case 'blank':
          //新页面打开，缺点为会新开一个空白的tab页
          window.open(url);
          break;
        //case 'iframe':

        default:
          /*
          默认为iframe方式，无以上两个缺点，兼容性也比较好，目前发现问题：
              1.若页面为https模式，则附件也必须是https，否则会被阻止。
              2.弹出附件下单对话框，若选择“取消”，会关闭父页面
          */
          var id = '_wind_ifrDownloadFile';
          var ifr = document.getElementById(id);
          var onerror = null; //考虑用户多次调用的问题，这里似乎最好用一个object保存所有情况url的情况

          if (ifr == null) {
            ifr = document.createElement('iframe');
            ifr.id = id;
            ifr.style.display = 'none';

            ifr.onload = function () {
              if (typeof onerror === 'function' && this.url === onerror.url) {
                if ($.ua.ie) {
                  try {
                    //ie下判断出异域下载失败和同域下载失败且无返回错误页面的情况
                    if (window.frames["_wind_ifrDownloadFile"].document == null) {
                      onerror(onerror.url);
                    }
                  } catch (e) {
                    onerror(onerror.url);
                  }
                } else {
                  onerror(onerror.url);
                }
              }
            };

            document.body.appendChild(ifr); //if(ifram)
            //$('<iframe id="_wind_ifrDownloadFile" style="display:none"></iframe>').appendTo('body');
          } //经过测试，只在ie8这些较老的浏览器上能够通过onreadystatechange监测iframe状态
          //chrome下只能触发onload，且只能对非下载的页面，对于正常下载的内容是无法触发的，基于这一特性，研报平台采用的方式是：给下载iframe添加onload事件，当正常下载时不触发，当异常时触发，此时进行判断，若下载已开始，且iframe.document为空，则表示下载失败(后进过进一步验证，发现至少在chrome中，iframe.document一直是undefined，应该用iframe.contentDocument，但这个doc在下载失败时可能不为null，可能为错误页面，也可能因为跨域导致访问失败，因此无法通过此值识别。)因此最终反而是通过onload触发而判断出下载失败的...
          //综上，若触发onload，此说明下载失败（测试发现ie11下对于exe文件依然会触发onload，同时依然可下载，而pdf则并不会这样...）


          if (ifr) {
            //这里有一个onload事件清理的问题，若未触发，需要清理，但清理的时机很难定，因为下载成功是不会触发的，此方法可能并不适合支持。
            if (typeof onError === 'function') {
              onError.url = url;
            }

            onerror = onError;
            ifr.url = url; //作为校验使用

            ifr.src = url;
          }

          break;
      }
    },
    //新开窗口(ie内核依然为tab,能否通过终端命令打开？)，option目前仅支持width、height、left、top,其中left/top不传时为居中显示,width默认为屏幕宽度的80%，height默认为屏幕高度的75%
    //screen.width/height在ie下多屏幕时无法正确获取当前屏幕尺寸,webkit无此问题
    openWindow: function openWindow(url, name, options) {
      options = options || {};
      var width = parseInt(options.width) || parseInt(screen.width * 0.8),
          height = parseInt(options.height) || parseInt(screen.height * 0.75),
          left = parseInt(options.left) >= 0 ? parseInt(options.left) : -1,
          top = parseInt(options.top) >= 0 ? parseInt(options.top) : -1;

      if (left < 0) {
        left = parseInt((screen.width - width) / 2);
      }

      if (top < 0) {
        top = parseInt((screen.height - height) / 2);
      } //alert('width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);


      return window.open(url, name, 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
    },
    //在终端内以新tab方式打开页面(是否要支持)
    openTab: function openTab(url, name) {
      return window.open(url, name);
    },

    /*
        1.同域才可获取，公司项目因采用统一负载均衡ip，因此不用应用在同一域内
        2.注意https内使用http也会因权限问题而无法访问
        3.跨域情况下需使用postMessage等方式交互或采用别的方案避开此问题，这里不详述。
    */
    getIframeWindow: function getIframeWindow(node) {
      try {
        return node.contentWindow;
      } catch (e) {}

      return null;
    },
    getIframDocument: function getIframDocument(node) {
      try {
        return node.contentDocument || node.contentWindow.document;
      } catch (e) {}

      return null;
    },
    isInIframe: function isInIframe() {
      return window != window.top;
    },
    versionCompare: function versionCompare(ver1, ver2) {
      if (ver1 == null) {
        return -1;
      }

      if (ver2 == null) {
        return 1;
      }

      ver1 = ver1 + '';
      ver2 = ver2 + '';

      if (ver1 === ver2) {
        return 0;
      }

      var ver1s = ver1.split('.'),
          ver2s = ver2.split('.');

      for (var i = 0, len1 = ver1s.length, len2 = ver2s.length; i < len1 && i < len2; i++) {
        if (parseInt(ver1s[i]) > parseInt(ver2s[i])) {
          return 1;
        } else if (parseInt(ver1s[i]) < parseInt(ver2s[i])) {
          return -1;
        }
      }

      if (len1 > len2) {
        return 1;
      } else if (len1 < len2) {
        return -1;
      }

      return 0;
    }
  };
  $.utils = mod;
  return mod;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ })

/******/ });
});
//# sourceMappingURL=wind-1.3.1.js.map