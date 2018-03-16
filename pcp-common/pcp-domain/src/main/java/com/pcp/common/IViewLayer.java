package com.pcp.common;

/**
 * 视图展现
 * Created by Silence on 2017/6/21.
 */
public interface IViewLayer {

    /**
     * 视图名称
     * @return 默认类名称
     */
    default String getViewName(){
        return this.getClass().getName();
    }

    /**
     * 是否需权限认证
     * @return 无需认证
     */
    default Boolean isSecurity(){
        return false;
    }
}
