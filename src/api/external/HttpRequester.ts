import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {logger} from "../../utils/container/container";

export class HttpRequester {
    /**
     * Makes a GET request to the specified URL with optional parameters.
     *
     * @param url - The URL to send the GET request to.
     * @param params - Optional parameters to include in the GET request.
     * @param catchFunction - Function to handle any errors that occur during the request.
     * @param extractFunction - Function to extract and return the desired data from the response.
     * @returns A promise that resolves with the extracted data.
     */
    public getToUrl = async <T>(
        url: string,
        params: AxiosRequestConfig<any> | undefined,
        catchFunction: (error: any) => void,
        extractFunction: (response: void | AxiosResponse<any, any>) => T
    ): Promise<T> => {
        // ? Logea la request que se va a hacer junto con su ID unico
        const requestId = this.getRequestUniqueId();
        logger.logDebugFromEntity(`Attempting HTTP request...
                                   ID: ${requestId}
                                   Verb: GET
                                   URL: ${url}
                                   Params: ${params}`
            , this.constructor);

        // ? Obtiene una response en caso de que haya ido ok, en caso de error lo catchea y handlea
        const response = await axios.get(url, params).catch(e => {
            logger.logDebugFromEntity(`Attempt HTTP request
                                        ID: ${requestId}
                                        URL: ${url}
                                        Status: ${e.response?.status}
                                        Result: FAILED`
                , this.constructor);
            catchFunction(e)
        });

        // ? Logea resultado exitoso
        logger.logDebugFromEntity(`Attempt HTTP request
                                        ID: ${requestId}
                                        URL: ${url}
                                        Status: ${response?.status}
                                        Result: SUCCESS`
                , this.constructor);

        // ? Extrae y devuelve el resultado
        return extractFunction(response);
    }

    /**
     * Makes a POST request to the specified URL with the provided data and optional parameters.
     *
     * @param url - The URL to send the POST request to.
     * @param data - The data to include in the POST request.
     * @param catchFunction - Function to handle any errors that occur during the request.
     * @param params - Optional parameters to include in the POST request.
     * @param extractFunction - Optional function to extract and return the desired data from the response.
     * @returns A promise that resolves with the extracted data or undefined if no extractFunction is provided.
     */
    public postToUrl = async <T>(
        url: string,
        data: any,
        catchFunction: (error: any) => void,
        params?: AxiosRequestConfig<any>,
        extractFunction?: (response: void | AxiosResponse<any, any>) => T
    ): Promise<T | void> => {
            // ? Logea la request que se va a hacer junto con su ID unico
            const requestId = this.getRequestUniqueId();
            logger.logDebugFromEntity(`Attempting HTTP request...
                                    ID: ${requestId}
                                    Verb: POST
                                    URL: ${url}
                                    Params: ${params}
                                    Data: ${data}`
                , this.constructor);

            // ? Obtiene una response en caso de que haya ido ok, en caso de error lo catchea y handlea
            const response = await axios.post(url, data, params).catch(e => {
                logger.logDebugFromEntity(`Attempt HTTP request
                                            ID: ${requestId}
                                            URL: ${url}
                                            Status: ${e.response?.status}
                                            Result: FAILED`
                    , this.constructor);
                catchFunction(e)
            });

            // ? Logea resultado exitoso
            logger.logDebugFromEntity(`Attempt HTTP request
                                            ID: ${requestId}
                                            URL: ${url}
                                            Status: ${response?.status}
                                            Result: SUCCESS`
                    , this.constructor);

            // ? Extrae y devuelve el resultado, si es que llego una funcion extractora. Caso contrario, devuelve undefinied.
            return extractFunction ? extractFunction(response) : undefined;
    }

    /**
     * Generates a unique ID for the HTTP request.
     *
     * @returns A string representing the unique ID.
     */
    private getRequestUniqueId = (): string => {
        return new Date().toISOString();
    }
}