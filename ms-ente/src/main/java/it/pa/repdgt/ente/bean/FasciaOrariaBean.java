package it.pa.repdgt.ente.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class FasciaOrariaBean {

	private Long idIndirizzoSede;
	
	private String lunOrarioAperutura1;
	
	private String lunOrarioChiusura1;
	private String lunOrarioAperutura2;
	private String lunOrarioChiusura2;
	
	private String marOrarioAperutura1;
	private String marOrarioChiusura1;
	private String marOrarioAperutura2;
	private String marOrarioChiusura2;
	
	private String merOrarioAperutura1;
	private String merOrarioChiusura1;
	private String merOrarioAperutura2;
	private String merOrarioChiusura2;
	
	private String gioOrarioAperutura1;
	private String gioOrarioChiusura1;
	private String gioOrarioAperutura2;
	private String gioOrarioChiusura2;
	
	private String venOrarioAperutura1;
	private String venOrarioChiusura1;
	private String venOrarioAperutura2;
	private String venOrarioChiusura2;
	
	private String sabOrarioAperutura1;	
	private String sabOrarioChiusura1;	
	private String sabOrarioAperutura2;	
	private String sabOrarioChiusura2;
	
	private String domOrarioAperutura1;
	private String domOrarioChiusura1;
	private String domOrarioAperutura2;
	private String domOrarioChiusura2;
}