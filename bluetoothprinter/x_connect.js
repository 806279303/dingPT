var ZFI_Ib1;
var khpeOsu2 = 0;
var cV_3 = 0;
var w4 = 100;
var KG_5 = 0;
import queues from '\x2e\x2f\x71\x75\x65\x75\x65\x73\x2e\x6a\x73';
import config from '\x2e\x2f\x63\x6f\x6e\x66\x69\x67\x2e\x6a\x73';
import apiWx from '\x2e\x2f\x61\x70\x69\x57\x78\x2e\x6a\x73';
import util from '\x2e\x2f\x75\x74\x69\x6c\x2e\x6a\x73';
var hDit6 = '';
var HOq7 = '';
var XmtC8 = '';
var eS9 = '';
var JU10 = '';
var T11 = false;
var laTGaJEuM12 = false;
var n_Wsd13 = false;
var beGs14 = false;
var oCss15 = 0;
var XeT16 = -2;
var ivk_17 = '';
var fdXpIWfLu18;
var QVG$ju$k19;
var definedPrintName;//自定义的需匹配的打印机名字
module["\x65\x78\x70\x6f\x72\x74\x73"] = {
  GetCurLog: GetCurLog,
  GetResLast: GetResLast,
  OpenPrint: OpenPrint,
  ClosePirint: ClosePirint,
  GetAvailable: GetAvailable,
  GetConnected: GetConnected,
  GetCanPrint: GetCanPrint,
};

function OpenPrint(printName) {
  if (XeT16 == -2) {
    XeT16 == -1;
    ivk_17 = '\u5f00\u59cb\u521d\u59cb\u5316\u6253\u5370';
    definedPrintName = printName
    StartInterval()
  }
}

function ClosePirint() {
  XeT16 == -2;
  StopInterval();
  queues["\x51\x75\x65\x75\x65\x73\x43\x6c\x65\x61\x72"]();
  CloseBluetooth()
}

function GetCanPrint() {
  if (XeT16 == 0) return true;
  else return false
}

function GetAvailable() {
  return laTGaJEuM12
}

function GetConnected() {
  return n_Wsd13
}

function GetCurLog() {
  return ivk_17
}

function GetResLast() {
  return oCss15
}

function StartInterval() {
  try {
    ZFI_Ib1 = setTimeout(WriteQueue, w4)
  } catch (err) {
    console["\x6c\x6f\x67"]("\x53\x74\x61\x72\x74\x49\x6e\x74\x65\x72\x76\x61\x6c \x65\x72\x72\x3a" + err)
  }
}

function StopInterval() {
  try {
    clearInterval(ZFI_Ib1)
  } catch (err) {
    console["\x6c\x6f\x67"]("\x53\x74\x6f\x70\x49\x6e\x74\x65\x72\x76\x61\x6c \x65\x72\x72\x3a" + err)
  }
}

function WriteQueue() {
  try {
    if (!queues["\x50\x6c\x61\x74\x66\x6f\x72\x6d"]) {
      queues["\x50\x6c\x61\x74\x66\x6f\x72\x6d"] = apiWx["\x78\x63\x78\x5f\x70\x6c\x61\x74\x66\x6f\x72\x6d"]()
    }
    if (!laTGaJEuM12 || XeT16 == 1) {
      CloseBluetooth();
      laTGaJEuM12 = false;
      n_Wsd13 = false;
      XeT16 = -1;
      beGs14 = false;
      console["\x6c\x6f\x67"]("\x21\x61\x76\x61\x69\x6c\x61\x62\x6c\x65");
      khpeOsu2++;
      if (khpeOsu2 > 3) {
        w4 = 1000
      } else {
        w4 = 300
      }
      startOpenBluetooth()
    } else if (beGs14 && !n_Wsd13) {
      console["\x6c\x6f\x67"]("\x21\x63\x6f\x6e\x6e\x65\x63\x74\x65\x64\x3a");
      khpeOsu2 = 0;
      cV_3++;
      if (cV_3 > 3) {
        w4 = 1000
      } else {
        w4 = 300
      }
      console["\x6c\x6f\x67"]("\x70\x72\x69\x6e\x74\x65\x72\x44\x65\x76\x69\x63\x65\x49\x64\x3a" + HOq7);
      if (HOq7) {
        createBLEConnection(HOq7)
      } else {
        getBluetoothDevices()
      }
    } else if (laTGaJEuM12 && n_Wsd13) {
      cV_3 = 0;
      if (queues["\x51\x75\x65\x75\x65\x73\x4c\x65\x6e\x67\x74\x68"]() > 0) {
        WriteOneQueue()
      } else {
        w4 = 500
      }
    }
  } catch (err) {
    console["\x6c\x6f\x67"]("\x57\x72\x69\x74\x65\x51\x75\x65\x75\x65 \x65\x72\x72\x3a" + err)
  }
  ZFI_Ib1 = setTimeout(WriteQueue, w4)
}

function WriteOneQueue() {
  if (laTGaJEuM12 && n_Wsd13) {
    cV_3 = 0;
    if (queues["\x51\x75\x65\x75\x65\x73\x4c\x65\x6e\x67\x74\x68"]() > 0) {
      w4 = 10;
      console["\x6c\x6f\x67"]("\x57\x72\x69\x74\x65\x51\x75\x65\x75\x65");
      var JkHuIc20 = queues["\x51\x75\x65\x75\x65\x73\x53\x68\x69\x66\x74"]();
      while (queues["\x50\x6c\x61\x74\x66\x6f\x72\x6d"] == "\x69\x6f\x73" && queues["\x51\x75\x65\x75\x65\x73\x4c\x65\x6e\x67\x74\x68"]() > 0) {
        JkHuIc20 = util["\x41\x72\x72\x79\x32\x41\x72\x72\x79"](JkHuIc20, queues["\x51\x75\x65\x75\x65\x73\x53\x68\x69\x66\x74"]())
      }
      if (JkHuIc20) {
        write(JkHuIc20);
        console["\x6c\x6f\x67"]("\u5411\u6253\u5370\u673a\u53d1\u9001\u6570\u636e\uff1a" + JkHuIc20)
      }
    }
  }
}

function openBluetoothAdapterSuccess(rYAN21) {
  oCss15 = 1000;
  ivk_17 = '\u521d\u59cb\u5316\u84dd\u7259\u9002\u914d\u5668\u6210\u529f';
  console["\x6c\x6f\x67"]("\u521d\u59cb\u5316\u84dd\u7259\u9002\u914d\u5668\x2d\x2d\x2d\x2d\x2d\x73\x75\x63\x63\x65\x73\x73\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d");
  console["\x6c\x6f\x67"](rYAN21);
  getBluetoothAdapterState()
}

function openBluetoothAdapterFail(CsXAvpeoA22) {
  oCss15 = 1001;
  ivk_17 = '\u8bf7\u5148\u6253\u5f00\u624b\u673a\u84dd\u7259\u5f00\u5173';
  console["\x6c\x6f\x67"]('\x2d\x2d\x6f\x70\x65\x6e\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x41\x64\x61\x70\x74\x65\x72\x2d\x2d\x2d\x66\x61\x69\x6c\x2d\x2d\x2d');
  XeT16 = 1
}

function startOpenBluetooth() {
  if (!apiWx["\x78\x63\x78\x5f\x45\x6e\x61\x62\x6c\x65\x42\x6c\x75\x65"]()) {
    XeT16 = 1;
    ivk_17 = '\u7248\u672c\u8fc7\u4f4e\x2c\u8bf7\u5148\u5347\u7ea7';
    return
  }
  XeT16 = 2;
  if (oCss15 == 1002 || oCss15 == 2002) {
    return
  }
  oCss15 = 1002;
  ivk_17 = '\u5f00\u59cb\u521d\u59cb\u5316\u84dd\u7259\u9002\u914d\u5668';
  console["\x6c\x6f\x67"](ivk_17);
  apiWx["\x78\x63\x78\x5f\x4f\x70\x65\x6e\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x41\x64\x61\x70\x74\x65\x72"](openBluetoothAdapterSuccess, openBluetoothAdapterFail)
}

function CloseBluetooth() {
  try {
    ivk_17 = '\u5f00\u59cb\u65ad\u5f00\u6253\u5370\u673a';
    closeBLEConnection(HOq7);
    CloseBluetoothAdapter()
  } catch (err) { }
}

function closeBluetoothAdapterSuccess(QNn23) {
  oCss15 = 1100;
  ivk_17 = '\u65ad\u5f00\u6253\u5370\u673a\u6210\u529f';
  console["\x6c\x6f\x67"]("\x73\x75\x63\x63\x65\x73\x73\x3a" + QNn23);
  T11 = false;
  laTGaJEuM12 = false;
  n_Wsd13 = false
}

function closeBluetoothAdapterFail(res) { 
  oCss15 = 1101;
  console["\x6c\x6f\x67"](ivk_17)
}

function CloseBluetoothAdapter() {
  if (oCss15 == 1102) {
    return
  }
  oCss15 = 1102;
  console["\x6c\x6f\x67"]("\x53\x74\x61\x72\x74\x5f\x43\x6c\x6f\x73\x65\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x41\x64\x61\x70\x74\x65\x72");
  try {
    apiWx["\x78\x63\x78\x5f\x63\x6c\x6f\x73\x65\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x41\x64\x61\x70\x74\x65\x72"](closeBluetoothAdapterSuccess, closeBluetoothAdapterFail)
  } catch (err) {
    console["\x6c\x6f\x67"]('\x2d\x2d\x63\x6c\x6f\x73\x65\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x2d\x2d\x2d\x65\x72\x72\x2d\x2d\x2d\x3a' + err)
  }
}

function getBluetoothAdapterStateSuccess(ZEOzbAnF24, tp25, Vz_QaJIM26) {
  oCss15 = 2000;
  console["\x6c\x6f\x67"](ZEOzbAnF24);
  console["\x6c\x6f\x67"](ZEOzbAnF24["\x65\x72\x72\x4d\x73\x67"]);
  T11 = tp25;
  laTGaJEuM12 = Vz_QaJIM26;
  console["\x6c\x6f\x67"]('\x64\x69\x73\x63\x6f\x76\x65\x72\x69\x6e\x67\x3a' + T11);
  console["\x6c\x6f\x67"]('\x61\x76\x61\x69\x6c\x61\x62\x6c\x65\x3a' + laTGaJEuM12);
  if (Vz_QaJIM26) {
    onBluetoothAdapterStateChange();
    if (!tp25) {
      startBluetoothDevicesDiscovery()
    }
  } else {
    ivk_17 = '\u84dd\u7259\u672a\u6253\u5f00';
    XeT16 = 1
  }
}

function getBluetoothAdapterStateFail(res) {
  oCss15 = 2001;
  XeT16 = 1
}

function getBluetoothAdapterState() {
  if (oCss15 == 2002) {
    return
  }
  oCss15 = 2002;
  console["\x6c\x6f\x67"](ivk_17);
  apiWx["\x78\x63\x78\x5f\x67\x65\x74\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x41\x64\x61\x70\x74\x65\x72\x53\x74\x61\x74\x65"](getBluetoothAdapterStateSuccess, getBluetoothAdapterStateFail)
}

function onBluetoothAdapterStateChangeResult(tsVWckJ27, wzhmP28) {
  if (!tsVWckJ27) {
    laTGaJEuM12 = tsVWckJ27;
    XeT16 = 1
  }
  T11 = wzhmP28
}

function onBluetoothAdapterStateChange() {
  console["\x6c\x6f\x67"]('\u76d1\u542c\u84dd\u7259\u9002\u914d\u5668\u72b6\u6001\u53d8\u5316\u4e8b\u4ef6');
  try {
    apiWx["\x78\x63\x78\x5f\x6f\x6e\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x41\x64\x61\x70\x74\x65\x72\x53\x74\x61\x74\x65\x43\x68\x61\x6e\x67\x65"](onBluetoothAdapterStateChangeResult)
  } catch (err) {
    console["\x6c\x6f\x67"](`onBluetoothAdapterStateChange--err:` + err)
  }
}

function startBluetoothDevicesDiscoverySuccess(TCHPugYVR29) {
  beGs14 = true;
  oCss15 = 3000;
  console["\x6c\x6f\x67"](TCHPugYVR29)
}

function startBluetoothDevicesDiscoveryFail(ji30) {
  oCss15 = 3001;
  ivk_17 = '\u67e5\u627e\u5468\u8fb9\u8bbe\u5907\u5931\u8d25';
  XeT16 = 1;
  console["\x6c\x6f\x67"](ivk_17)
}

function startBluetoothDevicesDiscovery() {
  if (oCss15 == 3002) {
    return
  }
  oCss15 = 3002;
  ivk_17 = '\u67e5\u627e\u53ef\u8fde\u63a5\u6253\u5370\u673a';
  console["\x6c\x6f\x67"](ivk_17);
  apiWx["\x78\x63\x78\x5f\x73\x74\x61\x72\x74\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x44\x65\x76\x69\x63\x65\x73\x44\x69\x73\x63\x6f\x76\x65\x72\x79"](startBluetoothDevicesDiscoverySuccess, startBluetoothDevicesDiscoveryFail)
}

function getBluetoothDevicesComplete() {
  oCss15 = 9003
}

//打印重点
function getBluetoothDevicesSuccess(_deviceName, FeytFl31) {
  oCss15 = 9000;
  console["\x6c\x6f\x67"]('\u65b0\u8bbe\u5907\x3a' + _deviceName + "\x2c" + FeytFl31);
  // config["\x50\x72\x69\x6e\x74\x65\x72\x4e\x61\x6d\x65"]
  if (_deviceName == definedPrintName) {
    HOq7 = FeytFl31;
    ivk_17 = '\u627e\u5230\u53ef\u8fde\u63a5\u6253\u5370\u673a';
    console["\x6c\x6f\x67"]('\u53d1\u73b0\u65b0\u8bbe\u5907\x3a' + _deviceName);
    apiWx["\x78\x63\x78\x5f\x73\x74\x6f\x70\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x44\x65\x76\x69\x63\x65\x73\x44\x69\x73\x63\x6f\x76\x65\x72\x79"]();
    return true
  }
  return false
}

function getBluetoothDevicesFail(iSA32) {
  console["\x6c\x6f\x67"]('\u83b7\u53d6\u6240\u6709\u5df2\u53d1\u73b0\u7684\u84dd\u7259\u8bbe\u5907\u5931\u8d25\x3a' + iSA32);
  oCss15 = 9001;
  ivk_17 = '\u83b7\u53d6\u6240\u6709\u84dd\u7259\u8bbe\u5907\u5931\u8d25';
  XeT16 = 1
}

function getBluetoothDevices() {
  if (oCss15 == 9002) {
    return
  }
  oCss15 = 9002;
  console["\x6c\x6f\x67"](ivk_17);
  apiWx["\x78\x63\x78\x5f\x67\x65\x74\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x44\x65\x76\x69\x63\x65\x73"](getBluetoothDevicesSuccess, getBluetoothDevicesFail, getBluetoothDevicesComplete)
}

function onBluetoothDeviceFoundResult(ijEOnZKu33, T34, zzIdO35, llpUmnLhP36) {
  try {
    oCss15 = 4000;
    if (zzIdO35 == config["\x50\x72\x69\x6e\x74\x65\x72\x4e\x61\x6d\x65"]) {
      HOq7 = T34;
      apiWx["\x78\x63\x78\x5f\x73\x74\x6f\x70\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x44\x65\x76\x69\x63\x65\x73\x44\x69\x73\x63\x6f\x76\x65\x72\x79"]();
      ivk_17 = '\u627e\u5230\u53ef\u8fde\u63a5\u6253\u5370\u673a';
      console["\x6c\x6f\x67"](ivk_17);
      console["\x6c\x6f\x67"](ijEOnZKu33);
      console["\x6c\x6f\x67"]('\u65b0\u8bbe\u5907', zzIdO35 + "\x2c" + T34 + "\x2c" + llpUmnLhP36);
      return true
    }
  } catch (err) { }
  return false
}

function bluetoothDeviceFound() {
  if (oCss15 == 4002) {
    return
  }
  oCss15 = 4002;
  console["\x6c\x6f\x67"]('\u5f00\u59cb\u6ce8\u518c\u53d1\u73b0\u65b0\u8bbe\u5907\u4e8b\u4ef6');
  apiWx["\x78\x63\x78\x5f\x6f\x6e\x42\x6c\x75\x65\x74\x6f\x6f\x74\x68\x44\x65\x76\x69\x63\x65\x46\x6f\x75\x6e\x64"](onBluetoothDeviceFoundResult)
}

function createBLEConnectionSuccess($TkKt37, kYhBok38, KZp$P39) {
  console["\x6c\x6f\x67"]('\x63\x72\x65\x61\x74\x65\x42\x4c\x45\x43\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e\x3a' + $TkKt37);
  oCss15 = 5000;
  ivk_17 = '\u8fde\u63a5\u6253\u5370\u673a\u6210\u529f';
  n_Wsd13 = true;
  apiWx["\x78\x63\x78\x5f\x6f\x6e\x42\x4c\x45\x43\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e\x53\x74\x61\x74\x65\x43\x68\x61\x6e\x67\x65\x64"](onBLEConnectionStateChangedResult);
  getBLEDeviceServices(KZp$P39)
}

function createBLEConnectionFail(k_KbcQZ40) {
  oCss15 = 5001;
  ivk_17 = '\u8fde\u63a5\u6253\u5370\u673a\u5931\u8d25';
  XeT16 = 1
}

function createBLEConnection(_deviceId) {
  if (oCss15 == 5002) {
    return
  }
  oCss15 = 5002;
  ivk_17 = '\u5f00\u59cb\u8fde\u63a5\u6253\u5370\u673a';
  console["\x6c\x6f\x67"](ivk_17);
  apiWx["\x78\x63\x78\x5f\x63\x72\x65\x61\x74\x65\x42\x4c\x45\x43\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e"](_deviceId, createBLEConnectionSuccess, createBLEConnectionFail)
}

function closeBLEConnectionSccess(bYbdi41) {
  oCss15 = 5100;
  console["\x6c\x6f\x67"]('\u5173\u95ed\u84dd\u7259\u8fde\u63a5\u6210\u529f\x3a' + bYbdi41)
}

function closeBLEConnectionFail(qqksZrySW42) {
  oCss15 = 5101;
  ivk_17 = '\u5173\u95ed\u84dd\u7259\u8fde\u63a5\u5931\u8d25'
}

function closeBLEConnection(_deviceId) {
  if (!_deviceId) {
    return
  }
  if (oCss15 == 5102) {
    return
  }
  oCss15 = 5102;
  try {
    apiWx["\x78\x63\x78\x5f\x63\x6c\x6f\x73\x65\x42\x4c\x45\x43\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e"](_deviceId, closeBLEConnectionSccess, closeBLEConnectionFail)
  } catch (err) { }
}

function onBLEConnectionStateChangedResult(IHwhz43, mjmaimC44, uuXu45) {
  console["\x6c\x6f\x67"](`device state has changed:` + IHwhz43);
  if (mjmaimC44 == HOq7) {
    n_Wsd13 = uuXu45;
    if (!uuXu45) {
      XeT16 = 1
    }
  }
}

function getBLEDeviceServicesSuccess(_deviceId, gLy46) {
  try {
    oCss15 = 6001;
    ivk_17 = '\u83b7\u53d6\u8bbe\u5907\u670d\u52a1\u6210\u529f';
    console["\x6c\x6f\x67"]('\u670d\u52a1\x3a' + gLy46);
    if (gLy46["\x74\x6f\x55\x70\x70\x65\x72\x43\x61\x73\x65"]() == config["\x55\x75\x69\x64\x53\x65\x72\x76\x65\x72"]) {
      XmtC8 = gLy46;
      getBLEDeviceCharacteristics(_deviceId, gLy46);
      return true
    }
  } catch (err) {
    console["\x6c\x6f\x67"]('\x67\x65\x74\x42\x4c\x45\x44\x65\x76\x69\x63\x65\x53\x65\x72\x76\x69\x63\x65\x73\x53\x75\x63\x63\x65\x73\x73\x3a' + err)
  }
  return false
}

function getBLEDeviceServicesFail() {
  oCss15 = 6001;
  ivk_17 = '\u83b7\u53d6\u6253\u5370\u670d\u52a1\u5931\u8d25';
  XeT16 = 1
}

function getBLEDeviceServices(_deviceId) {
  if (oCss15 == 6002) {
    return
  }
  oCss15 = 6002;
  apiWx["\x78\x63\x78\x5f\x67\x65\x74\x42\x4c\x45\x44\x65\x76\x69\x63\x65\x53\x65\x72\x76\x69\x63\x65\x73"](_deviceId, getBLEDeviceServicesSuccess, getBLEDeviceServicesFail)
}

function getBLEDeviceCharacteristicsSuccess(YqbkKo47) {
  oCss15 = 7000;
  ivk_17 = '\u83b7\u53d6\u7279\u5f81\u503c\u6210\u529f';
  console["\x6c\x6f\x67"]('\u7279\u5f81\u7801\x3a' + YqbkKo47);
  if (YqbkKo47["\x74\x6f\x55\x70\x70\x65\x72\x43\x61\x73\x65"]() == config["\x55\x75\x69\x64\x57\x72\x69\x74\x65"]) {
    eS9 = YqbkKo47;
    XeT16 = 0
  }
  if (YqbkKo47["\x74\x6f\x55\x70\x70\x65\x72\x43\x61\x73\x65"]() == config["\x55\x75\x69\x64\x4e\x6f\x74\x69\x66\x79"]) {
    JU10 = YqbkKo47
  }
}

function getBLEDeviceCharacteristicsFail(res) {
  oCss15 = 7001;
  XeT16 = 1;
  console["\x6c\x6f\x67"]('\x67\x65\x74\x42\x4c\x45\x44\x65\x76\x69\x63\x65\x43\x68\x61\x72\x61\x63\x74\x65\x72\x69\x73\x74\x69\x63\x73  \x66\x61\x69\x6c')
}

function getBLEDeviceCharacteristics(urvmXU48, WrmqEJf49) {
  if (oCss15 == 7002) {
    return
  }
  oCss15 = 7002;
  ivk_17 = '\u5f00\u59cb\u83b7\u53d6\u7279\u5f81\u503c';
  console["\x6c\x6f\x67"]('\x5f\x64\x65\x76\x69\x63\x65\x49\x64\x3a' + urvmXU48);
  console["\x6c\x6f\x67"]('\x5f\x73\x65\x72\x76\x69\x63\x65\x49\x64\x3a' + WrmqEJf49);
  apiWx["\x78\x63\x78\x5f\x67\x65\x74\x42\x4c\x45\x44\x65\x76\x69\x63\x65\x43\x68\x61\x72\x61\x63\x74\x65\x72\x69\x73\x74\x69\x63\x73"](urvmXU48, WrmqEJf49, getBLEDeviceCharacteristicsSuccess, getBLEDeviceCharacteristicsFail)
}

function notifyBLECharacteristicValueChange(WkAezGt50, $WDyEt51, fYvGXy52) {
  if (oCss15 == 8002) {
    return
  }
  oCss15 = 8002;
  ivk_17 = '\u5f00\u59cb\u542f\u7528\u4f4e\u529f\u8017\u84dd\u7259\u8bbe\u5907\u7279\u5f81\u503c\u53d8\u5316\u65f6\u7684 \x6e\x6f\x74\x69\x66\x79 \u529f\u80fd';
  apiWx["\x78\x63\x78\x5f\x6e\x6f\x74\x69\x66\x79\x42\x4c\x45\x43\x68\x61\x72\x61\x63\x74\x65\x72\x69\x73\x74\x69\x63\x56\x61\x6c\x75\x65\x43\x68\x61\x6e\x67\x65"](WkAezGt50, $WDyEt51, fYvGXy52)
}

function writeBLECharacteristicValueSuccess(NnPCBhjZ53) {
  try {
    oCss15 = 8100;
    KG_5 = 0;
    console["\x6c\x6f\x67"]('\x77\x72\x69\x74\x65\x42\x4c\x45\x43\x68\x61\x72\x61\x63\x74\x65\x72\x69\x73\x74\x69\x63\x56\x61\x6c\x75\x65 \x73\x75\x63\x63\x65\x73\x73' + res);
    NnPCBhjZ53
  } catch (err) { }
}

function writeBLECharacteristicValueFail(ZeQe54) {
  try {
    oCss15 = 8101;
    KG_5 = 1;
    console["\x6c\x6f\x67"]('\x77\x72\x69\x74\x65\x42\x4c\x45\x43\x68\x61\x72\x61\x63\x74\x65\x72\x69\x73\x74\x69\x63\x56\x61\x6c\x75\x65  \x66\x61\x69\x6c' + res);
    ZeQe54
  } catch (err) { }
}

function writeBLECharacteristicValue(DWk55, FQZbwZF56, PGyGV_fIv57, NAkSGUfqG58, Yo59, HrX$tfoOi60) {
  oCss15 = 8102;
  KG_5 = 2;
  apiWx["\x78\x63\x78\x5f\x77\x72\x69\x74\x65\x42\x4c\x45\x43\x68\x61\x72\x61\x63\x74\x65\x72\x69\x73\x74\x69\x63\x56\x61\x6c\x75\x65"](DWk55, FQZbwZF56, PGyGV_fIv57, NAkSGUfqG58["\x62\x75\x66\x66\x65\x72"], Yo59, HrX$tfoOi60, writeBLECharacteristicValueSuccess, writeBLECharacteristicValueFail)
}

function write(W61) {
  if (!laTGaJEuM12) {
    console["\x6c\x6f\x67"]("\x61\x76\x61\x69\x6c\x61\x62\x6c\x65 \x69\x73 \x66\x61\x6c\x73\x65");
    return "\x61\x76\x61\x69\x6c\x61\x62\x6c\x65 \x69\x73 \x66\x61\x6c\x73\x65"
  }
  if (!HOq7) {
    console["\x6c\x6f\x67"]("\x70\x72\x69\x6e\x74\x65\x72\x44\x65\x76\x69\x63\x65\x49\x64 \x69\x73 \x6e\x75\x6c\x6c");
    return "\x70\x72\x69\x6e\x74\x65\x72\x44\x65\x76\x69\x63\x65\x49\x64 \x69\x73 \x6e\x75\x6c\x6c"
  }
  if (!n_Wsd13) {
    console["\x6c\x6f\x67"]("\x63\x6f\x6e\x6e\x65\x63\x74\x65\x64 \x69\x73 \x66\x61\x6c\x73\x65");
    return "\x63\x6f\x6e\x6e\x65\x63\x74\x65\x64 \x69\x73 \x66\x61\x6c\x73\x65"
  }
  writeBLECharacteristicValue(HOq7, XmtC8, eS9, W61, null, null)
}

function getPrintStorage() {
  try { } catch (e) { }
}

function clearPrinter() {
  hDit6 = '';
  HOq7 = '';
  XmtC8 = '';
  eS9 = '';
  JU10 = ''
}