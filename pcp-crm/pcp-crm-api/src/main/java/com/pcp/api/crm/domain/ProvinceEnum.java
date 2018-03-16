package com.pcp.api.crm.domain;

import com.pcp.common.constants.ConstantEnum;

/**
 * 省份枚举
 * @author Wang, Junjie
 * @since on 2017/9/22
 */
public enum ProvinceEnum implements ConstantEnum {

    BEIJING("北京市", 11),
    TIANJING("天津市",12),
    HEBEI("河北省",13),
    SHANXI("山西省",14),
    NEIMENG("内蒙古自治区",15),

    LIAONING("辽宁省", 21),
    JILING("吉林省",22),
    HEILONGJIAN("黑龙江省",23),
    SHANGHAI("上海市",31),
    JIANGSU("江苏省",32),

    ZHEJIANG("浙江省", 33),
    ANHUI("安徽省",34),
    FUJIAN("福建省",35),
    JIANGXI("江西省",36),
    SHANDONG("山东省",37),

    HENAN("河南省", 41),
    HUBEI("湖北省",42),
    HUNAN("湖南省",43),
    GUANGDONG("广东省",44),
    GUANGXI("广西自治区",45),

     HAINAN("海南省", 46),
    CHONGQING("重庆市",50),
    SICHUAN("四川省",51),
    GUIZHOU("贵州省",52),
    YUNNAN("云南省",53),

    XIZANG("西藏自治区", 54),
    SHANGXI("陕西省",61),
    GANSU("甘肃省",62),
    QINGHAI("青海省",63),
    NINGXIA("宁夏自治区",64),

    XINGJIANG("新疆维吾尔自治区", 65),
    TAIWAN("台湾省",71),
    XIANGGANG("香港特别行政区",81),
    AOMEN("澳门特别行政区",82);

    private final String text;

    private final Integer value;

    ProvinceEnum(String text, Integer value) {
        this.text = text;
        this.value = value;
    }

    public Integer getValue() {
        return this.value;
    }

    public String getText() {
        return this.text;
    }

    public String toString() {
        return this.getText();
    }
}
