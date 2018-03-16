package com.pcp.export.dto;

import com.pcp.common.domain.BaseInfo;

import java.io.Serializable;

/**
 * 转出为Excel的dto基类
 * Created by Silence on 2017/9/3.
 */
public interface IExcelDTO extends Serializable {

    /**
     * 解析查询的内
     * @param info
     */
    IExcelDTO parseInfo(Object info);
}
