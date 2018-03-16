package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponInfo;
import com.pcp.api.crm.domain.CouponStatusEnum;
import com.pcp.api.crm.domain.UserInfo;
import com.pcp.common.data.BaseEntity;
import com.pcp.common.data.DynamicSpecifications;
import com.pcp.common.exception.EntityNotFoundException;
import com.pcp.common.exception.NotSupportedException;
import com.pcp.common.util.BreezeeCall;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * 会员实体
 * Created by Silence on 2017/7/3.
 */
@Entity(name = "CRM_TF_USER")
@Table(indexes = {
        @Index(name = "crm_idx_code_user", unique = true, columnList = "code")
        , @Index(name = "crm_idx_mobile_user", unique = true, columnList = "mobile")
        , @Index(name = "crm_idx_cardNo_user", unique = true, columnList = "cardNo")
        , @Index(name = "crm_idx_openid_user", unique = true, columnList = "openid")
        , @Index(name = "crm_idx_aliId_user", unique = true, columnList = "aliId")
        , @Index(name = "crm_idx_email_user", unique = true, columnList = "email")
        , @Index(name = "crm_idx_lastbirthday_user", columnList = "lastBirthRights")
        , @Index(name = "crm_idx_bornday_user", unique = false, columnList = "bornDay")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserEntity extends BaseEntity<UserInfo> {

    protected String cardNo,  //卡号
            realName, //真实名称
            email,
            country,
            province,
            city,
            district,
            address,
            constellation,
            referee,
            crmChannel,
            openid,
            aliCard,
            aliId,
            password,
            headImg1,
            headImg2,
            headImg3, bornDay;

    @Column(name = "BIRTHDAY")
    private Date birthday;

    @Column(name = "MOBILE")
    protected String mobile;

    private Integer sex, cardLevel, totalPoint, salePoint, orderCount, keepPoint;

    protected String levelReason;

    protected Boolean fullInfo;

    @Column(name = "USER_TAG", length = 3000)
    private String userTag;

    private String firstShop, lastShop, babyBirthDay, babySex;
    private Date firstDealTime, lastDealTime, lastHrights, levelUpDate, pointUpdate,aliGiftDate;
    private Integer hasBaby, tasting, lastBirthRights;

    @Column(name = "WANT_AREA", length = 3000)
    private String wantArea;

    @Column(name = "PREFERENCE", length = 3000)
    private String preference;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @OrderBy(value = "createTime desc")
    private Set<GradeChangeEntity> upRecord;

    @Override
    protected UserInfo createInfo() {
        return new UserInfo();
    }

    @Override
    public UserInfo buildInfo(UserInfo userInfo) {
        super.buildInfo(userInfo);
        return userInfo;
    }

    public void setTotalPoint(Integer totalPoint) {
        this.totalPoint = totalPoint;
        this.pointUpdate = new Date();
    }

    @Override
    public <R extends BaseEntity> R findEntity() {
        R object = null;
        if (StringUtils.hasText(this.getId())) {
            object = (R) myRepository().findOne(this.getId());
        }
        if (object == null && StringUtils.hasText(this.getCode())) {
            object = (R) myRepository().findByCode(this.getCode());
        }
        if (object == null && StringUtils.hasText(this.getMobile())) {
            List<UserEntity> l = this.myRepository().findAll(DynamicSpecifications.createSpecification(Collections.singletonMap("mobile", this.getMobile())));
            if (l != null && l.size() > 0) {
                object = (R) l.get(0);
            }
        }
        if (object == null && StringUtils.hasText(this.getCardNo())) {
            List<UserEntity> l = this.myRepository().findAll(DynamicSpecifications.createSpecification(Collections.singletonMap("cardNo", this.getCardNo())));
            if (l != null && l.size() > 0) {
                object = (R) l.get(0);
            }
        }
        if (object == null && StringUtils.hasText(this.getOpenid())) {
            List<UserEntity> l = this.myRepository().findAll(DynamicSpecifications.createSpecification(Collections.singletonMap("openid", this.getOpenid())));
            if (l != null && l.size() > 0) {
                object = (R) l.get(0);
            }
        }
        return object;
    }

    @Override
    public UserInfo findOne(BreezeeCall... callback) throws NotSupportedException, EntityNotFoundException {
        UserEntity object = this.findEntity();
        UserInfo t = createInfo();
        if (t == null) {
            throw new NotSupportedException("不支持此实体对象查询");
        }
        if (object == null) {
            List<UserEntity> l = this.myRepository().findAll(DynamicSpecifications.createSpecification(Collections.singletonMap("mobile", this.getMobile())));
            if (l != null && l.size() > 0) {
                object = l.get(0);
            }
        }
        if (object == null) {
            List<UserEntity> l = this.myRepository().findAll(DynamicSpecifications.createSpecification(Collections.singletonMap("cardNo", this.getCardNo())));
            if (l != null && l.size() > 0) {
                object = l.get(0);
            }
        }
        if (object == null) {
            throw new EntityNotFoundException("无法找到对象");
        }
        object.buildInfo(t);
        if (callback != null && callback.length > 0) {
            for (BreezeeCall cb : callback) {
                if (cb != null) {
                    cb.call(object, t);
                }
            }
        }
        return t;
    }
}
