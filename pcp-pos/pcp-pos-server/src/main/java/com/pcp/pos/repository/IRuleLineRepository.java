package com.pcp.pos.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.pos.entity.RuleLineEntity;
import org.springframework.stereotype.Repository;

/**
 * 规则行持久化服务
 * Created by Silence on 2017/7/9.
 */
@Repository("ruleLineRepository")
public interface IRuleLineRepository extends ICommonRepository<RuleLineEntity, String> {
}
