/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 分页对象
 * Created by Silence on 2016/4/15.
 */
public class InfoPage<T> implements Serializable {

    protected List<T> content;

    protected Long total;

    protected Map<String,Object> addValue;

    private InfoPage() {
    }

    public InfoPage(List<T> content, Long total) {
        this.content = content;
        this.total = total;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Map<String, Object> getAddValue() {
        return addValue;
    }

    public void setAddValue(Map<String, Object> addValue) {
        this.addValue = addValue;
    }
}
