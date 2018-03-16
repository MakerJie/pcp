/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.util;

import com.pcp.common.exception.DomainException;

/**
 *系统的回调函数
 * Created by Silence on 2016/6/22.
 */
@FunctionalInterface
public interface BreezeeCall<E, R> {

    void call(E e, R r) throws DomainException;
}
