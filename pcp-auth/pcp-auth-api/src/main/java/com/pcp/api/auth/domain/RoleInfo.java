package com.pcp.api.auth.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;
import org.springframework.context.annotation.Role;

import java.util.ArrayList;
import java.util.List;

/**
 * 角色信息
 * Created by Silence on 2017/8/7.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RoleInfo extends BaseInfo {
    /**
     * 权限串
     */
    protected String permits;

    protected List<String> accounts = new ArrayList<>();

    public String[] getPermitStr() {
        if (this.permits != null)
            return this.permits.split(",");
        return new String[0];
    }
}
