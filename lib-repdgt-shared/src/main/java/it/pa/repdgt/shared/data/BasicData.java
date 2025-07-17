package it.pa.repdgt.shared.data;

import java.math.BigDecimal;
public class BasicData {

	protected BigDecimal id;
	protected String codice;
	protected String text;

	public BasicData() {
		super();
	}
	public BasicData(BigDecimal id, String codice, String text) {
		super();
		this.id = id;
		this.codice = codice;
		this.text = text;
	}

	public BigDecimal getId() {
		return id;
	}

	public void setId(BigDecimal id) {
		this.id = id;
	}

	public String getCodice() {
		return codice;
	}

	public void setCodice(String codice) {
		this.codice = codice;
	}

	public void setCodice(BigDecimal codice) {
		this.codice = codice != null ? codice.toString() : null;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	public BasicData(BigDecimal id, BigDecimal codice, String text) {
		this.id = id;
		this.codice = codice != null ? codice.toString() : null;
		this.text = text;

	}

}
