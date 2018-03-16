package com.pcp.log;

import com.pcp.common.util.ContextUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

import java.time.LocalDateTime;

/**
 * 日志服务启动类
 * Created by Ning on 2017/9/4.
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@ComponentScan("com.pcp")
public class LogBootstrap {

    /**
     * 启动方法
     *
     * @param args 参数
     */
    public static void main(String[] args) {
        ContextUtil.current = SpringApplication.run(LogBootstrap.class, args);
        ContextUtil.dumpStartupInfo();
    }
}
