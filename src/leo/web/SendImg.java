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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

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
public class SendImg extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SendImg() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		LeoLogger.log("send img doGet");
	}

	/**
	 * @throws UnsupportedEncodingException
	 * @throws FileNotFoundException
	 * @throws Exception
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */

	// public static final String TMP_PATH = SaeUserInfo.getSaeTmpPath() + "/";
	public static final String localMimicSavePath = System
			.getProperty("java.io.tmpdir");
	public static final String storageDomain = "leopabushai";

	private void handler(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		request.setCharacterEncoding("utf-8");

		// String pp = request.getParameter("p");
		// if (pp != null && !"".equals(pp)) {
		// LeoLogger.log("parameter p is " + pp);
		// } else {
		// LeoLogger.log("parameter p is empty.");
		// }

		// LeoWebUtil.printlnMap(request);

		// request.getParameterMap();

		// Map<String, String[]> parameterMap = request.getParameterMap();
		// call it for each request
		final String tmpPath = SaeUserInfo.getSaeTmpPath() + "/";

		LeoLogger.log("tmpPath: " + tmpPath);
		// LeoLogger.log("TMP_PATH: " + TMP_PATH);
		// LeoLogger.log("savePath: " + savePath);

		final boolean useStorage = LeoWebConfig.USE_SAE_STORAGE;
		LeoLogger.log("useStorage:: " + useStorage);

		final boolean isMultipart = ServletFileUpload
				.isMultipartContent(request);
		if (!isMultipart) {
			LeoLogger.log("isMultipart is false, method returns");
			return;
		}

		final DiskFileItemFactory factory = new DiskFileItemFactory();
		// 获取文件需要上传到的路径

		// final String path = request.getRealPath("/upload");
		final String path = tmpPath;

		// 如果没以下两行设置的话，上传大的 文件 会占用 很多内存，
		// 设置暂时存放的 存储室 , 这个存储室，可以和 最终存储文件 的目录不同
		/**
		 * 原理 它是先存到 暂时存储室，然后在真正写到 对应目录的硬盘上， 按理来说 当上传一个文件时，其实是上传了两份，第一个是以 .tem
		 * 格式的 然后再将其真正写到 对应目录的硬盘上
		 */
		factory.setRepository(new File(path));
		// 设置 缓存的大小，当上传文件的容量超过该缓存时，直接放到 暂时存储室
		factory.setSizeThreshold(1024 * 1024);

		// 高水平的API文件上传处理
		final ServletFileUpload upload = new ServletFileUpload(factory);

		// set max size for one file, if exceed, then exception will be thrown.
		upload.setFileSizeMax(1024 * 1024 * 2);
		try {
			// 可以上传多个文件
			final List<FileItem> list = (List<FileItem>) upload
					.parseRequest(request);
			LeoLogger.log("list.size():" + list.size());
			final String[] saveNames = new String[list.size()];
			// final scala.collection.immutable.List<String> l =
			// scala.collection.immutable.List
			// .apply("");
			// scala.collection.immutable.List.apply(1);
			for (int i = 0; i < list.size(); i++) {
				FileItem item = list.get(i);
				// 获取表单的属性名字
				// String name = item.getFieldName();

				// 如果获取的 表单信息是普通的 文本 信息
				if (item.isFormField()) {
					// 获取用户具体输入的字符串 ，名字起得挺好，因为表单提交过来的是 字符串类型的
					// String value = item.getString();
					// request.setAttribute(name, value);
				}
				// 对传入的非 简单的字符串进行处理 ，比如说二进制的 图片，电影这些
				else {
					/**
					 * 以下三步，主要获取 上传文件的名字
					 */
					// 获取路径名
					final String itemName = item.getName();
					// 索引到最后一个反斜杠
					final int start = itemName.lastIndexOf("\\");
					// 截取 上传文件的 字符串名字，加1是 去掉反斜杠，
					final String filename = itemName.substring(start + 1);

					// request.setAttribute(name, filename);

					// 真正写到磁盘上
					// 它抛出的异常 用exception 捕捉

					// item.write( new File(path,filename) );//第三方提供的

					// 手动写的
					final InputStream in = item.getInputStream();
					LeoLogger.log("available: " + in.available());
					LeoLogger.log("SaeUserInfo.getAppName(): "
							+ SaeUserInfo.getAppName());

					if (useStorage) {
						// byte[] b = new byte[in.available()];
						final SaeStorage storage = new SaeStorage();
						// storage.write(storageDomain, Utils.genUUID() +
						// ".jpg",
						// b);
						final String fileExt = LeoUtil
								.getFileExtension(itemName);
						if (fileExt.length() > 10) { // fileExt is too long
							continue;
						}

						final String subFolder = LeoUtil.getYearMonthDay();
						final String storageSavedFileName = subFolder
								+ LeoUtil.genUUID()
								+ LeoUtil.getFileExtension(itemName);
						LeoLogger.log(storageDomain + ", " + path
								+ storageSavedFileName + ", "
								+ storageSavedFileName);
						// storage.upload(storageDomain, path + filename,
						// filename);
						final byte[] bin = new byte[in.available()];
						in.read(bin);
						storage.write(storageDomain, storageSavedFileName, bin);
						saveNames[i] = storageSavedFileName;
						// verify, begin
						final byte[] b = storage.read(storageDomain,
								storageSavedFileName);
						LeoLogger.log("b.length: " + b.length);

						final String url = storage.getUrl(storageDomain,
								storageSavedFileName);
						LeoLogger.log("url: " + url);
						// verify, end

						writeResult(url, response);
					} else {

						final String savedFolder = localMimicSavePath;

						final String savedFileName = LeoUtil.genUUID()
								+ LeoUtil.getFileExtension(itemName);

						final OutputStream out = new FileOutputStream(new File(
								savedFolder, savedFileName));
						LeoLogger.log("open output stream: " + savedFolder
								+ "," + savedFileName);

						int length = 0;
						final byte[] buf = new byte[1024];

						LeoLogger.log("获取上传文件的总共的容量：" + item.getSize());

						// in.read(buf) 每次读到的数据存放在 buf 数组中
						while ((length = in.read(buf)) != -1) {
							// 在 buf 数组中 取出数据 写到 （输出流）磁盘上
							out.write(buf, 0, length);
						}
						out.close();
						saveNames[i] = savedFileName;
					}

					in.close();
				}
			} // end of for

			// save to DB, begin
			if (saveNames.length != 0) {
				String p = request.getParameter("p");
				if (p != null && !"".equals(p)) {
					ParamMap pm = ParamMap.apply(p);
					PbsImgAction.savePbsImg(pm, saveNames);
				} else {
					LeoLogger.log("parameter p is empty.");
				}
			}
			// save to DB, begin

		} catch (FileUploadException e) {
			throw e;
		}

		// request.getRequestDispatcher("filedemo.jsp").forward(request,
		// response);
	}

	public void writeResult(String msg, HttpServletResponse response)
			throws IOException {
		final PrintWriter writer = response.getWriter();
		writer.write(msg);
		// peer.setStatus(HttpServletResponse.SC_OK);
		// peer.setContentType("application/json");
		writer.flush();
		writer.close();
	}

	public static void main(String[] args) throws Exception {
		String realPath = SaeUserInfo.getSaeTmpPath() + "/";
		LeoLogger.log(realPath);

		File f = new File("D:/testimg/9b366aa9-b5e0-4349-a016-2e41cd011531.jpg");
		LeoLogger.log(f.getName());
		String property = System.getProperty("java.io.tmpdir");
		LeoLogger.log(property);
		InputStream is = new FileInputStream(
				"D:/testimg/9b366aa9-b5e0-4349-a016-2e41cd011531.jpg");
		LeoLogger.log(is.available());
		byte[] b = new byte[is.available()];
		is.read(b);

		SaeStorage storage = new SaeStorage();
		storage.write("domainname", "filename", b);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		LeoLogger.log("send img doPost");
		try {
			handler(request, response);
		} catch (Exception e) {
			throw new ServletException(e);
		}
	}

	private void uploadByParts(HttpServletRequest request,
			HttpServletResponse response) throws IOException,
			IllegalStateException, ServletException {
		ServletInputStream in = request.getInputStream();
		LeoLogger.log(in.available());
		Collection<Part> parts = request.getParts();
		if (parts != null) {
			Iterator<Part> iterator = parts.iterator();
			while (iterator.hasNext()) {
				Part next = iterator.next();
				LeoLogger.log("next: " + next);
				next.write("d:/testimg/" + LeoUtil.genUUID() + ".jpg");
			}
		}
		byte[] b = null;
		in.readLine(b, 0, in.available());
	}

}
