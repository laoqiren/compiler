const {mktable,push,enter,getTop,setTop,pointer,addwidth} = require('./semanticsRules');

let T1 = {},
T2 = {},
T3 = {},
T4 = {};

let D0,
D1,
D2,
D3,
D4;

let id1 = {name: 'id1'},
id2 = {name: 'id2'},
id3 = {name: 'id3'};

let P,M

let tblptr = [], //指向外围过程符号表的指针
offset = []; //栈顶元素为下一个当前过程中局部对象可用的相对地址

// (1): {t=mktable(nil);push(t,tblptr);push(0,offset)}
let t = mktable(null);
push(t,tblptr);
push(0,offset);

// (2):
T1.type = 'real';
T1.width = 8;

// (3): {enter(top(tblptr),id1.name,T1.type,top(offset));top(offset)=top(offset)+T1.width)}
enter(getTop(tblptr),id1.name,T1.type,getTop(offset));
setTop(offset,getTop(offset)+T1.width);

// (4):
T3.type = 'integer';
T3.width = 4;

// (5):
T2.type = pointer(T3);
T2.width = 4;

// (6): {enter(top(tblptr),id2.name,T2.type,top(offset));top(offset)=top(offset)+T2.width)}
enter(getTop(tblptr),id2.name,T2.type,getTop(offset));
setTop(offset,getTop(offset)+T2.width);

//(7):
T4.type = 'integer';
T4.width = 4;

// (8): {enter(top(tblptr),id3.name,T4.type,top(offset));top(offset)=top(offset)+T4.width)}
enter(getTop(tblptr),id3.name,T4.type,getTop(offset));
setTop(offset,getTop(offset)+T4.width);

// (9): {addwidth(top(tblptr),top(offset));pop(tblptr);pop(offset)}
addwidth(getTop(tblptr),getTop(offset));
let symbolTable = tblptr.pop();
offset.pop();

console.log(symbolTable);