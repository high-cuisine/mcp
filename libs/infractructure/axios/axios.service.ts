import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';

@Injectable()
export class AxiosService {
	private readonly axiosInstance: AxiosInstance;
	private readonly maxAttempts = 3;
	private readonly timeoutMs = 10_000;

	constructor() {
		this.axiosInstance = axios.create({
			headers: {
				'Content-Type': 'application/json',
			},
			validateStatus: (status) => {
				return status < HttpStatus.INTERNAL_SERVER_ERROR;
			},
			timeout: this.timeoutMs,
		});
	}

	private async retryRequest<T>(fn: () => Promise<{ data: T; status: HttpStatus }>): Promise<{ data: T; status: HttpStatus }> {
		let lastError: unknown;

		for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
			try {
				return await fn();
			} catch (err) {
				lastError = err;
				if (attempt === this.maxAttempts) break;
			}
		}

		if (lastError instanceof HttpException) {
			throw lastError;
		}

		if (!lastError) {
			throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const axErr = lastError as AxiosError;

		console.log('[Request Failed]', {
			url: axErr.config?.url,
			method: axErr.config?.method,
			error: axErr.message
		});

		if (axErr.response) {
			const raw = axErr.response.data;
			const payload: string | Record<string, any> =
				raw == null || raw === '' ? '' : typeof raw === 'string' ? raw : (raw as Record<string, any>);

			throw new HttpException(payload, axErr.response.status);
		}

		throw new HttpException(axErr.message || 'Request failed', HttpStatus.REQUEST_TIMEOUT);
	}

	async get<T>(baseUrl: string, path: string, headers?: Record<string, string>): Promise<{ data: T; status: HttpStatus }> {
		return this.retryRequest(async () => {
			const response = await this.axiosInstance.get(`${baseUrl}${path}`, {
				headers,
			});
			return {
				data: response.data,
				status: response.status,
			};
		});
	}

	async post<T>(baseUrl: string, path: string, headers?: Record<string, string>, data?: any): Promise<{ data: T; status: HttpStatus }> {
		return this.retryRequest(async () => {
			const response = await this.axiosInstance.post(`${baseUrl}${path}`, data, { headers });
			return {
				data: response.data,
				status: response.status,
			};
		});
	}

	async put<T>(baseUrl: string, path: string, headers?: Record<string, string>, data?: any): Promise<{ data: T; status: HttpStatus }> {
		return this.retryRequest(async () => {
			const response = await this.axiosInstance.put(`${baseUrl}${path}`, data, {
				headers,
			});
			return {
				data: response.data,
				status: response.status,
			};
		});
	}

	async delete<T>(baseUrl: string, path: string, headers?: Record<string, string>, data?: any): Promise<{ data: T; status: HttpStatus }> {
		return this.retryRequest(async () => {
			const res = await this.axiosInstance.delete(`${baseUrl}${path}`, {
				headers,
				data,
			});
			return { data: res.data, status: res.status };
		});
	}
}
