package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 自有优惠券信息
 * Created by Silence on 2017/7/4.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponInfo extends BaseInfo {

    protected String rule, userId, cardNo, mobile, userName, verifyAccount,
            sentCode, typeCode, fetchMethod, rightId, activeId, productId, transferUser, userOpenId, orderCode, shop;

    protected Date activeDate, expireDate, fetchDate, verifyDate, drawDate;

    protected Integer delFlag = 0, pointAmount;

    protected CouponTypeInfo couponType;

    protected Double amount, verifyAmount;

    @Override
    public String getStatusName() {
        //在子类中继承实现
        for (ConstantEnum e : CouponStatusEnum.values()) {
            if (Objects.equals(e.getValue(), status)) {
                return e.getText();
            }
        }
        return status + "";
    }

    public CouponInfo copy() {
        CouponInfo couponInfo = new CouponInfo();
        couponInfo.setCode(this.getCode());
        couponInfo.setActiveDate(this.getActiveDate());
        couponInfo.setExpireDate(this.getExpireDate());
        couponInfo.setStatus(this.getStatus());
        couponInfo.setName(this.getName());
        couponInfo.setTypeCode(this.getCouponType().getCode());
        couponInfo.setAmount(this.getAmount());
        couponInfo.setTenantId(null);
        couponInfo.setRowNum(null);
        couponInfo.setVersion(null);
        couponInfo.setOperType(null);
        couponInfo.setEquipment(null);
        couponInfo.setCardNo(this.getCardNo());
        couponInfo.setUserId(this.getUserId());
        return couponInfo;
    }

    public SmsInfo[] smsInfo() {
        if (StringUtils.hasText(this.getUserOpenId())) {
            //需要发送的短信息
            SmsInfo smsInfo = new SmsInfo();
            smsInfo.setType("couponFetch");
            smsInfo.setSendMethod("wechat");
            smsInfo.setName(this.getUserOpenId());
            Map<String, Object> m = new HashMap<>();

            Map<String, Object> m1 = new HashMap<>();
            m1.put("value", "您获得的" + this.getName() + "成功领取");
            m1.put("color", "#173177");
            m.put("first", m1);

            Map<String, Object> m2 = new HashMap<>();
            m2.put("value", this.getUserName());
            m2.put("color", "#173177");
            m.put("keyword1", m2);

            Map<String, Object> m3 = new HashMap<>();
            m3.put("value", this.getName());
            m3.put("color", "#173177");
            m.put("keyword2", m3);

            Map<String, Object> m4 = new HashMap<>();
            m4.put("value", BreezeeUtils.DATE_FORMAT_SHORT.format(this.getFetchDate()));
            m4.put("color", "#173177");
            m.put("keyword3", m4);

            Map<String, Object> m5 = new HashMap<>();
            m5.put("value", "请及时确认，如有问题及时联系。");
            m5.put("color", "#173177");
            m.put("remark", m5);
            smsInfo.setDetailUrl("wechat/couponDetail?id=" + this.getId() + "&openId=" + this.getUserOpenId());
            smsInfo.setSendMessage(BreezeeUtils.json2string(m));
            return new SmsInfo[]{smsInfo};
        }
        return new SmsInfo[0];
    }
}
