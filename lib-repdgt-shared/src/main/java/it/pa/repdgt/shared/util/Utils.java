package it.pa.repdgt.shared.util;

public class Utils {

	public static String toCamelCase(String str) {
		String[] strCamel = str.split(" ");
		String strResult = "";
		for(int i = 0; i < strCamel.length; i++) {
			if(i > 0)
				strResult += " " + strCamel[i].substring(0,1).toUpperCase() + strCamel[i].substring(1).toLowerCase();
			else
				strResult += strCamel[i].substring(0,1).toUpperCase() + strCamel[i].substring(1).toLowerCase();
		}
		return strResult;
	}
}
