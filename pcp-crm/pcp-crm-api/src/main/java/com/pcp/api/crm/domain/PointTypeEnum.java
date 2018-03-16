package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

/**
 * @author Wang, Junjie
 * @since on 2017/11/2
 */
public enum PointTypeEnum implements ConstantEnum {
    SIGNIN("签到积分", 1),
    CONSUME("消费积分",2),
    ACTIVITY("活动积分",3),
    AUTHORITY("权益积分",4),
    USEUP("消耗积分",5),
    OVERDUE("过期积分",6),
    COMPENSATE("补偿积分",7);


    private final String text;

    private final Integer value;

    PointTypeEnum(String text, Integer value) {
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

}
