package com.pcp.auth.repository;

import com.pcp.auth.entity.AccountEntity;
import com.pcp.auth.entity.SuggestionEntity;
import com.pcp.common.data.ICommonRepository;
import org.springframework.stereotype.Repository;

/**
 * 意见与建议的持久化接口
 * Created by Silence on 2017/10/9.
 */
@Repository("suggestionRepository")
public interface ISuggestionRepository extends ICommonRepository<SuggestionEntity, String> {
}
