# 📧 Service de Mailing

Service transversal pour l'envoi d'e-mails transactionnels via **Resend**.

## 🚀 Utilisation rapide

### 1. Injection du service

```typescript
import { Inject } from '@nestjs/common';
import {
  MAILING_SERVICE_PORT,
  MailingServicePort,
} from '@/mailing/ports/mailing.service.port';

@Injectable()
export class WelcomeUserCommandHandler {
  constructor(
    @Inject(MAILING_SERVICE_PORT)
    private readonly mailingService: MailingServicePort,
  ) {}

  async execute(command: WelcomeUserCommand): Promise<Result<void, string>> {
    const result = await this.mailingService.sendEmail({
      to: command.userEmail,
      subject: 'Bienvenue sur OpenSource Together ! 🎉',
      html: `<h1>Salut ${command.username} !</h1><p>Ravi de t'accueillir...</p>`,
      text: `Salut ${command.username} ! Ravi de t'accueillir...`,
    });

    if (!result.success) {
      return Result.fail('WELCOME_EMAIL_FAILED');
    }

    return Result.ok(undefined);
  }
}
```

### 2. Interface du service

```typescript
interface SendEmailPayload {
  to: string; // destinataire
  subject: string; // objet du mail
  html: string; // contenu HTML
  text?: string; // version texte (optionnel)
  from?: string; // expéditeur (défaut: RESEND_FROM)
}

// Retourne toujours un Result<void, string>
await mailingService.sendEmail(payload);
```

## ⚙️ Configuration

Ajouter dans `.env` :

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM="OpenSource Together <noreply@opensourcetogether.dev>"
```

> **Note** : Le module est `@Global()`, aucun import supplémentaire requis.

## 📮 Cas d'usage principaux

| Événement               | Déclencheur                   | Template suggéré                       |
| ----------------------- | ----------------------------- | -------------------------------------- |
| **Bienvenue**           | Inscription utilisateur       | Présentation plateforme + premiers pas |
| **Invitation projet**   | Propriétaire invite un membre | Détails projet + lien d'acceptation    |
| **Reset password**      | Demande de réinitialisation   | Lien sécurisé + expiration             |
| **Candidature reçue**   | Soumission candidature        | Confirmation + prochaines étapes       |
| **Candidature envoyée** | Réponse du propriétaire       | Acceptation/refus + feedback           |

## 🔧 Bonnes pratiques

- ✅ **Toujours fournir `text`** en plus de `html` (accessibilité)
- ✅ **Gérer les échecs** : le service retourne `Result.fail('MAIL_SEND_FAILED')`
- ✅ **Contenu statique** : le service ne gère pas les templates (déléguer à l'appelant)
- ⚠️ **Pas de retry automatique** : implémenter côté use-case si nécessaire

## 🔄 Gestion d'erreurs

```typescript
const result = await mailingService.sendEmail(payload);

if (!result.success) {
  this.logger.error(`Failed to send email: ${result.error}`);
  // Stratégie de fallback ou notification admin
  return Result.fail('EMAIL_DELIVERY_FAILED');
}
```

---
