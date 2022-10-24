package it.pa.repdgt.opendata.projection;

import java.util.Date;

public interface OpenDataSqlProjection {

	public Long getCountDownload();
	public Long getDimensioneFile();
	public Date getDataPrimoUpload();
	public Date getDataUltimoUpload();
}
