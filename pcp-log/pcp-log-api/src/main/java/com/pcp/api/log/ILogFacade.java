package com.pcp.api.log;

import com.pcp.api.log.api.LoginLogInfo;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.api.TransferLogInfo;
import com.pcp.common.IFacadeLayer;
import com.pcp.common.Response;

import java.util.Map;

/**
 * 日志接口服务
 * Created by Ning on 2017/9/4.
 */
public interface ILogFacade extends IFacadeLayer {

    /**
     * 登陆日志保存
     * @param m content-->登陆信息
     * @return
     */
    Response saveLoginLog(Map<String,Object> m);

    /**
     * 登陆日志查询
     * @param loginLogInfo
     * @return
     */
    Response finLoginLogs(LoginLogInfo loginLogInfo);

    /**
     * 操作日志保存
     * @param m content-->登陆信息
     * @return
     */
    Response saveOperationLog(Map<String,Object> m);

    /**
     * 操作日志查询
     * @param info
     * @return
     */
    Response finOperationLogs(OperationLogInfo info);

    /**
     * 操作日志详情
     * @param id
     * @return
     */
    Response finOperationById(String id);

    /**
     * 接口日志保存
     * @param transferLogInfo
     * @return
     */
    Response saveTransferLog(TransferLogInfo transferLogInfo);

    /**
     * 接口日志查询
     * @param info
     * @return
     */
    Response finTransferLogs(TransferLogInfo info);

    /**
     * 接口日志查询
     * @param id
     * @return
     */
    Response finTransferLogById(String id);

}
