package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

/**
 * 等级变动的类型
 * Created by Silence on 2017/11/1.
 */
public enum GradeChangeEnum implements ConstantEnum {

    A("系统自动升级", 1), B("系统自动降级", 2), C("手动升级", 3), D("手动降级", 4), E("手动激活", 5), F("手动冻结", 6), G("系统保级", 7);

    private final String text;

    private final Integer value;

    GradeChangeEnum(String text, Integer value) {
        this.text = text;
        this.value = value;
    }

    @Override
    public Integer getValue() {
        return value;
    }

    @Override
    public String getText() {
        return text;
    }
}
