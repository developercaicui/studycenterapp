var getStatusTime = null;
var videoDownInfo =new Object(); //缓存每个节点的下载状态，一个节点一个id
var videochangelist = $api.getStorage("videochangelist") ? $api.getStorage("videochangelist") : "";; //记录每次定时器和数据库同步数据后发生改变的dom节点id
var couselist = ""; //记录缓存包括的课程id
var lastgettime = 1388509261;//记录每次获取数据库的时间点，下次获取就只获取该时间点之后变化的记录(第一次获取可以获取2014年1月1日1时1分1秒//)


// function tasksCache(obj,chapterId,event){

//     if(!$("body").hasClass("checking")){
//         clearInterval(getStatusTime);
//         var chapterId = $(obj).attr("data-chapId");
//         var courseId = $(obj).find(".down-progress").attr("courseid");
//         api.openWin({
//             name : "tasks-cache",
//             url : 'tasks-cache.html',
//             delay : 200,
//             pageParam: {chapterId:chapterId,courseId:courseId}
//         });
//     }
    
// }
function init_check() {
       $('.cache-list .icon-check').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').parents('.cache-course').find('.courseid').removeClass('active');
            $(this).parents('.mycaptA').find('.chaptera').removeClass('active');
            $(this).parents('.mycaptB').find('.chapterb').removeClass('active');
            if ($(this).hasClass('courseid')) { //如果是顶级
                $(this).parents('.cache-course').find('.icon-check').removeClass('active');
            } else if ($(this).hasClass('chaptera')) { //如果是二级
                $(this).parents('.mycaptA').find('.icon-check').removeClass('active');
            } else if ($(this).hasClass('chapterb')) { //如果是三级
                $(this).parents('.mycaptB').find('.icon-check').removeClass('active');
            }
        } else {
            $(this).addClass('active');
            if ($(this).hasClass('courseid')) { //如果是顶级
                $(this).parents('.cache-course').find('.icon-check').addClass('active');
            } else if ($(this).hasClass('chaptera')) { //如果是二级
                $(this).parents('.mycaptA').find('.icon-check').addClass('active');
                var _s = $(this).parents('.cache-course').find('.mycaptA').not('.none');
                var _a = _s.length;
                var _b = _s.children('dl').find('.active').length;
                //console.log(_a + ' ====== ' + _b);
                if (_a == _b) {
                    $(this).parents('.cache-course').find('.courseid').addClass('active');
                }
            } else if ($(this).hasClass('chapterb')) { //如果是三级
                $(this).parents('.mycaptB').find('.icon-check').addClass('active');
                var _s = $(this).parents('.mycaptA').find('.mycaptB').not('.none');
                var _a = _s.length;
                var _b = _s.children('dl').find('.active').length;
                //console.log(_a + ' ====== ' + _b);
                if (_a == _b) {
                    $(this).parents('.mycaptA').find('.chaptera').addClass('active');
                }
                var _x = $(this).parents('.cache-course').find('.mycaptA').not('.none');
                var _y = _x.length;
                var _z = _x.children('dl').find('.active').length;
                //console.log(_y + ' ++++++ ' + _z);
                if (_y == _z) {
                    $(this).parents('.cache-course').find('.courseid').addClass('active');
                }
            } else if ($(this).hasClass('chapterc')) { //如果是四级
                var _s = $(this).parents('.mycaptB').find('.mycaptC').not('.none');
                var _a = _s.length;
                var _b = _s.children('dl').find('.active').length;
                //console.log(_a + ' ====== ' + _b);
                if (_a == _b) {
                    $(this).parents('.mycaptB').find('.icon-check').addClass('active');
                }
                var _l = $(this).parents('.mycaptA').find('.mycaptB').not('.none');
                var _m = _l.length;
                var _n = _l.children('dl').find('.active').length;
                //console.log(_m + ' ------ ' + _n);
                if (_m == _n) {
                    $(this).parents('.mycaptA').find('.chaptera').addClass('active');
                }
                var _x = $(this).parents('.cache-course').find('.mycaptA').not('.none');
                var _y = _x.length;
                var _z = _x.children('dl').find('.active').length;
                //console.log(_y + ' ++++++ ' + _z);
                if (_y == _z) {
                    $(this).parents('.cache-course').find('.courseid').addClass('active');
                }
            }
        }
    });

    $(".tasksCache").bind("click",function(e){
        if(!$("body").hasClass("checking")){
            clearInterval(getStatusTime);
       
            var chapterId = $(this).attr("data-chapId");
            var courseId = $(this).find(".down-progress").attr("courseid");
            api.openWin({
                name : "tasks-cache",
                url : 'tasks-cache.html',
                delay : 20,
                pageParam: {chapterId:chapterId,courseId:courseId}
            });  
        }
    }) 
    
}

function get_percent() {
    //总进度计算
    $.each($('.cache-course'), function(k, v) {
        var total = $(v).find('.val').not('.none');
        var len = total.size();
        var num = 0;
        $.each(total, function(key, val) {
            var n = Number($.trim($(val).html()));
            if (!isEmpty(n)) {
                num = accAdd(num, n);
            }
        });
        var percent = num / len;
        percent = parseInt(percent.toFixed(2)) == 'NaN' || parseInt(percent.toFixed(2)) == NaN ? 0 : parseInt(percent.toFixed(2));
        if (percent > 0) {
            if (percent >= 100) {
                percent = 100;
            }
            $(v).find('.progress-val2').text(percent + '%');
            $(v).find('.progress-bar2').width(percent + '%');
            $('.progress-box2').show();
        }
    });
}
// var mydata = [{"data":{"courseName":"CMA 中文 （体验课）","courseId":"8a22ecb557d16e020157d1d7526f1dff","subjectId":"ff808081486933e601489c4662f60851","subjectName":"CMA中文","categoryId":null,"categoryName":null,"chapterNum":"40","taskNum":"35","taskTotal":"35","teacherName":"CMA 明星讲师团","teacherImage":"/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png","teacherHonor":"吴奇奇 张秀军","courseBackgroundImage":"/upload/201610/a53af9b49e8144c1a4400128b09b65de.jpg","createTime":1476694332,"lastModifyTime":1476694,"effectiveDay":280,"versionId":"8a22ecb557d16e020157d1d7526f1dff","courseModuleType":"KNOWLEDGE_MODULE","subjectIndex":10,"categoryIndex":null,"courseIndex":1,"aim":"<p>\r\n\t内容涵盖：\r\n</p>\r\n<p>\r\n\tCMA新版前导课、基础课精彩节选,微课化、利用碎片时间学习,内容转化精彩纷呈,配合大量生动案例,课后测评巩固知识。\r\n</p>\r\n<span>适合人群：</span><span><br />\r\n</span><span>零基础、非财务专业</span><span><br />\r\n</span><span>在校大学生</span><span><br />\r\n</span><span>财务初级从业人员</span>","availability":"","outline":"","coverPath":"/upload/201610/a53af9b49e8144c1a4400128b09b65de.jpg","bigCoverPath":"","knowledgePointId":"ff8080814d6642aa014d69f812880246","chapters":[{"chapterTitle":"CMA Part1 财务规划 绩效与控制","chapterId":"8a22ecb557d16e020157d1e4beb11e02","knowledgePointId":"402890814d6f6abb014d6fe6d3340020","isFree":"false","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterTitle":"第一章：规划、预算编制与预测","chapterId":"8a22ecb557d16e020157d1e5ba0c1e04","knowledgePointId":"402890814d6f6abb014d6fe6d3340020","isFree":"false","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterTitle":"知识点1 战略规划概述","chapterId":"8a22ecb557d16e020157d1e625771e06","knowledgePointId":"402890814d6f6abb014d6fe6d33c0022","isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0a032a80025","taskId":"8a22ecb557d16e020157d1f31cfd1e2a","title":"战略规划概述-a ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":787,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"DE3A00C3A7FF861F9C33DC5901307461"},{"id":"8a22ecb557c831f00157d09d9e0c0016","taskId":"8a22ecb557d16e020157d1f34c391e2b","title":"战略规划概述-c-测评练习","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":242,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"C0120B91BFC60E0E9C33DC5901307461"},{"id":"8a22ecb557c831f00157d0a05dca0029","taskId":"8a22ecb557d16e020157d1f787a81e2c","title":"战略规划概述-b","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":642,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"0A7E6A7E2F0BA1149C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点2 波特五因素分析","chapterId":"8a22ecb557d16e020157d1e64ade1e07","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09dc8370017","taskId":"8a22ecb557d16e020157d1f7c63e1e2d","title":"  波特五因素分析-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":739,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"1D7652DC58EF06C59C33DC5901307461"},{"id":"8a22ecb557c831f00157d09de63f0018","taskId":"8a22ecb557d16e020157d1f7fa2b1e2e","title":"波特五因素分析-b-测评练习","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":343,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"4DCD9DFD7C2E95A89C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点3 战略规划工具 SWOT分析","chapterId":"8a22ecb557d16e020157d1e684291e08","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09e0f200019","taskId":"8a22ecb557d16e020157d1f837b41e2f","title":"SWOT分析-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":489,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"FD53E6F218B6B8849C33DC5901307461"},{"id":"8a22ecb557c831f00157d09e3eda001a","taskId":"8a22ecb557d16e020157d1f868151e30","title":"SWOT分析-b-测评练习 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":196,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"BED972B069868F069C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点4 战略规划工具 5C分析","chapterId":"8a22ecb557d16e020157d1e701c31e09","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09e6456001b","taskId":"8a22ecb557d16e020157d1f8ec571e31","title":"5C分析-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":326,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"6FCCABFFA4FD95899C33DC5901307461"},{"id":"8a22ecb557c831f00157d09e905a001c","taskId":"8a22ecb557d16e020157d1f917f61e32","title":"5C分析-b-测评练习","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":45,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"B92C0784CF99BC4F9C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点5 战略规划工具 波士顿矩阵","chapterId":"8a22ecb557d16e020157d1e794f51e0a","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09ec3eb001d","taskId":"8a22ecb557d16e020157d1f94ffe1e33","title":"波士顿矩阵-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":756,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"016D5B47557C7FD79C33DC5901307461"},{"id":"8a22ecb557c831f00157d09ee9de001e","taskId":"8a22ecb557d16e020157d1f97c691e34","title":"波士顿矩阵-b","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":249,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"11B7A31FB96EDD149C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点6 战略规划工具 其他分析工具","chapterId":"8a22ecb557d16e020157d1e7bc0b1e0b","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09f0f06001f","taskId":"8a22ecb557d16e020157d1f9b7371e35","title":"其他分析工具-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":339,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"174AAB94972B160F9C33DC5901307461"},{"id":"8a22ecb557c831f00157d09f461f0020","taskId":"8a22ecb557d16e020157d1f9ec371e36","title":"其他分析工具-b-测评练习","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":61,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"D8ECDC8D38D18DE89C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"chapterTitle":"第二章：成本管理","chapterId":"8a22ecb557d16e020157d1e5e52c1e05","knowledgePointId":"402890814d6f6abb014d6fe6d4f40086","isFree":"false","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterTitle":"知识点1 固定和变动间接成本","chapterId":"8a22ecb557d16e020157d1e7edd01e0c","knowledgePointId":"402890814d6f6abb014d6fe6d56700a0","isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09f69660021","taskId":"8a22ecb557d16e020157d1fa42cc1e37","title":"固定和变动间接成本-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":593,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"D4AAB0C9FF06DBBA9C33DC5901307461"},{"id":"8a22ecb557c831f00157d09f8ee60022","taskId":"8a22ecb557d16e020157d1fa71101e38","title":"固定和变动间接成本-b-测评练习 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":179,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"7C853C8EEB4E5C1C9C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点2 间接成本分摊方法","chapterId":"8a22ecb557d16e020157d1e819d71e0d","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09fbc9a0023","taskId":"8a22ecb557d16e020157d1fab7791e39","title":"间接成本分摊方法-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":634,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"9662C2BF70EB52E69C33DC5901307461"},{"id":"8a22ecb557c831f00157d09fdbdb0024","taskId":"8a22ecb557d16e020157d1faec371e3a","title":"间接成本分摊方法-b-测评练习","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":248,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"FA97618ED57A76819C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点3 服务部门成本的分配","chapterId":"8a22ecb557d16e020157d1e847e81e0e","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d09ceb290014","taskId":"8a22ecb557d16e020157d1fb1d8c1e3b","title":"服务部门成本的分配-a","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":1098,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"C3A4A9C4764CEEEC9C33DC5901307461"},{"id":"8a22ecb557c831f00157d09d238e0015","taskId":"8a22ecb557d16e020157d1fb48cc1e3c","title":"服务部门成本的分配-b-测评练习","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":297,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"B8AD532F6C4C91319C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null}]}]},{"chapterTitle":"CMA Part2 财务决策","chapterId":"8a22ecb557d16e020157d1e51dcf1e03","knowledgePointId":null,"isFree":"false","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterTitle":"第一章 财务报表分析","chapterId":"8a22ecb557d16e020157d1e9d6ae1e0f","knowledgePointId":null,"isFree":"false","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterTitle":"第一章 课程介绍","chapterId":"8a22ecb557d16e020157d1ea1fce1e11","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0a187ea002d","taskId":"8a22ecb557d16e020157d1f2902f1e29","title":"第一章 课程介绍 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":621,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"5C6A67834A73099E9C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点1 垂直百分比分析","chapterId":"8a22ecb557d16e020157d1ea4c341e12","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b01f4a0033","taskId":"8a22ecb557d16e020157d1f211581e27","title":"垂直百分比分析 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":812,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"598C30374B515D209C33DC5901307461"},{"id":"8a22ecb557c831f00157d0a2088e0030","taskId":"8a22ecb557d16e020157d1f243c01e28","title":"垂直百分比分析-测评题","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":142,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"9E182662D6F4B9A39C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点2 水平百分比分析","chapterId":"8a22ecb557d16e020157d1ea760e1e13","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0a1d857002f","taskId":"8a22ecb557d16e020157d1f19b6f1e25","title":"水平百分比分析","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":447,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"439D5E0A7318188F9C33DC5901307461"},{"id":"8a22ecb557c831f00157d0a1a5dd002e","taskId":"8a22ecb557d16e020157d1f1c8811e26","title":"水平百分比分析-测评题","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":137,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"01FEA975C3C869589C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"chapterTitle":"第二章 公司财务","chapterId":"8a22ecb557d16e020157d1e9f92e1e10","knowledgePointId":null,"isFree":"false","isLeaf":"false","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"chapterTitle":"第二章 课程介绍","chapterId":"8a22ecb557d16e020157d1eab1b21e14","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b040750034","taskId":"8a22ecb557d16e020157d1f0e1341e24","title":"第二章 课程介绍 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":397,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"0220492CC48596859C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点1 中期资本来源（上）","chapterId":"8a22ecb557d16e020157d1eae03e1e15","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b1b836003e","taskId":"8a22ecb557d16e020157d1f00c7e1e22","title":"中期资本来源（上） ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":585,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"CFC5106735F2F3389C33DC5901307461"},{"id":"8a22ecb557c831f00157d0b1946b003d","taskId":"8a22ecb557d16e020157d1f03f9c1e23","title":"中期资本来源（上）-测评题","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":176,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"D668F1964D5A6BAB9C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点2 中期资本来源（下）","chapterId":"8a22ecb557d16e020157d1eb09a11e16","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b170f2003c","taskId":"8a22ecb557d16e020157d1ef9d261e20","title":"中期资本来源（下）","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":1468,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"598F755DD2833A279C33DC5901307461"},{"id":"8a22ecb557c831f00157d0b14332003b","taskId":"8a22ecb557d16e020157d1efce4e1e21","title":"中期资本来源（下）-测评题","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":537,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"3CA6D172C3C24B7D9C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点3 其它长期资本来源","chapterId":"8a22ecb557d16e020157d1eb38de1e17","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b11b6a003a","taskId":"8a22ecb557d16e020157d1ee0bd11e1e","title":"其它长期资本来源","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":325,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"179B3B26723230369C33DC5901307461"},{"id":"8a22ecb557c831f00157d0b0f8200039","taskId":"8a22ecb557d16e020157d1ee3c341e1f","title":"其它长期资本来源-测评题","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":270,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"F51F67EAD64454829C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点4 资本筹集中需要考虑的其他问题（上）","chapterId":"8a22ecb557d16e020157d1eb5c941e18","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b0d0c00038","taskId":"8a22ecb557d16e020157d1ed5f381e1c","title":"资本筹集中需要考虑的其他问题（上）","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":673,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"00E32C45278A31769C33DC5901307461"},{"id":"8a22ecb557c831f00157d0b0ab850037","taskId":"8a22ecb557d16e020157d1ed8f8f1e1d","title":"资本筹集中需要考虑的其他问题（上）-测评题 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":291,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"97EEE0B1E5641AC09C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterTitle":"知识点5 资本筹集中需要考虑的其他问题（下）","chapterId":"8a22ecb557d16e020157d1eb93571e19","knowledgePointId":null,"isFree":"false","isLeaf":"true","tasks":[{"id":"8a22ecb557c831f00157d0b08a9e0036","taskId":"8a22ecb557d16e020157d1ec6dc91e1a","title":"资本筹集中需要考虑的其他问题（下） ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":1017,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"4ED3EADD1827E0BD9C33DC5901307461"},{"id":"8a22ecb557c831f00157d0b064f00035","taskId":"8a22ecb557d16e020157d1ec9f121e1b","title":"资本筹集中需要考虑的其他问题（下）-测评题 ","taskType":"video","taskLevel":null,"express":null,"attachmentPath":"","videoTime":288,"videoSiteId":"D550E277598F7D23","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"0583C9FC0E64DA2B9C33DC5901307461"}],"chapterFiles":null,"chapterExtends":null,"children":null}]}]}]}}]
// var tpl = $('#tpl').html();
//     console.log(JSON.stringify(mydata))
//     var content = doT.template(tpl)(mydata);
//     $('#content').html(content);
function init_data() {
    var tpl = $('#tpl').html();
    var content = doT.template(tpl)(mydata);
    $('#content').html(content);
    api.parseTapmode();
    init_check();
    get_percent();
    circleProgress();
    
    //圆形进度条绘制
    $.each($('.down-progress'), function(k, v) {
        var num = parseInt($(v).find('.val').html());
        if (!isEmpty(num)) {
            var percent = num / 100,
                perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(v).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
        }
    });
    //初始化下载状态
    var downed = $api.getStorage(memberId + 'downed');
    if (downed) {
        var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),
            chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),
            chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'),
            progress = get_loc_val(memberId + 'downed', 'progress');
        var id = '';
        //一级章节下载记录
        if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
            id = chapterIdA;
        }
        //二级章节下载记录
        if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
            id = chapterIdB;
        }
        //三级章节下载记录
        if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
            id = chapterIdC;
        }
        if (progress == 100) {
            $("#" + id).attr({
                'type': 4
            });
        } else {
            $("#" + id).attr({
                'type': 1
            });
        }
    } else {
        $('.down-progress[type="1"]').attr({
            type: 2
        });
    }
    api.hideProgress();
}

function get_data() {
//  setTimeout(function() {
//      api.hideProgress();
//      api.refreshHeaderLoadDone();
//  }, 100);

    $('body').removeClass('checking');
    /*后台代码*/
     memberId = getstor('memberId');
    mydata = [];
    set_data(0);
    // var len = Object.keys(data).length; //  2
    
}
function set_data(num) {

        //1:获取所有下载记录并解析
        getdownrecord();
        //2:根据couselist获取所有缓存课程的章节详情，如果在线，从服务器获取，否则本地数据库获取
        initDom();
        clearInterval(getStatusTime);
        getStatusTime = setInterval(function(){
            getdownrecord();
            // getCurrentDownloadTaskState();
        },2000)

//            var dat = {"data":[{"orderId_item_id":"8a22ecb5527d428e0152e40b7401013d","expirationTime":1472636819,"isU":"false","buyTime":1455524902,"activeTime":1457084819,"courseId":"ff808081473905e7014762700dfa0081","activeState":"acitve","lockStatus":0},{"orderId_item_id":"8a22ecb553ca891a0153cb8c5a64037c","expirationTime":1475045015,"isU":"false","buyTime":1459408886,"activeTime":1459493015,"courseId":"ff808081473905e7014762700dfa0081","activeState":"acitve","lockStatus":0},{"orderId_item_id":"ff8080814c7e427e014ca1d4720e0c33","expirationTime":1444196286,"isU":"false","buyTime":1428644271,"activeTime":1428644286,"courseId":"ff808081473905e7014762700dfa0081","activeState":"acitve","lockStatus":0}],"state":"success","msg":""}
//             mydata.push(dat);
//             init_data();
        // } else { //某个课程缓存列表
        //     if (!isEmpty(data) && !in_array(api.pageParam.courseId, data)) {
        //         $('#content').html('');
        //         $('body').addClass('null');
        //         return false;
        //     }
        //     read_file(memberId + api.pageParam.courseId + '.db', function(ret, err) {
        //         if (ret) {
        //             var ret_data = JSON.parse(ret.data);
        //             var res = {
        //                 data: ret_data
        //             };
        //             mydata.push(res);
        //             init_data();
        //         }
        //     });
        // }
}
function initDom() {
    cache_model = api.require('lbbVideo');
        var param = {"userId":memberId};
        if(api.pageParam.courseId){
            param.courseId = api.pageParam.courseId
        }
           cache_model.getCourseJsonWithCourseId(param,function(ret,err){ 
	           if(JSON.parse(ret.data).length<1){
	                $('#content').html('');
	                $('body').addClass('null');
                    api.hideProgress();
	                return false;
	           }
               
                $.each(JSON.parse(ret.data),function(k,v){
                    var ret_data = JSON.parse(v.courseJson);
                    var res = {
                        data: ret_data[0]
                    };
                    mydata.push(res); 
                    
                })
                
                init_data();
                initDomDownStatus();
                //处理圈圈
                isSolidcircle('circle', '', '');
                showCacheList();
           })
        }

function initDomDownStatus(){
	    if(isEmpty($api.getStorage("videochangelist"))){
	        return false;
	    }
	    var strs = $api.getStorage("videochangelist").split(","); //字符分割
	    var pathlen = strs.length;
	
	    //从1开始，因为拼接videochangelist的时候用,开始的
	//     alert(strs+"====="+JSON.stringify(videoDownInfo))
	    for (j=1; j<pathlen;j++ ){
	        var domInfo = videoDownInfo[strs[j]];
	        var domid = strs[j];
	        // alert(JSON.stringify(domInfo))
	        if(!isEmpty(domInfo)){
	            var domprogress = videoDownInfo[strs[j]].progress;
	            var domstatus = videoDownInfo[strs[j]].status;
	            var domtasknum = videoDownInfo[strs[j]].tasknum;
//	             alert(domid+"==="+domprogress+"==="+domstatus)
	            // ------------------设置界面对应id节点dom下载状态，并设置为可见--------------------------
	            
            	$("#course"+domid).find(".progress-bar2").css("width",domprogress.toFixed(2)+"%");
            	$("#course"+domid).find(".progress-val2").text(domprogress.toFixed(2)+"%");
	            
	            $(".task"+domid).attr("type",domstatus);
	            $(".task"+domid).find(".val").html(domprogress);
	            // alert($(".task"+domid).html())
	        }    
	    }
	    setCapterState();
	    
	    init_process();
		//    ------------------设置结束--------------------------
	
	   

		
	}
	function setCapterState(){
        $.each($(".tasksBoxs"),function(k,v){
             var waitNum = 0,
                 ingNum = 0,
                 okNum = 0,
                 stopNum = 0;
            var taskList = $(v).prev(".list").find(".down-progress");
            var len =0;
            $.each($(v).find(".down-progress"),function(key,val){
                if($(val).attr("type") == 1){
                     ingNum++;
                 }else if($(val).attr("type") == 2){
                     stopNum++;
                 }else if($(val).attr("type") == 5){
                     waitNum++;
                 }else if($(val).attr("type") == 4){
                     okNum++;
                 }
            });
            if(ingNum>0){
                 taskList.attr("type",1);                
             }else if(waitNum>0 || stopNum>0){
                 taskList.attr("type",2);
             }else if(ingNum<1 && (waitNum<1 || stopNum<1) && okNum>0){
                 taskList.attr("type",4);
             }
             // taskList.html(domprogress);
    	})

	}
function showCacheList(){
    $.each($(".cache-course"),function(kk,vv){
    	if( $(vv).find(".mycaptC").length>0 && $(vv).find(".mycaptB").length>0 && $(vv).find(".mycaptA").length>0 ){
    	   showCaptCFn($(vv));
		   showCaptBFn($(vv));
		   showCaptAFn($(vv));
		   showCourseFn($(vv));	
    	}else if( $(vv).find(".mycaptC").length<1 && $(vv).find(".mycaptB").length>0 && $(vv).find(".mycaptA").length>0){
    		showCaptCFn2($(vv));
		    showCaptBFn2($(vv));
		    showCourseFn2($(vv));	
    	}else if( $(vv).find(".mycaptC").length<1 && $(vv).find(".mycaptB").length<1 && $(vv).find(".mycaptA").length>0 ){
    		showCaptCFn3($(vv));
    		showCourseFn3($(vv));
    	}
        
	})
}

function showCaptCFn(obj){
	
	$.each(obj.find(".mycaptC"),function(k,v){
//		if($(v).css("display") != "none"){
			var taskList = $(v).next(".tasksBoxs").find(".taskList");
	        var len =0;
	        $.each(taskList,function(key,val){
//	        	alert($(val).find(".down-progress").attr("type"))
                if($(val).find(".down-progress").attr("type") == 1){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 2){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 5){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 4){
                    len++;
                }
            });
            //alert(len)
		    if(len>0){
	            $(v).show();
	        }else{
	            $(v).hide();
	        }
//		}
	})
	
}
function showCaptBFn(obj){
    $.each(obj.find(".mycaptB"),function(k,v){
//		if($(v).css("display") != "none"){
			var mycaptCList = $(v).find(".mycaptC");
	        var len =0;
	        $.each(mycaptCList,function(key,val){
	        	if($(this).css("display") != "none"){
	        		len++;
	        	}
            });
		    if(len>0){
	            $(v).show();
	        }else{
	            $(v).hide();
	        }
//		}
	})
}
function showCaptAFn(obj){
    $.each(obj.find(".mycaptA"),function(k,v){
    	
        var mycaptBList = $(v).find(".mycaptB");
        if(mycaptBList.length>0){
        	var len =0;
	        $.each(mycaptBList,function(key,val){
	        	if($(this).css("display") != "none"){
	        		len++;
	        	}
	        });
	        
	        if(len>0){
	            $(v).show();
	        }else{
	            $(v).hide();
	        }
        }else{
        	var taskList = $(v).next(".tasksBoxs").eq(0).find(".taskList");
        	var len =0;
	        $.each(taskList,function(key,val){
//	        	alert($(val).find(".down-progress").attr("type"))
                if($(val).find(".down-progress").attr("type") == 1){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 2){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 5){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 4){
                    len++;
                }
            });
            //alert(len)
		    if(len>0){
	            $(v).show();
	        }else{
	            $(v).hide();
	        }
        }
        
    })
}
function showCourseFn(obj){
	
    $.each(obj,function(k,v){
        var mycaptAList = $(v).find(".mycaptA");
        var len =0;
        $.each(mycaptAList,function(key,val){
        	if($(this).css("display") != "none"){
        		len++;
        	}
        });       
        if(len>0){
            $(v).show();
        }else{
            $(v).hide();
        }
    })
    noCache();
}

function noCache(){
	var courseNum = 0;
	$.each($(".cache-course"),function(kk,vv){
		if($(this).css("display") != "none"){
    		courseNum++;
    	}else{
            cache_model = api.require('lbbVideo');

            cache_model.deleteCourseJson({
                "userId" : getstor('memberId'),
                "courseId" : $(this).find(".courseid").attr("dataid")
            },function(){

            }) 
        }
	});
	
	if(courseNum<1){
		$('#content').html('');
		$('body').addClass('null');
        
		return false;
	}
}

function showCaptCFn2(obj){
	$.each(obj.find(".mycaptB"),function(k,v){
//		if($(v).css("display") != "none"){
			var taskList = $(v).find(".tasksBoxs").eq(0).find(".taskList");
	        var len =0;
	        $.each(taskList,function(key,val){
//	        	alert($(val).find(".down-progress").attr("type"))
                if($(val).find(".down-progress").attr("type") == 1){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 2){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 5){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 4){
                    len++;
                }
            });
		    if(len>0){
	            $(this).show();   
	        }else{
	            $(this).hide();
	        }
//		}
	})	
}
function showCaptBFn2(obj){
    $.each(obj.find(".mycaptA"),function(k,v){
//		if($(v).css("display") != "none"){
			var mycaptCList = $(v).find(".mycaptB");
	        var len =0;
	        $.each(mycaptCList,function(key,val){
	        	if($(this).css("display") != "none"){
	        		len++;
	        	}
            });
		    if(len>0){
	            $(v).show();
	        }else{
	            $(v).hide();
	        }
//		}
	})
}
function showCourseFn2(obj){
	
    $.each(obj,function(k,v){
        var mycaptAList = $(v).find(".mycaptA");
        var len =0;
        $.each(mycaptAList,function(key,val){
        	if($(this).css("display") != "none"){
        		len++;
        	}
        });       
        if(len>0){
            $(v).show();
        }else{
            $(v).hide();
        }
    })
    noCache();
}

//种类三
function showCaptCFn3(obj){
	$.each(obj.find(".mycaptA"),function(k,v){
//		if($(v).css("display") != "none"){
			var taskList = $(v).next(".tasksBoxs").find(".taskList");
	        var len =0;
	        $.each(taskList,function(key,val){
//	        	alert($(val).find(".down-progress").attr("type"))
                if($(val).find(".down-progress").attr("type") == 1){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 2){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 5){
                    len++;
                }else if($(val).find(".down-progress").attr("type") == 4){
                    len++;
                }
            });
		    if(len>0){
	            $(this).show();   
	        }else{
	            $(this).hide();
	        }
//		}
	})	
}

function showCourseFn3(obj){
	
    $.each(obj,function(k,v){
        var mycaptAList = $(v).find(".mycaptA");
        var len =0;
        $.each(mycaptAList,function(key,val){
        	if($(this).css("display") != "none"){
        		len++;
        	}
        });       
        if(len>0){
            $(v).show();
        }else{
            $(v).hide();
        }
    })
	noCache();
}
function get_input(name) {
    var data = [];
    $.each($("." + name), function(k, v) {
        if ($(v).hasClass('active')) {
            switch (name) {
                case 'courseid':
                    data.push($.trim($(v).attr('dataid')));
                    break;
                case 'chaptera':
                    if ($(v).parents('.mycaptA').not('.none')) {
                        data.push($.trim($(v).attr('dataid')));
                    }
                    break;
                case 'chapterb':
                    if ($(v).parents('.mycaptB').not('.none')) {
                        data.push($.trim($(v).attr('dataid')));
                    }
                    break;
                case 'chapterc':
                    if ($(v).parents('.mycaptC').not('.none')) {
                        data.push($.trim($(v).attr('dataid')));
                    }
                    break;
            }
        }
    });
    return data;
}

function set_down_status(str) {
    //var data=JSON.parse(str);
    var data = str;
    var type = data.type,
        chapterIdA = isEmpty(data.chapterIdA) ? '' : data.chapterIdA,
        chapterIdB = isEmpty(data.chapterIdB) ? '' : data.chapterIdB,
        chapterIdC = isEmpty(data.chapterIdC) ? '' : data.chapterIdC;
    var id = '';
    //一级章节下载记录
    if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
        id = chapterIdA;
    }
    //二级章节下载记录
    if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
        id = chapterIdB;
    }
    //三级章节下载记录
    if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
        id = chapterIdC;
    }
    var obj = $('#' + id);
    switch (type) {
        case 'error':
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '下载失败！',
                location: 'middle'
            });
            break;
        case 'redown':
            $('.down-progress[type="1"]').attr({
                type: 3
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '下载失败！',
                location: 'middle'
            });
            break;
        case 'filedel':
            $(obj).attr({
                type: 2
            });
            var num = $api.getStorage(memberId + id + 'progress');
            $(obj).find('.val').text(num);
            var percent = num / 100,
                perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            get_percent();
            api.alert({
                msg: '缓存文件被清理,请重新下载',
                location: 'middle'
            });
            break;
        case 'no_video':
            api.toast({
                msg: '无视频任务',
                location: 'middle'
            });
            break;
        case 'less_space':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '可用空间不足,下载已暂停',
                location: 'middle'
            });
            break;
        case 'not_wifi':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '脱离WiFi环境自动暂停下载',
                location: 'middle'
            });
            break;
        case 'deny_down':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '当前正在移动网络，请在WIFI环境中下载',
                location: 'middle'
            });
            break;
        case 'shut_network':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type: 2
            });
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg: '网络已断开，请检查网络状态',
                location: 'middle'
            });
            break;
        case 'wait':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                'type': 2
            }).siblings('.down_speed').html('').addClass('none');
            break;
        case '1':
        case 1:
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            //下载中->暂停
            $('.down-progress[type="1"]').attr({
                type: 2
            }).siblings('.down_speed').html('').addClass('none');
            $(obj).attr({
                'type': 2
            });
            break;
        case '2':
        case 2:
            //暂停->下载中
            $('.down-progress[type="1"]').attr({
                type: 2
            });
            $('.down_speed').html('').addClass('none');
            $(obj).attr({
                type: 1
            });
            break;
        case '3':
        case 3:

            $('.down-progress[type="1"]').attr({
                type: 2
            });
            break;
        case 'ing':
            $('.down-progress[type="1"]').attr({
                type: 2
            });
            $(obj).attr({
                type: 1
            });
            break;
        case 'progress':
            $.each($('.down_speed'), function(k, v) {
                if ($(v).siblings('.down-progress').attr('id') != id) {
                    $(v).html('').addClass('none');
                }
            });
            $(obj).attr({
                type: 1
            });
            get_percent();
            var percent = data.progress / 100,
                perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            if (data.progress >= 100) {
                $(obj).attr({
                    type: 4
                }).siblings('.down_speed').html('').addClass('none');
            }
            $(obj).find('.val').text(data.progress);
            break;
        case 'end':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            get_percent();
            $(obj).attr({
                type: 4
            }).siblings('.down_speed').html('').addClass('none');
            break;
    }
}
var mydata = [];
var memberId;
var is_del_downed = false;
apiready = function() {
    //api.addEventListener({
    //    name : 'DOWN'
    //}, function(ret) {
    //    api.toast({
    //        msg:JSON.stringify(ret)
    //    })
    //});

    api.showProgress({
        title: '加载中',
        modal: false
    });
    memberId = getstor('memberId');
    mydata = [];

    if(api.systemType == "ios"){
        setTimeout(function(){
            get_data();
        },100)
    }else{
        setTimeout(function(){
            get_data();
        },1000)
    }
    
    
    
    api.addEventListener({
        name: 'flush_cache'
    }, function(ret, err) {
        $('body').removeClass('checking');
        $('.icon-check').removeClass('active');
        clearInterval(getStatusTime);
		getStatusTime = setInterval(function(){
		    getdownrecord();
           // getCurrentDownloadTaskState(); 
		},2000)
//      mydata = [];
//      set_data(0);
     // ;
//      lastgettime = 1388509261;
//      videochangelist = "";
//      couselist = "";
//      videoDownInfo =new Object();
//      getdownrecord();
     // get_data();
//      initDomDownStatus();
    });
    
//  api.addEventListener({
//      name: 'reloadPage'
//  }, function(ret, err) {
//      location.reload();
//  });
    api.addEventListener({
        name: 'down_speed'
    }, function(ret) {
        if (ret) {
            var speed = ret.value.speed;
            //初始化下载状态
            var downed = $api.getStorage(memberId + 'downed');
            var chapterIdA = get_loc_val(memberId + 'downed', 'chapterIdA'),
                chapterIdB = get_loc_val(memberId + 'downed', 'chapterIdB'),
                chapterIdC = get_loc_val(memberId + 'downed', 'chapterIdC'),
                progress = get_loc_val(memberId + 'downed', 'progress');
            var id = '';
            //一级章节下载记录
            if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                id = chapterIdA;
            }
            //二级章节下载记录
            if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) {
                id = chapterIdB;
            }
            //三级章节下载记录
            if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) {
                id = chapterIdC;
            }
            //$('.down-progress').siblings('.down_speed').html('').addClass('none');
            $('#' + id).siblings('.down_speed').html(speed).removeClass('none');
        }
    });
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/arrow-down-o.png',
        bgColor: '#f3f3f3',
        textColor: '#787b7c',
        textDown: '下拉更多',
        textUp: '松开刷新',
        showTime: false
    }, function(ret, err) {
    	
    	
        api.hideProgress();
        api.refreshHeaderLoadDone();
        location.reload();
        if($(".cache-course").length<1){
			$('#content').html('');
			$('body').addClass('null');
			return false;
		}
	   
        
    });

    api.addEventListener({
          name: 'openachapt'
      }, function(ret) {
          if (ret.value.sethomepage == 1) { //删除
              $('body').addClass('checking');
              var ccids = [];

              $.each($(".tasksBoxs"),function(k,v){
              	
                var checkFath = $(v).prev("li").find(".icon-check");
                if(checkFath.hasClass("active")){
                    
                    var videoArr = $(v).find(".taskList");
                    $.each(videoArr,function(key,val){
                        var taskID = JSON.parse($(val).find(".down_data").html()).videoCcid;
                        ccids.push(taskID);        
                     })
                }
                
             })

 
            if(ccids.length<1){ return false; };
//          var jsfun = 'down_stop(function(){});';
//          api.execScript({
//              name: 'root',
//              script: jsfun
//          });
             api.showProgress({
                 title: '删除中',
                 modal: true
             });
             
             var jsfun = "rmVideo('" + JSON.stringify(ccids) + "');";
             api.execScript({
                name: 'root',
                script: jsfun
             });
             //获取新内容
             setTimeout(function() {
                $.each($(".down-progress"),function(k,v){
                    if($(v).prev(".icon-check").hasClass("active")){
                        $(v).closest("li").hide();
                    }
                 })
                api.hideProgress();
                 api.sendEvent({
                    name: "cancle_del"
                 });
                  $('body').removeClass('checking');
                  $('.icon-check').removeClass('active');           
                // var len = 0;
                // $.each($(".list"),function(k,v){
                //      if($(v).css("display") != "none"){
                //         len++;
                //      }
                // })
                // if(len<1){
                //    $('#content').html('');
                //    $('body').addClass('null');
                //    return false;
                // }

             },1000)
          } else if (ret.value.sethomepage == 2) { //取消
              $('body').removeClass('checking');
              $('.icon-check').removeClass('active');
          } else if (ret.value.sethomepage == 3) { //全选
              $('.icon-check').addClass('active');
          }
      });

};
var course_detail;

function next(leave, num1, num2, num3, courseId, obj) {
    //如果没有缓存信息，就从接口获取
    var tmp_course_detail = $api.getStorage(courseId);
    if (isEmpty(tmp_course_detail)) {
        //获取课程的详细信息
        //api/v2.1/course/courseDetail，接口编号：004-006
        ajaxRequest('api/teachsource/course/courseDetail', 'get', {
            courseId: courseId
        }, function(ret, err) { //004.006获取课程的详细信息
            if (err) {
                api.hideProgress();
                api.toast({
                    msg: err.msg,
                    location: 'middle'
                });
                return false;
            }
            if (ret && ret.state == 'success') {
                if (!ret.data) {
                    api.toast({
                        msg: '暂无任务',
                        location: 'middle'
                    });
                    return false;
                }
                course_detail = ret.data[0];
                //课程详情数据
                $api.setStorage(courseId, course_detail);
                var res_process = {
                    'oneChapterIndex': num1, //一级章节索引
                    'twoChapterIndex': (num2 == -1) ? 0 : num2, //二级章节索引
                    'threeChapterIndex': (num3 == -1) ? 0 : num3, //三级章节索引
                    'taskIndex': 0, //任务索引
                    'chapterDeep': leave - 1, //章节层级
                    'progress': 0 //任务学习进度
                };
                judge_task(res_process);
            }
        });
    } else {
        course_detail = tmp_course_detail;
        //存储课程详细信息
        var res_process = {
            'oneChapterIndex': num1, //一级章节索引
            'twoChapterIndex': (num2 == -1) ? 0 : num2, //二级章节索引
            'threeChapterIndex': (num3 == -1) ? 0 : num3, //三级章节索引
            'taskIndex': 0, //任务索引
            'chapterDeep': leave - 1, //章节层级
            'progress': 0 //任务学习进度
        };
        judge_task(res_process);
        //用户上次学习进度数据
    }
}
//判断任务类型，跳转相应的页面
function judge_task(res_process) {
    if (isEmpty(course_detail) || isEmpty(course_detail.chapters) || isEmpty(res_process)) {
        api.toast({
            msg: '暂无任务',
            location: 'middle'
        });
        return false;
    }

    //获取章节信息
    if (res_process.chapterDeep >= 0) {
        var chapters_info = course_detail.chapters[res_process.oneChapterIndex]; //一级章节信息
    }
    if (res_process.chapterDeep >= 1) {
        var chapters_info = chapters_info.children[res_process.twoChapterIndex]; //二级章节信息
    }
    if (res_process.chapterDeep >= 2) {
        var chapters_info = chapters_info.children[res_process.threeChapterIndex]; //三级章节信息
    }

    if (isEmpty(chapters_info) || isEmpty(chapters_info.tasks)) {
        api.toast({
            msg: '暂无任务',
            location: 'middle'
        });
        return false;
    }
    var task_info = chapters_info.tasks[res_process.taskIndex]; //当前任务信息
    if (isEmpty(task_info)) {
        api.toast({
            msg: '暂无任务',
            location: 'middle'
        });
        return false;
    }
    //判断当前任务类型
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
            msg: '暂无任务，请稍后再试或联系客服',
            location: 'middle'
        });
        return false;
    }
    //需要传递的参数
    var pageParams = {
        from: 'course-studying',
        courseId: course_detail.courseId, //课程id
        study_progress: res_process, //学习进度
        course_detail: course_detail, //课程详情
        task_info: task_info, //当前要学习的任务信息,
        type: 'task'
    };
    api.hideProgress();
    //设置屏幕向右翻转
    api.setScreenOrientation({
        orientation: 'landscape_right'
    });
    //跳转到播放页面
    api.openWin({
        name: new_win_name,
        url: new_win_url,
        delay: 200,
        slidBackEnabled: false, //iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
        pageParam: pageParams
    });
}
