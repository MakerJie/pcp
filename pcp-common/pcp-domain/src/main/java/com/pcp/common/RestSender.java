package com.pcp.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import javafx.util.Callback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClientException;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Rest请求发送
 * Created by Silence on 2017/7/17.
 */
public class RestSender {

    private final static Logger LOGGER = LoggerFactory.getLogger(RestSender.class);

    private static String uri = "";

    private static String token = "";

    private static Map<String, String> endPoints = new HashMap<>();

    /**
     * 发送请求数据
     * @param endpoint
     * @param request
     * @param callback
     * @param err
     * @throws RuntimeException
     */
    public static void sendRequestForList(String endpoint, Object request, Callback<List<Map<String, Object>>, ?> callback, Callback<String, String> err)
            throws RuntimeException {
        sendRequestForList(endpoint, "ITEM", request, callback, err);
    }

    /**
     * 发送请求数据
     * @param endpoint
     * @param itemNode
     * @param request
     * @param callback
     * @param err
     * @throws RuntimeException
     */
    @SuppressWarnings("unchecked")
    public static void sendRequestForList(String endpoint, Object itemNode, Object request, Callback<List<Map<String, Object>>, ?> callback, Callback<String, String> err)
            throws RuntimeException {
        if (endPoints.get(endpoint) != null)
            endpoint = endPoints.get(endpoint);
        if (itemNode == null)
            itemNode = "ITEM";
        LOGGER.info(uri + endpoint);
        try {
            LOGGER.info(BreezeeUtils.objectMapper.writeValueAsString(request));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("token", RestSender.token);//005056BE28601EE7A3AB82D1DEE80946
        HttpEntity<Object> requestEntity = new HttpEntity<>(request, headers);
        Map<String, Object> ret = BreezeeUtils.restTemplate.postForObject(uri + endpoint, requestEntity, Map.class);
        System.out.println(ret);
        Map<String, Object> m = (Map<String, Object>) ret.get("RESPONSE");
        if (m.get("TYPE") != null && m.get("TYPE").toString().equals("E")) {
            if (err != null)
                err.call(m.get("MESSAGE") + "");
        }
        List<Map<String, Object>> l = (List<Map<String, Object>>) m.get(itemNode.toString());
        if (callback != null) {
            callback.call(l);
        }
    }

    /**
     * 发送sap请求
     * @param endpoint
     * @param request
     * @param callback
     * @throws BreezeeException
     */
    @SuppressWarnings("unchecked")
    public static void sendRequestForMap(String endpoint, Object request, Callback<Map<String, Object>, ?> callback, Callback<String, String> err, Map<String, Object> rep)
            throws BreezeeException {
        if (rep == null)
            rep = new HashMap<>();
        rep.put("rqTime",new Date());
        rep.put("endpoint",endpoint);
        if (endPoints.get(endpoint) != null) {
            endpoint = endPoints.get(endpoint);
        }
        try {
            LOGGER.info(BreezeeUtils.objectMapper.writeValueAsString(request));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        if (!endpoint.startsWith("http")) {
            endpoint = RestSender.uri + endpoint;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("token", RestSender.token);//005056BE28601EE7A3AB82D1DEE80946
        HttpEntity<Object> requestEntity = new HttpEntity<Object>(request, headers);
        rep.put("success", false);
        rep.put("request", request);
        Map<String, Object> m;
        try {
            Map<String, Object> ret = BreezeeUtils.restTemplate.postForObject(endpoint, requestEntity, Map.class);
            m = (Map<String, Object>) ret.get("RESPONSE");
            rep.put("result", ret);
            if (m.get("TYPE") != null) {
                if (m.get("TYPE").toString().equals("E")) {
                    rep.put("errMsg", m.get("MESSAGE"));
                    if (err != null) {
                        err.call(m.get("MESSAGE") + "");
                    }
                } else {
                    rep.put("success", true);
                    if (callback != null) {
                        callback.call(m);
                    }
                }
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            rep.put("errMsg", e.getMessage());
        }
    }

    public static void sendRequestForMap(String endpoint, Object request, Callback<Map<String, Object>, ?> callback, Callback<String, String> err)
            throws BreezeeException {
        sendRequestForMap(endpoint, request, callback, err, null);
    }

    public static void setUri(String uri) {
        RestSender.uri = uri;
    }

    public static String getUri() {
        return uri;
    }

    public static String getToken() {
        return token;
    }

    public static void setToken(String token) {
        RestSender.token = token;
    }

    public static void setEndPoints(Map<String, String> endPoints) {
        RestSender.endPoints = endPoints;
    }
}
