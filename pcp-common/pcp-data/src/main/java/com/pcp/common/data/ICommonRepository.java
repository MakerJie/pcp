/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 通用的数据库查询类
 * Just for DB
 * Created by Silence on 2016/5/31.
 */
@NoRepositoryBean
public interface ICommonRepository<T extends BaseEntity, ID extends String>
        extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

    T findByCode(String code);
}
