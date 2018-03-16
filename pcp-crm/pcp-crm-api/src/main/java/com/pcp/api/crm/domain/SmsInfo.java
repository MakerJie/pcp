package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;
import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.Date;
import java.util.Objects;

/**
 * 短信
 *
 * @author Wang, Junjie
 * @since on 2017/9/27
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SmsInfo extends BaseInfo {
    //code 短信编码 name 短信名称
    protected String sendMethod, sendMessage, sn, type, repId, result, detailUrl;
    protected Date sendDate;
    protected Integer retryCount;

    @Override
    public String getStatusName() {
        for (ConstantEnum e : SmsStatusEnum.values()) {
            if (Objects.equals(e.getValue(), status)) {
                return e.getText();
            }
        }
        return status + "";
    }
}
