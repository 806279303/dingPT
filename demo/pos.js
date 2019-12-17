import util from '../bluetoothprinter/util.js';
import queues from '../bluetoothprinter/queues.js';//存储等待发送给打印机的数据队列，可以不引用

module.exports = {
  QueryOnline: QueryOnline,
  // CharSet: CharSet,
  // CodePage: CodePage,
  AlignLeft: AlignLeft,
  QRPaddingLeft: QRPaddingLeft,
  // AlignRight: AlignRight,
  // AlignMiddle: AlignMiddle,
  // CharSpacing: CharSpacing,
  // RowSpacing: RowSpacing,
  // Bold: Bold,
  // Underline: Underline,
  // Hex2Arry: Hex2Arry,
  // LfLines: LfLines,
  // CrLines: CrLines,  
  // PrintJump: PrintJump,
  // PrintJumpLine: PrintJumpLine,
  InitPos: InitPos,
  // FontDouble: FontDouble,
  Print: Print,
  PageEnd: PageEnd,
  AddPrintQueue: AddPrintQueue,//添加到打印队列
  PrintTitle: PrintTitle,//打印标题（居中加粗）
  PrintText: PrintText,//打印普通文字（从左至右，不加粗）
  PrintTextMarginLeft: PrintTextMarginLeft,
  WriteLengthTextLeft: WriteLengthTextLeft,
  WriteLengthTextRight: WriteLengthTextRight,
  WriteLengthTextLeftEnd: WriteLengthTextLeftEnd,
  WriteLengthTextRightEnd: WriteLengthTextRightEnd,
  PrintBigTitle: PrintBigTitle, //打印加粗文字（从左至右）
  PrintNameValue: PrintNameValue,//打印键值文字（左边加粗，右边不加粗）
  PrintMiddleText: PrintMiddleText,//居中打印，不加粗
  PrintMiddleTextBold: PrintMiddleTextBold,//居中打印，加粗
  PrintJumpLines: PrintJumpLines,//跳行
  PrintBarcode: PrintBarcode,//打印条码
  PrintQRcode: PrintQRcode,//打印二维码
}

function WriteLengthTextRight(text, len)
{
  var bufLen = PadText(text, len, false);
  queues.QueuesPushBuf(bufLen);  
  console.log('WriteLengthTextRight', bufLen);
}
function WriteLengthTextLeft(text, len) {
  var bufLen = PadText(text, len, true);
  queues.QueuesPushBuf(bufLen);
  console.log('WriteLengthTextLeft', bufLen);
}
function WriteLengthTextRightEnd(text, len) {
  var bufLen = util.Arry2Arry(PadText(text, len, false), Print());
  queues.QueuesPushBuf(bufLen);
  console.log('WriteLengthTextRight', bufLen);
}
function WriteLengthTextLeftEnd(text, len) {
  var bufLen = util.Arry2Arry(PadText(text, len, true), Print());
  queues.QueuesPushBuf(bufLen);
  console.log('WriteLengthTextLeft', bufLen);
}
function PadText(text, len,isleft)
{
  var bufLen;
  var buf = Hex2Arry(util.encodeToGb2312(text));
  if (buf.length >= len) {
    bufLen = buf.slice(0, len);
  }
  else {
    var buf1 = new Uint8Array(len - buf.length);
    for (var i = 0; i < len - buf.length; i++) {
      buf1[i] = 32;
    }
    if (isleft)
    {
    bufLen = util.Arry2Arry(buf, buf1);
    }
    else
    { bufLen = util.Arry2Arry(buf1, buf);}
  } 
  return bufLen;
}

String.prototype.padLeft =
  Number.prototype.padLeft = function (total, pad) {
    return (Array(total).join(pad || 0) + this).slice(-total);
  }
String.prototype.padRight =
  Number.prototype.padRight = function (total, pad) {
    return (this + Array(total).join(pad || 0)).slice(0, total);
  }
function AddLongBuffer(writeBf){
  var maxlen = 20;
  var count = Math.ceil(writeBf.length / maxlen);
  console.log("count", count);
  for (var i = 0; i < count; i++) {
    var _lenStart = i * maxlen;
    var _lenEnd = _lenStart + maxlen;
    if (_lenStart >= writeBf.length) {
      break;
    }
    if (_lenEnd > writeBf.length) {
      _lenEnd = writeBf.length;
    }
    var tempBf = writeBf.slice(i * maxlen, _lenEnd);
    console.log("tempBf", tempBf);
    queues.QueuesPushBuf(tempBf);
  } 
}

function PrintNameValue(name, value) {
     AddPrintQueue('InitPos');
  AddPrintQueue('Bold');
  AddPrintQueue('WriteText', name);
  AddPrintQueue('UnBold');
  AddPrintQueue('Print', value);
}
function PrintBigTitle(text) {
    AddPrintQueue('InitPos');
  AddPrintQueue('Bold');
  AddPrintQueue('FontDouble');
  AddPrintQueue('AlignMiddle');
  //Underline(2);
  AddPrintQueue('Print', text);
  AddPrintQueue('UnBold');
  AddPrintQueue('UnFontDouble');
  AddPrintQueue('AlignLeft');

}
function PrintTitle(text) {
   AddPrintQueue('InitPos');
  AddPrintQueue('Bold');
  AddPrintQueue('FontHighDouble');
  AddPrintQueue('AlignMiddle');
  //Underline(2);
  AddPrintQueue('Print', text);
  AddPrintQueue('UnBold');
  AddPrintQueue('UnFontHighDouble');
  AddPrintQueue('AlignLeft');
 
}
function PrintMiddleTextBold(text) { 
  AddPrintQueue('InitPos');
  AddPrintQueue('AlignMiddle');
  AddPrintQueue('Bold');
  AddPrintQueue('Print', text);
  AddPrintQueue('AlignLeft');
  AddPrintQueue('UnBold');

}
function PrintJumpLines(n) {
  AddPrintQueue('PrintJumpLine', n);
}
function PrintMiddleText(text) {  
  AddPrintQueue('InitPos');
  AddPrintQueue('AlignMiddle');
  AddPrintQueue('Print', text);
  AddPrintQueue('AlignLeft');
 
}
function PrintText(text) { 
    AddPrintQueue('InitPos');
  AddPrintQueue('Print', text);
  // AddPrintQueue('AlignLeft');
}
function PrintTextMarginLeft(nL,nH,text) {
  AddPrintQueue('InitPos');
  queues.QueuesPushBuf(SetLeftMargin(nL,nH0));
  queues.QueuesPushBuf(Print());
  AddPrintQueue('Print', text); 
}

function AddPrintQueue(key, value) {
  var bf = null;
  switch (key.toLowerCase()) {
    case 'InitPos'.toLowerCase():
      queues.QueuesPushBuf(InitPos());//初始化蓝牙打印POS机
      break;
    case 'Bold'.toLowerCase():
      queues.QueuesPushBuf(Bold(1));////字体加粗
      break;
    case 'UnBold'.toLowerCase():
      queues.QueuesPushBuf(Bold(0));//取消字体加粗
      break;
    case 'FontDouble'.toLowerCase():
      queues.QueuesPushBuf(FontDouble(1, 1));//字体增大
      break;
    case 'FontHighDouble'.toLowerCase():
      queues.QueuesPushBuf(FontDouble(0, 1));//字体高度增大
      break;
    case 'UnFontDouble'.toLowerCase():
      queues.QueuesPushBuf(FontDouble(0, 0));//取消字体增大
      break;
    case 'AlignMiddle'.toLowerCase():
      bf = AlignMiddle();
      console.log("AlignMiddle:", bf);
      queues.QueuesPushBuf(bf);//设置居中
      break;
    case 'AlignLeft'.toLowerCase():
      queues.QueuesPushBuf(AlignLeft());//设置居左
      break;
    case 'AlignRight'.toLowerCase():
      queues.QueuesPushBuf(AlignRight());//设置居右
      break;
    case 'Print'.toLowerCase()://打印
      var hexstr = util.encodeToGb2312(value);
      var _tempbuf = util.Arry2Arry(Hex2Arry(hexstr), Print());
      AddLongBuffer(_tempbuf);
      break;
    case 'PrintJumpLine'.toLowerCase()://打印并走n行
      queues.QueuesPushBuf(PrintJumpLine(value));
      break;
    case 'Underline'.toLowerCase()://下划线0-2
      queues.QueuesPushBuf(Underline(value));
      break;
    case 'WriteText'.toLowerCase()://将打印数据发送到打印机缓存区
      queues.QueuesPushBuf(Hex2Arry(util.encodeToGb2312(value)));
      break;
    case 'Newlines'.toLowerCase()://下划线0-2
      queues.QueuesPushBuf(LfLines(value));
      break;
    case 'CharSet'.toLowerCase()://设置字符集
      queues.QueuesPushBuf(CharSet(0));
      break;
    case 'CodePage'.toLowerCase()://设置代码页
      queues.QueuesPushBuf(CodePage(0));
      break;
    case 'CharSpacing'.toLowerCase()://设置字间距
      queues.QueuesPushBuf(CharSpacing(value));
      break;
    case 'RowSpacing'.toLowerCase()://设置行间距
      queues.QueuesPushBuf(RowSpacing(value));
      break;
    case 'PrintBarcode'.toLowerCase()://打印条码
      PrintBarcode(value);
      break;   
    default:
      break;
  }
}
function PrintQRcode(code)
{
  var QRcode = Hex2Arry(util.encodeToGb2312(code));
  GS_k_pL_pH_cn_fn_n[3] = QRcode.length+3;
  queues.QueuesPushBuf(GS_k_pL_pH_cn_fn_n);
  queues.QueuesPushBuf(QRcode);
}
function PrintBarcode(code)
{
  console.log("PrintBarcode", code);
  var barcode = Hex2Arry(util.encodeToGb2312(code));
  console.log("barcode", barcode);
  console.log("barcode.length", barcode.length);
  GS_H_n[2]=2;
  queues.QueuesPushBuf(GS_H_n);
  GS_k_m_n[3] = barcode.length;
  queues.QueuesPushBuf(GS_k_m_n);
  queues.QueuesPushBuf(barcode);
}
//设置打印字符双倍宽度,n 的低 4 位表示高度是否放大，等于 0 表示不放大,n 的高 4 位表示宽度是否放大，等于 0 表示不放大。
function FontDouble(x,y)
{
  GS_exclamationmark_n[2]=x*16+y;
  return GS_exclamationmark_n.slice(0); 
}
function PrintJumpLine(n)
{
  ESC_d_n[2] = n;
  return ESC_d_n.slice(0);
}
function PrintJump(n)
{
  ESC_J_n[2]=n;
  return ESC_J_n.slice(0);
}
function Print()
{ 
 return LF;
  //return FF;
   //return CR;
}
function PageEnd() {
  queues.QueuesPushBuf(new Uint8Array([18,65]));
}
//下划线，0-2
function Underline(n)
{
  ESC_line_n[2]=n;
  return ESC_line_n.slice(0);
}
//是否加粗,0不加粗，1加粗
function Bold(n)
{
  GS_E_n[2]=n;
  return GS_E_n.slice(0);
}
//是否有纸
function QueryOnline(){
  return Lack_Paper.slice(0);
}
function InitPos()
{
  return ESC_ALT.slice(0);
}
function LfLines(n)
{
  if(n<1)
  {
    return LF.slice(0);
  }
var b = new Uint8Array(n);
for(var i=0;i<n;i++)
{
  b[i]=LF;
}
  return b.slice(0);
}
function CrLines(n) {
  if (n < 1) {
    return CR.slice(0);
  }
  var b = new Uint8Array(n);
  for (var i = 0; i < n; i++) {
    b[i] = CR;
  }
  return b.slice(0);
}
//设置字符集
function CharSet(nCharSet) {
  console.log('CharSetAndCodePage');
  ESC_R_n[2] = 15;// nCharSet;
  return ESC_R_n.slice(0);
}
//设置代码页 
function CodePage( nCodePage)
{
  console.log('CharSetAndCodePage');
  ESC_t_n[2] =255;// nCodePage; 
  return ESC_t_n.slice(0);
}
//设置输出对齐方式 缺省：左对齐 左对齐：n = 0, 48  居中对齐：n = 1, 49 右对齐 ：n = 2, 50
function AlignLeft()
{
  ESC_a_n[2]=0;
  return ESC_a_n.slice(0);
}
//设置输出对齐方式 缺省：左对齐 左对齐：n = 0, 48  居中对齐：n = 1, 49 右对齐 ：n = 2, 50
function QRPaddingLeft() {
  queues.QueuesPushBuf(new Uint8Array([29, 120, 0]));
}
//居右
function AlignRight() {
  ESC_a_n[2] = 2;
  return ESC_a_n.slice(0);
}
//居中
function AlignMiddle() {
  ESC_a_n[2] = 1;  
  return ESC_a_n.slice(0).slice(0); 
}
//字间距
function CharSpacing(n)
{
  ESC_SP_n[2]=n;
  return ESC_SP_n.slice(0)
}
//行间距
function RowSpacing(n)
{
ESC_3_n[2]=n;
return ESC_3_n.slice(0);
}
function SetLeftMargin(nL,nH)
{
  GS_L_nL_nH[2] = nL;
  GS_L_nL_nH[3] = nH;
  return GS_L_nL_nH.slice(0);
}
function Hex2Arry(str)
{
  var sa = str.split("%");
  var b = new Uint8Array(sa.length - 1);
  for (var i = 1; i < sa.length; i++) {
    b[i - 1] = parseInt(sa[i], 16);
  }
  return b;
}

//是否缺纸
var Lack_Paper = new Uint8Array([29, 114, 1]);

var DES_SETKEY = new Uint8Array([31, 31, 0, 8, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
var DES_ENCRYPT = new Uint8Array([31, 31, 1]);
var DES_ENCRYPT2 = new Uint8Array([31, 31, 2]);
var ERROR = new Uint8Array([0]);
//打印机初始化
var ESC_ALT = new Uint8Array([27, 64]);
//打印并走纸 n 点行
var ESC_J_n = new Uint8Array([27, 74,0]);
//打印并走纸 n 行
var ESC_d_n = new Uint8Array([27, 100, 0]);
//
var ESC_L = new Uint8Array([27, 76]);
//
var ESC_CAN = new Uint8Array([24]);
//打印缓冲区的数据并进纸到下一个黑标位置
var FF = new Uint8Array([12]);
//（页模式命令）打印缓冲区的数据并进纸到下一个黑标位置
var ESC_FF = new Uint8Array([27, 12]);
//
var ESC_S = new Uint8Array([27, 83]);
//
var GS_P_x_y = new Uint8Array([29, 80, 0, 0]);
//选择国际字符集 (该指令暂不支持)USA
var ESC_R_n = new Uint8Array([27, 82, 0]);
//选择字符代码页
var ESC_t_n = new Uint8Array([27, 116, 0]);
//打印并换行
var LF = new Uint8Array([10]);
//打印并换行
var CR = new Uint8Array([13]);
//设置行间距为 n 点行
var ESC_3_n = new Uint8Array([27, 51, 0]);
//设置字符间距
var ESC_SP_n = new Uint8Array([27, 32, 0]);
//
var DLE_DC4_n_m_t = new Uint8Array([16, 20, 1, 0, 1]);
//
var GS_V_m = new Uint8Array([29, 86, 0]);
//
var GS_V_m_n = new Uint8Array([29, 86, 66, 0]);
//
var GS_W_nL_nH = new Uint8Array([29, 87, 118, 2]);
//
var ESC_dollors_nL_nH = new Uint8Array([27, 36, 0, 0]);
//设置输出对齐方式 缺省：左对齐 左对齐：n=0,48  居中对齐：n=1,49 右对齐 ：n=2,50
var ESC_a_n = new Uint8Array([27, 97, 0]);
//用于设置打印字符的方式。默认值是 0,位 1：1：字体反白,位 2：1：字体上下倒置,位 3：1：字体加粗,位 4：1：双倍高度,位 5：1：双倍宽度,位 6：1：删除线
//设置打印字符双倍宽度
var GS_exclamationmark_n = new Uint8Array([29, 33, 0]);
//
var ESC_M_n = new Uint8Array([27, 77, 0]);
//设置取消打印字体是否加粗,n 最低位有效,等于 0 时取消字体加粗,非 0 时设置字体加粗
var GS_E_n = new Uint8Array([27, 69, 0]);
//n=0-2,下划线的高度,默认：0
var ESC_line_n = new Uint8Array([27, 45, 0]);
//n=1:设置字符上下倒置,n=0:取消字符上下倒置
var ESC_lbracket_n = new Uint8Array([27, 123, 0]);
//n=1:设置字符反白打印,n=0:取消字符反白打印
var GS_B_n = new Uint8Array([29, 66, 0]);
//
var ESC_V_n = new Uint8Array([27, 86, 0]);
//打印下装点图
var GS_backslash_m = new Uint8Array([29, 47, 0]);
//打印下载到 FLASH  中的位图
var FS_p_n_m = new Uint8Array([28, 112, 1, 0]);

/*************条码打印开始***********************************************************/
//设定条码对应的字符(HRI)打印方式
//n=0不打印HRI,1HRI在条码上方，2HRI在条码下方，3HRI在条码上方和下方
var GS_H_n = new Uint8Array([29, 72, 0]);
//
var GS_f_n = new Uint8Array([29, 102, 0]);
//设置条形码高度
//1<<n<<255默认值:50
var GS_h_n = new Uint8Array([29, 104, -94]);
//设置条形码左边距0->255
var GS_x_n = new Uint8Array([29, 120, -94]);
// 设置条形码宽度,n=2,3,默认2
var GS_w_n = new Uint8Array([29, 119, 3]);
//打印条形码类型UPC-A，长度12
var GS_k_m_n = new Uint8Array([29, 107, 73, 12]);
//
var GS_k_m_v_r_nL_nH = new Uint8Array([29, 107, 97, 0, 2, 0, 0]);

/*************条码打印结束******************************************************/

//
var ESC_W_xL_xH_yL_yH_dxL_dxH_dyL_dyH = new Uint8Array([27, 87, 0, 0, 0, 0, 72, 2, -80, 4]);
//
var ESC_T_n = new Uint8Array([27, 84, 0]);
//
var GS_dollors_nL_nH = new Uint8Array([29, 36, 0, 0]);
//
var GS_backslash_nL_nH = new Uint8Array([29, 92, 0, 0]);
//
var FS_line_n = new Uint8Array([28, 45, 0]);

/*************二维码打印开始******************************************************/

//设置二维码尺寸大小
var GS_leftbracket_k_pL_pH_cn_67_n = new Uint8Array([29, 40, 107, 3, 0, 49, 67, 3]);
//设置二维码尺寸大小
var GS_leftbracket_k_pL_pH_cn_69_n = new Uint8Array([29, 40, 107, 3, 0, 49, 69, 48]);
//设置二维码尺寸大小
var GS_leftbracket_k_pL_pH_cn_80_m__d1dk = new Uint8Array([29, 40, 107, 3, 0, 49, 80, 48]);
//打印二维码
var GS_leftbracket_k_pL_pH_cn_fn_m = new Uint8Array([29, 40, 107, 3, 0, 49, 81, 48]);

var GS_k_pL_pH_cn_fn_n = new Uint8Array([29, 40, 107, 3, 0, 49, 80, 48]);
/*************二维码打印结束******************************************************/

var GS_L_nL_nH = new Uint8Array([29, 76, 0, 0]);
