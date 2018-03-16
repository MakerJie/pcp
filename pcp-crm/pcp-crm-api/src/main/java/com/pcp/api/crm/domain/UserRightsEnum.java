package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

/**
 * 会员的权益枚举
 * Created by Silence on 2017/10/30.
 */
public enum UserRightsEnum implements ConstantEnum {
    A("新会员奖励", 1),
    B("会员完善信息", 2),
    C("会员生日奖励", 3),
    D("升级奖励", 4),
    E("首笔消费奖励", 5),
    F("生日月消费奖励", 6),
    G("周消费奖励", 7),
    H("常客优惠奖励", 8)
    ;

    UserRightsEnum(String text, Integer value) {
        this.text = text;
        this.value = value;
    }

    private final String text;

    private final Integer value;

    @Override
    public Integer getValue() {
        return value;
    }

    @Override
    public String getText() {
        return text;
    }
}
