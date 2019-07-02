'use strict';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'NoticeBar',
  props: {
    text: {
      default: '',
      type: [String, Array]
    },
    delay: {
      default: 2,
      type: Number
    },
    speed: {
      default: 1,
      type: Number
    },
    rollSpeed: {
      default: 1,
      type: Number
    },
    effect: {
      default: 'ease-in-out',
      type: String
    },
    isRoll: {
      default: false,
      type: Boolean
    },
    isRollComplete: {
      default: true,
      type: Boolean
    },
    isHtml: {
      default: false,
      type: Boolean
    }
  },
  data: function data() {
    return {
      noticeBar: null,
      // 当前容器
      curEl: null,
      // 当前 滚动的条目
      elHeight: 0,
      // 容器高度
      elWidth: 0,
      // 容器宽度
      diff: 0,
      // 偏移量
      curIndex: 0,
      // 当前滚动条目索引
      duration: 0.5,
      // 容器动画默认运动时间
      itemDuration: 3,
      // 容器条目动画默认运动时间
      timer: null,
      // 定时器标识
      noticeList: [],
      // 广播信息列表
      isItemMoveComplete: false // item 是否滚动完毕

    };
  },
  computed: {
    isRollItem: function isRollItem() {
      return this.isItemMove() && !this.isItemMoveComplete && this.isRoll;
    }
  },
  mounted: function mounted() {
    this.init();
  },
  watch: {
    text: {
      handler: function handler(val) {
        var list = typeof val === 'string' ? [val] : val;
        this.noticeList = list.map(function (item) {
          return {
            diff: 0,
            text: item
          };
        });
      },
      immediate: true
    }
  },
  methods: {
    init: function init() {
      this.noticeBar = this.$refs['noticeBarContainer'];
      this.elHeight = this.noticeBar.offsetHeight;
      this.elWidth = this.noticeBar.offsetWidth;

      this._bindEvent();

      this.startMoving();
    },
    _bindEvent: function _bindEvent() {
      if (!this.noticeBar) return;
      this.noticeBar.addEventListener('transitionend', this.transitionHandler);
    },
    isItemMove: function isItemMove() {
      if (!this.curEl || !this.noticeBar) return false;
      return this.curEl.children[0].offsetWidth > this.elWidth;
    },
    run: function run() {
      this.curEl = document.querySelector(".notice-bar-item-".concat(this.curIndex));

      if (this.curIndex < this.noticeList.length) {
        this.isRollItem ? this.itemMove() : this.wrapMove();
      } else {
        this.resetWrapMove();
      }
    },
    transitionHandler: function transitionHandler(e) {
      e.stopPropagation();
      this.isItemMoveComplete = false;
      this.run();
    },
    itemTransitionHandler: function itemTransitionHandler(e) {
      e.stopPropagation();
      this.isItemMoveComplete = true;
      this.run();
    },
    wrapMove: function wrapMove() {
      var _this = this;

      this.duration = 0.5;
      this.starTimer(function () {
        _this.curIndex++;
        _this.diff -= _this.elHeight;
      }, this.isItemMoveComplete && this.isRollComplete ? 100 : this.delay * 1000);
    },
    resetWrapMove: function resetWrapMove() {
      this.duration = 0;
      this.curIndex = 0;
      this.diff = 0;
      this.startMoving();
    },
    itemMove: function itemMove() {
      var _this2 = this;

      if (!this.curEl) return;
      this.curEl.removeEventListener('transitionend', this.itemTransitionHandler);
      this.curEl.addEventListener('transitionend', this.itemTransitionHandler);
      this.isItemMoveComplete = false;
      this.itemDuration = 0;
      this.noticeList[this.curIndex].diff = 0;
      this.starTimer(function () {
        _this2.itemDuration = 3;
        var itemDiff = _this2.isRollComplete ? _this2.curEl.children[0].offsetWidth : _this2.curEl.children[0].offsetWidth - _this2.elWidth;
        _this2.noticeList[_this2.curIndex].diff = -itemDiff;
      }, this.delay * 1000);
    },
    startMoving: function startMoving() {
      var _this3 = this;

      this.starTimer(function () {
        return _this3.run();
      }, 100);
    },
    starTimer: function starTimer(func, interval) {
      this.clearTimer();
      this.timer = setTimeout(func, interval);
    },
    clearTimer: function clearTimer() {
      if (this.timer) clearTimeout(this.timer);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c("div", {
    ref: "noticeBarContainer",
    staticClass: "notice-bar"
  }, [_c("div", {
    staticClass: "notice-bar-wrapper",
    style: {
      "transition-property": "transform",
      transform: "translate(0px, " + _vm.diff + "px)",
      "transition-timing-function": "" + _vm.effect,
      "transition-duration": _vm.duration / _vm.speed + "s"
    }
  }, _vm._l(_vm.noticeList, function (item, index) {
    return _c("p", {
      key: "notice-bar-item-" + index,
      staticClass: "notice-bar-item",
      class: ["notice-bar-item-" + index, {
        ellipsis: !_vm.isRoll
      }],
      style: {
        "transition-property": "transform",
        height: _vm.elHeight + "px",
        "line-height": _vm.elHeight + "px",
        transform: "translate(" + item.diff + "px, 0px)",
        "transition-timing-function": "linear",
        "transition-duration": _vm.itemDuration / _vm.rollSpeed + "s"
      }
    }, [_vm.isHtml ? _c("span", {
      domProps: {
        innerHTML: _vm._s(item.text)
      }
    }) : _c("span", [_vm._v(_vm._s(item.text))])]);
  }), 0)]);
};

var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-f2a42a16_0", {
    source: ".notice-bar[data-v-f2a42a16] {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.notice-bar-item[data-v-f2a42a16] {\n  margin: 0;\n  padding: 0;\n  white-space: nowrap;\n}\n.notice-bar-item.ellipsis[data-v-f2a42a16] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/*# sourceMappingURL=NoticeBar.vue.map */",
    map: {
      "version": 3,
      "sources": ["F:\\临时代码垃圾站\\vue-simple-noticebar\\src\\lib\\components\\NoticeBar.vue", "NoticeBar.vue"],
      "names": [],
      "mappings": "AAgLA;EACA,WAAA;EACA,YAAA;EACA,gBAAA;AC/KA;ADiLA;EACA,SAAA;EACA,UAAA;EACA,mBAAA;AC/KA;ADiLA;EACA,gBAAA;EACA,uBAAA;AC/KA;;AAEA,wCAAwC",
      "file": "NoticeBar.vue",
      "sourcesContent": ["<template>\r\n  <div ref=\"noticeBarContainer\" class=\"notice-bar\">\r\n    <div\r\n      class=\"notice-bar-wrapper\"\r\n      :style=\"{\r\n        'transition-property': 'transform',\r\n        'transform': `translate(0px, ${diff}px)`,\r\n        'transition-timing-function': `${effect}`,\r\n        'transition-duration': `${duration / speed}s`}\">\r\n      <p\r\n        v-for=\"(item, index) in noticeList\"\r\n        :key=\"'notice-bar-item-' + index\"\r\n        :style=\"{\r\n          'transition-property': 'transform',\r\n          'height': `${elHeight}px`,\r\n          'line-height': `${elHeight}px`,\r\n          'transform': `translate(${item.diff}px, 0px)`,\r\n          'transition-timing-function': 'linear',\r\n          'transition-duration': `${itemDuration / rollSpeed}s`\r\n        }\"\r\n        class=\"notice-bar-item\"\r\n        :class=\"['notice-bar-item-' + index, { 'ellipsis': !isRoll }]\">\r\n        <span v-if=\"isHtml\" v-html=\"item.text\"></span>\r\n        <span v-else>{{ item.text }}</span>\r\n      </p>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  name: 'NoticeBar',\r\n  props: {\r\n    text: {\r\n      default: '',\r\n      type: [String, Array],\r\n    },\r\n    delay: {\r\n      default: 2,\r\n      type: Number,\r\n    },\r\n    speed: {\r\n      default: 1,\r\n      type: Number,\r\n    },\r\n    rollSpeed: {\r\n      default: 1,\r\n      type: Number,\r\n    },\r\n    effect: {\r\n      default: 'ease-in-out',\r\n      type: String,\r\n    },\r\n    isRoll: {\r\n      default: false,\r\n      type: Boolean,\r\n    },\r\n    isRollComplete: {\r\n      default: true,\r\n      type: Boolean,\r\n    },\r\n    isHtml: {\r\n      default: false,\r\n      type: Boolean,\r\n    },\r\n  },\r\n  data () {\r\n    return {\r\n      noticeBar: null, // 当前容器\r\n      curEl: null, // 当前 滚动的条目\r\n      elHeight: 0, // 容器高度\r\n      elWidth: 0, // 容器宽度\r\n      diff: 0, // 偏移量\r\n      curIndex: 0, // 当前滚动条目索引\r\n      duration: 0.5, // 容器动画默认运动时间\r\n      itemDuration: 3, // 容器条目动画默认运动时间\r\n      timer: null, // 定时器标识\r\n      noticeList: [], // 广播信息列表\r\n      isItemMoveComplete: false, // item 是否滚动完毕\r\n    }\r\n  },\r\n  computed: {\r\n    isRollItem () {\r\n      return this.isItemMove() && !this.isItemMoveComplete && this.isRoll\r\n    },\r\n  },\r\n  mounted () {\r\n    this.init()\r\n  },\r\n  watch: {\r\n    text: {\r\n      handler (val) {\r\n        const list = typeof val === 'string' ? [val] : val\r\n        this.noticeList = list.map(item => ({\r\n          diff: 0,\r\n          text: item,\r\n        }))\r\n      },\r\n      immediate: true,\r\n    },\r\n  },\r\n  methods: {\r\n    init () {\r\n      this.noticeBar = this.$refs['noticeBarContainer']\r\n      this.elHeight = this.noticeBar.offsetHeight\r\n      this.elWidth = this.noticeBar.offsetWidth\r\n      this._bindEvent()\r\n      this.startMoving()\r\n    },\r\n    _bindEvent () {\r\n      if (!this.noticeBar) return\r\n      this.noticeBar.addEventListener('transitionend', this.transitionHandler)\r\n    },\r\n    isItemMove () {\r\n      if (!this.curEl || !this.noticeBar) return false\r\n      return this.curEl.children[0].offsetWidth > this.elWidth\r\n    },\r\n    run () {\r\n      this.curEl = document.querySelector(`.notice-bar-item-${this.curIndex}`)\r\n      if (this.curIndex < this.noticeList.length) {\r\n        this.isRollItem ? this.itemMove() : this.wrapMove()\r\n      } else {\r\n        this.resetWrapMove()\r\n      }\r\n    },\r\n    transitionHandler (e) {\r\n      e.stopPropagation()\r\n      this.isItemMoveComplete = false\r\n      this.run()\r\n    },\r\n    itemTransitionHandler (e) {\r\n      e.stopPropagation()\r\n      this.isItemMoveComplete = true\r\n      this.run()\r\n    },\r\n    wrapMove () {\r\n      this.duration = 0.5\r\n      this.starTimer(() => {\r\n        this.curIndex++\r\n        this.diff -= this.elHeight\r\n      }, this.isItemMoveComplete && this.isRollComplete ? 100 : this.delay * 1000)\r\n    },\r\n    resetWrapMove () {\r\n      this.duration = 0\r\n      this.curIndex = 0\r\n      this.diff = 0\r\n      this.startMoving()\r\n    },\r\n    itemMove () {\r\n      if (!this.curEl) return\r\n      this.curEl.removeEventListener('transitionend', this.itemTransitionHandler)\r\n      this.curEl.addEventListener('transitionend', this.itemTransitionHandler)\r\n      this.isItemMoveComplete = false\r\n      this.itemDuration = 0\r\n      this.noticeList[this.curIndex].diff = 0\r\n      this.starTimer(() => {\r\n        this.itemDuration = 3\r\n        const itemDiff = this.isRollComplete ? this.curEl.children[0].offsetWidth : this.curEl.children[0].offsetWidth - this.elWidth\r\n        this.noticeList[this.curIndex].diff = -itemDiff\r\n      }, this.delay * 1000)\r\n    },\r\n    startMoving () {\r\n      this.starTimer(() => this.run(), 100)\r\n    },\r\n    starTimer (func, interval) {\r\n      this.clearTimer()\r\n      this.timer = setTimeout(func, interval)\r\n    },\r\n    clearTimer () {\r\n      if (this.timer) clearTimeout(this.timer)\r\n    },\r\n  },\r\n}\r\n</script>\r\n\r\n<style lang=\"scss\" scoped>\r\n.notice-bar {\r\n  width: 100%;\r\n  height: 100%;\r\n  overflow: hidden;\r\n\r\n  &-item {\r\n    margin: 0;\r\n    padding: 0;\r\n    white-space: nowrap;\r\n    \r\n    &.ellipsis {\r\n      overflow: hidden;\r\n      text-overflow: ellipsis;\r\n    }\r\n  }\r\n}\r\n</style>\r\n\r\n\r\n", ".notice-bar {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.notice-bar-item {\n  margin: 0;\n  padding: 0;\n  white-space: nowrap;\n}\n.notice-bar-item.ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/*# sourceMappingURL=NoticeBar.vue.map */"]
    },
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-f2a42a16";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

var NoticeBar = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var install = function install(Vue) {
  Vue.component(NoticeBar.name, NoticeBar);
};

var src = install;

module.exports = src;
