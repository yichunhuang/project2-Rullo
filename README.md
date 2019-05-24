# Rullo
This website is designed for people who love planning, especially those who often have no idea how to make a good plan. By sharing, users can view all the public plans made from others.

Website URL: https://17runa.com/index
# Backend Technique
### Programming Language
- JavaScript
### Environment and Framework
- Linux
- Node.js
- Express.js
### SQL Database
- MySQL
- CRUD
- Data Models: One-to-One, One-to-Many, Many-to-Many
- Database Optimization: Primary Key, Foreign Key
### Cloud Service
- AWS EC2
### Networking
- HTTP and HTTPS
- Domain Name System (DNS)
### Key Concepts
- RESTful APIs
- Patterns: MVC and DAO
- Unit Test: Mocha
- Version Control: Git and GitHub
# Front-End Technique
### Programming Language
- HTML, CSS
### Library and Framework
- Bootstrap
---
# Schema Diagram

![](https://upload.cc/i1/2019/05/22/Yh9E3x.png)
---
# Main Features
- Member System ：Support Gmail login
- Planning System：Users can create,view, edit and delete their plans
- Scheduling System：If users haven't finish their daily planning, those unfinished works will be postponed to tomorrow.  Besides,if users haven't complied with their daily rules, there will have a punishment added to next day.
- Google Calendar：Users can insert their plans into Google Calendar
- Recommending System ：Recommend users the information of online bookstore
# Demonstration
In the home page, users can see all the public plans, and find the specific plans through the search bar.

![](https://upload.cc/i1/2019/05/21/zvqNEO.png)

After login, users can click My Plans to view their own plans and create new one.


![](https://upload.cc/i1/2019/05/21/dl2CfY.png)

 
Design personal schedule:
*  Upload a photo for the plan
 * Rules is the daily routine during the period of the plan.
 * Punishment will appear  if users do not obey the rules
 
 ![](https://upload.cc/i1/2019/05/21/24EbDT.png)
 

View the plan:
* Users can see the corresponding blocks of daily plan according to the period of the plan
* Uses can insert their plans into Google Calendar
* Recommend users the information of online bookstore

![](https://upload.cc/i1/2019/05/21/3JAGnx.png)


* Click the button My Plan, then userscan modify their plan.

![](https://upload.cc/i1/2019/05/21/cHQqKF.png)


Edit daily plan:
* If the rules are done, check the completion, otherwise the punishment will appear to tomorrow.

![](https://upload.cc/i1/2019/05/21/dJvCc0.png)





---

# Rullo-API-Doc

### Public Plans API
### Host Name

17runa.com

### Response Object

* `Public Plan Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Plan ID. |
| topic | String | Plan's Topic. |
| goal | String | Plan's Goal. |
| image | String  | Plan's Image. |
| user_id | Number | User ID. |
| user_name | String | User's Name. |

* `Private Plan Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Plan ID. |
| topic | String | Plan's Topic. |
| period | Number | The day number of the plan. |
| goal | String | Plan's Goal. |
| user_id | Number | User ID. |
| status | Number  | The status of the plan( 0 : public, 1 : private). |
| image | String  | Plan's Image. |
| user_name | String | User's Name. |
| time | String | The creation time of the plan. |
| click_number | Number |The clicked number of the plan.  |

* `Day Plan Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| user_name | String | User's Name. |
| topic | String | Plan's Topic. |
| period | Number | The day number of the plan. |
| goal | String | Plan's Goal. |
| status | Number  | The status of the plan( 0 : public, 1 : private). |
| timee | Number | The creation time of the plan. |
| rules | Array | Plan's Rules. |
| trigger | Array | Plan's Trigger. |
| punish | Array  | Plan's Punishment. |
| time | Array | The period time of the plan. |

* `Per Day Plan Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| comment | Array | Day Comment. |
| planning | Array | Day Planning and status ( 0: not done, 1: done ). |
| ruleStatus | Array | The status of rules ( 0: not done, 1: done ) . |


* `User Search Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Plan ID. |
| topic | String | Plan's Topic. |
| period | Number | The day number of the plan. |
| goal | String | Plan's Goal. |
| user_id | Number | User ID. |
| status | Number  | The status of the plan( 0 : public, 1 : private). |
| image | String  | Plan's Image. |
| user_name | String | User's Name. |
| time | String | The creation time of the plan. |
| click_number | Number |The clicked number of the plan.  |

* `Search Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Plan ID. |
| topic | String | Plan's Topic. |
| period | Number | The day number of the plan. |
| goal | String | Plan's Goal. |
| user_id | Number | User ID. |
| status | Number  | The status of the plan( 0 : public, 1 : private). |
| image | String  | Plan's Image. |
| user_name | String | User's Name. |
| time | String | The creation time of the plan. |
| click_number | Number |The clicked number of the plan.  |

---

* **End Point:** `/public`

* **Method:** `GET`

* **Request Example:**

`https://[HOST_NAME]/api/public`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| Array | Array of `Public Plan Object`. |


* **Success Response Example:**

```
[
{
id: 3,
topic: "廚藝",
goal: "煎魚",
image: "uploads/planImage-1556464224922",
user_id: 1,
user_name: "Runa Wang"
},
{
id: 4,
topic: "程式技術",
goal: "看完《為你自己學 Git！》",
image: "uploads/planImage-1556465323944",
user_id: 2,
user_name: "王如如"
},
{
id: 5,
topic: "閱讀",
goal: "《傲慢與偏見》",
image: "uploads/planImage-1556467141376",
user_id: 2,
user_name: "王如如"
}
]
```
* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Database query error"
}
```
---

### Private Plan API

* **End Point:** `/private`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| name | String | The name of the user. |


* **Request Example:**

`https://[HOST_NAME]/api/private?name=Runa Wang`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| Array | Array of `Private Plan Object`. |
| name | String | The name of the user. |

* **Success Response Example:**

```
[
{
id: 2,
topic: " 鋼琴",
period: 7,
goal: "會彈青花瓷",
user_id: 1,
status: 0,
image: "uploads/planImage-1556455949155",
user_name: "Runa Wang",
time: "1556455949175",
click_number: 0
},
{
id: 3,
topic: "廚藝",
period: 10,
goal: "煎魚",
user_id: 1,
status: 1,
image: "uploads/planImage-1556464224922",
user_name: "Runa Wang",
time: "1556464224936",
click_number: 0
}
]
```
* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Database query error"
}
```
---

### Day Plan API

* **End Point:** `/days`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| plan_id | Number | Plan ID. |


* **Request Example:**

`https://[HOST_NAME]//days?plan_id=3`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| Object |  `Day Plan Object`. |
| plan_id | Number | Plan ID. |

* **Success Response Example:**

```
{
user_name: "Runa Wang",
topic: "廚藝",
period: 10,
goal: "煎魚",
status: 1,
timee: "1556464224936",
rules: [
"每天煎一條魚",
"每天請人品嚐並給分數"
],
trigger: [
{
trig: "買魚！",
time: "08:00"
}
],
punish: [
{
punishment: "煎兩條魚"
}
],
time: [
"1556464224936",
"1556550624936",
"1556637024936",
"1556723424936",
"1556809824936",
"1556896224936",
"1556982624936",
"1557069024936",
"1557155424936",
"1557241824936"
]
}

```
* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Database query error"
}
```
---

### Per Day Plan API

* **End Point:** `/perday`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| DAY | Number | Day Number. |
| plan_id | Number | Plan ID. |


* **Request Example:**

`https://[HOST_NAME]/perday?DAY=1&plan_id=2`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| Object |  `Per Day Plan Object`. |
| DAY | Number | Day Number. |
| plan_id | Number | Plan ID. |

* **Success Response Example:**

```
{
comment: [
{
comment: "簡單"
}
],
planning: [
{
plan: "彈第一小節",
status: 0
}
],
ruleStatus: [
{
status: 1
},
{
status: 0
}
]
}

```
* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Database query error"
}
```
---

### Insert Per Day API

* **End Point:** `/perDay`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json`. |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :---: |
| plan_id | Number | Required |
| day | Number | Required |
| plantext | String | Required |
| comment | String | Required |
| hiddenPlanning | String | Required |
| hiddenComment | String | Required |
| checkboxPlan0 | Number | Optional |
| checkboxPlan1 | Number | Optional |
| checkboxPlan2 | Number | Optional |
| ... | Number | Optional |
| rule0 | Number | Optional |
| rule1 | Number | Optional |
| rule2 | Number | Optional |
| ... | Number | Optional |

* **Request Body Example:**

```
{
"plan_id":"2",
"day":"1",
"hiddenPlanning":"1",
"plantext":["搭配節拍器，彈第一小節"],
"hiddenComment":"1",
"comment":["簡單"],
"rule0":"1"
}
```

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| success | String | Success message. |

* **Success Response Example:**

```
{
"success": "successfully inserted per day plan"
```

* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Invalid request body."
}
```
---

* **End Point:** `/search`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| topic | String | Searched Topic. |


* **Request Example:**

`https://[HOST_NAME]/api/search?topic=攝影`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| Array | Array of `Search Object`. |


* **Success Response Example:**

```
[
{
id: 9,
topic: "攝影",
period: 20,
goal: "會拍散景",
user_id: 4,
status: 1,
image: "uploads/planImage-1556520534661",
user_name: "王如如",
time: "1556520534665",
click_number: 0
}
]
```
* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Database query error"
}
```

---

* **End Point:** `/userSearch`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| topic | String | Searched Topic. |


* **Request Example:**

`https://[HOST_NAME]/userSearch?name=Runa Wang&search=廚藝`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| Array | Array of `User Search Object`. |


* **Success Response Example:**

```
[
{
id: 3,
topic: "廚藝",
period: 10,
goal: "煎魚",
user_id: 1,
status: 1,
image: "uploads/planImage-1556464224922",
user_name: "Runa Wang",
time: "1556464224936",
click_number: 0
}
]
```
* **Error Response: 4XX**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
"error": "Database query error"
}
```













