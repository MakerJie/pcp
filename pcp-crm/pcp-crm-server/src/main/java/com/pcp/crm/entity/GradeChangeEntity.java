package com.pcp.crm.entity;

import com.pcp.api.crm.domain.GradeChangeInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

/**
 * @author Wang, Junjie
 * @since on 2017/9/12
 */
@Entity(name = "CRM_TF_GRADE_CHANGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GradeChangeEntity extends BaseEntity<GradeChangeInfo> {
    //beforeChange,afterChange变动前等级，变动后等级 status 变动状态
    //creator 变动操作人 createTime 变动时间
    protected Integer beforeLevel, afterLevel,up;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    UserEntity user;

    @Override
    protected GradeChangeInfo createInfo() {
        return new GradeChangeInfo();
    }
}
