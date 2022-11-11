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
	
	private String lunOrarioApertura1;
	private String lunOrarioChiusura1;
	private String lunOrarioApertura2;
	private String lunOrarioChiusura2;
	
	private String marOrarioApertura1;
	private String marOrarioChiusura1;
	private String marOrarioApertura2;
	private String marOrarioChiusura2;
	
	private String merOrarioApertura1;
	private String merOrarioChiusura1;
	private String merOrarioApertura2;
	private String merOrarioChiusura2;
	
	private String gioOrarioApertura1;
	private String gioOrarioChiusura1;
	private String gioOrarioApertura2;
	private String gioOrarioChiusura2;
	
	private String venOrarioApertura1;
	private String venOrarioChiusura1;
	private String venOrarioApertura2;
	private String venOrarioChiusura2;
	
	private String sabOrarioApertura1;	
	private String sabOrarioChiusura1;	
	private String sabOrarioApertura2;	
	private String sabOrarioChiusura2;
	
	private String domOrarioApertura1;
	private String domOrarioChiusura1;
	private String domOrarioApertura2;
	private String domOrarioChiusura2;
}