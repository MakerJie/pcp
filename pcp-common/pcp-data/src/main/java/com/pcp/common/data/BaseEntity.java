/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.data;

import com.pcp.common.IPersistObject;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.InfoStatusEnum;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.exception.*;
import com.pcp.common.exception.EntityNotFoundException;
import com.pcp.common.exception.PersistenceException;
import com.pcp.common.util.BeanUtil;
import com.pcp.common.util.BreezeeCall;
import com.pcp.common.util.ContextUtil;
import org.hibernate.annotations.GenericGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/**
 * * 持久实体域：基类
 * 子类方法，继承了父类上的方法，同时也会继承方法上的注解
 * 我们不在这里使用注解创建公共字段是因为我希望每个表的ID,Name有其自己的column定义
 * Created by Silence on 2016/5/5.
 */
@MappedSuperclass
public class BaseEntity<T extends BaseInfo> implements IPersistObject, Serializable {

    protected final static Logger LOGGER = LoggerFactory.getLogger(BaseEntity.class);

    /**
     * 数据主键
     */
    @Id
    @GeneratedValue(generator = "assigned-uid")
    @GenericGenerator(name = "assigned-uid", strategy = "assigned")
    @Column(name = "PK_ID", unique = true, nullable = false, updatable = false, length = 64)
    protected String id;

    /**
     * 兼容当前的架构，由于在类似dubbo的分布式体系中，存在了重试机制，导致了在一个节点伪错误（显示错误，实际成功）时
     * 同一条记录会被保存2遍的情况，我们决定主键由前端传过来的机制，这样由数据库来控制，同一条记录不会被保存2遍
     */
    @Transient
    protected String uid;

    /**
     * 业务主键
     */
    @Column(name = "CODE", nullable = false, updatable = false, length = 64)
    protected String code;

    /**
     * 名称
     */
    @Column(name = "NAME", nullable = false, length = 1024)
    protected String name;

    /**
     * 状态
     */
    protected Integer status = InfoStatusEnum.ENABLE.getValue();

    /**
     * 描述或者备注信息
     */
    @Column(name = "REMARK", length = 3000)
    protected String remark;

    /**
     * 创建人
     */
    @CreatedBy
    @Column(name = "CREATOR", nullable = false, updatable = false)
    protected String creator;

    /**
     * 创建时间
     */
    @CreatedDate
    @Column(name = "CREATE_TIME", nullable = false, updatable = false)
    protected Date createTime;

    /**
     * 更新人
     */
    @LastModifiedBy
    @Column(name = "UPDATOR", nullable = false)
    protected String updator;

    /**
     * 更新时间
     */
    @LastModifiedDate
    @Column(name = "UPDATE_TIME", nullable = false)
    protected Date updateTime;

    /**
     * 租户ID
     */
    protected String tenantId = "default";

    /**
     * 语言
     */
    protected String language;

    /**
     * 在集群环境下
     * 是在哪个节点保存的
     */
    protected String node;

    /**
     * 每张表，确保此值被写入
     * 行数，一般用来做排序的
     * 在存入缓存的时候，也可以用来做分页查询
     * 所以我们在保存对象的时候，一定要保证此值的正确性。
     */
    @Column(name = "ROW_NUM", nullable = false)
    protected Long rowNum = 0L;

    /**
     * 版本，用来实现乐观锁
     */
    protected Integer version = 0;

    /**
     * 终端设备
     * 一般用来说明此次提交发生在什么类型的设备上
     * desktop: 1,
     * pad: 3,
     * mobile: 5
     */
    protected Integer equipment = 1;

    /**
     * 设备名称，用来标识是在什么设备上登录
     */
    protected String deviceName;

    @Transient
    Map<String, Object> properties = new HashMap<>();

    /**
     * 查询的强类型映射控制。
     * 在子类中实现
     *
     * @return 是否允许查询
     */
    protected void checkQuery() throws ValidationException {
        //在子类中，强制指定其查询条件。
        //1. 使查询条件强类型
        //2. 安全控制
        //在后期进行优化。我们需要达到的目的就是进行查询条件的强类型控制
//        try {
//            //将info上的属性和properties进行合并，从而进行查询。并且以对象上的属性值优先
//            this.properties.putAll(BeanUtil.objectToMap(this));
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        this.addProperties("id", this.getId());
        this.addProperties("code", this.getCode());
        this.addProperties("name", this.getName());
    }

    public void addProperties(String key, Object value) {
        if (!StringUtils.isEmpty(value)) {
            this.properties.put(key, value);
        }
    }

    protected void validate() throws ValidationException {
        //在保存的时候，对属性值进行校验。
        //各子类可以予以个性化实现
    }

    /**
     * 建立实体和Info的映射关系
     *
     * @return Info对象
     */
    protected T createInfo() {
        //在后续，可以通过这个来做实体的权限控制
        //例如在配置文件中配置相应的实体等等
        LOGGER.warn(this.getClass().getName() + " has no my info.");
        return null;
    }

    public T buildInfo(T t) {
        BeanUtil.beanCopy(this, t);
        //应该在子类中被继承
        return t;
    }

    public T buildInfo() {
        T t = createInfo();
        //应该在子类中被继承
        return buildInfo(t);
    }

    /**
     * 初始化实体对象
     * TODO:应该改成静态方法的调用，不适合作为对象方法
     *
     * @param r         页面对象
     * @param ignorePro 忽略的属性
     * @param <R>       实体类型
     * @return 生成的实体
     */
    @SuppressWarnings("unchecked")
    public <R extends BaseEntity> R createWithInfo(T r, String... ignorePro) {
        if (r.getOperType() == OperTypeEnum.WRITE) {
            R o = null;
            if (r.getProperties().get("createUpdate") == null
                    || "true".equals(r.getProperties().get("createUpdate").toString())) {
                try {
                    o = this.buildId(r.getId()).buildCode(r.getCode()).findEntity();
                } catch (Exception ignored) {
                }
            }
            if (r.getNode() == null) {
                r.setNode(SystemTool.getHostName());
            }
            r.setUpdateTime(new Date());
            r.setDataStatus(0);
            if (r.getUpdator() == null) {
                r.setUpdator("unknown");
            }
            if (o == null) {
                o = (R) this;
                if (StringUtils.isEmpty(r.getId())) {
                    if (r.getUid() != null && r.getUid().trim().length() > 0) {
                        r.setId(r.getUid().replaceAll(",", "").replaceAll("-", ""));
                    } else {
                        r.setId(SystemTool.uuid().replaceAll("-", ""));
                    }
                }
                r.setDataStatus(1);
                r.setCreateTime(r.getUpdateTime());
                if (r.getCreator() == null) {
                    r.setCreator("unknown");
                }
            }
            BeanUtil.beanCopy(r, o, ignorePro);
            if (r.getProperties() != null) {
                o.properties = r.getProperties();
            }
            return o;
        }
        if (r.getOperType() == OperTypeEnum.UPDATE) {
            if (r.getNode() == null) {
                r.setNode(SystemTool.getHostName());
            }
            r.setUpdateTime(new Date());
            if (r.getUpdator() == null) {
                r.setUpdator("unknown");
            }
        }
        BeanUtil.beanCopy(r, this, ignorePro);
        if (r.getProperties() != null) {
            this.properties = r.getProperties();
        }
        return (R) this;
    }

    public BaseEntity<T> buildCode(String code) {
        this.setCode(code);
        return this;
    }

    public BaseEntity<T> buildId(String id) {
        this.setId(id);
        return this;
    }

    /**
     * 持久化方法的Bean名称
     *
     * @return Bean名称
     */
    public String tableRepository() {
        //请在子类中继承此方法
        String name = this.getClass().getSimpleName();
        name = name.replaceAll("Entity", "Repository");
        name = SystemTool.captureName(name);
        return name;
    }

    /**
     * 获取持久化层
     *
     * @return 持久化对象
     */
    public ICommonRepository myRepository() throws NotSupportedException {
        if (tableRepository() == null) {
            throw new NotSupportedException("持久化服务为配置，不支持数据库操作");
        }
        return ContextUtil.getBean(tableRepository(), ICommonRepository.class);
    }

    @SuppressWarnings("unchecked")
    @Override
    public T save(BreezeeCall... callback) throws DomainException, NotSupportedException, AccessForbiddenException, PersistenceException {
        if (StringUtils.isEmpty(this.getId())) {
            //抛异常还是返回空值,一定要注意，在info的时候要设置operType=write
            throw new PersistenceException("Id不可为空");
        }
        if (callback != null && callback.length > 0) {
            for (BreezeeCall cb : callback) {
                cb.call(this, null);
            }
        }
        validate();
        myRepository().save(this);
        T t = createInfo();
        if (t != null) {
            t.setOperType(OperTypeEnum.WRITE);
            return this.buildInfo(t);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void delete(BreezeeCall... callback) {
        if (callback != null && callback.length > 0) {
            for (BreezeeCall cb : callback) {
                cb.call(this, null);
            }
        }
        Object o = findEntity();
        if (o != null) {
            myRepository().delete(o);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public T findOne(BreezeeCall... callback) throws NotSupportedException, EntityNotFoundException {
        //TODO: check access
        T t = createInfo();
        if (t == null) {
            throw new NotSupportedException("不支持此实体对象查询");
        }
        BaseEntity object = null;
        String remark = "没有ID或者Code";
        if (StringUtils.hasText(this.getId())) {
            object = (BaseEntity) myRepository().findOne(this.getId());
            remark = "ID:" + this.getId();
        }
        if (object == null && StringUtils.hasText(this.getCode())) {
            object = myRepository().findByCode(this.getCode());
            remark = "Code:" + this.getCode();
        }
        if (object == null) {
            object = otherFind();
        }
        if (object == null) {
            throw new EntityNotFoundException("无法找到对象" + this.getClass().getSimpleName() + "，以条件 " + remark);
        }
        object.buildInfo(t);
        if (callback != null && callback.length > 0) {
            for (BreezeeCall cb : callback) {
                cb.call(object, t);
            }
        }
        return t;
    }

    /**
     * 其他条件查询
     *
     * @return
     */
    protected BaseEntity otherFind() {
        //在子类中实现
        return null;
    }

    /**
     * 获取实体对象
     *
     * @param <R> 对象类型
     * @return 查询到的对象
     */
    @SuppressWarnings("unchecked")
    public <R extends BaseEntity> R findEntity() {
        R object = null;
        if (StringUtils.hasText(this.getId())) {
            object = (R) myRepository().findOne(this.getId());
        }
        if (object == null && StringUtils.hasText(this.getCode())) {
            object = (R) myRepository().findByCode(this.getCode());
        }
        return object;
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<T> list(BreezeeCall... callback) throws DomainException, NotSupportedException, ValidationException, AccessForbiddenException, PersistenceException {
        T t = createInfo();
        if (t == null) {
            throw new NotSupportedException("不支持此实体对象查询");
        }
        this.checkQuery();
        Sort sort = new Sort(Sort.Direction.DESC, "rowNum", "updateTime");
        if (this.getProperties().get("_sort") != null) {
            sort = (Sort) this.getProperties().get("_sort");
        }
        List<? extends BaseEntity> l;
        try {
            l = myRepository().findAll(DynamicSpecifications.createSpecification(this.getProperties()), sort);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("=============error query list condition=============");
            System.out.println(this.getProperties());
            System.out.println("==========error end============================");
            throw new PersistenceException(e.getMessage(), e.getCause());
        }
        return fillList(l, callback);
    }

    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<T> page(BreezeeCall... callback) throws DomainException, NotSupportedException, AccessForbiddenException, PersistenceException {
        T t = createInfo();
        if (t == null) {
            throw new NotSupportedException("不支持此实体对象查询");
        }
        this.checkQuery();
        PageInfo pageInfo = new PageInfo(this.getProperties());
        if (this.getProperties().get("_sort") != null) {
            pageInfo.setSort((Sort) this.getProperties().get("_sort"));
        } else {
            pageInfo.setSort(new Sort(Sort.Direction.DESC, "updateTime", "id"));
        }
        Page<? extends BaseEntity> page;
        try {
            page = myRepository().findAll(DynamicSpecifications.createSpecification(this.getProperties()), pageInfo);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("=============error query page condition=============");
            System.out.println(this.getProperties());
            System.out.println("==========error end============================");
            throw new PersistenceException(e.getMessage(), e.getCause());
        }
        return new InfoPage<>(fillList(page.getContent(), callback), page.getTotalElements());
    }

    /**
     * 数据填充
     *
     * @param l        查询出来的数据
     * @param callback 回调方法
     * @return 返回结果
     */
    @SuppressWarnings("unchecked")
    protected List<T> fillList(List<? extends BaseEntity> l, BreezeeCall... callback) {
        List<T> ret = new ArrayList<>();
        l.forEach(a -> {
            if (a != null) {
                T tt = createInfo();
                a.setProperties(this.getProperties());
                a.buildInfo(tt);
                ret.add(tt);
                if (callback != null && callback.length > 0) {
                    for (BreezeeCall cb : callback) {
                        if (cb != null)
                            cb.call(a, tt);
                    }
                }
            }
        });
        return ret;
    }

    /**
     * 计数
     *
     * @return
     */
    @SuppressWarnings("unchecked")
    public Long count() {
        this.checkQuery();
        return myRepository().count(DynamicSpecifications.createSpecification(this.getProperties()));
    }

    @Override
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    @Override
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdator() {
        return updator;
    }

    public void setUpdator(String updator) {
        this.updator = updator;
    }

    @Override
    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public Long getRowNum() {
        return rowNum;
    }

    public void setRowNum(Long rowNum) {
        this.rowNum = rowNum;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Integer getEquipment() {
        return equipment;
    }

    public void setEquipment(Integer equipment) {
        this.equipment = equipment;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    @Override
    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    @Override
    public String toString() {
        return id + "_" + code;
    }
}
