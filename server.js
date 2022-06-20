const usersUID = require("./usersUID")
const quizs = require("./quiz")
const fs = require('fs');
const { instrument } = require("@socket.io/admin-ui")
let user_online = [];

user_online.playerNum = () => {
    let _num = 0;
    user_online.forEach((p) => {
        if (p.type == 1) _num++;
    })
    return _num;
}
let final_result = [];
// uid：
//id：
//name：
//type：
//state：答题状态 // 0蓝框普通 1正在答题蓝滚动 2回答正确绿 3回答错误虹 4抢答成功黄
//imgSrc：形象地址
const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://192.168.1.37:8080", "http://localhost:8080", "https://admin.socket.io", "http://www.virtualfans.club"]
    },
})

const quiz = {
    now: { id: -1, word: 0 },//当前题目的编号和显示到的字符数。
    quiz: {},//当前quiz的总信息。
    goon: false,//是否继续显示字符
    showTime_used: 0,//已经用掉了多少显示时间
    ansTime_used: 0,//已经用掉了多少答题时间
    dot: 0,//用于显示字符的符号的停顿
    isShowDown: false,//题目是否已展示完全。
    isShowAnsDown: true,
    anser: "",//当前答题者 ALL 或 id
    canPop: true, //是否可以触发抢答键
    playerAns: [],//玩家的答案
    canAns: true,//是否可以提交答案
    isQuizOver: false,
    ready: false,
    Init() {
        if (this.timer) clearInterval(this.timer);
        if (this.ansTimer) clearInterval(this.ansTimer);
        if (this.showDownTimer) clearInterval(this.showDownTimer);
        this.timer = null; this.ansTimer = null; this.showDownTimer = null;
        this.now.word = 0;
        this.goon = true;
        this.isShowDown = false;
        this.isShowAnsDown = true;
        this.canPop = true;
        this.anser = "";
        this.quiz = {};
        this.showTime_used = 0;
        this.ansTime_used = 0;
        this.playerAns = [];
        this.canAns = true;
        this.isQuizOver = false;
        this.ready = true;
        InitPlayerState();
    },//初始化题库
    NextQuiz() {
        //console.log({ ...quizs[++this.now.id], text: "" });
        if (++this.now.id > quizs.length - 1) {
            io.to(2).emit("ShowScore",{title:"游戏结束",rank:final_result});
            return;
        }
        this.Init();
        this.quiz = quizs[this.now.id];
        this.canPop = this.quiz.ans_type == 0 ? true : false;
        this.anser = this.quiz.ans_type == 0 ? "" : "ALL";
        this.canAns = this.quiz.ans_type == 0 ? true : false;
        io.to(2).emit("ReciveQuizBaseInfo", { ...this.quiz, text: "", ans: "", imgSrc: "", id: this.now.id });
        io.to(40).emit("ReciveQuizAnsAdmin", this.quiz.ans);
        this.StartShow();
    },
    UpdataText() {
        let word = this.quiz.text.charAt(this.now.word)
        if (!this.dot) {
            io.to(2).emit("ReciveNewWord", this.quiz.text.charAt(this.now.word));
            if (++this.now.word >= this.quiz.text.length) {
                this.TextShowDown();
            }
            if (word == "，" || word == "？" || word == "。" || word == "," || word == "?") {
                this.dot = 3
            }
        } else {
            this.dot--;
        }
    },
    StopShow(id) {
        this.goon = false;
        this.canPop = false;
        this.anser = id;
        clearInterval(this.timer);
        clearInterval(this.showDownTimer);
        clearInterval(this.ansTimer);
        this.ansTime_used = 0;
        this.ansTimer = setInterval(() => {
            this.ansTime_used += 1;
            if (this.ansTime_used >= this.quiz.timeLimit_ans)
                clearInterval(this.showDownTimer);
        }, 100);
        SetPlayerState([{ id, state: 4 }]);
        setTimeout(() => {
            SetPlayerState([{ id, state: 1 }]);
        }, 1000)
        io.to(2).emit("SetAnser", id);
    },
    StartShow() {
        if (this.timer) clearInterval(this.timer);
        this.goon = true;
        if (this.quiz.quiz_type > 0) {
            setTimeout(() => {
                if (this.quiz.quiz_type == 1) io.to(2).emit("ReciveImgSrc", this.quiz.imgSrc);
                else io.to(2).emit("StartMusic");
                if (this.quiz.ans_type == 1) {
                    SetAllPlayerState(1);
                    this.canAns = true;
                }
                setTimeout(() => {
                    this.timer = setInterval(() => {
                        if (this.goon) this.UpdataText();
                    }, this.quiz.speed);
                }, 2000)
            }, 3000)
        } else {
            setTimeout(() => {
                this.timer = setInterval(() => {
                    if (this.goon) this.UpdataText();
                }, this.quiz.speed);
            }, 3000)
        }

    },
    ContinueShow() {
        this.goon = true;
        this.anser = "";
        this.canPop = true;
        clearInterval(this.ansTimer);
        this.ansTime_used = 0;
        io.to(2).emit("ContinueShow");
        if (this.isShowDown) {
            this.SetShowDownTimer()
        } else {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.goon) this.UpdataText();
            }, this.quiz.speed);
        }
    },
    TextShowDown() {
        clearInterval(this.timer);
        if (this.quiz.ans_type == 3) {
            let _i = 0;
            let _timer = setInterval(() => {
                let _option = {
                    id: String.fromCharCode(_i + 65),
                    content: this.quiz.options[_i],
                }
                io.to(2).emit("ShowOption", _option);
                if (++_i >= this.quiz.options.length) {
                    clearInterval(_timer);
                    SetAllPlayerState(1);
                    io.to(2).emit("TextShowDown");
                    this.SetShowDownTimer();
                }
            }, 2000);
        } else {
            this.isShowDown = true;
            if (this.quiz.ans_type > 0) SetAllPlayerState(1);
            io.to(2).emit("TextShowDown");
            this.SetShowDownTimer();
        }
    },
    SetShowDownTimer() {
        clearInterval(this.showDownTimer);
        this.canAns = true;
        this.showDownTimer = setInterval(() => {
            this.showTime_used += 1;
            if (this.showTime_used >= this.quiz.timeLimit_show) {
                this.SolveQuizOver();
            }
        }, 100);
    },
    SolveQuizOver() {
        clearInterval(this.showDownTimer);
        this.showTime_used = this.quiz.timeLimit_show;
        if (this.quiz.ans_type < 2) {
            this.canPop = false;
            this.canAns = false;
            this.ShowAns(2500);
        } else {
            this.canAns = false;
        }
    },
    ShowAns(delay) {
        if (!delay) delay = 2000;
        this.canPop = false;
        this.canAns = false;
        this.isQuizOver = true;
        this.isShowAnsDown = false;
        let _ans = { id: this.now.id, text: this.quiz.text, ans: this.quiz.ans, ansDetail: this.quiz.ansDetail }
        if (this.quiz.ans_type == 3) {
            _ans.options = [];
            for (let i = 0; i < 26; i++)
                if (this.quiz.ans.indexOf(String.fromCharCode(i + 65)) > -1)
                    _ans.options.push({ id: String.fromCharCode(i + 65), content: this.quiz.options[i] })
        }
        setTimeout(() => {
            io.to(2).emit("ShowAns", _ans);
            this.isShowAnsDown = true;
        }, delay)
    },
    UpdatePlayerAns(id, ans) {
        for (let i = 0; i < this.playerAns.length; i++)
            if (this.playerAns[i].id == id) {
                this.playerAns[i].ans = ans;
                return;
            }
        this.playerAns.push({ id: id, ans: ans });
    },
    GetPlayerAns(id) {
        for (let i = 0; i < this.playerAns.length; i++)
            if (this.playerAns[i].id == id) {
                return this.playerAns[i].ans;
            }
        return null;
    },
    isAllPlayerAns() {
        let _t = 0;
        user_online.forEach((p) => {
            if (p.type == 1) _t++;
        })
        if (_t == this.playerAns.length) return true;
        else return false;
    }
}

function UpdatePlayerState() {
    let _players = [];
    user_online.forEach((u) => {
        if (u.type == 1) {
            let _p = {
                id: u.id,
                state: u.state
            }
            _players.push(_p);
        }
    })
    io.to(2).emit("UpdateStates", _players);
}

function SetAllPlayerState(id) {
    user_online.forEach((p) => {
        p.state = id;
    })
    UpdatePlayerState()
}

function SetPlayerState(ps) {
    ps.forEach((_p) => {
        user_online.forEach((p) => {
            if (p.id == _p.id) {
                p.state = _p.state;
            }
        })
    })
    UpdatePlayerState()
}
function InitPlayerState() {
    user_online.forEach((p) => {
        if (p.type == 1) p.state = 0;
    })
    UpdatePlayerState();
}
function IDtoUser(ID) {
    for (let i = 0; i < user_online.length; i++)
        if (user_online[i].id == ID) return i;
    return -1;
}

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}


function AddScore(id, score) {

    let _flag = true;
    final_result.forEach((p) => {
        if (p.id == id) {
            p.score += score;
            p.times++;
            _flag = false;
        }
    })
    if (_flag) {
        let _player = {
            id: id,
            score: score,
            times: 1,
        }
        let _i = IDtoUser(id);
        _player.uid = user_online[_i].uid;
        _player.name = user_online[_i].name;
        _player.imgSrc = user_online[_i].imgSrc;
        final_result.push(_player);
    }
    let _result = ""
    final_result.forEach((p) => {
        _result += p.uid + " " + p.score + ' ' + p.times + '\r\n';
    })
    fs.writeFile('./fianlResult.txt', _result, (err) => {
        console.log(err);
    });
    return;
}

function InitAdmin(socket) {
    socket.on("StartGame", () => {
        quiz.Init();
        quiz.NextQuiz();
    })
    socket.on("RestartGame", () => {
        quiz.Init();
        quiz.now.id = -1;
        io.to(2).emit("RestartGame");
    })
    socket.on("NextQuiz", () => {
        if (!quiz.isShowAnsDown) return;
        quiz.NextQuiz();
    })
    socket.on("CheckAns", (result) => {
        if (quiz.anser == "") return;
        let _ps = [];
        result.forEach((p) => {
            if (p.p) {
                AddScore(p.id, quiz.quiz.score);
                _ps.push({ id: p.id, state: 2 })
            } else {
                _ps.push({ id: p.id, state: 3 })
            }
        })
        SetPlayerState(_ps);
        io.to(2).emit("ReciveAnsCheck", result);
        if (quiz.anser != "ALL") {
            if (result[0].p) {
                quiz.ShowAns()
            } else {
                let _id = quiz.anser;
                setTimeout(() => {
                    SetPlayerState([{ id:_id, state: 0 }]);
                }, 2000)
                quiz.ContinueShow();
                quiz.playerAns = [];
            }
        } else {
            quiz.ShowAns();
        }
    })
    socket.on("Ready", (id) => {
        quiz.ready = true;
        io.to(2).emit("Ready");
    })
    socket.on("MusicReplay", () => {
        io.to(2).emit("MusicReplay");
    })
    socket.on("ShowScore",() => {
        io.to(2).emit("ShowScore",{title:"积分榜",rank:final_result})
    })
    socket.on("KickPlayer",(id) => {
        io.sockets.sockets.get(id).emit("kicked");
        io.sockets.sockets.get(id).disconnect()
    })
}

function InitData(socket) {
    let _data = {
        players: [],
    }
    for (let i = 0; i < user_online.length; i++) {
        if (user_online[i].type == 1) _data.players.push(user_online[i]);
    }

    if (quiz.now.id > -1) {
        console.log(quiz.now.id);
        _data.quiz = { ...quiz.quiz, text: "", ans: "" };
        if (quiz.isShowDown) {
            _data.quiz.text = quiz.quiz.text;
        } else {
            for (let i = 0; i < quiz.now.word - 1; i++)_data.quiz.text += quiz.quiz.text.charAt(i);
        }
        if (quiz.isQuizOver) {
            _data.quiz.ans = quiz.quiz.ans;
        }
    }
    _data.state = {
        showTime_used: quiz.showTime_used,
        ansTime_used: quiz.ansTime_used,
        anser: quiz.anser,
        playerAns: quiz.playerAns,
        ready: quiz.ready
    }

    socket.emit("InitData", _data);
}

function BeingLogin(socket, user) {
    InitData(socket);
   // InitAdmin(socket);
    user_online.push(user);
    socket.join(2);
    io.to(40).emit("SetPlayerNum", { player: user_online.playerNum(), all: user_online.length });
    if (user.type == 1 || user.type == 40) {
        socket.join(1);
        socket.uid = user.uid;
    }
    if (user.type == 40) {
        socket.join(40);
        InitAdmin(socket);
        socket.emit("SetQuizNum", quizs.length)
    }
    if (user.type == 1) io.to(2).emit("SomeOneJoinRoom", user);
    if (user.type == 2) return;
    socket.on("popQuiz", () => {
        if (!socket.uid) return;
        if (!quiz.canPop) return;
        if (!quiz.goon) return;
        quiz.StopShow(socket.id);
    })
    socket.on("disconnecting", () => {
        let _id = IDtoUser(socket.id);
        if (_id > -1)
            user_online.splice(_id, 1);
        io.to(2).emit("SomeOneLeaveRoom", socket.id);
        io.to(40).emit("SetPlayerNum", { player: user_online.playerNum(), all: user_online.length });
    })
    socket.on("ReciveAnsLast", (ans) => {
        for (let i = 0; i < quiz.playerAns.length; i++)
            if (quiz.playerAns[i].id == socket.id) {
                return;
            }
        quiz.playerAns.push({ id: socket.id, ans: ans });
        SetPlayerState([{ id: socket.id, state: 4 }])
        io.to(2).emit("ReciveBoardAnsLast", [{ id: socket.id, ans: ans }]);
    })
    socket.on("ReciveAns", (ans) => {
        if (!quiz.canAns) return;
        if (quiz.anser != "ALL" && quiz.anser != socket.id) return;
        if (quiz.quiz.ans_type == 0) {
            for (let i = 0; i < quiz.playerAns.length; i++)
                if (quiz.playerAns[i].id == socket.id)
                    return;
            quiz.playerAns.push({ id: socket.id, ans: ans });
            io.to(2).emit("ReciveBoardAns", quiz.playerAns);
        } else if (quiz.quiz.ans_type == 1) {
            if (quiz.GetPlayerAns(socket.id)) return;
            if (ans.toUpperCase() == quiz.quiz.ans.toUpperCase()) {
                SetPlayerState([{ id: socket.id, state: 2 }])
                quiz.UpdatePlayerAns({ id: socket.id, ans: ans });
                AddScore(socket.id, quiz.quiz.score);
                io.to(2).emit("SomeOneRight", socket.id);
                if (quiz.isAllPlayerAns()) {
                    quiz.SolveQuizOver();
                    io.to(2).emit("AllPlayerAnsDown");
                }
            } else {
                SetPlayerState([{ id: socket.id, state: 3 }])
                setTimeout(() => {
                    SetPlayerState([{ id: socket.id, state: 1 }])
                }, 1000)
                io.to(2).emit("SomeOneWrong", socket.id);
            }
        } else {
            let _f = true;
            for (let i = 0; i < quiz.playerAns.length; i++)
                if (quiz.playerAns[i].id == socket.id) {
                    quiz.playerAns[i].ans = ans;
                    _f = false;
                }
            if (_f) {
                quiz.playerAns.push({ id: socket.id, ans: ans });
                SetPlayerState([{ id: socket.id, state: 4 }])
                if (quiz.isAllPlayerAns()) {
                    quiz.SolveQuizOver();
                    io.to(2).emit("AllPlayerAnsDown");
                }
            }
            io.to(2).emit("ReciveBoardAns", [{ id: socket.id, ans: ans }]);
        }
    })
}

io.on("connection", socket => {
    socket.on("login", (user, cb) => {
        if (user.name.length > 20) {
            cb(400);
            return;
        }
        if (user.name == "") {
            cb(500);
            return;
        }
        user.id = socket.id;
        if (user.uid == 640237) {
            user.type = 40;
            user.uid = 2434;
            BeingLogin(socket, user);
            cb(1, JSON.stringify(user));
            return;
        }

        user.uid = PrefixInteger(user.uid, 4)
        if (user_online.findIndex((u) => {
            return u.uid == user.uid;
        }) > -1) {
            user.uid = -1;
            user.type = 2;
            BeingLogin(socket, user);
            cb(3, JSON.stringify(user));
            return;
        }

        if (user_online.playerNum() >= 20) {
            user.uid = -1;
            user.type = 2;
            BeingLogin(socket, user);
            cb(4, JSON.stringify(user));
            return;
        }

        if (user.uid == '000' || (usersUID.findIndex((uids) => {
            return uids.uid == user.uid;
        }) == -1)) {
            user.uid = -1;
            user.type = 2;
            BeingLogin(socket, user);
            cb(2, JSON.stringify(user));
            //1成功 2uid不存在 3uid存在但已登录 400 name过长 500 name为空
            return;
        }
        user.type = 1;
        user.state = 0;
        user.board = "";
        user.imgSrc = usersUID.find((u) => {
            return u.uid == user.uid;
        }).src;
        BeingLogin(socket, user);
        cb(1, JSON.stringify(user));
        return;
    })

    socket.on("sendMessage", (msg) => {
        let index = IDtoUser(socket.id);
        if (index > -1) {
            let _msg = {
                message: msg,
                type: user_online[index].type,
                uid: user_online[index].type == 1 ? user_online[index].uid : null,
                from: user_online[index].name
            }
            io.to(2).emit("ReciveMessage", _msg);
        }
    })


})




instrument(io, { auth: false })