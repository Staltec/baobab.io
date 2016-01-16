# Baobab.IO

## About module
Baobab.js with Socket.IO: Proof of concept.

Baobab tree data manipulation through socket response:
tree.set
tree.unset
tree.apply
tree.push
tree.unshift
tree.splice
tree.concat
tree.merge
tree.deepMerge


## Client-side usage

```js
    import BaobabIO from './common/baobab.io';

    const tree = new BaobabIO ({ });
    
    // Simple baobab set to branch 'users/list' 
    tree.set(['users', 'list'], []);
    
    
    // Send socket message to namespace '/users' and set response back to baobab tree branch 'users/list'  
    tree.io('/users')
        .emit('get list')
        .set(['users', 'list']);


    // One way send  
    tree.io()
        .emit('awesome message', 'awesome argument')
        .void();

```

## Server-side usage

```js
    ...
    var nsp = io.of('/users');

    nsp.on('connection', function(socket){
    
        nsp.on('get list', function(action, path){
            const socket = this;
            let data = [
                {id:1, name:'User One'},
                {id:2, name:'User Two'}
            ]
            
            socket.emit(action, path, data);
        });
        
    });
    ...
```

## Todo
```js
    // 1. Send action metadata as object (now it`s separated arguments)

    // 2. Promise style response 
    tree.io()
        .emit('awesome message', 'awesome argument')
        .then((data) => {...});
```
