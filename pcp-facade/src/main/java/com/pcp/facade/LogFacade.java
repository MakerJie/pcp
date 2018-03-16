package com.pcp.facade;

import com.pcp.api.log.ILogFacade;
import com.pcp.api.log.api.LoginLogInfo;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.api.TransferLogInfo;
import com.pcp.api.log.service.ILoginLogService;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.api.log.service.ITransferLogService;
import com.pcp.common.*;
import com.pcp.common.exception.BreezeeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 日志接口服务
 * Created by Ning on 2017/9/4.
 */
@RestController
public class LogFacade implements ILogFacade, IResourceLayer {

    @Autowired
    private ILoginLogService loginLogService;

    @Autowired
    private IOperationLogService operationLogService;

    @Autowired
    private ITransferLogService transferLogService;

    @RequestMapping(value = "/log/saveLoginLog" ,method = RequestMethod.POST)
    @Override
    public JsonResponse saveLoginLog(@RequestBody Map<String,Object> m) {
        if(m.get("content")==null) {
            return JsonResponse.error("无登陆信息");
        }
        try {
            String info[] = m.get("content").toString().split("\\|");
            LoginLogInfo loginLogInfo = new LoginLogInfo();
            loginLogInfo.setResult(info[0]);
            // loginLogInfo.setUuid(info[1]);
            loginLogInfo.setName(info[2]);
            loginLogInfo.setMsg(info[3]);
            loginLogInfo.setRemoteHost(info[4]);
            loginLogInfo.setArea(info[5]);
            loginLogInfo.setAreaId(!info[6].equals("-") ? info[6].substring(0,2) : info[6]);
            loginLogInfo.setRegion(info[7]);
            loginLogInfo.setRegionId(!info[8].equals("-") ? info[8].substring(0,2) : info[8]);
            loginLogInfo.setCity(info[9]);
            loginLogInfo.setCityId(!info[10].equals("-") ? info[10].substring(0,2) : info[10]);
            loginLogInfo.setIsp(info[11]);
            loginLogInfo.setIspId(info[12]);
            loginLogService.saveLoginLog(loginLogInfo);
        } catch (BreezeeException e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @RequestMapping(value = "/log/findLoginLogs" ,method = RequestMethod.POST)
    @Override
    public Response finLoginLogs(@RequestBody LoginLogInfo loginLogInfo) {
        return JsonResponse.build(loginLogService.findLoginLogs(loginLogInfo));
    }

    @RequestMapping(value = "/log/saveOperation" ,method = RequestMethod.POST)
    @Override
    public Response saveOperationLog(@RequestBody Map<String, Object> m) {
        OperationLogInfo operationLogInfo = new OperationLogInfo();
        operationLogService.saveOperationLog(operationLogInfo);
        return null;
    }

    @RequestMapping(value = "/log/findOperation" ,method = RequestMethod.POST)
    @Override
    public Response finOperationLogs(@RequestBody OperationLogInfo info) {
        InfoPage<OperationLogInfo> infoPage = operationLogService.findOperationLogs(info);
        return JsonResponse.build(infoPage);
    }

    @RequestMapping(value = "/log/operationLog/{id}" ,method = RequestMethod.GET)
    @Override
    public Response finOperationById(@PathVariable("id") String id) {
        OperationLogInfo operationLogInfo = new OperationLogInfo();
        operationLogInfo.setId(id);
        InfoPage<OperationLogInfo> infoPage = operationLogService.findOperationLogs(operationLogInfo);
        if(infoPage.getContent()!=null){
            return JsonResponse.buildSingle(infoPage.getContent().get(0));
        }
        return JsonResponse.ok();
    }

    @RequestMapping(value = "/logSave/transferLog" ,method = RequestMethod.POST)
    @Override
    public Response saveTransferLog(@RequestBody TransferLogInfo transferLogInfo) {
        return JsonResponse.ok();
    }

    @RequestMapping(value = "/logPage/transferLog" ,method = RequestMethod.POST)
    @Override
    public Response finTransferLogs(@RequestBody TransferLogInfo info) {
        InfoPage<TransferLogInfo> infoInfoPage =  transferLogService.findTransferLogs(info);
        return JsonResponse.build(infoInfoPage);
    }

    @RequestMapping(value = "/log/transferLog/{id}" ,method = RequestMethod.GET)
    @Override
    public Response finTransferLogById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(transferLogService.findTransferLogById(id));
    }
}
