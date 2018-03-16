/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.exception;

import com.pcp.common.constants.ConstantEnum;

/**
 * 系统基础异常类
 * //--实际开发中，我们没有对Exception进行了分类。这个需要改善
 * 供系统其他异常集成
 * Created by Silence on 2016/2/11.
 */
public class BreezeeException extends RuntimeException {

    protected Integer code;

    public BreezeeException(String message) {
        super(message);
    }

    public BreezeeException(String message, Integer code) {
        super(message);
        this.code = code;
    }

    public BreezeeException(ConstantEnum en) {
        super(en.getText());
        this.code = en.getValue();
    }

    public BreezeeException(String message, Throwable cause) {
        super(message, cause);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}
