
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author veerasundar.com/blog
 *
 */
public class LiveSearch extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public LiveSearch() {

        super();
    }

    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        try {
            String searchText = request.getParameter("searchTextForPS");
            searchText = new String(searchText.getBytes("ISO-8859-1"), "UTF-8");
            String report = getLiveSearch(searchText);
            response.setContentType("text/plain;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.println("" + report + "");
            out.flush();
            out.close();
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(LiveSearch.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private String getLiveSearch(String searchText) throws ClassNotFoundException, UnsupportedEncodingException {
        Connection conn = null;
        Statement st = null;
        ResultSet res = null;
        String finalSearch = "";
        try {
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/files", "netbeans", "netbeans");
            st = conn.createStatement();

            String s = "SELECT * FROM ps WHERE ps_name ILIKE '" + searchText + "%';";

            res = st.executeQuery(s);
            finalSearch += "[\"";
            while (res.next()) {
                System.out.println(finalSearch);
                if (finalSearch.length() > 2) {
                    finalSearch += " \", \"";
                }
                String un = res.getString("ps_name");
                System.out.println(un);
//                    if (un.length() > 0) {
//                        un = un.substring(3);
//                        finalSearch += un;
//                    }
                finalSearch += un;
                System.out.println(finalSearch);

            }
            finalSearch += "\"]";
            st.close();
            conn.close();
        } catch (SQLException sqlEx) {
            sqlEx.printStackTrace();
        }

        return finalSearch;
    }

}
