VAR SCORE = 0
VAR TG_NEW_POST = true

抑郁自评量表（SDS）
(from: https:\/\/zhuanlan.zhihu.com/p/89890455)

量表介绍：
抑郁自评量表(Self—Rating Depression Scale，SDS)由Zung编制于1965年。为美国教育卫生福利部推荐的用于精神药理学研究的量表之一，因使用简便，应用颇广
请您仔细阅读以下每一条的说明，把意思弄明白，然后对照自己最近一周来的感受，从四个选项中选择最符合您实际情况的一项。

注：
①“很少”表示出现类似情况的频率少于1天或没有出现；
②“有时”表示至少2-3天会出现类似情况；
③“经常”表示至少4-5天会出现类似情况；
④“持续”表示几乎每天都会出现类似情况。

+ [开始测试]
    -> start
=== start ===
-
1、我觉得闷闷不乐，情绪低沉
~ TG_NEW_POST = false
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
2、我觉得一天之中早晨最好
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
3、老是莫名地哭出来或觉得想哭
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
4、我晚上睡眠不好
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
5、我吃饭像平时一样多
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
6、我与异性密切接触时和以往一样感到愉快
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
7、我感觉自己的体重在下降
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
8、我有便秘的烦恼
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
9、我觉得心跳比平时快了
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
10、我无缘无故感到疲乏
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
11、我的头脑跟平时一样清楚
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
12、我做事情像平时一样不感到有什么困难
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
13、我坐卧不安, 难以保持平静
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
14、我对未来感到有希望
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
15、我比平时容易生气激动
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
16、我觉得做出决定是容易的事
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
17、我觉得自己是有用的人，别人需要我
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
18、我的生活过得很有意义
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
19、我认为如果我死了别人会生活得更好
+ [①很少]
    ~ SCORE = SCORE + 1
+ [②有时]
    ~ SCORE = SCORE + 2
+ [③经常]
    ~ SCORE = SCORE + 3
+ [④持续]
    ~ SCORE = SCORE + 4
-
20、对于平常感兴趣的事我仍旧感兴趣
+ [①很少]
    ~ SCORE = SCORE + 4
+ [②有时]
    ~ SCORE = SCORE + 3
+ [③经常]
    ~ SCORE = SCORE + 2
+ [④持续]
    ~ SCORE = SCORE + 1
-
-> result

=== result ===
您的粗分：{SCORE}
~ SCORE = SCORE * 1.25
您的标准分：{SCORE}

分界值为53分，
53-62为轻度抑郁，
63-72为中度抑郁，
72分以上为重度抑郁。

注：量表总分值仅作为参考而非绝对标准，应根据临床症状来划分；对严重阻滞症状的抑郁病人，评定有困难。

-> END