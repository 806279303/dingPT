// components/modify/modify.js
import { master_token } from '../../utils/pageToken.js'
import { Base } from '../../utils/base.js'

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
    isModify:false,
    isChecked:false,//是否验证过店长密码
    master_pwd:'',
    isOptBtns:false,
    isComMod:false,
    isFinIncome:false,
    comModSearch:'',
    finIncomeRecord:'',
    pwdGroup:{
      user_login_pw:'',
      user_saving_pw:'',
      user_master_pw:'',
      user_finance_pw:'',
      user_manager_pw:'',
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModify() {
      this.setData({
        isModify: true
      })
    },
    hideModify() {
      this.setData({
        isModify: false
      })
    },
    // 店长密码focus
    bindMasterInput(e){
      this.setData({
        master_pwd:e.detail.value
      })
    },
    //验证并缓存店长密码
    checkMasterPwd(e){
      var self = this
      let pwd = this.data.master_pwd
      master_token(pwd,function(e){
        if(e.data.status){
          console.log(e)
          self.setData({
            isOptBtns:true,
            
          })
          wx.showToast({
            title:'验证成功',
            icon:'succes',
            duration:1000
          })
        }else{
          wx.showToast({
            title:'密码错误',
            icon:'none',
            duration:1500
          })
        }
      })
    },
    // 修改各种密码
    modifyPwd(e){
      var self = this
      let data = this.data.pwdGroup
      data.mastertoken = wx.getStorageSync('mastertoken')
      let base = new Base()
      base.request({
        url:'Password/change_password',
        data:data
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title:'修改成功',
            icon:'succes',
            duration:1200
          })
          self.setData({
            isChecked:false 
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
      })
    },
    backToOpt(){
      this.setData({
        isChecked:false,
        isFinIncome:false,
        isComMod:false,
        isOptBtns:true,
      })
    },
    backToCheck(){
      this.setData({
        isChecked:false,
        isFinIncome:false,
        isComMod:false,
        isOptBtns:false,
        isChecked:false
      })
    },
    //格式化时间
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
      return y + '/' + this.add0(m) + '/' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) +':'+ this.add0(s);
    },

    loadComMod(){
      let base = new Base()
      let that = this
      base.request({
        url:'Password/get_store',
        type:'post',
        data:{
          mastertoken:wx.getStorageSync('mastertoken')
        }
      },function(res){
        let data = res.data.receipt_data
        for(var i in data){
          data[i].new_time = that.format(data[i].new_time*1000)
        }
        that.setData({
          comModData:data
        })
      })
    },
    showComMod(){
      this.loadComMod()
      this.setData({
        isFinIncome:false,
        isComMod:true,
        isOptBtns:false,
      })
    },
    loadFinIncome(){
      let base = new Base()
      let that = this
      base.request({
        url:'Password/get_receipt',
        type:'post',
        data:{
          mastertoken:wx.getStorageSync('mastertoken')
        }
      },function(res){
        let data = res.data.receipt_data
        for(var i in data){
          data[i].new_time = that.format(data[i].new_time*1000)
        }
        that.setData({
          finIncomeData:data
        })
      })
    },
    showFinIncome(){
      this.loadFinIncome()
      this.setData({
        isFinIncome:true,
        isComMod:false,
        isOptBtns:false,
      })
    },
    showModPwd(){
      let base = new Base()
      let that = this
      base.request({
        url:'Password/get_password',
        type:'get',
        data:{
          mastertoken:wx.getStorageSync('mastertoken')
        }
      },function(e){
        var pwdGroup = {
          user_login_pw:e.data.user_login_pw,
          user_saving_pw:e.data.user_saving_pw,
          user_master_pw:e.data.user_master_pw,
          user_finance_pw:e.data.user_finance_pw,
          user_manager_pw:e.data.user_manager_pw,
        }
        that.setData({
          pwdGroup
        })
      })
      this.setData({
        isFinIncome:false,
        isComMod:false,
        isOptBtns:false,
        isChecked:true
      })
    },
    comModInput(e){
      this.setData({
        comModRecord:e.detail.value,
      })
      if(e.detail.value == ''){
        this.loadComMod()
        return
      }
      let that = this
      let base = new Base()
      base.request({
        url:'Password/search_store',
        type:'post',
        data:{
          name:e.detail.value,
          mastertoken:wx.getStorageSync('mastertoken')
        }
      },function(res){
        let data = res.data.receipt_data
        for(var i in data){
          data[i].new_time = that.format(data[i].new_time*1000)
        }
        that.setData({
          comModData:data,
        })
      })
    },
    finIncomeInput(e){
      this.setData({
        finIncomeRecord:e.detail.value
      })
      if(e.detail.value == ''){
        this.loadFinIncome()
        return
      }
      let that = this
      let base = new Base()
      base.request({
        url:'Password/search_receipt',
        type:'post',
        data:{
          client_shop:e.detail.value,
          mastertoken:wx.getStorageSync('mastertoken')
        }
      },function(res){
        let data = res.data.receipt_data
        for(var i in data){
          data[i].new_time = that.format(data[i].new_time*1000)
        }
        that.setData({
          finIncomeData:data
        })
      })
    },
    loginpw(e){
      var val = e.detail.value
      var pwdGroup = this.data.pwdGroup
      pwdGroup.user_login_pw = val
      this.setData({
        pwdGroup
      })
    },
    savingpw(e){
      var val = e.detail.value
      var pwdGroup = this.data.pwdGroup
      pwdGroup.user_saving_pw = val
      this.setData({
        pwdGroup
      })
    },
    masterpw(e){
      var val = e.detail.value
      var pwdGroup = this.data.pwdGroup
      pwdGroup.user_master_pw = val
      this.setData({
        pwdGroup
      })
    },
    financepw(e){
      var val = e.detail.value
      var pwdGroup = this.data.pwdGroup
      pwdGroup.user_finance_pw = val
      this.setData({
        pwdGroup
      })
    },
    managerpw(e){
      var val = e.detail.value
      var pwdGroup = this.data.pwdGroup
      pwdGroup.user_manager_pw = val
      this.setData({
        pwdGroup
      })
    },
  }
})
