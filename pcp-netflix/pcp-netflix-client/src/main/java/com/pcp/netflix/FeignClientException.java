package com.pcp.netflix;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import javafx.util.Callback;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.Map;

/**
 * 远程调用出现的异常
 * Created by Silence on 2017/8/3.
 */
public class FeignClientException {

    private final static ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    public static String populateMsg(Exception ex, Callback... callback) {
        String msg = ex.getMessage();
        if (ex instanceof FeignException) {
            String[] tmp = msg.split("\n");
            if (tmp.length > 1) {
                try {
                    Map<String, String> m = mapper.readValue(tmp[1], Map.class);
                    if (callback != null && callback.length > 0)
                        callback[0].call(m);
                    return m.get("message");
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        if (StringUtils.isEmpty(msg))
            msg = "未知异常原因";
        return msg;
    }
}
