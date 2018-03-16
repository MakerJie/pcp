package com.pcp.api.log.service;

import com.pcp.api.log.LogAPI;
import com.pcp.api.log.api.TransferLogInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

/**
 * 接口日志
 * Created by Ning on 2017/9/5.
 */
@FeignClient(value = LogAPI.APPID, path = "/" + LogAPI.BEAN_TRANSFERLOG_SERVICE)
public interface ITransferLogService extends IServiceLayer {

    /**
     * 接口日志保存
     * @param httpRep
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/logSave/transferLog")
    void saveTransferLog(@RequestBody Map<String, Object> httpRep);

    /**
     * 接口日志查询
     * @param info
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST, value = "/logPage/transferLog")
    InfoPage<TransferLogInfo> findTransferLogs(@RequestBody TransferLogInfo info) throws BreezeeException;

    /**
     * 接口日志详情
     * @param id
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.GET, value = "/log/transferLog/{id}")
    TransferLogInfo findTransferLogById(@PathVariable("id") String id) throws BreezeeException;

}
