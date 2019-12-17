// components/stockOptions/stockOptions.js
import { user_manager_token, master_token } from '../../utils/pageToken.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowCheckStock:false,//密码框
    isShowStockOptions:false,//optionslist
    pwd:'',
    isModify:false,
    isDelete:false,
    isAdd:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开库存密码验证
    checkStock(){
      this.setData({
        isShowCheckStock:true
      })
    },
    // 关闭库存密码验证
    closeCheckStock(){
      this.setData({
        isShowCheckStock:false
      })
    },
    //监听密码
    recordInput(e){
      const pwd = e.detail.value
      this.setData({
        pwd
      })
    },
    //提交
    subPwd(e){
      const type = e.target.dataset.type
      const pwd = this.data.pwd
      var self = this
      if(type == '库存'){
        user_manager_token(pwd,function(e){
          if(e.data.status == 1){
            self.setData({
              isShowCheckStock:false,//密码框
              isShowStockOptions:true,//optionslist
            })
            self.triggerEvent('openClientsData')
          }else{
            wx.showToast({
              title:'密码错误',
              icon:'none',
              duration:1500
            })
          }
        })
      }else if(type == '店长'){
        master_token(pwd,function(e){
          if(e.data.status == 1){
            self.setData({
              isShowCheckStock:false,//密码框
              isShowStockOptions:true,//optionslist
            })
          }else{
            wx.showToast({
              title:'密码错误',
              icon:'none',
              duration:1500
            })
          }
        })
      }
    },
    //向父组件传是否打开添加界面的值
    toAddGood(e){
      const type = e.target.dataset.type
      const isModify = false
      const isDelete = false
      if(type == '库存'){
        this.setData({
          isModify,
          isDelete
        })
        this.triggerEvent('addGoodState',{addGoodState : true})
      }else if(type == '店长'){
        this.triggerEvent('addClientState',{addClientState : true})
      }
    },
    modifyStock(e){
      const type = e.target.dataset.type
      const isModify = !this.data.isModify
      const isDelete = false
      if(type == '库存'){
        this.setData({
          isModify,
          isDelete
        })
        this.triggerEvent('modifyGoodState',{modifyGoodState : isModify,deleteGoodState:isDelete})
      }else if(type == '店长'){
        this.setData({
          isModify,
          isDelete
        })
        this.triggerEvent('modifyClientState',{modifyClientState : isModify,deleteClientState:isDelete})
      }
    },
    deleteStock(e){
      const type = e.target.dataset.type
      const isDelete = !this.data.isDelete
      const isModify = false
      if(type == '库存'){
        this.setData({
          isDelete,
          isModify
        })
        this.triggerEvent('deleteGoodState',{modifyGoodState : isModify,deleteGoodState : isDelete})
      }else if(type == '店长'){
        this.setData({
          isDelete,
          isModify:false
        })
        this.triggerEvent('deleteClientState',{deleteClientState : isDelete,modifyClientState : isModify})
      }
    },
    toExitGood(e){
      const isDelete = false
      const isModify = false
      this.setData({
        isDelete,
        isModify,
        isShowCheckStock:false,//密码框
        isShowStockOptions:false,//optionslist
      })
      this.triggerEvent('exitGoodState',{modifyGoodState : isModify,deleteGoodState : isDelete,exitGoodState : true})
    }
  }
})
