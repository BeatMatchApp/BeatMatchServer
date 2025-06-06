import { createProxyMiddleware, loggerPlugin } from 'http-proxy-middleware';
import { RequestHandler } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import https from 'https';

export type ProxyConfig = {
  target: string;
  pathRewriteBase?: string;
  secure?: boolean;
  applyAuth?: boolean;
};

export class BaseProxy {
  protected getProxyConfig(config: ProxyConfig): ProxyConfig {
    return {
      target: config.target,
      pathRewriteBase: config.pathRewriteBase || '',
      secure: config.secure !== undefined ? config.secure : false,
      applyAuth: config.applyAuth !== undefined ? config.applyAuth : false,
    };
  }

  protected createProxyMiddleware(config: ProxyConfig): RequestHandler {
    const { target, pathRewriteBase = '', secure = false } = config;

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      pathRewrite: (path, req) => path.replace(new RegExp(pathRewriteBase), ''),
      plugins: [loggerPlugin],
    });
  }

  public createProxy(config: ProxyConfig): RequestHandler[] {
    const proxyConfig = this.getProxyConfig(config);
    const middlewareStack: RequestHandler[] = [];

    if (proxyConfig.applyAuth) {
      middlewareStack.push(authMiddleware);
    }

    const proxy = this.createProxyMiddleware(proxyConfig);
    middlewareStack.push(proxy);

    return middlewareStack;
  }
}
