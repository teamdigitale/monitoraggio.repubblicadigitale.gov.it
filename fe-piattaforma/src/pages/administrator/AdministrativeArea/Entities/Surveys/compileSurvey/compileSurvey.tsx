import React, { useEffect, useState } from 'react';
import JsonFormRender from '../components/jsonFormRender';

const CompileSurvey: React.FC = () => {
  const [schemaMock, setSchemaMock] = useState();

  const loadMock = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await import('/mock/jsonformTest.json');
    setSchemaMock(response?.default);
  };

  useEffect(() => {
    loadMock();
  }, []);

  return (
    <div>
      <h1>Compila questionario</h1>
      <JsonFormRender schema={schemaMock} />
    </div>
  );
};

export default CompileSurvey;
