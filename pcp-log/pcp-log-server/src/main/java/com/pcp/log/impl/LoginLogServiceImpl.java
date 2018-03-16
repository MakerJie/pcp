package com.pcp.log.impl;

import com.pcp.api.log.api.LoginLogInfo;
import com.pcp.api.log.service.ILoginLogService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.log.entity.LoginLogEntity;
import org.springframework.stereotype.Service;

/**
 * 日志服务的实现类
 * @author Wang, Junjie
 * @since on 2017/7/12
 */
@Service("loginLogService")
public class LoginLogServiceImpl implements ILoginLogService, IServiceLayer {

    @Override
    public LoginLogInfo saveLoginLog(LoginLogInfo loginLogInfo) throws BreezeeException {
        loginLogInfo.setOperType(OperTypeEnum.WRITE);
        loginLogInfo.setCode(SystemTool.getCode());
        LoginLogEntity lle = new LoginLogEntity().createWithInfo(loginLogInfo);
        return lle.save();
    }

    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<LoginLogInfo> findLoginLogs(LoginLogInfo info) throws BreezeeException {
        BreezeeUtils.checkCreateTime(info.getProperties(), "createTime");
        return new LoginLogEntity().createWithInfo(info).page();
    }
}
