package com.pcp.crm.task;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.*;
import com.pcp.api.crm.service.ILevelManageService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.DynamicSpecifications;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.AuthorityEntity;
import com.pcp.crm.entity.GradeChangeEntity;
import com.pcp.crm.entity.UserEntity;
import com.pcp.crm.entity.UserPointHistoryEntity;
import com.pcp.crm.impl.UserServiceImpl;
import com.pcp.crm.repository.IUserPointHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 会员定时任务
 * * 为了支持持久化层的查询，我们需要继承IServiceLayer
 * Created by Silence on 2017/10/30.
 */
@Component(value = "userPointTask")
public class UserPointTask implements IServiceLayer {

    private final static Logger LOGGER = LoggerFactory.getLogger(UserPointTask.class);

    @Resource(name = CrmAPI.BEAN_USER_SERVICE)
    private UserServiceImpl userService;

    @Resource(name = CrmAPI.BEAN_LEVELMANAGE_SERVICE)
    private ILevelManageService levelManageService;

    @Autowired
    private IUserPointHistoryRepository userPointHistoryRepository;

    @Autowired
    private Environment environment;

    /**
     * 生日礼券
     *
     * @return
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public Map<String, Object> execute() {
        String up = environment.getProperty("crm.task.run");
        Map<String, Object> m = new HashMap<>();
        if (up != null && "true".equals(up)) {
            long t = System.currentTimeMillis();
            //去查找，生日是当月的，以及生日是下个月的会员
            LocalDate now = LocalDate.now();
            int to = now.getDayOfMonth();
            now = now.plusMonths(1).withDayOfMonth(1);
            AuthorityEntity ae = new AuthorityEntity();
            ae.addProperties("type", UserRightsEnum.C.getValue() + "");
            ae.addProperties("beginTime_le_null", new Date());
            ae.addProperties("endTime_gt_null", new Date());
            UserEntity ue = new UserEntity();
            LocalDate md;
            for (AuthorityInfo a : ae.list()) {
                Map<String, Object> ru = a.getRule();
                if (ru.get("cardLevel") != null) {
                    String rs = ru.get("cardLevel").toString();
                    List<Integer> l = new ArrayList<>();
                    for (String s : rs.split(",")) {
                        l.add(Integer.parseInt(s.trim()));
                    }
                    //2. 找到提前ahead天内的所有的会员，取生日为当天的会员
                    if (ru.get("rule") != null) {
                        Integer ahead = Integer.parseInt(ru.get("rule").toString());
                        md = now.plusDays(0 - ahead);
                        if (to >= md.getDayOfMonth()) {
                            //1.  找下个月的会员，然后发券
                            ue.addProperties("lastBirthRights_not_equal_andnull", now.getYear());
                            ue.addProperties("birthday_like", now.toString().substring(5, 8));
                            ue.addProperties("cardLevel_in", l);
                            List<UserEntity> ul = ue.myRepository().findAll(DynamicSpecifications.createSpecification(ue.getProperties()));
                            birthday(ul, a);
                            //2. 找生日在当前日历内，但还没有发券的会员
                            StringBuilder sb = new StringBuilder();
                            for (int i = 1; i < ahead; i++) {
                                sb.append(now.plusDays(0 - i).toString().substring(5)).append(",");
                            }
                            ue.getProperties().remove("birthday_like");
                            ue.addProperties("birthday_or", sb.toString());
                            ul = ue.myRepository().findAll(DynamicSpecifications.createSpecification(ue.getProperties()));
                            birthday(ul, a);
                        }
                    }
                }
            }
            LOGGER.info("birthday check spend:" + (System.currentTimeMillis() - t) / 1000);
        }
        return m;
    }

    private void birthday(List<UserEntity> ul, AuthorityInfo a) {
        ul.forEach(b -> {
            int ret = userService.rightPoint(a, b, null);
            ret += userService.rightCoupon(a, b);
            if (ret > 0) {
                b.setLastBirthRights(LocalDate.now().getYear());
                b.save();
            }
        });
    }

    /**
     * 每天凌晨5点去看其保级积分
     *
     * @return
     */
//    @Scheduled(cron = "0 5 6 * * ?")
    public Map<String, Object> userLevelScan() {
        Map<String, Object> m = new HashMap<>();
        String up = environment.getProperty("crm.task.run");

        if (up != null && "true".equals(up)) {
            UserEntity ue = new UserEntity();
            LocalDateTime d = LocalDateTime.now();
            d = d.withHour(0).withMinute(0).withSecond(0);
            LocalDateTime dd = d.plusYears(0 - UserPointHistoryInfo.EXPIRE_YEAR).plusDays(0 - UserPointHistoryInfo.EXPIRE_DAY);
            //取周期内保级用户
            ue.addProperties("levelUpDate_le_null", BreezeeUtils.localDateTime2Date(dd.withHour(23).withMinute(59).withSecond(59)));
            ue.addProperties("levelUpDate_gt_null", BreezeeUtils.localDateTime2Date(dd));
            ue.addProperties("keepPoint_gt", 0);
            List<UserEntity> l = ue.myRepository().findAll(DynamicSpecifications.createSpecification(ue.getProperties()));
            System.out.println("................"+l.size());
            l.forEach(a -> {
                LevelManageInfo levelManageInfo = null;
                try {
                    levelManageInfo = levelManageService.findByLevel(a.getCardLevel());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                GradeChangeInfo gradeChangeInfo = new GradeChangeInfo();
                gradeChangeInfo.setBeforeLevel(a.getCardLevel());
                gradeChangeInfo.setAfterLevel(a.getCardLevel());
                gradeChangeInfo.setName(GradeChangeEnum.G.getValue() + "");
                gradeChangeInfo.setRemark("保级积分" + a.getKeepPoint() + "达到保级标准:" + (levelManageInfo != null ? levelManageInfo.getSafeguard() : "未知"));
                if (levelManageInfo != null && levelManageInfo.getFluctuate() == 1) {
                    if (a.getKeepPoint() != null
                            && a.getKeepPoint() < levelManageInfo.getSafeguard()
                            && a.getCardLevel() > 1) {
                        int ou = a.getCardLevel();
                        a.setCardLevel(a.getCardLevel() - 1);//降级
                        if (a.getCardLevel() > 1) {
                            //在判断是否满足此时的卡等级的
                            LevelManageInfo anLevel = levelManageService.findByLevel(a.getCardLevel());
                            if (anLevel != null && anLevel.getFluctuate() == 1 && a.getKeepPoint() < anLevel.getSafeguard()) {
                                a.setCardLevel(a.getCardLevel() - 1);
                            }
                        }
                        gradeChangeInfo.setBeforeLevel(ou);
                        gradeChangeInfo.setAfterLevel(a.getCardLevel());
                        gradeChangeInfo.setName(GradeChangeEnum.B.getValue() + "");
                        gradeChangeInfo.setRemark("保级积分" + a.getKeepPoint() + "未达到保级标准" + levelManageInfo.getSafeguard());
                    }
                }
                if (StringUtils.isEmpty(gradeChangeInfo.getCode())) {
                    gradeChangeInfo.setCode(SystemTool.getCode());
                }
                gradeChangeInfo.setCreator("system");
                gradeChangeInfo.setUpdator("system");
                gradeChangeInfo.setOperType(OperTypeEnum.WRITE);
                GradeChangeEntity ge = new GradeChangeEntity().createWithInfo(gradeChangeInfo);
                ge.setUser(a);
                ge.save();
                a.setKeepPoint(0);
                a.save();
            });
        }
        return m;
    }

    /**
     * 每天凌晨1点去看其过期积分
     *
     * @return
     */
    @SuppressWarnings("unchecked")
    @Scheduled(cron = "0 0 1 * * ?")
    public Map<String, Object> userSalePointScan() {
        Map<String, Object> m = new HashMap<>();
        String up = environment.getProperty("crm.task.run");
        System.out.println("userSalePointScan..........................");
        if (up != null && "true".equals(up)) {
            //查询去年的积分
            LocalDateTime ld = LocalDateTime.now();
            ld = ld.withHour(0).withMinute(0).withSecond(0);
            UserPointHistoryEntity uhe = new UserPointHistoryEntity();
            uhe.addProperties("endTime_le", BreezeeUtils.localDateTime2Date(ld));
            uhe.addProperties("status", 1);
            uhe.addProperties("remainAmount_gt_null", 1);
            List<UserPointHistoryEntity> ule = userPointHistoryRepository.findAll(DynamicSpecifications.createSpecification(uhe.getProperties()));
            System.out.println(ule.size() + "..........................");
            ule.forEach(a -> {
                if (a.getRemainAmount() == null) {
                    a.setRemainAmount(a.getAmount());
                }
                UserEntity mu = a.getUser();
                if (mu != null) {
                    //如果是消费积分，从消费积分余额中扣除掉。同时从积分总额中扣除掉
                    if ("2".equals(a.getPointType())) {
                        if (mu.getSalePoint() != null) {
                            int y = mu.getSalePoint() - a.getRemainAmount();
                            mu.setSalePoint(y > 0 ? y : 0);
                        }
                    }
                    if (mu.getTotalPoint() != null) {
                        int z = mu.getTotalPoint() - a.getRemainAmount();
                        mu.setTotalPoint(z > 0 ? z : 0);
                    }
                    mu.save();
                } else {
                    System.out.println("user point has no user");
                }
                a.setStatus(0);
                a.save();
            });
        }
        return m;
    }
}
