import Baobab from "baobab";
import io from "socket.io-client";

const BAOBAB_MESSAGE_PREFIX = 'baobab:';

const BAOBAB_METHODS = [
    'set',
    'unset',
    'push',
    'unshift',
    'splice',
    'concat',
    'merge',
    'deepMerge'
];


class BaobabIO extends Baobab {

    constructor (initialData, opts) {
        super(initialData, opts);

        this.socket = io(window.location.origin);
        this.socket.on('reconnecting', () => this.set('_socketReconnecting', true) );
        this.socket.on('reconnect', () => this.set('_socketReconnecting', false) );
    }

    io (namespace = '/', opts) {
        let socket = this._namespaces && this._namespaces[namespace];

        if (!socket) {
            socket = io(window.location.origin + namespace, opts);

            BAOBAB_METHODS.forEach((method) => {
                socket.on(BAOBAB_MESSAGE_PREFIX + method, (...arg) => this[method](...arg));
        });

            if (!this._namespaces) this._namespaces = {};
            this._namespaces[namespace] = socket;
        }

        return {
            socket: socket,
            emit: (cmd, ...params) => {


                return BAOBAB_METHODS.reduce((memo, method) => {
                    memo[method] = (path) => socket.emit(cmd, BAOBAB_MESSAGE_PREFIX + method, path, ...params);
                    return memo;

                }, {
                    silent: () =>  socket.emit(cmd, ...params)
                });
            }
        }
    }

}


export default BaobabIO;