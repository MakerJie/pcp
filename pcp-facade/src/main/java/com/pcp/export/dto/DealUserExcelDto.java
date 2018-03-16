package com.pcp.export.dto;

import com.pcp.api.crm.domain.UserInfo;
import com.pcp.common.util.BeanUtil;
import com.pcp.common.util.BreezeeUtils;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.jeecgframework.poi.excel.annotation.ExcelTarget;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Map;

/**
 * Created by Ning on 2017/08/25.
 */
@Getter
@Setter
@NoArgsConstructor
@SuppressWarnings("serial")
@ExcelTarget("dealUserExcel")
public class DealUserExcelDto implements IExcelDTO {


    @Excel(name = "会员卡号")
    String cardNo;
    @Excel(name = "用户名")
    String name;
    @Excel(name = "微信ID")
    String weChatId;
    @Excel(name = "性别")
    String gender;
    @Excel(name = "手机号")
    String mobile;
    @Excel(name = "生日")
    String birthday;
    @Excel(name = "星座")
    String constellation;
    @Excel(name = "会员等级")
    String level;
    @Excel(name = "积分余额")
    String pointAmount;
    @Excel(name = "城市")
    String city;
    @Excel(name = "会员状态")
    String status;
    @Excel(name = "注册时间")
    String createTime;
    @Excel(name = "首笔消费时间")
    String firstConsume;
    @Excel(name = "是否育有萌宝")
    String hasBaby;
    @Excel(name = "萌宝一生日")
    String babyBir1;
    @Excel(name = "萌宝二生日")
    String babyBir2;

    @Override
    public IExcelDTO parseInfo(Object info) {
        if (info instanceof UserInfo) {
            UserInfo userInfo = (UserInfo) info;
            this.setCardNo(userInfo.getCardNo());
            this.setName(userInfo.getName());
            this.setWeChatId(userInfo.getOpenid());
            this.setGender((!StringUtils.isEmpty(userInfo.getSex()) ? (userInfo.getSex() == 1 ? "男" : "女") : "-"));
            this.setMobile(userInfo.getMobile());
            SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");
            if (!StringUtils.isEmpty(userInfo.getBirthday())) {
                this.setBirthday(sd.format(userInfo.getBirthday()));
            }
            this.setConstellation((!StringUtils.isEmpty(userInfo.getConstellation()) ? userInfo.getConstellation() : "-"));
            this.setLevel(userInfo.getLevelName());
            this.setPointAmount(StringUtils.isEmpty(userInfo.getTotalPoint())?"-":userInfo.getTotalPoint().toString());
            this.setCity((StringUtils.isEmpty(userInfo.getCity()) ? "-" : userInfo.getCity()));
            this.setStatus(userInfo.getStatus() == 1 ? "激活" : "冻结");
            this.setCreateTime(BreezeeUtils.DATE_FORMAT_LONG.format(userInfo.getCreateTime()));
            if (!StringUtils.isEmpty(userInfo.getFirstDealTime())) {
                this.setFirstConsume(sd.format(userInfo.getFirstDealTime()));
            }
            this.setHasBaby((StringUtils.isEmpty(userInfo.getHasBaby())  ? "-": userInfo.getHasBaby() == 1 ? "有" : "无"));
            if((!StringUtils.isEmpty(userInfo.getBabyBirthDay()))){
                String[] bir=userInfo.getBabyBirthDay().split(",");
                this.setBabyBir1(bir[0]);
                if(!StringUtils.isEmpty(bir[1])){
                    this.setBabyBir2(bir[1]);
                }
            }
        } else if (info instanceof Map) {
            try {
                BeanUtil.mapToObject((Map<String, Object>) info, this);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return this;
    }
}
