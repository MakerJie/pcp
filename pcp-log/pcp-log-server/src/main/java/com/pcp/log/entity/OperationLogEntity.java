package com.pcp.log.entity;

import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Lob;
import java.util.Date;

/**
 * 操作日志对象
 * Created by Ning on 2017/9/5.
 */
@Entity(name = "LOG_TF_OPERATION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OperationLogEntity extends BaseEntity<OperationLogInfo> {

    //name:操作人,code:操作人code,type:操作类型.module:所属模块,业务主键,result:操作结果,remark：结果信息,createTime: 操作时间
    protected String type, bizId, module,menuName, entity;

    @Lob
    protected String result;

    protected Date rqTime, returnTime;

    protected String errMsg;

    protected Boolean success;

    @Override
    protected OperationLogInfo createInfo() {
        return new OperationLogInfo();
    }
}
