const _ = require('lodash');
const readline = require('readline');
const expressions = require('./lexical.json');

// 如果是终端执行，则进入交互程序
if(!module.parent){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '输入字符串（#结束）>'
    });
    
    rl.prompt();
    
    let inputStr = [];
    rl.on('line',line=>{
        let input = line.trim();
        inputStr.push(input);
        if(_.last(input) === '#'){
            rl.close();
            return;
        }
        rl.prompt();
    });
    
    rl.on('close',()=>{
        let str = _.join(inputStr,'');
        let result = analysis(str);
        console.log(result);
    });
}

let exp = '^' + _.sortBy(Object.keys(expressions['operator']),[item=>item.length]).reverse().map(v=>'\\'+v).join('|');

function realAnalysis(str){

    if(!!(matched = str.match(/^[A-Za-z][A-Za-z0-9]*/))){
        let matchedStr = matched[0];
        
        if(matchedStr in expressions['keyword']){
            return {
                token: matchedStr,
                code: expressions['keyword'][matchedStr]
            };
        }
        return {
            token: matchedStr,
            code: expressions['others']['id']
        }
    } else if(!!(matched = str.match(/^[0-9]+/))){
        let matchedStr = matched[0];
        return {
            token: matchedStr,
            code: expressions['others']['digit']
        }
    } else {
        if(!!(matched = str.match(new RegExp(exp)))){
            let matchedStr = matched[0];
            return {
                token: matchedStr,
                code: expressions['operator'][matchedStr]
            };
        }
        
        return {
            token: str,
            code: -1
        }
    }
}

function analysis(str){
    let splitedStr = _.split(str,/\s+/,-1); //按照空格进行分割

    let result = [];
    splitedStr.forEach((v,i) => {
        let str = v;

        while(str.length !== 0){
            let r = realAnalysis(str);
            result.push(r);
            str = str.slice(r.token.toString().length);
        }
    });
    return result;
}

module.exports = analysis;