const assert = require('assert');

const indexs = require('../index.js');

console.log(typeof indexs);

console.log(indexs.forTest('D:/JavaScript-exercise/论文查重系统/origin/001.txt','D:/JavaScript-exercise/论文查重系统/modify/001.txt'));

describe('#index.js', ()=> {
    it('should return 1', () => {
        assert.strictEqual(indexs.forTest('D:/JavaScript-exercise/论文查重系统/origin/001.txt','D:/JavaScript-exercise/论文查重系统/modify/001.txt'), 1);
    });
    it('should return 0.79', () => {
        assert.strictEqual(indexs.forTest('D:/JavaScript-exercise/论文查重系统/origin/001.txt','D:/JavaScript-exercise/论文查重系统/modify/002.txt'), 0.79);
    });
    it('should return 0.75', () => {
        assert.strictEqual(indexs.forTest('D:/JavaScript-exercise/论文查重系统/origin/002.txt','D:/JavaScript-exercise/论文查重系统/modify/001.txt'), 0.75);
    });
    it('should return 0.75', () => {
        assert.strictEqual(indexs.forTest('D:/JavaScript-exercise/论文查重系统/origin/002.txt','D:/JavaScript-exercise/论文查重系统/modify/001.txt'), 0.75);
    });
    it('should return 0.75', () => {
        assert.strictEqual(indexs.forTest('D:/JavaScript-exercise/论文查重系统/modify/003.txt','D:/JavaScript-exercise/论文查重系统/origin/003.txt'), 0.73);
    });
})