var course_detail;
var pageName = 'catalog';
var total = 0;
var task_arr;
var courseId; //课程id

var is_debug = false;
    var getStatusTime = null;
    var videoDownInfo =new Object(); //缓存每个节点的下载状态，一个节点一个id
    var videochangelist = $api.getStorage("videochangelist") ? $api.getStorage("videochangelist") : ""; //记录每次定时器和数据库同步数据后发生改变的dom节点id
    var couselist = ""; //记录缓存包括的课程id
    var lastgettime = 1388509261;//记录每次获取数据库的时间点，下次获取就只获取该时间点之后变化的记录(第一次获取可以获取2014年1月1日1时1分1秒//)


    function tasksCache(){
        if(is_debug){
          var arr = {"categoryIndex":100,"createTime":1450931470,"effectiveDay":180,"taskTotal":"47","chapters":[{"chapterId":"8a22ecb551d6da350151e8155bc81526","isFree":"true","knowledgePointId":null,"chapterTitle":"OBU 简介","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/24f6f94eda4a417ba97c2b6b51f4d5a9.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"9C3B3C7A64B1E4A09C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":674,"express":null,"taskType":"video","title":"OBU-课程简介","taskId":"8a22ecb551ed44ca0151ed9c6d5300f1","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6903fc0045"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3abcebb018f","isFree":"true","knowledgePointId":null,"chapterTitle":"第一部分\tIntroductions of OBU BSc in Applied Accounting （论文项目介绍）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/e4201bc495c240c8b531615b79b37a50.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"F528AD32806FDC1C9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":411,"express":null,"taskType":"video","title":"LESSON 1\t   OBU简史及论文能力要求","taskId":"8a22ecb551ed44ca0151ed9ca00200f4","taskLevel":null,"id":"8a22ecb551ed44ca0151ed693a620049"},{"attachmentPath":"/upload/201512/3eebce913b61426ab3a787f433d8d2ac.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"26065BC881BE2EAC9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":246,"express":null,"taskType":"video","title":"LESSON 2\t  论文导师的责任与角色","taskId":"8a22ecb551ed44ca0151ed9cd3d800f5","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6960cf004a"},{"attachmentPath":"/upload/201512/6961639786524b84937380abd57721a6.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"E0E6BB2CD6C9FD819C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":330,"express":null,"taskType":"video","title":"LESSON 3\t  论文剽窃、欺骗的预防及处罚","taskId":"8a22ecb551ed44ca0151ed9d2dab00f7","taskLevel":null,"id":"8a22ecb551ed44ca0151ed699b7f004b"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f83229be030f","totalCount":12,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第一部分 Introductions of OBU BSc in Applied Accounting （论文项目介绍）","taskId":"8a22ecb551f699b60151f85b47f103a0","taskLevel":null,"id":"8a22ecb551f699b60151f83229be030f"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3abf12f0190","isFree":"true","knowledgePointId":null,"chapterTitle":"第二部分\tEligibility of applying OBU BSc in Applied Accounting（论文申请资格及要求）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/bf70b1b0fc424449af204d1707dba3cd.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"04D9670B2117F3119C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":327,"express":null,"taskType":"video","title":"LESSON 4\t  论文申请步骤、时效及免试影响","taskId":"8a22ecb551ed44ca0151ed9ddfa400fd","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6a269c0053"},{"attachmentPath":"/upload/201512/e2c86ee81d68458dae2e00570a578e6f.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"DC8C46AA594AA9629C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":341,"express":null,"taskType":"video","title":"LESSON 5\t  英语水平证明及证明提交","taskId":"8a22ecb551ed44ca0151ed9e188400fe","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6a50c60055"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f834dafc0320","totalCount":6,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第二部分 Eligibility of applying OBU BSc in Applied Accounting（论文申请资格及要求）","taskId":"8a22ecb551f699b60151f85c64c503a9","taskLevel":null,"id":"8a22ecb551f699b60151f834dafc0320"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ac10aa0191","isFree":"true","knowledgePointId":null,"chapterTitle":"第三部分 Basic knowledge of applying OBU BSc in Applied Accounting（论文申请基本知识）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/602d30b6601644ca8f5a7b345f872495.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"E77BD3159B5B168E9C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":310,"express":null,"taskType":"video","title":"LESSON 6\t  在线提交日期及提交方法","taskId":"8a22ecb551ed44ca0151eda07d970101","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6a764e0056"},{"attachmentPath":"/upload/201512/6cfe27fde0d54805a416b303c7b9304f.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"70F68F02E7EB75F79C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":447,"express":null,"taskType":"video","title":"LESSON 7\t  在线提交格式、费用及信息更新","taskId":"8a22ecb551ed44ca0151eda0f3db0103","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6aba450057"},{"attachmentPath":"/upload/201512/e07dcd44149f47bab5de22871807b5ca.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"81CBA016AAB46D039C33DC5901307461","videoSiteId":"D550E277598F7D23","videoTime":613,"express":null,"taskType":"video","title":"LESSON 8\t  论文等级评估标准、方式及重新提交原则","taskId":"8a22ecb551ed44ca0151eda142070105","taskLevel":null,"id":"8a22ecb551ed44ca0151ed6af5350058"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f8386de6032b","totalCount":6,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第三部分 Basic knowledge of applying OBU BSc in Applied Accounting（论文申请基本知识）","taskId":"8a22ecb551f699b60151f8575de4039a","taskLevel":null,"id":"8a22ecb551f699b60151f8386de6032b"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ac38160193","isFree":"false","knowledgePointId":null,"chapterTitle":"第四部分Project topic areas and titles and research question（论文的选题及开题）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/f9b143b646d5472ea3f11d7841c980be.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"EA00C71962D738AB9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":428,"express":null,"taskType":"video","title":" LESSON 9\t论文选题","taskId":"8a22ecb551ed44ca0151f104056b0602","taskLevel":null,"id":"8a22ecb551ed44ca0151f0bbd88b0465"},{"attachmentPath":"/upload/201512/8d5713d6a8a44585880fa3fb496b461a.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"8C84C02DA24A2A399C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":779,"express":null,"taskType":"video","title":"LESSON 10\t公司选择及论题确定","taskId":"8a22ecb551ed44ca0151f10628a50606","taskLevel":null,"id":"8a22ecb551ed44ca0151f0fc84bd05a1"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f838f9fe032c","totalCount":4,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第四部分Project topic areas and titles and research question（论文的选题及开题）","taskId":"8a22ecb551f699b60151f858d6a3039d","taskLevel":null,"id":"8a22ecb551f699b60151f838f9fe032c"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ac52920194","isFree":"false","knowledgePointId":null,"chapterTitle":"第五部分 Structure of Research Report （Research Report 的结构、内容及要求）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/0cf8bd18249e4ac98d5d00653846edff.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"BB12F9E460AB60D99C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":850,"express":null,"taskType":"video","title":"LESSON 11\tRR的整体结构、封皮及第一部分内容","taskId":"8a22ecb551ed44ca0151f1074229060b","taskLevel":null,"id":"8a22ecb551ed44ca0151f0bc21900466"},{"attachmentPath":"/upload/201512/62bc04dd099b4e29ae6552a06fa02a7c.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"F3A428360B3602969C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":1222,"express":null,"taskType":"video","title":"LESSON 12\tRR的第二部分具体内容","taskId":"8a22ecb551ed44ca0151f107868d060d","taskLevel":null,"id":"8a22ecb551ed44ca0151f0bc478a0469"},{"attachmentPath":"/upload/201512/b7b20dd75179431b8424aa9a880ab406.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"B2E53E92D43564659C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":975,"express":null,"taskType":"video","title":"LESSON 13\tRR的第三部分内容","taskId":"8a22ecb551ed44ca0151f107d053060e","taskLevel":null,"id":"8a22ecb551ed44ca0151f0bca975046a"},{"attachmentPath":"/upload/201512/bec841ef51df4d04aeac6f82dcb025b9.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"2ED40293F0F9B9A59C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":544,"express":null,"taskType":"video","title":"LESSON 14\tRR字数要求及格式要求","taskId":"8a22ecb551ed44ca0151f1080ad2060f","taskLevel":null,"id":"8a22ecb551ed44ca0151f0bcd6da046c"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f83aee7d0333","totalCount":10,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第五部分 Structure of Research Report （Research Report 的结构、内容及要求）","taskId":"8a22ecb551f699b60151f86c35b003c3","taskLevel":null,"id":"8a22ecb551f699b60151f83aee7d0333"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ac72ec0195","isFree":"false","knowledgePointId":null,"chapterTitle":"第六部分 Project mentoring （论文指导）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/7b6e94d5512f40639c2e7f1806985cbc.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"E3ABF52B4DF2E3119C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":253,"express":null,"taskType":"video","title":"LESSON 15\t论文导师的角色及与导师的会见","taskId":"8a22ecb551ed44ca0151f1089ebf0610","taskLevel":null,"id":"8a22ecb551ed44ca0151f0bd9f97046d"},{"attachmentPath":"/upload/201512/4a5d0c9aedc6414a8046edc8d332748d.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"69F73453EB31FF419C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":321,"express":null,"taskType":"video","title":"LESSON 16\t三次会见及论文答辩","taskId":"8a22ecb551ed44ca0151f108cf0a0614","taskLevel":null,"id":"8a22ecb551ed44ca0151f0cb1bd00485"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f849ec290376","totalCount":5,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第六部分 Project mentoring （论文指导）","taskId":"8a22ecb551f699b60151f86c96f903c4","taskLevel":null,"id":"8a22ecb551f699b60151f849ec290376"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ac9a3e0196","isFree":"false","knowledgePointId":null,"chapterTitle":"第七部分 Skills and Learning Statement (SLS)（技能和学习记录）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/d7715026c19a438785ca78edf0da2f45.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"F23D5D032A92DDDF9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":528,"express":null,"taskType":"video","title":"LESSON 17\tSLS、Reflection及交流技巧","taskId":"8a22ecb551ed44ca0151f10900e80615","taskLevel":null,"id":"8a22ecb551ed44ca0151f0cb3e030487"},{"attachmentPath":"/upload/201512/53d2353bd9914ed4b7720f9f35a95219.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"0129B753B05FB6489C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":252,"express":null,"taskType":"video","title":"LESSON 18\tSLS字数要求及答辩PPT要求","taskId":"8a22ecb551ed44ca0151f1092a010618","taskLevel":null,"id":"8a22ecb551ed44ca0151f0cb69bf048a"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f83ce4580339","totalCount":6,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第七部分 Skills and Learning Statement (SLS)（技能和学习记录）","taskId":"8a22ecb551f699b60151f86eca6503c7","taskLevel":null,"id":"8a22ecb551f699b60151f83ce4580339"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3acb7c50197","isFree":"false","knowledgePointId":null,"chapterTitle":"第八部分 A guide to citing and referencing （关于标记引用及参考的指导）","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/573843cf5532441b8c22ffae67027ed7.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"DDC5A3B75DAB9F2E9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":672,"express":null,"taskType":"video","title":"LESSON 19\t引用与参考","taskId":"8a22ecb551ed44ca0151f10953470619","taskLevel":null,"id":"8a22ecb551ed44ca0151f0cbc5b7048b"},{"attachmentPath":"/upload/201512/bd4ded4c21444b30b833f804557e9746.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"B09AD3B3227CCA5F9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":1606,"express":null,"taskType":"video","title":"LESSON 20\t论文内容中引用标记与参考列表","taskId":"8a22ecb551ed44ca0151f109790a061a","taskLevel":null,"id":"8a22ecb551ed44ca0151f0cd5be90497"},{"examUrl":"/exam/examination/examinationTask/8a22ecb551f699b60151f83d48bb033b","totalCount":12,"difficulty":"简单","examenType":"chapter","express":null,"taskType":"exam","title":"第八部分 A guide to citing and referencing （关于标记引用及参考的指导）","taskId":"8a22ecb551f699b60151f872ba6903ca","taskLevel":null,"id":"8a22ecb551f699b60151f83d48bb033b"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3acd5ef0198","isFree":"false","knowledgePointId":null,"chapterTitle":"第九部分 关于学生Fail RAP的常见问题及规避方式","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/12bc934db09b4d428795ef60dfbd49d0.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"E9306DC096F7ADD79C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":735,"express":null,"taskType":"video","title":"LESSON 21\t论文未通过的常见问题及规避方式","taskId":"8a22ecb551ed44ca0151f109d359061b","taskLevel":null,"id":"8a22ecb551ed44ca0151f0cdb1380499"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ad0a54019a","isFree":"false","knowledgePointId":null,"chapterTitle":"第十部分 基础Ratio 分析","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/ad26df7f621b4a4d92198d4672729275.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"E527B9F9512B0B0E9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":395,"express":null,"taskType":"video","title":"LESSON 22\t财务比率分析介绍","taskId":"8a22ecb551ed44ca0151f114bcea0644","taskLevel":null,"id":"8a22ecb551ed44ca0151f10e7f180621"},{"attachmentPath":"/upload/201512/603db3bae6604685bb7dad9506a55d16.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"78F5A869532BAAB89C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":432,"express":null,"taskType":"video","title":"LESSON 23\t投资回报比率及盈利比率","taskId":"8a22ecb551ed44ca0151f115755d0646","taskLevel":null,"id":"8a22ecb551ed44ca0151f10ea39c0622"},{"attachmentPath":"/upload/201512/f3f8451a3791417ca3bb3034a2cf6fdb.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"42020D86F0B771129C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":268,"express":null,"taskType":"video","title":"LESSON 24\t流动性比率","taskId":"8a22ecb551ed44ca0151f11699e50654","taskLevel":null,"id":"8a22ecb551ed44ca0151f10ecabd0624"},{"attachmentPath":"/upload/201512/462d3672425049e98f9d170f21e0e3c0.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"187785497B1B39759C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":230,"express":null,"taskType":"video","title":"LESSON 25\t经营效率比率","taskId":"8a22ecb551ed44ca0151f1173bc4065e","taskLevel":null,"id":"8a22ecb551ed44ca0151f10ef3bc0625"},{"attachmentPath":"/upload/201512/aaa38625400d4b20b6c8ab1c2cfb2db6.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"2BBD409BA3DB107C9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":273,"express":null,"taskType":"video","title":"LESSON 26\t资本结构比率","taskId":"8a22ecb551ed44ca0151f1178af70660","taskLevel":null,"id":"8a22ecb551ed44ca0151f10f1ab80627"},{"attachmentPath":"/upload/201512/1c17ccc2267a4c6fb8d9f954d29b48c2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"75C9A62D623443F29C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":131,"express":null,"taskType":"video","title":"LESSON 27\t股东收益比率","taskId":"8a22ecb551ed44ca0151f118981f0661","taskLevel":null,"id":"8a22ecb551ed44ca0151f10f6ee90628"},{"attachmentPath":"/upload/201512/26f26735077d42b7b0d6db6f4640ed0d.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"598BDAD9C07E4C4A9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":139,"express":null,"taskType":"video","title":"LESSON 28\t财务比率分析的局限性","taskId":"8a22ecb551ed44ca0151f11a7efc0662","taskLevel":null,"id":"8a22ecb551ed44ca0151f10fa8950629"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ad2fe8019b","isFree":"false","knowledgePointId":null,"chapterTitle":"第十一部分 基础商业分析","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/d4d6aa174b86408dae4618d73d520c8f.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"35166790B5AA8FE49C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":82,"express":null,"taskType":"video","title":"LESSON 29\t商业分析介绍","taskId":"8a22ecb551ed44ca0151f11ad4d90663","taskLevel":null,"id":"8a22ecb551ed44ca0151f10fcc27062b"},{"attachmentPath":"/upload/201512/52b87084901a4c6bbbb808d3ac12866b.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"0FEE812398EA9C419C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":531,"express":null,"taskType":"video","title":"LESSON 30\tPESTEL分析","taskId":"8a22ecb551ed44ca0151f11b31f40665","taskLevel":null,"id":"8a22ecb551ed44ca0151f10ff8a2062c"},{"attachmentPath":"/upload/201512/b3d682326f8e4cfab321e33fb84713a8.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"0EB61C2C8D3F09919C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":313,"express":null,"taskType":"video","title":"LESSON 31\tSWOT分析","taskId":"8a22ecb551ed44ca0151f11b68b00666","taskLevel":null,"id":"8a22ecb551ed44ca0151f1101e35062d"},{"attachmentPath":"/upload/201512/3eed2280b5874bb480f6ea6c3f45237d.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"67729FB985B657F19C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":673,"express":null,"taskType":"video","title":"LESSON 32\t波特五力分析","taskId":"8a22ecb551ed44ca0151f11ba1790667","taskLevel":null,"id":"8a22ecb551ed44ca0151f1104454062f"},{"attachmentPath":"/upload/201512/3b5616eb1b3640048deb71034f918135.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"79C9DED5FD871D2C9C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":345,"express":null,"taskType":"video","title":"LESSON 33\t波特价值分析","taskId":"8a22ecb551ed44ca0151f11be4010668","taskLevel":null,"id":"8a22ecb551ed44ca0151f11070d50630"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ad544e019c","isFree":"false","knowledgePointId":null,"chapterTitle":"第十二部分 基础IT应用","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/f6f2994729c5444cae4199ceff643920.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"1B3C48DBB024BC149C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":729,"express":null,"taskType":"video","title":"LESSON 34\t基础WORD应用演示","taskId":"8a22ecb551ed44ca0151f11caee60669","taskLevel":null,"id":"8a22ecb551ed44ca0151f110975a0631"},{"attachmentPath":"/upload/201512/b06d8ea6e9f84e53a8aa4cf7e5468fb5.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"184F3E89C5F42BA39C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":626,"express":null,"taskType":"video","title":"LESSON 35\t基础EXCEL应用演示","taskId":"8a22ecb551ed44ca0151f11df8eb066b","taskLevel":null,"id":"8a22ecb551ed44ca0151f110be1a0632"},{"attachmentPath":"/upload/201512/c182d7e617064803aec4edd0e2776b69.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"90C9C65B4B4BFBF59C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":336,"express":null,"taskType":"video","title":"LESSON 36\t基础PPT应用演示","taskId":"8a22ecb551ed44ca0151f11e6adb066e","taskLevel":null,"id":"8a22ecb551ed44ca0151f110e8a50633"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ad78c6019d","isFree":"false","knowledgePointId":null,"chapterTitle":"第十三部分 关于OBU项目中交流与沟通技巧的解读与指导","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/47728be534b04f4b9784f404c41a2907.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"E54602E1BBDF64359C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":2461,"express":null,"taskType":"video","title":"LESSON 37\t项目中交流与沟通技巧的解读与指导","taskId":"8a22ecb551ed44ca0151f11ed5ee066f","taskLevel":null,"id":"8a22ecb551ed44ca0151f11134bb0634"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"chapterId":"8a22ecb551d2eee90151d3ad9531019e","isFree":"false","knowledgePointId":null,"chapterTitle":"第十四部分 关于论文格式样例的指导讲解","isLeaf":"true","tasks":[{"attachmentPath":"/upload/201512/92408b0baf0043b887e81acec761c45e.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"AE9F875051C2B9A09C33DC5901307461","videoSiteId":"E5DD260925A6084B","videoTime":1608,"express":null,"taskType":"video","title":"LESSON 38\tOBU 论文 格式内容样例","taskId":"8a22ecb551ed44ca0151f157807d06fe","taskLevel":null,"id":"8a22ecb551ed44ca0151f111ca32063b"}],"chapterFiles":null,"chapterExtends":null,"children":null}],"coverPath":"/upload/201512/3421d9597f9044b785e5138665fec42e.jpg","courseId":"8a22ecb551cf56cb0151d24140aa028a","outline":"","teacherName":"OBU 明星讲师团","taskNum":"47","categoryName":"OBU","subjectName":"OBU 论文提高课","courseIndex":2,"teacherHonor":"孙志远、贵荣广、多年OBU辅导经验","availability":"","categoryId":"8a22ecb551cf56cb0151d2152b5c0252","bigCoverPath":"/upload/201512/b2ff13c9c5234e0b8a1cd8bba07e37a5.png","chapterNum":"15","courseModuleType":"KNOWLEDGE_MODULE","aim":"","teacherImage":"/upload/201507/3bfaf8b86cb14985a194c01d9e9fbbb1.png","subjectId":"8a22ecb551f17b3e0151f1e161900125","versionId":"8a22ecb551cf56cb0151d24140aa028a","courseBackgroundImage":"/upload/201512/3421d9597f9044b785e5138665fec42e.jpg","subjectIndex":50,"courseName":"OBU 论文提高课","lastModifyTime":1450931,"state":"success","msg":""}
           var task_tpl = $('#task_tpl').html();
          var content = doT.template(task_tpl);
          $('#chaTask').html(content(arr)).show();
          init_check()
          return false;
        }
        
    }
    //tasksCache()
   function initDomDownStatus(){

    if(isEmpty($api.getStorage("videochangelist"))){
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
			//          alert(domid+"==="+api.pageParam.chapterId);
            if($(".task"+domid).attr("id") == api.pageParam.chapterId){
                $(".task"+domid).parents("li").show();
                $(".task"+domid).attr("type",domstatus);
	            $(".task"+domid).find(".val").html(domprogress);
	            $(".task"+domid).parent().prev().find(".v-progress").find("span").css("width",domprogress+"%");
//	            $(".task"+domid).parent().prev().find(".v-name").find("span").eq(1).text(Math.round(domprogress)+"%");
            }
            
            
        } 
    }
    
    
    
}

    // tasksCache();
    function initDom(){
	     setTimeout(function() {
	         api.hideProgress();
	         api.refreshHeaderLoadDone();
	     }, 100);
	     $('body').removeClass('checking');
	     var len = 0; 
	   
	   courseId = api.pageParam.courseId;
	   cache_model.getCourseJsonWithCourseId({"userId":getstor('memberId'),"courseId":courseId},function(ret,err){
	   		var ret_data = JSON.parse(JSON.parse(ret.data)[0].courseJson);
	   		var task_tpl = $('#task_tpl').html();
	   		
	      course_detail = ret_data[0];
	      var content = doT.template(task_tpl);

	      $('#chaTask').html(content(course_detail)).show();
	      initDomDownStatus();
	      task_arr = save_tasks(course_detail);
      	  courseId = course_detail.courseId; //课程id
	   })
//	      
	      
	      
	      
//		 var len = 0;
//		 $.each($(".video-catego"),function(k,v){
//	     	 if($(v).css("display") != "none"){
//	     		len++;
//	     	 }
//	     })
//	     alert(len)
//	     if(len<1){
//	  	   $('#chaTask').html('');
//		   $('body').addClass('null');
//		   return false;
//	     }
    }
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
    apiready = function(){
      
      
      //1:获取所有下载记录并解析
      getdownrecord();
      //2:根据couselist获取所有缓存课程的章节详情，如果在线，从服务器获取，否则本地数据库获取
      initDom();
      clearInterval(getStatusTime);
      getStatusTime = setInterval(function(){
          getdownrecord();
          setSpeed();
      },1000)
      init_check();
      
//    api.setRefreshHeaderInfo({
//      visible: true,
//      loadingImg: 'widget://image/arrow-down-o.png',
//      bgColor: '#f3f3f3',
//      textColor: '#787b7c',
//      textDown: '下拉更多',
//      textUp: '松开刷新',
//      showTime: false
//    }, function(ret, err) {
//      initDom();
//    });
      	
      api.addEventListener({
          name: 'flush_catalog'
      }, function(ret) {
      		getStatusTime = setInterval(function(){
	          getdownrecord();
	          setSpeed();
	      },1000)
      })
      api.addEventListener({
          name: 'opena'
      }, function(ret) {
          if (ret.value.sethomepage == 1) { //删除
              $('body').addClass('checking');
              var ccids = [];
             $.each($(".video-catego"),function(k,v){
             	if($(v).css("display") != "none"){
             		if($(v).find(".icon-check").hasClass("active")){
             			var ccid = $(v).find(".icon-check").attr("dataccid");
             			ccids.push(ccid);
        
             		}
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
             	$.each($(".video-catego"),function(k,v){
             		if($(v).find(".icon-check").hasClass("active")){
             			$(v).hide();
             		}
	             })
	            
	             api.hideProgress();
	              $('body').removeClass('checking');
                  $('.icon-check').removeClass('active');    
                api.sendEvent({
                    name: "cancle_del"
                 });
                clearInterval(getStatusTime);        	
              	var len = 0;
				$.each($(".video-catego"),function(k,v){
		         	 if($(v).css("display") != "none"){
		         		len++;
		         	 }
		        })
	            if(len<1){
	          	   $('#chaTask').html('');
	    		   $('body').addClass('null');
	    		   return false;
	            }

	         },1000)
          } else if (ret.value.sethomepage == 2) { //取消
              $('body').removeClass('checking');
              $('.icon-check').removeClass('active');
          } else if (ret.value.sethomepage == 3) { //全选
              $('.icon-check').addClass('active');
          }
      });

      
    }
      
function init_check() {
	$('.chapter-task').on("click",".icon-check",function() {
	    if ($(this).hasClass('active')) {
	        $(this).removeClass('active')
	    } else {
	        $(this).addClass('active');
	    }
	});
}  

function next(obj, num1 , courseId) {
      var courseId = courseId;
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
                  // $api.setStorage(courseId, course_detail);
                  // var task_arr2 = save_tasks(course_detail);
                  // var task_info_detail2;
                  // for (var i in task_arr2) {
                  //     if (task_arr2[i].chapterId == cid) {
                  //         task_info_detail2 = task_arr2[i];
                  //         break;
                  //     }
                  // }
                  var tasks = $.trim($(obj).next().find(".down_data").html());

                  if (isEmpty(tasks)) {
                      api.toast({
                          msg: '暂无任务',
                          location: 'middle'
                      });
                      return false;
                  }
                  judge_task(JSON.parse(tasks), 0);
              }
          });
      } else {
          course_detail = tmp_course_detail;

          // var task_arr2 = save_tasks(course_detail);
          // var task_info_detail2 = [];
          // for (var i in task_arr2) {
          //     if (task_arr2[i].chapterId == cid) {
          //         task_info_detail2 = task_arr2[i];
          //         break;
          //     }
          // }
          var tasks = $.trim($(obj).next().find(".down_data").html());
          if (isEmpty(tasks)) {
              api.toast({
                  msg: '暂无任务',
                  location: 'middle'
              });
              return false;
          }
          judge_task(JSON.parse(tasks), 0);
      }

}
//判断任务类型，跳转相应的页面
//function judge_task(res_process) {
function judge_task(task_info, lastProgress) {

  if (isEmpty(course_detail) || isEmpty(course_detail.chapters) || isEmpty(task_info)) {
      api.toast({
          msg: '获取课程信息失败',
          location: 'middle'
      });
      return false;
  }
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
      courseId: course_detail.courseId,//课程id
      //study_progress: res_process,//学习进度
      last_progress: lastProgress,//学习进度
      course_detail: course_detail,//课程详情
      task_info: task_info,//当前要学习的任务信息
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
      slidBackEnabled: false,//iOS7.0及以上系统中，禁止通过左右滑动返回上一个页面
      pageParam: pageParams
  });
}  

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

//点击本章任务
function task_event(obj, num, task_id,chapter_id) {
	clearInterval(getStatusTime);
	$api.setStorage("setchapterId",chapter_id);
    task_info = task_arr[task_id].taskInfo; //任务信息
    // 如果要打开新的窗口，则关闭旧窗口
    var downState = $(obj).next().find(".down-progress").attr("type");
        //传递的页面参数
        var page_param = {
            courseId: courseId, //课程id
            course_detail: course_detail, //课程详情
            //study_progress : study_progress,
            task_info: task_info, //任务信息
            type: 'task'
        };
        
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
        
}