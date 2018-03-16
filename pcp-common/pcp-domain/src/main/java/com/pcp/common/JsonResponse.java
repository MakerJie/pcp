/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common;

import com.pcp.common.exception.BreezeeException;

import java.util.Collection;

/**
 * 返回给页面调用的json
 *
 * @author Zhong, An-Jing
 */
public final class JsonResponse implements Response {

    private Integer retcode = 0;

    private long total = 1;

    private boolean success = true;

    private String msg = "Success";

    /**
     * 返回列表时，使用此
     */
    private Collection<?> rows;

    /**
     * 返回单个字段时候，使用此
     */
    private Object value;

    /**
     * 开始时间
     */
    private long start;

    /**
     * 结束时间
     */
    private long end;

    private long slipTime;

    private JsonResponse(long total, boolean success, Collection<?> rows) {
        this(total, success, rows, -1);
    }

    private JsonResponse(long total, boolean success, Collection<?> rows, long slipTime) {
        this.total = total;
        this.success = success;
        this.rows = rows;
        this.slipTime = slipTime;
    }

    private JsonResponse(boolean success, Object value) {
        this(success, value, -1);
    }

    private JsonResponse(boolean success, Object value, long slipTime) {
        this.success = success;
        this.value = value;
        this.slipTime = slipTime;
    }

    public static JsonResponse build(Collection values, long start) {
        return new JsonResponse(values.size(), true, values, start);
    }

    public static JsonResponse build(Collection values) {
        return new JsonResponse(values.size(), true, values);
    }

    public static JsonResponse build(long total, Collection values) {
        return new JsonResponse(total, true, values);
    }

    public static JsonResponse build(long total, Collection values, long slipTime) {
        return new JsonResponse(total, true, values, slipTime);
    }

    public static JsonResponse buildSingle(Object obj) {
        return new JsonResponse(true, obj);
    }

    public static JsonResponse buildSingle(Object obj, long slipTime) {
        return new JsonResponse(true, obj, slipTime);
    }

    @SuppressWarnings("unchecked")
    public static JsonResponse build(InfoPage infoPage, long slipTime) {
        return new JsonResponse(infoPage.getTotal(), true, infoPage.getContent(), slipTime);
    }

    @SuppressWarnings("unchecked")
    public static JsonResponse build(InfoPage infoPage) {
        return new JsonResponse(infoPage.getTotal(), true, infoPage.getContent(), -1);
    }

    public static JsonResponse ok() {
        return new JsonResponse(true, null);
    }

    public static JsonResponse error(String error) {
        return new JsonResponse(false, null).buildMsg(error);
    }

    public static JsonResponse error(BreezeeException ex) {
        return new JsonResponse(false, null).buildMsg(ex.getMessage()).buildCode(ex.getCode());
    }


    public JsonResponse buildMsg(String msg) {
        this.msg = msg;
        return this;
    }

    public JsonResponse buildCode(Integer code) {
        this.retcode = code;
        return this;
    }

    public void clear() {
        this.success = true;
        msg = "操作成功.";
        this.total = 0;
        this.rows.clear();
        this.value = null;
    }

    public long getTotal() {
        return total;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMsg() {
        return msg;
    }

    public Collection<?> getRows() {
        return rows;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public long getStart() {
        return start;
    }

    public long getEnd() {
        return end;
    }

    public long getSlipTime() {
        return this.slipTime;
    }

    public Integer getRetcode() {
        return retcode;
    }

    public void setRetcode(Integer retcode) {
        this.retcode = retcode;
    }
}
