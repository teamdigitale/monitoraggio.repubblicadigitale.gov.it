package it.pa.repdgt.estrazione.collection.payload;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Deserializer che normalizza le tre varianti dell'elemento "properties":
 * stringa Python-dict, oggetto JSON valido, oggetto Python-dict.
 */
public class RispostaDomandaDeserializer extends JsonDeserializer<RispostaDomanda> {

	private static final ObjectMapper TOLERANT_MAPPER = new ObjectMapper()
			.configure(JsonReadFeature.ALLOW_SINGLE_QUOTES.mappedFeature(), true)
			.configure(JsonReadFeature.ALLOW_UNQUOTED_FIELD_NAMES.mappedFeature(), true);

	@Override
	public RispostaDomanda deserialize(JsonParser parser, DeserializationContext ctx) throws IOException {
		JsonNode node = parser.readValueAsTree();
		if (node == null || node.isNull()) {
			return null;
		}
		if (node.isTextual()) {
			return fromObjectNode(parseTolerant(node.asText()));
		}
		if (node.isObject()) {
			return fromObjectNode(node);
		}
		return null;
	}

	private static RispostaDomanda fromObjectNode(JsonNode node) {
		if (node == null || !node.isObject()) {
			return null;
		}
		Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
		if (!fields.hasNext()) {
			return null;
		}
		Map.Entry<String, JsonNode> entry = fields.next();
		String codice = entry.getKey();
		JsonNode valuesNode = entry.getValue();
		List<String> valori = new ArrayList<>();
		if (valuesNode != null && valuesNode.isArray()) {
			for (JsonNode v : valuesNode) {
				valori.add(v.isNull() ? null : v.asText());
			}
		} else if (valuesNode != null && !valuesNode.isNull()) {
			valori.add(valuesNode.asText());
		}
		return new RispostaDomanda(codice, valori);
	}

	private static JsonNode parseTolerant(String raw) throws JsonProcessingException {
		return TOLERANT_MAPPER.readTree(raw);
	}
}
