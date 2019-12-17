// components/financialTb/financialTb.js
import { Base } from '../../utils/base.js'
import { finance_token } from '../../utils/pageToken.js'
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
    isFinancialTb:false,
    isSelectType:false,//筛选种类
    isSelectName:false,//筛选名称
    goodKindsAndNames:{
      kinds:['近视镜','远视镜'],
      names:['123','321','124s']
    },//获取的库存种类和名字
    financialDetail:false,//报表细节
    financeData:[],
    currentClientID:'',
    financeDetailData:[],
    isShowStockOptions:false,
    pwd:'',
    isShowCheckStock:false,
    isDelete:false,
    isModify:false,
    idAdd:false,
    isFinanceBox:false,
    sendFinanceForm:{},
    sendAddFinanceForm:{},
    months:['全年','01','02','03','04','05','06','07','08','09','10','11','12'],
    days:['整月','01','02','03','04','05','06','07','08','09','10','11','12'],
    selectedYear:'2019',
    selectedMonth:'全年',
    selectedDay:'整月',
    isSelectDayType:false,
    totalClientConsume:0,
    curRemark:'',
    isShowFinance:false,
    isDayFinance:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadFinancial(year,month,day){
      var self = this
      const token = wx.getStorageSync('token')
      var base = new Base()
      const data = {}
      data.url = 'Finance/get_finance'
      data.type = 'POST'
      data.data = {
        select_year:year,
        select_mouth:month
      }
      if(day && day!='无'){
        data.select_day = day
      }
      base.request(data, function (res) {
        let result = res.data.turnover_data
        let turnover_data = result.data
        let total_consume = res.data.total_consume
        self.setData({
          financeData: turnover_data,
          total_consume
        })
      })
    },
    //控制筛选种类隐藏
    showSelectType(){
      let self = this
      self.setData({
        isSelectType:!self.data.isSelectType,
        isSelectName:false
      })
    },
    showDaySelectType(){
      let self = this
      self.setData({
        isSelectDayType:!self.data.isSelectDayType
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
    //进入细节表格
    showFinancialTb() {
      this.setData({
        isFinancialTb: true
      })
    },
    // 隐藏细节表格
    hideFinancialTb() {
      this.setData({
        isFinancialTb: false
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
      return y + '/' + this.add0(m) + '/' + this.add0(d);
    },
    loadFinancialDetail(currentClientID,type){
      let base = new Base()
      let that = this
      let selectedYear = this.data.selectedYear
      let selectedMonth = this.data.selectedMonth=='无'?'0':this.data.selectedMonth
      let selectedDay = this.data.selectedDay
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      let url,
          data = {
        select_year:selectedYear,
        select_mouth:selectedMonth,
        client_id:currentClientID
      }
      if(type=='year'){
        url="Finance/get_finance_yearly"
      }else if(type=='month'){
        url='Finance/get_finance_mouthly'
      }else if(type=='day'){
        url='Finance/get_detail_finance',
        data.select_day = selectedDay
      }else{
        return
      }

      base.request({
        url,
        data,
      },function(res){
        let financeDetailData = res.data.detail_finance_data 
        console.log(financeDetailData)
        for(var i=0,len=financeDetailData.length;i<len;i++){
            financeDetailData[i].new_time = that.format(financeDetailData[i].new_time*1000)
        }
        if(type=='year'){
          that.setData({
            financeDetailData ,
            financialDetail: true,
            totalClientConsume:res.data.total_consume
          })
        }else if(type=='month' || type=='day'){
          that.setData({
            financeDetailData ,
            monthFinancialDetail: true,
            totalClientConsume:res.data.total_consume
          })
        }
        wx.hideLoading()
      })
    },
    getDaysInOneMonth(year, month){
      month = parseInt(month, 10);
      var d= new Date(year, month, 0);
      return d.getDate();
    },
    tofinancialDetail(e){
      this.data.currentClientID = e.target.dataset.clientid
      if(this.data.selectedMonth=='0' || this.data.selectedMonth=='全年'){
        this.loadFinancialDetail(this.data.currentClientID,'year')
      }else{
        const day = this.getDaysInOneMonth(this.data.selectedYear,this.data.selectedMonth)
        let daysGrp = []
        for(var i=1;i<=day;i++){
          daysGrp.push(i<10?'0'+i:i+'')
        }
        daysGrp.unshift('整月')
        console.log(daysGrp)
        this.setData({
          days:daysGrp,
          selectedDay:''
        })
        this.loadFinancialDetail(this.data.currentClientID,'month')
      }
    },
    checkStock(){
      this.setData({
        isShowCheckStock:true
      })
    },
    closeCheckStock(){
      this.setData({
        isShowCheckStock:false
      })
    },
    recordInput(e){
      this.setData({
        pwd:e.detail.value
      })
    },
    subPwd(){
      const pwd = this.data.pwd
      var self = this
      finance_token(pwd,function(e){
        if(e.data.status == 0){
          wx.showToast({
            title:'密码错误',
            icon:'none',
            duration:1500
          })
          return 
        }
        self.setData({
          isShowCheckStock:false,//密码框
          isShowStockOptions:true,//optionslist
        })
      })
    },
    deleteStock(){
      const isDelete = !this.data.isDelete
      const isModify = false
      const isAdd = false
      this.setData({
        isDelete,
        isModify,
        isAdd
      })
    },
    modifyStock(){
      const isModify = !this.data.isModify
      // const isDelete = false
      const isAdd = false
      this.setData({
        // isDelete,
        isModify,
        isAdd
      })
    },
    toReceipt(){
      const isAdd = true
      const isModify = false
      // const isDelete = false
      this.setData({
        isAdd,
        // isDelete,
        isModify,
        isFinanceBox:true,
        sendFinanceForm:{}
      })
    },
    toAddGood(){
      const isAdd = true
      const isModify = false
      // const isDelete = false
      this.setData({
        isAdd,
        // isDelete,
        isModify,
        isAddFinance:true,
        sendFinanceForm:{}
      })
    },
    toCloseGood(){
      this.setData({
        isShowStockOptions:false
      })
    },
    //月
    chooseMonthFinanceDetailData(e){
      const tradeid = e.target.dataset.tradeid
      let financeDetailData = this.data.financeDetailData
      let curRemark = ''
      for(var i=0,len=financeDetailData.length;i<len;i++){
        if(financeDetailData[i].trade_id == tradeid){
          curRemark = financeDetailData[i].remark
        }
      }
      console.log(tradeid)
      this.setData({
        isShowFinance:true,
        curRemark:curRemark
      })
      // if(this.data.isDelete && !this.data.isModify){
      //   wx.showModal({
      //     title: '提示',
      //     content: '确认删除此条数据？',
      //     success(res) {
      //       if (res.confirm) {
      //         let base = new Base()
      //         base.request({
      //           url:'Finance/del_trade',
      //           data:{
      //             financetoken:wx.getStorageSync('financetoken'),
      //             trade_id:tradeid
      //           }
      //         },function(res){
      //           if(res.data.status == 1){
      //             wx.showToast({
      //               title:'删除成功',
      //               icon:'success',
      //               duration:1000
      //             })
      //             that.loadFinancial('2019','0')
      //             this.loadFinancialDetail(this.data.currentClientID,'month')
      //           }else{
      //             wx.showModal({
      //               title:'失败提示',
      //               content:"删除失败,请重试!",
      //               confirmText: "确定",
      //               success:function(res){
      //               }
      //             })
      //           }
      //           console.log('deleteFinance:',res)
      //         })
      //       } else if (res.cancel) {
              
      //       }
      //     }
      //   })
      // }else if(this.data.isModify && !this.data.isDelete){
      // }else if(this.data.isAdd){
      //   this.setData({
      //     isFinanceBox:true,
      //     sendFinanceForm:{}
      //   })
      // }
    },
    choosefinanceDetailData(e){
      const tradeid = e.target.dataset.tradeid
      if(this.data.isDelete && !this.data.isModify){
        return false
      }else if(this.data.isModify && !this.data.isDelete){
        return false
      }else if(this.data.isAdd){
        this.setData({
          isFinanceBox:true,
          sendFinanceForm:{}
        })
      }
    },
    closeFinanceBox(){
      this.setData({
        isFinanceBox:false,
        sendFinanceForm:{}
      })
    },
    closeAddFinanceBox(){
      this.setData({
        isAddFinance:false,
        sendAddFinanceForm:{}
      })
    },
    inputNewTime(e){
      let sendFinanceForm = this.data.sendFinanceForm
      sendFinanceForm.new_time = e.detail.value
      this.setData({
        sendFinanceForm
      })
    },
    inputConsume(e){
      let sendFinanceForm = this.data.sendFinanceForm
      sendFinanceForm.consume = e.detail.value
      this.setData({
        sendFinanceForm
      })
    },
    inputReceipt(e){
      let sendFinanceForm = this.data.sendFinanceForm
      sendFinanceForm.receipt = e.detail.value
      this.setData({
        sendFinanceForm
      })
    },
    inputRemark(e){
      let sendFinanceForm = this.data.sendFinanceForm
      sendFinanceForm.remark = e.detail.value
      this.setData({
        sendFinanceForm
      })
    },
    inputOtherConsume(e){
      let sendFinanceForm = this.data.sendFinanceForm
      sendFinanceForm.other_consume = e.detail.value
      this.setData({
        sendFinanceForm
      })
    },
    subFinance(){
      let sendFinanceForm = this.data.sendFinanceForm
      sendFinanceForm.consume = 0
      sendFinanceForm.other_consume = 0
      let that = this
      if(sendFinanceForm.receipt!=='' && sendFinanceForm.remark!==''  ){
        // var timestamp = (new Date()).getTime();
        // sendFinanceForm.new_time = timestamp
        sendFinanceForm.financetoken = wx.getStorageSync('financetoken')
        let base = new Base()
        console.log(this.data.isAdd,this.data.isModify)
        // if(this.data.isAdd && !this.data.isModify){
        sendFinanceForm.client_id = this.data.currentClientID
        base.request({
          url:"Finance/new_trade",
          data:sendFinanceForm
        },function(res){
          if(res.data.status == 1){
            wx.showToast({
              title:'修改成功',
              icon:'success',
              duration:1200
            })
          }else{
            wx.showModal({
              title:'失败提示',
              content:"修改失败,请重试!",
              confirmText: "确定",
              success:function(res){
              }
            })
          }
          that.loadFinancial('2019','0')
          if(that.data.selectedMonth == '全年'){
            that.loadFinancialDetail(that.data.currentClientID,'year')
          }else{
            if(that.data.isDayFinance){
              that.loadFinancialDetail(that.data.currentClientID,'day')
            }else{
              that.loadFinancialDetail(that.data.currentClientID,'month')
            }
          }
          that.setData({
            isFinanceBox:false
          })
        })
        // }
        // else if(this.data.isModify && !this.data.isAdd){
        //   base.request({//不能用
        //     url:"Finance/change_trade",
        //     data:sendFinanceForm
        //   },function(res){
        //     if(res.data.status == 1){
        //       wx.showToast({
        //         title:'修改成功',
        //         icon:'success',
        //         duration:1200
        //       })
        //       that.setData({
        //         isAdd:false,
        //         isModify:false,
        //       })
        //     }else{
        //       wx.showModal({
        //         title:'失败提示',
        //         content:"修改失败,请重试!",
        //         confirmText: "确定",
        //         success:function(res){
        //         }
        //       })
        //     }
        //     that.loadFinancial('2019','0')
        //     that.loadFinancialDetail(that.data.currentClientID,'month')
        //     that.setData({
        //       isFinanceBox:false
        //     })
        //   })
        // }
      }else{
        wx.showToast({
          title:"不能留空",
          icon:'error',
          duration:1200
        })
      }
      
    },


    subaAddFinance(){
      let sendFinanceForm = this.data.sendAddFinanceForm
      sendFinanceForm.receipt = 0
      sendFinanceForm.other_consume = 0
      let that = this
      if(sendFinanceForm.consume!=='' && sendFinanceForm.remark!=='' ){
        // var timestamp = (new Date()).getTime();
        // sendFinanceForm.new_time = timestamp
        sendFinanceForm.financetoken = wx.getStorageSync('financetoken')
        let base = new Base()
        sendFinanceForm.client_id = this.data.currentClientID
        base.request({
          url:"Finance/new_trade",
          data:sendFinanceForm
        },function(res){
          if(res.data.status == 1){
            wx.showToast({
              title:'添加成功',
              icon:'success',
              duration:1200
            })
          }else{
            wx.showModal({
              title:'失败提示',
              content:"添加失败,请重试!",
              confirmText: "确定",
              success:function(res){
              }
            })
          }
          that.loadFinancial('2019','0')
          if(that.data.selectedMonth == '全年'){
            that.loadFinancialDetail(that.data.currentClientID,'year')
          }else{
            if(that.data.isDayFinance){
              that.loadFinancialDetail(that.data.currentClientID,'day')
            }else{
              that.loadFinancialDetail(that.data.currentClientID,'month')
            }
          }
          that.setData({
            isAddFinance:false
          })
        })
        
      }else{
        wx.showToast({
          title:"不能留空",
          icon:'error',
          duration:1200
        })
      }
      
    },

    inputAddConsume(e){
      let sendAddFinanceForm = this.data.sendAddFinanceForm
      sendAddFinanceForm.consume = e.detail.value
      this.setData({
        sendAddFinanceForm
      })
    },
    inputAddReceipt(e){
      let sendAddFinanceForm = this.data.sendAddFinanceForm
      sendAddFinanceForm.receipt = e.detail.value
      this.setData({
        sendAddFinanceForm
      })
    },
    inputAddRemark(e){
      let sendAddFinanceForm = this.data.sendAddFinanceForm
      sendAddFinanceForm.remark = e.detail.value
      this.setData({
        sendAddFinanceForm
      })
    },
    inputAddOtherConsume(e){
      let sendAddFinanceForm = this.data.sendAddFinanceForm
      sendAddFinanceForm.other_consume = e.detail.value
      this.setData({
        sendAddFinanceForm
      })
    },
    backToFinaceDta(){
      this.setData({
        financialDetail:false,
        monthFinancialDetail:false,
        financialDetail:false
      })
    },
    searchFinance(e){
      let base = new Base()
      let self = this
      const search_client_shop = e.detail.value
      if(search_client_shop!==''){
        base.request({
          url:'Finance/search_finance',
          data:{
            search_client_shop,
            select_year:'2019',
            select_mouth:'0'
          }
        },function(res){
          let result = res.data.turnover_data
          console.log(res)
          let turnover_data = result.data
          let total_consume = res.data.total_consume
          self.setData({
            financeData: turnover_data,
            total_consume
          })
        })
      }else{
        this.loadFinancial('2019','0')
      }
    },
    selectCurrentYear(val){
      const year = val.target.dataset.year
      let month = this.data.selectedMonth
      if(month == '不选')month='0'
      this.loadFinancial(year,month)
      this.setData({
        selectedYear:year
      })
    },
    selectCurrentMonth(val){
      let month = val.target.dataset.month
      if(month == '全年')month='0'
      const year = this.data.selectedYear
      this.loadFinancial(year,month)
      this.setData({
        selectedMonth:month
      })
    },
    selectCurrentDay(val){
      const day = val.target.dataset.day=='整月'?'':val.target.dataset.day
      this.setData({
        isDayFinance:!day=='',
        selectedDay:day
      })
      if(day==''){
        this.loadFinancialDetail(this.data.currentClientID,'month')
      }else{
        this.loadFinancialDetail(this.data.currentClientID,'day')
      }
    },
    closeShowFinanceBox(){
      this.setData({
        isShowFinance:false
      })
    }
  },
  created: function (options) {
    this.loadFinancial('2019','0')
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
