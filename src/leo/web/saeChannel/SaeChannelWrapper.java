package leo.web.saeChannel;

import leo.action.IImInfo;
import leo.action.IImSocket;
import leo.action.ImActionController;
import leo.action.ImInfo;
import leo.action.LeoSocketManager;
import leo.util.LeoLogger;

import com.sina.sae.channel.SaeChannel;

public class SaeChannelWrapper implements IImSocket, SaeChannelOnOpen {

	public IImInfo imInfo = new ImInfo();

	public boolean isOpened = false;

	private SaeChannel channel = null;

	public SaeChannel getChannel() {
		return channel;
	}

	public void setChannel(SaeChannel channel) {
		this.channel = channel;
	}

	@Override
	public void setNum(String num) {
		imInfo.setNum(num);
	}

	@Override
	public String getNum() {
		return imInfo.getNum();
	}

	@Override
	public void setIsLogin(boolean isLogin) {
		imInfo.setIsLogin(isLogin);
	}

	@Override
	public boolean getIsLogin() {
		return imInfo.getIsLogin();
	}

	@Override
	public void setSocketUuid(String uuid) {
		this.imInfo.setSocketUuid(uuid);
	}

	@Override
	public String getSocketUuid() {
		return this.imInfo.getSocketUuid();
	}

	@Override
	public boolean sendMessage(String data) {
		boolean ret = false;
		try {
			LeoLogger.log("sendMessage method: prepare to send message to client via "
					+ this.imInfo + "\n\t" + data);
			int num = channel.sendMessage(imInfo.getSocketUuid(), data);
			LeoLogger.log("channel.sendMessage client count: " + num);
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
		return isOpened;
	}

	@Override
	public void setMaxIdleTime(int i) {
	}

	@Override
	public void setMaxBinaryMessageSize(int i) {
	}

	@Override
	public void setMaxTextMessageSize(int i) {
	}

	@Override
	public void onClose(int code, String msg) {
		LeoLogger.log("SaeChannelWrapper onClose begin");
		LeoLogger.log(LeoSocketManager.getInfo());
		if (imInfo.getIsLogin()) {
			LeoSocketManager.removeLoginSocket(imInfo.getNum(), this);
		} else {
			LeoSocketManager.removeRawSocket(this);
		}
		LeoSocketManager.removeChannel(this.imInfo.getSocketUuid());
		LeoLogger.log(LeoSocketManager.getInfo());
		isOpened = false;
		LeoLogger.log("SaeChannelWrapper onClose end");
	}

	@Override
	public void onOpen(String channelName) {
		LeoLogger.log("SaeChannelWrapper onOpen begin");
		LeoLogger.log(LeoSocketManager.getInfo());
		if (this.imInfo.getIsLogin()) {
			// LeoSocketManager.addLoginSocket(num, this)
			// conn.setMaxIdleTime(5000)
			// conn.setMaxBinaryMessageSize(80000000)
			// conn.setMaxTextMessageSize(80000001)
		} else {
			// conn.setMaxIdleTime(500000);
			imInfo.setSocketUuid(channelName);
			LeoSocketManager.addRawSocket(this);
			LeoSocketManager.addChannel(channelName, this);
		}
		LeoLogger.log(LeoSocketManager.getInfo());
		isOpened = true;
		LeoLogger.log("SaeChannelWrapper with uuid(" + imInfo.getSocketUuid()
				+ ")onOpen end");
	}

	@Override
	public void onTextMessage(String data) {
		try {
			LeoLogger.log("---------------onTextMessage--------------"
					+ this.imInfo.toString());
			LeoLogger.log("server text onMessage before decryption:" + data);
			if (data == null || !data.matches("\\{.*\\}")) {
				return;
			}
			if (!isOpened) {
				LeoLogger.log("socket is not opened. " + this);
				return;
			}
			if (imInfo.getIsLogin()) {
				LeoLogger.log("isLogin flag is true in socket!");
			} else {
				LeoLogger.log("isLogin flag is false in socket!");
			}
			ImActionController.doOnMessage(data, this);
		} catch (Exception e) {
			LeoLogger.log("error in onTextMessage method!");
			e.printStackTrace();
		} finally {
			LeoLogger.log("--------onTextMessage end--------------"
					+ this.imInfo);
		}
	}

	public boolean getLocalStorageSupported() {
		return this.imInfo.getLocalStorageSupported();
	}

	public void setLocalStorageSupported(boolean b) {
		this.imInfo.setLocalStorageSupported(b);
	}
}
