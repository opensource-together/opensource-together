import { Octokit } from 'octokit';
import { SessionRequest } from 'supertokens-node/framework/express';

export interface GithubAuthRequest extends SessionRequest {
  octokit: Octokit;
}
