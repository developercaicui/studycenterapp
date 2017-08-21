/*课程测试题页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 1280) * 100 + 'px';
//变量信息
var courseId;//课程id
var course_detail;//章节课程信息
var last_progress = 0;//当前的进度
var chapter_info;//当前章节详情信息
var task_info = '';//当前任务信息
var task_info_detail;
var task_arr;//所有的任务信息
var knowledgePointExercise;
var exerciseList;
var knowledgeList;
var subjectId;//科目id
var categoryId;//证书id
var chapterId;//章节id
var cacheKnowledgeLevel1Id;
var cacheKnowledgeLevel2Id;
var selectClick = false;//是否选择
var errorNum = 0;//错题数量
var totalTime = 0;//做题时间
var examTime = null;
var last_exercise_nid = 0;

var exam_info = '';//测试题信息
var user_exam = [];//用户答案

var err_num = [];//错误题总数
var uncomplate_num = [];//未完成题总数
var start_time = 0;//开始做题的时间
var is_all_over = false;//页面是否已经加载出来
var swiper;

//测试

// var result = "8a22ecb55b7a030e015b7b2b75d80092,ff8080814f1c162a014f200e6b482543,ff8080814f1c162a014f200e6d542621,ff8080814f1c162a014f200dc58c208c,ff8080814f1c162a014f200e6ccf25f0,ff8080814f1c162a014f200e69d22486,ff8080814f1c162a014f200e6a0524ac,ff8080814f1c162a014f200e6d632626,ff8080814f1c162a014f200e6a4824d8,ff8080814f1c162a014f200dc20a1fab,ff8080814f1c162a014f200dc2031fa9,ff8080814f1c162a014f200dc1f61fa5,ff8080814f1c162a014f200dc1f31fa4,ff8080814f1c162a014f200dc1ef1fa3,ff8080814f1c162a014f200dc1cd1f9a,ff8080814f1c162a014f200dc1c91f99,ff8080814f1c162a014f200dc1c61f98,ff8080814f1c162a014f200dc04e1f1f,ff8080814f1c162a014f200dbf891ed9,ff8080814f73b419014f870049b51bbc,ff8080814f73b419014f870049b81bbe,ff8080814f73b419014f870049ba1bbf,ff8080814f73b419014f870049bb1bc0,ff8080814f73b419014f870049be1bc2,ff8080814f73b419014f870049c21bc4,ff8080814f73b419014f870049c71bc7,ff8080814f73b419014f870049cf1bcc,8a22ecb55b7a030e015b7b2c4ec00094,8a22ecb55b7a030e015b7b3f0f2b009e,8a22ecb55b7a030e015b7b408fad00a0"
// exerciseList = result.split(",");
// var exam_info = [{"id":"ff8080814f73b419014f870049c71bc7","createDate":1441078987000,"modifyDate":1491363470000,"accuracy":0,"answerResolution":"组织战略分析企业行业定位，确定业务组合和识别企业在哪个市场进行竞争","background":null,"context":"[{\"title\":\"描述企业如何实现优异的投资回报的具体计划\",\"isChecked\":false},{\"title\":\"根据五大威胁来分析行业的吸引度：买家力量、供应商力量、竞争者、替代品威胁和新进入者\",\"isChecked\":false},{\"title\":\"企业价值链中的每个活动如何影响成本和差异化的要点\",\"isChecked\":false},{\"title\":\"企业行业定位分析，必要的利弊权衡，组织活动的配称\",\"isChecked\":true}]","exerciseState":"publish","questionTypes":"radio","sn":15105,"title":"企业战略最好地描述为","difficultyId":"ff8080814a7a4010014a7a715a7d00b8","sourceId":"ff8080814f1c162a014f20059e7a16bc","versionId":"ff8080814f73b419014f870049c71bc7","fileName":null,"sheetName":null,"nid":15271}];
// var exam_tpl = $('#exam_tpl').html();
// var content = doT.template(exam_tpl);
// $('#exam_content').html(content(exam_info));
// swiper = new Swiper('.swiper-container', {
//     nextButton : '.swiper-button-next',
//     prevButton : '.swiper-button-prev',
//     spaceBetween : 0,
//     speed:100,
//     // onlyExternal : true,
//     pagination : '.swiper-pagination',
//     paginationClickable : true,
//     paginationBulletRender : function(index, className) {
//         return '<span class="' + className + '" data-exerciseid="'+exerciseList[index]+'">' + (index + 1) + '</span>';
//     },
//     onInit : function(swiper) {
//         $.each($('.course-test-title'), function (k, v) {
//             $(v).find('img').attr('src',static_url+$(v).find('img').attr('src'));
//         });
//         for(var i in knowledgeList){
//         	if(knowledgeList[i].status == "1"){
//         		$('.swiper-pagination-bullet[data-exerciseid='+knowledgeList[i].exercise_id+']').addClass("success");
//         	}else if(knowledgeList[i].status == "2"){
//         		$('.swiper-pagination-bullet[data-exerciseid='+knowledgeList[i].exercise_id+']').addClass("danger");
//         		errorNum++;
//         	}                    	
//         }                    
//         // console.log(JSON.stringify(knowledgeList))
//         $('.swiper-pagination-bullet').eq(15).nextAll().hide();

//         examTime = setInterval(function(){
//         	totalTime++;
//         },1000)
//     },
//     onSlideChangeEnd : function(swiper) {
// 		//保存答题记录
// 		var num = parseInt($('.swiper-pagination-bullet-active').text());
//     	if(selectClick){
//     		saveQuestionRecord(swiper.previousIndex)
//     	}
//         getNidExerciseDetail(exerciseList[swiper.activeIndex]);
//         if(swiper.slides.length>15){
//             if (num > 8) {
//                 $('.swiper-pagination-bullet').show().eq(num - 7).prevAll().hide();
//                 $('.swiper-pagination-bullet').eq(num + 7).nextAll().hide();
//             }else{
//                 $('.swiper-pagination-bullet').show().eq(15).nextAll().hide();
//             }
//         }    
//         //切换测试题时保存学习进度
//         var now_progress = parseInt(swiper.activeIndex) + 1;
//         var total = swiper.slides.length;
//         if (now_progress == total) {
//             var state = 'complate';
//             //任务已完成
//         } else {
//             var state = 'init';
//             //任务未完成
//         }
//         // saveTaskProgress(now_progress, total, state);
//     }

// });
 


function getNidExerciseDetail(exerciseId){
	var exam_tpl = $('#exam_tpl').html();
	var content = doT.template(exam_tpl);
	$('#exam_content').empty();
	selectClick = false;
	api.showProgress({
		title : '加载中',
		modal : false
	});
    ajaxRequest('api/teachsource/examen/getNidExerciseDetail', 'get', {exerciseId:exerciseId}, function(rets, errs) {
        if (rets && rets.state == 'success' && rets.data.length>0) {
        	
        	var exam_infoArr = [];
        	exam_info = rets.data[0];
        	var htmlData = $("<div>");
        	for(var i in knowledgeList){
        		if(knowledgeList[i].exercise_id == exerciseId){
        			htmlData.html(knowledgeList[i].context);
        			rets.data[0].context = htmlData.html().replace(/'/g,'');
        			var contextArr = JSON.parse(rets.data[0].context);
        			for(var i in contextArr){
        				if(typeof(contextArr[i]) == "string"){
	        				contextArr[i] = JSON.parse(contextArr[i]);
	        			}
        				if(contextArr[i].title.indexOf("点击这里编辑")>0){
        					delete  contextArr[i];
        				}
        			}
        			rets.data[0].context = JSON.stringify(contextArr);
        			
        		}
        	}
        	// console.log(JSON.stringify(rets.data[0]))          	
			for(var i in exerciseList){	                
                exam_infoArr.push(rets.data[0]); 	                                           
            }
            $('#exam_content').html(content(exam_infoArr));
            
            api.hideProgress(); 
    	}
    });
    
}

apiready = function() {
	//获取参数
	courseId = api.pageParam.courseId;//课程id
	course_detail = api.pageParam.course_detail;//课程详情
	courseName = course_detail.courseName;//课程名字
    if(!isEmpty(api.pageParam.last_progress)){
        last_progress = api.pageParam.last_progress;//当前的进度
    }
	task_info = api.pageParam.task_info;//任务信息
	//chapter_info = api.pageParam.chapter_info;//任务信息
    task_arr = save_tasks(course_detail);
    task_info_detail = api.pageParam.task_info_detail;
	var examenId = task_info.id;
    knowledgePointExercise = api.pageParam.knowledgePointExercise;

    subjectId = course_detail.subjectId;//科目id
    categoryId = course_detail.categoryId;//证书id
    chapterId = task_info_detail.chapterId;//章节id
    cacheKnowledgeLevel1Id = knowledgePointExercise.knowledge_path_level_one_id;//测试知识点1级id
	cacheKnowledgeLevel2Id = knowledgePointExercise.knowledge_path_level_two_id;//测试知识点2级id

	api.showProgress({
		title : '加载中',
		modal : false
	});
	var params = {
    	knowledge_point_id : knowledgePointExercise.knowledge_point_id,
    	member_id : getstor('memberId')
    }
    ajaxRequest('api/userAction/examen/get_exercise_knowledge_member_status', 'POST',{
    	knowledge_points : knowledgePointExercise.knowledge_point_id,
    	type : "4",
    	member_id : getstor('memberId')
    }, function(data, error) {
    	
        if (data && data.state == 'success') {
        	if(data.data.length>0){
        		last_exercise_nid = data.data[0].last_exercise_nid;
        	}
        	ajaxRequest('api/userAction/examen/get_user_knowledge_point_exercise_list', 'get', params, function(rets, errs) {
		        if (rets && rets.state == 'success') {
		        	knowledgeList = rets.data;
		        	
				    var iframeSite = "http://www.caicui.com/upload/caicui_cache/exercise/"+knowledgePointExercise.exercise_filename;
				    $.get(iframeSite, function(result){

				        exerciseList = result.replace(/\n/g,"").split(",");
				        getNidExerciseDetail(exerciseList[last_exercise_nid]);

				        api.parseTapmode();
				        api.hideProgress();   
				        setTimeout(function(){
				            swiper = new Swiper('.swiper-container', {
				                nextButton : '.swiper-button-next',
				                prevButton : '.swiper-button-prev',
				                spaceBetween : 0,
				                speed:100,
				                initialSlide : last_exercise_nid,
				                // onlyExternal : true,
				                pagination : '.swiper-pagination',
				                paginationClickable : true,
				                paginationBulletRender : function(index, className) {
				                    return '<span class="' + className + '" data-exerciseid="'+exerciseList[index]+'">' + (index + 1) + '</span>';
				                },
				                onInit : function(swiper) {
				                    $.each($('.course-test-title'), function (k, v) {
				                        if($(v).find('img').length>0){
				                            var src = $(v).find('img').attr('src');
				                            var srcSubstr = src.substr(-3);
				                            if(srcSubstr == "jpg" || srcSubstr == "png" || srcSubstr == "gif" || srcSubstr == "svg"){
				                                $(v).find('img').attr('src',static_url+$(v).find('img').attr('src'));
				                            }  
				                        }
                        
				                    });
				                    for(var i in knowledgeList){
				                    	if(knowledgeList[i].status == "1"){
				                    		$('.swiper-pagination-bullet[data-exerciseid='+knowledgeList[i].exercise_id+']').addClass("success");
				                    	}else if(knowledgeList[i].status == "2"){
				                    		$('.swiper-pagination-bullet[data-exerciseid='+knowledgeList[i].exercise_id+']').addClass("danger");
				                    	}                    	
				                    }                    
				                    // console.log(JSON.stringify(knowledgeList))
				                    $('.swiper-pagination-bullet').eq(15).nextAll().hide();

				                    examTime = setInterval(function(){
				                    	totalTime++;
				                    },1000)
				                },
				                onSlideChangeEnd : function(swiper) {
									//保存答题记录
									var num = parseInt($('.swiper-pagination-bullet-active').text());
									
				                	if(selectClick){
				                		saveQuestionRecord(swiper.previousIndex)
				                	}

				                    getNidExerciseDetail(exerciseList[swiper.activeIndex]);
				                   
				                    if(swiper.slides.length>15){
				                        if (num > 8) {
				                            $('.swiper-pagination-bullet').show().eq(num - 7).prevAll().hide();
				                            $('.swiper-pagination-bullet').eq(num + 7).nextAll().hide();
				                        }else{
				                            $('.swiper-pagination-bullet').show().eq(15).nextAll().hide();
				                        }
				                    }
				                    //切换测试题时保存学习进度
				                    var now_progress = parseInt(swiper.activeIndex) + 1;
				                    var total = swiper.slides.length;
				                    if (now_progress == total) {
				                        var state = 'complate';
				                        //任务已完成
				                    } else {
				                        var state = 'init';
				                        //任务未完成
				                    }
				                    // saveTaskProgress(now_progress, total, state);
				                }

				            });
				            //根据任务进度，判断默认从第几页开始
				            if (!isEmpty(last_progress) && last_progress > 1) {
				                var tmpSlide = last_progress;
				                if (tmpSlide > 1) {
				                    swiper.slideTo(tmpSlide - 1, 1000, false);
				                }
				            }
				            is_all_over = true;
				            //保存任务进度
				            var now_progress = parseInt(swiper.activeIndex) + 1;
				            var total = swiper.slides.length;
				            if (now_progress == total) {
				                var state = 'complate';
				                //任务已完成
				            } else {
				                var state = 'init';
				                //任务未完成
				            }
				            // saveTaskProgress(now_progress, total, state);
				        },1000)
				    });
				}
		    });

    	}else{
    		api.toast({
                  msg: "加载失败，请返回重试！"
            });
    	}
    });
    


	api.addEventListener({
	      name: 'close-correction2'
	  }, function(ret) {
	  	setTimeout(function(){
	  		for(var i in knowledgeList){
	        	if(knowledgeList[i].status == "1"){
	        		$('.swiper-pagination-bullet[data-exerciseid='+knowledgeList[i].exercise_id+']').addClass("success");
	        	}else if(knowledgeList[i].status == "2"){
	        		$('.swiper-pagination-bullet[data-exerciseid='+knowledgeList[i].exercise_id+']').addClass("danger");
	        	}                    	
	        }                    
	        // console.log(JSON.stringify(knowledgeList))
	        $('.swiper-pagination-bullet').eq(15).nextAll().hide();
	  	},200)
	  })
};

//保存答题记录
function saveQuestionRecord(num){
	var context = [],status = 2,examenTotalNum = knowledgePointExercise.exercise_count;
	$(".swiper-slide").eq(num).find(".selector-detail").each(function(key,val){
		var selectDetail = {
			"title": $(this).find("p").text(),
			"isChecked":($(this).attr("data-check") == "true" ? true : false)
		}
		if($(this).hasClass("question-selected")){
			selectDetail.myChecked = true;
			if($(this).attr("data-check") == "true"){
				status = 1;
			}
		}else{
			selectDetail.myChecked = false;	
		}
		context.push(selectDetail)
	})
	if(status == "1" || status == 1){
		$('.swiper-pagination-bullet').eq(num).removeClass("danger").addClass("success");
	}else if(status == "2" || status == 2){
		$('.swiper-pagination-bullet').eq(num).removeClass("success").addClass("danger");
	} 
	var errorNum = 0,correctNum = 0;
	$('.swiper-pagination-bullet').each(function(){
		if($(this).hasClass("danger")){
			errorNum++;
		}else if($(this).hasClass("success")){
			correctNum++;
		}
	})
	
	var params = {
		knowledgePointId : knowledgePointExercise.knowledge_point_id,
		exerciseId : exam_info.id,
		memberId : getstor('memberId'),
		context: "'"+JSON.stringify(context)+"'",
		status: status,
		subjectId : subjectId,
		categoryId : categoryId,
		courseId : courseId,
		chapterId : chapterId,
		cacheKnowledgeLevel1Id : cacheKnowledgeLevel1Id,
		cacheKnowledgeLevel2Id : cacheKnowledgeLevel2Id,
		cacheKnowledgePath : cacheKnowledgeLevel1Id+","+cacheKnowledgeLevel2Id,
		progress : knowledgeList.length,
		lastExerciseNid : num,
		errorNum : errorNum,
		totalTime : totalTime,
		examenNum : 0,
		examenName : task_info.title,
		examenTotalNum : examenTotalNum,
		examenType : "knowledge",
		isFinish : 0,
		taskId : task_info.taskId,
		currentProgress : swiper.previousIndex,
		exerciseTitle : exam_info.title,
		correctNum : correctNum
	}
	// console.log(errorNum) 
	// console.log(JSON.stringify(params.context)) 
	// var isPush = true;
	for(var i in knowledgeList){
		if(knowledgeList[i].exercise_id == params.exerciseId){
			// isPush = false;
			knowledgeList[i].context= params.context;
			knowledgeList[i].status= params.status;
			break;
		}else{
			knowledgeList.push({
				"exercise_id":params.exerciseId,
				"context":params.context,
				"status":params.status
			});
		}
	}	
	if(knowledgeList.length<1){
		knowledgeList.push({
			"exercise_id":params.exerciseId,
			"context":params.context,
			"status":params.status
		});
	}
	// if(isPush){
	// 	knowledgeList.push({"exercise_id":params.exerciseId,"context":params.context});
	// }
	ajaxRequest('api/userAction/examen/setMemberExerciseState', 'POST', params, function(rets, errs) {
        if (rets && rets.state == 'success') {
        	
    	}else{
    		// api.toast({
      //             msg: rets.msg
      //         });
    	}
    });


    var tmp_progress = errorNum+correctNum;
    
    var total = examenTotalNum;
    if (total <= tmp_progress) {
        var state = 'complate';
    } else {
        var state = 'init';
    }
    saveTaskProgress(tmp_progress, total, state);
}

function saveTaskProgress(now_progress, total, state) {
  
    var videoData = {
        now_progress: now_progress,
        total: total,
        state: state,
        task_info: task_info,
        task_info_detail: task_info_detail,
        course_detail: course_detail
    };
   
    $api.setStorage('saveTaskProgress', videoData);
   
    var jsfun = "DosaveTaskProgress();";
    api.execScript({
        name: 'root',
        script: jsfun
    });

    //数据库与服务器之间的同步

}
//数字转成ABC，用于选择题的选项编号
function numToAbc(num) {
	var Abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
	return Abc[num];
}

//点击查看试题解析
function showAnalysis(obj, num) {
	//选择题要判断用户的答案是否正确，其他题只要做了就算正确
	var questionInfo = exam_info;
	//当前这道题的信息
	var examType = questionInfo['questionTypes'];
	//测试题类型
	var correct_res = '';
	//正确答案
	var error_res = '';
	//用户答案
	var result = '';
	if (examType == 'radio' || examType == 'checkbox') {
		//单选和多选的题型
		var ele_obj = $(obj).parent().prev('.exam-yf').find('.selector-detail');
		ele_obj.each(function(k, v) {
			var temp_check = $(this).data('check');
			if (temp_check == false) {
				if ($(this).hasClass('question-selected')) {
					error_res += numToAbc(k);
				}
			} else {
				correct_res += numToAbc(k);
				if (!$(this).hasClass('question-selected')) {
					error_res += numToAbc(k);
				}
			}
		});
		if (error_res != '') {
			result = '正确答案是 ' + correct_res + ',回答错误';
		} else {
			result = '正确答案是 ' + correct_res + ',回答正确';
		}
	} else if (examType == 'blank') {
		//单个填空
		var tempval = $.trim($(obj).parent().prev('.exam-yf').find('input').val());
		if (tempval == '') {
			result = '回答错误';
		} else {
			result = '回答正确';
		}
	} else if (examType == 'question') {
		//问答
		var tempval = $.trim($(obj).parent().prev('.exam-yf').find('textarea').val());
		if (tempval == '') {
			result = '回答错误';
		}
	}
	$(obj).parent().find('.showResult').html(result);
	$(obj).toggleClass('open');
	$(obj).next('.answer-analysis-cont').toggle();

	//答案上升到可见区域
	var h = $(document).height()-$(window).height();
    $(document).scrollTop(h);
	
}

//用户选择单选试题选项
function select_radio(obj, num, res) {
	$(obj).addClass('question-selected');
	$(obj).siblings().removeClass('question-selected');
	selectClick = true;
	if((knowledgePointExercise.exercise_count-1) == swiper.activeIndex){
		saveQuestionRecord(swiper.activeIndex)
	}
}

//用户选择多选试题选项
function select_checkbox(obj, num, res) {
	if ($(obj).hasClass('question-selected')) {
		$(obj).removeClass('question-selected');
	} else {
		$(obj).addClass('question-selected');
	}
	selectClick = true;
	if((knowledgePointExercise.exercise_count-1) == swiper.activeIndex){
		saveQuestionRecord(swiper.activeIndex)
	}
}

//矩阵选择题，点击小圆圈选中和取消
function select_matrix(obj) {
	if ($(obj).find('.circle_green').hasClass('hide')) {
		$(obj).find('.circle_green').removeClass('hide');
	} else {
		$(obj).find('.circle_green').addClass('hide');
	}
}

//交卷
function jiaojuan() {
	if (is_all_over == false) {
		api.toast({
			msg : '请等待页面加载完'
		});
		return false;
	}
	//选择题需要判断是否正确，填空和问答只要填写就算正确，多任务题暂时没做处理
	err_num = [];
    uncomplate_num = [];
	//记录错题的题号
    var i = 0;//用于记录错题的题号
    var j = 0;//用于记录未做的题号
	var user_results = [];
	//用户的答案
	var exam_detail = exam_info.items;
    //试题详情
    $('.exam-yf').each(function(k, v) {
        var tmp_exam_child = exam_detail[k];
        //api.alert({msg:tmp_exam_child});return;
        var examNum = $(this).data('num');
        //测试题题号
        var examType = $(this).data('type');
        if (isEmpty(tmp_exam_child)) {
            return;
        }
        if (isEmpty(tmp_exam_child.title)) {
            var tmp_examTitle = '';
        } else {
            var tmp_examTitle = tmp_exam_child.title;
        }
        //测试题类型
        if (examType == 'radio' || examType == 'checkbox') {
            //api.alert({msg:tmp_exam_child});return;
            var tmp_data = {
                "title" : tmp_examTitle,
                "type" : tmp_exam_child.questionTypes,
                "data" : []
            };
            //单选和多选的题型
            var ele_obj = $(this).find('.selector-detail');
            //(1)先判断是否做了这道题
            var isComplated = false;//默认未做题
            ele_obj.each(function(kk, vv) {
                if ($(this).hasClass('question-selected')) {
                    isComplated = true;
                }
            });
            //(2)如果做了,再判断是否正确
            if(isComplated == true){
                var isRight = true;
                ele_obj.each(function(kk, vv) {
                    //记录答案
                    if ($(this).hasClass('question-selected')) {
                        var tmp_answer = {
                            "title" : JSON.parse(tmp_exam_child.context)[kk].title,
                            "isChecked" : true
                        };
                    } else {
                        var tmp_answer = {
                            "title" : JSON.parse(tmp_exam_child.context)[kk].title,
                            "isChecked" : false
                        };
                    }
                    tmp_data.data.push(tmp_answer);
                    //判断是否正确
                    var temp_check = $(this).data('check');
                    if (temp_check == false) {
                        if ($(this).hasClass('question-selected')) {
                            isRight = 'wrong';
                        }
                    } else {
                        if (!$(this).hasClass('question-selected')) {
                            isRight = 'wrong';
                        }
                    }
                });
                if (isRight == 'wrong') {
                    err_num[i] = parseInt(examNum) + 1;
                    i++;
                }
            }else{
                uncomplate_num[j] = parseInt(examNum) + 1;
                j++;
                isRight = 'uncomplate';
            }

            var tmp_arr = {
                "exerciseId" : tmp_exam_child.id, //试题的id
                "isRight" : isRight, //标记用户该题答案正确与否:  right－正确|wrong－错误|unknown－正确
                "result" : tmp_data
            };
            user_results.push(tmp_arr);
        } else if (examType == 'blank') {
            //单个填空
            var tempval = $.trim($(this).find('input').val());
            var isRight = 'unknown';
            if (tempval == '') {
                err_num[i] = parseInt(examNum) + 1;
                i++;
                isRight = 'wrong';
            }
            var tmp_arr = {
                "exerciseId" : tmp_exam_child.id, //试题的id
                "isRight" : isRight, //标记用户该题答案正确与否:  right－正确|wrong－错误|unknown－正确
                "result" : [{
                    "title" : tmp_examTitle,
                    "type" : "blank",
                    "data" : [{
                        "blank" : tempval
                    }]
                }]
            };
            user_results.push(tmp_arr);
        } else if (examType == 'matrixBlank') {
            //矩形填空
            //$(this).find('input').each(function() {
            //	if ($.trim($(this).val()) == '') {
            //		err_num[i] = parseInt(examNum) + 1;
            //		i++;
            //		return false;
            //	}
            //})
            var temp_this_items = [];
            var isRight = 'unknown';
            $(this).find('td').each(function() {
                var tmp_X = $(this).attr('data-x');
                var tmp_Y = $(this).attr('data-y');
                var tmp_islabel = $(this).attr('data-islable');
                if (tmp_islabel == 'false') {
                    var tmp_val = $.trim($(this).find('input').val());
                    var tmp_title = '';
                    if (tmp_val == '') {
                        isRight = 'wrong';
                    }
                } else {
                    var tmp_val = '';
                    var tmp_title = $(this).text();
                }
                temp_this_items.push({
                    "x" : tmp_X,
                    "y" : tmp_Y,
                    "title" : tmp_title,
                    "isChecked" : false,
                    "isLable" : tmp_islabel,
                    "blank" : tmp_val
                });
            });
            var tmp_arr = {
                "exerciseId" : tmp_exam_child.id, //试题的id
                "isRight" : isRight, //标记用户该题答案正确与否:  right－正确|wrong－错误|unknown－正确
                "result" : [{
                    "title" : tmp_examTitle,
                    "type" : "matrixBlank",
                    "data" : [{
                        "rows" : JSON.parse(tmp_exam_child.context).rows,
                        "cols" : JSON.parse(tmp_exam_child.context).cols,
                        "items" : temp_this_items
                    }]
                }]
            };
            user_results.push(tmp_arr);
            if (isRight == 'wrong') {
                err_num[i] = parseInt(examNum) + 1;
                i++;
            }
        } else if (examType == 'question') {
            //问答
            var tempval = $.trim($(this).find('textarea').val());
            var isRight = 'unknown';
            if (tempval == '') {
                err_num[i] = parseInt(examNum) + 1;
                i++;
                isRight = 'wrong';
            }
            var tmp_arr = {
                "exerciseId" : tmp_exam_child.id, //试题的id
                "isRight" : isRight, //标记用户该题答案正确与否:  right－正确|wrong－错误|unknown－正确
                "result" : [{
                    "title" : tmp_examTitle,
                    "type" : "question",
                    "data" : [{
                        "blank" : tempval
                    }]
                }]
            };
            user_results.push(tmp_arr);
        } else if (examType == 'matrixRadio' || examType == 'matrixCheckbox') {
            //矩形单选和矩形多选的题型
            var temp_this_items = [];
            var isRight = 'unknown';
            $(this).find('td').each(function() {
                var tmp_X = $(this).attr('data-x');
                var tmp_Y = $(this).attr('data-y');
                var tmp_islabel = $(this).attr('data-islable');
                if (tmp_islabel == 'false') {
                    var circle_green = $(this).find('.circle_green');
                    var temp_check = circle_green.data('check');
                    if (temp_check == true) {
                        if (circle_green.hasClass('hide')) {
                            isRight = 'wrong';
                        }
                    } else {
                        if (!circle_green.hasClass('hide')) {
                            isRight = 'wrong';
                        }
                    }

                    if (circle_green.hasClass('hide')) {
                        var tmp_ischeck = false;
                    } else {
                        var tmp_ischeck = true;
                    }
                    var tmp_title = '';
                } else {
                    var tmp_ischeck = false;
                    var tmp_title = $(this).text();
                }
                temp_this_items.push({
                    "x" : tmp_X,
                    "y" : tmp_Y,
                    "title" : tmp_title,
                    "isChecked" : tmp_ischeck,
                    "isLable" : tmp_islabel,
                    "blank" : ''
                });
            });
            var tmp_arr = {
                "exerciseId" : tmp_exam_child.id, //试题的id
                "isRight" : isRight, //标记用户该题答案正确与否:  right－正确|wrong－错误|unknown－正确
                "result" : [{
                    "title" : tmp_examTitle,
                    "type" : examType,
                    "data" : [{
                        "rows" : JSON.parse(tmp_exam_child.context).rows,
                        "cols" : JSON.parse(tmp_exam_child.context).cols,
                        "items" : temp_this_items
                    }]
                }]
            };
            user_results.push(tmp_arr);
            if (isRight == 'wrong') {
                err_num[i] = parseInt(examNum) + 1;
                i++;
            }
        } else if (examType == 'multiTask ') {
            //多任务
            var tmp_arr = {
                "exerciseId" : tmp_exam_child.id, //试题的id
                "isRight" : 'unknown', //标记用户该题答案正确与否:  right－正确|wrong－错误|unknown－正确
                "result" : [{
                    "title" : tmp_examTitle,
                    "type" : 'multiTask',
                    "data" : []
                }]
            };
            user_results.push(tmp_arr);
        }
    });
        //显示做题结果的弹窗
    $('#result_question').html("本次测试共" + exam_info.totalCount + "道题，<span>" + parseInt(parseInt(err_num.length)+parseInt(uncomplate_num.length))+ "</span>题错误");
    $('.qesition_complete').removeClass('none');

    //展开全部解析

    $('.answer-analysis-btn').removeClass('open');
    $('.answer-analysis-cont').hide();

    $('.answer-analysis-btn').each(function(){
        showAnalysis(this, $(this).index());
    });

    //错误题的页码变红色
    if (!isEmpty(err_num)) {
        $('#footerTest').find('.swiper-pagination-bullet').removeClass('danger').removeClass('success');
        $('#footerTest').find('.swiper-pagination-bullet').each(function() {
            var page_num = $(this).text();
            var temp_this = $(this);
            $.each(err_num, function(kk, vv) {
                if (vv == page_num) {
                    temp_this.addClass('danger');
                }else{
                    temp_this.addClass('success');
                }
            });
        });
    }
    //没做的题不变色
    if (!isEmpty(uncomplate_num)) {
        $('#footerTest').find('.swiper-pagination-bullet').each(function() {
            var page_num = $(this).text();
            var temp_this = $(this);
            $.each(uncomplate_num, function(kk, vv) {
                if (vv == page_num) {
                    temp_this.addClass('danger');
                    temp_this.removeClass('success');
                   // temp_this.removeClass('danger');
                   // temp_this.removeClass('success');
                }
            });
        });
    }
	if (start_time != 0) {
		var now_times = Date.parse(new Date()) / 1000;
		var before_times = Date.parse(new Date(start_time)) / 1000;
	} else {
		api.toast({
			msg : '请等待试题加载完'
		});
		return false;
	}
	//提交试卷
	var post_param = {
		token : $api.getStorage('token'), //必须，
		examId : task_info.id, //必须，测试试卷id	ff8080814fa389ac014fa6cc16eb043f
		startTime : start_time, //必须，测试开始时间(yyyy-MM-dd HH:mm:ss)	2015-10-24 13:51:45
		consumeTime : now_times - before_times, //必须，测试耗时(单位:秒)	120
		content : user_results	//必须，测试结果内容,详见备注
	};
	ajaxRequest('api/v2/exam/submit', 'post', post_param, function(ret, err) {//008.008提交练习题(测试结果)
		if (ret && ret.state == 'success') {

		}
		//api.alert({msg:ret});return;

	})
}

//再做一次
function again_task() {
    var  _ss;
    //如果有错题，跳转到第一个错题页
    if (err_num.length > 0 || uncomplate_num.length > 0) {
        if(isEmpty(uncomplate_num)){

            _ss = err_num[0] - 1

        }else if(isEmpty(err_num)){

            _ss = uncomplate_num[0] - 1

        }else if (err_num[0]  > uncomplate_num[0] ){

            _ss = uncomplate_num[0] - 1

        }else{

            _ss = err_num[0] - 1

        }
        swiper.slideTo(_ss, 1000, false);
    } else {
        //没有错题，则跳转到第一页

        swiper.slideTo(0, 1000, false);
    }
    $('.qesition_complete').addClass('none');
    //隐藏答题结果弹窗
}

//下个任务
function next_task() {
    var flag = false;
    var is_find = false;
    for(var i in task_arr){
        if(flag==true){
            if(!isEmpty(task_arr[i]) && !isEmpty(task_arr[i].taskInfo)){
                task_info = task_arr[i].taskInfo;
                task_info_detail = task_arr[i];
                exeNewTask();//执行新任务
                is_find = true;
            }
            break;
        }else{
            if(i==task_info.taskId){
                flag = true;
            }
        }
    }
    if(!is_find){
        api.toast({
            msg : '没有更多任务啦',
            location : 'middle'
        });
    }
}

//执行新任务
function exeNewTask() {
	//判断当前任务类型
	if (task_info.taskType == 'video') {
		//跳转到播放页面
        //api.closeFrame({name:'video-menu'});
        //api.closeWin({name:'video'});
		api.openWin({
			name : 'video',
			url : 'video.html',
			delay : 200,
			slidBackEnabled : false,
            reload : true,
			pageParam : {
				from : 'course-test',
				courseId : courseId,
				course_detail : course_detail,
				last_progress : 0,
				task_info : task_info
			}
		});
	}else{
		//如果为测试题的头部
		api.openWin({
			name : 'course-test',
			url : 'course-test.html',
			reload : true,
			pageParam : {
				name : 'video-exam',
                last_progress : 0,
				courseId : courseId,
				course_detail : course_detail,
				task_info : task_info,
				from : 'course-test'
			},
			delay : 200
		});
	}
}


//笔记
function createNotes() {
	if (is_all_over == false) {
		api.toast({
			msg : '请等待页面加载完'
		});
		return false;
	}
	//打开横屏的创建笔记页面
	api.openWin({
		name : 'create-notes',
		url : 'create-notes.html',
		delay : 200,
		pageParam : {
			//下个页面要用到的一些参数
			courseId : courseId,
			course_detail : course_detail,
			task_info : task_info,
			progress : parseInt(swiper.activeIndex) + 1,
			times : parseInt(swiper.activeIndex) + 1,
            task_info_detail :task_info_detail
		}
	});
}

//提问
function createQuestion() {
	if (is_all_over == false) {
		api.toast({
			msg : '请等待页面加载完'
		});
		return false;
	}
	api.openWin({
		name : 'create-question',
		url : 'create-question.html',
		delay : 200,
		pageParam : {
			//下个页面要用到的一些参数
			courseId : courseId,
			course_detail : course_detail,
			//study_progress : study_progress,
			task_info : task_info,
			progress : parseInt(swiper.activeIndex) + 1,
			times : parseInt(swiper.activeIndex) + 1,
            task_info_detail : task_info_detail
		}
	});
}
//纠错
function jiucuo() {
    //横屏切换到竖屏
    api.setScreenOrientation({
        orientation: 'portrait_up'
    });
    
    api.openFrame({
        name: 'error-correction2',
        url: 'error-correction2.html',
        delay: 200,
        pageParam: {
            //下个页面要用到的一些参数
            courseId: courseId, //课程id
            course_detail: course_detail, //课程详情
            progress: parseInt(swiper.activeIndex) + 1, //观看时间进度
            //study_progress : study_progress,//任务学习的进度
            task_info: task_info,
            task_info_detail: task_info_detail,
            data_exercise_id : exam_info.id,
            exam_info : exam_info
                //chapter_info : chapter_info
        }
    });
}

//保存任务进度
//function saveTaskProgress(now_progress, total, state) {
//	var user_nickname = get_loc_val('mine', 'nickName');
//	var user_token = $api.getStorage('token');
//	var user_memberId = get_loc_val('mine', 'memberId');
//	var post_param = {
//		memberId : user_memberId, //必须，用户id	ff8080815065f95a01506627ad4c0007
//		progress : now_progress, //必须，当前进度值，视频为秒，试卷为题数量，文档为页码	5
//		taskId : task_info.taskId, //必须，任务id	1
//		chapterId : task_info_detail.chapterId, //必须，章节id	chapterId
//		courseId : course_detail.courseId, //必须，课程id	ff808081486933e6014889882d9c0590
//		taskName : task_info.title, //必须，任务名称	taskName
//		chapterName : task_info_detail.chapterName, //必须，章节名称	chapterName
//		courseName : course_detail.courseName, //必须，课程名称	courseName
//		total : total, //必须，任务总长度	48
//		subjectId : course_detail.subjectId, //必须，科目id	ff808081473905e7014762542d940078
//		categoryId : course_detail.categoryId, //必须，证书id	ff808081473905e701475cd3c2080001
//		token : user_token, //必须，用户token	144594636417159iPhoneCourse
//		memberName : user_nickname, //必须，用户昵称	zhangxiaoyu01
//		state : state//必须，进度状态默认init，完成：complate	complate
//	};
//	ajaxRequest('api/v2.1/chapter/taskProgress', 'post', post_param, function(ret, err) {//008.024保存任务进度日志（new）tested
//		if (ret && ret.state == 'success') {
//
//		}
//	})
//}

/*点击切换回到顶部*/
window.onload = function() {
	$('.swiper-button-next,.swiper-pagination-bullet,.swiper-button-prev').on('click', function() {
		$('body').scrollTop(0);
	});
    $('.swiper-pagination').on('click', function() {
        $('.qesition_complete').addClass('none');
    });
};

//获取当前的日期时间,返回格式:'2015-10-24 13:51:45'
function get_now_dates() {
	var date_obj = new Date();
	var Year = date_obj.getFullYear();
	var Month = date_obj.getMonth() + 1 < 10 ? '0' + (date_obj.getMonth() + 1) : date_obj.getMonth() + 1;
	var Day = date_obj.getDate();
	var hour = date_obj.getHours();
	var minute = date_obj.getMinutes();
	var second = date_obj.getSeconds();
	return Year + '-' + Month + '-' + Day + ' ' + hour + ':' + minute + ':' + second;
}

function get_mySelect(data){
	if(data == 'undefined' || data == 'false'){
		return ""
	}else{
		return "question-selected"
	}
}