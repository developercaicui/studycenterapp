/*course-studying-f页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 640) * 100 + 'px';
//定义变量
var currentPage = 1;
var pageSize = 1000;
var total = 0;


//  var ret={
//
//   "data" : {
//     "total" : 40,
//     "courselist" : [ {
//       "categoryIndex" : 20,
//       "taskTotal" : "51",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b0155236d66c0013c",
//       "courseId" : "ff8080814eaf7474014eb450fc180846",
//       "outline" : "",
//       "teacherName" : "财务英语明星讲师团",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb556ff11d001572136255500ca",
//       "categoryName" : "CFA",
//       "actimode" : 0,
//       "subjectName" : "CFA 财务英语基础课",
//       "courseIndex" : 2,
//       "subjectID" : "ff8080814f3eb9ed014f48ef69fe136c",
//       "lock_status" : null,
//       "teacherHonor" : "",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 270,
//       "categoryId" : "ff80808149cc09f70149f3e7b9534654",
//       "courseBkImage" : "/upload/201508/631e2507c86c40779b99368df10f8a5b.jpg",
//       "expirationTime" : 1490772080,
//       "teacherImage" : "/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png",
//       "versionId" : "ff8080814eaf7474014eb450fc180846",
//       "subjectIndex" : 0,
//       "courseName" : "CFA 财务英语基础课"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "98",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fbfd04a00b6",
//       "courseId" : "ff8080814dad5062014db32051b801a2",
//       "outline" : "",
//       "teacherName" : "David Xi",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb55547b841015547bdae64000e",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F1",
//       "courseIndex" : 1,
//       "subjectID" : "ff808081473905e701476204cb6c006f",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/6096a5abb99846e3b9597f5bbb1a7b61.jpg",
//       "expirationTime" : 1489260317,
//       "teacherImage" : "/upload/201606/bda225ae7bde46fb848c09d65fdafb3a.png",
//       "versionId" : "ff808081473905e701476205d8740070",
//       "subjectIndex" : 2,
//       "courseName" : "ACCA F1 Accountant in Business"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "70",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd3b0fc00b7",
//       "courseId" : "ff8080814dad5062014dadd9c70d0053",
//       "outline" : "",
//       "teacherName" : "Amy Liu",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb55547b841015547bdfbbf0011",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F2",
//       "courseIndex" : 3,
//       "subjectID" : "ff808081473905e7014762524e800072",
//       "lock_status" : null,
//       "teacherHonor" : "十年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "ACCA F2 基础课讲义有更新~",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/a31000c03237447eb2bf91a3a3c5a18f.jpg",
//       "expirationTime" : 1489260255,
//       "teacherImage" : "/upload/201606/a9b2f46ff15546bda8b26279cab91707.png",
//       "versionId" : "ff808081473905e70147626ef839007f",
//       "subjectIndex" : 3,
//       "courseName" : "ACCA F2 Management Accounting"
//     }, {
//       "categoryIndex" : 100,
//       "taskTotal" : "30",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01552495a9e0015d",
//       "courseId" : "8a22ecb551ce0ae20151ce8875080120",
//       "outline" : "",
//       "teacherName" : "Sunny Sun",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb55541a8f7015552b7cde80081",
//       "categoryName" : "OBU",
//       "actimode" : 1,
//       "subjectName" : "OBU 论文基础课",
//       "courseIndex" : 1,
//       "subjectID" : "8a22ecb551f17b3e0151f1e04c7d0118",
//       "lock_status" : null,
//       "teacherHonor" : "八年教龄，金牌讲师，ACCA资深会员",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "8a22ecb551cf56cb0151d2152b5c0252",
//       "courseBkImage" : "/upload/201512/e7b0600a049848f59ec2f2d48e1dabc5.jpg",
//       "expirationTime" : 1488058182,
//       "teacherImage" : "/upload/201606/de99bbb67d7d44c681da62f6fb5f03bc.png",
//       "versionId" : "8a22ecb551ce0ae20151ce8875080120",
//       "subjectIndex" : 50,
//       "courseName" : "OBU 论文基础课"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "70",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd3b0fc00b7",
//       "courseId" : "ff8080814dad5062014dadd9c70d0053",
//       "outline" : "",
//       "teacherName" : "Amy Liu",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb55547b841015547be4f2f0015",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F2",
//       "courseIndex" : 3,
//       "subjectID" : "ff808081473905e7014762524e800072",
//       "lock_status" : null,
//       "teacherHonor" : "十年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "ACCA F2 基础课讲义有更新~",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/a31000c03237447eb2bf91a3a3c5a18f.jpg",
//       "expirationTime" : 1481491124,
//       "teacherImage" : "/upload/201606/a9b2f46ff15546bda8b26279cab91707.png",
//       "versionId" : "ff808081473905e70147626ef839007f",
//       "subjectIndex" : 3,
//       "courseName" : "ACCA F2 Management Accounting"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "5",
//       "isU" : 1,
//       "courseGroupId" : "8a22ecb553abe56d0153aca890410018",
//       "courseId" : "8a22ecb5538d2f5a01539c2d9bbc0035",
//       "outline" : "",
//       "teacherName" : "Vivian Doo",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb555076f7e015507735bcb0002",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F6",
//       "courseIndex" : 666,
//       "subjectID" : "ff80808147c904170147d2d3d4b60098",
//       "lock_status" : null,
//       "teacherHonor" : "都薇",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201603/3d168747b19f42b1992a74711845c027.jpg",
//       "expirationTime" : 1480409979,
//       "teacherImage" : "/upload/201606/2f4caeffc3324a79b0777af36a9e5900.png",
//       "versionId" : "8a22ecb5538d2f5a01539c2d9bbc0035",
//       "subjectIndex" : 7,
//       "courseName" : "ACCA F6 Taxation(体验课)"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "100",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd9817400bd",
//       "courseId" : "8a22ecb5540d6ed101541819c76b0042",
//       "outline" : "",
//       "teacherName" : "Edward",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5535aa70c015378422f4c5ea3",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F8",
//       "courseIndex" : 15,
//       "subjectID" : "ff808081473905e701475d4ec4d60006",
//       "lock_status" : null,
//       "teacherHonor" : "熊亚一",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201604/d97b3acc658b41f8958a9c2ff21774c0.png",
//       "expirationTime" : 1479010197,
//       "teacherImage" : "/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png",
//       "versionId" : "ff808081473905e701475d510f7c0007",
//       "subjectIndex" : 9,
//       "courseName" : "ACCA F8 Audit and Assurance"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "58",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd6660400b9",
//       "courseId" : "ff8080814db86d41014dc1a26c460537",
//       "outline" : "",
//       "teacherName" : "Anthony Tao",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb553ca819b0153ca832cea000b",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F4",
//       "courseIndex" : 7,
//       "subjectID" : "ff808081473905e70147625307e90074",
//       "lock_status" : null,
//       "teacherHonor" : "六年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg",
//       "expirationTime" : 1479009942,
//       "teacherImage" : "/upload/201606/6e88fecb3e544a61a1e796f112dec1a1.png",
//       "versionId" : "ff808081473905e701476271a6fc0083",
//       "subjectIndex" : 5,
//       "courseName" : "ACCA F4 Corporate and Business Law"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "31",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550ff2641200db",
//       "courseId" : "8a22ecb5540d6ed10154285f98c40061",
//       "outline" : "",
//       "teacherName" : "Edward",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb554496f5c01545134059115bb",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F8",
//       "courseIndex" : 16,
//       "subjectID" : "ff808081473905e701475d4ec4d60006",
//       "lock_status" : null,
//       "teacherHonor" : "熊亚一",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201604/997cc907d961488dacbe0cf55488ea96.png",
//       "expirationTime" : 1479009567,
//       "teacherImage" : "/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png",
//       "versionId" : "ff808081486933e60148898706a1058e",
//       "subjectIndex" : 9,
//       "courseName" : "复习串讲 ACCA F8 Audit and Assurance"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "130",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd7f56e00bb",
//       "courseId" : "8a22ecb55aa7aa10015acb72688a0c23",
//       "outline" : "",
//       "teacherName" : "Vivian Doo",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb553ca891a0153d093317d1047",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F6",
//       "courseIndex" : 1,
//       "subjectID" : "ff80808147c904170147d2d3d4b60098",
//       "lock_status" : null,
//       "teacherHonor" : "都薇",
//       "courseSource" : "zhongbo",
//       "availability" : "<br />\r\n<div>\r\n\t<br />\r\n</div>",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201606/5fb9da430fa347bbaf012a182682fa8f.jpg",
//       "expirationTime" : 1461928824,
//       "teacherImage" : "/upload/201606/2f4caeffc3324a79b0777af36a9e5900.png",
//       "versionId" : "ff80808147c904170147d2d530c30099",
//       "subjectIndex" : 7,
//       "courseName" : "2017 ACCA F6 Taxation"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "61",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd5468d00b8",
//       "courseId" : "ff8080814db86d41014dc1a2200f04d0",
//       "outline" : "",
//       "teacherName" : "Cindy Deng",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb553ca891a0153cb8c5a64037c",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F3",
//       "courseIndex" : 5,
//       "subjectID" : "ff808081473905e701476252b4390073",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA资深会员,金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg",
//       "expirationTime" : 1475045015,
//       "teacherImage" : "/upload/201606/448ebf46b76e43158d1431d94c90836a.png",
//       "versionId" : "ff808081473905e7014762700dfa0081",
//       "subjectIndex" : 4,
//       "courseName" : "ACCA F3 Financial Accounting"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "58",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd6660400b9",
//       "courseId" : "ff8080814db86d41014dc1a26c460537",
//       "outline" : "",
//       "teacherName" : "Anthony Tao",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb553c10d020153c8db5e351619",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F4",
//       "courseIndex" : 7,
//       "subjectID" : "ff808081473905e70147625307e90074",
//       "lock_status" : null,
//       "teacherHonor" : "六年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg",
//       "expirationTime" : 1474960840,
//       "teacherImage" : "/upload/201606/6e88fecb3e544a61a1e796f112dec1a1.png",
//       "versionId" : "ff808081473905e701476271a6fc0083",
//       "subjectIndex" : 5,
//       "courseName" : "ACCA F4 Corporate and Business Law"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "58",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd6660400b9",
//       "courseId" : "ff8080814db86d41014dc1a26c460537",
//       "outline" : "",
//       "teacherName" : "Anthony Tao",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5535aa60801537813a81d4323",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F4",
//       "courseIndex" : 7,
//       "subjectID" : "ff808081473905e70147625307e90074",
//       "lock_status" : null,
//       "teacherHonor" : "六年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg",
//       "expirationTime" : 1474915642,
//       "teacherImage" : "/upload/201606/6e88fecb3e544a61a1e796f112dec1a1.png",
//       "versionId" : "ff808081473905e701476271a6fc0083",
//       "subjectIndex" : 5,
//       "courseName" : "ACCA F4 Corporate and Business Law"
//     }, {
//       "categoryIndex" : 20,
//       "taskTotal" : "133",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b0155157daed6012f",
//       "courseId" : "8a22ecb5526cc38e015278544f3f000d",
//       "outline" : "",
//       "teacherName" : "CFA明星讲师团",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5532c7c880153311db8131499",
//       "categoryName" : "CFA",
//       "actimode" : 0,
//       "subjectName" : "CFA Level I",
//       "courseIndex" : 6,
//       "subjectID" : "8a22ecb5527d453f01527d4b0e500001",
//       "lock_status" : null,
//       "teacherHonor" : "",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 270,
//       "categoryId" : "ff80808149cc09f70149f3e7b9534654",
//       "courseBkImage" : "/upload/201704/a5558bf3a24e42c5b4ef70861e15bb7f.jpg",
//       "expirationTime" : 1480930466,
//       "teacherImage" : "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//       "versionId" : "8a22ecb5526cc38e015278544f3f000d",
//       "subjectIndex" : 50,
//       "courseName" : "2017 CFA L1 串讲课"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "100",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd9817400bd",
//       "courseId" : "8a22ecb5540d6ed101541819c76b0042",
//       "outline" : "",
//       "teacherName" : "Edward",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb553501468015350845daf020b",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F8",
//       "courseIndex" : 15,
//       "subjectID" : "ff808081473905e701475d4ec4d60006",
//       "lock_status" : null,
//       "teacherHonor" : "熊亚一",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201604/d97b3acc658b41f8958a9c2ff21774c0.png",
//       "expirationTime" : 1472896895,
//       "teacherImage" : "/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png",
//       "versionId" : "ff808081473905e701475d510f7c0007",
//       "subjectIndex" : 9,
//       "courseName" : "ACCA F8 Audit and Assurance"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "100",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd9817400bd",
//       "courseId" : "8a22ecb5540d6ed101541819c76b0042",
//       "outline" : "",
//       "teacherName" : "Edward",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb55350131d015350721dfe013c",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F8",
//       "courseIndex" : 15,
//       "subjectID" : "ff808081473905e701475d4ec4d60006",
//       "lock_status" : null,
//       "teacherHonor" : "熊亚一",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201604/d97b3acc658b41f8958a9c2ff21774c0.png",
//       "expirationTime" : 1472896888,
//       "teacherImage" : "/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png",
//       "versionId" : "ff808081473905e701475d510f7c0007",
//       "subjectIndex" : 9,
//       "courseName" : "ACCA F8 Audit and Assurance"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "61",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd5468d00b8",
//       "courseId" : "ff8080814db86d41014dc1a2200f04d0",
//       "outline" : "",
//       "teacherName" : "Cindy Deng",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5527d428e0152e40b7401013d",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F3",
//       "courseIndex" : 5,
//       "subjectID" : "ff808081473905e701476252b4390073",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA资深会员,金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg",
//       "expirationTime" : 1472636819,
//       "teacherImage" : "/upload/201606/448ebf46b76e43158d1431d94c90836a.png",
//       "versionId" : "ff808081473905e7014762700dfa0081",
//       "subjectIndex" : 4,
//       "courseName" : "ACCA F3 Financial Accounting"
//     }, {
//       "categoryIndex" : 20,
//       "taskTotal" : "292",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b0155157cb581012e",
//       "courseId" : "8a22ecb5526cc38e015278501f28000c",
//       "outline" : "",
//       "teacherName" : "CFA明星讲师团",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5532c7c880153311db75f1497",
//       "categoryName" : "CFA",
//       "actimode" : 0,
//       "subjectName" : "CFA Level I",
//       "courseIndex" : 5,
//       "subjectID" : "8a22ecb5527d453f01527d4b0e500001",
//       "lock_status" : null,
//       "teacherHonor" : "",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 270,
//       "categoryId" : "ff80808149cc09f70149f3e7b9534654",
//       "courseBkImage" : "/upload/201704/1c1dc29558af4b1a8cfb48f787665a35.jpg",
//       "expirationTime" : 1480412809,
//       "teacherImage" : "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//       "versionId" : "ff8080814e9056e4014e911137490330",
//       "subjectIndex" : 50,
//       "courseName" : "2017 CFA L1 强化课"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "98",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fbfd04a00b6",
//       "courseId" : "ff8080814dad5062014db32051b801a2",
//       "outline" : "",
//       "teacherName" : "David Xi",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5532c7c8801533a61971c3c5a",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F1",
//       "courseIndex" : 1,
//       "subjectID" : "ff808081473905e701476204cb6c006f",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/6096a5abb99846e3b9597f5bbb1a7b61.jpg",
//       "expirationTime" : 1472525469,
//       "teacherImage" : "/upload/201606/bda225ae7bde46fb848c09d65fdafb3a.png",
//       "versionId" : "ff808081473905e701476205d8740070",
//       "subjectIndex" : 2,
//       "courseName" : "ACCA F1 Accountant in Business"
//     }, {
//       "categoryIndex" : 10,
//       "taskTotal" : "258",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01551544b8180116",
//       "courseId" : "8a22ecb5545a87e801545af5048c0006",
//       "outline" : "",
//       "teacherName" : "QiQi Wu",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5532c7964015336ce7e7e2ac6",
//       "categoryName" : "CMA中文",
//       "actimode" : 1,
//       "subjectName" : "CMA 中文 Part-1",
//       "courseIndex" : 140,
//       "subjectID" : "ff808081486933e601489c799f0f0868",
//       "lock_status" : null,
//       "teacherHonor" : "吴奇奇",
//       "courseSource" : "zhongbo",
//       "availability" : "CMA Part I 中文 基础课,讲义有更新，更新内容：第2章 第1节 知识点3、第2章 第2节 知识点3、第3章 第1节 知识点2、第3章 第1节 知识点4、第5章 第2节 知识点3<br />\r\n<br />",
//       "expirationDate" : 280,
//       "categoryId" : "ff808081486933e601489c4662f60851",
//       "courseBkImage" : "/upload/201604/f57ba6cd71ae40e8b26309ad758acfff.jpg",
//       "expirationTime" : 1481105555,
//       "teacherImage" : "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//       "versionId" : "ff808081486933e601489c867448086a",
//       "subjectIndex" : 50,
//       "courseName" : "CMA Part I 中文 基础课"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "67",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fdb512900be",
//       "courseId" : "ff8080814db86d41014dc1a141b70400",
//       "outline" : "",
//       "teacherName" : "Susie Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5532c7964015336ce7d982ac4",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F9",
//       "courseIndex" : 17,
//       "subjectID" : "ff808081473905e7014762542d940078",
//       "lock_status" : null,
//       "teacherHonor" : "八年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "ACCA F9基础课 讲义有更新~",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/f002241f59484b92bd9e9a97b5043093.jpg",
//       "expirationTime" : 1472465491,
//       "teacherImage" : "/upload/201606/b369525b70a04212923e0a2e761ca664.png",
//       "versionId" : "ff808081473905e701476bd7aca20090",
//       "subjectIndex" : 10,
//       "courseName" : "ACCA F9 Financial Management"
//     }, {
//       "categoryIndex" : 20,
//       "taskTotal" : "641",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b0155157b7664012d",
//       "courseId" : "8a22ecb55aa7aa10015ac678caff0a7a",
//       "outline" : "",
//       "teacherName" : "CFA明星讲师团",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5532c7c88015331173eb2146f",
//       "categoryName" : "CFA",
//       "actimode" : 0,
//       "subjectName" : "CFA Level I",
//       "courseIndex" : 1,
//       "subjectID" : "8a22ecb5527d453f01527d4b0e500001",
//       "lock_status" : null,
//       "teacherHonor" : "",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 270,
//       "categoryId" : "ff80808149cc09f70149f3e7b9534654",
//       "courseBkImage" : "/upload/201704/e7f8031677fd4947b8fca37bd574ef7b.jpg",
//       "expirationTime" : 1480145595,
//       "teacherImage" : "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//       "versionId" : "ff8080814a04df96014a3d8e4f6a067a",
//       "subjectIndex" : 50,
//       "courseName" : "2017 CFA L1 基础课"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "58",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd6660400b9",
//       "courseId" : "ff8080814db86d41014dc1a26c460537",
//       "outline" : "",
//       "teacherName" : "Anthony Tao",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5527d428e0152e40b7536013f",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F4",
//       "courseIndex" : 7,
//       "subjectID" : "ff808081473905e70147625307e90074",
//       "lock_status" : null,
//       "teacherHonor" : "六年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg",
//       "expirationTime" : 1472292480,
//       "teacherImage" : "/upload/201606/6e88fecb3e544a61a1e796f112dec1a1.png",
//       "versionId" : "ff808081473905e701476271a6fc0083",
//       "subjectIndex" : 5,
//       "courseName" : "ACCA F4 Corporate and Business Law"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "13",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fed76b100c8",
//       "courseId" : "ff8080814dc1dc4e014e00cc355c2deb",
//       "outline" : "",
//       "teacherName" : "David Xi",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5527d428e0152e40b78630143",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F1",
//       "courseIndex" : 2,
//       "subjectID" : "ff808081473905e701476204cb6c006f",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/fdd86b6fc447438495b5c136f5bab33f.jpg",
//       "expirationTime" : 1471994275,
//       "teacherImage" : "/upload/201606/bda225ae7bde46fb848c09d65fdafb3a.png",
//       "versionId" : "ff808081486933e6014888fb011e057b",
//       "subjectIndex" : 2,
//       "courseName" : "复习串讲-ACCA F1 Accountant in Business"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "96",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd7305100ba",
//       "courseId" : "ff8080814db86d41014dc1a2b31805a1",
//       "outline" : "",
//       "teacherName" : "Crystal Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "8a22ecb5527d428e0152e40b78390141",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F5",
//       "courseIndex" : 9,
//       "subjectID" : "ff808081473905e7014762534dda0075",
//       "lock_status" : null,
//       "teacherHonor" : "资深会员",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/06604e12add04761867e6f289ea85988.jpg",
//       "expirationTime" : 1471245658,
//       "teacherImage" : "/upload/201606/8cd1b9fb6d394cebabb98fbc9112244f.png",
//       "versionId" : "ff808081473905e701476bd3ddb0008c",
//       "subjectIndex" : 6,
//       "courseName" : "ACCA F5 Performance Management"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "68",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01552368f7e50139",
//       "courseId" : "ff8080814e9056e4014e95fb06b80d72",
//       "outline" : "",
//       "teacherName" : "财务英语明星讲师团",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814fe8e87d014ff3154d932440",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "ACCA 财务英语基础课",
//       "courseIndex" : 1,
//       "subjectID" : "ff8080814f3eb9ed014f48ee5deb1361",
//       "lock_status" : null,
//       "teacherHonor" : "",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201508/e8ce1c45b3764f89a843b427f18cabd6.jpg",
//       "expirationTime" : 1458444386,
//       "teacherImage" : "/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png",
//       "versionId" : "ff8080814e9056e4014e95fb06b80d72",
//       "subjectIndex" : 0,
//       "courseName" : "ACCA 财务英语基础课"
//     }, {
//       "categoryIndex" : 25,
//       "taskTotal" : "77",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b015513fec98d00f9",
//       "courseId" : "ff8080814e44227f014e479bb5a50074",
//       "outline" : "",
//       "teacherName" : "Maggie Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814eaa5b32014eaa5d37280016",
//       "categoryName" : "CIMA",
//       "actimode" : 1,
//       "subjectName" : "E1",
//       "courseIndex" : 6,
//       "subjectID" : "ff8080814e44227f014e4797ca600073",
//       "lock_status" : null,
//       "teacherHonor" : "张萍",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff8080814c7e36d9014c9c3219fa01a8",
//       "courseBkImage" : "/upload/201507/924f877d5ca942428216a8ddee8b04b9.jpg",
//       "expirationTime" : 1456543577,
//       "teacherImage" : "/upload/201606/e2ddf6c31e3a45709db452bf5043ee92.png",
//       "versionId" : "ff8080814e44227f014e479bb5a50074",
//       "subjectIndex" : 60,
//       "courseName" : "CIMA Enterprise Operations（E1）"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "31",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550ff2641200db",
//       "courseId" : "8a22ecb5540d6ed10154285f98c40061",
//       "outline" : "",
//       "teacherName" : "Edward",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814eaa5b32014eb49d062e34fb",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F8",
//       "courseIndex" : 16,
//       "subjectID" : "ff808081473905e701475d4ec4d60006",
//       "lock_status" : null,
//       "teacherHonor" : "熊亚一",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201604/997cc907d961488dacbe0cf55488ea96.png",
//       "expirationTime" : 1454552495,
//       "teacherImage" : "/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png",
//       "versionId" : "ff808081486933e60148898706a1058e",
//       "subjectIndex" : 9,
//       "courseName" : "复习串讲 ACCA F8 Audit and Assurance"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "100",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd9817400bd",
//       "courseId" : "8a22ecb5540d6ed101541819c76b0042",
//       "outline" : "",
//       "teacherName" : "Edward",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814eaa5b32014eb49d062734fa",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F8",
//       "courseIndex" : 15,
//       "subjectID" : "ff808081473905e701475d4ec4d60006",
//       "lock_status" : null,
//       "teacherHonor" : "熊亚一",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201604/d97b3acc658b41f8958a9c2ff21774c0.png",
//       "expirationTime" : 1440604800,
//       "teacherImage" : "/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png",
//       "versionId" : "ff808081473905e701475d510f7c0007",
//       "subjectIndex" : 9,
//       "courseName" : "ACCA F8 Audit and Assurance"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "14",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550feef71600ce",
//       "courseId" : "ff8080814dc1dc4e014e00cca7542e08",
//       "outline" : "",
//       "teacherName" : "Cindy Deng",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814e9aeb67014ea926d91f3101",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F3",
//       "courseIndex" : 6,
//       "subjectID" : "ff808081473905e701476252b4390073",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA资深会员,金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/a9ebe23379ba4ab0bd4997d2b604b723.jpg",
//       "expirationTime" : 1452909243,
//       "teacherImage" : "/upload/201606/448ebf46b76e43158d1431d94c90836a.png",
//       "versionId" : "ff808081486933e60148897bb8480584",
//       "subjectIndex" : 4,
//       "courseName" : "复习串讲-ACCA F3 Financial Accounting"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "87",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fde76cf00c0",
//       "courseId" : "ff8080814dc1dc4e014dff870870294a",
//       "outline" : "",
//       "teacherName" : "Tom Wang",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814cc0f944014d0c51e00f6d51",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P2",
//       "courseIndex" : 21,
//       "subjectID" : "ff808081473905e701476254ba24007a",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA CPA HKICPA CMA会员",
//       "courseSource" : "zhongbo",
//       "availability" : "<span style=\"color:#333333;font-family:'Microsoft Yahei', Arial, Helvetica, sans-serif, u5b8bu4f53;font-size:13px;line-height:20px;background-color:#FFFFFF;\">2016年8月1日更新：Current issue Topic 3、5、6、7、8</span>",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/9c512662c9454e0b9dc2bb705b6b0e47.jpg",
//       "expirationTime" : 1452392218,
//       "teacherImage" : "/upload/201606/1e3e52f2982540478b8477c8881a5708.png",
//       "versionId" : "ff808081473905e701476bd9b1ae0094",
//       "subjectIndex" : 12,
//       "courseName" : "ACCA P2 Corporate Reporting"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "21",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550ff6339700e7",
//       "courseId" : "ff8080814dc1dc4e014dff87b39c2a5a",
//       "outline" : "",
//       "teacherName" : "Ralph Gui",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814e062b43014e1e4bdeba0921",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P3",
//       "courseIndex" : 24,
//       "subjectID" : "ff808081473905e701476254e30b007b",
//       "lock_status" : null,
//       "teacherHonor" : "六年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/c1642418560240f2a931d307730f5a1d.jpg",
//       "expirationTime" : 1452392175,
//       "teacherImage" : "/upload/201506/ddc184e8ec6041d4a58efb0068b72a96.jpg",
//       "versionId" : "ff808081486933e60148898c925b0596",
//       "subjectIndex" : 13,
//       "courseName" : "复习串讲-ACCA P3 Business Analysis"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "44",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fe25b2000c3",
//       "courseId" : "ff8080814dc1dc4e014dff8a16842b1b",
//       "outline" : "",
//       "teacherName" : "Rainz Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814d663678014d663bc3d30035",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P5",
//       "courseIndex" : 27,
//       "subjectID" : "ff808081473905e7014762552eb6007d",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA & CIMA 金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "2016 ACCA P5 2016/09-2017/06教材大纲变化说明：\r\n相对财萃网课增加内容只有big data，请大家参见ACCA官网technical articles。\r\n删除内容如下，除beyond budgeting和performance prism不需要再看之外，其它内容建议大家有common sense。\r\nDeleted contents:\r\n1)\tCorporate planning\r\n2)\tStrategic management in the context of multinational companies\r\n3)\tBeyond budgeting\r\n4)\tBusiness integration\r\n5)\tStaff empowerment\r\n6)\tImpacts from IT system\r\n7)\tImpacts from government policies\r\n8)\tResponsibility accounting\r\n9)\tPerformance prism",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/d69d5ae986c0481cb78ceada73059e01.jpg",
//       "expirationTime" : 1452079059,
//       "teacherImage" : "/upload/201606/81898b02f891427d96ada4cfbb261a6d.png",
//       "versionId" : "ff808081473905e701476bddfff8009a",
//       "subjectIndex" : 15,
//       "courseName" : "ACCA P5 Advanced Performance Management "
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "34",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fdf6fb300c1",
//       "courseId" : "ff8080814dc1dc4e014dff8788ea2a1b",
//       "outline" : "",
//       "teacherName" : "Ralph Gui",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814cc0f944014d0c4406866d4a",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P3",
//       "courseIndex" : 23,
//       "subjectID" : "ff808081473905e701476254e30b007b",
//       "lock_status" : null,
//       "teacherHonor" : "六年教龄，ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/9549e5cb21e242258f8a162483c530bf.jpg",
//       "expirationTime" : 1450579408,
//       "teacherImage" : "/upload/201506/ddc184e8ec6041d4a58efb0068b72a96.jpg",
//       "versionId" : "ff808081473905e701476bdb74220096",
//       "subjectIndex" : 13,
//       "courseName" : "ACCA P3 Business Analysis"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "44",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fe0d1f200c2",
//       "courseId" : "ff8080814dc1dc4e014dff87fcb92a84",
//       "outline" : "",
//       "teacherName" : "Crystal Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814d665eb7014d78c7d4596308",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P4",
//       "courseIndex" : 25,
//       "subjectID" : "ff808081473905e7014762550755007c",
//       "lock_status" : null,
//       "teacherHonor" : "资深会员",
//       "courseSource" : "zhongbo",
//       "availability" : "<div>\r\n\t2016年P4大纲变更说明： 删除Forex&nbsp;option&nbsp;value&nbsp;and&nbsp;EVA&nbsp;两个topic，里面涉及到的相关内容可不作为重点复习<br />\r\n</div>",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/3dd6b2415d0b445f99120c47af2327ce.jpg",
//       "expirationTime" : 1447802486,
//       "teacherImage" : "/upload/201606/8cd1b9fb6d394cebabb98fbc9112244f.png",
//       "versionId" : "ff808081473905e701476bdd2daa0098",
//       "subjectIndex" : 14,
//       "courseName" : "ACCA P4 Advanced Financial Management"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "98",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fbfd04a00b6",
//       "courseId" : "ff8080814dad5062014db32051b801a2",
//       "outline" : "",
//       "teacherName" : "David Xi",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814cc0f944014cdad250a77bdf",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F1",
//       "courseIndex" : 1,
//       "subjectID" : "ff808081473905e701476204cb6c006f",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/6096a5abb99846e3b9597f5bbb1a7b61.jpg",
//       "expirationTime" : 1445989421,
//       "teacherImage" : "/upload/201606/bda225ae7bde46fb848c09d65fdafb3a.png",
//       "versionId" : "ff808081473905e701476205d8740070",
//       "subjectIndex" : 2,
//       "courseName" : "ACCA F1 Accountant in Business"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "52",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd8bfe000bc",
//       "courseId" : "ff8080814db86d41014dc1a1a3460481",
//       "outline" : "",
//       "teacherName" : "Hebe Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814cc0f944014cdabe53397b38",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F7",
//       "courseIndex" : 13,
//       "subjectID" : "ff808081473905e701476253fd980077",
//       "lock_status" : null,
//       "teacherHonor" : "五年教龄，金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/a167bb130d4d4b98b4794a00e63812ff.jpg",
//       "expirationTime" : 1445151147,
//       "teacherImage" : "/upload/201606/bacc3011e8c54317a3af839ad4bd7c65.png",
//       "versionId" : "ff808081473905e701476bd679ed008e",
//       "subjectIndex" : 8,
//       "courseName" : "ACCA F7 Financial Reporting"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "61",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fd5468d00b8",
//       "courseId" : "ff8080814db86d41014dc1a2200f04d0",
//       "outline" : "",
//       "teacherName" : "Cindy Deng",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814c7e427e014ca1d4720e0c33",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "F3",
//       "courseIndex" : 5,
//       "subjectID" : "ff808081473905e701476252b4390073",
//       "lock_status" : null,
//       "teacherHonor" : "ACCA资深会员,金牌讲师",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg",
//       "expirationTime" : 1444196286,
//       "teacherImage" : "/upload/201606/448ebf46b76e43158d1431d94c90836a.png",
//       "versionId" : "ff808081473905e7014762700dfa0081",
//       "subjectIndex" : 4,
//       "courseName" : "ACCA F3 Financial Accounting"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "44",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fe0d1f200c2",
//       "courseId" : "ff8080814dc1dc4e014dff87fcb92a84",
//       "outline" : "",
//       "teacherName" : "Crystal Zhang",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814c4f4c28014c756d177c13a7",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P4",
//       "courseIndex" : 25,
//       "subjectID" : "ff808081473905e7014762550755007c",
//       "lock_status" : null,
//       "teacherHonor" : "资深会员",
//       "courseSource" : "zhongbo",
//       "availability" : "<div>\r\n\t2016年P4大纲变更说明： 删除Forex&nbsp;option&nbsp;value&nbsp;and&nbsp;EVA&nbsp;两个topic，里面涉及到的相关内容可不作为重点复习<br />\r\n</div>",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/3dd6b2415d0b445f99120c47af2327ce.jpg",
//       "expirationTime" : 1443451411,
//       "teacherImage" : "/upload/201606/8cd1b9fb6d394cebabb98fbc9112244f.png",
//       "versionId" : "ff808081473905e701476bdd2daa0098",
//       "subjectIndex" : 14,
//       "courseName" : "ACCA P4 Advanced Financial Management"
//     }, {
//       "categoryIndex" : 5,
//       "taskTotal" : "24",
//       "isU" : 0,
//       "courseGroupId" : "8a22ecb55507806b01550fdd1c4f00bf",
//       "courseId" : "ff8080814dc1dc4e014dff86819c28fe",
//       "outline" : "",
//       "teacherName" : "Sunny Sun",
//       "lock_date" : null,
//       "orderID_item_id" : "ff8080814c4f4c28014c69a883dd5faf",
//       "categoryName" : "ACCA",
//       "actimode" : 1,
//       "subjectName" : "P1",
//       "courseIndex" : 19,
//       "subjectID" : "ff808081473905e70147625487550079",
//       "lock_status" : null,
//       "teacherHonor" : "八年教龄，金牌讲师，ACCA资深会员",
//       "courseSource" : "zhongbo",
//       "availability" : "",
//       "expirationDate" : 180,
//       "categoryId" : "ff808081473905e701475cd3c2080001",
//       "courseBkImage" : "/upload/201502/3d1eb2443ceb42fb85700a9628cb5cf1.jpg",
//       "expirationTime" : 1443253834,
//       "teacherImage" : "/upload/201606/de99bbb67d7d44c681da62f6fb5f03bc.png",
//       "versionId" : "ff808081473905e701476bd8a0300092",
//       "subjectIndex" : 11,
//       "courseName" : "ACCA P1 Governance Risk, and Ethic"
//     } ],
//     "isdisplay" : false
//   },
//   "state" : "success",
//   "msg" : ""
// }
// //
//
// var stooges = ret.data.courselist;
//			var categoryIdArr = [];
//			for(var i=0;i<stooges.length;i++){
//				if(categoryIdArr && categoryIdArr.length){
//					var isPush = true;
//					for(var j=0;j<categoryIdArr.length;j++){
//						if(stooges[i].subjectID == categoryIdArr[j].subjectID){
//							isPush = false;
//						}
//					}
//					if(isPush){
//						categoryIdArr.push({
//							subjectID :　stooges[i].subjectID,
//							categoryName : stooges[i].categoryName,
//							subjectName : stooges[i].subjectName,
//							courseLists : []
//						})
//					}
//				}else{
//					categoryIdArr.push({
//						subjectID :　stooges[i].subjectID,
//						categoryName : stooges[i].categoryName,
//						subjectName : stooges[i].subjectName,
//						courseLists : []
//					})
//				}
//				
//			}
//			
//			var courseLists = [];
//			for(var i=0;i<categoryIdArr.length;i++){
//				for(var j=0;j<stooges.length;j++){
//					if(categoryIdArr[i].subjectID == stooges[j].subjectID){
//						categoryIdArr[i].courseLists.push(stooges[j]);
//					}
//				}
//			}
//			console.log(categoryIdArr);
// 	console.log(categoryIdArr);
//
//
// var tpl = $('#tpl').html();
// var content = doT.template(tpl);
// $('#content').html(content(categoryIdArr));

	
	

var is_loding=false;
function getData(page) {
	
//	 var tpl = $('#tpl').html();
//	 var content = doT.template(tpl);
//	 $('#content').html(content(data));
//	 return;
	/* //            var tpl = $('#tpl').html();
	 //            var content = doT.template(tpl);
	 //            if (page == 1) {
	 //                $('#content').html(content(data));
	 //            } else {
	 //                $('#content').append(content(data));
	 //            }
	 //
	 //            return ;
	 */
	var param = {};
	param.pageNo = page;
	param.pageSize = pageSize;
	param.token = $api.getStorage('token');
	if(page==1&& show_pro && !is_loding){
	    api.showProgress({
	        title : '加载中',
	        modal : false
	    });
	}
	ajaxRequest('api/v2.1/learning/learningcourse', 'get', param, function(ret, err) {//008.003.2 在学的课程列表（new）编号  :
        api.refreshHeaderLoadDone();
        is_loding=true;
		if(show_pro){
            api.hideProgress();
        }
		if (err) {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		var tpl = $('#tpl').html();
		var content = doT.template(tpl);
		if (ret && ret.state == 'success') {
			var learningcourseData = ret;
			var learningcourse = ret.data.courselist;
    	var courseArr = [];
			for(var i=0;i<learningcourse.length;i++){
				courseArr.push(learningcourse[i].courseId);
			}
    	ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/getCourseProgress/v1.0/' }, 'get', {'token':getstor('token'),'memberId':getstor('memberId'),'courseId':courseArr.toString()}, function(ret, err) {
    			if (err) {
    					api.toast({
    							msg: err.msg,
    							location: 'middle'
    					});
    					return false;
    			}
					for(var i=0;i<learningcourse.length;i++){
						for(var j=0;j<ret.data.length;j++){ 
							if(learningcourse[i].courseId == ret.data[j].courseId){
								learningcourse[i].showProgress = ret.data[j].courseProgress;
		            learningcourse[i].createDate = ret.data[j].createDate;

		            learningcourse[i].chapterId = ret.data[j].chapterId;
		            learningcourse[i].chapterName = ret.data[j].chapterName;
		            learningcourse[i].progress = ret.data[j].progress;
		            learningcourse[i].taskId = ret.data[j].taskId;
		            learningcourse[i].taskName = ret.data[j].taskName;

							}
						}
					}
		      
		      // var filterLastProgress = learningcourse;
		      // var i = 0,
		      //     len = filterLastProgress.length,
		      //     j, d;
		      // for (; i < len; i++) {
		      //     for (j = 0; j < len; j++) {
		      //         if (parseInt(filterLastProgress[i].createDate) > parseInt(filterLastProgress[j].createDate)) {
		      //             d = filterLastProgress[j];
		      //             filterLastProgress[j] = filterLastProgress[i];
		      //             filterLastProgress[i] = d;
		      //         }
		      //     }
		      // }

    	var ret={
            data : {
              total : learningcourseData.data.total,
              courselist : learningcourse
            }
          }
          
          var stooges = ret.data.courselist;
			var categoryIdArr = [];
			for(var i=0;i<stooges.length;i++){
				if(categoryIdArr && categoryIdArr.length){
					var isPush = true;
					for(var j=0;j<categoryIdArr.length;j++){
						if(stooges[i].subjectID == categoryIdArr[j].subjectID){
							isPush = false;
						}
					}
					if(isPush){
						categoryIdArr.push({
							subjectID :　stooges[i].subjectID,
							categoryName : stooges[i].categoryName,
							subjectName : stooges[i].subjectName,
							subjectIndex : stooges[i].subjectIndex,
							courseLists : []
						})
					}
				}else{
					categoryIdArr.push({
						subjectID :　stooges[i].subjectID,
						categoryName : stooges[i].categoryName,
						subjectName : stooges[i].subjectName,
						subjectIndex : stooges[i].subjectIndex,
						courseLists : []
					})
				}
				
			}
			
			var courseLists = [];
			for(var i=0;i<categoryIdArr.length;i++){
				for(var j=0;j<stooges.length;j++){
					if(categoryIdArr[i].subjectID == stooges[j].subjectID){
						categoryIdArr[i].courseLists.push(stooges[j]);
					}
				}
			}
			function down(x, y) {
	            return (x.subjectIndex > y.subjectIndex) ? 1 : -1
	 
	        }
	        categoryIdArr.sort(down)
	        
			console.log(categoryIdArr);

    			total = ret.data.total;
    			if (page == 1) {
    				if (isEmpty(ret.data.courselist)) {
    					$('body').addClass('null');
    					return false;
    				}
    				$('#content').html(content(categoryIdArr));
    			} else {
    				if (isEmpty(ret.data.courselist)) {
    					return false;
    				}
    				$('#content').append(content(categoryIdArr));
    			}
    
    			saveExpire(ret.data.courselist);

    			progressBar();
    			api.parseTapmode();
    	})

			
		} else {
			//api.toast({
			//	msg : ret.msg,
			//	location : 'middle'
			//});
		}
	});

}

apiready = function() {
	//获取页面的数据
	getData(1);
	api.addEventListener({
		name : 'flush_study'
	}, function(ret, err) {
		getData(1);
	});
	//监听下拉刷新
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/arrow-down-o.png',
		bgColor : '#f3f3f3',
		textColor : '#787b7c',
		textDown : '下拉更多',
		textUp : '松开刷新',
		showTime : false
	}, function(ret, err) {
		getData(1);
		currentPage = 1;
	});
	//监听滚动到底部
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (total == 0 || currentPage < Math.ceil(total / pageSize)) {
			currentPage++;
			getData(currentPage);
			progressBar();
		}
	});

	//监听横屏切换竖屏事件
	api.addEventListener({
		name : 'changeScreen'
	}, function(ret, err) {
		//切换屏幕
		api.setScreenOrientation({
			orientation : 'portrait_up'
		});
	});
};
//历史课程详情
function course_det(_this,xyc, a, b,  e, f) {

	var c = $(_this).data('chaptername');
	var d = $(_this).data('coursename');
	//if(c=='undefined'||!c){
	//    return false;
	//}
	$api.setStorage('studying_to_center', 1);
	api.openWin({
		name : xyc,
		url : xyc + '.html',
		bgColor : '#fff',
		opaque : true,
		reload : true,
		softInputMode : 'resize',
		pageParam : {
			tag : 1,
			courseId : a,
			chapterId : b,
			chapterName : c,
			courseName : d,
			categoryId : e,
			subjectId : f
		},
		vScrollBarEnabled : false,
		slidBackEnabled : false
	});
}

//进度条
//setInterval(function(){},16.7);
function slidePro() {
	var progress = document.querySelectorAll('.wodPro');
	//每一个都执行
	for (var i = 0; i < progress.length; i++) {
		var pro = progress[i];
		//获取当前的进度父容器
		start();
	}
	//条形进度条的方法
	function start() {
		var bt = 0;
		//获取父容器下的数字标签
		var progressBT = pro.querySelector('.stydyProBcout');
		//获取进度到的数字
		var progressBTS = parseInt(progressBT.innerHTML);
		//获取变化的进度元素
		var progressChange = pro.querySelector('.stydyProIN');
		var Go = setInterval(function() {
			bt++;
			if (progressBTS == 0) {
				bt = 0;
			}
			progressChange.style.width = bt + '%';
			//改变元素的宽度

			if (bt == progressBTS || progressBTS == 0) {
				clearInterval(Go);
			}
		}, 16.7);
	}

}

//找出任务进度
function findTask(study_progress, course_detail) {
	var chapters_num = 0;
	//一级章节索引
	var chapters_child_num = 0;
	//二级章节索引
	var child_task_num = 0;
	//任务索引
	if (!isEmpty(study_progress)) {
		var tmp_chapterId = study_progress.chapterId;
		//二级章节id
		var tmp_taskId = study_progress.taskId;
		//任务id
		for (var i in course_detail.chapters) {
			var first_charpter_info = course_detail.chapters[i];
			//循环获取一级章节信息
			for (var j in first_charpter_info.children) {
				var second_charpter_info = first_charpter_info.children[j];
				//循环获取二级章节信息
				if (second_charpter_info.chapterId == tmp_chapterId) {
					var tasks = second_charpter_info.tasks;
					for (var k in tasks) {
						if (tasks[k].taskId == tmp_taskId) {
							if (study_progress.state == 'complate') {
								//该任务已完成，执行下个任务
								if (k == tasks.length - 1) {
									//如果是二级章节的最后一个任务，则执行下个章节
									if (j == first_charpter_info.children.length - 1) {
										//如果二级章节已经是最后一个，则执行下个一级章节
										if (i == course_detail.chapters.length - 1) {
											//如果一级章节已经是最后一个，则询问是否重新学习
											api.confirm({
												title : '温馨提示',
												msg : '恭喜你，该课程已学完，再学一遍？',
												buttons : ['确定', '取消']
											}, function(ret, err) {
												if (ret.buttonIndex == 1) {
													return {
														chapters_num : 0,
														chapters_child_num : 0,
														child_task_num : 0
													};
												} else {
													return false;
												}
											});
										} else {
											return {
												chapters_num : parseInt(i) + 1,
												chapters_child_num : 0,
												child_task_num : 0
											};
										}
									} else {
										return {
											chapters_num : i,
											chapters_child_num : parseInt(j) + 1,
											child_task_num : 0
										};
									}
								} else {
									return {
										chapters_num : i,
										chapters_child_num : j,
										child_task_num : parseInt(k) + 1
									};
								}
							} else {
								//继续执行该任务
								return {
									chapters_num : i,
									chapters_child_num : j,
									child_task_num : k
								};
							}
						}
					}
				}
			}
		}
	}
	return {
		chapters_num : chapters_num,
		chapters_child_num : chapters_child_num,
		child_task_num : child_task_num
	};
}

//点击页面上的在学课程，跳转学习课程页面
function play(courseId) {
	if (isEmpty(courseId)) {
		//var courseId = 'ff8080814db86d41014dc13f0a59024e';
		api.toast({
			msg : '课程ID无效',
			location : 'middle'
		});
		return false;
	}
	$api.setStorage('ios_style', 1);
	api.showProgress({
		title : '加载中',
		modal : false
	});
	//如果没有缓存信息，就从接口获取
	var tmp_course_detail = $api.getStorage(courseId);
	if (isEmpty(tmp_course_detail)) {
		//获取课程的详细信息
		//api/v2.1/course/courseDetail，接口编号：004-006
		ajaxRequest('api/v2.1/course/courseDetail', 'get', {
			courseId : courseId
		}, function(ret, err) {//004.006获取课程的详细信息
			if (err) {
				api.hideProgress();
				api.toast({
					msg : err.msg,
					location : 'middle'
				});
				return false;
			}
			if (ret && ret.state == 'success') {
				var course_detail = ret.data[0];
				//课程详情数据
				$api.setStorage(courseId, course_detail);
				//用户上次的学习进度
				getLastProgress(course_detail);
			}
		});
	} else {
		var course_detail = tmp_course_detail;
		//存储课程详细信息
		getLastProgress(course_detail);
		//用户上次学习进度数据
	}
}

//判断任务类型，跳转相应的页面
function judge_task(res_process, course_detail, last_progress) {
	if (isEmpty(res_process)) {
		res_process = {
			chapters_num : 0,
			chapters_child_num : 0,
			child_task_num : 0
		};
	}
	if (isEmpty(course_detail) || isEmpty(course_detail.chapters)) {
		return false;
	}
	var chapters_info = course_detail.chapters[res_process.chapters_num];
	if (isEmpty(chapters_info.children)) {
		return false;
	}
	//当前一级章节信息
	var chapters_child_info = chapters_info.children[res_process.chapters_child_num];
	if (isEmpty(chapters_child_info.tasks)) {
		return false;
	}
	//当前二级章节信息
	var task_info = chapters_child_info.tasks[res_process.child_task_num];
	//当前任务信息
	//判断当前任务类型
	if (isEmpty(task_info) || isEmpty(task_info.taskType)) {
		api.toast({
			msg : '无课程任务',
			location : 'middle'
		});
		return;
	}
	if (task_info.taskType == 'video') {
		//视频类型
		var new_win_name = 'video';
		var new_win_url = 'video.html';
	} else if (task_info.taskType == 'entry' || task_info.taskType == 'pdfread' || task_info.taskType == 'exam') {
		//entry（外链类型）、pdfread（pdf类型）、exam（测试题类型）
		var new_win_name = 'course-test';
		var new_win_url = 'course-test.html';
	} else {
		api.toast({
			msg : '暂无任务，请稍后再试或联系客服',
			location : 'middle'
		});
		return false;
	}
	//需要传递的参数
	var pageParams = {
		from : 'course-studying',
		last_progress : last_progress, //上次的学习进度
		course_detail : course_detail, //课程详情
		chapters_num : res_process.chapters_num, //一级章节索引
		chapters_child_num : res_process.chapters_child_num, //二级章节索引
		child_task_num : res_process.child_task_num, //任务索引
		task_info : task_info, //当前要学习的任务信息
		type : 'task'
	};
	api.hideProgress();
	//设置屏幕向右翻转
	api.setScreenOrientation({
		orientation : 'landscape_right'
	});
	//跳转到横屏页面
	api.openWin({
		name : new_win_name,
		url : new_win_url,
		delay : 200,
		slidBackEnabled : false, //iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
		pageParam : pageParams
	});
}

//获取上一次的学习进度
function getLastProgress(course_detail) {
	var courseId = course_detail.courseId;
	var tmpParam = {
		'token' : $api.getStorage('token'), //必须
		'memberId' : get_loc_val('mine', 'memberId'),
		'categoryId' : course_detail.categoryId, //非必须
		'subjectId' : course_detail.subjectId, //非必须
		'courseId' : courseId, //非必须
		'chapterId' : '', //非必须
		'taskId' : ''//非必须
	};
	//(实时)最后一次任务状态（new）tested,编号:008.026,GET - /api/v2.1/chapter/tasklastProgress
	ajaxRequest('api/v2.1/chapter/tasklastProgress', 'get', tmpParam, function(ret, err) {//008.026 最后一次任务状态（new）tested，接口编号：008-026
		if (err) {
			api.hideProgress();
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
		if (ret && ret.state == 'success') {
			if (isEmpty(ret.data)) {
				//api.toast({
				//    msg:'获取任务信息失败',
				//    location:'middle'
				//});
				//return false;
				var res_process = {
					chapters_num : 0,
					chapters_child_num : 0,
					child_task_num : 0
				};
				judge_task(res_process, course_detail, 0);
			} else {
				var study_progress = ret.data;
				var res_process = findTask(study_progress, course_detail);
				//根据进度和课程信息，找到要学习的任务
				if (isEmpty(res_process)) {
					return false;
				} else {
					judge_task(res_process, course_detail, study_progress.progress);
				}
			}

		}
	});
}

function to_jh() {
	api.sendEvent({
		name : 'wjhkc'
	});
}