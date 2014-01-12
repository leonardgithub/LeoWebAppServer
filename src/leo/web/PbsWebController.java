package leo.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import leo.action.PbsActionController;
import leo.action.PbsImgAction;
import leo.util.LeoLogger;
import leo.util.LeoUtil;
import leo.web.uitl.ParamMap;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.sina.sae.storage.SaeStorage;
import com.sina.sae.util.SaeUserInfo;

/**
 * Servlet implementation class SendImg
 */
@MultipartConfig
public class PbsWebController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PbsWebController() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("send img doGet");
	}

	/**
	 * @throws UnsupportedEncodingException
	 * @throws FileNotFoundException
	 * @throws Exception
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */

	private void handler(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		LeoLogger.log("action controller starts.");

		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/json");

		String p = request.getParameter("p");
		if (p == null || "".equals(p)) {
			LeoLogger.log("parameter p is empty.");
			return;
		}

		String ret = PbsActionController.doAction(p);
		if (ret != null && !"".equals(ret)) {
			writeResult(ret, response);
		}
	}

	public void writeResult(String msg, HttpServletResponse response)
			throws IOException {
		final PrintWriter writer = response.getWriter();
		writer.write(msg);
		writer.flush();
		writer.close();
	}

	public static void main(String[] args) throws Exception {

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("send img doPost");
		try {
			handler(request, response);
		} catch (Exception e) {
			LeoLogger.logError("PbsWebController doPost error: "
					+ e.getMessage());
		}
	}
}
