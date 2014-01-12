package leo.web.tomcat;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;

import leo.action.IImInfo;
import leo.action.IImSocket;
import leo.action.ImActionController;
import leo.action.ImInfo;
import leo.action.LeoSocketManager;
import leo.util.LeoLogger;
import leo.util.LeoUtil;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.WsOutbound;

/**
 * this class acts like struts core filter, but it has many instances, not
 * singleton.
 * 
 * @author leonard
 * 
 */
public class LeoSocket extends MessageInbound implements IImSocket {
	// private static Map<String, Object> actionMap

	// public Connection conn = null;

	public IImInfo leoQqInfo = new ImInfo();

	public boolean isOpened = false;

	public void onOpen(WsOutbound outbound) {
		LeoLogger.log("leosocket onOpen");
		LeoLogger.log("getLoginSockets: "
				+ LeoSocketManager.getLoginSocketsSize());
		LeoLogger.log("getRawSockets: " + LeoSocketManager.getRawSocketsSize());
		// conn = connection;
		if (this.leoQqInfo.getIsLogin()) {
			// LeoSocketManager.addLoginSocket(num, this)
			// conn.setMaxIdleTime(5000)
			// conn.setMaxBinaryMessageSize(80000000)
			// conn.setMaxTextMessageSize(80000001)
		} else {
			// conn.setMaxIdleTime(500000);
			String uuid = LeoUtil.genUUID();
			leoQqInfo.setSocketUuid(uuid);
			LeoSocketManager.addRawSocket(this);
		}

		LeoLogger.log("getLoginSockets: "
				+ LeoSocketManager.getLoginSocketsSize());
		LeoLogger.log("getRawSockets: " + LeoSocketManager.getRawSocketsSize());

		isOpened = true;
		LeoLogger.log("leosocket with uuid(" + leoQqInfo.getSocketUuid()
				+ ")onOpen end");
	}

	public void onClose(int closeCode, String message) {
		LeoLogger.log("leosocket onClose");
		LeoLogger.log("getLoginSockets: "
				+ LeoSocketManager.getLoginSocketsSize());
		LeoLogger.log("getRawSockets: " + LeoSocketManager.getRawSocketsSize());
		if (leoQqInfo.getIsLogin()) {
			LeoSocketManager.removeLoginSocket(leoQqInfo.getNum(), this);
		} else {
			LeoSocketManager.removeRawSocket(this);
		}
		LeoLogger.log("getLoginSockets: "
				+ LeoSocketManager.getLoginSocketsSize());
		LeoLogger.log("getRawSockets: " + LeoSocketManager.getRawSocketsSize());
		LeoLogger.log("leosocket onClose end");
		isOpened = false;
	}

	// @Override
	// public boolean onControl(byte arg0, byte[] arg1, int arg2, int arg3) {
	// LeoLogger.log("server onControl");
	// return false;
	// }
	//
	// @Override
	// public void onMessage(byte[] arg0, int arg1, int arg2) {
	// LeoLogger.log("server binary onMessage");
	// LeoLogger.log("server binary onMessage end");
	// }

	// def decrypt(data: String) = {
	// new
	// String(com.sun.org.apache.xml.internal.security.utils.Base64.decode(data))
	// }

	// public void onMessage(String inputData) {
	// LeoLogger.log("---------------onMessage-------------------------------");
	// try {
	// LeoLogger.log("server text onMessage before decryption:" + inputData);
	// // val data = decrypt(inputData)
	// String data = inputData;
	// LeoLogger.log("server text onMessage after decryption:" + data);
	// if (!isOpened) {
	// LeoLogger.log("socket is not opened. " + this);
	// return;
	// }
	// if (leoQqInfo.getIsLogin()) {
	// LeoLogger.log("isLogin flag is true in socket!");
	// } else {
	// LeoLogger.log("isLogin flag is false in socket!");
	// }
	// ActionController.doOnMessage(inputData, this);
	// } catch (Exception e) {
	// LeoLogger.log("error in onmessage method!");
	// e.printStackTrace();
	// }
	// }

	public boolean sendMessage(String data) {
		boolean ret = false;
		try {
			LeoLogger.log("prepare to send message to client via "
					+ this.leoQqInfo + "\n\t" + data);
			CharBuffer buffer = CharBuffer.wrap(data);
			this.getWsOutbound().writeTextMessage(buffer);
			// this.conn.sendMessage(data);
			ret = true;
		} catch (IOException e) {
			ret = false;
			LeoLogger.log("send message failed,  " + e.getMessage());
		}catch (Exception e) {
			ret = false;
			LeoLogger.log("send message failed,  " + e.getMessage());
			e.printStackTrace();
		}
		return ret;
	}

	public boolean isOpen() {
		return isOpened;
	}

	// @Override
	// public boolean onFrame(byte arg0, byte arg1, byte[] arg2, int arg3, int
	// arg4) {
	// LeoLogger.log("server onFrame");
	// return false;
	// }
	//
	// @Override
	// public void onHandshake(FrameConnection arg0) {
	// LeoLogger.log("onHandshake");
	// }

	@Override
	public void setNum(String num) {
		leoQqInfo.setNum(num);
	}

	@Override
	public String getNum() {
		return leoQqInfo.getNum();
	}

	@Override
	public void setIsLogin(boolean isLogin) {
		leoQqInfo.setIsLogin(isLogin);

	}

	@Override
	public boolean getIsLogin() {
		return leoQqInfo.getIsLogin();
	}

	@Override
	public void setMaxIdleTime(int i) {
		// conn.setMaxIdleTime(i);
	}

	@Override
	public void setMaxBinaryMessageSize(int i) {
		// conn.setMaxBinaryMessageSize(i);
	}

	@Override
	public void setMaxTextMessageSize(int i) {
		// conn.setMaxTextMessageSize(i);
	}

	@Override
	protected void onBinaryMessage(ByteBuffer arg0) throws IOException {
		LeoLogger.log("---------------onBinaryMessage start--------------"
				+ leoQqInfo.toString());
		// byte[] bytes = null;
		// arg0.get(bytes);
		LeoLogger.log("---------------length--------------"
				+ arg0.array().length);
	}

	public static void main(String[] args) {
		System.out.println("{fdsfa}".matches("\\{.*\\}"));
	}

	@Override
	protected void onTextMessage(CharBuffer inputData) throws IOException {
		try {
			LeoLogger.log("---------------onTextMessage--------------"
					+ this.leoQqInfo.toString());
			LeoLogger.log("server text onMessage before decryption:"
					+ (inputData.length() > 1000 ? "too long" : inputData));
//			LeoLogger.log("---------------inputData.length--------------"
//					+ inputData.length());
			// val data = decrypt(inputData)
			String data = inputData.toString();
			LeoLogger.log("server text onMessage after decryption:"
					+ (data.length() > 1000 ? "too long" : data));
			if (data == null || !data.matches("\\{.*\\}")) {
				return;
			}
			if (!isOpened) {
				LeoLogger.log("socket is not opened. " + this);
				return;
			}
			if (leoQqInfo.getIsLogin()) {
				LeoLogger.log("isLogin flag is true in socket!");
			} else { // need login
				LeoLogger.log("isLogin flag is false in socket!");
			}
			ImActionController.doOnMessage(data, this);
		} catch (Exception e) {
			LeoLogger.log("error in onTextMessage method!");
			e.printStackTrace();
		} finally {
			LeoLogger.log("--------onTextMessage end--------------"
					+ this.leoQqInfo);
		}
	}

	@Override
	public void setSocketUuid(String uuid) {
		this.leoQqInfo.setSocketUuid(uuid);
	}

	@Override
	public String getSocketUuid() {
		return this.leoQqInfo.getSocketUuid();
	}

	@Override
	public void onTextMessage(String msg) {

	}

	public boolean getLocalStorageSupported() {
		return this.leoQqInfo.getLocalStorageSupported();
	}

	public void setLocalStorageSupported(boolean b) {
		this.leoQqInfo.setLocalStorageSupported(b);
	}
}
