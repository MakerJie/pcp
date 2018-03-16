package com.pcp.api.log;

/**
 * 日志服务的API列表
 * Created by Silence on 2017/9/4.
 */
public interface LogAPI {
    public final static String APPID = "pcpLog";
    public final static String BEAN_LOGINLOG_SERVICE="loginLogService";
    public final static String BEAN_OPERATIONLOG_SERVICE="operationLogService";
    public final static String BEAN_TRANSFERLOG_SERVICE="transferLogService";
    public final static String LOGINLOGSAVE="/saveLoginLog";
    public final static String FINDLOGINLOGS="/findLoginLogs";
}
