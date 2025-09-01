# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Prerequisites

```shell
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
1) Proceed with standard installation (default - just press enter)
2) Customize installation
3) Cancel installation

# select 1)
```

```shell
error: could not amend shell profile: '~/.profile': could not write rcfile file: '~/.profile': Permission denied (os error 13)
```

```shell
To get started you need Cargo's bin directory ($HOME/.cargo/bin) in your PATH
environment variable. This has not been done automatically.

To configure your current shell, you need to source
the corresponding env file under $HOME/.cargo.

This is usually done by running one of the following (note the leading DOT):
. "$HOME/.cargo/env"            # For sh/bash/zsh/ash/dash/pdksh
source "$HOME/.cargo/env.fish"  # For fish
source $"($nu.home-path)/.cargo/env.nu"  # For nushell
```


## TODO 
remove page width limit
use antd build-in style as much as possible
use antd layout rather than custom-style <div>
$1.7 ---
support dark mode
remark form item should occupy a whole row
$4.4 ---
https://item.jd.com/100226972106.html#switch-sku
https://item.jd.com/100226972106.html#none
https://item.m.jd.com/product/100226972106.html?utm_term=CopyURL_shareid7c06ddc1680e7a8cf3e5adc289703cf1a014cca817550055567937_shangxiang_none&gx=RnAomzgFNWGaypkWq4x3WgwnjrEpqpM&utm_source=iosapp&utm_campaign=t_335139774&utm_medium=appshare&ad_od=share&gxd=RnAoxDRZbmCNmJkTp4QiWs2Z8UcV2CDqPCIvp4XMyzrn2tMUZeGv9ZVQhRayQlU&jkl=@D5nFc8riJPSY@
https://item.jd.com/100226972106.html
$0.25 ---
discountinput use addonAfter or addonBefore rather than text, like 折扣 case
$0.25 ---
wrap discount input
$0.42 ---
parse get product information of the URL
$0.85 --- but do nothing
extract formatter
$0.6 ---
space.compact size
$0.1 --- can't do
remove button style
$0.2 ---
save data
$5.6 ---
draw a line chart
$0.6 ---
mock data
$1.4 ---
line chart search
table column
mock data
$7.4 ---
column controller
$0.9 ---
format and copy
$2.1 ---
clean code
$0.9 ---
discount parser
$45.32 ---
date position
$0.6 ---
csv export
$0.5 ---
garbled
1.4 ---
excel import


https://detail.tmall.com/item.htm?id=838057640110&skuId=5596547280623
券后
¥
229
优惠前
¥
269
已售 700+

距结束
48:46:55
25号0点满700减70
3期免息
每满1件减40

https://detail.tmall.com/item.htm?id=807978649708&skuId=5660286183077
券后
¥
53.03
优惠前
¥
74.8
已售 3000+

¥3店铺新客礼金限享一次 即时可用
店铺新客立减3元
淘金币已抵3.74元
满1件7.99折

https://detail.tmall.com/item.htm?id=716995980346&skuId=5176703494380
秒杀价
¥
9.81
优惠前
¥
13.8
·
已售 5万+
直降3.99元

https://detail.tmall.com/item.htm?id=589970566955
券后
¥
16.8
起
超级立减活动价
¥
20.8
起
已售 40万+

全场立减
满800减65
超级立减4元
满3件9.5折

https://item.taobao.com/item.htm?id=673424401238&skuId=5018923614824
券后
¥
189.46
优惠前
¥
318
·
已售 8
官方立减12%省39元
淘金币已抵9.54元
同店每68减20


https://item.jd.com/13642583.html
¥1107.8
到手价
购买立减
¥20.00
=
¥1127.8
京东价
-
优惠券¥20

https://item.jd.com/100116554433.html
¥25.2
到手价
购买立减
¥2.80
=
¥28
京东价
-
优惠券¥2.8
满1享9折减2.8


¥
225
已售 1000+

https://item.jd.com/100067100922.html
¥144
到手价
购买立减
¥5.00
=
¥149
京东价
-
优惠券¥5
满10减5

¥189
到手价
购买立减
¥10.00
=
¥199
京东价
-
促销¥10
首购礼金 10元

¥125.1
政府补贴价
购买立减
¥13.90
=
¥139
京东价
-
补贴¥13.9
政府补贴京东支付减¥13.9

¥129
到手价
购买立减
¥20.00
=
¥149
京东价
-
促销¥20
每满149减20

¥10.9
到手价
购买立减
¥1.00
=
¥11.9
京东价
-
促销¥1
首购礼金 1元

¥9.8
到手价
购买立减
¥1.00
=
¥10.8
京东价
-
促销¥1
首购礼金 1元

¥27.9
到手价
购买立减
¥2.00
=
¥29.9
京东价
-
促销¥2
首购礼金 2元

¥189
到手价
购买立减
¥10.00
=
¥199
京东价
-
优惠券¥10
神券满70减10

¥42.8
到手价
购买立减
¥2.00
=
¥44.8
京东价
-
促销¥2
满40减2

https://item.jd.com/3478323.html
￥20.06
优惠券

立即使用
8.8折
满88享8.8折
2025.08.29 23:59前有效
促销
满额返券
实付满1元，收货后返满10-5元券，先到先得，点击跳转活动落地页（仅app可跳转）

限购
特价品，购买至少1件时可享受单件价￥20.06，超出数量或优惠库存以结算价为准
跨自营/店铺满折
满2件，总价打9折

优惠

促销
满额返券
实付满1元，收货后返满10-5元券，先到先得，点击跳转活动落地页（仅app可跳转）

跨自营/店铺满折
满2件，总价打9折

更多优惠
返京豆
京东购物返京豆，订单完成后最高可返5京豆。特殊渠道订单不参与购物返豆，以订单实际返豆为准

https://item.jd.com/10021934281578.html
¥449
到手价
购买立减
¥600.00
=
¥1049
京东价
-
促销¥550
满999减550
-
优惠券¥50
满900减50