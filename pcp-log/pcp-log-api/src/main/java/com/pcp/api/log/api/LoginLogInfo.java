package com.pcp.api.log.api;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 *登录日志对象
 * Created by Ning on 2017/7/26.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoginLogInfo extends BaseInfo {

    //remoteHost:ip地址,result:结果,msg:结果信息,area:地区,areaId:地区ID,region:省份,regionId:省份,ID,city:城市,cityId:城市IDisp:,ispId:,
    protected  String remoteHost,result,uuid,msg,area,areaId,region,regionId,city,cityId,isp,ispId;

}
