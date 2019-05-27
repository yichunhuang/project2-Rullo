// MySQL Initialization
const mysql = require("../mysqlcon.js");
// Build DAO Object
module.exports = {
    insertUserPlan: function (data) {
        return new Promise(function (resolve, reject) {
            const { user_name, user_id, category, topic, period, goal, rules, trigger, punish, hiddenRule, hiddenTrig, triggerTime, hiddenPunishment, image } = data;
            let plan={
                topic:topic,
                period:period,
                goal:goal,
                user_id:user_id,
                user_name:user_name,
                status:status,
                image:image,
                time:Date.now()
            };
            let query = "INSERT INTO plan SET ?";
            mysql.con.query(query,plan, function (error) {
                if (error) {
                    reject("Database query error" + error);
                    return;
                }
                let query = `SELECT id FROM plan ORDER BY id DESC`;
                mysql.con.query(query, function (error, result) {
                    if (error) {
                        reject("Database query error" + error);
                        return;
                    }
                    let plan_id = result[0].id;
                    //rules
                    if (!hiddenRule) {
                        let query = "INSERT INTO rules(plan_id) VALUES ?;";
                        mysql.con.query(query,[plan_id], function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else if (hiddenRule == 1) {
                        let data = {
                            plan_id:plan_id,
                            rule:rules
                        }
                        let query = "INSERT INTO rules SET ?";
                        mysql.con.query(query,data, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        rules.forEach(function (rule) {
                            let data = {
                                plan_id:plan_id,
                                rule:rule
                            }
                            let query = "INSERT INTO rules SET ?";
                            mysql.con.query(query,data, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        });
                    }
                    //trigger
                    if (!hiddenTrig) {
                        let query = `INSERT INTO` + '`trigger`' + ` (plan_id) VALUES ?`;
                        mysql.con.query(query,[plan_id], function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else if (hiddenTrig == 1) {
                        let data = {
                            plan_id:plan_id,
                            trig:trigger,
                            time:triggerTime
                        }
                        let query = `INSERT INTO ` + '`trigger`' `SET ?`;
                        mysql.con.query(query,data, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        for (var i = 0; i < hiddenTrig; i++) {
                            let data = {
                                plan_id:plan_id,
                                trig:trigger[i],
                                time:triggerTime[i]
                            }
                            let query = `INSERT INTO ` + '`trigger`' `SET ?`;
                            mysql.con.query(query,data, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        }
                    }
                    //punish
                    if (!hiddenPunishment) {
                        let query = `INSERT INTO punish(plan_id) VALUES ?`;
                        mysql.con.query(query,[plan_id], function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }

                        });
                    } else if (hiddenPunishment == 1) {
                        let data = {
                            plan_id:plan_id,
                            punishment:punish
                        }
                        let query = `INSERT INTO punish SET ?`;
                        mysql.con.query(query,data, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        punish.forEach(function (punishment) {
                            let data = {
                                plan_id:plan_id,
                                punishment:punishment
                            }
                            let query = `INSERT INTO punish SET ?`;

                            mysql.con.query(query,data, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        });
                    }
                    //periodTime
                    let query = `SELECT time FROM plan WHERE id= ?`;
                    mysql.con.query(query,[plan_id], function (error, result) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                        let a = result[0].time - (1000 * 24 * 60 * 60);//毫秒Date.now()
                        for (var i = 0; i < period; i++) {
                            let j = i + 1;
                            a += (1000 * 24 * 60 * 60);
                            let data = {
                                plan_id:plan_id,
                                day:j,
                                time:a
                            }
                            let query = `INSERT INTO periodTime SET ?`;
                            mysql.con.query(query,data, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                                //rulePerDay 
                                let dataRulePerDay = {
                                    plan_id:plan_id,
                                    day:j,
                                    status:0
                                }               
                                let query = `INSERT INTO rulePerDay SET ?`;
                                mysql.con.query(query,dataRulePerDay, function (error) {
                                    if (error) {
                                        reject("Database query error");
                                        return;
                                    }
                                });
                            });
                        }
                        resolve(plan_id);
                    });

                });
            });

        });
    },
    //
    updateUserImage: function (data) {
        return new Promise(function (resolve, reject) {
            if (!data.image) {
                resolve("請上傳照片，再按更新");
            } else {
                let query = `UPDATE plan SET image='${data.image}' WHERE id= ?`
                mysql.con.query(query,[data.plan_id], function (error) {
                    if (error) {
                        reject("Database query error" + error);
                        return;
                    }
                    resolve("更新計畫照片成功");
                });
            }
        });
    },
    deleteUserPlan: function (plan_id) {
        return new Promise(function (resolve, reject) {
             let query = `DELETE FROM` + '`trigger`' + `WHERE plan_id= ?`
            mysql.con.query(query,[plan_id], function (error) {
                if (error) {
                    reject("Database query error" + error);
                    return;
                }
                let query = `DELETE FROM rules WHERE plan_id= ?`
                mysql.con.query(query,[plan_id], function (error) {
                    if (error) {
                        reject("Database query error" + error);
                        return;
                    }
                    let query = `DELETE FROM rulePerDay WHERE plan_id= ?`;
                    mysql.con.query(query,[plan_id], function (error) {
                        if (error) {
                            reject("Database query error" + error);
                            return;
                        }
                        let query = `DELETE FROM punish WHERE plan_id= ?`
                        mysql.con.query(query,[plan_id],function (error) {
                            if (error) {
                                reject("Database query error" + error);
                                return;
                            }
                            let query = `DELETE FROM planning WHERE plan_id=?`;
                            mysql.con.query(query,[plan_id], function (error) {
                                if (error) {
                                    reject("Database query error" + error);
                                    return;
                                }
                                let query = `DELETE FROM periodTime WHERE plan_id= ?`
                                mysql.con.query(query,[plan_id], function (error) {
                                    if (error) {
                                        reject("Database query error" + error);
                                        return;
                                    }
                                    let query = `DELETE FROM comment WHERE plan_id= ?`;
                                    mysql.con.query(query,[plan_id], function (error) {
                                        if (error) {
                                            reject("Database query error" + error);
                                            return;
                                        }
                                        let query = `DELETE FROM plan WHERE id= ？`
                                        mysql.con.query(query,[plan_id],function (error) {
                                            if (error) {
                                                reject("Database query error" + error);
                                                return;
                                            }
                                            resolve("成功刪除計畫");
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    //end of deleteuserplan
    updateUserPlan: function (data) {
        return new Promise(function (resolve, reject) {
            const { category, plan_id, topic, period, goal, trigger, rules, punish } = data;
            let query = `UPDATE plan SET topic="${topic}",period=${period},goal="${goal}",status=${category} WHERE id=?`
            mysql.con.query(query,[plan_id], function (error) {
                if (error) {
                    reject("Database query error1");
                    return;
                }
                let query = `DELETE FROM` + '`trigger`' + `WHERE plan_id= ?`
                mysql.con.query(query,[plan_id], function (error) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                    for (let i = 0; i < trigger.trigger.length; i++) {
                        let data = {
                            trig:trigger.trigger[i],
                            time:trigger.time[i],
                            plan_id:plan_id
                        }
                        let query = `INSERT INTO` + '`trigger`' + `SET ? `;
                        mysql.con.query(query,data, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    }
                    //rules
                    let query = `DELETE FROM rules WHERE plan_id= ?`
                    mysql.con.query(query,[plan_id], function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                        for (let i = 0; i < rules.length; i++) {
                            let data = {
                                rule:rules[i],
                                plan_id:plan_id

                            }
                            let query = `INSERT INTO rules SET ?`;
                            mysql.con.query(query,data, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        }
                        //punish
                        let query = `DELETE FROM punish WHERE plan_id= ?`
                        mysql.con.query(query,[plan_id], function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                            for (let i = 0; i < parseInt(punish.length); i++) {
                                let data = {
                                    punishment:punish[i],
                                    plan_id:plan_id
                                }
                                let query = `INSERT INTO punish SET ?`;
                                mysql.con.query(query,data, function (error) {
                                    if (error) {
                                        reject("Database query error2");
                                        return;
                                    }
                                });
                            }
                            //timePeriod 
                            let query = `SELECT * FROM periodTime WHERE plan_id= ?`;
                            mysql.con.query(query,[plan_id],function (error, resulttp) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                                if (resulttp.length == period) {
                                    //period沒變不用改period生成的每日匡time
                                    resolve("更新成功！！");
                                } else {
                                    let query = `DELETE FROM periodTime WHERE plan_id= ?`
                                    mysql.con.query(query,[plan_id], function (error) {
                                        if (error) {
                                            reject("Database query error");
                                            return;
                                        }
                                        let query = `SELECT time FROM plan WHERE id=?`;
                                        mysql.con.query(query,[plan_id], function (error, result) {
                                            if (error) {
                                                reject("Database query error");
                                                return;
                                            }
                                            let a = result[0].time - (1000 * 24 * 60 * 60);//毫秒Date.now()
                                            for (var i = 0; i < period; i++) {
                                                let j = i + 1;
                                                a += (1000 * 24 * 60 * 60);
                                                let data = {
                                                    plan_id: plan_id,
                                                    day:j,
                                                    time:a
                                                }
                                                let query = `INSERT INTO periodTime SET ?`;
                                                mysql.con.query(query,data, function (error) {
                                                    if (error) {
                                                        reject("Database query error");
                                                        return;
                                                    }
                                                });
                                            }
                                            resolve("更新成功！！");
                                        });
                                    });
                                }

                            });
                        });

                    });
                });
            });
        });

    },
    selectUserPlan: function (plan_id) {
        return new Promise(function (resolve, reject) {
            let query = `SELECT * FROM plan WHERE id =?`
            mysql.con.query(query,[plan_id], function (error, result) {
                if (error) {
                    reject("Database query error1");
                    return;
                }
                let query = `SELECT rule FROM rules WHERE plan_id = ?`
                let o = {};
                let r = [];
                mysql.con.query(query,[plan_id], function (error, resultr) {
                    if (error) {
                        reject("Database query error2");
                        return;
                    }
                    o.user_name = result[0].user_name;
                    o.topic = result[0].topic;
                    o.period = result[0].period;
                    o.goal = result[0].goal;
                    o.status = result[0].status;
                    o.timee = result[0].time;
                    resultr.forEach(function (rule) {
                        r.push(rule.rule);
                    });
                    o.rules = r;
                    let query = `SELECT trig, time FROM ` + '`trigger`' + ` WHERE plan_id=?`;
                    mysql.con.query(query,[plan_id], function (error, resultt) {
                        if (error) {
                            reject("Database query error3");
                            return;
                        }
                        o.trigger = resultt;
                        let query = `SELECT punishment FROM punish WHERE plan_id= ?`;
                        mysql.con.query(query,[plan_id], function (error, resultp) {
                            if (error) {
                                reject("Database query error4");
                                return;
                            }
                            o.punish = resultp;
                            //
                            let a = [];
                            let query = `SELECT time FROM periodTime WHERE plan_id= ?`;
                            mysql.con.query(query,[plan_id], function (error, resultpt) {
                                if (error) {
                                    reject("Database query error5");
                                    return;
                                }
                                resultpt.forEach(function (time) {
                                    a.push(time.time);
                                });
                                o.time = a;
                                resolve(o);
                            });
                        });
                    });

                });
            });
        });
    },
    insertPerDay: function (data) {
        return new Promise(function (resolve, reject) {
            const { plan_id, day, hiddenComment, comment, hiddenPlanning, plantext, checkboxPlan0 } = data;
            //comment
            if (hiddenComment == 1) {
                let data = {
                    plan_id:plan_id,
                    day:day,
                    comment:comment
                }
                let query = `INSERT INTO comment SET ?`;
                mysql.con.query(query,data, function (error) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                });
            } else {
                comment.forEach(function (com) {
                    let data = {
                        plan_id:plan_id,
                        day:day,
                        comment:com
                    }
                    let query = `INSERT INTO comment(plan_id,day,comment) VALUES (${plan_id},${day},"${com}");`;
                    mysql.con.query(query,data, function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                    });
                });
            }
            //planning
            if (hiddenPlanning == 1) {
                if (!checkboxPlan0) {
                    let data = {
                        plan_id:plan_id,
                        day:day,
                        plan:plantext,
                        status:0
                    }
                    let query = `INSERT INTO planning SET ?`;
                    mysql.con.query(query,data, function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                    });
                } else {
                    let data = {
                        plan_id:plan_id,
                        day:day,
                        plan:plantext,
                        status:checkboxPlan0
                    }
                    let query = `INSERT INTO planning SET ?`;
                    mysql.con.query(query,data, function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                    });
                }
            } else {
                for (var i = 0; i < hiddenPlanning; i++) {
                    var a = "checkboxPlan" + i;
                    // console.log(i, data[a]);
                    if (!data[a]) {
                        let query = `INSERT INTO planning(plan_id,day,plan,status) VALUES (${plan_id},${day},"${plantext[i]}",0);`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        let query = `INSERT INTO planning(plan_id,day,plan,status) VALUES (${plan_id},${day},"${plantext[i]}",1);`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    }
                }
            }
            //rule
            let query = `SELECT rule FROM rules WHERE plan_id = ${plan_id};`;
            mysql.con.query(query, function (error, result) {
                if (error) {
                    reject("Database query error");
                    return;
                }
                for (var i = 0; i < result.length; i++) {
                    var a = "rule" + i;
                    if (!data[a]) {
                        //console.log("not done", a);
                        let query = `INSERT INTO rulePerDay(plan_id,day,status) VALUES (${plan_id},${day},0);`;
                        //console.log(query);
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        let query = `INSERT INTO rulePerDay(plan_id,day,status) VALUES (${plan_id},${day},1);`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    }
                }
                resolve(data);
            });
        });
    },
    selectUserPerDay: function (plan_id, DAY) {
        return new Promise(function (resolve, reject) {
            //rulePerDay, Planning, Comment
            let o = {};
            let query = `SELECT comment FROM comment WHERE plan_id =${plan_id} and day= ?`
            mysql.con.query(query,[DAY], function (error, result) {
                if (error) {
                    reject("Database query error");
                    return;
                }
                o.comment = result;
                let query = `SELECT plan,status FROM planning WHERE plan_id =${plan_id} and day= ?`
                mysql.con.query(query,[DAY], function (error, resultp) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                    o.planning = resultp;
                    let query = `SELECT status FROM rulePerDay WHERE plan_id= ${plan_id} and day= ?`;
                    mysql.con.query(query,[DAY], function (error, resultr) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                        o.ruleStatus = resultr;
                        resolve(o);
                    });

                });
            });
        });
    },
    deletePerDay: function (data) {
        return new Promise(function (resolve, reject) {
            const { plan_id, day } = data;
            let query = `DELETE FROM rulePerDay WHERE plan_id=${plan_id} AND day= ?`;
            mysql.con.query(query,[DAY], function (error) {
                if (error) {
                    reject("Database query error");
                    return;
                }
                let query = `DELETE FROM planning WHERE plan_id=${plan_id} AND day=?`;
                mysql.con.query(query,[DAY], function (error) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                    let query = `DELETE FROM comment WHERE plan_id=${plan_id} AND day=?`;
                    mysql.con.query(query,[DAY], function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                        resolve("deleteperday");
                    });
                });
            });
        });
    }

};//end of module.exports


