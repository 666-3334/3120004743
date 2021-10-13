const fs = require('fs')
const readlineSync = require('readline-sync');
const readline = require('readline');
const { mainModule } = require('process');
const lodash = require('lodash');
const { findSourceMap } = require('module');
// =分隔，@转线
// 只执行一次
// const subMessage = {
//     '1号': '广州东站@3号北延段=体育中心=体育西路@3号@3号北延段=杨箕@5号=东山口@6号=烈士陵园=农讲所=公园前@2号=西门口=陈家祠=长寿路=黄沙@6号=芳村=花地湾=坑口=西朗@广佛',
//     '2号': '广州南站@7号=石壁@7号=会江=南浦=洛溪=南洲=东晓南=江泰路=昌岗@8号=江南西=市二宫=海珠广场@6号=公园前@1号=纪念堂=越秀公园=广州火车站@5号=三元里=飞翔公园=白云公园=白云文化广场=萧岗=江夏=黄边=嘉禾望岗@3号北延段',
//     '3号': '天河客运站@6号=五山=华师=岗顶=石牌桥=体育西路@1号@3号北延段=珠江新城@5号=广州塔@APM=客村@8号=大塘=沥滘=厦滘=大石=汉溪长隆=市桥=番禺广场',
//     '3号北延段': '机场南=人和=龙归=嘉禾望岗@2号=白云大道北=永泰=同和=京溪南方医院=梅花园=燕塘@6号=广州东站@1号=林和西@APM=体育西路@1号@3号',
//     '4号': '黄村=车陂=车陂南@5号=万胜围@8号=官洲=大学城北=大学城南=新造=石碁=海傍=低涌=东涌=黄阁汽车城=黄阁=蕉门=金洲',
//     '5号': '滘口=坦尾@6号=中山八=西场=西村=广州火车站@2号=小北=淘金=区庄@6号=动物园=杨箕@1号=五羊邨=珠江新城@3号=猎德=潭村=员村=科韵路=车陂南@4号=东圃=三溪=鱼珠=大沙地=大沙东=文冲',
//     '6号': '浔峰岗=横沙=沙贝=河沙=坦尾@5号=如意坊=黄沙@1号=文化公园=一德路=海珠广场@2号=北京路=团一大广场=东湖=东山口@1号=区庄@5号=黄花岗=沙河顶=天平架=燕塘@3号北延段=天河客运站@3号=长湴=植物园=龙洞=柯木塱=高塘石=黄陂=金峰=暹岗=苏元=萝岗=香雪',
//     '7号': '广州南站@2号=石壁@2号=谢村=钟村=汉溪长隆@3号=南村万博=员岗=板桥=大学城南',
//     '8号':'万胜围@4号=琶洲=新港东=磨碟沙=赤岗=客村@3号=鹭江=中大=晓港=昌岗@2号=宝岗大道=沙园=凤凰新村=同福西=文化公园@6号=华林寺=陈家祠@1号=彩虹桥=西村@5号=鹅掌坦=同德=上步=聚龙=石潭=小坪=石井=亭岗=滘心',
//     '9号': '飞鹅岭=花都汽车城=广州北站@8号=花城路=花果山公园=花都广场=马鞍山公园=莲塘村=清埗=白鳝塘=高增@3号',
//     '广佛': '新城东=东平=世纪莲=澜石=魁奇路=季华园=同济路=祖庙=普君北路=朝安=桂城=南桂路=礌岗=千灯湖=金融高新区=龙溪=菊树=西朗@1号=鹤洞=沙涌=沙园@8号=燕岗=石溪=南洲=沥滘',
//     'APM': '林和西@3号北延段=体育中心南=天河南=黄埔大道=妇儿中心=花城大道=大剧院=海心沙=广州塔@3号',
//     '13号': '鱼珠@5号=裕丰围@7号=双岗=南海神庙=夏园@5号=南岗=温涌=白江=新塘@16号=官湖=复昌桥',
//     '14号': '嘉禾望岗=白云东平=夏良=太和=竹料=钟落潭=马沥=新和=太平=神岗=邓村=从化客运站=东风',
//     '14号支线': '新和=知识城北=马头庄=枫下村=知识城=知识城南=旺村=康大=镇龙北=镇龙@21号',
//     '21号':'员村@5号=天河公园=棠东=黄村@4号=大观南路=天河智慧城=神舟路=科学城=苏元@6号=水西@7号=长平=金坑=镇龙西=镇龙@14号支线=中新=坑贝=凤岗=朱村=山田=钟岗=增城广场'
// }
// for (let key in subMessage) {
//     // console.log(key);
//     // console.log(subMessage[key]);
//     fs.appendFileSync('./subway.txt', key + ':' + subMessage[key]+'\n','utf-8');
// }

// 需求1：输入-map subway.txt 读取文件内容并显示    bug:中转站还没出现
function showSubLine(subMap) {
    let showLine
    if (subMap.length == 2) {
        if (subMap[0] === '-map') {
            showLine = fs.readFileSync(subMap[1], 'utf8');
        }
        console.log(showLine);
    } else {
        console.log('输入错误!');
    }
}
//需求2:输入-a 1号线 -map subway.txt -o station.txt,读写1号线,显示所有站点,写入station文件
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
// 传入线路字符串，传出对应站名条
function findSub(str) {
    let showLine = fs.readFileSync('./subway.txt', 'utf8');
    let subStr = showLine.split('\n');
    let strLine = strTobj(subStr);
    for (let i = 0; i < strLine.length; i++) {
        if (str === strLine[i].name) return strLine[i].line;
    }
    return null;
}
function searchSub(subMap) {
        if (subMap.length === 6) {
            if (subMap[0] === '-a' && subMap[2] === '-map' && subMap[3] === 'subway.txt') {
                console.log(subMap[1]);
                let timi = findSub(subMap[1]);
                if (timi !== null) console.log(timi);
                else {
                    console.log('sorry,no found');
                }
                if (subMap[4] !== '-o') console.log('文件读入命令不存在');
                else {
                    fs.writeFileSync(subMap[5], timi);
                    console.log('已写入文件');
                }
            } else {
                console.log('输入错误!');
            }
        } else {
            console.log('输入错误');
        }
    // })
}
//需求3：寻找两个站点之间的最短距离 -b 大学城南 猎德 -map subway.txt -o routine.txt 他希望能通过最少的站数从出发点到达目的地，
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

    // 两线到
    if (finish === false) {
        let already = 0;
        let one = LineToChangeStation(firstLine, bufferCheckedLine);
        bufferToRAM(bufferCheckedLine, checkedLine);

        for (let i = 0; i < one.length; i++) {
            if (lineIsRequest(one[i].changeToLine, lastLine)) {
                    middleStation[0] = one[i];
                    finish = true;
                    already = 1;
            }
            bufferCheckedLine.push(one[i].changeToLine)
        }

    }
    //三线到
    if (!finish) {

        let one = LineToChangeStation(firstLine, checkedLine);
        let two = [];
        let chang = [];//无关变量，暂时存储

        bufferToRAM(bufferCheckedLine, checkedLine)
        for (let i = 0; i < one.length; i++) {
            middleStation[0] = one[i];
            chang[0] = {
                name: one[i].changeToLine,
                line: getOneLine(one[i].changeToLine)
            };
            two = LineToChangeStation(chang, checkedLine);

            for (let j = 0; j < two.length; j++) {
                if (lineIsRequest(two[j].changeToLine, lastLine)) {
                    middleStation[1] = two[j];
                    finish = true;
                }
                bufferCheckedLine.push(two[j].changeToLine)
            }
            if (finish) break;
        }

    }
    //四线成,三个中间站
    if (finish === false) {
        checkedLine = [];
        bufferCheckedLine = [];
        let chang = [];
        for (let i = 0; i < firstLine.length; i++) {
            bufferCheckedLine.push(firstLine[i].name)
        }
        bufferToRAM(checkedLine, bufferCheckedLine)
        middleStation = [];
        let one = LineToChangeStation(firstLine, bufferCheckedLine);
  
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
     
                for (let k = 0; k < three.length; k++) {
                    if (lineIsRequest(three[k].changeToLine, lastLine)) {
                        middleStation[1] = three[k];
                        finish = true;
                    }
                   
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

    if (result.length !== 0) {
        let i = 0;
        for (i = 0; i < firstLine.length; i++){
            if(firstLine[i].line.includes(last))break
        }
        let f = firstLine[i].line.indexOf(first)
        let l = firstLine[i].line.indexOf(last)
        console.log(firstLine[i].name);
        if (f > l) {
            console.log(firstLine[i].line.slice(l,f+first.length));
        } else {
            console.log(firstLine[i].line.slice(f,l+last.length));
        }
    } else if(finish){
        let i = 0;
        for (i = 0; i < firstLine.length; i++){
            if(firstLine[i].line.includes(middleStation[0].start))break
        }
        let f = firstLine[i].line.indexOf(first)
        let l = firstLine[i].line.indexOf(middleStation[0].start)
        console.log(firstLine[i].name);
        if (f > l) {
            console.log(firstLine[i].line.slice(l,f+first.length));
        } else {
            console.log(firstLine[i].line.slice(f,l+middleStation[0].start.length));
        }
        
        for (let j = 0; j < middleStation.length; j++){
            let sub = getOneLine(middleStation[j].changeToLine);
            console.log(middleStation[j].changeToLine);
            if (j != middleStation.length - 1) {
                f = sub.indexOf(middleStation[j].start)
                l = sub.indexOf(middleStation[j + 1].start)
                
                if (f > l) {
                    
                    console.log(sub.slice(l, f + middleStation[j].start.length));
                    
                } else {
                    console.log(sub.slice(f, l + middleStation[j+1].start.length));
                }
            } else {
                f = sub.indexOf(middleStation[j].start)
                l = sub.indexOf(last)
                console.log(middleStation[j].start);
                console.log(last);
                console.log('bug');
                console.log(sub);
                console.log(f,l);
                if (f > l) {
                    console.log(sub.slice(l, f + middleStation[j].start.length));
                } else {
                    console.log(sub.slice(f,l+last.length));
                }
            }
            
        }
    }
}
function main(){
    const rl = readline.createInterface(process.stdin, process.stdout);
    rl.question('input now ', answer => {
        let ans = answer.split(' ')
        if (ans.length === 2) {
            showSubLine(ans)
        } else if (ans.length === 6) {
            searchSub(ans)
        } else if (ans.length === 7) {
            mainFn(ans[1],ans[2])
        } else {
            console.log('input error');
        }
        rl.close()
    })
}
main()