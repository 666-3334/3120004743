const nodejieba = require('nodejieba');
const crypto = require('crypto');
const hash = crypto.createHash('md5');
const inquirer = require('inquirer');
const fs = require('fs');
// const { resolve } = require('path');
// const { rejects } = require('assert');
var allin;//全局变量供交互使用
// 输入两个simHash，输出相似度
function getSimilarity(hashO, hashT) {
    let distance = 0;
    for (var i = 0; i < hashO.length; i++) {
        if (hashO.charAt(i) != hashT.charAt(i)) {
            distance++;
        }
    }
    return 0.01 * (100 - distance * 100 / 128);
}
// 进制转换
function hex_to_bin(str) {
    let hex_array = [{ key: 0, val: "0000" }, { key: 1, val: "0001" }, { key: 2, val: "0010" }, { key: 3, val: "0011" }, { key: 4, val: "0100" }, { key: 5, val: "0101" }, { key: 6, val: "0110" }, { key: 7, val: "0111" },
    { key: 8, val: "1000" }, { key: 9, val: "1001" }, { key: 'a', val: "1010" }, { key: 'b', val: "1011" }, { key: 'c', val: "1100" }, { key: 'd', val: "1101" }, { key: 'e', val: "1110" }, { key: 'f', val: "1111" }];
    let value = ""
    for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < hex_array.length; j++) {
            if (str.charAt(i).toLowerCase() == hex_array[j].key) {
                value = value.concat(hex_array[j].val)
                break
            }
        }
    }
    return value;
}
//计算hash值
function hashCode(word) {
    return hex_to_bin(crypto.createHash('md5').update(word).digest('hex'));
}
// 传入字符串，计算hash值
function createSimhash(keyword) {
    var result = nodejieba.cut(keyword);
    var keyMap = new Map();
    result.map(function (key) {
        if (keyMap.has(key)) {
            keyMap.set(key, keyMap.get(key) + 1)
        } else {
            keyMap.set(key, 1)
        }
    })
    var hashMap = new Map();
    keyMap.forEach(function (value, key, map) {
        //3、对每个key计算其hash值
        var currenthash = hashCode(key);
        //4、遍历hash值，对hash值进行权值操作
        for (var i = 0; i < currenthash.length; i++) {
            var v1 = parseInt(currenthash[i]);
            var v2;
            if (v1 > 0) {
                v2 = 1 * value;
            } else {
                v2 = value * (-1);
            }
            //5、边加权边合并
            if (hashMap.has(i)) {
                hashMap.set(i, hashMap.get(i) + v2);
            } else {
                hashMap.set(i, v2);
            }
        }
    });
    var s1 = "";
    //6、降维
    for (var i = 0; i < 64; i++) {
        var v1 = hashMap.get(i);
        if (v1 > 0) {
            hashMap.set(i, 1)
        } else {
            hashMap.set(i, 0)
        }
        s1 = s1 + hashMap.get(i);
    }
    return s1;
}
//定义主函数
function main() {
    var questions = [
        {
            type: 'input',
            name: 'origin',
            message: "原文件的路径："
        },
        {
            type: 'input',
            name: 'modify',
            message: "修改后的文件的路径"
        }
    ];
    inquirer.prompt(questions).then(answers => {
        fs.readFile(answers['origin'], 'utf8', (err, oriData) => {
            if (err) {
                console.error('原文件路径出错或文件不存在')
                return
            }
            else {
                fs.readFile(answers['modify'], 'utf8', (err, modData) => {
                    if (err) {
                        console.error('修改文件路径出错或文件不存在')
                        return
                    }
                    oriData = oriData.replace(/[,.;:'"，。；：‘“”’!！]/g, '');
                    modData = modData.replace(/[,.;:'"，。；：‘“”’!！]/g, '');
                    allin = getSimilarity(createSimhash(oriData), createSimhash(modData)).toFixed(2);
                    console.log('相似度是' + allin);
                    fs.writeFile('D:/JavaScript-exercise/论文查重系统/result.txt', allin + '\n', { flag: 'a+' }, err => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                })
            }
        })
    })
}
// main();

exports.forTest = function(a, b) {
    // console.log('aaaaaaaaaaaaaaaa');
    // if ((typeof a) == String && (typeof b) == String) {
        // console.log('aaaaaaaaaaaaaaaaaaaaa');
        let oriData = fs.readFileSync(a, 'utf-8');
        let modData = fs.readFileSync(b, 'utf-8');
        // console.log(oriData);
        // console.log(modData);
        oriData = oriData.replace(/[,.;:'"，。；：‘“”’!！]/g, '');
        modData = modData.replace(/[,.;:'"，。；：‘“”’!！]/g, '');
        return parseFloat(getSimilarity(createSimhash(oriData), createSimhash(modData)).toFixed(2));
    }
// }

// console.log(forTest('D:/JavaScript-exercise/论文查重系统/origin/001.txt', 'D:/JavaScript-exercise/论文查重系统/modify/001.txt'));





