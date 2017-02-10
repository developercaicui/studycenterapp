//页面跳转
var clickCount = 1;
var timePicker;
var y, h;
function rember(obj) {
    $(obj).children('div').toggleClass('bgcl');
    if ($(obj).children('div').hasClass('bgcl')) {
        $api.setStorage('is_rember', 1);
    } else {
        $api.setStorage('is_rember', 0);
    }
}
//新建笔记选择课程
function newMyNote() {
    api.openFrame({
        name: 'my-question-mine',
        url: 'my-question-mine.html',
        rect: {
            x: leftLw,
            y: 0,
            w: api.winWidth - leftLw,
            h: headLh
        },
        pageParam: {type: 'notes'},
        bounces: false
    });
}
function bind_push() {
    var push = api.require('push');
    var username = get_loc_val('mine', 'nickName');
    push.bind({
        userName: username,
        userId: api.deviceId
    }, function (ret, err) {
    });
}

//去绑定
function to_bind() {
    api.setStatusBarStyle({
        style: 'light'
    });
    api.openWin({
        name: 'bind',
        url: 'bind.html',
        delay: 200,
        slidBackEnabled: false
    });
}

//忘记密码
function forget() {
    api.openWin({
        name: 'forgot_pass',
        url: 'forgot_pass.html',
        delay: 200,
        slidBackEnabled: false
    });
}

//手机号注册
function phone_reg() {
    api.openWin({
        name: 'sign-up',
        url: 'sign-up.html',
        delay: 200,
        slidBackEnabled: false
    });
}

//普通登录
function login() {
    var name = $.trim($('input[name=username]').val());
    var password = $.trim($('input[name=password]').val());
    if (name == '') {
        api.toast({
            msg: '手机号／邮箱不能为空',
            location: 'middle'
        });
        return false;
    }
    if (password == '') {
        api.toast({
            msg: '密码不能为空',
            location: 'middle'
        });
        return false;
    }
    api.showProgress({
        title: '登录中',
        model: true
    });
    set_token(function (res, error) {
        if (error) {
            api.toast({
                msg: error.msg,
                location: 'middle'
            });
            return false;
        }
        if (res.state == 'success') {
            var param = {};
            param.account = name;
            param.password = password;
            param.token = res.data.token;
            ajaxRequest('api/v2.1/login', 'post', param, function (ret, err) {
                api.hideProgress();
                if (err) {
                    api.toast({
                        msg: err.msg,
                        location: 'middle'
                    });
                    return false;
                }
                if (ret.state == 'success') {
                    $api.setStorage('account', name);

                    $api.setStorage('password', password);

                    $api.setStorage('token', ret.data.token);
                    $api.setStorage('mine', ret.data);
                    if (ret.data.isAvatar == false) {
                        api.openWin({
                            name: 'sign-edit',
                            url: 'sign-edit.html',
                            slidBackEnabled: false,
                            bgColor: '#fff',
                            delay: 200
                        });
                    } else {
                        to_ucenter();
                    }
                } else if (ret.state == 'error') {
                    var msg = '';
                    if (err_conf_007[ret.msg]) {
                        msg = err_conf_007[ret.msg];
                        api.toast({
                            msg: msg,
                            location: 'middle'
                        });
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

//qq登录
function login_qq() {
    api.showProgress({
        title: '授权中',
        model: true
    });
    //setTimeout(function() {
    //	api.hideProgress();
    //}, 1500);
    var obj = api.require('qq');
    obj.login(function (ret, err) {
        if (ret.openId) {
            set_token(function (res, error) {
                if (error) {
                    api.toast({
                        msg: error.msg,
                        location: 'middle'
                    });
                    return false;
                }
                if (res.state == 'success') {
                    var param = {};
                    param.token = res.data.token;
                    param.societyType = 'society_qq';
                    param.societyId = ret.openId;
                    $api.setStorage('token', res.data.token);
                    ajaxRequest('api/v2.1/oauthLogin', 'post', param, function (ret, err) {
                        if (err) {
                            api.toast({
                                msg: err.msg,
                                location: 'middle'
                            });
                            return false;
                        }
                        if (ret && ret.state == 'success') {
                            $api.setStorage('outh', {
                                'societyType': param.societyType,
                                'societyId': param.societyId
                            });
                            $api.setStorage('token', ret.data.token);
                            $api.setStorage('mine', ret.data);
                            if (ret.data.isAvatar == false) {
                                api.openWin({
                                    name: 'sign-edit',
                                    url: 'sign-edit.html',
                                    slidBackEnabled: false,
                                    bgColor: '#fff',
                                    delay: 200,
                                    pageParam : {
                                        nickName : ret.data.nickName
                                    }
                                });
                            } else {
                                to_ucenter();
                            }
                        } else if (ret.state == 'error') {
                            if (ret.msg == '1001') {
                                $api.setStorage('outh', {
                                    'societyType': param.societyType,
                                    'societyId': param.societyId
                                });
                                to_bind();
                                return false;
                            }
                            var msg = '';
                            if (err_conf_007[ret.msg]) {
                                msg = err_conf_007[ret.msg];
                                api.toast({
                                    msg: msg,
                                    location: 'middle'
                                });
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
        } else {
            api.hideProgress();
        }
    });
}

//微信登录
function login_weixin() {
    api.showProgress({
        title: '授权中',
        modal: true
    });
    //setTimeout(function() {
    //	api.hideProgress();
    //}, 1500);
    var myobj = api.require('weiXin');
    myobj.registerApp(function (ret, err) {
        if (ret.status) {
            myobj.auth(function (data, err) {
                if (data.status) {
                    var token = data.token;
                    myobj.getUserInfo(function (msg, err) {
                        if (msg.status) {
                            set_token(function (res, error) {
                                if (error) {
                                    api.toast({
                                        msg: error.msg,
                                        location: 'middle'
                                    });
                                    return false;
                                }
                                if (res.state == 'success') {
                                    var param = {};
                                    param.token = res.data.token;
                                    param.societyType = 'society_weixin';
                                    param.societyId = msg.openid;
                                    $api.setStorage('token', res.data.token);
                                    ajaxRequest('api/v2.1/oauthLogin', 'post', param, function (ret, err) {
                                        if (err) {
                                            api.toast({
                                                msg: err.msg,
                                                location: 'middle'
                                            });
                                            return false;
                                        }
                                        if (ret && ret.state == 'success') {
                                            $api.setStorage('outh', {
                                                'societyType': param.societyType,
                                                'societyId': param.societyId
                                            });
                                            $api.setStorage('token', ret.data.token);
                                            $api.setStorage('mine', ret.data);
                                            if (ret.data.isAvatar == false) {
                                                api.openWin({
                                                    name: 'sign-edit',
                                                    url: 'sign-edit.html',
                                                    slidBackEnabled: false,
                                                    delay: 200,
                                                    bgColor: '#fff',
                                                    pageParam : {
                                                        nickName : ret.data.nickName
                                                    }
                                                });
                                            } else {
                                                to_ucenter();
                                            }
                                        } else if (ret.state == 'error') {
                                            if (ret.msg == '1001') {
                                                $api.setStorage('outh', {
                                                    'societyType': param.societyType,
                                                    'societyId': param.societyId
                                                });
                                                to_bind();
                                                return false;
                                            }
                                            var msg = '';
                                            if (err_conf_007[ret.msg]) {
                                                msg = err_conf_007[ret.msg];
                                                api.toast({
                                                    msg: msg,
                                                    location: 'middle'
                                                });
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
                        } else {
                            api.hideProgress();
                        }
                    });
                } else {
                    api.hideProgress();
                }
            });
        } else {
            api.hideProgress();
        }
    });
}

//新浪登录
function login_weibo() {
    api.showProgress({
        title: '授权中',
        modal: true
    });
    //setTimeout(function() {
    //	api.hideProgress();
    //}, 1500);
    var myobj = api.require('sinaWeiBo');
    myobj.auth(function (ret, err) {
        if (ret.status) {
            set_token(function (res, error) {
                if (error) {
                    api.toast({
                        msg: error.msg,
                        location: 'middle'
                    });
                    return false;
                }
                if (res.state == 'success') {
                    var param = {};
                    param.token = res.data.token;
                    param.societyType = 'society_weibo';
                    param.societyId = ret.userID;
                    $api.setStorage('token', res.data.token);
                    ajaxRequest('api/v2.1/oauthLogin', 'post', param, function (ret, err) {
                        if (err) {
                            api.toast({
                                msg: err.msg,
                                location: 'middle'
                            });
                            return false;
                        }
                        if (ret && ret.state == 'success') {
                            $api.setStorage('outh', {
                                'societyType': param.societyType,
                                'societyId': param.societyId
                            });
                            $api.setStorage('token', ret.data.token);
                            $api.setStorage('mine', ret.data);
                            if (ret.data.isAvatar == false) {
                                api.openWin({
                                    name: 'sign-edit',
                                    url: 'sign-edit.html',
                                    slidBackEnabled: false,
                                    bgColor: '#fff',
                                    delay: 200,
                                    pageParam : {
                                        nickName : ret.data.nickName
                                    }
                                });
                            } else {
                                to_ucenter();
                            }
                        } else if (ret.state == 'error') {
                            if (ret.msg == '1001') {
                                $api.setStorage('outh', {
                                    'societyType': param.societyType,
                                    'societyId': param.societyId
                                });
                                to_bind();
                                return false;
                            }
                            var msg = '';
                            if (err_conf_007[ret.msg]) {
                                msg = err_conf_007[ret.msg];
                                api.toast({
                                    msg: msg,
                                    location: 'middle'
                                });
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
        } else {
            api.hideProgress();
        }
    });
}

function init(callback) {
    if ((api.connectionType == 'none' || api.connectionType == 'unknown') && !isEmpty(getstor('memberId')) && !isEmpty($api.getStorage('token'))) {
        api.removeLaunchView({
            animation: {
                type: 'fade',
                duration: 500
            }
        });
        to_ucenter();
        return false;
    }
    var token = isEmpty($api.getStorage('token')) ? '' : $api.getStorage('token');
    if (token != '') {
        ajaxRequest('api/v2/member/get', 'get', {
            token: token
        }, function (ret, err) {
            if (err) {
                callback(false);
            }
            if (ret && ret.state == 'success') {
                callback(ret.data);
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
}
var cache_init = false;
//去个人中心
function to_ucenter() {


    var jsfun = "relogin('" + true + "');";
    api.execScript({
        name: 'root',
        script: jsfun
    });

    $('.onlogin').show();
    $('.nologin').hide();
    $('input').blur();
    var headimg = get_loc_val('mine', 'avatar');
    if (headimg) {
        headimg = static_url + headimg + '?s=' + Math.random();
        $('.avatar').attr('src', headimg);
    }
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    window.localStorage.caicui_headLh = headLh = $api.offset(header).h;
    window.localStorage.caicui_headSh = headSh = parseInt($('#sHead').height() - 0 + headLh);
    window.localStorage.caicui_footSh = footSh = $('#sFoot').height();
    window.localStorage.caicui_leftLw = leftLw = $('#slider').width();
    window.localStorage.caicui_leftSw = leftSw = $('#sLeft').width();
    window.localStorage.caicui_svgDown = svgDown = $('#svgDown').width();
    window.localStorage.caicui_svgAudio = svgAudio = $('#svgAudio').width();
    //alert(headLh +" - "+ parseInt($('#sHead').height() - 9)); //我也不知道为什么一个相同的元素在不同页面时尺寸不一样（只能暂时先减去差值）
    $('#leftMenu').css('min-height', $('#leftMenu').height());
    api.openFrameGroup({
        name: 'homeFrameGroup',
        bounces: false,
        scrollEnabled: false,
        rect: {
            x: leftLw,
            y: headLh,
            w: api.winWidth - leftLw,
            h: api.winHeight - headLh
        },
        index: 0,
        preload: 5,
        frames: [{
            name: 'learning-center', //学习中心
            url: 'learning-center.html'
        }, {
            name: 'course-topnav', //在学课程
            url: 'course-topnav.html'
        }, {
            name: 'my-note', //我的笔记
            url: 'my-note.html'

        }, {
            name: 'my-answer', //我的问答
            url: 'my-answer.html'
        }, {
            name: 'my-talk', //我的讨论
            url: 'my-talk.html'
        }, {
            name: 'video-cache-f', //缓存课程
            url: 'video-cache-f.html'
        }]
    }, function (ret, err) {
        api.removeLaunchView({
            animation: {
                type: 'fade',
                duration: 500
            }
        });
        //是否继续下载
        var memberId = getstor('memberId');
        var downed = isEmpty($api.getStorage(memberId + 'downed')) ? '' : $api.getStorage(memberId + 'downed');
        if (downed) {
            $api.rmStorage(memberId + 'downed');
        }
        bind_push();
        //学习提醒初始化
        var notice = isEmpty($api.getStorage('is_notice')) ? 0 : $api.getStorage('is_notice');
        clearInterval(push_timer);
        if (notice == 1) {
            init_push();
        }
    });
    getCCconfig(function () {
    }, true);
    center_num();

     saveTasksProgress.init();
}

function to_login() {//去登陆
    $('input').blur();
    api.closeFrameGroup({
        name: 'courseFrameGroup'
    });
    api.closeFrameGroup({
        name: 'homeFrameGroup'
    });
    api.closeFrameGroup({
        name: 'noteFrameGroup'
    });
    api.closeFrame({
        name: 'course-note'
    });
    api.closeFrame({
        name: 'course-note'
    });
    api.closeFrameGroup({
        name: 'noteFrameGroup'
    });
    api.closeFrameGroup({
        name: 'chapterFrameGroup'
    });
    api.closeFrameGroup({
        name: 'pop_message_group'
    });
    api.closeFrameGroup({
        name: 'answerVideoFrameGroup'
    });
    api.closeFrame({
        name: 'footer-editor'
    });
    api.closeFrame({
        name: 'footer-answer'
    });
    api.closeFrame({
        name: 'video-answer-detail'
    });
    api.closeFrame({
        name: 'video-answer-detail-f'
    });
    api.closeFrame({
        name: 'video-answer-edit'
    });
    // var jsfun = "if(typeof(eval('closeVideo')=='function')){closeVideo();}";
    // api.execScript({
    //     name: 'video',
    //     script: jsfun
    // });

    api.sendEvent({
        name: 'closeVideo'
    });
    //get_token();
    var password = isEmpty($api.getStorage('password')) ? '' : $.trim($api.getStorage('password'));
    var account = isEmpty($api.getStorage('account')) ? '' : $.trim($api.getStorage('account'));
    $('input[name=username]').val(account);
    $('input[name=password]').val(password);


    $('.nologin').show();
    $('.onlogin').hide();

    api.removeLaunchView({
        animation: {
            type: 'fade',
            duration: 500
        }
    });

    api.closeToWin({
        name: 'root'
    });

}


var reloginTimer = null;

function cancel_login() {
    clearInterval(reloginTimer);
}


function DoLogin(account, password) {
    set_token(function (res, errors) {
        if (res && res.state == 'success') {
            //继续登录
            var param = {};
            param.account = account;
            param.password = password;
            param.token = res.data.token;
            myajaxRequest('api/v2.1/login', 'post', param, function (ret1, err1) {//007.005 会员登录
                if (ret1 && ret1.state == 'success') {
                    $api.setStorage('account', account);

                    $api.setStorage('password', password);

                    $api.setStorage('token', ret1.data.token);

                    $api.setStorage('mine', ret1.data);

                    if (ret1.data.isAvatar == false) {
                        api.openWin({
                            name: 'sign-edit',
                            url: './html/sign-edit.html',
                            slidBackEnabled: false,
                            bgColor: '#fff',
                            delay: 200,
                            pageParam: {
                                nickName: ret1.data.nickName
                            }
                        });
                    }
                }
            });
        }
    });
}

function relogin(ckeck) {

    var password = isEmpty($api.getStorage('password')) ? '' : $.trim($api.getStorage('password'));
    var account = isEmpty($api.getStorage('account')) ? '' : $.trim($api.getStorage('account'));

    if (password && account) {
        if (!ckeck) {
            DoLogin(account, password);
        }
        clearInterval(reloginTimer);
        reloginTimer = setInterval(function () {
            DoLogin(account, password);
        }, 20 * 60 * 1000);
    }

}
var is_resume;

apiready = function () {

    api.setScreenOrientation({
        orientation: 'auto_landscape'
    });

    is_resume = false;

    api.addEventListener({
        name: 'pause'
    }, function (ret, err) {
        saveTasksProgress.init();
        is_resume = true;
        var memberId = getstor('memberId');
        if (memberId && api.systemType == 'ios') {
            var downed = isEmpty($api.getStorage(memberId + 'downed')) ? '' : $api.getStorage(memberId + 'downed');
            if (downed) {
                $api.setStorage(memberId + 'backendDowned', downed);
                $api.rmStorage(memberId + 'downed');
                var chapterIdA = downed['chapterIdA'];
                var chapterIdB = downed['chapterIdB'];
                var chapterIdC = downed['chapterIdC'];
                if (cache_model == null) {
                    cache_model = api.require('lbbVideo');
                }
                cache_model.downloadStop(function (ret, err) {

                    set_down({type: 1, chapterida: chapterIdA, chapteridb: chapterIdB, chapteridc: chapterIdC});
                    api.sendEvent({
                        name: 'flush_cache'
                    });
                });
            }
        }
    });

    api.setKeepScreenOn({
        keepOn: true
    });
    //初始话视频
    if (api.systemType == 'android') {
        if (cache_model == null) {
            cache_model = api.require('lbbVideo');
            cache_model.initDownload();
            cache_model.init();
        }
    }
    api.addEventListener({
        name: 'resume'
    }, function (ret, err) {
        saveTasksProgress.init();
        if (is_resume) {
            var jsfun = "relogin();";
            api.execScript({
                name: 'root',
                script: jsfun
            });
        }
        if (api.systemType == 'ios') {
            cachemodel = api.require('lbbVideo');
            cachemodel.init();
        }
        if (api.systemType == 'ios') {
            cachemodel = api.require('lbbVideo');
            cachemodel.init();
            var memberId = getstor('memberId');
            if (memberId && api.systemType == 'ios') {
                var downed = isEmpty($api.getStorage(memberId + 'backendDowned')) ? '' : $api.getStorage(memberId + 'backendDowned');
                if (downed) {
                    $api.rmStorage(memberId + 'backendDowned');
                    downed['type'] = 2;
                    mydown(downed);
                }
            }
        }
    });
    var memberId = getstor('memberId');
    if (memberId) {
        var downed = isEmpty($api.getStorage(memberId + 'downed')) ? '' : $api.getStorage(memberId + 'downed');
        if (downed) {
            $api.rmStorage(memberId + 'downed');
            var chapterIdA = downed['chapterIdA'];
            var chapterIdB = downed['chapterIdB'];
            var chapterIdC = downed['chapterIdC'];
            if (cache_model == null) {
                cache_model = api.require('lbbVideo');
            }
            cache_model.downloadStop(function (ret, err) {

                set_down({type: '1', chapterida: chapterIdA, chapteridb: chapterIdB, chapteridc: chapterIdC});
                api.sendEvent({
                    name: 'flush_cache'
                });
            });
        }
    }
    //获取设备型号-兼容UI使用
    window.localStorage.systemType = api.systemType + parseInt(api.systemVersion);
    api.setStatusBarStyle({
        style: 'dark'
    });
    //网络断开监听  网络已断开
    api.addEventListener({
        name: 'offline'
    }, function (ret, err) {
        window.shut_network = true;
        window.allow_down = false;

        var memberId = getstor('memberId');
        var downed = $api.getStorage(memberId + 'downed');
        if (downed) {
            $api.rmStorage(memberId + 'downed');
            var chapterIdA = downed['chapterIdA'];
            var chapterIdB = downed['chapterIdB'];
            var chapterIdC = downed['chapterIdC'];
            if (cache_model == null) {
                cache_model = api.require('lbbVideo');
            }
            if (api.connectionType == 'unknown' || api.connectionType == 'none') {
                cache_model.downloadStop(function (ret, err) {

                    set_down({
                        type: 'shut_network',
                        chapterida: chapterIdA,
                        chapteridb: chapterIdB,
                        chapteridc: chapterIdC
                    });
                    api.sendEvent({
                        name: 'flush_cache'
                    });
                });
            } else if (api.connectionType == '2g' || api.connectionType == '3g' || api.connectionType == '4g' || api.connectionType == '2G' || api.connectionType == '3G' || api.connectionType == '4G') {
                window.shut_network = false;
                cache_model.downloadStop(function (ret, err) {

                    set_down({
                        type: 'not_wifi',
                        chapterida: chapterIdA,
                        chapteridb: chapterIdB,
                        chapteridc: chapterIdC
                    });
                    api.sendEvent({
                        name: 'flush_cache'
                    });
                });
            }
        }
    });
    //网络类型判断
    api.addEventListener({
        name: 'online'
    }, function (ret, err) {
            saveTasksProgress.init();
        
        window.shut_network = false;
        var connectionType = ret.connectionType;
        if (connectionType == 'wifi') {
            window.allow_down = true;
        } else {
            window.allow_down = false;
            var memberId = getstor('memberId');
            var downed = $api.getStorage(memberId + 'downed');
            if (downed) {
                var chapterIdA = downed['chapterIdA'];
                var chapterIdB = downed['chapterIdB'];
                var chapterIdC = downed['chapterIdC'];
                $api.rmStorage(memberId + 'downed');
                if (cache_model == null) {
                    cache_model = api.require('lbbVideo');
                }
                cache_model.downloadStop(function (ret, err) {

                    set_down({
                        type: 'not_wifi',
                        chapterida: chapterIdA,
                        chapteridb: chapterIdB,
                        chapteridc: chapterIdC
                    });
                    api.sendEvent({
                        name: 'flush_cache'
                    });
                });
            }
        }
    });
    //取消删除样式
    api.addEventListener({
        name: 'cancle_del'
    }, function () {
        $('.cache').children('li').addClass('none');
        $('.cache').children().eq(2).removeClass('none');
        checkremove(2);
    });
    //修改资料
    api.addEventListener({
        name: 'modify'
    }, function (ret) {
        var headimg = get_loc_val('mine', 'avatar');
        if (headimg) {
            headimg = static_url + headimg + '?s=' + Math.random();
            $('.avatar').attr('src', headimg);
        }
    });
    if (!isEmpty(api.pageParam.to_ucenter)) {
        to_ucenter();
    }
    init(function (ret) {
        if (ret) {//已经有登录状态
            $api.setStorage('mine', ret);
            if (isEmpty(ret.isAvatar)) {
                api.removeLaunchView({
                    animation: {
                        type: 'fade',
                        duration: 500
                    }
                });
                api.openWin({
                    name: 'sign-edit',
                    url: 'sign-edit.html',
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    delay: 200
                });
            } else {
                to_ucenter();
            }
        } else {
            var outh = isEmpty($api.getStorage('outh')) ? '' : $api.getStorage('outh');
            if (outh) {
                $api.rmStorage('password');
                set_token(function (res, errors) {
                    if (res && res.state == 'success') {
                        //继续登录
                        outh['token'] = res.data.token;
                        $api.setStorage('token', res.data.token);
                        ajaxRequest('api/v2.1/oauthLogin', 'post', outh, function (ret, err) {//007.003 auth登录
                            api.removeLaunchView({
                                animation: {
                                    type: 'fade',
                                    duration: 500
                                }
                            });
                            if (ret && ret.state == 'success') {
                                $api.setStorage('token', ret.data.token);
                                $api.setStorage('mine', ret.data);
                                $api.setStorage('outh', {
                                    'societyType': outh.societyType,
                                    'societyId': outh.societyId
                                });
                                if (ret.data.isAvatar == false) {
                                    api.openWin({
                                        name: 'sign-edit',
                                        url: 'sign-edit.html',
                                        slidBackEnabled: false,
                                        bgColor: '#fff',
                                        delay: 200,
                                        pageParam: {
                                            nickName: ret.data.nickName
                                        }
                                    });
                                    return false;
                                } else {
                                    to_ucenter();
                                    return false;
                                }
                            } else if (ret.state == 'error') {
                                if (ret.msg == '1001') {
                                    $api.setStorage('outh', {
                                        'societyType': outh.societyType,
                                        'societyId': outh.societyId
                                    });
                                    to_bind();
                                    return false;
                                }
                            }
                        });
                    }
                });
            }
            var password = isEmpty($api.getStorage('password')) ? '' : $.trim($api.getStorage('password'));
            var account = isEmpty($api.getStorage('account')) ? '' : $.trim($api.getStorage('account'));
            if (password && account) {//如果记住了帐号和密码
                set_token(function (res, errors) {
                    if (res && res.state == 'success') {
                        //继续登录
                        var param = {};
                        param.account = account;
                        param.password = password;
                        param.token = res.data.token;
                        ajaxRequest('api/v2.1/login', 'post', param, function (ret, err) {//007.005 会员登录
                            if (ret.state == 'success') {
                                $api.setStorage('account', account);

                                $api.setStorage('password', password);

                                $api.setStorage('token', ret.data.token);
                                $api.setStorage('mine', ret.data);
                                if (ret.data.isAvatar == false) {
                                    api.removeLaunchView({
                                        animation: {
                                            type: 'fade',
                                            duration: 500
                                        }
                                    });
                                    api.openWin({
                                        name: 'sign-edit',
                                        url: 'sign-edit.html',
                                        slidBackEnabled: false,
                                        bgColor: '#fff',
                                        delay: 200,
                                        pageParam: {
                                            nickName: ret.data.nickName
                                        }
                                    });
                                    return false;
                                } else {
                                    to_ucenter();
                                    return false;
                                }
                            }
                        });
                    }
                });
            }
            $('input[name=username]').val(account);
            $('input[name=password]').val(password);
            var appBundle;
            if (api.systemType == 'ios') {
                var obj = api.require('qq');
                obj.installed(function (ret, err) {
                    if (!ret.status) {
                        $('.login_qq').remove();
                    }
                });
                appBundle = 'wechat://';
                app_installed(appBundle, function (ret) {
                    if (!ret) {
                        $('.login_wx').remove();
                    }
                });
                appBundle = "sinaweibo://";
                app_installed(appBundle, function (ret) {
                    if (!ret) {
                        $('.login_wb').remove();
                    }
                });
            }
            to_login();
        }
    });
    api.addEventListener({
        name: 'close_sort'
    }, function (ret) {
        if (ret && ret.value) {
            var typ = ret.value.typ;
            if (typ == 1) {
                return false;
            }
            var sort_name = ret.value.sort_name;
            $('.left').find('span').html(sort_name);
        }
    });
    api.addEventListener({
        name: 'to_login'
    }, function (ret, err) {
        to_login();
    });
    api.addEventListener({
        name: 'to_ucenter'
    }, function (ret, err) {
        to_ucenter();
    });
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        clearTimeout(timePicker);
        //coding... auth:yx
        if (clickCount != 2) {
            api.toast({
                msg: '再按一次返回系统桌面'
            }, 'middle');
            clickCount++;
            timePicker = setTimeout(function () {
                clickCount = 1;
            }, 1000);
        } else {
            clickCount = 1;
            api.toLauncher();
        }
    });
    api.addEventListener({
        name: 'center_num'
    }, function (ret) {
        var num = $api.getStorage('center_num');
        if (num < 1) {
            $('.center_num1').addClass('none');
            $('.center_num2').addClass('none');
        } else if (num > 99) {
            $('.center_num1').html('99+');
            $('.center_num2').html('99+');
        } else {
            $('.center_num1').html(num);
            $('.center_num2').html(num);
        }
    });
    api.addEventListener({
        name: 'load_more_mn'
    }, function (ret) {
        var keywords = $('input[name=input-lx]').val();
        api.sendEvent({
            name: 'key_word_mn',
            extra: {
                key: keywords,
                searchType: searchType,
                typ: ret.value.key
            }
        });
    });
    api.addEventListener({
        name: 'load_more_ma'
    }, function (ret) {
        var keywords = $('input[name=input-lx]').val();
        api.sendEvent({
            name: 'key_word_ma',
            extra: {
                key: keywords,
                searchType: searchType,
                typ: ret.value.key
            }
        });
    });
    api.addEventListener({
        name: 'set_learning'
    }, function (ret) {
        api.closeFrameGroup({
            name: 'courseFrameGroup'
        });
        set_index(1);
    });
};
function talk_sort() {
    api.openFrame({
        name: 'talk-sort',
        url: 'talk-sort.html',
        bgColor: 'rgba(0,0,0,0)',
        rect: {
            x: leftLw,
            y: headLh,
            w: api.winWidth - leftLw,
            h: api.winHeight - headLh
        },
        pageParam: {
            typ: 2
        },
        bounces: false,
        delay: 200,
        reload: false
    });
}
//编辑头像
function modify() {
    api.openWin({
        name: 'modify',
        url: 'modify.html',
        delay: 200
    });
}

function set_index(a) {
    if (a == 5) {
        api.sendEvent({
            name: 'flush_cache'
        });
        api.sendEvent({
            name: 'init_cache'
        });
    }
    hideSearchBar();
    $('#header').attr('head', a);
    $('#slider li').removeClass().eq(a).addClass('active');

    api.closeFrame({name: 'set-info'});
    api.closeFrame({name: 'my-note-detail'});
    api.closeFrame({name: 'my-note-detail-f'});
    api.closeFrame({name: 'my-answer-detail'});
    api.closeFrame({name: 'my-answer-detail-f'});
    api.closeFrame({name: 'my-talk-detail'});
    api.closeFrame({name: 'my-talk-detail-f'});

    api.setFrameGroupAttr({
        name: 'homeFrameGroup',
        hidden: false
    });
    api.setFrameGroupIndex({
        name: 'homeFrameGroup',
        index: a
    });

    api.sendEvent({
        name: 'closeFrameAll'
    });

    api.sendEvent({
        name: 'hashomepage',
        extra: {
            sethomepage: a
        }
    });
    if (a == 1) {
        api.openFrameGroup({
            name: 'courseFrameGroup',
            rect: {
                x: leftLw,
                y: headSh,
                w: api.winWidth - leftLw,
                h: api.winHeight - headSh
            },
            index: 0,
            preload: 3,
            frames: [{//在学
                name: 'course-learning',
                url: 'course-learning.html'
            }, {//未激活
                name: 'course-noactive',
                url: 'course-noactive.html'
            }, {//已过期
                name: 'course-overdue',
                url: 'course-overdue.html'
            }]
        }, function (ret) {
            api.sendEvent({
                name: 'hascoursenav',
                extra: {
                    setnav: ret.index
                }
            });
        });
    } else {
        api.setFrameGroupAttr({
            name: 'courseFrameGroup',
            hidden: true
        });
    }
}

/*
 //主页新建笔记
 function newMyNote(){
 var par = api.pageParam;
 par.test = 'notes';
 api.openFrame({
 name: 'note-chapter-list',
 url: 'note-chapter-list.html',
 bgColor: '#ffffff',
 rect: {
 x: leftLw,
 y: 0,
 w: api.winWidth - leftLw,
 h: headLh
 },
 pageParam: par,
 bounces: false
 });
 api.setFrameGroupAttr({
 name : 'homeFrameGroup',
 hidden : true
 });
 }
 */


//中心消息数量
function center_num() {
    if (!isEmpty($api.getStorage('center_num'))) {
        var num = $api.getStorage('center_num');
        if (num < 1) {
            $('.center_num1').addClass('none');
            $('.center_num2').addClass('none');
        } else if (num > 99) {
            $('.center_num1').html('99+');
            $('.center_num2').html('99+');
        } else {
            $('.center_num1').html(num);
            $('.center_num2').html(num);
        }
    } else {
        var param = {};
        param.typeId = '';
        param.pageNo = 1;
        param.type = 1;
        param.isRead = 0;
        param.pageSize = 1;
        param.token = $api.getStorage('token');
        ajaxRequest('api/v2/message/list', 'get', param, function (ret, err) {
            if (err) {
                api.toast({
                    msg: err.msg,
                    location: 'middle'
                });
                return false;
            }
            if (ret && ret.state == 'success') {
                var num = isEmpty(ret.totalCount) ? '0' : ret.totalCount;
                if (num < 1) {
                    $('.center_num1').addClass('none');
                    $('.center_num2').addClass('none');
                } else if (num > 99) {
                    $('.center_num1').html('99+');
                    $('.center_num2').html('99+');
                } else {
                    $('.center_num1').html(num);
                    $('.center_num2').html(num);
                }
                $api.setStorage('center_num', num);
            } else {
                $('.center_num1').addClass('none');
                $('.center_num2').addClass('none');
                //api.toast({
                //	msg : ret.msg,
                //	location : 'middle'
                //});
            }
        });
    }
}
