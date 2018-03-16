/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.exception;

/**
 * 不支持的异常信息
 * Created by Silence on 2016/6/3.
 */
public class NotSupportedException extends BreezeeException {

    public NotSupportedException(String message) {
        super(message);
    }

    public NotSupportedException(String message, Throwable cause) {
        super(message, cause);
    }
}
