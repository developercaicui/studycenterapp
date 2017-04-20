/*course-studying-f页面js*/
document.documentElement.style.fontSize = (document.documentElement.clientWidth / 640) * 100 + 'px';
//定义变量
var currentPage = 1;
var pageSize = 1000;
var total = 0;


//  var data={
//"data" : {
//  "total" : 5,
//  "courselist" : [ {
//    "categoryIndex" : 15,
//    "taskTotal" : "61",
//    "isU" : 0,
//    "courseBkImage" : "/upload/201508/5d3b49716c3d4b8a870051d55f7a5134.jpg",
//    "categoryId" : "ff8080814997fb36014998b6ca0804ef",
//    "courseId" : "ff8080814eaf7474014eb44df2160843",
//    "outline" : "",
//    "teacherName" : "财务英语明星讲师团",
//    "orderID_item_id" : "8a22ecb556ff11d00157213cf46c00d6",
//    "lock_date" : null,
//    "categoryName" : "CMA 英文",
//    "subjectName" : "CMA 财务英语基础课",
//    "courseIndex" : 10,
//    "expirationTime" : 1495526316,
//    "subjectID" : "ff8080814f3eb9ed014f48f2a7461389",
//    "lock_status" : 0,
//    "teacherImage" : "/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png",
//    "versionId" : "ff8080814eaf7474014eb44df2160843",
//    "teacherHonor" : "",
//    "subjectIndex" : 0,
//    "courseSource" : "zhongbo",
//    "availability" : "",
//    "courseName" : "CMA 财务英语基础课"
//  }, {
//    "categoryIndex" : 10,
//    "taskTotal" : "258",
//    "isU" : 0,
//    "courseBkImage" : "/upload/201604/f57ba6cd71ae40e8b26309ad758acfff.jpg",
//    "categoryId" : "ff808081486933e601489c4662f60851",
//    "courseId" : "8a22ecb5545a87e801545af5048c0006",
//    "outline" : "",
//    "teacherName" : "QiQi Wu",
//    "orderID_item_id" : "CC1B9893DE86E61180FBD42F60D012AB",
//    "lock_date" : null,
//    "categoryName" : "CMA中文",
//    "subjectName" : "CMA 中文 Part-1",
//    "courseIndex" : 140,
//    "expirationTime" : 1503574622,
//    "subjectID" : "ff808081486933e601489c799f0f0868",
//    "lock_status" : 0,
//    "teacherImage" : "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//    "versionId" : "ff808081486933e601489c867448086a",
//    "teacherHonor" : "吴奇奇",
//    "subjectIndex" : 50,
//    "courseSource" : "zhongbo",
//    "availability" : "CMA Part I 中文 基础课,讲义有更新，更新内容：第2章 第1节 知识点3、第2章 第2节 知识点3、第3章 第1节 知识点2、第3章 第1节 知识点4、第5章 第2节 知识点3<br />\r\n<br />",
//    "courseName" : "CMA Part I 中文 基础课"
//  }, {
//    "categoryIndex" : 10,
//    "taskTotal" : "21",
//    "isU" : 0,
//    "courseBkImage" : "/upload/201604/92da0abdac4a45f5b46f9546ade771ac.jpg",
//    "categoryId" : "ff808081486933e601489c4662f60851",
//    "courseId" : "8a22ecb553eab1280153f36f380a007f",
//    "outline" : "",
//    "teacherName" : "QiQi Wu",
//    "orderID_item_id" : "CB1B9893DE86E61180FBD42F60D012AB",
//    "lock_date" : null,
//    "categoryName" : "CMA中文",
//    "subjectName" : "CMA 中文 Part-1",
//    "courseIndex" : 130,
//    "expirationTime" : 1499412100,
//    "subjectID" : "ff808081486933e601489c799f0f0868",
//    "lock_status" : 0,
//    "teacherImage" : "/upload/201606/09c9342818e24393a970aa93d25b9a4d.png",
//    "versionId" : "ff808081491181a3014917d1bec90762",
//    "teacherHonor" : "吴奇奇",
//    "subjectIndex" : 50,
//    "courseSource" : "zhongbo",
//    "availability" : "<p>\r\n\tCMA P1 中文 前导讲义有更新，更新章节：\r\n</p>\r\n<p>\r\n\t第1章-第1节-知识点1\r\n</p>\r\n<p>\r\n\t<span style=\"line-height:1.5;\">第1章-第2节-知识点2</span> \r\n</p>\r\n第3章-第1节-知识点1<br />",
//    "courseName" : "CMA Part I 中文 前导"
//  }, {
//    "categoryIndex" : 23,
//    "taskTotal" : "39",
//    "isU" : 0,
//    "courseBkImage" : "/upload/201607/b85ecf8ed7f54453938b1c900b0c8784.jpg",
//    "categoryId" : "8a22ecb5537864ee015378fa05a10001",
//    "courseId" : "8a22ecb5537864ee01537957a34f0016",
//    "outline" : "",
//    "teacherName" : "FRM 明星讲师团",
//    "orderID_item_id" : "8a22ecb556ff11d0015721392f8800ce",
//    "lock_date" : null,
//    "categoryName" : "FRM",
//    "subjectName" : "FRM Part I",
//    "courseIndex" : 1,
//    "expirationTime" : 1498466282,
//    "subjectID" : "8a22ecb5537864ee01537901cba30002",
//    "lock_status" : 0,
//    "teacherImage" : "/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png",
//    "versionId" : "8a22ecb5537864ee01537957a34f0016",
//    "teacherHonor" : "程黄维 汪庆亚 Jacky",
//    "subjectIndex" : 10,
//    "courseSource" : "zhongbo",
//    "availability" : "",
//    "courseName" : "FRM Part I 前导课"
//  }, {
//    "categoryIndex" : 100,
//    "taskTotal" : "47",
//    "isU" : 2,
//    "courseBkImage" : "/upload/201512/3421d9597f9044b785e5138665fec42e.jpg",
//    "categoryId" : "8a22ecb551cf56cb0151d2152b5c0252",
//    "courseId" : "8a22ecb551cf56cb0151d24140aa028a",
//    "outline" : "",
//    "teacherName" : "OBU 明星讲师团",
//    "orderID_item_id" : "8a22ecb55541a8f7015552b7d07f0083",
//    "lock_date" : null,
//    "categoryName" : "OBU",
//    "subjectName" : "OBU 论文提高课",
//    "courseIndex" : 2,
//    "expirationTime" : 1503485114,
//    "subjectID" : "8a22ecb551f17b3e0151f1e161900125",
//    "lock_status" : 0,
//    "teacherImage" : "/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png",
//    "versionId" : "8a22ecb551cf56cb0151d24140aa028a",
//    "teacherHonor" : "孙志远、贵荣广、多年OBU辅导经验",
//    "subjectIndex" : 50,
//    "courseSource" : "zhongbo",
//    "availability" : "",
//    "courseName" : "OBU 论文提高课"
//  } ],
//  "pageNo" : 0,
//  "pageSize" : 999
//},
//"state" : "success",
//"msg" : ""
//};
//
//
//	var stooges = data.data.courselist;
//	var categoryIdArr = [];
//	for(var i=0;i<stooges.length;i++){
//		if(categoryIdArr && categoryIdArr.length){
//			var isPush = true;
//			for(var j=0;j<categoryIdArr.length;j++){
//				if(stooges[i].categoryId == categoryIdArr[j].categoryId){
//					isPush = false;
//				}
//			}
//			if(isPush){
//				categoryIdArr.push({
//					categoryId :　stooges[i].categoryId,
//					categoryName : stooges[i].categoryName,
//					courseLists : []
//				})
//			}
//		}else{
//			categoryIdArr.push({
//				categoryId :　stooges[i].categoryId,
//				categoryName : stooges[i].categoryName,
//				courseLists : []
//			})
//		}
//		
//	}
//	
//	var courseLists = [];
//	for(var i=0;i<categoryIdArr.length;i++){
//		for(var j=0;j<stooges.length;j++){
//			if(categoryIdArr[i].categoryId == stooges[j].categoryId){
//				categoryIdArr[i].courseLists.push(stooges[j]);
//			}
//		}
//	}
//	console.log(categoryIdArr);
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
						if(stooges[i].categoryId == categoryIdArr[j].categoryId){
							isPush = false;
						}
					}
					if(isPush){
						categoryIdArr.push({
							categoryId :　stooges[i].categoryId,
							categoryName : stooges[i].categoryName,
							subjectName : stooges[i].subjectName,
							courseLists : []
						})
					}
				}else{
					categoryIdArr.push({
						categoryId :　stooges[i].categoryId,
						categoryName : stooges[i].categoryName,
						subjectName : stooges[i].subjectName,
						courseLists : []
					})
				}
				
			}
			
			var courseLists = [];
			for(var i=0;i<categoryIdArr.length;i++){
				for(var j=0;j<stooges.length;j++){
					if(categoryIdArr[i].categoryId == stooges[j].categoryId){
						categoryIdArr[i].courseLists.push(stooges[j]);
					}
				}
			}
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