package com.pcp.auth.proxy;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.domain.SuggestionInfo;
import com.pcp.api.auth.service.ISuggestionService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 意见与建议服务代理类
 * Created by Silence on 2017/10/9.
 */
@RestController
@RequestMapping("/" + AuthAPI.BEAN_SUGGEST_SERVICE)
public class SuggestionServiceProxy implements ISuggestionService, IServiceLayer {

    @Resource(name = AuthAPI.BEAN_SUGGEST_SERVICE)
    private ISuggestionService suggestionService;

    @Override
    public InfoPage<SuggestionInfo> findSuggests(@RequestBody SuggestionInfo suggestion) {
        return suggestionService.findSuggests(suggestion);
    }

    @Override
    public SuggestionInfo findSuggestById(@PathVariable("id") String id) {
        return suggestionService.findSuggestById(id);
    }

    @Override
    public SuggestionInfo saveSuggest(@RequestBody SuggestionInfo suggestion) {
        return suggestionService.saveSuggest(suggestion);
    }
}
