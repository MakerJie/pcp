package com.pcp.export.dto;

import com.pcp.api.crm.domain.UserPointHistoryInfo;
import com.pcp.common.util.BeanUtil;
import com.pcp.common.util.BreezeeUtils;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.jeecgframework.poi.excel.annotation.ExcelTarget;

import java.util.Map;

/**
 * @author Wang, Junjie
 * @since on 2017/9/5
 */
@Getter
@Setter
@NoArgsConstructor
@ExcelTarget("userPointExcelDTO")
public class UserPointExcelDTO  implements IExcelDTO{

    @Excel(name = "会员名称")
    String userName;
    @Excel(name = "会员卡号")
    String cardNo;
    @Excel(name = "会员等级")
    String cardLevel;
    @Excel(name = "联系手机")
    String mobile;
    @Excel(name = "发生时间")
    String happenTime;
    @Excel(name = "积分类型")
    String pointType;
    @Excel(name = "变动原因")
    String remark;
    @Excel(name = "积分增减")
    String amount;
    @Excel(name = "积分余额")
    String totalAmount;



    @Override
    public IExcelDTO parseInfo(Object info) {
        if(info instanceof UserPointHistoryInfo) {
            UserPointHistoryInfo pointInfo = (UserPointHistoryInfo) info;
            this.setUserName(pointInfo.getUserName());
            this.setCardNo(pointInfo.getCardNo());
            this.setCardLevel(pointInfo.getLevelName());
            this.setMobile(pointInfo.getMobile());
            this.setHappenTime(BreezeeUtils.DATE_FORMAT_LONG.format(pointInfo.getHappenTime()));
            this.setPointType(pointInfo.getPointTypeName());
            this.setRemark(pointInfo.getRemark());
            this.setAmount(pointInfo.getAmount().toString());
            this.setTotalAmount(pointInfo.getTotalAmount().toString());

        } else if(info instanceof Map){
            try {
                BeanUtil.mapToObject((Map<String, Object>) info,this);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return this;
    }
}
