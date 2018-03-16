package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.ChannelEntity;
import com.pcp.crm.entity.GradeChangeEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/9/12
 */
@Repository("gradeChangeRepository")
public interface IGradeChangeRepository extends ICommonRepository<GradeChangeEntity,String> {
}
