package leo.web.jetty;

import leo.action.IImInfo;
import leo.action.IImSocket;
import leo.action.ImActionController;
import leo.action.ImInfo;
import leo.action.LeoSocketManager;
import leo.util.LeoLogger;
import leo.util.LeoUtil;

import org.eclipse.jetty.websocket.WebSocket;

public class LeoSocketJetty7 implements IImSocket, WebSocket,
		WebSocket.OnTextMessage, WebSocket.OnBinaryMessage,
		WebSocket.OnControl, WebSocket.OnFrame {

	Connection conn = null;

	public IImInfo leoQqInfo = new ImInfo();

	public boolean isOpened = false;

	@Override
	public boolean onControl(byte arg0, byte[] arg1, int arg2, int arg3) {
		return false;
	}

	@Override
	public void onMessage(byte[] arg0, int arg1, int arg2) {

	}

	@Override
	public void onMessage(String arg0) {
		String uuid = this.leoQqInfo.getSocketUuid();
		try {
			LeoLogger.log(String.format(
					"-------%s, %s--------onTextMessage--------------", uuid,
					this.getNum()));
			LeoLogger.log("server text onMessage before decryption:" + arg0);
			// val data = decrypt(inputData)
			String data = arg0;
			LeoLogger.log("server text onMessage after decryption:" + data);
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
			LeoLogger.log(String.format(
					"-------%s, %s--------onTextMessage end--------------",
					uuid, this.getNum()));
		}
	}

	@Override
	public void onClose(int arg0, String arg1) {
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

	@Override
	public void onOpen(Connection arg0) {
		LeoLogger.log("leosocket onOpen");
		LeoLogger.log("getLoginSockets: "
				+ LeoSocketManager.getLoginSocketsSize());
		LeoLogger.log("getRawSockets: " + LeoSocketManager.getRawSocketsSize());
		this.conn = arg0;
		// conn = connection;
		if (this.leoQqInfo.getIsLogin()) {
			// LeoSocketManager.addLoginSocket(num, this)
			// conn.setMaxIdleTime(5000)
			// conn.setMaxBinaryMessageSize(80000000)
			// conn.setMaxTextMessageSize(80000001)
		} else {
			// conn.setMaxIdleTime(500000);
			LeoSocketManager.addRawSocket(this);
		}

		LeoLogger.log("getLoginSockets: "
				+ LeoSocketManager.getLoginSocketsSize());
		LeoLogger.log("getRawSockets: " + LeoSocketManager.getRawSocketsSize());

		isOpened = true;
		String uuid = LeoUtil.genUUID();
		leoQqInfo.setSocketUuid(uuid);
		LeoLogger.log("leosocket with uuid(" + uuid + ")onOpen end");
	}

	@Override
	public boolean onFrame(byte arg0, byte arg1, byte[] arg2, int arg3, int arg4) {

		return false;
	}

	@Override
	public void onHandshake(FrameConnection arg0) {

	}

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
	public void setSocketUuid(String uuid) {
		this.leoQqInfo.setSocketUuid(uuid);
	}

	@Override
	public String getSocketUuid() {
		return this.leoQqInfo.getSocketUuid();
	}

	@Override
	public boolean sendMessage(String data) {
		boolean ret = false;
		try {
			LeoLogger.log("prepare to send message from socket "
					+ this.leoQqInfo + " to client : " + data);
			// CharBuffer buffer = CharBuffer.wrap(data);
			// this.getWsOutbound().writeTextMessage(buffer);
			this.conn.sendMessage(data);
			ret = true;
		} catch (Exception e) {
			ret = false;
			LeoLogger.log("send message failed,  " + e.getMessage());
			e.printStackTrace();
		}
		return ret;
	}

	@Override
	public boolean isOpen() {
		return this.conn.isOpen() && isOpened;
	}

	@Override
	public void setMaxIdleTime(int i) {
	}

	@Override
	public void setMaxBinaryMessageSize(int i) {
		conn.setMaxBinaryMessageSize(i);
	}

	@Override
	public void setMaxTextMessageSize(int i) {
		conn.setMaxTextMessageSize(i);
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
