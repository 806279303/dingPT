//logs.js
// const util = require('../../utils/util.js')
import { Token } from '../../utils/token.js'

Page({
  data: {
    // logs: []
    isTip:true,
    tipTxt:''
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    if(wx.getStorageSync('token')){
      wx.navigateTo({
        url:'../index/index'
      })
    }
  },
  bindUsername(){
  },
  //inputfocus的时候
  inputFocus(e){
    this.setData({
      tipTxt:''
    })
  },
  formSubmit(e){
    var self = this
    const data = {
      user_phone:e.detail.value.username,
      user_login_pw: e.detail.value.pwd
    }
    console.log(data)
    // 235 547
    var token = new Token()
    token.getToken(data,function(res){
      console.log(res)
      if(res.status == 1){
        if(res.identity=='worker'){
          self.setData({
            data:{
              user_phone:'',
              user_login_pw:''
            }
          })
          wx.navigateTo({
            url:'../index/index'
          })
        }else{
          self.setData({
            tipTxt:'*用户名或者密码错误'
          })
        }
      }else{
        self.setData({
          tipTxt:'*用户名或者密码错误'
        })
      }
    })
    
  }
})
