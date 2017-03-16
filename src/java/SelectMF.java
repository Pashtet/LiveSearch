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
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Pashtet
 */
public class SelectMF extends HttpServlet {

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
        String PS = request.getParameter("PS");
            PS = new String(PS.getBytes("ISO-8859-1"), "UTF-8");
            
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/rza", "netbeans", "netbeans");
        Statement st = conn.createStatement();
        ResultSet res = null;
        String finalSearch = "";
        String s = "SELECT DISTINCT mf_name "
                + "FROM ps, unit, device, mf "
                + "WHERE ps.ps_name = '"+PS+"' "
                + "AND unit.ps_id=ps.ps_id AND unit.unit_id = device.unit_id AND device.mf_id = mf.mf_id "
                + "ORDER BY mf_name;";
        res = st.executeQuery(s);
        JsonArrayBuilder arrb2 = Json.createArrayBuilder();

        while (res.next()) {
            JsonArrayBuilder arrb1 = Json.createArrayBuilder();
                arrb1.add(res.getString(1));
            
            JsonArray jarr1 = arrb1.build();
            arrb2.add(jarr1);

        }
        JsonArray jarr2 = arrb2.build();
        finalSearch = jarr2.toString();
        System.out.println("Поиск производителя \n" + finalSearch);
        st.close();
        conn.close();
        try (PrintWriter out = response.getWriter()) {
            out.println(finalSearch);
        }
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
            Logger.getLogger(SelectMF.class.getName()).log(Level.SEVERE, null, ex);
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
            Logger.getLogger(SelectMF.class.getName()).log(Level.SEVERE, null, ex);
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
