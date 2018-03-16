/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.event;

import com.pcp.common.exception.EventException;

import java.util.Collections;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.concurrent.*;

/**
 * 事件分发中心
 * Created by Silence on 2016/4/28.
 */
public class EventCenter {

    /**
     * 监听器列表
     */
    private SortedSet<EventListener> listeners = Collections.synchronizedSortedSet(new TreeSet<>());

    private EventStore eventStore;

    private ExecutorService threadPool = null;

    /**
     * 默认构造方法
     */
    public EventCenter() {

    }

    /**
     * 构建事件中心
     *
     * @param listeners 事件监听器
     */
    public EventCenter(Set<EventListener> listeners) {
        if (this.listeners == null) {
            this.listeners = new TreeSet<>();
        }
        this.listeners.addAll(listeners);
    }

    /**
     * 运行期增加监听
     *
     * @param listener 事件监听
     */
    public synchronized void addListeners(EventListener listener) {
        if (this.listeners == null) {
            this.listeners = new TreeSet<>();
        }
        this.listeners.add(listener);
    }

    /**
     * 发布事件
     *
     * @param event              事件
     * @param async              是否异步执行
     * @param exceptionInterrupt 异常发生时候，是否中断
     * @throws EventException 事件异常
     */
    public <T extends EventInfo> void publishEvent(T event, boolean async, boolean exceptionInterrupt, boolean wait) throws EventException {
        if (eventStore != null) {
            eventStore.saveEvent(event);
        }
        if (listeners == null) {
            throw new EventException("无事件监听器！");
        }
        if (async) {
            //即使我在这里想使用弱一致性，但是我如何做到呢？难题啊--Anjing
            //TODO: 在这里，我们需要merge clone出来的 event对象。
            EventException eventException = new EventException(null);
            if (wait) {
                CountDownLatch latch = new CountDownLatch(listeners.size());
                listeners.forEach(a -> new EventRun(a, event.clone(), latch, eventException).start());
                try {
                    latch.await();
                } catch (InterruptedException e) {
                    throw new EventException(e.getMessage());
                }
            } else {
                if (threadPool == null) {
                    threadPool = new ThreadPoolExecutor(3, 50, 2, TimeUnit.MINUTES, new LinkedBlockingDeque<>());
                }
                listeners.forEach(a -> {
                    threadPool.execute(new EventRun(a, event.clone(), null, eventException));
                });
            }
            if (eventException.getMessage() != null) {
                throw new EventException(eventException.getMessage());
            }
        } else {
            listeners.forEach(a -> {
                try {
                    a.onEvent(event);
                } catch (EventException e) {
                    e.printStackTrace();
                    if (exceptionInterrupt) {
                        throw e;
                    }
                }
            });
        }
    }

    /**
     * 发布事件
     *
     * @param event 事件信息
     * @param async 是否异步执行监听
     * @throws EventException 事件异常
     */
    public <T extends EventInfo> void publishEvent(T event, boolean async) throws EventException {
        publishEvent(event, async, true, true);
    }

    /**
     * 发布事件
     *
     * @param event 事件信息
     * @throws EventException 事件异常
     */
    public <T extends EventInfo> void publishEvent(T event) throws EventException {
        publishEvent(event, false, true, true);
    }

    public EventStore getEventStore() {
        return eventStore;
    }

    public void setEventStore(EventStore eventStore) {
        this.eventStore = eventStore;
    }

    /**
     * 异步分发事件
     */
    private class EventRun extends Thread {

        CountDownLatch latch;

        EventListener listener;

        EventInfo eventInfo;

        EventException exception;

        EventRun(EventListener listener, EventInfo eventInfo, CountDownLatch latch, EventException exception) {
            if (eventInfo == null) {
                throw new IllegalArgumentException("Null EventInfo");
            }
            this.listener = listener;
            this.eventInfo = eventInfo;
            this.latch = latch;
            this.exception = exception;
        }

        @Override
        public void run() {
            try {
                listener.onEvent(eventInfo);
            } catch (EventException e) {
                exception.addMessage(e.getMessage());
            } finally {
                if (latch != null) {
                    latch.countDown();
                }
            }
        }
    }
}
