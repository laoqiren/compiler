
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
    let inputs = [...tokens];
    let stack = [Object.keys(table)[0],'$'];
    let isLegal = true;

    console.log(`stack: ${stack}  inputs: ${inputs.join('')}`);
    while(_.head(stack)!=='$' && inputs.length!==0){
        let stackTop = stack.shift(),
            inputsTop = _.head(inputs);
        if(stackTop === inputsTop){
            inputs.shift();
            console.log(`stack: ${stack}  inputs: ${inputs.join('')}  匹配: ${inputsTop}`);
        } else if(tokens.indexOf(stackTop) !== -1){
            console.error("error: 栈顶不能为终结符！");
            isLegal = false;
            break;
        } else if(!table[stackTop][inputsTop]){
            console.error('error：预测分析表相应位置为报错条目！');
            isLegal = false;
            break;
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