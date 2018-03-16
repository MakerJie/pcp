package com.pcp.api.crm.service;

import com.pcp.api.crm.domain.SmsInfo;
import javafx.util.Callback;

/**
 * 发送短信的接口
 * 我们可以使用组合模式来实现多种短信发送的方式
 * Created by Silence on 2017/11/8.
 */
public interface ISendMessage {

    void sendMessage(SmsInfo smsInfo, Callback<SmsInfo,Object> cb) throws Exception;

    boolean enable();

    default String getName(){
        return "all";
    }

}
