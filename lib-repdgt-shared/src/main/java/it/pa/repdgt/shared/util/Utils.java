package it.pa.repdgt.shared.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;


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

	public String decompressGzip(byte[] compressed) throws IOException {
        try (InputStream is = new GzipCompressorInputStream(new ByteArrayInputStream(compressed))) {
            return new String(readAllBytes(is), StandardCharsets.UTF_8);
        }
    }

	private byte[] readAllBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[16384];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }
}
