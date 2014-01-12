package leo.web.saeChannel;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import leo.action.IImSocket;
import leo.action.LeoSocketManager;
import leo.util.LeoLogger;

/**
 * Servlet implementation class SaeChannelConnected
 */
public class SaeChannelMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaeChannelMessage() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("/_sae/channel/message doPost in SaeChannelMessage");
		String channelName = request.getParameter("from");
		if (channelName == null || "".equals(channelName)) {
			return;
		}
		IImSocket socket = LeoSocketManager.getChannel(channelName);
		if (socket != null) {
			String message = request.getParameter("message");
			if (message == null || "".equals(message)) {
				return;
			}
			socket.onTextMessage(message);
		}
	}
}
