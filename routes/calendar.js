const express = require('express');
const router = express.Router();
const mysql = require("../mysqlcon.js");
const googleSetting = require("../googleSetting.js");
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
    googleSetting.client_secret,
    googleSetting.client_id,
    "https://17runa.com/calendar/api/get"


);
const scopes = ['https://www.googleapis.com/auth/calendar'];
let plan_id;
//http://localhost:3000/calendar?id=170
router.get('/', (req, res) => {
    let { id } = req.query;

    plan_id = id;
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(authUrl);
});
router.get('/api/get', (req, res) => {
    let { code } = req.query;
    oauth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oauth2Client.setCredentials(token);
        createEvents(oauth2Client);
    });
    function createEvents(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
        let query = `SELECT * FROM plan WHERE id=${plan_id}`;
        mysql.con.query(query, function (error, result) {
            if (error) {
                res.send("Database query error" + error);
            }
            let starttime = parseInt(result[0].time);
            let startdate = new Date(starttime);
            let endtime = parseInt(starttime + (result[0].period - 1) * 86400000);
            let enddate = new Date(endtime);
            //rules
            let query = `SELECT rule FROM rules WHERE plan_id=${plan_id}`;
            mysql.con.query(query, function (error, resultr) {
                if (error) {
                    res.send("Database query error" + error);
                }
                let rules = "每日必做: ";
                resultr.forEach(function (rule) {
                    // console.log(rule.rule); rule: RowDataPacket { rule: '每天練唱3小' }
                    rules += rule.rule + ",";
                });
                let mainevent = {//plan
                    'summary': result[0].topic + ": " + result[0].goal,
                    'description': rules,
                    'start': {
                        'dateTime': startdate,
                        'timeZone': 'Asia/Taipei',
                    },
                    'end': {
                        'dateTime': enddate,
                        'timeZone': 'Asia/Taipei',
                    }, 'reminders': {
                        'useDefault': false,
                        'overrides': [
                            //   {'method': 'email', 'minutes': 24 * 60},
                            { 'method': 'popup', 'minutes': 0 },
                        ],
                    },
                };
                insertPlan(mainevent);
                function insertPlan(mainevent) {
                    calendar.events.insert({
                        auth: auth,
                        calendarId: 'primary',
                        resource: mainevent,
                    }, function (err, event) {
                        if (err) {
                            console.log('There was an error contacting the Calendar service: ' + err);
                            insertPlan(mainevent);
                            return;
                        }
                        console.log('Event created: %s', event.htmlLink);
                    });
                }
                //planning
                let query = `SELECT pt.plan_id,pt.day,pt.time,planning.plan FROM periodTime AS pt,planning WHERE planning.plan_id = pt.plan_id AND planning.day = pt.day AND planning.plan_id =${plan_id}`;
                mysql.con.query(query, function (error, resultp) {
                    if (error) {
                        return console.log("Database query error" + error);
                    }
                    // console.log(resultp);
                    for (let i = 0; i < resultp.length; i++) {
                        let event = {
                            'summary': resultp[i].plan,
                            'start': {
                                'dateTime': new Date(parseInt(resultp[i].time)),
                                'timeZone': 'Asia/Taipei'
                            },
                            'end': {
                                'dateTime': new Date(parseInt(resultp[i].time)),
                                'timeZone': 'Asia/Taipei'
                            },
                            'reminders': {
                                'useDefault': false,
                                'overrides': [
                                    //   {'method': 'email', 'minutes': 24 * 60},
                                    { 'method': 'popup', 'minutes': 0 }
                                ],
                            },
                        };
                        insertPlanning(event);
                        function insertPlanning(event) {
                            calendar.events.insert({
                                auth: auth,
                                calendarId: 'primary',
                                resource: event,
                            }, (err, e) => {
                                if (err) {
                                    console.log('There was an error contacting the Calendar service: ' + err + 'err code' + +err.code + " planning i:" + i);
                                    insertPlanning(event);
                                    return;
                                }
                                console.log('Event created: %s', e.data);
                            });
                        }
                    }
                    //comment
                    let query = `SELECT pt.plan_id,pt.day,pt.time,c.comment FROM periodTime AS pt,comment AS c WHERE c.plan_id = pt.plan_id AND c.day = pt.day AND c.plan_id =${plan_id}`;
                    mysql.con.query(query, function (error, resultc) {
                        if (error) {
                            return console.log("Database query error" + error);
                        }
                        console.log(resultc);

                        for (let i = 0; i < resultc.length; i++) {
                            //console.log(resultct[i].time);                      
                            let event = {
                                'summary': resultc[i].comment,
                                'start': {
                                    'dateTime': new Date(parseInt(resultc[i].time)),
                                    'timeZone': 'Asia/Taipei'
                                },
                                'end': {
                                    'dateTime': new Date(parseInt(resultc[i].time)),
                                    'timeZone': 'Asia/Taipei'
                                },
                                'reminders': {
                                    'useDefault': false,
                                    'overrides': [
                                        //   {'method': 'email', 'minutes': 24 * 60},
                                        { 'method': 'popup', 'minutes': 0 }
                                    ],
                                },
                            };
                            insertComment(event);
                            function insertComment(event) {
                                calendar.events.insert({
                                    auth: auth,
                                    calendarId: 'primary',
                                    resource: event,
                                }, (err, e) => {
                                    if (err) {
                                        console.log('There was an error contacting the Calendar service: ' + err + 'err code' + +err.code + " comment i:" + i);
                                        insertPlanning(event);
                                        return;
                                    }
                                    console.log('Event created: %s', e.data);
                                });
                            }
                        };

                    });
                });

            });
        });
    }
    let url = "https://17runa.com/day?plan_id=" + plan_id + "&insertcalendar=ok";
    res.redirect(url);
})
module.exports = router;