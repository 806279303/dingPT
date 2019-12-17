//index.js
import { Base } from '../../utils/base.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    const identity = wx.getStorageSync('identity')
    wx.showToast({
      title: 'welcome! ' + identity,
      duration: 1000
    })
    // var base = new Base()
    // const data = { url:'Commodity/get_commodity'}
    // base.request(data,function(res){
    //   console.log(res)
    // })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onReady:function(){
    this.tar = this.selectComponent("#tarBtns")
    this.commodity = this.selectComponent("#commodity")
    this.clients = this.selectComponent("#clients")
    this.output = this.selectComponent("#output")
    this.ftb = this.selectComponent("#financialTb")
    this.modify = this.selectComponent("#modify")
  },
  getUserInfo: function(e) {
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  },
  _showCommodity(){
    this.commodity.showCommodity()
    this.clients.hideClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
  },
  _showClients() {
    this.commodity.hideCommodity()
    this.clients.showClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
  },
  _showOutput() {
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.showOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
  },
  _showFinancialTb() {
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.hideOutput()
    this.ftb.showFinancialTb()
    this.modify.hideModify()
  },
  _showModify() {
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.showModify()
  },
  getToChooseOutputClient(){
    this.commodity.hideCommodity()
    this.clients.showClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
  },
  resetOutput(){
    app.globalData.outputClient={
      isOutputClient:false,
      isHaveHaveOutputClient:false,
      outputClientId:'',
      outputClientCredit:0,
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
    app.globalData.outputAddPro={
      isOutputAddPro:false,
      isHaveOutputAddPro:false,
      outputAddCommodityId:'',
    }
    this.commodity.loadCommodityData()
    this.output.reloadOutputStatus()
  },
  resetFinaceData(){
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
    this.ftb.loadFinancial('2019','0')
  },
  getToOutputClientId(){
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.showOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
  },

  getToChooseOutputCommodity(){
    this.commodity.showCommodity()
    this.clients.hideClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
    this.commodity.showTheCommodity()
    this.commodity.loadCommodityDataOfClient()
  },
  getCommodityId(){
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.showOutput()
    this.output.reloadOutputStatus()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
    this.commodity.loadCommodityDataOfClient()
  },

  getToChooseOutputRglasses(){
    this.commodity.showCommodity()
    this.clients.hideClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
    this.commodity.loadCommodityDetailData(app.globalData.outputCommodity.outputCommodityId)
    this.commodity.loadSphAndAstigmatism()
  },
  getClientRglasses(){
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.showOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
    this.output.reloadOutputStatus()
  },

  getToChooseOutputLglasses(){
    this.commodity.showCommodity()
    this.clients.hideClients()
    this.output.hideOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
    this.commodity.loadCommodityDetailData(app.globalData.outputCommodity.outputCommodityId)
    this.commodity.loadSphAndAstigmatism()
  },
  getClientLglasses(){
    this.commodity.hideCommodity()
    this.clients.hideClients()
    this.output.showOutput()
    this.ftb.hideFinancialTb()
    this.modify.hideModify()
    this.output.reloadOutputStatus()
  }
})
