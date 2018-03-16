package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.*;

/**
 * 客户信息
 * Created by Silence on 2017/6/28.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserInfo extends BaseInfo {

    protected String cardNo,  //卡号
            realName, //真实名称
            mobile,
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
            userTag,
            headImg1,
            headImg2,
            headImg3, bornDay;

    //keepPoint:保级积分，当我升了新的等级，之后清零的新积分
    //升级的规则，keepPoint达到
    protected Integer sex, cardLevel, totalPoint,
            salePoint, keepPoint, source;

    protected String levelReason;

    protected Date birthday, levelUpDate, lastHrights;

    protected String preference, firstShop, lastShop, babyBirthDay, babySex, wantArea, lastShopName, firstShopName;
    protected Integer orderCount, orderAmount, giftCount;
    protected Date firstDealTime, lastDealTime,aliGiftDate;
    protected Integer hasBaby, tasting, lastBirthRights;
    protected Boolean fullInfo;

    protected String qrCode;

    protected List<CouponInfo> coupons = new ArrayList<>();

    protected List<GradeChangeInfo> upRecordInfos;

    protected GradeChangeInfo changeInfo;

    protected String verifyCode;

    public String getLevelName() {
        if (StringUtils.isEmpty(cardLevel)) {
            return "-";
        }
        for (ConstantEnum e : LevelEnum.values()) {
            if (Objects.equals(e.getValue(), cardLevel)) {
                return e.getText();
            }
        }
        return cardLevel + "";
    }

    public Integer getAge() {
        if (this.getBirthday() != null) {
            LocalDate ld = BreezeeUtils.date2LocalDate(this.getBirthday());
            return LocalDate.now().getYear() - ld.getYear();
        }
        return null;
    }

    public String getHeadImg() {
        if (this.getHeadImg1() != null) {
            return this.getHeadImg1();
        }
        if (this.getHeadImg2() != null) {
            return this.getHeadImg2();
        }
        return this.getHeadImg3();
    }

    /**
     * 加入年数
     *
     * @return
     */
    public Integer joinYear() {
        LocalDate ld = LocalDate.now();
        LocalDate ll = BreezeeUtils.date2LocalDate(this.getCreateTime());
        return ld.getYear() - ll.getYear();
    }
}
