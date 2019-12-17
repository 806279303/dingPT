import { Config } from './config.js'

// 交互请求
class Base{
    constructor(){
        this.baseUrl = Config.restUrl
    }

    request(params,callback){
        var that = this
        var url = this.baseUrl + params.url
        if(!params.type){
            params.type = 'GET'
        }
        //传参增加token
        if(!params.data){
            params.data = {}
        }
        wx.showLoading({
            title: '请稍后',
        })
        wx.request({
            url:url,
            data:params.data,
            method:params.type,
            header:{
                'content-type':'application/json',
                'token': wx.getStorageSync('token')
            },
            success:function(res){
                const result = res
                console.log(result)
                if(result.data.errorCode == 20000 || result.data.errorCode == 16000 ){
                    wx.clearStorage()
                    wx.showToast({
                        title:"身份失效",
                        icon:'error',
                        duration:1200
                    })
                    wx.navigateTo({
                        url: '../logs/logs',
                        success: function(res){
                            // success
                        },
                        fail: function() {
                            // fail
                        },
                        complete: function() {
                            // complete
                        }
                    })
                }
                callback && callback(result)
                // if(result.data.stauts == 0){
                //     //无法访问的时候
                //     wx.showToast({
                //         title: '获取数据失败',
                //         icon: 'success',
                //         duration: 1500
                //       })
                // }else if(result.data.stauts == 1){
                //     callback && callback(result)
                // }
            },
            fail:function(res){
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '网络出现了点小故障',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })
                wx.clearStorage()
                wx.navigateTo({
                    url: '../logs/logs',
                    success: function(res){
                        // success
                    },
                    fail: function() {
                        // fail
                    },
                    complete: function() {
                        // complete
                    }
                })
            },
            complete:function(res){
                wx.hideLoading()
            }
        })
    }

}

export { Base }