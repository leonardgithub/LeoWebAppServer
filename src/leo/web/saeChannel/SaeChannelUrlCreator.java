package leo.web.saeChannel;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sina.sae.channel.SaeChannel;

import leo.util.LeoLogger;
import leo.util.LeoUtil;
import leo.web.LeoWebConfig;

/**
 * Servlet implementation class CreateSaeChannel
 */

public class SaeChannelUrlCreator extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaeChannelUrlCreator() {
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
		CreateSaeChannel(request, response);
	}

	public static final int duration = LeoWebConfig.SAE_CHANNEL_DURATION;// channel过期时间

	protected void CreateSaeChannel(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		boolean isSuccess = false;
		String name = null;
		String url = null;
		try {
			name = LeoUtil.genUUID();// channel名称, UUID
			LeoLogger.logDebug("channel name is " + name + ", duration is "
					+ duration);
			SaeChannel channel = new SaeChannel();
			url = channel.createChannel(name, duration);
			if (url == null) {
				LeoLogger.log("CreateSaeChannel url is null");
				url = "";
			} else if ("".equals(url)) {
				LeoLogger.log("CreateSaeChannel url is empty");
			} else {
				isSuccess = true;
				LeoLogger.log("CreateSaeChannel url: " + url);
			}
			if (isSuccess) {
				SaeChannelWrapper wrapper = new SaeChannelWrapper();
				wrapper.setChannel(channel);
				// put into socket/channel manager
				wrapper.onOpen(name);
			}
		} catch (Exception e) {
			isSuccess = false;
			LeoLogger.logError("CreateSaeChannel exception, " + e.getMessage());
			e.printStackTrace();
		} finally {
			try {
				response.setCharacterEncoding("UTF-8");
				response.setContentType("text/json");
				if (isSuccess) {
					String responseMsg = String
							.format("{\"url\":\"%s\", \"channelName\":\"%s\" , \"result\":\"1\"}",
									url, name);
					response.getWriter().write(responseMsg);
				} else {
					response.getWriter().write(
							"{\"msg\":\"网络繁忙，请稍后重试\", \"result\":\"0\"}");
				}
			} catch (Exception e) {
				LeoLogger.logError("response write exception, "
						+ e.getMessage());
				e.printStackTrace();
			}
		}
	}
}
