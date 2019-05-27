const express = require('express');
const router = express.Router();
const mysql = require("../mysqlcon.js");
 router.get('/', (req, res) => {
    var promise = new Promise(function (resolve, reject) {
        let query = `SELECT id,period FROM plan`;
        mysql.con.query(query, function (error, result) {//result: #plan=result.length
            if (error) {
                reject("Database query error" + error);
                return;
            }
             //console.log(result[0].period); 
            // console.log(result[0].id); 
            for (let i = 0; i < result.length; i++) {
                let query2 = `SELECT time,day FROM periodTime where plan_id = ?`;
                mysql.con.query(query2,[result[i].id], function (error, result2) {//each plan 的period數(result[i].period) 應該要等於生成time #（result2.length）
                    if (error) {
                        reject("Database query error" + error);
                        return;
                    }
                   // console.log(result2);
                    //result2[0].day
                    let final = parseInt(result2.length) - 1;
                    if (Date.now() - parseInt(result2[final].time) > 86400000) {
                        //此計畫已經到期
                        console.log(result[i].id,"此計畫已經到期");
                        resolve("dead");
                    } else {
                        // console.log("haha");
                        // console.log(result2[0].time);
                        for (let j = 0; j < result2.length; j++) {//86400000:24hr  48588389,  48hr: 1000 * 48 * 60 * 60
                            if (Date.now() - parseInt(result2[j].time) > 86400000 && 172800000 > Date.now() - parseInt(result2[j].time)) {

                                //設定排程:
                                console.log("設定plan_id:", result[i].id, "的排程,day:", result2[j].day);
                                //1. 看每日planning 完成沒 沒有完成就順延到明日
                                let query3 = `SELECT status,plan FROM planning where plan_id =${result[i].id} and day= ?`;
                                mysql.con.query(query3,[result2[j].day], function (error, result3) {//each plan, each day的 #planning = result3.length
                                    if (error) {
                                        reject("Database query error" + error);
                                        return;
                                    }
                                    for (let k = 0; k < result3.length; k++) {
                                        if (result3[k].status == 0) {
                                            //明日的planning增加此未完成之計畫
                                            let tomorrow = parseInt(result2[j].day) + 1;
                                            let data = {
                                                plan_id:result[i].id,
                                                day:tomorrow,
                                                status:0,
                                                plan:result3[k].plan
                                            }
                                            let query4 = `INSERT INTO planning SET ?`;
                                            mysql.con.query(query4,data, function (error) {
                                                if (error) {
                                                    reject("Database query error" + error);
                                                    return;
                                                }
                                            });
                                        }
                                    }
                                });
                                //2. 看每日必做有沒有做 沒有就增加處罰
                                let query5 = `SELECT status FROM rulePerDay where plan_id =${result[i].id} and day= ?`;
                                mysql.con.query(query5,[result2[j].day], function (error, result4) {//each plan, each day的 #rule status = result4.length
                                    if (error) {
                                        reject("Database query error" + error);
                                        return;
                                    }
                                   // console.log(result4[0].status);
                                    let a = 1;
                                    for (let l = 0; l < result4.length; l++) {
                                        if (result4[l].status == 0) {
                                            a = 0;
                                        }
                                    }
                                   // console.log("a",a);
                                    if (a == 0) {//有一rule沒做 a 就等於0 
                                        //明日的planning增加處罰
                                        let query6 = `SELECT punishment FROM punish where plan_id = ?`;
                                        mysql.con.query(query6,[result[i].id], function (error, result5) {//each plan的 punishment
                                            if (error) {
                                                reject("Database query error" + error);
                                                return;
                                            }
                                            for (let m = 0; m < result5.length; m++) {
                                                let tomorrow = parseInt(result2[j].day) + 1;
                                                let data = {
                                                    plan_id:result[i].id,
                                                    day:tomorrow,
                                                    status:0,
                                                    plan:result5[m].punishment
                                                }
                                                let query7 = `INSERT INTO planning SET ?`;
                                                mysql.con.query(query7,data, function (error) {
                                                    if (error) {
                                                        reject("Database query error" + error);
                                                        return;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            }
            resolve("設定排程");
        });
    });
    promise.then(function (q) {
        res.json(q);
      //  console.log(q);
    }).catch(function (error) {
        res.send({ error: error });
    });
 });





module.exports = router;


