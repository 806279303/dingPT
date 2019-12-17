var Queues = new Array();//等待写入蓝牙的执行队列
var Platform;//客户端平台，安卓android，苹果ios
module.exports = {
  QueuesPushBuf: QueuesPushBuf,
  QueuesLength: QueuesLength,
  QueuesShift: QueuesShift,
  QueuesClear: QueuesClear,
  Platform: Platform
}
function QueuesLength() {
  return Queues.length;
}
function PushBuf(buf)
{
  Queues.push(buf);
}
function QueuesPushBuf(buf) {
  if (Platform != "ios") {//安卓系统每次只发送20字节内
  var maxlen = 20;
  var count = Math.ceil(buf.length, maxlen); //Math.ceil(writeBf.length / maxlen);
  console.log("count:" + count);
  for (var i = 0; i < count; i++) {
    var _lenStart = i * maxlen;
    var _lenEnd = _lenStart + maxlen;
    if (_lenStart >= buf.length) {
      break;
    }
    if (_lenEnd > buf.length) {
      _lenEnd = buf.length;
    }
    var tempBf = buf.slice(_lenStart, _lenEnd);
    console.log("tempBf:" + tempBf);
    PushBuf(tempBf);
  }
  }
  else {//苹果系统不限制
    PushBuf(buf);
  }
}
function QueuesShift() {
  return Queues.shift();
}
function QueuesClear() {
  Queues.splice(0, Queues.length);//清空队列 
}