package com.pcp.common;

import com.pcp.common.domain.BaseInfo;
import com.pcp.common.exception.*;
import com.pcp.common.util.BreezeeCall;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 持久化对象
 * Created by Silence on 2016/10/16.
 */
public interface IPersistObject extends Serializable {

    /**
     * 数据主键
     *
     * @return 值，全局唯一。主键索引
     */
    String getId();

    /**
     * 业务主键
     *
     * @return 值，全局唯一。唯一键索引
     */
    String getCode();

    /**
     * 获取名称
     *
     * @return 值，支持国际化
     */
    String getName();

    /**
     * 获取更新时间
     *
     * @return 时间值
     */
    Date getUpdateTime();

    /**
     * 获取附加的属性
     *
     * @return 属性集合
     */
    Map<String, Object> getProperties();

    /**
     * 对象保存
     *
     * @param callback 回掉方法
     * @return 已经保存的对象
     * @throws NotSupportedException    不支持
     * @throws AccessForbiddenException 禁止此方法
     * @throws PersistenceException     持久化异常
     */
    <T extends BaseInfo> T save(BreezeeCall... callback) throws DomainException, NotSupportedException, ValidationException,AccessForbiddenException, PersistenceException;

    /**
     * 对象删除
     *
     * @param callback 回掉方法
     * @throws NotSupportedException    不支持
     * @throws AccessForbiddenException 禁止此方法
     * @throws PersistenceException     持久化异常
     */
    void delete(BreezeeCall... callback) throws DomainException, NotSupportedException, ValidationException,AccessForbiddenException, PersistenceException;

    /**
     * 对象查找
     *
     * @param callback 回掉方法
     * @return 查找到的对象
     * @throws NotSupportedException    不支持
     * @throws AccessForbiddenException 禁止此方法
     * @throws PersistenceException     持久化异常
     */
    <T extends BaseInfo> T findOne(BreezeeCall... callback) throws NotSupportedException,
            EntityNotFoundException;

    /**
     * 对象列表
     *
     * @param callback 回掉方法
     * @return 查找出来的对象
     * @throws NotSupportedException    不支持
     * @throws ValidationException      查询条件异常
     * @throws AccessForbiddenException 禁止此方法
     * @throws PersistenceException     持久化异常
     */
    <T extends BaseInfo> List<T> list(BreezeeCall... callback) throws DomainException, NotSupportedException, ValidationException,
            AccessForbiddenException, PersistenceException;

    /**
     * 对象分页
     *
     * @param callback 回掉方法
     * @return 查找出来的对象，带分页信息
     * @throws NotSupportedException    不支持
     * @throws ValidationException      查询条件异常
     * @throws AccessForbiddenException 禁止此方法
     * @throws PersistenceException     持久化异常
     */
    <T extends BaseInfo> InfoPage<T> page(BreezeeCall... callback) throws DomainException, NotSupportedException, ValidationException,
            AccessForbiddenException, PersistenceException;
}
