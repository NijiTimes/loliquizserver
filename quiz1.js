// quiz_type: 0文字题 1图片题 2音乐题
// ans_type:0抢答 1优先抢答 2问答 3选择题
// speed: 显示文本的速度
// text: 题目内容
// ans: 参考答案
// ansDetail:参考答案的详细解释。
// isOneAns: 是否唯一答案
// score:分值
// timeLimit_show: 完整展示题目后的看题时间
// timeLimit_ans:答题题目
// options[]:选项（仅限选择题）
// imgSrc: 图片地址（仅限图片题）
// musicSrc: 音乐地址（仅限音乐题）
const quiz = [{
    quiz_type:0,
    ans_type:0,
    speed:200,
    text:"摇曳百合中，哪位角色的CV是著名AI合成音的音源提供者？",
    ans:"杉浦绫乃",
    isOneAns:false,
    score:10,
    timeLimit_show:700,
    timeLimit_ans:300,
},{
    quiz_type:0,
    ans_type:0,
    speed:200,
    text:"结城友奈是谁？",
    ans:"是勇者",
    isOneAns:false,
    score:10,
    timeLimit_show:700,
    timeLimit_ans:300,
},{
    quiz_type:1,
    ans_type:0,
    speed:200,
    text:"这个本子的作者名叫？",
    ans:"水龙敬",
    isOneAns:false,
    score:10,
    timeLimit_show:600,
    timeLimit_ans:300,
    imgSrc:"https://img.qwq.nz/images/2022/03/05/5ab9c168a6cd2cbed055b3fe913fed5f.png"
},{
    quiz_type:2,
    ans_type:0,
    speed:200,
    text:"这首歌出自著名的哪款galgame？",
    ans:"《Fate/Stay Night》",
    isOneAns:false,
    score:10,
    timeLimit_show:900,
    timeLimit_ans:150,
    musicSrc:"http://music.163.com/song/media/outer/url?id=448126.mp3"
},{
    quiz_type:2,
    ans_type:0,
    speed:200,
    text:"这首曲子为著名动作游戏背景音乐，请问这款游戏女主角一般被称为？",
    ans:"2B(尼尔机械纪元)",
    isOneAns:false,
    score:10,
    timeLimit_show:900,
    timeLimit_ans:150,
    musicSrc:"http://music.163.com/song/media/outer/url?id=468490564.mp3"
},{
    quiz_type:1,
    ans_type:3,
    speed:200,
    text:"这款软件登陆时有三条线路供选择，分别对应哪三个地区用户直连服务器？",
    ans:"B",
    options:["台湾香港大陆","台湾大陆香港","大陆台湾香港","大陆香港台湾","香港大陆台湾","香港台湾大陆"],
    isOneAns:false,
    score:10,
    timeLimit_show:600,
    timeLimit_ans:150,
    imgSrc:"https://img.qwq.nz/images/2022/03/05/50ad6f0d5b34da478fc75e0dc477acc7.png"
},{
    quiz_type:0,
    ans_type:3,
    speed:200,
    text:"已被删除的av10492，是一个什么类型的视频？",
    ans:"A",
    options:["鬼畜视频","H视频","音乐视频","游戏视频"],
    isOneAns:false,
    score:10,
    timeLimit_show:600,
    timeLimit_ans:150,
},{
    quiz_type:1,
    ans_type:1,
    speed:200,
    text:"作为第一个在国内二次元界火爆的男生女相角色，他的名字甚至一度变成一种‘性别’，请问这名角色的全名是？",
    ans:"木下秀吉",
    isOneAns:false,
    score:10,
    timeLimit_show:600,
    timeLimit_ans:300,
    imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_match%2F0%2F9774044726%2F0.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1649062129&t=1e4f72397577f4838c04d31339f4c63e"
},{
    quiz_type:1,
    ans_type:0,
    speed:200,
    text:"她cos的角色名为？",
    ans:"樱岛麻衣",
    isOneAns:false,
    score:10,
    timeLimit_show:900,
    timeLimit_ans:300,
    imgSrc:"https://img.qwq.nz/images/2022/03/05/de5457bb3b9162825673f69d4c48c0df.png"
},{
    quiz_type:2,
    ans_type:2,
    speed:200,
    text:"这首歌的演唱者为？",
    ans:"YUI",
    isOneAns:false,
    score:10,
    timeLimit_show:600,
    timeLimit_ans:150,
    musicSrc:"http://music.163.com/song/media/outer/url?id=4952978.mp3"
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