package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.SaverTicketEntity;
import com.pcp.crm.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

/**
 * 会员持久化服务
 * Created by Silence on 2017/7/3.
 */
@Repository("userRepository")
public interface IUserRepository extends ICommonRepository<UserEntity, String> {
    UserEntity findByMobile(String mobile);

    UserEntity findByCardNo(String cardNo);

    UserEntity findByAliId(String aliId);
}
