package com.pcp.crm.task;

import com.pcp.api.crm.domain.CouponStatusEnum;
import com.pcp.common.IServiceLayer;
import com.pcp.crm.entity.CouponEntity;
import com.pcp.crm.repository.ICouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * 优惠券的定时任务
 * Created by Silence on 2017/11/14.
 */
@Component
public class CouponTask implements IServiceLayer {

//    private final static long PER = 1000 * 60 * 60 * 60 * 2;
    private final static long PER = 1000 * 60 * 60 * 24;

    @Autowired
    private ICouponRepository couponRepository;

    @Autowired
    private Environment environment;

    @Scheduled(cron = "15 0/10 * * * ?")
    public Map<String, Object> execute() {
        String up = environment.getProperty("crm.task.run");
        if (up != null && "true".equals(up)) {
            List<CouponEntity> l = couponRepository.findByStatus(CouponStatusEnum.TRANSFER.getValue());
            l.forEach(a -> {
                if (a.getDrawDate() != null) {
                    long t = System.currentTimeMillis() - a.getDrawDate().getTime();
                    if (t >= PER) {
                        a.setStatus(CouponStatusEnum.CREATED.getValue());
                        a.setDrawDate(null);
                        a.save();
                    }
                }
            });
        }
        return null;
    }
}
