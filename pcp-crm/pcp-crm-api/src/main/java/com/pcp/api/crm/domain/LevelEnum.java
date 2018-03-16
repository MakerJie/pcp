/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

import java.util.Objects;

/**
 * 会员级别枚举
 * Created by Silence on 2016/4/28.
 */
public enum LevelEnum implements ConstantEnum {

    BLUE("蓝卡", 1),
    COLD("金卡",2),
    PLATINUM("铂金卡",3),
    BLACK("黑卡",4),
    STAFF("员工卡",5);

    private final String text;

    private final Integer value;

    LevelEnum(String text, Integer value) {
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

    public static String val2text(Integer value){
        for (ConstantEnum e : LevelEnum.values()) {
            if (Objects.equals(e.getValue(), value)) {
                return e.getText();
            }
        }
        return value+"";
    }
}
