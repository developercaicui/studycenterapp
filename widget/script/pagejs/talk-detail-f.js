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

// var ret = {"data":{"categoryId":" ","subjectId":"ff808081486933e601489c7a1aa20869","courseId":"8a22ecb5559bad0501559fe3297e0039","chapterId":"8a22ecb5566c7aea01566e4cf4730009","categoryName":" ","subjectName":" ","courseName":" ","chapterName":"\u7b2c\u4e09\u8282 \u7b79\u96c6\u8d44\u672c","taskId":"8a22ecb5566c7aea0156733c944d00aa","taskType":" ","taskprogress":"1001","favoriteCount":"0","replyCount":"2","clickCount":"21","title":"\u7b79\u8d44\u6210\u672c\u77e5\u8bc6\u70b92\u4e2d\u671f\u8d44\u672c\u6765\u6e90\uff08\u4e0b\uff09\u7684\u4f8b\u98982","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"41","taskCount":"11","taskCurrent":"0","uid":"34978","soundPath":" ","soundlen":"0","updateTime":"1492603892","clientType":"pc","content":"\u8bf7\u95ee\u8001\u5e08\uff0c\u5728\u8fd9\u9053\u9898\u4e2d\uff0c\u4e3a\u4ec0\u4e48\uff0c\u6298\u65e7\u7a0e\u76fe\uff0c\u8fd0\u8425\u6210\u672c\uff0c\u79df\u91d1\u73b0\u503c\u8981\u7528\u501f\u6b3e\u6210\u672c\u6298\u73b0\u3002\u800c\u6b8b\u503c\u5374\u7528\u8d44\u672c\u6210\u672c\u6298\u73b0\u5462\uff1f","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","userlevel":1,"userlevelid":"101","nikeName":"\u4e2d\u56fd\u5973\u5175","is_avatar":"1","avatar_default":"8","memberId":"8a22ecb55acc8fb0015ada2055e3075e","isdelete":0,"id":"39442","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb55acc8fb0015ada2055e3075e.jpg","contentHtml":"<p>\u8bf7\u95ee\u8001\u5e08\uff0c\u5728\u8fd9\u9053\u9898\u4e2d\uff0c\u4e3a\u4ec0\u4e48\uff0c\u6298\u65e7\u7a0e\u76fe\uff0c\u8fd0\u8425\u6210\u672c\uff0c\u79df\u91d1\u73b0\u503c\u8981\u7528\u501f\u6b3e\u6210\u672c\u6298\u73b0\u3002\u800c\u6b8b\u503c\u5374\u7528\u8d44\u672c\u6210\u672c\u6298\u73b0\u5462\uff1f<br><\/p>","isdisplay":true,"contentSummary":"\u8bf7\u95ee\u8001\u5e08\uff0c\u5728\u8fd9\u9053\u9898\u4e2d\uff0c\u4e3a\u4ec0\u4e48\uff0c\u6298\u65e7\u7a0e\u76fe\uff0c\u8fd0\u8425\u6210\u672c\uff0c\u79df\u91d1\u73b0\u503c\u8981\u7528\u501f\u6b3e\u6210\u672c\u6298\u73b0\u3002\u800c\u6b8b\u503c\u5374\u7528\u8d44\u672c\u6210\u672c\u6298\u73b0\u5462\uff1f","replys":[{"taskId":"8a22ecb5566c7aea0156733c944d00aa","taskType":" ","taskprogress":"1001","favoriteCount":"0","replyCount":"2","clickCount":"21","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"41","taskCount":"11","taskCurrent":"0","pid":"51759","uid":"34978","soundPath":" ","soundlen":"0","updateTime":"1492604439","clientType":"pc","content":"\u8fd8\u6709\u5c31\u662f\u4f60\u5df2\u7ecf\u79df\u4e86\uff0c\u8fd9\u91cc\u79df\u91d110\uff0c000\u4e0d\u5e94\u8be5\u5c31\u662f\u51fa\u79df\u4eba\u7ba1\u4f60\u8981\u7684\u7a0e\u524d\u79df\u91d1\u5417\uff1f\u4e3a\u4ec0\u4e48\u8ba1\u7b97\u7684\u65f6\u5019\u8fd8\u8981\u4e58\u4e0a\uff081-\u7a0e\u7387\uff09","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","userlevel":1,"userlevelid":"101","nikeName":"\u4e2d\u56fd\u5973\u5175","is_avatar":"1","avatar_default":"8","memberId":"8a22ecb55acc8fb0015ada2055e3075e","isdelete":0,"id":"51759","levelimg":"\/upload\/usrlevel.png","headImg":"\/upload\/avatar\/big_8a22ecb55acc8fb0015ada2055e3075e.jpg","contentHtml":"<p>\u8fd8\u6709\u5c31\u662f\u4f60\u5df2\u7ecf\u79df\u4e86\uff0c\u8fd9\u91cc\u79df\u91d110\uff0c000\u4e0d\u5e94\u8be5\u5c31\u662f\u51fa\u79df\u4eba\u7ba1\u4f60\u8981\u7684\u7a0e\u524d\u79df\u91d1\u5417\uff1f\u4e3a\u4ec0\u4e48\u8ba1\u7b97\u7684\u65f6\u5019\u8fd8\u8981\u4e58\u4e0a\uff081-\u7a0e\u7387\uff09<br><\/p>","isdisplay":true,"contentSummary":"\u8fd8\u6709\u5c31\u662f\u4f60\u5df2\u7ecf\u79df\u4e86\uff0c\u8fd9\u91cc\u79df\u91d110\uff0c000\u4e0d\u5e94\u8be5\u5c31\u662f\u51fa\u79df\u4eba\u7ba1\u4f60\u8981\u7684\u7a0e\u524d\u79df\u91d1\u5417\uff1f\u4e3a\u4ec0\u4e48\u8ba1\u7b97\u7684\u65f6\u5019\u8fd8\u8981\u4e58\u4e0a\uff081-\u7a0e\u7387\uff09","del_permission":0},{"taskId":"8a22ecb5566c7aea0156733c944d00aa","taskType":" ","taskprogress":"1001","favoriteCount":"0","replyCount":"2","clickCount":"21","denyReply":"false","toporder":"0","bestorder":"0","adpic":null,"fid":"41","taskCount":"11","taskCurrent":"0","pid":"51869","uid":"3530","soundPath":" ","soundlen":"0","updateTime":"1492701735","clientType":"pc","content":"\u540c\u5b66\uff0c\u4f60\u597d\u3002\u4f60\u8fd9\u6837\u7406\u89e3\u5427\u3002\u6298\u65e7\u7a0e\u76fe\u548c\u8fd0\u8425\u6210\u672c\uff0c\u79df\u91d1\u90fd\u662f\u8ddf\u501f\u6b3e\u76f8\u5173\u7684\uff0c\u6b8b\u503c\u7b97\u662f\u56fa\u5b9a\u8d44\u4ea7\u7684\u4e00\u90e8\u5206\uff0c\u6240\u4ee5\u7528\u8d44\u672c\u6210\u672c\u6298\u73b0\u3002\u8fd9\u91cc\u5c31\u6b8b\u503c\u7b97\u662f\u4e00\u4e2a\u4f8b\u5916\u3002\u6240\u4ee5\u4f60\u8bb0\u4f4f\u8fd9\u5c31\u597d\u5566\u3002\u56e0\u4e3a\u4f60\u4ea4\u79df\u91d1\uff0c\u79df\u91d1\u4f5c\u4e3a\u4e00\u79cd\u8d39\u7528\u662f\u53ef\u4ee5\u5728\u7a0e\u524d\u6263\u9664\u7684\uff0c\u662f\u6709\u62b5\u7a0e\u4f5c\u7528\u7684\u3002","bbstype":"1","praiseCount":"0","replaytype":"0","imgPath":"","userlevel":1,"userlevelid":"4","nikeName":"huyunong","is_avatar":"1","avatar_default":"7","memberId":"ff8080814a98ec3e014a990eab9a0096","isdelete":0,"id":"51869","levelimg":"\/upload\/userlevel4.png","headImg":"\/upload\/avatar\/big_ff8080814a98ec3e014a990eab9a0096.jpg","contentHtml":"<p>\u540c\u5b66\uff0c\u4f60\u597d\u3002\u4f60\u8fd9\u6837\u7406\u89e3\u5427\u3002\u6298\u65e7\u7a0e\u76fe\u548c\u8fd0\u8425\u6210\u672c\uff0c\u79df\u91d1\u90fd\u662f\u8ddf\u501f\u6b3e\u76f8\u5173\u7684\uff0c\u6b8b\u503c\u7b97\u662f\u56fa\u5b9a\u8d44\u4ea7\u7684\u4e00\u90e8\u5206\uff0c\u6240\u4ee5\u7528\u8d44\u672c\u6210\u672c\u6298\u73b0\u3002\u8fd9\u91cc\u5c31\u6b8b\u503c\u7b97\u662f\u4e00\u4e2a\u4f8b\u5916\u3002\u6240\u4ee5\u4f60\u8bb0\u4f4f\u8fd9\u5c31\u597d\u5566\u3002\u56e0\u4e3a\u4f60\u4ea4\u79df\u91d1\uff0c\u79df\u91d1\u4f5c\u4e3a\u4e00\u79cd\u8d39\u7528\u662f\u53ef\u4ee5\u5728\u7a0e\u524d\u6263\u9664\u7684\uff0c\u662f\u6709\u62b5\u7a0e\u4f5c\u7528\u7684\u3002<\/p>","isdisplay":true,"contentSummary":"\u540c\u5b66\uff0c\u4f60\u597d\u3002\u4f60\u8fd9\u6837\u7406\u89e3\u5427\u3002\u6298\u65e7\u7a0e\u76fe\u548c\u8fd0\u8425\u6210\u672c\uff0c\u79df\u91d1\u90fd\u662f\u8ddf\u501f\u6b3e\u76f8\u5173\u7684\uff0c\u6b8b\u503c\u7b97\u662f\u56fa\u5b9a\u8d44\u4ea7\u7684\u4e00\u90e8\u5206\uff0c\u6240\u4ee5\u7528\u8d44\u672c\u6210\u672c\u6298\u73b0\u3002\u8fd9\u91cc\u5c31\u6b8b\u503c\u7b97\u662f\u4e00\u4e2a\u4f8b\u5916\u3002\u6240\u4ee5\u4f60\u8bb0\u4f4f\u8fd9\u5c31\u597d\u5566\u3002\u56e0\u4e3a\u4f60\u4ea4\u79df\u91d1\uff0c\u79df\u91d1\u4f5c\u4e3a\u4e00\u79cd\u8d39\u7528\u662f\u53ef\u4ee5\u5728\u7a0e\u524d\u6263\u9664\u7684\uff0c\u662f\u6709\u62b5\u7a0e\u4f5c\u7528\u7684\u3002","del_permission":0}]},"state":"success","msg":""}
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

