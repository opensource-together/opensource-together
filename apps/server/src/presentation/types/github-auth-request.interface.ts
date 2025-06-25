import { Octokit } from '@octokit/rest';
import { SessionRequest } from 'supertokens-node/framework/express';

export interface GithubAuthRequest extends SessionRequest {
  octokit: Octokit;
}
