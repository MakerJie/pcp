package com.pcp.pos.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.pos.entity.RuleEntity;
import org.springframework.stereotype.Repository;

/**
 * 规则持久化服务
 * Created by Silence on 2017/7/9.
 */
@Repository("ruleRepository")
public interface IRuleRepository extends ICommonRepository<RuleEntity, String> {
}
