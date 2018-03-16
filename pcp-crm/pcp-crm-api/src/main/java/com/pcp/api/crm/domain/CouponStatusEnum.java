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
public enum CouponStatusEnum implements ConstantEnum {

    CREATED("待使用", 1),
    TOBE("待启用", 8),
    BANED("已禁用", 9),
    DELETED("已作废", 7),
    GAINED("已领取", 2),
    EXPIRE("已过期", 5),
    USED("已核销", 3), TRANSFER("已转增", 11);

    private final String text;

    private final Integer value;

    CouponStatusEnum(String text, Integer value) {
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

    public static String checkStatus(Integer v) {
        for (CouponStatusEnum anEnum : CouponStatusEnum.values()) {
            if (Objects.equals(anEnum.getValue(), v)) {
                return anEnum.getText();
            }
        }
        return "未知状态" + v;
    }

}
