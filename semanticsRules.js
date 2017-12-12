const _ = require('lodash');

exports.mktable = function mktable(previos) {
    let table = [];
    return table;
}
exports.push = function push(t,stack){
    stack.push(t);
}
exports.getTop = function getTop(stack){
    return _.last(stack);
}
exports.setTop = function setTop(stack,value){
    stack.pop();
    stack.push(value);
}
exports.enter = function enter(table,name,type,offset){
    table.push({
        name,
        type,
        offset
    });
}
exports.pointer = function pointer(T){
    return T.type;
}
exports.addwidth = function addwidth(table,width){
    table.unshift(width);
}