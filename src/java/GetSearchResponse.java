/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Pashtet
 */
public class GetSearchResponse extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            String searchTextForPS = request.getParameter("searchTextForPS");
            searchTextForPS = new String(searchTextForPS.getBytes("ISO-8859-1"), "UTF-8");
            String searchTextForMF = request.getParameter("searchTextForMF");
            searchTextForMF = new String(searchTextForMF.getBytes("ISO-8859-1"), "UTF-8");
            String searchDate = request.getParameter("searchDate");
            searchDate = new String(searchDate.getBytes("ISO-8859-1"), "UTF-8");
            String report = doRequestToDb(searchTextForPS,searchTextForMF, searchDate);
            //out.println(searchText + " " + searchDate);
            out.println("" + report + "");

        }

    }

    private String doRequestToDb(String searchText, String searchTextForMF,String searchDate) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/rza", "netbeans", "netbeans");
        Statement st = conn.createStatement();
        ResultSet res = null;
        String finalSearch = "";
        System.out.println("Запрос: \nПодстанция: " + searchText + "\nПроизводитель: " + searchTextForMF + "\nДата: " +searchDate);
        String s = "SELECT unit_name, device_name, file_name, osc_date, file_full_path "
                + "FROM ps, mf, unit, device, osc, file "
                + "WHERE ps_name = '" + searchText + "' "
                + "AND mf_name = '" + searchTextForMF + "' "
                + "AND osc_date = '" + searchDate + "' "
                + "AND unit.ps_id = ps.ps_id "
                + "AND device.mf_id = mf.mf_id "
                + "AND device.unit_id = unit.unit_id "
                + "AND osc.device_id = device.device_id "
                + "AND osc.osc_id=file.osc_id"
                + ";";

        res = st.executeQuery(s);

        
        JsonArrayBuilder arrb2 = Json.createArrayBuilder();

        while (res.next()) {
            JsonArrayBuilder arrb1 = Json.createArrayBuilder();
            for (int i = 1; i <= 5; i++) {
                arrb1.add(res.getString(i));
            }
            
            JsonArray jarr1 = arrb1.build();
            System.out.println("1 \n" + jarr1.toString());
            arrb2.add(jarr1);

        }
        JsonArray jarr2 = arrb2.build();
        finalSearch = jarr2.toString();
        System.out.println("2 \n" + finalSearch);
        st.close();
        conn.close();
        return finalSearch;
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(GetSearchResponse.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(GetSearchResponse.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
