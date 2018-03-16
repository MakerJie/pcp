package com.pcp.log.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.log.entity.LoginLogEntity;
import org.springframework.stereotype.Repository;

/**
 * 日志服务的持久化类
 * @author Wang, Junjie
 * @since on 2017/7/12
 */

@Repository("loginLogRepository")
public interface ILoginLogRepository extends ICommonRepository<LoginLogEntity, String> {

}
