// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/flags.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var VNodeFlags = {
  // html标签
  ELEMENT_HTML: 1,
  // 0000000000000001
  // SVG标签
  ELEMENT_SVG: 1 << 1,
  // 0000000000000010
  // 普通有状态组件
  COMPONENT_STATEFUL_NORAMAL: 1 << 2,
  // 0000000000000100
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 0000000000001000
  // 已经被keepAlive的组件
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  // 0000000000010000
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,
  // 0000000000100000
  // 纯文本
  TEXT: 1 << 6,
  // 0000000001000000
  // Fragment
  FRAGMENT: 1 << 7,
  // 0000000010000000
  // Portal
  PORTAL: 1 << 8 // 0000000100000000

}; // html和svg都是标签元素，可以用ELEMENT表示

VNodeFlags.ELEMENT = // 00000011
VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG; // 00000001 // 00000010
// 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlive的有状态组件，都是有状态组件，统一用COMPONENT_STATEFUL表示

VNodeFlags.COMPONENT_STATEFUL = // 00011100
VNodeFlags.COMPONENT_STATEFUL_NORAMAL | // 00000100
VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE | // 00001000
VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE; // 00010000
// 有状态组件 和 函数式组件都是"组件, 用COMPONENT表示

VNodeFlags.COMPONENT = // 00111100
VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL; // 00011100 // 00100000
// VNodeFlags.ELEMENT_HTML &             // 00000001
// VNodeFlags.ELEMENT_SVG &          // 00000010
//VNodeFlags.ELEMENT                // 00000011
//  => true
// children 和 ChildrenFlags
// 子节点
// 总的来说有一下几种
// 1、没有子节点
// 2、只有一个子节点
// 3、多个子节点
//   ·有key
//   ·无key
// 4、不知道子节点情况

var ChildrenFlags = {
  // 未知的children类型
  UNKNOWN_CHILDREN: 0,
  // 00000000
  // 没有children
  NO_CHILDREN: 1,
  // 00000001
  // children是单个VNode
  SINGLE_VNODE: 1 << 1,
  // 00000010
  // children 是多个拥有key的VNode
  KEYED_VNODES: 1 << 2,
  // 00000100
  // children 是多个没有key的VNode
  NONE_KEYED_VNODES: 1 << 3 // 00001000

}; // 由于	ChildrenFlags.KEYED_VNODES 和 ChildrenFalgs.NONE_KEYED_VNODES 都属于多个VNode，所以我们可以派生出一个 “多节点” 标识

ChildrenFlags.MULTIPLE_VNODES = // 00001100
ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES; // 00000100 // 00001000
// 这样判断一个VNode的子节点是否是多个子节点就变得容易多了：
// someVNode.childFlags & ChildrenFlags.MULTIPLE_VNODES

var _default = {
  VNodeFlags: VNodeFlags,
  ChildrenFlags: ChildrenFlags
};
exports.default = _default;
},{}],"src/Portal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Portal = void 0;
var Portal = Symbol();
exports.Portal = Portal;
},{}],"src/Fragment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fragment = void 0;
var Fragment = Symbol();
exports.Fragment = Fragment;
},{}],"src/h.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.createTextVNode = createTextVNode;

var _flags = _interopRequireDefault(require("./flags"));

var _Portal = require("./Portal");

var _Fragment = require("./Fragment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var VNodeFlags = _flags.default.VNodeFlags,
    ChildrenFlags = _flags.default.ChildrenFlags;

function h(tag) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var flags = null;

  if (typeof tag === "string") {
    flags = tag === "svg" ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
  } else if (tag === _Fragment.Fragment) {
    flags = VNodeFlags.FRAGMENT;
  } else if (tag === _Portal.Portal) {
    flags = VNodeFlags.PORTAL;
    tag = data && data.target;
  } else {
    // 兼容vue2的对象式组件
    if (tag !== null && _typeof(tag) === "object") {
      flags = tag.functional ? VNodeFlags.COMPONENT_FUNCTIONAL : VNodeFlags.COMPONENT_STATEFUL_NORAMAL;
    } else if (typeof tag === "function") {
      // vue3 的类组件
      flags = tag.prototype && tag.prototype.render ? VNodeFlags.COMPONENT_STATEFUL_NORAMAL : VNodeFlags.COMPONENT_FUNCTIONAL;
    }
  } // 确定childFlags


  var childFlags = null;

  if (Array.isArray(children)) {
    var _children = children,
        length = _children.length;

    if (!length) {
      childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (length === 1) {
      childFlags = ChildrenFlags.SINGLE_VNODE;
    } else {
      // 多个子节点，且子节点使用key
      // ? 此处多个子节点直接被当做使用了key的子节点，是因为在下面 normalizeVNodes函数里面直接人为添加了key ?
      childFlags = ChildrenFlags.KEYED_VNODES;
      children = normalizeVNodes(children);
    }
  } else if (children == null) {
    childFlags = ChildrenFlags.NO_CHILDREN;
  } else if (children._isVNode) {
    // 单个子节点
    childFlags = ChildrenFlags.SINGLE_VNODE;
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用createTextVNode创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE;
    children = createTextVNode(children + "");
  }

  return {
    _isVNode: true,
    // 始终为true
    flags: flags,
    tag: tag,
    data: data,
    children: children,
    childFlags: childFlags,
    el: null
  };
}

function normalizeVNodes(children) {
  var newChild = [];

  for (var i = 0; i < children.length; i++) {
    var child = children[i];

    if (child.key == null) {
      child.key = "|" + i;
    }

    newChild.push(child);
  } // 返回新的children，此时children的类型就是 ChildrenFlags.KEYED_VNODES


  return newChild;
}

function createTextVNode(text) {
  return {
    _isVNode: true,
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    // 纯文本类型的 VNode，其children属性存储的是与之相符的文本内容
    children: text,
    // 文本节点没有子节点
    childFlags: VNodeFlags.NO_CHILDREN,
    el: null
  };
}
},{"./flags":"src/flags.js","./Portal":"src/Portal.js","./Fragment":"src/Fragment.js"}],"src/patchData.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchData;
var domPropsRE = /\[A-Z]|^(?:value|checked|slected|muted)$/;

function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case 'style':
      // 如果 key 的值是 style，说明是内联样式，逐个将样式规则应用到 el
      for (var k in nextValue) {
        el.style[k] = nextValue[k];
      } // 遍历旧的 VNodeData ，将不存在于新的 VNodeData 中的样式清除


      for (var _k in prevValue) {
        if (!nextValue || !nextValue.hasOwnProperty(_k)) {
          el.style[_k] = '';
        }
      }

      break;

    case 'class':
      el.className = dynamicClass(nextValue[key]);
      break;

    default:
      // 事件处理
      if (key[0] === 'o' && key[1] === 'n') {
        // 移除旧事件
        if (prevValue) {
          el.addEventListener(key.slice(2), prevValue);
        } // 添加新事件


        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue);
        } // 注：如此一来，所有以 'on' 开头的属性都被判定为事件

      } else if (domPropsRE.test(key)) {
        // 当做 DOM Prop处理
        el[key] = nextValue;
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue);
      }

      break;
  }
}
},{}],"src/patchChildren.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchChildren;

var _patch = require("./patch");

var _flags = _interopRequireDefault(require("./flags"));

var _render = require("./render");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChildrenFlags = _flags.default.ChildrenFlags;

function patchChildren(prevChildFlags, nextChildFlags, prevChildren, nextChildren, container) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点
          // 此时，prevChidren 和 nextChildren 都是 VNode 对象
          (0, _patch.patch)(prevChildren, nextChildren, container);
          break;

        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 没有子节点
          container.removeChild(prevChildren.el);
          break;

        default:
          // 新的 children 有多个子节点
          container.removeChild(prevChildren.el);

          for (var i = 0; i < nextChildren.length; i++) {
            (0, _render.mount)(nextChildren[i], container);
          }

          break;
      }

      break;
    // 旧的 children 没有子节点

    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点
          (0, _render.mount)(nextChildren, container);
          break;

        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 没有子节点
          break;

        default:
          // 新的 children 有多个子节点
          for (var _i = 0; _i < nextChildren.length; _i++) {
            (0, _render.mount)(nextChildren[_i], container);
          }

          break;
      }

      break;
    // 旧的 children 有多个子节点

    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点
          for (var _i2 = 0; _i2 < prevChildren.length; _i2++) {
            container.removeChild(prevChildren[_i2].el);
          }

          (0, _render.mount)(nextChildren, container);
          break;

        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 没有子节点
          for (var _i3 = 0; _i3 < prevChildren.length; _i3++) {
            container.removeChild(prevChildren[_i3].el);
          }

          break;

        default:
          // 新的 children 有多个子节点
          for (var _i4 = 0; _i4 < prevChildren.length; _i4++) {
            container.removeChild(prevChildren[_i4].el);
          }

          for (var k = 0; k < nextChildren.length; k++) {
            (0, _render.mount)(nextChildren[k], container);
          }

          break;
      }

      break;
  }
}
},{"./patch":"src/patch.js","./flags":"src/flags.js","./render":"src/render.js"}],"src/patch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = patch;

var _flags = _interopRequireDefault(require("./flags"));

var _render = require("./render");

var _patchData = _interopRequireDefault(require("./patchData"));

var _patchChildren = _interopRequireDefault(require("./patchChildren"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VNodeFlags = _flags.default.VNodeFlags,
    ChildrenFlags = _flags.default.ChildrenFlags;

function patch(prevVNode, nextVNode, container) {
  // 分别拿到新旧 VNode 的类型，即 flags
  var nextFlags = nextVNode.flags;
  var prevFlags = prevVNode.flags; // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
  // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数

  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode);
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode);
  }
} // 替换 VNode


function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el); // 再把新的 VNode 挂载到容器上

  (0, _render.mount)(nextVNode, container);
}

function patchElement(prevVNode, nextVNode, container) {
  // 如果新的 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container);
    return;
  } // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素 


  var el = nextVNode.el = prevVNode.el; // 拿到新旧 VNodeData

  var prevData = prevVNode.data;
  var nextData = nextVNode.data;

  if (nextData) {
    // 遍历新的 VNodeData ，将旧值和新值传递给 patchData函数
    for (var key in nextData) {
      var prevValue = prevData[key];
      var nextValue = nextData[key];
      (0, _patchData.default)(el, key, prevValue, nextValue);
    }
  }

  if (prevData) {
    // 遍历旧的 VNodeData，将不存在与新的 VNodeData 中的数据移除
    for (var _key in prevData) {
      var _prevValue = prevData[_key];

      if (_prevValue && !nextData.hasOwnProperty(_key)) {
        // 第四个参数为null代表移除数据
        (0, _patchData.default)(el, _key, _prevValue, null);
      }
    }
  } // 调用 patchChildren 函数递归更新子节点


  (0, _patchChildren.default)(prevVNode.childFlags, // 旧的 VNode 子节点类型
  nextVNode.childFlags, // 新的 VNode 子节点类型
  prevVNode.children, // 旧的 VNode 子节点
  nextVNode.children, // 新的 VNode 子节点
  el // 当前标签元素，即这些子节点的父节点
  );
} // patchText


function patchText(prevVNode, nextVNode) {
  // 拿到文本元素el, 同时让 nextVNode.el 指向该文本元素
  var el = nextVNode.el = prevVNode.el; // 只有当新旧文本内容不一致时才有必要更新

  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children;
  }
}

function patchFragment(prevVNode, nextVNode, container) {
  // 直接调用 patchChildren 函数更新 新旧节点的子节点即可
  (0, _patchChildren.default)(prevVNode.childFlags, nextVNode.childFlags, prevVNode.children, nextVNode.children, container); // 如上高亮代码所示，我们通过检查新的片段的 children 类型，如果新的片段的 children 类型是单个子节点，则意味着其 vnode.children 属性的值就是 VNode 对象，
  // 所以直接将 nextVNode.children.el 赋值给 nextVNode.el 即可。如果新的片段没有子节点，我们知道对于没有子节点的片段我们会使用一个空的文本节点占位，
  // 而 prevVNode.el 属性引用的就是该空文本节点，所以我们直接通过旧片段的 prevVNode.el 拿到该空文本元素并赋值给新片段的 nextVNode.el 即可。
  // 如果新的片段的类型是多个子节点，则 nextVNode.children 是一个 VNode 数组，我们会让新片段的 nextVNode.el 属性引用数组中的第一个元素。
  // 实际上这段逻辑与我们在 mountFragment 函数中所实现的逻辑是一致的。

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el;
      break;

    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el;
      break;

    default:
      nextVNode.el = nextVNode.children[0].el;
  }
} // 更新Protal


function patchPortal(prevVNode, nextVNode) {
  (0, _patchChildren.default)(prevVNode.childFlags, nextVNode.childFlags, prevVNode.children, nextVNode.children, prevVNode.tag // 注意容器元素是旧的container
  ); // 让 nextVNode.el 指向 prevVNode.el

  nextVNode.el = prevVNode.el;

  if (nextVNode.tag !== prevVNode.tag) {
    var container = typeof nextVNode.el === 'string' ? document.querySelector(nextVNode.tag) : nextVNode.tag;

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        container.appendChild(nextVNode.children.el);
        break;

      case ChildrenFlags.NO_CHILDREN:
        break;

      default:
        for (var i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el);
        }

    }
  }
}
},{"./flags":"src/flags.js","./render":"src/render.js","./patchData":"src/patchData.js","./patchChildren":"src/patchChildren.js"}],"src/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.mount = mount;
exports.default = void 0;

var _flags = _interopRequireDefault(require("./flags"));

var _patch = require("./patch");

var _h = require("./h");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var VNodeFlags = _flags.default.VNodeFlags,
    ChildrenFlags = _flags.default.ChildrenFlags;

function render(vnode, container) {
  var prevVNode = container.vnode;

  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container); // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode就存在了

      container.vnode = vnode;
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
      (0, _patch.patch)(prevVNode, vnode, container); // 更新 container.vnode

      container.vnode = vnode;
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM,在浏览器中可以使用 removeChild函数。
      container.removeChild(prevVNode.el);
      container.vnode = null;
    }
  }
}

function mount(vnode, container, isSVG) {
  var flags = vnode.flags;

  if (flags & VNodeFlags.ELEMENT_HTML) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG);
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG);
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载存文本
    mountText(vnode, container);
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载Fragment
    mountFragment(vnode, container, isSVG);
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG);
  }
} // 处理VNodeData中除 class 和 style 之外的全部数据，当然也要排除 VNodeData中的target属性，因为它只适用于 Portal


var domPropsRE = /\[A-Z]|^(?:value|checked|slected|muted)$/;

function mountElement(vnode, container, isSVG) {
  // 注：运算符优先级  逻辑或 5 (||)从左到右  按位与 9(&) 从左到右
  // 4、处理SVG标签
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG;
  var el = isSVG ? document.createElementNS("http://www.w3.org/2000/svg", vnode.tag) : document.createElement(vnode.tag);
  vnode.el = el; // 1、VNode渲染成真实DOM之后，引用真实DOM
  // 拿到 VNodeData

  var data = vnode.data;

  if (data) {
    // 如果data存在，则遍历   2、将VNodeData应用到真实DOM元素上
    for (var key in data) {
      // key可能是class、style、on等等
      switch (key) {
        case "style":
          // 如果 key 的值是 style，说明是内联样式，逐个将样式规则应用到 el
          for (var k in data.style) {
            el.style[k] = data.style[k];
          }

          break;

        case "class":
          el.className = dynamicClass(data[key]);
          break;

        default:
          // 事件处理
          if (key[0] === "o" && key[1] === "n") {
            el.addEventListener(key.slice(2), data[key]); // 注：如此一来，所有以 'on' 开头的属性都被判定为事件
          } else if (domPropsRE.test(key)) {
            // 当做 DOM Prop处理
            el[key] = data[key];
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key]);
          }

          break;
      }
    }
  } // 3、继续挂载子节点
  // 拿到children 和 childFlags


  var childFlags = vnode.childFlags;
  var children = vnode.children; // 检测如果没有子节点则无需递归挂载

  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 单个子节点则调用mount挂载
      mount(children, el, isSVG); // 把isSvg传递下去，方便后续判断渲染svg里面circle等元素tag不等于svg时渲染svg标签
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是多个子节点，则遍历并调用 mount 函数挂载
      for (var i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG);
      }
    }
  } // 处理svg标签


  container.appendChild(el); //
} // 挂载组件


function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG);
  } else {
    mountFunctionalComponent(vnode, container, isSVG);
  }
} // 挂载有状态组件


function mountStatefulComponent(vnode, container, isSVG) {
  // 1、创建组件实例
  var instance = new vnode.tag(); // 2、获取组件产出的 Vnode

  instance.$vnode = instance.render(); // 3、mount挂载

  mount(instance.$vnode, container, isSVG); // 4、让组件实例的 $el 属性和 vnode.el 属性的值引用组件的根DOM元素

  instance.$el = vnode.el = instance.$vnode.el;
} // 挂载函数式组件


function mountFunctionalComponent(vnode, container, isSVG) {
  // 获取vnode
  var $vnode = vnode.tag(); // 挂载

  mount($vnode, container, isSVG); // el元素引用该组件的根元素

  vnode.el = $vnode.el;
} // 挂载纯文本


function mountText(vnode, container) {
  var el = document.createTextNode(vnode.children);
  vnode.el = el;
  container.appendChild(el);
} // 挂载Fragment


function mountFragment(vnode, container, isSVG) {
  // 拿到children 和 childFlags
  var children = vnode.children,
      childFlags = vnode.childFlags;

  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      mount(children, container, isSVG);
      vnode.el = children.el;
      break;

    case ChildrenFlags.NO_CHILDREN:
      // 没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
      var placeholder = (0, _h.createTextVNode)('');
      mountText(placeholder, container);
      vnode.el = placeholder.el;
      break;

    default:
      // 多个子节点，遍历挂载
      for (var i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG);
      }

      vnode.el = children[0].el;
      break;
  }
} // 挂载 Portal


function mountPortal(vnode, container, isSVG) {
  var tag = vnode.tag,
      children = vnode.children,
      childFlags = vnode.childFlags; // 获取挂载点

  var target = typeof tag === 'string' ? document.querySelector(tag) : tag;

  if (childFlags & childFlags.SINGLE_VNODE) {
    // 将children挂载到target上，而非container
    mount(children, target);
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (var i = 0; i < children.length; i++) {
      mount(children[i], target);
    }
  } // 占位的空文本节点


  var placeholder = (0, _h.createTextVNode)(''); // 将该节点挂载到 container 中

  mountText(placeholder, container, null); // el属性引用该节点

  vnode.el = placeholder.el;
}

function dynamicClass(className) {
  if (typeof className === "string") {
    return className;
  }

  if (_typeof(className) === "object") {
    if (Array.isArray(className)) {
      var str = "";

      for (var i = 0; i < className.length; i++) {
        if (typeof className[i] === "string") {
          str += className[i] + " ";
        } else if (_typeof(className[i]) === "object") {
          str += dynamicClass(className[i]);
        }
      }

      return str || "";
    } else {
      var _str = "";

      for (var key in className) {
        if (typeof className[key] === "boolean" && className[key]) {
          _str += key + " ";
        } else if (_typeof(className[key]) === "object") {
          _str += dynamicClass(className[key]);
        }
      }

      return _str || "";
    }
  }

  return "";
}

var _default = {
  render: render
};
exports.default = _default;
},{"./flags":"src/flags.js","./patch":"src/patch.js","./h":"src/h.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _h = require("./h");

var _render = require("./render");

var _Fragment = require("./Fragment");

var _Portal = require("./Portal");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function handler() {
  alert("click");
} // const elementVnode = h(
// 	"div", 
// 	{
//   		style: {
//     		width: "100px",
//     		height: "100px",
//     		backgroundColor: "red"
//   		},
//   		// 点击事件
//   		onclick: handler,
// 	},
// h(
// 	Fragment, null, 
// 	[
// 		h('h1', {
// 			style: {
// 				fontSize: '12px',
// 				color: 'aqua'
// 			}
// 		}, '我是标题1......'),
// 		h('h2', {
// 			style: {
// 				fontSize: '20px',
// 				color: '#6cf',
// 				fontStyle: 'itatic'
// 			}
// 		}, '我是标题2......')
// 	]
// )
// );
// Portal
// const elementVnode = h(
// 	'div',
// 	{
// 		style: {
// 			width: '100px',
// 			height: '100px',
// 			backgroundColor: 'aqua'
// 		},
// 		onclick: handler
// 	},
// 	h(
// 	Portal, { target: '#portal-box' }, 
// 	[
// 		h('span', null, '我是标题1......'),
// 		h('span', null, '我是标题2......')
// 	])
// )
// 有状态组件


var MyComponent =
/*#__PURE__*/
function () {
  function MyComponent() {
    _classCallCheck(this, MyComponent);
  }

  _createClass(MyComponent, [{
    key: "render",
    value: function render() {
      return (0, _h.h)('div', {
        style: {
          background: 'green'
        }
      }, [(0, _h.h)('span', null, '我是组件标题1·······'), (0, _h.h)('span', null, '我是组件标题2······')]);
    }
  }]);

  return MyComponent;
}(); // 函数式组件


function MyFunctionalComponent() {
  return (0, _h.h)('div', {
    style: {
      background: 'aqua',
      height: '100px',
      width: '100px',
      borderRadius: '50px',
      textAlign: 'center'
    }
  }, [(0, _h.h)('span', null, '我是组件标题1······'), (0, _h.h)('span', null, '我是组件标题2······')]);
}

var compVnode = (0, _h.h)(MyComponent);
var funcVnode = (0, _h.h)(MyFunctionalComponent); // render(funcVnode, document.getElementById("app") || document.body)
// 旧的 VNode
// const prevVNode = h('div', {
//   style: {
//     width: '100px',
//     height: '100px',
//     backgroundColor: 'red'
//   },
//   onclick: handler,
//   data: '1234'
// },
// h('p', {
// 	style: {
// 	  height: '50px',
// 	  width: '50px'
// 	}
// })
// )
// 新的 VNode
// const nextVNode = h('div', {
//   style: {
//     width: '100px',
//     height: '100px',
//     border: '1px solid green'
//   },
//   data: '456'
// },
// h('p', {
// 	style: {
// 	  height: '50px',
// 	  width: '50px',
// 	  background: 'aqua'
// 	}
//   })
// )
// 旧的 VNode 一个子节点
// const prevVNode = h('div', null, h('p', null, '只有一个子节点'))
// 新的 VNode 多个子节点
// const nextVNode = h('div', null, [
//   h('p', null, '子节点 1'),
//   h('p', null, '子节点 2')
// ])
// patchText
// const prevVNode = h('p', null, '旧文本')
// 新的 VNode
// const nextVNode = h('p', null, '新文本')

/**** patch fragment ****/
// 旧的 VNode
// const prevVNode = h(Fragment, null, [
// 	h('p', null, '旧片段子节点 1'),
// 	h('p', null, '旧片段子节点 2')
// ])
// 新的 VNode
// const nextVNode = h(Fragment, null, [
// 	h('p', null, '新片段子节点 1'),
// 	h('p', null, '新片段子节点 2')
// ])

/**** patch Portal ****/

var prevVNode = (0, _h.h)(_Portal.Portal, {
  target: '#old-container'
}, (0, _h.h)('p', null, '旧的Portal'));
var nextVNode = (0, _h.h)(_Portal.Portal, {
  target: '#new-container'
}, (0, _h.h)('p', null, '新的Portal'));
(0, _render.render)(prevVNode, document.getElementById('app')); // 2秒后更新

setTimeout(function () {
  (0, _render.render)(nextVNode, document.getElementById('app'));
}, 2000);
},{"./styles.css":"src/styles.css","./h":"src/h.js","./render":"src/render.js","./Fragment":"src/Fragment.js","./Portal":"src/Portal.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62203" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map