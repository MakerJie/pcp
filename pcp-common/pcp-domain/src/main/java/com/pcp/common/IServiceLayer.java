/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common;

import com.pcp.common.domain.BaseInfo;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.exception.EntityNotFoundException;
import javafx.util.Callback;

import java.io.Serializable;
import java.util.List;

/**
 * 服务层高度抽象接口
 * 由于基于spring cloud 的框架，服务最终要被resource代理出去，
 * 所以这里，我们不做基类方法的填写
 * Created by Silence on 2016/4/15.
 */
public interface IServiceLayer {

    default Object sync(String rule, Object value) throws BreezeeException {
        //Nothing todo
        return null;
    }
}
