package com.pcp.api.log.api;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.Date;

/**
 * 接口日志
 * Created by Ning on 2017/9/5.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransferLogInfo extends BaseInfo {

    //transferCode:接口号 ,transferParam:请求参数 ,userName:用户名 ,userId:用户ID ,type:请求类型 ,result:请求结果,remark: 结果信息,createTime:请求时间,module:所属模块
    //bizId:类ID,rqTime：请求时间,returnTime：返回时间
    protected  String transferCode,transferParam,userName,userId,bizId,type,module,menuName,token;

    protected Date rqTime,returnTime;
    protected  String result,errMsg;

    protected  boolean success;

}
