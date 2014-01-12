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
public class SaeChannelDisconnected extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaeChannelDisconnected() {
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
		LeoLogger
				.log("/_sae/channel/disconnected doPost in SaeChannelDisconnected");

		String channelName = request.getParameter("from");
		if (channelName == null || "".equals(channelName)) {
			return;
		}
		IImSocket socket = LeoSocketManager.getChannel(channelName);
		if (socket != null) {
			socket.onClose(0, "SAE channel closed");
		}
	}

}
