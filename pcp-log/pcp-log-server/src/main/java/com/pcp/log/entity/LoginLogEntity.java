package com.pcp.log.entity;

import com.pcp.api.log.api.LoginLogInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * 登录日志对象
 * Created by Ning on 2017/7/26.
 */
@Entity(name = "LOG_TF_LOGIN")
@Table(indexes = {
        @Index(name = "log_idx_code_login", columnList = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoginLogEntity extends BaseEntity<LoginLogInfo> {

    protected  String remoteHost,result,uuid,msg,area,areaId,region,regionId,city,cityId,isp,ispId;

    @Override
    protected LoginLogInfo createInfo() {
        return new LoginLogInfo();
    }
}
