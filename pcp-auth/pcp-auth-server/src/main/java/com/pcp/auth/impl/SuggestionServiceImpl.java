package com.pcp.auth.impl;

import com.pcp.api.auth.domain.SuggestionInfo;
import com.pcp.api.auth.service.ISuggestionService;
import com.pcp.auth.entity.SuggestionEntity;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 意见与建议服务实现
 * Created by Silence on 2017/10/9.
 */
@Service("suggestionService")
public class SuggestionServiceImpl implements ISuggestionService, IServiceLayer {
    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<SuggestionInfo> findSuggests(SuggestionInfo suggestion) {
        return new SuggestionEntity().createWithInfo(suggestion).page();
    }

    @Override
    public SuggestionInfo findSuggestById(String id) {
        return new SuggestionEntity().buildCode(id).buildId(id).findOne();
    }

    @Override
    public SuggestionInfo saveSuggest(SuggestionInfo suggestion) {
        suggestion.setOperType(OperTypeEnum.WRITE);
        if (StringUtils.isEmpty(suggestion.getCode())) {
            suggestion.setCode(SystemTool.getCode());
        }
        return (SuggestionInfo) new SuggestionEntity().createWithInfo(suggestion).save();
    }
}
