export class CreateTeamMemberCommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly projectRoleId: string,
  ) {}
}
