(self["webpackChunkhello_world"] = self["webpackChunkhello_world"] || []).push([[179],{

/***/ 9763:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__(5666);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(6699);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.includes.js
var es_string_includes = __webpack_require__(2023);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__(1539);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__(4747);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
var es_promise = __webpack_require__(8674);
// EXTERNAL MODULE: ./node_modules/vue/dist/vue.runtime.esm.js
var vue_runtime_esm = __webpack_require__(144);
// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.esm.js
var vue_router_esm = __webpack_require__(8345);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.find.js
var es_array_find = __webpack_require__(9826);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__(4916);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match.js
var es_string_match = __webpack_require__(4723);
// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(9669);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ./src/utils/api.js




 // auth methods, can't import all these shits from auth as it'll create circular import

function getAccessToken() {
  return localStorage.getItem('accessToken') || null;
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken') || null;
}

function setAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function setRefreshToken(token) {
  localStorage.setItem('refreshToken', token);
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
  console.log('accessToken', localStorage.getItem('accessToken'));
}

function removeRefreshToken() {
  localStorage.removeItem('refreshToken');
}

var detectErrorType = function detectErrorType(error) {
  if (error.response) {
    if (error.response.status === 503 || error.response.status === 504) {
      return api.errorTypes.SERVER_TIMEOUT;
    } else if (error.response.status === 0) {
      return api.errorTypes.NETWORK_ERROR;
    }
  } else if (error.request) {
    // client timeout
    if (error.message.match(/^timeout.+/)) {
      return api.errorTypes.SERVER_TIMEOUT;
    } else {
      return api.errorTypes.NETWORK_ERROR;
    }
  }

  return api.errorTypes.UNEXPECTED_ERROR;
};

function createApi() {
  return axios_default().create({
    baseURL: "https://628c7997a3fd714fd032a771.mockapi.io",
    timeout: 60000,
    headers: {
      Authorization: "Bearer ".concat(getAccessToken())
    }
  });
}

var api = createApi();
api.errorTypes = {
  NETWORK_ERROR: "networkError",
  SERVER_TIMEOUT: "serverTimeout",
  UNEXPECTED_ERROR: "unexpectedError"
};
api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  var response = error.response,
      config = error.config;

  if (response.status !== 401) {
    return Promise.reject(error);
  } // Use default axios instance without the interceptor to refresh the token. No more infinite refresh loop.


  return axios_default().post('/auth/refresh-token/', {
    token: getRefreshToken()
  }).then(function (response) {
    setAccessToken(response.data.access_token);
    return createApi();
  }).catch(function () {
    return Promise.reject(error);
  });
});

api.retry = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var instance = axios_default().create(this.defaults);
  var retries = options && options.retries || 5;
  var retryCount = 0;
  instance.interceptors.response.use(null, function (error) {
    error._type = detectErrorType(error);

    if (error.config && retryCount < retries && (error._type === api.errorTypes.SERVER_TIMEOUT || error._type === api.errorTypes.NETWORK_ERROR)) {
      error._retrying = true;
      error._retryCount = retryCount;

      if (typeof options.beforeRetry === "function") {
        // console.log('x', error)
        options.beforeRetry(error, 'haha');
      }

      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(instance.request(error.config));
        }, Math.pow(2, retryCount) * 1000 + Math.random() * 1000);
        retryCount += 1;
      });
    }

    error._retrying = false;
    return Promise.reject(error);
  });
  return instance;
};

/* harmony default export */ var utils_api = (api);
;// CONCATENATED MODULE: ./src/utils/auth.js





function auth_getAccessToken() {
  return localStorage.getItem('accessToken') || null;
}

function auth_getRefreshToken() {
  return localStorage.getItem('refreshToken') || null;
}

function auth_setAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function auth_setRefreshToken(token) {
  localStorage.setItem('refreshToken', token);
}

function auth_removeAccessToken() {
  localStorage.removeItem('accessToken');
}

function auth_removeRefreshToken() {
  localStorage.removeItem('refreshToken');
}

function login(username, password) {
  // dummy request
  return utils_api.get("/users").then(function (response) {
    var user = response.data.find(function (data) {
      return data.email == username && data.password == password;
    });

    if (user && user.accessToken) {
      auth_setAccessToken(user.accessToken);
      auth_setRefreshToken(user.refreshToken);
      response.data.accessToken = user.accessToken;
      response.data.refreshToken = user.refreshToken;
    } else {
      auth_removeAccessToken();
      auth_removeRefreshToken();
      response.data.accessToken = null;
      response.data.refreshToken = null;
    }

    return user;
  }).catch(function () {
    return Promise.reject(error);
  }); // the real request

  return utils_api.get("/auth/login", {
    username: username,
    password: password
  }).then(function (response) {
    if (response.data.accessToken) {
      auth_setAccessToken(response.data.accessToken);
      auth_setRefreshToken(response.data.refreshToken);
    } else {
      auth_removeAccessToken();
      auth_removeRefreshToken();
    }

    return response;
  }).catch(function () {
    return Promise.reject(error);
  });
}

function logout() {
  auth_removeAccessToken();
  auth_removeRefreshToken();
}

function isLoggedIn() {
  return !!auth_getAccessToken();
}

var auth = {
  getAccessToken: auth_getAccessToken,
  getRefreshToken: auth_getRefreshToken,
  setAccessToken: auth_setAccessToken,
  setRefreshToken: auth_setRefreshToken,
  removeAccessToken: auth_removeAccessToken,
  removeRefreshToken: auth_removeRefreshToken,
  login: login,
  logout: logout,
  isLoggedIn: isLoggedIn
};
/* harmony default export */ var utils_auth = (auth);
// EXTERNAL MODULE: ./node_modules/i18next/dist/esm/i18next.js + 13 modules
var i18next = __webpack_require__(7268);
// EXTERNAL MODULE: ./node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js
var i18nextBrowserLanguageDetector = __webpack_require__(6071);
;// CONCATENATED MODULE: ./src/utils/i18next.js


i18next/* default.use */.ZP.use(i18nextBrowserLanguageDetector/* default */.Z).init({
  fallbackLng: 'en',
  supportedLngs: ['id', 'en'],
  debug: false,
  detection: {
    order: ['path'],
    lookupFromPathIndex: 0
  },
  resources: {
    en: {
      translation: {
        components: {
          errors: {
            networkError: {
              title: "Network error",
              message: "There seems to be an issue with the network. Please try again later.",
              retryingMessage: "We are attempting to reload this feature"
            },
            serverTimeout: {
              title: "Server timeout",
              message: "Our servers are taking too long to respond to this request. Please try again later.",
              retryingMessage: "We are attempting to reload this feature"
            },
            unexpectedError: {
              title: "Unexpected error",
              message: "Our team has been informed and will be looking into this shortly."
            }
          }
        }
      }
    },
    id: {
      translation: {
        components: {
          errors: {
            networkError: {
              title: "Jaringan bermasalah",
              message: "There seems to be an issue with the network. Please try again later.",
              retryingMessage: "We are attempting to reload this feature"
            },
            serverTimeout: {
              title: "Koneksi ke server terputus",
              message: "Our servers are taking too long to respond to this request. Please try again later.",
              retryingMessage: "We are attempting to reload this feature"
            },
            unexpectedError: {
              title: "Masalah tidak teridentifikasi",
              message: "Our team has been informed and will be looking into this shortly."
            }
          }
        }
      }
    }
  }
});
/* harmony default export */ var utils_i18next = (i18next/* default */.ZP);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
var es_array_slice = __webpack_require__(7042);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
var es_array_index_of = __webpack_require__(2772);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__(2222);
;// CONCATENATED MODULE: ./src/utils/url.js




function url(urlWithoutLocale) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : utils_i18next.language;

  if (urlWithoutLocale === null) {
    var pathname = window.location.pathname;
    urlWithoutLocale = pathname.slice(pathname.indexOf("/", 1));
  }

  return "/".concat(locale).concat(urlWithoutLocale);
} // usage
// url('/user/create') // go to different path without changing locale
// url('/user', 'en') // go to different path with changing locale
// url(null, 'en') // just changing locale without changing current path
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90&
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("router-view")
}
var staticRenderFns = []
render._withStripped = true


;// CONCATENATED MODULE: ./src/App.vue?vue&type=template&id=7ba5bd90&

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1900);
;// CONCATENATED MODULE: ./src/App.vue

var script = {}


/* normalize component */
;
var component = (0,componentNormalizer/* default */.Z)(
  script,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var App_api; }
component.options.__file = "src/App.vue"
/* harmony default export */ var App = (component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/layouts-vue/LayoutBlank.vue?vue&type=template&id=2749ecd8&
var LayoutBlankvue_type_template_id_2749ecd8_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("router-view")
}
var LayoutBlankvue_type_template_id_2749ecd8_staticRenderFns = []
LayoutBlankvue_type_template_id_2749ecd8_render._withStripped = true


;// CONCATENATED MODULE: ./src/layouts-vue/LayoutBlank.vue?vue&type=template&id=2749ecd8&

;// CONCATENATED MODULE: ./src/layouts-vue/LayoutBlank.vue

var LayoutBlank_script = {}


/* normalize component */
;
var LayoutBlank_component = (0,componentNormalizer/* default */.Z)(
  LayoutBlank_script,
  LayoutBlankvue_type_template_id_2749ecd8_render,
  LayoutBlankvue_type_template_id_2749ecd8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var LayoutBlank_api; }
LayoutBlank_component.options.__file = "src/layouts-vue/LayoutBlank.vue"
/* harmony default export */ var LayoutBlank = (LayoutBlank_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/layouts-vue/LayoutDefault.vue?vue&type=template&id=520873fe&
var LayoutDefaultvue_type_template_id_520873fe_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "flex flex-column height-100" }, [
    _c("div", { staticClass: "flex" }, [
      _c(
        "div",
        {
          staticClass:
            "padding-y-12 border-bottom border-primary border-width-2",
          staticStyle: { "min-width": "238px" },
        },
        [
          _c(
            "router-link",
            {
              staticClass:
                "a a-nocolor flex flex-items-center flex-justify-center",
              attrs: { to: "/" },
            },
            [
              _c("span", { staticClass: "margin-left-8 text-primary" }, [
                _vm._v("Showcasing app"),
              ]),
            ]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass:
            "padding-y-12 padding-x-28 bg-primary text-white grow-1 flex flex-items-center",
        },
        [
          _c("div", { staticClass: "fw-700 margin-right-auto" }),
          _vm._v(" "),
          _vm.isLoggedIn
            ? _c(
                "a",
                {
                  staticClass:
                    "a a-nocolor hover-text-light margin-left-16 cursor-pointer",
                  on: {
                    click: function ($event) {
                      $event.preventDefault()
                      return _vm.logout.apply(null, arguments)
                    },
                  },
                },
                [_vm._v("Logout")]
              )
            : _c(
                "router-link",
                {
                  staticClass: "a a-nocolor hover-text-light margin-left-16",
                  attrs: { to: _vm.$url("/login") },
                },
                [_vm._v("Login")]
              ),
        ],
        1
      ),
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "hidden" },
      [
        _c(
          "router-link",
          { staticClass: "a block margin-4", attrs: { to: "/" } },
          [_vm._v("\n      /")]
        ),
        _vm._v(" "),
        _c(
          "router-link",
          { staticClass: "a block margin-4", attrs: { to: "/user" } },
          [_vm._v("\n      /user")]
        ),
        _vm._v(" "),
        _c(
          "router-link",
          { staticClass: "a block margin-4", attrs: { to: "/user/create" } },
          [_vm._v("\n      /user/create")]
        ),
        _vm._v(" "),
        _c(
          "router-link",
          {
            staticClass: "a block margin-4",
            attrs: { to: "/user/create#foo" },
          },
          [_vm._v("\n      /user/create#foo")]
        ),
        _vm._v(" "),
        _c(
          "router-link",
          {
            staticClass: "a block margin-4",
            attrs: {
              to: {
                name: "user-create",
                params: { id: "create" },
                query: { foo: "bar" },
              },
              exact: "",
            },
          },
          [_vm._v("\n      /user/create?foo=bar (exact)")]
        ),
        _vm._v(" "),
        _c(
          "router-link",
          {
            staticClass: "a block margin-4",
            attrs: {
              to: { path: "/user/create", query: { foo: "bar", baz: "qux" } },
            },
          },
          [_vm._v("\n      /user/create?foo=bar&baz=qux")]
        ),
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "grow-1 flex" }, [
      _c(
        "div",
        {
          staticClass: "border-right border-light border-width-2",
          staticStyle: { "min-width": "240px" },
        },
        [
          _c(
            "div",
            { staticClass: "padding-12 text-grayer" },
            [
              _c(
                "router-link",
                {
                  staticClass: "a a-nocolor block padding-y-8 padding-x-12",
                  attrs: {
                    "exact-active-class": "text-darkest bg-lighter rounded-4",
                    to: _vm.$url("/"),
                  },
                },
                [_vm._v("\n          Home\n        ")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "a a-nocolor block padding-y-8 padding-x-12",
                  attrs: {
                    "exact-active-class": "text-darkest bg-lighter rounded-4",
                    to: _vm.$url("/user"),
                  },
                },
                [_vm._v("\n          User list\n        ")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "a a-nocolor block padding-y-8 padding-x-12",
                  attrs: {
                    "exact-active-class": "text-darkest bg-lighter rounded-4",
                    to: _vm.$url("/user/datatables"),
                  },
                },
                [_vm._v("\n          User list (datatables)\n        ")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "a a-nocolor block padding-y-8 padding-x-12",
                  attrs: {
                    "exact-active-class": "text-darkest bg-lighter rounded-4",
                    to: _vm.$url("/user/create"),
                  },
                },
                [_vm._v("\n          User form\n        ")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "a a-nocolor block padding-y-8 padding-x-12",
                  attrs: {
                    "exact-active-class": "text-darkest bg-lighter rounded-4",
                    to: "/asdf",
                  },
                },
                [_vm._v("\n          Non exist page\n        ")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "a a-nocolor block padding-y-8 padding-x-12",
                  attrs: {
                    "exact-active-class": "text-darkest bg-lighter rounded-4",
                    to: _vm.$url("/asdf"),
                  },
                },
                [_vm._v("\n          Non exist page (with en)\n        ")]
              ),
            ],
            1
          ),
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "grow-1 bg-lightest padding-top-48" }, [
        _c("div", { staticClass: "container-compact" }, [_c("router-view")], 1),
      ]),
    ]),
  ])
}
var LayoutDefaultvue_type_template_id_520873fe_staticRenderFns = []
LayoutDefaultvue_type_template_id_520873fe_render._withStripped = true


;// CONCATENATED MODULE: ./src/layouts-vue/LayoutDefault.vue?vue&type=template&id=520873fe&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/layouts-vue/LayoutDefault.vue?vue&type=script&lang=js&




function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
//
//
//
//
//


/* harmony default export */ var LayoutDefaultvue_type_script_lang_js_ = ({
  name: 'LayoutDefault',
  data: function data() {
    return {
      isLoggedIn: utils_auth.isLoggedIn()
    };
  },
  mounted: function mounted() {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  methods: {
    logout: function logout() {
      utils_auth.logout();
      this.isLoggedIn = utils_auth.isLoggedIn();
      this.$router.push(url(""));
    }
  }
});
;// CONCATENATED MODULE: ./src/layouts-vue/LayoutDefault.vue?vue&type=script&lang=js&
 /* harmony default export */ var layouts_vue_LayoutDefaultvue_type_script_lang_js_ = (LayoutDefaultvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/layouts-vue/LayoutDefault.vue?vue&type=style&index=0&lang=scss&
var LayoutDefaultvue_type_style_index_0_lang_scss_ = __webpack_require__(2181);
;// CONCATENATED MODULE: ./src/layouts-vue/LayoutDefault.vue?vue&type=style&index=0&lang=scss&

;// CONCATENATED MODULE: ./src/layouts-vue/LayoutDefault.vue



;


/* normalize component */

var LayoutDefault_component = (0,componentNormalizer/* default */.Z)(
  layouts_vue_LayoutDefaultvue_type_script_lang_js_,
  LayoutDefaultvue_type_template_id_520873fe_render,
  LayoutDefaultvue_type_template_id_520873fe_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var LayoutDefault_api; }
LayoutDefault_component.options.__file = "src/layouts-vue/LayoutDefault.vue"
/* harmony default export */ var LayoutDefault = (LayoutDefault_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/Index.vue?vue&type=template&id=7b2d3957&
var Indexvue_type_template_id_7b2d3957_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    _vm._l(_vm.items, function (item, index) {
      return _c("documentation", {
        key: "item-0-" + index,
        attrs: {
          title: item.title,
          descriptions: item.descriptions || [],
          items: item.items || [],
        },
      })
    }),
    1
  )
}
var Indexvue_type_template_id_7b2d3957_staticRenderFns = []
Indexvue_type_template_id_7b2d3957_render._withStripped = true


;// CONCATENATED MODULE: ./src/pages-vue/Index.vue?vue&type=template&id=7b2d3957&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Documentation.vue?vue&type=template&id=1085b833&
var Documentationvue_type_template_id_1085b833_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "margin-y-24" },
    [
      _vm.level === 0
        ? _c("h1", { staticClass: "fw-600 margin-bottom-16" }, [
            _vm._v(_vm._s(_vm.title)),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.level === 1
        ? _c("h2", { staticClass: "fw-600" }, [_vm._v(_vm._s(_vm.title))])
        : _vm._e(),
      _vm._v(" "),
      _vm.level === 2
        ? _c("h3", { staticClass: "fw-600" }, [_vm._v(_vm._s(_vm.title))])
        : _vm._e(),
      _vm._v(" "),
      _vm.level === 3
        ? _c("h4", { staticClass: "fw-600" }, [_vm._v(_vm._s(_vm.title))])
        : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.descriptions, function (description, index) {
        return _vm.descriptions
          ? _c(
              "div",
              {
                key: "desc-" + _vm.level + "-" + index,
                staticClass: "text-darker margin-top-8",
              },
              [_vm._v("\n    " + _vm._s(description) + "\n  ")]
            )
          : _vm._e()
      }),
      _vm._v(" "),
      _vm._l(_vm.items, function (item, index) {
        return _c("Documentation", {
          key: "item-" + _vm.level + "-" + index,
          attrs: {
            title: item.title,
            descriptions: item.descriptions || [],
            items: item.items || [],
            level: _vm.level + 1,
          },
        })
      }),
    ],
    2
  )
}
var Documentationvue_type_template_id_1085b833_staticRenderFns = []
Documentationvue_type_template_id_1085b833_render._withStripped = true


;// CONCATENATED MODULE: ./src/components-vue/Documentation.vue?vue&type=template&id=1085b833&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__(9653);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Documentation.vue?vue&type=script&lang=js&

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
/* harmony default export */ var Documentationvue_type_script_lang_js_ = ({
  name: 'Documentation',
  props: {
    title: {
      type: String,
      default: ''
    },
    descriptions: {
      type: Array,
      default: []
    },
    items: {
      type: Array,
      default: []
    },
    level: {
      type: Number,
      default: 0
    }
  }
});
;// CONCATENATED MODULE: ./src/components-vue/Documentation.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_vue_Documentationvue_type_script_lang_js_ = (Documentationvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components-vue/Documentation.vue





/* normalize component */
;
var Documentation_component = (0,componentNormalizer/* default */.Z)(
  components_vue_Documentationvue_type_script_lang_js_,
  Documentationvue_type_template_id_1085b833_render,
  Documentationvue_type_template_id_1085b833_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Documentation_api; }
Documentation_component.options.__file = "src/components-vue/Documentation.vue"
/* harmony default export */ var Documentation = (Documentation_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__(7327);
;// CONCATENATED MODULE: ./src/datas/documentation.js




/**
 * @type {Item[]}
 */
var items = [{
  title: "Showcasing App",
  descriptions: ["This app contains the most common production features, built with vue."],
  items: [{
    title: "Auth page",
    descriptions: [],
    items: [{
      title: "Register",
      descriptions: ["Registering new account can be auto joined, or can also need some kind of account activation.", "This app just registers new user with auto joined."]
    }, {
      title: "Activate",
      descriptions: ["After register, usually an account needs to be activated via link sent to email. This app doesn't implement this yet."]
    }, {
      title: "Login",
      descriptions: ["Can use username/email/phone/both. This app uses email.", "Use JWT Authentication. This app save the token on local storage."]
    }, {
      title: "Forget password & reset password by user",
      descriptions: ["If users forget their password, they can request password recovery using forget password page.", "Later, they will get a link sent to their email, it's a page to reset their password.", "This app doesn't implement this yet."]
    }, {
      title: "Reset password by admin & create new password by user",
      descriptions: ["This app doesn't implement this yet."]
    }, {
      title: "Change password",
      descriptions: ["This app doesn't implement this yet."]
    }, {
      title: "Logout",
      descriptions: ["Delete auth token stored on local storage."]
    }]
  }, {
    title: "List page",
    descriptions: [],
    items: [{
      title: "When the data is requested",
      descriptions: ["One time request: it means all the data are fetched once at the beginning. This app implement this.", "On demand request: it means only current viewed data is requested, if users want to see another data (eg: go to another page), the app will re-request the data again.", "Infinite scroll: it means only when users scroll the page down, the app will request another data. Unlike on demand request, going back to previous data doesn't repeat the request."]
    }, {
      title: "Paginated data",
      descriptions: ["Change per page: An ability to set how many data are shown in one single page.", "Change page: An ability to go to another page to see another bunch of data."]
    }, {
      title: "Sorting",
      descriptions: ["Sort the data based on particular column, ascending or descending."]
    }, {
      title: "Filtering",
      descriptions: ["Filter the data by custom function:", "• search by text, range filter by text", "• single select by dropdown / radio / toggle", "• multi select by checkbox"]
    }, {
      title: "Changing the url",
      descriptions: ["When user go to specific page, sort the data or filter the data, it'll also change the url's address.", "This app doesn't implement this yet."]
    }, {
      title: "Action to one data / row",
      descriptions: ["go to another page. This app doesn't implement this yet.", "pop the modal up. This app doesn't implement this yet.", "call api: with confirmation pop up and redraw the data. This app doesn't implement this yet."]
    }, {
      title: "Action to multiple data / rows",
      descriptions: ["Bulk action by checkbox (ex: for delete). This app doesn't implement this yet."]
    }, {
      title: "Exporting the data",
      descriptions: ["Data can be exported to excel, pdf, clipboard, etc. This app doesn't implement this yet."]
    }]
  }, {
    title: "Form page",
    descriptions: [],
    items: [{
      title: "Input types",
      descriptions: ["• text, textarea", "• 1 to many & enum (dropdown, radio, dropdown by search). This app doesn't implement this yet.", "• many to many & set (checkbox, dropdown multiple). This app doesn't implement this yet.", "• upload file & picture with preview. This app doesn't implement this yet.", "• time, date & datetime. This app doesn't implement this yet.", "• masked input (phone, currency). This app doesn't implement this yet.", "• WYSIWYG. This app doesn't implement this yet."]
    }, {
      title: "Validating form data",
      descriptions: ["There are behavior options you can choose to validate form data:", "• real-time validation: it means if user doesn't finish typing / inputting the data, they will see an error message right away.", "• on-blur validation: it means the inputted data will only be validated when user out of focus from the input. It means if the data is incorrectly validated, they need to go back to the input to fix it.", "• on-before submit validation: it means they need to go back to fix the data one by one if the inputted data are incorrectly validated.", "• server-side validation: it means user needs to wait for api request to finish, to just know what errors do the data have.", "But this app doesn't implement any kind of those validations. Rather it implements combinations of these:", "• .", "• .", "• ."]
    }, {
      title: "Loading state when submit",
      descriptions: ["Show an indicator when submitting the data.", "It can prevent user to double click submit button."]
    }, {
      title: "Dynamic input",
      descriptions: ["This app doesn't implement this yet."]
    }]
  }, {
    title: "Routing",
    descriptions: ["Router in this app is localized. Here's some rules that are implemented:", "• visiting / will be redirect to default app's locale which in this case is /en. The other option is to redirect user to their locale preference that's usually saved on database.", "• visiting /unknown will be redirected to not found page", "• visiting /lang/path will be redirected to a page with correct translation", "We also provide localized url, so you just have to write /path instead of /language/path", "• method url('/path') to get path without defining language", "• method url('/path', language) to get path with language defined", "• method url(null, language) to get current path with new language"]
  }, {
    title: "Language localisation",
    descriptions: [""]
  }, {
    title: "Auth",
    descriptions: [""]
  }, {
    title: "Accessing api",
    descriptions: [""]
  }, {
    title: "Skeleton",
    descriptions: [""]
  }, {
    title: "Error handling",
    descriptions: ["network_error, server_timeout, unexpected_error"]
  }, {
    title: "Testing",
    descriptions: ["e2e, unit"]
  }, {
    title: "Continuous integration"
  }, {
    title: "Modal, alert & confirmation popup"
  }, {
    title: "Relative view",
    descriptions: ["Triggers: show on click, show on hover, show on page load", "Eg: dropdown & tooltip"]
  }, {
    title: "Log error & send it to developer email"
  }, {
    title: "Upload & view file with auth"
  }, {
    title: "Send email"
  }, {
    title: "Chart"
  }, {
    title: "Accessing storage",
    descriptions: [""]
  }, {
    title: "Generating pdf"
  }, {
    title: "Switching environment: dev, uat or prod"
  }, {
    title: "Linting, minifying & size checking"
  }]
}];
function getItems() {
  return items;
}
/**
 * @param {string} title
 * @returns {Item}
 */

function getItem(title) {
  return items.find(function (item) {
    return item.title === title;
  });
}
/**
 * @param {string} title
 * @returns {void}
 */

function deleteItem(title) {
  items = items.filter(function (item) {
    return item.title !== title;
  });
}
/**
 * @typedef {{ title: string; descriptions: Array; items: Array }} Item
 */
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/Index.vue?vue&type=script&lang=js&




function Indexvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Indexvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Indexvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Indexvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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


/* harmony default export */ var Indexvue_type_script_lang_js_ = ({
  name: 'Index',
  components: {
    documentation: Documentation
  },
  data: function data() {
    return {
      items: []
    };
  },
  created: function created() {
    var _this = this;

    return Indexvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.items = getItems();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {},
  methods: {}
});
;// CONCATENATED MODULE: ./src/pages-vue/Index.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_vue_Indexvue_type_script_lang_js_ = (Indexvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/pages-vue/Index.vue





/* normalize component */
;
var Index_component = (0,componentNormalizer/* default */.Z)(
  pages_vue_Indexvue_type_script_lang_js_,
  Indexvue_type_template_id_7b2d3957_render,
  Indexvue_type_template_id_7b2d3957_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Index_api; }
Index_component.options.__file = "src/pages-vue/Index.vue"
/* harmony default export */ var Index = (Index_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/ErrorPage.vue?vue&type=template&id=3c6abc3c&
var ErrorPagevue_type_template_id_3c6abc3c_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "height-100 flex flex-items-center flex-justify-center bg-lighter",
    },
    [
      _c(
        "div",
        {
          staticClass:
            "padding-x-24 padding-y-36 rounded border shadow bg-white text-center",
          staticStyle: { width: "400px" },
        },
        [
          _c("h1", { staticClass: "text-red" }, [
            _vm._v(_vm._s(this.$route.meta.title)),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "margin-top-20" }, [
            _vm._v(_vm._s(this.$route.meta.description)),
          ]),
        ]
      ),
    ]
  )
}
var ErrorPagevue_type_template_id_3c6abc3c_staticRenderFns = []
ErrorPagevue_type_template_id_3c6abc3c_render._withStripped = true


;// CONCATENATED MODULE: ./src/pages-vue/ErrorPage.vue?vue&type=template&id=3c6abc3c&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/ErrorPage.vue?vue&type=script&lang=js&




function ErrorPagevue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function ErrorPagevue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ErrorPagevue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ErrorPagevue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
//
//
//
//
//
//
//
//
/* harmony default export */ var ErrorPagevue_type_script_lang_js_ = ({
  name: 'ErrorPage',
  data: function data() {
    return {};
  },
  mounted: function mounted() {
    return ErrorPagevue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {},
  methods: {}
});
;// CONCATENATED MODULE: ./src/pages-vue/ErrorPage.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_vue_ErrorPagevue_type_script_lang_js_ = (ErrorPagevue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/pages-vue/ErrorPage.vue





/* normalize component */
;
var ErrorPage_component = (0,componentNormalizer/* default */.Z)(
  pages_vue_ErrorPagevue_type_script_lang_js_,
  ErrorPagevue_type_template_id_3c6abc3c_render,
  ErrorPagevue_type_template_id_3c6abc3c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ErrorPage_api; }
ErrorPage_component.options.__file = "src/pages-vue/ErrorPage.vue"
/* harmony default export */ var ErrorPage = (ErrorPage_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/auth/Login.vue?vue&type=template&id=4618fecd&
var Loginvue_type_template_id_4618fecd_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "height-100 flex flex-items-center flex-justify-center bg-lighter",
    },
    [
      _c(
        "div",
        {
          staticClass: "padding-24 rounded border shadow bg-white",
          staticStyle: { width: "400px" },
        },
        [
          _c("form", [
            _c("div", { staticClass: "margin-bottom-24" }, [
              _c("label", { staticClass: "form-label" }, [_vm._v("Email")]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.login.email,
                    expression: "login.email",
                  },
                ],
                staticClass: "form-text",
                attrs: { type: "text" },
                domProps: { value: _vm.login.email },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.login, "email", $event.target.value)
                  },
                },
              }),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "margin-bottom-24" }, [
              _c("label", { staticClass: "form-label" }, [_vm._v("Password")]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.login.password,
                    expression: "login.password",
                  },
                ],
                staticClass: "form-text",
                attrs: { type: "text" },
                domProps: { value: _vm.login.password },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.login, "password", $event.target.value)
                  },
                },
              }),
            ]),
            _vm._v(" "),
            _c("div", [
              _c(
                "a",
                {
                  staticClass: "button button-primary",
                  attrs: { disabled: !_vm.canSubmit },
                  on: { click: _vm.submit },
                },
                [_vm._v("\n          Login\n        ")]
              ),
            ]),
          ]),
          _vm._v(" "),
          _vm.loading.submit ? _c("loading") : _vm._e(),
          _vm._v(" "),
          _vm.error.title
            ? _c("error", {
                attrs: {
                  title: _vm.error.title,
                  message: _vm.error.message,
                  showLoading: _vm.error.showLoading,
                  inlineDisplay: false,
                },
              })
            : _vm._e(),
        ],
        1
      ),
    ]
  )
}
var Loginvue_type_template_id_4618fecd_staticRenderFns = []
Loginvue_type_template_id_4618fecd_render._withStripped = true


;// CONCATENATED MODULE: ./src/pages-vue/auth/Login.vue?vue&type=template&id=4618fecd&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol = __webpack_require__(2526);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__(1817);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.iterator.js
var es_symbol_iterator = __webpack_require__(2165);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__(6992);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__(8783);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__(3948);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__(8309);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.from.js
var es_array_from = __webpack_require__(1038);
;// CONCATENATED MODULE: ./src/utils/handleError.js


function handleError(error) {
  console.log('a', error);
  var title = "";
  var message = "";
  var showLoading = false;

  if (error instanceof axios.AxiosError) {
    var tKey = "components.errors." + error._type; // console.error('tKey', tKey)

    title = utils_i18next.t(tKey + '.title');

    if (error._retrying) {
      message = utils_i18next.t(tKey + '.retrying_message');
      showLoading = true;
    } else {
      message = utils_i18next.t(tKey + '.message');
      showLoading = false;

      if (error._retryCount) {// console.error(error)
        // this.isDev() ? console.error(error) : Sentry.captureException(error);
      }
    }
  } else {// console.error(error)
    // this.isDev() ? console.error(error) : Sentry.captureException(error);
  }

  return [title, message, showLoading];
}
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Error.vue?vue&type=template&id=7842c181&
var Errorvue_type_template_id_7842c181_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "absolute width-100 height-100 top-0 left-0 flex flex-items-center",
      class: {
        "flex-column flex-justify-center text-center": !_vm.inlineDisplay,
      },
      staticStyle: { "background-color": "rgba(255, 255, 255, .6)" },
    },
    [
      _c("img", {
        staticClass: "width-52px",
        class: {
          "margin-right-16 padding-y-4": _vm.inlineDisplay,
          "margin-bottom-8": !_vm.inlineDisplay,
        },
        attrs: {
          src: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
        },
      }),
      _vm._v(" "),
      _c("div", [
        _c("div", { staticClass: "h3 fw-bold margin-bottom-8" }, [
          _vm._v("\n      " + _vm._s(_vm.title) + "\n    "),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "fw-500 text-grayer" }, [
          _vm._v("\n      " + _vm._s(_vm.message) + "\n    "),
        ]),
      ]),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.showLoading,
              expression: "showLoading",
            },
          ],
          staticClass: "inline",
        },
        [
          _c("img", {
            staticClass: "width-72px",
            attrs: { src: __webpack_require__(1039) },
          }),
        ]
      ),
    ]
  )
}
var Errorvue_type_template_id_7842c181_staticRenderFns = []
Errorvue_type_template_id_7842c181_render._withStripped = true


;// CONCATENATED MODULE: ./src/components-vue/Error.vue?vue&type=template&id=7842c181&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Error.vue?vue&type=script&lang=js&
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
/* harmony default export */ var Errorvue_type_script_lang_js_ = ({
  name: 'Error',
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    inlineDisplay: {
      type: Boolean,
      default: false
    }
  }
});
;// CONCATENATED MODULE: ./src/components-vue/Error.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_vue_Errorvue_type_script_lang_js_ = (Errorvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components-vue/Error.vue





/* normalize component */
;
var Error_component = (0,componentNormalizer/* default */.Z)(
  components_vue_Errorvue_type_script_lang_js_,
  Errorvue_type_template_id_7842c181_render,
  Errorvue_type_template_id_7842c181_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Error_api; }
Error_component.options.__file = "src/components-vue/Error.vue"
/* harmony default export */ var Error = (Error_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Loading.vue?vue&type=template&id=2e213b16&
var Loadingvue_type_template_id_2e213b16_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var Loadingvue_type_template_id_2e213b16_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass:
          "absolute width-100 height-100 top-0 left-0 flex flex-items-center flex-justify-center",
        staticStyle: { "background-color": "rgba(255, 255, 255, .6)" },
      },
      [_c("img", { attrs: { src: __webpack_require__(1039) } })]
    )
  },
]
Loadingvue_type_template_id_2e213b16_render._withStripped = true


;// CONCATENATED MODULE: ./src/components-vue/Loading.vue?vue&type=template&id=2e213b16&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Loading.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var Loadingvue_type_script_lang_js_ = ({
  name: 'Loading'
});
;// CONCATENATED MODULE: ./src/components-vue/Loading.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_vue_Loadingvue_type_script_lang_js_ = (Loadingvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components-vue/Loading.vue





/* normalize component */
;
var Loading_component = (0,componentNormalizer/* default */.Z)(
  components_vue_Loadingvue_type_script_lang_js_,
  Loadingvue_type_template_id_2e213b16_render,
  Loadingvue_type_template_id_2e213b16_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Loading_api; }
Loading_component.options.__file = "src/components-vue/Loading.vue"
/* harmony default export */ var Loading = (Loading_component.exports);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/auth/Login.vue?vue&type=script&lang=js&












function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
//
//
//
//
//
//
//
//
//





/* harmony default export */ var Loginvue_type_script_lang_js_ = ({
  name: 'Login',
  components: {
    error: Error,
    loading: Loading
  },
  data: function data() {
    return {
      error: {
        object: null,
        title: '',
        message: '',
        showLoading: false
      },
      loading: {
        submit: false
      },
      login: {
        email: '',
        password: ''
      },
      errorMessage: 'Email or password is incorrect, please try with the correct one',
      validationState: null
    };
  },
  computed: {
    canSubmit: function canSubmit() {
      return this.login.email && this.login.password;
    }
  },
  methods: {
    submit: function submit() {
      var _this = this;

      this.loading.submit = true;

      var catchError = function catchError(error) {
        if (error) {
          this.error.object = error;

          var _handleError = handleError(error);

          var _handleError2 = _slicedToArray(_handleError, 3);

          this.error.title = _handleError2[0];
          this.error.message = _handleError2[1];
          this.error.showLoading = _handleError2[2];
        }

        this.loading.submit = false;
      };

      utils_auth.login(this.login.email, this.login.password).then(function (response) {
        _this.loading.submit = false;

        _this.$router.go(-1);
      }).catch(catchError.bind(this));
    }
  }
});
;// CONCATENATED MODULE: ./src/pages-vue/auth/Login.vue?vue&type=script&lang=js&
 /* harmony default export */ var auth_Loginvue_type_script_lang_js_ = (Loginvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/pages-vue/auth/Login.vue





/* normalize component */
;
var Login_component = (0,componentNormalizer/* default */.Z)(
  auth_Loginvue_type_script_lang_js_,
  Loginvue_type_template_id_4618fecd_render,
  Loginvue_type_template_id_4618fecd_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Login_api; }
Login_component.options.__file = "src/pages-vue/auth/Login.vue"
/* harmony default export */ var Login = (Login_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/user/UserList.vue?vue&type=template&id=9393a1dc&
var UserListvue_type_template_id_9393a1dc_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("h3", { staticClass: "fw-600 margin-bottom-16" }, [
        _vm._v("Manage user data"),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "text-grayest margin-bottom-24" }, [
        _vm._v(
          "All the data here are stored on mockapi.io, so shout out to them for providing such a cool service!"
        ),
      ]),
      _vm._v(" "),
      !_vm.loading
        ? [
            _c(
              "div",
              {
                staticClass:
                  "relative bg-white rounded-8 shadow-1 padding-24 margin-bottom-16",
              },
              [
                _c(
                  "div",
                  { staticClass: "flex flex-justify-start flex-items-center" },
                  [
                    _c("div", { staticClass: "margin-right-16" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.search.name,
                            expression: "search.name",
                          },
                        ],
                        staticClass:
                          "form-text border-none bg-lightest padding-x-12 padding-y-4 fw-normal",
                        attrs: {
                          type: "text",
                          placeholder: "search name here..",
                        },
                        domProps: { value: _vm.search.name },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(_vm.search, "name", $event.target.value)
                          },
                        },
                      }),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "margin-right-16" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.search.email,
                            expression: "search.email",
                          },
                        ],
                        staticClass:
                          "form-text border-none bg-lightest padding-x-12 padding-y-4 fw-normal",
                        attrs: {
                          type: "text",
                          placeholder: "search email here..",
                        },
                        domProps: { value: _vm.search.email },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(_vm.search, "email", $event.target.value)
                          },
                        },
                      }),
                    ]),
                  ]
                ),
                _vm._v(" "),
                _c(
                  "table",
                  { staticClass: "table table-compact margin-y-20" },
                  [
                    _c("thead", [
                      _c("tr", [
                        _c("th", { staticClass: "th-shrink text-left" }, [
                          _c(
                            "div",
                            {
                              staticClass:
                                "cursor-pointer flex flex-items-center",
                            },
                            [
                              _c(
                                "span",
                                {
                                  staticClass: "margin-right-8",
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("id")
                                    },
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                  #\n                "
                                  ),
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8",
                                  staticStyle: { "min-width": "32px" },
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("id")
                                    },
                                  },
                                },
                                [
                                  _c("i", {
                                    staticClass: "fa",
                                    class: [
                                      _vm.sort.column === "id"
                                        ? "text-darkest"
                                        : "text-gray",
                                      _vm.sort.column === "id"
                                        ? _vm.sort.order === "ascending"
                                          ? "fa-sort-down"
                                          : "fa-sort-up"
                                        : "fa-sort",
                                    ],
                                  }),
                                ]
                              ),
                            ]
                          ),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-expand text-left" }, [
                          _c(
                            "div",
                            {
                              staticClass:
                                "cursor-pointer flex flex-items-center",
                            },
                            [
                              _c(
                                "span",
                                {
                                  staticClass: "margin-right-8",
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("name")
                                    },
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                  Name\n                "
                                  ),
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8",
                                  staticStyle: { "min-width": "32px" },
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("name")
                                    },
                                  },
                                },
                                [
                                  _c("i", {
                                    staticClass: "fa fa-sort",
                                    class: [
                                      _vm.sort.column === "name"
                                        ? "text-darkest"
                                        : "text-gray",
                                      _vm.sort.column === "name"
                                        ? _vm.sort.order === "ascending"
                                          ? "fa-sort-down"
                                          : "fa-sort-up"
                                        : "fa-sort",
                                    ],
                                  }),
                                ]
                              ),
                            ]
                          ),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-expand text-left" }, [
                          _c(
                            "div",
                            {
                              staticClass:
                                "cursor-pointer flex flex-items-center",
                            },
                            [
                              _c(
                                "span",
                                {
                                  staticClass: "margin-right-8",
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("email")
                                    },
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                  Email\n                "
                                  ),
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8",
                                  staticStyle: { "min-width": "32px" },
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("email")
                                    },
                                  },
                                },
                                [
                                  _c("i", {
                                    staticClass: "fa",
                                    class: [
                                      _vm.sort.column === "email"
                                        ? "text-darkest"
                                        : "text-gray",
                                      _vm.sort.column === "email"
                                        ? _vm.sort.order === "ascending"
                                          ? "fa-sort-down"
                                          : "fa-sort-up"
                                        : "fa-sort",
                                    ],
                                  }),
                                ]
                              ),
                            ]
                          ),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-shrink text-left" }, [
                          _c(
                            "div",
                            {
                              staticClass:
                                "cursor-pointer flex flex-items-center",
                            },
                            [
                              _c(
                                "span",
                                {
                                  staticClass: "margin-right-8",
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("createdAt")
                                    },
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                  Created at\n                "
                                  ),
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "circle bg-lightest active-bg-light height-32px flex flex-items-center flex-justify-center margin-right-8",
                                  staticStyle: { "min-width": "32px" },
                                  on: {
                                    click: function ($event) {
                                      return _vm.toggleSort("createdAt")
                                    },
                                  },
                                },
                                [
                                  _c("i", {
                                    staticClass: "fa",
                                    class: [
                                      _vm.sort.column === "createdAt"
                                        ? "text-darkest"
                                        : "text-gray",
                                      _vm.sort.column === "createdAt"
                                        ? _vm.sort.order === "ascending"
                                          ? "fa-sort-down"
                                          : "fa-sort-up"
                                        : "fa-sort",
                                    ],
                                  }),
                                ]
                              ),
                            ]
                          ),
                        ]),
                        _vm._v(" "),
                        _c(
                          "th",
                          {
                            staticClass: "th-shrink text-left",
                            attrs: { colspan: "2" },
                          },
                          [_vm._v("\n              Action\n            ")]
                        ),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c(
                      "tbody",
                      _vm._l(_vm.queryData, function (row, index) {
                        return _c("tr", { key: index }, [
                          _c("td", [_vm._v(_vm._s(row.id))]),
                          _vm._v(" "),
                          _c("td", [_vm._v(_vm._s(row.name))]),
                          _vm._v(" "),
                          _c("td", [_vm._v(_vm._s(row.email))]),
                          _vm._v(" "),
                          _c("td", [
                            _vm._v(
                              _vm._s(
                                new Date(row.createdAt).toLocaleDateString()
                              )
                            ),
                          ]),
                          _vm._v(" "),
                          _c(
                            "td",
                            [
                              _c(
                                "router-link",
                                {
                                  staticClass:
                                    "a hover-text-light text-nowrap fw-400",
                                  attrs: {
                                    to: _vm.$url("/user/update/" + row.id),
                                  },
                                },
                                [
                                  _vm._v("Update "),
                                  _c("i", {
                                    staticClass:
                                      "fa fa-angle-right margin-left-4 fw-400",
                                  }),
                                ]
                              ),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _vm._m(0, true),
                        ])
                      }),
                      0
                    ),
                  ]
                ),
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass:
                  "margin-bottom-20 margin-bottom-24-sm flex flex-justify-between flex-justify-center-sm flex-items-center",
              },
              [
                _c("div", { staticClass: "margin-right-16" }, [
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.table.totalDataPerPage,
                          expression: "table.totalDataPerPage",
                        },
                      ],
                      staticClass:
                        "form-dropdown border-none bg-white padding-x- padding-y-4 fw-normal cursor-pointer",
                      on: {
                        change: function ($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function (o) {
                              return o.selected
                            })
                            .map(function (o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.$set(
                            _vm.table,
                            "totalDataPerPage",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          )
                        },
                      },
                    },
                    [
                      _c("option", { domProps: { value: 5 } }, [
                        _vm._v("5 rows"),
                      ]),
                      _vm._v(" "),
                      _c("option", { domProps: { value: 10 } }, [
                        _vm._v("10 rows"),
                      ]),
                      _vm._v(" "),
                      _c("option", { domProps: { value: 25 } }, [
                        _vm._v("25 rows"),
                      ]),
                    ]
                  ),
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "margin-right-auto fw-500 text-gray" },
                  [
                    _vm._v(
                      "\n        " +
                        _vm._s(
                          (_vm.table.currentPage - 1) *
                            _vm.table.totalDataPerPage +
                            1
                        ) +
                        " -\n        "
                    ),
                    _vm.table.currentPage >= _vm.totalPage
                      ? [
                          _vm._v(
                            "\n          " +
                              _vm._s(_vm.filteredData.length) +
                              "\n        "
                          ),
                        ]
                      : [
                          _vm._v(
                            "\n          " +
                              _vm._s(
                                (_vm.table.currentPage - 1) *
                                  _vm.table.totalDataPerPage +
                                  _vm.table.totalDataPerPage
                              ) +
                              "\n        "
                          ),
                        ],
                    _vm._v(
                      "\n        of\n        " +
                        _vm._s(_vm.filteredData.length) +
                        "\n      "
                    ),
                  ],
                  2
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "margin-left-8" },
                  [
                    _c(
                      "button",
                      {
                        staticClass:
                          "button border-none bg-white hover-bg-light active-bg-gray padding-x-12 padding-y-4 fw-normal",
                        attrs: { disabled: _vm.table.currentPage <= 1 },
                        on: {
                          click: function ($event) {
                            _vm.table.currentPage--
                          },
                        },
                      },
                      [_vm._v("\n          Prev\n        ")]
                    ),
                    _vm._v(" "),
                    _vm._l(_vm.pageButtons, function (row, index) {
                      return [
                        _c(
                          "button",
                          {
                            key: "pageButtons-" + index,
                            staticClass:
                              "button margin-x-4 border-none padding-y-4 fw-normal",
                            class:
                              row && row === _vm.table.currentPage
                                ? "bg-black text-white padding-x-12"
                                : row > 0
                                ? "bg-white hover-bg-light active-bg-gray padding-x-12"
                                : "padding-x-4",
                            attrs: { disabled: row < 0 },
                            on: {
                              click: function ($event) {
                                _vm.table.currentPage = row
                              },
                            },
                          },
                          [
                            _vm._v(
                              "\n            " +
                                _vm._s(row > 0 ? row : "...") +
                                "\n          "
                            ),
                          ]
                        ),
                      ]
                    }),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass:
                          "button border-none bg-white hover-bg-light active-bg-gray padding-x-12 padding-y-4 fw-normal",
                        attrs: {
                          disabled: _vm.table.currentPage >= _vm.totalPage,
                        },
                        on: {
                          click: function ($event) {
                            _vm.table.currentPage++
                          },
                        },
                      },
                      [_vm._v("\n          Next\n        ")]
                    ),
                  ],
                  2
                ),
              ]
            ),
          ]
        : _c("div", [
            _c(
              "div",
              {
                staticClass:
                  "bg-white rounded-8 shadow-1 padding-24 margin-bottom-16",
              },
              [
                _c("table", { staticClass: "table table-compact" }, [
                  _vm._m(1),
                  _vm._v(" "),
                  _c(
                    "tbody",
                    _vm._l([0, 1, 2, 3], function (i) {
                      return _c("tr", { key: i }, [
                        _vm._m(2, true),
                        _vm._v(" "),
                        _c("td", { staticClass: "th-expand" }, [
                          _c("span", {
                            staticClass: "skeleton rounded-4 height-24px",
                            style: {
                              width:
                                Math.floor(
                                  Math.random() * (400 - 140 + 1) + 140
                                ) + "px",
                            },
                          }),
                        ]),
                        _vm._v(" "),
                        _vm._m(3, true),
                        _vm._v(" "),
                        _vm._m(4, true),
                        _vm._v(" "),
                        _vm._m(5, true),
                        _vm._v(" "),
                        _vm._m(6, true),
                      ])
                    }),
                    0
                  ),
                ]),
              ]
            ),
            _vm._v(" "),
            _vm._m(7),
            _vm._v(" "),
            _vm._m(8),
          ]),
    ],
    2
  )
}
var UserListvue_type_template_id_9393a1dc_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("td", [
      _c(
        "span",
        {
          staticClass:
            "bg-lightest hover-bg-light active-bg-gray padding-x-12 padding-y-4 fw-normal rounded-4 cursor-pointer",
        },
        [_vm._v("...")]
      ),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", { attrs: { role: "row" } }, [
        _c("th", { staticClass: "th-shrink" }, [
          _c("span", {
            staticClass: "skeleton rounded-4 height-24px width-32px",
          }),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "th-expand" }, [
          _c("span", {
            staticClass: "skeleton rounded-4 height-24px width-96px",
          }),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "th-shrink" }, [
          _c("span", {
            staticClass: "skeleton rounded-4 height-24px width-96px",
          }),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "th-shrink" }, [
          _c("span", {
            staticClass: "skeleton rounded-4 height-24px width-96px",
          }),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "th-shrink" }, [
          _c("span", {
            staticClass: "skeleton rounded-4 height-24px width-96px",
          }),
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "th-shrink" }, [
          _c("span", {
            staticClass: "skeleton rounded-4 height-24px width-96px",
          }),
        ]),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("td", { staticClass: "th-shrink" }, [
      _c("span", { staticClass: "skeleton rounded-4 height-24px width-24px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("td", { staticClass: "th-shrink" }, [
      _c("span", { staticClass: "skeleton rounded-4 height-24px width-60px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("td", { staticClass: "th-shrink" }, [
      _c("span", { staticClass: "skeleton rounded-4 height-24px width-60px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("td", { staticClass: "th-shrink" }, [
      _c("span", { staticClass: "skeleton rounded-4 height-24px width-60px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("td", { staticClass: "th-shrink" }, [
      _c("span", { staticClass: "skeleton rounded-4 height-24px width-60px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass:
          "margin-bottom-20 margin-bottom-24-sm flex flex-justify-between flex-justify-center-sm flex-items-center",
      },
      [
        _c("div", [
          _c("div", {
            staticClass: "skeleton rounded-4 width-96px height-24px",
          }),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "hidden-sm flex flex-items-center" }, [
          _c("div", {
            staticClass:
              "skeleton rounded-4 margin-left-12 height-24px width-28px",
          }),
          _vm._v(" "),
          _c("div", {
            staticClass:
              "skeleton rounded-4 margin-left-12 height-36px width-32px",
          }),
          _vm._v(" "),
          _c("div", {
            staticClass:
              "skeleton rounded-4 margin-left-12 height-24px width-76px",
          }),
        ]),
      ]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "hidden-sm-greater flex flex-justify-between" },
      [
        _c("div", {
          staticClass: "skeleton rounded-4 height-40px fill margin-right-8",
        }),
        _vm._v(" "),
        _c("div", {
          staticClass: "skeleton rounded-4 height-40px fill margin-left-8",
        }),
      ]
    )
  },
]
UserListvue_type_template_id_9393a1dc_render._withStripped = true


;// CONCATENATED MODULE: ./src/pages-vue/user/UserList.vue?vue&type=template&id=9393a1dc&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.search.js
var es_string_search = __webpack_require__(4765);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.sort.js
var es_array_sort = __webpack_require__(2707);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.map.js
var es_array_map = __webpack_require__(1249);
;// CONCATENATED MODULE: ./src/utils/queryData.js





function queryData_queryData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      _ref$filterFunctions = _ref.filterFunctions,
      filterFunctions = _ref$filterFunctions === void 0 ? [] : _ref$filterFunctions,
      _ref$sortFunctions = _ref.sortFunctions,
      sortFunctions = _ref$sortFunctions === void 0 ? [] : _ref$sortFunctions,
      _ref$totalDataPerPage = _ref.totalDataPerPage,
      totalDataPerPage = _ref$totalDataPerPage === void 0 ? null : _ref$totalDataPerPage,
      _ref$currentPage = _ref.currentPage,
      currentPage = _ref$currentPage === void 0 ? 1 : _ref$currentPage;

  if (totalDataPerPage === null) {
    totalDataPerPage = data.length;
  }

  var returnedData = data && data.slice();
  filterFunctions.map(function (filterFunction) {
    returnedData = returnedData && returnedData.filter(function (row) {
      return filterFunction(row);
    });
  });
  sortFunctions.map(function (sortFunction) {
    returnedData = returnedData && returnedData.sort(sortFunction);
  });
  return returnedData ? returnedData.slice((currentPage - 1) * totalDataPerPage, currentPage * totalDataPerPage) : returnedData;
}
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/user/UserList.vue?vue&type=script&lang=js&










function UserListvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function UserListvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { UserListvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { UserListvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
//
//
//


/* harmony default export */ var UserListvue_type_script_lang_js_ = ({
  name: 'UserList',
  data: function data() {
    return {
      error: {
        object: null,
        title: '',
        message: '',
        showLoading: false
      },
      loading: true,
      table: {
        data: null,
        totalDataPerPage: 5,
        currentPage: 1
      },
      search: {
        name: '',
        email: ''
      },
      sort: {
        column: null,
        order: 'none' // 'ascending', 'descending'

      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    return UserListvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.fetchData();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {
    filteredData: function filteredData() {
      var _this2 = this;

      return this.table.data && queryData_queryData(this.table.data, {
        filterFunctions: function () {
          var functions = [];

          if (_this2.search.name) {
            functions.push(function (row) {
              return row.name.match(_this2.search.name);
            });
          }

          if (_this2.search.email) {
            functions.push(function (row) {
              return row.email.match(_this2.search.email);
            });
          }

          return functions;
        }()
      });
    },
    queryData: function queryData() {
      var _this3 = this;

      return this.table.data && queryData_queryData(this.table.data, {
        filterFunctions: function () {
          var functions = [];

          if (_this3.search.name) {
            functions.push(function (row) {
              return row.name.match(_this3.search.name);
            });
          }

          if (_this3.search.email) {
            functions.push(function (row) {
              return row.email.match(_this3.search.email);
            });
          }

          return functions;
        }(),
        sortFunctions: function () {
          var functions = [];

          if (_this3.sort.column) {
            functions.push(function (row1, row2) {
              return row1[_this3.sort.column] > row2[_this3.sort.column] && _this3.sort.order === 'ascending' ? 1 : -1;
            });
          }

          return functions;
        }(),
        totalDataPerPage: this.table.totalDataPerPage,
        currentPage: this.table.currentPage
      });
    },
    pageButtons: function pageButtons() {
      var first = 1,
          second = this.totalPage >= 2 ? 2 : null,
          third = this.totalPage >= 3 ? 3 : null,
          fourth = this.totalPage >= 4 ? 4 : null,
          fifth = this.totalPage >= 5 ? 5 : null;

      if (this.totalPage > 5) {
        if (this.table.currentPage <= 3) {
          fourth = -1;
          fifth = this.totalPage;
        } else if (this.table.currentPage > this.totalPage - 3) {
          second = -1;
          third = this.totalPage - 2;
          fourth = this.totalPage - 1;
          fifth = this.totalPage;
        } else {
          second = -1;
          third = this.table.currentPage;
          fourth = -1;
          fifth = this.totalPage;
        }
      }

      return [first, second, third, fourth, fifth].filter(Boolean);
    },
    totalPage: function totalPage() {
      console.log(this.filteredData);
      return this.filteredData ? Math.ceil(this.filteredData.length / this.table.totalDataPerPage) : 0;
    }
  },
  methods: {
    fetchData: function fetchData() {
      var _this4 = this;

      this.loading = true;

      var handleError = function handleError(error) {
        _this4.error = error;
        _this4.loading = false;
      };

      utils_api.retry({
        beforeRetry: handleError
      }).get("users").then(function (response) {
        // this.table.data = response.data.filter((data, index) => index < 23);
        // this.table.data = [...this.table.data, ...this.table.data];
        this.table.data = response.data;
        this.error = null;
        this.loading = false;
      }.bind(this)).catch(this.handleError);
    },
    toggleSort: function toggleSort(column) {
      var order = 'ascending';

      if (this.sort.column === column) {
        if (this.sort.order === 'none') {
          order = 'ascending';
        } else if (this.sort.order === 'ascending') {
          order = 'descending';
        } else {
          column = null;
          order = 'none';
        }
      }

      this.sort.column = column;
      this.sort.order = order;
    }
  }
});
;// CONCATENATED MODULE: ./src/pages-vue/user/UserList.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_UserListvue_type_script_lang_js_ = (UserListvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/pages-vue/user/UserList.vue





/* normalize component */
;
var UserList_component = (0,componentNormalizer/* default */.Z)(
  user_UserListvue_type_script_lang_js_,
  UserListvue_type_template_id_9393a1dc_render,
  UserListvue_type_template_id_9393a1dc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var UserList_api; }
UserList_component.options.__file = "src/pages-vue/user/UserList.vue"
/* harmony default export */ var UserList = (UserList_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/user/UserDatatables.vue?vue&type=template&id=3c4acf83&
var UserDatatablesvue_type_template_id_3c4acf83_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("h3", { staticClass: "fw-600 margin-bottom-16" }, [
        _vm._v("Manage user data"),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "text-grayest margin-bottom-24" }, [
        _vm._v(
          "All the data here are stored on mockapi.io, so shout out to them for providing such a cool service!"
        ),
      ]),
      _vm._v(" "),
      !_vm.loading
        ? _c("datatable", {
            staticClass: "table table-compact",
            attrs: {
              columns: _vm.table.columns,
              data: _vm.table.data,
              options: _vm.table.options,
              "page-length": _vm.table.pageLength,
            },
            on: { draw: _vm.everyDraw },
          })
        : _c("div", [
            _c(
              "div",
              {
                staticClass:
                  "bg-white rounded-8 shadow-1 padding-24 margin-bottom-16",
              },
              [
                _c(
                  "table",
                  {
                    staticClass: "table table-compact dataTable no-footer",
                    attrs: {
                      id: "DataTables_Table_0",
                      "aria-describedby": "DataTables_Table_0_info",
                      role: "grid",
                    },
                  },
                  [
                    _c("thead", [
                      _c("tr", { attrs: { role: "row" } }, [
                        _c("th", { staticClass: "th-shrink" }, [
                          _c("span", {
                            staticClass:
                              "skeleton rounded-4 height-24px width-32px",
                          }),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-expand" }, [
                          _c("span", {
                            staticClass:
                              "skeleton rounded-4 height-24px width-96px",
                          }),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-shrink" }, [
                          _c("span", {
                            staticClass:
                              "skeleton rounded-4 height-24px width-96px",
                          }),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-shrink" }, [
                          _c("span", {
                            staticClass:
                              "skeleton rounded-4 height-24px width-96px",
                          }),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-shrink" }, [
                          _c("span", {
                            staticClass:
                              "skeleton rounded-4 height-24px width-96px",
                          }),
                        ]),
                        _vm._v(" "),
                        _c("th", { staticClass: "th-shrink" }, [
                          _c("span", {
                            staticClass:
                              "skeleton rounded-4 height-24px width-96px",
                          }),
                        ]),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c(
                      "tbody",
                      _vm._l([0, 1, 2, 3], function (i) {
                        return _c("tr", { key: i }, [
                          _c("td", { staticClass: "th-shrink" }, [
                            _c("span", {
                              staticClass:
                                "skeleton rounded-4 height-24px width-24px",
                            }),
                          ]),
                          _vm._v(" "),
                          _c("td", { staticClass: "th-expand" }, [
                            _c("span", {
                              staticClass: "skeleton rounded-4 height-24px",
                              style: {
                                width:
                                  Math.floor(
                                    Math.random() * (400 - 140 + 1) + 140
                                  ) + "px",
                              },
                            }),
                          ]),
                          _vm._v(" "),
                          _c("td", { staticClass: "th-shrink" }, [
                            _c("span", {
                              staticClass:
                                "skeleton rounded-4 height-24px width-60px",
                            }),
                          ]),
                          _vm._v(" "),
                          _c("td", { staticClass: "th-shrink" }, [
                            _c("span", {
                              staticClass:
                                "skeleton rounded-4 height-24px width-60px",
                            }),
                          ]),
                          _vm._v(" "),
                          _c("td", { staticClass: "th-shrink" }, [
                            _c("span", {
                              staticClass:
                                "skeleton rounded-4 height-24px width-60px",
                            }),
                          ]),
                          _vm._v(" "),
                          _c("td", { staticClass: "th-shrink" }, [
                            _c("span", {
                              staticClass:
                                "skeleton rounded-4 height-24px width-60px",
                            }),
                          ]),
                        ])
                      }),
                      0
                    ),
                  ]
                ),
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass:
                  "margin-bottom-20 margin-bottom-24-sm flex flex-justify-between flex-justify-center-sm",
              },
              [
                _c("div", [
                  _c("div", {
                    staticClass: "skeleton rounded-4 width-96px height-24px",
                  }),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "hidden-sm flex flex-items-center" }, [
                  _c("div", {
                    staticClass:
                      "skeleton rounded-4 margin-left-12 height-24px width-28px",
                  }),
                  _vm._v(" "),
                  _c("div", {
                    staticClass:
                      "skeleton rounded-4 margin-left-12 height-36px width-32px",
                  }),
                  _vm._v(" "),
                  _c("div", {
                    staticClass:
                      "skeleton rounded-4 margin-left-12 height-24px width-76px",
                  }),
                ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "hidden-sm-greater flex flex-justify-between" },
              [
                _c("div", {
                  staticClass:
                    "skeleton rounded-4 height-40px fill margin-right-8",
                }),
                _vm._v(" "),
                _c("div", {
                  staticClass:
                    "skeleton rounded-4 height-40px fill margin-left-8",
                }),
              ]
            ),
          ]),
    ],
    1
  )
}
var UserDatatablesvue_type_template_id_3c4acf83_staticRenderFns = []
UserDatatablesvue_type_template_id_3c4acf83_render._withStripped = true


;// CONCATENATED MODULE: ./src/pages-vue/user/UserDatatables.vue?vue&type=template&id=3c4acf83&

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(9755);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./node_modules/toastr/toastr.js
var toastr = __webpack_require__(8901);
var toastr_default = /*#__PURE__*/__webpack_require__.n(toastr);
;// CONCATENATED MODULE: ./src/utils/toast.js



var toast = function (toastr) {
  var getContent = function getContent(title, description) {
    return "<div class=\"bg-white rounded-4 shadow-2 padding-x-24 padding-y-12\">\n        ".concat(title ? '<div class="fw-bold">' + title + '</div>' : '', "\n        ").concat(description ? '<div class="text-grayer">' + description + '</div>' : '', "\n    </div>");
  };

  var options = {
    containerId: 'toast-container',
    toastClass: 'toast',
    tapToDismiss: false,
    debug: false,
    showMethod: 'fadeIn',
    //fadeIn, slideDown, and show are built into jQuery
    showDuration: 300,
    showEasing: 'swing',
    //swing and linear are built into jQuery
    onShown: undefined,
    hideMethod: 'fadeOut',
    hideDuration: 300,
    hideEasing: 'swing',
    onHidden: undefined,
    closeMethod: false,
    closeDuration: false,
    closeEasing: false,
    closeOnHover: true,
    extendedTimeOut: 100,
    iconClasses: {
      info: '_'
    },
    positionClass: 'toast-top-center',
    timeOut: 2000,
    // Set timeOut and extendedTimeOut to 0 to make it sticky
    titleClass: null,
    messageClass: null,
    escapeHtml: false,
    target: 'body',
    newestOnTop: true,
    preventDuplicates: false,
    progressBar: false,
    rtl: false
  };
  return {
    show: function show(title, description) {
      toastr.options = options;
      toastr.info(getContent(title, description));
    }
  };
}((toastr_default()));

/* harmony default export */ var utils_toast = (toast);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Datatables.vue?vue&type=template&id=45affd66&
var Datatablesvue_type_template_id_45affd66_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("table")
}
var Datatablesvue_type_template_id_45affd66_staticRenderFns = []
Datatablesvue_type_template_id_45affd66_render._withStripped = true


;// CONCATENATED MODULE: ./src/components-vue/Datatables.vue?vue&type=template&id=45affd66&

// EXTERNAL MODULE: ./node_modules/datatables/media/js/jquery.dataTables.js
var jquery_dataTables = __webpack_require__(2083);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components-vue/Datatables.vue?vue&type=script&lang=js&
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }



function Datatablesvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Datatablesvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Datatablesvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Datatablesvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }











//
//
//
//


/* harmony default export */ var Datatablesvue_type_script_lang_js_ = ({
  name: 'Datatables',
  props: {
    columns: {
      type: Array,
      default: []
    },
    data: {
      type: Array,
      default: null
    },
    options: {
      type: Object,
      default: {}
    },
    pageLength: {
      type: Number,
      default: 10
    }
  },
  data: function data() {
    return {
      datatable: null
    };
  },
  created: function created() {
    return Datatablesvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              (jquery_default()).fn.dataTableExt.oStdClasses.sInfo = 'dataTables_info fw-500 text-gray';
              (jquery_default()).fn.dataTableExt.oStdClasses.sPaging = 'pagination ';
              (jquery_default()).fn.dataTableExt.oStdClasses.sPageButton = 'page-item';
              (jquery_default()).fn.dataTableExt.oStdClasses.sPageButtonActive = 'active';
              (jquery_default()).fn.dataTableExt.oStdClasses.sPageButtonDisabled = 'disabled';
              (jquery_default()).fn.dataTableExt.pager.numbers_length = 5;
              (jquery_default()).fn.dataTable.defaults.oLanguage.sInfo = "_START_-_END_ of _TOTAL_<span class=\"hidden-sm-greater\"> | Page _PAGE_ of _PAGES_</span>";
              (jquery_default()).fn.dataTable.defaults.oLanguage.oPaginate.sPrevious = "\n        <div class=\"flex flex-items-center hidden-sm\">\n          <i class=\"icon-chevron-left icon-16 margin-right-4\"></i>\n          Prev\n        <div>\n      ";
              (jquery_default()).fn.dataTable.defaults.oLanguage.oPaginate.sNext = "\n        <div class=\"flex flex-items-center hidden-sm\">\n          Next\n          <i class=\"icon-chevron-right icon-16 margin-left-4\"></i>\n        <div>\n      ";

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  mounted: function mounted() {
    var _this = this;

    return Datatablesvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (_this.data != null) {
                _this.render();
              } // todo: make sure what is this for


              _this.$on("datatable.page.change", function (e) {
                if (this.datatable) {
                  var pageInfo = this.datatable.page.info();
                  console.log('datatable.page.change');

                  if (e.page > 0 && pageInfo.page !== e.page - 1) {
                    console.log('datatable.page.change redraw?');
                    this.datatable.page(e.page - 1).draw("page");
                  }
                }
              }.bind(_this));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  methods: {
    render: function render() {
      var displayStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      // todo: create example of ajax
      if (_typeof(this.options.ajax) === "object" && !this.options.ajax.data) {
        this.options.ajax.data = function (params) {
          return {
            page: params.start / params.length + 1,
            per: params.length
          };
        };
      }

      if (jquery_default().fn.DataTable.isDataTable(this.$el)) {
        jquery_default()(this.$el).DataTable().clear().destroy();
        jquery_default()(this.$el).empty();
      }

      this.datatable = jquery_default()(this.$el).DataTable({
        ajax: this.options.ajax ? this.options.ajax : null,
        autoWidth: false,
        columns: this.columns,
        createdRow: typeof this.options.createdRow === "function" ? this.options.createdRow : null,
        data: this.options.ajax ? null : this.data,
        deferRender: true,
        destroy: true,
        displayStart: displayStart,
        // <".control margin-bottom-20 flex flex-justify-between"i<".hidden-sm"p>>
        dom: "\n          <\".bg-white rounded-8 shadow-1 padding-24 margin-bottom-16\"rt>\n          <\".control margin-bottom-20 flex flex-justify-between flex-justify-center-sm\"<\".hidden-sm\"i>p>\n          <\".control hidden-sm-greater flex flex-justify-between\"\n            <\".button button-primary fill margin-right-8\">\n            <\".button button-primary fill margin-left-8\">\n          >\n        ",
        preDrawCallback: function preDrawCallback(settings) {
          var api = new (jquery_default()).fn.dataTable.Api(settings);
          jquery_default()(this).closest('.dataTables_wrapper').find('.control').toggleClass('hidden', api.page.info().pages <= 1);
        },
        pageLength: this.pageLength,
        serverSide: !!this.options.ajax,
        ordering: true
      });
      this.datatable.off("draw").on("draw", function (e) {
        this.$emit("draw", {
          datatable: this.datatable,
          drawEvent: e,
          pageInfo: this.datatable.page.info()
        });

        if (jquery_default()('.page-item.previous').hasClass('disabled')) {
          jquery_default()('.button.margin-right-8').addClass('disabled');
        } else {
          jquery_default()('.button.margin-right-8').removeClass('disabled');
        }

        if (jquery_default()('.page-item.next').hasClass('disabled')) {
          jquery_default()('.button.margin-left-8').addClass('disabled');
        } else {
          jquery_default()('.button.margin-left-8').removeClass('disabled');
        }

        jquery_default()('.vue-element', this.$el).each(function (i, ele) {
          this.$nextTick(function () {
            new Vue({
              el: ele
            });
          });
        }.bind(this));
      }.bind(this));
      jquery_default()('.button.margin-right-8').html('Prev').click(function (e) {
        this.datatable.page('previous').draw('page');
      }.bind(this));
      jquery_default()('.button.margin-left-8').html('Next').click(function (e) {
        this.datatable.page('next').draw('page');
      }.bind(this));
    }
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler: function handler() {
        if (this.data != null) {
          this.render();
        }
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/components-vue/Datatables.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_vue_Datatablesvue_type_script_lang_js_ = (Datatablesvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components-vue/Datatables.vue





/* normalize component */
;
var Datatables_component = (0,componentNormalizer/* default */.Z)(
  components_vue_Datatablesvue_type_script_lang_js_,
  Datatablesvue_type_template_id_45affd66_render,
  Datatablesvue_type_template_id_45affd66_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Datatables_api; }
Datatables_component.options.__file = "src/components-vue/Datatables.vue"
/* harmony default export */ var Datatables = (Datatables_component.exports);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/user/UserDatatables.vue?vue&type=script&lang=js&






function UserDatatablesvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function UserDatatablesvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { UserDatatablesvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { UserDatatablesvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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




/* harmony default export */ var UserDatatablesvue_type_script_lang_js_ = ({
  name: 'UserDatatables',
  components: {
    datatable: Datatables
  },
  data: function data() {
    return {
      error: null,
      loading: false,
      table: {
        columns: null,
        data: null,
        options: {},
        pageInfo: null,
        pageLength: 5
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    return UserDatatablesvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.fetchData();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {
    tableColumns: function tableColumns() {
      return [{
        data: function data(_data) {
          return _data.id;
        },
        title: "<span class='fw-600'>#</span>",
        className: "th-shrink",
        render: function (value, type, data) {
          return "".concat(value);
        }.bind(this)
      }, {
        data: "name",
        title: "Name",
        className: "text-left th-expand"
      }, {
        data: "email",
        title: "Email",
        className: "text-left th-expand"
      }, {
        data: "password",
        title: "Password",
        className: "th-shrink",
        render: function (value, type, data) {
          return "<span class=\"text-nowrap\">".concat(value, "</span>");
        }.bind(this)
      }].filter(Boolean);
    }
  },
  methods: {
    fetchData: function fetchData() {
      var _this2 = this;

      this.loading = true;

      var handleError = function handleError(error) {
        _this2.error = error;
        _this2.loading = false;
      };

      utils_api.retry({
        beforeRetry: handleError
      }).get("users").then(function (response) {
        this.table.columns = this.tableColumns;
        this.table.data = response.data.map(function (user) {
          return user;
        }.bind(this));
        this.table.options = {
          createdRow: function (trEl, data) {
            var $trEl = jquery_default()(trEl); // console.log("createdRow: ")
            // console.log("$trEl: ", $trEl)
            // console.log("data: ", data)
          }.bind(this)
        };
        this.error = null;
        this.loading = false;
      }.bind(this)).catch(this.handleError);
    },
    everyDraw: function everyDraw(e) {
      this.table.pageInfo = e.pageInfo;
    }
  },
  watch: {
    $props: {
      deep: true,
      handler: function handler() {
        this.fetchData();
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/pages-vue/user/UserDatatables.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_UserDatatablesvue_type_script_lang_js_ = (UserDatatablesvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/pages-vue/user/UserDatatables.vue





/* normalize component */
;
var UserDatatables_component = (0,componentNormalizer/* default */.Z)(
  user_UserDatatablesvue_type_script_lang_js_,
  UserDatatablesvue_type_template_id_3c4acf83_render,
  UserDatatablesvue_type_template_id_3c4acf83_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var UserDatatables_api; }
UserDatatables_component.options.__file = "src/pages-vue/user/UserDatatables.vue"
/* harmony default export */ var UserDatatables = (UserDatatables_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/user/UserForm.vue?vue&type=template&id=fb85ef90&
var UserFormvue_type_template_id_fb85ef90_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "h3",
      { staticClass: "fw-600 margin-bottom-16" },
      [
        _vm.id
          ? [_vm._v("\n      Edit user data\n    ")]
          : [_vm._v("\n      Submit user data\n    ")],
      ],
      2
    ),
    _vm._v(" "),
    _c("div", { staticClass: "text-grayest margin-bottom-24" }, [
      _vm._v(
        "Data is stored on mockapi.io, so shout out to them for providing such a cool service!"
      ),
    ]),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass:
          "relative bg-white rounded-8 shadow-1 padding-24 margin-bottom-16",
      },
      [
        _c(
          "div",
          {
            staticClass: "margin-bottom-24",
            class: {
              "has-error": Object.values(this.validationStates.name).includes(
                false
              ),
            },
          },
          [
            _c("label", { staticClass: "form-label" }, [_vm._v("Name")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.user.name,
                  expression: "user.name",
                },
              ],
              staticClass: "form-text",
              attrs: { type: "text" },
              domProps: { value: _vm.user.name },
              on: {
                blur: function ($event) {
                  return _vm.validateName($event)
                },
                input: function ($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.user, "name", $event.target.value)
                },
              },
            }),
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "margin-bottom-24",
            class: {
              "has-error": Object.values(this.validationStates.email).includes(
                false
              ),
            },
          },
          [
            _c("label", { staticClass: "form-label" }, [_vm._v("Email")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.user.email,
                  expression: "user.email",
                },
              ],
              staticClass: "form-text",
              attrs: { type: "text" },
              domProps: { value: _vm.user.email },
              on: {
                blur: function ($event) {
                  return _vm.validateEmail($event)
                },
                input: function ($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.user, "email", $event.target.value)
                },
              },
            }),
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "margin-bottom-24",
            class: {
              "has-error": Object.values(
                this.validationStates.password
              ).includes(false),
            },
          },
          [
            _c("label", { staticClass: "form-label" }, [_vm._v("Password")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.user.password,
                  expression: "user.password",
                },
              ],
              staticClass: "form-text",
              attrs: { type: "password" },
              domProps: { value: _vm.user.password },
              on: {
                blur: function ($event) {
                  return _vm.validatePassword($event)
                },
                input: function ($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.user, "password", $event.target.value)
                },
              },
            }),
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "margin-bottom-12" }, [
          _c(
            "button",
            {
              staticClass: "button button-primary",
              attrs: { disabled: !_vm.canSubmit },
              on: { click: _vm.submit },
            },
            [_vm._v("\n        Submit\n      ")]
          ),
        ]),
        _vm._v(" "),
        _vm.loading.fetchData
          ? _c(
              "div",
              {
                staticClass:
                  "absolute width-100 height-100 top-0 left-0 bg-white padding-24",
              },
              [
                _vm._m(0),
                _vm._v(" "),
                _vm._m(1),
                _vm._v(" "),
                _vm._m(2),
                _vm._v(" "),
                _vm._m(3),
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.loading.submit ? _c("loading") : _vm._e(),
        _vm._v(" "),
        _vm.error.title
          ? _c("error", {
              attrs: {
                title: _vm.error.title,
                message: _vm.error.message,
                showLoading: _vm.error.showLoading,
                inlineDisplay: false,
              },
            })
          : _vm._e(),
      ],
      1
    ),
  ])
}
var UserFormvue_type_template_id_fb85ef90_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "margin-bottom-24" }, [
      _c("div", {
        staticClass:
          "skeleton rounded-4 width-60px height-24px margin-bottom-12",
      }),
      _vm._v(" "),
      _c("div", { staticClass: "skeleton rounded-4 width-100 height-40px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "margin-bottom-24" }, [
      _c("div", {
        staticClass:
          "skeleton rounded-4 width-60px height-24px margin-bottom-12",
      }),
      _vm._v(" "),
      _c("div", { staticClass: "skeleton rounded-4 width-100 height-40px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "margin-bottom-24" }, [
      _c("div", {
        staticClass:
          "skeleton rounded-4 width-60px height-24px margin-bottom-12",
      }),
      _vm._v(" "),
      _c("div", { staticClass: "skeleton rounded-4 width-100 height-40px" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "margin-bottom-12" }, [
      _c("div", { staticClass: "skeleton rounded-4 width-96px height-40px" }),
    ])
  },
]
UserFormvue_type_template_id_fb85ef90_render._withStripped = true


;// CONCATENATED MODULE: ./src/pages-vue/user/UserForm.vue?vue&type=template&id=fb85ef90&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.values.js
var es_object_values = __webpack_require__(2479);
// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(6486);
var lodash_default = /*#__PURE__*/__webpack_require__.n(lodash);
;// CONCATENATED MODULE: ./src/utils/debounce.js


var debounceValidation = lodash_default().debounce(function (callback) {
  callback();
}, 1000);


;// CONCATENATED MODULE: ./src/utils/regex.js
var isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/pages-vue/user/UserForm.vue?vue&type=script&lang=js&
function UserFormvue_type_script_lang_js_slicedToArray(arr, i) { return UserFormvue_type_script_lang_js_arrayWithHoles(arr) || UserFormvue_type_script_lang_js_iterableToArrayLimit(arr, i) || UserFormvue_type_script_lang_js_unsupportedIterableToArray(arr, i) || UserFormvue_type_script_lang_js_nonIterableRest(); }

function UserFormvue_type_script_lang_js_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function UserFormvue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return UserFormvue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return UserFormvue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function UserFormvue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function UserFormvue_type_script_lang_js_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function UserFormvue_type_script_lang_js_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
















function UserFormvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function UserFormvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { UserFormvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { UserFormvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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







/* harmony default export */ var UserFormvue_type_script_lang_js_ = ({
  name: 'UserForm',
  components: {
    error: Error,
    loading: Loading
  },
  data: function data() {
    return {
      error: {
        object: null,
        title: "",
        message: "",
        showLoading: false
      },
      loading: {
        fetchData: false,
        submit: false
      },
      id: null,
      user: {
        name: "",
        email: "",
        password: ""
      },
      errorMessages: {
        name: {
          isNotBlank: 'Field can\'t be empty'
        },
        email: {
          isValidEmail: 'Invalid email format',
          isNotBlank: 'Field can\'t be empty'
        },
        password: {
          isNotBlank: 'Field can\'t be empty'
        }
      },
      validationStates: {
        name: {
          isNotBlank: null
        },
        email: {
          isValidEmail: null,
          isNotBlank: null
        },
        password: {
          isNotBlank: null
        }
      },
      state: {
        enableValidationOnWatch: true
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    return UserFormvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.id = _this.$route.params.id;

              if (_this.id) {
                _this.fetchData();
              }

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {
    canSubmit: function canSubmit() {
      return Object.values(this.validationStates.name).every(function (value) {
        return value;
      }) && Object.values(this.validationStates.email).every(function (value) {
        return value;
      }) && Object.values(this.validationStates.password).every(function (value) {
        return value;
      });
    }
  },
  methods: {
    fetchData: function fetchData() {
      this.loading.fetchData = true;

      var catchError = function catchError(error) {
        if (error) {
          this.error.object = error;

          var _handleError = handleError(error);

          var _handleError2 = UserFormvue_type_script_lang_js_slicedToArray(_handleError, 3);

          this.error.title = _handleError2[0];
          this.error.message = _handleError2[1];
          this.error.showLoading = _handleError2[2];
        }

        this.loading.fetchData = false;
      };

      utils_api.retry({
        beforeRetry: catchError
      }).get("users/".concat(this.id)).then(function (response) {
        this.user = response.data;
        this.error.object = null;
        this.loading.fetchData = false;
      }.bind(this)).catch(catchError.bind(this));
    },
    resetForm: function resetForm() {
      this.state.enableValidationOnWatch = false;
      this.user.name = "";
      this.user.email = "";
      this.user.password = "";
      this.validationStates.name.isNotBlank = null;
      this.validationStates.email.isValidEmail = null;
      this.validationStates.email.isNotBlank = null;
      this.validationStates.password.isNotBlank = null;

      _.debounce(function () {
        this.state.enableValidationOnWatch = true;
      }.bind(this), 100)();
    },
    submit: function submit() {
      this.loading.submit = true;

      var catchError = function catchError(error) {
        // todo: doesn't support disconnected internet
        if (error) {
          this.error.object = error;

          var _handleError3 = handleError(error);

          var _handleError4 = UserFormvue_type_script_lang_js_slicedToArray(_handleError3, 3);

          this.error.title = _handleError4[0];
          this.error.message = _handleError4[1];
          this.error.showLoading = _handleError4[2];
        }

        this.loading.submit = false;
      };

      if (this.id) {
        utils_api.retry({
          beforeRetry: catchError
        }).put("users/".concat(this.id), this.user).then(function (response) {
          this.error.object = null;
          this.loading.submit = false;
          utils_toast.show("User is edited", "You can check updated user on User list page");
        }.bind(this)).catch(catchError.bind(this));
      } else {
        utils_api.retry({
          beforeRetry: catchError
        }).post("users", this.user).then(function (response) {
          this.error.object = null;
          this.loading.submit = false;
          utils_toast.show("User is added", "You can check added user on User list page");
          this.resetForm();
        }.bind(this)).catch(catchError.bind(this));
      }
    },
    validateEmail: function validateEmail() {
      var $event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      // isValidEmail
      if (this.user.email) {
        if ($event && $event.type === 'blur') {
          this.validationStates.email.isValidEmail = isValidEmail.test(String(this.user.email).toLowerCase());
        } else {
          this.validationStates.email.isValidEmail = isValidEmail.test(String(this.user.email).toLowerCase()) ? true : null; // _.debounce can't be called directly here
          // looks like it's not 1 instance if not wrapped like this

          debounceValidation(function () {
            this.validationStates.email.isValidEmail = isValidEmail.test(String(this.user.email).toLowerCase());
          }.bind(this));
        }
      } else {
        this.validationStates.email.isValidEmail = null;
      } // isNotBlank


      this.validationStates.email.isNotBlank = !!this.user.email;
    },
    validateName: function validateName() {
      // isNotBlank
      this.validationStates.name.isNotBlank = !!this.user.name;
    },
    validatePassword: function validatePassword() {
      // isNotBlank
      this.validationStates.password.isNotBlank = !!this.user.password;
    }
  },
  watch: {
    "$route": function $route() {
      this.id = this.$route.params.id;

      if (this.id) {
        this.fetchData();
      } else {
        this.resetForm();
      }
    },
    "user.name": function userName() {
      this.state.enableValidationOnWatch && this.validateName();
    },
    "user.email": function userEmail() {
      this.state.enableValidationOnWatch && this.validateEmail();
    },
    "user.password": function userPassword() {
      this.state.enableValidationOnWatch && this.validatePassword();
    }
  }
});
;// CONCATENATED MODULE: ./src/pages-vue/user/UserForm.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_UserFormvue_type_script_lang_js_ = (UserFormvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/pages-vue/user/UserForm.vue





/* normalize component */
;
var UserForm_component = (0,componentNormalizer/* default */.Z)(
  user_UserFormvue_type_script_lang_js_,
  UserFormvue_type_template_id_fb85ef90_render,
  UserFormvue_type_template_id_fb85ef90_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var UserForm_api; }
UserForm_component.options.__file = "src/pages-vue/user/UserForm.vue"
/* harmony default export */ var UserForm = (UserForm_component.exports);
;// CONCATENATED MODULE: ./src/index-vue.js







function index_vue_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function index_vue_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { index_vue_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { index_vue_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }















vue_runtime_esm/* default.config.productionTip */.Z.config.productionTip = false;
vue_runtime_esm/* default.use */.Z.use(vue_router_esm/* default */.Z);
vue_runtime_esm/* default.prototype.$t */.Z.prototype.$t = utils_i18next.t;
vue_runtime_esm/* default.prototype.$url */.Z.prototype.$url = url; // function dynamicPropsFn (route) {
//   return {
//     msg: `${route.params.any} (${route.params.any.length} chars)`
//   };
// }

var router = new vue_router_esm/* default */.Z({
  mode: 'history',
  // base: __dirname,
  base: '/showcasing',
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    return savedPosition || {
      x: 0,
      y: 0
    };
  },
  routes: [{
    path: '/:lang',
    component: App,
    children: [{
      path: '',
      component: LayoutDefault,
      children: [{
        name: 'index',
        path: '',
        component: Index
      }]
    }, {
      path: '',
      component: LayoutBlank,
      children: [{
        name: 'login',
        path: 'login',
        component: Login,
        meta: {
          requireAuth: false
        }
      }, {
        name: '404',
        path: '404',
        component: ErrorPage,
        meta: {
          title: "404",
          description: "The page you are trying to access doesn't exist."
        }
      }]
    }, {
      name: 'user',
      path: 'user',
      component: LayoutDefault,
      meta: {
        requireAuth: true
      },
      children: [{
        name: 'user-index',
        path: '',
        component: UserList
      }, {
        name: 'user-datatables',
        path: 'datatables',
        component: UserDatatables
      }, {
        name: 'user-create',
        path: 'create',
        component: UserForm
      }, {
        name: 'user-update',
        path: 'update/:id',
        component: UserForm,
        props: true
      } // { path: '/:msg', component: Documentation, props: true },
      // { path: '/:any', components: {default: Documentation, footer: Document}, props: dynamicPropsFn,
      //   meta: { layout: () => import(/* webpackChunkName: 'layout' */ '@/layouts-vue/LayoutBlank.vue') },
      // },
      ]
    }, {
      path: ':any',
      component: ErrorPage,
      meta: {
        title: "404",
        description: "The page you are trying to access doesn't exist."
      }
    }]
  }, {
    path: '',
    beforeEnter: function beforeEnter(to, from, next) {
      next(url(''));
    }
  }]
});
router.beforeEach( /*#__PURE__*/function () {
  var _ref = index_vue_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(to, from, next) {
    var requireAuth;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (to.params.lang) {
              _context.next = 3;
              break;
            }

            next();
            return _context.abrupt("return");

          case 3:
            if (utils_i18next.options.supportedLngs.includes(to.params.lang)) {
              requireAuth = null;
              to.matched.forEach(function (route) {
                if ('requireAuth' in route.meta) {
                  requireAuth = route.meta.requireAuth;
                }
              });
              if (requireAuth === null) next();else {
                if (requireAuth && utils_auth.isLoggedIn()) {
                  next();
                } else if (requireAuth && !utils_auth.isLoggedIn()) {
                  next(url('/login'));
                } else if (!requireAuth && utils_auth.isLoggedIn()) {
                  next(from.fullPath); // doesn't work correctly yet
                } else if (!requireAuth && !utils_auth.isLoggedIn()) {
                  next();
                }
              }
            } else {
              next(url('/404'));
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
new vue_runtime_esm/* default */.Z({
  // el: '#app',
  router: router,
  render: function render(h) {
    return h(App);
  }
}).$mount('#app');

/***/ }),

/***/ 1039:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/img/loading5fa747a4.svg";

/***/ }),

/***/ 5119:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 2181:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var api = __webpack_require__(3379);
            var content = __webpack_require__(5119);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [216], function() { return __webpack_exec__(9763); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.6746f3d3.js.map