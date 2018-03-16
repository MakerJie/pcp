package com.pcp.common;

import com.pcp.common.exception.BreezeeException;

/**
 * 可被锁的对象信息
 * Created by Silence on 2017/7/17.
 */
public interface ILockInfo  {

    void lock() throws BreezeeException;

    void unLock();

    void setLocked(Boolean locked);

    Boolean getLocked();

    void setKey(String nodeKey);

    String getKey();

    Long getLastUpdated();

    void setLastUpdated(Long lastUpdated);
}
