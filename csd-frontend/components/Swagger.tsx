import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css';
import axios from 'axios';

const SwaggerComponent = async () => {
  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTY5Mjc3NDk5OX0.EgO19TbAeCkYPoG8lHFhAPxgHLJkvjpVSUW2IC6OBmWuce--OvNw-nfELthnRdUcKBUIsfIieRDDpvKdOILyxA';
  // const config = {
  //   headers: { Authorization: `Bearer ${token}` }
  // };
  // const api = await axios.get('/api-docs/springdocDefault', config);
  // console.log("👌",api);
  // const getBearerToken = () => {
    
  //   return token;
  // };
  return (
    // <SwaggerUI url="https://petstore3.swagger.io/api/v3/openapi.json" />
    <div className='bg-white rounded-lg shadow-lg p-4 mb-4'>	
  <SwaggerUI url={'/api-docs/springdocDefault'}
       deepLinking={true}
          docExpansion={'none'}
          defaultModelsExpandDepth={-1}
          requestInterceptor={(req) => {
            req.headers['Authorization'] = token;
            if (req.method === 'GET' && req.body === '{"additionalProp1":"string","additionalProp2":"string","additionalProp3":"string"}') {
              req.body = undefined;
            }
            return req;
          }}
        /> </div>
    // <SwaggerUI 
    //   url="https://petstore.swagger.io/v2/swagger.json"
    //   deepLinking={true} 
    //   filter={true}
    //   defaultModelExpandDepth={-1}
    //   withCredentials={true}
    //   docExpansion='none'
    //   requestInterceptor={(req) => {
    //     let authToken = localStorage.getItem('jhi-authenticationToken') || sessionStorage.getItem('jhi-authenticationToken');
    //     if (authToken) {
    //       authToken = JSON.parse(authToken);
    //       req.headers['Authorization'] = `Bearer ${authToken}`;
    //     }
    //     return req;
    //   }}
    // />
  );
};

export default SwaggerComponent;
