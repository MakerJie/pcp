package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.SaverTicketEntity;
import com.pcp.crm.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/17
 */
@Repository("saverTicketRepository")
public interface ISaverTicketRepository extends ICommonRepository<SaverTicketEntity,String> {
}
