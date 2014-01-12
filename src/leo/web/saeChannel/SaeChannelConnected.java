package leo.web.saeChannel;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import leo.util.LeoLogger;

/**
 * Servlet implementation class SaeChannelConnected
 */
// @WebServlet("/leo/CreateSaeChannel")
public class SaeChannelConnected extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaeChannelConnected() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("/_sae/channel/connected doPost in SaeChannelConnected");
		String channelName = request.getParameter("from");
		if (channelName == null || "".equals(channelName)) {
			return;
		}
	}

}
