package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

/**
 * 短信发送的状态
 * Created by Silence on 2017/11/11.
 */
public enum SmsStatusEnum implements ConstantEnum {

    SUCCESS("发送成功", 2), TOSEND("待发送", 1), FAITURE("发送失败", 3);

    private final String text;

    private final Integer value;

    SmsStatusEnum(String text, Integer value) {
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
