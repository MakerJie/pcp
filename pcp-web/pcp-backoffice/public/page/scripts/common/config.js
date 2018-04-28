/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

(function ($) {

    Dolphin.defaults.mockFlag = false;
    Dolphin.enum.setOptions({
        ajaxFlag: false,
        enumUrl: '/api/5b8e27d5bb9547f48235bd70aea199b9@code={id}',
        cookieFlag: false
    });

    Dolphin.enum.addEnum("infoStatus", [
        {code: '1', name: '启用'},
        {code: '0', name: '禁用'}
    ]);

    Dolphin.enum.addEnum("contractStatus", [
        {code: '1', name: '未过账'},
        {code: '2', name: '已过账'}
    ]);

    Dolphin.enum.addEnum("disType", [
        {code: '1', name: '满减折扣'},
        {code: '2', name: '整单折扣'},
        {code: '3', name: '单品折扣'},
    ]);

    Dolphin.enum.addEnum("comboType", [
        {code: '0', name: '普通'},
        {code: '1', name: '套餐'},
        {code: '2', name: '一半一半'}
    ]);

    Dolphin.enum.addEnum("matType", [
        {code: 'Z092', name: '半成品'},
        // {code: 'Z091', name: '原料ITEMS'},
        {code: 'Z001', name: '原料SKU'}
    ]);

    Dolphin.enum.addEnum("checkArea", [
        {code: '1', name: '外场'},
        {code: '2', name: '厨房'}, //  "ZZINVTYAREA": "2","ZZINVTYAREA": "3",
        {code: '3', name: '厨房&外场'}// "ZZINVTYAREA": "1",
    ]);

    Dolphin.enum.addEnum("temperature", [
        {code: '常温', name: '常温'},
        {code: '冷冻', name: '冷冻'},
        {code: '冷藏', name: '冷藏'},
        {code: '干货', name: '干货'}
    ]);

    Dolphin.enum.addEnum("shelfUnit", [
        {code: '10', name: '天'},
        {code: '20', name: '周'},
        {code: '30', name: '月'},
        {code: '40', name: '年'}//"IPRKZ": "",
    ]);

    Dolphin.enum.addEnum("standardUnit", [
        {code: '10', name: 'EA'},
        {code: '20', name: 'KG'},
        {code: '40', name: 'G'}
    ]);

    Dolphin.enum.addEnum("measureUnit", [
        {code: '10', name: 'BAG'},
        {code: '20', name: 'BOX'}
    ]);

    Dolphin.enum.addEnum("fetchType", [
        {code: 'Y51', name: '门店报损'},
        {code: 'Y21', name: '研发领用'},
        {code: 'Y23', name: '部门领用'}
        // {code: 'Y53', name: '总仓报损'},
        //  {code: 'Y52', name: '门店报损冲销'},
        //  {code: 'Y22', name: '研发领用冲销'},
        //  {code: 'Y24', name: '部门领用冲销'},
        //  {code: 'Y54', name: '总仓报损冲销'}
    ]);

    Dolphin.enum.addEnum("receiveType", [
        {code: '10', name: '完全收货'},
        {code: '20', name: '部分收货'}
    ]);

    Dolphin.enum.addEnum("supplierType", [
        {code: 'FLVN01', name: '采购组织'},
        {code: 'FLVN00', name: '公司代码'},
        {code: 'FLCU00', name: '客户代码'},
        {code: 'FLCU01', name: '销售组织'}
    ]);

    Dolphin.enum.addEnum('Bugroup', [
        {code: 'ZN01', name: '关联客户'},
        {code: 'ZN02', name: '工厂'},
        {code: 'ZW01', name: '外部客户'},
        {code: 'ZW02', name: '财务客户'},
        {code: 'ZY01', name: '员工'}
    ]);

    Dolphin.enum.addEnum('stockCheckStatus', [
        {code: '100', name: '已提交至SAP'},
        {code: '1', name: '待提交'}
    ]);

    Dolphin.enum.addEnum('purchaseList1Status', [
        {code: '100', name: '已提交至SAP'},
        {code: '200', name: '已收货'}
    ]);

    Dolphin.enum.addEnum('checkStatus', [
        {code: '1', name: '待确认'},
        {code: '2', name: '待过账'},
        {code: '1000', name: '已过账'}
    ]);

    Dolphin.enum.addEnum('pointStoreType', [
        {code: '1', name: '积分商城'},
        {code: '2', name: '生活服务'}
    ]);

    Dolphin.enum.addEnum('purchaseType', [
        {code: '10', name: '外部采购'},
        {code: '20', name: '门店间调拨'},
        {code: '30', name: '总仓门店调拨'},
        {code: '40', name: '总仓间调拨'},
        {code: '80', name: '总仓采购退货'},
        {code: '90', name: '外部采购退货'}
    ]);

    Dolphin.enum.addEnum('orderLineType', [
        {code: '10', name: '正常'},
        {code: '20', name: '退菜'},
        {code: '40', name: '试吃'},
        {code: '50', name: '员工餐'},
        {code: '60', name: '培训'},
        {code: '70', name: '赠菜'},
        {code: '80', name: '收定金'},
        {code: '81', name: '小费'},
        {code: '82', name: '套餐溢价'},
        {code: '83', name: '订单溢价'},
        {code: '90', name: '礼品卡'},
        {code: '30', name: '报损'}
    ]);

    Dolphin.enum.addEnum('posPeriod', [
        {code: '10', name: '早市'},
        {code: '20', name: '午市'},
        {code: '30', name: '下午茶'},
        {code: '40', name: '晚市'},
        {code: '50', name: '其他'}
    ]);

    Dolphin.enum.addEnum('brandName', [
        {code: '4', name: 'Marzano'}
    ]);

    Dolphin.enum.addEnum('stockCheckType', [
        {code: '1', name: '日盘'},
        {code: '2', name: '月盘'},
        {code: '3', name: '周盘'},
        {code: '4', name: '年盘'}
    ]);

    Dolphin.enum.addEnum('saleMethod', [
        {code: '00', name: '通用'},
        {code: '10', name: '堂食'},
        {code: '11', name: 'PMP'},
        {code: '12', name: '外卖'},
        {code: '13', name: '外带'},
        {code: '14', name: 'Catering'},
        {code: '15', name: '加盟'},
        {code: '16', name: '批发'},
        {code: '17', name: '收定金'},
        {code: '18', name: '试吃'},
        {code: '19', name: '员工餐'},
        {code: '20', name: '电商'},
        {code: '90', name: '公司间交易'}
    ]);


    Dolphin.enum.addEnum('userLevel', [
        {code: '1', name: '蓝卡'},
        {code: '2', name: '金卡'},
        {code: '3', name: '铂金卡'},
        {code: '4', name: '黑卡'},
        {code: '5', name: '员工卡'}
    ]);

    Dolphin.enum.addEnum('uLevel', [
        {code: '1', name: '蓝卡'},
        {code: '4', name: '黑卡'}
    ]);

    Dolphin.enum.addEnum('sex', [
        {code: '1', name: '男'},
        {code: '2', name: '女'}
    ]);

    Dolphin.enum.addEnum('decide', [
        {code: '1', name: '是'},
        {code: '0', name: '否'}
    ]);

    Dolphin.enum.addEnum('success', [
        {code: true, name: '成功'},
        {code: false, name: '失败'}
    ]);

    Dolphin.enum.addEnum('channel', [
        {code: '后台创建', name: '后台创建'},
        {code: '公众号', name: '公众号'},
        {code: '网页', name: '网页'},
        {code: '邀请', name: '邀请'},
        {code: '异业合作', name: '异业合作'}
    ]);

    Dolphin.enum.addEnum('pointType', [
        {code: '1', name: '签到积分'},
        {code: '2', name: '消费积分'},
        {code: '3', name: '活动积分'},
        {code: '4', name: '权益积分'},
        {code: '5', name: '消耗积分'},
        {code: '6', name: '过期积分'},
        {code: '7', name: '补偿积分'}
    ]);

    Dolphin.enum.addEnum('pointChange', [
        {code: '1', name: '增加'},
        {code: '2', name: '减少'},
    ]);
    Dolphin.enum.addEnum('accountMonth', [
        {code: '01', name: '01'},
        {code: '02', name: '02'},
        {code: '03', name: '03'},
        {code: '04', name: '04'},
        {code: '05', name: '05'},
        {code: '06', name: '06'},
        {code: '07', name: '07'},
        {code: '08', name: '08'},
        {code: '09', name: '09'},
        {code: '10', name: '10'},
        {code: '11', name: '11'},
        {code: '12', name: '12'}
    ]);

    Dolphin.enum.addEnum('accountDay', [
        {code: '01', name: '01'},
        {code: '02', name: '02'},
        {code: '03', name: '03'},
        {code: '04', name: '04'},
        {code: '05', name: '05'},
        {code: '06', name: '06'},
        {code: '07', name: '07'},
        {code: '08', name: '08'},
        {code: '09', name: '09'},
        {code: '10', name: '10'},
        {code: '11', name: '11'},
        {code: '12', name: '12'},
        {code: '13', name: '13'},
        {code: '14', name: '14'},
        {code: '15', name: '15'},
        {code: '16', name: '16'},
        {code: '17', name: '17'},
        {code: '18', name: '18'},
        {code: '19', name: '19'},
        {code: '20', name: '20'},
        {code: '21', name: '21'},
        {code: '22', name: '22'},
        {code: '23', name: '23'},
        {code: '24', name: '24'},
        {code: '25', name: '25'},
        {code: '26', name: '26'},
        {code: '27', name: '27'},
        {code: '28', name: '28'},
        {code: '29', name: '29'},
        {code: '30', name: '30'},
        {code: '31', name: '31'}

    ]);

    Dolphin.enum.addEnum('couponType', [
        {code: '2', name: '代金券'},
        {code: '3', name: '兑换券'},
        {code: '4', name: '买赠券'},
        {code: '6', name: '满减券'},
        {code: '1', name: '比例折扣券'},
        {code: '5', name: '无规则券'}
    ]);

    Dolphin.enum.addEnum('couponStatus', [
        {code: '1', name: '待使用'},
        {code: '5', name: '已过期'},
        {code: '3', name: '已核销'},
        {code: '11', name: '已转增'},
        {code: '7', name: '已作废'}
    ]);

    Dolphin.enum.addEnum('activity', [
        {code: '1', name: '参与活动'},
        {code: '0', name: '不参与活动'},
    ]);

    Dolphin.enum.addEnum('advertisePublish', [
        {code: '1', name: '未上架'},
        {code: '2', name: '上架'},
        {code: '3', name: '下架'},
    ]);

    Dolphin.enum.addEnum('sellMethod', [
        {code: '堂食', name: '堂食'},
        {code: '外带', name: '外带'},
        {code: '自有外卖', name: '自有外卖'},
    ]);

    Dolphin.enum.addEnum('brandSelect', [
        {code: 'Marzano', name: 'Marzano'},
        {code: 'Fireza', name: 'Fireza'},
    ]);

    Dolphin.enum.addEnum('sendMethod', [
        {code: '筛选会员', name: '筛选会员'},
        {code: '导入会员', name: '导入会员'},
    ]);
    Dolphin.enum.addEnum('couponSource', [
        {code: '内部', name: '内部'},
        {code: '外部', name: '外部'},
    ]);

    Dolphin.enum.addEnum('validity', [
        {code: '1', name: '固定日期'},
        {code: '2', name: '领取后'},
    ]);

    Dolphin.enum.addEnum('bigCategory', [
        {code: '饮料', name: '饮料'},
        {code: '主餐', name: '主餐'},
        {code: '甜品', name: '甜品'},
    ]);

    Dolphin.enum.addEnum('smallCategory', [
        {code: '咖啡', name: '咖啡', logName: '饮料'},
        {code: '茶', name: '茶', logName: '饮料'},

        {code: '披萨', name: '披萨', logName: '主餐'},
        {code: '牛排', name: '牛排', logName: '主餐'},
    ]);

    Dolphin.enum.addEnum('goodsSelect', [
        {code: '美式', name: '美式', logName: '咖啡'},
        {code: '拿铁', name: '拿铁', logName: '咖啡'},
        {code: '摩卡', name: '摩卡', logName: '咖啡'},
    ]);

    Dolphin.enum.addEnum('activityType', [
        {code: '1', name: '入会活动'},
        {code: '2', name: '会员活动'},
        {code: '3', name: '消费活动'},
    ]);

    Dolphin.enum.addEnum('activityChannel', [
        {code: '二维码活动', name: '二维码活动'},
        {code: '线上广告活动', name: '线上广告活动'},
        {code: '消费活动', name: '消费活动'},
    ]);


    Dolphin.enum.addEnum('constellation', [
        {code: '水瓶座', name: '水瓶座'},
        {code: '双鱼座', name: '双鱼座'},
        {code: '白羊座', name: '白羊座'},
        {code: '金牛座', name: '金牛座'},
        {code: '双子座', name: '双子座'},
        {code: '巨蟹座', name: '巨蟹座'},
        {code: '狮子座', name: '狮子座'},
        {code: '处女座', name: '处女座'},
        {code: '天秤座', name: '天秤座'},
        {code: '天蝎座', name: '天蝎座'},
        {code: '射手座', name: '射手座'},
        {code: '摩羯座', name: '摩羯座'}
    ]);

    Dolphin.enum.addEnum('opinionTypes', [
        {code: '意见', name: '意见'},
        {code: '咨询', name: '咨询'},
        {code: '表扬', name: '表扬'},
        {code: '投诉', name: '投诉'}
    ]);

    Dolphin.enum.addEnum('personTag', [
        {code: '素食主义', name: '素食主义'},
        {code: '无肉不欢', name: '无肉不欢'},
        {code: '修身达人', name: '修身达人'},
        {code: '修图狂人', name: '修图狂人'},
        {code: '选择困难症', name: '选择困难症'},
        {code: '甜品控', name: '甜品控'},
        {code: '溜娃负责人', name: '溜娃负责人'},
        {code: '无辣不欢', name: '无辣不欢'},
        {code: '仪式感', name: '仪式感'},
        {code: '懒癌晚期', name: '懒癌晚期'},
        {code: '爱电商', name: '爱电商'},
    ]);


    Dolphin.enum.addEnum('goodsState', [
        {code: '上架', name: '上架'},
        {code: '下架', name: '下架'},
    ]);


    Dolphin.enum.addEnum('position', [
        {code: 'left', name: '左'},
        {code: 'right', name: '右'},
    ]);
    Dolphin.enum.addEnum('reason', [
        {code: '1', name: '过期'},
        {code: '2', name: '质量问题'},
        {code: '3', name: '测试'},
        {code: '4', name: '订单重做'},
        {code: '5', name: '订单错误'},
        {code: '6', name: '客户退单'},
        {code: '7', name: '培训'},
        {code: '8', name: '操作错误'},
        {code: '99', name: '其他'}
    ]);

    Dolphin.enum.addEnum("shopRejectReason", [{
        code: "1", name: "短缺退收"
    }, {
        code: "2", name: "损坏退收"
    }, {
        code: "3", name: "标签问题"
    }, {
        code: "4", name: "质量问题"
    }, {
        code: "5", name: "收货问题"
    }, {
        code: "6", name: "允收期问题"
    }, {
        code: "7", name: "保质期问题"
    }, {
        code: "8", name: "正常范围"
    }, {
        code: "99", name: "其它原因退收"
    }]);


    Dolphin.enum.addEnum("returnReason", [{
        code: "1", name: "批次问题"
    }, {
        code: "2", name: "质量问题"
    }, {
        code: "3", name: "保质期问题"
    }, {
        code: "4", name: "标签问题"
    }, {
        code: "5", name: "订货失误"
    }, {
        code: "6", name: "公司协调"
    }, {
        code: "99", name: "其他"
    }]);


    Dolphin.enum.addEnum("weekDay", [
        {code: "1", name: "周一"},
        {code: "2", name: "周二"},
        {code: "3", name: "周三"},
        {code: "4", name: "周四"},
        {code: "5", name: "周五"},
        {code: "6", name: "周六"},
        {code: "7", name: "周日"}
    ]);

    Dolphin.enum.addEnum("gradeChangeStatus", [
        {code: "1", name: "系统自动升级"},
        {code: "2", name: "系统自动降级"},
        {code: "3", name: "手动升级"},
        {code: "4", name: "手动降级"},
        {code: "5", name: "手动激活"},
        {code: "6", name: "手动冻结"},
        {code: "7", name: "系统保级"}
    ]);

    Dolphin.enum.addEnum("chinaArea", [
        {code: "CN0001", name: "华东"},
        {code: "CN0002", name: "华北"},
        {code: "CN0003", name: "华南"},
        {code: "CN0007", name: "华中"}
    ]);

    Dolphin.enum.addEnum("chinaRegion", [
        {code: "11", name: "北京"},
        {code: "12", name: "天津"},
        {code: "13", name: "河北省"},
        {code: "14", name: "山西省"},
        {code: "15", name: "内蒙古自治区"},
        {code: "21", name: "辽宁省"},
        {code: "22", name: "吉林省"},
        {code: "23", name: "黑龙江省"},
        {code: "31", name: "上海"},
        {code: "32", name: "江苏省"},
        {code: "33", name: "浙江省"},
        {code: "34", name: "安徽省"},
        {code: "35", name: "福建省"},
        {code: "36", name: "江西省"},
        {code: "37", name: "山东省"},
        {code: "41", name: "河南省"},
        {code: "42", name: "湖北省"},
        {code: "43", name: "湖南省"},
        {code: "44", name: "广东省"},
        {code: "45", name: "广西自治区"},
        {code: "46", name: "海南省"},
        {code: "50", name: "重庆"},
        {code: "51", name: "四川省"},
        {code: "52", name: "贵州省"},
        {code: "53", name: "云南省"},
        {code: "54", name: "西藏自治区"},
        {code: "61", name: "陕西省"},
        {code: "62", name: "甘肃省"},
        {code: "63", name: "青海省"},
        {code: "64", name: "宁夏自治区"},
        {code: "65", name: "新疆维吾尔自治区"},
        {code: "71", name: "台湾省"},
        {code: "81", name: "香港特别行政区"},
        {code: "82", name: "澳门特别行政区"},
    ]);

    Dolphin.enum.addEnum('authorityType', [
        {code: '1', name: '新会员奖励'},
        {code: '2', name: '完善个人信息奖励'},
        {code: '3', name: '会员生日奖励'},
        {code: '4', name: '升级奖励'},
        {code: '5', name: '首笔消费奖励'},
        {code: '6', name: '生日月消费奖励'},
        {code: '7', name: '周消费奖励'},
        {code: '8', name: '常客优惠奖励'},
    ]);


    Dolphin.enum.addEnum('chinaCity', [

        {code: "北京市", name: '北京市', logName: "11"},

        {code: "天津市", name: '天津市', logName: "12"},

        {code: "上海市", name: '上海市', logName: "31"},

        {code: "重庆市", name: '重庆市', logName: "50"},

        {code: "广州市", name: '广州市', logName: "44"},
        {code: "韶关市", name: '韶关市', logName: "44"},
        {code: "深圳市", name: '深圳市', logName: "44"},
        {code: "珠海市", name: '珠海市', logName: "44"},
        {code: "汕头市", name: '汕头市', logName: "44"},
        {code: "佛山市", name: '佛山市', logName: "44"},
        {code: "江门市", name: '江门市', logName: "44"},
        {code: "湛江市", name: '湛江市', logName: "44"},
        {code: "茂名市", name: '茂名市', logName: "44"},
        {code: "肇庆市", name: '肇庆市', logName: "44"},
        {code: "惠州市", name: '惠州市', logName: "44"},
        {code: "梅州市", name: '梅州市', logName: "44"},
        {code: "汕尾市", name: '汕尾市', logName: "44"},
        {code: "河源市", name: '河源市', logName: "44"},
        {code: "阳江市", name: '阳江市', logName: "44"},
        {code: "清远市", name: '清远市', logName: "44"},
        {code: "东莞市", name: '东莞市', logName: "44"},
        {code: "中山市", name: '中山市', logName: "44"},
        {code: "潮州市", name: '潮州市', logName: "44"},
        {code: "揭阳市", name: '揭阳市', logName: "44"},
        {code: "云浮市", name: '云浮市', logName: "44"},

        {code: "福州市", name: '福州市', logName: "35"},
        {code: "厦门市", name: '厦门市', logName: "35"},
        {code: "莆田市", name: '莆田市', logName: "35"},
        {code: "三明市", name: '三明市', logName: "35"},
        {code: "泉州市", name: '泉州市', logName: "35"},
        {code: "漳州市", name: '漳州市', logName: "35"},
        {code: "南平市", name: '南平市', logName: "35"},
        {code: "龙岩市", name: '龙岩市', logName: "35"},
        {code: "宁德市", name: '宁德市', logName: "35"},


        {code: "武汉市", name: '武汉市', logName: "42"},
        {code: "荆州市", name: '荆州市', logName: "42"},
        {code: "黄石市", name: '黄石市', logName: "42"},
        {code: "十堰市", name: '十堰市', logName: "42"},
        {code: "宜昌市", name: '宜昌市', logName: "42"},
        {code: "襄樊市", name: '襄樊市', logName: "42"},
        {code: "鄂州市", name: '鄂州市', logName: "42"},
        {code: "荆门市", name: '荆门市', logName: "42"},
        {code: "孝感市", name: '孝感市', logName: "42"},
        {code: "黄冈市", name: '黄冈市', logName: "42"},
        {code: "咸宁市", name: '咸宁市', logName: "42"},
        {code: "随州市", name: '随州市', logName: "42"},
        {code: "仙桃市", name: '仙桃市', logName: "42"},
        {code: "潜江市", name: '潜江市', logName: "42"},
        {code: "天门市", name: '天门市', logName: "42"},
        {code: "神农架林区", name: '神农架林区', logName: "42"},
        {code: "恩施土家族苗族自治州", name: '恩施土家族苗族自治州', logName: "42"},


        {code: "长沙市", name: '长沙市', logName: "43"},
        {code: "株洲市", name: '株洲市', logName: "43"},
        {code: "湘潭市", name: '湘潭市', logName: "43"},
        {code: "衡阳市", name: '衡阳市', logName: "43"},
        {code: "邵阳市", name: '邵阳市', logName: "43"},
        {code: "岳阳市", name: '岳阳市', logName: "43"},
        {code: "常德市", name: '常德市', logName: "43"},
        {code: "张家界市", name: '张家界市', logName: "43"},
        {code: "益阳市", name: '益阳市', logName: "43"},
        {code: "郴州市", name: '郴州市', logName: "43"},
        {code: "永州市", name: '永州市', logName: "43"},
        {code: "怀化市", name: '怀化市', logName: "43"},
        {code: "娄底市", name: '娄底市', logName: "43"},
        {code: "湘西土家族苗族自治州", name: '湘西土家族苗族自治州', logName: "43"},

        {code: "石家庄市", name: '石家庄市', logName: "13"},
        {code: "唐山市", name: '唐山市', logName: "13"},
        {code: "秦皇岛市", name: '秦皇岛市', logName: "13"},
        {code: "邯郸市", name: '邯郸市', logName: "13"},
        {code: "邢台市", name: '邢台市', logName: "13"},
        {code: "保定市", name: '保定市', logName: "13"},
        {code: "张家口市", name: '张家口市', logName: "13"},
        {code: "承德市", name: '承德市', logName: "13"},
        {code: "沧州市", name: '沧州市', logName: "13"},
        {code: "廊坊市", name: '廊坊市', logName: "13"},
        {code: "衡水市", name: '衡水市', logName: "13"},


        {code: "郑州市", name: '郑州市', logName: "41"},
        {code: "开封市", name: '开封市', logName: "41"},
        {code: "洛阳市", name: '洛阳市', logName: "41"},
        {code: "平顶山市", name: '平顶山市', logName: "41"},
        {code: "安阳市", name: '安阳市', logName: "41"},
        {code: "鹤壁市", name: '鹤壁市', logName: "41"},
        {code: "新乡市", name: '新乡市', logName: "41"},
        {code: "焦作市", name: '焦作市', logName: "41"},
        {code: "濮阳市", name: '濮阳市', logName: "41"},
        {code: "许昌市", name: '许昌市', logName: "41"},
        {code: "漯河市", name: '漯河市', logName: "41"},
        {code: "三门峡市", name: '三门峡市', logName: "41"},
        {code: "南阳市", name: '南阳市', logName: "41"},
        {code: "商丘市", name: '商丘市', logName: "41"},
        {code: "信阳市", name: '信阳市', logName: "41"},
        {code: "周口市", name: '周口市', logName: "41"},
        {code: "驻马店市", name: '驻马店市', logName: "41"},


        {code: "太原市", name: '太原市', logName: "14"},
        {code: "大同市", name: '大同市', logName: "14"},
        {code: "阳泉市", name: '阳泉市', logName: "14"},
        {code: "长治市", name: '长治市', logName: "14"},
        {code: "晋城市", name: '晋城市', logName: "14"},
        {code: "朔州市", name: '朔州市', logName: "14"},
        {code: "晋中市", name: '晋中市', logName: "14"},
        {code: "运城市", name: '运城市', logName: "14"},
        {code: "忻州市", name: '忻州市', logName: "14"},
        {code: "临汾市", name: '临汾市', logName: "14"},
        {code: "吕梁市", name: '吕梁市', logName: "14"},

        {code: "西安市", name: '西安市', logName: "61"},
        {code: "铜川市", name: '铜川市', logName: "61"},
        {code: "宝鸡市", name: '宝鸡市', logName: "61"},
        {code: "咸阳市", name: '咸阳市', logName: "61"},
        {code: "渭南市", name: '渭南市', logName: "61"},
        {code: "延安市", name: '延安市', logName: "61"},
        {code: "汉中市", name: '汉中市', logName: "61"},
        {code: "榆林市", name: '榆林市', logName: "61"},
        {code: "安康市", name: '安康市', logName: "61"},
        {code: "商洛市", name: '商洛市', logName: "61"},


        {code: "南京市", name: '南京市', logName: "32"},
        {code: "无锡市", name: '无锡市', logName: "32"},
        {code: "徐州市", name: '徐州市', logName: "32"},
        {code: "常州市", name: '常州市', logName: "32"},
        {code: "苏州市", name: '苏州市', logName: "32"},
        {code: "南通市", name: '南通市', logName: "32"},
        {code: "连云港市", name: '连云港市', logName: "32"},
        {code: "淮安市", name: '淮安市', logName: "32"},
        {code: "盐城市", name: '盐城市', logName: "32"},
        {code: "扬州市", name: '扬州市', logName: "32"},
        {code: "镇江市", name: '镇江市', logName: "32"},
        {code: "泰州市", name: '泰州市', logName: "32"},
        {code: "宿迁市", name: '宿迁市', logName: "32"},


        {code: "杭州市", name: '杭州市', logName: "33"},
        {code: "宁波市", name: '宁波市', logName: "33"},
        {code: "温州市", name: '温州市', logName: "33"},
        {code: "嘉兴市", name: '嘉兴市', logName: "33"},
        {code: "湖州市", name: '湖州市', logName: "33"},
        {code: "绍兴市", name: '绍兴市', logName: "33"},
        {code: "金华市", name: '金华市', logName: "33"},
        {code: "衢州市", name: '衢州市', logName: "33"},
        {code: "舟山市", name: '舟山市', logName: "33"},
        {code: "台州市", name: '台州市', logName: "33"},
        {code: "丽水市", name: '丽水市', logName: "33"},


        {code: "合肥市", name: '合肥市', logName: "34"},
        {code: "芜湖市", name: '芜湖市', logName: "34"},
        {code: "蚌埠市", name: '蚌埠市', logName: "34"},
        {code: "淮南市", name: '淮南市', logName: "34"},
        {code: "马鞍山市", name: '马鞍山市', logName: "34"},
        {code: "淮北市", name: '淮北市', logName: "34"},
        {code: "铜陵市", name: '铜陵市', logName: "34"},
        {code: "安庆市", name: '安庆市', logName: "34"},
        {code: "黄山市", name: '黄山市', logName: "34"},
        {code: "滁州市", name: '滁州市', logName: "34"},
        {code: "阜阳市", name: '阜阳市', logName: "34"},
        {code: "宿州市", name: '宿州市', logName: "34"},
        {code: "巢湖市", name: '巢湖市', logName: "34"},
        {code: "六安市", name: '六安市', logName: "34"},
        {code: "亳州市", name: '亳州市', logName: "34"},
        {code: "池州市", name: '池州市', logName: "34"},
        {code: "宣城市", name: '宣城市', logName: "34"},


        {code: "南昌市", name: '南昌市', logName: "36"},
        {code: "景德镇市", name: '景德镇市', logName: "36"},
        {code: "萍乡市", name: '萍乡市', logName: "36"},
        {code: "九江市", name: '九江市', logName: "36"},
        {code: "新余市", name: '新余市', logName: "36"},
        {code: "鹰潭市", name: '鹰潭市', logName: "36"},
        {code: "赣州市", name: '赣州市', logName: "36"},
        {code: "吉安市", name: '吉安市', logName: "36"},
        {code: "宜春市", name: '宜春市', logName: "36"},
        {code: "抚州市", name: '抚州市', logName: "36"},
        {code: "上饶市", name: '上饶市', logName: "36"},


        {code: "济南市", name: '济南市', logName: "37"},
        {code: "青岛市", name: '青岛市', logName: "37"},
        {code: "淄博市", name: '淄博市', logName: "37"},
        {code: "枣庄市", name: '枣庄市', logName: "37"},
        {code: "东营市", name: '东营市', logName: "37"},
        {code: "烟台市", name: '烟台市', logName: "37"},
        {code: "潍坊市", name: '潍坊市', logName: "37"},
        {code: "济宁市", name: '济宁市', logName: "37"},
        {code: "泰安市", name: '泰安市', logName: "37"},
        {code: "威海市", name: '威海市', logName: "37"},
        {code: "日照市", name: '日照市', logName: "37"},
        {code: "莱芜市", name: '莱芜市', logName: "37"},
        {code: "临沂市", name: '临沂市', logName: "37"},
        {code: "德州市", name: '德州市', logName: "37"},
        {code: "聊城市", name: '聊城市', logName: "37"},
        {code: "滨州市", name: '滨州市', logName: "37"},
        {code: "荷泽市", name: '荷泽市', logName: "37"},


        {code: "沈阳市", name: '沈阳市', logName: "21"},
        {code: "大连市", name: '大连市', logName: "21"},
        {code: "鞍山市", name: '鞍山市', logName: "21"},
        {code: "抚顺市", name: '抚顺市', logName: "21"},
        {code: "本溪市", name: '本溪市', logName: "21"},
        {code: "丹东市", name: '丹东市', logName: "21"},
        {code: "锦州市", name: '锦州市', logName: "21"},
        {code: "营口市", name: '营口市', logName: "21"},
        {code: "阜新市", name: '阜新市', logName: "21"},
        {code: "辽阳市", name: '辽阳市', logName: "21"},
        {code: "盘锦市", name: '盘锦市', logName: "21"},
        {code: "铁岭市", name: '铁岭市', logName: "21"},
        {code: "朝阳市", name: '朝阳市', logName: "21"},
        {code: "葫芦岛市", name: '葫芦岛市', logName: "21"},


        {code: "长春市", name: '长春市', logName: "22"},
        {code: "吉林市", name: '吉林市', logName: "22"},
        {code: "四平市", name: '四平市', logName: "22"},
        {code: "辽源市", name: '辽源市', logName: "22"},
        {code: "通化市", name: '通化市', logName: "22"},
        {code: "白山市", name: '白山市', logName: "22"},
        {code: "松原市", name: '松原市', logName: "22"},
        {code: "白城市", name: '白城市', logName: "22"},
        {code: "延边朝鲜族自治州", name: '延边朝鲜族自治州', logName: "22"},


        {code: "哈尔滨市", name: '哈尔滨市', logName: "23"},
        {code: "齐齐哈尔市", name: '齐齐哈尔市', logName: "23"},
        {code: "鸡西市", name: '鸡西市', logName: "23"},
        {code: "鹤岗市", name: '鹤岗市', logName: "23"},
        {code: "双鸭山市", name: '双鸭山市', logName: "23"},
        {code: "大庆市", name: '大庆市', logName: "23"},
        {code: "伊春市", name: '伊春市', logName: "23"},
        {code: "佳木斯市", name: '佳木斯市', logName: "23"},
        {code: "七台河市", name: '七台河市', logName: "23"},
        {code: "牡丹江市", name: '牡丹江市', logName: "23"},
        {code: "黑河市", name: '黑河市', logName: "23"},
        {code: "绥化市", name: '绥化市', logName: "23"},
        {code: "大兴安岭地区", name: '大兴安岭地区', logName: "23"},


        {code: "成都市", name: '成都市', logName: "51"},
        {code: "自贡市", name: '自贡市', logName: "51"},
        {code: "攀枝花市", name: '攀枝花市', logName: "51"},
        {code: "泸州市", name: '泸州市', logName: "51"},
        {code: "德阳市", name: '德阳市', logName: "51"},
        {code: "绵阳市", name: '绵阳市', logName: "51"},
        {code: "广元市", name: '广元市', logName: "51"},
        {code: "遂宁市", name: '遂宁市', logName: "51"},
        {code: "内江市", name: '内江市', logName: "51"},
        {code: "乐山市", name: '乐山市', logName: "51"},
        {code: "南充市", name: '南充市', logName: "51"},
        {code: "眉山市", name: '眉山市', logName: "51"},
        {code: "宜宾市", name: '宜宾市', logName: "51"},
        {code: "广安市", name: '广安市', logName: "51"},
        {code: "达州市", name: '达州市', logName: "51"},
        {code: "雅安市", name: '雅安市', logName: "51"},
        {code: "巴中市", name: '巴中市', logName: "51"},
        {code: "资阳市", name: '资阳市', logName: "51"},
        {code: "阿坝藏族羌族自治州", name: '阿坝藏族羌族自治州', logName: "51"},
        {code: "甘孜藏族自治州", name: '甘孜藏族自治州', logName: "51"},
        {code: "凉山彝族自治州", name: '凉山彝族自治州', logName: "51"},


        {code: "贵阳市", name: '贵阳市', logName: "52"},
        {code: "六盘水市", name: '六盘水市', logName: "52"},
        {code: "遵义市", name: '遵义市', logName: "52"},
        {code: "安顺市", name: '安顺市', logName: "52"},
        {code: "铜仁地区", name: '铜仁地区', logName: "52"},
        {code: "黔西南布依族苗族自治州", name: '黔西南布依族苗族自治州', logName: "52"},
        {code: "毕节地区", name: '毕节地区', logName: "52"},
        {code: "黔东南苗族侗族自治州", name: '黔东南苗族侗族自治州', logName: "52"},
        {code: "黔南布依族苗族自治州", name: '黔南布依族苗族自治州', logName: "52"},


        {code: "昆明市", name: '昆明市', logName: "53"},
        {code: "曲靖市", name: '曲靖市', logName: "53"},
        {code: "玉溪市", name: '玉溪市', logName: "53"},
        {code: "保山市", name: '保山市', logName: "53"},
        {code: "昭通市", name: '昭通市', logName: "53"},
        {code: "丽江市", name: '丽江市', logName: "53"},
        {code: "思茅市", name: '思茅市', logName: "53"},
        {code: "临沧市", name: '临沧市', logName: "53"},
        {code: "楚雄彝族自治州", name: '楚雄彝族自治州', logName: "53"},
        {code: "红河哈尼族彝族自治州", name: '红河哈尼族彝族自治州', logName: "53"},
        {code: "文山壮族苗族自治州", name: '文山壮族苗族自治州', logName: "53"},
        {code: "西双版纳傣族自治州", name: '西双版纳傣族自治州', logName: "53"},
        {code: "大理白族自治州", name: '大理白族自治州', logName: "53"},
        {code: "德宏傣族景颇族自治州", name: '德宏傣族景颇族自治州', logName: "53"},
        {code: "怒江傈僳族自治州", name: '怒江傈僳族自治州', logName: "53"},
        {code: "迪庆藏族自治州", name: '迪庆藏族自治州', logName: "53"},


        {code: "拉萨市", name: '拉萨市', logName: "54"},
        {code: "昌都地区", name: '昌都地区', logName: "54"},
        {code: "山南地区", name: '山南地区', logName: "54"},
        {code: "日喀则地区", name: '日喀则地区', logName: "54"},
        {code: "那曲地区", name: '那曲地区', logName: "54"},
        {code: "阿里地区", name: '阿里地区', logName: "54"},
        {code: "林芝地区", name: '林芝地区', logName: "54"},

        {code: "兰州市", name: '兰州市', logName: "62"},
        {code: "嘉峪关市", name: '嘉峪关市', logName: "62"},
        {code: "金昌市", name: '金昌市', logName: "62"},
        {code: "白银市", name: '白银市', logName: "62"},
        {code: "天水市", name: '天水市', logName: "62"},
        {code: "武威市", name: '武威市', logName: "62"},
        {code: "张掖市", name: '张掖市', logName: "62"},
        {code: "平凉市", name: '平凉市', logName: "62"},
        {code: "酒泉市", name: '酒泉市', logName: "62"},
        {code: "庆阳市", name: '庆阳市', logName: "62"},
        {code: "定西市", name: '定西市', logName: "62"},
        {code: "陇南市", name: '陇南市', logName: "62"},
        {code: "临夏回族自治州", name: '临夏回族自治州', logName: "62"},
        {code: "甘南藏族自治州", name: '甘南藏族自治州', logName: "62"},


        {code: "西宁市", name: '西宁市', logName: "63"},
        {code: "海东地区", name: '海东地区', logName: "63"},
        {code: "海北藏族自治州", name: '海北藏族自治州', logName: "63"},
        {code: "黄南藏族自治州", name: '黄南藏族自治州', logName: "63"},
        {code: "海南藏族自治州", name: '海南藏族自治州', logName: "63"},
        {code: "果洛藏族自治州", name: '果洛藏族自治州', logName: "63"},
        {code: "玉树藏族自治州", name: '玉树藏族自治州', logName: "63"},
        {code: "海西蒙古族藏族自治州", name: '海西蒙古族藏族自治州', logName: "63"},


        {code: "银川市", name: '银川市', logName: "64"},
        {code: "石嘴山市", name: '石嘴山市', logName: "64"},
        {code: "吴忠市", name: '吴忠市', logName: "64"},
        {code: "固原市", name: '固原市', logName: "64"},
        {code: "中卫市", name: '中卫市', logName: "64"},


        {code: "乌鲁木齐市", name: '乌鲁木齐市', logName: "65"},
        {code: "克拉玛依市", name: '克拉玛依市', logName: "65"},
        {code: "吐鲁番地区", name: '吐鲁番地区', logName: "65"},
        {code: "哈密地区", name: '哈密地区', logName: "65"},
        {code: "昌吉回族自治州", name: '昌吉回族自治州', logName: "65"},
        {code: "博尔塔拉蒙古自治州", name: '博尔塔拉蒙古自治州', logName: "65"},
        {code: "巴音郭楞蒙古自治州", name: '巴音郭楞蒙古自治州', logName: "65"},
        {code: "阿克苏地区", name: '阿克苏地区', logName: "65"},
        {code: "克孜勒苏柯尔克孜自治州", name: '克孜勒苏柯尔克孜自治州', logName: "65"},
        {code: "喀什地区", name: '喀什地区', logName: "65"},
        {code: "和田地区", name: '和田地区', logName: "65"},
        {code: "伊犁哈萨克自治州", name: '伊犁哈萨克自治州', logName: "65"},
        {code: "塔城地区", name: '塔城地区', logName: "65"},
        {code: "阿勒泰地区", name: '阿勒泰地区', logName: "65"},
        {code: "省直辖行政单位", name: '省直辖行政单位', logName: "65"},


        {code: "呼和浩特市", name: '呼和浩特市', logName: "15"},
        {code: "包头市", name: '包头市', logName: "15"},
        {code: "乌海市", name: '乌海市', logName: "15"},
        {code: "赤峰市", name: '赤峰市', logName: "15"},
        {code: "通辽市", name: '通辽市', logName: "15"},
        {code: "鄂尔多斯市", name: '鄂尔多斯市', logName: "15"},
        {code: "呼伦贝尔市", name: '呼伦贝尔市', logName: "15"},
        {code: "巴彦淖尔市", name: '巴彦淖尔市', logName: "15"},
        {code: "乌兰察布市", name: '乌兰察布市', logName: "15"},
        {code: "兴安盟", name: '兴安盟', logName: "15"},
        {code: "锡林郭勒盟", name: '锡林郭勒盟', logName: "15"},
        {code: "阿拉善盟", name: '阿拉善盟', logName: "15"},


        {code: "南宁市", name: '南宁市', logName: "45"},
        {code: "柳州市", name: '柳州市', logName: "45"},
        {code: "桂林市", name: '桂林市', logName: "45"},
        {code: "梧州市", name: '梧州市', logName: "45"},
        {code: "北海市", name: '北海市', logName: "45"},
        {code: "防城港市", name: '防城港市', logName: "45"},
        {code: "钦州市", name: '钦州市', logName: "45"},
        {code: "贵港市", name: '贵港市', logName: "45"},
        {code: "玉林市", name: '玉林市', logName: "45"},
        {code: "百色市", name: '百色市', logName: "45"},
        {code: "贺州市", name: '贺州市', logName: "45"},
        {code: "河池市", name: '河池市', logName: "45"},
        {code: "来宾市", name: '来宾市', logName: "45"},
        {code: "崇左市", name: '崇左市', logName: "45"},


        {code: "海口市", name: '海口市', logName: "46"},
        {code: "三亚市", name: '三亚市', logName: "46"},
        {code: "五指山市", name: '五指山市', logName: "46"},
        {code: "琼海市", name: '琼海市', logName: "46"},
        {code: "儋州市", name: '儋州市', logName: "46"},
        {code: "文昌市", name: '文昌市', logName: "46"},
        {code: "万宁市", name: '万宁市', logName: "46"},
        {code: "东方市", name: '东方市', logName: "46"},
        {code: "三沙市", name: '三沙市', logName: "46"},
        {code: "定安县", name: '定安县', logName: "46"},
        {code: "屯昌县", name: '屯昌县', logName: "46"},
        {code: "澄迈县", name: '澄迈县', logName: "46"},
        {code: "临高县", name: '临高县', logName: "46"},
        {code: "白沙黎族自治县", name: '白沙黎族自治县', logName: "46"},
        {code: "昌江黎族自治县", name: '昌江黎族自治县', logName: "46"},
        {code: "乐东黎族自治县", name: '乐东黎族自治县', logName: "46"},
        {code: "陵水黎族自治县", name: '陵水黎族自治县', logName: "46"},
        {code: "保亭黎族苗族自治县", name: '保亭黎族苗族自治县', logName: "46"},
        {code: "琼中黎族苗族自治县", name: '琼中黎族苗族自治县', logName: "46"},


        {code: "香港岛", name: '香港岛', logName: "81"},
        {code: "九龙", name: '九龙', logName: "81"},
        {code: "新界", name: '新界', logName: "81"},

        {code: "澳门", name: '澳门', logName: "82"},

        {code: "台北区域", name: '台北区域', logName: "71"},
        {code: "台中区域", name: '台中区域', logName: "71"},
        {code: "台南区域", name: '台南区域', logName: "71"},
        {code: "其它区域", name: '其它区域', logName: "71"},


    ]);

    Dolphin.enum.addEnum('typeSelect', [
        {code: '1', name: '新增'},
        {code: '2', name: '修改'},
        {code: '3', name: '删除'},
        {code: '4', name: 'Excel导出'},
    ]);

    Dolphin.enum.addEnum('logModule', [
        {code: 'auth', name: 'auth'},
        {code: 'crm', name: 'crm'},
        {code: 'export', name: 'export'},
        {code: 'pms', name: 'pms'},
        {code: 'pos', name: 'pos'},
        {code: 'oms', name: 'oms'},
    ]);

    Dolphin.enum.addEnum('logMenu', [

        {code: 'qrcode', name: '二维码管理'},
        {code: 'channel', name: '渠道管理'},
        {code: 'user', name: '会员信息'},
        {code: 'message', name: '留言管理'},
        {code: 'levelManage', name: '会员等级管理'},
        {code: 'userPoint', name: '积分/等级'},
        {code: 'pointStoreType', name: '积分商品与类型'},
        {code: 'advertise', name: '广告管理'},
        {code: 'saverTicket', name: '优惠券管理'},
        {code: 'account', name: '账号管理'},
        {code: 'role', name: '角色管理'},
    ]);

    Dolphin.enum.addEnum('crmChannel', [
        {code: 'website', name: '官网'},
        {code: 'promotion', name: '活动'},
        {code: 'wechat', name: '微信注册'},
        {code: 'alipay', name: '支付宝注册'},
        {code: 'invite', name: '邀请注册'},
        {code: 'store', name: '门店'},
        {code: 'backend', name: '后台创建'},
        {code: 'wifi', name: 'Wifi注册'}
    ]);

    Dolphin.enum.addEnum('couponTypeLimit', [
        {code: '1', name: '永久有效'},
        {code: '2', name: '下发后'},
        {code: '4', name: '固定日期'}
    ]);

    Dolphin.enum.addEnum('couponMethod',
        [{code: 'sent', name: '手动下发'}, {
            code: 'point',
            name: '积分兑换'
        }, {code: 'activity', name: '活动领取'}, {code: 'rights', name: "会员权益"}, {code: 'transfer', name: "会员转增"}]);

    Dolphin.enum.addEnum('qrcodeType', [{code: 'snsapi_userinfo', name: '网页授权'}, {code: 'snsapi_base', name: '应用授权'}]);

    Dolphin.enum.addEnum('smsType', [{code: 'verify', name: '验证码'},
        {code: 'promotion', name: '营销'},
        {code: 'pointChange', name: '积分变动'},
        {code: 'saleChange', name: '消费提醒'},
        {code: 'gradeChange', name: '等级变动'},
        {code: 'couponFetch', name: '礼券领取'}]);

    Dolphin.enum.addEnum('timeArea', [
        {code: 'T0800', name: '8:00'},
        {code: 'T0830', name: '8:30'},
        {code: 'T0900', name: '9:00'},
        {code: 'T0930', name: '9:30'},
        {code: 'T1000', name: '10:00'},
        {code: 'T1030', name: '10:30'},
        {code: 'T1100', name: '11:00'},
        {code: 'T1130', name: '11:30'},
        {code: 'T1200', name: '12:00'},
        {code: 'T1230', name: '12:30'},
        {code: 'T1300', name: '13:00'},
        {code: 'T1330', name: '13:30'},
        {code: 'T1400', name: '14:00'},
        {code: 'T1430', name: '14:30'},
        {code: 'T1500', name: '15:00'},
        {code: 'T1530', name: '15:30'},
        {code: 'T1600', name: '16:00'},
        {code: 'T1630', name: '16:30'},
        {code: 'T1700', name: '17:00'},
        {code: 'T1730', name: '17:30'},
        {code: 'T1800', name: '18:00'},
        {code: 'T1830', name: '18:30'},
        {code: 'T1900', name: '19:00'},
        {code: 'T1930', name: '19:30'},
        {code: 'T2000', name: '20:00'},
        {code: 'T2030', name: '20:30'},
        {code: 'T2100', name: '21:00'},
        {code: 'T2130', name: '21:30'},
        {code: 'T2200', name: '22:00'},
        {code: 'T2230', name: '22:30'},
        {code: 'T2300', name: '23:00'},
        {code: 'T2330', name: '23:30'},
        {code: 'T0000', name: '0:00'},
        {code: 'T0030', name: '0:30'},
        {code: 'T0100', name: '1:00'},
        {code: 'T0130', name: '1:30'},
        {code: 'T0200', name: '2:00'},
        {code: 'T0230', name: '2:30'},
        {code: 'T0300', name: '3:00'},
        {code: 'T0330', name: '3:30'}
    ]);

})(jQuery);