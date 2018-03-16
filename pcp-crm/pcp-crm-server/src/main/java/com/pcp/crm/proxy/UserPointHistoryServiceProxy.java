package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.UserPointHistoryInfo;
import com.pcp.api.crm.service.IUserPointHistoryService;
import com.pcp.api.crm.service.IUserService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/10/11
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_USER_POINT_HISTORY_SERVICE)
public class UserPointHistoryServiceProxy implements IUserPointHistoryService, IProxyLayer {

    @Resource(name = CrmAPI.BEAN_USER_POINT_HISTORY_SERVICE)
    private IUserPointHistoryService target;

    @Override
    public InfoPage<UserPointHistoryInfo> findPointHistory(@RequestBody UserPointHistoryInfo userPointHistoryInfo) {
        return target.findPointHistory(userPointHistoryInfo);
    }

    @Override
    public List<UserPointHistoryInfo> findPointHistoryList(@RequestBody UserPointHistoryInfo userPointHistoryInfo) {
        return target.findPointHistoryList(userPointHistoryInfo);
    }

    @Override
    public UserPointHistoryInfo savePointHistory(@RequestBody UserPointHistoryInfo userPointHistoryInfo) {
        return target.savePointHistory(userPointHistoryInfo);
    }

    @Override
    public UserPointHistoryInfo findPointHistoryById(@PathVariable("id") String id) {
        return target.findPointHistoryById(id);
    }
}
