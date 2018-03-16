package com.pcp.api.log.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pcp.common.SystemTool;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.util.Date;

/**
 * 造作日志对象
 * Created by Ning on 2017/9/5.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OperationLogInfo extends BaseInfo {

    //name:操作人,code:操作人code,type:操作类型.module:所属模块,业务主键,result:操作结果,remark：结果信息,createTime: 操作时间
    protected String type, bizId, module,menuName, entity;

    protected String result;

    protected Date rqTime, returnTime;

    protected Object diffInfo;

    protected String errMsg;

    protected Boolean success;

    /**
     * 构建操作日志对象
     * @param a
     * @param b
     * @param module
     * @param ignore
     * @return
     */
    public OperationLogInfo buildOperationLog(BaseInfo a, BaseInfo b, String module, String ignore) {
        try {
            this.setRqTime(new Date());
            this.setBizId(a.getId());
            this.setCode(SystemTool.getCode());
            this.setName(a.getCreator());
            this.setModule(module);
            this.setMenuName(a.getMenuCode());
            this.setEntity(a.getClass().getName());
            if (StringUtils.hasText(a.getId())) {
                if (a.getProperties().get("del") != null && a.getProperties().get("del").equals("del")) {
                    this.setType("3");
                } else {
                    this.setType("2");
                }
            } else {
                this.setType("1");
            }
            if (ignore == null) {
                ignore = "";
            }
            ignore = ignore + ",id,code,createTime,creator,updator,tenantId,language,properties,node,version,equipment,deviceName,menuCode";
            this.setResult(BreezeeUtils.objectMapper.writeValueAsString(BreezeeUtils.objectDiff(a, b, ignore)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return this;
    }

    /**
     * 静态方法创建日志对象
     *
     * @param a
     * @param b
     * @param ignore
     * @return
     */
    public static OperationLogInfo build(BaseInfo a, BaseInfo b, String module, String ignore) {
        return new OperationLogInfo().buildOperationLog(a, b, module, ignore);
    }
}
