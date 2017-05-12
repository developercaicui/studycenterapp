
var is_debug = false;
var getStatusTime = null;
  var videoDownInfo =new Object(); //缓存每个节点的下载状态，一个节点一个id
var videochangelist = $api.getStorage("videochangelist") ? $api.getStorage("videochangelist") : ""; //记录每次定时器和数据库同步数据后发生改变的dom节点id
var couselist = ""; //记录缓存包括的课程id
var lastgettime = 1388509261;//记录每次获取数据库的时间点，下次获取就只获取该时间点之后变化的记录(第一次获取可以获取2014年1月1日1时1分1秒//)

/*video-menu视频右侧章节列表页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 1280) * 100 + 'px';

//定义页面需要的变量
var now_nav_type = 1; //章节列表(type:1)、本章任务(type:2)、本章附件(type:3)、扩展阅读(type:4)
var course_detail; //课程详情
var courseId; //课程id
var study_progress; //当前的进度
var task_info = ''; //当前任务信息
var task_arr = ''; //所有任务信息
var task_info_detail;
var from_page = ''; //从哪个win打开的这个章节列表
var chapter_data = ''; //最后一级章节信息
var memberId;
var is_over_list = false; //章节列表是否已加载过，false未加载过，true已加载
var is_over_task = false; //本章任务是否已加载过，false未加载过，true已加载
var is_over_file = false; //本章附件是否已加载过，false未加载过，true已加载
var is_over_extend = false; //扩展阅读是否已加载过，false未加载过，true已加载

var tmpOne = 0; //临时一级章节索引
var tmpTwo = 0; //临时二级章节索引
var tmpThree = 0; //临时三级章节索引
var taskNum = 0; //临时任务索引
var tmpDeep = 0; //章节层级
function set_down_status(str){
    //var data=JSON.parse(str);
    var data=str;
    var type = data.type, 
        chapterIdA = isEmpty(data.chapterIdA) ? '' : data.chapterIdA,
        chapterIdB = isEmpty(data.chapterIdB) ? '' : data.chapterIdB,
        chapterIdC = isEmpty(data.chapterIdC) ? '' : data.chapterIdC,
        item = data.item;
    var id='';
    //一级章节下载记录
    if(!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) id=chapterIdA;
    //二级章节下载记录
    if(!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) id=chapterIdB;
    //三级章节下载记录
    if(!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) id=chapterIdC;
    // var obj = $('#' + id);
    var obj = $('.task' + item);
   
    switch (type) {
        case 'error':
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '下载失败！',
                location : 'middle'
            });
            break;
        case 'redown':
            $('.down-progress[type="1"]').attr({
                type :  3
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '下载失败！',
                location : 'middle'
            });
            break;
        case 'filedel':
            $(obj).attr({
                type : 2
            });
            var num = $api.getStorage(memberId + id + 'progress');
            $(obj).find('.val').text(num);
            var _w = $('#svgDown').width();
            var percent = num / 100, perimeter = Math.PI * _w * 0.9;
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            api.alert({
                msg : '缓存文件被清理,请重新下载',
                location : 'middle'
            }); 
            break;
        case 'no_video':
            api.toast({
                msg : '无视频任务',
                location : 'middle'
            });
            break;
        case 'less_space':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '可用空间不足,下载已暂停',
                location : 'middle'
            });
            break;
        case 'not_wifi':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '脱离WiFi环境自动暂停下载',
                location : 'middle'
            });
            break;
        case 'deny_down':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '当前正在移动网络，请在WIFI环境中下载',
                location : 'middle'
            });
            break;
        case 'shut_network':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 2
            });
            $('.down-progress[type="1"]').attr({
                type : 2
            }).siblings('.down_speed').html('').addClass('none');
            api.toast({
                msg : '网络已断开，请检查网络状态',
                location : 'middle'
            });
            break;
        case 'wait':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                'type' : 2
            }).siblings('.down_speed').html('').addClass('none');
            break;
        case '1':
        case 1:
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            //下载中->暂停
            // $('.down-progress[type="1"]').attr({
            //     type : 2
            // }).siblings('.down_speed').html('').addClass('none');

            $(obj).attr({
                'type' : 2
            });
            break;
        case '2':
        case 2:
            //暂停->下载中
            // $('.down-progress[type="1"]').attr({
            //     type : 2
            // });
            // $('.down_speed').html('').addClass('none');
            $(obj).attr({
                type : 2
            });
            break;
        case '5':
        case 5:
            //等待->下载中
            // $('.down-progress[type="1"]').attr({
            //     type : 2
            // });
            // $('.down_speed').html('').addClass('none');
            // $(obj).attr({
            //     type : 1
            // });

            var type1 = $('.down-progress[type="1"]');
            if(type1 && type1.length){
              type1.attr({
                type : 2
              })
            }
            $(obj).attr({
                type : 1
            });

            break;
        case '3':
        case 3:
        	        
            var isDownding = $api.getStorage('isDownding');
                    
            if(isDownding == "false"){
            	isDownding = false;
            }else if(isDownding == 'true'){
            	isDownding = true;
            }
            if(isDownding){
	             var type1 = $('.down-progress[type="1"]');
	            if(type1 && type1.length){
	              $(obj).attr({
	                  type : 5
	              });
	            }else{
	              // $('.down-progress[type="1"]').attr({
	              //     type : 2
	              // });
	           
	              
	            }
            }else{
	            $(obj).attr({
	                  type : 1
	              });
            }
            
            break;
        case 'ing':
            $('.down-progress[type="1"]').attr({
                type : 2
            });
            $(obj).attr({
                type : 1
            });
            break;
        case 'progress':
            $.each($('.down_speed'),function(k,v){
                if($(v).siblings('.down-progress').attr('id')!=id){
                    $(v).html('').addClass('none');
                }
            });
            // $(obj).attr({
            //     type : 1
            // });
            var percent = data.progress / 100, perimeter = Math.PI * 0.9 * $('#svgDown').width();
            $(obj).find('circle').eq(1).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
            if (data.progress >= 100) {
                $(obj).attr({
                    type : 4
                }).siblings('.down_speed').html('').addClass('none');
            }

            $('.space').html("可用空间" + data.size + "MB<span></span>");
            $(obj).find('.val').text(data.progress);
            break;
        case 'end':
            clearInterval(down_timer);
            clearTimeout(down_setTimeout);
            is_count = false;
            $(obj).attr({
                type : 4
            }).siblings('.down_speed').html('').addClass('none');
            break;
    }
}
var pageName = 'video-menu';
apiready = function() {
    api.addEventListener({
        name: 'flush_cache'
    }, function(ret, err) {
        getChapterTask();
    });
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
    //获取参数
    course_detail = api.pageParam.course_detail; //课程详情
    courseId = course_detail.courseId; //课程id
    //study_progress = api.pageParam.study_progress;//当前的进度
    task_info = api.pageParam.task_info; //任务信息
    from_page = api.pageParam.from_page; //来自哪个win
    /*
    //取出章节层级
    if (isEmpty(study_progress.chapterDeep)) {
        study_progress.chapterDeep = 0;
    }
    if (study_progress.chapterDeep >= 0) {
        var res = course_detail.chapters[study_progress.oneChapterIndex];
        tmpOne = study_progress.oneChapterIndex;
    }
    if (study_progress.chapterDeep >= 1) {
        var res = res.children[study_progress.twoChapterIndex];
        tmpTwo = study_progress.twoChapterIndex;
    }
    if (study_progress.chapterDeep >= 2) {
        var res = res.children[study_progress.threeChapterIndex];
        tmpThree = study_progress.threeChapterIndex;
    }

    taskNum = study_progress.taskIndex;//临时任务索引
    tmpDeep = study_progress.chapterDeep;//章节层级

    chapter_data = res;
    */
   
   
    //1:获取所有下载记录并解析
    getdownrecord();
   
    task_arr = save_tasks(course_detail);

    task_info_detail = task_arr[task_info.taskId];
    //展示本章任务信息
    getChapterTask();


	
    //2:根据couselist获取所有缓存课程的章节详情，如果在线，从服务器获取，否则本地数据库获取
    clearInterval(getStatusTime);
    getStatusTime = setInterval(function(){
       getdownrecord();
       setSpeed();
    },2000)

};
function setSpeed(){
	cache_model.getCurrentDownloadVideoSize({"userId" : getstor('memberId')},function(ret,err){
	
    	var videoId = ret.currentVideoId;
   		var speedT = $api.getStorage("speedT"+videoId) ? $api.getStorage("speedT"+videoId) : 0;
   		$api.setStorage("speedT"+videoId,ret.data);
   		
   		speedTime = ret.data - speedT;	
   		if(speedTime<0){
   			speedTime = 0;
   		}		 
		var down_speed = getFormatSize(speedTime);
       	$('.down-progress[type="1"]').parent().prev().find(".v-name").find("span").eq(1).text(down_speed);
       	$.each($('.down-progress[type="2"]'),function(){
       		$(this).parent().prev().find(".v-name").find("span").eq(1).text("等待中");
       	})
       	$.each($('.down-progress[type="5"]'),function(){
       		$(this).parent().prev().find(".v-name").find("span").eq(1).text("等待中");
       	})
		$.each($('.down-progress[type="4"]'),function(){
       		$(this).parent().prev().find(".v-name").find("span").eq(1).text("完成");
       	})
   })
}
function initDomDownStatus(){
	
    $(".task"+$api.getStorage("currentPlayVideoId")).parents("li").css({"background":"#013f57"});
  
    if(isEmpty($api.getStorage("videochangelist"))){
        $.each($(".down-progress"),function(k,v){
	    	if($(v).attr("id") == $api.getStorage("setchapterId")){
	    		$(v).parents("li").show();
	    	}
	    	
	    })
	    return false;
    }

    var strs = $api.getStorage("videochangelist").split(","); //字符分割
    var pathlen = strs.length;
    //从1开始，因为拼接videochangelist的时候用,开始的
       // alert(strs+"====="+JSON.stringify(videoDownInfo))
    for (j=1; j<pathlen;j++ ){
        var domInfo = videoDownInfo[strs[j]];
        var domid = strs[j];
		
        if(!isEmpty(domInfo)){
            var domprogress = videoDownInfo[strs[j]].progress;
            var domstatus = videoDownInfo[strs[j]].status;
            var domtasknum = videoDownInfo[strs[j]].tasknum;
            // ------------------设置界面对应id节点dom下载状态，并设置为可见--------------------------
            
            if($(".task"+domid).attr("id") == $api.getStorage("setchapterId")){
                $(".task"+domid).parents("li").show();
            }
            $(".task"+domid).attr("type",domstatus);
            $(".task"+domid).find(".val").html(domprogress);
            $(".task"+domid).parent().prev().find(".v-progress").find("span").css("width",domprogress+"%");
//          $(".task"+domid).parent().prev().find(".v-name").find("span").eq(1).text(Math.round(domprogress)+"%");
        } 
    }
    $.each($(".down-progress"),function(k,v){
    	if($(v).attr("id") == $api.getStorage("setchapterId")){
    		$(v).parents("li").show();
    	}
    	
    })
    
   
}

    // tasksCache();

//获取章节列表
function getChapterList() {
    if (is_over_list == false) {
        memberId = getstor('memberId');
        var tpl = $('#tpl').html();
        var content = doT.template(tpl);
        $('#chaList').html(content(course_detail));
        circleProgress();
        //圆形进度条绘制
        var _w = $('#svgDown').width();
        $.each($('.down-progress'), function(k, v) {
            var num = parseInt($(v).find('.val').html());
            if (!isEmpty(num)) {
                var percent = num / 100,
                    perimeter = Math.PI * _w * 0.9;
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
            if (!isEmpty(chapterIdA) && isEmpty(chapterIdB) && isEmpty(chapterIdC)) id = chapterIdA;
            //二级章节下载记录
            if (!isEmpty(chapterIdA) && !isEmpty(chapterIdB) && isEmpty(chapterIdC)) id = chapterIdB;
            //三级章节下载记录
            if (!isEmpty(chapterIdC) && !isEmpty(chapterIdA) && !isEmpty(chapterIdB)) id = chapterIdC;
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
        api.parseTapmode();
        //下载的圈圈样式
        $('.is_noing').css('display', 'none');
        //不是当前章节就隐藏掉
        is_over_list = true;
        //已加载完毕
    }
    $('#chaList').show().siblings().hide();
    //处理圈圈
    isSolidcircle('circle', '', '', courseId, 'video-menu');
}
//getChapterTask();
//获取本章任务
function getChapterTask() {
    if (is_over_task == false) {
        var arr = [];
        for (var i in task_arr) {
            if (task_arr[i].chapterId == task_info_detail.chapterId) {
                arr.push(task_arr[i]['taskInfo']);
            }
        }
        
        var arr = api.pageParam.course_detail;
//      var arr = {
//  "courseName" : "CMA Part I 中文 基础课",
//  "courseId" : "8a22ecb5545a87e801545af5048c0006",
//  "subjectId" : "ff808081486933e601489c799f0f0868",
//  "subjectName" : "CMA 中文 Part-1",
//  "categoryId" : "ff808081486933e601489c4662f60851",
//  "categoryName" : "CMA中文",
//  "chapterNum" : "203",
//  "taskNum" : "258",
//  "taskTotal" : "258",
//  "teacherName" : "QiQi Wu",
//  "teacherImage" : "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//  "teacherHonor" : "吴奇奇",
//  "courseBackgroundImage" : "/upload/201604/f57ba6cd71ae40e8b26309ad758acfff.jpg",
//  "createTime" : 1461814887,
//  "lastModifyTime" : 1461814,
//  "effectiveDay" : 280,
//  "versionId" : "ff808081486933e601489c867448086a",
//  "courseModuleType" : "KNOWLEDGE_MODULE",
//  "subjectIndex" : 50,
//  "categoryIndex" : 10,
//  "courseIndex" : 140,
//  "aim" : "<p>\r\n\t<b>【P1基础课】</b>紧扣CMA最新考试大纲，通过基础课的学习，学员将获得CMA考试所需掌握的各种知识和技能，涵盖考试大纲所列示的所有知识点。课程的设计考虑到知识点的前后衔接与连贯，由浅入深，确保学员能全面理解各种概念的内涵与外延，并在不同的情景中运用相关的概念知识，同时掌握所要求的计算技能，根据历年考试统计数据，P1考试的理论题与计算题出题比例在40：60。\r\n</p>\r\n<p>\r\n\t<br />\r\n</p>\r\n<p class=\"MsoNormal\">\r\n\t参加P1考试的考生应掌握一定的基础知识，包括管理会计基础，财务会计基础和成本会计基础，相关的基础知识已在<b>【</b><b>P1 </b><b>前导课】</b>中进行系统的讲解，基础课中将不再重复这部分内容。<span></span> \r\n</p>\r\n<p>\r\n\t<br />\r\n</p>",
//  "availability" : "CMA Part I 中文 基础课,讲义有更新，更新内容：第2章 第1节 知识点3、第2章 第2节 知识点3、第3章 第1节 知识点2、第3章 第1节 知识点4、第5章 第2节 知识点3<br />\r\n<br />",
//  "outline" : "",
//  "coverPath" : "/upload/201604/f57ba6cd71ae40e8b26309ad758acfff.jpg",
//  "bigCoverPath" : "/upload/201507/32b2575cc3094dde8461f32731ea3058.png",
//  "knowledgePointId" : "ff8080814d6642aa014d69f812880246",
//  "chapters" : [ {
//    "chapterTitle" : "第一章 规划、预算编制与预测",
//    "chapterId" : "8a22ecb5545a87e801545af5b1910007",
//    "knowledgePointId" : "402890814d6f6abb014d6fe6d3340020",
//    "isFree" : "false",
//    "isLeaf" : "false",
//    "tasks" : null,
//    "chapterFiles" : [ {
//      "id" : "f4bd430aa6d9bedf0c3c38007875fe43",
//      "title" : "BOOK 4-2016 FRM Part I_Valuation and Risk Models强化-打印",
//      "url" : "/resCourse/2016/12/26/049CD5AAE2B1416A8BAD98B3ECB29F56.pdf",
//      "type" : "pdf",
//      "size" : "1881473",
//      "updateTime" : 1492158702
//    } ],
//    "chapterExtends" : null,
//    "children" : [ {
//      "chapterTitle" : "前导",
//      "chapterId" : "8a22ecb55b1ec7e9015b3db4351a0554",
//      "knowledgePointId" : "",
//      "isFree" : "false",
//      "isLeaf" : "true",
//      "tasks" : [ {
//        "id" : "8a22ecb5545bfd8801545c4ff07e003c",
//        "taskId" : "8a22ecb55b1ec7e9015b3db51ead0555",
//        "title" : "前导",
//        "taskType" : "video",
//        "taskLevel" : null,
//        "express" : null,
//        "attachmentPath" : "/upload/201702/6e343eb22cba43faa7bc3b37f216aa22.pdf",
//        "videoTime" : 276,
//        "videoSiteId" : "E5DD260925A6084B",
//        "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//        "videoCcid" : "E5A74B901F5675EF9C33DC5901307461"
//      } ],
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : null
//    }, {
//      "chapterTitle" : "第一节：战略和战略规划",
//      "chapterId" : "8a22ecb5545a87e801545af87874000c",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d33c0022",
//      "isFree" : "true",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 战略规划概述",
//        "chapterId" : "8a22ecb55b1ec7e9015b228f54e00031",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac65817840a36",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c50b08e003d",
//          "taskId" : "1674316061a8bb81313bbb8b0ef48340",
//          "title" : "知识点1 战略规划概述",
//          "taskType" : "video",
//          "taskLevel" : "core",
//          "express" : null,
//          "attachmentPath" : "/upload/201702/abe27f2d2294419cb59e3a8fe5ffba17.pdf",
//          "videoTime" : 1414,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A07F06115C5198809C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769e721a001d",
//          "taskId" : "8a22ecb55575d41f015576a3ccae002f",
//          "title" : "知识点1 战略规划概述-测评练习",
//          "taskType" : "exam",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 242,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4E837E723A92A3039C33DC5901307461"
//        }, {
//          "id" : "91e6a108c22e0e440e9f3ad3b106042a",
//          "taskId" : "91e6a108c22e0e440e9f3ad3b106042a",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 波特五因素分析",
//        "chapterId" : "8a22ecb55b1ec7e9015b228f92430032",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac65ca3a60a3a",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c50f209003e",
//          "taskId" : "8a22ecb5545bfd8801545c5db7170057",
//          "title" : "知识点2 波特五因素分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/f8f50918a03e4c4b8feb3791eac5547b.pdf",
//          "videoTime" : 739,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "3A1EF905A522A20A9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769ead6c001e",
//          "taskId" : "8a22ecb55575d41f015576a4245b0030",
//          "title" : "知识点2 波特五因素分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 343,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "AFE866CAA763EC8E9C33DC5901307461"
//        }, {
//          "id" : "bba025cc75a6d6e24698846f80d96c3a",
//          "taskId" : "bba025cc75a6d6e24698846f80d96c3a",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 战略规划工具 SWOT分析",
//        "chapterId" : "8a22ecb55b1ec7e9015b229022bb0033",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac65eed130a3d",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c513444003f",
//          "taskId" : "8a22ecb5545bfd8801545c5e28490058",
//          "title" : "知识点3 战略规划工具--SWOT分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/ff64a72a54ff4fe0b872852c63eed8f5.pdf",
//          "videoTime" : 486,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8A1B1ACF12B2FA7D9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769edefd001f",
//          "taskId" : "8a22ecb55575d41f015576a4b9d40031",
//          "title" : "知识点3 战略规划工具--SWOT分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 196,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BA13C5E22BB7D8929C33DC5901307461"
//        }, {
//          "id" : "8cb01db8198833c835b40dd748d9b06e",
//          "taskId" : "8cb01db8198833c835b40dd748d9b06e",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 战略规划工具 5C和PEST分析",
//        "chapterId" : "8a22ecb55b1ec7e9015b22906ce30034",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac66012640a40",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c516f540040",
//          "taskId" : "8a22ecb5545bfd8801545c5e983e0059",
//          "title" : "知识点4 战略规划工具--5C分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/db9879dce493413e9b7769b56ff01f61.pdf",
//          "videoTime" : 326,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A197A90D2320247D9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769f14e10020",
//          "taskId" : "8a22ecb55575d41f015576a5332c0032",
//          "title" : "知识点4 战略规划工具--5C分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 45,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B431CE53DB20041C9C33DC5901307461"
//        }, {
//          "id" : "9ba4922703b12f7fadc4938eb6b3d539",
//          "taskId" : "9ba4922703b12f7fadc4938eb6b3d539",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点5 战略规划工具 波士顿矩阵",
//        "chapterId" : "8a22ecb55b1ec7e9015b2290bf6e0035",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac66153390a4a",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c51c2ae0041",
//          "taskId" : "8a22ecb5545bfd8801545c5f1d65005a",
//          "title" : "知识点5 战略规划工具--波士顿矩阵",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/4a28021f32154d21b0d2ed4b3fea84a7.pdf",
//          "videoTime" : 756,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7EC1FAE7CC03E3C79C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769f4db60021",
//          "taskId" : "8a22ecb55575d41f015576a5a1700033",
//          "title" : "知识点5 战略规划工具--波士顿矩阵-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 249,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "0ADA4C72F3DAA1559C33DC5901307461"
//        }, {
//          "id" : "3b4b7a59897c5711aaa5de62db17c64a",
//          "taskId" : "3b4b7a59897c5711aaa5de62db17c64a",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点6 战略规划工具 其他分析工具 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b2290fffa0036",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac66210c30a4d",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c5203f10042",
//          "taskId" : "8a22ecb5545bfd8801545c5fd554005b",
//          "title" : "知识点6 战略规划工具--其他分析工具",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/07f8467e40e146c880f98acc031bc7a1.pdf",
//          "videoTime" : 340,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D506AE69E738E8349C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769f83b70022",
//          "taskId" : "8a22ecb55575d41f015576a606f20034",
//          "title" : "知识点6 战略规划工具--其他分析工具-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 61,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9095AC39188AEFDC9C33DC5901307461"
//        }, {
//          "id" : "beeff628e816915de50579dbb3611012",
//          "taskId" : "beeff628e816915de50579dbb3611012",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第二节：预算编制的相关概念",
//      "chapterId" : "8a22ecb5545a87e801545af8be19000d",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d36c002e",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 预算编制的相关概念（上）",
//        "chapterId" : "8a22ecb55b1ec7e9015b22be71600037",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6649f6e0a50",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c5246b10043",
//          "taskId" : "8a22ecb5545bfd8801545c604da0005c",
//          "title" : "知识点1 预算编制的相关概念（上）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/d27f64f116694094abcb18325f2e2ed7.pdf",
//          "videoTime" : 1378,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "DDD536FB4BA6010B9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769fb3ad0023",
//          "taskId" : "8a22ecb55575d41f015576a67af60035",
//          "title" : "知识点1 预算编制的相关概念（上）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 115,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "41627E99924978E49C33DC5901307461"
//        }, {
//          "id" : "e38fafe496246c575baf07f551aface5",
//          "taskId" : "e38fafe496246c575baf07f551aface5",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 预算编制的相关概念（下）",
//        "chapterId" : "8a22ecb55b1ec7e9015b22becb870038",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac665f6410a53",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c52a9ff0044",
//          "taskId" : "8a22ecb5545bfd8801545c61b7e8005d",
//          "title" : "知识点2 预算编制的相关概念（下）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/28ba2733771d4e77baa6cccadb3dd45d.pdf",
//          "videoTime" : 1148,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B14B2C0D3506A9099C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f0155769fe7960024",
//          "taskId" : "8a22ecb55575d41f015576a6dece0036",
//          "title" : "知识点2 预算编制的相关概念（下）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 264,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "22CDAEED26A7DF649C33DC5901307461"
//        }, {
//          "id" : "ba38ee8d9fcbbfa1c9a424e1f9deeda0",
//          "taskId" : "ba38ee8d9fcbbfa1c9a424e1f9deeda0",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第三节：预测技术",
//      "chapterId" : "8a22ecb5545a87e801545af9092e000e",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d3990038",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 回归分析",
//        "chapterId" : "8a22ecb55b1ec7e9015b22bf33190039",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac66792400a5a",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c52e62e0045",
//          "taskId" : "8a22ecb5545bfd8801545c623ed4005e",
//          "title" : "知识点1 回归分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/bd01f2bde9f54733920db6a65e074941.pdf",
//          "videoTime" : 958,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8DFD1A6CCF2048289C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a01f2d0025",
//          "taskId" : "8a22ecb55575d41f015576a75b8a0037",
//          "title" : "知识点1 回归分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 191,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "784FE721A5A2F55F9C33DC5901307461"
//        }, {
//          "id" : "1e989e6605a48528311d47e7bb4cb2e1",
//          "taskId" : "1e989e6605a48528311d47e7bb4cb2e1",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 学习曲线 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22bf9bac003a",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac669de920a5d",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c5329360046",
//          "taskId" : "8a22ecb5545bfd8801545c628708005f",
//          "title" : "知识点2 学习曲线",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/6bc79ece25b0443a87ca2d3e8db4f547.pdf",
//          "videoTime" : 789,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "79F0A815CC6339709C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a059380026",
//          "taskId" : "8a22ecb55575d41f015576a7ceb10038",
//          "title" : "知识点2 学习曲线-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 412,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2CF3EEDB9BD349139C33DC5901307461"
//        }, {
//          "id" : "9c38e9f9eab219b795d9b6ff7d735b5c",
//          "taskId" : "9c38e9f9eab219b795d9b6ff7d735b5c",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 期望值分析 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c0243e003b",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac66be2250a60",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c5364350047",
//          "taskId" : "8a22ecb5545bfd8801545c6316350060",
//          "title" : "知识点3 期望值分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/d1dd75ff0c3b48b9b05180e991e07a77.pdf",
//          "videoTime" : 306,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "DFEC648B37DCAEEB9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a08ae90027",
//          "taskId" : "8a22ecb55575d41f015576a8210f0039",
//          "title" : "知识点3 期望值分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 336,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5EF1FF86109C4C3F9C33DC5901307461"
//        }, {
//          "id" : "db1459eec97c3e065dbc692da112a067",
//          "taskId" : "db1459eec97c3e065dbc692da112a067",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第四节：预算编制方法",
//      "chapterId" : "8a22ecb5545a87e801545af95040000f",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d3be0040",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 总预算、项目预算、ABB",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c0bb7a003c",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac66e24f20a63",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c539ef30048",
//          "taskId" : "8a22ecb5545bfd8801545c636a880061",
//          "title" : "知识点1 总预算、项目预算、ABB",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/473e7d0f9fe744d6b651e1c0f1b49540.pdf",
//          "videoTime" : 892,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "FCAF5F21603F331F9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a0c0d60028",
//          "taskId" : "8a22ecb55575d41f015576a8a412003a",
//          "title" : "知识点1 总预算、项目预算、ABB-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 68,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D84869B142ECA0E19C33DC5901307461"
//        }, {
//          "id" : "640218f60a28e749bcc07372eda20719",
//          "taskId" : "640218f60a28e749bcc07372eda20719",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 增量、ZBB、滚动、弹性",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c134eb003d",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac67099ce0a66",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c53e2040049",
//          "taskId" : "8a22ecb5545bfd8801545c63bb1e0062",
//          "title" : "知识点2 增量、ZBB、滚动、弹性",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/e73465a5b61545f790e2395d05cd191d.pdf",
//          "videoTime" : 1353,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "78E79F8850869CCC9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a0f8b70029",
//          "taskId" : "8a22ecb55575d41f015576a8f470003b",
//          "title" : "知识点2 增量、ZBB、滚动、弹性-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 177,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8947B5B6CCB3ECC89C33DC5901307461"
//        }, {
//          "id" : "42285aa1b06f71ae1f6758223de084b0",
//          "taskId" : "42285aa1b06f71ae1f6758223de084b0",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第五节：年度利润计划与相关报表",
//      "chapterId" : "8a22ecb5545a87e801545b4daaab0010",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d3fd004e",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 营运预算--销售&生产预算",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c1c70f003e",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac672d79f0a69",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c541fd8004a",
//          "taskId" : "8a22ecb5545bfd8801545c641cab0063",
//          "title" : "知识点1 营运预算--销售&生产预算",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/b76b57dc57c540649df32aa027a93fe2.pdf",
//          "videoTime" : 758,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "3B8A6EC936DD3A579C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a12daf002a",
//          "taskId" : "8a22ecb55575d41f015576a9d7d4003c",
//          "title" : "知识点1 营运预算--销售&生产预算-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 353,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "19C97AAC843DC5D89C33DC5901307461"
//        }, {
//          "id" : "58f2caef46af561c085beea95ddc14d4",
//          "taskId" : "58f2caef46af561c085beea95ddc14d4",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 营运预算--生产成本&销货成本预算",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c2f362003f",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac673cd330a6c",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c545e20004b",
//          "taskId" : "8a22ecb5545bfd8801545c645c810064",
//          "title" : "知识点2 营运预算--生产成本&销货成本预算",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/5f62f9c81a8b42a0bf5ad7861be2fc4c.pdf",
//          "videoTime" : 1158,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B1ECC65965B34A439C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a1675f002b",
//          "taskId" : "8a22ecb55575d41f015576aa2425003d",
//          "title" : "知识点2 营运预算--生产成本&销货成本预算 -测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 590,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1CFEB343BAB9129A9C33DC5901307461"
//        }, {
//          "id" : "c09f5e3c007b148a32ed36d4dd5603f4",
//          "taskId" : "c09f5e3c007b148a32ed36d4dd5603f4",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 营运预算--销管费用预算&模拟利润表",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c3820b0040",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac674f6f40a6f",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c549a6d004c",
//          "taskId" : "8a22ecb5545bfd8801545c66a4760065",
//          "title" : "知识点3 营运预算--销管费用预算&模拟利润表",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/fb0e5075f0dd4335b1b1fdfe0d08b06e.pdf",
//          "videoTime" : 379,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2C050B5581F7A62F9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a19d56002c",
//          "taskId" : "8a22ecb55575d41f015576aa78d0003e",
//          "title" : "知识点3 营运预算--销管费用预算&模拟利润表-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 251,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "ABE0D1AEB59F0AD89C33DC5901307461"
//        }, {
//          "id" : "6756a2554aea12ab2cccdd23f023d928",
//          "taskId" : "6756a2554aea12ab2cccdd23f023d928",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 财务预算",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c3f89b0041",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac675ea2f0a72",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c561fee004d",
//          "taskId" : "8a22ecb5545bfd8801545c66eabb0066",
//          "title" : "知识点4 财务预算",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/ed9e270ceec042208b501ad788352071.pdf",
//          "videoTime" : 966,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2860685F76ADF3B49C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a1d0ed002d",
//          "taskId" : "8a22ecb55575d41f015576aae1ac003f",
//          "title" : "知识点4 财务预算-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 160,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6D0A185B8442FCBC9C33DC5901307461"
//        }, {
//          "id" : "60787eabf9f6f39563a4c740db70d482",
//          "taskId" : "60787eabf9f6f39563a4c740db70d482",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第六节：简易规划与分析技术",
//      "chapterId" : "8a22ecb5545a87e801545b4eab670011",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d4260056",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 销售百分比法&敏感性分析",
//        "chapterId" : "8a22ecb55b1ec7e9015b22c5bab70042",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac67736ad0a75",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5545bfd8801545c566a20004e",
//          "taskId" : "8a22ecb5545bfd8801545c6742590067",
//          "title" : "知识点1 销售百分比法&敏感性分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/4af1ae803d1f40d59ce7d30596a22c8c.pdf",
//          "videoTime" : 808,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5038002611739AD49C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55575d41f015576a207f1002e",
//          "taskId" : "8a22ecb55575d41f015576ab5a7e0040",
//          "title" : "知识点1 销售百分比法&敏感性分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 103,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1D961475E58885CB9C33DC5901307461"
//        }, {
//          "id" : "2f62c81cac99da487c9c7e1b8f1b8d18",
//          "taskId" : "2f62c81cac99da487c9c7e1b8f1b8d18",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    } ]
//  }, {
//    "chapterTitle" : "第二章 成本管理",
//    "chapterId" : "8a22ecb5545a87e801545af60de70008",
//    "knowledgePointId" : "402890814d6f6abb014d6fe6d4f40086",
//    "isFree" : "false",
//    "isLeaf" : "false",
//    "tasks" : null,
//    "chapterFiles" : null,
//    "chapterExtends" : null,
//    "children" : [ {
//      "chapterTitle" : "前导",
//      "chapterId" : "8a22ecb5545bfd8801545c5ab6eb0050",
//      "knowledgePointId" : null,
//      "isFree" : "false",
//      "isLeaf" : "true",
//      "tasks" : [ {
//        "id" : "8a22ecb5557730db01557cb31f480063",
//        "taskId" : "8a22ecb5557730db01557cbc5ff3007a",
//        "title" : "前导",
//        "taskType" : "video",
//        "taskLevel" : null,
//        "express" : null,
//        "attachmentPath" : "/upload/201703/6587cfdb64364c92b4f867178d2a769e.pdf",
//        "videoTime" : 192,
//        "videoSiteId" : "E5DD260925A6084B",
//        "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//        "videoCcid" : "E83E3095F40D34159C33DC5901307461"
//      } ],
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : null
//    }, {
//      "chapterTitle" : "第一节：成本度量概念",
//      "chapterId" : "8a22ecb5545a87e801545b4f77330012",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d33c0022",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 成本行为与成本对象 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22cc730c0043",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6796e290a7b",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cde43030091",
//          "taskId" : "8a22ecb5557730db01557ce0bb80009a",
//          "title" : "知识点1 成本行为与成本对象",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/c2a88bbdb2394ac1a5eab980b63718d7.pdf",
//          "videoTime" : 1712,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "F875134C85FF2E489C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cde7bc90092",
//          "taskId" : "8a22ecb5557730db01557ce185f1009b",
//          "title" : "知识点1 成本行为与成本对象-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 276,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "C528AD7CFF4499CD9C33DC5901307461"
//        }, {
//          "id" : "f5dc3fd17219d8435e70e05850c7b1ed",
//          "taskId" : "f5dc3fd17219d8435e70e05850c7b1ed",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 实际、正常、标准成本法",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ccdcfa0044",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac67b260e0a7e",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cdeb36b0093",
//          "taskId" : "8a22ecb5557730db01557ce1e17e009c",
//          "title" : "知识点2 实际、正常、标准成本法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/d17a9da473e549e8ab783791a35838bc.pdf",
//          "videoTime" : 1194,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5284646E8417C91A9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cdee9fe0094",
//          "taskId" : "8a22ecb5557730db01557ce235ef009d",
//          "title" : "知识点2 实际、正常、标准成本法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 288,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "0BB7CA0652BD53689C33DC5901307461"
//        }, {
//          "id" : "e0fe5bc9f0c4d389e7d812437515be4d",
//          "taskId" : "e0fe5bc9f0c4d389e7d812437515be4d",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 吸收成本法与变动成本法",
//        "chapterId" : "8a22ecb55b1ec7e9015b22cd47470045",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac67d57af0a88",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cdf27aa0095",
//          "taskId" : "8a22ecb5557730db01557ce27af4009e",
//          "title" : "知识点3 吸收成本法与变动成本法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201703/835b94cfa30a4a4593be99cfd2e79d06.pdf",
//          "videoTime" : 1712,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5CBFF1346101E7E99C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cdf65580096",
//          "taskId" : "8a22ecb5557730db01557ce2d267009f",
//          "title" : "知识点3 吸收成本法与变动成本法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 277,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4BB6B50877E467739C33DC5901307461"
//        }, {
//          "id" : "f8be0a2871517d48c7819d2089815bf5",
//          "taskId" : "f8be0a2871517d48c7819d2089815bf5",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 联产品和副产品 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22cda0410046",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac68099540a98",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cdf9acb0097",
//          "taskId" : "8a22ecb5557730db01557ce332b300a0",
//          "title" : "知识点4 联产品和副产品",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/4e7421ded8714ed68877b281ce4a8c31.pdf",
//          "videoTime" : 593,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "64700899BB1FF6F49C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cdfd9fc0098",
//          "taskId" : "8a22ecb5557730db01557ce3803f00a1",
//          "title" : "知识点4 联产品和副产品-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 79,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BBA74B4E3FBA5BE19C33DC5901307461"
//        }, {
//          "id" : "6d02e8de259b5191833ee886befc645d",
//          "taskId" : "6d02e8de259b5191833ee886befc645d",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点5 分配联合成本 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ce5ff10047",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac685a7630aa0",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cf1312300a4",
//          "taskId" : "8a22ecb5557730db01557cfe44d300a7",
//          "title" : "知识点5 分配联合成本",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/bac6f082e6c44fcca2e1d13450ef3eb3.pdf",
//          "videoTime" : 761,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "DB752C77ADED74299C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557ce00fea0099",
//          "taskId" : "8a22ecb5557730db01557ce3e27c00a2",
//          "title" : "知识点5 分配联合成本-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 324,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8B400474F5436C119C33DC5901307461"
//        }, {
//          "id" : "0d0969e267f0874954804f44ea76e31c",
//          "taskId" : "0d0969e267f0874954804f44ea76e31c",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第二节：成本制度",
//      "chapterId" : "8a22ecb5545a87e801545b4fd7f00013",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d5420096",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 分批成本法",
//        "chapterId" : "8a22ecb55b1ec7e9015b22cedb740048",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac686c6200aa4",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb56b9c0064",
//          "taskId" : "8a22ecb5557730db01557cc01142007b",
//          "title" : "知识点1 分批成本法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/730ec723b0d241509ddde432034fa5cb.pdf",
//          "videoTime" : 1162,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8AA6E43AE35071CB9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb5b2210065",
//          "taskId" : "8a22ecb5557730db01557cc090c3007c",
//          "title" : "知识点1 分批成本法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 421,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "80D4835412D070F79C33DC5901307461"
//        }, {
//          "id" : "07176b4d66e79531f069b829af517267",
//          "taskId" : "07176b4d66e79531f069b829af517267",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 分批成本法下的损耗、返工、废料处理",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d00f980049",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac689c5e00aa9",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb5e77a0066",
//          "taskId" : "8a22ecb5557730db01557cc10e62007d",
//          "title" : "知识点2 分批成本法下的损耗、返工、废料处理",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201611/575ae2b2465b4848b317585676f62348.pdf",
//          "videoTime" : 811,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "745181E9F9B480A79C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb623fc0067",
//          "taskId" : "8a22ecb5557730db01557cc17035007e",
//          "title" : "知识点2 分批成本法下的损耗、返工、废料处理-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 157,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "087C142F57D9209B9C33DC5901307461"
//        }, {
//          "id" : "f9afef047f7b40a95bc74d2e1bee7341",
//          "taskId" : "f9afef047f7b40a95bc74d2e1bee7341",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 分步成本法-加权平均",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d1a0f3004a",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac68ade1e0aae",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb683500068",
//          "taskId" : "8a22ecb5557730db01557ccc8225007f",
//          "title" : "知识点3 分步成本法-加权平均法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201703/555b902b919f4bf08339c6754cd19a58.pdf",
//          "videoTime" : 1317,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7836023F495B4D0C9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb6b9e10069",
//          "taskId" : "8a22ecb5557730db01557cccef7a0080",
//          "title" : "知识点3 分步成本法-加权平均法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 450,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "C9C1240FAB76B5A99C33DC5901307461"
//        }, {
//          "id" : "4c450e8a6c45ff6ae82961aff2a727cc",
//          "taskId" : "4c450e8a6c45ff6ae82961aff2a727cc",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 分步成本法-先进先出",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d1f195004b",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac68fe94d0ab3",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb6ee32006a",
//          "taskId" : "8a22ecb5557730db01557ccd46230081",
//          "title" : "知识点4 分步成本法-先进先出法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/55ba1c9a48114c739e1ab6bd1c51b2b5.pdf",
//          "videoTime" : 540,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "F9FC52EBA9F68A959C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb72acd006b",
//          "taskId" : "8a22ecb5557730db01557ccd942d0082",
//          "title" : "知识点4 分步成本法-先进先出法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 293,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "392A189D2E32EB039C33DC5901307461"
//        }, {
//          "id" : "41ce59b8f5d413073546c5ba99315d41",
//          "taskId" : "41ce59b8f5d413073546c5ba99315d41",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点5 作业成本法",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d44c0d004c",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac69b67bb0ab7",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb55596009801559a4b24f90014",
//          "taskId" : "8a22ecb55596009801559a50f45c0015",
//          "title" : "知识点5 作业成本法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/8e164554dac744e1bb98bb7e9b9100a8.pdf",
//          "videoTime" : 1685,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A29C94399A926F189C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55596009801559a4ad6e90013",
//          "taskId" : "8a22ecb55596009801559a513e570016",
//          "title" : "知识点5 作业成本法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 346,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "DECC3BC200AB365D9C33DC5901307461"
//        }, {
//          "id" : "d89c6e06aab52b03606e14da0e62ce78",
//          "taskId" : "d89c6e06aab52b03606e14da0e62ce78",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点6 生命周期成本法 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d4d8a5004d",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac69c5db70aba",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb55596009801559a4a96670012",
//          "taskId" : "8a22ecb55596009801559a52a7070017",
//          "title" : "知识点6 生命周期成本法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/eedd467581e34b9ea22bef2b051f165d.pdf",
//          "videoTime" : 571,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B1C362896D62AFC59C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55596009801559a4a400c0011",
//          "taskId" : "8a22ecb55596009801559a5309950018",
//          "title" : "知识点6 生命周期成本法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 94,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1D3391F724A89E3B9C33DC5901307461"
//        }, {
//          "id" : "b93430f5293c0c903731507e6253c67b",
//          "taskId" : "b93430f5293c0c903731507e6253c67b",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点7 营运成本法和后推成本法",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d5258d004e",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac69d06740abd",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb55596009801559a49ff8a0010",
//          "taskId" : "8a22ecb55596009801559a535de40019",
//          "title" : "知识点7 营运成本法和后推成本法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/a94cfbbef7134f4fb37ca7e258678a71.pdf",
//          "videoTime" : 767,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "908EE300CB885D689C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55596009801559a49c129000f",
//          "taskId" : "8a22ecb55596009801559a53c13d001a",
//          "title" : "知识点7 营运成本法和后推成本法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 49,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "23E02BF59E299D5A9C33DC5901307461"
//        }, {
//          "id" : "2dcbfbb9c56e8b74d55e72b48af7b827",
//          "taskId" : "2dcbfbb9c56e8b74d55e72b48af7b827",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第三节：间接成本",
//      "chapterId" : "8a22ecb5545a87e801545b51fb750014",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d56700a0",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 固定和变动间接成本 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d62451004f",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac69db6820ac0",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb7604a006c",
//          "taskId" : "8a22ecb5557730db01557cd66fe50083",
//          "title" : "知识点1 固定和变动间接成本",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/8c611436ed434cc085095101a0e0ad9c.pdf",
//          "videoTime" : 593,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BE493D201F39F31D9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb7b4a2006d",
//          "taskId" : "8a22ecb5557730db01557cd6c0ee0084",
//          "title" : "知识点1 固定和变动间接成本-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 179,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "03DA7FEA039161AD9C33DC5901307461"
//        }, {
//          "id" : "82bb7a91e63ad189e7a78d933a655770",
//          "taskId" : "82bb7a91e63ad189e7a78d933a655770",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 间接成本分摊方法",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d69f650050",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac69e6e060ac4",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb80129006e",
//          "taskId" : "8a22ecb5557730db01557cd749d00085",
//          "title" : "知识点2 间接成本分摊方法",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/6d354438714f4694bc9e7f06ecf71027.pdf",
//          "videoTime" : 634,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2DD076B87CD4CE1A9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb83cc1006f",
//          "taskId" : "8a22ecb5557730db01557cd7a4c70086",
//          "title" : "知识点2 间接成本分摊方法-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 248,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7554BA53F15734809C33DC5901307461"
//        }, {
//          "id" : "73887f979ffdfab3c7e98ed6c91c89f5",
//          "taskId" : "73887f979ffdfab3c7e98ed6c91c89f5",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 服务部门成本的分配",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d724850051",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac69f7bc60ac8",
//        "isFree" : "true",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb86f5f0070",
//          "taskId" : "8a22ecb5557730db01557cd851a90087",
//          "title" : "知识点3 服务部门成本的分配",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/2bab524a84144a06b20a02b7beaa40dc.pdf",
//          "videoTime" : 1098,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5594042632C857C39C33DC5901307461"
//        }, {
//          "id" : "8a22ecb55902cff6015981f9320e0526",
//          "taskId" : "8a22ecb5557730db01557cd97c5b0088",
//          "title" : "知识点3 服务部门成本的分配-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 297,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "C97848449517A8ED9C33DC5901307461"
//        }, {
//          "id" : "726356b1c3fe2b3d88e97cce5450e508",
//          "taskId" : "726356b1c3fe2b3d88e97cce5450e508",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第四节：供应链管理",
//      "chapterId" : "8a22ecb5545a87e801545b52b54a0015",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d58d00aa",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 供应链管理和及时生产（JIT）",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d7def80052",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6a0a6be0acd",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb8e33f0072",
//          "taskId" : "8a22ecb5557730db01557cda86c00089",
//          "title" : "知识点1 供应链管理和及时生产（JIT)",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/abea2adac2c84f61a3cf9e45b048d792.pdf",
//          "videoTime" : 1553,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2435B67FF762F8659C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cb91d270073",
//          "taskId" : "8a22ecb5557730db01557cdaf265008a",
//          "title" : "知识点1 供应链管理和及时生产（JIT)-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 227,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2B0FDB3CAC1EFFB29C33DC5901307461"
//        }, {
//          "id" : "1c8e0761ca669fc9846dffe2c78ec13b",
//          "taskId" : "1c8e0761ca669fc9846dffe2c78ec13b",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 物料需求计划、企业资源计划",
//        "chapterId" : "8a22ecb55b1ec7e9015b22d9c5690056",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6a24e600ad0",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cb95e940074",
//          "taskId" : "8a22ecb5557730db01557cdb4303008b",
//          "title" : "知识点2 物料需求计划（MRP)和企业资源计划（ERP)",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/5ae691f3cf774e88a0e6ae0fc0038ae9.pdf",
//          "videoTime" : 1057,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5B6CBD1B4DDCC5D99C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cba46b20075",
//          "taskId" : "8a22ecb5557730db01557cdba484008c",
//          "title" : "知识点2 物料需求计划（MRP)和企业资源计划（ERP)-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 212,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "04ECB6A96AF303E99C33DC5901307461"
//        }, {
//          "id" : "127c984fffda55da5576cd3feaa51f7a",
//          "taskId" : "127c984fffda55da5576cd3feaa51f7a",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 约束理论",
//        "chapterId" : "8a22ecb55b1ec7e9015b22da6f2f0059",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6a2be910ad3",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cfd55cc00a6",
//          "taskId" : "8a22ecb5557730db01557cff768300a8",
//          "title" : "知识点3 约束理论（TOC)",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/82b0402f57224387ae453a2e5eb529ef.pdf",
//          "videoTime" : 1314,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "39B8D6BEE0704C9C9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cba94690076",
//          "taskId" : "8a22ecb5557730db01557cdbfd4e008d",
//          "title" : "知识点3 约束理论（TOC)-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 148,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "48AC72DC3819AA919C33DC5901307461"
//        }, {
//          "id" : "200b1eaccd0e0983ec7c093d58f51e6f",
//          "taskId" : "200b1eaccd0e0983ec7c093d58f51e6f",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第五节：业务流程改进",
//      "chapterId" : "8a22ecb5545a87e801545b535fe40016",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d5b200b4",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 价值链分析&外包 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22db0aa8005b",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6a358740ad6",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cf327c600a5",
//          "taskId" : "8a22ecb5557730db01557cffccaf00a9",
//          "title" : "知识点1 价值链分析和外包",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/4f70f61c314f4ab9a95cbfe2a8309e15.pdf",
//          "videoTime" : 996,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A8F82E68EED084C39C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cbacef50077",
//          "taskId" : "8a22ecb5557730db01557cdc63ca008e",
//          "title" : "知识点1 价值链分析和外包-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 196,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4DC64CD9F6E98BF39C33DC5901307461"
//        }, {
//          "id" : "705b719adf782b36188f55ff18edcca7",
//          "taskId" : "705b719adf782b36188f55ff18edcca7",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 业务流程绩效分析技术",
//        "chapterId" : "8a22ecb55b1ec7e9015b22db9c55005d",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6a3d5810ad9",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5557730db01557cbb108e0078",
//          "taskId" : "8a22ecb5557730db01557cdcccc0008f",
//          "title" : "知识点2 业务流程绩效分析技术",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/f36903a62c354db18130cc52512190ab.pdf",
//          "videoTime" : 1343,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "564A2B61608E27F59C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5557730db01557cbb43110079",
//          "taskId" : "8a22ecb5557730db01557cdd1c960090",
//          "title" : "知识点2 业务流程绩效分析技术-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 141,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D89A6ACDE6D3CF7A9C33DC5901307461"
//        }, {
//          "id" : "1032383ec6313a159cdf217eb23e3c4d",
//          "taskId" : "1032383ec6313a159cdf217eb23e3c4d",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    } ]
//  }, {
//    "chapterTitle" : "第三章 绩效管理",
//    "chapterId" : "8a22ecb5545a87e801545af767290009",
//    "knowledgePointId" : "402890814d6f6abb014d6fe6d44f005e",
//    "isFree" : "false",
//    "isLeaf" : "false",
//    "tasks" : null,
//    "chapterFiles" : null,
//    "chapterExtends" : null,
//    "children" : [ {
//      "chapterTitle" : "前导",
//      "chapterId" : "8a22ecb5545bfd8801545c5af2d30051",
//      "knowledgePointId" : null,
//      "isFree" : "false",
//      "isLeaf" : "true",
//      "tasks" : [ {
//        "id" : "8a22ecb5560c52c901562152fb380016",
//        "taskId" : "8a22ecb5560c52c901562189f80e0031",
//        "title" : "前导",
//        "taskType" : "video",
//        "taskLevel" : null,
//        "express" : null,
//        "attachmentPath" : "/upload/201703/82774bc97c7d40619ed5aad6f52ad22c.pdf",
//        "videoTime" : 235,
//        "videoSiteId" : "E5DD260925A6084B",
//        "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//        "videoCcid" : "DC80EEA5B1375ED99C33DC5901307461"
//      } ],
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : null
//    }, {
//      "chapterTitle" : "第一节：成本量度和差异量度",
//      "chapterId" : "8a22ecb5545a87e801545b54eb210017",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d4580060",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 静态&弹性预算",
//        "chapterId" : "8a22ecb55b1ec7e9015b22dd78460062",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6a94c0a0adc",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c9015621538a6d0018",
//          "taskId" : "8a22ecb5560c52c90156218a6ed70032",
//          "title" : "知识点1 静态&弹性预算",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/fc82e0fa1eb445b6870759db57670d6b.pdf",
//          "videoTime" : 1728,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A1B5E66116F620B39C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215347d90017",
//          "taskId" : "8a22ecb5560c52c90156218ab79d0033",
//          "title" : "知识点1 静态&弹性预算-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 480,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1B118437474BF75C9C33DC5901307461"
//        }, {
//          "id" : "171e0841a7b351cb310f27e3c4d4475b",
//          "taskId" : "171e0841a7b351cb310f27e3c4d4475b",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 直接成本的价格&效率差异",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ddd0b90063",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6aa28260ae0",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c9015621541326001a",
//          "taskId" : "8a22ecb5560c52c90156218b11270034",
//          "title" : "知识点2 直接成本的价格&效率差异",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201703/ed648291dbe6403c934719f1556aa099.pdf",
//          "videoTime" : 1510,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "FAD99E93BB8053529C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c901562153db3b0019",
//          "taskId" : "8a22ecb5560c52c90156218b4b070035",
//          "title" : "知识点2 直接成本的价格&效率差异-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 662,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "89CFF4DD1F3FB3419C33DC5901307461"
//        }, {
//          "id" : "3e2b295d9522dd0804293df580302c0f",
//          "taskId" : "3e2b295d9522dd0804293df580302c0f",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 直接成本的混合&产量差异",
//        "chapterId" : "8a22ecb55b1ec7e9015b22de27c90066",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ab0e7c0ae4",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c901562154a8e2001c",
//          "taskId" : "8a22ecb5560c52c90156218b9a090036",
//          "title" : "知识点3 直接成本的混合&产量差异",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/91bb14c884634e8fa101a4fd4f6d4f68.pdf",
//          "videoTime" : 840,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7C4600C5635FFE199C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c9015621545a8a001b",
//          "taskId" : "8a22ecb5560c52c90156218be40b0037",
//          "title" : "知识点3  直接成本的混合&产量差异-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 535,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "51A6A0D81577F3729C33DC5901307461"
//        }, {
//          "id" : "56142997a411c324d1ad90e72ec72b37",
//          "taskId" : "56142997a411c324d1ad90e72ec72b37",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 变动间接费用差异",
//        "chapterId" : "8a22ecb55b1ec7e9015b22de6bf70067",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6abc7670ae9",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c9015621554c42001e",
//          "taskId" : "8a22ecb5560c52c90156218c37a00038",
//          "title" : "知识点4 变动间接费用差异",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201703/43960389871a45cd9b43ef7ffc947971.pdf",
//          "videoTime" : 734,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "21C5141CE5AEAC669C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c9015621550c3c001d",
//          "taskId" : "8a22ecb5560c52c90156218c704e0039",
//          "title" : "知识点4 变动间接费用差异-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 609,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "30CB3549DDEEFCF19C33DC5901307461"
//        }, {
//          "id" : "724e2e7610e1dc2232976049e4a278c5",
//          "taskId" : "724e2e7610e1dc2232976049e4a278c5",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点5 固定间接费用差异",
//        "chapterId" : "8a22ecb55b1ec7e9015b22deaec50069",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ad58d50aed",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c901562157df440020",
//          "taskId" : "8a22ecb5560c52c90156218d4150003a",
//          "title" : "知识点5 固定间接费用差异",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/0befcb2b1ecd4e7094b4906554eec706.pdf",
//          "videoTime" : 627,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1B7E19563BEEC9399C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c9015621559e0b001f",
//          "taskId" : "8a22ecb5560c52c90156218d7b47003b",
//          "title" : "知识点5 固定间接费用差异-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 438,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "C4E1F4A7806FD5689C33DC5901307461"
//        }, {
//          "id" : "5758d9e6b0686c1c1f84b95c5e71ee3f",
//          "taskId" : "5758d9e6b0686c1c1f84b95c5e71ee3f",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点6 销售差异",
//        "chapterId" : "8a22ecb55b1ec7e9015b22deff9b006b",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6adce020af0",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c901562159ecb10022",
//          "taskId" : "8a22ecb5560c52c90156218dd90d003c",
//          "title" : "知识点6 销售差异",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/462ce042c9564b5e9be38383644ed382.pdf",
//          "videoTime" : 912,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "53A9FA95C7EAEC5A9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c9015621599f930021",
//          "taskId" : "8a22ecb5560c52c90156218e0fe1003d",
//          "title" : "知识点6 销售差异-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 584,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7D462EFABF051B7F9C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第二节：责任中心和报告分部",
//      "chapterId" : "8a22ecb5545a87e801545b5570ae0018",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d492006c",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 责任中心的类型 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e03758006e",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6af1fd90af3",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215ac2560024",
//          "taskId" : "8a22ecb5560c52c90156218e7657003e",
//          "title" : "知识点1 责任中心的类型",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/5d5c77869cfe427b912d5e0d6671fd25.pdf",
//          "videoTime" : 901,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "FA59820139C4A6E29C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215a26050023",
//          "taskId" : "8a22ecb5560c52c90156218eb831003f",
//          "title" : "知识点1 责任中心的类型-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 394,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "C91A17BACA66EA829C33DC5901307461"
//        }, {
//          "id" : "9f6e82df90e4a757e8d7d561cd3f5484",
//          "taskId" : "9f6e82df90e4a757e8d7d561cd3f5484",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 贡献报告和分部报告 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e09f520070",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6b055930af6",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215b6cfa0026",
//          "taskId" : "8a22ecb5560c52c90156218f0a930040",
//          "title" : "知识点2 贡献报告和分部报告",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/08eee4483f5f495ca871bf51730504d9.pdf",
//          "videoTime" : 1490,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A81F942C7073B7439C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215b0f1a0025",
//          "taskId" : "8a22ecb5560c52c90156218f46250041",
//          "title" : "知识点2 贡献报告和分部报告-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 533,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7F535DF2050A2CC99C33DC5901307461"
//        }, {
//          "id" : "706a76d7547f20f75f1821afe9e585b7",
//          "taskId" : "706a76d7547f20f75f1821afe9e585b7",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 转让定价",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e0ec6e0072",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6b140f20af9",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215be04d0028",
//          "taskId" : "8a22ecb5560c52c90156218fa0fa0042",
//          "title" : "知识点3 转让定价",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/01db8815d3ab4cd58f1fe68c70f32e08.pdf",
//          "videoTime" : 1374,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "81F8BBC379DBCCBF9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215ba5a90027",
//          "taskId" : "8a22ecb5560c52c90156218fd6af0043",
//          "title" : "知识点3 转让定价-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 287,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D1709ED13BFBAC069C33DC5901307461"
//        }, {
//          "id" : "bbd943223083df35b73feda36d09d954",
//          "taskId" : "bbd943223083df35b73feda36d09d954",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 分部的绩效评估报告",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e436070077",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6b28b1e0afc",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215c6465002a",
//          "taskId" : "8a22ecb5560c52c9015621902dff0044",
//          "title" : "知识点4 分部的绩效评估报告",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/6ca3f0e5958f48828bc55c08373ec39d.pdf",
//          "videoTime" : 702,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "AC1539A41504CB3A9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215c2b4a0029",
//          "taskId" : "8a22ecb5560c52c9015621906bdb0045",
//          "title" : "知识点4 分部的绩效评估报告-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 396,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B921208C679BF3DF9C33DC5901307461"
//        }, {
//          "id" : "ba4543fb6bc5cdde1ae6466e2c13347c",
//          "taskId" : "ba4543fb6bc5cdde1ae6466e2c13347c",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第三节：绩效评估",
//      "chapterId" : "8a22ecb5545a87e801545b57ad410019",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d4ae0074",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 获利能力分析 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e4d2510078",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6b736690b01",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215d13ff002c",
//          "taskId" : "8a22ecb5560c52c901562190ecd90046",
//          "title" : "知识点1 获利能力分析",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/c27c74b5d11a43179d2ad8ae502f6c85.pdf",
//          "videoTime" : 1639,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9AB3CE488725931D9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215cdabe002b",
//          "taskId" : "8a22ecb5560c52c90156219115aa0047",
//          "title" : "知识点1 获利能力分析-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 458,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "F8D4D5FAA292BBFE9C33DC5901307461"
//        }, {
//          "id" : "31a0a7bbbf3d90067e686069a2b18854",
//          "taskId" : "31a0a7bbbf3d90067e686069a2b18854",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 投资回报率 & 剩余所得",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e525f30079",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6b891a80b08",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215da1d0002e",
//          "taskId" : "8a22ecb5560c52c90156219156d00048",
//          "title" : "知识点2 投资回报率 & 剩余所得",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/05d08ef1f18d4050b27c3cf58a2eda15.pdf",
//          "videoTime" : 1428,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BC551731F27C278E9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215d5962002d",
//          "taskId" : "8a22ecb5560c52c9015621918b150049",
//          "title" : "知识点2 投资回报率 & 剩余所得-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 481,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6C98C00DDC94785E9C33DC5901307461"
//        }, {
//          "id" : "da96e489d06fbc0aab486ac01e0f3269",
//          "taskId" : "da96e489d06fbc0aab486ac01e0f3269",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 平衡记分卡",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e57a4b007b",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ba36810b0b",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5560c52c90156215e1c8f0030",
//          "taskId" : "8a22ecb5560c52c901562191d373004a",
//          "title" : "知识点3 平衡记分卡[2017new]",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/1aeb0c15d2f04796a7bd27cfe4d1320e.pdf",
//          "videoTime" : 1756,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "704EA75F1B09D4D29C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5560c52c90156215ddb6e002f",
//          "taskId" : "8a22ecb5560c52c9015621920cfd004b",
//          "title" : "知识点3 平衡记分卡-测评练习[2017new]",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 185,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BE115B9089CAA5799C33DC5901307461"
//        }, {
//          "id" : "a8e6514ee75d8216235197de17acf6dd",
//          "taskId" : "a8e6514ee75d8216235197de17acf6dd",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    } ]
//  }, {
//    "chapterTitle" : "第四章 内部控制",
//    "chapterId" : "8a22ecb5545a87e801545af7a721000a",
//    "knowledgePointId" : "402890814d6f6abb014d6fe6d5f700c6",
//    "isFree" : "false",
//    "isLeaf" : "false",
//    "tasks" : null,
//    "chapterFiles" : null,
//    "chapterExtends" : null,
//    "children" : [ {
//      "chapterTitle" : "前导",
//      "chapterId" : "8a22ecb5545bfd8801545c5b4b490052",
//      "knowledgePointId" : null,
//      "isFree" : "false",
//      "isLeaf" : "true",
//      "tasks" : [ {
//        "id" : "8a22ecb556b580ba0156d4fe3bcf017a",
//        "taskId" : "8a22ecb556b580ba0156d5066f3f0193",
//        "title" : "前导",
//        "taskType" : "video",
//        "taskLevel" : null,
//        "express" : null,
//        "attachmentPath" : "/upload/201702/95eb13d2d1df44d8b6faad8d458fc1e6.pdf",
//        "videoTime" : 166,
//        "videoSiteId" : "E5DD260925A6084B",
//        "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//        "videoCcid" : "94CF43B4B11ED5B79C33DC5901307461"
//      } ],
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : null
//    }, {
//      "chapterTitle" : "第一节：公司治理、风险与合规性",
//      "chapterId" : "8a22ecb5545a87e801545b585338001a",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d5ff00c8",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 内部控制的概述",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e5fea3007c",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6bd8cd30b0f",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d4feb7a1017c",
//          "taskId" : "8a22ecb556b580ba0156d50720100194",
//          "title" : "知识点1 内部控制的概述",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/4f89aa6b497b41529de86714777dbb0f.pdf",
//          "videoTime" : 917,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "782EBC8368E04C9A9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d4fe76ca017b",
//          "taskId" : "8a22ecb556b580ba0156d5076de00195",
//          "title" : "知识点1 内部控制的概述-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 192,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8464A595CCBF59969C33DC5901307461"
//        }, {
//          "id" : "07307fd34926e2c277b0df5ecbb59572",
//          "taskId" : "07307fd34926e2c277b0df5ecbb59572",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 风险及其分类 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e64a60007e",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c04a8f0b12",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d4ff47c7017e",
//          "taskId" : "8a22ecb556b580ba0156d507c5f40196",
//          "title" : "知识点2 风险及其分类",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/e17fb8d52ec4467c97fb2f974840e7ca.pdf",
//          "videoTime" : 1021,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1A3DEDB85E50B8469C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d4fefe4e017d",
//          "taskId" : "8a22ecb556b580ba0156d50800050197",
//          "title" : "知识点2 风险及其分类-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 333,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "83B45850850B844E9C33DC5901307461"
//        }, {
//          "id" : "64b4b5350eb5412d528bce7059ccea0f",
//          "taskId" : "64b4b5350eb5412d528bce7059ccea0f",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 SOX法案 & 第5号审计准则",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e69a3d0081",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c3515c0b15",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d4ffb34f0180",
//          "taskId" : "8a22ecb556b580ba0156d50869250198",
//          "title" : "知识点3 SOX法案&第5号审计准则",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/656bfd38d370456bbb266768a6c35dd5.pdf",
//          "videoTime" : 1089,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D622B49A2C12B0129C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d4ff7d70017f",
//          "taskId" : "8a22ecb556b580ba0156d508ae630199",
//          "title" : "知识点3 SOX法案&第5号审计准则-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 353,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4D22D44BC506D99E9C33DC5901307461"
//        }, {
//          "id" : "5d143b614d3cf8285f63f79581ebdf61",
//          "taskId" : "5d143b614d3cf8285f63f79581ebdf61",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 COSO框架的五要素（上）",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e7633b0083",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c3f1470b18",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d500220e0182",
//          "taskId" : "8a22ecb556b580ba0156d50906b0019a",
//          "title" : "知识点4 COSO框架的五要素–控制环境&风险评估",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/88fc1524290b4bfca37cced779954b9e.pdf",
//          "videoTime" : 854,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "E388F76064D9ABDD9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d4ffee5b0181",
//          "taskId" : "8a22ecb556b580ba0156d509ab4d019b",
//          "title" : "知识点4 COSO框架的五要素–控制环境&风险评估-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 241,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7DCDB98E03A926659C33DC5901307461"
//        }, {
//          "id" : "5083505b34956a5c690728fec97bd8f4",
//          "taskId" : "5083505b34956a5c690728fec97bd8f4",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点5 COSO框架的五要素（下）",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e7b5ff0084",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c4911b0b1b",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d500adad0184",
//          "taskId" : "8a22ecb556b580ba0156d50a0259019c",
//          "title" : "知识点5 COSO框架的五要素–控制活动",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/960bb89d139e4e6e8d07de298a163303.pdf",
//          "videoTime" : 1145,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "0570BAF3AD31703D9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d500650b0183",
//          "taskId" : "8a22ecb556b580ba0156d50a70de019d",
//          "title" : "知识点5 COSO框架的五要素–控制活动-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 406,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "492C13EA4AC560A09C33DC5901307461"
//        }, {
//          "id" : "2684816832aaba37420f3a6e05cda1e3",
//          "taskId" : "2684816832aaba37420f3a6e05cda1e3",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点6 内控职责设置",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e941360085",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c5b2050b1e",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d50123f70186",
//          "taskId" : "8a22ecb556b580ba0156d50ad749019e",
//          "title" : "知识点6 内控职责设置",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/252d7f76f4c94c338edf857da2730520.pdf",
//          "videoTime" : 703,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "E21889DD7F6A7DBF9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d500ec4b0185",
//          "taskId" : "8a22ecb556b580ba0156d50b23bb019f",
//          "title" : "知识点6 内控职责设置-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 321,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "28B7FEC0735A15209C33DC5901307461"
//        }, {
//          "id" : "e1fdd158860cbf14bdc5de38b1f8feec",
//          "taskId" : "e1fdd158860cbf14bdc5de38b1f8feec",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点7 内控方法的类型 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22e983d70086",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c635aa0b21",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d501a45f0188",
//          "taskId" : "8a22ecb556b580ba0156d50b794c01a0",
//          "title" : "知识点7 内控方法的类型",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/6f1ed383c28f4d5c80d3795f585087aa.pdf",
//          "videoTime" : 1072,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2B60308F633D16C59C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d5015ddc0187",
//          "taskId" : "8a22ecb556b580ba0156d50bcec201a1",
//          "title" : "知识点7 内控方法的类型-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 353,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B031568EB2458FA49C33DC5901307461"
//        }, {
//          "id" : "4bff7fab4099ed28cb0a9b07a5e3f358",
//          "taskId" : "4bff7fab4099ed28cb0a9b07a5e3f358",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第二节：内部审计",
//      "chapterId" : "8a22ecb5545a87e801545b59738c001b",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d62f00d4",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 内部审计部门的职权",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ee1c49008b",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c754d00b28",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d5022e0b018a",
//          "taskId" : "8a22ecb556b580ba0156d50c36eb01a2",
//          "title" : "知识点1 内部审计部门的职权",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/aae8f843dc7847ca92e61b8a919b194f.pdf",
//          "videoTime" : 1737,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "E57C5CF1DC6DF35B9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d501e27f0189",
//          "taskId" : "8a22ecb556b580ba0156d50c711801a3",
//          "title" : "知识点1 内部审计部门的职权-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 343,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "554F08E57C3C10379C33DC5901307461"
//        }, {
//          "id" : "09364ad4de7732a68f8ca6e231252487",
//          "taskId" : "09364ad4de7732a68f8ca6e231252487",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 内部审计报告",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ee6e7b008d",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6c95c170b31",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d502adae018c",
//          "taskId" : "8a22ecb556b580ba0156d50cb9d501a4",
//          "title" : "知识点2 内部审计报告",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/83f85b844ae74960bd8c951ce323e1d2.pdf",
//          "videoTime" : 783,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "F68EEC2286F0069B9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d5026916018b",
//          "taskId" : "8a22ecb556b580ba0156d50cf60601a5",
//          "title" : "知识点2 内部审计报告-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 312,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1CEAE959C867C1439C33DC5901307461"
//        }, {
//          "id" : "53a7c98faf1fd94b6eec0caaafd07198",
//          "taskId" : "53a7c98faf1fd94b6eec0caaafd07198",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 内审人员实施的审计类型",
//        "chapterId" : "8a22ecb55b1ec7e9015b22eec1aa008f",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ca50170b36",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d50329d9018e",
//          "taskId" : "8a22ecb556b580ba0156d50d48d201a6",
//          "title" : "知识点3 内审人员实施的审计类型",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/7a885d5d4d704917bd0c90781bcddd97.pdf",
//          "videoTime" : 383,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "EC99FD9A709ECBB69C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d502e6bf018d",
//          "taskId" : "8a22ecb556b580ba0156d50d799601a7",
//          "title" : "知识点3 内审人员实施的审计类型-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 241,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "53EC9BD40A09CB4E9C33DC5901307461"
//        }, {
//          "id" : "c69fcdd74fe3ebf021e0f0a80259750c",
//          "taskId" : "c69fcdd74fe3ebf021e0f0a80259750c",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第三节：系统控制与安全措施",
//      "chapterId" : "8a22ecb5545a87e801545b59ca79001c",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d64800da",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 信息系统控制 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22efab1f0092",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6cb3e210b3c",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d503a19e0190",
//          "taskId" : "8a22ecb556b580ba0156d50dfeb601a8",
//          "title" : "知识点1 信息系统控制",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/4da1665d37a94a03845d4fbb011cd7b8.pdf",
//          "videoTime" : 767,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9D533BBBC2541ADD9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d5036415018f",
//          "taskId" : "8a22ecb556b580ba0156d50e2b6401a9",
//          "title" : "知识点1 信息系统控制-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 301,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B0826035AFE3E60F9C33DC5901307461"
//        }, {
//          "id" : "39ab6ee3d124716af9b3b5962ff99b4d",
//          "taskId" : "39ab6ee3d124716af9b3b5962ff99b4d",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 企业持续计划&会计控制",
//        "chapterId" : "8a22ecb55b1ec7e9015b22efec250094",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6cca7ec0b3f",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb556b580ba0156d504175b0192",
//          "taskId" : "8a22ecb556b580ba0156d50e971001aa",
//          "title" : "知识点2 企业持续计划&会计控制",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/ba46103a74af4f87a359441168749ca9.pdf",
//          "videoTime" : 769,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6CC80ACDC1F862E89C33DC5901307461"
//        }, {
//          "id" : "8a22ecb556b580ba0156d503e1620191",
//          "taskId" : "8a22ecb556b580ba0156d50ec13f01ab",
//          "title" : "知识点2 企业持续计划&会计控制-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 251,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "515B5317D3AC475A9C33DC5901307461"
//        }, {
//          "id" : "d2f481b4442e50d8094df662d085f005",
//          "taskId" : "d2f481b4442e50d8094df662d085f005",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    } ]
//  }, {
//    "chapterTitle" : "第五章 对外财务报告决策",
//    "chapterId" : "8a22ecb5545a87e801545af7ff38000b",
//    "knowledgePointId" : null,
//    "isFree" : "false",
//    "isLeaf" : "false",
//    "tasks" : null,
//    "chapterFiles" : null,
//    "chapterExtends" : null,
//    "children" : [ {
//      "chapterTitle" : "前导",
//      "chapterId" : "8a22ecb5545bfd8801545c5b9fb20053",
//      "knowledgePointId" : null,
//      "isFree" : "false",
//      "isLeaf" : "true",
//      "tasks" : [ {
//        "id" : "8a22ecb5576add02015774559cbf0056",
//        "taskId" : "8a22ecb5576add0201577458539f005d",
//        "title" : "前导",
//        "taskType" : "video",
//        "taskLevel" : null,
//        "express" : null,
//        "attachmentPath" : "/upload/201703/520a1eba44a8433096f77a44c57d0c48.pdf",
//        "videoTime" : 139,
//        "videoSiteId" : "E5DD260925A6084B",
//        "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//        "videoCcid" : "100F1873CE084CD49C33DC5901307461"
//      } ],
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : null
//    }, {
//      "chapterTitle" : "第一节：财务报表",
//      "chapterId" : "8a22ecb5545a87e801545b5aedac001d",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d2d30008",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 利润表",
//        "chapterId" : "8a22ecb55b1ec7e9015b22f0e3710096",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ce37fa0b44",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add02015774560f450057",
//          "taskId" : "8a22ecb5576add0201577458c636005e",
//          "title" : "知识点1 利润表",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/e5d64bdff9334101b6a8cf0a842ff764.pdf",
//          "videoTime" : 1305,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "781F27874E2ADC3B9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774564bfb0058",
//          "taskId" : "8a22ecb5576add02015774592915005f",
//          "title" : "知识点1 利润表-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 529,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "CB5FC7B7300902CB9C33DC5901307461"
//        }, {
//          "id" : "2c8efc1c20120936d93b57d406c94c81",
//          "taskId" : "2c8efc1c20120936d93b57d406c94c81",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 股东权益变动表&资产负债表",
//        "chapterId" : "8a22ecb55b1ec7e9015b22f11d7b0098",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6d2af220b48",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add02015774568e610059",
//          "taskId" : "8a22ecb5576add020157745967ce0060",
//          "title" : "知识点2 股东权益变动表&资产负债表",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/38147f0900d64fceab35dac89810095f.pdf",
//          "videoTime" : 971,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6DBF00B4D8914A809C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add0201577456c124005a",
//          "taskId" : "8a22ecb5576add0201577459aceb0061",
//          "title" : "知识点2 股东权益变动表&资产负债表-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 449,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "419EBAC9E5D7B9D89C33DC5901307461"
//        }, {
//          "id" : "dad79bbd572e6309a546298ae194ad39",
//          "taskId" : "dad79bbd572e6309a546298ae194ad39",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 现金流量表",
//        "chapterId" : "8a22ecb55b1ec7e9015b22f184ec0099",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6d672370b4b",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add0201577456fbd6005b",
//          "taskId" : "8a22ecb5576add0201577459e56f0062",
//          "title" : "知识点3 现金流量表",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/163b848ba02742ac84ed735ef02a0cc3.pdf",
//          "videoTime" : 1415,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6D48DC0A5830323B9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774572ce4005c",
//          "taskId" : "8a22ecb5576add020157745a35e60063",
//          "title" : "知识点3 现金流量表-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 779,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2F26A4F9E8C202B59C33DC5901307461"
//        }, {
//          "id" : "0e811572a510d4d81e75b6e3265c7284",
//          "taskId" : "0e811572a510d4d81e75b6e3265c7284",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    }, {
//      "chapterTitle" : "第二节：确认、计量、记录和报告",
//      "chapterId" : "8a22ecb5545a87e801545b5b3ca9001e",
//      "knowledgePointId" : "402890814d6f6abb014d6fe6d3030012",
//      "isFree" : "false",
//      "isLeaf" : "false",
//      "tasks" : null,
//      "chapterFiles" : null,
//      "chapterExtends" : null,
//      "children" : [ {
//        "chapterTitle" : "知识点1 现金及其等价物",
//        "chapterId" : "8a22ecb55b1ec7e9015b22f3de2800a0",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6dac77b0b4e",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745b89cf0065",
//          "taskId" : "8a22ecb5576add02015774671638008e",
//          "title" : "知识点1 现金及其他等价物",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/939f48994c224814aa79a06880753e27.pdf",
//          "videoTime" : 513,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D4A06EFFDCD5B7EA9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745b56c50064",
//          "taskId" : "8a22ecb5576add0201577467867a008f",
//          "title" : "知识点1 现金及其他等价物-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 423,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9924B6A580596B2B9C33DC5901307461"
//        }, {
//          "id" : "7c8cf1ddd5dd3451d2cd4db415062519",
//          "taskId" : "7c8cf1ddd5dd3451d2cd4db415062519",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点2 应收账款的确认",
//        "chapterId" : "8a22ecb55b1ec7e9015b22fe94cc00b3",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6de073a0b51",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add0201577460eabe007b",
//          "taskId" : "8a22ecb5576add02015774684c8e0090",
//          "title" : "知识点2 应收账款的确认",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/97e238e8ece940b2b93ffa01e7e8984d.pdf",
//          "videoTime" : 1038,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1DDD3AC520E55FC99C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add0201577460b76d007a",
//          "taskId" : "8a22ecb5576add020157746906900091",
//          "title" : "知识点2 应收账款的确认-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 347,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B9EF3477838B679C9C33DC5901307461"
//        }, {
//          "id" : "e1a720793eecda3db7ced3079d8df6c8",
//          "taskId" : "e1a720793eecda3db7ced3079d8df6c8",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点3 应收账款的计量 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b22feee6f00b4",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6df26820b54",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157746229b80081",
//          "taskId" : "8a22ecb5576add0201577469bc140092",
//          "title" : "知识点3 应收账款的计量",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201703/2d987c9cc7ec4aec9443cf16bb3901bf.pdf",
//          "videoTime" : 956,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8FEF798E4220B0BA9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add0201577461f2430080",
//          "taskId" : "8a22ecb5576add020157746aa5620093",
//          "title" : "知识点3 应收账款的计量-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 696,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8E1B528F826A4A509C33DC5901307461"
//        }, {
//          "id" : "8ad2de3fadb59f388c9302d50fd06fa2",
//          "taskId" : "8ad2de3fadb59f388c9302d50fd06fa2",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点4 应收账款/应收票据的处置",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ffa7d500b7",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6dff40d0b57",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157746289c10083",
//          "taskId" : "8a22ecb5576add020157746f83250094",
//          "title" : "知识点4 应收账款/应收票据的处置",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/981e1a2521d04c6ab30013736f091df0.pdf",
//          "videoTime" : 985,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "79BBC0A772672E369C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157746259c80082",
//          "taskId" : "8a22ecb5576add020157746fc1260095",
//          "title" : "知识点4 应收账款/应收票据的处置-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 261,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "B6475D6C3E8394059C33DC5901307461"
//        }, {
//          "id" : "1cf7adbd100689288816a5b1dc7678e6",
//          "taskId" : "1cf7adbd100689288816a5b1dc7678e6",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点5 存货的分类与控制",
//        "chapterId" : "8a22ecb55b1ec7e9015b22ffe56500b9",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e190710b5a",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add0201577462edb90085",
//          "taskId" : "8a22ecb5576add02015774706f000096",
//          "title" : "知识点5 存货的分类与控制",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/893f36fab65e4de5a2171d947bea2952.pdf",
//          "videoTime" : 1496,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9EC1F8EC892A77119C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add0201577462be400084",
//          "taskId" : "8a22ecb5576add0201577470d1860097",
//          "title" : "知识点5 存货的分类与控制-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 438,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "08FFD282EE72F25B9C33DC5901307461"
//        }, {
//          "id" : "204c0ffdf97a118dc4a3ac0870e7a886",
//          "taskId" : "204c0ffdf97a118dc4a3ac0870e7a886",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点6 存货的确认",
//        "chapterId" : "8a22ecb55b1ec7e9015b2300430d00bc",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e263db0b5d",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157746350930087",
//          "taskId" : "8a22ecb5576add02015774713f340098",
//          "title" : "知识点6 存货的确认",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/318161a27fde4e3294235b3ed4a67119.pdf",
//          "videoTime" : 852,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2D8F7D3E5373F7BF9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774631f320086",
//          "taskId" : "8a22ecb5576add0201577471ea380099",
//          "title" : "知识点6 存货的确认-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 263,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "F9C82D4BD8D55A569C33DC5901307461"
//        }, {
//          "id" : "774f6bb01c5f1bb98d12f7d9fda6df3c",
//          "taskId" : "774f6bb01c5f1bb98d12f7d9fda6df3c",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点7 存货的流转假设",
//        "chapterId" : "8a22ecb55b1ec7e9015b2303361200c5",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e424010b60",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add0201577463d7ee0089",
//          "taskId" : "8a22ecb5576add0201577472b016009a",
//          "title" : "知识点7 存货的流转假设",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/bb90bf90f388480e9a1d9cff3aed9985.pdf",
//          "videoTime" : 1437,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9E922D1F3C4D0EE49C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add0201577463a3910088",
//          "taskId" : "8a22ecb5576add0201577472f0a8009b",
//          "title" : "知识点7 存货的流转假设-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 610,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4A11F23F2184B3059C33DC5901307461"
//        }, {
//          "id" : "2e500e23ab22d88ab134ac45505173d1",
//          "taskId" : "2e500e23ab22d88ab134ac45505173d1",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点8 存货减值 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b2303780a00c7",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e579e40b63",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157746443f4008b",
//          "taskId" : "8a22ecb5576add02015774735166009c",
//          "title" : "知识点8 存货减值",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/a477c2fdc6284812a9e68242d8737741.pdf",
//          "videoTime" : 1012,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "0F92BF9B2E5FECE69C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774640ff0008a",
//          "taskId" : "8a22ecb5576add0201577473975d009d",
//          "title" : "知识点8 存货减值-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 278,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "81EBA9C79141EB039C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点9 收入确认（上） ",
//        "chapterId" : "8a22ecb55b1ec7e9015b2303b59d00c9",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e6484c0b67",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add0201577464b8bc008d",
//          "taskId" : "8a22ecb5576add02015774740708009e",
//          "title" : "知识点9 收入确认（上）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/d6ff21c372334c9481c6a4ef81f14ca2.pdf",
//          "videoTime" : 1050,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A5C4CDB2F326CA309C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774647b89008c",
//          "taskId" : "8a22ecb5576add02015774745b9d009f",
//          "title" : "知识点9 收入确认（上）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 221,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "5F51A0507306D0819C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点10 收入确认（下）",
//        "chapterId" : "8a22ecb55b1ec7e9015b23040ce100cb",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e6b14c0b6c",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745bfa950067",
//          "taskId" : "8a22ecb5576add0201577474f2f000a0",
//          "title" : "知识点10 收入确认（下）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/dc7edd80ec7548e98b76bcc8ee4722e8.pdf",
//          "videoTime" : 1182,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9E7E227330B59F8F9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745bc1310066",
//          "taskId" : "8a22ecb5576add02015774757a3700a1",
//          "title" : "知识点10 收入确认（下）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 305,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6CEB2646F5A72CCF9C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点11 债券投资 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b23044e4e00cd",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e7a0290b70",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745c741c0069",
//          "taskId" : "8a22ecb5576add020157747673bf00a2",
//          "title" : "知识点11 债券投资",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/71c8e788f6de43b5921f0ed6feedca4a.pdf",
//          "videoTime" : 1128,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7924C11F0235509F9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745c3cd40068",
//          "taskId" : "8a22ecb5576add0201577476b7cc00a3",
//          "title" : "知识点11 债券投资-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 291,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "E9DB920B541097AE9C33DC5901307461"
//        }, {
//          "id" : "41e603e4c0218aa15dc963d52430d415",
//          "taskId" : "41e603e4c0218aa15dc963d52430d415",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点12 权益证券",
//        "chapterId" : "8a22ecb55b1ec7e9015b2304920900cf",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e85c8c0b73",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745ce22e006b",
//          "taskId" : "8a22ecb5576add02015774772a1800a4",
//          "title" : "知识点12 权益证券",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/ad10b557557b47e2a636c4058adee5cb.pdf",
//          "videoTime" : 1327,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BA60A37D4955DA529C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745cad62006a",
//          "taskId" : "8a22ecb5576add0201577477717500a5",
//          "title" : "知识点12 权益证券-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 339,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "7EDF009598FD7EAE9C33DC5901307461"
//        }, {
//          "id" : "2874739e46332ce2d188629a8b77af21",
//          "taskId" : "2874739e46332ce2d188629a8b77af21",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点13 固定资产（上）",
//        "chapterId" : "8a22ecb55b1ec7e9015b2304d0c500d1",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e8def50b76",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745daf1f006d",
//          "taskId" : "8a22ecb5576add0201577477fe2600a6",
//          "title" : "知识点13 固定资产（上）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/38bdee2790474b4daa1e9e305a5be94e.pdf",
//          "videoTime" : 1708,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "1BE4DDAC2870DF529C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745d706a006c",
//          "taskId" : "8a22ecb5576add02015774788d3600a7",
//          "title" : "知识点13 固定资产（上）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 332,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4707DF15AB3C057F9C33DC5901307461"
//        }, {
//          "id" : "6c2f168a88ad39abffeb05b1bde451e1",
//          "taskId" : "6c2f168a88ad39abffeb05b1bde451e1",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点14 固定资产（下）",
//        "chapterId" : "8a22ecb55b1ec7e9015b2305c4ee00d5",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e95cca0b79",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745e16b2006f",
//          "taskId" : "8a22ecb5576add020157747b770700a8",
//          "title" : "知识点14 固定资产（下）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/7a9a5a886bc64af58b9a6074db2fa42b.pdf",
//          "videoTime" : 977,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2A8A18F2E0D18D1D9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745de3ca006e",
//          "taskId" : "8a22ecb5576add020157747c6b4b00a9",
//          "title" : "知识点14 固定资产（下）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 277,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "9CF390917FA619D09C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点15 无形资产",
//        "chapterId" : "8a22ecb55b1ec7e9015b2306071300d6",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6e9c2560b7c",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745ec8150071",
//          "taskId" : "8a22ecb5576add020157747cdc8700aa",
//          "title" : "知识点15 无形资产",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/ff9f4fd8ba96402d8434c27e482d1aba.pdf",
//          "videoTime" : 1238,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "76FE29BB9CA0B6429C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745e5cc60070",
//          "taskId" : "8a22ecb5576add020157747d137800ab",
//          "title" : "知识点15 无形资产-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 411,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "95058BFA66E0550A9C33DC5901307461"
//        }, {
//          "id" : "7ef138a9fc261ee479b8baf296f2e0a7",
//          "taskId" : "7ef138a9fc261ee479b8baf296f2e0a7",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点16 负债（上）",
//        "chapterId" : "8a22ecb55b1ec7e9015b23086cf900de",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ea426c0b7f",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745f3a450073",
//          "taskId" : "8a22ecb5576add020157747d920400ac",
//          "title" : "知识点16 负债（上）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/dbb43b8b76ff4a818ec21098c73c4914.pdf",
//          "videoTime" : 1450,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "3F09A76D61185E6B9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745f06f00072",
//          "taskId" : "8a22ecb5576add020157747df11700ad",
//          "title" : "知识点16 负债（上）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 329,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4CAB7AFF43E915ED9C33DC5901307461"
//        }, {
//          "id" : "df33df2292a4e8608778461c0b594a59",
//          "taskId" : "df33df2292a4e8608778461c0b594a59",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点17 负债（下）",
//        "chapterId" : "8a22ecb55b1ec7e9015b2308dc7000df",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6eb76d80b82",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157745fa5d60075",
//          "taskId" : "8a22ecb5576add020157747f29e900ae",
//          "title" : "知识点17 负债（下）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/8fce71f499db4780903e191033934d7a.pdf",
//          "videoTime" : 1062,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "2829C4577655B1C49C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745f6e810074",
//          "taskId" : "8a22ecb5576add020157748064b400af",
//          "title" : "知识点17 负债（下）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 448,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "BE53DB08C2A44AB89C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点18 租赁会计",
//        "chapterId" : "8a22ecb55b1ec7e9015b2309352800e0",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ebf7870b85",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157746013fd0077",
//          "taskId" : "8a22ecb5576add0201577480c55b00b0",
//          "title" : "知识点18 租赁会计",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/ac6cdd296ae84050b559495b67f54726.pdf",
//          "videoTime" : 1143,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "44EF6A6E7074BC2F9C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157745fdebc0076",
//          "taskId" : "8a22ecb5576add02015774810ab300b1",
//          "title" : "知识点18 租赁会计-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 246,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "A32188A26E632F9F9C33DC5901307461"
//        }, {
//          "id" : "0628a919d0afb00547516704b6087d7e",
//          "taskId" : "0628a919d0afb00547516704b6087d7e",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点19 企业所得税 ",
//        "chapterId" : "8a22ecb55b1ec7e9015b2309b23200e1",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6edbb390b88",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add020157746081ca0079",
//          "taskId" : "8a22ecb5576add020157748182aa00b2",
//          "title" : "知识点19 企业所得税",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/8e776c5bc3404b1fbc4f739be172da54.pdf",
//          "videoTime" : 1948,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "ECBB3C046F4C84119C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add020157746047600078",
//          "taskId" : "8a22ecb5576add0201577481eb5f00b3",
//          "title" : "知识点19 企业所得税-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 528,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "757FDAF8776D33879C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点20 股东权益（上）",
//        "chapterId" : "8a22ecb55b1ec7e9015b2309f8b700e2",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6ee2fa40b8b",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add02015774615743007d",
//          "taskId" : "8a22ecb5576add0201577484deb300b4",
//          "title" : "知识点20 股东权益（上）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/c344ddf3cf9a426e9bc2ecc4a7b508ad.pdf",
//          "videoTime" : 1225,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "4662A38F036F8B289C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774611d69007c",
//          "taskId" : "8a22ecb5576add02015774851a0100b5",
//          "title" : "知识点20 股东权益（上）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 222,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "6CDFAC72EB41CBB79C33DC5901307461"
//        }, {
//          "id" : "5f07ca0338625f3feb1d6324d6d6ea5f",
//          "taskId" : "5f07ca0338625f3feb1d6324d6d6ea5f",
//          "title" : "知识点练习",
//          "taskType" : "knowledgePointExercise",
//          "taskLevel" : "core",
//          "express" : null
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      }, {
//        "chapterTitle" : "知识点21 股东权益（下）",
//        "chapterId" : "8a22ecb55b1ec7e9015b230a407400e3",
//        "knowledgePointId" : "8a22ecb55aa7aa10015ac6eed17d0b8e",
//        "isFree" : "false",
//        "isLeaf" : "true",
//        "tasks" : [ {
//          "id" : "8a22ecb5576add0201577461bd1a007f",
//          "taskId" : "8a22ecb5576add0201577485888e00b6",
//          "title" : "知识点21 股东权益（下）",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "/upload/201702/7bac59809c394669b496d7403c86d68c.pdf",
//          "videoTime" : 807,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "D461EC12D8030C039C33DC5901307461"
//        }, {
//          "id" : "8a22ecb5576add02015774618aa0007e",
//          "taskId" : "8a22ecb5576add0201577486116700b7",
//          "title" : "知识点21 股东权益（下）-测评练习",
//          "taskType" : "video",
//          "taskLevel" : null,
//          "express" : null,
//          "attachmentPath" : "",
//          "videoTime" : 424,
//          "videoSiteId" : "E5DD260925A6084B",
//          "apiKey" : "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
//          "videoCcid" : "8D1F59306DE680C99C33DC5901307461"
//        } ],
//        "chapterFiles" : null,
//        "chapterExtends" : null,
//        "children" : null
//      } ]
//    } ]
//  } ],
//"state" : "success",
//"msg" : null,
//"code" : null
//}

        var task_tpl = $('#task_tpl').html();
        var content = doT.template(task_tpl);
     	
        //$('#chaTask').html(content(chapter_data)).show().siblings().hide();
        $('#chaTask').html(content(arr)).show();    
        is_over_task = true;
        
        initDomDownStatus();
//      isSolidcircle('progress', task_info_detail.chapterId, '', courseId, 'video-menu');
        //已加载完毕
        //})
    } else {
        $('#chaTask').show().siblings().hide();
    }
}
//判断实心圈、半心圈、空心圈，参数type:'circle'、'progress',参数chap_id二级章节id
      function isSolidcircle(type, chap_id, task_id, course_id, from) {
          if (isEmpty(course_id)) {
              var courseId = api.pageParam.course_id;
          } else {
              var courseId = course_id;
          }
          //如果没有缓存信息，就从接口获取
          var tmp_course_detail = $api.getStorage(courseId);
          if (isEmpty(tmp_course_detail)) {
              //获取课程的详细信息
              //api/v2.1/course/courseDetail，接口编号：004-006
              ajaxRequest('api/v2.1/course/courseDetail', 'get', {
                  courseId: courseId
              }, function (ret, err) {//004.006获取课程的详细信息
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
                      //处理过的课程进度
                      var arr = {};
                      var data_arr = course_detail.chapters;
                      for (var i in data_arr) {
                          if (data_arr[i].isLeaf == 'false') {
                              var child = data_arr[i].children;
                              for (var j in child) {
                                  if (child[j].isLeaf == 'false') {
                                      var child2 = child[j].children;
                                      for (var k in child2) {
                                          var cId = child2[k].chapterId;
                                          arr[cId] = {};
                                          for (var x in child2[k].tasks) {
                                              if (child[j].isLeaf == 'false') {
      
                                              } else {
                                                  var taskid = child2[k].tasks[x].taskId;
                                                  arr[cId][taskid] = {
                                                      'progress': 0,
                                                      'isok': 0,
                                                      'total': 0
                                                  };
                                             }
                                          }
                                      }
                                  } else {
                                      var cId = child[j].chapterId;
                                      arr[cId] = {};
                                      for (var k in child[j].tasks) {
                                          var taskid = child[j].tasks[k].taskId;
                                          arr[cId][taskid] = {
                                              'progress': 0,
                                              'isok': 0,
                                              'total': 0
                                          };
                                      }
                                  }
                              }
                          } else {
                              var cId = data_arr[i].chapterId;
                              arr[cId] = {};
                              for (var k in data_arr[i].tasks) {
                                  var taskid = data_arr[i].tasks[k].taskId;
                                  arr[cId][taskid] = {
                                      'progress': 0,
                                      'isok': 0,
                                      'total': 0
                                  };
                              }
                          }
                      }
      
                      //获取课程任务进度列表（new）tested
                      var param = {
                          'token': $api.getStorage('token'), //必须
                          'memberId' : getstor('memberId'),
                          'courseId': courseId, //课程ID,必须
                          'charpterId': '', //章节ID,非必须
                          'taskId': ''//任务ID,非必须
                      };
                      ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/getTasksProgress/v1.0/' }, 'get', param, function(ret, err) {
                      //ajaxRequest('api/v2/study/getTasksProgress', 'get', param, function (ret, err) {//008.022 获取课程任务进度列表（new）tested，接口编号：008-022
                          if (err) {
                              return false;
                          } else if (ret && ret.state == 'success') {
                              var tasksNum = 0;
                              var chaptersNum = 0;
                              //课程进度
                              for (var i in ret.data) {
                                  var tmpdata = ret.data[i];
                                  if(tmpdata.state == 1){
                                    tasksNum++;
                                  }
                                  if (!isEmpty(arr[tmpdata.chapterId]) && !isEmpty(arr[tmpdata.chapterId][tmpdata.taskId])) {
                                      if (tmpdata.state == 1) {
                                          arr[tmpdata.chapterId][tmpdata.taskId].isok = 3;
                                      } else {
                                          if (tmpdata.progress > 0) {
                                              arr[tmpdata.chapterId][tmpdata.taskId].isok = 1;
                                          } else {
                                              arr[tmpdata.chapterId][tmpdata.taskId].isok = 0;
                                          }
                                      }
                                      arr[tmpdata.chapterId][tmpdata.taskId].progress = tmpdata.progress;
                                      arr[tmpdata.chapterId][tmpdata.taskId].total = tmpdata.total;
                                  }
                              }
                              //处理过的课程进度
                              if (type == 'circle') {
                                  //获取圈圈样式
                                  if (from == 'video-menu') {
                                      $('#chaList').find('.dot-status').each(function () {
                                          var tmp_chapID = $(this).attr('data-chapId');
                                          if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                              var num = 0;
                                              var len = 0;
                                              for (var i in arr[tmp_chapID]) {
                                                  num += parseInt(arr[tmp_chapID][i].isok);
                                                  ++len;
                                              }
      
      
                                              if (num > 0) {
                                                  if (num == len * 3) {
                                                    chaptersNum++;
                                                      $(this).attr('type', '3');
                                                      //实心圈
                                                  } else {
                                                      //半圈
                                                      $(this).attr('type', '2');
                                                  }
                                              } else {
                                                  $(this).attr('type', '1');
                                                  //空圈
                                              }
      
                                          }
                                      });
                                  } else {
                                      $('#content').find('.dot-status').each(function () {
                                          var tmp_chapID = $(this).attr('data-chapId');
                                          if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                              var num = 0;
                                              var len = 0;
                                              for (var i in arr[tmp_chapID]) {
                                                  num += parseInt(arr[tmp_chapID][i].isok);
                                                  ++len;
                                              }
      
      
                                              if (num > 0) {
                                                  if (num == len * 3) {
                                                    chaptersNum++;
                                                      $(this).attr('type', '3');
                                                      //实心圈
                                                  } else {
                                                      //半圈
                                                      $(this).attr('type', '2');
                                                  }
                                              } else {
                                                  $(this).attr('type', '1');
                                                  //空圈
                                              }
      
                                          }
                                      });
                                  }
                              } else if (type == 'progress') {
                                  //如果是获取任务进度条
                                  $('#chaTask').find('.taskProgress').each(function () {
                                      $(this).css('width', '100%');
                                  });
                              }
                              api.sendEvent({
                                name : 'setChaptersNum',
                                extra : {
                                  'chaptersNum' : chaptersNum,
                                  'chaptersNumTotal' : course_detail.chapterNum
                                }
                              })
                              api.sendEvent({
                                name : 'setTasksNum',
                                extra : {
                                  'tasksNum' : tasksNum,
                                  'tasksNumTotal' : course_detail.taskNum
                                }
                              })
                          }
                      });
      
      
                  }
              });
          } else {
              course_detail = tmp_course_detail;//存储课程详细信息
              //处理过的课程进度
              //处理过的课程进度
              var arr = {};
              var data_arr = course_detail.chapters;
              for (var i in data_arr) {
                  if (data_arr[i].isLeaf == 'false') {
                      var child = data_arr[i].children;
                      for (var j in child) {
                          if (child[j].isLeaf == 'false') {
                              var child2 = child[j].children;
                              for (var k in child2) {
                                  var cId = child2[k].chapterId;
                                  arr[cId] = {};
                                  for (var x in child2[k].tasks) {
                                      //if (child[j].isLeaf == 'false') {
      
                                      //} else {
                                          var taskid = child2[k].tasks[x].taskId;
                                          arr[cId][taskid] = {
                                              'progress': 0,
                                              'isok': 0,
                                              'total': 0
                                          };
                                     // }
                                  }
                              }
                          } else {
                              var cId = child[j].chapterId;
                              arr[cId] = {};
                              for (var k in child[j].tasks) {
                                  var taskid = child[j].tasks[k].taskId;
                                  arr[cId][taskid] = {
                                      'progress': 0,
                                      'isok': 0,
                                      'total': 0
                                  };
                              }
                          }
                      }
                  } else {
                      var cId = data_arr[i].chapterId;
                      arr[cId] = {};
                      for (var k in data_arr[i].tasks) {
                          var taskid = data_arr[i].tasks[k].taskId;
                          arr[cId][taskid] = {
                              'progress': 0,
                              'isok': 0,
                              'total': 0
                          };
                      }
                  }
              }
      
      
              //获取课程任务进度列表（new）tested
              var param = {
                  'token': $api.getStorage('token'), //必须
                  'memberId' : getstor('memberId'),
                  'courseId': courseId, //课程ID,必须
                  'charpterId': '', //章节ID,非必须
                  'taskId': ''//任务ID,非必须
              };
              ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/getTasksProgress/v1.0/' }, 'get', param, function(ret, err) {
              //ajaxRequest('api/v2/study/getTasksProgress', 'get', param, function (ret, err) {//008.022 获取课程任务进度列表（new）tested，接口编号：008-022
                  if (err) {
                      return false;
                  } else if (ret && ret.state == 'success') {
                      var tasksNum = 0;
                      var chaptersNum = 0;
                      //课程进度
                      for (var i in ret.data) {
                          var tmpdata = ret.data[i];
                          if(tmpdata.state == 1){
                            tasksNum++;
                          }
                          if (!isEmpty(arr[tmpdata.chapterId]) && !isEmpty(arr[tmpdata.chapterId][tmpdata.taskId])) {
                              if (tmpdata.state == 1) {
                                  arr[tmpdata.chapterId][tmpdata.taskId].isok = 3;
                              } else {
                                  if (tmpdata.progress > 0) {
                                      arr[tmpdata.chapterId][tmpdata.taskId].isok = 1;
                                  } else {
                                      arr[tmpdata.chapterId][tmpdata.taskId].isok = 0;
                                  }
                              }
      
                              arr[tmpdata.chapterId][tmpdata.taskId].progress = tmpdata.progress;
                              arr[tmpdata.chapterId][tmpdata.taskId].total = tmpdata.total;
                          }
                      }
                      //处理过的课程进度
                      if (type == 'circle') {
                          if (from == 'video-menu') {
                              $('#chaList').find('.dot-status').each(function () {
                                  var tmp_chapID = $(this).attr('data-chapId');
      
                                  if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                      var num = 0;
                                      var len = 0;
                                      for (var i in arr[tmp_chapID]) {
                                          num += parseInt(arr[tmp_chapID][i].isok);
                                          ++len;
                                      }
      
                                      if (num > 0) {
                                          if (num == len * 3) {
                                            chaptersNum++;
                                              $(this).attr('type', '3');//实心圈
                                              //api.alert({msg: arr['ff8080814db86d41014dc1a26c4f0539']});
                                          } else {
                                              //半圈
                                              $(this).attr('type', '2');
                                          }
                                      } else {
                                          $(this).attr('type', '1');
                                          //空圈
                                      }
      
                                  }
                              });
                          } else {
                              $('#content').find('.dot-status').each(function () {
                                  var tmp_chapID = $(this).attr('data-chapId');
                                  if (!isEmpty(tmp_chapID) && !isEmpty(arr[tmp_chapID])) {
                                      var num = 0;
                                      var len = 0;
                                      for (var i in arr[tmp_chapID]) {
                                          num += parseInt(arr[tmp_chapID][i].isok);
                                          ++len;
                                      }
      
                                      if (num > 0) {
                                          if (num == len * 3) {
                                            chaptersNum++;
                                              $(this).attr('type', '3');
                                              //实心圈
                                          } else {
                                              //半圈
                                              $(this).attr('type', '2');
                                          }
                                      } else {
                                          $(this).attr('type', '1');
                                          //空圈
                                      }
      
                                  }
                              });
                          }
                      } else if (type == 'progress') {
                          //如果是获取任务进度条
                          $('#chaTask').find('.taskProgress').each(function () {
                              var tmp_chapID = chap_id;
                              var tmp_taskID = $(this).attr('data-taskid');
                              if (!isEmpty(tmp_chapID) && !isEmpty(tmp_taskID)) {
                                  var tmp_task_progress = arr[tmp_chapID][tmp_taskID];
                                  if (isEmpty(tmp_task_progress) || isEmpty(tmp_task_progress.isok)) {
                                      $(this).css('width', '0%');
                                  } else if (tmp_task_progress.isok == 3) {
                                      $(this).css('width', '100%');
                                  } else if (tmp_task_progress.isok == 0) {
                                      $(this).css('width', '0%');
                                  } else if (tmp_task_progress.isok == 1) {
                                      var tmpwidth = ((tmp_task_progress.progress * 100) / tmp_task_progress.total).toFixed(2) + '%';
                                      $(this).css('width', tmpwidth);
                                  }
                              } else {
                                  $(this).css('width', '0%');
                              }
                          });
                      }
                      api.sendEvent({
                        name : 'setChaptersNum',
                        extra : {
                          'chaptersNum' : chaptersNum,
                          'chaptersNumTotal' : course_detail.chapterNum
                        }
                      })
                      api.sendEvent({
                        name : 'setTasksNum',
                        extra : {
                          'tasksNum' : tasksNum,
                          'tasksNumTotal' : course_detail.taskNum
                        }
                      })
                  }
              });
          }
      }
//获取本章附件
function getChapteFile() {
    if (is_over_file == false) {
        var file_tpl = $('#file_tpl').html();
        var content = doT.template(file_tpl);
        var files = find_extend_file(course_detail, 1);

        //$('#file_ul').html(content(chapter_data.chapterFiles));
        $('#file_ul').html(content(files));
        is_over_file = true; //已加载完毕
    }
    $('#chaAppendix').show().siblings().hide();
}

//获取扩展阅读
function getExtendRead() {
    if (is_over_extend == false) {
        var extend_tpl = $('#extend_tpl').html();
        var content = doT.template(extend_tpl);
        //$('#extend_ul').html(content(course_detail.chapters[chapters_num]));
        var files = find_extend_file(course_detail, 2);

        //$('#extend_ul').html(content(chapter_data.chapterExtends));
        $('#extend_ul').html(content(files));
        is_over_extend = true;
        //已加载完毕
    }
    $('#chaRead').show().siblings().hide();
}

/**
 * 获取课程里所有的任务
 * @param courseDetail
 * @returns {{}}
 */
function find_extend_file(courseDetail, type) {
    var data_arr = courseDetail.chapters;
    for (var i in data_arr) {
        if (data_arr[i].isLeaf == 'false') {
            var child = data_arr[i].children;
            for (var j in child) {
                if (child[j].isLeaf == 'false') {
                    var child2 = child[j].children;
                    for (var k in child2) {
                        var cId = child2[k].chapterId;
                        if (cId == task_info_detail.chapterId) {
                            if (type == 1) {
                                return child2[k].chapterFiles;
                            } else if (type == 2) {
                                return child2[k].chapterExtends;
                            }
                        }
                    }
                } else {
                    var cId = child[j].chapterId;
                    if (cId == task_info_detail.chapterId) {
                        if (type == 1) {
                            return child[j].chapterFiles;
                        } else if (type == 2) {
                            return child[j].chapterExtends;
                        }
                    }
                }
            }
        } else {
            var cId = data_arr[i].chapterId;
            if (cId == task_info_detail.chapterId) {
                if (type == 1) {
                    return data_arr[i].chapterFiles;
                } else if (type == 2) {
                    return data_arr[i].chapterExtends;
                }
            }
        }
    }
}


//点击章节列表(type:1)、本章任务(type:2)、本章附件(type:3)、扩展阅读(type:4)，进行切换
function changeNav(obj, type) {
    if (now_nav_type != type) {
        /*api.showProgress({
         title : '加载中',
         modal : false
         });*/
        //添加、移除样式
        $(obj).addClass('vList-selected');
        $(obj).siblings().removeClass('vList-selected');
        now_nav_type = type;
        //获取内容相应的内容
        if (type == 1) {
            //获取章节任务
            getChapterTask();
        } else if (type == 2) {
            //显示章节列表
            getChapterList();
        } else if (type == 3) {
            //获取本章附件
            getChapteFile();
        } else if (type == 4) {
            //获取扩展阅读
            getExtendRead();
        } else {
            return false;
        }
        api.hideProgress();
    }
}

//查看扩展阅读
function lookExtend(id, url, title) {
    if (isEmpty(url) || isEmpty(title)) {
        api.toast({
            msg: '扩展已失效'
        });
    } else {
        api.openWin({
            name: 'course-url',
            url: 'course-url.html',
            pageParam: { title: title, url: url }, //外链},
            slidBackEnabled: false,
            delay: 200
        });
        return false;
        if (from_page == 'course-test') {
            //如果当前页面是从course-test页面打开的frame，头部不用变，发送监听，打开新frame
            api.sendEvent({
                name: 'change_course_test',
                extra: {
                    type: 'link',
                    title: title,
                    url: url //外链
                }
            });
            api.setFrameAttr({
                name: 'video-menu',
                hidden: true
            });
        } else {
            //如果当前页面是从video页面打开的frame，需要打开一个新的窗口
            var page_param = {
                courseId: courseId, //课程id
                course_detail: course_detail, //课程详情
                chapters_num: chapters_num, //一级章节
                chapters_child_num: chapters_child_num, //二级章节
                child_task_num: child_task_num, //任务
                task_info: task_info, //任务信息
                type: 'link',
                link_title: title,
                link_url: url, //外链
                hasFrame: false
            };
            api.openWin({
                name: 'course-test',
                url: 'course-test.html',
                pageParam: page_param,
                slidBackEnabled: false,
                delay: 200
            });
        }
    }
}
//点击本章任务
function task_event(obj, num, task_id,chapter_id) {
    $api.setStorage("setchapterId",chapter_id);
    task_info = task_arr[task_id].taskInfo; //任务信息
    clearInterval(getStatusTime);
    // 如果要打开新的窗口，则关闭旧窗口
    if ((from_page == 'course-test' && task_info.taskType == 'video') || (from_page == 'video' && task_info.taskType != 'video')) {
        //传递的页面参数
        var page_param = {
            courseId: courseId, //课程id
            course_detail: course_detail, //课程详情
            //study_progress : study_progress,
            task_info: task_info, //任务信息
            type: 'task'
        };
        var downState = $(obj).next().find(".down-progress").attr("type");
        if(downState == 4){
      	   page_param.isFinish = true;
        }else{
      	   page_param.isFinish = false;
        }
        
        //判断当前任务类型
        if (task_info.taskType == 'video') {
            var winName = 'video';
            var winUrl = 'video.html';
        } else {
            var winName = 'course-test';
            var winUrl = 'course-test.html';
            api.sendEvent({
                name: 'close_video_demo'
            });
        }
        api.openWin({
            name: winName,
            url: winUrl,
            reload: true,
            pageParam: page_param,
            slidBackEnabled: false, //iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
            delay: 200
        });
        api.closeWin({
            animation: {
                type: 'flip',
                subType: 'from_left',
                duration: 500
            }
        });
    } else {
        //要传递的数据
        var extraData = {
            //study_progress : study_progress,
            taskId: task_id, //任务信息
            type: 'task'
        };

        if (from_page == 'course-test') {
            api.sendEvent({
                name: 'change_course_test',
                extra: extraData
            });
            api.closeFrame();
        } else if (from_page == 'video' && task_info.taskType == 'video') {
            api.sendEvent({
                name: 'change_video',
                extra: extraData
            });
            api.closeFrame();
        }
    }
}



//判断初始化时章节是否折叠或展开
function isShow(type, leave, chapId, chapId2) {
    var oneChapter_info = course_detail.chapters[study_progress.oneChapterIndex];
    if (leave == 2) {
        if (chapId == oneChapter_info.chapterId) {
            if (type == 'title') {
                return 'open';
            } else {
                return 'is_oking';
            }
        } else {
            if (type == 'title') {
                return '';
            } else {
                return 'is_noing';
            }
        }
    } else if (leave == 3) {
        var twoChapter_info = oneChapter_info.children[study_progress.twoChapterIndex];
        if (chapId2 == twoChapter_info.chapterId) {
            if (type == 'title') {
                return 'open';
            } else {
                return 'is_oking';
            }
        } else {
            if (type == 'title') {
                return '';
            } else {
                return 'is_noing';
            }
        }
    }
}



//点击本章附件，下载文件
function downloadFile(url, type) {
    if (isEmpty(url)) {
        api.toast({
            msg: '文件已过期'
        });
    } else {
        api.showProgress({
            title: "加载中",
            modal: false
        });
        //下载文件
        var file_url = static_url + url;
        var url_arr = file_url.split("/");
        for (var i in url_arr) {
            url_arr[i] = encodeURI(url_arr[i]);
        }
        var new_url = url_arr.join("/");
        api.download({
            url: new_url,
            //savePath: 'fs://caicui/pdf/',//（可选项）存储路径，不传时使用自动创建的路径
            report: true, //（可选项）下载过程是否上报
            cache: false, //（可选项）是否使用本地缓存
            allowResume: true //（可选项）是否允许断点续传
        }, function(ret, err) {
            if (err) {
                api.toast({
                    msg: err.msg
                });
                api.hideProgress();
            } else if (ret) {
                //var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
                if (ret.percent == 100) {
                    api.hideProgress();
                    if (type == 'zip') {
                        /*
                         var obj = api.require('zip');
                         obj.unarchive({
                         file:ret.savePath,
                         password:''
                         },function(ret,err){
                         if(ret.status) {
                         api.alert({msg:'解压成功'});
                         }else{
                         api.alert(err.msg);
                         }
                         });
                         */
                    } else {
                        var obj = api.require('docReader');
                        obj.open({
                            path: ret.savePath
                        });
                    }
                }
            }
        });
    }
}


//关闭当前的页面
function closeThis() {
    if (api.pageParam.from_page == 'video') {
        api.sendEvent({
            name: 'continue_video',
            extra: {
                'times': api.pageParam.times
            }
        });
    }
    //api.setFrameAttr({name:'video-menu',hidden:true});
    api.closeFrame({
        name: 'video-menu'
    });
}
