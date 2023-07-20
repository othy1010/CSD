import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css';
import axios from 'axios';

const SwaggerComponent = () => {
  const [urls, setUrls] = useState<{ name: any; url: string; }[] | null>(null);

  useEffect(() => {
    const getBearerToken = () => {
      let authToken = localStorage.getItem('jhi-authenticationToken') || sessionStorage.getItem('jhi-authenticationToken');
      if (authToken) {
        authToken = JSON.parse(authToken);
        return `Bearer ${authToken}`;
      }
      return null;
    };

    const axiosConfig = {
      timeout: 10000,
      
      headers: { 
      Authorization: getBearerToken() },
    };


    const baseUrl = '/v3/api-docs';

    const fetchUrls = async () => {
      const response = await axios.get('/api/');
      // let swaggerUrls;
      console.log("😒😒😒😒",response);

      // if (Array.isArray(response.data)) {
      //   swaggerUrls = response.data.map(({ group, description }) => ({ name: description, url: `${baseUrl}/${group}` }));
      // } else {
      //   swaggerUrls = [{ name: 'default', url: baseUrl }];
      // }
      
      // swaggerUrls.sort(function (a, b) {
      //   const x = a.name.toLowerCase(),
      //     y = b.name.toLowerCase();
      //   if (x.includes('(default)')) return -1;
      //   if (y.includes('(default)')) return 1;
      //   if (x.includes('(management)')) return -1;
      //   if (y.includes('(management)')) return 1;
      //   return x < y ? -1 : x > y ? 1 : 0;
      // });

      // setUrls(swaggerUrls);
    };

    fetchUrls();
  }, []);

  if (!urls) return <p>Loading...</p>; // or any loading indicator you use
  return (
    <SwaggerUI url="https://petstore3.swagger.io/api/v3/openapi.json" />

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
