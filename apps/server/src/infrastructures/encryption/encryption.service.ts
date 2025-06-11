import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptionServicePort } from '@/application/encryption/ports/encryption.service.port';
import { Result } from '@/shared/result';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService implements EncryptionServicePort {
  private readonly encryptionKey: Buffer;
  private readonly algorithm = 'aes-256-gcm';
  private readonly ivLength = 16;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      throw new Error(
        "ENCRYPTION_KEY est requis dans les variables d'environnement",
      );
    }
    this.encryptionKey = Buffer.from(key, 'hex');
  }

  encrypt(plaintext: string): Result<string, string> {
    try {
      if (!plaintext) return Result.ok('');

      // Générer un IV aléatoire
      const iv = crypto.randomBytes(this.ivLength);

      // Créer le chiffreur
      const cipher = crypto.createCipheriv(
        this.algorithm,
        this.encryptionKey,
        iv,
      );

      // Chiffrer
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Récupérer le tag d'authentification
      const tag = cipher.getAuthTag();

      // Concaténer les éléments sous forme hexadécimale
      const result = `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
      return Result.ok(result);
    } catch (error) {
      console.error('Erreur de chiffrement:', error);
      return Result.fail('Erreur lors du chiffrement des données');
    }
  }

  decrypt(ciphertext: string): Result<string, string> {
    try {
      if (!ciphertext) return Result.ok('');

      // Décomposer les données chiffrées
      const parts = ciphertext.split(':');
      if (parts.length !== 3) {
        return Result.fail('Format de données chiffrées invalide');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const tag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      // Créer le déchiffreur
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.encryptionKey,
        iv,
      );
      decipher.setAuthTag(tag);

      // Déchiffrer
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return Result.ok(decrypted);
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      return Result.fail('Erreur lors du déchiffrement des données');
    }
  }
}
