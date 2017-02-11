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
            String searchText = request.getParameter("searchText");
            searchText = new String(searchText.getBytes("ISO-8859-1"), "UTF-8");
            String searchDate = request.getParameter("searchDate");
            searchDate = new String(searchDate.getBytes("ISO-8859-1"), "UTF-8");
            String report = doRequestToDb(searchText, searchDate);
            //out.println(searchText + " " + searchDate);
            out.println("" + report + "");

        }

    }

    private String doRequestToDb(String searchText, String searchDate) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/files", "netbeans", "netbeans");
        Statement st = conn.createStatement();
        ResultSet res = null;
        String finalSearch = "";

        String s = "SELECT ps.ps_name, mf.mf_name, event.event_date, event.dev_name, event.file_name "
                + "FROM ps, mf, event "
                + "WHERE ps.ps_name ILIKE 'ПС_" + searchText + "%' "
                + "AND event.event_date='" + searchDate + "' "
                + "AND ps.ps_id=mf.ps_id "
                + "AND mf.mf_id=event.mf_id "
                + ";";
        
        res = st.executeQuery(s);
        finalSearch += "[";

        while (res.next()) {
            finalSearch += "[";
            finalSearch += "\"" + res.getString(1) + "\"";
            finalSearch += ",";
            finalSearch += "\"" + res.getString(2) + "\"";
            finalSearch += ",";
            finalSearch += "\"" + res.getString(3) + "\"";
            finalSearch += ",";
            finalSearch += "\"" + res.getString(4) + "\"";
            finalSearch += ",";
            finalSearch += "\"" + res.getString(5) + "\"";
            finalSearch += "],";
        }
        finalSearch = finalSearch.substring(0, (finalSearch.length()-1));
        finalSearch += "]";
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
