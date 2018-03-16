package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 会员积分流水
 * Created by Silence on 2017/7/3.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserPointHistoryInfo extends BaseInfo {

    public final static int EXPIRE_YEAR = 1;
    public final static int EXPIRE_DAY = 0;

    /**
     * name:消费等等
     */
    protected String userName, cardNo, mobile, userId, pointType, shopCode, period, productCode, payMethod,
            userOpenId, orderCode, relHis, aliCard;

    /**
     * remainAmount是指礼券兑换后的剩余积分
     * rightAmount,activiAmount: 权益获取的积分，一般用来指在此积分类型为消费积分的时候，其产生的权益与活动积分分别是多少
     */
    protected Integer amount, totalAmount, cardLevel, rightAmount, activiAmount, remainAmount;

    protected Date happenTime, endTime;

    protected BigDecimal orderAmount, payAmount;

    public void setHappenTime(Date time) {
        if (time != null) {
            this.happenTime = time;
            LocalDateTime ld = BreezeeUtils.date2LocalDateTime(this.getHappenTime());
            ld = ld.plusYears(EXPIRE_YEAR);
            //设置过期的时间
            ld = ld.plusDays(EXPIRE_DAY);
            ld = ld.withHour(23).withMinute(59).withSecond(59);
            this.setEndTime(BreezeeUtils.localDateTime2Date(ld));
        }
    }

    public String getLevelName() {
        if (StringUtils.isEmpty(cardLevel)) {
            return "-";
        }
        for (ConstantEnum e : LevelEnum.values()) {
            if (Objects.equals(e.getValue(), cardLevel)) {
                return e.getText();
            }
        }
        return cardLevel + "";
    }

    public String getPointTypeName() {
        if (StringUtils.isEmpty(pointType)) {
            return "-";
        }
        for (ConstantEnum m : PointTypeEnum.values()) {
            if (Objects.equals(m.getValue(), Integer.parseInt(pointType))) {
                return m.getText();
            }
        }
        return pointType + "";
    }

    public void addRightsPoint(Integer amount) {
        if (this.rightAmount == null) {
            this.rightAmount = 0;
        }
        this.rightAmount = this.rightAmount + amount;
    }

    public void addActiviPoint(Integer amount) {
        if (this.activiAmount == null) {
            this.activiAmount = 0;
        }
        this.activiAmount = this.activiAmount + amount;
    }

    public SmsInfo[] smsInfo() {
        List<SmsInfo> l = new ArrayList<>();
        if (StringUtils.hasText(this.getUserOpenId())) {
            //需要发送的短信息
            SmsInfo smsInfo = new SmsInfo();
            smsInfo.setType("pointChange");
            smsInfo.setSendMethod("wechat");
            smsInfo.setName(this.getUserOpenId());
            Map<String, Object> m = new HashMap<>();
            Map<String, Object> m1 = new HashMap<>();
            Map<String, Object> m2 = new HashMap<>();
            Map<String, Object> m3 = new HashMap<>();
            Map<String, Object> m4 = new HashMap<>();
            Map<String, Object> m5 = new HashMap<>();
            Map<String, Object> m6 = new HashMap<>();

            m1.put("value", "亲爱的" + this.userName + "，您的积分账户有新的变动，具体内容如下：");
            m2.put("value", BreezeeUtils.DATE_FORMAT_SHORT.format(this.happenTime == null ? new Date() : this.happenTime));
            m3.put("value", this.getAmount());
            m4.put("value", this.getRemark());
            m5.put("value", this.getTotalAmount());
            m6.put("value", "感谢您对Marzano的支持");
            m1.put("color", "#173177");
            m2.put("color", "#173177");
            m3.put("color", "#173177");
            m4.put("color", "#173177");
            m5.put("color", "#173177");
            m6.put("color", "#173177");

            m.put("first", m1);
            m.put("keyword1", m2);
            m.put("keyword2", m3);
            m.put("keyword3", m4);
            m.put("keyword4", m5);
            m.put("remark", m6);

            smsInfo.setSendMessage(BreezeeUtils.json2string(m));

            if ("2".equals(this.getPointType())) {
                SmsInfo sms = new SmsInfo();
                sms.setType("saleChange");
                sms.setSendMethod("wechat");
                sms.setName(this.getUserOpenId());
                Map<String, Object> mm = new HashMap<>();
                Map<String, Object> mm1 = new HashMap<>();
                Map<String, Object> mm2 = new HashMap<>();
                Map<String, Object> mm3 = new HashMap<>();
                Map<String, Object> mm4 = new HashMap<>();
                Map<String, Object> mm5 = new HashMap<>();
                Map<String, Object> mm6 = new HashMap<>();
                Map<String, Object> mm7 = new HashMap<>();

                mm1.put("value", BreezeeUtils.DATE_FORMAT_SHORT.format(this.happenTime == null ? new Date() : this.happenTime));
                mm2.put("value", this.getName());
                mm3.put("value", this.getPayAmount().setScale(2, BigDecimal.ROUND_HALF_DOWN));
                mm4.put("value", this.getPayMethod());
                mm5.put("value", this.getAmount());
                mm6.put("value", BreezeeUtils.DATE_FORMAT_LONG.format(this.happenTime == null ? new Date() : this.happenTime));
                mm7.put("value", "消费单号：" + this.getOrderCode());
                mm1.put("color", "#173177");
                mm2.put("color", "#173177");
                mm3.put("color", "#173177");
                mm4.put("color", "#173177");
                mm5.put("color", "#173177");
                mm6.put("color", "#173177");
                mm7.put("color", "#173177");

                mm.put("first", mm1);
                mm.put("keyword1", mm2);
                mm.put("keyword2", mm3);
                mm.put("keyword3", mm4);
                mm.put("keyword4", mm5);
                mm.put("keyword5", mm6);
                mm.put("remark", mm7);
                sms.setSendMessage(BreezeeUtils.json2string(mm));
                l.add(sms);
            }
            l.add(smsInfo);
        }
        if (StringUtils.hasText(this.getAliCard()) && this.getTotalAmount() != null) {
            SmsInfo sms = new SmsInfo();
            sms.setSendMethod("alipay");
            sms.setType("point");
            sms.setName(this.getAliCard());
            sms.setSendMessage(this.getTotalAmount().toString());
            l.add(sms);
        }
        SmsInfo[] ss = new SmsInfo[l.size()];
        return l.toArray(ss);
    }
}
