package leo.web.jetty;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import leo.action.IImSocket;
import leo.action.ILeoSocketFactory;
import leo.action.ImActionController;
import leo.util.LeoLogger;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;

//@WebServlet("/servlet/sendMsg")
public class LeoSocketServletJetty7 extends WebSocketServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4490003509012784745L;

	public void init() {
		try {
			super.init();
		} catch (ServletException e) {
			e.printStackTrace();
		}
	}

	/**
	 * braodcast Message to all sockets of all audiences, including other
	 * sockets of self user
	 * 
	 * @param msg
	 * @param tailorSocket
	 * @throws IOException
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("doget");
		try {
			request.getRequestDispatcher("/index.jsp").forward(request, response);
			// getServletContext().getNamedDispatcher("default").forward(request,
			// response);
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public boolean checkOrigin(HttpServletRequest request, String origin) {
		return true;
	}

	// class LeoSocketServlet needs to be abstract, since method
	// doWebSocketConnect in trait Acceptor of type (x$1:
	// javax.servlet.http.HttpServletRequest, x$2:
	// String)org.eclipse.jetty.websocket.WebSocket is not defined (Note that
	// String does not match javax.servlet.http.HttpServletResponse)
	// public WebSocket doWebSocketConnect(HttpServletRequest request,
	// String protocol) {
	// // connect websocket require session is active
	// // AppUser loginUser = (AppUser) request.getSession().getAttribute(
	// // WebUtil.LOGIN_USER);
	// // if (loginUser == null) {
	// // return null;
	// // }
	// // LeoLogger.log("doWebSocketConnect");
	// // LeoLogger.log(protocol);
	// //
	// // ILeoSocketFactory f = new ILeoSocketFactory() {
	// // @Override
	// // public ILeoSocket createILeoSocket() {
	// // return new LeoSocket();
	// // }
	// // };
	// //
	// // return (WebSocket) ActionController.doWebSocketConnect(
	// // f , protocol, request.getParameter("connectType"),
	// // request.getParameter("num"), request.getParameter("pwd"));
	// // return (WebSocket) ActionController.doWebSocketConnect(
	// // null , protocol, request.getParameter("connectType"),
	// // request.getParameter("num"), request.getParameter("pwd"));
	//
	// }

	public WebSocket doWebSocketConnect(HttpServletRequest request, String protocol) {
		LeoLogger.log("doWebSocketConnect 1");
		ILeoSocketFactory f = new ILeoSocketFactory() {
			@Override
			public IImSocket createILeoSocket() {
				return new LeoSocketJetty7();
			}
		};
		LeoLogger.log("doWebSocketConnect 2");
		return (WebSocket) ImActionController.doWebSocketConnect(f, protocol, request.getParameter("connectType"), request.getParameter("num"), request.getParameter("pwd"));
	}
	// @SuppressWarnings("deprecation")
	// @Override
	// protected StreamInbound createWebSocketInbound(String protocol,
	// HttpServletRequest request) {
	// LeoLogger.log("doWebSocketConnect 1");
	//
	// // return new MessageInbound(){
	// //
	// // @Override
	// // protected void onBinaryMessage(ByteBuffer arg0) throws IOException {
	// // // TODO Auto-generated method stub
	// //
	// // }
	// //
	// // @Override
	// // protected void onTextMessage(CharBuffer arg0) throws IOException {
	// // // TODO Auto-generated method stub
	// //
	// // }};
	// ILeoSocketFactory f = new ILeoSocketFactory() {
	// @Override
	// public ILeoSocket createILeoSocket() {
	// return new LeoSocket();
	// }
	// };
	// LeoLogger.log("doWebSocketConnect 2");
	//
	// return (StreamInbound) ActionController.doWebSocketConnect(f, protocol,
	// request.getParameter("connectType"), request.getParameter("num"),
	// request.getParameter("pwd"));
	// }

	// private void login(user: LeoQqUser): LeoDTO[LeoQqUser] {
	// LeoQqUserBiz.loginUser(user)
	// }
	// static private int serialNum = 0;

	// private void logs(String logMessage) {
	// System.out.println(logMessage);
	// }
}
