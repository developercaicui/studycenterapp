
//控制页面字体 取一次值就行了，pad开的窗口尺寸不一样
if(window.localStorage.caicuiPadfontSize){
    //alert(window.localStorage.caicuiPadfontSize);
    $('html').css('font-size',window.localStorage.caicuiPadfontSize);
}else{
    //alert(2);
    var d_W = document.documentElement.clientWidth;
    var d_H = document.documentElement.clientHeight;
    var f_S = 50 * ((d_W * (1- (768 / 1024 - d_H / d_W))) / 1024) + 'px';
    $('html').css('font-size', f_S);
    window.localStorage.caicuiPadfontSize = f_S;
}


//统一窗口尺寸变量,在登录后user-center.js中赋值(66,129,80,280|54,127,94,329)
var headLh,headSh,footSh,leftLw,leftSw,svgDown,svgAudio;
if(window.localStorage.caicui_headLh){
    headLh = parseInt(window.localStorage.caicui_headLh);
    headSh = parseInt(window.localStorage.caicui_headSh);
    footSh = parseInt(window.localStorage.caicui_footSh);
    leftLw = parseInt(window.localStorage.caicui_leftLw);
    leftSw = parseInt(window.localStorage.caicui_leftSw);
    svgDown = parseInt(window.localStorage.caicui_svgDown);
    svgAudio = parseInt(window.localStorage.caicui_svgAudio);
}
//alert(headLh + ' - ' + headSh + ' - ' + footSh + ' - ' + leftLw + ' - ' + leftSw + ' - ' + svgDown + ' - ' + svgAudio);

if(window.localStorage.systemType){
    $('html').addClass(window.localStorage.systemType);
    //alert(window.localStorage.systemType);
}

//展开跟收起
function listToggle(e){
    $(e).parents('li').toggleClass('open').siblings().removeClass('open');
}
//展开跟收起(课程章节)
function listToggle1(e){
    $(e).parents('li').toggleClass('open');
}


//通用验证码
//function get_captcha(obj) {
//    var img = common_url + '/api/v2.1/captcha?s=' + Math.random();
//    $(obj).attr('src', img);
//}
function get_code(obj) {
    var img = common_url + '/api/v2.1/captcha?s=' + Math.random();
    var phone = $.trim($('input[name=phone]').val());
    if (phone == '') {
        api.toast({
            msg : '请输入手机号',
            location : 'middle'
        });
        return false;
    }
    //var regex = /^0?(13[0-9]|15[012356789]|18[0123456789]|17[0]|14[57])[0-9]{8}$/;
    var regex = /^1[0-9]{10}$/i;
    if (!regex.test(phone)) {
        api.toast({
            msg : '手机号格式错误',
            location : 'middle'
        });
        return false;
    }
    var param = {};
    if ($('input[name=has_img]').val() == 1) {
        var captcha = $.trim($('input[name=captcha]').val());
        if (captcha == '') {
            api.toast({
                msg : '请输入图形验证码',
                location : 'middle'
            });
            return false;
        } else {
            param.j_captcha = captcha;
        }
    }
    if (is_ok) {
        is_ok = false;
        api.showProgress({
            title : '获取中',
            modal : true
        });
        set_token(function (res, error) {
            if (error) {
                if(api.connectionType=='none' || api.connectionType=='unknown'){
                    is_ok = true;
                }
                api.toast({
                    msg: error.msg,
                    location: 'middle'
                });
                return false;
            }
            if (res.state == 'success') {
                param.token = res.data.token;
                param.phone = phone;
                param.type = 'send';
                ajaxRequest('api/v2.1/msg/code', 'post', param, function(ret, err) {
                    api.hideProgress();
                    if (err) {
                        if(api.connectionType=='none' || api.connectionType=='unknown'){
                            is_ok = true;
                        }
                        api.toast({
                            msg : err.msg,
                            location : 'middle'
                        });
                        return false;
                    }
                    if (ret && ret.state == 'success' && ret.data == 'true') {
                        var x = 60;
                        var t;
                        t = setInterval(function() {
                            x--;
                            if (x < 1) {
                                $('.msg_code').html('获取验证码');
                                is_ok = true;
                                clearInterval(t);
                            } else {
                                $('.msg_code').html(x + 's');
                            }
                        }, 1000);
                    } else {
                        if (ret.msg == 'false') {
                            is_ok = true;
                            api.toast({
                                msg : '发送短信过于频繁,请您稍后再试',
                                location : 'middle'
                            });
                        } else if (ret.msg == '1000') {
                            is_ok = true;
                            api.toast({
                                msg : 'type类型错误',
                                location : 'middle'
                            });
                        } else if (ret.msg == 3) {
                            is_ok = true;
                            //$('.get_img').attr('src', img);
                            get_img();
                            $('.img_captcha').removeClass('none');
                            $('input[name=has_img]').val(1);
                        }
                    }
                });
            } else {
                var err = '';
                if (!isEmpty(err_conf_007[res.msg])) {
                    err = err_conf_007[res.msg];
                    api.toast({
                        msg: err,
                        location: 'middle'
                    });
                }
            }
        });
    }
}
//控制密码显示与隐藏
function look(obj) {
    if ($(obj).hasClass('close')) {
        $(obj).removeClass('close').siblings("input").attr('type', 'password');
    } else {
        $(obj).addClass('close').siblings("input").attr('type', 'text');
    }
}
// 圆环进度条
function circleProgress(){
    $('.circle-progress,.down-progress,.audio-progress').each(function(){
        $(this).children('svg').remove();
        var _ts = $(this);
        var dt = new Date();
        var cirI = dt.getTime();
        var cirVal = parseInt(_ts.find('.val').text());
        var cirW;
        if(parseInt(_ts.width()) > 0){
            cirW = parseInt(_ts.width());
        }else{
            if(_ts.hasClass('down-progress')){
                cirW = svgDown
            }else if(_ts.hasClass('audio-progress')){
                cirW = svgAudio
            }
        }
        _ts.prepend('<svg width="'+cirW+'" height="'+cirW+'" viewbox="0 0 '+ cirW + ' ' + cirW + '"><circle cx="'+ cirW/2 +'" cy="'+ cirW/2 +'" r="'+cirW * 0.45+'"></circle><circle id="circle'+cirI+'" cx="'+ cirW/2 +'" cy="'+ cirW/2 +'" r="'+cirW * 0.45+'"></circle></svg>');

        if(_ts.hasClass('down-progress')){

        }else {
            circleTrans("#circle"+cirI , cirW , cirVal);
        }
    });
}

function circleTrans(e,s,v){
    var percent = v / 100, perimeter = Math.PI * 0.9 * s;
    setTimeout(function(){
        $(e).css('stroke-dasharray', parseInt(perimeter * percent) + " " + parseInt(perimeter * (1 - percent)));
    },100);
}



// 打开课程列表页面
//function openCourse(co,ch,su,ca,cn){
//    if($('.course-pic-list').hasClass('learning')||$('#course_content').hasClass('das-top')){
//        alert(1);
//        course_detail={};
//        course_detail.chapterId=ch;
//        course_detail.courseId=co;
//        course_detail.subjectId=su;
//        course_detail.categoryId=ca;
//        course_detail.courseName=cn;
//        $api.setStorage('Course_info',course_detail);
//        //api.pageParam.course_id=co;//课程id
//        //api.pageParam.charpterid=ch;//章节id
//        //api.pageParam.courseName=cn;//课程名称
//        api.openWin({
//            name: 'course',
//            url: 'course.html',
//            slidBackEnabled: false,
//            pageParam:course_detail
//        });
//    }
//}
// 打开视频播放页面
function openVideo(){
    api.openWin({
        name: 'video',
        url: 'video.html',
        slidBackEnabled: false,
        pageParam: {name: 'video'}
    });
}

// 打开自定义Frame(打开,尺寸,弹动,点击的当前对象,来自)
function myFrame(e,s,b,obj,f){
    var param={};
    window.localStorage.frameSize = s;//在下个窗口取当前尺寸
    var reload=false;
    var mx, my, mh;
    if(s == 'full'){
        mx = 0;
        my = 0;
    }else if(s == 'large-h'){
        mx = leftLw;
        my = 0;
    }else if(s == 'large' || s == 'large-f'){
        api.closeFrame({
            name: 'footer-editor'
        });
        mx = leftLw;
        my = headLh;
    }else if(s == 'small-h' || s == 'course-head'){
        mx = leftSw;
        my = headLh;
    }else if(s == 'small' || s == 'small-f'){
        mx = leftSw;
        my = headSh;
    }else if(s == 'video-h'){
        mx = api.winWidth / 2;
        my = 0;
    }else if(s == 'video'){
        mx = api.winWidth / 2;
        my = headLh;
    }
    if(s == 'small-f' || s == 'large-f'){
        mh = api.winHeight - my -  footSh
    }else if(s == 'course-head'){
        mh = headSh - headLh
    }else{
        mh = api.winHeight - my
    }

    //if(b=="bounces"){//直接用true|false了
    //    bS = true
    //}else{
    //    bS = false
    //}
    //判断来自哪个页面，穿参
    if(e=='pop-msg'){
        api.sendEvent({
            name: 'center_num',
            extra: {key1:'value1', key2:'value2'}
        });
    }
    if(f){
        switch(f){

            case 'my-note':
                param.charpterid=$(obj).attr('data-id');
                param.courseId = $(obj).attr('data-key');
                break;
            case 'note-list':
                param.id=$(obj).attr('data-id');
                break;
            case 'answer-list':
                var taskId = $(obj).attr('taskId');
                taskId = isEmpty(taskId) || taskId == undefined || taskId == 'undefined' ? '课程id' : taskId;
                param.id=$(obj).attr('data-id');
                param.memberId = $(obj).attr('data-key');
                param.courseId = $(obj).attr('courseId');
                param.taskId = taskId;
                param.lx = 'answer-detail';//问题详情
                break;
            case 'talk-list':
                var categoryId = isEmpty($(obj).attr('data-id')) || $(obj).attr('data-id') == undefined || $(obj).attr('data-id') == 'undefined' ? '证书Id' : $(obj).attr('data-id');
                var subjectId = isEmpty($(obj).attr('subjectId')) || $(obj).attr('subjectId') == undefined || $(obj).attr('subjectId') == 'undefined' ? '科目id' : $(obj).attr('subjectId');
                var chapterId = isEmpty($(obj).attr('data-key')) || $(obj).attr('data-key') == undefined || $(obj).attr('data-key') == 'undefined' ? '章节Id' : $(obj).attr('data-key');
                var taskId = isEmpty($(obj).attr('taskId')) || $(obj).attr('taskId') == undefined || $(obj).attr('taskId') == 'undefined' ? '' : $(obj).attr('taskId');
                var taskProgress = isEmpty($(obj).attr('taskProgress')) || $(obj).attr('taskProgress') == undefined || $(obj).attr('taskProgress') == 'undefined' ? '' : $(obj).attr('taskProgress');
                var taskType = isEmpty($(obj).attr('taskType')) || $(obj).attr('taskType') == undefined || $(obj).attr('taskType') == 'undefined' ? '' : $(obj).attr('taskType');
                param.taskType = taskType;
                param.taskId = taskId;
                param.taskProgress = taskProgress;
                param.subjectId = subjectId;
                param.categoryId = categoryId;
                param.chapterId = chapterId;
                param.memberId = $(obj).attr('data-val');
                param.id= $(obj).attr('talk-id');
                param.lx = 'talk-detail';
                break;
            /*case 'my-note-list':
                param.qf = '1';
                break;
            */
            case 'my-note-detail':
                param.qf = '2';
                break;
            case 'dash':
                param.sous = '1';
                break;
            case 'answer-edit': //新建问答传参数
                param.wd = '1';
                break;
            case 'course-note-detail':
                param.qf = '4';
                break;
            case 'course-talk':
                param.text = 'text';
                break;
            case 'course-note'://新建笔记（代表小窗口）
                param.qf = 'small';
                break;
            //case 'my-note-list-f':
            //    api.pageParam.id = e
            //    break;
        }

    }
    if(e=='set-info' || e=='course-chapter'){
        //param.courseId = 1231
        reload=true;
    }
    var bgCor = '#f3f3f3';
    if(e == 'set-info' || e == 'pop-msg'){
        bgCor = 'rgba(0,0,0,0)'
    }
    api.openFrame({
        name: e,
        url: e+'.html',
        bgColor : bgCor,
        rect: {
            x: mx,
            y: my,
            w: api.winWidth  - mx,
            h: mh
        },
        pageParam:param,
        bounces: b,
        delay:200,
        reload:reload
    });
}
//搜索
var param = {};
//var val = '';
var searchType;
var search_data;
function goSearch(e) {
    param.keyWords=isEmpty($.trim($('input[name=input-lx]').val())) ? '' : $.trim($('input[name=input-lx]').val());
    if(param.keyWords==''){
        api.toast({
            msg:'请输入搜索关键字',
            location:'middle'
        });
        return false;
    }
    if(searchType=='note'||searchType=='note_search'){
        param.findType = 1;
        get_dt(1);
    }else if(searchType=='answer'||searchType=='answer_search'){
        param.findType = 2;
        get_dt(1);
    }else if(searchType=='talk'||searchType=='talk_search'||searchType=='talk_search_m'){
        param.findType = 3;
        get_dt(1);
    }
    //val = $(e).parents('.search-bar').find('input').val();
}
function more_data(page){
    if(searchType=='note'||searchType=='note_search'){
        param.findType = 1;
        get_dt(page);
    }else if(searchType=='answer'||searchType=='answer_search'){
        param.findType = 2;
        get_dt(page);
    }else if(searchType=='talk'||searchType=='talk_search'||searchType=='talk_search_m'){
        param.findType = 3;
        get_dt(page);
    }
}
function get_dt(page){
    param.token=$api.getStorage('token');
    param.pageNo =page;
    param.pageSize =10;
    api.showProgress({
        title : '搜索中',
        modal : true
    });
    ajaxRequest('api/studytools/findcontent/v2.1', 'get', param, function (ret, err) {//003.002 内容搜索
        api.hideProgress();
        if (err) {
            api.toast({
                msg: err.msg,
                location: 'middle'
            });
            return false;
        }
        if (ret && ret.state == 'success') {
            switch(searchType){
                case 'note':
                    var res=JSON.stringify({key1:ret,page:page,keyword:param.keyWords});
                    var jsfun = "note_result("+res+");";
                    api.execScript({
                        name: 'root',
                        frameName: 'my-note-list-f',
                        script: jsfun
                    });
                    break;
                case 'answer':
                            api.sendEvent({
                                name: 'answer_lx',
                                extra: {key1:ret,page:page}
                            });
                    break;
                case 'answer_search':
                    api.closeFrameGroup({
                        name: 'answerFrameGroup'
                    });
                    var data1={};
                    data1={key1:ret,page:page,keyword:param.keyWords};
                    api.openFrame({
                        name: 'course-answer-all',
                        url: 'course-answer-all.html',
                        rect: {
                            x: leftSw,
                            y: headSh,
                            w: api.winWidth - leftSw,
                            h: api.winHeight - headSh
                        },
                        pageParam: {data:data1},
                        bounces: false
                    });
                    break;
                case 'note_search':
                    api.closeFrameGroup({
                        name: 'chapterFrameGroup'
                    });
                    var data2={};
                        data2={key1:ret,page:page,keyword:param.keyWords};
                        api.openFrame({
                            name: 'course-note-all',
                            url: 'course-note-all.html',
                            rect: {
                                x: leftSw,
                                y: headSh,
                                w: api.winWidth - leftSw,
                                h: api.winHeight - headSh
                            },
                            pageParam:{data:data2},
                            bounces: false
                        });
                    break;
                case 'talk_search':
                    api.closeFrame({name:'course-talk-f'});
                    var data3={};
                    data3={key1:ret,page:page,keyword:param.keyWords};
                    api.openFrame({
                        name: 'course-talk-f',
                        url: 'course-talk-f.html',
                        rect: {
                            x: leftSw,
                            y: headSh,
                            w: api.winWidth - leftSw,
                            h: api.winHeight - headSh
                        },
                        pageParam:{data:data3},
                        bounces: false
                    });
                    break;
                case'talk_search_m':
                    api.closeFrame({name:'course-talk-me-f'});
                    var data4={};
                    data4={key1:ret,page:page,keyword:param.keyWords};
                    api.openFrame({
                        name: 'course-talk-me-f',
                        url: 'course-talk-me-f.html',
                        rect: {
                            x: leftSw,
                            y: headSh,
                            w: api.winWidth - leftSw,
                            h: api.winHeight - headSh
                        },
                        pageParam:{data:data4},
                        bounces: false
                    });
                    break;
            }
        } else {
            api.toast({
                msg: ret.msg,
                location: 'middle'
            });
        }
    });
}
// 横向进度条
function progressBar() {
    $('.progress-bar').each(function () {
        var _t = $(this);
        var _num = Math.round(parseFloat(_t.attr('min'))/parseFloat(_t.attr('max')) * 100);
        _num = isEmpty(_num) ? 0 : _num;
        if(_num > 90){
            _num = 100
        }
        //alert(_t.attr('min')+' - '+_t.attr('max')+' - '+_num);
        var $val = _t.parent().next('.progress-val');
        if($val){
            $val.text(_num+'%');
        }
        //在线课程列表进度
        var $cval = _t.parents('.progress-box').prev('.clb');
        if($cval){
            $cval.text('学习进度：'+ _num+'%');
        }
        if (_t.attr('data')!='1') {
            setTimeout(function(){
                _t.width(_num + '%');
            },500);
            _t.attr('data','1');
        }
    });
}


//图片浏览器打开
function openImageBrower(arr, i) {
    var str= arr.split(',');
    var data=[];
    for(var p in str){
        data.push(static_url+str[p]);
    }
    //图片浏览器打开
    var obj = api.require('imageBrowser');
    obj.openImages({
        imageUrls:data,
        activeIndex: i
    });
}


function audioDom(){
    $('.voice-player').each(function(){
        var _this = $(this);
        _this.html('<b>'+_this.attr("time")+'</b><span class="icon_box"><i class="icon-rss3"></i><i class="icon-rss2"></i><i class="icon-rss1"></i></span><i class="icon-spinner"></i>');
    })
}

var timer = null;
//播放音乐/*音频修改*/
function playAudio(item){
    clearInterval(timer);
    var _url = $(item).attr('url');
    var _time = parseInt($(item).attr('time'));
    var cc=_time;
    $('.voice-player').removeClass('play');
    $(item).addClass('loading');
    if($(item).attr('bg') == ''){
        var fixname=getFixName(_url);
        api.download({
            url: _url,
            report: false,
            cache: true,
            savePath:'fs://audio/' +Date.now()+fixname,
            allowResume:true
        },function(ret,err){
            if (ret && ret.state) {
                api.startPlay({
                    path:ret.savePath
                },function(res){
                    //api.alert({msg:res});
                    clearInterval(timer);
                    if(_time < 0){
                        _time = 0
                    }
                    $(item).children('b').text(_time);
                    $(item).removeClass('play');
                    api.stopPlay();
                });
                clearInterval(timer);
                timer=setInterval(function(){


                    //alert(cc);
                    //if(parseInt(cc)==1){
                    //    clearInterval(timer);
                    //    alert(1);
                    //    $(item).removeClass('play');
                    //    $(item).attr('bg','');
                    //    api.stopPlay();
                    //    $(item).children('b').text(_time);
                    //}
                    if(parseInt(cc)==1){

                    }else{
                        cc--;
                    }
                    $(item).children('b').text(parseInt(cc));
                },1000);
                $(item).addClass('play').removeClass('loading');


            } else{
                api.toast({
                    msg:err.msg,
                    location:'middle'
                });
            }
        });
        $(item).attr('bg','1');
    }else{
        $('.voice-player').removeClass('play').removeClass('loading');
        clearInterval(timer);
        api.stopPlay();
        $(item).attr('bg','');
    }
}
$(function(){
    $('.msg-mark').each(function () {
        if ($(this).html() >= 99) {
            $(this).html('99+');
        }
    });
});

//打开问答
function open_answer(){
    api.openFrame({
        name: 'my-question-mine',
        url: 'my-question-mine.html',
        rect: {
            x: leftLw,
            y: 0,
            w: api.winWidth - leftLw,
            h: headLh
        },
        pageParam:api.pageParam,
        bounces: false
    });
}

//删除后移除指定列
function removeList(id) {
    $('#li' + id).remove();
    var _isNull = $('.cont-list').length;
    if (_isNull < 1) {
        $('body').addClass('null');
    }
}

//课程折叠、显示章节
function toggleChild(e){
    $(e).parents('dl').parent().toggleClass('hide-child');
}


//删除
function righttrash(obj) {
    obj.addClass('none').siblings().removeClass('none');
    checkremove(1);
}

//取消
function rightcancel(obj) {
    obj.addClass('none').next('li').addClass('none').next('li').removeClass('none');
    checkremove(2);
}

//批量移除
function allremove(obj) {
    obj.addClass('none').prev('li').addClass('none');
    obj.next('li').removeClass('none');
    checkremove(3);
}

function checkremove(e) {
    api.sendEvent({
        name : 'opena',
        extra : {
            sethomepage : e
        }
    });
}


/**
 * 获取课程里所有的任务
 * @param courseDetail
 * @returns {{}}
 */
function save_tasks(courseDetail){
    var arr = {};
    var data_arr = courseDetail.chapters;
    var courseName=courseDetail.courseName;
    var courseId=courseDetail.courseId;
    for (var i in data_arr) {
        if (data_arr[i].isLeaf == 'false') {
            var child = data_arr[i].children;
            for (var j in child) {
                if (child[j].isLeaf == 'false') {
                    var child2 = child[j].children;
                    for (var k in child2) {
                        var cId = child2[k].chapterId;
                        var cName = child2[k].chapterTitle;
                        for (var x in child2[k].tasks) {
                            if (child2[k].isLeaf != 'false') {
                                var taskid = child2[k].tasks[x].taskId;
                                var obj_data = {
                                    courseId : courseId,
                                    courseName : courseName,
                                    chapterId : cId,
                                    chapterName : cName,
                                    taskInfo : child2[k].tasks[x]
                                };

                                arr[taskid] = obj_data;
                            }
                        }
                    }
                } else {
                    var cId = child[j].chapterId;
                    var cName = child[j].chapterTitle;
                    for (var k in child[j].tasks) {
                        var taskid = child[j].tasks[k].taskId;
                        var obj_data = {
                            courseId : courseId,
                            courseName : courseName,
                            chapterId : cId,
                            chapterName : cName,
                            taskInfo : child[j].tasks[k]
                        };
                        arr[taskid] = obj_data;
                    }
                }
            }
        } else {
            var cId = data_arr[i].chapterId;
            var cName = data_arr[i].chapterTitle;
            for (var k in data_arr[i].tasks) {
                var taskid = data_arr[i].tasks[k].taskId;
                var obj_data = {
                    courseId : courseId,
                    courseName : courseName,
                    chapterId : cId,
                    chapterName : cName,
                    taskInfo : data_arr[i].tasks[k]
                };
                arr[taskid] = obj_data;
            }
        }
    }
    return arr;
}
/*
 * 根据时间点跳转到对应界面
 * taskprogress courseId  taskid
 * */
function jump_task(taskprogress,courseId ,taskid){
    var task_arr;
    if(!isEmpty(taskprogress)&&!isEmpty(courseId)&&!isEmpty(taskid)){
        var tmp_course_detail = $api.getStorage(courseId);
        if (isEmpty(tmp_course_detail)) {
            api.showProgress({
                title: '处理中',
                modal: false
            });
            //获取课程的详细信息
            //api/v2.1/course/courseDetail，接口编号：004-006
            ajaxRequest('api/v2.1/course/courseDetail', 'get', {courseId: courseId}, function (ret, err) {//004.006获取课程的详细信息
                if (err) {
                    api.hideProgress();
                    api.toast({
                        msg: err.msg,
                        location: 'middle'
                    });
                    return false;
                }
                if (ret && ret.state == 'success') {
                    var course_detail = ret.data[0];//课程详情数据
                    task_arr = save_tasks(course_detail);
                    $api.setStorage(courseId, course_detail);
                    var res_process={};
                    res_process.task_info = task_arr[taskid];
                    res_process.last_progress = taskprogress;
                    judge_task(res_process, course_detail);
                }
            });
        } else {
            var course_detail = tmp_course_detail;//存储课程详细信息
            task_arr = save_tasks(course_detail);
            var res_process={};
            res_process.task_info = task_arr[taskid];
            res_process.last_progress = taskprogress;
            judge_task(res_process, course_detail);
        }
        function judge_task(res_process, course_detail) {
            if (isEmpty(course_detail) || isEmpty(course_detail.chapters) || isEmpty(res_process)) {
                api.toast({
                    msg: '获取课程信息失败',
                    location: 'middle'
                });
                return false;
            }
            var task_info = res_process.task_info.taskInfo;//当前任务信息
            if (isEmpty(task_info)) {
                api.toast({
                    msg: '暂无任务',
                    location: 'middle'
                });
                return false;
            }
            //判断当前任务类型
            if (task_info.taskType == 'video') {
                res_process.last_progress=taskprogress>10 ? taskprogress-10 : taskprogress;
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
                courseId: course_detail.courseId,//课程id
                last_progress: res_process.last_progress,//学习进度
                course_detail: course_detail,//课程详情
                task_info: task_info,//当前要学习的任务信息
                type: 'task'
            };
            api.hideProgress();
            //跳转到播放页面
            api.openWin({
                name: new_win_name,
                url: new_win_url,
                delay: 200,
                slidBackEnabled: false,//iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
                pageParam: pageParams
            });
        }
    }else{
        return false;
    }
}
/*
* 苹果内购处理
* */
function buys(id,goods_price){
   var  goods_id='ipad_'+id;
    var iap = api.require('iap');
    api.showProgress({
        style: 'default',
        title: '处理中',
        modal: true
    });
    iap.getProducts({
        productIds:[goods_id]
    },function(res, err){
        if (res) {
            if(res.products){
                iap.purchase({
                    productId:goods_id        //有效商品id
                }, function(ret, err){
                    setTimeout(function(){
                        api.hideProgress();
                    },1500);
                    if(ret){
                        var state = ret.state;
                        var msg='';
                        switch (state)
                        {
                            case 0:
                            {
                                //msg= '交易已加入队列';
                            }
                                break;
                            case 1:
                            {
                                var param={};
                                param.userId=getstor('memberId');
                                param.token=$api.getStorage('token');
                                param.courseId=id;
                                param.paidAmount=goods_price;
                                ajaxRequest('api/v2.1/mobile/order', 'post', param, function (ret, err) {
                                    api.hideProgress();
                                    if (err) {
                                        api.toast({
                                            msg: err.msg,
                                            location: 'middle'
                                        });
                                        return false;
                                    }
                                    if (ret && ret.isSuccess == true) {
                                        api.sendEvent({
                                            name: 'fresh_course'
                                        });
                                        api.closeFrame({
                                            name: 'course-buy'
                                        });
                                    } else {
                                        api.alert({
                                            msg: '订单提交接口异常'
                                        });
                                    }
                                });
                            }
                                break;
                            case 2:
                            {
                               //msg='交易失败';
                            }
                                break;
                            case 3:
                            {
                               msg='交易恢复';
                            }
                                break;
                            case 4:
                            {
                                msg='交易等待被确认';
                                //交易等待被确认，待确认后交易状态会变更为其它状态
                            }
                                break;
                            default:
                                break;
                        }
                        if(msg!=''){
                            api.alert({
                                msg:msg
                            });
                        }
                    }else{
                        api.alert({msg:err.msg});
                    }
                });
                return false;
            }
            if (res.invalidProductIds) {
                api.hideProgress();
                api.alert({
                    msg:'无效的商品'
                });
                return false;
            }
        } else {
            api.hideProgress();
            api.alert({
                msg:err.msg
            });
        }
    });
}
function getCCconfig(callback,is_force){
    var CCconfig=isEmpty($api.getStorage('CCconfig')) ? false : $api.getStorage('CCconfig');
    if(!CCconfig || is_force){
        ajaxRequest('api/v2.1/oauth/getConfig', 'post', {token:$api.getStorage('token'),societyType:'ccidinfo'}, function (ret, err) {//003.303.1  发布讨论
            if(err){
                api.toast({
                    msg:err.msg,
                    location:'middle'
                });
                callback(false);
            }
            if(ret && ret.state=='success'){
                $api.setStorage('CCconfig', JSON.parse(ret.data.appsecret));
                callback(ret.data.appsecret);
            }else{
                api.toast({
                    msg:'cc配置接口异常',
                    location:'middle'
                });
                callback(false);
            }
        });
    }else{
        callback(CCconfig);
    }
}
function bufferCourese(arrays) {
    var array=[];
    for(var p  in arrays){
         if(!isEmpty(arrays[p]['lastTaskdate'])){
             array.push(arrays[p]);
         }
    }
    var i = 0,
        len = array.length,
        j, d;
    for (; i < len; i++) {
        for (j = 0; j < len; j++) {
            if (array[i].lastTaskdate > array[j].lastTaskdate) {
                d = array[j];
                array[j] = array[i];
                array[i] = d;
            }
        }
    }
    return array;
}
//保存任务进度
function DosaveTaskProgress() {

        var data = $api.getStorage('saveTaskProgress');
        var now_progress = data.now_progress,
                total = data.total,
                state = data.state,
                task_info = data.task_info,
                task_info_detail = data.task_info_detail,
                course_detail = data.course_detail;

        var user_nickname = get_loc_val('mine', 'nickName');
        var user_token = $api.getStorage('token');
        var user_memberId = get_loc_val('mine', 'memberId');
        var post_param = {
                token: user_token,
                memberId: user_memberId,
                memberName: user_nickname,
                categoryId: course_detail.categoryId, //必须，证书id    ff808081473905e701475cd3c2080001
                categoryName: course_detail.categoryName, // 证书名称
                subjectId: course_detail.subjectId, //必须，科目id  ff808081473905e7014762542d940078
                subjectName: course_detail.subjectName, // 科目名称
                courseId: course_detail.courseId, //必须，课程id    ff808081486933e6014889882d9c0590
                courseName: course_detail.courseName, //必须，课程名称    courseName
                chapterId: task_info_detail.chapterId, //必须，章节id   chapterId
                chapterName: task_info_detail.chapterName, //必须，章节名称   chapterName
                taskId: task_info.taskId, //必须，任务id    1
                taskName: task_info.title, //任务名称
                progress: now_progress, //必须，当前进度值，视频为秒，试卷为题数量，文档为页码   5
                total: total, //必须，任务总长度   48
                state: state, //必须，进度状态默认init，完成：complate   complate   
                createDate : new Date().getTime(),
                isSupply : 0    
                // downLoadProgress :  '',    //下载进度
                // downLoadState :  '',      //下载状态  ing 、stop、end
                // downLoadDate : '', //下载时间
                // expiredDate : '',  //过期日期
                // isSupply : 0  //是否补发  0是实时报文
        };
        // ajaxRequest('api/v2.1/chapter/taskProgress', 'post', post_param, function(ret, err) { //008.024保存任务进度日志（new）tested
        //      if (err) {
        //              api.toast({
        //                      msg: err.msg,
        //                      location: 'middle'
        //              });
        //      }
        //      //if (ret && ret.state == 'success') {
        //      //$api.setStorage(user_nickname + 'self' + courseId, '');
        //      //清除整个课程结构的课程进度
        //      //}
        // });
        var stateNum = 0;
        if (post_param.state == "complate") {
                stateNum = 1;
        }
        post_param.state = stateNum;
        post_param.isSupply = 0;
        post_param.createDate = new Date().getTime();

        ajaxRequest({ 'origin': 'http://action.caicui.com/', 'pathname': 'api/userAction/course/taskProgress/v1.0/' }, 'get', {'token':user_token,'message':JSON.stringify(post_param)}, function(ret, err) {
                if (err) {
                        api.toast({
                                msg: err.msg,
                                location: 'middle'
                        });
                        return false;
                }
        });
}
/*
 *保存课程过期时间
 * */
function saveExpire(list){

    if(isEmpty(list)){
        return false;
    }

    var memberId = getstor('memberId');

    var course_expire =  isEmpty($api.getStorage(memberId+'course_expire')) ?  ''  : $api.getStorage(memberId+'course_expire');

    for(var p in list){
        var courseId = list[p]['courseId'];
        var expirationTime = isEmpty(list[p]['expirationTime']) ? 0  : list[p]['expirationTime'];
        if(course_expire){
            var is_same = false;
            for (var q in course_expire) {
                _courseId = course_expire[q]['courseId'];
                //_expirationTime = isEmpty(course_expire[q]['expirationTime']) ? 0 : course_expire[q]['expirationTime'];
                if (courseId == _courseId) {
                    course_expire[q]['expirationTime'] = expirationTime;
                    is_same = true;
                }
            }
            if (!is_same) {
                var data ={};
                data[courseId] = expirationTime;
                course_expire.push(data);
                $api.setStorage(memberId+'course_expire',course_expire);
            }else{
                $api.setStorage(memberId+'course_expire',course_expire);
            }
        }else{
            course_expire = [];
            var data = {};
            data[courseId] = expirationTime;
            course_expire.push(data);
            $api.setStorage(memberId+'course_expire',course_expire)

        }
    }
}
/*
 * 判断视频是否过期
 * */
function CourseIsexpire(courseId){
    var memberId = getstor('memberId');
    var course_expire =  isEmpty($api.getStorage(memberId+'course_expire')) ?  ''  : $api.getStorage(memberId+'course_expire');
    var is_ok = false;
    if(course_expire){
        for(var p in course_expire){
            if(course_expire[p][courseId]!=undefined && (parseInt(Date.now())<=parseInt((course_expire[p][courseId]=='' ? 0 : course_expire[p][courseId])*1000))){
                is_ok = true;
            }
        }
        if(is_ok){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }

}

//保存进度到本地数据库
function DosaveDataBase() {

        //alert("先保存数据库")
        var data = $api.getStorage('saveTaskProgress');
        var now_progress = data.now_progress,
                total = data.total,
                state = data.state,
                task_info = data.task_info,
                task_info_detail = data.task_info_detail,
                course_detail = data.course_detail;
        var user_nickname = get_loc_val('mine', 'nickName');
        var user_token = $api.getStorage('token');
        var user_memberId = get_loc_val('mine', 'memberId');
        var post_param = {
                token: user_token,
                memberId: user_memberId,
                memberName: user_nickname,
                categoryId: course_detail.categoryId, //必须，证书id    ff808081473905e701475cd3c2080001
                categoryName: course_detail.categoryName, // 证书名称
                subjectId: course_detail.subjectId, //必须，科目id  ff808081473905e7014762542d940078
                subjectName: course_detail.subjectName, // 科目名称
                courseId: course_detail.courseId, //必须，课程id    ff808081486933e6014889882d9c0590
                courseName: course_detail.courseName, //必须，课程名称    courseName
                chapterId: task_info_detail.chapterId, //必须，章节id   chapterId
                chapterName: task_info_detail.chapterName, //必须，章节名称   chapterName
                taskId: task_info.taskId, //必须，任务id    1
                taskName: task_info.title, //任务名称
                progress: now_progress, //必须，当前进度值，视频为秒，试卷为题数量，文档为页码   5
                total: total, //必须，任务总长度   48
                state: state, //必须，进度状态默认init，完成：complate   complate       
                downloadProgress: '', //下载进度
                downloadState: '', //下载状态  ing 、stop、end
                downloadDate: '', //下载时间
                expiredDate: '', //过期日期
        };
        var stateNum = 0;
        if (post_param.state == "complate") {
                stateNum = 1;
        }
        post_param.state = stateNum;
        DB.saveTasksProgress(post_param, function(ret, err) {

                if (ret.status) {
                         //DB.showTasksProgress();
                }

        });

        //验证本次保存时间和上次保存时间的差值，必须为正数，否则提示用户本地时间异常????
        //   DB.getTaskProgress(post_param.taskId,function(data){
        //    alert(data);
        //   })
        //  var prevSaveDate;
        //  if(post_param.modifyDate - ret.data.modifyDate <0){
        //     api.alert({
        //            title : '温馨提示',
        //            msg : '您手机时间异常，请调整当前时间！',
        //            buttons : ['返回']
        //        }, function(ret, err) {
        //            if (ret.buttonIndex == 1) {
        //                closeThisWin(0);
        //            }
        //        });
        //        return false;
        //     
        //  }

}