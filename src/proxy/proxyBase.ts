import { createProxyMiddleware, loggerPlugin } from 'http-proxy-middleware';
import {NextFunction, RequestHandler, Request, Response} from 'express';
import authMiddleware from '../middlewares/authMiddleware';

export type ProxyConfig = {
  target: string;
  pathRewriteBase?: string;
  applyAuth?: boolean;
};

export class BaseProxy {
  protected getProxyConfig(config: ProxyConfig): ProxyConfig {
    return {
      target: config.target,
      pathRewriteBase: config.pathRewriteBase || '',
      applyAuth: config.applyAuth !== undefined ? config.applyAuth : false,
    };
  }

    protected createProxyMiddleware(config: ProxyConfig): RequestHandler[] {
        const { target, pathRewriteBase = '', } = config;
        const addCredentialsMiddleware = (req: Request, res: Response, next: NextFunction) => {
            if (req.headers['x-user-credentials']) {
                delete req.headers['x-user-credentials'];
            }

            if (req.userCredentials) {
                req.headers['x-user-credentials'] = JSON.stringify(req.userCredentials);
            }

            next();
        };

        const proxy = createProxyMiddleware({
            target,
            changeOrigin: true,
            secure: false,
            pathRewrite: (path, req) => path.replace(new RegExp(pathRewriteBase), ''),
            plugins: [loggerPlugin]
        });

        return [addCredentialsMiddleware, proxy];
    }

    public createProxy(config: ProxyConfig): RequestHandler[] {
        const proxyConfig = this.getProxyConfig(config);
        const middlewareStack: RequestHandler[] = [];

        if (proxyConfig.applyAuth) {
            middlewareStack.push(authMiddleware);
        }

        const proxyMiddlewares = this.createProxyMiddleware(proxyConfig);
        middlewareStack.push(...proxyMiddlewares);

        return middlewareStack;
    }
}