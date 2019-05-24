// MySQL Initialization
const mysql = require("../mysqlcon.js");
// Build DAO Object
module.exports = {
    insertUserPlan: function (data) {
        return new Promise(function (resolve, reject) {
            const { user_name, user_id, category, topic, period, goal, rules, trigger, punish, hiddenRule, hiddenTrig, triggerTime, hiddenPunishment, image } = data;
            let query = `INSERT INTO plan(topic,period,goal,user_id,user_name,status,image,time) VALUES ("${topic}","${period}","${goal}",${user_id},"${user_name}",${category},"${image}",${Date.now()});`;
            mysql.con.query(query, function (error) {
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
                        let query = `INSERT INTO rules(plan_id) VALUES (${plan_id});`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else if (hiddenRule == 1) {
                        let query = `INSERT INTO rules(plan_id,rule) VALUES (${plan_id},"${rules}");`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        rules.forEach(function (rule) {
                            let query = `INSERT INTO rules(plan_id,rule) VALUES (${plan_id},"${rule}");`;
                            mysql.con.query(query, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        });
                    }
                    //trigger
                    if (!hiddenTrig) {
                        let query = `INSERT INTO` + '`trigger`' + ` (plan_id) VALUES (${plan_id});`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else if (hiddenTrig == 1) {
                        let query = `INSERT INTO ` + '`trigger`' + ` (plan_id,trig,time) VALUES (${plan_id},"${trigger}","${triggerTime}");`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        for (var i = 0; i < hiddenTrig; i++) {
                            let query = `INSERT INTO ` + '`trigger`' + ` (plan_id,trig,time) VALUES (${plan_id},"${trigger[i]}","${triggerTime[i]}");`;
                            mysql.con.query(query, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        }
                    }
                    //punish
                    if (!hiddenPunishment) {
                        let query = `INSERT INTO punish(plan_id) VALUES (${plan_id});`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }

                        });
                    } else if (hiddenPunishment == 1) {
                        let query = `INSERT INTO punish(plan_id,punishment) VALUES (${plan_id},"${punish}");`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    } else {
                        punish.forEach(function (punishment) {
                            let query = `INSERT INTO punish(plan_id,punishment) VALUES (${plan_id},"${punishment}");`;

                            mysql.con.query(query, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        });
                    }
                    //periodTime
                    let query = `SELECT time FROM plan WHERE id=${plan_id}`;
                    mysql.con.query(query, function (error, result) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                        let a = result[0].time - (1000 * 24 * 60 * 60);//毫秒Date.now()
                        for (var i = 0; i < period; i++) {
                            let j = i + 1;
                            a += (1000 * 24 * 60 * 60);
                            let query = `INSERT INTO periodTime(plan_id,day,time) VALUES(${plan_id}, ${j} ,${a})`;
                            mysql.con.query(query, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                                //rulePerDay                
                                let query = `INSERT INTO rulePerDay(plan_id,day,status) VALUES(${plan_id}, ${j} ,0)`;
                                mysql.con.query(query, function (error) {
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
                let query = `UPDATE plan SET image='${data.image}' WHERE id=${data.plan_id};`
                mysql.con.query(query, function (error) {
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
            let query = `DELETE FROM` + '`trigger`' + `WHERE plan_id= ${plan_id};`
            mysql.con.query(query, function (error) {
                if (error) {
                    reject("Database query error" + error);
                    return;
                }
                let query = `DELETE FROM rules WHERE plan_id= ${plan_id};`
                mysql.con.query(query, function (error) {
                    if (error) {
                        reject("Database query error" + error);
                        return;
                    }
                    let query = `DELETE FROM rulePerDay WHERE plan_id=${plan_id} ;`;
                    mysql.con.query(query, function (error) {
                        if (error) {
                            reject("Database query error" + error);
                            return;
                        }
                        let query = `DELETE FROM punish WHERE plan_id= ${plan_id};`
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error" + error);
                                return;
                            }
                            let query = `DELETE FROM planning WHERE plan_id=${plan_id} ;`;
                            mysql.con.query(query, function (error) {
                                if (error) {
                                    reject("Database query error" + error);
                                    return;
                                }
                                let query = `DELETE FROM periodTime WHERE plan_id= ${plan_id};`
                                mysql.con.query(query, function (error) {
                                    if (error) {
                                        reject("Database query error" + error);
                                        return;
                                    }
                                    let query = `DELETE FROM comment WHERE plan_id=${plan_id} ;`;
                                    mysql.con.query(query, function (error) {
                                        if (error) {
                                            reject("Database query error" + error);
                                            return;
                                        }
                                        let query = `DELETE FROM plan WHERE id= ${plan_id};`
                                        mysql.con.query(query, function (error) {
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
            let query = `UPDATE plan SET topic="${topic}",period=${period},goal="${goal}",status=${category} WHERE id=${plan_id};`
            mysql.con.query(query, function (error) {
                if (error) {
                    reject("Database query error1");
                    return;
                }
                let query = `DELETE FROM` + '`trigger`' + `WHERE plan_id= ${plan_id};`
                mysql.con.query(query, function (error) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                    for (let i = 0; i < trigger.trigger.length; i++) {
                        let query = `INSERT INTO` + '`trigger`' + `(trig,time,plan_id) VALUES ("${trigger.trigger[i]}","${trigger.time[i]}",${plan_id})`;
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                        });
                    }
                    //rules
                    let query = `DELETE FROM rules WHERE plan_id= ${plan_id};`
                    mysql.con.query(query, function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                        for (let i = 0; i < rules.length; i++) {
                            let query = `INSERT INTO rules(rule,plan_id) VALUES ("${rules[i]}",${plan_id})`;
                            mysql.con.query(query, function (error) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                            });
                        }
                        //punish
                        let query = `DELETE FROM punish WHERE plan_id= ${plan_id};`
                        mysql.con.query(query, function (error) {
                            if (error) {
                                reject("Database query error");
                                return;
                            }
                            for (let i = 0; i < parseInt(punish.length); i++) {
                                let query = `INSERT INTO punish(punishment,plan_id) VALUES ("${punish[i]}",${plan_id})`;
                                mysql.con.query(query, function (error) {
                                    if (error) {
                                        reject("Database query error2");
                                        return;
                                    }
                                });
                            }
                            //timePeriod 
                            let query = `SELECT * FROM periodTime WHERE plan_id=${plan_id}`;
                            mysql.con.query(query, function (error, resulttp) {
                                if (error) {
                                    reject("Database query error");
                                    return;
                                }
                                if (resulttp.length == period) {
                                    //period沒變不用改period生成的每日匡time
                                    resolve("更新成功！！");
                                } else {
                                    let query = `DELETE FROM periodTime WHERE plan_id= ${plan_id};`
                                    mysql.con.query(query, function (error) {
                                        if (error) {
                                            reject("Database query error");
                                            return;
                                        }
                                        let query = `SELECT time FROM plan WHERE id=${plan_id}`;
                                        mysql.con.query(query, function (error, result) {
                                            if (error) {
                                                reject("Database query error");
                                                return;
                                            }
                                            let a = result[0].time - (1000 * 24 * 60 * 60);//毫秒Date.now()
                                            for (var i = 0; i < period; i++) {
                                                let j = i + 1;
                                                a += (1000 * 24 * 60 * 60);
                                                let query = `INSERT INTO periodTime(plan_id,day,time) VALUES(${plan_id}, ${j} ,${a})`;
                                                mysql.con.query(query, function (error) {
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
            let query = `SELECT * FROM plan WHERE id =${plan_id};`
            mysql.con.query(query, function (error, result) {
                if (error) {
                    reject("Database query error1");
                    return;
                }
                let query = `SELECT rule FROM rules WHERE plan_id = ${plan_id};`
                let o = {};
                let r = [];
                mysql.con.query(query, function (error, resultr) {
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
                    let query = `SELECT trig, time FROM ` + '`trigger`' + ` WHERE plan_id= ${plan_id};`;
                    mysql.con.query(query, function (error, resultt) {
                        if (error) {
                            reject("Database query error3");
                            return;
                        }
                        o.trigger = resultt;
                        let query = `SELECT punishment FROM punish WHERE plan_id= ${plan_id};`;
                        mysql.con.query(query, function (error, resultp) {
                            if (error) {
                                reject("Database query error4");
                                return;
                            }
                            o.punish = resultp;
                            //
                            let a = [];
                            let query = `SELECT time FROM periodTime WHERE plan_id= ${plan_id};`;
                            mysql.con.query(query, function (error, resultpt) {
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
                let query = `INSERT INTO comment(plan_id,day,comment) VALUES (${plan_id},${day},"${comment}");`;
                mysql.con.query(query, function (error) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                });
            } else {
                comment.forEach(function (com) {
                    let query = `INSERT INTO comment(plan_id,day,comment) VALUES (${plan_id},${day},"${com}");`;
                    mysql.con.query(query, function (error) {
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
                    let query = `INSERT INTO planning(plan_id,day,plan,status) VALUES (${plan_id},${day},"${plantext}",0);`;
                    mysql.con.query(query, function (error) {
                        if (error) {
                            reject("Database query error");
                            return;
                        }
                    });
                } else {
                    let query = `INSERT INTO planning(plan_id,day,plan,status) VALUES (${plan_id},${day},"${plantext}",${checkboxPlan0});`;
                    mysql.con.query(query, function (error) {
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
            let query = `SELECT comment FROM comment WHERE plan_id =${plan_id} and day=${DAY};`
            mysql.con.query(query, function (error, result) {
                if (error) {
                    reject("Database query error");
                    return;
                }
                o.comment = result;
                let query = `SELECT plan,status FROM planning WHERE plan_id =${plan_id} and day=${DAY};`
                mysql.con.query(query, function (error, resultp) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                    o.planning = resultp;
                    let query = `SELECT status FROM rulePerDay WHERE plan_id= ${plan_id} and day=${DAY};`;
                    mysql.con.query(query, function (error, resultr) {
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
            let query = `DELETE FROM rulePerDay WHERE plan_id=${plan_id} AND day=${day};`;
            mysql.con.query(query, function (error) {
                if (error) {
                    reject("Database query error");
                    return;
                }
                let query = `DELETE FROM planning WHERE plan_id=${plan_id} AND day=${day};`;
                mysql.con.query(query, function (error) {
                    if (error) {
                        reject("Database query error");
                        return;
                    }
                    let query = `DELETE FROM comment WHERE plan_id=${plan_id} AND day=${day};`;
                    mysql.con.query(query, function (error) {
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


