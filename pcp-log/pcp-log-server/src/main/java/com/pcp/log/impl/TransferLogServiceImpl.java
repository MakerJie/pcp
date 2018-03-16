package com.pcp.log.impl;

import com.pcp.api.log.api.TransferLogInfo;
import com.pcp.api.log.service.ITransferLogService;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.log.entity.TransferLogEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * 操作日志
 * Created by Ning on 2017/9/5.
 */
@Service("transferLogService")
public class TransferLogServiceImpl implements ITransferLogService {


    @Override
    public void saveTransferLog(Map<String, Object> rep) {
        TransferLogInfo transferLogInfo = new TransferLogInfo();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                //TODO:解析rep
                try {
                    transferLogInfo.setTransferCode(rep.get("endpoint").toString());
                    if (!StringUtils.isEmpty(rep.get("errMsg"))) {
                        transferLogInfo.setErrMsg(rep.get("errMsg").toString());
                    }
                    transferLogInfo.setModule(rep.get("module").toString());
                    transferLogInfo.setSuccess(rep.get("success").toString().equals("true"));
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
                    transferLogInfo.setRqTime(sdf.parse(rep.get("rqTime").toString()));
                    if (!StringUtils.isEmpty(rep.get("bizId"))) {
                        transferLogInfo.setBizId(rep.get("bizId").toString());
                    }
                    transferLogInfo.setReturnTime(new Date());
                    transferLogInfo.setName(rep.get("userId").toString());
                    transferLogInfo.setTransferParam(rep.get("request").toString());
                    if (!StringUtils.isEmpty(rep.get("result"))) {
                        transferLogInfo.setResult(rep.get("result").toString());
                    }
                    transferLogInfo.setCode(SystemTool.getCode());
                    transferLogInfo.setType(rep.get("type").toString());
                    transferLogInfo.setOperType(OperTypeEnum.WRITE);
                    if (rep.get("node") != null) {
                        transferLogInfo.setNode(rep.get("node").toString());
                    }
                    new TransferLogEntity().createWithInfo(transferLogInfo).save();
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        };
        new Thread(runnable).start();
    }

    @Override
    public InfoPage<TransferLogInfo> findTransferLogs(TransferLogInfo info) throws BreezeeException {
        BreezeeUtils.checkCreateTime(info.getProperties(), "createTime");
        return new TransferLogEntity().createWithInfo(info).page();
    }

    @Override
    public TransferLogInfo findTransferLogById(String id) throws BreezeeException {
        return new TransferLogEntity().buildId(id).buildCode(id).findOne();
    }
}
