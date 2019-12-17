// components/commodity/good_add/good_add.js
import {Base} from '../../../utils/base.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowAddGood:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowAddGood: true,//控制添加表单
    good_data: {
      kind_id: '',
      name_id: '',
      children:[
        {
          type:'',
          good_price:0,
          // add_price:0,
          special_client:[]
        }
      ],
      isAddKind:false,
      isAddName:false,
    },
    chooedKindName:'',
    chooedNameName:'',
    goodKindsAndNames:{
      kind_data:[],
      name_data:[]
    },
    isShowCheckStock:false,
    isKindOptionList:false,
    isNameOptionList:false,
    inputKind:'',
    inputName:'',
    isPowerClientInfo:false,
    tempClientInfo:[],
    rawClientInfo:[],
    isAddModelBox:false,
    ismodelList:false,
    comModel:[
      {}
    ],
    isNameOptionList:false,
    isNameOptionList:false,
    chooedKindNameModel:'',
    chooedNameNameModel:'',
    newModel:{
      kind_id:'',
      name_id:''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //监听input数值
    recordInput(e) {
      let self = this
      let good_data = this.data.good_data
      const content = e.target.dataset.content
      const index = e.target.dataset.index
      if (content == 'type' || content == 'good_price' || content == 'add_price') {
        good_data['children'][index][content] = e.detail.value
      }else{
        good_data[content] = e.detail.value
      }
      this.setData({
        good_data: good_data
      })
      console.log(this.data.good_data)
    },
    closeAddCommodity(){
      this.setData({
        isShowAddGood:false
      })
    },
    // 多加一行种类/价格
    moreTypeAndPrice(){
      var good_data = this.data.good_data
      if(good_data.children.length >= 3){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '每次最多添加三个种类哦',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return
      }
      good_data.children.push({
        type:"",
        good_price:0,
        special_client:[]
      })
      this.data.good_data = good_data
      this.setData({
        good_data
      })
    },
    //删除一行
    delList(e){
      const idx = e.target.dataset.index
      let g_data = this.data.good_data
      g_data.children.splice(idx,1)
      this.setData({
        good_data:g_data
      })
    },
    //发送添加商品请求
    sendAddInfo() {
      let sendData = {} //总数据  token、com、page
      const data = this.data.good_data
      let new_commodities = [] //商品总数据
      let that = this
      // 种类查重
      let checkRepeat = {}
      for(var i=0;i<data.children.length;i++){
        if (checkRepeat[data.children[i].type] || data.children[i].type == ''){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '不能有重复的种类或不能留空',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          return
        }
        let tempList = {} //循环专用
        checkRepeat[data.children[i].type] = 1
        tempList.kind_id = data.kind_id
        tempList.name_id = data.name_id
        tempList.type = data.children[i].type
        tempList.good_price = data.children[i].good_price
        tempList.special_client = data.children[i].special_client
        // tempList.add_price = data.children[i].add_price
        new_commodities.push(tempList)
      }
      sendData.usermanagertoken = wx.getStorageSync('usermanagertoken')
      sendData.new_commodities = new_commodities
      var sendStr = sendData
      //发起请求
      let base = new Base()
      base.request({
        url:'/Commodity/new_commodity',
        type:'POST',
        data:sendStr
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title: '增加成功',
            icon: 'success',
            duration: 1200
          })
          that.triggerEvent('closeAddGoodWindow') 
        }else{
          wx.showModal({
            title:'失败提示',
            content:"添加失败,请重试!",
            confirmText: "确定",
            success:function(res){
            }
          })
        }
      })
    },
    //打开添加窗口
    showAddKind(){
      var that = this
      that.setData({
        isAddKind:true,
        isAddName:false
      })
    },
    closeAddKind(){
      this.setData({
        isAddKind:false
      })
    },
    showAddName(){
      var that = this
      that.setData({
        isAddKind:false,
        isAddName:true
      })
    },
    closeAddName(){
      this.setData({
        isAddName:false
      })
    },
    showKindOptionList(){
      const isKindOptionList = !this.data.isKindOptionList
      this.setData({
        isKindOptionList,
        isNameOptionList:false
      })
    },
    showNameOptionList(){
      const isNameOptionList = !this.data.isNameOptionList
      this.setData({
        isNameOptionList,
        isKindOptionList:false
      })
    },
    showKindOptionListModel(){
      const isKindOptionListModel = !this.data.isKindOptionListModel
      this.setData({
        isKindOptionListModel,
        isNameOptionListModel:false
      })
    },
    showNameOptionListModel(){
      const isNameOptionListModel = !this.data.isNameOptionListModel
      this.setData({
        isNameOptionListModel,
        isKindOptionListModel:false
      })
    },
    inputKind(e){
      console.log(e.detail.value)
      this.data.inputKind = e.detail.value
    },
    inputName(e){
      console.log(e.detail.value)
      this.data.inputName = e.detail.value
    },
    addKind(){
      let base = new Base()
      const new_kind = this.data.inputKind
      let that = this
      let data = {}
      data.new_kind = new_kind
      data.usermanagertoken = wx.getStorageSync('usermanagertoken')
      base.request({
        url:'Commodity/new_kind',
        type:'POST',
        data:data
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title: '增加成功',
            icon: 'success',
            duration: 1200
          })
          that.loadKindsAndNames()
          that.setData({
            isAddKind:false
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
      })
    },
    delKind(){
      let base = new Base()
      const new_kind = this.data.good_data.kind_id
      console.log(this.good_data)
      if(new_kind=='')return false
      let that = this
      let data = {}
      data.kind_id = new_kind
      data.usermanagertoken = wx.getStorageSync('usermanagertoken')
      wx.showModal({
        title:'提示',
        content:"确认删除选中种类?",
        showCancel:true,
        confirmText: "确认",
        success:function(res){
          base.request({
            url:'Commodity/del_kind',
            type:'POST',
            data:data
          },function(res){
            if(res.data.status == 1){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1200
              })
              var newData = that.data.good_data
              newData.kind_id = ''
              that.setData({
                good_data:newData,
                chooedKindName:''
              })
              that.loadKindsAndNames()
            }else{
              wx.showModal({
                title:'失败提示',
                content:"删除失败,请重试!",
                confirmText: "确定",
                success:function(res){
                }
              })
            }
          })
        },
        fail:function(e){

        }
      })
    },
    addName(){
      let base = new Base()
      let that = this
      const new_name = this.data.inputName
      let data = {}
      data.new_name = new_name
      data.usermanagertoken = wx.getStorageSync('usermanagertoken')
      base.request({
        url:'Commodity/new_name',
        type:'POST',
        data:data
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title: '增加成功',
            icon: 'success',
            duration: 1200
          })
          that.loadKindsAndNames()
          that.setData({
            isAddName:false
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
      })
    },
    delName(){
      let base = new Base()
      let that = this
      const new_name = this.data.good_data.name_id
      console.log(this.good_data)
      if(new_name=='')return false
      let data = {}
      data.name_id = new_name
      data.usermanagertoken = wx.getStorageSync('usermanagertoken')
      wx.showModal({
        title:'提示',
        content:"确认删除选中名称?",
        showCancel:true,
        confirmText: "确认",
        success:function(res){
          base.request({
            url:'Commodity/del_name',
            type:'POST',
            data:data
          },function(res){
            if(res.data.status == 1){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1200
              })
              var newData = that.data.good_data
              newData.name_id = ''
              that.setData({
                good_data:newData,
                chooedNameName:''
              })
              that.loadKindsAndNames()
            }else{
              wx.showModal({
                title:'失败提示',
                content:"删除失败,请重试!",
                confirmText: "确定",
                success:function(res){
                }
              })
            }
          })
        },
        fail:function(e){

        }
      })
    },
    choooseKind(e){
      const currentKind = e.target.dataset.kindid
      const currentKindName = e.target.dataset.kindval
      let good_data = this.data.good_data
      good_data.kind_id = currentKind
      console.log(currentKind)
      let that = this
      that.setData({
        good_data,
        chooedKindName:currentKindName,
        isKindOptionList:false,
        isNameOptionList:false
      })
    },
    choooseName(e){
      const currentName = e.target.dataset.nameid
      const currentNameName = e.target.dataset.nameval
      let good_data = this.data.good_data
      good_data.name_id = currentName
      console.log(currentName)
      let that = this
      that.setData({
        good_data,
        chooedNameName:currentNameName,
        isKindOptionList:false,
        isNameOptionList:false
      })
    },
    choooseKindModel(e){
      const currentKind = e.target.dataset.kindid
      const currentKindName = e.target.dataset.kindval
      let newModel = this.data.newModel
      newModel.kind_id = currentKind
      let that = this
      that.setData({
        newModel,
        chooedKindNameModel:currentKindName,
        isKindOptionListModel:false,
        isNameOptionListModel:false
      })
    },
    choooseNameModel(e){
      const currentName = e.target.dataset.nameid
      const currentNameName = e.target.dataset.nameval
      let newModel = this.data.newModel
      newModel.name_id = currentName
      let that = this
      that.setData({
        newModel,
        chooedNameNameModel:currentNameName,
        isKindOptionListModel:false,
        isNameOptionListModel:false
      })
    },
    allClientPower(e){
      const index = e.target.dataset.index
      let good_data = this.data.good_data
      good_data.children[index].special_client = []
      this.setData({
        good_data
      })
    },
    chooseClientPower(e){
      const index = e.target.dataset.index
      this.setData({
        currentAddClientPowerIndex:index
      })
      let base = new Base()
      let that = this 
      base.request({
        url:"Client/get_client"
      },function(res){
        const tempClientInfo = res.data.client_data.data
        for(var i=0;i<tempClientInfo.length;i++){
          tempClientInfo.isSelect = false
        }
        that.setData({
          tempClientInfo,
          rawClientInfo:tempClientInfo,
          isPowerClientInfo:true
        })
      })
    },
    selectCurrentPower(e){
      const index = e.target.dataset.index
      const clientid = e.target.dataset.clientid
      console.log(clientid)
      const currentAddClientPowerIndex = this.data.currentAddClientPowerIndex
      const good_data = this.data.good_data
      let tempClientInfo = this.data.tempClientInfo
      tempClientInfo[index].isSelect = !tempClientInfo[index].isSelect
      let hasSelect = false
      if(tempClientInfo[index].isSelect){
        good_data.children[currentAddClientPowerIndex].special_client.push(clientid)
      }else{
        const len = good_data.children[currentAddClientPowerIndex].special_client.length
        for(var i=0;i<len;i++){
          if(good_data.children[currentAddClientPowerIndex].special_client[i] == clientid){
            good_data.children[currentAddClientPowerIndex].special_client.splice(i,1)
            break
          }
        }
      }
      console.log(good_data.children)
      this.setData({
        tempClientInfo,
        good_data
      })
    },
    closePowerClientInfo(){
      this.setData({
        isPowerClientInfo:false
      })
    },
    loadKindsAndNames(){
      let base = new Base()
      let that = this
      base.request({
        url:'Commodity/get_kinds_and_names'
      },function(res){
        const goodKindsAndNames = res.data
        console.log(goodKindsAndNames)
        that.setData({
          goodKindsAndNames
        })
      })
    },
    findPowerClient(e){
      console.log(e.detail.value)
      let rawClientInfo = this.data.rawClientInfo
      console.log(rawClientInfo)
      let newClientInfo = rawClientInfo.filter(v =>{
        return v.client_name.indexOf(e.detail.value) !== -1
      })
      console.log(newClientInfo)
      this.setData({
        tempClientInfo:newClientInfo
      })
    },
    loadModel(){
      let base = new Base()
      let that = this
      base.request({
        url:"Template/get_template",
        data:{
          usermanagertoken:wx.getStorageSync('usermanagertoken')
        }
      },function(res){
        if(res.data.status == 1){
          console.log(res.data)
          that.setData({
            comModel:res.data.template_data
          })
        }else{

        }
      })
    },
    chooseModel(){
      this.loadModel()
      this.setData({
        isAddModel:true
      })
    },
    closeModel(){
      this.setData({
        isAddModel:false
      })
    },
    addNewModel(){
      let isAddModelBox = !this.data.isAddModelBox
      this.setData({
        isAddModelBox
      })
    },
    subNewModel(){
      let base = new Base()
      let that = this
      let newModel = this.data.newModel
      newModel.usermanagertoken = wx.getStorageSync('usermanagertoken')
      base.request({
        url:"Template/new_template",
        data:newModel
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title:'添加成功',
            icon:'success',
            duration:1200
          })
          that.loadModel()
          that.setData({
            isAddModelBox:false
          })
        }else{

        }
      })
    },
    chooseCurModel(e){
      let template = e.target.dataset.template
      this.setData({
        chooedNameName:template.good_name,
        chooedKindName:template.good_kind,
        isAddModel:false,
        ismodelList:false
      })
    },
    showModelList(){
      let ismodelList = !this.data.ismodelList
      this.setData({
        ismodelList
      })
    },
    delModel(e){
      const template_id = e.target.dataset.templateid
      let that = this
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
              let base = new Base()
              base.request({
                url:'Template/del_template',
                data:{
                  template_id,
                  usermanagertoken:wx.getStorageSync('usermanagertoken')
                }
              },function(res){
                if(res.data.status == 1){
                  wx.showToast({
                    title:'删除成功',
                    icon:'success',
                    duration:1300
                  })
                  that.loadModel()
                }else{
                  wx.showToast({
                    title:'删除失败',
                    icon:'none',
                    duration:2000
                  })
                }
              })// 用户点击了确定 可以调用删除方法了
            } else if (sm.cancel) {
              
            }
          }
        })
      
    }
  },
  created(){
    this.loadKindsAndNames()
  }
})
