VAR TG_CHOICE_INLINE = true
VAR players_gender = "男"

《屎坑产品逻辑大赏》
屏息开始！


-> start
=== start ===
您的*性别*是？
~ TG_CHOICE_INLINE = false
+ [男]
    ~ players_gender = "男"
+ [女]
    ~ players_gender = "女"
+ [不告诉你]
    ~ players_gender = "null"

-   {
        - players_gender == "男":
            先生
        - players_gender == "女":
            女士
        - else:
            朋友
    } 
    <>，恭喜你被红包🧧砸中
是否领取红包？

~ TG_CHOICE_INLINE = true

+ 领取红包
    -> yes_get
+ 不领取红包
    -> no_get

=== yes_get ===
扫描二维码关注微信公众号即可领取红包哦~
+ [扫码关注]
    -> scan

+ [忍痛放弃]
    -> giveup

=== no_get ===
您真的不要嘛？要不要再想想
+ [想想]
    -> yes_get
+ 忍痛放弃
    -> giveup

=== scan ===
您已经关注了微信公众号哦！
现在，复制邀请码分享给8964个好友就可以领红包啦~
+ 复制邀请码<>
    ，分享给8964个好友
    -> shared
+ 退出
    -> giveup

=== giveup ===
// 幸福与你擦肩而过，您的红包已经被抢光了，再接再厉哦~
曾经有一份巨额的财富摆在你面前，你却没有珍惜，直到失去的时候才追悔莫及……
+ 现在后悔来得及吗？<>
    当然来得及
    -> yes_get
+ 坚决离开
    -> leave

=== shared ===
幸福离你越来越近了，您已经分享给8964个好友了，还剩一步就可以领取红包了！
填写表单，完成实名认证，即可领取红包哦！
+ 填写表单
    -> yes_get2
+ 忍痛放弃
    -> giveup

=== leave ===
……正在离开……请稍后……
啊，根据前方的报道，又有一波红包雨来临，您居然——
又 被 砸 中 了 ！
+ 领取红包
    -> yes_get
+ 不领取红包
    -> no_get
+ [我日你先人！]
    -> ending

=== yes_get2 ===
恭喜你，填表单的速度超过了全国89.64%的用户，您已经领取了红包！
+ 打开红包！
    -> openhongbao
+ 扔掉红包
    -> giveup

=== openhongbao ===
红包已被抢光了，再接再厉哦~
啊，等等，根据前方的报道，又有一波红包雨来临，您居然——
又 被 砸 中 了 ！
+ 领取红包
    -> yes_get
+ 不领取红包
    -> no_get

=== ending ===
鉴于您的污言秽语，您的账号已被加入 **黑名单** ，请联系客服：`010-898989898`
祝你生活愉快，再见！
-> END