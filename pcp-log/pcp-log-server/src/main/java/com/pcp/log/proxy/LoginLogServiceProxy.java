package com.pcp.log.proxy;

import com.pcp.api.log.LogAPI;
import com.pcp.api.log.api.LoginLogInfo;
import com.pcp.api.log.service.ILoginLogService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 日志服务的代理
 * @author Wang, Junjie
 * @since on 2017/7/12
 */
@RestController
@RequestMapping("/" + LogAPI.BEAN_LOGINLOG_SERVICE)
public class LoginLogServiceProxy implements ILoginLogService, IProxyLayer {

    @Resource(name = LogAPI.BEAN_LOGINLOG_SERVICE)
    private ILoginLogService loginLogService;

    @Override
    public LoginLogInfo saveLoginLog(@RequestBody LoginLogInfo loginLogInfo) throws BreezeeException {
        return loginLogService.saveLoginLog(loginLogInfo);
    }

    @Override
    public InfoPage<LoginLogInfo> findLoginLogs(@RequestBody LoginLogInfo info) throws BreezeeException {
        return loginLogService.findLoginLogs(info);
    }
}
