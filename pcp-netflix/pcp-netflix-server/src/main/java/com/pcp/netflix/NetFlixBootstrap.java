package com.pcp.netflix;

import com.pcp.common.util.ContextUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;

/**
 * Eureka 注册中心服务
 * Created by Silence on 2017/6/30.
 */
@SpringBootApplication
@EnableEurekaServer
@EnableHystrixDashboard
public class NetFlixBootstrap {

    /**
     * 服务启动
     * @param args 启动参数
     */
    public static void main(String[] args) {
        ContextUtil.current = SpringApplication.run(NetFlixBootstrap.class,args);
        ContextUtil.dumpStartupInfo();
    }
}
