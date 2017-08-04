function open_img(obj) {
	api.openFrame({
		name : 'select-photo-f',
		url : 'select-photo-f.html',
		delay : 200
	});
}

var pageSize = 20;
var is_loaded = false;
var totalCount = '';
var flo;
var num;
var is_loding=false;

// var ret = {"data":{"categoryId":"ff808081473905e701475cd3c2080001","subjectId":"ff808081473905e701476204cb6c006f","courseId":"ff8080814dad5062014db32051b801a2","chapterId":"ff8080814dad5062014db32051d501a7","categoryName":"ACCA","subjectName":"F1","courseName":"ACCA F1 Accountant in Business","chapterName":"Chapter 1 Organisation and Types of Organisation","taskId":"ff8080814dad5062014db333f30d0255","taskType":"video","taskprogress":"4","favoriteCount":"0","replyCount":"4","clickCount":"21","title":"\u6d4b\u8bd5\u7ed3\u679c","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"10","taskCount":"0","taskCurrent":"0","uid":"19277","soundPath":" ","soundlen":"0","updateTime":"1500020083","clientType":"iphone","content":"\u6d4b\u8bd5\u7ed3\u679c\u770b\u663e\u793a\u662f\u5426\u6b63\u5e38","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","is_control":"0","userlevel":1,"userlevelid":"101","nikeName":"Rainy02","is_avatar":"1","avatar_default":"0","memberId":"8a22ecb55474935701547591f52d044e","isdelete":0,"id":"43028","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb55474935701547591f52d044e.jpg","contentHtml":"\u6d4b\u8bd5\u7ed3\u679c\u770b\u663e\u793a\u662f\u5426\u6b63\u5e38","isdisplay":true,"contentSummary":"\u6d4b\u8bd5\u7ed3\u679c\u770b\u663e\u793a\u662f\u5426\u6b63\u5e38","replys":[{"taskId":"ff8080814dad5062014db333f30d0255","taskType":"video","taskprogress":"4","favoriteCount":"0","replyCount":"4","clickCount":"21","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"10","taskCount":"0","taskCurrent":"0","pid":"59948","uid":"16838","soundPath":" ","soundlen":"0","updateTime":"1500083546","clientType":"aphone","content":"\u6b63\u5e38","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","is_control":"0","userlevel":1,"userlevelid":"101","nikeName":"cc69v6","is_avatar":"1","avatar_default":"7","memberId":"8a22ecb5532c7c88015331f559cf1a0a","isdelete":0,"id":"59948","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb5532c7c88015331f559cf1a0a.jpg","contentHtml":"\u6b63\u5e38","isdisplay":true,"contentSummary":"\u6b63\u5e38","del_permission":0},{"taskId":"ff8080814dad5062014db333f30d0255","taskType":"video","taskprogress":"4","favoriteCount":"0","replyCount":"4","clickCount":"21","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"10","taskCount":"0","taskCurrent":"0","pid":"61999","uid":"19277","soundPath":" ","soundlen":"0","updateTime":"1501143158","clientType":"pc","content":"\u6b63\u5e38\uff0b1","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","is_control":"0","userlevel":1,"userlevelid":"101","nikeName":"Rainy02","is_avatar":"1","avatar_default":"0","memberId":"8a22ecb55474935701547591f52d044e","isdelete":0,"id":"61999","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb55474935701547591f52d044e.jpg","contentHtml":"<p>\u6b63\u5e38\uff0b1<\/p><br>","isdisplay":true,"contentSummary":"\u6b63\u5e38\uff0b1","del_permission":1},{"taskId":"ff8080814dad5062014db333f30d0255","taskType":"video","taskprogress":"4","favoriteCount":"0","replyCount":"4","clickCount":"21","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"10","taskCount":"0","taskCurrent":"0","pid":"62001","uid":"19277","soundPath":" ","soundlen":"0","updateTime":"1501143358","clientType":"pc","content":"\u56fe\u7247\u4e0a\u4f20\u6d4b\u8bd5","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","is_control":"0","userlevel":1,"userlevelid":"101","nikeName":"Rainy02","is_avatar":"1","avatar_default":"0","memberId":"8a22ecb55474935701547591f52d044e","isdelete":0,"id":"62001","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb55474935701547591f52d044e.jpg","contentHtml":"<p>\u56fe\u7247\u4e0a\u4f20\u6d4b\u8bd5<\/p><br><img src=\"http:\/\/cdnstatic.caicui.com\/\/\/upload\/2017\/07\/27\/E1C2334DC40A48E1A13689ECD2CDF3E2.jpg\"><br>","isdisplay":true,"contentSummary":"\u56fe\u7247\u4e0a\u4f20\u6d4b\u8bd5","del_permission":1},{"taskId":"ff8080814dad5062014db333f30d0255","taskType":"video","taskprogress":"4","favoriteCount":"0","replyCount":"4","clickCount":"21","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"10","taskCount":"0","taskCurrent":"0","pid":"62002","uid":"19277","soundPath":" ","soundlen":"0","updateTime":"1501143489","clientType":"pc","content":"\u56de\u590d\u56fe\u7247\u6d4b\u8bd5","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","is_control":"0","userlevel":1,"userlevelid":"101","nikeName":"Rainy02","is_avatar":"1","avatar_default":"0","memberId":"8a22ecb55474935701547591f52d044e","isdelete":0,"id":"62002","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb55474935701547591f52d044e.jpg","contentHtml":"<p>\u56de\u590d\u56fe\u7247\u6d4b\u8bd5<\/p><br><img src=\"http:\/\/cdnstatic.caicui.com\/\/upload\/2017\/07\/27\/B894A79A5BCF4059BDDB0C46715EE53B.jpg\"><br>","isdisplay":true,"contentSummary":"\u56de\u590d\u56fe\u7247\u6d4b\u8bd5","del_permission":1}]},"state":"success","msg":""}
// var tpl_main = $('#tpl_main').html();
// var content_main = doT.template(tpl_main);
// var tpl_content = $('#tpl_content').html();
// var cont;
// cont = doT.template(tpl_content);
// $('#main1').html(content_main(ret.data));
// $('#content').append(cont({
// 	'res1' : ret.data.replys,
// 	'res2' : 1
// }));
//补充问题按钮样式
  function addAnswer(obj) {
      if ($(obj).attr('isadd') == 'yes') {
      $(obj).removeClass('active').attr('isadd', 'no');
      api.sendEvent({
          name: 'addAnswer',
          extra: {isadd: 'no'}
          });
      } else {
  
          var memberId = get_loc_val('mine', 'memberId');
      if (memberId == api.pageParam.memberId) {
          $(obj).addClass('active').attr('isadd', 'yes');
          num = 1;
          api.sendEvent({
              name: 'numchange',
              extra: {key1: num}
          });
          api.sendEvent({
              name: 'addAnswer',
              extra: {isadd: 'yes'}
          });
      } else {
          api.toast({msg: '只可以补充自己发布的问题'});
          }
      }
  }
function getData(page) {
	var param = {};
	param.id = api.pageParam.id;
	//param.id='ff8080814e9b907a014eb49955473e3f';//'ff8080814e9b907a014eb49955473e3f';
	param.pageNo = page;
	param.pageSize = pageSize;
	//param.ordertype = 2;
	param.token = $api.getStorage('token');
    if(page==1&&show_pro && !is_loding){
        api.showProgress({
            title:'加载中',
            modal:false
        });
    }
//	ajaxRequest('api/studytools/discussdetail/v2.1', 'get', param, function(ret, err) {//003.301.1  讨论详情和回复列表
	ajaxRequest('api/studytools/bbsdetail/v1.0', 'get', param, function(ret, err) {//003.301.1  讨论详情和回复列表
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
		if (ret && ret.state == 'success') {
			var memberId = get_loc_val('mine', 'memberId');
			//if(api.pageParam.memberId == memberId){
			//    api.sendEvent({
			//        name: 'notes_bj_lx',
			//        extra: {key1: ret.data.imgPath,soundPath:ret.data.soundPath,soundlen:ret.data.soundlen,content:ret.data.content}
			//    });
			//}
			// console.log(JSON.stringify(ret))
			var tpl_main = $('#tpl_main').html();
			var content_main = doT.template(tpl_main);
			var tpl_content = $('#tpl_content').html();
			var cont;
			totalCount = ret.data.totalCount;
			if (page == 1) {
				if (isEmpty(ret.data.id)) {
					$('body').addClass('null');
				}
				$('#main1').html(content_main(ret.data));
				if (ret.data.replys.length > 0) {
					flo = 1;
					cont = doT.template(tpl_content);
					$('#content').html(cont({
						'res1' : ret.data.replys,
						'res2' : flo
					}));
				}else{
                    is_loaded=true;
                }
			} else {
				if (ret.data.replys.length > 0) {
					flo = (page - 1) * 20 + 1;
					cont = doT.template(tpl_content);
					$('#content').append(cont({
						'res1' : ret.data.replys,
						'res2' : flo
					}));
				}else{
                    is_loaded=true;
                }
			}
			audioDom();
			api.parseTapmode();
		} else {
			//api.toast({
			//	msg : ret.msg,
			//	location : 'middle'
			//});
		}
	});
}
var currentPage = 0;
function reload(){
    is_loaded = false;
    //var pa= Math.floor( replay_con/20)+1;
    //alert(pa);
    getData(1);
    currentPage=0;
}
apiready = function() {
	getData(1);
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
		is_loaded = false;
		currentPage = 1;
	});
	//滚动到底部
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
        if(!is_loaded){
            currentPage++;
            getData(currentPage);
        }
	});
	api.addEventListener({
		name : 'talk_detail_f_lx'
	}, function(ret) {
		is_loaded = false;
		getData(1);
	});
};

