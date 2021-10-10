//先暂时放置注释掉的



// var readlineSync = require('readline-sync');
// const readlineSync = require('readline-sync');
// // Wait for user's response.
// var userName = readlineSync.question('May I have your name? ');
// console.log('Hi ' + userName + '!');

// // Handle the secret text (e.g. password).
// var favFood = readlineSync.question('What is your favorite food? ', {
//   hideEchoBack: true // The typed text on screen is hidden by `*` (default).
// });
// console.log('Oh, ' + userName + ' loves ' + favFood + '!');

// let subMessage = fs.readFileSync('./subway.txt', 'utf8');
// // console.log(subMessage);
// let subStr = subMessage.split('\n');
// console.log(subStr);

// 遍历对象
// for (let key in subMessage) {
//     // console.log(key);
//     // console.log(subMessage[key]);
//     fs.appendFileSync('./subway.txt', key + ':' + subMessage[key] + '\n');
// }
// 获取命令行输入，输入中文时出现乱码？？？？
// let showLine = readlineSync.question('tips:write -map ', {
// encoding:'utf8'
// });
// showLine = decodeURIComponent(showLine)
// console.log(showLine);

// console.log(typeof fs.readFileSync('./subway.txt', 'utf8'));

// let subMessage = fs.readFileSync('./subway.txt', 'utf8');
// console.log(subMessage);
// let subStr = subMessage.split('\n');
// console.log(subStr);

// var str = ['hell:world', 'back:ground', 'pink:lack'];
// let stred = [];

// for (let i = 0; i < str.length; i++){
//     stred = str[i].split(':');
//     console.log(stred);
// }

// console.log(str[1].name);



// function readSyncByfs(tips) {
//     const buf = Buffer.allocUnsafe(10000);
//     process.stdout.write(tips);
//     process.stdin.pause();
//     let res = fs.readSync(process.stdin.fd,  buf, 0, 10000, 0,'utf8');
//     process.stdin.end();
//     return buf.toString('utf-8',0,res).trim();
// }
// console.log(readSyncByfs('输入1：'));


// // 这个倒是对中文不乱码
// process.stdin.setEncoding('utf8');
// // This function reads only one line on console synchronously. After pressing `enter` key the console will stop listening for data.
// function readlineSyncs() {
//     return new Promise((resolve, reject) => {
//         process.stdin.resume();
//         process.stdin.on('data', function (data) {
//             process.stdin.pause(); // stops after one line reads
//             resolve(data);
//         });
//     });
// }
// // entry point
// async function main() {
//     let inputLine1 = await readlineSyncs();
//     console.log(inputLine1);
//     console.log('bye');
// }
// main();


// const readline = require("readline");
// function nodeidaji() {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     function rlPromisify(fn) {
//         return async (...args) => {
//             return new Promise(resolve => fn(...args, resolve));
//         };
//     }

//     const question = rlPromisify(rl.question.bind(rl));
//     (async () => {
//         const answer = await question("你好，你是谁：");

//         rl.close();
//     })();
// }

// const rl = readline.createInterface(process.stdin, process.stdout);
//     rl.question('', answer => {
//         console.log(answer);
//         rl.close();
//     })

// let t = ['hwueh', 'hu@gsyg@sa', 'ad@sa'];
// for (let i = 0; i < t.length; i++){
//     console.log(t[i].split('@').length);
// }
// console.log(t[1].split('@'));
const fs = require('fs')
const readline = require('readline')
const lodash = require('lodash');
const { findSourceMap } = require('module');

function readSubwayFlie() {
    let showLine = fs.readFileSync('./subway.txt', 'utf-8');
    let subStr = showLine.split('\n');
    subStr.pop();
    showLine = [];
    let stred = [];
    for (let i = 0; i < subStr.length; i++) {
        stred = subStr[i].split(':');
        showLine.push({
            name: stred[0],
            line: stred[1]
        })
    }
    return showLine;
}
function stationToLine(station) {
    let subMessage = readSubwayFlie();
    let Lines = [];
    for (let i = 0; i < subMessage.length; i++) {
        if (subMessage[i].line.includes(station)) Lines.push(subMessage[i])
    }
    return Lines;
}
//判断路线是否被检查
function isChecked(line, lineStr) {
    for (let i = 0; i < lineStr.length; i++) {
        if (lineStr[i] === line) return true
    }
    return false;
}
function LineToChangeStation(Lines, checked) {
    let changeStation = [];
    let t;
    for (let i = 0; i < Lines.length; i++) {
        if (typeof (Lines[i].line) == 'string') {
            t = Lines[i].line.split('=');
            for (let j = 0; j < t.length; j++) {
                if (t[j].indexOf('@') > 0) {
                    if (t[j].split('@').length === 2) {
                        if (!isChecked(t[j].split('@')[1], checked)) {
                            changeStation.push({
                                start: t[j].slice(0, t[j].indexOf('@')),
                                changeToLine: t[j].slice(t[j].indexOf('@') + 1)
                            })
                        }
                    } else {
                        if (!isChecked(t[j].split('@')[1], checked)) {
                            changeStation.push({
                                start: t[j].slice(0, t[j].indexOf('@')),
                                changeToLine: t[j].split('@')[1]
                            })
                        }
                        if (!isChecked(t[j].split('@')[2], checked)) {
                            changeStation.push({
                                start: t[j].slice(0, t[j].indexOf('@')),
                                changeToLine: t[j].split('@')[2]
                            })
                        }
                    }
                }
            }
        }
    }
    return changeStation;
}
function lineIsRequest(line, checkedStr) {
    for (let i = 0; i < checkedStr.length; i++) {
        if (line === checkedStr[i].name) return true
    }
    return false
}
function getOneLine(lineName) {
    let subMessage = readSubwayFlie();
    for (let i = 0; i < subMessage.length; i++) {
        if (subMessage[i].name == lineName) return subMessage[i].line
    }
    return null;
}
//把缓冲区的路线放到“内存”,缓冲区清空
function bufferToRAM(buffer, checked) {
    for (let i = 0; i < buffer.length; i++) {
        checked.push(buffer[i])
    }
    buffer = [];
}

function mainFn(first, last) {
    let finish = false;
    let firstLine = stationToLine(first);
    let lastLine = stationToLine(last);
    let result = [];
    let checkedLine = [];//检查过的路线，不再需要
    let bufferCheckedLine = [];//上一级检查过的路线，但还能用
    let middleStation = [];//中间站
    console.log('firstLine&lastLine');
    console.log(firstLine);
    console.log(lastLine);
    //一线到
    for (let i = 0; i < firstLine.length; i++) {
        for (let j = 0; j < lastLine.length; j++) {
            if (firstLine[i].name === lastLine[j].name) {
                result.push({
                    start: first,
                    line: firstLine[i].name
                })
                finish = true;
            }
        }
        bufferCheckedLine.push(firstLine[i].name)
    }
    console.log('one-checkedLine');
    console.log(bufferCheckedLine);//缓冲区的已检查路线
    // 两线到
    if (finish === false) {
        let already = 0;
        let one = LineToChangeStation(firstLine, bufferCheckedLine);
        bufferToRAM(bufferCheckedLine, checkedLine);
        console.log('two-one');
        console.log(one);//第一个可以转的站
        for (let i = 0; i < one.length; i++) {
            if (lineIsRequest(one[i].changeToLine, lastLine)) {
                    middleStation[0] = one[i];
                    finish = true;
                    already = 1;
            }
            bufferCheckedLine.push(one[i].changeToLine)
        }
        console.log('two-checkedLine');
        console.log(bufferCheckedLine);
        console.log(checkedLine);
    }
    //三线到
    if (!finish) {
        let one = LineToChangeStation(firstLine, checkedLine);
        let two = [];
        let chang = [];//无关变量，暂时存储
        console.log('three-one');
        console.log(one);
        bufferToRAM(bufferCheckedLine, checkedLine)
        for (let i = 0; i < one.length; i++) {
            middleStation[0] = one[i];
            chang[0] = {
                name: one[i].changeToLine,
                line: getOneLine(one[i].changeToLine)
            };
            two = LineToChangeStation(chang, checkedLine);
            console.log('three-two');
            console.log(two);
            for (let j = 0; j < two.length; j++) {
                if (lineIsRequest(two[j].changeToLine, lastLine)) {
                    middleStation[1] = two[j];
                    finish = true;
                }
                bufferCheckedLine.push(two[j].changeToLine)
            }
            if (finish) break;
        }
        console.log('three-checkedLine');
        console.log(checkedLine);
        console.log(bufferCheckedLine);
    }
    //四线成,三个中间站
    if (finish === false) {
        checkedLine = [];
        bufferCheckedLine = [];
        for (let i = 0; i < firstLine.length; i++) {
            bufferCheckedLine.push(firstLine[i].name)
        }
        bufferToRAM(checkedLine, bufferCheckedLine)
        middleStation = [];
        let one = LineToChangeStation(firstLine, bufferCheckedLine);
        console.log('four-one');
        console.log(one);
        for (let i = 0; i < one.length; i++) {
            middleStation[0] = one[i];
            chang[0] = {
                name: one[i].changeToLine,
                line: getOneLine(one[i].changeToLine)
            };
            for (let m = 0; m < one.length; m++) {
                bufferCheckedLine.push(one[m].changeToLine)
            }
            two = LineToChangeStation(chang, bufferCheckedLine);
            console.log('four-two');
            console.log(two);
            for (let j = 0; j < two.length; j++) {
                middleStation[1] = two[j];
                chang[0] = {
                    name: two[j].changeToLine,
                    line: getOneLine(two[j].changeToLine)
                }
                for (let m = 0; m < two.length; m++) {
                    bufferCheckedLine.push(two[m].changeToLine)
                }
                three = LineToChangeStation(chang, bufferCheckedLine)
                console.log('four-three');
                console.log(three);
                for (let k = 0; k < three.length; k++) {
                    if (lineIsRequest(three[k].changeToLine, lastLine)) {
                        middleStation[1] = three[k];
                        finish = true;
                    }
                    // checkedLine.push(three[k].changeToLine)
                }
                if (finish) break;
            }
            if (finish) break;
            bufferCheckedLine = [];
            for (let n = 0; n < checkedLine.length; n++) {
                bufferCheckedLine.push(checkedLine[n])
            }
        }
    }
    if (!finish) {
        console.log('开发中');
    }
    console.log('last-middleStation');
    console.log(middleStation);
    console.log(result);
}
function main() {
    const rl = readline.createInterface(process.stdin, process.stdout)
    rl.question('three: ', answer => {
        let inputs = answer.split(' ')
        if (inputs.length === 7) {
            mainFn(inputs[1], inputs[2])
        } else {
            console.log('input error');
        }
        rl.close()
    })
}
mainFn('鱼珠', '东平')