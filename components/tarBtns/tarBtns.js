// components/tarBtns/tarBtns.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    Commodity:{
      type:String,
      value:'商品模板'
    },
    Clients:{
      type:String,
      value:"用户管理"
    },
    Output:{
      type:String,
      value:"出单"
    },
    FinancialTb: {
      type: String,
      value: "财务报表"
    },
    Modify: {
      type: String,
      value: "修改密码"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showCommodity(){
      console.log("open commodity")
    },
    showClients() {
      console.log("open clients")
    },
    _showCommodity(){
      this.triggerEvent("showCommodity")
    },
    _showClients() {
      this.triggerEvent("showClients")
    },
    _showOutput() {
      this.triggerEvent("showOutput")
    },
    _showFinancialTb() {
      this.triggerEvent("showFinancialTb")
    },
    _showModify() {
      this.triggerEvent("showModify")
    }
  }
})
