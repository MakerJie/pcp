package com.pcp.log.entity;

import com.pcp.api.log.api.TransferLogInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Lob;
import java.util.Date;

/**
 * 接口日志
 * Created by Ning on 2017/9/5.
 */
@Entity(name = "LOG_TF_TRANSFER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransferLogEntity extends BaseEntity<TransferLogInfo>{

    //transferCode:接口号 ,transferParam:请求参数 ,userId:用户ID ,type:请求类型 ,result:请求结果,remark: 结果信息,createTime:请求时间,module:所属模块
    //bizId:类ID,rqTime：请求时间,returnTime：返回时间
    protected  String transferCode,bizId,typ,module,menuName,token,errMsg;

    protected Date rqTime,returnTime;

    protected  boolean success;

    @Lob
    protected  String result;

    @Lob
    protected String transferParam;

    @Override
    protected TransferLogInfo createInfo() {
        return new TransferLogInfo();
    }

}
