package leo.web.saeChannel;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import leo.util.LeoLogger;
import leo.web.LeoWebConfig;

/**
 * Servlet implementation class CreateSaeChannel
 */

public class SaeChannelUrlMimicCreator extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaeChannelUrlMimicCreator() {
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
		LeoLogger.log("SaeChannelUrlMimicCreator dopost");
		CreateSaeChannel(request, response);
	}

	protected void CreateSaeChannel(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String contentType = "text/json";
		try {
			Object url = null;
			url = LeoWebConfig.MIMIC_GET_CHANNEL_URL;

			// System.err.println("createChannel return: " + url);

			response.setCharacterEncoding("UTF-8");
			String ret = String.format("{\"url\":\"%s\", \"result\":\"1\"}",
					url);
			LeoLogger.log("SaeChannelUrlMimicCreator dopost write: " + ret);
			response.setContentType(contentType);
			response.getWriter().write(ret);
			// peer.setStatus(HttpServletResponse.SC_OK);

			// String url = channel.createChannel(name, duration);//
			// 返回值为WebSocket的url

			// 往上面创建的channel中发送一条消息 返回值num 为连接至channel的客户端数量
			// int num = channel.sendMessage(name, "this is a test message");
		} catch (Exception e) {
			System.err.println("CreateSaeChannel exception");
			// e.printStackTrace();
			response.setCharacterEncoding("UTF-8");
			response.setContentType(contentType);
			response.getWriter().write(
					String.format("{\"msg\":\"%s\", \"result\":\"0\"}",
							e.getMessage()));
			// peer.setStatus(HttpServletResponse.SC_OK);
		}
	}
}
