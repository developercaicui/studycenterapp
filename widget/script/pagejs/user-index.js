var is_debug = false;
function CourseDetail(co, ch, su, ca, cn,chapterName,subjectName,categoryName) {
    var course_detail = {};
    course_detail.chapterId = ch;
    course_detail.courseId = co;
    course_detail.subjectId = su;
    course_detail.categoryId = ca;
    course_detail.courseName = cn;
    course_detail.chapterName = chapterName;
    course_detail.subjectName = subjectName;
    course_detail.categoryName = categoryName;
    $api.setStorage('Course_info', course_detail);
    //var detail = {};
    //detail.course_id = co;
    ////课程id
    //detail.charpterid = ch;
    ////章节id
    //detail.courseName = cn;
    ////课程名称
    api.openWin({
        name : 'course-studying-top',
        url : 'course-studying-top.html',
        slidBackEnabled : false,
        pageParam:course_detail,
        reload : true
    });
}
function openApp(url) {
		if(isEmpty(url)){
			return false;
		}
		if (api.systemType == 'android') {
            api.openApp({
	            androidPkg : 'android.intent.action.VIEW',
	            mimeType : 'text/html',
	            uri : url
	        }, function(ret, err) {
	            
	        });
        } else if(api.systemType == 'ios') {
            api.openApp({
	            iosUrl :url 
	        }, function(ret, err) {
	            
	        });
        }
        
}
function get_line_process() {
    $('ul.porB').each(function() {
        var _s = $(this).find('.progressPro');
        var _v = parseInt($(this).find('.progressBcount').text());
        setTimeout(function() {
            _s.width(_v + '%')
        }, 300);
        if (_v == 0) {
            $(this).find('.progressBcount').css('background', '#999')
        }
    })
}

function get_circle(color) {
    //一个圆环进度
    var poverLef = document.querySelector('.user-index-pover-lef');
    var povCanvas = document.createElement('canvas');
    poverLef.appendChild(povCanvas);
    var clientWidth = document.documentElement.clientWidth;
    var povCanvasW = Math.floor(clientWidth * 242 / 720);
    povCanvas.width = povCanvasW;
    povCanvas.height = povCanvasW;

    function drawBg(x, y, radius, startPoint, endPoint, lineWidth, lineColor, lineStyle) {
        if (povCanvas.getContext) {
            var ctx = povCanvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(x, y, radius, startPoint, endPoint);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.lineCap = lineStyle;
            ctx.stroke();
            ctx.closePath();
        }
    }
    drawBg(povCanvasW / 2, povCanvasW / 2, povCanvasW / 2.1, 0, Math.PI * 2, 5, '#e5e5e5');
    var ringBcount = document.querySelector('.ringBcount');
    var ringBcountEnd = Number(ringBcount.innerHTML);
    var ringStartBcont = 0;

    function ringStart() {
        ringStartBcont += 1;
        drawBg(povCanvasW / 2, povCanvasW / 2, povCanvasW / 2.1, Math.PI * 2 * ((ringStartBcont - 1) / 100), Math.PI * 2 * (ringStartBcont / 100), 5, color, 'round');
        var t = setTimeout(ringStart, 30);
        if (ringStartBcont == ringBcountEnd || ringBcountEnd == 0) {
            clearTimeout(t);
        }
        if (ringBcountEnd == 0) {
            ringStartBcont = 0;
        }
        document.querySelector('.ringBcount').innerHTML = ringStartBcont;
    }
    ringStart();
}

function get_used_circle(res, n, m) {
    if (isEmpty(m)) {
        is_loaded = true;
    }
    //多个圆环进度
    Morris.Donut({
        element: 'graph',
        data: res,
        backgroundColor: '#fff',
        labelColor: '#717171',
        colors: ['#d9534f', '#00a185', '#4fc4d9', '#f7c232', '#80be1d'],
        formatter: function(x) {
            var str = (x / n).toFixed(2);
            return str * 100 + "%";
        }
    });
}

var lineChartData, randomScalingFactor;

function get_count(labels, y1, y2) {
    //曲线图统计
    Highcharts.setOptions({
        colors: ['#00a085', '#4374e0'] //曲线的颜色
    });
    var categories = labels;
    //x轴数据
    $('#container').highcharts({
        credits: {
            enabled: false //不显示highCharts版权信息
        },
        chart: {
            type: 'spline' //线条类型
        },
        title: '',
        xAxis: {
            reversed: false,
            tickWidth: 0,
            gridLineColor: '#efefef', //y方向网格颜色
            gridLineWidth: 1, //方向网格宽度
            labels: {
                formatter: function() {
                    return categories[this.value];
                }
            },
            tickInterval: 1
        },
        yAxis: {
            reversed: false,
            minPadding: 0,
            tickWidth: 0, //标志线头
            tickInterval: 2,
            gridLineColor: '#efefef', //x方向网格颜色
            lineWidth: 0,
            lineColor: '#a0a0a0',
            minorTickInterval: null,
            min: 0,
            max: 12,
            title: ''
        },
        tooltip: {
            valueSuffix: '°C'
        },
        plotOptions: {
            spline: {
                allowPointSelect: false, //是否允许选中点
                animation: true, //是否在显示图表的时候使用动画
                dataLabels: {
                    enabled: false, //是否在点的旁边显示数据
                    rotation: 0
                },
                enableMouseTracking: false, //鼠标移到图表上时是否显示提示框
                marker: {
                    enabled: true, //是否显示点
                    radius: 3, //点的半径
                    fillColor: "#f0f",

                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: false //鼠标放上去点是否放大
                        }
                    }
                },
                states: {
                    hover: {
                        enabled: false //鼠标放上去线的状态控制
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Tokyo',
            data: y1, //绿色数据
            marker: {
                fillColor: '#00a085'
            }
        }, {
            name: 'New York',
            data: y2, //蓝色数据
            marker: {
                fillColor: '#4374e0'
            }
        }]
    });
    var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
}
//能力切换
function change_able(num, obj) {
    var child = $(obj).find('.povPgm');
    var color = window.getComputedStyle(child[0]).backgroundColor;
    set_circle(num, color);
}

function set_circle(num, color) {
    var style = 'color:' + color + ';';
    var str = '<div class="povBcount"><span class="ringBcount" style="' + style + '">' + num + '</span>%</div>';
    $('.user-index-pover-lef').html(str);
    get_circle(color);
}

//能力评估
function get_ability(flag) {
    if (is_debug) {
        //TODO:
        var able = {
            "ranking": 3249, //排名
            "total": 10009, //做过的试题总数
            "error": 1, //曾经做错的试题总数
            "chapter": 0, //章节错题百分比10%
            "intelligent": 10, //智能组卷错题百分比8%
            "knowledgePoint": 20, //考点联系错题百分比10%
            "real": 40, //历年真题错题百分比10%
            "simulated": 20 //模拟错题百分比10%
        };
        var tpl = $('#tpl_able').html();
        var content = doT.template(tpl);
        $('#content_able').html(content(able));
        $('.ranking').html(able.ranking);
        set_circle(able.chapter, 'rgb(0, 161, 133)');
        get_line_process();

        $('.user-index-pover').removeClass('none');
        $('.user-index-tit').removeClass('none');
        return false;
    }
    var tpl = $('#tpl_able').html();
    var content = doT.template(tpl);
    var data = isEmpty($api.getStorage(memberId + 'capabilityAssessment')) ? '' : $api.getStorage(memberId + 'capabilityAssessment');
    if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown')) || (data && flag == 2)) {
        $('#content_able').html(content(data));
        $('.ranking').html(data.ranking);
        set_circle(data.chapter, 'rgb(0, 161, 133)');
        get_line_process();
        $('.user-index-pover').removeClass('none');
        $('.user-index-tit').removeClass('none');
        return false;
    }
    ajaxRequest('api/v2/capabilityAssessment', 'get', { //008.017  能力评估
        token: $api.getStorage('token'),
        id: memberId
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            if (isEmpty(ret.data) || isEmpty(ret.data[0])) {
                return false;
            }
            $('#content_able').html(content(ret.data[0]));
            $('.ranking').html(ret.data[0].ranking);
            $api.setStorage(memberId + 'capabilityAssessment', ret.data[0]);
            set_circle(ret.data[0].chapter, 'rgb(0, 161, 133)');
            get_line_process();
            $('.user-index-pover').removeClass('none');
            $('.user-index-tit').removeClass('none');
        }
    });
    // var able = {
    //         "ranking" : 3249, //排名
    //         "total" : 5688, //做过的试题总数
    //         "error" : 150, //曾经做错的试题总数
    //         "chapter" : 66, //章节错题百分比10%
    //         "intelligent" : 10, //智能组卷错题百分比8%
    //         "knowledgePoint" : 20, //考点联系错题百分比10%
    //         "real" : 40, //历年真题错题百分比10%
    //         "simulated" : 20 //模拟错题百分比10%
    //     };
    // var tpl = $('#tpl_able').html();
    // var content = doT.template(tpl);
    // $('#content_able').html(content(able));
    // $('.ranking').html(able.ranking);
    // set_circle(able.chapter, 'rgb(0, 161, 133)');
    // get_line_process();

    // $('.user-index-pover').removeClass('none');
    // $('.user-index-tit').removeClass('none');
    // return false;
}

function get_used(flag) {
    /*if (is_debug) {
        var used = [{
            "type": "看课",
            "value": 20
        }, {
            "type": "笔记",
            "value": 10
        }, {
            "type": "问答",
            "value": 10
        }, {
            "type": "做题",
            "value": 30
        }, {
            "type": "讨论",
            "value": 30
        }];
        var obj = [];
        var n = 0;
        for (var p in used) {
            obj[p] = {};
            obj[p].label = used[p].type;
            n += used[p].value;
            obj[p].value = used[p].value;
        }
        if (!is_loaded) {
            get_used_circle(obj, n);
        }
        var tpl = $('#tpl_used').html();
        var content = doT.template(tpl);
        $('#content-used').html(content({
            data: obj,
            n: n
        }));
        return false;

    }
    var tpl = $('#tpl_used').html();
    var content = doT.template(tpl);
    var data = isEmpty($api.getStorage(memberId + 'scale/browsers')) ? '' : $api.getStorage(memberId + 'scale/browsers');
    if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown'))) {
        get_used_circle(data['obj'], data['n'], 1);
        $('#content-used').html(content(data));
        return false;
    }
    ajaxRequest('api/v2.1/scale/browsers', 'get', { //018.1  学习用时占比（new）
        token: $api.getStorage('token'),
        id: memberId
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            var obj = [];
            var n = 0;
            for (var p in ret.data) {
                obj[p] = {};
                obj[p].label = ret.data[p].type;
                n += ret.data[p].value;
                obj[p].value = ret.data[p].value;
            }
            if (!is_loaded) {
                get_used_circle(obj, n);
            }
            var res = {
                data: obj,
                n: n
            };
            $('#content-used').html(content(res));
            $api.setStorage(memberId + 'scale/browsers', res);
        } else {
            //api.toast({
            //	msg : ret.msg,
            //	location : 'middle'
            //});
            //return false;
        }
    });*/
    var used = [{
            "type" : "看课",
            "value" : 40
        }, {
            "type" : "笔记",
            "value" : 10
        }, {
            "type" : "问答",
            "value" : 10
        }, {
            "type" : "做题",
            "value" : 30
        }, {
            "type" : "讨论",
            "value" : 10
        }];
        var obj = [];
        var n = 0;
        for (var p in used) {
            obj[p] = {};
            obj[p].label = used[p].type;
            n += used[p].value;
            obj[p].value = used[p].value;
        }
        if (!is_loaded) {
            get_used_circle(obj, n);
        }
        var tpl = $('#tpl_used').html();
        var content = doT.template(tpl);
        $('#content-used').html(content({
            data: obj,
            n: n
        }));
        return false;
}

function get_used_avg(flag) {
    if (is_debug) {
        var res = [{
            "self": [ //个人最近15天每天的学习用时
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
            ],
            "average": [ //所有人最近15天每天的学习用时
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
            ],
            "date": ["2015-09-01", "2015-09-02", "2015-09-03", "2015-09-04", "2015-09-05", "2015-09-06", "2015-09-07", "2015-09-08", "2015-09-09", "2015-09-10", "2015-09-11", "2015-09-12", "2015-09-13", "2015-09-13", "2015-09-13"]
        }];
        var date = res[0]['date'];
        var self = [];
        var average = [];
        var mydate = [];
        for (var p in date) {
            if (p < 7) {
                mydate.push(date[p].split('-')[1] + '.' + date[p].split('-')[2]);
                self.push(res[0]['self'][p]);
                average.push(res[0]['average'][p]);
            }
        }
        get_count(mydate, self, average);
        return false;
    }
    var data = isEmpty($api.getStorage(memberId + 'learning/lines')) ? '' : $api.getStorage(memberId + 'learning/lines');
    if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown')) || (data && flag == 2)) {
        get_count(data['mydate'], data['self'], data['average']);
        return false;
    }
    ajaxRequest('api/v2/learning/lines', 'get', { //008.019  个人与所有人用时对比（old）
        token: $api.getStorage('token'),
        id: memberId
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
            var res = ret.data;
            var date = res[0]['date'];
            var self = [];
            var average = [];
            var mydate = [];
            for (var p in date) {
                if (p < 7) {
                    mydate.push(date[p].split('-')[1] + '.' + date[p].split('-')[2]);
                    self.push(res[0]['self'][p]);
                    average.push(res[0]['average'][p]);
                }
            }
            get_count(mydate, self, average);
            var arr = {};
            arr['mydate'] = mydate;
            arr['self'] = self;
            arr['average'] = average;
            $api.setStorage(memberId + 'learning/lines', arr);
        } else {
            //api.toast({
            //	msg : ret.msg,
            //	location : 'middle'
            //});
            //return false;
        }
    });
    // var res = [{
    //         "self" : [//个人最近15天每天的学习用时
    //         1, 3, 7, 3, 5, 7, 5, 8, 1, 5, 7, 4, 2, 3, 4],
    //         "average" : [//所有人最近15天每天的学习用时
    //         10, 4, 5, 6, 7, 3, 4, 12, 5, 4, 2, 6, 8, 5, 6],
    //         "date" : ["2015-09-01", "2015-09-02", "2015-09-03", "2015-09-04", "2015-09-05", "2015-09-06", "2015-09-07", "2015-09-08", "2015-09-09", "2015-09-10", "2015-09-11", "2015-09-12", "2015-09-13", "2015-09-13", "2015-09-13"]
    //     }];
    //     var date = res[0]['date'];
    //     var self = [];
    //     var average = [];
    //     var mydate = [];
    //     for (var p in date) {
    //         if (p < 7) {
    //             mydate.push(date[p].split('-')[1] + '.' + date[p].split('-')[2]);
    //             self.push(res[0]['self'][p]);
    //             average.push(res[0]['average'][p]);
    //         }
    //     }
    //     get_count(mydate, self, average);
    //     return false;
}

function get_study(flag) {
    if (is_debug) {
        var data = {"total":5,"courselist":[{"categoryIndex":10,"effectiveDay":280,"taskTotal":"258","isU":"false","courseId":"8a22ecb5545a87e801545af5048c0006","outline":"","teacherName":"QiQi Wu","orderID_item_id":"CC1B9893DE86E61180FBD42F60D012AB","lastmodifyTime":1492055005,"categoryName":"CMA中文","subjectName":"CMA 中文 Part-1","courseIndex":140,"subjectID":"ff808081486933e601489c799f0f0868","progressSum":7429,"teacherHonor":"吴奇奇","courseSource":"zhongbo","availability":"CMA Part I 中文 基础课,讲义有更新，更新内容：第2章 第1节 知识点3、第2章 第2节 知识点3、第3章 第1节 知识点2、第3章 第1节 知识点4、第5章 第2节 知识点3<br />\r\n<br />","courseBkImage":"/upload/201604/f57ba6cd71ae40e8b26309ad758acfff.jpg","categoryId":"ff808081486933e601489c4662f60851","taskprogress":1,"expirationTime":1503574622,"buyTime":1475220121,"teacherImage":"/upload/201606/09c9342818e24393a970aa93d25b9a4d.png","versionId":"ff808081486933e601489c867448086a","subjectIndex":50,"courseName":"CMA Part I 中文 基础课","showProgress":"12","createDate":"1493096858792.000000","chapterId":"8a22ecb55b1ec7e9015b228f54e00031","chapterName":"知识点1 战略规划概述","progress":"229","taskId":"1674316061a8bb81313bbb8b0ef48340","taskName":"知识点1 战略规划概述"},{"categoryIndex":100,"effectiveDay":180,"taskTotal":"47","isU":"false","courseId":"8a22ecb551cf56cb0151d24140aa028a","outline":"","teacherName":"OBU 明星讲师团","orderID_item_id":"8a22ecb55541a8f7015552b7d07f0083","lastmodifyTime":1492325498,"categoryName":"OBU","subjectName":"OBU 论文提高课","courseIndex":2,"subjectID":"8a22ecb551f17b3e0151f1e161900125","progressSum":693,"teacherHonor":"孙志远、贵荣广、多年OBU辅导经验","courseSource":"zhongbo","availability":"","courseBkImage":"/upload/201512/3421d9597f9044b785e5138665fec42e.jpg","categoryId":"8a22ecb551cf56cb0151d2152b5c0252","taskprogress":3,"expirationTime":1503485114,"buyTime":1465971626,"teacherImage":"/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png","versionId":"8a22ecb551cf56cb0151d24140aa028a","subjectIndex":50,"courseName":"OBU 论文提高课","showProgress":"6","createDate":"1493092272553.000000","chapterId":"8a22ecb551d6da350151e8155bc81526","chapterName":"OBU 简介","progress":"75","taskId":"8a22ecb551ed44ca0151ed9c6d5300f1","taskName":"OBU-课程简介"},{"categoryIndex":15,"effectiveDay":280,"taskTotal":"61","isU":"false","courseId":"ff8080814eaf7474014eb44df2160843","outline":"","teacherName":"财务英语明星讲师团","orderID_item_id":"8a22ecb556ff11d00157213cf46c00d6","lastmodifyTime":1492306475,"categoryName":"CMA 英文","subjectName":"CMA 财务英语基础课","courseIndex":10,"subjectID":"ff8080814f3eb9ed014f48f2a7461389","progressSum":4750,"teacherHonor":"","courseSource":"zhongbo","availability":"","courseBkImage":"/upload/201508/5d3b49716c3d4b8a870051d55f7a5134.jpg","categoryId":"ff8080814997fb36014998b6ca0804ef","taskprogress":3,"expirationTime":1495526316,"buyTime":1473731425,"teacherImage":"/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png","versionId":"ff8080814eaf7474014eb44df2160843","subjectIndex":0,"courseName":"CMA 财务英语基础课","showProgress":"4","createDate":"1493088979578.000000","chapterId":"ff8080814eaf7474014eb99c07d114c6","chapterName":"Bankruptcy","progress":"7","taskId":"ff8080814f6d5ae7014f6dc5f30a00db","taskName":"business entities"}]}
  data.courselist=data.courselist.slice(0,3)
  var tpl = $('#tpl_course').html();
        var content = doT.template(tpl);
        $('#course_content').html(content(data));
        $('.progress-round').each(function(index){
                canvasRound('progress-round-' + index);
              })
        // circleProgress();
        return false;
    }
    // circleProgress();

    var tpl = $('#tpl_course').html();
    var content = doT.template(tpl);
    var data = isEmpty($api.getStorage(memberId + 'learningcourse')) ? '' : $api.getStorage(memberId + 'learningcourse');
    // if ((data && (api.connectionType == 'none' || api.connectionType == 'unknown')) || (data && flag == 2)) {
    // 		alert(JSON.stringify($api.getStorage(memberId + 'learningcourse')))
    //     static_url = '';
    //     $('#course_content').html(content(data));
    //     progressBar();
    //     api.parseTapmode();
    //     return false;
    // }
    get_static();
    ajaxRequest('api/v2.1/learning/learningcourse', 'get', { // 008.003.2 在学的课程列表（new）
        token: $api.getStorage('token'),
        pageNo: 0,
        pageSize: 1000
    }, function(ret, err) {
    
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success' && ret.data.total != 0) {
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
              var newLastProgress = {
                  RecentCourse : []
                };
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
                    newLastProgress.RecentCourse.push(learningcourse[i])
        					}
        				}
        			}
              
              // var filterLastProgress = learningcourse;
              var filterLastProgress = newLastProgress.RecentCourse;
              var i = 0,
                  len = filterLastProgress.length,
                  j, d;
              for (; i < len; i++) {
                  for (j = 0; j < len; j++) {
                  
                      if (parseInt(filterLastProgress[i].createDate) > parseInt(filterLastProgress[j].createDate)) {
                          d = filterLastProgress[j];
                          filterLastProgress[j] = filterLastProgress[i];
                          filterLastProgress[i] = d;
                      }
                  }
              }
              // alert(JSON.stringify(filterLastProgress))
              var ret={
                data : {
                  total : learningcourseData.data.total,
                  courselist : filterLastProgress.slice(0,3)
                }
              }
      
              $('#course_content').html(content(ret.data));
//               circleProgress();
              $('.progress-round').each(function(index){
                canvasRound('progress-round-' + index);
              })
              for (var p in ret.data.courselist[0]) {
                  if (p == 'courseBkImage') {
                      var img = ret.data.courselist[0][p];
                      api.imageCache({
                          url: static_url + img,
                          policy: 'cache_else_network',
                          thumbnail: 'false'
                      }, function(res, err) {
                          if (res && res.url) {
                              ret.data.courselist[0][p] = res.url;
                              $api.setStorage(memberId + 'learningcourse', ret.data);
                          }
                      });
                      break;
                  }
              }
              saveExpire(ret.data.courselist);
              api.parseTapmode();
        			
        	});

            
        }
        //progressBar();
    });
}

//历史课程详情
function course_det(_this, xyc, a, b, e, f, subjectName, categoryName) {

    var c = $(_this).data('chaptername');
    var d = $(_this).data('coursename');
    //if(c=='undefined'||!c){
    //    return false;
    //}
    api.openWin({
        name: xyc,
        url: xyc + '.html',
        bgColor: '#fff',
        opaque: true,
        reload: true,
        softInputMode: 'resize',
        pageParam: {
            tag: 1,
            courseId: a,
            chapterId: b,
            chapterName: c,
            courseName: d,
            categoryId: e,
            subjectId: f,
            subjectName: subjectName,
            categoryName: categoryName
        },
        vScrollBarEnabled: false,
        slidBackEnabled: false
    });
}

//财萃活动
function get_activity(){
    if(is_debug){
    var data = {"data":[{"content":"<div style=\"background-position:center top;background-image:url(/upload/201703/a5894537d133450abec29197165634ca.jpg);background-repeat:no-repeat;background-color:#b4cc8e;\">\r\n\t<div class=\"exam-box\">\r\n\t\t<a href=\"http://www.caicui.com/static/Special/cfa-frm2017/\" target=\"_blank\"><img src=\"/upload/201703/6562eb20213e43e88c203a35d176ad07.jpg\" draggable=\"false\" /> </a> <br />\r\n\t</div>\r\n</div>","id":"095a0a6702f911e7afc400163e022e38","valid":true,"title":"cfafrm双语卓越班2017","other":"","imagePath":"/upload/201703/6562eb20213e43e88c203a35d176ad07.jpg","whereTag":0,"url":"http://www.caicui.com/static/Special/cfa-frm2017/"},{"content":"<div style=\"background-position:center top;background-image:url(/upload/201703/52b2e81be52948a5918f365a389925a9.jpg);background-repeat:no-repeat;background-color:#b4cc8e;\">\r\n\t<div class=\"exam-box\">\r\n\t\t<a href=\"http://www.caicui.com/static/Special/2017kaixue/\" target=\"_blank\"><img src=\"/upload/201703/fae04a90a7f941e681b68946913ab9a8.jpg\" draggable=\"false\" /> </a> <br />\r\n\t</div>\r\n</div>","id":"fd855d34057a11e7afc400163e022e38","valid":true,"title":"2017年CFA&FRM开学季","other":"","imagePath":"/upload/201703/52b2e81be52948a5918f365a389925a9.jpg","whereTag":0,"url":"http://www.caicui.com/static/Special/2017kaixue/"},{"content":"<div style=\"background-position:center top;background-image:url(/upload/201702/0acd5771a31c416c9d15155586d09fc2.png);background-repeat:no-repeat;background-color:#b4cc8e;\">\r\n\t<div class=\"exam-box\">\r\n\t\t<a href=\"http://www.caicui.com/static/Special/cma201703/\" target=\"_blank\"><img src=\"/upload/201702/b0c8ef2517f9462daf98cfa62004f913.png\" draggable=\"false\" /> </a> <br />\r\n\t</div>\r\n</div>","id":"86bf67cffcbe11e6afc400163e022e38","valid":true,"title":"CMA新课-一步通关课程专题","other":"","imagePath":"/upload/201702/b0c8ef2517f9462daf98cfa62004f913.png","whereTag":0,"url":""},{"content":"<div style=\"background-position:center top;background-image:url(/upload/201606/602c9b38117a4f89bb9a7a41d22491e6.jpg);background-repeat:no-repeat;\">\r\n\t<div class=\"exam-box\">\r\n\t\t<a href=\"http://www.caicui.com/course/list/CMA.html\" target=\"_blank\"><img src=\"/upload/201606/b9f1b1e6c1e44feb97454651a867e613.jpg\" draggable=\"false\" /> </a> \r\n\t</div>\r\n</div>","id":"6c3c7f563d1e11e6b04700163e022e38","valid":true,"title":"CMA新网课","other":"","imagePath":"/upload/201606/602c9b38117a4f89bb9a7a41d22491e6.jpg","whereTag":0,"url":"http://www.caicui.com/course/list/CMA.html"}],"state":"success","msg":""}
    var tpl = $('#tpl_activity').html();
    var content = doT.template(tpl);
    $('#activity').html(content(data));
    }
    var tpl = $('#tpl_activity').html();
    var content = doT.template(tpl);
    // $('#activity').html(content(data));

    ajaxRequest('api/v2.1/slide/list', 'get', { 
        token: $api.getStorage('token'),
        tag : 0,
        valid : true,
        count : 4
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret.state == 'success') {
           var data = ret;
           $('#activity').html(content(data));
        }
        
    });
}

//在线课程详情
function openCourse() {
    api.sendEvent({
        name: 'to_stuyding'
    });
}
if (is_debug) {
    //在学的课程
    get_study();
    //个人学习与所有人平均用时对比
    //get_used_avg();
    //学习用时占比
    //get_used();
    //能力评估
    //get_ability();

    //财萃活动
    get_activity();
}
var is_loaded = false;
var memberId;
apiready = function() {
    memberId = getstor('memberId');
     api.hideProgress();
    //监听下拉刷新
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/arrow-down-o.png',
        bgColor: '#f3f3f3',
        textColor: '#787b7c',
        textDown: '下拉更多',
        textUp: '松开刷新',
        showTime: false
    }, function(ret, err) {
        //在学的课程
        get_study(1);
        //个人学习与所有人平均用时对比
        //get_used_avg(1);
        //学习用时占比
        //get_used(1);
        //能力评估
        //get_ability(1);
        //消息数量

        //财萃活动
        get_activity();
    });
    //在学的课程
    get_study(2);
    //个人学习与所有人平均用时对比
    //get_used_avg(2);
    //学习用时占比
    //get_used(2);
    //能力评估
    //get_ability(2);
    //消息数量

    //财萃活动
    get_activity();

    api.addEventListener({
        name: 'flush_study'
    }, function(ret) {
        //在学的课程
        get_study(1);
    })
};
