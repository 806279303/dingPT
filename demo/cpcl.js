import util from '../bluetoothprinter/util.js';
import queues from '../bluetoothprinter/queues.js';
var s_start = "!";//标签文件通常以“!”字符作为开头
var s_space = " ";//空格字符用于分隔命令行中的各个字段
var s_xoffset = "0";//“x”偏置参数
var s_xdensity = "200";//“x”轴分辨率
var s_ydensity = "200";//“y”轴分辨率
var s_lenlabel = "400";//标签长度,50mm*8
var s_numlabel = "1";//标签数量,大值 = 1024
var s_print = "PRINT";//标签结尾
var s_endline = "\r\n";//每一行都必须以回车和换行两种字符结尾
var s_end = "END";//END 命令可以正常终止一项命令，也可在不打印的情况下执行一项命令。 
var s_abort = "ABORT";//ABORT 命令可以在不打印的情况下终止当前的控制会话。 
var s_encoding = "ENCODING";//ENCODING 控制命令可以指定要发送到打印机的数据的编码形式。
var s_encoding_a = "ASCII";//
var s_encoding_u = "UTF-8";
var s_encoding_g = "GB18030";//
var s_form = "FORM";//FORM 命令可以指示打印机在一页打印结束后切换至下一页顶部。 
var s_journa = "JOURNA";//令禁用自动校正功能
var s_units_inches = "IN-INCHES";//度量单位为英寸
var s_units_inches = "IN-CENTIMETERS";//度量单位为厘米
var s_units_inches = "IN-IN-MILLIMETERS";//度量单位为毫米
var s_units_inches = " IN-DOTS";//度量单位为点,系统默认
var s_comment = ";";//注释可以添加在命令会话第一行和“PRINT”命令之间。CONCAT 与 ENDCONCAT 命令之间不可添加注释。

function WritePushLine(value) {
  value+=s_endline;
  var buf = util.Hex2Arry(util.encodeToGb2312(value));
  queues.QueuesPushBuf(buf);
}
//使文本加粗并且稍微加宽
function SETBOLD(value) {
 //SETBOLD 命令会采用一个操作数来设置文本变黑的程度
  // !U1 SETBOLD {value }
  // 其中，{ value } 是介于 0 到 5 之间的偏移量。
  // 备注：{ value } 将采用通过单位命令设置的单位。
  // 默认单位设置以点为单位。 （203 点 = 1 英寸）
  // 如果单位为英寸，则偏移值的范围为 0- 0.0246 英寸。
  // 如果单位为厘米，则偏移值的范围为 0- 0.0625 厘米。
  // 如果单位为毫米，则偏移值的范围为 0- 0.625 毫米。
  // 完成后，请务必发出“!U1 SETBOLD 0”命令以禁用粗体格式。d
  WritePushLine("!U1 SETBOLD "+p);
}


//将常驻字体放大指定的放大倍数。 
function SetMag(width,height) {
  // { command } { w } { h }
  // 其中：
  // { command } ：SETMAG
  // { w } ：字体的宽度放大倍数。有效放大倍数为 1 到 16。
  // { h } ：字体的高度放大倍数。有效放大倍数为 1 到 16。
  // 备注 ：SETMAG 命令在标签打印后仍保持有效。这意味着要打印的下一标签将使用近设置的 SETMAG 值。要取消 SETMAG 值并使打印机可以 使用默认字体大小，请使用 SETMAG 命令，且放大倍数为 0, 0。 
  WritePushLine("SETMAG " + width + " " + height);
}
///标签内存宽度设置
function PageWidth(width) {
  // 打印机假定页面宽度为打印机的完整宽度。打印会话的大高度由页面宽度和可用打印内存决定。如果页面宽度小 于打印机的完整宽度，则用户可以通过指定页面宽度来增加大页面高度。备注：此命令应在打印会话开始时发出
  // { command } { width }
  // 其中：
  // { command } ：从下面选择一项：
  // PAGE - WIDTH（或 PW）：指定页面宽度。
  // { width } ：页面的单位宽度。 
  WritePushLine( "PAGE-WIDTH " + width);
}

function PrintLine(value) {
  // { command } { x0 } { y0 } { x1 } { y1 } { width }
  // 其中：
  // { command } ：   从下面选择一项：
  // LINE（或 L）：打印线条。
  // { x0 } ：左上角的 X 坐标。
  // { y0 } ：左上角的 Y 坐标。
  // { x1 } ：以下项的 X 坐标：
  // - 水平轴的右上角。
  // - 垂直轴的左下角。
  // { y1 } ：以下项的 Y 坐标：
  // - 水平轴的右上角。
  // - 垂直轴的左下角。
  // { width } ：线条的单位宽度
  AddHead();
  WritePushLine( "LINE 0 0 " + value + " 0 1 ");
  //WritePushLine("LINE 0 0 " + value + " " + value + " 2 ");
  WritePushLine( "LINE 0 0 0 " + value + " 3 ");
  AddPrint();
}
function PrintText(value) {
  // { command } { font } { size } { x } { y } { data }
  // 其中：
  // { command } ：从下面选择一项：
  // { command } 效果
  // TEXT（或 T） 横向打印文本。
  // VTEXT（或 VT） 逆时针旋转 90 度，纵向打印文本。
  // TEXT90（或 T90） （同 VTEXT。）
  // TEXT180（或 T180） 逆时针旋转 80 度，反转打印文本。
  // TEXT270（或 T270） 逆时针旋转 270 度，纵向打印文本。
  // { font } ：字体名称 / 编号。
  // { size } ：字体的大小标识。
  // { x } ：横向起始位置。
  // { y } ：纵向起始位置。
  // { data } ：要打印的文本。
  AddHead();
  WritePushLine("CENTER");
  WritePushLine("TEXT 4 0 10 10 " + value);
  WritePushLine("LEFT");
  WritePushLine("TEXT 4 0 10 10 " + value);
  AddPrint();
}
  
function PrintBarcode(value) {
  // { command } { type } { width } { ratio } { height } { x } { y } { data }
  // 其中：
  // { command } ：从下面选择一项：
  // BARCODE（或 B）：横向打印条码。
  // VBARCODE（或 VB） 纵向打印条码。
  // { type } ：从下表中选择：
  // { width } ：窄条的单位宽度。
  // { ratio } ：宽条与窄条的比率
  // { height } ：条码的单位高度。
  // { x } ：横向起始位置。
  // { y } ：纵向起始位置。
  // { data } ：条码数据。

  AddHead();
  WritePushLine("BARCODE-TEXT 7 0 5" );//通过创建条码时所用的相同数据来标记条码
  WritePushLine("BARCODE 128 1 1 50 150 10 " + value );
  WritePushLine( "VBARCODE 128 1 1 50 10 200 " + value);
  WritePushLine( "BARCODE-TEXT OFF");//条码标记结束
  AddPrint();
}
function PrintQRcode(value) {
  // { command } { type } { x } { y } [M n][U n] { data } <ENDQR>
  //   其中：
  // { command } ：从下面选择一项：
  // BARCODE（或 B）：横向打印条码。
  // VBARCODE（或 VB）：纵向打印条码。
  // { type } ：QR
  // { x } ：横向起始位置。
  // { y } ：纵向起始位置。
  // [M n]：QR Code 规范编号。选项是 1 或 2。Model 2 为推荐规范，是 默认值。
  // [U n]：模块的单位宽度 / 单位高度。   范围是 1 至 32。默认值为 6。
  // { data } ：提供生成 QR Code 所需的信息。
  // <ENDQR>：终止 QR Code。
  AddHead();
  WritePushLine("B QR 10 10 M 1 U 10");//通过创建条码时所用的相同数据来标记条码
  WritePushLine("HA,QR "+value);
  WritePushLine("ENDQR");
  AddPrint();
}
function AddPrint() {
  WritePushLine(s_form);
  WritePushLine(s_print);
}
function AddHead() {
  WritePushLine(s_start + s_space + s_xoffset + s_space + s_xdensity + s_space + s_ydensity + s_space + s_lenlabel + s_space + s_numlabel + s_endline);
}
function encoding(name)
{
  if (name=="a")
    return s_encoding + s_space + s_encoding_a + s_endline;
  if (name == "u")
    return s_encoding + s_space + s_encoding_u + s_endline;
  if (name == "g")
    return s_encoding + s_space + s_encoding_g + s_endline;
}

function Inverse() {
  AddHead();
  WritePushLine("LEFT");
  WritePushLine("TEXT 4 0 0 45 SAVE");
  WritePushLine("TEXT 4 0 0 95 MORE");
  WritePushLine("INVERSE-LINE 0 45 145 45 45");
  WritePushLine("INVERSE-LINE 0 95 145 95 45");
  AddPrint();
}

function Text90() {
  AddHead();
  WritePushLine("LEFT");
  WritePushLine("TEXT 4 0 200 100 TEXT");
  WritePushLine("TEXT90 4 0 200 100 T90");
  WritePushLine("TEXT180 4 0 200 100 T180");
  WritePushLine("TEXT270 4 0 200 100 T270");
  AddPrint();
}

module.exports = {
  PrintText: PrintText,
  PrintLine: PrintLine,
  PrintBarcode: PrintBarcode,//打印条码
  PrintQRcode: PrintQRcode,//打印二维码
  WritePushLine: WritePushLine,
  Text90: Text90,
  Inverse: Inverse,
}