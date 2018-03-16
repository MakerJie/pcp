package com.pcp.crm.impl;

import com.pcp.api.crm.domain.SmsInfo;
import com.pcp.api.crm.service.ISendMessage;
import javafx.util.Callback;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 短信发送实现类
 * 组合者设计模式
 * Created by Silence on 2017/11/8.
 */
@Service("sendMessage")
public class SendMessageImpl implements ISendMessage {

    private List<ISendMessage> gateways = new ArrayList<>();

    @Override
    public void sendMessage(SmsInfo smsInfo, Callback<SmsInfo, Object> cb) throws Exception {
        if (gateways != null) {
            gateways.forEach(a -> {
                if (a.enable()) {
                    if (smsInfo.getSendMethod() == null || smsInfo.getSendMethod().equals(a.getName())) {
                        try {
                            a.sendMessage(smsInfo, cb);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            });
        }
    }

    @Override
    public boolean enable() {
        return false;
    }

    public List<ISendMessage> getGateways() {
        return gateways;
    }

    public void setGateways(List<ISendMessage> gateways) {
        this.gateways = gateways;
    }
}
