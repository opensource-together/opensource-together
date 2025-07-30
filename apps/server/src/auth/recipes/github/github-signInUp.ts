import { Result } from '@/libs/result';
import { Logger } from '@nestjs/common';
import { CreateUserCommand } from '@/contexts/user/use-cases/commands/create-user.command';
import { User } from '@/contexts/user/domain/user.entity';
import { DeleteUserCommand } from '@/contexts/user/use-cases/commands/delete-user.command';
import { CreateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/create-user-gh-token.command';
import { deleteUser } from 'supertokens-node';
import { CommandBus } from '@nestjs/cqrs';

interface GithubUserInfo {
  user: {
    login: string;
    id: number;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    location: string | null;
    company: string | null;
    html_url: string;
    twitter_username: string | null;
    blog: string | null;
  };
}
export async function handleGithubSignUp(
  userInfo: {
    id: string;
    email: string;
    githubUser: GithubUserInfo['user'];
    response: Partial<{
      oAuthTokens: {
        access_token: string;
      };
    }>;
  },
  commandBus: CommandBus,
): Promise<void> {
  //   if (response.status === 'OK') {
  //     const githubUserInfo = response.rawUserInfoFromProvider.fromUserInfoAPI as
  //       | GithubUserInfo
  //       | undefined;

  //     if (!githubUserInfo?.user) {
  //       if (response.createdNewRecipeUser) {
  //         await deleteUser(response.user.id);
  //       }
  //       throw new Error('Failed to retrieve user information from GitHub.');
  //     }
  //     const { user: githubUser } = githubUserInfo;
  //     const { id, emails } = response.user;
  //     if (response.createdNewRecipeUser) {
  const { id, email, githubUser, response } = userInfo;
  try {
    const createUserCommand = new CreateUserCommand({
      id,
      username: githubUser.login,
      email: email,
      name: githubUser.name || githubUser.login,
      login: githubUser.login,
      avatarUrl: githubUser.avatar_url,
      bio: githubUser.bio ?? '',
    });

    const socialLinksData: { type: string; url: string }[] = [];
    if (githubUser.html_url) {
      socialLinksData.push({
        type: 'github',
        url: githubUser.html_url,
      });
    }
    if (githubUser.twitter_username) {
      socialLinksData.push({
        type: 'twitter',
        url: `https://x.com/${githubUser.twitter_username}`,
      });
    }
    if (githubUser.blog) {
      socialLinksData.push({
        type: 'website',
        url: githubUser.blog,
      });
    }

    const newUserResult: Result<User> =
      await commandBus.execute(createUserCommand);
    if (!newUserResult.success) {
      Logger.log({ newUserResult });
      await commandBus.execute(new DeleteUserCommand(id));

      await deleteUser(id);
      throw new Error(newUserResult.error);
    }

    const accessToken = response?.oAuthTokens?.access_token;
    if (typeof accessToken !== 'string') {
      throw new Error('Invalid GitHub access token received');
    }

    const createUserGhTokenCommand = new CreateUserGhTokenCommand({
      userId: id,
      githubUserId: String(githubUser.id),
      githubAccessToken: accessToken,
    });
    await commandBus.execute(createUserGhTokenCommand);
  } catch (error) {
    Logger.error('Error during sign up process:', error);
    await deleteUser(id);
  }
}
