
/*********设计到微信代码块 *********************************/
module.exports = {
  xcx_EnableBlue: xcx_EnableBlue,
  xcx_OpenBluetoothAdapter: xcx_OpenBluetoothAdapter,
  xcx_closeBluetoothAdapter: xcx_closeBluetoothAdapter,
  xcx_getBluetoothAdapterState: xcx_getBluetoothAdapterState,
  xcx_onBluetoothAdapterStateChange: xcx_onBluetoothAdapterStateChange,
  xcx_startBluetoothDevicesDiscovery: xcx_startBluetoothDevicesDiscovery,
  xcx_stopBluetoothDevicesDiscovery: xcx_stopBluetoothDevicesDiscovery,
  xcx_getBluetoothDevices: xcx_getBluetoothDevices,
  xcx_onBluetoothDeviceFound: xcx_onBluetoothDeviceFound,
  xcx_getConnectedBluetoothDevices: xcx_getConnectedBluetoothDevices,
  xcx_createBLEConnection: xcx_createBLEConnection,
  xcx_onBLECharacteristicValueChange: xcx_onBLECharacteristicValueChange,
  xcx_closeBLEConnection: xcx_closeBLEConnection,
  xcx_onBLEConnectionStateChanged: xcx_onBLEConnectionStateChanged,
  xcx_getBLEDeviceServices: xcx_getBLEDeviceServices,
  xcx_getBLEDeviceCharacteristics: xcx_getBLEDeviceCharacteristics,
  xcx_readBLECharacteristicValue: xcx_readBLECharacteristicValue,
  xcx_notifyBLECharacteristicValueChange: xcx_notifyBLECharacteristicValueChange,
  xcx_writeBLECharacteristicValue: xcx_writeBLECharacteristicValue,
  xcx_setStorage: xcx_setStorage,
  xcx_printFail: xcx_printFail,
  xcx_printOk: xcx_printOk,
  xcx_platform: xcx_platform
}

function xcx_EnableBlue() {
  return wx.openBluetoothAdapter;
}

function xcx_OpenBluetoothAdapter(openBluetoothAdapterSuccess, openBluetoothAdapterFail) {
  wx.openBluetoothAdapter({
    success: function (res) {
      openBluetoothAdapterSuccess(res);
    },
    fail: function (res) {
      openBluetoothAdapterFail(res);
    },
    complete: function (res) {
      console.log('--openBluetoothAdapter---complete---');
    }
  })
}

function xcx_closeBluetoothAdapter(closeBluetoothAdapterSuccess,closeBluetoothAdapterFail) {
  wx.closeBluetoothAdapter({
    success: function (res) {
      closeBluetoothAdapterSuccess(res);
    },
    fail: function (res) {
      closeBluetoothAdapterFail(res);
    },
    complete: function (res) {
      console.log('--openBluetoothAdapter---complete---');
    }
  })
}

function xcx_getBluetoothAdapterState(getBluetoothAdapterStateSuccess, getBluetoothAdapterStateFail) {
  wx.getBluetoothAdapterState({
    success: function (res) {
      getBluetoothAdapterStateSuccess(res, res.discovering, res.available);
    },
    fail: function (res) {
      getBluetoothAdapterStateFail(res);
    },
    complete: function (res) { }
  })
}

function xcx_onBluetoothAdapterStateChange(onBluetoothAdapterStateChangeResult) {
  wx.onBluetoothAdapterStateChange(function (res) {
    console.log(`adapterState changed, now is:` + res);
    onBluetoothAdapterStateChangeResult(res.available, res.discovering);
  })
}

function xcx_startBluetoothDevicesDiscovery(startBluetoothDevicesDiscoverySuccess,startBluetoothDevicesDiscoveryFail) {
  wx.startBluetoothDevicesDiscovery({
    success: function (res) {
      startBluetoothDevicesDiscoverySuccess(res);
    },
    fail: function (res) {
      startBluetoothDevicesDiscoveryFail(res);
    },
    complete: function (res) { }
  })
}
// 停止搜寻附近的蓝牙外围设备  

function xcx_stopBluetoothDevicesDiscovery() {
  console.log('停止搜索周边设备');
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
      console.log(res)
    }
  })
}

function xcx_getBluetoothDevices(getBluetoothDevicesSuccess, getBluetoothDevicesFail, getBluetoothDevicesComplete) {
  wx.getBluetoothDevices({
    success: function (res) {
      console.log(res);
      for (var p in res.devices) { //遍历json数组时，这么写p为索引，0,1
        if (getBluetoothDevicesSuccess(res.devices[p].name, res.devices[p].deviceId)) {
          console.log('这是伯威想要找的东西：!!!!!:'+res.devices[p].name)
          break;
        }
      }
    },
    fail: function (res) {
      getBluetoothDevicesFail(res);
    },
    complete: function (res) {
      getBluetoothDevicesComplete();
      console.log('获取所有已发现的蓝牙设备complete:' + res); //   
    }
  })
}

function xcx_onBluetoothDeviceFound(onBluetoothDeviceFoundResult) {
  wx.onBluetoothDeviceFound(function (res) {
    // callback  
    // curLog = '发现新设备';
    //console.log(curLog,res);  
    try {
      if (onBluetoothDeviceFoundResult(res, res.deviceId, res.name, res.RSSI)) {
        return;
      }
    } catch (err) { }
    try {
      for (var p in res.devices) { //遍历json数组时，这么写p为索引，0,1
        if (onBluetoothDeviceFoundResult(res, res.devices[p].deviceId, res.devices[p].name, res.devices[p].RSSI)) {
          return;
        }
      }
    } catch (err) { }
  })
}

//根据 uuid 获取处于已连接状态的设备  
function xcx_getConnectedBluetoothDevices() {
  //curLog ='获取处于已连接状态的设备';
  console.log(curLog);
  wx.getConnectedBluetoothDevices({
    //services:[],
    success: function (res) {
      console.log('获取处于已连接状态的设备:' + res);
    },
    fail: function (res) {
      console.log('获取处于已连接状态的设备失败:' + res);
    },
    complete: function (res) {
      console.log('获取处于已连接状态的设备complete:' + res); //   
    }
  })
}

function xcx_createBLEConnection(_deviceId, createBLEConnectionSuccess, createBLEConnectionFail) {
  wx.createBLEConnection({
    deviceId: _deviceId,
    success: function (res) {
      createBLEConnectionSuccess(res, res.errMsg, _deviceId);
    },
    fail: function (res) {
      createBLEConnectionFail(res);
    },
    complete: function (res) {
      console.log('连接低功耗蓝牙设备complete:' + res); //   
    }
  })
}

function xcx_onBLECharacteristicValueChange() {
  wx.onBLECharacteristicValueChange(function (res) {
    console.log('监听低功耗蓝牙设备的特征值变化:' + res);
  });
}

function xcx_closeBLEConnection(_deviceId, closeBLEConnectionSccess, closeBLEConnectionFail) {
  console.log('开始关闭蓝牙连接');
  wx.closeBLEConnection({
    deviceId: _deviceId,
    success: function (res) {
      closeBLEConnectionSccess(res);
    },
    fail: function (res) {
      closeBLEConnectionFail(res);
    },
    complete: function (res) {
      console.log('连接低功耗蓝牙设备complete:' + res); //   
    }
  })
}

//监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等  
function xcx_onBLEConnectionStateChanged(onBLEConnectionStateChangedResult) {
  console.log('注册监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等');
  wx.onBLEConnectionStateChanged(function (res) {
    onBLEConnectionStateChangedResult(res, res.deviceId, res.connected);
  })
}

function xcx_getBLEDeviceServices(_deviceId, getBLEDeviceServicesSuccess, getBLEDeviceServicesFail) {
  wx.getBLEDeviceServices({
    deviceId: _deviceId,
    success: function (res) {
      console.log('getBLEDeviceServices  success');
      for (var p in res.services) { //遍历json数组时，这么写p为索引，0,1
        {
          if (getBLEDeviceServicesSuccess(_deviceId, res.services[p].uuid)) {
            return;
          }
        }
      }
      // curLog = '此设备不支持打印服务';
      // curRes = 1; //返回失败
    },
    fail: function (res) {
      getBLEDeviceServicesFail();
    },
    complete: function (res) {
      console.log('getBLEDeviceServices  complete'); //   
    }
  })
}

function xcx_getBLEDeviceCharacteristics(_deviceId, _serviceId, getBLEDeviceCharacteristicsSuccess, getBLEDeviceCharacteristicsFail) {
  wx.getBLEDeviceCharacteristics({
    deviceId: _deviceId,
    serviceId: _serviceId,
    success: function (res) {
      for (var p in res.characteristics) {
        getBLEDeviceCharacteristicsSuccess(res.characteristics[p].uuid);
      }
    },
    fail: function (res) {
      getBLEDeviceCharacteristicsFail(res);
    },
    complete: function (res) {
      console.log('getBLEDeviceCharacteristics  complete'); //   
    }
  })
}

function xcx_readBLECharacteristicValue(_deviceId, _serviceId, _characteristicId) {
  wx.readBLECharacteristicValue({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: _deviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: _serviceId,
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: _characteristicId,
    success: function (res) {
      console.log('readBLECharacteristicValue:' + res)
    },
    fail: function (res) {
      console.log('readBLECharacteristicValue  fail' + res);
    },
    complete: function (res) {
      console.log('readBLECharacteristicValue  complete'); //   
    }
  })
}

function xcx_notifyBLECharacteristicValueChange(_deviceId, _serviceId, _characteristicId) {
  wx.notifyBLECharacteristicValueChange({
    state: true,
    // 启用 notify 功能
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: _deviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: _serviceId,
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: _characteristicId,
    success: function (res) {
      console.log('notifyBLECharacteristicValueChange success:' + res.errMsg);
      //xcx_onBLECharacteristicValueChange();
      // var bf = new Uint8Array([10, 13, 10, 13, 10, 13]);
      // writeBLECharacteristicValue(_deviceId, _serviceId, printerUuidWrite, bf,test(),test());
    },
    fail: function (res) {
      console.log('notifyBLECharacteristicValueChange  fail:' + res);
    },
    complete: function (res) {
      console.log('notifyBLECharacteristicValueChange  complete'); //   
    }
  })
}

function xcx_writeBLECharacteristicValue(_deviceId, _serviceId, _characteristicId, _buffervalue, _success, _fail, writeBLECharacteristicValueSuccess, writeBLECharacteristicValueFail) {
  wx.writeBLECharacteristicValue({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: _deviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: _serviceId,
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: _characteristicId,
    // 这里的value是ArrayBuffer类型
    value: _buffervalue,
    success: function (res) {
      writeBLECharacteristicValueSuccess(_success);
    },
    fail: function (res) {
      console.log('writeBLECharacteristicValue  fail:' + res);
      writeBLECharacteristicValueFail(_fail);
    },
    complete: function (res) {
      console.log('writeBLECharacteristicValue  complete'); //   
    }
  })
}

function xcx_setStorage(key, value) {
  wx.setStorage({
    key: key,
    data: value
  })
}

function xcx_printFail() {
  wx.showToast({
    title: "打印失败",
    duration: 5000
  })
}

function xcx_printOk() {
  wx.showToast({
    title: "打印成功",
    duration: 5000
  })
}
function xcx_platform() {
  try {
    var res = wx.getSystemInfoSync();
    return res.platform;
  } catch (e) {
    return 'windows';
  }
}
/*****************微信代码块结束 */

