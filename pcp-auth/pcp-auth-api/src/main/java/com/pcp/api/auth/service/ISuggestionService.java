package com.pcp.api.auth.service;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.domain.SuggestionInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 意见与建议服务
 * Created by Silence on 2017/10/9.
 */
@FeignClient(value = AuthAPI.APPID, path = "/" + AuthAPI.BEAN_SUGGEST_SERVICE)
public interface ISuggestionService extends IServiceLayer {

    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.SUGGESTION)
    InfoPage<SuggestionInfo> findSuggests(@RequestBody SuggestionInfo suggestion);

    @RequestMapping(method = RequestMethod.GET, value = AuthAPI.SUGGESTION_ID)
    SuggestionInfo findSuggestById(@PathVariable("id") String id);

    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.SUGGESTION_SAVE)
    SuggestionInfo saveSuggest(@RequestBody SuggestionInfo suggestion);
}
