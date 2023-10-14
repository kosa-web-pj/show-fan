package com.kosa.showfan.member.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //크로스오리진 문제 해결
        response.setHeader("Access-Control-Allow-Origin",
//                "*");
//    				"http://192.168.1.112:5502");
    				"http://192.168.45.107:5502");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        //응답출력스트림얻기
        PrintWriter out = response.getWriter();
        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> map = new HashMap<>();

        //지정한 쿠키이름
        String logincookie = "loginCookie";
        Cookie[] cookies = request.getCookies();

        //1. 해당 쿠키가 있는지 확인
        if (cookies != null) {
            for (int i = 0; i < cookies.length; i++) {

                //3. 있다면 우리쪽 쿠키인지 확인 그리고 맞다면 로그인 진행
                boolean ck = cookies[i].getName().equals(logincookie);

                if (ck == true) {
                    String cookieEmail = cookies[i].getValue();

                    cookies[i].setMaxAge(0); // 쿠키의 유효기간을 만료시킴
                    cookies[i].setPath("/"); //모든 경로에서 접근 가능하도록 설정
                    response.addCookie(cookies[i]);

                    map.put("status", 1);
                    map.put("msg", "로그아웃 성공");

                    break;
                }
            }
            //2. 해당 쿠키가 없을때
        } else {
            map.put("status", 0);
            map.put("msg", "로그아웃 실패");
        }

        String jsonStr = mapper.writeValueAsString(map);
        out.print(jsonStr);

    }

}
