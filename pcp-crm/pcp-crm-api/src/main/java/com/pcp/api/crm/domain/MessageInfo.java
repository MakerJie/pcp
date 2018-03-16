package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ning on 2017/8/7.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MessageInfo extends BaseInfo {

    protected String userName, viewType, viewRemark, result, degreeRemark, image, userOpenId;
    protected String degree;
    protected String mobile, cardNo, email, city, shopName;

    public SmsInfo[] smsInfo() {
        if (this.getStatus() == 2 && StringUtils.hasText(this.getUserOpenId())) {
            //需要发送的短信息
            SmsInfo smsInfo = new SmsInfo();
            smsInfo.setType("messageReply");
            smsInfo.setSendMethod("wechat");
            smsInfo.setName(this.getUserOpenId());
            Map<String, Object> m = new HashMap<>();
            Map<String, Object> m1 = new HashMap<>();
            m1.put("value", "您好，您的服务单" + this.getCode() + "有新的客服回复。");
            m1.put("color", "#173177");
            m.put("serviceInfo", m1);

            Map<String, Object> m2 = new HashMap<>();
            m2.put("value", this.viewType);
            m2.put("color", "#173177");
            m.put("serviceType", m2);

            Map<String, Object> m3 = new HashMap<>();
            m3.put("value", "已回复");
            m3.put("color", "#173177");
            m.put("serviceStatus", m3);

            Map<String, Object> m4 = new HashMap<>();
            m4.put("value", BreezeeUtils.DATE_FORMAT_LONG.format(this.getCreateTime()));
            m4.put("color", "#173177");
            m.put("time", m4);

            Map<String, Object> m5 = new HashMap<>();
            m5.put("value", "请点击详情直接查看处理结果");
            m5.put("color", "#173177");
            m.put("remark", m5);

            smsInfo.setDetailUrl("wechat/messageDetail?id=" + this.getId() + "&openId=" + this.getUserOpenId());
            smsInfo.setSendMessage(BreezeeUtils.json2string(m));
            return new SmsInfo[]{smsInfo};
        }
        return new SmsInfo[0];
    }
}
