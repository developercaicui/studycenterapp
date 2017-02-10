var setAudio;
var audiosrc = new Date();
var lx_path = '', lx_duration, soundPath = '';
var _t = $('#audio');
$('body').delegate('#audio', 'touchstart', function(event) {
    window.clearInterval(setAudio);
    event.preventDefault();
    var cirVal = parseInt(_t.find('.val').text());
    var cirW = parseInt(_t.width());
    var cirI = _t.find('circle').eq(1);

    if (!_t.hasClass('end')) {
        _t.addClass('ing');
        setAudio = setInterval(function() {
            if (cirVal > 1799) {
                recordEnd();
            } else {
                cirVal += 1;
                var percent = cirVal / 1800, perimeter = Math.PI * 0.9 * cirW;
                $(cirI).css('stroke-dasharray', perimeter * percent + " " + perimeter * (1 - percent));
                _t.find('.val').text(cirVal);
                $('.newtip').text((cirVal * .1).toFixed(1));
            }
        }, 100);
        api.startRecord({
            path : 'fs://mp3/' + audiosrc + '.amr'
        });
    }
});
$('body').delegate('#audio', 'touchend', function(event) {
    window.clearInterval(setAudio);
    event.preventDefault();
    var cirVal = parseInt(_t.find('.val').text());
    if (cirVal < 30) {
        api.stopRecord();
        api.alert({
            msg : '录音时间太短'
        });
        window.clearInterval(setAudio);
        resetAudio();
        //      return false;
    } else {
        recordEnd();
    }
});

function recordEnd() {
    $('.editor-bar').attr('hasaud',1);
    _t.removeClass('ing').addClass('end');
    window.clearInterval(setAudio);
    api.stopRecord(function(ret, err) {
        if (ret) {
            lx_path = 'fs://mp3/' + audiosrc + '.amr';
            lx_duration = ret.duration;
            $api.setStorage('lx_duration', ret.duration);
            $('.icon-play').attr('url', lx_path);
            var headers = {
                'X-Requested-With' : 'XMLHttpRequest'
            };
            api.ajax({
                url : common_url + '/' + 'api/v2.1/commons/fileUpload',
                method : 'post',
                headers : headers,
                timeout : 120,
                cache : false,
                data : {
                    values : {
                        'token' : $api.getStorage('token'),
                        'mediatime' : lx_duration
                    },
                    files : {
                        'file' : lx_path
                    }
                }
            }, function(ret, err) {
                api.hideProgress();
                if (err) {
                    api.toast({
                        msg : err.msg,
                        location : 'middle'
                    });
                    return false;
                }
                if (ret && ret.state == 'success') {
                    soundPath = ret.data.path;
                    $api.setStorage('soundPath', ret.data.path);
                }else{
                    api.toast({
                        msg: ret.msg,
                        location: 'middle'
                    });
                }
            });
        }
    })
}

function clear_data() {
    $('textarea').val('');
    lx_path = '';
    lx_duration = '';
    soundPath = '';
}

function resetAudio() {
    $('.editor-bar').attr('hasaud',0);
    $('.newtip,.val').text('0.0');
    _t.find('circle').eq(1).css('stroke-dasharray', "1 9999999");
    _t.removeClass('ing end');
    $api.setStorage('lx_duration', '');
    $api.setStorage('soundPath', '');
}

function playAudioMe(item) {
    var _url = $(item).attr('url');
    $(item).addClass('play');
    if (isEmpty($(item).attr('bg'))) {
        api.startPlay({
            path : _url
        }, function() {
            $(item).removeClass('play');
        });
        $(item).attr('bg', '1');
    } else {
        $(item).removeClass('play');
        api.stopPlay();
        $(item).attr('bg', '');
    }
}

function my_focus() {
    toggleEditor('full');
    $('.newaudio,.newimg').hide();
}

//select-phone
function upload(img) {
    $('.set-photo').hide();
    api.showProgress({
        title : '上传中',
        modal : true
    });
    var headers = {
        'X-Requested-With' : 'XMLHttpRequest'
    };
    api.ajax({
        url : common_url + '/' + 'api/v2.1/commons/fileUpload',
        method : 'post',
        headers : headers,
        timeout : 120,
        cache : false,
        data : {
            values : {
                'token' : $api.getStorage('token')
            },
            files : {
                'file' : img
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        if (err) {
            api.toast({
                msg : err.msg,
                location : 'middle'
            });
            return false;
        }
        if (ret && ret.state == 'success') {
            var imgs = ret.data;
            var url = static_url + imgs.path;
            var url1 = imgs.path;
            var str = '<div class="checkimg" data-id="' + url1 + '" style="background-image:url(' + url + ')" ><i class="icon-close"></i></div>';
            if ($api.getStorage('img')) {
                ids = $api.getStorage('img');
                ids += ',' + url1;
            } else {
                ids = url1;
            }
            $api.setStorage('img', ids);
            var tupian = [];
            $('.checkimg').each(function(i) {
                tupian.push($('.checkimg').eq(i).attr('data-id'));
            });
            if (tupian.length == 4) {
                //api.toast({msg: '图片最多可以上传5张'});
                $('.addimg').hide();
                //return;
            }
            $('.addimg').after(str);
            $('.editor-bar').attr('hasimg',1);
            //api.sendEvent({
            //    name: 'select_photo_change',
            //    extra: ret.data
            //});
            //api.closeFrame();
            $('.backdrop1').hide();
        } else {
            api.toast({
                msg: ret.msg,
                location: 'middle'
            });
            $('.backdrop1').hide();
        }
    });
}

function getPic(type, w, h) {
    $('.backdrop').unbind();
    if (api && api.systemType == '131231312') {
        var imageCrop = api.require('imageCrop');
        switch (type) {
            case 'camera':
                imageCrop.takePhoto(function(ret, err) {
                    $('.backdrop').click(function() {
                        $api.setStorage('sign-photo', 1);
                        //api.closeFrame();
                    });
                    if (err) {
                        $api.setStorage('sign-photo', 1);
                        //api.closeFrame();
                        return false;
                    }
                    if (ret && ret.imgPath) {
                        if (!in_array(getFixName(ret.imgPath), allowPicTtype)) {
                            api.toast({
                                msg: '无法上传此种格式的图片',
                                location: 'middle'
                            });
                            return false;
                        }
                        imageCrop.clipPhoto({
                            "imgPath" : ret.imgPath,
                            "height" : h,
                            "width" : w
                        }, function(ret1, err1) {
                            if (err1) {
                                api.toast({
                                    msg : err1.msg,
                                    location : 'middle'
                                });
                                $api.setStorage('sign-photo', 1);
                                //api.closeFrame();
                                return false;
                            }
                            $('body').bind('click', function() {
                                $api.setStorage('sign-photo', 1);
                                //api.closeFrame();
                            });
                            if (ret1 && ret1.imgPath) {
                                upload(ret1.imgPath);
                            }
                        });
                    }
                });
                break;
            case 'album':
                imageCrop.getPhoto(function(ret, err) {
                    $('.backdrop').click(function() {
                        $api.setStorage('sign-photo', 1);
                        //api.closeFrame();
                    });
                    if (err) {
                        //api.closeFrame();
                        return false;
                    }
                    if (ret && ret.imgPath) {
                        if (!in_array(getFixName(ret.imgPath), allowPicTtype)) {
                            api.toast({
                                msg: '无法上传此种格式的图片',
                                location: 'middle'
                            });
                            return false;
                        }
                        imageCrop.clipPhoto({
                            "imgPath" : ret.imgPath,
                            "height" : h,
                            "width" : w
                        }, function(ret1, err1) {
                            if (err1) {
                                api.toast({
                                    msg : err1.msg,
                                    location : 'middle'
                                });
                                return false;
                            }
                            if (ret1 && ret1.imgPath) {
                                upload(ret1.imgPath);
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
    } else {
        api.getPicture({
            sourceType : type,
            encodingType : 'jpg',
            destinationType : 'url',
            targetWidth : w,
            targetHeight : h,
            allowEdit : false
        }, function(ret, err) {
            $('.backdrop').click(function() {
                $api.setStorage('sign-photo', 1);
                //api.closeFrame();
            });
            if (err) {
                $api.setStorage('sign-photo', 1);
                //api.closeFrame();
                return false;
            }
            if (ret && ret.data) {
                if (!in_array(getFixName(ret.data), allowPicTtype)) {
                    api.toast({
                        msg: '无法上传此种格式的图片',
                        location: 'middle'
                    });
                    return false;
                }
                upload(ret.data);
            }
        });
    }
}

var lx_soundPath = '';
var lx_lens = 0;
var num = '';
var param_data;
apiready = function() {
    param_data=api.pageParam;
    $('.backdrop1,.set-photo').hide();
    $('textarea').focus();

    $api.setStorage('sign-photo', 2);
    $('.backdrop').click(function() {
        $api.setStorage('sign-photo', 1);
        //api.closeFrame();
    });

    //监听关闭
    api.addEventListener({
        name : 'closeFrameAll'
    }, function() {
        api.closeFrame();
    });



    // 设置编辑条显示按钮

    $('.editor-bar').attr('type', '1');
    $('.editor-bar .editor-tool .btn,i,.textarea').css({
        'display' : 'block'
    });
    api.addEventListener({
        name : 'notes_bj_lx'
    }, function(ret) {
        if (ret && ret.value) {
            if (ret.value.key1 != '') {
                $api.setStorage('img', ret.value.key1);
                imgPath = ret.value.key1.split(',');
                var str = '';
                $.each(imgPath, function(i, item) {
                    var url = static_url + item;
                    str += '<div class="checkimg" data-id="' + item + '" style="background-image:url(' + url + ')" ><i class="icon-close"></i></div>';
                });
                $('.addimg').after(str);
                $('.editor-bar').attr('hasimg',1);
            }
            lx_lens = ret.value.soundlen;
            lx_soundPath = ret.value.soundPath;
            $api.setStorage('lx_lens', ret.value.soundlen);
            $api.setStorage('lx_soundPath', ret.value.soundPath);
            $('.textarea').val(ret.value.content);
            if (lx_lens == 0 || lx_lens == '' || lx_soundPath == '') {

            } else {
                //$('.newaudio').append('<div class="voice-player voice_wz" tapmode, url='+static_url+ret.value.soundPath+', onclick="playAudio(this)", bg, time='+ret.value.soundlen+'></div>');
                $('.newaudio').append('<div class="voice-player" tapmode, url="' + static_url + ret.value.soundPath + '", onclick="playAudio(this)", bg, time="' + ret.value.soundlen + '" style="position: absolute;top:5%;left:5%;"></div>');
            }
            audioDom();
        }
    });

    //新建笔记视频页面
    api.addEventListener({
        name : 'new-notes-video'
    }, function(ret) {
        var tmptype = ret.value.type;
        new_notes_video(tmptype);
    });
    //图片回调
    var ids = '';
    api.addEventListener({
        name : 'select_photo_change'
    }, function(ret, err) {
        var imgs = ret.value;
        var url = static_url + imgs.path;
        var url1 = imgs.path;
        var str = '<div class="checkimg" data-id="' + url1 + '" style="background-image:url(' + url + ')" ><i class="icon-close"></i></div>';
        if ($api.getStorage('img')) {
            ids = $api.getStorage('img');
            ids += ',' + url1;
        } else {
            ids = url1;
        }
        $api.setStorage('img', ids);
        var tupian = [];
        $('.checkimg').each(function(i) {
            tupian.push($('.checkimg').eq(i).attr('data-id'));
        });
        if (tupian.length == 4) {
            $('.addimg').hide();
        }
        $('.addimg').after(str);
        $('.editor-bar').attr('hasimg',1);
    });
    //问题补充
    //api.addEventListener({
    //    name : 'addAnswer'
    //}, function(ret) {
    //    add_answer();
    //});
    ////问题补充样式传参用
    //api.addEventListener({
    //    name : 'numchange'
    //}, function(ret) {
    //    num = ret.value.key1;
    //});
};
//问答补充
function add_answer(nu) {
    num = nu;
}
//取消问答补充
function cancel_answer() {
    num = 0;
}


$('.newimg').delegate('.icon-close', 'click', function() {
    var id = '';
    $(this).parent().remove();
    $('.addimg').show();
    $('.checkimg').each(function(i) {
        id += $('.checkimg').eq(i).attr('data-id') + ',';
    });
    var aa = id.substring(0, id.length - 1);
    $api.setStorage('img', aa);
    if(aa < 1) {
        $('.editor-bar').attr('hasimg',0);
    }
});


var bar_w = $('.editor-bar').width();
function toggleEditor(e) {
    //return false;
    var _y;
    if (e == 'full') {
        _y = 0;
    } else if (e == 'mini') {
        _y = api.winHeight - footSh;
        $('.newaudio,.newimg').hide();
        $('textarea').blur();
        api.sendEvent({
            name : 'addAnswerStyle' //关闭“问题补充”选中样式
        });
    }
    api.openFrame({
        name : 'footer-answer',
        url : 'footer-answer.html',
        bgColor : 'rgba(0,0,0,0)',
        rect : {
            x : api.winWidth - bar_w,
            y : _y,
            w : bar_w,
            h : api.winHeight - _y
        },
        scaleEnabled : false,
        bounces: true,
        pageParam:api.pageParam,
        softInputMode : 'resize',
        delay : 200
    });
    //alert(api.winHeight);
    //alert(_y);
}

function open_img() {
    $('.backdrop1,.set-photo').show();
    return false;
}


$('.backdrop1').on('touchend', function() {
    $('.backdrop1,.set-photo').hide();
});
function open_edit(obj) {
    toggleEditor('full');

    if ($(obj).hasClass('icon-recording-o')) {
        $('.newaudio').show();
        $('.newimg').hide();
        circleProgress();
    } else if ($(obj).hasClass('icon-picture') || $(obj).hasClass('icon-picture2')) {
        $('.newimg').show();
        $('.newaudio').hide();
    } else if ($(obj).hasClass('textarea')) {
        $('.newaudio,.newimg').hide();
    }
}


//问答补充
var is_define = true;
function sub() {
    if (is_define == true) {
        var param;
        var memberId = get_loc_val('mine', 'memberId');
        var lj = param_data.lx;
        var systype = api.systemType;
        var appType;
        if (systype == 'ios') {
            appType = 'iPad';
        } else if (systype == 'android') {
            appType = 'aPad';
        }
        //处理图片
        var chang = '';
        $('.checkimg').each(function(i) {
            chang += $('.checkimg').eq(i).attr('data-id') + ',';
        });
        var aa = chang.substring(0, chang.length - 1);
        if (lj == 'answer-detail') {//问题详情页
            //if (api.pageParam.memberId == memberId) {
            //if (num == 1) {
                if (param_data.id == '') {
                    api.toast({
                        msg : 'id不能为空',
                        location : 'middle'
                    });
                    return false;
                }
                if (param_data.courseId == '') {
                    api.toast({
                        msg : '课程id不能不为空',
                        location : 'middle'
                    });
                    return false;
                }
                if (param_data.taskId == '') {
                    api.toast({
                        msg : '任务id不能为空',
                        location : 'middle'
                    });
                    return false;
                }
                if ($.trim($('.textarea').val()) == '') {
                    api.toast({
                        msg : '内容不能为空',
                        location : 'middle'
                    });
                    return false;
                }
                param = {
                    token : $api.getStorage('token'),
                    id : param_data.id, //笔记id，如果为空，则为添加，否则为修改
                    content : $('.textarea').val(), //提问内容
                    imgPath : isEmpty(aa) ? '' : aa, //图片数组，图片路径（以’，’分隔）
                    replaytype : 1, //0:回答问题 1:补充问题
                    courseId : param_data.courseId, //回答/补充问题时候的课程id
                    taskId : param_data.taskId, //回答/补充问题时候的任务id
                    soundlen : isEmpty(lx_duration) ? '' : lx_duration, //声音文件的长度
                    soundPath : isEmpty(soundPath) ? '' : soundPath
                };
                api.showProgress({
                    title : '处理中',
                    modal : true
                });
                is_define = false;
                ajaxRequest('api/studytools/questionreply/v2.1', 'post', param, function(ret, err) {//003.212  问题补充
                    api.hideProgress();
                    if (err) {
                        api.toast({
                            msg : err.msg,
                            location : 'middle'
                        });
                        return false;
                    }
                    if (ret && ret.state == 'success') {
                        num = 0;
                        lx_duration = 0;
                        soundPath = '';
                        $('.checkimg').remove();
                        //$('.textarea').val('').attr('placeholder', '评论...');
                        $api.rmStorage('content');
                        $api.rmStorage('title');
                        $api.rmStorage('img');
                        $api.rmStorage('lx_duration');
                        $api.rmStorage('soundPath');
                        $api.rmStorage('isPublic');
                        $api.rmStorage('lx_lens');
                        $api.rmStorage('lx_soundPath');
                        resetAudio();
                        api.sendEvent({
                            name : 'answer-detail-lx'
                        });
                        setTimeout(function() {
                            is_define = true;
                            api.closeFrame();
                        }, 200);

                        clear_data();
                    }
                });
            /*
            } else {
                if ($.trim($('.textarea').val()) == '') {
                    api.toast({
                        msg : '内容不能为空',
                        location : 'middle'
                    });
                    return false;
                }
                if (param_data.id == '') {
                    api.toast({
                        msg : 'id不能为空',
                        location : 'middle'
                    });
                    return false;
                }
                if (param_data.courseId == '') {
                    api.toast({
                        msg : '课程id不能不为空',
                        location : 'middle'
                    });
                    return false;
                }
                if (param_data.taskId == '') {
                    api.toast({
                        msg : '任务id不能为空',
                        location : 'middle'
                    });
                    return false;
                }

                param = {
                    token : $api.getStorage('token'),
                    id : param_data.id, //笔记id，如果为空，则为添加，否则为修改
                    content : $('.textarea').val(), //提问内容
                    imgPath : isEmpty(aa) ? '' : aa, //图片数组，图片路径（以’，’分隔）
                    replaytype : 0,
                    //courseId: api.pageParam.courseId,//回答/补充问题时候的课程id
                    //taskId: api.pageParam.taskId,//回答/补充问题时候的任务id
                    soundlen : isEmpty(lx_duration) ? '' : lx_duration, //声音文件的长度
                    soundPath : isEmpty(soundPath) ? '' : soundPath
                };
                is_define = false;
                api.showProgress({
                    title : '处理中',
                    modal : true
                });
                ajaxRequest('api/studytools/questionreply/v2.1', 'post', param, function(ret, err) {//003.212  问题回答
                    api.hideProgress();
                    if (err) {
                        is_define = true;
                        api.toast({
                            msg : err.msg,
                            location : 'middle'
                        });
                        return false;
                    }
                    if (ret && ret.state == 'success') {
                        lx_duration = 0;
                        soundPath = '';
                        $api.rmStorage('content');
                        $api.rmStorage('title');
                        $api.rmStorage('img');
                        $api.rmStorage('lx_duration');
                        $api.rmStorage('soundPath');
                        $api.rmStorage('isPublic');
                        $api.rmStorage('lx_lens');
                        $api.rmStorage('lx_soundPath');
                        $('.checkimg').remove();
                        resetAudio();
                        api.sendEvent({
                            name : 'answer-detail-lx'
                        });
                        setTimeout(function() {
                            is_define = true;
                        }, 1000);
                        toggleEditor('mini');
                        clear_data();
                    }else{
                        is_define = true;
                    }
                });
            }
            */
        }
    }
}
