import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

export function configureAuth(oidcConfigService: OidcConfigService): () => Promise<any> {
    return () =>
        oidcConfigService.withConfig({
              stsServer: 'http://localhost:3001/.well-known/openid-configuration',
              redirectUrl: 'http://localhost:4200/auth-callback',
              postLogoutRedirectUri: window.location.origin,
              clientId: 'localhost-angular',
              scope: 'openid email profile offline_access', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: false,
              silentRenewUrl: `${window.location.origin}/silent-renew.html`,
              renewTimeBeforeTokenExpiresInSeconds: 30,
              logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
          });
}

@NgModule({
    imports: [AuthModule.forRoot()],
    exports: [AuthModule],
    providers: [
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService],
            multi: true,
        },
    ],
})
export class AuthConfigModule {}
