package leo.web.saeChannel;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import leo.action.*;
import leo.util.LeoLogger;

/**
 * Servlet implementation class SaeChannelConnected
 */
public class SaeChannelSendFromClient extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaeChannelSendFromClient() {
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
		LeoLogger.log("SaeChannelSendFromClient dopost  ");
		String channelName = request.getParameter("fromChannelName");
		String msg = request.getParameter("msg"); 
		LeoLogger.log("fromChannelName: " + channelName);
		LeoLogger.log("msg: " + msg);
		if (channelName == null || "".equals(channelName)) {
			return;
		}
		IImSocket socket = LeoSocketManager.getChannel(channelName);
		LeoLogger.log("socket: " + socket);
		if (socket != null) {
			((SaeChannelWrapper) socket).onTextMessage(msg);
		}
		LeoLogger.log("SaeChannelSendFromClient dopost ends ");
	}

}
