package leo.web;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import leo.util.LeoLogger;

public class LeoWebUtil {
	public static void printlnMap(HttpServletRequest request) {
		Map<String, String[]> parameterMap = request.getParameterMap();
		Set<String> keySet = parameterMap.keySet();
		if (keySet.isEmpty()) {
			LeoLogger.log("keySet is empty");
		} else {
			String ret = "";
			Iterator<String> iterator = keySet.iterator();
			String next = "";
			while (iterator.hasNext()) {
				next = iterator.next();
				String[] value = parameterMap.get(next);
				String valueStr = "";
				for (String s : value) {
					valueStr += s + ", ";
				}
				ret += next + ":" + valueStr + ";";
			}
			LeoLogger.log(ret);
		}
	}
}
