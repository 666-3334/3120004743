// 对某一个需求的设计和修改

const fs = require('fs');
const readline = require('readline')
const lodash = require('lodash')
// indexOf() 方法只返回查找到的第一个子字符串的起始下标值，如果没有找到则返回 -1。

//把字符串数组变成对象数组
function strTobj(str) {
    let strLine = [];
    let stred = [];
    for (let i = 0; i < str.length; i++) {
        stred = str[i].split(':');
        strLine.push({
            name: stred[0],
            line: stred[1]
        })
    }
    return strLine;
}
// 根据对象数组，查找站名对应线路对象数组
function searchLine(obj, staName) {
    let t = [];
    for (let key in obj) {
        if (obj[key].line.includes(staName)) {
            t.push(obj[key]);
        };
    }
    return t;
}
// 传入线路name字符串，传出对应站名条line
function findSub(str) {
    let showLine = fs.readFileSync('./subway.txt', 'utf8');
    let subStr = showLine.split('\n');
    let strLine = strTobj(subStr);
    for (let i = 0; i < strLine.length; i++) {
        if (str === strLine[i].name) return strLine[i].line;
    }
    return null;
}
//在当前路线对象中找站点，找最后的站点是不是在该路线对象（name，line）中
function serachRountine(obj, lastStation) {
    let str = obj.line.split('=');
    for (let i = 0; i < str.length; i++) {
        if (str[i].includes(lastStation)) {
            return i;
        }
    }
    return -1;
}
//判断路线是否被检查
function isChecked(line, lineStr) {
    for (let i = 0; i < lineStr.length; i++) {
        if (lineStr[i] === line) return true
    }
    return false;
}


//传入对象数组,传出中转站名称和路线号，传入上一级查找的路线对象数组，前站和目标站，结果数组
function otherRountine(obj, out, purpose, result) {
    console.log(obj);//首站所在的线路对象数组
    let checkedLine = [];//记录检查过的路线
    checkedLine.push(obj[0].name);
    let strStation = [];
    let t = [];
    for (let i = 0; i < obj.length; i++) {
        t = obj[i].line.split('=');
        // console.log(t);
        for (let j = 0; j < t.length; j++) {
            if (t[j].indexOf('@') > 0) {
                if (t[j].split('@').length === 2) {
                    strStation.push({
                        changeStation: t[j].slice(0, t[j].indexOf('@')),
                        changeLine: t[j].slice(t[j].indexOf('@') + 1),
                        originLine: obj[i].name
                    })
                } else {
                    strStation.push({
                        changeStation: t[j].slice(0, t[j].indexOf('@')),
                        changeLine: t[j].slice(t[j].indexOf('@') + 1, t[j].lastIndexOf('@')),
                        originLine: obj[i].name
                    })
                    strStation.push({
                        changeStation: t[j].slice(0, t[j].indexOf('@')),
                        changeLine: t[j].slice(t[j].lastIndexOf('@') + 1),
                        originLine: obj[i].name
                    })
                }

            }
        }
    }
    console.log(strStation);//可换成的站

    let newLines = [];
    for (let i = 0; i < strStation.length; i++) {
        newLines.push({
            name: strStation[i].changeLine,
            line: findSub(strStation[i].changeLine)
        })
    }
    console.log(newLines);//可换乘的线对象

    for (let i = 0; i < newLines.length; i++) {
        checkedLine.push(newLines[i].name);
        if (serachRountine(newLines[i], purpose) !== -1) {
            //说明当前路线找到了,接下来是显示问题
            result.push({
                first: out,
                lsat: strStation[i].changeStation,
                line: strStation[i].originLine
            })
            result.push({
                first: strStation[i].changeStation,
                last: purpose,
                line: newLines[i].name
            })
            console.log('两线成');
            break;
        }
    }
    if (result.length === 0) {
        console.log('hai bu xing');
        obj = [];
        obj = newLines;
        newLines = [];
        t = [];
        strStation = [];
        for (let i = 0; i < obj.length; i++) {
            t = obj[i].line.split('=');
            // console.log(t);
            for (let j = 0; j < t.length; j++) {
                if (t[j].indexOf('@') > 0) {
                    if (t[j].split('@').length === 2) {
                        if (isChecked(t[j].slice(t[j].indexOf('@') + 1),checkedLine) == false) {
                            strStation.push({
                                changeStation: t[j].slice(0, t[j].indexOf('@')),
                                changeLine: t[j].slice(t[j].indexOf('@') + 1),
                                originLine: obj[i].name
                            })
                        }

                    } else {
                        if (isChecked(t[j].slice(t[j].indexOf('@') + 1, t[j].lastIndexOf('@')),checkedLine) == false) {
                            strStation.push({
                                changeStation: t[j].slice(0, t[j].indexOf('@')),
                                changeLine: t[j].slice(t[j].indexOf('@') + 1, t[j].lastIndexOf('@')),
                                originLine: obj[i].name
                            })
                        }
                        if (isChecked(t[j].slice(t[j].lastIndexOf('@') + 1),checkedLine) == false) {
                            strStation.push({
                                changeStation: t[j].slice(0, t[j].indexOf('@')),
                                changeLine: t[j].slice(t[j].lastIndexOf('@') + 1),
                                originLine: obj[i].name
                            })
                        }

                    }

                }
            }
        }
        console.log(strStation);//可换成的站
        for (let i = 0; i < strStation.length; i++) {
            newLines.push({
                name: strStation[i].changeLine,
                line: findSub(strStation[i].changeLine)
            })
        }
        console.log(newLines);//可换乘的线对象

        for (let i = 0; i < newLines.length; i++) {
            checkedLine.push(newLines[i].name);
            if (serachRountine(newLines[i], purpose) !== -1) {
                //说明当前路线找到了,接下来是显示问题
                
                console.log('duo线成');
                break;
            }
        }
    }
}
//新的算法思路
function Totalprogramer(firstStation,lastStation) {
    //let stations = [];//记录始站和中间站
    //let stationsOnLine = [];//记录站对应的路线
    let targetLine = [];//记录目标站所在的线
    let checkedLine = [];//记录已经检查过的线路
    
}
//显示结果，待完善
function showResult(res) {
    console.log(res);
}
function main() {
    const rl = readline.createInterface(process.stdin, process.stdout);
    rl.question('three: ', answer => {
        let lines = answer.split(' ');//把命令行输入分隔成字符串数组，给line
        if (lines.length === 7) {
            if (lines[0] === '-b') {
                //处理数据，获得路线
                let subMessage = fs.readFileSync('./subway.txt', 'utf-8');
                let subStr = subMessage.split('\n');//得到字符串数组
                subStr.pop();
                let subObj = strTobj(subStr);//得到对象数组
                let staLine = searchLine(subObj, lines[1]);//获得一个包含首站的多路线对象数组
                let result = [];
                for (let i = 0; i < staLine.length; i++) {
                    if (serachRountine(staLine[i], lines[2]) !== -1) {
                        result.push({
                            first: lines[1],
                            last: lines[2],
                            line: staLine[i].name
                        })
                        console.log('一线成');
                        break;
                    }
                }
                if (result.length !== 0) {
                    showResult(result);
                } else {
                    //接下来的问题所在
                    otherRountine(staLine, lines[1], lines[2], result);
                    showResult(result);
                }
            }
        } else {
            console.log('input error');
        }
        rl.close();
    })
}
main();



