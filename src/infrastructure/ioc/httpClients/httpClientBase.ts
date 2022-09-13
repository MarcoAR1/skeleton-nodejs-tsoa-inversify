import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { injectable } from 'inversify'
import { axiosInstance } from './axiosInstance'

export interface IHttpClientBase {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  post<Data, T>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  put<Data, T>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
}

@injectable()
export class HttpClientBase implements IHttpClientBase {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.get(url, config)
  }
  post<Data, T>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.post(url, data, config)
  }
  put<Data, T>(url: string, data?: Data, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.put(url, data, config)
  }
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.delete(url, config)
  }
}
