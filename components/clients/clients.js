// components/clients/clients.js
import { Base } from '../../utils/base.js'
var app=getApp(); 
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
    isClients:false,
    addClientState:false,
    clientData:{
      client_shop:'',
      client_name:'',
      client_phone:'',
      client_credit:'',
      client_id_card_num:'',
      client_id_card_photo:''
    },
    isCanModifyClient:false,
    isCanDeleteClient:false,
    modifyClientData:{
      client_shop:'',
      client_name:'',
      client_phone:'',
      client_credit:'',
      client_id_card_num:'',
      client_id_card_photo:'no photo'
    },
    modifyOrAdd:false,
    hasChooseImg:false,
    client_data:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadClient(filterdata,url){
      var self = this
      var base = new Base()
      let data = {}
      if(url){
        data.url = url
      }else{
        data.url = 'Client/get_client'
      }

      if(data){
        data.data = filterdata
      }
      base.request(data, function (res) {
        let data = res.data.client_data
        console.log(data)
        self.setData({
          client_data:data
        })
      })
    },
    showClients(){
      this.setData({
        isClients: true
      })
    },
    hideClients(){
      this.setData({
        isClients: false
      })
    },
    getAddGoodState(e){
      this.setData({
        modifyClientData:{
          client_shop:'',
          client_name:'',
          client_phone:'',
          client_credit:'',
          client_id_card_num:'',
          client_id_card_photo:'no photo'
        },
        addClientState:e.detail.addGoodState,
        modifyOrAdd:false,
        hasChooseImg:false
      })
    },
    getModifyGoodState(e){
      this.setData({
        isCanModifyClient:e.detail.modifyGoodState,
        isCanDeleteClient:e.detail.deleteGoodState
      })
    },
    getDeleteGoodState(e){
      this.setData({
        isCanModifyClient:e.detail.modifyGoodState,
        isCanDeleteClient:e.detail.deleteGoodState,
      })
    },
    exitGoodState(){
      let client_data = this.data.client_data
      client_data.length = 0
      client_data = []
      this.setData({
        client_data
      })
      wx.removeStorageSync('usermanagertoken')
    },
    closeAddClient(){
      let that = this
      this.loadClient()
      that.setData({
        addClientState:false,
        modifyClientData:{}
      })
    },
    chooseCurrentClient(e){
      if(this.data.isCanModifyClient && !this.data.isCanDeleteClient){
        console.log(e.target)
        const clientid = e.target.dataset.clientid
        let clientData = this.data.client_data.data
        let modifyClientData = {}
        for(var i=0,len=clientData.length;i<len;i++){
          if(clientData[i].client_id == clientid){
            modifyClientData = clientData[i]
            this.setData({
              modifyClientData,
              addClientState:true,
              modifyOrAdd:true,
              hasChooseImg:false
            })
            break
          }
        }
        console.log(clientid)
      }else if(!this.data.isCanModifyClient && this.data.isCanDeleteClient){
        const clientid = e.target.dataset.clientid
        let that = this 
        wx.showModal({
          title: '提示',
          content: '确定删除？',
          success(res) {
            if (res.confirm) {
              let base = new Base()
              base.request({
                url:'Client/del_client',
                data:{
                  client_id:clientid,
                  usermanagertoken:wx.getStorageSync('usermanagertoken')
                }
              },function(res){
                if(res.data.status == 1){
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 1300
                  })
                  that.loadClient()
                  that.setData({
                    addClientState:false
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
            } else if (res.cancel) {
              
            }
          }
        })
      }
    },
    inputClientShop(e){
      let modifyClientData = this.data.modifyClientData
      modifyClientData.client_shop = e.detail.value
      this.setData({
        modifyClientData
      })
    },
    inputClientName(e){
      let modifyClientData = this.data.modifyClientData
      modifyClientData.client_name = e.detail.value
      this.setData({
        modifyClientData
      })
    },
    inputClientPhone(e){
      let modifyClientData = this.data.modifyClientData
      modifyClientData.client_phone = e.detail.value
      this.setData({
        modifyClientData
      })
    },
    inputClientIdCardNum(e){
      let modifyClientData = this.data.modifyClientData
      modifyClientData.client_id_card_num = e.detail.value
      this.setData({
        modifyClientData
      })
    },
    inputClientCredit(e){
      let modifyClientData = this.data.modifyClientData
      modifyClientData.client_credit = e.detail.value
      this.setData({
        modifyClientData
      })
    },
    createClient(){
      let modifyClientData = this.data.modifyClientData
      
      var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
      var strTest = modifyClientData.client_name;
      if(pat.test(modifyClientData.client_shop)==true) 
      { 
          wx.showToast({
            title: '店名中含非法字符 ',
            icon: 'none',
            duration: 1500
          })
          return false; 
      }
      if(pat.test(strTest)==true) 
      { 
          wx.showToast({
            title: '真实姓名中含非法字符 ',
            icon: 'none',
            duration: 1500
          })
          return false; 
      }
      if(strTest == ''){
        wx.showToast({
          title: '店名不能为空 ',
          icon: 'none',
          duration: 1500
        })
        return false; 
      }
      let that = this
      let base = new Base()
      console.log(this.data.modifyOrAdd)
      console.log(modifyClientData)
      if(this.data.modifyOrAdd){//true为modify
        modifyClientData.usermanagertoken = wx.getStorageSync('usermanagertoken')
        if(this.data.hasChooseImg){
          wx.uploadFile({
            url: 'Client/change_client_info',
            filePath:modifyClientData.client_id_card_photo,
            name:'file',
            // header: {}, // 设置请求的 header
            formData: modifyClientData, // HTTP 请求中其他额外的 form data
            success: function(e){
              const res = JSON.parse(e.data)
              // success
              if(res.status == 1){
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 1300
                })
                that.loadClient()
                that.setData({
                  addClientState:false
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
            },
            fail: function(res) {
              console.log(res)
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }else{
          console.log('走了非文件')
          let base = new Base()
          let that = this
          base.request({
            url:'Client/change_client_info',
            data:modifyClientData
          },function(res){
            if(res.data.status == 1){
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })
              that.loadClient()
              that.setData({
                addClientState:false
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
        }
      }else{
        modifyClientData.usermanagertoken = wx.getStorageSync('usermanagertoken')
        wx.uploadFile({
          url: 'https://m.dingpeitong.cn/v2/pei/public/index.php/api/Client/new_client',
          filePath:modifyClientData.client_id_card_photo,
          name:'file',
          // header: {}, // 设置请求的 header
          formData: modifyClientData, // HTTP 请求中其他额外的 form data
          success: function(e){
            const res = JSON.parse(e.data)
            // success
            if(res.status == 1){
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1300
              })
              that.loadClient()
              that.setData({
                addClientState:false
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
          },
          fail: function(res) {
            console.log(res)
            // fail
          },
          complete: function() {
            // complete
          }
        })
      }
    },
    addUploadImg(){
      let that = this
      wx.chooseImage({  
        count: 1,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {  
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
          console.log(res) 
          var tempFilePaths = res.tempFilePaths;  
          console.log(res)
          const images = res.tempFilePaths[0]
          let modifyClientData = that.data.modifyClientData
          // 限制最多只能留下3张照片
          modifyClientData.client_id_card_photo = images
          that.setData({
            modifyClientData,
            hasChooseImg:true
          })
        }  
      }); 
    },
    filterClientData(e){
      if(!wx.getStorageSync('usermanagertoken')){return false}
      const search_name = e.detail.value
      if(search_name == ''){
        this.loadClient()
      }else{
        let data = {
          search_name
        }
        this.loadClient(data,'Client/search_client')
      }
    },
    openClientsData(){
      this.loadClient()
    }
  },
  created:function(options){
  }
})
