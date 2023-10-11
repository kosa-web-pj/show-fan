package com.kosa.showfan.myArtist.dao;

import com.kosa.showfan.exception.FindException;
import com.kosa.showfan.myArtist.dto.MyArtistDTO;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.InputStream;
import java.util.List;

public class MyArtistDAOImpl implements MyArtistDAO {
    private static final MyArtistDAO myArtistDAO = new MyArtistDAOImpl();

    public static MyArtistDAO getInstance() {
        return myArtistDAO;
    }

    private SqlSessionFactory sqlSessionFactory;

    public MyArtistDAOImpl() {
        String resource = "com/kosa/showfan/sql/mybatis-config.xml";
        InputStream inputStream;
        try {
            inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<MyArtistDTO> selectAllByMemberId(Long memberId) throws FindException {
        SqlSession session = null;
        try {
            session = sqlSessionFactory.openSession();
            List<MyArtistDTO> myArtistDTOList = session.selectList("com.kosa.show.MyArtistMapper.selectAllByMemberId", memberId);
            return myArtistDTOList;
        } catch (Exception e) {
            throw new FindException("선호 아티스트 목록 검색에 실패했습니다");
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}
