package com.pcp.log.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.log.entity.TransferLogEntity;
import org.springframework.stereotype.Repository;

/**
 * 接口日志
 * Created by Ning on 2017/9/5.
 */
@Repository("transferLogRepository")
public interface TransferLogRepository extends ICommonRepository<TransferLogEntity, String> {


}
