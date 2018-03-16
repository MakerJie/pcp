package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.ChannelEntity;
import com.pcp.crm.entity.QrcodeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Repository("qrcodeRepository")
public interface IQrcodeRepository extends ICommonRepository<QrcodeEntity,String> {

    @Modifying
    @Query(value = "delete from crm_tf_channel_acn where acn_id = :id", nativeQuery = true)
    void deleteChannels(@Param("id") String id);

}
