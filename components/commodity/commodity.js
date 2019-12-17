// components/commodity/commodity.js
import { Base } from '../../utils/base.js'
import { saving_token } from '../../utils/pageToken.js'
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
    isCommodity:true,//组件
    isSelectType:false,//筛选种类
    isSelectName:false,//筛选名称
    commodity_data:[],//商品列表数据
    isShowAddGood:false,//添加商品,
    isShowCheckStock:false,//是否显示输入库存操作密码框
    isShowStockOptions:false,//是否显示库存操作选项
    goodKindsAndNames:{
      kind_data:[],
      name_data:[]
    },//获取的库存种类和名字
    goodSphAndAsti:{
      sph_data:[],
      astigmatism_data:[]
    },
    currentKind:'',//当前筛选种类
    currentName:'',//当前筛选名字
    currentSph:'',//当前筛选
    currentAsti:'',//当前筛选
    isModifyGood:false,
    isCanModifyGood:false,
    isCanDeleteGood:false,
    modifyGoodForm:{
      good_kind:'',
      good_name:'',
      commodity_id: "",
      type: "",
      good_price: "",
      // add_price:0,
      good_inventory:0
    },
    isCommodityDetail:false,
    commodityDetailData:[
      {
        ballglasses:'11',
        children:[
          {ballsan:'22',ballcun:'33',id:1},
          {ballsan:'22',ballcun:'33',id:2},
        ]
      },
      {
        ballglasses:'11',
        children:[
          {ballsan:'22',ballcun:'33',id:3},
          {ballsan:'22',ballcun:'33',id:4},
          {ballsan:'22',ballcun:'33',id:5},
        ]
      },
    ],
    isShowGoodStockOptions:false,
    pwd:'',
    isShowCheckGoodStock:false,
    isGoodDelete:false,
    isGoodModify:false,
    isGoodAdd:false,
    isHandleGood:false,
    sphSelectOptions:[],
    astigmatismSelectOptions:[],
    isHandleModifyGood:false,
    handleModifyGood:[],
    ischeckBGOptions:false,
    ischeckSGOptions:false,
    handleGoodData:[{
      sph_id:'',sph:'',astigmatism:'',astigmatism_id:'',good_inventory:0,isAddBGoptions:false,isAddSGoptions:false
    }],
    isPowerClientInfo:false,
    filterData:{
      kind_id:"",
      name_id:''
    },
    filterGoodData:{
      sph_id:"",
      astigmatism_id:''
    },
    isAddSphBox:false,
    isAddAstiBox:false,
    inputSph:'',
    inputAsti:'',
    rawClientInfo:[],
    chooedSph:{
      id:"",
      val:""
    },
    chooedAsti:{
      id:'',
      val:""
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadCommodityData(filter,url){
      var self = this
      var base = new Base()
      const data = {}
      if(url){
        data.url = url
      }else{
        data.url = 'Commodity/get_commodity' 
      }
      if(filter){
        data.data=filter
      }
      wx.showLoading({
        title: '加载中',
      })
      base.request(data, function (res) {
      let result = res.data.commodity_data
      let res_data = result.data
      self.data.raw_commodityData = res_data
      console.log(res_data)
      let data = []
      let isKind = false//遍历判断是否存在重复种类
      let isName = false//遍历判断是否存在重复名称
      let flexNum = []
      //遍历生成数
      for(var i=0,len=res_data.length;i<len;i++){
        if(res_data[i].good_kind){
          //查重
          for (var j = 0, dataLen = data.length; j < dataLen; j++){
            //存在种类了，推名称就行
            if (res_data[i].good_kind == data[j].good_kind){
              isKind = true
              for (var k = 0, nameLen = data[j].children.length;k<nameLen;k++){
                //存在名称了，推数据就行
                if (res_data[i].good_name == data[j].children[k].good_name) {
                  isName = true
                  data[j].children[k].children.push({
                    type: res_data[i].type,
                    good_price: res_data[i].good_price,
                    good_inventory: res_data[i].good_inventory,
                    commodity_id: res_data[i].commodity_id,
                    add_price: res_data[i].add_price
                  })
                  break
                }
              }
              if (!isName) {
                data[j].children.push({
                  good_name: res_data[i].good_name,
                  children: [
                    {
                      type: res_data[i].type,
                      good_price: res_data[i].good_price,
                      good_inventory: res_data[i].good_inventory,
                      commodity_id: res_data[i].commodity_id,
                      add_price: res_data[i].add_price
                    }
                  ]
                })
              }
              isName = false
              break
            }
          }//查重结束
          if(!isKind){
            data.push({
              good_kind: res_data[i].good_kind,
              children: [
                {
                  good_name: res_data[i].good_name,
                  children: [
                    {
                      type: res_data[i].type,
                      good_price: res_data[i].good_price,
                      good_inventory: res_data[i].good_inventory,
                      commodity_id: res_data[i].commodity_id,
                      add_price: res_data[i].add_price
                    }
                  ]
                }
              ]
            })
          }
          isKind = false
        }
      }
      console.log(data)
      flexNum = self.computingFlex(data)
      console.log(flexNum)
      self.setData({
        commodity_data:data,
        flexNum:flexNum
      })
      self.getKindAndName()
      wx.hideLoading()
      })
    },
    loadCommodityDataOfClient(){
      var self = this
      var base = new Base()
      const client_id = app.globalData.outputClient.outputClientId
      if(client_id==''){
        wx.showToast({
          title:'未选择客户',
          icon:'none',
          duration:1000
        })
      }
      const data = { url: 'sell/get_commodity_of_client',data:{client_id} }
      wx.showLoading({
        title: '加载中',
      })
      base.request(data, function (res) {
      let result = res.data.commodity_data
      let res_data = result.data
      self.data.raw_commodityData = res_data
      console.log(res_data)
      let data = []
      let isKind = false//遍历判断是否存在重复种类
      let isName = false//遍历判断是否存在重复名称
      let flexNum = []
      //遍历生成数
      for(var i=0,len=res_data.length;i<len;i++){
        if(res_data[i].good_kind){
          //查重
          for (var j = 0, dataLen = data.length; j < dataLen; j++){
            //存在种类了，推名称就行
            if (res_data[i].good_kind == data[j].good_kind){
              isKind = true
              for (var k = 0, nameLen = data[j].children.length;k<nameLen;k++){
                //存在名称了，推数据就行
                if (res_data[i].good_name == data[j].children[k].good_name) {
                  isName = true
                  data[j].children[k].children.push({
                    type: res_data[i].type,
                    good_price: res_data[i].good_price,
                    good_inventory: res_data[i].good_inventory,
                    commodity_id: res_data[i].commodity_id,
                    add_price: res_data[i].add_price
                  })
                  break
                }
              }
              if (!isName) {
                data[j].children.push({
                  good_name: res_data[i].good_name,
                  children: [
                    {
                      type: res_data[i].type,
                      good_price: res_data[i].good_price,
                      good_inventory: res_data[i].good_inventory,
                      commodity_id: res_data[i].commodity_id,
                      add_price: res_data[i].add_price
                    }
                  ]
                })
              }
              isName = false
              break
            }
          }//查重结束
          if(!isKind){
            data.push({
              good_kind: res_data[i].good_kind,
              children: [
                {
                  good_name: res_data[i].good_name,
                  children: [
                    {
                      type: res_data[i].type,
                      good_price: res_data[i].good_price,
                      good_inventory: res_data[i].good_inventory,
                      commodity_id: res_data[i].commodity_id,
                      add_price: res_data[i].add_price
                    }
                  ]
                }
              ]
            })
          }
          isKind = false
        }
      }
      console.log(data)
      flexNum = self.computingFlex(data)
      console.log(flexNum)
      self.setData({
        commodity_data:data,
        flexNum:flexNum
      })
      self.getKindAndName()
      wx.hideLoading()
      })
    },
    showCommodity() {
      this.setData({
        isCommodity: true
      })
    },
    hideCommodity() {
      this.setData({
        isCommodity: false
      })
    },
    showTheCommodity(){
      this.setData({
        isCommodityDetail:false
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
    //控制名称种类隐藏
    showNameType() {
      let self = this
      self.setData({
        isSelectType: false,
        isSelectName: !self.data.isSelectName
      })
    },
    //计算flex的数组
    computingFlex(arr) {
      let self = this
      let flexArr = []
      let temp = []
      for(var i=0,len=arr.length;i<len;i++){
        if(arr[i].children){
          for (var j = 0, nameLen = arr[i].children.length; j < nameLen; j++){
            if (arr[i].children[j].children){
              temp.push(arr[i].children[j].children.length)
            }
          }
        }
        let num = temp.reduce((a,b) => a+b)
        flexArr.push({
          good_kind: num,
          good_name:temp
        })
      }
      return flexArr
    },
    // 添加商品
    toAddGood(){
      this.setData({
        isShowAddGood:true
      })
    },
    //用来接受来自stockOptions的状态值
    getAddGoodState(e){
      this.setData({
        isShowAddGood:e.detail.addGoodState
      })
    },
    getModifyGoodState(e){
      this.setData({
        isCanModifyGood:e.detail.modifyGoodState,
        isCanDeleteGood:e.detail.deleteGoodState
      })
    },
    getDeleteGoodState(e){
      this.setData({
        isCanModifyGood:e.detail.modifyGoodState,
        isCanDeleteGood:e.detail.deleteGoodState
      })
    },
    getExitGoodState(e){
      this.setData({
        isCanModifyGood:e.detail.modifyGoodState,
        isCanDeleteGood:e.detail.deleteGoodState
      })
    },
    //获取查询种类的名称,created后调用
    getKindAndName(){
      let request = new Base()
      let that = this
      request.request({
        url:'Commodity/get_kinds_and_names',
        data:that.data.filterData
      },function(re){
        let data = {}
        data.kinds = re.data.kind_data
        data.names = re.data.name_data
        that.setData({
          goodKindsAndNames:data
        })
      })
    },
    //筛选种类
    filterKind(e){
      const currentKind = e.target.dataset.currentval
      let filterData = this.data.filterData
      const kindid = e.target.dataset.currentid
      filterData.kind_id = kindid
      if(filterData.name_id !== ''){

      }else{
        filterData.name_id = '0'
      }
      this.loadCommodityData(filterData,'Commodity/select_commodity')
      this.getKindAndName()
      this.setData({
        filterData,
        currentKind
      })
    },
    filterSph(e){
      const currentSph = e.target.dataset.currentval
      let filterGoodData = this.data.filterGoodData
      const sphid = e.target.dataset.currentid
      filterGoodData.sph_id = sphid
      if(filterGoodData.astigmatism_id == '' && filterGoodData.sph_id == ''){
        this.loadCommodityDetailData(this.data.currentCommodityId)
      }else{
        if(filterGoodData.astigmatism_id == ''){
          filterGoodData.astigmatism_id = '0'
        }
        this.loadCommodityDetailData(this.data.currentCommodityId,filterGoodData,'Good/select_good')
      }
      this.setData({
        filterGoodData,
        currentSph
      })
    },
    //筛选名字
    filterName(e){
      const currentName = e.target.dataset.currentval 
      let filterData = this.data.filterData
      const nameid = e.target.dataset.currentid
      filterData.name_id = nameid
      if(filterData.name_id == ''){
        filterData.name_id = '0'
      }
      this.loadCommodityData(filterData,'Commodity/select_commodity')
      this.getKindAndName()
      this.setData({
        currentName,
        filterData
      })
    },
    filterAsti(e){
      const currentAsti = e.target.dataset.currentval 
      let filterGoodData = this.data.filterGoodData
      const astigmatismid = e.target.dataset.currentid
      filterGoodData.astigmatism_id = astigmatismid
      if(filterGoodData.astigmatism_id == '' && filterGoodData.sph_id == ''){
        this.loadCommodityDetailData(this.data.currentCommodityId)
      }else{
        if(filterGoodData.sph_id == ''){
          filterGoodData.sph_id = '0'
        }
        this.loadCommodityDetailData(this.data.currentCommodityId,filterGoodData,'Good/select_good')
      }
      this.setData({
        currentAsti,
        filterGoodData
      })
    },
    recoverKind(){
      let currentKind = ''
      let filterData = this.data.filterData
      const kindid = '0'
      filterData.kind_id = kindid
      this.loadCommodityData(filterData,'Commodity/select_commodity')
      this.setData({
        filterData,
        currentKind
      })
    },
    recoverSph(){
      let currentSph = ''
      let filterGoodData = this.data.filterGoodData
      const sphid = '0'
      filterGoodData.sph_id = sphid
      this.loadCommodityDetailData(this.data.currentCommodityId,filterGoodData,'Good/select_good')
      this.setData({
        filterGoodData,
        currentSph
      })
    },
    recoverName(){
      let currentName = ''
      let filterData = this.data.filterData
      const nameid = '0'
      filterData.name_id = nameid
      this.loadCommodityData(filterData,'Commodity/select_commodity')
      this.setData({
        filterData,
        currentName
      })
    },
    recoverAsti(){
      let currentAsti = ''
      let filterGoodData = this.data.filterGoodData
      const astigmatismid = '0'
      filterGoodData.astigmatism_id = astigmatismid
      this.loadCommodityDetailData(this.data.currentCommodityId,filterGoodData,'Good/select_good')
      this.setData({
        filterGoodData,
        currentAsti
      })
    },
    closeModifyGood(){
      this.setData({
        isModifyGood:false
      })
    },
    chooseCurrentCommodity(e){
      console.log(this.data.isCanDeleteGood,this.data.isCanModifyGood)
      let that = this
      const commodity_id = e.target.dataset.commodityid
      this.setData({currentCommodityId:commodity_id})
      if(this.data.isCanModifyGood && !this.data.isCanDeleteGood){
        const rawdata = this.data.raw_commodityData
        for(var i=0,len=rawdata.length;i<len;i++){
          if(rawdata[i].commodity_id == commodity_id){
            let modifyGoodForm = rawdata[i]
            modifyGoodForm.special_client = JSON.parse(modifyGoodForm.special_client)
            this.setData({
              modifyGoodForm
            })
          }
        }
        console.log(this.data.modifyGoodForm)
        this.setData({
          isModifyGood:true
        })
      }else if(!this.data.isCanModifyGood && this.data.isCanDeleteGood){
        wx.showModal({
          title: '提示',
          content: '确定删除？',
          success(res) {
            if (res.confirm) {
              const usermanagertoken = wx.getStorageSync('usermanagertoken');
              let base = new Base()
              base.request({
                url:'Commodity/del_commodity',
                data:{
                  commodity_id:commodity_id,
                  usermanagertoken
                }  
              },function(res){
                if(res.data.status == 1){
                  wx.showToast({
                    title:"删除成功",
                    icon:'success',
                    duration:1200
                  })
                  that.loadCommodityData()
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
            } else if (res.cancel) {
              
            }
          }
        })
        
      }else if(!this.data.isCanModifyGood && !this.data.isCanDeleteGood){
        // return false
        console.log(app.globalData.outputCommodity.isOutputCommodity,app.globalData.outputAddPro.isOutputAddPro)
        if(app.globalData.outputCommodity.isOutputCommodity && !app.globalData.outputAddPro.isOutputAddPro){
          app.globalData.outputCommodity.outputCommodityId = commodity_id
          app.globalData.outputCommodity.isHaveOutputCommodity = true 
          app.globalData.outputCommodity.isOutputCommodity = false 
          app.globalData.outputRglasses.isHaveOutputRglasses = false 
          app.globalData.outputRglasses.outputRglassesId = '' 
          app.globalData.outputLglasses.isHaveOutputLglasses = false 
          app.globalData.outputLglasses.outputLglassesId = '' 
          this.triggerEvent('sendCommodityId')  
        }else if(!app.globalData.outputCommodity.isOutputCommodity && app.globalData.outputAddPro.isOutputAddPro){
          console.log('选中的comid是',commodity_id)
          console.log('跳转')
          app.globalData.outputAddPro.outputAddCommodityId = commodity_id
          app.globalData.outputAddPro.isHaveOutputAddPro = true 
          app.globalData.outputAddPro.isOutputAddPro = false 
          this.triggerEvent('sendCommodityId')  
        }else{
          console.log('卧槽')
          const rawdata = this.data.raw_commodityData
          for(var i=0,len=rawdata.length;i<len;i++){
            if(rawdata[i].commodity_id == commodity_id){
              this.loadCommodityDetailData(commodity_id)
              this.loadSphAndAstigmatism()
              break;
            }
          }
        }
      }
    },
    loadSphAndAstigmatism(){
      let base2 = new Base()
      let that = this
      base2.request({
        url:'Good/new_get_sph_and_astigmatism',
        data:{
          commodity_id:that.data.currentCommodityId
        }
      },function(v){
        let goodSphAndAsti = that.data.goodSphAndAsti
        goodSphAndAsti.sph_data = v.data.sph_data
        goodSphAndAsti.astigmatism_data = v.data.astigmatism_data
        that.setData({
          goodSphAndAsti
        })
      })
    },
    loadKindsAndNames(){
      let base2 = new Base()
      let that = this
      base2.request({
        url:'Good/get_kinds_and_names'
      },function(re){
        let data = {}
        data.kinds = re.data.kind_data
        data.names = re.data.name_data
        that.setData({
          goodKindsAndNames:data
        })
      })
    },
    loadCommodityDetailData(commodity_id,params,isUrl){
      let base = new Base()
      let self = this 
      wx.showLoading({
        title: '加载中',
      })
      let url = 'Good/get_good'
      if(isUrl){url=isUrl}
      let data = {
        commodity_id,
        page:1
      }
      if(params){
        data.sph_id = params.sph_id
        data.astigmatism_id = params.astigmatism_id
      }
      base.request({
        url,
        data
      },function(res){
        const commodityDetailData = res.data.good_data
        console.log(commodityDetailData)
        
      let res_data = commodityDetailData.data
      self.data.raw_commodityDetailData = res_data
      console.log(res_data)
      let data = []
      let isSph = false//遍历判断是否存在重复种类
      // let isName = false//遍历判断是否存在重复名称
      //遍历生成数
      for(var i=0,len=res_data.length;i<len;i++){
        if(res_data[i].sph){
          //查重
          for (var j = 0, dataLen = data.length; j < dataLen; j++){
            //存在种类了，推名称就行
            if (res_data[i].sph == data[j].sph){
              isSph = true
              data[j].children.push({
                astigmatism:res_data[i].astigmatism,
                commodity_id:res_data[i].commodity_id,
                good_id:res_data[i].good_id,
                good_inventory:res_data[i].good_inventory
              })
              break
            }
          }//查重结束
          if(!isSph){
            data.push({
              sph: res_data[i].sph,
              children: [
                {
                  astigmatism:res_data[i].astigmatism,
                  commodity_id:res_data[i].commodity_id,
                  good_id:res_data[i].good_id,
                  good_inventory:res_data[i].good_inventory
                }
              ]
            })
          }
          isSph = false
        }
      }
      console.log(data)
        self.setData({
          isCommodityDetail:true,
          commodityDetailData:data
        })
        wx.hideLoading()
      })
    },
    loadGoodSphAndAsti(commodity_id){
      let base2 = new Base()
      base2.request({
        url:'Good/new_get_sph_and_astigmatism',
        data:{
          commodity_id
        }
      },function(v){
        console.log(v)
        let goodSphAndAsti = that.data.goodSphAndAsti
        goodSphAndAsti.sph_data = v.data.sph_data
        goodSphAndAsti.astigmatism_data = v.data.astigmatism_data
        that.setData({
          goodSphAndAsti
        })
      })
    },
    formCommdityDetailData(data){
    },
    recordModType(e){
      let modifyGoodForm = this.data.modifyGoodForm
      modifyGoodForm.type = e.detail.value
      this.setData({
        modifyGoodForm
      })
    },
    recordModPrice(e){
      let modifyGoodForm = this.data.modifyGoodForm
      modifyGoodForm.good_price = e.detail.value
      this.setData({
        modifyGoodForm
      })
    },
    recordModAddPrice(e){
      let modifyGoodForm = this.data.modifyGoodForm
      modifyGoodForm.add_price = e.detail.value
      this.setData({
        modifyGoodForm
      })
    },
    recordModInventory(e){
      let modifyGoodForm = this.data.modifyGoodForm
      modifyGoodForm.good_inventory = e.detail.value
      this.setData({
        modifyGoodForm
      })
    },
    subModify(){
      let subModifyData = this.data.modifyGoodForm
      let that = this
      subModifyData.usermanagertoken = wx.getStorageSync('usermanagertoken')
      let base = new Base()
      base.request({
        url:'Commodity/change_commodity',
        data:subModifyData
      },function(res){
        console.log(res)
        if(res.data.status == 1){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1200
          })
          that.loadCommodityData()
          that.setData({
            isModifyGood:false
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
    chooseGoodData(e){
      const goodid= e.target.dataset.goodid
      let that = this
      if(this.data.isGoodDelete && !this.data.isGoodModify){
        wx.showModal({
          title: '提示',
          content: '确定删除？',
          success(res) {
            if (res.confirm) {
              const savingtoken = wx.getStorageSync('savingtoken');
              let base = new Base()
              base.request({
                url:'Good/del_good',
                data:{
                  good_id:goodid,
                  savingtoken
                }  
              },function(res){
                if(res.data.status == 1){
                  wx.showToast({
                    title:"删除成功",
                    icon:"success",
                    duration:1200
                  })
                  that.loadCommodityDetailData(that.data.currentCommodityId)
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
            } else if (res.cancel) {
              
            }
          }
        })
      }else if(!this.data.isGoodDelete && this.data.isGoodModify){
        let base = new Base()
        wx.showLoading({
          title: '加载中',
        })
        base.request({
          url:'Good/get_detail_good',
          data:{
            good_id:goodid
          } 
        },function(res){
          // console.log(res)
          const data = res.data.good_data
          const handleModifyGood = data.data[0]
          console.log(handleModifyGood)
          that.setData({
            handleModifyGood
          })
          let base2 = new Base()
          base2.request({
            url:'Good/new_get_sph_and_astigmatism',
            data:{
              commodity_id:that.data.currentCommodityId
            }
          },function(v){
            console.log(v)
            that.setData({
              sphSelectOptions:v.data.sph_data,
              astigmatismSelectOptions:v.data.astigmatism_data
            })
            wx.hideLoading()
          })
        })
        that.setData({
          isHandleGood:false,
          isHandleModifyGood:true
        })
      }else if(!this.data.isGoodDelete && !this.data.isGoodModify){
        // return false
        if(app.globalData.outputRglasses.isOutputRglasses){
          app.globalData.outputRglasses.outputRglassesId = goodid 
          app.globalData.outputRglasses.isHaveOutputRglasses = true
          app.globalData.outputRglasses.isOutputRglasses = false
          this.triggerEvent('sendClientRglasses')  
        }
        if(app.globalData.outputLglasses.isOutputLglasses){
          app.globalData.outputLglasses.outputLglassesId = goodid 
          app.globalData.outputLglasses.isHaveOutputLglasses = true
          app.globalData.outputLglasses.isOutputLglasses = false
          this.triggerEvent('sendClientLglasses')  
        }
        
      }
    },
    checkGoodStock(){
      this.setData({
        isShowCheckGoodStock:true
      })
    },
    deleteGoodStock(){
      const isGoodDelete = !this.data.isGoodDelete
      const isGoodModify = false
      const isGoodAdd = false
      this.setData({
        isGoodDelete,
        isGoodModify,
        isGoodAdd
      })
    },
    modifyGoodStock(){
      const isGoodModify = !this.data.isGoodModify
      const isGoodDelete = false
      const isGoodAdd = false
      this.setData({
        isGoodDelete,
        isGoodModify,
        isGoodAdd
      })
    },
    addGoodStock(){
      const isGoodModify = false
      const isGoodDelete = false
      let base = new Base()
      let that = this
      wx.showLoading({
        title: '加载中',
      })
      base.request({
        url:'Good/new_get_sph_and_astigmatism',
        data:{
          commodity_id:that.data.currentCommodityId
        }
      },function(res){
        console.log(res)
        that.setData({
          sphSelectOptions:res.data.sph_data,
          astigmatismSelectOptions:res.data.astigmatism_data
        })
        console.log(that.data.sphSelectOptions,that.data.astigmatismSelectOptions)
        wx.hideLoading()
      })
      this.setData({
        isGoodDelete,
        isGoodModify,
        isHandleGood:true,
      })
    },
    exitGoodStock(){
      this.setData({
        isGoodDelete:false,
        isGoodModify:false,
        isGoodAdd:false,
        isShowGoodStockOptions:false
      })
    },
    closeCheckStock(){
      this.setData({
        isShowCheckGoodStock:false
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
      saving_token(pwd,function(e){
        if(e.data.status==1){
          self.setData({
            isShowCheckGoodStock:false,//密码框
            isShowGoodStockOptions:true,//optionslist
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
    backToCommodityDetail(){
      this.setData({
        isHandleGood:false
      })
    },
    showModifyGoodSph(){
      let that = this
      this.setData({
        isShowModifyGoodBG:!that.data.isShowModifyGoodBG,
        isShowModifyGoodSG:false
      })
    },
    showModifyGoodAstigmatism(){
      let that = this
      this.setData({
        isShowModifyGoodBG:false,
        isShowModifyGoodSG:!that.data.isShowModifyGoodSG
      })
    },
    chooseModifyGoodSph(e){
      const sphid = e.target.dataset.sphid
      console.log(sphid)
      let handleModifyGood = this.data.handleModifyGood
      let sphSelectOptions = this.data.sphSelectOptions
      handleModifyGood.sph_id = sphid
      for(var i=0;i<sphSelectOptions.length;i++){
        if(sphSelectOptions[i].sph_id == sphid){
          handleModifyGood.sph = sphSelectOptions[i].sph
        }
      }
      this.setData({
        handleModifyGood,
        isShowModifyGoodBG:false,
      })
    },
    chooseModifyGoodAssstigmatism(e){
      const astigmatismid = e.target.dataset.astigmatismid
      console.log(astigmatismid)
      let handleModifyGood = this.data.handleModifyGood
      let astigmatismSelectOptions = this.data.astigmatismSelectOptions
      handleModifyGood.astigmatism_id = astigmatismid
      for(var i=0;i<astigmatismSelectOptions.length;i++){
        if(astigmatismSelectOptions[i].astigmatism_id == astigmatismid){
          handleModifyGood.astigmatism = astigmatismSelectOptions[i].astigmatism
        }
      }
      this.setData({
        handleModifyGood,
        isShowModifyGoodSG:false,
      })
    },
    recordModifyGoodinventory(e){
      let handleModifyGood = this.data.handleModifyGood
      handleModifyGood.good_inventory = e.detail.value
      this.setData({handleModifyGood})
    },
    subModifyGood(){
      console.log(this.data.handleModifyGood)
      let base = new Base()
      let that = this
      let data = this.data.handleModifyGood
      data.savingtoken = wx.getStorageSync('savingtoken')
      wx.showLoading({
        title:'加载中'
      })
      base.request({
        url:"Good/change_good",
        data
      },function(res){
        if(res.data.status == 1){
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1300
          })
          setTimeout(function(){
            that.setData({
              isHandleModifyGood:false
            })
            that.loadCommodityDetailData(that.data.currentCommodityId)
          },1300)
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
    closeHandleModifyGood(){  
      this.setData({
        isHandleModifyGood:false
      })
    },
    //增加货物
    checkBGoptions(){
      let that = this 
      this.setData({
        ischeckBGOptions:!that.data.ischeckBGOptions,
        ischeckSGOptions:false,
      })
    },
    chooseBGoptions(e){
      console.log(e)
      let that = this 
      var chooedSph = this.data.chooedSph
      chooedSph.id = e.target.dataset.sph.sph_id
      chooedSph.val = e.target.dataset.sph.sph
      this.setData({
        ischeckBGOptions:!that.data.ischeckBGOptions,
        ischeckSGOptions:false,
        chooedSph
      })
    },
    showCurrentSphOptions(e){
      let handleGoodData = this.data.handleGoodData
      const index = e.target.dataset.currentidx
      console.log(handleGoodData)
      handleGoodData[index].isAddBGoptions = !handleGoodData[index].isAddBGoptions
      this.setData({
        handleGoodData
      })
    },
    showCurrentAstigmatismOptions(e){
      let handleGoodData = this.data.handleGoodData
      const index = e.target.dataset.currentidx
      handleGoodData[index].isAddSGoptions = !handleGoodData[index].isAddSGoptions
      this.setData({
        handleGoodData
      })
    },
    checkSGoptions(){
      let that = this
      this.setData({
        ischeckBGOptions:false,
        ischeckSGOptions:!that.data.ischeckSGOptions,
      })
    },
    chooseSGoptions(e){
      let that = this 
      var chooedAsti = this.data.chooedAsti
      chooedAsti.id = e.target.dataset.astigmatism.astigmatism_id
      chooedAsti.val = e.target.dataset.astigmatism.astigmatism
      this.setData({
        ischeckBGOptions:false,
        ischeckSGOptions:!that.data.ischeckSGOptions,
        chooedAsti
      })
    },
    chooseAddGoodBG(e){
      let handleGoodData = this.data.handleGoodData
      let sphSelectOptions = this.data.sphSelectOptions
      const sph_id = e.target.dataset.sphid
      const idx = e.target.dataset.currentidx
      handleGoodData[idx].sph_id = sph_id
      for(var i=0;i<sphSelectOptions.length;i++){
        if(sphSelectOptions[i].sph_id == sph_id){
          handleGoodData[idx].sph = sphSelectOptions[i].sph
          handleGoodData[idx].isAddBGoptions = false
        }
      }
      this.setData({
        handleGoodData
      })
    },
    chooseAddGoodSG(e){
      let handleGoodData = this.data.handleGoodData
      let astigmatismSelectOptions = this.data.astigmatismSelectOptions
      const astigmatism_id = e.target.dataset.astigmatismid
      const idx = e.target.dataset.currentidx
      handleGoodData[idx].astigmatism_id = astigmatism_id
      for(var i=0;i<astigmatismSelectOptions.length;i++){
        if(astigmatismSelectOptions[i].astigmatism_id == astigmatism_id){
          handleGoodData[idx].astigmatism = astigmatismSelectOptions[i].astigmatism
          handleGoodData[idx].isAddSGoptions = false
        }
      }
      this.setData({
        handleGoodData
      })
    },
    recordAddGoodInventory(e){
      const val = e.detail.value
      const index = e.target.dataset.currentidx
      let handleGoodData = this.data.handleGoodData
      handleGoodData[index].good_inventory = val
      this.setData({
        handleGoodData
      })
    },
    deleteCurrentAddFood(e){
      const idx = e.target.dataset.currentidx
      let handleGoodData = this.data.handleGoodData
      handleGoodData.splice(idx,1)
      console.log(handleGoodData)
      this.setData({
        handleGoodData
      })
    },
    addMoreHandleFood(){
      let handleGoodData = this.data.handleGoodData
      if(handleGoodData.length >= 10){
        return false
      }
      handleGoodData.push({
        sph_id:'',sph:'',astigmatism:'',astigmatism_id:'',good_inventory:0,isAddBGoptions:false,isAddSGoptions:false
      })
      this.setData({
        handleGoodData
      })
    },
    subHandleAddGood(){
      const handleGoodData = this.data.handleGoodData
      for(var i=0;i<handleGoodData.length;i++){
        handleGoodData[i].commodity_id = this.data.currentCommodityId
      }
      let base = new Base()
      let that = this
      wx.showLoading({
        title:'加载中'
      })
      base.request({
        url:'Good/new_good',
        data:{
          new_goods:handleGoodData,
          savingtoken:wx.getStorageSync('savingtoken')
        }
      },function(res){
        if(res.data.status == 1){
          wx.hideLoading()
          wx.showToast({
            title: '增加成功',
            icon: 'success',
            duration: 1500
          })
          that.loadCommodityDetailData(that.data.currentCommodityId)
          that.loadSphAndAstigmatism()
          that.setData({
            isHandleGood:false
          })
        }else{
          wx.showModal({
            title:'失败提示',
            content:"增加失败,请重试!",
            confirmText: "确定",
            success:function(res){
            }
          })
        }
      })
    },
    closeCommidityDetail(){
      this.loadCommodityData()
      this.setData({
        isCommodityDetail:false
      })
    },
    chooseClientPower(){
      let base = new Base()
      let that = this 
      console.log(111111)
      base.request({
        url:"Client/get_client"
      },function(res){
        let tempClientInfo = res.data.client_data.data
        const special_client = that.data.modifyGoodForm.special_client
        console.log('power1:',tempClientInfo)
        if(special_client){
          for(var i=0;i<tempClientInfo.length;i++){
            if(special_client.some(val=>{return val==tempClientInfo[i].client_id})){
              tempClientInfo[i].isSelect = true
            }else{
              tempClientInfo[i].isSelect = false
            }
          }
        }
        console.log('power2:',tempClientInfo)
        that.setData({
          tempClientInfo,
          rawClientInfo:tempClientInfo,
          isPowerClientInfo:true
        })
      })
    },
    closePowerClientInfo(){
      this.setData({
        isPowerClientInfo:false
      })
    },
    selectCurrentPower(e){
      const index = e.target.dataset.index
      const clientid = e.target.dataset.clientid
      const modifyGoodForm = this.data.modifyGoodForm
      let tempClientInfo = this.data.tempClientInfo
      tempClientInfo[index].isSelect = !tempClientInfo[index].isSelect
      if(tempClientInfo[index].isSelect){
        modifyGoodForm.special_client.push(clientid)
      }else{
        const len = modifyGoodForm.special_client.length
        for(var i=0;i<len;i++){
          if(modifyGoodForm.special_client[i] == clientid){
            modifyGoodForm.special_client.splice(i,1)
            break
          }
        }
      }
      console.log(modifyGoodForm)
      this.setData({
        tempClientInfo,
        modifyGoodForm
      })
    },
    filterAllData(e){
      const search_type = e.detail.value
      if(search_type==''){
        this.loadCommodityData()
      }else{
        let data ={
          search_type
        }
        this.loadCommodityData(data,'Commodity/search_commodity')
      }
    },
    filterDetailData(e){
      const search_type = e.detail.value
      if(search_type==''){
        this.loadCommodityData()
      }else{
        let data ={
          search_type
        }
        this.loadCommodityData(data,'Commodity/search_commodity')
      }
    },
    getCloseAddGoodWindow(){
      this.loadCommodityData
      this.setData({
        isShowAddGood:false
      })
      this.loadCommodityData()
    },
    addSphBox(){
      console.log(11111)
      this.setData({
        isAddSphBox:true
      })
    },
    closeAddSph(){
      this.setData({
        isAddSphBox:false
      })
    },
    addAstiBox(){
      console.log(22222)
      this.setData({
        isAddAstiBox:true
      })
    },
    closeAddAsti(){
      this.setData({
        isAddAstiBox:false
      })
    },
    inputSph(e){
      const val = e.detail.value
      this.setData({
        inputSph:val
      })
    },
    inputAsti(e){
      const val = e.detail.value
      this.setData({
        inputAsti:val
      })
    },
    addSph(){
      const new_sph = this.data.inputSph
      let base = new Base()
      let that = this
      base.request({
        url:'Good/new_sph',
        data:{
          savingtoken:wx.getStorageSync('savingtoken'),
          commodity_id:that.data.currentCommodityId,
          new_sph
        }
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title:'新增成功',
            icon:'success',
            duration:1000
          })
          let base2 = new Base()
          base2.request({
            url:'Good/new_get_sph_and_astigmatism',
            data:{
              commodity_id:that.data.currentCommodityId
            }
          },function(v){
            console.log(v)
            that.setData({
              sphSelectOptions:v.data.sph_data,
              astigmatismSelectOptions:v.data.astigmatism_data,
              isAddSphBox:false
            })
          })
        }else{
          wx.showModal({
            title:'失败提示',
            content:"新增失败,请重试!",
            confirmText: "确定",
            success:function(res){
            }
          })
        }
      })
    },
    delSph(){
      const sph_id = this.data.chooedSph.id
      if(sph_id=='')return false
      let base = new Base()
      let that = this
      wx.showModal({
        title:'提示',
        content:"确认删除选中球镜?",
        showCancel:true,
        confirmText: "确认",
        success:function(res){
        base.request({
          url:'Good/del_sph',
          data:{
            savingtoken:wx.getStorageSync('savingtoken'),
            sph_id
          }
        },function(res){
          if(res.data.status == 1){
            wx.showToast({
              title:'删除成功',
              icon:'success',
              duration:1000
            })
            var newData = that.data.chooedSph
            newData = {id:'',val:''}
            that.setData({
              chooedSph:newData
            })
            let base2 = new Base()
            base2.request({
              url:'Good/new_get_sph_and_astigmatism',
              data:{
                commodity_id:that.data.currentCommodityId
              }
            },function(v){
              console.log(v)
              that.setData({
                sphSelectOptions:v.data.sph_data,
                astigmatismSelectOptions:v.data.astigmatism_data,
                isAddSphBox:false
              })
            })
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
    addAsti(){
      const new_astigmatism = this.data.inputAsti
      let base = new Base()
      let that = this
      base.request({
        url:'Good/new_astigmatism',
        data:{
          savingtoken:wx.getStorageSync('savingtoken'),
          commodity_id:that.data.currentCommodityId,
          new_astigmatism
        }
      },function(res){
        if(res.data.status == 1){
          wx.showToast({
            title:'新增成功',
            icon:'success',
            duration:1200
          })
          let base2 = new Base()
          base2.request({
            url:'Good/new_get_sph_and_astigmatism',
            data:{
              commodity_id:that.data.currentCommodityId
            }
          },function(v){
            console.log(v)
            that.setData({
              sphSelectOptions:v.data.sph_data,
              astigmatismSelectOptions:v.data.astigmatism_data,
              isAddAstiBox:false
            })
          })
        }else{
          wx.showModal({
            title:'失败提示',
            content:"新增失败,请重试!",
            confirmText: "确定",
            success:function(res){
            }
          })
        }
      })
    },
    
    delAsti(){
      const astigmatism_id = this.data.chooedAsti.id
      if(astigmatism_id=='')return false
      let base = new Base()
      let that = this
      wx.showModal({
        title:'提示',
        content:"确认删除散光?",
        showCancel:true,
        confirmText: "确认",
        success:function(res){
        base.request({
          url:'Good/del_astigmatism',
          data:{
            savingtoken:wx.getStorageSync('savingtoken'),
            astigmatism_id
          }
        },function(res){
          if(res.data.status == 1){
            wx.showToast({
              title:'删除成功',
              icon:'success',
              duration:1000
            })
            var newData = that.data.chooedAsti
            newData = {id:'',val:''}
            that.setData({
              chooedAsti:newData
            })
            let base2 = new Base()
            base2.request({
              url:'Good/new_get_sph_and_astigmatism',
              data:{
                commodity_id:that.data.currentCommodityId
              }
            },function(v){
              console.log(v)
              that.setData({
                sphSelectOptions:v.data.sph_data,
                astigmatismSelectOptions:v.data.astigmatism_data,
                isAddSphBox:false
              })
            })
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
    }
  },
  created:function(options){
    this.loadCommodityData()
  },
  ready: function (options){
    this.addGood = this.selectComponent('#addGood')
  }
})
