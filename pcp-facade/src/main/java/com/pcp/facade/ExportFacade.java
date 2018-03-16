package com.pcp.facade;

import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.common.IResourceLayer;
import com.pcp.common.SystemTool;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.common.util.ContextUtil;
import com.pcp.export.ExcelUtils;
import javafx.util.Callback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 导出类在此里面
 * Created by Silence on 2017/9/3.
 */
@Controller
public class ExportFacade implements IResourceLayer {

    @Autowired
    private IOperationLogService operationLogService;

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/export/excel", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<InputStreamResource> exportExcel(HttpServletRequest request) {
        OperationLogInfo operationLogInfo = new OperationLogInfo();
        operationLogInfo.setRqTime(new Date());
        Map<String, Object> m = null;
        try {
            m = BreezeeUtils.objectMapper.readValue(request.getParameter("content"), Map.class);
            Callback<Map<String, Object>, List<Object>> callback = ContextUtil.getBean(m.get("_callbackName").toString(), Callback.class);
            File templateFile = ExcelUtils.export(Class.forName(m.get("_className").toString()),
                    m.get("_sheetName").toString(),
                    m.get("_title").toString(),
                    callback.call(m));
            FileSystemResource file = new FileSystemResource(templateFile);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Content-Disposition",
                    "attachment; filename=" + new String((file.getFilename()).getBytes("gb2312"),
                            "iso-8859-1"));
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentLength(file.contentLength())
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .body(new InputStreamResource(file.getInputStream()));
        } catch (Exception e) {
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok().body(null);
        } finally {
            assert m != null;
            if (!StringUtils.isEmpty(m.get("_module"))) {
                operationLogInfo.setModule(m.get("_module").toString());
            }
            if (!StringUtils.isEmpty(m.get("_menuCode"))) {
                operationLogInfo.setMenuName(m.get("_menuCode").toString());
            }
            if (!StringUtils.isEmpty(m.get("_userId"))) {
                operationLogInfo.setName(m.get("_userId").toString());
            }
            operationLogInfo.setBizId(m.get("_className").toString());
            operationLogInfo.setCode(SystemTool.getCode());
            operationLogInfo.setType("4");
            operationLogService.saveOperationLog(operationLogInfo);
        }
    }
}
