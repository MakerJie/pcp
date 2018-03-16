package com.pcp.log.proxy;

import com.pcp.api.log.LogAPI;
import com.pcp.api.log.api.TransferLogInfo;
import com.pcp.api.log.service.ITransferLogService;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 接口日志
 * Created by Ning on 2017/9/5.
 */
@RestController
@RequestMapping("/" + LogAPI.BEAN_TRANSFERLOG_SERVICE)
public class TransferLogServiceProxy implements ITransferLogService {

    @Resource(name = LogAPI.BEAN_TRANSFERLOG_SERVICE)
    private ITransferLogService transferLogService;

    @Override
    public void saveTransferLog(@RequestBody Map<String, Object> httpRep) throws BreezeeException {
        new Thread(() -> transferLogService.saveTransferLog(httpRep)).start();
    }

    @Override
    public InfoPage<TransferLogInfo> findTransferLogs(@RequestBody TransferLogInfo info) throws BreezeeException {
        return transferLogService.findTransferLogs(info);
    }

    @Override
    public TransferLogInfo findTransferLogById(@PathVariable String id) throws BreezeeException {
        return transferLogService.findTransferLogById(id);
    }
}
