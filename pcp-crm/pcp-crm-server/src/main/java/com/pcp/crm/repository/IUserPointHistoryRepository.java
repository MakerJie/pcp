package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.UserPointHistoryEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ArIrelia on 2017/7/11.
 */
@Repository("userPointHistoryRepository")
public interface IUserPointHistoryRepository extends ICommonRepository<UserPointHistoryEntity,String> {
}
