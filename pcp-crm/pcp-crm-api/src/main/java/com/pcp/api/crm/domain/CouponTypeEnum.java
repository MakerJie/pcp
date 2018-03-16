package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

/**
 * 券类型枚举
 * Created by Silence on 2017/10/16.
 */
public enum CouponTypeEnum implements ConstantEnum {

    A("代金券", 2),
    B("兑换券", 3),
    C("买赠券", 4),
    D("满减券", 6),
    E("固定金额折扣券", 7),
    F("比例折扣券", 1),
    G("无规则券", 5);

    private final String text;

    private final Integer value;

    CouponTypeEnum(String text, Integer value) {
        this.text = text;
        this.value = value;
    }

    @Override
    public Integer getValue() {
        return this.value;
    }

    @Override
    public String getText() {
        return this.text;
    }

    @Override
    public String toString() {
        return this.getText();
    }
}
