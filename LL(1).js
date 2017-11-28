
const readline = require('readline');
const _ = require('lodash');
const lexical = require('./lexical');
const table = require('./syntactic.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '输入字符串（$结束）>'
});

rl.prompt();

let inputStr = [];
rl.on('line',line=>{
    let input = line.trim();
    inputStr.push(input);
    if(_.last(input) === '$'){
        rl.close();
        return;
    }
    rl.prompt();
});

rl.on('close',()=>{
    let str = _.initial(_.join(inputStr,'')).join('');
    let lexicalResult = lexical(str);   //调用词法分析器

    analysis(lexicalResult);
});


function analysis(lexicalResult){
    let tokens = lexicalResult.map(v=>v.token);
    let inputs = [...tokens,'$'];
    let stack = [Object.keys(table)[0],'$'];
    let isLegal = true;

    console.log(`stack: ${stack}  inputs: ${inputs.join('')}`);
    while(_.head(stack)!=='$'){
        let stackTop = stack.shift(),
            inputsTop = _.head(inputs);
        if(stackTop === inputsTop){
            inputs.shift();
            console.log(`stack: ${stack}  inputs: ${inputs.join('')}  匹配: ${inputsTop}`);
        } else if(tokens.indexOf(stackTop) !== -1 && stackTop !== inputsTop){
            console.error("error: 栈顶为终结符但与输入符号不匹配！弹出栈顶非终结符");
            isLegal = false;
        } else if(!table[stackTop][inputsTop]){
            console.error('error：预测分析表相应位置为空！忽略输入符号');
            inputs.shift();
            stack.unshift(stackTop);
            isLegal = false;
            console.log(`stack: ${stack}  inputs: ${inputs.join('')}`);
        } else if(table[stackTop][inputsTop] === 'synch'){
            console.log(`stack: ${stack}  inputs: ${inputs.join('')} 相应条目为synch,弹出栈顶符号`);
            isLegal = false;
        } else {
            let tableResult = table[stackTop][inputsTop];
            stack.unshift(...tableResult.split(''));
            if(_.head(stack) === '#'){
                stack.shift();
            }
            console.log(`stack: ${stack}  inputs: ${inputs.join('')}  输出: ${stackTop}=>${tableResult}`);
        }
    }
    if(!isLegal){
        return console.log('字符串不合法！');
    }
    console.log('字符串合法！');
}