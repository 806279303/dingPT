import util from '../bluetoothprinter/util.js';
import queues from '../bluetoothprinter/queues.js';
module.exports = {
  Test: Test,
  PrintCaiCaiNongYe: PrintCaiCaiNongYe,
  printorder: printorder
}
var xmax=560;
var ymax=380;
var xprint = 558;
var yprint = 370;
function printorder(company, sendtype, address, contact,datetime,name, qrcode, orders) {
  var text = "";
  text = text + "! 200 200 200 220 1\r\n";
  text = text + "PAGE-WIDTH 560\r\n";
  text = text + "TEXT 8 0 150 0 " + company + "\r\n";
  //text = text + "TEXT 10 0 120 30 " + sendtype + "\r\n";
  text = text + "B QR 150 30 M 1 U 7\r\n";
  text = text + "HA, QR " + qrcode + "\r\n";
  text = text + "ENDQR\r\n";

  text = text + "TEXT 4 0 350 100 " + orders + "\r\n";


  text = text + "FORM\r\n";
  text = text + "PRINT";
  WritePushLine(text);
 // if (app.globalData.ifdebug) console.log("二维码内容：\r\n" + qrcode);
 // if (app.globalData.ifdebug) console.log("条码打印内容：\r\n" + text);
}

function printorder1(address, name, mobile, qrcode, orderdata1, orderdata2, orderdata3, phone1, phone2) {
  var text = "";
  text = text + "! 0 200 200 400 1\r\n";
  text = text + "PAGE-WIDTH 560\r\n";
  text = text + "TEXT 10 0 10 80 " + address + "\r\n";
  text = text + "TEXT 10 0 10 110 " + name + " " + mobile + "\r\n";
  text = text + "B QR 10 150 M 1 U 7\r\n";
  text = text + "HA, QR " + qrcode + "\r\n";
  text = text + "ENDQR\r\n";
  text = text + "TEXT 12 0 230 140 " + orderdata1 + "\r\n";
  text = text + "TEXT 12 0 230 170 " + orderdata2 + "\r\n";
  text = text + "TEXT 12 0 230 200 " + orderdata3 + "\r\n";
  //text = text + "TEXT 12 0 230 300 咨询电话: " + phone1 + "\r\n";
  text = text + "TEXT 12 0 230 330 监督电话: " + phone1 + "\r\n";
  text = text + "FORM\r\n";
  text = text + "PRINT";
  WritePushLine(text);
  // if (app.globalData.ifdebug) console.log("二维码内容：\r\n" + qrcode);
  // if (app.globalData.ifdebug) console.log("条码打印内容：\r\n" + text);
}
function Test(data)
{
  console.log(data)
  WritePushLine("! 0 200 200 400 1");
  WritePushLine("PAGE-WIDTH 600");
  WritePushLine("LINE 0 25 560 25 4");
  WritePushLine("LINE 0 70 560 70 4");
  WritePushLine("LINE 0 198 560 198 4");
  WritePushLine("LINE 0 243 560 243 2");
  WritePushLine("LINE 0 288 560 288 2");
  WritePushLine("LINE 0 333 560 333 2");
  WritePushLine("LINE 0 378 560 378 2");
  WritePushLine("LEFT");
  // 罗敦司德A系列1.56舒适型DFB(标准通道)渐进防雾膜
  WritePushLine("!U1 SETBOLD 4");
  WritePushLine("TEXT 5 0 160 37 "+data.kind+data.name+data.type);
  WritePushLine("!U1 SETBOLD 0");
  WritePushLine("TEXT 5 0 47 76 位置");
  WritePushLine("TEXT 5 0 178 76 球镜");
  WritePushLine("TEXT 5 0 314 76 散光");
  WritePushLine("TEXT 5 0 439 76 轴位");
  WritePushLine("!U1 SETBOLD 4");
  WritePushLine("TEXT 5 3 58 116 R:");
  WritePushLine("TEXT 5 6 58 160 L:");
  WritePushLine("TEXT 5 3 175 113 "+data.r_sph);
  WritePushLine("TEXT 5 6 175 158 "+data.l_sph);
  WritePushLine("TEXT 5 3 303 113 "+data.r_astigmatism);
  WritePushLine("TEXT 5 6 303 158 "+data.l_astigmatism);
  WritePushLine("TEXT 5 3 440 113 "+data.r_axial);
  WritePushLine("TEXT 5 6 440 158 "+data.l_axial);
  WritePushLine("!U1 SETBOLD 0");
  WritePushLine("TEXT 5 0 4 210 瞳距:");
  WritePushLine("!U1 SETBOLD 4");
  WritePushLine("TEXT 5 0 70 210 "+data.eye_distance+'mm');
  WritePushLine("!U1 SETBOLD 0");
  WritePushLine("TEXT 5 0 195 210 瞳高:");
  WritePushLine("!U1 SETBOLD 4");
  WritePushLine("TEXT 5 0 265 210 "+data.eye_high+'mm');
  WritePushLine("!U1 SETBOLD 0");
  WritePushLine("TEXT 5 0 380 210 ADD:");
  WritePushLine("!U1 SETBOLD 4");
  WritePushLine("TEXT 5 0 440 210 "+data.eye_add);
  WritePushLine("!U1 SETBOLD 0");
  WritePushLine("TEXT 5 0 5 250 备注:");
  WritePushLine("!U1 SETBOLD 4");
  WritePushLine("TEXT 5 0 80 250 "+data.remark);
  WritePushLine("TEXT 5 0 450 250 "+data.order_id);
  WritePushLine("!U1 SETBOLD 0");
  WritePushLine("TEXT 5 0 5 298 附加项目:");
  WritePushLine("TEXT 5 0 120 298 "+data.add_commodity);
  WritePushLine("TEXT 5 0 5 341 客户名称:");
  WritePushLine("TEXT 5 0 120 342 "+data.client_shop);
  WritePushLine("TEXT 5 0 320 342 "+data.new_time);
  WritePushLine("FORM");
  WritePushLine("PRINT");
}
function Test3()
{
  WritePushLine("! 0 200 200 1600 1\r\nPAGE-WIDTH 560\r\nLINE 0 80 558 80 1\r\nLINE 0 248 558 248 1\r\nLINE 0 328 558 328 1\r\nLINE 0 392 558 392 1\r\nLINE 0 512 558 512 1\r\nLINE 0 622 558 622 1\r\nLINE 56 392 56 773 1\r\nLINE 280 328 280 392 1\r\nLINE 280 622 280 773 1\r\nLINE 0 915 558 915 1\r\nLINE 0 981 558 981 1\r\nLINE 0 1081 558 1081 1\r\nLINE 0 1117 558 1117 1\r\nLINE 210 1081 210 1182 1\r\nLINE 330 1081 330 1182 1\r\nLINE 450 1081 450 1182 1\r\nLINE 280 915 280 1081 1\r\nLINE 0 1280 558 1280 1\r\nLINE 0 1400 558 1400 1\r\nLINE 0 1436 558 1436 1\r\nLINE 0 1512 558 1512 1\r\nLINE 90 1400 90 1512 1\r\nLINE 210 1400 210 1512 1\r\nLINE 330 1400 330 1512 1\r\nLINE 450 1400 450 1512 1\r\nLINE 280 1184 280 1400 1\r\nLINE 280 1512 280 1612 1\r\nBARCODE 128 3 1 96 85 96 534834630036\r\nSETMAG 2 2\r\nTEXT 24 0 100 194 534 834 630 036\r\nSETMAG 1 1\r\nSETBOLD 1\r\nTEXT 4 3 84 264 广州 01-09 010\r\nSETBOLD 0\r\nSETMAG 1 1\r\nTEXT 4 0 76 348 厦门集美\r\nSETMAG 1 1\r\nTEXT 4 0 300 348 2017-07-19\r\nSETMAG 1 1\r\nTEXT 24 0 16 411 收\r\nTEXT 24 0 16 441 件\r\nSETMAG 1 1\r\nSETBOLD 1\r\nTEXT 24 0 60 397 通君辉\r\nSETBOLD 0\r\nSETMAG 1 1\r\nSETBOLD 1\r\nTEXT 24 0 280 397 18198919999\r\nSETBOLD 0\r\nSETMAG 1 1\r\nSETBOLD 1\r\nTEXT 24 0 60 429 广东省广州市白云区石井镇凰岗大街一巷12号\r\nSETBOLD 0\r\nSETMAG 1 1\r\nTEXT 24 0 16 523 寄\r\nTEXT 24 0 16 553 件\r\nSETMAG 1 1\r\nTEXT 3 1 60 517 赵勉\r\nSETMAG 1 1\r\nTEXT 3 1 280 517 15021238430\r\nSETMAG 1 1\r\nTEXT 3 1 60 544 福建厦门市集美区侨英路681号厦门集美中通\r\nSETMAG 1 1\r\nTEXT 24 0 16 653 服\r\nTEXT 24 0 16 683 务\r\nSETMAG 1 1\r\nTEXT 55 0 60 630 内容品名：\r\nSETMAG 1 1\r\nTEXT 55 0 60 683 计费重量：1.00(kg)\r\nSETMAG 1 1\r\nTEXT 55 0 60 711 声明价值：\r\nSETMAG 1 1\r\nTEXT 55 0 60 739 代收金额：￥0.00\r\nSETMAG 1 1\r\nTEXT 24 0 290 631 签收人/签收时间\r\nSETMAG 1 1\r\nTEXT 4 0 464 741 已验视\r\nBARCODE 128 1 1 30 28 925 534834630036\r\nSETMAG 1 1\r\nTEXT 24 0 40 959 534 834 630 036\r\nSETMAG 1 1\r\nTEXT 24 0 288 923 订单号：\r\nSETMAG 1 1\r\nTEXT 55 0 0 985 收件方信息：\r\nSETMAG 1 1\r\nTEXT 55 0 0 1005 通君辉 18198919999\r\nSETMAG 1 1\r\nTEXT 55 0 0 1028 广东省广州市白云区石井镇凰岗大街一\r\nTEXT 55 0 0 1050 巷12号\r\nSETMAG 1 1\r\nTEXT 55 0 288 985 寄件方信息：\r\nSETMAG 1 1\r\nTEXT 55 0 288 1005 赵勉 15021238430\r\nSETMAG 1 1\r\nTEXT 55 0 288 1028 福建厦门市集美区侨英路681号厦门集\r\nTEXT 55 0 288 1050 美中通\r\nSETMAG 1 1\r\nTEXT 55 0 73 1091 内容品名\r\nSETMAG 1 1\r\nTEXT 55 0 218 1091 计费重量（kg）\r\nSETMAG 1 1\r\nTEXT 55 0 254 1127 1.00\r\nSETMAG 1 1\r\nTEXT 55 0 338 1091 声明价值（￥）\r\nSETMAG 1 1\r\nTEXT 55 0 458 1091 代收金额（￥）\r\nSETMAG 1 1\r\nTEXT 55 0 494 1127 0.00\r\nBARCODE 128 1 1 56 24 1192 534834630036\r\nSETMAG 1 1\r\nTEXT 24 0 40 1252 534 834 630 036\r\nSETMAG 1 1\r\nTEXT 55 0 0 1288 收件方信息：\r\nSETMAG 1 1\r\nTEXT 55 0 0 1312 通君辉 18198919999\r\nSETMAG 1 1\r\nTEXT 55 0 0 1339 广东省广州市白云区石井镇凰岗大街一\r\nTEXT 55 0 0 1361 巷12号\r\nSETMAG 1 1\r\nTEXT 55 0 288 1288 寄件方信息：\r\nSETMAG 1 1\r\nTEXT 55 0 288 1312 赵勉 15021238430\r\nSETMAG 1 1\r\nTEXT 55 0 288 1339 福建厦门市集美区侨英路681号厦门集\r\nTEXT 55 0 288 1361 美中通\r\nSETMAG 1 1\r\nTEXT 55 0 13 1410 内容品名\r\nSETMAG 1 1\r\nTEXT 55 0 98 1410 计费重量（kg）\r\nSETMAG 1 1\r\nTEXT 55 0 134 1446 1.00\r\nSETMAG 1 1\r\nTEXT 55 0 218 1410 声明价值（￥）\r\nSETMAG 1 1\r\nTEXT 55 0 338 1410 代收金额（￥）\r\nSETMAG 1 1\r\nTEXT 55 0 374 1446 0.00\r\nSETMAG 1 1\r\nTEXT 55 0 458 1410 现付运费（￥）\r\nSETMAG 1 1\r\nTEXT 55 0 501 1446 0\r\nSETMAG 1 1\r\nTEXT 55 0 0 1520 打印时间\r\nSETMAG 1 1\r\nTEXT 55 0 0 1548 2017-08-15 10:26\r\nSETMAG 1 1\r\nTEXT 55 0 288 1520 快递员签名/签名时间\r\nSETMAG 1 1\r\nTEXT 55 0 440 1548 月    日\r\nPRINT\r\n");
}
function Test2() {
  WritePushLine("! 0 200 200 400 1");
  WritePushLine("PAGE-WIDTH 560");
  WritePushLine("LINE 0 0 558 0 1");

  WritePushLine("TEXT 6 0 280 20 [#店铺名称]");
  WritePushLine("TEXT 4 0 430 20 标准快递");
  WritePushLine("LINE 0 72 558 72 1");

  WritePushLine("SETMAG 2 2");
  WritePushLine("TEXT 4 0 140 96 [#大头笔#]");
  WritePushLine("SETMAG 0 0");
  WritePushLine("LINE 0 192 558 192 1");

  WritePushLine("SETMAG 1 1");
  WritePushLine("TEXT 4 0 20 208 [#集包#]");
  WritePushLine("SETMAG 0 0");
  WritePushLine("BARCODE 128 1 1 32 340 200 438687902852");
  WritePushLine("TEXT 6 0 350 240 [#集包码#]");
  WritePushLine("LINE 0 272 558 272 1");

  WritePushLine("TEXT 6 0 10 300 收");
  WritePushLine("TEXT 6 0 10 330 件");
  WritePushLine("LINE 35 272 35 370 1");
  WritePushLine("TEXT 6 0 37 280 [#收件人姓名#]");
  WritePushLine("LINE 420 272 420 370 1");
  WritePushLine("LINE 0 370 558 370 1");

  WritePushLine("LINE 0 0 0 370 1");
  WritePushLine("LINE 558 0 558 370 1");

  WritePushLine("LINE 0 " + ymax + " " + xmax + " " + ymax + " 1");
  WritePushLine("FORM");
  WritePushLine("PRINT");
}
function Test1() {
  WritePushLine("! 0 200 200 400 1");
  WritePushLine("PAGE-WIDTH 560");
  WritePushLine("TEXT 4 0 265 40 1/2");
  WritePushLine("TEXT 6 0 65 80 打印次数");
  WritePushLine("TEXT 4 0 400 80 Unite已实名");
  WritePushLine("BARCODE 128 2 1 80 80 110 438687902852");

  WritePushLine("TEXT 6 0 120 210 母单号 438 687 902 852");
  WritePushLine("TEXT 4 0 50 210 1/1");
   WritePushLine("SETMAG 3 3") 
   WritePushLine("TEXT 4 0 410 112 T");
   WritePushLine("SETMAG 6 6") 
   WritePushLine("TEXT 4 0 440 118 8");
   WritePushLine("SETMAG 0 0")
  WritePushLine("LINE 410 107 540 110 1");
  WritePushLine("LINE 410 107 410 266 1");
  WritePushLine("LINE 540 110 540 266 1");
  WritePushLine("LINE 410 266 540 266 1");

  WritePushLine("LINE 0 266 540 266 1");
  WritePushLine("LINE 0 266 0 370 1");
  WritePushLine("LINE 540 266 540 370 1");
  WritePushLine("LINE 0 370 540 370 1");

  //WritePushLine("LINE 0 0 " + xprint+" 0 1");
  //WritePushLine("LINE 0 0 0 " + yprint+" 1");
 // WritePushLine("LINE 0 " + yprint + " " + xprint + " " + yprint+" 1");
 // WritePushLine("LINE " + xprint + " 0 " + xprint + " " + yprint+" 1");
 WritePushLine("LINE 0 "+ymax+" "+xmax+" "+ymax+" 1");
  WritePushLine("FORM");
  WritePushLine("PRINT");
}
function PrintCaiCaiNongYe() {
  WritePushLine("! 0 200 200 400 1");
  WritePushLine("PAGE-WIDTH 600");
  WritePushLine("TEXT 10 0 10 80 中海国际社区/芙蓉兴盛提货点");
  WritePushLine("TEXT 10 0 10 110 张先生 138****9999");
  WritePushLine("B QR 10 150 M 1 U 8");//通过创建条码时所用的相同数据来标记条码
  WritePushLine("HA,QR http://www.baidu.com");
  WritePushLine("ENDQR");
  WritePushLine("TEXT 12 0 230 140 白菜:2份 胡萝卜:9份");
  WritePushLine("TEXT 12 0 230 170 辣椒:2份 长豆角:2份");
  WritePushLine("TEXT 12 0 230 200 土鸡蛋:2份 长豆角:2份");
  WritePushLine("TEXT 12 0 230 300 农户电话:13874269361");
  WritePushLine("TEXT 12 0 230 330 农户电话:13874269361");
  WritePushLine("FORM");
  WritePushLine("PRINT");
}
function WritePushLine(value) {
  value += "\r\n";
 //  var buf = char2buf(value);
   var buf = util.Hex2Arry(util.encodeToGb2312(value));
  queues.QueuesPushBuf(buf);
}
function char2buf(str) {
  var out = new ArrayBuffer(str.length * 2);
  var u8a = new Uint8Array(out);
  var strs = str.split("");
  for (var i = 0; i < strs.length; i++) {
    u8a[i] = strs[i].charCodeAt();
  }
  return u8a;
}