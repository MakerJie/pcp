package com.pcp.pos;

import com.pcp.common.util.ContextUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * POS服务启动
 */
@SpringBootApplication
@EnableEurekaClient
@ComponentScan({"com.pcp.common","com.pcp.pos"})
public class PosBootstrap {

    /**
     * 启动方法
     *
     * @param args 参数
     */
    public static void main(String[] args) {
        ContextUtil.current = SpringApplication.run(PosBootstrap.class, args);
        ContextUtil.dumpStartupInfo();
    }

}
