package com.pcp.api.log.service;

import com.pcp.api.log.LogAPI;
import com.pcp.api.log.api.LoginLogInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Wang, Junjie
 * @since on 2017/7/12
 */
@FeignClient(value = LogAPI.APPID, path = "/" + LogAPI.BEAN_LOGINLOG_SERVICE)
public interface ILoginLogService extends IServiceLayer {

    /**
     * 登录日志保存
     * @param loginLogInfo
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = LogAPI.LOGINLOGSAVE)
    LoginLogInfo saveLoginLog(@RequestBody LoginLogInfo loginLogInfo) throws BreezeeException;

    /**
     * 登陆日志查询
     * @param info
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST, value = LogAPI.FINDLOGINLOGS)
    InfoPage<LoginLogInfo> findLoginLogs(@RequestBody LoginLogInfo info) throws BreezeeException;
}
