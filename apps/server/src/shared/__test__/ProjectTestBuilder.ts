import { CreateProjectDtoInput } from '@/application/dto/inputs/create-project-inputs.dto';
import { Description } from '@/domain/project/description/description.vo';
import { Link } from '@/domain/project/link/link.vo';
import { Project } from '@/domain/project/project.entity';
import { Title } from '@/domain/project/title/title.vo';
import { TechStack } from '@/domain/techStack/techstack.entity';
import { TechStackFactory } from '@/domain/techStack/techStack.factory';
import { unwrapResult } from '@/shared/test-utils';

export class ProjectTestBuilder {}
