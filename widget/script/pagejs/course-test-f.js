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
var selectClick = false;//是否选择
var exam_info = '';//测试题信息
var user_exam = [];//用户答案

var err_num = [];//错误题总数
var uncomplate_num = [];//未完成题总数
var start_time = 0;//开始做题的时间
var is_all_over = false;//页面是否已经加载出来
var swiper;

//测试
// var exam_info = {items:[ {
//     "id" : "ff8080814f3eb9ed014f4e30e9691c3e",
//     "createDate" : 1440125872000,
//     "modifyDate" : 1440125931000,
//     "accuracy" : 0,
//     "answerResolution" : "The correct answer is: $0.80.<br />\r\n      Different newspapers require different labour hours and machine hours as they are not identical.<br />\r\n      Using a labour hour rate is not appropriate as production is more machine intensive than labour intensive. A<br />\r\n      machine hour is therefore more appropriate.<br />\r\n    Number of machine hours=(60,000 x 0.4)+(80,000 x 0.5)+(90,000 x 0.3)二91,000<br />\r\n      Absorption rate=$72,800+91,000=$0.80 per machine hour.",
//     "background" : null,
//     "context" : "[{\"blank\":\"$0.80\"}]",
//     "exerciseState" : "publish",
//     "questionTypes" : "blank",
//     "sn" : 12034,
//     "title" : "<p>\r\n\t<span> </span><span><span>DEF Co publishes\r\nthree newspapers, The Post, The Gazette and The News. The following information\r\nhas been obtained from the accounting system for period 6:</span></span><span> </span> \r\n</p>\r\n<p>\r\n\t<span> <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAD5CAYAAAAuneICAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEyGSURBVHhe7d0L7GVFfcDxCxax0LhoVFJYCkahFreuguAiTVdreARSHo1ay0MwIMaVFheqBbFdbSIguD5aqg1g0PBoQVOUBAQ3sNWErUpdfNA2SnDrKqTbh4gNJEJ1ez+z93d3/odz///7/+9//489v29ycs+dMzNnZs7M/H4z58xvdtvap5ckSZJ0jt0Hv0mSJEnHSAGQJEnSUVIAJEmSdJQUAEmSJB0lBUCSJElHSQGQJEnSUVIAJEmSdJQUAEmSJB0lBUCSJElHyZXAyYLgAx/4QO9f//VfB/+2ceihh/aOO+643sc+9rHerbfeOnAdn3/5l3/pffCDHxz86/WWLl3a++hHPzr4Nz0+97nP9d70pjcN/u083vzmNw/OtvNP//RPvbvuuqv327/9273vfOc7vWXLlg2ujM+PfvSjEvfXvva1Ug7//M//3Nt3330HV2eOMv7Zz37WO+qoo8r/uSqncdl99917bV3cvffe23vDG97Q+8UvftHbbbfdBq7joU5dd911vc2bNw/Dvv71ry9xTjeu+SZHAMmCQkf1j//4j4N/vd6Pf/zj0qnMhP/6r/8qnWdAkLzrXe8a/JsebR3zzmDFihWlA9VJ61ydE1ovfOELy/X//u//Lr/TRfoPOOCAIkh11n/8x388uLJjeDbKNfjDP/zD1g53vrjllluGeVaWzh072lE/8sgj5bksev3ZCCBJFgr9xrl1zZo1g3/b/qummzZt2rp+/fryW8PN0Qb3fqMf/Nu69cEHH9y6ZMmSwb9t/yeLc8uWLeX/1VdfXdIw6j47A/leuXLl4N82+p3W1o0bN5bykabgscceK/+5O29y2223be2Pprb+8pe/LP/la5999hn+ly9h+x15+Q/n8Szqe8V9xOE4+eSTS9zicB9pdD3g5v8DDzwwcJkf+gKwpKPOs7T+x3/8R3GX15qPf/zjxf0nP/nJwGU7/dFqCVuX6ete97rhef08Irz44rrzqFvSEfUqyruZlp1JjgCSRcGJJ55Yhtl+A9NGZ555ZtHqx5naee5zn9t7/PHHyznt2lSKOI888sgy8sCFF15Y4hT34YcfXtzOP//88svvfHPYYYeVqTJpipHRpZde2vvKV75S3J03+da3vtU755xzhlrvi170ol6/kxr+F9fLX/7y3he+8IVhOW7YsKHE73C931eUMrnxxhvLyIrbz3/+8zLCMgXUF0y9devWFX/S4VfYfmdXyv30009fkNryq1/96jLiNELqKwTFzSjm+9//fsnH+9///tZ0v/vd7y75imdQI0w8j3e84x0l/OrVqwdXe+X88ssvL+7ve9/7StmJx32FkZa+EBj43sn0E5EkC4bQggL/VdPQkmoN/sADDyyaFO2SNtZEGO7iczg/66yzyjW/q1atKucXXHDBcKTgXqGBcRN3pGEucc+2EQCNGtIW5fTKV75yqF0edNBBw/NAPJEnZSJclEP8h996xASabYwA3IfGTMOVFvdphgl39AXN1nvvvbec12mcD0aNAL773e+W/86l1ajQeWjubek2AhCXMg3NP37Vx/oZRHjXxS+M+D2TH/zgB8P7Rjny+zd/8zcT0rozyRFAsijoN6Dy229Q5ZfGtPfeexdN66GHHiqaUxu0U9ccXihfeeWVxf3OO+/sXXzxxeX8lFNOGWpy5uBpwbTCfmMt9+s3zHJtIbDPPvsMzrYh3eajaY80x3//938fXBkNzVX+++2/lKv8Gfl88pOfHPjYRsxx9wVl+f/oo4+WdwfnnXdecZ8KI4VPfepTJV3SWL+PWSgY+cA7F6gnzmnu0m301AZ/b3zjG5/xnkl9fPLJJ4fPQ76hnPvKRBlpvvOd7+x99atfHT4r14zKvKDvd/7lutFWXziU6zuTFADJokXj0wFqNNGAm3j5pyN36NA0NAjrpWgT/mC6R9j//M//XJAd1yh01s2OQwcTU1zOdfbhh/vv/d7vlfNa0Mm36RvTa20dEb/jdFD9UVf5dd/4UmghIm1t+QnhNwrXL7roopECUb6hHHTwDoIDpiHjXDymhv72b/+2fLkU9XBnkwIgWZRoUA4NpZ67Hpfly5eXBoif/vSnw47q05/+dOnwzZHvueeeRVOmMS9UVq5c2dtvv/2GX7vE10I1Bx10UMmXTh1GN3GuQ/qjP/qjUn512Msuu6z3+7//+xOEwlNPPVXuYxQl/FSjAPGdfPLJJV1Ga4sBafZuQz6vvvrq3hFHHDGpoDvttNN6P/jBD4rmD89jr732Gj6PGGGI5/Of/3wpe6M4/j7ykY/0fvd3f7dc/+xnP9s79thjy3sICo2R1jijrB0lBUCyKNGwaPE02Jtuumk4hTMub3/723vHH398CUfT9ZIUOkqdoc5OR6DzjEZsWL7QMKL5v//7v/IpJs1emTQ5++yze//7v/9bOmP59ZJbRxejAtMc3B3cdDx/9Vd/VeIyjeGAzs7UxlVXXVXuq2NUNgSmewdGT+Lw4pdWqzy/8Y1vDK4ubGjsL3nJS8pLbsf9998/aUesMycoQkgoFx8VeB7yHUqGemSUqkxNK5500kllHYFfYZ944oneueee29uyZUsRJgTEXPCsfqVeeLU66SwaCI3cXHz8N1eqE4POSseNo48+uszVmps219zUMsXzP//zP8NheM0hhxxS4qKRaZCxYMxXNrfddlvvM5/5TNGMo/MD/295y1sG/3Y+5pLrtMe6AJ0ODVweXvayl/Ve+9rX9v7u7/6udDC+AnrOc54zCLEdnbEvW+67776iwRMAL33pS0v8ytecNqFogViUNT9x8Ke8H3744VLOa9asKb/7779/EZbKjTCIjosQ8M5F3Oa+Cdlf//VfL9fmC+l78YtfPPjX6y1ZsqTkSwesPHXcytbI59/+7d9Kvn2l86u/+quDENupFYP4lXdxHXzwwb177rmn973vfa93ySWXDPPt+Xh+/BtVer5vfetbh2HUVcJV3B/+8Id7v/Zrv1bC7UxyJXCSJElHySmgJEmSjpICIEmSpKOkAEiSJOkoKQCSJEk6SgqAJEmSjpICIEla8FlgfCdf45v36a45mE/kIb7vr5E/7lOtcm7zE2HbyoGbT2t3BUY9a5/jcm+rH0GUe6wDqOHeVu7zUnY+A50KBrjCGBfe9KY3Tfi/I6xsGLyaK6RfPppwj2JZtWpVq5/g1haDXeMi7GRxJ1PDKJnyZxTuhS984YQ6yd1z5D7KFLHn67r6HQbPwBCXsI7rr79+4LrNaNyhhx5awjhf6MiTPERZqHNgsGz58uXFXV7CwFyNsn3d615X/PFTlw93YZWFsgrC3fOo/S9G3v3ud5d8y4s8MYIHZXjQQQcNy45BtybMi7/oRS8alkUYnFPuUaaexz/8wz8Ud5x99tmlPPn/67/+6zkxBIexBIDErlixYvBvmwCYrQeskOaDcQSAh7127dpy3kYKgPlFHYx66TktXbq09XzUc+Zn8+bNxQJkPPMNGzaUc43VuUYJ/jT4wDm3hcwBBxwwrL9RJjoW54QfRtVh7uFfOey22zbb+dyVCXf5f/nLXz70E+5hUdP5YkUHHulXjqtXry7/nd9yyy3F/aijjmq12vmud71r6J9lT/XP+YUXXljqq/OPfvSjpdydK7sox7kuu7GngNgMqYczsfrNQuIYCrlu+TNimOi61ZQxJHLeHOaEe3NIVYeFYZP4hY/7BNzEw46GZel1XPUuUM2Fz6Pu3cR1/hzC1EgL9zpf4b+5A5W0cU92HM8h6oFyDWNj3PuNrpz7bRuGe1b8MwgXdZmbOmYVsiX9rodpBfW/38GVczjntpCxm1oYvItf1HlRPixT9vuC8j9QZq5ZpRrlarWweh3u4ozycS+rahHl2WwniwXprp+1/MufMvEbdYuZC2XShD9G3pSReNgAgrpVh7XaGPXzmOuyG1sAWPp97bXXDv71hqZMNZpoCCoDWypQMDo6y+f72lLZXEPnLKPM7wbsXsgsA0r8EBxQmcJIVyz9V/hXXHFF6cQtPa+RDp0t2x38RRjUZm7rTtp9HZay1/4D1yJvrktjX2qXfEX+pd/yeHmMfLkmLx42c7AhdCyHv/vuu4vxrhQCO466xV6Pcvfs+yOC4u6ZRaelk2prpJ6RZxnEubB1Z6n+qQcadZiihuX6UVcXKn/xF39R6p5D+TB/rVPSIUVHMwr1OsoQykfYaA+B8lG+ykgb4GexIx/RvhHPOYRdTZtbXXa1+W5l1x9VDctolHIxl4wtAFSim2++efBvuwBo0rScyFKjjl9mozLWDUlh94eVxfYKP3Yc0tgUog6TfxWMG/jhP7SNGtYbxeM6O/B1Zz8KfqUxKvEoXGcjRUPqD9mKMIAHJ3+O2G3qjjvuKOkjAOwcFB2Q+9hMWr5CE0hmjvJm2OyYY47p3X777cXY2biov7T8oD5vwzOsGzMBoI4uZKRZO4C2sSPp1U5HEfV7V0HbDZv+2vuOlFvd1y1EpvUV0AknnFA6usmgDQfjSLXaj06RNNTJq3AehMN5SEuayKjGWmsszmmIk1F3wm0dcp02IyACgEAi5CINdcM48MADy6+0EljSTgAEtWaQAmB2uOGGG0ojveuuu0rdGaWYNAmDasFk2rxn7KjjNjqtRxALDemj6X/pS18qdfab3/xm+b9p06beC17wgoGv0TTLJ9pfG2HTflfCSJ2mvscee5SR1HRgZC7KznNYyExLALznPe8pUzCTUVeU0D5mAo1Fw3bE1BGm0tRqWCocl7Z3APUwWSOi2cuT6aC20QKtMGAJUdpZZzTfl8w+6gTTvYhnpZM2h19/ZtemiNDMas0uzoWt64L6HIpILQAoF9Opi3NN7EQVI/JIK7PD8lKPjtvKx34JzfLxnoDiUmv84Ye7OOt3CaY7Fit2mWPT32g95uqjnGI2wlTzVHWrVkKVESEcZRTKozo3X6OoaQkAjcxDHTVVEgUT1Br5KOqMi1chKZh42eLwgm+cxlY3eue1dh407wfSOubnRkEbEJ+XjvLVzGtNnX7nbIODxhhpnGy6KRkP9THKMcpV5+b5xH/Pqxbk8dy4hZ9w05iFVRfUCYIgFJpmI3XObaESbfVP//RPy3/vnChE3NXLyIvykW/1WzlEmUTZsk/Pj05L2cpzCAN+f+u3fqv4566jVGbCudc47X+hYvqHvX71QH5e85rXlD5ImYag4x4CgFsoDspJHeJHWcUsgDLiDn1CjCCjTBH12TOaE/qJnJLaW3wyF99c21y6n5HyOZTvqcNv8zPLOgz/AXf+Tj755AnuzsXtWrj7BK2Os8b9xdUMA9/W+uyNW52+fuc8vHfEyz38iDPcheWPm3D8SU99nzj3HTA//PrmN/Ltf7/ClG/II9/JzPF9v3JW7n7j02SfcNbusQ6gfl6+c/csHOpH/Vmz58JN2LZ1APEMFzpRx9U1aY56COXAvS6ffqc0oU46Dz91WG0s3Os1BNEG9QOxGfxipV4HoO+IzzKVwz777FPyqXxi8/hTTjml1C/EOgB+tP9YQxDrAKLsNm7cWNxhHUDcby7LbiwB4MHW+MaVIIBM+R9uUQjc4xtkuM4NUZl8R+zcd7DNe0DBCxfwz28bwnsgGnIdBtLFTdi4t7T437w398hDXA+4O+L770h/EOHgmv/1ddRx1HEnMyPKOZ5JTZt7CICg7Rkh6mWTZp3YlZDnWgAk4/OBD3yg1KXFxi6zIUx8LdR/CAOXJJmIYbp5/NjxKpmIr9TsLraQ320sVD7xiU/0/uRP/mTRfQa7ywgAc2fm4LwvSJIkSaYmt4RMkiTpKNP6CihJkiTZdUgBkCRJ0lFSACRJMhZeoNerg9vwon2hr35dqCjberHhXDCWALCi1UISR1hfDFybDUYtrHK/5j1rpro+W3TVeFssEILGvaviIwJfvzAEV68ErvGlmfJwTGUSZVfDxxUvfvGLe/vuu29v/fr1A9eJuPb617++97znPa/Yy0q2YVGZOqNubd68eeD6TCwGY8tsLl/LjiUA6s75oosumtAZ1ivgdoRly5YNziZi5VysnmtjquuzRazQ6zI6wF0RmpcObs2aNWX1qk8hm6jjrMquXbu2HOeff/6s1PvFgHwyiXDvvfeWvH/qU58aXNmO9mFV8A9/+MPeqlWrSj+R35dss0RsxfR3v/vdIgCUY1u5KL95KbP+DaekXjwTK4Fj9WC9iCbc+LEaDn4tzopFYOBm8VUsJhOHOP3W/mBhSixOcY2f+p5x3b1r96Dp3wrQ+r9zbhF383ogfXEt0h1YACI/rgf8RV74jzB++Qs35xG+mXdEuuSPnyjXQNnW93ZdvMLF86hprtzkL/IVz6Ve0CL+uG6Vot9dDat9rZQN6vodKAcrYANtYjEu/JkJsYo+VsP2tdlnbFiiDcaqaXWkzU8XsUJY3VEW6osVws1yUV5WCKuD2t9clttYAqApJ1asWFEyhfqaSmL1LzeZtQpTplSOpYMdmmDJMzf+dFZ+42g2qujgIQ73Fmes9o24uQmvAAMVN+IN/wrb/8C5NMS5PLhHE9fcw7U6jHLwP8IG/kde6jz45U+arSiVRufh1oSfuLewfgN5lZ46fvnjJq54RjWj0hj3iPxFRx/n4nPelsbFjnKM8oMyiPwHyql2U47NurqrUtcv6KxGdVLqK7/KMAXAtrLqj4rKuf5wMsGoPs21AJjRS2BDmVHmYW0I09cqizEjttpZEO1nrFhtNF1kGuG0004rbv0Oqgx9+ukoYf0K14aXIzb/MJwy/xoG1sD9vvvuK3GaQ4Nh/U033VTS0tfmin9TWbXFzuDpp58enPXK5iJhEKuJ+7rWb/y9devWFberrrqq1xcGwzyMM1XkJZlhdRiV8w5D2fjfnGeXN3zoQx8q+esLz6EfeZUe7t///veLG0yJhZnk6VDnr5kO6eXehWmPekOYQL1k5Eu9MgXqGY6qq7sizbzWhvFqjj766NIGWMM17911WAON+tRWr+absQSAhj8uOvhYSu6lho5bhYiOTMXRyUIHNe68cuzAJK56hy9omOyXq6Q2coB7H3vssSUtzLO6xsY3c7hN6q8WCKdRuA/EGWH23nvvobVJ18cRAJF/iCsEgI487hGEoI0wrnNzH3mNl/OPPvpouU6gRGc1Xer8Jc/EM7LTGyFpLrdLNJWi/mhxcDaRvvZaXhL/5V/+5VAp6jK71IYwNTTR+ncUOnydFek3ld+p0NF5WUcQjKKumM1KykRzdNajmG7nV+dpqrjbMAqi+ft6QhnNVMPWeQs7amSWjE+zswsoLJ6VL1xmImAXM9pO0Kb9U2LiY5Eom3GUoS4Q5TCqXs0n0xYAHrIMnXjiieW//XRHoXP0RQDN1iiCtozQnsUTUzZTQftyb51cc9RQC4Swq+3ejFsFwmu89Xe2kwmScanjMw01SjMahdGMxkNbMk3W3HAn4ov7xC8t37aUytbhy5XpDDHrUU/XMbqMzkud0Nk1pwpNj9kdSlkvxKH8ziSmBNVR5RTboSI2PDHtaD9uRB2dblvYFTECIDCV3Ze//OXh/gnqWd13BNF/zRVjCwCdtcNuWKtXrx42kMmGOGeccUYJo9P22ZyKs2LFiuHwWccXQgH+T6YBx+5GKmONQlMxhY+5SlqIaRFuNDc7jLkW6dagpWlHOfLII8vIRD7tmXzOOecUd/nk5j5+RyEv0qhCmCaLHa6C0Lbe+973lrLRyCKP7i1umkVs2D/VKERZCVNPQ42LtOyKxvZsdWqnN/XEvsKenXqinEKbVW7qU0y5ORaiRrczUC4vfelLy6fa2r9NZszvKx+bnejcfB76Z3/2Z6Vc1Evuoz7t7hLnnntumQ6zFoDiqp0qO/XpbW9727xPk40lAHTyOjLHxRdfXDqsoBYAzuspEf7MuXsZTHMyvaID4U/D8qIoOrPrr7++NMLmNpK0CAf/hx12WPmN+X6dp2tGGbZepIW8733vG4TsFYlrs3Db43kpGsTLZ2mthcJk7zrqa+4Z+b7mmmvKr7JxHtrh5ZdfXn69LJa+0IbqsCAMpVvDITBHdbD77bdfKUcvtgN5lY9LLrlk6E5LjXu1oZylVRrkPfyOyl9dPu7X3PR/V0C9tKew+uAZfPGLXyzuyiRMR3uG8Rzj2BXLYhRG029/+9uHChWUj/qrQ1PvvWPjpq3XfUSXoZBZA6C++Fgk1pj4f8EFF0x4Ua7smm47m7QGusDRwRMO+ZiSJJltZvwSOEmSJFnc5AggSZKko+QIIEmSpKOkAEiSJOkoKQCSJEk6ylgCwOeWbd/n+0JlJoupmt/xB+KbbB3AOEhPV77PrrEOoov5nk3UP8dU8DOqDu+qaJe+RptsJb7rceRnoNvRLq0DmKxuuabcfKI9l69lxxIAzBT4nr7Gd8ES3LTLMw6j7P+Ib0dt+0tPbSiuK6hAkW/lO66NpWQb1pcwuKfc1MNR6Px8B98lASDPr371q8talI0bN/Yuu+yywZXt8GPNS6yRaK7n6SrqiUWXL3vZy8rCU2uQmh28tnveeeeVVcIWivE3Z0LAV0BTwRvzrjXMlnKvzS+Py8rKJHENU7JMpu4ITdO+XYFd/yg7+e9iGcyUMHcNZaheh7nvJtrBTOv9YoUpdflmplj5vKjFpv2tt95a2vVcmjJeDPSVhWIiX7n0R0VbDzjggGeUUV/hGO4ZoC7uNod7KYz9DuDhhx+eYLvCCKBe9WvoYoWuVWxWv4Vf/qy05F7b/aFFcRMm7LBYJRcjAGFoZfw4D42LpsHdPUbZEQo/wvoNxBFprO0EcQv4j/TwRzrHSliSnJuj7d6hPVpFW6cZ4uVelw0/wvgNmyqBeCK8sgqNXjwOYaRDucPIx45CVmZKs8Ny/GRqlDM7UbCilQbbZlRPnaHZWrHZJdhGsgpffVM+tS2gGvalPvjBD3bOUupk6Ev6ykUpO9aJa6N6wRvf+MZiW40fZVj3qzubsQWAJfJ33HFHOTcfyIZ+3bkathi+9IXKhM6ZiQZL67mznR9oYNwUSpt1wWiA/MReAnAf5gkUbB1fDTsbOk17ATiPsEwphF19Q67g8ccfH5xtox6+msv8xje+UebxWIGUnr4WNFL48McEBZMZ7gfzpuz86OSZv4hyDLPO3/zmNyeYh2jS7IzERcgZTjaNx+n0lY8jG+LMUH9DCahRl6+77roifLsEpay2URUKUY0+ga0kbdkUEQVGW0m2o16hVgyhrSrT3XffvXfqqacWu19zxdgCQCKjo9Zp1Z0/dKr8oPkiN7SruA7Go0DbGkVovbV9nPreoyQlY17uVTdU4UhfgsE1YUe9NI30wr3FQ4rH/WhBoXk3EZZ/4dxPR+038u563aGzLyO+6RDloUK1aRTJjtMUuuqP51/Xja6gPY3zbk6b0A/4/fznPz9wTcaFkU394VwqbmMLABWfuWN4IXzEEUeU80DjiCmO0KCj0QTRoWO6nV4NK4OGS7T7NkbFXQ/dpWtU51lrf9Fxi/OYY44p9yWAHnrooeI+FYSmcjA9I2zzBWNoBZPRtSmHhUBzRBZ116/6QYtrGyV0gTYzxpSSaCvaCdT7ZDuUQTSVZ/XI1A+lWB/LeGVzlLCzGFsA4JBDDinavY6XCd2Amy+FDJFlxjQHaM01s5UpUzuGl6zrTYemwGimL2iz8iiPrCG6r1FEPYU0GSS6hkEziukjWv908P4l2XlQBupRq46rfi8EHb/nTmCrH0Z5XfnSRTtRPjGlE7vu1VBsYlQc77OMHLqOekLRVHb6n7Y+h7lo29Yi6h3z9XPBtASAzsyD9mDr6ZUYHoYGEFMrRg31/H5T+50JCjA6cg1yXKIyElAqs3Q1h/Pcxd02gpDHuJ981iObmsi7TkRaY/ootCEjgXE1o5iGSE1q50Ij83xpaN75eF7c1IfQ/D3zONQPbaEr00Hy/PWvf718aKANe2lpNKuuR/loX66rq9xe85rX7NAof1fB6N2Ujn7HZ9rKDsqOwCQY1LdPfepT5dxLdP/nqm5NSwBEQ/FCuEYm6ykg0iu0AHvscnNMtt/uVMQOVuz6e5ErvuZQajJURi9NvW23r+uVV145uLIt/eKz2cWSJUuGQ7UajUAa3NMRw9wmtEPloBHEHgReCItTOKOg2E1tMqTJhvqhQYyiTRBJq4aYXwGNh2e/Zs2aMsL1Uj2em5FX8+ss6PzbXoTuquiMbrnllqEiol5CXY92aQpIm9CpKRsffhASXcdo/6STTiofr7zqVa8qm+YoFx9yxDQyNxtjmUUxEvjsZz87d2XXlzpTUn8T7Vv9wDfBvj8Pan++Zw2EqcONw1T3GRVf/T08mv5GhfUdc5NR9xjl7ttw8dTlkCRJslBJc9CzCK2fNkkDT5IkWeikAJhFzPMZFufcZ5Iki4EUAEmSJB1lWi+BkyRJkl2HFABJkiQdZewpIJ8xsvUxmc2aJOkC2oLFUF36FHQcrBCOVcLT+UQ72V52FoLNZR871gjAt+v77rtv+Y7VN8H1qsk2XJ+rpcxJMtecfPLJI40BdhVt3uKvSy65pHzPHvaqkvFQdspNH8tqwFwxlgDweaNEMcEAq1knw2KxmWwUkyQLHYuhYuV7sh3lYpXrhg0bSl9h9Wt+XzIeVgjbDOaXv/xlKbu3vOUtc1Z2YwkAQxPftluVevnll0/Q7tlIJyAcVgWqCA7D5Fg5WONTyVp7inNx8m8l4dlnnz1hNa5rcY/aPUnmEu2AORArgZOJsIvEQKQVrKPMpCTtKDt9Hua67MYSAJYpR2dubi86YfYsGEWz+OnTn/5076abbipDQQc7Nm1TRWzwjBIA7IxYfu9+zDXAPQyNFMzdd9/9DPv3STJX2H+CWQ/1PZkI5UwnZuqHkGSGJE1BjAczJMqOCW22gMJe0FwwlgBg+8MD9tKLhh4CwHwfmzpGB4xoERIqgEOH7ZfWpHN3OJ8MmpV43IOtDGHCDo5KZTOOemOKJJkrjFyZ6m3awUomwpbNE088UfYOzimg6WHafNOmTYN/c8NYAoB00gBoQDRwL8HAciYNnuau427DdRq8o9b826g1KyMNowhWBsM6o9HDdCyAJslsQTNjLE6dN7JVF9tGuF1n/fr1ZQe9r371q0PLuMl4RNkZCcxV2Y39Ehg0fS95vAQjEKBj5k7bD3813GgCjrbrU8GsgnsSDu4xGyalk2S66OyNcNU/9d95vgzejnKJPiFMxedudePho5oHB3ubzHXZjSUAas09NirYf//9i8li00Jh/GyqKZ4m8V4hiAoE0z8HH3xw+fV+wbSQvXObYZJkLqCRhSKjvpu3jXqfbJu+NUOgfHwYEm7J1JjuNr2t7ML8+JyVXf+mU9Kv6FtXrFhRzB0vXbp06+rVq4s7s8gvfOELiwlk7n7hl3v4a+KaOIXpC5HiJm7J4b5q1apyDe7B/eqrry7xhXuSzBfqqPqaTOR1r3tdaauOW265ZeCaTAXz9X3Nf1h2H/nIR7b+8pe/HFzduYy1EtjnnbFRsZe79Tw8aU9qNc0g82+UULsFEca1+++/v7xjMD1kXtWowty/jRRiOBQvkVG7J8l8YKTqS7VcCfxMlE1+JTV99LH6RHVqLuvVgrEGGgLAQogkSZJk5zPWO4C5wMhi6dL2TdqTJEmS2Sf3A0iSJOkoC2YEkCRJkswtKQCSJEk6SgqAJEmSjjKWAPCFjpV+fpsLsbjtyJL4+KTUZ56jzEmMg4Vi8730nI2kXKm8a6A+Np9ltIM4ukysiq7RBnfffffymbbV+0k7zIoou/r1KztAv/EbvzHnZTeWANAYfKXjW1Uddv3gXYvVwW34tnUyq4AsiEI8011ab/ecYN26dfOy9LzuKHzGOtVKZX6FSRYuvmWPdS81Gq4VmnF0EUpOmICv4f7+97+/d88995S1OqeccsqEDi7ZVkbafqyUDtS3Sy+9tPfe9763lN2pp5463Htlp+MroKmI1bqwak2w9evXl//xG1gF7OhnYPiff+FgZS+4I8JbWWmFJX9xLYgwcB5x18l/8MEHB2fbaIsnEEcz3TVtYbnV94jwVihbJQ1uzSIVT+Qd8ljHLU7/I0/J/OJZeIYOz6rGCvauo+30FbpnlI9y00/EClZ+7rvvvnKebEMZ1WUXZXXhhRcW6wd12c3VSuppCwBIfCyFdy06NOd9zaj8HnjggcXNrwxrPA888EA5X758+bDy+A/x8RNh63vyEx2ucM5d5x7X/I90+C8u8fjdtGlTcRc24l6yZMkwzhpprMOGH3HXy//FodMWjzT4z2/kxzVuDvHo6IWv0yxO4flxvxQCCwfPJ+oo/PeMPEOHetJl1N26fNTdgw46aOu9995bykc/MFfmDBYb/dFTKbsoH3XLgccee2xOBcCMXgL3Ez84mwhTuYYzhjlHHnlkmQ4JQ3KGP7HZ8dFHH9264pcJiBtuuKGYRBXXZFMlca2fh2KR1BGceeaZxW4743TcGakKTjzxxBLWhhW33377wHU711577TCsX3sejMJ8neGc8mimldns2NPAJiKmDwyb+e0/7JIu5SMd/CgveU4WDvV0nrr5wx/+sOzeZKrv2GOPHVxJoC3YKP+tb31rmc9+7nOfO7iSTEXdf5n+GWVCZ2cwIwEw6qVvX9MdvsjVwY/KxGTuzD+rTPYBaHaqk6FRgqDxLmD16tXlv19CKZDGoO2dAb+RPr/TeS9RzwuL2wb6OpFR7yasfI48TlZeyfzjWV199dWlfntW6tFU73u6hLJ4wQte0Nu8eXMxbfz1r389y2ca6Le8BNb/2HioPwoYXNm5zEgAjOoUr7nmmqJV68BJNJmaKQTBVPSH5IOzXm+vvfYqvyEIIrxOeLpEmOmGle8aW1j6MsLuSG0vDY0MGH6K8qoFVTL/1MqCulAbQayvJdtG5BQYHZf6HOfJ1OgnjzvuuKL0fu973yuCYK6YtgCIjTFqbVXCufsqR0WQIZVgulMa9cjCJ50xLKqp/RiSB7EXQXS08UloUwsZx1LhqLDBqM9NmyOWc845p7jZSN8DbqJ8bKmpvKTLNFGycKjrH82/FgCmhJLtKCt13ZSs+qztOE+m5sMf/nDZ++SWW27pPe95zxu4zg1jCwDz1w7z6z5VqjtS86I+BfXplwevIjz11FNFSwrTps3PxoLly5cPzraNLIT33sD8ebwzEI84XatHH0YA4q1HGqF9mLsXxvXYcR+1lt025SIP55577jDsmjVrBle2dfCO5nsBcTbzJ24b2fAvvnoayCeG0uyaT7/8PvLII539tHAxQID7ZJkQcOyxxx6t9aerKIvHH3+8t2zZsvI+653vfGeWz5joG7z3tG0uQerwnnBO8CZ4KrzV7z/Mcqxdu3bgug3X6k87bdgiWu6BjVyEhev155ThLqy4/e93+OV/4Jyba+KKN+Y+weTm/n7rMPxJh9+gDstv7b+mLSzcg3ukE75+cO6Qr7pI+WvG4578SrPPQ30BxI/PwJKFg2fZrOvqjmfneXb9iy11N9p9oEzU72hjSTvqVl12zqM/iqP+dHxnktZAkyRJOsqMXgInSZIki58UAEmSJB0lBUCSJElHSQGQJEnSUVIAJEmSdJQUAEmSJB0lBUCSJElHSQGQJEnSUVIAJEmSdJQUAEmSJB0lBUCSJElHSQGQJEnSUVIAJMlOZtT+EUky34wtANi7Z6f6zW9+8wT7+zuCOL/1rW8N/u047Oo37fIvFKbKqw1tprMjmLzaT7jJT3/607IL2XSo7y3eeiOU6RB7MMc+0KOI/Rncy/4LO4I9Iub6mSuryKM8TLbzleuvfe1rh+d1WmdazkkyW4wlADQym5vcOtjI/fDDDy+/O4rtG3VYs4VdmmJLyIWGdNlAfhQ6lOnsCCavbQKF2/nnnz/4Nx71vcU7083pYyOfE044YeDSTuze5l47+vzt1TvOLm+ziWcZAsAmPtEu2qivN+vnQlVWku4wlgC44447ypZ4dttSme34rzOjCdWdmoZdV2qaqP8xYqABRZjQOCNM7JIVhLZUa7Ph1vRb36d254/7qI43wvEXtKXROX9tHW6k33391m6Otg4u4nPw6z5x34gj4mtq89yMwiJtTaJjingQYdyjSX3v+rp4aKj1/eVfPHbEauYrwtsdLjo5eaDhC1P7HyVg3Ms9I+1xPygn1/yC3xA4TzzxxNDNqEgYfuN5uXe4xfUmkVZ+6uvi4OaQP4f0cff76KOPDsuIn4DSJJ64Hv6Fj5FbXS+5GUmII8qKG+Gm3YVfeY7ySZIdZSwBcP/990/Y3s1etyq0xn7ppZcOXLcJChuhQyXV0Gk9J598cnFT+W2PqMMlRGBLRB3GZZdd1rvxxhuLG3+2R7MV5BVXXFHmUHUw3EL4cAfB5FyYWvO98MILe9dee23xf955503YSxgaqHAamPjEg0ijfAnr3s75O/3004ufGh0S7dmoSHpx4oknlrDyZRvBwHXpkB7xuS7/ylE51Z2nMgttXF4gjZ/85CfL+ajRQnSQEY+w8grl1xQc9b39BldddVXpeJRphDn22GNLPeCvFppoi0eZ6Mwiz8HKlSsHZ9uRRvc66aSTSh6Vu20XI+3qoLIIAaeu7L333uVekWfXb7755pJGaY+ONuoowbVu3bphnDXqgi1Ib7jhhnJv9QCeuXD2dfb7kpe8pGwPuf/++5df+asFWsz3u4fRSVzfb7/9in/hY9orBJQw0mVvpsMOO6zUGW7y8qUvfalHgER5y3O0nSTZYewINhX9YezgbBu2LIstDOsobG8Y2+jZwtG2ZraJCz+2ibQlZGB7vdg6MradhLgjHtvvOWwzF1srxtZ8EF/4XbFixTBdrksnuDW3r7OdZISr7+23TqM4Ix75a8YjLfIXflznr3kuXn65xb0Q1+s08BdpEG+c+437KIsIWxPpCZzHFpzyEuVdU99b/MLElofOxck9yrbOV00znroc6zRFWH7q8onnEVt9Qjj3E7dzaVCvIo3iiDwJE2ms4/YbW+xFPE3cO8pJPG3PKtpBfU/+lCvcO/IQ6a6fh3B1fHXeI76Iu1nG4kmS2WasEUAMsWtoZ6Cp0nYMoWk0tBznNoX33iA01uCoo44anG2jHjYHNE6bvxtF2DDZwZ+RB7fQ7NzPtdCQzzjjjKEWbu6V5iRt73nPe55xX9ocbUt8tEr+Ie0XX3xxOYd0GNnwR9OsN3ev6Tfi8rtx48byy3+Mhmqk48orryzX2/IO2ictjx/pj3v6PeaYY8p5Mz9thBYbc+TKKbTOqaBB10iH5yJNMVKbDPeu09jvzEoco1Dunh+kN/wKJ9/Kvi8YhnXDc26mEfH8a2jgBxxwQDkfVebubcToetzbfaNeoDl6CqQHno06L+/SMc4zCtRB+VG+iLDKQl3dZ599yv8kmU3GEgCGnTUaSFRIld5/jcywWIV9+OGHe89+9rPLdICGEJ3jdOhrj8OpBOE1vmXLlpU4Ywgdc6WBBhRhNCThTJsceeSRrVNAZ555ZuloXY8pEzQ7loMOOqjky9crfW1v4NqOOWnh+Xc08y4d7icfGvYopCvC97X9gWtvhzsCz2WmRL50ktFRjWLPPfccnI2PsmtiSsizIgCUl+dkemRUR95GLRSifjQx/WS+3hTQqPpaC4AQrjW+9pE+/qaTPhAAhKCwUbbucd1115VpI9NvfYWtuCfJbDGWADjiiCOGWpFKqmJGJ2y+239HrZ0aAeh8XRcmqDWqUejkVHoaPA1QA3b//tC4xGmuFtHIomFKQ4xMvIBzb51Ff2g+fGcQCCMuWvFkaXLN/aJTCE1yFK7vtddexb+wdYcjfbTF0047rdxb3tqQLx1oxBFzvsohXgbWndEoopxijlwZxieJ00VaIl/SIS+ToePmh5D2/KUh8tsU3CBkac/g1zODEaV0Rxhz6UYg8TzGQZ6jU63fydS4h3t6flFf63xyU5/aiHwRkM69c4j0N2l7bp5xvNsg5Mz3S482pi2po5QrKJtxnn2SjMNYAsAUSrxMpCnpnKNz0XD9N9UTQgE0FmG8TDTVEtSa9ii8eNNhEwDupzPUGE2pSIMGFho97dhLW36lITRkIwgaO/8acUwv1LjmEK45QghoYNEgHVOhY7rzzjuLXy9qpTugPcM0jOumz5SHe7tGWMXXKkZROq3jjz++jBZgakpaCI9RL4HjfjoOZbF27drScfkvfsKniTCuTZY/+fIi1r2NnCIvo5AHx9FHH11eBnsWMbJ6+umny2+NOiZP8u/FeEzDuY9nKR6oY4TqdASAKUNx+8qmTfhAPVLeysloVp0IBUOaPKtYvyA9/HCH80AH/vjjjw/D1gjneTevua+yde/bb7+9PCP580y4OQgx6ScoRj37JJkuz+pXvim/KdNwaUYqtw5fp7hkyZLB1W1fgPivEQc0ob//+7/vPfnkk0Vzd13Dpc2q0NDxveIVryjx19c0evOv3/3ud0vjoAW673333VcakMZxzTXXlF+NiV/30mnElI4wGpXDCEanVUPr0lGLz5z8hz70oXIvGhaBFZq+X24auevSUeP9SLNDcr/PfvazpcH/+Z//eXGTV3mT3kiXNP7kJz8p6X3Vq17Ve+yxx0r6uYuPtiqMThfOhfv+979f0mJqrtmZKEvPQ7rFI4z0GZHdeuutRYNuIk/uLYw0RxogrlNPPbXcy3O57bbbSpyEexvPetazynXIg/L1jHWwMZUoPdLtPr/yK79S8i/d7mmE1HxnI13KNMr++c9//jB94lC3XJN2z05c3JcvX17cPb93vOMdJQxheM899zwj/eqDspFm9VWdkkZrGqRbemLKTnpc+53f+Z3eb/7mb/b+4A/+oLhBGbkWaTVqiusOafBfGvkJf+7r/u4dz+iss84q5+4dbUs63/CGN0xof0kyU3bzJnhwniS7JEZNXvDqZI0G/UZnniRdJgVA0glo/LR6nb8jSZIUAEmSJJ1lrJfASZIkya5HCoAkSZKOkgIgSZKko6QASJIk6SgpAJIkSTpKCoAkSZKOkgIgSZKko6QASJIk6SgpAJIkSTpKCoAkSZKOMu8CgJ31UaaY0+75/BImsOv9HOYCz50p5DZcm8xs9SgiL6NQB5kUb8J43EzulySLgbEFgEbAHvk4aEyxkYbfycKxu37RRReVc/cI08ewiXkyPzA3zYCa5xF272fCdMOqO3Z++9jHPjZwmYj6Is5xOmX+QpDwP1kYZqjjul/5RwqAZFdmbAEQHfo4jUFjigbE3jkb56NgOz2sM4o79lfFqF2Vkp0Ljd/OY9/85jeHHWibdjwO0+08PX+br9i7oA37M9c7dU2GfLAACnVwsnpo/4rYa7oe8diApq6Hrrl3vbFMuI2733KSLBhYAx0HXvsNYWu/sx64bKPfUIubY8uWLVs3bNiwdcWKFVv7jbS4Pfjgg1tXr15d/AofrF27thxXX311uS6epUuXlqPfUIuf2v/69etLGiIuCFvfO5kdPJd4BnCujLF58+byfJvPgrtnHvUEnqX/jjbE6Zr4oA6E/zruwD0OPfTQkr5mnBGXNPAX/x3qjv8OeYn7wX2k171di7gd4d8v1LHIU19gDN3Cv0P9T5LFwlgjgJiL7zeECRqd4bqNNfoNqvy3fWONHZrs/hRh6rCG+HZIcj20tCZx37gPrTC2LuRmazxpQm6TN3vQwustH/sd5HBjes/N8+oL33Iez9Q0ntGcZxRuMZ3Hrdaq4Rp/4hGfEYZ65Hna9Sqeaw3/0hW7hUX94K5e9Dv+klbpkl7xxG8gjfUoU7i4HrvNCeO3LwyKexD1rd9uyo5ewpqSkm5ufWExcuoqSRYkRQxMwW233VY0nscee6xoOTQq0JxoSMGBBx5YfmlToSGF5o7+0L5c27RpU3GjPdUalt84R8TBzwUXXFDOhfe/vod4rr/++nKe7DieQTzjmnj+RnXwHDxTCBPPQH0JRlUxmroRHMS3fPnycl4/1ya0/34H+4xzdSPqoboV5+IRH+q65d7S6L7SJ0x936hj8Bvh1G/XlM1ZZ51VzuVZWsSlfKJskmQxMNYIwNzmz3/+8966devKfxtXxy+NKrD36mQcc8wxRVuzry2tiRY1GTSy+HVvL/VCq+w3yuJOG7zxxhuHG3Yns4ORWZOY447Rgd+YC/c83va2t5Xn0bbpexPxn3TSSeVcPN/+9rfL+SiMIDxv7ybUgziHdEWavHOK90+jOOOMM0qYu+++u9TD2Jc3iBFMkx/+8Ifl3j5OsOezUag9g93bi2sb18cG/kmyGBhLAGhoe+65Z88w3XBZhwsbb9dM9RLMhtxelhm6a4RTYUPtwKbghveXX375sLP/xje+UeIxpK8FUbJjeMY24A90qDq+6Cib0zkQpq9Jl+dhg/1xXtI+/PDD5Vd8fe26nI9iw4YN5eWv5+xefc18WN/22Wef8gtKyKgOPDjnnHNKWApMbC5fQ5i1IY390WaZ7nnggQdKXp988smSFm7CeYGdJIuFsQTAo48+Whq046677iram06c5lPP0x977LHlfBQ6EILEvGlof5NB44KGtffee5fGv3Hjxt5nPvOZ0sivuuqq4buBr3zlK8VvsuPoIG+++ebBv21fgHkGnp/3OqEAGI2F4D3++OPLyM7zoAm3jSBqzLNfcskl5fyKK64oysFkGAG6F2EUx/7771/qQYws4SuhWgCol03UWwJFnZHXNtrSf+SRRw7zfvrppxcBpi6ee+65xU286neSLBrKRNAk1HOjQX/YXOZvffFgPpWffgcx/Poj3PuNfMI7AHAzZxrUc6zi4TfmX+twwvhCw1cY5lnjqxNu4ow4ktlBeXrOfuvnH8/I8/Dr/QviufLv1/NB01/gumcpbtdj7rytvoGbazXqm/uKW1zSq07EvV0Xd9TPuo44Fyao76v+CsdPXT/jnYEj/Ma9w72ZxiRZyEy5KTwN/6GHHirfQwc0rD322KO4mR6KobjvqGM4/vGPf7xoaKZuaGU0Q4iPphjTOMKKv9/Iyn/TTLR918UR32bz5160rPAboxLU9052HHP7N910Uzmn7dZl6xnSkPud+4T3OPEsjBRiusiUjKNtis7Uz5133lnqiOcabkacr3zlK8v/QNzNOMT7xBNPlLDxjqC+N4QT11NPPVXSHPepw0J40zl1uk1BcvMb+Yz7NNMS98k6mCwmphQASZIkya7J2CuBkyRJkl2LFABJkiQdJQVAkiRJR0kBkCRJ0lFSACRJknSUFABJkiQdJQVAkiRJR0kBkCRJ0lFSACRJknSUFABJ0qfNaFyS7OqkKYgkSZKOMuMRAKNYqTUlOxvbLmY9S5Kdw4wFAOuI9vRNkp0Fq6Ovfe1rc5/dJNlJ5DuAZEHCvLJNYuwCZjvSNnPSSZLsGCkAkgWJXePs+PaSl7yk7BEx1Q5jSZJMnxQAyYLFhi2xxWJsTpMkyeyRXwElCxIvf83/Y+3atb0LL7ywnCdJMnvkCCBZkBx11FFls/+lS5f2LrroonwHkCQ7gRQAyYLEF0D2fiYIHnzwwbJHb+w5nCTJ7JACIFmQLFu2bNjhx2bv+SI4SWaXFADJgmTNmjW9j3/842Uk4DACWLly5eBqkiSzQQqAZEHygQ98oLf//vsX7f/uu+/ufeYznymLD5MkmT3yK6BkQbPbbrv1soomyc4hRwDJgmb9+vWDsyRJZpscASRJknSUHAEkSZJ0lBwBJPOKl71e9B566KHlPLDy98c//nFZCPbRj3504DqRN7/5zYOzXm/FihXD1cKf+9znygGriMNqLbPSxx9/fO+5z31u77rrruu9/OUvL+5J0lVyBJDMGzp2Rt/wwQ9+cNhpM/4W50xBtwkA19sWhtmngmDQ2ft8tDYlzbQE66JwvyTpPEYA88kDDzxQfh977LGtDz74YDmfCZs2bdq6ZcuWwb9kMdDvjLfedttt5bzfUW/tjwLK+cqVK7euX7++nK9Zs2boXnPrrbduPeusswb/tnP99deX8FAnVHF1i/84x4EHHpj1Jek8Y40A2GHxOZ7DcDq0M7hW/2+jHqo3edWrXlV+v/Wtb5Xh+XSopwx8J/6Vr3xl8C9ZDLD0efDBB5fz+OYf6lTY/jFNE+416tyTTz5Zpn3qkYAFY4cddlg5t3oY6hb/TEvss88+xc21rC9J1xl7Cmj16tXFOBfbLDp0Q21oqOZpJ2MyAbFq1arBWW/KeJrUDV9HMd3wyfximibm4U376KARgl0d08GHexP1yhTP61//+mEdUyfU0SRJpmZsAaBRaYiEgCX5d9555+BKr7xUA03rXe96VxEK0Yhp5iA0aGfcNdIYFeyxxx7lFzRCHYHwfgNhhAX3L3zhC6XBc3M/c73i2bhxY/GDtnicMy/g3qeccspQiCXzhzrjOf30pz/tXX311QPXbR35scceWzaEqd0DL42vv/76skjMr3qA0PCTJJmaGb0EPumkk3r3339/OddQY4h++umnF4NdGqOXe2y629QDtL299tqr+NUB+2oDn/jEJ8ovDMkdBM35559fOnYIEwLAdZ2G+EwBuN/Pfvaz4vbwww8XP14aCq9jueKKK4ZCQNjLLrus3FuH41oyf3iGOnkmHr785S8PTT2oU7T6o48+upy3mYCgFJx99tnlPAzFqW+vfOUrJx1xJkmynRkJAO8BonOu0VHT1nTg11xzTRkZhGamcUZDft/73te6wYcvNIwwhDHKWLduXXFv09SFpwXGtBTiV8cuHToJwqDuEE477bQSlnDwmWEyf3jnc8IJJ5RnWHfyRmmmBuvRWxNKBOEAwhyevxFA1JdQGggFdSX8w7U0Lpd0nRkJAJpbm1am0R5++OGlcWqIbd9Zh5bWhk45EH80bJuCj4tGHqMQEEb1S8ScIlg4eC60dwLaEUrBF7/4xTIdqB45wt1vCAXve1wTjsDwjgrHHHNMGekR/O9973vLaM8zP+ecc0qc6oVw7ttWh5OkS4wtAOoXrF/72teKRtVE46TNQSPT2TeZ7AUdwdJGLORpoxmmLV1tbsnCIDr/OEBo16Oz+jz2BNDBe67qmY481gpQOtRBu4gZpUZ9VIdiNKhexjuqJOkyYwuAeNFLw9aIYv61hgavg9fojAbqRThtU0ZNCJYYvvMfn/EhRgPNeISp0RnoGKKB+02tf2HiBW500o4Q5vG/PqAO1s9SXRRHXA8IkIi7Vh64q1/uU482k6SrjC0Azj333KJteTmnwdWdcw0BENpcDMuNHuodnkbB38knn1yG6V7shpDhfumll5a46+kctI00dPpWerrm993vfvfgSrKYOe644/JZJsksMpYtIJ9dhublRW09t++aJfYxZ3/TTTeVYToNK7QsmpjO31dCXuyap434uPMn7COPPFLC+qLHy9p6jtY8r8VCsHjIewQv8hw0foKhTpt7EkK0vnBzL/cV1j3cMzXBJEm6ShqDS5Ik6Sgz+gooSZIkWfykAEiSJOkoYwkAc+dtn2h6+dr8KmcchBkVX9uno3PJTPKTzBxf5XhX07bYj9tk9UE419XP8BfPLz5EaMbNL7ckSfp4BzAVzOu+6U1vGvzbRpjaZa53ughz6623Dv5txz2a95lLpClMCY+CmeKp/CTjobyXLFlSzD37bZoDV09G1YcI61ksX75866pVq4q7/+qlOOM8TEuHX2aoZ1Jvk2RXY2wB0JQVGuBsC4ANGzZs3bx58+Df3OPe0VmMIvKd7DhLly4d1gMdeN3ZexbKeTIBMJWyQKCIwy//7gdxEwJJ0nWm9Q7A8Dmoz2FKx+eWsWdADMUNv32/z71efWnIzp9PPWP4buFYLB7zDT//sQ9BfT/XmvEF7ive8ONXWOfcIx7TABF3mBew4jR2qBK3laPC8MO/uMMsQdw74nZEnt3TEfmL6S5+I76IJ9Lrc1TuzmPKovZf5zXKc7F/wqq8fbqLfmdefgP1wOe9o1BnJrsOz9IaEvXS81NuUKbCRr1Lkq4ytgBgXC06T9xxxx0TzPQywOb7/r4GXayFXnXVVcWdPRYbdHC3ZiA6txtvvLF0sNYQ1CuG62X//AtnVbF1ANBZP/XUU70tW7aU602sI4iORVgdrMVDka6I5z3veU+vrxmWwyIzCFfPF8uTNPZHLGVxmnUI0YkwJw2L1aSlr2EO4xGH+95www0lf8wSwL25bdq0qeRZee69997lvhbWSSO7R2FqO4QQ9zCrzU0H1hfeZU1D/UwWG/IVQizyB3lSPz70oQ8NXJ6JMrPIjyBUds1y8AysSVF+o6jrWpJ0kbEFgA4wGhnNqWlM64wzzihWPjVoNtzDEqPOTKfN/e1vf3vp4Cza4kbrG2UYDjpZ4RxhCoKhLx26ex9yyCEjtbi4J+2vLR4djmvMCzz++OPFrYk8SaNwBIsONzRV6aZVHnnkkSUt3Dds2FCuQUctXJ0/6ebGLDbEGeV05ZVXDtPILUYNcf9YFe0ZxAprcceIZTEiXzBaUk9s4A55uvjii4eLBUdBMBOEJ554Yu+SSy4ZuG6DACGw43klSfJMpjUFpPOkWWlcGm+tLevYzzvvvNIZfvrTnx6aithvv/3KLwiRGH6PQ5u5CR0gcxQ0Px3wdCyF1uhkCYAzzzxz4PJMQtufjHoqycikSTMP7kloxNRHUAtTNG0c1VNARhXuRwNuxrOYUH8IMaMl+wGoG86VKVMghLT/dd4DI65w18k3y8vozSgvSZLRTEsA2KCDBm7nLQKg7nx1pBqzRq1hhmb77W9/u/xC5932+ecoIo4aowtTBzQ/0zehRU4XU1N33XXXM6YOpovOR1ocbVNStQAgAKNsaP/TId5TYPPmzcP805QXK+w+0fJ18jFS0vErU6NE5eR/0/4TjBqEa4MAUb61wULvAuq653psSpQkXWVaAkBn6+Ulbcs5jS0wnxqdcd3Q6pdtbZrcZBosbbkJrTwavk5gpkiX9E9HIDXRgURa5LEtfzU6Mp1bPXIaRXSCAW0fykQHB1MlTc13MSHtzTLzfGn3oeHHfyjjutOP6S9CvO7MlY/yq/Hf/ZS9eAiAuv4mSRcZWwBoVF7y6uijcdUd2cqVK4dz3KaAGFuDF3ksiXKnDTcbXRh4ayLuNg2PxusFs/gYhZspYQjOrlQHHnhg60igraMmOAgtYeVFmeiUabNtlirjnQP4Ec42iOJxz7ZproBBPHE7nMN7FNMb4rnvvvue0dEtFuLZxnSeozkN1sTUYwg/8/8+RBDOVNF1111X3AP1sYYgEWbfffctU2jeuSRJ59k6Br6jDprf6tfX1q9fP7zmPODW1+IG/2ZGfZ8tW7ZMGp80Bu7NfxDxcAt/3NrSPS6TlUkT6XZv/uP+dXqbuDbZ9S6h7KwhSZJkdkhroMmiwZSQef3JRk1JkoxPCoAkSZKOMq2XwEmSJMmuQwqAJEmSjpICIEmSpKPMiwBoW+AFnwaO8418kkyFulR/ghuoe22fFydJFxlLAPjmvG3RlW+wp1r81IbvtuN77hqLnc4///zBv52PRWBhlTOZe5S/NQ7qkd9YlGfVc6wNcLTVlfp67Y8CYX3GsmXLes973vMmhHX+4he/uFybSb1Nkl2NsUcATaNrO2pCoQ2rOedyeb6VobUl0mRuYSXVojorff3Gs7BK1wI37g5mHJrENUdtlTY6fO6syIaAJ1woMRFmMRvRS5LZYmwBYAVwrO5Fm90b5o5pVo56+E2j0/jqMDQ1tnF81x3TPjS3WCmsIfMvLmGb9zYqqd1q3C/SUU8pcXc/wstUQHQW/LXBPaYL+A2hF+fSNSpsMjXK0eppnb1fK32h7nCLo80oX32dwCBAnN9///3FBHRcC5PPt99++9CPg5HCnaHEJMliYmwBwFRv3YGvW7duaL4XNC3XDeXZsAnb+Dpdpgs0unCDqR4NV4ONaR8dQnTKfk899dQSF+3tsssuK+5GIuIhPJhUaCKc+Jh5Fj/zC+EuHUcccUQxP8Akc0w58NeGKamwxyN8LQB0/vLkvDk6SsaDWWtmGfD000/39txzz3JOsOvE1aXJ7PkHYT4aphc9F8/Es4nRAyOGlIaAEbpRzz1JusLYAoBt/NC4adV77LFH0dbDTYdLGw4NKzTna6+9tljd5MZuTnSi7LIYik9msveCCy4ofgiX0ORNE7AvJD72dJov9B555JFiB0YYcR933HHFXdp0EgSH6zr2mB4gpMQvbY5xXhKyzSMN7pHTSDND587+j46ajaPasilhoHxNE002ynKNMFc/azwTgsEmQEmStDO2ANBQH3rooXJuqM40NMKMr4ao8zRcpx0HzEHT5GCKKLSwcJtsWX/bhiA6C/G4h048NPSAkKHtSQdjYdF58Cfdwj388MPFrUYYIwMH43VTEfmXfmlKZobn45kQ6oRzuKlLfgkBxgVH4Roh3DQkR3FgNpwQqKcBkyTZztgCADptQ+swB12jEesINdjYsWocYkQwHdzbfWjuzZfG0rh58+YiADT+eKcAbsLRPI0eariziuEYZ0rHfHIgbDJ91BfPSGcdnT+aZTtq60Z1p7ZOC0IjpvaijoaSEO5JkmxjWgLghBNOGJrkNZdew02HbFrFpi0BU8uhgdmasTm9Ml3DXhq7MH5p+HUHD3PAXvjp5JlLjs5Dhy9dwknro48+WtzHpalFxvsQU2B1h5WMj06fWea6A4ctHqOeqFO+5oFnUK8h8QxM59Xav+fh+SP8qi/ioLjExwn8NU1GJ0nXmLYAoLHRupsdt5dtOlYdr5et8YJNY/ZSlvuGDRuGUz/BdAWA0YX9AMTnBXITm6zH/bwsjpeANEPp8kvDN3UV1+opqxodE4FGkzRFVHPzzTeX/Ho5vZh35ZpP1BHPsv6WH+qMfRqi3KN8PVcCPtCJ1yMH+JqIP8/U1puhMIhLvTV1ZyToA4Kp9h9Ikl2dZ/U7xCm/Y6RJaUA6V8Npc+Q6ctv1Pec5zynnGtU999xTNG5DeiMFjdNI4Tvf+U4JR9vTGDV8nS/t/YknnihbSwpviM49zv3y7wXzY489VtIQGj/tXtKbAkRa+KftPfnkkyUtS5YsGQqeBx54YOgmLn4d4m6iw5DH5z//+b23vOUtvZe+9KUlHh0/YahzMv8sncn0Uba2EtVJOzx7L+3VGc/7F7/4RfmAIJ65OqGuxLPy7F/xileUZxlwE4fn7xkZQQTqrXrID8GtPidJl0lz0DOAdmlKoU1oJDsPAt/IzVRikiQ7zrSmgJJtxNRRMrcQANn5J8nskSOAZM4YY7ZxzjGSy3cBSVdJAZAkSdJRcgooSZKko6QASJIk6Sg5BZTMCz7p9Klmk1gUZh2H6/GJaBs+x3VY5Fe/XxB3mJquPwMNdzAhnXP/SddJAZDMG/VntFboshulOurMLThkcO8Tn/hE6aybC76sFLaoy8IvJiF05tZ3iOeQQw4pQoNhwGc/+9nFHdZwHHzwwb3999+/hJ+JGZIk2aUgAJJkvlm1atXWpUuXlvOVK1du3bBhQzlfu3bt0L2m38FvXbNmTTlfv349Jaac94XF1hUrVpTzLVu2FHe/fSEw9IP+qGF4jyTpKvkOIFkQmMqpjQjG6mqrgNuMwVmlHUbeYmV5nMfK4Zji4U/89VSS6aFRRuaSpCukAEjmHVM+bPrH/gwxNcMEiWthDK6G/X+dumkkewmcc845xd0U0DhG3pomRJKki6QASOadsOlf44UtY27sBdUvcgO2pmjx3g2cfvrpZfc2sPI6zsvd2qpoknSVFADJvMKkMwNvOvGAlc/DDz+8vAQmCNogNIwMTOuEgIgvgvy2kRvDJMlEUgAk84q9pU3n1Lu/hYltO7+NggXXIDp27wGMCkJohDuhQFDUJr29K/AeIUm6TH4Gmswr5vAvv/zyCSa1TeE0p3104NYGeMEb5/Z34M87A5vA6Ph93rls2bLe2rVry9afGzduLPs/uGYDensE2xjICKK5OVGSdI0UAMm8QgA0v8dvM7PNjxfCpodiNzb/uRs9XHPNNcO5f1NABEPTnV+jCi+KhW27T5J0iRQAyaKB1k+rb3spnCTJ9EkBkCwaaPA2hKnfFyRJMnNSACRzxqivc8bBC10vcb3QjQVgs0GYiUiSLpICIJkzdkQA7Cx8CRQrh5Oka6QASOaM5svecfFp59NPP11e3lrB+8QTTww3+U+SZOakAEiSJOkouRAsSZKko6QASJIk6SgpAJIkSTpKCoAkSZKOkgIgSZKko6QASJIk6Si7/ehHP8rPQJMkSTpHr/f/1NljlNxcfAkAAAAASUVORK5CYII=\" /></span> \r\n</p>\r\n<p>\r\n\t<span style=\"font-family:&quot;Calibri&quot;,sans-serif;font-size:10.5pt;\">What\r\nis the traditional overhead absorption rate for period 6? (give your answer to\r\n2dp)</span>\r\n</p>",
//     "difficultyId" : "ff8080814ab43431014ac3a0b53729eb",
//     "sourceId" : "ff8080814b495afa014b497455f9001a",
//     "versionId" : "ff8080814f3eb9ed014f4e30e9691c3e",
//     "fileName" : null,
//     "sheetName" : null,
//     "nid" : 12906
//   } ]}
//   var exam_tpl = $('#exam_tpl').html();
// var content = doT.template(exam_tpl);
// $('#exam_content').html(content(exam_info));
// swiper = new Swiper('.swiper-container', {
//     nextButton : '.swiper-button-next',
//     prevButton : '.swiper-button-prev',
//     spaceBetween : 30,
//     pagination : '.swiper-pagination',
//     paginationClickable : true,
//     paginationBulletRender : function(index, className) {
//         return '<span class="' + className + '">' + (index + 1) + '</span>';
//     },
//     onInit : function(swiper) {
//         $.each($('.course-test-title'), function (k, v) {
//             // $(v).find('img').attr('src',static_url+$(v).find('img').attr('src'));
//         });
//         $('.swiper-pagination-bullet').eq(15).nextAll().hide();
//     },
//     onSlideChangeEnd : function(swiper) {
//         var num = parseInt($('.swiper-pagination-bullet-active').text());
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
//         saveTaskProgress(now_progress, total, state);
//     }

// });
function stringToEntity(str){
      var newStr = '';
      var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};
      newStr = str.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){return arrEntities[t];});
      return newStr;
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
    
	api.showProgress({
		title : '加载中',
		modal : false
	});
    
	
	ajaxRequest({'origin':'http://api.caicui.com/','pathname': 'api/v2.1/testcenter/testexamination'}, 'get', {
		examenId : examenId
	}, function(ret, err) {//004.014获取试卷考题
		if (err) {
			api.hideProgress();
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
			return false;
		}
        // console.log(JSON.stringify(ret))
		if (ret && ret.state == 'success') {
            // ret.data = JSON.parse(stringToEntity(JSON.stringify(ret.data)))
			exam_info = ret.data;
            
			var exam_tpl = $('#exam_tpl').html();
			var content = doT.template(exam_tpl);
			$('#exam_content').html(content(exam_info));
			start_time = get_now_dates();
			//开始做题的时间
			$('#result_question').html('本次测试共' + exam_info.totalCount + '道题，<span>' + exam_info.totalCount + '</span>题错误');
			$.each(exam_info.items, function(k, v) {
				if (v.questionTypes == 'radio' || v.questionTypes == 'checkbox') {
					var correct_res = '';
					var context = JSON.parse(v.context);
					$.each(context, function(kk, vv) {
						if (vv.isChecked == true) {
							correct_res += numToAbc(kk);
						}
					});
				} else if (v.questionTypes == 'matrixRadio' || v.questionTypes == 'matrixCheckbox') {
					var context = JSON.parse(v.context)[0].items;
					var correct_res = [];
					$.each(context, function(kk, vv) {
						if (vv.isLable == false && vv.isChecked == true) {
							correct_res[vv.x + vv.y] = true;
						} else {
							correct_res[vv.x + vv.y] = false;
						}
					});
				} else {
					var correct_res = '';
				}
				user_exam[k] = {
					'user_res' : '',
					'correct_res' : correct_res
				};
			});
			api.parseTapmode();
			api.hideProgress();

			swiper = new Swiper('.swiper-container', {
				nextButton : '.swiper-button-next',
				prevButton : '.swiper-button-prev',
				spaceBetween : 30,
				pagination : '.swiper-pagination',
				paginationClickable : true,
				paginationBulletRender : function(index, className) {
					return '<span class="' + className + '">' + (index + 1) + '</span>';
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
                    $.each($('.answer-analysis'), function (k, v) {
                        if($(v).find('img').length>0){
                           var src = $(v).find('img').attr('src');
                            var srcSubstr = src.substr(-3);
                            if(srcSubstr == "jpg" || srcSubstr == "png" || srcSubstr == "gif" || srcSubstr == "svg"){
                                $(v).find('img').attr('src',static_url+$(v).find('img').attr('src'));
                            }  
                        }
                    });

					$('.swiper-pagination-bullet').eq(14).nextAll().hide();
				},
				onSlideChangeEnd : function(swiper) {
                    selectClick = false;
					var num = parseInt($('.swiper-pagination-bullet-active').text());
					if(swiper.slides.length>14){
						if (num > 8) {
							$('.swiper-pagination-bullet').show().eq(num - 7).prevAll().hide();
							$('.swiper-pagination-bullet').eq(num + 7).nextAll().hide();
						}else{
							$('.swiper-pagination-bullet').show().eq(14).nextAll().hide();
						}
					}
                    // var src = $(".course-test-title").find("img").attr("src")
                    // $(".course-test-title").find("img").attr("src",src)
					/*
					if (num > 10) {
						$('.swiper-pagination-bullet').show().eq(num - 9).prevAll().hide();
						$('.swiper-pagination-bullet').eq(num + 5).nextAll().hide();
					}
					*/
					//切换测试题时保存学习进度
                    if(selectClick){
                        saveQuestionRecord(swiper.previousIndex)
                    }
					var now_progress = parseInt(swiper.activeIndex) + 1;
					var total = swiper.slides.length;
					if (now_progress == total) {
						var state = 'complate';
						//任务已完成
					} else {
						var state = 'init';
						//任务未完成
					}
					saveTaskProgress(now_progress, total, state);
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
			saveTaskProgress(now_progress, total, state);
		}
	});



    api.addEventListener({
          name: 'close-correction2'
      }, function(ret) {
            $('.swiper-pagination-bullet').eq(14).nextAll().hide();
      })
    
};

//数字转成ABC，用于选择题的选项编号
function numToAbc(num) {
	var Abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
	return Abc[num];
}

//点击查看试题解析
function showAnalysis(obj, num) {
	//选择题要判断用户的答案是否正确，其他题只要做了就算正确
	var questionInfo = exam_info.items[num];
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
	} else if (examType == 'matrixBlank') {
		//矩形填空
		$(obj).parent().prev('.exam-yf').find('input').each(function() {
			if ($.trim($(this).val()) == '') {
				result = '回答错误';
				return false;
			}
		})
	} else if (examType == 'question') {
		//问答
		var tempval = $.trim($(obj).parent().prev('.exam-yf').find('textarea').val());
		if (tempval == '') {
			result = '回答错误';
		}
	} else if (examType == 'matrixRadio' || examType == 'matrixCheckbox') {
		//矩形单选和矩形多选的题型
		var circle_green = $(obj).parent().prev('.exam-yf').find('.circle_green');
		circle_green.each(function() {
			var temp_check = $(this).data('check');
			if (temp_check == true) {
				if ($(this).hasClass('hide')) {
					result = '回答错误';
					return false;
				}
			} else {
				if (!$(this).hasClass('hide')) {
					result = '回答错误';
					return false;
				}
			}
		});
	} else if (examType == 'multiTask ') {
		//多任务
	}
	$(obj).parent().find('.showResult').html(result);
	$(obj).toggleClass('open');
	$(obj).next('.answer-analysis-cont').toggle();
}

//用户选择单选试题选项
function select_radio(obj, num, res) {
	$(obj).addClass('question-selected');
	$(obj).siblings().removeClass('question-selected');
    selectClick = true;
    if($(obj).attr("data-check") == "true"){
        $('.swiper-pagination-bullet').eq(swiper.activeIndex).removeClass("danger").addClass("success");
    }else{
        $('.swiper-pagination-bullet').eq(swiper.activeIndex).removeClass("success").addClass("danger");
    }
    var errorNum = $(".danger").length;
    var correctNum = $(".success").length;
    var tmp_progress = errorNum+correctNum;
    
    var total = $('.swiper-pagination-bullet').length;
    if (total <= tmp_progress) {
        var state = 'complate';
    } else {
        var state = 'init';
    }
    saveTaskProgress(tmp_progress, total, state);
}

//用户选择多选试题选项
function select_checkbox(obj, num, res) {
	if ($(obj).hasClass('question-selected')) {
		$(obj).removeClass('question-selected');
	} else {
		$(obj).addClass('question-selected');
	}
    selectClick = true;
     if($(obj).attr("data-check") == "true"){
        $('.swiper-pagination-bullet').eq(swiper.activeIndex).removeClass("danger").addClass("success");
    }else{
        $('.swiper-pagination-bullet').eq(swiper.activeIndex).removeClass("success").addClass("danger");
    }

    var errorNum = $(".danger").length;
    var correctNum = $(".success").length;
    var tmp_progress = errorNum+correctNum;
    
    var total = $('.swiper-pagination-bullet').length;
    if (total <= tmp_progress) {
        var state = 'complate';
    } else {
        var state = 'init';
    }
    saveTaskProgress(tmp_progress, total, state);
}

//矩阵选择题，点击小圆圈选中和取消
function select_matrix(obj) {
	if ($(obj).find('.circle_green').hasClass('hide')) {
		$(obj).find('.circle_green').removeClass('hide');
	} else {
		$(obj).find('.circle_green').addClass('hide');
	}
}
//保存任务进度
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
    var exam_id = exam_info.items[swiper.activeIndex];
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
            exam_id : exam_id
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