import { Config } from 'config.js'

class Token{
    constructor(){
        this.tokenUrl = Config.restUrl + 'Login/get_token'
    }

    getToken(data,callback){
        var that = this
        wx.request({
            url:that.tokenUrl,
            method:'POST',
            data:data,
            success:function(res){
                const result = res.data
                if(result.status == 1){
                    if(result.identity == 'worker'){
                        wx.setStorageSync('token', res.data.token);
                        wx.setStorageSync('identity', res.data.identity);
                    }else{
                        
                    }
                } else if (result.status == 0){

                }else{
                    console.log("status不为0和1的未知错误")
                }
                callback && callback(result)
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
            }
        })
    }
}


export { Token }