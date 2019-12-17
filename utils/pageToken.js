
import { Base } from './base.js'

export function saving_token(user_saving_pw,callback){
    return new Base().request({
        url:"Identity/identity_user_saving_pw",
        type:"POST",
        data:{
            user_saving_pw
        }
    },function(e){
        wx.setStorageSync('savingtoken', e.data.saving_token);
        callback && callback(e)
    })
}

export function master_token(user_master_pw,callback){
    return new Base().request({
        url:"Identity/identity_master_pw",
        type:"POST",
        data:{
            user_master_pw
        }
    },function(e){
        wx.setStorageSync('mastertoken', e.data.master_token);
        callback && callback(e)
    })
}

export function finance_token(user_finance_pw,callback){
    return new Base().request({
        url:"Identity/identity_user_finance_pw",
        type:"POST",
        data:{
            user_finance_pw
        }
    },function(e){
        wx.setStorageSync('financetoken', e.data.finance_token);
        callback && callback(e)
    })
}


export function user_manager_token(user_manager_pw,callback){
    return new Base().request({
        url:"Identity/identity_user_manager_pw",
        type:"POST",
        data:{
            user_manager_pw
        }
    },function(e){
        wx.setStorageSync('usermanagertoken', e.data.manager_token);
        callback && callback(e)
    })
}
