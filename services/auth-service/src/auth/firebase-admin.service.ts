import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);

  onModuleInit() {
    if (admin.apps.length > 0) {
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      // Strip wrapping double quotes if they exist and replace escaped newlines
      privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    }

    if (projectId && clientEmail && privateKey) {
      this.logger.log('Initializing Firebase Admin SDK using environment variables');
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        return;
      } catch (err) {
        this.logger.error('Failed to initialize Firebase Admin SDK via env variables:', err);
      }
    }

    // Fallback: Check local firebase-admin.json file
    const rootPath = path.resolve(__dirname, '../../../../firebase-admin.json');
    const envPath = process.env.FIREBASE_ADMIN_SDK_PATH
      ? path.resolve(process.env.FIREBASE_ADMIN_SDK_PATH)
      : null;

    const credentialsPath = envPath && fs.existsSync(envPath) ? envPath : rootPath;

    if (fs.existsSync(credentialsPath)) {
      this.logger.log(`Initializing Firebase Admin SDK with credentials from file: ${credentialsPath}`);
      try {
        admin.initializeApp({
          credential: admin.credential.cert(credentialsPath),
        });
        return;
      } catch (err) {
        this.logger.error(`Failed to initialize Firebase Admin SDK from file ${credentialsPath}:`, err);
      }
    }

    this.logger.warn('No Firebase Admin credentials found in env or file. Trying Application Default Credentials...');
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (err) {
      this.logger.error('Failed to initialize Firebase Admin SDK via ADC:', err);
    }
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(token);
  }
}
