package it.pa.repdgt.surveymgmt.components;

import lombok.RequiredArgsConstructor;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public abstract class GenericImportCsvWriter<Model, Header> {

    private final Class<Header> headerClass;

    public ByteArrayOutputStream writeCsv(List<Model> models) {
        String headers = getFields(headerClass);
        return getRaw(models, headers);
    }

    protected String getFields(Class<Header> headerClass) {
        List<String> headers = new ArrayList<>();
        Field[] fields = headerClass.getDeclaredFields();
        for (Field field : fields) {
            headers.add(field.getName());
        }
        return String.join(",", headers);
    }

    protected abstract ByteArrayOutputStream getRaw(List<Model> model, String headers);

}
