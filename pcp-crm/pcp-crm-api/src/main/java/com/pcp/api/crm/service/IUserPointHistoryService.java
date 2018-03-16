package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.UserPointHistoryInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/10/11
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_USER_POINT_HISTORY_SERVICE)
public interface IUserPointHistoryService extends IServiceLayer {

    @RequestMapping(method = RequestMethod.POST, value = "/pointHistory/page")
    InfoPage<UserPointHistoryInfo> findPointHistory(@RequestBody UserPointHistoryInfo userPointHistoryInfo);

    @RequestMapping(method = RequestMethod.POST, value = "/pointHistory/list")
    List<UserPointHistoryInfo> findPointHistoryList(@RequestBody UserPointHistoryInfo userPointHistoryInfo);

    @RequestMapping(method = RequestMethod.PUT, value ="/pointHistory/save")
    UserPointHistoryInfo savePointHistory(@RequestBody UserPointHistoryInfo userPointHistoryInfo);

    @RequestMapping(method = RequestMethod.GET, value = "/pointHistory/{id}")
    UserPointHistoryInfo findPointHistoryById(@PathVariable("id") String id);
}
