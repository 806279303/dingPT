// components/output/output.js
import { Base } from '../../utils/base.js'
import bluePrinter from '../../bluetoothprinter/x_connect.js';//小程序蓝牙连接打印机，建议根据实际需求自己重写
import printTest from '../../demo/cpcltest.js';//如果不用cpcl指令，则不需要引用,可以在需要用到的页面再直接引
import printCPCL from '../../demo/cpcl.js';

var app=getApp();  
var TimerCheck;
var curTimes = 0
const maxTimes = 20
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    isOutput: false,
    sellData:{},
    isOutputDetail:false,
    outputDetailInfo:{},
    isOutputChoose:false,
    isHaveHaveOutputClient:app.globalData.outputClient.isHaveHaveOutputClient,
    outputClientId:app.globalData.outputClient.outputClientId,
    isOutputPrint:false,
    outputPrintInfo:{
      eye_distance:"",
      eye_high:"",
      eye_add:"",
      remark:"",
      r_axial:"x",
      l_axial:"x",
      client_shop:'',
      add_commodity:''
    },

    disabled:true,
    loading:true,
    months:['无','01','02','03','04','05','06','07','08','09','10','11','12'],
    selectedYear:'2019',
    selectedMonth:'无',
    startBtnLoading:false,

    tempClientInfo:[],
    rawClientInfo:[],
    isPowerClientInfo:false,
    outBtnGroupShow:{
      globalOutputClient:app.globalData.outputClient.isHaveHaveOutputClient,
      globalOutputCommodity:app.globalData.outputCommodity.isHaveOutputCommodity,
      globalOutputRglasses:app.globalData.outputRglasses.isHaveOutputRglasses,
      globalOutputLglasses:app.globalData.outputLglasses.isHaveOutputLglasses,
      globalOutputAddPro:app.globalData.outputAddPro.isHaveOutputAddPro,
    },
    printName:''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadOutData(filterData,url){
      let that = this
      let data = {}
      if(url){
        data.url = url
      }else{
        data.url = 'Sell/getSell'
      }
      if(filterData){
        data.data = filterData
      }
      let base = new Base()
      base.request(data, function (res) {
        let sellData = res.data.sell_data
        console.log(sellData)
        //时间戳=>时间格式
        Object.keys(sellData.data).forEach(key => {
          sellData.data[key].new_time = that.format(sellData.data[key].new_time*1000)
        })
        that.setData({
          sellData
        })
      })
    },
    showOutput() {
      this.setData({
        isOutput: true
      })
    },
    hideOutput() {
      this.setData({
        isOutput: false
      })
    },
    //控制筛选种类隐藏
    showSelectType() {
      let self = this
      self.setData({
        isSelectType: !self.data.isSelectType,
        isSelectName: false
      })
    },
    //控制名称种类隐藏
    showNameType() {
      let self = this
      self.setData({
        isSelectType: false,
        isSelectName: !self.data.isSelectName
      })
    },
    add0(m){ 
      return m < 10 ? '0' + m : m 
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + '/' + this.add0(m) + '/' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    },
    chooseOutput(e){
      const tradeid = e.target.dataset.tradeid
      let that = this
      let base = new Base()
      wx.showLoading({
        title:"加载中"
      })
      base.request({
        url:'Sell/get_detail_sell',
        data:{
          trade_id:tradeid
        }
      },function(res){
        console.log(res)
        let outputDetailInfo = res.data.good_data
        if(!outputDetailInfo.new_time){
          wx.showToast({
            title:'查询失败',
            icon:'error',
            duration:1500
          })
          wx.hideLoading()
          return
        }
        outputDetailInfo.new_time = that.format(outputDetailInfo.new_time*1000)
        outputDetailInfo.add_commodity = outputDetailInfo.add_commodity?outputDetailInfo.add_commodity:''
        that.setData({
          isOutputDetail:true,
          outputDetailInfo
        })
        wx.hideLoading()
      })
    },
    closeOutputDetail(){
      this.setData({
        isOutputPrint:false,
        isOutputDetail:false
      })
    },
    resetOutput(){
      this.triggerEvent('resetOutput')  
      wx.showToast({
        title:'重置成功',
        icon:'success',
        duration:1300
      })
    },
    outputBigBtn(){
      this.setData({
        isOutputChoose:true
      })
    },
    chooseOutputClient(){
      // app.globalData.outputClient.isOutputClient = true
      // this.triggerEvent('sendToOutputClient')  
      let base = new Base()
      let that = this 
      base.request({
        url:"Client/get_client"
      },function(res){
        let tempClientInfo = res.data.client_data.data
        that.setData({
          tempClientInfo,
          rawClientInfo:tempClientInfo,
          isPowerClientInfo:true
        })
      })
    },
    chooseOutputCommodity(){
      if(app.globalData.outputClient.isHaveHaveOutputClient){
        app.globalData.outputCommodity.isOutputCommodity = true
        this.triggerEvent('sendToOutputCommodity')  
      }else{
        wx.showToast({
          title: '请先选择客户',
          icon:'none',
          duration: 1500
        })
      }
    },
    chooseOutputAddpro(){//附加
      if(app.globalData.outputClient.isHaveHaveOutputClient){
        app.globalData.outputAddPro.isOutputAddPro = true
        this.triggerEvent('sendToOutputCommodity')  
      }else{
        wx.showToast({
          title: '请先选择客户',
          icon:'none',
          duration: 1500
        })
      }
    },
    chooseOutputRglasses(){
      if(app.globalData.outputCommodity.isHaveOutputCommodity){
        console.log(app.globalData)
        app.globalData.outputRglasses.isOutputRglasses = true
        this.triggerEvent('sendToOutputRglasses')  
      }else{
        wx.showToast({
          title: '请先选择货物',
          icon:'none',
          duration: 1500
        })
      }
    },
    chooseOutputLglasses(){
      if(app.globalData.outputCommodity.isHaveOutputCommodity){
        app.globalData.outputLglasses.isOutputLglasses = true
        this.triggerEvent('sendToOutputLglasses')  
      }else{
        wx.showToast({
          title: '请先选择货物',
          icon:'none',
          duration: 1500
        })
      }
    },
    chooseOutputNext(){
      console.log(app.globalData)
      let that = this
      const client_id = app.globalData.outputClient.outputClientId
      const commodity_id = app.globalData.outputCommodity.outputCommodityId
      const r_good_id = app.globalData.outputRglasses.outputRglassesId
      const l_good_id = app.globalData.outputLglasses.outputLglassesId
      const add_commodity_id = app.globalData.outputAddPro.outputAddCommodityId == ''?0: app.globalData.outputAddPro.outputAddCommodityId
      if(client_id!==''&&commodity_id!==''&&r_good_id!==''&&l_good_id!==''){
        let that = this
        let base = new Base()
        base.request({
          url:'Sell/get_detail_good_for_sell',
          data:{
            r_good_id,
            l_good_id,
            commodity_id,
            client_id,
            add_commodity_id
          }
        },function(res){
          console.log(res)
          let outputPrintInfo = res.data
          var time = new Date();
          var y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          var h = time.getHours();
          var mm = time.getMinutes();
          var s = time.getSeconds();
          const new_time = y + '/' + that.add0(m) + '/' + that.add0(d) + ' ' + that.add0(h) + ':' + that.add0(mm) + ':' + that.add0(s)
          outputPrintInfo.new_time = new_time
          outputPrintInfo.r_axial = 'x'
          outputPrintInfo.l_axial = 'x'
          outputPrintInfo.add_commodity = outputPrintInfo.add_commodity?outputPrintInfo.add_commodity:''
          outputPrintInfo.eye_distance=""
          outputPrintInfo.eye_high=""
          outputPrintInfo.eye_add=""
          outputPrintInfo.remark=""
          outputPrintInfo.client_credit=app.globalData.outputClient.outputClientCredit
          that.setData({
            isOutputPrint:true,
            outputPrintInfo
          })
          const printName = wx.getStorageSync('printerName') 
          if(printName){
            console.log('已保存打印机名字，准备赋值')
            console.log(printName)
            that.setData({
              printName
            })
          }
        })
        that.setData({
          isOutputPrince:true
        })
      }else{
        wx.showToast({
          title: '不能漏选',
          icon: 'none',
          duration: 1000
        })
      }
    },
    recordPrintRaxial(e){
      const r_axial = e.detail.value
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.r_axial = r_axial

    },
    recordPrintLaxial(e){
      const l_axial = e.detail.value
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.l_axial = l_axial

    },
    recordPrintEyeDistance(e){
      const eye_distance = e.detail.value
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.eye_distance = eye_distance
    },
    recordPrintEyeHign(e){
      const eye_high = e.detail.value
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.eye_high = eye_high
    },
    recordPrintRemark(e){
      let remark = e.detail.value
      remark = remark.replace(/，/g, ",")
      remark = remark.replace(/。/g, ".")
      remark = remark.replace(/？/g, "?")
      remark = remark.replace(/！/g, "!")
      remark = remark.replace(/：/g, ":")
      remark = remark.replace(/“/g, "\"")
      remark = remark.replace(/”/g, "\"")
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.remark = remark

    },
    recordPrintOther(e){
      const other = e.detail.value
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.add_project = other

    },
    recordPrintEyeAdd(e){
      const eye_add = e.detail.value
      let outputPrintInfo = this.data.outputPrintInfo
      outputPrintInfo.eye_add = eye_add

    },
    subPrint(){
      let outputPrintInfo = this.data.outputPrintInfo
      const client_id = app.globalData.outputClient.outputClientId
      const commodity_id = app.globalData.outputCommodity.outputCommodityId
      const r_good_id = app.globalData.outputRglasses.outputRglassesId
      const l_good_id = app.globalData.outputLglasses.outputLglassesId
      const add_commodity_id = app.globalData.outputAddPro.outputAddCommodityId == ''?0:app.globalData.outputAddPro.outputAddCommodityId
      outputPrintInfo.client_id = client_id
      outputPrintInfo.commodity_id = commodity_id
      outputPrintInfo.r_good_id = r_good_id
      outputPrintInfo.l_good_id = l_good_id
      outputPrintInfo.add_commodity_id = add_commodity_id
      outputPrintInfo.client_credit=app.globalData.outputClient.outputClientCredit
      this.setData({
        outputPrintInfo
      })
      let that = this 
      console.log(outputPrintInfo)
      let base = new Base()
      base.request({
        url:'Sell/new_sell',
        data:outputPrintInfo,
        type:'POST'
      },function(res){
        if(res.data.status == 1){
          // that.setData({
          //   startBtnLoading:false
          // })
          wx.setStorageSync('printerName', that.data.printName)
          setTimeout(function(){
            outputPrintInfo.order_id = res.data.order_id
            that.setData({
              outputPrintInfo
            })
            console.log('order_id')
            console.log(res.data.order_id)
            console.log(that.data.outputPrintInfo)
            that.resetOutput()
            that.loadOutData()
            that.triggerEvent('resetFinaceData')
            that.bindPrintText()
          },1300)
        }else{
          wx.showModal({
            title:'失败提示',
            cocntent:"出单失败,请重试!",
            confirmText: "确定",
            success:function(res){
            }
          })
        }
        console.log(res)
      })
    },
    inputPrintName(e){
      this.setData({
        printName:e.detail.value
      })
    },
    //打印机对接
    testPrint() {
      console.log(this.data.outputPrintInfo)
      this.subPrint()
      if(this.data.printName == ''){
        wx.showModal({
          title:'提示',
          content:"请输入打印机名字(Name)!",
          confirmText: "确定",
          success:function(res){
          }
        })
        return
      }else{
        this.timer(this)
      }
    },
    bindPrintText: function () {
      let that = this
      const outputPrintInfo = this.data.outputPrintInfo
      wx.showLoading({
        title:"打印中"
      })
      console.log(outputPrintInfo)
      printTest.Test(outputPrintInfo);
      printTest.Test(outputPrintInfo);
      wx.hideLoading()
      // this.closePrint()
      setTimeout(()=>{
        // this.loadOutData()
        wx.showToast({
          title:'出单成功',
          icon:'success',
          duration:1500
        })
        clearTimeout(TimerCheck)
        that.setData({
          isOutputPrint:false,
          isOutputChoose:false,
          isOutputDetail:false,
          disabled: true,
          loading: true,
          printName:''
        })
      },1300)
      //printCPCL.PrintText(this.data.text);
    },
    closePrint(){
      // bluePrinter.ClosePirint()
      clearTimeout(TimerCheck)
      wx.hideLoading()
      this.setData({
        disabled: true,
        loading: true,
        printName:''
      });
    },
    timer(that) {
      var self = this
      try {
        if (bluePrinter.GetCanPrint()) {//打印机是否就绪
          console.log('00000')
          that.setData({
            disabled: false,
            loading: false,
          });
          wx.showLoading({
            title:"打印机已连接"
          })
          wx.hideLoading()
          clearTimeout(TimerCheck)
          curTimes=0
        }
        else {
          if(self.data.printName == ''){
            //空的还查啥查
          }else{
            console.log(1111)
            wx.showLoading({
              title:"打印机连接中"
            })
            console.log(2222)

            console.log('输入的打印机名字是：'+self.data.printName)
            bluePrinter.OpenPrint(self.data.printName);//若没在app开始时启动连接打印机，可以在此启动,若已经启动了连接，则会忽略
            console.log(333)
            that.setData({
              disabled: true,
              loading: true,
            });
          }
        }
      }
      catch (err) { }
      if(curTimes >= maxTimes){
        clearTimeout(TimerCheck)
        wx.hideLoading()
        curTimes = 0
        return
      }
      TimerCheck = setTimeout(function () {
        curTimes++;
        self.timer(that);
      }, 3000);
    },
    filterOutputData(e){
      const search_client_shop = e.detail.value
      if(search_client_shop==''){
        this.loadOutData()
      }else{
        let filterData = {
          search_client_shop
        }
        this.loadOutData(filterData,'Sell/search_sell')
      }
    },
    selectCurrentYear(val){
      const year = val.target.dataset.year
      let month = this.data.selectedMonth
      if(month == '不选')month='0'
      const data = {
        select_mouth:month,
        select_year:year
      }
      this.loadOutData(data,'Sell/get_select_sell')
      this.setData({
        selectedYear:year
      })
    },
    selectCurrentMonth(val){
      let month = val.target.dataset.month
      if(month == '无')month='0'
      const year = this.data.selectedYear
      const data = {
        select_mouth:month,
        select_year:year
      }
      this.loadOutData(data,'Sell/get_select_sell')
      this.setData({
        selectedMonth:val.target.dataset.month
      })
    },
    closeOutputChoose(){
      this.setData({
        isOutputChoose:false
      })
      app.globalData.outputClient={
        isOutputClient:false,
        isHaveHaveOutputClient:false,
        outputClientId:'',
      }
      app.globalData.outputCommodity={
        isOutputCommodity:false,
        isHaveOutputCommodity:false,
        outputCommodityId:'',
      }
      app.globalData.outputRglasses={
        isOutputRglasses:false,
        isHaveOutputRglasses:false,
        outputRglassesId:'',
      }
      app.globalData.outputLglasses={
        isOutputLglasses:false,
        isHaveOutputLglasses:false,
        outputLglassesId:'',
      }
    },
    findPowerClient(e){
      var self = this
      var base = new Base()
      let data = {}
      if(e.detail.value == ''){
        data.url = 'Client/get_client'
      }else{
        data.url = 'Client/search_client'
        data.data = {
          search_name:e.detail.value
        }

      }
      base.request(data, function (res) {
        let tempClientInfo = res.data.client_data.data
        self.setData({
          tempClientInfo
        })
      })
    },
    closePowerClientInfo(){
      this.setData({
        isPowerClientInfo:false
      })
    },
    chooseClient(e){
      const clientInfo = e.target.dataset.clientid
      var that = this
      if(clientInfo.client_credit - clientInfo.owe_money  <=0){
        wx.showModal({
          title: '提示',
          content: '此客户负债已超出信用额度'+(clientInfo.owe_money - clientInfo.client_credit)+'元,是否继续选择？',
          success(res){
            if(res.confirm){
              app.globalData.outputClient.outputClientId = clientInfo.client_id
              app.globalData.outputClient.outputClientCredit = clientInfo.client_credit
              app.globalData.outputClient.isHaveHaveOutputClient = true
              app.globalData.outputClient.isOutputClient = false
              app.globalData.outputCommodity={
                isOutputCommodity:false,
                isHaveOutputCommodity:false,
                outputCommodityId:'',
              }
              app.globalData.outputRglasses={
                isOutputRglasses:false,
                isHaveOutputRglasses:false,
                outputRglassesId:'',
              }
              app.globalData.outputLglasses={
                isOutputLglasses:false,
                isHaveOutputLglasses:false,
                outputLglassesId:'',
              }
              that.setData({
                isPowerClientInfo:false,
              })
              that.reloadOutputStatus()
            }else if(res.cancel){
              
            }
          }
        })
      }else{
        app.globalData.outputClient.outputClientId = clientInfo.client_id
        app.globalData.outputClient.outputClientCredit = clientInfo.client_credit
        app.globalData.outputClient.isHaveHaveOutputClient = true
        app.globalData.outputClient.isOutputClient = false
        app.globalData.outputCommodity={
          isOutputCommodity:false,
          isHaveOutputCommodity:false,
          outputCommodityId:'',
        }
        app.globalData.outputRglasses={
          isOutputRglasses:false,
          isHaveOutputRglasses:false,
          outputRglassesId:'',
        }
        app.globalData.outputLglasses={
          isOutputLglasses:false,
          isHaveOutputLglasses:false,
          outputLglassesId:'',
        }
        that.setData({
          isPowerClientInfo:false,
        })
        that.reloadOutputStatus()
      }
      
    },
    reloadOutputStatus(){
      let outBtnGroupShow = {
        globalOutputClient:app.globalData.outputClient.isHaveHaveOutputClient,
        globalOutputCommodity:app.globalData.outputCommodity.isHaveOutputCommodity,
        globalOutputRglasses:app.globalData.outputRglasses.isHaveOutputRglasses,
        globalOutputLglasses:app.globalData.outputLglasses.isHaveOutputLglasses,
        globalOutputAddPro:app.globalData.outputAddPro.isHaveOutputAddPro,
      }
      this.setData({
        outBtnGroupShow
      })
    }
  },
  created() {
    this.loadOutData()
  },
  ready(){
    let date = new Date()
    const currentYear = date.getFullYear()
    var years = []
    for(var i=2016;i<=currentYear;i++){
      years.push(i.toString())
    }
    this.data.years = years
    this.setData({
      years
    })
  }
})
