const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

router.get("/", function (req, res) {
  let { a } = req.query;
  var key = ['python', 'Java', '機器學習', '人工智慧', 'MySQL', 'NoSQL', '演算法', '廚藝'];
  var sub_site = ['https://www.books.com.tw/web/sys_bbotm/books/190504/?loc=P_0038_005',
    'https://www.books.com.tw/web/sys_bbotm/books/190503/?loc=P_0001_3_004',
    'https://www.books.com.tw/web/sys_bbotm/books/190102/?loc=P_0001_3_002',
    'https://www.books.com.tw/web/sys_bbotm/books/190102/?loc=P_0001_3_002',
    'https://www.books.com.tw/web/sys_bbotm/books/190405/?loc=P_0001_3_004',
    'https://www.books.com.tw/web/sys_bbotm/books/190406/?loc=P_0001_3_005',
    'https://www.books.com.tw/web/sys_bbotm/books/190508/?loc=P_0001_3_007',
    'https://www.books.com.tw/web/books_bmidm_0907/?loc=P_0005_2_007'];

  for (let i = 0; i < 9; i++) {
    //let words = key[i];
    if (a.indexOf(key[i]) != -1) {
      var web = sub_site[i];
    }
  }
  request({
    url: web,
    method: "GET"
  }, function (e, r, b) {
    if (e || !b) { return; }
    var $ = cheerio.load(b);
    let data = {};
    var titles = $("div.msg h4 a");
    var photos = $("div.item a img");
    //var links = $("div.msg h4 a");
    let title = [];
    let image = [];
    let href = [];
    for (var i = 0; i < 5; i++) {
      title[i] = $(titles[i]).text();
      image[i] = $(photos[i]).attr("src");
      href[i] = $(titles[i]).attr("href");
      // show += "<div class=\"card\" style=\"width: 12rem;\">" + $(titles[i]).text() + "<img src='" + $(photos[i]).attr("src") + "' class='card-img-top' ><div class='card-body'><a href='" + $(titles[i]).attr("href") + "'>" + $(titles[i]).text() + "</a></div></div>";
    }
    data.title = title;
    data.image = image;
    data.href = href;
    // fs.writeFileSync("result.json", JSON.stringify(result));
    let d = JSON.stringify(data);
    res.send(d);
  });
}
);

// python https://www.books.com.tw/web/sys_bbotm/books/190504/?loc=P_0038_005
// Java https://www.books.com.tw/web/sys_bbotm/books/190503/?loc=P_0001_3_004
// 機器學習 https://www.books.com.tw/web/sys_bbotm/books/190102/?loc=P_0001_3_002
// 人工智慧 https://www.books.com.tw/web/sys_bbotm/books/190102/?loc=P_0001_3_002
// MySQL https://www.books.com.tw/web/sys_bbotm/books/190405/?loc=P_0001_3_004
// NoSQL https://www.books.com.tw/web/sys_bbotm/books/190406/?loc=P_0001_3_005
// Javascript https://www.books.com.tw/web/sys_bbotm/books/190601/?loc=P_0001_3_001
// Node.js https://www.books.com.tw/web/sys_bbotm/books/190601/?loc=P_0001_3_001
// HTML & CSS https://www.books.com.tw/web/sys_bbotm/books/190602/?loc=P_0001_3_002
// PHP https://www.books.com.tw/web/sys_bbotm/books/190604/?loc=P_0001_3_003
// 程式設計 https://www.books.com.tw/web/sys_bbotm/books/190508/?loc=P_0001_3_007
// 演算法 https://www.books.com.tw/web/sys_bbotm/books/190508/?loc=P_0001_3_007
// 台灣旅遊規劃 https://www.books.com.tw/web/books_bmidm_1101/?loc=P_0005_2_001
// 日本玩 https://www.books.com.tw/web/books_bmidm_1111/?loc=P_0005_2_002
// 韓國玩 https://www.books.com.tw/web/books_bmidm_1112/?loc=P_0005_2_003
// 管理研究所考試 https://www.books.com.tw/web/sys_bbotm/books/180202/?loc=P_0001_3_002
// 理工研究所考試 https://www.books.com.tw/web/sys_bbotm/books/180204/?loc=P_0001_3_004
// 拍照 || 攝影 https://www.books.com.tw/web/books_bmidm_0309/?loc=P_0005_2_009
// 音樂 || 鋼琴 https://www.books.com.tw/web/books_bmidm_0311/?loc=P_0005_2_011
// 編劇 https://www.books.com.tw/web/books_bmidm_0313/?loc=P_0005_2_013
// 設計 || 排版 https://www.books.com.tw/web/books_bmidm_0306/?loc=P_0005_2_006
// 麵包 https://www.books.com.tw/web/books_bmidm_0901/?loc=P_0005_2_001
// 甜點 https://www.books.com.tw/web/sys_bbotm/books/090102/?loc=P_0001_3_002
// 蛋糕 https://www.books.com.tw/web/sys_bbotm/books/090102/?loc=P_0001_3_002
// 餅乾 https://www.books.com.tw/web/sys_bbotm/books/090105/?loc=P_0001_3_005
// 廚藝 https://www.books.com.tw/web/books_bmidm_0907/?loc=P_0005_2_007
// 煮飯 https://www.books.com.tw/web/sys_bbotm/books/090710/?loc=P_0001_3_010
// 沙拉 https://www.books.com.tw/web/sys_bbotm/books/090716/?loc=P_0001_3_016
// 麵 https://www.books.com.tw/web/sys_bbotm/books/090711/?loc=P_0001_3_011
module.exports = router;