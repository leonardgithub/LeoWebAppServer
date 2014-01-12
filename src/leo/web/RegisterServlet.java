package leo.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import leo.biz.ImUserBiz;
import leo.entity.ImUser;
import leo.entity.LeoDTO;
import leo.util.LeoLogger;
import leo.util.LeoUtil;

/**
 * Servlet implementation class RegisterServlet
 */
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RegisterServlet() {
		super();
	}

	private void handle(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			String contentType = "text/json";
			response.setCharacterEncoding("UTF-8");
			String num = request.getParameter("register_num");
			if (num == null || "".equals(num)) {
				response.getWriter()
						.write("{\"res\":\"num can not be empty\"}");
				// peer.setStatus(HttpServletResponse.SC_OK);
				response.setContentType(contentType);
				return;
			}
			String pwd = request.getParameter("register_pwd");
			if (pwd == null || "".equals(pwd)) {
				response.getWriter()
						.write("{\"res\":\"pwd can not be empty\"}");
				response.setContentType(contentType);
				return;
			}
			String nickname = request.getParameter("register_nickname");
			if (nickname == null || "".equals(nickname)) {
				response.getWriter().write(
						"{\"res\":\"nickname can not be empty\"}");
				response.setContentType(contentType);
				return;
			}
			ImUser e = new ImUser();
			e.setNum(num);
			e.setPwd(pwd);
			e.setCreationTime(LeoUtil.getCurTime());
			e.setNickname(nickname);
			LeoDTO<Object> dto = ImUserBiz.registerUser(e);
			boolean isSuc = dto.getIsSuccess();
			if (isSuc) {
				response.getWriter()
						.write("{\"res\":\"注册成功\",\"registerResult\":\"1\"}");
				response.setContentType(contentType);
			} else {
				response.getWriter().write(
						"{\"res\":\"注册失败: " + dto.getErrMsg()
								+ "\",\"registerResult\":\"0\"}");
				response.setContentType(contentType);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("register doget");
		// this.handle(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("register dopost");
		this.handle(request, response);
	}

}
