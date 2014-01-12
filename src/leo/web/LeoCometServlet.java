package leo.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class LeoCometServlet
 */
//@WebServlet(urlPatterns = "/servlet/leoComet", asyncSupported = true)
// @WebServlet("/servlet/leoComet", asyncSupported=true)
public class LeoCometServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LeoCometServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.err.println("-----------doGet-----------");
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.err.println("-----------doPost-----------");
		boolean isSupported = request.isAsyncSupported();
		System.err.println("-----------isSupported-----------" + isSupported);

		String type = request.getParameter("type");
		System.err.println("-----------type-----------" + type);
		if ("1".equals(type)) {
			AsyncContext asyncContext = request.startAsync();
			asyncContext.setTimeout(0);
			addSocket(asyncContext);
		} else {
			broadcast("{\"name\":123445}");
		}
	}

	public static List<AsyncContext> list = new ArrayList<AsyncContext>();

	public static void addSocket(AsyncContext asyncContext) {
		System.err.println("-----------addSocket-----------");
		list.add(asyncContext);
	}

	public static void broadcast(String msg) {
		System.err.println("-----------broadcast-----------");
		for (AsyncContext asyncContext : list) {
			try {
				System.err.println("-----------element -----------");
				HttpServletResponse peer = (HttpServletResponse) asyncContext
						.getResponse();
				peer.getWriter().write(msg);
				peer.setStatus(HttpServletResponse.SC_OK);
				 peer.setContentType("application/json");
//				 peer.setContentType("application/x-json");
//				peer.setContentType("text/plain;charset=utf-8");
				asyncContext.complete();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
