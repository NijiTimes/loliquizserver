// quiz_type: 0文字题 1图片题 2音乐题
// ans_type:0抢答 1优先抢答 2问答 3选择题
// speed: 显示文本的速度 单位为毫秒，如200表示每200毫秒显示一个字。
// text: 题目内容
// ans: 参考答案
// ansDetail:参考答案的详细解释。 是一个图片地址
// isOneAns: 是否唯一答案 （可忽略
// score:分值
// timeLimit_show: 完整展示题目后的看题时间 单位为十分之一秒
// timeLimit_ans:答题题目 单位为十分之一秒
// options[]:选项（仅限选择题）
// imgSrc: 图片地址（仅限图片题）
// musicSrc: 音乐地址（仅限音乐题）
const quiz = [{
    quiz_type:1,
    ans_type:0,
    speed:200,
    text:"这是谁？",
    ans:"EZG",
    imgSrc:"https://img.qwq.nz/images/2022/01/20/1f4a5868c8c1d5f895b3971483d9cf86.png",
    isOneAns:false,
    score:10,
    timeLimit_show:900,
    timeLimit_ans:300,
},{
    quiz_type:0,
    ans_type:2,
    speed:100,
    text:"e酱与四位女生相亲，他想知道四位女生的体重，但相亲阿姨不肯细说，她只说‘大家体重都是整数，两两想加分别是99,113,125,130,144，还有一组你自己算。’浙大硕士e酱迅速算出了最苗条的那位女生的体重，并与之相亲，请问相亲女的体重为多少kg",
    ans:"47",
    imgSrc:"https://img.qwq.nz/images/2022/01/20/1f4a5868c8c1d5f895b3971483d9cf86.png",
    isOneAns:false,
    score:30,
    timeLimit_show:1200,
    timeLimit_ans:300,
},{
    quiz_type:0,
    ans_type:0,
    speed:100,
    text:"e酱与相亲女的婚后生活很幸福，生了三胎。一天e酱出门遇到了群友，群有问，你家三小只今年都多大了？e酱神秘的说‘相乘为36，相加为13’，然后就走了。请问e酱的三个孩子分别多大了？",
    ans:"2、2、9",
    imgSrc:"https://img.qwq.nz/images/2022/01/20/1f4a5868c8c1d5f895b3971483d9cf86.png",
    isOneAns:false,
    score:10,
    timeLimit_show:1200,
    timeLimit_ans:300,
}];

const quiz_module = {
    quiz_type: 1,
    ans_type:1,
    text:"",
    ans:"",
    isOneAns:true,
    score:10,
    timeLimit_show:300,
    timeLimit_ans:105
}

module.exports = quiz;