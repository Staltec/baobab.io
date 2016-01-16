"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baobab = require("baobab");

var _baobab2 = _interopRequireDefault(_baobab);

var _socket3 = require("socket.io-client");

var _socket4 = _interopRequireDefault(_socket3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BAOBAB_MESSAGE_PREFIX = 'baobab:';

var BAOBAB_METHODS = ['set', 'unset', 'push', 'unshift', 'splice', 'concat', 'merge', 'deepMerge'];

var BaobabIO = function (_Baobab) {
    _inherits(BaobabIO, _Baobab);

    function BaobabIO(initialData, opts) {
        _classCallCheck(this, BaobabIO);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaobabIO).call(this, initialData, opts));

        _this.socket = (0, _socket4.default)(window.location.origin);
        _this.socket.on('reconnecting', function () {
            return _this.set('_socketReconnecting', true);
        });
        _this.socket.on('reconnect', function () {
            return _this.set('_socketReconnecting', false);
        });
        return _this;
    }

    _createClass(BaobabIO, [{
        key: "io",
        value: function io() {
            var _this2 = this;

            var namespace = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
            var opts = arguments[1];

            var socket = this._namespaces && this._namespaces[namespace];

            if (!socket) {
                socket = (0, _socket4.default)(window.location.origin + namespace, opts);

                BAOBAB_METHODS.forEach(function (method) {
                    socket.on(BAOBAB_MESSAGE_PREFIX + method, function () {
                        return _this2[method].apply(_this2, arguments);
                    });
                });

                if (!this._namespaces) this._namespaces = {};
                this._namespaces[namespace] = socket;
            }

            return {
                socket: socket,
                emit: function emit(cmd) {
                    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        params[_key - 1] = arguments[_key];
                    }

                    return BAOBAB_METHODS.reduce(function (memo, method) {
                        memo[method] = function (path) {
                            var _socket;

                            return (_socket = socket).emit.apply(_socket, [cmd, BAOBAB_MESSAGE_PREFIX + method, path].concat(params));
                        };
                        return memo;
                    }, {
                        void: function _void() {
                            var _socket2;

                            return (_socket2 = socket).emit.apply(_socket2, [cmd].concat(params));
                        }
                    });
                }
            };
        }
    }]);

    return BaobabIO;
}(_baobab2.default);

exports.default = BaobabIO;
//# sourceMappingURL=index.js.map